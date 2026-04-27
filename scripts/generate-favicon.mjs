/**
 * Rasterize public/favicon.svg into a small public/favicon.png so legacy
 * clients (and OG / Slack / etc.) get a sensible bitmap fallback. Run
 * with `pnpm favicon` after editing the SVG.
 *
 * Output is 192×192 — large enough for high-DPI tabs, tiny enough that
 * gzipped PNG stays well under 5 KB.
 */
import sharp from 'sharp';
import { readFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { dirname, resolve } from 'node:path';

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = resolve(__dirname, '..');
const svgPath = resolve(root, 'public/favicon.svg');
const outPath = resolve(root, 'public/favicon.png');

const svg = await readFile(svgPath);
await sharp(svg, { density: 384 })
  .resize(192, 192)
  .png()
  .toFile(outPath);

console.log(`Generated ${outPath}`);
