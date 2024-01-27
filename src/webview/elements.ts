import { togglableNames } from "../types";
import { $ } from "./util";

const getToggle = (name: togglableNames) =>
    $<HTMLInputElement>(`input[data-configname='${name}']`);

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
export const shutterActionSelect = $<HTMLSelectElement>(
    "select[data-configname='shutterAction']",
);
export const saveFormatSelect = $<HTMLSelectElement>(
    "select[data-configname='saveFormat']",
);
export const targetSelect = $<HTMLSelectElement>(
    "select[data-configname='target']",
);
export const roundingLevelSelect = $<HTMLSelectElement>(
    "select[data-configname='roundingLevel']",
);
export const windowStyleSelect = $<HTMLSelectElement>(
    "select[data-configname='windowStyle']",
);

//Buttons
export const openSettingsButton = $<HTMLLIElement>(
    "[data-action='open-settings']",
);
export const resetConfigButton = $<HTMLLIElement>(
    "[data-action='reset-config']",
);
export const saveConfigButton = $<HTMLLIElement>("[data-action='save-config']");
export const toggleLockedButton = $<HTMLButtonElement>(
    "[data-action='toggle-lock']",
);
export const toggleLinkedButton = $<HTMLButtonElement>(
    "[data-action='toggle-link']",
);
