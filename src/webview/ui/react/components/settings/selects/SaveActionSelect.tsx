import { useConfig, useSetConfig } from "@hooks//useConfig";
import { useTranslation } from "@hooks//useTranslation";
import type { SaveAction } from "@/../types";
import { SAVE_ACTIONS } from "@/constants";
import { ConfigSelect } from "../../ConfigSelect";

export function SaveActionSelect() {
  const { t } = useTranslation();

  const set = useSetConfig();
  const saveAction = useConfig("shutterAction");

  return (
    <li>
      <span>{t("Save Action")}</span>
      <ConfigSelect
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
      </ConfigSelect>
    </li>
  );
}
