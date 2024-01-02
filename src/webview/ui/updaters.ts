import { LineNumbersUpdater } from "../code"
import { getSessionConfig } from "../configManager"
import { enableResizingInput, navbarNode, realLineNumbersInput, roundedCornersInput, roundingLevelSelect, showLineNumbersInput, showWindowControlsInput, showWindowTitleInput, shutterActionSelect, targetSelect, transparentBackgroundInput, windowControlsNode, windowTitleNode } from "../elements"
import { setVar } from "../util"

export function VarUpdater() {
    const {
        fontLigatures,
        tabSize,
        backgroundColor,
        boxShadow,
        containerPadding,
        roundedCorners,
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
}

export function VisibilityUpdater() {
    const {
        showWindowControls,
        showWindowTitle,
    } = getSessionConfig()

    navbarNode.hidden = !showWindowControls && !showWindowTitle
    windowControlsNode.hidden = !showWindowControls
    windowTitleNode.hidden = !showWindowTitle
}

export function UIUpdater() {
    const {
        windowTitle,
    } = getSessionConfig()

    VarUpdater()
    VisibilityUpdater()
    LineNumbersUpdater()
    OneTimeConfigUpdater()

    windowTitleNode.textContent = windowTitle
}

export function OneTimeConfigUpdater() {
    const {
        showLineNumbers, realLineNumbers, showWindowControls, roundedCorners, transparentBackground, showWindowTitle, shutterAction, target, enableResizing, roundingLevel
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
