import { TooltipText } from "@arthur-lobo/react-custom-tooltip";
import { useConfig, useSetConfig } from "@hooks/useConfig";
import { useTranslation } from "@hooks/useTranslation";
import { openConfig, text } from "../../../../util";
import { LinkIcon, UnlinkIcon } from "../icons";
import { TooltipBottom } from "../TooltipBottom";
import { TopButton } from "../TopButton";

export function LinkButton() {
  const { t } = useTranslation();

  const set = useSetConfig();
  const isLinked = useConfig("isLinked");

  return (
    <TooltipBottom horizontal="left">
      <TopButton onClick={() => set({ isLinked: !isLinked })}>{isLinked ? <LinkIcon /> : <UnlinkIcon />}</TopButton>
      <TooltipText>
        <span>{t(isLinked ? "Disconnect from editor" : "Connect to editor")}</span>. <br />
        <span>
          {text(
            t("Linked Snap Screens respond only to selection changes in the linked editor."),
            t("To change the default behavior, click"),
          )}
        </span>
        <span className="link" onClick={() => openConfig("linkOnOpen")}>
          {` ${t("here")}`}
        </span>
        .
      </TooltipText>
    </TooltipBottom>
  );
}
