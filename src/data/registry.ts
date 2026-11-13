import { DestinationBundle, Destination } from '../types/travel';
import { DESTINATIONS } from './destinations';
import { kashmirBundle } from './destinations/kashmir';
import { keralaBundle } from './destinations/kerala';
import { rajasthanBundle } from './destinations/rajasthan';
import { himachalBundle } from './destinations/himachal';
import { uttarakhandBundle } from './destinations/uttarakhand';
import { sikkimBundle } from './destinations/sikkim';
import { mumbaiBundle } from './destinations/mumbai';

// Registry of fully curated destination bundles
const BUNDLE_REGISTRY: Record<string, DestinationBundle> = {
  kashmir: kashmirBundle,
  kerala: keralaBundle,
  rajasthan: rajasthanBundle,
  himachal: himachalBundle,
  uttarakhand: uttarakhandBundle,
  sikkim: sikkimBundle,
  mumbai: mumbaiBundle,
};

/**
 * Resolves the destination bundle for a given destination ID.
 * Returns null if the destination does not have a registered local dataset.
 * NEVER silently falls back to an unrelated destination!
 */
export function getDestinationBundle(destinationId: string): DestinationBundle | null {
  if (!destinationId) return null;
  const key = destinationId.toLowerCase().trim();
  return BUNDLE_REGISTRY[key] || null;
}

/**
 * Checks whether a destination is fully supported with deep datasets.
 */
export function isDestinationSupported(destinationId: string): boolean {
  if (!destinationId) return false;
  const key = destinationId.toLowerCase().trim();
  return Boolean(BUNDLE_REGISTRY[key]);
}

/**
 * Returns all destinations that have fully curated datasets.
 */
export function getSupportedDestinations(): Destination[] {
  return DESTINATIONS.filter((d) => isDestinationSupported(d.id));
}

/**
 * Returns all destinations in the catalog.
 */
export function getAllDestinations(): Destination[] {
  return DESTINATIONS;
}

/**
 * Returns the first supported destination when one is explicitly chosen by the app.
 * No destination is auto-selected by default.
 */
export function getDefaultSupportedDestination(): Destination | null {
  const supported = getSupportedDestinations();
  return supported[0] ?? null;
}
