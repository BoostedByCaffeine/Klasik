import React from 'react';
import { Flame } from 'lucide-react';
import { BaristaOutfitOption } from '../game/rules';

export interface RunSummarySnapshot {
  dayNumber: number;
  dailyStreak: number;
  newlyUnlockedOutfits: BaristaOutfitOption[];
  servedCount: number;
  dailyTarget: number;
  cozyRating: number;
  bestCozyRating: number;
  hearts: number;
  coins: number;
}

interface StatusModalProps {
  mode: 'paused' | 'gameover';
  stats: RunSummarySnapshot;
  onResume: () => void;
  onRestart: () => void;
  onReturnTitle: () => void;
  onOpenCodeModal: () => void;
  onOpenCustomize?: () => void;
}

export const StatusModal: React.FC<StatusModalProps> = ({
  mode,
  stats,
  onResume,
  onRestart,
  onReturnTitle,
  onOpenCodeModal,
  onOpenCustomize,
}) => {
  const isShiftComplete = mode === 'gameover';

  return (
    <div
      data-testid="status-modal"
      className="fixed inset-0 z-30 flex items-center justify-center p-4"
      style={{ backgroundColor: 'rgba(9, 11, 14, 0.82)' }}
      role="dialog"
      aria-modal="true"
      aria-labelledby="status-modal-title"
    >
      <div className="gba-frame w-full max-w-md p-6 text-[#f8fafc] max-h-[94dvh] overflow-y-auto">
        <div className="text-[9px] font-['Press_Start_2P'] uppercase tracking-wider text-[#94a3b8] text-center">
          {isShiftComplete
            ? `DAY ${Math.round(stats.dayNumber)} GARAGE SHIFT COMPLETE`
            : 'KLASIK GARAGE PAUSED'}
        </div>

        <h2
          id="status-modal-title"
          className="mt-2 text-lg font-['Press_Start_2P'] text-center text-[#facc15]"
        >
          {isShiftComplete ? 'SHIFT COMPLETE!' : 'GARAGE BREAK'}
        </h2>

        <div className="gba-dialogue-box mt-3 px-3 py-2 text-center">
          <p className="text-lg font-['VT323'] leading-snug">
            {isShiftComplete
              ? 'Lilo & Champy curl up beside the 1990 Miata MX-5 as the garden lights glow.'
              : 'Take a breather! Check the Miata pop-up lights or pet Lilo & Champy.'}
          </p>
        </div>

        {/* 4 Tabular-Nums Stat Tiles */}
        <div className="mt-4 grid grid-cols-2 sm:grid-cols-4 gap-2.5">
          <div className="bg-[#0b0d12] border-2 border-[#475569] p-2.5 text-center">
            <div className="text-[7px] font-['Press_Start_2P'] uppercase text-[#94a3b8]">
              SERVED
            </div>
            <div className="mt-1.5 text-sm font-['Press_Start_2P'] text-[#f8fafc] tabular-nums">
              {Math.round(stats.servedCount)}
            </div>
          </div>

          <div className="bg-[#0b0d12] border-2 border-[#475569] p-2.5 text-center">
            <div className="text-[7px] font-['Press_Start_2P'] uppercase text-[#94a3b8]">
              COZY
            </div>
            <div className="mt-1.5 text-sm font-['Press_Start_2P'] text-[#4ade80] tabular-nums">
              {Math.round(stats.cozyRating)}%
            </div>
          </div>

          <div className="bg-[#0b0d12] border-2 border-[#475569] p-2.5 text-center">
            <div className="text-[7px] font-['Press_Start_2P'] uppercase text-[#94a3b8]">
              HEARTS
            </div>
            <div className="mt-1.5 text-sm font-['Press_Start_2P'] text-[#fb7185] tabular-nums">
              ♥{Math.round(stats.hearts)}
            </div>
          </div>

          <div className="bg-[#0b0d12] border-2 border-[#fb923c] p-2.5 text-center">
            <div className="text-[7px] font-['Press_Start_2P'] uppercase text-[#fdba74]">
              STREAK
            </div>
            <div
              data-testid="summary-daily-streak"
              className="mt-1.5 text-sm font-['Press_Start_2P'] text-[#fdba74] tabular-nums flex items-center justify-center gap-1"
            >
              <Flame
                className="w-3.5 h-3.5 text-[#fb923c]"
                fill={stats.dailyStreak > 0 ? '#f97316' : 'none'}
              />
              {Math.round(stats.dailyStreak)}
            </div>
          </div>
        </div>

        {/* Newly Unlocked Vintage Apron Notification */}
        {stats.newlyUnlockedOutfits.length > 0 && (
          <div
            data-testid="vintage-unlock-banner"
            className="mt-3 bg-[#451a03] border-2 border-[#facc15] p-3 text-center"
          >
            <div className="text-[8px] font-['Press_Start_2P'] text-[#fde047]">
              ★ VINTAGE APRON PALETTE UNLOCKED! ★
            </div>
            <div className="mt-1.5 flex items-center justify-center gap-2 flex-wrap">
              {stats.newlyUnlockedOutfits.map((outfit) => (
                <span
                  key={outfit.id}
                  className="inline-flex items-center gap-1.5 px-2 py-1 bg-[#090b0e] border border-[#facc15] text-[8px] font-['Press_Start_2P'] text-[#f8fafc]"
                >
                  <span
                    className="inline-block w-3 h-3 border border-white"
                    style={{ backgroundColor: outfit.apron }}
                  />
                  {outfit.label}
                </span>
              ))}
            </div>
            {onOpenCustomize && (
              <button
                type="button"
                onClick={onOpenCustomize}
                className="gba-btn gba-btn-active mt-2.5 px-3 py-1.5 text-[8px] cursor-pointer"
              >
                👤 EQUIP IN CUSTOMIZE
              </button>
            )}
          </div>
        )}

        {/* Actions */}
        <div className="mt-5 flex flex-col gap-2.5">
          {mode === 'paused' ? (
            <button
              type="button"
              onClick={(e) => {
                e.currentTarget.blur();
                onResume();
              }}
              className="gba-btn gba-btn-active w-full py-3 text-xs cursor-pointer"
            >
              RESUME CAFE [ESC]
            </button>
          ) : (
            <button
              type="button"
              data-start="true"
              onClick={(e) => {
                e.currentTarget.blur();
                onRestart();
              }}
              className="gba-btn gba-btn-active w-full py-3 text-xs cursor-pointer"
            >
              NEXT SHIFT [ENTER]
            </button>
          )}

          <button
            type="button"
            onClick={(e) => {
              e.currentTarget.blur();
              onOpenCodeModal();
            }}
            className="gba-btn w-full py-2.5 text-[10px] text-[#facc15] cursor-pointer"
          >
            COPY / DOWNLOAD SINGLE-FILE HTML
          </button>

          <div className="grid grid-cols-2 gap-2.5 pt-1">
            <button
              type="button"
              onClick={(e) => {
                e.currentTarget.blur();
                onRestart();
              }}
              className="gba-btn py-2.5 text-[10px] cursor-pointer"
            >
              RESTART
            </button>

            <button
              type="button"
              onClick={(e) => {
                e.currentTarget.blur();
                onReturnTitle();
              }}
              className="gba-btn py-2.5 text-[10px] cursor-pointer"
            >
              TITLE SCREEN
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
