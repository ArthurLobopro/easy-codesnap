import type { selectNames, TogglableConfigNames } from "../../../types";
import { SessionConfig } from "../../SessionConfig";

type events = "change" | "click";

function handleToggleEvent(
    element: HTMLElement,
    configName: TogglableConfigNames,
    event: events,
) {
    element.addEventListener(event, () => {
        SessionConfig.toggle(configName);
    });
}

export function handleToggleBasedClick(
    element: HTMLElement,
    configName: TogglableConfigNames,
) {
    handleToggleEvent(element, configName, "click");
}

export function handleToggleBasedChange(
    element: HTMLElement,
    configName: TogglableConfigNames,
) {
    handleToggleEvent(element, configName, "change");
}

export function handleSelectBasedChange(
    select: HTMLSelectElement,
    configName: selectNames,
) {
    const treater = ["saveScale", "roundingLevel"].includes(configName)
        ? Number
        : (v: any) => v;

    select.addEventListener("change", () => {
        SessionConfig.set({
            [configName]: treater(select.value),
        });
    });
}
