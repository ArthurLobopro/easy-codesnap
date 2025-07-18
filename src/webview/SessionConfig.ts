import { create } from "zustand";
import type { TogglableConfigNames, WebViewConfigKey, WebviewConfig } from "../types";
import { DEFAULT_SETTINGS } from "./constants";
import { GenericUpdate } from "./ui/updaters";

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

  static set(config: Partial<WebviewConfig>, fromHook = false) {
    const newConfig = this.hasConfig ? Object.assign({}, this.__config, config) : config;

    newConfig.watermarkText ??= newConfig.defaultWatermarkText;
    newConfig.isReady ??= false;

    const updatedKeys = (Object.keys(newConfig) as WebViewConfigKey[]).filter((key) => {
      return !(key in this.__config) || this.__config[key] !== newConfig[key];
    }) as WebViewConfigKey[];

    this.__config = newConfig as WebviewConfig;

    //Remove before
    if (!fromHook) {
      useSessionConfig.getState().set({ ...newConfig });
    }

    GenericUpdate(updatedKeys);
  }

  static toggle(name: TogglableConfigNames) {
    this.set({
      [name]: !this.get(name),
    });
  }

  static set sessionConfig(config: WebviewConfig) {
    this.__config = config;
  }
}

export interface ISessionConfig
  extends Pick<
    WebviewConfig,
    | "isLinked"
    | "isLocked"
    | "zoom"
    | "saveFormat"
    | "saveScale"
    | "shutterAction"
    | "watermark"
    | "watermarkPosition"
    | "target"
    | "transparentBackground"
    | "enableResizing"
    | "enableSymbolBreadcrumb"
    | "maxCharWidth"
    | "aspectRatio"
    | "showWindowTitle"
    | "showWindowControls"
    | "windowStyle"
    | "windowIconType"
    | "roundedCorners"
    | "roundingLevel"
    | "realLineNumbers"
    | "showLineNumbers"
    | "highlightLineNumber"
    | "shouldUpdateTitle"
    | "isReady"
    | "templates"
  > {
  set: (config: Partial<Omit<ISessionConfig, "set">>) => void;
}

export const useSessionConfig = create<ISessionConfig>((setState) => ({
  set(config) {
    setState((state) => {
      // biome-ignore lint/correctness/noUnusedVariables: Need to separate the rest with spread
      const { set, ...stateConfig } = state;

      SessionConfig.set({ ...config }, true);

      for (const key in config) {
        //@ts-ignore
        stateConfig[key] = config[key];
      }

      return { ...stateConfig };
    });
  },
  ...DEFAULT_SETTINGS,
}));

type BooleanKeys<T> = {
  [K in keyof T]: T[K] extends boolean ? K : never;
}[keyof T];

export type BooleanSessionKeys = BooleanKeys<ISessionConfig>;
