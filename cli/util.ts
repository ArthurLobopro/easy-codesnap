/** biome-ignore-all lint/performance/noAccumulatingSpread: spread needed */
import { readdirSync, writeFileSync } from "node:fs";
import { extname, resolve } from "node:path";

export function saveToJson(object: Record<string, any>, path: string) {
  writeFileSync(path, `${JSON.stringify(object, null, 2)}\n`, "utf-8");
}

export const getPercent = (total: number, x: number) => (x * 100) / total;

export function listFiles(dirname: string, fileExtensions: string[] = []): string[] {
  const files = readdirSync(dirname, { withFileTypes: true }).reduce((curr, next) => {
    const nextPath = resolve(next.parentPath, next.name);

    if (next.isFile()) {
      if (fileExtensions.length && fileExtensions.includes(extname(nextPath))) {
        return [...curr, nextPath];
      }

      return curr;
    }

    return [...curr, ...listFiles(nextPath, fileExtensions)];
  }, [] as string[]);

  return files;
}
