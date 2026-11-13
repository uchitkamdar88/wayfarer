import React, { useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import { TripPreferences, GeneratedItinerary } from './types/travel';
import { generateItinerary } from './lib/recommendation/engine';
import { getDestinationBundle, getAllDestinations } from './data/registry';
import { Header } from './components/common/Header';
import { Footer } from './components/common/Footer';
import { NotificationToast, ToastMessage } from './components/common/NotificationToast';
import { LandingHero } from './features/landing/LandingHero';
import { HowItWorks } from './features/landing/HowItWorks';
import { FeaturedDestinations } from './features/landing/FeaturedDestinations';
import { SampleItineraryPreview } from './features/landing/SampleItineraryPreview';
import { WhyWayfarer } from './features/landing/WhyWayfarer';
import { TripPlannerWizard } from './features/planner/TripPlannerWizard';
import { GenerationLoadingScreen } from './features/generation/GenerationLoadingScreen';
import { ItineraryView } from './features/itinerary/ItineraryView';
import {
  persistActiveTrip,
  restoreActiveTrip,
  clearActiveTripStorage,
  getSavedTripsLibrary,
} from './lib/storage/tripStorage';
import { SavedTripsModal } from './features/trips/SavedTripsModal';

export const App: React.FC = () => {
  type ViewState = 'landing' | 'planner' | 'generating' | 'itinerary';

  const [currentView, setCurrentView] = useState<ViewState>('landing');
  // No default destination — user must actively choose one
  const [selectedDestinationId, setSelectedDestinationId] = useState<string>('');
  const [generatingDestinationName, setGeneratingDestinationName] = useState<string>('Your Destination');
  const [activePreferences, setActivePreferences] = useState<TripPreferences | null>(null);
  const [activeItinerary, setActiveItinerary] = useState<GeneratedItinerary | null>(null);
  const [toasts, setToasts] = useState<ToastMessage[]>([]);
  const [isSavedTripsOpen, setIsSavedTripsOpen] = useState(false);
  const [savedTripsCount, setSavedTripsCount] = useState(0);

  // Restore session from localStorage on initial page load
  useEffect(() => {
    const restored = restoreActiveTrip();
    if (restored.itinerary && restored.preferences) {
      setActiveItinerary(restored.itinerary);
      setActivePreferences(restored.preferences);
      setCurrentView('itinerary');
      showToast(
        'Session Restored',
        `Resumed your active ${restored.itinerary.destination.name} itinerary from local storage.`,
        'info'
      );
    }
    setSavedTripsCount(getSavedTripsLibrary().length);
  }, []);

  // Autosave active trip state
  useEffect(() => {
    if (activeItinerary && activePreferences) {
      persistActiveTrip(activeItinerary, activePreferences);
    }
  }, [activeItinerary, activePreferences]);

  // Toast Helper
  const showToast = (
    title: string,
    message?: string,
    type: 'success' | 'info' | 'warning' = 'info'
  ) => {
    const id = `toast-${Date.now()}-${Math.random()}`;
    setToasts((prev) => [...prev, { id, title, message, type }]);

    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4500);
  };

  const dismissToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  // Launch Wizard — optional destId pre-selects a destination
  const handleStartPlanning = (destId: string = '') => {
    setSelectedDestinationId(destId);
    setCurrentView('planner');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // When Wizard submits
  const handleWizardSubmit = (preferences: TripPreferences) => {
    const bundle = getDestinationBundle(preferences.destinationId);
    setGeneratingDestinationName(bundle?.destination.name ?? 'Your Destination');
    setActivePreferences(preferences);
    setCurrentView('generating');
  };

  // When Generating Animation Finishes
  const handleGenerationComplete = () => {
    if (!activePreferences) return;

    const result = generateItinerary(activePreferences);

    const generated: GeneratedItinerary = {
      id: `trip-${Date.now()}`,
      tripPreferences: activePreferences,
      destination: result.destination,
      days: result.days,
      selectedHotel: result.selectedHotel,
      recommendedHotels: result.recommendedHotels,
      budgetBreakdown: result.budgetBreakdown,
      seasonalAdvice: result.seasonalAdvice,
      travelGuide: result.travelGuide,
      regionalHubs: result.regionalHubs,
      regionalTransfers: result.regionalTransfers,
      createdAt: new Date().toISOString(),
      version: 1,
    };

    setActiveItinerary(generated);
    setCurrentView('itinerary');
    persistActiveTrip(generated, activePreferences);
    window.scrollTo({ top: 0, behavior: 'smooth' });

    // Tasteful celebration burst
    try {
      confetti({
        particleCount: 50,
        spread: 60,
        origin: { y: 0.7 },
        colors: ['#C59A4E', '#4E6B5B', '#0B1320', '#EEDDBB'],
      });
    } catch {
      // Ignored if canvas-confetti is not loaded
    }

    showToast(
      'Itinerary Created Successfully',
      `Curated a ${generated.days.length}-day journey across ${result.destination.name}.`,
      'success'
    );
  };

  // Select Trip from Saved Trips Library
  const handleSelectSavedTrip = (itinerary: GeneratedItinerary) => {
    setActiveItinerary(itinerary);
    setActivePreferences(itinerary.tripPreferences);
    setCurrentView('itinerary');
    persistActiveTrip(itinerary, itinerary.tripPreferences);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Reset / Clear Data
  const handleClearData = () => {
    if (window.confirm('Reset all trip plans and clear active session memory?')) {
      setActiveItinerary(null);
      setActivePreferences(null);
      setSelectedDestinationId('');
      clearActiveTripStorage();
      setCurrentView('landing');
      showToast('Session Cleared', 'Reset to initial blank state.', 'info');
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-ivory-100 selection:bg-champagne-200 selection:text-ink-950 font-sans">
      {/* Global Header */}
      <Header
        onStartPlanning={() => handleStartPlanning()}
        onNavigateHome={() => {
          setCurrentView('landing');
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        onNavigateDestinations={() => {
          if (currentView !== 'landing') setCurrentView('landing');
          setTimeout(() => {
            const el = document.getElementById('destinations');
            el?.scrollIntoView({ behavior: 'smooth' });
          }, 100);
        }}
        onNavigateSample={() => {
          if (currentView !== 'landing') setCurrentView('landing');
          setTimeout(() => {
            const el = document.getElementById('sample-itinerary');
            el?.scrollIntoView({ behavior: 'smooth' });
          }, 100);
        }}
        hasActiveItinerary={!!activeItinerary}
        onViewActiveItinerary={() => {
          if (activeItinerary) {
            setCurrentView('itinerary');
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }
        }}
        onOpenSavedTrips={() => {
          setSavedTripsCount(getSavedTripsLibrary().length);
          setIsSavedTripsOpen(true);
        }}
        savedTripsCount={savedTripsCount}
      />

      {/* Main View Router */}
      <div className="flex-1">
        {currentView === 'landing' && (
          <main>
            <LandingHero
              onStartPlanning={() => handleStartPlanning()}
              onExploreDestinations={() => {
                const el = document.getElementById('destinations');
                el?.scrollIntoView({ behavior: 'smooth' });
              }}
            />
            <HowItWorks />
            <FeaturedDestinations
              onSelectDestination={(destId) => handleStartPlanning(destId)}
            />
            <SampleItineraryPreview
              onCustomizeSample={(destId) => handleStartPlanning(destId || '')}
            />
            <WhyWayfarer />
          </main>
        )}

        {currentView === 'planner' && (
          <TripPlannerWizard
            initialDestinationId={selectedDestinationId}
            onGenerateItinerary={handleWizardSubmit}
            onCancel={() => {
              setCurrentView('landing');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
          />
        )}

        {currentView === 'generating' && (
          <GenerationLoadingScreen
            onComplete={handleGenerationComplete}
            destinationName={generatingDestinationName}
          />
        )}

        {currentView === 'itinerary' && activeItinerary && (
          <ItineraryView
            itinerary={activeItinerary}
            onUpdateItinerary={(updated) => {
              setActiveItinerary(updated);
              if (activePreferences) {
                persistActiveTrip(updated, activePreferences);
              }
            }}
            onModifyPreferences={() => setCurrentView('planner')}
            onShowToast={showToast}
          />
        )}
      </div>

      {/* Global Footer (Visible on landing and itinerary) */}
      {currentView !== 'generating' && currentView !== 'planner' && (
        <Footer
          onStartPlanning={() => handleStartPlanning()}
          onClearData={activeItinerary ? handleClearData : undefined}
        />
      )}

      {/* Saved Trips Modal Drawer */}
      <SavedTripsModal
        isOpen={isSavedTripsOpen}
        onClose={() => {
          setIsSavedTripsOpen(false);
          setSavedTripsCount(getSavedTripsLibrary().length);
        }}
        activeItinerary={activeItinerary}
        onSelectTrip={handleSelectSavedTrip}
        onShowToast={showToast}
      />

      {/* Floating Notifications */}
      <NotificationToast toasts={toasts} onDismiss={dismissToast} />
    </div>
  );
};

export default App;
