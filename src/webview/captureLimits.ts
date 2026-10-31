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
