function adminHotelStarsFallback(n){return typeof hotelStars==='function'?hotelStars(n):'★'.repeat(Number(n)||0)}

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
  const ts=tours().map(t=>{
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
  return `${supabasePanel()}<section class="excel-tour-import-box">
    <h3>آپلود شیت اکسل تورها</h3>
    <p class="small">فرمت فایل استانبول پشتیبانی می‌شود. اگر فایل چند Sheet داشته باشد، اسم هر Sheet باید اسم همان تور باشد. اگر فقط Sheet با نام TOUR دارد، تور هدف را انتخاب کن.</p>
    <div class="row wrap">
      <select id="${select}" class="field" style="max-width:280px">${tours().map(t=>`<option value="${t.id}">${t.title}</option>`).join('')}</select>
      <input id="${id}" class="field" type="file" accept=".xlsx,.xls">
      <button class="btn" onclick="importExcelTourSheet('${id}','${result}','${select}')">آپلود و اعمال شیت</button>
    </div>
    <div id="${result}" class="import-result"></div>
  </section>`;
}


function initAdmin(){mount('admin');if(!authGate('admin'))return renderLogin();try{runDailySourceImportsIfNeeded()}catch(e){console.warn('daily source import failed',e)}renderAdmin()}
function renderLogin(){$('app').innerHTML=`<div class="card pad login-box"><h2>ورود مدیریت</h2><div class="form-note-required">موارد ستاره‌دار الزامی هستند <span class="req-star">*</span></div><p class="small">رمز دمو: admin123</p><input id="pass" class="field" type="password" placeholder="رمز *"><button class="btn" style="width:100%;margin-top:12px" onclick="doLogin()">ورود</button></div>`}
function doLogin(){if(loginRole('admin',$('pass').value))location.reload();else alert('رمز اشتباه است')}


function adminBatchPriceBox(){
  const ts=tours();
  return `<section class="batch-box batch-box-clean admin-batch-box">
    <div class="batch-head">
      <div>
        <h3>آپدیت گروهی قیمت هتل‌ها</h3>
        <p class="small">در مدیریت هم می‌توانی چند تور را انتخاب کنی و قیمت هتل‌های ۳، ۴ یا ۵ ستاره را یکجا افزایش بدهی.</p>
      </div>
      <div class="row wrap">
        <button class="soft" type="button" onclick="adminToggleAllBatchTours(true)">انتخاب همه</button>
        <button class="soft" type="button" onclick="adminToggleAllBatchTours(false)">لغو انتخاب</button>
      </div>
    </div>
    <div class="batch-clean-grid">
      <div>
        <label class="label">انتخاب تورها</label>
        <div class="batch-tour-list" id="adminBatchTourList">
          ${ts.map(t=>`<label class="batch-tour-item"><input type="checkbox" class="admin-batch-tour-check" value="${t.id}"><span>${t.title}</span></label>`).join('')}
        </div>
      </div>
      <div>
        <label class="label">هتل‌ها</label>
        <div class="batch-options clean-options">
          <label><input type="checkbox" id="adminBatchStar3" checked> ۳ ستاره</label>
          <label><input type="checkbox" id="adminBatchStar4" checked> ۴ ستاره</label>
          <label><input type="checkbox" id="adminBatchStar5" checked> ۵ ستاره</label>
        </div>
      </div>
      <div>
        <label class="label">مبلغ افزایش برای هر نفر</label>
        <input id="adminBatchAmount" class="field" type="number" placeholder="مثلاً 500000">
        <button class="btn" style="width:100%;margin-top:10px" onclick="adminBatchUpdatePrices()">اعمال افزایش قیمت</button>
      </div>
    </div>
    <div id="adminBatchResult" class="import-result"></div>
  </section>`;
}
function adminToggleAllBatchTours(state){
  document.querySelectorAll('.admin-batch-tour-check').forEach(x=>x.checked=state);
}
function adminBatchUpdatePrices(){
  const ids=[...document.querySelectorAll('.admin-batch-tour-check:checked')].map(o=>Number(o.value));
  const amount=Number($('adminBatchAmount').value)||0;
  const stars=[3,4,5].filter(s=>$('adminBatchStar'+s)?.checked);
  if(!ids.length||!amount||!stars.length){alert('تور، ستاره و مبلغ را انتخاب کنید');return}
  const ts=tours().map(t=>ids.includes(t.id)?{...t,hotels:(t.hotels||[]).map(h=>stars.includes(Number(h.star))?{...h,price:Number(h.price||0)+amount}:h),lastEditedBy:'مدیریت',lastEditedAt:new Date().toISOString()}:t);
  saveTours(ts);
  const result=$('adminBatchResult');
  if(result)result.innerHTML=`<div>قیمت هتل‌های انتخاب‌شده برای ${faNum(ids.length)} تور آپدیت شد.</div>`;
  showToast('قیمت‌ها در مدیریت آپدیت شد');
  setTimeout(()=>{renderToursAdmin();},200);
}



function sourceLabelFa(key){return key==='parto'?'پرتو':(key==='alefba'?'الفبای سفر':'سفرو ایرانیان')}
function sourceUrl(key){if(key==='parto')return 'Parto';return key==='alefba'?'https://www.alefbatour.com/tour':'https://safaroiranian.com/tour/'}
function renderSourceImportCards(){
  const s=externalSourceSettings();
  const stats=importedSourceStats();
  const sources=[
    {key:'safaroIranian',title:'سفرو ایرانیان',desc:'بانک تورهای سفرو ایرانیان؛ مقصدها، هتل، سرویس و قیمت پایه',count:stats.safaro},
    {key:'alefba',title:'الفبای سفر',desc:'بانک تورهای الفبای سفر؛ مقصدها، هتل، سرویس و قیمت پایه',count:stats.alefba},
    {key:'parto',title:'پرتو',desc:'بانک تورهای پرتو؛ پیش‌فرض فقط مدیریت، قابل انتشار برای فروش و خریدار',count:stats.parto||0}
  ];
  return `<div class="source-import-grid">${sources.map(src=>{
    const cfg=s[src.key]||{};
    return `<div class="source-import-card">
      <div class="source-import-head">
        <div><span class="badge international">${src.title}</span><h4>${src.desc}</h4></div>
        <b>${faNum(src.count||0)} تور</b>
      </div>
      <p class="small">آدرس منبع: <span dir="ltr">${sourceUrl(src.key)}</span></p>
      <label class="source-daily-toggle"><input type="checkbox" ${cfg.daily?'checked':''} onchange="adminToggleDailySource('${src.key}',this.checked)"> هر روز بخوان و آپدیت کن</label>
      <div class="source-import-status">${cfg.lastResult||'هنوز آپدیت روزانه اجرا نشده است.'}</div>${src.key==='parto'?`<div class="parto-publish-box"><div>${(()=>{const p=partoPublishStats();return `کل: ${faNum(p.total)} | منتشرشده: ${faNum(p.published)} | فقط مدیریت: ${faNum(p.adminOnly)}`})()}</div><button class="soft" onclick="adminSetPartoPublish('admin')">فقط مدیریت</button><button class="btn" onclick="adminSetPartoPublish('publish')">انتشار برای فروش و خریدار</button></div>`:''}
      <div class="actions">
        <button class="btn" onclick="adminRunOneSource('${src.key}')">آپدیت همین منبع</button>
        ${src.key==='parto'?`<button class="soft" onclick="alert('پرتو به صورت منبع داخلی/وب‌سرویس ثبت شده و لینک عمومی مستقیم برای کاربر ندارد')">منبع داخلی پرتو</button>`:`<button class="soft" onclick="window.open('${sourceUrl(src.key)}','_blank')">باز کردن سایت منبع</button>`}
      </div>
    </div>`;
  }).join('')}</div>`;
}
function adminToggleDailySource(key,on){
  toggleSourceDaily(key,on);
  renderAdmin();
  showToast(on?`آپدیت روزانه ${sourceLabelFa(key)} فعال شد`:`آپدیت روزانه ${sourceLabelFa(key)} غیرفعال شد`);
}
function adminRunOneSource(key){
  runSourceImport(key,true);
  renderAdmin();
}
function adminSetPartoPublish(mode){setPartoPublishMode(mode==='publish'?'publish':'admin');renderAdmin()}
function adminRunAllSources(){
  runAllSourceImports(true);
  renderAdmin();
}

function safeSafaroIranianImportedTours(){try{return safaroIranianImportedTours()}catch(e){console.warn('safaro import preview failed',e);return []}}
function adminImportSafaroIranianTours(){adminRunAllSources()}

function renderAdmin(){
  const os=orders(),sales=os.reduce((s,o)=>s+Number(o.totalPrice||0),0);
  $('app').innerHTML=`<div class="card pad row wrap" style="margin-top:22px"><div><span class="badge international">پنل مدیریت</span><h1>داشبورد مدیریت</h1></div><button class="soft" onclick="logoutRole('admin')">خروج</button></div>
  <section class="grid g4" style="margin:16px 0">
    <div class="card pad"><span class="small">کل رزروها</span><b class="price">${faNum(os.length)}</b></div>
    <div class="card pad"><span class="small">در انتظار</span><b class="price">${faNum(os.filter(o=>o.status==='در انتظار تماس').length)}</b></div>
    <div class="card pad"><span class="small">فروش</span><b class="price">${money(sales)}</b></div>
    <div class="card pad"><span class="small">تور فعال</span><b class="price">${faNum(tours().filter(t=>t.status==='active').length)}</b></div>
  </section>

  

  <div class="admin-layout">
    <aside class="admin-side-nav">
      <a href="#admin-safaro-import"><i class="fa-solid fa-cloud-arrow-down"></i> آپدیت منابع تور</a>
      <a href="#admin-tour-images"><i class="fa-regular fa-image"></i> عکس تورها</a>
      <a href="#admin-staff-accounts"><i class="fa-regular fa-user"></i> تیم فروش</a>
      <a href="#admin-price-sheet"><i class="fa-solid fa-file-csv"></i> آپدیت قیمت</a>
      <a href="#admin-hotels"><i class="fa-solid fa-hotel"></i> هتل‌ها</a>
      <a href="#admin-airlines"><i class="fa-solid fa-plane"></i> ایرلاین‌ها</a>
      <a href="#admin-currencies"><i class="fa-solid fa-coins"></i> ارزها</a>
      <a href="#admin-hotel-booking-photos"><i class="fa-regular fa-images"></i> عکس Booking هتل‌ها</a>
      <a href="#admin-leads"><i class="fa-solid fa-phone"></i> شماره‌ها</a>
      <a href="#admin-customer-trail"><i class="fa-solid fa-shoe-prints"></i> ردپای مشتری</a>
      <a href="#admin-visas"><i class="fa-solid fa-passport"></i> ویزا</a>
      <a href="#admin-discounts"><i class="fa-solid fa-percent"></i> تخفیف‌ها</a>
      <a href="#admin-orders"><i class="fa-solid fa-list-check"></i> رزروها</a>
    </aside>
    <div class="admin-main-stack">
  <section id="admin-safaro-import" class="card pad safaro-import-section source-import-section" style="margin-bottom:16px">
    <div class="row wrap">
      <div>
        <span class="badge special">واردسازی و آپدیت منابع تور</span>
        <h3>سفرو ایرانیان + الفبای سفر + پرتو</h3>
        <p class="small">از این قسمت تورهای منابع را وارد می‌کنی. گزینه «هر روز بخوان و آپدیت کن» باعث می‌شود هر بار پنل مدیریت باز شود، اگر ۲۴ ساعت گذشته باشد همان منبع دوباره آپدیت شود.</p>
      </div>
      <div class="actions">
        <button class="btn" onclick="adminRunAllSources()">آپدیت هر دو منبع الان</button>
      </div>
    </div>
    <div class="source-import-note">نکته: اطلاعات واردشده بعد از اضافه‌شدن داخل همین سایت قابل ویرایش، تغییر قیمت، ظرفیت، عکس و وضعیت نمایش است.</div>
    ${renderSourceImportCards()}
    <div class="safaro-import-preview">${[...safeSafaroIranianImportedTours().slice(0,6),...alefbaImportedTours().slice(0,12)].map(t=>`<div><b>${t.title}</b><small>${t.dest} | ${money(minHotel(t).price||t.price||0)} | ${t.sourceName==='Parto'?'پرتو':(t.sourceName==='AlefbaSafar'?'الفبای سفر':'سفرو ایرانیان')}</small></div>`).join('')}</div>
  </section>

  <section id="admin-tour-images" class="card pad">
    <h3>مدیریت عکس تورها</h3>
    <p class="small">آپلود یا تغییر عکس تور فقط از پنل مدیریت انجام می‌شود و در پنل فروش حذف شده است.</p>
    <div id="adminTourImagesTable" class="table-wrap" style="margin-top:12px"></div>
  </section>

  <section id="admin-staff-accounts" class="card pad" style="margin-bottom:16px">
    <h3>مدیریت یوزرنیم و پسورد تیم فروش</h3><div class="form-note-required">موارد ستاره‌دار الزامی هستند <span class="req-star">*</span></div>
    <p class="small">برای هر تیم فروش یک نام کاربری و رمز جدا بساز. فروش با همین اطلاعات وارد پنل فروش می‌شود و نامش روی ویرایش‌ها ثبت می‌شود.</p>
    <div class="admin-mini-grid">
      <input id="staffFullName" class="field" placeholder="نام فروش *">
      <input id="staffUsername" class="field" placeholder="Username *" dir="ltr">
      <input id="staffPassword" class="field" placeholder="Password *" dir="ltr"><textarea id="staffTaskNote" class="field" rows="2" placeholder="توضیحات/وظایف این فروش"></textarea>
      <select id="staffActive" class="field"><option value="true">فعال</option><option value="false">غیرفعال</option></select>
      <button class="btn" onclick="saveStaffAccount()">ذخیره فروش</button>
    </div>
    <div id="staffAccountsTable" class="table-wrap staff-account-table" style="margin-top:12px"></div>
  </section>

  <section id="admin-price-sheet" class="card pad" style="margin-bottom:16px"><h3>آپدیت قیمت با شیت</h3><p class="small">فایل CSV خروجی گرفته‌شده از شیت نمونه را اینجا آپلود کن تا قیمت‌ها، ظرفیت‌ها و تخفیف دستی آپدیت شوند.</p><div class="price-import-box"><input id="adminPriceImport" class="field" type="file" accept=".csv,.txt"><button class="btn" onclick="importPriceSheet('adminPriceImport','adminImportResult')">آپلود و آپدیت قیمت‌ها</button><div id="adminImportResult" class="import-result"></div></div>${excelTourImportBox('admin')}${adminBatchPriceBox()}</section>

  <section id="admin-hotels" class="card pad hotel-bank-section" style="margin-bottom:16px">
    <div class="hotel-bank-shell">
      <div class="hotel-bank-hero">
        <div>
          <span class="badge special">بانک هتل‌ها و پکیج‌ها</span>
          <h3>بانک هتل‌ها؛ کنترل کامل فقط برای مدیریت</h3>
          <p class="small">همه هتل‌ها، عکس‌ها، پکیج‌ها و وضعیت نمایش فقط اینجا کنترل می‌شوند. فروش فقط می‌تواند هتل‌های فعال‌شده را انتخاب کند و به حذف، ویرایش، عکس‌ها یا فعال/غیرفعال‌سازی دسترسی ندارد.</p>
        </div>
        <div class="actions hotel-bank-top-actions">
          <button class="soft" onclick="bulkToggleHotelCatalog(false)">عدم نمایش همه برای فروش</button>
          <button class="btn" onclick="bulkToggleHotelCatalog(true)">نمایش همه برای فروش</button>
        </div>
      </div>

      <div class="hotel-bank-entry-card">
        <div class="hotel-bank-entry-grid">
          <input id="hotelLatinName" class="field" placeholder="Hotel / Package Name *" dir="ltr">
          <input id="hotelDestination" class="field" placeholder="مقصد؛ مثل استانبول">
          <select id="hotelStar" class="field"><option value="3">۳ ستاره</option><option value="4">۴ ستاره</option><option value="5">۵ ستاره</option></select>
          <input id="hotelMeal" class="field" placeholder="وعده / سرویس؛ BB, HB, ALL, UALL">
          <input id="hotelSourceGroup" class="field" placeholder="منبع / گروه؛ مثل لیست استانبول">
          <select id="hotelEnabled" class="field"><option value="false">عدم نمایش برای فروش</option><option value="true">نمایش برای فروش</option></select>
          <input id="hotelImageUrl" class="field" dir="ltr" placeholder="عکس اصلی هتل URL">
          <input id="hotelPhotosText" class="field" dir="ltr" placeholder="بیشتر / با کاما جدا کن یا URL های بیشتر">
        </div>
        <div class="hotel-bank-entry-actions">
          <button class="btn" onclick="saveHotelItem()">ذخیره هتل / پکیج</button>
          <button class="soft" onclick="resetDefaultHotels()">بازگردانی بانک واردشده</button>
        </div>
      </div>

      <div class="hotel-bank-toolbar-card">
        <div class="hotel-catalog-toolbar hotel-catalog-toolbar-upgraded">
          <input id="hotelCatalogSearch" class="field" placeholder="جستجوی نام هتل، مقصد یا منبع..." oninput="renderHotelCatalog()">
          <select id="hotelCatalogDestFilter" class="field" onchange="renderHotelCatalog()"></select>
          <select id="hotelCatalogShowFilter" class="field" onchange="renderHotelCatalog()"><option value="all">همه وضعیت‌ها</option><option value="on">فقط نمایش برای فروش</option><option value="off">فقط عدم نمایش</option></select>
        </div>
      </div>

      <div class="hotel-bank-stage">
        <div class="hotel-bank-sidebox">
          <div class="hotel-bank-mini-note">
            <h4>مدیریت سریع</h4>
            <p class="small">اول هتل را داخل بانک ثبت کن، بعد با فعال‌کردن آن، در پنل فروش و فرم انتخاب هتل نمایش داده می‌شود.</p>
          </div>
          <div id="hotelCatalogQuickStats" class="hotel-bank-quick-stats"></div>
          <div class="all-names-box"><h4>همه اسم هتل‌ها</h4><div id="allHotelNamesList" class="all-names-list"></div></div>
        </div>
        <div class="hotel-bank-mainbox">
          <div class="list-title-line hotel-bank-list-head"><h4>لیست هتل‌ها و پکیج‌های مدیریت</h4><span class="small">موارد فعال‌شده برای پنل فروش ارسال می‌شوند.</span></div>
          <div id="hotelCatalogTable" class="hotel-admin-table hotel-bank-modern-table"></div>
        </div>
      </div>

      <div class="current-hotels-box hotel-current-tour-box"><h3>لیست تک‌تک هتل‌های ثبت‌شده در تورها</h3><p class="small">اینجا هتل‌هایی که در خود تورها قیمت‌گذاری شده‌اند دیده می‌شوند و می‌توانی نمایش آن‌ها در پنل مشتری را فعال/غیرفعال کنی.</p><div class="row wrap" style="margin-bottom:10px"><button class="soft" onclick="renderCurrentTourHotels()">بروزرسانی لیست</button><button class="btn" onclick="syncCatalogHotelsToTours()">اعمال هتل‌های فعال مدیریت روی تورهای هم‌مقصد</button><select id="addHotelTourId" class="field" style="max-width:260px">${tours().map(t=>`<option value="${t.id}">${t.title}</option>`).join("")}</select><button class="soft" onclick="addCurrentTourHotel(Number($('addHotelTourId').value))">افزودن هتل به تور</button></div><div id="currentTourHotelsTable" class="table-wrap"></div></div>
    </div>
  </section>


  
  <section id="admin-airlines" class="card pad airline-bank-section" style="margin-bottom:16px">
    <div class="row wrap">
      <div>
        <span class="badge international">بانک ایرلاین‌ها</span>
        <h3>کنترل ایرلاین‌ها فقط برای مدیریت</h3>
        <p class="small">ایرلاین‌ها، لوگو، کد پروازی و وضعیت نمایش برای پنل فروش اینجا کنترل می‌شود. فروش فقط می‌تواند ایرلاین‌های فعال‌شده را انتخاب کند.</p>
      </div>
      <div class="actions">
        <button class="soft" onclick="bulkToggleAirlines(false)">عدم نمایش همه برای فروش</button>
        <button class="btn" onclick="bulkToggleAirlines(true)">نمایش همه برای فروش</button>
      </div>
    </div>
    <div class="airline-entry-card">
      <div class="airline-entry-grid">
        <input id="airlineNameFa" class="field" placeholder="نام فارسی ایرلاین *">
        <input id="airlineNameEn" class="field" dir="ltr" placeholder="English Name">
        <input id="airlineCode" class="field" dir="ltr" placeholder="کد ایرلاین؛ مثل TK">
        <input id="airlineLogo" class="field" dir="ltr" placeholder="URL لوگو">
        <select id="airlineType" class="field"><option value="international">خارجی</option><option value="domestic">داخلی</option></select>
        <select id="airlineEnabled" class="field"><option value="true">نمایش برای فروش</option><option value="false">عدم نمایش برای فروش</option></select>
        <input id="airlineNote" class="field" placeholder="توضیح اختیاری">
      </div>
      <div class="actions" style="margin-top:12px">
        <button class="btn" onclick="saveAirlineItem()">ذخیره ایرلاین</button>
        <button class="soft" onclick="resetAirlines()">بازگردانی نمونه‌ها</button>
      </div>
    </div>
    <div class="airline-toolbar">
      <input id="airlineSearch" class="field" placeholder="جستجوی ایرلاین..." oninput="renderAirlineCatalog()">
      <select id="airlineTypeFilter" class="field" onchange="renderAirlineCatalog()"><option value="all">همه نوع‌ها</option><option value="domestic">داخلی</option><option value="international">خارجی</option></select>
      <select id="airlineShowFilter" class="field" onchange="renderAirlineCatalog()"><option value="all">همه وضعیت‌ها</option><option value="on">فقط نمایش برای فروش</option><option value="off">فقط عدم نمایش</option></select>
    </div>
    <div id="airlineCatalogTable" class="airline-admin-list"></div>
  </section>

  <section id="admin-hotel-booking-photos" class="card pad" style="margin-bottom:16px">
    <div class="row wrap"><div><span class="badge international">Booking</span><h3>مدیریت عکس‌های Booking هتل‌ها</h3><p class="small">اینجا برای هر تور و هر هتل می‌توانی لینک Booking و عکس‌های هتل را وارد یا آپلود کنی. این عکس‌ها با دکمه Booking در پنل مشتری نمایش داده می‌شوند.</p></div></div>
    <div class="admin-url-help">برای هر هتل می‌توانی یا عکس را انتخاب کنی، یا چند URL عکس وارد کنی. لینک Booking هم جدا ذخیره می‌شود.</div><div class="row wrap booking-admin-controls">
      <select id="bookingPhotoTour" class="field" onchange="renderBookingPhotoHotels()" style="max-width:320px">${tours().map(t=>`<option value="${t.id}">${t.title}</option>`).join('')}</select>
      <button class="soft" onclick="renderBookingPhotoHotels()">بروزرسانی لیست</button>
    </div>
    <div id="bookingPhotoHotels" class="booking-photo-admin-list"></div>
  </section>

  <section id="admin-leads" class="card pad" style="margin-bottom:16px">
    <div class="row wrap"><div><h3>لیست تماس و مشاوره رایگان</h3><p class="small">شماره‌هایی که در بخش «تور خودتو بساز» ثبت می‌شوند اینجا می‌آیند.</p></div><button class="soft" onclick="clearLeads()">پاک کردن لیست تماس</button></div>
    <div class="lead-tools"><div><label class="label">افزودن مسئول فروش</label><input id="newContactStaff" class="field" placeholder="مثلاً: علی رضایی"></div><button class="btn" onclick="addContactStaff()">افزودن فروش</button></div>
    <div id="staffChipList" class="staff-chip-list"></div>
    <div id="leadsTable" class="table-wrap" style="margin-top:12px"></div>
  </section>

  

  <section id="admin-customer-trail" class="card pad" style="margin-bottom:16px">
    <div class="row wrap"><div><span class="badge special">ردپای مشتری</span><h3>ردپای مشتری‌ها در سایت</h3><p class="small">اینجا مشخص می‌شود هر مشتری قبل از ثبت شماره یا رزرو، کدام تورها را دیده است.</p></div></div>
    <div id="customerTrailAdminTable" class="table-wrap" style="margin-top:12px"></div>
  </section>


  <section id="admin-currencies" class="card pad currency-bank-section" style="margin-bottom:16px">
    <div class="row wrap">
      <div>
        <span class="badge special">بانک واحدهای پولی دنیا</span>
        <h3>کنترل ارزها برای نمایش در پنل خریدار</h3>
        <p class="small">همه واحدهای پولی پشتیبانی‌شده مرورگر به همراه فهرست کامل کاربردی اضافه شده‌اند. هر ارزی را فعال کنی، در پنل خریدار نمایش داده می‌شود.</p>
      </div>
      <div class="actions">
        <button class="soft" onclick="bulkToggleCurrencies(false)">عدم نمایش همه</button>
        <button class="btn" onclick="bulkToggleCurrencies(true)">نمایش همه در خریدار</button>
      </div>
    </div>
    <div class="currency-entry-card">
      <div class="currency-entry-grid">
        <input id="currencyCode" class="field" dir="ltr" placeholder="کد ارز؛ USD">
        <input id="currencyNameFa" class="field" placeholder="نام فارسی">
        <input id="currencyNameEn" class="field" dir="ltr" placeholder="English Name">
        <input id="currencySymbol" class="field" placeholder="نماد / کد نمایشی">
        <input id="currencyRate" class="field" placeholder="نرخ اختیاری نسبت به تومان">
        <select id="currencyBuyerShow" class="field"><option value="false">عدم نمایش در خریدار</option><option value="true">نمایش در خریدار</option></select>
      </div>
      <div class="actions" style="margin-top:12px"><button class="btn" onclick="saveCurrencyItem()">ذخیره ارز</button><button class="soft" onclick="resetCurrencies()">بازگردانی لیست جهانی</button></div>
    </div>
    <div class="currency-toolbar">
      <input id="currencySearch" class="field" placeholder="جستجوی کد یا نام ارز..." oninput="renderCurrencyCatalog()">
      <select id="currencyShowFilter" class="field" onchange="renderCurrencyCatalog()"><option value="all">همه وضعیت‌ها</option><option value="on">فقط نمایش در خریدار</option><option value="off">فقط عدم نمایش</option></select>
    </div>
    <div id="currencyCatalogTable" class="currency-admin-list"></div>
  </section>

  <section id="admin-visas" class="card pad" style="margin-bottom:16px">
    <h3>مدیریت قیمت ویزا</h3>
    <p class="small">کشورها و شهرهایی که امکان گرفتن ویزا یا خدمات سفر برای آن‌ها دارید را اینجا اضافه و ویرایش کن. این لیست در پنل مشتری نمایش داده می‌شود.</p>
    <div class="all-names-box visa-names-admin"><h4>همه اسم ویزاها</h4><div id="allVisaNamesList" class="all-names-list"></div></div>
    <div class="visa-admin-grid">
      <input id="visaCountry" class="field" placeholder="کشور *">
      <input id="visaCity" class="field" placeholder="شهر / مقصد">
      <input id="visaPrice" class="field" type="number" placeholder="قیمت">
      <input id="visaDuration" class="field" placeholder="مدت زمان">
      <input id="visaDocs" class="field" placeholder="مدارک لازم">
      <textarea id="visaDetails" class="field visa-details-admin-field" rows="3" placeholder="توضیحات تکمیلی ویزا؛ شرایط، نکات مهم، زمان‌بندی، مدارک اضافه"></textarea>
      <button class="btn" onclick="saveVisaItem()">ذخیره ویزا</button>
    </div>
    <input id="visaId" type="hidden">
    <div id="visaTable" style="margin-top:12px"></div>
  </section>

  <section id="admin-discounts" class="card pad" style="margin-bottom:16px">
    <h3>مدیریت کد تخفیف</h3>
    <div class="row wrap"><input id="dcode" class="field" placeholder="کد *" style="max-width:170px"><select id="dtype" class="field" style="max-width:150px"><option value="percent">درصدی</option><option value="fixed">مبلغ ثابت</option></select><input id="dvalue" class="field" type="number" placeholder="مقدار *" style="max-width:150px"><input id="dmin" class="field" type="number" placeholder="حداقل خرید" style="max-width:150px"><select id="dtour" class="field" style="max-width:170px"><option value="all">همه تورها</option><option value="lastminute">قسمت ویژه</option>${tours().map(t=>`<option value="${t.id}">${t.title}</option>`).join('')}</select><button class="btn" onclick="addDiscount()">افزودن</button></div>
    <div id="discountTable" class="table-wrap" style="margin-top:12px"></div>
  </section>

  <section id="admin-orders" class="card pad">
    <h3>رزروها</h3><div class="row wrap"><input id="q" class="field" placeholder="جستجو نام، شماره، کد" oninput="renderOrders()" style="max-width:320px"><select id="statusFilter" class="field" onchange="renderOrders()" style="max-width:200px"><option value="all">همه وضعیت‌ها</option><option>در انتظار تماس</option><option>تماس گرفته شد</option><option>تایید شده</option><option>لغو شده</option><option>پرداخت شده</option></select></div>
    <div id="ordersTable" class="table-wrap" style="margin-top:12px"></div>
  </section>
    </div>
  </div>`;
  renderTourImages();renderStaffAccounts();renderHotelCatalog();renderCurrentTourHotels();renderBookingPhotoHotels();renderContactStaff();renderLeads();renderCustomerTrailAdmin();renderCustomerTrailAdmin();renderVisas();renderDiscounts();renderOrders();
  if(typeof renderAirlineCatalog==='function')renderAirlineCatalog();
  if(typeof renderCurrencyCatalog==='function')renderCurrencyCatalog();
}



function bookingPhotoEditorHtml(tourId,index,h){
  const photos=(h.photos||h.images||[]).filter(Boolean);
  if(!photos.length)return '<div class="empty-state-mini">هنوز عکسی برای ادیت ثبت نشده است.</div>';
  return `<div class="booking-edit-photo-list">${photos.slice(0,18).map((src,pIndex)=>`
    <div class="booking-edit-photo-item">
      <img src="${src}">
      <div class="booking-edit-fields">
        <label class="label">ادیت URL عکس ${faNum(pIndex+1)}</label>
        <input id="bookingEditPhoto_${tourId}_${index}_${pIndex}" class="field" dir="ltr" placeholder="${String(src).startsWith('data:image/')?'عکس آپلودی است؛ برای تبدیل به URL اینجا لینک جدید وارد کن':'URL عکس'}" value="${String(src).startsWith('data:image/')?'':src}">
        <input class="field" type="file" accept="image/*" onchange="replaceBookingHotelPhotoFile(${tourId},${index},${pIndex},this.files)">
      </div>
      <div class="booking-edit-actions">
        <button class="soft" onclick="saveBookingHotelPhotoUrl(${tourId},${index},${pIndex})">ذخیره URL</button>
        <button class="soft" onclick="moveBookingHotelPhoto(${tourId},${index},${pIndex},-1)">بالا</button>
        <button class="soft" onclick="moveBookingHotelPhoto(${tourId},${index},${pIndex},1)">پایین</button>
        <button class="danger" onclick="removeBookingHotelPhoto(${tourId},${index},${pIndex})">حذف</button>
      </div>
    </div>`).join('')}</div>`;
}
function renderBookingPhotoHotels(){
  const tourId=Number($('bookingPhotoTour')?.value||tours()[0]?.id||0);
  const box=$('bookingPhotoHotels');if(!box)return;
  const t=findTour(tourId);
  if(!t){box.innerHTML='<div class="empty-state-mini">تور انتخاب نشده است.</div>';return}
  const list=t.hotels||[];
  box.innerHTML=`<div class="current-tour-hotel-head"><b>تور انتخاب‌شده: ${t.title}</b><span class="small">${faNum(list.length)} هتل</span></div>
  <div class="booking-photo-list">${list.map((h,i)=>`<div class="booking-photo-card">
    <div class="booking-photo-head">
      <div><b dir="ltr">${h.name||'—'}</b><small>${adminHotelStarsFallback(h.star)} | ${money(h.price||0)}</small></div>
      <button class="btn" onclick="saveBookingHotelPhotos(${tourId},${i})">ذخیره اطلاعات Booking</button>
    </div>

    <div class="booking-url-grid">
      <div>
        <label class="label">URL صفحه Booking هتل</label>
        <input id="bookingLink_${tourId}_${i}" class="field" dir="ltr" placeholder="https://www.booking.com/hotel/..." value="${h.bookingLink||''}">
      </div>
      <div class="booking-upload-box">
        <label class="label">آپلود چند عکس هتل</label>
        <input id="bookingMultiUpload_${tourId}_${i}" class="field" type="file" accept="image/*" multiple onchange="uploadBookingHotelPhotos(${tourId},${i},this.files)">
        <small class="small">چند عکس را همزمان انتخاب کن. عکس‌ها قبل از ذخیره فشرده می‌شوند.</small>
      </div>
    </div>

    <div class="booking-url-row-title">افزودن URL عکس‌های جدید Booking</div>
    <div class="booking-url-inputs">
      ${[0,1,2,3,4,5,6,7].map(n=>`<input id="bookingPhotoUrl_${tourId}_${i}_${n}" class="field" dir="ltr" placeholder="URL عکس جدید ${n+1}" value="">`).join('')}
    </div>

    <label class="label">یا همه URL عکس‌های جدید؛ هر URL در یک خط</label>
    <textarea id="bookingPhotos_${tourId}_${i}" class="field" dir="ltr" rows="4" placeholder="URL عکس ۱&#10;URL عکس ۲&#10;URL عکس ۳&#10;URL عکس ۴"></textarea>

    <div class="booking-preview-title">ادیت عکس‌های Booking این هتل</div>
    ${bookingPhotoEditorHtml(tourId,i,h)}
  </div>`).join('')||'<div class="empty-state-mini">برای این تور هنوز هتلی ثبت نشده است.</div>'}</div>`;
}
function currentBookingPhotos(tourId,index){
  return (findTour(tourId)?.hotels?.[index]?.photos||findTour(tourId)?.hotels?.[index]?.images||[]).filter(Boolean);
}
function collectEditedBookingPhotos(tourId,index){
  return currentBookingPhotos(tourId,index).map((src,pIndex)=>{
    const v=$(`bookingEditPhoto_${tourId}_${index}_${pIndex}`)?.value?.trim();
    return v||src;
  }).filter(Boolean);
}
function updateBookingHotelPhotos(tourId,index,photos,extra={}){
  return saveTours(tours().map(t=>{
    if(Number(t.id)!==Number(tourId))return t;
    const hs=[...(t.hotels||[])];
    const h=hs[index]||{};
    hs[index]={...h,...extra,photos:[...new Set((photos||[]).filter(Boolean))].slice(0,18)};
    return {...t,hotels:hs,lastEditedBy:'مدیریت',lastEditedAt:new Date().toISOString()};
  }));
}
function saveBookingHotelPhotos(tourId,index){
  const edited=collectEditedBookingPhotos(tourId,index);
  const singleUrls=[0,1,2,3,4,5,6,7].map(n=>$(`bookingPhotoUrl_${tourId}_${index}_${n}`)?.value?.trim()).filter(Boolean);
  const bulkUrls=($(`bookingPhotos_${tourId}_${index}`)?.value||'').split('\n').map(x=>x.trim()).filter(Boolean);
  const urls=[...new Set([...edited,...singleUrls,...bulkUrls])].slice(0,18);
  const ok=updateBookingHotelPhotos(tourId,index,urls,{bookingLink:$(`bookingLink_${tourId}_${index}`)?.value?.trim()||''});
  if(!ok)return;
  renderBookingPhotoHotels();
  showToast('اطلاعات و عکس‌های Booking هتل ذخیره شد');
}
function uploadBookingHotelPhotos(tourId,index,files){
  const arr=[...(files||[])].slice(0,12);if(!arr.length)return;
  Promise.all(arr.map(file=>resizeImageFile(file,900,.72))).then(urls=>{
    urls=urls.filter(Boolean);
    if(!urls.length)return alert('عکس معتبری انتخاب نشد');
    const old=currentBookingPhotos(tourId,index);
    const ok=updateBookingHotelPhotos(tourId,index,[...old,...urls]);
    if(!ok)return;
    renderBookingPhotoHotels();
    showToast(`${faNum(urls.length)} عکس فشرده برای هتل آپلود شد`);
  }).catch(err=>{console.error(err);alert('خطا در آپلود عکس‌ها')});
}
function saveBookingHotelPhotoUrl(tourId,index,photoIndex){
  const list=collectEditedBookingPhotos(tourId,index);
  const ok=updateBookingHotelPhotos(tourId,index,list,{bookingLink:$(`bookingLink_${tourId}_${index}`)?.value?.trim()||''});
  if(!ok)return;
  renderBookingPhotoHotels();
  showToast('URL عکس ذخیره شد');
}
function replaceBookingHotelPhotoFile(tourId,index,photoIndex,files){
  const file=[...(files||[])][0];if(!file)return;
  resizeImageFile(file,900,.72).then(url=>{
    if(!url)return alert('عکس معتبر انتخاب نشد');
    const list=currentBookingPhotos(tourId,index);
    list[photoIndex]=url;
    const ok=updateBookingHotelPhotos(tourId,index,list);
    if(!ok)return;
    renderBookingPhotoHotels();
    showToast('عکس جایگزین شد');
  });
}
function moveBookingHotelPhoto(tourId,index,photoIndex,dir){
  const list=collectEditedBookingPhotos(tourId,index);
  const ni=photoIndex+dir;
  if(ni<0||ni>=list.length)return;
  const tmp=list[photoIndex];list[photoIndex]=list[ni];list[ni]=tmp;
  const ok=updateBookingHotelPhotos(tourId,index,list);
  if(!ok)return;
  renderBookingPhotoHotels();
}
function removeBookingHotelPhoto(tourId,index,photoIndex){
  const list=currentBookingPhotos(tourId,index).filter((_,i)=>i!==Number(photoIndex));
  const ok=updateBookingHotelPhotos(tourId,index,list);
  if(!ok)return;
  renderBookingPhotoHotels();
  showToast('عکس حذف شد');
}
function renderContactStaff(){
  const box=$('staffChipList');if(!box)return;
  const list=contactStaff();
  box.innerHTML=list.map(x=>`<span class="customer-trail-chip">${x}<button class="chip-x" onclick="removeContactStaff('${x}')">×</button></span>`).join('')||'<span class="small">هنوز مسئولی ثبت نشده است.</span>';
}
function addContactStaff(){
  const v=$('newContactStaff')?.value?.trim();
  if(!v)return alert('نام مسئول فروش را وارد کنید');
  const list=[...new Set([...contactStaff(),v])];
  saveContactStaff(list);
  $('newContactStaff').value='';
  renderContactStaff();
}
function removeContactStaff(name){
  saveContactStaff(contactStaff().filter(x=>x!==name));
  renderContactStaff();
}
function renderLeads(){
  const box=$('leadsTable');if(!box)return;
  const list=leads();
  const staff=contactStaff();
  box.innerHTML=`<table><thead><tr><th>مشتری</th><th>درخواست</th><th>منبع</th><th>زمان/گشت</th><th>تورهای دیده‌شده</th><th>مسئول فروش</th><th>وضعیت</th><th>عملیات</th></tr></thead><tbody>${list.map(l=>`<tr>
    <td><b>${l.name||'—'}</b><br><small dir="ltr">${l.phone||'—'}</small></td>
    <td>${l.dest||'—'}<br><small>${l.people||''} ${l.note?` | ${l.note}`:''}</small></td>
    <td>${l.source||'—'}</td>
    <td>${l.createdAt?new Date(l.createdAt).toLocaleString('fa-IR'):''}<br><small>${faNum(l.tourViews||0)} بازدید | ${faNum(l.engagementPercent||0)}٪ علاقه</small></td>
    <td class="admin-trail-cell">${(l.viewedTours||[]).map(x=>`<span class="customer-trail-chip">${x.tourTitle}</span>`).join('')||l.viewedToursText||'—'}</td>
    <td><select class="field" onchange="updateLead('${l.id}','assignedTo',this.value)"><option value="">انتخاب نشده</option>${staff.map(s=>`<option ${l.assignedTo===s?'selected':''}>${s}</option>`).join('')}</select></td>
    <td><select class="field" onchange="updateLead('${l.id}','status',this.value)">${['جدید','در حال پیگیری','تماس گرفته شد','رزرو شد','لغو شد'].map(s=>`<option ${l.status===s?'selected':''}>${s}</option>`).join('')}</select></td>
    <td><button class="danger" onclick="deleteLead('${l.id}')">حذف</button></td>
  </tr>`).join('')||'<tr><td colspan="8">هنوز شماره‌ای ثبت نشده است.</td></tr>'}</tbody></table>`;
  renderCustomerTrailAdmin();
}
function updateLead(id,key,value){
  saveLeads(leads().map(l=>l.id===id?{...l,[key]:value}:l));
  renderLeads();
}
function deleteLead(id){
  if(!confirm('این شماره حذف شود؟'))return;
  saveLeads(leads().filter(l=>l.id!==id));
  renderLeads();
}
function clearLeads(){
  if(!confirm('کل لیست تماس پاک شود؟'))return;
  saveLeads([]);
  renderLeads();
}
function renderCustomerTrailAdmin(){
  const box=$('customerTrailAdminTable');if(!box)return;
  const leadRows=leads().map(l=>({kind:'تماس/مشاوره',name:l.name,phone:l.phone,date:l.createdAt,trail:l.viewedTours||[],trailText:l.viewedToursText||''}));
  const orderRows=orders().map(o=>({kind:'رزرو',name:o.name,phone:o.phone,date:o.createdAt||o.date,trail:o.viewedTours||[],trailText:o.viewedToursText||''}));
  const rows=[...leadRows,...orderRows].sort((a,b)=>String(b.date||'').localeCompare(String(a.date||'')));
  box.innerHTML=`<table><thead><tr><th>نوع</th><th>مشتری</th><th>تاریخ</th><th>تورهای دیده‌شده مشتری</th></tr></thead><tbody>${rows.map(r=>`<tr>
    <td><span class="badge special">${r.kind}</span></td>
    <td><b>${r.name||'—'}</b><br><small dir="ltr">${r.phone||'—'}</small></td>
    <td>${r.date?new Date(r.date).toLocaleString('fa-IR'):''}</td>
    <td class="admin-trail-cell">${(r.trail||[]).map(x=>`<span class="customer-trail-chip">${x.tourTitle||x.title||'تور'}</span>`).join('')||r.trailText||'—'}</td>
  </tr>`).join('')||'<tr><td colspan="4">هنوز ردپایی ثبت نشده است.</td></tr>'}</tbody></table>`;
}

function galleryText(t){return [t.img,...(t.gallery||[])].filter(Boolean).filter((v,i,a)=>a.indexOf(v)===i).join('\n')}
function tourGalleryList(t){return [t.img,...(t.gallery||[])].filter(Boolean).filter((v,i,a)=>a.indexOf(v)===i)}
function renderTourImages(){
  const box=$('adminTourImagesTable');if(!box)return;
  const list=tours();
  box.innerHTML=`<div class="image-manager-note">
    این بخش برای عکس اصلی تور، گالری صفحه جزئیات تور، URL عکس‌ها و آپلود چند عکس است. عکس‌های آپلودی قبل از ذخیره فشرده می‌شوند.
  </div>
  <div class="tour-image-manager">${list.map(t=>{
    const gallery=tourGalleryList(t);
    return `<div class="tour-image-card-admin">
      <div class="tour-image-card-head">
        <img class="tour-image-admin big" src="${t.img||DEFAULT_IMG}" alt="">
        <div>
          <h3>${t.title}</h3>
          <p class="small">${t.dest} | ID: ${t.id}</p>
          <button class="btn" onclick="saveTourImageSettings(${t.id})">ذخیره همه عکس‌های این تور</button>
        </div>
      </div>

      <div class="image-upload-grid">
        <div class="image-upload-box">
          <label class="label">URL عکس اصلی تور</label>
          <input id="tourMainUrl_${t.id}" class="field" dir="ltr" placeholder="https://..." value="${t.img||''}">
          <label class="label">آپلود عکس اصلی تور</label>
          <input class="field" type="file" accept="image/*" onchange="uploadTourMainImage(${t.id},this.files)">
          <small class="small">این عکس روی کارت تور و بالای صفحه جزئیات نمایش داده می‌شود.</small>
        </div>

        <div class="image-upload-box">
          <label class="label">آپلود چند عکس گالری تور</label>
          <input class="field" type="file" accept="image/*" multiple onchange="uploadTourGalleryImages(${t.id},this.files)">
          <small class="small">برای گالری صفحه جزئیات تور؛ چند عکس را همزمان انتخاب کن.</small>
        </div>
      </div>

      <div class="booking-url-row-title">URLهای گالری تور</div>
      <div class="booking-url-inputs">
        ${[0,1,2,3,4,5,6,7].map(n=>`<input id="tourGalleryUrl_${t.id}_${n}" class="field" dir="ltr" placeholder="URL عکس گالری ${n+1}" value="${gallery[n]||''}">`).join('')}
      </div>

      <label class="label">یا همه URLهای گالری؛ هر URL در یک خط</label>
      <textarea id="tourGalleryUrls_${t.id}" class="field" rows="4" dir="ltr" placeholder="URL عکس ۱&#10;URL عکس ۲&#10;URL عکس ۳">${galleryText(t)}</textarea>

      <div class="booking-preview-title">پیش‌نمایش گالری تور</div>
      <div class="admin-gallery-preview booking-preview">${gallery.slice(0,12).map((src,i)=>`<span class="booking-preview-item"><img src="${src}"><button onclick="removeTourGalleryImage(${t.id},${i})">×</button></span>`).join('')||'<span class="small">هنوز عکسی ثبت نشده است.</span>'}</div>
    </div>`;
  }).join('')}</div>`;
}
function saveTourImageSettings(id){
  const main=($(`tourMainUrl_${id}`)?.value||'').trim();
  const single=[0,1,2,3,4,5,6,7].map(n=>$(`tourGalleryUrl_${id}_${n}`)?.value?.trim()).filter(Boolean);
  const bulk=($(`tourGalleryUrls_${id}`)?.value||'').split('\n').map(x=>x.trim()).filter(Boolean);
  const urls=[...new Set([main,...single,...bulk].filter(Boolean))];
  if(!urls.length)return alert('حداقل یک عکس یا URL وارد کنید');
  const ok=saveTours(tours().map(t=>Number(t.id)===Number(id)?{...t,img:urls[0],gallery:urls,lastEditedBy:'مدیریت',lastEditedAt:new Date().toISOString()}:t));
  if(!ok)return;
  renderTourImages();
  showToast('عکس‌های تور ذخیره شد');
}
function uploadTourMainImage(id,files){
  const file=[...(files||[])][0];if(!file)return;
  resizeImageFile(file,1100,.76).then(url=>{
    if(!url)return alert('عکس معتبر انتخاب نشد');
    const ok=saveTours(tours().map(t=>{
      if(Number(t.id)!==Number(id))return t;
      const gallery=[url,...(t.gallery||[]).filter(x=>x!==url)].slice(0,12);
      return {...t,img:url,gallery,lastEditedBy:'مدیریت',lastEditedAt:new Date().toISOString()};
    }));
    if(!ok)return;
    renderTourImages();
    showToast('عکس اصلی تور آپلود شد');
  });
}
function uploadTourGalleryImages(id,files){
  const arr=[...(files||[])].slice(0,12);if(!arr.length)return;
  Promise.all(arr.map(f=>resizeImageFile(f,1000,.74))).then(urls=>{
    urls=urls.filter(Boolean);
    if(!urls.length)return alert('عکس معتبر انتخاب نشد');
    const ok=saveTours(tours().map(t=>{
      if(Number(t.id)!==Number(id))return t;
      const gallery=[...(t.gallery||[]),...urls].filter(Boolean).slice(0,18);
      return {...t,img:t.img||gallery[0]||DEFAULT_IMG,gallery,lastEditedBy:'مدیریت',lastEditedAt:new Date().toISOString()};
    }));
    if(!ok)return;
    renderTourImages();
    showToast(`${faNum(urls.length)} عکس به گالری تور اضافه شد`);
  });
}
function removeTourGalleryImage(id,index){
  const ok=saveTours(tours().map(t=>{
    if(Number(t.id)!==Number(id))return t;
    const list=tourGalleryList(t).filter((_,i)=>i!==Number(index));
    return {...t,img:list[0]||DEFAULT_IMG,gallery:list,lastEditedBy:'مدیریت',lastEditedAt:new Date().toISOString()};
  }));
  if(!ok)return;
  renderTourImages();
  showToast('عکس از گالری تور حذف شد');
}
function saveStaffAccount(){
  const name=$('staffFullName').value.trim(), username=$('staffUsername').value.trim(), password=$('staffPassword').value.trim(), taskNote=($('staffTaskNote')?.value||'').trim(), active=$('staffActive').value==='true';
  if(!username||!password){alert('یوزرنیم و پسورد را وارد کنید');return}
  const list=staffAccounts();
  const i=list.findIndex(x=>x.username===username);
  const item={id:i>=0?list[i].id:'staff-'+Date.now(),name:name||username,username,password,taskNote,active,createdAt:i>=0?list[i].createdAt:new Date().toISOString()};
  if(i>=0)list[i]=item;else list.push(item);
  saveStaffAccounts(list);
  ['staffFullName','staffUsername','staffPassword','staffTaskNote'].forEach(id=>{if($(id))$(id).value=''});
  $('staffActive').value='true';
  renderStaffAccounts();showToast('تیم فروش ذخیره شد');
}
function editStaffAccount(username){
  const a=staffAccounts().find(x=>x.username===username);if(!a)return;
  $('staffFullName').value=a.name||'';$('staffUsername').value=a.username;$('staffPassword').value=a.password;if($('staffTaskNote'))$('staffTaskNote').value=a.taskNote||'';$('staffActive').value=String(a.active!==false);
}
function toggleStaffAccount(username){
  const list=staffAccounts().map(a=>a.username===username?{...a,active:!(a.active!==false)}:a);saveStaffAccounts(list);renderStaffAccounts();
}
function deleteStaffAccount(username){
  if(!confirm('این تیم فروش حذف شود؟'))return;
  saveStaffAccounts(staffAccounts().filter(a=>a.username!==username));renderStaffAccounts();
}
function renderStaffAccounts(){
  const list=staffAccounts(),box=$('staffAccountsTable');if(!box)return;
  box.innerHTML=`<table><thead><tr><th>نام</th><th>یوزرنیم</th><th>پسورد</th><th>توضیحات وظایف</th><th>وضعیت</th><th>عملیات</th></tr></thead><tbody>${list.map(a=>`<tr><td>${a.name||'—'}</td><td dir="ltr">${a.username}</td><td dir="ltr">${a.password}</td><td>${a.taskNote||'—'}</td><td>${a.active!==false?'فعال':'غیرفعال'}</td><td><button class="soft" onclick="editStaffAccount('${a.username}')">ویرایش</button><button class="soft" onclick="toggleStaffAccount('${a.username}')">${a.active!==false?'غیرفعال':'فعال'}</button><button class="danger" onclick="deleteStaffAccount('${a.username}')">حذف</button></td></tr>`).join('')}</tbody></table>`;
}


function editCatalogHotel(id){editHotelItem(id)}






function editHotelItem(id){
  const h=hotelCatalog().find(x=>x.id===id);if(!h)return;
  $('hotelLatinName').value=h.nameLatin||'';
  if($('hotelDestination'))$('hotelDestination').value=h.destination||h.dest||'';
  $('hotelStar').value=String(h.star||3);
  if($('hotelMeal'))$('hotelMeal').value=h.meal||h.board||'';
  if($('hotelSourceGroup'))$('hotelSourceGroup').value=h.sourceGroup||'';
  if($('hotelImageUrl'))$('hotelImageUrl').value=h.image||h.img||'';
  if($('hotelPhotosText'))$('hotelPhotosText').value=(h.photos||[]).join(', ');
  $('hotelEnabled').value=String(h.enabledForStaff!==false);
  $('hotelLatinName').dataset.editId=id;
  document.getElementById('admin-hotels')?.scrollIntoView({behavior:'smooth',block:'start'});
  showToast('اطلاعات هتل برای ویرایش آماده شد');
}
function toggleHotelItem(id){
  saveHotelCatalog(hotelCatalog().map(h=>h.id===id?{...h,enabledForStaff:!(h.enabledForStaff!==false)}:h));
  renderHotelCatalog();
  renderCurrentTourHotels();
  showToast('وضعیت هتل تغییر کرد');
}
function deleteHotelItem(id){
  if(!confirm('این هتل از لیست مدیریت حذف شود؟'))return;
  saveHotelCatalog(hotelCatalog().filter(h=>h.id!==id));
  renderHotelCatalog();
  renderCurrentTourHotels();
  showToast('هتل حذف شد');
}

function saveHotelItem(){
  const name=$('hotelLatinName').value.trim();
  if(!name){alert('نام لاتین هتل را وارد کنید');return}
  const editId=$('hotelLatinName').dataset.editId||'';
  const list=hotelCatalog();
  const item={
    id:editId||'h-'+Date.now(),
    nameLatin:name,
    star:Number($('hotelStar').value),
    destination:$('hotelDestination')?.value?.trim()||'عمومی',
    dest:$('hotelDestination')?.value?.trim()||'عمومی',
    meal:$('hotelMeal')?.value?.trim()||'',
    board:$('hotelMeal')?.value?.trim()||'',
    sourceGroup:$('hotelSourceGroup')?.value?.trim()||'دستی',
    image:$('hotelImageUrl')?.value?.trim()||'',
    img:$('hotelImageUrl')?.value?.trim()||'',
    photos:[$('hotelImageUrl')?.value?.trim()||'',...String($('hotelPhotosText')?.value||'').split(',').map(x=>x.trim())].filter(Boolean),
    enabledForStaff:$('hotelEnabled').value==='true',
    imported:false
  };
  const i=list.findIndex(h=>h.id===editId);
  if(i>=0)list[i]={...list[i],...item};else list.push(item);
  saveHotelCatalog(list);
  $('hotelLatinName').value='';
  $('hotelLatinName').dataset.editId='';
  if($('hotelDestination'))$('hotelDestination').value='';
  if($('hotelMeal'))$('hotelMeal').value='';
  if($('hotelSourceGroup'))$('hotelSourceGroup').value='';
  if($('hotelImageUrl'))$('hotelImageUrl').value='';
  if($('hotelPhotosText'))$('hotelPhotosText').value='';
  $('hotelStar').value='3';
  $('hotelEnabled').value='false';
  renderHotelCatalog();
  renderCurrentTourHotels();
  showToast(editId?'هتل ویرایش شد':'هتل اضافه شد');
}
function addCurrentTourHotel(tourId){
  const name=prompt('نام لاتین هتل جدید:'); if(!name)return;
  const star=Number(prompt('ستاره هتل:',3)); if(!star)return;
  const price=Number(prompt('قیمت هتل:',0))||0;
  const capacity=Number(prompt('ظرفیت هتل:',0))||0;
  const ts=tours().map(t=>t.id===tourId?{...t,hotels:[...(t.hotels||[]),{hotelId:'admin-'+Date.now(),name,star,price,capacity,showInBuyer:true}]}:t);
  saveTours(ts);renderCurrentTourHotels();showToast('هتل اضافه شد');
}


function hotelPhotosText(h){return (h.photos||h.images||[]).filter(Boolean).join('\n')}
function saveHotelAdminEdit(tourId,index){
  const ts=tours().map(t=>{
    if(t.id!==tourId)return t;
    const hs=[...(t.hotels||[])];
    const h=hs[index]||{};
    hs[index]={
      ...h,
      name:$(`hotelName_${tourId}_${index}`).value.trim(),
      star:Number($(`hotelStar_${tourId}_${index}`).value)||3,
      price:Number($(`hotelPrice_${tourId}_${index}`).value)||0,
      capacity:Number($(`hotelCap_${tourId}_${index}`).value)||0,
      bookingLink:$(`hotelBooking_${tourId}_${index}`).value.trim(),
      photos:$(`hotelPhotos_${tourId}_${index}`).value.split('\n').map(x=>x.trim()).filter(Boolean),
      showInBuyer:$(`hotelShow_${tourId}_${index}`).checked
    };
    return {...t,hotels:hs};
  });
  saveTours(ts);renderCurrentTourHotels();showToast('هتل ذخیره شد');
}
function uploadHotelPhotos(tourId,index,files){
  const arr=[...(files||[])];if(!arr.length)return;
  Promise.all(arr.map(file=>new Promise(resolve=>{const reader=new FileReader();reader.onload=()=>resolve(reader.result);reader.readAsDataURL(file)}))).then(urls=>{
    saveTours(tours().map(t=>{
      if(t.id!==tourId)return t;
      const hs=[...(t.hotels||[])];
      hs[index]={...hs[index],photos:urls};
      return {...t,hotels:hs};
    }));
    renderCurrentTourHotels();showToast('عکس‌های هتل ذخیره شد');
  });
}

function toggleCurrentTourHotel(tourId,index){
  const ts=tours().map(t=>{
    if(Number(t.id)!==Number(tourId))return t;
    const hotels=(t.hotels||[]).map((h,i)=>i===Number(index)?{...h,showInBuyer:!(h.showInBuyer!==false)}:h);
    return {...t,hotels,lastEditedBy:'مدیریت',lastEditedAt:new Date().toISOString()};
  });
  saveTours(ts);
  renderCurrentTourHotels();
  showToast('وضعیت نمایش هتل در پنل مشتری تغییر کرد');
}

function removeCurrentTourHotel(tourId,index){
  if(!confirm('این هتل از تور حذف شود؟'))return;
  saveTours(tours().map(t=>t.id===tourId?{...t,hotels:(t.hotels||[]).filter((_,i)=>i!==index)}:t));
  renderCurrentTourHotels();
}
function editCurrentTourHotel(tourId,index){
  const el=$(`hotelName_${tourId}_${index}`);
  if(el){el.focus();el.select()}
}
function addCurrentTourHotel(tourId){
  const name=prompt('نام لاتین هتل جدید:'); if(!name)return;
  const star=Number(prompt('ستاره هتل:',3)); if(!star)return;
  const price=Number(prompt('قیمت هتل:',0))||0;
  const capacity=Number(prompt('ظرفیت هتل:',0))||0;
  saveTours(tours().map(t=>t.id===tourId?{...t,hotels:[...(t.hotels||[]),{hotelId:'admin-'+Date.now(),name,star,price,capacity,showInBuyer:true,bookingLink:'',photos:[]}]}:t));
  renderCurrentTourHotels();showToast('هتل اضافه شد');
}

function renderCurrentTourHotels(){
  const tourId=Number($('currentHotelTour')?.value||tours()[0]?.id||0);
  const box=$('currentTourHotelsTable');if(!box)return;
  const t=findTour(tourId);
  if(!t){box.innerHTML='<div class="empty-state-mini">تور انتخاب نشده است.</div>';return}
  const list=t.hotels||[];
  box.innerHTML=`<div class="current-tour-hotel-head">
    <b>تور انتخاب‌شده: ${t.title}</b>
    <span class="small">${faNum(list.length)} هتل ثبت‌شده</span>
  </div>
  <div class="admin-hotel-list">${list.map((h,i)=>`<div class="admin-hotel-card">
    <div class="admin-hotel-main">
      <b dir="ltr">${h.name||'—'}</b>
      <span>${adminHotelStarsFallback(h.star)} | ${money(h.price||0)} | ظرفیت: ${faNum(h.capacity||0)}</span>
      <small>${h.showInBuyer!==false?'نمایش در پنل مشتری':'عدم نمایش در پنل مشتری'} ${h.location?` | ${h.location}`:''}</small>
    </div>
    <div class="admin-hotel-actions">
      <button class="soft" onclick="editCurrentTourHotel(${tourId},${i})">ویرایش</button>
      <button class="soft" onclick="toggleCurrentTourHotel(${tourId},${i})">${h.showInBuyer!==false?'عدم نمایش':'نمایش'}</button>
      <button class="danger" onclick="removeCurrentTourHotel(${tourId},${i})">حذف</button>
    </div>
  </div>`).join('')||'<div class="empty-state-mini">برای این تور هنوز هتلی ثبت نشده است.</div>'}</div>`;
}
function toggleTourHotel(tourId,index){
  const ts=tours().map(t=>{
    if(t.id!==tourId)return t;
    const hs=[...(t.hotels||[])];
    if(hs[index])hs[index]={...hs[index],showInBuyer:hs[index].showInBuyer===false};
    return {...t,hotels:hs};
  });
  saveTours(ts);renderCurrentTourHotels();showToast('وضعیت نمایش هتل تغییر کرد');
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
function headerIndex(headers,key){
  const aliases=headerAliases()[key]||[key];
  for(const a of aliases){const i=headers.indexOf(normalizeHeader(a));if(i>=0)return i}
  return -1;
}
function cellByKey(row,headers,key){const i=headerIndex(headers,key);return i>=0?row[i]:''}

function importPriceSheet(inputId,resultId){
  const file=$(inputId)?.files?.[0];if(!file){alert('فایل CSV را انتخاب کنید');return}
  const reader=new FileReader();
  reader.onload=()=>{
    const rows=parseCSV(reader.result);
    if(rows.length<2){$(resultId).textContent='فایل خالی است.';return}
    const headers=rows[0].map(normalizeHeader);
    const idx=k=>headers.indexOf(k);
    let updated=0,notFound=0;
    const ts=tours();
    rows.slice(1).forEach(r=>{
      const tourId=Number(cellByKey(r,headers,'tour_id')||0), hotelName=String(cellByKey(r,headers,'hotel_name_latin')||'').trim(), star=Number(cellByKey(r,headers,'hotel_star')||0);
      const price=Number(cellByKey(r,headers,'price')||0), cap=Number(cellByKey(r,headers,'capacity')||0);
      const showRaw=String(cellByKey(r,headers,'show_in_buyer')||'TRUE').toLowerCase();
      const oldPrice=Number(cellByKey(r,headers,'special_old_price')||0), newPrice=Number(cellByKey(r,headers,'special_new_price')||0), pct=Number(cellByKey(r,headers,'special_discount_percent')||0);
      const endFa=String(cellByKey(r,headers,'special_end_jalali')||'').trim();
      const t=ts.find(x=>x.id===tourId);
      if(!t){notFound++;return}
      if(oldPrice)t.oldPrice=oldPrice;
      if(newPrice)t.newPrice=newPrice;
      if(pct)t.dealPercent=pct;
      if(endFa){t.dealEndsAtFa=endFa;const g=parseFaDiscountDate(endFa);if(g)t.dealEndsAt=g.toISOString()}
      const h=(t.hotels||[]).find(x=>String(x.name).trim().toLowerCase()===hotelName.toLowerCase()&&Number(x.star)===star);
      if(h){
        if(price)h.price=price;
        if(cap>=0)h.capacity=cap;
        h.showInBuyer=!(showRaw==='false'||showRaw==='0'||showRaw==='no'||showRaw==='غیرفعال');
        updated++;
      }else{
        notFound++;
      }
    });
    saveTours(ts);
    $(resultId).textContent=`${faNum(updated)} ردیف آپدیت شد. ${faNum(notFound)} ردیف پیدا نشد.`;
    renderAdmin();
  };
  reader.readAsText(file,'utf-8');
}
function parseFaDiscountDate(input){
  const en=String(input||'').replace(/[۰-۹]/g,d=>'۰۱۲۳۴۵۶۷۸۹'.indexOf(d)).replace(/[٠-٩]/g,d=>'٠١٢٣٤٥٦٧٨٩'.indexOf(d));
  const m=en.match(/(\d{4})[\/\-](\d{1,2})[\/\-](\d{1,2})(?:\s+(\d{1,2}):(\d{1,2}))?/);
  if(!m)return null;
  const jy=+m[1],jm=+m[2],jd=+m[3],hh=+(m[4]||23),mm=+(m[5]||59);
  const g=jalaliToGregorian(jy,jm,jd);
  return new Date(g.gy,g.gm-1,g.gd,hh,mm,0);
}
function jalaliToGregorian(jy,jm,jd){
  jy-=979;let days=365*jy+Math.floor(jy/33)*8+Math.floor(((jy%33)+3)/4)+78+jd+(jm<7?(jm-1)*31:((jm-7)*30+186));
  let gy=1600+400*Math.floor(days/146097);days%=146097;
  if(days>36524){gy+=100*Math.floor(--days/36524);days%=36524;if(days>=365)days++}
  gy+=4*Math.floor(days/1461);days%=1461;
  if(days>365){gy+=Math.floor((days-1)/365);days=(days-1)%365}
  const gd=days+1, sal=[0,31,((gy%4===0&&gy%100!==0)||gy%400===0)?29:28,31,30,31,30,31,31,30,31,30,31];
  let gm=1,d=gd;for(;gm<=12&&d>sal[gm];gm++)d-=sal[gm];
  return {gy,gm,gd:d};
}


function hotelCatalogPhotos(h){
  return [...new Set([h?.image||h?.img||'',...((h?.photos||h?.images||[]).filter(Boolean))].filter(Boolean))].slice(0,18);
}
function hotelCatalogImage(h){
  return hotelCatalogPhotos(h)[0]||'../assets/images/hotel-placeholder.svg';
}
function hotelCatalogPhotoPanel(h){
  const photos=hotelCatalogPhotos(h);
  return `<div id="hotelPhotoPanel_${h.id}" class="hotel-photo-control-panel">
    <div class="row wrap">
      <div><b>مدیریت عکس‌های ${h.nameLatin||'هتل'}</b><p class="small">عکس‌ها فقط در مدیریت ذخیره می‌شوند و در پنل فروش هنگام انتخاب هتل دیده می‌شوند.</p></div>
      <div class="actions">
        <input id="hotelPhotoUrl_${h.id}" class="field hotel-photo-url" dir="ltr" placeholder="URL عکس جدید">
        <button class="soft" onclick="addHotelCatalogPhotoUrl('${h.id}')">افزودن URL</button>
      </div>
    </div>
    <input class="field" type="file" accept="image/*" multiple onchange="uploadHotelCatalogPhotoFiles('${h.id}',this.files)">
    <div class="hotel-photo-grid-admin">${photos.map((src,i)=>`<span><img src="${src}"><button onclick="removeHotelCatalogPhoto('${h.id}',${i})">×</button></span>`).join('')||'<div class="empty-state-mini">هنوز عکسی برای این هتل ثبت نشده است.</div>'}</div>
  </div>`;
}
function toggleHotelPhotoPanel(id){
  const el=$('hotelPhotoPanel_'+id);
  if(el)el.classList.toggle('on');
}
function updateCatalogHotel(id,patch){
  saveHotelCatalog(hotelCatalog().map(h=>h.id===id?normalizeHotelCatalogItem({...h,...patch}):h));
}
function addHotelCatalogPhotoUrl(id){
  const input=$('hotelPhotoUrl_'+id);const url=input?.value?.trim();if(!url)return alert('URL عکس را وارد کن');
  const h=hotelCatalog().find(x=>x.id===id);if(!h)return;
  const photos=[...hotelCatalogPhotos(h),url].filter(Boolean).slice(0,18);
  updateCatalogHotel(id,{image:photos[0]||'',img:photos[0]||'',photos});
  renderHotelCatalog();
  showToast('عکس هتل اضافه شد');
}
function uploadHotelCatalogPhotoFiles(id,files){
  const arr=[...(files||[])].slice(0,8);if(!arr.length)return;
  Promise.all(arr.map(f=>resizeImageFile(f,900,.72))).then(urls=>{
    const h=hotelCatalog().find(x=>x.id===id);if(!h)return;
    const photos=[...hotelCatalogPhotos(h),...urls.filter(Boolean)].slice(0,18);
    updateCatalogHotel(id,{image:photos[0]||'',img:photos[0]||'',photos});
    renderHotelCatalog();
    showToast('عکس‌های هتل آپلود شد');
  });
}
function removeHotelCatalogPhoto(id,index){
  const h=hotelCatalog().find(x=>x.id===id);if(!h)return;
  const photos=hotelCatalogPhotos(h).filter((_,i)=>i!==index);
  updateCatalogHotel(id,{image:photos[0]||'',img:photos[0]||'',photos});
  renderHotelCatalog();
  showToast('عکس حذف شد');
}


function safeHotelGroupId(d){
  return 'hotelGroup_'+String(d||'all').replace(/[^a-zA-Z0-9آ-ی]/g,'_');
}
function toggleHotelBankGroup(d){
  const el=$(safeHotelGroupId(d));
  if(el)el.classList.toggle('open');
}

function hotelDestinations(){
  return [...new Set(hotelCatalog().map(h=>h.destination||h.dest||'عمومی'))].sort((a,b)=>String(a).localeCompare(String(b),'fa'));
}
function renderHotelCatalog(){
  const box=$('hotelCatalogTable');if(!box)return;
  const destSel=$('hotelCatalogDestFilter');
  const destinations=hotelDestinations();
  if(destSel && !destSel.dataset.ready){
    destSel.innerHTML='<option value="all">همه مقصدها</option>'+destinations.map(d=>`<option value="${d}">${d}</option>`).join('');
    destSel.dataset.ready='1';
  }
  const q=($('hotelCatalogSearch')?.value||'').trim().toLowerCase();
  const dest=$('hotelCatalogDestFilter')?.value||'all';
  const show=$('hotelCatalogShowFilter')?.value||'all';
  let list=hotelCatalog().slice();
  if(q)list=list.filter(h=>String(h.nameLatin||'').toLowerCase().includes(q)||String(h.destination||'').toLowerCase().includes(q)||String(h.sourceGroup||'').toLowerCase().includes(q));
  if(dest!=='all')list=list.filter(h=>(h.destination||h.dest||'عمومی')===dest);
  if(show==='on')list=list.filter(h=>h.enabledForStaff!==false);
  if(show==='off')list=list.filter(h=>h.enabledForStaff===false);
  list.sort((a,b)=>String(a.destination||'').localeCompare(String(b.destination||''),'fa')||Number(a.star)-Number(b.star)||String(a.nameLatin||'').localeCompare(String(b.nameLatin||'')));
  const grouped=list.reduce((acc,h)=>{const d=h.destination||h.dest||'عمومی';(acc[d]||(acc[d]=[])).push(h);return acc},{})
  renderAllHotelNames(hotelCatalog());
  const all=hotelCatalog();
  const stats={
    total:all.length,
    active:all.filter(h=>h.enabledForStaff!==false).length,
    hidden:all.filter(h=>h.enabledForStaff===false).length,
    photos:all.reduce((s,h)=>s+hotelCatalogPhotos(h).length,0),
    filtered:list.length,
    destinations:hotelDestinations().length
  };
  const quick=$('hotelCatalogQuickStats');
  if(quick){
    quick.innerHTML=`
      <div class="hotel-bank-stat"><span>کل بانک</span><b>${faNum(stats.total)}</b></div>
      <div class="hotel-bank-stat"><span>نمایش برای فروش</span><b>${faNum(stats.active)}</b></div>
      <div class="hotel-bank-stat"><span>عدم نمایش</span><b>${faNum(stats.hidden)}</b></div>
      <div class="hotel-bank-stat"><span>نتیجه فیلتر</span><b>${faNum(stats.filtered)}</b></div>
      <div class="hotel-bank-stat"><span>تعداد مقصدها</span><b>${faNum(stats.destinations)}</b></div>
      <div class="hotel-bank-stat"><span>تعداد کل عکس‌ها</span><b>${faNum(stats.photos)}</b></div>`;
  }
  box.innerHTML=`<div class="hotel-catalog-summary hotel-catalog-summary-upgraded">
    <span>کل بانک: <b>${faNum(stats.total)}</b></span>
    <span>نمایش برای فروش: <b>${faNum(stats.active)}</b></span>
    <span>عدم نمایش: <b>${faNum(stats.hidden)}</b></span>
    <span>نتیجه فیلتر: <b>${faNum(stats.filtered)}</b></span>
  </div>${Object.entries(grouped).map(([d,rows])=>{
    const activeRows=rows.filter(h=>h.enabledForStaff!==false).length;
    const photos=rows.reduce((s,h)=>s+hotelCatalogPhotos(h).length,0);
    const star3=rows.filter(h=>Number(h.star)===3).length;
    const star4=rows.filter(h=>Number(h.star)===4).length;
    const star5=rows.filter(h=>Number(h.star)===5).length;
    return `<div class="hotel-destination-group hotel-bank-group-card">
      <div class="hotel-bank-group-head hotel-bank-group-click" onclick="toggleHotelBankGroup('${d}')">
        <div>
          <h4>${d}</h4>
          <p class="small">${faNum(rows.length)} هتل / پکیج ثبت‌شده برای این مقصد</p>
        </div>
        <div class="hotel-bank-group-stats">
          <span>${faNum(activeRows)} فعال</span>
          <span>${faNum(photos)} عکس</span>
          <span>${faNum(star3)}×۳★</span>
          <span>${faNum(star4)}×۴★</span>
          <span>${faNum(star5)}×۵★</span>
        </div>
        <div class="actions" onclick="event.stopPropagation()">
          <button class="soft" onclick="toggleHotelDestination('${d}',true)">نمایش این مقصد</button>
          <button class="soft" onclick="toggleHotelDestination('${d}',false)">عدم نمایش</button>
          <button class="btn" onclick="toggleHotelBankGroup('${d}')">باز/بستن لیست</button>
        </div>
      </div>
      <div id="${safeHotelGroupId(d)}" class="admin-hotel-list hotel-bank-list-modern hotel-bank-accordion-list">
      ${rows.map(h=>`<div class="admin-hotel-card admin-hotel-card-with-photo hotel-bank-card ${h.enabledForStaff!==false?'active-for-staff':'off-for-staff'}">
        <img class="admin-hotel-thumb hotel-bank-thumb" src="${hotelCatalogImage(h)}" onerror="this.src='../assets/images/hotel-placeholder.svg'">
        <div class="admin-hotel-main hotel-bank-card-main">
          <b dir="ltr">${h.nameLatin||'—'}</b>
          <span>${adminHotelStarsFallback(h.star)} ${h.meal?`<em>${h.meal}</em>`:''}</span>
          <small>مقصد: ${h.destination||h.dest||'عمومی'} ${h.catalogType==='combo'?' | پکیج ترکیبی':''}</small>
          <small>منبع: ${h.sourceGroup||'—'}</small>
          <small>عکس‌ها: ${faNum(hotelCatalogPhotos(h).length)}</small>
          ${h.dblPrice||h.sglPrice||h.childPrice?`<small>دو تخته: ${h.dblPrice||'—'} | یک تخته: ${h.sglPrice||'—'} | کودک: ${h.childPrice||'—'}</small>`:''}
          ${h.note?`<small>${h.note}</small>`:''}
        </div>
        <div class="admin-hotel-actions hotel-bank-card-actions">
          <span class="badge ${h.enabledForStaff!==false?'domestic':'gray'}">${h.enabledForStaff!==false?'نمایش برای فروش':'فقط مدیریت'}</span>
          <button class="soft" onclick="toggleHotelPhotoPanel('${h.id}')">کنترل عکس‌ها</button>
          <button class="soft" onclick="editHotelItem('${h.id}')">ویرایش</button>
          <button class="soft" onclick="toggleHotelItem('${h.id}')">${h.enabledForStaff!==false?'عدم نمایش':'نمایش برای فروش'}</button>
          <button class="danger" onclick="deleteHotelItem('${h.id}')">حذف</button>
        </div>
        ${hotelCatalogPhotoPanel(h)}
      </div>`).join('')}</div>
    </div>`
  }).join('')||'<div class="empty-state-mini">موردی پیدا نشد.</div>'}`;
}
function toggleHotelDestination(dest,on){
  saveHotelCatalog(hotelCatalog().map(h=>(h.destination||h.dest||'عمومی')===dest?{...h,enabledForStaff:!!on}:h));
  renderHotelCatalog();
  showToast(on?'این مقصد برای فروش فعال شد':'این مقصد از پنل فروش مخفی شد');
}
function bulkToggleHotelCatalog(on){
  if(!confirm(on?'همه هتل‌ها برای فروش نمایش داده شوند؟':'همه هتل‌ها از پنل فروش مخفی شوند؟'))return;
  saveHotelCatalog(hotelCatalog().map(h=>({...h,enabledForStaff:!!on})));
  renderHotelCatalog();
  showToast('وضعیت بانک هتل‌ها تغییر کرد');
}

function toggleVisaItem(id){saveVisaServices(visaServices().map(v=>v.id===id?{...v,active:v.active===false}:v));renderVisas()}
function deleteVisaItem(id){if(confirm('حذف شود؟')){saveVisaServices(visaServices().filter(v=>v.id!==id));renderVisas()}}



function airlineLogoAdmin(a){
  return a.logo?`<img src="${a.logo}" onerror="this.style.display='none'">`:`<span>${(a.nameFa||a.nameEn||'A').slice(0,1)}</span>`;
}
function renderAirlineCatalog(){
  const box=$('airlineCatalogTable');if(!box)return;
  const q=($('airlineSearch')?.value||'').trim().toLowerCase();
  const type=$('airlineTypeFilter')?.value||'all';
  const show=$('airlineShowFilter')?.value||'all';
  let list=airlineCatalog();
  if(q)list=list.filter(a=>(a.nameFa+' '+a.nameEn+' '+a.code).toLowerCase().includes(q));
  if(type!=='all')list=list.filter(a=>a.type===type);
  if(show==='on')list=list.filter(a=>a.enabledForStaff!==false);
  if(show==='off')list=list.filter(a=>a.enabledForStaff===false);
  const grouped=list.reduce((acc,a)=>{const k=a.type==='domestic'?'داخلی':'خارجی';(acc[k]||(acc[k]=[])).push(a);return acc},{});
  box.innerHTML=`<div class="airline-bank-summary">
    <span>کل ایرلاین‌ها: <b>${faNum(airlineCatalog().length)}</b></span>
    <span>نمایش برای فروش: <b>${faNum(airlineCatalog().filter(a=>a.enabledForStaff!==false).length)}</b></span>
    <span>نتیجه فیلتر: <b>${faNum(list.length)}</b></span>
  </div>${Object.entries(grouped).map(([group,rows])=>`<div class="airline-group-card">
    <div class="airline-group-head"><h4>${group}</h4><span>${faNum(rows.length)} مورد</span></div>
    <div class="airline-card-list">${rows.map(a=>`<div class="airline-admin-card ${a.enabledForStaff!==false?'active-for-staff':'off-for-staff'}">
      <div class="airline-logo-admin">${airlineLogoAdmin(a)}</div>
      <div class="airline-info-admin"><b>${a.nameFa||'—'}</b><small dir="ltr">${a.nameEn||'—'} ${a.code?`| ${a.code}`:''}</small>${a.note?`<small>${a.note}</small>`:''}</div>
      <div class="airline-actions-admin">
        <span class="badge ${a.enabledForStaff!==false?'domestic':'gray'}">${a.enabledForStaff!==false?'نمایش برای فروش':'فقط مدیریت'}</span>
        <button class="soft" onclick="editAirlineItem('${a.id}')">ویرایش</button>
        <button class="soft" onclick="toggleAirlineItem('${a.id}')">${a.enabledForStaff!==false?'عدم نمایش':'نمایش برای فروش'}</button>
        <button class="danger" onclick="deleteAirlineItem('${a.id}')">حذف</button>
      </div>
    </div>`).join('')}</div>
  </div>`).join('')||'<div class="empty-state-mini">ایرلاینی پیدا نشد.</div>'}`;
}
function saveAirlineItem(){
  const nameFa=$('airlineNameFa')?.value?.trim()||'';
  if(!nameFa)return alert('نام فارسی ایرلاین را وارد کن');
  const editId=$('airlineNameFa').dataset.editId||'';
  const item={
    id:editId||'air-'+Date.now(),
    nameFa,
    nameEn:$('airlineNameEn')?.value?.trim()||'',
    code:$('airlineCode')?.value?.trim()||'',
    logo:$('airlineLogo')?.value?.trim()||'',
    type:$('airlineType')?.value||'international',
    enabledForStaff:$('airlineEnabled')?.value==='true',
    note:$('airlineNote')?.value?.trim()||''
  };
  const list=airlineCatalog();
  const i=list.findIndex(a=>a.id===editId);
  if(i>=0)list[i]={...list[i],...item};else list.push(item);
  saveAirlineCatalog(list);
  ['airlineNameFa','airlineNameEn','airlineCode','airlineLogo','airlineNote'].forEach(id=>{if($(id))$(id).value=''});
  if($('airlineNameFa'))$('airlineNameFa').dataset.editId='';
  if($('airlineType'))$('airlineType').value='international';
  if($('airlineEnabled'))$('airlineEnabled').value='true';
  renderAirlineCatalog();
  showToast(editId?'ایرلاین ویرایش شد':'ایرلاین اضافه شد');
}
function editAirlineItem(id){
  const a=airlineCatalog().find(x=>x.id===id);if(!a)return;
  $('airlineNameFa').value=a.nameFa||'';
  $('airlineNameFa').dataset.editId=id;
  $('airlineNameEn').value=a.nameEn||'';
  $('airlineCode').value=a.code||'';
  $('airlineLogo').value=a.logo||'';
  $('airlineType').value=a.type||'international';
  $('airlineEnabled').value=String(a.enabledForStaff!==false);
  $('airlineNote').value=a.note||'';
  document.getElementById('admin-airlines')?.scrollIntoView({behavior:'smooth'});
  showToast('ایرلاین برای ویرایش آماده شد');
}
function toggleAirlineItem(id){
  saveAirlineCatalog(airlineCatalog().map(a=>a.id===id?{...a,enabledForStaff:!(a.enabledForStaff!==false)}:a));
  renderAirlineCatalog();
  showToast('وضعیت ایرلاین تغییر کرد');
}
function deleteAirlineItem(id){
  if(!confirm('این ایرلاین حذف شود؟'))return;
  saveAirlineCatalog(airlineCatalog().filter(a=>a.id!==id));
  renderAirlineCatalog();
  showToast('ایرلاین حذف شد');
}
function bulkToggleAirlines(on){
  if(!confirm(on?'همه ایرلاین‌ها برای فروش نمایش داده شوند؟':'همه ایرلاین‌ها از پنل فروش مخفی شوند؟'))return;
  saveAirlineCatalog(airlineCatalog().map(a=>({...a,enabledForStaff:!!on})));
  renderAirlineCatalog();
  showToast('وضعیت ایرلاین‌ها تغییر کرد');
}
function resetAirlines(){
  if(!confirm('لیست ایرلاین‌ها به نمونه اولیه برگردد؟'))return;
  saveAirlineCatalog(defaultAirlineCatalog());
  renderAirlineCatalog();
}


function renderAllHotelNames(list=hotelCatalog()){
  const box=$('allHotelNamesList');if(!box)return;
  const rows=list.slice().sort((a,b)=>String(a.destination||'').localeCompare(String(b.destination||''),'fa')||String(a.nameLatin||'').localeCompare(String(b.nameLatin||'')));
  box.innerHTML=rows.map(h=>`<span><b dir="ltr">${h.nameLatin||'—'}</b><small>${h.destination||h.dest||'عمومی'} | ${h.star}★ ${h.meal?`| ${h.meal}`:''}</small></span>`).join('')||'<em>هتلی ثبت نشده است.</em>';
}
function renderAllVisaNames(list=visaServices()){
  const box=$('allVisaNamesList');if(!box)return;
  box.innerHTML=list.map(v=>`<span><b>${v.country||'—'} ${v.city?`- ${v.city}`:''}</b><small>${v.type||'توریستی'} | ${v.active!==false?'فعال':'غیرفعال'}</small></span>`).join('')||'<em>ویزایی ثبت نشده است.</em>';
}
function currencyAdminCard(c){return `<div class="currency-admin-card ${c.enabledForBuyer?'active-for-buyer':'off-for-buyer'}">
  <div class="currency-code-badge" dir="ltr">${c.code}</div>
  <div class="currency-admin-info"><b>${c.nameFa||c.code}</b><small dir="ltr">${c.nameEn||'—'} | ${c.symbol||c.code}</small>${c.rate?`<small>نرخ: ${c.rate}</small>`:''}</div>
  <div class="currency-admin-actions"><span class="badge ${c.enabledForBuyer?'domestic':'gray'}">${c.enabledForBuyer?'نمایش در خریدار':'فقط مدیریت'}</span><button class="soft" onclick="editCurrencyItem('${c.code}')">ویرایش</button><button class="soft" onclick="toggleCurrencyItem('${c.code}')">${c.enabledForBuyer?'عدم نمایش':'نمایش در خریدار'}</button><button class="danger" onclick="deleteCurrencyItem('${c.code}')">حذف</button></div>
</div>`}
function renderCurrencyCatalog(){
  const box=$('currencyCatalogTable');if(!box)return;
  const q=($('currencySearch')?.value||'').trim().toLowerCase();
  const show=$('currencyShowFilter')?.value||'all';
  let list=currencyCatalog();
  if(q)list=list.filter(c=>(c.code+' '+c.nameFa+' '+c.nameEn+' '+c.symbol).toLowerCase().includes(q));
  if(show==='on')list=list.filter(c=>c.enabledForBuyer===true);
  if(show==='off')list=list.filter(c=>c.enabledForBuyer!==true);
  box.innerHTML=`<div class="currency-summary"><span>کل ارزها: <b>${faNum(currencyCatalog().length)}</b></span><span>نمایش در خریدار: <b>${faNum(currencyCatalog().filter(c=>c.enabledForBuyer).length)}</b></span><span>نتیجه فیلتر: <b>${faNum(list.length)}</b></span></div><div class="currency-card-list">${list.map(currencyAdminCard).join('')||'<div class="empty-state-mini">ارزی پیدا نشد.</div>'}</div>`;
}
function saveCurrencyItem(){
  const code=String($('currencyCode')?.value||'').trim().toUpperCase();if(!code)return alert('کد ارز را وارد کن');
  const item={id:'cur-'+code,code,nameFa:$('currencyNameFa')?.value?.trim()||currencyNameFa(code),nameEn:$('currencyNameEn')?.value?.trim()||currencyNameEn(code),symbol:$('currencySymbol')?.value?.trim()||code,rate:$('currencyRate')?.value?.trim()||'',enabledForBuyer:$('currencyBuyerShow')?.value==='true'};
  const list=currencyCatalog();const i=list.findIndex(c=>c.code===code);if(i>=0)list[i]={...list[i],...item};else list.push(item);
  saveCurrencyCatalog(list);['currencyCode','currencyNameFa','currencyNameEn','currencySymbol','currencyRate'].forEach(id=>{if($(id))$(id).value=''});if($('currencyBuyerShow'))$('currencyBuyerShow').value='false';renderCurrencyCatalog();showToast('ارز ذخیره شد');
}
function editCurrencyItem(code){const c=currencyCatalog().find(x=>x.code===code);if(!c)return;$('currencyCode').value=c.code;$('currencyNameFa').value=c.nameFa||'';$('currencyNameEn').value=c.nameEn||'';$('currencySymbol').value=c.symbol||'';$('currencyRate').value=c.rate||'';$('currencyBuyerShow').value=String(c.enabledForBuyer===true);document.getElementById('admin-currencies')?.scrollIntoView({behavior:'smooth'});}
function toggleCurrencyItem(code){saveCurrencyCatalog(currencyCatalog().map(c=>c.code===code?{...c,enabledForBuyer:!c.enabledForBuyer}:c));renderCurrencyCatalog();showToast('وضعیت نمایش ارز تغییر کرد')}
function deleteCurrencyItem(code){if(!confirm('این ارز حذف شود؟'))return;saveCurrencyCatalog(currencyCatalog().filter(c=>c.code!==code));renderCurrencyCatalog();}
function bulkToggleCurrencies(on){if(!confirm(on?'همه ارزها در پنل خریدار نمایش داده شوند؟':'همه ارزها از پنل خریدار مخفی شوند؟'))return;saveCurrencyCatalog(currencyCatalog().map(c=>({...c,enabledForBuyer:!!on})));renderCurrencyCatalog();}
function resetCurrencies(){if(!confirm('لیست ارزها به حالت جهانی اولیه برگردد؟'))return;saveCurrencyCatalog(defaultCurrencyCatalog());renderCurrencyCatalog();}

function renderVisas(){
  const box=$('visaTable');if(!box)return;
  const list=visaServices();
  renderAllVisaNames(list);
  box.innerHTML=`<div class="list-title-line"><h4>لیست ویزاها</h4><span class="small">هر ویزا را ویرایش کن تا در پنل مشتری به صورت بازشو نمایش داده شود.</span></div>
  <div class="admin-edit-list">${list.map(v=>`<div class="admin-edit-row visa-admin-row">
    <div>
      <b>${v.country||'—'} ${v.city?`- ${v.city}`:''}</b>
      <div class="muted-line">مدارک: ${v.docs||'—'}</div>
      <div class="muted-line">توضیحات: ${v.details||'—'}</div>
    </div>
    <div><b>${Number(v.price||0)>0?money(v.price):'بدون هزینه ویزا'}</b></div>
    <div><span class="kpi-mini">${v.active!==false?'فعال':'غیرفعال'}</span><div class="muted-line">${v.duration||'—'}</div></div>
    <div class="admin-edit-row-actions">
      <button class="soft" onclick="editVisaItem('${v.id}')">ویرایش</button>
      <button class="soft" onclick="toggleVisaItem('${v.id}')">${v.active!==false?'غیرفعال':'فعال'}</button>
      <button class="danger" onclick="deleteVisaItem('${v.id}')">حذف</button>
    </div>
  </div>`).join('')||'<div class="empty-state-mini">هنوز ویزایی ثبت نشده است.</div>'}</div>`;
}
function saveVisaItem(){
  const id=$('visaId')?.value||'visa-'+Date.now();
  const item={
    id,
    country:$('visaCountry')?.value?.trim()||'',
    city:$('visaCity')?.value?.trim()||'',
    price:Number($('visaPrice')?.value)||0,
    duration:$('visaDuration')?.value?.trim()||'',
    type:'توریستی',
    docs:$('visaDocs')?.value?.trim()||'',
    details:$('visaDetails')?.value?.trim()||'',
    active:true
  };
  if(!item.country)return alert('کشور را وارد کنید');
  const list=visaServices();
  const i=list.findIndex(v=>v.id===id);
  if(i>=0)list[i]={...list[i],...item,active:list[i].active!==false};else list.push(item);
  saveVisaServices(list);
  ['visaId','visaCountry','visaCity','visaPrice','visaDuration','visaDocs','visaDetails'].forEach(id=>{if($(id))$(id).value=''});
  renderVisas();
  showToast('ویزای مورد نظر ذخیره شد');
}
function editVisaItem(id){
  const v=visaServices().find(x=>x.id===id);if(!v)return;
  if($('visaId'))$('visaId').value=v.id;
  if($('visaCountry'))$('visaCountry').value=v.country||'';
  if($('visaCity'))$('visaCity').value=v.city||'';
  if($('visaPrice'))$('visaPrice').value=v.price||0;
  if($('visaDuration'))$('visaDuration').value=v.duration||'';
  if($('visaDocs'))$('visaDocs').value=v.docs||'';
  if($('visaDetails'))$('visaDetails').value=v.details||v.description||v.note||'';
  document.getElementById('admin-visas')?.scrollIntoView({behavior:'smooth'});
}
function toggleVisaItem(id){saveVisaServices(visaServices().map(v=>v.id===id?{...v,active:v.active===false}:v));renderVisas()}
function deleteVisaItem(id){if(confirm('حذف شود؟')){saveVisaServices(visaServices().filter(v=>v.id!==id));renderVisas()}}

function renderDiscounts(){const ds=discounts();$('discountTable').innerHTML=`<table><thead><tr><th>کد</th><th>نوع</th><th>مقدار</th><th>حداقل</th><th>محدودیت</th><th>وضعیت</th><th>عملیات</th></tr></thead><tbody>${ds.map((d,i)=>`<tr><td><b>${d.code}</b></td><td>${d.type==='fixed'?'مبلغ ثابت':'درصدی'}</td><td>${d.type==='fixed'?money(d.value):faNum(d.value)+'٪'}</td><td>${money(d.min||0)}</td><td>${d.tourId}</td><td>${d.active?'فعال':'غیرفعال'}</td><td><button class="soft" onclick="toggleDiscount(${i})">${d.active?'غیرفعال':'فعال'}</button><button class="danger" onclick="delDiscount(${i})">حذف</button></td></tr>`).join('')}</tbody></table>`}
function addDiscount(){const ds=discounts();ds.push({code:$('dcode').value.toUpperCase(),type:$('dtype').value,value:Number($('dvalue').value),min:Number($('dmin').value)||0,tourId:$('dtour').value,active:true,used:0,limit:100,expires:''});saveDiscounts(ds);renderDiscounts()}
function toggleDiscount(i){const ds=discounts();ds[i].active=!ds[i].active;saveDiscounts(ds);renderDiscounts()}
function delDiscount(i){const ds=discounts();ds.splice(i,1);saveDiscounts(ds);renderDiscounts()}

function renderOrders(){let os=orders();const q=$('q')?.value?.trim().toLowerCase()||'',sf=$('statusFilter')?.value||'all';if(q)os=os.filter(o=>o.name.toLowerCase().includes(q)||o.phone.includes(q)||o.id.toLowerCase().includes(q));if(sf!=='all')os=os.filter(o=>o.status===sf);$('ordersTable').innerHTML=`<table><thead><tr><th>کد/مسافر</th><th>تور</th><th>هتل</th><th>تاریخ</th><th>ردپای مشتری</th><th>مبلغ</th><th>وضعیت</th><th>یادداشت</th><th>عملیات</th></tr></thead><tbody>${os.map(o=>`<tr><td><b>${o.id}</b><br>${o.name}<br><small dir="ltr">${o.phone}</small></td><td>${o.tourTitle}</td><td>${o.hotelName}</td><td>${o.date}</td><td class="admin-trail-cell">${(o.viewedTours||[]).map(x=>`<span class="customer-trail-chip">${x.tourTitle}</span>`).join('')||o.viewedToursText||'—'}</td><td>${money(o.totalPrice)}</td><td><select class="field" onchange="changeStatus('${o.id}',this.value)">${['در انتظار تماس','تماس گرفته شد','تایید شده','لغو شده','پرداخت شده'].map(s=>`<option ${o.status===s?'selected':''}>${s}</option>`).join('')}</select></td><td><textarea class="field" rows="2" onchange="changeNote('${o.id}',this.value)">${o.adminNote||''}</textarea></td><td><button class="danger" onclick="delOrder('${o.id}')">حذف</button></td></tr>`).join('')}</tbody></table>`}
function changeStatus(id,v){saveOrders(orders().map(o=>o.id===id?{...o,status:v}:o));renderOrders();renderCustomerTrailAdmin()}
function changeNote(id,v){saveOrders(orders().map(o=>o.id===id?{...o,adminNote:v}:o))}
function delOrder(id){if(confirm('رزرو حذف شود؟')){saveOrders(orders().filter(o=>o.id!==id));renderOrders();renderCustomerTrailAdmin()}}
document.addEventListener('DOMContentLoaded',initAdmin);


function resetDefaultHotels(){
  if(!confirm('بانک هتل‌ها به لیست واردشده اولیه برگردد؟ وضعیت‌های فعال/غیرفعال قبلی پاک می‌شود.'))return;
  saveHotelCatalog(defaultHotelCatalog());
  const sel=$('hotelCatalogDestFilter');if(sel)sel.dataset.ready='';
  renderHotelCatalog();
  showToast('بانک هتل‌ها بازگردانی شد');
}
function syncCatalogHotelsToTours(){
  const active=hotelCatalog().filter(h=>h.enabledForStaff!==false);
  if(!active.length){alert('هیچ هتلی برای فروش فعال نیست');return}
  if(!confirm('هتل‌های فعال مدیریت روی تورهای هم‌مقصد اضافه شوند؟'))return;
  const ts=tours().map(t=>{
    const dest=String(t.dest||'');
    const matches=active.filter(h=>{
      const d=String(h.destination||h.dest||'');
      return d && (dest.includes(d)||d.includes(dest));
    }).slice(0,15);
    if(!matches.length)return t;
    const existing=new Set((t.hotels||[]).map(h=>String(h.name||h.nameLatin||'').toLowerCase()));
    const add=matches.filter(h=>!existing.has(String(h.nameLatin||'').toLowerCase())).map(h=>({
      hotelId:h.id,
      name:h.nameLatin,
      star:h.star,
      price:Number(h.price||h.dblPrice?.replace(/[^\d]/g,'')||t.price||0),
      capacity:0,
      showInBuyer:false,
      bookingLink:'',
      photos:[],
      meal:h.meal||h.board||'',
      sourceGroup:h.sourceGroup||''
    }));
    return {...t,hotels:[...(t.hotels||[]),...add],lastEditedBy:'مدیریت',lastEditedAt:new Date().toISOString()};
  });
  saveTours(ts);
  renderCurrentTourHotels();
  showToast('هتل‌های فعال به تورهای هم‌مقصد اضافه شدند');
}
