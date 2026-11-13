import { SeasonalIntelligence } from '../types/travel';

export const KASHMIR_SEASONAL_INTELLIGENCE: Record<string, SeasonalIntelligence> = {
  spring: {
    destinationId: 'kashmir',
    seasonName: 'Spring & The Tulip Awakening',
    tagline: 'Orchards in fragrant bloom, emerald revival & Asia’s largest tulip spectacle',
    monthsActive: ['March', 'April'],
    temperatureRangeCelsius: { min: 6, max: 20 },
    snowfallLikelihood: 'low',
    weatherHighlights: [
      'Almond and cherry blossoms carpet the valley floor in soft white and pink',
      'The Indira Gandhi Memorial Tulip Garden blooms with over 1.5 million flowers in April',
      'Pleasant daytime temperatures with crisp mountain breezes in the evening',
      'Occasional spring rains bring dramatic clouds and sparkling sunlight over Dal Lake',
    ],
    packListRecommendations: [
      'Mid-weight jackets, cardigans, or fleece pullovers for evenings',
      'Light rain shell or windproof jacket with compact travel umbrella',
      'Comfortable walking shoes with good water resistance for garden strolls',
      'Moisturizer, UV sunscreen (SPF 50), and polarized sunglasses',
    ],
    roadAdvisories: [
      'Srinagar city and Gulmarg roads are generally completely open and clear',
      'Sonamarg and Zojila Pass may operate under one-way traffic restrictions during late snow melts',
      'Mughal Road to Poonch usually remains closed until mid-April due to winter snow drifts',
    ],
    suitabilityScore: 9,
    monthlyBreakdown: [
      {
        month: 'March',
        avgHighC: 15,
        avgLowC: 4,
        snowExpected: false,
        crowdLevel: 'Moderate',
        roadCondition: 'Normal highways; higher passes clearing',
        verdict: 'Excellent for early blooms and fewer crowds before peak holiday rush.',
      },
      {
        month: 'April',
        avgHighC: 20,
        avgLowC: 7,
        snowExpected: false,
        crowdLevel: 'Peak',
        roadCondition: 'Open across valley; high tourist traffic around Boulevard',
        verdict: 'Peak visual beauty with the international Tulip Festival.',
      },
    ],
  },
  summer: {
    destinationId: 'kashmir',
    seasonName: 'Summer Alpine Bliss',
    tagline: 'Lush green meadows, serene shikaras, and refreshing high-altitude escapes',
    monthsActive: ['May', 'June', 'July', 'August'],
    temperatureRangeCelsius: { min: 14, max: 29 },
    snowfallLikelihood: 'none',
    weatherHighlights: [
      'Daytime is comfortably warm and sunny; nighttime temperatures drop pleasantly',
      'Gulmarg Gondola Phase 2 still retains pockets of high-altitude snow near the summit',
      'River rafting on the Lidder River in Pahalgam and Sindh River in Sonamarg is at its best',
      'Shikara rides on Dal and Nigeen lakes can be enjoyed late into twilight',
    ],
    packListRecommendations: [
      'Light breathable cotton and linen shirts for day outings',
      'At least one light cardigan, jacket, or pashmina shawl for chilly mountain nights',
      'Sturdy hiking sneakers with non-slip tread for meadows and trails',
      'High UV protection sunscreen, wide-brim hat, and sunglasses',
      'Motion sickness tablets for winding mountain roads to Gulmarg and Pahalgam',
    ],
    roadAdvisories: [
      'All major tourist circuits (Srinagar, Gulmarg, Pahalgam, Sonamarg, Doodhpathri) are fully accessible',
      'High-altitude passes (Zojila Pass to Kargil/Leh) are open to vehicular traffic',
      'Amarnath Yatra period (July–August) introduces security checkpoints and convoy timings along the Pahalgam & Baltal corridors',
    ],
    suitabilityScore: 10,
    monthlyBreakdown: [
      {
        month: 'May',
        avgHighC: 24,
        avgLowC: 11,
        snowExpected: false,
        crowdLevel: 'Peak',
        roadCondition: 'Superb, clean mountain roads',
        verdict: 'Prime summer travel window with ideal balance of temperature and scenic vibrancy.',
      },
      {
        month: 'June',
        avgHighC: 28,
        avgLowC: 15,
        snowExpected: false,
        crowdLevel: 'Peak',
        roadCondition: 'Optimal across all sectors',
        verdict: 'Warm pleasant valley days; ideal for high-meadow stays in Gulmarg and Pahalgam.',
      },
      {
        month: 'July',
        avgHighC: 29,
        avgLowC: 17,
        snowExpected: false,
        crowdLevel: 'Moderate',
        roadCondition: 'Occasional brief monsoon showers; roads stay operational',
        verdict: 'Fruit orchards in full bloom; Lidder river gushing with glacial meltwater.',
      },
      {
        month: 'August',
        avgHighC: 28,
        avgLowC: 16,
        snowExpected: false,
        crowdLevel: 'Moderate',
        roadCondition: 'Occasional showers; Amarnath pilgrim convoys active',
        verdict: 'Apple harvest begins; verdant green landscapes across all valleys.',
      },
    ],
  },
  autumn: {
    destinationId: 'kashmir',
    seasonName: 'Golden Autumn & Crimson Chinars',
    tagline: 'Kashmir’s most poetic season — flaming red Chinar groves, crisp air & saffron harvest',
    monthsActive: ['September', 'October', 'November'],
    temperatureRangeCelsius: { min: 3, max: 23 },
    snowfallLikelihood: 'low',
    weatherHighlights: [
      'Century-old Chinar trees in Mughal gardens transition from bright gold to deep ruby red',
      'Crisp, crystal-clear skies offer unmatched panoramic views of surrounding peaks',
      'Pampore saffron fields are harvested in late October with delicate purple crocus flowers',
      'Quiet, contemplative ambiance with significantly fewer tourist crowds than summer',
    ],
    packListRecommendations: [
      'Layered clothing: thermal innerwear, woollen sweaters, and heavy fleece or down jacket',
      'Woollen scarves or authentic Kashmiri pashmina wraps for chilly twilight winds',
      'Insulated walking shoes or leather boots',
      'Lip balm, heavy cold cream, and thermal socks',
    ],
    roadAdvisories: [
      'National Highway 44 (Jammu-Srinagar) and local tourist corridors remain in excellent condition',
      'Late November can see early frost or light sleet on mountain roads; morning departures are recommended',
      'Zojila Pass may see temporary closures following early snowfall in late November',
    ],
    suitabilityScore: 9,
    monthlyBreakdown: [
      {
        month: 'September',
        avgHighC: 26,
        avgLowC: 12,
        snowExpected: false,
        crowdLevel: 'Moderate',
        roadCondition: 'Excellent throughout',
        verdict: 'Mild pleasant climate; start of the royal autumn foliage shift.',
      },
      {
        month: 'October',
        avgHighC: 21,
        avgLowC: 6,
        snowExpected: false,
        crowdLevel: 'Moderate',
        roadCondition: 'Crisp dry road conditions',
        verdict: 'The golden hour of Kashmir! Best month for photography and peaceful sightseeing.',
      },
      {
        month: 'November',
        avgHighC: 15,
        avgLowC: 1,
        snowExpected: false,
        crowdLevel: 'Low',
        roadCondition: 'Clear; early morning frost requires cautious driving',
        verdict: 'Chilly nights, flaming Chinar leaves carpet the ground, tranquil and romantic.',
      },
    ],
  },
  winter: {
    destinationId: 'kashmir',
    seasonName: 'White Wonderland & Alpine Powder',
    tagline: 'Powder skiing in Gulmarg, frozen streams, roaring bukharis & snow-draped houseboats',
    monthsActive: ['December', 'January', 'February'],
    temperatureRangeCelsius: { min: -7, max: 9 },
    snowfallLikelihood: 'high',
    weatherHighlights: [
      'Gulmarg transforms into Asia’s premier powder skiing and snowboarding capital',
      'Dal Lake edges freeze into glassy ice sheets; mist blankets the waterways in ethereal fog',
      'Traditional Kashmiri bukhari (wood stoves) and kangris provide heartwarming mountain hospitality',
      'Snowfall turns pine forests into dramatic storybook monochrome landscapes',
    ],
    packListRecommendations: [
      'Heavy-duty thermal base layers (top and bottom merino wool / synthetic)',
      'High-grade down jacket with wind- and waterproof shell (rated to -10°C)',
      'Waterproof snow boots with deep rubber lug soles and warm fleece lining',
      'Thermal gloves, balaclava / fleece beanie, woollen socks (multiple pairs)',
      'Thermos flask to keep hot water or Kahwa during mountain excursions',
    ],
    roadAdvisories: [
      'Tangmarg to Gulmarg ascent (12 km) strictly mandates snow tyre chains or registered 4x4 union vehicles',
      'Heavy snowfall events can cause temporary flight delays at Srinagar International Airport (SXR)',
      'Sonamarg and high passes are typically closed to general tourist traffic from mid-December to March',
      'Always factor buffer hours for airport transfers in winter due to morning fog or snow clearance',
    ],
    suitabilityScore: 8,
    monthlyBreakdown: [
      {
        month: 'December',
        avgHighC: 9,
        avgLowC: -2,
        snowExpected: true,
        crowdLevel: 'Peak',
        roadCondition: 'Tangmarg-Gulmarg requires snow chains; Srinagar roads treated',
        verdict: 'Holiday celebrations amidst fresh powder snow in Gulmarg.',
      },
      {
        month: 'January',
        avgHighC: 6,
        avgLowC: -6,
        snowExpected: true,
        crowdLevel: 'Moderate',
        roadCondition: 'Chillai Kalan (harshest 40-day winter spell); snow chains mandatory',
        verdict: 'Deepest snowpack; paradise for serious skiers and snow enthusiasts.',
      },
      {
        month: 'February',
        avgHighC: 9,
        avgLowC: -3,
        snowExpected: true,
        crowdLevel: 'Moderate',
        roadCondition: 'Regular snow-clearing operations active',
        verdict: 'Sunny winter days, excellent snow conditions, and melting ice waterfalls.',
      },
    ],
  },
};

export function getSeasonForDate(dateString: string): SeasonalIntelligence {
  const date = new Date(dateString);
  const month = isNaN(date.getMonth()) ? new Date().getMonth() : date.getMonth(); // 0 = Jan, 11 = Dec

  // Dec (11), Jan (0), Feb (1) -> Winter
  if (month === 11 || month === 0 || month === 1) {
    return KASHMIR_SEASONAL_INTELLIGENCE.winter;
  }
  // Mar (2), Apr (3) -> Spring
  if (month === 2 || month === 3) {
    return KASHMIR_SEASONAL_INTELLIGENCE.spring;
  }
  // May (4), Jun (5), Jul (6), Aug (7) -> Summer
  if (month >= 4 && month <= 7) {
    return KASHMIR_SEASONAL_INTELLIGENCE.summer;
  }
  // Sep (8), Oct (9), Nov (10) -> Autumn
  return KASHMIR_SEASONAL_INTELLIGENCE.autumn;
}
