import { SessionConfig } from "../../SessionConfig";
import { $ } from "../../util";
import { zoomInButton, zoomOutButton, zoomSelect } from "../elements";

export function addZoomListeners() {
    zoomOutButton.addEventListener("click", () => {
        const option = $<HTMLOptionElement>("option:checked", zoomSelect);

        const previousOption =
            option?.previousElementSibling as HTMLOptionElement;

        if (previousOption) {
            SessionConfig.set({
                zoom: Number(previousOption.value),
            });
        }
    });

    zoomInButton.addEventListener("click", () => {
        const option = $<HTMLOptionElement>("option:checked", zoomSelect);

        const nextOption = option?.nextElementSibling as HTMLOptionElement;

        if (nextOption) {
            SessionConfig.set({
                zoom: Number(nextOption.value),
            });
        }
    });
}
