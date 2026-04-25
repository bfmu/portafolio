/**
 * Hero terminal typewriter. Locates `[data-tw-target][data-tw-text]`,
 * clears it, and re-types the command character by character. After the
 * command finishes, fades in every `[data-tw-out]` element in DOM order.
 *
 * Honors `prefers-reduced-motion`: outputs become visible immediately
 * with no animation.
 */

const TYPE_SPEED_MS = 38;
const INITIAL_DELAY_MS = 250;
const POST_TYPE_GAP_MS = 220;
const OUT_FADE_GAP_MS = 380;

const sleep = (ms: number): Promise<void> =>
  new Promise((resolve) => setTimeout(resolve, ms));

export function setupHeroTypewriter(): void {
  if (typeof window === 'undefined') return;

  const target = document.querySelector<HTMLElement>('[data-tw-target]');
  if (!target) return;

  const text = target.dataset.twText ?? target.textContent ?? '';
  const outs = Array.from(document.querySelectorAll<HTMLElement>('[data-tw-out]'));

  outs.forEach((el) => {
    el.style.transition = 'opacity 400ms ease';
    el.style.opacity = '0';
  });

  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    outs.forEach((el) => {
      el.style.opacity = '1';
    });
    return;
  }

  target.textContent = '';

  void (async () => {
    await sleep(INITIAL_DELAY_MS);
    for (let i = 0; i <= text.length; i += 1) {
      target.textContent = text.slice(0, i);
      await sleep(TYPE_SPEED_MS);
    }
    await sleep(POST_TYPE_GAP_MS);
    for (const out of outs) {
      out.style.opacity = '1';
      await sleep(OUT_FADE_GAP_MS);
    }
  })();
}
