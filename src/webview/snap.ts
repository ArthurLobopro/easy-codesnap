import { getRasterSize, isRasterSizeSafe } from "./captureLimits";
import { exportPNG, exportSVG, exportWEBP } from "./exporters";
import { type ISessionConfig, useSessionConfig } from "./SessionConfig";
import { flashFx, shutterAnimationContainer, snippetContainerNode, windowNode } from "./ui/elements";
import { once, redraw, setVar, vscode } from "./util";

let capturing = false;

async function blinkAnimation() {
  flashFx.style.display = "block";
  redraw(flashFx);
  flashFx.style.opacity = "0";

  await once(flashFx, "transitionend");
  flashFx.style.display = "none";
  flashFx.style.opacity = "1";
}

async function shutterAnimation() {
  shutterAnimationContainer.setAttribute("data-animation-state", "animating");
  await once(shutterAnimationContainer, "animationend");
  shutterAnimationContainer.setAttribute("data-animation-state", "none");
}

export async function cameraFlashAnimation() {
  const action = useSessionConfig.getState().shutterActionAnimation;
  if (action === "flash") {
    blinkAnimation();
    return;
  }

  shutterAnimation();
}

export async function takeSnap(
  { target, transparentBackground, ...config }: Omit<ISessionConfig, "set"> = useSessionConfig.getState(),
) {
  if (capturing) return;
  capturing = true;
  const targetNode = target === "container" ? snippetContainerNode : windowNode;

  const exporter = { svg: exportSVG, png: exportPNG, webp: exportWEBP }[config.saveFormat];

  try {
    setupBeforeSnap({ transparentBackground, target });

    if (config.saveFormat === "webp") {
      const size = getRasterSize(targetNode, config.saveScale, false);
      if (!isRasterSizeSafe(size)) {
        vscode.postMessage({ type: "capture-too-large", ...size });
        return;
      }
    }

    await exporter(targetNode, config.shutterAction, config.useFallbackPngExporter);
  } catch (error) {
    console.error("Failed to take screenshot", error);
    vscode.postMessage({ type: "capture-error", reason: error instanceof Error ? error.message : String(error) });
  } finally {
    const latest = useSessionConfig.getState();
    restoreAfterSnap({
      backgroundColor: latest?.backgroundColor ?? config.backgroundColor,
      boxShadow: latest?.boxShadow ?? config.boxShadow,
    });
    capturing = false;
  }
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
