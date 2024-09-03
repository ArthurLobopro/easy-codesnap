import { $$, t } from "../../util";

export function TranslationUpdater() {
    $$("[data-l10n]").forEach((el) => {
        el.innerHTML = t(el.dataset.l10n as string);
    });
}
