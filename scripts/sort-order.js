//@ts-check
const { writeFileSync } = require("fs");
const { resolve } = require("path");

const package = require("../package.json");
const { omit } = require("@arthur-lobo/object-pick");

const properties = package.contributes.configuration.properties;

Object.entries(properties).forEach(([key, value], index) => {
    properties[key] = {
        ...omit(value, ["order"]),
        order: index + 1
    };
});

writeFileSync(resolve(__dirname, "../package.json"), JSON.stringify(package, null, 2));