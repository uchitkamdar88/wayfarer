import React from 'react';
import { Compass, ArrowRight, ShieldCheck, Sparkles, MapPin, CheckCircle2 } from 'lucide-react';

interface LandingHeroProps {
  onStartPlanning: () => void;
  onExploreDestinations: () => void;
}

export const LandingHero: React.FC<LandingHeroProps> = ({
  onStartPlanning,
  onExploreDestinations,
}) => {
  return (
    <section className="relative overflow-hidden pt-8 pb-20 lg:pt-16 lg:pb-32">
      {/* Background Subtle Gradient Accents */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-96 bg-gradient-to-b from-champagne-100/40 via-transparent to-transparent pointer-events-none -z-10" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          {/* Text Column */}
          <div className="lg:col-span-7 space-y-6 text-left">
            <div className="inline-flex items-center space-x-2 px-3 py-1.5 rounded-full bg-champagne-100 border border-champagne-300/80 text-champagne-900 text-xs font-semibold tracking-wide">
              <Sparkles className="w-3.5 h-3.5 text-champagne-600" />
              <span>EDITORIAL TRAVEL ARCHITECTURE • ZERO COMMISSION BIAS</span>
            </div>

            <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl font-bold text-ink-950 tracking-tight leading-[1.12]">
              Your journey, <br />
              <span className="italic font-normal text-champagne-600">thoughtfully planned.</span>
            </h1>

            <p className="text-base sm:text-lg text-stone-700 leading-relaxed max-w-2xl font-sans">
              Discover places without the endless research rabbit-holes. WAYFARER creates flexible, destination-aware route outlines that order places around geography, seasonal conditions, dining preferences, and transparent budget estimates.
            </p>

            {/* CTAs */}
            <div className="pt-2 flex flex-col sm:flex-row items-stretch sm:items-center space-y-3 sm:space-y-0 sm:space-x-4">
              <button
                onClick={onStartPlanning}
                className="px-7 py-4 rounded-full bg-ink-900 text-ivory-50 hover:bg-ink-800 text-sm font-semibold tracking-wide uppercase transition-all shadow-elevated hover:shadow-float active:scale-98 flex items-center justify-center space-x-2 group"
              >
                <Compass className="w-4 h-4 text-champagne-400 group-hover:rotate-45 transition-transform duration-300" />
                <span>Start Your Journey</span>
                <ArrowRight className="w-4 h-4 text-champagne-400 group-hover:translate-x-1 transition-transform" />
              </button>

              <button
                onClick={onExploreDestinations}
                className="px-6 py-4 rounded-full bg-white border border-stone-300 text-ink-900 hover:bg-stone-50 text-sm font-semibold tracking-wide transition-all shadow-soft flex items-center justify-center space-x-2"
              >
                <MapPin className="w-4 h-4 text-champagne-600" />
                <span>Explore Destinations</span>
              </button>
            </div>

            {/* Trust points */}
            <div className="pt-6 border-t border-stone-250 grid grid-cols-2 sm:grid-cols-3 gap-4 text-xs text-stone-600">
              <div className="flex items-center space-x-2">
                <CheckCircle2 className="w-4 h-4 text-sage-600 shrink-0" />
                <span>Geographical Route Clustering</span>
              </div>
              <div className="flex items-center space-x-2">
                <CheckCircle2 className="w-4 h-4 text-sage-600 shrink-0" />
                <span>Pure Vegetarian & Jain Guides</span>
              </div>
              <div className="flex items-center space-x-2">
                <CheckCircle2 className="w-4 h-4 text-sage-600 shrink-0" />
                <span>High-Fidelity Multi-Page PDF</span>
              </div>
            </div>
          </div>

          {/* Editorial Visual Column */}
          <div className="lg:col-span-5 relative">
            <div className="relative mx-auto max-w-md lg:max-w-none">
              {/* Main Photo Card */}
              <div className="relative rounded-2xl overflow-hidden shadow-float border-2 border-stone-200/90 bg-white">
                <img
                  src="https://images.unsplash.com/photo-1595815771614-ade9d652a65d?auto=format&fit=crop&w=1200&q=80"
                  alt="Travel destination discovery"
                  className="w-full h-[440px] object-cover"
                  onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-ink-950/85 via-ink-950/25 to-transparent flex flex-col justify-end p-6 text-white">
                  <div className="flex items-center space-x-2 mb-2">
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-champagne-500 text-ink-950">
                      DESTINATION DISCOVERY
                    </span>
                    <span className="text-xs text-stone-200">Choose your place</span>
                  </div>
                  <h3 className="font-serif text-2xl font-bold text-white mb-1">
                    Discover the right destination for your trip
                  </h3>
                  <p className="text-xs text-stone-300 leading-snug">
                    Build a route around your chosen destination, travel style, and seasonal priorities.
                  </p>
                </div>
              </div>

              {/* Floating Highlight Badge */}
              <div className="absolute -bottom-6 -left-4 sm:-left-8 bg-ivory-50/95 backdrop-blur-md border border-stone-300 p-4 rounded-xl shadow-elevated max-w-xs text-left">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 rounded-full bg-sage-100 flex items-center justify-center text-sage-700 shrink-0">
                    <ShieldCheck className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-ink-900">Zero Commercial Bias</h4>
                    <p className="text-[11px] text-stone-600 leading-tight">
                      No sponsor payouts. Purely objective travel planning.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
