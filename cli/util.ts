import { writeFileSync } from "node:fs";

export function saveToJson(object: Record<string, any>, path: string) {
  writeFileSync(path, `${JSON.stringify(object, null, 2)}\n`, "utf-8");
}
