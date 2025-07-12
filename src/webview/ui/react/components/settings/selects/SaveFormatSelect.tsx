import type { SaveFormat } from "../../../../../../types";
import { SAVE_FORMATS } from "../../../../../constants";
import { useConfig, useSetConfig } from "../../../hooks/useConfig";
import { useTranslation } from "../../../hooks/useTranslation";

export function SaveFormatSelect() {
    const { t } = useTranslation();

    const set = useSetConfig();
    const saveFormat = useConfig("saveFormat");

    return (
        <li>
            <span>{t("Save Format")}</span>
            <select
                data-configname="saveFormat"
                tabIndex={-1}
                value={saveFormat}
                onChange={(ev) => {
                    set({ saveFormat: ev.currentTarget.value as SaveFormat });
                }}
            >
                {SAVE_FORMATS.map((f) => (
                    <option value={f} key={f}>
                        {f}
                    </option>
                ))}
            </select>
        </li>
    );
}
