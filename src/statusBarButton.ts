import * as vscode from "vscode"

export const createStatusbarButton = () => {
    const button = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Right, 150)
    button.text = "$(device-camera)"
    button.tooltip = "Snap code"
    button.color = "inherit"
    button.command = "easy-codesnap.snap"

    if (vscode.window.activeTextEditor?.selection.isEmpty === false) {
        button.show()
    }

    const changeEditorDispose = vscode.window.onDidChangeActiveTextEditor(() => {
        if (vscode.window.activeTextEditor?.selection.isEmpty === true) {
            button.show()
        } else {
            button.hide()
        }
    })

    const changeSelectionDispose = vscode.window.onDidChangeTextEditorSelection(event => {
        if (event.textEditor.selection.isEmpty) {
            button.hide()
        } else {
            button.show()
        }
    })

    return [changeEditorDispose, changeSelectionDispose]
}