import { registerInsertSVG, registerLoadSVG } from "@arthur-lobo/load-svg";
import { ContentManager } from "./ContentManager";
import { getSessionConfig } from "./SessionConfig";
import { actions, actionsKey } from "./actions";
import { btnSave } from "./elements";
import { takeSnap } from "./snap";
import { addListeners } from "./ui/listeners";
import { vscode } from "./util";

registerLoadSVG();
registerInsertSVG();

btnSave.addEventListener("click", () => takeSnap());

document.addEventListener("copy", () =>
    takeSnap({ ...getSessionConfig(), shutterAction: "copy" }),
);

document.addEventListener("paste", (e) => {
    const { isLocked } = getSessionConfig();

    if (!isLocked) {
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
