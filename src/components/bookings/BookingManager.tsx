"use client";

import React from "react";
import { Search, Plus } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useBookingManagement } from "@/hooks/useBookingManagement";
import { BookingTable } from "./BookingTable";
import { BookingDetailModal } from "./BookingDetailModal";
import { CreateBookingModal } from "./CreateBookingModal";
import { useLanguage } from "@/context/LanguageContext";
import { type BookingStatus } from "@/types/hotel";

export function BookingManager() {
  const {
    bookings,
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
  } = useBookingManagement();

  const { dictionary } = useLanguage();

  const filterTabs: Array<{ label: string; value: BookingStatus | "all" }> = [
    { label: dictionary.common.filterAll, value: "all" },
    { label: dictionary.common.confirmed, value: "confirmed" },
    { label: dictionary.common.checkedIn, value: "checked_in" },
    { label: dictionary.common.checkedOut, value: "checked_out" },
    { label: dictionary.common.cancelled, value: "cancelled" },
  ];

  return (
    <div className="space-y-6">
      {/* Filter Bar */}
      <div className="p-4 rounded-2xl bg-card border border-border shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center justify-between">
          <div className="relative flex-1 max-w-md">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder={dictionary.common.searchPlaceholder}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 h-9 text-xs"
            />
          </div>

          <Button
            size="sm"
            onClick={handleOpenCreate}
            className="gap-1.5 text-xs h-9 shadow-xs shrink-0"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>{dictionary.bookings.createBooking}</span>
          </Button>
        </div>

          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
            {filterTabs.map((tab) => (
              <button
                key={tab.value}
                onClick={() => setStatusFilter(tab.value)}
                className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all shrink-0 ${
                  statusFilter === tab.value
                    ? "bg-primary text-primary-foreground shadow-xs font-semibold"
                    : "bg-muted/70 text-muted-foreground hover:bg-muted hover:text-foreground"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

      {/* Booking Table */}
      <BookingTable
        bookings={bookings}
        currency={currency}
        onOpenDetails={handleOpenDetails}
        onOpenCreate={handleOpenCreate}
      />

      {/* Booking Detail Modal */}
      {activeBooking && (
        <BookingDetailModal
          booking={activeBooking}
          currency={currency}
          onClose={handleCloseDetails}
          onUpdateStatus={updateBookingStatus}
          onCancelBooking={cancelBooking}
        />
      )}

      {/* Create Booking Modal */}
      {isCreateOpen && (
        <CreateBookingModal
          isOpen={isCreateOpen}
          availableRooms={availableRooms}
          currency={currency}
          onClose={handleCloseCreate}
          onCreateBooking={handleCreateBooking}
        />
      )}
    </div>
  );
}
