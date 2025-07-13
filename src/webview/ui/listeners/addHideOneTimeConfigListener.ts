import { $ } from "../../util";

export function addHideOneTimeConfigListener() {
  const oneTimeConfigDetails = $<HTMLDetailsElement>("#one-time-config");

  const detailsContent = $("nav", oneTimeConfigDetails);
  detailsContent.addEventListener("click", (event) => {
    //@ts-expect-error
    event.__detailsClick = true;
  });

  window.addEventListener("click", (event) => {
    //@ts-expect-error
    if (!event.__detailsClick && oneTimeConfigDetails.open) {
      oneTimeConfigDetails.open = false;
    }
  });

  const detailsSummary = $("summary", oneTimeConfigDetails);

  detailsSummary.addEventListener("click", (event) => {
    event.preventDefault();
    event.stopPropagation();
    oneTimeConfigDetails.open = !oneTimeConfigDetails.open;
  });
}
