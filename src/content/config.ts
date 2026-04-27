import { defineCollection, z } from 'astro:content';

const bilingual = z.object({
  es: z.string(),
  en: z.string(),
});

const bilingualParas = z.object({
  es: z.array(z.string()).min(1),
  en: z.array(z.string()).min(1),
});

const projects = defineCollection({
  type: 'content',
  schema: ({ image }) =>
    z.object({
      title: z.string(),
      year: z.number().int(),
      role: z.string(),
      status: z.enum(['live', 'archived', 'wip', 'side-project']),
      stack: z.array(z.string()).min(1),
      repo: z.string().url().optional(),
      demo: z.string().url().optional(),
      cover: image(),

      /**
       * Whether this project gets a dedicated `/projects/<slug>` page.
       * When false, the project still appears as a card on the landing
       * but cards/list/sidebar link straight to its demo or repo.
       */
      caseStudy: z.boolean().default(true),

      summary: bilingual,

      sections: z.object({
        overview: bilingualParas,
        context: bilingualParas,
        architecture: z
          .array(
            z.object({
              title: bilingual,
              body: bilingualParas,
            })
          )
          .default([]),
        challenges: z.array(bilingual).default([]),
        learnings: z.array(bilingual).default([]),
        roadmap: z
          .array(
            z.object({
              status: z.enum(['done', 'doing', 'planned']),
              text: bilingual,
            })
          )
          .default([]),
      }),

      gallery: z
        .array(
          z.object({
            image: image(),
            caption: bilingual,
          })
        )
        .default([]),
    }),
});

export const collections = { projects };
