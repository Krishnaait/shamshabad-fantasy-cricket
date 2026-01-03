/**
 * Timezone utilities for converting GMT to IST (Indian Standard Time)
 * IST = GMT + 5:30
 */

/**
 * Format date/time in IST timezone
 * Example: "Jan 10, 2026 2:30 PM IST"
 */
export function formatIST(date: Date | string, format: 'short' | 'long' = 'short'): string {
  const gmtDate = typeof date === 'string' ? new Date(date) : date;
  
  if (format === 'short') {
    return gmtDate.toLocaleString('en-IN', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      hour12: true,
      timeZone: 'Asia/Kolkata'
    }) + ' IST';
  }
  
  return gmtDate.toLocaleString('en-IN', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
    timeZone: 'Asia/Kolkata'
  }) + ' IST';
}

/**
 * Format time only in IST
 * Example: "2:30 PM"
 */
export function formatTimeIST(date: Date | string): string {
  const gmtDate = typeof date === 'string' ? new Date(date) : date;
  return gmtDate.toLocaleString('en-IN', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
    timeZone: 'Asia/Kolkata'
  });
}

/**
 * Format date only in IST
 * Example: "Jan 10, 2026"
 */
export function formatDateIST(date: Date | string): string {
  const gmtDate = typeof date === 'string' ? new Date(date) : date;
  return gmtDate.toLocaleString('en-IN', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    timeZone: 'Asia/Kolkata'
  });
}

/**
 * Get current time in IST
 */
export function getNowIST(): Date {
  const now = new Date();
  // Create a new date with the IST timezone representation
  return new Date(now.toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' }));
}
