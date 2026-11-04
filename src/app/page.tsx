"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useHotel } from "@/context/HotelContext";

export default function RootPage() {
  const router = useRouter();
  const { user, isMounted } = useHotel();

  useEffect(() => {
    if (!isMounted) return;

    if (user) {
      if (user.role === "housekeeping") {
        router.replace("/rooms");
      } else if (user.role === "receptionist") {
        router.replace("/bookings");
      } else {
        router.replace("/dashboard");
      }
    } else {
      router.replace("/login");
    }
  }, [isMounted, user, router]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="flex flex-col items-center gap-3">
        <div className="h-10 w-10 rounded-xl bg-primary animate-pulse" />
        <p className="text-xs text-muted-foreground font-medium">
          Loading JustGoDev Hotel Suite...
        </p>
      </div>
    </div>
  );
}
