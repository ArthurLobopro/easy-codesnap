import * as vscode from "vscode";

export class ClipboardKeeper {
  private restoreClipboardTimeout = -1;
  private clipboardText = "";
  private lastClipboardRestored = true;

  async save() {
    if (this.lastClipboardRestored) {
      this.clipboardText = await vscode.env.clipboard.readText();
      this.lastClipboardRestored = false;
    }
  }

  async restore() {
    if (this.clipboardText) {
      this.restoreClipboardTimeout = setTimeout(async () => {
        await vscode.env.clipboard.writeText(this.clipboardText);
        this.lastClipboardRestored = true;
      }, 500) as unknown as number;
    }
  }

  cancelRestore() {
    clearTimeout(this.restoreClipboardTimeout);
  }
}
