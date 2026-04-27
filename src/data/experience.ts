import type { StringKey } from '../i18n/strings';

/**
 * Work experience entries. Date and description are i18n keys (looked up in
 * the strings registry); job title and company are language-neutral and live
 * here directly. Order is most-recent first.
 */
export interface Experience {
  title: string;
  company: string;
  isCurrent?: boolean;
  dateKey: StringKey;
  descKey: StringKey;
}

export const EXPERIENCES: readonly Experience[] = [
  {
    title: 'Software Developer',
    company: 'MELI',
    isCurrent: true,
    dateKey: 'exp.0.date',
    descKey: 'exp.0.desc',
  },
  {
    title: 'Backend Developer',
    company: 'OATI · Universidad Distrital',
    dateKey: 'exp.1.date',
    descKey: 'exp.1.desc',
  },
  {
    title: 'Junior Developer',
    company: 'Jerrejerre S.A.S',
    dateKey: 'exp.2.date',
    descKey: 'exp.2.desc',
  },
] as const;
