import { readFile } from "node:fs/promises";
import path from "node:path";
import * as vscode from "vscode";

function buildCSP(cspSource: string) {
  const CSPSource = [
    `default-src ${cspSource}`,
    `img-src ${cspSource} data: https:`,
    `script-src ${cspSource}`,
    `style-src 'unsafe-inline' ${cspSource}`,
    `font-src ${cspSource}`,
  ].join(";");

  return `<meta http-equiv="Content-Security-Policy" content="${CSPSource}" />`;
}

export class PanelBuilder {
  private context: vscode.ExtensionContext;
  private html = "";
  private WEBVIEW_PATH: string;

  panel!: vscode.WebviewPanel;

  constructor(context: vscode.ExtensionContext) {
    this.context = context;
    this.WEBVIEW_PATH = path.resolve(this.context.extensionPath, "webview/index.html");
  }

  async build() {
    this.createPanel();

    this.html = await readFile(this.WEBVIEW_PATH, "utf-8");

    this.replaceAssetPaths();
    this.addCSPAndCodicons();
    this.panel.webview.html = this.html;

    return this.panel;
  }

  private createPanel() {
    this.panel = vscode.window.createWebviewPanel(
      "easy-codesnap",
      "Easy CodeSnap 📸",
      { viewColumn: vscode.ViewColumn.Beside, preserveFocus: true },
      {
        enableScripts: true,
        localResourceRoots: [vscode.Uri.file(this.context.extensionPath)],
        retainContextWhenHidden: true,
      },
    );
  }

  private replaceAssetPaths() {
    const getAssetPath = (src: string) => {
      return this.panel.webview.asWebviewUri(vscode.Uri.file(path.resolve(this.WEBVIEW_PATH, "..", src)));
    };

    this.html = this.html.replace(/(src|href)="([^"]*)"/gu, (_, type, src) => `${type}="${getAssetPath(src)}"`);
  }

  private addCSPAndCodicons() {
    const CSP = [
      buildCSP(this.panel.webview.cspSource),
      `<link href="${this.getCodiconsUri()}" rel="stylesheet" />`,
    ].join("\n");

    this.html = this.html.replace(/%CSP_SOURCE%/gu, CSP);
  }

  private getCodiconsUri() {
    return this.panel.webview.asWebviewUri(
      vscode.Uri.joinPath(this.context.extensionUri, "node_modules", "@vscode/codicons", "dist", "codicon.css"),
    );
  }
}
