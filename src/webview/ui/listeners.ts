import { WebviewConfig, getConfigKeys, getSessionConfig, setSessionConfig } from "../configManager"
import { vscode } from "../util"
import { LineNumbersUpdater, LinkButtonUpdater, LockButtonUpdater, UIUpdater, VarUpdater, VisibilityUpdater } from "./updaters"

import {
    enableResizingInput,
    openSettingsButton,
    realLineNumbersInput,
    resetConfigButton,
    roundedCornersInput,
    roundingLevelSelect,
    saveConfigButton,
    saveFormatSelect,
    showLineNumbersInput,
    showWindowControlsInput,
    showWindowTitleInput,
    shutterActionSelect,
    targetSelect,
    toggleLinkedButton,
    toggleLockedButton,
    transparentBackgroundInput,
    windowStyleSelect
} from "../elements"

const biggerSelectWidth = `${windowStyleSelect.getBoundingClientRect().width}px`

targetSelect.style.width = biggerSelectWidth
shutterActionSelect.style.width = biggerSelectWidth
roundingLevelSelect.style.width = biggerSelectWidth
saveFormatSelect.style.width = biggerSelectWidth

type BooleanProperties<T> = Pick<T, {
    [K in keyof T]: T[K] extends boolean ? K : never
}[keyof T]>

type NotBooleanProperties<T> = Pick<T, {
    [K in keyof T]: T[K] extends boolean ? never : K
}[keyof T]>

type togglableOptions = BooleanProperties<WebviewConfig>

function handleToggleBasedChange(element: HTMLElement, updater: () => void) {
    return () => {
        const { configname } = element.dataset as { configname: keyof togglableOptions }

        if (!getConfigKeys().includes(configname)) {
            console.error(`Error: Invalid config name "${configname}"`)
            return
        }

        setSessionConfig({
            [configname]: !getSessionConfig()[configname]
        })

        updater()
    }
}

type selectOptions = NotBooleanProperties<WebviewConfig>

function handleSelectBasedChange(select: HTMLSelectElement, configName: keyof selectOptions, updater?: () => void) {
    return () => {
        setSessionConfig({
            [configName]: select.value
        })

        updater && updater()
    }
}

export function addListeners() {
    //Toggles
    showLineNumbersInput.addEventListener("change", handleToggleBasedChange(showLineNumbersInput, VarUpdater))
    realLineNumbersInput.addEventListener("change", handleToggleBasedChange(realLineNumbersInput, LineNumbersUpdater))

    showWindowTitleInput.addEventListener("change", handleToggleBasedChange(showWindowTitleInput, VisibilityUpdater))
    showWindowControlsInput.addEventListener("change", handleToggleBasedChange(showWindowControlsInput, VisibilityUpdater))

    roundedCornersInput.addEventListener("change", handleToggleBasedChange(roundedCornersInput, VarUpdater))
    enableResizingInput.addEventListener("change", handleToggleBasedChange(enableResizingInput, VarUpdater))
    transparentBackgroundInput.addEventListener("change", handleToggleBasedChange(transparentBackgroundInput, () => { }))

    toggleLockedButton.addEventListener("click", handleToggleBasedChange(toggleLockedButton, LockButtonUpdater))
    toggleLinkedButton.addEventListener("click", handleToggleBasedChange(toggleLinkedButton, LinkButtonUpdater))

    //Selects
    shutterActionSelect.addEventListener("change", handleSelectBasedChange(shutterActionSelect, "shutterAction"))
    targetSelect.addEventListener("change", handleSelectBasedChange(targetSelect, "target"))
    saveFormatSelect.addEventListener("change", handleSelectBasedChange(saveFormatSelect, "saveFormat"))

    roundingLevelSelect.addEventListener("change", handleSelectBasedChange(roundingLevelSelect, "roundingLevel", VarUpdater))
    windowStyleSelect.addEventListener("change", handleSelectBasedChange(windowStyleSelect, "windowStyle", UIUpdater))

    //Message Buttons
    resetConfigButton.addEventListener("click", () => {
        vscode.postMessage({ type: "update-config" })
    })

    saveConfigButton.addEventListener("click", () => {
        vscode.postMessage({ type: "save-config", config: getSessionConfig() })
    })

    openSettingsButton.addEventListener("click", () => {
        vscode.postMessage({ type: "open-settings" })
    })
}