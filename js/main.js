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

  /* ── Instagram peek carousel ── */
  (function () {
    var viewport = document.getElementById('ig-viewport');
    var track = document.getElementById('ig-track');
    var dotsContainer = document.getElementById('ig-dots');
    if (!viewport || !track || !dotsContainer) return;

    var cards = Array.prototype.slice.call(track.querySelectorAll('.ig-card'));
    if (!cards.length) return;

    var current = 0;
    var timer;
    var GAP = 20;

    function getOffset(index) {
      var vpW = viewport.offsetWidth;
      var cw = cards[0].offsetWidth;
      var center = (vpW - cw) / 2;
      return center - index * (cw + GAP);
    }

    function render() {
      track.style.transform = 'translateX(' + getOffset(current) + 'px)';
      cards.forEach(function (card, i) {
        card.classList.toggle('active', i === current);
        card.setAttribute('aria-hidden', i !== current ? 'true' : 'false');
      });
      dotsContainer.querySelectorAll('.ig-dot').forEach(function (dot, i) {
        dot.classList.toggle('active', i === current);
      });
    }

    function goTo(n) {
      current = ((n % cards.length) + cards.length) % cards.length;
      render();
      clearInterval(timer);
      timer = setInterval(function () { goTo(current + 1); }, 5000);
    }

    cards.forEach(function (_, i) {
      var dot = document.createElement('button');
      dot.className = 'ig-dot' + (i === 0 ? ' active' : '');
      dot.setAttribute('aria-label', 'Post ' + (i + 1));
      dot.setAttribute('role', 'tab');
      dot.addEventListener('click', function () { goTo(i); });
      dotsContainer.appendChild(dot);
    });

    var prev = document.getElementById('ig-prev');
    var next = document.getElementById('ig-next');
    if (prev) prev.addEventListener('click', function () { goTo(current - 1); });
    if (next) next.addEventListener('click', function () { goTo(current + 1); });

    render();
    timer = setInterval(function () { goTo(current + 1); }, 5000);

    window.addEventListener('resize', render, { passive: true });
  }());

  /* ── Service tabs ── */
  document.querySelectorAll('.sv-tab').forEach(function (tab) {
    tab.addEventListener('click', function () {
      document.querySelectorAll('.sv-tab').forEach(function (t) {
        t.classList.remove('active');
        t.setAttribute('aria-selected', 'false');
      });
      document.querySelectorAll('.sv-panel').forEach(function (p) {
        p.classList.remove('active');
      });
      tab.classList.add('active');
      tab.setAttribute('aria-selected', 'true');
      var panel = document.getElementById('sv-' + tab.dataset.tab);
      if (panel) panel.classList.add('active');
    });
  });

  /* ── Counter animation ── */
  function animateCounter(el) {
    var target = parseInt(el.dataset.target, 10);
    var duration = 1500;
    var start = performance.now();
    function step(now) {
      var progress = Math.min((now - start) / duration, 1);
      el.textContent = Math.floor(progress * target).toLocaleString('pt-BR');
      if (progress < 1) requestAnimationFrame(step);
    }
    requestAnimationFrame(step);
  }

  var counterObserver = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting && !entry.target.dataset.counted) {
        entry.target.dataset.counted = '1';
        animateCounter(entry.target);
      }
    });
  }, { threshold: 0.5 });

  document.querySelectorAll('[data-target]').forEach(function (el) {
    counterObserver.observe(el);
  });

})();
