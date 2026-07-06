function initAdmin(){mount('admin');if(!authGate('admin'))return renderLogin();renderAdmin()}
function renderLogin(){$('app').innerHTML=`<div class="card pad login-box"><h2>ورود مدیریت</h2><p class="small">رمز دمو: admin123</p><input id="pass" class="field" type="password" placeholder="رمز"><button class="btn" style="width:100%;margin-top:12px" onclick="doLogin()">ورود</button></div>`}
function doLogin(){if(loginRole('admin',$('pass').value))location.reload();else alert('رمز اشتباه است')}
function renderAdmin(){const os=orders(),sales=os.reduce((s,o)=>s+Number(o.totalPrice||0),0);$('app').innerHTML=`<div class="card pad row wrap" style="margin-top:22px"><div><span class="badge international">پنل مدیریت</span><h1>داشبورد مدیریت</h1></div><button class="soft" onclick="logoutRole('admin')">خروج</button></div><section class="grid g4" style="margin:16px 0"><div class="card pad"><span class="small">کل رزروها</span><b class="price">${faNum(os.length)}</b></div><div class="card pad"><span class="small">در انتظار</span><b class="price">${faNum(os.filter(o=>o.status==='در انتظار تماس').length)}</b></div><div class="card pad"><span class="small">فروش</span><b class="price">${money(sales)}</b></div><div class="card pad"><span class="small">تور فعال</span><b class="price">${faNum(tours().filter(t=>t.status==='active').length)}</b></div></section><section class="card pad" style="margin-bottom:16px"><div class="row wrap"><div><h3>لیست تماس و مشاوره رایگان</h3><p class="small">شماره‌هایی که در بخش «تور خودتو بساز» ثبت می‌شوند اینجا می‌آیند.</p></div><div class="row"><button class="btn" onclick="sendAllLeadsToWhatsApp()">ارسال لیست به واتس‌اپ مدیر</button><button class="soft" onclick="clearLeads()">پاک کردن لیست تماس</button></div></div><div id="leadsTable" class="table-wrap" style="margin-top:12px"></div></section><section class="card pad" style="margin-bottom:16px"><h3>مدیریت کد تخفیف</h3><div class="row wrap"><input id="dcode" class="field" placeholder="کد" style="max-width:170px"><select id="dtype" class="field" style="max-width:150px"><option value="percent">درصدی</option><option value="fixed">مبلغ ثابت</option></select><input id="dvalue" class="field" type="number" placeholder="مقدار" style="max-width:150px"><input id="dmin" class="field" type="number" placeholder="حداقل خرید" style="max-width:150px"><select id="dtour" class="field" style="max-width:170px"><option value="all">همه تورها</option><option value="lastminute">لحظه آخری</option>${tours().map(t=>`<option value="${t.id}">${t.title}</option>`).join('')}</select><button class="btn" onclick="addDiscount()">افزودن</button></div><div id="discountTable" class="table-wrap" style="margin-top:12px"></div></section><section class="card pad"><h3>رزروها</h3><div class="row wrap"><input id="q" class="field" placeholder="جستجو نام، شماره، کد" oninput="renderOrders()" style="max-width:320px"><select id="statusFilter" class="field" onchange="renderOrders()" style="max-width:200px"><option value="all">همه وضعیت‌ها</option><option>در انتظار تماس</option><option>تماس گرفته شد</option><option>تایید شده</option><option>لغو شده</option><option>پرداخت شده</option></select></div><div id="ordersTable" class="table-wrap" style="margin-top:12px"></div></section>`;renderLeads();renderDiscounts();renderOrders()}
function renderLeads(){
  const list = leads();
  const box = $('leadsTable');
  if(!box) return;
  box.innerHTML = `<table>
    <thead><tr><th>زمان</th><th>نام</th><th>شماره</th><th>مقصد</th><th>نفرات</th><th>توضیح</th><th>وضعیت</th></tr></thead>
    <tbody>${list.map(l=>`<tr>
      <td>${new Date(l.createdAt).toLocaleString('fa-IR')}</td>
      <td>${l.name || '—'}</td>
      <td dir="ltr">${l.phone}</td>
      <td>${l.dest || '—'}</td>
      <td>${l.people || '—'}</td>
      <td>${l.note || '—'}</td>
      <td><span class="badge special">${l.status || 'جدید'}</span></td>
    </tr>`).join('') || '<tr><td colspan="7">هنوز تماسی ثبت نشده است.</td></tr>'}</tbody>
  </table>`;
}
function sendAllLeadsToWhatsApp(){
  const list = leads();
  if(!list.length){alert('هنوز شماره‌ای ثبت نشده است');return}
  const msg = 'لیست تماس‌های سفر رو\n\n' + list.map((l,i)=>`${i+1}) ${l.name||'—'} | ${l.phone} | مقصد: ${l.dest||'—'} | نفرات: ${l.people||'—'} | توضیح: ${l.note||'—'}`).join('\n');
  window.open(`https://wa.me/989126144939?text=${encodeURIComponent(msg)}`,'_blank');
}
function clearLeads(){
  if(confirm('لیست تماس‌ها پاک شود؟')){
    saveLeads([]);
    renderLeads();
    showToast('لیست تماس پاک شد');
  }
}
function renderDiscounts(){const ds=discounts();$('discountTable').innerHTML=`<table><thead><tr><th>کد</th><th>نوع</th><th>مقدار</th><th>حداقل</th><th>محدودیت</th><th>وضعیت</th><th>عملیات</th></tr></thead><tbody>${ds.map((d,i)=>`<tr><td><b>${d.code}</b></td><td>${d.type==='fixed'?'مبلغ ثابت':'درصدی'}</td><td>${d.type==='fixed'?money(d.value):faNum(d.value)+'٪'}</td><td>${money(d.min||0)}</td><td>${d.tourId}</td><td>${d.active?'فعال':'غیرفعال'}</td><td><button class="soft" onclick="toggleDiscount(${i})">${d.active?'غیرفعال':'فعال'}</button><button class="danger" onclick="delDiscount(${i})">حذف</button></td></tr>`).join('')}</tbody></table>`}
function addDiscount(){const ds=discounts();ds.push({code:$('dcode').value.toUpperCase(),type:$('dtype').value,value:Number($('dvalue').value),min:Number($('dmin').value)||0,tourId:$('dtour').value,active:true,used:0,limit:100,expires:''});saveDiscounts(ds);renderDiscounts()}
function toggleDiscount(i){const ds=discounts();ds[i].active=!ds[i].active;saveDiscounts(ds);renderDiscounts()}
function delDiscount(i){const ds=discounts();ds.splice(i,1);saveDiscounts(ds);renderDiscounts()}
function renderOrders(){let os=orders();const q=$('q')?.value?.trim().toLowerCase()||'',sf=$('statusFilter')?.value||'all';if(q)os=os.filter(o=>o.name.toLowerCase().includes(q)||o.phone.includes(q)||o.id.toLowerCase().includes(q));if(sf!=='all')os=os.filter(o=>o.status===sf);$('ordersTable').innerHTML=`<table><thead><tr><th>کد/مسافر</th><th>تور</th><th>هتل</th><th>تاریخ</th><th>مبلغ</th><th>وضعیت</th><th>یادداشت</th><th>عملیات</th></tr></thead><tbody>${os.map(o=>`<tr><td><b>${o.id}</b><br>${o.name}<br><small dir="ltr">${o.phone}</small></td><td>${o.tourTitle}</td><td>${o.hotelName}</td><td>${o.date}</td><td>${money(o.totalPrice)}</td><td><select class="field" onchange="changeStatus('${o.id}',this.value)">${['در انتظار تماس','تماس گرفته شد','تایید شده','لغو شده','پرداخت شده'].map(s=>`<option ${o.status===s?'selected':''}>${s}</option>`).join('')}</select></td><td><textarea class="field" rows="2" onchange="changeNote('${o.id}',this.value)">${o.adminNote||''}</textarea></td><td><button class="danger" onclick="delOrder('${o.id}')">حذف</button></td></tr>`).join('')||'<tr><td colspan="8">رزروی نیست.</td></tr>'}</tbody></table>`}
function changeStatus(id,s){const os=orders();const o=os.find(x=>x.id===id);if(o)o.status=s;saveOrders(os);showToast('وضعیت ذخیره شد')}
function changeNote(id,n){const os=orders();const o=os.find(x=>x.id===id);if(o)o.adminNote=n;saveOrders(os)}
function delOrder(id){if(confirm('رزرو حذف شود؟')){saveOrders(orders().filter(o=>o.id!==id));renderAdmin()}}
document.addEventListener('DOMContentLoaded',initAdmin);
