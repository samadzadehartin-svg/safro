const PREFIX='safarro_three_panels_';
function $(id){return document.getElementById(id)}
function money(n){return Number(n||0).toLocaleString('fa-IR')+' تومان'}
function faNum(n){return String(n).replace(/\d/g,d=>'۰۱۲۳۴۵۶۷۸۹'[d])}
function reqStar(){return '<span class="req-star">*</span>'}
function read(k,f){try{return JSON.parse(localStorage.getItem(PREFIX+k))??f}catch{return f}}
function write(k,v){localStorage.setItem(PREFIX+k,JSON.stringify(v))}

function defaultHotelCatalog(){
  return [
    {id:'h3-1',star:3,nameLatin:'Saffron Inn',enabledForStaff:true},
    {id:'h3-2',star:3,nameLatin:'Blue Pearl Hotel',enabledForStaff:true},
    {id:'h3-3',star:3,nameLatin:'City View Hotel',enabledForStaff:true},
    {id:'h3-4',star:3,nameLatin:'Sunrise Hotel',enabledForStaff:true},
    {id:'h3-5',star:3,nameLatin:'Royal Garden Inn',enabledForStaff:true},
    {id:'h4-1',star:4,nameLatin:'Grand Vista Hotel',enabledForStaff:true},
    {id:'h4-2',star:4,nameLatin:'Marina Palace',enabledForStaff:true},
    {id:'h4-3',star:4,nameLatin:'Golden Crown Hotel',enabledForStaff:true},
    {id:'h4-4',star:4,nameLatin:'Central Park Hotel',enabledForStaff:true},
    {id:'h4-5',star:4,nameLatin:'Diamond Suites',enabledForStaff:true},
    {id:'h5-1',star:5,nameLatin:'Royal Palace Hotel',enabledForStaff:true},
    {id:'h5-2',star:5,nameLatin:'Imperial Grand Hotel',enabledForStaff:true},
    {id:'h5-3',star:5,nameLatin:'Ocean Luxury Resort',enabledForStaff:true},
    {id:'h5-4',star:5,nameLatin:'Skyline Premium Hotel',enabledForStaff:true},
    {id:'h5-5',star:5,nameLatin:'Elite World Resort',enabledForStaff:true}
  ];
}
function defaultStaffAccounts(){
  return Array.from({length:30},(_,i)=>{
    const n=String(i+1).padStart(2,'0');
    return {id:'staff-'+n,username:'staff'+n,password:'safar'+n,name:'کارمند '+faNum(i+1),active:true,createdAt:new Date().toISOString()};
  });
}
function hotelCatalog(){
  let v=read('hotelCatalog',null);
  if(!v){v=defaultHotelCatalog();saveHotelCatalog(v)}
  return v;
}
function saveHotelCatalog(v){write('hotelCatalog',v)}
function normalizeStaffAccounts(){
  const list=staffAccounts().map(a=>({taskNote:'',...a}));
  saveStaffAccounts(list);
  return list;
}
function staffAccounts(){
  let v=read('staffAccounts',null);
  if(!v){v=defaultStaffAccounts();saveStaffAccounts(v)}
  return v;
}
function saveStaffAccounts(v){write('staffAccounts',v)}
function currentStaffUser(){return read('currentStaffUser',null)}
function normalizeLatinTourTitles(){
  try{
    if(typeof LATIN_TOUR_TITLES==='undefined')return;
    const ts=tours().map(t=>LATIN_TOUR_TITLES[t.id]?{...t,title:LATIN_TOUR_TITLES[t.id]}:t);
    saveTours(ts);
  }catch(e){}
}
function visibleHotels(t){
  const hs=(t.hotels||[]).filter(h=>h && h.showInBuyer!==false);
  return hs.length?hs:(t.hotels||[]);
}

function seed(){if(!read('tours',null))write('tours',DEFAULT_TOURS);if(!read('discounts',null))write('discounts',DEFAULT_DISCOUNTS);if(!read('hotelCatalog',null))write('hotelCatalog',defaultHotelCatalog());if(!read('staffAccounts',null))write('staffAccounts',defaultStaffAccounts())}
function tours(){return read('tours',DEFAULT_TOURS)}function saveTours(v){write('tours',v)}
function orders(){return read('orders',[])}function saveOrders(v){write('orders',v)}
function leads(){return read('leads',[])}function saveLeads(v){write('leads',v)}
function contactStaff(){return read('contactStaff',[])}function saveContactStaff(v){write('contactStaff',v)}
function discounts(){return read('discounts',DEFAULT_DISCOUNTS)}function saveDiscounts(v){write('discounts',v)}
function wishlist(){return read('wish',[])}function saveWish(v){write('wish',v)}
function findTour(id){return tours().find(t=>Number(t.id)===Number(id))}
function minHotel(t){const hs=visibleHotels(t);return (hs.length?hs:[{price:t.price}]).slice().sort((a,b)=>Number(a.price||0)-Number(b.price||0))[0]}
function totalCapacity(t){return visibleHotels(t).reduce((s,h)=>s+Number(h.capacity||0),0)}
function showToast(msg){let e=$('toast');if(!e){e=document.createElement('div');e.id='toast';e.className='toast';document.body.appendChild(e)}e.textContent=msg;e.classList.add('on');clearTimeout(showToast.t);showToast.t=setTimeout(()=>e.classList.remove('on'),2300)}
function initTheme(){if(localStorage.getItem(PREFIX+'dark')==='1')document.body.classList.add('dark')}
function toggleDark(){document.body.classList.toggle('dark');localStorage.setItem(PREFIX+'dark',document.body.classList.contains('dark')?'1':'0')}
function badge(c){const m={domestic:['domestic','داخلی'],international:['international','خارجی'],luxury:['luxury','لوکس'],economy:['economy','اقتصادی'],special:['special','ویژه']};const x=m[c]||['special',c];return `<span class="badge ${x[0]}">${x[1]}</span>`}
function badges(t){return (t.categories||[]).map(badge).join('')+(t.lastMinute?'<span class="badge flash">لحظه آخری</span>':'')}
function updateWishCount(){const e=$('wishCount');if(e)e.textContent=faNum(wishlist().length)}
function toggleWish(id){const w=wishlist(),i=w.indexOf(id);if(i>=0){w.splice(i,1);showToast('از علاقه‌مندی حذف شد')}else{w.push(id);showToast('به علاقه‌مندی اضافه شد')}saveWish(w);updateWishCount(); if(typeof renderBuyer==='function')renderBuyer()}
function clearWish(){if(confirm('همه علاقه‌مندی‌ها حذف شوند؟')){saveWish([]);updateWishCount();renderBuyer?.()}}
function countdown(iso){const diff=Math.max(0,new Date(iso).getTime()-Date.now());const h=Math.floor(diff/3600000),m=Math.floor((diff%3600000)/60000),s=Math.floor((diff%60000)/1000);return `${faNum(String(h).padStart(2,'0'))}:${faNum(String(m).padStart(2,'0'))}:${faNum(String(s).padStart(2,'0'))}`}
function findDiscount(code,tour,gross){code=(code||'').trim().toUpperCase();if(!code)return{valid:false,amount:0,msg:'کدی وارد نشده است'};const d=discounts().find(x=>String(x.code).toUpperCase()===code&&x.active);if(!d)return{valid:false,amount:0,msg:'کد معتبر نیست'};if(d.expires&&new Date(d.expires+'T23:59:59')<new Date())return{valid:false,amount:0,msg:'تاریخ کد تمام شده است'};if(Number(d.min||0)>gross)return{valid:false,amount:0,msg:`حداقل خرید ${money(d.min)} است`};if(d.limit&&Number(d.used||0)>=Number(d.limit))return{valid:false,amount:0,msg:'سقف استفاده پر شده است'};if(d.tourId&&d.tourId!=='all'){if(d.tourId==='lastminute'&&!tour.lastMinute)return{valid:false,amount:0,msg:'فقط برای لحظه آخری است'};if(d.tourId!=='lastminute'&&Number(d.tourId)!==Number(tour.id))return{valid:false,amount:0,msg:'برای این تور فعال نیست'}}const amount=d.type==='fixed'?Math.min(Number(d.value)||0,gross):Math.round(gross*(Number(d.value)||0)/100);return{...d,valid:true,amount,msg:'کد تخفیف اعمال شد'}}
function authGate(role){return read(role+'_auth',false)}
function loginRole(role,pass,username=''){
  if(role==='admin'&&pass==='admin123'){write('admin_auth',true);return true}
  if(role==='staff'){
    const user=(username||'').trim();
    if(!user && pass==='staff123'){
      write('staff_auth',true);
      write('currentStaffUser',{username:'demo-staff',name:'کارمند دمو'});
      return true;
    }
    const acc=staffAccounts().find(a=>a.username===user && a.password===pass && a.active!==false);
    if(acc){
      write('staff_auth',true);
      write('currentStaffUser',{username:acc.username,name:acc.name||acc.username,id:acc.id});
      return true;
    }
  }
  return false;
}
function logoutRole(role){write(role+'_auth',false);if(role==='staff')write('currentStaffUser',null);location.reload()}
function layout(type){
  const buyerLinks = `
    <a href="../buyer/index.html">خانه</a>
    <a href="#" onclick="route('wish');return false;">علاقه‌مندی‌ها</a>
    <a href="#" onclick="route('mine');return false;">رزروهای من</a>
  `;

  const privateLinks = `
    <a href="../buyer/index.html">پنل خریدار</a>
    <a href="../staff/index.html">پنل کارمند</a>
    <a href="../admin/index.html">پنل مدیریت</a>
  `;

  const links = type === 'buyer' ? buyerLinks : privateLinks;

  return `
<header class="header">
  <div class="container nav">
    <a class="logo" href="../buyer/index.html">
      <span class="logo-icon"><i class="fa-solid fa-plane-departure"></i></span>
      <span>سفر رو<small style="display:block;color:var(--p);font-size:9px;letter-spacing:2px">SAFARRO</small></span>
    </a>
    <nav class="links">${links}</nav>
    <div class="actions">
      <button class="soft" onclick="toggleDark()"><i class="fa-solid fa-moon"></i></button>
      <span class="soft"><i class="fa-regular fa-heart"></i><span id="wishCount">۰</span></span>
    </div>
  </div>
</header>`;
}

function footer(type){
  const buyerBottom = `
    <nav class="bottom-nav">
      <a href="../buyer/index.html"><i class="fa-solid fa-house"></i>خانه</a>
      <a href="#" onclick="route('wish');return false;"><i class="fa-regular fa-heart"></i>علاقه‌مندی</a>
      <a href="#" onclick="route('mine');return false;"><i class="fa-regular fa-ticket"></i>رزروهای من</a>
    </nav>`;

  const privateBottom = `
    <nav class="bottom-nav">
      <a href="../buyer/index.html"><i class="fa-solid fa-house"></i>خریدار</a>
      <a href="../staff/index.html"><i class="fa-regular fa-user-pen"></i>کارمند</a>
      <a href="../admin/index.html"><i class="fa-solid fa-chart-line"></i>مدیریت</a>
    </nav>`;

  return `<footer class="footer"><b>سفرو ایرانیان</b><br>${type === 'buyer' ? 'خرید و رزرو آنلاین تورهای داخلی و خارجی' : 'پنل داخلی سفر رو'}<br><span style="font-size:11px;color:var(--t2)">۰۲۱-۴۹۹۷۶ | تهران، بلوار فردوس شرق، بعد از عقیل، پلاک ۳۵۱</span></footer>${type === 'buyer' ? buyerBottom : privateBottom}`;
}

function mount(type){
  $('headerMount').innerHTML = layout(type);
  $('footerMount').innerHTML = footer(type);
  updateWishCount();
}
document.addEventListener('DOMContentLoaded',()=>{seed();initTheme()});
