import { homedir, platform } from "node:os";
import path from "node:path";
import * as vscode from "vscode";
import { t, writeFile } from "../../util";

const isWin = platform() === "win32";
const makeUri = isWin ? vscode.Uri.file : vscode.Uri.parse;
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
        t("Image saved on: {0}", uri.fsPath),
      );
    });
  }
}

export async function saveSVG(data: string) {
  const uri = await getSaveUri("svg");

  assignLastUsedImageUri(uri);

  if (uri) {
    writeFile(uri.fsPath, data, "utf-8");
  }
}
