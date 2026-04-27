import { DEFAULT_LANG, LANGS, type Lang } from '../i18n/strings';

const STORAGE_KEY = 'bf-lang';

function isLang(value: string | null): value is Lang {
  return value !== null && (LANGS as readonly string[]).includes(value);
}

/**
 * Single delegated click listener that flips `data-lang` on `<html>`,
 * persists the choice, and broadcasts a `lang:changed` CustomEvent.
 *
 * Visual state of the toggle button is driven entirely by CSS attribute
 * selectors on `html[data-lang]` — no DOM mutation happens here beyond
 * the root attribute.
 */
export function setupLangToggle(): void {
  if (typeof document === 'undefined') return;

  document.addEventListener('click', (event) => {
    const target = event.target as Element | null;
    const button = target?.closest<HTMLElement>('[data-lang-toggle]');
    if (!button) return;

    event.preventDefault();
    const html = document.documentElement;
    const current = isLang(html.getAttribute('data-lang'))
      ? (html.getAttribute('data-lang') as Lang)
      : DEFAULT_LANG;
    const next: Lang = current === 'es' ? 'en' : 'es';

    html.setAttribute('data-lang', next);
    html.setAttribute('lang', next);

    try {
      localStorage.setItem(STORAGE_KEY, next);
    } catch {
      /* localStorage unavailable (private mode, sandboxed iframe) — ignore */
    }

    document.dispatchEvent(
      new CustomEvent<Lang>('lang:changed', { detail: next })
    );
  });
}

declare global {
  interface DocumentEventMap {
    'lang:changed': CustomEvent<Lang>;
  }
}
