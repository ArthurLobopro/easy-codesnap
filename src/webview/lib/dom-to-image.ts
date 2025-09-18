const util = newUtil();
const inliner = newInliner();
const fontFaces = newFontFaces();
const images = newImages();

// Default impl options
const defaultOptions = {
  // Default is to fail on error, no placeholder
  imagePlaceholder: undefined,
  // Default cache bust is false, it will use the cache
  cacheBust: false,
  // Use (existing) authentication credentials for external URIs (CORS requests)
  useCredentials: false,
};

const domtoimage = {
  toSvg,
  toPng,
  toJpeg,
  toBlob,
  toCanvas,
  impl: {
    fontFaces,
    images,
    util,
    inliner,
    options: {} as Partial<Options>,
  },
};

interface Options {
  bgcolor: string;
  width: number;
  height: number;
  style: Record<string, any>;
  quality: number;
  scale: number;
  imagePlaceholder: string;
  cacheBust: boolean;
}

type Obj = Record<string, any>;

/**
     * @param {Object} options - Rendering options
   
     * @param {String} options.bgcolor - color for the background, any valid CSS color value.
     * @param {Number} options.width - width to be applied to node before rendering.
     * @param {Number} options.height - height to be applied to node before rendering.
     * @param {Object} options.style - an object whose properties to be copied to node's style before rendering.
     * @param {Number} options.quality - a Number between 0 and 1 indicating image quality (applicable to JPEG only),
                defaults to 1.0.
     * @param {Number} options.scale - a Number multiplier to scale up the canvas before rendering to reduce fuzzy images, defaults to 1.0.
     * @param {String} options.imagePlaceholder - dataURL to use as a placeholder for failed images, default behaviour is to fail fast on images we can't fetch
     * @param {Boolean} options.cacheBust - set to true to cache bust by appending the time to the request url
     * @return {Promise} - A promise that is fulfilled with a SVG image data URL
     * */
function toSvg(node: HTMLElement, options: Partial<Options>) {
  //biome-ignore lint/style/noParameterAssign: Just ignore it
  options = options || {};
  copyOptions(options);

  return Promise.resolve(node)
    .then((node) => cloneNode(node))
    .then(embedFonts)
    .then(inlineImages)
    .then(applyOptions)
    .then((clone) => makeSvgDataUri(clone, options.width || util.width(node), options.height || util.height(node)));

  function applyOptions(clone: HTMLElement) {
    if (options.bgcolor) clone.style.backgroundColor = options.bgcolor;
    if (options.width) clone.style.width = options.width + "px";
    if (options.height) clone.style.height = options.height + "px";

    if (options.style)
      Object.keys(options.style).forEach((property) => {
        //@ts-expect-error
        clone.style[property] = options.style[property];
      });

    return clone;
  }
}

/**
 * @param {Node} node - The DOM Node object to render
 * @param {Object} options - Rendering options, @see {@link toSvg}
 * @return {Promise} - A promise that is fulfilled with a PNG image data URL
 * */
function toPng(node: HTMLElement, options: Partial<Options>) {
  return draw(node, options || {}).then((canvas) => canvas.toDataURL());
}

async function toJpeg(node: HTMLElement, options: Partial<Options> = {}) {
  const canvas = await draw(node, options);
  return canvas.toDataURL("image/jpeg", options.quality || 1.0);
}

/**
 * @param {Node} node - The DOM Node object to render
 * @param {Object} options - Rendering options, @see {@link toSvg}
 * @return {Promise} - A promise that is fulfilled with a PNG image blob
 * */
function toBlob(node: HTMLElement, options: Partial<Options>) {
  return draw(node, options || {}).then(util.canvasToBlob);
}

/**
 * @param {Node} node - The DOM Node object to render
 * @param {Object} options - Rendering options, @see {@link toSvg}
 * @return {Promise} - A promise that is fulfilled with a canvas object
 * */
function toCanvas(node: HTMLElement, options: Partial<Options>) {
  return draw(node, options || {});
}

function copyOptions(options: Partial<Options>) {
  // Copy options to impl options for use in impl
  if (typeof options.imagePlaceholder === "undefined") {
    domtoimage.impl.options.imagePlaceholder = defaultOptions.imagePlaceholder;
  } else {
    domtoimage.impl.options.imagePlaceholder = options.imagePlaceholder;
  }

  if (typeof options.cacheBust === "undefined") {
    domtoimage.impl.options.cacheBust = defaultOptions.cacheBust;
  } else {
    domtoimage.impl.options.cacheBust = options.cacheBust;
  }
}

function draw(domNode: HTMLElement, options: Partial<Options>) {
  return toSvg(domNode, options)
    .then(util.makeImage)
    .then(util.delay(100))
    .then((image) => {
      const scale = typeof options.scale !== "number" ? 1 : options.scale;
      const canvas = newCanvas(domNode, scale);
      const ctx = canvas.getContext("2d")!;
      if (image) {
        ctx.scale(scale, scale);
        ctx.drawImage(image, 0, 0);
      }
      return canvas;
    });

  function newCanvas(domNode: HTMLElement, scale: number) {
    const canvas = document.createElement("canvas");
    canvas.width = (options.width || util.width(domNode)) * scale;
    canvas.height = (options.height || util.height(domNode)) * scale;

    if (options.bgcolor) {
      const ctx = canvas.getContext("2d")!;
      ctx.fillStyle = options.bgcolor;
      ctx.fillRect(0, 0, canvas.width, canvas.height);
    }

    return canvas;
  }
}

function cloneNode(node: Element | ChildNode) {
  return Promise.resolve(node as HTMLElement)
    .then(makeNodeCopy)
    .then((clone) => cloneChildren(node as Element, clone as Element))
    .then((clone) => processClone(node as Element, clone as HTMLElement));

  function makeNodeCopy(node: Element) {
    if (node instanceof HTMLCanvasElement) return util.makeImage(node.toDataURL());
    return node.cloneNode(false);
  }

  function cloneChildren(original: Element, clone: Element) {
    const children = original.childNodes;
    if (children.length === 0) return Promise.resolve(clone);

    return cloneChildrenInOrder(clone, Array.from(children)).then(() => clone);

    function cloneChildrenInOrder(parent: Element, children: ChildNode[]) {
      let done = Promise.resolve();
      children.forEach((child) => {
        done = done
          .then(() => cloneNode(child))
          .then((childClone) => {
            if (childClone) parent.appendChild(childClone);
          });
      });
      return done;
    }
  }

  function processClone(original: Element, clone: HTMLElement) {
    if (!(clone instanceof Element)) return clone;

    return Promise.resolve()
      .then(cloneStyle)
      .then(clonePseudoElements)
      .then(copyUserInput)
      .then(fixSvg)
      .then(() => clone);

    function cloneStyle() {
      copyStyle(window.getComputedStyle(original), clone.style);

      function copyFont(source: Obj, target: Obj) {
        target.font = source.font;
        target.fontFamily = source.fontFamily;
        target.fontFeatureSettings = source.fontFeatureSettings;
        target.fontKerning = source.fontKerning;
        target.fontSize = source.fontSize;
        target.fontStretch = source.fontStretch;
        target.fontStyle = source.fontStyle;
        target.fontVariant = source.fontVariant;
        target.fontVariantCaps = source.fontVariantCaps;
        target.fontVariantEastAsian = source.fontVariantEastAsian;
        target.fontVariantLigatures = source.fontVariantLigatures;
        target.fontVariantNumeric = source.fontVariantNumeric;
        target.fontVariationSettings = source.fontVariationSettings;
        target.fontWeight = source.fontWeight;
      }

      function copyStyle(source: CSSStyleDeclaration, target: CSSStyleDeclaration) {
        if (source.cssText) {
          target.cssText = source.cssText;
          copyFont(source, target); // here we re-assign the font props.
        } else copyProperties(source, target);

        function copyProperties(source: CSSStyleDeclaration, target: CSSStyleDeclaration) {
          Array.from(source).forEach((name) => {
            target.setProperty(name, source.getPropertyValue(name), source.getPropertyPriority(name));
          });
        }
      }
    }

    function clonePseudoElements() {
      [":before", ":after"].forEach((element) => {
        clonePseudoElement(element);
      });

      function clonePseudoElement(element: string) {
        const style = window.getComputedStyle(original, element);
        const content = style.getPropertyValue("content");

        if (content === "" || content === "none") return;

        const className = util.uid();
        const currentClass = clone.getAttribute("class");
        if (currentClass) {
          clone.setAttribute("class", [currentClass, className].join(" "));
        }

        const styleElement = document.createElement("style");
        styleElement.appendChild(formatPseudoElementStyle(className, element, style));
        clone.appendChild(styleElement);

        function formatPseudoElementStyle(className: string, element: string, style: CSSStyleDeclaration) {
          const selector = "." + className + ":" + element;
          const cssText = style.cssText ? formatCssText(style) : formatCssProperties(style);
          return document.createTextNode(selector + "{" + cssText + "}");

          function formatCssText(style: CSSStyleDeclaration) {
            const content = style.getPropertyValue("content");
            return style.cssText + " content: " + content + ";";
          }

          function formatCssProperties(style: CSSStyleDeclaration) {
            return `${Array.from(style).map(formatProperty).join("; ")};`;

            function formatProperty(name: string) {
              return [
                name,
                ": ",
                style.getPropertyValue(name),
                style.getPropertyPriority(name) ? " !important" : "",
              ].join("");
            }
          }
        }
      }
    }

    function copyUserInput() {
      if (original instanceof HTMLTextAreaElement) clone.innerHTML = original.value;
      if (original instanceof HTMLInputElement) clone.setAttribute("value", original.value);
    }

    function fixSvg() {
      if (!(clone instanceof SVGElement)) return;
      clone.setAttribute("xmlns", "http://www.w3.org/2000/svg");

      if (!(clone instanceof SVGRectElement)) return;
      ["width", "height"].forEach((attribute) => {
        const value = clone.getAttribute(attribute);
        if (!value) return;

        clone.style.setProperty(attribute, value);
      });
    }
  }
}

function embedFonts(node: Node) {
  return fontFaces.resolveAll().then((cssText) => {
    const styleNode = document.createElement("style");
    node.appendChild(styleNode);
    styleNode.appendChild(document.createTextNode(cssText));
    return node;
  });
}

function inlineImages(node: any) {
  return images.inlineAll(node).then(() => node);
}

function makeSvgDataUri(node: HTMLElement, width: string | number, height: string | number) {
  return Promise.resolve(node)
    .then((node) => {
      node.setAttribute("xmlns", "http://www.w3.org/1999/xhtml");
      return new XMLSerializer().serializeToString(node);
    })
    .then(util.escapeXhtml)
    .then((xhtml) => `<foreignObject x="0" y="0" width="100%" height="100%">${xhtml}</foreignObject>`)
    .then(
      (foreignObject) =>
        '<svg xmlns="http://www.w3.org/2000/svg" width="' +
        width +
        '" height="' +
        height +
        '">' +
        foreignObject +
        "</svg>",
    )
    .then((svg) => `data:image/svg+xml;charset=utf-8,${svg}`);
}

function newUtil() {
  /*
   * Only WOFF and EOT mime types for fonts are 'real'
   * see http://www.iana.org/assignments/media-types/media-types.xhtml
   */
  const WOFF = "application/font-woff";
  const JPEG = "image/jpeg";

  const MIMES: Obj = {
    woff: WOFF,
    woff2: WOFF,
    ttf: "application/font-truetype",
    eot: "application/vnd.ms-fontobject",
    png: "image/png",
    jpg: JPEG,
    jpeg: JPEG,
    gif: "image/gif",
    tiff: "image/tiff",
    svg: "image/svg+xml",
  };

  return {
    escape,
    parseExtension,
    mimeType,
    dataAsUrl,
    isDataUrl,
    canvasToBlob,
    resolveUrl,
    getAndEncode,
    uid: uid(),
    delay,
    asArray,
    escapeXhtml,
    makeImage,
    width,
    height,
  };

  function parseExtension(url: string) {
    const match = /\.([^./]*?)(\?|$)/gu.exec(url);
    if (match) return match[1];
    return "";
  }

  function mimeType(url: string) {
    const extension = parseExtension(url).toLowerCase();
    return MIMES[extension] || "";
  }

  function isDataUrl(url: string) {
    return url.search(/^(data:)/u) !== -1;
  }

  function toBlob(canvas: { toDataURL: () => string }) {
    return new Promise((resolve) => {
      const binaryString = window.atob(canvas.toDataURL().split(",")[1]);
      const length = binaryString.length;
      const binaryArray = new Uint8Array(length);

      for (let i = 0; i < length; i++) binaryArray[i] = binaryString.charCodeAt(i);

      resolve(
        new Blob([binaryArray], {
          type: "image/png",
        }),
      );
    });
  }

  function canvasToBlob(canvas: HTMLCanvasElement) {
    if (canvas.toBlob)
      return new Promise((resolve) => {
        canvas.toBlob(resolve);
      });

    return toBlob(canvas);
  }

  function resolveUrl(url: string, baseUrl: string) {
    const doc = document.implementation.createHTMLDocument();
    const base = doc.createElement("base");
    doc.head.appendChild(base);
    const a = doc.createElement("a");
    doc.body.appendChild(a);
    base.href = baseUrl;
    a.href = url;
    return a.href;
  }

  function uid() {
    let index = 0;

    function fourRandomChars() {
      /* see http://stackoverflow.com/a/6248722/2519373 */
      return ("0000" + ((Math.random() * 36 ** 4) << 0).toString(36)).slice(-4);
    }

    return () => "u" + fourRandomChars() + index++;
  }

  function makeImage(uri: string): Promise<HTMLImageElement> {
    return new Promise((resolve, reject) => {
      const image = new Image();

      image.onload = () => {
        resolve(image);
      };
      image.onerror = reject;
      image.src = uri;
    });
  }

  function getAndEncode(url: string) {
    const TIMEOUT = 30000;
    if (domtoimage.impl.options.cacheBust) {
      // Cache bypass so we don't have CORS issues with cached images
      // Source: https://developer.mozilla.org/en/docs/Web/API/XMLHttpRequest/Using_XMLHttpRequest#Bypassing_the_cache
      // biome-ignore lint/style/noParameterAssign: Need this
      url += (/\?/u.test(url) ? "&" : "?") + Date.now();
    }

    return new Promise((resolve) => {
      const request = new XMLHttpRequest();

      request.onreadystatechange = done;
      request.ontimeout = timeout;
      request.responseType = "blob";
      request.timeout = TIMEOUT;

      request.open("GET", url, true);
      request.send();

      let placeholder: string;
      if (domtoimage.impl.options.imagePlaceholder) {
        const split = domtoimage.impl.options.imagePlaceholder.split(/,/u);
        if (split?.[1]) {
          placeholder = split[1];
        }
      }

      function done() {
        if (request.readyState !== 4) return;

        if (request.status !== 200) {
          if (placeholder) {
            resolve(placeholder);
          } else {
            fail(["cannot fetch resource: ", url, ", status: ", request.status].join(""));
          }

          return;
        }

        const encoder = new FileReader();
        encoder.onloadend = () => {
          const content = (encoder.result as string).split?.(/,/u)[1];
          resolve(content);
        };
        encoder.readAsDataURL(request.response);
      }

      function timeout() {
        if (placeholder) {
          resolve(placeholder);
        } else {
          fail(["timeout of ", TIMEOUT, "ms occurred while fetching resource: ", url].join(""));
        }
      }

      function fail(message: string) {
        console.error(message);
        resolve("");
      }
    });
  }

  function dataAsUrl(content: string, type: string) {
    return `data:${type};base64,${content}`;
  }

  // biome-ignore lint/suspicious/noShadowRestrictedNames: <explanation>
  function escape(string: string) {
    return string.replace(/([.*+?^${}()|[\]/\\])/gu, "\\$1");
  }

  function delay(ms: number) {
    return <T>(arg: T): Promise<T> =>
      new Promise((resolve) => {
        setTimeout(() => {
          resolve(arg);
        }, ms);
      });
  }

  function asArray(arrayLike: string | any[]) {
    const array = [];
    const length = arrayLike.length;
    for (let i = 0; i < length; i++) array.push(arrayLike[i]);
    return array;
  }

  function escapeXhtml(string: string) {
    return string.replace(/#/gu, "%23").replace(/\n/gu, "%0A");
  }

  function width(node: Element | HTMLElement) {
    const leftBorder = px(node, "border-left-width");
    const rightBorder = px(node, "border-right-width");
    return node.scrollWidth + leftBorder + rightBorder;
  }

  function height(node: Element | HTMLElement) {
    const topBorder = px(node, "border-top-width");
    const bottomBorder = px(node, "border-bottom-width");
    return node.scrollHeight + topBorder + bottomBorder;
  }

  function px(node: Element, styleProperty: string) {
    const value = window.getComputedStyle(node).getPropertyValue(styleProperty);
    return Number.parseFloat(value.replace("px", ""));
  }
}

function newInliner() {
  const URL_REGEX = /url\(['"]?([^'"]+?)['"]?\)/gu;

  return {
    inlineAll,
    shouldProcess,
    impl: {
      readUrls,
      inline,
    },
  };

  function shouldProcess(string: string) {
    return string.search(URL_REGEX) !== -1;
  }

  function readUrls(string: string) {
    const result = [];
    // biome-ignore lint/suspicious/noImplicitAnyLet: Was made that way
    let match;
    // biome-ignore lint/suspicious/noAssignInExpressions: Was made that way
    while ((match = URL_REGEX.exec(string)) !== null) {
      result.push(match[1]);
    }
    return result.filter((url) => !util.isDataUrl(url));
  }

  function inline(string: string, url: string, baseUrl?: any, get?: any): Promise<string> {
    return Promise.resolve(url)
      .then((url) => (baseUrl ? util.resolveUrl(url, baseUrl) : url))
      .then(get || util.getAndEncode)
      .then((data) => util.dataAsUrl(data, util.mimeType(url)))
      .then((dataUrl) => string.replace(urlAsRegex(url), "$1" + dataUrl + "$3"));

    function urlAsRegex(url: string) {
      return new RegExp("(url\\(['\"]?)(" + util.escape(url) + ")(['\"]?\\))", "gu");
    }
  }

  function inlineAll(string: string, baseUrl?: any, get?: any) {
    if (nothingToInline()) return Promise.resolve(string);

    return Promise.resolve(string)
      .then(readUrls)
      .then((urls) => {
        let done = Promise.resolve(string);
        urls.forEach((url) => {
          done = done.then((string) => inline(string, url, baseUrl, get));
        });
        return done;
      });

    function nothingToInline() {
      return !shouldProcess(string);
    }
  }
}

function newFontFaces() {
  return {
    resolveAll,
    impl: {
      readAll,
    },
  };

  function resolveAll() {
    return readAll()
      .then((webFonts) => Promise.all(webFonts.map((webFont: { resolve: () => any }) => webFont.resolve())))
      .then((cssStrings) => cssStrings.join("\n"));
  }

  function readAll() {
    return Promise.resolve(Array.from(document.styleSheets))
      .then(getCssRules)
      .then(selectWebFontRules)
      .then((rules) => rules.map(newWebFont));

    function selectWebFontRules(cssRules: any[]) {
      return cssRules
        .filter((rule: { type: number }) => rule.type === CSSRule.FONT_FACE_RULE)
        .filter((rule: { style: { getPropertyValue: (arg0: string) => any } }) =>
          inliner.shouldProcess(rule.style.getPropertyValue("src")),
        );
    }

    function getCssRules(styleSheets: any[]) {
      const cssRules: any[] = [];
      styleSheets.forEach((sheet: { cssRules: any[]; href: string }) => {
        try {
          Array.from(sheet.cssRules || []).forEach(cssRules.push.bind(cssRules));
        } catch (e) {
          console.log(`Error while reading CSS rules from ${sheet.href}`, (e as Error).toString());
        }
      });
      return cssRules;
    }

    function newWebFont(webFontRule: {
      parentStyleSheet: any;
      cssText: any;
      style: { getPropertyValue: (arg0: string) => any };
    }) {
      return {
        resolve: function resolve() {
          const baseUrl = (webFontRule.parentStyleSheet || {}).href;
          return inliner.inlineAll(webFontRule.cssText, baseUrl);
        },
        src() {
          return webFontRule.style.getPropertyValue("src");
        },
      };
    }
  }
}

function newImages() {
  return {
    inlineAll,
    impl: {
      newImage,
    },
  };

  function newImage(element: HTMLImageElement) {
    return {
      inline,
    };

    function inline(get?: any) {
      if (util.isDataUrl(element.src)) return Promise.resolve();

      return Promise.resolve(element.src)
        .then(get || util.getAndEncode)
        .then((data) => util.dataAsUrl(data, util.mimeType(element.src)))
        .then(
          (dataUrl) =>
            new Promise((resolve) => {
              element.onload = resolve;
              // for any image with invalid src(such as <img src />), just ignore it
              element.onerror = resolve;
              element.src = dataUrl;
            }),
        );
    }
  }

  function inlineAll(node: HTMLElement | string): Promise<any> {
    if (!(node instanceof Element)) return Promise.resolve(node);

    return inlineBackground(node).then(() => {
      if (node instanceof HTMLImageElement) return newImage(node).inline();

      return Promise.all(Array.from(node.childNodes).map((child) => inlineAll(child as HTMLElement)));
    });

    function inlineBackground(node: HTMLElement): Promise<any> {
      const background = node.style.getPropertyValue("background");

      if (!background) return Promise.resolve(node);

      return inliner
        .inlineAll(background)
        .then((inlined) => {
          node.style.setProperty("background", inlined, node.style.getPropertyPriority("background"));
        })
        .then(() => node);
    }
  }
}

export default domtoimage;
const impl = domtoimage.impl;

export { toSvg, toPng, toJpeg, toBlob, toCanvas, impl };
