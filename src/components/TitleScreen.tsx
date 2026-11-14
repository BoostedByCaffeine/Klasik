import React, { useEffect, useId, useState } from 'react';

/**
 * 100% Offline-Independent Inline "BOOSTED BY CAFFEINE" Studio Vector Logo (`studiologo.svg`).
 * Embedded directly in the JS bundle (zero external network fetches) so it renders razor-sharp
 * across cold offline PWA launches and Android APK (TWA) builds.
 */
export const StudioLogoSvg: React.FC<{ className?: string }> = ({
  className = 'h-10 w-auto object-contain',
}) => {
  const rawId = useId();
  const safeId = rawId.replace(/[^a-zA-Z0-9_-]/g, '');
  const clip0 = `studiologo-clip0-${safeId}`;
  const clip1 = `studiologo-clip1-${safeId}`;

  return (
    <svg
      width="644"
      height="188"
      viewBox="0 0 644 188"
      fill="none"
      className={className}
      role="img"
      aria-label="Boosted By Caffeine"
      xmlns="http://www.w3.org/2000/svg"
    >
      <g clipPath={`url(#${clip0})`}>
        <path
          d="M157 2H604C617.807 2 629 13.1929 629 27V126H157V2Z"
          fill="#242B2E"
        />
        <path
          d="M171 20.6513H204.85C218.06 20.6513 225.491 27.2562 225.491 39.6404V46.2454C225.491 54.5015 221.363 59.4552 213.932 61.9321C222.188 64.4089 227.142 70.1882 227.142 80.0956V87.5261C227.142 100.736 218.886 108.166 204.85 108.166H171V20.6513ZM189.164 34.6868V56.1527H200.722C204.85 56.1527 207.327 53.6759 207.327 49.5478V41.2917C207.327 37.1636 204.85 34.6868 200.722 34.6868H189.164ZM189.164 70.1882V94.131H201.548C206.501 94.131 208.978 91.6542 208.978 86.7005V77.6187C208.978 72.665 206.501 70.1882 201.548 70.1882H189.164Z"
          fillRule="evenodd"
          clipRule="evenodd"
          fill="white"
        />
        <path
          d="M238.7 40.466C238.7 26.4305 247.782 19 265.946 19C284.109 19 293.191 26.4305 293.191 40.466V88.3517C293.191 102.387 284.109 109.818 265.946 109.818C247.782 109.818 238.7 102.387 238.7 88.3517V40.466ZM256.864 39.6404V89.1773C256.864 93.3053 260.166 95.7822 265.946 95.7822C271.725 95.7822 275.028 93.3053 275.028 89.1773V39.6404C275.028 35.5123 271.725 33.0355 265.946 33.0355C260.166 33.0355 256.864 35.5123 256.864 39.6404Z"
          fillRule="evenodd"
          clipRule="evenodd"
          fill="white"
        />
        <path
          d="M306.401 40.466C306.401 26.4305 315.483 19 333.646 19C351.81 19 360.891 26.4305 360.891 40.466V88.3517C360.891 102.387 351.81 109.818 333.646 109.818C315.483 109.818 306.401 102.387 306.401 88.3517V40.466ZM324.564 39.6404V89.1773C324.564 93.3053 327.867 95.7822 333.646 95.7822C339.425 95.7822 342.728 93.3053 342.728 89.1773V39.6404C342.728 35.5123 339.425 33.0355 333.646 33.0355C327.867 33.0355 324.564 35.5123 324.564 39.6404Z"
          fillRule="evenodd"
          clipRule="evenodd"
          fill="white"
        />
        <path
          d="M373.276 80.9211H391.439V89.1773C391.439 93.3053 394.742 95.7822 399.695 95.7822C404.649 95.7822 407.952 93.3053 407.952 89.1773V80.0955C407.952 75.1418 404.649 72.665 395.567 69.3625L387.311 66.0601C377.404 61.932 373.276 55.3271 373.276 43.7684V38.8148C373.276 25.6049 382.357 19 399.695 19C417.033 19 425.289 25.6049 425.289 39.6404V46.2453H407.126V38.8148C407.126 34.6867 404.649 33.0355 399.695 33.0355C394.742 33.0355 391.439 34.6867 391.439 38.8148V44.5941C391.439 48.7221 394.742 51.199 402.998 54.5014L411.254 57.8039C421.987 61.932 426.115 68.5369 426.115 80.0955V88.3517C426.115 102.387 417.033 109.818 399.695 109.818C381.532 109.818 373.276 102.387 373.276 87.526V80.9211Z"
          fill="white"
        />
        <path
          d="M434.371 20.6512H487.211V35.5123H469.873V108.166H451.709V35.5123H434.371V20.6512Z"
          fill="white"
        />
        <path
          d="M498.769 20.6512H545.829V35.5123H516.933V56.1526H540.05V71.0137H516.933V93.3053H545.829V108.166H498.769V20.6512Z"
          fill="white"
        />
        <path
          d="M558.213 20.6512H587.936C606.099 20.6512 615.181 28.0818 615.181 42.1172V86.7004C615.181 100.736 606.099 108.166 587.936 108.166H558.213V20.6512ZM576.377 35.5123V93.3054H587.11C593.715 93.3054 597.017 90.8285 597.017 85.8748V42.9428C597.017 37.9892 593.715 35.5123 587.11 35.5123H576.377Z"
          fillRule="evenodd"
          clipRule="evenodd"
          fill="white"
        />
        <rect width="158" height="186" transform="translate(-1 2)" fill="white" />
        <g clipPath={`url(#${clip1})`}>
          <rect x="6" y="22" width="145" height="145" rx="72.5" fill="#242B2E" />
          <path
            d="M120.575 80.7552H129.604C143.557 80.7552 151.764 86.965 150.944 95.7622C150.123 104.559 138.632 111.287 123.037 112.322H116.471L118.934 105.077H123.037C132.887 105.077 139.453 100.937 140.274 95.7622C141.094 90.5874 135.349 87.4825 127.141 87.4825H118.934L120.575 80.7552Z"
            fill="white"
          />
          <path
            d="M65.5832 61.6084C68.8663 55.9161 56.5547 51.2588 57.3755 43.4966C58.1962 36.7693 67.2247 33.1469 69.6871 28.4896C68.8663 34.6994 64.7624 37.8042 65.5832 42.4616C67.2247 48.6714 77.8948 52.8112 73.7909 59.5385C72.1494 62.1259 68.0455 63.1609 65.5832 61.6084Z"
            fill="white"
          />
          <path
            d="M82.8196 60.056C89.3858 52.2937 70.508 43.4965 72.1495 32.6294C73.7911 23.8322 84.4611 19.1748 88.565 14C86.1027 21.7622 81.178 26.4196 82.8196 32.6294C84.4611 40.3916 99.235 46.0839 94.3104 55.3986C91.8481 59.021 86.1027 61.0909 82.8196 60.056Z"
            fill="white"
          />
          <path
            d="M30.29 75.5803C30.29 64.7131 123.858 64.7131 123.858 75.5803C123.858 97.3145 117.292 120.084 100.877 133.021L98.4143 136.126C96.7727 138.713 92.6688 140.266 86.9234 140.266H67.2249C61.4794 140.266 57.3756 138.713 55.734 136.126L53.2717 133.021C36.8562 120.084 30.29 97.3145 30.29 75.5803ZM77.0741 70.4055C52.4509 70.4055 38.4978 72.9929 38.4978 76.3565C38.4978 79.7201 52.4509 82.3076 77.0741 82.3076C101.697 82.3076 115.65 79.7201 115.65 76.3565C115.65 72.9929 101.697 70.4055 77.0741 70.4055ZM39.3185 85.9299C39.3185 100.937 45.064 116.979 57.3756 128.881L59.0171 127.329C49.9886 115.944 46.7055 101.454 46.7055 87.9999L39.3185 85.9299Z"
            fillRule="evenodd"
            clipRule="evenodd"
            fill="white"
          />
          <path
            d="M30.29 112.839C15.5161 120.084 11.4122 131.468 13.8745 143.888H22.0823C26.1861 136.126 34.3939 129.916 45.8847 127.846C38.4977 123.706 33.5731 118.531 30.29 112.839Z"
            fill="white"
          />
          <path
            d="M123.858 112.839C138.632 120.084 142.736 131.468 140.274 143.888H132.066C127.962 136.126 119.754 129.916 108.264 127.846C115.651 123.706 120.575 118.531 123.858 112.839Z"
            fill="white"
          />
          <path
            d="M71.3286 142.336C64.7624 145.958 63.9416 152.168 68.8663 157.86L69.6871 155.273L77.074 162L84.461 155.273L85.2818 157.86C90.2064 152.168 89.3856 145.958 82.8194 142.336C84.461 146.475 81.9987 150.098 77.074 152.685C72.1494 150.098 69.6871 146.475 71.3286 142.336Z"
            fill="white"
          />
        </g>
        <path
          d="M149 126H629V163C629 176.807 617.807 188 604 188H149V126Z"
          fill="white"
        />
        <path
          d="M164 133.659H182.111C187.874 133.659 191.99 136.128 191.99 141.068C191.99 144.361 189.52 146.83 186.227 148.065C190.343 149.3 192.813 152.181 192.813 156.297C192.813 161.648 188.697 164.941 182.111 164.941H164V133.659ZM170.586 139.01V146.419H180.465C183.346 146.419 184.992 144.772 184.992 142.714C184.992 140.656 183.346 139.01 180.465 139.01H170.586ZM170.586 151.358V159.59H181.288C184.169 159.59 185.816 157.944 185.816 155.474C185.816 153.005 184.169 151.358 181.288 151.358H170.586Z"
          fillRule="evenodd"
          clipRule="evenodd"
          fill="#242B2E"
        />
        <path
          d="M206.808 133.659H214.629L222.861 146.419L231.093 133.659H238.914L226.154 152.593V164.941H219.568V152.593L206.808 133.659Z"
          fill="#242B2E"
        />
        <path
          d="M306.831 143.126H299.422C297.775 140.244 294.894 139.01 291.189 139.01C285.427 139.01 281.722 143.126 281.722 149.3C281.722 155.474 285.427 159.59 291.189 159.59C294.894 159.59 297.775 158.356 299.422 155.474H306.831C304.773 161.648 299.01 165.6 291.189 165.6C281.311 165.6 274.725 159.014 274.725 149.3C274.725 139.586 281.311 133 291.189 133C299.01 133 304.773 136.952 306.831 143.126Z"
          fill="#242B2E"
        />
        <path
          d="M334.821 133.659H341.407L354.99 164.941H347.581L344.699 157.944H331.528L328.646 164.941H321.237L334.821 133.659ZM338.114 141.479L333.586 152.593H342.641L338.114 141.479Z"
          fillRule="evenodd"
          clipRule="evenodd"
          fill="#242B2E"
        />
        <path
          d="M371.455 133.659H396.151V139.421H378.04V146.83H393.682V152.593H378.04V164.941H371.455V133.659Z"
          fill="#242B2E"
        />
        <path
          d="M413.439 133.659H438.136V139.421H420.025V146.83H435.667V152.593H420.025V164.941H413.439V133.659Z"
          fill="#242B2E"
        />
        <path
          d="M455.424 133.659H480.944V139.421H462.01V146.419H478.475V152.181H462.01V159.179H480.944V164.941H455.424V133.659Z"
          fill="#242B2E"
        />
        <path
          d="M500.702 133.659H507.288V164.941H500.702V133.659Z"
          fill="#242B2E"
        />
        <path
          d="M528.692 133.659H535.278L551.742 154.239V133.659H558.328V164.941H551.742L535.278 144.361V164.941H528.692V133.659Z"
          fill="#242B2E"
        />
        <path
          d="M579.732 133.659H605.252V139.421H586.318V146.419H602.783V152.181H586.318V159.179H605.252V164.941H579.732V133.659Z"
          fill="#242B2E"
        />
      </g>
      <defs>
        <clipPath id={clip0}>
          <rect width="644" height="188" rx="25" fill="white" />
        </clipPath>
        <clipPath id={clip1}>
          <rect x="6" y="22" width="145" height="145" rx="72.5" fill="white" />
        </clipPath>
      </defs>
    </svg>
  );
};

interface BootScreenProps {
  onComplete: () => void;
}

/**
 * Centered GBA Boot / Loading Screen with an animated pixel espresso cup filling up,
 * a stepped pixel progress bar (0% to 100%), an offline cold-start initialization skeleton
 * checklist, and an inline studio credit, automatically transitioning to the Title Screen.
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

  const fillHeight = Math.round((progress / 100) * 26);

  const bootSubsystems = [
    { label: 'OFFLINE PIXEL FONTS (WOFF2)', readyAt: 20 },
    { label: 'CAFE SAVE LEDGER (V2)', readyAt: 50 },
    { label: '1990 MIATA MX-5 & GARDEN ENGINE', readyAt: 80 },
  ];

  return (
    <div
      data-testid="boot-loading-screen"
      onClick={onComplete}
      className="fixed inset-0 z-50 bg-[#090b10] flex flex-col items-center justify-center p-3 select-none cursor-pointer"
    >
      <div className="gba-frame px-5 py-4 max-w-sm w-full flex flex-col items-center gap-3 bg-[#12161f]">
        <div className="text-[9px] font-['Silkscreen'] font-bold text-[#94a3b8] tracking-widest uppercase">
          GBA CARTRIDGE COLD-START BOOT
        </div>

        {/* Animated Pixel Espresso Cup Filling Up */}
        <svg
          viewBox="0 0 80 68"
          className="w-16 h-14"
          role="img"
          aria-label="Animated Espresso Cup Filling"
        >
          {progress > 25 && (
            <g fill="#e2e8f0" opacity="0.85">
              <rect x="28" y={progress % 20 === 0 ? 4 : 6} width="4" height="6" />
              <rect x="38" y={progress % 20 === 0 ? 2 : 5} width="4" height="7" />
              <rect x="48" y={progress % 20 === 0 ? 5 : 3} width="4" height="6" />
            </g>
          )}

          {progress < 100 && (
            <g fill="#d97706">
              <rect x="38" y="12" width="4" height="6" />
              <rect x="38" y="20" width="4" height="5" />
            </g>
          )}

          <rect x="14" y="56" width="52" height="6" fill="#f8fafc" stroke="#090b0e" strokeWidth="2" />
          <rect x="20" y="24" width="36" height="32" fill="#dc2626" stroke="#f8fafc" strokeWidth="3" />
          <rect x="56" y="30" width="10" height="18" fill="none" stroke="#f8fafc" strokeWidth="3" />

          {fillHeight > 0 && (
            <g>
              <rect
                x="23"
                y={53 - fillHeight}
                width="30"
                height={fillHeight}
                fill="#451a03"
              />
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
        <div className="w-full" data-testid="boot-progress-bar">
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

        {/* Cold-Start Skeleton Status Checklist */}
        <div
          data-testid="boot-skeleton-status"
          className="w-full bg-[#090b0e] border border-[#334155] px-2.5 py-1.5 flex flex-col gap-1"
        >
          {bootSubsystems.map((sys) => {
            const ready = progress >= sys.readyAt;
            return (
              <div
                key={sys.label}
                className="flex items-center justify-between text-[8px] font-['Silkscreen']"
              >
                <span className={ready ? 'text-[#e2e8f0]' : 'text-[#64748b]'}>
                  {sys.label}
                </span>
                <span
                  className={`font-bold ${
                    ready ? 'text-[#4ade80]' : 'text-[#facc15] animate-pulse'
                  }`}
                >
                  {ready ? '✓ READY' : 'LOADING'}
                </span>
              </div>
            );
          })}
        </div>

        {/* Inline Studio Credit Footer */}
        <div
          data-testid="boot-studio-logo"
          className="pt-1 flex items-center justify-center gap-2 w-full"
        >
          <span className="text-[9px] font-['Silkscreen'] font-bold text-[#94a3b8]">
            By
          </span>
          <StudioLogoSvg className="h-8 w-auto object-contain" />
        </div>
      </div>
    </div>
  );
};

interface RotateLandscapeOverlayProps {
  onDismiss?: () => void;
}

/**
 * Full-Screen GBA Pixel Orientation Prompt shown when a mobile/touch device is held in portrait.
 */
export const RotateLandscapeOverlay: React.FC<RotateLandscapeOverlayProps> = ({
  onDismiss,
}) => {
  return (
    <div
      data-testid="rotate-landscape-overlay"
      className="fixed inset-0 z-[90] bg-[#090b10]/96 flex flex-col items-center justify-center p-5 select-none text-center"
    >
      <div className="gba-frame max-w-sm w-full px-5 py-5 bg-[#12161f] flex flex-col items-center gap-3.5">
        {/* Top Black-and-White Awning Trim */}
        <div className="w-full h-3 flex border-b-2 border-[#facc15] overflow-hidden">
          {Array.from({ length: 12 }).map((_, i) => (
            <div
              key={i}
              className={`flex-1 h-full ${i % 2 === 0 ? 'bg-[#f8fafc]' : 'bg-[#090b0e]'}`}
            />
          ))}
        </div>

        {/* Animated Pixel Phone Rotating to Landscape */}
        <div className="w-16 h-16 bg-[#090b0e] border-2 border-[#facc15] flex items-center justify-center">
          <svg
            viewBox="0 0 48 48"
            className="w-11 h-11 animate-pulse"
            role="img"
            aria-label="Rotate Device to Landscape"
          >
            {/* Landscape Phone Silhouette */}
            <rect x="6" y="14" width="36" height="20" fill="#1e293b" stroke="#f8fafc" strokeWidth="2" />
            <rect x="10" y="17" width="26" height="14" fill="#dc2626" />
            <rect x="38" y="21" width="2" height="6" fill="#facc15" />
            {/* Rotation Arrows */}
            <path d="M18 8 H30 L27 5 M30 8 L27 11" stroke="#facc15" strokeWidth="2" fill="none" />
            <path d="M30 40 H18 L21 37 M18 40 L21 43" stroke="#facc15" strokeWidth="2" fill="none" />
          </svg>
        </div>

        <h2 className="text-xs sm:text-sm font-['Press_Start_2P'] text-[#facc15] leading-relaxed">
          ↻ ROTATE DEVICE TO LANDSCAPE
        </h2>

        <p className="text-base font-['VT323'] text-[#e2e8f0] leading-snug">
          Klasik — Garage Garden Cafe plays best in landscape view
        </p>

        {onDismiss && (
          <button
            type="button"
            data-testid="dismiss-rotate-overlay-btn"
            onClick={onDismiss}
            className="gba-btn px-3 py-1.5 text-[9px] text-[#94a3b8] hover:text-[#f8fafc] cursor-pointer mt-1"
          >
            CONTINUE IN CURRENT VIEW
          </button>
        )}
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
 * Redesigned Landscape-Safe GBA Arcade Title Screen (`src/components/TitleScreen.tsx`)
 * over the live animated cafe & 1990 Mazda Miata MX-5 garage canvas.
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
      className="fixed inset-0 z-20 flex items-center justify-center p-2.5 pointer-events-none"
      style={{
        backgroundColor: 'rgba(7, 9, 14, 0.72)',
      }}
    >
      <div className="gba-frame pointer-events-auto w-full max-w-lg overflow-hidden flex flex-col items-center text-center bg-[#12161f]">
        {/* 1. Top Black-and-White Striped Cafe Awning Bar with Gold Pixel Trim */}
        <div className="w-full">
          <div className="w-full h-3.5 flex">
            {Array.from({ length: 16 }).map((_, idx) => (
              <div
                key={idx}
                className={`flex-1 h-full ${
                  idx % 2 === 0 ? 'bg-[#f8fafc]' : 'bg-[#090b0e]'
                }`}
              />
            ))}
          </div>
          <div className="w-full h-1 bg-[#facc15]" />
        </div>

        <div className="w-full px-5 py-3.5 flex flex-col items-center gap-2.5">
          {/* Pixel Daisy & 1990 Miata Red Badge Strip */}
          <div className="flex items-center justify-center gap-2 text-[9px] font-['Silkscreen'] font-bold text-[#cbd5e1]">
            <span className="text-[#facc15]">✿</span>
            <span>EST. 1990 · MX-5 GARAGE &amp; ESPRESSO BAR</span>
            <span className="text-[#facc15]">✿</span>
          </div>

          {/* 2. Main Title: KLASIK in 'Press Start 2P' (32px desktop / 24px mobile landscape) */}
          <h1
            className="text-[24px] sm:text-[32px] leading-none font-['Press_Start_2P'] text-[#f8fafc] tracking-wider"
            style={{ textShadow: '0 4px 0 #090b0e, 2px 2px 0 #dc2626' }}
          >
            KLASIK
          </h1>

          {/* 3. Subtitle Pill: Garage Garden Cafe in 'Silkscreen' (12px, #facc15 on #090b0e stepped pixel border) */}
          <div className="px-3.5 py-1 bg-[#090b0e] border-2 border-[#facc15] shadow-[0_2px_0_#000000]">
            <p className="text-[12px] font-['Silkscreen'] font-bold text-[#facc15] tracking-wide">
              Garage Garden Cafe
            </p>
          </div>

          {/* 4. Horizontal GBA Button Row: ► START SHIFT, 👤 CUSTOMIZE, and conditional 📲 INSTALL APP */}
          <div className="flex flex-wrap items-center justify-center gap-2.5 pt-1 w-full">
            <button
              type="button"
              data-start="true"
              onClick={(e) => {
                e.currentTarget.blur();
                onStart();
              }}
              className="gba-btn gba-btn-active min-h-[42px] sm:min-h-[38px] px-4 py-2 text-[10px] sm:text-xs font-bold cursor-pointer whitespace-nowrap shrink-0 flex items-center justify-center"
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
              className="gba-btn min-h-[42px] sm:min-h-[38px] px-3.5 py-2 text-[10px] sm:text-xs font-bold text-[#7dd3fc] cursor-pointer whitespace-nowrap shrink-0 flex items-center justify-center"
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
                className="gba-btn min-h-[42px] sm:min-h-[38px] px-3.5 py-2 text-[10px] sm:text-xs font-bold text-[#4ade80] cursor-pointer whitespace-nowrap shrink-0 flex items-center justify-center"
              >
                📲 INSTALL APP
              </button>
            )}
          </div>

          {/* 5. Bottom Studio Credit Footer displaying "By" immediately before Boosted By Caffeine logo */}
          <div
            id="studio-logo-slot"
            data-testid="studio-logo-slot"
            className="pt-2.5 mt-0.5 border-t-2 border-[#262f40] w-full flex items-center justify-center gap-2"
          >
            <span
              data-testid="studio-credit-by"
              className="text-[10px] font-['Silkscreen'] font-bold text-[#94a3b8] tracking-wider"
            >
              By
            </span>
            <StudioLogoSvg className="h-9 sm:h-10 w-auto object-contain" />
          </div>
        </div>
      </div>
    </div>
  );
};
