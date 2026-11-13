import {
  TripPreferences,
  Attraction,
  DayItinerary,
  ActivitySlot,
  DiningSuggestion,
  RegionTransfer,
  Hotel,
  DestinationBundle,
} from '../../types/travel';
import { getDestinationBundle } from '../../data/registry';
import { calculateTripBudget } from '../budget/calculator';
import { TripAttractionTracker, getCanonicalAttractionId, getLocationType } from './deduplication';

/**
 * Filter dining options by region and dietary preference
 */
export function getMealSuggestion(
  bundle: DestinationBundle,
  region: string,
  foodPreference: string,
  slot: 'lunch' | 'dinner'
): DiningSuggestion {
  let matches = bundle.dining.filter((d) => d.region.toLowerCase() === region.toLowerCase());
  if (matches.length === 0) matches = bundle.dining;

  if (foodPreference === 'pure-veg' || foodPreference === 'jain') {
    const pureVeg = matches.filter((d) => d.isPureVeg);
    if (pureVeg.length > 0) {
      if (foodPreference === 'jain') {
        const jain = pureVeg.filter((d) => d.isJainFriendly);
        if (jain.length > 0) return jain[Math.floor(Math.random() * jain.length)];
      }
      return pureVeg[Math.floor(Math.random() * pureVeg.length)];
    }
  } else if (foodPreference === 'vegan') {
    const vegan = matches.filter((d) => d.isVeganFriendly);
    if (vegan.length > 0) return vegan[Math.floor(Math.random() * vegan.length)];
  }
  return matches[Math.floor(Math.random() * matches.length)];
}

/**
 * Format a calendar date string
 */
export function formatTripDate(baseDateStr: string, offsetDays: number): { iso: string; display: string } {
  const d = new Date(baseDateStr);
  if (isNaN(d.getTime())) {
    const today = new Date();
    today.setDate(today.getDate() + offsetDays + 14);
    return {
      iso: today.toISOString().split('T')[0],
      display: today.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' }),
    };
  }
  d.setDate(d.getDate() + offsetDays);
  return {
    iso: d.toISOString().split('T')[0],
    display: d.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' }),
  };
}

/**
 * Recommend hotels from the destination bundle
 */
export function recommendHotels(prefs: TripPreferences, bundle: DestinationBundle): Hotel[] {
  const targetCategory = prefs.accommodation.category;
  const targetBudget = prefs.accommodation.maxNightlyBudget;
  let candidates = [...bundle.hotels];

  if (targetCategory !== 'no-preference') {
    candidates.sort((a, b) => {
      const matchA = a.category === targetCategory ? 1 : 0;
      const matchB = b.category === targetCategory ? 1 : 0;
      return matchB - matchA;
    });
  }
  if (targetBudget > 0) {
    candidates.sort((a, b) => Math.abs(a.basePriceInr - targetBudget) - Math.abs(b.basePriceInr - targetBudget));
  }
  return candidates.slice(0, 4);
}

/**
 * Picks attraction candidates for a region, excluding already-scheduled ones and avoided ones.
 * Respects must-visits by guaranteeing them first in the priority order.
 */
function pickRegionAttractions(
  bundle: DestinationBundle,
  region: string,
  tracker: TripAttractionTracker,
  avoids: Set<string>,
  mustVisits: Set<string>,
  prefs: TripPreferences,
  season: { seasonName: string },
  maxCount: number
): Attraction[] {
  const regionAttractions = bundle.attractions.filter(
    (a) => a.region.toLowerCase() === region.toLowerCase() && !avoids.has(a.id)
  );

  const seasonKey = season.seasonName.toLowerCase().includes('winter')
    ? 'winter'
    : season.seasonName.toLowerCase().includes('summer')
    ? 'summer'
    : season.seasonName.toLowerCase().includes('monsoon')
    ? 'monsoon'
    : 'autumn';

  // Score: must-visit gets top priority, then interests, then season, then type
  regionAttractions.sort((a, b) => {
    let scoreA = 0, scoreB = 0;
    if (mustVisits.has(a.id)) scoreA += 200;
    if (mustVisits.has(b.id)) scoreB += 200;
    prefs.interests.forEach((cat) => {
      if (a.categories.includes(cat)) scoreA += 20;
      if (b.categories.includes(cat)) scoreB += 20;
    });
    if (a.seasonalSuitability.includes(seasonKey as any)) scoreA += 15;
    if (b.seasonalSuitability.includes(seasonKey as any)) scoreB += 15;
    // Prefer non-duplicate alternatives — de-prioritize entries that are alternatives to something already scheduled
    if (a.isAlternativeTo?.some((id) => tracker.getAllScheduled().has(getCanonicalAttractionId(id)))) scoreA -= 50;
    if (b.isAlternativeTo?.some((id) => tracker.getAllScheduled().has(getCanonicalAttractionId(id)))) scoreB -= 50;
    return scoreB - scoreA;
  });

  // Filter out already-scheduled sightseeing attractions
  const unscheduled = regionAttractions.filter((a) => {
    const lType = (a as any).locationType ?? 'sightseeing';
    if (lType === 'hub' || lType === 'base') return true;
    return !tracker.isScheduled(a.id, lType);
  });

  return unscheduled.slice(0, maxCount);
}

/**
 * Smart time label based on day type and sequence
 */
function slotTimeLabel(slot: 'morning' | 'afternoon' | 'evening', isTransferDay: boolean): string {
  if (slot === 'morning') return isTransferDay ? 'Early Morning' : 'Morning';
  if (slot === 'afternoon') return isTransferDay ? 'Post-Arrival Afternoon' : 'Afternoon';
  return 'Evening';
}

/**
 * Build a smart arrival day (Day 1) with minimal sightseeing — just check-in + optional light exploration
 */
function buildArrivalDay(
  bundle: DestinationBundle,
  plan: { region: string; title: string; summary: string; transferFrom?: string },
  dayIndex: number,
  prefs: TripPreferences,
  season: { seasonName: string; weatherHighlights: string[] },
  selectedHotel: Hotel,
  tracker: TripAttractionTracker,
  avoids: Set<string>,
  mustVisits: Set<string>
): DayItinerary {
  const { iso, display } = formatTripDate(prefs.departureDate, dayIndex);
  const region = plan.region;
  const lunchMeal = getMealSuggestion(bundle, region, prefs.foodPreference, 'lunch');
  const dinnerMeal = getMealSuggestion(bundle, region, prefs.foodPreference, 'dinner');

  const morning: ActivitySlot[] = [
    {
      id: `act-${dayIndex}-arrival`,
      slot: 'morning',
      time: 'Morning',
      locationType: 'hub',
      title: `Arrival in ${region} & Hotel Check-in`,
      description: `Arrive at ${prefs.onwardTransport.arrivalLocation || bundle.defaultArrivalAirport}. Meet your driver and transfer to ${selectedHotel.name}. Settle in, unpack, and enjoy a refreshing welcome.`,
      durationText: '2–3 hours',
      tips: `Check-in is typically from 12:00 PM to 2:00 PM. The front desk can store luggage if you arrive early. Take time to rest before exploring.`,
      image: selectedHotel.image,
      mealSuggestion: lunchMeal,
    },
  ];

  // Pick at most ONE light afternoon attraction for arrival day (save energy)
  const afternoonCandidates = pickRegionAttractions(bundle, region, tracker, avoids, mustVisits, prefs, season, 1);
  const afternoon: ActivitySlot[] = [];

  if (afternoonCandidates.length > 0) {
    const att = afternoonCandidates[0];
    // Only add if it has 'high' accessibility (easy for arrival day)
    if (att.accessibilityRating === 'high' || mustVisits.has(att.id)) {
      tracker.recordScheduled(att.id, dayIndex + 1, (att as any).locationType ?? 'sightseeing');
      afternoon.push({
        id: `act-${dayIndex}-a1`,
        slot: 'afternoon',
        time: 'Afternoon (optional, subject to arrival time)',
        attractionId: att.id,
        locationType: 'sightseeing',
        title: att.name,
        description: att.shortDescription,
        durationText: `~${Math.round(att.recommendedDurationMinutes / 60)} hour${att.recommendedDurationMinutes >= 120 ? 's' : ''}`,
        tips: att.practicalTips,
        image: att.image,
        tags: att.tags,
        isOptional: true,
      });
    }
  }

  const evening: ActivitySlot[] = [
    {
      id: `act-${dayIndex}-e-leisure`,
      slot: 'evening',
      time: 'Evening',
      locationType: 'base',
      title: `Evening Leisure & Dinner in ${region}`,
      description: `Rest at the hotel or take a gentle evening stroll near the property. Explore the local market or hotel's dining space for a relaxed first evening.`,
      durationText: '2 hours',
      image: selectedHotel.image || bundle.destination.heroImage,
      mealSuggestion: dinnerMeal,
      tips: 'Keep the first evening light — save energy for the days ahead.',
    },
  ];

  return {
    dayNumber: dayIndex + 1,
    date: iso,
    formattedDate: display,
    title: plan.title,
    summary: plan.summary,
    baseRegion: region,
    overnightLocation: region,
    travelInfo: `Arrival via ${prefs.onwardTransport.mode.toUpperCase()} at ${prefs.onwardTransport.arrivalLocation || bundle.defaultArrivalAirport}`,
    morning,
    afternoon,
    evening,
    dailyEstimatedCostInr: Math.round(2500 + selectedHotel.basePriceInr * 0.08),
    seasonalNotes: season.weatherHighlights[0],
  };
}

/**
 * Build a transfer day (moving between regions)
 */
function buildTransferDay(
  bundle: DestinationBundle,
  plan: { region: string; title: string; summary: string; transferFrom?: string },
  dayIndex: number,
  prefs: TripPreferences,
  season: { seasonName: string; weatherHighlights: string[] },
  selectedHotel: Hotel,
  tracker: TripAttractionTracker,
  avoids: Set<string>,
  mustVisits: Set<string>,
  transfer: RegionTransfer
): DayItinerary {
  const { iso, display } = formatTripDate(prefs.departureDate, dayIndex);
  const region = plan.region;
  const fromRegion = plan.transferFrom!;
  const dinnerMeal = getMealSuggestion(bundle, region, prefs.foodPreference, 'dinner');
  const transferAttraction =
    bundle.attractions.find((a) => a.region.toLowerCase() === region.toLowerCase()) ||
    bundle.attractions.find((a) => a.region.toLowerCase() === fromRegion.toLowerCase()) ||
    bundle.attractions[0];

  const morning: ActivitySlot[] = [
    {
      id: `act-${dayIndex}-transfer`,
      slot: 'morning',
      time: 'Morning',
      locationType: 'hub',
      title: `Road Transfer: ${fromRegion} → ${region}`,
      description: `Check out from ${fromRegion} hotel and embark on the scenic road journey to ${region}. ${transfer.scenicHighlight || ''}`,
      durationText: `~${transfer.durationHours} hour${transfer.durationHours >= 2 ? 's' : ''} drive (${transfer.distanceKm} km)`,
      tips: transfer.roadNotes,
      transferInfo: `${fromRegion} → ${region} · ${transfer.distanceKm} km · ~${transfer.durationHours} hrs`,
      image: transferAttraction?.image || bundle.destination.heroImage,
    },
  ];

  // After arrival, pick 1–2 light sightseeing activities in the destination region
  const afterArrivalCandidates = pickRegionAttractions(bundle, region, tracker, avoids, mustVisits, prefs, season, 2);
  const afternoon: ActivitySlot[] = [];
  const evening: ActivitySlot[] = [];

  afterArrivalCandidates.forEach((att, idx) => {
    tracker.recordScheduled(att.id, dayIndex + 1, (att as any).locationType ?? 'sightseeing');
    if (idx === 0) {
      afternoon.push({
        id: `act-${dayIndex}-a${idx + 1}`,
        slot: 'afternoon',
        time: 'Post-Arrival Afternoon',
        attractionId: att.id,
        locationType: 'sightseeing',
        title: att.name,
        description: att.shortDescription,
        durationText: `~${Math.round(att.recommendedDurationMinutes / 60)} hours`,
        tips: att.practicalTips,
        image: att.image,
        tags: att.tags,
      });
    } else {
      evening.push({
        id: `act-${dayIndex}-e${idx}`,
        slot: 'evening',
        time: 'Evening',
        attractionId: att.id,
        locationType: 'sightseeing',
        title: att.name,
        description: att.shortDescription,
        durationText: `~${Math.round(att.recommendedDurationMinutes / 60)} hours`,
        tips: att.practicalTips,
        image: att.image,
        mealSuggestion: dinnerMeal,
      });
    }
  });

  if (evening.length === 0) {
    evening.push({
      id: `act-${dayIndex}-e-checkin`,
      slot: 'evening',
      time: 'Evening',
      locationType: 'base',
      title: `Check-in & Evening in ${region}`,
      description: `Settle into your ${region} accommodation, freshen up, and enjoy a relaxed dinner. Rest and prepare for the full day of exploration ahead.`,
      durationText: '1–2 hours',
      image: selectedHotel.image || bundle.destination.heroImage,
      mealSuggestion: dinnerMeal,
    });
  }

  return {
    dayNumber: dayIndex + 1,
    date: iso,
    formattedDate: display,
    title: plan.title,
    summary: plan.summary,
    baseRegion: region,
    overnightLocation: region,
    travelInfo: `Transfer from ${fromRegion} to ${region} · ${transfer.distanceKm} km · ~${transfer.durationHours} hrs`,
    morning,
    afternoon,
    evening,
    transferBetweenRegions: transfer,
    dailyEstimatedCostInr: Math.round(3000 + selectedHotel.basePriceInr * 0.07 + transfer.distanceKm * 10),
    seasonalNotes: season.weatherHighlights[dayIndex % season.weatherHighlights.length],
  };
}

/**
 * Build a full sightseeing day for a region (no transfer, no arrival)
 */
function buildSightseeingDay(
  bundle: DestinationBundle,
  plan: { region: string; title: string; summary: string; transferFrom?: string },
  dayIndex: number,
  prefs: TripPreferences,
  season: { seasonName: string; weatherHighlights: string[] },
  selectedHotel: Hotel,
  tracker: TripAttractionTracker,
  avoids: Set<string>,
  mustVisits: Set<string>,
  totalDays: number
): DayItinerary {
  const { iso, display } = formatTripDate(prefs.departureDate, dayIndex);
  const region = plan.region;
  const lunchMeal = getMealSuggestion(bundle, region, prefs.foodPreference, 'lunch');
  const dinnerMeal = getMealSuggestion(bundle, region, prefs.foodPreference, 'dinner');

  // For pace: relaxed = 2 activities, balanced = 3, packed = 4
  const activityBudget = prefs.travelPace === 'relaxed' ? 2 : prefs.travelPace === 'packed' ? 4 : 3;
  const candidates = pickRegionAttractions(bundle, region, tracker, avoids, mustVisits, prefs, season, activityBudget);

  // Record all picks into tracker before building slots
  candidates.forEach((att) => {
    tracker.recordScheduled(att.id, dayIndex + 1, (att as any).locationType ?? 'sightseeing');
  });

  // Distribute into morning / afternoon / evening based on bestTimeOfDay
  const morningPicks = candidates.filter((a) => a.bestTimeOfDay === 'morning');
  const afternoonPicks = candidates.filter((a) => a.bestTimeOfDay === 'afternoon');
  const eveningPicks = candidates.filter((a) => a.bestTimeOfDay === 'evening');
  const flexPicks = candidates.filter((a) => a.bestTimeOfDay === 'flexible');

  // Smart fill: ensure each slot has content
  const morningPool = [...morningPicks, ...flexPicks.slice(0, 2)];
  const afternoonPool = [...afternoonPicks, ...flexPicks.slice(morningPool.length > 0 ? 1 : 0)];
  const eveningPool = [...eveningPicks];

  // If pools are unbalanced, redistribute
  const usedIds = new Set<string>();
  const pickOne = (pool: Attraction[]): Attraction | undefined => {
    for (const a of pool) {
      if (!usedIds.has(a.id)) { usedIds.add(a.id); return a; }
    }
    // Fall back to any available from candidates
    for (const a of candidates) {
      if (!usedIds.has(a.id)) { usedIds.add(a.id); return a; }
    }
    return undefined;
  };

  const morningAtt = pickOne(morningPool);
  const afternoonAtt = pickOne(afternoonPool);
  const eveningAtt = prefs.travelPace !== 'relaxed' ? pickOne(eveningPool) : undefined;

  const morning: ActivitySlot[] = [];
  const afternoon: ActivitySlot[] = [];
  const evening: ActivitySlot[] = [];

  if (morningAtt) {
    morning.push({
      id: `act-${dayIndex}-m1`,
      slot: 'morning',
      time: 'Morning',
      attractionId: morningAtt.id,
      locationType: 'sightseeing',
      title: morningAtt.name,
      description: morningAtt.shortDescription,
      durationText: `~${Math.round(morningAtt.recommendedDurationMinutes / 60)} hour${morningAtt.recommendedDurationMinutes >= 120 ? 's' : ''}`,
      tips: morningAtt.practicalTips,
      image: morningAtt.image,
      tags: morningAtt.tags,
      mealSuggestion: lunchMeal,
    });
  }

  if (afternoonAtt) {
    afternoon.push({
      id: `act-${dayIndex}-a1`,
      slot: 'afternoon',
      time: 'Afternoon',
      attractionId: afternoonAtt.id,
      locationType: 'sightseeing',
      title: afternoonAtt.name,
      description: afternoonAtt.shortDescription,
      durationText: `~${Math.round(afternoonAtt.recommendedDurationMinutes / 60)} hour${afternoonAtt.recommendedDurationMinutes >= 120 ? 's' : ''}`,
      tips: afternoonAtt.practicalTips,
      image: afternoonAtt.image,
      tags: afternoonAtt.tags,
    });
  }

  if (eveningAtt) {
    evening.push({
      id: `act-${dayIndex}-e1`,
      slot: 'evening',
      time: 'Evening',
      attractionId: eveningAtt.id,
      locationType: 'sightseeing',
      title: eveningAtt.name,
      description: eveningAtt.shortDescription,
      durationText: `~${Math.round(eveningAtt.recommendedDurationMinutes / 60)} hour${eveningAtt.recommendedDurationMinutes >= 120 ? 's' : ''}`,
      tips: eveningAtt.practicalTips,
      image: eveningAtt.image,
      tags: eveningAtt.tags,
      mealSuggestion: dinnerMeal,
    });
  }

  if (evening.length === 0) {
    const regionAtt = bundle.attractions.find((a) => a.region.toLowerCase() === region.toLowerCase());
    evening.push({
      id: `act-${dayIndex}-e-leisure`,
      slot: 'evening',
      time: 'Evening',
      locationType: 'base',
      title: `Evening in ${region}`,
      description: `Enjoy a leisurely evening in ${region} — explore local lanes, relax at the hotel, and have dinner at a recommended local restaurant.`,
      durationText: '2–3 hours',
      image: regionAtt?.image || selectedHotel.image || bundle.destination.heroImage,
      mealSuggestion: dinnerMeal,
    });
  }

  return {
    dayNumber: dayIndex + 1,
    date: iso,
    formattedDate: display,
    title: plan.title,
    summary: plan.summary,
    baseRegion: region,
    overnightLocation: region,
    morning,
    afternoon,
    evening,
    dailyEstimatedCostInr: Math.round(2800 + selectedHotel.basePriceInr * 0.07),
    seasonalNotes: season.weatherHighlights[dayIndex % season.weatherHighlights.length],
  };
}

/**
 * Build a departure day — minimal sightseeing, only if time allows before flight/train
 */
function buildDepartureDay(
  bundle: DestinationBundle,
  plan: { region: string; title: string; summary: string; transferFrom?: string },
  dayIndex: number,
  prefs: TripPreferences,
  season: { seasonName: string; weatherHighlights: string[] },
  selectedHotel: Hotel,
  tracker: TripAttractionTracker,
  avoids: Set<string>,
  mustVisits: Set<string>,
  transfer?: RegionTransfer
): DayItinerary {
  const { iso, display } = formatTripDate(prefs.departureDate, dayIndex);
  const region = plan.region;

  // Pick at most 1 final optional activity from the departure region if any remain
  const remainingCandidates = pickRegionAttractions(bundle, region, tracker, avoids, mustVisits, prefs, season, 1);

  const morning: ActivitySlot[] = [];
  const afternoon: ActivitySlot[] = [];
  const evening: ActivitySlot[] = [];

  if (transfer) {
    morning.push({
      id: `act-${dayIndex}-return-transfer`,
      slot: 'morning',
      time: 'Morning',
      locationType: 'hub',
      title: `Return Transfer: ${transfer.from} → ${transfer.to}`,
      description: `Check out from your hotel and begin the return road journey. ${transfer.scenicHighlight || ''} Depart with your cherished memories.`,
      durationText: `~${transfer.durationHours} hrs drive (${transfer.distanceKm} km)`,
      tips: transfer.roadNotes,
      transferInfo: `${transfer.from} → ${transfer.to} · ${transfer.distanceKm} km · ~${transfer.durationHours} hrs`,
      image: bundle.destination.heroImage,
    });
  } else {
    // Final morning in the region
    if (remainingCandidates.length > 0) {
      const att = remainingCandidates[0];
      tracker.recordScheduled(att.id, dayIndex + 1, (att as any).locationType ?? 'sightseeing');
      morning.push({
        id: `act-${dayIndex}-final-opt`,
        slot: 'morning',
        time: 'Morning (optional)',
        attractionId: att.id,
        locationType: 'sightseeing',
        title: att.name,
        description: att.shortDescription,
        durationText: `~${Math.round(att.recommendedDurationMinutes / 60)} hours`,
        tips: att.practicalTips,
        image: att.image || bundle.destination.heroImage,
        tags: att.tags,
        isOptional: true,
      });
    } else {
      morning.push({
        id: `act-${dayIndex}-m-hotel`,
        slot: 'morning',
        time: 'Morning',
        locationType: 'hub',
        title: `Hotel Checkout & Departure Preparations`,
        description: `Enjoy your final breakfast, check out of the hotel, and settle souvenirs and gifts before the airport / station transfer.`,
        durationText: '1–2 hours',
        tips: 'Keep important documents, boarding passes, and local SIM cards handy.',
        image: selectedHotel.image || bundle.destination.heroImage,
      });
    }
  }

  afternoon.push({
    id: `act-${dayIndex}-airport`,
    slot: 'afternoon',
    time: 'Afternoon',
    locationType: 'hub',
    title: `Departure Transfer to ${prefs.returnTransport.departureLocation || bundle.defaultArrivalAirport}`,
    description: `Transfer to the departure airport or railway station. Report at least 2–3 hours before the flight or train. Your journey concludes here, but the memories will last a lifetime.`,
    durationText: 'As required',
    tips: `Carry all checked baggage, verify boarding pass / ticket, and confirm any pending itinerary downloads before flight.`,
    image: bundle.destination.heroImage,
  });

  return {
    dayNumber: dayIndex + 1,
    date: iso,
    formattedDate: display,
    title: plan.title,
    summary: plan.summary,
    baseRegion: region,
    overnightLocation: undefined,
    travelInfo: `Departure via ${prefs.returnTransport.mode.toUpperCase()} from ${prefs.returnTransport.departureLocation || bundle.defaultArrivalAirport}`,
    morning,
    afternoon,
    evening,
    transferBetweenRegions: transfer,
    dailyEstimatedCostInr: Math.round(1200),
    seasonalNotes: season.weatherHighlights[dayIndex % season.weatherHighlights.length],
  };
}

/**
 * MAIN ITINERARY GENERATION ENGINE
 * — Destination-independent
 * — Full attraction deduplication via TripAttractionTracker
 * — Geographic grouping via itinerary templates
 * — Smart day-type classification (arrival / transfer / sightseeing / departure)
 * — No hardcoded destination logic
 */
export function generateItinerary(prefs: TripPreferences): {
  days: DayItinerary[];
  recommendedHotels: Hotel[];
  selectedHotel: Hotel;
  budgetBreakdown: ReturnType<typeof calculateTripBudget>;
  seasonalAdvice: ReturnType<DestinationBundle['getSeasonForDate']>;
  travelGuide: DestinationBundle['travelGuide'];
  regionalHubs: DestinationBundle['regionalHubs'];
  regionalTransfers: DestinationBundle['regionalTransfers'];
  destination: DestinationBundle['destination'];
} {
  const bundle = getDestinationBundle(prefs.destinationId);
  if (!bundle) {
    throw new Error(
      `UnsupportedDestinationError: Destination '${prefs.destinationId}' is not yet supported with curated local datasets. Cannot generate a fabricated itinerary.`
    );
  }

  const duration = Math.max(1, Math.min(14, prefs.durationDays || 5));
  const season = bundle.getSeasonForDate(prefs.departureDate);
  const hotels = recommendHotels(prefs, bundle);
  const selectedHotel = hotels[0] || bundle.hotels[0];

  const mustVisits = new Set(prefs.mustVisitAttractionIds || []);
  const avoids = new Set(prefs.avoidAttractionIds || []);

  // ---- Trip-Level Deduplication Tracker ----
  const tracker = new TripAttractionTracker();

  // ---- Resolve Region Plan ----
  let regionPlan: { region: string; title: string; summary: string; transferFrom?: string }[] = [];

  if (bundle.itineraryTemplates[duration]) {
    regionPlan = bundle.itineraryTemplates[duration];
  } else {
    const availableDurations = Object.keys(bundle.itineraryTemplates).map(Number).sort((a, b) => a - b);
    const maxDuration = availableDurations[availableDurations.length - 1] || 5;
    const baseTemplate = bundle.itineraryTemplates[maxDuration] || [];
    regionPlan = [...baseTemplate];

    // Extend if needed: rotate through regions intelligently
    for (let i = regionPlan.length; i < duration; i++) {
      const prevRegion = regionPlan[i - 1]?.region || bundle.destination.regions[0];
      // Find a region different from the last day, to avoid repetitive extension
      const otherRegions = bundle.destination.regions.filter((r) => r !== prevRegion);
      const nextRegion = otherRegions[Math.floor(i / 2) % otherRegions.length] || prevRegion;
      regionPlan.push({
        region: nextRegion,
        title: `Day ${String(i + 1).padStart(2, '0')} — Deeper Discovery of ${nextRegion}`,
        summary: `Spend extended time exploring hidden viewpoints, artisan markets, and local experiences across ${nextRegion}.`,
      });
    }
  }

  const days: DayItinerary[] = [];

  for (let i = 0; i < regionPlan.length; i++) {
    const plan = regionPlan[i];
    const isFirstDay = i === 0;
    const isLastDay = i === regionPlan.length - 1;
    const hasTransfer = !!(plan.transferFrom && plan.transferFrom !== plan.region);

    // Resolve transfer data
    let transfer: RegionTransfer | undefined;
    if (hasTransfer) {
      const fromRegion = plan.transferFrom!;
      const toRegion = plan.region;
      transfer = bundle.regionalTransfers[fromRegion]?.[toRegion];
      if (!transfer) {
        // Build a minimal transfer if no data exists
        transfer = {
          from: fromRegion,
          to: toRegion,
          distanceKm: 0,
          durationHours: 0,
        };
      }
    }

    let day: DayItinerary;

    if (isFirstDay) {
      day = buildArrivalDay(bundle, plan, i, prefs, season, selectedHotel, tracker, avoids, mustVisits);
    } else if (isLastDay) {
      day = buildDepartureDay(bundle, plan, i, prefs, season, selectedHotel, tracker, avoids, mustVisits, transfer);
    } else if (hasTransfer) {
      day = buildTransferDay(bundle, plan, i, prefs, season, selectedHotel, tracker, avoids, mustVisits, transfer!);
    } else {
      day = buildSightseeingDay(bundle, plan, i, prefs, season, selectedHotel, tracker, avoids, mustVisits, duration);
    }

    days.push(day);
  }

  const budgetBreakdown = calculateTripBudget(prefs, selectedHotel, days, bundle);

  return {
    days,
    recommendedHotels: hotels,
    selectedHotel,
    budgetBreakdown,
    seasonalAdvice: season,
    travelGuide: bundle.travelGuide,
    regionalHubs: bundle.regionalHubs,
    regionalTransfers: bundle.regionalTransfers,
    destination: bundle.destination,
  };
}
