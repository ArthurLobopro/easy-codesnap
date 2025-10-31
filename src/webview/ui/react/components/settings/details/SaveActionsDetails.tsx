import { useTranslation } from "@hooks//useTranslation";
import { useConfig } from "@/ui/react/hooks/useConfig";
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
        <ToggleInput
          config="optimizeSvg"
          label={t("Optimize SVG")}
          tooltip={
            <EscapeCodes
              text={t(
                "Controls whether the SVG should be optimized before saving. Only valid if `{saveFormat}` is `svg`.",
                { saveFormat: t("Save Format") },
              )}
            />
          }
          disabled={saveFormat !== "svg"}
        />
        <SaveScaleSelect />
      </DetailsContent>
    </ExpandDetails>
  );
}
