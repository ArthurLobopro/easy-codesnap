import { pick, pickAllExcept } from "@arthur-lobo/object-pick"
import { ConfigSentToWebview } from "../types"
import { pasteCode } from "./code"
import { alreadyHasSessionConfig, getSessionConfig, setSessionConfig } from "./configManager"
import { contentManager } from "./contentManager"
import { btnSave } from "./elements"
import { cameraFlashAnimation, takeSnap } from "./snap"
import { addListeners } from "./ui/listeners"
import { UIUpdater } from "./ui/updaters"
import { vscode } from "./util"

btnSave.addEventListener("click", () => takeSnap())

document.addEventListener("copy", () => takeSnap({ ...getSessionConfig(), shutterAction: "copy" }))

document.addEventListener("paste", (e) => {
    const { isLocked } = getSessionConfig()

    if (!isLocked) {
        contentManager.update(e.clipboardData as DataTransfer)
        pasteCode()
    }
})

const actions = {
    flash: cameraFlashAnimation,

    update(config: ConfigSentToWebview) {
        if (alreadyHasSessionConfig() && getSessionConfig().isLocked) {
            return
        }

        setSessionConfig(pickAllExcept(config, ["linkOnOpen", "lockOnOpen"]))
        document.execCommand("paste")

        setSessionConfig({
            isLinked: config.linkOnOpen,
            isLocked: config.lockOnOpen
        })

        UIUpdater()
    },

    "update-text"(config: ConfigSentToWebview) {
        if (!alreadyHasSessionConfig()) {
            setSessionConfig(config)
        } else {
            const { isLocked, isLinked, editorID } = getSessionConfig()

            if (isLocked || isLinked && editorID !== config.editorID) {
                return
            }

            setSessionConfig(pick(config, ["windowTitle", "startLine", "editorID"]))
        }
        UIUpdater()
        document.execCommand("paste")
    },

    "update-config"(config: ConfigSentToWebview) {
        setSessionConfig(
            pickAllExcept(
                config,
                [
                    "startLine",
                    "windowTitle",
                    "editorID",
                    "linkOnOpen",
                    "lockOnOpen"
                ]
            )
        )
        UIUpdater()
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