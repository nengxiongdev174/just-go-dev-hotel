import { CENTRAL_ROOMS, CENTRAL_BOOKINGS, CENTRAL_GUESTS } from "@/data";
import { type Room, type Booking, type Guest, type Currency, type HotelUser } from "@/types/hotel";

export const TTL_DURATION_MS = 3 * 60 * 60 * 1000; // 3 Hours

const KEYS = {
  SESSION_START: "nx_hotel_session_created_at",
  ROOMS: "nx_hotel_rooms",
  BOOKINGS: "nx_hotel_bookings",
  GUESTS: "nx_hotel_guests",
  CURRENCY: "nx_hotel_currency",
  USER: "nx_hotel_user",
};

export function initOrCheckSession(): { expired: boolean; remainingMs: number } {
  if (typeof window === "undefined") {
    return { expired: false, remainingMs: TTL_DURATION_MS };
  }

  const now = Date.now();
  const rawStart = localStorage.getItem(KEYS.SESSION_START);

  if (!rawStart) {
    resetToDefaultData();
    return { expired: false, remainingMs: TTL_DURATION_MS };
  }

  const startTime = parseInt(rawStart, 10);
  const elapsed = now - startTime;

  if (isNaN(startTime) || elapsed >= TTL_DURATION_MS || elapsed < 0) {
    resetToDefaultData();
    return { expired: true, remainingMs: TTL_DURATION_MS };
  }

  return { expired: false, remainingMs: TTL_DURATION_MS - elapsed };
}

export function resetToDefaultData(): void {
  if (typeof window === "undefined") return;

  const now = Date.now();
  try {
    localStorage.setItem(KEYS.SESSION_START, now.toString());
    localStorage.setItem(KEYS.ROOMS, JSON.stringify(CENTRAL_ROOMS));
    localStorage.setItem(KEYS.BOOKINGS, JSON.stringify(CENTRAL_BOOKINGS));
    localStorage.setItem(KEYS.GUESTS, JSON.stringify(CENTRAL_GUESTS));
    localStorage.setItem(KEYS.CURRENCY, "LAK");

    const existingUser = localStorage.getItem(KEYS.USER);
    if (!existingUser) {
      const defaultUser: HotelUser = {
        id: "u-1",
        name: "Nengxiong",
        role: "manager",
        avatar: "NX",
      };
      localStorage.setItem(KEYS.USER, JSON.stringify(defaultUser));
    }
  } catch (err) {
    console.error("Failed to write to localStorage:", err);
  }
}

export function getStoredRooms(): Room[] {
  if (typeof window === "undefined") return CENTRAL_ROOMS;
  try {
    const raw = localStorage.getItem(KEYS.ROOMS);
    if (raw) return JSON.parse(raw);
  } catch {}
  return CENTRAL_ROOMS;
}

export function saveStoredRooms(rooms: Room[]): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(KEYS.ROOMS, JSON.stringify(rooms));
  } catch {}
}

export function getStoredBookings(): Booking[] {
  if (typeof window === "undefined") return CENTRAL_BOOKINGS;
  try {
    const raw = localStorage.getItem(KEYS.BOOKINGS);
    if (raw) return JSON.parse(raw);
  } catch {}
  return CENTRAL_BOOKINGS;
}

export function saveStoredBookings(bookings: Booking[]): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(KEYS.BOOKINGS, JSON.stringify(bookings));
  } catch {}
}

export function getStoredGuests(): Guest[] {
  if (typeof window === "undefined") return CENTRAL_GUESTS;
  try {
    const raw = localStorage.getItem(KEYS.GUESTS);
    if (raw) return JSON.parse(raw);
  } catch {}
  return CENTRAL_GUESTS;
}

export function saveStoredGuests(guests: Guest[]): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(KEYS.GUESTS, JSON.stringify(guests));
  } catch {}
}

export function getStoredCurrency(): Currency {
  if (typeof window === "undefined") return "LAK";
  try {
    const raw = localStorage.getItem(KEYS.CURRENCY);
    if (raw === "LAK" || raw === "THB" || raw === "USD") return raw;
  } catch {}
  return "LAK";
}

export function saveStoredCurrency(curr: Currency): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(KEYS.CURRENCY, curr);
  } catch {}
}

export function getStoredUser(): HotelUser | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(KEYS.USER);
    if (raw) return JSON.parse(raw);
  } catch {}
  return null;
}

export function saveStoredUser(user: HotelUser | null): void {
  if (typeof window === "undefined") return;
  try {
    if (user) {
      localStorage.setItem(KEYS.USER, JSON.stringify(user));
    } else {
      localStorage.removeItem(KEYS.USER);
    }
  } catch {}
}

