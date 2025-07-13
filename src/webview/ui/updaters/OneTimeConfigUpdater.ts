import { SessionConfig } from "../../SessionConfig";
import {
    highlightLineNumberInput,
    realLineNumbersInput,
    showLineNumbersInput,
} from "../elements";
import { Updater } from "../Updater";

export class OneTimeConfigUpdater extends Updater {
    constructor() {
        super(["showLineNumbers", "realLineNumbers", "highlightLineNumber"]);
    }

    update() {
        const { showLineNumbers, realLineNumbers, highlightLineNumber } =
            SessionConfig.get();

        showLineNumbersInput.checked = showLineNumbers;
        realLineNumbersInput.checked = realLineNumbers;

        highlightLineNumberInput.checked = highlightLineNumber;

        realLineNumbersInput.disabled = !showLineNumbers;
        highlightLineNumberInput.disabled = !showLineNumbers;
    }
}
