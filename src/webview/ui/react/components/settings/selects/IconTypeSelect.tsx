import type { WindowIconType } from "../../../../../../types";
import { useConfigList, useSetConfig } from "../../../hooks/useConfig";
import { useUpdateSelectsWidth } from "../../../hooks/useSelectWidthUpdater";
import { useTranslation } from "../../../hooks/useTranslation";

export function IconTypeSelect() {
  const { t } = useTranslation();
  const { windowStyle, windowIconType } = useConfigList([
    "windowStyle",
    "windowIconType",
  ]);
  const set = useSetConfig();

  useUpdateSelectsWidth();

  return (
    <li>
      <span>{t("Icon Type")}</span>
      <select
        value={windowIconType}
        onChange={(ev) => {
          set({
            windowIconType: ev.currentTarget.value as WindowIconType,
          });
        }}
        disabled={windowStyle !== "windows"}
      >
        <option value="round">{t("Rounded")}</option>
        <option value="square">{t("Square")}</option>
      </select>
    </li>
  );
}
