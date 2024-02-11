import { selectNames, TogglableConfigNames } from "../../types";
import { SessionConfig } from "../SessionConfig";
import { $, getDefaultWindowTitle, vscode } from "../util";

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
    windowTitleNode,
    zoomInButton,
    zoomOutButton,
    zoomSelect,
} from "../elements";

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
    configName: TogglableConfigNames,
    event: events,
    updater?: updater,
) {
    element.addEventListener(event, () => {
        SessionConfig.toggle(configName);

        updater && updater();
    });
}

function handleToggleBasedClick(
    element: HTMLElement,
    configName: TogglableConfigNames,
    updater?: updater,
) {
    handleToggleEvent(element, configName, "click", updater);
}

function handleToggleBasedChange(
    element: HTMLElement,
    configName: TogglableConfigNames,
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
        SessionConfig.set({
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
        vscode.postMessage({
            type: "save-config",
            config: SessionConfig.get(),
        });
    });

    openSettingsButton.addEventListener("click", () => {
        vscode.postMessage({ type: "open-settings" });
    });

    zoomOutButton.addEventListener("click", () => {
        const option = $<HTMLOptionElement>("option:checked", zoomSelect);

        const previousOption = (option &&
            option.previousElementSibling) as HTMLOptionElement;

        if (previousOption) {
            SessionConfig.set({
                zoom: Number(previousOption.value),
            });

            ZoomUpdater();
        }
    });

    zoomInButton.addEventListener("click", () => {
        const option = $<HTMLOptionElement>("option:checked", zoomSelect);

        const nextOption = (option &&
            option.nextElementSibling) as HTMLOptionElement;

        if (nextOption) {
            SessionConfig.set({
                zoom: Number(nextOption.value),
            });

            ZoomUpdater();
        }
    });

    windowTitleNode.addEventListener("dblclick", () => {
        windowTitleNode.contentEditable = "true";
        const range = document.createRange();
        range.selectNodeContents(windowTitleNode);

        range.collapse(false);
        const selection = window.getSelection() as Selection;
        selection.removeAllRanges();
        selection.addRange(range);
    });

    windowTitleNode.addEventListener("blur", () => {
        windowTitleNode.contentEditable = "false";

        const defaultTitle = getDefaultWindowTitle();
        const currentTitle = windowTitleNode.textContent;

        if (!currentTitle?.length || currentTitle === defaultTitle) {
            windowTitleNode.textContent = getDefaultWindowTitle();
            SessionConfig.set({
                shouldUpdateTitle: true,
            });
            return;
        }

        if (currentTitle !== defaultTitle) {
            return SessionConfig.set({
                shouldUpdateTitle: false,
            });
        }
    });

    windowTitleNode.addEventListener("keypress", (event) => {
        if (event.key === "Enter") {
            windowTitleNode.blur();
            return false;
        }
    });
}
