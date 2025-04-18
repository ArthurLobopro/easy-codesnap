import { SessionConfig } from "../../SessionConfig";
import { px, setVar } from "../../util";
import { Updater } from "../Updater";
import { snippetContainerNode } from "../elements";

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
            "target",
            "maxCharWidth",
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
            target,
            maxCharWidth,
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

        setVar("line-number-visibility", showLineNumbers ? "block" : "none");

        setVar(
            "max-char-width",
            maxCharWidth === 0 ? "100%" : `${maxCharWidth.toFixed(0)}ch`,
        );

        snippetContainerNode.dataset.enableresizing = String(enableResizing);
        snippetContainerNode.dataset.target = target;
    }
}
