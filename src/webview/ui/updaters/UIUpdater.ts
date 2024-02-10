import { SessionConfig } from "../../SessionConfig";
import { windowNode, windowTitleNode } from "../../elements";
import { LinkButtonUpdater, LockButtonUpdater } from "./ButtonsUpdater";
import { LineNumbersUpdater } from "./LineNumbersUpdater";
import { OneTimeConfigUpdater } from "./OneTimeConfigUpdater";
import { VarUpdater } from "./VarUpdater";
import { VisibilityUpdater } from "./VisibilityUpdater";
import { ZoomUpdater } from "./ZoomUpdater";

export function UIUpdater() {
    const {
        templates: { fileName, workspace },
        windowStyle,
        windowTitleTemplate,
    } = SessionConfig.get();

    VarUpdater();
    VisibilityUpdater();
    LineNumbersUpdater();
    OneTimeConfigUpdater();
    LockButtonUpdater();
    LinkButtonUpdater();
    ZoomUpdater();

    windowTitleNode.textContent = windowTitleTemplate
        .replace(/\{fileName\}/g, fileName)
        .replace(/\{workspace\}/g, workspace);
    windowNode.dataset.style = windowStyle;
}
