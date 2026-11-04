"use client";

import React from "react";
import { Plus, Crown, Phone, Mail, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useLanguage } from "@/context/LanguageContext";
import { formatPriceFromLAK } from "@/lib/formatters";
import { type Guest, type Currency } from "@/types/hotel";

interface GuestTableProps {
  guests: Guest[];
  currency: Currency;
  onOpenAdd: () => void;
}

export function GuestTable({ guests, currency, onOpenAdd }: GuestTableProps) {
  const { dictionary } = useLanguage();

  const getTierBadge = (tier: Guest["vipTier"]) => {
    switch (tier) {
      case "Platinum":
        return (
          <Badge variant="indigo" className="gap-1 text-[11px] font-bold">
            <Crown className="w-3 h-3 text-indigo-500" />
            {dictionary.guests.vipPlatinum}
          </Badge>
        );
      case "Gold":
        return (
          <Badge variant="warning" className="gap-1 text-[11px] font-bold">
            <Crown className="w-3 h-3 text-amber-500" />
            {dictionary.guests.vipGold}
          </Badge>
        );
      case "Silver":
        return (
          <Badge variant="secondary" className="gap-1 text-[11px] font-medium">
            <Sparkles className="w-3 h-3" />
            {dictionary.guests.vipSilver}
          </Badge>
        );
      default:
        return (
          <Badge variant="outline" className="text-[11px]">
            {dictionary.guests.vipStandard}
          </Badge>
        );
    }
  };

  return (
    <div className="rounded-2xl border border-border bg-card shadow-xs overflow-hidden">
      <div className="p-3.5 px-4 border-b border-border flex items-center justify-between gap-4">
        <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
          {guests.length} {dictionary.common.guestsTitle}
        </span>
        <Button size="sm" onClick={onOpenAdd} className="gap-1.5 text-xs h-8 shadow-xs sm:hidden">
          <Plus className="w-3.5 h-3.5" />
          <span>{dictionary.guests.addGuest}</span>
        </Button>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>{dictionary.common.guest}</TableHead>
            <TableHead>{dictionary.common.contactInfo}</TableHead>
            <TableHead>{dictionary.guests.vipTier}</TableHead>
            <TableHead className="text-center">{dictionary.guests.totalStays}</TableHead>
            <TableHead className="text-right">{dictionary.guests.totalSpent}</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {guests.length === 0 ? (
            <TableRow>
              <TableCell colSpan={5} className="text-center py-10 text-muted-foreground text-sm">
                {dictionary.guests.noGuestsFound}
              </TableCell>
            </TableRow>
          ) : (
            guests.map((guest) => (
              <TableRow key={guest.id} className="hover:bg-muted/40">
                <TableCell>
                  <div className="flex items-center gap-3">
                    <div className="h-9 w-9 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold text-xs shrink-0">
                      {guest.fullName.slice(0, 2).toUpperCase()}
                    </div>
                    <div>
                      <p className="font-semibold text-xs text-foreground">
                        {guest.fullName}
                      </p>
                      <p className="text-[11px] text-muted-foreground">
                        {guest.nationality} • {guest.passportId}
                      </p>
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="space-y-0.5 text-xs text-muted-foreground">
                    <p className="flex items-center gap-1.5 text-foreground">
                      <Mail className="w-3 h-3 text-muted-foreground" />
                      {guest.email}
                    </p>
                    <p className="flex items-center gap-1.5">
                      <Phone className="w-3 h-3 text-muted-foreground" />
                      {guest.phone}
                    </p>
                  </div>
                </TableCell>
                <TableCell>{getTierBadge(guest.vipTier)}</TableCell>
                <TableCell className="text-center font-semibold text-xs text-foreground">
                  <span className="px-2 py-0.5 rounded-md bg-muted">
                    {guest.totalStays} {dictionary.guests.staysCount}
                  </span>
                </TableCell>
                <TableCell className="text-right font-bold text-xs text-foreground">
                  {formatPriceFromLAK(guest.totalSpentLAK, currency)}
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
}
