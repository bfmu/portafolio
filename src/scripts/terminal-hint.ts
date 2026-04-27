/**
 * One-shot toast that hints the terminal shortcut on a visitor's first
 * arrival. Persists a localStorage flag so it never reappears.
 *
 * The toast is created lazily — no markup pollution in the IdeShell.
 * Dismisses on click on itself, on opening the terminal (the hint is
 * obviously consumed), or after AUTO_DISMISS_MS.
 */

const STORAGE_KEY = 'bf-terminal-hint-seen';
const SHOW_DELAY_MS = 2400;
const AUTO_DISMISS_MS = 7000;

export function setupTerminalHint(): void {
  if (typeof window === 'undefined') return;

  let alreadySeen = false;
  try {
    alreadySeen = localStorage.getItem(STORAGE_KEY) === '1';
  } catch { /* ignore */ }
  if (alreadySeen) return;

  // Skip on coarse pointers — the shortcut is keyboard-only.
  if (window.matchMedia('(pointer: coarse)').matches) return;

  const markSeen = () => {
    try {
      localStorage.setItem(STORAGE_KEY, '1');
    } catch { /* ignore */ }
  };

  let dismissed = false;
  let toast: HTMLElement | null = null;
  let dismissTimer: number | undefined;

  const dismiss = () => {
    if (dismissed) return;
    dismissed = true;
    markSeen();
    if (dismissTimer) window.clearTimeout(dismissTimer);
    if (!toast) return;
    toast.classList.remove('is-visible');
    setTimeout(() => toast?.remove(), 240);
  };

  const show = () => {
    if (dismissed) return;
    toast = document.createElement('div');
    toast.className = 'terminal-hint';
    toast.setAttribute('role', 'status');
    toast.innerHTML = `
      <span class="terminal-hint__kbd">Ctrl</span>
      <span class="terminal-hint__plus">+</span>
      <span class="terminal-hint__kbd">\`</span>
      <span class="terminal-hint__text">opens the terminal</span>
      <button type="button" class="terminal-hint__close" aria-label="Dismiss">×</button>
    `;
    toast.addEventListener('click', dismiss);
    document.body.appendChild(toast);
    requestAnimationFrame(() => toast?.classList.add('is-visible'));
    dismissTimer = window.setTimeout(dismiss, AUTO_DISMISS_MS);
  };

  // Opening the terminal — by any means — counts as the user having
  // discovered it, so the hint fades away immediately.
  document.addEventListener('click', (event) => {
    const target = event.target as Element | null;
    if (target?.closest('[data-terminal-toggle]')) dismiss();
  });
  document.addEventListener('keydown', (event) => {
    if (event.ctrlKey && event.key === '`') dismiss();
  });

  setTimeout(show, SHOW_DELAY_MS);
}
