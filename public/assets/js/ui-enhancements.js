/* ========================================
   SAFRO UI Enhancements v7.3
   Safe adapter for the existing static app
   ======================================== */
(() => {
  'use strict';

  const SELECTORS = {
    header: '.main-header, .header',
    nav: '.main-nav, .header .links',
    hamburger: '.hamburger',
    darkToggle: '.dark-toggle',
    cards: [
      '.tour-card-v49',
      '.clickable-tour-card',
      '.country-line-card',
      '.hotel',
      '.booking-hotel-card',
      '.visa-card',
      '.admin-hotel-card',
      '.source-import-card',
      '.currency-admin-card',
      '.staff-visa-card',
      '.card'
    ].join(','),
    floatingCta: '#customTourFloatingShell, .floating-cta'
  };

  let revealObserver = null;
  let domObserver = null;
  let scrollQueued = false;
  let lastScrollY = window.scrollY || 0;
  let ctaIdleTimer = null;

  function initMobileMenu() {
    const hamburger = document.querySelector(SELECTORS.hamburger);
    const nav = document.querySelector(SELECTORS.nav);
    if (!hamburger || !nav || hamburger.dataset.uiBound === '1') return;

    hamburger.dataset.uiBound = '1';
    hamburger.addEventListener('click', () => {
      const open = !nav.classList.contains('open');
      hamburger.classList.toggle('active', open);
      nav.classList.toggle('open', open);
      hamburger.setAttribute('aria-expanded', String(open));
      hamburger.setAttribute('aria-label', open ? 'بستن منو' : 'باز کردن منو');
    });

    nav.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        hamburger.classList.remove('active');
        nav.classList.remove('open');
        hamburger.setAttribute('aria-expanded', 'false');
        hamburger.setAttribute('aria-label', 'باز کردن منو');
      });
    });

    document.addEventListener('click', event => {
      if (!nav.classList.contains('open')) return;
      if (nav.contains(event.target) || hamburger.contains(event.target)) return;
      hamburger.classList.remove('active');
      nav.classList.remove('open');
      hamburger.setAttribute('aria-expanded', 'false');
    });
  }

  function initRevealObserver() {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    if (!('IntersectionObserver' in window)) return;

    revealObserver = new IntersectionObserver(
      entries => {
        entries.forEach(entry => {
          if (!entry.isIntersecting) return;
          entry.target.classList.add('ui-reveal-visible');
          revealObserver.unobserve(entry.target);
        });
      },
      { threshold: 0.08, rootMargin: '40px 0px' }
    );
  }

  function scanCards(root = document) {
    if (!revealObserver) return;
    const cards = root.matches?.(SELECTORS.cards)
      ? [root]
      : Array.from(root.querySelectorAll?.(SELECTORS.cards) || []);

    cards.forEach((card, index) => {
      if (card.dataset.uiReveal === '1') return;
      card.dataset.uiReveal = '1';
      card.classList.add('ui-reveal');
      card.style.setProperty('--ui-delay', `${Math.min(index % 6, 5) * 55}ms`);
      revealObserver.observe(card);
    });
  }

  function initDynamicCardAnimations() {
    initRevealObserver();
    scanCards(document);
    if (!('MutationObserver' in window)) return;

    domObserver = new MutationObserver(mutations => {
      mutations.forEach(mutation => {
        mutation.addedNodes.forEach(node => {
          if (node.nodeType === 1) scanCards(node);
        });
      });
      initMobileMenu();
      syncDarkIcon();
    });
    domObserver.observe(document.body, { childList: true, subtree: true });
  }

  function updateScrollUI() {
    scrollQueued = false;
    const y = Math.max(0, window.scrollY || document.documentElement.scrollTop || 0);
    const header = document.querySelector(SELECTORS.header);
    if (header) header.classList.toggle('is-scrolled', y > 50);

    const cta = document.querySelector(SELECTORS.floatingCta);
    if (cta) {
      cta.classList.toggle('is-page-scrolled', y > 180);
      cta.classList.remove('is-scroll-hidden');
    }

    lastScrollY = y;
  }

  function initScrollInteractions() {
    updateScrollUI();
    window.addEventListener(
      'scroll',
      () => {
        if (scrollQueued) return;
        scrollQueued = true;
        requestAnimationFrame(updateScrollUI);
      },
      { passive: true }
    );
  }

  function syncDarkIcon() {
    const toggle = document.querySelector(SELECTORS.darkToggle);
    if (!toggle) return;
    const icon = toggle.querySelector('i');
    const isDark = document.documentElement.getAttribute('data-theme') === 'dark' || document.body.classList.contains('dark');
    if (icon) icon.className = isDark ? 'fa-solid fa-sun' : 'fa-solid fa-moon';
    toggle.setAttribute('aria-label', isDark ? 'فعال کردن حالت روشن' : 'فعال کردن حالت تاریک');
    toggle.setAttribute('title', isDark ? 'حالت روشن' : 'حالت تاریک');
  }

  function initThemeSync() {
    syncDarkIcon();
    const toggle = document.querySelector(SELECTORS.darkToggle);
    if (toggle && toggle.dataset.themeBound !== '1') {
      toggle.dataset.themeBound = '1';
      toggle.addEventListener('click', () => setTimeout(syncDarkIcon, 0));
    }
    if ('MutationObserver' in window) {
      const themeObserver = new MutationObserver(syncDarkIcon);
      themeObserver.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] });
      themeObserver.observe(document.body, { attributes: true, attributeFilter: ['class'] });
    }
    document.addEventListener('safro:themechange', syncDarkIcon);
  }

  function toEnglishDigits(value) {
    return String(value)
      .replace(/[۰-۹]/g, d => '۰۱۲۳۴۵۶۷۸۹'.indexOf(d))
      .replace(/[٠-٩]/g, d => '٠١٢٣٤٥٦٧٨٩'.indexOf(d));
  }

  function initCounters() {
    const counters = document.querySelectorAll('.hero-stats .stat .number[data-count], [data-ui-counter]');
    counters.forEach(element => {
      if (element.dataset.counterBound === '1') return;
      const raw = element.dataset.count || element.dataset.uiCounter || element.textContent;
      const target = Number.parseInt(toEnglishDigits(raw).replace(/[^0-9]/g, ''), 10);
      if (!Number.isFinite(target)) return;
      element.dataset.counterBound = '1';

      const start = performance.now();
      const duration = 1200;
      const suffix = /\+/.test(raw) ? '+' : '';
      const frame = now => {
        const progress = Math.min(1, (now - start) / duration);
        const eased = 1 - Math.pow(1 - progress, 3);
        element.textContent = Math.round(target * eased).toLocaleString('fa-IR') + suffix;
        if (progress < 1) requestAnimationFrame(frame);
      };
      requestAnimationFrame(frame);
    });
  }

  function initLazyImages() {
    const images = Array.from(document.querySelectorAll('img[data-src]'));
    if (!images.length) return;
    if (!('IntersectionObserver' in window)) {
      images.forEach(img => {
        img.src = img.dataset.src;
        img.removeAttribute('data-src');
      });
      return;
    }

    const imageObserver = new IntersectionObserver(
      entries => {
        entries.forEach(entry => {
          if (!entry.isIntersecting) return;
          const img = entry.target;
          img.src = img.dataset.src;
          img.removeAttribute('data-src');
          img.classList.add('loaded');
          imageObserver.unobserve(img);
        });
      },
      { rootMargin: '120px' }
    );
    images.forEach(img => imageObserver.observe(img));
  }

  function initAll() {
    initMobileMenu();
    initDynamicCardAnimations();
    initScrollInteractions();
    initThemeSync();
    initCounters();
    initLazyImages();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => setTimeout(initAll, 80));
  } else {
    setTimeout(initAll, 80);
  }
})();

/* SAFARO v10 — navigation + progress UX */
(() => {
  'use strict';

  function ensureScrollProgress() {
    if (document.getElementById('safaroScrollProgress')) return;
    const bar = document.createElement('div');
    bar.id = 'safaroScrollProgress';
    bar.setAttribute('aria-hidden', 'true');
    document.body.appendChild(bar);
    const update = () => {
      const doc = document.documentElement;
      const total = Math.max(1, doc.scrollHeight - doc.clientHeight);
      bar.style.width = `${Math.min(100, Math.max(0, (window.scrollY / total) * 100))}%`;
    };
    update();
    window.addEventListener('scroll', update, { passive: true });
    window.addEventListener('resize', update, { passive: true });
  }

  function bindSectionNavigation(navSelector) {
    const nav = document.querySelector(navSelector);
    if (!nav || nav.dataset.sectionSpy === '1') return;
    nav.dataset.sectionSpy = '1';
    const links = Array.from(nav.querySelectorAll('a[href^="#"]'));
    const pairs = links.map(link => ({ link, section: document.querySelector(link.getAttribute('href')) })).filter(x => x.section);
    if (!pairs.length || !('IntersectionObserver' in window)) return;

    const observer = new IntersectionObserver(entries => {
      const visible = entries.filter(e => e.isIntersecting).sort((a,b) => b.intersectionRatio-a.intersectionRatio)[0];
      if (!visible) return;
      links.forEach(link => link.classList.remove('active'));
      const current = pairs.find(x => x.section === visible.target);
      current?.link.classList.add('active');
    }, { rootMargin: '-18% 0px -68% 0px', threshold: [0,.05,.2] });
    pairs.forEach(x => observer.observe(x.section));
  }

  function bindEscapeUX() {
    if (document.documentElement.dataset.escapeUx === '1') return;
    document.documentElement.dataset.escapeUx = '1';
    document.addEventListener('keydown', event => {
      if (event.key !== 'Escape') return;
      const nav = document.querySelector('.main-nav.open');
      const burger = document.querySelector('.hamburger.active');
      if (nav) nav.classList.remove('open');
      if (burger) {
        burger.classList.remove('active');
        burger.setAttribute('aria-expanded','false');
      }
      document.querySelectorAll('.airline-picker-panel.on').forEach(el => el.classList.remove('on'));
    });
  }

  function bootV10UX() {
    ensureScrollProgress();
    bindSectionNavigation('.admin-side-nav');
    bindSectionNavigation('.staff-top-tabs');
    bindEscapeUX();
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', () => setTimeout(bootV10UX, 140));
  else setTimeout(bootV10UX, 140);

  if ('MutationObserver' in window) {
    new MutationObserver(() => {
      bindSectionNavigation('.admin-side-nav');
      bindSectionNavigation('.staff-top-tabs');
    }).observe(document.documentElement, { childList:true, subtree:true });
  }
})();
