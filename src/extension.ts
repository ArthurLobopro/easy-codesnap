import type * as vscode from "vscode";
import { StatusbarButton } from "./StatusBarButton";
import {
    ImportSettingsCommand,
    OpenSettingsCommand,
    SnapCommand,
} from "./commands";

export function activate(context: vscode.ExtensionContext) {
    context.subscriptions.push(
        new SnapCommand(context).register(),
        new ImportSettingsCommand().register(),
        new OpenSettingsCommand().register(),
        new StatusbarButton(),
    );
}

export function deactivate() {}
