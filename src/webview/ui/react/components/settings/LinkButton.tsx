import { openConfig, text } from "../../../../util";
import { useConfig, useSetConfig } from "../../hooks/useConfig";
import { useTranslation } from "../../hooks/useTranslation";
import { LinkIcon, UnlinkIcon } from "../icons";

export function LinkButton() {
  const { t } = useTranslation();

  const set = useSetConfig();
  const isLinked = useConfig("isLinked");

  return (
    <button className="tooltip bottom" id="link-indicator" type="button" onClick={() => set({ isLinked: !isLinked })}>
      {isLinked ? <LinkIcon /> : <UnlinkIcon />}
      <span className="tooltip-text right">
        <span>{t("Connect to editor")}</span>. <br />
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
      </span>
    </button>
  );
}
