/**
 * Single source of truth for the IDE's "open files".
 *
 * Adding a new section is a single-entry change: Tabs, Sidebar and StatusBar
 * all derive their state from this list (Open/Closed Principle).
 */

export interface Section {
  /** DOM id of the corresponding `<section>` on the landing page. */
  id: string;
  /** Display label (reserved for tooltips and accessible names). */
  label: string;
  /** Filename shown in the tab strip and the status bar. */
  file: string;
  /** Language indicator shown in the status bar. */
  language: string;
  /** Stable key used to mark the matching item in the sidebar tree. */
  treeKey: string;
  /** Optional glyph kind for the file-tree icon (md/json/tsx/yml/...). */
  iconKind: 'md' | 'json' | 'tsx' | 'yml';
  /** Glyph rendered in the file-tree icon slot. */
  iconGlyph: string;
}

export const SECTIONS: readonly Section[] = [
  { id: 'hero',        label: 'Inicio',      file: 'README.md',       language: 'Markdown',   treeKey: 'readme',  iconKind: 'md',   iconGlyph: 'M↓' },
  { id: 'experiencia', label: 'Experiencia', file: 'experience.json', language: 'JSON',       treeKey: 'exp',     iconKind: 'json', iconGlyph: '{ }' },
  { id: 'proyectos',   label: 'Proyectos',   file: 'projects.tsx',    language: 'TypeScript', treeKey: 'proj',    iconKind: 'tsx',  iconGlyph: '‹/›' },
  { id: 'contacto',    label: 'Contacto',    file: 'contact.yml',     language: 'YAML',       treeKey: 'contact', iconKind: 'yml',  iconGlyph: '‹›' },
] as const;
