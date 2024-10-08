import type { WebviewConfig } from "../../../types";
import { SessionConfig } from "../../SessionConfig";
import { getWidth } from "../../util";
import { Updater } from "../Updater";
import {
    aspectRatioSelect,
    navbarNode,
    roundingLevelSelect,
    saveFormatSelect,
    saveScaleSelect,
    shutterActionSelect,
    snippetContainerNode,
    targetSelect,
    watermarkElement,
    windowControlsNode,
    windowNode,
    windowStyleSelect,
    windowTitleNode,
} from "../elements";

export class VisibilityUpdater extends Updater {
    constructor() {
        super([
            "showWindowControls",
            "showWindowTitle",
            "aspectRatio",
            "highlightLineNumber",
            "watermarkText",
            "target",
            "watermark",
        ]);
    }

    update() {
        const {
            showWindowControls,
            showWindowTitle,
            aspectRatio,
            highlightLineNumber,
            watermarkText,
            target,
            watermark,
        } = SessionConfig.get();

        navbarNode.style.display =
            !showWindowControls && !showWindowTitle ? "none" : "";

        windowControlsNode.hidden = !showWindowControls;
        windowTitleNode.hidden = !showWindowTitle;

        snippetContainerNode.style.aspectRatio =
            aspectRatio === "none" ? "" : aspectRatio?.replace(":", " / ");

        windowNode.classList.remove("line-number-hightlight");
        if (highlightLineNumber) {
            windowNode.classList.add("line-number-hightlight");
        }

        if (watermark) {
            watermarkElement.style.display = "";
            watermarkElement.innerText = watermarkText;
            watermarkElement.dataset.target = target;
        } else {
            watermarkElement.style.display = "none";
        }

        const biggerSelectWidth = `${getWidth(windowStyleSelect)}px`;

        targetSelect.style.width = biggerSelectWidth;
        shutterActionSelect.style.width = biggerSelectWidth;
        roundingLevelSelect.style.width = biggerSelectWidth;
        saveFormatSelect.style.width = biggerSelectWidth;
        saveScaleSelect.style.width = biggerSelectWidth;
        aspectRatioSelect.style.width = biggerSelectWidth;

        UpdateRatio(aspectRatio);
    }
}

export function UpdateRatio(
    aspectRatio: WebviewConfig["aspectRatio"] = SessionConfig.get(
        "aspectRatio",
    ),
) {
    if (aspectRatio && aspectRatio !== "none") {
        updateRatioByProportion(
            (aspectRatio?.split(":").map(Number) as [number, number]) || [0, 0],
        );
    } else {
        updateRatioByProportion([0, 0]);
    }
}

const nextMultipleOf = (value: number, multipleOf: number) =>
    value + (value % multipleOf);

function updateRatioByProportion(ratio: [number, number]) {
    snippetContainerNode.style.minWidth = "";
    windowNode.style.flex = "";

    if (ratio.includes(0)) {
        return;
    }

    const { height, width } = snippetContainerNode.getBoundingClientRect();

    if (ratio[0] === ratio[1]) {
        if (height > width) {
            snippetContainerNode.style.minWidth = `${Math.floor(height)}px`;
            windowNode.style.flex = "1";
        }
    }

    if (ratio[0] > ratio[1]) {
        const minHeight = nextMultipleOf(height, ratio[1]);
        const minWidth = (minHeight * ratio[0]) / ratio[1];

        snippetContainerNode.style.minWidth = `${Math.floor(minWidth)}px`;
        windowNode.style.flex = "1";
    }
}
