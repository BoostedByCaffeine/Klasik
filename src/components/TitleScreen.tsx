import React from 'react';

interface TitleScreenProps {
  onStart: () => void;
  onOpenCodeModal: () => void;
}

export const TitleScreen: React.FC<TitleScreenProps> = ({ onStart, onOpenCodeModal }) => {
  return (
    <div
      className="fixed inset-0 z-20 flex flex-col justify-between p-8 md:p-12 pointer-events-none"
      style={{
        background:
          'linear-gradient(90deg, rgba(11, 13, 18, 0.92) 0%, rgba(11, 13, 18, 0.72) 46%, rgba(11, 13, 18, 0.12) 100%)',
      }}
    >
      <div className="my-auto max-w-lg pointer-events-auto flex flex-col items-start gap-6">
        {/* Bespoke Inline SVG Monochrome & Gold GBA Garden Garage Cafe Emblem */}
        <svg
          viewBox="0 0 420 156"
          className="w-full max-w-[400px] drop-shadow-[0_6px_0_#050608]"
          role="img"
          aria-label="Klasik — Garden Garage Cafe"
        >
          {/* Outer Stepped GBA Pixel Plaque */}
          <rect
            x="6"
            y="8"
            width="408"
            height="140"
            fill="#0f1218"
            stroke="#f8fafc"
            strokeWidth="4"
          />
          <rect
            x="14"
            y="16"
            width="392"
            height="124"
            fill="#181c24"
            stroke="#475569"
            strokeWidth="3"
          />

          {/* Checkered Racing Flag Strip at Top */}
          {Array.from({ length: 18 }).map((_, i) => (
            <rect
              key={i}
              x={22 + i * 21}
              y={22}
              width={21}
              height={8}
              fill={i % 2 === 0 ? '#f8fafc' : '#090b0e'}
            />
          ))}

          {/* Left White & Gold Daisy Pixel Emblem */}
          <g transform="translate(52, 78)">
            <rect x="-4" y="-14" width="8" height="28" fill="#ffffff" />
            <rect x="-14" y="-4" width="28" height="8" fill="#ffffff" />
            <rect x="-10" y="-10" width="20" height="20" fill="#e2e8f0" />
            <rect x="-5" y="-5" width="10" height="10" fill="#eab308" />
          </g>

          {/* Right '90s Miata Pop-Up Headlight Silhouette Emblem */}
          <g transform="translate(366, 78)">
            <rect x="-18" y="-6" width="36" height="16" fill="#f8fafc" stroke="#090b0e" strokeWidth="2" />
            <rect x="-14" y="-14" width="10" height="8" fill="#facc15" stroke="#090b0e" strokeWidth="2" />
            <rect x="4" y="-14" width="10" height="8" fill="#facc15" stroke="#090b0e" strokeWidth="2" />
            <rect x="-10" y="4" width="20" height="3" fill="#090b0e" />
          </g>

          {/* Main Display Wordmark: KLASIK */}
          <text
            x="212"
            y="82"
            textAnchor="middle"
            fill="#050608"
            fontFamily='"Press Start 2P", monospace'
            fontSize="32"
            fontWeight="bold"
          >
            KLASIK
          </text>
          <text
            x="208"
            y="78"
            textAnchor="middle"
            fill="#f8fafc"
            fontFamily='"Press Start 2P", monospace'
            fontSize="32"
            fontWeight="bold"
          >
            KLASIK
          </text>

          {/* Subtitle Badge */}
          <rect
            x="64"
            y="98"
            width="292"
            height="26"
            fill="#090b0e"
            stroke="#facc15"
            strokeWidth="2"
          />
          <text
            x="210"
            y="115"
            textAnchor="middle"
            fill="#facc15"
            fontFamily='"Press Start 2P", monospace'
            fontSize="9"
            letterSpacing="1.2"
          >
            GARDEN GARAGE CAFE ★
          </text>
        </svg>

        {/* Pokémon GBA Stepped Dialogue Intro Box */}
        <div className="gba-dialogue-box px-4 py-3 max-w-md relative">
          <p className="text-xl leading-snug font-['VT323'] text-[#0f172a]">
            Welcome to KLASIK! Brew Midnight Cold Brews &amp; &apos;90s Miata Mochas, water the white daisies, flip the 1990 Miata MX-5 pop-up headlights, and pet Lilo &amp; Champy!
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-4 pt-1">
          <button
            type="button"
            data-start="true"
            onClick={(e) => {
              e.currentTarget.blur();
              onStart();
            }}
            className="gba-btn gba-btn-active px-6 py-3.5 text-xs cursor-pointer whitespace-nowrap shrink-0"
          >
            ► START SHIFT
          </button>

          <button
            type="button"
            onClick={(e) => {
              e.currentTarget.blur();
              onOpenCodeModal();
            }}
            className="gba-btn px-4 py-3.5 text-[10px] cursor-pointer whitespace-nowrap shrink-0"
          >
            SINGLE-FILE HTML
          </button>
        </div>
      </div>

      {/* Flat borderless control hint line */}
      <div className="text-xs font-['Press_Start_2P'] tracking-tight text-[#e2e8f0]">
        1-5 Brew · Space Cup · Enter Serve · W Water · H Headlights · C Pet Cats · P Pause
      </div>
    </div>
  );
};
