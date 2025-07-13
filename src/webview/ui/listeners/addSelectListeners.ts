import {
    roundingLevelSelect,
    windowIconTypeSelect,
    windowStyleSelect,
} from "../elements";
import { handleSelectBasedChange } from "./handlers";

export function addSelectListeners() {
    handleSelectBasedChange(roundingLevelSelect, "roundingLevel");
    handleSelectBasedChange(windowStyleSelect, "windowStyle");
    handleSelectBasedChange(windowIconTypeSelect, "windowIconType");
}
