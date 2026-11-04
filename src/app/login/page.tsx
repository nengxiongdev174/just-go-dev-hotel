"use client";

import React, { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useHotel } from "@/context/HotelContext";
import { LoginView } from "@/components/auth/LoginView";

export default function LoginPage() {
  const { user, isMounted } = useHotel();
  const router = useRouter();

  useEffect(() => {
    if (isMounted && user) {
      if (user.role === "housekeeping") {
        router.replace("/rooms");
      } else {
        router.replace("/dashboard");
      }
    }
  }, [isMounted, user, router]);

  if (!isMounted) {
    return null;
  }

  return <LoginView />;
}
