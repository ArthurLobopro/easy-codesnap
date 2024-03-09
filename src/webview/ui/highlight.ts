type highlightLevels = "none" | "focus" | "add" | "remove";

const highlightOrder = ["none", "focus", "add", "remove"];

export function highlightOnclickFactory(
    lineElement: HTMLDivElement,
    type?: "click" | "context",
) {
    return (ev: MouseEvent) => {
        ev.preventDefault();
        ev.stopPropagation();

        const currentHighlight = lineElement.dataset.highlight || "none";
        const currentIndex = highlightOrder.indexOf(currentHighlight);

        const newIndex = currentIndex + (type === "context" ? -1 : 1);

        lineElement.dataset.highlight =
            newIndex === highlightOrder.length
                ? highlightOrder.at(0)
                : highlightOrder.at(newIndex);
    };
}
