import { LineNumbersUpdater } from "./code"
import { WebviewConfig, getConfigKeys, getSessionConfig, setSessionConfig } from "./configManager"
import { LinkUpdater, LockButtonUpdater, UIUpdater } from "./ui/updaters"
import { vscode } from "./util"

import {
    enableResizingInput,
    realLineNumbersInput,
    resetConfigButton,
    roundedCornersInput,
    roundingLevelSelect,
    saveConfigButton,
    showLineNumbersInput,
    showWindowControlsInput,
    showWindowTitleInput,
    shutterActionSelect,
    targetSelect,
    toggleLinkedButton,
    toggleLockedButton,
    transparentBackgroundInput
} from "./elements"

import { VarUpdater, VisibilityUpdater } from "./ui/updaters"

const biggerSelectWidth = `${targetSelect.getBoundingClientRect().width}px`

shutterActionSelect.style.width = biggerSelectWidth
roundingLevelSelect.style.width = biggerSelectWidth

type BooleanProperties<T> = Pick<T, {
    [K in keyof T]: T[K] extends boolean ? K : never
}[keyof T]>

type togglableOptions = BooleanProperties<WebviewConfig>

function handleToggleBasedChange(element: HTMLInputElement, updater = UIUpdater) {
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

export function addListeners() {
    showLineNumbersInput.addEventListener("change", handleToggleBasedChange(showLineNumbersInput, VarUpdater))
    realLineNumbersInput.addEventListener("change", handleToggleBasedChange(realLineNumbersInput, LineNumbersUpdater))

    showWindowTitleInput.addEventListener("change", handleToggleBasedChange(showWindowTitleInput, VisibilityUpdater))
    showWindowControlsInput.addEventListener("change", handleToggleBasedChange(showWindowControlsInput, VisibilityUpdater))

    roundedCornersInput.addEventListener("change", handleToggleBasedChange(roundedCornersInput, VarUpdater))
    enableResizingInput.addEventListener("change", handleToggleBasedChange(enableResizingInput, VarUpdater))
    transparentBackgroundInput.addEventListener("change", handleToggleBasedChange(transparentBackgroundInput, () => { }))

    shutterActionSelect.addEventListener("change", () => {
        setSessionConfig({
            shutterAction: shutterActionSelect.value as WebviewConfig["shutterAction"]
        })
    })

    targetSelect.addEventListener("change", () => {
        setSessionConfig({
            target: targetSelect.value as WebviewConfig["target"]
        })
    })

    roundingLevelSelect.addEventListener("change", () => {
        setSessionConfig({
            roundingLevel: Number(roundingLevelSelect.value) as WebviewConfig["roundingLevel"]
        })
        VarUpdater()
    })

    resetConfigButton.addEventListener("click", () => {
        vscode.postMessage({ type: "update-config" })
    })

    saveConfigButton.addEventListener("click", () => {
        vscode.postMessage({ type: "save-config", config: getSessionConfig() })
    })

    toggleLockedButton.addEventListener("click", () => {
        setSessionConfig({ isLocked: !getSessionConfig().isLocked })
        LockButtonUpdater()
    })

    toggleLinkedButton.addEventListener("click", () => {
        setSessionConfig({ isLinked: !getSessionConfig().isLinked })
        LinkUpdater()
    })
}