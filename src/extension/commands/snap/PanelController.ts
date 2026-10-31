import * as vscode from "vscode";
import type { message } from "../../../types";
import { getSettings, hasOneSelection, t } from "../../util";
import { ClipboardKeeper } from "./ClipboardKeeper";
import { getConfig } from "./getConfig";
import { PanelWebviewConfig } from "./PanelWebviewConfig";
import { SnapActions, type updateTypes } from "./SnapActions";

export class PanelController {
  panel: vscode.WebviewPanel;
  clipboard = new ClipboardKeeper();

  webViewConfig = new PanelWebviewConfig();
  private lastSnapshot?: { document: vscode.TextDocument; position: vscode.Position };
  private breadcrumbTimer?: ReturnType<typeof setTimeout>;
  private breadcrumbRequest = 0;
  private selectionTimer?: ReturnType<typeof setTimeout>;
  private pendingInitialUpdate = false;
  private updateQueue: Promise<void> = Promise.resolve();
  private disposed = false;
  private nextClipboardRequest = 0;
  private pendingClipboard?: { requestId: number; finish: () => void };

  constructor(panel: vscode.WebviewPanel) {
    this.panel = panel;
  }

  update(updateType: updateTypes, editorURI?: string): Promise<void> {
    if (this.disposed) return Promise.resolve();
    if (updateType === "both") this.pendingInitialUpdate = true;
    if (updateType === "config") return this.performUpdate(updateType, editorURI);

    this.cancelBreadcrumbUpdate();
    const editor = vscode.window.activeTextEditor;
    const selection = editor?.selection;
    // All updates share the system clipboard; overlapping copies can cause
    // one selection to be pasted or restored while another is in progress.
    const update = this.updateQueue.then(() => this.performUpdate(updateType, editorURI, editor, selection));
    this.updateQueue = update.catch(() => {});
    return update;
  }

  private async performUpdate(
    updateType: updateTypes,
    editorURI?: string,
    editor?: vscode.TextEditor,
    selection?: vscode.Selection,
  ): Promise<void> {
    if (this.disposed) return;
    let restoreClipboard = false;
    let clipboardRequestId: number | undefined;
    try {
      if (updateType !== "config") {
        const isCurrentSelection = () =>
          !this.disposed &&
          vscode.window.activeTextEditor === editor &&
          (!editorURI || editor?.document.uri.toString() === editorURI) &&
          hasOneSelection(editor?.selections) &&
          Boolean(selection && editor?.selection.isEqual(selection));
        if (!editor || !selection || !isCurrentSelection()) return;

        await this.clipboard.save();
        restoreClipboard = true;
        if (!isCurrentSelection()) return;

        await vscode.commands.executeCommand("editor.action.clipboardCopyWithSyntaxHighlightingAction");
        if (!isCurrentSelection()) return;
        this.lastSnapshot = { document: editor.document, position: selection.active };
      }

      // If the original selection changed while it was being copied, the
      // next successful selection must still initialize the webview.
      const outgoingType = updateType === "text" && this.pendingInitialUpdate ? "both" : updateType;
      let clipboardWait: Promise<void> | undefined;
      if (updateType !== "config") {
        clipboardRequestId = ++this.nextClipboardRequest;
        clipboardWait = this.waitForClipboardConsumption(clipboardRequestId);
      }
      const delivered = this.panel.webview.postMessage({
        type: outgoingType === "both" ? "update" : `update-${outgoingType}`,
        ...getConfig(),
        ...(editorURI ? { editorID: editorURI } : {}),
        ...(outgoingType === "both" ? { bundle: JSON.stringify(vscode.l10n.bundle) } : {}),
        ...(outgoingType !== "config" ? { symbolBreadcrumbs: [] } : {}),
        ...(clipboardRequestId !== undefined ? { clipboardRequestId } : {}),
      });
      if (outgoingType === "both") this.pendingInitialUpdate = false;
      if (updateType !== "config") this.scheduleSymbolBreadcrumbUpdate();
      if (clipboardWait) {
        void Promise.resolve(delivered)
          .catch((error) => {
            console.error("Failed to update snapshot preview", error);
            return false;
          })
          .then((ok) => {
            if (!ok) this.finishClipboardConsumption(clipboardRequestId);
          });
        await clipboardWait;
      }
    } finally {
      this.finishClipboardConsumption(clipboardRequestId);
      if (restoreClipboard) await this.clipboard.restore();
    }
  }

  private canSyncEditor(editorURI: string) {
    const { isLocked, isLinked, linkedId } = this.webViewConfig.get();
    return !isLocked && (!isLinked || linkedId === editorURI);
  }

  init() {
    const actions = new SnapActions(this);

    this.panel.webview.onDidReceiveMessage(async (message: message) => {
      if (message.type === "clipboard-consumed") {
        this.finishClipboardConsumption(message.requestId);
        return;
      }
      const { type, ...args } = message;
      if (type in actions) {
        actions[type]({ ...args } as any);
      } else {
        vscode.window.showErrorMessage(t(`Easy CodeSnap 📸: Unknown internal action "{type}"`, { type }));
      }
    });

    const selectionHandler = vscode.window.onDidChangeTextEditorSelection((e) => {
      console.log("Selection Changed");
      const editorURI = e.textEditor.document.uri.toString();
      if (e.kind === vscode.TextEditorSelectionChangeKind.Command || !this.canSyncEditor(editorURI)) {
        return;
      }

      clearTimeout(this.selectionTimer);
      if (hasOneSelection(e.selections)) {
        this.cancelBreadcrumbUpdate();
        this.selectionTimer = setTimeout(() => {
          if (this.canSyncEditor(editorURI) && vscode.window.activeTextEditor === e.textEditor) {
            void this.update("text", editorURI);
          }
        }, 100);
      }
    });
    this.panel.onDidDispose(() => {
      this.disposed = true;
      selectionHandler.dispose();
      clearTimeout(this.selectionTimer);
      this.cancelBreadcrumbUpdate();
      this.finishClipboardConsumption(this.pendingClipboard?.requestId);
    });
  }

  private waitForClipboardConsumption(requestId: number): Promise<void> {
    return new Promise((resolve) => {
      const timer = setTimeout(() => this.finishClipboardConsumption(requestId), 5000);
      this.pendingClipboard = {
        requestId,
        finish: () => {
          clearTimeout(timer);
          resolve();
        },
      };
    });
  }

  private finishClipboardConsumption(requestId: number | undefined) {
    if (this.pendingClipboard?.requestId !== requestId) return;
    const pending = this.pendingClipboard;
    this.pendingClipboard = undefined;
    pending?.finish();
  }

  private cancelBreadcrumbUpdate() {
    clearTimeout(this.breadcrumbTimer);
    this.breadcrumbRequest++;
  }

  scheduleSymbolBreadcrumbUpdate() {
    this.cancelBreadcrumbUpdate();
    if (this.disposed) return;
    const enabled =
      this.webViewConfig.get("enableSymbolBreadcrumb") ??
      getSettings("easy-codesnap", ["enableSymbolBreadcrumb"]).enableSymbolBreadcrumb;
    const editor = vscode.window.activeTextEditor ?? vscode.window.visibleTextEditors[0];
    const snapshot =
      this.lastSnapshot ?? (editor ? { document: editor.document, position: editor.selection.active } : undefined);
    if (!enabled || !snapshot) return;

    const request = this.breadcrumbRequest;
    const { document, position } = snapshot;
    this.breadcrumbTimer = setTimeout(async () => {
      let symbolBreadcrumbs: vscode.DocumentSymbol[] = [];
      try {
        const symbols = await vscode.commands.executeCommand<vscode.DocumentSymbol[] | undefined>(
          "vscode.executeDocumentSymbolProvider",
          document.uri,
        );
        if (symbols) symbolBreadcrumbs = this.getSymbolBreadcrumbs(symbols, position);
      } catch (error) {
        console.error("Failed to load symbol breadcrumbs", error);
      }
      if (this.disposed || request !== this.breadcrumbRequest) return;
      this.panel.webview.postMessage({ type: "update-breadcrumbs", symbolBreadcrumbs });
    }, 150);
  }

  getSymbolBreadcrumbs(symbols: vscode.DocumentSymbol[], position: vscode.Position): vscode.DocumentSymbol[] {
    const traverse = (
      items: vscode.DocumentSymbol[],
      currentPath: vscode.DocumentSymbol[],
    ): vscode.DocumentSymbol[] => {
      for (const symbol of items) {
        if (symbol.range.contains(position)) {
          const newPath = [...currentPath, symbol];
          const deeperPath = traverse(symbol.children, newPath);
          return deeperPath.length > 0 ? deeperPath : newPath;
        }
      }
      return [];
    };

    return traverse(symbols, []);
  }
}
