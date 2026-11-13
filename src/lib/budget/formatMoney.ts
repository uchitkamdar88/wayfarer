/** Format an indicative amount in the destination currency. Amounts are estimates, not quotes. */
export function formatMoney(amount: number, symbol = '₹', currency = 'INR'): string {
  const locale =
    currency === 'INR'
      ? 'en-IN'
      : currency === 'JPY'
      ? 'ja-JP'
      : currency === 'IDR'
      ? 'id-ID'
      : 'en-US';
  const rounded = currency === 'JPY' || currency === 'IDR' ? Math.round(amount) : Math.round(amount);
  return `${symbol}${rounded.toLocaleString(locale)}`;
}
