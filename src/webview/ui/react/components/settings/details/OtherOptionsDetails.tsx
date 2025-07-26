import { TooltipText } from "@arthur-lobo/react-custom-tooltip";
import { useConfigList, useSetConfig } from "@hooks//useConfig";
import { useTranslation } from "@hooks//useTranslation";
import { snippetContainerNode, windowNode } from "@/ui/elements";
import { HideSample, TargetSample } from "@/ui/updaters/SampleUpdater";
import { text } from "@/util";
import { EscapeCodes } from "../../EscapeCodes";
import { DetailsContent, ExpandDetails, TextDetailsSummary } from "../../ExpandDetails";
import { LeftTooltip } from "../../LeftTooltip";
import { ToggleInput } from "../../ToggleInput";
import { AspectRatioSelect } from "../selects/AspectRatioSelect";
import { TargetSelect } from "../selects/TargetSelect";

export function OtherOptionsDetails() {
  const { t } = useTranslation();

  const { target, transparentBackground, maxCharWidth } = useConfigList([
    "target",
    "transparentBackground",
    "maxCharWidth",
  ]);
  const { set, toggleCallback } = useSetConfig();

  return (
    <ExpandDetails>
      <TextDetailsSummary text={t("Other Options")} />
      <DetailsContent>
        <TargetSelect />
        <ToggleInput
          config="transparentBackground"
          label={t("Transparent Background")}
          tooltip={
            <EscapeCodes
              text={text(
                t("When you take the Snapshot, the container background will be transparent."),
                t("Only valid when `{target}` is `{container}`", {
                  target: t("Target"),
                  container: t("Container"),
                }),
              )}
            />
          }
        />
        <ToggleInput
          config="enableResizing"
          label={t("Enable Resizing")}
          tooltip={
            <>
              <span>{t("Enables manual resizing for ")}</span>
              <span className="link" onMouseEnter={() => TargetSample(windowNode)} onMouseLeave={() => HideSample()}>
                {t("Window")}
              </span>
              <span> {t("and")} </span>
              <span
                className="link"
                onMouseEnter={() => TargetSample(snippetContainerNode)}
                onMouseLeave={() => HideSample()}
              >
                {t("Container")}
              </span>
              . <EscapeCodes text={text(t("Disabling this will also remove any resizing you've done."))} />
            </>
          }
        />

        <ToggleInput config="enableSymbolBreadcrumb" label={t("Enable Symbol Breadcrumb")} />

        <LeftTooltip>
          <li>
            <span>{t("Max char width")}</span>
            <input
              type="number"
              min={0}
              max={200}
              maxLength={3}
              value={maxCharWidth}
              onChange={(ev) => {
                set({
                  maxCharWidth: ev.currentTarget.valueAsNumber,
                });
              }}
            />
          </li>
          <TooltipText>
            {text(
              t("Maximum line width based on characters. Use value 0 for no limit."),
              t("Invalid values will be ignored and the last valid value will be restored"),
            )}
          </TooltipText>
        </LeftTooltip>

        <AspectRatioSelect />
      </DetailsContent>
    </ExpandDetails>
  );
}
