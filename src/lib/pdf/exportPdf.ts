import { jsPDF } from 'jspdf';
import { GeneratedItinerary, DestinationBundle } from '../../types/travel';
import { getDestinationBundle } from '../../data/registry';
import { PALETTES, ArtKind } from '../../components/common/ScenicArt';

type RGB = [number, number, number];

const NAVY: RGB = [11, 19, 32];
const IVORY: RGB = [248, 246, 240];
const CHAMPAGNE: RGB = [197, 154, 78];
const SAGE: RGB = [78, 107, 91];
const INK: RGB = [32, 38, 46];
const MUTED: RGB = [102, 108, 116];
const RULE: RGB = [214, 208, 194];

const PAGE_W = 210;
const PAGE_H = 297;
const MARGIN = 18;
const CONTENT_W = PAGE_W - MARGIN * 2;

/**
 * Sanitizes unicode strings for standard Latin-1 PDF core fonts
 */
const safe = (s: string | undefined | null): string => {
  if (!s) return '';
  return s
    .replace(/₹/g, 'INR ')
    .replace(/→/g, ' to ')
    .replace(/[≈~]/g, '~')
    .replace(/[‘’]/g, "'")
    .replace(/[“”]/g, '"')
    .replace(/[–—]/g, '-')
    .replace(/…/g, '...')
    .replace(/°/g, ' deg ')
    .replace(/•/g, '- ')
    .replace(/[^\x20-\x7E\xA0-\xFF\n]/g, '');
};

const money = (n: number | undefined | null) =>
  'INR ' + Math.round(n || 0).toLocaleString('en-IN');

const hexToRgb = (h: string): RGB => [
  parseInt(h.slice(1, 3), 16),
  parseInt(h.slice(3, 5), 16),
  parseInt(h.slice(5, 7), 16),
];

function drawArt(doc: jsPDF, kind: ArtKind, x: number, y: number, w: number, h: number) {
  const p = PALETTES[kind] || PALETTES.lake;
  const fill = (c: string) => doc.setFillColor(...hexToRgb(c));

  fill(p.sky);
  doc.rect(x, y, w, h, 'F');

  fill(p.sun);
  doc.circle(x + w * 0.78, y + h * 0.25, h * 0.1, 'F');

  fill(p.far);
  doc.triangle(x, y + h * 0.7, x + w * 0.18, y + h * 0.3, x + w * 0.4, y + h * 0.7, 'F');
  doc.triangle(x + w * 0.25, y + h * 0.7, x + w * 0.48, y + h * 0.22, x + w * 0.72, y + h * 0.7, 'F');
  doc.triangle(x + w * 0.6, y + h * 0.7, x + w * 0.82, y + h * 0.38, x + w, y + h * 0.7, 'F');

  fill(p.near);
  doc.triangle(x, y + h, x + w * 0.22, y + h * 0.55, x + w * 0.55, y + h, 'F');
  doc.triangle(x + w * 0.4, y + h, x + w * 0.7, y + h * 0.5, x + w, y + h, 'F');

  if (kind === 'snow') {
    doc.setFillColor(255, 255, 255);
    doc.triangle(
      x + w * 0.48 - w * 0.04,
      y + h * 0.3,
      x + w * 0.48,
      y + h * 0.22,
      x + w * 0.48 + w * 0.04,
      y + h * 0.3,
      'F'
    );
  }

  fill(p.ground);
  doc.rect(x, y + h * 0.86, w, h * 0.14, 'F');
}

function drawCompass(doc: jsPDF, cx: number, cy: number, r: number, color: RGB, accent: RGB) {
  doc.setDrawColor(...color);
  doc.setLineWidth(0.6);
  doc.circle(cx, cy, r, 'S');

  doc.setFillColor(...color);
  doc.triangle(cx, cy - r * 0.9, cx + r * 0.27, cy, cx - r * 0.27, cy, 'F');
  doc.triangle(cx, cy + r * 0.9, cx + r * 0.27, cy, cx - r * 0.27, cy, 'F');

  doc.setFillColor(...accent);
  doc.triangle(cx, cy - r * 0.9, cx + r * 0.27, cy, cx - r * 0.27, cy, 'F');
}

/**
 * Builds and downloads a professional, multi-page vector travel blueprint PDF.
 */
export function generateProgrammaticPdf(itinerary: GeneratedItinerary): jsPDF {
  const doc = new jsPDF({ unit: 'mm', format: 'a4', compress: true });
  const prefs = itinerary.tripPreferences;
  const dest = itinerary.destination;
  const bundle = getDestinationBundle(dest.id);
  const budget = itinerary.budgetBreakdown;
  const totalGuests = (prefs.travellers.adults || 2) + (prefs.travellers.children || 0);

  let currentY = MARGIN;

  const txt = (
    s: string,
    o: {
      size?: number;
      bold?: boolean;
      color?: RGB;
      x?: number;
      w?: number;
      lh?: number;
      gap?: number;
      italic?: boolean;
      font?: 'helvetica' | 'times';
    } = {}
  ) => {
    const size = o.size ?? 10;
    const lh = o.lh ?? size * 0.42;
    doc.setFont(o.font ?? 'helvetica', o.bold ? 'bold' : o.italic ? 'italic' : 'normal');
    doc.setFontSize(size);
    doc.setTextColor(...(o.color ?? INK));
    const rows = doc.splitTextToSize(safe(s), o.w ?? CONTENT_W - ((o.x ?? MARGIN) - MARGIN)) as string[];
    for (const r of rows) {
      if (currentY + lh > PAGE_H - 20) {
        newPage();
      }
      doc.text(r, o.x ?? MARGIN, currentY);
      currentY += lh;
    }
    currentY += o.gap ?? 1.5;
  };

  const ensure = (h: number) => {
    if (currentY + h > PAGE_H - 20) newPage();
  };

  const newPage = () => {
    doc.addPage();
    currentY = MARGIN;
  };

  const drawRule = () => {
    doc.setDrawColor(...RULE);
    doc.setLineWidth(0.25);
    doc.line(MARGIN, currentY, PAGE_W - MARGIN, currentY);
    currentY += 4;
  };

  const heading = (title: string, subtitle?: string) => {
    ensure(26);
    txt(title, { size: 20, font: 'times', color: NAVY, gap: 1 });
    doc.setDrawColor(...CHAMPAGNE);
    doc.setLineWidth(0.8);
    doc.line(MARGIN, currentY, MARGIN + 24, currentY);
    currentY += 5;
    if (subtitle) txt(subtitle, { size: 9, color: MUTED, gap: 4 });
  };

  const subHeading = (title: string) => {
    ensure(14);
    currentY += 2;
    txt(title, { size: 12, font: 'times', bold: true, color: NAVY, gap: 1.5 });
  };

  const bullets = (items: string[]) => {
    items.forEach((item) => {
      ensure(8);
      doc.setFillColor(...CHAMPAGNE);
      doc.circle(MARGIN + 1.2, currentY - 1.2, 0.7, 'F');
      txt(item, { size: 9.5, x: MARGIN + 5, gap: 1.2 });
    });
  };

  /* ----------------------------------------------------
   * 1. COVER PAGE (FULL-BLEED BRAND BLUEPRINT)
   * ---------------------------------------------------- */
  doc.setFillColor(...NAVY);
  doc.rect(0, 0, PAGE_W, PAGE_H, 'F');

  drawCompass(doc, MARGIN + 8, 34, 8, IVORY, CHAMPAGNE);
  doc.setFont('times', 'normal');
  doc.setFontSize(26);
  doc.setTextColor(...IVORY);
  doc.text('WAYFARER', MARGIN + 22, 38, { charSpace: 1.6 });

  doc.setFont('helvetica', 'italic');
  doc.setFontSize(10);
  doc.setTextColor(...CHAMPAGNE);
  doc.text('Every journey deserves a story.', MARGIN + 22, 45);

  // Landscape Art based on destination
  const artKind: ArtKind =
    dest.id === 'kashmir'
      ? 'lake'
      : dest.id === 'kerala'
      ? 'coast'
      : dest.id === 'rajasthan'
      ? 'fort'
      : dest.id === 'himachal'
      ? 'snow'
      : dest.id === 'uttarakhand'
      ? 'river'
      : dest.id === 'mumbai'
      ? 'coast'
      : 'valley';

  drawArt(doc, artKind, MARGIN, 68, CONTENT_W, 105);

  doc.setFont('times', 'normal');
  doc.setFontSize(36);
  doc.setTextColor(...IVORY);
  doc.text(safe(`${dest.name}`), MARGIN, 196);

  doc.setFont('times', 'italic');
  doc.setFontSize(14);
  doc.setTextColor(...CHAMPAGNE);
  doc.text(safe(dest.tagline), MARGIN, 206);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(11);
  doc.setTextColor(...IVORY);
  doc.text(
    safe(
      `${prefs.durationDays} Days / ${prefs.durationDays - 1} Nights  |  ${prefs.departureDate} to ${prefs.returnDate}`
    ),
    MARGIN,
    220
  );
  doc.text(
    safe(
      `${prefs.travellers.adults} Adults${
        prefs.travellers.children ? `, ${prefs.travellers.children} Children` : ''
      }  |  ${prefs.accommodation.category.toUpperCase()} (${prefs.accommodation.roomQuality.toUpperCase()})  |  ${prefs.foodPreference.toUpperCase()}`
    ),
    MARGIN,
    227
  );

  doc.setFontSize(8.5);
  doc.setTextColor(...MUTED);
  doc.text('Original WAYFARER Vector Travel Blueprint  |  100% Client-Side Engine', MARGIN, PAGE_H - 14);

  /* ----------------------------------------------------
   * 2. TRIP OVERVIEW & BLUEPRINT SNAPSHOT
   * ---------------------------------------------------- */
  newPage();
  heading(
    'Trip Overview',
    'A summary snapshot of your travel parameters, regional routing, and benchmark accommodations.'
  );

  const facts: [string, string][] = [
    ['Destination', `${dest.name}, ${dest.country}`],
    [
      'Travel Dates',
      `${prefs.departureDate} to ${prefs.returnDate} (${prefs.durationDays} days, ${prefs.durationDays - 1} nights)`,
    ],
    [
      'Onward Transit',
      `By ${prefs.onwardTransport.mode.toUpperCase()} from ${prefs.onwardTransport.departureLocation || 'Home'} to ${
        prefs.onwardTransport.arrivalLocation || bundle?.defaultArrivalAirport
      }${prefs.onwardTransport.isBooked ? ' (marked as booked)' : ' (curated estimate)'}`,
    ],
    [
      'Return Transit',
      `By ${prefs.returnTransport.mode.toUpperCase()} from ${
        prefs.returnTransport.departureLocation || bundle?.defaultArrivalAirport
      } to ${prefs.returnTransport.arrivalLocation || 'Home'}`,
    ],
    [
      'Travellers',
      `${prefs.travellers.adults} Adults, ${prefs.travellers.children} Children (${prefs.travellers.groupType}, mobility: ${prefs.travellers.mobilityRequirements})`,
    ],
    [
      'Selected Property',
      itinerary.selectedHotel
        ? `${itinerary.selectedHotel.name} (${itinerary.selectedHotel.category.toUpperCase()}, ${itinerary.selectedHotel.region})`
        : 'Curated Verified Benchmark',
    ],
    [
      'Travel Rhythm & Food',
      `${prefs.travelPace.toUpperCase()} pace; Diet preference: ${prefs.foodPreference.toUpperCase()} (verified regional spots)`,
    ],
    [
      'Estimated Total',
      `${money(budget.totalEstimate)} (about ${money(budget.perPersonEstimate)} per person for ${totalGuests} guests)`,
    ],
  ];

  facts.forEach(([k, v]) => {
    ensure(9);
    const top = currentY;
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(9);
    doc.setTextColor(...MUTED);
    doc.text(safe(k), MARGIN, currentY);
    const save = currentY;
    txt(v, { x: MARGIN + 42, size: 9.5, gap: 2.2 });
    if (currentY === save) currentY = top + 6;
  });

  drawRule();
  subHeading('Seasonal Intelligence');
  txt(
    `${itinerary.seasonalAdvice.seasonName} (${itinerary.seasonalAdvice.tagline}): Expected temperatures ${itinerary.seasonalAdvice.temperatureRangeCelsius.min} deg C to ${itinerary.seasonalAdvice.temperatureRangeCelsius.max} deg C.`,
    { size: 9.5, gap: 2 }
  );
  if (itinerary.seasonalAdvice.roadAdvisories.length) {
    bullets(itinerary.seasonalAdvice.roadAdvisories);
  }

  /* ----------------------------------------------------
   * 3. DAY-BY-DAY ITINERARY SCHEDULE
   * ---------------------------------------------------- */
  itinerary.days.forEach((day) => {
    newPage();

    // Day Header Box
    doc.setFillColor(...NAVY);
    doc.rect(MARGIN, currentY, CONTENT_W, 26, 'F');
    drawArt(doc, artKind, MARGIN + CONTENT_W - 46, currentY, 46, 26);

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(8.5);
    doc.setTextColor(...CHAMPAGNE);
    doc.text(safe(`DAY ${String(day.dayNumber).padStart(2, '0')}  |  ${day.formattedDate}  |  ${day.baseRegion}`), MARGIN + 5, currentY + 7);

    doc.setFont('times', 'bold');
    doc.setFontSize(14);
    doc.setTextColor(...IVORY);
    (doc.splitTextToSize(safe(day.title), CONTENT_W - 52) as string[])
      .slice(0, 2)
      .forEach((r, i) => doc.text(r, MARGIN + 5, currentY + 15 + i * 5.5));

    currentY += 31;

    txt(day.summary, { size: 9.5, color: MUTED, italic: true, gap: 3 });

    if (day.travelInfo) {
      txt(`Transit: ${day.travelInfo}`, { size: 8.5, color: CHAMPAGNE, bold: true, gap: 2 });
    }

    // Morning, Afternoon, Evening Slots
    (['morning', 'afternoon', 'evening'] as const).forEach((slotKey) => {
      const activities = day[slotKey];
      if (!activities || !activities.length) return;

      ensure(16);
      txt(slotKey.toUpperCase(), {
        size: 10,
        font: 'times',
        bold: true,
        color: SAGE,
        gap: 1.5,
      });

      activities.forEach((act) => {
        ensure(16);
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(8.5);
        doc.setTextColor(...CHAMPAGNE);
        doc.text(safe(act.time || slotKey), MARGIN, currentY);

        const dur = act.durationText ? `  (${act.durationText})` : '';
        txt(act.title + dur, { x: MARGIN + 22, size: 9.5, bold: true, gap: 0.8 });

        if (act.description) {
          txt(act.description, { x: MARGIN + 22, size: 8.5, color: MUTED, gap: 1.8 });
        }
        if (act.tips) {
          txt(`Tip: ${act.tips}`, { x: MARGIN + 22, size: 8, italic: true, color: INK, gap: 1.8 });
        }
        if (act.mealSuggestion) {
          txt(
            `Dining Spotlight: ${act.mealSuggestion.name} (${act.mealSuggestion.cuisineType}) - ${act.mealSuggestion.description}`,
            { x: MARGIN + 22, size: 8, color: SAGE, gap: 1.8 }
          );
        }
      });
      currentY += 1.5;
    });

    if (day.seasonalNotes) {
      subHeading('Seasonal Climate Advisory');
      txt(day.seasonalNotes, { size: 8.5, color: MUTED });
    }
  });

  /* ----------------------------------------------------
   * 4. ACCOMMODATION BENCHMARKS
   * ---------------------------------------------------- */
  newPage();
  heading(
    'Curated Accommodation Benchmarks',
    'Transparent property details. Star categories and indicative prices are curated benchmarks. Always confirm availability directly with the property.'
  );

  itinerary.recommendedHotels.slice(0, 5).forEach((hotel) => {
    ensure(36);
    const isSelected = itinerary.selectedHotel ? hotel.id === itinerary.selectedHotel.id : false;
    const stayCost = hotel.basePriceInr * (prefs.durationDays - 1) * prefs.accommodation.roomsCount;

    doc.setDrawColor(...(isSelected ? CHAMPAGNE : RULE));
    doc.setLineWidth(isSelected ? 0.6 : 0.25);
    doc.rect(MARGIN, currentY - 1, CONTENT_W, 32);

    const top = currentY;
    drawArt(doc, 'garden', MARGIN + 1, currentY, 36, 30);
    currentY = top + 4;

    txt(`${hotel.name}${isSelected ? ' [SELECTED]' : ''}`, {
      x: MARGIN + 41,
      size: 11,
      font: 'times',
      bold: true,
      color: NAVY,
      gap: 0.8,
    });
    txt(
      `${hotel.region}  |  ${hotel.category.toUpperCase()} (${hotel.officialUrl ? 'Verified Link' : 'Unverified'})  |  ${
        hotel.amenities.slice(0, 3).join(', ')
      }`,
      { x: MARGIN + 41, size: 8, color: MUTED, gap: 0.8 }
    );
    txt(
      `Indicative: ${money(hotel.basePriceInr)} / room / night. Estimated stay (${
        prefs.durationDays - 1
      } nights): ${money(stayCost)}`,
      { x: MARGIN + 41, size: 8.5, bold: true, color: INK, gap: 0.8 }
    );
    txt(hotel.officialUrl ? `Official Portal: ${hotel.officialUrl}` : 'Official link: direct tourism directory.', {
      x: MARGIN + 41,
      size: 7.5,
      color: SAGE,
      gap: 0.8,
    });

    currentY = top + 35;
  });

  /* ----------------------------------------------------
   * 5. FINANCIAL BUDGET BLUEPRINT
   * ---------------------------------------------------- */
  newPage();
  heading(
    'Financial Budget Estimate',
    'Transparent breakdown derived from authentic local rates. Contingency buffer of 7% included.'
  );

  const colX = [MARGIN, MARGIN + 68, MARGIN + 105];
  doc.setFillColor(...NAVY);
  doc.rect(MARGIN, currentY, CONTENT_W, 8, 'F');
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9);
  doc.setTextColor(...IVORY);
  doc.text('Expense Category', colX[0] + 2, currentY + 5.4);
  doc.text('Amount (INR)', colX[1] + 2, currentY + 5.4);
  doc.text('Basis & Methodology', colX[2] + 2, currentY + 5.4);
  currentY += 8;

  const budgetLines = [
    {
      cat: 'Onward Transport',
      amt: budget.onwardTransportEstimate,
      basis: `${prefs.onwardTransport.mode.toUpperCase()} transit estimate for ${totalGuests} travellers`,
    },
    {
      cat: 'Return Transport',
      amt: budget.returnTransportEstimate,
      basis: `${prefs.returnTransport.mode.toUpperCase()} return transfer to home city`,
    },
    {
      cat: 'Accommodation',
      amt: budget.accommodationEstimate,
      basis: `${prefs.durationDays - 1} nights x ${prefs.accommodation.roomsCount} room(s) at ${
        itinerary.selectedHotel?.name || 'Curated Hotel'
      }`,
    },
    {
      cat: 'Food & Dining',
      amt: budget.foodEstimate,
      basis: `Curated ${prefs.foodPreference.toUpperCase()} meals across ${prefs.durationDays} days`,
    },
    {
      cat: 'Local Private Cab & Transfers',
      amt: budget.localTransportEstimate,
      basis: `Dedicated private cab and inter-region transfers`,
    },
    {
      cat: 'Sightseeing & Entry Permits',
      amt: budget.sightseeingEstimate,
      basis: `Scheduled landmark admissions, rides, and local passes`,
    },
    {
      cat: 'Shopping & Incidentals',
      amt: budget.shoppingAndIncidentals,
      basis: `Souvenirs, artisan crafts, and personal shopping buffer`,
    },
    {
      cat: 'Emergency Contingency (7%)',
      amt: budget.contingencyBuffer,
      basis: `Reserved buffer for weather adjustments and unexpected needs`,
    },
  ];

  budgetLines.forEach((l, i) => {
    ensure(12);
    const basisLines = doc.splitTextToSize(safe(l.basis), CONTENT_W - 105 - 4) as string[];
    const rowH = 8 + basisLines.length * 3.3;

    if (i % 2 === 0) {
      doc.setFillColor(...IVORY);
      doc.rect(MARGIN, currentY, CONTENT_W, rowH, 'F');
    }

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(8.5);
    doc.setTextColor(...INK);
    doc.text(safe(l.cat), colX[0] + 2, currentY + 5);

    doc.setFont('helvetica', 'normal');
    doc.text(money(l.amt), colX[1] + 2, currentY + 5);

    doc.setFontSize(7.5);
    doc.setTextColor(...MUTED);
    doc.text(basisLines, colX[2] + 2, currentY + 5);

    currentY += rowH + 2;
  });

  currentY += 2;
  doc.setDrawColor(...CHAMPAGNE);
  doc.setLineWidth(0.6);
  doc.line(MARGIN, currentY, PAGE_W - MARGIN, currentY);
  currentY += 6;

  txt(`Estimated Trip Total: ${money(budget.totalEstimate)}`, {
    size: 13,
    font: 'times',
    bold: true,
    color: NAVY,
  });
  txt(
    `Per Person: ${money(budget.perPersonEstimate)}   |   Daily Average: ${money(
      budget.dailyAverage
    )}   |   Travellers: ${totalGuests}`,
    { size: 9, color: MUTED }
  );

  if (prefs.targetBudget) {
    const diff = prefs.targetBudget - budget.totalEstimate;
    txt(
      `Your Target Budget: ${money(prefs.targetBudget)}. ${
        diff >= 0
          ? `Leaves ${money(diff)} buffer in hand.`
          : `Estimate is ${money(Math.abs(diff))} above target budget.`
      }`,
      { size: 9, bold: true, color: diff >= 0 ? SAGE : NAVY }
    );
  }

  /* ----------------------------------------------------
   * 6. PACKING LIST & PRACTICAL GUIDE
   * ---------------------------------------------------- */
  newPage();
  heading('Travel Guide & Packing Checklist', 'Essential guidelines and packing advice for your journey.');

  subHeading('Essential Documents');
  itinerary.travelGuide.essentialDocuments.forEach((docItem) => {
    txt(`${docItem.title}: ${docItem.detail}`, { size: 9, gap: 1.5 });
  });

  subHeading('Packing Checklist');
  itinerary.travelGuide.checklist.forEach((category) => {
    txt(category.category, { size: 9.5, bold: true, color: SAGE, gap: 1 });
    bullets(category.items.map((it) => it.label));
  });

  // Save the PDF
  const filename = `WAYFARER-${dest.id}-itinerary-${new Date().toISOString().split('T')[0]}.pdf`;
  doc.save(filename);

  return doc;
}
