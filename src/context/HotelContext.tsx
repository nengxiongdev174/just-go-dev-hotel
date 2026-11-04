"use client";

import React, { createContext, useContext, useEffect, useState, useSyncExternalStore } from "react";
import { useRouter, usePathname } from "next/navigation";
import {
  initOrCheckSession,
  getStoredRooms,
  saveStoredRooms,
  getStoredBookings,
  saveStoredBookings,
  getStoredGuests,
  saveStoredGuests,
  getStoredCurrency,
  saveStoredCurrency,
  getStoredUser,
  saveStoredUser,
} from "@/lib/storage";
import { CENTRAL_ROOMS, CENTRAL_BOOKINGS, CENTRAL_GUESTS } from "@/data";
import { type Room, type Booking, type Guest, type Currency, type HotelUser, type RoomStatus, type BookingStatus } from "@/types/hotel";

interface HotelState {
  user: HotelUser | null;
  rooms: Room[];
  bookings: Booking[];
  guests: Guest[];
  currency: Currency;
}

const SERVER_SNAPSHOT: HotelState = {
  user: null,
  rooms: CENTRAL_ROOMS,
  bookings: CENTRAL_BOOKINGS,
  guests: CENTRAL_GUESTS,
  currency: "LAK",
};

let clientSnapshot: HotelState = SERVER_SNAPSHOT;
let isClientInitialized = false;
const listeners = new Set<() => void>();

function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

function getClientSnapshot(): HotelState {
  if (typeof window === "undefined") {
    return SERVER_SNAPSHOT;
  }
  if (!isClientInitialized) {
    isClientInitialized = true;
    initOrCheckSession();
    clientSnapshot = {
      user: getStoredUser(),
      rooms: getStoredRooms(),
      bookings: getStoredBookings(),
      guests: getStoredGuests(),
      currency: getStoredCurrency(),
    };
  }
  return clientSnapshot;
}

function updateState(updater: (prev: HotelState) => HotelState) {
  clientSnapshot = updater(getClientSnapshot());
  listeners.forEach((listener) => listener());
}

interface HotelContextType {
  user: HotelUser | null;
  rooms: Room[];
  bookings: Booking[];
  guests: Guest[];
  currency: Currency;
  isMounted: boolean;
  login: (user: HotelUser) => void;
  logout: () => void;
  setCurrency: (curr: Currency) => void;
  updateRoomStatus: (roomId: string, status: RoomStatus, guestName?: string, checkOutDate?: string) => void;
  createBooking: (newBooking: Booking) => void;
  updateBookingStatus: (bookingId: string, status: BookingStatus) => void;
  cancelBooking: (bookingId: string) => void;
  addGuest: (newGuest: Guest) => void;
}

const HotelContext = createContext<HotelContextType | null>(null);

export function HotelProvider({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();

  const state = useSyncExternalStore(
    subscribe,
    getClientSnapshot,
    () => SERVER_SNAPSHOT
  );

  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (isMounted && !state.user && pathname !== "/login") {
      router.replace("/login");
    }
  }, [isMounted, state.user, pathname, router]);

  const login = (newUser: HotelUser) => {
    saveStoredUser(newUser);
    updateState((prev) => ({ ...prev, user: newUser }));
    router.push("/dashboard");
  };

  const logout = () => {
    saveStoredUser(null);
    updateState((prev) => ({ ...prev, user: null }));
    router.push("/login");
  };

  const setCurrency = (curr: Currency) => {
    saveStoredCurrency(curr);
    updateState((prev) => ({ ...prev, currency: curr }));
  };

  const updateRoomStatus = (
    roomId: string,
    status: RoomStatus,
    guestName?: string,
    checkOutDate?: string
  ) => {
    const nextRooms = state.rooms.map((r) => {
      if (r.id === roomId) {
        return {
          ...r,
          status,
          currentGuestName: status === "occupied" ? guestName : undefined,
          checkOutDate: status === "occupied" ? checkOutDate : undefined,
        };
      }
      return r;
    });
    saveStoredRooms(nextRooms);
    updateState((prev) => ({ ...prev, rooms: nextRooms }));
  };

  const createBooking = (newBooking: Booking) => {
    const nextBookings = [newBooking, ...state.bookings];
    saveStoredBookings(nextBookings);

    // Auto mark room as occupied if status is checked_in
    let nextRooms = state.rooms;
    if (newBooking.status === "checked_in") {
      nextRooms = state.rooms.map((r) =>
        r.id === newBooking.roomId
          ? {
              ...r,
              status: "occupied" as RoomStatus,
              currentGuestName: newBooking.guestName,
              checkOutDate: newBooking.checkOutDate,
            }
          : r
      );
      saveStoredRooms(nextRooms);
    }

    updateState((prev) => ({
      ...prev,
      bookings: nextBookings,
      rooms: nextRooms,
    }));
  };

  const updateBookingStatus = (bookingId: string, status: BookingStatus) => {
    const targetBooking = state.bookings.find((b) => b.id === bookingId);
    const nextBookings = state.bookings.map((b) =>
      b.id === bookingId ? { ...b, status } : b
    );
    saveStoredBookings(nextBookings);

    let nextRooms = state.rooms;
    if (targetBooking) {
      if (status === "checked_in") {
        nextRooms = state.rooms.map((r) =>
          r.id === targetBooking.roomId
            ? {
                ...r,
                status: "occupied" as RoomStatus,
                currentGuestName: targetBooking.guestName,
                checkOutDate: targetBooking.checkOutDate,
              }
            : r
        );
      } else if (status === "checked_out") {
        nextRooms = state.rooms.map((r) =>
          r.id === targetBooking.roomId
            ? {
                ...r,
                status: "cleaning" as RoomStatus,
                currentGuestName: undefined,
                checkOutDate: undefined,
              }
            : r
        );
      } else if (status === "cancelled") {
        nextRooms = state.rooms.map((r) =>
          r.id === targetBooking.roomId && r.status === "occupied"
            ? {
                ...r,
                status: "available" as RoomStatus,
                currentGuestName: undefined,
                checkOutDate: undefined,
              }
            : r
        );
      }
      saveStoredRooms(nextRooms);
    }

    updateState((prev) => ({
      ...prev,
      bookings: nextBookings,
      rooms: nextRooms,
    }));
  };

  const cancelBooking = (bookingId: string) => {
    updateBookingStatus(bookingId, "cancelled");
  };

  const addGuest = (newGuest: Guest) => {
    const nextGuests = [newGuest, ...state.guests];
    saveStoredGuests(nextGuests);
    updateState((prev) => ({ ...prev, guests: nextGuests }));
  };

  return (
    <HotelContext.Provider
      value={{
        user: state.user,
        rooms: state.rooms,
        bookings: state.bookings,
        guests: state.guests,
        currency: state.currency,
        isMounted,
        login,
        logout,
        setCurrency,
        updateRoomStatus,
        createBooking,
        updateBookingStatus,
        cancelBooking,
        addGuest,
      }}
    >
      {children}
    </HotelContext.Provider>
  );
}

export function useHotel() {
  const context = useContext(HotelContext);
  if (!context) {
    throw new Error("useHotel must be used within a HotelProvider");
  }
  return context;
}

