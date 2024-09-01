import { SessionConfig } from "../../SessionConfig";
import { getDefaultWindowTitle, getWidth } from "../../util";
import { Updater } from "../Updater";
import { windowControlsNode, windowNode, windowTitleNode } from "../elements";

export class WindowUpdater extends Updater {
    constructor() {
        super(["windowStyle", "shouldUpdateTitle"]);
    }

    update() {
        const { windowStyle, shouldUpdateTitle } = SessionConfig.get();

        if (shouldUpdateTitle) {
            windowTitleNode.textContent = getDefaultWindowTitle();
        }

        windowNode.dataset.style = windowStyle;

        windowTitleNode.style.marginRight =
            windowStyle === "macos" ? `${getWidth(windowControlsNode)}px` : "";
    }
}
