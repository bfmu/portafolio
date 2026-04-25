/**
 * Hand-typed shapes for bilingual content. Mirrors the zod schema in
 * `src/content/config.ts` but lives outside `astro:content` so plain
 * components can consume the types without touching the content runtime.
 */

export interface Bilingual {
  es: string;
  en: string;
}

export interface BilingualParas {
  es: string[];
  en: string[];
}
