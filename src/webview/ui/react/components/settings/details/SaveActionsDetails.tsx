import { useTranslation } from "@hooks//useTranslation";
import { DetailsContent, DetailsSummary, ExpandDetails } from "../../Details";
import { SaveActionSelect } from "../selects/SaveActionSelect";
import { SaveFormatSelect } from "../selects/SaveFormatSelect";
import { SaveScaleSelect } from "../selects/SaveScaleSelect";

export function SaveActionsDetails() {
  const { t } = useTranslation();

  return (
    <ExpandDetails>
      <DetailsSummary>
        <span>{t("Save Options")}</span>
      </DetailsSummary>
      <DetailsContent>
        <SaveActionSelect />
        <SaveFormatSelect />
        <SaveScaleSelect />
      </DetailsContent>
    </ExpandDetails>
  );
}
