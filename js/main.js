(function () {
  'use strict';

  /* ── Nav: transparent → solid on scroll ── */
  var nav = document.getElementById('main-nav');
  if (nav) {
    window.addEventListener('scroll', function () {
      nav.classList.toggle('nav--solid', window.scrollY > 50);
    }, { passive: true });
  }

  /* ── Mobile menu ── */
  var hamburger = document.getElementById('nav-hamburger');
  var navLinks  = document.getElementById('nav-links');

  if (hamburger && navLinks) {
    hamburger.addEventListener('click', function (e) {
      e.stopPropagation();
      var isOpen = navLinks.classList.toggle('nav__links--open');
      hamburger.setAttribute('aria-expanded', String(isOpen));
    });

    navLinks.querySelectorAll('a').forEach(function (a) {
      a.addEventListener('click', function () {
        navLinks.classList.remove('nav__links--open');
        hamburger.setAttribute('aria-expanded', 'false');
      });
    });

    document.addEventListener('click', function (e) {
      if (!nav.contains(e.target) && navLinks.classList.contains('nav__links--open')) {
        navLinks.classList.remove('nav__links--open');
        hamburger.setAttribute('aria-expanded', 'false');
      }
    });
  }

  /* ── Fade-in on scroll ── */
  var fiEls = document.querySelectorAll('.fi');
  if (!fiEls.length) return;

  var io = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        io.unobserve(entry.target);
      }
    });
  }, { threshold: 0.08 });

  fiEls.forEach(function (el) { io.observe(el); });

})();
