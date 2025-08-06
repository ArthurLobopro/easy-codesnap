import { useConfig, useSetConfig } from "@hooks//useConfig";
import { useTranslation } from "@hooks/useTranslation";
import type { WindowStyle } from "@/../types";
import { ConfigSelect } from "../../ConfigSelect";
import { SettingLineWithSelect } from "../../SettingLine";

export function WindowStyleSelect() {
  const { t } = useTranslation();
  const windowStyle = useConfig("windowStyle");
  const set = useSetConfig();

  return (
    <SettingLineWithSelect>
      <span>{t("Window Style")}</span>
      <ConfigSelect
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
      </ConfigSelect>
    </SettingLineWithSelect>
  );
}
