import React from 'react';
import { DayItinerary, RegionalHub } from '../../types/travel';
import { ExternalLink, Compass, Car } from 'lucide-react';
import { buildRouteSequence } from '../itinerary/RouteSequence';

interface RouteMapViewProps {
  days: DayItinerary[];
  destinationName: string;
  regionalHubs?: RegionalHub[];
}

export const RouteMapView: React.FC<RouteMapViewProps> = ({
  days,
  destinationName,
  regionalHubs = [],
}) => {
  const routeStops = buildRouteSequence(days);
  const routeNames = routeStops.map((stop) => encodeURIComponent(stop.region));
  const mapsUrl =
    routeNames.length >= 2
      ? `https://www.google.com/maps/dir/${routeNames.join('/')}`
      : `https://www.google.com/maps/search/${encodeURIComponent(destinationName)}`;

  // SVG viewBox is 500 x 320. Convert 0-100 percentage coords to SVG coords.
  const toSvgX = (pct: number) => (pct / 100) * 500;
  const toSvgY = (pct: number) => (pct / 100) * 320;

  // Determine which hub is the base (first in list, or hub named like capital / base)
  const baseHub = regionalHubs[0];
  const satelliteHubs = regionalHubs.slice(1);

  return (
    <div className="space-y-8 font-sans">
      {/* Overview Banner */}
      <div className="bg-white rounded-2xl border border-stone-250 p-6 sm:p-8 shadow-soft">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold uppercase tracking-wider bg-champagne-100 text-champagne-800">
              GEOGRAPHICAL TOPOGRAPHY
            </span>
            <h2 className="font-serif text-2xl sm:text-3xl font-bold text-ink-950 mt-1">
              Route Sequence &amp; Regional Map
            </h2>
            <p className="text-xs sm:text-sm text-stone-600 mt-1 max-w-2xl">
              WAYFARER sequences your {destinationName} journey to minimise transfer strain and prevent unnecessary backtracking.
            </p>
          </div>

          <a
            href={mapsUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="px-4 py-2.5 rounded-xl bg-ink-900 text-ivory-50 hover:bg-ink-800 text-xs font-semibold flex items-center space-x-2 shrink-0 self-start"
          >
            <span>Open in Google Maps</span>
            <ExternalLink className="w-3.5 h-3.5 text-champagne-400" />
          </a>
        </div>
      </div>

      {/* SVG Map Illustration & Stop Sequence */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Schematic SVG Map Card */}
        <div className="lg:col-span-7 bg-white rounded-2xl border border-stone-250 p-6 shadow-soft">
          <div className="flex items-center justify-between border-b pb-3 mb-4">
            <h3 className="font-serif text-base font-bold text-ink-950">
              {destinationName} Topographic Diagram
            </h3>
            <span className="text-[11px] text-stone-500 font-medium">
              Curated Geographical Nodes
            </span>
          </div>

          {/* Stylized Dynamic SVG Map */}
          <div className="relative aspect-video w-full bg-stone-50 rounded-xl border border-stone-200 overflow-hidden flex items-center justify-center">
            {regionalHubs.length === 0 ? (
              <div className="text-xs text-stone-400 italic text-center p-8">
                <Compass className="w-8 h-8 mx-auto mb-2 text-stone-300" />
                Regional map will appear once destinations are configured.
              </div>
            ) : (
              <svg viewBox="0 0 500 320" className="w-full h-full">
                {/* Background topographic contour lines */}
                <path
                  d="M 10 280 Q 80 180 150 240 T 300 200 T 490 270"
                  fill="none"
                  stroke="#E2E0D8"
                  strokeWidth="1.5"
                  strokeDasharray="4 4"
                />
                <path
                  d="M 20 120 Q 120 40 220 80 T 380 40 T 480 100"
                  fill="none"
                  stroke="#E2E0D8"
                  strokeWidth="1.5"
                  strokeDasharray="4 4"
                />

                {/* Connecting route lines from base to each satellite hub */}
                {baseHub &&
                  satelliteHubs.map((hub) => (
                    <line
                      key={`line-${hub.name}`}
                      x1={toSvgX(baseHub.x)}
                      y1={toSvgY(baseHub.y)}
                      x2={toSvgX(hub.x)}
                      y2={toSvgY(hub.y)}
                      stroke="#C59A4E"
                      strokeWidth="2.5"
                      strokeDasharray="5 3"
                    />
                  ))}

                {/* Base Hub Node (larger, dark) */}
                {baseHub && (
                  <>
                    <circle
                      cx={toSvgX(baseHub.x)}
                      cy={toSvgY(baseHub.y)}
                      r="10"
                      fill="#0B1320"
                    />
                    <circle
                      cx={toSvgX(baseHub.x)}
                      cy={toSvgY(baseHub.y)}
                      r="16"
                      fill="none"
                      stroke="#0B1320"
                      strokeWidth="1"
                      strokeOpacity="0.3"
                    />
                    <text
                      x={toSvgX(baseHub.x)}
                      y={toSvgY(baseHub.y) + 26}
                      textAnchor="middle"
                      fontSize="12"
                      fontWeight="bold"
                      fill="#0B1320"
                    >
                      {baseHub.name} (Base)
                    </text>
                    {baseHub.altitude && (
                      <text
                        x={toSvgX(baseHub.x)}
                        y={toSvgY(baseHub.y) + 38}
                        textAnchor="middle"
                        fontSize="9"
                        fill="#78756E"
                      >
                        {baseHub.altitude}
                      </text>
                    )}
                  </>
                )}

                {/* Satellite Hub Nodes */}
                {satelliteHubs.map((hub, i) => {
                  const cx = toSvgX(hub.x);
                  const cy = toSvgY(hub.y);
                  // Offset label above or below depending on y position
                  const labelY = cy < 160 ? cy - 16 : cy + 20;
                  const altY = cy < 160 ? cy - 4 : cy + 32;
                  return (
                    <g key={hub.name}>
                      <circle cx={cx} cy={cy} r="7" fill={i % 2 === 0 ? '#C59A4E' : '#4E6B5B'} />
                      <text
                        x={cx}
                        y={labelY}
                        textAnchor="middle"
                        fontSize="11"
                        fontWeight="bold"
                        fill="#0B1320"
                      >
                        {hub.name}
                      </text>
                      {hub.altitude && (
                        <text
                          x={cx}
                          y={altY}
                          textAnchor="middle"
                          fontSize="9"
                          fill="#78756E"
                        >
                          {hub.altitude}
                        </text>
                      )}
                    </g>
                  );
                })}
              </svg>
            )}
          </div>

          <p className="text-[11px] text-stone-500 italic mt-3 text-center">
            * Schematic route overview. Lines indicate road/water corridors between regional hubs.
          </p>
        </div>

        {/* Right Column: Stop Sequence & Regional Hub Distances */}
        <div className="lg:col-span-5 space-y-4">
          <div className="bg-white rounded-2xl border border-stone-250 p-6 shadow-soft space-y-3">
            <h3 className="font-serif text-base font-bold text-ink-950 mb-2">
              Your Itinerary Route Sequence
            </h3>

            <div className="space-y-3">
              {routeStops.map((stop, index) => (
                <div key={`${stop.region}-${index}`} className="p-3 rounded-xl border border-stone-200 bg-stone-50/70 text-xs">
                  <div className="flex items-center justify-between font-bold text-ink-900 mb-0.5">
                    <span>STOP {String(index + 1).padStart(2, '0')} • {stop.region}</span>
                  </div>
                  {stop.summaries[0] && (
                    <p className="text-[11px] text-stone-600 line-clamp-2">{stop.summaries[0]}</p>
                  )}
                  {stop.transfer && (
                    <div className="mt-1.5 flex items-center space-x-1.5 text-[10px] font-semibold text-champagne-700 bg-champagne-100/60 px-2 py-0.5 rounded w-fit">
                      <Car className="w-3 h-3" />
                      <span>{stop.transfer.from} → {stop.transfer.to} · {stop.transfer.distanceKm} km</span>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Regional Hub Distances List */}
          {regionalHubs.length > 0 && (
            <div className="bg-white rounded-2xl border border-stone-250 p-6 shadow-soft space-y-3">
              <h4 className="font-serif text-base font-bold text-ink-950">
                Regional Corridor Distances
              </h4>
              <div className="space-y-2 text-xs text-stone-700">
                {regionalHubs.map((hub) => (
                  <div key={hub.name} className="flex items-center justify-between p-2 rounded-lg bg-stone-50">
                    <div>
                      <strong className="text-ink-900">{hub.name}</strong>
                      <span className="text-stone-500 text-[11px] block">{hub.driveTime}</span>
                    </div>
                    <a
                      href={hub.gmapsUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-champagne-700 hover:text-champagne-800 text-[11px] font-semibold flex items-center space-x-1"
                    >
                      <span>{hub.distanceFromBase}</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
