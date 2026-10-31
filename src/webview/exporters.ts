import { elementToSVG } from "dom-to-svg";
import type { Config as SVGOConfig } from "svgo";
import { optimize } from "svgo/browser";
import type { WebviewConfig } from "../types";
import domtoimage from "./lib/dom-to-image";
import { SessionConfig, useSessionConfig } from "./SessionConfig";
import { cameraFlashAnimation } from "./snap";
import { $$, vscode } from "./util";

export async function exportPNG(target: HTMLElement, action: WebviewConfig["shutterAction"], useFallback?: boolean) {
  const [mainExporter, fallbackExporter] = useFallback ? [toPNGFallback, toPNG] : [toPNG, toPNGFallback];

  // Defer rendering so a large capture can start clipboard access during the
  // user's click and supply the image asynchronously.
  const blobPromise = Promise.resolve().then(async () => {
    try {
      return await mainExporter(target);
    } catch (_error) {
      console.log("Error while generating PNG, running fallback");
      console.log(_error);
      return await fallbackExporter(target);
    }
  });

  if (action === "copy") {
    let write: Promise<void>;
    try {
      write = navigator.clipboard.write([new ClipboardItem({ "image/png": blobPromise })]);
      write.catch(() => {});
    } catch (error) {
      await blobPromise.catch(() => {});
      throw error;
    }
    await blobPromise;
    await write;
    void cameraFlashAnimation();
    vscode.postMessage({ type: "copied" });
  } else {
    const blob = await blobPromise;
    vscode.postMessage({ type: action, data: await blobToBase64(blob), format: "png" });
  }
}

export async function exportWEBP(target: HTMLElement) {
  const canvas = await domtoimage.toCanvas(target, {
    scale: useSessionConfig.getState().saveScale,
  });

  const blob = await canvasToBlob(canvas, "image/webp");
  vscode.postMessage({ type: "save", data: await blobToBase64(blob), format: "webp" });
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
  const scale = useSessionConfig.getState().saveScale;
  const options = {
    scale,
    // When using scaled monitor resolutions, the scaling factor can generate fractional pixels and break the lines.
    // Setting the elements width to unset should solve it
    postProcess: (node: HTMLElement) => {
      $$("#snippet-container, #snippet, .line, .line-code span", node).forEach((span) => {
        span.style.width = "unset";
      });
    },
  };

  const canvas = await domtoimage.toCanvas(target, options);

  console.timeEnd("toPNG");
  return canvasToBlob(canvas, "image/png");
}

async function toPNGFallback(target: HTMLElement) {
  const scale = SessionConfig.get("saveScale");
  const { height: targetHeight, width: targetWidth } = target.getBoundingClientRect();

  const width = Math.floor(targetWidth * scale) + 2;
  const height = Math.floor(targetHeight * scale) + 2;

  function svgToDataURI(svgString: string) {
    // The SVG is an intermediate image, so repeated optimization passes do
    // not justify their cost for a large snippet.
    const optimizedSvg = optimize(svgString, { ...svgoConfig, multipass: false }).data;
    const encodedSvg = encodeURIComponent(optimizedSvg).replace(/%0A/g, "").replace(/%20/g, " ");

    return `data:image/svg+xml;charset=utf-8,${encodedSvg}`;
  }

  const image = await (async (): Promise<HTMLImageElement> => {
    return new Promise((resolve, reject) => {
      const img = new Image();

      img.width = width;
      img.height = height;

      img.onload = () => resolve(img);
      img.onerror = () => reject(new Error("Failed to load the generated SVG image"));
      img.src = svgToDataURI(new XMLSerializer().serializeToString(elementToSVG(target, { keepLinks: false })));
    });
  })();

  const canvas = document.createElement("canvas");
  try {
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext("2d");
    if (!ctx) throw new Error("Could not create a canvas for the screenshot");
    ctx.drawImage(image, 0, 0, width, height);
    return await canvasToBlob(canvas, "image/png");
  } finally {
    canvas.width = 0;
    canvas.height = 0;
  }
}

function canvasToBlob(canvas: HTMLCanvasElement, type: "image/png" | "image/webp"): Promise<Blob> {
  return new Promise<Blob>((resolve, reject) => {
    canvas.toBlob(
      (blob) => {
        if (blob && blob.type === type) resolve(blob);
        else reject(new Error(`Could not encode the screenshot as ${type}`));
      },
      type,
      1,
    );
  }).finally(() => {
    // Release the large backing store even when encoding fails.
    canvas.width = 0;
    canvas.height = 0;
  });
}

function blobToBase64(blob: Blob): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const url = reader.result as string;
      resolve(url.slice(url.indexOf(",") + 1));
    };
    reader.onerror = () => reject(reader.error ?? new Error("Could not read the screenshot"));
    reader.readAsDataURL(blob);
  });
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
