import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { nls_json_files, PICK_NLS_KEYS_REGEX, root } from "../constants";
import { saveToJson } from "../util";

const mirror = readFileSync(resolve(root, "package.json"), { encoding: "utf-8" });

export function SortNls() {
  nls_json_files.forEach((filePath) => {
    const content = JSON.parse(readFileSync(filePath, { encoding: "utf-8" }));
    const newContent = {} as Record<string, string>;

    const keys = [];

    let match = PICK_NLS_KEYS_REGEX.exec(mirror);

    while (match !== null) {
      keys.push(match[1]);
      match = PICK_NLS_KEYS_REGEX.exec(mirror);
    }

    console.log(keys);

    for (const key of keys) {
      newContent[key] = content[key];
    }

    saveToJson(newContent, filePath);
  });
}
