import { pasteCode } from "./code.js"
import { updateConfig } from "./index.js"
import { $, alreadyHasSessionConfig, getSessionConfig, setSessionConfig, vscode } from "./util.js"

/** @type {HTMLInputElement} */
const showWindowTitleInput = $("input[data-configName='showWindowTitle']")

/** @type {HTMLInputElement} */
const showLineNumbersInput = $("input[data-configName='showLineNumbers']")

/** @type {HTMLInputElement} */
const realLineNumbersInput = $("input[data-configName='realLineNumbers']")

/** @type {HTMLInputElement} */
const showWindowControlsInput = $("input[data-configName='showWindowControls']")

/** @type {HTMLInputElement} */
const roundedCornersInput = $("input[data-configName='roundedCorners']")

/** @type {HTMLInputElement} */
const transparentBackgroundInput = $("input[data-configName='transparentBackground']")

/** @type {HTMLLIElement} */
const updateButton = $("[data-action='update']")

export function updateUIConfig(force = false) {
    if (!alreadyHasSessionConfig() && !force) {
        return
    }

    const {
        showLineNumbers,
        realLineNumbers,
        showWindowControls,
        roundedCorners,
        transparentBackground,
        showWindowTitle
    } = getSessionConfig()

    showWindowTitleInput.checked = showWindowTitle
    showLineNumbersInput.checked = showLineNumbers
    realLineNumbersInput.checked = realLineNumbers
    showWindowControlsInput.checked = showWindowControls
    roundedCornersInput.checked = roundedCorners
    transparentBackgroundInput.checked = transparentBackground
}

export function addListeners() {
    showWindowTitleInput.addEventListener("change", () => {
        setSessionConfig({
            showWindowTitle: showWindowTitleInput.checked
        })
        updateConfig(getSessionConfig())
    })

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

    transparentBackgroundInput.addEventListener("change", () => {
        setSessionConfig({
            transparentBackground: transparentBackgroundInput.checked
        })
        updateConfig(getSessionConfig())
    })

    updateButton.addEventListener("click", () => {
        vscode.postMessage({ type: "update-config" })
    })
}

const updateView = () => pasteCode()