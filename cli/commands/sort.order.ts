import { readFileSync, writeFileSync } from "node:fs";
import { omit } from "@arthur-lobo/object-pick";
import type { contributes } from "../../package.json";
import { packagePath } from "../constants";

export function SortOrder() {
  const packageContent = JSON.parse(readFileSync(packagePath, "utf-8"));

  const properties = packageContent.contributes.configuration
    .properties as (typeof contributes)["configuration"]["properties"];

  Object.entries(properties).forEach(([key, value], index) => {
    type key = keyof typeof properties;
    properties[key as key] = {
      ...omit(value, ["order"]),
      //@ts-expect-error New settings without "order" will have a type never and will throw type errors, but it is expected
      order: index + 1,
    };
  });

  writeFileSync(packagePath, JSON.stringify(packageContent, null, 2));
}
