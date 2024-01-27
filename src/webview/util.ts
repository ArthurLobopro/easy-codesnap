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

export const once = (elem: Element, evt: string) =>
    new Promise((done) => elem.addEventListener(evt, done, { once: true }));

export const redraw = (node: Element) => node.clientHeight;

export const setVar = (key: string, value: string, node = document.body) =>
    node.style.setProperty("--" + key, value);

export const calcTextWidth = (text: string) => {
    const div = document.body.appendChild(document.createElement("div"));
    div.classList.add("size-test");
    div.textContent = text;
    const width = div.clientWidth;
    div.remove();
    return width + 1 + "px";
};

declare const acquireVsCodeApi: () => { postMessage: (message: any) => void };

export const vscode = acquireVsCodeApi();
