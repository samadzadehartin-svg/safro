
function hotelStars(n){return `<span class="hotel-stars">${Array.from({length:Number(n)||0}).map(()=>'<i class="fa-solid fa-star"></i>').join('')}</span>`}
function defaultSections(){return{description:true,flightInfo:true,dates:true,hotels:true,gallery:true,itinerary:true,docs:true,includes:true,excludes:true,cancellation:true,childPolicy:true,reviews:true}}
function sectionVal(id){return !!$(id)?.checked}
function setSectionToggles(t){const v=Object.assign(defaultSections(),t?.sectionVisibility||{});Object.entries({visDescription:'description',visFlightInfo:'flightInfo',visDates:'dates',visHotels:'hotels',visGallery:'gallery',visItinerary:'itinerary',visDocs:'docs',visIncludes:'includes',visExcludes:'excludes',visCancellation:'cancellation',visChildPolicy:'childPolicy',visReviews:'reviews'}).forEach(([id,key])=>{if($(id))$(id).checked=v[key]!==false})}
function collectSectionVisibility(){return{description:sectionVal('visDescription'),flightInfo:sectionVal('visFlightInfo'),dates:sectionVal('visDates'),hotels:sectionVal('visHotels'),gallery:sectionVal('visGallery'),itinerary:sectionVal('visItinerary'),docs:sectionVal('visDocs'),includes:sectionVal('visIncludes'),excludes:sectionVal('visExcludes'),cancellation:sectionVal('visCancellation'),childPolicy:sectionVal('visChildPolicy'),reviews:sectionVal('visReviews')}}
function initStaff(){mount('staff');if(!authGate('staff'))return renderLogin();renderStaff()}
function renderLogin(){$('app').innerHTML=`<div class="card pad login-box"><h2>ورود کارمند</h2><p class="small">هر کارمند با یوزرنیم و پسورد خودش وارد می‌شود. ورود دمو: فقط رمز staff123</p><input id="user" class="field" placeholder="یوزرنیم" dir="ltr"><input id="pass" class="field" type="password" placeholder="پسورد" dir="ltr"><button class="btn" style="width:100%;margin-top:12px" onclick="doLogin()">ورود</button></div>`}
function doLogin(){if(loginRole('staff',$('pass').value,$('user').value))location.reload();else alert('یوزرنیم یا پسورد اشتباه است')}
function renderStaff(){
  const q=$('staffSearch')?.value?.trim().toLowerCase()||'', user=currentStaffUser();
  let list=tours();if(q)list=list.filter(t=>t.title.toLowerCase().includes(q)||t.dest.toLowerCase().includes(q));
  $('app').innerHTML=`<div class="card pad row wrap" style="margin-top:22px"><div><span class="badge special">پنل کارمند</span><h1>مدیریت تورها</h1><p class="small">وارد شده با: <b>${user?.name||user?.username||'کارمند'}</b></p></div><div class="actions"><button class="soft" onclick="logoutRole('staff')">خروج</button><button class="btn" onclick="openForm()">افزودن تور</button></div></div>
  ${batchPriceBox()}
  <div class="card pad" style="margin:16px 0"><input id="staffSearch" class="field" placeholder="جستجو..." oninput="renderStaff()" value="${q}"></div>
  <div class="card table-wrap"><table><thead><tr><th>عکس</th><th>عنوان</th><th>مقصد</th><th>قیمت شروع</th><th>ظرفیت</th><th>وضعیت</th><th>آخرین ویرایش</th><th>عملیات</th></tr></thead><tbody>${list.map(t=>`<tr><td><img src="${t.img}" style="width:55px;height:55px;object-fit:cover;border-radius:12px"></td><td><b>${t.title}</b><br><small>${badges(t)}</small></td><td>${t.dest}</td><td>${money(minHotel(t).price)}</td><td>${faNum(totalCapacity(t))}</td><td>${t.status}</td><td><span class="last-edited">${t.lastEditedBy||'—'}<br>${t.lastEditedAt?new Date(t.lastEditedAt).toLocaleString('fa-IR'):''}</span></td><td><button class="soft" onclick="openForm(${t.id})">ویرایش</button><button class="danger" onclick="delTour(${t.id})">حذف</button></td></tr>`).join('')}</tbody></table></div>`;
}
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
  const ts=tours().map(t=>ids.includes(t.id)?{...t,hotels:(t.hotels||[]).map(h=>stars.includes(Number(h.star))?{...h,price:Number(h.price||0)+amount}:h),lastEditedBy:user?.name||user?.username||'کارمند',lastEditedAt:new Date().toISOString()}:t);
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
    return `<div class="hotel-editor-star"><h4>هتل‌های ${hotelStars(star)} <small class="small">حداکثر ۵ هتل؛ تیک نمایش یعنی در پنل خریدار دیده شود.</small></h4>${catalog.map((c,i)=>{
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
  ['title','dest','duration','airline','returnAirline','flightTime','returnFlightTime','flightNumber','price','img','dates','gallery','desc','itinerary','docs','includes','excludes','cancel','child','dealPercent','dealEndsAtLocal'].forEach(x=>{if($(x))$(x).value=''});
  if(t){
    $('title').value=t.title;$('dest').value=t.dest;$('duration').value=t.duration;$('airline').value=t.airline||'';$('returnAirline').value=t.returnAirline||t.airline||'';$('flightTime').value=t.flightTime||'';$('returnFlightTime').value=t.returnFlightTime||t.landingTime||'';$('flightNumber').value=t.flightNumber||'';$('price').value=t.price;$('img').value=t.img;$('dates').value=(t.dates||[]).join('\n');$('gallery').value=(t.gallery||[]).join('\n');$('desc').value=t.desc||'';$('itinerary').value=(t.itinerary||[]).join('\n');$('docs').value=(t.docs||[]).join('\n');$('includes').value=(t.includes||[]).join('\n');$('excludes').value=(t.excludes||[]).join('\n');$('cancel').value=t.cancellation||'';$('child').value=t.childPolicy||'';$('type').value=t.type;$('level').value=t.level||'';$('status').value=t.status;$('lastMinute').checked=!!t.lastMinute;$('dealPercent').value=t.dealPercent||0;if(t.dealEndsAt){$('dealEndsAtLocal').value=new Date(t.dealEndsAt).toISOString().slice(0,16)};renderHotelEditor(t);setSectionToggles(t)
  }else{
    $('type').value='international';$('level').value='special';$('status').value='active';$('lastMinute').checked=false;$('dealPercent').value=10;$('dealEndsAtLocal').value=new Date(Date.now()+24*3600000).toISOString().slice(0,16);renderHotelEditor(null);setSectionToggles(null)
  }
}
function closeForm(){$('modal').classList.remove('on')}
function saveTour(e){
  e.preventDefault();
  const ts=tours(),id=$('tid').value?Number($('tid').value):Date.now(),price=Number($('price').value),type=$('type').value,level=$('level').value,cats=[type],user=currentStaffUser();
  if(level)cats.push(level);
  const special=$('lastMinute').checked;
  const data={id,title:$('title').value,dest:$('dest').value,duration:$('duration').value,airline:$('airline').value,returnAirline:$('returnAirline').value||$('airline').value,flightNumber:$('flightNumber').value||`SR ${String(id).slice(-3)}`,flightTime:$('flightTime').value||'۰۸:۳۰',returnFlightTime:$('returnFlightTime').value||'',price,label:special?'ویژه':'',type,level,categories:cats,rating:4.5,status:$('status').value,lastMinute:special,dealPercent:special?(Number($('dealPercent').value)||0):0,dealEndsAt:$('dealEndsAtLocal').value?new Date($('dealEndsAtLocal').value).toISOString():new Date(Date.now()+24*3600000).toISOString(),img:$('img').value||DEFAULT_IMG,gallery:($('gallery').value||'').split('\n').map(x=>x.trim()).filter(Boolean),dates:$('dates').value.split('\n').map(x=>x.trim()).filter(Boolean),hotels:collectHotels(price),desc:$('desc').value||'تور ثبت شده توسط کارمند.',includes:($('includes').value||'ترانسفر\nبیمه\nصبحانه').split('\n').filter(Boolean),excludes:($('excludes').value||'').split('\n').filter(Boolean),itinerary:($('itinerary').value||'').split('\n').filter(Boolean),docs:($('docs').value||'').split('\n').filter(Boolean),cancellation:$('cancel').value,childPolicy:$('child').value,sectionVisibility:collectSectionVisibility(),reviews:[],lastEditedBy:user?.name||user?.username||'کارمند',lastEditedAt:new Date().toISOString()};
  const i=ts.findIndex(x=>x.id===id);if(i>=0)ts[i]=data;else ts.push(data);
  saveTours(ts);closeForm();renderStaff();showToast('تور ذخیره شد');
}
function delTour(id){if(confirm('تور حذف شود؟')){saveTours(tours().filter(t=>t.id!==id));renderStaff()}}
document.addEventListener('DOMContentLoaded',initStaff);
