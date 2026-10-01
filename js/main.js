/* ============================================================
   MOVETE BOEDO MOVETE — main.js (redesign 2026)
============================================================ */

/* ---- Scroll al tope ---- */
if ('scrollRestoration' in history) history.scrollRestoration = 'manual';
window.scrollTo(0, 0);


/* ---- PRELOADER ---- */
(function () {
  const preloader = document.getElementById('preloader');
  if (!preloader) return;

  const MIN_MS = 500;
  const start  = Date.now();

  const hide = () => {
    const wait = Math.max(0, MIN_MS - (Date.now() - start));
    setTimeout(() => {
      preloader.classList.add('preloader--done');
      preloader.addEventListener('transitionend', () => preloader.remove(), { once: true });
    }, wait);
  };

  if (document.fonts && document.fonts.ready) {
    document.fonts.ready.then(hide);
  } else {
    window.addEventListener('load', hide);
  }
})();


/* ---- DRAWER (hamburger nav) ---- */
const navToggle  = document.getElementById('navToggle');
const navDrawer  = document.getElementById('navDrawer');
const navOverlay = document.getElementById('navOverlay');

function openDrawer() {
  navDrawer.classList.add('is-open');
  navOverlay.classList.add('is-open');
  navDrawer.setAttribute('aria-hidden', 'false');
  navToggle.setAttribute('aria-expanded', 'true');
  document.body.style.overflow = 'hidden';
}

function closeDrawer() {
  navDrawer.classList.remove('is-open');
  navOverlay.classList.remove('is-open');
  navDrawer.setAttribute('aria-hidden', 'true');
  navToggle.setAttribute('aria-expanded', 'false');
  document.body.style.overflow = '';
}

if (navToggle)  navToggle.addEventListener('click', () =>
  navDrawer.classList.contains('is-open') ? closeDrawer() : openDrawer()
);
if (navOverlay) navOverlay.addEventListener('click', closeDrawer);

document.querySelectorAll('.nav__drawer-links a').forEach(a =>
  a.addEventListener('click', closeDrawer)
);

document.addEventListener('keydown', e => {
  if (e.key === 'Escape' && navDrawer && navDrawer.classList.contains('is-open')) closeDrawer();
});


/* ---- Active nav link on scroll ---- */
const sections = ['hero', 'novedades', 'gestion', 'recorrido', 'compromisos', 'areas', 'referente', 'sumate'];

const allNavLinks = document.querySelectorAll('.nav__links a, .nav__drawer-links a');

const navObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (!entry.isIntersecting) return;
    allNavLinks.forEach(a => a.classList.remove('active'));
    const href = `#${entry.target.id}`;
    allNavLinks.forEach(a => {
      if (a.getAttribute('href') === href) a.classList.add('active');
    });
  });
}, { rootMargin: '-40% 0px -55% 0px' });

sections.forEach(id => {
  const el = document.getElementById(id);
  if (el) navObserver.observe(el);
});


/* ---- Reveal animations on scroll ---- */
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (!entry.isIntersecting) return;
    entry.target.classList.add('is-visible');
    revealObserver.unobserve(entry.target);
  });
}, { threshold: 0.1 });

document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));


/* ---- Smooth scroll for anchor links ---- */
document.querySelectorAll('a[href^="#"]').forEach(link => {
  link.addEventListener('click', e => {
    const id = link.getAttribute('href').slice(1);
    const target = document.getElementById(id);
    if (target) {
      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  });
});


/* ---- MODAL — Informe 120 días ---- */
(function () {
  if (sessionStorage.getItem('modal120_seen')) return;

  const overlay  = document.getElementById('modalOverlay');
  const dismiss  = document.getElementById('modalDismiss');
  const cta      = document.getElementById('modalCta');
  if (!overlay) return;

  function closeModal() {
    overlay.classList.remove('is-visible');
    overlay.setAttribute('aria-hidden', 'true');
    sessionStorage.setItem('modal120_seen', '1');
  }

  // Mostrar el modal 1.2s después (permite que termine el preloader)
  setTimeout(() => {
    overlay.classList.add('is-visible');
    overlay.setAttribute('aria-hidden', 'false');
  }, 1200);

  dismiss.addEventListener('click', closeModal);
  overlay.addEventListener('click', e => { if (e.target === overlay) closeModal(); });
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape' && overlay.classList.contains('is-visible')) closeModal();
  });
  if (cta) cta.addEventListener('click', () => sessionStorage.setItem('modal120_seen', '1'));
})();


/* ---- SUMATE quick form — redirect to sumate.html ---- */
const quickForm = document.getElementById('sumateQuickForm');
if (quickForm) {
  quickForm.addEventListener('submit', e => {
    e.preventDefault();
    const nombre = quickForm.querySelector('[name="nombre"]').value.trim();
    const email  = quickForm.querySelector('[name="email"]').value.trim();
    const params = new URLSearchParams({ nombre, email });
    window.location.href = `sumate.html?${params.toString()}`;
  });
}
