import { pasteCode, updateLineNumbers } from "./code"
import { alreadyHasSessionConfig, getSessionConfig, setSessionConfig } from "./configManager"
import { contentManager } from "./contentManager"
import { btnSave, navbarNode, windowControlsNode, windowTitleNode } from "./elements"
import { addListeners, updateUIConfig } from "./oneTimeConfig"
import { cameraFlashAnimation, takeSnap } from "./snap"
import { setVar, untypedObject, vscode } from "./util"

export function updateConfig() {
    const {
        fontLigatures,
        tabSize,
        backgroundColor,
        boxShadow,
        containerPadding,
        roundedCorners,
        showWindowControls,
        showWindowTitle,
        windowTitle,
        enableResizing,
        roundingLevel,
        showLineNumbers
    } = getSessionConfig()

    setVar("ligatures", fontLigatures ? "normal" : "none")
    if (typeof fontLigatures === "string") {
        setVar("font-features", fontLigatures)
    }

    setVar("tab-size", tabSize + "")
    setVar("container-background-color", backgroundColor)
    setVar("box-shadow", boxShadow)
    setVar("container-padding", containerPadding)
    setVar("window-border-radius", roundedCorners ? `${4 * roundingLevel}px` : 0 + "")
    setVar("enable-resizing", enableResizing ? "horizontal" : "none")
    setVar("line-number-visibility", showLineNumbers ? "block" : "none")

    navbarNode.hidden = !showWindowControls && !showWindowTitle
    windowControlsNode.hidden = !showWindowControls
    windowTitleNode.hidden = !showWindowTitle
    windowTitleNode.textContent = windowTitle

    updateLineNumbers()
}

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
        updateConfig()
        updateUIConfig()
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
        updateConfig()
        document.execCommand("paste")
    },

    "update-config"(config: untypedObject) {
        delete config.startLine
        delete config.windowTitle

        setSessionConfig(config)
        updateConfig()
        updateUIConfig()
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