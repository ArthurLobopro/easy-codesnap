import * as vscode from "vscode"

export const createStatusbarButton = () => {
    const button = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Right, 150)
    button.text = "$(device-camera)"
    button.tooltip = "Snap code"
    button.color = "inherit"
    button.command = "easy-codesnap.start"

    if (!vscode.window.activeTextEditor?.selection.isEmpty) {
        button.show()
    }

    return vscode.window.onDidChangeTextEditorSelection(event => {
        if (event.textEditor.selection.isEmpty) {
            button.hide()
        } else {
            button.show()
        }
    })
}