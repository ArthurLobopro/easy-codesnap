import { SessionConfig } from "../../SessionConfig";
import { windowNode } from "../elements";
import { UpdateRatio } from "../updaters";
import { addButtonListeners } from "./addButtonListeners";
import { addContentEditableListeners } from "./addContentEditableListeners";
import { addHideOneTimeConfigListener } from "./addHideOneTimeConfigListener";
import { addOpenConfigListeners } from "./addOpenConfigListeners";
import { addSelectListeners } from "./addSelectListeners";
import { addToogleListeners } from "./addToggleListeners";
import { addZoomListeners } from "./addZoomListeners";

export function addListeners() {
    addToogleListeners();
    addSelectListeners();
    addButtonListeners();
    addZoomListeners();
    addContentEditableListeners();
    addHideOneTimeConfigListener();
    addOpenConfigListeners();

    const resizeObserver = new ResizeObserver(() => {
        if (SessionConfig.get("aspectRatio") !== "none") {
            UpdateRatio();
        }
        console.log("Resize");
    });

    resizeObserver.observe(windowNode);
}
