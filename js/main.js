/* main.js — utilidades compartidas del sitio CREATEAM */
(function () {
  'use strict';

  // ── Hash router: intercepta enlaces tipo #/ruta y los redirige a páginas estáticas ──
  document.addEventListener('click', function (e) {
    const a = e.target.closest('a[href]');
    if (!a) return;
    const href = a.getAttribute('href');
    if (!href || !href.startsWith('#/')) return;
    e.preventDefault();
    const map = {
      '#/': 'index.html',
      '#/servicios': 'servicios.html',
      '#/nosotros': 'nosotros.html',
      '#/proyectos': 'proyectos.html',
      '#/blog': 'blog.html',
      '#/contacto': 'contacto.html',
      '#/#saas': 'index.html#saas',
      '#/#proyectos': 'proyectos.html'
    };
    const dest = map[href] || map[href.split('?')[0]];
    if (dest) window.location.href = dest;
  });

  // ── Menú móvil ──
  const btn = document.getElementById('menu-toggle');
  const menu = document.getElementById('mobile-menu');
  if (btn && menu) {
    const MENU_SVG = '<path d="M4 5h16"></path><path d="M4 12h16"></path><path d="M4 19h16"></path>';
    const X_SVG = '<path d="M18 6 6 18"></path><path d="M6 6l12 12"></path>';
    const links = menu.querySelectorAll('.mobile-nav-link, .mobile-nav-cta');
    let open = false;

    function openMenu() {
      open = true;
      menu.classList.remove('opacity-0', 'invisible');
      menu.classList.add('opacity-100', 'visible');
      menu.setAttribute('aria-hidden', 'false');
      document.body.style.overflow = 'hidden';
      links.forEach(function (l) {
        l.classList.remove('translate-y-10', 'opacity-0');
        l.classList.add('translate-y-0', 'opacity-100');
      });
      const svg = btn.querySelector('svg');
      if (svg) svg.innerHTML = X_SVG;
      btn.setAttribute('aria-expanded', 'true');
      btn.setAttribute('aria-label', 'Cerrar menú');
    }

    function closeMenu() {
      open = false;
      menu.classList.add('opacity-0', 'invisible');
      menu.classList.remove('opacity-100', 'visible');
      menu.setAttribute('aria-hidden', 'true');
      document.body.style.overflow = '';
      links.forEach(function (l) {
        l.classList.add('translate-y-10', 'opacity-0');
        l.classList.remove('translate-y-0', 'opacity-100');
      });
      const svg = btn.querySelector('svg');
      if (svg) svg.innerHTML = MENU_SVG;
      btn.setAttribute('aria-expanded', 'false');
      btn.setAttribute('aria-label', 'Abrir menú');
    }

    btn.addEventListener('click', function () {
      open ? closeMenu() : openMenu();
    });
    links.forEach(function (l) {
      l.addEventListener('click', closeMenu);
    });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && open) closeMenu();
    });
  }

  // ── Año del copyright ──
  document.querySelectorAll('.copyright-year').forEach(function (el) {
    el.textContent = new Date().getFullYear();
  });

  // ── Formulario de contacto → WhatsApp (sin backend, gratis) ──
  // El navegador valida los campos required (incluido el checkbox de
  // privacidad) antes de disparar el evento submit.
  var contactForm = document.getElementById('contact-form');
  if (contactForm) {
    contactForm.addEventListener('submit', function (e) {
      e.preventDefault();
      function val(n) {
        var el = contactForm.querySelector('[name="' + n + '"]');
        return el ? el.value.trim() : '';
      }
      var lines = [
        'Hola, les escribo desde su página web:',
        '',
        '*Nombre:* ' + val('name'),
        '*Email:* ' + val('email')
      ];
      if (val('company')) lines.push('*Empresa:* ' + val('company'));
      lines.push('', val('message'));
      var url = 'https://wa.me/51945111310?text=' + encodeURIComponent(lines.join('\n'));
      var btn = contactForm.querySelector('button[type="submit"]');
      if (btn) {
        btn.textContent = 'Abriendo WhatsApp…';
        setTimeout(function () { btn.textContent = 'Mensaje listo en WhatsApp ✓'; }, 2000);
        setTimeout(function () { btn.textContent = 'Enviar mensaje'; }, 8000);
      }
      window.open(url, '_blank', 'noopener');
    });
  }
})();
