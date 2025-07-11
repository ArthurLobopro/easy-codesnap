import type { WebViewConfigKey } from "../../../types";
import { SessionConfig } from "../../SessionConfig";
import { getDefaultWindowTitle } from "../../util";
import { windowTitleNode } from "../elements";
import { LineNumbersUpdater } from "./LineNumbersUpdater";
import { OneTimeConfigUpdater } from "./OneTimeConfigUpdater";
import { StateUpdater } from "./StateUpdater";
import { VarUpdater } from "./VarUpdater";
import { VisibilityUpdater } from "./VisibilityUpdater";
import { WatermarkUpdater } from "./WatermarkUpdater";
import { WindowUpdater } from "./WindowUpdater";

export * from "./CodeUpdater";
export * from "./LineNumbersUpdater";
export * from "./OneTimeConfigUpdater";
export * from "./UIUpdater";
export * from "./VarUpdater";
export * from "./VisibilityUpdater";

export const updaters = [
    // new LockButtonUpdater(),
    // new LinkButtonUpdater(),
    // new ZoomUpdater(),
    new VarUpdater(),
    new VisibilityUpdater(),
    new LineNumbersUpdater(),
    new OneTimeConfigUpdater(),
    new WindowUpdater(),
    new WatermarkUpdater(),
    new StateUpdater(),
];

export function GenericUpdate(keys: WebViewConfigKey[]) {
    console.time("GenericUpdate");
    updaters
        .filter((updater) => {
            return updater.dependencies.some((dependency) =>
                keys.includes(dependency),
            );
        })
        .forEach((updater) => updater.update());
    console.timeEnd("GenericUpdate");
}

export function updateWindowTitle() {
    const { shouldUpdateTitle } = SessionConfig.get();

    if (shouldUpdateTitle) {
        windowTitleNode.textContent = getDefaultWindowTitle();
    }
}
