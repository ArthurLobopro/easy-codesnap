export interface ExtensionConfig {
    boxShadow: string
    backgroundColor: string
    containerPadding: string
    roundedCorners: boolean
    enableResizing: boolean
    showWindowTitle: boolean
    showLineNumbers: boolean
    realLineNumbers: boolean
    showWindowControls: boolean
    transparentBackground: boolean
    target: "container" | "window"
    shutterAction: "save" | "copy"
    roundingLevel: 1 | 2 | 3 | 4
}

export interface ConfigSentToWebview extends ExtensionConfig {
    startLine: number
    windowTitle: string
    tabSize: number
    fontLigatures: boolean
    editorID: string
}

export type untypedObject = { [key: string]: any }
export type ConfigKey = keyof ExtensionConfig