import React, { useState } from 'react';
import { MapPin, Utensils, Sparkles, ArrowRight, ShieldCheck, Compass } from 'lucide-react';
import { ScenicArt } from '../../components/common/ScenicArt';

interface SampleItineraryPreviewProps {
  onCustomizeSample: (destId?: string) => void;
}

interface SampleStop {
  stop: number;
  title: string;
  region: string;
  image: string;
  highlights: { title: string; desc: string }[];
  dining: string;
}

interface SampleJourney {
  id: string;
  name: string;
  tagline: string;
  stops: SampleStop[];
}

const SAMPLE_JOURNEYS: SampleJourney[] = [
  {
    id: 'kashmir',
    name: 'Kashmir Valley',
    tagline: 'Mughal Gardens, Gulmarg Gondola & Lidder Pine Trails',
    stops: [
      {
        stop: 1,
        title: 'Arrival in Srinagar & Dal Lake Sunset Shikara',
        region: 'Srinagar',
        image: 'https://images.unsplash.com/photo-1595815771614-ade9d652a65d?auto=format&fit=crop&w=1000&q=80',
        highlights: [
          {
            title: 'Airport Landing & Hotel Check-in',
            desc: 'Land at Srinagar Airport (SXR). Private transfer to luxury heritage property on Boulevard Road. Welcome cups of saffron Kahwa.',
          },
          {
            title: 'Nishat Bagh Mughal Terraced Gardens',
            desc: '12 stone terraces overlooking Dal Lake, designed by Asif Khan in 1633 under century-old Chinar trees.',
          },
          {
            title: 'Twilight Shikara Ride on Dal Lake',
            desc: 'Glide past floating lotus pads and traditional wooden houseboats as the Zabarwan range turns violet in sunset.',
          },
        ],
        dining: 'Krishna Vaishno Dhaba — Iconic Pure Vegetarian Rajma Chawal & Desi Ghee Tandoori Roti.',
      },
      {
        stop: 2,
        title: 'Gulmarg Alpine Meadows & The High Gondola',
        region: 'Gulmarg',
        image: 'https://images.unsplash.com/photo-1579888944880-d98341245702?auto=format&fit=crop&w=1000&q=80',
        highlights: [
          {
            title: 'Gondola Phase 1 (Kongdoori) & Phase 2 (Apharwat Peak)',
            desc: 'Ascend over evergreen pine canopies to 3,980m near perpetual snowfields. Rare panoramic views of Nanga Parbat.',
          },
          {
            title: 'Historic St. Mary’s Church & Golf Meadow',
            desc: 'Stroll across rolling green fairways to the 1902 British-era Victorian stone church.',
          },
          {
            title: 'Mountain Tea by Bukhari Fireplace',
            desc: 'Warm up with hot saffron tea and almond cookies at a mountain cafe.',
          },
        ],
        dining: 'Bakshi Restaurant — Pure vegetarian comfort food, piping hot rotis & dal makhani in chilly mountain air.',
      },
      {
        stop: 3,
        title: 'Journey to Pahalgam & Betaab Valley',
        region: 'Pahalgam',
        image: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1000&q=80',
        highlights: [
          {
            title: 'Scenic Drive via Pampore Saffron Plateau',
            desc: 'Transfer through purple saffron fields and 9th-century Awantipora stone ruins towards the Lidder Valley.',
          },
          {
            title: 'Betaab Valley & Lidder Riverside',
            desc: 'Lush pastures bordered by weeping willows and glacial mountain torrents.',
          },
          {
            title: 'Pahalgam Bazaar Promenade',
            desc: 'Visit walnut craft shops and stroll along stone banks of the Lidder river.',
          },
        ],
        dining: 'Dana Pani — 100% pure vegetarian Gujarati and North Indian dining with dedicated Jain menu.',
      },
      {
        stop: 4,
        title: 'Glacial Excursion to Sonamarg & Thajiwas',
        region: 'Sonamarg',
        image: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=1000&q=80',
        highlights: [
          {
            title: 'Sindh River Highway Ascent',
            desc: 'Follow the ancient Silk Route to Ladakh past Kangan and rushing glacial rapids.',
          },
          {
            title: 'Thajiwas Glacier Walk',
            desc: 'Pony ride or gentle walk to snow bridges beneath towering Someshwar peaks.',
          },
          {
            title: 'Meadow of Gold Panorama',
            desc: 'Vast alpine pastures dotted with pine glades and local shepherd chalets.',
          },
        ],
        dining: 'Ahdoos Restaurant (Est. 1918) — Traditional Kashmiri Dum Aloo & Nadru Yakhni.',
      },
    ],
  },
  {
    id: 'kerala',
    name: 'Kerala Backwaters & Hills',
    tagline: 'Colonial Fort Kochi, Mist-Clad Munnar & Private Houseboat',
    stops: [
      {
        stop: 1,
        title: 'Fort Kochi Waterfront & Kathakali Twilight',
        region: 'Kochi',
        image: 'https://images.unsplash.com/photo-1593693397690-362cb9666fc2?auto=format&fit=crop&w=1000&q=80',
        highlights: [
          {
            title: 'Chinese Fishing Nets at Sunset',
            desc: '14th-century cantilevered teak fishing nets operated by local fishermen on the Arabian shore.',
          },
          {
            title: 'Mattancherry Palace & Jew Town',
            desc: 'Centuries-old Ramayana tempera murals and cobblestone spice trade souks.',
          },
          {
            title: 'Kerala Kathakali Performance',
            desc: 'Witness classical dance-drama makeup rituals and facial expression demonstrations.',
          },
        ],
        dining: 'Brindhavan Vegetarian Restaurant — Fresh Appam with vegetable stew & Crispy Ghee Roast Dosa.',
      },
      {
        stop: 2,
        title: 'Munnar Emerald Tea Carpets & Eravikulam',
        region: 'Munnar',
        image: 'https://images.unsplash.com/photo-1590766940554-634a7ed41450?auto=format&fit=crop&w=1000&q=80',
        highlights: [
          {
            title: 'Eravikulam National Park Safari',
            desc: 'Spot endangered Nilgiri Tahr mountain goats amidst rolling cloud-kissed grasslands.',
          },
          {
            title: 'KDHP Tea Museum & Factory',
            desc: 'Learn orthodox tea manufacturing and sample single-estate highland black teas.',
          },
          {
            title: 'Mattupetty Lake & Echo Point',
            desc: 'Serene reservoir bordered by rolling tea gardens and eucalyptus forests.',
          },
        ],
        dining: 'Sree Saravana Bhavan Munnar — 100% pure vegetarian Tamil & Kerala banana-leaf thali.',
      },
      {
        stop: 3,
        title: 'Private Kettuvallam Houseboat on Vembanad',
        region: 'Alleppey',
        image: 'https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?auto=format&fit=crop&w=1000&q=80',
        highlights: [
          {
            title: 'Houseboat Embarkation at Punnamada',
            desc: 'Step aboard your private eco-friendly thatched teakwood cruiser with onboard crew and chef.',
          },
          {
            title: 'Canal & Village Palm Cruising',
            desc: 'Drift past sunken paddy fields, church spires, and village life along palm-fringed banks.',
          },
          {
            title: 'Sunset Lake Anchorage',
            desc: 'Houseboat anchors along quiet village banks for dinner under starlit tropical skies.',
          },
        ],
        dining: 'Onboard Houseboat Kitchen — Authentic Kerala Sadhya with Avial, Thoran, Sambar & Red Rice.',
      },
    ],
  },
  {
    id: 'rajasthan',
    name: 'Royal Rajasthan',
    tagline: 'Amber Fort Citadel, Blue City Jodhpur & Starlit Desert',
    stops: [
      {
        stop: 1,
        title: 'Amber Fort & Pink City Heritage',
        region: 'Jaipur',
        image: 'https://images.unsplash.com/photo-1599661046289-e31897846e41?auto=format&fit=crop&w=1000&q=80',
        highlights: [
          {
            title: 'Amber Fort & Sheesh Mahal',
            desc: 'Yellow sandstone citadel overlooking Maota Lake with thousands of convex mirror inlays.',
          },
          {
            title: 'Hawa Mahal Palace of Winds',
            desc: '953 pink sandstone jharokhas designed for royal women to observe street festivals.',
          },
          {
            title: 'Johari & Bapu Craft Bazaars',
            desc: 'Browse authentic block-printed cottons, blue pottery, and lac bangles.',
          },
        ],
        dining: 'LMB (Laxmi Mishthan Bhandar) — Royal Rajasthani Dal Baati Churma & Paneer Ghewar.',
      },
      {
        stop: 2,
        title: 'Mehrangarh Citadel & The Blue City',
        region: 'Jodhpur',
        image: 'https://images.unsplash.com/photo-1588096344356-787140e70335?auto=format&fit=crop&w=1000&q=80',
        highlights: [
          {
            title: 'Mehrangarh Fort Ramparts',
            desc: 'Impregnable fortress towering 125 meters above the indigo-blue cubical houses of Jodhpur.',
          },
          {
            title: 'Jaswant Thada Cenotaph',
            desc: 'Intricately carved white marble royal cenotaph with lakeside gazebos.',
          },
          {
            title: 'Clock Tower & Sardar Market',
            desc: 'Bustling spice and textile alleys filled with the scent of red chili and saffron tea.',
          },
        ],
        dining: 'Gypsy Dining Hall — Celebrated 29-item Marwari pure-vegetarian grand thali.',
      },
      {
        stop: 3,
        title: 'Lake Pichola Sunset & City Palace',
        region: 'Udaipur',
        image: 'https://images.unsplash.com/photo-1597074866923-dc0589150358?auto=format&fit=crop&w=1000&q=80',
        highlights: [
          {
            title: 'Udaipur City Palace Museum',
            desc: 'Sprawling 400-year-old marble and granite palace complex overlooking Lake Pichola.',
          },
          {
            title: 'Sunset Boat Cruise past Jag Mandir',
            desc: 'Peaceful twilight waters reflecting the illuminated floating palace and ghats.',
          },
          {
            title: 'Saheliyon Ki Bari Royal Fountains',
            desc: 'Historic landscaped gardens with marble elephant fountains and lotus pools.',
          },
        ],
        dining: 'Natraj Dining Hall — Unlimited Gujarati and Rajasthani thali with hot Desi Ghee Baatis.',
      },
    ],
  },
];

export const SampleItineraryPreview: React.FC<SampleItineraryPreviewProps> = ({
  onCustomizeSample,
}) => {
  const [activeJourneyIndex, setActiveJourneyIndex] = useState(0);
  const [activeStopIndex, setActiveStopIndex] = useState(0);

  const currentJourney = SAMPLE_JOURNEYS[activeJourneyIndex];
  const current = currentJourney.stops[activeStopIndex] || currentJourney.stops[0];

  const handleSelectJourney = (idx: number) => {
    setActiveJourneyIndex(idx);
    setActiveStopIndex(0);
  };

  return (
    <section id="sample-itinerary" className="py-24 bg-ivory-50 border-b border-stone-250">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto text-center mb-10">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-champagne-100 text-champagne-800 text-xs font-semibold mb-3">
            <Sparkles className="w-3.5 h-3.5 text-champagne-600" />
            <span>CURATED ROUTE PREVIEWS</span>
          </div>
          <h2 className="font-serif text-3xl sm:text-4xl font-bold text-ink-950">
            A Glimpse of Real Curated Journeys
          </h2>
          <p className="text-sm text-stone-600 mt-2 font-sans">
            Explore authentic itineraries curated for depth, regional pacing, and verified dining. Select a destination to preview its route structure.
          </p>

          {/* Destination Switcher Tabs */}
          <div className="flex flex-wrap items-center justify-center gap-2 mt-6">
            {SAMPLE_JOURNEYS.map((j, idx) => (
              <button
                key={j.id}
                onClick={() => handleSelectJourney(idx)}
                className={`px-4 py-2 rounded-full text-xs font-bold transition-all ${
                  activeJourneyIndex === idx
                    ? 'bg-ink-900 text-ivory-50 shadow-soft scale-105'
                    : 'bg-white text-stone-700 border border-stone-300 hover:bg-stone-100'
                }`}
              >
                {j.name}
              </button>
            ))}
          </div>
        </div>

        {/* Stop Selector Tabs for current journey */}
        <div className="flex flex-wrap items-center justify-center gap-2 mb-10">
          {currentJourney.stops.map((d, idx) => (
            <button
              key={d.stop}
              onClick={() => setActiveStopIndex(idx)}
              className={`px-4 py-2 rounded-full text-xs font-semibold tracking-wider transition-all ${
                activeStopIndex === idx
                  ? 'bg-champagne-500 text-ink-950 shadow-soft font-bold'
                  : 'bg-white text-stone-700 border border-stone-250 hover:bg-stone-100'
              }`}
            >
              STOP 0{d.stop} • {d.region.toUpperCase()}
            </button>
          ))}
        </div>

        {/* Preview Card */}
        <div className="bg-white rounded-2xl border border-stone-250 shadow-elevated overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-12">
            {/* Visual Column */}
            <div className="lg:col-span-5 relative min-h-[300px] lg:min-h-full bg-stone-100">
              <ScenicArt
                image={current.image}
                label={current.title}
                className="w-full h-full object-cover absolute inset-0"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-ink-950/85 via-ink-950/20 to-transparent flex flex-col justify-end p-8 text-white">
                <span className="text-xs uppercase tracking-widest text-champagne-300 font-semibold mb-1">
                  ROUTE STOP 0{current.stop} • {current.region}
                </span>
                <h3 className="font-serif text-2xl font-bold text-white mb-2 leading-snug">
                  {current.title}
                </h3>
                <div className="flex items-center space-x-2 text-xs text-stone-300">
                  <MapPin className="w-3.5 h-3.5 text-champagne-400" />
                  <span>Geographically sequenced for minimum road strain</span>
                </div>
              </div>
            </div>

            {/* Schedule Details Column */}
            <div className="lg:col-span-7 p-8 lg:p-10 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between border-b border-stone-250 pb-4 mb-6">
                  <span className="text-xs font-bold uppercase tracking-wider text-champagne-600">
                    Suggested Highlights
                  </span>
                  <span className="text-xs text-stone-500">In route order</span>
                </div>

                <div className="space-y-6">
                  {current.highlights.map((item, i) => (
                    <div key={i} className="flex items-start space-x-4">
                      <div className="w-7 h-7 shrink-0 rounded-full bg-champagne-50 border border-champagne-200 flex items-center justify-center">
                        <span className="text-[10px] font-bold text-champagne-800">{i + 1}</span>
                      </div>
                      <div className="flex-1 pb-1">
                        <h4 className="text-sm font-bold text-ink-900">{item.title}</h4>
                        <p className="text-xs text-stone-600 mt-1 leading-relaxed">{item.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Dining Highlight Box */}
                <div className="mt-8 p-4 rounded-xl bg-sage-50 border border-sage-200 flex items-start space-x-3 text-xs text-sage-900">
                  <Utensils className="w-4 h-4 text-sage-700 shrink-0 mt-0.5" />
                  <div>
                    <strong className="font-bold text-sage-950">Curated Dining:</strong>{' '}
                    <span>{current.dining}</span>
                  </div>
                </div>
              </div>

              {/* Action Button */}
              <div className="mt-8 pt-6 border-t border-stone-200 flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="flex items-center space-x-2 text-xs text-stone-500">
                  <ShieldCheck className="w-4 h-4 text-sage-600" />
                  <span>Flexible route outline — fully modifiable</span>
                </div>

                <button
                  onClick={() => onCustomizeSample(currentJourney.id)}
                  className="w-full sm:w-auto px-6 py-3 rounded-full bg-ink-900 text-ivory-50 hover:bg-ink-800 text-xs font-semibold tracking-wide uppercase transition-all shadow-sm flex items-center justify-center space-x-2 group"
                >
                  <Compass className="w-4 h-4 text-champagne-400" />
                  <span>Plan {currentJourney.name.split('—')[0].trim()} Route</span>
                  <ArrowRight className="w-4 h-4 text-champagne-400 group-hover:translate-x-1 transition-transform" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
