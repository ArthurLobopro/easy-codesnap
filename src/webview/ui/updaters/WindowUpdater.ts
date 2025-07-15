import { SessionConfig } from "../../SessionConfig";
import { windowNode } from "../elements";
import { Updater } from "../Updater";

export class WindowUpdater extends Updater {
  constructor() {
    super(["windowStyle"]);
  }

  update() {
    const { windowStyle } = SessionConfig.get();

    windowNode.dataset.style = windowStyle;
  }
}
