import { DiningSuggestion } from '../types/travel';

export const KASHMIR_DINING: DiningSuggestion[] = [
  // --- SRINAGAR ---
  {
    id: 'dining-krishna-vaishno-dhaba',
    name: 'Krishna Vaishno Dhaba',
    region: 'Srinagar',
    cuisineType: 'North Indian & Pure Vegetarian Specialties',
    isPureVeg: true,
    isJainFriendly: true,
    isVeganFriendly: true,
    recommendedDishes: [
      'Famous Rajma Chawal with Desi Ghee',
      'Shahi Paneer with tandoori butter roti',
      'Matar Mushroom Curry',
      'Traditional Rice Kheer',
    ],
    priceTier: 'budget',
    location: 'Durganag, Dalgate, Srinagar (Near Dal Lake Ghat 1)',
    description:
      'Srinagar’s most celebrated pure vegetarian establishment, serving immaculate no-onion/no-garlic Jain alternatives on request alongside beloved North Indian thalis and fresh tandoori breads since decades.',
    pureVegHighlights: '100% strictly pure vegetarian kitchen. Zero meat or egg preparation. Dedicated utensils for Jain requests.',
  },
  {
    id: 'dining-nathus-sweets-srinagar',
    name: 'Nathu’s Sweets & Pure Veg Restaurant',
    region: 'Srinagar',
    cuisineType: 'Pure Vegetarian Multi-Cuisine & Chaat',
    isPureVeg: true,
    isJainFriendly: true,
    isVeganFriendly: false,
    recommendedDishes: [
      'Chole Bhature & Dosa Platter',
      'Dal Makhani & Paneer Tikka Lababdar',
      'Hot Gulab Jamun & Rasmalai',
      'Kashmiri Saffron Badam Milk',
    ],
    priceTier: 'mid-range',
    location: 'Boulevard Road, Opposite Dal Lake Ghat 2, Srinagar',
    description:
      'A sprawling pure vegetarian multi-cuisine dining hub directly on Boulevard Road overlooking the water. Features street chaat, South Indian dosas, rich North Indian curries, and traditional sweet confectionaries.',
    pureVegHighlights: '100% vegetarian facility with prominent lakeside seating. Jain preparation available on order.',
  },
  {
    id: 'dining-ahdoos-srinagar',
    name: 'Ahdoos Restaurant (Established 1918)',
    region: 'Srinagar',
    cuisineType: 'Authentic Kashmiri Cuisine & Heritage Bakery',
    isPureVeg: false,
    isJainFriendly: false,
    isVeganFriendly: true,
    recommendedDishes: [
      'Authentic Kashmiri Dum Aloo (slow cooked in fennel & curd)',
      'Nadru Yakhni (lotus stem in fragrant yogurt & dried mint gravy)',
      'Chok Vangun (baby eggplants in spiced tamarind reduction)',
      'Traditional Haakh (braised collard greens with mustard oil)',
      'Fresh Kashmiri Kahwa with crushed saffron & almonds',
    ],
    priceTier: 'mid-range',
    location: 'Residency Road, Regal Chowk, Srinagar',
    description:
      'Operating since 1918 on the banks of the Jhelum, Ahdoos is the undisputed benchmark of heritage Kashmiri cuisine. While renowned for Wazwan, its separate vegetarian kitchen prepares the valley’s finest traditional vegetarian delicacies.',
    pureVegHighlights: 'Exceptional authentic Kashmiri vegetarian dishes prepared according to century-old recipes. Clean separation in kitchen.',
  },
  {
    id: 'dining-cafe-de-kashmir',
    name: 'Chai Jaai Tea Room & Cafe',
    region: 'Srinagar',
    cuisineType: 'Artisanal Tea Room, Kashmiri Bakery & Light Bites',
    isPureVeg: false,
    isJainFriendly: false,
    isVeganFriendly: true,
    recommendedDishes: [
      'Sheermal & Baqerkhani artisanal breads',
      'Kashmiri Noon Chai (Pink salty tea)',
      'Saffron Kahwa with pure mountain honey',
      'Walnut & Apricot Tart',
    ],
    priceTier: 'mid-range',
    location: 'The Bund, Near Dhanjibhoy Building, Srinagar',
    description:
      'Inspired by European and Persian tea traditions, this aesthetic haven along The Bund pairs antique samovars and papier-mâché décor with authentic local bakery breads and hot brewed saffron teas.',
    pureVegHighlights: 'Wide assortment of vegetarian baked goods, dry fruit snacks, and herbal brews.',
  },

  // --- GULMARG ---
  {
    id: 'dining-bakshi-restaurant-gulmarg',
    name: 'Bakshi Restaurant',
    region: 'Gulmarg',
    cuisineType: 'Pure Vegetarian North Indian & Comfort Food',
    isPureVeg: true,
    isJainFriendly: true,
    isVeganFriendly: true,
    recommendedDishes: [
      'Hot Stuffed Aloo & Paneer Parathas',
      'Yellow Dal Tadka & Jeera Rice',
      'Paneer Butter Masala',
      'Steaming Masala Chai in sub-zero snow',
    ],
    priceTier: 'budget',
    location: 'Main Bowl Market, Near Ice Rink, Gulmarg',
    description:
      'A cozy, steaming culinary sanctuary in the heart of Gulmarg. When snow blankets the meadow, Bakshi’s kitchen provides boiling pure-vegetarian comfort food, hot rotis straight from the tandoor, and quick Jain thalis.',
    pureVegHighlights: 'Strictly pure vegetarian mountain diner. No non-vegetarian food is cooked on the premises.',
  },
  {
    id: 'dining-cloves-khyber-gulmarg',
    name: 'Cloves Fine Dining at The Khyber',
    region: 'Gulmarg',
    cuisineType: 'Himalayan Luxury Multi-Cuisine & Kashmiri Gourmet',
    isPureVeg: false,
    isJainFriendly: true,
    isVeganFriendly: true,
    recommendedDishes: [
      'Kashmiri Nadru Palak (lotus stems with mountain spinach)',
      'Saffron Infused Vegetable Biryani with Raita',
      'Pine Nut & Morel Mushroom Risotto',
      'Artisanal Kahwa Infusion',
    ],
    priceTier: 'fine-dining',
    location: 'The Khyber Himalayan Resort, Near Gondola, Gulmarg',
    description:
      'World-class gourmet dining framed by pine-clad floor-to-ceiling windows. Features thoughtful vegetarian and Jain menus curated by executive chefs using organic produce.',
    pureVegHighlights: 'High-end culinary craftsmanship with dedicated vegetarian tasting menus and customized Jain preparations.',
  },

  // --- PAHALGAM ---
  {
    id: 'dining-dana-pani-pahalgam',
    name: 'Dana Pani Pure Vegetarian Restaurant',
    region: 'Pahalgam',
    cuisineType: 'Pure Vegetarian North Indian, Punjabi & Gujarati Thali',
    isPureVeg: true,
    isJainFriendly: true,
    isVeganFriendly: true,
    recommendedDishes: [
      'Complete Dana Pani Special Thali',
      'Gujarati Dal & Phulka (Jain available)',
      'Paneer Pasanda & Veg Korma',
      'Fresh Fruit Custard & Gulab Jamun',
    ],
    priceTier: 'mid-range',
    location: 'Main Market, KP Road, Pahalgam (Near J&K Bank)',
    description:
      'The gold standard for vegetarian travelers in Pahalgam. Known for swift, courteous service, hygienic dining halls, and a dedicated Jain menu prepared without onion, garlic, or root vegetables.',
    pureVegHighlights: '100% pure vegetarian. Widely acknowledged by pilgrim groups and family travelers for reliable hygiene and Jain compliance.',
  },
  {
    id: 'dining-punjabi-rasoi-pahalgam',
    name: 'Punjabi Rasoi',
    region: 'Pahalgam',
    cuisineType: 'North Indian Pure Veg & Tandoor',
    isPureVeg: true,
    isJainFriendly: true,
    isVeganFriendly: true,
    recommendedDishes: [
      'Kashmiri Dum Aloo with Garlic-Free Gravy',
      'Sarson Ka Saag with Makki Di Roti (Seasonal)',
      'Dal Makhani slow simmered overnight',
      'Fresh Curd Lassi',
    ],
    priceTier: 'budget',
    location: 'Main Bazaar, Pahalgam',
    description:
      'A warm, bustling pure-veg haven in Pahalgam market offering fresh piping-hot tandoori rotis, fragrant vegetarian curries, and quick takeaway box lunches for day excursions to Betaab and Aru valleys.',
    pureVegHighlights: 'Dedicated pure vegetarian setup with quick turnaround for day-trip travelers.',
  },
];

