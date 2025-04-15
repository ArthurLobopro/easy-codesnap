import type { WebviewConfig } from "../../../types";
import { SessionConfig } from "../../SessionConfig";
import { getWidth, px } from "../../util";
import { Updater } from "../Updater";
import {
    aspectRatioSelect,
    navbarNode,
    roundingLevelSelect,
    saveFormatSelect,
    saveScaleSelect,
    shutterActionSelect,
    snippetContainerNode,
    targetProportion,
    targetSelect,
    windowControlsNode,
    windowNode,
    windowTitleNode,
} from "../elements";

export class VisibilityUpdater extends Updater {
    constructor() {
        super([
            "showWindowControls",
            "showWindowTitle",
            "aspectRatio",
            "highlightLineNumber",
            "enableResizing",
            "target",
        ]);
    }

    update() {
        const {
            showWindowControls,
            showWindowTitle,
            aspectRatio,
            highlightLineNumber,
            enableResizing,
        } = SessionConfig.get();

        navbarNode.style.display =
            !showWindowControls && !showWindowTitle ? "none" : "";

        windowControlsNode.hidden = !showWindowControls;
        windowTitleNode.hidden = !showWindowTitle;

        windowNode.classList.remove("line-number-hightlight");
        if (highlightLineNumber) {
            windowNode.classList.add("line-number-hightlight");
        }

        if (!enableResizing) {
            windowNode.style.width = "";
            snippetContainerNode.style.width = "";
        }

        UpdateTargetProportion();

        const selects = [
            targetSelect,
            shutterActionSelect,
            roundingLevelSelect,
            saveFormatSelect,
            saveScaleSelect,
            aspectRatioSelect,
        ];

        const biggerSelect = selects.reduce((prev, curr) => {
            const prevWidth = getWidth(prev);
            const currWidth = getWidth(curr);

            return prevWidth >= currWidth ? prev : curr;
        }, targetSelect);

        const biggerSelectWidth = `${getWidth(biggerSelect)}px`;

        for (const select of selects) {
            select.style.width = biggerSelectWidth;
        }

        UpdateRatio(aspectRatio);
    }
}

export function UpdateTargetProportion() {
    const target = SessionConfig.get("target");

    if (target === "container") {
        const { width, height } = snippetContainerNode.getBoundingClientRect();
        targetProportion.innerText = `${width.toFixed(0)} x ${height.toFixed(0)}`;
    } else {
        const { width, height } = windowNode.getBoundingClientRect();
        targetProportion.innerText = `${width.toFixed(0)} x ${height.toFixed(0)}`;
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
    snippetContainerNode.style.minHeight = "";
    windowNode.style.flex = "";

    if (ratio.includes(0)) {
        return;
    }

    const { height, width } = snippetContainerNode.getBoundingClientRect();

    if (ratio[0] === ratio[1]) {
        if (height > width) {
            snippetContainerNode.style.minWidth = `${Math.floor(height)}px`;
            return;
        }

        snippetContainerNode.style.minHeight = `${Math.floor(width)}px`;
        return;
    }

    if (ratio[1] === 1) {
        snippetContainerNode.style.minWidth = px(Math.floor(height * ratio[0]));
        return;
    }

    if (ratio[0] > ratio[1]) {
        const minHeight = nextMultipleOf(height, ratio[1]);
        const minWidth = (minHeight * ratio[0]) / ratio[1];

        snippetContainerNode.style.minWidth = px(Math.floor(minWidth));
        return;
    }

    const minWidth = nextMultipleOf(width, ratio[0]);
    const minHeight = (minWidth * ratio[1]) / ratio[0];

    if (width > height) {
        snippetContainerNode.style.minHeight = px(minHeight);
    } else {
        snippetContainerNode.style.minWidth = px(minWidth);
    }
}
