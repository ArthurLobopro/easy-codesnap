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

function handleToggleEvent(element: HTMLElement, configName: keyof togglableOptions, event: "change" | "click", updater?: () => void) {
    element.addEventListener(event, () => {
        setSessionConfig({
            [configName]: !getSessionConfig()[configName]
        })

        updater && updater()
    })
}

function handleToggleBasedClick(element: HTMLElement, configName: keyof togglableOptions, updater?: () => void) {
    handleToggleEvent(element, configName, "click", updater)
}

function handleToggleBasedChange(element: HTMLElement, updater: () => void) {
    return () => {
        console.log("Change!")

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
    select.addEventListener("change", () => {
        setSessionConfig({
            [configName]: select.value
        })

        updater && updater()
    })
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

    handleToggleBasedClick(toggleLinkedButton, "isLinked", LinkButtonUpdater)
    handleToggleBasedClick(toggleLockedButton, "isLocked", LockButtonUpdater)

    //Selects
    handleSelectBasedChange(shutterActionSelect, "shutterAction")
    handleSelectBasedChange(targetSelect, "target")
    handleSelectBasedChange(saveFormatSelect, "saveFormat")

    handleSelectBasedChange(roundingLevelSelect, "roundingLevel", VarUpdater)
    handleSelectBasedChange(windowStyleSelect, "windowStyle", UIUpdater)

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