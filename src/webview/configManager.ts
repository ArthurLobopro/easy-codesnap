import { ExtensionConfig } from "../types"

export interface WebviewConfig extends ExtensionConfig {
    startLine: number
    windowTitle: string
    tabSize: number
    fontLigatures: boolean

    isLocked: boolean
}

class ConfigProvider {
    static __config: WebviewConfig = {} as any

    static get hasConfig() {
        return !!Object.entries(this.__config).length
    }

    static get sessionConfig() {
        return this.__config
    }

    static set sessionConfig(config: WebviewConfig) {
        this.__config = config
    }
}

export const setSessionConfig = (config: Partial<WebviewConfig>) => {
    if (alreadyHasSessionConfig()) {
        config = { ...getSessionConfig(), ...config }
    }

    ConfigProvider.sessionConfig = config as WebviewConfig
}

export const getSessionConfig = (): WebviewConfig => {
    return ConfigProvider.sessionConfig
}

export const alreadyHasSessionConfig = () => {
    return ConfigProvider.hasConfig
}
