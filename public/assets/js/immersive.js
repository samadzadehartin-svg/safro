/* Safro 8.4 — progressive immersive interactions */
(() => {
  'use strict';

  const reduceMotion = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
  let revealObserver;
  let raf = 0;

  function markPageMode() {
    const isHome = Boolean(document.querySelector('.hero-v8.immersive-hero'));
    document.body.classList.toggle('immersive-home', isHome);
    document.body.classList.toggle('immersive-inner', !isHome);
  }

  function ensureProgress() {
    if (document.querySelector('.immersive-progress')) return;
    const bar = document.createElement('div');
    bar.className = 'immersive-progress';
    bar.setAttribute('aria-hidden', 'true');
    bar.innerHTML = '<i></i>';
    document.body.appendChild(bar);
  }

  function updateScrollState() {
    if (raf) return;
    raf = requestAnimationFrame(() => {
      raf = 0;
      const y = window.scrollY || 0;
      const max = Math.max(1, document.documentElement.scrollHeight - window.innerHeight);
      const progress = Math.min(100, Math.max(0, y / max * 100));
      document.documentElement.style.setProperty('--immersive-progress', progress + '%');
      document.body.classList.toggle('immersive-header-scrolled', y > 46);
      document.body.classList.toggle('immersive-cta-compact', y > Math.max(380, window.innerHeight * .66));
    });
  }

  function bindHeroDepth() {
    const hero = document.querySelector('.immersive-hero');
    if (!hero || hero.dataset.immersiveDepth === '1' || reduceMotion) return;
    hero.dataset.immersiveDepth = '1';

    hero.addEventListener('pointermove', event => {
      const rect = hero.getBoundingClientRect();
      const x = (event.clientX - rect.left) / rect.width;
      const y = (event.clientY - rect.top) / rect.height;
      const dx = (x - .5) * 12;
      const dy = (y - .5) * 12;
      hero.style.setProperty('--hero-dx', dx.toFixed(2) + 'px');
      hero.style.setProperty('--hero-dy', dy.toFixed(2) + 'px');
      hero.style.setProperty('--immersive-x', (x * 100).toFixed(1) + '%');
      hero.style.setProperty('--immersive-y', (y * 100).toFixed(1) + '%');
    }, { passive: true });

    hero.addEventListener('pointerleave', () => {
      hero.style.setProperty('--hero-dx', '0px');
      hero.style.setProperty('--hero-dy', '0px');
      hero.style.setProperty('--immersive-x', '22%');
      hero.style.setProperty('--immersive-y', '28%');
    });
  }

  function prepareReveal() {
    const selectors = [
      '.immersive-story-copy',
      '.immersive-scene',
      '.country-line-section',
      '.country-line-card',
      '.special-tours-section',
      '.tour-list-head-v49',
      '.tour-card-v49',
      '.buyer-visa-section',
      '.faq-section-v49',
      '.about-contact-section'
    ];

    const nodes = document.querySelectorAll(selectors.join(','));
    if (reduceMotion || !('IntersectionObserver' in window)) {
      nodes.forEach(node => node.classList.add('is-visible'));
      return;
    }

    if (!revealObserver) {
      revealObserver = new IntersectionObserver(entries => {
        entries.forEach(entry => {
          if (!entry.isIntersecting) return;
          entry.target.classList.add('is-visible');
          revealObserver.unobserve(entry.target);
        });
      }, { rootMargin: '0px 0px -8% 0px', threshold: .08 });
    }

    nodes.forEach(node => {
      if (node.dataset.immersiveReveal === '1') return;
      node.dataset.immersiveReveal = '1';
      node.classList.add('immersive-reveal');
      revealObserver.observe(node);
    });
  }

  function enhance() {
    markPageMode();
    ensureProgress();
    bindHeroDepth();
    prepareReveal();
    updateScrollState();
  }

  window.scrollImmersiveNext = function scrollImmersiveNext() {
    const next = document.querySelector('.immersive-story, .country-line-section');
    next?.scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth', block: 'start' });
  };

  window.addEventListener('scroll', updateScrollState, { passive: true });
  window.addEventListener('resize', updateScrollState, { passive: true });

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', enhance);
  else enhance();

  const observer = new MutationObserver(() => enhance());
  observer.observe(document.documentElement, { childList: true, subtree: true });
})();
