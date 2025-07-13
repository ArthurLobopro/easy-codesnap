import { SessionConfig } from "../../SessionConfig";
import {
    highlightLineNumberInput,
    realLineNumbersInput,
    roundedCornersInput,
    roundingLevelSelect,
    showLineNumbersInput,
    showWindowControlsInput,
    showWindowTitleInput,
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
            "showWindowTitle",
            "roundingLevel",
            "windowStyle",
            "highlightLineNumber",
            "windowIconType",
        ]);
    }

    update() {
        const {
            showLineNumbers,
            realLineNumbers,
            showWindowControls,
            roundedCorners,
            showWindowTitle,
            roundingLevel,
            windowStyle,
            highlightLineNumber,
            windowIconType,
        } = SessionConfig.get();

        showWindowTitleInput.checked = showWindowTitle;
        showLineNumbersInput.checked = showLineNumbers;
        realLineNumbersInput.checked = realLineNumbers;
        showWindowControlsInput.checked = showWindowControls;
        roundedCornersInput.checked = roundedCorners;

        highlightLineNumberInput.checked = highlightLineNumber;

        realLineNumbersInput.disabled = !showLineNumbers;
        highlightLineNumberInput.disabled = !showLineNumbers;
        roundingLevelSelect.disabled = !roundedCorners;

        roundingLevelSelect.value = roundingLevel.toString();
        windowStyleSelect.value = windowStyle;

        windowIconTypeSelect.value = windowIconType;
        windowIconTypeSelect.disabled = windowStyle !== "windows";
    }
}
