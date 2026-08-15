import { useTranslation } from "@hooks//useTranslation";
import { useConfig } from "@/ui/react/hooks/useConfig";
import { text } from "@/util";
import { EscapeCodes } from "../../EscapeCodes";
import { DetailsContent, ExpandDetails, TextDetailsSummary } from "../../ExpandDetails";
import { ToggleInput } from "../../ToggleInput";
import { SaveActionSelect } from "../selects/SaveActionSelect";
import { SaveFormatSelect } from "../selects/SaveFormatSelect";
import { SaveScaleSelect } from "../selects/SaveScaleSelect";

export function SaveActionsDetails() {
  const { t } = useTranslation();
  const saveFormat = useConfig("saveFormat");

  return (
    <ExpandDetails>
      <TextDetailsSummary text={t("Save Options")} />
      <DetailsContent>
        <SaveActionSelect />
        <SaveFormatSelect />
        <SaveScaleSelect />
        <ToggleInput
          config="optimizeSvg"
          label={t("Optimize SVG")}
          tooltip={
            <EscapeCodes
              text={t(
                "Controls whether SVG files are optimized before saving. Only valid if `{saveFormat}` is `svg`.",
                { saveFormat: t("Save Format") },
              )}
            />
          }
          disabled={saveFormat !== "svg"}
        />
        <ToggleInput
          config="useFallbackPngExporter"
          label={t("Use Fallback PNG Exporter")}
          tooltip={text(
            t("Uses the fallback PNG exporter as the primary exporter when saving snapshots in PNG format."),
            t("This option can be useful when the default exporter produces unexpected results."),
          )}
          disabled={saveFormat !== "png"}
        />
      </DetailsContent>
    </ExpandDetails>
  );
}
