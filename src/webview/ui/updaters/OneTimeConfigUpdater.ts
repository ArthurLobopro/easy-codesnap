import { SessionConfig } from "../../SessionConfig";
import { Updater } from "../Updater";
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

export class OneTimeConfigUpdater extends Updater {
    constructor() {
        super([
            "showLineNumbers",
            "realLineNumbers",
            "showWindowControls",
            "roundedCorners",
            "transparentBackground",
            "showWindowTitle",
            "shutterAction",
            "target",
            "enableResizing",
            "roundingLevel",
            "saveFormat",
            "windowStyle",
            "saveScale",
            "highlightLineNumber",
            "watermark",
        ]);
    }

    update() {
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

        realLineNumbersInput.disabled = !showLineNumbers;
        highlightLineNumberInput.disabled = !showLineNumbers;
        roundingLevelSelect.disabled = !roundedCorners;
        transparentBackgroundInput.disabled = target !== "container";

        shutterActionSelect.value = shutterAction;
        targetSelect.value = target;
        roundingLevelSelect.value = roundingLevel.toString();
        saveFormatSelect.value = saveFormat;
        windowStyleSelect.value = windowStyle;
        saveScaleSelect.value = saveScale.toString();
    }
}
