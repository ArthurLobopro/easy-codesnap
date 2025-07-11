import type { WebviewConfig } from "../../../types";
import { SessionConfig } from "../../SessionConfig";
import {
    enableResizingInput,
    enableSymbolBreadcrumbInput,
    highlightLineNumberInput,
    realLineNumbersInput,
    roundedCornersInput,
    showLineNumbersInput,
    showWindowControlsInput,
    showWindowTitleInput,
    transparentBackgroundInput,
    watermarkBottomLeft,
    watermarkBottomRight,
    watermarkInput,
    watermarkTopLeft,
    watermarkTopRight,
} from "../elements";
import { handleToggleBasedChange } from "./handlers";

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
        enableSymbolBreadcrumbInput,
        "enableSymbolBreadcrumb",
    );
    handleToggleBasedChange(
        transparentBackgroundInput,
        "transparentBackground",
    );

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
