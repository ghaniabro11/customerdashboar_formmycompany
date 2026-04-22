import { CartLine, Money } from "@/constants/types";
import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
// Format a number into GBP currency format
export const gbp = (n: Money) =>
  new Intl.NumberFormat("en-GB", { style: "currency", currency: "GBP" }).format(n);

// Calculate the subtotal, VAT (20%), and total for an array of CartLine items
export const calc = (lines: CartLine[], fallbackVatRate = 0) => {
  const subtotal = lines.reduce((sum, line) => sum + line.price * line.qty, 0);
  const discount = lines.reduce(
    (sum, line) => sum + (line.discount ?? 0) * line.qty,
    0
  );
  const vat = lines.reduce((sum, line) => {
    if (typeof line.vat === "number") {
      return sum + line.vat * line.qty;
    }
    const netPerLine = (line.price - (line.discount ?? 0)) * line.qty;
    return sum + +(netPerLine * fallbackVatRate).toFixed(2);
  }, 0);
  const net = subtotal - discount;
  const total = +(net + vat).toFixed(2);

  return {
    subtotal: +subtotal.toFixed(2),
    discount: +discount.toFixed(2),
    vat: +vat.toFixed(2),
    total,
  };
};

/**
 * Formats a phone number for WhatsApp URL
 * Removes all non-digit characters (+, spaces, dashes, etc.)
 * @param phoneNumber - Phone number in any format (e.g., "+1 234-456-0987")
 * @returns Formatted phone number (e.g., "12344560987")
 */
export const formatPhoneForWhatsApp = (phoneNumber: string): string => {
  return phoneNumber.replace(/\D/g, "");
};

/**
 * Generates a WhatsApp URL for a phone number
 * @param phoneNumber - Phone number in any format (e.g., "+1 234-456-0987")
 * @param message - Optional pre-filled message
 * @returns WhatsApp URL (e.g., "https://wa.me/12344560987" or "https://wa.me/12344560987?text=Hello")
 */
export const getWhatsAppUrl = (
  phoneNumber: string,
  message?: string
): string => {
  const formattedPhone = formatPhoneForWhatsApp(phoneNumber);
  const baseUrl = `https://wa.me/${formattedPhone}`;
  if (message) {
    const encodedMessage = encodeURIComponent(message);
    return `${baseUrl}?text=${encodedMessage}`;
  }
  return baseUrl;
};
