import React from 'react';
import { GeneratedItinerary, DayItinerary, ActivitySlot } from '../../types/travel';
import { CompassLogo } from '../../components/common/CompassLogo';

interface PrintItineraryDocumentProps {
  itinerary: GeneratedItinerary;
}

/** Render one activity slot as a compact inline row for print */
function PrintActivityRow({ activity }: { activity: ActivitySlot }) {
  const slotLabel =
    activity.slot === 'morning' ? '☀ Morning' : activity.slot === 'afternoon' ? '◑ Afternoon' : '☽ Evening';

  return (
    <div className="mb-2 pl-3 border-l-2 border-stone-200">
      <div className="flex items-start gap-2">
        <span className="text-[9px] font-bold uppercase tracking-wider text-champagne-600 whitespace-nowrap mt-0.5 w-16 shrink-0">
          {slotLabel}
        </span>
        <div className="flex-1 min-w-0">
          <span className="text-xs font-semibold text-ink-900">{activity.title}</span>
          {activity.isOptional && (
            <span className="ml-1 text-[9px] text-stone-400 italic">(optional)</span>
          )}
          {activity.durationText && (
            <span className="ml-2 text-[9px] text-stone-500">{activity.durationText}</span>
          )}
          {activity.description && (
            <p className="text-[10px] text-stone-600 leading-relaxed mt-0.5 line-clamp-2">{activity.description}</p>
          )}
          {activity.mealSuggestion && (
            <p className="text-[9px] text-sage-700 mt-0.5">
              <strong>Dining:</strong> {activity.mealSuggestion.name} — {activity.mealSuggestion.cuisineType}
              {activity.mealSuggestion.pureVegHighlights && (
                <span className="text-sage-600"> · {activity.mealSuggestion.pureVegHighlights.split('.')[0]}</span>
              )}
            </p>
          )}
          {activity.tips && (
            <p className="text-[9px] text-stone-500 italic mt-0.5">ℹ {activity.tips}</p>
          )}
          {activity.transferInfo && (
            <p className="text-[9px] text-champagne-700 font-medium mt-0.5">🚗 {activity.transferInfo}</p>
          )}
        </div>
      </div>
    </div>
  );
}

/** Render one day as a compact print card */
function PrintDayCard({ day }: { day: DayItinerary }) {
  const allActivities: ActivitySlot[] = [...day.morning, ...day.afternoon, ...day.evening];
  if (allActivities.length === 0) return null;

  return (
    <div className="avoid-break border border-stone-200 rounded-lg p-4 mb-4">
      {/* Day Header */}
      <div className="flex items-start gap-3 pb-2 mb-3 border-b border-stone-200">
        <div className="shrink-0">
          <span className="inline-flex items-center justify-center w-7 h-7 rounded-full bg-ink-900 text-ivory-50 text-[10px] font-bold">
            {day.dayNumber}
          </span>
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <h3 className="font-serif text-sm font-bold text-ink-900">{day.title}</h3>
            <span className="text-[9px] font-semibold uppercase tracking-wider text-champagne-600 bg-champagne-50 border border-champagne-200 rounded-full px-2 py-0.5">
              {day.baseRegion}
            </span>
            {day.overnightLocation && (
              <span className="text-[9px] text-stone-500">
                Overnight: {day.overnightLocation}
              </span>
            )}
          </div>
          {day.formattedDate && (
            <p className="text-[9px] text-stone-500 mt-0.5">{day.formattedDate}</p>
          )}
          {day.travelInfo && (
            <p className="text-[9px] font-medium text-champagne-700 mt-0.5">✈ {day.travelInfo}</p>
          )}
        </div>
        <div className="text-right shrink-0">
          <span className="text-[9px] text-stone-400">Est.</span>
          <p className="text-xs font-bold text-ink-900">₹{day.dailyEstimatedCostInr.toLocaleString('en-IN')}</p>
        </div>
      </div>

      {/* Transfer Banner */}
      {day.transferBetweenRegions && (
        <div className="text-[9px] text-stone-700 bg-champagne-50 border border-champagne-200 rounded p-2 mb-3">
          <strong>Road Transfer:</strong> {day.transferBetweenRegions.from} → {day.transferBetweenRegions.to}
          {day.transferBetweenRegions.distanceKm > 0 && ` · ${day.transferBetweenRegions.distanceKm} km · ~${day.transferBetweenRegions.durationHours} hrs`}
          {day.transferBetweenRegions.scenicHighlight && (
            <span className="block mt-0.5 italic">{day.transferBetweenRegions.scenicHighlight}</span>
          )}
          {day.transferBetweenRegions.roadNotes && (
            <span className="block mt-0.5 text-champagne-700">Advisory: {day.transferBetweenRegions.roadNotes}</span>
          )}
        </div>
      )}

      {/* Activities */}
      <div className="space-y-1">
        {allActivities.map((act) => (
          <PrintActivityRow key={act.id} activity={act} />
        ))}
      </div>

      {/* Seasonal Note */}
      {day.seasonalNotes && (
        <p className="mt-2 text-[9px] text-sage-700 italic border-t border-stone-100 pt-2">
          🌤 {day.seasonalNotes}
        </p>
      )}
    </div>
  );
}

export const PrintItineraryDocument: React.FC<PrintItineraryDocumentProps> = ({ itinerary }) => {
  const { tripPreferences, destination, days, selectedHotel, budgetBreakdown, seasonalAdvice, travelGuide } = itinerary;
  const totalGuests = (tripPreferences.travellers.adults || 2) + (tripPreferences.travellers.children || 0);

  // Build ordered region sequence (deduplicated consecutive)
  const regionSequence: string[] = [];
  days.forEach((d) => {
    const last = regionSequence[regionSequence.length - 1];
    if (last !== d.baseRegion) regionSequence.push(d.baseRegion);
  });

  return (
    <div className="print-only font-sans text-ink-900 bg-white">

      {/* ═══════════════════ PAGE 1: EDITORIAL COVER ═══════════════════ */}
      <div className="page-break-after p-10" style={{ minHeight: '250mm' }}>

        {/* Top Header Bar */}
        <div className="flex items-center justify-between border-b border-stone-300 pb-5 mb-8">
          <div className="flex items-center space-x-3">
            <CompassLogo className="w-9 h-9 text-champagne-500" />
            <div>
              <span className="font-serif text-xl font-bold tracking-widest text-ink-900">WAYFARER</span>
              <p className="text-[9px] tracking-wider uppercase text-stone-500">Every journey deserves a story.</p>
            </div>
          </div>
          <div className="text-right text-[10px] text-stone-500">
            <p className="font-semibold text-ink-800 uppercase tracking-wider">Personal Travel Itinerary</p>
            <p>Generated: {new Date(itinerary.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</p>
          </div>
        </div>

        {/* Hero Photo */}
        <div className="relative rounded-lg overflow-hidden border border-stone-200 mb-7" style={{ height: '220px' }}>
          <img
            src={destination.heroImage}
            alt={destination.name}
            className="w-full h-full object-cover"
            onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-ink-950/85 via-ink-900/20 to-transparent flex flex-col justify-end p-7">
            <span className="text-[9px] uppercase tracking-widest text-champagne-300 font-semibold mb-1">
              {destination.state}, {destination.country}
            </span>
            <h1 className="font-serif text-3xl font-bold text-white mb-1">{destination.name}</h1>
            <p className="text-xs text-stone-200 max-w-xl">{destination.tagline}</p>
          </div>
        </div>

        {/* Summary Stats Grid */}
        <div className="grid grid-cols-4 gap-4 bg-stone-50 border border-stone-200 rounded-lg p-5 mb-7">
          <div>
            <p className="text-[9px] uppercase font-semibold text-stone-500 tracking-wider">Travel Window</p>
            <p className="text-xs font-bold text-ink-900 mt-1">{tripPreferences.durationDays} Days / {tripPreferences.durationDays - 1} Nights</p>
            <p className="text-[10px] text-stone-600">{days[0]?.formattedDate} – {days[days.length - 1]?.formattedDate}</p>
          </div>
          <div>
            <p className="text-[9px] uppercase font-semibold text-stone-500 tracking-wider">Party Size</p>
            <p className="text-xs font-bold text-ink-900 mt-1">{totalGuests} Travellers</p>
            <p className="text-[10px] text-stone-600">{tripPreferences.travellers.adults} Adults, {tripPreferences.travellers.children} Children</p>
          </div>
          <div>
            <p className="text-[9px] uppercase font-semibold text-stone-500 tracking-wider">Pace & Diet</p>
            <p className="text-xs font-bold text-ink-900 mt-1 capitalize">{tripPreferences.travelPace} Pace</p>
            <p className="text-[10px] text-stone-600 capitalize">{tripPreferences.foodPreference} Dining</p>
          </div>
          <div>
            <p className="text-[9px] uppercase font-semibold text-stone-500 tracking-wider">Estimated Budget</p>
            <p className="text-xs font-bold text-champagne-600 mt-1">₹{budgetBreakdown.totalEstimate.toLocaleString('en-IN')}</p>
            <p className="text-[10px] text-stone-600">~₹{budgetBreakdown.perPersonEstimate.toLocaleString('en-IN')} / person</p>
          </div>
        </div>

        {/* Route Sequence */}
        <div className="mb-7">
          <p className="text-[9px] uppercase font-bold tracking-widest text-stone-500 mb-2">Suggested Route Sequence</p>
          <div className="flex flex-wrap items-center gap-y-1">
            {regionSequence.map((region, idx) => (
              <span key={`${region}-${idx}`} className="flex items-center">
                <span className="text-[10px] font-semibold bg-ink-900 text-ivory-50 rounded-full px-2.5 py-1">{region}</span>
                {idx < regionSequence.length - 1 && (
                  <span className="text-stone-400 mx-1.5 text-[10px]">→</span>
                )}
              </span>
            ))}
          </div>
        </div>

        {/* Transport Overview */}
        <div className="grid grid-cols-2 gap-4 mb-7">
          <div className="border border-stone-200 rounded-lg p-4 bg-stone-50">
            <span className="text-[9px] uppercase tracking-wider font-bold text-champagne-600">Onward Journey</span>
            <h4 className="font-serif text-sm font-bold text-ink-900 mt-1 capitalize">By {tripPreferences.onwardTransport.mode}</h4>
            <div className="mt-2 space-y-1 text-[10px] text-stone-700">
              <p><strong>From:</strong> {tripPreferences.onwardTransport.departureLocation || 'Origin'}</p>
              <p><strong>To:</strong> {tripPreferences.onwardTransport.arrivalLocation || `${destination.name}`}</p>
              <p><strong>Status:</strong> {tripPreferences.onwardTransport.isBooked ? 'Confirmed' : 'Needs Booking'}</p>
            </div>
          </div>
          <div className="border border-stone-200 rounded-lg p-4 bg-stone-50">
            <span className="text-[9px] uppercase tracking-wider font-bold text-champagne-600">Return Journey</span>
            <h4 className="font-serif text-sm font-bold text-ink-900 mt-1 capitalize">By {tripPreferences.returnTransport.mode}</h4>
            <div className="mt-2 space-y-1 text-[10px] text-stone-700">
              <p><strong>From:</strong> {tripPreferences.returnTransport.departureLocation || `${destination.name}`}</p>
              <p><strong>To:</strong> {tripPreferences.returnTransport.arrivalLocation || 'Origin'}</p>
              <p><strong>Status:</strong> {tripPreferences.returnTransport.isBooked ? 'Confirmed' : 'Needs Booking'}</p>
            </div>
          </div>
        </div>

        {/* Hotel */}
        {selectedHotel && (
          <div className="border border-stone-200 rounded-lg p-4 mb-6">
            <div className="flex justify-between items-start">
              <div>
                <span className="text-[9px] uppercase tracking-wider font-bold text-champagne-600">Selected Accommodation</span>
                <h3 className="font-serif text-base font-bold text-ink-900 mt-0.5">{selectedHotel.name}</h3>
                <p className="text-[10px] text-stone-500">{selectedHotel.area} · {selectedHotel.category.toUpperCase()}</p>
              </div>
              <div className="text-right">
                <span className="text-sm font-bold text-ink-900">₹{selectedHotel.basePriceInr.toLocaleString('en-IN')}</span>
                <p className="text-[9px] text-stone-500">per night indicative</p>
              </div>
            </div>
            <div className="mt-2 grid grid-cols-3 gap-2 text-[9px] bg-stone-50 border border-stone-100 rounded p-2">
              <div><strong>Rooms:</strong> {tripPreferences.accommodation.roomsCount}</div>
              <div><strong>Tier:</strong> {tripPreferences.accommodation.roomQuality.toUpperCase()}</div>
              <div><strong>Web:</strong> {selectedHotel.officialUrl}</div>
            </div>
            <p className="text-[9px] text-stone-400 italic mt-2">{selectedHotel.verificationDisclaimer}</p>
          </div>
        )}

        {/* Seasonal Summary */}
        <div className="bg-sage-50 border border-sage-200 p-4 rounded-lg mb-6">
          <span className="text-[9px] uppercase tracking-wider font-bold text-sage-700">Seasonal Climate Intelligence</span>
          <h4 className="font-serif text-sm font-bold text-sage-900 mt-1">{seasonalAdvice.seasonName}</h4>
          <p className="text-[10px] text-sage-800 mt-1">{seasonalAdvice.tagline}</p>
          <div className="mt-2 grid grid-cols-2 gap-3 text-[10px] text-sage-900">
            <p><strong>Temperature:</strong> {seasonalAdvice.temperatureRangeCelsius.min}°C – {seasonalAdvice.temperatureRangeCelsius.max}°C</p>
            <p><strong>Snow Likelihood:</strong> {seasonalAdvice.snowfallLikelihood.toUpperCase()}</p>
          </div>
        </div>

        {/* Page Footer */}
        <div className="border-t border-stone-200 pt-3 flex items-center justify-between text-[9px] text-stone-400">
          <span>WAYFARER Curated Recommendation Engine</span>
          <span>Confidential Personal Travel Document</span>
          <span>Page 1</span>
        </div>
      </div>

      {/* ═══════════════════ PAGES 2+: DAY-BY-DAY ITINERARY ═══════════════════ */}
      <div className="page-break-before p-10">

        <div className="border-b-2 border-ink-900 pb-3 mb-6">
          <h2 className="font-serif text-xl font-bold text-ink-900">Day-by-Day Itinerary</h2>
          <p className="text-[10px] text-stone-500 mt-1">
            {destination.name} · {tripPreferences.durationDays} Days · Geographic Flow & Attraction Deduplication Applied
          </p>
        </div>

        {days.map((day) => (
          <PrintDayCard key={day.dayNumber} day={day} />
        ))}

        {/* Page Footer */}
        <div className="border-t border-stone-200 pt-3 flex items-center justify-between text-[9px] text-stone-400 mt-4">
          <span>WAYFARER — {destination.name} Itinerary</span>
          <span>Day-by-Day Schedule</span>
          <span>Page 2</span>
        </div>
      </div>

      {/* ═══════════════════ FINAL PAGE: BUDGET & PRACTICAL GUIDE ═══════════════════ */}
      <div className="page-break-before p-10">

        <div className="border-b border-stone-300 pb-3 mb-6 flex justify-between items-center">
          <h2 className="font-serif text-xl font-bold text-ink-900">Budget Breakdown & Practical Guidelines</h2>
          <span className="text-[9px] text-stone-400 uppercase tracking-wider">Financial Transparency</span>
        </div>

        {/* Budget Table */}
        <div className="border border-stone-300 rounded-lg overflow-hidden mb-7 avoid-break">
          <table className="w-full text-left text-[10px]">
            <thead className="bg-stone-100 border-b border-stone-300 font-semibold text-ink-900">
              <tr>
                <th className="p-3">Expense Category</th>
                <th className="p-3">Calculation Baseline</th>
                <th className="p-3 text-right">Estimated Cost (INR)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-200">
              <tr>
                <td className="p-3 font-medium">Onward & Return Transport</td>
                <td className="p-3 text-stone-600">{tripPreferences.onwardTransport.mode.toUpperCase()} transit for {totalGuests} guests</td>
                <td className="p-3 text-right font-medium">₹{(budgetBreakdown.onwardTransportEstimate + budgetBreakdown.returnTransportEstimate).toLocaleString('en-IN')}</td>
              </tr>
              <tr>
                <td className="p-3 font-medium">Accommodation{selectedHotel ? ` (${selectedHotel.name})` : ''}</td>
                <td className="p-3 text-stone-600">{tripPreferences.accommodation.roomsCount} room(s) × {tripPreferences.durationDays - 1} night(s)</td>
                <td className="p-3 text-right font-medium">₹{budgetBreakdown.accommodationEstimate.toLocaleString('en-IN')}</td>
              </tr>
              <tr>
                <td className="p-3 font-medium">Food & Dining</td>
                <td className="p-3 text-stone-600">{tripPreferences.foodPreference.toUpperCase()} curated dining</td>
                <td className="p-3 text-right font-medium">₹{budgetBreakdown.foodEstimate.toLocaleString('en-IN')}</td>
              </tr>
              <tr>
                <td className="p-3 font-medium">Local Transport & Excursions</td>
                <td className="p-3 text-stone-600">Private cab + local transfers</td>
                <td className="p-3 text-right font-medium">₹{budgetBreakdown.localTransportEstimate.toLocaleString('en-IN')}</td>
              </tr>
              <tr>
                <td className="p-3 font-medium">Sightseeing & Entry Fees</td>
                <td className="p-3 text-stone-600">Attractions, guided experiences & park entry</td>
                <td className="p-3 text-right font-medium">₹{budgetBreakdown.sightseeingEstimate.toLocaleString('en-IN')}</td>
              </tr>
              <tr>
                <td className="p-3 font-medium">Incidentals & Shopping</td>
                <td className="p-3 text-stone-600">Local artisanal shopping allowance</td>
                <td className="p-3 text-right font-medium">₹{budgetBreakdown.shoppingAndIncidentals.toLocaleString('en-IN')}</td>
              </tr>
              <tr>
                <td className="p-3 font-medium">Contingency Buffer</td>
                <td className="p-3 text-stone-600">{Math.round(budgetBreakdown.contingencyRate * 100)}% emergency reserve</td>
                <td className="p-3 text-right font-medium">₹{budgetBreakdown.contingencyBuffer.toLocaleString('en-IN')}</td>
              </tr>
              <tr className="bg-stone-50 font-bold text-sm text-ink-950">
                <td className="p-3" colSpan={2}>Total Estimated Group Outlay</td>
                <td className="p-3 text-right text-champagne-600">₹{budgetBreakdown.totalEstimate.toLocaleString('en-IN')}</td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Assumptions */}
        {budgetBreakdown.assumptions && budgetBreakdown.assumptions.length > 0 && (
          <div className="bg-stone-50 border border-stone-200 rounded-lg p-4 mb-6 avoid-break">
            <p className="text-[9px] uppercase font-bold tracking-wider text-stone-500 mb-2">Estimation Assumptions</p>
            <ul className="space-y-1">
              {budgetBreakdown.assumptions.map((a, i) => (
                <li key={i} className="text-[10px] text-stone-600 flex gap-2">
                  <span className="text-stone-400 shrink-0">•</span>
                  <span>{a}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Travel Guide Essentials */}
        {travelGuide?.essentialDocuments && travelGuide.essentialDocuments.length > 0 && (
          <div className="mb-6 avoid-break">
            <p className="text-[9px] uppercase font-bold tracking-wider text-stone-500 mb-2">Essential Documents & Rules</p>
            <div className="grid grid-cols-2 gap-3">
              {travelGuide.essentialDocuments.slice(0, 4).map((doc, i) => (
                <div key={i} className="p-3 border border-stone-200 rounded-lg bg-stone-50 text-[10px]">
                  <h5 className="font-bold text-ink-900 mb-1">{doc.isCritical ? '⚠ ' : ''}{doc.title}</h5>
                  <p className="text-stone-600 leading-relaxed">{doc.detail}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Local Transport Rules */}
        {travelGuide?.localTransportRules && travelGuide.localTransportRules.length > 0 && (
          <div className="mb-6 avoid-break">
            <p className="text-[9px] uppercase font-bold tracking-wider text-stone-500 mb-2">Local Transport Protocols</p>
            <div className="grid grid-cols-2 gap-3">
              {travelGuide.localTransportRules.slice(0, 2).map((rule, i) => (
                <div key={i} className="p-3 border border-stone-200 rounded-lg bg-stone-50 text-[10px]">
                  <h5 className="font-bold text-ink-900 mb-1">{rule.title}</h5>
                  <p className="text-stone-600 leading-relaxed">{rule.detail}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Disclaimer */}
        <div className="p-4 border border-stone-200 rounded-lg text-[9px] text-stone-500 avoid-break">
          <p className="font-semibold text-stone-600 mb-1">WAYFARER Travel Recommendation Disclaimer:</p>
          <p>
            This document is an independent, unbiased travel planning blueprint generated by WAYFARER. WAYFARER is not an online travel agency (OTA), booking platform, or tour operator. All hotel tariffs, entry fees, transport fares, and schedules are indicative only and subject to seasonal revisions and direct vendor policies. Please confirm all bookings directly with official service providers before departure.
          </p>
        </div>

        {/* Page Footer */}
        <div className="border-t border-stone-200 pt-3 mt-6 flex items-center justify-between text-[9px] text-stone-400">
          <span>WAYFARER · Every journey deserves a story.</span>
          <span>End of Itinerary — {destination.name}</span>
          <span>Page 3</span>
        </div>
      </div>

    </div>
  );
};
