import * as vscode from "vscode";
import { extensionSettingsNames } from "../../constants";
import type { ExtensionConfig } from "../../types";
import { delay, hasOneSelection, t } from "../../util";
import type {
    IPanelWebviewConfig,
    PanelWebviewConfig,
} from "./PanelWebviewConfig";
import { savePNG, saveSVG } from "./savers";

export type updateTypes = "config" | "text" | "both";

type SaveProps = { data: string; format: "svg" | "png" };

interface SnapActionsProps {
    panel: vscode.WebviewPanel;
    update: (type: updateTypes, editorURI?: string) => Promise<void>;
    webViewConfig: PanelWebviewConfig;
}

export class SnapActions {
    private panel: vscode.WebviewPanel;
    private update: SnapActionsProps["update"];
    private webViewConfig: PanelWebviewConfig;

    constructor(props: SnapActionsProps) {
        this.panel = props.panel;
        this.webViewConfig = props.webViewConfig;
        this.update = (...args) => props.update(...args);
    }

    private flash() {
        this.panel.webview.postMessage({ type: "flash" });
    }

    async save({ data, format }: SaveProps) {
        this.flash();

        switch (format) {
            case "svg":
                return await saveSVG(data);
            case "png":
                return await savePNG(data);
        }
    }

    copied() {
        vscode.window.showInformationMessage(t("Image copied to clipboard!"));
    }

    async ready() {
        const editor = vscode.window.activeTextEditor;
        if (editor && hasOneSelection(editor.selections)) {
            this.update("both", editor.document.uri.toString());
        }

        await delay(100);

        this.panel.webview.postMessage({
            type: "get-webview-config",
        });
    }

    "set-webview-config" = ({ config }: { config: IPanelWebviewConfig }) => {
        this.webViewConfig.set(config);
    };

    "update-config"() {
        this.update("config");
    }

    "save-config"({ config }: { config: ExtensionConfig }) {
        const extensionSettings =
            vscode.workspace.getConfiguration("easy-codesnap");

        extensionSettingsNames.forEach((name) => {
            if (
                name in config &&
                extensionSettings.get(name) !== config[name]
            ) {
                extensionSettings.update(
                    name,
                    config[name],
                    vscode.ConfigurationTarget.Global,
                );
            }
        });

        vscode.window.showInformationMessage(t("Settings saved as default!"));
    }

    "open-settings"() {
        vscode.commands.executeCommand("easy-codesnap.openSettings");
    }

    "open-config"({ configName }: { configName: string }) {
        vscode.commands.executeCommand(
            "workbench.action.openSettings",
            `@id:easy-codesnap.${configName}`,
        );
    }

    "copy-svg"({ data }: { data: string }) {
        vscode.env.clipboard.writeText(data);
    }
}
