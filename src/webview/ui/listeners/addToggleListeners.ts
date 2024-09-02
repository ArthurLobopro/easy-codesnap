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
import { handleToggleBasedChange, handleToggleBasedClick } from "./handlers";

export function addToogleListeners() {
    handleToggleBasedChange(showLineNumbersInput, "showLineNumbers");
    handleToggleBasedChange(realLineNumbersInput, "realLineNumbers");

    handleToggleBasedChange(showWindowTitleInput, "showWindowTitle");
    handleToggleBasedChange(showWindowControlsInput, "showWindowControls");
    handleToggleBasedChange(highlightLineNumberInput, "highlightLineNumber");
    handleToggleBasedChange(watermarkInput, "watermark");

    handleToggleBasedChange(roundedCornersInput, "roundedCorners");
    handleToggleBasedChange(enableResizingInput, "enableResizing");
    handleToggleBasedChange(
        transparentBackgroundInput,
        "transparentBackground",
    );

    handleToggleBasedClick(toggleLinkedButton, "isLinked");
    handleToggleBasedClick(toggleLockedButton, "isLocked");
}
