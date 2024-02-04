import { selectNames, TogglableConfigNames } from "../types";
import { $ } from "./util";

function getToggle(name: TogglableConfigNames) {
    return $<HTMLInputElement>(`input[data-configname="${name}"]`);
}

function getSelect(name: selectNames) {
    return $<HTMLSelectElement>(`select[data-configname="${name}"]`);
}

type buttonActions =
    | "open-settings"
    | "reset-config"
    | "save-config"
    | "toggle-lock"
    | "toggle-link"
    | "zoom-in"
    | "zoom-out";

function getButton(action: buttonActions) {
    return $<HTMLLIElement>(`[data-action="${action}"]`);
}

//Original Interface
export const navbarNode = $("#navbar");
export const windowControlsNode = $("#window-controls");
export const windowTitleNode = $("#window-title");
export const btnSave = $("#save");
export const windowNode = $("#window");
export const snippetContainerNode = $("#snippet-container");
export const flashFx = $("#flash-fx");

//One time config elements
export const showWindowTitleInput = getToggle("showWindowTitle");
export const showLineNumbersInput = getToggle("showLineNumbers");
export const realLineNumbersInput = getToggle("realLineNumbers");
export const showWindowControlsInput = getToggle("showWindowControls");
export const roundedCornersInput = getToggle("roundedCorners");
export const transparentBackgroundInput = getToggle("transparentBackground");
export const enableResizingInput = getToggle("enableResizing");

//Selects
export const shutterActionSelect = getSelect("shutterAction");
export const saveFormatSelect = getSelect("saveFormat");
export const targetSelect = getSelect("target");
export const roundingLevelSelect = getSelect("roundingLevel");
export const windowStyleSelect = getSelect("windowStyle");
export const zoomSelect = getSelect("zoom");

//Buttons
export const openSettingsButton = getButton("open-settings");
export const resetConfigButton = getButton("reset-config");
export const saveConfigButton = getButton("save-config");
export const toggleLockedButton = getButton("toggle-lock");
export const toggleLinkedButton = getButton("toggle-link");
export const zoomInButton = getButton("zoom-in");
export const zoomOutButton = getButton("zoom-out");
