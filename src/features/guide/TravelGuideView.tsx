import React, { useState } from 'react';
import { DestinationTravelGuide, ChecklistCategory } from '../../types/travel';
import {
  FileText,
  Smartphone,
  ShieldAlert,
  Car,
  Camera,
  CheckSquare,
  Square,
  Sparkles,
  Info,
} from 'lucide-react';

interface TravelGuideViewProps {
  guide: DestinationTravelGuide;
  destinationName?: string;
}

export const TravelGuideView: React.FC<TravelGuideViewProps> = ({
  guide,
  destinationName = 'Your Destination',
}) => {
  // Interactive checklist state — initialise all items as unchecked
  const allItemIds = guide.checklist.flatMap((cat) => cat.items.map((item) => item.id));
  const [checkedItems, setCheckedItems] = useState<Record<string, boolean>>(
    Object.fromEntries(allItemIds.map((id) => [id, false]))
  );

  const toggleCheck = (id: string) => {
    setCheckedItems((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  return (
    <div className="space-y-8 font-sans">
      {/* Header Banner */}
      <div className="bg-white rounded-2xl border border-stone-250 p-6 sm:p-8 shadow-soft">
        <div className="max-w-2xl">
          <span className="px-2.5 py-0.5 rounded-full text-xs font-bold uppercase tracking-wider bg-champagne-100 text-champagne-800">
            LOCAL KNOWLEDGE &amp; READINESS
          </span>
          <h2 className="font-serif text-2xl sm:text-3xl font-bold text-ink-950 mt-1">
            Practical Travel Guide &amp; Packing Checklist
          </h2>
          <p className="text-xs sm:text-sm text-stone-600 mt-1">
            Insider guidance curated specifically for {destinationName} — covering local transport protocols,
            cultural etiquette, documentation requirements, and essential packing essentials.
          </p>
        </div>
      </div>

      {/* Essential Documents Highlight Banner */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {guide.essentialDocuments.map((doc, idx) => (
          <div
            key={idx}
            className={`p-6 rounded-2xl border shadow-soft flex flex-col justify-between ${
              doc.isCritical
                ? 'bg-amber-50/70 border-amber-300 ring-1 ring-amber-300/60'
                : 'bg-white border-stone-250'
            }`}
          >
            <div>
              <div className="flex items-center space-x-2 mb-3">
                {doc.isCritical ? (
                  <Smartphone className="w-5 h-5 text-amber-700" />
                ) : (
                  <FileText className="w-5 h-5 text-champagne-700" />
                )}
                <h4 className="font-serif text-base font-bold text-ink-950">
                  {doc.title}
                </h4>
              </div>
              <p className="text-xs text-stone-700 leading-relaxed font-sans">
                {doc.detail}
              </p>
            </div>
            {doc.isCritical && (
              <span className="mt-4 text-[10px] uppercase font-bold tracking-wider text-amber-800 bg-amber-100/80 px-2.5 py-1 rounded w-fit">
                Important Requirement
              </span>
            )}
          </div>
        ))}
      </div>

      {/* Local Transport Protocols & Cultural Etiquette */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Local Transport Rules */}
        <div className="bg-white rounded-2xl border border-stone-250 p-6 sm:p-8 shadow-soft space-y-4">
          <div className="flex items-center space-x-2 border-b pb-3">
            <Car className="w-5 h-5 text-champagne-700" />
            <h3 className="font-serif text-lg font-bold text-ink-950">
              Local Transport Protocols
            </h3>
          </div>
          <div className="space-y-4">
            {guide.localTransportRules.map((rule, idx) => (
              <div key={idx} className="space-y-1">
                <h5 className="text-xs font-bold text-ink-900">{rule.title}</h5>
                <p className="text-xs text-stone-600 leading-relaxed">{rule.detail}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Cultural Etiquette */}
        <div className="bg-white rounded-2xl border border-stone-250 p-6 sm:p-8 shadow-soft space-y-4">
          <div className="flex items-center space-x-2 border-b pb-3">
            <ShieldAlert className="w-5 h-5 text-sage-700" />
            <h3 className="font-serif text-lg font-bold text-ink-950">
              Cultural Etiquette &amp; Photography Rules
            </h3>
          </div>
          <div className="space-y-4">
            {guide.culturalEtiquette.map((et, idx) => (
              <div key={idx} className="space-y-1">
                <h5 className="text-xs font-bold text-ink-900">{et.title}</h5>
                <p className="text-xs text-stone-600 leading-relaxed">{et.detail}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Interactive Packing Checklist */}
      <div className="bg-white rounded-2xl border border-stone-250 p-6 sm:p-8 shadow-soft space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b pb-4 gap-2">
          <div>
            <div className="flex items-center space-x-2">
              <CheckSquare className="w-5 h-5 text-champagne-600" />
              <h3 className="font-serif text-xl font-bold text-ink-950">
                Interactive Travel Packing Checklist
              </h3>
            </div>
            <p className="text-xs text-stone-500 mt-0.5">
              Tap any item to check it off as you prepare your luggage.
            </p>
          </div>
          <div className="text-xs text-stone-500 font-medium">
            Checked:{' '}
            <strong className="text-ink-900">
              {Object.values(checkedItems).filter(Boolean).length}
            </strong>{' '}
            items
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {guide.checklist.map((cat: ChecklistCategory) => (
            <div key={cat.category} className="space-y-3">
              <h4 className="font-serif text-sm font-bold text-ink-900 border-b pb-1.5 text-champagne-800">
                {cat.category}
              </h4>
              <div className="space-y-2">
                {cat.items.map((item) => {
                  const isChecked = !!checkedItems[item.id];
                  return (
                    <div
                      key={item.id}
                      onClick={() => toggleCheck(item.id)}
                      className={`p-3 rounded-xl border text-xs cursor-pointer transition-all flex items-start space-x-2.5 ${
                        isChecked
                          ? 'bg-stone-50 border-stone-200 text-stone-400 line-through'
                          : 'bg-white border-stone-200 text-stone-800 hover:border-champagne-400 hover:bg-champagne-50/30'
                      }`}
                    >
                      <button type="button" className="shrink-0 mt-0.5">
                        {isChecked ? (
                          <CheckSquare className="w-4 h-4 text-sage-600" />
                        ) : (
                          <Square className="w-4 h-4 text-stone-400" />
                        )}
                      </button>
                      <div className="flex-1">
                        <span className="font-medium">{item.label}</span>
                        {item.isEssential && !isChecked && (
                          <span className="ml-1.5 text-[9px] uppercase font-bold text-red-600 bg-red-50 px-1.5 py-0.2 rounded">
                            Essential
                          </span>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
