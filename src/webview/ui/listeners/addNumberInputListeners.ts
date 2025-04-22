import { SessionConfig } from "../../SessionConfig";
import { maxCharWidthInput } from "../elements";

export function addNumberInputListeners() {
    maxCharWidthInput.addEventListener("change", () => {
        if (!maxCharWidthInput.checkValidity()) {
            maxCharWidthInput.value =
                SessionConfig.get("maxCharWidth").toString();
            return;
        }

        SessionConfig.set({
            maxCharWidth: maxCharWidthInput.valueAsNumber,
        });
    });
}
