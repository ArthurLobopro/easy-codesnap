import { TooltipText } from "@arthur-lobo/react-custom-tooltip";
import { useConfig, useSetConfig } from "@hooks//useConfig";
import { useTranslation } from "@hooks//useTranslation";
import { openConfig, text } from "@/util";
import type { WebviewConfig } from "../../../../../../types";
import { EscapeCodes } from "../../EscapeCodes";
import { DetailsContent, ExpandDetails, TextDetailsSummary } from "../../ExpandDetails";
import { LeftTooltip } from "../../LeftTooltip";
import { SettingLineWithSelect } from "../../SettingLine";
import { ToggleInput } from "../../ToggleInput";

interface WatermarPositionInputProps {
  value: WebviewConfig["watermarkPosition"];
}

function WatermarkPositionInput({ value }: WatermarPositionInputProps) {
  const watermarkPosition = useConfig("watermarkPosition");
  const set = useSetConfig();

  return (
    <label className="flex w-full aspect-square">
      <input
        type="radio"
        name="watermark-position"
        value={value}
        checked={watermarkPosition === value}
        className="hidden"
        onChange={() =>
          set({
            watermarkPosition: value,
          })
        }
      />
    </label>
  );
}

export function WatermarkDetails() {
  const { t } = useTranslation();

  const target = useConfig("target");

  return (
    <ExpandDetails>
      <TextDetailsSummary text={t("Watermark Options")} />
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

        <LeftTooltip>
          <SettingLineWithSelect>
            <span>{t("Watermark Position")}</span>
            <div id="watermark-position-wrapper">
              {target === "container" && (
                <>
                  <WatermarkPositionInput value="top-left" />
                  <WatermarkPositionInput value="top-right" />
                </>
              )}
              <WatermarkPositionInput value="bottom-left" />
              <WatermarkPositionInput value="bottom-right" />
            </div>
          </SettingLineWithSelect>
          <TooltipText>
            <EscapeCodes
              text={t(
                "The position of the watermark in the snapshot. Top positions are only available when `{target}` is `{container}`",
                { target: t("Target"), container: t("Container") },
              )}
            />
          </TooltipText>
        </LeftTooltip>
      </DetailsContent>
    </ExpandDetails>
  );
}
