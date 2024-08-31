import {
    aspectRatioSelect,
    roundingLevelSelect,
    saveFormatSelect,
    saveScaleSelect,
    shutterActionSelect,
    targetSelect,
    windowStyleSelect,
    zoomSelect,
} from "../elements";
import { UIUpdater, VisibilityUpdater } from "../updaters";
import { handleSelectBasedChange } from "./handlers";

export function addSelectListeners() {
    handleSelectBasedChange(shutterActionSelect, "shutterAction");
    handleSelectBasedChange(saveFormatSelect, "saveFormat");
    handleSelectBasedChange(saveScaleSelect, "saveScale");

    handleSelectBasedChange(targetSelect, "target", VisibilityUpdater);
    handleSelectBasedChange(roundingLevelSelect, "roundingLevel");
    handleSelectBasedChange(windowStyleSelect, "windowStyle", UIUpdater);
    handleSelectBasedChange(zoomSelect, "zoom");
    handleSelectBasedChange(
        aspectRatioSelect,
        "aspectRatio",
        VisibilityUpdater,
    );
}
