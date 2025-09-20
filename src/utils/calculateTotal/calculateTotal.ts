export function calculateTotal(amounts: string): { total: number; error: string | null } {
  const amountArray = amounts
    .split(/[,\n]+/)
    .map((amt) => amt.trim())
    .filter((amt) => amt !== '');

  if (amountArray.length === 0) {
    return { total: 0, error: null };
  }

  const parsedAmounts = amountArray.map((amt) => parseFloat(amt));
  if (parsedAmounts.some((amt) => isNaN(amt) || amt <= 0)) {
    return { total: 0, error: 'All amounts must be valid positive numbers' };
  }

  const total = parsedAmounts.reduce((acc, curr) => acc + curr, 0);
  return { total, error: null };
}