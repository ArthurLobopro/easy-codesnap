import type { WebViewConfigKey } from "../../../types";
import { LineNumbersUpdater } from "./LineNumbersUpdater";
import { StateUpdater } from "./StateUpdater";
import { VarUpdater } from "./VarUpdater";
import { VisibilityUpdater } from "./VisibilityUpdater";
import { WatermarkUpdater } from "./WatermarkUpdater";

export * from "./CodeUpdater";
export * from "./LineNumbersUpdater";
export * from "./UIUpdater";
export * from "./VarUpdater";
export * from "./VisibilityUpdater";

export const updaters = [
  new VarUpdater(),
  new VisibilityUpdater(),
  new LineNumbersUpdater(),
  new WatermarkUpdater(),
  new StateUpdater(),
];

export function GenericUpdate(keys: WebViewConfigKey[]) {
  console.time("GenericUpdate");
  updaters
    .filter((updater) => {
      return updater.dependencies.some((dependency) => keys.includes(dependency));
    })
    .forEach((updater) => updater.update());
  console.timeEnd("GenericUpdate");
}
