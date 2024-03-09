import { SessionConfig } from "../../SessionConfig";
import { getDefaultWindowTitle } from "../../util";
import { windowNode, windowTitleNode } from "../elements";
import { LinkButtonUpdater, LockButtonUpdater } from "./ButtonsUpdater";
import { LineNumbersUpdater } from "./LineNumbersUpdater";
import { OneTimeConfigUpdater } from "./OneTimeConfigUpdater";
import { VarUpdater } from "./VarUpdater";
import { VisibilityUpdater } from "./VisibilityUpdater";
import { ZoomUpdater } from "./ZoomUpdater";

export function UIUpdater() {
    const { windowStyle, shouldUpdateTitle } = SessionConfig.get();

    VarUpdater();
    VisibilityUpdater();
    LineNumbersUpdater();
    OneTimeConfigUpdater();
    LockButtonUpdater();
    LinkButtonUpdater();
    ZoomUpdater();

    if (shouldUpdateTitle) {
        windowTitleNode.textContent = getDefaultWindowTitle();
    }

    windowNode.dataset.style = windowStyle;
}
