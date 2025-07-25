//@ts-expect-error
import domtoimage from "dom-to-image-even-more";
//@ts-expect-error
import { elementToSVG } from "dom-to-svg";
import type { Config as SVGOConfig } from "svgo";
import { optimize } from "svgo/dist/svgo.browser";
import type { WebviewConfig } from "../types";
import { SessionConfig } from "./SessionConfig";
import { cameraFlashAnimation } from "./snap";
import { vscode } from "./util";

export async function exportPNG(target: HTMLElement, action: WebviewConfig["shutterAction"]) {
  const url = await (async () => {
    try {
      return await toPNG(target);
    } catch (_error) {
      return await toPNGFallback(target);
    }
  })();

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

export async function exportSVG(target: HTMLElement, action: WebviewConfig["shutterAction"]) {
  const svg = new XMLSerializer()
    .serializeToString(elementToSVG(target))
    .replace(/<style>.*?<\/style>/gs, "<style>.line-number,#window-title{user-select:none;}</style>");

  const minifiedSvg = optimize(svg, svgoConfig).data;

  if (action === "copy") {
    vscode.postMessage({ type: "copy-svg", data: minifiedSvg });
    cameraFlashAnimation();
    vscode.postMessage({ type: "copied" });
  } else {
    vscode.postMessage({ type: action, data: svg, format: "svg" });
  }
}

async function toPNG(target: HTMLElement) {
  const scale = SessionConfig.get("saveScale");

  return await await domtoimage.toPng(target, {
    bgColor: "transparent",
    scale,
  });
}

async function toPNGFallback(target: HTMLElement) {
  const scale = SessionConfig.get("saveScale");

  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d");

  const width = target.clientWidth * scale;
  const height = target.clientHeight * scale;

  canvas.width = width;
  canvas.height = height;

  function svgToDataURI(svgString: string) {
    const encodedSvg = encodeURIComponent(svgString).replace(/%0A/g, "").replace(/%20/g, " ");

    return `data:image/svg+xml;charset=utf-8,${encodedSvg}`;
  }

  const image = await (async (): Promise<HTMLImageElement> => {
    return new Promise((resolve) => {
      const img = new Image();

      img.width = width;
      img.height = height;

      img.src = svgToDataURI(new XMLSerializer().serializeToString(elementToSVG(target)));

      img.onload = () => resolve(img);
    });
  })();

  ctx?.drawImage(image, 0, 0, width, height);

  return canvas.toDataURL();
}

const svgoConfig: SVGOConfig = {
  floatPrecision: 8,
  multipass: true,
  plugins: [
    {
      name: "preset-default",
      params: {
        overrides: {
          removeViewBox: false,
          removeUnknownsAndDefaults: {
            defaultAttrs: true,
            uselessOverrides: true,
            unknownAttrs: true,
            keepAriaAttrs: false,
            keepDataAttrs: false,
          },
        },
      },
    },
    {
      name: "removeAttrs",
      params: {
        attrs: ["textLength", "text-decoration"],
      },
    },
  ],
};
