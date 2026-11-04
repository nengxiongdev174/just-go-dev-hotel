import { type Room, type Currency } from "@/types/hotel";

export const EXCHANGE_RATES = {
  LAK: 1,
  THB: 667.26,
  USD: 22526.17,
} as const;

export function convertFromLAK(amountLAK: number, targetCurrency: Currency): number {
  if (targetCurrency === "THB") {
    return Math.round((amountLAK / EXCHANGE_RATES.THB) * 100) / 100;
  }
  if (targetCurrency === "USD") {
    return Math.round((amountLAK / EXCHANGE_RATES.USD) * 100) / 100;
  }
  return amountLAK;
}

export function convertCurrency(amount: number, from: Currency, to: Currency): number {
  if (from === to) return amount;
  const lakAmount =
    from === "LAK"
      ? amount
      : from === "THB"
      ? amount * EXCHANGE_RATES.THB
      : amount * EXCHANGE_RATES.USD;
  return convertFromLAK(lakAmount, to);
}

export function formatCurrency(amount: number, currency: Currency): string {
  if (currency === "LAK") {
    return `₭ ${Math.round(amount).toLocaleString()}`;
  } else if (currency === "THB") {
    return `฿ ${amount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  }
  return `$ ${amount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

export function formatPriceFromLAK(amountLAK: number, targetCurrency: Currency): string {
  return formatCurrency(convertFromLAK(amountLAK, targetCurrency), targetCurrency);
}

export function getRoomPrice(room: Room, currency: Currency): number {
  if (currency === "LAK") return room.priceLAK;
  if (currency === "THB") return room.priceTHB;
  return room.priceUSD;
}

export function formatDate(dateStr: string): string {
  try {
    const d = new Date(dateStr);
    return d.toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  } catch {
    return dateStr;
  }
}
