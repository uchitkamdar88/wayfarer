import React from 'react';
import { CompassLogo } from './CompassLogo';
import { ShieldCheck, Compass, RotateCcw, Heart } from 'lucide-react';

interface FooterProps {
  onStartPlanning: () => void;
  onClearData?: () => void;
}

export const Footer: React.FC<FooterProps> = ({ onStartPlanning, onClearData }) => {
  return (
    <footer className="bg-ink-950 text-ivory-200 border-t border-ink-800 pt-16 pb-12 no-print">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 pb-12 border-b border-ink-800">
          {/* Brand Col */}
          <div className="md:col-span-2 space-y-4">
            <div className="flex items-center space-x-3">
              <CompassLogo className="w-8 h-8 text-champagne-400" />
              <span className="font-serif text-2xl font-bold tracking-[0.25em] text-ivory-50">
                WAYFARER
              </span>
            </div>
            <p className="font-serif italic text-champagne-300 text-base">
              Every journey deserves a story.
            </p>
            <p className="text-xs text-stone-400 max-w-md leading-relaxed">
              Discover places. Plan thoughtfully. Travel your way. WAYFARER bridges local regional knowledge, seasonal intelligence, and transparent budgeting into flexible, destination-ordered route outlines.
            </p>
            <div className="pt-2 flex items-center space-x-2 text-xs text-stone-400">
              <ShieldCheck className="w-4 h-4 text-sage-400" />
              <span>100% Private • In-Memory Processing • No Secret Keys • Zero Ads</span>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-3">
            <h4 className="text-xs font-semibold uppercase tracking-widest text-champagne-400">
              Destination Atlas
            </h4>
            <ul className="space-y-2 text-xs text-stone-400">
              <li>Curated regional discovery</li>
              <li>Transparent itinerary planning</li>
              <li>Budget-based day planning</li>
              <li>Season-aware travel guidance</li>
              <li>Destination-first trip logic</li>
            </ul>
          </div>

          {/* Independent Transparency */}
          <div className="space-y-3">
            <h4 className="text-xs font-semibold uppercase tracking-widest text-champagne-400">
              Trip Integrity
            </h4>
            <p className="text-xs text-stone-400 leading-relaxed">
              We operate strictly as an unbiased recommendation service. No affiliate kickbacks, no sponsored hotel placements, and zero commercial flight commissions.
            </p>
            {onClearData && (
              <button
                onClick={onClearData}
                className="mt-2 text-xs text-stone-400 hover:text-champagne-300 transition-colors flex items-center space-x-1.5"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Reset Local Trip Session</span>
              </button>
            )}
          </div>
        </div>

        {/* Disclaimer & Bottom Bar */}
        <div className="pt-8 text-xs text-stone-500 space-y-3">
          <p className="leading-relaxed text-[11px]">
            <strong>Important Legal Notice:</strong> WAYFARER is an independent travel planning technology application. It is NOT an online travel agency (OTA), booking service, or commercial tour operator. Hotel prices, flight fares, gondola tickets, and road accessibility represent curated estimates and benchmarks. Travellers must verify and complete bookings directly on official government or property websites.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-between pt-4 border-t border-ink-900 text-[11px]">
            <p>© {new Date().getFullYear()} WAYFARER Travel Technology. Built with precision for discerning explorers.</p>
            <p className="flex items-center space-x-1 mt-2 sm:mt-0 text-stone-400">
              <span>Crafted for thoughtful journeys</span>
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};
