const fs = require('fs');
const path = require('path');

const targetDir = './src';
const fileExtensions = ['.ts', '.tsx'];
const targetRegex = /\bt\s*\(\s*(?:"((?:[^"\\]|\\.)*)"|`((?:[^`\\]|\\.)*)`)/g;
const inTernaryTargetRegex = /\bt\s*\(\s*[^?:]*\?\s*(?:"((?:[^"\\]|\\.)*)"|`((?:[^`\\]|\\.)*)`)\s*:\s*(?:"((?:[^"\\]|\\.)*)"|`((?:[^`\\]|\\.)*)`)/g;

function listFiles(dirname) {
    let files = [];

    const arquivos = fs.readdirSync(dirname);
    for (const nome of arquivos) {
        const caminhoCompleto = path.join(dirname, nome);
        const stat = fs.statSync(caminhoCompleto);

        if (stat.isDirectory()) {
            files = files.concat(listFiles(caminhoCompleto));
        } else if (stat.isFile() && fileExtensions.includes(path.extname(caminhoCompleto))) {
            files.push(caminhoCompleto);
        }
    }

    return files;
}

function searchTranslationsCalls(files) {
    const results = [];

    for (const filePath of files) {
        const content = fs.readFileSync(filePath, 'utf-8');
        let match;
        while ((match = targetRegex.exec(content)) !== null) {
            results.push(match[1]);
        }
        while ((match = inTernaryTargetRegex.exec(content)) !== null) {
            const verdadeira = match[1] || match[2];
            const falsa = match[3] || match[4];
            results.push(verdadeira, falsa);
        }
    }

    return results;
}

const translateStrings = searchTranslationsCalls(listFiles(targetDir), targetRegex).filter(str => str);
// console.log('Strings encontradas em t() com aspas duplas:', translateStrings);

const getPercent = (total, x) => (x * 100 / total);

/**
 *  @param {{[key: string] : string}} obj
 * @param {string} filename
 */
function getTranslationStatus(obj, filename) {
    const detachedKeys = [];
    const missingKeys = [];
    const ObjKeys = Object.keys(obj);

    for (const str of translateStrings) {
        if (!(str in obj)) {
            missingKeys.push(str);
        }
    }

    for (const key of ObjKeys) {
        if (!translateStrings.includes(key)) {
            detachedKeys.push(key);
        }
    }


    return {
        missingKeys,
        detachedKeys,
        code: filename.split(".").at(-2),
        coverage: getPercent(translateStrings.length, translateStrings.length - missingKeys.length)
    };

}

const TRANSLATIONS_FOLDER = path.resolve(__dirname, "../l10n");
const JSONTranslationFiles = fs.readdirSync(TRANSLATIONS_FOLDER, { withFileTypes: true }).filter(file => file.isFile()).map(file => `${file.parentPath}/${file.name}`);

const translationStatus = JSONTranslationFiles.map(filePath => {
    return getTranslationStatus(require(filePath), path.basename(filePath));
}).sort((v1, v2) => v2.coverage - v1.coverage);

console.log("Translation Status");
console.log(translationStatus);


const writeStream = fs.createWriteStream(path.resolve(__dirname, "../TranslationStatus.md"));

writeStream.write(["# Coverage Languages\n\n", "Language | Coverage", "--- | ---\n"].join("\n"));
translationStatus.forEach(status => {

    const content = [`${status.code} | ${status.coverage.toFixed(2)}%\n`];

    writeStream.write(content.join("\n"));
});

writeStream.write([
    "\n\n",
    "# Missing Strings\n"
].join("\n"));

translationStatus.forEach(status => {
    if (status.missingKeys.length) {

        writeStream.write([
            "<details>",
            `<summary>${status.code}</summary>\n`,
            status.missingKeys.map(key => `<li>"${key}"</li>`).join("\n"),
            "</details>",
            "\n"
        ].join("\n"));

    }
});

writeStream.close();
