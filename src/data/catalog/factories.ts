import {
  Attraction,
  ChecklistCategory,
  Destination,
  DestinationTravelGuide,
  DiningSuggestion,
  Hotel,
  InterestCategory,
  RegionTransfer,
} from '../../types/travel';
import { HOTEL_DISCLAIMER } from '../../lib/destination/buildBundle';

const ILLUSTRATIVE =
  'Illustrative photograph via Unsplash. It is not verified as a photo of this exact place or property.';

export function attraction(input: {
  id: string;
  destinationId: string;
  region: string;
  name: string;
  tagline: string;
  short: string;
  long?: string;
  categories: InterestCategory[];
  minutes: number;
  time: Attraction['bestTimeOfDay'];
  seasons: Attraction['seasonalSuitability'];
  access: Attraction['accessibilityRating'];
  image: string;
  tags: string[];
  lat: number;
  lng: number;
  tips: string;
  fee?: number;
  hours?: string;
}): Attraction {
  return {
    id: input.id,
    destinationId: input.destinationId,
    region: input.region,
    name: input.name,
    tagline: input.tagline,
    shortDescription: input.short,
    longDescription: input.long || input.short,
    categories: input.categories,
    recommendedDurationMinutes: input.minutes,
    entryFeeInr: input.fee ?? 0,
    openingHours: input.hours,
    bestTimeOfDay: input.time,
    seasonalSuitability: input.seasons,
    accessibilityRating: input.access,
    image: input.image,
    imageAttribution: ILLUSTRATIVE,
    tags: input.tags,
    coordinates: { lat: input.lat, lng: input.lng },
    practicalTips: input.tips,
  };
}

export function hotel(input: {
  id: string;
  destinationId: string;
  region: string;
  name: string;
  category: Hotel['category'];
  price: number;
  area: string;
  address: string;
  image: string;
  url: string;
  amenities: string[];
  highlights: string[];
}): Hotel {
  return {
    id: input.id,
    destinationId: input.destinationId,
    region: input.region,
    name: input.name,
    category: input.category,
    roomTypes: [
      {
        quality: 'standard',
        indicativePriceInr: Math.round(input.price * 0.82),
        description: 'Indicative standard-room band. Confirm the live tariff on the official site.',
      },
      {
        quality: 'deluxe',
        indicativePriceInr: input.price,
        description: 'Indicative deluxe-room band used for planning. Not a quotation.',
      },
      {
        quality: 'premium',
        indicativePriceInr: Math.round(input.price * 1.4),
        description: 'Indicative premium-room band. Suites vary more widely and are not priced here.',
      },
    ],
    basePriceInr: input.price,
    area: input.area,
    address: input.address,
    image: input.image,
    imageAttribution: ILLUSTRATIVE,
    officialUrl: input.url,
    lastReviewedDate: '2026-11-12',
    amenities: input.amenities,
    highlights: input.highlights,
    verificationDisclaimer: HOTEL_DISCLAIMER,
  };
}

export function dining(input: DiningSuggestion): DiningSuggestion {
  return input;
}

export function guide(input: {
  documents: DestinationTravelGuide['essentialDocuments'];
  transport: DestinationTravelGuide['localTransportRules'];
  etiquette: DestinationTravelGuide['culturalEtiquette'];
  checklist: ChecklistCategory[];
}): DestinationTravelGuide {
  return {
    essentialDocuments: input.documents,
    localTransportRules: input.transport,
    culturalEtiquette: input.etiquette,
    checklist: input.checklist,
  };
}

export function leg(
  from: string,
  to: string,
  distanceKm: number,
  durationHours: number,
  scenicHighlight: string,
  roadNotes: string
): RegionTransfer {
  return { from, to, distanceKm, durationHours, scenicHighlight, roadNotes };
}

export function listedDestination(
  input: Destination & { scope: 'domestic' | 'international' }
): Destination {
  return { ...input, isCurated: true };
}
