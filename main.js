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

// ── Hamburger / Drawer con control de pointer-events en móvil ────────────────
(function () {
  const hamburger = document.getElementById('navHamburger');
  const drawer    = document.getElementById('navDrawer');
  const overlay   = document.getElementById('navOverlay');

  if (!hamburger || !drawer || !overlay) return;

  const isMobile = () => window.innerWidth <= 768;

  function openDrawer() {
    drawer.classList.add('open');
    overlay.classList.add('visible');
    hamburger.classList.add('open');
    hamburger.setAttribute('aria-expanded', 'true');
    document.body.style.overflow = 'hidden';
    if (isMobile()) {
      overlay.style.pointerEvents = 'auto';   // bloquea clics en el fondo
    }
  }

  function closeDrawer() {
    drawer.classList.remove('open');
    overlay.classList.remove('visible');
    hamburger.classList.remove('open');
    hamburger.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
    if (isMobile()) {
      overlay.style.pointerEvents = 'none';   // deja pasar los clics al contenido
    }
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

  // Inicializar overlay en móvil (deshabilitado para no bloquear)
  if (isMobile()) {
    overlay.style.pointerEvents = 'none';
  }
})();

// ── Scroll suave con offset para menú fijo (funciona en móvil y escritorio) ──
(function() {
  const getNavHeight = () => {
    const nav = document.querySelector('nav');
    return nav ? nav.offsetHeight : 64;
  };
  const OFFSET = 20;

  // Clonamos todos los enlaces internos para eliminar cualquier evento conflictivo
  const internalLinks = document.querySelectorAll('a[href^="#"]');
  internalLinks.forEach(link => {
    const newLink = link.cloneNode(true);
    link.parentNode.replaceChild(newLink, link);

    newLink.addEventListener('click', function(e) {
      const href = this.getAttribute('href');
      if (href === '#' || href === '') return;

      const targetId = href.substring(1);
      const targetElement = document.getElementById(targetId);
      if (!targetElement) return;

      e.preventDefault();
      e.stopPropagation();

      const navHeight = getNavHeight();
      const targetPosition = targetElement.getBoundingClientRect().top + window.scrollY;
      const offsetPosition = targetPosition - navHeight - OFFSET;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });

      history.pushState(null, null, href);
    });
  });
})();

// ── Forzar clickeabilidad en móviles (elimina cualquier pointer-events no deseado) ──
(function ensureMobileClicks() {
  if ('ontouchstart' in window) {
    const allClickable = document.querySelectorAll('a, button, .btn-primary, .btn-secondary, .wa-btn, .maps-btn, .footer-contact-row');
    allClickable.forEach(el => {
      el.style.cursor = 'pointer';
      el.style.pointerEvents = 'auto';
      // Pequeño touchstart para activar la respuesta táctil
      el.addEventListener('touchstart', () => {});
    });
  }
})();
