import { TooltipText } from "@arthur-lobo/react-custom-tooltip";
import { useConfig, useSetConfig } from "@hooks/useConfig";
import { useTranslation } from "@hooks/useTranslation";
import { openConfig, text } from "../../../../util";
import { TooltipBottom } from "../TooltipBottom";
import { TopButton } from "../TopButton";

export function LockButton() {
  const { t } = useTranslation();

  const set = useSetConfig();
  const isLocked = useConfig("isLocked");

  return (
    <TooltipBottom horizontal="left">
      <TopButton onClick={() => set({ isLocked: !isLocked })}>
        <span className={`codicon ${isLocked ? "codicon-lock" : "codicon-unlock"}`} style={{ fontSize: 24 }} />
      </TopButton>
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
