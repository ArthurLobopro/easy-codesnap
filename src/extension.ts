import * as vscode from "vscode";
import { importSettings } from "./commands/importSettings";
import { openSettings } from "./commands/openSettings";
import { SnapFactory } from "./commands/snap";
import { createStatusbarButton } from "./statusBarButton";

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
        ...createStatusbarButton(),
    );
}

export function deactivate() {}
