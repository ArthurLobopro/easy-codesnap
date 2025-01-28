import { SessionConfig } from "../../SessionConfig";
import { px, setVar } from "../../util";
import { Updater } from "../Updater";

export class VarUpdater extends Updater {
    constructor() {
        super([
            "fontLigatures",
            "tabSize",
            "backgroundColor",
            "boxShadow",
            "containerPadding",
            "roundedCorners",
            "enableResizing",
            "roundingLevel",
            "showLineNumbers",
            "letterSpacing",
        ]);
    }

    update() {
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
            letterSpacing,
        } = SessionConfig.get();

        setVar("ligatures", fontLigatures ? "normal" : "none");
        if (typeof fontLigatures === "string") {
            setVar("font-features", fontLigatures);
        }

        console.log("Letter Spacing", letterSpacing);

        setVar("letter-spacing", px(letterSpacing));
        setVar("tab-size", tabSize.toString());
        setVar("container-background-color", backgroundColor);
        setVar("box-shadow", boxShadow);
        setVar("container-padding", containerPadding);

        setVar(
            "window-border-radius",
            roundedCorners ? px(4 * roundingLevel) : "0",
        );

        setVar("enable-resizing", enableResizing ? "horizontal" : "none");
        setVar("line-number-visibility", showLineNumbers ? "block" : "none");
    }
}
