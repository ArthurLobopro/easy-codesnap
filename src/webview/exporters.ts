//@ts-expect-error
import domtoimage from "dom-to-image";
//@ts-expect-error
import { elementToSVG } from "dom-to-svg";

import { WebviewConfig } from "../types";
import { cameraFlashAnimation } from "./snap";
import { $$, vscode } from "./util";

const SNAP_SCALE = 2;

export async function exportPNG(
    target: HTMLElement,
    action: WebviewConfig["shutterAction"],
) {
    const url = await domtoimage.toPng(target, {
        bgColor: "transparent",
        scale: SNAP_SCALE,
        postProcess: (node: HTMLElement) => {
            $$(
                "#snippet-container, #snippet, .line, .line-code span",
                node,
            ).forEach((span: HTMLElement) => (span.style.width = "unset"));

            $$(".line-code", node).forEach(
                (span) => (span.style.width = "100%"),
            );
        },
    });

    const data = url.slice(url.indexOf(",") + 1);

    if (action === "copy") {
        const binary = atob(data);
        const array = new Uint8Array(binary.length);

        for (let i = 0; i < binary.length; i++) {
            array[i] = binary.charCodeAt(i);
        }

        const blob = new Blob([array], { type: "image/png" });
        navigator.clipboard.write([new ClipboardItem({ "image/png": blob })]);
        cameraFlashAnimation();

        vscode.postMessage({ type: "copied" });
    } else {
        vscode.postMessage({ type: action, data, format: "png" });
    }
}

export async function exportSVG(
    target: HTMLElement,
    action: WebviewConfig["shutterAction"],
) {
    const svg = new XMLSerializer()
        .serializeToString(elementToSVG(target))
        .replace(/<style>.*?<\/style>/gs, "");

    if (action === "copy") {
        vscode.postMessage({ type: "copy-svg", data: svg });
        cameraFlashAnimation();
        vscode.postMessage({ type: "copied" });
    } else {
        vscode.postMessage({ type: action, data: svg, format: "svg" });
    }
}
