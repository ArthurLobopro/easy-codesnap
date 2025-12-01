import { TooltipText } from "@arthur-lobo/react-custom-tooltip";
import { useConfigList, useSetConfig } from "../../hooks/useConfig";
import { useTranslation } from "../../hooks/useTranslation";
import { ColorInput } from "../ColorInput";
import { EscapeCodes } from "../EscapeCodes";
import { LeftTooltip } from "../LeftTooltip";
import { SettingLine } from "../SettingLine";
import { Label } from "../ToggleInput";

export function BackgroundColorInput() {
  const { t } = useTranslation();

  const { backgroundColor } = useConfigList(["backgroundColor"]);
  const { set } = useSetConfig();

  return (
    <SettingLine>
      <LeftTooltip className="w-full">
        <Label className="flex justify-between gap-1 p-1">
          {t("Background Color")}
          <ColorInput value={backgroundColor} setValue={(c) => set({ backgroundColor: c })} />
        </Label>

        <TooltipText>
          <EscapeCodes
            text={t(
              "Changes the `{container}` background color. To set advanced backgrounds such as gradients, use the VS Code Settings UI or the settings.json file.",
              { container: t("Container") },
            )}
          />
        </TooltipText>
      </LeftTooltip>
    </SettingLine>
  );
}
