import { $ } from "./util"

//Original Interface
export const navbarNode = $("#navbar")
export const windowControlsNode = $("#window-controls")
export const windowTitleNode = $("#window-title")
export const btnSave = $("#save")
export const windowNode = $("#window")
export const snippetContainerNode = $("#snippet-container")
export const flashFx = $("#flash-fx")

//One time config elements
export const showWindowTitleInput = $<HTMLInputElement>("input[data-configname='showWindowTitle']")
export const showLineNumbersInput = $<HTMLInputElement>("input[data-configname='showLineNumbers']")
export const realLineNumbersInput = $<HTMLInputElement>("input[data-configname='realLineNumbers']")
export const showWindowControlsInput = $<HTMLInputElement>("input[data-configname='showWindowControls']")
export const roundedCornersInput = $<HTMLInputElement>("input[data-configname='roundedCorners']")
export const transparentBackgroundInput = $<HTMLInputElement>("input[data-configname='transparentBackground']")
export const enableResizingInput = $<HTMLInputElement>("input[data-configname='enableResizing']")

export const shutterActionSelect = $<HTMLSelectElement>("select[data-configname='shutterAction']")
export const saveFormatSelect = $<HTMLSelectElement>("select[data-configname='saveFormat']")
export const targetSelect = $<HTMLSelectElement>("select[data-configname='target']")
export const roundingLevelSelect = $<HTMLSelectElement>("select[data-configname='roundingLevel']")

export const openSettingsButton = $<HTMLLIElement>("[data-action='open-settings']")
export const resetConfigButton = $<HTMLLIElement>("[data-action='reset-config']")
export const saveConfigButton = $<HTMLLIElement>("[data-action='save-config']")
export const toggleLockedButton = $<HTMLButtonElement>("[data-action='toggle-lock']")
export const toggleLinkedButton = $<HTMLButtonElement>("[data-action='toggle-link']")