import { exportPNG, exportSVG, exportWEBP } from "./exporters";
import { type ISessionConfig, useSessionConfig } from "./SessionConfig";
import { flashFx, snippetContainerNode, windowNode } from "./ui/elements";
import { once, redraw, setVar } from "./util";

export async function cameraFlashAnimation() {
  flashFx.style.display = "block";
  redraw(flashFx);
  flashFx.style.opacity = "0";

  await once(flashFx, "transitionend");
  flashFx.style.display = "none";
  flashFx.style.opacity = "1";
}

export async function takeSnap({ target, ...config }: Omit<ISessionConfig, "set"> = useSessionConfig.getState()) {
  console.time("TakeSnap");
  const targetNode = target === "container" ? snippetContainerNode : windowNode;

  const exporter = { svg: exportSVG, png: exportPNG, webp: exportWEBP }[config.saveFormat];

  windowNode.style.resize = "none";
  snippetContainerNode.style.resize = "none";

  if (config.transparentBackground || target === "window") {
    setVar("container-background-color", "transparent");
  }

  if (target === "window" || (target === "container" && config.transparentBackground)) {
    setVar("box-shadow", "none");
  }

  console.timeLog("TakeSnap", "Starting Exporter");
  await exporter(targetNode, config.shutterAction, config.useFallbackPngExporter);
  console.timeLog("TakeSnap", "Exporter Finished");

  windowNode.style.resize = "";
  snippetContainerNode.style.resize = "";

  setVar("container-background-color", config.backgroundColor);
  setVar("box-shadow", config.boxShadow);
  console.timeEnd("TakeSnap");
}
