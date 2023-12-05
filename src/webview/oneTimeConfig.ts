import { pasteCode as updateView } from "./code.js"
import { ExtensionConfig, alreadyHasSessionConfig, getSessionConfig, setSessionConfig } from "./configManager.js"
import { updateConfig } from "./index.js"
import { vscode } from "./util.js"

import {
    enableResizingInput,
    realLineNumbersInput,
    roundedCornersInput,
    roundingLevelSelect,
    showLineNumbersInput,
    showWindowControlsInput,
    showWindowTitleInput,
    shutterActionSelect,
    targetSelect,
    transparentBackgroundInput,
    updateButton
} from "./elements.js"

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