import React, { useState } from 'react';
import { CompassLogo } from './CompassLogo';
import { Menu, X, Compass, MapPin, Calendar, Sparkles, Bookmark } from 'lucide-react';

interface HeaderProps {
  onStartPlanning: () => void;
  onNavigateHome: () => void;
  onNavigateDestinations?: () => void;
  onNavigateSample?: () => void;
  hasActiveItinerary?: boolean;
  onViewActiveItinerary?: () => void;
  onOpenSavedTrips?: () => void;
  savedTripsCount?: number;
}

export const Header: React.FC<HeaderProps> = ({
  onStartPlanning,
  onNavigateHome,
  onNavigateDestinations,
  onNavigateSample,
  hasActiveItinerary,
  onViewActiveItinerary,
  onOpenSavedTrips,
  savedTripsCount = 0,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 bg-ivory-100/95 backdrop-blur-md border-b border-stone-250 transition-all no-print">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
        {/* Logo and Brand */}
        <button
          onClick={onNavigateHome}
          className="flex items-center space-x-3 group text-left focus:outline-none"
        >
          <CompassLogo className="w-9 h-9 text-ink-900 group-hover:rotate-45 transition-transform duration-500" />
          <div>
            <div className="flex items-center space-x-2">
              <span className="font-serif text-2xl font-bold tracking-[0.2em] text-ink-900">
                WAYFARER
              </span>
              <span className="text-[10px] uppercase font-semibold tracking-widest px-1.5 py-0.5 rounded bg-champagne-100 text-champagne-700 border border-champagne-200">
                Editorial AI
              </span>
            </div>
            <p className="text-[11px] tracking-wide text-stone-500 font-sans hidden sm:block">
              Every journey deserves a story.
            </p>
          </div>
        </button>

        {/* Desktop Nav Links */}
        <nav className="hidden md:flex items-center space-x-8 text-sm font-medium text-stone-700">
          <button
            onClick={onNavigateDestinations || onNavigateHome}
            className="hover:text-ink-900 transition-colors flex items-center space-x-1.5"
          >
            <MapPin className="w-3.5 h-3.5 text-champagne-600" />
            <span>Destinations</span>
          </button>

          <a
            href="#how-it-works"
            className="hover:text-ink-900 transition-colors"
          >
            How It Works
          </a>

          <button
            onClick={onNavigateSample}
            className="hover:text-ink-900 transition-colors flex items-center space-x-1.5"
          >
            <Calendar className="w-3.5 h-3.5 text-champagne-600" />
            <span>Sample Itinerary</span>
          </button>

          <a
            href="#why-wayfarer"
            className="hover:text-ink-900 transition-colors"
          >
            Philosophy
          </a>
        </nav>

        {/* Action Buttons */}
        <div className="hidden sm:flex items-center space-x-3">
          {onOpenSavedTrips && (
            <button
              onClick={onOpenSavedTrips}
              className="px-3.5 py-2 text-xs font-semibold rounded-full border border-stone-300 hover:bg-stone-50 text-stone-700 transition-colors flex items-center space-x-1.5"
            >
              <Bookmark className="w-3.5 h-3.5 text-champagne-600" />
              <span>Saved Trips</span>
              {savedTripsCount > 0 && (
                <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-ink-900 text-ivory-50 font-bold">
                  {savedTripsCount}
                </span>
              )}
            </button>
          )}

          {hasActiveItinerary && onViewActiveItinerary && (
            <button
              onClick={onViewActiveItinerary}
              className="px-4 py-2 text-xs font-semibold rounded-full border border-champagne-400 bg-champagne-50 text-champagne-800 hover:bg-champagne-100 transition-colors flex items-center space-x-1.5"
            >
              <Sparkles className="w-3.5 h-3.5 text-champagne-600" />
              <span>View Current Trip</span>
            </button>
          )}

          <button
            onClick={onStartPlanning}
            className="px-5 py-2.5 text-xs font-semibold tracking-wide uppercase rounded-full bg-ink-900 text-ivory-50 hover:bg-ink-800 active:scale-95 transition-all shadow-sm flex items-center space-x-2"
          >
            <Compass className="w-4 h-4 text-champagne-400" />
            <span>Start Your Journey</span>
          </button>
        </div>

        {/* Mobile Hamburger Button */}
        <div className="md:hidden flex items-center space-x-2">
          {onOpenSavedTrips && (
            <button
              onClick={onOpenSavedTrips}
              className="p-2 rounded-lg border border-stone-300 text-stone-700"
              title="Saved Trips"
            >
              <Bookmark className="w-4 h-4 text-champagne-600" />
            </button>
          )}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 rounded-lg text-stone-700 hover:text-ink-900 hover:bg-stone-200/50"
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Dropdown Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-ivory-100 border-b border-stone-250 px-4 pt-2 pb-6 space-y-3">
          <button
            onClick={() => {
              setMobileMenuOpen(false);
              (onNavigateDestinations || onNavigateHome)();
            }}
            className="w-full text-left py-2 text-sm font-medium text-stone-800 border-b border-stone-200"
          >
            Destinations
          </button>
          <a
            href="#how-it-works"
            onClick={() => setMobileMenuOpen(false)}
            className="block py-2 text-sm font-medium text-stone-800 border-b border-stone-200"
          >
            How It Works
          </a>
          <button
            onClick={() => {
              setMobileMenuOpen(false);
              onNavigateSample?.();
            }}
            className="w-full text-left py-2 text-sm font-medium text-stone-800 border-b border-stone-200"
          >
            Sample Itinerary
          </button>
          <a
            href="#why-wayfarer"
            onClick={() => setMobileMenuOpen(false)}
            className="block py-2 text-sm font-medium text-stone-800 border-b border-stone-200"
          >
            Philosophy
          </a>

          {hasActiveItinerary && onViewActiveItinerary && (
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onViewActiveItinerary();
              }}
              className="w-full py-2.5 text-xs font-semibold rounded-full bg-champagne-100 text-champagne-900 text-center block"
            >
              View Active Itinerary
            </button>
          )}

          <button
            onClick={() => {
              setMobileMenuOpen(false);
              onStartPlanning();
            }}
            className="w-full py-3 text-xs font-semibold tracking-wide uppercase rounded-full bg-ink-900 text-ivory-50 text-center block"
          >
            Start Your Journey
          </button>
        </div>
      )}
    </header>
  );
};
