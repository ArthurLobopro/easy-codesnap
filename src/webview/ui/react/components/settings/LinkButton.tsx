import { TooltipText } from "@arthur-lobo/react-custom-tooltip";
import { useConfig, useSetConfig } from "@hooks/useConfig";
import { useTranslation } from "@hooks/useTranslation";
import { openConfig, text } from "../../../../util";
import { LinkIcon, UnlinkIcon } from "../icons";
import { TooltipBottom } from "../TooltipBottom";

export function LinkButton() {
  const { t } = useTranslation();

  const set = useSetConfig();
  const isLinked = useConfig("isLinked");

  return (
    <TooltipBottom horizontal="left">
      <button id="link-indicator" type="button" onClick={() => set({ isLinked: !isLinked })}>
        {isLinked ? <LinkIcon /> : <UnlinkIcon />}
      </button>
      <TooltipText>
        <span>{t(isLinked ? "Broken editor conection" : "Connect to editor")}</span>. <br />
        <span>
          {text(
            t("Linked Snap Screens will listen only to current editor selection changes."),
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
