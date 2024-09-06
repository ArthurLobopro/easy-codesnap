import { updaters } from ".";
import { TranslationUpdater } from "./TranslationUpdater";

export function UIUpdater() {
    for (const updater of updaters) {
        updater.update();
    }

    TranslationUpdater();
}
