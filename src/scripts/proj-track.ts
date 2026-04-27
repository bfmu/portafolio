/**
 * Drag-to-scroll + arrow-key navigation for the project track on the
 * landing page. Targets `[data-proj-track]`. After a drag, swallows the
 * trailing click so a casual swipe doesn't open the underlying card.
 */

const CLICK_THRESHOLD_PX = 6;
const ARROW_STEP_PX = 380;

function isEditable(el: Element | null): boolean {
  if (!el) return false;
  return /input|textarea/i.test(el.tagName);
}

export function setupProjTrack(): void {
  if (typeof window === 'undefined') return;

  const track = document.querySelector<HTMLElement>('[data-proj-track]');
  if (!track) return;

  let isDown = false;
  let startX = 0;
  let scrollStart = 0;
  let moved = 0;

  track.addEventListener('mousedown', (event) => {
    isDown = true;
    moved = 0;
    startX = event.pageX;
    scrollStart = track.scrollLeft;
    track.dataset.grabbing = 'true';
  });

  window.addEventListener('mouseup', () => {
    isDown = false;
    track.dataset.grabbing = 'false';
  });

  window.addEventListener('mousemove', (event) => {
    if (!isDown) return;
    const dx = event.pageX - startX;
    moved = Math.abs(dx);
    track.scrollLeft = scrollStart - dx;
  });

  // Cancel the click that fires after a drag so you don't accidentally open a card.
  track.addEventListener(
    'click',
    (event) => {
      if (moved > CLICK_THRESHOLD_PX) {
        event.preventDefault();
        event.stopPropagation();
      }
    },
    true
  );

  window.addEventListener('keydown', (event) => {
    if (isEditable(document.activeElement)) return;
    if (event.key === 'ArrowRight') {
      track.scrollBy({ left: ARROW_STEP_PX, behavior: 'smooth' });
    } else if (event.key === 'ArrowLeft') {
      track.scrollBy({ left: -ARROW_STEP_PX, behavior: 'smooth' });
    }
  });
}
