import { registerInsertSVG, registerLoadSVG } from "@arthur-lobo/load-svg";
import { ContentManager } from "./ContentManager";
import { SessionConfig } from "./SessionConfig";
import { actions, type actionsKey } from "./actions";
import { takeSnap } from "./snap";
import { btnSave } from "./ui/elements";
import { addListeners } from "./ui/listeners";
import { vscode } from "./util";

registerLoadSVG();
registerInsertSVG();

btnSave.addEventListener("click", () => takeSnap());

document.addEventListener("copy", () =>
    takeSnap({ ...SessionConfig.get(), shutterAction: "copy" }),
);

document.addEventListener("paste", (e) => {
    if (!SessionConfig.get("isLocked")) {
        ContentManager.update(e.clipboardData as DataTransfer);
    }
});

window.addEventListener("message", ({ data: { type, ...config } }) => {
    if (type in actions) {
        actions[type as actionsKey](config);
    } else {
        console.log(`Unknow action on renderer: ${actions}`);
    }
});

window.addEventListener(
    "DOMContentLoaded",
    () => {
        addListeners();
        vscode.postMessage({ type: "ready" });
    },
    { once: true },
);
