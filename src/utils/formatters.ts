/**
 * Formats price in Indian Lakhs / Crores or thousands/month
 */
export function formatIndianPrice(amount: number, isRental: boolean = false): string {
  if (isNaN(amount) || amount === 0) return 'Price on Request';

  if (isRental) {
    return `₹${amount.toLocaleString('en-IN')}/mo`;
  }

  if (amount >= 10000000) {
    const cr = amount / 10000000;
    return `₹${cr % 1 === 0 ? cr.toFixed(0) : cr.toFixed(2)} Cr`;
  }

  if (amount >= 100000) {
    const lk = amount / 100000;
    return `₹${lk % 1 === 0 ? lk.toFixed(0) : lk.toFixed(2)} Lakhs`;
  }

  return `₹${amount.toLocaleString('en-IN')}`;
}

export function formatArea(sqft: number): string {
  if (!sqft) return 'N/A';
  return `${sqft.toLocaleString('en-IN')} sq.ft`;
}

export function formatRelativeDate(isoString: string): string {
  try {
    const diff = Date.now() - new Date(isoString).getTime();
    const hours = Math.floor(diff / (1000 * 60 * 60));
    if (hours < 1) return 'Just now';
    if (hours < 24) return `${hours}h ago`;
    const days = Math.floor(hours / 24);
    if (days === 1) return 'Yesterday';
    if (days < 30) return `${days} days ago`;
    return new Date(isoString).toLocaleDateString('en-IN', { month: 'short', day: 'numeric' });
  } catch {
    return 'Recently';
  }
}
