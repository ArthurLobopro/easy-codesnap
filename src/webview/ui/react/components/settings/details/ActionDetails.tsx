import { useTranslation } from "@hooks//useTranslation";
import { ActionButtons } from "../../ActionButtons";
import {
  DetailsContent,
  ExpandDetails,
  TextDetailsSummary,
} from "../../ExpandDetails";

export function ActionDetails() {
  const { t } = useTranslation();

  return (
    <ExpandDetails>
      <TextDetailsSummary text={t("Actions")} />
      <DetailsContent>
        <ActionButtons />
      </DetailsContent>
    </ExpandDetails>
  );
}
