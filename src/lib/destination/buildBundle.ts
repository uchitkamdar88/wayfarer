import {
  Attraction,
  Destination,
  DestinationBundle,
  DestinationBudgetDefaults,
  DestinationTravelGuide,
  DiningSuggestion,
  Hotel,
  ItineraryTemplateDay,
  RegionTransfer,
  RegionalHub,
  SeasonalIntelligence,
  SeasonalMonthInfo,
} from '../../types/travel';

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

export interface SeasonSpec {
  months: number[];
  seasonName: string;
  tagline: string;
  minC: number;
  maxC: number;
  snow: SeasonalIntelligence['snowfallLikelihood'];
  highlights: string[];
  pack: string[];
  roads: string[];
  score: number;
  crowd: SeasonalMonthInfo['crowdLevel'];
  roadCondition: string;
  verdict: string;
}

export interface BundleSpec {
  destination: Destination;
  routeOrder: string[];
  hubs: (Omit<RegionalHub, 'x' | 'y'> & { lat: number; lng: number })[];
  transfers: RegionTransfer[];
  attractions: Attraction[];
  hotels: Hotel[];
  dining: DiningSuggestion[];
  seasons: SeasonSpec[];
  travelGuide: DestinationTravelGuide;
  defaultOrigin: string;
  defaultArrivalAirport: string;
  defaultPreferredArea: string;
  budget: {
    currency: string;
    currencySymbol: string;
    flightEstimatePerPerson: number;
    trainEstimatePerPerson?: number;
    privateCabPerDay?: number;
    localTransportDailyCab?: number;
    localExcursionsBuffer?: number;
    foodDailyStandard?: number;
    foodDailyVeg?: number;
    foodDailyPerPerson?: number;
    sightseeingPerPerson: number;
    shoppingPerPerson?: number;
    shoppingAndIncidentalsPerPerson?: number;
    contingencyRate: number;
    assumptionNotes: string[];
  };
}

function layout(hubs: BundleSpec['hubs']): RegionalHub[] {
  const lats = hubs.map((h) => h.lat);
  const lngs = hubs.map((h) => h.lng);
  const minLat = Math.min(...lats);
  const maxLat = Math.max(...lats);
  const minLng = Math.min(...lngs);
  const maxLng = Math.max(...lngs);
  const latSpan = maxLat - minLat || 1;
  const lngSpan = maxLng - minLng || 1;

  return hubs.map((hub) => ({
    name: hub.name,
    role: hub.role,
    altitude: hub.altitude,
    distanceFromBase: hub.distanceFromBase,
    driveTime: hub.driveTime,
    highlights: hub.highlights,
    gmapsUrl: hub.gmapsUrl,
    coordinates: { lat: hub.lat, lng: hub.lng },
    x: Math.round(12 + ((hub.lng - minLng) / lngSpan) * 76),
    y: Math.round(12 + ((maxLat - hub.lat) / latSpan) * 76),
  }));
}

function bothWays(legs: RegionTransfer[]): Record<string, Record<string, RegionTransfer>> {
  const map: Record<string, Record<string, RegionTransfer>> = {};
  const add = (leg: RegionTransfer) => {
    map[leg.from] = map[leg.from] || {};
    map[leg.from][leg.to] = leg;
  };
  for (const leg of legs) {
    add(leg);
    add({
      ...leg,
      from: leg.to,
      to: leg.from,
      scenicHighlight: leg.scenicHighlight,
      roadNotes: leg.roadNotes,
    });
  }
  return map;
}

/** Spread nights along a geographic route. Longer trips return to the gateway instead of inventing a new region. */
export function distributeRegions(route: string[], duration: number): string[] {
  if (!route.length) return [];
  if (duration <= 1) return [route[0]];

  const returnsHome = duration >= route.length + 1;
  const stops = returnsHome ? [...route, route[0]] : route.slice(0, Math.min(route.length, duration));
  if (stops.length === duration) return stops;
  if (stops.length > duration) return stops.slice(0, duration);

  const counts = stops.map(() => 1);
  let extras = duration - stops.length;
  const interior = stops.map((_, i) => i).filter((i) => i !== 0 && i !== stops.length - 1);
  const targets = interior.length ? interior : [0];
  let cursor = 0;
  while (extras > 0) {
    counts[targets[cursor % targets.length]] += 1;
    cursor += 1;
    extras -= 1;
  }
  const days: string[] = [];
  stops.forEach((stop, i) => {
    for (let n = 0; n < counts[i]; n += 1) days.push(stop);
  });
  return days;
}

function buildTemplates(route: string[]): Record<number, ItineraryTemplateDay[]> {
  const templates: Record<number, ItineraryTemplateDay[]> = {};
  for (let duration = 1; duration <= 12; duration += 1) {
    const days = distributeRegions(route, duration);
    templates[duration] = days.map((region, i) => {
      const previous = i > 0 ? days[i - 1] : undefined;
      const moving = previous && previous !== region;
      const title =
        i === 0
          ? `Day ${String(i + 1).padStart(2, '0')} — Arrival in ${region}`
          : i === days.length - 1
          ? `Day ${String(i + 1).padStart(2, '0')} — ${moving ? `Travel to ${region} & ` : ''}Departure window`
          : moving
          ? `Day ${String(i + 1).padStart(2, '0')} — Transfer to ${region}`
          : `Day ${String(i + 1).padStart(2, '0')} — Another day in ${region}`;
      return {
        region,
        title,
        summary: moving
          ? `Move from ${previous} to ${region} and keep the rest of the day inside this area.`
          : i === 0
          ? `Arrive, check in, and take on only what is realistic after travel.`
          : `Stay based in ${region} so the day does not depend on a long transfer.`,
        transferFrom: moving ? previous : undefined,
      };
    });
  }
  return templates;
}

function buildSeasons(destinationId: string, seasons: SeasonSpec[]): {
  seasonal: Record<string, SeasonalIntelligence>;
  getSeasonForDate: (dateString: string) => SeasonalIntelligence;
} {
  const byMonth = new Map<number, SeasonSpec>();
  seasons.forEach((season) => season.months.forEach((month) => byMonth.set(month, season)));
  const fallback = seasons[0];

  const toIntel = (season: SeasonSpec): SeasonalIntelligence => {
    const monthlyBreakdown: SeasonalMonthInfo[] = season.months.map((month) => ({
      month: MONTHS[month - 1],
      avgHighC: season.maxC,
      avgLowC: season.minC,
      snowExpected: season.snow === 'high' || season.snow === 'moderate',
      crowdLevel: season.crowd,
      roadCondition: season.roadCondition,
      verdict: season.verdict,
    }));
    return {
      destinationId,
      seasonName: season.seasonName,
      tagline: season.tagline,
      monthsActive: season.months.map((month) => MONTHS[month - 1]),
      temperatureRangeCelsius: { min: season.minC, max: season.maxC },
      snowfallLikelihood: season.snow,
      weatherHighlights: season.highlights,
      packListRecommendations: season.pack,
      roadAdvisories: season.roads,
      suitabilityScore: season.score,
      monthlyBreakdown,
    };
  };

  const seasonal: Record<string, SeasonalIntelligence> = {};
  seasons.forEach((season) => {
    seasonal[season.seasonName] = toIntel(season);
  });

  const getSeasonForDate = (dateString: string): SeasonalIntelligence => {
    const parsed = new Date(dateString);
    const month = Number.isNaN(parsed.getTime()) ? 1 : parsed.getMonth() + 1;
    return toIntel(byMonth.get(month) || fallback);
  };

  return { seasonal, getSeasonForDate };
}

export const HOTEL_DISCLAIMER =
  'Indicative nightly band only, reviewed 12 Nov 2026. This is not a live rate, availability check, or star-rating audit. Open the official site and confirm the tariff before you travel.';

export function buildDestinationBundle(spec: BundleSpec): DestinationBundle {
  const { seasonal, getSeasonForDate } = buildSeasons(spec.destination.id, spec.seasons);
  const symbol = spec.budget.currencySymbol || '₹';
  const rawBudget = spec.budget as any;
  const foodDaily = rawBudget.foodDailyStandard || rawBudget.foodDailyPerPerson || 1200;
  const foodVeg = rawBudget.foodDailyVeg || rawBudget.foodDailyPerPerson || 1000;
  const cabDaily = rawBudget.privateCabPerDay || rawBudget.localTransportDailyCab || 3600;
  const shopping = rawBudget.shoppingPerPerson || rawBudget.shoppingAndIncidentalsPerPerson || 2000;

  const budgetDefaults: DestinationBudgetDefaults = {
    ...spec.budget,
    flightEstimatePerPerson: rawBudget.flightEstimatePerPerson || 6000,
    trainEstimatePerPerson: rawBudget.trainEstimatePerPerson || 2200,
    privateCabPerDay: cabDaily,
    localExcursionsBuffer: rawBudget.localExcursionsBuffer || 1500,
    foodDailyStandard: foodDaily,
    foodDailyVeg: foodVeg,
    sightseeingPerPerson: rawBudget.sightseeingPerPerson || 2200,
    shoppingPerPerson: shopping,
    contingencyRate: rawBudget.contingencyRate || 0.08,
    currency: rawBudget.currency || 'INR',
    currencySymbol: symbol,
    getAssumptions: ({ totalGuests, roomsCount, nights, nightlyRate, perPersonFoodDaily, duration, diet }) => {
      const foodRate = perPersonFoodDaily ?? foodVeg;
      const roomRate = nightlyRate ?? 8500;
      return [
        `Figures are indicative estimates in ${spec.budget.currency}, not confirmed prices or live availability.`,
        `Transport estimates assume ${totalGuests} travellers. Mark a sector as already booked to remove it from the total.`,
        `Accommodation uses ${roomsCount} room(s) for ${nights} night(s) at about ${symbol}${roomRate.toLocaleString('en-US')} per night.`,
        `Food uses about ${symbol}${foodRate.toLocaleString('en-US')} per person per day for a ${diet} preference. A missing dietary match is left unmatched rather than replaced with another destination.`,
        `Local transport covers about ${duration} days of destination transport using published fare bands where they exist.`,
        ...spec.budget.assumptionNotes,
        `A ${Math.round(spec.budget.contingencyRate * 100)}% contingency is included because these are estimates.`,
      ];
    },
  };

  return {
    destination: spec.destination,
    attractions: spec.attractions,
    hotels: spec.hotels,
    dining: spec.dining,
    seasonal,
    getSeasonForDate,
    travelGuide: spec.travelGuide,
    regionalTransfers: bothWays(spec.transfers),
    regionalHubs: layout(spec.hubs),
    defaultOrigin: spec.defaultOrigin,
    defaultArrivalAirport: spec.defaultArrivalAirport,
    defaultPreferredArea: spec.defaultPreferredArea,
    budgetDefaults,
    itineraryTemplates: buildTemplates(spec.routeOrder),
  };
}
