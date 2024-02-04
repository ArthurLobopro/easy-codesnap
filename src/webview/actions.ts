import { pick, pickAllExcept } from "@arthur-lobo/object-pick";
import { ConfigSentToWebview } from "../types";
import { cameraFlashAnimation } from "./snap";
import { UIUpdater, UpdateCode } from "./ui/updaters";

import {
    alreadyHasSessionConfig,
    getSessionConfig,
    setSessionConfig,
} from "./configManager";

export type actionsKey = keyof typeof actions;

export const actions = {
    flash: cameraFlashAnimation,

    update(config: ConfigSentToWebview) {
        if (alreadyHasSessionConfig() && getSessionConfig().isLocked) {
            return;
        }

        setSessionConfig(pickAllExcept(config, ["linkOnOpen", "lockOnOpen"]));
        document.execCommand("paste");

        setSessionConfig({
            isLinked: config.linkOnOpen,
            isLocked: config.lockOnOpen,
        });

        UIUpdater();
    },

    "update-text"(config: ConfigSentToWebview) {
        if (!alreadyHasSessionConfig()) {
            setSessionConfig(config);
        } else {
            const { isLocked, isLinked, editorID } = getSessionConfig();

            if (isLocked || (isLinked && editorID !== config.editorID)) {
                return;
            }

            setSessionConfig(
                pick(config, ["windowTitle", "startLine", "editorID"]),
            );
        }

        UIUpdater();
        document.execCommand("paste");
    },

    "update-config"(config: ConfigSentToWebview) {
        setSessionConfig(
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
