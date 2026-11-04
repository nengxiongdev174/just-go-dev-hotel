"use client";

import { useState, useMemo, useCallback } from "react";
import { useHotel } from "@/context/HotelContext";
import { type Booking, type BookingStatus } from "@/types/hotel";

export function useBookingManagement() {
  const {
    bookings,
    rooms,
    currency,
    createBooking,
    updateBookingStatus,
    cancelBooking,
  } = useHotel();

  const [statusFilter, setStatusFilter] = useState<BookingStatus | "all">("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedBookingId, setSelectedBookingId] = useState<string | null>(null);
  const [isCreateOpen, setIsCreateOpen] = useState(false);

  const availableRooms = useMemo(() => {
    return rooms.filter((r) => r.status === "available");
  }, [rooms]);

  const filteredBookings = useMemo(() => {
    return bookings.filter((b) => {
      if (statusFilter !== "all" && b.status !== statusFilter) return false;
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesGuest = b.guestName.toLowerCase().includes(q);
        const matchesRoom = b.roomNumber.toLowerCase().includes(q);
        const matchesId = b.id.toLowerCase().includes(q);
        if (!matchesGuest && !matchesRoom && !matchesId) return false;
      }
      return true;
    });
  }, [bookings, statusFilter, searchQuery]);

  const activeBooking = useMemo(() => {
    if (!selectedBookingId) return null;
    return bookings.find((b) => b.id === selectedBookingId) || null;
  }, [bookings, selectedBookingId]);

  const handleOpenDetails = useCallback((booking: Booking) => {
    setSelectedBookingId(booking.id);
  }, []);

  const handleCloseDetails = useCallback(() => {
    setSelectedBookingId(null);
  }, []);

  const handleOpenCreate = useCallback(() => {
    setIsCreateOpen(true);
  }, []);

  const handleCloseCreate = useCallback(() => {
    setIsCreateOpen(false);
  }, []);

  const handleCreateBooking = useCallback(
    (newBooking: Booking) => {
      createBooking(newBooking);
      setIsCreateOpen(false);
    },
    [createBooking]
  );

  return {
    bookings: filteredBookings,
    allCount: bookings.length,
    statusFilter,
    setStatusFilter,
    searchQuery,
    setSearchQuery,
    activeBooking,
    isCreateOpen,
    availableRooms,
    currency,
    handleOpenDetails,
    handleCloseDetails,
    handleOpenCreate,
    handleCloseCreate,
    handleCreateBooking,
    updateBookingStatus,
    cancelBooking,
  };
}

