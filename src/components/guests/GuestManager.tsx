"use client";

import React from "react";
import { Search, Plus } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useGuestManagement } from "@/hooks/useGuestManagement";
import { GuestTable } from "./GuestTable";
import { AddGuestModal } from "./AddGuestModal";
import { useLanguage } from "@/context/LanguageContext";
import { type VipTier } from "@/types/hotel";

export function GuestManager() {
  const {
    guests,
    vipFilter,
    setVipFilter,
    searchQuery,
    setSearchQuery,
    isAddOpen,
    currency,
    handleOpenAdd,
    handleCloseAdd,
    handleCreateGuest,
  } = useGuestManagement();

  const { dictionary } = useLanguage();

  const vipTabs: Array<{ label: string; value: VipTier | "all" }> = [
    { label: dictionary.common.filterAll, value: "all" },
    { label: dictionary.guests.vipPlatinum, value: "Platinum" },
    { label: dictionary.guests.vipGold, value: "Gold" },
    { label: dictionary.guests.vipSilver, value: "Silver" },
    { label: dictionary.guests.vipStandard, value: "Standard" },
  ];

  return (
    <div className="space-y-6">
      {/* Filter Bar */}
      <div className="p-4 rounded-2xl bg-card border border-border shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center justify-between">
          <div className="relative flex-1 max-w-md">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder={dictionary.common.searchPlaceholder}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 h-9 text-xs"
            />
          </div>

          <Button
            size="sm"
            onClick={handleOpenAdd}
            className="gap-1.5 text-xs h-9 shadow-xs shrink-0"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>{dictionary.guests.addGuest}</span>
          </Button>
        </div>

          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
            {vipTabs.map((tab) => (
              <button
                key={tab.value}
                onClick={() => setVipFilter(tab.value)}
                className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all shrink-0 ${
                  vipFilter === tab.value
                    ? "bg-primary text-primary-foreground shadow-xs font-semibold"
                    : "bg-muted/70 text-muted-foreground hover:bg-muted hover:text-foreground"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

      {/* Table */}
      <GuestTable
        guests={guests}
        currency={currency}
        onOpenAdd={handleOpenAdd}
      />

      {/* Modal */}
      {isAddOpen && (
        <AddGuestModal
          isOpen={isAddOpen}
          onClose={handleCloseAdd}
          onAddGuest={handleCreateGuest}
        />
      )}
    </div>
  );
}
