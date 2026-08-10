import type { DashboardSummary, Order, Tour } from "./types";
import fallbackData from "./fallback-data.json";

export const API_BASE = process.env.NEXT_PUBLIC_API_URL || "/api";

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const response = await fetch(`${API_BASE}${path}`, {
    ...init,
    headers: {
      "Content-Type": "application/json",
      ...(init?.headers || {}),
    },
  });
  if (!response.ok) {
    const message = await response.text();
    throw new Error(message || `HTTP ${response.status}`);
  }
  return response.json() as Promise<T>;
}

const fallbackTours = fallbackData.tours as Tour[];

async function listTours(): Promise<Tour[]> {
  try {
    return await request<Tour[]>("/tours");
  } catch {
    return fallbackTours;
  }
}

async function getTour(id: number): Promise<Tour> {
  try {
    return await request<Tour>(`/tours/${id}`);
  } catch {
    const tour = fallbackTours.find((item) => Number(item.id) === Number(id));
    if (!tour) throw new Error("Tour not found");
    return tour;
  }
}

export const api = {
  tours: {
    list: listTours,
    one: getTour,
    create: (tour: Partial<Tour>) =>
      request<Tour>("/tours", { method: "POST", body: JSON.stringify(tour) }),
    update: (id: number, tour: Partial<Tour>) =>
      request<Tour>(`/tours/${id}`, { method: "PATCH", body: JSON.stringify(tour) }),
    remove: (id: number) => request<{ ok: true }>(`/tours/${id}`, { method: "DELETE" }),
  },
  orders: {
    list: () => request<Order[]>("/orders"),
    create: (order: Partial<Order>) =>
      request<Order>("/orders", { method: "POST", body: JSON.stringify(order) }),
    updateStatus: (id: number, status: Order["status"]) =>
      request<Order>(`/orders/${id}/status`, { method: "PATCH", body: JSON.stringify({ status }) }),
  },
  dashboard: () => request<DashboardSummary>("/dashboard/summary"),
};
