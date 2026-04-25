/**
 * Toggle handler for collapsible folders in the sidebar tree.
 *
 * A folder is any element with `[data-folder]`; its immediate next sibling is
 * expected to be a `.tree-children` container. The class `is-open` drives the
 * chevron rotation; `max-height` drives the smooth collapse.
 */
export function setupSidebarFolders(): void {
  if (typeof document === 'undefined') return;

  document.addEventListener('click', (event) => {
    const target = event.target as Element | null;
    const folder = target?.closest('[data-folder]');
    if (!(folder instanceof HTMLElement)) return;

    event.preventDefault();
    const isOpen = folder.classList.toggle('is-open');
    const next = folder.nextElementSibling;
    if (next instanceof HTMLElement && next.classList.contains('tree-children')) {
      next.style.maxHeight = isOpen ? '1000px' : '0px';
    }
  });
}
