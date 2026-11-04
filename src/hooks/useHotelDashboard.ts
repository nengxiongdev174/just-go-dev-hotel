"use client";

import { useMemo } from "react";
import { useHotel } from "@/context/HotelContext";
import { type DashboardMetrics, type DayOccupancyStat } from "@/types/dashboard";

export function useHotelDashboard() {
  const { rooms, bookings, currency, updateBookingStatus } = useHotel();

  const metrics = useMemo<DashboardMetrics>(() => {
    const totalRooms = rooms.length;
    let availableRooms = 0;
    let occupiedRooms = 0;
    let cleaningRooms = 0;
    let maintenanceRooms = 0;

    rooms.forEach((r) => {
      if (r.status === "available") availableRooms++;
      else if (r.status === "occupied") occupiedRooms++;
      else if (r.status === "cleaning") cleaningRooms++;
      else if (r.status === "maintenance") maintenanceRooms++;
    });

    const occupancyRate = totalRooms > 0 ? Math.round((occupiedRooms / totalRooms) * 100) : 0;

    const todayStr =
      typeof window !== "undefined"
        ? new Date().toISOString().split("T")[0]
        : "2026-11-01";

    const todayCheckIns = bookings.filter(
      (b) => b.checkInDate === todayStr && b.status === "confirmed"
    ).length;

    const todayCheckOuts = bookings.filter(
      (b) => b.checkOutDate === todayStr && b.status === "checked_in"
    ).length;

    const estimatedRevenue = bookings
      .filter((b) => b.status === "confirmed" || b.status === "checked_in" || b.status === "checked_out")
      .reduce((sum, b) => sum + b.totalPrice, 0);

    const inHouseGuests = occupiedRooms * 2; // Realistic in-house estimate based on occupied suites

    return {
      totalRooms,
      availableRooms,
      occupiedRooms,
      cleaningRooms,
      maintenanceRooms,
      occupancyRate,
      todayCheckIns,
      todayCheckOuts,
      estimatedRevenue,
      inHouseGuests,
    };
  }, [rooms, bookings]);

  const trends = useMemo<DayOccupancyStat[]>(() => {
    const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
    const baseRates = [65, 72, 80, 75, 88, 92, 70];
    const baseRevenues = [4200000, 5100000, 6800000, 5900000, 9200000, 11500000, 7400000];

    return days.map((day, idx) => ({
      day,
      occupancyRate: baseRates[idx],
      revenue: baseRevenues[idx],
      isToday: idx === 5,
    }));
  }, []);

  const todayArrivals = useMemo(() => {
    return bookings.filter(
      (b) => b.status === "confirmed" || b.status === "checked_in"
    );
  }, [bookings]);

  return {
    metrics,
    trends,
    todayArrivals,
    currency,
    updateBookingStatus,
  };
}
