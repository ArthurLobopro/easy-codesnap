import * as vscode from "vscode";
import { extensionSettingsNames } from "../../constants";
import { reduceSVG } from "../../reduceSVG";
import { ExtensionConfig } from "../../types";
import { hasOneSelection } from "../../util";
import { savePNG, saveSVG } from "./savers";

export type updateTypes = "config" | "text" | "both";

type SaveProps = { data: string; format: "svg" | "png" };

interface ActionFactoryProps {
    panel: vscode.WebviewPanel;
    update: (type: updateTypes, editorURI?: string) => Promise<void>;
}

export function ActionsFactory(props: ActionFactoryProps) {
    const { panel, update } = props;

    const flash = () => panel.webview.postMessage({ type: "flash" });

    return {
        async save({ data, format }: SaveProps) {
            flash();

            switch (format) {
                case "svg":
                    return await saveSVG(data);
                case "png":
                    return await savePNG(data);
            }
        },

        copied() {
            vscode.window.showInformationMessage("Image copied to clipboard!");
        },

        ready() {
            const editor = vscode.window.activeTextEditor;
            if (editor && hasOneSelection(editor.selections)) {
                update("both", editor.document.uri.toString());
            }
        },

        "update-config": () => update("config"),

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

            vscode.window.showInformationMessage("Settings saved as default!");
        },

        "open-settings"() {
            vscode.commands.executeCommand("easy-codesnap.openSettings");
        },

        "copy-svg"({ data }: { data: string }) {
            vscode.env.clipboard.writeText(reduceSVG(data));
        },
    };
}
