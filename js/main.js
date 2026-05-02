/* ============================================================
   MOVETE BOEDO MOVETE — main.js
============================================================ */

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
  { id: 'quienes',     num: '01', label: 'QUIÉNES SOMOS' },
  { id: 'hicimos',     num: '02', label: 'QUÉ HICIMOS'   },
  { id: 'porque',      num: '03', label: 'POR QUÉ'        },
  { id: 'candidatos',  num: '04', label: 'CANDIDATOS'     },
  { id: 'situacion',   num: '05', label: 'SITUACIÓN'      },
  { id: 'compromisos', num: '06', label: 'COMPROMISOS'    },
  { id: 'propuestas',  num: '07', label: 'PROPUESTAS'     },
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
