// A canvas can require several simultaneous RGBA buffers while it is rendered
// and encoded. Keep its backing store below roughly 128 MiB per buffer.
export const MAX_CANVAS_PIXELS = 32_000_000;
export const MAX_CANVAS_DIMENSION = 32_767;

export interface RasterSize {
  width: number;
  height: number;
}

export function getRasterSize(target: HTMLElement, scale: number, includeBounds = true): RasterSize {
  const bounds = includeBounds ? target.getBoundingClientRect() : { width: 0, height: 0 };
  const style = getComputedStyle(target);
  const borderWidth =
    (Number.parseFloat(style.borderLeftWidth) || 0) + (Number.parseFloat(style.borderRightWidth) || 0);
  const borderHeight =
    (Number.parseFloat(style.borderTopWidth) || 0) + (Number.parseFloat(style.borderBottomWidth) || 0);

  // The primary exporter uses scroll dimensions; the fallback uses the
  // bounding rectangle and adds two pixels. Check the larger of the two.
  return {
    width: Math.ceil(Math.max(target.scrollWidth + borderWidth, bounds.width) * scale) + 2,
    height: Math.ceil(Math.max(target.scrollHeight + borderHeight, bounds.height) * scale) + 2,
  };
}

/**
 * Returns the scale to render with: the configured scale, reduced when needed so the
 * output width and height each stay within their own maximum (0 = no limit).
 * Aspect ratio is preserved, so the most restrictive dimension wins.
 */
export function getEffectiveScale(
  target: HTMLElement,
  scale: number,
  maxWidth: number,
  maxHeight: number,
  includeBounds = true,
): number {
  // Output size is ceil(size * scale) + 2, so the limit applies to the size minus the 2px padding.
  const base = getRasterSize(target, 1, includeBounds);
  const contentWidth = Math.max(base.width - 2, 1);
  const contentHeight = Math.max(base.height - 2, 1);

  let effective = scale;
  if (maxWidth > 0) effective = Math.min(effective, (maxWidth - 2) / contentWidth);
  if (maxHeight > 0) effective = Math.min(effective, (maxHeight - 2) / contentHeight);

  // Floor to avoid floating point overshoot past the limit.
  return Math.max(Math.floor(effective * 1e6) / 1e6, 0.001);
}

export function isRasterSizeSafe({ width, height }: RasterSize): boolean {
  return (
    Number.isFinite(width) &&
    Number.isFinite(height) &&
    width > 0 &&
    height > 0 &&
    width <= MAX_CANVAS_DIMENSION &&
    height <= MAX_CANVAS_DIMENSION &&
    width * height <= MAX_CANVAS_PIXELS
  );
}
