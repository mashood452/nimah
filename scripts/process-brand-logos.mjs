/**
 * Prepares brand logos for the "Brands we carry" bar.
 *
 *   node scripts/process-brand-logos.mjs
 *
 * Reads the original logo files from docs/brand-logos-original/ (opaque images on a white background) and writes
 * tight, transparent PNGs to public/images/brands/:
 *   1. white background becomes transparent (the artwork keeps its real colour)
 *   2. near-white haze from compression or off-white backdrops is removed
 *   3. empty margins are trimmed, so every logo can be sized by its artwork alone
 *
 * To add a brand: drop the original in docs/brand-logos-original/, run this, then add it to
 * src/components/brands/brands-data.ts using the width and height this script prints.
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";

const root = path.join(path.dirname(fileURLToPath(import.meta.url)), "..");
const SRC = path.join(root, "docs", "brand-logos-original");
const OUT = path.join(root, "public", "images", "brands");
const HAZE = 26; // 0-255: anything fainter than this is treated as background

(async () => {
  for (const file of fs.readdirSync(SRC).filter((n) => /\.(png|jpe?g|webp)$/i.test(n))) {
    const { data, info } = await sharp(path.join(SRC, file)).ensureAlpha().raw().toBuffer({ resolveWithObject: true });
    const { width: W, height: H } = info;

    for (let i = 0; i < data.length; i += 4) {
      const strength = 255 - Math.min(data[i], data[i + 1], data[i + 2]); // how far from white
      if (strength <= HAZE) {
        data[i + 3] = 0;
        continue;
      }
      // colour-to-alpha: recover the true ink colour, then fade the soft edge in above the haze level
      for (let c = 0; c < 3; c++) {
        data[i + c] = Math.max(0, Math.min(255, Math.round(255 - ((255 - data[i + c]) * 255) / strength)));
      }
      data[i + 3] = Math.min(255, Math.round(((strength - HAZE) * 255) / (255 - HAZE)));
    }

    let x0 = W, y0 = H, x1 = -1, y1 = -1;
    for (let y = 0; y < H; y++) {
      for (let x = 0; x < W; x++) {
        if (data[(y * W + x) * 4 + 3] > 40) {
          if (x < x0) x0 = x;
          if (x > x1) x1 = x;
          if (y < y0) y0 = y;
          if (y > y1) y1 = y;
        }
      }
    }
    const pad = 2;
    x0 = Math.max(0, x0 - pad);
    y0 = Math.max(0, y0 - pad);
    x1 = Math.min(W - 1, x1 + pad);
    y1 = Math.min(H - 1, y1 + pad);
    const w = x1 - x0 + 1;
    const h = y1 - y0 + 1;

    const name = file.replace(/\.(jpe?g|webp)$/i, ".png");
    await sharp(data, { raw: { width: W, height: H, channels: 4 } })
      .extract({ left: x0, top: y0, width: w, height: h })
      .png({ compressionLevel: 9 })
      .toFile(path.join(OUT, name));
    console.log(name.padEnd(22), `width: ${w}, height: ${h}`);
  }
})();
