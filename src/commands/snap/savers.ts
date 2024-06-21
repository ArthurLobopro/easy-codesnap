import { homedir , platform} from "os";
import path from "path";
import * as vscode from "vscode";
import { reduceSVG } from "../../reduceSVG";
import { writeFile } from "../../util";

const isWin = (platform() === 'win32');
const makeUri = isWin
    ?vscode.Uri.file;
    :vscode.Uri.parse;
const uriPath = (uri: vscode.Uri) => uri.fsPath;

let lastUsedImageUri = makeUri(path.resolve(homedir(), "Desktop"));

function assignLastUsedImageUri(uri: vscode.Uri | undefined) {
    lastUsedImageUri =
        uri ??
        makeUri(
            uriPath(lastUsedImageUri).replace(
                path.dirname(uriPath(lastUsedImageUri)),
                "",
            ),
        );
}

async function getSaveUri(format: "png" | "svg") {
    return await vscode.window.showSaveDialog({
        filters: { Images: [format] },
        defaultUri: makeUri(
            path.resolve(uriPath(lastUsedImageUri), `code.${format}`),
        ),
    });
}

export async function savePNG(data: string) {
    const uri = await getSaveUri("png");

    assignLastUsedImageUri(uri);

    if (uri) {
        writeFile(uri.fsPath, Buffer.from(data, "base64")).then(() => {
            vscode.window.showInformationMessage(
                `Image saved on: ${uri.fsPath}`,
            );
        });
    }
}

export async function saveSVG(data: string) {
    const uri = await getSaveUri("svg");

    assignLastUsedImageUri(uri);

    const reducedData = reduceSVG(data);

    if (uri) {
        writeFile(uri.fsPath, reducedData, "utf-8");
    }
}
