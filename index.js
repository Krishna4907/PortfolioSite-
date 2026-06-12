/* ============================================================
   KRISHNA PANDEY — PORTFOLIO JAVASCRIPT
   index.js
   ============================================================ */

/* ── SCROLL REVEAL ──────────────────────────────────────────
   Uses IntersectionObserver to fade + slide up elements
   with the class `.reveal` as they enter the viewport.
   Also triggers the animated rating bar fills.
   ──────────────────────────────────────────────────────────── */

const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');

        // Trigger any rating bars inside the revealed element
        entry.target
          .querySelectorAll('.rating-bar-fill')
          .forEach((bar) => bar.classList.add('active'));

        // Stop observing once visible (one-time animation)
        revealObserver.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.12 }
);

// Observe every .reveal element on the page
document.querySelectorAll('.reveal').forEach((el) => {
  revealObserver.observe(el);
});


/* ── RATING BARS — INITIAL TRIGGER ─────────────────────────
   Trigger bars that are already in the viewport on page load
   (e.g. if the user lands mid-page or on a short screen).
   ──────────────────────────────────────────────────────────── */

setTimeout(() => {
  document.querySelectorAll('.rating-bar-fill').forEach((bar) => {
    const rect = bar.getBoundingClientRect();
    if (rect.top < window.innerHeight) {
      bar.classList.add('active');
    }
  });
}, 400);


/* ── ACTIVE NAV LINK HIGHLIGHT ──────────────────────────────
   Highlights the nav link that corresponds to the section
   currently in view as the user scrolls.
   ──────────────────────────────────────────────────────────── */

const navLinks = document.querySelectorAll('.nav-links a');

function updateActiveNav() {
  let currentId = '';

  // Walk every element that has an id and track the deepest
  // one whose top edge is above the scroll + offset threshold
  document.querySelectorAll('[id]').forEach((el) => {
    if (window.scrollY >= el.offsetTop - 140) {
      currentId = el.id;
    }
  });

  navLinks.forEach((link) => {
    const href = link.getAttribute('href');
    if (href === '#' + currentId) {
      link.style.color = 'var(--cyan)';
    } else {
      link.style.color = '';
    }
  });
}

window.addEventListener('scroll', updateActiveNav, { passive: true });
// Run once on load so the first section is highlighted immediately
updateActiveNav();


/* ── SMOOTH NAV CLICK ───────────────────────────────────────
   Adds a small UX polish: clicking a nav link closes any
   lingering hover states and lets the CSS scroll-behavior
   handle the animation.
   ──────────────────────────────────────────────────────────── */

navLinks.forEach((link) => {
  link.addEventListener('click', () => {
    // Let the browser handle smooth scroll via CSS,
    // just blur focus so the link doesn't stay highlighted
    link.blur();
  });
});


/* ── NAV BACKGROUND ON SCROLL ───────────────────────────────
   The nav already has backdrop-filter via CSS; this adds
   a subtle extra border emphasis once the user scrolls
   past the hero fold.
   ──────────────────────────────────────────────────────────── */

const nav = document.querySelector('nav');

function updateNavStyle() {
  if (window.scrollY > 60) {
    nav.style.borderBottomColor = 'rgba(0, 212, 255, 0.18)';
  } else {
    nav.style.borderBottomColor = '';
  }
}

window.addEventListener('scroll', updateNavStyle, { passive: true });


/* ── PILL HOVER SOUND (optional, silent by default) ────────
   Tiny tactile feedback could be added here if desired.
   Left as a commented stub for easy extension.

document.querySelectorAll('.pill').forEach((pill) => {
  pill.addEventListener('mouseenter', () => {
    // new Audio('click.mp3').play();
  });
});
   ──────────────────────────────────────────────────────────── */


/* ── COPY EMAIL TO CLIPBOARD ────────────────────────────────
   Clicking the email contact-link-row copies the address
   to clipboard and briefly shows a "Copied!" confirmation.
   ──────────────────────────────────────────────────────────── */

const emailRow = document.querySelector('a[href^="mailto:"].contact-link-row');

if (emailRow) {
  emailRow.addEventListener('click', (e) => {
    const email = 'krishnapandey3475@gmail.com';

    // Only intercept if Clipboard API is available
    if (navigator.clipboard) {
      e.preventDefault();
      navigator.clipboard.writeText(email).then(() => {
        const arrow = emailRow.querySelector('.clr-arrow');
        const originalText = arrow.textContent;
        arrow.textContent = '✓ Copied';
        arrow.style.color = 'var(--cyan)';

        setTimeout(() => {
          arrow.textContent = originalText;
          arrow.style.color = '';
        }, 2000);
      });
    }
    // If clipboard isn't available, the default mailto: fires normally
  });
}


/* ── PROJECT CARD — KEYBOARD ACCESSIBILITY ──────────────────
   Project cards are <a> tags so they're naturally focusable,
   but this ensures Enter key behaves the same as a click.
   ──────────────────────────────────────────────────────────── */

document.querySelectorAll('.project-card').forEach((card) => {
  card.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
      card.click();
    }
  });
});


/* ── REDUCED MOTION RESPECT ─────────────────────────────────
   If the user has prefers-reduced-motion enabled, skip all
   scroll-triggered animations and show content immediately.
   ──────────────────────────────────────────────────────────── */

const prefersReducedMotion = window.matchMedia(
  '(prefers-reduced-motion: reduce)'
).matches;

if (prefersReducedMotion) {
  document.querySelectorAll('.reveal').forEach((el) => {
    el.classList.add('visible');
  });
  document.querySelectorAll('.rating-bar-fill').forEach((bar) => {
    bar.classList.add('active');
  });
}