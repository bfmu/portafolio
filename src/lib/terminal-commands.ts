/**
 * Terminal command registry.
 *
 * Each command is a small object with a name, a description, optional
 * aliases, and a `run()` that mutates the terminal via the context.
 * Adding a command is one entry in `COMMANDS` — no other file changes.
 *
 * `print()` accepts a string of safe-HTML or an array of safe-HTML lines.
 * Strings here are authored by us (not user input), so trusted-HTML is
 * acceptable. Anything reflected from user input MUST be escaped first.
 */

import { strings, DEFAULT_LANG, type Lang, type StringKey } from '../i18n/strings';
import { EXPERIENCES } from '../data/experience';

export interface ProjectInfo {
  slug: string;
  title: string;
  year: number;
  status: string;
  summary: { es: string; en: string };
  stack: string[];
}

export interface TerminalData {
  projects: ProjectInfo[];
  gitLog: string[];
}

export interface TerminalContext {
  print: (lines: string | string[]) => void;
  clear: () => void;
  close: () => void;
  data: TerminalData;
}

export interface Command {
  name: string;
  description: string;
  aliases?: string[];
  /** When true, the command is hidden from `help` output. */
  hidden?: boolean;
  run: (args: string[], ctx: TerminalContext) => void;
}

const currentLang = (): Lang => {
  const attr = document.documentElement.dataset.lang;
  return attr === 'en' ? 'en' : DEFAULT_LANG;
};

const t = (key: StringKey): string => strings[currentLang()][key];

const escapeHtml = (s: string): string =>
  s.replace(/[&<>"']/g, (c) => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;',
  }[c] ?? c));

const JOKES = [
  "Why do programmers prefer dark mode? Because light attracts bugs.",
  "There are 10 types of people in the world: those who understand binary, and those who don't.",
  "A SQL query walks into a bar, walks up to two tables and asks: 'Can I join you?'",
  "How many programmers does it take to change a light bulb? None — that's a hardware problem.",
  "I would tell you a UDP joke, but you might not get it.",
  "There are two hard problems in CS: cache invalidation, naming things, and off-by-one errors.",
  "git push --force is the answer to many things you should not be doing.",
  "Why don't bachelors like Git? Because they're afraid to commit.",
  "Real programmers count from 0.",
  "It's not a bug, it's an undocumented feature.",
];

export const COMMANDS: Command[] = [
  {
    name: 'help',
    description: 'list available commands',
    aliases: ['?'],
    run(_args, ctx) {
      const visible = COMMANDS.filter((c) => !c.hidden);
      const rows = visible.map((c) => {
        const padded = c.name.padEnd(12);
        return `  <span class="kw">${padded}</span><span class="dim">${c.description}</span>`;
      });
      ctx.print([
        '<span class="dim">commands available — args go after a space</span>',
        ...rows,
        '<span class="dim">(curiosity tip: try</span> <span class="kw">joke</span><span class="dim">,</span> <span class="kw">coffee</span><span class="dim">,</span> <span class="kw">git log</span><span class="dim">)</span>',
      ]);
    },
  },
  {
    name: 'whoami',
    aliases: ['about'],
    description: 'about Bryan',
    run(_args, ctx) {
      ctx.print([
        '<span class="num">Bryan Muñoz</span> <span class="dim">·</span> Software Developer',
        '  <span class="dim">📍</span> Bogotá, Colombia 🇨🇴',
        '  <span class="dim">💼</span> Backend dev @ Mercado Libre',
        '  <span class="dim">🌐</span> <a href="https://bfmu.dev" target="_blank" rel="noopener">bfmu.dev</a>',
      ]);
    },
  },
  {
    name: 'experience',
    aliases: ['xp', 'history'],
    description: 'work history',
    run(_args, ctx) {
      const lines: string[] = [];
      EXPERIENCES.forEach((job) => {
        lines.push(
          `<span class="kw">${job.title}</span> <span class="dim">@</span> <span class="num">${job.company}</span>`
        );
        lines.push(`  <span class="dim">${t(job.dateKey)}</span>`);
      });
      ctx.print(lines);
    },
  },
  {
    name: 'projects',
    aliases: ['ls'],
    description: 'list projects',
    run(_args, ctx) {
      if (ctx.data.projects.length === 0) {
        ctx.print('<span class="dim">no projects loaded</span>');
        return;
      }
      const lang = currentLang();
      const rows = ctx.data.projects.map((p) => {
        const slug = p.slug.padEnd(10);
        return `  <span class="num">${p.year}</span> <span class="kw">${slug}</span><span class="dim">${p.summary[lang]}</span>`;
      });
      ctx.print(['<span class="dim">$ ls -la ./projects</span>', ...rows]);
    },
  },
  {
    name: 'cat',
    description: 'show details of a project: cat <slug>',
    run(args, ctx) {
      const raw = args[0]?.replace(/\.md$/, '');
      if (!raw) {
        ctx.print('<span class="dim">usage:</span> cat &lt;slug&gt;');
        return;
      }
      const slug = raw.toLowerCase();
      const proj = ctx.data.projects.find((p) => p.slug === slug);
      if (!proj) {
        ctx.print(`<span class="tag">no project</span> <span class="kw">${escapeHtml(raw)}</span>`);
        return;
      }
      const lang = currentLang();
      ctx.print([
        `<span class="num">${proj.title}</span> <span class="dim">·</span> <span class="kw">${proj.year}</span>`,
        `  <span class="dim">status:</span> <span class="acc">${proj.status}</span>`,
        `  <span class="dim">stack:</span>  ${proj.stack.join(', ')}`,
        `  <span class="dim">summary:</span> ${proj.summary[lang]}`,
        `  <span class="dim">→</span> <a href="/projects/${proj.slug}">/projects/${proj.slug}</a>`,
      ]);
    },
  },
  {
    name: 'open',
    description: 'open a project page: open <slug>',
    run(args, ctx) {
      const raw = args[0]?.replace(/\.md$/, '');
      if (!raw) {
        ctx.print('<span class="dim">usage:</span> open &lt;slug&gt;');
        return;
      }
      const slug = raw.toLowerCase();
      const proj = ctx.data.projects.find((p) => p.slug === slug);
      if (!proj) {
        ctx.print(`<span class="tag">no project</span> <span class="kw">${escapeHtml(raw)}</span>`);
        return;
      }
      window.location.assign(`/projects/${slug}`);
    },
  },
  {
    name: 'contact',
    description: 'how to reach me',
    run(_args, ctx) {
      ctx.print([
        '<span class="dim">✉</span>  email:    <a href="mailto:bfmumo@gmail.com">bfmumo@gmail.com</a>',
        '<span class="dim">🔗</span> linkedin: <a href="https://www.linkedin.com/in/bfmunozm96/" target="_blank" rel="noopener">/in/bfmunozm96</a>',
        '<span class="dim">🐙</span> github:   <a href="https://github.com/redflox" target="_blank" rel="noopener">@redflox</a>',
        '<span class="dim">🌐</span> website:  <a href="https://bfmu.dev/" target="_blank" rel="noopener">bfmu.dev</a>',
      ]);
    },
  },
  {
    name: 'lang',
    description: 'switch language: lang es | en',
    run(args, ctx) {
      const next = args[0];
      if (next !== 'es' && next !== 'en') {
        ctx.print(
          `<span class="dim">current:</span> <span class="kw">${currentLang()}</span> <span class="dim">· usage: lang es | en</span>`
        );
        return;
      }
      const html = document.documentElement;
      html.dataset.lang = next;
      html.lang = next;
      try {
        localStorage.setItem('bf-lang', next);
      } catch { /* ignore */ }
      ctx.print(`<span class="dim">language →</span> <span class="kw">${next}</span>`);
    },
  },
  {
    name: 'goto',
    description: 'jump to a section: goto hero | experiencia | proyectos | contacto',
    run(args, ctx) {
      const id = args[0];
      if (!id) {
        ctx.print('<span class="dim">usage:</span> goto &lt;section-id&gt;');
        return;
      }
      const target = document.getElementById(id);
      if (target) {
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        ctx.close();
      } else {
        window.location.assign(`/#${encodeURIComponent(id)}`);
      }
    },
  },
  {
    name: 'theme',
    description: 'show / change theme',
    run(_args, ctx) {
      ctx.print([
        '<span class="dim">current:</span>   <span class="kw">catppuccin-mocha</span>',
        '<span class="dim">available:</span> <span class="kw">catppuccin-mocha</span> <span class="dim">(only flavor for now)</span>',
      ]);
    },
  },
  {
    name: 'clear',
    aliases: ['cls'],
    description: 'clear the terminal',
    run(_args, ctx) {
      ctx.clear();
    },
  },
  {
    name: 'exit',
    aliases: ['close', 'q', 'quit'],
    description: 'close the terminal',
    run(_args, ctx) {
      ctx.close();
    },
  },

  // ---------- easter eggs ----------

  {
    name: 'git',
    description: 'try: git log · git status · git blame',
    run(args, ctx) {
      const sub = args[0];
      if (sub === 'log') {
        const log = ctx.data.gitLog ?? [];
        if (log.length === 0) {
          ctx.print('<span class="dim">no history</span>');
          return;
        }
        const lines = log.map((line) => {
          const [hash, ...rest] = line.split(' ');
          return `<span class="num">${escapeHtml(hash)}</span> <span class="dim">${escapeHtml(rest.join(' '))}</span>`;
        });
        ctx.print(['<span class="dim">$ git log --oneline -10</span>', ...lines]);
        return;
      }
      if (sub === 'status') {
        ctx.print([
          '<span class="dim">on branch</span> <span class="kw">redesign/v2-ide</span>',
          '<span class="ok">nothing to commit, working tree clean</span>',
        ]);
        return;
      }
      if (sub === 'blame') {
        ctx.print('<span class="dim">100% —</span> <span class="num">Bryan Muñoz</span>');
        return;
      }
      if (sub === 'push' || sub === 'pull' || sub === 'commit') {
        ctx.print(`<span class="tag">git ${escapeHtml(sub)}:</span> read-only terminal — try the real one`);
        return;
      }
      ctx.print([
        `<span class="dim">git: '${escapeHtml(sub ?? '')}' is not a portfolio command.</span>`,
        '<span class="dim">try:</span> <span class="kw">git log</span> <span class="dim">·</span> <span class="kw">git status</span> <span class="dim">·</span> <span class="kw">git blame</span>',
      ]);
    },
  },
  {
    name: 'sudo',
    description: 'try to elevate (spoiler: nope)',
    run(_args, ctx) {
      ctx.print([
        '<span class="tag">sudo:</span> permission denied',
        '<span class="dim">try with</span> <span class="kw">please</span> <span class="dim">😉</span>',
      ]);
    },
  },
  {
    name: 'please',
    description: 'magic word — runs the rest with politeness',
    run(args, ctx) {
      if (args.length === 0) {
        ctx.print('<span class="dim">usage:</span> please &lt;command&gt;');
        return;
      }
      const head = args[0];
      if (head === 'sudo' || head === 'please') {
        ctx.print('<span class="dim">manners noted; redundancy too.</span>');
        return;
      }
      ctx.print('<span class="ok">since you asked nicely…</span>');
      dispatchCommand(args.join(' '), ctx);
    },
  },
  {
    name: 'rm',
    description: 'delete things — careful',
    hidden: true,
    run(args, ctx) {
      const target = args.join(' ');
      if (target.includes('-rf') && (target.includes('/') || target.includes('~') || target.includes('*'))) {
        ctx.print([
          '<span class="tag">nice try.</span> this terminal is read-only.',
          '<span class="dim">if you need to clean up, just close the tab.</span>',
        ]);
        return;
      }
      ctx.print(`<span class="dim">file not found:</span> ${escapeHtml(target || '<empty>')}`);
    },
  },
  {
    name: 'vim',
    aliases: ['nano', 'emacs', 'vi', 'code'],
    description: 'open an editor (kind of)',
    hidden: true,
    run(_args, ctx) {
      ctx.print(
        '<span class="dim">no editor here. try</span> <span class="kw">cat &lt;slug&gt;</span> <span class="dim">to inspect a project.</span>'
      );
    },
  },
  {
    name: 'npm',
    aliases: ['pnpm', 'yarn', 'bun'],
    description: 'package manager',
    hidden: true,
    run(args, ctx) {
      const sub = args[0];
      if ((sub === 'run' && args[1] === 'dev') || sub === 'dev' || sub === 'start') {
        ctx.print('<span class="ok">✓</span> dev server is already running — you\'re looking at it.');
        return;
      }
      if (sub === 'install' || sub === 'i') {
        ctx.print('<span class="dim">already installed.</span>');
        return;
      }
      if (sub === 'audit') {
        ctx.print('<span class="ok">found 0 vulnerabilities</span> <span class="dim">(it\'s a static site)</span>');
        return;
      }
      ctx.print([
        '<span class="dim">no package manager available here.</span>',
        '<span class="dim">this site is static — built with</span> <span class="kw">astro</span> <span class="dim">+</span> <span class="kw">pnpm</span><span class="dim">.</span>',
      ]);
    },
  },
  {
    name: 'coffee',
    aliases: ['cafecito', 'cafe', '☕'],
    description: 'fuel up',
    run(_args, ctx) {
      ctx.print([
        '       <span class="dim">) )</span>',
        '      <span class="dim">( (</span>',
        '   <span class="num">┌────────┐</span>',
        '   <span class="num">│  </span><span class="acc">☕</span><span class="num">     │</span>',
        '   <span class="num">└────────┘</span>',
        '       <span class="dim">▔▔▔▔▔▔</span>',
        '<span class="dim">made with ♥ in Bogotá</span>',
      ]);
    },
  },
  {
    name: 'joke',
    description: 'random programmer joke',
    run(_args, ctx) {
      const i = Math.floor(Math.random() * JOKES.length);
      ctx.print(`<span class="dim">${JOKES[i]}</span>`);
    },
  },
  {
    name: 'echo',
    description: 'echo back what you say',
    hidden: true,
    run(args, ctx) {
      ctx.print(escapeHtml(args.join(' ')));
    },
  },
];

const aliasIndex = new Map<string, Command>();
for (const cmd of COMMANDS) {
  aliasIndex.set(cmd.name, cmd);
  cmd.aliases?.forEach((a) => aliasIndex.set(a, cmd));
}

/**
 * Names + aliases that start with the given prefix, sorted alphabetically.
 * Used by the terminal's Tab-completion to suggest commands.
 */
export function completionCandidates(prefix: string): string[] {
  if (!prefix) return [];
  const out: string[] = [];
  for (const key of aliasIndex.keys()) {
    if (key.startsWith(prefix)) out.push(key);
  }
  return out.sort();
}

/** Look up + run a command. Echoes a hint when the command is unknown. */
export function dispatchCommand(line: string, ctx: TerminalContext): void {
  const trimmed = line.trim();
  if (!trimmed) return;

  const [head, ...rest] = trimmed.split(/\s+/);
  const cmd = aliasIndex.get(head);
  if (!cmd) {
    ctx.print(
      `<span class="tag">command not found:</span> ${escapeHtml(head)} <span class="dim">— try</span> <span class="kw">help</span>`
    );
    return;
  }
  cmd.run(rest, ctx);
}

export { escapeHtml };
