import * as vscode from "vscode";
import type { ExtensionConfig } from "../../../types";
import { extensionSettingsNames } from "../../constants";
import { delay, getSettings, hasOneSelection, t } from "../../util";
import type { IPanelWebviewConfig, PanelWebviewConfig } from "./PanelWebviewConfig";
import { savePNG, saveSVG, saveWEBP } from "./savers";

export type updateTypes = "config" | "text" | "both";

type SaveProps = { data: string; format: "svg" | "png" | "webp" };

interface SnapActionsProps {
  panel: vscode.WebviewPanel;
  update: (type: updateTypes, editorURI?: string) => Promise<void>;
  webViewConfig: PanelWebviewConfig;
  scheduleSymbolBreadcrumbUpdate: () => void;
}

export class SnapActions {
  private panel: vscode.WebviewPanel;
  private update: SnapActionsProps["update"];
  private webViewConfig: PanelWebviewConfig;
  private scheduleSymbolBreadcrumbUpdate: () => void;

  constructor(props: SnapActionsProps) {
    this.panel = props.panel;
    this.webViewConfig = props.webViewConfig;
    this.scheduleSymbolBreadcrumbUpdate = () => props.scheduleSymbolBreadcrumbUpdate();
    this.update = (...args) => props.update(...args);
  }

  private flash() {
    this.panel.webview.postMessage({ type: "flash" });
  }

  async save({ data, format }: SaveProps) {
    this.flash();

    switch (format) {
      case "svg":
        return await saveSVG(data);
      case "png":
        return await savePNG(data);
      case "webp":
        return await saveWEBP(data);
    }
  }

  copied() {
    vscode.window.showInformationMessage(t("Image copied to clipboard!"));
  }

  "capture-too-large"({ width, height }: { width: number; height: number }) {
    vscode.window.showErrorMessage(
      t(
        "WebP screenshot is too large ({0} × {1} pixels). Use PNG, reduce Save Scale, or select fewer lines.",
        width,
        height,
      ),
    );
  }

  "capture-error"({ reason }: { reason: string }) {
    vscode.window.showErrorMessage(t("Failed to create screenshot: {0}", reason));
  }

  async ready() {
    const editor = vscode.window.activeTextEditor;
    if (editor && hasOneSelection(editor.selections)) {
      this.update("both", editor.document.uri.toString());
    }

    await delay(100);

    this.panel.webview.postMessage({
      type: "get-webview-config",
    });
  }

  "set-webview-config" = ({ config }: { config: IPanelWebviewConfig }) => {
    const wasEnabled =
      this.webViewConfig.get("enableSymbolBreadcrumb") ??
      getSettings("easy-codesnap", ["enableSymbolBreadcrumb"]).enableSymbolBreadcrumb;
    this.webViewConfig.set(config);
    if (wasEnabled !== config.enableSymbolBreadcrumb) {
      this.scheduleSymbolBreadcrumbUpdate();
    }
  };

  "update-config"() {
    this.update("config");
  }

  "save-config"({ config }: { config: ExtensionConfig }) {
    const extensionSettings = vscode.workspace.getConfiguration("easy-codesnap");

    extensionSettingsNames.forEach((name) => {
      if (name in config && extensionSettings.get(name) !== config[name]) {
        extensionSettings.update(name, config[name], vscode.ConfigurationTarget.Global);
      }
    });

    vscode.window.showInformationMessage(t("Settings saved as default!"));
  }

  "open-settings"() {
    vscode.commands.executeCommand("easy-codesnap.openSettings");
  }

  "open-config"({ configName }: { configName: string }) {
    vscode.commands.executeCommand("workbench.action.openSettings", `@id:easy-codesnap.${configName}`);
  }

  async "copy-svg"({ data }: { data: string }) {
    await vscode.env.clipboard.writeText(data);
  }
}
