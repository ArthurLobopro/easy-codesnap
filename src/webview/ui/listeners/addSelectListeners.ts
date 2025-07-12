import {
    aspectRatioSelect,
    roundingLevelSelect,
    targetSelect,
    windowIconTypeSelect,
    windowStyleSelect,
} from "../elements";
import { handleSelectBasedChange } from "./handlers";

export function addSelectListeners() {
    handleSelectBasedChange(targetSelect, "target");
    handleSelectBasedChange(roundingLevelSelect, "roundingLevel");
    handleSelectBasedChange(windowStyleSelect, "windowStyle");
    // handleSelectBasedChange(zoomSelect, "zoom");
    handleSelectBasedChange(aspectRatioSelect, "aspectRatio");
    handleSelectBasedChange(windowIconTypeSelect, "windowIconType");
}
