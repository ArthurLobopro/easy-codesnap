import { readFileSync } from "node:fs";
import { pick } from "@arthur-lobo/object-pick";
import { packagePath } from "../constants";
import { saveToJson } from "../util";

type Properties = {
  [key: string]: {
    scope: string;
    type: string;
    default: string;
    minimum?: number;
    maximum?: number;
    properties?: object;
    enum?: string[];
    markdownEnumDescriptions?: string[];
    markdownDescription: string;
    order: number;
  };
};

export function SortOrder() {
  const packageContent = JSON.parse(readFileSync(packagePath, "utf-8"));

  const properties = packageContent.contributes.configuration.properties as Properties;

  Object.entries(properties).forEach(([key, value], index) => {
    type key = keyof typeof properties;
    properties[key as key] = {
      ...pick(value, [
        "scope",
        "type",
        "enum",
        "minimum",
        "maximum",
        "properties",
        "default",
        "markdownDescription",
        "markdownEnumDescriptions",
      ]),
      order: index + 1,
    };
  });

  saveToJson(packageContent, packagePath);
}
