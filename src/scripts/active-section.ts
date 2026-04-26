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

  // A thin band ~30% from the top of the viewport. Any section whose
  // vertical extent overlaps this band counts as active. Threshold 0
  // means "any pixel"; together they handle tall and short sections
  // uniformly — the previous "30% of section visible" version skipped
  // sections taller than the viewport (e.g. proyectos with the scroller
  // + ls -la list).
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
    { threshold: 0, rootMargin: '-30% 0px -65% 0px' }
  );

  targets.forEach((el) => io.observe(el));
}

declare global {
  interface DocumentEventMap {
    'section:change': CustomEvent<Section>;
  }
}
