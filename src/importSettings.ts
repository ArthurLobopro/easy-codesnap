import * as vscode from "vscode"

const commomConfigNames = [
    'backgroundColor',
    'boxShadow',
    'containerPadding',
    'roundedCorners',
    'showWindowControls',
    'showWindowTitle',
    'showLineNumbers',
    'realLineNumbers',
    'transparentBackground',
    'target',
    'shutterAction'
]

export function importSettings() {
    const codesnapSettings = vscode.workspace.getConfiguration("codesnap")
    const extensionSettings = vscode.workspace.getConfiguration("easy-codesnap")

    commomConfigNames.forEach(name => {
        extensionSettings.update(
            name,
            codesnapSettings.get(name) ?? extensionSettings.get(name),
            vscode.ConfigurationTarget.Global
        )
    })
}