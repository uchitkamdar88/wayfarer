import { DestinationBundle } from '../../types/travel';

/** Returns human-readable data problems. An empty list means the bundle is internally consistent. */
export function validateBundle(bundle: DestinationBundle): string[] {
  const errors: string[] = [];
  const dest = bundle.destination;
  const regions = new Set(dest.regions);

  if (!dest.id || !dest.name || !dest.country) errors.push('Destination identity is incomplete.');
  if (!dest.regions.length) errors.push(`${dest.id}: no regions.`);
  if (!bundle.attractions.length) errors.push(`${dest.id}: no attractions.`);
  if (!bundle.hotels.length) errors.push(`${dest.id}: no hotels.`);
  if (!bundle.dining.length) errors.push(`${dest.id}: no dining.`);
  if (!bundle.budgetDefaults.currency || !bundle.budgetDefaults.currencySymbol) {
    errors.push(`${dest.id}: currency is missing.`);
  }
  if (!Object.keys(bundle.seasonal).length) errors.push(`${dest.id}: seasonal data is missing.`);

  const attractionIds = new Set<string>();
  for (const attraction of bundle.attractions) {
    if (attraction.destinationId !== dest.id) {
      errors.push(`Attraction ${attraction.id} is tagged ${attraction.destinationId}, not ${dest.id}.`);
    }
    if (!regions.has(attraction.region)) {
      errors.push(`Attraction ${attraction.name} uses unknown region ${attraction.region}.`);
    }
    if (attractionIds.has(attraction.id)) errors.push(`Duplicate attraction id ${attraction.id}.`);
    attractionIds.add(attraction.id);
    if (attraction.coordinates) {
      const { lat, lng } = attraction.coordinates;
      if (lat < -90 || lat > 90 || lng < -180 || lng > 180) {
        errors.push(`Attraction ${attraction.name} has impossible coordinates.`);
      }
    }
  }

  const hotelIds = new Set<string>();
  for (const hotel of bundle.hotels) {
    if (hotel.destinationId !== dest.id) {
      errors.push(`Hotel ${hotel.name} is tagged ${hotel.destinationId}, not ${dest.id}.`);
    }
    if (!regions.has(hotel.region)) errors.push(`Hotel ${hotel.name} uses unknown region ${hotel.region}.`);
    if (hotelIds.has(hotel.id)) errors.push(`Duplicate hotel id ${hotel.id}.`);
    hotelIds.add(hotel.id);
    if (!hotel.officialUrl.startsWith('https://')) {
      errors.push(`Hotel ${hotel.name} is missing an https official link.`);
    }
  }

  const diningIds = new Set<string>();
  for (const place of bundle.dining) {
    if (!regions.has(place.region)) errors.push(`Dining ${place.name} uses unknown region ${place.region}.`);
    if (diningIds.has(place.id)) errors.push(`Duplicate dining id ${place.id}.`);
    diningIds.add(place.id);
  }

  for (const [from, legs] of Object.entries(bundle.regionalTransfers)) {
    if (!regions.has(from)) errors.push(`Transfer origin ${from} is not a region.`);
    for (const [to, leg] of Object.entries(legs)) {
      if (!regions.has(to)) errors.push(`Transfer destination ${to} is not a region.`);
      if (leg.from !== from || leg.to !== to) errors.push(`Transfer ${from} → ${to} labels do not match.`);
      if (leg.distanceKm <= 0 || leg.durationHours <= 0) {
        errors.push(`Transfer ${from} → ${to} needs a positive indicative distance and time.`);
      }
    }
  }

  for (const hub of bundle.regionalHubs) {
    if (!regions.has(hub.name)) errors.push(`Hub ${hub.name} is not a listed region.`);
    if (hub.x < 0 || hub.x > 100 || hub.y < 0 || hub.y > 100) {
      errors.push(`Hub ${hub.name} schematic position is outside the map.`);
    }
  }

  const sample = bundle.getSeasonForDate('2026-06-15');
  if (!sample || sample.destinationId !== dest.id) {
    errors.push(`${dest.id}: season resolver returned another destination.`);
  }

  return errors;
}
