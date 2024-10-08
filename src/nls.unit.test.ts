import { describe, expect, it } from "@jest/globals";
import { contributes } from "../package.json";
import * as nls_en from "../package.nls.json";
import * as nls_tw from "../package.nls.zh-tw.json";
import * as nls_pt_br from "../package.nls.pt-br.json";

import * as l10n_br from "../l10n/bundle.l10n.pt-br.json";
import * as l10n_tw from "../l10n/bundle.l10n.zh-tw.json";


describe("check nls", () => {
    it("check : package.nls.json", () => {
        expect.hasAssertions();

        const errList0: string[] = [];
        // const log: string[] = [];

        const nlsEn: ReadonlySet<string> = new Set(Object.keys(nls_en));
        const nlsTW: ReadonlySet<string> = new Set(Object.keys(nls_tw));
        const nlsBr: ReadonlySet<string> = new Set(Object.keys(nls_pt_br));

        function deepJson(obj: NonNullable<unknown>): void {
            for (const [_k, v] of Object.entries(obj)) {
                if (typeof v === "object" && v !== null) {
                    deepJson(v);
                }

                if (
                    typeof v === "string" &&
                    v.startsWith("%") &&
                    v.endsWith("%")
                ) {
                    const vv: string = v.replaceAll("%", "");

                    if (!nlsEn.has(vv)) {
                        // log.push(vv);
                        errList0.push(`nlsEn not found${vv}`);
                    }

                    if (!nlsTW.has(vv)) {
                        errList0.push(`nlsTW not found${vv}`);
                    }

                    if (!nlsBr.has(vv)) {
                        errList0.push(`nlsBr not found${vv}`);
                    }
                }
            }
        }

        deepJson(contributes.configuration.properties);

        for (const [k, v] of Object.entries(nls_en)) {
            // biome-ignore lint/suspicious/noControlCharactersInRegex: <explanation>
            if (/[^\u0000-\u007F]/u.test(v)) {
                errList0.push(`There is not en_char "${k}"`);
            }
        }

        expect(errList0).toHaveLength(0);
    });

    it("check : l10n-key", () => {
        expect.hasAssertions();

        const br_arr: string[] = Object.keys(l10n_br); // .sort();
        const tw_arr: string[] = Object.keys(l10n_tw); // .sort();
        expect(br_arr).toStrictEqual(tw_arr);
    });

    it("check : l10n-key-value", () => {
        expect.hasAssertions();

        function check_template(
            json: Record<string, string>,
            langName: string,
        ): readonly string[] {
            const errList0: string[] = [];

            for (const [k, v] of Object.entries(json)) {
                for (const ma of k.matchAll(/(\{.*\})/giu)) {
                    if (!v.includes(ma[1])) {
                        errList0.push(
                            `[${langName}] - key has '${ma[1]}' but value not find , key is '${k}'`,
                        );
                    }
                }
            }
            return errList0;
        }

        expect(check_template(l10n_br, "l10n.pt-br.json")).toStrictEqual([]);
        expect(check_template(l10n_tw, "l10n.zh-tw.json")).toStrictEqual([]);
    });
});
