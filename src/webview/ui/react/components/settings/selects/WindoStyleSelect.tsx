import type { WindowStyle } from "../../../../../../types";
import { useConfig, useSetConfig } from "../../../hooks/useConfig";
import { useUpdateSelectsWidth } from "../../../hooks/useSelectWidthUpdater";
import { useTranslation } from "../../../hooks/useTranslation";

export function WindowStyleSelect() {
  const { t } = useTranslation();
  const windowStyle = useConfig("windowStyle");
  const set = useSetConfig();

  useUpdateSelectsWidth();

  return (
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
  );
}
