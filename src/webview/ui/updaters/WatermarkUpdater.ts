import type { ExtensionConfig } from "../../../types";
import { SessionConfig } from "../../SessionConfig";
import {
    watermarkBottomLeft,
    watermarkBottomRight,
    watermarkElement,
    watermarkTopLeft,
    watermarkTopRight,
} from "../elements";
import { Updater } from "../Updater";

export class WatermarkUpdater extends Updater {
    constructor() {
        super(["watermark", "watermarkText", "watermarkPosition", "target"]);
    }

    private resetPositionInputs() {
        [
            watermarkTopLeft,
            watermarkTopRight,
            watermarkBottomRight,
            watermarkBottomLeft,
        ].forEach((el) => {
            el.checked = false;
            el.parentElement!.style.display = "";
        });
    }

    private hideTops() {
        [watermarkTopLeft, watermarkTopRight].forEach((el) => {
            el.checked = false;
            el.parentElement!.style.display = "none";
        });
    }

    private inputs = {
        "top-right": watermarkTopRight,
        "top-left": watermarkTopLeft,
        "bottom-right": watermarkBottomRight,
        "bottom-left": watermarkBottomLeft,
    };

    update() {
        const { watermark, watermarkText, watermarkPosition, target } =
            SessionConfig.get();

        const [watermarkY, watermarkX] = watermarkPosition.split("-");

        if (target === "window" && watermarkY === "top") {
            return SessionConfig.set({
                watermarkPosition:
                    `bottom-${watermarkX}` as ExtensionConfig["watermarkPosition"],
            });
        }

        this.resetPositionInputs();

        if (target === "window") {
            this.hideTops();
        }

        this.inputs[watermarkPosition].checked = true;

        if (!watermark) {
            watermarkElement.style.display = "none";
            return;
        }

        watermarkElement.style.display = "";
        watermarkElement.innerText = watermarkText;
        watermarkElement.dataset.target = target;

        if (watermarkPosition) {
            watermarkElement.setAttribute(
                "data-watermark-position",
                watermarkPosition,
            );
        }
    }
}
