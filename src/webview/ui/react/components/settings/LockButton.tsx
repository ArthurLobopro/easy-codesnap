import { vscode } from "../../../../util";
import { useConfig, useSetConfig } from "../../hooks/useConfig";
import { useTranslation } from "../../hooks/useTranslation";

export function LockButton() {
    const { t } = useTranslation();

    const set = useSetConfig();
    const isLocked = useConfig("isLocked");

    return (
        <button
            className="tooltip bottom"
            id="lock-indicator"
            data-action="toggle-lock"
            data-configname="isLocked"
            onClick={() => set({ isLocked: !isLocked })}
            type="button"
        >
            <span
                className={`codicon ${isLocked ? "codicon-lock" : "codicon-unlock"}`}
            />
            <span className="tooltip-text right">
                <span data-state="isLocked">
                    {t(isLocked ? "Unlock changes" : "Lock changes")}
                </span>
                . <br />
                <span>
                    {t(
                        "Locked Snap Screens will not listen any selection changes.",
                    )}
                </span>
                <span>{t("To change the default behavior, click")}</span>
                <span
                    className="link"
                    data-openconfig="lockOnOpen"
                    onClick={() => {
                        vscode.postMessage({
                            type: "open-config",
                            configName: "lockOnOpen",
                        });
                    }}
                >
                    {t("here")}
                </span>
                .
            </span>
        </button>
    );
}
