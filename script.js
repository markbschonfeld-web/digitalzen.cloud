/* ============================================
   Digital Zen — Interactivity & Age Gate
   ============================================ */

(function () {
  'use strict';

  // ---- Age Verification ----
  const AGE_KEY = 'digitalzen_age_verified';

  function initAgeGate() {
    const gate = document.getElementById('age-gate');
    const mainContent = document.getElementById('main-content');
    const verifyBtn = document.getElementById('age-verify-btn');
    const errorEl = document.getElementById('age-error');
    const monthSelect = document.getElementById('age-month');
    const yearSelect = document.getElementById('age-year');

    // Check if already verified this session
    if (sessionStorage.getItem(AGE_KEY) === 'true') {
      gate.classList.add('hidden');
      mainContent.classList.add('visible');
      initPageAnimations();
      return;
    }

    // Populate month options
    const months = [
      'January', 'February', 'March', 'April', 'May', 'June',
      'July', 'August', 'September', 'October', 'November', 'December'
    ];
    months.forEach((m, i) => {
      const opt = document.createElement('option');
      opt.value = i + 1;
      opt.textContent = m;
      monthSelect.appendChild(opt);
    });

    // Populate year options (1930 to current year)
    const currentYear = new Date().getFullYear();
    for (let y = currentYear; y >= 1930; y--) {
      const opt = document.createElement('option');
      opt.value = y;
      opt.textContent = y;
      yearSelect.appendChild(opt);
    }

    verifyBtn.addEventListener('click', function () {
      const month = parseInt(monthSelect.value, 10);
      const year = parseInt(yearSelect.value, 10);

      if (!month || !year) {
        showError('Please select your birth month and year.');
        return;
      }

      // Calculate age — use last day of month 
      const birthDate = new Date(year, month, 0); // last day of selected month
      const today = new Date();
      let age = today.getFullYear() - birthDate.getFullYear();
      const monthDiff = today.getMonth() - birthDate.getMonth();
      if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
        age--;
      }

      if (age < 21) {
        // Under-age: redirect away
        window.location.href = 'https://www.google.com';
        return;
      }

      // Verified — let them in
      sessionStorage.setItem(AGE_KEY, 'true');
      gate.classList.add('hidden');
      mainContent.classList.add('visible');
      initPageAnimations();
    });

    function showError(msg) {
      errorEl.textContent = msg;
      errorEl.classList.add('visible');
      // Re-trigger shake animation
      errorEl.style.animation = 'none';
      errorEl.offsetHeight; // force reflow
      errorEl.style.animation = '';
    }
  }

  // ---- Scroll Reveal ----
  function initScrollReveal() {
    const reveals = document.querySelectorAll('.reveal');

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            observer.unobserve(entry.target);
          }
        });
      },
      {
        threshold: 0.15,
        rootMargin: '0px 0px -40px 0px',
      }
    );

    reveals.forEach((el) => observer.observe(el));
  }

  // ---- Header Scroll Effect ----
  function initHeaderScroll() {
    const header = document.querySelector('.site-header');
    if (!header) return;

    let ticking = false;
    window.addEventListener('scroll', function () {
      if (!ticking) {
        requestAnimationFrame(function () {
          header.classList.toggle('scrolled', window.scrollY > 60);
          ticking = false;
        });
        ticking = true;
      }
    });
  }

  // ---- Particle Background ----
  function initParticles() {
    const canvas = document.getElementById('particles-canvas');
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    let particles = [];
    let animId;
    let w, h;

    function resize() {
      w = canvas.width = window.innerWidth;
      h = canvas.height = window.innerHeight;
    }

    function createParticles() {
      particles = [];
      const count = Math.min(50, Math.floor((w * h) / 25000));
      for (let i = 0; i < count; i++) {
        particles.push({
          x: Math.random() * w,
          y: Math.random() * h,
          r: Math.random() * 1.5 + 0.3,
          dx: (Math.random() - 0.5) * 0.3,
          dy: (Math.random() - 0.5) * 0.3,
          opacity: Math.random() * 0.3 + 0.05,
          pulse: Math.random() * Math.PI * 2,
        });
      }
    }

    function draw() {
      ctx.clearRect(0, 0, w, h);
      particles.forEach((p) => {
        p.x += p.dx;
        p.y += p.dy;
        p.pulse += 0.01;

        // Wrap around edges
        if (p.x < -10) p.x = w + 10;
        if (p.x > w + 10) p.x = -10;
        if (p.y < -10) p.y = h + 10;
        if (p.y > h + 10) p.y = -10;

        const currentOpacity = p.opacity + Math.sin(p.pulse) * 0.1;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255, 255, 255, ${Math.max(0, currentOpacity)})`;
        ctx.fill();
      });
      animId = requestAnimationFrame(draw);
    }

    resize();
    createParticles();
    draw();

    window.addEventListener('resize', function () {
      resize();
      createParticles();
    });
  }

  // ---- Smooth Scroll for Internal Links ----
  function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
      anchor.addEventListener('click', function (e) {
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
          e.preventDefault();
          target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      });
    });
  }

  // ---- Init Page Animations (called after age gate) ----
  function initPageAnimations() {
    initParticles();
    initScrollReveal();
    initHeaderScroll();
    initSmoothScroll();
  }

  // ---- Boot ----
  document.addEventListener('DOMContentLoaded', initAgeGate);
})();
