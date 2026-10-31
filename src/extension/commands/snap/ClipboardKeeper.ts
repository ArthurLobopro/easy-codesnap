import * as vscode from "vscode";

export class ClipboardKeeper {
  private clipboardText = "";
  private lastClipboardRestored = true;

  async save() {
    if (this.lastClipboardRestored) {
      this.clipboardText = await vscode.env.clipboard.readText();
      this.lastClipboardRestored = false;
    }
  }

  async restore() {
    if (this.lastClipboardRestored) return;
    try {
      if (this.clipboardText) {
        await vscode.env.clipboard.writeText(this.clipboardText);
      }
    } catch (error) {
      console.error("Failed to restore clipboard", error);
    } finally {
      this.lastClipboardRestored = true;
    }
  }
}
