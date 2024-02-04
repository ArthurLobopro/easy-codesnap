import { getSessionConfig } from "../../SessionConfig";
import { toggleLinkedButton, toggleLockedButton } from "../../elements";

export function LockButtonUpdater() {
    const { isLocked } = getSessionConfig();

    toggleLockedButton.classList.remove("codicon-unlock");
    toggleLockedButton.classList.remove("codicon-lock");

    toggleLockedButton.classList.add(
        isLocked ? "codicon-lock" : "codicon-unlock",
    );
    toggleLockedButton.title = isLocked ? "Unlock changes" : "Lock changes";
}

export function LinkButtonUpdater() {
    const { isLinked } = getSessionConfig();

    toggleLinkedButton.dataset.state = isLinked ? "linked" : "unlinked";
    toggleLinkedButton.title = isLinked
        ? "Broken Connection to editor"
        : "Connect to editor";
}
