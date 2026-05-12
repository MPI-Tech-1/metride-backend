/**
 * Paystack (and this app's booking payment fields) use **kobo** as the minor unit for NGN (1 ₦ = 100 kobo).
 */
export default function formatKoboToNairaDisplay(kobo: unknown): string {
  if (kobo === null || kobo === undefined) {
    return 'N/A'
  }
  const num = typeof kobo === 'number' ? kobo : Number(kobo)
  if (Number.isNaN(num)) {
    return 'N/A'
  }
  const naira = num / 100
  return `₦${naira.toLocaleString('en-NG', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`
}
