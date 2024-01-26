function textToSVG(svgText) {
    const parser = new DOMParser()
    const docElem = parser.parseFromString(svgText, "text/xml").documentElement

    const node = docElem
    document.importNode(node, true)
    return node
}

class LoadSVG extends HTMLElement {
    static observedAttributes = ["src"];

    constructor() {
        super()

        this.attachShadow({ mode: "open" })
    }

    connectedCallback() {
        if (this.hasAttribute("src")) {
            this.build()
        }
    }

    async build() {
        const svg_el = await this.getSvgElement()

        this.style.width = this.getAttribute("width") || svg_el.width
        this.style.height = this.getAttribute("height") || svg_el.height

        if (this.shadowRoot.firstChild) {
            this.shadowRoot.replaceChild(svg_el, this.shadowRoot.firstChild)
        } else {
            this.shadowRoot.appendChild(svg_el)
        }
    }

    /** @returns {Promise<SVGElement>} */
    async getSvgElement() {
        const src = this.getAttribute("src")

        const svg_text = await fetch(src, { method: "GET" })
            .then(svg => svg.text())
        const svg_el = textToSVG(svg_text)

        return svg_el
    }

    attributeChangedCallback(name, oldValue, newValue) {
        console.log(`Attribute ${name} has changed.`)

        if (name === "src" && oldValue !== newValue) {
            this.build()
        }
    }
}

customElements.define("load-svg", LoadSVG)