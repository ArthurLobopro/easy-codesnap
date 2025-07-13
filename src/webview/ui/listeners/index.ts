import { SessionConfig } from "../../SessionConfig";
import { snippetContainerNode, windowNode } from "../elements";
import { UpdateRatio, UpdateTargetProportion } from "../updaters";
import { addContentEditableListeners } from "./addContentEditableListeners";
import { addHideOneTimeConfigListener } from "./addHideOneTimeConfigListener";
import { addOpenConfigListeners } from "./addOpenConfigListeners";
import { addSelectListeners } from "./addSelectListeners";
import { addToogleListeners } from "./addToggleListeners";

export function addListeners() {
    addToogleListeners();
    addSelectListeners();
    addContentEditableListeners();
    addHideOneTimeConfigListener();
    addOpenConfigListeners();

    const resizeObserver = new ResizeObserver(() => {
        if (SessionConfig.get("aspectRatio") !== "none") {
            UpdateRatio();
        }

        UpdateTargetProportion();
        console.log("Resize");
    });

    resizeObserver.observe(snippetContainerNode);
    resizeObserver.observe(windowNode);
}
