import { SessionConfig } from "../../SessionConfig";
import { watermarkElement /*windowTitleNode*/ } from "../elements";

export function addContentEditableListeners() {
  addWatermarkListeners();
}

function addWatermarkListeners() {
  watermarkElement.addEventListener("dblclick", () => {
    watermarkElement.contentEditable = "true";

    const range = document.createRange();
    range.selectNodeContents(watermarkElement);
    range.collapse(false);

    const selection = window.getSelection() as Selection;
    selection.removeAllRanges();
    selection.addRange(range);
  });

  watermarkElement.addEventListener("blur", () => {
    watermarkElement.contentEditable = "false";

    const currentWatermarkText = watermarkElement.textContent?.trim();

    if (!currentWatermarkText?.length) {
      const defaultWatermarkText = SessionConfig.get("defaultWatermarkText");
      SessionConfig.set({
        watermarkText: defaultWatermarkText,
      });
      watermarkElement.textContent = defaultWatermarkText;
      return;
    }

    SessionConfig.set({
      watermarkText: currentWatermarkText,
    });
  });

  watermarkElement.addEventListener("keypress", (event) => {
    if (event.key === "Enter") {
      watermarkElement.blur();
      return false;
    }
  });
}
