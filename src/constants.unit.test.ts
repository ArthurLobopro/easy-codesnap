import { describe, expect, it } from "@jest/globals";
import { contributes } from "../package.json";
import { CodeSnapConfigNames, extensionSettingsNames } from "./constants";

describe("check constants", () => {
    it("check : package.json key is .EQ. extensionSettingsNames", () => {
        expect.hasAssertions();

        const ConfigNameList: string[] = Object.keys(
            contributes.configuration.properties,
        )
            .map((str: string) => str.replace("easy-codesnap.", ""))
            .map((str: string) => str.replace("aspect-ratio", "aspectRatio"))
            .sort();

        expect([...extensionSettingsNames].sort()).toStrictEqual(
            ConfigNameList,
        );
    });
});
