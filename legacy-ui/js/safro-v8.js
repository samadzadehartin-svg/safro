/* Safro 8.0 — small progressive UX enhancements */
(() => {
  'use strict';

  function toPersianDateOption(value) {
    return String(value || '');
  }

  function refreshHeroDates() {
    const destination = document.getElementById('heroSearchDest');
    const dateSelect = document.getElementById('heroSearchDate');
    if (!destination || !dateSelect || typeof buyerTours !== 'function') return;

    const selectedDestination = destination.value;
    const dates = Array.from(
      new Set(
        buyerTours()
          .filter(t => t && t.status === 'active')
          .filter(t => selectedDestination === 'all' || (typeof tourDestName === 'function' ? tourDestName(t) : t.dest) === selectedDestination)
          .flatMap(t => Array.isArray(t.dates) ? t.dates : [])
          .filter(Boolean)
      )
    ).sort((a, b) => String(a).localeCompare(String(b), 'fa'));

    const previous = dateSelect.value;
    dateSelect.innerHTML = '<option value="all">هر تاریخی</option>' + dates
      .map(date => `<option value="${date}">${toPersianDateOption(date)}</option>`)
      .join('');
    dateSelect.value = dates.includes(previous) ? previous : 'all';
  }

  function bindHeroSearch() {
    const destination = document.getElementById('heroSearchDest');
    const form = document.querySelector('.hero-search-v8');
    if (destination && destination.dataset.v8Bound !== '1') {
      destination.dataset.v8Bound = '1';
      destination.addEventListener('change', refreshHeroDates);
    }
    if (form && form.dataset.v8Bound !== '1') {
      form.dataset.v8Bound = '1';
      form.addEventListener('submit', () => {
        setTimeout(() => {
          const count = document.getElementById('tourCount')?.textContent || '۰';
          if (typeof showToast === 'function') showToast(`${count} تور متناسب پیدا شد`);
        }, 180);
      });
    }
  }

  function bindGlobalKeyboard() {
    if (document.documentElement.dataset.v8Keyboard === '1') return;
    document.documentElement.dataset.v8Keyboard = '1';
    document.addEventListener('keydown', event => {
      if (event.key !== 'Escape') return;
      document.querySelector('.main-nav.open')?.classList.remove('open');
      document.querySelector('.hamburger.active')?.classList.remove('active');
      document.querySelectorAll('.modal.on, .popup-backdrop.on, .custom-tour-popup-backdrop.on, .lightbox.on').forEach(el => el.classList.remove('on'));
    });
  }

  function enhanceDynamicUi() {
    bindHeroSearch();
    document.querySelectorAll('input[placeholder]:not([aria-label]), textarea[placeholder]:not([aria-label])').forEach(field => {
      field.setAttribute('aria-label', field.getAttribute('placeholder').replace(/\s*\*\s*$/, ''));
    });
    document.querySelectorAll('button.popup-close:not([aria-label]), button.custom-tour-popup-close:not([aria-label])').forEach(button => {
      button.setAttribute('aria-label', 'بستن پنجره');
    });
    document.querySelectorAll('img:not([loading])').forEach((img, index) => {
      if (index > 1) img.loading = 'lazy';
      img.decoding = 'async';
    });
  }

  function init() {
    bindGlobalKeyboard();
    enhanceDynamicUi();
    if ('MutationObserver' in window) {
      const observer = new MutationObserver(() => enhanceDynamicUi());
      observer.observe(document.body, { childList: true, subtree: true });
    }
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
})();
