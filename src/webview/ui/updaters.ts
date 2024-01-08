import { getSessionConfig } from "../configManager"
import { enableResizingInput, navbarNode, realLineNumbersInput, roundedCornersInput, roundingLevelSelect, saveFormatSelect, showLineNumbersInput, showWindowControlsInput, showWindowTitleInput, shutterActionSelect, targetSelect, toggleLinkedButton, toggleLockedButton, transparentBackgroundInput, windowControlsNode, windowTitleNode } from "../elements"
import { $$, calcTextWidth, setVar } from "../util"

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
    LockButtonUpdater()
    LinkButtonUpdater()

    windowTitleNode.textContent = windowTitle
}

export function OneTimeConfigUpdater() {
    const {
        showLineNumbers, realLineNumbers, showWindowControls, roundedCorners, transparentBackground, showWindowTitle, shutterAction, target, enableResizing, roundingLevel,
        saveFormat
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
    saveFormatSelect.value = saveFormat
}

export function LockButtonUpdater() {
    const { isLocked } = getSessionConfig()

    toggleLockedButton.classList.remove("codicon-unlock")
    toggleLockedButton.classList.remove("codicon-lock")

    toggleLockedButton.classList.add(isLocked ? "codicon-lock" : "codicon-unlock")
    toggleLockedButton.title = isLocked ? "Unlock changes" : "Lock changes"
}

export function LinkButtonUpdater() {
    const { isLinked } = getSessionConfig()

    toggleLinkedButton.dataset.state = isLinked ? "linked" : "unlinked"
    toggleLinkedButton.title = isLinked ? "Broken Connection to editor" : "Connect to editor"
}

function LineNumbersUpdater() {
    const { realLineNumbers } = getSessionConfig()

    const lineNumbers = $$(".line-number")

    lineNumbers.forEach(line => {
        line.textContent = (
            realLineNumbers ? line.dataset.reallinenumber : line.dataset.linenumber
        ) as string
    })

    lineNumbers.length && setVar("line-number-width", calcTextWidth(String(lineNumbers.at(-1)?.textContent)))
}