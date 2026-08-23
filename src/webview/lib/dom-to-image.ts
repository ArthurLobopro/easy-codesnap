/**
 * dom-to-png.ts
 *
 * Reescrita otimizada do fluxo "node -> PNG" de bibliotecas como dom-to-image.
 *
 * Problemas do código original que este arquivo resolve:
 *   1. Clonagem de filhos era sequencial (Promise encadeada em .forEach) -> agora síncrona
 *      (makeNodeCopy/processElementClone não fazem nenhum I/O real; envolver isso em
 *      Promise.all só adicionava overhead de scheduling de microtasks sem paralelismo
 *      de fato, já que não há nada para sobrepor em trabalho síncrono)
 *   2. Inlining de url(...) em CSS era sequencial -> agora Promise.all
 *   3. getComputedStyle chamado sem necessidade / sem cache -> WeakMap de cache por nó
 *      + pseudo-elementos agora são opcionais (includePseudoElements)
 *   4. Nenhum cache/deduplicação de recursos (imagens/fontes baixadas repetidas vezes)
 *      -> ResourceCache com Promise compartilhada por URL
 *   5. delay(100) fixo em toda renderização -> substituído por image.decode()
 *   6. Fontes (@font-face) resolvidas do zero a cada chamada -> cache por Document
 *   7. toDataURL de canvas grande bloqueando a thread -> mantido (é inerentemente síncrono
 *      na API do browser), mas isolado e documentado; feito só quando necessário
 *   8. width/height recalculando estilo computado repetidamente -> memoizados por render
 *
 * Instrumentação: passe `{ profile: true }` para medir cada etapa interna
 * (cloneNode, resolveFontFaces, inlineImages, decodeImage, drawCanvas, etc.)
 * via performance.mark/measure. O resultado é impresso com console.table por
 * padrão, ou entregue via `onProfile(entries)` para uso programático. Isso
 * serve para descobrir ONDE o tempo está indo de fato — em árvores sem
 * recursos remotos, paralelizar promises não reduz trabalho síncrono de
 * layout/reflow (getComputedStyle) nem a rasterização do <foreignObject>,
 * que costumam ser os verdadeiros gargalos.
 */

// ---------------------------------------------------------------------------
// Tipos
// ---------------------------------------------------------------------------

export interface ExportOptions {
  /** Retorna true se o nó deve ser incluído (e portanto seus filhos também). */
  filter?: (node: Node) => boolean;
  /** Cor de fundo do canvas final. */
  bgcolor?: string;
  /** Largura forçada (px). */
  width?: number;
  /** Altura forçada (px). */
  height?: number;
  /** Estilos extras aplicados ao clone raiz antes de renderizar. */
  style?: Partial<CSSStyleDeclaration>;
  /** Fator de escala do canvas (ex: 2 para telas retina). */
  scale?: number;
  /** Data URL usada como placeholder quando um recurso falha ao carregar. */
  imagePlaceholder?: string;
  /** Bypassa cache HTTP anexando timestamp na URL. */
  cacheBust?: boolean;
  /** Usa credenciais (cookies) em requests CORS. */
  useCredentials?: boolean;
  /** Clona pseudo-elementos ::before/::after. Custa 2 getComputedStyle extras por nó. */
  includePseudoElements?: boolean;
  /**
   * Remove dos descendentes as propriedades naturalmente herdáveis que já têm
   * o mesmo valor computado no pai. Desligado por padrão para facilitar
   * comparação de tamanho e desempenho com a serialização completa.
   */
  pruneInheritedStyles?: boolean;
  /**
   * Chamado com o nó clonado (raiz), logo após a clonagem e antes de embutir
   * fontes/imagens. Permite ajustar o clone (ex: remover elementos, mexer em
   * estilos) antes da rasterização. Pode ser síncrono ou retornar uma Promise.
   */
  postProcess?: (clone: HTMLElement) => void | Promise<void>;
  /** Cache de recursos (imagens/fontes) compartilhável entre múltiplas chamadas. */
  resourceCache?: ResourceCache;
  /** Timeout em ms para fetch de recursos externos. */
  fetchTimeoutMs?: number;
  /**
   * Ativa instrumentação com a Performance API (marks/measures) nas etapas
   * internas do render, para diagnosticar onde o tempo realmente está sendo
   * gasto (clonagem, fontes, inlining de imagens, decode do SVG, desenho no
   * canvas), além da quantidade de elementos clonados. Desligado por padrão
   * pois marks/measures têm custo, ainda que pequeno. Veja também `onProfile`.
   */
  profile?: boolean;
  /**
   * Chamado com as medições coletadas (quando `profile: true`), ordenadas da
   * etapa mais lenta para a mais rápida, mais estatísticas adicionais (ex:
   * quantidade de elementos clonados). Se omitido, o resultado é apenas
   * impresso via `console.table`/`console.log`.
   */
  onProfile?: (entries: ProfileEntry[], stats: ProfileStats) => void;
}

export interface ProfileEntry {
  step: string;
  durationMs: number;
}

export interface ProfileStats {
  /** Quantidade de Elements (não Text/Comment) efetivamente clonados neste render. */
  clonedElementCount: number;
}

interface RenderContext {
  options: Required<
    Pick<
      ExportOptions,
      'cacheBust' | 'useCredentials' | 'includePseudoElements' | 'pruneInheritedStyles' | 'fetchTimeoutMs'
    >
  > &
    ExportOptions;
  resourceCache: ResourceCache;
  /** Memoiza getComputedStyle(node) dentro de UM único render (evita recomputo). */
  styleCache: WeakMap<Element, CSSStyleDeclaration>;
  /** Memoiza as propriedades que precisam ser serializadas para cada elemento. */
  serializableStylePropertiesCache: WeakMap<Element, readonly string[]>;
  /** Memoiza width/height calculados dentro de UM único render. */
  sizeCache: WeakMap<Node, { width: number; height: number }>;
  /** Prefixo único desta chamada de render, usado para nomear marks/measures. Undefined = profiling desligado. */
  runId?: string;
  /** Contador de Elements (não Text/Comment) efetivamente clonados neste render. */
  clonedElementCount: number;
}

// ---------------------------------------------------------------------------
// Cache de recursos (dedupe de downloads/base64) — problema #4
// ---------------------------------------------------------------------------

export class ResourceCache {
  private inflight = new Map<string, Promise<string>>();

  /** Retorna a promise já em andamento para essa URL, ou cria uma nova via `fetcher`. */
  getOrFetch(url: string, fetcher: () => Promise<string>): Promise<string> {
    const cached = this.inflight.get(url);
    if (cached) return cached;

    const promise = fetcher().catch((err) => {
      // não deixa entrada quebrada presa no cache
      this.inflight.delete(url);
      throw err;
    });
    this.inflight.set(url, promise);
    return promise;
  }

  clear(): void {
    this.inflight.clear();
  }
}

// Cache de fontes (@font-face) por Document — problema #6.
// Diferente do ResourceCache de imagens, este é de vida mais longa (fontes raramente mudam).
const fontFaceCache = new WeakMap<Document, Promise<string>>();

// ---------------------------------------------------------------------------
// Instrumentação de performance (opt-in via options.profile)
// ---------------------------------------------------------------------------

/** Envolve uma etapa assíncrona com performance.mark/measure, se profiling estiver ligado. */
async function timed<T>(ctx: RenderContext, step: string, fn: () => Promise<T>): Promise<T> {
  if (!ctx.runId) return fn();

  const startMark = `${ctx.runId}:${step}:start`;
  const endMark = `${ctx.runId}:${step}:end`;
  performance.mark(startMark);
  try {
    return await fn();
  } finally {
    performance.mark(endMark);
    performance.measure(`${ctx.runId}:${step}`, startMark, endMark);
  }
}

/** Versão síncrona de `timed`, para trechos que não retornam Promise (ex: desenho no canvas). */
function timedSync<T>(ctx: RenderContext, step: string, fn: () => T): T {
  if (!ctx.runId) return fn();

  const startMark = `${ctx.runId}:${step}:start`;
  const endMark = `${ctx.runId}:${step}:end`;
  performance.mark(startMark);
  try {
    return fn();
  } finally {
    performance.mark(endMark);
    performance.measure(`${ctx.runId}:${step}`, startMark, endMark);
  }
}

/** Coleta todas as measures de um runId, reporta (via callback ou console.table) e limpa a Performance timeline. */
function flushProfile(ctx: RenderContext, onProfile?: ExportOptions['onProfile']): void {
  if (!ctx.runId) return;
  const runId = ctx.runId;

  const entries: ProfileEntry[] = performance
    .getEntriesByType('measure')
    .filter((entry) => entry.name.startsWith(`${runId}:`))
    .map((entry) => ({ step: entry.name.slice(runId.length + 1), durationMs: Math.round(entry.duration * 100) / 100 }))
    .sort((a, b) => b.durationMs - a.durationMs);

  const stats: ProfileStats = { clonedElementCount: ctx.clonedElementCount };

  if (onProfile) {
    onProfile(entries, stats);
  } else {
    if (entries.length > 0) console.table(entries);
    console.log(`Elementos clonados: ${stats.clonedElementCount}`);
  }

  // Evita acumular marks/measures na timeline do browser em uso prolongado.
  for (const entry of performance.getEntriesByType('mark')) {
    if (entry.name.startsWith(`${runId}:`)) performance.clearMarks(entry.name);
  }
  for (const entry of performance.getEntriesByType('measure')) {
    if (entry.name.startsWith(`${runId}:`)) performance.clearMeasures(entry.name);
  }
}

function makeRunId(): string {
  return `dom-to-png-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;
}

// ---------------------------------------------------------------------------
// Utilitários puros
// ---------------------------------------------------------------------------

const MIME_TYPES: Record<string, string> = {
  woff: 'application/font-woff',
  woff2: 'application/font-woff',
  ttf: 'application/font-truetype',
  eot: 'application/vnd.ms-fontobject',
  png: 'image/png',
  jpg: 'image/jpeg',
  jpeg: 'image/jpeg',
  gif: 'image/gif',
  svg: 'image/svg+xml',
};

function parseExtension(url: string): string {
  const match = /\.([^./]*?)(\?|$)/u.exec(url);
  return match ? match[1] : '';
}

function mimeType(url: string): string {
  return MIME_TYPES[parseExtension(url).toLowerCase()] ?? '';
}

function isDataUrl(url: string): boolean {
  return /^data:/u.test(url);
}

function dataAsUrl(base64: string, type: string): string {
  return `data:${type};base64,${base64}`;
}

function escapeXhtml(xml: string): string {
  return xml.replace(/#/gu, '%23').replace(/\n/gu, '%0A');
}

function escapeRegex(str: string): string {
  return str.replace(/([.*+?^${}()|[\]/\\])/gu, '\\$1');
}

function resolveUrl(url: string, baseUrl: string): string {
  const doc = document.implementation.createHTMLDocument();
  const base = doc.createElement('base');
  doc.head.appendChild(base);
  const a = doc.createElement('a');
  doc.body.appendChild(a);
  base.href = baseUrl;
  a.href = url;
  return a.href;
}

/** Busca um recurso remoto e devolve o conteúdo em base64, com timeout e placeholder. */
async function fetchAndEncode(url: string, ctx: RenderContext): Promise<string> {
  const { cacheBust, useCredentials, imagePlaceholder, fetchTimeoutMs } = ctx.options;
  const finalUrl = cacheBust ? url + (/\?/u.test(url) ? '&' : '?') + Date.now() : url;

  const placeholderBase64 = imagePlaceholder?.split(',')[1];

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), fetchTimeoutMs);

  try {
    const response = await fetch(finalUrl, {
      credentials: useCredentials ? 'include' : 'same-origin',
      signal: controller.signal,
    });

    if (!response.ok) {
      if (placeholderBase64) return placeholderBase64;
      throw new Error(`cannot fetch resource: ${url}, status: ${response.status}`);
    }

    const blob = await response.blob();
    return await blobToBase64(blob);
  } catch (err) {
    if (placeholderBase64) return placeholderBase64;
    console.error(err);
    return '';
  } finally {
    clearTimeout(timeout);
  }
}

function blobToBase64(blob: Blob): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => resolve((reader.result as string).split(',')[1]);
    reader.onerror = reject;
    reader.readAsDataURL(blob);
  });
}

/** Cria uma HTMLImageElement e espera decodificação real (substitui o delay(100) fixo). */
async function loadImage(uri: string, useCredentials: boolean): Promise<HTMLImageElement | undefined> {
  if (uri === 'data:,') return undefined;

  const image = new Image();
  if (useCredentials) image.crossOrigin = 'use-credentials';
  image.src = uri;

  // decode() resolve assim que os pixels estão prontos para desenhar —
  // muito mais preciso e rápido que um setTimeout arbitrário.
  if (typeof image.decode === 'function') {
    await image.decode();
  } else {
    await new Promise<void>((resolve, reject) => {
      image.addEventListener('load', () => resolve());
      image.addEventListener('error', reject);
    });
  }
  return image;
}

// Memoização de width/height dentro de UM render — problema #8.
function measure(node: Element, ctx: RenderContext): { width: number; height: number } {
  const cached = ctx.sizeCache.get(node);
  if (cached) return cached;

  const style = getCachedComputedStyle(node, ctx);
  const px = (prop: string) => parseFloat(style.getPropertyValue(prop).replace('px', '')) || 0;

  const result = {
    width: node.scrollWidth + px('border-left-width') + px('border-right-width'),
    height: node.scrollHeight + px('border-top-width') + px('border-bottom-width'),
  };
  ctx.sizeCache.set(node, result);
  return result;
}

function getCachedComputedStyle(node: Element, ctx: RenderContext): CSSStyleDeclaration {
  const cached = ctx.styleCache.get(node);
  if (cached) return cached;
  const style = window.getComputedStyle(node);
  ctx.styleCache.set(node, style);
  return style;
}

// Propriedades naturalmente herdáveis segundo CSS e SVG. Só elas podem ser
// omitidas com segurança: propriedades não herdáveis iguais às do pai podem
// depender de uma regra que não existe no documento serializado.
const INHERITED_STYLE_PROPERTIES = new Set([
  'accent-color',
  'baseline-shift',
  'border-collapse',
  'border-spacing',
  'caption-side',
  'caret-color',
  'color',
  'color-interpolation',
  'color-rendering',
  'color-scheme',
  'cursor',
  'direction',
  'dominant-baseline',
  'empty-cells',
  'fill',
  'fill-opacity',
  'fill-rule',
  'font-family',
  'font-feature-settings',
  'font-kerning',
  'font-language-override',
  'font-optical-sizing',
  'font-palette',
  'font-size',
  'font-size-adjust',
  'font-stretch',
  'font-style',
  'font-synthesis',
  'font-variant',
  'font-variant-alternates',
  'font-variant-caps',
  'font-variant-east-asian',
  'font-variant-emoji',
  'font-variant-ligatures',
  'font-variant-numeric',
  'font-variant-position',
  'font-weight',
  'glyph-orientation-horizontal',
  'glyph-orientation-vertical',
  'hanging-punctuation',
  'hyphenate-character',
  'hyphens',
  'image-rendering',
  'letter-spacing',
  'lighting-color',
  'line-height',
  'list-style-image',
  'list-style-position',
  'list-style-type',
  'marker-end',
  'marker-mid',
  'marker-start',
  'math-depth',
  'math-shift',
  'math-style',
  'orphans',
  'overflow-wrap',
  'paint-order',
  'pointer-events',
  'quotes',
  'shape-rendering',
  'stop-color',
  'stop-opacity',
  'stroke',
  'stroke-dasharray',
  'stroke-dashoffset',
  'stroke-linecap',
  'stroke-linejoin',
  'stroke-miterlimit',
  'stroke-opacity',
  'stroke-width',
  'text-align',
  'text-align-last',
  'text-anchor',
  'text-combine-upright',
  'text-emphasis-color',
  'text-emphasis-position',
  'text-emphasis-style',
  'text-indent',
  'text-justify',
  'text-orientation',
  'text-rendering',
  'text-shadow',
  'text-spacing-trim',
  'text-transform',
  'text-underline-position',
  'text-wrap-mode',
  'text-wrap-style',
  'white-space-collapse',
  'visibility',
  'white-space',
  'word-break',
  'word-spacing',
  'writing-mode',
  'widows',
]);

function isNaturallyInheritedProperty(name: string): boolean {
  return INHERITED_STYLE_PROPERTIES.has(name);
}

function getSerializableStyleProperties(original: Element, isRoot: boolean, ctx: RenderContext): readonly string[] {
  const cached = ctx.serializableStylePropertiesCache.get(original);
  if (cached) return cached;

  const source = getCachedComputedStyle(original, ctx);
  const properties = Array.from(source);
  const parent = original.parentElement;
  if (!ctx.options.pruneInheritedStyles || isRoot || !parent) {
    ctx.serializableStylePropertiesCache.set(original, properties);
    return properties;
  }

  const parentStyle = getCachedComputedStyle(parent, ctx);
  const serializable = properties.filter(
    (name) => !isNaturallyInheritedProperty(name) || source.getPropertyValue(name) !== parentStyle.getPropertyValue(name)
  );
  ctx.serializableStylePropertiesCache.set(original, serializable);
  return serializable;
}

const URL_REGEX = /url\(['"]?([^'"]+?)['"]?\)/gu;

function extractUrls(cssText: string): string[] {
  const urls: string[] = [];
  let match: RegExpExecArray | null;
  URL_REGEX.lastIndex = 0;
  while ((match = URL_REGEX.exec(cssText)) !== null) {
    if (!isDataUrl(match[1])) urls.push(match[1]);
  }
  return urls;
}

async function inlineCssUrls(cssText: string, baseUrl: string | undefined, ctx: RenderContext): Promise<string> {
  const urls = extractUrls(cssText);
  if (urls.length === 0) return cssText;

  // Todas as URLs desse trecho de CSS são resolvidas EM PARALELO,
  // e cada URL usa o ResourceCache para não baixar o mesmo recurso duas vezes.
  const replacements = await Promise.all(
    urls.map(async (url) => {
      const resolved = baseUrl ? resolveUrl(url, baseUrl) : url;
      const base64 = await ctx.resourceCache.getOrFetch(resolved, () => fetchAndEncode(resolved, ctx));
      return { url, dataUrl: dataAsUrl(base64, mimeType(url)) };
    })
  );

  let result = cssText;
  for (const { url, dataUrl } of replacements) {
    const pattern = new RegExp(`(url\\(['"]?)(${escapeRegex(url)})(['"]?\\))`, 'gu');
    result = result.replace(pattern, `$1${dataUrl}$3`);
  }
  return result;
}

async function resolveFontFaces(doc: Document, ctx: RenderContext): Promise<string> {
  const cached = fontFaceCache.get(doc);
  if (cached) return cached;

  const promise = (async () => {
    const rules: CSSFontFaceRule[] = [];
    for (const sheet of Array.from(doc.styleSheets)) {
      try {
        for (const rule of Array.from(sheet.cssRules ?? [])) {
          if (rule.type === CSSRule.FONT_FACE_RULE && extractUrls((rule as CSSFontFaceRule).style.getPropertyValue('src')).length > 0) {
            rules.push(rule as CSSFontFaceRule);
          }
        }
      } catch (e) {
        console.log(`Error reading CSS rules from ${sheet.href}`, e);
      }
    }

    const cssTexts = await Promise.all(
      rules.map((rule) => inlineCssUrls(rule.cssText, (rule.parentStyleSheet ?? {}).href ?? undefined, ctx))
    );
    return cssTexts.join('\n');
  })();

  fontFaceCache.set(doc, promise);
  return promise;
}

// Clonagem da árvore — puramente síncrona. `makeNodeCopy` e `processElementClone`
// (e tudo que eles chamam: cloneNode nativo, getComputedStyle, manipulação de
// atributos/estilos) não fazem nenhum I/O real, então não há nada a "paralelizar"
// aqui: usar async/Promise.all só adicionava overhead de agendamento de microtasks
// nó a nó, sem ganho de performance (JS é single-threaded).
function cloneNode(node: Node, ctx: RenderContext, isRoot = false): Node | undefined {
  if (!isRoot && ctx.options.filter && !ctx.options.filter(node)) return undefined;

  const clone = makeNodeCopy(node);
  if (clone instanceof Element) ctx.clonedElementCount++;

  if (node.childNodes.length > 0) {
    for (const child of Array.from(node.childNodes)) {
      const childClone = cloneNode(child, ctx);
      if (childClone) clone.appendChild(childClone);
    }
  }

  if (clone instanceof Element && node instanceof Element) {
    processElementClone(node, clone, ctx, isRoot);
  }

  return clone;
}

function makeNodeCopy(node: Node): Node {
  if (node instanceof HTMLCanvasElement) {
    // toDataURL é síncrono por natureza da API do browser; não há como paralelizar
    // isso, mas isolamos a chamada para não bloquear o resto da árvore desnecessariamente.
    const image = new Image();
    image.src = node.toDataURL();
    return image;
  }
  return node.cloneNode(false);
}

function processElementClone(original: Element, clone: Element, ctx: RenderContext, isRoot: boolean): void {
  copyComputedStyle(original, clone, ctx, isRoot);

  if (ctx.options.includePseudoElements) {
    clonePseudoElements(original, clone, ctx);
  }

  copyUserInput(original, clone);
  fixSvg(clone);
}

function copyComputedStyle(original: Element, clone: Element, ctx: RenderContext, isRoot: boolean): void {
  const source = getCachedComputedStyle(original, ctx);
  if (!ctx.options.pruneInheritedStyles && source.cssText) {
    clone.setAttribute('style', source.cssText);
  } else {
    for (const name of getSerializableStyleProperties(original, isRoot, ctx)) {
      (clone as HTMLElement).style.setProperty(name, source.getPropertyValue(name), source.getPropertyPriority(name));
    }
  }
}

function clonePseudoElements(original: Element, clone: Element, ctx: RenderContext): void {
  for (const pseudo of [':before', ':after'] as const) {
    const style = window.getComputedStyle(original, pseudo);
    const content = style.getPropertyValue('content');
    if (content === '' || content === 'none') continue;

    const uid = `u${Math.random().toString(36).slice(2, 6)}`;
    const existingClass = clone.getAttribute('class');
    clone.setAttribute('class', existingClass ? `${existingClass} ${uid}` : uid);

    const cssText = style.cssText
      ? `${style.cssText} content: ${content};`
      : Array.from(style)
          .map((name) => `${name}: ${style.getPropertyValue(name)}${style.getPropertyPriority(name) ? ' !important' : ''}`)
          .join('; ') + ';';

    const styleEl = document.createElement('style');
    styleEl.appendChild(document.createTextNode(`.${uid}:${pseudo}{${cssText}}`));
    clone.appendChild(styleEl);
  }
}

function copyUserInput(original: Element, clone: Element): void {
  if (original instanceof HTMLTextAreaElement) clone.innerHTML = original.value;
  if (original instanceof HTMLInputElement) clone.setAttribute('value', original.value);
}

function fixSvg(clone: Element): void {
  if (!(clone instanceof SVGElement)) return;
  clone.setAttribute('xmlns', 'http://www.w3.org/2000/svg');
  if (!(clone instanceof SVGRectElement)) return;
  for (const attr of ['width', 'height']) {
    const value = clone.getAttribute(attr);
    if (value) clone.style.setProperty(attr, value);
  }
}

async function inlineImages(node: Node, ctx: RenderContext): Promise<void> {
  if (!(node instanceof HTMLElement) && !(node instanceof SVGElement)) {
    await Promise.all(Array.from(node.childNodes).map((child) => inlineImages(child, ctx)));
    return;
  }

  const tasks: Promise<unknown>[] = [];

  const background = node.style.getPropertyValue('background');
  if (background) {
    tasks.push(
      inlineCssUrls(background, undefined, ctx).then((inlined) => {
        node.style.setProperty('background', inlined, node.style.getPropertyPriority('background'));
      })
    );
  }

  if (node instanceof HTMLImageElement && !isDataUrl(node.src)) {
    tasks.push(
      ctx.resourceCache
        .getOrFetch(node.src, () => fetchAndEncode(node.src, ctx))
        .then((base64) => {
          node.src = dataAsUrl(base64, mimeType(node.src));
        })
    );
  } else {
    tasks.push(...Array.from(node.childNodes).map((child) => inlineImages(child, ctx)));
  }

  await Promise.all(tasks);
}

async function nodeToSvgDataUri(clone: Node, width: number, height: number): Promise<string> {
  if (clone instanceof HTMLElement) {
    clone.setAttribute('xmlns', 'http://www.w3.org/1999/xhtml');
  }
  const xhtml = escapeXhtml(new XMLSerializer().serializeToString(clone));
  const foreignObject = `<foreignObject x="0" y="0" width="100%" height="100%">${xhtml}</foreignObject>`;
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}">${foreignObject}</svg>`;
  return `data:image/svg+xml;charset=utf-8,${svg}`;
}

function buildContext(options: ExportOptions): RenderContext {
  return {
    options: {
      cacheBust: options.cacheBust ?? false,
      useCredentials: options.useCredentials ?? false,
      includePseudoElements: options.includePseudoElements ?? true,
      pruneInheritedStyles: options.pruneInheritedStyles ?? false,
      fetchTimeoutMs: options.fetchTimeoutMs ?? 30_000,
      ...options,
    },
    resourceCache: options.resourceCache ?? new ResourceCache(),
    styleCache: new WeakMap(),
    serializableStylePropertiesCache: new WeakMap(),
    sizeCache: new WeakMap(),
    runId: options.profile ? makeRunId() : undefined,
    clonedElementCount: 0,
  };
}

/** Renderiza `node` num `HTMLCanvasElement`. */
export async function toCanvas(node: HTMLElement, options: ExportOptions = {}): Promise<HTMLCanvasElement> {
  const ctx = buildContext(options);
  if (ctx.runId) performance.mark(`${ctx.runId}:total:start`);

  const { width, height } = timedSync(ctx, 'measureRoot', () => measure(node, ctx));
  const targetWidth = options.width ?? width;
  const targetHeight = options.height ?? height;

  // A clonagem da árvore em si é síncrona (veja o comentário em cloneNode);
  // só a resolução de fontes é genuinamente assíncrona (pode envolver fetch),
  // então rodamos as duas em paralelo aqui — isso sim é paralelismo real,
  // já que resolveFontFaces pode ficar esperando I/O enquanto cloneNode roda.
  const [clone, fontsCss] = await Promise.all([
    timed(ctx, 'cloneNode', async () => cloneNode(node, ctx, true)),
    timed(ctx, 'resolveFontFaces', () => resolveFontFaces(node.ownerDocument, ctx)),
  ]);
  if (!clone) throw new Error('root node was excluded by filter');

  if (options.postProcess && clone instanceof HTMLElement) {
    const postProcess = options.postProcess;
    await timed(ctx, 'postProcess', async () => postProcess(clone));
  }

  const styleTag = document.createElement('style');
  styleTag.appendChild(document.createTextNode(fontsCss));
  clone.appendChild(styleTag);

  // Inlining de imagens/backgrounds no clone inteiro, em paralelo e com dedupe.
  await timed(ctx, 'inlineImages', () => inlineImages(clone, ctx));

  if (clone instanceof HTMLElement) {
    if (options.bgcolor) clone.style.backgroundColor = options.bgcolor;
    if (options.width) clone.style.width = `${options.width}px`;
    if (options.height) clone.style.height = `${options.height}px`;
    if (options.style) Object.assign(clone.style, options.style);
  }

  const svgDataUri = await timed(ctx, 'buildSvg', () => nodeToSvgDataUri(clone, targetWidth, targetHeight));
  // Substitui o delay(100) fixo por espera real de decodificação da imagem.
  // Em árvores complexas, rasterizar HTML dentro de <foreignObject> costuma ser
  // a etapa mais cara de toda a pipeline — o profiling deixa isso visível.
  const image = await timed(ctx, 'decodeImage', () => loadImage(svgDataUri, ctx.options.useCredentials));

  const scale = options.scale ?? 1;
  const canvas = timedSync(ctx, 'drawCanvas', () => {
    const c = document.createElement('canvas');
    c.width = targetWidth * scale;
    c.height = targetHeight * scale;

    const canvasCtx = c.getContext('2d');
    if (!canvasCtx) throw new Error('2D context not available');

    if (options.bgcolor) {
      canvasCtx.fillStyle = options.bgcolor;
      canvasCtx.fillRect(0, 0, c.width, c.height);
    }
    if (image) {
      canvasCtx.scale(scale, scale);
      canvasCtx.drawImage(image, 0, 0);
    }
    return c;
  });

  if (ctx.runId) {
    performance.mark(`${ctx.runId}:total:end`);
    performance.measure(`${ctx.runId}:total`, `${ctx.runId}:total:start`, `${ctx.runId}:total:end`);
    flushProfile(ctx, options.onProfile);
  }

  return canvas;
}

/** Exporta `node` como PNG data URL. */
export async function toPng(node: HTMLElement, options: ExportOptions = {}): Promise<string> {
  const canvas = await toCanvas(node, options);
  return canvas.toDataURL('image/png');
}

/** Exporta `node` como PNG Blob (mais eficiente que data URL para uploads/downloads). */
export async function toPngBlob(node: HTMLElement, options: ExportOptions = {}): Promise<Blob> {
  const canvas = await toCanvas(node, options);
  return new Promise((resolve, reject) => {
    canvas.toBlob((blob) => {
      if (blob) resolve(blob);
      else reject(new Error('canvas.toBlob failed'));
    }, 'image/png');
  });
}
