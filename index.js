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


/* ── LIVE COMPETITIVE PROGRAMMING STATS ─────────────────────
   Fetches real-time data from LeetCode (GraphQL) and
   Codeforces (REST API) on every page load.
   Falls back to the hardcoded values if a fetch fails.
   ──────────────────────────────────────────────────────────── */

const LC_USERNAME = 'Krishna_43';
const CF_HANDLE   = 'krishnap_14';

/** Helper: format "last updated" timestamp */
function fmtTime() {
  return new Date().toLocaleTimeString('en-IN', {
    hour: '2-digit', minute: '2-digit', timeZoneName: 'short'
  });
}

/** Animate a number counting up for visual polish */
function countUp(el, target, duration = 800) {
  if (!el) return;
  const start   = parseInt(el.textContent) || 0;
  const range   = target - start;
  const step    = 16;
  const steps   = Math.ceil(duration / step);
  let   current = 0;
  const timer = setInterval(() => {
    current++;
    el.textContent = Math.round(start + (range * current) / steps);
    if (current >= steps) {
      el.textContent = target;
      clearInterval(timer);
    }
  }, step);
}

/* ── LEETCODE ──────────────────────────────────────────────── */
async function fetchLeetCode() {
  const query = `
    query userPublicProfile($username: String!) {
      matchedUser(username: $username) {
        profile { reputation starRating }
        badges { id name }
        submitStats {
          acSubmissionNum { difficulty count submissions }
        }
        languageProblemCount { languageName problemsSolved }
        tagProblemCounts {
          advanced  { tagName tagSlug problemsSolved }
          intermediate { tagName tagSlug problemsSolved }
          fundamental  { tagName tagSlug problemsSolved }
        }
      }
      userContestRanking(username: $username) {
        rating attendedContestsCount
      }
    }
  `;

  // Use a CORS proxy since LeetCode doesn't allow direct browser requests
  const proxyUrl = 'https://corsproxy.io/?url=https://leetcode.com/graphql';

  const res = await fetch(proxyUrl, {
    method : 'POST',
    headers: { 'Content-Type': 'application/json' },
    body   : JSON.stringify({ query, variables: { username: LC_USERNAME } }),
  });

  if (!res.ok) throw new Error(`LeetCode HTTP ${res.status}`);
  const json = await res.json();
  const data = json?.data;
  if (!data?.matchedUser) throw new Error('No LeetCode data');

  const user          = data.matchedUser;
  const contestRating = Math.round(data.userContestRanking?.rating ?? 1502);
  const totalSolved   = user.submitStats.acSubmissionNum.find(d => d.difficulty === 'All')?.count ?? 160;
  const badgeCount    = user.badges?.length ?? 2;

  // Language breakdown (top 3)
  const langs = [...(user.languageProblemCount ?? [])]
    .sort((a, b) => b.problemsSolved - a.problemsSolved)
    .slice(0, 3);

  // Top tags (merge all categories, sort by solved)
  const allTags = [
    ...(user.tagProblemCounts?.fundamental  ?? []),
    ...(user.tagProblemCounts?.intermediate ?? []),
    ...(user.tagProblemCounts?.advanced     ?? []),
  ].sort((a, b) => b.problemsSolved - a.problemsSolved).slice(0, 5);

  return { contestRating, totalSolved, badgeCount, langs, allTags };
}

function applyLeetCode({ contestRating, totalSolved, badgeCount, langs, allTags }) {
  // Rating
  const lcRatingEl = document.getElementById('lc-rating');
  if (lcRatingEl) countUp(lcRatingEl, contestRating);

  // Solved
  const lcSolvedEl = document.getElementById('lc-solved');
  if (lcSolvedEl) {
    lcSolvedEl.innerHTML = totalSolved + '<span>+</span>';
  }

  // Badges
  const lcBadgesEl = document.getElementById('lc-badges');
  if (lcBadgesEl) countUp(lcBadgesEl, badgeCount);

  // Rating bar
  const barPct = Math.min((contestRating / 3000) * 100, 100).toFixed(1);
  const barFill = document.getElementById('lc-bar-fill');
  if (barFill) barFill.style.width = barPct + '%';
  const barLabel = document.getElementById('lc-bar-label');
  if (barLabel) barLabel.textContent = `${contestRating} / 3000`;

  // Tags
  if (allTags.length) {
    const tagsEl = document.getElementById('lc-tags');
    if (tagsEl) {
      tagsEl.innerHTML = allTags
        .map(t => `<span class="pill">${t.tagName} ×${t.problemsSolved}</span>`)
        .join('');
    }
  }

  // Language breakdown (update existing known ids if matched)
  if (langs.length) {
    const langMap = { 'C++': 'lc-cpp', 'Python3': 'lc-py', 'MySQL': 'lc-sql' };
    langs.forEach(l => {
      const id = langMap[l.languageName];
      if (id) {
        const el = document.getElementById(id);
        if (el) countUp(el, l.problemsSolved);
      }
    });
  }

  // Terminal sync
  const termLcRating = document.getElementById('term-lc-rating');
  if (termLcRating) termLcRating.textContent = contestRating;
  const termSolved = document.getElementById('term-solved');
  if (termSolved) termSolved.textContent = totalSolved + '+';
  const termBadges = document.getElementById('term-badges');
  if (termBadges) termBadges.textContent = badgeCount;

  // Hero desc
  const heroCount = document.getElementById('hero-problem-count');
  if (heroCount) heroCount.textContent = totalSolved + '+';

  // Timestamp
  const updEl = document.getElementById('lc-updated');
  if (updEl) updEl.textContent = `↻ Updated ${fmtTime()} · LeetCode GraphQL`;

  // Live badge stays green
  const badge = document.getElementById('lc-live-badge');
  if (badge) badge.classList.remove('error');
}

/* ── CODEFORCES ────────────────────────────────────────────── */
async function fetchCodeforces() {
  // User info
  const infoRes = await fetch(
    `https://codeforces.com/api/user.info?handles=${CF_HANDLE}`
  );
  if (!infoRes.ok) throw new Error(`CF info HTTP ${infoRes.status}`);
  const infoJson = await infoRes.json();
  if (infoJson.status !== 'OK') throw new Error('CF info failed');
  const user = infoJson.result[0];

  // Contest history (for solved count via submissions)
  const solvedRes = await fetch(
    `https://codeforces.com/api/user.status?handle=${CF_HANDLE}&from=1&count=1000`
  );
  let solvedCount = 22;
  if (solvedRes.ok) {
    const solvedJson = await solvedRes.json();
    if (solvedJson.status === 'OK') {
      // Count distinct problems with verdict OK
      const solvedSet = new Set(
        solvedJson.result
          .filter(s => s.verdict === 'OK')
          .map(s => `${s.problem.contestId}-${s.problem.index}`)
      );
      solvedCount = solvedSet.size;
    }
  }

  // Contest count
  const ratingRes = await fetch(
    `https://codeforces.com/api/user.rating?handle=${CF_HANDLE}`
  );
  let contestCount = 0;
  if (ratingRes.ok) {
    const ratingJson = await ratingRes.json();
    if (ratingJson.status === 'OK') contestCount = ratingJson.result.length;
  }

  return {
    currentRating : user.rating    ?? 945,
    maxRating     : user.maxRating ?? 1014,
    rank          : user.rank      ?? 'newbie',
    contribution  : user.contribution ?? 0,
    solvedCount,
    contestCount,
  };
}

function applyCodeforces({ currentRating, maxRating, rank, contribution, solvedCount, contestCount }) {
  // Current rating
  const cfCurrent = document.getElementById('cf-current');
  if (cfCurrent) countUp(cfCurrent, currentRating);

  // Max rating
  const cfMax = document.getElementById('cf-max');
  if (cfMax) countUp(cfMax, maxRating);

  // Solved
  const cfSolved = document.getElementById('cf-solved');
  if (cfSolved) countUp(cfSolved, solvedCount);
  const cfSolved2 = document.getElementById('cf-solved2');
  if (cfSolved2) countUp(cfSolved2, solvedCount);

  // Rating bar
  const barPct = Math.min((maxRating / 3500) * 100, 100).toFixed(1);
  const barFill = document.getElementById('cf-bar-fill');
  if (barFill) barFill.style.width = barPct + '%';
  const barLabel = document.getElementById('cf-bar-label');
  if (barLabel) barLabel.textContent = `${maxRating} / 3500`;

  // Rank badge
  const rankEl = document.getElementById('cf-rank');
  const rankCapital = rank.charAt(0).toUpperCase() + rank.slice(1);
  if (rankEl) rankEl.textContent = rankCapital;

  // Contests
  const contestsEl = document.getElementById('cf-contests');
  if (contestsEl) contestsEl.textContent = contestCount;

  // Contribution
  const contribEl = document.getElementById('cf-contrib');
  if (contribEl) contribEl.textContent = contribution;

  // Journey note max rating
  const cfMaxNote = document.getElementById('cf-max-note');
  if (cfMaxNote) cfMaxNote.textContent = maxRating;

  // Terminal sync
  const termCfRating = document.getElementById('term-cf-rating');
  if (termCfRating) termCfRating.textContent = maxRating;

  // Timestamp
  const updEl = document.getElementById('cf-updated');
  if (updEl) updEl.textContent = `↻ Updated ${fmtTime()} · Codeforces API`;

  // Live badge
  const badge = document.getElementById('cf-live-badge');
  if (badge) badge.classList.remove('error');
}

/* ── BOOT: fetch both platforms in parallel ─────────────────── */
(async () => {
  const results = await Promise.allSettled([
    fetchLeetCode(),
    fetchCodeforces(),
  ]);

  // LeetCode
  if (results[0].status === 'fulfilled') {
    applyLeetCode(results[0].value);
  } else {
    console.warn('LeetCode fetch failed:', results[0].reason);
    const updEl  = document.getElementById('lc-updated');
    const badge  = document.getElementById('lc-live-badge');
    if (updEl)  updEl.textContent  = '⚠ Could not fetch live data — showing cached values';
    if (badge)  badge.classList.add('error');
  }

  // Codeforces
  if (results[1].status === 'fulfilled') {
    applyCodeforces(results[1].value);
  } else {
    console.warn('Codeforces fetch failed:', results[1].reason);
    const updEl  = document.getElementById('cf-updated');
    const badge  = document.getElementById('cf-live-badge');
    if (updEl)  updEl.textContent  = '⚠ Could not fetch live data — showing cached values';
    if (badge)  badge.classList.add('error');
  }
})();