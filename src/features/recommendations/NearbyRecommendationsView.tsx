import React, { useState } from 'react';
import { NearbyRecommendation } from '../../lib/recommendation/nearbyPlaces';
import {
  Compass,
  Sparkles,
  MapPin,
  Clock,
  Car,
  Calendar,
  Coins,
  CheckCircle2,
  AlertCircle,
  Plus,
  ExternalLink,
  Info,
} from 'lucide-react';
import { ScenicArt } from '../../components/common/ScenicArt';

interface NearbyRecommendationsViewProps {
  recommendations: NearbyRecommendation[];
  destinationName: string;
  onAddRecommendation?: (rec: NearbyRecommendation) => void;
  addedIds?: string[];
}

export const NearbyRecommendationsView: React.FC<NearbyRecommendationsViewProps> = ({
  recommendations,
  destinationName,
  onAddRecommendation,
  addedIds = [],
}) => {
  const [selectedRecId, setSelectedRecId] = useState<string>(
    recommendations[0]?.id || ''
  );

  if (recommendations.length === 0) {
    return (
      <div className="bg-white rounded-2xl border border-stone-250 p-12 text-center shadow-soft">
        <Compass className="w-10 h-10 text-champagne-500 mx-auto mb-3" />
        <h3 className="font-serif text-xl font-bold text-ink-950">
          All Curated Regions Included
        </h3>
        <p className="text-xs text-stone-600 mt-1 max-w-md mx-auto">
          Your current itinerary already covers all primary regional hubs and iconic destinations for {destinationName}.
        </p>
      </div>
    );
  }

  const activeRec =
    recommendations.find((r) => r.id === selectedRecId) || recommendations[0];
  const isAlreadyAdded = addedIds.includes(activeRec.id);

  return (
    <div className="space-y-8 font-sans">
      {/* Banner */}
      <div className="bg-white rounded-2xl border border-stone-250 p-6 sm:p-8 shadow-soft">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center space-x-2">
              <span className="px-2.5 py-0.5 rounded-full text-xs font-bold uppercase tracking-wider bg-champagne-100 text-champagne-800 flex items-center space-x-1">
                <Sparkles className="w-3 h-3 text-champagne-600" />
                <span>INTELLIGENT GEOGRAPHICAL DISCOVERY</span>
              </span>
            </div>
            <h2 className="font-serif text-2xl sm:text-3xl font-bold text-ink-950 mt-1">
              Curated Excursions &amp; Nearby Gems
            </h2>
            <p className="text-xs sm:text-sm text-stone-600 mt-1 max-w-2xl font-sans">
              WAYFARER analyzes your current route and highlights worthwhile neighboring destinations. Add them as day excursions or expand your journey with transparent logistics.
            </p>
          </div>

          <div className="p-3.5 bg-stone-50 border border-stone-200 rounded-xl text-xs text-stone-700 flex items-center space-x-2 shrink-0">
            <Compass className="w-4 h-4 text-champagne-600" />
            <span>Zero Backtracking • Verified Distance Corridors</span>
          </div>
        </div>

        {/* Tab Pills */}
        <div className="mt-6 pt-6 border-t border-stone-200 flex flex-wrap gap-2">
          {recommendations.map((rec) => {
            const isSelected = activeRec.id === rec.id;
            const isAdded = addedIds.includes(rec.id);
            return (
              <button
                key={rec.id}
                onClick={() => setSelectedRecId(rec.id)}
                className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all flex items-center space-x-1.5 ${
                  isSelected
                    ? 'bg-ink-900 text-ivory-50 shadow-soft'
                    : 'bg-stone-100 text-stone-700 hover:bg-stone-200'
                }`}
              >
                <span>{rec.name.split('(')[0].trim()}</span>
                {isAdded && (
                  <span className="w-2 h-2 rounded-full bg-sage-500" />
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Detail Showcase Card */}
      <div className="bg-white rounded-2xl border border-stone-250 overflow-hidden shadow-soft">
        <div className="grid grid-cols-1 lg:grid-cols-12">
          {/* Photo & Key Metrics Column */}
          <div className="lg:col-span-5 relative min-h-[300px] lg:min-h-full">
            <ScenicArt
              image={activeRec.image}
              label={activeRec.name}
              className="w-full h-full object-cover absolute inset-0"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-ink-950/90 via-ink-950/30 to-transparent flex flex-col justify-end p-6 sm:p-8 text-white">
              <div className="flex items-center space-x-2 mb-2">
                <span
                  className={`px-2.5 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
                    activeRec.isSeasonallyOpen
                      ? 'bg-sage-600 text-white'
                      : 'bg-amber-600 text-white'
                  }`}
                >
                  {activeRec.isSeasonallyOpen ? 'Seasonally Optimal' : 'Seasonal Advisory'}
                </span>
                <span className="text-xs text-stone-200 capitalize">
                  {activeRec.excursionType === 'day-trip' ? 'Day Excursion' : 'Overnight Extension'}
                </span>
              </div>

              <h3 className="font-serif text-2xl sm:text-3xl font-bold text-white mb-1">
                {activeRec.name}
              </h3>
              <p className="text-xs text-stone-200 leading-relaxed font-sans">
                {activeRec.tagline}
              </p>
            </div>
          </div>

          {/* Details & Intelligence Column */}
          <div className="lg:col-span-7 p-6 sm:p-8 lg:p-10 flex flex-col justify-between space-y-6">
            <div className="space-y-6">
              {/* Why Visit — Intelligent Insight Callout */}
              <div className="p-4 rounded-xl bg-champagne-50 border border-champagne-200">
                <div className="flex items-center space-x-2 mb-1.5 text-champagne-900">
                  <Sparkles className="w-4 h-4 text-champagne-700" />
                  <span className="font-serif text-sm font-bold">
                    Why WAYFARER Recommends This:
                  </span>
                </div>
                <p className="text-xs text-stone-700 leading-relaxed">
                  {activeRec.whyVisit}
                </p>
              </div>

              {/* Highlights & Attractions */}
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-ink-900 block mb-2">
                  Regional Highlights:
                </span>
                <ul className="space-y-1.5 text-xs text-stone-600">
                  {activeRec.highlights.map((h, idx) => (
                    <li key={idx} className="flex items-start space-x-2">
                      <CheckCircle2 className="w-3.5 h-3.5 text-sage-600 shrink-0 mt-0.5" />
                      <span>{h}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Logistics & Practical Guidance Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div className="p-3 rounded-xl bg-stone-50 border border-stone-200 space-y-1">
                  <div className="flex items-center space-x-1.5 font-bold text-ink-900">
                    <Clock className="w-3.5 h-3.5 text-champagne-700" />
                    <span>Duration &amp; Drive Time</span>
                  </div>
                  <p className="text-stone-600 text-[11px]">{activeRec.journeyTimeFromBase}</p>
                  <p className="text-stone-500 text-[10px] italic">Pacing: {activeRec.recommendedDuration}</p>
                </div>

                <div className="p-3 rounded-xl bg-stone-50 border border-stone-200 space-y-1">
                  <div className="flex items-center space-x-1.5 font-bold text-ink-900">
                    <Coins className="w-3.5 h-3.5 text-champagne-700" />
                    <span>Estimated Additional Outlay</span>
                  </div>
                  <p className="text-champagne-700 font-bold text-[13px]">
                    ~₹{activeRec.estimatedAdditionalCostInr.toLocaleString('en-IN')}
                  </p>
                  <p className="text-stone-500 text-[10px] italic">Covers dedicated private cab &amp; entrance estimates</p>
                </div>
              </div>

              {/* Road & Transport Advisory */}
              <div className="p-3.5 rounded-xl bg-stone-50 border border-stone-200 text-xs text-stone-600 space-y-1">
                <div className="flex items-center space-x-1.5 font-semibold text-ink-900">
                  <Car className="w-3.5 h-3.5 text-champagne-700" />
                  <span>Transport Considerations:</span>
                </div>
                <p className="text-[11px] leading-relaxed">{activeRec.transportConsiderations}</p>
              </div>

              {/* Seasonal Access Note */}
              <div className="flex items-start space-x-2 text-[11px] text-stone-500">
                <Info className="w-3.5 h-3.5 text-champagne-600 shrink-0 mt-0.5" />
                <span><strong>Seasonal Access:</strong> {activeRec.seasonalAccessibility}</span>
              </div>
            </div>

            {/* Action Bottom Bar */}
            <div className="pt-4 border-t border-stone-200 flex flex-col sm:flex-row items-center justify-between gap-4">
              <span className="text-xs text-stone-500">
                {activeRec.extraDaysRecommended > 0
                  ? `Recommended trip extension: +${activeRec.extraDaysRecommended} Day(s)`
                  : 'Can be smoothly enjoyed as a single-day roundtrip excursion'}
              </span>

              {onAddRecommendation && (
                <button
                  onClick={() => onAddRecommendation(activeRec)}
                  disabled={isAlreadyAdded}
                  className={`w-full sm:w-auto px-6 py-2.5 rounded-full text-xs font-bold uppercase tracking-wider flex items-center justify-center space-x-2 transition-all ${
                    isAlreadyAdded
                      ? 'bg-sage-100 text-sage-800 border border-sage-300 cursor-default'
                      : 'bg-ink-900 text-ivory-50 hover:bg-ink-800 shadow-soft active:scale-95'
                  }`}
                >
                  {isAlreadyAdded ? (
                    <>
                      <CheckCircle2 className="w-4 h-4 text-sage-600" />
                      <span>Added to Your Itinerary</span>
                    </>
                  ) : (
                    <>
                      <Plus className="w-4 h-4 text-champagne-400" />
                      <span>Add Excursion to Itinerary</span>
                    </>
                  )}
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

