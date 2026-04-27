/**
 * Fade + slide-up reveal on scroll. Watches every element with `[data-reveal]`
 * and adds `.is-visible` once it crosses the viewport threshold. CSS in
 * global.css handles the actual transition.
 *
 * Honors `prefers-reduced-motion`: when set, every target is revealed
 * immediately and no observer is created.
 */
export function setupReveal(): void {
  if (typeof window === 'undefined') return;

  const targets = document.querySelectorAll<HTMLElement>('[data-reveal]');
  if (targets.length === 0) return;

  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    targets.forEach((el) => el.classList.add('is-visible'));
    return;
  }

  const io = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (!entry.isIntersecting) continue;
        entry.target.classList.add('is-visible');
        io.unobserve(entry.target);
      }
    },
    { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
  );

  targets.forEach((el) => io.observe(el));
}
