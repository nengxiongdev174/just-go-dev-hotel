"use client";

import React from "react";
import Link from "next/link";
import { ArrowRight, CheckCircle2, Clock, Lock } from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useLanguage } from "@/context/LanguageContext";
import { useHotel } from "@/context/HotelContext";
import { formatCurrency, convertCurrency, formatDate } from "@/lib/formatters";
import { type TodayArrivalsProps } from "@/types/dashboard";

export function TodayArrivalsTable({
  todayBookings,
  currency,
  onUpdateBookingStatus,
}: TodayArrivalsProps) {
  const { dictionary } = useLanguage();
  const { user } = useHotel();

  const isHousekeeping = user?.role === "housekeeping";

  return (
    <Card>
      <CardHeader className="pb-3 flex flex-row items-center justify-between">
        <div>
          <CardTitle className="text-base font-semibold">
            {dictionary.dashboard.recentArrivals}
          </CardTitle>
          <p className="text-xs text-muted-foreground mt-0.5">
            {dictionary.dashboard.arrivalsSubtitle}
          </p>
        </div>
        {!isHousekeeping && (
          <Link href="/bookings">
            <Button variant="ghost" size="sm" className="gap-1.5 text-xs text-primary cursor-pointer">
              <span>{dictionary.dashboard.viewAllBookings}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Button>
          </Link>
        )}
      </CardHeader>

      <CardContent className="p-0">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-24">{dictionary.common.room}</TableHead>
              <TableHead>{dictionary.common.guest}</TableHead>
              <TableHead className="hidden sm:table-cell">{dictionary.common.date}</TableHead>
              <TableHead>{dictionary.common.total}</TableHead>
              <TableHead>{dictionary.common.status}</TableHead>
              <TableHead className="text-right">{dictionary.common.action}</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {todayBookings.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                  {dictionary.dashboard.noActiveArrivals}
                </TableCell>
              </TableRow>
            ) : (
              todayBookings.slice(0, 5).map((booking) => (
                <TableRow key={booking.id}>
                  <TableCell className="font-bold text-foreground">
                    <span className="px-2 py-0.5 rounded-md bg-muted text-xs font-mono">
                      #{booking.roomNumber}
                    </span>
                  </TableCell>
                  <TableCell>
                    <div>
                      <p className="font-semibold text-xs text-foreground">
                        {booking.guestName}
                      </p>
                      <p className="text-[11px] text-muted-foreground">
                        Ref: {booking.bookingRef} • {dictionary.common[booking.paymentStatus as keyof typeof dictionary.common] || booking.paymentStatus}
                      </p>
                    </div>
                  </TableCell>
                  <TableCell className="hidden sm:table-cell text-xs text-muted-foreground">
                    {formatDate(booking.checkInDate)} → {formatDate(booking.checkOutDate)}
                  </TableCell>
                  <TableCell className="font-medium text-xs text-foreground">
                    {formatCurrency(convertCurrency(booking.totalPrice, booking.currency || "LAK", currency), currency)}
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
                    ) : (
                      <Badge variant="secondary" className="text-[11px]">
                        {booking.status}
                      </Badge>
                    )}
                  </TableCell>
                  <TableCell className="text-right">
                    {isHousekeeping ? (
                      <span className="text-[10px] text-muted-foreground px-2 py-0.5 rounded bg-muted/60">
                        {dictionary.dashboard.frontDeskOnly}
                      </span>
                    ) : booking.status === "confirmed" ? (
                      <Button
                        size="xs"
                        variant="default"
                        onClick={() => onUpdateBookingStatus(booking.id, "checked_in")}
                        className="text-[11px] h-7 cursor-pointer"
                      >
                        {dictionary.common.checkIn}
                      </Button>
                    ) : booking.status === "checked_in" ? (
                      <Button
                        size="xs"
                        variant="outline"
                        onClick={() => onUpdateBookingStatus(booking.id, "checked_out")}
                        className="text-[11px] h-7 text-emerald-600 border-emerald-500/30 hover:bg-emerald-500/10 cursor-pointer"
                      >
                        {dictionary.common.checkOut}
                      </Button>
                    ) : (
                      <Link href="/bookings">
                        <Button size="xs" variant="ghost" className="text-[11px] h-7 cursor-pointer">
                          {dictionary.common.details}
                        </Button>
                      </Link>
                    )}
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
