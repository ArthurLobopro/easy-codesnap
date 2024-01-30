import { getSessionConfig } from "../../configManager";
import { setVar } from "../../util";

export function ZoomUpdater() {
    const { zoom } = getSessionConfig();

    setVar("zoom", zoom + "%");
}
