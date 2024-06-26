import type { TogglableConfigNames, selectNames } from "../../../types";
import { SessionConfig } from "../../SessionConfig";

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

        updater?.();
    });
}

export function handleToggleBasedClick(
    element: HTMLElement,
    configName: TogglableConfigNames,
    updater?: updater,
) {
    handleToggleEvent(element, configName, "click", updater);
}

export function handleToggleBasedChange(
    element: HTMLElement,
    configName: TogglableConfigNames,
    updater?: updater,
) {
    handleToggleEvent(element, configName, "change", updater);
}

export function handleSelectBasedChange(
    select: HTMLSelectElement,
    configName: selectNames,
    updater?: () => void,
) {
    const treater = ["saveScale", "roundingLevel"].includes(configName)
        ? Number
        : (v: any) => v;

    select.addEventListener("change", () => {
        SessionConfig.set({
            [configName]: treater(select.value),
        });

        updater?.();
    });
}
