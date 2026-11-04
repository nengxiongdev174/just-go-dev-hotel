"use client";

import React from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { useLanguage } from "@/context/LanguageContext";
import { formatPriceFromLAK } from "@/lib/formatters";
import { type OccupancyTrendsProps } from "@/types/dashboard";

export function OccupancyTrendsChart({ trendData, currency }: OccupancyTrendsProps) {
  const { dictionary } = useLanguage();

  return (
    <Card className="h-full flex flex-col">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-base font-semibold">
              {dictionary.dashboard.occupancyTrends}
            </CardTitle>
            <p className="text-xs text-muted-foreground mt-0.5">
              {dictionary.dashboard.occupancyTrendsSubtitle}
            </p>
          </div>
          <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-primary/10 text-primary">
            {dictionary.dashboard.days7}
          </span>
        </div>
      </CardHeader>

      <CardContent className="flex-1 flex flex-col justify-end">
        <div className="grid grid-cols-7 gap-2 items-end h-48 pt-4">
          {trendData.map((item) => {
            const heightPercent = Math.max(15, Math.min(100, item.occupancyRate));
            return (
              <div
                key={item.day}
                className="flex flex-col items-center gap-2 h-full justify-end group"
              >
                {/* Tooltip on hover */}
                <div className="opacity-0 group-hover:opacity-100 transition-opacity text-[10px] font-semibold text-center bg-foreground text-background py-0.5 px-1.5 rounded-md shadow-xs pointer-events-none mb-1">
                  {formatPriceFromLAK(item.revenue, currency)}
                </div>

                {/* Bar */}
                <div className="w-full bg-muted/60 rounded-t-lg h-full flex items-end overflow-hidden">
                  <div
                    style={{ height: `${heightPercent}%` }}
                    className={`w-full rounded-t-lg transition-all duration-500 ${
                      item.isToday
                        ? "bg-gradient-to-t from-primary to-indigo-500 shadow-sm"
                        : "bg-primary/30 group-hover:bg-primary/50"
                    }`}
                  />
                </div>

                {/* Day label */}
                <div className="text-center">
                  <span
                    className={`text-xs block ${
                      item.isToday
                        ? "font-bold text-primary"
                        : "text-muted-foreground font-medium"
                    }`}
                  >
                    {item.day}
                  </span>
                  <span className="text-[10px] text-muted-foreground font-semibold">
                    {item.occupancyRate}%
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}

