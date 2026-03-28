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

  /* ── Form Validation ─────────────────────────────────────── */
  const form = document.getElementById('reservation-form');
  if (form) {
    const successMsg = document.getElementById('form-success');

    function getField(name) {
      return form.querySelector(`[name="${name}"]`);
    }

    function showError(field, errorId) {
      field.classList.add('error');
      const errEl = document.getElementById(errorId);
      if (errEl) errEl.classList.add('visible');
    }

    function clearError(field, errorId) {
      field.classList.remove('error');
      const errEl = document.getElementById(errorId);
      if (errEl) errEl.classList.remove('visible');
    }

    function isValidPhone(phone) {
      // Accept Italian-style phone numbers: optional +39, 8-15 digits
      return /^(\+39\s?)?[\d\s\-]{8,15}$/.test(phone.trim());
    }

    function isValidDate(dateStr) {
      if (!dateStr) return false;
      const d = new Date(dateStr);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      return d instanceof Date && !isNaN(d) && d >= today;
    }

    // Live clear on input
    form.querySelectorAll('input, select, textarea').forEach(field => {
      field.addEventListener('input', function () {
        if (this.value.trim() !== '') {
          this.classList.remove('error');
          const errEl = document.getElementById(this.name + '-error');
          if (errEl) errEl.classList.remove('visible');
        }
      });
    });

    form.addEventListener('submit', function (e) {
      e.preventDefault();
      let valid = true;

      const nome = getField('nome');
      const telefono = getField('telefono');
      const data = getField('data');
      const ora = getField('ora');
      const persone = getField('persone');

      // Reset all errors
      ['nome', 'telefono', 'data', 'ora', 'persone'].forEach(name => {
        const f = getField(name);
        if (f) clearError(f, name + '-error');
      });

      // Nome
      if (!nome || nome.value.trim().length < 2) {
        showError(nome, 'nome-error');
        valid = false;
      }

      // Telefono
      if (!telefono || !isValidPhone(telefono.value)) {
        showError(telefono, 'telefono-error');
        valid = false;
      }

      // Data
      if (!data || !isValidDate(data.value)) {
        showError(data, 'data-error');
        valid = false;
      }

      // Ora
      if (!ora || ora.value === '') {
        showError(ora, 'ora-error');
        valid = false;
      }

      // Persone
      if (!persone || persone.value === '') {
        showError(persone, 'persone-error');
        valid = false;
      }

      if (valid) {
        // Simulate success (no backend)
        form.style.opacity = '0.5';
        form.style.pointerEvents = 'none';
        if (successMsg) successMsg.classList.add('visible');
        setTimeout(() => {
          form.reset();
          form.style.opacity = '';
          form.style.pointerEvents = '';
          if (successMsg) successMsg.classList.remove('visible');
        }, 4000);
      }
    });
  }

  /* ── Set min date for date picker to today ───────────────── */
  const dateInput = document.querySelector('[name="data"]');
  if (dateInput) {
    const today = new Date().toISOString().split('T')[0];
    dateInput.setAttribute('min', today);
  }

})();
