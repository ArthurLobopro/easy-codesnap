import { $ } from "../../util";

export function addHideOneTimeConfigListener() {
    const oneTimeConfigDetails = $<HTMLDetailsElement>("#one-time-config");

    const detailsContent = $("ul", oneTimeConfigDetails);

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
}
