import React, { useState } from 'react';
import { SeasonalIntelligence } from '../../types/travel';
import {
  CloudSun,
  Snowflake,
  Sun,
  Leaf,
  AlertTriangle,
  Compass,
  CheckCircle2,
  Calendar,
  Thermometer,
} from 'lucide-react';

interface SeasonalIntelligenceViewProps {
  currentSeason: SeasonalIntelligence;
  departureDate: string;
  allSeasons?: Record<string, SeasonalIntelligence>;
  destinationName?: string;
}

export const SeasonalIntelligenceView: React.FC<SeasonalIntelligenceViewProps> = ({
  currentSeason,
  departureDate,
  allSeasons,
  destinationName = 'This Destination',
}) => {
  // Determine the initial active tab from the currentSeason key or fallback to first available
  const seasons = allSeasons && Object.keys(allSeasons).length > 0 ? allSeasons : null;
  const seasonKeys = seasons ? Object.keys(seasons) : [];
  const defaultKey = seasonKeys.length > 0 ? seasonKeys[0] : 'current';

  const [activeSeasonKey, setActiveSeasonKey] = useState<string>(defaultKey);

  // Icon mapping for common season names
  const getSeasonIcon = (key: string) => {
    const k = key.toLowerCase();
    if (k.includes('winter') || k.includes('snow')) return Snowflake;
    if (k.includes('summer') || k.includes('sun')) return Sun;
    if (k.includes('monsoon') || k.includes('rain')) return CloudSun;
    if (k.includes('autumn') || k.includes('fall') || k.includes('spring') || k.includes('post')) return Leaf;
    return Compass;
  };

  const activeSeasonData: SeasonalIntelligence =
    seasons && seasons[activeSeasonKey] ? seasons[activeSeasonKey] : currentSeason;

  return (
    <div className="space-y-8 font-sans">
      {/* Current Travel Date Match Banner */}
      <div className="bg-white rounded-2xl border border-stone-250 p-6 sm:p-8 shadow-soft">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
          <div>
            <div className="flex items-center space-x-2">
              <span className="px-2.5 py-0.5 rounded-full text-xs font-bold uppercase tracking-wider bg-sage-100 text-sage-800">
                ACTIVE TRAVEL FORECAST
              </span>
              <span className="text-xs text-stone-500 font-medium">
                Departure: {departureDate}
              </span>
            </div>
            <h2 className="font-serif text-2xl sm:text-3xl font-bold text-ink-950 mt-1">
              Seasonal Travel Intelligence — {destinationName}
            </h2>
            <p className="text-xs sm:text-sm text-stone-600 mt-1 max-w-2xl">
              {destinationName} has distinct seasonal characteristics. Your selected trip dates fall into{' '}
              <strong>{currentSeason.seasonName}</strong>.
            </p>
          </div>

          <div className="p-4 bg-champagne-50 border border-champagne-200 rounded-xl text-xs text-champagne-950 flex items-center space-x-3">
            <Thermometer className="w-5 h-5 text-champagne-700 shrink-0" />
            <div>
              <span className="font-bold">Temperature Expectation:</span>
              <p className="font-serif text-base font-bold text-champagne-950">
                {currentSeason.temperatureRangeCelsius.min}°C to {currentSeason.temperatureRangeCelsius.max}°C
              </p>
            </div>
          </div>
        </div>

        {/* Season Selector Tabs — built dynamically from allSeasons */}
        {seasonKeys.length > 0 && (
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-4 border-t border-stone-200">
            {seasonKeys.map((key) => {
              const s = seasons![key];
              const Icon = getSeasonIcon(key);
              const isSelected = activeSeasonKey === key;
              return (
                <button
                  key={key}
                  onClick={() => setActiveSeasonKey(key)}
                  className={`p-4 rounded-xl border text-left transition-all ${
                    isSelected
                      ? 'border-champagne-500 bg-champagne-50 shadow-soft ring-1 ring-champagne-400'
                      : 'border-stone-200 hover:bg-stone-50'
                  }`}
                >
                  <div className="flex items-center space-x-2 mb-1">
                    <Icon className={`w-4 h-4 ${isSelected ? 'text-champagne-700' : 'text-stone-500'}`} />
                    <span className="font-serif text-sm font-bold text-ink-900">{s.seasonName}</span>
                  </div>
                  <p className="text-[11px] text-stone-500 line-clamp-1">{s.tagline}</p>
                </button>
              );
            })}
          </div>
        )}
      </div>

      {/* Selected Season Detailed Dashboard */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
        {/* Left Column: Highlights & Packing */}
        <div className="md:col-span-7 space-y-6">
          <div className="bg-white rounded-2xl border border-stone-250 p-6 sm:p-8 shadow-soft space-y-4">
            <div className="flex items-center justify-between border-b pb-3">
              <div>
                <span className="text-[10px] uppercase font-bold tracking-wider text-champagne-600">
                  SEASON OVERVIEW
                </span>
                <h3 className="font-serif text-xl font-bold text-ink-950">
                  {activeSeasonData.seasonName}
                </h3>
              </div>
              <span className="px-3 py-1 rounded-full text-xs font-bold bg-sage-100 text-sage-800">
                Suitability: {activeSeasonData.suitabilityScore}/10
              </span>
            </div>

            <p className="text-xs text-stone-700 leading-relaxed italic">
              "{activeSeasonData.tagline}"
            </p>

            <div className="space-y-2 pt-2">
              <span className="text-xs font-bold uppercase tracking-wider text-ink-900 block">
                Atmospheric Highlights:
              </span>
              <ul className="space-y-2 text-xs text-stone-600">
                {activeSeasonData.weatherHighlights.map((wh, i) => (
                  <li key={i} className="flex items-start space-x-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-sage-600 shrink-0 mt-0.5" />
                    <span>{wh}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Packing Advice */}
            <div className="pt-4 border-t border-stone-200">
              <span className="text-xs font-bold uppercase tracking-wider text-ink-900 block mb-2">
                Curated Packing Essentials for this Period:
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-stone-700">
                {activeSeasonData.packListRecommendations.map((pl, i) => (
                  <div key={i} className="p-2.5 rounded-lg bg-stone-50 border border-stone-200 flex items-start space-x-1.5">
                    <span className="text-champagne-600 font-bold">•</span>
                    <span>{pl}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Road Advisories & Monthly Breakdown */}
        <div className="md:col-span-5 space-y-6">
          {/* Road/Travel Accessibility Box */}
          <div className="bg-white rounded-2xl border border-stone-250 p-6 shadow-soft space-y-4">
            <div className="flex items-center space-x-2 border-b pb-3 text-amber-800">
              <AlertTriangle className="w-4 h-4 text-amber-600" />
              <h4 className="font-serif text-base font-bold text-ink-900">
                Travel Advisories &amp; Route Conditions
              </h4>
            </div>

            <ul className="space-y-2.5 text-xs text-stone-600">
              {activeSeasonData.roadAdvisories.map((ra, i) => (
                <li key={i} className="flex items-start space-x-2">
                  <span className="text-amber-600 font-bold">•</span>
                  <span>{ra}</span>
                </li>
              ))}
            </ul>

            <div className="p-3 rounded-xl bg-amber-50 border border-amber-200 text-[11px] text-amber-900 leading-relaxed">
              <strong>Official Advisory:</strong> Weather in this region can shift rapidly. Always verify local
              conditions and official travel updates before embarking on routes.
            </div>
          </div>

          {/* Monthly Breakdown Table */}
          <div className="bg-white rounded-2xl border border-stone-250 p-6 shadow-soft space-y-3">
            <h4 className="font-serif text-base font-bold text-ink-900 mb-2">
              Month-Wise Climate Breakdown
            </h4>

            <div className="space-y-3">
              {activeSeasonData.monthlyBreakdown.map((m) => (
                <div key={m.month} className="p-3 rounded-xl border border-stone-200 bg-stone-50/70 text-xs">
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-bold text-ink-950">{m.month}</span>
                    <span className="text-stone-500">
                      {m.avgLowC}°C (Low) / {m.avgHighC}°C (High)
                    </span>
                  </div>
                  <div className="flex items-center space-x-2 text-[11px] text-stone-500 mb-1">
                    <span>Crowds: <strong className="text-ink-900">{m.crowdLevel}</strong></span>
                    <span>•</span>
                    <span>
                      {m.snowExpected !== undefined
                        ? `Snow: ${m.snowExpected ? 'Yes' : 'None'}`
                        : m.roadCondition
                          ? `Roads: ${m.roadCondition}`
                          : ''}
                    </span>
                  </div>
                  <p className="text-[11px] text-stone-600 italic">"{m.verdict}"</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
