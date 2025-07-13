import { useConfigList, useSetConfig } from "@hooks//useConfig";
import { useTranslation } from "@hooks//useTranslation";
import { openConfig, text } from "@/util";
import { DetailsContent, DetailsSummary, ExpandDetails } from "../../Details";
import { IconTypeSelect } from "../selects/IconTypeSelect";
import { RoundingLevelSelect } from "../selects/RoundigLevelSelect";
import { WindowStyleSelect } from "../selects/WindoStyleSelect";

export function WindowOptionsDetails() {
  const { t } = useTranslation();

  const { toggleCallback } = useSetConfig();
  const { showWindowTitle, showWindowControls, roundedCorners } = useConfigList(
    ["showWindowTitle", "showWindowControls", "roundedCorners"],
  );

  return (
    <ExpandDetails>
      <DetailsSummary>
        <span>{t("Window Options")}</span>
      </DetailsSummary>
      <DetailsContent>
        <WindowStyleSelect />
        <IconTypeSelect />
        <li>
          <label className="tooltip horizontal-left">
            <span>{t("Show Window Title")}</span>
            <input
              type="checkbox"
              tabIndex={-1}
              checked={showWindowTitle}
              onChange={toggleCallback("showWindowTitle")}
            />
            <span className="tooltip-text">
              <span>
                {text(
                  t(
                    "You can edit the Window Title text by double-clicking it.",
                  ),
                  t("You can edit the default Window Title text clicking"),
                )}
              </span>
              <span
                className="link"
                onClick={() => openConfig("windowTitleTemplate")}
              >
                {t("here")}
              </span>
            </span>
          </label>
        </li>
        <li>
          <label>
            <span>{t("Show Window Controls")}</span>
            <input
              type="checkbox"
              tabIndex={-1}
              checked={showWindowControls}
              onChange={toggleCallback("showWindowControls")}
            />
          </label>
        </li>
        <li>
          <label>
            <span>{t("Rounded Corners")}</span>
            <input
              type="checkbox"
              tabIndex={-1}
              checked={roundedCorners}
              onChange={toggleCallback("roundedCorners")}
            />
          </label>
        </li>
        <RoundingLevelSelect />
      </DetailsContent>
    </ExpandDetails>
  );
}
