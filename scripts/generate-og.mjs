/**
 * Generate `public/og.png` — the social-preview image for the landing page.
 *
 * Renders an SVG (no external assets) and rasterizes it to 1200×630 PNG via
 * sharp. Run with `pnpm og` whenever you want to refresh the placeholder.
 *
 * Per-project case studies do not use this file — they generate their own
 * social previews from the project cover (see `src/pages/projects/[...slug].astro`).
 */

import sharp from 'sharp';
import { fileURLToPath } from 'node:url';
import { dirname, resolve } from 'node:path';

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = resolve(__dirname, '..');
const outPath = resolve(root, 'public/og.png');

const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630" viewBox="0 0 1200 630">
  <rect width="1200" height="630" fill="#11111b"/>

  <!-- subtle terminal chrome bar at the top -->
  <g transform="translate(40, 30)">
    <circle cx="12" cy="12" r="8" fill="#f38ba8"/>
    <circle cx="38" cy="12" r="8" fill="#f9e2af"/>
    <circle cx="64" cy="12" r="8" fill="#a6e3a1"/>
    <text x="100" y="17" font-family="ui-monospace, Menlo, monospace" font-size="16" fill="#7f849c">
      ~/bfmu/portfolio — main
    </text>
  </g>

  <!-- big name -->
  <text x="80" y="250" font-family="ui-monospace, Menlo, monospace" font-size="96" font-weight="700" fill="#cdd6f4">
    <tspan fill="#fab387">~/</tspan>bryan-muñoz
  </text>

  <!-- subtitle -->
  <text x="80" y="310" font-family="ui-monospace, Menlo, monospace" font-size="30" fill="#a6adc8">
    Software Developer · Bogotá, Colombia
  </text>

  <!-- terminal triplet -->
  <text x="80" y="420" font-family="ui-monospace, Menlo, monospace" font-size="22" fill="#bac2de">
    <tspan fill="#a6e3a1">bfmu</tspan><tspan fill="#7f849c">@</tspan><tspan fill="#cba6f7">portfolio</tspan>:<tspan fill="#89b4fa">~</tspan> <tspan fill="#fab387">$</tspan> whoami &amp;&amp; cat ./about.md
  </text>
  <text x="80" y="455" font-family="ui-monospace, Menlo, monospace" font-size="22" fill="#a6adc8">
    → Bryan Muñoz · Software Developer
  </text>
  <text x="80" y="490" font-family="ui-monospace, Menlo, monospace" font-size="22" fill="#a6adc8">
    <tspan fill="#a6e3a1">✓</tspan> open to work — let's build something
  </text>

  <!-- footer line -->
  <line x1="80" y1="555" x2="1120" y2="555" stroke="#313244" stroke-dasharray="4 4"/>
  <text x="80" y="585" font-family="ui-monospace, Menlo, monospace" font-size="18" fill="#cba6f7">
    bfmu.dev
  </text>
  <text x="1120" y="585" font-family="ui-monospace, Menlo, monospace" font-size="14" fill="#6c7086" text-anchor="end">
    portfolio v2 · IDE rewrite
  </text>
</svg>`;

await sharp(Buffer.from(svg)).png().toFile(outPath);
console.log(`Generated ${outPath}`);
