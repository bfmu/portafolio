/* ==========================================================================
   shared.js — i18n toggle, reveal-on-scroll, magnetic buttons, typewriter
   ========================================================================== */

/* ---------- i18n toggle ---------- */
(function () {
  const KEY = 'bf-lang';
  const initial = localStorage.getItem(KEY) || 'es';
  document.documentElement.setAttribute('data-lang', initial);

  document.addEventListener('click', (e) => {
    const btn = e.target.closest('[data-lang-toggle]');
    if (!btn) return;
    const next = document.documentElement.getAttribute('data-lang') === 'es' ? 'en' : 'es';
    document.documentElement.setAttribute('data-lang', next);
    localStorage.setItem(KEY, next);
    document.dispatchEvent(new CustomEvent('lang:changed', { detail: { lang: next }}));
  });
})();

/* ---------- Reveal on scroll ---------- */
(function () {
  const io = new IntersectionObserver((entries) => {
    entries.forEach((en) => {
      if (en.isIntersecting) {
        en.target.classList.add('is-visible');
        io.unobserve(en.target);
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

  document.addEventListener('DOMContentLoaded', () => {
    document.querySelectorAll('.reveal').forEach((el) => io.observe(el));
  });
})();

/* ---------- Magnetic buttons ---------- */
(function () {
  function attach(el) {
    const strength = Number(el.dataset.magneticStrength || 18);
    el.addEventListener('mousemove', (e) => {
      const r = el.getBoundingClientRect();
      const dx = e.clientX - (r.left + r.width / 2);
      const dy = e.clientY - (r.top + r.height / 2);
      el.style.transform = `translate(${dx / r.width * strength}px, ${dy / r.height * strength}px)`;
    });
    el.addEventListener('mouseleave', () => {
      el.style.transform = '';
    });
  }
  document.addEventListener('DOMContentLoaded', () => {
    document.querySelectorAll('.magnetic').forEach(attach);
  });
})();

/* ---------- Typewriter (data-typewriter / data-tw-* attributes) ---------- */
function typewriter(el, text, opts = {}) {
  return new Promise((resolve) => {
    const speed = opts.speed || 32;
    const start = opts.start || 0;
    let i = 0;
    el.textContent = '';
    setTimeout(function tick() {
      if (i <= text.length) {
        el.textContent = text.slice(0, i);
        i++;
        setTimeout(tick, speed);
      } else {
        resolve();
      }
    }, start);
  });
}
window.bfTypewriter = typewriter;
