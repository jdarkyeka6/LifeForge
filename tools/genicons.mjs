/* ============================================================
   genicons.mjs — generates the LifeForge PWA app icons.
   Pure Node (zlib only), no external deps. Run:  node tools/genicons.mjs
   Produces full-bleed (maskable-safe) PNGs: the brand "L" in
   signature green on the app's dark gradient.
   ============================================================ */
import { deflateSync } from "node:zlib";
import { writeFileSync, mkdirSync } from "node:fs";

const CRC = (() => {
  const t = new Uint32Array(256);
  for (let n = 0; n < 256; n++) {
    let c = n;
    for (let k = 0; k < 8; k++) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
    t[n] = c >>> 0;
  }
  return (buf) => {
    let c = 0xffffffff;
    for (let i = 0; i < buf.length; i++) c = t[(c ^ buf[i]) & 0xff] ^ (c >>> 8);
    return (c ^ 0xffffffff) >>> 0;
  };
})();

function chunk(type, data) {
  const len = Buffer.alloc(4);
  len.writeUInt32BE(data.length, 0);
  const td = Buffer.concat([Buffer.from(type, "ascii"), data]);
  const crc = Buffer.alloc(4);
  crc.writeUInt32BE(CRC(td), 0);
  return Buffer.concat([len, td, crc]);
}

function lerp(a, b, t) { return Math.round(a + (b - a) * t); }

function drawIcon(size) {
  const px = Buffer.alloc(size * size * 4);
  const set = (x, y, r, g, b) => {
    const i = (y * size + x) * 4;
    px[i] = r; px[i + 1] = g; px[i + 2] = b; px[i + 3] = 255;
  };
  // background: vertical gradient #20303f -> #0e1116 (matches app radial bg)
  for (let y = 0; y < size; y++) {
    const t = y / (size - 1);
    const r = lerp(0x20, 0x0e, t), g = lerp(0x30, 0x11, t), b = lerp(0x3f, 0x16, t);
    for (let x = 0; x < size; x++) set(x, y, r, g, b);
  }
  // brand "L" in signature green #2ec27e, inside maskable safe zone
  const GR = [0x2e, 0xc2, 0x7e];
  const inRect = (x, y, x0, x1, y0, y1) =>
    x >= x0 * size && x < x1 * size && y >= y0 * size && y < y1 * size;
  for (let y = 0; y < size; y++)
    for (let x = 0; x < size; x++)
      if (inRect(x, y, 0.37, 0.47, 0.30, 0.72) || inRect(x, y, 0.37, 0.67, 0.63, 0.72))
        set(x, y, GR[0], GR[1], GR[2]);
  // raw scanlines with filter byte 0
  const raw = Buffer.alloc(size * (size * 4 + 1));
  for (let y = 0; y < size; y++) {
    raw[y * (size * 4 + 1)] = 0;
    px.copy(raw, y * (size * 4 + 1) + 1, y * size * 4, (y + 1) * size * 4);
  }
  const ihdr = Buffer.alloc(13);
  ihdr.writeUInt32BE(size, 0); ihdr.writeUInt32BE(size, 4);
  ihdr[8] = 8; ihdr[9] = 6; // 8-bit, RGBA
  return Buffer.concat([
    Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]),
    chunk("IHDR", ihdr),
    chunk("IDAT", deflateSync(raw, { level: 9 })),
    chunk("IEND", Buffer.alloc(0)),
  ]);
}

mkdirSync(new URL("../assets/", import.meta.url), { recursive: true });
for (const s of [192, 512]) {
  const out = new URL(`../assets/icon-${s}.png`, import.meta.url);
  writeFileSync(out, drawIcon(s));
  console.log(`wrote assets/icon-${s}.png`);
}
