 

'use strict';

/* ============================================================
   SELECTORS
============================================================ */
const $ = (selector, parent = document) =>
  parent.querySelector(selector);

const $$ = (selector, parent = document) =>
  [...parent.querySelectorAll(selector)];

/* ============================================================
   NAVBAR
============================================================ */
(function initNavbar() {

  const header    = $('#header');
  const navToggle = $('#navToggle');
  const navMenu   = $('#navMenu');
  const navLinks  = $$('.nav__link');

  if (!header || !navToggle || !navMenu) return;

  /* =========================
     Sticky Header
  ========================= */
  window.addEventListener('scroll', () => {

    if (window.scrollY > 50) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }

    updateActiveLink();
    toggleBackToTop();

  }, { passive: true });

  /* =========================
     Mobile Toggle
  ========================= */
  navToggle.addEventListener('click', (e) => {

    e.stopPropagation();

    navToggle.classList.toggle('open');

    /* IMPORTANT */
    navMenu.classList.toggle('show');

    /* Lock body scroll */
    if (navMenu.classList.contains('show')) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }

  });

  /* =========================
     Close Menu on Link Click
  ========================= */
  navLinks.forEach(link => {

    link.addEventListener('click', () => {

      navToggle.classList.remove('open');
      navMenu.classList.remove('show');

      document.body.style.overflow = '';

    });

  });

  /* =========================
     Outside Click Close
  ========================= */
  document.addEventListener('click', (e) => {

    if (!header.contains(e.target)) {

      navToggle.classList.remove('open');
      navMenu.classList.remove('show');

      document.body.style.overflow = '';

    }

  });

  /* =========================
     Active Link Highlight
  ========================= */
  function updateActiveLink() {

    const sections = $$('section[id]');
    const scrollY  = window.pageYOffset;

    sections.forEach(section => {

      const sectionTop =
        section.offsetTop - 120;

      const sectionHeight =
        section.offsetHeight;

      const sectionId =
        section.getAttribute('id');

      const activeLink =
        $(`.nav__link[href="#${sectionId}"]`);

      if (
        scrollY >= sectionTop &&
        scrollY < sectionTop + sectionHeight
      ) {

        navLinks.forEach(link =>
          link.classList.remove('active')
        );

        if (activeLink) {
          activeLink.classList.add('active');
        }

      }

    });

  }

  updateActiveLink();

})();

/* ============================================================
   SMOOTH SCROLL
============================================================ */
(function initSmoothScroll() {

  document.addEventListener('click', (e) => {

    const anchor =
      e.target.closest('a[href^="#"]');

    if (!anchor) return;

    const targetId =
      anchor.getAttribute('href').substring(1);

    const target =
      document.getElementById(targetId);

    if (!target) return;

    e.preventDefault();

    const navHeight =
      parseInt(
        getComputedStyle(document.documentElement)
          .getPropertyValue('--nav-h')
      ) || 72;

    const targetPosition =
      target.offsetTop - navHeight;

    window.scrollTo({
      top: targetPosition,
      behavior: 'smooth'
    });

  });

})();

/* ============================================================
   SCROLL ANIMATION
============================================================ */
(function initAOS() {

  const elements = $$('[data-aos]');

  if (!elements.length) return;

  const observer = new IntersectionObserver(

    (entries) => {

      entries.forEach(entry => {

        if (entry.isIntersecting) {

          const element = entry.target;

          const delay =
            parseInt(
              element.getAttribute('data-aos-delay')
            ) || 0;

          setTimeout(() => {

            element.classList.add('aos-animate');

          }, delay);

          observer.unobserve(element);

        }

      });

    },

    {
      threshold: 0.15
    }

  );

  elements.forEach(el =>
    observer.observe(el)
  );

})();

/* ============================================================
   FAQ ACCORDION
============================================================ */
(function initFAQ() {

  const faqItems = $$('.faq-item');

  faqItems.forEach(item => {

    const question =
      $('.faq-item__question', item);

    if (!question) return;

    question.addEventListener('click', () => {

      const isOpen =
        item.classList.contains('open');

      faqItems.forEach(faq =>
        faq.classList.remove('open')
      );

      if (!isOpen) {
        item.classList.add('open');
      }

    });

  });

})();

/* ============================================================
   CONTACT FORM
============================================================ */
(function initContactForm() {

  const form    = $('#contactForm');
  const success = $('#formSuccess');

  if (!form) return;

  form.addEventListener('submit', (e) => {

    e.preventDefault();

    const name =
      $('#name')?.value.trim();

    const email =
      $('#email')?.value.trim();

    const message =
      $('#message')?.value.trim();

    const emailRegex =
      /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!name || !email || !message) {
      shake(form);
      return;
    }

    if (!emailRegex.test(email)) {
      shake($('#email'));
      return;
    }

    const btn =
      form.querySelector('button[type="submit"]');

    btn.disabled = true;
    btn.textContent = 'Sending...';

    setTimeout(() => {

      form.reset();

      btn.disabled = false;
      btn.textContent = 'Send Message';

      if (success) {

        success.classList.add('show');

        setTimeout(() => {
          success.classList.remove('show');
        }, 4000);

      }

    }, 1500);

  });

  function shake(el) {

    if (!el) return;

    el.style.animation = 'shake .4s ease';

    el.addEventListener('animationend', () => {
      el.style.animation = '';
    }, { once: true });

  }

})();

/* ============================================================
   BACK TO TOP
============================================================ */
(function initBackToTop() {

  const btn = $('#backToTop');

  if (!btn) return;

  btn.addEventListener('click', () => {

    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });

  });

})();

function toggleBackToTop() {

  const btn = $('#backToTop');

  if (!btn) return;

  if (window.scrollY > 400) {
    btn.classList.add('visible');
  } else {
    btn.classList.remove('visible');
  }

}

/* ============================================================
   HEADER HIDE / SHOW
============================================================ */
(function initHeaderBehavior() {

  const header = $('#header');

  if (!header) return;

  let lastScroll = 0;

  window.addEventListener('scroll', () => {

    const currentScroll =
      window.pageYOffset;

    const navMenu =
      $('#navMenu');

    /* Hide only if menu closed */
    if (
      currentScroll > lastScroll &&
      currentScroll > 300
    ) {

      if (
        navMenu &&
        !navMenu.classList.contains('show')
      ) {

        header.style.transform =
          'translateY(-100%)';

      }

    } else {

      header.style.transform =
        'translateY(0)';

    }

    lastScroll = currentScroll;

  }, { passive: true });

})();

/* ============================================================
   PAGE LOAD EFFECT
============================================================ */
(function initPageLoad() {

  document.body.style.opacity = '0';
  document.body.style.transition =
    'opacity .5s ease';

  window.addEventListener('load', () => {

    document.body.style.opacity = '1';

  });

})();