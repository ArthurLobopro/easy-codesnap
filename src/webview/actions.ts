import { omit, pick, pickAllExcept } from "@arthur-lobo/object-pick";
import * as l10n from "@vscode/l10n";
import type { ConfigSentToWebview } from "../types";
import { SessionConfig, useSessionConfig } from "./SessionConfig";
import { cameraFlashAnimation } from "./snap";
import { UpdateCode } from "./ui/updaters";
import { TranslationUpdater } from "./ui/updaters/TranslationUpdater";
import { vscode } from "./util";

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

    SessionConfig.set(omit(config, ["linkOnOpen", "lockOnOpen", "bundle"]));

    document.execCommand("paste");

    useSessionConfig.getState().set({
      isLinked: config.linkOnOpen,
      isLocked: config.lockOnOpen,
      isReady: true,
    });
  },

  "get-webview-config"() {
    vscode.postMessage({
      type: "set-webview-config",
      config: {
        isLocked: SessionConfig.get("isLocked"),
        isLinked: SessionConfig.get("isLinked"),
        linkedId: SessionConfig.get("editorID") ?? "",
      },
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
        pick(config, [
          "templates",
          "startLine",
          "editorID",
          "symbolBreadcrumbs",
        ]),
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
