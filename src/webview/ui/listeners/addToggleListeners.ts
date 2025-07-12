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
} from "../elements";
import { handleToggleBasedChange } from "./handlers";

export function addToogleListeners() {
    handleToggleBasedChange(showLineNumbersInput, "showLineNumbers");
    handleToggleBasedChange(realLineNumbersInput, "realLineNumbers");

    handleToggleBasedChange(showWindowTitleInput, "showWindowTitle");
    handleToggleBasedChange(showWindowControlsInput, "showWindowControls");
    handleToggleBasedChange(highlightLineNumberInput, "highlightLineNumber");

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
}
