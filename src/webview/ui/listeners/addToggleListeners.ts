import {
    enableResizingInput,
    realLineNumbersInput,
    roundedCornersInput,
    showLineNumbersInput,
    showWindowControlsInput,
    showWindowTitleInput,
    toggleLinkedButton,
    toggleLockedButton,
    transparentBackgroundInput,
} from "../../elements";
import {
    LineNumbersUpdater,
    LinkButtonUpdater,
    LockButtonUpdater,
    VarUpdater,
    VisibilityUpdater,
} from "../updaters";
import { handleToggleBasedChange, handleToggleBasedClick } from "./handlers";

export function addToogleListeners() {
    handleToggleBasedChange(
        showLineNumbersInput,
        "showLineNumbers",
        VarUpdater,
    );
    handleToggleBasedChange(
        realLineNumbersInput,
        "realLineNumbers",
        LineNumbersUpdater,
    );

    handleToggleBasedChange(
        showWindowTitleInput,
        "showWindowTitle",
        VisibilityUpdater,
    );
    handleToggleBasedChange(
        showWindowControlsInput,
        "showWindowControls",
        VisibilityUpdater,
    );

    handleToggleBasedChange(roundedCornersInput, "roundedCorners", VarUpdater);
    handleToggleBasedChange(enableResizingInput, "enableResizing", VarUpdater);
    handleToggleBasedChange(
        transparentBackgroundInput,
        "transparentBackground",
    );

    handleToggleBasedClick(toggleLinkedButton, "isLinked", LinkButtonUpdater);
    handleToggleBasedClick(toggleLockedButton, "isLocked", LockButtonUpdater);
}
