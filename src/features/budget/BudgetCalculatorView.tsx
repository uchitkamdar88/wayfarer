import React, { useState } from 'react';
import { TripBudgetBreakdown, TripPreferences, Hotel } from '../../types/travel';
import {
  Coins,
  Users,
  Calendar,
  Sparkles,
  Sliders,
  ShieldAlert,
  RotateCcw,
  Info,
  CheckCircle2,
  AlertTriangle,
} from 'lucide-react';

interface BudgetCalculatorViewProps {
  budget: TripBudgetBreakdown;
  preferences: TripPreferences;
  selectedHotel?: Hotel;
  onUpdateBudget: (updated: TripBudgetBreakdown) => void;
  onResetBudget: () => void;
}

export const BudgetCalculatorView: React.FC<BudgetCalculatorViewProps> = ({
  budget,
  preferences,
  selectedHotel,
  onUpdateBudget,
  onResetBudget,
}) => {
  const totalGuests = (preferences.travellers.adults || 2) + (preferences.travellers.children || 0);
  const duration = preferences.durationDays;

  // Local editable values
  const [onward, setOnward] = useState<number>(budget.onwardTransportEstimate);
  const [returnCost, setReturnCost] = useState<number>(budget.returnTransportEstimate);
  const [accommodation, setAccommodation] = useState<number>(budget.accommodationEstimate);
  const [food, setFood] = useState<number>(budget.foodEstimate);
  const [localTransport, setLocalTransport] = useState<number>(budget.localTransportEstimate);
  const [sightseeing, setSightseeing] = useState<number>(budget.sightseeingEstimate);
  const [shopping, setShopping] = useState<number>(budget.shoppingAndIncidentals);

  // Recalculate helper
  const handleItemChange = (field: string, val: number) => {
    const cleanVal = Math.max(0, val || 0);
    let newOnward = field === 'onward' ? cleanVal : onward;
    let newReturn = field === 'return' ? cleanVal : returnCost;
    let newAcc = field === 'accommodation' ? cleanVal : accommodation;
    let newFood = field === 'food' ? cleanVal : food;
    let newLocal = field === 'local' ? cleanVal : localTransport;
    let newSight = field === 'sightseeing' ? cleanVal : sightseeing;
    let newShop = field === 'shopping' ? cleanVal : shopping;

    if (field === 'onward') setOnward(cleanVal);
    if (field === 'return') setReturnCost(cleanVal);
    if (field === 'accommodation') setAccommodation(cleanVal);
    if (field === 'food') setFood(cleanVal);
    if (field === 'local') setLocalTransport(cleanVal);
    if (field === 'sightseeing') setSightseeing(cleanVal);
    if (field === 'shopping') setShopping(cleanVal);

    const subtotal = newOnward + newReturn + newAcc + newFood + newLocal + newSight + newShop;
    const contingency = Math.round(subtotal * 0.07);
    const total = subtotal + contingency;

    onUpdateBudget({
      ...budget,
      onwardTransportEstimate: newOnward,
      returnTransportEstimate: newReturn,
      accommodationEstimate: newAcc,
      foodEstimate: newFood,
      localTransportEstimate: newLocal,
      sightseeingEstimate: newSight,
      shoppingAndIncidentals: newShop,
      contingencyBuffer: contingency,
      totalEstimate: total,
      perPersonEstimate: Math.round(total / totalGuests),
      dailyAverage: Math.round(total / duration),
      isUserAdjusted: true,
    });
  };

  const targetBudget = preferences.targetBudget || 0;
  const budgetDiff = targetBudget > 0 ? targetBudget - budget.totalEstimate : 0;
  const isOverBudget = targetBudget > 0 && budgetDiff < 0;
  const pctOfTarget = targetBudget > 0 ? Math.min(100, Math.round((budget.totalEstimate / targetBudget) * 100)) : 0;

  return (
    <div className="space-y-8 font-sans">
      {/* Top Total Summary Cards */}
      <div className="bg-white rounded-2xl border border-stone-250 p-6 sm:p-8 shadow-soft">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div>
            <div className="flex items-center space-x-2">
              <span className="px-2.5 py-0.5 rounded-full text-xs font-bold uppercase tracking-wider bg-champagne-100 text-champagne-800">
                DYNAMIC FINANCIAL BLUEPRINT
              </span>
              {budget.isUserAdjusted && (
                <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-sage-100 text-sage-800">
                  Customized by You
                </span>
              )}
            </div>
            <h2 className="font-serif text-2xl sm:text-3xl font-bold text-ink-950 mt-1">
              Transparent Travel Budget Estimator
            </h2>
            <p className="text-xs sm:text-sm text-stone-600 mt-1">
              Derived from authentic local benchmarks for a {duration}-day journey for {totalGuests} guests ({preferences.travellers.adults} adults, {preferences.travellers.children} children).
            </p>
          </div>

          {budget.isUserAdjusted && (
            <button
              onClick={onResetBudget}
              className="px-3.5 py-2 rounded-lg border border-stone-300 text-xs font-semibold text-stone-700 hover:bg-stone-100 flex items-center space-x-1.5 self-start"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset Curated Baseline</span>
            </button>
          )}
        </div>

        {/* Planned Target vs Estimated Comparison Bar (from Claude inspiration) */}
        {targetBudget > 0 && (
          <div
            className={`mb-6 p-4 rounded-xl border text-xs ${
              isOverBudget
                ? 'bg-amber-50/80 border-amber-300 text-amber-950'
                : 'bg-sage-50/80 border-sage-300 text-sage-950'
            }`}
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2 font-medium">
              <div className="flex items-center space-x-2">
                {isOverBudget ? (
                  <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" />
                ) : (
                  <CheckCircle2 className="w-4 h-4 text-sage-600 shrink-0" />
                )}
                <span>
                  Target Budget:{' '}
                  <strong>₹{targetBudget.toLocaleString('en-IN')}</strong> ({preferences.budgetType === 'per-person' ? 'Per Person Basis' : 'Group Total'})
                </span>
              </div>
              <span className="font-bold">
                {isOverBudget
                  ? `Estimate is ₹${Math.abs(budgetDiff).toLocaleString('en-IN')} above planned budget`
                  : `Estimate leaves ₹${budgetDiff.toLocaleString('en-IN')} buffer in hand`}
              </span>
            </div>

            {/* Progress bar */}
            <div className="w-full bg-stone-200 rounded-full h-2 overflow-hidden">
              <div
                className={`h-full rounded-full transition-all duration-300 ${
                  isOverBudget ? 'bg-amber-500' : 'bg-sage-600'
                }`}
                style={{ width: `${Math.min(100, pctOfTarget)}%` }}
              />
            </div>
            <div className="flex justify-between text-[11px] text-stone-500 mt-1">
              <span>0%</span>
              <span>{pctOfTarget}% of target budget allocated</span>
              <span>100%</span>
            </div>
          </div>
        )}

        {/* 3 Metrics Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
          <div className="p-5 rounded-xl bg-ink-900 text-ivory-50">
            <span className="text-[10px] font-bold uppercase tracking-wider text-champagne-400">
              Total Estimated Group Outlay
            </span>
            <div className="font-serif text-3xl font-bold text-white mt-1">
              ₹{budget.totalEstimate.toLocaleString('en-IN')}
            </div>
            <p className="text-[11px] text-stone-400 mt-1">Includes 7% contingency reserve</p>
          </div>

          <div className="p-5 rounded-xl bg-champagne-50 border border-champagne-200">
            <span className="text-[10px] font-bold uppercase tracking-wider text-champagne-800">
              Per Person Average
            </span>
            <div className="font-serif text-3xl font-bold text-champagne-950 mt-1">
              ₹{budget.perPersonEstimate.toLocaleString('en-IN')}
            </div>
            <p className="text-[11px] text-champagne-700 mt-1">Based on {totalGuests} travellers in party</p>
          </div>

          <div className="p-5 rounded-xl bg-stone-50 border border-stone-200">
            <span className="text-[10px] font-bold uppercase tracking-wider text-stone-600">
              Daily Group Average
            </span>
            <div className="font-serif text-3xl font-bold text-ink-900 mt-1">
              ₹{budget.dailyAverage.toLocaleString('en-IN')}
            </div>
            <p className="text-[11px] text-stone-500 mt-1">Across all {duration} active journey days</p>
          </div>
        </div>
      </div>

      {/* Interactive Itemized Sliders & Direct Inputs */}
      <div className="bg-white rounded-2xl border border-stone-250 p-6 sm:p-8 shadow-soft space-y-6">
        <div className="flex items-center justify-between border-b pb-4">
          <div className="flex items-center space-x-2">
            <Sliders className="w-4 h-4 text-champagne-600" />
            <h3 className="font-serif text-lg font-bold text-ink-950">
              Itemized Category Outlays & Custom Overrides
            </h3>
          </div>
          <span className="text-xs text-stone-500">Edit amounts or slide to update totals immediately</span>
        </div>

        <div className="space-y-6">
          {/* Onward Transportation */}
          <div className="space-y-2 p-3 rounded-xl hover:bg-stone-50/60 transition-colors">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
              <span className="font-bold text-ink-900">
                1. Onward Transit ({preferences.onwardTransport.mode.toUpperCase()})
              </span>
              <div className="flex items-center space-x-2">
                <span className="text-stone-400">₹</span>
                <input
                  type="number"
                  min="0"
                  step="500"
                  value={onward}
                  onChange={(e) => handleItemChange('onward', Number(e.target.value))}
                  className="w-28 px-2 py-1 rounded border border-stone-300 font-bold text-ink-900 text-xs text-right focus:ring-1 focus:ring-champagne-500"
                />
              </div>
            </div>
            <input
              type="range"
              min="0"
              max="60000"
              step="500"
              value={onward}
              onChange={(e) => handleItemChange('onward', Number(e.target.value))}
              className="w-full accent-champagne-600"
            />
            <p className="text-[11px] text-stone-500">
              {preferences.onwardTransport.isBooked
                ? 'Marked as booked (0 added to budget). You can override if desired.'
                : `Benchmark: Transit to destination airport/station for ${totalGuests} guests.`}
            </p>
          </div>

          {/* Return Transportation */}
          <div className="space-y-2 p-3 rounded-xl hover:bg-stone-50/60 transition-colors">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
              <span className="font-bold text-ink-900">
                2. Return Transit ({preferences.returnTransport.mode.toUpperCase()})
              </span>
              <div className="flex items-center space-x-2">
                <span className="text-stone-400">₹</span>
                <input
                  type="number"
                  min="0"
                  step="500"
                  value={returnCost}
                  onChange={(e) => handleItemChange('return', Number(e.target.value))}
                  className="w-28 px-2 py-1 rounded border border-stone-300 font-bold text-ink-900 text-xs text-right focus:ring-1 focus:ring-champagne-500"
                />
              </div>
            </div>
            <input
              type="range"
              min="0"
              max="60000"
              step="500"
              value={returnCost}
              onChange={(e) => handleItemChange('return', Number(e.target.value))}
              className="w-full accent-champagne-600"
            />
          </div>

          {/* Accommodation */}
          <div className="space-y-2 p-3 rounded-xl hover:bg-stone-50/60 transition-colors">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
              <span className="font-bold text-ink-900">
                3. Accommodation ({selectedHotel?.name || 'Selected Property'})
              </span>
              <div className="flex items-center space-x-2">
                <span className="text-stone-400">₹</span>
                <input
                  type="number"
                  min="0"
                  step="1000"
                  value={accommodation}
                  onChange={(e) => handleItemChange('accommodation', Number(e.target.value))}
                  className="w-28 px-2 py-1 rounded border border-stone-300 font-bold text-ink-900 text-xs text-right focus:ring-1 focus:ring-champagne-500"
                />
              </div>
            </div>
            <input
              type="range"
              min="10000"
              max="250000"
              step="1000"
              value={accommodation}
              onChange={(e) => handleItemChange('accommodation', Number(e.target.value))}
              className="w-full accent-champagne-600"
            />
            <p className="text-[11px] text-stone-500">
              Calculation: {preferences.accommodation.roomsCount} room(s) x {Math.max(1, duration - 1)} night(s) at property tariff.
            </p>
          </div>

          {/* Food & Dining */}
          <div className="space-y-2 p-3 rounded-xl hover:bg-stone-50/60 transition-colors">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
              <span className="font-bold text-ink-900">
                4. Food & Dining ({preferences.foodPreference.toUpperCase()})
              </span>
              <div className="flex items-center space-x-2">
                <span className="text-stone-400">₹</span>
                <input
                  type="number"
                  min="0"
                  step="500"
                  value={food}
                  onChange={(e) => handleItemChange('food', Number(e.target.value))}
                  className="w-28 px-2 py-1 rounded border border-stone-300 font-bold text-ink-900 text-xs text-right focus:ring-1 focus:ring-champagne-500"
                />
              </div>
            </div>
            <input
              type="range"
              min="5000"
              max="80000"
              step="500"
              value={food}
              onChange={(e) => handleItemChange('food', Number(e.target.value))}
              className="w-full accent-champagne-600"
            />
            <p className="text-[11px] text-stone-500">
              Calculation: ~₹900–₹1,200 per person/day across authentic local establishments and tea stops.
            </p>
          </div>

          {/* Local Transport */}
          <div className="space-y-2 p-3 rounded-xl hover:bg-stone-50/60 transition-colors">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
              <span className="font-bold text-ink-900">
                5. Dedicated Private Vehicle & Regional Transfers
              </span>
              <div className="flex items-center space-x-2">
                <span className="text-stone-400">₹</span>
                <input
                  type="number"
                  min="0"
                  step="500"
                  value={localTransport}
                  onChange={(e) => handleItemChange('local', Number(e.target.value))}
                  className="w-28 px-2 py-1 rounded border border-stone-300 font-bold text-ink-900 text-xs text-right focus:ring-1 focus:ring-champagne-500"
                />
              </div>
            </div>
            <input
              type="range"
              min="5000"
              max="50000"
              step="500"
              value={localTransport}
              onChange={(e) => handleItemChange('local', Number(e.target.value))}
              className="w-full accent-champagne-600"
            />
            <p className="text-[11px] text-stone-500">
              Includes dedicated private cab for {duration} days plus regional highway tolls and local transfer permits.
            </p>
          </div>

          {/* Sightseeing, Entry Passes & Activities */}
          <div className="space-y-2 p-3 rounded-xl hover:bg-stone-50/60 transition-colors">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
              <span className="font-bold text-ink-900">
                6. Sightseeing, Landmark Admissions & Rides
              </span>
              <div className="flex items-center space-x-2">
                <span className="text-stone-400">₹</span>
                <input
                  type="number"
                  min="0"
                  step="200"
                  value={sightseeing}
                  onChange={(e) => handleItemChange('sightseeing', Number(e.target.value))}
                  className="w-28 px-2 py-1 rounded border border-stone-300 font-bold text-ink-900 text-xs text-right focus:ring-1 focus:ring-champagne-500"
                />
              </div>
            </div>
            <input
              type="range"
              min="1000"
              max="30000"
              step="200"
              value={sightseeing}
              onChange={(e) => handleItemChange('sightseeing', Number(e.target.value))}
              className="w-full accent-champagne-600"
            />
            <p className="text-[11px] text-stone-500">
              Includes scheduled monument tickets, boat/cable car rides, national park permits, and local attractions.
            </p>
          </div>

          {/* Shopping & Incidentals */}
          <div className="space-y-2 p-3 rounded-xl hover:bg-stone-50/60 transition-colors">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
              <span className="font-bold text-ink-900">
                7. Local Crafts, Souvenirs & Small Incidentals
              </span>
              <div className="flex items-center space-x-2">
                <span className="text-stone-400">₹</span>
                <input
                  type="number"
                  min="0"
                  step="500"
                  value={shopping}
                  onChange={(e) => handleItemChange('shopping', Number(e.target.value))}
                  className="w-28 px-2 py-1 rounded border border-stone-300 font-bold text-ink-900 text-xs text-right focus:ring-1 focus:ring-champagne-500"
                />
              </div>
            </div>
            <input
              type="range"
              min="0"
              max="40000"
              step="500"
              value={shopping}
              onChange={(e) => handleItemChange('shopping', Number(e.target.value))}
              className="w-full accent-champagne-600"
            />
          </div>

          {/* Contingency Buffer */}
          <div className="p-4 rounded-xl bg-stone-50 border border-stone-200 flex items-center justify-between text-xs">
            <div>
              <span className="font-bold text-ink-900 block">
                8. Emergency Contingency Reserve (7%)
              </span>
              <span className="text-[11px] text-stone-500">
                Kept aside for local road conditions, weather variations, or minor incidentals.
              </span>
            </div>
            <span className="font-serif text-base font-bold text-stone-700">
              ₹{budget.contingencyBuffer.toLocaleString('en-IN')}
            </span>
          </div>
        </div>
      </div>

      {/* Explicit Assumptions Card */}
      <div className="bg-white rounded-2xl border border-stone-250 p-6 sm:p-8 shadow-soft">
        <h4 className="font-serif text-base font-bold text-ink-950 mb-3 flex items-center space-x-2">
          <Info className="w-4 h-4 text-champagne-600" />
          <span>Underlying Calculation Assumptions</span>
        </h4>
        <ul className="space-y-2 text-xs text-stone-600">
          {budget.assumptions.map((assump, idx) => (
            <li key={idx} className="flex items-start space-x-2">
              <span className="text-champagne-600 font-bold">•</span>
              <span>{assump}</span>
            </li>
          ))}
        </ul>
        <div className="mt-4 pt-4 border-t border-stone-200 text-[11px] text-stone-500 italic">
          Disclaimer: All figures are transparent planning estimates based on curated regional vendor benchmarks. Rates are subject to seasonal surge, demand peaks, and official government revisions. WAYFARER does not collect payments or guarantee commercial pricing.
        </div>
      </div>
    </div>
  );
};
