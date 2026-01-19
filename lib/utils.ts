import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatCurrency(
  amount: number,
  currency: string = "MZN",
  locale: string = "pt-MZ"
): string {
  const currencyMap: Record<string, string> = {
    MZN: "MZN",
    USD: "USD",
    EUR: "EUR",
    BRL: "BRL",
  };

  try {
    return new Intl.NumberFormat(locale, {
      style: "currency",
      currency: currencyMap[currency] || currency,
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(amount);
  } catch (error) {
    // Fallback for unsupported currencies or locales
    const symbol = currency === "MZN" ? "MT" : currency;
    return `${symbol} ${amount.toLocaleString(locale, {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })}`;
  }
}
