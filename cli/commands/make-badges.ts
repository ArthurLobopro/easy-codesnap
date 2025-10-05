import fs from "node:fs";
import path from "node:path";
import { makeBadge } from "badge-maker";
import sharp from "sharp";
import { getAllTranslationStatus } from "../../scripts/getTranslations.ts";

export async function main() {
  function fromTo(from: string, to: string) {
    sharp(Buffer.from(from, "utf8")).png().toFile(to);
  }

  const svgs_dir = path.join(__dirname, "../.github/readme-assets");
  const output_dir = path.join(__dirname, "../badges");

  function toBase64(svg: string) {
    const base64 = Buffer.from(svg).toString("base64");

    return `data:image/svg+xml;base64,${base64}`;
  }

  const svgs = {
    vscode: toBase64(fs.readFileSync(path.resolve(svgs_dir, "vscode.svg"), "utf8")),
    openVsx: toBase64(fs.readFileSync(path.resolve(svgs_dir, "open-vsx.svg"), "utf8")),
    "pt-br": toBase64(fs.readFileSync(path.resolve(svgs_dir, "flags", "br.svg"), "utf-8")),
    "zh-tw": toBase64(fs.readFileSync(path.resolve(svgs_dir, "flags", "tw.svg"), "utf-8")),
    "zh-cn": toBase64(fs.readFileSync(path.resolve(svgs_dir, "flags", "cn.svg"), "utf-8")),
    ja: toBase64(fs.readFileSync(path.resolve(svgs_dir, "flags", "ja.svg"), "utf-8")),
    de: toBase64(fs.readFileSync(path.resolve(svgs_dir, "flags", "de.svg"), "utf-8")),
    us: toBase64(fs.readFileSync(path.resolve(svgs_dir, "flags", "us.svg"), "utf-8")),
  };

  function convertDownloadCount(downloadCount: number) {
    const precision = downloadCount > 10000 ? 3 : 2;

    return `${(downloadCount / 1000).toPrecision(precision)}k`;
  }

  async function makeOpenVsxBadges() {
    //@ts-ignore
    const { version, downloadCount } = await fetch("https://open-vsx.org/api/ArthurLobo/easy-codesnap").then((res) =>
      res.json(),
    );

    const versionBadge = makeBadge({
      label: "Open VSX Registry",
      message: `v${version}`,
      color: "blue",
      style: "flat",
      logoBase64: svgs.openVsx,
    });

    const downloadBadge = makeBadge({
      label: "Downloads",
      message: convertDownloadCount(downloadCount),
      color: "blue",
      style: "flat",
      logoBase64: svgs.openVsx,
    });

    fromTo(versionBadge, path.join(output_dir, "open-vsx-version.png"));
    fromTo(downloadBadge, path.join(output_dir, "open-vsx-downloads.png"));
  }

  async function makeVscodeBadges() {
    const query = {
      filters: [
        {
          criteria: [{ filterType: 7, value: "ArthurLobo.easy-codesnap" }],
          pageNumber: 1,
          pageSize: 1,
          sortBy: 0,
          sortOrder: 0,
        },
      ],
      flags: 914,
    };

    const { installs, version } = (await fetch(
      "https://marketplace.visualstudio.com/_apis/public/gallery/extensionquery",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json;api-version=3.0-preview.1",
        },
        body: JSON.stringify(query),
      },
    )
      .then((res) => res.json())
      .then((data) => {
        //@ts-ignore
        const ext = data.results[0].extensions[0]!;

        return {
          //@ts-ignore
          installs: ext.statistics.find((s) => s.statisticName === "install")?.value,
          version: ext.versions[0].version,
        };
      })
      .catch(console.error)) as { installs: number; version: string };

    const versionBadge = makeBadge({
      label: "Visual Studio Marketplace",
      message: `v${version}`,
      color: "blue",
      style: "flat",
      logoBase64: svgs.vscode,
    });

    const downloadBadge = makeBadge({
      label: "Downloads",
      message: convertDownloadCount(installs),
      color: "blue",
      style: "flat",
      logoBase64: svgs.vscode,
    });

    fromTo(versionBadge, path.join(output_dir, "vscode-version.png"));
    fromTo(downloadBadge, path.join(output_dir, "vscode-downloads.png"));
  }

  function makeTranslationBadges() {
    const translationStatus = getAllTranslationStatus();

    const languageStrings = {
      "pt-br": "Brasilian Portuguese (pt-BR)",
      ja: "Japanese (ja)",
      de: "German (de)",
      "zh-cn": "Chinese Mandarim (zh-CN)",
      "zh-tw": "Taiwanese Mandarin (zh-TW)",
    } as const;

    for (const status of translationStatus) {
      if (status.code in languageStrings) {
        const badge = makeBadge({
          //@ts-ignore
          label: languageStrings[status.code],
          message: `${toPercent(status.coverage)}%`,
          style: "flat",
          color: status.coverage === 100 ? "green" : "blue",
          //@ts-ignore
          ...(svgs[status.code] ? { logoBase64: svgs[status.code] } : {}),
        });

        fromTo(badge, path.resolve(output_dir, `./${status.code}.png`));
      }
    }

    const defaultBadge = makeBadge({
      label: "English (en-US)",
      color: "green",
      style: "flat",
      message: "100% (default)",
      logoBase64: svgs.us,
    });

    fromTo(defaultBadge, path.resolve(output_dir, "./en-us.png"));
  }

  function toPercent(n: number) {
    const withDecimal = Number(n.toFixed(2));
    const withoutDecimal = Number(n.toFixed(0));

    return withDecimal > withoutDecimal ? withDecimal : withoutDecimal;
  }

  if (!fs.existsSync(output_dir)) {
    fs.mkdirSync(output_dir, { recursive: true });
  }

  await makeOpenVsxBadges();
  await makeVscodeBadges();
  makeTranslationBadges();
}
