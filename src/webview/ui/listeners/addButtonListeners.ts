import { SessionConfig } from "../../SessionConfig";
import { vscode } from "../../util";
import {
    openSettingsButton,
    resetConfigButton,
    saveConfigButton,
} from "../elements";

export function addButtonListeners() {
    resetConfigButton.addEventListener("click", () => {
        vscode.postMessage({ type: "update-config" });
    });

    saveConfigButton.addEventListener("click", () => {
        vscode.postMessage({
            type: "save-config",
            config: SessionConfig.get(),
        });
    });

    openSettingsButton.addEventListener("click", () => {
        vscode.postMessage({ type: "open-settings" });
    });
}
