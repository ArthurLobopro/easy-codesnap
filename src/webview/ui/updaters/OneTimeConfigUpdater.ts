import { getSessionConfig } from "../../SessionConfig";

import {
    enableResizingInput,
    realLineNumbersInput,
    roundedCornersInput,
    roundingLevelSelect,
    saveFormatSelect,
    showLineNumbersInput,
    showWindowControlsInput,
    showWindowTitleInput,
    shutterActionSelect,
    targetSelect,
    transparentBackgroundInput,
    windowStyleSelect,
} from "../../elements";

export function OneTimeConfigUpdater() {
    const {
        showLineNumbers,
        realLineNumbers,
        showWindowControls,
        roundedCorners,
        transparentBackground,
        showWindowTitle,
        shutterAction,
        target,
        enableResizing,
        roundingLevel,
        saveFormat,
        windowStyle,
    } = getSessionConfig();

    showWindowTitleInput.checked = showWindowTitle;
    showLineNumbersInput.checked = showLineNumbers;
    realLineNumbersInput.checked = realLineNumbers;
    showWindowControlsInput.checked = showWindowControls;
    roundedCornersInput.checked = roundedCorners;
    transparentBackgroundInput.checked = transparentBackground;
    enableResizingInput.checked = enableResizing;

    shutterActionSelect.value = shutterAction;
    targetSelect.value = target;
    roundingLevelSelect.value = roundingLevel + "";
    saveFormatSelect.value = saveFormat;
    windowStyleSelect.value = windowStyle;
}
