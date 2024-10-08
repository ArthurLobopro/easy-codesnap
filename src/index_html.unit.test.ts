import * as fs from "node:fs";
import * as path from "node:path";
import { describe, expect, it } from "@jest/globals";
import { JSDOM } from "jsdom";

import * as l10n_br from "../l10n/bundle.l10n.pt-br.json";

const from_ts = [
    // ButtonsUpdater.ts
    "Unlock changes",
    "Lock changes",
    "Broken editor conection",
    "Connect to editor",

    // PanelController.ts
    `Easy CodeSnap 📸: Unknown internal action "{type}"`,

    // SnapActions.ts
    "Image copied to clipboard!",
    "Settings saved as default!",

    // savers.ts
    "Image saved on: {0}",

    // import json.default.key...
    "default",
] as const;

describe("check index.html", () => {
    it("check all key has translate", async () => {
        expect.hasAssertions();

        const fsPath: string = path.normalize(
            `${__dirname}/../webview/index.html`,
        );
        console.warn(fsPath);
        const file_str = fs.readFileSync(fsPath, "utf8");

        const { window } = new JSDOM(file_str);
        const { document } = window;

        // Because of the context, no existing functions are introduced
        function $$<T extends HTMLElement>(
            q: string,
            c: Element = document as any,
        ) {
            return Array.from(c.querySelectorAll(q)) as T[];
        }

        const html_data = $$("[data-l10n]")
            .map((el) => el.dataset.l10n ?? "")
            .filter((str) => str !== "");

        const all: string[] = [...new Set([...html_data, ...from_ts])].sort();

        const br_arr: string[] = [...Object.keys(l10n_br)].sort();
        // console.warn(br_arr.includes("default"));

        expect(all).toStrictEqual(br_arr);
    });
});
