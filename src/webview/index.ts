import { pasteCode } from "./code"
import { alreadyHasSessionConfig, getSessionConfig, setSessionConfig } from "./configManager"
import { contentManager } from "./contentManager"
import { btnSave, navbarNode, windowControlsNode, windowTitleNode } from "./elements"
import { addListeners, updateUIConfig } from "./oneTimeConfig"
import { cameraFlashAnimation, takeSnap } from "./snap"
import { setVar, vscode } from "./util"

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
        roundingLevel
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

    navbarNode.hidden = !showWindowControls && !showWindowTitle
    windowControlsNode.hidden = !showWindowControls
    windowTitleNode.hidden = !showWindowTitle

    windowTitleNode.textContent = windowTitle
}

btnSave.addEventListener("click", () => takeSnap())

document.addEventListener("copy", () => takeSnap({ ...getSessionConfig(), shutterAction: "copy" }))

document.addEventListener("paste", (e) => {
    if (!getSessionConfig().isLocked) {
        contentManager.update(e.clipboardData as DataTransfer)
        pasteCode()
    }
})

window.addEventListener("message", ({ data: { type, ...config } }) => {
    switch (type) {
        case "update":
            if (alreadyHasSessionConfig() && getSessionConfig().isLocked) {
                return
            }
            setSessionConfig(config)
            updateConfig()
            updateUIConfig()
            document.execCommand("paste")
            break

        case "update-text":

            if (!alreadyHasSessionConfig()) {
                setSessionConfig(config)
            } else {
                if (getSessionConfig().isLocked) {
                    return
                }

                const { startLine, windowTitle } = config
                setSessionConfig({ startLine, windowTitle })
            }
            updateConfig()
            document.execCommand("paste")
            break

        case "update-config":
            delete config.startLine
            delete config.windowTitle

            setSessionConfig(config)
            updateConfig()
            updateUIConfig()
            pasteCode()
            break

        case "flash":
            cameraFlashAnimation()
            break

        default:
            break
    }
})

window.addEventListener("DOMContentLoaded", () => {
    vscode.postMessage({ type: "ready" })
}, { once: true })

addListeners()