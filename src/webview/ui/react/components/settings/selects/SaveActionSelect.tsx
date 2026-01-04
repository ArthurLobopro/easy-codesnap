import { useConfigList, useSetConfig } from "@hooks//useConfig";
import { useTranslation } from "@hooks//useTranslation";
import type { SaveAction } from "@/../types";
import { SAVE_ACTIONS } from "@/constants";
import { ConfigSelect } from "../../ConfigSelect";
import { SettingLineWithSelect } from "../../SettingLine";

export function SaveActionSelect() {
  const { t } = useTranslation();

  const set = useSetConfig();
  const { shutterAction: saveAction, saveFormat } = useConfigList(["shutterAction", "saveFormat"]);

  return (
    <SettingLineWithSelect>
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
          <option value={action} key={action} disabled={action === "copy" && saveFormat === "webp"}>
            {action}
          </option>
        ))}
      </ConfigSelect>
    </SettingLineWithSelect>
  );
}
