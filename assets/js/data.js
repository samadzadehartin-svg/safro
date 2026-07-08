const DEFAULT_IMG='../assets/images/istanbul-hagia-sophia.svg';

const DEFAULT_TOURS = [
  {
    "id": 1,
    "title": "Istanbul Spring Escape",
    "dest": "استانبول",
    "duration": "۵ روز و ۴ شب",
    "airline": "ترکیش ایرلاین",
"flightTime": "۰۸:۳۰",
    "landingTime": "۱۲:۴۵",
    "origin": "تهران",
    "destination": "استانبول",
    "price": 15500000,
    "label": "پرفروش",
    "type": "international",
    "level": "special",
    "categories": [
      "international",
      "special"
    ],
    "rating": 4.8,
    "status": "active",
    "lastMinute": true,
    "dealPercent": 10,
    "dealEndsAt": "2099-12-30T20:00:00.000Z",
    "img": "../assets/images/istanbul-hagia-sophia.svg",
    "gallery": [
      "../assets/images/istanbul-hagia-sophia.svg"
    ],
    "dates": [
      "۱۴۰۵/۰۴/۱۵",
      "۱۴۰۵/۰۴/۲۲",
      "۱۴۰۵/۰۵/۰۱"
    ],
    "hotels": [
      {
        "star": 3,
        "name": "هتل تکسیم لوراس",
        "price": 14200000,
        "capacity": 10
      },
      {
        "star": 4,
        "name": "هتل گرند استار",
        "price": 18176000,
        "capacity": 6
      },
      {
        "star": 5,
        "name": "هتل الیت ورد",
        "price": 23856000,
        "capacity": 3
      }
    ],
    "desc": "اقامت در استانبول با بازدید از ایاصوفیه، بسفر و محله‌های معروف.",
    "includes": [
      "ترانسفر فرودگاهی",
      "بیمه مسافرتی",
      "راهنمای فارسی",
      "صبحانه روزانه"
    ],
    "excludes": [
      "هزینه‌های شخصی",
      "گشت‌های اختیاری",
      "عوارض خروج"
    ],
    "itinerary": [
      "روز اول: پرواز و تحویل اتاق",
      "روز دوم: گشت شهری",
      "روز سوم: وقت آزاد",
      "روز آخر: بازگشت"
    ],
    "docs": [
      "کارت ملی",
      "پاسپورت معتبر برای تور خارجی"
    ],
    "cancellation": "طبق قوانین چارتر و هتل، با هماهنگی کارشناس فروش.",
    "childPolicy": "نرخ کودک طبق سن و نوع تخت محاسبه می‌شود.",
    "reviews": [
      {
        "name": "مسافر سفرو",
        "rate": 5,
        "text": "برنامه‌ریزی و پشتیبانی خوب بود."
      },
      {
        "name": "کاربر مهمان",
        "rate": 4,
        "text": "رزرو ساده و سریع انجام شد."
      }
    ]
  },
  {
    "id": 2,
    "title": "Dubai Luxury Break",
    "dest": "دبی",
    "duration": "۴ روز و ۳ شب",
    "airline": "امارات",
"flightTime": "۰۸:۳۰",
    "landingTime": "۱۲:۴۵",
    "origin": "تهران",
    "destination": "دبی",
    "price": 21000000,
    "label": "VIP رویال",
    "type": "international",
    "level": "luxury",
    "categories": [
      "international",
      "luxury"
    ],
    "rating": 4.7,
    "status": "active",
    "lastMinute": false,
    "dealPercent": 0,
    "dealEndsAt": "2099-12-30T20:00:00.000Z",
    "img": "../assets/images/dubai-burj-khalifa.svg",
    "gallery": [
      "../assets/images/dubai-burj-khalifa.svg"
    ],
    "dates": [
      "۱۴۰۵/۰۴/۱۸",
      "۱۴۰۵/۰۴/۲۵",
      "۱۴۰۵/۰۵/۰۵"
    ],
    "hotels": [
      {
        "star": 3,
        "name": "هتل سیتی مکس",
        "price": 13200000,
        "capacity": 10
      },
      {
        "star": 4,
        "name": "هتل شرایتون",
        "price": 16896000,
        "capacity": 6
      },
      {
        "star": 5,
        "name": "هتل جمیرا بیچ",
        "price": 22176000,
        "capacity": 3
      }
    ],
    "desc": "سفر لوکس به دبی با اقامت نزدیک مراکز خرید و برج خلیفه.",
    "includes": [
      "ترانسفر فرودگاهی",
      "بیمه مسافرتی",
      "راهنمای فارسی",
      "صبحانه روزانه"
    ],
    "excludes": [
      "هزینه‌های شخصی",
      "گشت‌های اختیاری",
      "عوارض خروج"
    ],
    "itinerary": [
      "روز اول: پرواز و تحویل اتاق",
      "روز دوم: گشت شهری",
      "روز سوم: وقت آزاد",
      "روز آخر: بازگشت"
    ],
    "docs": [
      "کارت ملی",
      "پاسپورت معتبر برای تور خارجی"
    ],
    "cancellation": "طبق قوانین چارتر و هتل، با هماهنگی کارشناس فروش.",
    "childPolicy": "نرخ کودک طبق سن و نوع تخت محاسبه می‌شود.",
    "reviews": [
      {
        "name": "مسافر سفرو",
        "rate": 5,
        "text": "برنامه‌ریزی و پشتیبانی خوب بود."
      },
      {
        "name": "کاربر مهمان",
        "rate": 4,
        "text": "رزرو ساده و سریع انجام شد."
      }
    ]
  },
  {
    "id": 3,
    "title": "Antalya Summer Resort",
    "dest": "آنتالیا",
    "duration": "۶ روز و ۵ شب",
    "airline": "پگاسوس",
"flightTime": "۰۸:۳۰",
    "landingTime": "۱۲:۴۵",
    "origin": "تهران",
    "destination": "آنتالیا",
    "price": 18000000,
    "label": "تخفیف ویژه",
    "type": "international",
    "level": "special",
    "categories": [
      "international",
      "special"
    ],
    "rating": 4.5,
    "status": "active",
    "lastMinute": true,
    "dealPercent": 12,
    "dealEndsAt": "2099-12-30T20:00:00.000Z",
    "img": "../assets/images/antalya-beach.svg",
    "gallery": [
      "../assets/images/antalya-beach.svg"
    ],
    "dates": [
      "۱۴۰۵/۰۴/۲۰",
      "۱۴۰۵/۰۴/۲۸",
      "۱۴۰۵/۰۵/۰۸"
    ],
    "hotels": [
      {
        "star": 3,
        "name": "هتل ساحل جنوبی",
        "price": 18000000,
        "capacity": 10
      },
      {
        "star": 4,
        "name": "هتل کریستال پارک",
        "price": 23040000,
        "capacity": 6
      },
      {
        "star": 5,
        "name": "هتل رویال ساحل",
        "price": 30240000,
        "capacity": 3
      }
    ],
    "desc": "سفر ساحلی به مدیترانه با هتل‌های متنوع و فضای خانوادگی.",
    "includes": [
      "ترانسفر فرودگاهی",
      "بیمه مسافرتی",
      "راهنمای فارسی",
      "صبحانه روزانه"
    ],
    "excludes": [
      "هزینه‌های شخصی",
      "گشت‌های اختیاری",
      "عوارض خروج"
    ],
    "itinerary": [
      "روز اول: پرواز و تحویل اتاق",
      "روز دوم: گشت شهری",
      "روز سوم: وقت آزاد",
      "روز آخر: بازگشت"
    ],
    "docs": [
      "کارت ملی",
      "پاسپورت معتبر برای تور خارجی"
    ],
    "cancellation": "طبق قوانین چارتر و هتل، با هماهنگی کارشناس فروش.",
    "childPolicy": "نرخ کودک طبق سن و نوع تخت محاسبه می‌شود.",
    "reviews": [
      {
        "name": "مسافر سفرو",
        "rate": 5,
        "text": "برنامه‌ریزی و پشتیبانی خوب بود."
      },
      {
        "name": "کاربر مهمان",
        "rate": 4,
        "text": "رزرو ساده و سریع انجام شد."
      }
    ]
  },
  {
    "id": 4,
    "title": "Kish Island Holiday",
    "dest": "کیش",
    "duration": "۳ روز و ۲ شب",
    "airline": "کیش ایر",
"flightTime": "۰۸:۳۰",
    "landingTime": "۱۲:۴۵",
    "origin": "تهران",
    "destination": "کیش",
    "price": 8500000,
    "label": "ارزان‌ترین",
    "type": "domestic",
    "level": "economy",
    "categories": [
      "domestic",
      "economy"
    ],
    "rating": 4.2,
    "status": "active",
    "lastMinute": true,
    "dealPercent": 8,
    "dealEndsAt": "2099-12-30T20:00:00.000Z",
    "img": "../assets/images/kish-island.svg",
    "gallery": [
      "../assets/images/kish-island.svg"
    ],
    "dates": [
      "۱۴۰۵/۰۵/۰۵",
      "۱۴۰۵/۰۵/۱۲",
      "۱۴۰۵/۰۵/۲۰"
    ],
    "hotels": [
      {
        "star": 3,
        "name": "هتل مرجان کیش",
        "price": 8500000,
        "capacity": 10
      },
      {
        "star": 4,
        "name": "هتل داریوش کیش",
        "price": 10880000,
        "capacity": 6
      },
      {
        "star": 5,
        "name": "هتل رویال کیش",
        "price": 14280000,
        "capacity": 3
      }
    ],
    "desc": "سفر به جزیره کیش با تفریحات آبی، ساحل و مراکز خرید.",
    "includes": [
      "ترانسفر فرودگاهی",
      "بیمه مسافرتی",
      "راهنمای فارسی",
      "صبحانه روزانه"
    ],
    "excludes": [
      "هزینه‌های شخصی",
      "گشت‌های اختیاری",
      "عوارض خروج"
    ],
    "itinerary": [
      "روز اول: پرواز و تحویل اتاق",
      "روز دوم: گشت شهری",
      "روز سوم: وقت آزاد",
      "روز آخر: بازگشت"
    ],
    "docs": [
      "کارت ملی",
      "پاسپورت معتبر برای تور خارجی"
    ],
    "cancellation": "طبق قوانین چارتر و هتل، با هماهنگی کارشناس فروش.",
    "childPolicy": "نرخ کودک طبق سن و نوع تخت محاسبه می‌شود.",
    "reviews": [
      {
        "name": "مسافر سفرو",
        "rate": 5,
        "text": "برنامه‌ریزی و پشتیبانی خوب بود."
      },
      {
        "name": "کاربر مهمان",
        "rate": 4,
        "text": "رزرو ساده و سریع انجام شد."
      }
    ]
  },
  {
    "id": 5,
    "title": "Mashhad Pilgrimage Tour",
    "dest": "مشهد",
    "duration": "۴ روز و ۳ شب",
    "airline": "ایران‌ایر",
"flightTime": "۰۸:۳۰",
    "landingTime": "۱۲:۴۵",
    "origin": "تهران",
    "destination": "مشهد",
    "price": 6500000,
    "label": "اقتصادی",
    "type": "domestic",
    "level": "economy",
    "categories": [
      "domestic",
      "economy"
    ],
    "rating": 4.3,
    "status": "active",
    "lastMinute": false,
    "dealPercent": 0,
    "dealEndsAt": "2099-12-30T20:00:00.000Z",
    "img": "../assets/images/mashhad-shrine.svg",
    "gallery": [
      "../assets/images/mashhad-shrine.svg"
    ],
    "dates": [
      "۱۴۰۵/۰۴/۱۰",
      "۱۴۰۵/۰۴/۲۵",
      "۱۴۰۵/۰۵/۰۵"
    ],
    "hotels": [
      {
        "star": 3,
        "name": "هتل گلدن پالاس",
        "price": 5500000,
        "capacity": 10
      },
      {
        "star": 4,
        "name": "هتل درویشی",
        "price": 7040000,
        "capacity": 6
      },
      {
        "star": 5,
        "name": "هتل هما مشهد",
        "price": 9240000,
        "capacity": 3
      }
    ],
    "desc": "اقامت در مشهد با دسترسی مناسب به حرم و مراکز خرید.",
    "includes": [
      "ترانسفر فرودگاهی",
      "بیمه مسافرتی",
      "راهنمای فارسی",
      "صبحانه روزانه"
    ],
    "excludes": [
      "هزینه‌های شخصی",
      "گشت‌های اختیاری",
      "عوارض خروج"
    ],
    "itinerary": [
      "روز اول: پرواز و تحویل اتاق",
      "روز دوم: گشت شهری",
      "روز سوم: وقت آزاد",
      "روز آخر: بازگشت"
    ],
    "docs": [
      "کارت ملی",
      "پاسپورت معتبر برای تور خارجی"
    ],
    "cancellation": "طبق قوانین چارتر و هتل، با هماهنگی کارشناس فروش.",
    "childPolicy": "نرخ کودک طبق سن و نوع تخت محاسبه می‌شود.",
    "reviews": [
      {
        "name": "مسافر سفرو",
        "rate": 5,
        "text": "برنامه‌ریزی و پشتیبانی خوب بود."
      },
      {
        "name": "کاربر مهمان",
        "rate": 4,
        "text": "رزرو ساده و سریع انجام شد."
      }
    ]
  },
  {
    "id": 6,
    "title": "Cappadocia Balloon Experience",
    "dest": "کاپادوکیا",
    "duration": "۵ روز و ۴ شب",
    "airline": "ترکیش ایرلاین",
"flightTime": "۰۸:۳۰",
    "landingTime": "۱۲:۴۵",
    "origin": "تهران",
    "destination": "کاپادوکیا",
    "price": 22500000,
    "label": "خاص",
    "type": "international",
    "level": "special",
    "categories": [
      "international",
      "special"
    ],
    "rating": 4.9,
    "status": "active",
    "lastMinute": true,
    "dealPercent": 9,
    "dealEndsAt": "2099-12-30T20:00:00.000Z",
    "img": "../assets/images/cappadocia-balloons.svg",
    "gallery": [
      "../assets/images/cappadocia-balloons.svg"
    ],
    "dates": [
      "۱۴۰۵/۰۵/۰۶",
      "۱۴۰۵/۰۵/۱۴",
      "۱۴۰۵/۰۵/۲۲"
    ],
    "hotels": [
      {
        "star": 3,
        "name": "هتل غاری کلاسیک",
        "price": 19000000,
        "capacity": 10
      },
      {
        "star": 4,
        "name": "هتل کاپا ویو",
        "price": 24320000,
        "capacity": 6
      },
      {
        "star": 5,
        "name": "هتل میوزیم کاوه",
        "price": 31920000,
        "capacity": 3
      }
    ],
    "desc": "تور خاص کاپادوکیا با بالن‌های معروف و منظره‌های رویایی.",
    "includes": [
      "ترانسفر فرودگاهی",
      "بیمه مسافرتی",
      "راهنمای فارسی",
      "صبحانه روزانه"
    ],
    "excludes": [
      "هزینه‌های شخصی",
      "گشت‌های اختیاری",
      "عوارض خروج"
    ],
    "itinerary": [
      "روز اول: پرواز و تحویل اتاق",
      "روز دوم: گشت شهری",
      "روز سوم: وقت آزاد",
      "روز آخر: بازگشت"
    ],
    "docs": [
      "کارت ملی",
      "پاسپورت معتبر برای تور خارجی"
    ],
    "cancellation": "طبق قوانین چارتر و هتل، با هماهنگی کارشناس فروش.",
    "childPolicy": "نرخ کودک طبق سن و نوع تخت محاسبه می‌شود.",
    "reviews": [
      {
        "name": "مسافر سفرو",
        "rate": 5,
        "text": "برنامه‌ریزی و پشتیبانی خوب بود."
      },
      {
        "name": "کاربر مهمان",
        "rate": 4,
        "text": "رزرو ساده و سریع انجام شد."
      }
    ]
  },
  {
    "id": 7,
    "title": "Shiraz & Persepolis Journey",
    "dest": "شیراز",
    "duration": "۳ روز و ۲ شب",
    "airline": "زاگرس",
"flightTime": "۰۸:۳۰",
    "landingTime": "۱۲:۴۵",
    "origin": "تهران",
    "destination": "شیراز",
    "price": 7200000,
    "label": "فرهنگی",
    "type": "domestic",
    "level": "economy",
    "categories": [
      "domestic",
      "economy"
    ],
    "rating": 4.6,
    "status": "active",
    "lastMinute": false,
    "dealPercent": 0,
    "dealEndsAt": "2099-12-30T20:00:00.000Z",
    "img": "../assets/images/shiraz-persepolis.svg",
    "gallery": [
      "../assets/images/shiraz-persepolis.svg"
    ],
    "dates": [
      "۱۴۰۵/۰۴/۲۹",
      "۱۴۰۵/۰۵/۰۹",
      "۱۴۰۵/۰۵/۱۹"
    ],
    "hotels": [
      {
        "star": 3,
        "name": "هتل پارس شیراز",
        "price": 6200000,
        "capacity": 10
      },
      {
        "star": 4,
        "name": "هتل چمران",
        "price": 7936000,
        "capacity": 6
      },
      {
        "star": 5,
        "name": "هتل زندیه",
        "price": 10416000,
        "capacity": 3
      }
    ],
    "desc": "تور فرهنگی شیراز با بازدید از حافظیه، سعدیه و تخت جمشید.",
    "includes": [
      "ترانسفر فرودگاهی",
      "بیمه مسافرتی",
      "راهنمای فارسی",
      "صبحانه روزانه"
    ],
    "excludes": [
      "هزینه‌های شخصی",
      "گشت‌های اختیاری",
      "عوارض خروج"
    ],
    "itinerary": [
      "روز اول: پرواز و تحویل اتاق",
      "روز دوم: گشت شهری",
      "روز سوم: وقت آزاد",
      "روز آخر: بازگشت"
    ],
    "docs": [
      "کارت ملی",
      "پاسپورت معتبر برای تور خارجی"
    ],
    "cancellation": "طبق قوانین چارتر و هتل، با هماهنگی کارشناس فروش.",
    "childPolicy": "نرخ کودک طبق سن و نوع تخت محاسبه می‌شود.",
    "reviews": [
      {
        "name": "مسافر سفرو",
        "rate": 5,
        "text": "برنامه‌ریزی و پشتیبانی خوب بود."
      },
      {
        "name": "کاربر مهمان",
        "rate": 4,
        "text": "رزرو ساده و سریع انجام شد."
      }
    ]
  },
  {
    "id": 8,
    "title": "Isfahan Heritage Tour",
    "dest": "اصفهان",
    "duration": "۳ روز و ۲ شب",
    "airline": "قطار ویژه",
"flightTime": "۰۸:۳۰",
    "landingTime": "۱۲:۴۵",
    "origin": "تهران",
    "destination": "اصفهان",
    "price": 6800000,
    "label": "محبوب",
    "type": "domestic",
    "level": "economy",
    "categories": [
      "domestic",
      "economy"
    ],
    "rating": 4.5,
    "status": "active",
    "lastMinute": false,
    "dealPercent": 0,
    "dealEndsAt": "2099-12-30T20:00:00.000Z",
    "img": "../assets/images/isfahan-bridge.svg",
    "gallery": [
      "../assets/images/isfahan-bridge.svg"
    ],
    "dates": [
      "۱۴۰۵/۰۵/۰۳",
      "۱۴۰۵/۰۵/۱۳",
      "۱۴۰۵/۰۵/۲۳"
    ],
    "hotels": [
      {
        "star": 3,
        "name": "هتل سنتی اصفهان",
        "price": 5900000,
        "capacity": 10
      },
      {
        "star": 4,
        "name": "هتل عباسی",
        "price": 7552000,
        "capacity": 6
      },
      {
        "star": 5,
        "name": "هتل کوثر",
        "price": 9912000,
        "capacity": 3
      }
    ],
    "desc": "سفر به اصفهان با بازدید از سی‌وسه‌پل، نقش جهان و بناهای تاریخی.",
    "includes": [
      "ترانسفر فرودگاهی",
      "بیمه مسافرتی",
      "راهنمای فارسی",
      "صبحانه روزانه"
    ],
    "excludes": [
      "هزینه‌های شخصی",
      "گشت‌های اختیاری",
      "عوارض خروج"
    ],
    "itinerary": [
      "روز اول: پرواز و تحویل اتاق",
      "روز دوم: گشت شهری",
      "روز سوم: وقت آزاد",
      "روز آخر: بازگشت"
    ],
    "docs": [
      "کارت ملی",
      "پاسپورت معتبر برای تور خارجی"
    ],
    "cancellation": "طبق قوانین چارتر و هتل، با هماهنگی کارشناس فروش.",
    "childPolicy": "نرخ کودک طبق سن و نوع تخت محاسبه می‌شود.",
    "reviews": [
      {
        "name": "مسافر سفرو",
        "rate": 5,
        "text": "برنامه‌ریزی و پشتیبانی خوب بود."
      },
      {
        "name": "کاربر مهمان",
        "rate": 4,
        "text": "رزرو ساده و سریع انجام شد."
      }
    ]
  },
  {
    "id": 9,
    "title": "Paris Dream Vacation",
    "dest": "پاریس",
    "duration": "۷ روز و ۶ شب",
    "airline": "قطر ایرویز",
"flightTime": "۰۸:۳۰",
    "landingTime": "۱۲:۴۵",
    "origin": "تهران",
    "destination": "پاریس",
    "price": 65500000,
    "label": "لوکس اروپا",
    "type": "international",
    "level": "luxury",
    "categories": [
      "international",
      "luxury"
    ],
    "rating": 4.9,
    "status": "active",
    "lastMinute": false,
    "dealPercent": 0,
    "dealEndsAt": "2099-12-30T20:00:00.000Z",
    "img": "../assets/images/paris-eiffel.svg",
    "gallery": [
      "../assets/images/paris-eiffel.svg"
    ],
    "dates": [
      "۱۴۰۵/۰۶/۰۵",
      "۱۴۰۵/۰۶/۱۵",
      "۱۴۰۵/۰۶/۲۵"
    ],
    "hotels": [
      {
        "star": 3,
        "name": "هتل مونمارتر",
        "price": 54500000,
        "capacity": 10
      },
      {
        "star": 4,
        "name": "هتل سن ژرمن",
        "price": 69760000,
        "capacity": 6
      },
      {
        "star": 5,
        "name": "هتل شانزه‌لیزه",
        "price": 91560000,
        "capacity": 3
      }
    ],
    "desc": "تور لوکس پاریس با بازدید از برج ایفل، لوور و خیابان شانزه‌لیزه.",
    "includes": [
      "ترانسفر فرودگاهی",
      "بیمه مسافرتی",
      "راهنمای فارسی",
      "صبحانه روزانه"
    ],
    "excludes": [
      "هزینه‌های شخصی",
      "گشت‌های اختیاری",
      "عوارض خروج"
    ],
    "itinerary": [
      "روز اول: پرواز و تحویل اتاق",
      "روز دوم: گشت شهری",
      "روز سوم: وقت آزاد",
      "روز آخر: بازگشت"
    ],
    "docs": [
      "کارت ملی",
      "پاسپورت معتبر برای تور خارجی"
    ],
    "cancellation": "طبق قوانین چارتر و هتل، با هماهنگی کارشناس فروش.",
    "childPolicy": "نرخ کودک طبق سن و نوع تخت محاسبه می‌شود.",
    "reviews": [
      {
        "name": "مسافر سفرو",
        "rate": 5,
        "text": "برنامه‌ریزی و پشتیبانی خوب بود."
      },
      {
        "name": "کاربر مهمان",
        "rate": 4,
        "text": "رزرو ساده و سریع انجام شد."
      }
    ]
  },
  {
    "id": 10,
    "title": "Rome Historical Escape",
    "dest": "رم",
    "duration": "۶ روز و ۵ شب",
    "airline": "ترکیش ایرلاین",
"flightTime": "۰۸:۳۰",
    "landingTime": "۱۲:۴۵",
    "origin": "تهران",
    "destination": "رم",
    "price": 58000000,
    "label": "اروپا",
    "type": "international",
    "level": "luxury",
    "categories": [
      "international",
      "luxury"
    ],
    "rating": 4.7,
    "status": "active",
    "lastMinute": false,
    "dealPercent": 0,
    "dealEndsAt": "2099-12-30T20:00:00.000Z",
    "img": "../assets/images/rome-colosseum.svg",
    "gallery": [
      "../assets/images/rome-colosseum.svg"
    ],
    "dates": [
      "۱۴۰۵/۰۶/۰۲",
      "۱۴۰۵/۰۶/۱۲",
      "۱۴۰۵/۰۶/۲۲"
    ],
    "hotels": [
      {
        "star": 3,
        "name": "هتل سنترال رم",
        "price": 48500000,
        "capacity": 10
      },
      {
        "star": 4,
        "name": "هتل واتیکان ویو",
        "price": 62080000,
        "capacity": 6
      },
      {
        "star": 5,
        "name": "هتل کلوسئوم پالاس",
        "price": 81480000,
        "capacity": 3
      }
    ],
    "desc": "تور رم با بازدید از کلوسئوم، واتیکان و میدان‌های تاریخی.",
    "includes": [
      "ترانسفر فرودگاهی",
      "بیمه مسافرتی",
      "راهنمای فارسی",
      "صبحانه روزانه"
    ],
    "excludes": [
      "هزینه‌های شخصی",
      "گشت‌های اختیاری",
      "عوارض خروج"
    ],
    "itinerary": [
      "روز اول: پرواز و تحویل اتاق",
      "روز دوم: گشت شهری",
      "روز سوم: وقت آزاد",
      "روز آخر: بازگشت"
    ],
    "docs": [
      "کارت ملی",
      "پاسپورت معتبر برای تور خارجی"
    ],
    "cancellation": "طبق قوانین چارتر و هتل، با هماهنگی کارشناس فروش.",
    "childPolicy": "نرخ کودک طبق سن و نوع تخت محاسبه می‌شود.",
    "reviews": [
      {
        "name": "مسافر سفرو",
        "rate": 5,
        "text": "برنامه‌ریزی و پشتیبانی خوب بود."
      },
      {
        "name": "کاربر مهمان",
        "rate": 4,
        "text": "رزرو ساده و سریع انجام شد."
      }
    ]
  },
  {
    "id": 11,
    "title": "Bangkok Temple Discovery",
    "dest": "بانکوک",
    "duration": "۶ روز و ۵ شب",
    "airline": "ماهان",
"flightTime": "۰۸:۳۰",
    "landingTime": "۱۲:۴۵",
    "origin": "تهران",
    "destination": "بانکوک",
    "price": 29500000,
    "label": "آسیایی",
    "type": "international",
    "level": "special",
    "categories": [
      "international",
      "special"
    ],
    "rating": 4.4,
    "status": "active",
    "lastMinute": true,
    "dealPercent": 7,
    "dealEndsAt": "2099-12-30T20:00:00.000Z",
    "img": "../assets/images/bangkok-temple.svg",
    "gallery": [
      "../assets/images/bangkok-temple.svg"
    ],
    "dates": [
      "۱۴۰۵/۰۵/۱۱",
      "۱۴۰۵/۰۵/۲۱",
      "۱۴۰۵/۰۶/۰۱"
    ],
    "hotels": [
      {
        "star": 3,
        "name": "هتل سیام",
        "price": 24500000,
        "capacity": 10
      },
      {
        "star": 4,
        "name": "هتل ریورساید",
        "price": 31360000,
        "capacity": 6
      },
      {
        "star": 5,
        "name": "هتل رویال اورکید",
        "price": 41160000,
        "capacity": 3
      }
    ],
    "desc": "سفر به بانکوک با بازدید از معابد معروف، بازارها و رودخانه چائوپرایا.",
    "includes": [
      "ترانسفر فرودگاهی",
      "بیمه مسافرتی",
      "راهنمای فارسی",
      "صبحانه روزانه"
    ],
    "excludes": [
      "هزینه‌های شخصی",
      "گشت‌های اختیاری",
      "عوارض خروج"
    ],
    "itinerary": [
      "روز اول: پرواز و تحویل اتاق",
      "روز دوم: گشت شهری",
      "روز سوم: وقت آزاد",
      "روز آخر: بازگشت"
    ],
    "docs": [
      "کارت ملی",
      "پاسپورت معتبر برای تور خارجی"
    ],
    "cancellation": "طبق قوانین چارتر و هتل، با هماهنگی کارشناس فروش.",
    "childPolicy": "نرخ کودک طبق سن و نوع تخت محاسبه می‌شود.",
    "reviews": [
      {
        "name": "مسافر سفرو",
        "rate": 5,
        "text": "برنامه‌ریزی و پشتیبانی خوب بود."
      },
      {
        "name": "کاربر مهمان",
        "rate": 4,
        "text": "رزرو ساده و سریع انجام شد."
      }
    ]
  },
  {
    "id": 12,
    "title": "Yerevan City Break",
    "dest": "ایروان",
    "duration": "۴ روز و ۳ شب",
    "airline": "آرمنیا ایر",
"flightTime": "۰۸:۳۰",
    "landingTime": "۱۲:۴۵",
    "origin": "تهران",
    "destination": "ایروان",
    "price": 12500000,
    "label": "نزدیک و اقتصادی",
    "type": "international",
    "level": "economy",
    "categories": [
      "international",
      "economy"
    ],
    "rating": 4.1,
    "status": "active",
    "lastMinute": true,
    "dealPercent": 6,
    "dealEndsAt": "2099-12-30T20:00:00.000Z",
    "img": "../assets/images/yerevan-cascade.svg",
    "gallery": [
      "../assets/images/yerevan-cascade.svg"
    ],
    "dates": [
      "۱۴۰۵/۰۴/۳۰",
      "۱۴۰۵/۰۵/۱۰",
      "۱۴۰۵/۰۵/۲۰"
    ],
    "hotels": [
      {
        "star": 3,
        "name": "هتل کاسکاد",
        "price": 9900000,
        "capacity": 10
      },
      {
        "star": 4,
        "name": "هتل ریپابلیک",
        "price": 12672000,
        "capacity": 6
      },
      {
        "star": 5,
        "name": "هتل ماریوت ایروان",
        "price": 16632000,
        "capacity": 3
      }
    ],
    "desc": "تور اقتصادی ایروان با بازدید از کاسکاد، میدان جمهوری و دریاچه سوان.",
    "includes": [
      "ترانسفر فرودگاهی",
      "بیمه مسافرتی",
      "راهنمای فارسی",
      "صبحانه روزانه"
    ],
    "excludes": [
      "هزینه‌های شخصی",
      "گشت‌های اختیاری",
      "عوارض خروج"
    ],
    "itinerary": [
      "روز اول: پرواز و تحویل اتاق",
      "روز دوم: گشت شهری",
      "روز سوم: وقت آزاد",
      "روز آخر: بازگشت"
    ],
    "docs": [
      "کارت ملی",
      "پاسپورت معتبر برای تور خارجی"
    ],
    "cancellation": "طبق قوانین چارتر و هتل، با هماهنگی کارشناس فروش.",
    "childPolicy": "نرخ کودک طبق سن و نوع تخت محاسبه می‌شود.",
    "reviews": [
      {
        "name": "مسافر سفرو",
        "rate": 5,
        "text": "برنامه‌ریزی و پشتیبانی خوب بود."
      },
      {
        "name": "کاربر مهمان",
        "rate": 4,
        "text": "رزرو ساده و سریع انجام شد."
      }
    ]
  },
  {
    "id": 13,
    "title": "Georgia Nature Tour",
    "dest": "تفلیس",
    "duration": "۵ روز و ۴ شب",
    "airline": "قشم ایر",
"flightTime": "۰۸:۳۰",
    "landingTime": "۱۲:۴۵",
    "origin": "تهران",
    "destination": "تفلیس",
    "price": 14800000,
    "label": "طبیعت‌گردی",
    "type": "international",
    "level": "economy",
    "categories": [
      "international",
      "economy"
    ],
    "rating": 4.3,
    "status": "active",
    "lastMinute": false,
    "dealPercent": 0,
    "dealEndsAt": "2099-12-30T20:00:00.000Z",
    "img": "../assets/images/georgia-caucasus.svg",
    "gallery": [
      "../assets/images/georgia-caucasus.svg"
    ],
    "dates": [
      "۱۴۰۵/۰۵/۰۷",
      "۱۴۰۵/۰۵/۱۷",
      "۱۴۰۵/۰۵/۲۷"
    ],
    "hotels": [
      {
        "star": 3,
        "name": "هتل تفلیس سنتر",
        "price": 11800000,
        "capacity": 10
      },
      {
        "star": 4,
        "name": "هتل روستاولی",
        "price": 15104000,
        "capacity": 6
      },
      {
        "star": 5,
        "name": "هتل بیلتمور تفلیس",
        "price": 19824000,
        "capacity": 3
      }
    ],
    "desc": "تور تفلیس و طبیعت قفقاز با گشت شهری و مناظر کوهستانی.",
    "includes": [
      "ترانسفر فرودگاهی",
      "بیمه مسافرتی",
      "راهنمای فارسی",
      "صبحانه روزانه"
    ],
    "excludes": [
      "هزینه‌های شخصی",
      "گشت‌های اختیاری",
      "عوارض خروج"
    ],
    "itinerary": [
      "روز اول: پرواز و تحویل اتاق",
      "روز دوم: گشت شهری",
      "روز سوم: وقت آزاد",
      "روز آخر: بازگشت"
    ],
    "docs": [
      "کارت ملی",
      "پاسپورت معتبر برای تور خارجی"
    ],
    "cancellation": "طبق قوانین چارتر و هتل، با هماهنگی کارشناس فروش.",
    "childPolicy": "نرخ کودک طبق سن و نوع تخت محاسبه می‌شود.",
    "reviews": [
      {
        "name": "مسافر سفرو",
        "rate": 5,
        "text": "برنامه‌ریزی و پشتیبانی خوب بود."
      },
      {
        "name": "کاربر مهمان",
        "rate": 4,
        "text": "رزرو ساده و سریع انجام شد."
      }
    ]
  },
  {
    "id": 14,
    "title": "Kuala Lumpur Modern Trip",
    "dest": "کوالالامپور",
    "duration": "۷ روز و ۶ شب",
    "airline": "قطر ایرویز",
"flightTime": "۰۸:۳۰",
    "landingTime": "۱۲:۴۵",
    "origin": "تهران",
    "destination": "کوالالامپور",
    "price": 36500000,
    "label": "خانوادگی",
    "type": "international",
    "level": "special",
    "categories": [
      "international",
      "special"
    ],
    "rating": 4.6,
    "status": "active",
    "lastMinute": false,
    "dealPercent": 0,
    "dealEndsAt": "2099-12-30T20:00:00.000Z",
    "img": "../assets/images/malaysia-towers.svg",
    "gallery": [
      "../assets/images/malaysia-towers.svg"
    ],
    "dates": [
      "۱۴۰۵/۰۶/۰۳",
      "۱۴۰۵/۰۶/۱۳",
      "۱۴۰۵/۰۶/۲۳"
    ],
    "hotels": [
      {
        "star": 3,
        "name": "هتل بوکیت بینتانگ",
        "price": 29800000,
        "capacity": 10
      },
      {
        "star": 4,
        "name": "هتل تریدرز",
        "price": 38144000,
        "capacity": 6
      },
      {
        "star": 5,
        "name": "هتل ماندارین اورینتال",
        "price": 50064000,
        "capacity": 3
      }
    ],
    "desc": "تور مالزی با بازدید از برج‌های دوقلو، مراکز خرید و فضاهای خانوادگی.",
    "includes": [
      "ترانسفر فرودگاهی",
      "بیمه مسافرتی",
      "راهنمای فارسی",
      "صبحانه روزانه"
    ],
    "excludes": [
      "هزینه‌های شخصی",
      "گشت‌های اختیاری",
      "عوارض خروج"
    ],
    "itinerary": [
      "روز اول: پرواز و تحویل اتاق",
      "روز دوم: گشت شهری",
      "روز سوم: وقت آزاد",
      "روز آخر: بازگشت"
    ],
    "docs": [
      "کارت ملی",
      "پاسپورت معتبر برای تور خارجی"
    ],
    "cancellation": "طبق قوانین چارتر و هتل، با هماهنگی کارشناس فروش.",
    "childPolicy": "نرخ کودک طبق سن و نوع تخت محاسبه می‌شود.",
    "reviews": [
      {
        "name": "مسافر سفرو",
        "rate": 5,
        "text": "برنامه‌ریزی و پشتیبانی خوب بود."
      },
      {
        "name": "کاربر مهمان",
        "rate": 4,
        "text": "رزرو ساده و سریع انجام شد."
      }
    ]
  }
];

const DEFAULT_DISCOUNTS = [
  {
    "code": "SAFAR10",
    "type": "percent",
    "value": 10,
    "min": 0,
    "tourId": "all",
    "active": true,
    "used": 0,
    "limit": 100,
    "expires": ""
  },
  {
    "code": "VIP15",
    "type": "percent",
    "value": 15,
    "min": 20000000,
    "tourId": "all",
    "active": true,
    "used": 0,
    "limit": 50,
    "expires": ""
  },
  {
    "code": "LAST5",
    "type": "fixed",
    "value": 500000,
    "min": 5000000,
    "tourId": "lastminute",
    "active": true,
    "used": 0,
    "limit": 80,
    "expires": ""
  }
];


const LATIN_TOUR_TITLES = {
  "1": "Istanbul Spring Escape",
  "2": "Dubai Luxury Break",
  "3": "Antalya Summer Resort",
  "4": "Kish Island Holiday",
  "5": "Mashhad Pilgrimage Tour",
  "6": "Cappadocia Balloon Experience",
  "7": "Shiraz & Persepolis Journey",
  "8": "Isfahan Heritage Tour",
  "9": "Paris Dream Vacation",
  "10": "Rome Historical Escape",
  "11": "Bangkok Temple Discovery",
  "12": "Yerevan City Break",
  "13": "Georgia Nature Tour",
  "14": "Kuala Lumpur Modern Trip"
};
