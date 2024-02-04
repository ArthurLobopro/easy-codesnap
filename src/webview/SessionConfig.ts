import { ConfigSentToWebview } from "../types";

export interface WebviewConfig
    extends Omit<ConfigSentToWebview, "lockOnOpen" | "linkOnOpen"> {
    isLocked: boolean;
    isLinked: boolean;
    zoom: number;
}

export type WebViewConfigKey = keyof WebviewConfig;

export class SessionConfig {
    static __config: WebviewConfig = {} as any;

    static get hasConfig() {
        return !!Object.entries(this.__config).length;
    }

    static get keys() {
        return Object.keys(this.__config);
    }

    static get<T extends WebViewConfigKey>(name: T): WebviewConfig[T];
    static get(): WebviewConfig;
    static get(name?: WebViewConfigKey) {
        if (name) {
            return this.__config[name];
        }

        return this.__config;
    }

    static set(config: Partial<WebviewConfig>) {
        if (this.hasConfig) {
            config = { ...getSessionConfig(), ...config };
        }

        config.zoom = config.zoom ?? 100;

        this.__config = config as WebviewConfig;
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

    SessionConfig.sessionConfig = config as WebviewConfig;
};

export const getSessionConfig = (): WebviewConfig => SessionConfig.get();
export const alreadyHasSessionConfig = () => SessionConfig.hasConfig;

export const getConfigKeys = () => SessionConfig.keys;
