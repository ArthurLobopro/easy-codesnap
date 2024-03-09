import * as vscode from "vscode";
import { message } from "../../types";
import { hasOneSelection } from "../../util";
import { Command } from "../Command";
import { ActionsFactory, updateTypes } from "./ActionsFactory";
import { createPanel } from "./createPanel";
import { getConfig } from "./getConfig";

export class SnapCommand extends Command {
    context: vscode.ExtensionContext;

    name = "easy-codesnap.snap";

    constructor(context: vscode.ExtensionContext) {
        super();
        this.context = context;
    }

    async exec() {
        const panel = await createPanel(this.context);

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
    }
}
