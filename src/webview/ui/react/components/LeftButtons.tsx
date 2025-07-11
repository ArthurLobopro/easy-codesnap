import { useContext } from "react";
import { vscode } from "../../../util";
import { TranslationContext } from "../contexts/TranslationContext";
import { useConfig } from "../hooks/useConfig";
import { LinkIcon, UnlinkIcon } from "./icons";

export function LeftButtons() {
    const { t } = useContext(TranslationContext);

    const { isLocked, isLinked, set } = useConfig(["isLocked", "isLinked"]);

    return (
        <>
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

            <button
                className="tooltip bottom"
                id="link-indicator"
                data-state="unlinked"
                data-action="toggle-link"
                data-configname="isLinked"
                type="button"
                onClick={() => set({ isLinked: !isLinked })}
            >
                {isLinked ? <LinkIcon /> : <UnlinkIcon />}
                <span className="tooltip-text right">
                    <span data-state="isLinked">{t("Connect to editor")}</span>.{" "}
                    <br />
                    <span>
                        {t(
                            "Linked Snap Screens will listen only to current editor selection changes.",
                        )}
                    </span>
                    <span>{t("To change the default behavior, click")}</span>
                    <span className="link" data-openconfig="linkOnOpen">
                        {t("here")}
                    </span>
                    .
                </span>
            </button>
        </>
    );
}
