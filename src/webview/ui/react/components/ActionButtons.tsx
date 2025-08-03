import { TooltipText } from "@arthur-lobo/react-custom-tooltip";
import { SessionConfig } from "../../../SessionConfig";
import { vscode } from "../../../util";
import { useTranslation } from "../hooks/useTranslation";
import { LeftTooltip } from "./LeftTooltip";
import { SettingLine } from "./SettingLine";

export function ActionButtons() {
  const { t } = useTranslation();

  const openSettings = () => vscode.postMessage({ type: "open-settings" });
  const resetConfig = () => vscode.postMessage({ type: "update-config" });
  const saveConfig = () =>
    vscode.postMessage({
      type: "save-config",
      config: SessionConfig.get(),
    });

  return (
    <>
      <LeftTooltip>
        <SettingLine onClick={openSettings} className="p-1">
          <span className="codicon codicon-gear mr-1" />
          <span>{t("Open Settings")}</span>
        </SettingLine>
        <TooltipText>{t("Open extension settings")}</TooltipText>
      </LeftTooltip>

      <LeftTooltip>
        <SettingLine onClick={resetConfig} className="p-1">
          <span className="codicon codicon-sync mr-1" />
          <span>{t("Reset Settings")}</span>
        </SettingLine>
        <TooltipText>{t("Reset settings to default")}</TooltipText>
      </LeftTooltip>

      <LeftTooltip>
        <SettingLine onClick={saveConfig} className="p-1">
          <span className="codicon codicon-save-all mr-1" />
          <span>{t("Save Settings")}</span>
        </SettingLine>
        <TooltipText>{t("Save current settings as default")}</TooltipText>
      </LeftTooltip>
    </>
  );
}
