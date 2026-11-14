import React, { useEffect, useRef, useState } from 'react';
import { Flame, Lock } from 'lucide-react';
import {
  BaristaAppearance,
  BaristaStyleId,
  HAIR_COLORS,
  SKIN_TONES,
  BARISTA_OUTFITS,
  isOutfitUnlocked,
} from '../game/rules';
import { drawBaristaPreview } from '../game/pixelArt';

interface CustomizeModalProps {
  appearance: BaristaAppearance;
  dailyStreak: number;
  onSave: (updated: BaristaAppearance) => void;
  onClose: () => void;
}

export const CustomizeModal: React.FC<CustomizeModalProps> = ({
  appearance,
  dailyStreak,
  onSave,
  onClose,
}) => {
  const [name, setName] = useState(appearance.name);
  const [hairColorIndex, setHairColorIndex] = useState(appearance.hairColorIndex);
  const [skinToneIndex, setSkinToneIndex] = useState(appearance.skinToneIndex);
  const [outfitStyleId, setOutfitStyleId] = useState<BaristaStyleId>(appearance.outfitStyleId);
  const previewCanvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    let rafId = 0;
    const renderPreview = (now: number) => {
      const canvas = previewCanvasRef.current;
      if (canvas) {
        const ctx = canvas.getContext('2d');
        if (ctx) {
          drawBaristaPreview(
            ctx,
            {
              name: name.trim() || 'Klasik',
              hairColorIndex,
              skinToneIndex,
              outfitStyleId,
            },
            now / 1000
          );
        }
      }
      rafId = requestAnimationFrame(renderPreview);
    };
    rafId = requestAnimationFrame(renderPreview);
    return () => cancelAnimationFrame(rafId);
  }, [name, hairColorIndex, skinToneIndex, outfitStyleId]);

  const currentHair = HAIR_COLORS[hairColorIndex] ?? HAIR_COLORS[0];
  const currentSkin = SKIN_TONES[skinToneIndex] ?? SKIN_TONES[0];
  const currentOutfitIdx = Math.max(
    0,
    BARISTA_OUTFITS.findIndex((o) => o.id === outfitStyleId)
  );
  const currentOutfit = BARISTA_OUTFITS[currentOutfitIdx] ?? BARISTA_OUTFITS[0];
  const isCurrentUnlocked = isOutfitUnlocked(currentOutfit, dailyStreak);
  const vintageOutfits = BARISTA_OUTFITS.filter((o) => o.isVintage);

  const handleApply = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isCurrentUnlocked) return;
    onSave({
      name: name.trim() || 'Klasik',
      hairColorIndex,
      skinToneIndex,
      outfitStyleId,
    });
    onClose();
  };

  return (
    <div
      data-testid="customize-modal"
      className="fixed inset-0 z-40 flex items-center justify-center p-2 sm:p-4"
      style={{ backgroundColor: 'rgba(9, 11, 14, 0.86)' }}
      role="dialog"
      aria-modal="true"
      aria-labelledby="customize-modal-title"
    >
      <form
        onSubmit={handleApply}
        className="gba-frame w-full max-w-lg p-4 sm:p-5 text-[#f8fafc] max-h-[94dvh] overflow-y-auto"
      >
        <div className="flex items-center justify-between gap-2 pb-2 border-b-2 border-[#334155]">
          <div className="flex items-center gap-2.5 flex-wrap">
            <h2
              id="customize-modal-title"
              className="text-xs sm:text-sm font-['Press_Start_2P'] text-[#facc15]"
            >
              👤 CUSTOMIZE BARISTA
            </h2>
            <span
              data-testid="customize-streak-badge"
              className="inline-flex items-center gap-1 px-2 py-0.5 bg-[#090b0e] border border-[#fb923c] text-[8px] font-['Press_Start_2P'] text-[#fdba74]"
            >
              <Flame
                className="w-3 h-3 text-[#fb923c]"
                fill={dailyStreak > 0 ? '#f97316' : 'none'}
              />
              STREAK {dailyStreak}
            </span>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="gba-btn px-2.5 py-1 text-[9px] cursor-pointer"
          >
            ✕ ESC
          </button>
        </div>

        <div className="mt-3 grid grid-cols-1 sm:grid-cols-[120px_1fr] gap-4 items-center">
          {/* Live Pixel Sprite Preview */}
          <div className="flex flex-col items-center gap-1.5">
            <div className="relative">
              <canvas
                ref={previewCanvasRef}
                width={96}
                height={96}
                className={`w-24 h-24 border-2 bg-[#0f172a] ${
                  isCurrentUnlocked ? 'border-[#facc15]' : 'border-[#fb7185]'
                }`}
                style={{ imageRendering: 'pixelated' }}
              />
              {!isCurrentUnlocked && (
                <div className="absolute inset-0 bg-[#090b0e]/60 flex items-center justify-center">
                  <Lock className="w-6 h-6 text-[#fb7185]" />
                </div>
              )}
            </div>
            <span className="text-[8px] font-['Press_Start_2P'] text-[#fde047] truncate max-w-[110px]">
              {(name.trim() || 'KLASIK').toUpperCase()}
            </span>
          </div>

          {/* Customization Controls */}
          <div className="flex flex-col gap-2.5">
            {/* Barista Name Input */}
            <div className="flex flex-col gap-1">
              <label
                htmlFor="barista-name-input"
                className="text-[8px] font-['Press_Start_2P'] text-[#94a3b8]"
              >
                BARISTA NAMETAG (MAX 12 CHARS)
              </label>
              <input
                id="barista-name-input"
                data-testid="barista-name-input"
                type="text"
                maxLength={12}
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Klasik"
                className="bg-[#090b0e] border-2 border-[#cbd5e1] px-2.5 py-1.5 text-xs font-['Press_Start_2P'] text-[#f8fafc] focus:border-[#facc15] outline-none"
              />
            </div>

            {/* 5 Hair Colors */}
            <div className="flex items-center justify-between gap-2 bg-[#0b0d12] border border-[#334155] px-2.5 py-1.5">
              <div>
                <div className="text-[7px] font-['Press_Start_2P'] text-[#94a3b8]">
                  HAIR COLOR ({hairColorIndex + 1}/{HAIR_COLORS.length})
                </div>
                <div className="text-xs font-['Press_Start_2P'] text-[#f8fafc] mt-0.5 flex items-center gap-1.5">
                  <span
                    className="inline-block w-3 h-3 border border-white"
                    style={{ backgroundColor: currentHair.main }}
                  />
                  {currentHair.label}
                </div>
              </div>
              <button
                type="button"
                data-testid="cycle-hair-btn"
                onClick={() => setHairColorIndex((i) => (i + 1) % HAIR_COLORS.length)}
                className="gba-btn px-2.5 py-1.5 text-[8px] text-[#facc15] cursor-pointer whitespace-nowrap"
              >
                CYCLE ►
              </button>
            </div>

            {/* 4 Skin Tones */}
            <div className="flex items-center justify-between gap-2 bg-[#0b0d12] border border-[#334155] px-2.5 py-1.5">
              <div>
                <div className="text-[7px] font-['Press_Start_2P'] text-[#94a3b8]">
                  SKIN TONE ({skinToneIndex + 1}/{SKIN_TONES.length})
                </div>
                <div className="text-xs font-['Press_Start_2P'] text-[#f8fafc] mt-0.5 flex items-center gap-1.5">
                  <span
                    className="inline-block w-3 h-3 border border-white"
                    style={{ backgroundColor: currentSkin.hex }}
                  />
                  {currentSkin.label}
                </div>
              </div>
              <button
                type="button"
                data-testid="cycle-skin-btn"
                onClick={() => setSkinToneIndex((i) => (i + 1) % SKIN_TONES.length)}
                className="gba-btn px-2.5 py-1.5 text-[8px] text-[#facc15] cursor-pointer whitespace-nowrap"
              >
                CYCLE ►
              </button>
            </div>

            {/* Barista Apron / Outfit Styles (Standard + Unlockable Vintage Palettes) */}
            <div className="flex items-center justify-between gap-2 bg-[#0b0d12] border border-[#334155] px-2.5 py-1.5">
              <div className="min-w-0">
                <div className="text-[7px] font-['Press_Start_2P'] text-[#94a3b8] flex items-center gap-1.5 flex-wrap">
                  <span>
                    APRON &amp; OUTFIT ({currentOutfitIdx + 1}/{BARISTA_OUTFITS.length})
                  </span>
                  {currentOutfit.isVintage && (
                    <span
                      className={`px-1 py-0.5 text-[6px] ${
                        isCurrentUnlocked
                          ? 'bg-[#78350f] text-[#fde68a]'
                          : 'bg-[#450a0a] text-[#fca5a5]'
                      }`}
                    >
                      {isCurrentUnlocked
                        ? '★ VINTAGE'
                        : `🔒 STREAK ${currentOutfit.unlockStreak}`}
                    </span>
                  )}
                </div>
                <div className="text-xs font-['Press_Start_2P'] text-[#f8fafc] mt-0.5 flex items-center gap-1.5 truncate">
                  <span
                    className="inline-block w-3 h-3 border border-white shrink-0"
                    style={{ backgroundColor: currentOutfit.apron }}
                  />
                  <span className="truncate">{currentOutfit.label}</span>
                </div>
              </div>
              <button
                type="button"
                data-testid="cycle-outfit-btn"
                onClick={() => {
                  const next = BARISTA_OUTFITS[(currentOutfitIdx + 1) % BARISTA_OUTFITS.length];
                  setOutfitStyleId(next.id);
                }}
                className="gba-btn px-2.5 py-1.5 text-[8px] text-[#facc15] cursor-pointer whitespace-nowrap"
              >
                CYCLE ►
              </button>
            </div>
          </div>
        </div>

        {/* Unlockable Vintage Apron Milestones */}
        <div className="mt-3 bg-[#0b0d12] border border-[#334155] p-2.5">
          <div className="text-[7px] font-['Press_Start_2P'] text-[#fdba74] mb-2">
            ★ VINTAGE APRON STREAK UNLOCKS
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-1.5">
            {vintageOutfits.map((v) => {
              const unlocked = isOutfitUnlocked(v, dailyStreak);
              const selected = outfitStyleId === v.id;
              return (
                <button
                  key={v.id}
                  type="button"
                  data-testid={`vintage-pill-${v.id}`}
                  onClick={() => setOutfitStyleId(v.id)}
                  className={`text-left px-2 py-1.5 border cursor-pointer transition-colors ${
                    selected
                      ? 'border-[#facc15] bg-[#1e293b]'
                      : unlocked
                        ? 'border-[#4ade80]/60 bg-[#090b0e]'
                        : 'border-[#334155] bg-[#090b0e] opacity-75'
                  }`}
                >
                  <div className="flex items-center justify-between gap-1">
                    <span
                      className="inline-block w-3 h-3 border border-white shrink-0"
                      style={{ backgroundColor: v.apron }}
                    />
                    <span
                      className={`text-[7px] font-['Press_Start_2P'] ${
                        unlocked ? 'text-[#4ade80]' : 'text-[#fb7185]'
                      }`}
                    >
                      {unlocked ? 'UNLOCKED' : `🔥 ${v.unlockStreak}`}
                    </span>
                  </div>
                  <div className="text-[7px] font-['Press_Start_2P'] text-[#f8fafc] mt-1 truncate">
                    {v.label}
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        <div className="mt-4 flex items-center justify-end gap-2.5">
          <button
            type="button"
            onClick={onClose}
            className="gba-btn px-3.5 py-2 text-[9px] cursor-pointer"
          >
            CANCEL
          </button>
          <button
            type="submit"
            disabled={!isCurrentUnlocked}
            data-testid="save-customize-btn"
            className={`gba-btn px-4 py-2 text-[9px] ${
              isCurrentUnlocked
                ? 'gba-btn-active cursor-pointer'
                : 'opacity-50 cursor-not-allowed text-[#fca5a5]'
            }`}
          >
            {isCurrentUnlocked
              ? '✓ SAVE BARISTA'
              : `🔒 NEEDS STREAK ${currentOutfit.unlockStreak}`}
          </button>
        </div>
      </form>
    </div>
  );
};
