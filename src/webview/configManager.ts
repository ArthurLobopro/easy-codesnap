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

    isLocked: boolean
}

class ConfigProvider {
    static __config: ExtensionConfig = {} as any

    static get hasConfig() {
        return !!Object.entries(this.__config).length
    }

    static get sessionConfig() {
        return this.__config
    }

    static set sessionConfig(config: ExtensionConfig) {
        this.__config = config
    }
}

export const setSessionConfig = (config: Partial<ExtensionConfig>) => {
    if (alreadyHasSessionConfig()) {
        config = { ...getSessionConfig(), ...config }
    }

    ConfigProvider.sessionConfig = config as ExtensionConfig
}

export const getSessionConfig = (): ExtensionConfig => {
    return ConfigProvider.sessionConfig
}

export const alreadyHasSessionConfig = () => {
    return ConfigProvider.hasConfig
}
