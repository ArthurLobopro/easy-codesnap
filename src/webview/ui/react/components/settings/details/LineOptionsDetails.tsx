import { useTranslation } from "@hooks//useTranslation";
import { text } from "@/util";
import { EscapeCodes } from "../../EscapeCodes";
import { DetailsContent, ExpandDetails, TextDetailsSummary } from "../../ExpandDetails";
import { ToggleInput } from "../../ToggleInput";

export function LineOptionsDetails() {
  const { t } = useTranslation();

  return (
    <ExpandDetails>
      <TextDetailsSummary text={t("Line Options")} />
      <DetailsContent>
        <ToggleInput
          config="showLineNumbers"
          label={t("Show Line Numbers")}
          tooltip={t("If you want to highlight a line, you can click on the line number")}
        />
        <ToggleInput
          config="realLineNumbers"
          label={t("Real Line Numbers")}
          tooltip={
            <EscapeCodes
              text={text(t("Show real line numbers."), t("Only valid when `Show Line Numbers` is marked"))}
            />
          }
        />
        <ToggleInput
          config="highlightLineNumber"
          label={t("Line Number Hightlight")}
          tooltip={
            <EscapeCodes
              text={text(
                t("When you highlight a line, the line number text will also be highlighted."),
                t("Only valid when `Show Line Numbers` is marked"),
              )}
            />
          }
        />
      </DetailsContent>
    </ExpandDetails>
  );
}
