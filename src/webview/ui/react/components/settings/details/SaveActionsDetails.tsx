import { useTranslation } from "../../../hooks/useTranslation";
import { Details, DetailsContent, DetailsSummary } from "../../Details";
import { SaveActionSelect } from "../selects/SaveActionSelect";
import { SaveFormatSelect } from "../selects/SaveFormatSelect";
import { SaveScaleSelect } from "../selects/SaveScaleSelect";

export function SaveActionsDetails() {
  const { t } = useTranslation();

  return (
    <Details>
      <DetailsSummary>
        <span>{t("Save Options")}</span>
      </DetailsSummary>
      <DetailsContent>
        <SaveActionSelect />
        <SaveFormatSelect />
        <SaveScaleSelect />
      </DetailsContent>
    </Details>
  );
}
