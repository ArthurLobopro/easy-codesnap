import type { ExtensionConfig } from "../../../types";
import { SessionConfig } from "../../SessionConfig";
import { watermarkElement } from "../elements";

import { Updater } from "../Updater";

export class WatermarkUpdater extends Updater {
  constructor() {
    super(["watermark", "watermarkText", "watermarkPosition", "target"]);
  }

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
