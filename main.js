
// Menú Hamburguesa
const menuToggle = document.getElementById('menuToggle');
const navMenu = document.getElementById('navMenu');
const navLinks = document.querySelectorAll('.nav-links a');

function toggleMenu() {
  navMenu.classList.toggle('open');
  menuToggle.classList.toggle('active');
  // Bloquear scroll cuando el menú está abierto
  document.body.style.overflow = navMenu.classList.contains('open') ? 'hidden' : '';
}

if (menuToggle && navMenu) {
  menuToggle.addEventListener('click', toggleMenu);

  // Cerrar menú al hacer clic en un enlace
  navLinks.forEach(link => {
    link.addEventListener('click', () => {
      if (navMenu.classList.contains('open')) {
        toggleMenu();
      }
    });
  });

  // Cerrar menú al redimensionar la ventana (si se pasa a escritorio)
  window.addEventListener('resize', () => {
    if (window.innerWidth > 768 && navMenu.classList.contains('open')) {
      toggleMenu();
    }
  });
}
