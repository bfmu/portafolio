/**
 * Bilingual string registry.
 *
 * `en` is typed with `Record<keyof typeof es, string>`, so the compiler
 * fails the build whenever a key exists in one locale but not the other.
 *
 * Keys are flat, dot-separated by convention (e.g. `hero.session`,
 * `exp.0.desc`). Add new keys in both locales together.
 */

const es = {
  // ---------- shell
  'lang.label': 'Idioma',
  'sidebar.explorer': 'Explorador',

  // ---------- hero
  'hero.session': 'sesión iniciada · listo para construir cosas',
  'hero.currently': '"Backend dev @ Mercado Libre"',
  'hero.focus': '"crear soluciones de calidad"',
  'hero.available': 'Disponible para trabajar',
  'hero.website': 'Mi sitio web',

  // ---------- experience
  'exp.title': 'Experiencia',
  'exp.0.date': 'Noviembre 2024 — Actualidad',
  'exp.0.desc':
    'Analista y desarrollador backend en Java. Aprendiendo continuamente el stack tecnológico de la empresa y afrontando nuevos retos con la mejor actitud.',
  'exp.1.date': 'Diciembre 2023 — Octubre 2024',
  'exp.1.desc':
    'Aunque el puesto era backend, me desempeñé full-stack: Angular 16 en frontend y Go en backend, orientado a microservicios. Pilar fundamental en la migración de un monolito a microservicios y microfrontends de la aplicación de gestión académica de la Universidad Distrital — proponiendo e implementando buenas prácticas de desarrollo y arquitectura.',
  'exp.2.date': 'Diciembre 2022 — Mayo 2023',
  'exp.2.desc':
    'Lideré la gestión y mantenimiento de servidores Linux, desplegando aplicaciones en contenedores con Docker Compose y Docker Stack. Trabajé con Apache, Nginx y OpenLiteSpeed para optimizar operaciones. Desarrollé un módulo para Joomla CMS y colaboré en el mantenimiento de sitios Drupal.',

  // ---------- projects
  'proj.title': 'Proyectos',
  'proj.drag': 'Arrastrá para explorar',
  'proj.read': 'Leer caso de estudio',
  'proj.open': 'abrir',
  'proj.flacow.desc':
    'App para registrar tu progreso en el gimnasio y lograr tus objetivos de fuerza.',
  'proj.gifex.desc':
    'App web para buscar y ver gifs animados, consumiendo la API de Giphy.',
  'proj.retos.desc':
    'Plataforma web para consultar y desplegar retos de programación que resolví en distintas plataformas.',

  // ---------- contact
  'contact.title': 'Contáctame',
} as const satisfies Record<string, string>;

const en = {
  'lang.label': 'Lang',
  'sidebar.explorer': 'Explorer',

  'hero.session': 'session started · ready to build things',
  'hero.currently': '"Backend dev @ Mercado Libre"',
  'hero.focus': '"shipping quality solutions"',
  'hero.available': 'Open to work',
  'hero.website': 'My website',

  'exp.title': 'Experience',
  'exp.0.date': 'November 2024 — Present',
  'exp.0.desc':
    'Backend analyst & developer in Java. Continuously learning the company stack and tackling new challenges with the right attitude.',
  'exp.1.date': 'December 2023 — October 2024',
  'exp.1.desc':
    'Hired as backend, worked full-stack: Angular 16 frontend and Go microservices backend. Key contributor to the monolith → microservices + microfrontends migration of the academic management app at Universidad Distrital — driving development and architectural best practices.',
  'exp.2.date': 'December 2022 — May 2023',
  'exp.2.desc':
    'Led Linux server management and maintenance, deploying apps in containers with Docker Compose and Docker Stack. Used Apache, Nginx and OpenLiteSpeed to optimize operations. Built a Joomla CMS module and contributed to Drupal site maintenance.',

  'proj.title': 'Projects',
  'proj.drag': 'Drag to explore',
  'proj.read': 'Read case study',
  'proj.open': 'open',
  'proj.flacow.desc': 'App to track your gym progress and hit your strength goals.',
  'proj.gifex.desc': 'Web app to search and play animated gifs, powered by the Giphy API.',
  'proj.retos.desc':
    "Web platform to browse and view coding challenges I've solved across different platforms.",

  'contact.title': 'Get in touch',
} as const satisfies Record<keyof typeof es, string>;

export const strings = { es, en } as const;

export type Lang = keyof typeof strings;
export type StringKey = keyof typeof es;

export const LANGS: readonly Lang[] = ['es', 'en'];
export const DEFAULT_LANG: Lang = 'es';
