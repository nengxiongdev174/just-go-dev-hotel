"use client";

import React from "react";
import { BedDouble, Users2, CalendarCheck, DollarSign, TrendingUp, Sparkles, Wrench, ShieldAlert } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { useLanguage } from "@/context/LanguageContext";
import { formatCurrency, formatPriceFromLAK } from "@/lib/formatters";
import { type HotelKpisProps } from "@/types/dashboard";

export function HotelKpis({ metrics, currency, role = "manager" }: HotelKpisProps) {
  const { dictionary } = useLanguage();

  const getCardsByRole = () => {
    if (role === "housekeeping") {
      return [
        {
          label: dictionary.common.occupied,
          value: `${metrics.occupiedRooms} / ${metrics.totalRooms}`,
          subtext: `${metrics.occupancyRate}% ${dictionary.dashboard.occupancyRate}`,
          icon: BedDouble,
          color: "text-indigo-600 dark:text-indigo-400",
          bgColor: "bg-indigo-500/10",
          badge: dictionary.common.room,
        },
        {
          label: dictionary.common.available,
          value: metrics.availableRooms.toString(),
          subtext: dictionary.dashboard.readyForArrival,
          icon: Sparkles,
          color: "text-emerald-600 dark:text-emerald-400",
          bgColor: "bg-emerald-500/10",
          badge: dictionary.dashboard.cleaned,
        },
        {
          label: dictionary.common.cleaning,
          value: metrics.cleaningRooms.toString(),
          subtext: dictionary.dashboard.inProgressCleaning,
          icon: Wrench,
          color: "text-amber-600 dark:text-amber-400",
          bgColor: "bg-amber-500/10",
          badge: dictionary.dashboard.priority,
        },
        {
          label: dictionary.common.maintenance,
          value: metrics.maintenanceRooms.toString(),
          subtext: dictionary.dashboard.serviceEngineering,
          icon: ShieldAlert,
          color: "text-rose-600 dark:text-rose-400",
          bgColor: "bg-rose-500/10",
          badge: dictionary.dashboard.blocked,
        },
      ];
    }

    if (role === "receptionist") {
      return [
        {
          label: dictionary.dashboard.occupancyRate,
          value: `${metrics.occupancyRate}%`,
          subtext: `${metrics.occupiedRooms} / ${metrics.totalRooms} ${dictionary.common.room}`,
          icon: BedDouble,
          color: "text-indigo-600 dark:text-indigo-400",
          bgColor: "bg-indigo-500/10",
          badge: dictionary.dashboard.live,
        },
        {
          label: dictionary.dashboard.inHouseGuests,
          value: metrics.inHouseGuests.toString(),
          subtext: `${metrics.occupiedRooms} ${dictionary.common.occupied}`,
          icon: Users2,
          color: "text-emerald-600 dark:text-emerald-400",
          bgColor: "bg-emerald-500/10",
          badge: dictionary.dashboard.inHouseBadge,
        },
        {
          label: dictionary.dashboard.todayCheckIns,
          value: metrics.todayCheckIns.toString(),
          subtext: dictionary.dashboard.expectedArrivals,
          icon: CalendarCheck,
          color: "text-violet-600 dark:text-violet-400",
          bgColor: "bg-violet-500/10",
          badge: dictionary.dashboard.todayInBadge,
        },
        {
          label: dictionary.dashboard.todayCheckOuts,
          value: metrics.todayCheckOuts.toString(),
          subtext: dictionary.dashboard.expectedDepartures,
          icon: Users2,
          color: "text-amber-600 dark:text-amber-400",
          bgColor: "bg-amber-500/10",
          badge: dictionary.dashboard.todayOutBadge,
        },
      ];
    }

    // Default: General Manager (Executive with Revenue KPIs)
    return [
      {
        label: dictionary.dashboard.occupancyRate,
        value: `${metrics.occupancyRate}%`,
        subtext: `${metrics.occupiedRooms} / ${metrics.totalRooms} ${dictionary.common.room}`,
        icon: BedDouble,
        color: "text-indigo-600 dark:text-indigo-400",
        bgColor: "bg-indigo-500/10",
        badge: "+4.2%",
      },
      {
        label: dictionary.dashboard.inHouseGuests,
        value: metrics.inHouseGuests.toString(),
        subtext: `${metrics.occupiedRooms} ${dictionary.common.occupied}`,
        icon: Users2,
        color: "text-emerald-600 dark:text-emerald-400",
        bgColor: "bg-emerald-500/10",
        badge: dictionary.dashboard.active,
      },
      {
        label: dictionary.dashboard.todayCheckIns,
        value: metrics.todayCheckIns.toString(),
        subtext: `${metrics.todayCheckOuts} ${dictionary.dashboard.todayCheckOuts}`,
        icon: CalendarCheck,
        color: "text-violet-600 dark:text-violet-400",
        bgColor: "bg-violet-500/10",
        badge: dictionary.dashboard.today,
      },
      {
        label: dictionary.dashboard.estimatedRevenue,
        value: formatPriceFromLAK(metrics.estimatedRevenue, currency),
        subtext: dictionary.dashboard.totalBookingsFolio,
        icon: DollarSign,
        color: "text-amber-600 dark:text-amber-400",
        bgColor: "bg-amber-500/10",
        badge: "+12.8%",
      },
    ];
  };

  const cards = getCardsByRole();

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
      {cards.map((card, idx) => {
        const Icon = card.icon;
        return (
          <Card key={idx} className="hover:border-primary/50 transition-all">
            <CardContent className="p-5">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                  {card.label}
                </span>
                <div className={`p-2 rounded-xl ${card.bgColor} ${card.color}`}>
                  <Icon className="w-4 h-4" />
                </div>
              </div>

              <div className="flex items-baseline justify-between">
                <h3 className="text-2xl font-bold tracking-tight text-foreground" suppressHydrationWarning>
                  {card.value}
                </h3>
                <span className="inline-flex items-center gap-0.5 text-[11px] font-semibold text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 px-1.5 py-0.5 rounded-md">
                  <TrendingUp className="w-3 h-3" />
                  {card.badge}
                </span>
              </div>

              <p className="text-xs text-muted-foreground mt-1 font-medium" suppressHydrationWarning>
                {card.subtext}
              </p>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
