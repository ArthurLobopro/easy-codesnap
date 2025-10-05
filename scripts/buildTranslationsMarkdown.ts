import fs from "fs";
import path from "path";
import {getAllTranslationStatus} from "./getTranslations"

const translationStatus = getAllTranslationStatus();

const languageStrings = {
    "pt-br": "🇧🇷 Portuguese (pt-BR)",
    "ja": "🇯🇵 Japanese (ja)",
    "de": "🇩🇪 German (de)",
    "zh-cn": "🇨🇳 Chinese Mandarim (zh-CN)",
    "zh-tw": "🇹🇼 Taiwanese Mandarin (zh-TW)"
};

const writeStream = fs.createWriteStream(path.resolve(__dirname, "../TranslationStatus.md"));

writeStream.write(["# Coverage Languages\n\n", "Language | Coverage", "--- | ---\n"].join("\n"));
translationStatus.forEach(status => {

    type key = keyof typeof languageStrings

    const content = [`${status.code in languageStrings ? languageStrings[status.code as key] : status.code} | ${status.coverage.toFixed(2)}%\n`];

    writeStream.write(content.join("\n"));
});

writeStream.close();