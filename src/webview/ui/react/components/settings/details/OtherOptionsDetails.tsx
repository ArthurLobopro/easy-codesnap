import type { AspectRatio, Target } from "../../../../../../types";
import { ASPECT_RATIOS } from "../../../../../constants";
import { text } from "../../../../../util";
import { useConfigList, useSetConfig } from "../../../hooks/useConfig";
import { useTranslation } from "../../../hooks/useTranslation";
import { DetailsContent, DetailsSummary, ExpandDetails } from "../../Details";

export function OtherOptionsDetails() {
  const { t } = useTranslation();

  const {
    target,
    transparentBackground,
    enableResizing,
    enableSymbolBreadcrumb,
    maxCharWidth,
    aspectRatio,
  } = useConfigList([
    "target",
    "transparentBackground",
    "enableResizing",
    "enableSymbolBreadcrumb",
    "maxCharWidth",
    "aspectRatio",
  ]);
  const set = useSetConfig();

  return (
    <ExpandDetails>
      <DetailsSummary>
        <span>{t("Other Options")}</span>
      </DetailsSummary>
      <DetailsContent>
        <li>
          <span>{t("Target")}</span>
          <select
            tabIndex={-1}
            value={target}
            onChange={(ev) => {
              set({ target: ev.currentTarget.value as Target });
            }}
          >
            <option value="window">window</option>
            <option value="container">container</option>
          </select>
        </li>
        <li>
          <label className="tooltip horizontal-left">
            <span>{t("Transparent Background")}</span>
            <input
              type="checkbox"
              tabIndex={-1}
              checked={transparentBackground}
              disabled={target === "window"}
              onChange={(ev) =>
                set({
                  transparentBackground: ev.currentTarget.checked,
                })
              }
            />
            <span className="tooltip-text">
              {text(
                t(
                  "When you take the Snapshot, the container background will be transparent.",
                ),
                t("Only valid when `Target` is `container`"),
              )}
            </span>
          </label>
        </li>

        <li>
          <label className="tooltip horizontal-left">
            <span>{t("Enable Resizing")}</span>
            <input
              type="checkbox"
              tabIndex={-1}
              checked={enableResizing}
              onChange={(ev) =>
                set({
                  enableResizing: ev.currentTarget.checked,
                })
              }
            />
            <span className="tooltip-text">
              {text(
                t("Enables manual resizing of the `Snap Window`."),
                t("Disabling this will also reset the `Snap Window` size."),
              )}
            </span>
          </label>
        </li>
        <li>
          <label>
            <span>{t("Enable Symbol Breadcrumb")}</span>
            <input
              type="checkbox"
              tabIndex={-1}
              checked={enableSymbolBreadcrumb}
              onChange={(ev) =>
                set({
                  enableSymbolBreadcrumb: ev.currentTarget.checked,
                })
              }
            />
          </label>
        </li>
        <li className="tooltip horizontal-left">
          <span>{t("Max char width")}</span>
          <input
            type="number"
            min={0}
            max={200}
            maxLength={3}
            value={maxCharWidth}
            onChange={(ev) => {
              set({
                maxCharWidth: ev.currentTarget.valueAsNumber,
              });
            }}
          />
          <span className="tooltip-text">
            {text(
              t(
                "Maximum line width based on characters. Use value 0 for no limit.",
              ),
              t(
                "Invalid values will be ignored and the last valid value will be restored",
              ),
            )}
          </span>
        </li>
        <li>
          <span>{t("Aspect Ratio")}</span>
          <select
            value={aspectRatio}
            onChange={(ev) =>
              set({
                aspectRatio: ev.currentTarget.value as AspectRatio,
              })
            }
          >
            {ASPECT_RATIOS.map((ratio) => (
              <option value={ratio} key={ratio}>
                {ratio}
              </option>
            ))}
          </select>
        </li>
      </DetailsContent>
    </ExpandDetails>
  );
}
