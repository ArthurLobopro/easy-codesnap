import {
    highlightLineNumberInput,
    realLineNumbersInput,
    showLineNumbersInput,
} from "../elements";
import { handleToggleBasedChange } from "./handlers";

export function addToogleListeners() {
    handleToggleBasedChange(showLineNumbersInput, "showLineNumbers");
    handleToggleBasedChange(realLineNumbersInput, "realLineNumbers");

    handleToggleBasedChange(highlightLineNumberInput, "highlightLineNumber");
}
