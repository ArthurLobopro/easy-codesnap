import * as vscode from "vscode";

export function openSettings() {
    vscode.commands.executeCommand(
        "workbench.action.openSettings",
        "@ext:ArthurLobo.easy-codesnap",
    );
}
