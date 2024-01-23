import { getSessionConfig } from "../../configManager"
import { windowNode, windowTitleNode } from "../../elements"
import { LinkButtonUpdater, LockButtonUpdater } from "./ButtonsUpdater"
import { LineNumbersUpdater } from "./LineNumbersUpdater"
import { OneTimeConfigUpdater } from "./OneTimeConfigUpdater"
import { VarUpdater } from "./VarUpdater"
import { VisibilityUpdater } from "./VisibilityUpdater"


export function UIUpdater() {
    const {
        windowTitle, windowStyle
    } = getSessionConfig()

    VarUpdater()
    VisibilityUpdater()
    LineNumbersUpdater()
    OneTimeConfigUpdater()
    LockButtonUpdater()
    LinkButtonUpdater()

    windowTitleNode.textContent = windowTitle
    windowNode.dataset.style = windowStyle
}
