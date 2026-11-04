"use client";

import React from "react";
import { Plus, SlidersHorizontal, CheckCircle2, Clock, XCircle, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useLanguage } from "@/context/LanguageContext";
import { formatCurrency, convertCurrency, formatDate } from "@/lib/formatters";
import { type BookingTableProps } from "@/types/booking";

export function BookingTable({
  bookings,
  currency,
  onOpenDetails,
  onOpenCreate,
}: BookingTableProps) {
  const { dictionary } = useLanguage();

  return (
    <div className="rounded-2xl border border-border bg-card shadow-xs overflow-hidden">
      {/* Table Toolbar */}
      <div className="p-3.5 px-4 border-b border-border flex items-center justify-between gap-4">
        <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
          {bookings.length} {dictionary.common.bookingsTitle}
        </span>
        <Button
          size="sm"
          onClick={onOpenCreate}
          className="gap-1.5 text-xs h-8 shadow-xs sm:hidden"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>{dictionary.bookings.createBooking}</span>
        </Button>
      </div>

      {/* Table Content */}
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-24">{dictionary.common.room}</TableHead>
            <TableHead>{dictionary.common.guest}</TableHead>
            <TableHead className="hidden md:table-cell">{dictionary.common.date}</TableHead>
            <TableHead>{dictionary.common.total}</TableHead>
            <TableHead>{dictionary.common.status}</TableHead>
            <TableHead className="text-right">{dictionary.common.action}</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {bookings.length === 0 ? (
            <TableRow>
              <TableCell colSpan={6} className="text-center py-10 text-muted-foreground text-sm">
                {dictionary.bookings.noBookingsFound}
              </TableCell>
            </TableRow>
          ) : (
            bookings.map((booking) => (
              <TableRow key={booking.id} className="hover:bg-muted/40">
                <TableCell>
                  <span className="font-bold text-xs font-mono px-2 py-0.5 rounded-md bg-muted text-foreground">
                    #{booking.roomNumber}
                  </span>
                </TableCell>
                <TableCell>
                  <div>
                    <p className="font-semibold text-xs text-foreground">
                      {booking.guestName}
                    </p>
                    <p className="text-[11px] text-muted-foreground">
                      Ref: {booking.bookingRef} • <span className="capitalize">{booking.roomType}</span>
                    </p>
                  </div>
                </TableCell>
                <TableCell className="hidden md:table-cell text-xs text-muted-foreground">
                  {formatDate(booking.checkInDate)} → {formatDate(booking.checkOutDate)}
                </TableCell>
                <TableCell className="font-semibold text-xs text-foreground">
                  <div>
                    {formatCurrency(convertCurrency(booking.totalPrice, booking.currency || "LAK", currency), currency)}
                    <span className="block text-[10px] text-muted-foreground font-normal capitalize">
                      {dictionary.common[booking.paymentStatus as keyof typeof dictionary.common] || booking.paymentStatus}
                    </span>
                  </div>
                </TableCell>
                <TableCell>
                  {booking.status === "confirmed" ? (
                    <Badge variant="warning" className="gap-1 text-[11px]">
                      <Clock className="w-3 h-3" />
                      {dictionary.common.confirmed}
                    </Badge>
                  ) : booking.status === "checked_in" ? (
                    <Badge variant="success" className="gap-1 text-[11px]">
                      <CheckCircle2 className="w-3 h-3" />
                      {dictionary.common.checkedIn}
                    </Badge>
                  ) : booking.status === "checked_out" ? (
                    <Badge variant="secondary" className="gap-1 text-[11px]">
                      <LogOut className="w-3 h-3" />
                      {dictionary.common.checkedOut}
                    </Badge>
                  ) : (
                    <Badge variant="destructive" className="gap-1 text-[11px]">
                      <XCircle className="w-3 h-3" />
                      {dictionary.common.cancelled}
                    </Badge>
                  )}
                </TableCell>
                {/* Single unified action button per user standard */}
                <TableCell className="text-right">
                  <Button
                    size="xs"
                    variant="outline"
                    onClick={() => onOpenDetails(booking)}
                    className="gap-1 text-xs h-7 border-border hover:bg-muted"
                  >
                    <SlidersHorizontal className="w-3 h-3" />
                    <span>{dictionary.common.action}</span>
                  </Button>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
}
