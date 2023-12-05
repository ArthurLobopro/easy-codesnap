export interface ExtensionConfig {
    backgroundColor: string
    boxShadow: string
    containerPadding: string
    roundedCorners: boolean
    showWindowControls: boolean
    showWindowTitle: boolean
    showLineNumbers: boolean
    realLineNumbers: boolean
    transparentBackground: boolean
    target: "container" | "window"
    shutterAction: "save" | "copy"
    enableResizing: boolean
    roundingLevel: 1 | 2 | 3 | 4

    startLine: number
    windowTitle: string
    tabSize: number
    fontLigatures: boolean
}

export const setSessionConfig = (config: Partial<ExtensionConfig>) => {
    if (alreadyHasSessionConfig()) {
        config = { ...getSessionConfig(), ...config }
    }

    sessionStorage.setItem("easy-codesnap-config", JSON.stringify(config))
}

export const getSessionConfig = (): ExtensionConfig => {
    return JSON.parse(sessionStorage.getItem("easy-codesnap-config") as string)
}

export const alreadyHasSessionConfig = () => {
    return !!sessionStorage.getItem("easy-codesnap-config")
}
