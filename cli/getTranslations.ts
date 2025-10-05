import fs from "node:fs";
import path, { resolve } from "node:path";
import { root } from "./constants";
import { getPercent, listFiles } from "./util";

const targetDir = resolve(root, "src");
const fileExtensions = [".ts", ".tsx"];
const targetRegex = /\bt\s*\(\s*(?:"((?:[^"\\]|\\.)*)"|`((?:[^`\\]|\\.)*)`)/g;
const inTernaryTargetRegex =
  /\bt\s*\(\s*[^?:]*\?\s*(?:"((?:[^"\\]|\\.)*)"|`((?:[^`\\]|\\.)*)`)\s*:\s*(?:"((?:[^"\\]|\\.)*)"|`((?:[^`\\]|\\.)*)`)/g;

function searchTranslationsCalls(files: string[]) {
  const results = [];

  for (const filePath of files) {
    const content = fs.readFileSync(filePath, "utf-8");
    let match = targetRegex.exec(content);
    while (match !== null) {
      results.push(match[1]);

      match = targetRegex.exec(content);
    }

    match = inTernaryTargetRegex.exec(content);
    while (match !== null) {
      const trueValue = match[1] || match[2];
      const falseValue = match[3] || match[4];
      results.push(trueValue, falseValue);

      match = inTernaryTargetRegex.exec(content);
    }
  }

  return results;
}

const translateStrings = searchTranslationsCalls(listFiles(targetDir, fileExtensions)).filter((str) => str);

/**
 *  @param {{[key: string] : string}} obj
 * @param {string} filename
 */
function getTranslationStatus(obj: Record<string, string>, filename: string) {
  const detachedKeys = [];
  const missingKeys = [];
  const ObjKeys = Object.keys(obj);

  for (const str of translateStrings) {
    if (!(str in obj)) {
      missingKeys.push(str);
    }
  }

  for (const key of ObjKeys) {
    if (!translateStrings.includes(key)) {
      detachedKeys.push(key);
    }
  }

  return {
    code: filename.split(".").at(-2) as string,
    coverage: getPercent(translateStrings.length, translateStrings.length - missingKeys.length),
    missingKeys,
    detachedKeys,
  };
}

export function getAllTranslationStatus() {
  const TRANSLATIONS_FOLDER = path.resolve(__dirname, "../l10n");
  const JSONTranslationFiles = fs
    .readdirSync(TRANSLATIONS_FOLDER, { withFileTypes: true })
    .filter((file) => file.isFile())
    .map((file) => `${file.parentPath}/${file.name}`);

  return JSONTranslationFiles.map((filePath) => {
    return getTranslationStatus(require(filePath), path.basename(filePath));
  }).sort((v1, v2) => v2.coverage - v1.coverage);
}
