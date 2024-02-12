import { SessionConfig } from "../../SessionConfig";
import { windowTitleNode } from "../../elements";
import { getDefaultWindowTitle } from "../../util";

export function addWindowTitleListeners() {
    windowTitleNode.addEventListener("dblclick", () => {
        windowTitleNode.contentEditable = "true";

        const range = document.createRange();
        range.selectNodeContents(windowTitleNode);
        range.collapse(false);

        const selection = window.getSelection() as Selection;
        selection.removeAllRanges();
        selection.addRange(range);
    });

    windowTitleNode.addEventListener("blur", () => {
        windowTitleNode.contentEditable = "false";

        const defaultTitle = getDefaultWindowTitle();
        const currentTitle = windowTitleNode.textContent;

        if (!currentTitle?.length || currentTitle === defaultTitle) {
            windowTitleNode.textContent = getDefaultWindowTitle();
            SessionConfig.set({
                shouldUpdateTitle: true,
            });
            return;
        }

        if (currentTitle !== defaultTitle) {
            return SessionConfig.set({
                shouldUpdateTitle: false,
            });
        }
    });

    windowTitleNode.addEventListener("keypress", (event) => {
        if (event.key === "Enter") {
            windowTitleNode.blur();
            return false;
        }
    });
}
