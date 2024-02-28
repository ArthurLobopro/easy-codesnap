import * as vscode from "vscode";
import { StatusbarButton } from "./StatusBarButton";
import { SnapFactory, importSettings, openSettings } from "./commands";

export function activate(context: vscode.ExtensionContext) {
    context.subscriptions.push(
        vscode.commands.registerCommand(
            "easy-codesnap.snap",
            SnapFactory(context),
        ),
        vscode.commands.registerCommand(
            "easy-codesnap.importSettings",
            importSettings,
        ),
        vscode.commands.registerCommand(
            "easy-codesnap.openSettings",
            openSettings,
        ),
        new StatusbarButton(),
    );
}

export function deactivate() {}
