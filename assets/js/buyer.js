
function beautyTrustStrip(){return ``;}

let view='home',currentCat='all',compare=new Set(),selectedTour=null,selectedHotel=0,booking={step:1,tourId:null,hotel:0,date:null,passengers:2};
if(!sessionStorage.getItem('safarro_visit_start'))sessionStorage.setItem('safarro_visit_start',Date.now());
function siteSeconds(){return Math.max(0,Math.round((Date.now()-Number(sessionStorage.getItem('safarro_visit_start')||Date.now()))/1000))}
function siteTourViews(){return Number(localStorage.getItem('safarro_tour_views')||0)}
function engagementPercent(seconds,views){return Math.min(100,Math.round((Number(views)||0)*18 + Math.min(50,(Number(seconds)||0)/12)))}
function hotelStars(n){return `<span class="hotel-stars">${Array.from({length:Number(n)||0}).map(()=>'<i class="fa-solid fa-star"></i>').join('')}</span>`}
function ratingStar(){return '<span class="rating-star">★</span>'}
function defaultSections(){
  return {
    description:true,
    flightInfo:true,
    dates:true,
    hotels:true,
    gallery:true,
    itinerary:true,
    docs:true,
    includes:true,
    excludes:true,
    cancellation:true,
    childPolicy:true,
    reviews:true
  };
}
function sectionOn(t,key){
  const v = Object.assign(defaultSections(), t.sectionVisibility || {});
  return v[key] !== false;
}
function maybe(show, html){ return show ? html : ''; }

function visibleHotelEntries(t){
  const arr=(t.hotels||[]).map((h,i)=>({h,i})).filter(x=>x.h && x.h.showInBuyer!==false);
  return arr.length?arr:(t.hotels||[]).map((h,i)=>({h,i}));
}

function escapeAttr(v){return String(v||'').replace(/"/g,'&quot;')}
function hotelPhotosModalHtml(){
  return `<div id="hotelPhotosModal" class="hotel-photos-modal" onclick="if(event.target===this)closeHotelPhotos()">
    <div class="hotel-photos-box">
      <div class="row"><h3 id="hotelPhotosTitle">عکس‌های هتل</h3><button class="soft" onclick="closeHotelPhotos()">بستن</button></div>
      <div id="hotelPhotosGrid" class="hotel-photos-grid"></div>
      <div id="hotelBookingLinkBox" style="margin-top:12px"></div>
    </div>
  </div>`;
}
function showHotelPhotos(tourId,hotelIndex){
  const t=findTour(tourId);if(!t)return;
  const h=(t.hotels||[])[hotelIndex];if(!h)return;
  const photos=(h.photos||h.images||[]).filter(Boolean);
  $('hotelPhotosTitle').textContent='عکس‌های هتل '+(h.name||'');
  $('hotelPhotosGrid').innerHTML=photos.length?photos.map(src=>`<img src="${src}" alt="${h.name||''}">`).join(''):'<p class="small">برای این هتل هنوز عکسی ثبت نشده است.</p>';
  $('hotelBookingLinkBox').innerHTML=h.bookingLink?`<a class="btn" target="_blank" href="${h.bookingLink}">مشاهده در Booking</a>`:'';
  $('hotelPhotosModal').classList.add('on');
}
function closeHotelPhotos(){$('hotelPhotosModal')?.classList.remove('on')}
function selectTourDateChip(el,date){document.querySelectorAll('.date-chip').forEach(x=>{x.classList.remove('selected','active');x.setAttribute('aria-selected','false')});el.classList.add('selected','active');el.setAttribute('aria-selected','true')}

function hotelGroupsHtml(t){
  const entries=visibleHotelEntries(t);
  if(!entries.length)return '<div class="card pad">هتلی برای این تور ثبت نشده است.</div>';
  return `<h3>انتخاب هتل</h3>${[3,4,5].map(star=>{
    const group=entries.filter(x=>Number(x.h.star)===star);
    if(!group.length)return '';
    return `<div class="hotel-star-group"><div class="hotel-star-title"><b>${hotelStars(star)}</b><small>${faNum(group.length)} هتل</small></div><div class="stack">${group.map(({h,i})=>`<div class="hotel ${i===selectedHotel?'selected':''} ${h.capacity<=0?'disabled':''}" onclick="${h.capacity>0?`selectedHotel=${i};renderDetail(findTour(${t.id}))`:''}">${isHotelSoldOut(h)?'<span class="soldout-stamp small-stamp">تکمیل</span>':''}<div class="row"><span class="row" style="gap:6px;justify-content:flex-start"><b dir="ltr">${h.name}</b><button type="button" class="booking-hotel-action" onclick="event.stopPropagation();showHotelPhotos(${t.id},${i})">Booking</button></span><b>${money(h.price)}</b></div><small>${h.capacity>0?faNum(h.capacity)+' ظرفیت':'تکمیل ظرفیت'}</small></div>`).join('')}</div></div>`;
  }).join('')}`;
}
function selectBookingDate(date, tourId){
  booking.date=date;
  document.querySelectorAll('.date-chip').forEach(el=>{
    const on=el.dataset.date===date;
    el.classList.toggle('selected',on);
    el.classList.toggle('active',on);
    el.setAttribute('aria-selected',on?'true':'false');
  });
  if(tourId)renderBooking(findTour(tourId));
}
function bookingHotelList(t){
  return `<div class="stack">${visibleHotelEntries(t).map(({h,i})=>`<div class="hotel ${i===booking.hotel?'selected':''} ${h.capacity<=0?'disabled':''}" onclick="${h.capacity>0?`booking.hotel=${i};renderBooking(findTour(${t.id}))`:''}">${isHotelSoldOut(h)?'<span class="soldout-stamp small-stamp">تکمیل</span>':''}<div class="row"><span class="row" style="gap:6px;justify-content:flex-start"><b dir="ltr">${h.name} ${hotelStars(h.star)}</b><button type="button" class="booking-hotel-action" onclick="event.stopPropagation();showHotelPhotos(${t.id},${i})">Booking</button></span><b>${money(h.price)}</b></div><small>${h.capacity>0?faNum(h.capacity)+' ظرفیت':'تکمیل ظرفیت'}</small></div>`).join('')}</div>`;
}

function initBuyer(){mount('buyer');route('home')}
function route(v,id){view=v;if(v==='detail'){selectedTour=id;addCustomerTrail(findTour(id))}if(v==='booking'){booking.tourId=id;booking.step=1;const t=findTour(id);const entries=visibleHotelEntries(t||{});booking.hotel=entries.some(e=>e.i===selectedHotel)?selectedHotel:(entries[0]?.i||0);booking.date=t?.dates?.[0]||null}renderBuyer();window.scrollTo({top:0,left:0,behavior:'auto'})}
function renderBuyer(){if(view==='home')return renderHome();if(view==='detail')return renderDetail(findTour(selectedTour));if(view==='booking')return renderBooking(findTour(booking.tourId));if(view==='wish')return renderWish();if(view==='mine')return renderMine()}
function buyerTabs(){return `<div class="catbar"><button onclick="route('home')" class="${view==='home'?'active':''}">خانه مشتری</button><button onclick="route('wish')" class="${view==='wish'?'active':''}">علاقه‌مندی‌ها</button><button onclick="route('mine')" class="${view==='mine'?'active':''}">رزروهای من</button></div>`}

function sendLeadToWhatsApp(lead){ return; }

function buildLeadFromForm(prefix){
  return {
    id:'LEAD-' + Date.now().toString().slice(-6),
    name:$(prefix+'Name')?.value?.trim() || '',
    phone:$(prefix+'Phone')?.value?.trim() || '',
    dest:$(prefix+'Dest')?.value?.trim() || '',
    people:$(prefix+'People')?.value || '',
    note:$(prefix+'Note')?.value?.trim() || '',
    source:prefix==='popupLead'?'پاپ‌آپ مشاوره رایگان بعد از ۳۵ ثانیه':'تور خودتو بساز / صفحه اول',
    status:'جدید',
    siteSeconds:siteSeconds(),
    tourViews:siteTourViews(),
    engagementPercent:engagementPercent(siteSeconds(),siteTourViews()),
    viewedTours:customerTrail(),
    viewedToursText:trailSummary(),
    createdAt:new Date().toISOString()
  };
}

function saveLeadAndNotify(lead, statusId){
  if(!lead.phone || lead.phone.length < 8){
    alert('لطفاً شماره تماس معتبر وارد کنید');
    return false;
  }
  const list = leads();
  list.unshift(lead);
  saveLeads(list);
  localStorage.setItem('safarro_popup_done','1');

  const box = $(statusId);
  if(box){
    box.textContent = 'درخواست شما ثبت شد.';
    box.classList.add('on');
  }

  sendLeadToWhatsApp(lead);
  showToast('درخواست مشاوره ثبت شد');
  return true;
}

function submitConsultation(e){
  e.preventDefault();
  const lead = buildLeadFromForm('lead');
  if(saveLeadAndNotify(lead,'leadStatus')){
    e.target.reset();
  }
}

function submitPopupConsultation(e){
  e.preventDefault();
  const lead = buildLeadFromForm('popupLead');
  if(saveLeadAndNotify(lead,'popupLeadStatus')){
    e.target.reset();
    setTimeout(closeConsultPopup,1200);
  }
}

function closeConsultPopup(){
  const p=$('consultPopup');
  if(p) p.classList.remove('on');
  sessionStorage.setItem('safarro_popup_closed','1');
}

function scheduleOneMinuteConsultPopup(){
  if(sessionStorage.getItem('safarro_minute_popup_scheduled')==='1')return;
  sessionStorage.setItem('safarro_minute_popup_scheduled','1');
  setTimeout(()=>{
    if(localStorage.getItem('safarro_popup_done')==='1')return;
    if(sessionStorage.getItem('safarro_popup_closed')==='1')return;
    if(!$('consultPopup'))return;
    openConsultPopup();
  },35000);
}

function openConsultPopup(){
  if(localStorage.getItem('safarro_popup_done')==='1') return;
  const p=$('consultPopup');
  if(p) p.classList.add('on');
}

function countTourViewAndMaybePopup(){
  const n = Number(localStorage.getItem('safarro_tour_views')||0) + 1;
  localStorage.setItem('safarro_tour_views', String(n));
  if(n>=2 && localStorage.getItem('safarro_popup_done')!=='1' && sessionStorage.getItem('safarro_popup_closed')!=='1'){
    setTimeout(openConsultPopup, 900);
  }
}

function consultationSection(){return ``;}

function trustSection(){
  return `<section class="trust-section">
    <div class="trust-card">
      <div class="trust-content">
        <div class="trust-head">
          <div>
            <span class="badge domestic">چرا سفرو؟</span>
            <h2>خرید تور با خیال راحت</h2>
          </div>
        </div>
        <div class="trust-items">
          <div class="trust-item"><div class="trust-icon"><i class="fa-solid fa-headset"></i></div><b>پشتیبانی قبل و بعد از خرید</b><p>کارشناس‌ها از انتخاب تور تا زمان سفر همراهت هستند.</p></div>
          <div class="trust-item"><div class="trust-icon"><i class="fa-solid fa-hotel"></i></div><b>انتخاب آزاد هتل</b><p>برای هر تور می‌توانی هتل ۳، ۴ یا ۵ ستاره را انتخاب کنی.</p></div>
          <div class="trust-item"><div class="trust-icon"><i class="fa-solid fa-shield-heart"></i></div><b>نمایش ظرفیت و خدمات</b><p>ظرفیت، خدمات و جزئیات تور واضح نمایش داده می‌شود.</p></div>
          <div class="trust-item"><div class="trust-icon"><i class="fa-solid fa-ticket"></i></div><b>پیگیری رزرو</b><p>با شماره موبایل یا کد پیگیری، وضعیت رزروت را ببین.</p></div>
        </div>
      </div>
    </div>
  </section>`;
}


function consultPopupHtml(){
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

function aboutContactSection(){
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

function referenceHeroSection(){
  const activeCount = tours().filter(t=>t.status==='active').length;
  return `<section class="hero-experience combined-hero-card">
    <div class="combined-hero-grid">
      <div class="combined-hero-copy hero-copy-panel">
        <div class="hero-copy-top">
          <span class="hero-copy-kicker"><i class="fa-solid fa-bolt"></i> بروزرسانی لحظه‌ای قیمت و ظرفیت</span>
          <div class="hero-copy buyer-hero-copy">
            <h1 class="buyer-hero-title">سفرو؛ تور دلخواهت با <span>هتل دلخواهت</span></h1>
            <p class="buyer-hero-subtitle">تورهای داخلی و خارجی را با قیمت، ظرفیت و هتل واقعی مقایسه کن؛ انتخاب نهایی دست خودت است.</p>
          </div>
        </div>
        <div class="hero-copy-bottom">
          <div class="trust-strip">
            <span class="trust-item"><i class="fa-solid fa-fire"></i><span>${faNum(activeCount)} تور فعال</span></span>
            <span class="trust-item"><i class="fa-solid fa-star"></i><span>۴.۸ از ۵ رضایت مسافران</span></span>
            <span class="trust-item"><i class="fa-solid fa-shield-halved"></i><span>هتل و ظرفیت قابل مقایسه</span></span>
          </div>
        </div>
      </div>

      <form class="hero-custom-tour-card" onsubmit="submitConsultation(event)">
        <span class="badge special">تور اختصاصی سفرو</span>
        <h2>تور خودتو بساز</h2>
        <div class="form-note-required">موارد ستاره‌دار الزامی هستند <span class="req-star">*</span></div>
        <div class="grid g2">
          <input id="leadName" class="field" placeholder="نام شما">
          <input id="leadPhone" class="field" placeholder="شماره تماس *" required dir="ltr">
          <input id="leadDest" class="field" placeholder="مقصد دلخواه">
          <select id="leadPeople" class="field">
            <option value="">تعداد نفرات</option>
            <option>۱ نفر</option>
            <option>۲ نفر</option>
            <option>۳ نفر</option>
            <option>۴ نفر یا بیشتر</option>
          </select>
        </div>
        <textarea id="leadNote" class="field" rows="3" style="margin-top:10px" placeholder="مثلاً: استانبول، هتل ۵ ستاره، بودجه ۳۰ میلیون، آخر هفته"></textarea>
        <button class="gold" style="width:100%;margin-top:12px" type="submit"><i class="fa-solid fa-wand-magic-sparkles"></i> ساخت تور اختصاصی</button>
        <div id="leadStatus" class="lead-status"></div>
      </form>
    </div>
  </section>`;
}





function toggleBuyerVisaList(){
  const box=$('buyerVisaList');
  const btn=$('buyerVisaToggleBtn');
  if(!box)return;
  const open=!box.classList.contains('open');
  box.classList.toggle('open',open);
  if(btn)btn.innerHTML=open?'<i class="fa-solid fa-chevron-up"></i> بستن لیست ویزا':'<i class="fa-solid fa-passport"></i> مشاهده ویزاها و توضیحات';
}
function toggleBuyerVisaDetails(id){
  const box=$('buyerVisaDetails_'+id);
  if(!box)return;
  box.classList.toggle('open');
}
function visaSection(){
  const list=visaServices().filter(v=>v.active!==false);
  if(!list.length)return '';
  return `<section class="visa-section card pad buyer-visa-section">
    <div class="buyer-visa-hero">
      <div>
        <span class="badge international">ویزا و خدمات سفر</span>
        <h2>خدمات ویزا را راحت ببین</h2>
        <p class="small">روی دکمه زیر بزن؛ لیست ویزاها باز می‌شود و می‌توانی قیمت، مدارک، زمان انجام و توضیحات لازم را ببینی.</p>
      </div>
      <button id="buyerVisaToggleBtn" class="btn visa-main-toggle" onclick="toggleBuyerVisaList()"><i class="fa-solid fa-passport"></i> مشاهده ویزاها و توضیحات</button>
    </div>
    <div id="buyerVisaList" class="buyer-visa-list">
      ${list.map((v,i)=>`<div class="visa-card buyer-visa-card">
        <div class="buyer-visa-card-head" onclick="toggleBuyerVisaDetails('${i}')">
          <div>
            <h3>${v.country||'—'} ${v.city?`- ${v.city}`:''}</h3>
            <p class="small">${v.type||'توریستی'} | ${v.duration||'—'}</p>
          </div>
          <i class="fa-solid fa-chevron-down"></i>
        </div>
        <div class="visa-price">${Number(v.price||0)>0?money(v.price):'بدون هزینه ویزا'}</div>
        <button class="soft" style="width:100%;margin-top:10px" onclick="toggleBuyerVisaDetails('${i}')">مشاهده مدارک و توضیحات</button>
        <div id="buyerVisaDetails_${i}" class="buyer-visa-details">
          <div><b>مدارک لازم:</b><p>${v.docs||'بعداً از بخش مدیریت تکمیل می‌شود.'}</p></div>
          <div><b>مدت زمان انجام:</b><p>${v.duration||'—'}</p></div>
          <div><b>توضیحات تکمیلی:</b><p>${v.details||v.description||v.note||'در این قسمت می‌توانید توضیحات کامل ویزا، شرایط، مدارک تکمیلی و نکات مهم را بعداً از پنل مدیریت اضافه کنید.'}</p></div>
        </div>
      </div>`).join('')}
    </div>
  </section>`;
}

function customerTrailMini(){return '';}

function renderHome(){
 const list=tours().filter(t=>t.status==='active');
 $('app').innerHTML=`${buyerTabs()}${referenceHeroSection()}${beautyTrustStrip()}${trustSection()}${visaSection()}${consultPopupHtml()}${hotelPhotosModalHtml()}
 <section><div class="row wrap"><h2>قسمت ویژه</h2></div><div class="grid g3">${list.filter(t=>t.lastMinute).slice(0,3).map(lastCard).join('')}</div></section>
 <div class="tours-anchor-title"><div><span class="badge international">فهرست تورها</span><h2>تور مورد نظرت رو انتخاب کن</h2></div></div><section class="card filters"><div class="filter-grid"><div><label class="label">جستجو</label><input id="search" class="field" oninput="filterHome()" placeholder="مقصد یا عنوان تور"></div><div><label class="label">مقصد</label><select id="dest" class="field" onchange="filterHome()"><option value="all">همه</option>${[...new Set(list.map(t=>t.dest))].map(d=>`<option>${d}</option>`).join('')}</select></div><div><label class="label">مرتب‌سازی</label><select id="sort" class="field" onchange="filterHome()"><option value="default">پیش‌فرض</option><option value="asc">ارزان‌ترین</option><option value="desc">گران‌ترین</option><option value="rate">بالاترین امتیاز</option></select></div><button class="soft" onclick="resetHome()">بازنشانی</button></div><div class="grid g3" style="margin-top:12px"><div><label class="label">ایرلاین</label><input id="airline" class="field" oninput="filterHome()"></div><div><label class="label">ستاره هتل</label><select id="star" class="field" onchange="filterHome()"><option value="all">همه</option><option value="3">۳ ستاره</option><option value="4">۴ ستاره</option><option value="5">۵ ستاره</option></select></div><label class="row" style="justify-content:flex-start;margin-top:26px"><input id="onlyCap" type="checkbox" onchange="filterHome()"> فقط ظرفیت‌دار</label></div></section>
 <section class="catbar">${['all:همه','domestic:داخلی','international:خارجی','luxury:لوکس','economy:اقتصادی','special:ویژه'].map(x=>{const[a,b]=x.split(':');return `<button data-cat="${a}" onclick="currentCat='${a}';filterHome()" class="${a===currentCat?'active':''}">${b}</button>`}).join('')}</section>
 <div class="row"><h2>تورها</h2><b id="tourCount">۰</b></div><section id="tourGrid" class="grid g3"></section>
 ${aboutContactSection()}
 <div id="compareDock" class="dock"><b><i class="fa-solid fa-code-compare"></i> <span id="compareCount">۰</span> تور برای مقایسه</b><div class="actions"><button class="soft" onclick="openCompare()">مقایسه</button><button class="danger" onclick="clearCompare()">پاک کردن</button></div></div>
 <div id="compareModal" class="modal" onclick="if(event.target===this)closeCompare()"><div class="modal-card pad"><div class="row"><h2>مقایسه تورها</h2><button class="soft" onclick="closeCompare()">بستن</button></div><div id="compareContent" class="table-wrap"></div></div></div>`;
 filterHome();
 scheduleOneMinuteConsultPopup();
}

function specialPriceLine(t, fallbackPrice){
  const oldP=Number(t.oldPrice||0), newP=Number(t.newPrice||0);
  if(oldP>0 && newP>0){
    return `<div class="manual-discount-line"><span class="old-price">${money(oldP)}</span><span class="price">${money(newP)}</span></div>`;
  }
  return `<div class="price">${money(fallbackPrice)}</div>`;
}


function cardClickDetail(e,id){
  const target=e.target;
  if(target.closest('button,a,input,select,textarea,label'))return;
  route('detail',id);
}

function lastCard(t){return `<article class="last-card soldout-wrap clickable-tour-card" onclick="cardClickDetail(event,${t.id})"><span class="flash-badge">${faNum(t.dealPercent||0)}٪ ویژه</span><img src="${t.img||DEFAULT_IMG}" alt="${t.title||''}"><div class="pad"><div class="row"><b>${t.title}</b><span class="badge special">قسمت ویژه</span></div><p class="small">${t.dest} | ${normalizeDurationNightFirst(t.duration)}</p><div class="row"><b class="price">${money(minHotel(t).price)}</b><button class="btn" onclick="event.stopPropagation();route('detail',${t.id})">مشاهده</button></div></div></article>`}
function filterHome(){
 let q=$('search')?.value?.trim().toLowerCase()||'',d=$('dest')?.value||'all',sort=$('sort')?.value||'default',star=$('star')?.value||'all',airline=$('airline')?.value?.trim().toLowerCase()||'',onlyCap=$('onlyCap')?.checked||false;
 let list=tours().filter(t=>t.status==='active'&&(currentCat==='all'||(t.categories||[]).includes(currentCat))&&(d==='all'||t.dest===d)&&(!q||t.title.toLowerCase().includes(q)||t.dest.toLowerCase().includes(q))&&(!airline||String(t.airline).toLowerCase().includes(airline))&&(star==='all'||(t.hotels||[]).some(h=>Number(h.star)===Number(star)))&&(!onlyCap||totalCapacity(t)>0));
 if(sort==='asc')list.sort((a,b)=>minHotel(a).price-minHotel(b).price);if(sort==='desc')list.sort((a,b)=>minHotel(b).price-minHotel(a).price);if(sort==='rate')list.sort((a,b)=>b.rating-a.rating);
 $('tourCount').textContent=faNum(list.length);$('tourGrid').innerHTML=list.map(tourCard).join('')||'<div class="card pad">توری پیدا نشد.</div>';renderCompareDock()
}
function resetHome(){currentCat='all';renderHome()}
function tourCard(t){const w=wishlist().includes(t.id);return `<article class="card clickable-tour-card" onclick="cardClickDetail(event,${t.id})"><div class="soldout-wrap" style="position:relative;overflow:hidden"><img class="tour-img" src="${t.img||DEFAULT_IMG}" alt="${t.title||''}">${t.lastMinute?'<span class="flash-badge">لحظه آخری</span>':''}</div><div class="pad"><div class="badges">${badges(t)} ${t.label?`<span class="badge special">${t.label}</span>`:''}</div><h3 class="tour-title">${t.title}</h3><div class="meta"><span>${t.dest}</span><span>${normalizeDurationNightFirst(t.duration)}</span><span>${ratingStar()} ${t.rating}</span><span>${faNum(totalCapacity(t))} ظرفیت</span></div><div class="row" style="margin-top:14px;border-top:1px solid var(--b);padding-top:14px"><b class="price">${money(minHotel(t).price)}</b><div class="actions"><button class="soft" onclick="event.stopPropagation();toggleWish(${t.id})"><i class="${w?'fa-solid':'fa-regular'} fa-heart" style="${w?'color:#ef4444':''}"></i></button><button class="btn" onclick="event.stopPropagation();route('detail',${t.id})">جزئیات</button></div></div><button class="compare-btn ${compare.has(t.id)?'active':''}" onclick="event.stopPropagation();toggleCompare(${t.id})">${compare.has(t.id)?'در مقایسه':'افزودن به مقایسه'}</button></div></article>`}
function toggleCompare(id){if(compare.has(id))compare.delete(id);else{if(compare.size>=3)return showToast('حداکثر ۳ تور قابل مقایسه است');compare.add(id)}filterHome()}
function renderCompareDock(){const d=$('compareDock');if(!d)return;$('compareCount').textContent=faNum(compare.size);d.classList.toggle('on',compare.size>0)}
function clearCompare(){compare.clear();filterHome()}
function openCompare(){const list=[...compare].map(id=>findTour(id)).filter(Boolean);if(!list.length)return;const rows=[['تصویر',...list.map(t=>`<img src="${t.img}" style="width:160px;height:95px;object-fit:cover;border-radius:12px">`)],['عنوان',...list.map(t=>`<b>${t.title}</b>`)],['مقصد',...list.map(t=>t.dest)],['مدت',...list.map(t=>t.duration)],['ایرلاین',...list.map(t=>t.airline)],['شروع قیمت',...list.map(t=>`<b class="price">${money(minHotel(t).price)}</b>`)],['ظرفیت',...list.map(t=>faNum(totalCapacity(t))+' نفر')],['هتل‌ها',...list.map(t=>(t.hotels||[]).map(h=>`${h.star}★ ${h.name}`).join('<br>'))]];$('compareContent').innerHTML=`<table><tbody>${rows.map(r=>`<tr>${r.map((c,i)=>`<td style="min-width:${i?190:120}px">${c}</td>`).join('')}</tr>`).join('')}</tbody></table>`;$('compareModal').classList.add('on')}
function closeCompare(){$('compareModal').classList.remove('on')}
function renderDetail(t){
  if(!t)return;
  countTourViewAndMaybePopup();
  const entries=visibleHotelEntries(t); if(!entries.some(e=>e.i===selectedHotel)) selectedHotel=entries[0]?.i||0; const selected = t.hotels[selectedHotel] || entries[0]?.h || minHotel(t);
  const detailGallery = sectionOn(t,'gallery') ? `<div class="gallery">${[t.img,...(t.gallery||[])].slice(0,5).map(x=>`<img src="${x}" onclick="lightbox('${x}')">`).join('')}</div>` : '';
  const descHtml = sectionOn(t,'description') ? `<p class="small">${t.desc||''}</p>` : '';
  const flightHtml = sectionOn(t,'flightInfo') ? `<div class="info-grid">${info('مقصد',t.dest)}${info('مدت',t.duration)}${info('ایرلاین رفت',t.airline)}${info('ایرلاین برگشت',t.returnAirline||t.airline)}${info('زمان پرواز رفت',t.flightTime)}${info('زمان پرواز برگشت',t.returnFlightTime||t.landingTime)}</div>` : '';
  const datesHtml = sectionOn(t,'dates') ? dateOnly(t) : '';
  const hotelsHtml = sectionOn(t,'hotels') ? hotelGroupsHtml(t) : '';
  const itineraryHtml = sectionOn(t,'itinerary') ? `<div class="info"><small>برنامه سفر</small>${(t.itinerary||[]).map(x=>`<p class="small">• ${x}</p>`).join('')}</div>` : '';
  const docsHtml = sectionOn(t,'docs') ? `<div class="info"><small>مدارک لازم</small>${(t.docs||[]).map(x=>`<p class="small">• ${x}</p>`).join('')}</div>` : '';
  const includesHtml = sectionOn(t,'includes') ? `<div class="info"><small>خدمات شامل</small>${(t.includes||[]).map(x=>`<p class="small">✓ ${x}</p>`).join('')}</div>` : '';
  const excludesHtml = sectionOn(t,'excludes') ? `<div class="info"><small>خدمات غیرشامل</small>${(t.excludes||[]).map(x=>`<p class="small">× ${x}</p>`).join('')}</div>` : '';
  const blocks = [itineraryHtml,docsHtml,includesHtml,excludesHtml].filter(Boolean).join('');
  const blocksHtml = blocks ? `<div class="g2 grid" style="margin-top:18px">${blocks}</div>` : '';
  const policyBits = [];
  if(sectionOn(t,'cancellation')) policyBits.push(`<p class="small">قوانین کنسلی: ${t.cancellation||'—'}</p>`);
  if(sectionOn(t,'childPolicy')) policyBits.push(`<p class="small">شرایط کودک: ${t.childPolicy||'—'}</p>`);
  const policyHtml = policyBits.length ? `<div class="info" style="margin-top:14px"><small>قوانین و شرایط</small>${policyBits.join('')}</div>` : '';
  const reviewsHtml = sectionOn(t,'reviews') && (t.reviews||[]).length ? `<h3>نظر مسافران</h3><div class="g2 grid">${(t.reviews||[]).map(r=>`<div class="info"><div class="row"><b>${r.name}</b><span style="color:#f59e0b">${'★'.repeat(r.rate||5)}</span></div><p class="small">${r.text}</p></div>`).join('')}</div>` : '';
  $('app').innerHTML=`${buyerTabs()}<button class="soft" onclick="goBack()">بازگشت</button>
  <section class="card pad" style="margin-top:16px">
    <div class="badges">${badges(t)}</div>
    <img class="detail-img" src="${t.img||DEFAULT_IMG}">
    ${detailGallery}
    <div class="row wrap" style="margin-top:18px">
      <div><h1>${t.title}</h1>${descHtml}</div>
      <button class="soft" onclick="toggleWish(${t.id})">♡ علاقه‌مندی</button>
    </div>
    ${flightHtml}
    ${datesHtml}
    ${hotelsHtml}
    ${blocksHtml}
    ${policyHtml}
    ${reviewsHtml}
    <div class="row wrap" style="border-top:1px solid var(--b);margin-top:18px;padding-top:18px">
      <div><small class="small">قیمت هتل انتخاب‌شده</small>${specialPriceLine(t,selected.price)}</div>
      <button class="btn" onclick="route('booking',${t.id})">رزرو نهایی</button>
    </div>
  </section>
  <div class="sticky-cta"><b>${Number(t.newPrice||0)>0?money(t.newPrice):money(selected.price)}</b><button class="btn" onclick="route('booking',${t.id})">رزرو سریع</button></div>${hotelPhotosModalHtml()}`;
}
function info(l,v){return `<div class="info"><small>${l}</small><b>${v||'—'}</b></div>`}

function dateOnly(t){return `<div class="date-only-title">تاریخ‌های حرکت <span class="small">(نمایشی)</span></div><div class="date-list">${(t.dates||[]).map((d,i)=>`<button type="button" data-date="${d}" class="date-chip ${i===0?'selected active':''}" aria-selected="${i===0?'true':'false'}" onclick="selectTourDateChip(this,'${d}')">${d}</button>`).join('')}</div>`}

function calendar(t){let map={};(t.dates||[]).forEach((d,i)=>{const m=String(d).match(/(\d{1,2})$/);const day=m?Number(m[1]):i+1;map[day]={date:d,cap:totalCapacity(t),special:t.lastMinute||i===0}});let cells='';for(let i=1;i<=30;i++){const it=map[i];if(it){const cls=it.cap<=0?'full':it.cap<=4?'low available':'available';cells+=`<button class="cal-day ${cls} ${it.special?'special':''}" onclick="showToast('تاریخ ${it.date} انتخاب شد')"><b>${faNum(i)}</b><small>${it.cap<=0?'تکمیل':faNum(it.cap)+' ظرفیت'}</small></button>`}else cells+=`<div class="cal-day"><b>${faNum(i)}</b><small>—</small></div>`}return `<div class="calendar"><div class="row"><b>تقویم حرکت</b><span class="small">سبز: ظرفیت‌دار</span></div><div class="calendar-grid">${cells}</div></div>`}
function lightbox(src){$('lbImg').src=src;$('lightbox').classList.add('on')}
function renderBooking(t){booking.tourId=t.id;const entries=visibleHotelEntries(t);if(!entries.some(e=>e.i===booking.hotel))booking.hotel=entries[0]?.i||0;const h=t.hotels[booking.hotel]||entries[0]?.h||t.hotels[0];$('app').innerHTML=`${buyerTabs()}<button class="soft" onclick="route('detail',${t.id})">بازگشت به جزئیات</button><div id="success" class="card pad hidden" style="margin-top:16px;text-align:center;background:linear-gradient(135deg,var(--ok),#34d399);color:white"></div><div id="formArea" class="grid" style="grid-template-columns:2fr 1fr;margin-top:16px"><div class="card pad"><div class="stepper"><div id="st1" class="step active">1</div><div class="line" id="ln1"></div><div id="st2" class="step">2</div><div class="line" id="ln2"></div><div id="st3" class="step">3</div></div><div id="content1"><h3>انتخاب تاریخ و هتل</h3><div class="grid g3">${t.dates.map((d,i)=>`<button class="date-chip ${i===0?'selected':''}" onclick="booking.date='${d}';document.querySelectorAll('.date-chip').forEach(x=>x.classList.remove('selected'));this.classList.add('selected');updateSummary()">${d}</button>`).join('')}</div><h3>هتل</h3>${bookingHotelList(t)}${hotelPhotosModalHtml()}<button class="btn" style="width:100%;margin-top:16px" onclick="nextStep()">مرحله بعد</button></div><div id="content2" class="hidden"><h3>اطلاعات مسافر</h3><div class="grid g2"><input id="name" class="field" placeholder="نام و نام خانوادگی *" required><input id="phone" class="field" placeholder="شماره تماس *" required><input id="national" class="field" placeholder="کد ملی یا پاسپورت"><input id="birth" class="field" placeholder="تاریخ تولد *" required><select id="roomType" class="field"><option>دبل</option><option>توئین</option><option>سینگل</option></select><select id="passengers" class="field" onchange="booking.passengers=Number(this.value);updateSummary()"><option value="1">۱ نفر</option><option value="2" selected>۲ نفر</option><option value="3">۳ نفر</option><option value="4">۴ نفر</option></select><div><div class="row"><input id="discount" class="field" placeholder="کد تخفیف"><button class="soft" onclick="applyDiscount()">اعمال</button></div><small id="discountMsg" class="small"></small></div></div><textarea id="notes" class="field" rows="3" placeholder="توضیحات"></textarea><div class="row" style="margin-top:16px"><button class="soft" onclick="prevStep()">قبلی</button><button class="btn" onclick="nextStep()">مرحله بعد</button></div></div><div id="content3" class="hidden"><h3>تایید نهایی</h3><div id="review" class="stack"></div><div class="row" style="margin-top:16px"><button class="soft" onclick="prevStep()">قبلی</button><button class="btn" onclick="submitBooking()">ثبت نهایی</button></div></div></div><aside class="card pad" style="height:max-content;position:sticky;top:86px"><h3>خلاصه سفارش</h3><div class="stack"><div class="row"><span>تاریخ</span><b id="sumDate">${booking.date}</b></div><div class="row"><span>هتل</span><b id="sumHotel">${h.name}</b></div><div class="row"><span>مسافران</span><b id="sumPassengers">${faNum(booking.passengers)}</b></div><div class="row"><span>تخفیف</span><b id="sumDiscount">۰</b></div><hr style="width:100%;border:0;border-top:1px solid var(--b)"><div class="row"><b>قیمت نهایی</b><b class="price" id="sumTotal"></b></div></div></aside></div>`;updateSummary()}
function calc(){const t=findTour(booking.tourId),entries=visibleHotelEntries(t);if(!t.hotels[booking.hotel])booking.hotel=entries[0]?.i||0;const h=t.hotels[booking.hotel]||entries[0]?.h,gross=h.price*booking.passengers,d=findDiscount($('discount')?.value,t,gross);return{t,h,gross,d,net:Math.max(0,gross-(d.valid?d.amount:0))}}
function updateSummary(){const c=calc();if($('sumDate')){$('sumDate').textContent=booking.date;$('sumHotel').textContent=c.h.name;$('sumPassengers').textContent=faNum(booking.passengers);$('sumDiscount').textContent=money(c.d.valid?c.d.amount:0);$('sumTotal').textContent=money(c.net)}}
function applyDiscount(){const c=calc();$('discountMsg').textContent=c.d.msg;$('discountMsg').style.color=c.d.valid?'var(--ok)':'var(--no)';updateSummary()}
function nextStep(){if(booking.step===1)booking.step=2;else if(booking.step===2){if(!$('name').value.trim())return alert('نام را وارد کنید');if(!$('phone').value.trim())return alert('شماره را وارد کنید');renderReview();booking.step=3}setSteps()}
function prevStep(){if(booking.step>1)booking.step--;setSteps()}
function setSteps(){[1,2,3].forEach(i=>{$('content'+i).classList.toggle('hidden',booking.step!==i);$('st'+i).className='step '+(booking.step===i?'active':booking.step>i?'done':'')});$('ln1').classList.toggle('done',booking.step>1);$('ln2').classList.toggle('done',booking.step>2)}
function renderReview(){const c=calc();$('review').innerHTML=`<div class="info"><small>مسافر</small><b>${$('name').value}</b></div><div class="info"><small>شماره</small><b>${$('phone').value}</b></div><div class="info"><small>تور</small><b>${c.t.title}</b></div><div class="info"><small>هتل</small><b>${c.h.name}</b></div><div class="info"><small>مبلغ</small><b>${money(c.net)}</b></div>`}
function submitBooking(){const c=calc();if(c.h.capacity<=0)return alert('ظرفیت تکمیل است');const id='SR-'+Date.now().toString().slice(-6);const o={id,tourId:c.t.id,tourTitle:c.t.title,hotelName:c.h.name,hotelStar:c.h.star,date:booking.date,passengers:booking.passengers,totalPrice:c.net,gross:c.gross,discountCode:c.d.valid?c.d.code:'',discountAmount:c.d.valid?c.d.amount:0,name:$('name').value,phone:$('phone').value,national:$('national').value,birth:$('birth').value,roomType:$('roomType').value,notes:$('notes').value,status:'در انتظار تماس',viewedTours:customerTrail(),viewedToursText:trailSummary(),adminNote:'',createdAt:new Date().toISOString()};const os=orders();os.push(o);saveOrders(os);const ts=tours();const tour=ts.find(x=>x.id===c.t.id);tour.hotels[booking.hotel].capacity=Math.max(0,Number(tour.hotels[booking.hotel].capacity||0)-booking.passengers);saveTours(ts);const text=encodeURIComponent(`سلام، درخواست رزرو ثبت شد.\nکد پیگیری: ${id}\nتور: ${c.t.title}\nنام: ${o.name}\nشماره: ${o.phone}\nتاریخ: ${o.date}\nهتل: ${o.hotelName}\nمبلغ: ${money(o.totalPrice)}`);$('formArea').classList.add('hidden');$('success').classList.remove('hidden');$('success').innerHTML=`<h2>رزرو ثبت شد ✅</h2><p>کد پیگیری: ${id}</p><a class="soft" target="_blank" href="https://wa.me/989123456789?text=${text}">ارسال در واتساپ</a><br><br><button class="btn" onclick="route('home')">بازگشت</button>`}
function renderWish(){const list=tours().filter(t=>wishlist().includes(t.id));$('app').innerHTML=`${buyerTabs()}<div class="row"><h1>علاقه‌مندی‌ها</h1><button class="soft" onclick="clearWish()">حذف همه</button></div><div class="grid g3">${list.map(tourCard).join('')||'<div class="card pad">لیست خالی است.</div>'}</div>`}
function renderMine(){$('app').innerHTML=`${buyerTabs()}<div class="card pad"><h1>رزروهای من</h1><p class="small">شماره موبایل یا کد پیگیری را وارد کن.</p><div class="row wrap"><input id="mineQ" class="field" placeholder="0912... یا SR-123456"><button class="btn" onclick="findMine()">جستجو</button></div></div><div id="mineResult" class="grid g2" style="margin-top:18px"></div>`}
function findMine(){const q=$('mineQ').value.trim();const list=orders().filter(o=>o.phone===q||o.id.toUpperCase()===q.toUpperCase());$('mineResult').innerHTML=list.map(o=>`<div class="card pad"><div class="row"><b>${o.tourTitle}</b><span class="badge special">${o.status}</span></div><p class="small">کد: ${o.id}</p><p class="small">تاریخ: ${o.date}</p><p class="small">هتل: ${o.hotelName}</p><b class="price">${money(o.totalPrice)}</b></div>`).join('')||'<div class="card pad">رزروی پیدا نشد.</div>'}
document.addEventListener('DOMContentLoaded',initBuyer);

function forceTopScroll(){
  window.scrollTo({top:0,left:0,behavior:'auto'});
  setTimeout(()=>window.scrollTo({top:0,left:0,behavior:'auto'}),60);
}
function goBack(){if(history.length>1) history.back(); else route('home')}
function updateBackButton(){const btn=$('backFloatingBtn');if(btn)btn.classList.toggle('on',view!=='home')}
