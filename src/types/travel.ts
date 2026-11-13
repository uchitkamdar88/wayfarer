export type DestinationId =
  | 'kashmir'
  | 'himachal'
  | 'uttarakhand'
  | 'rajasthan'
  | 'kerala'
  | 'goa'
  | 'meghalaya'
  | 'sikkim'
  | string;

export type TransportType = 'air' | 'train' | 'road';

export type HotelCategory = '3-star' | '4-star' | '5-star' | 'heritage' | 'no-preference';

export type RoomQuality = 'standard' | 'deluxe' | 'premium' | 'suite';

export type FoodPreference = 'pure-veg' | 'vegetarian' | 'jain' | 'vegan' | 'no-preference';

export type TravelPace = 'relaxed' | 'balanced' | 'packed';

export type InterestCategory =
  | 'nature'
  | 'adventure'
  | 'culture'
  | 'photography'
  | 'shopping'
  | 'spiritual'
  | 'relaxation';

export type GroupType = 'solo' | 'couple' | 'family' | 'friends';

export type MobilityRequirement =
  | 'standard'
  | 'low-walking'
  | 'elderly-friendly'
  | 'wheelchair-accessible'
  | 'infant-friendly';

export interface Destination {
  id: string;
  name: string;
  tagline: string;
  state: string;
  country: string;
  heroImage: string;
  thumbnail: string;
  overview: string;
  bestSeasons: string[];
  idealDurationDays: [number, number];
  isCurated: boolean;
  regions: string[];
  highlights: string[];
  climateSummary: string;
  /** Domestic or international catalogue grouping. */
  scope?: 'domestic' | 'international';
  timezone?: string;
  /** Discovery shelves. A destination may appear on more than one. */
  discovery?: Array<'popular' | 'trending' | 'hidden-gem'>;
  experiences?: string[];
  sources?: { name: string; url: string; reviewed: string; note?: string }[];
}

export interface TransportDetails {
  mode: TransportType;
  departureLocation: string;
  arrivalLocation: string;
  isBooked: boolean;
  roadVehicleType?: 'private-cab' | 'self-drive' | 'luxury-bus';
  estimatedHours?: number;
  departureTimePreference?: string;
}

export interface TravellerDetails {
  adults: number;
  children: number;
  rooms: number;
  groupType: GroupType;
  mobilityRequirements: MobilityRequirement;
}

export interface AccommodationPreferences {
  category: HotelCategory;
  roomQuality: RoomQuality;
  roomsCount: number;
  maxNightlyBudget: number;
  preferredArea?: string;
}

export interface TripPreferences {
  destinationId: string;
  departureDate: string;
  returnDate: string;
  durationDays: number;
  onwardTransport: TransportDetails;
  returnTransport: TransportDetails;
  travellers: TravellerDetails;
  accommodation: AccommodationPreferences;
  budgetType: 'total' | 'per-person';
  targetBudget: number;
  travelPace: TravelPace;
  foodPreference: FoodPreference;
  interests: InterestCategory[];
  mustVisitAttractionIds: string[];
  avoidAttractionIds: string[];
}

export interface Attraction {
  id: string;
  destinationId: string;
  region: string;
  name: string;
  tagline: string;
  shortDescription: string;
  longDescription: string;
  categories: InterestCategory[];
  recommendedDurationMinutes: number;
  entryFeeInr: number;
  openingHours?: string;
  bestTimeOfDay: 'morning' | 'afternoon' | 'evening' | 'flexible';
  seasonalSuitability: ('summer' | 'monsoon' | 'autumn' | 'winter')[];
  accessibilityRating: 'high' | 'moderate' | 'difficult';
  image: string;
  imageAttribution?: string;
  tags: string[];
  coordinates?: { lat: number; lng: number };
  practicalTips?: string;
  /** Canonical ID used for cross-day repeat prevention */
  canonicalId?: string;
  /** Location classification: travel hubs and overnight bases may appear repeatedly; sightseeing attractions are unique */
  locationType?: 'hub' | 'base' | 'sightseeing';
  /** Geographical micro-cluster within the region */
  subCluster?: string;
  /** Alternate names, aliases, or spelling variants */
  aliases?: string[];
  /** Canonical IDs of attractions that serve as alternatives rather than simultaneous must-dos */
  isAlternativeTo?: string[];
}

export interface RoomOption {
  quality: RoomQuality;
  indicativePriceInr: number;
  description: string;
}

export interface Hotel {
  id: string;
  destinationId: string;
  region: string;
  name: string;
  category: '3-star' | '4-star' | '5-star' | 'heritage';
  roomTypes: RoomOption[];
  basePriceInr: number;
  area: string;
  address: string;
  image: string;
  imageAttribution?: string;
  officialUrl: string;
  lastReviewedDate: string;
  amenities: string[];
  highlights: string[];
  verificationDisclaimer: string;
}

export interface DiningSuggestion {
  id: string;
  destinationId?: string;
  name: string;
  region: string;
  cuisineType: string;
  isPureVeg: boolean;
  isJainFriendly: boolean;
  isVeganFriendly?: boolean;
  recommendedDishes: string[];
  priceTier?: 'budget' | 'mid-range' | 'fine-dining';
  priceRangeInr?: string;
  location: string;
  description: string;
  pureVegHighlights?: string;
}

export interface ActivitySlot {
  id: string;
  slot: 'morning' | 'afternoon' | 'evening';
  time: string;
  attractionId?: string;
  canonicalId?: string;
  locationType?: 'hub' | 'base' | 'sightseeing';
  title: string;
  description: string;
  transferInfo?: string;
  durationText: string;
  mealSuggestion?: DiningSuggestion;
  tips?: string;
  image?: string;
  tags?: string[];
  isCustom?: boolean;
  isOptional?: boolean;
}

export interface RegionTransfer {
  from: string;
  to: string;
  distanceKm: number;
  durationHours: number;
  scenicHighlight?: string;
  roadNotes?: string;
}

export interface DayItinerary {
  dayNumber: number;
  date: string;
  formattedDate: string;
  title: string;
  summary: string;
  baseRegion: string;
  overnightLocation?: string;
  travelInfo?: string;
  morning: ActivitySlot[];
  afternoon: ActivitySlot[];
  evening: ActivitySlot[];
  optionalActivities?: ActivitySlot[];
  transferBetweenRegions?: RegionTransfer;
  dailyEstimatedCostInr: number;
  seasonalNotes?: string;
}

export interface TripBudgetBreakdown {
  onwardTransportEstimate: number;
  returnTransportEstimate: number;
  accommodationEstimate: number;
  foodEstimate: number;
  localTransportEstimate: number;
  sightseeingEstimate: number;
  shoppingAndIncidentals: number;
  contingencyBuffer: number;
  totalEstimate: number;
  perPersonEstimate: number;
  dailyAverage: number;
  assumptions: string[];
  isUserAdjusted: boolean;
  currency: string;
  currencySymbol: string;
  contingencyRate: number;
}

export interface SeasonalMonthInfo {
  month: string;
  avgHighC: number;
  avgLowC: number;
  snowExpected: boolean;
  crowdLevel: 'Low' | 'Moderate' | 'Peak';
  roadCondition: string;
  verdict: string;
}

export interface SeasonalIntelligence {
  destinationId: string;
  seasonName: string;
  tagline: string;
  monthsActive: string[];
  temperatureRangeCelsius: { min: number; max: number };
  snowfallLikelihood: 'none' | 'low' | 'moderate' | 'high';
  weatherHighlights: string[];
  packListRecommendations: string[];
  roadAdvisories: string[];
  suitabilityScore: number;
  monthlyBreakdown: SeasonalMonthInfo[];
}

export interface AssistantActionSummary {
  type: 'modify_pace' | 'replace_activity' | 'relax_day' | 'pack_day' | 'set_diet' | 'add_stop' | 'swap_days';
  description: string;
  dayNumber?: number;
}

export interface AssistantMessage {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
  timestamp: string;
  actionApplied?: AssistantActionSummary;
  suggestions?: string[];
}

export interface ChecklistItem {
  id: string;
  label: string;
  tip?: string;
  isEssential: boolean;
}

export interface ChecklistCategory {
  category: string;
  items: ChecklistItem[];
}

export interface DestinationTravelGuide {
  essentialDocuments: { title: string; detail: string; isCritical?: boolean }[];
  localTransportRules: { title: string; detail: string }[];
  culturalEtiquette: { title: string; detail: string }[];
  checklist: ChecklistCategory[];
}

export interface RegionalHub {
  name: string;
  role: string;
  altitude?: string;
  distanceFromBase: string;
  driveTime: string;
  highlights: string;
  gmapsUrl: string;
  x: number; // SVG percentage coordinate (0-100)
  y: number; // SVG percentage coordinate (0-100)
  /** Approximate published coordinates used only to lay out the schematic map. */
  coordinates?: { lat: number; lng: number };
}

export interface DestinationBudgetDefaults {
  flightEstimatePerPerson: number;
  trainEstimatePerPerson: number;
  privateCabPerDay: number;
  localExcursionsBuffer: number;
  foodDailyStandard: number;
  foodDailyVeg: number;
  sightseeingPerPerson: number;
  shoppingPerPerson: number;
  contingencyRate: number; // e.g. 0.07 (7%)
  currency: string;
  currencySymbol: string;
  /** Indicative private road transfer for the whole trip when mode is road. */
  roadPrivateEstimate?: number;
  roadSharedPerPerson?: number;
  /** Mid-range nightly room band used to seed the planner, in destination currency. */
  indicativeNightlyMid?: number;
  indicativeTripTotal?: number;
  getAssumptions: (params: {
    totalGuests: number;
    roomsCount: number;
    nights: number;
    nightlyRate: number;
    perPersonFoodDaily: number;
    duration: number;
    diet: FoodPreference;
  }) => string[];
}

export interface ItineraryTemplateDay {
  region: string;
  title: string;
  summary: string;
  transferFrom?: string;
}

export interface DestinationBundle {
  destination: Destination;
  attractions: Attraction[];
  hotels: Hotel[];
  dining: DiningSuggestion[];
  seasonal: Record<string, SeasonalIntelligence>;
  getSeasonForDate: (dateString: string) => SeasonalIntelligence;
  travelGuide: DestinationTravelGuide;
  regionalTransfers: Record<string, Record<string, RegionTransfer>>;
  regionalHubs: RegionalHub[];
  defaultOrigin: string;
  defaultArrivalAirport: string;
  defaultPreferredArea: string;
  budgetDefaults: DestinationBudgetDefaults;
  itineraryTemplates: Record<number, ItineraryTemplateDay[]>;
}

export interface GeneratedItinerary {
  id: string;
  tripPreferences: TripPreferences;
  destination: Destination;
  days: DayItinerary[];
  selectedHotel?: Hotel;
  recommendedHotels: Hotel[];
  budgetBreakdown: TripBudgetBreakdown;
  seasonalAdvice: SeasonalIntelligence;
  travelGuide: DestinationTravelGuide;
  regionalHubs: RegionalHub[];
  regionalTransfers: Record<string, Record<string, RegionTransfer>>;
  createdAt: string;
  version: number;
}
