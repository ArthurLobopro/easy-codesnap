import * as vscode from "vscode";
import { message } from "../../types";
import { hasOneSelection } from "../../util";
import { SnapActions, updateTypes } from "./SnapActions";
import { getConfig } from "./getConfig";

export class PanelController {
    panel: vscode.WebviewPanel;

    constructor(panel: vscode.WebviewPanel) {
        this.panel = panel;
    }

    async update(updateType: updateTypes, editorURI?: string) {
        if (updateType !== "config") {
            await vscode.commands.executeCommand(
                "editor.action.clipboardCopyWithSyntaxHighlightingAction",
            );
        }

        this.panel.webview.postMessage({
            type: updateType === "both" ? "update" : `update-${updateType}`,
            ...getConfig(),
            ...(editorURI ? { editorID: editorURI } : {}),
        });
    }

    init() {
        const actions = new SnapActions(this);

        this.panel.webview.onDidReceiveMessage(
            async ({ type, ...args }: message) => {
                if (type in actions) {
                    actions[type]({ ...args } as any);
                } else {
                    vscode.window.showErrorMessage(
                        `Easy CodeSnap 📸: Unknown shutterAction "${type}"`,
                    );
                }
            },
        );

        const selectionHandler = vscode.window.onDidChangeTextEditorSelection(
            (e) =>
                hasOneSelection(e.selections) &&
                this.update("text", e.textEditor.document.uri.toString()),
        );
        this.panel.onDidDispose(() => selectionHandler.dispose());
    }
}
