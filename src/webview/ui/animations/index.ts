import { once, redraw } from "@/util";
import { flashFx, shutterAnimationContainer } from "../elements";
import { useSessionConfig } from "@/SessionConfig";

async function blinkAnimation() {
    flashFx.style.display = "block";
    redraw(flashFx);
    flashFx.style.opacity = "0";

    await once(flashFx, "transitionend");
    flashFx.style.display = "none";
    flashFx.style.opacity = "1";

}

async function shutterAnimation() {
    shutterAnimationContainer.setAttribute("data-animation-state", "animating");
    await once(shutterAnimationContainer, "animationend");
    shutterAnimationContainer.setAttribute("data-animation-state", "none");
}

export async function cameraFlashAnimation() {
    const action = useSessionConfig.getState().shutterActionAnimation;

    if (action === "flash") {
        await blinkAnimation();
        return;
    }

    await shutterAnimation();
}