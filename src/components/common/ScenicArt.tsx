import React, { useState } from 'react';

export type ArtKind =
  | 'lake'
  | 'garden'
  | 'temple'
  | 'market'
  | 'snow'
  | 'meadow'
  | 'valley'
  | 'river'
  | 'fort'
  | 'coast';

export const PALETTES: Record<
  ArtKind,
  { sky: string; far: string; near: string; ground: string; sun: string }
> = {
  lake: { sky: '#E9E4D6', far: '#9FB0B3', near: '#4F6F78', ground: '#2E4E5C', sun: '#C2A566' },
  garden: { sky: '#EDE8D8', far: '#A9B8A2', near: '#6F8F73', ground: '#486A55', sun: '#C2A566' },
  temple: { sky: '#E6E1D3', far: '#8E9FA8', near: '#5C6F7C', ground: '#3C4F5E', sun: '#C2A566' },
  market: { sky: '#E8E1D0', far: '#B8AD94', near: '#8C7F66', ground: '#5E5543', sun: '#C2A566' },
  snow: { sky: '#DCE5EA', far: '#B8C7D0', near: '#F4F6F6', ground: '#8FA3AF', sun: '#F0E3BB' },
  meadow: { sky: '#E4E9DB', far: '#97AE9A', near: '#7E9582', ground: '#587A62', sun: '#D6BE86' },
  valley: { sky: '#E1E7E3', far: '#7F9AA0', near: '#4F7364', ground: '#365648', sun: '#D6BE86' },
  river: { sky: '#E3E7E2', far: '#8FA6A6', near: '#587E78', ground: '#3C6165', sun: '#D6BE86' },
  fort: { sky: '#F1E8D8', far: '#C9A979', near: '#8E6738', ground: '#5A3F1F', sun: '#E5B869' },
  coast: { sky: '#D8EBF1', far: '#7BB3C4', near: '#327D94', ground: '#1A5364', sun: '#E8C56E' },
};

/**
 * Infer the best scenic illustration kind from place / activity titles
 */
export function inferScenicKind(label?: string): ArtKind {
  if (!label) return 'valley';
  const text = label.toLowerCase();
  if (text.includes('temple') || text.includes('monastery') || text.includes('church') || text.includes('shrine') || text.includes('mosque') || text.includes('cathedral')) return 'temple';
  if (text.includes('fort') || text.includes('palace') || text.includes('haveli') || text.includes('museum') || text.includes('gateway') || text.includes('caves')) return 'fort';
  if (text.includes('lake') || text.includes('dal') || text.includes('pichola') || text.includes('vembanad') || text.includes('water') || text.includes('pond')) return 'lake';
  if (text.includes('beach') || text.includes('coast') || text.includes('sea') || text.includes('marine') || text.includes('backwater') || text.includes('port') || text.includes('harbour') || text.includes('cove')) return 'coast';
  if (text.includes('river') || text.includes('ganga') || text.includes('teesta') || text.includes('periyar') || text.includes('ghat') || text.includes('stream')) return 'river';
  if (text.includes('snow') || text.includes('glacier') || text.includes('pass') || text.includes('ski') || text.includes('zero point') || text.includes('peak') || text.includes('himalaya')) return 'snow';
  if (text.includes('meadow') || text.includes('valley') || text.includes('tea') || text.includes('plantation') || text.includes('estate') || text.includes('bugyal') || text.includes('baisaran')) return 'meadow';
  if (text.includes('market') || text.includes('bazaar') || text.includes('bazar') || text.includes('street') || text.includes('transfer') || text.includes('station') || text.includes('airport')) return 'market';
  if (text.includes('garden') || text.includes('park') || text.includes('tulip') || text.includes('botanical') || text.includes('flora')) return 'garden';
  return 'valley';
}

interface ScenicArtProps {
  kind?: ArtKind;
  label?: string;
  className?: string;
  image?: string;
}

/**
 * Editorial vector artwork rendered when no photograph is available,
 * or as a stylized landscape banner with zero empty states.
 */
export const ScenicArt: React.FC<ScenicArtProps> = ({
  kind,
  label = 'Scenic Travel Landscape',
  className = '',
  image,
}) => {
  const [imgError, setImgError] = useState(false);
  const effectiveKind = kind || inferScenicKind(label);
  const p = PALETTES[effectiveKind] || PALETTES.valley;

  if (image && !imgError) {
    return (
      <img
        src={image}
        alt={label}
        loading="lazy"
        decoding="async"
        className={className}
        onError={() => setImgError(true)}
      />
    );
  }

  return (
    <svg
      className={className}
      viewBox="0 0 400 260"
      preserveAspectRatio="xMidYMid slice"
      role="img"
      aria-label={label}
    >
      <rect width="400" height="260" fill={p.sky} />
      <circle cx="312" cy="62" r="26" fill={p.sun} />
      {/* Distant mountain layer */}
      <path d="M0 170 L70 92 L120 142 L190 60 L260 150 L320 100 L400 170 V260 H0Z" fill={p.far} />
      {effectiveKind === 'snow' && (
        <path
          d="M190 60 L168 92 L184 86 L194 98 L206 84 L214 92Z M70 92 L56 110 L68 106 L78 114 L84 104Z"
          fill="#FFFFFF"
        />
      )}
      {/* Near hill layer */}
      <path d="M0 200 L90 138 L160 190 L240 128 L330 196 L400 150 V260 H0Z" fill={p.near} />

      {/* Foregrounds */}
      {effectiveKind === 'lake' && (
        <g>
          <rect y="196" width="400" height="64" fill={p.ground} />
          <path
            d="M60 222h80M180 236h120M120 248h60"
            stroke={p.sky}
            strokeWidth="2"
            strokeLinecap="round"
            opacity="0.6"
          />
          <path d="M250 208 q30 14 60 0 l-8 8 h-44z" fill={p.sun} />
        </g>
      )}

      {effectiveKind === 'river' && (
        <path d="M0 260 C90 215 150 238 230 214 S360 206 400 190 V260Z" fill={p.ground} />
      )}

      {effectiveKind === 'garden' && (
        <g>
          <rect y="212" width="400" height="48" fill={p.ground} />
          {[60, 140, 220, 300, 360].map((x) => (
            <g key={x}>
              <rect x={x - 2} y="196" width="4" height="22" fill="#3B3A2E" />
              <circle cx={x} cy="190" r="16" fill={p.near} />
            </g>
          ))}
        </g>
      )}

      {effectiveKind === 'temple' && (
        <g>
          <rect y="214" width="400" height="46" fill={p.ground} />
          <path d="M186 178 h28 v-14 h-6 v-10 l-8 -10 -8 10 v10 h-6z" fill={p.sky} />
        </g>
      )}

      {effectiveKind === 'fort' && (
        <g>
          <rect y="200" width="400" height="60" fill={p.ground} />
          <path
            d="M50 200 v-24 h14 v6 h8 v-6 h8 v6 h8 v-6 h14 v24z M280 200 v-24 h14 v6 h8 v-6 h8 v6 h8 v-6 h14 v24z"
            fill={p.near}
          />
        </g>
      )}

      {effectiveKind === 'coast' && (
        <g>
          <rect y="205" width="400" height="55" fill={p.ground} />
          <path
            d="M0 205 Q100 195 200 205 T400 205 V260 H0 Z"
            fill={p.near}
            opacity="0.8"
          />
        </g>
      )}

      {effectiveKind === 'market' && (
        <g>
          <rect y="206" width="400" height="54" fill={p.ground} />
          {[40, 140, 240, 320].map((x) => (
            <path key={x} d={`M${x} 206 v-34 q22 -22 44 0 v34z`} fill={p.sky} opacity="0.85" />
          ))}
        </g>
      )}

      {(effectiveKind === 'meadow' || effectiveKind === 'valley' || effectiveKind === 'snow') && (
        <path
          d="M0 224 C100 200 180 236 260 214 S360 206 400 218 V260 H0Z"
          fill={p.ground}
        />
      )}
      {(effectiveKind === 'valley' || effectiveKind === 'meadow') &&
        [30, 70, 350, 380].map((x) => (
          <path key={x} d={`M${x} 214 l10 -34 l10 34z`} fill="#2D4A3A" />
        ))}
    </svg>
  );
};

