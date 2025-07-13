import { useTranslation } from "../../../hooks/useTranslation";
import { ActionButtons } from "../../ActionButtons";
import { Details, DetailsContent, DetailsSummary } from "../../Details";

export function ActionDetails() {
  const { t } = useTranslation();

  return (
    <Details>
      <DetailsSummary>
        <span>{t("Actions")}</span>
      </DetailsSummary>
      <DetailsContent>
        <ActionButtons />
      </DetailsContent>
    </Details>
  );
}
