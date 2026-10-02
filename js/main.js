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


/* ---- Reveal animations on scroll (bidirectional) ---- */
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    const el = entry.target;
    if (entry.isIntersecting) {
      el.classList.add('is-visible');
      // Remove reveal/direction classes after animation so hover transitions work
      const t = setTimeout(() => {
        ['from-up', 'from-left', 'from-right'].forEach(c => {
          if (el.classList.contains(c)) el.dataset.revealDir = c;
        });
        el.classList.remove('reveal', 'from-up', 'from-left', 'from-right');
        el._revealTimer = null;
      }, 1000);
      el._revealTimer = t;
    } else {
      // Cancel pending class-removal if element left before animation finished
      if (el._revealTimer) { clearTimeout(el._revealTimer); el._revealTimer = null; }
      // Animate out only if element was already visible
      if (el.classList.contains('is-visible')) {
        const dir = el.dataset.revealDir ||
          ['from-up', 'from-left', 'from-right'].find(c => el.classList.contains(c));
        if (!el.classList.contains('reveal')) {
          el.classList.add('reveal');
          if (dir) el.classList.add(dir);
        }
        requestAnimationFrame(() => requestAnimationFrame(() => {
          el.classList.remove('is-visible');
        }));
      }
    }
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


/* ---- Animated <details> accordions ---- */
document.querySelectorAll('details').forEach(el => {
  const summary = el.querySelector(':scope > summary');
  const body    = el.querySelector(':scope > :not(summary)');
  if (!summary || !body) return;

  body.style.overflow = 'hidden';
  if (!el.open) {
    body.style.maxHeight = '0px';
    body.style.opacity   = '0';
  }

  summary.addEventListener('click', e => {
    e.preventDefault();
    if (el.open) {
      // closing
      body.style.transition = 'max-height 0.5s cubic-bezier(0.4,0,0.2,1), opacity 0.35s';
      body.style.maxHeight  = body.scrollHeight + 'px';
      requestAnimationFrame(() => requestAnimationFrame(() => {
        body.style.maxHeight = '0px';
        body.style.opacity   = '0';
      }));
      setTimeout(() => { el.open = false; }, 520);
    } else {
      // opening
      el.open = true;
      body.style.transition = 'max-height 0.65s cubic-bezier(0.22,1,0.36,1), opacity 0.45s 0.08s';
      requestAnimationFrame(() => {
        body.style.maxHeight = body.scrollHeight + 'px';
        body.style.opacity   = '1';
        setTimeout(() => { if (el.open) body.style.maxHeight = 'none'; }, 680);
      });
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


/* ---- SUMATE inline form — Google Sheets ---- */
const SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbw6-eE7tpleJ2-FEJQdE49XVHdzUe-7sbEDQ43UioSd6eY7vXGXqxr2bwR1warJR1H1/exec';

const sumateForm    = document.getElementById('sumateMainForm');
const sumateBtn     = document.getElementById('sumateSubmit');
const sumateSuccess = document.getElementById('sumateSuccess');

if (sumateForm) {
  sumateForm.addEventListener('submit', async e => {
    e.preventDefault();
    sumateBtn.disabled    = true;
    sumateBtn.textContent = 'ENVIANDO...';

    const data = {
      nombre:   document.getElementById('s_nombre').value,
      apellido: document.getElementById('s_apellido').value,
      email:    document.getElementById('s_email').value,
      telefono: document.getElementById('s_tel').value,
      zona:     document.getElementById('s_zona').value,
      difusion: document.getElementById('s_difusion').checked,
    };

    try {
      const url = new URL(SCRIPT_URL);
      Object.entries(data).forEach(([k, v]) => url.searchParams.append(k, String(v)));
      await fetch(url.toString(), { mode: 'no-cors' });
      sumateForm.style.display    = 'none';
      sumateSuccess.style.display = 'block';
    } catch {
      sumateBtn.disabled    = false;
      sumateBtn.textContent = 'ENVIAR ADHESIÓN →';
      alert('Hubo un error al enviar. Por favor intentá de nuevo.');
    }
  });
}

/* ---- NOVEDADES CAROUSEL ---- */
(function () {
  const track    = document.getElementById('novedadesTrack');
  const btnPrev  = document.getElementById('carouselPrev');
  const btnNext  = document.getElementById('carouselNext');
  if (!track || !btnPrev || !btnNext) return;

  const AUTOPLAY_MS  = 4500;
  const RESUME_DELAY = 8000;
  let autoTimer  = null;
  let resumeTimer = null;

  function hasOverflow() {
    return track.scrollWidth > track.clientWidth + 2;
  }

  function cardStep() {
    const card = track.querySelector('.news-card');
    if (!card) return 1;
    const gap = parseFloat(getComputedStyle(track).gap) || 12;
    return card.offsetWidth + gap;
  }

  function currentIndex() {
    return Math.round(track.scrollLeft / cardStep());
  }

  function scrollTo(idx) {
    const total = track.querySelectorAll('.news-card').length;
    idx = ((idx % total) + total) % total;
    track.scrollTo({ left: idx * cardStep(), behavior: 'smooth' });
  }

  function updateButtons() {
    const show = hasOverflow();
    btnPrev.hidden = !show;
    btnNext.hidden = !show;
  }

  function advance() {
    if (!hasOverflow()) return;
    scrollTo(currentIndex() + 1);
  }

  function startAutoplay() {
    if (autoTimer) return;
    autoTimer = setInterval(advance, AUTOPLAY_MS);
  }

  function stopAutoplay() {
    clearInterval(autoTimer);
    autoTimer = null;
  }

  function pauseAutoplay() {
    stopAutoplay();
    clearTimeout(resumeTimer);
    resumeTimer = setTimeout(startAutoplay, RESUME_DELAY);
  }

  btnPrev.addEventListener('click', () => { scrollTo(currentIndex() - 1); pauseAutoplay(); });
  btnNext.addEventListener('click', () => { scrollTo(currentIndex() + 1); pauseAutoplay(); });
  track.addEventListener('scroll',     updateButtons, { passive: true });
  track.addEventListener('touchstart', pauseAutoplay, { passive: true });

  updateButtons();
  startAutoplay();

  window.addEventListener('resize', updateButtons);
})();


/* ---- Timeline line animation ---- */
const timelineEl = document.getElementById('timelineEl');
if (timelineEl) revealObserver.observe(timelineEl);
