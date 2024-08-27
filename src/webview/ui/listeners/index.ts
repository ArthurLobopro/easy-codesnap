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
}
