---
title: Flacow
year: 2024
role: full-stack
status: live
stack:
  - React
  - NestJS
  - MaterialUI
  - PostgreSQL
  - JWT
  - Docker
repo: https://github.com/redflox/progresapp-flacow
demo: https://flacow.bfmu.dev/
cover: ../../assets/images/flacow.png

summary:
  es: App para registrar tu progreso en el gimnasio y lograr tus objetivos de fuerza.
  en: App to track your gym progress and hit your strength goals.

sections:
  overview:
    es:
      - "Flacow es una aplicación web full-stack para registrar tus entrenamientos. Querías ver si esa serie de press banca de hoy fue mejor que la de hace 6 semanas — pues lo ves de un vistazo, en una gráfica, sin abrir cinco pestañas ni rascar un Excel."
      - "Construido como side-project, vive en producción en <code>flacow.bfmu.dev</code> y usa una arquitectura monorepo con frontend en React + MaterialUI y backend en NestJS."
    en:
      - "Flacow is a full-stack web app for logging workouts. You want to know whether today's bench press set was better than the one six weeks ago — you see it at a glance, in a chart, without opening five tabs or wrestling a spreadsheet."
      - "Built as a side-project, it runs in production at <code>flacow.bfmu.dev</code> with a monorepo architecture: React + MaterialUI on the frontend, NestJS on the backend."

  context:
    es:
      - "Llevo varios años entrenando con foco en progresión de carga. La rutina pide saber cuánto levantaste la sesión anterior, en cuántas series, con qué RPE. Probé un par de apps populares y todas fallaban en lo mismo: UX pensada para casual fitness, no para fuerza; imposible ver tendencias por ejercicio sin pagar premium; captura de series lenta — 6 taps para registrar un set."
      - "Si una herramienta hace fricción justo en el momento en que la necesitás, dejás de usarla. Y un tracker que no usás no sirve."
    en:
      - "I've been training with a focus on progressive overload for a few years. The routine demands knowing what you lifted last session, how many sets, at what RPE. I tried a couple of popular apps and they all failed at the same things: UX built for casual fitness, not strength training; impossible to see per-exercise trends without going premium; slow set capture — 6 taps to log a single set."
      - "If a tool creates friction at the exact moment you need it, you stop using it. And a tracker you don't use is no tracker at all."

  architecture:
    - title:
        es: Monorepo con apps separadas
        en: Monorepo with split apps
      body:
        es:
          - "Frontend y backend viven en el mismo repo pero como paquetes independientes. Comparten un paquete <code>shared/</code> con tipos TypeScript de los DTOs — un cambio en el contrato compila en ambos lados o explota el build."
        en:
          - "Frontend and backend live in the same repo but as independent packages. They share a <code>shared/</code> package with TypeScript types for DTOs — a contract change either compiles on both sides or breaks the build."
    - title:
        es: Modelo de datos por sesión
        en: Session-based data model
      body:
        es:
          - "En vez de modelar 'sets' sueltos, todo cuelga de una <code>WorkoutSession</code>. Esto hizo que las queries de progreso sean joins rápidos en lugar de subqueries de agregación cara."
        en:
          - "Instead of modeling loose 'sets', everything hangs off a <code>WorkoutSession</code>. This turned progress queries into fast joins rather than expensive aggregation subqueries."
    - title:
        es: Auth con refresh rotation
        en: Auth with refresh rotation
      body:
        es:
          - "Cada refresh emite un nuevo par y revoca el anterior. Si alguien usa un refresh ya canjeado, todos los tokens del usuario se invalidan — heurística simple para detectar robo de token."
        en:
          - "Each refresh issues a new pair and revokes the previous. If anyone uses a refresh that's already been redeemed, all of the user's tokens are invalidated — simple heuristic to flag token theft."

  challenges:
    - es: "<strong>Capturar series rápido sin teclado.</strong> Diseñé inputs con steppers + presets de pesos comunes. De 6 taps por set bajé a 2."
      en: "<strong>Logging sets fast without a keyboard.</strong> I designed steppers + common-weight presets. Went from 6 taps per set down to 2."
    - es: "<strong>Offline en gimnasios con WiFi roto.</strong> Service worker + queue de sincronización. La app graba localmente y sincroniza al volver señal."
      en: "<strong>Offline in gyms with broken WiFi.</strong> Service worker + sync queue. The app records locally and syncs when signal returns."
    - es: "<strong>Gráficas de progreso que no mientan.</strong> Hubo que decidir cómo mostrar 'mejor set' vs 'volumen total' — terminé exponiendo ambas con un toggle, en lugar de elegir por el usuario."
      en: "<strong>Progress charts that don't lie.</strong> Had to decide how to surface 'top set' vs 'total volume' — ended up exposing both with a toggle instead of choosing for the user."

  learnings:
    - es: "Construir <em>para vos mismo</em> es el mejor product brief. Cada decisión tiene un usuario real (yo) probando en el gimnasio."
      en: "Building <em>for yourself</em> is the best product brief. Every decision has a real user (me) testing in the gym."
    - es: "NestJS escaló mejor de lo que esperaba para un side-project. La modularización por feature compensa el boilerplate inicial."
      en: "NestJS scaled better than expected for a side-project. Feature-based modularization pays for the initial boilerplate."
    - es: "La parte difícil de un tracker no es guardar datos — es <em>mostrarlos en el momento justo</em>. Pasé más tiempo en UX de gráficas que en el modelo de datos."
      en: "The hard part of a tracker isn't storing data — it's <em>surfacing it at the right moment</em>. I spent more time on chart UX than on the data model."

  roadmap:
    - status: done
      text:
        es: MVP de logging y dashboard
        en: Logging & dashboard MVP
    - status: done
      text:
        es: Auth con refresh rotation
        en: Auth with refresh rotation
    - status: done
      text:
        es: Modo offline básico
        en: Basic offline mode
    - status: doing
      text:
        es: Plantillas de rutina (5/3/1, PPL, etc.)
        en: Routine templates (5/3/1, PPL, etc.)
    - status: planned
      text:
        es: Exportar histórico a CSV
        en: Export history to CSV
    - status: planned
      text:
        es: Compartir progreso público (read-only links)
        en: Public progress sharing (read-only links)
    - status: planned
      text:
        es: App móvil nativa con React Native
        en: Native mobile app with React Native

gallery:
  - image: ../../assets/images/flacow.png
    caption:
      es: landing.tsx — hero & propuesta de valor
      en: landing.tsx — hero & value props
---

<!--
  Body intentionally left empty: the case-study layout reads its prose from
  the structured frontmatter above so it can render both locales side by side.
-->
