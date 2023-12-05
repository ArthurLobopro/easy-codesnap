import { pasteCode as updateView } from "./code.js"
import { ExtensionConfig, alreadyHasSessionConfig, getSessionConfig, setSessionConfig } from "./configManager.js"
import { updateConfig } from "./index.js"
import { $, vscode } from "./util.js"

const showWindowTitleInput = $<HTMLInputElement>("input[data-configname='showWindowTitle']")

const showLineNumbersInput = $<HTMLInputElement>("input[data-configname='showLineNumbers']")

const realLineNumbersInput = $<HTMLInputElement>("input[data-configname='realLineNumbers']")

const showWindowControlsInput = $<HTMLInputElement>("input[data-configname='showWindowControls']")

const roundedCornersInput = $<HTMLInputElement>("input[data-configname='roundedCorners']")

const transparentBackgroundInput = $<HTMLInputElement>("input[data-configname='transparentBackground']")

const enableResizingInput = $<HTMLInputElement>("input[data-configname='enableResizing']")

const shutterActionSelect = $<HTMLSelectElement>("select[data-configname='shutterAction']")

const targetSelect = $<HTMLSelectElement>("select[data-configname='target']")

const roundingLevelSelect = $<HTMLSelectElement>("select[data-configname='roundingLevel']")

const updateButton = $<HTMLLIElement>("[data-action='update']")

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
    roundingLevelSelect.value = roundingLevel + ""
}

function handleViewBasedChange(input: HTMLInputElement) {
    return () => {
        const { configname } = input.dataset

        setSessionConfig({
            [configname as string]: input.checked
        })
        updateView()
    }
}

function handleConfigBasedChange(input: HTMLInputElement) {
    return () => {
        const { configname } = input.dataset

        setSessionConfig({
            [configname as string]: input.checked
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
            shutterAction: shutterActionSelect.value as ExtensionConfig["shutterAction"]
        })
    })

    targetSelect.addEventListener("change", () => {
        setSessionConfig({
            target: targetSelect.value as ExtensionConfig["target"]
        })
    })

    roundingLevelSelect.addEventListener("change", () => {
        setSessionConfig({
            roundingLevel: Number(roundingLevelSelect.value) as ExtensionConfig["roundingLevel"]
        })
        updateConfig()
    })

    updateButton.addEventListener("click", () => {
        vscode.postMessage({ type: "update-config" })
    })
}