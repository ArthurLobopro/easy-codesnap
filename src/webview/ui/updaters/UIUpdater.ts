import { updaters } from ".";

export function UIUpdater() {
    updaters.forEach((updater) => updater.update());
}
