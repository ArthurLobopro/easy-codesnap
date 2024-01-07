import { toPNG, toSVG } from "@arthur-lobo/dom-to-image"
import { WebviewConfig, getSessionConfig } from "./configManager"
import { flashFx, snippetContainerNode, windowNode } from "./elements"
import { once, redraw, setVar, vscode } from "./util"

const SNAP_SCALE = 2

export const cameraFlashAnimation = async () => {
    flashFx.style.display = "block"
    redraw(flashFx)
    flashFx.style.opacity = "0"

    await once(flashFx, "transitionend")
    flashFx.style.display = "none"
    flashFx.style.opacity = "1"
}

async function exportPNG(target: HTMLElement, action: WebviewConfig["shutterAction"]) {
    const url = await toPNG(target)

    const data = url.slice(url.indexOf(",") + 1)

    if (action === "copy") {
        const binary = atob(data)
        const array = new Uint8Array(binary.length)
        for (let i = 0; i < binary.length; i++) { array[i] = binary.charCodeAt(i) }
        const blob = new Blob([array], { type: "image/png" })
        navigator.clipboard.write([new ClipboardItem({ "image/png": blob })])
        cameraFlashAnimation()
        vscode.postMessage({ type: "copied" })
    } else {
        vscode.postMessage({ type: action, data, format: "png" })
    }
}

async function exportSVG(target: HTMLElement, action: WebviewConfig["shutterAction"]) {
    const svg = toSVG(target)

    if (action === "copy") {
        navigator.clipboard.writeText(svg)
        cameraFlashAnimation()
        vscode.postMessage({ type: "copied" })
    } else {
        vscode.postMessage({ type: action, data: svg, format: "svg" })
    }
}

export async function takeSnap(config = getSessionConfig()) {
    windowNode.style.resize = "none"

    if (config.transparentBackground || config.target === "window") {
        setVar("container-background-color", "transparent")
    }

    const target = config.target === "container" ? snippetContainerNode : windowNode

    // await exportPNG(target, config.shutterAction)
    await exportSVG(target, config.shutterAction)
    // console.log(await toPNG(target))

    windowNode.style.resize = ""
    setVar("container-background-color", config.backgroundColor)
}