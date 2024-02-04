import { pick, pickAllExcept } from "@arthur-lobo/object-pick";
import { ConfigSentToWebview } from "../types";
import { cameraFlashAnimation } from "./snap";
import { UIUpdater, UpdateCode } from "./ui/updaters";

import { ConfigProvider } from "./configManager";

export type actionsKey = keyof typeof actions;

export const actions = {
    flash: cameraFlashAnimation,

    update(config: ConfigSentToWebview) {
        if (ConfigProvider.hasConfig && ConfigProvider.get().isLocked) {
            return;
        }

        ConfigProvider.set(pickAllExcept(config, ["linkOnOpen", "lockOnOpen"]));

        document.execCommand("paste");

        ConfigProvider.set({
            isLinked: config.linkOnOpen,
            isLocked: config.lockOnOpen,
        });

        UIUpdater();
    },

    "update-text"(config: ConfigSentToWebview) {
        if (!ConfigProvider.hasConfig) {
            ConfigProvider.set(config);
        } else {
            const { isLocked, isLinked, editorID } = ConfigProvider.get();

            if (isLocked || (isLinked && editorID !== config.editorID)) {
                return;
            }

            ConfigProvider.set(
                pick(config, ["windowTitle", "startLine", "editorID"]),
            );
        }

        UIUpdater();
        document.execCommand("paste");
    },

    "update-config"(config: ConfigSentToWebview) {
        ConfigProvider.set(
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
