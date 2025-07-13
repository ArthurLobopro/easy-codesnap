import { updaters } from ".";

export function UIUpdater() {
  for (const updater of updaters) {
    updater.update();
  }
}
