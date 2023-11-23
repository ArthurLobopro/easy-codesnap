import { pasteCode as updateView } from "./code.js"
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

/** @type {HTMLInputElement} */
const enableResizingInput = $("input[data-configName='enableResizing']")

/** @type {HTMLSelectElement} */
const shutterActionSelect = $("select[data-configName='shutterAction']")

/** @type {HTMLSelectElement} */
const targetSelect = $("select[data-configName='target']")

/** @type {HTMLLIElement} */
const updateButton = $("[data-action='update']")

shutterActionSelect.style.width = `${targetSelect.getBoundingClientRect().width}px`

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
        showWindowTitle,
        shutterAction,
        target,
        enableResizing
    } = getSessionConfig()

    showWindowTitleInput.checked = showWindowTitle
    showLineNumbersInput.checked = showLineNumbers
    realLineNumbersInput.checked = realLineNumbers
    showWindowControlsInput.checked = showWindowControls
    roundedCornersInput.checked = roundedCorners
    transparentBackgroundInput.checked = transparentBackground
    enableResizingInput.checked = enableResizing

    shutterActionSelect.value = shutterAction
    targetSelect.value = target
}

/** @param {HTMLInputElement} input  */
function handleViewBasedChange(input) {
    return () => {
        const { configname } = input.dataset

        setSessionConfig({
            [configname]: input.checked
        })
        updateView()
    }
}

/** @param {HTMLInputElement} input  */
function handleConfigBasedChange(input) {
    return () => {
        const { configname } = input.dataset

        setSessionConfig({
            [configname]: input.checked
        })
        updateConfig()
    }
}

export function addListeners() {
    showLineNumbersInput.addEventListener("change", handleViewBasedChange(showLineNumbersInput))
    realLineNumbersInput.addEventListener("change", handleViewBasedChange(realLineNumbersInput))

    showWindowTitleInput.addEventListener("change", handleConfigBasedChange(showWindowTitleInput))
    showWindowControlsInput.addEventListener("change", handleConfigBasedChange(showWindowControlsInput))
    roundedCornersInput.addEventListener("change", handleConfigBasedChange(roundedCornersInput))
    transparentBackgroundInput.addEventListener("change", handleConfigBasedChange(transparentBackgroundInput))
    enableResizingInput.addEventListener("change", handleConfigBasedChange(enableResizingInput))

    shutterActionSelect.addEventListener("change", () => {
        setSessionConfig({
            shutterAction: shutterActionSelect.value
        })
    })

    targetSelect.addEventListener("change", () => {
        setSessionConfig({
            target: targetSelect.value
        })
    })

    updateButton.addEventListener("click", () => {
        vscode.postMessage({ type: "update-config" })
    })
}