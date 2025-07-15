import type { ExtensionConfig, message } from "../types";
import { SessionConfig } from "./SessionConfig";

export type untypedObject = { [key: string]: any };

export function $<T extends HTMLElement>(q: string, c: Element = document as any) {
  return c.querySelector(q) as T;
}

export function $$<T extends HTMLElement>(q: string, c: Element = document as any) {
  return Array.from(c.querySelectorAll(q)) as T[];
}

export function once(elem: Element, evt: string) {
  return new Promise((done) => elem.addEventListener(evt, done, { once: true }));
}

export const redraw = (node: Element) => node.clientHeight;
export const px = (px: any) => `${px}px`;

export function setVar(key: string, value: string, node = document.body) {
  return node.style.setProperty(`--${key}`, value);
}

export function calcTextWidth(text: string) {
  const div = document.body.appendChild(document.createElement("div"));
  div.classList.add("size-test");
  div.textContent = text;

  const width = div.clientWidth;
  div.remove();

  return px(width + 1);
}

declare const acquireVsCodeApi: () => {
  postMessage: (message: message) => void;
};

export const vscode = acquireVsCodeApi();

export function getDefaultWindowTitle() {
  const {
    templates: { fileName, workspace, relativeFolder },
    windowTitleTemplate,
  } = SessionConfig.get();

  return windowTitleTemplate
    .replace(/\{fileName\}/g, fileName)
    .replace(/\{workspace\}/g, workspace)
    .replace(/\{relativeFolder\}/g, relativeFolder);
}

export function getSymbolBreadcrumbs() {
  const {
    symbolBreadcrumbs,
    templates: { fileName },
  } = SessionConfig.get();

  return [
    {
      kind: "File",
      name: fileName,
    },
    ...symbolBreadcrumbs,
  ];
}

export function getWidth(element: HTMLElement) {
  return element.getBoundingClientRect().width;
}

export { t } from "@vscode/l10n";

export const text = (...args: string[]) => args.join(" ");

export function openConfig(name: keyof ExtensionConfig) {
  vscode.postMessage({
    type: "open-config",
    configName: name,
  });
}
