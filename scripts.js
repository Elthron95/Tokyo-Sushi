/* ============================================================
   TOKYO SUSHI COSENZA — scripts.js
   ============================================================ */

(function () {
  'use strict';

  /* ── Hamburger / Mobile Nav ──────────────────────────────── */
  const hamburger = document.getElementById('hamburger');
  const mobileOverlay = document.getElementById('mobile-nav-overlay');
  const mobileLinks = mobileOverlay ? mobileOverlay.querySelectorAll('a') : [];

  function openMenu() {
    hamburger.classList.add('open');
    mobileOverlay.classList.add('open');
    document.body.style.overflow = 'hidden';
    hamburger.setAttribute('aria-expanded', 'true');
  }

  function closeMenu() {
    hamburger.classList.remove('open');
    mobileOverlay.classList.remove('open');
    document.body.style.overflow = '';
    hamburger.setAttribute('aria-expanded', 'false');
  }

  if (hamburger && mobileOverlay) {
    hamburger.addEventListener('click', function () {
      const isOpen = mobileOverlay.classList.contains('open');
      isOpen ? closeMenu() : openMenu();
    });

    mobileLinks.forEach(link => {
      link.addEventListener('click', closeMenu);
    });

    // Close on Escape
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') closeMenu();
    });
  }

  /* ── Sticky header shadow ────────────────────────────────── */
  const header = document.querySelector('.site-header');
  if (header) {
    window.addEventListener('scroll', function () {
      if (window.scrollY > 10) {
        header.style.boxShadow = '0 2px 20px rgba(0,0,0,0.35)';
      } else {
        header.style.boxShadow = 'none';
      }
    }, { passive: true });
  }

  /* ── Smooth scroll for anchor links ─────────────────────── */
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const targetId = this.getAttribute('href');
      if (targetId === '#') return;
      const target = document.querySelector(targetId);
      if (target) {
        e.preventDefault();
        const headerHeight = header ? header.offsetHeight : 0;
        const top = target.getBoundingClientRect().top + window.scrollY - headerHeight - 8;
        window.scrollTo({ top, behavior: 'smooth' });
      }
    });
  });

  /* ── Intersection Observer: fade-up animation ────────────── */
  const fadeEls = document.querySelectorAll('.fade-up');
  if ('IntersectionObserver' in window && fadeEls.length) {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
    );
    fadeEls.forEach(el => observer.observe(el));
  } else {
    // Fallback: show all immediately
    fadeEls.forEach(el => el.classList.add('visible'));
  }

  /* ── Form Handling (Google Forms integration) ────────────── */
  window.submitted = false;
  
  window.showSuccess = function() {
    const form = document.getElementById('reservation-form');
    const successMsg = document.getElementById('form-success');
    if (form && successMsg) {
      form.style.display = 'none';
      successMsg.classList.add('visible');
    }
  };

  const form = document.getElementById('reservation-form');
  if (form) {
    form.addEventListener('submit', function() {
      window.submitted = true;
      // Optional: change button text to show loading
      const btn = form.querySelector('button[type="submit"]');
      if (btn) {
        btn.textContent = 'Invio in corso...';
        btn.disabled = true;
      }
    });
  }

  /* ── Set min date for date picker to today ───────────────── */
  const dateInput = document.querySelector('input[type="date"]');
  if (dateInput) {
    const today = new Date().toISOString().split('T')[0];
    dateInput.setAttribute('min', today);
  }

})();
