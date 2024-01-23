import { getSessionConfig } from "../../configManager"
import { $$, calcTextWidth, setVar } from "../../util"


export function LineNumbersUpdater() {
    const { realLineNumbers } = getSessionConfig()

    const lineNumbers = $$(".line-number")

    lineNumbers.forEach(line => {
        line.textContent = (
            realLineNumbers ? line.dataset.reallinenumber : line.dataset.linenumber
        ) as string
    })

    lineNumbers.length && setVar("line-number-width", calcTextWidth(String(lineNumbers.at(-1)?.textContent)))
}
