//@ts-expect-error
import domtoimage from "dom-to-image-even-more";
import { elementToSVG } from "dom-to-svg";
import type { Config as SVGOConfig } from "svgo";
import { optimize } from "svgo/browser";
import type { WebviewConfig } from "../types";
import { SessionConfig, useSessionConfig } from "./SessionConfig";
import { cameraFlashAnimation } from "./snap";
import { vscode } from "./util";

export async function exportPNG(target: HTMLElement, action: WebviewConfig["shutterAction"], useFallback?: boolean) {
  const [mainExporter, fallbackExporter] = useFallback ? [toPNGFallback, toPNG] : [toPNG, toPNGFallback];

  const url = await (async () => {
    try {
      return await mainExporter(target);
    } catch (_error) {
      console.log("Error while generating PNG, running fallback");
      console.log(_error);
      return await fallbackExporter(target);
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
  const { optimizeSvg } = useSessionConfig.getState();

  const svg = await new Promise<string>((res) => {
    const svg = new XMLSerializer()
      .serializeToString(elementToSVG(target, { keepLinks: false }))
      .replace(/<style>.*?<\/style>/gs, "<style>.line-number,#window-title{user-select:none;}</style>");

    if (!optimizeSvg) {
      return res(svg);
    }

    return res(optimize(svg, svgoConfig).data);
  });

  if (action === "copy") {
    vscode.postMessage({ type: "copy-svg", data: svg });
    cameraFlashAnimation();
    vscode.postMessage({ type: "copied" });
  } else {
    vscode.postMessage({ type: action, data: svg, format: "svg" });
  }
}

async function toPNG(target: HTMLElement) {
  console.time("toPNG");
  const png = await domtoimage.toPng(target, {
    bgcolor: "transparent",
    scale: useSessionConfig.getState().saveScale,
  });
  console.timeEnd("toPNG");
  return png;
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

      img.src = svgToDataURI(new XMLSerializer().serializeToString(elementToSVG(target, { keepLinks: false })));

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
