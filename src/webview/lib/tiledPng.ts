const PNG_SIGNATURE = Uint8Array.of(137, 80, 78, 71, 13, 10, 26, 10);
const TILE_WIDTH = 4096;
const MAX_BAND_HEIGHT = 1024;
const TARGET_BAND_BYTES = 16 * 1024 * 1024;

const crcTable = new Uint32Array(256);
for (let i = 0; i < crcTable.length; i++) {
  let value = i;
  for (let bit = 0; bit < 8; bit++) value = value & 1 ? 0xedb88320 ^ (value >>> 1) : value >>> 1;
  crcTable[i] = value >>> 0;
}

function appendChunk(parts: BlobPart[], type: string, data: Uint8Array<ArrayBuffer>) {
  const header = new Uint8Array(8);
  new DataView(header.buffer).setUint32(0, data.length);
  for (let i = 0; i < 4; i++) header[i + 4] = type.charCodeAt(i);

  let crc = 0xffffffff;
  for (let i = 4; i < header.length; i++) crc = crcTable[(crc ^ header[i]) & 0xff] ^ (crc >>> 8);
  for (const byte of data) crc = crcTable[(crc ^ byte) & 0xff] ^ (crc >>> 8);
  const checksum = new Uint8Array(4);
  new DataView(checksum.buffer).setUint32(0, (crc ^ 0xffffffff) >>> 0);
  parts.push(header, data, checksum);
}

type PaintTile = (context: CanvasRenderingContext2D, x: number, y: number) => void;

/** Render a complete PNG using small canvas tiles and bounded scanline buffers. */
export async function renderTiledPng(width: number, height: number, paint: PaintTile): Promise<Blob> {
  const stride = width * 4 + 1;
  const bandHeight = Math.max(1, Math.min(MAX_BAND_HEIGHT, Math.floor(TARGET_BAND_BYTES / stride)));
  const canvas = document.createElement("canvas");
  const context = canvas.getContext("2d", { willReadFrequently: true });
  if (!context) throw new Error("Could not create a canvas for the screenshot");

  const parts: BlobPart[] = [PNG_SIGNATURE];
  const imageHeader = new Uint8Array(13);
  const view = new DataView(imageHeader.buffer);
  view.setUint32(0, width);
  view.setUint32(4, height);
  imageHeader[8] = 8; // bit depth
  imageHeader[9] = 6; // RGBA
  appendChunk(parts, "IHDR", imageHeader);

  const stream = new CompressionStream("deflate");
  const writer = stream.writable.getWriter();
  const reader = stream.readable.getReader();
  const collect = (async () => {
    while (true) {
      const { value, done } = await reader.read();
      if (done) break;
      if (value.length) appendChunk(parts, "IDAT", value);
    }
  })();
  void collect.catch(() => {});

  try {
    for (let y = 0; y < height; y += bandHeight) {
      const rows = Math.min(bandHeight, height - y);
      // The first byte of every row is filter type 0 (None).
      const band = new Uint8Array(stride * rows);
      for (let x = 0; x < width; x += TILE_WIDTH) {
        const tileWidth = Math.min(TILE_WIDTH, width - x);
        canvas.width = tileWidth;
        canvas.height = rows;
        paint(context, x, y);
        const pixels = context.getImageData(0, 0, tileWidth, rows).data;
        const tileStride = tileWidth * 4;
        for (let row = 0; row < rows; row++) {
          band.set(pixels.subarray(row * tileStride, (row + 1) * tileStride), row * stride + 1 + x * 4);
        }
      }
      await writer.write(band);
      // Allow the webview to paint and respond to input between bands.
      await new Promise<void>((resolve) => setTimeout(resolve, 0));
    }
    await writer.close();
    await collect;
  } catch (error) {
    await writer.abort(error).catch(() => {});
    await collect.catch(() => {});
    throw error;
  } finally {
    canvas.width = 0;
    canvas.height = 0;
  }

  appendChunk(parts, "IEND", new Uint8Array(0));
  return new Blob(parts, { type: "image/png" });
}
