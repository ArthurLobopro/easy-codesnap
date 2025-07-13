const highlightOrder = ["none", "focus", "add", "remove", "vscode"];

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

    if (ev.ctrlKey) {
      lineElement.dataset.highlight = "none";
      return;
    }

    lineElement.dataset.highlight =
      newIndex === highlightOrder.length
        ? highlightOrder.at(0)
        : highlightOrder.at(newIndex);
  };
}
