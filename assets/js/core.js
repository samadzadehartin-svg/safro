const PREFIX='safarro_three_panels_';
function $(id){return document.getElementById(id)}
function money(n){return Number(n||0).toLocaleString('fa-IR')+' تومان'}
function faNum(n){return String(n).replace(/\d/g,d=>'۰۱۲۳۴۵۶۷۸۹'[d])}
function reqStar(){return '<span class="req-star">*</span>'}
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
  'استانبول':{
    title:'راهنمای سفر استانبول',
    intro:'استانبول شهری برای خرید، گشت شهری، کافه‌گردی و دیدن تاریخ زنده است. پرواز تهران تا استانبول حدود سه ساعت طول می‌کشد و انتخاب ساعت پرواز روی کیفیت روز اول سفر اثر زیادی دارد.',
    bestFor:['خرید','گشت تاریخی','سفر شهری','کافه‌گردی'],
    highlights:['ایاصوفیه و سلطان‌احمد','بسفر و اسکله‌ها','خیابان استقلال و تکسیم','مراکز خرید و بازار بزرگ'],
    tips:['برای استفاده بهتر از روز اول، پرواز صبح یا ظهر انتخاب بهتری است.','نزدیکی هتل به مترو یا تکسیم در رفت‌وآمد خیلی مهم است.'],
    source:'بازنویسی براساس محتوای مقصد استانبول در الفبای سفر'
  },
  'دبی':{
    title:'راهنمای سفر دبی',
    intro:'دبی مقصدی مدرن، لوکس و پرانرژی است؛ ترکیبی از برج‌های بلند، مراکز خرید بزرگ، ساحل، تفریحات شهری و تجربه‌های خاص. مسیر هوایی از تهران تا امارات کوتاه است و معمولاً حدود دو ساعت زمان می‌برد.',
    bestFor:['خرید','تفریحات لوکس','سفر خانوادگی','تفریحات شهری'],
    highlights:['برج خلیفه و دبی مال','مارینا و جمیرا','تور صحرا','پارک‌های آبی و شهربازی‌ها'],
    tips:['هزینه‌های جانبی دبی را قبل از سفر در نظر بگیرید.','برای ویزا، واچر هتل و بلیط رفت‌وبرگشت اهمیت دارد.'],
    source:'بازنویسی براساس محتوای مقصد دبی و امارات در الفبای سفر'
  },
  'آنتالیا':{
    title:'راهنمای سفر آنتالیا',
    intro:'آنتالیا برای سفر ساحلی، هتل‌های تفریحی و استراحت در کنار مدیترانه انتخابی محبوب است. این مقصد بیشتر برای سفرهای چندروزه، هتل‌های UALL و برنامه‌های خانوادگی شناخته می‌شود.',
    bestFor:['ساحل','هتل UALL','استراحت','سفر خانوادگی'],
    highlights:['سواحل مدیترانه','هتل‌های تفریحی','کاله‌ایچی','پارک‌های آبی و تفریحات دریایی'],
    tips:['اگر هدف اصلی استراحت است، کیفیت هتل از مرکز شهر مهم‌تر می‌شود.','برای سفر تابستانی، ظرفیت هتل‌های خوب زودتر تکمیل می‌شود.'],
    source:'بازنویسی براساس محتوای مقصد آنتالیا و ترکیه در الفبای سفر'
  },
  'کیش':{
    title:'راهنمای سفر کیش',
    intro:'کیش مقصد داخلی محبوب برای سفر کوتاه، خرید، ساحل و تفریحات آبی است. تور کیش از شهرهای مختلف ایران برگزار می‌شود و برای سفرهای خانوادگی و لحظه آخری گزینه پرتقاضایی است.',
    bestFor:['ساحل','خرید','تفریحات آبی','سفر داخلی'],
    highlights:['ساحل مرجان','کشتی یونانی','مراکز خرید','پارک‌های آبی و تفریحات دریایی'],
    tips:['در ایام شلوغ، قیمت پرواز و هتل سریع تغییر می‌کند.','برای سفر اقتصادی‌تر، تورهای لحظه آخری را بررسی کنید.'],
    source:'بازنویسی براساس محتوای مقصد کیش در الفبای سفر'
  },
  'مشهد':{
    title:'راهنمای سفر مشهد',
    intro:'مشهد مقصدی زیارتی و خانوادگی است که هم با پرواز و هم قطار طرفداران زیادی دارد. مسیر هوایی تهران تا مشهد حدود یک ساعت و پانزده دقیقه است و انتخاب نوع حمل‌ونقل روی بودجه سفر اثر دارد.',
    bestFor:['زیارتی','خانوادگی','سفر اقتصادی','هتل نزدیک حرم'],
    highlights:['حرم مطهر رضوی','بازار رضا','طرقبه و شاندیز','مراکز خرید مشهد'],
    tips:['برای سفر زیارتی، فاصله هتل تا حرم را جدی بگیرید.','در سفر با قطار، ساعت رسیدن را با تحویل اتاق هتل هماهنگ کنید.'],
    source:'بازنویسی براساس محتوای مقصد مشهد در الفبای سفر'
  },
  'کاپادوکیا':{
    title:'راهنمای سفر کاپادوکیا',
    intro:'کاپادوکیا مقصدی متفاوت در ترکیه است؛ معروف به بالن‌سواری، دره‌های سنگی، هتل‌های غاری و مناظر خاص. این سفر برای کسانی مناسب است که تجربه‌ای متفاوت‌تر از سفر شهری می‌خواهند.',
    bestFor:['بالن‌سواری','طبیعت متفاوت','عکاسی','هتل غاری'],
    highlights:['بالن‌های صبحگاهی','دره گورمه','شهرهای زیرزمینی','هتل‌های غاری'],
    tips:['بالن‌سواری وابسته به شرایط هواست.','لباس گرم برای صبح زود همراه داشته باشید.'],
    source:'بازنویسی و تکمیل محتوای مقصد ترکیه'
  },
  'شیراز':{
    title:'راهنمای سفر شیراز',
    intro:'شیراز مقصد فرهنگ، شعر، باغ‌های ایرانی و آثار تاریخی است. این شهر برای سفر داخلی آرام، خانوادگی و تاریخی انتخابی مناسب است.',
    bestFor:['فرهنگ و تاریخ','باغ‌گردی','سفر داخلی','عکاسی'],
    highlights:['حافظیه و سعدیه','باغ ارم','تخت جمشید','بازار وکیل'],
    tips:['برای بازدید از تخت جمشید یک نیم‌روز جدا در نظر بگیرید.','بهار شیراز یکی از بهترین زمان‌های سفر است.'],
    source:'بازنویسی اختصاصی برای راهنمای مقصد داخلی'
  },
  'اصفهان':{
    title:'راهنمای سفر اصفهان',
    intro:'اصفهان مقصد معماری ایرانی، میدان‌های تاریخی، پل‌ها و بازارهای سنتی است. برای سفر داخلی فرهنگی و چندروزه بسیار مناسب است.',
    bestFor:['تاریخ و معماری','خرید صنایع دستی','سفر خانوادگی','گشت شهری'],
    highlights:['میدان نقش جهان','سی‌وسه‌پل','پل خواجو','بازار قیصریه'],
    tips:['اقامت نزدیک مرکز تاریخی زمان رفت‌وآمد را کم می‌کند.','برای بازار و میدان نقش جهان زمان کافی بگذارید.'],
    source:'بازنویسی اختصاصی برای راهنمای مقصد داخلی'
  },
  'پاریس':{
    title:'راهنمای سفر پاریس',
    intro:'پاریس مقصد هنر، مد، موزه و خیابان‌گردی است. این سفر بیشتر مناسب کسانی است که ترکیب جاذبه‌های شهری، فرهنگ و خرید را می‌خواهند.',
    bestFor:['هنر و موزه','مد و خرید','سفر اروپایی','ماه‌عسل'],
    highlights:['برج ایفل','موزه لوور','شانزه‌لیزه','مونمارتر'],
    tips:['برای بازدید از موزه‌ها بلیط و زمان‌بندی را از قبل مشخص کنید.','هزینه حمل‌ونقل و ورودی‌ها را در بودجه سفر لحاظ کنید.'],
    source:'بازنویسی اختصاصی برای راهنمای مقصد خارجی'
  },
  'رم':{
    title:'راهنمای سفر رم',
    intro:'رم مقصدی برای عاشقان تاریخ، معماری و غذاهای ایتالیایی است. قدم‌زدن در شهر مثل عبور از یک موزه زنده است.',
    bestFor:['تاریخ باستان','غذا و کافه','سفر فرهنگی','پیاده‌گردی'],
    highlights:['کولوسئوم','واتیکان','فواره تروی','پله‌های اسپانیایی'],
    tips:['کفش راحت برای پیاده‌روی ضروری است.','جاذبه‌های اصلی رم معمولاً صف دارند؛ زمان‌بندی مهم است.'],
    source:'بازنویسی اختصاصی برای راهنمای مقصد خارجی'
  },
  'بانکوک':{
    title:'راهنمای سفر بانکوک',
    intro:'بانکوک شهری پرجنب‌وجوش با معابد طلایی، بازارهای محلی، مراکز خرید و غذاهای خیابانی است. برای سفر اقتصادی و پرهیجان جنوب شرق آسیا انتخاب محبوبی است.',
    bestFor:['خرید','غذاهای خیابانی','معابد','سفر اقتصادی'],
    highlights:['گرند پالاس','وات آرون','بازارهای شبانه','مراکز خرید بزرگ'],
    tips:['برای بازدید از معابد لباس مناسب همراه داشته باشید.','رفت‌وآمد با مترو و قایق شهری تجربه خوبی است.'],
    source:'بازنویسی براساس محتوای مقصد تایلند در الفبای سفر'
  },
  'ایروان':{
    title:'راهنمای سفر ایروان',
    intro:'ایروان مقصدی نزدیک، اقتصادی و مناسب سفر کوتاه است. فضای شهری آرام، کافه‌ها و میدان‌های مرکزی، آن را برای سفر چندروزه محبوب کرده است.',
    bestFor:['سفر کوتاه','اقتصادی','کافه‌گردی','بدون ویزا'],
    highlights:['میدان جمهوری','کاسکاد','دریاچه سوان','کافه‌ها و خیابان‌های مرکزی'],
    tips:['برای سفر کوتاه، اقامت در مرکز شهر انتخاب بهتری است.','برنامه دریاچه سوان را جداگانه زمان‌بندی کنید.'],
    source:'بازنویسی و تکمیل محتوای مقصد ارمنستان'
  },
  'تفلیس':{
    title:'راهنمای سفر تفلیس',
    intro:'تفلیس با خیابان‌های قدیمی، طبیعت قفقاز، غذاهای محلی و هزینه مناسب، مقصدی محبوب برای سفر خارجی نزدیک است.',
    bestFor:['طبیعت و شهر','غذاهای محلی','سفر اقتصادی','سفر نزدیک'],
    highlights:['شهر قدیم تفلیس','حمام‌های گوگردی','پل صلح','کازبگی و طبیعت قفقاز'],
    tips:['برای دیدن طبیعت گرجستان، یک روز خارج از شهر در نظر بگیرید.','هتل نزدیک شهر قدیم دسترسی بهتری می‌دهد.'],
    source:'بازنویسی و تکمیل محتوای مقصد گرجستان'
  },
  'کوالالامپور':{
    title:'راهنمای سفر کوالالامپور',
    intro:'کوالالامپور مقصدی مدرن در مالزی است؛ ترکیبی از برج‌های بلند، مراکز خرید، غذاهای متنوع و دسترسی به طبیعت و جزایر اطراف.',
    bestFor:['خرید','غذاهای متنوع','سفر خانوادگی','شهر مدرن'],
    highlights:['برج‌های دوقلو پتروناس','بوکیت بینتانگ','غار باتو','مراکز خرید مدرن'],
    tips:['برای سفر ترکیبی، کوالالامپور را با جزایر مالزی هماهنگ کنید.','رطوبت هوا بالاست؛ لباس سبک همراه داشته باشید.'],
    source:'بازنویسی براساس محتوای مقصد مالزی در الفبای سفر'
  }
};
function destinationGuide(dest){return DESTINATION_GUIDES[dest]||null}
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

