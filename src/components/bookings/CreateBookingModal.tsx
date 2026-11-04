"use client";

import React, { useState } from "react";
import { X, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { formatCurrency, getRoomPrice } from "@/lib/formatters";
import { type CreateBookingModalProps } from "@/types/booking";
import { type Booking } from "@/types/hotel";
import { useLanguage } from "@/context/LanguageContext";

export function CreateBookingModal({
  isOpen,
  availableRooms,
  currency,
  onClose,
  onCreateBooking,
}: CreateBookingModalProps) {
  const { dictionary } = useLanguage();

  const [guestName, setGuestName] = useState("");
  const [guestEmail, setGuestEmail] = useState("");
  const [guestPhone, setGuestPhone] = useState("");
  const [selectedRoomId, setSelectedRoomId] = useState(
    availableRooms[0]?.id || ""
  );
  const [checkIn, setCheckIn] = useState("2026-11-01");
  const [checkOut, setCheckOut] = useState("2026-11-03");

  React.useEffect(() => {
    if (typeof window !== "undefined") {
      const now = new Date();
      const tmrw = new Date();
      tmrw.setDate(tmrw.getDate() + 1);
      setCheckIn(now.toISOString().split("T")[0]);
      setCheckOut(tmrw.toISOString().split("T")[0]);
    }
  }, []);

  if (!isOpen) return null;

  const selectedRoom = availableRooms.find((r) => r.id === selectedRoomId);
  const nights = Math.max(
    1,
    Math.round(
      (new Date(checkOut).getTime() - new Date(checkIn).getTime()) /
        (1000 * 60 * 60 * 24)
    )
  );
  const roomPrice = selectedRoom ? getRoomPrice(selectedRoom, currency) : 0;
  const totalAmount = roomPrice * nights;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!guestName.trim() || !selectedRoom) return;

    const newBooking: Booking = {
      id: `bk-${Date.now()}`,
      bookingRef: `JG-${Math.floor(1000 + Math.random() * 9000)}`,
      guestName: guestName.trim(),
      guestEmail: guestEmail.trim() || "guest@example.com",
      guestPhone: guestPhone.trim() || "+856 20 5555 1234",
      roomId: selectedRoom.id,
      roomNumber: selectedRoom.roomNumber,
      roomType: selectedRoom.type,
      checkInDate: checkIn,
      checkOutDate: checkOut,
      nights,
      totalPrice: totalAmount,
      currency,
      status: "confirmed",
      paymentStatus: "paid",
      createdAt: new Date().toISOString(),
    };

    onCreateBooking(newBooking);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="w-full max-w-lg bg-card rounded-2xl border border-border shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="p-5 border-b border-border/70 flex items-center justify-between bg-muted/20">
          <div>
            <h2 className="text-lg font-bold text-foreground">
              {dictionary.bookings.createBooking}
            </h2>
            <p className="text-xs text-muted-foreground">
              {dictionary.bookings.reserveSubtitle}
            </p>
          </div>
          <Button variant="ghost" size="icon-xs" onClick={onClose}>
            <X className="w-4 h-4" />
          </Button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4 overflow-y-auto">
          {/* Guest Name */}
          <div className="space-y-1">
            <label className="text-xs font-semibold text-foreground">
              {dictionary.bookings.guestFullNameRequired}
            </label>
            <Input
              required
              placeholder={dictionary.bookings.guestNamePlaceholder}
              value={guestName}
              onChange={(e) => setGuestName(e.target.value)}
              className="h-9 text-xs"
            />
          </div>

          {/* Email & Phone */}
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="text-xs font-semibold text-foreground">
                {dictionary.common.emailAddress}
              </label>
              <Input
                type="email"
                placeholder="guest@mail.com"
                value={guestEmail}
                onChange={(e) => setGuestEmail(e.target.value)}
                className="h-9 text-xs"
              />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-semibold text-foreground">
                {dictionary.common.phoneNumber}
              </label>
              <Input
                placeholder="+856 20 ..."
                value={guestPhone}
                onChange={(e) => setGuestPhone(e.target.value)}
                className="h-9 text-xs"
              />
            </div>
          </div>

          {/* Select Available Room */}
          <div className="space-y-1">
            <label className="text-xs font-semibold text-foreground">
              {dictionary.bookings.selectRoomRequired}
            </label>
            {availableRooms.length === 0 ? (
              <p className="text-xs text-destructive">
                {dictionary.bookings.noRoomsAvailable}
              </p>
            ) : (
              <select
                value={selectedRoomId}
                onChange={(e) => setSelectedRoomId(e.target.value)}
                className="flex h-9 w-full rounded-lg border border-input bg-background px-3 py-1 text-xs shadow-xs focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              >
                {availableRooms.map((r) => (
                  <option key={r.id} value={r.id}>
                    {dictionary.common.room} #{r.roomNumber} - {r.type.toUpperCase()} ({dictionary.common.floor} {r.floor}) •{" "}
                    {formatCurrency(getRoomPrice(r, currency), currency)} {dictionary.rooms.perNight}
                  </option>
                ))}
              </select>
            )}
          </div>

          {/* Dates */}
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="text-xs font-semibold text-foreground">
                {dictionary.bookings.checkInDate}
              </label>
              <Input
                type="date"
                value={checkIn}
                onChange={(e) => setCheckIn(e.target.value)}
                className="h-9 text-xs"
              />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-semibold text-foreground">
                {dictionary.bookings.checkOutDate}
              </label>
              <Input
                type="date"
                value={checkOut}
                onChange={(e) => setCheckOut(e.target.value)}
                className="h-9 text-xs"
              />
            </div>
          </div>

          {/* Rate Summary */}
          {selectedRoom && (
            <div className="p-4 rounded-xl bg-muted/40 border border-border flex items-center justify-between">
              <div>
                <span className="text-xs text-muted-foreground">{dictionary.bookings.estimatedTotal}</span>
                <span className="block text-xs font-medium text-foreground">
                  {nights} {dictionary.common.nights} x {formatCurrency(roomPrice, currency)}
                </span>
              </div>
              <span className="text-base font-bold text-primary">
                {formatCurrency(totalAmount, currency)}
              </span>
            </div>
          )}

          {/* Buttons */}
          <div className="pt-3 border-t border-border flex justify-end gap-2">
            <Button type="button" variant="outline" size="sm" onClick={onClose} className="text-xs">
              {dictionary.common.cancel}
            </Button>
            <Button
              type="submit"
              size="sm"
              disabled={availableRooms.length === 0}
              className="text-xs gap-1.5"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>{dictionary.bookings.confirmReservation}</span>
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
