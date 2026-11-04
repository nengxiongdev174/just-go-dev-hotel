"use client";

import React, { useState } from "react";
import { X, UserPlus, Crown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { type Guest, type VipTier } from "@/types/hotel";
import { useLanguage } from "@/context/LanguageContext";

interface AddGuestModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddGuest: (guest: Guest) => void;
}

export function AddGuestModal({ isOpen, onClose, onAddGuest }: AddGuestModalProps) {
  const { dictionary } = useLanguage();

  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [nationality, setNationality] = useState("Laos");
  const [passportId, setPassportId] = useState("");
  const [vipTier, setVipTier] = useState<VipTier>("Standard");

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName.trim()) return;

    const newGuest: Guest = {
      id: `gst-${Date.now()}`,
      fullName: fullName.trim(),
      email: email.trim() || `${fullName.toLowerCase().replace(/\s+/g, "")}@example.com`,
      phone: phone.trim() || "+856 20 5555 9999",
      nationality: nationality.trim() || "Laos",
      passportId: passportId.trim() || `ID-${Math.floor(100000 + Math.random() * 900000)}`,
      vipTier,
      totalStays: 1,
      totalSpentLAK: 0,
      notes: "Newly registered walk-in guest",
    };

    onAddGuest(newGuest);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="w-full max-w-md bg-card rounded-2xl border border-border shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="p-5 border-b border-border/70 flex items-center justify-between bg-muted/20">
          <div>
            <h2 className="text-lg font-bold text-foreground">
              {dictionary.guests.addGuest}
            </h2>
            <p className="text-xs text-muted-foreground">
              {dictionary.guests.registerGuestSubtitle}
            </p>
          </div>
          <Button variant="ghost" size="icon-xs" onClick={onClose}>
            <X className="w-4 h-4" />
          </Button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4 overflow-y-auto">
          <div className="space-y-1">
            <label className="text-xs font-semibold text-foreground">
              {dictionary.common.fullName} *
            </label>
            <Input
              required
              placeholder="e.g. Aloun Sayasith"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              className="h-9 text-xs"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="text-xs font-semibold text-foreground">
                {dictionary.common.emailAddress}
              </label>
              <Input
                type="email"
                placeholder="aloun@mail.la"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="h-9 text-xs"
              />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-semibold text-foreground">
                {dictionary.common.phoneNumber}
              </label>
              <Input
                placeholder="+856 20 ..."
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="h-9 text-xs"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="text-xs font-semibold text-foreground">
                {dictionary.common.nationality}
              </label>
              <Input
                placeholder="Laos, Thailand, etc."
                value={nationality}
                onChange={(e) => setNationality(e.target.value)}
                className="h-9 text-xs"
              />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-semibold text-foreground">
                {dictionary.common.passportId}
              </label>
              <Input
                placeholder="P12345678"
                value={passportId}
                onChange={(e) => setPassportId(e.target.value)}
                className="h-9 text-xs"
              />
            </div>
          </div>

          {/* VIP Tier Selector */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-foreground flex items-center gap-1.5">
              <Crown className="w-3.5 h-3.5 text-amber-500" />
              {dictionary.guests.vipTier}
            </label>
            <div className="grid grid-cols-4 gap-2">
              {(["Standard", "Silver", "Gold", "Platinum"] as VipTier[]).map((tier) => (
                <button
                  type="button"
                  key={tier}
                  onClick={() => setVipTier(tier)}
                  className={`py-1.5 text-xs font-semibold rounded-lg capitalize border transition-all ${
                    vipTier === tier
                      ? "bg-primary text-primary-foreground border-primary shadow-xs"
                      : "bg-muted/40 border-border text-muted-foreground hover:bg-muted"
                  }`}
                >
                  {tier === "Standard" ? dictionary.guests.vipStandard : tier === "Silver" ? dictionary.guests.vipSilver : tier === "Gold" ? dictionary.guests.vipGold : dictionary.guests.vipPlatinum}
                </button>
              ))}
            </div>
          </div>

          {/* Form Actions */}
          <div className="pt-3 border-t border-border flex justify-end gap-2">
            <Button type="button" variant="outline" size="sm" onClick={onClose} className="text-xs">
              {dictionary.common.cancel}
            </Button>
            <Button type="submit" size="sm" className="text-xs gap-1.5">
              <UserPlus className="w-3.5 h-3.5" />
              <span>{dictionary.guests.registerGuestBtn}</span>
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
