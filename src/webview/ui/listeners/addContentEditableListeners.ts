import { SessionConfig } from "../../SessionConfig";
import { getDefaultWindowTitle } from "../../util";
import { watermarkElement /*windowTitleNode*/ } from "../elements";

export function addContentEditableListeners() {
  // addWindowTitleListeners();
  addWatermarkListeners();
}

// function addWindowTitleListeners() {
//   windowTitleNode.addEventListener("dblclick", () => {
//     windowTitleNode.contentEditable = "true";

//     const range = document.createRange();
//     range.selectNodeContents(windowTitleNode);
//     range.collapse(false);

//     const selection = window.getSelection() as Selection;
//     selection.removeAllRanges();
//     selection.addRange(range);
//   });

//   windowTitleNode.addEventListener("blur", () => {
//     windowTitleNode.contentEditable = "false";

//     const defaultTitle = getDefaultWindowTitle();
//     const currentTitle = windowTitleNode.textContent;

//     if (!currentTitle?.length || currentTitle === defaultTitle) {
//       windowTitleNode.textContent = getDefaultWindowTitle();
//       SessionConfig.set({
//         shouldUpdateTitle: true,
//       });
//       return;
//     }

//     if (currentTitle !== defaultTitle) {
//       return SessionConfig.set({
//         shouldUpdateTitle: false,
//       });
//     }
//   });

//   windowTitleNode.addEventListener("keypress", (event) => {
//     if (event.key === "Enter") {
//       windowTitleNode.blur();
//       return false;
//     }
//   });
// }

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
