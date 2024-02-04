import { ConfigSentToWebview } from "../types";

export interface WebviewConfig
    extends Omit<ConfigSentToWebview, "lockOnOpen" | "linkOnOpen"> {
    isLocked: boolean;
    isLinked: boolean;
    zoom: number;
}

export class ConfigProvider {
    static __config: WebviewConfig = {} as any;

    static get hasConfig() {
        return !!Object.entries(this.__config).length;
    }

    static get keys() {
        return Object.keys(this.__config);
    }

    static get() {
        return this.__config;
    }

    static set(config: Partial<WebviewConfig>) {
        if (alreadyHasSessionConfig()) {
            config = { ...getSessionConfig(), ...config };
        }

        config.zoom = config.zoom ?? 100;

        this.sessionConfig = config as WebviewConfig;
    }

    static set sessionConfig(config: WebviewConfig) {
        this.__config = config;
    }
}

export const setSessionConfig = (config: Partial<WebviewConfig>) => {
    if (alreadyHasSessionConfig()) {
        config = { ...getSessionConfig(), ...config };
    }

    config.zoom = config.zoom ?? 100;

    ConfigProvider.sessionConfig = config as WebviewConfig;
};

export const getSessionConfig = (): WebviewConfig => ConfigProvider.get();
export const alreadyHasSessionConfig = () => ConfigProvider.hasConfig;

export const getConfigKeys = () => ConfigProvider.keys;
