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

export type untypedObject = { [key: string]: any } 
