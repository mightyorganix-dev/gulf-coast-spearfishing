import { bindAmbientToggles } from './ambient.js';
import { mountCaustics } from './caustics.js';

const PAGES = [
  { href: 'index.html', label: 'Home', key: 'home' },
  { href: 'about.html', label: 'About', key: 'about' },
  { href: 'species.html', label: 'Species', key: 'species' },
  { href: 'faq.html', label: 'FAQ', key: 'faq' },
  { href: 'what-to-bring.html', label: 'What to Bring', key: 'bring' },
  { href: 'red-snapper-season.html', label: 'Season', key: 'season' },
  { href: 'safety.html', label: 'Safety', key: 'safety' },
  { href: 'reviews.html', label: 'Reviews', key: 'reviews' },
  { href: 'contact.html', label: 'Contact', key: 'contact' },
];

const PORTAL_LINKS = [
  { href: 'booking.html', label: 'Book' },
  { href: 'itinerary.html', label: 'Itinerary' },
  { href: 'captain.html', label: 'Captain' },
  { href: 'admin.html', label: 'Admin' },
];

function currentPage() {
  const path = window.location.pathname.split('/').pop() || 'index.html';
  return path === '' ? 'index.html' : path;
}

const WAVE_ICON = `<svg class="icon-wave" viewBox="0 0 24 24" width="18" height="18" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"><path d="M2 14c2.5-3 4.5-3 7 0s4.5 3 7 0 4.5-3 6 0"/><path d="M2 18c2.5-3 4.5-3 7 0s4.5 3 7 0 4.5-3 6 0" opacity=".55"/></svg>`;

const LOGO_SVG = `<svg class="brand-svg" viewBox="0 0 40 40" width="34" height="34" aria-hidden="true"><defs><linearGradient id="brandGrad" x1="0" y1="0" x2="40" y2="40"><stop stop-color="#0c4a6e"/><stop offset="1" stop-color="#0f766e"/></linearGradient></defs><circle cx="20" cy="20" r="18" fill="url(#brandGrad)"/><path d="M9 23c3.5-5.5 8.5-7 12-3.5s6.5 1.5 9-2" stroke="#f5f0e6" stroke-width="1.75" fill="none" stroke-linecap="round"/><path d="M12 27c2.5-2.5 6-3.5 9-1" stroke="#99f6e4" stroke-width="1.25" fill="none" stroke-linecap="round"/></svg>`;

export function renderNav(active = '') {
  const page = currentPage();
  const navEl = document.getElementById('site-nav');
  if (!navEl) return;

  const guestLinks = PAGES.map((p) => {
    const isActive = page === p.href || active === p.key;
    return `<a href="${p.href}" class="nav-link${isActive ? ' is-active' : ''}">${p.label}</a>`;
  }).join('');

  navEl.innerHTML = `
    <div class="nav-inner">
      <a href="index.html" class="brand" id="brand-mark" title="Gulf Coast Spearfishing">
        <span class="brand-mark">${LOGO_SVG}</span>
        <span class="brand-text">
          <strong>Gulf Coast Spearfishing</strong>
          <em>Gulf Shores &amp; Orange Beach</em>
        </span>
      </a>

      <button type="button" class="nav-toggle" id="nav-toggle" aria-label="Open menu" aria-expanded="false">
        <span></span><span></span><span></span>
      </button>

      <div class="nav-panel" id="nav-panel">
        <div class="nav-links">${guestLinks}</div>
        <div class="nav-portals">
          ${PORTAL_LINKS.map((l) => `<a href="${l.href}" class="portal-chip">${l.label}</a>`).join('')}
        </div>
        <div class="nav-end">
          <button type="button" class="ambient-toggle" data-ambient-toggle aria-pressed="false" title="Play soft ocean ambience">
            ${WAVE_ICON}
            <span class="sr-only">Toggle ocean ambience</span>
          </button>
          <a href="booking.html" class="btn btn-primary nav-cta">Book a Charter</a>
        </div>
      </div>
    </div>
  `;

  const toggle = document.getElementById('nav-toggle');
  const panel = document.getElementById('nav-panel');
  toggle?.addEventListener('click', () => {
    const open = panel.classList.toggle('is-open');
    toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
  });

  bindBrandEasterEgg();
}

export function renderFooter() {
  const footer = document.getElementById('site-footer');
  if (!footer) return;

  footer.innerHTML = `
    <div class="footer-inner">
      <div class="footer-top">
        <div class="footer-brand">
          <strong>Gulf Coast Spearfishing Charters</strong>
          <p>USCG-licensed captains. Purpose-built spearfishing vessels. Zeke&rsquo;s Marina &amp; Orange Beach Marina.</p>
          <button type="button" class="ambient-toggle ambient-toggle--footer" data-ambient-toggle aria-pressed="false" title="Play soft ocean ambience">
            ${WAVE_ICON}
            <span>Ocean ambience</span>
          </button>
        </div>
        <div class="footer-cols">
          <div>
            <h4>Explore</h4>
            <a href="about.html">About</a>
            <a href="species.html">Target Species</a>
            <a href="lionfish.html">Lionfish Conservation</a>
            <a href="red-snapper-season.html">Red Snapper Season</a>
            <a href="reviews.html">Guest Reviews</a>
          </div>
          <div>
            <h4>Plan</h4>
            <a href="faq.html">FAQ</a>
            <a href="what-to-bring.html">What to Bring</a>
            <a href="safety.html">Safety &amp; Certifications</a>
            <a href="contact.html">Contact &amp; Marinas</a>
            <a href="booking.html">Book Online</a>
          </div>
          <div>
            <h4>Portals</h4>
            <a href="itinerary.html">Guest Itinerary</a>
            <a href="captain.html">Captain Portal</a>
            <a href="admin.html">Fleet Admin</a>
          </div>
        </div>
      </div>
      <div class="footer-bottom">
        <span>&copy; 2026 Gulf Coast Spearfishing Charters LLC</span>
        <span class="notice-tag">Gulf Shores &amp; Orange Beach</span>
      </div>
    </div>
  `;
}

function bindBrandEasterEgg() {
  const brand = document.getElementById('brand-mark');
  if (!brand) return;
  let clicks = 0;
  let timer = null;
  const ripple = () => {
    brand.classList.remove('brand-ripple');
    void brand.offsetWidth;
    brand.classList.add('brand-ripple');
  };
  brand.addEventListener('click', (e) => {
    clicks += 1;
    clearTimeout(timer);
    timer = setTimeout(() => { clicks = 0; }, 600);
    if (clicks >= 3) {
      e.preventDefault();
      clicks = 0;
      ripple();
    }
  });
  let pressTimer = null;
  brand.addEventListener('pointerdown', () => {
    pressTimer = setTimeout(ripple, 700);
  });
  brand.addEventListener('pointerup', () => clearTimeout(pressTimer));
  brand.addEventListener('pointerleave', () => clearTimeout(pressTimer));
}

export function initLayout(active = '') {
  renderNav(active);
  renderFooter();
  bindAmbientToggles();
  mountCaustics();
}
