import { getSessionConfig } from "../../configManager";
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

export function VisibilityUpdater() {
    const { showWindowControls, showWindowTitle } = getSessionConfig();

    navbarNode.style.display =
        !showWindowControls && !showWindowTitle ? "none" : "";
    windowControlsNode.hidden = !showWindowControls;
    windowTitleNode.hidden = !showWindowTitle;

    const biggerSelectWidth = `${
        windowStyleSelect.getBoundingClientRect().width
    }px`;

    targetSelect.style.width = biggerSelectWidth;
    shutterActionSelect.style.width = biggerSelectWidth;
    roundingLevelSelect.style.width = biggerSelectWidth;
    saveFormatSelect.style.width = biggerSelectWidth;
}
