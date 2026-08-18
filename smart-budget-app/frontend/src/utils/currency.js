// src/utils/currency.js

const CURRENCY_SYMBOLS = {
  USD: '$',
  EUR: '€',
  GBP: '£',
  CAD: 'CA$',
  AUD: 'A$',
  INR: '₹',
  JPY: '¥',
  CNY: '¥',
  RUB: '₽',
  LKR: 'Rs',
  BRL: 'R$',
  MXN: 'MX$',
  SGD: 'S$',
  CHF: 'CHF',
  KRW: '₩',
  AED: 'د.إ',
  SAR: '﷼',
  ZAR: 'R',
  NGN: '₦',
  PKR: '₨',
};

/**
 * Ordered list used to populate currency <select> dropdowns.
 * Add new currencies here — they'll appear everywhere automatically.
 */
export const CURRENCIES = [
  { code: 'USD', label: 'USD ($) — US Dollar' },
  { code: 'EUR', label: 'EUR (€) — Euro' },
  { code: 'GBP', label: 'GBP (£) — British Pound' },
  { code: 'INR', label: 'INR (₹) — Indian Rupee' },
  { code: 'JPY', label: 'JPY (¥) — Japanese Yen' },
  { code: 'CNY', label: 'CNY (¥) — Chinese Yuan' },
  { code: 'RUB', label: 'RUB (₽) — Russian Ruble' },
  { code: 'LKR', label: 'LKR (Rs) — Sri Lankan Rupee' },
  { code: 'CAD', label: 'CAD (CA$) — Canadian Dollar' },
  { code: 'AUD', label: 'AUD (A$) — Australian Dollar' },
  { code: 'BRL', label: 'BRL (R$) — Brazilian Real' },
  { code: 'MXN', label: 'MXN (MX$) — Mexican Peso' },
  { code: 'SGD', label: 'SGD (S$) — Singapore Dollar' },
  { code: 'CHF', label: 'CHF — Swiss Franc' },
  { code: 'KRW', label: 'KRW (₩) — South Korean Won' },
  { code: 'AED', label: 'AED (د.إ) — UAE Dirham' },
  { code: 'SAR', label: 'SAR (﷼) — Saudi Riyal' },
  { code: 'ZAR', label: 'ZAR (R) — South African Rand' },
  { code: 'NGN', label: 'NGN (₦) — Nigerian Naira' },
  { code: 'PKR', label: 'PKR (₨) — Pakistani Rupee' },
];

/**
 * Returns the symbol for a given currency code.
 * Falls back to the code itself if unknown.
 */
export function currencySymbol(code) {
  return CURRENCY_SYMBOLS[code] || code || '$';
}

/**
 * Formats a number as a currency string, e.g. "₹1,234.56"
 */
export function formatAmount(amount, currency = 'USD', decimals = 2) {
  const sym = currencySymbol(currency);
  return `${sym}${Number(amount).toLocaleString(undefined, {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  })}`;
}
