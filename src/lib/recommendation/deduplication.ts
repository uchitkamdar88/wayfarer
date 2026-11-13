import { Attraction, ActivitySlot } from '../../types/travel';

/**
 * Universal synonym and canonical mapping table.
 * Maps variations, aliases, and hyphenated slugs to their canonical attraction ID.
 */
const CANONICAL_MAPPINGS: Record<string, string> = {
  // Kashmir Valley
  'srinagar-dal-lake-shikara': 'dal-lake',
  'dal-lake-shikara': 'dal-lake',
  'dal-lake': 'dal-lake',
  'dal lake': 'dal-lake',
  'shikara ride on dal lake': 'dal-lake',
  'srinagar-nishat-bagh': 'nishat-bagh',
  'nishat-bagh': 'nishat-bagh',
  'nishat bagh': 'nishat-bagh',
  'srinagar-shalimar-bagh': 'shalimar-bagh',
  'shalimar-bagh': 'shalimar-bagh',
  'shalimar bagh': 'shalimar-bagh',
  'srinagar-shankaracharya-temple': 'shankaracharya-temple',
  'shankaracharya-temple': 'shankaracharya-temple',
  'shankaracharya temple': 'shankaracharya-temple',
  'srinagar-hazratbal-shrine': 'hazratbal-shrine',
  'hazratbal-shrine': 'hazratbal-shrine',
  'hazratbal shrine': 'hazratbal-shrine',
  'srinagar-tulip-garden': 'tulip-garden',
  'tulip-garden': 'tulip-garden',
  'tulip garden': 'tulip-garden',
  'srinagar-old-city-heritage-walk': 'srinagar-old-city',
  'old-city-heritage-walk': 'srinagar-old-city',
  'downtown heritage walk': 'srinagar-old-city',
  'lal chowk': 'srinagar-old-city',

  'gulmarg-gondola-phase-1': 'gulmarg-gondola-phase-1',
  'gondola-phase-1': 'gulmarg-gondola-phase-1',
  'kongdoori': 'gulmarg-gondola-phase-1',
  'gulmarg-gondola-phase-2': 'gulmarg-gondola-phase-2',
  'gondola-phase-2': 'gulmarg-gondola-phase-2',
  'apharwat peak': 'gulmarg-gondola-phase-2',
  'gulmarg-golf-course-heritage-church': 'gulmarg-meadow-church',
  'st marys church': 'gulmarg-meadow-church',
  'gulmarg meadow': 'gulmarg-meadow-church',

  'pahalgam-betaab-valley': 'betaab-valley',
  'betaab-valley': 'betaab-valley',
  'betaab valley': 'betaab-valley',
  'hajan valley': 'betaab-valley',
  'pahalgam-aru-valley': 'aru-valley',
  'aru-valley': 'aru-valley',
  'aru valley': 'aru-valley',
  'pahalgam-chandanwari': 'chandanwari',
  'chandanwari': 'chandanwari',
  'chandanwari snow bridge': 'chandanwari',
  'pahalgam-baisaran-valley': 'baisaran-valley',
  'baisaran-valley': 'baisaran-valley',
  'baisaran': 'baisaran-valley',
  'mini switzerland': 'baisaran-valley',

  'sonamarg-thajiwas-glacier': 'thajiwas-glacier',
  'thajiwas-glacier': 'thajiwas-glacier',
  'thajiwas glacier': 'thajiwas-glacier',
  'doodhpathri-meadow-stream': 'doodhpathri',
  'doodhpathri': 'doodhpathri',

  // Mumbai Scenario
  'mumbai-central-station': 'mumbai-central',
  'mumbai central': 'mumbai-central',
  'mumbai-central': 'mumbai-central',
  'iit-bombay-powai': 'iit-bombay',
  'iit bombay': 'iit-bombay',
  'iit bombay powai': 'iit-bombay',
  'powai-lake': 'powai-lake',
  'powai lake': 'powai-lake',
  'gateway-of-india': 'gateway-of-india',
  'gateway of india': 'gateway-of-india',
  'colaba-causeway': 'colaba-causeway',
  'colaba': 'colaba-causeway',
  'marine-drive': 'marine-drive',
  'marine drive': 'marine-drive',
  'marine drive promenade': 'marine-drive',
  'queens necklace': 'marine-drive',
  'jio-world-plaza': 'jio-world-plaza',
  'jio world plaza': 'jio-world-plaza',
  'phoenix-marketcity': 'phoenix-marketcity',
  'phoenix marketcity': 'phoenix-marketcity',
  'siddhivinayak-temple': 'siddhivinayak-temple',
  'siddhivinayak': 'siddhivinayak-temple',
  'dadar-flower-market': 'dadar-flower-market',
  'dadar': 'dadar-flower-market',
  'juhu-beach': 'juhu-beach',
  'juhu beach': 'juhu-beach',
  'borivali-national-park': 'borivali-kanheri',
  'sanjay gandhi national park': 'borivali-kanheri',
  'kanheri caves': 'borivali-kanheri',
  'borivali': 'borivali-kanheri',

  // Kerala
  'kochi-fort-kochi-chinese-nets': 'chinese-fishing-nets',
  'chinese fishing nets': 'chinese-fishing-nets',
  'kochi-mattancherry-palace': 'mattancherry-palace',
  'mattancherry palace': 'mattancherry-palace',
  'jewish synagogue': 'jew-synagogue',
  'munnar-tea-museum': 'munnar-tea-gardens',
  'tea museum': 'munnar-tea-gardens',
  'munnar-eravikulam-national-park': 'eravikulam-national-park',
  'eravikulam national park': 'eravikulam-national-park',
  'alleppey-backwater-houseboat': 'alleppey-houseboat',
  'alleppey houseboat': 'alleppey-houseboat',
  'thekkady-periyar-lake-safari': 'periyar-wildlife-safari',
  'periyar lake safari': 'periyar-wildlife-safari',
  'varkala-cliff-beach': 'varkala-cliff',
  'varkala cliff': 'varkala-cliff',

  // Rajasthan
  'jaipur-amber-fort': 'amber-fort',
  'amber fort': 'amber-fort',
  'jaipur-hawa-mahal': 'hawa-mahal',
  'hawa mahal': 'hawa-mahal',
  'udaipur-city-palace': 'udaipur-city-palace',
  'city palace udaipur': 'udaipur-city-palace',
  'udaipur-lake-pichola': 'lake-pichola',
  'lake pichola boat cruise': 'lake-pichola',
  'jodhpur-mehrangarh-fort': 'mehrangarh-fort',
  'mehrangarh fort': 'mehrangarh-fort',
  'jaisalmer-sam-sand-dunes': 'sam-sand-dunes',
  'sam sand dunes': 'sam-sand-dunes',

  // Himachal
  'himachal-hadimba-temple': 'hadimba-temple',
  'hadimba temple': 'hadimba-temple',
  'himachal-atal-tunnel': 'atal-tunnel',
  'atal tunnel': 'atal-tunnel',
  'himachal-solang-valley': 'solang-valley',
  'solang valley': 'solang-valley',
  'himachal-shimla-ridge': 'shimla-ridge',
  'the ridge shimla': 'shimla-ridge',

  // Uttarakhand
  'uttarakhand-rishikesh-ganga-aarti': 'triveni-ganga-aarti',
  'ganga aarti': 'triveni-ganga-aarti',
  'uttarakhand-corbett-safari': 'jim-corbett-safari',
  'corbett safari': 'jim-corbett-safari',
  'uttarakhand-auli-ropeway': 'auli-ropeway',
  'auli ropeway': 'auli-ropeway',

  // Sikkim
  'sikkim-tsomgo-lake': 'tsomgo-lake',
  'tsomgo lake': 'tsomgo-lake',
  'sikkim-tiger-hill': 'tiger-hill-darjeeling',
  'tiger hill': 'tiger-hill-darjeeling',
  'sikkim-rumtek-monastery': 'rumtek-monastery',
  'rumtek monastery': 'rumtek-monastery',
};

/**
 * Standardizes any attraction ID or display name to its canonical identifier.
 */
export function getCanonicalAttractionId(rawIdOrName: string): string {
  if (!rawIdOrName) return '';
  const cleaned = rawIdOrName.toLowerCase().trim().replace(/['"’]/g, '');

  if (CANONICAL_MAPPINGS[cleaned]) {
    return CANONICAL_MAPPINGS[cleaned];
  }

  // Check prefix or partial match against keys
  for (const [pattern, canonical] of Object.entries(CANONICAL_MAPPINGS)) {
    if (cleaned === pattern || cleaned.includes(pattern) || pattern.includes(cleaned)) {
      return canonical;
    }
  }

  // Fallback: slugify clean name
  return cleaned
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

/**
 * Identifies whether a location is a travel hub, overnight base, or sightseeing attraction.
 */
export function getLocationType(
  idOrName: string,
  declaredType?: 'hub' | 'base' | 'sightseeing'
): 'hub' | 'base' | 'sightseeing' {
  if (declaredType) return declaredType;

  const lower = idOrName.toLowerCase();

  // Travel Hubs
  if (
    lower.includes('airport') ||
    lower.includes('station') ||
    lower.includes('terminus') ||
    lower.includes('railway') ||
    lower.includes('terminal') ||
    lower.includes('pickup') ||
    lower.includes('dropoff')
  ) {
    return 'hub';
  }

  // Overnight Bases / Regional Hubs
  const recognizedBases = [
    'srinagar',
    'gulmarg',
    'pahalgam',
    'sonamarg',
    'doodhpathri',
    'kochi',
    'munnar',
    'alleppey',
    'thekkady',
    'varkala',
    'jaipur',
    'jodhpur',
    'udaipur',
    'jaisalmer',
    'pushkar',
    'shimla',
    'manali',
    'solang',
    'dharamshala',
    'spiti',
    'rishikesh',
    'mussoorie',
    'corbett',
    'nainital',
    'auli',
    'gangtok',
    'pelling',
    'darjeeling',
    'lachung',
    'mumbai',
    'powai',
    'south mumbai',
    'colaba',
    'bandra',
    'juhu',
  ];

  if (recognizedBases.some((b) => lower === b || lower === `${b} base`)) {
    return 'base';
  }

  return 'sightseeing';
}

/**
 * Trip-Level Visited / Scheduled Attraction Registry.
 * Enforces strict deduplication across days for sightseeing attractions,
 * while allowing travel hubs and overnight bases to appear repeatedly as needed.
 */
export class TripAttractionTracker {
  private scheduledCanonicalIds = new Map<string, number>(); // canonicalId -> dayNumber
  private allowedRevisits = new Set<string>();

  /**
   * Checks whether a sightseeing attraction has already been scheduled on any day.
   * Hubs and bases always return false (can appear multiple times).
   */
  public isScheduled(idOrName: string, declaredType?: 'hub' | 'base' | 'sightseeing'): boolean {
    const locType = getLocationType(idOrName, declaredType);
    if (locType === 'hub' || locType === 'base') {
      return false; // Travel hubs and overnight bases can appear legitimately on multiple days
    }

    const canonicalId = getCanonicalAttractionId(idOrName);
    if (this.allowedRevisits.has(canonicalId)) {
      return false;
    }

    return this.scheduledCanonicalIds.has(canonicalId);
  }

  /**
   * Records a sightseeing attraction as scheduled on a specific day.
   */
  public recordScheduled(idOrName: string, dayNumber: number, declaredType?: 'hub' | 'base' | 'sightseeing'): void {
    const locType = getLocationType(idOrName, declaredType);
    if (locType === 'hub' || locType === 'base') {
      return; // Do not lock out hubs or bases from subsequent days
    }

    const canonicalId = getCanonicalAttractionId(idOrName);
    if (!this.scheduledCanonicalIds.has(canonicalId)) {
      this.scheduledCanonicalIds.set(canonicalId, dayNumber);
    }
  }

  /**
   * Returns which day an attraction was scheduled on, if any.
   */
  public getScheduledDay(idOrName: string): number | null {
    const canonicalId = getCanonicalAttractionId(idOrName);
    return this.scheduledCanonicalIds.get(canonicalId) ?? null;
  }

  /**
   * Explicitly marks an attraction as allowed to be revisited.
   */
  public allowRevisit(idOrName: string): void {
    const canonicalId = getCanonicalAttractionId(idOrName);
    this.allowedRevisits.add(canonicalId);
  }

  /**
   * Returns all scheduled canonical IDs.
   */
  public getAllScheduled(): Set<string> {
    return new Set(this.scheduledCanonicalIds.keys());
  }

  /**
   * Resets the tracker.
   */
  public clear(): void {
    this.scheduledCanonicalIds.clear();
    this.allowedRevisits.clear();
  }
}

