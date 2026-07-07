
function hotelStars(n){return `<span class="hotel-stars">${Array.from({length:Number(n)||0}).map(()=>'<i class="fa-solid fa-star"></i>').join('')}</span>`}
function defaultSections(){return{description:true,flightInfo:true,dates:true,hotels:true,gallery:true,itinerary:true,docs:true,includes:true,excludes:true,cancellation:true,childPolicy:true,reviews:true}}
function sectionVal(id){return !!$(id)?.checked}
function setSectionToggles(t){const v=Object.assign(defaultSections(),t?.sectionVisibility||{});Object.entries({visDescription:'description',visFlightInfo:'flightInfo',visDates:'dates',visHotels:'hotels',visItinerary:'itinerary',visDocs:'docs',visIncludes:'includes',visExcludes:'excludes',visCancellation:'cancellation',visChildPolicy:'childPolicy',visReviews:'reviews'}).forEach(([id,key])=>{if($(id))$(id).checked=v[key]!==false})}
function currentStaffAccount(){
  try{
    const u=currentStaffUser();
    if(!u)return null;
    return staffAccounts().find(a=>a.username===u.username || a.id===u.id) || null;
  }catch(e){return null}
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
function renderStaff(){
  const q=$('staffSearch')?.value?.trim().toLowerCase()||'', user=currentStaffUser();
  let list=tours();if(q)list=list.filter(t=>t.title.toLowerCase().includes(q)||t.dest.toLowerCase().includes(q));
  $('app').innerHTML=`<div class="card pad row wrap" style="margin-top:22px"><div><span class="badge special">پنل فروش</span><h1>مدیریت تورها</h1><p class="small">وارد شده با: <b>${user?.name||user?.username||'فروش'}</b></p>${currentStaffAccount()?.taskNote?`<div class="staff-task-note"><b>توضیحات مدیریت برای شما:</b><br>${currentStaffAccount().taskNote}</div>`:''}</div><div class="actions"><button class="soft" onclick="logoutRole('staff')">خروج</button><button class="btn" onclick="openForm()">افزودن تور</button></div></div>
  ${priceImportBox()}${batchPriceBox()}
  <div class="card pad" style="margin:16px 0"><input id="staffSearch" class="field" placeholder="جستجو..." oninput="renderStaff()" value="${q}"></div>
  <div class="card table-wrap"><table><thead><tr><th>عکس</th><th>عنوان</th><th>مقصد</th><th>قیمت شروع</th><th>ظرفیت</th><th>وضعیت</th><th>آخرین ویرایش</th><th>عملیات</th></tr></thead><tbody>${list.map(t=>`<tr><td><img src="${t.img}" style="width:55px;height:55px;object-fit:cover;border-radius:12px"></td><td><b>${t.title}</b><br><small>${badges(t)}</small></td><td>${t.dest}</td><td>${money(minHotel(t).price)}</td><td>${faNum(totalCapacity(t))}</td><td>${t.status}</td><td><span class="last-edited">${t.lastEditedBy||'—'}<br>${t.lastEditedAt?new Date(t.lastEditedAt).toLocaleString('fa-IR'):''}</span></td><td><button class="soft" onclick="openForm(${t.id})">ویرایش</button><button class="danger" onclick="delTour(${t.id})">حذف</button></td></tr>`).join('')}</tbody></table></div>`;
}
function priceImportBox(){
  return `<section class="price-import-box"><h3>آپدیت قیمت با شیت</h3><p class="small">فایل CSV خروجی گرفته‌شده از شیت نمونه را آپلود کن تا قیمت‌ها و ظرفیت‌ها آپدیت شوند.</p><input id="staffPriceImport" class="field" type="file" accept=".csv,.txt"><button class="btn" style="margin-top:10px" onclick="importPriceSheet('staffPriceImport','staffImportResult')">آپلود و آپدیت قیمت‌ها</button><div id="staffImportResult" class="import-result"></div></section>`;
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
  return `<section class="batch-box"><h3>آپدیت گروهی قیمت هتل‌ها</h3><p class="small">تورهای موردنظر، ستاره هتل و مبلغ افزایش قیمت را انتخاب کن.</p><div class="grid g3"><div><label class="label">انتخاب تورها</label><select id="batchTours" class="field" multiple size="5">${ts.map(t=>`<option value="${t.id}">${t.title}</option>`).join('')}</select></div><div><label class="label">هتل‌ها</label><div class="batch-options"><label><input type="checkbox" id="batchStar3" checked> ۳ ستاره</label><label><input type="checkbox" id="batchStar4" checked> ۴ ستاره</label><label><input type="checkbox" id="batchStar5" checked> ۵ ستاره</label></div></div><div><label class="label">مبلغ افزایش برای هر نفر</label><input id="batchAmount" class="field" type="number" placeholder="مثلاً 500000"><button class="btn" style="width:100%;margin-top:10px" onclick="batchUpdatePrices()">اعمال افزایش قیمت</button></div></div></section>`;
}
function batchUpdatePrices(){
  const ids=[...$('batchTours').selectedOptions].map(o=>Number(o.value));
  const amount=Number($('batchAmount').value)||0;
  const stars=[3,4,5].filter(s=>$('batchStar'+s)?.checked);
  if(!ids.length||!amount||!stars.length){alert('تور، ستاره و مبلغ را انتخاب کنید');return}
  const user=currentStaffUser();
  const ts=tours().map(t=>ids.includes(t.id)?{...t,hotels:(t.hotels||[]).map(h=>stars.includes(Number(h.star))?{...h,price:Number(h.price||0)+amount}:h),lastEditedBy:user?.name||user?.username||'فروش',lastEditedAt:new Date().toISOString()}:t);
  saveTours(ts);showToast('قیمت‌ها آپدیت شد');renderStaff();
}
function catalogForStar(star){
  const list=hotelCatalog().filter(h=>Number(h.star)===Number(star)&&h.enabledForStaff!==false);
  const padded=[...list];
  for(let i=padded.length;i<5;i++)padded.push({id:`custom-${star}-${i+1}`,star,nameLatin:`Hotel ${star} Star ${i+1}`,enabledForStaff:true,custom:true});
  return padded.slice(0,5);
}
function renderHotelEditor(t){
  const box=$('hotelEditor');if(!box)return;
  box.innerHTML=[3,4,5].map(star=>{
    const catalog=catalogForStar(star);
    const existing=(t?.hotels||[]).filter(h=>Number(h.star)===star);
    return `<div class="hotel-editor-star"><h4>هتل‌های ${hotelStars(star)} <small class="small">حداکثر ۵ هتل؛ تیک نمایش یعنی در پنل مشتری دیده شود.</small></h4>${catalog.map((c,i)=>{
      const ex=existing.find(h=>h.hotelId===c.id)||existing[i]||{};
      const show=ex.showInBuyer!==false;
      return `<div class="hotel-edit-row">
        <div><input type="hidden" id="hotel_${star}_${i}_id" value="${c.id}"><input type="hidden" id="hotel_${star}_${i}_name" value="${c.nameLatin}"><div class="hotel-name-latin">${c.nameLatin}</div></div>
        <input id="hotel_${star}_${i}_price" class="field" type="number" placeholder="قیمت" value="${ex.price||''}">
        <input id="hotel_${star}_${i}_cap" class="field" type="number" placeholder="ظرفیت" value="${ex.capacity||''}">
        <label class="row" style="justify-content:flex-start"><input id="hotel_${star}_${i}_show" type="checkbox" ${show?'checked':''}> نمایش</label>
      </div>`;
    }).join('')}</div>`;
  }).join('');
}
function collectHotels(basePrice){
  const out=[];
  [3,4,5].forEach(star=>{
    for(let i=0;i<5;i++){
      const id=$(`hotel_${star}_${i}_id`)?.value;
      const name=$(`hotel_${star}_${i}_name`)?.value;
      const price=Number($(`hotel_${star}_${i}_price`)?.value)||basePrice;
      const capacity=Number($(`hotel_${star}_${i}_cap`)?.value)||0;
      const show=$(`hotel_${star}_${i}_show`)?.checked;
      if(id&&name)out.push({hotelId:id,star,name,price,capacity,showInBuyer:!!show});
    }
  });
  return out;
}
function openForm(id){
  const t=id?findTour(id):null;$('modal').classList.add('on');$('formTitle').textContent=t?'ویرایش تور':'افزودن تور';$('tid').value=t?.id||'';
  ['title','dest','duration','airline','returnAirline','flightTime','returnFlightTime','price','dates','desc','itinerary','docs','includes','excludes','cancel','child','oldPrice','newPrice','dealPercent','dealEndsAtFa'].forEach(x=>{if($(x))$(x).value=''});
  if(t){
    $('title').value=t.title;$('dest').value=t.dest;$('duration').value=t.duration;$('airline').value=t.airline||'';$('returnAirline').value=t.returnAirline||t.airline||'';$('flightTime').value=t.flightTime||'';$('returnFlightTime').value=t.returnFlightTime||t.landingTime||'';$('price').value=t.price;$('dates').value=(t.dates||[]).join('\n');$('desc').value=t.desc||'';$('itinerary').value=(t.itinerary||[]).join('\n');$('docs').value=(t.docs||[]).join('\n');$('includes').value=(t.includes||[]).join('\n');$('excludes').value=(t.excludes||[]).join('\n');$('cancel').value=t.cancellation||'';$('child').value=t.childPolicy||'';$('type').value=t.type;$('level').value=t.level||'';$('status').value=t.status;$('lastMinute').checked=!!t.lastMinute;$('oldPrice').value=t.oldPrice||'';$('newPrice').value=t.newPrice||'';$('dealPercent').value=t.dealPercent||0;$('dealEndsAtFa').value=t.dealEndsAtFa||'';renderHotelEditor(t);setSectionToggles(t)
  }else{
    $('type').value='international';$('level').value='special';$('status').value='active';$('lastMinute').checked=false;$('oldPrice').value='';$('newPrice').value='';$('dealPercent').value=10;$('dealEndsAtFa').value='۱۴۰۵/۰۵/۳۰ ۲۳:۵۹';renderHotelEditor(null);setSectionToggles(null)
  }
}
function closeForm(){$('modal').classList.remove('on')}
function saveTour(e){
  e.preventDefault();
  const ts=tours();
  const id=$('tid').value?Number($('tid').value):Date.now();
  const price=Number($('price').value)||0;
  const type=$('type').value;
  const level=$('level').value;
  const cats=[type];
  const user=currentStaffUser();
  if(level)cats.push(level);
  const oldTour=findTour(id);
  const special=$('lastMinute').checked;
  const parsedEnd=parseFaDiscountDate($('dealEndsAtFa').value);
  const data={
    id,
    title:$('title').value,
    dest:$('dest').value,
    duration:$('duration').value,
    airline:$('airline').value,
    returnAirline:$('returnAirline').value||$('airline').value,
    flightTime:$('flightTime').value||'۰۸:۳۰',
    returnFlightTime:$('returnFlightTime').value||'',
    price,
    label:special?'ویژه':'',
    type,
    level,
    categories:cats,
    rating:oldTour?.rating||4.5,
    status:$('status').value,
    lastMinute:special,
    oldPrice:Number($('oldPrice').value)||0,
    newPrice:Number($('newPrice').value)||0,
    dealPercent:special?(Number($('dealPercent').value)||0):0,
    dealEndsAtFa:$('dealEndsAtFa').value||'',
    dealEndsAt:parsedEnd?parsedEnd.toISOString():new Date(Date.now()+24*3600000).toISOString(),
    img:oldTour?.img||DEFAULT_IMG,
    gallery:oldTour?.gallery||[],
    dates:$('dates').value.split('\\n').map(x=>x.trim()).filter(Boolean),
    hotels:collectHotels(price),
    desc:$('desc').value||'تور ثبت شده توسط فروش.',
    includes:($('includes').value||'ترانسفر\\nبیمه\\nصبحانه').split('\\n').map(x=>x.trim()).filter(Boolean),
    excludes:($('excludes').value||'').split('\\n').map(x=>x.trim()).filter(Boolean),
    itinerary:($('itinerary').value||'').split('\\n').map(x=>x.trim()).filter(Boolean),
    docs:($('docs').value||'').split('\\n').map(x=>x.trim()).filter(Boolean),
    cancellation:$('cancel').value,
    childPolicy:$('child').value,
    sectionVisibility:collectSectionVisibility(),
    reviews:oldTour?.reviews||[],
    lastEditedBy:user?.name||user?.username||'فروش',
    lastEditedAt:new Date().toISOString()
  };
  const i=ts.findIndex(x=>x.id===id);
  if(i>=0)ts[i]=data;else ts.push(data);
  saveTours(ts);
  closeForm();
  renderStaff();
  showToast('تور ذخیره شد');
}

function delTour(id){if(confirm('تور حذف شود؟')){saveTours(tours().filter(t=>t.id!==id));renderStaff()}}
document.addEventListener('DOMContentLoaded',initStaff);
