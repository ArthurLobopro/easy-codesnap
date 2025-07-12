import { SessionConfig } from "../../SessionConfig";
import {
    enableResizingInput,
    enableSymbolBreadcrumbInput,
    highlightLineNumberInput,
    maxCharWidthInput,
    realLineNumbersInput,
    roundedCornersInput,
    roundingLevelSelect,
    showLineNumbersInput,
    showWindowControlsInput,
    showWindowTitleInput,
    targetSelect,
    transparentBackgroundInput,
    watermarkInput,
    windowIconTypeSelect,
    windowStyleSelect,
} from "../elements";
import { Updater } from "../Updater";

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
            "enableSymbolBreadcrumb",
            "roundingLevel",
            "saveFormat",
            "windowStyle",
            "saveScale",
            "highlightLineNumber",
            "watermark",
            "windowIconType",
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
            enableSymbolBreadcrumb,
            roundingLevel,
            saveFormat,
            windowStyle,
            saveScale,
            highlightLineNumber,
            watermark,
            maxCharWidth,
            windowIconType,
        } = SessionConfig.get();

        showWindowTitleInput.checked = showWindowTitle;
        showLineNumbersInput.checked = showLineNumbers;
        realLineNumbersInput.checked = realLineNumbers;
        showWindowControlsInput.checked = showWindowControls;
        roundedCornersInput.checked = roundedCorners;
        transparentBackgroundInput.checked = transparentBackground;
        enableResizingInput.checked = enableResizing;
        enableSymbolBreadcrumbInput.checked = enableSymbolBreadcrumb;
        highlightLineNumberInput.checked = highlightLineNumber;
        watermarkInput.checked = watermark;

        realLineNumbersInput.disabled = !showLineNumbers;
        highlightLineNumberInput.disabled = !showLineNumbers;
        roundingLevelSelect.disabled = !roundedCorners;
        transparentBackgroundInput.disabled = target !== "container";

        targetSelect.value = target;
        roundingLevelSelect.value = roundingLevel.toString();
        windowStyleSelect.value = windowStyle;

        windowIconTypeSelect.value = windowIconType;
        windowIconTypeSelect.disabled = windowStyle !== "windows";

        maxCharWidthInput.value = String(maxCharWidth);
    }
}
