const API_BASE = '/api';

export interface BookingPayload {
  name: string;
  email: string;
  phone?: string;
  eventType: string;
  eventDate: string;
  venueCity: string;
  guestCount: number;
  budgetRange?: string;
  specialRequests?: string;
}

export interface ReviewItem {
  _id?: string;
  clientName: string;
  eventCategory: string;
  quote: string;
  rating: number;
  verifiedBadge: boolean;
  createdAt?: string;
}

export async function fetchAvailability(month?: string) {
  const url = month ? `${API_BASE}/availability?month=${month}` : `${API_BASE}/availability`;
  const res = await fetch(url);
  if (!res.ok) throw new Error('Failed to fetch availability calendar.');
  return await res.json();
}

export async function submitBooking(payload: BookingPayload) {
  const res = await fetch(`${API_BASE}/bookings`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  });
  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.message || 'Failed to seal booking inquiry.');
  }
  return data;
}

export async function fetchReviews() {
  const res = await fetch(`${API_BASE}/reviews`);
  if (!res.ok) throw new Error('Failed to fetch client reviews.');
  return await res.json();
}

export async function submitReview(payload: { clientName: string; eventCategory: string; quote: string; rating?: number }) {
  const res = await fetch(`${API_BASE}/reviews`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || 'Failed to submit review.');
  return data;
}

export async function adminLogin(credentials: { username: string; password: string }) {
  const res = await fetch(`${API_BASE}/admin/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(credentials)
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || 'Authentication rejected.');
  return data;
}

export async function fetchAdminBookings(token: string) {
  const res = await fetch(`${API_BASE}/admin/bookings`, {
    headers: { 'Authorization': `Bearer ${token}` }
  });
  if (!res.ok) throw new Error('Failed to fetch sanctum bookings.');
  return await res.json();
}

export async function updateAdminBooking(token: string, id: string, updates: Record<string, unknown>) {
  const res = await fetch(`${API_BASE}/admin/bookings/${id}`, {
    method: 'PATCH',
    headers: { 
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}` 
    },
    body: JSON.stringify(updates)
  });
  if (!res.ok) throw new Error('Failed to update booking status.');
  return await res.json();
}

export async function fetchAdminSettings(token: string) {
  const res = await fetch(`${API_BASE}/admin/settings`, {
    headers: { 'Authorization': `Bearer ${token}` }
  });
  if (!res.ok) throw new Error('Failed to fetch sanctum settings.');
  return await res.json();
}

export async function updateAdminSettings(token: string, updates: Record<string, unknown>) {
  const res = await fetch(`${API_BASE}/admin/settings`, {
    method: 'PATCH',
    headers: { 
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}` 
    },
    body: JSON.stringify(updates)
  });
  if (!res.ok) throw new Error('Failed to update sanctum settings.');
  return await res.json();
}
