import React, { useState } from 'react';
import { ActivitySlot, DiningSuggestion } from '../../types/travel';
import { Clock, MapPin, Utensils, Info, Trash2, ArrowUp, ArrowDown, Sparkles } from 'lucide-react';
import { ScenicArt } from '../../components/common/ScenicArt';

interface ActivitySlotCardProps {
  activity: ActivitySlot;
  onRemove?: () => void;
  onMoveUp?: () => void;
  onMoveDown?: () => void;
  canMoveUp?: boolean;
  canMoveDown?: boolean;
}

export const ActivitySlotCard: React.FC<ActivitySlotCardProps> = ({
  activity,
  onRemove,
  onMoveUp,
  onMoveDown,
  canMoveUp,
  canMoveDown,
}) => {
  const [showDetails, setShowDetails] = useState(false);

  // Badge color based on slot
  const slotColor =
    activity.slot === 'morning'
      ? 'border-champagne-400 text-champagne-800 bg-champagne-50'
      : activity.slot === 'afternoon'
      ? 'border-stone-300 text-stone-700 bg-stone-50'
      : 'border-ink-800 text-ink-900 bg-ink-50';

  return (
    <div className="bg-white rounded-xl border border-stone-250 p-5 shadow-soft hover:shadow-elevated transition-all flex flex-col justify-between">
      <div>
        {/* Top meta bar */}
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center space-x-2">
            <span
              className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider border ${slotColor}`}
            >
              {activity.slot}
            </span>
            <div className="flex items-center text-xs text-stone-500 space-x-1">
              <Clock className="w-3.5 h-3.5 text-stone-400" />
              <span>{activity.time}</span>
              <span className="text-stone-300">•</span>
              <span>{activity.durationText}</span>
            </div>
          </div>

          {/* Slot Reorder & Remove Controls */}
          <div className="flex items-center space-x-1 no-print">
            {canMoveUp && onMoveUp && (
              <button
                onClick={onMoveUp}
                title="Move up in day schedule"
                className="p-1 rounded text-stone-400 hover:text-ink-900 hover:bg-stone-100"
              >
                <ArrowUp className="w-3.5 h-3.5" />
              </button>
            )}
            {canMoveDown && onMoveDown && (
              <button
                onClick={onMoveDown}
                title="Move down in day schedule"
                className="p-1 rounded text-stone-400 hover:text-ink-900 hover:bg-stone-100"
              >
                <ArrowDown className="w-3.5 h-3.5" />
              </button>
            )}
            {onRemove && (
              <button
                onClick={onRemove}
                title="Remove activity"
                className="p-1 rounded text-stone-400 hover:text-red-600 hover:bg-red-50"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>

        {/* Content Layout: Photo + Title + Desc */}
        <div className="flex flex-col sm:flex-row gap-4 items-start">
          <div className="w-full sm:w-28 h-32 sm:h-28 rounded-lg overflow-hidden shrink-0 border border-stone-200 bg-stone-100 shadow-xs">
            <ScenicArt
              image={activity.image}
              label={activity.title}
              className="w-full h-full object-cover"
            />
          </div>

          <div className="flex-1 min-w-0">
            <h4 className="font-serif text-base font-bold text-ink-950 mb-1">
              {activity.title}
            </h4>
            <p className="text-xs text-stone-600 leading-relaxed font-sans">
              {activity.description}
            </p>

            {activity.tips && (
              <div className="mt-2 text-[11px] text-sage-900 bg-sage-50/80 p-2 rounded border border-sage-200 flex items-start space-x-1.5">
                <Info className="w-3.5 h-3.5 text-sage-700 shrink-0 mt-0.5" />
                <span>
                  <strong>Insider Note:</strong> {activity.tips}
                </span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Meal Suggestion Box */}
      {activity.mealSuggestion && (
        <div className="mt-4 pt-3 border-t border-stone-150 flex items-start space-x-2 text-xs text-stone-700">
          <Utensils className="w-4 h-4 text-champagne-600 shrink-0 mt-0.5" />
          <div className="flex-1">
            <div className="flex items-center space-x-2">
              <strong className="text-ink-900">{activity.mealSuggestion.name}</strong>
              {activity.mealSuggestion.isPureVeg && (
                <span className="px-1.5 py-0.2 rounded text-[9px] font-bold uppercase tracking-wider bg-sage-100 text-sage-800">
                  Pure Veg
                </span>
              )}
              {activity.mealSuggestion.isJainFriendly && (
                <span className="px-1.5 py-0.2 rounded text-[9px] font-bold uppercase tracking-wider bg-champagne-100 text-champagne-800">
                  Jain Friendly
                </span>
              )}
            </div>
            <p className="text-[11px] text-stone-500 mt-0.5">
              {activity.mealSuggestion.cuisineType} • {activity.mealSuggestion.location}
            </p>
            <p className="text-[11px] text-stone-600 italic mt-0.5">
              Recommended: {activity.mealSuggestion.recommendedDishes.slice(0, 3).join(', ')}
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

