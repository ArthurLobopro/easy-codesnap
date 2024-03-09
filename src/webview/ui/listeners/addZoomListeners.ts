import { SessionConfig } from "../../SessionConfig";
import { $ } from "../../util";
import { zoomInButton, zoomOutButton, zoomSelect } from "../elements";
import { ZoomUpdater } from "../updaters";

export function addZoomListeners() {
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
}
