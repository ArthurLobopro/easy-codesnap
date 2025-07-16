import { SessionConfig } from "../../../SessionConfig";
import { vscode } from "../../../util";
import { useTranslation } from "../hooks/useTranslation";

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
      <li className="tooltip horizontal-left" onClick={openSettings}>
        <span className="codicon codicon-gear mr-1" />
        <span>{t("Open Settings")}</span>
        <span className="tooltip-text">{t("Open extension settings")}</span>
      </li>

      <li className="tooltip horizontal-left" onClick={resetConfig}>
        <span className="codicon codicon-sync mr-1" />
        <span>{t("Reset Settings")}</span>
        <span className="tooltip-text">{t("Reset settings to default")}</span>
      </li>

      <li className="tooltip horizontal-left" onClick={saveConfig}>
        <span className="codicon codicon-save-all mr-1" />
        <span>{t("Save Settings")}</span>
        <span className="tooltip-text">{t("Save current settings as default")}</span>
      </li>
    </>
  );
}
