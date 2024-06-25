import type { message } from "../types";
import { SessionConfig } from "./SessionConfig";

export type untypedObject = { [key: string]: any };

export function $<T extends HTMLElement>(
    q: string,
    c: Element = document as any,
) {
    return c.querySelector(q) as T;
}

export function $$<T extends HTMLElement>(
    q: string,
    c: Element = document as any,
) {
    return Array.from(c.querySelectorAll(q)) as T[];
}

export function once(elem: Element, evt: string) {
    return new Promise((done) =>
        elem.addEventListener(evt, done, { once: true }),
    );
}

export const redraw = (node: Element) => node.clientHeight;

export function setVar(key: string, value: string, node = document.body) {
    return node.style.setProperty(`--${key}`, value);
}

export function calcTextWidth(text: string) {
    const div = document.body.appendChild(document.createElement("div"));
    div.classList.add("size-test");
    div.textContent = text;

    const width = div.clientWidth;
    div.remove();

    return `${width + 1}px`;
}

declare const acquireVsCodeApi: () => {
    postMessage: (message: message) => void;
};

export const vscode = acquireVsCodeApi();

export function getDefaultWindowTitle() {
    const {
        templates: { fileName, workspace },
        windowTitleTemplate,
    } = SessionConfig.get();

    return windowTitleTemplate
        .replace(/\{fileName\}/g, fileName)
        .replace(/\{workspace\}/g, workspace);
}
