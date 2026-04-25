/* ==========================================================================
   cursor.js — drag-aware custom cursor
   ========================================================================== */
(function () {
  if (window.matchMedia('(hover: none)').matches) return;

  const cursor = document.createElement('div');
  cursor.className = 'bf-cursor';
  cursor.innerHTML = `
    <div class="bf-cursor__block"></div>
    <svg class="bf-cursor__hand bf-cursor__hand--open" viewBox="0 0 24 24" fill="none" stroke="#cdd6f4" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round">
      <path d="M8 11V6.5a1.5 1.5 0 0 1 3 0V11"/>
      <path d="M11 11V5.5a1.5 1.5 0 0 1 3 0V11"/>
      <path d="M14 11V6.5a1.5 1.5 0 0 1 3 0V12"/>
      <path d="M17 9a1.5 1.5 0 0 1 3 0v6a6 6 0 0 1-6 6h-1.5a6 6 0 0 1-5.74-4.26L5 13a1.5 1.5 0 0 1 2.6-1.5L8.5 13"/>
    </svg>
    <svg class="bf-cursor__hand bf-cursor__hand--closed" viewBox="0 0 24 24" fill="none" stroke="#fab387" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round">
      <path d="M8 12V8.5a1.5 1.5 0 0 1 3 0V11"/>
      <path d="M11 11V8a1.5 1.5 0 0 1 3 0v3"/>
      <path d="M14 11V8.5a1.5 1.5 0 0 1 3 0V12"/>
      <path d="M17 10.5a1.5 1.5 0 0 1 3 0V15a6 6 0 0 1-6 6h-1.5a6 6 0 0 1-5.74-4.26L5 13.5a1.5 1.5 0 0 1 2.6-1.5L8.5 13.5"/>
    </svg>
  `;
  document.body.appendChild(cursor);

  let tx = -100, ty = -100, x = -100, y = -100;
  let frame;

  function loop() {
    x += (tx - x) * 0.35;
    y += (ty - y) * 0.35;
    cursor.style.transform = `translate3d(${x - 7}px, ${y - 11}px, 0)`;
    frame = requestAnimationFrame(loop);
  }
  loop();

  window.addEventListener('mousemove', (e) => {
    tx = e.clientX;
    ty = e.clientY;
    cursor.classList.remove('is-hidden');
  });
  window.addEventListener('mouseleave', () => cursor.classList.add('is-hidden'));
  window.addEventListener('mouseenter', () => cursor.classList.remove('is-hidden'));

  // hover state detection
  document.addEventListener('mouseover', (e) => {
    const t = e.target;
    if (!(t instanceof Element)) return;
    const drag = t.closest('[data-cursor="drag"]');
    const link = t.closest('a, button, [role="button"], [data-cursor="link"]');
    const text = t.closest('input[type="text"], input[type="email"], textarea, [data-cursor="text"]');
    cursor.classList.toggle('is-drag', !!drag);
    cursor.classList.toggle('is-link', !drag && !!link);
    cursor.classList.toggle('is-text', !drag && !link && !!text);
  });

  // grabbing state for drag zones
  window.addEventListener('mousedown', () => cursor.classList.add('is-grabbing'));
  window.addEventListener('mouseup',   () => cursor.classList.remove('is-grabbing'));
})();
