import fs from "node:fs";
import path from "node:path";
import { nls_json_files, root } from "../constants";

const red = (str: string) => `\x1b[31m${str}\x1b[0m`;
const green = (str: string) => `\x1b[32m${str}\x1b[0m`;

export function CompressJson() {
  const l10n_json_files = fs
    .readdirSync(path.resolve(root, "./l10n"), { withFileTypes: true })
    .filter((f) => f.isFile() && /json$/.test(f.name))
    .map((f) => path.resolve(f.parentPath, f.name));

  const packageJson = path.resolve(root, "package.json");

  const files = [packageJson, ...nls_json_files, ...l10n_json_files];

  files.forEach((file) => {
    try {
      process.stdout.write(`Compressing ${file}... `);
      const content = fs.readFileSync(file, { encoding: "utf-8" });
      const newContent = JSON.stringify(JSON.parse(content), null, 0);
      fs.writeFileSync(file, newContent);
      process.stdout.write(`${green("Done")}\n`);
    } catch (_error) {
      process.stdout.write(red("Error"));
    }
  });
}
