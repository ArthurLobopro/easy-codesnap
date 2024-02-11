import * as vscode from "vscode";
import { extensionSettingsNames } from "../../constants";
import { getSettings } from "../../util";

export function getConfig() {
    const editorSettings = getSettings("editor", ["fontLigatures", "tabSize"]);

    const editor = vscode.window.activeTextEditor;
    if (editor) {
        editorSettings.tabSize = editor.options.tabSize;
    }

    const extensionSettings = getSettings(
        "easy-codesnap",
        extensionSettingsNames,
    );

    const selection = editor?.selection;
    const startLine = selection ? selection.start.line : 0;

    let fileName = "";
    if (editor) {
        const activeFileName = editor.document.uri.path.split("/").pop();
        fileName = activeFileName as string;
    }

    return {
        ...editorSettings,
        ...extensionSettings,
        startLine,
        templates: {
            fileName,
            workspace: vscode.workspace.name,
        },
    };
}
