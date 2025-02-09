import type { WebviewConfig } from "../../../types";
import { SessionConfig } from "../../SessionConfig";
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
    watermarkBottomLeft,
    watermarkBottomRight,
    watermarkInput,
    watermarkTopLeft,
    watermarkTopRight,
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

    [
        watermarkTopLeft,
        watermarkTopRight,
        watermarkBottomRight,
        watermarkBottomLeft,
    ].forEach((input) => {
        input.addEventListener("change", () => {
            if (input.checked) {
                SessionConfig.set({
                    watermarkPosition:
                        input.value as WebviewConfig["watermarkPosition"],
                });
            }
        });
    });
}
