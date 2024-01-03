import { pasteCode } from "./code"
import { alreadyHasSessionConfig, getSessionConfig, setSessionConfig } from "./configManager"
import { contentManager } from "./contentManager"
import { btnSave } from "./elements"
import { cameraFlashAnimation, takeSnap } from "./snap"
import { addListeners } from "./ui/listeners"
import { OneTimeConfigUpdater, UIUpdater } from "./ui/updaters"
import { untypedObject, vscode } from "./util"

btnSave.addEventListener("click", () => takeSnap())

document.addEventListener("copy", () => takeSnap({ ...getSessionConfig(), shutterAction: "copy" }))

document.addEventListener("paste", (e) => {
    if (!getSessionConfig().isLocked) {
        contentManager.update(e.clipboardData as DataTransfer)
        pasteCode()
    }
})

const actions = {
    flash: cameraFlashAnimation,

    update(config: untypedObject) {
        if (alreadyHasSessionConfig() && getSessionConfig().isLocked) {
            return
        }
        setSessionConfig(config)
        UIUpdater()
        document.execCommand("paste")
    },

    "update-text"(config: untypedObject) {
        if (!alreadyHasSessionConfig()) {
            setSessionConfig(config)
        } else {
            const { isLocked, isLinked, editorID } = getSessionConfig()

            if (isLocked || isLinked && editorID !== config.editorID) {
                return
            }

            const { startLine, windowTitle, editorID: newEditorID } = config
            setSessionConfig({ startLine, windowTitle, editorID: newEditorID })
        }
        UIUpdater()
        document.execCommand("paste")
    },

    "update-config"(config: untypedObject) {
        delete config.startLine
        delete config.windowTitle

        setSessionConfig(config)
        UIUpdater()
        OneTimeConfigUpdater()
        pasteCode()
    }
}

window.addEventListener("message", ({ data: { type, ...config } }) => {
    if (type in actions) {
        actions[type as keyof typeof actions](config)
    } else {
        console.log(`Unknow action on renderer: ${actions}`)

    }
})

window.addEventListener("DOMContentLoaded", () => {
    vscode.postMessage({ type: "ready" })
}, { once: true })

addListeners()