import { useTranslation } from "../../../hooks/useTranslation";
import { ActionButtons } from "../../ActionButtons";
import { DetailsContent, DetailsSummary, ExpandDetails } from "../../Details";

export function ActionDetails() {
  const { t } = useTranslation();

  return (
    <ExpandDetails>
      <DetailsSummary>
        <span>{t("Actions")}</span>
      </DetailsSummary>
      <DetailsContent>
        <ActionButtons />
      </DetailsContent>
    </ExpandDetails>
  );
}
