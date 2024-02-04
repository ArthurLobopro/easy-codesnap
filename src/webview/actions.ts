import { pick, pickAllExcept } from "@arthur-lobo/object-pick";
import { ConfigSentToWebview } from "../types";
import { SessionConfig } from "./SessionConfig";
import { cameraFlashAnimation } from "./snap";
import { UIUpdater, UpdateCode } from "./ui/updaters";

export type actionsKey = keyof typeof actions;

export const actions = {
    flash: cameraFlashAnimation,

    update(config: ConfigSentToWebview) {
        if (SessionConfig.hasConfig && SessionConfig.get("isLocked")) {
            return;
        }

        SessionConfig.set(pickAllExcept(config, ["linkOnOpen", "lockOnOpen"]));

        document.execCommand("paste");

        SessionConfig.set({
            isLinked: config.linkOnOpen,
            isLocked: config.lockOnOpen,
        });

        UIUpdater();
    },

    "update-text"(config: ConfigSentToWebview) {
        if (!SessionConfig.hasConfig) {
            SessionConfig.set(config);
        } else {
            const { isLocked, isLinked, editorID } = SessionConfig.get();

            if (isLocked || (isLinked && editorID !== config.editorID)) {
                return;
            }

            SessionConfig.set(
                pick(config, ["windowTitle", "startLine", "editorID"]),
            );
        }

        UIUpdater();
        document.execCommand("paste");
    },

    "update-config"(config: ConfigSentToWebview) {
        SessionConfig.set(
            pickAllExcept(config, [
                "startLine",
                "windowTitle",
                "editorID",
                "linkOnOpen",
                "lockOnOpen",
            ]),
        );

        UIUpdater();
        UpdateCode();
    },
};
