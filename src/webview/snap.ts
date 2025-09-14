import { exportPNG, exportSVG } from "./exporters";
import { SessionConfig } from "./SessionConfig";
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

export async function takeSnap(config = SessionConfig.get()) {
  console.time("TakeSnap");
  const target = config.target === "container" ? snippetContainerNode : windowNode;

  const exporter = config.saveFormat === "svg" ? exportSVG : exportPNG;

  windowNode.style.resize = "none";
  snippetContainerNode.style.resize = "none";

  if (config.transparentBackground || config.target === "window") {
    setVar("container-background-color", "transparent");
  }

  if (config.target === "window") {
    setVar("box-shadow", "none");
  }

  console.timeLog("TakeSnap", "Starting Exporter");
  await exporter(target, config.shutterAction);
  console.timeLog("TakeSnap", "Exporter Finished");

  windowNode.style.resize = "";
  snippetContainerNode.style.resize = "";

  setVar("container-background-color", config.backgroundColor);
  setVar("box-shadow", config.boxShadow);
  console.timeEnd("TakeSnap");
}
