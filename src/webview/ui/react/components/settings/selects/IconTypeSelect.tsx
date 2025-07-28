import { TooltipText } from "@arthur-lobo/react-custom-tooltip";
import { useConfigList, useSetConfig } from "@hooks//useConfig";
import { useTranslation } from "@hooks//useTranslation";
import type { WindowIconType } from "@/../types";
import { ConfigSelect } from "../../ConfigSelect";
import { EscapeCodes } from "../../EscapeCodes";
import { LeftTooltip } from "../../LeftTooltip";

export function IconTypeSelect() {
  const { t } = useTranslation();
  const { windowStyle, windowIconType } = useConfigList(["windowStyle", "windowIconType"]);
  const set = useSetConfig();

  return (
    <LeftTooltip>
      <li>
        <span>{t("Icon Style")}</span>
        <ConfigSelect
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
        </ConfigSelect>
      </li>
      <TooltipText>
        <EscapeCodes
          text={t("Only valid when `{windowStyle}` is `Windows`. Changes the `Windows` icon style", {
            windowStyle: t("Window Style"),
          })}
        />
      </TooltipText>
    </LeftTooltip>
  );
}
