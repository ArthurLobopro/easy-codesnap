import { ContentManager } from "../../ContentManager";
import { SessionConfig } from "../../SessionConfig";
import { $, $$, calcTextWidth, setVar } from "../../util";
import { highlightOnclickFactory } from "../highlight";

const snippetNode = $("#snippet") as HTMLDivElement;

function setupLines(node: Element) {
    const config = SessionConfig.get();

    $$(":scope > br", node).forEach(
        (row) => (row.outerHTML = "<div>&nbsp;</div>"),
    );

    const startLine = config.realLineNumbers ? config.startLine : 0;

    const rows = $$(":scope > div", node);
    setVar("line-number-width", calcTextWidth(`${rows.length + startLine}`));

    rows.forEach((row, idx) => {
        const newRow = document.createElement("div");
        newRow.classList.add("line");
        newRow.dataset.highlight = "none";
        row.replaceWith(newRow);

        const lineNum = document.createElement("div");
        lineNum.classList.add("line-number");
        lineNum.dataset.linenumber = `${idx + 1}`;
        lineNum.dataset.reallinenumber = `${idx + 1 + config.startLine}`;
        lineNum.textContent = `${idx + 1 + startLine}`;
        lineNum.addEventListener("click", highlightOnclickFactory(newRow));
        lineNum.addEventListener(
            "contextmenu",
            highlightOnclickFactory(newRow, "context"),
        );
        newRow.appendChild(lineNum);

        const span = document.createElement("span");
        span.textContent = " ";
        row.appendChild(span);

        const lineCodeDiv = document.createElement("div");
        lineCodeDiv.classList.add("line-code");
        const lineCode = document.createElement("span");
        lineCode.innerHTML = row.innerHTML;
        lineCodeDiv.appendChild(lineCode);

        newRow.appendChild(lineCodeDiv);
    });
}

function stripInitialIndent(node: Element) {
    const regIndent = /^\s+/u;
    const initialSpans = $$(
        ":scope > div > span:first-child",
        node,
    ) as HTMLSpanElement[];
    if (
        initialSpans.some((span) => !regIndent.test(span.textContent as string))
    ) {
        return;
    }

    const minIndent = Math.min(
        ...initialSpans.map((span) => {
            return (
                (span.textContent as string).match(regIndent) as string[]
            )[0].length;
        }),
    );

    initialSpans.forEach((span) => {
        span.textContent = (span.textContent as string).slice(minIndent);
    });
}

export function UpdateCode() {
    snippetNode.innerHTML = ContentManager.current;
    const code = $("div", snippetNode) as HTMLDivElement;
    snippetNode.style.fontSize = code.style.fontSize;
    snippetNode.style.lineHeight = code.style.lineHeight;
    snippetNode.innerHTML = code.innerHTML;
    stripInitialIndent(snippetNode);
    setupLines(snippetNode);
}
