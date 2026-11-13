import React, { useState, useEffect } from 'react';
import { CompassLogo } from '../../components/common/CompassLogo';
import { Check, Sparkles, MapPin, Hotel, Coins, Calendar } from 'lucide-react';

interface GenerationLoadingScreenProps {
  onComplete: () => void;
  destinationName?: string;
}

export const GenerationLoadingScreen: React.FC<GenerationLoadingScreenProps> = ({
  onComplete,
  destinationName = 'Your Destination',
}) => {
  const stagedMessages = [
    { text: 'Understanding your travel preferences and group requirements...', icon: Calendar },
    { text: `Analyzing seasonal climate windows and weather for ${destinationName}...`, icon: MapPin },
    { text: 'Ordering regional stops to reduce unnecessary backtracking...', icon: MapPin },
    { text: 'Matching highlights with seasonal conditions and your travel style...', icon: Sparkles },
    { text: 'Preparing vetted accommodation recommendations...', icon: Hotel },
    { text: 'Estimating transparent, itemized travel budget...', icon: Coins },
    { text: 'Finalizing your bespoke WAYFARER itinerary...', icon: Sparkles },
  ];

  const [currentStage, setCurrentStage] = useState(0);

  useEffect(() => {
    const stageDuration = 450; // smooth and prompt, ~3.1 seconds total

    const interval = setInterval(() => {
      setCurrentStage((prev) => {
        if (prev < stagedMessages.length - 1) {
          return prev + 1;
        } else {
          clearInterval(interval);
          setTimeout(() => {
            onComplete();
          }, 300);
          return prev;
        }
      });
    }, stageDuration);

    return () => clearInterval(interval);
  }, [onComplete, stagedMessages.length]);

  return (
    <div className="fixed inset-0 z-50 bg-ink-950 flex flex-col items-center justify-center p-6 text-ivory-100 font-sans">
      <div className="max-w-md w-full text-center space-y-8 animate-in fade-in duration-500">
        {/* Animated Compass Logo */}
        <div className="flex justify-center">
          <div className="relative">
            <div className="w-20 h-20 rounded-full border border-champagne-400/30 animate-ping absolute inset-0" />
            <CompassLogo className="w-20 h-20 text-champagne-400 animate-spin" size={80} />
          </div>
        </div>

        <div>
          <span className="text-xs uppercase font-bold tracking-[0.25em] text-champagne-400">
            WAYFARER ARCHITECTURE
          </span>
          <h2 className="font-serif text-3xl font-bold text-white mt-2">
            Curating {destinationName}
          </h2>
          <p className="text-xs text-stone-400 mt-1 font-sans">
            Ordering route stops around geography, seasonal conditions, and local experiences.
          </p>
        </div>

        {/* Staged Checklist */}
        <div className="bg-ink-900/80 border border-ink-800 rounded-2xl p-6 text-left space-y-3.5 shadow-float">
          {stagedMessages.map((stage, idx) => {
            const isFinished = idx < currentStage;
            const isCurrent = idx === currentStage;
            const isPending = idx > currentStage;

            return (
              <div
                key={idx}
                className={`flex items-center space-x-3 text-xs transition-opacity duration-300 ${
                  isPending ? 'opacity-30' : 'opacity-100'
                }`}
              >
                <div
                  className={`w-5 h-5 rounded-full flex items-center justify-center shrink-0 text-[10px] ${
                    isFinished
                      ? 'bg-sage-600 text-white'
                      : isCurrent
                      ? 'border-2 border-champagne-400 text-champagne-400 animate-pulse'
                      : 'border border-stone-700 text-stone-700'
                  }`}
                >
                  {isFinished ? <Check className="w-3 h-3 stroke-[3]" /> : idx + 1}
                </div>
                <span
                  className={`${
                    isCurrent
                      ? 'text-champagne-300 font-semibold'
                      : isFinished
                      ? 'text-stone-300'
                      : 'text-stone-600'
                  }`}
                >
                  {stage.text}
                </span>
              </div>
            );
          })}
        </div>

        {/* Bottom subtle message */}
        <p className="text-[11px] text-stone-500 italic">
          Every journey deserves a story.
        </p>
      </div>
    </div>
  );
};
