/* ============================================================
   ADIL A — PORTFOLIO | script.js
   Cursor · Scroll · Typewriter · Nav · Animations
   ============================================================ */

'use strict';

/* ── DOM Ready ──────────────────────────────────────────────── */
document.addEventListener('DOMContentLoaded', () => {
  initCustomCursor();
  initNavbar();
  initScrollProgress();
  initTypewriter();
  initScrollReveal();
  initBackToTop();
  initSmoothScroll();
});

/* ── Custom Cursor ───────────────────────────────────────────── */
function initCustomCursor() {
  const dot  = document.getElementById('cursor-dot');
  const ring = document.getElementById('cursor-ring');
  if (!dot || !ring) return;

  let mouseX = 0, mouseY = 0;
  let ringX  = 0, ringY  = 0;
  let raf;

  document.addEventListener('mousemove', e => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    dot.style.left  = mouseX + 'px';
    dot.style.top   = mouseY + 'px';
  });

  // Smooth ring follow with lerp
  function lerpRing() {
    const speed = 0.14;
    ringX += (mouseX - ringX) * speed;
    ringY += (mouseY - ringY) * speed;
    ring.style.left = ringX + 'px';
    ring.style.top  = ringY + 'px';
    raf = requestAnimationFrame(lerpRing);
  }
  lerpRing();

  // Expand ring on hoverable elements
  const hoverables = document.querySelectorAll('a, button, .skill-card, .project-card, .achieve-card, .nav-logo');
  hoverables.forEach(el => {
    el.addEventListener('mouseenter', () => ring.classList.add('expanded'));
    el.addEventListener('mouseleave', () => ring.classList.remove('expanded'));
  });

  // Hide on leave
  document.addEventListener('mouseleave', () => {
    dot.style.opacity  = '0';
    ring.style.opacity = '0';
  });
  document.addEventListener('mouseenter', () => {
    dot.style.opacity  = '1';
    ring.style.opacity = '1';
  });
}

/* ── Navbar ──────────────────────────────────────────────────── */
function initNavbar() {
  const navbar    = document.getElementById('navbar');
  const hamburger = document.getElementById('hamburger');
  const mobileNav = document.getElementById('nav-mobile');

  if (!navbar) return;

  // Scroll class
  const onScroll = () => {
    if (window.scrollY > 20) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  // Hamburger toggle
  if (hamburger && mobileNav) {
    hamburger.addEventListener('click', () => {
      const isOpen = hamburger.classList.toggle('open');
      mobileNav.classList.toggle('open', isOpen);
      hamburger.setAttribute('aria-expanded', isOpen);
      document.body.style.overflow = isOpen ? 'hidden' : '';
    });
  }
}

/* Close mobile menu (called from HTML) */
window.closeMobileMenu = function () {
  const hamburger = document.getElementById('hamburger');
  const mobileNav = document.getElementById('nav-mobile');
  if (hamburger) { hamburger.classList.remove('open'); hamburger.setAttribute('aria-expanded', 'false'); }
  if (mobileNav)  mobileNav.classList.remove('open');
  document.body.style.overflow = '';
};

/* ── Scroll Progress Bar ─────────────────────────────────────── */
function initScrollProgress() {
  const bar = document.getElementById('progress-bar');
  if (!bar) return;
  window.addEventListener('scroll', () => {
    const total   = document.documentElement.scrollHeight - window.innerHeight;
    const current = window.scrollY;
    bar.style.width = (total > 0 ? (current / total) * 100 : 0) + '%';
  }, { passive: true });
}

/* ── Typewriter Effect ────────────────────────────────────────── */
function initTypewriter() {
  const el = document.getElementById('typewriter-text');
  if (!el) return;

  const roles = [
    'Flutter Developer',
    'Mobile App Developer',
    'Dart Engineer',
    'UI Craftsman',
    'Firebase Builder',
  ];

  let roleIdx  = 0;
  let charIdx  = 0;
  let deleting = false;
  let timer;

  function tick() {
    const current = roles[roleIdx];

    if (deleting) {
      charIdx--;
    } else {
      charIdx++;
    }

    el.textContent = current.substring(0, charIdx);

    let delay = deleting ? 60 : 100;

    if (!deleting && charIdx === current.length) {
      // Pause at end
      delay = 2200;
      deleting = true;
    } else if (deleting && charIdx === 0) {
      deleting = false;
      roleIdx  = (roleIdx + 1) % roles.length;
      delay    = 400;
    }

    timer = setTimeout(tick, delay);
  }

  tick();
}

/* ── Scroll Reveal ────────────────────────────────────────────── */
function initScrollReveal() {
  const els = document.querySelectorAll('.reveal');
  if (!els.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

  els.forEach(el => observer.observe(el));
}

/* ── Back to Top ──────────────────────────────────────────────── */
function initBackToTop() {
  const btn = document.getElementById('back-top');
  if (!btn) return;

  window.addEventListener('scroll', () => {
    if (window.scrollY > 400) {
      btn.classList.add('visible');
    } else {
      btn.classList.remove('visible');
    }
  }, { passive: true });

  btn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
}

/* ── Smooth Scroll Utility ────────────────────────────────────── */
function initSmoothScroll() {
  // Already handled via scrollToSection
}

window.scrollToSection = function (id) {
  const el = document.getElementById(id);
  if (!el) return;
  const navH   = parseInt(getComputedStyle(document.documentElement).getPropertyValue('--nav-h')) || 72;
  const offset = el.getBoundingClientRect().top + window.scrollY - navH - 8;
  window.scrollTo({ top: offset, behavior: 'smooth' });
};

/* ── Parallax Blobs ───────────────────────────────────────────── */
(function initParallax() {
  const blobs = document.querySelectorAll('.blob');
  if (!blobs.length) return;

  let ticking = false;
  window.addEventListener('scroll', () => {
    if (!ticking) {
      requestAnimationFrame(() => {
        const y = window.scrollY;
        blobs.forEach((blob, i) => {
          const speed = [0.08, -0.05, 0.04][i] || 0.05;
          blob.style.transform = `translateY(${y * speed}px)`;
        });
        ticking = false;
      });
      ticking = true;
    }
  }, { passive: true });
})();

/* ── Skill card tilt effect ───────────────────────────────────── */
(function initTilt() {
  const cards = document.querySelectorAll('.skill-card, .project-card');
  cards.forEach(card => {
    card.addEventListener('mousemove', e => {
      const rect   = card.getBoundingClientRect();
      const cx     = rect.left + rect.width  / 2;
      const cy     = rect.top  + rect.height / 2;
      const dx     = (e.clientX - cx) / (rect.width  / 2);
      const dy     = (e.clientY - cy) / (rect.height / 2);
      const maxTilt = 6;
      card.style.transform = `translateY(-6px) rotateX(${-dy * maxTilt}deg) rotateY(${dx * maxTilt}deg)`;
    });
    card.addEventListener('mouseleave', () => {
      card.style.transform = '';
    });
  });
})();

/* ── Glow trail on project cards ─────────────────────────────── */
(function initGlowTrail() {
  const cards = document.querySelectorAll('.project-card');
  cards.forEach(card => {
    card.addEventListener('mousemove', e => {
      const rect = card.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width)  * 100;
      const y = ((e.clientY - rect.top)  / rect.height) * 100;
      card.style.setProperty('--mouse-x', x + '%');
      card.style.setProperty('--mouse-y', y + '%');
    });
  });
})();

/* ── Stats count-up animation ─────────────────────────────────── */
(function initCountUp() {
  const stats = document.querySelectorAll('.stat-num');
  if (!stats.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const el     = entry.target;
      const target = parseFloat(el.textContent);
      const isFloat = el.textContent.includes('.');
      let start    = 0;
      const dur    = 1400;
      const step   = 16;
      const steps  = dur / step;
      const inc    = target / steps;
      let current  = 0;
      observer.unobserve(el);

      const timer = setInterval(() => {
        current += inc;
        if (current >= target) {
          current = target;
          clearInterval(timer);
        }
        el.textContent = isFloat
          ? current.toFixed(2)
          : Math.ceil(current) + (el.dataset.suffix || '+');
      }, step);
    });
  }, { threshold: 0.5 });

  stats.forEach(el => {
    el.dataset.suffix = el.textContent.includes('+') ? '+' : '';
    observer.observe(el);
  });
})();
