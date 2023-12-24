
type highlightLevels = "none" | "add" | "remove"

const highlightOrder = ["none", "add", "remove"]

export function highlightOnclickFactory(lineElement: HTMLDivElement) {
    return () => {
        const currentHighlight = lineElement.dataset.highlight as highlightLevels

        const currentIndex = highlightOrder.indexOf(currentHighlight)
        const newIndex = currentIndex + 1

        lineElement.dataset.highlight =
            newIndex === highlightOrder.length ?
                highlightOrder.at(0) :
                highlightOrder.at(newIndex)
    }
}