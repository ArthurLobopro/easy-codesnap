import * as vscode from "vscode";
import type { message } from "../../types";
import { hasOneSelection, t } from "../../util";
import { ClipboardKeeper } from "./ClipboardKeeper";
import { getConfig } from "./getConfig";
import { SnapActions, type updateTypes } from "./SnapActions";

export class PanelController {
    panel: vscode.WebviewPanel;
    clipboard = new ClipboardKeeper();

    constructor(panel: vscode.WebviewPanel) {
        this.panel = panel;
    }

    async update(updateType: updateTypes, editorURI?: string) {
        let symbolBreadcrumbs: vscode.DocumentSymbol[] = [];

        if (updateType !== "config") {
            this.clipboard.cancelRestore();

            this.panel.webview.postMessage({
                type: "backup-clipboard",
            });

            await this.clipboard.save();

            await vscode.commands.executeCommand(
                "editor.action.clipboardCopyWithSyntaxHighlightingAction",
            );

            const editor = vscode.window.visibleTextEditors[0];
            const document = editor.document;
            const position = editor.selection.active;

            const symbols: vscode.DocumentSymbol[] =
                await vscode.commands.executeCommand(
                    "vscode.executeDocumentSymbolProvider",
                    document.uri,
                );

            if (symbols) {
                symbolBreadcrumbs = this.getSymbolBreadcrumbs(
                    symbols,
                    position,
                );
            }
        }

        this.panel.webview.postMessage({
            type: updateType === "both" ? "update" : `update-${updateType}`,
            ...getConfig(),
            ...(editorURI ? { editorID: editorURI } : {}),
            ...(updateType === "both"
                ? { bundle: JSON.stringify(vscode.l10n.bundle) }
                : {}),
            symbolBreadcrumbs,
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
            (e) => {
                if (e.kind === vscode.TextEditorSelectionChangeKind.Command) {
                    return;
                }

                return (
                    hasOneSelection(e.selections) &&
                    this.update("text", e.textEditor.document.uri.toString())
                );
            },
        );
        this.panel.onDidDispose(() => selectionHandler.dispose());
    }

    getSymbolBreadcrumbs(
        symbols: vscode.DocumentSymbol[],
        position: vscode.Position,
    ): vscode.DocumentSymbol[] {
        const traverse = (
            items: vscode.DocumentSymbol[],
            currentPath: vscode.DocumentSymbol[],
        ): vscode.DocumentSymbol[] => {
            for (const symbol of items) {
                if (symbol.range.contains(position)) {
                    const newPath = [...currentPath, symbol];
                    const deeperPath = traverse(symbol.children, newPath);
                    return deeperPath.length > 0 ? deeperPath : newPath;
                }
            }
            return [];
        };

        return traverse(symbols, []);
    }
}
