import * as vscode from "vscode";
import { message } from "../../types";
import { hasOneSelection } from "../../util";
import { ActionsFactory, updateTypes } from "./ActionsFactory";
import { createPanel } from "./createPanel";
import { getConfig } from "./getConfig";

export function SnapFactory(context: vscode.ExtensionContext) {
    return async () => {
        const panel = await createPanel(context);

        const update = async (updateType: updateTypes, editorURI?: string) => {
            if (updateType !== "config") {
                await vscode.commands.executeCommand(
                    "editor.action.clipboardCopyWithSyntaxHighlightingAction",
                );
            }

            panel.webview.postMessage({
                type: updateType === "both" ? "update" : `update-${updateType}`,
                ...getConfig(),
                ...(editorURI ? { editorID: editorURI } : {}),
            });
        };

        const actions = ActionsFactory({ panel, update });

        panel.webview.onDidReceiveMessage(
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
                update("text", e.textEditor.document.uri.toString()),
        );
        panel.onDidDispose(() => selectionHandler.dispose());
    };
}
