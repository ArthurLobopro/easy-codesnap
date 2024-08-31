import { LinkButtonUpdater, LockButtonUpdater } from "./ButtonsUpdater";
import { VarUpdater } from "./VarUpdater";
import { ZoomUpdater } from "./ZoomUpdater";

export * from "./ButtonsUpdater";
export * from "./CodeUpdater";
export * from "./LineNumbersUpdater";
export * from "./OneTimeConfigUpdater";
export * from "./UIUpdater";
export * from "./VarUpdater";
export * from "./VisibilityUpdater";
export * from "./ZoomUpdater";

export const updaters = [
    new LockButtonUpdater(),
    new LinkButtonUpdater(),
    new ZoomUpdater(),
    new VarUpdater(),
];
