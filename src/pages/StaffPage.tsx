import { useState, useEffect } from 'react'
import { getTours, saveTours, getVisas, saveVisas, verifyLogin, formatPrice } from '../lib/store'
import type { Tour, VisaService, StaffAccount } from '../lib/types'

const NAVY = '#202D59'
const GOLD = '#FBB71C'
const font = "'Vazirmatn', sans-serif"

function inputStyle(focused = false) {
  return { width: '100%', border: `1.5px solid ${focused ? GOLD : '#D1D5DB'}`, borderRadius: 9, padding: '10px 13px', fontSize: 14, fontFamily: font, color: NAVY, outline: 'none', background: '#fff' }
}

type Tab = 'tours' | 'visas'

const emptyTour: Omit<Tour, 'id' | 'createdAt' | 'updatedAt'> = {
  name: '', destination: '', image: '1524231757912-21f4fe3a7200', price: 0, duration: '', airline: '',
  hotels: [], dates: [], tag: '', visible: true, specialOffer: false,
}

export default function StaffPage() {
  const [account, setAccount] = useState<StaffAccount | null>(null)
  const [pw, setPw] = useState('')
  const [loginError, setLoginError] = useState('')
  const [tab, setTab] = useState<Tab>('tours')
  const [tours, setTours] = useState<Tour[]>([])
  const [visas, setVisas] = useState<VisaService[]>([])
  const [editTour, setEditTour] = useState<Tour | null>(null)
  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState(emptyTour)
  const [datesInput, setDatesInput] = useState('')
  const [hotelInput, setHotelInput] = useState({ name: '', stars: 4, price: 0, capacity: 20 })
  const [saving, setSaving] = useState(false)
  const [searchQ, setSearchQ] = useState('')

  useEffect(() => {
    const saved = sessionStorage.getItem('safaro_staff')
    if (saved) setAccount(JSON.parse(saved))
  }, [])

  useEffect(() => {
    if (account) { setTours(getTours()); setVisas(getVisas()) }
  }, [account])

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault()
    const acc = verifyLogin(pw)
    if (acc) {
      setAccount(acc)
      sessionStorage.setItem('safaro_staff', JSON.stringify(acc))
      setLoginError('')
    } else {
      setLoginError('رمز اشتباه است')
    }
  }

  const handleLogout = () => {
    setAccount(null)
    sessionStorage.removeItem('safaro_staff')
  }

  const openNewTour = () => {
    setEditTour(null)
    setForm(emptyTour)
    setDatesInput('')
    setShowForm(true)
  }

  const openEditTour = (tour: Tour) => {
    setEditTour(tour)
    setForm({ name: tour.name, destination: tour.destination, image: tour.image, price: tour.price, duration: tour.duration, airline: tour.airline, hotels: tour.hotels, dates: tour.dates, tag: tour.tag ?? '', visible: tour.visible, specialOffer: tour.specialOffer })
    setDatesInput(tour.dates.join('، '))
    setShowForm(true)
  }

  const handleSaveTour = () => {
    setSaving(true)
    const dates = datesInput.split(/[،,\n]/).map(d => d.trim()).filter(Boolean)
    const all = getTours()
    if (editTour) {
      const updated = all.map(t => t.id === editTour.id ? { ...t, ...form, dates, updatedAt: new Date().toISOString() } : t)
      saveTours(updated)
      setTours(updated.filter(() => true))
    } else {
      const newTour: Tour = { ...form, dates, id: `t_${Date.now()}`, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() }
      saveTours([...all, newTour])
      setTours([...all, newTour])
    }
    setSaving(false)
    setShowForm(false)
  }

  const toggleTourVisible = (id: string) => {
    const updated = tours.map(t => t.id === id ? { ...t, visible: !t.visible } : t)
    saveTours(updated)
    setTours(updated)
  }

  const deleteTour = (id: string) => {
    if (!confirm('آیا از حذف این تور مطمئن هستید؟')) return
    const updated = tours.filter(t => t.id !== id)
    saveTours(updated)
    setTours(updated)
  }

  const toggleVisaVisible = (id: string) => {
    const updated = visas.map(v => v.id === id ? { ...v, visible: !v.visible } : v)
    saveVisas(updated)
    setVisas(updated)
  }

  const addHotelToForm = () => {
    if (!hotelInput.name) return
    setForm(f => ({ ...f, hotels: [...f.hotels, hotelInput] }))
    setHotelInput({ name: '', stars: 4, price: 0, capacity: 20 })
  }

  const removeHotel = (i: number) => setForm(f => ({ ...f, hotels: f.hotels.filter((_, idx) => idx !== i) }))

  const filtered = tours.filter(t => t.name.includes(searchQ) || t.destination.includes(searchQ))

  if (!account) {
    return (
      <div dir="rtl" style={{ fontFamily: font, minHeight: '100vh', background: '#F8F9FC', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ background: '#fff', borderRadius: 18, padding: '40px 36px', width: '100%', maxWidth: 380, boxShadow: '0 12px 48px rgba(32,45,89,0.12)' }}>
          <div style={{ textAlign: 'center', marginBottom: 28 }}>
            <div style={{ width: 52, height: 52, borderRadius: '50%', background: NAVY, display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 14px', fontSize: 22, color: GOLD, fontWeight: 800 }}>س</div>
            <h2 style={{ fontSize: 20, fontWeight: 800, color: NAVY, marginBottom: 4 }}>پنل فروش سفرو</h2>
            <p style={{ color: '#6B7280', fontSize: 13 }}>رمز پنل را وارد کنید</p>
          </div>
          <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            <input type="password" value={pw} onChange={e => setPw(e.target.value)} placeholder="رمز ورود"
              style={{ ...inputStyle(), textAlign: 'center', fontSize: 16, letterSpacing: 4 }} />
            {loginError && <p style={{ color: '#EF4444', fontSize: 13, textAlign: 'center', margin: 0 }}>{loginError}</p>}
            <button type="submit" style={{ background: NAVY, color: '#fff', border: 'none', borderRadius: 10, padding: '13px', fontSize: 15, fontWeight: 700, cursor: 'pointer', fontFamily: font }}>
              ورود به پنل فروش
            </button>
          </form>
          <p style={{ textAlign: 'center', marginTop: 16, fontSize: 12, color: '#9CA3AF' }}>رمز دمو: staff123 | admin123</p>
        </div>
      </div>
    )
  }

  return (
    <div dir="rtl" style={{ fontFamily: font, minHeight: '100vh', background: '#F0F4FA', color: NAVY }}>
      {/* Header */}
      <div style={{ background: NAVY, padding: '0 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: 62, boxShadow: '0 2px 16px rgba(32,45,89,0.3)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{ width: 34, height: 34, borderRadius: '50%', background: GOLD, display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: 15, color: NAVY }}>س</div>
          <span style={{ color: '#fff', fontWeight: 800, fontSize: 18 }}>سفرو</span>
          <span style={{ color: 'rgba(255,255,255,0.4)', fontSize: 12, marginRight: 4 }}>پنل فروش</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          <span style={{ color: 'rgba(255,255,255,0.6)', fontSize: 13 }}>خوش آمدید، {account.name}</span>
          <button onClick={handleLogout} style={{ background: 'rgba(255,255,255,0.1)', color: '#fff', border: 'none', borderRadius: 8, padding: '7px 14px', fontSize: 13, fontWeight: 600, cursor: 'pointer', fontFamily: font }}>خروج</button>
        </div>
      </div>

      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '28px 24px' }}>
        {/* Tabs */}
        <div style={{ display: 'flex', gap: 4, background: '#fff', borderRadius: 12, padding: 4, marginBottom: 28, width: 'fit-content', boxShadow: '0 2px 12px rgba(32,45,89,0.07)' }}>
          {([['tours', '🗺 تورها'], ['visas', '🛂 ویزا']] as const).map(([key, label]) => (
            <button key={key} onClick={() => setTab(key)}
              style={{ padding: '9px 22px', borderRadius: 9, border: 'none', fontFamily: font, fontSize: 14, fontWeight: 700, cursor: 'pointer', transition: 'all 0.2s', background: tab === key ? NAVY : 'transparent', color: tab === key ? '#fff' : '#6B7280' }}>
              {label}
            </button>
          ))}
        </div>

        {/* TOURS TAB */}
        {tab === 'tours' && (
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20, flexWrap: 'wrap', gap: 12 }}>
              <div>
                <h2 style={{ fontSize: 20, fontWeight: 800, color: NAVY, margin: 0 }}>مدیریت تورها</h2>
                <p style={{ color: '#6B7280', fontSize: 13, marginTop: 4 }}>{tours.length} تور ثبت‌شده</p>
              </div>
              <div style={{ display: 'flex', gap: 10 }}>
                <input value={searchQ} onChange={e => setSearchQ(e.target.value)} placeholder="جستجو در تورها..."
                  style={{ ...inputStyle(), width: 220 }} />
                <button onClick={openNewTour} style={{ background: GOLD, color: NAVY, border: 'none', borderRadius: 10, padding: '10px 20px', fontSize: 14, fontWeight: 700, cursor: 'pointer', fontFamily: font, display: 'flex', alignItems: 'center', gap: 6 }}>
                  + افزودن تور
                </button>
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {filtered.map(tour => (
                <div key={tour.id} style={{ background: '#fff', borderRadius: 12, padding: '16px 20px', display: 'flex', alignItems: 'center', gap: 16, boxShadow: '0 2px 10px rgba(32,45,89,0.06)', opacity: tour.visible ? 1 : 0.55 }}>
                  <div style={{ width: 70, height: 55, borderRadius: 8, overflow: 'hidden', flexShrink: 0, background: '#e5e8f0' }}>
                    <img src={`https://images.unsplash.com/photo-${tour.image}?w=200&h=160&fit=crop`} alt={tour.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontWeight: 700, fontSize: 15, color: NAVY, marginBottom: 3 }}>{tour.name}</div>
                    <div style={{ display: 'flex', gap: 12, color: '#6B7280', fontSize: 12, flexWrap: 'wrap' }}>
                      <span>📍 {tour.destination}</span>
                      <span>⏱ {tour.duration}</span>
                      <span>✈ {tour.airline}</span>
                    </div>
                  </div>
                  <div style={{ textAlign: 'center', flexShrink: 0 }}>
                    <div style={{ fontSize: 15, fontWeight: 800, color: NAVY }}>{formatPrice(tour.price)}</div>
                    <div style={{ fontSize: 11, color: '#9CA3AF' }}>تومان</div>
                  </div>
                  <div style={{ display: 'flex', gap: 8, flexShrink: 0 }}>
                    <button onClick={() => toggleTourVisible(tour.id)}
                      style={{ background: tour.visible ? '#ECFDF5' : '#FEF2F2', color: tour.visible ? '#059669' : '#DC2626', border: 'none', borderRadius: 8, padding: '7px 14px', fontSize: 12, fontWeight: 700, cursor: 'pointer', fontFamily: font }}>
                      {tour.visible ? '👁 نمایش' : '🚫 پنهان'}
                    </button>
                    <button onClick={() => openEditTour(tour)} style={{ background: '#EFF6FF', color: '#2563EB', border: 'none', borderRadius: 8, padding: '7px 14px', fontSize: 12, fontWeight: 700, cursor: 'pointer', fontFamily: font }}>✏ ویرایش</button>
                    <button onClick={() => deleteTour(tour.id)} style={{ background: '#FEF2F2', color: '#DC2626', border: 'none', borderRadius: 8, padding: '7px 14px', fontSize: 12, fontWeight: 700, cursor: 'pointer', fontFamily: font }}>🗑</button>
                  </div>
                </div>
              ))}
              {filtered.length === 0 && <div style={{ textAlign: 'center', padding: '48px', color: '#9CA3AF' }}>هیچ توری یافت نشد</div>}
            </div>
          </div>
        )}

        {/* VISAS TAB */}
        {tab === 'visas' && (
          <div>
            <h2 style={{ fontSize: 20, fontWeight: 800, color: NAVY, marginBottom: 20 }}>مدیریت ویزا</h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {visas.map(visa => (
                <div key={visa.id} style={{ background: '#fff', borderRadius: 12, padding: '16px 20px', display: 'flex', alignItems: 'center', gap: 16, boxShadow: '0 2px 10px rgba(32,45,89,0.06)', opacity: visa.visible ? 1 : 0.5 }}>
                  <span style={{ fontSize: 30 }}>{visa.flag}</span>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: 700, fontSize: 15, color: NAVY }}>{visa.country}</div>
                    <div style={{ color: '#6B7280', fontSize: 12, marginTop: 2 }}>{visa.processingTime} · {visa.price}</div>
                  </div>
                  <button onClick={() => toggleVisaVisible(visa.id)}
                    style={{ background: visa.visible ? '#ECFDF5' : '#FEF2F2', color: visa.visible ? '#059669' : '#DC2626', border: 'none', borderRadius: 8, padding: '7px 14px', fontSize: 12, fontWeight: 700, cursor: 'pointer', fontFamily: font }}>
                    {visa.visible ? '👁 نمایش' : '🚫 پنهان'}
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* TOUR FORM MODAL */}
      {showForm && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(15,20,40,0.6)', zIndex: 100, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20, backdropFilter: 'blur(4px)' }}
          onClick={e => { if (e.target === e.currentTarget) setShowForm(false) }}>
          <div style={{ background: '#fff', borderRadius: 18, width: '100%', maxWidth: 640, maxHeight: '90vh', overflow: 'auto', boxShadow: '0 24px 72px rgba(0,0,0,0.22)' }}>
            <div style={{ position: 'sticky', top: 0, background: NAVY, padding: '18px 24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', zIndex: 1 }}>
              <h3 style={{ color: '#fff', fontSize: 17, fontWeight: 800, margin: 0 }}>{editTour ? 'ویرایش تور' : 'افزودن تور جدید'}</h3>
              <div style={{ display: 'flex', gap: 10 }}>
                <button onClick={handleSaveTour} disabled={saving}
                  style={{ background: GOLD, color: NAVY, border: 'none', borderRadius: 9, padding: '8px 20px', fontSize: 14, fontWeight: 700, cursor: 'pointer', fontFamily: font }}>
                  {saving ? '...' : '💾 ذخیره تور'}
                </button>
                <button onClick={() => setShowForm(false)} style={{ background: 'rgba(255,255,255,0.15)', color: '#fff', border: 'none', borderRadius: 9, padding: '8px 16px', fontSize: 14, cursor: 'pointer', fontFamily: font }}>بستن</button>
              </div>
            </div>
            <div style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: 16 }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
                {[['نام تور *', 'name', 'text', 'مثلاً: تور استانبول ویژه'], ['مقصد *', 'destination', 'text', 'مثلاً: ترکیه']].map(([label, key, type, placeholder]) => (
                  <div key={key}>
                    <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: NAVY, marginBottom: 5, opacity: 0.7 }}>{label}</label>
                    <input type={type} value={(form as Record<string, unknown>)[key] as string} onChange={e => setForm(f => ({ ...f, [key]: e.target.value }))} placeholder={placeholder} style={inputStyle()} onFocus={e => (e.currentTarget.style.borderColor = GOLD)} onBlur={e => (e.currentTarget.style.borderColor = '#D1D5DB')} />
                  </div>
                ))}
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 14 }}>
                <div>
                  <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: NAVY, marginBottom: 5, opacity: 0.7 }}>قیمت پایه (تومان) *</label>
                  <input type="number" value={form.price || ''} onChange={e => setForm(f => ({ ...f, price: Number(e.target.value) }))} placeholder="۸۵۰۰۰۰۰" style={inputStyle()} onFocus={e => (e.currentTarget.style.borderColor = GOLD)} onBlur={e => (e.currentTarget.style.borderColor = '#D1D5DB')} />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: NAVY, marginBottom: 5, opacity: 0.7 }}>مدت</label>
                  <input type="text" value={form.duration} onChange={e => setForm(f => ({ ...f, duration: e.target.value }))} placeholder="۷ شب و ۸ روز" style={inputStyle()} onFocus={e => (e.currentTarget.style.borderColor = GOLD)} onBlur={e => (e.currentTarget.style.borderColor = '#D1D5DB')} />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: NAVY, marginBottom: 5, opacity: 0.7 }}>ایرلاین</label>
                  <input type="text" value={form.airline} onChange={e => setForm(f => ({ ...f, airline: e.target.value }))} placeholder="ماهان ایر" style={inputStyle()} onFocus={e => (e.currentTarget.style.borderColor = GOLD)} onBlur={e => (e.currentTarget.style.borderColor = '#D1D5DB')} />
                </div>
              </div>
              <div>
                <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: NAVY, marginBottom: 5, opacity: 0.7 }}>تاریخ‌های حرکت (با ویرگول جدا کنید)</label>
                <input type="text" value={datesInput} onChange={e => setDatesInput(e.target.value)} placeholder="۱۴۰۴/۰۵/۱۰، ۱۴۰۴/۰۵/۲۴" style={inputStyle()} onFocus={e => (e.currentTarget.style.borderColor = GOLD)} onBlur={e => (e.currentTarget.style.borderColor = '#D1D5DB')} />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: NAVY, marginBottom: 5, opacity: 0.7 }}>ID عکس Unsplash</label>
                <input type="text" value={form.image} onChange={e => setForm(f => ({ ...f, image: e.target.value }))} placeholder="1524231757912-21f4fe3a7200" style={inputStyle()} onFocus={e => (e.currentTarget.style.borderColor = GOLD)} onBlur={e => (e.currentTarget.style.borderColor = '#D1D5DB')} />
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
                <div>
                  <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: NAVY, marginBottom: 5, opacity: 0.7 }}>برچسب</label>
                  <select value={form.tag ?? ''} onChange={e => setForm(f => ({ ...f, tag: e.target.value }))} style={{ ...inputStyle(), appearance: 'none' }}>
                    <option value="">بدون برچسب</option>
                    <option>پیشنهاد ویژه</option><option>لوکس</option><option>محبوب</option><option>ترکیبی</option>
                  </select>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 10, justifyContent: 'center' }}>
                  <label style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer', fontSize: 14, fontWeight: 600, color: NAVY }}>
                    <input type="checkbox" checked={form.visible} onChange={e => setForm(f => ({ ...f, visible: e.target.checked }))} /> نمایش برای مشتری
                  </label>
                  <label style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer', fontSize: 14, fontWeight: 600, color: NAVY }}>
                    <input type="checkbox" checked={form.specialOffer} onChange={e => setForm(f => ({ ...f, specialOffer: e.target.checked }))} /> تور ویژه
                  </label>
                </div>
              </div>

              {/* Hotels */}
              <div style={{ borderTop: '1px solid #F0F2F7', paddingTop: 16 }}>
                <div style={{ fontWeight: 700, fontSize: 14, color: NAVY, marginBottom: 12 }}>هتل‌ها</div>
                {form.hotels.map((h, i) => (
                  <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 10, background: '#F8F9FC', borderRadius: 9, padding: '10px 14px', marginBottom: 8 }}>
                    <span style={{ flex: 1, fontSize: 13, color: NAVY, fontWeight: 600 }}>{h.name}</span>
                    <span style={{ color: GOLD, fontSize: 13 }}>{'★'.repeat(h.stars)}</span>
                    <span style={{ fontSize: 13, color: '#6B7280' }}>{formatPrice(h.price)} ت</span>
                    <span style={{ fontSize: 12, color: '#9CA3AF' }}>ظرفیت: {h.capacity}</span>
                    <button onClick={() => removeHotel(i)} style={{ background: '#FEE2E2', color: '#DC2626', border: 'none', borderRadius: 6, padding: '4px 10px', cursor: 'pointer', fontFamily: font }}>✕</button>
                  </div>
                ))}
                <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1fr auto', gap: 8, marginTop: 8 }}>
                  <input placeholder="نام هتل" value={hotelInput.name} onChange={e => setHotelInput(h => ({ ...h, name: e.target.value }))} style={{ ...inputStyle(), fontSize: 13 }} />
                  <select value={hotelInput.stars} onChange={e => setHotelInput(h => ({ ...h, stars: Number(e.target.value) }))} style={{ ...inputStyle(), appearance: 'none', fontSize: 13 }}>
                    {[3, 4, 5].map(s => <option key={s} value={s}>{s} ستاره</option>)}
                  </select>
                  <input placeholder="قیمت" type="number" value={hotelInput.price || ''} onChange={e => setHotelInput(h => ({ ...h, price: Number(e.target.value) }))} style={{ ...inputStyle(), fontSize: 13 }} />
                  <input placeholder="ظرفیت" type="number" value={hotelInput.capacity || ''} onChange={e => setHotelInput(h => ({ ...h, capacity: Number(e.target.value) }))} style={{ ...inputStyle(), fontSize: 13 }} />
                  <button onClick={addHotelToForm} style={{ background: NAVY, color: '#fff', border: 'none', borderRadius: 9, padding: '10px 16px', cursor: 'pointer', fontFamily: font, fontWeight: 700, fontSize: 13 }}>+ افزودن</button>
                </div>
              </div>

              <button onClick={handleSaveTour} disabled={saving} style={{ background: GOLD, color: NAVY, border: 'none', borderRadius: 10, padding: '13px', fontSize: 15, fontWeight: 700, cursor: 'pointer', fontFamily: font, marginTop: 8 }}>
                {saving ? 'در حال ذخیره...' : '💾 ذخیره تغییرات'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
