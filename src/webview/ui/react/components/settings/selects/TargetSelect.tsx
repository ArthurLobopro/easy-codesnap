import { TooltipText } from "@arthur-lobo/react-custom-tooltip";
import { useConfig, useSetConfig } from "@hooks//useConfig";
import { useTranslation } from "@hooks//useTranslation";
import type { Target } from "@/../types";
import { snippetContainerNode, windowNode } from "@/ui/elements";
import { HideSample, TargetSample } from "@/ui/updaters/SampleUpdater";
import { ConfigSelect } from "../../ConfigSelect";
import { LeftTooltip } from "../../LeftTooltip";
import { SettingLineWithSelect } from "../../SettingLine";

export function TargetSelect() {
  const { t } = useTranslation();
  const target = useConfig("target");
  const set = useSetConfig();

  return (
    <LeftTooltip>
      <SettingLineWithSelect>
        <span>{t("Target")}</span>
        <ConfigSelect
          tabIndex={-1}
          value={target}
          onChange={(ev) => {
            set({ target: ev.currentTarget.value as Target });
          }}
        >
          <option value="window">{t("Window")}</option>
          <option value="container">{t("Container")}</option>
        </ConfigSelect>
      </SettingLineWithSelect>
      <TooltipText>
        {t("The target of the capture, can be ")}
        <span className="link" onMouseEnter={() => TargetSample(windowNode)} onMouseLeave={() => HideSample()}>
          {t("Window")}
        </span>
        <span> {t("or")} </span>
        <span
          className="link"
          onMouseEnter={() => TargetSample(snippetContainerNode)}
          onMouseLeave={() => HideSample()}
        >
          {t("Container")}
        </span>
      </TooltipText>
    </LeftTooltip>
  );
}
