import { readdirSync } from "node:fs";
import { resolve } from "node:path";

export const root = resolve(__dirname, "..");
export const packagePath = resolve(root, "package.json");

export const nls_json_files = readdirSync(root, { withFileTypes: true })
  .filter((f) => f.isFile() && /(package.nls.([\w-]+).json)$/g.test(f.name))
  .map((f) => resolve(f.parentPath, f.name));

export const PICK_NLS_KEYS_REGEX = /%(.+?)%/g;
