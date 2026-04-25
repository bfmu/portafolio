/**
 * Single delegated handler for any element with `[data-copy="<text>"]`.
 * Copies the text via the Clipboard API and briefly mutates the button's
 * label to give visual feedback. Falls back silently if clipboard API
 * is unavailable (insecure context, locked-down browsers).
 */
const COPIED_LABEL = '✓ copied';
const FEEDBACK_MS = 1500;

export function setupCopyButtons(): void {
  if (typeof document === 'undefined') return;

  document.addEventListener('click', async (event) => {
    const target = event.target as Element | null;
    const button = target?.closest<HTMLElement>('[data-copy]');
    if (!button) return;

    const text = button.dataset.copy;
    if (!text || !navigator.clipboard) return;

    event.preventDefault();
    try {
      await navigator.clipboard.writeText(text);
    } catch {
      return;
    }

    const original = button.innerHTML;
    button.textContent = COPIED_LABEL;
    setTimeout(() => {
      button.innerHTML = original;
    }, FEEDBACK_MS);
  });
}
