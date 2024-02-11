import {
    TogglableConfigNames,
    WebviewConfig,
    WebViewConfigKey,
} from "../types";

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
        const newConfig = this.hasConfig
            ? Object.assign({}, this.__config, config)
            : config;

        newConfig.zoom = newConfig.zoom ?? 100;
        newConfig.shouldUpdateTitle = newConfig.shouldUpdateTitle ?? true;

        this.__config = newConfig as WebviewConfig;
    }

    static toggle(name: TogglableConfigNames) {
        this.__config[name] = !this.get(name);
    }

    static set sessionConfig(config: WebviewConfig) {
        this.__config = config;
    }
}
