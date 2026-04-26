/**
 * Shared types for IDE shell components. Kept in a `.ts` file (not `.astro`)
 * so they can be imported into TypeScript prop interfaces from other Astro
 * components.
 */

export interface Crumb {
  label: string;
  isActive?: boolean;
}

export interface OpenFile {
  /** Matches a Section.id when the tab participates in the active-section IO. */
  id?: string;
  file: string;
  isActive?: boolean;
  /** When set, clicking the tab's X navigates here. */
  closeHref?: string;
}
