let view='home',currentCat='all',compare=new Set(),selectedTour=null,selectedHotel=0,booking={step:1,tourId:null,hotel:0,date:null,passengers:2};
const MANAGER_WHATSAPP='989126144939';
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
function initBuyer(){mount('buyer');route('home');setInterval(()=>document.querySelectorAll('[data-countdown]').forEach(e=>e.textContent=countdown(e.dataset.countdown)),1000)}
function route(v,id){view=v;if(v==='detail')selectedTour=id;if(v==='booking'){booking.tourId=id;booking.hotel=0;booking.step=1;const t=findTour(id);booking.date=t?.dates?.[0]||null}renderBuyer()}
function renderBuyer(){if(view==='home')return renderHome();if(view==='detail')return renderDetail(findTour(selectedTour));if(view==='booking')return renderBooking(findTour(booking.tourId));if(view==='wish')return renderWish();if(view==='mine')return renderMine()}
function buyerTabs(){return `<div class="catbar"><button onclick="route('home')" class="${view==='home'?'active':''}">خانه خریدار</button><button onclick="route('wish')" class="${view==='wish'?'active':''}">علاقه‌مندی‌ها</button><button onclick="route('mine')" class="${view==='mine'?'active':''}">رزروهای من</button></div>`}

function sendLeadToWhatsApp(lead){
  const msg = `درخواست مشاوره جدید سفر رو
نام: ${lead.name || '—'}
شماره: ${lead.phone}
مقصد: ${lead.dest || '—'}
تعداد نفرات: ${lead.people || '—'}
توضیح: ${lead.note || '—'}
منبع: ${lead.source || 'سایت'}
کد: ${lead.id}`;
  const url = `https://wa.me/${MANAGER_WHATSAPP}?text=${encodeURIComponent(msg)}`;
  const w = window.open(url,'_blank');
  if(!w){
    const box = $('leadStatus') || $('popupLeadStatus');
    if(box){
      box.innerHTML = `درخواست ثبت شد. برای ارسال به واتس‌اپ مدیر، <a href="${url}" target="_blank">اینجا بزنید</a>.`;
      box.classList.add('on');
    }
  }
}

function buildLeadFromForm(prefix){
  return {
    id:'LEAD-' + Date.now().toString().slice(-6),
    name:$(prefix+'Name')?.value?.trim() || '',
    phone:$(prefix+'Phone')?.value?.trim() || '',
    dest:$(prefix+'Dest')?.value?.trim() || '',
    people:$(prefix+'People')?.value || '',
    note:$(prefix+'Note')?.value?.trim() || '',
    source:prefix==='popupLead'?'پاپ‌آپ مشاوره بعد از مشاهده تور':'تور خودتو بساز / صفحه اول',
    status:'جدید',
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
    box.textContent = 'شماره شما ثبت شد. پیام آماده برای واتس‌اپ مدیر باز می‌شود.';
    box.classList.add('on');
  }

  sendLeadToWhatsApp(lead);
  showToast('شماره ثبت شد و پیام واتس‌اپ آماده شد');
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
  localStorage.setItem('safarro_popup_closed','1');
}

function openConsultPopup(){
  if(localStorage.getItem('safarro_popup_done')==='1') return;
  const p=$('consultPopup');
  if(p) p.classList.add('on');
}

function countTourViewAndMaybePopup(){
  const n = Number(localStorage.getItem('safarro_tour_views')||0) + 1;
  localStorage.setItem('safarro_tour_views', String(n));
  if(n>=2 && localStorage.getItem('safarro_popup_done')!=='1' && localStorage.getItem('safarro_popup_closed')!=='1'){
    setTimeout(openConsultPopup, 900);
  }
}

function consultationSection(){
  return `<section class="build-tour-hero">
    <div class="build-tour-grid">
      <div>
        <span class="badge special">تور اختصاصی سفر رو</span>
        <h1 class="build-tour-title">تور خودتو بساز</h1>
        <p class="consult-sub">مقصد، بودجه، تاریخ و سلیقه‌ات را وارد کن؛ کارشناس سفر رو بهترین ترکیب پرواز، هتل و خدمات را برایت پیشنهاد می‌دهد.</p>
        <div class="build-tour-steps">
          <div class="build-tour-step"><i class="fa-solid fa-location-dot"></i> مقصد و تاریخ دلخواهت را بگو</div>
          <div class="build-tour-step"><i class="fa-solid fa-hotel"></i> هتل ۳، ۴ یا ۵ ستاره انتخاب کن</div>
          <div class="build-tour-step"><i class="fa-solid fa-phone-volume"></i> کارشناس سفر رو با تو تماس می‌گیرد</div>
        </div>
      </div>
      <form class="build-tour-card" onsubmit="submitConsultation(event)">
        <div class="grid g2">
          <input id="leadName" class="field" placeholder="نام شما">
          <input id="leadPhone" class="field" placeholder="شماره تماس *" dir="ltr">
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
        <button class="gold" style="width:100%;margin-top:12px" type="submit"><i class="fa-solid fa-wand-magic-sparkles"></i> ثبت درخواست ساخت تور</button>
        <div id="leadStatus" class="lead-status"></div>
        <div class="whatsapp-note">بعد از ثبت، پیام آماده به واتس‌اپ مدیر با شماره ۰۹۱۲۶۱۴۴۹۳۹ باز می‌شود.</div>
      </form>
    </div>
  </section>`;
}

function trustSection(){
  return `<section class="trust-section">
    <div class="trust-card">
      <div class="trust-content">
        <div class="trust-head">
          <div>
            <span class="badge domestic">چرا سفر رو؟</span>
            <h2>خرید تور با خیال راحت</h2>
          </div>
          <span class="small">بعد از ارسال عکس مرجع، ظاهر این بخش دقیق‌تر شبیه نمونه سفر رو می‌شود.</span>
        </div>
        <div class="trust-items">
          <div class="trust-item"><div class="trust-icon"><i class="fa-solid fa-headset"></i></div><b>پشتیبانی قبل و بعد از خرید</b><p>کارشناس‌ها از انتخاب تور تا زمان سفر همراهت هستند.</p></div>
          <div class="trust-item"><div class="trust-icon"><i class="fa-solid fa-hotel"></i></div><b>انتخاب آزاد هتل</b><p>برای هر تور می‌توانی هتل ۳، ۴ یا ۵ ستاره را انتخاب کنی.</p></div>
          <div class="trust-item"><div class="trust-icon"><i class="fa-solid fa-shield-heart"></i></div><b>شفافیت قیمت و ظرفیت</b><p>قیمت، ظرفیت و خدمات تور واضح نمایش داده می‌شود.</p></div>
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
      <div class="popup-title">هنوز بین تورها مرددی؟</div>
      <p class="popup-desc">شماره‌ات را بگذار تا کارشناس سفر رو با توجه به مقصد، بودجه و تاریخ سفرت بهترین پیشنهاد را بدهد.</p>
      <form onsubmit="submitPopupConsultation(event)">
        <div class="grid g2">
          <input id="popupLeadName" class="field" placeholder="نام شما">
          <input id="popupLeadPhone" class="field" placeholder="شماره تماس *" dir="ltr">
          <input id="popupLeadDest" class="field" placeholder="مقصد موردنظر">
          <select id="popupLeadPeople" class="field">
            <option value="">تعداد نفرات</option>
            <option>۱ نفر</option>
            <option>۲ نفر</option>
            <option>۳ نفر</option>
            <option>۴ نفر یا بیشتر</option>
          </select>
        </div>
        <textarea id="popupLeadNote" class="field" rows="3" style="margin-top:10px" placeholder="توضیح کوتاه، بودجه یا تاریخ دلخواه"></textarea>
        <button class="btn" style="width:100%;margin-top:12px" type="submit"><i class="fa-brands fa-whatsapp"></i> ثبت و ارسال به واتس‌اپ مدیر</button>
        <div id="popupLeadStatus" class="lead-status"></div>
      </form>
      <div class="whatsapp-note">این نسخه بدون بک‌اند است؛ برای پیامک خودکار واقعی باید پنل پیامکی وصل شود.</div>
    </div>
  </div>`;
}

function renderHome(){
 const list=tours().filter(t=>t.status==='active');
 $('app').innerHTML=`${buyerTabs()}${consultationSection()}${trustSection()}${consultPopupHtml()}
 <section><div class="row wrap"><h2>پیشنهادهای لحظه آخری</h2><span class="small">تخفیف‌دار و ظرفیت محدود</span></div><div class="grid g3">${list.filter(t=>t.lastMinute).slice(0,3).map(lastCard).join('')}</div></section>
 <div class="tours-anchor-title"><div><span class="badge international">فهرست تورها</span><h2>تور مورد نظرت رو انتخاب کن</h2></div><span class="small">فیلترها ساده و سریع طراحی شده‌اند</span></div><section class="card filters"><div class="filter-grid"><div><label class="label">جستجو</label><input id="search" class="field" oninput="filterHome()" placeholder="مقصد یا عنوان تور"></div><div><label class="label">مقصد</label><select id="dest" class="field" onchange="filterHome()"><option value="all">همه</option>${[...new Set(list.map(t=>t.dest))].map(d=>`<option>${d}</option>`).join('')}</select></div><div><label class="label">مرتب‌سازی</label><select id="sort" class="field" onchange="filterHome()"><option value="default">پیش‌فرض</option><option value="asc">ارزان‌ترین</option><option value="desc">گران‌ترین</option><option value="rate">بالاترین امتیاز</option></select></div><button class="soft" onclick="resetHome()">بازنشانی</button></div><div class="grid g3" style="margin-top:12px"><div><label class="label">ایرلاین</label><input id="airline" class="field" oninput="filterHome()"></div><div><label class="label">ستاره هتل</label><select id="star" class="field" onchange="filterHome()"><option value="all">همه</option><option value="3">۳ ستاره</option><option value="4">۴ ستاره</option><option value="5">۵ ستاره</option></select></div><label class="row" style="justify-content:flex-start;margin-top:26px"><input id="onlyCap" type="checkbox" onchange="filterHome()"> فقط ظرفیت‌دار</label></div></section>
 <section class="catbar">${['all:همه','domestic:داخلی','international:خارجی','luxury:لوکس','economy:اقتصادی','special:ویژه'].map(x=>{const[a,b]=x.split(':');return `<button data-cat="${a}" onclick="currentCat='${a}';filterHome()" class="${a===currentCat?'active':''}">${b}</button>`}).join('')}</section>
 <div class="row"><h2>تورها</h2><b id="tourCount">۰</b></div><section id="tourGrid" class="grid g3"></section>
 <div id="compareDock" class="dock"><b><i class="fa-solid fa-code-compare"></i> <span id="compareCount">۰</span> تور برای مقایسه</b><div class="actions"><button class="soft" onclick="openCompare()">مقایسه</button><button class="danger" onclick="clearCompare()">پاک کردن</button></div></div>
 <div id="compareModal" class="modal" onclick="if(event.target===this)closeCompare()"><div class="modal-card pad"><div class="row"><h2>مقایسه تورها</h2><button class="soft" onclick="closeCompare()">بستن</button></div><div id="compareContent" class="table-wrap"></div></div></div>`;
 filterHome();
}
function lastCard(t){return `<article class="last-card"><span class="flash-badge">${faNum(t.dealPercent||0)}٪ لحظه آخری</span><img src="${t.img||DEFAULT_IMG}"><div class="pad"><div class="row"><b>${t.title}</b><span class="countdown" data-countdown="${t.dealEndsAt}">${countdown(t.dealEndsAt)}</span></div><p class="small">${t.dest} | ${t.duration}</p><div class="row"><b class="price">${money(minHotel(t).price)}</b><button class="btn" onclick="route('detail',${t.id})">مشاهده</button></div></div></article>`}
function filterHome(){
 let q=$('search')?.value?.trim().toLowerCase()||'',d=$('dest')?.value||'all',sort=$('sort')?.value||'default',star=$('star')?.value||'all',airline=$('airline')?.value?.trim().toLowerCase()||'',onlyCap=$('onlyCap')?.checked||false;
 let list=tours().filter(t=>t.status==='active'&&(currentCat==='all'||(t.categories||[]).includes(currentCat))&&(d==='all'||t.dest===d)&&(!q||t.title.toLowerCase().includes(q)||t.dest.toLowerCase().includes(q))&&(!airline||String(t.airline).toLowerCase().includes(airline))&&(star==='all'||(t.hotels||[]).some(h=>Number(h.star)===Number(star)))&&(!onlyCap||totalCapacity(t)>0));
 if(sort==='asc')list.sort((a,b)=>minHotel(a).price-minHotel(b).price);if(sort==='desc')list.sort((a,b)=>minHotel(b).price-minHotel(a).price);if(sort==='rate')list.sort((a,b)=>b.rating-a.rating);
 $('tourCount').textContent=faNum(list.length);$('tourGrid').innerHTML=list.map(tourCard).join('')||'<div class="card pad">توری پیدا نشد.</div>';renderCompareDock()
}
function resetHome(){currentCat='all';renderHome()}
function tourCard(t){const w=wishlist().includes(t.id);return `<article class="card"><div style="position:relative;overflow:hidden"><img class="tour-img" src="${t.img||DEFAULT_IMG}">${t.lastMinute?'<span class="flash-badge">لحظه آخری</span>':''}</div><div class="pad"><div class="badges">${badges(t)} ${t.label?`<span class="badge special">${t.label}</span>`:''}</div><h3 class="tour-title">${t.title}</h3><div class="meta"><span>${t.dest}</span><span>${t.duration}</span><span>${ratingStar()} ${t.rating}</span><span>${faNum(totalCapacity(t))} ظرفیت</span></div><div class="row" style="margin-top:14px;border-top:1px solid var(--b);padding-top:14px"><b class="price">${money(minHotel(t).price)}</b><div class="actions"><button class="soft" onclick="toggleWish(${t.id})"><i class="${w?'fa-solid':'fa-regular'} fa-heart" style="${w?'color:#ef4444':''}"></i></button><button class="btn" onclick="route('detail',${t.id})">جزئیات</button></div></div><button class="compare-btn ${compare.has(t.id)?'active':''}" onclick="toggleCompare(${t.id})">${compare.has(t.id)?'در مقایسه':'افزودن به مقایسه'}</button></div></article>`}
function toggleCompare(id){if(compare.has(id))compare.delete(id);else{if(compare.size>=3)return showToast('حداکثر ۳ تور قابل مقایسه است');compare.add(id)}filterHome()}
function renderCompareDock(){const d=$('compareDock');if(!d)return;$('compareCount').textContent=faNum(compare.size);d.classList.toggle('on',compare.size>0)}
function clearCompare(){compare.clear();filterHome()}
function openCompare(){const list=[...compare].map(id=>findTour(id)).filter(Boolean);if(!list.length)return;const rows=[['تصویر',...list.map(t=>`<img src="${t.img}" style="width:160px;height:95px;object-fit:cover;border-radius:12px">`)],['عنوان',...list.map(t=>`<b>${t.title}</b>`)],['مقصد',...list.map(t=>t.dest)],['مدت',...list.map(t=>t.duration)],['ایرلاین',...list.map(t=>t.airline)],['شروع قیمت',...list.map(t=>`<b class="price">${money(minHotel(t).price)}</b>`)],['ظرفیت',...list.map(t=>faNum(totalCapacity(t))+' نفر')],['هتل‌ها',...list.map(t=>(t.hotels||[]).map(h=>`${h.star}★ ${h.name}`).join('<br>'))]];$('compareContent').innerHTML=`<table><tbody>${rows.map(r=>`<tr>${r.map((c,i)=>`<td style="min-width:${i?190:120}px">${c}</td>`).join('')}</tr>`).join('')}</tbody></table>`;$('compareModal').classList.add('on')}
function closeCompare(){$('compareModal').classList.remove('on')}
function renderDetail(t){
  if(!t)return;
  countTourViewAndMaybePopup();
  const selected = t.hotels[selectedHotel] || minHotel(t);
  const detailGallery = sectionOn(t,'gallery') ? `<div class="gallery">${[t.img,...(t.gallery||[])].slice(0,5).map(x=>`<img src="${x}" onclick="lightbox('${x}')">`).join('')}</div>` : '';
  const descHtml = sectionOn(t,'description') ? `<p class="small">${t.desc||''}</p>` : '';
  const flightHtml = sectionOn(t,'flightInfo') ? `<div class="info-grid">${info('مقصد',t.dest)}${info('مدت',t.duration)}${info('ایرلاین',t.airline)}${info('شماره پرواز',t.flightNumber)}${info('زمان پرواز',t.flightTime)}${info('زمان فرود',t.landingTime)}</div>` : '';
  const datesHtml = sectionOn(t,'dates') ? dateOnly(t) : '';
  const hotelsHtml = sectionOn(t,'hotels') ? `<h3>انتخاب هتل</h3><div class="stack">${t.hotels.map((h,i)=>`<div class="hotel ${i===selectedHotel?'selected':''} ${h.capacity<=0?'disabled':''}" onclick="${h.capacity>0?`selectedHotel=${i};renderDetail(findTour(${t.id}))`:''}"><div class="row"><b>${h.name} ${hotelStars(h.star)}</b><b>${money(h.price)}</b></div><small>${h.capacity>0?faNum(h.capacity)+' ظرفیت':'تکمیل ظرفیت'}</small></div>`).join('')}</div>` : '';
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
  $('app').innerHTML=`${buyerTabs()}<button class="soft" onclick="route('home')">بازگشت</button>
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
      <div><small class="small">قیمت هتل انتخاب‌شده</small><div class="price">${money(selected.price)}</div></div>
      <button class="btn" onclick="route('booking',${t.id})">رزرو نهایی</button>
    </div>
  </section>
  <div class="sticky-cta"><b>${money(selected.price)}</b><button class="btn" onclick="route('booking',${t.id})">رزرو سریع</button></div>`;
}
function info(l,v){return `<div class="info"><small>${l}</small><b>${v||'—'}</b></div>`}

function dateOnly(t){
  return `<div class="date-only-title">تاریخ‌های حرکت</div>
  <div class="date-list">
    ${(t.dates||[]).map((d,i)=>`<button class="date-chip ${i===0?'selected':''}" onclick="showToast('تاریخ ${d} انتخاب شد')">${d}</button>`).join('')}
  </div>`;
}

function calendar(t){let map={};(t.dates||[]).forEach((d,i)=>{const m=String(d).match(/(\d{1,2})$/);const day=m?Number(m[1]):i+1;map[day]={date:d,cap:totalCapacity(t),special:t.lastMinute||i===0}});let cells='';for(let i=1;i<=30;i++){const it=map[i];if(it){const cls=it.cap<=0?'full':it.cap<=4?'low available':'available';cells+=`<button class="cal-day ${cls} ${it.special?'special':''}" onclick="showToast('تاریخ ${it.date} انتخاب شد')"><b>${faNum(i)}</b><small>${it.cap<=0?'تکمیل':faNum(it.cap)+' ظرفیت'}</small></button>`}else cells+=`<div class="cal-day"><b>${faNum(i)}</b><small>—</small></div>`}return `<div class="calendar"><div class="row"><b>تقویم حرکت</b><span class="small">سبز: ظرفیت‌دار</span></div><div class="calendar-grid">${cells}</div></div>`}
function lightbox(src){$('lbImg').src=src;$('lightbox').classList.add('on')}
function renderBooking(t){booking.tourId=t.id;const h=t.hotels[booking.hotel]||t.hotels[0];$('app').innerHTML=`${buyerTabs()}<button class="soft" onclick="route('detail',${t.id})">بازگشت به جزئیات</button><div id="success" class="card pad hidden" style="margin-top:16px;text-align:center;background:linear-gradient(135deg,var(--ok),#34d399);color:white"></div><div id="formArea" class="grid" style="grid-template-columns:2fr 1fr;margin-top:16px"><div class="card pad"><div class="stepper"><div id="st1" class="step active">1</div><div class="line" id="ln1"></div><div id="st2" class="step">2</div><div class="line" id="ln2"></div><div id="st3" class="step">3</div></div><div id="content1"><h3>انتخاب تاریخ و هتل</h3><div class="grid g3">${t.dates.map((d,i)=>`<button class="date-chip ${i===0?'selected':''}" onclick="booking.date='${d}';document.querySelectorAll('.date-chip').forEach(x=>x.classList.remove('selected'));this.classList.add('selected');updateSummary()">${d}</button>`).join('')}</div><h3>هتل</h3><div class="stack">${t.hotels.map((h,i)=>`<div class="hotel ${i===booking.hotel?'selected':''} ${h.capacity<=0?'disabled':''}" onclick="${h.capacity>0?`booking.hotel=${i};renderBooking(findTour(${t.id}))`:''}"><div class="row"><b>${h.name} ${hotelStars(h.star)}</b><b>${money(h.price)}</b></div><small>${h.capacity>0?faNum(h.capacity)+' ظرفیت':'تکمیل ظرفیت'}</small></div>`).join('')}</div><button class="btn" style="width:100%;margin-top:16px" onclick="nextStep()">مرحله بعد</button></div><div id="content2" class="hidden"><h3>اطلاعات مسافر</h3><div class="grid g2"><input id="name" class="field" placeholder="نام و نام خانوادگی"><input id="phone" class="field" placeholder="شماره تماس"><input id="national" class="field" placeholder="کد ملی یا پاسپورت"><input id="birth" class="field" placeholder="تاریخ تولد"><select id="roomType" class="field"><option>دبل</option><option>توئین</option><option>سینگل</option></select><select id="passengers" class="field" onchange="booking.passengers=Number(this.value);updateSummary()"><option value="1">۱ نفر</option><option value="2" selected>۲ نفر</option><option value="3">۳ نفر</option><option value="4">۴ نفر</option></select><div><div class="row"><input id="discount" class="field" placeholder="کد تخفیف"><button class="soft" onclick="applyDiscount()">اعمال</button></div><small id="discountMsg" class="small"></small></div></div><textarea id="notes" class="field" rows="3" placeholder="توضیحات"></textarea><div class="row" style="margin-top:16px"><button class="soft" onclick="prevStep()">قبلی</button><button class="btn" onclick="nextStep()">مرحله بعد</button></div></div><div id="content3" class="hidden"><h3>تایید نهایی</h3><div id="review" class="stack"></div><div class="row" style="margin-top:16px"><button class="soft" onclick="prevStep()">قبلی</button><button class="btn" onclick="submitBooking()">ثبت نهایی</button></div></div></div><aside class="card pad" style="height:max-content;position:sticky;top:86px"><h3>خلاصه سفارش</h3><div class="stack"><div class="row"><span>تاریخ</span><b id="sumDate">${booking.date}</b></div><div class="row"><span>هتل</span><b id="sumHotel">${h.name}</b></div><div class="row"><span>مسافران</span><b id="sumPassengers">${faNum(booking.passengers)}</b></div><div class="row"><span>تخفیف</span><b id="sumDiscount">۰</b></div><hr style="width:100%;border:0;border-top:1px solid var(--b)"><div class="row"><b>قیمت نهایی</b><b class="price" id="sumTotal"></b></div></div></aside></div>`;updateSummary()}
function calc(){const t=findTour(booking.tourId),h=t.hotels[booking.hotel],gross=h.price*booking.passengers,d=findDiscount($('discount')?.value,t,gross);return{t,h,gross,d,net:Math.max(0,gross-(d.valid?d.amount:0))}}
function updateSummary(){const c=calc();if($('sumDate')){$('sumDate').textContent=booking.date;$('sumHotel').textContent=c.h.name;$('sumPassengers').textContent=faNum(booking.passengers);$('sumDiscount').textContent=money(c.d.valid?c.d.amount:0);$('sumTotal').textContent=money(c.net)}}
function applyDiscount(){const c=calc();$('discountMsg').textContent=c.d.msg;$('discountMsg').style.color=c.d.valid?'var(--ok)':'var(--no)';updateSummary()}
function nextStep(){if(booking.step===1)booking.step=2;else if(booking.step===2){if(!$('name').value.trim())return alert('نام را وارد کنید');if(!$('phone').value.trim())return alert('شماره را وارد کنید');renderReview();booking.step=3}setSteps()}
function prevStep(){if(booking.step>1)booking.step--;setSteps()}
function setSteps(){[1,2,3].forEach(i=>{$('content'+i).classList.toggle('hidden',booking.step!==i);$('st'+i).className='step '+(booking.step===i?'active':booking.step>i?'done':'')});$('ln1').classList.toggle('done',booking.step>1);$('ln2').classList.toggle('done',booking.step>2)}
function renderReview(){const c=calc();$('review').innerHTML=`<div class="info"><small>مسافر</small><b>${$('name').value}</b></div><div class="info"><small>شماره</small><b>${$('phone').value}</b></div><div class="info"><small>تور</small><b>${c.t.title}</b></div><div class="info"><small>هتل</small><b>${c.h.name}</b></div><div class="info"><small>مبلغ</small><b>${money(c.net)}</b></div>`}
function submitBooking(){const c=calc();if(c.h.capacity<=0)return alert('ظرفیت تکمیل است');const id='SR-'+Date.now().toString().slice(-6);const o={id,tourId:c.t.id,tourTitle:c.t.title,hotelName:c.h.name,hotelStar:c.h.star,date:booking.date,passengers:booking.passengers,totalPrice:c.net,gross:c.gross,discountCode:c.d.valid?c.d.code:'',discountAmount:c.d.valid?c.d.amount:0,name:$('name').value,phone:$('phone').value,national:$('national').value,birth:$('birth').value,roomType:$('roomType').value,notes:$('notes').value,status:'در انتظار تماس',adminNote:'',createdAt:new Date().toISOString()};const os=orders();os.push(o);saveOrders(os);const ts=tours();const tour=ts.find(x=>x.id===c.t.id);tour.hotels[booking.hotel].capacity=Math.max(0,Number(tour.hotels[booking.hotel].capacity||0)-booking.passengers);saveTours(ts);const text=encodeURIComponent(`سلام، درخواست رزرو ثبت شد.\nکد پیگیری: ${id}\nتور: ${c.t.title}\nنام: ${o.name}\nشماره: ${o.phone}\nتاریخ: ${o.date}\nهتل: ${o.hotelName}\nمبلغ: ${money(o.totalPrice)}`);$('formArea').classList.add('hidden');$('success').classList.remove('hidden');$('success').innerHTML=`<h2>رزرو ثبت شد ✅</h2><p>کد پیگیری: ${id}</p><a class="soft" target="_blank" href="https://wa.me/989123456789?text=${text}">ارسال در واتساپ</a><br><br><button class="btn" onclick="route('home')">بازگشت</button>`}
function renderWish(){const list=tours().filter(t=>wishlist().includes(t.id));$('app').innerHTML=`${buyerTabs()}<div class="row"><h1>علاقه‌مندی‌ها</h1><button class="soft" onclick="clearWish()">حذف همه</button></div><div class="grid g3">${list.map(tourCard).join('')||'<div class="card pad">لیست خالی است.</div>'}</div>`}
function renderMine(){$('app').innerHTML=`${buyerTabs()}<div class="card pad"><h1>رزروهای من</h1><p class="small">شماره موبایل یا کد پیگیری را وارد کن.</p><div class="row wrap"><input id="mineQ" class="field" placeholder="0912... یا SR-123456"><button class="btn" onclick="findMine()">جستجو</button></div></div><div id="mineResult" class="grid g2" style="margin-top:18px"></div>`}
function findMine(){const q=$('mineQ').value.trim();const list=orders().filter(o=>o.phone===q||o.id.toUpperCase()===q.toUpperCase());$('mineResult').innerHTML=list.map(o=>`<div class="card pad"><div class="row"><b>${o.tourTitle}</b><span class="badge special">${o.status}</span></div><p class="small">کد: ${o.id}</p><p class="small">تاریخ: ${o.date}</p><p class="small">هتل: ${o.hotelName}</p><b class="price">${money(o.totalPrice)}</b></div>`).join('')||'<div class="card pad">رزروی پیدا نشد.</div>'}
document.addEventListener('DOMContentLoaded',initBuyer);
