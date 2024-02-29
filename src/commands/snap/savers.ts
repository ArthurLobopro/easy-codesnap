import { homedir } from "os";
import path from "path";
import * as vscode from "vscode";
import { reduceSVG } from "../../reduceSVG";
import { writeFile } from "../../util";

const makeUri = vscode.Uri.parse;
const uriPath = (uri: vscode.Uri) => uri.fsPath;

let lastUsedImageUri = makeUri(path.resolve(homedir(), "Desktop"));

export async function savePNG(data: string) {
    const uri = await vscode.window.showSaveDialog({
        filters: { Images: ["png"] },
        defaultUri: makeUri(
            path.resolve(uriPath(lastUsedImageUri), "code.png"),
        ),
    });

    lastUsedImageUri =
        uri ??
        makeUri(
            uriPath(lastUsedImageUri).replace(
                path.dirname(uriPath(lastUsedImageUri)),
                "",
            ),
        );

    if (uri) {
        writeFile(uri.fsPath, Buffer.from(data, "base64")).then(() => {
            vscode.window.showInformationMessage(
                `Image saved on: ${uri.fsPath}`,
            );
        });
    }
}

export async function saveSVG(data: string) {
    const uri = await vscode.window.showSaveDialog({
        filters: { Images: ["svg"] },
        defaultUri: makeUri(
            path.resolve(uriPath(lastUsedImageUri), "code.svg"),
        ),
    });

    lastUsedImageUri =
        uri ??
        makeUri(
            uriPath(lastUsedImageUri).replace(
                path.dirname(uriPath(lastUsedImageUri)),
                "",
            ),
        );

    const reducedData = reduceSVG(data);

    if (uri) {
        writeFile(uri.fsPath, reducedData, "utf-8");
    }
}
