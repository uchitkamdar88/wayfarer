import React, { useState } from 'react';
import { DayItinerary, ActivitySlot, FoodPreference, Attraction } from '../../types/travel';
import { ActivitySlotCard } from './ActivitySlotCard';
import { getMealSuggestion } from '../../lib/recommendation/engine';
import {
  Calendar,
  Clock,
  Car,
  Compass,
  RotateCcw,
  Sparkles,
  Plus,
  Coffee,
  Info,
  ChevronDown,
  ChevronUp,
  Moon,
  AlertCircle,
} from 'lucide-react';

interface DayCardProps {
  day: DayItinerary;
  foodPreference: FoodPreference;
  onUpdateDay: (updated: DayItinerary) => void;
  onRelaxDay: (dayNumber: number) => void;
  destinationAttractions?: Attraction[];
  /** Set of canonical attraction IDs already used across the whole trip */
  tripScheduledIds?: Set<string>;
}

export const DayCard: React.FC<DayCardProps> = ({
  day,
  foodPreference,
  onUpdateDay,
  onRelaxDay,
  destinationAttractions = [],
}) => {
  const [isExpanded, setIsExpanded] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);

  // Remove an activity
  const handleRemoveActivity = (slotType: 'morning' | 'afternoon' | 'evening', id: string) => {
    const updated = { ...day };
    updated[slotType] = updated[slotType].filter((a) => a.id !== id);
    onUpdateDay(updated);
  };

  // Move activity up/down
  const handleMove = (slotType: 'morning' | 'afternoon' | 'evening', index: number, direction: 'up' | 'down') => {
    const updated = { ...day };
    const list = [...updated[slotType]];
    const targetIndex = direction === 'up' ? index - 1 : index + 1;

    if (targetIndex >= 0 && targetIndex < list.length) {
      const temp = list[index];
      list[index] = list[targetIndex];
      list[targetIndex] = temp;
      updated[slotType] = list;
      onUpdateDay(updated);
    }
  };

  // Add an attraction from the destination's curated pool
  const handleAddAttraction = (attractionId: string) => {
    const attraction = destinationAttractions.find((a) => a.id === attractionId);
    if (!attraction) return;

    // Check if already in this day
    const alreadyInDay = [
      ...day.morning.map((a) => a.attractionId),
      ...day.afternoon.map((a) => a.attractionId),
      ...day.evening.map((a) => a.attractionId),
    ].includes(attractionId);

    if (alreadyInDay) return; // silent guard — UI filters this out anyway

    const newActivity: ActivitySlot = {
      id: `custom-${Date.now()}`,
      slot: 'afternoon',
      time: 'Afternoon (added)',
      attractionId: attraction.id,
      locationType: 'sightseeing',
      title: attraction.name,
      description: attraction.shortDescription,
      durationText: `~${Math.round(attraction.recommendedDurationMinutes / 60)} hours`,
      image: attraction.image,
      tips: attraction.practicalTips,
      isCustom: true,
    };

    const updated = { ...day, afternoon: [...day.afternoon, newActivity] };
    onUpdateDay(updated);
    setShowAddModal(false);
  };

  // Available attractions in this region not yet included in this day
  const existingIds = new Set([
    ...day.morning.map((a) => a.attractionId),
    ...day.afternoon.map((a) => a.attractionId),
    ...day.evening.map((a) => a.attractionId),
  ]);

  const candidatePool = destinationAttractions.filter(
    (a) => a.region.toLowerCase() === day.baseRegion.toLowerCase() && !existingIds.has(a.id)
  );

  return (
    <div className="bg-white rounded-2xl border border-stone-250 shadow-soft overflow-hidden transition-all">
      {/* Day Header Bar */}
      <div className="p-6 bg-stone-50/90 border-b border-stone-250">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center flex-wrap gap-2">
              <span className="px-2.5 py-0.5 rounded-full text-xs font-bold uppercase tracking-wider bg-ink-900 text-ivory-50">
                DAY {String(day.dayNumber).padStart(2, '0')}
              </span>
              <span className="text-xs font-semibold text-champagne-700 uppercase tracking-widest">
                {day.baseRegion}
              </span>
              {day.overnightLocation && day.overnightLocation !== day.baseRegion && (
                <span className="flex items-center gap-1 text-xs text-stone-500 font-medium">
                  <span className="text-stone-300">·</span>
                  <span>Overnight: {day.overnightLocation}</span>
                </span>
              )}
              <span className="text-stone-300">·</span>
              <span className="text-xs text-stone-500 font-medium">{day.formattedDate}</span>
            </div>

            <h3 className="font-serif text-xl sm:text-2xl font-bold text-ink-950 mt-1">
              {day.title}
            </h3>
            <p className="text-xs text-stone-600 mt-1 max-w-2xl font-sans leading-relaxed">
              {day.summary}
            </p>

            {/* Travel Info banner */}
            {day.travelInfo && (
              <p className="mt-1.5 text-xs text-champagne-700 font-medium flex items-center gap-1.5">
                <Car className="w-3.5 h-3.5 shrink-0" />
                {day.travelInfo}
              </p>
            )}
          </div>

          {/* Day Actions */}
          <div className="flex items-center space-x-2 no-print self-start sm:self-auto">
            <button
              onClick={() => onRelaxDay(day.dayNumber)}
              title="Add rest and mountain kahwa breaks"
              className="px-3 py-1.5 rounded-lg border border-stone-300 bg-white hover:bg-stone-100 text-xs font-semibold text-stone-700 flex items-center space-x-1.5"
            >
              <Coffee className="w-3.5 h-3.5 text-champagne-600" />
              <span>Relax Day</span>
            </button>

            <button
              onClick={() => setShowAddModal(true)}
              title="Add activity from local dataset"
              className="px-3 py-1.5 rounded-lg border border-stone-300 bg-white hover:bg-stone-100 text-xs font-semibold text-stone-700 flex items-center space-x-1.5"
            >
              <Plus className="w-3.5 h-3.5 text-champagne-600" />
              <span>Add Stop</span>
            </button>

            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className="p-1.5 rounded-lg border border-stone-300 bg-white hover:bg-stone-100 text-stone-600"
              aria-label="Toggle day view"
            >
              {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            </button>
          </div>
        </div>

        {/* Transfer Banner (if day includes travel between regions) */}
        {day.transferBetweenRegions && (
          <div className="mt-4 p-3.5 rounded-xl bg-champagne-50 border border-champagne-200 flex items-start space-x-3 text-xs text-champagne-950">
            <Car className="w-4 h-4 text-champagne-700 shrink-0 mt-0.5" />
            <div>
              <div className="flex items-center space-x-2">
                <strong>Regional Highway Transfer:</strong>
                <span>
                  {day.transferBetweenRegions.from} → {day.transferBetweenRegions.to} ({day.transferBetweenRegions.distanceKm} km, ~{day.transferBetweenRegions.durationHours} hrs)
                </span>
              </div>
              <p className="text-stone-600 mt-0.5">
                {day.transferBetweenRegions.scenicHighlight}
              </p>
              {day.transferBetweenRegions.roadNotes && (
                <p className="text-[11px] text-champagne-800 italic mt-0.5">
                  Advisory: {day.transferBetweenRegions.roadNotes}
                </p>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Expanded Activity Slots */}
      {isExpanded && (
        <div className="p-6 space-y-6">
          {/* Morning Slots */}
          {day.morning.length > 0 && (
            <div className="space-y-3">
              <span className="text-xs font-bold uppercase tracking-wider text-champagne-700 flex items-center space-x-1.5">
                <Clock className="w-3.5 h-3.5" />
                <span>Morning Sightseeing & Activities</span>
              </span>
              <div className="grid grid-cols-1 gap-4">
                {day.morning.map((act, idx) => (
                  <ActivitySlotCard
                    key={act.id}
                    activity={act}
                    onRemove={() => handleRemoveActivity('morning', act.id)}
                    onMoveUp={() => handleMove('morning', idx, 'up')}
                    onMoveDown={() => handleMove('morning', idx, 'down')}
                    canMoveUp={idx > 0}
                    canMoveDown={idx < day.morning.length - 1}
                  />
                ))}
              </div>
            </div>
          )}

          {/* Afternoon Slots */}
          {day.afternoon.length > 0 && (
            <div className="space-y-3 pt-2">
              <span className="text-xs font-bold uppercase tracking-wider text-stone-600 flex items-center space-x-1.5">
                <Clock className="w-3.5 h-3.5" />
                <span>Afternoon Discovery & Lunch</span>
              </span>
              <div className="grid grid-cols-1 gap-4">
                {day.afternoon.map((act, idx) => (
                  <ActivitySlotCard
                    key={act.id}
                    activity={act}
                    onRemove={() => handleRemoveActivity('afternoon', act.id)}
                    onMoveUp={() => handleMove('afternoon', idx, 'up')}
                    onMoveDown={() => handleMove('afternoon', idx, 'down')}
                    canMoveUp={idx > 0}
                    canMoveDown={idx < day.afternoon.length - 1}
                  />
                ))}
              </div>
            </div>
          )}

          {/* Evening Slots */}
          {day.evening.length > 0 && (
            <div className="space-y-3 pt-2">
              <span className="text-xs font-bold uppercase tracking-wider text-ink-800 flex items-center space-x-1.5">
                <Clock className="w-3.5 h-3.5" />
                <span>Evening Ambiance, Twilight & Dinner</span>
              </span>
              <div className="grid grid-cols-1 gap-4">
                {day.evening.map((act, idx) => (
                  <ActivitySlotCard
                    key={act.id}
                    activity={act}
                    onRemove={() => handleRemoveActivity('evening', act.id)}
                    onMoveUp={() => handleMove('evening', idx, 'up')}
                    onMoveDown={() => handleMove('evening', idx, 'down')}
                    canMoveUp={idx > 0}
                    canMoveDown={idx < day.evening.length - 1}
                  />
                ))}
              </div>
            </div>
          )}

          {/* Seasonal / Climate Note for this day */}
          {day.seasonalNotes && (
            <div className="p-3 bg-stone-50 rounded-xl border border-stone-200 text-xs text-stone-600 flex items-center space-x-2">
              <Info className="w-4 h-4 text-champagne-600 shrink-0" />
              <span><strong>Seasonal Climate:</strong> {day.seasonalNotes}</span>
            </div>
          )}
        </div>
      )}

      {/* Add Attraction Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-float border border-stone-300 space-y-4">
            <div className="flex items-center justify-between border-b pb-3">
              <h4 className="font-serif text-lg font-bold text-ink-900">
                Add Stop to Day {day.dayNumber} ({day.baseRegion})
              </h4>
              <button
                onClick={() => setShowAddModal(false)}
                className="text-stone-400 hover:text-stone-600 text-sm font-bold"
              >
                ✕
              </button>
            </div>

            <p className="text-xs text-stone-600">
              Select an available curated attraction in {day.baseRegion} to append to this day’s schedule:
            </p>

            <div className="max-h-72 overflow-y-auto space-y-2 pr-1">
              {candidatePool.length > 0 ? (
                candidatePool.map((c) => (
                  <div
                    key={c.id}
                    onClick={() => handleAddAttraction(c.id)}
                    className="p-3 rounded-xl border border-stone-200 hover:border-champagne-500 hover:bg-champagne-50/50 cursor-pointer flex items-center justify-between transition-all"
                  >
                    <div>
                      <h5 className="text-xs font-bold text-ink-900">{c.name}</h5>
                      <p className="text-[11px] text-stone-500">{c.shortDescription}</p>
                    </div>
                    <span className="text-xs font-bold text-champagne-700 ml-2">+ Add</span>
                  </div>
                ))
              ) : (
                <p className="text-xs text-stone-500 italic p-4 text-center">
                  All major curated attractions for {day.baseRegion} are already included in this day!
                </p>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

