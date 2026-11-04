"use client";

import React, { useState } from "react";
import { X, Sparkles, Wrench, ShieldAlert, CheckCircle2, Lock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { formatCurrency, getRoomPrice } from "@/lib/formatters";
import { type Room, type RoomStatus, type Currency } from "@/types/hotel";
import { useLanguage } from "@/context/LanguageContext";
import { useHotel } from "@/context/HotelContext";

interface RoomDetailModalProps {
  room: Room | null;
  currency: Currency;
  onClose: () => void;
  onUpdateStatus: (roomId: string, status: RoomStatus) => void;
  onQuickCheckIn: (roomId: string, guestName: string) => void;
  onQuickCheckOut: (roomId: string) => void;
}

export function RoomDetailModal({
  room,
  currency,
  onClose,
  onUpdateStatus,
  onQuickCheckIn,
  onQuickCheckOut,
}: RoomDetailModalProps) {
  const { dictionary } = useLanguage();
  const { user } = useHotel();
  const [guestNameInput, setGuestNameInput] = useState("");

  if (!room) return null;

  const isHousekeeping = user?.role === "housekeeping";
  const isManager = user?.role === "manager";
  const roomPrice = getRoomPrice(room, currency);

  const handleCheckInSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!guestNameInput.trim()) return;
    onQuickCheckIn(room.id, guestNameInput.trim());
    setGuestNameInput("");
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="w-full max-w-lg bg-card rounded-2xl border border-border shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Modal Header */}
        <div className="p-5 border-b border-border/70 flex items-center justify-between bg-muted/20">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center font-bold text-base">
              #{room.roomNumber}
            </div>
            <div>
              <h2 className="text-lg font-bold text-foreground">
                {room.type.toUpperCase()} {dictionary.rooms.roomTypeSuffix.toUpperCase()}
              </h2>
              <p className="text-xs text-muted-foreground">
                {dictionary.common.floor} {room.floor} • {dictionary.common.capacity}: {room.capacity} {dictionary.common.guestsCount}
              </p>
            </div>
          </div>
          <Button variant="ghost" size="icon-xs" onClick={onClose}>
            <X className="w-4 h-4" />
          </Button>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-5 overflow-y-auto">
          {/* Status & Price Grid */}
          <div className="grid grid-cols-2 gap-3 p-4 rounded-xl bg-muted/40 border border-border/60">
            <div>
              <span className="text-[11px] text-muted-foreground block font-medium">
                {dictionary.common.currentStatus}
              </span>
              <span className="font-bold text-sm text-foreground capitalize mt-0.5 block">
                {room.status === "available"
                  ? dictionary.common.available
                  : room.status === "occupied"
                  ? dictionary.common.occupied
                  : room.status === "cleaning"
                  ? dictionary.common.cleaning
                  : dictionary.common.maintenance}
              </span>
            </div>
            <div className="text-right">
              <span className="text-[11px] text-muted-foreground block font-medium">
                {dictionary.common.ratePerNight}
              </span>
              <span className="font-bold text-sm text-primary mt-0.5 block">
                {formatCurrency(roomPrice, currency)}
              </span>
            </div>
          </div>

          {/* =================================================================== */}
          {/* HOUSEKEEPING VIEW: ONLY REPORT CLEANING (NO CHECK-IN, NO CHECK-OUT, NO CLOSED) */}
          {/* =================================================================== */}
          {isHousekeeping ? (
            <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-foreground flex items-center gap-1.5 uppercase tracking-wider">
                  <Wrench className="w-4 h-4 text-amber-500" />
                  {dictionary.rooms.housekeepingReport}
                </span>
                <Badge variant="outline" className="text-[10px] uppercase font-semibold">
                  {dictionary.rooms.housekeepingOnly}
                </Badge>
              </div>

              {room.status === "cleaning" ? (
                <div className="space-y-2">
                  <p className="text-xs text-muted-foreground">
                    {dictionary.rooms.cleaningInProgressNotice}
                  </p>
                  <Button
                    size="sm"
                    onClick={() => {
                      onUpdateStatus(room.id, "available");
                      onClose();
                    }}
                    className="w-full h-10 text-xs font-bold bg-emerald-600 hover:bg-emerald-700 text-white gap-2 shadow-xs cursor-pointer"
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    <span>{dictionary.rooms.markCleaned}</span>
                  </Button>
                </div>
              ) : room.status === "available" ? (
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-xs text-emerald-600 dark:text-emerald-400 font-semibold">
                    <CheckCircle2 className="w-4 h-4" />
                    <span>{dictionary.rooms.roomCleanReadyNotice}</span>
                  </div>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => onUpdateStatus(room.id, "cleaning")}
                    className="w-full h-9 text-xs gap-1.5 border-amber-500/40 text-amber-600 hover:bg-amber-500/10 cursor-pointer"
                  >
                    <Wrench className="w-3.5 h-3.5" />
                    <span>{dictionary.rooms.restartCleaning}</span>
                  </Button>
                </div>
              ) : room.status === "occupied" ? (
                <div className="space-y-2">
                  <p className="text-xs text-muted-foreground">
                    {dictionary.rooms.occupiedCleaningNotice}
                  </p>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => onUpdateStatus(room.id, "cleaning")}
                    className="w-full h-9 text-xs gap-1.5 border-amber-500/40 text-amber-600 hover:bg-amber-500/10 cursor-pointer"
                  >
                    <Wrench className="w-3.5 h-3.5" />
                    <span>{dictionary.rooms.dailyCleaning}</span>
                  </Button>
                </div>
              ) : (
                <div className="p-3 rounded-xl bg-muted/60 text-xs text-muted-foreground flex items-center gap-2">
                  <Lock className="w-4 h-4 text-rose-500 shrink-0" />
                  <span>{dictionary.rooms.closedByGm}</span>
                </div>
              )}
            </div>
          ) : (
            /* =================================================================== */
            /* FRONT DESK & MANAGER VIEW */
            /* =================================================================== */
            <>
              {/* Housekeeping Status Management */}
              <div className="space-y-2 p-3.5 rounded-xl bg-muted/30 border border-border/60">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-foreground flex items-center gap-1.5 uppercase tracking-wider block">
                    <Wrench className="w-3.5 h-3.5 text-primary" />
                    {dictionary.rooms.housekeepingMaintenance}
                  </span>
                  {!isManager && (
                    <span className="text-[10px] text-muted-foreground">
                      {dictionary.rooms.closeRequiresGm}
                    </span>
                  )}
                </div>

                <div className="grid grid-cols-3 gap-2 pt-1">
                  <Button
                    variant={room.status === "available" ? "default" : "outline"}
                    size="sm"
                    onClick={() => onUpdateStatus(room.id, "available")}
                    className="text-xs h-8 gap-1.5 cursor-pointer"
                  >
                    <Sparkles className="w-3.5 h-3.5 text-emerald-500" />
                    {dictionary.common.available}
                  </Button>
                  <Button
                    variant={room.status === "cleaning" ? "default" : "outline"}
                    size="sm"
                    onClick={() => onUpdateStatus(room.id, "cleaning")}
                    className="text-xs h-8 gap-1.5 cursor-pointer"
                  >
                    <Wrench className="w-3.5 h-3.5 text-amber-500" />
                    {dictionary.common.cleaning}
                  </Button>

                  {isManager ? (
                    <Button
                      variant={room.status === "maintenance" ? "default" : "outline"}
                      size="sm"
                      onClick={() => onUpdateStatus(room.id, "maintenance")}
                      className="text-xs h-8 gap-1.5 cursor-pointer text-rose-600 border-rose-500/40"
                    >
                      <ShieldAlert className="w-3.5 h-3.5 text-rose-500" />
                      {dictionary.common.maintenance}
                    </Button>
                  ) : (
                    <Button
                      variant="outline"
                      size="sm"
                      disabled
                      className="text-xs h-8 gap-1 opacity-50 cursor-not-allowed border-dashed"
                      title="Only General Manager can close/maintenance a room"
                    >
                      <Lock className="w-3 h-3" />
                      {dictionary.rooms.closedRoleLabel}
                    </Button>
                  )}
                </div>
              </div>

              {/* Guest Info if Occupied (Check-Out allowed for Front Desk & GM) */}
              {room.status === "occupied" && (
                <div className="p-4 rounded-xl bg-indigo-50/60 dark:bg-indigo-950/40 border border-indigo-200/60 dark:border-indigo-800/60 space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-xs text-indigo-700 dark:text-indigo-300 font-semibold block">
                        {room.currentGuestName || dictionary.rooms.guestInHouse}
                      </span>
                      {room.checkOutDate && (
                        <span className="text-[11px] text-muted-foreground">
                          {dictionary.common.checkOut}: {room.checkOutDate}
                        </span>
                      )}
                    </div>
                    <Badge variant="indigo" className="text-[10px]">
                      {dictionary.common.checkedIn}
                    </Badge>
                  </div>

                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => onQuickCheckOut(room.id)}
                    className="w-full text-xs text-indigo-700 dark:text-indigo-300 border-indigo-300 hover:bg-indigo-100 dark:hover:bg-indigo-900/50 cursor-pointer"
                  >
                    {dictionary.rooms.quickCheckOut}
                  </Button>
                </div>
              )}

              {/* Quick Check-In Form (Only for Front Desk & GM) */}
              {room.status === "available" && (
                <form onSubmit={handleCheckInSubmit} className="space-y-3 p-4 rounded-xl bg-emerald-50/60 dark:bg-emerald-950/30 border border-emerald-200/60 dark:border-emerald-800/60">
                  <span className="text-xs font-semibold text-emerald-800 dark:text-emerald-300 block">
                    {dictionary.rooms.quickCheckIn} ({dictionary.common.walkIn})
                  </span>
                  <div className="flex gap-2">
                    <Input
                      placeholder={dictionary.rooms.enterGuestNamePlaceholder}
                      value={guestNameInput}
                      onChange={(e) => setGuestNameInput(e.target.value)}
                      className="h-8 text-xs bg-background"
                    />
                    <Button type="submit" size="sm" className="h-8 text-xs shrink-0 cursor-pointer">
                      {dictionary.rooms.quickCheckInBtn}
                    </Button>
                  </div>
                </form>
              )}
            </>
          )}

          {/* Room Amenities List */}
          <div className="space-y-2 pt-1">
            <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider block">
              {dictionary.rooms.roomAmenitiesTitle}
            </span>
            <div className="flex flex-wrap gap-1.5">
              {room.amenities.map((item, idx) => (
                <span
                  key={idx}
                  className="text-xs px-2.5 py-1 rounded-md bg-muted text-foreground font-medium"
                >
                  {item}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="p-4 border-t border-border/70 flex justify-end bg-muted/20">
          <Button variant="outline" size="sm" onClick={onClose} className="text-xs cursor-pointer">
            {dictionary.common.close}
          </Button>
        </div>
      </div>
    </div>
  );
}
