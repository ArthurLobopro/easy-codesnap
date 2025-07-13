import type {
  RoundingLevel,
  WindowIconType,
  WindowStyle,
} from "../../../../../../types";
import { ROUNDING_LEVELS } from "../../../../../constants";
import { openConfig, text } from "../../../../../util";
import { useConfigList, useSetConfig } from "../../../hooks/useConfig";
import { useTranslation } from "../../../hooks/useTranslation";
import { Details, DetailsContent, DetailsSummary } from "../../Details";

export function WindowOptionsDetails() {
  const { t } = useTranslation();

  const { set, toggleCallback } = useSetConfig();
  const {
    showWindowTitle,
    showWindowControls,
    windowStyle,
    windowIconType,
    roundedCorners,
    roundingLevel,
  } = useConfigList([
    "showWindowTitle",
    "showWindowControls",
    "windowStyle",
    "windowIconType",
    "roundedCorners",
    "roundingLevel",
  ]);

  return (
    <Details>
      <DetailsSummary>
        <span>{t("Window Options")}</span>
      </DetailsSummary>
      <DetailsContent>
        <li>
          <span>{t("Window Style")}</span>
          <select
            tabIndex={-1}
            value={windowStyle}
            onChange={(ev) => {
              set({
                windowStyle: ev.currentTarget.value as WindowStyle,
              });
            }}
          >
            <option value="macos">MacOS</option>
            <option value="windows">Windows</option>
          </select>
        </li>
        <li>
          <span>{t("Icon Type")}</span>
          <select
            value={windowIconType}
            onChange={(ev) => {
              set({
                windowIconType: ev.currentTarget.value as WindowIconType,
              });
            }}
          >
            <option value="round">{t("Rounded")}</option>
            <option value="square">{t("Square")}</option>
          </select>
        </li>
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
              data-configname="roundedCorners"
              tabIndex={-1}
              checked={roundedCorners}
              onChange={toggleCallback("roundedCorners")}
            />
          </label>
        </li>
        <li className="tooltip horizontal-left">
          <span>{t("Rounding Level")}</span>
          <select
            data-configname="roundingLevel"
            tabIndex={-1}
            disabled={!roundedCorners}
            value={roundingLevel}
            onChange={(ev) => {
              set({
                roundingLevel: Number(ev.currentTarget.value) as RoundingLevel,
              });
            }}
          >
            {ROUNDING_LEVELS.map((r) => (
              <option value={r} key={r}>
                {r}
              </option>
            ))}
          </select>
          <span className="tooltip-text">
            <span>
              {text(
                t("The Window rounding level."),
                t("Only valid when `Rounded Corners` is marked"),
              )}
            </span>
          </span>
        </li>
      </DetailsContent>
    </Details>
  );
}
