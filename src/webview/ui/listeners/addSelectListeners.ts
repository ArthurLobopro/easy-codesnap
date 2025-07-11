import {
    aspectRatioSelect,
    roundingLevelSelect,
    saveFormatSelect,
    saveScaleSelect,
    shutterActionSelect,
    targetSelect,
    windowIconTypeSelect,
    windowStyleSelect,
} from "../elements";
import { handleSelectBasedChange } from "./handlers";

export function addSelectListeners() {
    handleSelectBasedChange(shutterActionSelect, "shutterAction");
    handleSelectBasedChange(saveFormatSelect, "saveFormat");
    handleSelectBasedChange(saveScaleSelect, "saveScale");
    handleSelectBasedChange(targetSelect, "target");
    handleSelectBasedChange(roundingLevelSelect, "roundingLevel");
    handleSelectBasedChange(windowStyleSelect, "windowStyle");
    // handleSelectBasedChange(zoomSelect, "zoom");
    handleSelectBasedChange(aspectRatioSelect, "aspectRatio");
    handleSelectBasedChange(windowIconTypeSelect, "windowIconType");
}
