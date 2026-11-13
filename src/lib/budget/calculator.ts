import {
  TripPreferences,
  Hotel,
  DayItinerary,
  TripBudgetBreakdown,
  DestinationBundle,
} from '../../types/travel';
import { getDestinationBundle } from '../../data/registry';

export function calculateTripBudget(
  prefs: TripPreferences,
  selectedHotel?: Hotel,
  days?: DayItinerary[],
  customBundle?: DestinationBundle
): TripBudgetBreakdown {
  const duration = Math.max(1, prefs.durationDays || 5);
  const adults = Math.max(1, prefs.travellers.adults || 2);
  const children = Math.max(0, prefs.travellers.children || 0);
  const totalGuests = adults + children;
  const roomsCount = Math.max(1, prefs.accommodation.roomsCount || Math.ceil(totalGuests / 2));
  const nights = Math.max(1, duration - 1);

  // Resolve destination bundle
  const bundle = customBundle || getDestinationBundle(prefs.destinationId);
  const bDefaults = bundle?.budgetDefaults || {
    flightEstimatePerPerson: 6000,
    trainEstimatePerPerson: 2000,
    privateCabPerDay: 3500,
    localExcursionsBuffer: 3500,
    foodDailyStandard: 1100,
    foodDailyVeg: 950,
    sightseeingPerPerson: 1800,
    shoppingPerPerson: 1500,
    contingencyRate: 0.07,
    currency: 'INR',
    currencySymbol: '₹',
    getAssumptions: () => [],
  };

  // 1. Onward Transport
  let onward = 0;
  if (!prefs.onwardTransport.isBooked) {
    if (prefs.onwardTransport.mode === 'air') {
      onward = totalGuests * bDefaults.flightEstimatePerPerson;
    } else if (prefs.onwardTransport.mode === 'train') {
      onward = totalGuests * bDefaults.trainEstimatePerPerson;
    } else {
      // Road
      onward = prefs.onwardTransport.roadVehicleType === 'private-cab' ? 8500 : totalGuests * 1800;
    }
  }

  // 2. Return Transport
  let returnCost = 0;
  if (!prefs.returnTransport.isBooked) {
    if (prefs.returnTransport.mode === 'air') {
      returnCost = totalGuests * bDefaults.flightEstimatePerPerson;
    } else if (prefs.returnTransport.mode === 'train') {
      returnCost = totalGuests * bDefaults.trainEstimatePerPerson;
    } else {
      returnCost = prefs.returnTransport.roadVehicleType === 'private-cab' ? 8500 : totalGuests * 1800;
    }
  }

  // 3. Accommodation
  let nightlyRate = 8500;
  if (selectedHotel) {
    nightlyRate = selectedHotel.basePriceInr;
    const matchRoom = selectedHotel.roomTypes.find((r) => r.quality === prefs.accommodation.roomQuality);
    if (matchRoom) {
      nightlyRate = matchRoom.indicativePriceInr;
    }
  } else if (prefs.accommodation.maxNightlyBudget > 0) {
    nightlyRate = prefs.accommodation.maxNightlyBudget;
  }
  const accommodation = nightlyRate * nights * roomsCount;

  // 4. Food
  let perPersonFoodDaily = bDefaults.foodDailyStandard;
  if (prefs.foodPreference === 'pure-veg' || prefs.foodPreference === 'jain') {
    perPersonFoodDaily = bDefaults.foodDailyVeg;
  } else if (prefs.foodPreference === 'vegan') {
    perPersonFoodDaily = bDefaults.foodDailyVeg + 50;
  }
  const food = perPersonFoodDaily * totalGuests * duration;

  // 5. Local Transportation
  const localTransport = bDefaults.privateCabPerDay * duration + bDefaults.localExcursionsBuffer;

  // 6. Sightseeing & Activities
  const sightseeing = bDefaults.sightseeingPerPerson * totalGuests;

  // 7. Shopping & Incidentals
  const shoppingAndIncidentals = bDefaults.shoppingPerPerson * totalGuests;

  // 8. Contingency Buffer (e.g. 7%)
  const subtotal = onward + returnCost + accommodation + food + localTransport + sightseeing + shoppingAndIncidentals;
  const contingencyBuffer = Math.round(subtotal * bDefaults.contingencyRate);

  const totalEstimate = subtotal + contingencyBuffer;
  const perPersonEstimate = Math.round(totalEstimate / totalGuests);
  const dailyAverage = Math.round(totalEstimate / duration);

  const assumptions = bDefaults.getAssumptions({
    totalGuests,
    roomsCount,
    nights,
    nightlyRate,
    perPersonFoodDaily,
    duration,
    diet: prefs.foodPreference,
  });

  return {
    onwardTransportEstimate: onward,
    returnTransportEstimate: returnCost,
    accommodationEstimate: accommodation,
    foodEstimate: food,
    localTransportEstimate: localTransport,
    sightseeingEstimate: sightseeing,
    shoppingAndIncidentals,
    contingencyBuffer,
    totalEstimate,
    perPersonEstimate,
    dailyAverage,
    assumptions,
    isUserAdjusted: false,
    currency: bDefaults.currency,
    currencySymbol: bDefaults.currencySymbol,
    contingencyRate: bDefaults.contingencyRate,
  };
}
