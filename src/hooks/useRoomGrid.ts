"use client";

import { useState, useMemo, useCallback } from "react";
import { useHotel } from "@/context/HotelContext";
import { type Room, type RoomStatus } from "@/types/hotel";

export function useRoomGrid() {
  const { rooms, updateRoomStatus, currency } = useHotel();

  const [selectedFloor, setSelectedFloor] = useState<number | "all">("all");
  const [selectedStatus, setSelectedStatus] = useState<RoomStatus | "all">("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedRoomId, setSelectedRoomId] = useState<string | null>(null);

  const floors = useMemo(() => {
    const set = new Set<number>();
    rooms.forEach((r) => set.add(r.floor));
    return Array.from(set).sort((a, b) => a - b);
  }, [rooms]);

  const filteredRooms = useMemo(() => {
    return rooms.filter((room) => {
      if (selectedFloor !== "all" && room.floor !== selectedFloor) return false;
      if (selectedStatus !== "all" && room.status !== selectedStatus) return false;
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesRoom = room.roomNumber.toLowerCase().includes(q);
        const matchesGuest = room.currentGuestName?.toLowerCase().includes(q);
        const matchesType = room.type.toLowerCase().includes(q);
        if (!matchesRoom && !matchesGuest && !matchesType) return false;
      }
      return true;
    });
  }, [rooms, selectedFloor, selectedStatus, searchQuery]);

  const activeRoom = useMemo(() => {
    if (!selectedRoomId) return null;
    return rooms.find((r) => r.id === selectedRoomId) || null;
  }, [rooms, selectedRoomId]);

  const handleSelectRoom = useCallback((room: Room) => {
    setSelectedRoomId(room.id);
  }, []);

  const handleCloseDetail = useCallback(() => {
    setSelectedRoomId(null);
  }, []);

  const handleUpdateStatus = useCallback(
    (roomId: string, status: RoomStatus) => {
      updateRoomStatus(roomId, status);
    },
    [updateRoomStatus]
  );

  const handleQuickCheckIn = useCallback(
    (roomId: string, guestName: string) => {
      updateRoomStatus(roomId, "occupied", guestName);
    },
    [updateRoomStatus]
  );

  const handleQuickCheckOut = useCallback(
    (roomId: string) => {
      updateRoomStatus(roomId, "cleaning");
    },
    [updateRoomStatus]
  );

  return {
    rooms: filteredRooms,
    allRoomsCount: rooms.length,
    floors,
    selectedFloor,
    setSelectedFloor,
    selectedStatus,
    setSelectedStatus,
    searchQuery,
    setSearchQuery,
    activeRoom,
    isDetailOpen: Boolean(activeRoom),
    handleSelectRoom,
    handleCloseDetail,
    handleUpdateStatus,
    handleQuickCheckIn,
    handleQuickCheckOut,
    currency,
  };
}
