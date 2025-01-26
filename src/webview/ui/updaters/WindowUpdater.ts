import { SessionConfig } from "../../SessionConfig";
import { getDefaultWindowTitle, getWidth, px } from "../../util";
import { Updater } from "../Updater";
import { windowControlsNode, windowNode, windowTitleNode } from "../elements";

export class WindowUpdater extends Updater {
    constructor() {
        super(["windowStyle", "shouldUpdateTitle", "showWindowControls"]);
    }

    update() {
        const { windowStyle, shouldUpdateTitle, showWindowControls } =
            SessionConfig.get();

        if (shouldUpdateTitle) {
            windowTitleNode.textContent = getDefaultWindowTitle();
        }

        windowNode.dataset.style = windowStyle;

        windowTitleNode.style.marginRight =
            windowStyle === "macos" && showWindowControls
                ? px(getWidth(windowControlsNode))
                : "";
    }
}
