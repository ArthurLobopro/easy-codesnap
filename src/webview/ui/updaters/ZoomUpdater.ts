import { SessionConfig } from "../../SessionConfig";
import { setVar } from "../../util";
import { Updater } from "../Updater";
import { zoomInButton, zoomOutButton, zoomSelect } from "../elements";

export class ZoomUpdater extends Updater {
    constructor() {
        super(["zoom"]);
    }

    update() {
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
}
