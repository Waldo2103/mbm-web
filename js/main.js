/* ============================================================
   MOVETE BOEDO MOVETE — main.js
============================================================ */

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


/* ---- ACORDEÓN ---- */
const triggers = document.querySelectorAll('.acc-trigger');

triggers.forEach(trigger => {
  trigger.addEventListener('click', () => {
    const isOpen = trigger.getAttribute('aria-expanded') === 'true';
    const bodyId = trigger.getAttribute('aria-controls');
    const body   = document.getElementById(bodyId);

    if (isOpen) {
      // Cerrar
      trigger.setAttribute('aria-expanded', 'false');
      body.classList.remove('open');

      // Reset animaciones para que vuelvan a entrar la próxima vez
      body.querySelectorAll('.reveal').forEach(el => {
        el.classList.remove('is-visible');
      });
    } else {
      // Abrir
      trigger.setAttribute('aria-expanded', 'true');
      body.classList.add('open');

      // Disparar reveals con stagger — vuelo de cuervo
      const revealEls = body.querySelectorAll('.reveal');
      revealEls.forEach((el, i) => {
        // Respeta el transition-delay ya definido en CSS (0.08s por item)
        // Agregamos un pequeño retardo base para que el panel abra primero
        setTimeout(() => {
          el.classList.add('is-visible');
        }, 80 + i * 70);
      });
    }
  });
});


/* ---- SUMATE section: reveals on scroll (fuera del acordeón) ---- */
const sumateReveals = document.querySelectorAll('.sumate .reveal');

const scrollObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('is-visible');
      scrollObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.15 });

sumateReveals.forEach(el => scrollObserver.observe(el));


/* ---- Section indicator (badge bottom-right) ---- */
const sections = [
  { id: 'quienes',    num: '01', label: 'QUIÉNES SOMOS'     },
  { id: 'hicimos',    num: '02', label: 'NUESTRO RECORRIDO'  },
  { id: 'porque',     num: '03', label: 'POR QUÉ'            },
  { id: 'candidatos', num: '04', label: 'NUESTRO PRESIDENTE' },
  { id: 'lista',      num: '05', label: 'NUESTRA LISTA'      },
  { id: 'situacion',  num: '06', label: 'CUADRO SITUACIÓN'   },
  { id: 'valores',    num: '07', label: 'NUESTROS VALORES'   },
  { id: 'compromisos',num: '08', label: 'NUESTRO COMPROMISO' },
  { id: 'propuestas', num: '09', label: 'PROPUESTAS'         },
];

const indicator = document.getElementById('secIndicator');
const indNum    = document.getElementById('indNum');
const indLabel  = document.getElementById('indLabel');

const sectionObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (!entry.isIntersecting) return;
    if (entry.target.id === 'hero') {
      indicator.classList.remove('visible');
      return;
    }
    const match = sections.find(s => s.id === entry.target.id);
    if (match) {
      indNum.textContent   = match.num;
      indLabel.textContent = match.label;
      indicator.classList.add('visible');
    }
  });
}, { threshold: 0.4 });

const heroEl = document.getElementById('hero');
if (heroEl) sectionObserver.observe(heroEl);
sections.forEach(s => {
  const el = document.getElementById(s.id);
  if (el) sectionObserver.observe(el);
});


/* ---- Nav active link ---- */
const navLinks = document.querySelectorAll('.nav__links a');

const navObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (!entry.isIntersecting) return;
    navLinks.forEach(a => a.classList.remove('active'));
    const active = document.querySelector(`.nav__links a[href="#${entry.target.id}"]`);
    if (active) active.classList.add('active');
  });
}, { threshold: 0.4 });

sections.forEach(s => {
  const el = document.getElementById(s.id);
  if (el) navObserver.observe(el);
});


/* ---- COUNTDOWN ---- */
// 3 mayo 2026 11:00 hs ART (UTC-3) = 14:00 UTC
const eventDate = new Date('2026-05-03T14:00:00Z');

function updateCountdown() {
  const diff = eventDate - new Date();

  if (diff <= 0) {
    const el = document.getElementById('countdown');
    if (el) el.remove();
    return;
  }

  const hours = Math.floor(diff / 36e5);
  const mins  = Math.floor((diff % 36e5) / 6e4);
  const secs  = Math.floor((diff % 6e4)  / 1e3);

  const pad = n => String(n).padStart(2, '0');
  document.getElementById('cd-hours').textContent = pad(hours);
  document.getElementById('cd-mins').textContent  = pad(mins);
  document.getElementById('cd-secs').textContent  = pad(secs);
}

updateCountdown();
setInterval(updateCountdown, 1000);


/* ---- Accordion section entrance animation (alterna izq/der) ---- */
const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

if (!prefersReducedMotion) {
  const accSectionEls = document.querySelectorAll('.acc-section');
  const transition = 'opacity 0.72s cubic-bezier(0.22,1,0.36,1), transform 0.72s cubic-bezier(0.22,1,0.36,1)';

  accSectionEls.forEach((section, i) => {
    const trigger = section.querySelector('.acc-trigger');
    trigger.style.opacity   = '0';
    trigger.style.transform = i % 2 === 0 ? 'translateX(-56px)' : 'translateX(56px)';
    trigger.style.transition = transition;
  });

  const accEntranceObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const trigger = entry.target.querySelector('.acc-trigger');
      trigger.style.opacity   = '1';
      trigger.style.transform = 'none';
      accEntranceObserver.unobserve(entry.target);
    });
  }, { threshold: 0.12 });

  accSectionEls.forEach(s => accEntranceObserver.observe(s));
}


/* ---- CARRUSEL ---- */
(function () {
  const track = document.getElementById('carouselTrack');
  const dots  = document.querySelectorAll('.carousel__dot');
  if (!track || !dots.length) return;

  const total = dots.length;
  let current = 0;
  let timer;

  function goTo(i) {
    current = (i + total) % total;
    track.style.transform = `translateX(-${current * 100}%)`;
    dots.forEach((d, idx) => d.classList.toggle('carousel__dot--active', idx === current));
  }

  dots.forEach((dot, i) => dot.addEventListener('click', () => { clearInterval(timer); goTo(i); startAuto(); }));

  function startAuto() { timer = setInterval(() => goTo(current + 1), 3500); }
  startAuto();
})();


/* ---- Smooth scroll ---- */
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
