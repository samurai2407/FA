// src/utils/currency.js

const CURRENCY_SYMBOLS = {
  USD: '$',
  EUR: '€',
  GBP: '£',
  CAD: 'CA$',
  AUD: 'A$',
  INR: '₹',
};

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
