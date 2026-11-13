import { TripPreferences } from '../../types/travel';

export interface NearbyRecommendation {
  id: string;
  destinationId: string;
  name: string;
  tagline: string;
  whyVisit: string;
  highlights: string[];
  nearbyAttractions: string[];
  recommendedDuration: string;
  journeyTimeFromBase: string;
  excursionType: 'day-trip' | 'overnight' | 'flexible';
  seasonalAccessibility: string;
  transportConsiderations: string;
  estimatedAdditionalCostInr: number;
  extraDaysRecommended: number;
  image: string;
  matchedInterests: string[];
  isSeasonallyOpen: boolean;
}

interface RegionalMasterData {
  id: string;
  destinationId: string;
  name: string;
  tagline: string;
  baseRegion: string;
  highlights: string[];
  nearbyAttractions: string[];
  recommendedDuration: string;
  journeyTimeFromBase: string;
  excursionType: 'day-trip' | 'overnight' | 'flexible';
  openSeasons: string[];
  closedNote?: string;
  transportConsiderations: string;
  estimatedAdditionalCostInr: number;
  extraDaysRecommended: number;
  image: string;
  relevantInterests: string[];
  baseExplanation: string;
}

const REGIONAL_RECOMMENDATION_DATABASE: RegionalMasterData[] = [
  // --- KASHMIR ---
  {
    id: 'sonamarg',
    destinationId: 'kashmir',
    name: 'Sonamarg (Meadow of Gold)',
    tagline: 'Perpetual glacial snows & ancient Silk Route pass along the Sindh River',
    baseRegion: 'Srinagar',
    highlights: [
      'Thajiwas Glacier pony trek and sliding across summer snow bridges',
      'Roaring turquoise waters of Sindh River lined with golden sycamore and silver birch',
      'Gateway to Baltal valley and high-altitude Zojila Pass to Ladakh',
    ],
    nearbyAttractions: ['Thajiwas Glacier', 'Baltal Valley', 'Fish Point on Sindh River', 'Nilagrad Stream'],
    recommendedDuration: '1 Day Excursion (or 1 Night Stay)',
    journeyTimeFromBase: '80 km from Srinagar (~2.5 hrs via Kangan highway)',
    excursionType: 'day-trip',
    openSeasons: ['summer', 'spring', 'autumn'],
    closedNote: 'Road between Gagangeer and Sonamarg is subject to closure during heavy winter snowfall (Dec–Mar). Z-Morh tunnel provides partial all-weather access.',
    transportConsiderations: 'Dedicated private cab from Srinagar for full day (~₹3,500 roundtrip). Union ponies at Thajiwas are strictly price-regulated by J&K Tourism.',
    estimatedAdditionalCostInr: 3500,
    extraDaysRecommended: 1,
    image: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=1200&q=80',
    relevantInterests: ['adventure', 'nature', 'photography'],
    baseExplanation:
      'You are already visiting Srinagar, Gulmarg, and Pahalgam. Sonamarg completes the Kashmir golden triangle by adding year-round glacier access and untouched alpine river scenery without strenuous trekking.',
  },
  {
    id: 'doodhpathri',
    destinationId: 'kashmir',
    name: 'Doodhpathri (Valley of Milk)',
    tagline: 'Untouched emerald slopes and frothing white waters of Shaliganga',
    baseRegion: 'Srinagar',
    highlights: [
      'Pristine pine-fringed rolling meadows untouched by commercial resort development',
      'Frothy white stream of Shaliganga river churning over smooth riverbed stones',
      'Quiet nature walks and open picnic spots with local Gujjar shepherd chalets',
    ],
    nearbyAttractions: ['Shaliganga River Walk', 'Mujhpathri Pine Ridge', 'Dishkal Meadow Viewpoint'],
    recommendedDuration: 'Half to Full Day Excursion',
    journeyTimeFromBase: '42 km South-West of Srinagar (~1.5 hrs via Budgam)',
    excursionType: 'day-trip',
    openSeasons: ['spring', 'summer', 'autumn'],
    closedNote: 'Accessible year-round except immediately following heavy snowfall.',
    transportConsiderations: 'Private cab from Srinagar (~₹2,600–₹3,000 roundtrip). Easy gentle walking; ponies are optional.',
    estimatedAdditionalCostInr: 2800,
    extraDaysRecommended: 0,
    image: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1200&q=80',
    relevantInterests: ['nature', 'relaxation', 'photography'],
    baseExplanation:
      'If you crave an uncommercialized, peaceful alpine meadow free of heavy tourist crowds, Doodhpathri offers pristine deodar glades only 90 minutes from Srinagar.',
  },
  {
    id: 'yusmarg',
    destinationId: 'kashmir',
    name: 'Yusmarg (Meadow of Jesus)',
    tagline: 'Quiet pine forests & natural trail leading to sacred Nilnag Lake',
    baseRegion: 'Srinagar',
    highlights: [
      'Dense pine forest trails leading to the hidden blue waters of alpine Nilnag Lake',
      'The rushing torrents of Doodh Ganga river carving through granite boulders',
      'Panoramic backdrop of the snow-clad Sunset Peak and Tatakooti (4,725m)',
    ],
    nearbyAttractions: ['Nilnag Lake', 'Doodh Ganga Torrent', 'Sang-e-Safed Valley'],
    recommendedDuration: '1 Day Excursion',
    journeyTimeFromBase: '47 km from Srinagar (~1.75 hrs via Chadoora & Charar-i-Sharief)',
    excursionType: 'day-trip',
    openSeasons: ['spring', 'summer', 'autumn'],
    closedNote: 'Open spring through autumn; winter snow road clearance required.',
    transportConsiderations: 'Private cab from Srinagar (~₹2,800 roundtrip). Can be combined with the historic Sufi shrine of Charar-i-Sharief en route.',
    estimatedAdditionalCostInr: 2800,
    extraDaysRecommended: 0,
    image: 'https://images.unsplash.com/photo-1519681393784-d120267933ba?auto=format&fit=crop&w=1200&q=80',
    relevantInterests: ['nature', 'relaxation', 'culture'],
    baseExplanation:
      'Ideal for travellers who love pine forest hikes and serene lakes without the rush of commercial tourist hubs.',
  },
  {
    id: 'gurez-valley',
    destinationId: 'kashmir',
    name: 'Gurez Valley (Dard Shin Frontier)',
    tagline: 'The remote Shangri-La along the turquoise Kishanganga River',
    baseRegion: 'Srinagar',
    highlights: [
      'Iconic pyramidal Habba Khatoon peak rising dramatically above Dawar village',
      'Preserved traditional wooden log architecture and indigenous Dardic Shin culture',
      'Spectacular road trip over high Razdan Pass (3,557m) with views of Harmukh',
    ],
    nearbyAttractions: ['Habba Khatoon Spring & Peak', 'Dawar Heritage Village', 'Kishanganga River Dam'],
    recommendedDuration: '2 Nights / 3 Days Dedicated Journey',
    journeyTimeFromBase: '125 km North of Srinagar (~5.5 hrs via Bandipora and Razdan Pass)',
    excursionType: 'overnight',
    openSeasons: ['summer', 'autumn'],
    closedNote: 'Razdan Pass remains snowbound from late November until late May. Open exclusively June to October.',
    transportConsiderations: 'High-clearance 4x4 or robust SUV. Indian travellers need photo ID proof for military checkposts; foreigners require special home department clearance.',
    estimatedAdditionalCostInr: 8500,
    extraDaysRecommended: 2,
    image: 'https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&w=1200&q=80',
    relevantInterests: ['adventure', 'culture', 'photography'],
    baseExplanation:
      'For adventurers with extra days: Gurez was once closed to tourism and remains one of the most pristine, unspoiled frontier valleys in the entire Himalayas.',
  },

  // --- KERALA ---
  {
    id: 'wayanad',
    destinationId: 'kerala',
    name: 'Wayanad (Misty Highland Sanctuaries)',
    tagline: 'Ancient Neolithic petroglyphs, cloud-kissed peaks & spice mist',
    baseRegion: 'Kochi',
    highlights: [
      'Neolithic rock carvings inside the 6,000-year-old Edakkal Caves',
      'Banasura Sagar Dam, India’s largest earth dam set against mist-clad Western Ghats',
      'Sprawling organic pepper, cardamom, and coffee plantations',
    ],
    nearbyAttractions: ['Edakkal Caves', 'Banasura Sagar Dam', 'Soochipara Waterfalls', 'Muthanga Wildlife Sanctuary'],
    recommendedDuration: '2 Days / 2 Nights',
    journeyTimeFromBase: '260 km North of Kochi (~6.5 hrs) or 2.5 hrs from Kozhikode Airport',
    excursionType: 'overnight',
    openSeasons: ['winter', 'monsoon', 'autumn', 'summer'],
    transportConsiderations: 'Scenic drive through Thamarassery Ghat with 9 hairpin bends. Dedicated private cab recommended.',
    estimatedAdditionalCostInr: 7000,
    extraDaysRecommended: 2,
    image: 'https://images.unsplash.com/photo-1593693397690-362cb9666fc2?auto=format&fit=crop&w=1200&q=80',
    relevantInterests: ['adventure', 'nature', 'culture'],
    baseExplanation:
      'If you have 7+ days in Kerala, Wayanad adds wild upland rainforests, ancient cave art, and cool coffee estates to your backwater journey.',
  },
  {
    id: 'varkala',
    destinationId: 'kerala',
    name: 'Varkala (North Cliff & Mineral Springs)',
    tagline: 'Dramatic red laterite sea cliffs dropping into golden Arabian beaches',
    baseRegion: 'Alleppey',
    highlights: [
      'Sunset clifftop promenade packed with open-air cafes and yoga shalas',
      'Holy Papanasam Beach with natural mineral water springs believed to cleanse karma',
      '2,000-year-old Janardhanaswamy coastal temple dedicated to Lord Vishnu',
    ],
    nearbyAttractions: ['Varkala North Cliff', 'Papanasam Beach', 'Janardhana Swamy Temple', 'Anjengo Fort & Lighthouse'],
    recommendedDuration: '1 to 2 Days',
    journeyTimeFromBase: '110 km South of Alleppey (~2.5 hrs via NH66)',
    excursionType: 'flexible',
    openSeasons: ['winter', 'autumn', 'summer'],
    transportConsiderations: 'Easily accessible by private cab from Alleppey or coastal passenger train to Varkala Sivagiri station.',
    estimatedAdditionalCostInr: 3200,
    extraDaysRecommended: 1,
    image: 'https://images.unsplash.com/photo-1590766940554-634a7ed41450?auto=format&fit=crop&w=1200&q=80',
    relevantInterests: ['relaxation', 'photography', 'nature'],
    baseExplanation:
      'Provides a dramatic coastal cliff experience completely distinct from the calm inland backwater canals of Alleppey.',
  },

  // --- RAJASTHAN ---
  {
    id: 'pushkar-oasis',
    destinationId: 'rajasthan',
    name: 'Pushkar & Desert Rose Oasis',
    tagline: 'Sacred Brahma shrine, 52 holy ghats & desert camel trails',
    baseRegion: 'Jaipur',
    highlights: [
      'One of the world’s only temples dedicated to Lord Brahma',
      'Atmospheric sunset Aarti echoing across the 52 bathing ghats of holy Pushkar lake',
      'Vibrant rose water distilleries and camel cart safaris across sand dunes',
    ],
    nearbyAttractions: ['Brahma Temple', 'Pushkar Holy Lake & Varaha Ghat', 'Savitri Devi Hilltop Temple (Cable Car)'],
    recommendedDuration: 'Day Excursion or 1 Night Stay',
    journeyTimeFromBase: '145 km South-West of Jaipur (~2.5 hrs via NH48 & Ajmer bypass)',
    excursionType: 'flexible',
    openSeasons: ['winter', 'autumn', 'monsoon'],
    transportConsiderations: 'Smooth 6-lane highway. Excellent combined day trip with the Ajmer Sharif Dargah.',
    estimatedAdditionalCostInr: 3000,
    extraDaysRecommended: 1,
    image: 'https://images.unsplash.com/photo-1567157577867-05ccb1388e66?auto=format&fit=crop&w=1200&q=80',
    relevantInterests: ['culture', 'relaxation', 'photography'],
    baseExplanation:
      'Located just 2.5 hours from Jaipur, Pushkar is a serene, mystical contrast to the bustling royal palaces of Jaipur.',
  },
  {
    id: 'mount-abu',
    destinationId: 'rajasthan',
    name: 'Mount Abu & Dilwara Marble Temples',
    tagline: 'The only hill station in Rajasthan amidst cool Aravalli pine heights',
    baseRegion: 'Udaipur',
    highlights: [
      'World-famous 11th-century Dilwara Jain temples with translucent carved marble ceilings',
      'Pleasant sunset boat rides on Nakki Lake surrounded by mountain boulders',
      'Cool mountain weather at 1,220m elevation offering relief from the desert heat',
    ],
    nearbyAttractions: ['Dilwara Marble Temples', 'Nakki Lake', 'Sunset Point', 'Guru Shikhar (1,722m)'],
    recommendedDuration: '1 to 2 Days',
    journeyTimeFromBase: '160 km West of Udaipur (~3 hrs via NH27)',
    excursionType: 'overnight',
    openSeasons: ['winter', 'monsoon', 'summer', 'autumn'],
    transportConsiderations: 'NH27 is smooth; followed by a scenic 20 km mountain ghat climb with broad curves.',
    estimatedAdditionalCostInr: 4500,
    extraDaysRecommended: 1,
    image: 'https://images.unsplash.com/photo-1597074866923-dc0589150358?auto=format&fit=crop&w=1200&q=80',
    relevantInterests: ['culture', 'nature', 'relaxation'],
    baseExplanation:
      'From Udaipur, Mount Abu introduces Rajasthan’s only mountain hill station and architectural wonders at the Dilwara Temples.',
  },

  // --- HIMACHAL PRADESH ---
  {
    id: 'spiti-high-desert',
    destinationId: 'himachal',
    name: 'Spiti Valley & Chandratal (The Middle Land)',
    tagline: 'High-altitude moonscape, turquoise glacial lake & 1,000-year-old monasteries',
    baseRegion: 'Manali',
    highlights: [
      'Crescent-shaped high altitude glacial gem of Chandratal (Lake of the Moon) at 4,300m',
      'Key Monastery fortress perched dramatically above the Spiti River',
      'World’s highest post office in Hikkim and fossil village of Langza',
    ],
    nearbyAttractions: ['Chandratal Lake', 'Key Gompa', 'Kibber Village', 'Dhankar Monastery', 'Hikkim'],
    recommendedDuration: '3 to 4 Days Dedicated Expedition',
    journeyTimeFromBase: '185 km East of Manali via Atal Tunnel & Kunzum Pass (~6.5 hrs)',
    excursionType: 'overnight',
    openSeasons: ['summer', 'autumn'],
    closedNote: 'Kunzum Pass is open strictly from late June to mid-October. Completely closed in winter due to heavy snow.',
    transportConsiderations: 'High-clearance 4x4 or robust SUV. Acclimatization is essential due to 3,800m–4,400m altitude.',
    estimatedAdditionalCostInr: 12000,
    extraDaysRecommended: 3,
    image: 'https://images.unsplash.com/photo-1578632767115-351597cf2477?auto=format&fit=crop&w=1200&q=80',
    relevantInterests: ['adventure', 'photography', 'culture'],
    baseExplanation:
      'Now that the Atal Tunnel bypasses Rohtang, Spiti is far more accessible from Manali for travellers seeking raw, unearthly Himalayan landscapes.',
  },

  // --- UTTARAKHAND ---
  {
    id: 'auli-ski-slopes',
    destinationId: 'uttarakhand',
    name: 'Auli (Himalayan Ski Meadows)',
    tagline: 'Asia’s longest cable car facing majestic Mt. Nanda Devi (7,816m)',
    baseRegion: 'Rishikesh',
    highlights: [
      'Spectacular 4 km ropeway ride from Joshimath floating over oak and deodar canopies',
      'Unbroken 270-degree panoramic vista of Mt. Nanda Devi, Kamet, and Dunagiri',
      'Powder snow skiing from December to March; lush emerald bugyal meadows in summer',
    ],
    nearbyAttractions: ['Auli Ropeway', 'Artificial Snow Lake', 'Gorson Bugyal trek', 'Joshimath Shankarcharya Math'],
    recommendedDuration: '2 Nights / 3 Days',
    journeyTimeFromBase: '265 km North-East of Rishikesh along Alaknanda River (~8 hrs)',
    excursionType: 'overnight',
    openSeasons: ['winter', 'summer', 'autumn'],
    transportConsiderations: 'Badrinath all-weather highway corridor. Daylight mountain driving strictly advised.',
    estimatedAdditionalCostInr: 8500,
    extraDaysRecommended: 2,
    image: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1200&q=80',
    relevantInterests: ['adventure', 'nature', 'photography'],
    baseExplanation:
      'For mountain enthusiasts in Rishikesh: Auli delivers high Himalayan grandeur, winter skiing, and the highest cable car in Asia.',
  },

  // --- SIKKIM ---
  {
    id: 'lachung-yumthang-north',
    destinationId: 'sikkim',
    name: 'North Sikkim (Lachung & Yumthang Valley)',
    tagline: 'Valley of wild rhododendron blooms, hot sulfur springs & Zero Point snow',
    baseRegion: 'Gangtok',
    highlights: [
      'Yumthang Valley blooming with 24 species of wild rhododendrons in spring',
      'Zero Point (Yumesamdong) at 4,660m near the Tibetan border where snow never melts',
      'Roaring mountain waterfalls: Naga Falls and Seven Sisters cascade',
    ],
    nearbyAttractions: ['Yumthang Valley of Flowers', 'Zero Point', 'Lachung Monastery', 'Chungthang Confluence'],
    recommendedDuration: '2 Days / 1 Night',
    journeyTimeFromBase: '115 km North of Gangtok (~6 hrs via Chungthang)',
    excursionType: 'overnight',
    openSeasons: ['spring', 'summer', 'autumn'],
    closedNote: 'Requires Protected Area Permit (PAP) issued to Indian travellers; foreigners restricted past Thangu/Chopta.',
    transportConsiderations: 'Licensed 4x4 tourist vehicles (Innova / Scorpio) with local mountain driver mandatory.',
    estimatedAdditionalCostInr: 9500,
    extraDaysRecommended: 2,
    image: 'https://images.unsplash.com/photo-1544644181-1484b3fdfc62?auto=format&fit=crop&w=1200&q=80',
    relevantInterests: ['nature', 'adventure', 'photography'],
    baseExplanation:
      'If you have 6+ days in Sikkim, journeying north to Lachung unveils Sikkim’s wildest high-altitude valleys and hot springs.',
  },
];

/**
 * Intelligent Destination & Regional Recommendation Engine
 * Analyzes the user's destination, currently planned regions, duration, season, and interests.
 */
export function getIntelligentRecommendations(
  prefs: TripPreferences,
  currentVisitedRegions: string[]
): NearbyRecommendation[] {
  const destId = prefs.destinationId.toLowerCase().trim();
  const visitedSet = new Set(currentVisitedRegions.map((r) => r.toLowerCase()));

  // 1. Filter database entries belonging to this destination
  const candidates = REGIONAL_RECOMMENDATION_DATABASE.filter((item) => item.destinationId === destId);

  // 2. Score and transform candidates
  const scored = candidates.map((item) => {
    // Check if the user is already visiting this region
    const alreadyVisited = visitedSet.has(item.id.toLowerCase()) || visitedSet.has(item.name.toLowerCase());

    // Check interest overlap
    const userInterests = prefs.interests || [];
    const matchedInterests = item.relevantInterests.filter((int) =>
      userInterests.includes(int as any)
    );

    // Check season compatibility
    const departureMonth = new Date(prefs.departureDate).getMonth() + 1;
    let currentSeasonKey = 'summer';
    if ([12, 1, 2].includes(departureMonth)) currentSeasonKey = 'winter';
    else if ([3, 4, 5].includes(departureMonth)) currentSeasonKey = 'spring';
    else if ([6, 7, 8].includes(departureMonth)) currentSeasonKey = 'monsoon';
    else if ([9, 10, 11].includes(departureMonth)) currentSeasonKey = 'autumn';

    const isSeasonallyOpen = item.openSeasons.includes(currentSeasonKey);

    // Compute intelligent explanatory text based on user's specific choices
    let tailoredWhy = item.baseExplanation;
    if (destId === 'kashmir' && item.id === 'sonamarg') {
      const hasGulmarg = visitedSet.has('gulmarg');
      const hasPahalgam = visitedSet.has('pahalgam');
      if (hasGulmarg && hasPahalgam) {
        tailoredWhy =
          'You have selected Srinagar, Gulmarg, and Pahalgam. Sonamarg is the natural crowning highlight of this circuit — adding the Thajiwas Glacier and roaring Sindh River on a smooth 2.5-hour day excursion from Srinagar with zero backtracking.';
      }
    }

    return {
      id: item.id,
      destinationId: item.destinationId,
      name: item.name,
      tagline: item.tagline,
      whyVisit: tailoredWhy,
      highlights: item.highlights,
      nearbyAttractions: item.nearbyAttractions,
      recommendedDuration: item.recommendedDuration,
      journeyTimeFromBase: item.journeyTimeFromBase,
      excursionType: item.excursionType,
      seasonalAccessibility: isSeasonallyOpen
        ? `Fully open and optimal for your travel period (${currentSeasonKey.toUpperCase()}).`
        : item.closedNote || `Limited accessibility during ${currentSeasonKey.toUpperCase()} due to seasonal conditions.`,
      transportConsiderations: item.transportConsiderations,
      estimatedAdditionalCostInr: item.estimatedAdditionalCostInr,
      extraDaysRecommended: item.extraDaysRecommended,
      image: item.image,
      matchedInterests,
      isSeasonallyOpen,
      alreadyVisited,
    };
  });

  // Sort: places not yet visited first, then seasonally open, then by interest match
  return scored
    .filter((s) => !s.alreadyVisited)
    .sort((a, b) => {
      if (a.isSeasonallyOpen && !b.isSeasonallyOpen) return -1;
      if (!a.isSeasonallyOpen && b.isSeasonallyOpen) return 1;
      return b.matchedInterests.length - a.matchedInterests.length;
    });
}

