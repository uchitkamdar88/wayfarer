import React, { useState } from 'react';
import { ActivitySlot, Attraction, DayItinerary, RegionTransfer } from '../../types/travel';
import { ArrowDown, ArrowRight, ArrowUp, Car, Info, MapPin, Plus, Trash2, Utensils, X } from 'lucide-react';
import { ScenicArt } from '../../components/common/ScenicArt';

interface SequencedActivity {
  activity: ActivitySlot;
  dayNumber: number;
  slot: ActivitySlot['slot'];
  indexInSlot: number;
}

interface RouteStop {
  region: string;
  transfer?: RegionTransfer;
  sourceDayNumbers: number[];
  summaries: string[];
  seasonalNotes: string[];
  activities: SequencedActivity[];
}

interface RouteSequenceProps {
  days: DayItinerary[];
  attractions?: Attraction[];
  onUpdateDays?: (days: DayItinerary[]) => void;
  print?: boolean;
}

export function buildRouteSequence(days: DayItinerary[]): RouteStop[] {
  const stops: RouteStop[] = [];
  const seenActivityKeys = new Set<string>();

  days.forEach((day) => {
    let stop = stops[stops.length - 1];
    if (!stop || stop.region !== day.baseRegion) {
      stop = {
        region: day.baseRegion,
        transfer: day.transferBetweenRegions,
        sourceDayNumbers: [],
        summaries: [],
        seasonalNotes: [],
        activities: [],
      };
      stops.push(stop);
    } else if (!stop.transfer && day.transferBetweenRegions) {
      stop.transfer = day.transferBetweenRegions;
    }
    stop.sourceDayNumbers.push(day.dayNumber);

    if (day.summary && !stop.summaries.includes(day.summary)) {
      stop.summaries.push(day.summary);
    }
    if (day.seasonalNotes && !stop.seasonalNotes.includes(day.seasonalNotes)) {
      stop.seasonalNotes.push(day.seasonalNotes);
    }

    const activitySlots: Array<{ slot: ActivitySlot['slot']; activities: ActivitySlot[] }> = [
      { slot: 'morning', activities: day.morning },
      { slot: 'afternoon', activities: day.afternoon },
      { slot: 'evening', activities: day.evening },
    ];
    activitySlots.forEach(({ slot, activities }) => {
      activities.forEach((activity, indexInSlot) => {
        const activityKey = activity.attractionId ?? activity.id;
        if (seenActivityKeys.has(activityKey)) return;
        seenActivityKeys.add(activityKey);
        stop?.activities.push({ activity, dayNumber: day.dayNumber, slot, indexInSlot });
      });
    });
  });

  return stops;
}

export const RouteSequence: React.FC<RouteSequenceProps> = ({
  days,
  attractions = [],
  onUpdateDays,
  print = false,
}) => {
  const [showAddStopFor, setShowAddStopFor] = useState<number | null>(null);
  const stops = buildRouteSequence(days);
  const existingActivityIds = new Set(
    stops.flatMap((stop) => stop.activities.map(({ activity }) => activity.attractionId))
  );
  const addStopTarget = showAddStopFor === null ? null : stops[showAddStopFor] ?? null;
  const availableAttractions = addStopTarget
    ? attractions.filter(
        (attraction) =>
          attraction.region.toLowerCase() === addStopTarget.region.toLowerCase() &&
          !existingActivityIds.has(attraction.id)
      )
    : [];

  const updateDayActivities = (
    dayNumber: number,
    slot: ActivitySlot['slot'],
    update: (activities: ActivitySlot[]) => ActivitySlot[]
  ) => {
    if (!onUpdateDays) return;
    onUpdateDays(days.map((day) => (day.dayNumber === dayNumber ? { ...day, [slot]: update(day[slot]) } : day)));
  };

  const removeActivity = (sequenced: SequencedActivity) => {
    if (sequenced.activity.attractionId && onUpdateDays) {
      const updatedDays = days.map((day) => ({
        ...day,
        morning: day.morning.filter((activity) => activity.attractionId !== sequenced.activity.attractionId),
        afternoon: day.afternoon.filter((activity) => activity.attractionId !== sequenced.activity.attractionId),
        evening: day.evening.filter((activity) => activity.attractionId !== sequenced.activity.attractionId),
      }));
      onUpdateDays(updatedDays);
      return;
    }

    updateDayActivities(sequenced.dayNumber, sequenced.slot, (activities) =>
      activities.filter((activity) => activity.id !== sequenced.activity.id)
    );
  };

  const moveActivity = (sequenced: SequencedActivity, direction: -1 | 1) => {
    updateDayActivities(sequenced.dayNumber, sequenced.slot, (activities) => {
      const targetIndex = sequenced.indexInSlot + direction;
      if (targetIndex < 0 || targetIndex >= activities.length) return activities;
      const reordered = [...activities];
      [reordered[sequenced.indexInSlot], reordered[targetIndex]] = [
        reordered[targetIndex],
        reordered[sequenced.indexInSlot],
      ];
      return reordered;
    });
  };

  const addAttraction = (attraction: Attraction) => {
    if (!onUpdateDays || !addStopTarget) return;
    const targetDayNumber = addStopTarget.sourceDayNumbers[addStopTarget.sourceDayNumbers.length - 1];
    const newActivity: ActivitySlot = {
      id: `custom-${Date.now()}`,
      slot: 'afternoon',
      time: '',
      attractionId: attraction.id,
      title: attraction.name,
      description: attraction.shortDescription,
      durationText: `${Math.max(1, Math.round(attraction.recommendedDurationMinutes / 60))} hours`,
      image: attraction.image,
      tips: attraction.practicalTips,
      isCustom: true,
    };
    updateDayActivities(targetDayNumber, 'afternoon', (activities) => [...activities, newActivity]);
    setShowAddStopFor(null);
  };

  if (print) {
    return (
      <div className="space-y-5">
        {stops.map((stop, index) => (
          <section
            key={`${stop.region}-${index}`}
            className="border border-stone-300 rounded-lg p-5 break-inside-avoid"
          >
            <div className="flex items-start gap-3 border-b border-stone-200 pb-3 mb-4">
              <span className="font-bold text-champagne-700 text-sm">{String(index + 1).padStart(2, '0')}</span>
              <div>
                <h3 className="font-serif text-xl font-bold text-ink-900">{stop.region}</h3>
                {stop.summaries.length > 0 && (
                  <p className="text-xs text-stone-600 mt-1">{stop.summaries.join(' ')}</p>
                )}
              </div>
            </div>

            {stop.transfer && (
              <div className="text-xs text-stone-600 mb-4">
                <strong>Route to this stop:</strong> {stop.transfer.from} → {stop.transfer.to}
                {stop.transfer.distanceKm > 0 && ` · approximately ${stop.transfer.distanceKm} km`}
                {stop.transfer.scenicHighlight && <p className="mt-1">{stop.transfer.scenicHighlight}</p>}
                {stop.transfer.roadNotes && <p className="mt-1 italic">{stop.transfer.roadNotes}</p>}
              </div>
            )}

            <ol className="space-y-3">
              {stop.activities.map(({ activity }, activityIndex) => (
                <li key={activity.id} className="flex gap-3 text-xs">
                  <span className="text-stone-400 font-semibold">{activityIndex + 1}.</span>
                  <div>
                    <h4 className="font-semibold text-ink-900">{activity.title}</h4>
                    <p className="text-stone-600 mt-0.5">{activity.description}</p>
                    {activity.tips && <p className="text-stone-500 mt-1"><strong>Note:</strong> {activity.tips}</p>}
                    {activity.mealSuggestion && (
                      <p className="text-stone-600 mt-1">
                        <strong>Dining:</strong> {activity.mealSuggestion.name} — {activity.mealSuggestion.cuisineType}
                      </p>
                    )}
                  </div>
                </li>
              ))}
            </ol>
          </section>
        ))}
        <p className="text-[10px] text-stone-500 italic">
          Suggested route order, not a fixed daily schedule. Adjust the pace and stops to local conditions and personal preference.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {stops.length > 1 && (
        <nav aria-label="Route sequence" className="bg-white rounded-2xl border border-stone-250 shadow-soft p-5">
          <p className="text-[10px] font-bold uppercase tracking-widest text-stone-500 mb-3">Suggested route</p>
          <ol className="flex flex-wrap items-center gap-y-2">
            {stops.map((stop, index) => (
              <React.Fragment key={`${stop.region}-${index}`}>
                <li className="inline-flex items-center gap-2 rounded-full bg-ivory-100 border border-stone-200 px-3 py-1.5 text-xs font-semibold text-ink-900">
                  <span className="text-[10px] text-champagne-700">{String(index + 1).padStart(2, '0')}</span>
                  {stop.region}
                </li>
                {index < stops.length - 1 && <ArrowRight className="w-4 h-4 mx-2 text-stone-400" aria-hidden="true" />}
              </React.Fragment>
            ))}
          </ol>
        </nav>
      )}

      {stops.map((stop, index) => (
        <section key={`${stop.region}-${index}`} className="bg-white rounded-2xl border border-stone-250 shadow-soft overflow-hidden">
          <header className="p-5 sm:p-6 bg-stone-50 border-b border-stone-200">
            <div className="flex items-start gap-3">
              <span className="w-8 h-8 rounded-full bg-ink-900 text-ivory-50 flex items-center justify-center text-xs font-bold shrink-0">
                {index + 1}
              </span>
              <div>
                <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-champagne-700">
                  <MapPin className="w-3.5 h-3.5" />
                  <span>Route stop</span>
                </div>
                <h2 className="font-serif text-xl sm:text-2xl font-bold text-ink-950 mt-1">{stop.region}</h2>
                {stop.summaries.length > 0 && (
                  <p className="text-xs text-stone-600 mt-1 max-w-3xl leading-relaxed">
                    {stop.summaries.join(' ')}
                  </p>
                )}
              </div>
            </div>

            {stop.transfer && (
              <div className="mt-4 ml-11 p-3 rounded-xl bg-champagne-50 border border-champagne-200 text-xs text-stone-700">
                <div className="flex items-center gap-2 font-semibold text-ink-900">
                  <Car className="w-4 h-4 text-champagne-700" />
                  <span>{stop.transfer.from} → {stop.transfer.to}</span>
                  {stop.transfer.distanceKm > 0 && (
                    <span className="font-normal text-stone-600">· approx. {stop.transfer.distanceKm} km</span>
                  )}
                </div>
                {stop.transfer.scenicHighlight && <p className="mt-1">{stop.transfer.scenicHighlight}</p>}
                {stop.transfer.roadNotes && <p className="mt-1 italic text-amber-900">Road note: {stop.transfer.roadNotes}</p>}
              </div>
            )}
          </header>

          <ol className="divide-y divide-stone-100">
            {stop.activities.map((sequenced, activityIndex) => {
              const { activity } = sequenced;
              const previous = stop.activities[activityIndex - 1];
              const next = stop.activities[activityIndex + 1];
              const canMoveUp =
                previous?.dayNumber === sequenced.dayNumber &&
                previous.slot === sequenced.slot &&
                previous.indexInSlot === sequenced.indexInSlot - 1;
              const canMoveDown =
                next?.dayNumber === sequenced.dayNumber &&
                next.slot === sequenced.slot &&
                next.indexInSlot === sequenced.indexInSlot + 1;

              return (
              <li key={activity.id} className="p-5 sm:p-6 flex gap-4">
                <div className="flex flex-col items-center shrink-0">
                  <span className="w-7 h-7 rounded-full border border-champagne-300 bg-champagne-50 text-champagne-800 flex items-center justify-center text-[11px] font-bold">
                    {activityIndex + 1}
                  </span>
                  {activityIndex < stop.activities.length - 1 && <span className="w-px flex-1 bg-stone-200 mt-2" />}
                </div>
                <div className="flex-1 min-w-0">
                  {onUpdateDays && (
                    <div className="flex justify-end gap-1 mb-2">
                      {canMoveUp && (
                        <button
                          type="button"
                          onClick={() => moveActivity(sequenced, -1)}
                          aria-label={`Move ${activity.title} earlier in route sequence`}
                          className="p-1.5 rounded text-stone-500 hover:bg-stone-100"
                        >
                          <ArrowUp className="w-4 h-4" />
                        </button>
                      )}
                      {canMoveDown && (
                        <button
                          type="button"
                          onClick={() => moveActivity(sequenced, 1)}
                          aria-label={`Move ${activity.title} later in route sequence`}
                          className="p-1.5 rounded text-stone-500 hover:bg-stone-100"
                        >
                          <ArrowDown className="w-4 h-4" />
                        </button>
                      )}
                      <button
                        type="button"
                        onClick={() => removeActivity(sequenced)}
                        aria-label={`Remove ${activity.title} from route`}
                        className="p-1.5 rounded text-stone-500 hover:bg-red-50 hover:text-red-600"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  )}
                  <div className="w-full sm:w-56 h-36 rounded-xl mb-4 overflow-hidden bg-stone-100 shrink-0">
                    <ScenicArt
                      image={activity.image}
                      label={activity.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <h3 className="font-serif text-base sm:text-lg font-bold text-ink-950">{activity.title}</h3>
                  <p className="text-xs text-stone-600 mt-1 leading-relaxed">{activity.description}</p>
                  {activity.tips && (
                    <p className="mt-3 p-3 rounded-lg bg-sage-50 border border-sage-200 text-[11px] text-sage-900 flex gap-2">
                      <Info className="w-3.5 h-3.5 shrink-0 mt-0.5" />
                      <span><strong>Local note:</strong> {activity.tips}</span>
                    </p>
                  )}
                  {activity.mealSuggestion && (
                    <div className="mt-3 p-3 rounded-lg bg-ivory-100 border border-stone-200 text-[11px] text-stone-700 flex gap-2">
                      <Utensils className="w-3.5 h-3.5 text-champagne-700 shrink-0 mt-0.5" />
                      <span>
                        <strong>{activity.mealSuggestion.name}</strong> · {activity.mealSuggestion.cuisineType}
                        <span className="block text-stone-500 mt-0.5">{activity.mealSuggestion.location}</span>
                      </span>
                    </div>
                  )}
                </div>
              </li>
              );
            })}
          </ol>

          {onUpdateDays && (
            <div className="px-5 sm:px-6 pb-5 sm:pb-6 no-print">
              <button
                type="button"
                onClick={() => setShowAddStopFor(index)}
                className="inline-flex items-center gap-2 rounded-lg border border-stone-300 px-3 py-2 text-xs font-semibold text-stone-700 hover:bg-stone-50"
              >
                <Plus className="w-4 h-4 text-champagne-700" />
                Add a local highlight
              </button>
            </div>
          )}

          {stop.seasonalNotes.length > 0 && (
            <div className="mx-5 sm:mx-6 mb-5 sm:mb-6 p-3 rounded-lg bg-stone-50 text-[11px] text-stone-600 flex gap-2">
              <Info className="w-3.5 h-3.5 text-champagne-700 shrink-0 mt-0.5" />
              <span><strong>Seasonal considerations:</strong> {stop.seasonalNotes.join(' ')}</span>
            </div>
          )}

          {index < stops.length - 1 && (
            <div className="flex justify-center -mb-3 relative z-10" aria-hidden="true">
              <ArrowDown className="w-5 h-5 text-champagne-600 bg-white rounded-full" />
            </div>
          )}
        </section>
      ))}

      <p className="text-[11px] text-stone-500 text-center italic">
        This is a suggested route sequence, not a fixed day-by-day or time-specific schedule.
      </p>

      {addStopTarget && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 no-print">
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="add-route-stop-title"
            className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-float border border-stone-300 space-y-4"
          >
            <div className="flex items-center justify-between border-b border-stone-200 pb-3">
              <h2 id="add-route-stop-title" className="font-serif text-lg font-bold text-ink-900">
                Add a highlight in {addStopTarget.region}
              </h2>
              <button
                type="button"
                onClick={() => setShowAddStopFor(null)}
                aria-label="Close add highlight dialog"
                className="p-1 text-stone-500 hover:text-stone-800"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <p className="text-xs text-stone-600">Choose a destination-specific stop to add to this route section.</p>
            <div className="max-h-72 overflow-y-auto space-y-2 pr-1">
              {availableAttractions.length > 0 ? (
                availableAttractions.map((attraction) => (
                  <button
                    type="button"
                    key={attraction.id}
                    onClick={() => addAttraction(attraction)}
                    className="w-full text-left p-3 rounded-xl border border-stone-200 hover:border-champagne-500 hover:bg-champagne-50/50 transition-colors"
                  >
                    <span className="block text-xs font-bold text-ink-900">{attraction.name}</span>
                    <span className="block text-[11px] text-stone-500 mt-1">{attraction.shortDescription}</span>
                  </button>
                ))
              ) : (
                <p className="text-xs text-stone-500 italic p-4 text-center">
                  There are no additional curated highlights for this region.
                </p>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
