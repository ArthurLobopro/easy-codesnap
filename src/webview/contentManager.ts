const getClipboardHtml = (clip: DataTransfer) => {
    const html = clip.getData("text/html")
    if (html) { return html }
    const text = clip
        .getData("text/plain")
        .split("\n")
        .map((line) => `<div>${line}</div>`)
        .join("")
    return `<div>${text}</div>`
}

class ContentManager {
    #clipboard_data!: string

    update(data: DataTransfer) {
        this.#clipboard_data = getClipboardHtml(data)
    }

    get current() {
        return this.#clipboard_data
    }
}

export const contentManager = new ContentManager()