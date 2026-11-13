import React from 'react';

interface DailyGoalProgressBarProps {
  servedCount: number;
  dailyTarget: number;
  onFinishShift: () => void;
}

/**
 * Displays the customer service objective (`servedCount / dailyTarget`) as a crisp GBA
 * pixel-art progress bar inside the Top HUD.
 */
export const DailyGoalProgressBar: React.FC<DailyGoalProgressBarProps> = ({
  servedCount,
  dailyTarget,
  onFinishShift,
}) => {
  const safeTarget = Math.max(1, dailyTarget);
  const pct = Math.min(100, Math.round((servedCount / safeTarget) * 100));
  const isGoalReached = servedCount >= safeTarget;

  return (
    <div
      data-testid="daily-goal-progress"
      className="flex items-center gap-1.5"
      title={`Daily Customer Service Objective: ${servedCount}/${safeTarget} Guests Served (${pct}%)`}
    >
      <div className="flex flex-col gap-0.5">
        <div className="flex items-center justify-between gap-1.5">
          <span className="text-[7px] font-['Press_Start_2P'] text-[#94a3b8]">
            {isGoalReached ? '★ GOAL MET' : 'DAILY GOAL'}
          </span>
          <span
            data-testid="hud-served"
            className={`text-[9px] font-['Press_Start_2P'] tabular-nums ${
              isGoalReached ? 'text-[#fde047]' : 'text-[#f8fafc]'
            }`}
          >
            {Math.round(servedCount)}/{Math.round(safeTarget)}
          </span>
        </div>

        {/* Stepped 16-bit Pixel Progress Bar */}
        <div className="w-20 sm:w-24 h-2.5 bg-[#090b0e] border border-[#64748b] p-[1px] overflow-hidden">
          <div
            data-testid="daily-goal-fill"
            className={`h-full transition-all duration-200 ${
              isGoalReached ? 'bg-[#facc15]' : 'bg-[#22c55e]'
            }`}
            style={{ width: `${pct}%` }}
          />
        </div>
      </div>

      {isGoalReached && (
        <button
          type="button"
          data-testid="hud-finish-shift-btn"
          onClick={(e) => {
            e.currentTarget.blur();
            onFinishShift();
          }}
          className="gba-btn gba-btn-active px-1.5 py-1 text-[8px] cursor-pointer whitespace-nowrap shrink-0"
        >
          FINISH ★
        </button>
      )}
    </div>
  );
};

interface ShiftSuccessNotificationProps {
  visible: boolean;
  servedCount: number;
  dailyTarget: number;
  coins: number;
  cozyRating: number;
  onFinishShift: () => void;
  onDismiss: () => void;
}

/**
 * Displays a celebratory GBA Pokémon-styled "Shift Success" notification banner
 * when the daily customer service goal is reached.
 */
export const ShiftSuccessNotification: React.FC<ShiftSuccessNotificationProps> = ({
  visible,
  servedCount,
  dailyTarget,
  coins,
  cozyRating,
  onFinishShift,
  onDismiss,
}) => {
  if (!visible) return null;

  return (
    <div
      data-testid="shift-success-notification"
      role="status"
      aria-live="polite"
      className="pointer-events-auto absolute top-2.5 left-1/2 -translate-x-1/2 z-30 w-[92%] max-w-lg gba-frame px-3.5 py-2.5 bg-[#14532d] border-[#facc15] shadow-2xl flex flex-wrap items-center justify-between gap-2"
    >
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2">
          <span className="text-[10px] font-['Press_Start_2P'] text-[#fde047]">
            ★ SHIFT SUCCESS! ★
          </span>
          <span className="text-[8px] font-['Press_Start_2P'] px-1.5 py-0.5 bg-[#090b0e] text-[#86efac]">
            {servedCount}/{dailyTarget} SERVED
          </span>
        </div>
        <p className="text-base font-['VT323'] text-[#f8fafc] leading-tight mt-0.5">
          Daily customer service goal complete! Cozy Rating {Math.round(cozyRating)}% · ${Math.round(coins)} earned.
        </p>
      </div>

      <div className="flex items-center gap-1.5 shrink-0">
        <button
          type="button"
          onClick={(e) => {
            e.currentTarget.blur();
            onFinishShift();
          }}
          className="gba-btn gba-btn-active px-2.5 py-1.5 text-[8px] cursor-pointer whitespace-nowrap"
        >
          🏆 VIEW SUMMARY
        </button>
        <button
          type="button"
          onClick={(e) => {
            e.currentTarget.blur();
            onDismiss();
          }}
          className="gba-btn px-2 py-1.5 text-[8px] cursor-pointer whitespace-nowrap"
        >
          ✕ KEEP PLAYING
        </button>
      </div>
    </div>
  );
};
