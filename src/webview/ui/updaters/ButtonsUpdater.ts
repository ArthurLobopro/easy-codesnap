import { SessionConfig } from "../../SessionConfig";
import { $ } from "../../util";
import { Updater } from "../Updater";
import { toggleLinkedButton, toggleLockedButton } from "../elements";

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

        $(`[data-state="isLocked"]`, toggleLockedButton).innerText = isLocked
            ? "Unlock changes"
            : "Lock changes";
    }
}

export class LinkButtonUpdater extends Updater {
    constructor() {
        super(["isLinked"]);
    }

    update(): void {
        const isLinked = SessionConfig.get("isLinked");

        toggleLinkedButton.dataset.state = isLinked ? "linked" : "unlinked";

        $(`[data-state="isLinked"]`, toggleLinkedButton).innerText = isLinked
            ? "Broken editor conection"
            : "Connect to editor";
    }
}
