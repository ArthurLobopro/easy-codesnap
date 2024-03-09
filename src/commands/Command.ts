import * as vscode from "vscode";

export abstract class Command {
    abstract name: string;
    abstract exec(): void;

    register() {
        return vscode.commands.registerCommand(this.name, () => this.exec());
    }
}
