import { TooltipText } from "@arthur-lobo/react-custom-tooltip";
import { useConfigList, useSetConfig } from "@hooks//useConfig";
import { useTranslation } from "@hooks//useTranslation";
import { text } from "@/util";
import { LeftTooltip } from "../../LeftTooltip";
import { SettingLineWithSelect } from "../../SettingLine";

export function MaxSizeInputs() {
  const { t } = useTranslation();
  const { maxWidth, maxHeight } = useConfigList(["maxWidth", "maxHeight"]);
  const { set } = useSetConfig();

  const tooltip = (
    <TooltipText>
      {text(
        t(
          "Sets the maximum size in pixels of PNG and WEBP snapshots. Larger snapshots are scaled down proportionally.",
        ),
        t("Width and height are checked separately. Use value 0 for no limit."),
      )}
    </TooltipText>
  );

  return (
    <>
      <LeftTooltip>
        <SettingLineWithSelect>
          <span>{t("Max width (px)")}</span>
          <input
            type="number"
            min={0}
            step={1}
            value={maxWidth}
            onChange={(ev) => set({ maxWidth: ev.currentTarget.valueAsNumber })}
            className="w-[7ch]"
          />
        </SettingLineWithSelect>
        {tooltip}
      </LeftTooltip>
      <LeftTooltip>
        <SettingLineWithSelect>
          <span>{t("Max height (px)")}</span>
          <input
            type="number"
            min={0}
            step={1}
            value={maxHeight}
            onChange={(ev) => set({ maxHeight: ev.currentTarget.valueAsNumber })}
            className="w-[7ch]"
          />
        </SettingLineWithSelect>
        {tooltip}
      </LeftTooltip>
    </>
  );
}
