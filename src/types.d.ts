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
    windowTitleTemplate: string;
    saveScale: 1 | 1.5 | 2;
    aspectRatio: "none" | "1:1" | "4:5" | "9:16" | "16:9";
    fullLinesSelection: boolean;
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
