import { useConfig, useSetConfig } from "@hooks//useConfig";
import { useTranslation } from "@hooks//useTranslation";
import type { SaveScale } from "@/../types";
import { SAVE_SCALES } from "@/constants";
import { ConfigSelect } from "../../ConfigSelect";
import { SettingLineWithSelect } from "../../SettingLine";

export function SaveScaleSelect() {
  const { t } = useTranslation();

  const set = useSetConfig();
  const saveScale = useConfig("saveScale");

  return (
    <SettingLineWithSelect>
      <span>{t("Save Scale")}</span>
      <ConfigSelect
        value={saveScale}
        onChange={(ev) => {
          set({
            saveScale: Number(ev.currentTarget.value) as SaveScale,
          });
        }}
      >
        {SAVE_SCALES.map((scale) => (
          <option value={scale} key={scale}>
            {scale}x
          </option>
        ))}
      </ConfigSelect>
    </SettingLineWithSelect>
  );
}
