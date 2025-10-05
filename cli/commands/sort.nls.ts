import { readFileSync } from "node:fs";
import mirror from "../../package.nls.json";
import { nls_json_files } from "../constants";
import { saveToJson } from "../util";

export function SortNls() {
  nls_json_files.forEach((filePath) => {
    const content = JSON.parse(readFileSync(filePath, { encoding: "utf-8" }));
    const newContent = {} as Record<string, string>;

    const keys = Object.keys(mirror);
    for (const key of keys) {
      newContent[key] = content[key];
    }

    saveToJson(newContent, filePath);
  });
}
