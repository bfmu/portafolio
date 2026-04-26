# Bryan Muñoz · Portfolio

A static portfolio built as a VS Code-flavoured IDE: **Astro + Tailwind**, **Catppuccin Mocha** palette, **Cascadia Code** typography, full ES/EN bilingual support and per-project case-study pages.

Live at <https://bfmu.dev>.

## Stack

| Layer        | Tool                                          |
|--------------|-----------------------------------------------|
| Framework    | [Astro 4](https://astro.build/) (static)      |
| Styling      | [Tailwind](https://tailwindcss.com/) + custom CSS with semantic tokens |
| Typography   | [`@fontsource/cascadia-code`](https://fontsource.org/fonts/cascadia-code) (300 / 400 / 500 / 600 / 700) |
| Image opt.   | [sharp](https://sharp.pixelplumbing.com/)     |
| Content      | Astro content collections (zod-validated)     |
| i18n         | Custom — both translations rendered, CSS hides the inactive one |
| Package mgr  | pnpm                                          |

## Project layout

```
src/
├── components/
│   ├── ide/                     # IDE chrome (TitleBar, Sidebar, Tabs, Editor, StatusBar, IdeShell)
│   ├── landing/                 # Landing sections (Hero, Experience, Projects, Contact, ProjectCard, ProjectListRow)
│   ├── I18n.astro               # <I18n key="..." /> — registry-backed inline strings
│   ├── Bilingual.astro          # <Bilingual es="" en="" /> — raw inline strings
│   ├── BilingualParas.astro     # multi-paragraph bilingual blocks
│   └── BilingualList.astro      # bilingual <ul> / <ol>
├── content/
│   ├── config.ts                # zod schema for the `projects` collection
│   └── projects/                # one .md per case study
├── data/
│   └── experience.ts            # work-history entries (title + company + i18n keys)
├── i18n/
│   └── strings.ts               # bilingual string registry; en is forced to mirror es
├── layouts/
│   └── Layout.astro             # SSR shell + IdeShell composition + meta
├── lib/
│   ├── bilingual.ts             # shared { es, en } types
│   └── ide-sections.ts          # SECTIONS registry: tabs / sidebar / status bar all derive from it
├── pages/
│   ├── index.astro              # landing
│   └── projects/[...slug].astro # dynamic case-study route
├── scripts/                     # tiny TS modules, each one setupX() exported
│   ├── active-section.ts        # IO that broadcasts section:change events
│   ├── cursor.ts                # custom cursor (mono block + grab hand)
│   ├── lang-toggle.ts           # ES/EN toggle + persistence
│   ├── proj-track.ts            # drag-to-scroll project track
│   ├── reveal.ts                # fade + slide on intersect
│   ├── sidebar-folders.ts       # collapsible folders
│   ├── status-clock.ts          # live clock segment
│   ├── typewriter.ts            # hero terminal typewriter
│   └── copy-button.ts           # delegated [data-copy] handler
└── styles/
    ├── global.css               # tokens (raw Catppuccin + semantic aliases) + reset + helpers
    ├── ide.css                  # IDE chrome
    ├── sections.css             # landing sections
    ├── case.css                 # case-study layout
    └── cursor.css               # custom cursor
```

## Running locally

```sh
pnpm install
pnpm dev          # http://localhost:4321
pnpm build        # static site → ./dist/
pnpm preview      # serve the built site locally
```

## Adding a new project

1. Drop a cover image in `src/assets/images/<slug>.png` (or `.jpg`).
2. Create `src/content/projects/<slug>.md` with the bilingual frontmatter:

   ```yaml
   ---
   title: My Project
   year: 2026
   role: full-stack
   status: live              # live | archived | wip | side-project
   stack:
     - Astro
     - TypeScript
   repo: https://github.com/me/my-project
   demo: https://my-project.example.com/
   cover: ../../assets/images/my-project.png

   summary:
     es: Una frase corta describiendo el proyecto.
     en: A short sentence describing the project.

   sections:
     overview:
       es:
         - "Primer párrafo del overview."
       en:
         - "First overview paragraph."
     context:
       es:
         - "Por qué existe este proyecto."
       en:
         - "Why this project exists."
     # architecture, challenges, learnings, roadmap, gallery — all optional
   ---
   ```

3. That's it. The project automatically appears in:
   - the **sidebar file tree** on every page,
   - the **landing project scroller** + **`ls -la` list**,
   - and gets its own static page at `/projects/<slug>`.

The schema lives in `src/content/config.ts` — zod will fail the build if any required field is missing or if `summary.en` paragraphs don't match `summary.es` count.

## Adding new bilingual strings

Edit `src/i18n/strings.ts`. Add the key to `es` first; TypeScript will then *force* you to add the same key to `en` (`satisfies Record<keyof typeof es, string>`). Use them as:

```astro
<I18n key="my.new.key" />
```

## Adding a new section to the IDE shell

Append an entry to `SECTIONS` in `src/lib/ide-sections.ts`. The tabs, sidebar tree and status bar all re-derive from this list — no other file needs to change.

## Social preview image

Drop a 1200×630 PNG at `public/og.png` to appear in OG / Twitter card previews. Each project case study automatically generates its own preview from its cover image.

## Branch model

Production lives on `develop`. Active redesign work is on `redesign/v2-ide`.
