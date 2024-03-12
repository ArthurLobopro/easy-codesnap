import * as vscode from "vscode";
import { getSettings, hasOneSelection } from "../../util";
import { Command } from "../Command";
import { PanelController } from "./PanelController";
import { createPanel } from "./createPanel";

export class SnapCommand extends Command {
    context: vscode.ExtensionContext;

    name = "easy-codesnap.snap";

    constructor(context: vscode.ExtensionContext) {
        super();
        this.context = context;
    }

    async exec() {
        const panel = await createPanel(this.context);

        const panelController = new PanelController(panel);
        panelController.init();

        const { fullLinesSelection } = getSettings("easy-codesnap", [
            "fullLinesSelection",
        ]);

        fullLinesSelection && this.setFullLineSelection();
    }

    setFullLineSelection() {
        const activeEditor = vscode.window.activeTextEditor;
        if (activeEditor && hasOneSelection(activeEditor.selections)) {
            const selection = activeEditor.selection;

            activeEditor.selection = new vscode.Selection(
                new vscode.Position(selection.start.line, 0),
                selection.isReversed ? selection.anchor : selection.active,
            );
        }
    }
}
