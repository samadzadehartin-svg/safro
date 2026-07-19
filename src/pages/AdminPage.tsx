import { useState, useEffect } from 'react'
import {
  getTours, saveTours, getVisas, saveVisas,
  getLeads, updateLead, deleteLead,
  getOrders, getSettings, saveSettings,
  verifyLogin, formatPrice
} from '../lib/store'
import { testSupabaseConnection, syncToSupabase } from '../lib/supabase'
import type { Tour, VisaService, Lead, Order, AppSettings, StaffAccount } from '../lib/types'

const NAVY = '#202D59'
const GOLD = '#FBB71C'
const font = "'Vazirmatn', sans-serif"

type AdminTab = 'dashboard' | 'tours' | 'visas' | 'leads' | 'orders' | 'settings'

const LEAD_STATUS_LABEL: Record<Lead['status'], string> = {
  new: 'جدید', contacted: 'تماس گرفته', followup: 'پیگیری', noanswer: 'پاسخ ندادند', booked: 'رزرو شد', cancelled: 'لغو شد',
}
const LEAD_STATUS_COLOR: Record<Lead['status'], string> = {
  new: '#3B82F6', contacted: '#8B5CF6', followup: '#F59E0B', noanswer: '#6B7280', booked: '#059669', cancelled: '#EF4444',
}

function inputStyle() {
  return { width: '100%', border: '1.5px solid #D1D5DB', borderRadius: 9, padding: '10px 13px', fontSize: 14, fontFamily: font, color: NAVY, outline: 'none', background: '#fff' }
}

export default function AdminPage() {
  const [account, setAccount] = useState<StaffAccount | null>(null)
  const [pw, setPw] = useState('')
  const [loginError, setLoginError] = useState('')
  const [tab, setTab] = useState<AdminTab>('dashboard')
  const [tours, setTours] = useState<Tour[]>([])
  const [visas, setVisas] = useState<VisaService[]>([])
  const [leads, setLeads] = useState<Lead[]>([])
  const [orders, setOrders] = useState<Order[]>([])
  const [settings, setSettings] = useState<AppSettings>(getSettings())
  const [supabaseStatus, setSupabaseStatus] = useState<string>('')
  const [supabaseTesting, setSupabaseTesting] = useState(false)
  const [supabaseSyncing, setSupabaseSyncing] = useState(false)
  const [newVisa, setNewVisa] = useState<Omit<VisaService, 'id' | 'visible'>>({ country: '', flag: '', processingTime: '', price: '' })
  const [editLeadId, setEditLeadId] = useState<string | null>(null)
  const [searchQ, setSearchQ] = useState('')

  useEffect(() => {
    const saved = sessionStorage.getItem('safaro_admin')
    if (saved) setAccount(JSON.parse(saved))
  }, [])

  useEffect(() => {
    if (account) {
      setTours(getTours())
      setVisas(getVisas())
      setLeads(getLeads())
      setOrders(getOrders())
      setSettings(getSettings())
    }
  }, [account])

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault()
    const acc = verifyLogin(pw)
    if (acc && acc.role === 'admin') {
      setAccount(acc)
      sessionStorage.setItem('safaro_admin', JSON.stringify(acc))
    } else if (acc) {
      setLoginError('دسترسی مدیریت ندارید')
    } else {
      setLoginError('رمز اشتباه است')
    }
  }

  const handleLogout = () => { setAccount(null); sessionStorage.removeItem('safaro_admin') }

  const toggleTour = (id: string, field: 'visible' | 'specialOffer') => {
    const updated = tours.map(t => t.id === id ? { ...t, [field]: !t[field] } : t)
    saveTours(updated); setTours(updated)
  }

  const deleteTourA = (id: string) => {
    if (!confirm('آیا از حذف این تور مطمئن هستید؟')) return
    const updated = tours.filter(t => t.id !== id)
    saveTours(updated); setTours(updated)
  }

  const toggleVisa = (id: string) => {
    const updated = visas.map(v => v.id === id ? { ...v, visible: !v.visible } : v)
    saveVisas(updated); setVisas(updated)
  }

  const addVisa = () => {
    if (!newVisa.country) return
    const updated = [...visas, { ...newVisa, id: `v_${Date.now()}`, visible: true }]
    saveVisas(updated); setVisas(updated)
    setNewVisa({ country: '', flag: '', processingTime: '', price: '' })
  }

  const deleteVisa = (id: string) => {
    const updated = visas.filter(v => v.id !== id)
    saveVisas(updated); setVisas(updated)
  }

  const updateLeadField = (id: string, field: keyof Lead, value: string) => {
    updateLead(id, { [field]: value })
    setLeads(getLeads())
  }

  const handleDeleteLead = (id: string) => {
    if (!confirm('حذف این شماره؟')) return
    deleteLead(id); setLeads(getLeads())
  }

  const handleSaveSettings = () => {
    saveSettings(settings)
    alert('تنظیمات ذخیره شد ✓')
  }

  const handleTestSupabase = async () => {
    setSupabaseTesting(true)
    setSupabaseStatus('')
    const result = await testSupabaseConnection()
    setSupabaseStatus(result.success ? '✅ اتصال موفق!' : `❌ ${result.error}`)
    setSupabaseTesting(false)
  }

  const handleSyncSupabase = async () => {
    setSupabaseSyncing(true)
    const data = { tours: getTours(), visas: getVisas(), leads: getLeads(), orders: getOrders(), settings: getSettings() }
    const result = await syncToSupabase(data as unknown as Record<string, unknown>)
    setSupabaseStatus(result.success ? '✅ همگام‌سازی موفق!' : `❌ ${result.error}`)
    setSupabaseSyncing(false)
  }

  const filteredLeads = leads.filter(l => l.phone?.includes(searchQ) || l.name?.includes(searchQ) || l.destination?.includes(searchQ))

  if (!account) {
    return (
      <div dir="rtl" style={{ fontFamily: font, minHeight: '100vh', background: '#F8F9FC', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ background: '#fff', borderRadius: 18, padding: '40px 36px', width: '100%', maxWidth: 380, boxShadow: '0 12px 48px rgba(32,45,89,0.12)' }}>
          <div style={{ textAlign: 'center', marginBottom: 28 }}>
            <div style={{ width: 52, height: 52, borderRadius: '50%', background: NAVY, display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 14px', fontSize: 22, color: GOLD, fontWeight: 800 }}>س</div>
            <h2 style={{ fontSize: 20, fontWeight: 800, color: NAVY, marginBottom: 4 }}>پنل مدیریت سفرو</h2>
            <p style={{ color: '#6B7280', fontSize: 13 }}>رمز مدیریت را وارد کنید</p>
          </div>
          <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            <input type="password" value={pw} onChange={e => setPw(e.target.value)} placeholder="رمز مدیر"
              style={{ ...inputStyle(), textAlign: 'center', fontSize: 16, letterSpacing: 4 }} />
            {loginError && <p style={{ color: '#EF4444', fontSize: 13, textAlign: 'center', margin: 0 }}>{loginError}</p>}
            <button type="submit" style={{ background: NAVY, color: '#fff', border: 'none', borderRadius: 10, padding: '13px', fontSize: 15, fontWeight: 700, cursor: 'pointer', fontFamily: font }}>
              ورود به پنل مدیریت
            </button>
          </form>
          <p style={{ textAlign: 'center', marginTop: 16, fontSize: 12, color: '#9CA3AF' }}>رمز دمو: admin123</p>
        </div>
      </div>
    )
  }

  const tabDefs: [AdminTab, string][] = [['dashboard', '📊 داشبورد'], ['tours', '🗺 تورها'], ['visas', '🛂 ویزا'], ['leads', '📋 لیست تماس'], ['orders', '📦 رزروها'], ['settings', '⚙ تنظیمات']]

  return (
    <div dir="rtl" style={{ fontFamily: font, minHeight: '100vh', background: '#F0F4FA', color: NAVY, display: 'flex', flexDirection: 'column' }}>
      {/* Header */}
      <div style={{ background: NAVY, padding: '0 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: 62, boxShadow: '0 2px 16px rgba(32,45,89,0.3)', flexShrink: 0 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{ width: 34, height: 34, borderRadius: '50%', background: GOLD, display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: 15, color: NAVY }}>س</div>
          <span style={{ color: '#fff', fontWeight: 800, fontSize: 18 }}>سفرو</span>
          <span style={{ color: 'rgba(255,255,255,0.4)', fontSize: 12, marginRight: 4 }}>پنل مدیریت</span>
        </div>
        <div style={{ display: 'flex', gap: 16, alignItems: 'center' }}>
          <a href="/" style={{ color: 'rgba(255,255,255,0.6)', fontSize: 13, textDecoration: 'none' }}>👁 پنل مشتری</a>
          <a href="/staff" style={{ color: 'rgba(255,255,255,0.6)', fontSize: 13, textDecoration: 'none' }}>👷 پنل فروش</a>
          <button onClick={handleLogout} style={{ background: 'rgba(255,255,255,0.1)', color: '#fff', border: 'none', borderRadius: 8, padding: '7px 14px', fontSize: 13, fontWeight: 600, cursor: 'pointer', fontFamily: font }}>خروج</button>
        </div>
      </div>

      <div style={{ display: 'flex', flex: 1, overflow: 'hidden' }}>
        {/* Sidebar */}
        <div style={{ width: 200, background: '#fff', borderLeft: '1px solid #E5E7EB', flexShrink: 0, padding: '20px 0' }}>
          {tabDefs.map(([key, label]) => (
            <button key={key} onClick={() => setTab(key)}
              style={{ width: '100%', padding: '11px 20px', border: 'none', background: tab === key ? '#F0F4FF' : 'transparent', color: tab === key ? NAVY : '#6B7280', fontFamily: font, fontSize: 13, fontWeight: tab === key ? 700 : 500, cursor: 'pointer', textAlign: 'right', borderRight: tab === key ? `3px solid ${NAVY}` : '3px solid transparent', transition: 'all 0.15s' }}>
              {label}
            </button>
          ))}
        </div>

        {/* Content */}
        <div style={{ flex: 1, overflow: 'auto', padding: '28px 28px' }}>

          {/* DASHBOARD */}
          {tab === 'dashboard' && (
            <div>
              <h2 style={{ fontSize: 22, fontWeight: 800, color: NAVY, marginBottom: 24 }}>داشبورد</h2>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: 16, marginBottom: 32 }}>
                {[[tours.length, 'تور ثبت‌شده', '🗺', NAVY], [leads.length, 'شماره تماس', '📋', '#7C3AED'], [orders.length, 'رزرو', '📦', '#059669'], [tours.filter(t => t.visible).length, 'تور فعال', '✅', '#0EA5E9']].map(([num, label, icon, color]) => (
                  <div key={label as string} style={{ background: '#fff', borderRadius: 14, padding: '22px 20px', boxShadow: '0 2px 12px rgba(32,45,89,0.07)', borderTop: `4px solid ${color}` }}>
                    <div style={{ fontSize: 28, marginBottom: 10 }}>{icon}</div>
                    <div style={{ fontSize: 28, fontWeight: 800, color: color as string }}>{num}</div>
                    <div style={{ fontSize: 13, color: '#6B7280', marginTop: 4 }}>{label as string}</div>
                  </div>
                ))}
              </div>
              <div style={{ background: '#fff', borderRadius: 14, padding: '22px', boxShadow: '0 2px 12px rgba(32,45,89,0.07)' }}>
                <h3 style={{ fontSize: 16, fontWeight: 700, color: NAVY, marginBottom: 16 }}>آخرین تماس‌ها</h3>
                {leads.slice(0, 5).map(lead => (
                  <div key={lead.id} style={{ display: 'flex', alignItems: 'center', gap: 14, padding: '10px 0', borderBottom: '1px solid #F0F2F7' }}>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: 14, fontWeight: 600, color: NAVY }}>{lead.name || '(بدون نام)'}</div>
                      <div style={{ fontSize: 12, color: '#6B7280' }}>{lead.phone} · {lead.destination}</div>
                    </div>
                    <span style={{ background: LEAD_STATUS_COLOR[lead.status] + '22', color: LEAD_STATUS_COLOR[lead.status], fontSize: 11, fontWeight: 700, padding: '3px 10px', borderRadius: 100 }}>
                      {LEAD_STATUS_LABEL[lead.status]}
                    </span>
                    <div style={{ fontSize: 11, color: '#9CA3AF' }}>{new Date(lead.timestamp).toLocaleDateString('fa-IR')}</div>
                  </div>
                ))}
                {leads.length === 0 && <p style={{ color: '#9CA3AF', fontSize: 13 }}>هنوز تماسی ثبت نشده</p>}
              </div>
            </div>
          )}

          {/* TOURS */}
          {tab === 'tours' && (
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20, flexWrap: 'wrap', gap: 12 }}>
                <h2 style={{ fontSize: 20, fontWeight: 800, color: NAVY, margin: 0 }}>مدیریت تورها</h2>
                <span style={{ color: '#6B7280', fontSize: 13 }}>{tours.length} تور · {tours.filter(t => t.visible).length} فعال</span>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                {tours.map(tour => (
                  <div key={tour.id} style={{ background: '#fff', borderRadius: 12, padding: '14px 18px', display: 'flex', alignItems: 'center', gap: 14, boxShadow: '0 2px 10px rgba(32,45,89,0.06)', opacity: tour.visible ? 1 : 0.55 }}>
                    <div style={{ width: 64, height: 50, borderRadius: 8, overflow: 'hidden', flexShrink: 0, background: '#e5e8f0' }}>
                      <img src={`https://images.unsplash.com/photo-${tour.image}?w=200&h=160&fit=crop`} alt={tour.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontWeight: 700, fontSize: 14, color: NAVY }}>{tour.name}</div>
                      <div style={{ fontSize: 12, color: '#6B7280', marginTop: 2 }}>📍 {tour.destination} · ✈ {tour.airline} · ⏱ {tour.duration}</div>
                    </div>
                    <div style={{ fontSize: 14, fontWeight: 800, color: NAVY, flexShrink: 0 }}>{formatPrice(tour.price)}<span style={{ fontSize: 10, color: '#9CA3AF' }}> ت</span></div>
                    <div style={{ display: 'flex', gap: 6, flexShrink: 0, flexWrap: 'wrap' }}>
                      <button onClick={() => toggleTour(tour.id, 'visible')} style={{ background: tour.visible ? '#ECFDF5' : '#FEF2F2', color: tour.visible ? '#059669' : '#DC2626', border: 'none', borderRadius: 7, padding: '6px 12px', fontSize: 11, fontWeight: 700, cursor: 'pointer', fontFamily: font }}>{tour.visible ? '👁 نمایش' : '🚫 پنهان'}</button>
                      <button onClick={() => toggleTour(tour.id, 'specialOffer')} style={{ background: tour.specialOffer ? '#FEF3C7' : '#F9FAFB', color: tour.specialOffer ? '#D97706' : '#6B7280', border: 'none', borderRadius: 7, padding: '6px 12px', fontSize: 11, fontWeight: 700, cursor: 'pointer', fontFamily: font }}>{tour.specialOffer ? '⭐ ویژه' : 'عادی'}</button>
                      <button onClick={() => deleteTourA(tour.id)} style={{ background: '#FEF2F2', color: '#DC2626', border: 'none', borderRadius: 7, padding: '6px 12px', fontSize: 11, fontWeight: 700, cursor: 'pointer', fontFamily: font }}>🗑 حذف</button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* VISAS */}
          {tab === 'visas' && (
            <div>
              <h2 style={{ fontSize: 20, fontWeight: 800, color: NAVY, marginBottom: 20 }}>مدیریت ویزا</h2>
              {/* Add new */}
              <div style={{ background: '#fff', borderRadius: 14, padding: '20px', marginBottom: 20, boxShadow: '0 2px 12px rgba(32,45,89,0.07)' }}>
                <div style={{ fontWeight: 700, fontSize: 14, color: NAVY, marginBottom: 12 }}>افزودن ویزای جدید</div>
                <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1fr auto', gap: 10 }}>
                  <input placeholder="نام کشور" value={newVisa.country} onChange={e => setNewVisa(v => ({ ...v, country: e.target.value }))} style={inputStyle()} />
                  <input placeholder="پرچم (ایموجی)" value={newVisa.flag} onChange={e => setNewVisa(v => ({ ...v, flag: e.target.value }))} style={inputStyle()} />
                  <input placeholder="زمان پردازش" value={newVisa.processingTime} onChange={e => setNewVisa(v => ({ ...v, processingTime: e.target.value }))} style={inputStyle()} />
                  <input placeholder="قیمت" value={newVisa.price} onChange={e => setNewVisa(v => ({ ...v, price: e.target.value }))} style={inputStyle()} />
                  <button onClick={addVisa} style={{ background: GOLD, color: NAVY, border: 'none', borderRadius: 9, padding: '10px 18px', fontSize: 14, fontWeight: 700, cursor: 'pointer', fontFamily: font }}>+ افزودن</button>
                </div>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                {visas.map(visa => (
                  <div key={visa.id} style={{ background: '#fff', borderRadius: 12, padding: '14px 18px', display: 'flex', alignItems: 'center', gap: 14, boxShadow: '0 2px 10px rgba(32,45,89,0.06)', opacity: visa.visible ? 1 : 0.55 }}>
                    <span style={{ fontSize: 28 }}>{visa.flag}</span>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontWeight: 700, fontSize: 14, color: NAVY }}>{visa.country}</div>
                      <div style={{ fontSize: 12, color: '#6B7280', marginTop: 2 }}>{visa.processingTime} · {visa.price}</div>
                    </div>
                    <div style={{ display: 'flex', gap: 6 }}>
                      <button onClick={() => toggleVisa(visa.id)} style={{ background: visa.visible ? '#ECFDF5' : '#FEF2F2', color: visa.visible ? '#059669' : '#DC2626', border: 'none', borderRadius: 7, padding: '6px 12px', fontSize: 11, fontWeight: 700, cursor: 'pointer', fontFamily: font }}>{visa.visible ? '👁 نمایش' : '🚫 پنهان'}</button>
                      <button onClick={() => deleteVisa(visa.id)} style={{ background: '#FEF2F2', color: '#DC2626', border: 'none', borderRadius: 7, padding: '6px 12px', fontSize: 11, fontWeight: 700, cursor: 'pointer', fontFamily: font }}>🗑 حذف</button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* LEADS */}
          {tab === 'leads' && (
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20, flexWrap: 'wrap', gap: 12 }}>
                <div>
                  <h2 style={{ fontSize: 20, fontWeight: 800, color: NAVY, margin: 0 }}>لیست تماس‌ها</h2>
                  <p style={{ color: '#6B7280', fontSize: 13, marginTop: 4 }}>{leads.length} شماره ثبت‌شده</p>
                </div>
                <input value={searchQ} onChange={e => setSearchQ(e.target.value)} placeholder="جستجو..."
                  style={{ ...inputStyle(), width: 220 }} />
              </div>
              <div style={{ background: '#fff', borderRadius: 14, overflow: 'hidden', boxShadow: '0 2px 12px rgba(32,45,89,0.07)' }}>
                {filteredLeads.length === 0 ? (
                  <div style={{ textAlign: 'center', padding: '48px', color: '#9CA3AF' }}>
                    <div style={{ fontSize: 40, marginBottom: 12 }}>📋</div>
                    <div>هنوز شماره‌ای ثبت نشده. شماره‌ها از فرم «تور اختصاصی» در صفحه مشتری ثبت می‌شوند.</div>
                  </div>
                ) : filteredLeads.map((lead, i) => (
                  <div key={lead.id} style={{ padding: '16px 20px', borderBottom: i < filteredLeads.length - 1 ? '1px solid #F0F2F7' : 'none' }}>
                    <div style={{ display: 'flex', alignItems: 'flex-start', gap: 14, flexWrap: 'wrap' }}>
                      <div style={{ flex: 1, minWidth: 200 }}>
                        <div style={{ fontWeight: 700, fontSize: 14, color: NAVY }}>{lead.name || '(بدون نام)'}</div>
                        <div style={{ fontSize: 13, color: '#374151', marginTop: 3 }}>📞 {lead.phone}</div>
                        {lead.destination && <div style={{ fontSize: 12, color: '#6B7280', marginTop: 2 }}>📍 {lead.destination} · {lead.budget}</div>}
                        <div style={{ fontSize: 11, color: '#9CA3AF', marginTop: 2 }}>{new Date(lead.timestamp).toLocaleString('fa-IR')}</div>
                      </div>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: 8, minWidth: 200 }}>
                        <select value={lead.status} onChange={e => updateLeadField(lead.id, 'status', e.target.value)}
                          style={{ border: `1.5px solid ${LEAD_STATUS_COLOR[lead.status]}`, borderRadius: 8, padding: '6px 12px', fontSize: 12, fontFamily: font, color: LEAD_STATUS_COLOR[lead.status], fontWeight: 700, outline: 'none', background: LEAD_STATUS_COLOR[lead.status] + '18', cursor: 'pointer' }}>
                          {Object.entries(LEAD_STATUS_LABEL).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
                        </select>
                        {editLeadId === lead.id ? (
                          <div style={{ display: 'flex', gap: 6 }}>
                            <input defaultValue={lead.note} onBlur={e => { updateLeadField(lead.id, 'note', e.target.value); setEditLeadId(null) }}
                              placeholder="یادداشت..." autoFocus
                              style={{ flex: 1, border: '1.5px solid #D1D5DB', borderRadius: 8, padding: '6px 10px', fontSize: 12, fontFamily: font, outline: 'none' }} />
                          </div>
                        ) : (
                          <div onClick={() => setEditLeadId(lead.id)} style={{ fontSize: 12, color: lead.note ? '#374151' : '#9CA3AF', background: '#F8F9FC', borderRadius: 8, padding: '6px 12px', cursor: 'pointer', border: '1px dashed #D1D5DB' }}>
                            {lead.note || '+ یادداشت'}
                          </div>
                        )}
                      </div>
                      <button onClick={() => handleDeleteLead(lead.id)} style={{ background: '#FEF2F2', color: '#DC2626', border: 'none', borderRadius: 8, padding: '8px 12px', cursor: 'pointer', fontFamily: font, fontSize: 12, flexShrink: 0 }}>🗑</button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ORDERS */}
          {tab === 'orders' && (
            <div>
              <h2 style={{ fontSize: 20, fontWeight: 800, color: NAVY, marginBottom: 20 }}>رزروها</h2>
              {orders.length === 0 ? (
                <div style={{ background: '#fff', borderRadius: 14, padding: '48px', textAlign: 'center', color: '#9CA3AF', boxShadow: '0 2px 12px rgba(32,45,89,0.07)' }}>
                  <div style={{ fontSize: 40, marginBottom: 12 }}>📦</div>
                  <div>هنوز رزروی ثبت نشده</div>
                </div>
              ) : (
                <div style={{ background: '#fff', borderRadius: 14, overflow: 'hidden', boxShadow: '0 2px 12px rgba(32,45,89,0.07)' }}>
                  {orders.map((order, i) => (
                    <div key={order.id} style={{ padding: '16px 20px', display: 'flex', alignItems: 'center', gap: 14, borderBottom: i < orders.length - 1 ? '1px solid #F0F2F7' : 'none' }}>
                      <div style={{ flex: 1 }}>
                        <div style={{ fontWeight: 700, fontSize: 14, color: NAVY }}>{order.tourName}</div>
                        <div style={{ fontSize: 12, color: '#6B7280', marginTop: 2 }}>{order.passengerName} · {order.phone}</div>
                      </div>
                      <span style={{ fontSize: 11, fontWeight: 700, padding: '4px 12px', borderRadius: 100, background: order.status === 'confirmed' ? '#ECFDF5' : order.status === 'cancelled' ? '#FEF2F2' : '#FEF3C7', color: order.status === 'confirmed' ? '#059669' : order.status === 'cancelled' ? '#DC2626' : '#D97706' }}>
                        {order.status === 'confirmed' ? 'تایید شد' : order.status === 'cancelled' ? 'لغو شد' : 'در انتظار'}
                      </span>
                      <div style={{ fontSize: 11, color: '#9CA3AF' }}>{new Date(order.createdAt).toLocaleDateString('fa-IR')}</div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* SETTINGS */}
          {tab === 'settings' && (
            <div>
              <h2 style={{ fontSize: 20, fontWeight: 800, color: NAVY, marginBottom: 24 }}>تنظیمات</h2>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24 }}>
                {/* Agency Info */}
                <div style={{ background: '#fff', borderRadius: 14, padding: '24px', boxShadow: '0 2px 12px rgba(32,45,89,0.07)' }}>
                  <h3 style={{ fontSize: 16, fontWeight: 700, color: NAVY, marginBottom: 18 }}>اطلاعات آژانس</h3>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                    {([['نام آژانس', 'agencyName'], ['تلفن', 'phone'], ['ایمیل', 'email']] as const).map(([label, key]) => (
                      <div key={key}>
                        <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: NAVY, marginBottom: 5, opacity: 0.7 }}>{label}</label>
                        <input value={settings[key]} onChange={e => setSettings(s => ({ ...s, [key]: e.target.value }))} style={inputStyle()} onFocus={e => (e.currentTarget.style.borderColor = GOLD)} onBlur={e => (e.currentTarget.style.borderColor = '#D1D5DB')} />
                      </div>
                    ))}
                    <div>
                      <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: NAVY, marginBottom: 5, opacity: 0.7 }}>آدرس</label>
                      <textarea value={settings.address} onChange={e => setSettings(s => ({ ...s, address: e.target.value }))} rows={2} style={{ ...inputStyle(), resize: 'vertical' }} onFocus={e => (e.currentTarget.style.borderColor = GOLD)} onBlur={e => (e.currentTarget.style.borderColor = '#D1D5DB')} />
                    </div>
                    <button onClick={handleSaveSettings} style={{ background: NAVY, color: '#fff', border: 'none', borderRadius: 10, padding: '12px', fontSize: 14, fontWeight: 700, cursor: 'pointer', fontFamily: font }}>ذخیره تنظیمات</button>
                  </div>
                </div>

                {/* Supabase */}
                <div style={{ background: '#fff', borderRadius: 14, padding: '24px', boxShadow: '0 2px 12px rgba(32,45,89,0.07)' }}>
                  <h3 style={{ fontSize: 16, fontWeight: 700, color: NAVY, marginBottom: 6 }}>اتصال Supabase</h3>
                  <p style={{ fontSize: 12, color: '#6B7280', marginBottom: 16, lineHeight: 1.7 }}>
                    برای همگام‌سازی داده‌ها روی چند دستگاه، URL و کلید پروژه Supabase را وارد کنید.
                  </p>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                    <div>
                      <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: NAVY, marginBottom: 5, opacity: 0.7 }}>Project URL</label>
                      <input value={settings.supabaseUrl} onChange={e => setSettings(s => ({ ...s, supabaseUrl: e.target.value }))} placeholder="https://xxx.supabase.co" style={inputStyle()} onFocus={e => (e.currentTarget.style.borderColor = GOLD)} onBlur={e => (e.currentTarget.style.borderColor = '#D1D5DB')} />
                    </div>
                    <div>
                      <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: NAVY, marginBottom: 5, opacity: 0.7 }}>Anon Public Key</label>
                      <input value={settings.supabaseKey} onChange={e => setSettings(s => ({ ...s, supabaseKey: e.target.value }))} placeholder="eyJhbGci..." type="password" style={inputStyle()} onFocus={e => (e.currentTarget.style.borderColor = GOLD)} onBlur={e => (e.currentTarget.style.borderColor = '#D1D5DB')} />
                    </div>
                    <button onClick={handleSaveSettings} style={{ background: NAVY, color: '#fff', border: 'none', borderRadius: 10, padding: '10px', fontSize: 13, fontWeight: 700, cursor: 'pointer', fontFamily: font }}>ذخیره کلیدها</button>
                    {supabaseStatus && <p style={{ fontSize: 13, fontWeight: 600, color: supabaseStatus.startsWith('✅') ? '#059669' : '#EF4444', margin: 0 }}>{supabaseStatus}</p>}
                    <div style={{ display: 'flex', gap: 10 }}>
                      <button onClick={handleTestSupabase} disabled={supabaseTesting} style={{ flex: 1, background: '#F0F4FF', color: NAVY, border: 'none', borderRadius: 10, padding: '10px', fontSize: 13, fontWeight: 700, cursor: 'pointer', fontFamily: font }}>
                        {supabaseTesting ? 'در حال تست...' : '🔌 تست اتصال'}
                      </button>
                      <button onClick={handleSyncSupabase} disabled={supabaseSyncing} style={{ flex: 1, background: GOLD, color: NAVY, border: 'none', borderRadius: 10, padding: '10px', fontSize: 13, fontWeight: 700, cursor: 'pointer', fontFamily: font }}>
                        {supabaseSyncing ? 'در حال ارسال...' : '☁ ارسال به Supabase'}
                      </button>
                    </div>
                    <div style={{ background: '#F8F9FC', borderRadius: 10, padding: '14px', fontSize: 12, color: '#6B7280', lineHeight: 1.8 }}>
                      <strong style={{ color: NAVY }}>راهنمای سریع Supabase:</strong><br />
                      ۱. یک پروژه در supabase.com بساز<br />
                      ۲. در SQL Editor جدول safaro_store بساز<br />
                      ۳. URL و کلید را اینجا وارد کن<br />
                      ۴. روی «تست اتصال» کلیک کن<br />
                      ۵. روی «ارسال به Supabase» کلیک کن
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  )
}
