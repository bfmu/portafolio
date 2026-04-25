/**
 * Live clock segment in the status bar. Updates every 30 seconds.
 * Targets the element marked with `[data-status-clock]`.
 */
export function setupStatusClock(): void {
  const el = document.querySelector<HTMLElement>('[data-status-clock]');
  if (!el) return;

  const tick = () => {
    el.textContent = new Date().toTimeString().slice(0, 5);
  };

  tick();
  setInterval(tick, 30_000);
}
