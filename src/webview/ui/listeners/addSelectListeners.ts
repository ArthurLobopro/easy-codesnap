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
import {
    UIUpdater,
    VarUpdater,
    VisibilityUpdater,
    ZoomUpdater,
} from "../updaters";
import { handleSelectBasedChange } from "./handlers";

export function addSelectListeners() {
    handleSelectBasedChange(shutterActionSelect, "shutterAction");
    handleSelectBasedChange(saveFormatSelect, "saveFormat");
    handleSelectBasedChange(saveScaleSelect, "saveScale");

    handleSelectBasedChange(targetSelect, "target", VisibilityUpdater);
    handleSelectBasedChange(roundingLevelSelect, "roundingLevel", VarUpdater);
    handleSelectBasedChange(windowStyleSelect, "windowStyle", UIUpdater);
    handleSelectBasedChange(zoomSelect, "zoom", ZoomUpdater);
    handleSelectBasedChange(
        aspectRatioSelect,
        "aspectRatio",
        VisibilityUpdater,
    );
}
