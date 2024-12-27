import { pick, pickAllExcept } from "@arthur-lobo/object-pick";
import * as l10n from "@vscode/l10n";
import type { ConfigSentToWebview } from "../types";
import { SessionConfig } from "./SessionConfig";
import { cameraFlashAnimation } from "./snap";
import { UpdateCode } from "./ui/updaters";
import { TranslationUpdater } from "./ui/updaters/TranslationUpdater";

export type actionsKey = keyof typeof actions;

export const actions = {
    flash: cameraFlashAnimation,

    update(config: ConfigSentToWebview & { bundle: string }) {
        if (SessionConfig.hasConfig && SessionConfig.get("isLocked")) {
            return;
        }

        l10n.config({
            contents: JSON.parse(config.bundle ?? "{}"),
        });

        TranslationUpdater();

        SessionConfig.set(
            pickAllExcept(config, ["linkOnOpen", "lockOnOpen", "bundle"]),
        );

        document.execCommand("paste");

        SessionConfig.set({
            isLinked: config.linkOnOpen,
            isLocked: config.lockOnOpen,
        });
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
                pick(config, ["templates", "startLine", "editorID"]),
            );
        }

        document.execCommand("paste");
    },

    "update-config"(config: ConfigSentToWebview) {
        SessionConfig.set(
            pickAllExcept(config, [
                "startLine",
                "templates",
                "editorID",
                "linkOnOpen",
                "lockOnOpen",
            ]),
        );

        UpdateCode();
    },
};
