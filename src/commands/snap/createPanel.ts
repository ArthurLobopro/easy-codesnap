import path from "path";
import * as vscode from "vscode";
import { loadHtml } from "../../util";

export async function createPanel(context: vscode.ExtensionContext) {
    const panel = vscode.window.createWebviewPanel(
        "easy-codesnap",
        "Easy CodeSnap 📸",
        { viewColumn: vscode.ViewColumn.Beside, preserveFocus: true },
        {
            enableScripts: true,
            localResourceRoots: [vscode.Uri.file(context.extensionPath)],
            retainContextWhenHidden: true,
        },
    );

    panel.webview.html = await loadHtml(
        path.resolve(context.extensionPath, "webview/index.html"),
        panel,
        context,
    );

    return panel;
}
