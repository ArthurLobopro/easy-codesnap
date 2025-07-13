import type { WebViewConfigKey } from "../../types";

export abstract class Updater {
  constructor(readonly dependencies: WebViewConfigKey[]) {}

  abstract update(): void;
}
