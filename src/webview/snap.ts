import { exportPNG, exportSVG, exportWEBP } from "./exporters";
import { type ISessionConfig, useSessionConfig } from "./SessionConfig";
import { cameraFlashAnimation } from "./ui/animations";
import { snippetContainerNode, windowNode } from "./ui/elements";
import { setVar } from "./util";

export async function takeSnap(
  { target, transparentBackground, ...config }: Omit<ISessionConfig, "set"> = useSessionConfig.getState(),
) {
  console.time("TakeSnap");
  const targetNode = target === "container" ? snippetContainerNode : windowNode;

  const exporter = { svg: exportSVG, png: exportPNG, webp: exportWEBP }[config.saveFormat];

  setupBeforeSnap({ transparentBackground, target });

  console.timeLog("TakeSnap", "Starting Exporter");
  cameraFlashAnimation()
  await exporter(targetNode, config.shutterAction, config.useFallbackPngExporter);
  console.timeLog("TakeSnap", "Exporter Finished");

  restoreAfterSnap(config);

  console.timeEnd("TakeSnap");
}

type SetupBeforeSnapProps = Pick<ISessionConfig, "transparentBackground" | "target">;

function setupBeforeSnap({ transparentBackground, target }: SetupBeforeSnapProps) {
  windowNode.style.resize = "none";
  snippetContainerNode.style.resize = "none";
  snippetContainerNode.setAttribute("data-state", "snap");

  if (transparentBackground || target === "window") {
    setVar("container-background-color", "transparent");
  }

  if (target === "window" || (target === "container" && transparentBackground)) {
    setVar("box-shadow", "none");
  }
}

type RestoreAfterSnapProps = Pick<ISessionConfig, "backgroundColor" | "boxShadow">;

function restoreAfterSnap(config: RestoreAfterSnapProps) {
  windowNode.style.resize = "";
  snippetContainerNode.style.resize = "";
  snippetContainerNode.setAttribute("data-state", "edit");

  setVar("container-background-color", config.backgroundColor);
  setVar("box-shadow", config.boxShadow);
}
