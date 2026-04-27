/**
 * Magnetic-pull effect for any element with the `magnetic` class.
 * The element translates toward the pointer while hovered, scaled by
 * `data-magnetic-strength` (default 18 px at the corners).
 *
 * Bails on coarse pointers — touch devices have no hover state and the
 * effect would feel laggy + meaningless.
 *
 * The CSS rule on `.magnetic` already sets a transition, so leaving the
 * element snaps back smoothly.
 */

const DEFAULT_STRENGTH = 18;

export function setupMagnetic(): void {
  if (typeof window === 'undefined') return;
  if (window.matchMedia('(hover: none)').matches) return;
  if (window.matchMedia('(pointer: coarse)').matches) return;

  const elements = document.querySelectorAll<HTMLElement>('.magnetic');
  elements.forEach(attach);
}

function attach(el: HTMLElement): void {
  if (el.dataset.magneticMounted === 'true') return;
  el.dataset.magneticMounted = 'true';

  const strength = Number(el.dataset.magneticStrength ?? DEFAULT_STRENGTH);

  el.addEventListener('mousemove', (event) => {
    const rect = el.getBoundingClientRect();
    const dx = event.clientX - (rect.left + rect.width / 2);
    const dy = event.clientY - (rect.top + rect.height / 2);
    const tx = (dx / rect.width) * strength;
    const ty = (dy / rect.height) * strength;
    el.style.transform = `translate(${tx}px, ${ty}px)`;
  });

  el.addEventListener('mouseleave', () => {
    el.style.transform = '';
  });
}
