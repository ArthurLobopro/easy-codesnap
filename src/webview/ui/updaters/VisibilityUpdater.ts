import { SessionConfig } from "../../SessionConfig";
import {
    navbarNode,
    roundingLevelSelect,
    saveFormatSelect,
    shutterActionSelect,
    targetSelect,
    windowControlsNode,
    windowStyleSelect,
    windowTitleNode,
} from "../../elements";

function getWidth(element: HTMLElement) {
    return element.getBoundingClientRect().width;
}

export function VisibilityUpdater() {
    const { showWindowControls, showWindowTitle } = SessionConfig.get();

    navbarNode.style.display =
        !showWindowControls && !showWindowTitle ? "none" : "";
    windowControlsNode.hidden = !showWindowControls;
    windowTitleNode.hidden = !showWindowTitle;

    const biggerSelectWidth = `${getWidth(windowStyleSelect)}px`;

    targetSelect.style.width = biggerSelectWidth;
    shutterActionSelect.style.width = biggerSelectWidth;
    roundingLevelSelect.style.width = biggerSelectWidth;
    saveFormatSelect.style.width = biggerSelectWidth;
}
