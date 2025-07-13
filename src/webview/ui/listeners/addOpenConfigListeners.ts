import { $$, vscode } from "../../util";

export function addOpenConfigListeners() {
  $$("[data-openconfig]").forEach((el) => {
    el.addEventListener("click", () => {
      vscode.postMessage({
        type: "open-config",
        configName: el.dataset.openconfig as string,
      });
    });
  });
}
