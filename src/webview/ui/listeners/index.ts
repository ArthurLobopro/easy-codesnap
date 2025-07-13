import { SessionConfig } from "../../SessionConfig";
import { snippetContainerNode, windowNode } from "../elements";
import { UpdateRatio, UpdateTargetProportion } from "../updaters";
import { addContentEditableListeners } from "./addContentEditableListeners";
import { addOpenConfigListeners } from "./addOpenConfigListeners";

export function addListeners() {
    addContentEditableListeners();
    // addHideOneTimeConfigListener();
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
