"use client";

import React from "react";
import { useHotelDashboard } from "@/hooks/useHotelDashboard";
import { useHotel } from "@/context/HotelContext";
import { HotelKpis } from "./HotelKpis";
import { OccupancyTrendsChart } from "./OccupancyTrendsChart";
import { RoomStatusDonut } from "./RoomStatusDonut";
import { TodayArrivalsTable } from "./TodayArrivalsTable";

export function HotelDashboard() {
  const { metrics, trends, todayArrivals, currency, updateBookingStatus } =
    useHotelDashboard();
  const { user } = useHotel();

  return (
    <div className="space-y-6">
      {/* KPI Cards (Tailored by Role) */}
      <HotelKpis metrics={metrics} currency={currency} role={user?.role} />

      {/* Trends & Status Breakdown Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <OccupancyTrendsChart trendData={trends} currency={currency} />
        </div>
        <div className="lg:col-span-1">
          <RoomStatusDonut metrics={metrics} />
        </div>
      </div>

      {/* Today Arrivals */}
      <TodayArrivalsTable
        todayBookings={todayArrivals}
        currency={currency}
        onUpdateBookingStatus={updateBookingStatus}
      />
    </div>
  );
}
