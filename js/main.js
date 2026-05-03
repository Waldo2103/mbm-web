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


/* ---- Floating SUMATE button (aparece al salir del hero) ---- */
const sections = [
  { id: 'quienes'    },
  { id: 'hicimos'    },
  { id: 'porque'     },
  { id: 'candidatos' },
  { id: 'lista'      },
  { id: 'situacion'  },
  { id: 'valores'    },
  { id: 'compromisos'},
  { id: 'propuestas' },
];

const floatSumate = document.getElementById('floatSumate');
const heroEl      = document.getElementById('hero');

if (floatSumate && heroEl) {
  const heroObserver = new IntersectionObserver((entries) => {
    floatSumate.classList.toggle('visible', !entries[0].isIntersecting);
  }, { threshold: 0 });
  heroObserver.observe(heroEl);
}


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
