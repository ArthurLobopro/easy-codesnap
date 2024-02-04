import { getSessionConfig } from "../../SessionConfig";
import { setVar } from "../../util";

export function VarUpdater() {
    const {
        fontLigatures,
        tabSize,
        backgroundColor,
        boxShadow,
        containerPadding,
        roundedCorners,
        enableResizing,
        roundingLevel,
        showLineNumbers,
    } = getSessionConfig();

    setVar("ligatures", fontLigatures ? "normal" : "none");
    if (typeof fontLigatures === "string") {
        setVar("font-features", fontLigatures);
    }

    setVar("tab-size", tabSize + "");
    setVar("container-background-color", backgroundColor);
    setVar("box-shadow", boxShadow);
    setVar("container-padding", containerPadding);
    setVar(
        "window-border-radius",
        roundedCorners ? `${4 * roundingLevel}px` : 0 + "",
    );
    setVar("enable-resizing", enableResizing ? "horizontal" : "none");
    setVar("line-number-visibility", showLineNumbers ? "block" : "none");
}
