import { useConfig, useSetConfig } from "@hooks//useConfig";
import { useUpdateSelectsWidth } from "@hooks//useSelectWidthUpdater";
import { useTranslation } from "@hooks//useTranslation";
import type { SaveAction } from "@/../types";
import { SAVE_ACTIONS } from "@/constants";

export function SaveActionSelect() {
  const { t } = useTranslation();

  const set = useSetConfig();
  const saveAction = useConfig("shutterAction");

  useUpdateSelectsWidth();

  return (
    <li>
      <span>{t("Save Action")}</span>
      <select
        tabIndex={-1}
        value={saveAction}
        onChange={(ev) => {
          set({
            shutterAction: ev.currentTarget.value as SaveAction,
          });
        }}
      >
        {SAVE_ACTIONS.map((action) => (
          <option value={action} key={action}>
            {action}
          </option>
        ))}
      </select>
    </li>
  );
}
