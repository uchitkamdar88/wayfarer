import React, { useState } from 'react';
import { DESTINATIONS } from '../../data/destinations';
import { Destination } from '../../types/travel';
import { Compass, CheckCircle2, AlertCircle, ArrowRight } from 'lucide-react';
import { ScenicArt } from '../../components/common/ScenicArt';

interface FeaturedDestinationsProps {
  onSelectDestination: (destId: string) => void;
}

export const FeaturedDestinations: React.FC<FeaturedDestinationsProps> = ({
  onSelectDestination,
}) => {
  const [imgErrors, setImgErrors] = useState<Record<string, boolean>>({});
  const handleImgError = (id: string) => setImgErrors(prev => ({ ...prev, [id]: true }));
  return (
    <section id="destinations" className="py-24 bg-ivory-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12">
          <div>
            <span className="text-xs font-bold uppercase tracking-widest text-champagne-600">
              EXPLORE OUR ATLAS
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl font-bold text-ink-950 mt-2">
              Curated Destinations
            </h2>
            <p className="text-sm text-stone-600 mt-2 font-sans max-w-xl">
              Choose the destination that matches your travel goals, then build a personalized, destination-aware itinerary.
            </p>
          </div>
          <div className="mt-4 md:mt-0 flex items-center space-x-2 text-xs font-semibold text-sage-800 bg-sage-50 border border-sage-200 px-3 py-1.5 rounded-full">
            <CheckCircle2 className="w-4 h-4 text-sage-600" />
            <span>Destination-first planning</span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {DESTINATIONS.map((dest: Destination) => (
            <div
              key={dest.id}
              className={`rounded-2xl overflow-hidden border transition-all duration-300 flex flex-col justify-between bg-white ${
                dest.isCurated
                  ? 'border-champagne-400 shadow-elevated ring-1 ring-champagne-300'
                  : 'border-stone-250 hover:shadow-elevated'
              }`}
            >
              <div>
                {/* Image Box */}
                <div className="relative h-60 w-full overflow-hidden bg-stone-100">
                  {!imgErrors[dest.id] ? (
                    <img
                      src={dest.thumbnail}
                      alt={dest.name}
                      className="w-full h-full object-cover transition-transform duration-700 hover:scale-105"
                      onError={() => handleImgError(dest.id)}
                    />
                  ) : (
                    <ScenicArt label={dest.name} className="w-full h-full object-cover" />
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-ink-950/80 via-ink-950/20 to-transparent" />

                  <div className="absolute top-4 left-4">
                    {dest.isCurated ? (
                      <span className="inline-flex items-center space-x-1 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-champagne-500 text-ink-950 shadow-sm">
                        <CheckCircle2 className="w-3 h-3" />
                        <span>Flagship Curated</span>
                      </span>
                    ) : (
                      <span className="inline-flex items-center space-x-1 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-stone-800/80 text-ivory-100 backdrop-blur-sm">
                        <AlertCircle className="w-3 h-3 text-champagne-300" />
                        <span>Preview Dataset</span>
                      </span>
                    )}
                  </div>

                  <div className="absolute bottom-4 left-4 right-4 text-white">
                    <span className="text-[10px] uppercase tracking-wider text-champagne-300 font-semibold">
                      {dest.state}, {dest.country}
                    </span>
                    <h3 className="font-serif text-2xl font-bold text-white mt-0.5">
                      {dest.name}
                    </h3>
                  </div>
                </div>

                {/* Content Box */}
                <div className="p-6 space-y-3">
                  <p className="text-xs text-stone-600 line-clamp-3 leading-relaxed font-sans">
                    {dest.overview}
                  </p>

                  <div className="pt-2 border-t border-stone-200">
                    <p className="text-[11px] font-semibold text-stone-700 mb-1.5">
                      Key Highlights:
                    </p>
                    <ul className="space-y-1 text-xs text-stone-600">
                      {dest.highlights.slice(0, 3).map((h, i) => (
                        <li key={i} className="flex items-start space-x-2">
                          <span className="text-champagne-600 font-bold">•</span>
                          <span>{h}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>

              {/* Bottom CTA Button */}
              <div className="p-6 pt-0">
                <button
                  onClick={() => onSelectDestination(dest.id)}
                  className={`w-full py-3 rounded-xl text-xs font-semibold tracking-wide uppercase transition-all flex items-center justify-center space-x-2 ${
                    dest.isCurated
                      ? 'bg-ink-900 text-ivory-50 hover:bg-ink-800 shadow-sm'
                      : 'bg-stone-100 text-stone-700 hover:bg-stone-200'
                  }`}
                >
                  <Compass className="w-4 h-4 text-champagne-400" />
                  <span>
                    Plan {dest.name.split('—')[0].trim()} Journey
                  </span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

