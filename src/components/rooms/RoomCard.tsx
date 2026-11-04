"use client";

import React from "react";
import { BedDouble, Sparkles, User, Wrench, ShieldAlert } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { formatCurrency, getRoomPrice } from "@/lib/formatters";
import { type Room, type Currency } from "@/types/hotel";
import { useLanguage } from "@/context/LanguageContext";

interface RoomCardProps {
  room: Room;
  currency: Currency;
  onClick: () => void;
}

export function RoomCard({ room, currency, onClick }: RoomCardProps) {
  const { dictionary } = useLanguage();

  const getStatusBadge = () => {
    switch (room.status) {
      case "available":
        return (
          <Badge variant="success" className="gap-1 text-[11px]">
            <Sparkles className="w-3 h-3" />
            {dictionary.common.available}
          </Badge>
        );
      case "occupied":
        return (
          <Badge variant="indigo" className="gap-1 text-[11px]">
            <User className="w-3 h-3" />
            {dictionary.common.occupied}
          </Badge>
        );
      case "cleaning":
        return (
          <Badge variant="warning" className="gap-1 text-[11px]">
            <Wrench className="w-3 h-3" />
            {dictionary.common.cleaning}
          </Badge>
        );
      case "maintenance":
        return (
          <Badge variant="destructive" className="gap-1 text-[11px]">
            <ShieldAlert className="w-3 h-3" />
            {dictionary.common.maintenance}
          </Badge>
        );
    }
  };

  const roomPrice = getRoomPrice(room, currency);

  return (
    <Card
      onClick={onClick}
      className="cursor-pointer group hover:border-primary/60 hover:shadow-md transition-all relative overflow-hidden"
    >
      {/* Top accent bar based on status */}
      <div
        className={`h-1.5 w-full ${
          room.status === "available"
            ? "bg-emerald-500"
            : room.status === "occupied"
            ? "bg-indigo-600"
            : room.status === "cleaning"
            ? "bg-amber-500"
            : "bg-rose-500"
        }`}
      />

      <CardContent className="p-4 space-y-3">
        {/* Room Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-xl font-bold font-mono tracking-tight text-foreground group-hover:text-primary transition-colors">
              #{room.roomNumber}
            </span>
            <span className="text-[10px] font-semibold px-2 py-0.5 rounded-md bg-muted text-muted-foreground uppercase">
              {dictionary.common.floor} {room.floor}
            </span>
          </div>
          {getStatusBadge()}
        </div>

        {/* Room Type & Bed */}
        <div className="flex items-center justify-between text-xs text-muted-foreground">
          <span className="font-semibold text-foreground capitalize">
            {room.type} {dictionary.rooms.roomTypeSuffix}
          </span>
          <span className="flex items-center gap-1">
            <BedDouble className="w-3.5 h-3.5 text-muted-foreground" />
            {room.bedType}
          </span>
        </div>

        {/* Guest name if occupied */}
        {room.status === "occupied" && room.currentGuestName && (
          <div className="p-2 rounded-lg bg-indigo-50 dark:bg-indigo-950/40 border border-indigo-200/50 dark:border-indigo-800/40 text-xs">
            <div className="flex items-center gap-1.5 text-indigo-700 dark:text-indigo-300 font-medium">
              <User className="w-3.5 h-3.5 shrink-0" />
              <span className="truncate">{room.currentGuestName}</span>
            </div>
          </div>
        )}

        {/* Amenities preview */}
        <div className="flex flex-wrap gap-1 pt-1">
          {room.amenities.slice(0, 3).map((amenity, idx) => (
            <span
              key={idx}
              className="text-[10px] px-1.5 py-0.5 rounded bg-muted/70 text-muted-foreground font-medium"
            >
              {amenity}
            </span>
          ))}
          {room.amenities.length > 3 && (
            <span className="text-[10px] px-1 py-0.5 text-muted-foreground">
              +{room.amenities.length - 3}
            </span>
          )}
        </div>

        {/* Price Footer */}
        <div className="pt-2 border-t border-border/60 flex items-center justify-between">
          <span className="text-[11px] text-muted-foreground font-medium">
            {dictionary.common.ratePerNight}
          </span>
          <span className="text-sm font-bold text-foreground">
            {formatCurrency(roomPrice, currency)}
          </span>
        </div>
      </CardContent>
    </Card>
  );
}
