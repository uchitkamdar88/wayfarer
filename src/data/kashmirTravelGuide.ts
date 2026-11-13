export interface ChecklistCategory {
  category: string;
  items: { id: string; label: string; tip?: string; isEssential: boolean }[];
}

export const KASHMIR_TRAVEL_GUIDE = {
  essentialDocuments: [
    {
      title: 'Government Photo ID Proof',
      detail:
        'Valid Aadhaar Card, Passport, or Voter ID for every adult traveller. Strict verification is conducted at Srinagar Airport and high-security shrines.',
    },
    {
      title: 'Mobile Phone SIM / Connectivity Notice',
      detail:
        'IMPORTANT: Prepaid mobile SIM cards issued in other Indian states DO NOT work in Jammu & Kashmir due to Ministry of Telecommunications regulations. You MUST carry an Indian Postpaid SIM (Jio, Airtel, or BSNL) or purchase a local J&K prepaid SIM upon landing at Srinagar airport with photo ID.',
    },
    {
      title: 'Printed Vouchers & Offline Confirmations',
      detail:
        'Keep printed copies or offline PDF downloads of your flight tickets, hotel vouchers, and Gulmarg Gondola e-tickets, as mobile data coverage may be intermittent in high-altitude passes.',
    },
  ],

  localTransportRules: [
    {
      title: 'Gulmarg Internal Transport & Snow Chains',
      detail:
        'Outside tourist cabs from Srinagar can drop you at your Gulmarg hotel. However, for internal meadow exploration or travel up from Tangmarg in heavy winter snow, local union vehicles fitted with iron snow-chains or licensed sledges/ponies must be hired at standardized union rates.',
    },
    {
      title: 'Pahalgam Taxi Union Regulations',
      detail:
        'Outside cabs are strictly prohibited from driving to Aru Valley, Betaab Valley, and Chandanwari. You must hire a registered Pahalgam Tourist Taxi Union cab from the main town taxi stand. Fix rates directly from the official union tariff board.',
    },
    {
      title: 'Regulated Shikara Ghats on Dal Lake',
      detail:
        'Always hire Shikaras from designated JKTDC tourist ghats (Ghat 1 to 12) displaying official hourly tariff signboards (standard rate ~₹800/hour for up to 4 persons). Avoid touts approaching you on Boulevard road.',
    },
  ],

  culturalEtiquette: [
    {
      title: 'Shrine & Temple Etiquette',
      detail:
        'Dress modestly when visiting Hazratbal Shrine, Jamia Masjid, and Shankaracharya Temple. Remove footwear outside. Heads must be covered before entering Muslim shrines; shoes and leather items are prohibited inside Hindu temple sanctums.',
    },
    {
      title: 'Photography & Defense Guidelines',
      detail:
        'Strictly avoid photographing military convoys, army bunkers, defense installations, airport runways, or security checkpoints. Always seek polite verbal consent before photographing local Kashmiri residents or artisans.',
    },
    {
      title: 'Authentic Craftsmanship & Saffron Verification',
      detail:
        'When purchasing Kashmiri Saffron, look for certified GI tags and vacuum-sealed containers. For genuine hand-woven Pashmina shawls, verify the official Kashmiri GI tag or purchase from government-run Kashmir Arts Emporiums on Boulevard or Residency Road.',
    },
  ],

  checklist: [
    {
      category: 'Crucial Travel Essentials',
      items: [
        { id: 'c1', label: 'Government Photo IDs (Aadhaar / Passport) for all guests', isEssential: true },
        { id: 'c2', label: 'Postpaid Mobile SIM card (Prepaid from outside J&K will not work)', isEssential: true },
        { id: 'c3', label: 'Printed or offline Gondola tickets & hotel confirmations', isEssential: true },
        { id: 'c4', label: 'Cash in currency notes (some remote meadow stalls do not accept UPI/cards)', isEssential: true },
        { id: 'c5', label: 'High-capacity power bank (battery discharges quickly in freezing cold)', isEssential: true },
      ],
    },
    {
      category: 'Clothing & Footwear',
      items: [
        { id: 'c6', label: 'Layered clothing: Thermal innerwear tops and bottoms', isEssential: true },
        { id: 'c7', label: 'Windproof & waterproof outer jacket / down coat', isEssential: true },
        { id: 'c8', label: 'Comfortable walking shoes with deep rubber grip for meadows', isEssential: true },
        { id: 'c9', label: 'Woollen caps / beanies that cover ears and throat', isEssential: true },
        { id: 'c10', label: 'Fleece-lined thermal gloves and woollen socks (minimum 3 pairs)', isEssential: false },
        { id: 'c11', label: 'Sunglasses with 100% UV protection (crucial against snow glare)', isEssential: true },
      ],
    },
    {
      category: 'Health, Skin & Personal Care',
      items: [
        { id: 'c12', label: 'High SPF sunscreen (SPF 50+) and moisturizing lip balm', isEssential: true },
        { id: 'c13', label: 'Cold cream / petroleum jelly for dry mountain skin', isEssential: false },
        { id: 'c14', label: 'Motion sickness tablets (for winding Tangmarg / Pahalgam mountain roads)', isEssential: true },
        { id: 'c15', label: 'Basic first aid: Band-aids, paracetamol, antacids, ORS hydration sachets', isEssential: true },
        { id: 'c16', label: 'Personal daily prescribed medicines in ample quantity with prescriptions', isEssential: true },
      ],
    },
  ] as ChecklistCategory[],
};

