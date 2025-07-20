import { useConfigList, useSetConfig } from "@hooks//useConfig";
import { useUpdateSelectsWidth } from "@hooks//useSelectWidthUpdater";
import { useTranslation } from "@hooks//useTranslation";
import type { WindowIconType } from "@/../types";
import { EscapeCodes } from "../../EscapeCodes";

export function IconTypeSelect() {
  const { t } = useTranslation();
  const { windowStyle, windowIconType } = useConfigList(["windowStyle", "windowIconType"]);
  const set = useSetConfig();

  useUpdateSelectsWidth();

  return (
    <li className="tooltip horizontal-left">
      <span>{t("Icon Style")}</span>
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
      <span className="tooltip-text">
        <EscapeCodes
          text={t("Only valid when `{windowStyle}` is `Windows`. Changes the `Windows` icon style", {
            windowStyle: t("Window Style"),
          })}
        />
      </span>
    </li>
  );
}
