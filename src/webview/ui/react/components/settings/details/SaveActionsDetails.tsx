import { useTranslation } from "@hooks//useTranslation";
import {
  DetailsContent,
  ExpandDetails,
  TextDetailsSummary,
} from "../../ExpandDetails";
import { SaveActionSelect } from "../selects/SaveActionSelect";
import { SaveFormatSelect } from "../selects/SaveFormatSelect";
import { SaveScaleSelect } from "../selects/SaveScaleSelect";

export function SaveActionsDetails() {
  const { t } = useTranslation();

  return (
    <ExpandDetails>
      <TextDetailsSummary text={t("Save Options")} />
      <DetailsContent>
        <SaveActionSelect />
        <SaveFormatSelect />
        <SaveScaleSelect />
      </DetailsContent>
    </ExpandDetails>
  );
}
