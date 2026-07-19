import type { Tour, VisaService, Lead, Order, StaffAccount, AppSettings } from './types'

const KEYS = {
  tours: 'safaro_tours',
  visas: 'safaro_visas',
  leads: 'safaro_leads',
  orders: 'safaro_orders',
  staff: 'safaro_staff',
  settings: 'safaro_settings',
}

function load<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key)
    return raw ? (JSON.parse(raw) as T) : fallback
  } catch {
    return fallback
  }
}

function save<T>(key: string, value: T): void {
  try {
    localStorage.setItem(key, JSON.stringify(value))
  } catch {
    // localStorage full — ignore
  }
}

// ── Tours ──────────────────────────────────────────────

const defaultTours: Tour[] = [
  {
    id: 't1',
    name: 'تور استانبول ویژه نوروز',
    destination: 'ترکیه',
    image: '1524231757912-21f4fe3a7200',
    price: 8500000,
    duration: '۷ شب و ۸ روز',
    airline: 'ماهان ایر',
    hotels: [{ name: 'Grand Istanbul Hotel', stars: 5, price: 8500000, capacity: 20 }],
    dates: ['۱۴۰۴/۰۵/۱۰', '۱۴۰۴/۰۵/۲۴', '۱۴۰۴/۰۶/۰۷'],
    tag: 'پیشنهاد ویژه',
    visible: true,
    specialOffer: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 't2',
    name: 'تور مالدیو لوکس',
    destination: 'مالدیو',
    image: '1573843981267-be1999ff37cd',
    price: 24000000,
    duration: '۵ شب و ۶ روز',
    airline: 'امارات',
    hotels: [{ name: 'Sun Island Resort', stars: 5, price: 24000000, capacity: 10 }],
    dates: ['۱۴۰۴/۰۵/۱۵', '۱۴۰۴/۰۶/۰۱'],
    tag: 'لوکس',
    visible: true,
    specialOffer: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 't3',
    name: 'تور دبی تابستان',
    destination: 'امارات',
    image: '1512453979798-5ea266f8880c',
    price: 12500000,
    duration: '۴ شب و ۵ روز',
    airline: 'فلای دبی',
    hotels: [{ name: 'Marriott Dubai', stars: 4, price: 12500000, capacity: 30 }],
    dates: ['۱۴۰۴/۰۵/۰۱', '۱۴۰۴/۰۵/۱۵', '۱۴۰۴/۰۶/۰۱'],
    tag: 'محبوب',
    visible: true,
    specialOffer: false,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 't4',
    name: 'تور پاریس و لندن',
    destination: 'اروپا',
    image: '1499856871958-5b9627545d1a',
    price: 18500000,
    duration: '۸ شب و ۹ روز',
    airline: 'ترکیش ایرلاینز',
    hotels: [{ name: 'Paris Marriott', stars: 4, price: 18500000, capacity: 15 }],
    dates: ['۱۴۰۴/۰۵/۲۰', '۱۴۰۴/۰۶/۱۰'],
    tag: 'ترکیبی',
    visible: true,
    specialOffer: false,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 't5',
    name: 'تور تفلیس گرجستان',
    destination: 'گرجستان',
    image: '1565008887036-f2da55e3e2a8',
    price: 6200000,
    duration: '۵ شب و ۶ روز',
    airline: 'جورجیان ایرویز',
    hotels: [{ name: 'Biltmore Tbilisi', stars: 5, price: 6200000, capacity: 25 }],
    dates: ['۱۴۰۴/۰۵/۰۵', '۱۴۰۴/۰۵/۱۹', '۱۴۰۴/۰۶/۰۲'],
    tag: undefined,
    visible: true,
    specialOffer: false,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 't6',
    name: 'تور بانکوک تایلند',
    destination: 'تایلند',
    image: '1506905925346-21bda4d32df4',
    price: 9800000,
    duration: '۶ شب و ۷ روز',
    airline: 'تای ایرلاینز',
    hotels: [{ name: 'Bangkok Palace Hotel', stars: 4, price: 9800000, capacity: 20 }],
    dates: ['۱۴۰۴/۰۵/۱۲', '۱۴۰۴/۰۶/۰۵'],
    tag: undefined,
    visible: true,
    specialOffer: false,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
]

export function getTours(): Tour[] {
  return load<Tour[]>(KEYS.tours, defaultTours)
}

export function saveTours(tours: Tour[]): void {
  save(KEYS.tours, tours)
}

export function addTour(tour: Tour): void {
  const tours = getTours()
  saveTours([...tours, tour])
}

export function updateTour(id: string, updates: Partial<Tour>): void {
  const tours = getTours()
  saveTours(tours.map(t => (t.id === id ? { ...t, ...updates, updatedAt: new Date().toISOString() } : t)))
}

export function deleteTour(id: string): void {
  saveTours(getTours().filter(t => t.id !== id))
}

// ── Visas ──────────────────────────────────────────────

const defaultVisas: VisaService[] = [
  { id: 'v1', country: 'شینگن اروپا', flag: '🇪🇺', processingTime: '۱۵–۲۱ روز کاری', price: 'از ۴,۵۰۰,۰۰۰ تومان', visible: true },
  { id: 'v2', country: 'انگلستان', flag: '🇬🇧', processingTime: '۱۰–۱۵ روز کاری', price: 'از ۶,۸۰۰,۰۰۰ تومان', visible: true },
  { id: 'v3', country: 'امارات', flag: '🇦🇪', processingTime: '۳–۵ روز کاری', price: 'از ۱,۲۰۰,۰۰۰ تومان', visible: true },
  { id: 'v4', country: 'ترکیه', flag: '🇹🇷', processingTime: 'آنی آنلاین', price: 'رایگان', visible: true },
  { id: 'v5', country: 'آمریکا', flag: '🇺🇸', processingTime: '۳–۶ ماه', price: 'از ۱۲,۰۰۰,۰۰۰ تومان', visible: true },
  { id: 'v6', country: 'کانادا', flag: '🇨🇦', processingTime: '۳–۶ ماه', price: 'از ۱۰,۵۰۰,۰۰۰ تومان', visible: true },
]

export function getVisas(): VisaService[] {
  return load<VisaService[]>(KEYS.visas, defaultVisas)
}

export function saveVisas(visas: VisaService[]): void {
  save(KEYS.visas, visas)
}

// ── Leads ──────────────────────────────────────────────

export function getLeads(): Lead[] {
  return load<Lead[]>(KEYS.leads, [])
}

export function addLead(lead: Omit<Lead, 'id' | 'timestamp' | 'status' | 'note'>): void {
  const leads = getLeads()
  const newLead: Lead = {
    ...lead,
    id: `lead_${Date.now()}`,
    timestamp: new Date().toISOString(),
    status: 'new',
    note: '',
  }
  save(KEYS.leads, [newLead, ...leads])
}

export function updateLead(id: string, updates: Partial<Lead>): void {
  save(KEYS.leads, getLeads().map(l => (l.id === id ? { ...l, ...updates } : l)))
}

export function deleteLead(id: string): void {
  save(KEYS.leads, getLeads().filter(l => l.id !== id))
}

// ── Orders ─────────────────────────────────────────────

export function getOrders(): Order[] {
  return load<Order[]>(KEYS.orders, [])
}

export function addOrder(order: Omit<Order, 'id' | 'createdAt' | 'status'>): void {
  const orders = getOrders()
  const newOrder: Order = {
    ...order,
    id: `order_${Date.now()}`,
    status: 'pending',
    createdAt: new Date().toISOString(),
  }
  save(KEYS.orders, [newOrder, ...orders])
}

export function updateOrder(id: string, updates: Partial<Order>): void {
  save(KEYS.orders, getOrders().map(o => (o.id === id ? { ...o, ...updates } : o)))
}

// ── Staff Accounts ─────────────────────────────────────

const defaultStaff: StaffAccount[] = [
  { username: 'staff', password: 'staff123', name: 'کارشناس فروش', role: 'staff' },
  { username: 'admin', password: 'admin123', name: 'مدیریت', role: 'admin' },
]

export function getStaffAccounts(): StaffAccount[] {
  return load<StaffAccount[]>(KEYS.staff, defaultStaff)
}

export function verifyLogin(password: string): StaffAccount | null {
  const accounts = getStaffAccounts()
  return accounts.find(a => a.password === password) ?? null
}

// ── Settings ───────────────────────────────────────────

const defaultSettings: AppSettings = {
  agencyName: 'آژانس مسافرتی سفرو',
  phone: '۰۲۱-۴۹۹۷۶',
  email: 'info@safaroiranian.com',
  address: 'تهران، بلوار فردوس شرق، بعد از عقیل، پلاک ۳۵۱، طبقه ۱',
  supabaseUrl: '',
  supabaseKey: '',
}

export function getSettings(): AppSettings {
  return load<AppSettings>(KEYS.settings, defaultSettings)
}

export function saveSettings(settings: AppSettings): void {
  save(KEYS.settings, settings)
}

// ── Format helpers ─────────────────────────────────────

export function formatPrice(price: number): string {
  return price.toLocaleString('fa-IR')
}
