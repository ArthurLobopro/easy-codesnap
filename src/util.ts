import { readFile } from "fs/promises"
import path from "path"
import * as vscode from "vscode"
export { writeFile } from "fs/promises"

type untypedObject = { [key: string]: any }

export const readHtml = async (htmlPath: string, panel: vscode.WebviewPanel) => {
    return (await readFile(htmlPath, "utf-8"))
        .replace(/%CSP_SOURCE%/gu, panel.webview.cspSource)
        .replace(
            /(src|href)="([^"]*)"/gu,
            (_, type, src) =>
                `${type}="${panel.webview.asWebviewUri(
                    vscode.Uri.file(path.resolve(htmlPath, "..", src))
                )}"`
        )
}

export const getSettings = (group: string, keys: string[]) => {
    const settings = vscode.workspace.getConfiguration(group)
    console.log(settings)

    const editor = vscode.window.activeTextEditor
    const language = editor && editor.document && editor.document.languageId
    const languageSettings =
        language && vscode.workspace.getConfiguration().get(`[${language}]`) as untypedObject
    return keys.reduce((acc, k) => {
        acc[k] = languageSettings && languageSettings[`${group}.${k}`]
        if (acc[k] === null) { acc[k] = settings.get(k) }
        return acc
    }, {} as untypedObject)
}

