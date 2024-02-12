import {
    roundingLevelSelect,
    saveFormatSelect,
    shutterActionSelect,
    targetSelect,
    windowStyleSelect,
    zoomSelect,
} from "../../elements";
import { UIUpdater, VarUpdater, ZoomUpdater } from "../updaters";
import { handleSelectBasedChange } from "./handlers";

export function addSelectListeners() {
    handleSelectBasedChange(shutterActionSelect, "shutterAction");
    handleSelectBasedChange(targetSelect, "target");
    handleSelectBasedChange(saveFormatSelect, "saveFormat");

    handleSelectBasedChange(roundingLevelSelect, "roundingLevel", VarUpdater);
    handleSelectBasedChange(windowStyleSelect, "windowStyle", UIUpdater);
    handleSelectBasedChange(zoomSelect, "zoom", ZoomUpdater);
}
