/* =========================================================
   DIAMOND BARBERS CO. — script.js (Vanilla JS)
   1. Navbar (menú móvil + estado al hacer scroll)
   2. Filtro de servicios por categoría
   3. Lightbox de la galería
   ========================================================= */
document.addEventListener('DOMContentLoaded', () => {

  /* ---------- 1. NAVBAR ---------- */
  const navbar = document.getElementById('navbar');
  const toggle = document.getElementById('menuToggle');
  const menu = document.getElementById('navMenu');

  const setMenu = (open) => {
    menu.classList.toggle('is-open', open);
    toggle.setAttribute('aria-expanded', open);
    toggle.setAttribute('aria-label', open ? 'Cerrar menú' : 'Abrir menú');
    document.body.style.overflow = open ? 'hidden' : '';   // bloquea el scroll del fondo
  };

  toggle.addEventListener('click', () => setMenu(!menu.classList.contains('is-open')));
  menu.querySelectorAll('a').forEach(a => a.addEventListener('click', () => setMenu(false)));
  window.addEventListener('resize', () => { if (window.innerWidth >= 960) setMenu(false); });

  // Fondo sólido al bajar de la parte superior
  const onScroll = () => navbar.classList.toggle('is-scrolled', window.scrollY > 40);
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  /* ---------- 2. FILTRO DE SERVICIOS ---------- */
  const filters = document.querySelectorAll('.filter');
  const services = document.querySelectorAll('.service');

  filters.forEach(btn => btn.addEventListener('click', () => {
    const category = btn.dataset.filter;   // all | cortes | barba | combos

    filters.forEach(b => b.classList.toggle('is-active', b === btn));

    services.forEach(card => {
      const show = category === 'all' || card.dataset.category === category;
      card.classList.toggle('is-hidden', !show);
      if (show) {
        // pequeña animación de entrada
        card.classList.add('is-entering');
        requestAnimationFrame(() => requestAnimationFrame(() => card.classList.remove('is-entering')));
      }
    });
  }));


const items = [...document.querySelectorAll('.gallery__item')];
  const lightbox = document.getElementById('lightbox');
  const lbImg = document.getElementById('lbImg');
  const lbVideo = document.getElementById('lbVideo');
  const lbCount = document.getElementById('lbCount');
  const lbClose = document.getElementById('lbClose');
  const lbPrev = document.getElementById('lbPrev');
  const lbNext = document.getElementById('lbNext');

  let current = 0;
  let lastFocus = null;

  const isVideoUrl = (url = '') => /\.(mp4|webm|ogg)(\?|#|$)/i.test(url.trim());

  const stopVideo = () => {
    if (!lbVideo) return;
    lbVideo.pause();
    lbVideo.removeAttribute('src');
    lbVideo.load();
    lbVideo.hidden = true;
  };

  const show = (index) => {
    if (!items.length) return;
    current = (index + items.length) % items.length; // navegación circular
    const item = items[current];
    const fullSrc = (item.dataset.full || '').trim();
    const mediaEl = item.querySelector('img, video');
    const desc =
      mediaEl?.getAttribute('alt') ||
      mediaEl?.getAttribute('aria-label') ||
      '';

    if (isVideoUrl(fullSrc) && lbVideo) {
      // --- Es un VIDEO: ocultamos la imagen y mostramos el reproductor ---
      lbImg.hidden = true;
      lbImg.removeAttribute('src');
      lbImg.alt = '';

      lbVideo.hidden = false;
      lbVideo.src = fullSrc;                      // el navegador codifica espacios del nombre (ej: "Barbero Cristian.mp4")
      lbVideo.setAttribute('aria-label', desc);   // texto accesible tomado del aria-label del video de la galería
      lbVideo.currentTime = 0;                    // siempre inicia desde el comienzo
      lbVideo.play().catch(() => {});             // si el navegador bloquea el autoplay, el usuario usa los controles
    } else {
      // --- Es una IMAGEN: detenemos cualquier video y mostramos la imagen ---
      stopVideo();

      lbImg.hidden = false;
      lbImg.src = fullSrc;
      lbImg.alt = desc;
    }

    lbCount.textContent = `${current + 1} / ${items.length}`;
  };

  const open = (index) => {
    lastFocus = document.activeElement;
    show(index);
    lightbox.hidden = false;
    document.body.style.overflow = 'hidden';
    lbClose?.focus();
  };

  const close = () => {
    lightbox.hidden = true;
    document.body.style.overflow = '';
    stopVideo();
    lbImg.removeAttribute('src');
    lbImg.alt = '';
    if (lastFocus) lastFocus.focus();
  };

  items.forEach((item, i) => {
    item.addEventListener('click', () => open(i));
  });

  lbClose?.addEventListener('click', close);
  lbPrev?.addEventListener('click', () => show(current - 1));
  lbNext?.addEventListener('click', () => show(current + 1));

  // Cerrar al hacer clic en el fondo oscuro
  lightbox.addEventListener('click', (e) => {
    if (e.target === lightbox) close();
  });

  // Teclado: Esc cierra, flechas navegan
  document.addEventListener('keydown', (e) => {
    if (lightbox.hidden) return;
    if (e.key === 'Escape') close();
    if (e.key === 'ArrowLeft') show(current - 1);
    if (e.key === 'ArrowRight') show(current + 1);
  });

  // Gesto táctil: deslizar para cambiar de elemento
  let startX = 0;
  lightbox.addEventListener(
    'touchstart',
    (e) => {
      startX = e.touches[0].clientX;
    },
    { passive: true }
  );

  lightbox.addEventListener('touchend', (e) => {
    const dx = e.changedTouches[0].clientX - startX;
    if (Math.abs(dx) > 50) {
      show(current + (dx < 0 ? 1 : -1));
    }
  });
  /* ---------- Año automático en el footer ---------- */
  document.getElementById('year').textContent = new Date().getFullYear();
});
