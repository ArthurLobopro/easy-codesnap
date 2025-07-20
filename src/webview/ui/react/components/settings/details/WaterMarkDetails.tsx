import { useConfigList, useSetConfig } from "@hooks//useConfig";
import { useTranslation } from "@hooks//useTranslation";
import { openConfig, text } from "@/util";
import { EscapeCodes } from "../../EscapeCodes";
import { DetailsContent, ExpandDetails, TextDetailsSummary } from "../../ExpandDetails";
import { ToggleInput } from "../../ToggleInput";

export function WatermarkDetails() {
  const { t } = useTranslation();

  const { watermarkPosition, target } = useConfigList(["watermarkPosition", "target"]);
  const set = useSetConfig();

  return (
    <ExpandDetails>
      <TextDetailsSummary text={t("Show Watermark")} />
      <DetailsContent>
        <ToggleInput
          config="watermark"
          label={t("Show Watermark")}
          tooltip={
            <>
              <span>
                {text(
                  t("You can edit the Watermark text by double-clicking it."),
                  t("You can edit the default Watermark text clicking"),
                  " ",
                )}
              </span>
              <span className="link" onClick={() => openConfig("defaultWatermarkText")}>
                {t("here")}
              </span>
            </>
          }
        />

        <li className="tooltip horizontal-left">
          <span>{t("Watermark Position")}</span>
          <div id="watermark-position-wrapper">
            {target === "container" && (
              <>
                <label>
                  <div className="bg" />
                  <input
                    type="radio"
                    name="watermark-position"
                    value="top-left"
                    checked={watermarkPosition === "top-left"}
                    onChange={() =>
                      set({
                        watermarkPosition: "top-left",
                      })
                    }
                  />
                </label>
                <label>
                  <div className="bg" />
                  <input
                    type="radio"
                    name="watermark-position"
                    value="top-right"
                    checked={watermarkPosition === "top-right"}
                    onChange={() =>
                      set({
                        watermarkPosition: "top-right",
                      })
                    }
                  />
                </label>
              </>
            )}
            <label>
              <div className="bg" />
              <input
                type="radio"
                name="watermark-position"
                value="bottom-left"
                checked={watermarkPosition === "bottom-left"}
                onChange={() => set({ watermarkPosition: "bottom-left" })}
              />
            </label>
            <label>
              <div className="bg" />
              <input
                type="radio"
                name="watermark-position"
                value="bottom-right"
                checked={watermarkPosition === "bottom-right"}
                onChange={() => set({ watermarkPosition: "bottom-right" })}
              />
            </label>
          </div>
          <span className="tooltip-text">
            <EscapeCodes
              text={t(
                "The position of the watermark in the snapshot. Top positions are only available when `Target` is `container`",
              )}
            />
          </span>
        </li>
      </DetailsContent>
    </ExpandDetails>
  );
}
