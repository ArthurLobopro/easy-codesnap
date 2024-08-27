export interface ExtensionConfig {
    boxShadow: string;
    backgroundColor: string;
    containerPadding: string;
    windowTitleTemplate: string;
    defaultWatermarkText: string;

    lockOnOpen: boolean;
    linkOnOpen: boolean;
    roundedCorners: boolean;
    enableResizing: boolean;
    showWindowTitle: boolean;
    showLineNumbers: boolean;
    realLineNumbers: boolean;
    showWindowControls: boolean;
    fullLinesSelection: boolean;
    transparentBackground: boolean;
    highlightLineNumber: boolean;
    watermark: boolean;

    saveScale: 1 | 1.5 | 2;
    roundingLevel: 1 | 2 | 3 | 4;
    saveFormat: "png" | "svg";
    target: "container" | "window";
    shutterAction: "save" | "copy";
    windowStyle: "macos" | "windows";
    aspectRatio: "none" | "1:1" | "4:5" | "9:16" | "16:9";
}

export interface ConfigSentToWebview extends ExtensionConfig {
    startLine: number;
    tabSize: number;
    fontLigatures: boolean;
    editorID: string;
    templates: {
        fileName: string;
        workspace: string;
    };
}

export interface WebviewConfig
    extends Omit<ConfigSentToWebview, "lockOnOpen" | "linkOnOpen"> {
    isLocked: boolean;
    isLinked: boolean;
    zoom: number;
    shouldUpdateTitle: boolean;
    watermarkText: string;
}

export type WebViewConfigKey = keyof WebviewConfig;

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
    | "saveScale"
    | "aspectRatio"
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
