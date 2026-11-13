import {
  DestinationBundle,
  Destination,
  Attraction,
  Hotel,
  DiningSuggestion,
  SeasonalIntelligence,
  DestinationTravelGuide,
  RegionalHub,
  RegionTransfer,
  ItineraryTemplateDay,
} from '../../../types/travel';

export const KERALA_DESTINATION: Destination = {
  id: 'kerala',
  name: 'God’s Own Country — Kerala',
  tagline: 'Emerald Backwaters, Cloud-Kissed Tea Hills & Spice Sanctuaries',
  state: 'Kerala',
  country: 'India',
  heroImage: 'https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?auto=format&fit=crop&w=1920&q=80',
  thumbnail: 'https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?auto=format&fit=crop&w=600&q=80',
  overview:
    'From the historic spice trading port of Fort Kochi and the mist-clad tea plantations of Munnar to the serene palm-fringed backwaters of Alleppey and the wildlife forests of Periyar, Kerala offers an enchanting tapestry of nature, wellness, and heritage.',
  bestSeasons: ['Winter (Sep–Mar)', 'Monsoon Ayurveda (Jun–Aug)'],
  idealDurationDays: [4, 8],
  isCurated: true,
  regions: ['Kochi', 'Munnar', 'Alleppey', 'Thekkady', 'Varkala'],
  highlights: [
    'Private traditional Kettuvallam houseboat cruise along Vembanad Lake',
    'Rolling emerald tea carpets and Nilgiri Tahr sightings in Munnar',
    'Historic Fort Kochi Chinese fishing nets and Dutch colonial quarter',
    'Spice plantation walk and bamboo rafting in Thekkady',
    'Authentic Kerala Sadya served on fresh plantain leaves',
  ],
  climateSummary: 'Tropical coastal and highland climate. Coastal plains are warm and balmy (23°C–32°C); Munnar hill station enjoys cool crisp mountain air (12°C–25°C).',
};

export const KERALA_ATTRACTIONS: Attraction[] = [
  // --- KOCHI ---
  {
    id: 'kochi-fort-kochi-chinese-nets',
    destinationId: 'kerala',
    region: 'Kochi',
    name: 'Fort Kochi & Chinese Fishing Nets',
    tagline: 'Centuries-old cantilevered fishing gear on the Arabian shore',
    shortDescription: 'Stroll along the historic waterfront lined with massive 14th-century cantilevered Chinese fishing nets (Cheena Vala) introduced by trader Zheng He.',
    longDescription:
      'Fort Kochi is a living museum of colonial history, where Portuguese, Dutch, and British influences merge. Watch local fishermen operate the massive counterweighted teakwood nets against dramatic sunsets over the Arabian Sea.',
    categories: ['culture', 'photography', 'relaxation'],
    recommendedDurationMinutes: 90,
    entryFeeInr: 0,
    openingHours: 'Open all day (Best: 06:00 AM – 09:00 AM & 05:00 PM – 07:00 PM)',
    bestTimeOfDay: 'evening',
    seasonalSuitability: ['summer', 'monsoon', 'autumn', 'winter'],
    accessibilityRating: 'high',
    image: 'https://images.unsplash.com/photo-1593693397690-362cb9666fc2?auto=format&fit=crop&w=1200&q=80',
    tags: ['Must-Visit', 'Historic Waterfront', 'Sunset', 'Culture'],
    coordinates: { lat: 9.9658, lng: 76.2415 },
    practicalTips: 'Fishermen gladly demonstrate net pulling for a small voluntary tip (₹100–₹200). Avoid touts offering fish cooking stalls at inflated rates.',
  },
  {
    id: 'kochi-mattancherry-jew-town',
    destinationId: 'kerala',
    region: 'Kochi',
    name: 'Mattancherry Dutch Palace & Jew Town',
    tagline: '16th-century Ramayana murals and historic antique souks',
    shortDescription: 'Visit the Dutch Palace built by the Portuguese in 1555 featuring extraordinary tempera murals, then wander the cobblestone spice lanes of Jew Town.',
    longDescription:
      'Mattancherry Palace showcases some of the finest Hindu temple mural art in India, depicting episodes from the Ramayana and Mahabharata in glowing natural pigments. Adjacent Jew Town features centuries-old antique warehouses, ginger drying yards, and the 1568 Paradesi Synagogue.',
    categories: ['culture', 'shopping', 'photography'],
    recommendedDurationMinutes: 120,
    entryFeeInr: 10,
    openingHours: '09:45 AM – 01:00 PM, 02:00 PM – 04:45 PM (Closed Fridays)',
    bestTimeOfDay: 'morning',
    seasonalSuitability: ['summer', 'monsoon', 'autumn', 'winter'],
    accessibilityRating: 'moderate',
    image: 'https://images.unsplash.com/photo-1589308078059-be1415eab4c3?auto=format&fit=crop&w=1200&q=80',
    tags: ['Murals', 'Heritage', 'Antique Markets', 'Spice Trail'],
    coordinates: { lat: 9.9583, lng: 76.2592 },
    practicalTips: 'Dutch Palace is closed on Fridays. Modest attire covering knees and shoulders required.',
  },
  {
    id: 'kochi-kathakali-cultural-centre',
    destinationId: 'kerala',
    region: 'Kochi',
    name: 'Kerala Kathakali Centre',
    tagline: 'Classical temple dance-drama with elaborate makeup ritual',
    shortDescription: 'Witness the mesmerizing traditional art of Kathakali, beginning with the 1-hour ritual facial makeup and eye-expression demonstrations.',
    longDescription:
      'Kathakali is Kerala’s 400-year-old classical dance drama that combines literature, music, painting, acting, and dance. Arrive early to watch actors transform into gods and demons through painstakingly applied mineral-pigment face makeup (Chutti).',
    categories: ['culture', 'photography'],
    recommendedDurationMinutes: 120,
    entryFeeInr: 450,
    openingHours: 'Makeup 05:00 PM – 06:00 PM; Performance 06:00 PM – 07:30 PM',
    bestTimeOfDay: 'evening',
    seasonalSuitability: ['summer', 'monsoon', 'autumn', 'winter'],
    accessibilityRating: 'high',
    image: 'https://images.unsplash.com/photo-1609137144822-263a0bf3f982?auto=format&fit=crop&w=1200&q=80',
    tags: ['Must-Visit', 'Art Form', 'Evening Performance', 'Classical Heritage'],
    coordinates: { lat: 9.967, lng: 76.244 },
    practicalTips: 'Arriving at 05:00 PM to watch the intricate makeup application is half the cultural experience; photography without flash is permitted.',
  },

  // --- MUNNAR ---
  {
    id: 'munnar-tea-museum-gardens',
    destinationId: 'kerala',
    region: 'Munnar',
    name: 'KDHP Tea Museum & Lockhart Tea Terraces',
    tagline: 'Colonial tea heritage and manicured emerald hillside estates',
    shortDescription: 'Explore the history of high-range tea cultivation at Nullatanni Estate and witness artisanal CTC tea leaf processing from plucking to drying.',
    longDescription:
      'Munnar is the tea capital of South India. The KDHP Tea Museum houses antique machinery, photographs from the 1880s, and conducts live tea-tasting sessions where travelers discover white, green, and orthodox leaf profiles.',
    categories: ['nature', 'culture', 'photography'],
    recommendedDurationMinutes: 120,
    entryFeeInr: 150,
    openingHours: '09:00 AM – 05:00 PM (Closed Mondays)',
    bestTimeOfDay: 'morning',
    seasonalSuitability: ['summer', 'monsoon', 'autumn', 'winter'],
    accessibilityRating: 'high',
    image: 'https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&w=1200&q=80',
    tags: ['Tea Plantations', 'Factory Tour', 'Scenic Views', 'Tasting'],
    coordinates: { lat: 10.089, lng: 77.059 },
    practicalTips: 'Purchase fresh single-origin high-grown tea and authentic cardamom directly from the factory retail counter.',
  },
  {
    id: 'munnar-eravikulam-national-park',
    destinationId: 'kerala',
    region: 'Munnar',
    name: 'Eravikulam National Park (Rajamalai)',
    tagline: 'Home of the endangered Nilgiri Tahr beneath Mt. Anamudi',
    shortDescription: 'Travel by eco-bus into the high-altitude shola-grassland sanctuary to observe friendly Nilgiri Tahr mountain goats roaming wild.',
    longDescription:
      'Spanning 97 sq km in the Western Ghats, Eravikulam protects the largest surviving population of the endangered Nilgiri Tahr. The park offers breathtaking panoramas of Anamudi (2,695m), the highest mountain peak in South India, and blooms with purplish Neelakurinji flowers once every twelve years.',
    categories: ['nature', 'adventure', 'photography'],
    recommendedDurationMinutes: 180,
    entryFeeInr: 200,
    openingHours: '07:30 AM – 04:00 PM (Park closes Feb–Mar during calving season)',
    bestTimeOfDay: 'morning',
    seasonalSuitability: ['summer', 'autumn', 'winter'],
    accessibilityRating: 'moderate',
    image: 'https://images.unsplash.com/photo-1516426122078-c23e76319801?auto=format&fit=crop&w=1200&q=80',
    tags: ['Must-Visit', 'Wildlife', 'Nilgiri Tahr', 'High Altitude', 'Eco Tour'],
    coordinates: { lat: 10.15, lng: 77.06 },
    practicalTips: 'Pre-book entry tickets online through Kerala Forest Department portal to skip long tourist bus queues; closed annually in February and March.',
  },
  {
    id: 'munnar-mattupetty-echo-point',
    destinationId: 'kerala',
    region: 'Munnar',
    name: 'Mattupetty Dam & Echo Point',
    tagline: 'Serene storage reservoir surrounded by shola forests and mist',
    shortDescription: 'A picturesque storage reservoir nestled amidst rolling hills, popular for speedboating and the natural voice resonance at Echo Point.',
    longDescription:
      'Located 13 km from Munnar town, Mattupetty features a solid gravity dam constructed in the 1950s. The surrounding lake is fringed with tea estates and eucalyptus trees where wild elephant herds frequently come down to drink in the early morning.',
    categories: ['nature', 'relaxation', 'photography'],
    recommendedDurationMinutes: 90,
    entryFeeInr: 50,
    openingHours: '09:00 AM – 05:00 PM',
    bestTimeOfDay: 'afternoon',
    seasonalSuitability: ['summer', 'monsoon', 'autumn', 'winter'],
    accessibilityRating: 'high',
    image: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1200&q=80',
    tags: ['Boating', 'Lake Panorama', 'Family Friendly'],
    coordinates: { lat: 10.106, lng: 77.124 },
    practicalTips: 'Speedboat rides are operated by the District Tourism Council. Pair this excursion with Kundala Lake and Top Station.',
  },

  // --- ALLEPPEY ---
  {
    id: 'alleppey-houseboat-backwater-cruise',
    destinationId: 'kerala',
    region: 'Alleppey',
    name: 'Alleppey Backwaters & Kettuvallam Day Cruise',
    tagline: 'Glide through palm-canopied canals on a traditional wooden barge',
    shortDescription: 'Board a handcrafted wooden Kettuvallam held together with coir knots, navigating through Punnamada Lake, narrow village canals, and paddy fields.',
    longDescription:
      'Alleppey (Alappuzha) is the Venice of the East. A day or overnight cruise on a traditional thatched-roof houseboat takes you into a timeless world of duck farming, toddy tapping, village churches, and vast submerged paddy cultivation (Kuttanad) below sea level.',
    categories: ['nature', 'relaxation', 'photography'],
    recommendedDurationMinutes: 240,
    entryFeeInr: 4500, // standard day-cruise houseboat rate for private charter with traditional lunch
    openingHours: 'Cruises depart 11:30 AM – 05:00 PM (Engines shut off at dusk per fisheries laws)',
    bestTimeOfDay: 'morning',
    seasonalSuitability: ['summer', 'monsoon', 'autumn', 'winter'],
    accessibilityRating: 'high',
    image: 'https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?auto=format&fit=crop&w=1200&q=80',
    tags: ['Must-Visit', 'Bucket List', 'Houseboat', 'Backwaters', 'Couple', 'Family'],
    coordinates: { lat: 9.4981, lng: 76.3388 },
    practicalTips: 'Always ensure your boat is accredited by the Kerala Tourism Department (Green Palm or Gold Star certified). Authentic Kerala plantain leaf lunch is cooked onboard.',
  },
  {
    id: 'alleppey-marari-beach',
    destinationId: 'kerala',
    region: 'Alleppey',
    name: 'Marari Beach & Fishermen Village',
    tagline: 'Quiet golden sands fringed with swaying coconut groves',
    shortDescription: 'A peaceful, uncommercialized coastal village 14 km north of Alleppey, offering clean golden sands and soothing Arabian sea breezes.',
    longDescription:
      'Named after the local fishing village of Mararikulam, Marari Beach provides the quintessential tropical beach experience away from mass commercial tourism. Watch fishermen launch traditional wooden canoes at sunrise and unwind in hammocks under coconut palms.',
    categories: ['nature', 'relaxation', 'photography'],
    recommendedDurationMinutes: 120,
    entryFeeInr: 0,
    openingHours: 'Open all day (Sunset is spectacular between 05:30 PM and 06:30 PM)',
    bestTimeOfDay: 'evening',
    seasonalSuitability: ['summer', 'autumn', 'winter'],
    accessibilityRating: 'high',
    image: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1200&q=80',
    tags: ['Beach', 'Quiet', 'Sunset Stroll', 'Relaxation'],
    coordinates: { lat: 9.601, lng: 76.299 },
    practicalTips: 'Swimming is pleasant during winter months (November to February); exercise caution during monsoon swells.',
  },

  // --- THEKKADY ---
  {
    id: 'thekkady-periyar-wildlife-sanctuary',
    destinationId: 'kerala',
    region: 'Thekkady',
    name: 'Periyar Wildlife Sanctuary & Lake Boat Safari',
    tagline: 'Wild elephant herds and otters along the Periyar lake reservoir',
    shortDescription: 'A 90-minute morning boat cruise across Periyar Lake, surrounded by evergreen tropical rainforests where wild elephants and sambar deer forage.',
    longDescription:
      'Nestled in the Cardamom Hills, Periyar Tiger Reserve is one of India’s most scenic protected wilderness areas. Dead submerged tree stumps rising from the lake create an eerie, photogenic landscape where bison (gaur), wild boars, and diverse aquatic birds congregate at the water’s edge.',
    categories: ['nature', 'adventure', 'photography'],
    recommendedDurationMinutes: 150,
    entryFeeInr: 250,
    openingHours: 'Boat timings: 07:30 AM, 09:30 AM, 11:15 AM, 01:45 PM, 03:30 PM',
    bestTimeOfDay: 'morning',
    seasonalSuitability: ['summer', 'monsoon', 'autumn', 'winter'],
    accessibilityRating: 'moderate',
    image: 'https://images.unsplash.com/photo-1516426122078-c23e76319801?auto=format&fit=crop&w=1200&q=80',
    tags: ['Must-Visit', 'Boat Safari', 'Elephants', 'Rainforest', 'Wildlife'],
    coordinates: { lat: 9.4679, lng: 77.1435 },
    practicalTips: 'Book the 07:30 AM first boat cruise for highest wildlife spotting probabilities and ethereal morning mist over the water.',
  },
  {
    id: 'thekkady-spice-plantation-tour',
    destinationId: 'kerala',
    region: 'Thekkady',
    name: 'Kumily Organic Spice Plantation Walk',
    tagline: 'Fragrant walking tour among green cardamom, black pepper & cloves',
    shortDescription: 'Walk guided through an organic spice estate to discover how real black pepper vines, cardamom bushes, nutmeg, and cinnamon bark are cultivated.',
    longDescription:
      'Thekkady is the spice capital of Kerala. A guided garden walk introduces travelers to the medicinal, culinary, and botanical properties of tropical spices that launched centuries of world spice trade voyages.',
    categories: ['nature', 'culture', 'shopping'],
    recommendedDurationMinutes: 90,
    entryFeeInr: 100,
    openingHours: '08:00 AM – 06:00 PM',
    bestTimeOfDay: 'afternoon',
    seasonalSuitability: ['summer', 'monsoon', 'autumn', 'winter'],
    accessibilityRating: 'high',
    image: 'https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&w=1200&q=80',
    tags: ['Spice Garden', 'Aromatic', 'Educational', 'Authentic'],
    coordinates: { lat: 9.605, lng: 77.165 },
    practicalTips: 'You can buy farm-fresh green cardamom, wild honey, and whole vanilla pods directly from the plantation store.',
  },
];

export const KERALA_HOTELS: Hotel[] = [
  {
    id: 'hotel-brunton-boatyard-kochi',
    destinationId: 'kerala',
    region: 'Kochi',
    name: 'Brunton Boatyard by CGH Earth',
    category: '5-star',
    area: 'Fort Kochi Waterfront',
    address: 'Calvathy Road, Fort Kochi, Kochi, Kerala 682001',
    basePriceInr: 21000,
    roomTypes: [
      { quality: 'deluxe', indicativePriceInr: 21000, description: 'Sea View Chamber facing the shipping channel and dolphin waters' },
      { quality: 'premium', indicativePriceInr: 27000, description: 'Sea Facing Balcony Room with teakwood four-poster bed' },
      { quality: 'suite', indicativePriceInr: 44000, description: 'Brunton Royal Suite with panoramic harbor vistas' },
    ],
    image: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=1200&q=80',
    officialUrl: 'https://www.cghearth.com/brunton-boatyard',
    lastReviewedDate: 'November 2024',
    amenities: ['Historic Victorian Architecture', 'Harbor Swimming Pool', 'Armoury Lounge', 'Ayurveda Spa Centre', 'Sunset Boat Cruise'],
    highlights: ['Built on the site of a 19th-century Victorian shipyard', 'Overlooks the lively Kochi harbor entrance where dolphins play'],
    verificationDisclaimer: 'Tariffs represent direct CGH Earth benchmarks for standard double occupancy including breakfast.',
  },
  {
    id: 'hotel-fragrant-nature-munnar',
    destinationId: 'kerala',
    region: 'Munnar',
    name: 'Fragrant Nature Munnar',
    category: '5-star',
    area: 'Pothamedu, Munnar Heights',
    address: 'Pothemmedu, Bisonvalley Road, Munnar, Kerala 685565',
    basePriceInr: 16500,
    roomTypes: [
      { quality: 'deluxe', indicativePriceInr: 16500, description: 'Tropic Green Room with mountain valley view' },
      { quality: 'premium', indicativePriceInr: 22000, description: 'Moonlight Romance Chamber with working fireplace' },
      { quality: 'suite', indicativePriceInr: 34000, description: 'Wild Orchid Royal Suite with private jacuzzi' },
    ],
    image: 'https://images.unsplash.com/photo-1571896349842-33c89424de2d?auto=format&fit=crop&w=1200&q=80',
    officialUrl: 'https://www.fragrantnature.com/HotelsMunnar',
    lastReviewedDate: 'October 2024',
    amenities: ['Fireplace in Every Room', 'Prana Wellness Ayurveda Spa', 'All-Glass Amphitheatre', 'Fine Dining Glasshouse'],
    highlights: ['Perched high on Pothamedu cliff with unobstructed views of tea valleys', 'Cosy wood fireplaces in every guestroom'],
    verificationDisclaimer: 'Rates indicative for double occupancy. Peak Christmas/New Year and holiday periods require direct advance confirmation.',
  },
  {
    id: 'hotel-kumarakom-lake-resort',
    destinationId: 'kerala',
    region: 'Alleppey',
    name: 'Kumarakom Lake Resort',
    category: '5-star',
    area: 'Kumarakom, Vembanad Lake Shore',
    address: 'Vembanad Lake, Kumarakom, Kottayam, Kerala 686563',
    basePriceInr: 26000,
    roomTypes: [
      { quality: 'deluxe', indicativePriceInr: 26000, description: 'Meandering Pool Villa with direct pool access from verandah' },
      { quality: 'premium', indicativePriceInr: 36000, description: 'Heritage Lake View Villa with private plunge pool' },
      { quality: 'suite', indicativePriceInr: 62000, description: 'Presidential Backwater Pool Pavilion' },
    ],
    image: 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=1200&q=80',
    officialUrl: 'https://www.kumarakomlakeresort.in/',
    lastReviewedDate: 'November 2024',
    amenities: ['250-meter Meandering Lagoon Pool', 'Ayurmana Heritage Spa', 'Traditional Kettuvallam Dining', 'Infinity Lake Pool'],
    highlights: ['Recognized among Asia’s leading luxury heritage water resorts', 'Reconstructed 16th-century traditional wooden Illam ancestral manors'],
    verificationDisclaimer: 'Tariffs subject to seasonal revisions. Direct confirmation on resort portal recommended.',
  },
  {
    id: 'hotel-spice-village-thekkady',
    destinationId: 'kerala',
    region: 'Thekkady',
    name: 'Spice Village by CGH Earth',
    category: '4-star',
    area: 'Kumily, Near Periyar Forest Gate',
    address: 'Thekkady Road, Kumily, Thekkady, Kerala 685509',
    basePriceInr: 12500,
    roomTypes: [
      { quality: 'standard', indicativePriceInr: 12500, description: 'Spice Garden Thatched Cottage with terracotta floors' },
      { quality: 'deluxe', indicativePriceInr: 15500, description: 'Individual Pool Villa Cottage' },
      { quality: 'suite', indicativePriceInr: 24000, description: 'Heritage Spice Plantation Suite' },
    ],
    image: 'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&w=1200&q=80',
    officialUrl: 'https://www.cghearth.com/spice-village',
    lastReviewedDate: 'October 2024',
    amenities: ['Elephant Grass Thatched Cottages', 'Swimming Pool', 'Organic Farm Dining', 'Tiger Trail Nature Centre'],
    highlights: ['Modeled on a traditional tribal village of the Mannan community', 'Set in a sprawling botanical garden of rare spices'],
    verificationDisclaimer: 'Eco-conscious property with natural ventilation and ceiling fans; air-conditioning intentionally omitted in line with sustainable philosophy.',
  },
  {
    id: 'hotel-the-leaf-munnar',
    destinationId: 'kerala',
    region: 'Munnar',
    name: 'The Leaf Munnar Resort',
    category: '4-star',
    area: 'Chithirapuram, Munnar',
    address: 'Near AMVT School, Chithirapuram, Munnar, Kerala 685565',
    basePriceInr: 8500,
    roomTypes: [
      { quality: 'standard', indicativePriceInr: 8500, description: 'Silver Oak Leaf Room with private balcony' },
      { quality: 'deluxe', indicativePriceInr: 11500, description: 'Golden Leaf Chamber overlooking tea hills' },
      { quality: 'suite', indicativePriceInr: 18000, description: 'Royal Leaf Luxury Villa with private garden' },
    ],
    image: 'https://images.unsplash.com/photo-1564501049412-61c2a3083791?auto=format&fit=crop&w=1200&q=80',
    officialUrl: 'https://www.theleafmunnar.com/',
    lastReviewedDate: 'September 2024',
    amenities: ['Infinity Hill Swimming Pool', 'Bouquet Multicuisine & Pure Veg Kitchen', 'Games Room', 'Campfire Area'],
    highlights: ['Picturesque resort set in verdant slopes with landscaped herb gardens', 'Exceptional comfort for family travel'],
    verificationDisclaimer: 'Published tariff benchmark. Confirm room category directly with property front desk.',
  },
  {
    id: 'hotel-abad-atrium-kochi',
    destinationId: 'kerala',
    region: 'Kochi',
    name: 'Hotel Abad Atrium',
    category: '3-star',
    area: 'MG Road Commercial Hub, Ernakulam',
    address: 'MG Road, Shenoys, Kochi, Kerala 682035',
    basePriceInr: 4500,
    roomTypes: [
      { quality: 'standard', indicativePriceInr: 4500, description: 'Deluxe City View Room' },
      { quality: 'deluxe', indicativePriceInr: 6000, description: 'Executive Atrium Chamber' },
      { quality: 'suite', indicativePriceInr: 9000, description: 'Family Suite with separate living hall' },
    ],
    image: 'https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&w=1200&q=80',
    officialUrl: 'https://www.abadhotels.com/atrium-hotel-in-mg-road-cochin/',
    lastReviewedDate: 'August 2024',
    amenities: ['Central Air-Conditioning', 'Swimming Pool & Fitness Centre', 'Pure Veg Friendly Dining', 'Free Wi-Fi'],
    highlights: ['Prime central location on MG Road close to metro and railway station', 'Exceptional budget-friendly reliability'],
    verificationDisclaimer: 'Prices subject to local taxes and seasonal revisions.',
  },
];

export const KERALA_DINING: DiningSuggestion[] = [
  // --- KOCHI ---
  {
    id: 'dining-brindhavan-kochi',
    name: 'Brindhavan Vegetarian Restaurant',
    region: 'Kochi',
    cuisineType: 'Traditional Kerala Pure Vegetarian & South Indian',
    isPureVeg: true,
    isJainFriendly: true,
    isVeganFriendly: true,
    recommendedDishes: [
      'Authentic Kerala Sadya served on fresh banana leaf',
      'Crispy Ghee Roast Dosa with coconut and tomato chutneys',
      'Avial (vegetables in coconut curd paste)',
      'Traditional Ada Pradhaman Payasam (sweet rice flakes in jaggery)',
    ],
    priceTier: 'budget',
    location: 'Palarivattom Bypass Junction, Kochi',
    description:
      'Kochi’s most celebrated pure vegetarian dining hall, famed for its elaborate afternoon Kerala Sadya feast with 18 authentic vegetarian curries, parippu, sambar, and hot payasams.',
    pureVegHighlights: '100% strictly pure vegetarian kitchen. Zero non-vegetarian preparation.',
  },
  {
    id: 'dining-sree-saravana-bhavan-kochi',
    name: 'Sree Saravana Bhavan',
    region: 'Kochi',
    cuisineType: 'Pure Vegetarian South Indian & Kerala Tiffin',
    isPureVeg: true,
    isJainFriendly: true,
    isVeganFriendly: true,
    recommendedDishes: [
      'Puttu with Kadala Curry (steamed rice cake with black chickpeas)',
      'Idiyappam with coconut vegetable stew',
      'South Indian Filter Coffee',
      'Mysore Masala Dosa',
    ],
    priceTier: 'budget',
    location: 'Marine Drive & MG Road, Kochi',
    description:
      'A bustling vegetarian institution on Marine Drive known for steaming hot traditional Kerala breakfast tiffins and quick no-onion/no-garlic Jain alternatives on request.',
    pureVegHighlights: 'Strictly vegetarian dining facility with dedicated Jain options.',
  },
  {
    id: 'dining-grand-pavilion-kochi',
    name: 'The Grand Pavilion',
    region: 'Kochi',
    cuisineType: 'Heritage Kerala Cuisine & Continental',
    isPureVeg: false,
    isJainFriendly: false,
    isVeganFriendly: true,
    recommendedDishes: [
      'Kerala Vegetable Stew with Appam (hoppers)',
      'Thoran (cabbage and grated coconut stir-fry)',
      'Kalan (creamy yam and yogurt curry with fenugreek)',
      'Fresh tender coconut pudding',
    ],
    priceTier: 'mid-range',
    location: 'Grand Hotel, MG Road, Ernakulam, Kochi',
    description:
      'Operating since 1963, this beloved heritage restaurant prepares classical Kerala delicacies using authentic Malabar spices and fresh cold-pressed coconut oils.',
    pureVegHighlights: 'Dedicated vegetarian section with traditional Kerala stew and Appam combinations.',
  },

  // --- MUNNAR ---
  {
    id: 'dining-saravana-bhavan-munnar',
    name: 'Saravana Bhavan Munnar',
    region: 'Munnar',
    cuisineType: 'Pure Vegetarian South Indian & Hot Mountain Tiffins',
    isPureVeg: true,
    isJainFriendly: true,
    isVeganFriendly: true,
    recommendedDishes: [
      'Hot Plain & Podi Dosa with Sambar',
      'Steaming Medu Vada dipped in hot rasam',
      'Kerala Rice Meals with Rasam & Moru (spiced buttermilk)',
      'Cardamom Infused Chai',
    ],
    priceTier: 'budget',
    location: 'Main Bazaar, Near KSRTC Bus Stand, Munnar Town',
    description:
      'The most reliable pure vegetarian haven in chilly Munnar town. Offers boiling hot South Indian meals, fresh tandoori rotis, and instant warmth after high-altitude estate walks.',
    pureVegHighlights: '100% pure vegetarian. No meat or egg cooked on premises.',
  },
  {
    id: 'dining-rapsy-munnar',
    name: 'Rapsy Restaurant',
    region: 'Munnar',
    cuisineType: 'Kerala Comfort Dining & Middle Eastern Bites',
    isPureVeg: false,
    isJainFriendly: false,
    isVeganFriendly: true,
    recommendedDishes: [
      'Layered Malabar Parotta with Veg Kurma',
      'Fresh fruit juices and ginger lemon tea',
      'Vegetable fried rice with local farm produce',
    ],
    priceTier: 'budget',
    location: 'Main Bazaar, Munnar Town',
    description:
      'An iconic traveler hub in Munnar market famous for fresh parottas, hot spiced tea, and fast friendly service.',
    pureVegHighlights: 'Wide vegetarian curry selections and fresh mountain fruit juices.',
  },

  // --- ALLEPPEY ---
  {
    id: 'dining-thaff-pure-veg-alleppey',
    name: 'Thaff Pure Veg Restaurant',
    region: 'Alleppey',
    cuisineType: 'Pure Vegetarian Kerala & North Indian Meals',
    isPureVeg: true,
    isJainFriendly: true,
    isVeganFriendly: true,
    recommendedDishes: [
      'Kerala Mini Sadya Thali with Red Matta Rice',
      'Appam with Vegetable Mappas (spiced coconut milk gravy)',
      'Parippu Vada & Banana Fritters (Pazham Pori)',
      'Cold tender coconut water',
    ],
    priceTier: 'budget',
    location: 'Cullen Road, Near Iron Bridge, Alleppey',
    description:
      'A clean, welcoming pure vegetarian dining destination in Alleppey town, convenient for travelers embarking or disembarking from houseboat cruises.',
    pureVegHighlights: 'Dedicated 100% pure vegetarian kitchen with prompt Jain meal prep.',
  },
  {
    id: 'dining-houseboat-onboard-kitchen',
    name: 'Traditional Houseboat Onboard Dining',
    region: 'Alleppey',
    cuisineType: 'Traditional Backwater Kerala Cuisine',
    isPureVeg: false,
    isJainFriendly: true,
    isVeganFriendly: true,
    recommendedDishes: [
      'Freshly cooked Kerala Sadya on banana leaf with 8 vegetarian accompaniments',
      'Crispy fried bitter gourd (Pavakka)',
      'Sambar, Rasam, and Curd with Kuttanad red rice',
      'Hot freshly fried Banana Fritters with evening tea',
    ],
    priceTier: 'mid-range',
    location: 'Private Houseboat, Punnamada / Vembanad Waters, Alleppey',
    description:
      'Meals cooked live onboard by a dedicated boat chef using fresh village produce, served as you glide past palm groves.',
    pureVegHighlights: 'Chefs readily prepare dedicated 100% pure vegetarian and Jain feasts on advance request.',
  },
];

export const KERALA_SEASONAL_INTELLIGENCE: Record<string, SeasonalIntelligence> = {
  winter: {
    destinationId: 'kerala',
    seasonName: 'Winter Sun & Gentle Breezes',
    tagline: 'Kerala’s peak holiday window — comfortable coastal warmth, crisp tea hills & calm waters',
    monthsActive: ['December', 'January', 'February'],
    temperatureRangeCelsius: { min: 22, max: 32 },
    snowfallLikelihood: 'none',
    weatherHighlights: [
      'Clear, bright sunny skies with pleasant low humidity across the coastal plains',
      'Munnar hill station experiences refreshing cool evenings dropping to 12°C–16°C',
      'Vembanad and backwater canals are mirror-calm, offering idyllic houseboat conditions',
      'Cochin Carnival and traditional temple festivals (Utsavam) with caparisoned elephants and percussion ensembles',
    ],
    packListRecommendations: [
      'Lightweight breathable cotton shirts and linen trousers',
      'A light cardigan, fleece pullover, or shawl for chilly Munnar evenings',
      'Comfortable sandals or slip-on shoes for temple visits where footwear is removed',
      'UV sunscreen (SPF 50), sun hat, and polarized sunglasses',
      'Mosquito repellent cream (Odomos) for waterways and plantations',
    ],
    roadAdvisories: [
      'All major national highways (NH66, NH85) and hill ghats are in smooth operational condition',
      'Expect heavier holiday traffic around Fort Kochi and Munnar town during Christmas and New Year',
      'Ghat roads to Munnar require attentive driving around hairpin curves; daylight driving recommended',
    ],
    suitabilityScore: 10,
    monthlyBreakdown: [
      {
        month: 'December',
        avgHighC: 31,
        avgLowC: 22,
        snowExpected: false,
        crowdLevel: 'Peak',
        roadCondition: 'Optimal conditions across all sectors',
        verdict: 'Peak travel month with vibrant holiday celebrations in Fort Kochi.',
      },
      {
        month: 'January',
        avgHighC: 31,
        avgLowC: 22,
        snowExpected: false,
        crowdLevel: 'Peak',
        roadCondition: 'Smooth, dry roads throughout',
        verdict: 'Prime climate across hills, beaches, and backwaters.',
      },
      {
        month: 'February',
        avgHighC: 32,
        avgLowC: 23,
        snowExpected: false,
        crowdLevel: 'Moderate',
        roadCondition: 'Excellent throughout',
        verdict: 'Warm pleasant beach weather and slightly lighter tourist footfalls.',
      },
    ],
  },
  summer: {
    destinationId: 'kerala',
    seasonName: 'Tropical Summer & Hill Respite',
    tagline: 'Warm sunny beaches and cool, refreshing escapes in the Western Ghats',
    monthsActive: ['March', 'April', 'May'],
    temperatureRangeCelsius: { min: 25, max: 36 },
    snowfallLikelihood: 'none',
    weatherHighlights: [
      'Coastal plains (Kochi, Alleppey) are hot and humid with daytime temperatures reaching 34°C–36°C',
      'Munnar and Thekkady hill stations provide refreshing cool mountain retreats (15°C–26°C)',
      'Vishu festival in April celebrates Kerala’s agricultural new year with feasts and fireworks',
      'Thrissur Pooram (late April or May), the grandest temple pageant in India with twin elephant processions',
    ],
    packListRecommendations: [
      'Ultra-light, loose-fitting cotton clothing and sun hats',
      'High UV protection sunscreen and hydrating lip balm',
      'Refillable insulated water bottle for outdoor sightseeing',
      'Comfortable open sandals with good grip',
    ],
    roadAdvisories: [
      'Highways are clear and completely dry',
      'Afternoon heat can be tiring for long walking tours; schedule sightseeing in early morning and late afternoon',
    ],
    suitabilityScore: 8,
    monthlyBreakdown: [
      {
        month: 'March',
        avgHighC: 33,
        avgLowC: 24,
        snowExpected: false,
        crowdLevel: 'Moderate',
        roadCondition: 'Dry, clear roads',
        verdict: 'Pleasant start of summer; excellent time for hill station stays.',
      },
      {
        month: 'April',
        avgHighC: 34,
        avgLowC: 25,
        snowExpected: false,
        crowdLevel: 'Moderate',
        roadCondition: 'Clear across state',
        verdict: 'Warm coastal days; ideal for hill station exploration in Munnar.',
      },
      {
        month: 'May',
        avgHighC: 33,
        avgLowC: 25,
        snowExpected: false,
        crowdLevel: 'Low',
        roadCondition: 'Occasional pre-monsoon summer showers',
        verdict: 'Pre-monsoon showers bring dramatic clouds and cooler evening breezes.',
      },
    ],
  },
  monsoon: {
    destinationId: 'kerala',
    seasonName: 'Southwest Monsoon & Ayurvedic Rejuvenation',
    tagline: 'Lush emerald landscapes, roaring waterfalls & the prime season for traditional Ayurveda wellness',
    monthsActive: ['June', 'July', 'August'],
    temperatureRangeCelsius: { min: 23, max: 29 },
    snowfallLikelihood: 'none',
    weatherHighlights: [
      'Rhythmic torrential rains transform Kerala into an intensely vibrant, lush green paradise',
      'Athirappilly and Cheeyappara waterfalls roar with full volume',
      'Ideal atmospheric humidity and open skin pores make this the premier season for Ayurvedic therapies and Panchakarma',
      'Nehru Trophy Boat Race on Punnamada Lake in August with 100-foot snake boats (Chundan Vallams)',
    ],
    packListRecommendations: [
      'Sturdy windproof umbrella and compact waterproof rain jacket',
      'Waterproof phone pouch and dry-bag backpack for cameras',
      'Quick-drying synthetic or light cotton clothing',
      'Non-slip waterproof footwear (crocs or rubber-soled sandals)',
    ],
    roadAdvisories: [
      'Hill roads in Munnar and Idukki can experience occasional landslips or fog during heavy downpours',
      'Factor additional travel time between Kochi and Munnar during active storm warnings',
      'Check local weather warnings before undertaking mountain treks',
    ],
    suitabilityScore: 8,
    monthlyBreakdown: [
      {
        month: 'June',
        avgHighC: 30,
        avgLowC: 23,
        snowExpected: false,
        crowdLevel: 'Low',
        roadCondition: 'Wet roads; drive with headlights on during rain bursts',
        verdict: 'Dramatic monsoon arrival; superb for luxury Ayurvedic resort stays.',
      },
      {
        month: 'July',
        avgHighC: 28,
        avgLowC: 23,
        snowExpected: false,
        crowdLevel: 'Low',
        roadCondition: 'Heavy rain showers; waterfalls at peak flow',
        verdict: 'Deep green countryside and serene quiet houseboat journeys.',
      },
      {
        month: 'August',
        avgHighC: 29,
        avgLowC: 23,
        snowExpected: false,
        crowdLevel: 'Moderate',
        roadCondition: 'Showers tapering; vibrant boat races begin',
        verdict: 'Historic Nehru Trophy Boat Race and festive atmosphere.',
      },
    ],
  },
  autumn: {
    destinationId: 'kerala',
    seasonName: 'Post-Monsoon & The Onam Grandeur',
    tagline: 'Golden sun breaks through misty showers, cultural splendor & Onam harvest feasts',
    monthsActive: ['September', 'October', 'November'],
    temperatureRangeCelsius: { min: 23, max: 31 },
    snowfallLikelihood: 'none',
    weatherHighlights: [
      'Onam harvest festival transforms villages with colorful floral carpets (Pookalam), tiger dances (Pulikali), and temple music',
      'Rains clear into gentle scattered evening showers, leaving sparkling green tea plantations',
      'Wildlife comes out into open lakeside pastures in Thekkady',
      'Comfortable balance of temperature, visual lushness, and moderate crowds',
    ],
    packListRecommendations: [
      'Breathable cotton outfits and comfortable walking shoes',
      'Compact travel umbrella for brief passing afternoon showers',
      'Camera with lens cloth to wipe mist droplets',
      'Mosquito repellent for evening walks along backwaters',
    ],
    roadAdvisories: [
      'Highways are in good condition after post-monsoon maintenance',
      'Occasional brief evening showers; smooth driving throughout',
    ],
    suitabilityScore: 9,
    monthlyBreakdown: [
      {
        month: 'September',
        avgHighC: 30,
        avgLowC: 23,
        snowExpected: false,
        crowdLevel: 'Moderate',
        roadCondition: 'Clear and pleasant',
        verdict: 'Spectacular Onam festival cultural festivities and lush scenery.',
      },
      {
        month: 'October',
        avgHighC: 31,
        avgLowC: 23,
        snowExpected: false,
        crowdLevel: 'Moderate',
        roadCondition: 'Occasional light post-monsoon showers',
        verdict: 'Fresh green tea slopes and ideal backwater cruising weather.',
      },
      {
        month: 'November',
        avgHighC: 31,
        avgLowC: 22,
        snowExpected: false,
        crowdLevel: 'Moderate',
        roadCondition: 'Smooth, dry roads across state',
        verdict: 'Cool pleasant evenings and commencement of peak travel window.',
      },
    ],
  },
};

export function getKeralaSeasonForDate(dateString: string): SeasonalIntelligence {
  const date = new Date(dateString);
  const month = isNaN(date.getMonth()) ? new Date().getMonth() : date.getMonth();

  // Dec (11), Jan (0), Feb (1) -> Winter
  if (month === 11 || month === 0 || month === 1) {
    return KERALA_SEASONAL_INTELLIGENCE.winter;
  }
  // Mar (2), Apr (3), May (4) -> Summer
  if (month >= 2 && month <= 4) {
    return KERALA_SEASONAL_INTELLIGENCE.summer;
  }
  // Jun (5), Jul (6), Aug (7) -> Monsoon
  if (month >= 5 && month <= 7) {
    return KERALA_SEASONAL_INTELLIGENCE.monsoon;
  }
  // Sep (8), Oct (9), Nov (10) -> Autumn / Post-monsoon
  return KERALA_SEASONAL_INTELLIGENCE.autumn;
}

export const KERALA_TRAVEL_GUIDE: DestinationTravelGuide = {
  essentialDocuments: [
    {
      title: 'Government Photo ID Proof',
      detail:
        'Original Aadhaar Card, Passport, or Voter ID for every traveller. Required for hotel check-ins, Eravikulam National Park passes, and houseboat passenger manifests.',
    },
    {
      title: 'Mobile Phone & Connectivity',
      detail:
        'Standard prepaid and postpaid mobile SIM cards from all Indian telecom operators (Jio, Airtel, Vi, BSNL) work seamlessly across Kerala with excellent 4G/5G coverage in Kochi, Munnar, and Alleppey.',
    },
    {
      title: 'Printed Vouchers & Offline Passes',
      detail:
        'Keep printed copies or offline PDF confirmations of your houseboat charter and Eravikulam National Park passes, as cellular coverage can be intermittent in deep Western Ghats valleys.',
    },
  ],

  localTransportRules: [
    {
      title: 'Public Water Transport & State Ferries',
      detail:
        'Kerala State Water Transport Department (SWTD) operates regular passenger ferries connecting Fort Kochi, Ernakulam, and Alleppey village islands for ₹6 to ₹25. They provide one of the most scenic and authentic public transit experiences in India.',
    },
    {
      title: 'Houseboat Navigation & Overnight Rules',
      detail:
        'Houseboats operate under strict state environmental and fisheries regulations. Cruising is permitted from 12:00 PM until 05:30 PM, after which all houseboats must anchor along designated village banks to protect nocturnal fishermen and fish breeding habitats.',
    },
    {
      title: 'Pre-Paid Airport Cabs at Cochin (COK)',
      detail:
        'Always hire registered pre-paid taxis from the official Kerala Police / CIAL counters at Cochin International Airport arrivals hall. Rates are government-standardized with printed receipts.',
    },
  ],

  culturalEtiquette: [
    {
      title: 'Traditional Temple Dress Codes',
      detail:
        'Ancient Kerala Hindu temples (such as Padmanabhaswamy and Guruvayur) enforce strict traditional dress codes. Men must wear a traditional plain white Mundu (dhoti) with the upper body bare; women must wear sarees or traditional salwar kameez. Western attire and leather items are prohibited inside temple inner sanctums.',
    },
    {
      title: 'Ayurvedic Wellness Etiquette',
      detail:
        'When booking Ayurvedic massages or Panchakarma therapies, choose centres certified with the official Green Leaf or Olive Leaf accreditation from the Kerala Department of Tourism.',
    },
    {
      title: 'Responsible Eco-Tourism & Plastic Ban',
      detail:
        'Kerala strictly enforces bans on single-use plastic bags and disposable bottles in hill stations like Munnar and inside Periyar Tiger Reserve. Dispose of waste responsibly in designated bins.',
    },
  ],

  checklist: [
    {
      category: 'Crucial Travel Essentials',
      items: [
        { id: 'kl-c1', label: 'Government Photo IDs (Aadhaar / Passport) for all guests', isEssential: true },
        { id: 'kl-c2', label: 'Eravikulam National Park and Houseboat confirmations (printed or offline PDF)', isEssential: true },
        { id: 'kl-c3', label: 'High-capacity power bank and camera battery chargers', isEssential: true },
        { id: 'kl-c4', label: 'Cash in currency notes (small vendors and village ferry stalls prefer cash/UPI)', isEssential: true },
      ],
    },
    {
      category: 'Clothing & Footwear',
      items: [
        { id: 'kl-c5', label: 'Lightweight breathable cotton and linen shirts & trousers', isEssential: true },
        { id: 'kl-c6', label: 'Light fleece pullover or cardigan for cool Munnar evenings (12°C–16°C)', isEssential: true },
        { id: 'kl-c7', label: 'Compact windproof umbrella or light waterproof rain jacket', isEssential: true },
        { id: 'kl-c8', label: 'Comfortable slip-on walking shoes or sandals for temple visits', isEssential: true },
        { id: 'kl-c9', label: 'Sun hat and polarized sunglasses for backwater glare', isEssential: true },
      ],
    },
    {
      category: 'Health, Skin & Personal Care',
      items: [
        { id: 'kl-c10', label: 'Mosquito repellent lotion / spray (Odomos is essential for backwaters and spice gardens)', isEssential: true },
        { id: 'kl-c11', label: 'High SPF sunscreen (SPF 50+) and hydrating aloe vera gel', isEssential: true },
        { id: 'kl-c12', label: 'Motion sickness tablets for winding mountain ghats to Munnar (NH85)', isEssential: true },
        { id: 'kl-c13', label: 'Basic first aid kit: Band-aids, ORS hydration sachets, and antacids', isEssential: true },
      ],
    },
  ],
};

export const KERALA_REGIONAL_HUBS: RegionalHub[] = [
  {
    name: 'Kochi',
    role: 'Gateway Port & Cultural Hub',
    altitude: 'Sea Level',
    distanceFromBase: '0 km (Central Hub)',
    driveTime: 'Base Hub (Cochin Airport COK)',
    highlights: 'Fort Kochi, Chinese Fishing Nets, Mattancherry Dutch Palace, Kathakali Centre',
    gmapsUrl: 'https://www.google.com/maps/place/Kochi,+Kerala/',
    x: 35,
    y: 35,
  },
  {
    name: 'Munnar',
    role: 'High Altitude Tea Capital',
    altitude: '1,600m',
    distanceFromBase: '130 km East of Kochi',
    driveTime: '~3.5 hrs via NH85 & Neriamangalam',
    highlights: 'Tea Museum, Eravikulam National Park (Nilgiri Tahr), Mattupetty Dam, Top Station',
    gmapsUrl: 'https://www.google.com/maps/place/Munnar,+Kerala/',
    x: 75,
    y: 20,
  },
  {
    name: 'Thekkady',
    role: 'Spice Hills & Wildlife Sanctuary',
    altitude: '900m',
    distanceFromBase: '155 km South-East of Kochi',
    driveTime: '~3 hrs from Munnar (90 km)',
    highlights: 'Periyar Lake Boat Safari, Spice Plantation walk, Kalaripayattu martial arts',
    gmapsUrl: 'https://www.google.com/maps/place/Thekkady,+Kerala/',
    x: 80,
    y: 55,
  },
  {
    name: 'Alleppey',
    role: 'Venice of the East & Backwaters',
    altitude: 'Sea Level',
    distanceFromBase: '55 km South of Kochi',
    driveTime: '~1.5 hrs via NH66 coastal highway',
    highlights: 'Kettuvallam Houseboat Cruise, Vembanad Lake, Punnamada, Marari Beach',
    gmapsUrl: 'https://www.google.com/maps/place/Alappuzha,+Kerala/',
    x: 35,
    y: 70,
  },
  {
    name: 'Varkala',
    role: 'Cliffs & Arabian Sea Shores',
    altitude: 'Sea Level',
    distanceFromBase: '160 km South of Kochi',
    driveTime: '~3 hrs from Alleppey',
    highlights: 'Varkala Cliff, Papanasam Beach, Janardanaswamy Temple',
    gmapsUrl: 'https://www.google.com/maps/place/Varkala,+Kerala/',
    x: 40,
    y: 90,
  },
];

export const KERALA_TRANSFERS: Record<string, Record<string, RegionTransfer>> = {
  Kochi: {
    Munnar: {
      from: 'Kochi',
      to: 'Munnar',
      distanceKm: 130,
      durationHours: 3.5,
      scenicHighlight: 'Passing Neriamangalam bridge (Gateway to High Ranges) and stopping at Cheeyappara and Valara waterfalls along NH85.',
      roadNotes: 'Scenic mountain ascent with gentle curves; smooth paved highway with tea vistas.',
    },
    Alleppey: {
      from: 'Kochi',
      to: 'Alleppey',
      distanceKm: 55,
      durationHours: 1.5,
      scenicHighlight: 'Coastal highway through coconut groves, coir weaving villages, and Vembanad canal bridges.',
      roadNotes: 'Four-lane coastal highway; very smooth drive.',
    },
    Thekkady: {
      from: 'Kochi',
      to: 'Thekkady',
      distanceKm: 155,
      durationHours: 4.0,
      scenicHighlight: 'Rubber plantations of Kottayam ascending into cardamom and pepper hill slopes of Kumily.',
      roadNotes: 'Gradual hill ascent with scenic valley views.',
    },
  },
  Munnar: {
    Thekkady: {
      from: 'Munnar',
      to: 'Thekkady',
      distanceKm: 90,
      durationHours: 3.0,
      scenicHighlight: 'Panoramic scenic mountain drive through cardamom hills, tea valleys, and tea workers’ stone cottages.',
      roadNotes: 'State Highway 19 (Munnar–Thekkady Road); picturesque hill road.',
    },
    Kochi: {
      from: 'Munnar',
      to: 'Kochi',
      distanceKm: 130,
      durationHours: 3.5,
      scenicHighlight: 'Descent from high-altitude tea slopes through Neriamangalam forest to the coastal plains.',
      roadNotes: 'Smooth downhill drive taking roughly 3.5 hours.',
    },
    Alleppey: {
      from: 'Munnar',
      to: 'Alleppey',
      distanceKm: 165,
      durationHours: 4.5,
      scenicHighlight: 'Mountain descent towards the great backwater plains of Central Kerala.',
      roadNotes: 'Start early around 08:00 AM to reach Alleppey for standard 12:00 PM houseboat boarding.',
    },
  },
  Thekkady: {
    Alleppey: {
      from: 'Thekkady',
      to: 'Alleppey',
      distanceKm: 140,
      durationHours: 3.5,
      scenicHighlight: 'Descending from the Cardamom Hills through Kanjirappally rubber plantations to Vembanad waterways.',
      roadNotes: 'Smooth scenic descent.',
    },
    Kochi: {
      from: 'Thekkady',
      to: 'Kochi',
      distanceKm: 155,
      durationHours: 4.0,
      scenicHighlight: 'Scenic drive through Idukki and Kottayam districts.',
      roadNotes: 'Pleasant highway drive.',
    },
  },
  Alleppey: {
    Kochi: {
      from: 'Alleppey',
      to: 'Kochi',
      distanceKm: 55,
      durationHours: 1.5,
      scenicHighlight: 'Passing scenic backwater inlets and coastal coir workshops back towards the port city and airport.',
      roadNotes: 'Fast, smooth drive along NH66.',
    },
  },
};

export const KERALA_TEMPLATES: Record<number, ItineraryTemplateDay[]> = {
  1: [
    {
      region: 'Kochi',
      title: 'Arrival in Kochi & Fort Kochi Heritage Splendor',
      summary: 'Welcome to Kerala! Explore Chinese Fishing Nets, Mattancherry Dutch Palace, and an evening Kathakali cultural performance.',
    },
  ],
  2: [
    {
      region: 'Kochi',
      title: 'Arrival in Kochi & Historic Colonial Quarter',
      summary: 'Explore Fort Kochi waterfront, Jew Town spice souks, and evening sunset over the Arabian Sea.',
    },
    {
      region: 'Alleppey',
      title: 'Alleppey Backwaters & Houseboat Day Cruise',
      summary: 'Glide quietly through palm-fringed canals of Vembanad Lake aboard a traditional thatched Kettuvallam.',
      transferFrom: 'Kochi',
    },
  ],
  3: [
    {
      region: 'Kochi',
      title: 'Day 01 — Arrival in Kochi & Heritage Discovery',
      summary: 'Arrive at Cochin International Airport (COK). Transfer to your hotel, explore Chinese Fishing Nets, and enjoy an evening Kathakali show.',
    },
    {
      region: 'Munnar',
      title: 'Day 02 — Scenic Drive to Munnar & Tea Plantation Strolls',
      summary: 'Ascend past Cheeyappara waterfalls to Munnar. Visit the KDHP Tea Museum and explore emerald tea terraces.',
      transferFrom: 'Kochi',
    },
    {
      region: 'Alleppey',
      title: 'Day 03 — Alleppey Backwaters & Houseboat Serenity',
      summary: 'Descend to Alleppey for a private Kettuvallam houseboat cruise across Vembanad Lake before evening departure.',
      transferFrom: 'Munnar',
    },
  ],
  4: [
    {
      region: 'Kochi',
      title: 'Day 01 — Arrival in Kochi & Colonial Fort Heritage',
      summary: 'Arrive in Kochi, explore Dutch Palace murals, Jew Town antique souks, and sunset on the waterfront.',
    },
    {
      region: 'Munnar',
      title: 'Day 02 — Ascent to Munnar Tea Country & Cheeyappara Falls',
      summary: 'Scenic highway transfer to Munnar. Stroll through Lockhart tea estates and visit the historic tea museum.',
      transferFrom: 'Kochi',
    },
    {
      region: 'Munnar',
      title: 'Day 03 — Eravikulam National Park & Mattupetty Lake',
      summary: 'Observe the rare Nilgiri Tahr mountain goats in Eravikulam, and enjoy lakeside views at Mattupetty Dam.',
    },
    {
      region: 'Alleppey',
      title: 'Day 04 — Alleppey Backwaters Houseboat Cruise & Departure',
      summary: 'Scenic transfer to Alleppey. Enjoy an unhurried houseboat cruise with authentic Kerala lunch before airport transfer.',
      transferFrom: 'Munnar',
    },
  ],
  5: [
    {
      region: 'Kochi',
      title: 'Day 01 — Arrival in Kochi, Chinese Nets & Kathakali Performance',
      summary: 'Land at Cochin Airport (COK). Check into your hotel, explore Fort Kochi waterfront, and witness an evening Kathakali classical dance drama.',
    },
    {
      region: 'Munnar',
      title: 'Day 02 — Scenic Transfer to Munnar & Emerald Tea Terraces',
      summary: 'Drive through Neriamangalam and Cheeyappara waterfalls into the misty high ranges. Visit KDHP Tea Museum and savor single-origin tea.',
      transferFrom: 'Kochi',
    },
    {
      region: 'Munnar',
      title: 'Day 03 — Eravikulam Sanctuary, Anamudi Vistas & Mattupetty Lake',
      summary: 'Morning safari in Eravikulam National Park to spot Nilgiri Tahr goats, followed by lake breezes at Mattupetty and Echo Point.',
    },
    {
      region: 'Thekkady',
      title: 'Day 04 — Mountain Passage to Thekkady & Periyar Lake Boat Safari',
      summary: 'Drive along the Cardamom Hills to Thekkady. Take a tranquil afternoon boat safari on Periyar Lake and walk through an organic spice garden.',
      transferFrom: 'Munnar',
    },
    {
      region: 'Alleppey',
      title: 'Day 05 — Alleppey Kettuvallam Houseboat Cruise & Farewell',
      summary: 'Descend to Alleppey for a private backwater cruise on Vembanad Lake, savoring authentic Kerala Sadya lunch before airport transfer.',
      transferFrom: 'Thekkady',
    },
  ],
  6: [
    {
      region: 'Kochi',
      title: 'Day 01 — Arrival in Kochi & Historic Colonial Quarter',
      summary: 'Arrive in Kochi, explore Dutch Palace, Jewish Synagogue, and evening sunset over Chinese fishing nets.',
    },
    {
      region: 'Munnar',
      title: 'Day 02 — Journey to Munnar via Cheeyappara Waterfalls',
      summary: 'Ascend past cascading forest waterfalls into the misty tea bowl of Munnar. Evening tea tasting at Nullatanni Estate.',
      transferFrom: 'Kochi',
    },
    {
      region: 'Munnar',
      title: 'Day 03 — High Altitude Wonders: Eravikulam & Top Station',
      summary: 'Observe wildlife in Eravikulam National Park and marvel at 360-degree views of the Western Ghats from Top Station.',
    },
    {
      region: 'Thekkady',
      title: 'Day 04 — Thekkady Spice Trails & Periyar Lake Boat Safari',
      summary: 'Travel through the Cardamom Hills to Thekkady. Wildlife boat cruise on Periyar Lake and an evening Kalaripayattu martial arts show.',
      transferFrom: 'Munnar',
    },
    {
      region: 'Alleppey',
      title: 'Day 05 — Alleppey Backwaters & Overnight Houseboat Experience',
      summary: 'Board a luxury thatched Kettuvallam houseboat, navigating through palm-fringed canals and enjoying village life along the banks.',
      transferFrom: 'Thekkady',
    },
    {
      region: 'Kochi',
      title: 'Day 06 — Marari Beach Stroll & Fond Farewell Departure',
      summary: 'Disembark after breakfast. Visit quiet Marari Beach for a morning stroll before transferring to Cochin Airport for your return flight.',
      transferFrom: 'Alleppey',
    },
  ],
  7: [
    {
      region: 'Kochi',
      title: 'Day 01 — Arrival in Kochi & Arabian Sea Sunset',
      summary: 'Arrive in Kochi, check into your waterfront heritage hotel, and enjoy sunset by the historic Chinese Fishing Nets.',
    },
    {
      region: 'Kochi',
      title: 'Day 02 — Dutch Palace, Jew Town & Kathakali Dance Drama',
      summary: 'Immerse yourself in 16th-century Ramayana murals at Mattancherry, browse spice souks, and attend an evening Kathakali performance.',
    },
    {
      region: 'Munnar',
      title: 'Day 03 — Scenic Mountain Ascent to Munnar Tea Country',
      summary: 'Scenic drive through rubber and tea slopes. Visit the KDHP Tea Museum and explore Lockhart tea terraces.',
      transferFrom: 'Kochi',
    },
    {
      region: 'Munnar',
      title: 'Day 04 — Eravikulam National Park & Mattupetty Reservoir',
      summary: 'High-altitude nature walk in Eravikulam National Park followed by an afternoon at Mattupetty Dam and Echo Point.',
    },
    {
      region: 'Thekkady',
      title: 'Day 05 — Thekkady Spice Sanctuary & Periyar Boat Safari',
      summary: 'Drive to Thekkady through fragrant cardamom valleys. Wildlife boat safari on Periyar Lake and a guided spice plantation walk.',
      transferFrom: 'Munnar',
    },
    {
      region: 'Alleppey',
      title: 'Day 06 — Alleppey Backwaters & Private Houseboat Journey',
      summary: 'Board a traditional Kettuvallam houseboat on Vembanad Lake, savoring freshly prepared Kerala meals as palms drift by.',
      transferFrom: 'Thekkady',
    },
    {
      region: 'Kochi',
      title: 'Day 07 — Marari Beach Breeze & Heritage Souvenirs Departure',
      summary: 'Enjoy a morning beach walk along Marari’s golden sands, pick up fresh spices in Kochi, and transfer to Cochin Airport.',
      transferFrom: 'Alleppey',
    },
  ],
};

export const keralaBundle: DestinationBundle = {
  destination: KERALA_DESTINATION,
  attractions: KERALA_ATTRACTIONS,
  hotels: KERALA_HOTELS,
  dining: KERALA_DINING,
  seasonal: KERALA_SEASONAL_INTELLIGENCE,
  getSeasonForDate: getKeralaSeasonForDate,
  travelGuide: KERALA_TRAVEL_GUIDE,
  regionalTransfers: KERALA_TRANSFERS,
  regionalHubs: KERALA_REGIONAL_HUBS,
  defaultOrigin: 'New Delhi (DEL)',
  defaultArrivalAirport: 'Cochin (COK)',
  defaultPreferredArea: 'Fort Kochi Waterfront / Munnar Hills',
  budgetDefaults: {
    flightEstimatePerPerson: 5500,
    trainEstimatePerPerson: 1800,
    privateCabPerDay: 3200, // Dedicated tourist AC sedan/Innova for Kerala circuit
    localExcursionsBuffer: 3000, // Backwater day cruise and ferry allowances
    foodDailyStandard: 1100,
    foodDailyVeg: 900, // Kerala Sadya & pure veg dining is exceptionally high value
    sightseeingPerPerson: 1600, // Eravikulam passes, Tea museum, Kathakali show, Periyar boat
    shoppingPerPerson: 1500, // Spices, cardamom, banana chips, tea leaves
    contingencyRate: 0.07,
    currency: 'INR',
    currencySymbol: '₹',
    getAssumptions: ({ totalGuests, roomsCount, nights, nightlyRate, perPersonFoodDaily, duration, diet }) => [
      `Flights estimated at average round-trip tariff of ₹11,000/person into Cochin (COK) if not marked booked.`,
      `Accommodation based on ${roomsCount} room(s) for ${nights} night(s) at ₹${nightlyRate.toLocaleString('en-IN')}/night.`,
      `Dining calculated at ₹${perPersonFoodDaily.toLocaleString('en-IN')}/person/day tailored to ${diet.toUpperCase()} diet.`,
      `Local transport covers dedicated private tourist AC cab for ${duration} days plus backwater ferry transits.`,
      `Sightseeing covers Eravikulam National Park safari, KDHP Tea Museum, Kathakali evening show, and Periyar Lake boat safari.`,
      `Contingency buffer set at 7% to absorb seasonal tariff spikes or mountain highway adjustments.`,
    ],
  },
  itineraryTemplates: KERALA_TEMPLATES,
};

