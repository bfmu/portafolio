import type { CollectionEntry } from 'astro:content';

/**
 * Resolve the correct destination for a project entry across the site:
 *
 *   - case-study projects → `/projects/<slug>` (their static page).
 *   - non-case-study projects → demo URL, falling back to repo URL,
 *     and ultimately to the landing's projects section.
 *
 * Single source of truth so cards, list rows and the sidebar tree
 * stay consistent.
 */
export function resolveProjectHref(project: CollectionEntry<'projects'>): string {
  const { data, slug } = project;
  if (data.caseStudy) return `/projects/${slug}`;
  return data.demo ?? data.repo ?? `/#proyectos`;
}

/** Whether the link leaves the site (used to decide target/rel attributes). */
export function isExternalProjectHref(project: CollectionEntry<'projects'>): boolean {
  return !project.data.caseStudy;
}
