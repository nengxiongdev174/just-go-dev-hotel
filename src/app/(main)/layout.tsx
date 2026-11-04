"use client";

import React, { useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { AppSidebar } from "@/components/shared/AppSidebar";
import { useHotel } from "@/context/HotelContext";

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, isMounted } = useHotel();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (!isMounted) return;

    // If no user session found after client hydration, redirect to login
    if (!user) {
      router.replace("/login");
      return;
    }

    // Role-based route guard
    if (user.role === "housekeeping") {
      if (pathname.startsWith("/bookings") || pathname.startsWith("/guests")) {
        router.replace("/rooms");
      }
    }
  }, [isMounted, user, router, pathname]);

  return (
    <div className="min-h-screen bg-background">
      <AppSidebar />
      <div className="lg:pl-64 flex flex-col min-h-screen">
        <main className="flex-1 p-4 sm:p-6 lg:p-8 w-full">
          {children}
        </main>
        <footer className="p-4 border-t border-border/60 text-center text-xs text-muted-foreground">
          JustGoDev Hotel Suite • Developed by Nengxiong WANGTOUAXIONG, Vientiane, Laos
        </footer>
      </div>
    </div>
  );
}
