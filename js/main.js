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
const sections = ['hero', 'novedades', 'quienes', 'hicimos', 'resguardo', 'cd', 'situacion', 'referente', 'sumate'];

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
  const summary  = el.querySelector(':scope > summary');
  const children = [...el.children].filter(c => c !== summary);
  if (!summary || !children.length) return;

  // Wrap all non-summary children so the whole body animates as one unit
  const body = document.createElement('div');
  body.className = 'details-body';
  children.forEach(c => body.appendChild(c));
  el.appendChild(body);

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

/* ---- MODAL — Aventura: Gestión CD ---- */
(function () {
  const AREAS = [
    {
      id: 'handball',
      label: 'HANDBALL',
      sub: 'Becas e infraestructura en Boedo',
      desc: 'Impulsamos becas para atletas de alto rendimiento y trabajamos para reducir costos llevando los partidos al Predio Alloni en Boedo.',
      href: 'recursos/120dias.html#handball',
      icon: '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><path d="M12 2a14.5 14.5 0 0 0 4 10 14.5 14.5 0 0 0-4 10 14.5 14.5 0 0 0-4-10 14.5 14.5 0 0 0 4-10"/><line x1="2" y1="12" x2="22" y2="12"/></svg>'
    },
    {
      id: 'hockey',
      label: 'HOCKEY SOBRE PATINES',
      sub: 'Copa Nacional y sponsors propios',
      desc: 'Cubrimos el transporte a la Copa Nacional en Mendoza y San Juan, articulamos con Peñas de Cuyo y trabajamos en un mecanismo de sponsors propios para el equipo.',
      href: 'recursos/120dias.html#hockey',
      icon: '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><path d="m4.93 4.93 4.24 4.24"/><path d="m14.83 9.17 4.24-4.24"/><path d="m14.83 14.83 4.24 4.24"/><path d="m9.17 14.83-4.24 4.24"/><circle cx="12" cy="12" r="4"/></svg>'
    },
    {
      id: 'social',
      label: 'ACCIÓN SOCIAL',
      sub: 'Campaña de Abrigo · Día de las Infancias',
      desc: 'Campaña de Abrigo con Peña de Wilde y donaciones al interior. Día de las Infancias en Boedo, Peñas, disciplinas deportivas e instituciones comunitarias.',
      href: 'recursos/120dias.html#social',
      icon: '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>'
    },
    {
      id: 'legal',
      label: 'RESGUARDO INSTITUCIONAL',
      sub: 'Cupo femenino y acceso a información',
      desc: 'La IGJ hizo lugar al reclamo por el cupo femenino. Presentamos notas para acceder a balances, auditorías, contratos y documentación del Club.',
      href: 'recursos/120dias.html#legal',
      icon: '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="m16 16 3-8 3 8c-.87.65-1.92 1-3 1s-2.13-.35-3-1z"/><path d="m2 16 3-8 3 8c-.87.65-1.92 1-3 1s-2.13-.35-3-1z"/><path d="M7 21h10"/><line x1="12" y1="3" x2="12" y2="21"/><path d="M3 7h2c2 0 5-1 7-2 2 1 5 2 7 2h2"/></svg>'
    },
    {
      id: 'cd',
      label: 'COMISIÓN DIRECTIVA',
      sub: '4 reuniones · 13 temas votados',
      desc: 'Cada voto con fundamentos y análisis legal previo. Vocal: Lucía Rojas Albornoz.',
      href: 'recursos/120dias.html#cd',
      icon: '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>'
    },
    {
      id: 'federal',
      label: 'PROPUESTAS AL CLUB',
      sub: 'Socios, Fundación, CD y recital',
      desc: 'Campaña nacional de socios, Fundación Lorenzo Massa, reordenamiento de la Ciudad Deportiva y recital en el Pedro Bidegain.',
      href: 'recursos/120dias.html#federal',
      icon: '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg>'
    }
  ];

  const overlay = document.getElementById('modalOverlay');
  if (!overlay) return;

  const screenCarta    = document.getElementById('modalScreenCarta');
  const screenArea     = document.getElementById('modalScreenArea');
  const optionsEl      = document.getElementById('modalOptions');
  const areaOverlineEl = document.getElementById('modalAreaOverline');
  const cardIconEl     = document.getElementById('modalCardIcon');
  const titleEl        = document.getElementById('modalTitle');
  const subEl          = document.getElementById('modalCardSub');
  const descEl         = document.getElementById('modalDesc');
  const ctaEl          = document.getElementById('modalCta');
  const progFill       = document.getElementById('modalProgFill');
  const closeBtn       = document.getElementById('modalClose');
  const dismissBtn     = document.getElementById('modalDismiss');
  const backBtn        = document.getElementById('modalBack');

  const readSet = new Set();
  let currentId = null;
  let inTransition = false;

  function buildOptions(excludeId) {
    optionsEl.innerHTML = '';
    let delay = 0;
    AREAS.forEach(area => {
      if (area.id === excludeId) return;
      const btn = document.createElement('button');
      btn.className = 'modal__option modal__option--in' + (readSet.has(area.id) ? ' modal__option--seen' : '');
      btn.style.animationDelay = delay + 'ms';
      btn.innerHTML =
        `<span class="modal__option-icon">${area.icon}</span>` +
        `<span class="modal__option-text"><strong>${area.label}</strong><span>${area.sub}</span></span>`;
      btn.addEventListener('click', () => {
        if (inTransition) return;
        selectArea(area, btn);
      });
      optionsEl.appendChild(btn);
      delay += 45;
    });
  }

  function selectArea(area, clickedBtn) {
    inTransition = true;
    currentId = area.id;
    overlay.querySelector('.modal').scrollTo({ top: 0, behavior: 'smooth' });
    readSet.add(area.id);
    progFill.style.width = `${(readSet.size / AREAS.length) * 100}%`;

    // 1. Animate clicked option: scale-up then implode toward hero
    clickedBtn.classList.add('modal__option--expanding');

    // 2. Determine which hero screen is currently active
    const wasActive = screenCarta.classList.contains('is-active') ? screenCarta : screenArea;

    setTimeout(() => {
      // Start exit animation (keep is-active so animation starts from opacity:1)
      wasActive.classList.add('is-exiting');

      wasActive.addEventListener('animationend', () => {
        wasActive.classList.remove('is-exiting', 'is-active');

        // Populate new area content (after exit, before enter)
        areaOverlineEl.textContent = `◆ ${area.label}`;
        cardIconEl.innerHTML = area.icon;
        titleEl.textContent = area.label;
        subEl.textContent = area.sub;
        descEl.textContent = area.desc;
        ctaEl.href = area.href;

        // Enter area screen
        screenArea.classList.add('is-active', 'is-entering');
        screenArea.addEventListener('animationend', () => {
          screenArea.classList.remove('is-entering');
          inTransition = false;
        }, { once: true });
      }, { once: true });

      // Rebuild options without selected
      buildOptions(area.id);
    }, 150);
  }

  function backToCarta() {
    if (inTransition) return;
    inTransition = true;
    currentId = null;

    screenArea.classList.add('is-exiting-down');
    screenArea.addEventListener('animationend', () => {
      screenArea.classList.remove('is-exiting-down', 'is-active');
      screenCarta.classList.add('is-active', 'is-entering-down');
      screenCarta.addEventListener('animationend', () => {
        screenCarta.classList.remove('is-entering-down');
        inTransition = false;
      }, { once: true });
    }, { once: true });

    buildOptions(null);
  }

  function closeModal() {
    overlay.classList.remove('is-visible');
    overlay.setAttribute('aria-hidden', 'true');
  }

  // Init
  screenCarta.classList.add('is-active');
  buildOptions(null);

  setTimeout(() => {
    overlay.classList.add('is-visible');
    overlay.setAttribute('aria-hidden', 'false');
  }, 1200);

  ctaEl.addEventListener('click', () => {
    readSet.add(currentId);
    progFill.style.width = `${(readSet.size / AREAS.length) * 100}%`;
  });
  backBtn.addEventListener('click', backToCarta);
  closeBtn.addEventListener('click', closeModal);
  dismissBtn.addEventListener('click', closeModal);
  overlay.addEventListener('click', e => { if (e.target === overlay) closeModal(); });
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape' && overlay.classList.contains('is-visible')) closeModal();
  });
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
