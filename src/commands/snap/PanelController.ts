import * as vscode from "vscode";
import type { message } from "../../types";
import { hasOneSelection, t } from "../../util";
import { ClipboardKeeper } from "./ClipboardKeeper";
import { SnapActions, type updateTypes } from "./SnapActions";
import { getConfig } from "./getConfig";

export class PanelController {
    panel: vscode.WebviewPanel;
    clipboard = new ClipboardKeeper();

    constructor(panel: vscode.WebviewPanel) {
        this.panel = panel;
    }

    async update(updateType: updateTypes, editorURI?: string) {
        if (updateType !== "config") {
            this.clipboard.cancelRestore();

            this.panel.webview.postMessage({
                type: "backup-clipboard",
            });

            await this.clipboard.save();

            await vscode.commands.executeCommand(
                "editor.action.clipboardCopyWithSyntaxHighlightingAction",
            );
        }

        this.panel.webview.postMessage({
            type: updateType === "both" ? "update" : `update-${updateType}`,
            ...getConfig(),
            ...(editorURI ? { editorID: editorURI } : {}),
            ...(updateType === "both"
                ? { bundle: JSON.stringify(vscode.l10n.bundle) }
                : {}),
        });

        if (updateType !== "config") {
            await this.clipboard.restore();
        }
    }

    init() {
        const actions = new SnapActions(this);

        this.panel.webview.onDidReceiveMessage(
            async ({ type, ...args }: message) => {
                if (type in actions) {
                    actions[type]({ ...args } as any);
                } else {
                    vscode.window.showErrorMessage(
                        t(
                            `Easy CodeSnap 📸: Unknown internal action "{type}"`,
                            { type },
                        ),
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
