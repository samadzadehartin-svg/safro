function staffVisibleTour(t){
  if(t?.sourceName==='Parto' && t?.showInStaff!==true)return false;
  return true;
}
function staffTours(){
  return tours().filter(staffVisibleTour);
}


function excelCell(row, idx){return row && row[idx]!==undefined && row[idx]!==null ? row[idx] : ''}
function excelNum(v){const n=Number(String(v??'').replace(/[^\d.-]/g,''));return isNaN(n)?0:n}
function excelStar(v){const m=String(v||'').match(/\d/);return m?Number(m[0]):3}
function normalizeTourMatchName(s){return String(s||'').toLowerCase().replace(/\s+/g,' ').trim()}
function sheetRowsToHotels(rows){
  const hotels=[];
  for(let r=2;r<rows.length;r++){
    const row=rows[r]||[];
    const name=String(excelCell(row,2)||'').trim();
    if(!name || name.toLowerCase()==='hotel')continue;
    const star=excelStar(excelCell(row,1));
    const location=String(excelCell(row,23)||'').trim();
    const capCols=[3,5,7,10,12,14,17,19,21];
    const priceCols=[4,6,8,11,13,15,18,20,22];
    const caps=capCols.map(i=>excelNum(row[i])).filter(n=>n>0);
    const prices=priceCols.map(i=>excelNum(row[i])).filter(n=>n>0);
    const capacity=caps.reduce((a,b)=>a+b,0);
    const price=prices.length?Math.min(...prices):0;
    hotels.push({
      hotelId:'excel-'+Date.now()+'-'+r+'-'+Math.random().toString(16).slice(2),
      star,name,price,capacity,location,showInBuyer:true,
      roomSheet:{
        double:{capacity:excelNum(row[3]),price:excelNum(row[4])},
        single:{capacity:excelNum(row[5]),price:excelNum(row[6])},
        triple:{capacity:excelNum(row[7]),price:excelNum(row[8])}
      }
    });
  }
  return hotels;
}
function applyExcelRowsToTour(tourId,rows,sheetName){
  const hotels=sheetRowsToHotels(rows);
  if(!hotels.length)return {ok:false,msg:`در شیت ${sheetName} هتلی پیدا نشد`};
  const ts=staffTours().map(t=>{
    if(Number(t.id)!==Number(tourId))return t;
    const minPrice=hotels.map(h=>h.price).filter(Boolean).sort((a,b)=>a-b)[0] || t.price || 0;
    return {...t,hotels,price:minPrice,lastEditedBy:'Excel Sheet',lastEditedAt:new Date().toISOString()};
  });
  saveTours(ts);
  return {ok:true,msg:`${sheetName}: ${faNum(hotels.length)} هتل روی تور ذخیره شد`};
}
function findTourForSheet(sheetName){
  const n=normalizeTourMatchName(sheetName);
  return tours().find(t=>normalizeTourMatchName(t.title)===n)
      || tours().find(t=>normalizeTourMatchName(t.title).includes(n)||n.includes(normalizeTourMatchName(t.title)))
      || null;
}
function importExcelTourSheet(inputId,resultId,targetSelectId){
  const file=$(inputId)?.files?.[0];
  const result=$(resultId);
  if(!file){alert('فایل اکسل را انتخاب کنید');return}
  if(typeof XLSX==='undefined'){alert('کتابخانه خواندن اکسل لود نشده است. اینترنت یا CDN را چک کنید.');return}
  const reader=new FileReader();
  reader.onload=e=>{
    const wb=XLSX.read(new Uint8Array(e.target.result),{type:'array'});
    const messages=[];
    wb.SheetNames.forEach(name=>{
      const rows=XLSX.utils.sheet_to_json(wb.Sheets[name],{header:1,defval:''});
      let tour=findTourForSheet(name);
      if((!tour || name.toUpperCase()==='TOUR' || name==='راهنما') && targetSelectId && $(targetSelectId)){
        tour=findTour(Number($(targetSelectId).value));
      }
      if(!tour || name==='راهنما'){messages.push(`${name}: تور متناظر پیدا نشد`);return}
      const res=applyExcelRowsToTour(tour.id,rows,name);
      messages.push(`${tour.title} ← ${res.msg}`);
    });
    if(result)result.innerHTML=messages.map(x=>`<div>${x}</div>`).join('');
    if(typeof renderTourImages==='function')renderTourImages();
    if(typeof renderCurrentTourHotels==='function')renderCurrentTourHotels();
    if(typeof renderStaff==='function')setTimeout(renderStaff,500);
    showToast('آپلود شیت اکسل انجام شد');
  };
  reader.readAsArrayBuffer(file);
}
function excelTourImportBox(role){
  const id=role==='admin'?'adminExcelTourImport':'staffExcelTourImport';
  const result=role==='admin'?'adminExcelTourImportResult':'staffExcelTourImportResult';
  const select=role==='admin'?'adminExcelTourTarget':'staffExcelTourTarget';
  return `<section class="excel-tour-import-box">
    <h3>آپلود شیت اکسل تورها</h3>
    <p class="small">فرمت فایل استانبول پشتیبانی می‌شود. اگر فایل چند Sheet داشته باشد، اسم هر Sheet باید اسم همان تور باشد. اگر فقط Sheet با نام TOUR دارد، تور هدف را انتخاب کن.</p>
    <div class="row wrap">
      <select id="${select}" class="field" style="max-width:280px">${staffTours().map(t=>`<option value="${t.id}">${t.title}</option>`).join('')}</select>
      <input id="${id}" class="field" type="file" accept=".xlsx,.xls">
      <button class="btn" onclick="importExcelTourSheet('${id}','${result}','${select}')">آپلود و اعمال شیت</button>
    </div>
    <div id="${result}" class="import-result"></div>
  </section>`;
}


function badges(t){
  const arr=[];
  if(t?.type==='domestic')arr.push('<span class="badge domestic">داخلی</span>');
  if(t?.type==='international')arr.push('<span class="badge international">خارجی</span>');
  if(t?.level)arr.push(`<span class="badge special">${t.level}</span>`);
  if(t?.lastMinute)arr.push('<span class="badge special">ویژه</span>');
  return arr.join(' ');
}
function hotelStars(n){return `<span class="hotel-stars">${Array.from({length:Number(n)||0}).map(()=>'<i class="fa-solid fa-star"></i>').join('')}</span>`}
function defaultSections(){return{description:true,flightInfo:true,dates:true,hotels:true,gallery:true,itinerary:true,docs:true,includes:true,excludes:true,cancellation:true,childPolicy:true,reviews:true}}
function sectionVal(id){return !!$(id)?.checked}
function sectionMap(){
  return {
    visDescription:'description',
    visFlightInfo:'flightInfo',
    visDates:'dates',
    visHotels:'hotels',
    visGallery:'gallery',
    visItinerary:'itinerary',
    visDocs:'docs',
    visIncludes:'includes',
    visExcludes:'excludes',
    visCancellation:'cancellation',
    visChildPolicy:'childPolicy',
    visReviews:'reviews'
  };
}
function setSectionToggles(t){
  const v=Object.assign(defaultSections(),t?.sectionVisibility||{});
  Object.entries(sectionMap()).forEach(([id,key])=>{if($(id))$(id).checked=v[key]!==false});
}
function setAllSectionVisibility(on){
  Object.keys(sectionMap()).forEach(id=>{if($(id))$(id).checked=!!on});
}

function collectSectionVisibility(){
  return {
    description:sectionVal('visDescription'),
    flightInfo:sectionVal('visFlightInfo'),
    dates:sectionVal('visDates'),
    hotels:sectionVal('visHotels'),
    gallery:sectionVal('visGallery'),
    itinerary:sectionVal('visItinerary'),
    docs:sectionVal('visDocs'),
    includes:sectionVal('visIncludes'),
    excludes:sectionVal('visExcludes'),
    cancellation:sectionVal('visCancellation'),
    childPolicy:sectionVal('visChildPolicy'),
    reviews:sectionVal('visReviews')
  };
}

function currentStaffAccount(){
  try{
    const u=currentStaffUser();
    if(!u)return null;
    return staffAccounts().find(a=>a.username===u.username || a.id===u.id) || null;
  }catch(e){return null}
}
function staffTaskNoteHtml(){
  const acc=currentStaffAccount();
  return acc?.taskNote?`<div class="staff-task-note"><b>توضیحات مدیریت برای شما:</b><br>${acc.taskNote}</div>`:'';
}
function initStaff(){
  mount('staff');
  try{
    if(!authGate('staff'))return renderLogin();
    return renderStaff();
  }catch(err){
    console.error('staff panel error',err);
    write('staff_auth',false);
    write('currentStaffUser',null);
    $('app').innerHTML=`<div class="card pad login-box"><h2>ورود پنل فروش</h2><p class="small">پنل فروش به‌روزرسانی شد. برای ورود دوباره دکمه زیر را بزن.</p><button class="btn" style="width:100%" onclick="location.reload()">ورود مجدد</button></div>`;
  }
}
function renderLogin(){$('app').innerHTML=`<div class="card pad login-box"><h2>ورود فروش</h2><p class="small">هر فروش با یوزرنیم و پسورد خودش وارد می‌شود. ورود دمو: فقط رمز staff123</p><input id="user" class="field" placeholder="یوزرنیم" dir="ltr"><input id="pass" class="field" type="password" placeholder="پسورد" dir="ltr"><button class="btn" style="width:100%;margin-top:12px" onclick="doLogin()">ورود</button></div>`}
function doLogin(){if(loginRole('staff',$('pass').value,$('user').value))location.reload();else alert('یوزرنیم یا پسورد اشتباه است')}

function staffTopTabs(){
  return `<div class="staff-top-tabs">
    <a href="#staffToursSection"><i class="fa-solid fa-suitcase-rolling"></i> بخش تورها</a>
    <a href="#staffVisaSection"><i class="fa-solid fa-passport"></i> بخش ویزا و توضیحات</a>
  </div>`;
}
function renderStaffVisaChoice(){
  const id=Number($('staffVisaSelect')?.value||0);
  const v=visaServices().filter(x=>x.active!==false)[id];
  const box=$('staffVisaResult');if(!box)return;
  if(!v){box.innerHTML='<div class="empty-state-mini">ویزایی انتخاب نشده است.</div>';return}
  box.innerHTML=`<div class="staff-visa-selected">
    <b>${v.country||'—'} ${v.city?`- ${v.city}`:''}</b>
    <span>${Number(v.price||0)>0?money(v.price):'بدون هزینه ویزا'}</span>
    <p>مدت زمان: ${v.duration||'—'}</p>
    <p>مدارک: ${v.docs||'—'}</p>
    <button class="soft" onclick="navigator.clipboard?.writeText('${(v.country||'') + ' ' + (v.city||'')} - ${Number(v.price||0)>0?money(v.price):'بدون هزینه ویزا'} - مدارک: ${v.docs||'—'}');showToast('متن ویزا کپی شد')">کپی متن برای مشتری</button>
  </div>`;
}

function airlineLogoHtml(a){
  return a.logo?`<img src="${a.logo}" onerror="this.style.display='none'">`:`<span>${(a.nameFa||a.nameEn||'A').slice(0,1)}</span>`;
}
function airlinePickerHtml(targetId){
  const list=enabledAirlines();
  return `<div class="airline-picker-head"><b>انتخاب ایرلاین</b><input class="field" id="airlineSearch_${targetId}" placeholder="جستجو..." oninput="filterAirlinePicker('${targetId}')"></div>
  <div class="airline-picker-list">${list.map(a=>`<button type="button" class="airline-picker-card" data-name="${(a.nameFa+' '+a.nameEn+' '+a.code).toLowerCase()}" onclick="selectAirline('${targetId}','${a.id}')">
    <div class="airline-logo-mini">${airlineLogoHtml(a)}</div>
    <div><b>${a.nameFa}</b><small dir="ltr">${a.nameEn||'—'} ${a.code?`| ${a.code}`:''}</small></div>
  </button>`).join('')||'<div class="empty-state-mini">مدیر هنوز ایرلاینی را برای فروش فعال نکرده است.</div>'}</div>`;
}
function toggleAirlinePicker(targetId){
  document.querySelectorAll('.airline-picker-panel').forEach(x=>{if(x.id!=='airlinePicker_'+targetId)x.classList.remove('on')});
  const box=$('airlinePicker_'+targetId);if(!box)return;
  if(!box.innerHTML.trim())box.innerHTML=airlinePickerHtml(targetId);
  box.classList.toggle('on');
}
function filterAirlinePicker(targetId){
  const q=($('airlineSearch_'+targetId)?.value||'').toLowerCase();
  document.querySelectorAll(`#airlinePicker_${targetId} .airline-picker-card`).forEach(card=>{
    card.style.display=card.dataset.name.includes(q)?'grid':'none';
  });
}
function selectAirline(targetId,id){
  const a=airlineCatalog().find(x=>x.id===id);if(!a)return;
  if($(targetId))$(targetId).value=airlineDisplayName(a);
  const box=$('airlinePicker_'+targetId);if(box)box.classList.remove('on');
  showToast('ایرلاین انتخاب شد');
}

function staffVisaInfoBox(){
  const list=visaServices().filter(v=>v.active!==false);
  return `<section id="staffVisaSection" class="card pad staff-section-panel">
    <div class="row wrap"><div><span class="badge international">بخش ویزا</span><h3>انتخاب ویزا برای مشتری</h3><p class="small">فروش می‌تواند با انتخاب گزینه ویزا، قیمت، مدارک و توضیحات را سریع ببیند و برای مشتری ارسال کند.</p></div></div>
    <div class="staff-visa-select-box">
      <select id="staffVisaSelect" class="field" onchange="renderStaffVisaChoice()">
        <option value="">انتخاب ویزا</option>
        ${list.map((v,i)=>`<option value="${i}">${v.country||'—'} ${v.city?`- ${v.city}`:''}</option>`).join('')}
      </select>
      <button class="soft" onclick="renderStaffVisaChoice()">نمایش توضیحات ویزا</button>
    </div>
    <div id="staffVisaResult" class="staff-visa-result"><div class="empty-state-mini">یک ویزا را انتخاب کن.</div></div>
    <div class="staff-visa-grid">${list.map(v=>`<div class="staff-visa-card">
      <b>${v.country||'—'} ${v.city?`- ${v.city}`:''}</b>
      <span>${Number(v.price||0)>0?money(v.price):'بدون هزینه ویزا'}</span>
      <small>${v.duration||'—'}</small>
      <p>مدارک: ${v.docs||'—'}</p>
    </div>`).join('')||'<div class="empty-state-mini">هنوز ویزایی در مدیریت فعال نشده است.</div>'}</div>
  </section>`;
}



function staffHotelCatalogBox(){
  const active=hotelCatalog().filter(h=>h.enabledForStaff!==false);
  const groups=active.reduce((acc,h)=>{const d=h.destination||h.dest||'عمومی';(acc[d]||(acc[d]=[])).push(h);return acc},{});
  return `<section id="staffHotelCatalogSection" class="card pad staff-section-panel">
    <div class="row wrap">
      <div><span class="badge international">بانک هتل‌های فعال</span><h3>هتل‌ها و پکیج‌هایی که مدیریت برای فروش فعال کرده</h3><p class="small">این لیست فقط مواردی را نشان می‌دهد که مدیر از پنل مدیریت فعال کرده است.</p></div>
    </div>
    ${Object.keys(groups).length?Object.entries(groups).map(([d,rows])=>`<div class="staff-hotel-destination"><h4>${d} <small>${faNum(rows.length)} مورد</small></h4><div class="staff-hotel-grid">${rows.slice(0,80).map(h=>`<div class="staff-hotel-card"><b dir="ltr">${h.nameLatin}</b><span>${typeof hotelStars==='function'?hotelStars(h.star):'★'.repeat(Number(h.star)||3)} ${h.meal?`<em>${h.meal}</em>`:''}</span><small>${h.sourceGroup||'—'}${h.catalogType==='combo'?' | پکیج ترکیبی':''}</small>${h.dblPrice?`<small>دو تخته: ${h.dblPrice} | یک تخته: ${h.sglPrice||'—'} | کودک: ${h.childPrice||'—'}</small>`:''}</div>`).join('')}</div></div>`).join(''):'<div class="empty-state-mini">هنوز مدیر هتلی را برای نمایش در پنل فروش فعال نکرده است.</div>'}
  </section>`;
}

function staffDebugBox(){
  return `<section class="card pad staff-debug-box">
    <div class="row wrap">
      <div>
        <span class="badge special">Debug</span>
        <h3>ابزار دیباگ پنل کارشناس</h3>
        <p class="small">اگر تورها ذخیره نشدند یا نمایش داده نشدند، از این ابزارها استفاده کن.</p>
      </div>
      <button class="soft" onclick="staffRepairData()">Repair Data</button>
      <button class="soft" onclick="staffClearCacheHint()">راهنمای پاک کردن کش</button>
    </div>
    <div id="staffDebugResult" class="small" style="margin-top:8px"></div>
  </section>`;
}
function staffRepairData(){
  try{
    repairAppData();
    renderStaff();
    showToast('دیتای تورها بررسی و تعمیر شد');
  }catch(e){
    console.error(e);
    alert('خطا در تعمیر دیتا: '+(e?.message||e));
  }
}
function staffClearCacheHint(){
  alert('بعد از آپلود نسخه جدید در Vercel، روی صفحه Ctrl + F5 بزن. اگر هنوز نسخه قدیمی بود، از DevTools > Application > Service Workers گزینه Unregister را بزن.');
}

function renderStaff(){
  try{
  const q=$('staffSearch')?.value?.trim().toLowerCase()||'', user=currentStaffUser();
  let list=staffTours();if(q)list=list.filter(t=>t.title.toLowerCase().includes(q)||t.dest.toLowerCase().includes(q));
  $('app').innerHTML=`<div class="card pad row wrap" style="margin-top:22px"><div><span class="badge special">پنل فروش</span><h1>مدیریت تورها</h1><p class="small">وارد شده با: <b>${user?.name||user?.username||'فروش'}</b></p>${staffTaskNoteHtml()}</div><div class="actions"><button class="soft" onclick="logoutRole('staff')">خروج</button><button class="btn" onclick="openForm()">افزودن تور</button></div></div>
  ${staffTopTabs()}${supabasePanel()}${staffDebugBox()}
  ${staffVisaInfoBox()}
  <section id="staffToursSection" class="staff-section-panel">
    <div class="section-title-row"><span class="badge domestic">بخش تورها</span><h3>مدیریت تورها و قیمت‌ها</h3></div>
    ${priceImportBox()}${batchPriceBox()}
    <div class="card pad" style="margin:16px 0"><input id="staffSearch" class="field" placeholder="جستجو..." oninput="renderStaff()" value="${q}"></div>
    <div class="card table-wrap"><table><thead><tr><th>عکس</th><th>عنوان</th><th>مقصد</th><th>قیمت شروع</th><th>ظرفیت</th><th>وضعیت</th><th>آخرین ویرایش</th><th>عملیات</th></tr></thead><tbody>${list.map(t=>`<tr><td><img src="${t.img}" style="width:55px;height:55px;object-fit:cover;border-radius:12px"></td><td class="staff-tour-title-cell">
  <b>${t.title}</b><br>
  <small>${badges(t)}</small>
  <div class="staff-inline-actions">
    <button class="btn staff-edit-main" onclick="openForm(${t.id})"><i class="fa-regular fa-pen-to-square"></i> ویرایش تور</button>
  </div>
</td><td>${t.dest}</td><td>${money(minHotel(t).price)}</td><td>${faNum(totalCapacity(t))}</td><td>${t.status}</td><td><span class="last-edited">${t.lastEditedBy||'—'}<br>${t.lastEditedAt?new Date(t.lastEditedAt).toLocaleString('fa-IR'):''}</span></td><td class="staff-actions-cell">
      <button class="btn staff-edit-op" onclick="openForm(${t.id})"><i class="fa-regular fa-pen-to-square"></i> ویرایش تور</button>
      <button class="danger" onclick="delTour(${t.id})"><i class="fa-regular fa-trash-can"></i> حذف</button>
    </td></tr>`).join('')}</tbody></table></div>
    <div class="staff-edit-card-list">${list.map(t=>`<div class="staff-edit-card">
      <img src="${t.img||DEFAULT_IMG}" alt="">
      <div>
        <b>${t.title}</b>
        <small>${t.dest} | ${money(minHotel(t).price)}</small>
      </div>
      <button class="btn" onclick="openForm(${t.id})"><i class="fa-regular fa-pen-to-square"></i> ویرایش تور</button>
    </div>`).join('')}</div>
  </section>`;

  }catch(err){console.error('renderStaff error',err);$('app').innerHTML=`<div class="card pad login-box"><h2>خطای پنل فروش</h2><p class="small">یک خطا در نمایش پنل پیش آمد. یک بار خروج/ورود کن یا کش مرورگر را پاک کن.</p><pre style="direction:ltr;text-align:left;white-space:pre-wrap;background:var(--bg);padding:10px;border-radius:12px;max-height:160px;overflow:auto">${err.message||err}</pre><button class="btn" onclick="logoutRole('staff')">خروج و ورود دوباره</button></div>`}
}

function priceImportBox(){
  return `<section class="price-import-box"><h3>آپدیت قیمت با شیت</h3><p class="small">فایل CSV خروجی گرفته‌شده از شیت نمونه را آپلود کن تا قیمت‌ها و ظرفیت‌ها آپدیت شوند.</p><input id="staffPriceImport" class="field" type="file" accept=".csv,.txt"><button class="btn" style="margin-top:10px" onclick="importPriceSheet('staffPriceImport','staffImportResult')">آپلود و آپدیت قیمت‌ها</button><div id="staffImportResult" class="import-result"></div></section>${excelTourImportBox('staff')}`;
}

function parseCSV(text){
  const rows=[];let row=[],cur='',q=false;
  for(let i=0;i<text.length;i++){
    const c=text[i],n=text[i+1];
    if(c==='"'&&q&&n==='"'){cur+='"';i++;continue}
    if(c==='"'){q=!q;continue}
    if(c===','&&!q){row.push(cur);cur='';continue}
    if((c==='\n'||c==='\r')&&!q){if(cur!==''||row.length){row.push(cur);rows.push(row);row=[];cur=''};if(c==='\r'&&n==='\n')i++;continue}
    cur+=c;
  }
  if(cur!==''||row.length){row.push(cur);rows.push(row)}
  return rows.filter(r=>r.some(x=>String(x).trim()!==''));
}
function normalizeHeader(h){return String(h||'').trim().toLowerCase().replace(/\s+/g,'_')}

function headerAliases(){
  return {
    tour_id:['tour_id','آیدی_تور','کد_تور','شناسه_تور'],
    tour_title:['tour_title','نام_تور','عنوان_تور'],
    hotel_star:['hotel_star','ستاره_هتل','درجه_هتل'],
    hotel_name_latin:['hotel_name_latin','نام_لاتین_هتل','اسم_لاتین_هتل','نام_هتل'],
    price:['price','قیمت','قیمت_جدید'],
    capacity:['capacity','ظرفیت'],
    show_in_buyer:['show_in_buyer','نمایش_در_خریدار','نمایش'],
    special_old_price:['special_old_price','مبلغ_قبل_تخفیف','قیمت_قبل'],
    special_new_price:['special_new_price','مبلغ_بعد_تخفیف','قیمت_بعد'],
    special_discount_percent:['special_discount_percent','درصد_تخفیف'],
    special_end_jalali:['special_end_jalali','تاریخ_پایان_تخفیف_شمسی','پایان_تخفیف_شمسی'],
    note:['note','یادداشت']
  };
}
function headerIndex(headers,key){const aliases=headerAliases()[key]||[key];for(const a of aliases){const i=headers.indexOf(normalizeHeader(a));if(i>=0)return i}return -1}
function cellByKey(row,headers,key){const i=headerIndex(headers,key);return i>=0?row[i]:''}

function importPriceSheet(inputId,resultId){
  const file=$(inputId)?.files?.[0];if(!file){alert('فایل CSV را انتخاب کنید');return}
  const reader=new FileReader();
  reader.onload=()=>{
    const rows=parseCSV(reader.result);
    if(rows.length<2){$(resultId).textContent='فایل خالی است.';return}
    const headers=rows[0].map(normalizeHeader),idx=k=>headers.indexOf(k);
    let updated=0,notFound=0;const user=currentStaffUser();const ts=tours();
    rows.slice(1).forEach(r=>{
      const tourId=Number(cellByKey(r,headers,'tour_id')||0),hotelName=String(cellByKey(r,headers,'hotel_name_latin')||'').trim(),star=Number(cellByKey(r,headers,'hotel_star')||0);
      const price=Number(cellByKey(r,headers,'price')||0),cap=Number(cellByKey(r,headers,'capacity')||0),showRaw=String(cellByKey(r,headers,'show_in_buyer')||'TRUE').toLowerCase();
      const oldPrice=Number(cellByKey(r,headers,'special_old_price')||0),newPrice=Number(cellByKey(r,headers,'special_new_price')||0),pct=Number(cellByKey(r,headers,'special_discount_percent')||0),endFa=String(cellByKey(r,headers,'special_end_jalali')||'').trim();
      const t=ts.find(x=>x.id===tourId);if(!t){notFound++;return}
      if(oldPrice)t.oldPrice=oldPrice;if(newPrice)t.newPrice=newPrice;if(pct)t.dealPercent=pct;if(endFa){t.dealEndsAtFa=endFa;const g=parseFaDiscountDate(endFa);if(g)t.dealEndsAt=g.toISOString()}
      const h=(t.hotels||[]).find(x=>String(x.name).trim().toLowerCase()===hotelName.toLowerCase()&&Number(x.star)===star);
      if(h){if(price)h.price=price;if(cap>=0)h.capacity=cap;h.showInBuyer=!(showRaw==='false'||showRaw==='0'||showRaw==='no'||showRaw==='غیرفعال');t.lastEditedBy=user?.name||user?.username||'فروش';t.lastEditedAt=new Date().toISOString();updated++}else notFound++;
    });
    saveTours(ts);$(resultId).textContent=`${faNum(updated)} ردیف آپدیت شد. ${faNum(notFound)} ردیف پیدا نشد.`;renderStaff();
  };
  reader.readAsText(file,'utf-8');
}
function parseFaDiscountDate(input){
  const en=String(input||'').replace(/[۰-۹]/g,d=>'۰۱۲۳۴۵۶۷۸۹'.indexOf(d)).replace(/[٠-٩]/g,d=>'٠١٢٣٤٥٦٧٨٩'.indexOf(d));
  const m=en.match(/(\d{4})[\/\-](\d{1,2})[\/\-](\d{1,2})(?:\s+(\d{1,2}):(\d{1,2}))?/);
  if(!m)return null;
  const jy=+m[1],jm=+m[2],jd=+m[3],hh=+(m[4]||23),mm=+(m[5]||59);
  const g=jalaliToGregorian(jy,jm,jd);return new Date(g.gy,g.gm-1,g.gd,hh,mm,0);
}
function jalaliToGregorian(jy,jm,jd){jy-=979;let days=365*jy+Math.floor(jy/33)*8+Math.floor(((jy%33)+3)/4)+78+jd+(jm<7?(jm-1)*31:((jm-7)*30+186));let gy=1600+400*Math.floor(days/146097);days%=146097;if(days>36524){gy+=100*Math.floor(--days/36524);days%=36524;if(days>=365)days++}gy+=4*Math.floor(days/1461);days%=1461;if(days>365){gy+=Math.floor((days-1)/365);days=(days-1)%365}const gd=days+1,sal=[0,31,((gy%4===0&&gy%100!==0)||gy%400===0)?29:28,31,30,31,30,31,31,30,31,30,31];let gm=1,d=gd;for(;gm<=12&&d>sal[gm];gm++)d-=sal[gm];return{gy,gm,gd:d}}

function batchPriceBox(){
  const ts=tours();
  return `<section class="batch-box batch-box-clean">
    <div class="batch-head">
      <div>
        <h3>آپدیت گروهی قیمت هتل‌ها</h3>
        <p class="small">تورهای موردنظر، ستاره هتل و مبلغ افزایش قیمت را انتخاب کن.</p>
      </div>
      <button class="soft" type="button" onclick="toggleAllBatchTours(true)">انتخاب همه</button>
    </div>
    <div class="batch-clean-grid">
      <div>
        <label class="label">انتخاب تورها</label>
        <div class="batch-tour-list" id="batchTourList">
          ${ts.map(t=>`<label class="batch-tour-item"><input type="checkbox" class="batch-tour-check" value="${t.id}"><span>${t.title}</span></label>`).join('')}
        </div>
      </div>
      <div>
        <label class="label">هتل‌ها</label>
        <div class="batch-options clean-options">
          <label><input type="checkbox" id="batchStar3" checked> ۳ ستاره</label>
          <label><input type="checkbox" id="batchStar4" checked> ۴ ستاره</label>
          <label><input type="checkbox" id="batchStar5" checked> ۵ ستاره</label>
        </div>
      </div>
      <div>
        <label class="label">مبلغ افزایش برای هر نفر</label>
        <input id="batchAmount" class="field" type="number" placeholder="مثلاً 500000">
        <button class="btn" style="width:100%;margin-top:10px" onclick="batchUpdatePrices()">اعمال افزایش قیمت</button>
      </div>
    </div>
  </section>`;
}
function toggleAllBatchTours(state){
  document.querySelectorAll('.batch-tour-check').forEach(x=>x.checked=state);
}
function batchUpdatePrices(){
  const ids=[...document.querySelectorAll('.batch-tour-check:checked')].map(o=>Number(o.value));
  const amount=Number($('batchAmount').value)||0;
  const stars=[3,4,5].filter(s=>$('batchStar'+s)?.checked);
  if(!ids.length||!amount||!stars.length){alert('تور، ستاره و مبلغ را انتخاب کنید');return}
  const user=currentStaffUser();
  const ts=staffTours().map(t=>ids.includes(t.id)?{...t,hotels:(t.hotels||[]).map(h=>stars.includes(Number(h.star))?{...h,price:Number(h.price||0)+amount}:h),lastEditedBy:user?.name||user?.username||'فروش',lastEditedAt:new Date().toISOString()}:t);
  saveTours(ts);showToast('قیمت‌ها آپدیت شد');renderStaff();
}
function staffSortHotelsByCapacity(list){
  return (Array.isArray(list)?list:[]).slice().sort((a,b)=>{
    const av=Number(a?.capacity||0)>0,bv=Number(b?.capacity||0)>0;
    if(av!==bv)return av?-1:1;
    const cap=Number(b?.capacity||0)-Number(a?.capacity||0);
    if(cap)return cap;
    return Number(a?.price||0)-Number(b?.price||0);
  });
}
function catalogForStar(star,dest=''){
  const d=String(dest||'').trim();
  const base=hotelCatalog().filter(h=>Number(h.star)===Number(star)&&h.enabledForStaff!==false);
  let list=base.filter(h=>{
    const hd=String(h.destination||h.dest||'').trim();
    return !d||!hd||hd==='عمومی'||d.includes(hd)||hd.includes(d);
  });
  if(!list.length)list=base.filter(h=>!h.destination||h.destination==='عمومی');
  const padded=[...list];
  for(let i=padded.length;i<5;i++)padded.push({id:`custom-${star}-${i+1}`,star,nameLatin:`Hotel ${star} Star ${i+1}`,enabledForStaff:true,custom:true});
  return padded.slice(0,8);
}

function staffHotelPhotos(h){
  return [...new Set([h?.image||h?.img||'',...((h?.photos||h?.images||[]).filter(Boolean))].filter(Boolean))].slice(0,12);
}
function staffHotelImage(h){return staffHotelPhotos(h)[0]||'../assets/images/hotel-placeholder.svg'}
function toggleHotelPicker(star){
  const el=$('hotelPicker_'+star);
  if(el)el.classList.toggle('on');
}
function catalogPickerHtml(star,dest){
  const d=String(dest||'').trim();
  let list=hotelCatalog().filter(h=>Number(h.star)===Number(star)&&h.enabledForStaff!==false);
  const matched=list.filter(h=>{
    const hd=String(h.destination||h.dest||'').trim();
    return !d||!hd||hd==='عمومی'||d.includes(hd)||hd.includes(d);
  });
  if(matched.length)list=matched;
  return `<div id="hotelPicker_${star}" class="staff-hotel-picker">
    <div class="staff-hotel-picker-head">
      <b>انتخاب هتل ${hotelStars(star)} از بانک مدیریت</b>
      <input id="hotelPickerSearch_${star}" class="field" placeholder="جستجوی هتل..." oninput="filterHotelPicker(${star})">
    </div>
    <div id="hotelPickerList_${star}" class="staff-hotel-picker-list">${list.map(h=>pickerHotelCard(star,h)).join('')||'<div class="empty-state-mini">مدیر هنوز هتلی برای این ستاره و مقصد فعال نکرده است.</div>'}</div>
  </div>`;
}
function pickerHotelCard(star,h){
  const photos=staffHotelPhotos(h);
  return `<button type="button" class="staff-hotel-picker-card staff-controlled-picker-card" data-name="${String(h.nameLatin||'').toLowerCase()}" onclick="selectCatalogHotelForTour(${star},'${h.id}')">
    <img src="${staffHotelImage(h)}" onerror="this.src='../assets/images/hotel-placeholder.svg'">
    <span>
      <b dir="ltr">${h.nameLatin}</b>
      <small>${h.meal||h.board||'سرویس ثبت نشده'} | ${h.destination||'—'}</small>
      <small>${faNum(photos.length)} عکس ثبت‌شده</small>
    </span>
  </button>`;
}
function filterHotelPicker(star){
  const q=($('hotelPickerSearch_'+star)?.value||'').toLowerCase();
  document.querySelectorAll(`#hotelPickerList_${star} .staff-hotel-picker-card`).forEach(card=>{
    card.style.display=card.dataset.name.includes(q)?'grid':'none';
  });
}
function selectCatalogHotelForTour(star,id){
  const h=hotelCatalog().find(x=>x.id===id);if(!h)return;
  let row=-1;
  for(let i=0;i<8;i++){
    const hid=$(`hotel_${star}_${i}_id`)?.value||'';
    const name=$(`hotel_${star}_${i}_name`)?.value||'';
    if(!hid||hid.startsWith('custom-')||!name||/^Hotel\s+\d/.test(name)){row=i;break;}
  }
  if(row<0)row=0;
  if($(`hotel_${star}_${row}_id`))$(`hotel_${star}_${row}_id`).value=h.id;
  if($(`hotel_${star}_${row}_name`))$(`hotel_${star}_${row}_name`).value=h.nameLatin;
  const nameBox=document.querySelector(`#hotelRow_${star}_${row} .hotel-name-latin`);
  if(nameBox)nameBox.innerHTML=`${h.nameLatin}<small>${h.destination||''} ${h.meal?`| ${h.meal}`:''}</small>`;
  const img=document.querySelector(`#hotelRow_${star}_${row} .hotel-row-thumb`);
  if(img)img.src=staffHotelImage(h);
  if($(`hotel_${star}_${row}_price`)&&!$(`hotel_${star}_${row}_price`).value)$(`hotel_${star}_${row}_price`).value=Number(String(h.dblPrice||'').replace(/[^\d]/g,''))||'';
  if($(`hotel_${star}_${row}_show`))$(`hotel_${star}_${row}_show`).checked=true;
  const photosBox=document.querySelector(`#hotelRow_${star}_${row} .hotel-row-photos`);
  if(photosBox)photosBox.innerHTML=staffHotelPhotos(h).slice(0,4).map(x=>`<img src="${x}">`).join('');
  showToast('هتل انتخاب شد');
}

function renderHotelEditor(t){
  const box=$('hotelEditor');if(!box)return;
  box.innerHTML=[3,4,5].map(star=>{
    const catalog=catalogForStar(star,t?.dest||'');
    const existing=staffSortHotelsByCapacity((t?.hotels||[]).filter(h=>Number(h.star)===star));
    const rows=[];
    for(let i=0;i<8;i++){
      const c=catalog[i]||{id:`custom-${star}-${i+1}`,star,nameLatin:`Hotel ${star} Star ${i+1}`,enabledForStaff:true,custom:true};
      const ex=existing.find(h=>h.hotelId===c.id)||existing[i]||{};
      const rowHotel=ex.hotelId?hotelCatalog().find(h=>h.id===ex.hotelId):c;
      const show=ex.showInBuyer!==false;
      const photos=staffHotelPhotos(rowHotel||c);
      const full=!!ex.name && Number(ex.capacity||0)<=0;
      rows.push(`<div id="hotelRow_${star}_${i}" class="hotel-edit-row hotel-edit-row-with-picker ${full?'hotel-row-full':'hotel-row-available'}">
        <img class="hotel-row-thumb" src="${staffHotelImage(rowHotel||c)}" onerror="this.src='../assets/images/hotel-placeholder.svg'">
        <div>
          <input type="hidden" id="hotel_${star}_${i}_id" value="${ex.hotelId||c.id}">
          <input type="hidden" id="hotel_${star}_${i}_name" value="${ex.name||c.nameLatin}">
          <div class="hotel-name-latin">${ex.name||c.nameLatin}<small>${(rowHotel?.destination||c.destination||'')} ${(rowHotel?.meal||c.meal)?`| ${rowHotel?.meal||c.meal}`:''}</small></div>
          <div class="hotel-row-photos">${photos.slice(0,4).map(x=>`<img src="${x}">`).join('')}</div>
        </div>
        <input id="hotel_${star}_${i}_price" class="field" type="number" placeholder="قیمت" value="${ex.price||''}">
        <input id="hotel_${star}_${i}_cap" class="field" type="number" placeholder="ظرفیت" value="${ex.capacity||''}">
        <label class="row" style="justify-content:flex-start"><input id="hotel_${star}_${i}_show" type="checkbox" ${show?'checked':''}> نمایش</label><span class="capacity-state ${full?'full':'ok'}">${full?'تکمیل ظرفیت':'ظرفیت دارد'}</span>
      </div>`);
    }
    return `<div class="hotel-editor-star">
      <div class="row wrap">
        <h4>هتل‌های ${hotelStars(star)} <small class="small">از بانک مدیریت انتخاب کن، سپس قیمت و ظرفیت بده.</small></h4>
        <button type="button" class="btn" onclick="toggleHotelPicker(${star})">انتخاب هتل</button>
      </div>
      ${catalogPickerHtml(star,t?.dest||'')}
      ${rows.join('')}
    </div>`;
  }).join('');
}
function collectHotels(basePrice){
  const out=[];
  [3,4,5].forEach(star=>{
    for(let i=0;i<8;i++){
      const id=$(`hotel_${star}_${i}_id`)?.value;
      const name=$(`hotel_${star}_${i}_name`)?.value;
      const price=Number($(`hotel_${star}_${i}_price`)?.value)||basePrice;
      const capacity=Number($(`hotel_${star}_${i}_cap`)?.value)||0;
      const show=$(`hotel_${star}_${i}_show`)?.checked;
      if(id&&name){
        const cat=hotelCatalog().find(h=>h.id===id)||{};
        out.push({hotelId:id,star,name,price,capacity,showInBuyer:!!show,photos:staffHotelPhotos(cat),meal:cat.meal||cat.board||'',bookingLink:cat.bookingLink||''});
      }
    }
  });
  return staffSortHotelsByCapacity(out);
}
function openForm(id){
  const t=id?findTour(id):null;$('modal').classList.add('on');setTimeout(()=>{document.querySelector('.staff-edit-modal-card')?.scrollTo({top:0,behavior:'smooth'});$('modal')?.scrollTo({top:0,behavior:'smooth'});},30);$('formTitle').textContent=t?'ویرایش تور':'افزودن تور';$('tid').value=t?.id||'';
  ['title','dest','duration','airline','returnAirline','flightTime','returnFlightTime','price','dates','desc','itinerary','docs','includes','excludes','cancel','child','oldPrice','newPrice','dealPercent','dealEndsAtFa'].forEach(x=>{if($(x))$(x).value=''});
  if(t){
    $('title').value=t.title;$('dest').value=t.dest;$('duration').value=t.duration;$('airline').value=t.airline||'';$('returnAirline').value=t.returnAirline||t.airline||'';$('flightTime').value=t.flightTime||'';$('returnFlightTime').value=t.returnFlightTime||t.landingTime||'';$('price').value=t.price;$('dates').value=(t.dates||[]).join('\n');$('desc').value=t.desc||'';$('itinerary').value=(t.itinerary||[]).join('\n');$('docs').value=(t.docs||[]).join('\n');$('includes').value=(t.includes||[]).join('\n');$('excludes').value=(t.excludes||[]).join('\n');$('cancel').value=t.cancellation||'';$('child').value=t.childPolicy||'';$('type').value=t.type;$('level').value=t.level||'';$('status').value=t.status;$('lastMinute').checked=!!t.lastMinute;$('oldPrice').value=t.oldPrice||'';$('newPrice').value=t.newPrice||'';$('dealPercent').value=t.dealPercent||0;$('dealEndsAtFa').value=t.dealEndsAtFa||'';renderHotelEditor(t);setSectionToggles(t)
  }else{
    $('type').value='international';$('level').value='special';$('status').value='active';$('lastMinute').checked=false;$('oldPrice').value='';$('newPrice').value='';$('dealPercent').value=10;$('dealEndsAtFa').value='۱۴۰۵/۰۵/۳۰ ۲۳:۵۹';renderHotelEditor(null);setSectionToggles(null)
  }
}
function closeForm(){$('modal').classList.remove('on');document.body.style.overflow=''}
function saveTour(e){
  e.preventDefault();
  try{
    const title=$('title')?.value?.trim()||'',dest=$('dest')?.value?.trim()||'',duration=$('duration')?.value?.trim()||'',airline=$('airline')?.value?.trim()||'',price=Number($('price')?.value)||0;
    if(!title||!dest||!duration||!airline||!price)return alert('لطفاً عنوان، مقصد، مدت، ایرلاین و قیمت را کامل وارد کنید');
    const ts=tours(), id=$('tid')?.value?Number($('tid').value):Date.now(), type=$('type')?.value||'international', level=$('level')?.value||'', cats=[type], user=currentStaffUser();
    if(level)cats.push(level);
    const oldTour=findTour(id), special=!!$('lastMinute')?.checked, parsedEnd=parseFaDiscountDate($('dealEndsAtFa')?.value||'');
    let hotelList=collectHotels(price);
    if(!hotelList.length)hotelList=[
      {star:3,name:'هتل سه ستاره پیشنهادی',price:price,capacity:10,showInBuyer:true},
      {star:4,name:'هتل چهار ستاره پیشنهادی',price:Math.round(price*1.25),capacity:8,showInBuyer:true},
      {star:5,name:'هتل پنج ستاره پیشنهادی',price:Math.round(price*1.55),capacity:5,showInBuyer:true}
    ];
    const imageForTour=oldTour?.img||themedTourImage({dest,title})||DEFAULT_IMG;
    const data={id,title,dest,duration:normalizeDurationNightFirst(duration),airline,returnAirline:$('returnAirline')?.value||airline,flightTime:$('flightTime')?.value||'۰۸:۳۰',returnFlightTime:$('returnFlightTime')?.value||'',price,label:special?'ویژه':'',type,level,categories:cats,rating:oldTour?.rating||4.5,status:$('status')?.value||'active',lastMinute:special,oldPrice:Number($('oldPrice')?.value)||0,newPrice:Number($('newPrice')?.value)||0,dealPercent:special?(Number($('dealPercent')?.value)||0):0,dealEndsAtFa:$('dealEndsAtFa')?.value||'',dealEndsAt:parsedEnd?parsedEnd.toISOString():new Date(Date.now()+24*3600000).toISOString(),img:imageForTour,gallery:oldTour?.gallery?.length?oldTour.gallery:[imageForTour],dates:($('dates')?.value||'').split('\n').map(x=>x.trim()).filter(Boolean),hotels:hotelList,desc:$('desc')?.value||'تور ثبت شده توسط فروش.',includes:($('includes')?.value||'ترانسفر\nبیمه\nصبحانه').split('\n').map(x=>x.trim()).filter(Boolean),excludes:($('excludes')?.value||'').split('\n').map(x=>x.trim()).filter(Boolean),itinerary:($('itinerary')?.value||'').split('\n').map(x=>x.trim()).filter(Boolean),docs:($('docs')?.value||'').split('\n').map(x=>x.trim()).filter(Boolean),cancellation:$('cancel')?.value||'طبق قوانین چارتر و هتل.',childPolicy:$('child')?.value||'نرخ کودک طبق سن محاسبه می‌شود.',sectionVisibility:collectSectionVisibility(),reviews:oldTour?.reviews||[],lastEditedBy:user?.name||user?.username||'فروش',lastEditedAt:new Date().toISOString()};
    if(!data.dates.length)data.dates=['۱۴۰۵/۰۴/۱۵','۱۴۰۵/۰۴/۲۲','۱۴۰۵/۰۵/۰۱'];
    const i=ts.findIndex(x=>Number(x.id)===Number(id)); if(i>=0)ts[i]=data; else ts.push(data);
    if(!saveTours(ts))return;
    closeForm();renderStaff();showToast('تور ذخیره شد');
  }catch(err){
    console.error('saveTour debug stable failed',err);
    alert('خطا در ذخیره تور: '+(err?.message||err));
  }
}

function delTour(id){if(confirm('تور حذف شود؟')){saveTours(staffTours().filter(t=>t.id!==id));renderStaff()}}
document.addEventListener('DOMContentLoaded',initStaff);
