import { SessionConfig } from "../../SessionConfig";
import { setVar } from "../../util";
import { zoomInButton, zoomOutButton, zoomSelect } from "../elements";

export function ZoomUpdater() {
    const zoom = SessionConfig.get("zoom");

    zoomInButton.classList.remove("disabled");
    zoomOutButton.classList.remove("disabled");

    if (zoom === 50) {
        zoomOutButton.classList.add("disabled");
    }

    if (zoom === 150) {
        zoomInButton.classList.add("disabled");
    }

    zoomSelect.value = zoom.toString();
    setVar("zoom", `${zoom}%`);
}
