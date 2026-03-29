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

// ── SOLUCIÓN: Eliminar elementos fantasma que bloquean clics en móviles ─────
(function fixMobileClickIssues() {
  // Detectar si es móvil por el ancho de pantalla
  const isMobile = () => window.innerWidth <= 768;
  
  // Función para remover cualquier elemento que pueda estar bloqueando clics
  function removeBlockingOverlays() {
    if (!isMobile()) return;
    
    // Buscar elementos que puedan tener pointer-events: none en móvil pero no deberían
    const allElements = document.querySelectorAll('*');
    allElements.forEach(el => {
      const style = window.getComputedStyle(el);
      // Si algún elemento tiene pointer-events: none y no es el overlay/drawer cerrado, forzar a auto
      if (style.pointerEvents === 'none') {
        // Excepciones: overlay y drawer cuando están cerrados
        const isOverlay = el.id === 'navOverlay';
        const isDrawer = el.id === 'navDrawer';
        const isHamburger = el.id === 'navHamburger';
        
        if (!isOverlay && !isDrawer && !isHamburger) {
          el.style.pointerEvents = 'auto';
        }
      }
    });
  }
  
  // Ejecutar al cargar y cada vez que cambie el tamaño
  removeBlockingOverlays();
  window.addEventListener('resize', removeBlockingOverlays);
  
  // Asegurar que todos los botones tengan cursor pointer y sean clickeables
  const allButtons = document.querySelectorAll('.btn-primary, .btn-secondary, .nav-cta, .drawer-cta, .wa-btn, .maps-btn, .footer-contact-row');
  allButtons.forEach(btn => {
    btn.style.cursor = 'pointer';
    btn.addEventListener('touchstart', function(e) {
      // Solo para dar feedback visual en móvil
      this.style.opacity = '0.7';
      setTimeout(() => {
        this.style.opacity = '';
      }, 150);
    });
    btn.addEventListener('touchend', function(e) {
      this.style.opacity = '';
    });
  });
})();

// ── SOLUCIÓN PARA MÓVILES: scroll con offset por el menú fijo ────────────────
(function() {
  const getNavHeight = () => {
    const nav = document.querySelector('nav');
    return nav ? nav.offsetHeight : 64;
  };

  const OFFSET = 20;

  const internalLinks = document.querySelectorAll('a[href^="#"]');

  internalLinks.forEach(link => {
    // Eliminar cualquier evento anterior para evitar duplicados
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

// ── FORZAR REPINTADO EN MÓVILES PARA GARANTIZAR CLICS ────────────────────────
(function forceTouchResponsiveness() {
  if ('ontouchstart' in window) {
    // Forzar que todos los elementos con href tengan cursor pointer
    const allLinks = document.querySelectorAll('a');
    allLinks.forEach(link => {
      link.style.cursor = 'pointer';
      // Eliminar cualquier clase o estilo que pueda estar bloqueando
      link.style.pointerEvents = 'auto';
    });
    
    // Forzar que el body no tenga elementos que bloqueen
    document.body.style.touchAction = 'auto';
    document.body.style.webkitTapHighlightColor = 'rgba(0,0,0,0)';
  }
})();
