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
                watermarkPosition.split("-")[0],
                watermarkPositionXSelect.value,
            ].join("-") as ExtensionConfig["watermarkPosition"],
        });
    });

    watermarkPositionYSelect.addEventListener("change", () => {
        const watermarkPosition = SessionConfig.get("watermarkPosition");

        SessionConfig.set({
            watermarkPosition: [
                watermarkPositionYSelect.value,
                watermarkPosition.split("-")[1],
            ].join("-") as ExtensionConfig["watermarkPosition"],
        });
    });
}
