"use client";

import React from "react";
import { Search, Filter, Layers } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useRoomGrid } from "@/hooks/useRoomGrid";
import { RoomCard } from "./RoomCard";
import { RoomDetailModal } from "./RoomDetailModal";
import { useLanguage } from "@/context/LanguageContext";
import { type RoomStatus } from "@/types/hotel";

export function RoomManager() {
  const {
    rooms,
    allRoomsCount,
    floors,
    selectedFloor,
    setSelectedFloor,
    selectedStatus,
    setSelectedStatus,
    searchQuery,
    setSearchQuery,
    activeRoom,
    isDetailOpen,
    handleSelectRoom,
    handleCloseDetail,
    handleUpdateStatus,
    handleQuickCheckIn,
    handleQuickCheckOut,
    currency,
  } = useRoomGrid();

  const { dictionary } = useLanguage();

  const statusFilters: Array<{ label: string; value: RoomStatus | "all" }> = [
    { label: dictionary.common.filterAll, value: "all" },
    { label: dictionary.common.available, value: "available" },
    { label: dictionary.common.occupied, value: "occupied" },
    { label: dictionary.common.cleaning, value: "cleaning" },
    { label: dictionary.common.maintenance, value: "maintenance" },
  ];

  return (
    <div className="space-y-6">
      {/* Filter & Search Bar */}
      <div className="p-4 rounded-2xl bg-card border border-border shadow-xs space-y-4">
        <div className="flex flex-col md:flex-row gap-3 items-stretch md:items-center justify-between">
          {/* Search Input */}
          <div className="relative flex-1 max-w-md">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder={dictionary.common.searchPlaceholder || "Search room #, guest name, type..."}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 h-9 text-xs"
            />
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs px-3 py-1.5 rounded-lg bg-muted/60 border border-border text-foreground font-semibold shadow-xs">
              {rooms.length} / {allRoomsCount} {dictionary.common.room}
            </span>
          </div>
        </div>

          {/* Floor Filters */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 md:pb-0">
            <span className="text-xs font-semibold text-muted-foreground flex items-center gap-1 mr-1">
              <Layers className="w-3.5 h-3.5" />
              {dictionary.common.floor}:
            </span>
            <Button
              variant={selectedFloor === "all" ? "default" : "outline"}
              size="xs"
              onClick={() => setSelectedFloor("all")}
              className="h-7 text-xs"
            >
              {dictionary.common.filterAll}
            </Button>
            {floors.map((fl) => (
              <Button
                key={fl}
                variant={selectedFloor === fl ? "default" : "outline"}
                size="xs"
                onClick={() => setSelectedFloor(fl)}
                className="h-7 text-xs"
              >
                {dictionary.common.floor} {fl}
              </Button>
            ))}
          </div>

        {/* Status Filters */}
        <div className="flex items-center gap-1.5 overflow-x-auto pt-1 border-t border-border/60">
          <span className="text-xs font-semibold text-muted-foreground flex items-center gap-1 mr-1 shrink-0">
            <Filter className="w-3.5 h-3.5" />
            {dictionary.common.status}:
          </span>
          {statusFilters.map((s) => (
            <button
              key={s.value}
              onClick={() => setSelectedStatus(s.value)}
              className={`px-3 py-1 rounded-full text-xs font-medium transition-all shrink-0 ${
                selectedStatus === s.value
                  ? "bg-primary text-primary-foreground shadow-xs font-semibold"
                  : "bg-muted/70 text-muted-foreground hover:bg-muted hover:text-foreground"
              }`}
            >
              {s.label}
            </button>
          ))}
        </div>
      </div>

      {/* Room Cards Grid */}
      {rooms.length === 0 ? (
        <div className="p-12 text-center bg-card rounded-2xl border border-dashed border-border">
          <p className="text-muted-foreground text-sm font-medium">
            {dictionary.rooms.noRoomsMatching}
          </p>
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              setSelectedFloor("all");
              setSelectedStatus("all");
              setSearchQuery("");
            }}
            className="mt-3 text-xs"
          >
            {dictionary.common.clearFilters}
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {rooms.map((room) => (
            <RoomCard
              key={room.id}
              room={room}
              currency={currency}
              onClick={() => handleSelectRoom(room)}
            />
          ))}
        </div>
      )}

      {/* Detail / Action Modal */}
      {isDetailOpen && (
        <RoomDetailModal
          room={activeRoom}
          currency={currency}
          onClose={handleCloseDetail}
          onUpdateStatus={handleUpdateStatus}
          onQuickCheckIn={handleQuickCheckIn}
          onQuickCheckOut={handleQuickCheckOut}
        />
      )}
    </div>
  );
}

