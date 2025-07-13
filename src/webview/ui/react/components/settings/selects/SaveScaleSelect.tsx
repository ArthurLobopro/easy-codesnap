import type { SaveScale } from "../../../../../../types";
import { SAVE_SCALES } from "../../../../../constants";
import { useConfig, useSetConfig } from "../../../hooks/useConfig";
import { useUpdateSelectsWidth } from "../../../hooks/useSelectWidthUpdater";
import { useTranslation } from "../../../hooks/useTranslation";

export function SaveScaleSelect() {
  const { t } = useTranslation();

  const set = useSetConfig();
  const saveScale = useConfig("saveScale");

  useUpdateSelectsWidth();

  return (
    <li>
      <span>{t("Save Scale")}</span>
      <select
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
      </select>
    </li>
  );
}
