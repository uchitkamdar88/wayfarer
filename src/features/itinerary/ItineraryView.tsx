import React, { useState, useMemo } from 'react';
import { GeneratedItinerary, Hotel, TripBudgetBreakdown, DayItinerary } from '../../types/travel';
import { RouteSequence } from './RouteSequence';
import { AccommodationView } from '../accommodation/AccommodationView';
import { BudgetCalculatorView } from '../budget/BudgetCalculatorView';
import { SeasonalIntelligenceView } from '../seasonal/SeasonalIntelligenceView';
import { TravelGuideView } from '../guide/TravelGuideView';
import { RouteMapView } from '../map/RouteMapView';
import { TravelCompanionDrawer } from '../assistant/TravelCompanionDrawer';
import { PrintItineraryDocument } from '../pdf/PrintItineraryDocument';
import { calculateTripBudget } from '../../lib/budget/calculator';
import { getDestinationBundle } from '../../data/registry';
import { getIntelligentRecommendations, NearbyRecommendation } from '../../lib/recommendation/nearbyPlaces';
import { NearbyRecommendationsView } from '../recommendations/NearbyRecommendationsView';
import { generateProgrammaticPdf } from '../../lib/pdf/exportPdf';
import { saveTripToLibrary } from '../../lib/storage/tripStorage';
import {
  Building,
  Coins,
  CloudSun,
  BookOpen,
  Map,
  Printer,
  Download,
  Share2,
  Sliders,
  Sparkles,
  RotateCcw,
  CheckCircle2,
  Compass,
  MapPin,
  Bookmark,
} from 'lucide-react';

interface ItineraryViewProps {
  itinerary: GeneratedItinerary;
  onUpdateItinerary: (updated: GeneratedItinerary) => void;
  onModifyPreferences: () => void;
  onShowToast: (title: string, message?: string, type?: 'success' | 'info' | 'warning') => void;
}

export const ItineraryView: React.FC<ItineraryViewProps> = ({
  itinerary,
  onUpdateItinerary,
  onModifyPreferences,
  onShowToast,
}) => {
  const [activeTab, setActiveTab] = useState<
    'itinerary' | 'discovery' | 'accommodation' | 'budget' | 'seasonal' | 'guide' | 'map'
  >('itinerary');

  const [addedRecommendationIds, setAddedRecommendationIds] = useState<string[]>([]);

  // History stack for Undo functionality
  const [history, setHistory] = useState<GeneratedItinerary[]>([]);

  const pushSnapshot = (current: GeneratedItinerary) => {
    setHistory((prev) => [...prev.slice(-4), JSON.parse(JSON.stringify(current))]);
  };

  const handleUndo = () => {
    if (history.length === 0) return;
    const last = history[history.length - 1];
    setHistory((prev) => prev.slice(0, prev.length - 1));
    onUpdateItinerary(last);
    onShowToast('Action Undone', 'Reverted itinerary to previous state.', 'info');
  };

  const handleUpdateRoute = (updatedDays: GeneratedItinerary['days']) => {
    pushSnapshot(itinerary);
    onUpdateItinerary({
      ...itinerary,
      days: updatedDays,
      version: itinerary.version + 1,
    });
    onShowToast('Route Updated', 'Your route sequence changes have been saved.', 'success');
  };

  // Select Hotel handler
  const handleSelectHotel = (hotel: Hotel) => {
    pushSnapshot(itinerary);
    const updatedBudget = calculateTripBudget(itinerary.tripPreferences, hotel, itinerary.days);
    const updated = {
      ...itinerary,
      selectedHotel: hotel,
      budgetBreakdown: updatedBudget,
      version: itinerary.version + 1,
    };
    onUpdateItinerary(updated);
    onShowToast('Hotel Updated', `${hotel.name} selected. Budget recalculated.`, 'success');
  };

  // Budget update handler
  const handleUpdateBudget = (newBudget: TripBudgetBreakdown) => {
    onUpdateItinerary({
      ...itinerary,
      budgetBreakdown: newBudget,
      version: itinerary.version + 1,
    });
  };

  // Reset Budget handler
  const handleResetBudget = () => {
    const freshBudget = calculateTripBudget(
      itinerary.tripPreferences,
      itinerary.selectedHotel,
      itinerary.days
    );
    onUpdateItinerary({
      ...itinerary,
      budgetBreakdown: freshBudget,
      version: itinerary.version + 1,
    });
    onShowToast('Budget Reset', 'Restored curated baseline estimates.', 'info');
  };

  // Trigger Print / High-Fidelity PDF Export
  const handlePrint = () => {
    window.print();
  };

  // Programmatic Vector PDF Download
  const handleDownloadPdf = () => {
    try {
      generateProgrammaticPdf(itinerary);
      onShowToast('PDF Downloaded', 'Exported vector travel blueprint to your device.', 'success');
    } catch (err) {
      console.error('PDF export error:', err);
      onShowToast('PDF Export Fallback', 'Opening print preview instead.', 'info');
      window.print();
    }
  };

  // Save to Library handler
  const handleSaveToLibrary = () => {
    const saved = saveTripToLibrary(itinerary);
    onShowToast('Trip Saved', `Preserved "${saved.name}" in your local library.`, 'success');
  };

  // Share link handler
  const handleShare = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      onShowToast('Itinerary Link Copied', 'Share this blueprint with your fellow travellers.', 'success');
    }
  };

  const { destination, tripPreferences, days, selectedHotel, budgetBreakdown, seasonalAdvice, travelGuide, regionalHubs } = itinerary;

  const destinationBundle = getDestinationBundle(itinerary.tripPreferences.destinationId);
  const destinationAttractions = destinationBundle?.attractions ?? [];

  // Compute intelligent nearby recommendations
  const visitedRegions = useMemo(() => {
    return Array.from(new Set(days.map((d) => d.baseRegion)));
  }, [days]);

  const nearbyRecommendations = useMemo(() => {
    return getIntelligentRecommendations(tripPreferences, visitedRegions);
  }, [tripPreferences, visitedRegions]);

  const handleAddRecommendation = (rec: NearbyRecommendation) => {
    pushSnapshot(itinerary);
    setAddedRecommendationIds((prev) => [...prev, rec.id]);

    const newDayNum = days.length + 1;
    const lastDay = days[days.length - 1];

    const newDay: DayItinerary = {
      dayNumber: newDayNum,
      date: new Date().toISOString().split('T')[0],
      formattedDate: `Day 0${newDayNum} (Extended)`,
      title: `${rec.name.split('(')[0].trim()} Excursion & Discovery`,
      baseRegion: rec.name.split('(')[0].trim(),
      overnightLocation: rec.name.split('(')[0].trim(),
      travelInfo: `Excursion transfer: ${lastDay?.baseRegion || 'Base'} → ${rec.name.split('(')[0].trim()} (~60 km, 2 hrs)`,
      summary: rec.whyVisit,
      dailyEstimatedCostInr: rec.estimatedAdditionalCostInr,
      morning: [
        {
          id: `rec-m-${Date.now()}`,
          slot: 'morning',
          time: 'Morning',
          locationType: 'sightseeing',
          title: `Journey & Exploration of ${rec.name.split('(')[0].trim()}`,
          description: rec.highlights[0] || `Scenic departure and exploration of ${rec.name}.`,
          durationText: '4.0 hours',
          tips: rec.transportConsiderations,
          image: rec.image,
        },
      ],
      afternoon: [
        {
          id: `rec-a-${Date.now()}`,
          slot: 'afternoon',
          time: 'Afternoon',
          locationType: 'sightseeing',
          title: rec.highlights[1] || `${rec.nearbyAttractions[0] || 'Local Sightseeing'}`,
          description: rec.highlights[1] || `Discovering primary highlights of ${rec.name}.`,
          durationText: '3.0 hours',
          tips: 'Paced comfortably.',
          image: rec.image,
        },
      ],
      evening: [
        {
          id: `rec-e-${Date.now()}`,
          slot: 'evening',
          time: 'Evening',
          locationType: 'base',
          title: 'Twilight Relaxation & Dining',
          description: `Enjoy twilight scenery, tea, and regional flavors before a restful evening.`,
          durationText: '2.0 hours',
        },
      ],
      transferBetweenRegions: {
        from: lastDay?.baseRegion || 'Base',
        to: rec.name.split('(')[0].trim(),
        distanceKm: 60,
        durationHours: 2,
        scenicHighlight: `Scenic corridor towards ${rec.name.split('(')[0].trim()}.`,
        roadNotes: rec.transportConsiderations,
      },
      seasonalNotes: rec.seasonalAccessibility,
    };

    const updatedDays = [...days, newDay];
    const updatedPrefs = {
      ...tripPreferences,
      durationDays: tripPreferences.durationDays + 1,
    };

    const updatedBudget = calculateTripBudget(updatedPrefs, selectedHotel, updatedDays);

    onUpdateItinerary({
      ...itinerary,
      days: updatedDays,
      tripPreferences: updatedPrefs,
      budgetBreakdown: updatedBudget,
      version: itinerary.version + 1,
    });

    onShowToast(
      'Excursion Added to Itinerary',
      `${rec.name.split('(')[0].trim()} added as Day 0${newDayNum}. Route and budget recalculated.`,
      'success'
    );
  };

  const tabs = [
    { id: 'itinerary', label: 'Route Sequence', icon: MapPin },
    { id: 'discovery', label: 'Nearby Gems & Excursions', icon: Sparkles },
    { id: 'accommodation', label: 'Accommodations', icon: Building },
    { id: 'budget', label: 'Budget Calculator', icon: Coins },
    { id: 'seasonal', label: 'Seasonal Intelligence', icon: CloudSun },
    { id: 'guide', label: 'Practical Guide', icon: BookOpen },
    { id: 'map', label: 'Route Map', icon: Map },
  ] as const;

  return (
    <div className="min-h-screen bg-ivory-100 font-sans pb-24">
      {/* Hidden high-fidelity multi-page document that only prints when user presses Print */}
      <PrintItineraryDocument itinerary={itinerary} />

      {/* Screen Interactive View */}
      <div className="no-print">
        {/* Top Hero Banner */}
        <section className="relative bg-ink-950 text-white pt-10 pb-16 px-4 sm:px-6 lg:px-8 border-b border-ink-800">
          <div className="max-w-7xl mx-auto">
            <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6">
              <div>
                <div className="flex items-center space-x-2 mb-2">
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-champagne-500 text-ink-950">
                    FLEXIBLE ROUTE
                  </span>
                  <span className="text-xs text-stone-300">
                    {destination.name} • {destination.state}
                  </span>
                  <span className="text-stone-500">•</span>
                  <span className="text-xs text-stone-400">
                    v{itinerary.version}.0
                  </span>
                </div>

                <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-white">
                  {destination.name} Route Outline
                </h1>
                <p className="text-sm text-stone-300 mt-2 max-w-2xl font-sans leading-relaxed">
                  Suggested stops in geographic order for {tripPreferences.travellers.adults + tripPreferences.travellers.children} travellers. Travel window: {days[0]?.formattedDate} – {days[days.length - 1]?.formattedDate}. Adjust the pace and depth of each stop to suit your trip.
                </p>
              </div>

              {/* Action Toolbar */}
              <div className="flex flex-wrap items-center gap-3">
                {history.length > 0 && (
                  <button
                    onClick={handleUndo}
                    className="px-4 py-2.5 rounded-full bg-ink-800 hover:bg-ink-700 text-ivory-100 text-xs font-semibold flex items-center space-x-1.5 transition-all border border-ink-700"
                    title="Undo previous modification"
                  >
                    <RotateCcw className="w-3.5 h-3.5 text-champagne-400" />
                    <span>Undo Edit</span>
                  </button>
                )}

                <button
                  onClick={handleSaveToLibrary}
                  className="px-4 py-2.5 rounded-full bg-ink-800 hover:bg-ink-700 text-ivory-100 text-xs font-semibold flex items-center space-x-1.5 transition-all border border-ink-700"
                  title="Save this trip to your device library"
                >
                  <Bookmark className="w-3.5 h-3.5 text-champagne-400" />
                  <span>Save Trip</span>
                </button>

                <button
                  onClick={handleShare}
                  className="px-4 py-2.5 rounded-full bg-ink-800 hover:bg-ink-700 text-ivory-100 text-xs font-semibold flex items-center space-x-1.5 transition-all border border-ink-700"
                >
                  <Share2 className="w-3.5 h-3.5 text-champagne-400" />
                  <span>Share</span>
                </button>

                <button
                  onClick={onModifyPreferences}
                  className="px-4 py-2.5 rounded-full bg-ink-800 hover:bg-ink-700 text-ivory-100 text-xs font-semibold flex items-center space-x-1.5 transition-all border border-ink-700"
                >
                  <Sliders className="w-3.5 h-3.5 text-champagne-400" />
                  <span>Modify Wizard</span>
                </button>

                <button
                  onClick={handleDownloadPdf}
                  className="px-5 py-2.5 rounded-full bg-ink-800 hover:bg-ink-700 text-champagne-300 border border-champagne-500/50 text-xs font-bold uppercase tracking-wider flex items-center space-x-2 transition-all active:scale-95"
                  title="Download vector PDF file"
                >
                  <Download className="w-4 h-4 text-champagne-400" />
                  <span>Download PDF</span>
                </button>

                <button
                  onClick={handlePrint}
                  className="px-5 py-2.5 rounded-full bg-champagne-500 hover:bg-champagne-600 text-ink-950 text-xs font-bold uppercase tracking-wider flex items-center space-x-2 transition-all shadow-elevated active:scale-95"
                  title="Browser print or Save to PDF"
                >
                  <Printer className="w-4 h-4" />
                  <span>Print Itinerary</span>
                </button>
              </div>
            </div>

            {/* Quick Stats Bar */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-8 pt-6 border-t border-ink-800 text-xs">
              <div>
                <span className="text-stone-400 block text-[10px] uppercase font-semibold tracking-wider">Estimated Group Budget</span>
                <span className="font-serif text-lg font-bold text-champagne-400">₹{budgetBreakdown.totalEstimate.toLocaleString('en-IN')}</span>
              </div>
              <div>
                <span className="text-stone-400 block text-[10px] uppercase font-semibold tracking-wider">Per Person Outlay</span>
                <span className="font-serif text-lg font-bold text-ivory-100">~₹{budgetBreakdown.perPersonEstimate.toLocaleString('en-IN')}</span>
              </div>
              <div>
                <span className="text-stone-400 block text-[10px] uppercase font-semibold tracking-wider">Selected Hotel</span>
                <span className="font-serif text-lg font-bold text-ivory-100 truncate block">{selectedHotel?.name}</span>
              </div>
              <div>
                <span className="text-stone-400 block text-[10px] uppercase font-semibold tracking-wider">Climate Period</span>
                <span className="font-serif text-lg font-bold text-sage-300">{seasonalAdvice.seasonName}</span>
              </div>
            </div>
          </div>
        </section>

        {/* Tab Navigation Navigation Bar */}
        <div className="sticky top-20 z-30 bg-white/95 backdrop-blur-md border-b border-stone-250 shadow-soft">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex space-x-6 overflow-x-auto py-3 scrollbar-none">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                const isActive = activeTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    onClick={() => {
                      setActiveTab(tab.id);
                      window.scrollTo({ top: 320, behavior: 'smooth' });
                    }}
                    className={`flex items-center space-x-2 py-1.5 px-3 rounded-full text-xs font-semibold whitespace-nowrap transition-all ${
                      isActive
                        ? 'bg-ink-900 text-ivory-50 shadow-soft'
                        : 'text-stone-600 hover:text-ink-900 hover:bg-stone-100'
                    }`}
                  >
                    <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-champagne-400' : 'text-stone-500'}`} />
                    <span>{tab.label}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Tab Content Body */}
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          {activeTab === 'itinerary' && (
            <RouteSequence
              days={days}
              attractions={destinationAttractions}
              onUpdateDays={handleUpdateRoute}
            />
          )}

          {activeTab === 'discovery' && (
            <NearbyRecommendationsView
              recommendations={nearbyRecommendations}
              destinationName={destination.name}
              onAddRecommendation={handleAddRecommendation}
              addedIds={addedRecommendationIds}
            />
          )}

          {activeTab === 'accommodation' && (
            <AccommodationView
              selectedHotel={selectedHotel}
              recommendedHotels={itinerary.recommendedHotels}
              nightsCount={Math.max(1, days.length - 1)}
              roomsCount={tripPreferences.accommodation.roomsCount}
              roomQuality={tripPreferences.accommodation.roomQuality}
              onSelectHotel={handleSelectHotel}
              destinationName={destination.name}
              targetNightlyBudget={tripPreferences.accommodation.maxNightlyBudget}
            />
          )}

          {activeTab === 'budget' && (
            <BudgetCalculatorView
              budget={budgetBreakdown}
              preferences={tripPreferences}
              selectedHotel={selectedHotel}
              onUpdateBudget={handleUpdateBudget}
              onResetBudget={handleResetBudget}
            />
          )}

          {activeTab === 'seasonal' && (
            <SeasonalIntelligenceView
              currentSeason={seasonalAdvice}
              departureDate={tripPreferences.departureDate}
              allSeasons={destinationBundle?.seasonal}
              destinationName={destination.name}
            />
          )}

          {activeTab === 'guide' && travelGuide && (
            <TravelGuideView guide={travelGuide} destinationName={destination.name} />
          )}

          {activeTab === 'guide' && !travelGuide && (
            <div className="text-center py-16 text-stone-400 text-sm italic">
              Travel guide data is not available for this destination yet.
            </div>
          )}

          {activeTab === 'map' && (
            <RouteMapView
              days={days}
              destinationName={destination.name}
              regionalHubs={itinerary.regionalHubs}
            />
          )}
        </main>
      </div>

      {/* Floating WAYFARER Travel Companion Drawer */}
      <TravelCompanionDrawer
        itinerary={itinerary}
        onUpdateItinerary={(updated, actionSummary) => {
          pushSnapshot(itinerary);
          onUpdateItinerary(updated);
          if (actionSummary) {
            onShowToast('Companion Modified Itinerary', actionSummary, 'success');
          }
        }}
        onUndoLastChange={handleUndo}
        canUndo={history.length > 0}
      />
    </div>
  );
};
