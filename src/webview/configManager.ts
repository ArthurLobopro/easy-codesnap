import { ConfigSentToWebview } from "../types";

export interface WebviewConfig
    extends Omit<ConfigSentToWebview, "lockOnOpen" | "linkOnOpen"> {
    isLocked: boolean;
    isLinked: boolean;
}

class ConfigProvider {
    static __config: WebviewConfig = {} as any;

    static get hasConfig() {
        return !!Object.entries(this.__config).length;
    }

    static get keys() {
        return Object.keys(this.__config);
    }

    static get sessionConfig() {
        return this.__config;
    }

    static set sessionConfig(config: WebviewConfig) {
        this.__config = config;
    }
}

export const setSessionConfig = (config: Partial<WebviewConfig>) => {
    if (alreadyHasSessionConfig()) {
        config = { ...getSessionConfig(), ...config };
    }

    config.isLocked = config.isLocked ?? false;
    config.isLinked = config.isLinked ?? false;

    ConfigProvider.sessionConfig = config as WebviewConfig;
};

export const getSessionConfig = (): WebviewConfig =>
    ConfigProvider.sessionConfig;
export const alreadyHasSessionConfig = () => ConfigProvider.hasConfig;

export const getConfigKeys = () => ConfigProvider.keys;
