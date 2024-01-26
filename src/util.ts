import { readFile } from "fs/promises"
import path from "path"
import * as vscode from "vscode"
import { untypedObject } from "./types"
export { writeFile } from "fs/promises"

function buildCSP(cspSource: string) {
    return [
        `default-src ${cspSource}`,
        `img-src ${cspSource}`,
        "data:",
        "https:",
        `script-src ${cspSource}`,
        `style-src 'unsafe-inline' ${cspSource}`,
        `font-src ${cspSource}`
    ].join(";")
}

export async function loadHtml(htmlPath: string, panel: vscode.WebviewPanel, context: vscode.ExtensionContext) {
    const { cspSource } = panel.webview

    const codiconsUri = panel.webview.asWebviewUri(vscode.Uri.joinPath(context.extensionUri, "node_modules", "@vscode/codicons", "dist", "codicon.css"))

    const CSP = `<meta http-equiv="Content-Security-Policy" content="${buildCSP(cspSource)}" />
    <link href="${codiconsUri}" rel="stylesheet" />`

    return (await readFile(htmlPath, "utf-8"))
        .replace(
            /(src|href)="([^"]*)"/gu,
            (_, type, src) => `${type}="${panel.webview.asWebviewUri(
                vscode.Uri.file(path.resolve(htmlPath, "..", src))
            )}"`
        )
        .replace(/%CSP_SOURCE%/gu, CSP)
}

export function getSettings(group: string, keys: string[]) {
    const settings = vscode.workspace.getConfiguration(group)
    const editor = vscode.window.activeTextEditor
    const language = editor?.document?.languageId
    const languageSettings = language && vscode.workspace.getConfiguration().get(`[${language}]`) as untypedObject

    return keys.reduce((config, key) => {
        if (languageSettings) {
            config[key] = languageSettings[`${group}.${key}`]
        }

        config[key] = config[key] ?? settings.get(key)

        return config
    }, {} as untypedObject)
}

export function hasOneSelection(selections: readonly vscode.Selection[]) {
    return selections && selections.length === 1 && !selections[0].isEmpty
}