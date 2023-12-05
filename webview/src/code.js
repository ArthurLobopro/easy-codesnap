import { getSessionConfig } from "./configManager.js"
import { contentManager } from "./contentManager.js"
import { $, $$, calcTextWidth, setVar } from "./util.js"

const snippetNode = $("#snippet")

const setupLines = (node) => {
    const config = getSessionConfig()

    $$(":scope > br", node).forEach((row) => (row.outerHTML = "<div>&nbsp;</div>"))

    const startLine = config.realLineNumbers ? config.startLine : 0

    const rows = $$(":scope > div", node)
    setVar("line-number-width", calcTextWidth(rows.length + startLine))

    rows.forEach((row, idx) => {
        const newRow = document.createElement("div")
        newRow.classList.add("line")
        row.replaceWith(newRow)

        if (config.showLineNumbers) {
            const lineNum = document.createElement("div")
            lineNum.classList.add("line-number")
            lineNum.textContent = idx + 1 + startLine
            newRow.appendChild(lineNum)
        }

        const span = document.createElement("span")
        span.textContent = " "
        row.appendChild(span)

        const lineCodeDiv = document.createElement("div")
        lineCodeDiv.classList.add("line-code")
        const lineCode = document.createElement("span")
        lineCode.innerHTML = row.innerHTML
        lineCodeDiv.appendChild(lineCode)

        newRow.appendChild(lineCodeDiv)
    })
}

//@ts-check

const stripInitialIndent = (node) => {
    const regIndent = /^\s+/u
    const initialSpans = $$(":scope > div > span:first-child", node)
    if (initialSpans.some((span) => !regIndent.test(span.textContent))) { return }
    const minIndent = Math.min(
        ...initialSpans.map((span) => span.textContent.match(regIndent)[0].length)
    )
    initialSpans.forEach((span) => (span.textContent = span.textContent.slice(minIndent)))
}


export const pasteCode = () => {
    snippetNode.innerHTML = contentManager.current
    const code = $("div", snippetNode)
    snippetNode.style.fontSize = code.style.fontSize
    snippetNode.style.lineHeight = code.style.lineHeight
    snippetNode.innerHTML = code.innerHTML
    stripInitialIndent(snippetNode)
    setupLines(snippetNode, getSessionConfig())
}