export const $ = (q, c = document) => c.querySelector(q)

export const $$ = (q, c = document) => Array.from(c.querySelectorAll(q))

export const once = (elem, evt) =>
    new Promise((done) => elem.addEventListener(evt, done, { once: true }))

export const redraw = (node) => node.clientHeight

export const setVar = (key, value, node = document.body) =>
    node.style.setProperty("--" + key, value)

export const calcTextWidth = (text) => {
    const div = document.body.appendChild(document.createElement("div"))
    div.classList.add("size-test")
    div.textContent = text
    const width = div.clientWidth
    div.remove()
    return width + 1 + "px"
}

export const vscode = acquireVsCodeApi()

export const setSessionConfig = (config) => {
    if (alreadyHasSessionConfig()) {
        config = { ...getSessionConfig(), ...config }
    }

    sessionStorage.setItem("easy-codesnap-config", JSON.stringify(config))
}

export const getSessionConfig = () => {
    return JSON.parse(sessionStorage.getItem("easy-codesnap-config"))
}

export const alreadyHasSessionConfig = () => {
    return !!sessionStorage.getItem("easy-codesnap-config")
}