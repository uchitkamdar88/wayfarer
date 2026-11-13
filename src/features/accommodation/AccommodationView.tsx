import React, { useState } from 'react';
import { Hotel, RoomQuality } from '../../types/travel';
import {
  Building,
  Star,
  ExternalLink,
  Check,
  ShieldCheck,
  Info,
  Sparkles,
  Scale,
  X,
} from 'lucide-react';
import { ScenicArt } from '../../components/common/ScenicArt';

interface AccommodationViewProps {
  selectedHotel?: Hotel;
  recommendedHotels: Hotel[];
  nightsCount: number;
  roomsCount: number;
  roomQuality: RoomQuality;
  onSelectHotel: (hotel: Hotel) => void;
  destinationName?: string;
  targetNightlyBudget?: number;
}

export const AccommodationView: React.FC<AccommodationViewProps> = ({
  selectedHotel,
  recommendedHotels,
  nightsCount,
  roomsCount,
  roomQuality,
  onSelectHotel,
  destinationName = 'Your Destination',
  targetNightlyBudget,
}) => {
  const [filterRegion, setFilterRegion] = useState<string>('all');
  const [filterCategory, setFilterCategory] = useState<string>('all');
  const [comparedIds, setComparedIds] = useState<string[]>([]);

  // Use only the destination's recommended hotels — never pull from a hardcoded dataset
  const allHotels = recommendedHotels;

  // Derive unique regions dynamically from the hotels list
  const availableRegions = Array.from(new Set(allHotels.map((h) => h.region)));

  const filtered = allHotels.filter((h) => {
    if (filterRegion !== 'all' && h.region.toLowerCase() !== filterRegion.toLowerCase()) {
      return false;
    }
    if (filterCategory !== 'all' && h.category !== filterCategory) {
      return false;
    }
    return true;
  });

  const toggleCompare = (hotelId: string) => {
    setComparedIds((prev) => {
      if (prev.includes(hotelId)) {
        return prev.filter((id) => id !== hotelId);
      }
      if (prev.length >= 3) {
        return prev; // Maximum 3
      }
      return [...prev, hotelId];
    });
  };

  const comparedHotels = allHotels.filter((h) => comparedIds.includes(h.id));

  return (
    <div className="space-y-8 font-sans">
      {/* Overview Banner */}
      <div className="bg-white rounded-2xl border border-stone-250 p-6 sm:p-8 shadow-soft">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center space-x-2">
              <span className="px-2.5 py-0.5 rounded-full text-xs font-bold uppercase tracking-wider bg-champagne-100 text-champagne-800">
                CURATED HOSPITALITY BENCHMARK
              </span>
              <span className="text-xs text-stone-500 font-medium">
                {roomsCount} Room(s) • {nightsCount} Night(s) Stay
              </span>
            </div>
            <h2 className="font-serif text-2xl sm:text-3xl font-bold text-ink-950 mt-1">
              Curated Accommodations
            </h2>
            <p className="text-xs sm:text-sm text-stone-600 mt-1 max-w-2xl">
              Transparent accommodation benchmarks for {destinationName}. Compare up to 3 properties side-by-side with verified official portal links and zero hidden booking markups.
            </p>
          </div>

          <div className="p-3 bg-sage-50 border border-sage-200 rounded-xl text-xs text-sage-900 flex items-center space-x-2">
            <ShieldCheck className="w-5 h-5 text-sage-600 shrink-0" />
            <span>Direct Official Links • Zero OTA Hidden Commissions</span>
          </div>
        </div>

        {/* Filters & Comparison Bar */}
        <div className="mt-6 pt-6 border-t border-stone-200 flex flex-wrap gap-4 items-center justify-between text-xs">
          <div className="flex items-center flex-wrap gap-2">
            <span className="font-semibold text-stone-700">Filter Region:</span>
            {['all', ...availableRegions].map((reg) => (
              <button
                key={reg}
                onClick={() => setFilterRegion(reg)}
                className={`px-3 py-1.5 rounded-lg font-medium transition-all ${
                  filterRegion === reg
                    ? 'bg-ink-900 text-ivory-50'
                    : 'bg-stone-100 text-stone-700 hover:bg-stone-200'
                }`}
              >
                {reg === 'all' ? 'All Regions' : reg}
              </button>
            ))}
          </div>

          <div className="flex items-center space-x-2">
            <span className="font-semibold text-stone-700">Star Rating:</span>
            {['all', '5-star', '4-star', '3-star', 'heritage'].map((cat) => (
              <button
                key={cat}
                onClick={() => setFilterCategory(cat)}
                className={`px-3 py-1.5 rounded-lg font-medium capitalize transition-all ${
                  filterCategory === cat
                    ? 'bg-ink-900 text-ivory-50'
                    : 'bg-stone-100 text-stone-700 hover:bg-stone-200'
                }`}
              >
                {cat === 'all' ? 'All Tiers' : cat}
              </button>
            ))}
          </div>
        </div>

        {/* Comparison Indicator Bar */}
        {comparedIds.length > 0 && (
          <div className="mt-4 p-3 bg-champagne-50 border border-champagne-300 rounded-xl flex items-center justify-between text-xs">
            <div className="flex items-center space-x-2">
              <Scale className="w-4 h-4 text-champagne-700" />
              <span className="font-bold text-ink-900">
                {comparedIds.length} of 3 properties selected for comparison
              </span>
              <span className="text-stone-500">
                ({comparedHotels.map((h) => h.name).join(', ')})
              </span>
            </div>
            <button
              onClick={() => setComparedIds([])}
              className="text-stone-500 hover:text-stone-800 font-semibold underline"
            >
              Clear Comparison
            </button>
          </div>
        )}
      </div>

      {/* SIDE-BY-SIDE HOTEL COMPARISON TABLE (Shown when >= 2 hotels are checked) */}
      {comparedHotels.length >= 2 && (
        <div className="bg-white rounded-2xl border-2 border-champagne-400 p-6 shadow-elevated overflow-hidden animate-fade-in">
          <div className="flex items-center justify-between mb-4 pb-3 border-b border-stone-200">
            <div className="flex items-center space-x-2">
              <Scale className="w-5 h-5 text-champagne-700" />
              <h3 className="font-serif text-xl font-bold text-ink-950">
                Side-by-Side Property Comparison ({comparedHotels.length} Hotels)
              </h3>
            </div>
            <button
              onClick={() => setComparedIds([])}
              className="p-1.5 rounded-lg text-stone-400 hover:text-stone-700 hover:bg-stone-100"
              title="Close Comparison"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-stone-200 bg-stone-50">
                  <th className="p-3 font-bold text-stone-600 w-36">Metric / Property</th>
                  {comparedHotels.map((h) => (
                    <th key={h.id} className="p-3 font-serif text-sm font-bold text-ink-900">
                      {h.name}
                      {selectedHotel?.id === h.id && (
                        <span className="ml-2 text-[10px] font-sans px-2 py-0.5 rounded bg-sage-100 text-sage-800 font-bold uppercase tracking-wider">
                          Active Selection
                        </span>
                      )}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-150">
                <tr>
                  <th className="p-3 font-semibold text-stone-500">Region & Area</th>
                  {comparedHotels.map((h) => (
                    <td key={h.id} className="p-3 font-medium text-stone-800">
                      {h.region} ({h.area})
                    </td>
                  ))}
                </tr>
                <tr>
                  <th className="p-3 font-semibold text-stone-500">Tier / Rating</th>
                  {comparedHotels.map((h) => (
                    <td key={h.id} className="p-3 text-stone-800">
                      <span className="font-bold text-ink-900 uppercase">{h.category}</span>
                      <span className="text-stone-400 ml-1">· Verified Link</span>
                    </td>
                  ))}
                </tr>
                <tr>
                  <th className="p-3 font-semibold text-stone-500">Nightly Rate</th>
                  {comparedHotels.map((h) => (
                    <td key={h.id} className="p-3 font-bold text-ink-950">
                      ₹{h.basePriceInr.toLocaleString('en-IN')}{' '}
                      <span className="font-normal text-stone-500">/ night</span>
                    </td>
                  ))}
                </tr>
                <tr>
                  <th className="p-3 font-semibold text-stone-500">
                    Stay Total ({nightsCount}N, {roomsCount}R)
                  </th>
                  {comparedHotels.map((h) => {
                    const total = h.basePriceInr * nightsCount * roomsCount;
                    return (
                      <td key={h.id} className="p-3 font-bold text-champagne-700 text-sm">
                        ₹{total.toLocaleString('en-IN')}
                      </td>
                    );
                  })}
                </tr>
                <tr>
                  <th className="p-3 font-semibold text-stone-500">Budget Fit</th>
                  {comparedHotels.map((h) => {
                    const fits = !targetNightlyBudget || h.basePriceInr <= targetNightlyBudget;
                    return (
                      <td key={h.id} className="p-3">
                        <span
                          className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                            fits
                              ? 'bg-sage-100 text-sage-800'
                              : 'bg-amber-100 text-amber-800'
                          }`}
                        >
                          {fits ? 'Within Budget' : 'Above Target Budget'}
                        </span>
                      </td>
                    );
                  })}
                </tr>
                <tr>
                  <th className="p-3 font-semibold text-stone-500">Amenities</th>
                  {comparedHotels.map((h) => (
                    <td key={h.id} className="p-3 text-stone-600">
                      {h.amenities.slice(0, 4).join(', ')}
                    </td>
                  ))}
                </tr>
                <tr>
                  <th className="p-3 font-semibold text-stone-500">Highlights</th>
                  {comparedHotels.map((h) => (
                    <td key={h.id} className="p-3 text-stone-600">
                      {h.highlights.slice(0, 2).join('. ')}
                    </td>
                  ))}
                </tr>
                <tr className="bg-stone-50">
                  <th className="p-3 font-semibold text-stone-500">Action</th>
                  {comparedHotels.map((h) => {
                    const isSelected = selectedHotel?.id === h.id;
                    return (
                      <td key={h.id} className="p-3">
                        <div className="flex items-center space-x-2">
                          <button
                            onClick={() => onSelectHotel(h)}
                            className={`px-3 py-1.5 rounded-lg text-xs font-bold uppercase tracking-wider transition-all ${
                              isSelected
                                ? 'bg-sage-700 text-white'
                                : 'bg-ink-900 text-ivory-50 hover:bg-ink-800'
                            }`}
                          >
                            {isSelected ? 'Selected' : 'Use This Hotel'}
                          </button>
                          <a
                            href={h.officialUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="p-1.5 rounded-lg border border-stone-300 hover:bg-stone-100 text-stone-600"
                            title="Official Website"
                          >
                            <ExternalLink className="w-3.5 h-3.5" />
                          </a>
                        </div>
                      </td>
                    );
                  })}
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Hotel Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filtered.map((hotel) => {
          const isSelected = selectedHotel?.id === hotel.id;
          const isCompared = comparedIds.includes(hotel.id);
          const totalStayCost = hotel.basePriceInr * nightsCount * roomsCount;

          return (
            <div
              key={hotel.id}
              className={`bg-white rounded-2xl border overflow-hidden shadow-soft flex flex-col justify-between transition-all ${
                isSelected
                  ? 'border-champagne-500 ring-2 ring-champagne-400/50 shadow-elevated'
                  : 'border-stone-250 hover:shadow-elevated'
              }`}
            >
              <div>
                {/* Photo & Category Ribbon */}
                <div className="relative h-56 w-full bg-stone-100">
                  <ScenicArt
                    image={hotel.image}
                    kind="garden"
                    label={hotel.name}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-ink-950/80 via-ink-950/20 to-transparent" />

                  <div className="absolute top-4 left-4 flex items-center space-x-2">
                    <span className="px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-ink-900/90 text-champagne-300 backdrop-blur-sm border border-champagne-400/30">
                      {hotel.category.toUpperCase()}
                    </span>
                    <span className="px-2.5 py-1 rounded-full text-[10px] font-semibold bg-white/90 text-stone-800 backdrop-blur-sm">
                      {hotel.region}
                    </span>
                  </div>

                  {isSelected && (
                    <div className="absolute top-4 right-4 bg-champagne-500 text-ink-950 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider flex items-center space-x-1 shadow-md">
                      <Check className="w-3.5 h-3.5 stroke-[3]" />
                      <span>Selected for Itinerary</span>
                    </div>
                  )}

                  <div className="absolute bottom-4 left-4 right-4 text-white">
                    <h3 className="font-serif text-xl font-bold text-white mb-0.5">
                      {hotel.name}
                    </h3>
                    <p className="text-xs text-stone-300">{hotel.area}</p>
                  </div>
                </div>

                {/* Details Section */}
                <div className="p-6 space-y-4">
                  {/* Pricing Breakdown Box */}
                  <div className="p-4 rounded-xl bg-stone-50 border border-stone-200 flex items-center justify-between">
                    <div>
                      <span className="text-[10px] uppercase font-bold tracking-wider text-stone-500">
                        Indicative Benchmark
                      </span>
                      <div className="text-lg font-bold text-ink-900">
                        ₹{hotel.basePriceInr.toLocaleString('en-IN')}{' '}
                        <span className="text-xs font-normal text-stone-500">/ night</span>
                      </div>
                    </div>

                    <div className="text-right">
                      <span className="text-[10px] uppercase font-bold tracking-wider text-champagne-700">
                        Estimated Stay ({nightsCount} nights, {roomsCount} room)
                      </span>
                      <div className="text-base font-bold text-champagne-700">
                        ~₹{totalStayCost.toLocaleString('en-IN')}
                      </div>
                    </div>
                  </div>

                  {/* Highlights */}
                  <div>
                    <span className="text-[11px] font-bold uppercase tracking-wider text-stone-700 block mb-1.5">
                      Property Highlights:
                    </span>
                    <ul className="space-y-1 text-xs text-stone-600">
                      {hotel.highlights.map((h, i) => (
                        <li key={i} className="flex items-start space-x-2">
                          <span className="text-champagne-600 font-bold">•</span>
                          <span>{h}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Amenities Tags */}
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {hotel.amenities.map((amenity, i) => (
                      <span
                        key={i}
                        className="px-2 py-0.5 rounded text-[10px] font-medium bg-stone-100 text-stone-700"
                      >
                        {amenity}
                      </span>
                    ))}
                  </div>

                  <p className="text-[10px] text-stone-500 italic border-t border-stone-200 pt-3">
                    {hotel.verificationDisclaimer} Last reviewed: {hotel.lastReviewedDate}.
                  </p>
                </div>
              </div>

              {/* Bottom Buttons */}
              <div className="p-6 pt-0 flex items-center space-x-3">
                <button
                  onClick={() => onSelectHotel(hotel)}
                  className={`flex-1 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-all flex items-center justify-center space-x-1.5 ${
                    isSelected
                      ? 'bg-sage-700 text-white'
                      : 'bg-ink-900 text-ivory-50 hover:bg-ink-800'
                  }`}
                >
                  <Check className="w-3.5 h-3.5" />
                  <span>{isSelected ? 'Currently Selected' : 'Select for Trip'}</span>
                </button>

                <label className="flex items-center space-x-1.5 px-3 py-2 rounded-xl border border-stone-300 hover:bg-stone-50 cursor-pointer text-xs font-medium text-stone-700">
                  <input
                    type="checkbox"
                    checked={isCompared}
                    onChange={() => toggleCompare(hotel.id)}
                    disabled={!isCompared && comparedIds.length >= 3}
                    className="rounded text-champagne-600 focus:ring-champagne-500"
                  />
                  <Scale className="w-3.5 h-3.5 text-stone-500" />
                  <span>Compare</span>
                </label>

                <a
                  href={hotel.officialUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-3.5 py-2.5 rounded-xl border border-stone-300 text-stone-700 hover:bg-stone-50 text-xs font-semibold flex items-center space-x-1 shrink-0"
                  title="Visit Official Website"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
