/* ============================================
   Digital Zen — The Night Ritual Index
   Scroll reveals & ambient atmosphere
   ============================================ */

(function () {
  'use strict';

  // ---- Scroll Reveal (IntersectionObserver) ----
  function initReveal() {
    var reveals = document.querySelectorAll('.reveal');
    if (!reveals.length) return;

    var observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.1, rootMargin: '0px 0px -20px 0px' }
    );

    reveals.forEach(function (el) { observer.observe(el); });
  }

  // ---- Nav background on scroll ----
  function initNav() {
    var nav = document.querySelector('.nav');
    if (!nav) return;

    var ticking = false;
    window.addEventListener('scroll', function () {
      if (!ticking) {
        requestAnimationFrame(function () {
          if (window.scrollY > 50) {
            nav.style.background = 'rgba(10, 10, 12, 0.92)';
          } else {
            nav.style.background = 'rgba(10, 10, 12, 0.7)';
          }
          ticking = false;
        });
        ticking = true;
      }
    });
  }

  // ---- Smooth scroll for anchor links ----
  function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
      anchor.addEventListener('click', function (e) {
        var target = document.querySelector(this.getAttribute('href'));
        if (target) {
          e.preventDefault();
          target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      });
    });
  }

  // ---- Boot ----
  document.addEventListener('DOMContentLoaded', function () {
    initReveal();
    initNav();
    initSmoothScroll();
  });
})();
