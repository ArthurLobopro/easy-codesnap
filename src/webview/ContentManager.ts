import { UpdateCode } from "./ui/updaters";

function getClipboardHtml(clip: DataTransfer) {
  const html = clip.getData("text/html");

  if (html) {
    return html;
  }

  const text = clip
    .getData("text/plain")
    .split("\n")
    .map((line) => `<div>${line.replace(/</g, "&lt;").replace(/>/g, "&gt;")}</div>`)
    .join("");

  return `<div>${text}</div>`;
}

export class ContentManager {
  static #clipboard_data: string;

  static update(data: DataTransfer) {
    this.#clipboard_data = getClipboardHtml(data);
    UpdateCode();
  }

  static get current() {
    return this.#clipboard_data;
  }
}
