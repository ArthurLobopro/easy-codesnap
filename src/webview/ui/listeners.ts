import { selectNames, togglableNames } from "../../types";
import { getSessionConfig, setSessionConfig } from "../configManager";
import {
    enableResizingInput,
    openSettingsButton,
    realLineNumbersInput,
    resetConfigButton,
    roundedCornersInput,
    roundingLevelSelect,
    saveConfigButton,
    saveFormatSelect,
    showLineNumbersInput,
    showWindowControlsInput,
    showWindowTitleInput,
    shutterActionSelect,
    targetSelect,
    toggleLinkedButton,
    toggleLockedButton,
    transparentBackgroundInput,
    windowStyleSelect,
    zoomSelect,
} from "../elements";
import { vscode } from "../util";
import {
    LineNumbersUpdater,
    LinkButtonUpdater,
    LockButtonUpdater,
    UIUpdater,
    VarUpdater,
    VisibilityUpdater,
    ZoomUpdater,
} from "./updaters";

type NotBooleanProperties<T> = Pick<
    T,
    {
        [K in keyof T]: T[K] extends boolean ? never : K;
    }[keyof T]
>;

type events = "change" | "click";
type updater = () => void;

function handleToggleEvent(
    element: HTMLElement,
    configName: togglableNames,
    event: events,
    updater?: updater,
) {
    element.addEventListener(event, () => {
        setSessionConfig({
            [configName]: !getSessionConfig()[configName],
        });

        updater && updater();
    });
}

function handleToggleBasedClick(
    element: HTMLElement,
    configName: togglableNames,
    updater?: updater,
) {
    handleToggleEvent(element, configName, "click", updater);
}

function handleToggleBasedChange(
    element: HTMLElement,
    configName: togglableNames,
    updater?: updater,
) {
    handleToggleEvent(element, configName, "change", updater);
}

function handleSelectBasedChange(
    select: HTMLSelectElement,
    configName: selectNames,
    updater?: () => void,
) {
    select.addEventListener("change", () => {
        setSessionConfig({
            [configName]: select.value,
        });

        updater && updater();
    });
}

export function addListeners() {
    //Toggles
    handleToggleBasedChange(
        showLineNumbersInput,
        "showLineNumbers",
        VarUpdater,
    );
    handleToggleBasedChange(
        realLineNumbersInput,
        "realLineNumbers",
        LineNumbersUpdater,
    );

    handleToggleBasedChange(
        showWindowTitleInput,
        "showWindowTitle",
        VisibilityUpdater,
    );
    handleToggleBasedChange(
        showWindowControlsInput,
        "showWindowControls",
        VisibilityUpdater,
    );

    handleToggleBasedChange(roundedCornersInput, "roundedCorners", VarUpdater);
    handleToggleBasedChange(enableResizingInput, "enableResizing", VarUpdater);
    handleToggleBasedChange(
        transparentBackgroundInput,
        "transparentBackground",
    );

    handleToggleBasedClick(toggleLinkedButton, "isLinked", LinkButtonUpdater);
    handleToggleBasedClick(toggleLockedButton, "isLocked", LockButtonUpdater);

    //Selects
    handleSelectBasedChange(shutterActionSelect, "shutterAction");
    handleSelectBasedChange(targetSelect, "target");
    handleSelectBasedChange(saveFormatSelect, "saveFormat");

    handleSelectBasedChange(roundingLevelSelect, "roundingLevel", VarUpdater);
    handleSelectBasedChange(windowStyleSelect, "windowStyle", UIUpdater);
    handleSelectBasedChange(zoomSelect, "zoom", ZoomUpdater);

    //Message Buttons
    resetConfigButton.addEventListener("click", () => {
        vscode.postMessage({ type: "update-config" });
    });

    saveConfigButton.addEventListener("click", () => {
        vscode.postMessage({ type: "save-config", config: getSessionConfig() });
    });

    openSettingsButton.addEventListener("click", () => {
        vscode.postMessage({ type: "open-settings" });
    });
}
