import { pasteCode } from "./code.js"
import { $, alreadyHasSessionConfig, getSessionConfig, setSessionConfig } from "./util.js"

/** @type {HTMLInputElement} */
const showLineNumbersInput = $("input[data-configName='showLineNumbers']")

/** @type {HTMLInputElement} */
const realLineNumbersInput = $("input[data-configName='realLineNumbers']")

export function updateUIConfig() {
    if (!alreadyHasSessionConfig()) {
        return
    }

    const { showLineNumbers, realLineNumbers } = getSessionConfig()

    showLineNumbersInput.checked = showLineNumbers
    realLineNumbersInput.checked = realLineNumbers
}

export function addListeners() {
    showLineNumbersInput.addEventListener("change", () => {
        setSessionConfig({
            showLineNumbers: showLineNumbersInput.checked
        })
        pasteCode(getSessionConfig())
    })

    realLineNumbersInput.addEventListener("change", () => {
        setSessionConfig({
            realLineNumbers: realLineNumbersInput.checked
        })
        pasteCode(getSessionConfig())
    })
}