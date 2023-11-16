import { pasteCode } from "./code.js"
import { contentManager } from "./contentManager.js"
import { addListeners, updateUIConfig } from "./oneTimeConfig.js"
import { cameraFlashAnimation, takeSnap } from "./snap.js"
import { $, alreadyHasSessionConfig, getSessionConfig, setSessionConfig, setVar, vscode } from "./util.js"

const navbarNode = $("#navbar")
const windowControlsNode = $("#window-controls")
const windowTitleNode = $("#window-title")
const btnSave = $("#save")

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
        windowTitle
    } = getSessionConfig()

    setVar("ligatures", fontLigatures ? "normal" : "none")
    if (typeof fontLigatures === "string") { setVar("font-features", fontLigatures) }
    setVar("tab-size", tabSize)
    setVar("container-background-color", backgroundColor)
    setVar("box-shadow", boxShadow)
    setVar("container-padding", containerPadding)
    setVar("window-border-radius", roundedCorners ? "4px" : 0)

    navbarNode.hidden = !showWindowControls && !showWindowTitle
    windowControlsNode.hidden = !showWindowControls
    windowTitleNode.hidden = !showWindowTitle

    windowTitleNode.textContent = windowTitle
}

btnSave.addEventListener("click", () => takeSnap(getSessionConfig()))

document.addEventListener("copy", () => takeSnap({ ...getSessionConfig(), shutterAction: "copy" }))

document.addEventListener("paste", (e) => {
    contentManager.update(e.clipboardData)
    pasteCode(getSessionConfig())
})

window.addEventListener("message", ({ data: { type, ...config } }) => {
    if (type === "update") {
        setSessionConfig(config)
        updateConfig()
        updateUIConfig()
        document.execCommand("paste")
    }

    if (type === "update-text") {
        if (!alreadyHasSessionConfig()) {
            setSessionConfig(config)
        } else {
            const { startLine, windowTitle } = config
            setSessionConfig({ startLine, windowTitle })
        }
        updateConfig()
        document.execCommand("paste")
    }

    if (type === "update-config") {
        delete config.startLine
        delete config.windowTitle

        setSessionConfig(config)
        updateConfig()
        updateUIConfig()
        pasteCode()
    }

    if (type === "flash") {
        cameraFlashAnimation()
    }
})

window.addEventListener("DOMContentLoaded", () => {
    vscode.postMessage({ type: "ready" })
}, { once: true })

addListeners()