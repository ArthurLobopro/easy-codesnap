import type { selectNames, TogglableConfigNames } from "../../types";
import { $ } from "../util";

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
export const highlightLineNumberInput = getToggle("highlightLineNumber");

//Selects
export const roundingLevelSelect = getSelect("roundingLevel");
export const windowStyleSelect = getSelect("windowStyle");
export const windowIconTypeSelect = getSelect("windowIconType");
