/* ============================================================
   MANIKANTA AKULA — Portfolio JS
   ============================================================ */

'use strict';

/* ── Navbar: scroll effect + active link tracking ────────── */
const navbar   = document.getElementById('navbar');
const navLinks = document.querySelectorAll('.nav-link');
const sections = document.querySelectorAll('section[id]');

function onScroll() {
  // Sticky style
  navbar.classList.toggle('scrolled', window.scrollY > 20);

  // Back-to-top visibility
  backToTop.classList.toggle('visible', window.scrollY > 400);

  // Active nav link
  let current = '';
  sections.forEach(sec => {
    if (window.scrollY >= sec.offsetTop - 120) current = sec.getAttribute('id');
  });
  navLinks.forEach(link => {
    link.classList.toggle('active', link.getAttribute('href') === `#${current}`);
  });
}

window.addEventListener('scroll', onScroll, { passive: true });
onScroll(); // run once on load

/* ── Mobile hamburger menu ───────────────────────────────── */
const hamburger  = document.getElementById('hamburger');
const navLinkList = document.getElementById('nav-links');

hamburger.addEventListener('click', () => {
  const isOpen = navLinkList.classList.toggle('open');
  hamburger.setAttribute('aria-expanded', isOpen);
  // Animate hamburger → X
  const spans = hamburger.querySelectorAll('span');
  if (isOpen) {
    spans[0].style.transform = 'translateY(7px) rotate(45deg)';
    spans[1].style.opacity   = '0';
    spans[2].style.transform = 'translateY(-7px) rotate(-45deg)';
  } else {
    spans[0].style.transform = '';
    spans[1].style.opacity   = '';
    spans[2].style.transform = '';
  }
});

// Close menu when a link is clicked
navLinkList.querySelectorAll('.nav-link').forEach(link => {
  link.addEventListener('click', () => {
    navLinkList.classList.remove('open');
    hamburger.setAttribute('aria-expanded', false);
    const spans = hamburger.querySelectorAll('span');
    spans[0].style.transform = '';
    spans[1].style.opacity   = '';
    spans[2].style.transform = '';
  });
});

/* ── Back to top ─────────────────────────────────────────── */
const backToTop = document.getElementById('back-to-top');
backToTop.addEventListener('click', () => {
  window.scrollTo({ top: 0, behavior: 'smooth' });
});

/* ── Scroll-reveal animation ─────────────────────────────── */
const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry, i) => {
      if (entry.isIntersecting) {
        // Stagger siblings inside the same parent grid/list
        const siblings = entry.target.parentElement.querySelectorAll('.reveal');
        siblings.forEach((el, idx) => {
          if (el === entry.target) {
            setTimeout(() => el.classList.add('visible'), idx * 80);
          }
        });
        entry.target.classList.add('visible');
        revealObserver.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
);

function addRevealClass() {
  const targets = [
    '.timeline-card',
    '.skill-category',
    '.cert-card',
    '.project-card',
    '.achievement-card',
    '.stat',
    '.about-info-card',
    '.certifications',
    '.contact-info',
    '.contact-form',
  ];
  targets.forEach(selector => {
    document.querySelectorAll(selector).forEach(el => {
      el.classList.add('reveal');
      revealObserver.observe(el);
    });
  });
}

addRevealClass();

/* ── Animated counter for About stats ───────────────────── */
function animateCounter(el, target, suffix, duration = 1400) {
  const isFloat = target % 1 !== 0;
  const start   = performance.now();
  const step    = (now) => {
    const progress = Math.min((now - start) / duration, 1);
    const eased    = 1 - Math.pow(1 - progress, 3); // ease-out cubic
    const value    = eased * target;
    el.textContent = (isFloat ? value.toFixed(2) : Math.floor(value)) + suffix;
    if (progress < 1) requestAnimationFrame(step);
  };
  requestAnimationFrame(step);
}

const statsObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const statNumbers = document.querySelectorAll('.stat-number');
        statNumbers.forEach(el => {
          const raw    = el.textContent.trim();
          const num    = parseFloat(raw);
          const suffix = raw.replace(/[\d.]/g, '');
          animateCounter(el, num, suffix);
        });
        statsObserver.disconnect();
      }
    });
  },
  { threshold: 0.5 }
);

const statsSection = document.querySelector('.about-stats');
if (statsSection) statsObserver.observe(statsSection);

/* ── Typing effect for hero tagline ─────────────────────── */
function typeEffect(element, texts, speed = 80, pause = 2200) {
  let textIdx = 0, charIdx = 0, deleting = false;

  const tick = () => {
    const current = texts[textIdx];
    element.textContent = current.substring(0, charIdx);

    if (!deleting && charIdx === current.length) {
      setTimeout(() => { deleting = true; tick(); }, pause);
      return;
    }

    if (deleting && charIdx === 0) {
      deleting  = false;
      textIdx   = (textIdx + 1) % texts.length;
    }

    charIdx += deleting ? -1 : 1;
    setTimeout(tick, deleting ? speed / 2 : speed);
  };
  tick();
}

const roleEl = document.querySelector('.hero-greeting');
if (roleEl) {
  const originalText = roleEl.textContent;
  // Only run the typer after the initial fade-in delay
  setTimeout(() => {
    typeEffect(roleEl, [
      "Hello, I'm",
      "Namaste, I'm",
    ], 90, 3000);
  }, 1200);
}

/* ── Smooth scroll for all anchor links ─────────────────── */
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', e => {
    const target = document.querySelector(anchor.getAttribute('href'));
    if (target) {
      e.preventDefault();
      const offset = target.getBoundingClientRect().top + window.scrollY - 75;
      window.scrollTo({ top: offset, behavior: 'smooth' });
    }
  });
});

/* ── Contact Form validation & submission ────────────────── */
const form       = document.getElementById('contact-form');
const submitBtn  = document.getElementById('submit-btn');
const btnText    = document.getElementById('btn-text');
const btnLoading = document.getElementById('btn-loading');
const formSuccess = document.getElementById('form-success');

const validators = {
  name:    v => v.trim().length >= 2    ? '' : 'Please enter your full name (min 2 chars).',
  email:   v => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim()) ? '' : 'Please enter a valid email address.',
  subject: v => v.trim().length >= 3    ? '' : 'Subject must be at least 3 characters.',
  message: v => v.trim().length >= 10   ? '' : 'Message must be at least 10 characters.',
};

function showError(fieldId, msg) {
  const field = document.getElementById(fieldId);
  const err   = document.getElementById(`${fieldId}-error`);
  if (field) field.classList.toggle('error', !!msg);
  if (err)   err.textContent = msg;
}

function validateField(fieldId) {
  const field    = document.getElementById(fieldId);
  const validate = validators[fieldId];
  if (!field || !validate) return true;
  const msg = validate(field.value);
  showError(fieldId, msg);
  return msg === '';
}

// Live validation on blur
['name', 'email', 'subject', 'message'].forEach(id => {
  const el = document.getElementById(id);
  if (el) {
    el.addEventListener('blur',  () => validateField(id));
    el.addEventListener('input', () => {
      // Clear error as soon as user starts correcting
      if (el.classList.contains('error')) validateField(id);
    });
  }
});

form && form.addEventListener('submit', async e => {
  e.preventDefault();

  // Validate all fields
  const fields   = ['name', 'email', 'subject', 'message'];
  const allValid = fields.map(validateField).every(Boolean);
  if (!allValid) return;

  // Show loading state
  btnText.style.display    = 'none';
  btnLoading.style.display = 'flex';
  submitBtn.disabled       = true;
  formSuccess.style.display = 'none';

  // Simulate async send (replace with real API / EmailJS / Formspree endpoint)
  await new Promise(resolve => setTimeout(resolve, 1800));

  // Success
  btnText.style.display    = 'inline-flex';
  btnLoading.style.display = 'none';
  submitBtn.disabled       = false;
  formSuccess.style.display = 'flex';
  form.reset();

  // Auto-hide success message after 6 s
  setTimeout(() => { formSuccess.style.display = 'none'; }, 6000);
});

/* ── Navbar link underline cursor highlight ─────────────── */
navLinks.forEach(link => {
  link.addEventListener('mouseenter', function () {
    this.style.transition = 'background 0.2s, color 0.2s';
  });
});

/* ── Project card tilt on mouse move (desktop only) ──────── */
if (window.matchMedia('(pointer: fine)').matches) {
  document.querySelectorAll('.project-card').forEach(card => {
    card.addEventListener('mousemove', e => {
      const rect   = card.getBoundingClientRect();
      const x      = (e.clientX - rect.left) / rect.width  - 0.5;
      const y      = (e.clientY - rect.top)  / rect.height - 0.5;
      card.style.transform = `perspective(600px) rotateY(${x * 6}deg) rotateX(${-y * 6}deg) translateY(-6px)`;
    });
    card.addEventListener('mouseleave', () => {
      card.style.transform = '';
    });
  });
}

/* ── Active section highlight in URL hash (no page jump) ─── */
const historyObserver = new IntersectionObserver(
  entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        history.replaceState(null, '', `#${entry.target.id}`);
      }
    });
  },
  { threshold: 0.4 }
);

sections.forEach(sec => historyObserver.observe(sec));

/* ── Init complete log ───────────────────────────────────── */
console.log('%c Manikanta Akula Portfolio ', 'background:#6c63ff;color:#fff;padding:6px 12px;border-radius:4px;font-weight:bold;');
console.log('%c Built with HTML · CSS · JavaScript ', 'color:#a0a0b8;');


/* ── Certificate Lightbox ────────────────────────────────── */
function openCertModal(src, caption) {
  const modal   = document.getElementById('cert-modal');
  const img     = document.getElementById('cert-modal-img');
  const cap     = document.getElementById('cert-modal-caption');
  img.src       = src;
  img.alt       = caption;
  cap.textContent = caption;
  modal.classList.add('open');
  document.body.style.overflow = 'hidden';
}

function closeCertModal(event) {
  if (event && event.target.closest('.cert-modal-inner') && !event.target.closest('.cert-modal-close')) return;
  document.getElementById('cert-modal').classList.remove('open');
  document.body.style.overflow = '';
}

document.addEventListener('keydown', e => {
  if (e.key === 'Escape') closeCertModal();
});

/* ── Code Tabs ───────────────────────────────────────────── */
function switchTab(btn, panelId) {
  // Deactivate all buttons & panels in the same tab group
  const tabGroup = btn.closest('.code-tabs');
  tabGroup.querySelectorAll('.code-tab-btn').forEach(b => b.classList.remove('active'));
  tabGroup.querySelectorAll('.code-tab-panel').forEach(p => p.classList.remove('active'));
  // Activate selected
  btn.classList.add('active');
  tabGroup.querySelector('#' + panelId).classList.add('active');
}

/* ── Copy Code ───────────────────────────────────────────── */
function copyCode(preId) {
  const pre  = document.getElementById(preId);
  const text = pre ? pre.innerText : '';
  navigator.clipboard.writeText(text).then(() => {
    const btn = pre.closest('.code-tab-panel').querySelector('.copy-btn');
    const original = btn.innerHTML;
    btn.innerHTML = '<i class="fas fa-check"></i> Copied!';
    btn.classList.add('copied');
    setTimeout(() => {
      btn.innerHTML = original;
      btn.classList.remove('copied');
    }, 2000);
  });
}
