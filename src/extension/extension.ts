import type * as vscode from "vscode";
import { ImportSettingsCommand, OpenSettingsCommand, SnapCommand } from "./commands";
import { StatusbarButton } from "./StatusBarButton";

export function activate(context: vscode.ExtensionContext) {
  context.subscriptions.push(
    new SnapCommand(context).register(),
    new ImportSettingsCommand().register(),
    new OpenSettingsCommand().register(),
    new StatusbarButton(),
  );
}

export function deactivate() {}
