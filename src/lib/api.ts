const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

export async function apiGet<T>(path: string): Promise<T> {
  const res = await fetch(`${API_URL}${path}`, {
    headers: { "Content-Type": "application/json" },
  });
  if (!res.ok) throw new Error(`GET ${path} failed: ${res.status}`);
  return res.json();
}

export async function apiPost<T>(path: string, body: unknown): Promise<T> {
  const res = await fetch(`${API_URL}${path}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  if (!res.ok) throw new Error(`POST ${path} failed: ${res.status}`);
  return res.json();
}

export type Destination = {
  _id: string;
  name: string;
  category: "historical" | "nature" | "adventure" | "cuisine";
  location: string;
  rating: number;
  duration?: string;
  price?: string;
  imageUrl?: string;
  description?: string;
  highlights?: string[];
};

export type ItineraryDay = {
  day: number;
  title: string;
  activities: string[];
  meals: string[];
  accommodation?: string;
};

export type Trip = {
  _id?: string;
  title: string;
  destination: string;
  startDate?: string;
  endDate?: string;
  travelers?: string;
  budget?: string;
  interests?: string[];
  itinerary?: ItineraryDay[];
};


