import { pasteCode } from "./code.js"
import { updateConfig } from "./index.js"
import { $, alreadyHasSessionConfig, getSessionConfig, setSessionConfig } from "./util.js"

/** @type {HTMLInputElement} */
const showLineNumbersInput = $("input[data-configName='showLineNumbers']")

/** @type {HTMLInputElement} */
const realLineNumbersInput = $("input[data-configName='realLineNumbers']")

/** @type {HTMLInputElement} */
const showWindowControlsInput = $("input[data-configName='showWindowControls']")

/** @type {HTMLInputElement} */
const roundedCornersInput = $("input[data-configName='roundedCorners']")

export function updateUIConfig() {
    if (!alreadyHasSessionConfig()) {
        return
    }

    const {
        showLineNumbers,
        realLineNumbers,
        showWindowControls,
        roundedCorners
    } = getSessionConfig()

    showLineNumbersInput.checked = showLineNumbers
    realLineNumbersInput.checked = realLineNumbers
    showWindowControlsInput.checked = showWindowControls
    roundedCornersInput.checked = roundedCorners
}

export function addListeners() {
    showLineNumbersInput.addEventListener("change", () => {
        setSessionConfig({
            showLineNumbers: showLineNumbersInput.checked
        })
        updateView()
    })

    realLineNumbersInput.addEventListener("change", () => {
        setSessionConfig({
            realLineNumbers: realLineNumbersInput.checked
        })
        updateView()
    })

    showWindowControlsInput.addEventListener("change", () => {
        setSessionConfig({
            showWindowControls: showWindowControlsInput.checked
        })
        updateConfig(getSessionConfig())
    })

    roundedCornersInput.addEventListener("change", () => {
        setSessionConfig({
            roundedCorners: roundedCornersInput.checked
        })
        updateConfig(getSessionConfig())
    })
}

const updateView = () => pasteCode(getSessionConfig())