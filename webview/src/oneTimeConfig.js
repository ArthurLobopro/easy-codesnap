import { pasteCode as updateView } from "./code.js"
import { updateConfig } from "./index.js"
import { $, alreadyHasSessionConfig, getSessionConfig, setSessionConfig, vscode } from "./util.js"

/** @type {HTMLInputElement} */
const showWindowTitleInput = $("input[data-configname='showWindowTitle']")

/** @type {HTMLInputElement} */
const showLineNumbersInput = $("input[data-configname='showLineNumbers']")

/** @type {HTMLInputElement} */
const realLineNumbersInput = $("input[data-configname='realLineNumbers']")

/** @type {HTMLInputElement} */
const showWindowControlsInput = $("input[data-configname='showWindowControls']")

/** @type {HTMLInputElement} */
const roundedCornersInput = $("input[data-configname='roundedCorners']")

/** @type {HTMLInputElement} */
const transparentBackgroundInput = $("input[data-configname='transparentBackground']")

/** @type {HTMLInputElement} */
const enableResizingInput = $("input[data-configname='enableResizing']")

/** @type {HTMLSelectElement} */
const shutterActionSelect = $("select[data-configname='shutterAction']")

/** @type {HTMLSelectElement} */
const targetSelect = $("select[data-configname='target']")

/** @type {HTMLSelectElement} */
const roundingLevelSelect = $("select[data-configname='roundingLevel']")

/** @type {HTMLLIElement} */
const updateButton = $("[data-action='update']")

const biggerSelectWidth = `${targetSelect.getBoundingClientRect().width}px`

shutterActionSelect.style.width = biggerSelectWidth
roundingLevelSelect.style.width = biggerSelectWidth

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
        enableResizing,
        roundingLevel
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
    roundingLevelSelect.value = roundingLevel
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

    roundingLevelSelect.addEventListener("change", () => {
        setSessionConfig({
            roundingLevel: Number(roundingLevelSelect.value)
        })
        updateConfig()
    })

    updateButton.addEventListener("click", () => {
        vscode.postMessage({ type: "update-config" })
    })
}