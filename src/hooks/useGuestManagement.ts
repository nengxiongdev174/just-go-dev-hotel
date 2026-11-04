"use client";

import { useState, useMemo, useCallback } from "react";
import { useHotel } from "@/context/HotelContext";
import { type Guest, type VipTier } from "@/types/hotel";

export function useGuestManagement() {
  const { guests, addGuest, currency } = useHotel();

  const [vipFilter, setVipFilter] = useState<VipTier | "all">("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [isAddOpen, setIsAddOpen] = useState(false);

  const filteredGuests = useMemo(() => {
    return guests.filter((g) => {
      if (vipFilter !== "all" && g.vipTier !== vipFilter) return false;
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesName = g.fullName.toLowerCase().includes(q);
        const matchesEmail = g.email.toLowerCase().includes(q);
        const matchesPhone = g.phone.toLowerCase().includes(q);
        if (!matchesName && !matchesEmail && !matchesPhone) return false;
      }
      return true;
    });
  }, [guests, vipFilter, searchQuery]);

  const handleOpenAdd = useCallback(() => {
    setIsAddOpen(true);
  }, []);

  const handleCloseAdd = useCallback(() => {
    setIsAddOpen(false);
  }, []);

  const handleCreateGuest = useCallback(
    (newGuest: Guest) => {
      addGuest(newGuest);
      setIsAddOpen(false);
    },
    [addGuest]
  );

  return {
    guests: filteredGuests,
    allCount: guests.length,
    vipFilter,
    setVipFilter,
    searchQuery,
    setSearchQuery,
    isAddOpen,
    currency,
    handleOpenAdd,
    handleCloseAdd,
    handleCreateGuest,
  };
}
