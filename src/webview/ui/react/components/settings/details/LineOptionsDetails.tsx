import { text } from "../../../../../util";
import { useConfigList, useSetConfig } from "../../../hooks/useConfig";
import { useTranslation } from "../../../hooks/useTranslation";
import { DetailsContent, DetailsSummary, ExpandDetails } from "../../Details";

export function LineOptionsDetails() {
  const { t } = useTranslation();

  const { showLineNumbers, realLineNumbers, highlightLineNumber } =
    useConfigList([
      "showLineNumbers",
      "realLineNumbers",
      "highlightLineNumber",
    ]);
  const { toggleCallback } = useSetConfig();

  return (
    <ExpandDetails>
      <DetailsSummary>
        <span>{t("Line Options")}</span>
      </DetailsSummary>
      <DetailsContent>
        <li>
          <label className="tooltip horizontal-left">
            <span>{t("Show Line Numbers")}</span>
            <input
              type="checkbox"
              tabIndex={-1}
              checked={showLineNumbers}
              onChange={toggleCallback("showLineNumbers")}
            />
            <span className="tooltip-text">
              {t(
                "If you want to highlight a line, you can click on the line number",
              )}
            </span>
          </label>
        </li>
        <li>
          <label className="tooltip horizontal-left">
            <span>{t("Real Line Numbers")}</span>
            <input
              type="checkbox"
              tabIndex={-1}
              checked={realLineNumbers}
              onChange={toggleCallback("realLineNumbers")}
            />
            <span className="tooltip-text">
              <span>{t("Show real line numbers.")}</span>
              <span>{t("Only valid when `Show Line Numbers` is marked")}</span>
            </span>
          </label>
        </li>
        <li>
          <label className="tooltip horizontal-left">
            <span>{t("Line Number Hightlight")}</span>
            <input
              type="checkbox"
              tabIndex={-1}
              checked={highlightLineNumber}
              onChange={toggleCallback("highlightLineNumber")}
            />
            <span className="tooltip-text">
              <span>
                {text(
                  t(
                    "When you highlight a line, the line number text will also be highlighted.",
                  ),
                  t("Only valid when `Show Line Numbers` is marked"),
                )}
              </span>
            </span>
          </label>
        </li>
      </DetailsContent>
    </ExpandDetails>
  );
}
