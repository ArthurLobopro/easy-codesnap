//@ts-check

const { makeBadge } = require("badge-maker")
const fs = require("fs")
const path = require("path")

const svgs_dir = path.join(__dirname, "../.github/readme-assets")
const output_dir = path.join(__dirname, "../badges")

/**
 * @param {string} svg
 */
function toBase64(svg) {
    const base64 = Buffer.from(svg).toString('base64')

    return `data:image/svg+xml;base64,${base64}`
}

const svgs = {
    vscode: toBase64(fs.readFileSync(path.resolve(svgs_dir, "vscode.svg"), "utf8")),
    openVsx: toBase64(fs.readFileSync(path.resolve(svgs_dir, "open-vsx.svg"), "utf8")),
}

async function makeOpenVsxBadges() {
    //@ts-ignore
    const { version, downloadCount } = await fetch("https://open-vsx.org/api/ArthurLobo/easy-codesnap")
        .then(res => res.json())

    const versionBadge = makeBadge({
        label: "Open VSX Version",
        message: `v${version}`,
        color: "blue",
        style: "flat",
        logoBase64: svgs.openVsx,
    })

    const downloadBadge = makeBadge({
        label: "Open VSX Downloads",
        message: `${(downloadCount / 1000).toPrecision(2)}k`,
        color: "blue",
        style: "flat",
        logoBase64: svgs.openVsx,
    })

    fs.writeFileSync(path.join(output_dir, "open-vsx-version.svg"), versionBadge)
    fs.writeFileSync(path.join(output_dir, "open-vsx-downloads.svg"), downloadBadge)
}

async function makeVscodeBadges() {
    const query = {
        filters: [{
            criteria: [
                { filterType: 7, value: "ArthurLobo.easy-codesnap" }
            ],
            pageNumber: 1,
            pageSize: 1,
            sortBy: 0,
            sortOrder: 0,
        }],
        flags: 914
    }

    const { installs, version } = await fetch("https://marketplace.visualstudio.com/_apis/public/gallery/extensionquery", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Accept": "application/json;api-version=3.0-preview.1",
        },
        body: JSON.stringify(query),
    })
        .then(res => res.json())
        .then(data => {
            const ext = data.results[0].extensions[0]
            //console.log(ext)

            return {
                installs: ext.statistics.find(s => s.statisticName === "install")?.value,
                version: ext.versions[0].version,
            }
        })
        .catch(console.error)

    const versionBadge = makeBadge({
        label: "Visual Studio Marketplace",
        message: `v${version}`,
        color: "blue",
        style: "flat",
        logoBase64: svgs.vscode,
    })

    const downloadBadge = makeBadge({
        label: "Visual Studio Marketplace Downloads",
        message: `${(installs / 1000).toPrecision(2)}k`,
        color: "blue",
        style: "flat",
        logoBase64: svgs.vscode,
    })

    fs.writeFileSync(path.join(output_dir, "vscode-version.svg"), versionBadge)
    fs.writeFileSync(path.join(output_dir, "vscode-downloads.svg"), downloadBadge)
}

async function main() {
    if (!fs.existsSync(output_dir)) {
        fs.mkdirSync(output_dir, { recursive: true })
    }

    await makeOpenVsxBadges()
    await makeVscodeBadges()
}

main()