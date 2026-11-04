"use client";

import React, { useState, useSyncExternalStore } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  BedDouble,
  CalendarDays,
  Users2,
  Menu,
  X,
  Sparkles,
  Shield,
  Crown,
  Wrench,
  Settings,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/context/LanguageContext";
import { useHotel } from "@/context/HotelContext";
import { type UserRole } from "@/types/hotel";

function emptySubscribe() {
  return () => { };
}

export function AppSidebar() {
  const pathname = usePathname();
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  const isMounted = useSyncExternalStore(
    emptySubscribe,
    () => true,
    () => false
  );

  const { dictionary } = useLanguage();
  const { user } = useHotel();

  const userRole: UserRole = user?.role || "manager";

  // Role-Based Navigation filtering
  const allNavItems = [
    {
      href: "/dashboard",
      label: dictionary.common.dashboardTitle,
      icon: LayoutDashboard,
      color: "text-indigo-600 dark:text-indigo-400",
      roles: ["manager", "receptionist", "housekeeping"] as UserRole[],
    },
    {
      href: "/rooms",
      label: dictionary.common.roomsTitle,
      icon: BedDouble,
      color: "text-violet-600 dark:text-violet-400",
      roles: ["manager", "receptionist", "housekeeping"] as UserRole[],
    },
    {
      href: "/bookings",
      label: dictionary.common.bookingsTitle,
      icon: CalendarDays,
      color: "text-emerald-600 dark:text-emerald-400",
      roles: ["manager", "receptionist"] as UserRole[], // Housekeeping cannot access reservations
    },
    {
      href: "/guests",
      label: dictionary.common.guestsTitle,
      icon: Users2,
      color: "text-amber-600 dark:text-amber-400",
      roles: ["manager", "receptionist"] as UserRole[], // Housekeeping cannot access guest CRM
    },
    {
      href: "/settings",
      label: dictionary.common.settingsTitle,
      icon: Settings,
      color: "text-sky-600 dark:text-sky-400",
      roles: ["manager", "receptionist", "housekeeping"] as UserRole[],
    },
  ];

  const navItems = allNavItems.filter((item) => item.roles.includes(userRole));

  const getRoleBadge = (role: UserRole) => {
    switch (role) {
      case "manager":
        return {
          icon: Crown,
          title: dictionary.auth.roleManager,
          chipColor: "bg-indigo-500/10 text-indigo-600 dark:text-indigo-400",
        };
      case "receptionist":
        return {
          icon: Shield,
          title: dictionary.auth.roleReception,
          chipColor: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400",
        };
      case "housekeeping":
        return {
          icon: Wrench,
          title: dictionary.auth.roleHousekeeping,
          chipColor: "bg-amber-500/10 text-amber-600 dark:text-amber-400",
        };
    }
  };

  const roleInfo = getRoleBadge(userRole);
  const RoleIcon = roleInfo.icon;

  return (
    <>
      {/* Mobile Top Header */}
      <header className="lg:hidden sticky top-0 z-40 flex items-center justify-between px-4 h-14 bg-card/95 backdrop-blur-md border-b border-border shadow-xs">
        <Link href="/dashboard" className="flex items-center gap-2.5">
          <div className="h-16 w-16 bg-red-500 relative flex items-center justify-center shrink-0">
            <Image
              src="/jgd-latets-logo-no-bg.png"
              alt="JustGoDev Logo"
              width={100}
              height={100}
              className="w-full h-full object-contain"
              priority
            />
          </div>
          <div className="leading-tight">
            <span className="font-bold text-sm tracking-tight text-foreground block">
              JustGoDev
            </span>
            <span className="text-[10px] text-muted-foreground block -mt-0.5">
              Demo - Hotel
            </span>
          </div>
        </Link>
        <Button
          variant="ghost"
          size="icon-xs"
          onClick={() => setIsMobileOpen(!isMobileOpen)}
          aria-label="Toggle Navigation"
        >
          {isMobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </Button>
      </header>

      {/* Backdrop for Mobile */}
      {isMobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/40 backdrop-blur-xs lg:hidden"
          onClick={() => setIsMobileOpen(false)}
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={`fixed top-0 bottom-0 left-0 z-50 w-64 bg-card border-r border-border flex flex-col transition-transform duration-200 lg:translate-x-0 ${isMobileOpen ? "translate-x-0" : "-translate-x-full"
          }`}
      >
        {/* Brand Header */}
        <div className="p-4 border-b border-border/70 flex items-center justify-between">
          <Link
            href="/dashboard"
            onClick={() => setIsMobileOpen(false)}
            className="flex items-center gap-4 group"
          >
            <div className="w-16 relative flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
              <Image
                src="/jgd-latets-logo-no-bg.png"
                alt="JustGoDev Logo"
                width={100}
                height={100}
                className="w-full h-full object-contain"
                priority
              />
            </div>
            <div className="min-w-0">
              <span className="font-bold text-sm tracking-tight text-foreground block">
                JustGoDev
              </span>
              <p className="text-[11px] text-muted-foreground font-medium truncate">
                Demo - Hotel
              </p>
            </div>
          </Link>
          <Button
            variant="ghost"
            size="icon-xs"
            className="lg:hidden"
            onClick={() => setIsMobileOpen(false)}
          >
            <X className="w-4 h-4" />
          </Button>
        </div>

        {/* Navigation Items (Role-based) */}
        <div className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
          <div className="flex items-center justify-between px-3 pb-2">
            {/* <span className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">
              {dictionary.common.hotelOperations}
            </span> */}
            <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-md flex items-center gap-1 ${roleInfo.chipColor}`}>
              <RoleIcon className="w-3 h-3" />
              {userRole === "manager" ? dictionary.common.roleGm : userRole === "receptionist" ? dictionary.common.roleFrontDesk : dictionary.common.roleHousekeepingShort}
            </span>
          </div>

          {navItems.map((item) => {
            const isActive = pathname === item.href;
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setIsMobileOpen(false)}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-xl font-medium text-xs transition-all ${isActive
                    ? "bg-primary text-primary-foreground shadow-xs font-semibold"
                    : "text-muted-foreground hover:text-foreground hover:bg-muted/70"
                  }`}
              >
                <Icon
                  className={`w-4 h-4 shrink-0 ${isActive ? "text-primary-foreground" : item.color
                    }`}
                />
                <span className="truncate">{item.label}</span>
              </Link>
            );
          })}
        </div>

        {/* User Profile Footer (Hydration Safe & Role Highlighted) */}
        <div className="p-3 border-t border-border/70 bg-muted/20 mt-auto">
          {isMounted && user ? (
            <div className="flex items-center gap-2.5 p-2 rounded-xl bg-card border border-border shadow-xs">
              <div className="h-8 w-8 rounded-lg bg-primary/10 text-primary flex items-center justify-center font-bold text-xs shrink-0">
                {user.avatar || user.name.slice(0, 2).toUpperCase()}
              </div>
              <div className="min-w-0 flex-1">
                <p className="font-semibold text-xs truncate text-foreground leading-none">
                  {user.name}
                </p>
                <div className="flex items-center gap-1 mt-1">
                  <RoleIcon className="w-3 h-3 text-primary shrink-0" />
                  <span className="text-[10px] text-muted-foreground truncate capitalize">
                    {roleInfo.title}
                  </span>
                </div>
              </div>
            </div>
          ) : (
            <div className="h-12 w-full rounded-xl bg-muted/40 animate-pulse" />
          )}
        </div>
      </aside>
    </>
  );
}
