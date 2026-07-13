const PREFIX='safarro_three_panels_';

/* ===== Supabase Sync Config =====
   1) Create table using supabase_schema.sql
   2) Paste your URL and anon key below
*/
const SUPABASE_URL = 'PASTE_SUPABASE_PROJECT_URL_HERE';
const SUPABASE_ANON_KEY = 'PASTE_SUPABASE_ANON_KEY_HERE';
const SUPABASE_TABLE = 'safaro_store';
const SUPABASE_ENABLED = !SUPABASE_URL.includes('PASTE_') && !SUPABASE_ANON_KEY.includes('PASTE_');
const SUPABASE_KEYS = ['settings','tours','orders','leads','contactStaff','discounts','visaServices','hotelCatalog','staffAccounts','customerTrail'];
let supabaseClient = null;
let supabaseBootSynced = false;
let supabaseWriteTimers = {};

function getSupabaseClient(){
  if(!SUPABASE_ENABLED || !window.supabase)return null;
  if(!supabaseClient)supabaseClient = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
  return supabaseClient;
}
function supabaseStatusText(){
  return SUPABASE_ENABLED ? 'Supabase وصل است' : 'Supabase هنوز تنظیم نشده است';
}
function supabaseConfigHelp(){
  return `URL و ANON KEY را در فایل assets/js/core.js جایگزین کن؛ سپس فایل supabase_schema.sql را در SQL Editor اجرا کن.`;
}
async function supabaseTestConnection(){
  const client=getSupabaseClient();
  if(!client){
    showToast('Supabase هنوز تنظیم نشده است');
    alert(supabaseConfigHelp());
    return;
  }
  try{
    const {error}=await client.from(SUPABASE_TABLE).select('key').limit(1);
    if(error)throw error;
    showToast('اتصال Supabase موفق بود');
    alert('اتصال Supabase موفق بود ✅');
  }catch(e){
    console.error('Supabase test failed',e);
    showToast('اتصال Supabase خطا دارد');
    alert('خطا در اتصال Supabase:\n'+(e.message||e)+'\n\nمطمئن شو جدول safaro_store ساخته شده و Policy ها اجرا شده‌اند.');
  }
}
async function supabasePullAll(){
  const client=getSupabaseClient();
  if(!client)return {ok:false,msg:'Supabase تنظیم نشده است'};
  try{
    const {data,error}=await client.from(SUPABASE_TABLE).select('key,value,updated_at');
    if(error)throw error;
    (data||[]).forEach(row=>{
      if(row && row.key && row.value!==undefined){
        localStorage.setItem(PREFIX+row.key, JSON.stringify(row.value));
      }
    });
    supabaseBootSynced=true;
    return {ok:true,msg:`${faNum((data||[]).length)} مورد از Supabase خوانده شد`};
  }catch(e){
    console.error('Supabase pull failed',e);
    return {ok:false,msg:'خطا در خواندن از Supabase: '+(e.message||e)};
  }
}
async function supabasePushKey(k,v){
  if(v===null||v===undefined)v=supabaseDefaultValue(k);
  const client=getSupabaseClient();
  if(!client || !SUPABASE_KEYS.includes(k))return {ok:false,msg:'not-enabled'};
  try{
    const {error}=await client.from(SUPABASE_TABLE).upsert({
      key:k,
      value:v,
      updated_at:new Date().toISOString()
    },{onConflict:'key'});
    if(error)throw error;
    return {ok:true,msg:'saved'};
  }catch(e){
    console.error('Supabase push failed',k,e);
    return {ok:false,msg:e.message||String(e)};
  }
}
function queueSupabaseWrite(k,v){
  if(v===null||v===undefined)v=supabaseDefaultValue(k);
  if(!SUPABASE_ENABLED || !SUPABASE_KEYS.includes(k))return;
  clearTimeout(supabaseWriteTimers[k]);
  supabaseWriteTimers[k]=setTimeout(()=>supabasePushKey(k,v),350);
}
function supabaseDefaultValue(k){
  if(k==='settings')return typeof DEFAULT_SETTINGS!=='undefined'?DEFAULT_SETTINGS:{};
  if(k==='tours')return typeof DEFAULT_TOURS!=='undefined'?DEFAULT_TOURS:[];
  if(k==='orders')return [];
  if(k==='leads')return [];
  if(k==='contactStaff')return [];
  if(k==='discounts')return [];
  if(k==='visaServices')return typeof DEFAULT_VISAS!=='undefined'?DEFAULT_VISAS:[];
  if(k==='hotelCatalog')return typeof DEFAULT_HOTEL_CATALOG!=='undefined'?DEFAULT_HOTEL_CATALOG:{};
  if(k==='staffAccounts')return typeof DEFAULT_STAFF_ACCOUNTS!=='undefined'?DEFAULT_STAFF_ACCOUNTS:(typeof DEFAULT_STAFF!=='undefined'?DEFAULT_STAFF:[]);
  if(k==='customerTrail')return [];
  return {};
}

async function supabasePushAll(){
  const client=getSupabaseClient();
  if(!client)return {ok:false,msg:'Supabase تنظیم نشده است'};
  let done=0,failed=0;
  for(const k of SUPABASE_KEYS){
    const val=read(k,supabaseDefaultValue(k));
    const res=await supabasePushKey(k,val);
    if(res.ok)done++;else failed++;
  }
  return {ok:failed===0,msg:`${faNum(done)} مورد ذخیره شد${failed?`، ${faNum(failed)} خطا`:''}`};
}
async function supabaseManualPull(){
  const r=await supabasePullAll();
  showToast(r.msg);
  if(r.ok)setTimeout(()=>location.reload(),700);
}
async function supabaseManualPush(){
  try{ if(typeof seed==='function') seed(); if(typeof repairAppData==='function') repairAppData(); }catch(e){console.warn('pre-push repair failed',e)}
  const r=await supabasePushAll();
  showToast(r.msg);
}
function supabasePanel(){
  return `<section class="card pad supabase-panel">
    <div class="row wrap">
      <div>
        <span class="badge international">Supabase</span>
        <h3>اتصال دیتابیس آنلاین</h3>
        <p class="small">${supabaseStatusText()}؛ اطلاعات ابتدا در مرورگر ذخیره می‌شود و در صورت تنظیم بودن Supabase، آنلاین هم sync می‌شود.</p>
      </div>
      <div class="actions">
        <button class="soft" onclick="supabaseTestConnection()">تست اتصال</button>
        <button class="soft" onclick="supabaseManualPull()">خواندن از Supabase</button>
        <button class="btn" onclick="supabaseManualPush()">ارسال همه اطلاعات</button>
      </div>
    </div>
  </section>`;
}
async function bootSupabaseSync(){
  if(!SUPABASE_ENABLED || supabaseBootSynced)return;
  const r=await supabasePullAll();
  if(r.ok){
    console.info(r.msg);
    if(typeof renderAdmin==='function')renderAdmin();
    if(typeof renderStaff==='function')renderStaff();
    if(typeof renderHome==='function' && location.pathname.includes('/buyer'))renderHome();
  }
}
window.addEventListener('load',()=>setTimeout(bootSupabaseSync,450));

function $(id){return document.getElementById(id)}
function money(n){return Number(n||0).toLocaleString('fa-IR')+' تومان'}
function faNum(n){return String(n).replace(/\d/g,d=>'۰۱۲۳۴۵۶۷۸۹'[d])}
function reqStar(){return '<span class="req-star">*</span>'}
function hotelStars(n){
  n=Number(n)||0;
  return '<span class="hotel-stars">'+Array.from({length:Math.max(1,n)},()=>'<i class="fa-solid fa-star"></i>').join('')+'</span>';
}
function read(k,f){
  try{
    const raw=localStorage.getItem(PREFIX+k);
    if(raw===null||raw===undefined)return f;
    const parsed=JSON.parse(raw);
    return parsed??f;
  }catch(e){
    console.warn('read failed',k,e);
    return f;
  }
}
function write(k,v){
  try{
    localStorage.setItem(PREFIX+k,JSON.stringify(v));
    queueSupabaseWrite(k,v);
    return true;
  }catch(e){
    console.error('write failed',k,e);
    try{
      if(k==='tours'){
        const light=(Array.isArray(v)?v:[]).map(t=>({
          ...t,
          gallery:(t.gallery||[]).filter(x=>!String(x).startsWith('data:image/')).slice(0,4),
          hotels:(t.hotels||[]).map(h=>({...h,photos:(h.photos||[]).filter(x=>!String(x).startsWith('data:image/')).slice(0,8)}))
        }));
        localStorage.setItem(PREFIX+k,JSON.stringify(light));
        queueSupabaseWrite(k,light);
        alert('حجم عکس‌های آپلودی زیاد بود؛ عکس‌های حجیم داخلی حذف شدند و اطلاعات اصلی ذخیره شد.');
        return true;
      }
    }catch(e2){console.error('fallback write failed',k,e2)}
    alert('ذخیره انجام نشد. حجم اطلاعات یا عکس‌ها زیاد است. چند عکس را حذف کن یا URL عکس وارد کن.');
    return false;
  }
}

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


const DEFAULT_VISAS=[
  {id:'visa-1',country:'امارات',city:'دبی',price:4500000,duration:'۳ تا ۷ روز کاری',type:'توریستی',docs:'پاسپورت، عکس، فرم درخواست',active:true},
  {id:'visa-2',country:'ترکیه',city:'استانبول',price:0,duration:'بدون ویزا برای پاسپورت ایران',type:'بدون ویزا',docs:'پاسپورت معتبر',active:true},
  {id:'visa-3',country:'تایلند',city:'بانکوک',price:7800000,duration:'۷ تا ۱۴ روز کاری',type:'توریستی',docs:'پاسپورت، عکس، تمکن، رزرو هتل',active:true},
  {id:'visa-4',country:'ارمنستان',city:'ایروان',price:0,duration:'بدون ویزا برای پاسپورت ایران',type:'بدون ویزا',docs:'پاسپورت معتبر',active:true},
  {id:'visa-5',country:'مالزی',city:'کوالالامپور',price:0,duration:'بدون ویزا برای اقامت کوتاه',type:'بدون ویزا',docs:'پاسپورت معتبر و بلیط برگشت',active:true}
];

function visaServices(){return read('visaServices',DEFAULT_VISAS)}
function saveVisaServices(v){write('visaServices',v)}

function themedTourImage(t){
  const s=String((t?.dest||'')+' '+(t?.title||'')).toLowerCase();
  if(s.includes('دبی')||s.includes('dubai'))return '../assets/images/dubai-burj-khalifa.svg';
  if(s.includes('آنتالیا')||s.includes('antalya'))return '../assets/images/antalya-beach.svg';
  if(s.includes('کیش')||s.includes('kish'))return '../assets/images/kish-island.svg';
  if(s.includes('مشهد')||s.includes('mashhad'))return '../assets/images/mashhad-shrine.svg';
  if(s.includes('کاپادوکیا')||s.includes('cappadocia'))return '../assets/images/cappadocia-balloons.svg';
  if(s.includes('شیراز')||s.includes('shiraz')||s.includes('persepolis'))return '../assets/images/shiraz-persepolis.svg';
  if(s.includes('اصفهان')||s.includes('isfahan'))return '../assets/images/isfahan-bridge.svg';
  if(s.includes('پاریس')||s.includes('paris'))return '../assets/images/paris-eiffel.svg';
  if(s.includes('رم')||s.includes('rome'))return '../assets/images/rome-colosseum.svg';
  if(s.includes('بانکوک')||s.includes('bangkok'))return '../assets/images/bangkok-temple.svg';
  if(s.includes('ایروان')||s.includes('yerevan'))return '../assets/images/yerevan-cascade.svg';
  if(s.includes('گرجستان')||s.includes('georgia')||s.includes('tbilisi'))return '../assets/images/georgia-caucasus.svg';
  if(s.includes('مالزی')||s.includes('kuala')||s.includes('malaysia'))return '../assets/images/malaysia-towers.svg';
  return '../assets/images/istanbul-hagia-sophia.svg';
}
function normalizeTourImagesTheme(){
  if(read('imagesThemeV3Applied',false))return;
  const ts=tours().map(t=>({...t,img:themedTourImage(t),gallery:[themedTourImage(t),...((t.gallery||[]).filter(x=>x!==t.img&&x!==themedTourImage(t))).slice(0,3)]}));
  saveTours(ts);
  write('imagesThemeV3Applied',true);
}

const TOUR_TITLE_FA_MAP = {
  "Istanbul Spring Escape": "تور بهاره استانبول",
  "Dubai Luxury Break": "تور لوکس دبی",
  "Antalya Summer Resort": "تور تابستانی آنتالیا",
  "Kish Island Holiday": "تور تعطیلات کیش",
  "Mashhad Pilgrimage Tour": "تور زیارتی مشهد",
  "Cappadocia Balloon Experience": "تور بالون‌سواری کاپادوکیا",
  "Shiraz & Persepolis Journey": "تور شیراز و تخت جمشید",
  "Isfahan Heritage Tour": "تور میراث اصفهان",
  "Paris Dream Vacation": "تور رویایی پاریس",
  "Paris Classic Tour": "تور کلاسیک پاریس",
  "Rome Historical Escape": "تور تاریخی رم",
  "Rome Heritage Trip": "تور تاریخی رم",
  "Bangkok Temple Discovery": "تور معابد بانکوک",
  "Bangkok Temple Escape": "تور معابد بانکوک",
  "Yerevan City Break": "تور شهری ایروان",
  "Georgia Nature Tour": "تور طبیعت گرجستان",
  "Kuala Lumpur Modern Trip": "تور کوالالامپور مدرن",
  "Kuala Lumpur Modern Tour": "تور کوالالامپور مدرن",
  "Malaysia Towers Tour": "تور مالزی و برج‌های دوقلو",
  "Turkey Family Trip": "تور خانوادگی ترکیه",
  "Armenia Weekend Tour": "تور آخر هفته ارمنستان",
  "Thailand Beach Tour": "تور ساحلی تایلند",
  "Georgia Caucasus Tour": "تور قفقاز گرجستان"
};
function normalizeTourPersianNamesAndImages(){
  const ts=tours().map(t=>{
    const title=TOUR_TITLE_FA_MAP[t.title]||t.title;
    const nt={...t,title};
    const img=themedTourImage(nt);
    return {...nt,img:nt.img||img,gallery:(nt.gallery&&nt.gallery.length)?nt.gallery:[img]};
  });
  saveTours(ts);
}

function customerTrail(){return read('customerTrail',[])}
function saveCustomerTrail(v){write('customerTrail',v)}
function addCustomerTrail(t){
  if(!t)return;
  const list=customerTrail().filter(x=>Number(x.tourId)!==Number(t.id));
  list.unshift({tourId:t.id,tourTitle:t.title,dest:t.dest,visitedAt:new Date().toISOString()});
  saveCustomerTrail(list.slice(0,30));
}
function trailSummary(){
  return customerTrail().map(x=>x.tourTitle+' - '+x.dest).slice(0,12).join(' | ');
}


function toEnDigits(s){
  return String(s||'').replace(/[۰-۹]/g,d=>'۰۱۲۳۴۵۶۷۸۹'.indexOf(d)).replace(/[٠-٩]/g,d=>'٠١٢٣٤٥٦٧٨٩'.indexOf(d));
}
function normalizeDurationNightFirst(v){
  const s=String(v||'').trim();
  if(!s)return s;
  const en=toEnDigits(s);
  const nightMatch=en.match(/(\d+)\s*شب/);
  const dayMatch=en.match(/(\d+)\s*روز/);
  if(nightMatch && dayMatch){
    return `${faNum(nightMatch[1])} شب و ${faNum(dayMatch[1])} روز`;
  }
  const nums=[...en.matchAll(/\d+/g)].map(m=>Number(m[0])).filter(n=>!isNaN(n));
  if(nums.length>=2 && /روز/.test(s) && /شب/.test(s)){
    const day=/روز/.test(s.split(String(nums[0]))[1]||'')?nums[0]:nums[1];
    const night=day===nums[0]?nums[1]:nums[0];
    return `${faNum(night)} شب و ${faNum(day)} روز`;
  }
  return s.replace(/(\d+|[۰-۹]+)\s*روز\s*و\s*(\d+|[۰-۹]+)\s*شب/g,(m,d,n)=>`${faNum(toEnDigits(n))} شب و ${faNum(toEnDigits(d))} روز`);
}
function normalizeAllTourDurations(){
  const ts=tours().map(t=>({...t,duration:normalizeDurationNightFirst(t.duration)}));
  saveTours(ts);
}



const DESTINATION_GUIDES={
  "استانبول":{title:"راهنمای سفر استانبول",intro:"استانبول شهری برای خرید، گشت شهری، کافه‌گردی و دیدن تاریخ زنده است. پرواز تهران تا استانبول حدود سه ساعت طول می‌کشد و این مقصد برای سفر شهری، خرید و بازدید از جاذبه‌های تاریخی انتخابی محبوب است.",bestFor:["خرید", "گشت تاریخی", "سفر شهری"],highlights:["ایاصوفیه و مسجد آبی", "تنگه بسفر", "بازار بزرگ و مراکز خرید", "خیابان استقلال و تکسیم"],tips:["برای خرید و رفت‌وآمد، موقعیت هتل نسبت به مترو و میدان‌های اصلی مهم است.", "برای سفر کوتاه، هتل نزدیک تکسیم یا شیشلی انتخاب راحت‌تری است."]},
  "دبی":{title:"راهنمای سفر دبی",intro:"دبی مقصدی مدرن، لوکس و پرانرژی است؛ ترکیبی از برج‌های بلند، مراکز خرید بزرگ، ساحل، تفریحات شهری و تجربه‌های خاص. مسیر هوایی ایران تا دبی کوتاه است و برای سفر خانوادگی، خرید و تفریح لوکس بسیار پرطرفدار است.",bestFor:["خرید", "تفریحات لوکس", "سفر خانوادگی"],highlights:["برج خلیفه و دبی مال", "مارینا و جمیرا", "جزیره نخل", "تور صحرا و پارک‌های آبی"],tips:["در دبی هزینه‌های جانبی تفریحات را از قبل در نظر بگیرید.", "برای سفر تفریحی، موقعیت هتل نسبت به مراکز خرید و ساحل اهمیت دارد."]},
  "آنتالیا":{title:"راهنمای سفر آنتالیا",intro:"آنتالیا برای سفر ساحلی، هتل‌های تفریحی و استراحت در کنار مدیترانه انتخابی محبوب است. این مقصد بیشتر برای سفرهای چندروزه، خانوادگی و استفاده از خدمات هتل‌های UALL مناسب است.",bestFor:["ساحل", "هتل UALL", "استراحت"],highlights:["سواحل لارا و کمر", "هتل‌های تفریحی", "کالیچی", "آبشار دودن و تفریحات دریایی"],tips:["اگر هدف اصلی استراحت است، کیفیت هتل از مرکز شهر مهم‌تر است.", "در فصل‌های شلوغ، هتل‌های خوب زودتر تکمیل می‌شوند."]},
  "کیش":{title:"راهنمای سفر کیش",intro:"کیش مقصد داخلی محبوب برای سفر کوتاه، خرید، ساحل و تفریحات آبی است. تور کیش از شهرهای مختلف ایران برگزار می‌شود و برای سفر خانوادگی، استراحت کوتاه و خرید گزینه‌ای در دسترس است.",bestFor:["ساحل", "خرید", "تفریحات آبی"],highlights:["کشتی یونانی", "اسکله تفریحی", "ساحل مرجان", "مراکز خرید پردیس و دامون"],tips:["برای تفریحات آبی بهتر است زمان سفر و شرایط آب‌وهوا را بررسی کنید.", "در سفر کوتاه، هتل نزدیک مراکز خرید یا ساحل انتخاب کاربردی‌تری است."]},
  "مشهد":{title:"راهنمای سفر مشهد",intro:"مشهد مقصدی زیارتی و خانوادگی است که هم با پرواز و هم قطار طرفداران زیادی دارد. مسیر هوایی تهران تا مشهد حدود یک ساعت و نیم است و برای سفر اقتصادی، زیارتی و خانوادگی بسیار مناسب است.",bestFor:["زیارتی", "خانوادگی", "سفر اقتصادی"],highlights:["حرم امام رضا", "بازار رضا", "طرقبه و شاندیز", "مراکز خرید مشهد"],tips:["برای سفر زیارتی، فاصله هتل تا حرم یکی از مهم‌ترین معیارهاست.", "در ایام مناسبتی ظرفیت هتل‌ها سریع‌تر تکمیل می‌شود."]},
  "کاپادوکیا":{title:"راهنمای سفر کاپادوکیا",intro:"کاپادوکیا مقصدی متفاوت در ترکیه است؛ معروف به بالن‌سواری، دره‌های سنگی، هتل‌های غاری و مناظر خاص. این سفر برای کسانی مناسب است که تجربه‌ای خاص، عکاسی و طبیعت متفاوت می‌خواهند.",bestFor:["بالن‌سواری", "طبیعت متفاوت", "عکاسی"],highlights:["بالن‌سواری گورمه", "دره عشق", "شهرهای زیرزمینی", "هتل‌های غاری"],tips:["بالن‌سواری وابسته به شرایط آب‌وهواست و همیشه قطعی نیست.", "برای تجربه بهتر، اقامت در هتل‌های غاری پیشنهاد می‌شود."]},
  "شیراز":{title:"راهنمای سفر شیراز",intro:"شیراز مقصد فرهنگ، شعر، باغ‌های ایرانی و آثار تاریخی است. این شهر برای سفر داخلی آرام، خانوادگی و تاریخی انتخابی مناسب است و ترکیبی از آرامش، تاریخ و طبیعت شهری دارد.",bestFor:["فرهنگ و تاریخ", "باغ‌گردی", "سفر داخلی"],highlights:["حافظیه و سعدیه", "باغ ارم", "تخت جمشید", "بازار وکیل"],tips:["برای بازدید از تخت جمشید یک نیم‌روز جدا در نظر بگیرید.", "بهار یکی از دلپذیرترین زمان‌ها برای سفر به شیراز است."]},
  "اصفهان":{title:"راهنمای سفر اصفهان",intro:"اصفهان مقصد معماری ایرانی، میدان‌های تاریخی، پل‌ها و بازارهای سنتی است. برای سفر داخلی فرهنگی و چندروزه بسیار مناسب است و تجربه‌ای کامل از هنر و تاریخ ایران ارائه می‌دهد.",bestFor:["تاریخ و معماری", "خرید صنایع دستی", "سفر خانوادگی"],highlights:["میدان نقش جهان", "سی‌وسه‌پل و پل خواجو", "کاخ چهلستون", "بازار قیصریه"],tips:["هتل نزدیک مرکز تاریخی رفت‌وآمد را ساده‌تر می‌کند.", "برای بازار و میدان نقش جهان زمان کافی بگذارید."]},
  "پاریس":{title:"راهنمای سفر پاریس",intro:"پاریس مقصد هنر، مد، موزه و خیابان‌گردی است. این سفر بیشتر مناسب کسانی است که ترکیب جاذبه‌های شهری، فرهنگ، خرید و فضای اروپایی را می‌خواهند.",bestFor:["هنر و موزه", "مد و خرید", "سفر اروپایی"],highlights:["برج ایفل", "موزه لوور", "شانزه‌لیزه", "مون‌مارتر"],tips:["برای موزه‌ها و جاذبه‌های مهم، رزرو قبلی زمان زیادی ذخیره می‌کند.", "هزینه‌های شهری را در بودجه سفر در نظر بگیرید."]},
  "رم":{title:"راهنمای سفر رم",intro:"رم مقصدی برای عاشقان تاریخ، معماری و غذاهای ایتالیایی است. قدم‌زدن در شهر مثل عبور از یک موزه زنده است و ترکیب آثار باستانی، کافه‌ها و میدان‌های تاریخی جذابیت ویژه‌ای دارد.",bestFor:["تاریخ باستان", "غذا و کافه", "سفر فرهنگی"],highlights:["کولوسئوم", "واتیکان", "فواره تروی", "پانتئون"],tips:["برای جاذبه‌های مهم رم، تهیه بلیت از قبل باعث صرفه‌جویی در زمان می‌شود.", "کفش راحت برای پیاده‌روی شهری ضروری است."]},
  "بانکوک":{title:"راهنمای سفر بانکوک",intro:"بانکوک شهری پرجنب‌وجوش با معابد طلایی، بازارهای محلی، مراکز خرید و غذاهای خیابانی است. برای سفر اقتصادی و پرهیجان جنوب شرق آسیا انتخابی محبوب است.",bestFor:["خرید", "غذاهای خیابانی", "معابد"],highlights:["گرند پالاس", "معبد وات آرون", "بازار چاتوچاک", "مراکز خرید سیام"],tips:["برای بازدید از معابد، پوشش مناسب همراه داشته باشید.", "حمل‌ونقل شهری و تاکسی‌های اینترنتی سفر را راحت‌تر می‌کنند."]},
  "ایروان":{title:"راهنمای سفر ایروان",intro:"ایروان مقصدی نزدیک، اقتصادی و مناسب سفر کوتاه است. فضای شهری آرام، کافه‌ها و میدان‌های مرکزی، آن را برای سفر چندروزه محبوب کرده است.",bestFor:["سفر کوتاه", "اقتصادی", "کافه‌گردی"],highlights:["میدان جمهوری", "کاسکاد", "بازار ورنیساژ", "دریاچه سوان"],tips:["ایروان برای سفر کوتاه چندروزه گزینه‌ای اقتصادی است.", "برای گشت اطراف شهر، تورهای یک‌روزه انتخاب خوبی هستند."]},
  "تفلیس":{title:"راهنمای سفر تفلیس",intro:"تفلیس با خیابان‌های قدیمی، طبیعت قفقاز، غذاهای محلی و هزینه مناسب، مقصدی محبوب برای سفر خارجی نزدیک است. این شهر ترکیبی از بافت تاریخی، کافه‌ها و چشم‌اندازهای طبیعی دارد.",bestFor:["طبیعت و شهر", "غذاهای محلی", "سفر اقتصادی"],highlights:["شهر قدیمی تفلیس", "پل صلح", "قلعه ناریکالا", "حمام‌های گوگردی"],tips:["تفلیس برای سفر اقتصادی خارجی گزینه‌ای محبوب است.", "غذاهای محلی گرجستان بخش مهمی از تجربه سفر هستند."]},
  "کوالالامپور":{title:"راهنمای سفر کوالالامپور",intro:"کوالالامپور مقصدی مدرن در مالزی است؛ ترکیبی از برج‌های بلند، مراکز خرید، غذاهای متنوع و دسترسی به طبیعت و جزایر اطراف. برای سفر خانوادگی و شهری انتخاب مناسبی است.",bestFor:["خرید", "غذاهای متنوع", "سفر خانوادگی"],highlights:["برج‌های پتروناس", "غار باتو", "بوکیت بینتانگ", "مراکز خرید پاویلیون"],tips:["کوالالامپور برای ترکیب خرید و گشت شهری مناسب است.", "برای سفر ترکیبی می‌توان آن را با جزایر مالزی هماهنگ کرد."]}
};
function destinationGuide(dest,title=''){
  const d=String(dest||''), t=String(title||'');
  const key=Object.keys(DESTINATION_GUIDES).find(k=>d.includes(k)||t.includes(k)||k.includes(d));
  return key?DESTINATION_GUIDES[key]:null;
}
function destinationGuideList(){return Object.entries(DESTINATION_GUIDES).map(([dest,info])=>({dest,...info}))}

function defaultTourById(id){return (DEFAULT_TOURS||[]).find(x=>Number(x.id)===Number(id))||null}
function repairHotel(h,basePrice,star){
  const price=Number(h?.price||basePrice||0);
  return {
    ...h,
    star:Number(h?.star||star||3),
    name:h?.name||h?.nameLatin||`هتل ${faNum(star||3)} ستاره`,
    price,
    capacity:Number.isFinite(Number(h?.capacity))?Number(h.capacity):10,
    showInBuyer:h?.showInBuyer!==false,
    photos:(h?.photos||h?.images||[]).filter(Boolean).slice(0,12),
    bookingLink:h?.bookingLink||''
  };
}
function repairTour(t,i){
  const def=defaultTourById(t?.id)||DEFAULT_TOURS[i%DEFAULT_TOURS.length]||{};
  const dest=t?.dest||def.dest||'استانبول';
  const title=(typeof TOUR_TITLE_FA_MAP!=='undefined'&&TOUR_TITLE_FA_MAP[t?.title])||t?.title||def.title||`تور ${dest}`;
  const img=t?.img||def.img||themedTourImage({dest,title});
  const rawHotels=Array.isArray(t?.hotels)&&t.hotels.length?t.hotels:(def.hotels||[]);
  const hotels=(rawHotels.length?rawHotels:[
    {star:3,name:'هتل سه ستاره پیشنهادی',price:t?.price||def.price||10000000,capacity:10},
    {star:4,name:'هتل چهار ستاره پیشنهادی',price:Math.round((t?.price||def.price||10000000)*1.25),capacity:8},
    {star:5,name:'هتل پنج ستاره پیشنهادی',price:Math.round((t?.price||def.price||10000000)*1.55),capacity:5}
  ]).map((h,idx)=>repairHotel(h,t?.price||def.price||10000000,h?.star||[3,4,5][idx%3]));
  return {
    ...def,...t,
    id:t?.id||Date.now()+i,
    title,dest,
    duration:normalizeDurationNightFirst(t?.duration||def.duration||'۴ شب و ۵ روز'),
    airline:t?.airline||def.airline||'ایرلاین',
    returnAirline:t?.returnAirline||def.returnAirline||t?.airline||def.airline||'ایرلاین',
    flightTime:t?.flightTime||def.flightTime||'۰۸:۳۰',
    landingTime:t?.landingTime||def.landingTime||'۱۲:۴۵',
    price:Number(t?.price||def.price||10000000),
    status:t?.status||'active',
    type:t?.type||def.type||'international',
    level:t?.level||def.level||'special',
    categories:Array.isArray(t?.categories)&&t.categories.length?t.categories:(def.categories||[t?.type||def.type||'international']),
    rating:Number(t?.rating||def.rating||4.5),
    img,
    gallery:(Array.isArray(t?.gallery)&&t.gallery.length?t.gallery:(def.gallery&&def.gallery.length?def.gallery:[img])).filter(Boolean).slice(0,5),
    dates:(Array.isArray(t?.dates)&&t.dates.length?t.dates:(def.dates||['۱۴۰۵/۰۴/۱۵','۱۴۰۵/۰۴/۲۲','۱۴۰۵/۰۵/۰۱'])),
    hotels,
    includes:Array.isArray(t?.includes)?t.includes:(def.includes||[]),
    excludes:Array.isArray(t?.excludes)?t.excludes:(def.excludes||[]),
    itinerary:Array.isArray(t?.itinerary)?t.itinerary:(def.itinerary||[]),
    docs:Array.isArray(t?.docs)?t.docs:(def.docs||[]),
    sectionVisibility:t?.sectionVisibility||def.sectionVisibility||{}
  };
}
function repairToursList(list){
  let arr=Array.isArray(list)?list:[];
  if(!arr.length)arr=[...DEFAULT_TOURS];
  arr=arr.filter(Boolean).map(repairTour);
  const ids=new Set(arr.map(t=>Number(t.id)));
  (DEFAULT_TOURS||[]).forEach((d,i)=>{if(!ids.has(Number(d.id)))arr.push(repairTour(d,arr.length+i))});
  return arr;
}
function repairAppData(){
  write('tours',repairToursList(read('tours',DEFAULT_TOURS)));
  if(!Array.isArray(read('discounts',null)))write('discounts',DEFAULT_DISCOUNTS);
  if(!Array.isArray(read('visaServices',null)))write('visaServices',DEFAULT_VISAS);
  if(!Array.isArray(read('hotelCatalog',null)))write('hotelCatalog',defaultHotelCatalog());
  if(!Array.isArray(read('staffAccounts',null)))write('staffAccounts',defaultStaffAccounts());
}
function resetDemoData(){
  if(confirm('همه تورها و تنظیمات نمونه دوباره ساخته شود؟')){
    write('tours',DEFAULT_TOURS);
    write('discounts',DEFAULT_DISCOUNTS);
    write('visaServices',DEFAULT_VISAS);
    write('hotelCatalog',defaultHotelCatalog());
    showToast('داده‌های نمونه بازیابی شد');
    setTimeout(()=>location.reload(),600);
  }
}

function seed(){
  repairAppData();
  normalizeTourImagesTheme();
  if(typeof normalizeTourPersianNamesAndImages==='function')normalizeTourPersianNamesAndImages();
}
function tours(){return repairToursList(read('tours',DEFAULT_TOURS))}function saveTours(v){return write('tours',repairToursList(v))}
function orders(){return read('orders',[])}function saveOrders(v){write('orders',v)}
function leads(){return read('leads',[])}function saveLeads(v){write('leads',v)}
function contactStaff(){return read('contactStaff',[])}function saveContactStaff(v){write('contactStaff',v)}
function discounts(){return read('discounts',DEFAULT_DISCOUNTS)}function saveDiscounts(v){write('discounts',v)}
function wishlist(){return read('wish',[])}function saveWish(v){write('wish',v)}
function findTour(id){return tours().find(t=>Number(t.id)===Number(id))}
function minHotel(t){const hs=visibleHotels(t);return (hs.length?hs:[{price:t.price}]).slice().sort((a,b)=>Number(a.price||0)-Number(b.price||0))[0]}
function totalCapacity(t){return visibleHotels(t).reduce((s,h)=>s+Number(h.capacity||0),0)}
function isTourSoldOut(t){return totalCapacity(t)<=0}
function isHotelSoldOut(h){return Number(h?.capacity||0)<=0}
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
      write('currentStaffUser',{username:'demo-staff',name:'فروش دمو'});
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
    <a href="../buyer/index.html">پنل مشتری</a>
    <a href="../staff/index.html">پنل فروش</a>
    <a href="../admin/index.html">پنل مدیریت</a>
  `;

  const links = type === 'buyer' ? buyerLinks : privateLinks;

  return `
<header class="header">
  <div class="container nav">
    <a class="logo" href="../buyer/index.html">
      <span class="logo-icon logo-img-box"><img src="../assets/images/logo-safaro.png" alt="Safaro logo"></span>
      <span>سفرو<small style="display:block;color:var(--p);font-size:9px;letter-spacing:2px">SAFARO</small></span>
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
      <a href="../buyer/index.html"><i class="fa-solid fa-house"></i>مشتری</a>
      <a href="../staff/index.html"><i class="fa-regular fa-user-pen"></i>فروش</a>
      <a href="../admin/index.html"><i class="fa-solid fa-chart-line"></i>مدیریت</a>
    </nav>`;

  return `<footer class="footer"><b>سفرو ایرانیان</b><br>${type === 'buyer' ? 'مشاهده و رزرو آنلاین تورهای داخلی و خارجی' : 'پنل داخلی سفرو'}<br><span style="font-size:11px;color:var(--t2)">۰۲۱-۴۹۹۷۶ | تهران، بلوار فردوس شرق، بعد از عقیل، پلاک ۳۵۱</span></footer>${type === 'buyer' ? buyerBottom : privateBottom}`;
}

function mount(type){
  $('headerMount').innerHTML = layout(type);
  $('footerMount').innerHTML = footer(type);
  updateWishCount();
}
document.addEventListener('DOMContentLoaded',()=>{seed();normalizeAllTourDurations();initTheme()});

