import * as vscode from "vscode"
import { hasOneSelection } from "./util"

export function createStatusbarButton() {
    const button = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Right, 150)
    button.text = "$(device-camera)"
    button.tooltip = "Snap code"
    button.color = "inherit"
    button.command = "easy-codesnap.snap"

    if (vscode.window.activeTextEditor?.selection.isEmpty === false) {
        button.show()
    }

    const changeEditorDispose = vscode.window.onDidChangeActiveTextEditor((editor) => {
        if (editor && hasOneSelection(editor.selections)) {
            button.show()
        } else {
            button.hide()
        }
    })

    const changeSelectionDispose = vscode.window.onDidChangeTextEditorSelection(event => {
        if (hasOneSelection(event.textEditor.selections)) {
            button.show()
        } else {
            button.hide()
        }
    })

    return [changeEditorDispose, changeSelectionDispose]
}