"use client";

import React from "react";
import { X, Calendar, User, CheckCircle2, LogOut, Ban, Lock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { formatCurrency, convertCurrency, formatDate } from "@/lib/formatters";
import { type BookingDetailModalProps } from "@/types/booking";
import { useLanguage } from "@/context/LanguageContext";
import { useHotel } from "@/context/HotelContext";

export function BookingDetailModal({
  booking,
  currency,
  onClose,
  onUpdateStatus,
  onCancelBooking,
}: BookingDetailModalProps) {
  const { dictionary } = useLanguage();
  const { user } = useHotel();

  if (!booking) return null;

  const isManager = user?.role === "manager";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="w-full max-w-lg bg-card rounded-2xl border border-border shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Modal Header */}
        <div className="p-5 border-b border-border/70 flex items-center justify-between bg-muted/20">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center font-bold text-base">
              #{booking.roomNumber}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-bold text-foreground">
                  Ref: {booking.bookingRef}
                </h2>
                <Badge variant="outline" className="text-[10px]">
                  {booking.status}
                </Badge>
              </div>
              <p className="text-xs text-muted-foreground">
                {dictionary.bookings.reservedOn}: {formatDate(booking.createdAt)}
              </p>
            </div>
          </div>
          <Button variant="ghost" size="icon-xs" onClick={onClose}>
            <X className="w-4 h-4" />
          </Button>
        </div>

        {/* Modal Content */}
        <div className="p-6 space-y-5 overflow-y-auto">
          {/* Guest Card */}
          <div className="p-4 rounded-xl bg-muted/30 border border-border/60 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold text-sm">
                <User className="w-5 h-5" />
              </div>
              <div>
                <p className="font-bold text-sm text-foreground">
                  {booking.guestName}
                </p>
                <p className="text-xs text-muted-foreground">
                  {booking.guestEmail} • {booking.guestPhone}
                </p>
              </div>
            </div>
            <span className="text-xs font-semibold px-2.5 py-1 rounded-md bg-muted text-foreground capitalize">
              {booking.roomType}
            </span>
          </div>

          {/* Stay Dates & Nights */}
          <div className="grid grid-cols-2 gap-3 p-4 rounded-xl bg-card border border-border shadow-xs">
            <div>
              <span className="text-[11px] text-muted-foreground font-medium flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5" />
                {dictionary.common.checkIn}
              </span>
              <span className="font-bold text-sm text-foreground mt-1 block">
                {formatDate(booking.checkInDate)}
              </span>
            </div>
            <div>
              <span className="text-[11px] text-muted-foreground font-medium flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5" />
                {dictionary.common.checkOut}
              </span>
              <span className="font-bold text-sm text-foreground mt-1 block">
                {formatDate(booking.checkOutDate)}
              </span>
            </div>
          </div>

          {/* Billing & Folio Total */}
          <div className="p-4 rounded-xl bg-muted/40 border border-border/70 space-y-2">
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>{dictionary.bookings.roomChargesNights} ({booking.nights} {dictionary.common.nights})</span>
              <span className="font-medium text-foreground">
                {formatCurrency(convertCurrency(booking.totalPrice, booking.currency || "LAK", currency), currency)}
              </span>
            </div>
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>{dictionary.bookings.paymentStatusLabel}</span>
              <span className="font-semibold text-emerald-600 dark:text-emerald-400 capitalize">
                {dictionary.common[booking.paymentStatus as keyof typeof dictionary.common] || booking.paymentStatus}
              </span>
            </div>
            <div className="pt-2 border-t border-border flex justify-between items-baseline">
              <span className="font-bold text-sm text-foreground">
                {dictionary.bookings.totalFolioBalance}
              </span>
              <span className="font-extrabold text-base text-primary">
                {formatCurrency(convertCurrency(booking.totalPrice, booking.currency || "LAK", currency), currency)}
              </span>
            </div>
          </div>

          {/* Front Desk & Manager Operations */}
          <div className="space-y-2 pt-2">
            <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider block">
              {dictionary.bookings.reservationOperations}
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {booking.status === "confirmed" && (
                <Button
                  size="sm"
                  variant="default"
                  onClick={() => {
                    onUpdateStatus(booking.id, "checked_in");
                    onClose();
                  }}
                  className="h-9 text-xs gap-1.5"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  {dictionary.bookings.performCheckIn}
                </Button>
              )}

              {booking.status === "checked_in" && (
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => {
                    onUpdateStatus(booking.id, "checked_out");
                    onClose();
                  }}
                  className="h-9 text-xs gap-1.5 text-emerald-600 border-emerald-500/40 hover:bg-emerald-500/10"
                >
                  <LogOut className="w-4 h-4" />
                  {dictionary.bookings.completeCheckOut}
                </Button>
              )}

              {booking.status !== "cancelled" && booking.status !== "checked_out" && (
                isManager ? (
                  <Button
                    size="sm"
                    variant="destructive"
                    onClick={() => {
                      onCancelBooking(booking.id);
                      onClose();
                    }}
                    className="h-9 text-xs gap-1.5"
                  >
                    <Ban className="w-4 h-4" />
                    {dictionary.bookings.cancelReservation}
                  </Button>
                ) : (
                  <Button
                    size="sm"
                    variant="outline"
                    disabled
                    className="h-9 text-xs gap-1.5 opacity-60 cursor-not-allowed border-dashed"
                    title="Requires General Manager Authorization"
                  >
                    <Lock className="w-3.5 h-3.5" />
                    {dictionary.bookings.cancelGmApproval}
                  </Button>
                )
              )}
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="p-4 border-t border-border/70 flex justify-end bg-muted/20">
          <Button variant="outline" size="sm" onClick={onClose} className="text-xs">
            {dictionary.common.close}
          </Button>
        </div>
      </div>
    </div>
  );
}
