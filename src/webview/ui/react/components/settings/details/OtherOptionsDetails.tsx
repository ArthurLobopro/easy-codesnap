import { useConfigList, useSetConfig } from "@hooks//useConfig";
import { useTranslation } from "@hooks//useTranslation";
import { text } from "@/util";
import { EscapeCodes } from "../../EscapeCodes";
import { DetailsContent, ExpandDetails, TextDetailsSummary } from "../../ExpandDetails";
import { ToggleInput } from "../../ToggleInput";
import { AspectRatioSelect } from "../selects/AspectRatioSelect";
import { TargetSelect } from "../selects/TargetSelect";

export function OtherOptionsDetails() {
  const { t } = useTranslation();

  const { target, transparentBackground, maxCharWidth } = useConfigList([
    "target",
    "transparentBackground",
    "maxCharWidth",
  ]);
  const { set, toggleCallback } = useSetConfig();

  return (
    <ExpandDetails>
      <TextDetailsSummary text={t("Other Options")} />
      <DetailsContent>
        <TargetSelect />
        <li>
          <label className="tooltip horizontal-left">
            <span>{t("Transparent Background")}</span>
            <input
              type="checkbox"
              tabIndex={-1}
              checked={transparentBackground}
              disabled={target === "window"}
              onChange={toggleCallback("transparentBackground")}
            />
            <span className="tooltip-text">
              <EscapeCodes
                text={text(
                  t("When you take the Snapshot, the container background will be transparent."),
                  t("Only valid when `Target` is `container`"),
                )}
              />
            </span>
          </label>
        </li>

        <ToggleInput
          config="enableResizing"
          label={t("Enable Resizing")}
          tooltip={
            <EscapeCodes
              text={text(
                t("Enables manual resizing of the `Snap Window`."),
                t("Disabling this will also reset the `Snap Window` size."),
              )}
            />
          }
        />

        <ToggleInput config="enableSymbolBreadcrumb" label={t("Enable Symbol Breadcrumb")} />

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
              t("Maximum line width based on characters. Use value 0 for no limit."),
              t("Invalid values will be ignored and the last valid value will be restored"),
            )}
          </span>
        </li>
        <AspectRatioSelect />
      </DetailsContent>
    </ExpandDetails>
  );
}
