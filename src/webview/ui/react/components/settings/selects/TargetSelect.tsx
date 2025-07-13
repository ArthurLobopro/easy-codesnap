import type { Target } from "../../../../../../types";
import { useConfig, useSetConfig } from "../../../hooks/useConfig";
import { useUpdateSelectsWidth } from "../../../hooks/useSelectWidthUpdater";
import { useTranslation } from "../../../hooks/useTranslation";

export function TargetSelect() {
  const { t } = useTranslation();
  const target = useConfig("target");
  const set = useSetConfig();

  useUpdateSelectsWidth();

  return (
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
  );
}
