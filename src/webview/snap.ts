import { SessionConfig } from "./SessionConfig";
import { flashFx, snippetContainerNode, windowNode } from "./elements";
import { exportPNG, exportSVG } from "./exporters";
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
    windowNode.style.resize = "none";

    if (config.transparentBackground || config.target === "window") {
        setVar("container-background-color", "transparent");
    }

    const target =
        config.target === "container" ? snippetContainerNode : windowNode;

    if (config.saveFormat === "png") {
        await exportPNG(target, config.shutterAction);
    }

    if (config.saveFormat === "svg") {
        await exportSVG(target, config.shutterAction);
    }

    windowNode.style.resize = "";
    setVar("container-background-color", config.backgroundColor);
}
