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

