import type { ExtensionConfig } from "../../../types";
import { SessionConfig } from "../../SessionConfig";
import {
    aspectRatioSelect,
    roundingLevelSelect,
    saveFormatSelect,
    saveScaleSelect,
    shutterActionSelect,
    targetSelect,
    watermarkPositionXSelect,
    watermarkPositionYSelect,
    windowStyleSelect,
    zoomSelect,
} from "../elements";
import { handleSelectBasedChange } from "./handlers";

export function addSelectListeners() {
    handleSelectBasedChange(shutterActionSelect, "shutterAction");
    handleSelectBasedChange(saveFormatSelect, "saveFormat");
    handleSelectBasedChange(saveScaleSelect, "saveScale");
    handleSelectBasedChange(targetSelect, "target");
    handleSelectBasedChange(roundingLevelSelect, "roundingLevel");
    handleSelectBasedChange(windowStyleSelect, "windowStyle");
    handleSelectBasedChange(zoomSelect, "zoom");
    handleSelectBasedChange(aspectRatioSelect, "aspectRatio");

    watermarkPositionXSelect.addEventListener("change", () => {
        const watermarkPosition = SessionConfig.get("watermarkPosition");

        SessionConfig.set({
            watermarkPosition: [
                watermarkPositionXSelect.value,
                watermarkPosition.split("-").at(-1),
            ].join("-") as ExtensionConfig["watermarkPosition"],
        });
    });

    watermarkPositionYSelect.addEventListener("change", () => {
        const watermarkPosition = SessionConfig.get("watermarkPosition");

        SessionConfig.set({
            watermarkPosition: [
                watermarkPosition.split("-").at(0),
                watermarkPositionYSelect.value,
            ].join("-") as ExtensionConfig["watermarkPosition"],
        });
    });
}
