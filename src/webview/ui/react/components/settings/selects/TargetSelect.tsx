import { TooltipText } from "@arthur-lobo/react-custom-tooltip";
import { useConfig, useSetConfig } from "@hooks//useConfig";
import { useUpdateSelectsWidth } from "@hooks//useSelectWidthUpdater";
import { useTranslation } from "@hooks//useTranslation";
import type { Target } from "@/../types";
import { snippetContainerNode, windowNode } from "@/ui/elements";
import { HideSample, TargetSample } from "@/ui/updaters/SampleUpdater";
import { LeftTooltip } from "../../LeftTooltip";

export function TargetSelect() {
  const { t } = useTranslation();
  const target = useConfig("target");
  const set = useSetConfig();

  useUpdateSelectsWidth();

  return (
    <LeftTooltip>
      <li>
        <span>{t("Target")}</span>
        <select
          tabIndex={-1}
          value={target}
          onChange={(ev) => {
            set({ target: ev.currentTarget.value as Target });
          }}
        >
          <option value="window">{t("Window")}</option>
          <option value="container">{t("Container")}</option>
        </select>
      </li>
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
