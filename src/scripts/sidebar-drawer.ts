/**
 * Sidebar-as-drawer behavior for narrow viewports.
 *
 * Desktop: this script is a no-op — CSS keeps the sidebar in the grid.
 * Mobile (<= 880px): the sidebar is moved out of the grid and translated
 *   off-screen by CSS. Toggling adds `.is-open` to slide it in, and to
 *   the backdrop to dim the rest. Outside-tap, ESC, and tapping any
 *   `.tree-file` inside the drawer all close it.
 */
const OPEN = 'is-open';
const BODY_OPEN = 'is-drawer-open';

export function setupSidebarDrawer(): void {
  if (typeof document === 'undefined') return;

  const sidebar  = document.querySelector<HTMLElement>('.sidebar');
  const backdrop = document.querySelector<HTMLElement>('.sidebar__backdrop');
  if (!sidebar || !backdrop) return;

  const isOpen = () => sidebar.classList.contains(OPEN);

  const open = () => {
    sidebar.classList.add(OPEN);
    backdrop.classList.add(OPEN);
    document.body.classList.add(BODY_OPEN);
  };

  const close = () => {
    sidebar.classList.remove(OPEN);
    backdrop.classList.remove(OPEN);
    document.body.classList.remove(BODY_OPEN);
  };

  document.addEventListener('click', (event) => {
    const target = event.target as Element | null;
    if (!target) return;

    if (target.closest('[data-sidebar-toggle]')) {
      event.preventDefault();
      isOpen() ? close() : open();
      return;
    }

    if (target.closest('.sidebar__backdrop')) {
      close();
      return;
    }

    if (isOpen() && target.closest('.tree-file')) {
      // Let the navigation continue; just collapse the drawer.
      close();
    }
  });

  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && isOpen()) {
      event.preventDefault();
      close();
    }
  });
}
