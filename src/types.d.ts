import { WebviewConfig } from "./webview/SessionConfig";

export interface ExtensionConfig {
    boxShadow: string;
    backgroundColor: string;
    containerPadding: string;
    roundedCorners: boolean;
    enableResizing: boolean;
    showWindowTitle: boolean;
    showLineNumbers: boolean;
    realLineNumbers: boolean;
    showWindowControls: boolean;
    transparentBackground: boolean;
    target: "container" | "window";
    shutterAction: "save" | "copy";
    roundingLevel: 1 | 2 | 3 | 4;
    lockOnOpen: boolean;
    linkOnOpen: boolean;
    saveFormat: "png" | "svg";
    windowStyle: "macos" | "windows";
}

export interface ConfigSentToWebview extends ExtensionConfig {
    startLine: number;
    windowTitle: string;
    tabSize: number;
    fontLigatures: boolean;
    editorID: string;
}

export type untypedObject = { [key: string]: any };
export type ConfigKey = keyof ExtensionConfig;

type BooleanProperties<T> = Pick<
    T,
    {
        [K in keyof T]: T[K] extends boolean ? K : never;
    }[keyof T]
>;

export type TogglableConfigNames = keyof BooleanProperties<WebviewConfig>;

export type selectNames = keyof Pick<
    WebviewConfig,
    | "roundingLevel"
    | "saveFormat"
    | "shutterAction"
    | "target"
    | "windowStyle"
    | "zoom"
>;

export type message =
    | { type: "copied" | "update-config" | "ready" }
    | { type: "save"; data: string; format: "svg" | "png" }
    | {
          type: "save-config";
          config: Omit<ExtensionConfig, "lockOnOpen" | "linkOnOpen">;
      }
    | { type: "open-settings" }
    | { type: "copy-svg"; data: string };
