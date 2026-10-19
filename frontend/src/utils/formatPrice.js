/**
 * Format a price number as Ethiopian Birr
 * e.g. 738.27 → "738.27 Birr"
 */
export function formatPrice(amount) {
  return `${Number(amount).toFixed(2)} Birr`
}

/**
 * Format price with comma separator
 * e.g. 1823.50 → "1,823.50 Birr"
 */
export function formatPriceWithComma(amount) {
  return `${Number(amount).toLocaleString('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })} Birr`
}

export const VAT_RATE = 0.15

export function calculateVAT(amount) {
  return amount * VAT_RATE
}

export function calculateTotal(subtotal) {
  return subtotal + calculateVAT(subtotal)
}
