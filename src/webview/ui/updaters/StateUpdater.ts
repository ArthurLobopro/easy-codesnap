import { SessionConfig } from "../../SessionConfig";
import { vscode } from "../../util";
import { Updater } from "../Updater";

export class StateUpdater extends Updater {
  constructor() {
    super(["isLocked", "isLinked", "editorID"]);
  }

  update(): void {
    const { isLocked, isLinked, editorID } = SessionConfig.get();

    vscode.postMessage({
      type: "set-webview-config",
      config: {
        isLocked,
        isLinked,
        linkedId: editorID ?? "",
      },
    });
  }
}
