/**
 * Custom cursor — a smoothed mono block that morphs into a drag hand on
 * `[data-cursor="drag"]` zones and into an underscore on links/buttons.
 *
 * Self-contained: appends one `<div class="bf-cursor">` to <body> and
 * attaches three pointer listeners. Bails on coarse pointers (touch).
 */

const HAND_OPEN_SVG = `
  <svg class="bf-cursor__hand bf-cursor__hand--open" viewBox="0 0 24 24" fill="none"
       stroke="#cdd6f4" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
    <path d="M8 11V6.5a1.5 1.5 0 0 1 3 0V11"/>
    <path d="M11 11V5.5a1.5 1.5 0 0 1 3 0V11"/>
    <path d="M14 11V6.5a1.5 1.5 0 0 1 3 0V12"/>
    <path d="M17 9a1.5 1.5 0 0 1 3 0v6a6 6 0 0 1-6 6h-1.5a6 6 0 0 1-5.74-4.26L5 13a1.5 1.5 0 0 1 2.6-1.5L8.5 13"/>
  </svg>
`;

const HAND_CLOSED_SVG = `
  <svg class="bf-cursor__hand bf-cursor__hand--closed" viewBox="0 0 24 24" fill="none"
       stroke="#fab387" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
    <path d="M8 12V8.5a1.5 1.5 0 0 1 3 0V11"/>
    <path d="M11 11V8a1.5 1.5 0 0 1 3 0v3"/>
    <path d="M14 11V8.5a1.5 1.5 0 0 1 3 0V12"/>
    <path d="M17 10.5a1.5 1.5 0 0 1 3 0V15a6 6 0 0 1-6 6h-1.5a6 6 0 0 1-5.74-4.26L5 13.5a1.5 1.5 0 0 1 2.6-1.5L8.5 13.5"/>
  </svg>
`;

const SMOOTHING = 0.35;
const LINK_SELECTOR = 'a, button, [role="button"], [data-cursor="link"]';
const TEXT_SELECTOR = 'input[type="text"], input[type="email"], textarea, [data-cursor="text"]';
const DRAG_SELECTOR = '[data-cursor="drag"]';

export function setupCustomCursor(): void {
  if (typeof window === 'undefined') return;
  if (window.matchMedia('(hover: none)').matches) return;
  if (document.querySelector('.bf-cursor')) return;

  const cursor = document.createElement('div');
  cursor.className = 'bf-cursor is-hidden';
  cursor.innerHTML = `<div class="bf-cursor__block"></div>${HAND_OPEN_SVG}${HAND_CLOSED_SVG}`;
  document.body.appendChild(cursor);

  let targetX = -100;
  let targetY = -100;
  let x = -100;
  let y = -100;

  const tick = () => {
    x += (targetX - x) * SMOOTHING;
    y += (targetY - y) * SMOOTHING;
    cursor.style.transform = `translate3d(${x - 7}px, ${y - 11}px, 0)`;
    requestAnimationFrame(tick);
  };
  requestAnimationFrame(tick);

  window.addEventListener('mousemove', (event) => {
    targetX = event.clientX;
    targetY = event.clientY;
    cursor.classList.remove('is-hidden');
  });
  window.addEventListener('mouseleave', () => cursor.classList.add('is-hidden'));
  window.addEventListener('mouseenter', () => cursor.classList.remove('is-hidden'));

  document.addEventListener('mouseover', (event) => {
    const target = event.target;
    if (!(target instanceof Element)) return;

    const onDrag = target.closest(DRAG_SELECTOR) !== null;
    const onLink = !onDrag && target.closest(LINK_SELECTOR) !== null;
    const onText = !onDrag && !onLink && target.closest(TEXT_SELECTOR) !== null;

    cursor.classList.toggle('is-drag', onDrag);
    cursor.classList.toggle('is-link', onLink);
    cursor.classList.toggle('is-text', onText);
  });

  window.addEventListener('mousedown', () => cursor.classList.add('is-grabbing'));
  window.addEventListener('mouseup',   () => cursor.classList.remove('is-grabbing'));
}
