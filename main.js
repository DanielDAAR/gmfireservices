// ── Scroll reveal ────────────────────────────────────────────────────────────
const reveals = document.querySelectorAll('.reveal');
const observer = new IntersectionObserver((entries) => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      e.target.classList.add('visible');
    }
  });
}, { threshold: 0.1 });
reveals.forEach(el => observer.observe(el));

// ── Nav active link highlight on scroll ──────────────────────────────────────
const sections  = document.querySelectorAll('section[id]');
const navLinks  = document.querySelectorAll('.nav-links a, .nav-drawer a[href^="#"]');

window.addEventListener('scroll', () => {
  let current = '';
  sections.forEach(s => {
    if (window.scrollY >= s.offsetTop - 100) current = s.id;
  });
  navLinks.forEach(a => {
    a.style.color = a.getAttribute('href') === '#' + current ? '#fff' : '';
  });
});

// ── Hamburger / Drawer ───────────────────────────────────────────────────────
(function () {
  const hamburger = document.getElementById('navHamburger');
  const drawer    = document.getElementById('navDrawer');
  const overlay   = document.getElementById('navOverlay');

  if (!hamburger || !drawer || !overlay) return;

  function openDrawer() {
    drawer.classList.add('open');
    overlay.classList.add('visible');
    hamburger.classList.add('open');
    hamburger.setAttribute('aria-expanded', 'true');
    document.body.style.overflow = 'hidden';
  }

  function closeDrawer() {
    drawer.classList.remove('open');
    overlay.classList.remove('visible');
    hamburger.classList.remove('open');
    hamburger.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
  }

  hamburger.addEventListener('click', () => {
    drawer.classList.contains('open') ? closeDrawer() : openDrawer();
  });

  overlay.addEventListener('click', closeDrawer);

  drawer.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', closeDrawer);
  });

  document.addEventListener('keydown', e => {
    if (e.key === 'Escape') closeDrawer();
  });

  window.matchMedia('(min-width: 769px)').addEventListener('change', e => {
    if (e.matches) closeDrawer();
  });
})();

// ── SOLUCIÓN PARA MÓVILES: scroll con offset por el menú fijo ────────────────
(function() {
  // Altura del menú fijo (se ajusta automáticamente a la altura real del nav)
  const getNavHeight = () => {
    const nav = document.querySelector('nav');
    return nav ? nav.offsetHeight : 64;
  };

  // Offset adicional para que la sección quede más visible (20px)
  const OFFSET = 20;

  // Selecciona todos los enlaces internos (los que empiezan con #)
  const internalLinks = document.querySelectorAll('a[href^="#"]');

  internalLinks.forEach(link => {
    link.addEventListener('click', function(e) {
      const href = this.getAttribute('href');
      // Ignorar si es solo "#" o está vacío
      if (href === '#' || href === '') return;

      const targetId = href.substring(1);
      const targetElement = document.getElementById(targetId);
      if (!targetElement) return;

      e.preventDefault();

      const navHeight = getNavHeight();
      const targetPosition = targetElement.getBoundingClientRect().top + window.scrollY;
      const offsetPosition = targetPosition - navHeight - OFFSET;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });

      // Opcional: actualizar la URL sin recargar
      history.pushState(null, null, href);
    });
  });
})();
