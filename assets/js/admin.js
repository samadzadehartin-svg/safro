
function initAdmin(){mount('admin');if(!authGate('admin'))return renderLogin();renderAdmin()}
function renderLogin(){$('app').innerHTML=`<div class="card pad login-box"><h2>ورود مدیریت</h2><p class="small">رمز دمو: admin123</p><input id="pass" class="field" type="password" placeholder="رمز"><button class="btn" style="width:100%;margin-top:12px" onclick="doLogin()">ورود</button></div>`}
function doLogin(){if(loginRole('admin',$('pass').value))location.reload();else alert('رمز اشتباه است')}

function renderAdmin(){
  const os=orders(),sales=os.reduce((s,o)=>s+Number(o.totalPrice||0),0);
  $('app').innerHTML=`<div class="card pad row wrap" style="margin-top:22px"><div><span class="badge international">پنل مدیریت</span><h1>داشبورد مدیریت</h1></div><button class="soft" onclick="logoutRole('admin')">خروج</button></div>
  <section class="grid g4" style="margin:16px 0">
    <div class="card pad"><span class="small">کل رزروها</span><b class="price">${faNum(os.length)}</b></div>
    <div class="card pad"><span class="small">در انتظار</span><b class="price">${faNum(os.filter(o=>o.status==='در انتظار تماس').length)}</b></div>
    <div class="card pad"><span class="small">فروش</span><b class="price">${money(sales)}</b></div>
    <div class="card pad"><span class="small">تور فعال</span><b class="price">${faNum(tours().filter(t=>t.status==='active').length)}</b></div>
  </section>

  <section class="card pad" style="margin-bottom:16px">
    <h3>مدیریت یوزرنیم و پسورد پرسنل</h3>
    <p class="small">برای هر پرسنل یک نام کاربری و رمز جدا بساز. کارمند با همین اطلاعات وارد پنل کارمند می‌شود و نامش روی ویرایش‌ها ثبت می‌شود.</p>
    <div class="admin-mini-grid">
      <input id="staffFullName" class="field" placeholder="نام کارمند">
      <input id="staffUsername" class="field" placeholder="Username" dir="ltr">
      <input id="staffPassword" class="field" placeholder="Password" dir="ltr">
      <select id="staffActive" class="field"><option value="true">فعال</option><option value="false">غیرفعال</option></select>
      <button class="btn" onclick="saveStaffAccount()">ذخیره کارمند</button>
    </div>
    <div id="staffAccountsTable" class="table-wrap staff-account-table" style="margin-top:12px"></div>
  </section>

  <section class="card pad" style="margin-bottom:16px"><h3>آپدیت قیمت با شیت</h3><p class="small">فایل CSV خروجی گرفته‌شده از شیت نمونه را اینجا آپلود کن تا قیمت‌ها، ظرفیت‌ها و تخفیف دستی آپدیت شوند.</p><div class="price-import-box"><input id="adminPriceImport" class="field" type="file" accept=".csv,.txt"><button class="btn" onclick="importPriceSheet('adminPriceImport','adminImportResult')">آپلود و آپدیت قیمت‌ها</button><div id="adminImportResult" class="import-result"></div></div></section>

  <section class="card pad" style="margin-bottom:16px">
    <h3>مدیریت هتل‌ها برای قیمت‌گذاری کارمندان</h3>
    <p class="small">نام هتل را لاتین وارد کن و مشخص کن کدام هتل‌ها در پنل کارمند برای قیمت‌گذاری نمایش داده شوند.</p>
    <div class="admin-mini-grid">
      <input id="hotelLatinName" class="field" placeholder="Hotel Latin Name" dir="ltr">
      <select id="hotelStar" class="field"><option value="3">۳ ستاره</option><option value="4">۴ ستاره</option><option value="5">۵ ستاره</option></select>
      <select id="hotelEnabled" class="field"><option value="true">نمایش برای کارمند</option><option value="false">عدم نمایش</option></select>
      <button class="btn" onclick="saveHotelItem()">افزودن هتل</button>
      <button class="soft" onclick="resetDefaultHotels()">بازگردانی نمونه‌ها</button>
    </div>
    <div id="hotelCatalogTable" class="table-wrap hotel-admin-table" style="margin-top:12px"></div><div class="current-hotels-box"><h3>هتل‌های فعلی ثبت‌شده در تورها</h3><p class="small">اینجا هتل‌هایی که در خود تورها قیمت‌گذاری شده‌اند دیده می‌شوند و می‌توانی نمایش آن‌ها در پنل خریدار را فعال/غیرفعال کنی.</p><div id="currentTourHotelsTable" class="table-wrap"></div></div>
  </section>

  <section class="card pad" style="margin-bottom:16px">
    <div class="row wrap"><div><h3>لیست تماس و مشاوره رایگان</h3><p class="small">شماره‌هایی که در بخش «تور خودتو بساز» ثبت می‌شوند اینجا می‌آیند.</p></div><button class="soft" onclick="clearLeads()">پاک کردن لیست تماس</button></div>
    <div class="lead-tools"><div><label class="label">افزودن کارمند تماس</label><input id="newContactStaff" class="field" placeholder="مثلاً: علی رضایی"></div><button class="btn" onclick="addContactStaff()">افزودن کارمند</button></div>
    <div id="staffChipList" class="staff-chip-list"></div>
    <div id="leadsTable" class="table-wrap" style="margin-top:12px"></div>
  </section>

  <section class="card pad" style="margin-bottom:16px">
    <h3>مدیریت کد تخفیف</h3>
    <div class="row wrap"><input id="dcode" class="field" placeholder="کد" style="max-width:170px"><select id="dtype" class="field" style="max-width:150px"><option value="percent">درصدی</option><option value="fixed">مبلغ ثابت</option></select><input id="dvalue" class="field" type="number" placeholder="مقدار" style="max-width:150px"><input id="dmin" class="field" type="number" placeholder="حداقل خرید" style="max-width:150px"><select id="dtour" class="field" style="max-width:170px"><option value="all">همه تورها</option><option value="lastminute">قسمت ویژه</option>${tours().map(t=>`<option value="${t.id}">${t.title}</option>`).join('')}</select><button class="btn" onclick="addDiscount()">افزودن</button></div>
    <div id="discountTable" class="table-wrap" style="margin-top:12px"></div>
  </section>

  <section class="card pad">
    <h3>رزروها</h3><div class="row wrap"><input id="q" class="field" placeholder="جستجو نام، شماره، کد" oninput="renderOrders()" style="max-width:320px"><select id="statusFilter" class="field" onchange="renderOrders()" style="max-width:200px"><option value="all">همه وضعیت‌ها</option><option>در انتظار تماس</option><option>تماس گرفته شد</option><option>تایید شده</option><option>لغو شده</option><option>پرداخت شده</option></select></div>
    <div id="ordersTable" class="table-wrap" style="margin-top:12px"></div>
  </section>`;
  renderStaffAccounts();renderHotelCatalog();renderCurrentTourHotels();renderContactStaff();renderLeads();renderDiscounts();renderOrders();
}

function saveStaffAccount(){
  const name=$('staffFullName').value.trim(), username=$('staffUsername').value.trim(), password=$('staffPassword').value.trim(), active=$('staffActive').value==='true';
  if(!username||!password){alert('یوزرنیم و پسورد را وارد کنید');return}
  const list=staffAccounts();
  const i=list.findIndex(x=>x.username===username);
  const item={id:i>=0?list[i].id:'staff-'+Date.now(),name:name||username,username,password,active,createdAt:i>=0?list[i].createdAt:new Date().toISOString()};
  if(i>=0)list[i]=item;else list.push(item);
  saveStaffAccounts(list);
  ['staffFullName','staffUsername','staffPassword'].forEach(id=>$(id).value='');
  $('staffActive').value='true';
  renderStaffAccounts();showToast('پرسنل ذخیره شد');
}
function editStaffAccount(username){
  const a=staffAccounts().find(x=>x.username===username);if(!a)return;
  $('staffFullName').value=a.name||'';$('staffUsername').value=a.username;$('staffPassword').value=a.password;$('staffActive').value=String(a.active!==false);
}
function toggleStaffAccount(username){
  const list=staffAccounts().map(a=>a.username===username?{...a,active:!(a.active!==false)}:a);saveStaffAccounts(list);renderStaffAccounts();
}
function deleteStaffAccount(username){
  if(!confirm('این پرسنل حذف شود؟'))return;
  saveStaffAccounts(staffAccounts().filter(a=>a.username!==username));renderStaffAccounts();
}
function renderStaffAccounts(){
  const list=staffAccounts(),box=$('staffAccountsTable');if(!box)return;
  box.innerHTML=`<table><thead><tr><th>نام</th><th>یوزرنیم</th><th>پسورد</th><th>وضعیت</th><th>عملیات</th></tr></thead><tbody>${list.map(a=>`<tr><td>${a.name||'—'}</td><td dir="ltr">${a.username}</td><td dir="ltr">${a.password}</td><td>${a.active!==false?'فعال':'غیرفعال'}</td><td><button class="soft" onclick="editStaffAccount('${a.username}')">ویرایش</button><button class="soft" onclick="toggleStaffAccount('${a.username}')">${a.active!==false?'غیرفعال':'فعال'}</button><button class="danger" onclick="deleteStaffAccount('${a.username}')">حذف</button></td></tr>`).join('')}</tbody></table>`;
}

function saveHotelItem(){
  const name=$('hotelLatinName').value.trim(),star=Number($('hotelStar').value),enabled=$('hotelEnabled').value==='true';
  if(!name){alert('نام لاتین هتل را وارد کنید');return}
  const list=hotelCatalog();
  const existing=list.find(x=>x.nameLatin.toLowerCase()===name.toLowerCase()&&Number(x.star)===star);
  if(existing){existing.enabledForStaff=enabled}else list.push({id:'hotel-'+Date.now(),star,nameLatin:name,enabledForStaff:enabled});
  saveHotelCatalog(list);$('hotelLatinName').value='';renderHotelCatalog();renderCurrentTourHotels();showToast('هتل ذخیره شد');
}
function toggleHotelItem(id){
  const list=hotelCatalog().map(h=>h.id===id?{...h,enabledForStaff:!h.enabledForStaff}:h);saveHotelCatalog(list);renderHotelCatalog();renderCurrentTourHotels();
}
function deleteHotelItem(id){
  if(!confirm('هتل حذف شود؟'))return;
  saveHotelCatalog(hotelCatalog().filter(h=>h.id!==id));renderHotelCatalog();renderCurrentTourHotels();
}
function resetDefaultHotels(){if(confirm('لیست نمونه هتل‌ها بازگردانی شود؟')){saveHotelCatalog(defaultHotelCatalog());renderHotelCatalog();renderCurrentTourHotels()}}

function formatDuration(sec){
  sec=Number(sec||0);
  if(!sec)return '—';
  const m=Math.floor(sec/60),s=sec%60;
  if(m>=60)return faNum(Math.floor(m/60))+' ساعت و '+faNum(m%60)+' دقیقه';
  return faNum(m)+' دقیقه و '+faNum(s)+' ثانیه';
}
function renderCurrentTourHotels(){
  const box=$('currentTourHotelsTable');if(!box)return;
  const rows=[];
  tours().forEach(t=>(t.hotels||[]).forEach((h,i)=>rows.push({tourId:t.id,tourTitle:t.title,index:i,...h})));
  box.innerHTML=`<table><thead><tr><th>تور</th><th>هتل</th><th>ستاره</th><th>قیمت</th><th>ظرفیت</th><th>نمایش در خریدار</th><th>عملیات</th></tr></thead><tbody>${rows.map(r=>`<tr><td>${r.tourTitle}</td><td dir="ltr">${r.name}</td><td>${hotelStars(r.star)}</td><td>${money(r.price)}</td><td>${faNum(r.capacity||0)}</td><td>${r.showInBuyer!==false?'فعال':'غیرفعال'}</td><td><button class="soft" onclick="toggleTourHotel(${r.tourId},${r.index})">${r.showInBuyer!==false?'غیرفعال کن':'فعال کن'}</button></td></tr>`).join('')||'<tr><td colspan="7">هتلی ثبت نشده است.</td></tr>'}</tbody></table>`;
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
      const tourId=Number(r[idx('tour_id')]||0), hotelName=String(r[idx('hotel_name_latin')]||'').trim(), star=Number(r[idx('hotel_star')]||0);
      const price=Number(r[idx('price')]||0), cap=Number(r[idx('capacity')]||0);
      const showRaw=String(r[idx('show_in_buyer')]||'TRUE').toLowerCase();
      const oldPrice=Number(r[idx('special_old_price')]||0), newPrice=Number(r[idx('special_new_price')]||0), pct=Number(r[idx('special_discount_percent')]||0);
      const endFa=String(r[idx('special_end_jalali')]||'').trim();
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

function renderHotelCatalog(){
  const box=$('hotelCatalogTable');if(!box)return;
  const list=hotelCatalog().slice().sort((a,b)=>a.star-b.star||a.nameLatin.localeCompare(b.nameLatin));
  box.innerHTML=`<table><thead><tr><th>نام لاتین هتل</th><th>ستاره</th><th>نمایش در پنل کارمند</th><th>عملیات</th></tr></thead><tbody>${list.map(h=>`<tr><td dir="ltr"><b>${h.nameLatin}</b></td><td>${hotelStars(h.star)}</td><td>${h.enabledForStaff!==false?'بله':'خیر'}</td><td><button class="soft" onclick="toggleHotelItem('${h.id}')">${h.enabledForStaff!==false?'عدم نمایش':'نمایش'}</button><button class="danger" onclick="deleteHotelItem('${h.id}')">حذف</button></td></tr>`).join('')}</tbody></table>`;
}

function leadStatusClass(status){if(status==='تماس گرفته شد'||status==='رزرو شد')return'done';if(status==='پیگیری مجدد'||status==='پاسخ نداد')return'follow';if(status==='لغو شد')return'cancel';return''}
function renderContactStaff(){const box=$('staffChipList');if(!box)return;const list=contactStaff();box.innerHTML=list.length?list.map((name,i)=>`<span class="staff-chip"><i class="fa-regular fa-user"></i>${name}<button onclick="removeContactStaff(${i})">×</button></span>`).join(''):'<span class="small">هنوز کارمندی اضافه نشده است.</span>'}
function addContactStaff(){const inp=$('newContactStaff'),name=inp?.value?.trim();if(!name){alert('نام کارمند را وارد کنید');return}const list=contactStaff();if(!list.includes(name))list.push(name);saveContactStaff(list);inp.value='';renderContactStaff();renderLeads();showToast('کارمند اضافه شد')}
function removeContactStaff(i){const list=contactStaff(),name=list[i];if(!confirm(`کارمند ${name} حذف شود؟`))return;list.splice(i,1);saveContactStaff(list);saveLeads(leads().map(l=>l.assignedTo===name?{...l,assignedTo:''}:l));renderContactStaff();renderLeads()}
function updateLead(id,field,value){saveLeads(leads().map(l=>l.id===id?{...l,[field]:value,updatedAt:new Date().toISOString()}:l));renderLeads();showToast('اطلاعات تماس به‌روزرسانی شد')}
function deleteLead(id){if(!confirm('این شماره از لیست تماس حذف شود؟'))return;saveLeads(leads().filter(l=>l.id!==id));renderLeads();showToast('شماره حذف شد')}
function renderLeads(){const list=leads(),staff=contactStaff(),box=$('leadsTable');if(!box)return;const statuses=['جدید','تماس گرفته شد','پیگیری مجدد','پاسخ نداد','رزرو شد','لغو شد'];box.innerHTML=`<table><thead><tr><th>زمان</th><th>نام</th><th>شماره</th><th>مقصد</th><th>نفرات</th><th>مدت حضور</th><th>گشت سایت</th><th>درصد علاقه</th><th>کارمند مسئول</th><th>وضعیت تماس</th><th>یادداشت</th><th>عملیات</th></tr></thead><tbody>${list.map(l=>`<tr><td>${new Date(l.createdAt).toLocaleString('fa-IR')}</td><td>${l.name||'—'}</td><td dir="ltr"><a href="tel:${l.phone}" style="text-decoration:none;color:inherit">${l.phone}</a></td><td>${l.dest||'—'}</td><td>${l.people||'—'}</td><td>${formatDuration(l.siteSeconds)}</td><td>${faNum(l.tourViews||0)} تور</td><td><span class="kpi-mini">${faNum(l.engagementPercent||0)}٪</span></td><td><select class="lead-select" onchange="updateLead('${l.id}','assignedTo',this.value)"><option value="">انتخاب کارمند</option>${staff.map(s=>`<option value="${s}" ${l.assignedTo===s?'selected':''}>${s}</option>`).join('')}</select></td><td><select class="lead-select" onchange="updateLead('${l.id}','status',this.value)">${statuses.map(s=>`<option value="${s}" ${(l.status||'جدید')===s?'selected':''}>${s}</option>`).join('')}</select><div style="margin-top:6px"><span class="lead-status-badge ${leadStatusClass(l.status||'جدید')}">${l.status||'جدید'}</span></div></td><td><input class="lead-note-input" value="${l.adminNote||''}" placeholder="یادداشت تماس" onchange="updateLead('${l.id}','adminNote',this.value)"></td><td><button class="danger" onclick="deleteLead('${l.id}')">حذف</button></td></tr>`).join('')||'<tr><td colspan="12">هنوز تماسی ثبت نشده است.</td></tr>'}</tbody></table>`}
function clearLeads(){if(confirm('لیست تماس‌ها پاک شود؟')){saveLeads([]);renderLeads();showToast('لیست تماس پاک شد')}}

function renderDiscounts(){const ds=discounts();$('discountTable').innerHTML=`<table><thead><tr><th>کد</th><th>نوع</th><th>مقدار</th><th>حداقل</th><th>محدودیت</th><th>وضعیت</th><th>عملیات</th></tr></thead><tbody>${ds.map((d,i)=>`<tr><td><b>${d.code}</b></td><td>${d.type==='fixed'?'مبلغ ثابت':'درصدی'}</td><td>${d.type==='fixed'?money(d.value):faNum(d.value)+'٪'}</td><td>${money(d.min||0)}</td><td>${d.tourId}</td><td>${d.active?'فعال':'غیرفعال'}</td><td><button class="soft" onclick="toggleDiscount(${i})">${d.active?'غیرفعال':'فعال'}</button><button class="danger" onclick="delDiscount(${i})">حذف</button></td></tr>`).join('')}</tbody></table>`}
function addDiscount(){const ds=discounts();ds.push({code:$('dcode').value.toUpperCase(),type:$('dtype').value,value:Number($('dvalue').value),min:Number($('dmin').value)||0,tourId:$('dtour').value,active:true,used:0,limit:100,expires:''});saveDiscounts(ds);renderDiscounts()}
function toggleDiscount(i){const ds=discounts();ds[i].active=!ds[i].active;saveDiscounts(ds);renderDiscounts()}
function delDiscount(i){const ds=discounts();ds.splice(i,1);saveDiscounts(ds);renderDiscounts()}

function renderOrders(){let os=orders();const q=$('q')?.value?.trim().toLowerCase()||'',sf=$('statusFilter')?.value||'all';if(q)os=os.filter(o=>o.name.toLowerCase().includes(q)||o.phone.includes(q)||o.id.toLowerCase().includes(q));if(sf!=='all')os=os.filter(o=>o.status===sf);$('ordersTable').innerHTML=`<table><thead><tr><th>کد/مسافر</th><th>تور</th><th>هتل</th><th>تاریخ</th><th>مبلغ</th><th>وضعیت</th><th>یادداشت</th><th>عملیات</th></tr></thead><tbody>${os.map(o=>`<tr><td><b>${o.id}</b><br>${o.name}<br><small dir="ltr">${o.phone}</small></td><td>${o.tourTitle}</td><td>${o.hotelName}</td><td>${o.date}</td><td>${money(o.totalPrice)}</td><td><select class="field" onchange="changeStatus('${o.id}',this.value)">${['در انتظار تماس','تماس گرفته شد','تایید شده','لغو شده','پرداخت شده'].map(s=>`<option ${o.status===s?'selected':''}>${s}</option>`).join('')}</select></td><td><textarea class="field" rows="2" onchange="changeNote('${o.id}',this.value)">${o.adminNote||''}</textarea></td><td><button class="danger" onclick="delOrder('${o.id}')">حذف</button></td></tr>`).join('')}</tbody></table>`}
function changeStatus(id,v){saveOrders(orders().map(o=>o.id===id?{...o,status:v}:o));renderOrders()}
function changeNote(id,v){saveOrders(orders().map(o=>o.id===id?{...o,adminNote:v}:o))}
function delOrder(id){if(confirm('رزرو حذف شود؟')){saveOrders(orders().filter(o=>o.id!==id));renderOrders()}}
document.addEventListener('DOMContentLoaded',initAdmin);
