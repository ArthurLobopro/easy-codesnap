import * as vscode from "vscode"
import { CodeSnapConfigNames } from "./constants"

export function importSettings() {
    const codesnapSettings = vscode.workspace.getConfiguration("codesnap")
    const extensionSettings = vscode.workspace.getConfiguration("easy-codesnap")

    CodeSnapConfigNames.forEach(name => {
        extensionSettings.update(
            name,
            codesnapSettings.get(name) ?? extensionSettings.get(name),
            vscode.ConfigurationTarget.Global
        )
    })
}