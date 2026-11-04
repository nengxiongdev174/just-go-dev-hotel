"use client";

import React from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { useLanguage } from "@/context/LanguageContext";
import { type RoomStatusBreakdownProps } from "@/types/dashboard";

export function RoomStatusDonut({ metrics }: RoomStatusBreakdownProps) {
  const { dictionary } = useLanguage();

  const statuses = [
    {
      label: dictionary.common.available,
      count: metrics.availableRooms,
      color: "bg-emerald-500",
      textColor: "text-emerald-600 dark:text-emerald-400",
      percent:
        metrics.totalRooms > 0
          ? Math.round((metrics.availableRooms / metrics.totalRooms) * 100)
          : 0,
    },
    {
      label: dictionary.common.occupied,
      count: metrics.occupiedRooms,
      color: "bg-indigo-600",
      textColor: "text-indigo-600 dark:text-indigo-400",
      percent:
        metrics.totalRooms > 0
          ? Math.round((metrics.occupiedRooms / metrics.totalRooms) * 100)
          : 0,
    },
    {
      label: dictionary.common.cleaning,
      count: metrics.cleaningRooms,
      color: "bg-amber-500",
      textColor: "text-amber-600 dark:text-amber-400",
      percent:
        metrics.totalRooms > 0
          ? Math.round((metrics.cleaningRooms / metrics.totalRooms) * 100)
          : 0,
    },
    {
      label: dictionary.common.maintenance,
      count: metrics.maintenanceRooms,
      color: "bg-rose-500",
      textColor: "text-rose-600 dark:text-rose-400",
      percent:
        metrics.totalRooms > 0
          ? Math.round((metrics.maintenanceRooms / metrics.totalRooms) * 100)
          : 0,
    },
  ];

  return (
    <Card className="h-full flex flex-col">
      <CardHeader className="pb-3">
        <CardTitle className="text-base font-semibold">
          {dictionary.dashboard.roomStatusOverview}
        </CardTitle>
        <p className="text-xs text-muted-foreground mt-0.5">
          {dictionary.dashboard.roomAllocationSubtitle}
        </p>
      </CardHeader>

      <CardContent className="flex-1 flex flex-col justify-between space-y-4">
        {/* Progress Bar Representation */}
        <div className="h-4 w-full bg-muted/60 rounded-full flex overflow-hidden p-0.5 gap-0.5">
          {statuses.map((s, idx) => (
            <div
              key={idx}
              style={{ width: `${s.percent}%` }}
              className={`${s.color} rounded-sm transition-all duration-500`}
              title={`${s.label}: ${s.count} (${s.percent}%)`}
            />
          ))}
        </div>

        {/* Legend & Stats List */}
        <div className="grid grid-cols-2 gap-3 pt-2">
          {statuses.map((item, idx) => (
            <div
              key={idx}
              className="p-3 rounded-xl bg-muted/30 border border-border/50 flex items-center justify-between"
            >
              <div className="flex items-center gap-2 min-w-0">
                <span className={`h-2.5 w-2.5 rounded-full shrink-0 ${item.color}`} />
                <span className="text-xs font-medium text-muted-foreground truncate">
                  {item.label}
                </span>
              </div>
              <div className="text-right shrink-0">
                <span className="text-sm font-bold text-foreground" suppressHydrationWarning>
                  {item.count}
                </span>
                <span className="text-[10px] text-muted-foreground ml-1" suppressHydrationWarning>
                  ({item.percent}%)
                </span>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

