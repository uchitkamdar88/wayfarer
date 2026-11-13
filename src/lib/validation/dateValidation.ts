import { getDestinationBundle } from '../../data/registry';

export interface DateValidationResult {
  isValid: boolean;
  departureDate: string;
  returnDate: string;
  durationDays: number;
  nightsCount: number;
  errors: {
    departureDate?: string;
    returnDate?: string;
  };
  warnings: string[];
  seasonInfo?: {
    seasonName: string;
    tagline: string;
    temperatureRange: string;
    snowLikelihood?: string;
    advisories: string[];
  };
  formattedRange: string;
  humanSummary: string;
}

/**
 * Format date to standard ISO YYYY-MM-DD
 */
export function toIsoString(date: Date): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

/**
 * Safe parse of YYYY-MM-DD
 */
export function parseDate(dateStr: string): Date | null {
  if (!dateStr || !/^\d{4}-\d{2}-\d{2}$/.test(dateStr)) return null;
  const [y, m, d] = dateStr.split('-').map(Number);
  const dt = new Date(y, m - 1, d);
  return isNaN(dt.getTime()) ? null : dt;
}

/**
 * Add days to an ISO string
 */
export function addDays(dateStr: string, count: number): string {
  const dt = parseDate(dateStr);
  if (!dt) return dateStr;
  dt.setDate(dt.getDate() + count);
  return toIsoString(dt);
}

/**
 * Format date to human friendly display (e.g., "May 15, 2026")
 */
export function formatDisplayDate(dateStr: string, includeDayOfWeek: boolean = true): string {
  const dt = parseDate(dateStr);
  if (!dt) return '';
  return dt.toLocaleDateString('en-US', {
    weekday: includeDayOfWeek ? 'short' : undefined,
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
}

/**
 * Real-time fluent date validation with seasonal awareness
 */
export function validateTripDates(
  departureDateStr: string,
  returnDateStr: string,
  destinationId: string = 'kashmir'
): DateValidationResult {
  const errors: { departureDate?: string; returnDate?: string } = {};
  const warnings: string[] = [];

  const dep = parseDate(departureDateStr);
  const ret = parseDate(returnDateStr);

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  if (!departureDateStr) {
    errors.departureDate = 'Please select a departure date.';
  } else if (!dep) {
    errors.departureDate = 'Invalid departure date format.';
  }

  if (!returnDateStr) {
    errors.returnDate = 'Please select a return date.';
  } else if (!ret) {
    errors.returnDate = 'Invalid return date format.';
  }

  // Duration calculation
  let durationDays = 1;
  let nightsCount = 0;

  if (dep && ret) {
    const diffTime = ret.getTime() - dep.getTime();
    const diffDays = Math.round(diffTime / (1000 * 60 * 60 * 24)) + 1;

    if (diffDays <= 0) {
      errors.returnDate = 'Return date cannot precede your departure date.';
      durationDays = 0;
      nightsCount = 0;
    } else {
      durationDays = diffDays;
      nightsCount = Math.max(0, diffDays - 1);
    }
  }

  // Past date advisory
  if (dep && dep.getTime() < today.getTime()) {
    const daysAgo = Math.round((today.getTime() - dep.getTime()) / (1000 * 60 * 60 * 24));
    warnings.push(
      `Departure is set in the past (${daysAgo} day${daysAgo === 1 ? '' : 's'} ago). Upcoming travel dates yield the most accurate seasonal advisories.`
    );
  }

  // Within 48 hours alert
  if (dep && dep.getTime() >= today.getTime()) {
    const hoursAway = (dep.getTime() - today.getTime()) / (1000 * 60 * 60);
    if (hoursAway <= 48) {
      warnings.push('Last-minute travel: Verify immediate flight/train seating and regional permit requirements.');
    }
  }

  // Single day express trip
  if (durationDays === 1 && !errors.returnDate) {
    warnings.push('Same-day trip: Recommended for city exploration or airport transit. Inter-region hill transfers require overnight stays.');
  }

  // Extended trip warning
  if (durationDays > 14) {
    warnings.push('Extended holiday: Itineraries beyond 14 days include dedicated rest days and deeper regional pacing.');
  }

  // Seasonal Intelligence resolution
  let seasonInfo: DateValidationResult['seasonInfo'];
  const bundle = getDestinationBundle(destinationId);

  if (bundle && dep) {
    try {
      const season = bundle.getSeasonForDate(departureDateStr);
      if (season) {
        seasonInfo = {
          seasonName: season.seasonName,
          tagline: season.tagline,
          temperatureRange: `${season.temperatureRangeCelsius.min}°C to ${season.temperatureRangeCelsius.max}°C`,
          snowLikelihood: season.snowfallLikelihood,
          advisories: season.roadAdvisories.slice(0, 2),
        };

        // Add weather advisory if season has extreme weather
        if (season.seasonName.toLowerCase().includes('monsoon')) {
          warnings.push('Monsoon Period: Expect lush green scenery and intermittent heavy showers. Mountain transfer buffers advised.');
        } else if (season.snowfallLikelihood === 'high') {
          warnings.push('Winter Snow Season: High alpine passes may require tyre snow chains and thermal winter layers.');
        }
      }
    } catch {
      // Fallback gracefully
    }
  }

  const isValid = Object.keys(errors).length === 0;

  const formattedRange = dep && ret && durationDays > 0
    ? `${formatDisplayDate(departureDateStr, false)} to ${formatDisplayDate(returnDateStr, false)}`
    : '';

  const humanSummary = isValid
    ? `${durationDays} Days / ${nightsCount} Night${nightsCount === 1 ? '' : 's'}${
        seasonInfo ? ` · ${seasonInfo.seasonName} (${seasonInfo.temperatureRange})` : ''
      }`
    : 'Select valid calendar dates to preview schedule';

  return {
    isValid,
    departureDate: departureDateStr,
    returnDate: returnDateStr,
    durationDays,
    nightsCount,
    errors,
    warnings,
    seasonInfo,
    formattedRange,
    humanSummary,
  };
}

/**
 * Returns default date range starting 14 days ahead with specified duration
 */
export function getDefaultDates(durationDays: number = 5): { dep: string; ret: string } {
  const d = new Date();
  d.setDate(d.getDate() + 14);
  const dep = toIsoString(d);
  const ret = addDays(dep, Math.max(0, durationDays - 1));
  return { dep, ret };
}

