import { SECTIONS, type Section } from '../lib/ide-sections';

/**
 * Watches landing-page sections via IntersectionObserver and broadcasts a
 * `section:change` CustomEvent whenever the active section changes.
 *
 * All shell components (Tabs, Sidebar, StatusBar) listen to this event and
 * update their own DOM. The observer never reaches outside its own scope —
 * dependencies flow inward through the event (Dependency Inversion).
 */
export function setupActiveSection(): void {
  if (typeof window === 'undefined') return;

  const sectionById = new Map<string, Section>(SECTIONS.map((s) => [s.id, s]));

  const targets = SECTIONS
    .map((s) => document.getElementById(s.id))
    .filter((el): el is HTMLElement => el !== null);

  if (targets.length === 0) return;

  const io = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (!entry.isIntersecting) continue;
        const section = sectionById.get(entry.target.id);
        if (!section) continue;
        document.dispatchEvent(
          new CustomEvent<Section>('section:change', { detail: section })
        );
      }
    },
    { threshold: 0.3, rootMargin: '-80px 0px -50% 0px' }
  );

  targets.forEach((el) => io.observe(el));
}

declare global {
  interface DocumentEventMap {
    'section:change': CustomEvent<Section>;
  }
}
