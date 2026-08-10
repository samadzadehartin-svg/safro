export type Hotel = {
  name: string;
  star?: number;
  price?: number;
  dblPrice?: number;
  sglPrice?: number;
  capacity?: number;
  meal?: string;
  board?: string;
  showInBuyer?: boolean;
  photos?: string[];
};

export type Tour = {
  id: number;
  title: string;
  dest: string;
  destination?: string;
  origin?: string;
  duration: string;
  airline: string;
  returnAirline?: string;
  flightTime?: string;
  returnFlightTime?: string;
  price: number;
  oldPrice?: number;
  newPrice?: number;
  priceCurrency?: string;
  label?: string;
  type: "international" | "domestic" | string;
  level?: string;
  rating?: number;
  status: "active" | "inactive" | string;
  lastMinute?: boolean;
  dealPercent?: number;
  dealEndsAt?: string;
  img?: string;
  gallery?: string[];
  dates?: string[];
  hotels?: Hotel[];
  desc?: string;
  includes?: string[];
  excludes?: string[];
  itinerary?: string[];
  docs?: string[];
  cancellation?: string;
  childPolicy?: string;
};

export type Order = {
  id: number;
  tourId: number;
  tourTitle: string;
  fullName: string;
  phone: string;
  passengers: number;
  date?: string;
  hotel?: string;
  roomType?: "double" | "single";
  totalPrice: number;
  status: "new" | "contacted" | "confirmed" | "cancelled";
  createdAt: string;
};

export type DashboardSummary = {
  tours: number;
  activeTours: number;
  orders: number;
  newOrders: number;
  revenue: number;
};
