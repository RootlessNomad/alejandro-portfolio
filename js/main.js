import { loadContent, toggleLang, getLang, renderAll } from './i18n.js';
import { EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_ID, EMAILJS_PUBLIC_KEY } from './config.js';

// ===== INIT =====
document.addEventListener('DOMContentLoaded', async () => {
  await loadContent();
  renderAll();

  // Set initial language toggle text
  const langBtn = document.getElementById('langToggle');
  if (langBtn) {
    langBtn.textContent = getLang() === 'es' ? 'EN' : 'ES';
    langBtn.addEventListener('click', toggleLang);
  }

  document.documentElement.lang = getLang();

  initMobileMenu();
  initScrollAnimations();
  initNavScroll();
  initContactForm();
});

// ===== MOBILE MENU =====
function initMobileMenu() {
  const hamburger = document.getElementById('hamburger');
  const navLinks = document.getElementById('navLinks');
  if (!hamburger || !navLinks) return;

  hamburger.addEventListener('click', () => {
    navLinks.classList.toggle('open');
    const expanded = navLinks.classList.contains('open');
    hamburger.setAttribute('aria-expanded', expanded);
  });

  navLinks.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      navLinks.classList.remove('open');
      hamburger.setAttribute('aria-expanded', 'false');
    });
  });
}

// ===== SCROLL ANIMATIONS =====
function initScrollAnimations() {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const siblings = Array.from(entry.target.parentNode.children);
        const index = siblings.indexOf(entry.target);
        setTimeout(() => {
          entry.target.classList.add('visible');
        }, 80 * index);
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1 });

  // Store globally so i18n can re-observe dynamically added elements
  window._fadeObserver = observer;

  document.querySelectorAll('.fade-up').forEach(el => observer.observe(el));
}

// ===== NAV SCROLL EFFECT =====
function initNavScroll() {
  const nav = document.querySelector('nav');
  if (!nav) return;

  window.addEventListener('scroll', () => {
    nav.style.borderBottomColor = window.scrollY > 60
      ? 'rgba(201, 168, 76, 0.15)'
      : 'rgba(255, 255, 255, 0.08)';
  }, { passive: true });
}

// ===== CONTACT FORM =====
function validateForm(form) {
  const lang = getLang();
  let valid = true;

  const fields = [
    {
      el: form.querySelector('#formName'),
      error: form.querySelector('#formNameError'),
      check: v => v.trim().length > 0,
      msg: { es: 'El nombre es obligatorio', en: 'Name is required' }
    },
    {
      el: form.querySelector('#formEmail'),
      error: form.querySelector('#formEmailError'),
      check: v => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v),
      msg: { es: 'Introduce un email válido', en: 'Enter a valid email' }
    },
    {
      el: form.querySelector('#formMessage'),
      error: form.querySelector('#formMessageError'),
      check: v => v.trim().length > 0,
      msg: { es: 'El mensaje es obligatorio', en: 'Message is required' }
    }
  ];

  fields.forEach(({ el, error, check, msg }) => {
    if (!check(el.value)) {
      el.classList.add('invalid');
      error.textContent = msg[lang] || msg.es;
      error.classList.add('visible');
      valid = false;
    } else {
      el.classList.remove('invalid');
      error.textContent = '';
      error.classList.remove('visible');
    }
  });

  return valid;
}

function initContactForm() {
  const form = document.getElementById('contactForm');
  if (!form) return;

  // Clear errors on input
  form.querySelectorAll('input, textarea').forEach(el => {
    el.addEventListener('input', () => {
      el.classList.remove('invalid');
      const errorEl = document.getElementById(el.id + 'Error');
      if (errorEl) { errorEl.textContent = ''; errorEl.classList.remove('visible'); }
    });
  });

  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    if (!validateForm(form)) return;

    const btn = form.querySelector('.form-submit');
    const lang = getLang();

    btn.disabled = true;
    btn.innerHTML = `<i class="fas fa-spinner fa-spin"></i> ${lang === 'en' ? 'Sending...' : 'Enviando...'}`;

    // Check if EmailJS is configured
    const isConfigured = EMAILJS_PUBLIC_KEY && !EMAILJS_PUBLIC_KEY.startsWith('__');

    try {
      if (isConfigured && window.emailjs) {
        await window.emailjs.send(EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_ID, {
          from_name: form.querySelector('#formName').value.trim(),
          from_email: form.querySelector('#formEmail').value.trim(),
          subject: form.querySelector('#formSubject').value.trim(),
          message: form.querySelector('#formMessage').value.trim(),
        }, EMAILJS_PUBLIC_KEY);
      } else {
        console.warn('EmailJS not configured — message not sent. Set credentials in js/config.js');
      }

      const successMsg = lang === 'en' ? 'Message sent!' : '\u00a1Mensaje enviado!';
      btn.innerHTML = `<i class="fas fa-check"></i> ${successMsg}`;
      btn.style.background = 'linear-gradient(135deg, #7faa8a, #5a8a66)';

      setTimeout(() => {
        btn.disabled = false;
        btn.style.background = '';
        const submitText = lang === 'en' ? 'Send message' : 'Enviar mensaje';
        btn.innerHTML = `<i class="fas fa-paper-plane"></i> ${submitText}`;
        form.reset();
      }, 3000);
    } catch (err) {
      console.error('EmailJS error:', err);
      const errorMsg = lang === 'en' ? 'Failed to send. Try again.' : 'Error al enviar. Inténtalo de nuevo.';
      btn.innerHTML = `<i class="fas fa-exclamation-triangle"></i> ${errorMsg}`;
      btn.style.background = 'linear-gradient(135deg, #e74c3c, #c0392b)';

      setTimeout(() => {
        btn.disabled = false;
        btn.style.background = '';
        const submitText = lang === 'en' ? 'Send message' : 'Enviar mensaje';
        btn.innerHTML = `<i class="fas fa-paper-plane"></i> ${submitText}`;
      }, 3000);
    }
  });
}
