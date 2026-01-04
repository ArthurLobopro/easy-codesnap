import { useConfigList, useSetConfig } from "@hooks//useConfig";
import { useTranslation } from "@hooks//useTranslation";
import { useEffect } from "react";
import type { SaveFormat } from "@/../types";
import { SAVE_FORMATS } from "@/constants";
import { ConfigSelect } from "../../ConfigSelect";
import { SettingLineWithSelect } from "../../SettingLine";

export function SaveFormatSelect() {
  const { t } = useTranslation();

  const set = useSetConfig();
  const { shutterAction: saveAction, saveFormat } = useConfigList(["shutterAction", "saveFormat"]);

  useEffect(() => {
    if (saveAction === "copy" && saveFormat === "webp") {
      set({ shutterAction: "save" });
    }
  }, [saveAction, saveFormat]);

  return (
    <SettingLineWithSelect>
      <span>{t("Save Format")}</span>
      <ConfigSelect
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
      </ConfigSelect>
    </SettingLineWithSelect>
  );
}
