import * as vscode from 'vscode'

export const createStatusbarButton = () => {
    const button = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Right, 150)
    button.text = '$(device-camera)'
    button.tooltip = "Snap code"
    button.color = 'inherit'
    button.command = 'easy-codesnap.start'

    let isVisible = false

    return vscode.window.onDidChangeTextEditorSelection(event => {
        if (event.textEditor.selection.isEmpty && isVisible) {
            button.hide()
            isVisible = false
        } else if (!isVisible) {
            button.show()
            isVisible = true
        }
    })
}