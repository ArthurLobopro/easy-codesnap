import type { ExtensionConfig } from "../../../types";
import { SessionConfig } from "../../SessionConfig";
import { Updater } from "../Updater";
import {
    watermarkElement,
    watermarkPositionXSelect,
    watermarkPositionYSelect,
} from "../elements";

export class WatermarkUpdater extends Updater {
    constructor() {
        super(["watermark", "watermarkText", "watermarkPosition", "target"]);
    }

    update() {
        const { watermark, watermarkText, watermarkPosition, target } =
            SessionConfig.get();

        if (watermark) {
            watermarkElement.style.display = "";
            watermarkElement.innerText = watermarkText;
            watermarkElement.dataset.target = target;

            watermarkPositionXSelect.parentElement!.style.display = "";
            watermarkPositionYSelect.parentElement!.style.display = "";
        } else {
            watermarkElement.style.display = "none";

            watermarkPositionXSelect.parentElement!.style.display = "none";
            watermarkPositionYSelect.parentElement!.style.display = "none";
        }

        if (watermarkPosition) {
            const [watermarkY, watermarkX] = watermarkPosition.split("-");

            if (target === "window" && watermarkY === "top") {
                return SessionConfig.set({
                    watermarkPosition:
                        `bottom-${watermarkX}` as ExtensionConfig["watermarkPosition"],
                });
            }

            watermarkPositionXSelect.value = watermarkX;
            watermarkPositionYSelect.value = watermarkY;

            watermarkElement.setAttribute(
                "data-watermark-position",
                watermarkPosition,
            );
        }

        watermarkPositionYSelect.disabled = target === "window";
    }
}
