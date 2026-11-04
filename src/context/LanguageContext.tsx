"use client";

import React, { createContext, useContext, useState } from "react";
import { type Locale, type TranslationSchema } from "@/locales/types";
import { lo } from "@/locales/lo";
import { th } from "@/locales/th";
import { en } from "@/locales/en";

interface LanguageContextType {
  locale: Locale;
  setLocale: (loc: Locale) => void;
  dictionary: TranslationSchema;
}

const dictionaries: Record<Locale, TranslationSchema> = {
  lo,
  th,
  en,
};

const LanguageContext = createContext<LanguageContextType>({
  locale: "lo",
  setLocale: () => {},
  dictionary: lo,
});

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>(() => {
    if (typeof window !== "undefined") {
      try {
        const saved = localStorage.getItem("nx_hotel_lang") as Locale | null;
        if (saved === "lo" || saved === "th" || saved === "en") {
          return saved;
        }
      } catch {
        // Fallback
      }
    }
    return "lo";
  });

  const setLocale = (newLocale: Locale) => {
    setLocaleState(newLocale);
    try {
      localStorage.setItem("nx_hotel_lang", newLocale);
      document.documentElement.lang = newLocale;
    } catch {
      // Storage error
    }
  };

  return (
    <LanguageContext.Provider
      value={{
        locale,
        setLocale,
        dictionary: dictionaries[locale],
      }}
    >
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return context;
}

