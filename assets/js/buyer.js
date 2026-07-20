function beautyTrustStrip() {
  return ``;
}

let view = 'home',
  currentCat = 'all',
  currentCountry = 'all',
  selectedCountry = '',
  compare = new Set(),
  selectedTour = null,
  selectedHotel = 0,
  booking = { step: 1, tourId: null, hotel: 0, date: null, passengers: 2 };
let homeAutoResetTimer = null,
  homeAutoResetTicker = null;
const HOME_AUTO_RESET_SECONDS = 30;
if (!sessionStorage.getItem('safarro_visit_start'))
  sessionStorage.setItem('safarro_visit_start', Date.now());
function siteSeconds() {
  return Math.max(
    0,
    Math.round(
      (Date.now() - Number(sessionStorage.getItem('safarro_visit_start') || Date.now())) / 1000
    )
  );
}
function siteTourViews() {
  return Number(localStorage.getItem('safarro_tour_views') || 0);
}
function engagementPercent(seconds, views) {
  return Math.min(
    100,
    Math.round((Number(views) || 0) * 18 + Math.min(50, (Number(seconds) || 0) / 12))
  );
}
function hotelStars(n) {
  return `<span class="hotel-stars">${Array.from({ length: Number(n) || 0 })
    .map(() => '<i class="fa-solid fa-star"></i>')
    .join('')}</span>`;
}
function ratingStar() {
  return '<span class="rating-star">★</span>';
}

// v5.8: Buyer page data source alias.
// Some UI blocks use buyerTours() while the shared data layer exposes tours().
// Keep this small wrapper so the buyer UI always reads the repaired tour list.
function buyerTours() {
  return typeof tours === 'function' ? tours() : [];
}


// v5.8: destination options used by hero search and hidden filters.
// This prevents the buyer home from crashing when the search UI is rendered.
function homeSearchDestOptions(selected = 'all') {
  const names = Array.from(
    new Set(
      buyerTours()
        .filter(t => !t || t.status === 'active')
        .map(t => (typeof tourDestName === 'function' ? tourDestName(t) : t?.dest || t?.destination || ''))
        .filter(Boolean)
    )
  ).sort((a, b) => String(a).localeCompare(String(b), 'fa'));
  return `<option value="all" ${selected === 'all' ? 'selected' : ''}>همه مقصدها</option>${names
    .map(name => `<option value="${name}" ${selected === name ? 'selected' : ''}>${name}</option>`)
    .join('')}`;
}

function defaultSections() {
  return {
    description: true,
    flightInfo: true,
    dates: true,
    hotels: true,
    gallery: true,
    itinerary: true,
    docs: true,
    includes: true,
    excludes: true,
    cancellation: true,
    childPolicy: true,
    reviews: true,
  };
}
function sectionOn(t, key) {
  const v = Object.assign(defaultSections(), t.sectionVisibility || {});
  return v[key] !== false;
}
function maybe(show, html) {
  return show ? html : '';
}

function visibleHotelEntries(t) {
  const arr = (t.hotels || [])
    .map((h, i) => ({ h, i }))
    .filter(x => x.h && x.h.showInBuyer !== false);
  return arr.length ? arr : (t.hotels || []).map((h, i) => ({ h, i }));
}

function escapeAttr(v) {
  return String(v || '').replace(/"/g, '&quot;');
}
function hotelPhotosModalHtml() {
  return `<div id="hotelPhotosModal" class="hotel-photos-modal" onclick="if(event.target===this)closeHotelPhotos()">
    <div class="hotel-photos-box">
      <div class="row"><h3 id="hotelPhotosTitle">عکس‌های هتل</h3><button class="soft" onclick="closeHotelPhotos()">بستن</button></div>
      <div id="hotelPhotosGrid" class="hotel-photos-grid"></div>
      <div id="hotelBookingLinkBox" style="margin-top:12px"></div>
    </div>
  </div>`;
}
function showHotelPhotos(tourId, hotelIndex) {
  const t = findTour(tourId);
  if (!t) return;
  const h = (t.hotels || [])[hotelIndex];
  if (!h) return;
  const photos = (h.photos || h.images || []).filter(Boolean);
  $('hotelPhotosTitle').textContent = 'عکس‌های هتل ' + (h.name || '');
  $('hotelPhotosGrid').innerHTML = photos.length
    ? photos.map(src => `<img src="${src}" alt="${h.name || ''}">`).join('')
    : '<p class="small">برای این هتل هنوز عکسی ثبت نشده است.</p>';
  $('hotelBookingLinkBox').innerHTML = h.bookingLink
    ? `<a class="btn" target="_blank" href="${h.bookingLink}">مشاهده در Booking</a>`
    : '';
  $('hotelPhotosModal').classList.add('on');
}
function closeHotelPhotos() {
  $('hotelPhotosModal')?.classList.remove('on');
}
function selectTourDateChip(el, date) {
  document.querySelectorAll('.date-chip').forEach(x => {
    x.classList.remove('selected', 'active');
    x.setAttribute('aria-selected', 'false');
  });
  el.classList.add('selected', 'active');
  el.setAttribute('aria-selected', 'true');
}

function hotelGroupsHtml(t) {
  const entries = visibleHotelEntries(t);
  if (!entries.length) return '<div class="card pad">هتلی برای این تور ثبت نشده است.</div>';
  return `<h3>انتخاب هتل</h3>${[3, 4, 5]
    .map(star => {
      const group = entries.filter(x => Number(x.h.star) === star);
      if (!group.length) return '';
      return `<div class="hotel-star-group"><div class="hotel-star-title"><b>${hotelStars(star)}</b><small>${faNum(group.length)} هتل</small></div><div class="stack">${group.map(({ h, i }) => `<div class="hotel ${i === selectedHotel ? 'selected' : ''} ${h.capacity <= 0 ? 'disabled' : ''}" onclick="${h.capacity > 0 ? `selectedHotel=${i};renderDetail(findTour(${t.id}))` : ''}">${isHotelSoldOut(h) ? '<span class="soldout-stamp small-stamp">تکمیل</span>' : ''}<div class="row"><span class="row" style="gap:6px;justify-content:flex-start"><b dir="ltr">${h.name}</b><button type="button" class="booking-hotel-action" onclick="event.stopPropagation();showHotelPhotos(${t.id},${i})">Booking</button></span><span>${hotelRoomPriceHtml(h)}</span></div><small>${h.capacity > 0 ? faNum(h.capacity) + ' ظرفیت' : 'تکمیل ظرفیت'}</small></div>`).join('')}</div></div>`;
    })
    .join('')}`;
}
function selectBookingDate(date, tourId) {
  booking.date = date;
  document.querySelectorAll('.date-chip').forEach(el => {
    const on = el.dataset.date === date;
    el.classList.toggle('selected', on);
    el.classList.toggle('active', on);
    el.setAttribute('aria-selected', on ? 'true' : 'false');
  });
  if (tourId) renderBooking(findTour(tourId));
}
function bookingHotelList(t) {
  return `<div class="stack">${visibleHotelEntries(t)
    .map(
      ({ h, i }) =>
        `<div class="hotel ${i === booking.hotel ? 'selected' : ''} ${h.capacity <= 0 ? 'disabled' : ''}" onclick="${h.capacity > 0 ? `booking.hotel=${i};renderBooking(findTour(${t.id}))` : ''}">${isHotelSoldOut(h) ? '<span class="soldout-stamp small-stamp">تکمیل</span>' : ''}<div class="row"><span class="row" style="gap:6px;justify-content:flex-start"><b dir="ltr">${h.name} ${hotelStars(h.star)}</b><button type="button" class="booking-hotel-action" onclick="event.stopPropagation();showHotelPhotos(${t.id},${i})">Booking</button></span><span>${hotelRoomPriceHtml(h)}</span></div><small>${h.capacity > 0 ? faNum(h.capacity) + ' ظرفیت' : 'تکمیل ظرفیت'}</small></div>`
    )
    .join('')}</div>`;
}

function buyerRouteState(v, id) {
  return { safarroBuyer: true, view: v || 'home', id: id || null };
}
function buyerRouteUrl(v, id) {
  const base = window.location.pathname + window.location.search;
  if (v === 'country') return base + '#country-' + encodeURIComponent(id || '');
  if (v === 'detail') return base + '#tour-' + encodeURIComponent(id || '');
  if (v === 'booking') return base + '#booking-' + encodeURIComponent(id || '');
  if (v === 'wish') return base + '#wish';
  if (v === 'mine') return base + '#mine';
  return base + '#home';
}
function parseBuyerRouteFromHash() {
  const raw = decodeURIComponent((window.location.hash || '').replace(/^#/, ''));
  if (raw.startsWith('country-')) return buyerRouteState('country', raw.slice(8));
  if (raw.startsWith('tour-')) return buyerRouteState('detail', raw.slice(5));
  if (raw.startsWith('booking-')) return buyerRouteState('booking', raw.slice(8));
  if (raw === 'wish') return buyerRouteState('wish');
  if (raw === 'mine') return buyerRouteState('mine');
  return buyerRouteState('home');
}
function sameBuyerHistory(v, id) {
  const s = history.state;
  return !!(
    s &&
    s.safarroBuyer &&
    s.view === (v || 'home') &&
    String(s.id || '') === String(id || '')
  );
}
function syncBuyerHistory(v, id, replace = false) {
  const state = buyerRouteState(v, id);
  const url = buyerRouteUrl(v, id);
  if (replace || !history.state || !history.state.safarroBuyer)
    history.replaceState(state, '', url);
  else if (!sameBuyerHistory(v, id)) history.pushState(state, '', url);
}
function initBuyer() {
  mount('buyer');
  const first = parseBuyerRouteFromHash();
  syncBuyerHistory(first.view, first.id, true);
  route(first.view, first.id, { skipHistory: true });
  window.addEventListener('popstate', e => {
    const state = e.state && e.state.safarroBuyer ? e.state : parseBuyerRouteFromHash();
    route(state.view, state.id, { skipHistory: true, fromPop: true });
  });
}
function route(v, id, opts = {}) {
  view = v;
  if (!opts.skipHistory) syncBuyerHistory(v, id);
  if (v === 'country') {
    selectedCountry = id || '';
    currentCountry = selectedCountry || 'all';
  } else if (v !== 'home') {
    selectedCountry = selectedCountry || '';
  }
  if (v === 'home') {
    selectedCountry = '';
    currentCountry = 'all';
  }
  if (v === 'detail') {
    selectedTour = id;
    addCustomerTrail(findTour(id));
  }
  if (v === 'booking') {
    booking.tourId = id;
    booking.step = 1;
    const t = findTour(id);
    const entries = visibleHotelEntries(t || {});
    booking.hotel = entries.some(e => e.i === selectedHotel) ? selectedHotel : entries[0]?.i || 0;
    booking.date = t?.dates?.[0] || null;
  }
  renderBuyer();
  window.scrollTo({ top: 0, left: 0, behavior: 'auto' });
}
function renderBuyer() {
  if (view === 'home') return renderHome();
  if (view === 'country') return renderCountryPage(selectedCountry);
  if (view === 'detail') return renderDetail(findTour(selectedTour));
  if (view === 'booking') return renderBooking(findTour(booking.tourId));
  if (view === 'wish') return renderWish();
  if (view === 'mine') return renderMine();
}
function scrollToBuyerVisa() {
  if (view !== 'home') route('home');
  setTimeout(() => {
    const target = $('buyerVisaSection');
    if (target) target.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }, 80);
}
function buyerTabs() {
  return `<div class="catbar buyer-main-tabs"><button onclick="route('home')" class="${view === 'home' || view === 'country' ? 'active' : ''}">خانه مشتری</button><button onclick="scrollToBuyerVisa()" class="buyer-visa-tab"><i class="fa-solid fa-passport"></i> خدمات ویزا را راحت ببین</button><button onclick="route('wish')" class="${view === 'wish' ? 'active' : ''}">علاقه‌مندی‌ها</button><button onclick="route('mine')" class="${view === 'mine' ? 'active' : ''}">رزروهای من</button></div>`;
}

function sendLeadToWhatsApp(lead) {
  return;
}

function buildLeadFromForm(prefix) {
  return {
    id: 'LEAD-' + Date.now().toString().slice(-6),
    name: $(prefix + 'Name')?.value?.trim() || '',
    phone: $(prefix + 'Phone')?.value?.trim() || '',
    dest: $(prefix + 'Dest')?.value?.trim() || '',
    people: $(prefix + 'People')?.value || '',
    note: $(prefix + 'Note')?.value?.trim() || '',
    source:
      prefix === 'popupLead' ? 'پاپ‌آپ مشاوره رایگان بعد از ۳۵ ثانیه' : 'تور خودتو بساز / صفحه اول',
    status: 'جدید',
    siteSeconds: siteSeconds(),
    tourViews: siteTourViews(),
    engagementPercent: engagementPercent(siteSeconds(), siteTourViews()),
    viewedTours: customerTrail(),
    viewedToursText: trailSummary(),
    createdAt: new Date().toISOString(),
  };
}

function saveLeadAndNotify(lead, statusId) {
  if (!lead.phone || lead.phone.length < 8) {
    alert('لطفاً شماره تماس معتبر وارد کنید');
    return false;
  }
  const list = leads();
  list.unshift(lead);
  saveLeads(list);
  localStorage.setItem('safarro_popup_done', '1');

  const box = $(statusId);
  if (box) {
    box.textContent = 'درخواست شما ثبت شد.';
    box.classList.add('on');
  }

  sendLeadToWhatsApp(lead);
  showToast('درخواست مشاوره ثبت شد');
  return true;
}

function submitConsultation(e) {
  e.preventDefault();
  const lead = buildLeadFromForm('lead');
  if (saveLeadAndNotify(lead, 'leadStatus')) {
    e.target.reset();
    setTimeout(closeCustomTourPopup, 1200);
  }
}

function openCustomTourPopup() {
  const p = $('customTourPopup');
  if (p) p.classList.add('on');
}

function closeCustomTourPopup() {
  const p = $('customTourPopup');
  if (p) p.classList.remove('on');
}

function submitPopupConsultation(e) {
  e.preventDefault();
  const lead = buildLeadFromForm('popupLead');
  if (saveLeadAndNotify(lead, 'popupLeadStatus')) {
    e.target.reset();
    setTimeout(closeConsultPopup, 1200);
  }
}

function closeConsultPopup() {
  const p = $('consultPopup');
  if (p) p.classList.remove('on');
  sessionStorage.setItem('safarro_popup_closed', '1');
}

function scheduleOneMinuteConsultPopup() {
  if (sessionStorage.getItem('safarro_minute_popup_scheduled') === '1') return;
  sessionStorage.setItem('safarro_minute_popup_scheduled', '1');
  setTimeout(() => {
    if (localStorage.getItem('safarro_popup_done') === '1') return;
    if (sessionStorage.getItem('safarro_popup_closed') === '1') return;
    if (!$('consultPopup')) return;
    openConsultPopup();
  }, 35000);
}

function openConsultPopup() {
  if (localStorage.getItem('safarro_popup_done') === '1') return;
  const p = $('consultPopup');
  if (p) p.classList.add('on');
}

function countTourViewAndMaybePopup() {
  const n = Number(localStorage.getItem('safarro_tour_views') || 0) + 1;
  localStorage.setItem('safarro_tour_views', String(n));
  if (
    n >= 2 &&
    localStorage.getItem('safarro_popup_done') !== '1' &&
    sessionStorage.getItem('safarro_popup_closed') !== '1'
  ) {
    setTimeout(openConsultPopup, 900);
  }
}

function consultationSection() {
  return ``;
}

function trustSection() {
  return '';
}

const DESTINATION_COUNTRY_MAP = {
  استانبول: 'ترکیه',
  آنتالیا: 'ترکیه',
  کاپادوکیا: 'ترکیه',
  کوش‌آداسی: 'ترکیه',
  'کوش آداسی': 'ترکیه',
  بدروم: 'ترکیه',
  مارماریس: 'ترکیه',
  دبی: 'امارات',
  ابوظبی: 'امارات',
  شارجه: 'امارات',
  کیش: 'ایران',
  مشهد: 'ایران',
  شیراز: 'ایران',
  اصفهان: 'ایران',
  تهران: 'ایران',
  پاریس: 'فرانسه',
  نیس: 'فرانسه',
  رم: 'ایتالیا',
  میلان: 'ایتالیا',
  ونیز: 'ایتالیا',
  بانکوک: 'تایلند',
  پوکت: 'تایلند',
  پاتایا: 'تایلند',
  ایروان: 'ارمنستان',
  تفلیس: 'گرجستان',
  باتومی: 'گرجستان',
  'تفلیس+باتومی': 'گرجستان',
  'تفلیس و باتومی': 'گرجستان',
  کوالالامپور: 'مالزی',
  لنکاوی: 'مالزی',
  مالزی: 'مالزی',
  بالی: 'اندونزی',
  ویتنام: 'ویتنام',
  تونس: 'تونس',
  روسیه: 'روسیه',
  مسکو: 'روسیه',
  'سنت پترزبورگ': 'روسیه',
  'مسکو و سن پترزبورگ': 'روسیه',
  برزیل: 'برزیل',
  آمازون: 'برزیل',
  چین: 'چین',
  ژاپن: 'ژاپن',
  'کره جنوبی': 'کره جنوبی',
  هند: 'هند',
  سریلانکا: 'سریلانکا',
  'آفریقای جنوبی': 'آفریقای جنوبی',
  کنیا: 'کنیا',
  باکو: 'آذربایجان',
  دوحه: 'قطر',
  مسقط: 'عمان',
  اسپانیا: 'اسپانیا',
  یونان: 'یونان',
  اروپا: 'اروپا',
};
const COUNTRY_LINE_ART = {
  ترکیه: '../assets/images/line-country-turkey.svg',
  ایران: '../assets/images/line-country-iran.svg',
  امارات: '../assets/images/line-country-uae.svg',
  فرانسه: '../assets/images/line-country-france.svg',
  ایتالیا: '../assets/images/line-country-italy.svg',
  تایلند: '../assets/images/line-country-thailand.svg',
  ارمنستان: '../assets/images/line-country-armenia.svg',
  گرجستان: '../assets/images/line-country-georgia.svg',
  مالزی: '../assets/images/line-country-malaysia.svg',
};
function tourDestName(t) {
  return String(t?.dest || t?.destination || t?.city || '').trim();
}
function countryFromDestination(dest) {
  const clean = String(dest || '').trim();
  return DESTINATION_COUNTRY_MAP[clean] || clean || 'سایر کشورها';
}
function countryLineArtImg(country) {
  return COUNTRY_LINE_ART[country] || '../assets/images/line-country-default.svg';
}
function countryLineArtData() {
  const grouped = {};
  buyerTours()
    .filter(t => t.status === 'active')
    .forEach(t => {
      const destName = tourDestName(t);
      const country = countryFromDestination(destName);
      if (!grouped[country])
        grouped[country] = { country, tours: 0, dests: new Set(), img: countryLineArtImg(country) };
      grouped[country].tours++;
      if (destName) grouped[country].dests.add(destName);
    });
  return Object.values(grouped)
    .map(x => ({ ...x, dests: [...x.dests] }))
    .sort((a, b) => b.tours - a.tours || String(a.country).localeCompare(String(b.country), 'fa'));
}
function countryLineArtSection() {
  const items = countryLineArtData();
  if (!items.length) return '';
  return `<section class="country-line-section">
    <div class="country-line-head">
      <div>
        <span class="badge international">مقصدهای سفرو</span>
        <h2>کشورهایی که تور داریم</h2>
        <p class="small">کشور موردنظرت را انتخاب کن تا تورهای همان کشور را ببینی.</p>
      </div>
      <button class="soft country-reset" onclick="selectCountryFromLineArt('all')"><i class="fa-solid fa-earth-asia"></i> همه کشورها</button>
    </div>
    <div class="country-line-grid">
      ${items
        .map(
          (
            item,
            i
          ) => `<button type="button" class="country-line-card country-card-v${i % 5} ${i === 0 ? 'country-card-wide' : ''} ${currentCountry === item.country ? 'active' : ''}" onclick="selectCountryFromLineArt('${item.country}')">
        <span class="country-art-wrap"><img src="${item.img}" alt="لاین‌آرت ${item.country}"></span>
        <span class="country-card-body">
          <b>${item.country}</b>
          <small>${faNum(item.tours)} تور فعال</small>
          <em>${item.dests.slice(0, 4).join('، ')}</em>
        </span>
      </button>`
        )
        .join('')}
    </div>
  </section>`;
}
function selectCountryFromLineArt(country) {
  if (!country || country === 'all') {
    currentCountry = 'all';
    selectedCountry = '';
    if (view !== 'home') route('home');
    else {
      filterHome();
      document.getElementById('tourGrid')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
    return;
  }
  route('country', country);
}

function toursForCountry(country) {
  return buyerTours().filter(
    t => t.status === 'active' && countryFromDestination(tourDestName(t)) === country
  );
}
function renderCountryPage(country) {
  const clean = country || 'سایر کشورها';
  const list = toursForCountry(clean);
  const data = countryLineArtData().find(x => x.country === clean);
  $('app').innerHTML =
    `${buyerTabs()}<button class="soft" onclick="route('home')"><i class="fa-solid fa-arrow-right"></i> بازگشت به کشورها</button>
  <section class="country-page-hero">
    <div class="country-page-copy"><span class="badge international">تورهای ${clean}</span><h1>${clean}</h1><p class="small">همه تورهای فعال این کشور را اینجا ببین و با انتخاب هر کارت، وارد صفحه جزئیات همان تور شو.</p><b>${faNum(list.length)} تور فعال</b></div>
    <div class="country-page-art"><img src="${data?.img || countryLineArtImg(clean)}" alt="لاین‌آرت ${clean}"></div>
  </section>
  <section class="country-page-grid grid g3">${list.map(tourCard).join('') || '<div class="card pad" style="grid-column:1/-1">فعلاً توری برای این کشور فعال نیست.</div>'}</section>
  ${hotelPhotosModalHtml()}${consultPopupHtml()}`;
}

function consultPopupHtml() {
  return `<div id="consultPopup" class="popup-backdrop">
    <div class="consult-popup">
      <button class="popup-close" onclick="closeConsultPopup()">×</button>
      <span class="badge special">مشاوره رایگان</span>
      <div class="popup-title">برای انتخاب تور کمک می‌خوای؟</div>
      <p class="popup-desc">شماره‌ات را وارد کن تا کارشناس سفرو با تو تماس بگیرد.</p>
      <form onsubmit="submitPopupConsultation(event)"><div class="form-note-required">شماره تماس الزامی است <span class="req-star">*</span></div>
        <div class="grid g2">
          <input id="popupLeadName" class="field" placeholder="نام شما">
          <input id="popupLeadPhone" class="field" placeholder="شماره تماس *" required dir="ltr">
          <input id="popupLeadDest" class="field" placeholder="مقصد موردنظر">
        </div>
        <button class="btn" style="width:100%;margin-top:12px" type="submit"><i class="fa-brands fa-whatsapp"></i> ثبت درخواست مشاوره</button>
        <div id="popupLeadStatus" class="lead-status"></div>
      </form>
    </div>
  </div>`;
}

function aboutContactSection() {
  return `<section class="about-contact-section">
    <div class="about-contact-grid">
      <div class="about-box">
        <span class="badge special">درباره سفرو ایرانیان</span>
        <h2>همراه مطمئن سفرهای داخلی و خارجی</h2>
        <p>سفرو ایرانیان با تمرکز روی تورهای داخلی و خارجی، تلاش می‌کند انتخاب سفر را ساده‌تر، شفاف‌تر و مطمئن‌تر کند. از مشاوره و انتخاب مقصد تا رزرو تور، هتل و پیگیری سفر، تیم سفرو کنار مسافر می‌ماند.</p>
        <div class="about-points">
          <div class="about-point"><i class="fa-solid fa-calendar-check"></i> رزروهای انعطاف‌پذیر</div>
          <div class="about-point"><i class="fa-solid fa-headset"></i> پشتیبانی ۲۴/۷</div>
          <div class="about-point"><i class="fa-solid fa-tags"></i> نرخ‌های رقابتی</div>
          <div class="about-point"><i class="fa-solid fa-shuttle-van"></i> خدمات کامل سفر</div>
        </div>
      </div>
      <div class="contact-box">
        <span class="badge domestic">ارتباط با ما</span>
        <h2>سفرو ایرانیان</h2>
        <div class="contact-list">
          <div class="contact-row"><i class="fa-solid fa-phone"></i><div><b>تلفن تماس</b><a href="tel:02149976" dir="ltr">۰۲۱-۴۹۹۷۶</a></div></div>
          <div class="contact-row"><i class="fa-solid fa-envelope"></i><div><b>ایمیل</b><a href="mailto:info@safaroiranian.com" dir="ltr">info@safaroiranian.com</a></div></div>
          <div class="contact-row"><i class="fa-solid fa-location-dot"></i><div><b>آدرس</b><span>تهران، بلوار فردوس شرق، بعد از عقیل، پلاک ۳۵۱، طبقه ۱</span></div></div>
          <div class="contact-row"><i class="fa-solid fa-globe"></i><div><b>وب‌سایت رسمی</b><a href="https://safaroiranian.com/" target="_blank">safaroiranian.com</a></div></div>
        </div>
        <div class="contact-actions">
          <a class="btn" href="tel:02149976"><i class="fa-solid fa-phone-volume"></i> تماس فوری</a>
          <a class="soft" href="https://safaroiranian.com/about-us/" target="_blank">درباره ما</a>
        </div>
      </div>
    </div>
  </section>`;
}

function referenceHeroSection() {
  const activeTours = buyerTours().filter(t => t.status === 'active');
  const activeCount = activeTours.length;
  const countriesCount = countryLineArtData().length;
  const specialCount = activeTours.filter(t => t.lastMinute || t.specialOffer).length;
  const firstDest = activeTours[0] ? tourDestName(activeTours[0]) : 'استانبول';
  return `<section class="hero-v49 hero-figma-fusion">
    <div class="hero-fusion-bg" aria-hidden="true"></div>
    <div class="hero-v49-copy hero-fusion-copy">
      <span class="hero-copy-kicker hero-fusion-kicker"><i class="fa-solid fa-plane-departure"></i> تجربه رزرو تور به سبک سفرو</span>
      <h1 class="buyer-hero-title">سفر رویاهایت را با <span>سفرو</span> حرفه‌ای‌تر رزرو کن</h1>
      <p class="buyer-hero-subtitle">تورهای داخلی و خارجی، خدمات ویزا، انتخاب هتل و ظرفیت واقعی را در یک صفحه تمیز ببین و سریع وارد رزرو شو.</p>
      <form class="hero-search-panel hero-search-figma" onsubmit="applyHeroSearch(event)">
        <div class="hero-search-field hero-search-wide">
          <label><i class="fa-solid fa-magnifying-glass"></i> جستجوی سریع</label>
          <input id="heroSearchQuery" class="field" placeholder="مثلاً ${firstDest}، دبی، آنتالیا یا تور لوکس">
        </div>
        <div class="hero-search-field">
          <label><i class="fa-solid fa-location-dot"></i> مقصد</label>
          <select id="heroSearchDest" class="field">${homeSearchDestOptions()}</select>
        </div>
        <div class="hero-search-field">
          <label><i class="fa-solid fa-user-group"></i> تعداد نفرات</label>
          <select id="heroSearchPeople" class="field">
            <option>۲ نفر</option><option>۱ نفر</option><option>۳ نفر</option><option>۴ نفر یا بیشتر</option>
          </select>
        </div>
        <button class="btn hero-search-btn" type="submit"><i class="fa-solid fa-magnifying-glass"></i> پیدا کن</button>
      </form>
      <div class="hero-stats-v49 hero-fusion-stats">
        <span><b>${faNum(activeCount)}</b> تور فعال</span>
        <span><b>${faNum(countriesCount)}</b> کشور</span>
        <span><b>${faNum(specialCount)}</b> تور ویژه</span>
        <span><b>۲۴/۷</b> همراه سفر</span>
      </div>
    </div>
    <div class="hero-v49-art hero-fusion-art" aria-hidden="true">
      <div class="hero-fusion-card hero-fusion-card-main">
        <img src="../assets/images/world-landmarks-v45-art.svg" alt="">
      </div>
      <div class="hero-mini-card hero-mini-card-1"><i class="fa-solid fa-shield-heart"></i><b>رزرو مطمئن</b><small>پیگیری تا زمان سفر</small></div>
      <div class="hero-mini-card hero-mini-card-2"><i class="fa-solid fa-hotel"></i><b>هتل دلخواه</b><small>۳، ۴ یا ۵ ستاره</small></div>
      <div class="hero-mini-card hero-mini-card-3"><i class="fa-solid fa-passport"></i><b>خدمات ویزا</b><small>کنار تورها</small></div>
    </div>
  </section>`;
}

function customTourSection() {
  return `<section class="custom-tour-section" id="customTourSection">
    <div class="custom-tour-copy">
      <span class="badge special">تور اختصاصی سفرو</span>
      <h2>تور خودتو بساز</h2>
      <p class="small">اگر تاریخ، بودجه یا هتل خاصی مدنظرت هست، درخواستت را ثبت کن تا کارشناس سفرو با پیشنهاد مناسب تماس بگیرد.</p>
      <div class="custom-tour-points">
        <span><i class="fa-solid fa-hotel"></i> انتخاب هتل دلخواه</span>
        <span><i class="fa-solid fa-calendar-days"></i> تاریخ منعطف</span>
        <span><i class="fa-solid fa-headset"></i> مشاوره رایگان</span>
      </div>
    </div>
    <form class="hero-custom-tour-card custom-tour-form-v49" onsubmit="submitConsultation(event)">
      <div class="form-note-required">موارد ستاره‌دار الزامی هستند <span class="req-star">*</span></div>
      <div class="grid g2">
        <input id="leadName" class="field" placeholder="نام شما">
        <input id="leadPhone" class="field" placeholder="شماره تماس *" required dir="ltr">
        <input id="leadDest" class="field" placeholder="مقصد دلخواه">
        <select id="leadPeople" class="field">
          <option value="">تعداد نفرات</option>
          <option>۱ نفر</option><option>۲ نفر</option><option>۳ نفر</option><option>۴ نفر یا بیشتر</option>
        </select>
      </div>
      <textarea id="leadNote" class="field" rows="3" style="margin-top:10px" placeholder="مثلاً: استانبول، هتل ۵ ستاره، بودجه ۳۰ میلیون، آخر هفته"></textarea>
      <button class="gold" style="width:100%;margin-top:12px" type="submit"><i class="fa-solid fa-wand-magic-sparkles"></i> ساخت تور اختصاصی</button>
      <div id="leadStatus" class="lead-status"></div>
    </form>
  </section>`;
}


function customTourLauncher() {
  return `<section class="custom-tour-top-shell" aria-label="تور اختصاصی سفرو">
    <button class="custom-tour-top-card" onclick="openCustomTourPopup()" type="button">
      <span class="custom-tour-top-icon"><i class="fa-solid fa-wand-magic-sparkles"></i></span>
      <span class="custom-tour-top-copy"><b>تور خودتو بساز</b><small>هتل، تاریخ و بودجه دلخواهت را ثبت کن</small></span>
      <span class="custom-tour-top-action">شروع <i class="fa-solid fa-arrow-left"></i></span>
    </button>
  </section>`;
}

function customTourPopupHtml() {
  return `<div id="customTourPopup" class="custom-tour-popup-backdrop" onclick="if(event.target===this)closeCustomTourPopup()">
    <form class="custom-tour-popup-card" onsubmit="submitConsultation(event)">
      <button class="popup-close custom-tour-popup-close" type="button" onclick="closeCustomTourPopup()">×</button>
      <div class="custom-tour-popup-hero">
        <span class="badge special">تور اختصاصی سفرو</span>
        <h2>تور خودتو بساز</h2>
        <p>مقصد، تاریخ، بودجه و سبک سفرت را بنویس؛ کارشناس سفرو با پیشنهاد مناسب با تو تماس می‌گیرد.</p>
      </div>
      <div class="custom-tour-popup-points">
        <span><i class="fa-solid fa-hotel"></i> انتخاب هتل دلخواه</span>
        <span><i class="fa-solid fa-calendar-days"></i> تاریخ منعطف</span>
        <span><i class="fa-solid fa-headset"></i> مشاوره رایگان</span>
      </div>
      <div class="form-note-required">شماره تماس الزامی است <span class="req-star">*</span></div>
      <div class="custom-tour-popup-fields">
        <input id="leadName" class="field" placeholder="نام شما">
        <input id="leadPhone" class="field" placeholder="شماره تماس *" required dir="ltr">
        <input id="leadDest" class="field" placeholder="مقصد دلخواه">
        <select id="leadPeople" class="field">
          <option value="">تعداد نفرات</option>
          <option>۱ نفر</option><option>۲ نفر</option><option>۳ نفر</option><option>۴ نفر یا بیشتر</option>
        </select>
      </div>
      <textarea id="leadNote" class="field" rows="3" placeholder="مثلاً: دبی، ۴ شب، هتل ۵ ستاره، بودجه حدود ۵۰ میلیون"></textarea>
      <button class="gold custom-tour-submit" type="submit"><i class="fa-solid fa-paper-plane"></i> ثبت درخواست تور اختصاصی</button>
      <div id="leadStatus" class="lead-status"></div>
    </form>
  </div>`;
}

function specialToursSection(list) {
  const specials = list.filter(t => t.lastMinute).slice(0, 3);
  if (!specials.length) return '';
  return `<section class="special-tours-section special-tours-v49">
    <div class="section-title-v49">
      <div><span class="badge special">پیشنهاد سفرو</span><h2>تور ویژه</h2><p class="small">تورهای منتخب با پیشنهاد جذاب و ظرفیت محدود.</p></div>
      <button class="soft" onclick="currentCat='special';filterHome();document.getElementById('tourGrid')?.scrollIntoView({behavior:'smooth',block:'start'})">مشاهده همه ویژه‌ها</button>
    </div>
    <div class="grid g3">${specials.map(lastCard).join('')}</div>
  </section>`;
}

function filtersSection(list) {
  // فیلترهای قدیمی از UI حذف شده‌اند؛ این کنترل‌های پنهان فقط برای جستجوی سریع هیرو،
  // لینک کشورها، دسته‌بندی‌ها و بازنشانی خودکار نگه داشته شده‌اند.
  return `<section class="filters-shell-v49 hidden-home-filters" aria-hidden="true">
    <input id="search" value="">
    <select id="dest">${homeSearchDestOptions()}</select>
    <select id="sort"><option value="default">پیش‌فرض</option><option value="asc">ارزان‌ترین</option><option value="desc">گران‌ترین</option><option value="rate">بالاترین امتیاز</option></select>
    <input id="airline" value="">
    <select id="star"><option value="all">همه</option><option value="3">۳ ستاره</option><option value="4">۴ ستاره</option><option value="5">۵ ستاره</option></select>
    <input id="onlyCap" type="checkbox">
    <div id="autoResetStatus" class="auto-reset-status" aria-live="polite"></div>
  </section>`;
}

function categoryBarHtml() {
  return `<section class="catbar catbar-v49">${[
    'all:همه',
    'domestic:داخلی',
    'international:خارجی',
    'luxury:لوکس',
    'economy:اقتصادی',
    'special:تور ویژه',
  ]
    .map(x => {
      const [a, b] = x.split(':');
      return `<button data-cat="${a}" onclick="currentCat='${a}';filterHome()" class="${a === currentCat ? 'active' : ''}">${b}</button>`;
    })
    .join('')}</section>`;
}

function uiFaqSection() {
  return `<section class="faq-section-v49 card pad">
    <div class="section-title-v49"><div><span class="badge domestic">سوالات پرتکرار</span><h2>قبل از رزرو بهتر بدونی</h2></div></div>
    <div class="faq-grid-v49">
      <div><b>قیمت‌ها قطعی هستند؟</b><p class="small">قیمت پایه و هتل‌ها نمایش داده می‌شود؛ برای نهایی‌سازی، کارشناس سفرو رزرو را تأیید می‌کند.</p></div>
      <div><b>می‌توانم هتل را عوض کنم؟</b><p class="small">بله، در جزئیات هر تور هتل‌های قابل انتخاب و ظرفیتشان را می‌بینی.</p></div>
      <div><b>برای ویزا هم کمک می‌کنید؟</b><p class="small">بله، بخش خدمات ویزا در صفحه مشتری قابل مشاهده است.</p></div>
    </div>
  </section>`;
}

function countryLineArtSection() {
  const items = countryLineArtData();
  if (!items.length) return '';
  return `<section class="country-line-section country-line-section-v49">
    <div class="country-line-head section-title-v49">
      <div>
        <span class="badge international">مقصدهای سفرو</span>
        <h2>کشورهایی که تور داریم</h2>
        <p class="small">هر کشور صفحه خودش را دارد؛ وارد شو و تورهای همان کشور را ببین.</p>
      </div>
      <button class="soft country-reset" onclick="selectCountryFromLineArt('all')"><i class="fa-solid fa-earth-asia"></i> همه تورها</button>
    </div>
    <div class="country-line-grid">
      ${items
        .map(
          (item, i) => `<button type="button" class="country-line-card country-card-v${i % 5} ${i === 0 ? 'country-card-wide' : ''} ${currentCountry === item.country ? 'active' : ''}" onclick="selectCountryFromLineArt('${item.country}')">
        <span class="country-art-wrap"><img src="${item.img}" alt="لاین‌آرت ${item.country}"></span>
        <span class="country-card-body">
          <b>${item.country}</b>
          <small>${faNum(item.tours)} تور فعال</small>
          <em>${item.dests.slice(0, 4).join('، ')}</em>
          <strong>مشاهده تورها <i class="fa-solid fa-arrow-left"></i></strong>
        </span>
      </button>`
        )
        .join('')}
    </div>
  </section>`;
}

function renderHome() {
  const list = buyerTours().filter(t => t.status === 'active');
  $('app').innerHTML = `${buyerTabs()}
    ${customTourLauncher()}
    ${referenceHeroSection()}
    ${countryLineArtSection()}
    ${specialToursSection(list)}
    ${customTourPopupHtml()}${consultPopupHtml()}${hotelPhotosModalHtml()}
    ${filtersSection(list)}
    ${categoryBarHtml()}
    <div class="tour-list-head-v49 row"><div><h2>تورها</h2><p class="small">روی هر کارت بزن تا وارد جزئیات و رزرو همان تور شوی.</p></div><div class="row"><b id="tourCount">۰</b><button class="soft" onclick="resetDemoData()">بازیابی تورهای نمونه</button></div></div>
    <section id="tourGrid" class="grid g3 tour-grid-v49"></section>
    ${visaSection()}
    ${uiFaqSection()}
    ${aboutContactSection()}
    <div id="compareDock" class="dock"><b><i class="fa-solid fa-code-compare"></i> <span id="compareCount">۰</span> تور برای مقایسه</b><div class="actions"><button class="soft" onclick="openCompare()">مقایسه</button><button class="danger" onclick="clearCompare()">پاک کردن</button></div></div>
    <div id="compareModal" class="modal" onclick="if(event.target===this)closeCompare()"><div class="modal-card pad"><div class="row"><h2>مقایسه تورها</h2><button class="soft" onclick="closeCompare()">بستن</button></div><div id="compareContent" class="table-wrap"></div></div></div>`;
  filterHome();
  scheduleOneMinuteConsultPopup();
}

function tourCard(t) {
  const w = wishlist().includes(t.id);
  const startPrice = Number(t.newPrice || 0) > 0 ? Number(t.newPrice) : Number(minHotel(t).price || 0);
  const hotelCount = visibleHotelEntries(t).length || (t.hotels || []).length;
  const cap = totalCapacity(t);
  return `<article class="card clickable-tour-card tour-card-v49" onclick="cardClickDetail(event,${t.id})">
    <div class="tour-image-wrap-v49">
      <img class="tour-img" src="${t.img || DEFAULT_IMG}" alt="${t.title || ''}">
      ${t.lastMinute ? '<span class="flash-badge">لحظه آخری</span>' : ''}
      <button class="wish-float-v49" onclick="event.stopPropagation();toggleWish(${t.id})" aria-label="علاقه‌مندی"><i class="${w ? 'fa-solid' : 'fa-regular'} fa-heart" style="${w ? 'color:#ef4444' : ''}"></i></button>
    </div>
    <div class="pad tour-card-body-v49">
      <div class="badges">${badges(t)} ${buyerTourLabel(t) ? `<span class="badge special">${buyerTourLabel(t)}</span>` : ''}</div>
      <h3 class="tour-title">${t.title}</h3>
      <div class="tour-meta-grid-v49">
        <span><i class="fa-solid fa-location-dot"></i>${tourDestName(t)}</span>
        <span><i class="fa-solid fa-clock"></i>${normalizeDurationNightFirst(t.duration)}</span>
        <span><i class="fa-solid fa-star"></i>${faNum(t.rating || '۴.۸')}</span>
        <span><i class="fa-solid fa-hotel"></i>${faNum(hotelCount)} هتل</span>
      </div>
      <div class="tour-card-footer-v49">
        <div><small>شروع قیمت از</small><b class="price">${money(startPrice)}</b><em>${cap > 0 ? faNum(cap) + ' ظرفیت باقی‌مانده' : 'تکمیل ظرفیت'}</em></div>
        <button class="btn" onclick="event.stopPropagation();route('detail',${t.id})">مشاهده و رزرو</button>
      </div>
      <button class="compare-btn ${compare.has(t.id) ? 'active' : ''}" onclick="event.stopPropagation();toggleCompare(${t.id})">${compare.has(t.id) ? 'در مقایسه' : 'افزودن به مقایسه'}</button>
    </div>
  </article>`;
}

function renderDetail(t) {
  if (!t) return;
  countTourViewAndMaybePopup();
  const entries = visibleHotelEntries(t);
  if (!entries.some(e => e.i === selectedHotel)) selectedHotel = entries[0]?.i || 0;
  const selected = t.hotels[selectedHotel] || entries[0]?.h || minHotel(t);
  const displayPrice = Number(t.newPrice || 0) > 0 ? Number(t.newPrice) : Number(selected.price || 0);
  const detailGallery = sectionOn(t, 'gallery')
    ? `<div class="gallery gallery-v49">${[t.img, ...(t.gallery || [])]
        .filter(Boolean)
        .slice(0, 5)
        .map(x => `<img src="${x}" onclick="lightbox('${x}')">`)
        .join('')}</div>`
    : '';
  const descHtml = sectionOn(t, 'description') ? `<p class="small detail-desc-v49">${t.desc || ''}</p>` : '';
  const flightHtml = sectionOn(t, 'flightInfo')
    ? `<div class="info-grid detail-info-v49">${info('مقصد', tourDestName(t))}${info('مدت', normalizeDurationNightFirst(t.duration))}${info('ایرلاین رفت', t.airline)}${info('ایرلاین برگشت', t.returnAirline || t.airline)}${info('زمان پرواز رفت', t.flightTime)}${info('زمان پرواز برگشت', t.returnFlightTime || t.landingTime)}</div>`
    : '';
  const datesHtml = sectionOn(t, 'dates') ? dateOnly(t) : '';
  const hotelsHtml = sectionOn(t, 'hotels') ? hotelGroupsHtml(t) : '';
  const itineraryHtml = sectionOn(t, 'itinerary')
    ? `<div class="info"><small>برنامه سفر</small>${(t.itinerary || []).map(x => `<p class="small">• ${x}</p>`).join('')}</div>`
    : '';
  const docsHtml = sectionOn(t, 'docs')
    ? `<div class="info"><small>مدارک لازم</small>${(t.docs || []).map(x => `<p class="small">• ${x}</p>`).join('')}</div>`
    : '';
  const includesHtml = sectionOn(t, 'includes')
    ? `<div class="info"><small>خدمات شامل</small>${(t.includes || []).map(x => `<p class="small">✓ ${x}</p>`).join('')}</div>`
    : '';
  const excludesHtml = sectionOn(t, 'excludes')
    ? `<div class="info"><small>خدمات غیرشامل</small>${(t.excludes || []).map(x => `<p class="small">× ${x}</p>`).join('')}</div>`
    : '';
  const blocks = [itineraryHtml, docsHtml, includesHtml, excludesHtml].filter(Boolean).join('');
  const blocksHtml = blocks ? `<div class="g2 grid detail-block-grid-v49">${blocks}</div>` : '';
  const policyBits = [];
  if (sectionOn(t, 'cancellation')) policyBits.push(`<p class="small">قوانین کنسلی: ${t.cancellation || '—'}</p>`);
  if (sectionOn(t, 'childPolicy')) policyBits.push(`<p class="small">شرایط کودک: ${t.childPolicy || '—'}</p>`);
  const policyHtml = policyBits.length ? `<div class="info detail-policy-v49"><small>قوانین و شرایط</small>${policyBits.join('')}</div>` : '';
  const reviewsHtml =
    sectionOn(t, 'reviews') && (t.reviews || []).length
      ? `<h3>نظر مسافران</h3><div class="g2 grid">${(t.reviews || []).map(r => `<div class="info"><div class="row"><b>${r.name}</b><span style="color:#f59e0b">${'★'.repeat(r.rate || 5)}</span></div><p class="small">${r.text}</p></div>`).join('')}</div>`
      : '';
  $('app').innerHTML = `${buyerTabs()}
    <button class="soft back-btn-v49" onclick="goBack()"><i class="fa-solid fa-arrow-right"></i> بازگشت</button>
    <section class="detail-hero-v49">
      <div class="detail-hero-img-v49"><img src="${t.img || DEFAULT_IMG}" alt="${t.title || ''}"></div>
      <div class="detail-hero-copy-v49">
        <div class="badges">${badges(t)}</div>
        <h1>${t.title}</h1>
        ${descHtml}
        <div class="detail-hero-chips-v49">
          <span><i class="fa-solid fa-location-dot"></i>${tourDestName(t)}</span>
          <span><i class="fa-solid fa-clock"></i>${normalizeDurationNightFirst(t.duration)}</span>
          <span><i class="fa-solid fa-users"></i>${faNum(totalCapacity(t))} ظرفیت</span>
        </div>
      </div>
    </section>
    <section class="detail-layout-v49">
      <main class="detail-main-v49 card pad">
        ${detailGallery}
        ${flightHtml}
        ${destinationGuideDetail(t)}
        ${datesHtml}
        ${hotelsHtml}
        ${blocksHtml}
        ${policyHtml}
        ${reviewsHtml}
      </main>
      <aside class="detail-aside-v49 card pad">
        <span class="badge special">رزرو سریع</span>
        <h3>خلاصه تور</h3>
        <div class="detail-price-box-v49"><small>شروع قیمت از</small>${specialPriceLine(t, displayPrice)}</div>
        <div class="stack detail-summary-list-v49">
          <div class="row"><span>هتل انتخاب‌شده</span><b dir="ltr">${selected.name || '—'}</b></div>
          <div class="row"><span>ظرفیت</span><b>${faNum(totalCapacity(t))}</b></div>
          <div class="row"><span>ایرلاین</span><b>${t.airline || '—'}</b></div>
        </div>
        <button class="btn" style="width:100%;margin-top:14px" onclick="route('booking',${t.id})">رزرو نهایی</button>
        <button class="soft" style="width:100%;margin-top:8px" onclick="toggleWish(${t.id})"><i class="fa-regular fa-heart"></i> افزودن به علاقه‌مندی</button>
      </aside>
    </section>
    <div class="sticky-cta"><b>${money(displayPrice)}</b><button class="btn" onclick="route('booking',${t.id})">رزرو سریع</button></div>${hotelPhotosModalHtml()}${consultPopupHtml()}`;
}

function filterHome() {
  try {
    let q = $('search')?.value?.trim().toLowerCase() || '',
      d = $('dest')?.value || 'all',
      sort = $('sort')?.value || 'default',
      star = $('star')?.value || 'all',
      airline = $('airline')?.value?.trim().toLowerCase() || '',
      onlyCap = $('onlyCap')?.checked || false;
    let list = buyerTours().filter(t => {
      const categoryMatch =
        currentCat === 'all' ||
        (currentCat === 'special' && t.lastMinute) ||
        (t.categories || []).includes(currentCat) ||
        t.type === currentCat ||
        t.level === currentCat;
      return (
        t.status === 'active' &&
        categoryMatch &&
        (currentCountry === 'all' || countryFromDestination(tourDestName(t)) === currentCountry) &&
        (d === 'all' || tourDestName(t) === d) &&
        (!q ||
          String(t.title).toLowerCase().includes(q) ||
          String(tourDestName(t)).toLowerCase().includes(q) ||
          String(countryFromDestination(tourDestName(t))).toLowerCase().includes(q)) &&
        (!airline || String(t.airline).toLowerCase().includes(airline)) &&
        (star === 'all' || (t.hotels || []).some(h => Number(h.star) === Number(star))) &&
        (!onlyCap || totalCapacity(t) > 0)
      );
    });
    if (sort === 'asc') list.sort((a, b) => minHotel(a).price - minHotel(b).price);
    if (sort === 'desc') list.sort((a, b) => minHotel(b).price - minHotel(a).price);
    if (sort === 'rate') list.sort((a, b) => Number(b.rating || 0) - Number(a.rating || 0));
    if ($('tourCount')) $('tourCount').textContent = faNum(list.length);
    if ($('tourGrid'))
      $('tourGrid').innerHTML =
        list.map(tourCard).join('') ||
        '<div class="card pad" style="grid-column:1/-1">توری پیدا نشد. از پنل مدیریت/کارشناس تور فعال اضافه کنید.</div>';
    renderCompareDock();
    updateHomeAutoReset();
  } catch (e) {
    console.error('filterHome error', e);
    if ($('tourGrid'))
      $('tourGrid').innerHTML =
        '<div class="debug-error-box" style="grid-column:1/-1">خطا در نمایش تورها. داده‌ها را بازیابی کنید.</div>';
  }
}

// v5.8: make sure the buyer app actually boots on /buyer and on Vercel rewrites.
document.addEventListener('DOMContentLoaded', initBuyer);
