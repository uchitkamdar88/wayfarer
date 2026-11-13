import { GeneratedItinerary, AssistantMessage, DayItinerary, FoodPreference, DestinationBundle } from '../../types/travel';
import { getDestinationBundle } from '../../data/registry';
import { calculateTripBudget } from '../budget/calculator';

export interface AssistantResponse {
  message: AssistantMessage;
  updatedItinerary?: GeneratedItinerary;
  actionSummary?: string;
}

/**
 * Local Rule-Based NLP & Intent Recognition Engine for WAYFARER
 * Destination-Independent: resolves context from the active itinerary's destination bundle.
 */
export function processAssistantQuery(
  query: string,
  currentItinerary: GeneratedItinerary
): AssistantResponse {
  const normalized = query.toLowerCase().trim();
  const timestamp = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  const msgId = `msg-${Date.now()}`;

  const destId = currentItinerary.destination.id;
  const bundle = getDestinationBundle(destId);
  const destName = currentItinerary.destination.name;

  // Helper to clone itinerary
  const clone = (): GeneratedItinerary => JSON.parse(JSON.stringify(currentItinerary));

  // --- INTENT 1: Relax a specific Day or Whole Itinerary ---
  if (
    normalized.includes('relax') ||
    normalized.includes('too hectic') ||
    normalized.includes('slow down') ||
    normalized.includes('less rushed')
  ) {
    const dayMatch = normalized.match(/day\s*(\d+)/);
    const dayNum = dayMatch ? parseInt(dayMatch[1], 10) : 1;

    const updated = clone();
    const targetDayIndex = Math.max(0, Math.min(updated.days.length - 1, dayNum - 1));
    const targetDay = updated.days[targetDayIndex];

    if (targetDay.afternoon.length > 0) {
      targetDay.afternoon = [
        {
          id: `relax-${Date.now()}`,
          slot: 'afternoon',
          time: '02:00 PM – 04:30 PM',
          title: `Leisurely Afternoon & Scenic Break in ${targetDay.baseRegion}`,
          description: `Pace eased per your request. Take an unhurried rest, browse nearby artisan shops, and enjoy local refreshments amidst the scenery of ${targetDay.baseRegion}.`,
          durationText: '2.5 hours',
          tips: 'Pacing adjusted to Relaxed. No fixed ticket commitments.',
          image: targetDay.afternoon[0]?.image || targetDay.morning[0]?.image,
          mealSuggestion: targetDay.afternoon[0]?.mealSuggestion,
        },
      ];
    }

    updated.version += 1;
    return {
      message: {
        id: msgId,
        sender: 'assistant',
        text: `I’ve adjusted Day ${targetDay.dayNumber} (${targetDay.baseRegion}) to a more relaxed pace. Fast-paced sightseeing has been replaced with dedicated leisure time to savor local scenery and unhurried refreshments without rushing.`,
        timestamp,
        actionApplied: {
          type: 'relax_day',
          description: `Made Day ${targetDay.dayNumber} more relaxed with dedicated leisure time.`,
          dayNumber: targetDay.dayNumber,
        },
        suggestions: [
          'Undo this change',
          'Suggest pure vegetarian food options',
          'What should we pack for this season?',
        ],
      },
      updatedItinerary: updated,
      actionSummary: `Paced down Day ${targetDay.dayNumber} to relaxed mode.`,
    };
  }

  // --- INTENT 2: Pure Vegetarian / Jain Dining Focus ---
  if (
    normalized.includes('vegetarian') ||
    normalized.includes('pure veg') ||
    normalized.includes('jain') ||
    normalized.includes('vegan')
  ) {
    const isJain = normalized.includes('jain');
    const isVegan = normalized.includes('vegan');
    const newPref: FoodPreference = isJain ? 'jain' : isVegan ? 'vegan' : 'pure-veg';

    const updated = clone();
    updated.tripPreferences.foodPreference = newPref;

    // Filter pure veg / jain dining from bundle
    const diningPool = bundle?.dining || [];
    const vegSpots = diningPool.filter((d) => (isJain ? d.isPureVeg && d.isJainFriendly : d.isPureVeg));

    if (vegSpots.length > 0) {
      updated.days.forEach((day, idx) => {
        const regionSpots = vegSpots.filter((v) => v.region.toLowerCase() === day.baseRegion.toLowerCase());
        const spot = regionSpots[idx % Math.max(1, regionSpots.length)] || vegSpots[0];

        if (day.evening.length > 0) {
          day.evening[0].mealSuggestion = spot;
        }
        if (day.morning.length > 0 && day.morning[0].mealSuggestion) {
          day.morning[0].mealSuggestion = spot;
        }
      });
    }

    // Recalculate budget with pure-veg pricing
    updated.budgetBreakdown = calculateTripBudget(updated.tripPreferences, updated.selectedHotel, updated.days, bundle || undefined);
    updated.version += 1;

    const sampleVegSpots = vegSpots.slice(0, 2).map((s) => s.name).join(' and ');

    return {
      message: {
        id: msgId,
        sender: 'assistant',
        text: `I have updated your dining recommendations to **${
          isJain ? 'Strict Jain-Friendly (No Onion / No Garlic)' : isVegan ? 'Vegan' : 'Pure Vegetarian'
        }** for ${destName}. All days now feature verified pure-vegetarian establishments${
          sampleVegSpots ? ` such as **${sampleVegSpots}**` : ''
        }. Meal budgets have also been recalibrated.`,
        timestamp,
        actionApplied: {
          type: 'set_diet',
          description: `Updated all meal recommendations to verified ${newPref} options for ${destName}.`,
        },
        suggestions: [
          'What are the local food specialties?',
          'How can we reduce our trip budget?',
          'What should we pack for this journey?',
        ],
      },
      updatedItinerary: updated,
      actionSummary: `Updated food recommendations to ${newPref}.`,
    };
  }

  // --- INTENT 3: Budget Reduction ---
  if (
    normalized.includes('reduce') ||
    normalized.includes('budget') ||
    normalized.includes('expenses') ||
    normalized.includes('cheaper') ||
    normalized.includes('save money')
  ) {
    const currentTotal = currentItinerary.budgetBreakdown.totalEstimate;
    const sampleBudgetHotel = bundle?.hotels.find((h) => h.category === '3-star' || h.category === '4-star')?.name || 'curated 3-star properties';
    const sampleBudgetVegDining = bundle?.dining.find((d) => d.isPureVeg)?.name || 'local pure-vegetarian establishments';

    return {
      message: {
        id: msgId,
        sender: 'assistant',
        text: `Here is a transparent breakdown of where you can meaningfully reduce expenses for your journey to **${destName}** (current estimate: **₹${currentTotal.toLocaleString(
          'en-IN'
        )}**):

1. **Accommodation**: Switching from 5-star luxury to vetted 3-star/4-star properties (like *${sampleBudgetHotel}*) saves **₹10,000 – ₹25,000** over your stay.
2. **Transportation**: Book flights 45–60 days ahead. For regional sightseeing, utilize pre-booked private cabs or local state transport rather than on-demand private charters.
3. **Dining**: Eating at authentic local vegetarian institutions like *${sampleBudgetVegDining}* costs ~₹300–₹450 per meal per person compared to luxury hotel dining.
4. **Sightseeing Passes**: Book state tourism or national park permits directly through official government portals to avoid middleman agency markups.`,
        timestamp,
        suggestions: [
          'Switch to 3-star accommodation',
          'Make day 2 more relaxed',
          'Show packing checklist',
        ],
      },
    };
  }

  // --- INTENT 4: Weather / Seasonal Question ---
  if (
    normalized.includes('december') ||
    normalized.includes('winter') ||
    normalized.includes('snow') ||
    normalized.includes('rain') ||
    normalized.includes('monsoon') ||
    normalized.includes('weather') ||
    normalized.includes('worth visiting')
  ) {
    const season = bundle ? bundle.getSeasonForDate(currentItinerary.tripPreferences.departureDate) : currentItinerary.seasonalAdvice;

    // Check if user specifically asked about winter/december and this destination doesn't have snow (e.g. Kerala)
    const isDecemberQuery = normalized.includes('december') || normalized.includes('winter');

    let weatherText = '';
    if (isDecemberQuery && destId === 'kerala') {
      weatherText = `**Kerala in December / Winter:**
December is one of the absolute best months to visit Kerala! 
- **Climate:** Pleasantly warm, dry, and sunny with refreshing coastal breezes (22°C to 31°C).
- **Backwaters & Houseboats:** Waters along Vembanad Lake and Alleppey canals are mirror-calm.
- **Munnar Hills:** Crisp, cool evenings (12°C–16°C); light woollens are pleasant.
- **Zero Snow:** Kerala is tropical; no snow or winter road closures exist here.
- **Festivities:** Cochin Carnival and temple cultural pageants take place in late December.`;
    } else if (isDecemberQuery && destId === 'kashmir') {
      weatherText = `**Gulmarg & Kashmir in Winter (December – February):**
Gulmarg is a winter snowscape! It transforms into Asia's premier powder snow skiing hub.
- **Gondola Phase 2:** Operates with deep snow, touching 3,980m at Apharwat Peak.
- **Mandatory Snow Chains:** The Tangmarg to Gulmarg ascent requires iron snow chains on tyres.
- **Temperatures:** Plunge to -5°C to -10°C; heated rooms with central heating or bukharis are essential.
- **Clothing:** Heavy thermal base layers and waterproof down jackets (-10°C rated) are necessary.`;
    } else {
      weatherText = `**Weather Expectations for Your Journey in ${destName}:**
Your travel window falls in the **${season.seasonName}** period (${season.tagline}).
- **Expected Temperatures:** Typically between ${season.temperatureRangeCelsius.min}°C and ${season.temperatureRangeCelsius.max}°C.
- **Atmospheric Highlights:** ${season.weatherHighlights.slice(0, 2).join('. ')}.
- **Advisory:** ${season.roadAdvisories[0] || 'Check local weather advisories before mountain or coastal transfers.'}`;
    }

    return {
      message: {
        id: msgId,
        sender: 'assistant',
        text: weatherText,
        timestamp,
        suggestions: [
          'What should we pack for this journey?',
          'Suggest pure vegetarian food options',
          'Make day 1 more relaxed',
        ],
      },
    };
  }

  // --- INTENT 5: Packing & Essentials ---
  if (
    normalized.includes('carry') ||
    normalized.includes('pack') ||
    normalized.includes('clothing') ||
    normalized.includes('luggage')
  ) {
    const guide = bundle?.travelGuide || currentItinerary.travelGuide;
    const essentialItems = guide?.checklist
      .flatMap((c) => c.items)
      .filter((i) => i.isEssential)
      .slice(0, 5)
      .map((i) => `• **${i.label}**`)
      .join('\n') || '';

    const telecomTip = guide?.essentialDocuments.find((d) => d.title.toLowerCase().includes('sim') || d.title.toLowerCase().includes('connectivity'))?.detail || '';

    return {
      message: {
        id: msgId,
        sender: 'assistant',
        text: `**Essential Packing Guide for ${destName}:**

${essentialItems}

${telecomTip ? `**Important Connectivity Note:** ${telecomTip}` : ''}`,
        timestamp,
        suggestions: [
          'Is this itinerary too hectic?',
          'Suggest pure vegetarian food options',
          'How to reduce our travel expenses?',
        ],
      },
    };
  }

  // --- INTENT 6: Replace Activity ---
  if (normalized.includes('replace') || normalized.includes('change activity')) {
    const updated = clone();
    const day1 = updated.days[0];
    const region = day1?.baseRegion || '';
    const pool = bundle?.attractions.filter((a) => a.region.toLowerCase() === region.toLowerCase()) || [];

    // Find an attraction in this region not yet used in day 1
    const currentAttIds = new Set([
      ...day1.morning.map((a) => a.attractionId),
      ...day1.afternoon.map((a) => a.attractionId),
      ...day1.evening.map((a) => a.attractionId),
    ]);

    const substitute = pool.find((a) => !currentAttIds.has(a.id)) || pool[0];

    if (day1 && day1.evening.length > 0 && substitute) {
      day1.evening[0] = {
        id: `alt-eve-${Date.now()}`,
        slot: 'evening',
        time: '05:30 PM – 07:30 PM',
        attractionId: substitute.id,
        title: substitute.name,
        description: `Substituted as requested: ${substitute.shortDescription}`,
        durationText: '2 hours',
        tips: substitute.practicalTips,
        image: substitute.image,
        mealSuggestion: day1.evening[0].mealSuggestion,
      };
      updated.version += 1;
      return {
        message: {
          id: msgId,
          sender: 'assistant',
          text: `I’ve replaced the evening activity on Day 1 with a visit to **${substitute.name}** in ${region}.`,
          timestamp,
          actionApplied: {
            type: 'replace_activity',
            description: `Replaced Day 1 evening activity with ${substitute.name}.`,
            dayNumber: 1,
          },
          suggestions: ['Undo this change', 'Make day 2 more relaxed', 'Suggest vegetarian food options'],
        },
        updatedItinerary: updated,
        actionSummary: `Replaced Day 1 evening activity with ${substitute.name}.`,
      };
    }
  }

  // --- INTENT 7: Add Tea / Coffee Break ---
  if (
    normalized.includes('tea') ||
    normalized.includes('coffee') ||
    normalized.includes('kahwa') ||
    normalized.includes('snack') ||
    normalized.includes('chai')
  ) {
    const dayMatch = normalized.match(/day\s*(\d+)/);
    const dayNum = dayMatch ? parseInt(dayMatch[1], 10) : 1;
    const updated = clone();
    const targetDayIndex = Math.max(0, Math.min(updated.days.length - 1, dayNum - 1));
    const targetDay = updated.days[targetDayIndex];

    const teaBreakItem = {
      id: `tea-${Date.now()}`,
      slot: 'afternoon' as const,
      time: 'Afternoon Break',
      locationType: 'base' as const,
      title: `Regional Refreshment & Tea Break in ${targetDay.baseRegion}`,
      description: `Pause for authentic hot regional tea, saffron Kahwa, or spiced snacks at a scenic viewpoint in ${targetDay.baseRegion}.`,
      durationText: '45 mins',
      tips: 'Enjoy a leisurely pause to absorb the local surroundings.',
    };

    targetDay.afternoon.push(teaBreakItem);
    updated.version += 1;

    return {
      message: {
        id: msgId,
        sender: 'assistant',
        text: `I’ve added a scenic regional tea and refreshments break to **Day ${targetDay.dayNumber} (${targetDay.baseRegion})**. Take an unhurried pause to savor local flavors.`,
        timestamp,
        actionApplied: {
          type: 'relax_day',
          description: `Added afternoon tea break to Day ${targetDay.dayNumber}.`,
          dayNumber: targetDay.dayNumber,
        },
        suggestions: ['Make day 2 more relaxed', 'Suggest pure vegetarian food options', 'Undo this change'],
      },
      updatedItinerary: updated,
      actionSummary: `Added afternoon tea break to Day ${targetDay.dayNumber}.`,
    };
  }

  // --- INTENT 8: Remove Attraction ---
  if (normalized.includes('remove') || normalized.includes('delete') || normalized.includes('drop')) {
    const updated = clone();
    let removedName = '';
    let found = false;

    for (const d of updated.days) {
      for (const slotKey of ['morning', 'afternoon', 'evening'] as const) {
        const idx = d[slotKey].findIndex((act) =>
          normalized.includes(act.title.toLowerCase()) ||
          (act.attractionId && normalized.includes(act.attractionId.replace(/-/g, ' ')))
        );
        if (idx >= 0) {
          removedName = d[slotKey][idx].title;
          d[slotKey].splice(idx, 1);
          found = true;
          break;
        }
      }
      if (found) break;
    }

    if (found) {
      updated.version += 1;
      return {
        message: {
          id: msgId,
          sender: 'assistant',
          text: `Removed **${removedName}** from your schedule. Times and route sequences have been adjusted.`,
          timestamp,
          suggestions: ['Undo this change', 'Suggest alternative activities', 'Make day more relaxed'],
        },
        updatedItinerary: updated,
        actionSummary: `Removed ${removedName} from schedule.`,
      };
    }
  }

  // --- FALLBACK / GENERAL QUERY ---
  return {
    message: {
      id: msgId,
      sender: 'assistant',
      text: `I understand you’re asking about "${query}". As WAYFARER's local travel companion for **${destName}**, I can help tailor your schedule, answer seasonal climate questions, adjust your travel pace, or recommend verified pure-vegetarian food.

You can try asking:
- *"Suggest pure vegetarian food options"*
- *"Make day 2 more relaxed"*
- *"How can we reduce our travel expenses?"*
- *"What should we pack in our luggage?"*
- *"What are the weather expectations for this trip?"*`,
      timestamp,
      suggestions: [
        'Suggest pure vegetarian food options',
        'Make day 2 more relaxed',
        'How can we reduce our travel expenses?',
        'What should we pack in our luggage?',
      ],
    },
  };
}
