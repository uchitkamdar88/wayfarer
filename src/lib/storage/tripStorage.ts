import { GeneratedItinerary, TripPreferences } from '../../types/travel';

export interface SavedTripSummary {
  id: string;
  name: string;
  destinationId: string;
  destinationName: string;
  durationDays: number;
  departureDate: string;
  returnDate: string;
  totalBudgetInr: number;
  savedAt: string;
  itinerary: GeneratedItinerary;
}

const STORAGE_KEY_ACTIVE = 'WAYFARER_ACTIVE_TRIP_V1';
const STORAGE_KEY_LIBRARY = 'WAYFARER_SAVED_TRIPS_V1';

/**
 * Autosaves the active itinerary and trip preferences to localStorage.
 */
export function persistActiveTrip(
  itinerary: GeneratedItinerary | null,
  preferences: TripPreferences | null
): void {
  try {
    if (!itinerary || !preferences) {
      localStorage.removeItem(STORAGE_KEY_ACTIVE);
      return;
    }
    const payload = JSON.stringify({ itinerary, preferences, savedAt: new Date().toISOString() });
    localStorage.setItem(STORAGE_KEY_ACTIVE, payload);
  } catch (err) {
    console.warn('[WAYFARER Storage] Failed to autosave active trip to localStorage:', err);
  }
}

/**
 * Restores the active trip from localStorage upon page reload.
 */
export function restoreActiveTrip(): {
  itinerary: GeneratedItinerary | null;
  preferences: TripPreferences | null;
} {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_ACTIVE);
    if (!raw) return { itinerary: null, preferences: null };
    const parsed = JSON.parse(raw);
    if (parsed && parsed.itinerary && parsed.preferences) {
      return {
        itinerary: parsed.itinerary as GeneratedItinerary,
        preferences: parsed.preferences as TripPreferences,
      };
    }
  } catch (err) {
    console.warn('[WAYFARER Storage] Failed to restore active trip:', err);
  }
  return { itinerary: null, preferences: null };
}

/**
 * Clears the active trip session from localStorage.
 */
export function clearActiveTripStorage(): void {
  try {
    localStorage.removeItem(STORAGE_KEY_ACTIVE);
  } catch (err) {
    console.warn('[WAYFARER Storage] Failed to clear active trip:', err);
  }
}

/**
 * Loads the library of saved trips.
 */
export function getSavedTripsLibrary(): SavedTripSummary[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_LIBRARY);
    if (!raw) return [];
    return JSON.parse(raw) as SavedTripSummary[];
  } catch (err) {
    console.warn('[WAYFARER Storage] Failed to load saved trips library:', err);
    return [];
  }
}

/**
 * Saves or updates an itinerary in the user's permanent saved trips library.
 */
export function saveTripToLibrary(
  itinerary: GeneratedItinerary,
  customName?: string
): SavedTripSummary {
  const library = getSavedTripsLibrary();
  const title =
    customName ||
    `${itinerary.destination.name} ${itinerary.days.length}-Day Expedition (${new Date(
      itinerary.tripPreferences.departureDate
    ).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })})`;

  const existingIdx = library.findIndex((t) => t.id === itinerary.id);

  const entry: SavedTripSummary = {
    id: itinerary.id,
    name: title,
    destinationId: itinerary.destination.id,
    destinationName: itinerary.destination.name,
    durationDays: itinerary.days.length,
    departureDate: itinerary.tripPreferences.departureDate,
    returnDate: itinerary.tripPreferences.returnDate,
    totalBudgetInr: itinerary.budgetBreakdown.totalEstimate,
    savedAt: new Date().toISOString(),
    itinerary,
  };

  if (existingIdx >= 0) {
    library[existingIdx] = entry;
  } else {
    library.unshift(entry);
  }

  try {
    localStorage.setItem(STORAGE_KEY_LIBRARY, JSON.stringify(library));
  } catch (err) {
    console.warn('[WAYFARER Storage] Failed to save trip to library:', err);
  }

  return entry;
}

/**
 * Deletes a trip from the saved library.
 */
export function deleteTripFromLibrary(id: string): boolean {
  const library = getSavedTripsLibrary();
  const filtered = library.filter((t) => t.id !== id);
  try {
    localStorage.setItem(STORAGE_KEY_LIBRARY, JSON.stringify(filtered));
    return true;
  } catch (err) {
    console.warn('[WAYFARER Storage] Failed to delete trip:', err);
    return false;
  }
}

/**
 * Duplicates a saved trip with a new ID.
 */
export function duplicateTripInLibrary(id: string): SavedTripSummary | null {
  const library = getSavedTripsLibrary();
  const original = library.find((t) => t.id === id);
  if (!original) return null;

  const newId = `trip-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`;
  const clonedItinerary: GeneratedItinerary = JSON.parse(JSON.stringify(original.itinerary));
  clonedItinerary.id = newId;

  const duplicatedEntry: SavedTripSummary = {
    ...original,
    id: newId,
    name: `${original.name} (Copy)`,
    savedAt: new Date().toISOString(),
    itinerary: clonedItinerary,
  };

  library.unshift(duplicatedEntry);
  try {
    localStorage.setItem(STORAGE_KEY_LIBRARY, JSON.stringify(library));
    return duplicatedEntry;
  } catch (err) {
    console.warn('[WAYFARER Storage] Failed to duplicate trip:', err);
    return null;
  }
}

/**
 * Exports all saved trips as a JSON string for offline backup.
 */
export function exportTripsAsJson(): string {
  const library = getSavedTripsLibrary();
  return JSON.stringify(library, null, 2);
}

/**
 * Imports saved trips from a JSON string backup.
 */
export function importTripsFromJson(jsonStr: string): { success: boolean; count: number } {
  try {
    const parsed = JSON.parse(jsonStr);
    if (!Array.isArray(parsed)) return { success: false, count: 0 };
    const library = getSavedTripsLibrary();
    const existingIds = new Set(library.map((t) => t.id));
    let addedCount = 0;

    parsed.forEach((item: any) => {
      if (item && item.id && item.itinerary && !existingIds.has(item.id)) {
        library.push(item);
        existingIds.add(item.id);
        addedCount++;
      }
    });

    localStorage.setItem(STORAGE_KEY_LIBRARY, JSON.stringify(library));
    return { success: true, count: addedCount };
  } catch (err) {
    console.warn('[WAYFARER Storage] Failed to import trips:', err);
    return { success: false, count: 0 };
  }
}

