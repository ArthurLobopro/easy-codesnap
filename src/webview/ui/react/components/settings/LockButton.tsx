import { TooltipText } from "@arthur-lobo/react-custom-tooltip";
import { useConfig, useSetConfig } from "@hooks/useConfig";
import { useTranslation } from "@hooks/useTranslation";
import { openConfig, text } from "../../../../util";
import { TooltipBottom } from "../TooltipBottom";

export function LockButton() {
  const { t } = useTranslation();

  const set = useSetConfig();
  const isLocked = useConfig("isLocked");

  return (
    <TooltipBottom horizontal="left">
      <button className="tooltip bottom" id="lock-indicator" onClick={() => set({ isLocked: !isLocked })} type="button">
        <span className={`codicon ${isLocked ? "codicon-lock" : "codicon-unlock"}`} />
      </button>
      <TooltipText>
        <span>{t(isLocked ? "Unlock changes" : "Lock changes")}.</span> <br />
        <span>
          {text(
            t("Locked Snap Screens will not listen any selection changes."),
            t("To change the default behavior, click"),
          )}
        </span>
        <span className="link" onClick={() => openConfig("lockOnOpen")}>
          {" "}
          {t("here")}
        </span>
        .
      </TooltipText>
    </TooltipBottom>
  );
}
