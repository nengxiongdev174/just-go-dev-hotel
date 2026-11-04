"use client";

import React, { useSyncExternalStore } from "react";
import {
  Globe,
  Coins,
  Sun,
  Moon,
  LogOut,
  User,
  CheckCircle2,
  Crown,
  Shield,
  Wrench,
  Hotel,
  KeyRound,
  ShieldCheck,
} from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useLanguage } from "@/context/LanguageContext";
import { useTheme } from "@/context/ThemeContext";
import { useHotel } from "@/context/HotelContext";
import { type Currency, type UserRole } from "@/types/hotel";
import { type Locale } from "@/locales/types";

function emptySubscribe() {
  return () => { };
}

export function SettingsView() {
  const isMounted = useSyncExternalStore(
    emptySubscribe,
    () => true,
    () => false
  );

  const { locale, setLocale, dictionary } = useLanguage();
  const { theme, setTheme } = useTheme();
  const { user, currency, setCurrency, logout } = useHotel();

  const currencies: { id: Currency; code: string; name: string; symbol: string }[] = [
    { id: "LAK", code: "LAK", name: "ກີບລາວ (Lao Kip)", symbol: "₭" },
    { id: "THB", code: "THB", name: "บาทไทย (Thai Baht)", symbol: "฿" },
    { id: "USD", code: "USD", name: "US Dollar", symbol: "$" },
  ];

  const languages: { id: Locale; label: string; subLabel: string; flag: string }[] = [
    { id: "lo", label: "ພາສາລາວ", subLabel: "Lao", flag: "🇱🇦" },
    { id: "th", label: "ภาษาไทย", subLabel: "Thai", flag: "🇹🇭" },
    { id: "en", label: "English", subLabel: "International", flag: "🇺🇸" },
  ];

  const getRoleInfo = (role?: UserRole) => {
    switch (role) {
      case "manager":
        return {
          icon: Crown,
          label: dictionary.auth.roleManager,
          badgeColor: "bg-red-500/10 text-red-600 dark:text-red-400 border-red-200 dark:border-red-900/50",
        };
      case "receptionist":
        return {
          icon: Shield,
          label: dictionary.auth.roleReception,
          badgeColor: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-200 dark:border-emerald-900/50",
        };
      case "housekeeping":
        return {
          icon: Wrench,
          label: dictionary.auth.roleHousekeeping,
          badgeColor: "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-200 dark:border-amber-900/50",
        };
      default:
        return {
          icon: User,
          label: dictionary.common.guest,
          badgeColor: "bg-muted text-muted-foreground border-border",
        };
    }
  };

  const roleInfo = getRoleInfo(user?.role);
  const RoleIcon = roleInfo.icon;

  return (
    <div className="w-full space-y-6">
      {/* 2-Column Luxury Suite Configuration Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left Column: Room Rates & Folio Currency */}
        <Card className="border-border bg-card rounded-2xl shadow-xs overflow-hidden">
          <CardHeader className="p-5 pb-3 border-b border-border/60 bg-muted/20">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="h-8 w-8 rounded-lg bg-amber-500/10 text-amber-600 dark:text-amber-400 flex items-center justify-center">
                  <Coins className="w-4 h-4" />
                </div>
                <div>
                  <CardTitle className="text-sm font-bold text-foreground">
                    {dictionary.settings.currencyGroup}
                  </CardTitle>
                  <p className="text-[11px] text-muted-foreground">
                    {dictionary.settings.currencyDesc}
                  </p>
                </div>
              </div>
              <Badge variant="outline" className="text-[10px] font-mono border-amber-500/30 text-amber-600">
                {isMounted ? currency : "LAK"}
              </Badge>
            </div>
          </CardHeader>

          <CardContent className="p-5 space-y-3">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
              {currencies.map((curr) => {
                const isSelected = (isMounted ? currency : "LAK") === curr.id;
                return (
                  <button
                    type="button"
                    key={curr.id}
                    onClick={() => setCurrency(curr.id)}
                    className={`p-3 rounded-xl border text-center transition-all cursor-pointer flex flex-col items-center justify-center gap-1.5 ${isSelected
                        ? "bg-primary/10 border-primary ring-1 ring-primary shadow-xs"
                        : "bg-background border-border/80 hover:bg-muted/40"
                      }`}
                  >
                    <span className={`h-8 w-8 rounded-full flex items-center justify-center font-bold text-sm ${isSelected ? "bg-primary text-white" : "bg-muted text-muted-foreground"
                      }`}>
                      {curr.symbol}
                    </span>
                    <span className={`text-xs font-bold ${isSelected ? "text-primary" : "text-foreground"}`}>
                      {curr.code}
                    </span>
                    <span className="text-[10px] text-muted-foreground truncate w-full text-center">
                      {curr.name}
                    </span>
                  </button>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* Right Column: Hotel Language & Day/Night Suite Ambiance */}
        <Card className="border-border bg-card rounded-2xl shadow-xs overflow-hidden">
          <CardHeader className="p-5 pb-3 border-b border-border/60 bg-muted/20">
            <div className="flex items-center gap-2.5">
              <div className="h-8 w-8 rounded-lg bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 flex items-center justify-center">
                <Globe className="w-4 h-4" />
              </div>
              <div>
                <CardTitle className="text-sm font-bold text-foreground">
                  {dictionary.settings.languageGroup} & {dictionary.settings.themeGroup}
                </CardTitle>
                <p className="text-[11px] text-muted-foreground">
                  Front desk display language and visual ambiance
                </p>
              </div>
            </div>
          </CardHeader>

          <CardContent className="p-5 space-y-4">
            {/* Language Selector Row */}
            <div className="space-y-2">
              <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider block">
                {dictionary.settings.languageGroup}
              </span>
              <div className="grid grid-cols-3 gap-2">
                {languages.map((item) => {
                  const isSelected = locale === item.id;
                  return (
                    <button
                      type="button"
                      key={item.id}
                      onClick={() => setLocale(item.id)}
                      className={`p-2.5 rounded-xl border text-center transition-all cursor-pointer flex flex-col items-center gap-1 ${isSelected
                          ? "bg-primary/10 border-primary ring-1 ring-primary shadow-xs"
                          : "bg-background border-border/80 hover:bg-muted/40"
                        }`}
                    >
                      <span className="text-xl leading-none select-none">{item.flag}</span>
                      <span className={`text-xs font-semibold ${isSelected ? "text-primary" : "text-foreground"}`}>
                        {item.label}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Theme Ambiance Selector Row */}
            <div className="space-y-2 pt-2 border-t border-border/60">
              <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider block">
                {dictionary.settings.themeGroup}
              </span>
              <div className="grid grid-cols-2 gap-2.5">
                <button
                  type="button"
                  onClick={() => setTheme("light")}
                  className={`p-3 rounded-xl border text-left transition-all cursor-pointer flex items-center gap-3 ${theme === "light"
                      ? "bg-primary/10 border-primary ring-1 ring-primary shadow-xs"
                      : "bg-background border-border/80 hover:bg-muted/40"
                    }`}
                >
                  <div className="h-9 w-9 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center shrink-0">
                    <Sun className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-xs font-bold text-foreground block">
                      {dictionary.common.lightMode}
                    </span>
                    <span className="text-[10px] text-muted-foreground block">
                      Morning Daylight Ambiance
                    </span>
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => setTheme("dark")}
                  className={`p-3 rounded-xl border text-left transition-all cursor-pointer flex items-center gap-3 ${theme === "dark"
                      ? "bg-primary/10 border-primary ring-1 ring-primary shadow-xs"
                      : "bg-background border-border/80 hover:bg-muted/40"
                    }`}
                >
                  <div className="h-9 w-9 rounded-xl bg-zinc-900 text-zinc-200 flex items-center justify-center shrink-0 border border-zinc-800">
                    <Moon className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-xs font-bold text-foreground block">
                      {dictionary.common.darkMode}
                    </span>
                    <span className="text-[10px] text-muted-foreground block">
                      Grand Midnight Ambiance
                    </span>
                  </div>
                </button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Hotel Suite Sandbox Information Strip */}
      <div className="p-4 rounded-2xl bg-card border border-border shadow-2xs flex flex-wrap items-center justify-between gap-3 text-xs text-muted-foreground">
        <div className="flex items-center gap-4 flex-wrap">
          <span className="flex items-center gap-1.5">
            <Hotel className="w-4 h-4 text-primary" />
            <span>JustGoDev Luxury Hotel Suite</span>
          </span>
          <span className="flex items-center gap-1.5">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
            <span>Client-side LocalStorage PMS Sandbox</span>
          </span>
        </div>
        <div className="text-[11px] text-muted-foreground">
          Zero-Reload Multilingual Engine • Vientiane, Laos
        </div>
      </div>
      {/* Executive Staff Keycard & Hotel Session Bar (No page title/subtitle) */}
      <div className="p-5 rounded-2xl bg-gradient-to-r from-red-950/20 via-card to-card border border-border shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="h-14 w-14 rounded-2xl bg-gradient-to-tr from-primary to-rose-600 text-white flex items-center justify-center font-bold text-lg shadow-md shrink-0">
            {isMounted && user ? (user.avatar || user.name.slice(0, 2).toUpperCase()) : "JD"}
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <span className="font-bold text-base text-foreground">
                {isMounted && user ? user.name : "Staff Concierge"}
              </span>
              <Badge variant="outline" className={`text-xs py-0.5 px-2 font-medium ${roleInfo.badgeColor}`}>
                <RoleIcon className="w-3.5 h-3.5 mr-1 inline" />
                {roleInfo.label}
              </Badge>
              <Badge variant="secondary" className="text-[10px] py-0.5 px-2 text-muted-foreground bg-muted/60 flex items-center gap-1">
                <KeyRound className="w-3 h-3 text-primary" />
                <span>Active Property Keycard</span>
              </Badge>
            </div>
            <p className="text-xs text-muted-foreground mt-1 flex items-center gap-2">
              <span>JustGoDev Luxury Hotel Suite</span>
              <span>•</span>
              <span>Staff ID: {user?.id || "HTL-01"}</span>
            </p>
          </div>
        </div>

        {/* Hotel Logout Button */}
        <Button
          variant="destructive"
          onClick={logout}
          className="h-10 px-5 text-xs font-bold gap-2 rounded-xl shadow-xs cursor-pointer shrink-0"
        >
          <LogOut className="w-4 h-4" />
          <span>{dictionary.settings.logoutButton}</span>
        </Button>
      </div>
    </div>
  );
}
