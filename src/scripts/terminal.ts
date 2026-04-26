import {
  COMMANDS,
  dispatchCommand,
  escapeHtml,
  type ProjectInfo,
  type TerminalContext,
} from '../lib/terminal-commands';

const HISTORY_LIMIT = 50;

type State = 'closed' | 'open' | 'max';

interface BakedData {
  projects: ProjectInfo[];
}

function readBakedData(): BakedData {
  const el = document.getElementById('terminal-data');
  if (!el || !el.textContent) return { projects: [] };
  try {
    return JSON.parse(el.textContent) as BakedData;
  } catch {
    return { projects: [] };
  }
}

/**
 * Wires the terminal panel: open/close state, command input, history,
 * and a click delegate for toggle/close/maximize controls. Idempotent —
 * mounts at most once per page.
 */
export function setupTerminal(): void {
  if (typeof document === 'undefined') return;

  const panel = document.querySelector<HTMLElement>('[data-terminal]');
  const output = panel?.querySelector<HTMLElement>('[data-terminal-output]');
  const input = panel?.querySelector<HTMLInputElement>('[data-terminal-input]');
  if (!panel || !output || !input) return;
  if (panel.dataset.mounted === 'true') return;
  panel.dataset.mounted = 'true';

  const data = readBakedData();

  const setState = (state: State) => {
    panel.dataset.state = state;
    if (state === 'closed') {
      panel.setAttribute('hidden', '');
    } else {
      panel.removeAttribute('hidden');
      // Defer focus so the panel finishes layout first.
      requestAnimationFrame(() => input.focus());
    }
  };

  const print = (lines: string | string[]) => {
    const arr = Array.isArray(lines) ? lines : [lines];
    for (const html of arr) {
      const div = document.createElement('div');
      div.className = 'terminal__line';
      div.innerHTML = html;
      output.appendChild(div);
    }
    output.scrollTop = output.scrollHeight;
  };

  const clear = () => {
    output.innerHTML = '';
  };

  const close = () => setState('closed');

  const ctx: TerminalContext = { print, clear, close, data };

  // History: arrow up / arrow down navigate previously entered lines.
  const history: string[] = [];
  let historyIdx = -1;

  const echoCommand = (line: string) => {
    print(`<span class="prompt-arrow">$</span> <span class="var">${escapeHtml(line)}</span>`);
  };

  input.addEventListener('keydown', (event) => {
    if (event.key === 'Enter') {
      event.preventDefault();
      const value = input.value;
      if (value.trim()) {
        history.push(value);
        if (history.length > HISTORY_LIMIT) history.shift();
        historyIdx = history.length;
        echoCommand(value);
        dispatchCommand(value, ctx);
      }
      input.value = '';
      return;
    }
    if (event.key === 'ArrowUp') {
      event.preventDefault();
      if (history.length === 0) return;
      historyIdx = Math.max(0, historyIdx - 1);
      input.value = history[historyIdx] ?? '';
      // Move caret to end after value swap.
      requestAnimationFrame(() => input.setSelectionRange(input.value.length, input.value.length));
      return;
    }
    if (event.key === 'ArrowDown') {
      event.preventDefault();
      if (historyIdx >= history.length - 1) {
        historyIdx = history.length;
        input.value = '';
      } else {
        historyIdx += 1;
        input.value = history[historyIdx] ?? '';
      }
      return;
    }
    if (event.key === 'Escape') {
      event.preventDefault();
      close();
      return;
    }
  });

  // Panel header actions (close + maximize) and outside toggle buttons.
  document.addEventListener('click', (event) => {
    const target = event.target as Element | null;
    const action = target?.closest<HTMLElement>('[data-terminal-action]')?.dataset.terminalAction;
    if (action === 'close') {
      close();
      return;
    }
    if (action === 'maximize') {
      setState(panel.dataset.state === 'max' ? 'open' : 'max');
      return;
    }
    if (target?.closest<HTMLElement>('[data-terminal-toggle]')) {
      setState(panel.dataset.state === 'closed' ? 'open' : 'closed');
    }
  });

  // VSCode-style shortcut: Ctrl+` toggles the terminal.
  document.addEventListener('keydown', (event) => {
    if (event.ctrlKey && event.key === '`') {
      event.preventDefault();
      setState(panel.dataset.state === 'closed' ? 'open' : 'closed');
    }
  });

  // Welcome banner. Listing commands here makes the menu obvious without
  // forcing the user to type `help` first.
  setState('closed');
  const welcome: string[] = [
    `<span class="dim">portfolio terminal</span> <span class="kw">v1.0</span> <span class="dim">— ctrl+\` to toggle</span>`,
    `<span class="dim">type</span> <span class="kw">help</span> <span class="dim">to see all commands · or pick one:</span>`,
  ];
  const sample = ['help', 'whoami', 'projects', 'experience', 'contact', 'lang'];
  welcome.push(
    '  ' + sample.map((c) => `<span class="kw">${c}</span>`).join('  ')
  );
  print(welcome);
  // Sanity: make sure the imported registry isn't tree-shaken away.
  void COMMANDS.length;
}
