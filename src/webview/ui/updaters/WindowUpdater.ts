import { SessionConfig } from "../../SessionConfig";
import { getDefaultWindowTitle, getWidth, px } from "../../util";
import { windowControlsNode, windowNode, windowTitleNode } from "../elements";
import { Updater } from "../Updater";

export class WindowUpdater extends Updater {
  constructor() {
    super([
      "windowStyle",
      "shouldUpdateTitle",
      "showWindowControls",
      "windowIconType",
    ]);
  }

  update() {
    const {
      windowStyle,
      shouldUpdateTitle,
      showWindowControls,
      windowIconType,
    } = SessionConfig.get();

    if (shouldUpdateTitle) {
      windowTitleNode.textContent = getDefaultWindowTitle();
    }

    windowControlsNode.setAttribute("data-icon-type", windowIconType);

    windowNode.dataset.style = windowStyle;

    windowTitleNode.style.marginRight =
      windowStyle === "macos" && showWindowControls
        ? px(getWidth(windowControlsNode))
        : "";
  }
}
