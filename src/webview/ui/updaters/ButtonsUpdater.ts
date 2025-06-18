import { SessionConfig } from "../../SessionConfig";
import { $, t } from "../../util";
import { toggleLinkedButton, toggleLockedButton } from "../elements";
import { Updater } from "../Updater";

export class LockButtonUpdater extends Updater {
    constructor() {
        super(["isLocked"]);
    }

    update(): void {
        const isLocked = SessionConfig.get("isLocked");

        const icon = $(".codicon", toggleLockedButton);

        icon.classList.remove("codicon-unlock");
        icon.classList.remove("codicon-lock");

        icon.classList.add(isLocked ? "codicon-lock" : "codicon-unlock");

        const buttonText = isLocked ? "Unlock changes" : "Lock changes";

        $(`[data-state="isLocked"]`, toggleLockedButton).innerText =
            t(buttonText);
    }
}

export class LinkButtonUpdater extends Updater {
    constructor() {
        super(["isLinked"]);
    }

    update(): void {
        const isLinked = SessionConfig.get("isLinked");

        toggleLinkedButton.dataset.state = isLinked ? "linked" : "unlinked";

        const buttonText = isLinked
            ? "Broken editor conection"
            : "Connect to editor";

        $(`[data-state="isLinked"]`, toggleLinkedButton).innerText =
            t(buttonText);
    }
}
