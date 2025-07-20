import { px } from "@/util";
import { sample } from "../elements";

export function HideSample() {
  sample.style.top = px(0);
  sample.style.left = px(0);
  sample.style.width = px(0);
  sample.style.height = px(0);
  sample.style.boxShadow = "none";
  sample.style.borderRadius = px(0);
}

export function TargetSample(target: HTMLElement) {
  const { width, height, top, left } = target.getBoundingClientRect();

  sample.style.position = "absolute";
  sample.style.top = px(top);
  sample.style.left = px(left);
  sample.style.width = px(width);
  sample.style.height = px(height);
  sample.style.boxShadow = "0 0 0 9999px rgba(0,0,0,0.8)";
  sample.style.borderRadius = window.getComputedStyle(target).borderRadius;
}
