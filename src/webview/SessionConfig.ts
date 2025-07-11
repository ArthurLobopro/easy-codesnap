import { create } from "zustand";
import type {
    TogglableConfigNames,
    WebViewConfigKey,
    WebviewConfig,
} from "../types";
import { GenericUpdate, updateWindowTitle } from "./ui/updaters";

const DEFAULT_SETTINGS: Partial<WebviewConfig> = {
    isLocked: false,
    isLinked: false,
};

export class SessionConfig {
    static __config: WebviewConfig = {} as any;

    static get hasConfig() {
        return Object.entries(this.__config).length > 0;
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

        const updatedKeys = (
            Object.keys(newConfig) as WebViewConfigKey[]
        ).filter((key) => {
            return (
                !(key in this.__config) || this.__config[key] !== newConfig[key]
            );
        }) as WebViewConfigKey[];

        const currentFileName = this.__config.templates?.fileName;
        this.__config = newConfig as WebviewConfig;

        GenericUpdate(updatedKeys);

        if (currentFileName && config.templates?.fileName !== currentFileName) {
            updateWindowTitle();
        }
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

export interface ISessionConfig
    extends Pick<WebviewConfig, "isLinked" | "isLocked"> {
    set: (
        config: Partial<Pick<WebviewConfig, "isLinked" | "isLocked">>,
    ) => void;
}

export const useSessionConfig = create<ISessionConfig>((setState) => ({
    // get<T extends keyof ISessionConfig["config"]>(
    //     key?: T,
    // ): GetValue<ISessionConfig["config"], T> {
    //     if (key) {
    //         return SessionConfig.get(key);
    //     }

    //     return (
    //         SessionConfig.hasConfig ? SessionConfig.get() : DEFAULT_SETTINGS
    //     ) as GetValue<ISessionConfig["config"], T>;
    // },
    set(config) {
        setState((state) => {
            const { set, ...stateConfig } = state;

            SessionConfig.set({ ...config });

            for (const key in config) {
                //@ts-ignore
                stateConfig[key] = config[key];
            }

            return { ...stateConfig };
        });
    },
    ...(DEFAULT_SETTINGS as Pick<WebviewConfig, "isLinked" | "isLocked">),
}));
