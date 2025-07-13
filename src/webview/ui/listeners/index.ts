import { SessionConfig } from "../../SessionConfig";
import { snippetContainerNode, windowNode } from "../elements";
import { UpdateRatio, UpdateTargetProportion } from "../updaters";
import { addContentEditableListeners } from "./addContentEditableListeners";

export function addListeners() {
  addContentEditableListeners();

  const resizeObserver = new ResizeObserver(() => {
    if (SessionConfig.get("aspectRatio") !== "none") {
      UpdateRatio();
    }

    UpdateTargetProportion();
    console.log("Resize");
  });

  resizeObserver.observe(snippetContainerNode);
  resizeObserver.observe(windowNode);
}
