import * as vscode from "vscode";
import type { untypedObject } from "./types";

export { writeFile } from "node:fs/promises";

export function getSettings(group: string, keys: string[]) {
    const settings = vscode.workspace.getConfiguration(group);
    const editor = vscode.window.activeTextEditor;
    const language = editor?.document?.languageId;

    const languageSettings =
        language &&
        vscode.workspace.getConfiguration().get<untypedObject>(`[${language}]`);

    return keys.reduce((config, key) => {
        if (languageSettings) {
            config[key] = languageSettings[`${group}.${key}`];
        }

        config[key] ??= settings.get(key);

        return config;
    }, {} as untypedObject);
}

export function hasOneSelection(selections?: readonly vscode.Selection[]) {
    return selections && selections.length === 1 && !selections[0].isEmpty;
}

export const t = vscode.l10n.t;
