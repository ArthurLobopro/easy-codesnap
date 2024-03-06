import { readFile } from "fs/promises";
import path from "path";
import * as vscode from "vscode";

function buildCSP(cspSource: string) {
    return [
        `default-src ${cspSource}`,
        `img-src ${cspSource} data: https:`,
        `script-src ${cspSource}`,
        `style-src 'unsafe-inline' ${cspSource}`,
        `font-src ${cspSource}`,
    ].join(";");
}

export async function loadHtml(
    htmlPath: string,
    panel: vscode.WebviewPanel,
    context: vscode.ExtensionContext,
) {
    const { cspSource } = panel.webview;

    const codiconsUri = panel.webview.asWebviewUri(
        vscode.Uri.joinPath(
            context.extensionUri,
            "node_modules",
            "@vscode/codicons",
            "dist",
            "codicon.css",
        ),
    );

    const CSP = [
        `<meta http-equiv="Content-Security-Policy" 
            content="${buildCSP(cspSource)}" />`,
        `<link href="${codiconsUri}" rel="stylesheet" />`,
    ].join("\n");

    const getAssetPath = (src: string) => {
        return panel.webview.asWebviewUri(
            vscode.Uri.file(path.resolve(htmlPath, "..", src)),
        );
    };

    return (await readFile(htmlPath, "utf-8"))
        .replace(
            /(src|href)="([^"]*)"/gu,
            (_, type, src) => `${type}="${getAssetPath(src)}"`,
        )
        .replace(/%CSP_SOURCE%/gu, CSP);
}
