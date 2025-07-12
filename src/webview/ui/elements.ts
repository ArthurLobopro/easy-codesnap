import type { selectNames, TogglableConfigNames } from "../../types";
import { $ } from "../util";

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

function getToggle(name: TogglableConfigNames) {
    return $<HTMLInputElement>(`input[data-configname="${name}"]`);
}

function getSelect(name: selectNames) {
    return $<HTMLSelectElement>(`select[data-configname="${name}"]`);
}

// Interface
export const navbarNode = $("#navbar");
export const windowControlsNode = $("#window-controls");
export const windowTitleNode = $<HTMLDivElement>("#window-title");
export const btnSave = $("#save");
export const windowNode = $("#window");
export const snippetContainerNode = $("#snippet-container");
export const flashFx = $("#flash-fx");
export const watermarkElement = $("#watermark");
export const targetProportion = $("#target-proportion");
export const breadcrumbNode = $("#breadcrumb");

//One time config elements
export const showWindowTitleInput = getToggle("showWindowTitle");
export const showLineNumbersInput = getToggle("showLineNumbers");
export const realLineNumbersInput = getToggle("realLineNumbers");
export const showWindowControlsInput = getToggle("showWindowControls");
export const roundedCornersInput = getToggle("roundedCorners");
export const transparentBackgroundInput = getToggle("transparentBackground");
export const enableResizingInput = getToggle("enableResizing");
export const enableSymbolBreadcrumbInput = getToggle("enableSymbolBreadcrumb");
export const highlightLineNumberInput = getToggle("highlightLineNumber");
export const maxCharWidthInput = $<HTMLInputElement>(
    `[data-configname="maxCharWidth"]`,
);

//Selects
export const targetSelect = getSelect("target");
export const roundingLevelSelect = getSelect("roundingLevel");
export const windowStyleSelect = getSelect("windowStyle");
// export const zoomSelect = getSelect("zoom");
export const aspectRatioSelect = getSelect("aspectRatio");
export const windowIconTypeSelect = getSelect("windowIconType");

//Buttons
export const openSettingsButton = getButton("open-settings");
export const resetConfigButton = getButton("reset-config");
export const saveConfigButton = getButton("save-config");
// export const toggleLockedButton = getButton("toggle-lock");
// export const toggleLinkedButton = getButton("toggle-link");
// export const zoomInButton = getButton("zoom-in");
// export const zoomOutButton = getButton("zoom-out");
