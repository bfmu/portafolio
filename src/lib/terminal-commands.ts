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

export interface TerminalContext {
  print: (lines: string | string[]) => void;
  clear: () => void;
  close: () => void;
  data: { projects: ProjectInfo[] };
}

export interface Command {
  name: string;
  description: string;
  aliases?: string[];
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

export const COMMANDS: Command[] = [
  {
    name: 'help',
    description: 'list available commands',
    aliases: ['?'],
    run(_args, ctx) {
      const rows = COMMANDS.map((c) => {
        const padded = c.name.padEnd(12);
        return `  <span class="kw">${padded}</span><span class="dim">${c.description}</span>`;
      });
      ctx.print([
        '<span class="dim">commands available — args go after a space</span>',
        ...rows,
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
    name: 'clear',
    aliases: ['cls'],
    description: 'clear the terminal',
    run(_args, ctx) {
      ctx.clear();
    },
  },
  {
    name: 'exit',
    aliases: ['close', 'q'],
    description: 'close the terminal',
    run(_args, ctx) {
      ctx.close();
    },
  },
];

const aliasIndex = new Map<string, Command>();
for (const cmd of COMMANDS) {
  aliasIndex.set(cmd.name, cmd);
  cmd.aliases?.forEach((a) => aliasIndex.set(a, cmd));
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
