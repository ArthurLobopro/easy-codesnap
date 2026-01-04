import { TooltipText } from "@arthur-lobo/react-custom-tooltip";
import { useConfigList, useSetConfig } from "@hooks//useConfig";
import { useTranslation } from "@hooks//useTranslation";
import type { SaveAction } from "@/../types";
import { SAVE_ACTIONS } from "@/constants";
import { ConfigSelect } from "../../ConfigSelect";
import { EscapeCodes } from "../../EscapeCodes";
import { LeftTooltip } from "../../LeftTooltip";
import { SettingLineWithSelect } from "../../SettingLine";

export function SaveActionSelect() {
  const { t } = useTranslation();

  const set = useSetConfig();
  const { shutterAction: saveAction, saveFormat } = useConfigList(["shutterAction", "saveFormat"]);

  return (
    <LeftTooltip>
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
      <TooltipText>
        <EscapeCodes
          text={t("The option `copy` is not suported when `{saveFormat}` is set to `webp`", {
            saveFormat: t("Save Format"),
          })}
        />
      </TooltipText>
    </LeftTooltip>
  );
}
