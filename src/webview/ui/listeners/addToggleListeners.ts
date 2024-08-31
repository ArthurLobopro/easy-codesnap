import {
    enableResizingInput,
    highlightLineNumberInput,
    realLineNumbersInput,
    roundedCornersInput,
    showLineNumbersInput,
    showWindowControlsInput,
    showWindowTitleInput,
    toggleLinkedButton,
    toggleLockedButton,
    transparentBackgroundInput,
    watermarkInput,
} from "../elements";
import { LineNumbersUpdater, VisibilityUpdater } from "../updaters";
import { handleToggleBasedChange, handleToggleBasedClick } from "./handlers";

export function addToogleListeners() {
    handleToggleBasedChange(showLineNumbersInput, "showLineNumbers");
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
    handleToggleBasedChange(
        highlightLineNumberInput,
        "highlightLineNumber",
        VisibilityUpdater,
    );
    handleToggleBasedChange(watermarkInput, "watermark", VisibilityUpdater);

    handleToggleBasedChange(roundedCornersInput, "roundedCorners");
    handleToggleBasedChange(enableResizingInput, "enableResizing");
    handleToggleBasedChange(
        transparentBackgroundInput,
        "transparentBackground",
    );

    handleToggleBasedClick(toggleLinkedButton, "isLinked");
    handleToggleBasedClick(toggleLockedButton, "isLocked");
}
