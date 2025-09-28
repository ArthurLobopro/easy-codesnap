const { writeFileSync } = require("fs");
const { resolve } = require("path");

const packageContent = require("../package.json");
const { omit } = require("@arthur-lobo/object-pick");

const properties = packageContent.contributes.configuration.properties;

Object.entries(properties).forEach(([key, value], index) => {
    properties[key] = {
        ...omit(value, ["order"]),
        order: index + 1
    };
});

writeFileSync(resolve(__dirname, "../package.json"), JSON.stringify(packageContent, null, 2));
