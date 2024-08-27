import { SessionConfig } from "../../SessionConfig";
import {
    enableResizingInput,
    highlightLineNumberInput,
    realLineNumbersInput,
    roundedCornersInput,
    roundingLevelSelect,
    saveFormatSelect,
    saveScaleSelect,
    showLineNumbersInput,
    showWindowControlsInput,
    showWindowTitleInput,
    shutterActionSelect,
    targetSelect,
    transparentBackgroundInput,
    watermarkInput,
    windowStyleSelect,
} from "../elements";

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
        saveScale,
        highlightLineNumber,
        watermark,
    } = SessionConfig.get();

    showWindowTitleInput.checked = showWindowTitle;
    showLineNumbersInput.checked = showLineNumbers;
    realLineNumbersInput.checked = realLineNumbers;
    showWindowControlsInput.checked = showWindowControls;
    roundedCornersInput.checked = roundedCorners;
    transparentBackgroundInput.checked = transparentBackground;
    enableResizingInput.checked = enableResizing;
    highlightLineNumberInput.checked = highlightLineNumber;
    watermarkInput.checked = watermark;

    shutterActionSelect.value = shutterAction;
    targetSelect.value = target;
    roundingLevelSelect.value = roundingLevel.toString();
    saveFormatSelect.value = saveFormat;
    windowStyleSelect.value = windowStyle;
    saveScaleSelect.value = saveScale.toString();
}
