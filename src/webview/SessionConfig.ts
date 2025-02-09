import type {
    TogglableConfigNames,
    WebViewConfigKey,
    WebviewConfig,
} from "../types";
import { GenericUpdate } from "./ui/updaters";

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

        newConfig.zoom ??= 100;
        newConfig.shouldUpdateTitle ??= true;
        newConfig.watermarkText ??= newConfig.defaultWatermarkText;

        this.__config = newConfig as WebviewConfig;

        const updatedKeys = Object.keys(config) as WebViewConfigKey[];
        GenericUpdate(updatedKeys);
    }

    static toggle(name: TogglableConfigNames) {
        // this.__config[name] = !this.get(name);
        this.set({
            [name]: !this.get(name),
        });
    }

    static set sessionConfig(config: WebviewConfig) {
        this.__config = config;
    }
}
