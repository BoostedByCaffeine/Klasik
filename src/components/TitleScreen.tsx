import React, { useEffect, useState } from 'react';

interface BootScreenProps {
  onComplete: () => void;
}

/**
 * Centered GBA Boot / Loading Screen with an animated pixel espresso cup filling up,
 * a stepped pixel progress bar (0% to 100%), and a studio credit, automatically
 * transitioning to the Title Screen after 1.8 seconds.
 */
export const BootLoadingScreen: React.FC<BootScreenProps> = ({ onComplete }) => {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const start = performance.now();
    const duration = 1500;
    let rafId = 0;

    const step = (now: number) => {
      const elapsed = now - start;
      const pct = Math.min(100, Math.round((elapsed / duration) * 100));
      // Stepped GBA increments
      const steppedPct = Math.min(100, Math.floor(pct / 10) * 10);
      setProgress(pct >= 98 ? 100 : steppedPct);

      if (elapsed >= duration) {
        onComplete();
      } else {
        rafId = requestAnimationFrame(step);
      }
    };

    rafId = requestAnimationFrame(step);
    return () => cancelAnimationFrame(rafId);
  }, [onComplete]);

  // Fill level in the 16-bit espresso cup (0..26px)
  const fillHeight = Math.round((progress / 100) * 26);

  return (
    <div
      data-testid="boot-loading-screen"
      onClick={onComplete}
      className="fixed inset-0 z-50 bg-[#07090e] flex flex-col items-center justify-center p-4 select-none cursor-pointer"
    >
      <div className="gba-frame px-6 py-5 max-w-xs w-full flex flex-col items-center gap-3.5 bg-[#12161f]">
        <div className="text-[9px] font-['Silkscreen'] font-bold text-[#94a3b8] tracking-widest uppercase">
          GBA CARTRIDGE BOOT
        </div>

        {/* Animated Pixel Espresso Cup Filling Up */}
        <svg
          viewBox="0 0 80 68"
          className="w-20 h-16"
          role="img"
          aria-label="Animated Espresso Cup Filling"
        >
          {/* Rising Pixel Steam Wisps */}
          {progress > 25 && (
            <g fill="#e2e8f0" opacity="0.85">
              <rect x="28" y={progress % 20 === 0 ? 4 : 6} width="4" height="6" />
              <rect x="38" y={progress % 20 === 0 ? 2 : 5} width="4" height="7" />
              <rect x="48" y={progress % 20 === 0 ? 5 : 3} width="4" height="6" />
            </g>
          )}

          {/* Espresso Portafilter Spout Drops */}
          {progress < 100 && (
            <g fill="#d97706">
              <rect x="38" y="12" width="4" height="6" />
              <rect x="38" y="20" width="4" height="5" />
            </g>
          )}

          {/* Saucer Plate */}
          <rect x="14" y="56" width="52" height="6" fill="#f8fafc" stroke="#090b0e" strokeWidth="2" />

          {/* Cup Outer Body (Miata Red #dc2626) */}
          <rect x="20" y="24" width="36" height="32" fill="#dc2626" stroke="#f8fafc" strokeWidth="3" />

          {/* Cup Handle */}
          <rect x="56" y="30" width="10" height="18" fill="none" stroke="#f8fafc" strokeWidth="3" />

          {/* Animated Espresso & Crema Fill Inside Cup */}
          {fillHeight > 0 && (
            <g>
              <rect
                x="23"
                y={53 - fillHeight}
                width="30"
                height={fillHeight}
                fill="#451a03"
              />
              {/* Golden Crema Foam Top Layer */}
              <rect
                x="23"
                y={53 - fillHeight}
                width="30"
                height={Math.min(4, fillHeight)}
                fill="#facc15"
              />
            </g>
          )}
        </svg>

        {/* Stepped Pixel Progress Bar (0% to 100%) */}
        <div className="w-full">
          <div className="flex items-center justify-between text-[9px] font-['Silkscreen'] font-bold text-[#facc15] mb-1 tabular-nums">
            <span>BREWING ROM...</span>
            <span data-testid="boot-progress-pct">{progress}%</span>
          </div>
          <div className="w-full h-4 bg-[#090b0e] border-2 border-[#f8fafc] p-0.5 flex gap-0.5">
            {Array.from({ length: 10 }).map((_, idx) => {
              const active = progress >= (idx + 1) * 10;
              return (
                <div
                  key={idx}
                  className={`flex-1 h-full ${
                    active ? 'bg-[#facc15]' : 'bg-[#1e293b]'
                  }`}
                />
              );
            })}
          </div>
        </div>

        {/* Studio Logo */}
        <div
          data-testid="boot-studio-logo"
          className="pt-1 flex items-center justify-center w-full"
        >
          <img
            src="./assets/aistudio/studiologo_ccccb57c.svg"
            alt="BoostedByCaffeine Studios"
            className="h-9 w-auto object-contain"
          />
        </div>
      </div>
    </div>
  );
};

interface TitleScreenProps {
  onStart: () => void;
  onOpenCustomize: () => void;
  onInstallApp: () => void;
  isStandalone?: boolean;
}

/**
 * Minimalist Title Screen (No Paragraph Text) designed to never clip in mobile landscape (`100dvh`).
 * Contains ONLY:
 * 1. Main Title: `KLASIK`
 * 2. Subtitle: `Garage Garden Cafe`
 * 3. Action Buttons: `► START SHIFT`, `👤 CUSTOMIZE`, and (in web browser mode only) `📲 INSTALL APP`
 * 4. Bottom Studio Logo Slot: `<div id="studio-logo-slot">` displaying the BoostedByCaffeine Studios logo
 */
export const TitleScreen: React.FC<TitleScreenProps> = ({
  onStart,
  onOpenCustomize,
  onInstallApp,
  isStandalone = false,
}) => {
  return (
    <div
      data-testid="title-screen"
      className="fixed inset-0 z-20 flex items-center justify-center p-3 pointer-events-none"
      style={{
        background:
          'radial-gradient(circle at center, rgba(7, 9, 14, 0.78) 0%, rgba(7, 9, 14, 0.92) 100%)',
      }}
    >
      <div className="gba-frame pointer-events-auto w-full max-w-lg px-5 py-4 flex flex-col items-center text-center gap-3 bg-[#12161f]">
        {/* 1. Main Title: KLASIK */}
        <h1 className="text-3xl sm:text-4xl font-['Press_Start_2P'] text-[#f8fafc] tracking-wider drop-shadow-[0_4px_0_#090b0e]">
          KLASIK
        </h1>

        {/* 2. Subtitle: Garage Garden Cafe */}
        <p className="text-xs sm:text-sm font-['Silkscreen'] font-bold text-[#facc15] tracking-wide">
          Garage Garden Cafe
        </p>

        {/* 3. Action Buttons: ► START SHIFT, 👤 CUSTOMIZE, and (Web Browser only) 📲 INSTALL APP */}
        <div className="flex flex-wrap items-center justify-center gap-2.5 pt-1 w-full">
          <button
            type="button"
            data-start="true"
            onClick={(e) => {
              e.currentTarget.blur();
              onStart();
            }}
            className="gba-btn gba-btn-active px-4 py-2.5 text-[10px] sm:text-xs cursor-pointer whitespace-nowrap shrink-0"
          >
            ► START SHIFT
          </button>

          <button
            type="button"
            data-testid="title-customize-btn"
            onClick={(e) => {
              e.currentTarget.blur();
              onOpenCustomize();
            }}
            className="gba-btn px-3.5 py-2.5 text-[10px] sm:text-xs text-[#7dd3fc] cursor-pointer whitespace-nowrap shrink-0"
          >
            👤 CUSTOMIZE
          </button>

          {!isStandalone && (
            <button
              type="button"
              data-testid="title-install-app-btn"
              onClick={(e) => {
                e.currentTarget.blur();
                onInstallApp();
              }}
              className="gba-btn px-3.5 py-2.5 text-[10px] sm:text-xs text-[#4ade80] cursor-pointer whitespace-nowrap shrink-0"
            >
              📲 INSTALL APP
            </button>
          )}
        </div>

        {/* 4. Bottom Studio Logo Slot */}
        <div
          id="studio-logo-slot"
          data-testid="studio-logo-slot"
          className="pt-2.5 border-t-2 border-[#262f40] w-full flex items-center justify-center"
        >
          <img
            src="./assets/aistudio/studiologo_ccccb57c.svg"
            alt="BoostedByCaffeine Studios"
            className="h-10 sm:h-11 w-auto object-contain"
          />
        </div>
      </div>
    </div>
  );
};
