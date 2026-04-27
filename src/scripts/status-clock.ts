/**
 * Live clock segment in the status bar. Pinned to America/Bogota so the
 * displayed time matches the portfolio owner regardless of where the
 * visitor is browsing from. Updates every 30 seconds.
 *
 * Targets the element marked with `[data-status-clock]`.
 */

const TIME_FORMAT = new Intl.DateTimeFormat('en-GB', {
  timeZone: 'America/Bogota',
  hour: '2-digit',
  minute: '2-digit',
  hour12: false,
});

export function setupStatusClock(): void {
  const el = document.querySelector<HTMLElement>('[data-status-clock]');
  if (!el) return;

  const tick = () => {
    el.textContent = `${TIME_FORMAT.format(new Date())} BOG`;
  };

  tick();
  setInterval(tick, 30_000);
}
