const fs = require('fs');
const path = require('path');

const translationStatus = require("./getTranslations.js").getAllTranslationStatus();

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

    const content = [`${status.code in languageStrings ? languageStrings[status.code] : status.code} | ${status.coverage.toFixed(2)}%\n`];

    writeStream.write(content.join("\n"));
});

writeStream.close();