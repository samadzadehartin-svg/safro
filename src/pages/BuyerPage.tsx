import { useState, useEffect } from 'react'
import { getTours, getVisas, addLead, formatPrice } from '../lib/store'
import type { Tour, VisaService } from '../lib/types'

const NAVY = '#202D59'
const GOLD = '#FBB71C'

function PlaneIcon({ size = 16 }: { size?: number }) {
  return <svg width={size} height={size} fill="currentColor" viewBox="0 0 24 24"><path d="M21 16v-2l-8-5V3.5A1.5 1.5 0 0011.5 2 1.5 1.5 0 0010 3.5V9l-8 5v2l8-2.5V19l-2 1.5V22l3.5-1 3.5 1v-1.5L13 19v-5.5l8 2.5z" /></svg>
}
function ClockIcon({ size = 15 }: { size?: number }) {
  return <svg width={size} height={size} fill="currentColor" viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm.5-13H11v6l5.25 3.15.75-1.23-4.5-2.67V7z" /></svg>
}
function CloseIcon() {
  return <svg width="22" height="22" fill="currentColor" viewBox="0 0 24 24"><path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z" /></svg>
}
function PhoneIcon() {
  return <svg width="17" height="17" fill="currentColor" viewBox="0 0 24 24"><path d="M6.62 10.79a15.05 15.05 0 006.59 6.59l2.2-2.2a1 1 0 011.01-.24c1.12.37 2.33.57 3.58.57a1 1 0 011 1V20a1 1 0 01-1 1A17 17 0 013 4a1 1 0 011-1h3.5a1 1 0 011 1c0 1.25.2 2.45.57 3.57a1 1 0 01-.24 1.01l-2.21 2.21z" /></svg>
}

const destinations = [
  { name: 'ترکیه', photo: '1524231757912-21f4fe3a7200' },
  { name: 'امارات', photo: '1512453979798-5ea266f8880c' },
  { name: 'گرجستان', photo: '1565008887036-f2da55e3e2a8' },
  { name: 'تایلند', photo: '1506905925346-21bda4d32df4' },
  { name: 'مالدیو', photo: '1573843981267-be1999ff37cd' },
  { name: 'اروپا', photo: '1499856871958-5b9627545d1a' },
]

const navLinks = ['خانه', 'تورها', 'مقاصد', 'ویزا', 'درباره ما', 'تماس']

export default function BuyerPage() {
  const [tours, setTours] = useState<Tour[]>([])
  const [visas, setVisas] = useState<VisaService[]>([])
  const [showCustomPopup, setShowCustomPopup] = useState(false)
  const [selectedTour, setSelectedTour] = useState<Tour | null>(null)
  const [searchDest, setSearchDest] = useState('')
  const [filterDest, setFilterDest] = useState('همه')
  const [formName, setFormName] = useState('')
  const [formPhone, setFormPhone] = useState('')
  const [formDest, setFormDest] = useState('')
  const [formBudget, setFormBudget] = useState('')
  const [submitted, setSubmitted] = useState(false)

  useEffect(() => {
    setTours(getTours().filter(t => t.visible))
    setVisas(getVisas().filter(v => v.visible))
  }, [])

  const specialTours = tours.filter(t => t.specialOffer).slice(0, 4)
  const filterOptions = ['همه', ...Array.from(new Set(tours.map(t => t.destination)))]
  const filteredTours = filterDest === 'همه' ? tours : tours.filter(t => t.destination === filterDest)
  const destTourCount = (name: string) => tours.filter(t => t.destination === name).length

  const handleCustomSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    addLead({ name: formName, phone: formPhone, destination: formDest, budget: formBudget })
    setSubmitted(true)
    setTimeout(() => {
      setSubmitted(false)
      setShowCustomPopup(false)
      setFormName(''); setFormPhone(''); setFormDest(''); setFormBudget('')
    }, 2500)
  }

  const btn = (bg: string, fg: string, extra = {}) => ({
    background: bg, color: fg, border: 'none', borderRadius: 10,
    fontFamily: "'Vazirmatn', sans-serif", fontWeight: 700, cursor: 'pointer',
    transition: 'transform 0.15s, box-shadow 0.15s', ...extra,
  })

  return (
    <div dir="rtl" style={{ fontFamily: "'Vazirmatn', sans-serif", background: '#fff', color: NAVY }}>

      {/* ── NAVBAR ── */}
      <nav style={{ background: NAVY, position: 'sticky', top: 0, zIndex: 50, boxShadow: '0 2px 20px rgba(32,45,89,0.25)' }}>
        <div style={{ maxWidth: 1280, margin: '0 auto', padding: '0 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: 68 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{ width: 36, height: 36, borderRadius: '50%', background: GOLD, display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: 16, color: NAVY }}>س</div>
            <span style={{ color: '#fff', fontWeight: 800, fontSize: 21 }}>سفرو</span>
            <span style={{ color: GOLD, fontWeight: 400, fontSize: 12, opacity: 0.8 }}>آژانس مسافرتی</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 28 }}>
            {navLinks.map(link => (
              <a key={link} href="#" style={{ color: 'rgba(255,255,255,0.78)', fontSize: 14, fontWeight: 500, textDecoration: 'none' }}
                onMouseEnter={e => (e.currentTarget.style.color = GOLD)}
                onMouseLeave={e => (e.currentTarget.style.color = 'rgba(255,255,255,0.78)')}>
                {link}
              </a>
            ))}
          </div>
          <a href="tel:02149976" style={{ display: 'flex', alignItems: 'center', gap: 7, color: GOLD, fontSize: 14, fontWeight: 700, textDecoration: 'none', background: 'rgba(251,183,28,0.1)', padding: '7px 16px', borderRadius: 8, border: '1px solid rgba(251,183,28,0.25)' }}>
            <PhoneIcon />۰۲۱-۴۹۹۷۶
          </a>
        </div>
      </nav>

      {/* ── HERO ── */}
      <section style={{ position: 'relative', height: '90vh', minHeight: 560, overflow: 'hidden' }}>
        <img src="https://images.unsplash.com/photo-1436491865332-7a61a109cc05?w=1920&h=1080&fit=crop&auto=format" alt="سفر" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' }} />
        <div style={{ position: 'absolute', inset: 0, background: `linear-gradient(135deg, rgba(32,45,89,0.9) 0%, rgba(32,45,89,0.55) 60%, rgba(0,0,0,0.15) 100%)` }} />
        <div style={{ position: 'relative', zIndex: 1, height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', textAlign: 'center', padding: '0 24px' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', background: 'rgba(251,183,28,0.15)', border: '1px solid rgba(251,183,28,0.35)', borderRadius: 100, padding: '5px 18px', marginBottom: 22 }}>
            <span style={{ color: GOLD, fontSize: 13, fontWeight: 600 }}>✈ بیش از ۱۰ سال تجربه سفرسازی</span>
          </div>
          <h1 style={{ color: '#fff', fontSize: 'clamp(1.9rem, 5vw, 3.4rem)', fontWeight: 800, lineHeight: 1.3, marginBottom: 14, maxWidth: 680 }}>
            سفر رویاهایت را<br /><span style={{ color: GOLD }}>با سفرو</span> بساز
          </h1>
          <p style={{ color: 'rgba(255,255,255,0.75)', fontSize: 16, marginBottom: 40, maxWidth: 480, lineHeight: 1.75 }}>
            بهترین تورها با مناسب‌ترین قیمت‌ها، خدمات ویزا و مشاوره رایگان سفر
          </p>
          {/* Search */}
          <div style={{ background: '#fff', borderRadius: 14, padding: '22px 28px', width: '100%', maxWidth: 820, boxShadow: '0 20px 55px rgba(0,0,0,0.22)', display: 'grid', gridTemplateColumns: '1fr 1fr auto', gap: 14, alignItems: 'end' }}>
            <div>
              <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: NAVY, marginBottom: 6, opacity: 0.65 }}>📍 مقصد</label>
              <select value={searchDest} onChange={e => setSearchDest(e.target.value)} style={{ width: '100%', border: '1.5px solid #e5e8f0', borderRadius: 9, padding: '11px 13px', fontSize: 14, fontFamily: "'Vazirmatn', sans-serif", color: searchDest ? NAVY : '#aaa', outline: 'none', background: '#f9fafc' }}>
                <option value="">انتخاب مقصد...</option>
                {destinations.map(d => <option key={d.name}>{d.name}</option>)}
              </select>
            </div>
            <div>
              <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: NAVY, marginBottom: 6, opacity: 0.65 }}>📅 تاریخ سفر</label>
              <select style={{ width: '100%', border: '1.5px solid #e5e8f0', borderRadius: 9, padding: '11px 13px', fontSize: 14, fontFamily: "'Vazirmatn', sans-serif", outline: 'none', background: '#f9fafc', color: '#aaa' }}>
                <option>تاریخ عزیمت</option>
                <option>مرداد ۱۴۰۴</option><option>شهریور ۱۴۰۴</option><option>مهر ۱۴۰۴</option><option>آبان ۱۴۰۴</option>
              </select>
            </div>
            <button onClick={() => { if (searchDest) setFilterDest(searchDest); document.getElementById('tours-section')?.scrollIntoView({ behavior: 'smooth' }) }}
              style={{ ...btn(GOLD, NAVY, { padding: '12px 26px', fontSize: 14, boxShadow: '0 4px 16px rgba(251,183,28,0.4)' }) }}>
              🔍 جستجو
            </button>
          </div>
          <div style={{ display: 'flex', gap: 44, marginTop: 36 }}>
            {[['۱۲,۰۰۰+', 'مسافر راضی'], ['۸۵+', 'مقصد جهانی'], ['۱۰', 'سال تجربه']].map(([n, l]) => (
              <div key={l} style={{ textAlign: 'center' }}>
                <div style={{ color: GOLD, fontSize: 24, fontWeight: 800 }}>{n}</div>
                <div style={{ color: 'rgba(255,255,255,0.65)', fontSize: 12 }}>{l}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── DESTINATIONS ── */}
      <section style={{ padding: '72px 24px', background: '#fff' }}>
        <div style={{ maxWidth: 1280, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: 48 }}>
            <span style={{ background: '#FEF3D0', color: '#A07800', fontSize: 12, fontWeight: 700, padding: '5px 15px', borderRadius: 100 }}>مقاصد محبوب</span>
            <h2 style={{ fontSize: 'clamp(1.5rem, 3vw, 2.2rem)', fontWeight: 800, color: NAVY, marginTop: 12, marginBottom: 8 }}>کجا سفر می‌کنید؟</h2>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(190px, 1fr))', gap: 18 }}>
            {destinations.map(dest => (
              <div key={dest.name} onClick={() => { setFilterDest(dest.name); document.getElementById('tours-section')?.scrollIntoView({ behavior: 'smooth' }) }}
                style={{ borderRadius: 14, overflow: 'hidden', position: 'relative', cursor: 'pointer', aspectRatio: '4/5', background: '#e5e8f0', transition: 'transform 0.25s' }}
                onMouseEnter={e => (e.currentTarget.style.transform = 'scale(1.02)')}
                onMouseLeave={e => (e.currentTarget.style.transform = '')}>
                <img src={`https://images.unsplash.com/photo-${dest.photo}?w=400&h=500&fit=crop&auto=format`} alt={dest.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(32,45,89,0.8) 0%, transparent 60%)' }} />
                <div style={{ position: 'absolute', bottom: 0, padding: '16px 14px' }}>
                  <div style={{ color: '#fff', fontWeight: 700, fontSize: 18 }}>{dest.name}</div>
                  <div style={{ color: GOLD, fontSize: 12, marginTop: 3 }}>{destTourCount(dest.name)} تور موجود</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── SPECIAL TOURS ── */}
      {specialTours.length > 0 && (
        <section style={{ padding: '72px 24px', background: '#F8F9FC' }}>
          <div style={{ maxWidth: 1280, margin: '0 auto' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: 44, flexWrap: 'wrap', gap: 14 }}>
              <div>
                <span style={{ background: 'rgba(32,45,89,0.07)', color: NAVY, fontSize: 12, fontWeight: 700, padding: '5px 14px', borderRadius: 100 }}>🌟 تورهای ویژه</span>
                <h2 style={{ fontSize: 'clamp(1.5rem, 3vw, 2.1rem)', fontWeight: 800, color: NAVY, marginTop: 12, marginBottom: 6 }}>پیشنهادهای استثنایی</h2>
              </div>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(275px, 1fr))', gap: 22 }}>
              {specialTours.map(tour => <TourCard key={tour.id} tour={tour} onDetail={() => setSelectedTour(tour)} />)}
            </div>
          </div>
        </section>
      )}

      {/* ── CUSTOM TOUR BANNER ── */}
      <section style={{ padding: '68px 24px', background: NAVY, position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', top: -60, left: -60, width: 280, height: 280, borderRadius: '50%', background: 'rgba(251,183,28,0.06)' }} />
        <div style={{ maxWidth: 1280, margin: '0 auto', display: 'grid', gridTemplateColumns: '1fr auto', gap: 28, alignItems: 'center', position: 'relative', zIndex: 1 }}>
          <div>
            <div style={{ display: 'inline-block', background: 'rgba(251,183,28,0.12)', border: '1px solid rgba(251,183,28,0.2)', borderRadius: 100, padding: '5px 15px', marginBottom: 18 }}>
              <span style={{ color: GOLD, fontSize: 12, fontWeight: 700 }}>✨ سفر سفارشی</span>
            </div>
            <h2 style={{ color: '#fff', fontSize: 'clamp(1.4rem, 2.8vw, 2.1rem)', fontWeight: 800, marginBottom: 12, lineHeight: 1.4 }}>تور ایده‌آل خودت را طراحی کن</h2>
            <p style={{ color: 'rgba(255,255,255,0.65)', fontSize: 14, lineHeight: 1.8, maxWidth: 480 }}>
              اگر تور آماده مناسبی نیافتید، با کارشناسان ما تور اختصاصی خود را بسازید.
            </p>
          </div>
          <div style={{ textAlign: 'center', flexShrink: 0 }}>
            <button onClick={() => setShowCustomPopup(true)}
              style={{ ...btn(GOLD, NAVY, { padding: '16px 36px', fontSize: 16, boxShadow: '0 8px 28px rgba(251,183,28,0.45)', display: 'block', marginBottom: 10 }) }}>
              🗺 درخواست تور اختصاصی
            </button>
            <span style={{ color: 'rgba(255,255,255,0.4)', fontSize: 11 }}>مشاوره رایگان · پاسخ در کمتر از ۲۴ ساعت</span>
          </div>
        </div>
      </section>

      {/* ── VISA ── */}
      <section style={{ padding: '72px 24px', background: '#fff' }}>
        <div style={{ maxWidth: 1280, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: 48 }}>
            <span style={{ background: '#FEF3D0', color: '#A07800', fontSize: 12, fontWeight: 700, padding: '5px 15px', borderRadius: 100 }}>خدمات ویزا</span>
            <h2 style={{ fontSize: 'clamp(1.5rem, 3vw, 2.2rem)', fontWeight: 800, color: NAVY, marginTop: 12, marginBottom: 8 }}>ویزا بدون دردسر</h2>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: 18 }}>
            {visas.map(visa => (
              <div key={visa.id} style={{ border: '1.5px solid #ECEEF5', borderRadius: 13, padding: '22px 20px', cursor: 'pointer', transition: 'border-color 0.25s, box-shadow 0.25s, transform 0.25s' }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = GOLD; e.currentTarget.style.boxShadow = '0 8px 28px rgba(251,183,28,0.14)'; e.currentTarget.style.transform = 'translateY(-2px)' }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = '#ECEEF5'; e.currentTarget.style.boxShadow = ''; e.currentTarget.style.transform = '' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 13, marginBottom: 16 }}>
                  <span style={{ fontSize: 32 }}>{visa.flag}</span>
                  <div>
                    <div style={{ fontWeight: 700, fontSize: 15, color: NAVY }}>{visa.country}</div>
                    <div style={{ fontSize: 11, color: '#9CA3AF', marginTop: 2 }}>زمان پردازش: {visa.processingTime}</div>
                  </div>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid #F0F2F7', paddingTop: 14 }}>
                  <span style={{ fontSize: 13, fontWeight: 700, color: visa.price === 'رایگان' ? '#16A34A' : NAVY }}>{visa.price}</span>
                  <button onClick={() => setShowCustomPopup(true)} style={{ ...btn('transparent', NAVY, { border: `1.5px solid ${NAVY}`, padding: '5px 14px', fontSize: 12 }) }}
                    onMouseEnter={e => { e.currentTarget.style.background = NAVY; e.currentTarget.style.color = '#fff' }}
                    onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = NAVY }}>
                    مشاوره رایگان
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── ALL TOURS ── */}
      <section id="tours-section" style={{ padding: '72px 24px', background: '#F8F9FC' }}>
        <div style={{ maxWidth: 1280, margin: '0 auto' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 44, flexWrap: 'wrap', gap: 14 }}>
            <h2 style={{ fontSize: 'clamp(1.5rem, 3vw, 2.1rem)', fontWeight: 800, color: NAVY }}>همه تورها</h2>
            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
              {filterOptions.map(opt => (
                <button key={opt} onClick={() => setFilterDest(opt)}
                  style={{ padding: '7px 16px', borderRadius: 100, fontSize: 13, fontWeight: 600, cursor: 'pointer', fontFamily: "'Vazirmatn', sans-serif", border: '1.5px solid', transition: 'all 0.2s', borderColor: filterDest === opt ? NAVY : '#D1D5DB', background: filterDest === opt ? NAVY : 'transparent', color: filterDest === opt ? '#fff' : '#6B7280' }}>
                  {opt}
                </button>
              ))}
            </div>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(290px, 1fr))', gap: 22 }}>
            {filteredTours.map(tour => <TourCard key={tour.id} tour={tour} onDetail={() => setSelectedTour(tour)} />)}
          </div>
        </div>
      </section>

      {/* ── WHY US ── */}
      <section style={{ padding: '72px 24px', background: '#fff' }}>
        <div style={{ maxWidth: 1280, margin: '0 auto' }}>
          <h2 style={{ textAlign: 'center', fontSize: 'clamp(1.5rem, 3vw, 2rem)', fontWeight: 800, color: NAVY, marginBottom: 44 }}>چرا سفرو؟</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(210px, 1fr))', gap: 24 }}>
            {[['🛡️', 'ضمانت قیمت', 'بهترین قیمت تضمین‌شده یا بازگشت تفاوت'], ['🎧', 'پشتیبانی ۲۴/۷', 'همیشه در کنار شما — حتی در سفر'], ['✈️', 'پرواز مطمئن', 'همکاری با معتبرترین ایرلاین‌ها'], ['🏆', 'آژانس برتر', 'دارنده جایزه بهترین آژانس سفر ایران']].map(([icon, title, desc]) => (
              <div key={title} style={{ textAlign: 'center', padding: '28px 22px', borderRadius: 14, border: '1.5px solid #ECEEF5', transition: 'border-color 0.25s, box-shadow 0.25s' }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = GOLD; e.currentTarget.style.boxShadow = '0 6px 24px rgba(251,183,28,0.1)' }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = '#ECEEF5'; e.currentTarget.style.boxShadow = '' }}>
                <div style={{ fontSize: 42, marginBottom: 14 }}>{icon}</div>
                <div style={{ fontWeight: 700, fontSize: 16, color: NAVY, marginBottom: 7 }}>{title}</div>
                <div style={{ color: '#6B7280', fontSize: 13, lineHeight: 1.65 }}>{desc}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── ABOUT & CONTACT ── */}
      <section style={{ padding: '60px 24px', background: '#F8F9FC' }}>
        <div style={{ maxWidth: 1280, margin: '0 auto', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 48 }}>
          <div>
            <h3 style={{ fontSize: 20, fontWeight: 800, color: NAVY, marginBottom: 14 }}>درباره سفرو ایرانیان</h3>
            <p style={{ color: '#6B7280', lineHeight: 1.85, fontSize: 14 }}>
              آژانس مسافرتی سفرو با بیش از ۱۰ سال تجربه در زمینه برگزاری تورهای داخلی و خارجی، یکی از معتبرترین آژانس‌های سفر در ایران است. ما با هدف ارائه بهترین خدمات سفر با مناسب‌ترین قیمت، در کنار شما هستیم.
            </p>
          </div>
          <div>
            <h3 style={{ fontSize: 20, fontWeight: 800, color: NAVY, marginBottom: 14 }}>ارتباط با ما</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {[['📞', '۰۲۱-۴۹۹۷۶'], ['📧', 'info@safaroiranian.com'], ['📍', 'تهران، بلوار فردوس شرق، بعد از عقیل، پلاک ۳۵۱، طبقه ۱']].map(([icon, text]) => (
                <div key={text} style={{ display: 'flex', alignItems: 'flex-start', gap: 10, color: '#374151', fontSize: 14 }}>
                  <span>{icon}</span><span>{text}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer style={{ background: NAVY, padding: '48px 24px 28px' }}>
        <div style={{ maxWidth: 1280, margin: '0 auto' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 12, borderTop: '1px solid rgba(255,255,255,0.1)', paddingTop: 24 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <div style={{ width: 32, height: 32, borderRadius: '50%', background: GOLD, display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: 14, color: NAVY }}>س</div>
              <span style={{ color: '#fff', fontWeight: 800, fontSize: 17 }}>سفرو</span>
            </div>
            <span style={{ color: 'rgba(255,255,255,0.4)', fontSize: 12 }}>© ۱۴۰۴ سفرو — تمام حقوق محفوظ است | مجوز رسمی وزارت گردشگری</span>
          </div>
        </div>
      </footer>

      {/* ── FLOATING BUTTON ── */}
      <button onClick={() => setShowCustomPopup(true)}
        style={{ position: 'fixed', bottom: 24, left: 24, background: GOLD, color: NAVY, border: 'none', borderRadius: 50, padding: '13px 20px', fontSize: 13, fontWeight: 700, cursor: 'pointer', fontFamily: "'Vazirmatn', sans-serif", boxShadow: '0 6px 24px rgba(251,183,28,0.55)', zIndex: 40, display: 'flex', alignItems: 'center', gap: 7, transition: 'transform 0.2s' }}
        onMouseEnter={e => (e.currentTarget.style.transform = 'scale(1.05)')}
        onMouseLeave={e => (e.currentTarget.style.transform = '')}>
        🗺 تور اختصاصی
      </button>

      {/* ── CUSTOM TOUR POPUP ── */}
      {showCustomPopup && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(15,20,40,0.72)', zIndex: 100, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24, backdropFilter: 'blur(4px)' }}
          onClick={e => { if (e.target === e.currentTarget) setShowCustomPopup(false) }}>
          <div style={{ background: '#fff', borderRadius: 18, width: '100%', maxWidth: 500, boxShadow: '0 24px 72px rgba(0,0,0,0.25)', overflow: 'hidden', animation: 'slideUp 0.3s ease' }}>
            <div style={{ background: NAVY, padding: '22px 26px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <div style={{ color: GOLD, fontSize: 12, fontWeight: 600, marginBottom: 3 }}>✨ سفر سفارشی</div>
                <h3 style={{ color: '#fff', fontSize: 18, fontWeight: 800, margin: 0 }}>درخواست تور اختصاصی</h3>
              </div>
              <button onClick={() => setShowCustomPopup(false)} style={{ background: 'rgba(255,255,255,0.1)', border: 'none', color: '#fff', borderRadius: '50%', width: 34, height: 34, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
                <CloseIcon />
              </button>
            </div>
            <div style={{ padding: '26px' }}>
              {submitted ? (
                <div style={{ textAlign: 'center', padding: '28px 0' }}>
                  <div style={{ fontSize: 54, marginBottom: 14 }}>✅</div>
                  <h4 style={{ color: NAVY, fontSize: 18, fontWeight: 800, marginBottom: 7 }}>درخواست شما ثبت شد!</h4>
                  <p style={{ color: '#6B7280', fontSize: 14 }}>کارشناسان ما در کمتر از ۲۴ ساعت با شما تماس می‌گیرند.</p>
                </div>
              ) : (
                <form onSubmit={handleCustomSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                    {[['نام و نام خانوادگی', formName, setFormName, 'علی محمدی', 'text', true],
                      ['شماره تماس *', formPhone, setFormPhone, '۰۹۱۲...', 'tel', true]].map(([label, val, setter, placeholder, type, required]) => (
                      <div key={label as string}>
                        <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: NAVY, marginBottom: 5, opacity: 0.7 }}>{label as string}</label>
                        <input type={type as string} value={val as string} onChange={e => (setter as (v: string) => void)(e.target.value)}
                          placeholder={placeholder as string} required={required as boolean}
                          style={{ width: '100%', border: '1.5px solid #E5E7EB', borderRadius: 9, padding: '10px 13px', fontSize: 14, fontFamily: "'Vazirmatn', sans-serif", color: NAVY, outline: 'none' }}
                          onFocus={e => (e.currentTarget.style.borderColor = GOLD)}
                          onBlur={e => (e.currentTarget.style.borderColor = '#E5E7EB')} />
                      </div>
                    ))}
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: NAVY, marginBottom: 5, opacity: 0.7 }}>مقصد مورد نظر</label>
                    <input type="text" value={formDest} onChange={e => setFormDest(e.target.value)} placeholder="مثلاً: ترکیه، اروپا..."
                      style={{ width: '100%', border: '1.5px solid #E5E7EB', borderRadius: 9, padding: '10px 13px', fontSize: 14, fontFamily: "'Vazirmatn', sans-serif", color: NAVY, outline: 'none' }}
                      onFocus={e => (e.currentTarget.style.borderColor = GOLD)}
                      onBlur={e => (e.currentTarget.style.borderColor = '#E5E7EB')} />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: NAVY, marginBottom: 5, opacity: 0.7 }}>بودجه تقریبی</label>
                    <select value={formBudget} onChange={e => setFormBudget(e.target.value)}
                      style={{ width: '100%', border: '1.5px solid #E5E7EB', borderRadius: 9, padding: '10px 13px', fontSize: 14, fontFamily: "'Vazirmatn', sans-serif", color: formBudget ? NAVY : '#9CA3AF', outline: 'none', background: '#fff' }}>
                      <option value="">انتخاب کنید...</option>
                      <option>تا ۵ میلیون</option><option>۵ تا ۱۰ میلیون</option><option>۱۰ تا ۲۰ میلیون</option><option>بیش از ۲۰ میلیون</option>
                    </select>
                  </div>
                  <div style={{ display: 'flex', gap: 10, marginTop: 2 }}>
                    <button type="button" onClick={() => setShowCustomPopup(false)}
                      style={{ flex: 1, background: '#F3F4F6', color: '#6B7280', border: 'none', borderRadius: 9, padding: '12px', fontSize: 14, fontWeight: 600, cursor: 'pointer', fontFamily: "'Vazirmatn', sans-serif" }}>
                      انصراف
                    </button>
                    <button type="submit" style={{ flex: 2, ...btn(NAVY, '#fff', { padding: '12px', fontSize: 14 }) }}>
                      ارسال درخواست →
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ── TOUR DETAIL MODAL ── */}
      {selectedTour && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(15,20,40,0.72)', zIndex: 100, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24, backdropFilter: 'blur(4px)' }}
          onClick={e => { if (e.target === e.currentTarget) setSelectedTour(null) }}>
          <div style={{ background: '#fff', borderRadius: 18, width: '100%', maxWidth: 620, maxHeight: '88vh', overflow: 'auto', boxShadow: '0 24px 72px rgba(0,0,0,0.25)', animation: 'slideUp 0.3s ease' }}>
            <div style={{ position: 'relative', height: 240, background: '#e5e8f0', overflow: 'hidden' }}>
              <img src={`https://images.unsplash.com/photo-${selectedTour.image}?w=800&h=400&fit=crop&auto=format`} alt={selectedTour.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(32,45,89,0.7) 0%, transparent 60%)' }} />
              <button onClick={() => setSelectedTour(null)} style={{ position: 'absolute', top: 14, left: 14, background: 'rgba(0,0,0,0.5)', border: 'none', color: '#fff', borderRadius: '50%', width: 36, height: 36, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
                <CloseIcon />
              </button>
              {selectedTour.tag && <span style={{ position: 'absolute', top: 14, right: 14, background: GOLD, color: NAVY, fontSize: 12, fontWeight: 700, padding: '4px 12px', borderRadius: 100 }}>{selectedTour.tag}</span>}
              <h2 style={{ position: 'absolute', bottom: 16, right: 18, color: '#fff', fontSize: 22, fontWeight: 800, margin: 0 }}>{selectedTour.name}</h2>
            </div>
            <div style={{ padding: '24px' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 14, marginBottom: 24 }}>
                {[['مدت', selectedTour.duration, <ClockIcon key="c" />], ['ایرلاین', selectedTour.airline, <PlaneIcon key="p" />], ['مقصد', selectedTour.destination, '📍']].map(([label, val, icon]) => (
                  <div key={label as string} style={{ background: '#F8F9FC', borderRadius: 10, padding: '14px', textAlign: 'center' }}>
                    <div style={{ color: NAVY, marginBottom: 6 }}>{icon}</div>
                    <div style={{ fontSize: 11, color: '#9CA3AF', marginBottom: 4 }}>{label as string}</div>
                    <div style={{ fontSize: 13, fontWeight: 700, color: NAVY }}>{val as string}</div>
                  </div>
                ))}
              </div>
              {selectedTour.dates.length > 0 && (
                <div style={{ marginBottom: 20 }}>
                  <div style={{ fontSize: 13, fontWeight: 700, color: NAVY, marginBottom: 10 }}>تاریخ‌های حرکت:</div>
                  <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                    {selectedTour.dates.map(d => (
                      <span key={d} style={{ background: '#F0F4FF', color: NAVY, fontSize: 13, padding: '6px 14px', borderRadius: 8, border: '1px solid #D5DCF5', fontWeight: 600 }}>{d}</span>
                    ))}
                  </div>
                </div>
              )}
              {selectedTour.hotels.length > 0 && (
                <div style={{ marginBottom: 22 }}>
                  <div style={{ fontSize: 13, fontWeight: 700, color: NAVY, marginBottom: 10 }}>هتل‌ها:</div>
                  {selectedTour.hotels.map(h => (
                    <div key={h.name} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 14px', background: '#F8F9FC', borderRadius: 10, marginBottom: 8 }}>
                      <div>
                        <div style={{ fontWeight: 600, fontSize: 14, color: NAVY }}>{h.name}</div>
                        <div style={{ color: GOLD, fontSize: 12, marginTop: 2 }}>{'★'.repeat(h.stars)}</div>
                      </div>
                      <div style={{ textAlign: 'left' }}>
                        <div style={{ fontSize: 15, fontWeight: 800, color: NAVY }}>{formatPrice(h.price)}</div>
                        <div style={{ fontSize: 11, color: '#9CA3AF' }}>تومان/نفر</div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderTop: '1px solid #F0F2F7', paddingTop: 20 }}>
                <div>
                  <div style={{ fontSize: 11, color: '#9CA3AF' }}>قیمت از</div>
                  <div style={{ fontSize: 24, fontWeight: 800, color: NAVY }}>{formatPrice(selectedTour.price)}</div>
                  <div style={{ fontSize: 11, color: '#9CA3AF' }}>تومان</div>
                </div>
                <button onClick={() => { setSelectedTour(null); setShowCustomPopup(true) }}
                  style={{ ...btn(GOLD, NAVY, { padding: '13px 28px', fontSize: 15, boxShadow: '0 4px 16px rgba(251,183,28,0.4)' }) }}>
                  رزرو کنید
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <style>{`
        @keyframes slideUp {
          from { opacity: 0; transform: translateY(18px) scale(0.97); }
          to { opacity: 1; transform: translateY(0) scale(1); }
        }
      `}</style>
    </div>
  )
}

function TourCard({ tour, onDetail }: { tour: Tour; onDetail: () => void }) {
  return (
    <div style={{ background: '#fff', borderRadius: 14, overflow: 'hidden', boxShadow: '0 2px 14px rgba(32,45,89,0.07)', transition: 'transform 0.25s, box-shadow 0.25s', cursor: 'pointer' }}
      onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-4px)'; e.currentTarget.style.boxShadow = '0 12px 36px rgba(32,45,89,0.14)' }}
      onMouseLeave={e => { e.currentTarget.style.transform = ''; e.currentTarget.style.boxShadow = '0 2px 14px rgba(32,45,89,0.07)' }}>
      <div style={{ position: 'relative', height: 200, background: '#e5e8f0', overflow: 'hidden' }}>
        <img src={`https://images.unsplash.com/photo-${tour.image}?w=600&h=400&fit=crop&auto=format`} alt={tour.name} style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.4s' }}
          onMouseEnter={e => (e.currentTarget.style.transform = 'scale(1.05)')}
          onMouseLeave={e => (e.currentTarget.style.transform = '')} />
        {tour.tag && <span style={{ position: 'absolute', top: 12, right: 12, background: tour.tag === 'لوکس' ? NAVY : GOLD, color: tour.tag === 'لوکس' ? '#fff' : NAVY, fontSize: 11, fontWeight: 700, padding: '4px 11px', borderRadius: 100, boxShadow: '0 2px 8px rgba(0,0,0,0.15)' }}>{tour.tag}</span>}
      </div>
      <div style={{ padding: '18px 18px 20px' }}>
        <h3 style={{ fontSize: 15, fontWeight: 700, color: NAVY, marginBottom: 12, lineHeight: 1.4 }}>{tour.name}</h3>
        <div style={{ display: 'flex', gap: 14, marginBottom: 16, color: '#6B7280', fontSize: 12 }}>
          <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}><ClockIcon />{tour.duration}</span>
          <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}><PlaneIcon size={12} />{tour.airline}</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderTop: '1px solid #F0F2F7', paddingTop: 14 }}>
          <div>
            <div style={{ fontSize: 10, color: '#9CA3AF' }}>از</div>
            <div style={{ fontSize: 18, fontWeight: 800, color: NAVY }}>{formatPrice(tour.price)}</div>
            <div style={{ fontSize: 10, color: '#9CA3AF' }}>تومان/نفر</div>
          </div>
          <button onClick={onDetail} style={{ background: `linear-gradient(135deg, ${GOLD}, #F5A800)`, color: NAVY, border: 'none', borderRadius: 9, padding: '10px 18px', fontSize: 13, fontWeight: 700, cursor: 'pointer', fontFamily: "'Vazirmatn', sans-serif", boxShadow: '0 4px 12px rgba(251,183,28,0.38)' }}>
            رزرو و خرید
          </button>
        </div>
      </div>
    </div>
  )
}
