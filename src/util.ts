import { readFile } from "fs/promises"
import path from "path"
import * as vscode from "vscode"
export { writeFile } from "fs/promises"

type untypedObject = { [key: string]: any }

export const loadHtml = async (htmlPath: string, panel: vscode.WebviewPanel, context: vscode.ExtensionContext) => {

    const { cspSource } = panel.webview

    const codiconsUri = panel.webview.asWebviewUri(vscode.Uri.joinPath(context.extensionUri, "node_modules", "@vscode/codicons", "dist", "codicon.css"))

    const CSP = `<meta http-equiv="Content-Security-Policy"
    content="default-src 'none'; img-src ${cspSource} data: https:; script-src ${cspSource}; style-src 'unsafe-inline' ${cspSource}; font-src ${cspSource}" />
    <link href="${codiconsUri}" rel="stylesheet" />`


    return (await readFile(htmlPath, "utf-8"))
        .replace(
            /(src|href)="([^"]*)"/gu,
            (_, type, src) =>
                `${type}="${panel.webview.asWebviewUri(
                    vscode.Uri.file(path.resolve(htmlPath, "..", src))
                )}"`
        )
        .replace(/%CSP_SOURCE%/gu, CSP)
}

export const getSettings = (group: string, keys: string[]) => {
    const settings = vscode.workspace.getConfiguration(group)
    const editor = vscode.window.activeTextEditor
    const language = editor?.document?.languageId
    const languageSettings =
        language && vscode.workspace.getConfiguration().get(`[${language}]`) as untypedObject

    return keys.reduce((config, key) => {
        if (languageSettings) {
            config[key] = languageSettings[`${group}.${key}`]
        }

        config[key] = config[key] ?? settings.get(key)

        return config
    }, {} as untypedObject)
}