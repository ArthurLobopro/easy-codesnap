export interface IPanelWebviewConfig {
  isLocked: boolean;
  isLinked: boolean;
  linkedId: string;
}

type IPanelWebviewConfigKeys = keyof IPanelWebviewConfig;

export class PanelWebviewConfig {
  config: IPanelWebviewConfig;

  constructor() {
    this.config = {
      isLocked: false,
      isLinked: false,
      linkedId: "",
    };
  }

  set(config: IPanelWebviewConfig) {
    this.config = config;
  }

  get<T extends IPanelWebviewConfigKeys>(name: T): IPanelWebviewConfig[T];
  get(): IPanelWebviewConfig;
  get(key?: IPanelWebviewConfigKeys) {
    if (key) {
      return this.config[key];
    }

    return this.config;
  }
}
