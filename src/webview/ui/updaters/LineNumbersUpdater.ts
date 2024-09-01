import { SessionConfig } from "../../SessionConfig";
import { $$, calcTextWidth, setVar } from "../../util";
import { Updater } from "../Updater";

export class LineNumbersUpdater extends Updater {
    constructor() {
        super(["realLineNumbers"]);
    }

    update() {
        const realLineNumbers = SessionConfig.get("realLineNumbers");

        const lineNumbers = $$(".line-number");

        lineNumbers.forEach((line) => {
            line.textContent = (
                realLineNumbers
                    ? line.dataset.reallinenumber
                    : line.dataset.linenumber
            ) as string;
        });

        lineNumbers.length &&
            setVar(
                "line-number-width",
                calcTextWidth(String(lineNumbers.at(-1)?.textContent)),
            );
    }
}
