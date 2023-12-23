import * as vscode from "vscode"
import { importSettings } from "./commands/importSettings"
import { SnapFactory } from "./commands/snap"
import { createStatusbarButton } from "./statusBarButton"

export function activate(context: vscode.ExtensionContext) {
	context.subscriptions.push(
		vscode.commands.registerCommand("easy-codesnap.snap", SnapFactory(context)),
		vscode.commands.registerCommand("easy-codesnap.importSettings", importSettings),
		createStatusbarButton()
	)
}

export function deactivate() { }
