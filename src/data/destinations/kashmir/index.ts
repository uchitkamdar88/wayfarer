import { DestinationBundle, Destination, RegionalHub, RegionTransfer, ItineraryTemplateDay } from '../../../types/travel';
import { KASHMIR_ATTRACTIONS } from '../../kashmirAttractions';
import { KASHMIR_HOTELS } from '../../kashmirHotels';
import { KASHMIR_DINING } from '../../diningKashmir';
import { KASHMIR_SEASONAL_INTELLIGENCE, getSeasonForDate as getKashmirSeasonForDate } from '../../kashmirSeasonal';
import { KASHMIR_TRAVEL_GUIDE } from '../../kashmirTravelGuide';

export const KASHMIR_DESTINATION: Destination = {
  id: 'kashmir',
  name: 'Kashmir Valley',
  tagline: 'Paradise on Earth — Alpine Meadows, Chinar Groves & Pristine Lakes',
  state: 'Jammu & Kashmir',
  country: 'India',
  heroImage: 'https://images.unsplash.com/photo-1595815771614-ade9d652a65d?auto=format&fit=crop&w=1920&q=80',
  thumbnail: 'https://images.unsplash.com/photo-1595815771614-ade9d652a65d?auto=format&fit=crop&w=600&q=80',
  overview:
    'Framed by the snow-capped Pir Panjal and Himalayan ranges, the Kashmir Valley weaves together historic Mughal terraced gardens, serene Dal Lake shikara journeys, alpine meadows of Gulmarg, and the roaring Lidder River in Pahalgam.',
  bestSeasons: ['Spring (Apr)', 'Summer (May–Jun)', 'Autumn (Oct–Nov)', 'Winter (Dec–Feb)'],
  idealDurationDays: [4, 8],
  isCurated: true,
  regions: ['Srinagar', 'Gulmarg', 'Pahalgam', 'Sonamarg', 'Doodhpathri'],
  highlights: [
    'Sunset Shikara ride on tranquil Dal Lake',
    'Ascent on Gulmarg Gondola to Apharwat Peak (3,980m)',
    'Pine-carpeted valleys of Betaab & Aru in Pahalgam',
    'Centuries-old Nishat & Shalimar Mughal terraced gardens',
    'Authentic Kashmiri Kahwa infused with saffron and almonds',
  ],
  climateSummary: 'Temperate alpine climate. Summers are pleasant (15°C–28°C); Winters bring heavy snowfall and sub-zero temperatures (-5°C to 8°C).',
};

export const KASHMIR_REGIONAL_HUBS: RegionalHub[] = [
  {
    name: 'Srinagar',
    role: 'Valley Hub & Summer Capital',
    altitude: '1,585m',
    distanceFromBase: '0 km (Central Base)',
    driveTime: 'Base Hub',
    highlights: 'Dal Lake, Shikaras, Nishat & Shalimar Mughal Terraces, Shankaracharya Hill',
    gmapsUrl: 'https://www.google.com/maps/place/Srinagar,+Jammu+and+Kashmir/',
    x: 50,
    y: 50,
  },
  {
    name: 'Gulmarg',
    role: 'Meadow of Flowers & High Gondola',
    altitude: '2,650m – 3,980m',
    distanceFromBase: '52 km North-West',
    driveTime: '~1.5 hrs via Tangmarg',
    highlights: 'World-famous Gondola (Phases 1 & 2), St. Mary’s Church, Apharwat Peak',
    gmapsUrl: 'https://www.google.com/maps/place/Gulmarg,+Jammu+and+Kashmir/',
    x: 25,
    y: 35,
  },
  {
    name: 'Pahalgam',
    role: 'Valley of Shepherds & Lidder River',
    altitude: '2,130m',
    distanceFromBase: '92 km South-East',
    driveTime: '~2.5 hrs via Pampore & Awantipora',
    highlights: 'Betaab Valley, Aru Valley, Chandanwari, Lidder River walks, Baisaran',
    gmapsUrl: 'https://www.google.com/maps/place/Pahalgam,+Jammu+and+Kashmir/',
    x: 75,
    y: 75,
  },
  {
    name: 'Sonamarg',
    role: 'Meadow of Gold & Gateway to Ladakh',
    altitude: '2,740m',
    distanceFromBase: '80 km North-East',
    driveTime: '~2.5 hrs via Kangan along Sindh River',
    highlights: 'Thajiwas Glacier, Sindh River torrents, alpine meadows',
    gmapsUrl: 'https://www.google.com/maps/place/Sonamarg,+Jammu+and+Kashmir/',
    x: 75,
    y: 25,
  },
  {
    name: 'Doodhpathri',
    role: 'Valley of Milk & Shaliganga Waters',
    altitude: '2,730m',
    distanceFromBase: '42 km South-West',
    driveTime: '~1.5 hrs via Budgam countryside',
    highlights: 'Shaliganga frothy white stream, untouched deodar pine glades',
    gmapsUrl: 'https://www.google.com/maps/place/Doodhpathri,+Jammu+and+Kashmir/',
    x: 35,
    y: 65,
  },
];

export const KASHMIR_TRANSFERS: Record<string, Record<string, RegionTransfer>> = {
  Srinagar: {
    Gulmarg: {
      from: 'Srinagar',
      to: 'Gulmarg',
      distanceKm: 52,
      durationHours: 1.5,
      scenicHighlight: 'Passing through apple orchards of Baramulla and ascending the winding deodar slopes of Tangmarg.',
      roadNotes: 'Tangmarg to Gulmarg is a scenic 12 km hill climb. In winter, snow chains are required.',
    },
    Pahalgam: {
      from: 'Srinagar',
      to: 'Pahalgam',
      distanceKm: 92,
      durationHours: 2.5,
      scenicHighlight: 'Saffron fields of Pampore, historic Awantipora ruins (9th century), and cricket bat willow workshops along NH44.',
      roadNotes: 'Broad four-lane highway up to Anantnag/Khanabal, followed by a gentle scenic riverside ascent along the Lidder River.',
    },
    Sonamarg: {
      from: 'Srinagar',
      to: 'Sonamarg',
      distanceKm: 80,
      durationHours: 2.5,
      scenicHighlight: 'Tracing the roaring Sindh River through the scenic villages of Kangan and Gund beneath soaring walnut groves.',
      roadNotes: 'National Highway 1D towards Ladakh. Open late spring through autumn; winter access restricted by snow.',
    },
    Doodhpathri: {
      from: 'Srinagar',
      to: 'Doodhpathri',
      distanceKm: 42,
      durationHours: 1.5,
      scenicHighlight: 'Passing pastoral Kashmiri hamlets of Budgam and pristine pine forests untouched by commercial stalls.',
      roadNotes: 'Paved, gentle rural countryside road with pleasant pine forest curves.',
    },
  },
  Gulmarg: {
    Pahalgam: {
      from: 'Gulmarg',
      to: 'Pahalgam',
      distanceKm: 140,
      durationHours: 3.5,
      scenicHighlight: 'Descent through Tangmarg, crossing the Kashmir valley floor via Sangam and joining the rushing Lidder River.',
      roadNotes: 'Start early around 08:30 AM to arrive in Pahalgam for a relaxed late lunch by the river.',
    },
    Srinagar: {
      from: 'Gulmarg',
      to: 'Srinagar',
      distanceKm: 52,
      durationHours: 1.5,
      scenicHighlight: 'Scenic mountain descent back into the summer capital with views over Dal Lake approaches.',
      roadNotes: 'Clear drive taking roughly 90 minutes.',
    },
  },
  Pahalgam: {
    Srinagar: {
      from: 'Pahalgam',
      to: 'Srinagar',
      distanceKm: 92,
      durationHours: 2.5,
      scenicHighlight: 'Lidder river valley descent, stop for fresh saffron in Pampore and traditional Kashmiri walnut dry fruits.',
      roadNotes: 'Smooth drive along the Lidder and Jhelum plains.',
    },
  },
};

export const KASHMIR_TEMPLATES: Record<number, ItineraryTemplateDay[]> = {
  1: [
    {
      region: 'Srinagar',
      title: 'Arrival in Srinagar & Dal Lake Splendor',
      summary: 'Immerse yourself in Dal Lake, the ancient Shankaracharya temple, and imperial Mughal gardens.',
    },
  ],
  2: [
    {
      region: 'Srinagar',
      title: 'Arrival, Mughal Heritage & Dal Lake Shikara',
      summary: 'Explore Nishat Bagh, historic wooden architecture, and sunset on tranquil Dal Lake.',
    },
    {
      region: 'Gulmarg',
      title: 'Gulmarg Alpine Meadows & Gondola Peak',
      summary: 'Ascend to Kongdoori and Apharwat Peak on the world’s second-highest cable car.',
      transferFrom: 'Srinagar',
    },
  ],
  3: [
    {
      region: 'Srinagar',
      title: 'Arrival in Srinagar & Dal Lake Shikara Journey',
      summary: 'Welcome to the valley and unwind on Dal Lake with a shikara ride past historic wooden houseboats.',
    },
    {
      region: 'Gulmarg',
      title: 'Gulmarg Day Excursion: The High Himalayan Gondola',
      summary: 'A breathtaking ascent over alpine fir forests to Apharwat Peak at 3,980m and the 1902 St. Mary’s Church.',
      transferFrom: 'Srinagar',
    },
    {
      region: 'Pahalgam',
      title: 'Pahalgam: The Valley of Shepherds & Lidder Waters',
      summary: 'Explore Betaab Valley and Aru Valley along the roaring turquoise Lidder River.',
      transferFrom: 'Srinagar',
    },
  ],
  4: [
    {
      region: 'Srinagar',
      title: 'Arrival in Srinagar & Sunset on Dal Lake',
      summary: 'Check into your accommodation, unwind, and experience a magical twilight shikara glide past floating gardens.',
    },
    {
      region: 'Gulmarg',
      title: 'Alpine Splendor: Gulmarg Gondola & Meadow Trails',
      summary: 'Ascend to Phase 1 and Phase 2 at Apharwat Peak, explore the historic golf course and Victorian stone church.',
      transferFrom: 'Srinagar',
    },
    {
      region: 'Pahalgam',
      title: 'The Whispering Pines: Betaab & Aru Valleys',
      summary: 'Marvel at cinematic alpine meadows, pristine Lidder mountain streams, and pine-clad slopes in Pahalgam.',
      transferFrom: 'Srinagar',
    },
    {
      region: 'Srinagar',
      title: 'Mughal Grandeur, Old City Bazaars & Departure',
      summary: 'Ascend Shankaracharya Hill for panoramic valley views, stroll Nishat Bagh, and shop for authentic GI-tagged saffron.',
      transferFrom: 'Pahalgam',
    },
  ],
  5: [
    {
      region: 'Srinagar',
      title: 'Day 01 — Arrival in Srinagar & Sunset Shikara on Dal Lake',
      summary: 'Arrive at Sheikh ul-Alam International Airport, transfer to your hotel, and embark on a twilight Shikara ride.',
    },
    {
      region: 'Gulmarg',
      title: 'Day 02 — Gulmarg Alpine Ascent & Snow Vistas',
      summary: 'Explore Gulmarg’s high-altitude Gondola to Apharwat Peak (3,980m), St. Mary’s Church, and the alpine meadow.',
      transferFrom: 'Srinagar',
    },
    {
      region: 'Pahalgam',
      title: 'Day 03 — Journey to Pahalgam via Saffron Fields & Lidder Valley',
      summary: 'Scenic transfer past Pampore saffron fields and Awantipora ruins, with a visit to Betaab Valley.',
      transferFrom: 'Srinagar',
    },
    {
      region: 'Pahalgam',
      title: 'Day 04 — Aru Valley, Pine Trails & Baisaran Meadow',
      summary: 'Breathe in crisp mountain air in unspoiled Aru village, stroll along the Lidder River, and visit local craft stalls.',
    },
    {
      region: 'Srinagar',
      title: 'Day 05 — Mughal Terraced Gardens & Heritage Departure',
      summary: 'Return to Srinagar. Explore Nishat Bagh, Shankaracharya Temple, and Old City artisan markets before departure.',
      transferFrom: 'Pahalgam',
    },
  ],
  6: [
    {
      region: 'Srinagar',
      title: 'Day 01 — Arrival & Evening Dal Lake Floating Serenity',
      summary: 'Arrive in Srinagar, check into your accommodation, and soak in your first sunset over Dal Lake on a private Shikara.',
    },
    {
      region: 'Gulmarg',
      title: 'Day 02 — High Altitude Wonders: Gulmarg Gondola Phases 1 & 2',
      summary: 'Ascend to the snowfields of Apharwat Peak, explore the century-old golf bowl, and savor mountain refreshments.',
      transferFrom: 'Srinagar',
    },
    {
      region: 'Pahalgam',
      title: 'Day 03 — Transfer to Pahalgam via Pampore & Betaab Valley',
      summary: 'Drive along the historic Jhelum valley corridor. Visit Betaab Valley and relax by the rushing Lidder stream.',
      transferFrom: 'Srinagar',
    },
    {
      region: 'Pahalgam',
      title: 'Day 04 — Aru Village & Chandanwari Glacial Gateway',
      summary: 'Journey to tranquil Aru Valley, see the snow bridges of Chandanwari, and enjoy riverside walks.',
    },
    {
      region: 'Sonamarg',
      title: 'Day 05 — Sonamarg: Meadow of Gold & Thajiwas Glacier',
      summary: 'Full-day excursion to Sonamarg along the roaring Sindh River, reaching the foot of the Thajiwas Glacier.',
      transferFrom: 'Srinagar',
    },
    {
      region: 'Srinagar',
      title: 'Day 06 — Imperial Mughal Gardens & Departure Souvenirs',
      summary: 'Visit Nishat and Shalimar gardens, admire ancient wooden architecture at Shehr-e-Khaas, and wrap up your journey.',
      transferFrom: 'Sonamarg',
    },
  ],
  7: [
    {
      region: 'Srinagar',
      title: 'Day 01 — Arrival & Floating Paradise on Dal Lake',
      summary: 'Check in, rest, and experience a gentle sunset shikara cruise past traditional wooden houseboats.',
    },
    {
      region: 'Srinagar',
      title: 'Day 02 — Royal Mughal Gardens & Sacred Shrines',
      summary: 'Explore Nishat Bagh, Shalimar Bagh, Hazratbal Shrine, and Shankaracharya Temple on Gopadari Hill.',
    },
    {
      region: 'Gulmarg',
      title: 'Day 03 — Gulmarg: Gondola Cable Car to Apharwat Peak',
      summary: 'Ride the world-famous gondola to Apharwat Peak, then explore St. Mary’s Church and the historic golf course.',
      transferFrom: 'Srinagar',
    },
    {
      region: 'Pahalgam',
      title: 'Day 04 — Scenic Transfer to Pahalgam & Betaab Valley',
      summary: 'Travel through Pampore saffron fields and Awantipora ruins, then explore Betaab Valley.',
      transferFrom: 'Srinagar',
    },
    {
      region: 'Pahalgam',
      title: 'Day 05 — Aru Valley, Pine Trails & Baisaran Heights',
      summary: 'Explore pastoral Aru Village, cross crystal Lidder footbridges, and ascend the pine trails of Baisaran.',
    },
    {
      region: 'Sonamarg',
      title: 'Day 06 — Sonamarg: Glacier Wonderland & Sindh River Valley',
      summary: 'Excursion through the Sindh River gorges to Sonamarg, gateway to Ladakh, and trek to Thajiwas Glacier.',
      transferFrom: 'Srinagar',
    },
    {
      region: 'Doodhpathri',
      title: 'Day 07 — Doodhpathri: The Untouched Meadow of Milk',
      summary: 'A peaceful day in Kashmir’s most serene, uncrowded alpine meadow along the tumbling Shaliganga River.',
      transferFrom: 'Srinagar',
    },
  ],
};

export const kashmirBundle: DestinationBundle = {
  destination: KASHMIR_DESTINATION,
  attractions: KASHMIR_ATTRACTIONS,
  hotels: KASHMIR_HOTELS,
  dining: KASHMIR_DINING,
  seasonal: KASHMIR_SEASONAL_INTELLIGENCE,
  getSeasonForDate: getKashmirSeasonForDate,
  travelGuide: KASHMIR_TRAVEL_GUIDE,
  regionalTransfers: KASHMIR_TRANSFERS,
  regionalHubs: KASHMIR_REGIONAL_HUBS,
  defaultOrigin: 'New Delhi (DEL)',
  defaultArrivalAirport: 'Srinagar (SXR)',
  defaultPreferredArea: 'Boulevard Road, Dal Lake View',
  budgetDefaults: {
    flightEstimatePerPerson: 6500,
    trainEstimatePerPerson: 2200,
    privateCabPerDay: 3600,
    localExcursionsBuffer: 4500, // Pahalgam Taxi Union + Tangmarg snow chains
    foodDailyStandard: 1100,
    foodDailyVeg: 950,
    sightseeingPerPerson: 2000, // Gondola Phase 1 & 2 + Shikara + Gardens
    shoppingPerPerson: 1800, // Saffron, dry fruits, Pashmina
    contingencyRate: 0.07,
    currency: 'INR',
    currencySymbol: '₹',
    getAssumptions: ({ totalGuests, roomsCount, nights, nightlyRate, perPersonFoodDaily, duration, diet }) => [
      `Flights estimated at average round-trip tariff of ₹13,000/person into Srinagar (SXR) if not marked booked.`,
      `Accommodation based on ${roomsCount} room(s) for ${nights} night(s) at ₹${nightlyRate.toLocaleString('en-IN')}/night.`,
      `Dining calculated at ₹${perPersonFoodDaily.toLocaleString('en-IN')}/person/day tailored to ${diet.toUpperCase()} diet.`,
      `Local transport covers dedicated private tourist cab for ${duration} days plus local Pahalgam Taxi Union excursions.`,
      `Sightseeing includes full Gulmarg Gondola (Phases 1 & 2), 2-hour Dal Lake Shikara ride, and garden entries.`,
      `Contingency buffer set at 7% to absorb seasonal tariff spikes or mountain road adjustments.`,
    ],
  },
  itineraryTemplates: KASHMIR_TEMPLATES,
};
