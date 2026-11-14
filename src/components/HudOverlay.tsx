import React, { useState } from 'react';
import {
  DrinkId,
  RECIPES,
  StationId,
  STATIONS,
  RoomId,
  TimeOfDay,
  WeatherType,
  MiataPaintColor,
  BaristaAppearance,
  BusinessFinanceState,
  StaffWorker,
  UpgradableStationId,
  StationTier,
  DecorItemId,
} from '../game/rules';

export interface HudSnapshot {
  cozyRating: number;
  hearts: number;
  coins: number;
  dailyStreak: number;
  servedCount: number;
  dailyTarget: number;
  activeDrink: DrinkId | null;
  currentStepIndex: number;
  isProcessing: boolean;
  holdingWateringCan: boolean;
  thirstyDaisyCount: number;
  miataHeadlightsOn: boolean;
  miataColor: MiataPaintColor;
  speedBoostActive: boolean;
  waitingCustomerName: string | null;
  waitingCustomerOrder: DrinkId | null;
  queueCount: number;
  lastMessage: string;
  muted: boolean;
  bgmEnabled: boolean;
  room: RoomId;
  timeOfDay: TimeOfDay;
  weather: WeatherType;
  realClock: string;
  hiredStaffCount: number;
  nextStaffName: string | null;
  nextStaffCost: number | null;
  tipJarCoins: number;
  shiftSuccessBannerVisible: boolean;
  appearance: BaristaAppearance;
  finance: BusinessFinanceState;
  staff: StaffWorker[];
  stationLevels: Record<UpgradableStationId, StationTier>;
  decorOwned: Record<DecorItemId, boolean>;
  decorEquipped: Record<DecorItemId, boolean>;
}

interface TopHudProps {
  hud: HudSnapshot;
  dockCollapsed: boolean;
  isStandalone?: boolean;
  isFullscreen?: boolean;
  cameraZoom?: number;
  onResetZoom?: () => void;
  onToggleFullscreen?: () => void;
  onToggleDock: () => void;
  onToggleBgm: () => void;
  onToggleMute: () => void;
  onToggleRoom: () => void;
  onCycleTimeOfDay: () => void;
  onCycleWeather: () => void;
  onHireStaff: () => void;
  onOpenCustomize: () => void;
  onOpenMenuModal: () => void;
  onOpenBizModal: () => void;
  onOpenPwaModal: () => void;
  onPause: () => void;
  onRestart: () => void;
  onOpenCodeModal: () => void;
  onFinishShift: () => void;
}

export const TopHudBar: React.FC<TopHudProps> = ({
  hud,
  dockCollapsed,
  isStandalone = false,
  isFullscreen = false,
  cameraZoom = 1,
  onResetZoom,
  onToggleFullscreen,
  onToggleDock,
  onToggleBgm,
  onToggleMute,
  onToggleRoom,
  onCycleTimeOfDay,
  onCycleWeather,
  onOpenCustomize,
  onOpenMenuModal,
  onOpenBizModal,
  onOpenPwaModal,
  onPause,
  onRestart,
  onOpenCodeModal,
  onFinishShift,
}) => {
  const [moreOpen, setMoreOpen] = useState(false);

  const timeIcon =
    hud.timeOfDay === 'day' ? '☀' : hud.timeOfDay === 'sunset' ? '🌅' : '🌙';
  const weatherIcon =
    hud.weather === 'clear' ? '☀' : hud.weather === 'breeze' ? '🍃' : '🌧';
  const totalStock = hud.finance.ingredientStock;
  const stockLow = totalStock <= 3;

  const goalCompleted = hud.servedCount >= hud.dailyTarget;
  const zoomPct = Math.round(cameraZoom * 100);

  return (
    <header className="relative z-30 w-full shrink-0 bg-[#12161f] border-b-[3px] border-[#f8fafc] shadow-[0_3px_0_#090b0e]">
      {/* Single-Row Slim Top HUD (32px height in mobile landscape, flex-nowrap) */}
      <div className="w-full min-h-[32px] px-1.5 py-0.5 flex items-center justify-between gap-1.5 flex-nowrap overflow-x-auto no-scrollbar">
        {/* Left: Compact Inline Stat Strip including GOAL 0/6 */}
        <div className="flex items-center gap-1 shrink-0 flex-nowrap">
          <div
            data-testid="hud-clock-badge"
            className="px-1.5 py-0.5 bg-[#090b0e] border border-[#334155] flex items-center gap-1"
            title="Real-Time Local Clock & Environment"
          >
            <span className="text-[9px] text-[#38bdf8] font-bold">
              {timeIcon}
            </span>
            <span className="text-[9px] font-bold text-[#f8fafc] tabular-nums">
              {hud.realClock}
            </span>
          </div>

          <button
            type="button"
            data-testid="hud-hero-badge"
            onClick={onOpenCustomize}
            className="px-1.5 py-0.5 bg-[#090b0e] border border-[#38bdf8] flex items-center gap-1 cursor-pointer hover:bg-[#1e293b]"
            title="Customize Barista"
          >
            <span className="text-[9px] font-bold text-[#7dd3fc] uppercase">
              👤 {hud.appearance.name}
            </span>
          </button>

          <div
            data-testid="hud-cozy-badge"
            className="px-1.5 py-0.5 bg-[#090b0e] border border-[#334155] flex items-center gap-1"
            title="Garden & Cafe Cozy Rating"
          >
            <span className="text-[8px] text-[#94a3b8] hidden md:inline">COZY</span>
            <span className="text-[9px] font-bold text-[#4ade80] tabular-nums">
              {hud.cozyRating}%
            </span>
          </div>

          <div
            data-testid="hud-hearts-badge"
            className="px-1.5 py-0.5 bg-[#090b0e] border border-[#334155] flex items-center gap-0.5"
            title="Customer Hearts"
          >
            <span className="text-[9px] text-[#fb7185]">♥</span>
            <span className="text-[9px] font-bold text-[#fda4af] tabular-nums">
              {hud.hearts}
            </span>
          </div>

          <button
            type="button"
            data-testid="hud-coins-badge"
            onClick={onOpenBizModal}
            className="px-1.5 py-0.5 bg-[#090b0e] border border-[#facc15] flex items-center gap-0.5 cursor-pointer hover:bg-[#1e293b]"
            title="Cash Balance & P&L Ledger"
          >
            <span className="text-[9px] text-[#facc15]">$</span>
            <span className="text-[9px] font-bold text-[#fde047] tabular-nums">
              {hud.coins.toFixed(0)}
            </span>
            {hud.tipJarCoins > 0 && (
              <span className="text-[8px] text-[#4ade80] font-bold">
                +{hud.tipJarCoins}
              </span>
            )}
          </button>

          <button
            type="button"
            data-testid="hud-stock-badge"
            onClick={onOpenBizModal}
            className={`px-1.5 py-0.5 bg-[#090b0e] border flex items-center gap-0.5 cursor-pointer ${
              stockLow
                ? 'border-[#f87171] text-[#fca5a5] animate-pulse'
                : 'border-[#334155] text-[#cbd5e1]'
            }`}
            title={`Wholesale Ingredient Stock: ${totalStock} cups`}
          >
            <span className="text-[8px] text-[#94a3b8]">STK</span>
            <span className="text-[9px] font-bold tabular-nums">{totalStock}</span>
          </button>

          {/* Inline Daily Goal Badge (GOAL 0/6) inside Top-Left Stat Strip */}
          <div
            data-testid="daily-goal-bar"
            className={`px-1.5 py-0.5 bg-[#090b0e] border flex items-center gap-1 ${
              goalCompleted ? 'border-[#4ade80]' : 'border-[#334155]'
            }`}
            title="Daily Shift Customer Goal"
          >
            <span className="text-[8px] font-bold text-[#94a3b8]">GOAL</span>
            <span
              data-testid="daily-goal-count"
              className={`text-[9px] font-bold tabular-nums ${
                goalCompleted ? 'text-[#4ade80]' : 'text-[#facc15]'
              }`}
            >
              {hud.servedCount}/{hud.dailyTarget}
            </span>
            {goalCompleted && (
              <button
                type="button"
                data-testid="finish-shift-btn"
                onClick={onFinishShift}
                className="px-1 py-0.2 bg-[#14532d] border border-[#4ade80] text-[8px] font-bold text-[#fef08a] cursor-pointer animate-pulse"
              >
                ★ END
              </button>
            )}
          </div>

          <div
            data-testid="hud-streak-badge"
            className="px-1.5 py-0.5 bg-[#090b0e] border border-[#f59e0b]/70 hidden sm:flex items-center gap-0.5"
            title="Daily Shift Completion Streak"
          >
            <span className="text-[9px] text-[#fbbf24]">🔥</span>
            <span className="text-[9px] font-bold text-[#fde68a] tabular-nums">
              {hud.dailyStreak}
            </span>
          </div>
        </div>

        {/* Right: Primary Controls + [☰ MORE] GBA Popover Drawer Trigger */}
        <div className="flex items-center gap-1 shrink-0 flex-nowrap">
          <button
            type="button"
            data-testid="customize-btn"
            onClick={onOpenCustomize}
            className="gba-btn px-1.5 py-0.5 text-[9px] text-[#7dd3fc] cursor-pointer whitespace-nowrap"
            title="Customize Barista Appearance"
          >
            👤 HERO
          </button>

          <button
            type="button"
            data-testid="menu-guide-btn"
            onClick={onOpenMenuModal}
            className="gba-btn px-1.5 py-0.5 text-[9px] text-[#fde047] cursor-pointer whitespace-nowrap"
            title="4 Signature Recipes & Profit Guide"
          >
            📖 MENU
          </button>

          <button
            type="button"
            data-testid="biz-modal-btn"
            onClick={onOpenBizModal}
            className={`gba-btn px-1.5 py-0.5 text-[9px] cursor-pointer whitespace-nowrap ${
              stockLow ? 'gba-btn-active animate-pulse' : 'text-[#4ade80]'
            }`}
            title="Business Ledger, Stock, Staff, Machines & Decor [U]"
          >
            📊 BIZ
          </button>

          {/* [⛶] Fullscreen Toggle — Only in Web Browser Mode */}
          {!isStandalone && onToggleFullscreen && (
            <button
              type="button"
              data-testid="fullscreen-btn"
              onClick={onToggleFullscreen}
              className={`gba-btn px-1.5 py-0.5 text-[9px] cursor-pointer whitespace-nowrap ${
                isFullscreen ? 'gba-btn-active' : 'text-[#e2e8f0]'
              }`}
              title="Toggle Fullscreen"
            >
              [⛶]
            </button>
          )}

          <button
            type="button"
            data-testid="room-toggle-btn"
            onClick={onToggleRoom}
            className={`gba-btn px-1.5 py-0.5 text-[9px] cursor-pointer whitespace-nowrap ${
              hud.room === 'garden' ? 'gba-btn-active' : 'text-[#86efac]'
            }`}
            title="Switch Room [V]"
          >
            {hud.room === 'inside' ? '🚪 GARDEN' : '🚪 INSIDE'}
          </button>

          <button
            type="button"
            data-testid="more-menu-btn"
            onClick={() => setMoreOpen((prev) => !prev)}
            className={`gba-btn px-2 py-0.5 text-[9px] cursor-pointer whitespace-nowrap ${
              moreOpen ? 'gba-btn-active' : 'text-[#f8fafc]'
            }`}
            title="Environment, Audio, Pause & Tools Drawer"
          >
            ☰ MORE
          </button>
        </div>
      </div>

      {/* GBA Grid Popover Drawer ([☰ MORE]) */}
      {moreOpen && (
        <div
          data-testid="more-popover-drawer"
          className="absolute right-2 top-full mt-1 z-50 w-72 sm:w-80 gba-frame bg-[#12161f] p-2.5 shadow-2xl"
        >
          <div className="flex items-center justify-between pb-1.5 mb-2 border-b border-[#262f40]">
            <span className="text-[9px] font-bold text-[#facc15]">
              ⚙ CAFE CONTROLS &amp; TOOLS
            </span>
            <button
              type="button"
              onClick={() => setMoreOpen(false)}
              className="text-[9px] text-[#94a3b8] hover:text-[#f8fafc] cursor-pointer"
            >
              [✕]
            </button>
          </div>

          <div className="grid grid-cols-2 gap-1.5">
            <button
              type="button"
              data-testid="time-cycle-btn"
              onClick={onCycleTimeOfDay}
              className="gba-btn px-2 py-1.5 text-[9px] text-[#fde047] cursor-pointer text-left truncate"
            >
              {timeIcon} TIME: {hud.timeOfDay.toUpperCase()}
            </button>

            <button
              type="button"
              data-testid="weather-cycle-btn"
              onClick={onCycleWeather}
              className="gba-btn px-2 py-1.5 text-[9px] text-[#7dd3fc] cursor-pointer text-left truncate"
            >
              {weatherIcon} WTHR: {hud.weather.toUpperCase()}
            </button>

            <button
              type="button"
              data-testid="bgm-btn"
              onClick={onToggleBgm}
              className={`gba-btn px-2 py-1.5 text-[9px] cursor-pointer text-left truncate ${
                hud.bgmEnabled ? 'text-[#f472b6]' : 'text-[#64748b]'
              }`}
            >
              {hud.bgmEnabled ? '♪ BGM: ON' : '♪ BGM: OFF'}
            </button>

            <button
              type="button"
              data-testid="mute-btn"
              onClick={onToggleMute}
              className="gba-btn px-2 py-1.5 text-[9px] text-[#e2e8f0] cursor-pointer text-left truncate"
            >
              {hud.muted ? '🔇 SFX: MUTED' : '🔊 SFX: ON'}
            </button>

            {onResetZoom && (
              <button
                type="button"
                data-testid="drawer-zoom-btn"
                onClick={onResetZoom}
                className="gba-btn px-2 py-1.5 text-[9px] text-[#38bdf8] cursor-pointer text-left truncate"
              >
                🔍 ZOOM: {zoomPct}%
              </button>
            )}

            <button
              type="button"
              data-testid="toggle-dock-btn"
              onClick={onToggleDock}
              className={`gba-btn px-2 py-1.5 text-[9px] cursor-pointer text-left truncate ${
                !dockCollapsed ? 'gba-btn-active' : 'text-[#cbd5e1]'
              }`}
            >
              {dockCollapsed ? '▼ SHOW DOCK' : '▲ HIDE DOCK'}
            </button>

            {!isStandalone && (
              <button
                type="button"
                data-testid="pwa-modal-btn"
                onClick={() => {
                  setMoreOpen(false);
                  onOpenPwaModal();
                }}
                className="gba-btn px-2 py-1.5 text-[9px] text-[#38bdf8] cursor-pointer text-left truncate"
              >
                📲 APP / APK
              </button>
            )}

            <button
              type="button"
              data-testid="export-code-btn"
              onClick={() => {
                setMoreOpen(false);
                onOpenCodeModal();
              }}
              className="gba-btn px-2 py-1.5 text-[9px] text-[#38bdf8] cursor-pointer text-left truncate"
            >
              &lt;/&gt; HTML CODE
            </button>

            <button
              type="button"
              data-testid="pause-btn"
              onClick={() => {
                setMoreOpen(false);
                onPause();
              }}
              className="gba-btn px-2 py-1.5 text-[9px] text-[#e2e8f0] cursor-pointer text-left truncate"
            >
              II PAUSE SHIFT
            </button>

            <button
              type="button"
              data-testid="restart-btn"
              onClick={() => {
                setMoreOpen(false);
                onRestart();
              }}
              className="gba-btn px-2 py-1.5 text-[9px] text-[#fda4af] cursor-pointer text-left truncate"
            >
              ↻ RESTART DAY
            </button>
          </div>
        </div>
      )}
    </header>
  );
};

interface TopLeftZoomControlsProps {
  cameraZoom: number;
  onZoomIn: () => void;
  onZoomOut: () => void;
  onResetZoom: () => void;
}

/**
 * Compact Zoom Pill Strip (`-`, `100%`, `+`) anchored in the top-left corner of `#stage`
 * so the bottom-right quick-bar stays dedicated to the 4 core gameplay actions.
 */
export const TopLeftZoomControls: React.FC<TopLeftZoomControlsProps> = ({
  cameraZoom,
  onZoomIn,
  onZoomOut,
  onResetZoom,
}) => {
  const zoomPct = Math.round(cameraZoom * 100);

  return (
    <div
      data-testid="top-left-zoom-controls"
      className="pointer-events-auto flex items-center gap-0.5 bg-[#090b10]/90 border-2 border-[#475569] px-1 py-0.5 shadow-[0_2px_0_#000000]"
    >
      <button
        type="button"
        data-testid="zoom-out-btn"
        onClick={onZoomOut}
        className="px-1.5 py-0.5 text-[9px] font-bold text-[#cbd5e1] hover:text-[#facc15] cursor-pointer"
        title="Zoom Out [-]"
      >
        -
      </button>
      <button
        type="button"
        data-testid="zoom-reset-btn"
        onClick={onResetZoom}
        className="px-1.5 py-0.5 text-[8px] font-bold text-[#38bdf8] hover:text-[#facc15] tabular-nums cursor-pointer"
        title="Toggle 100% Overview / Station Focus"
      >
        {zoomPct}%
      </button>
      <button
        type="button"
        data-testid="zoom-in-btn"
        onClick={onZoomIn}
        className="px-1.5 py-0.5 text-[9px] font-bold text-[#cbd5e1] hover:text-[#facc15] cursor-pointer"
        title="Zoom In [+]"
      >
        +
      </button>
    </div>
  );
};

interface FloatingQuickBarProps {
  hud: HudSnapshot;
  onSmartStep: () => void;
  onWaterAllDaisies: () => void;
  onHireStaff: () => void;
  onPetCats: () => void;
}

/**
 * Unobstructed 4-Button Bottom-Right Quick-Bar (`⚡ STEP`, `👩‍🍳 HIRE`, `💧 WATER`, `🐾 CATS`)
 * Leaves the `▼ TO GARDEN [V]` doorway mat completely unobstructed.
 */
export const FloatingCanvasQuickBar: React.FC<FloatingQuickBarProps> = ({
  hud,
  onSmartStep,
  onWaterAllDaisies,
  onHireStaff,
  onPetCats,
}) => {
  const targetDrink: DrinkId =
    hud.activeDrink ?? hud.waitingCustomerOrder ?? 'miata_mocha';
  const activeRecipe = RECIPES[targetDrink];
  const isReadyToServe = hud.currentStepIndex === 3;
  const currentStepStation =
    hud.currentStepIndex < 3 ? activeRecipe.steps[hud.currentStepIndex] : null;
  const stationMeta = currentStepStation
    ? STATIONS.find((s) => s.id === currentStepStation)
    : null;

  const smartLabel = isReadyToServe
    ? '⚡ SERVE!'
    : hud.isProcessing
    ? '⏳ BREWING'
    : `⚡ ${stationMeta?.shortLabel ?? 'STEP'}`;

  return (
    <div
      data-testid="floating-quick-bar"
      className="flex flex-wrap items-center justify-end gap-1 pointer-events-auto"
    >
      <button
        type="button"
        data-testid="quick-smart-step-btn"
        onClick={onSmartStep}
        className={`gba-btn px-2 py-1 text-[9px] cursor-pointer ${
          isReadyToServe ? 'gba-btn-active animate-pulse' : 'text-[#fde047]'
        }`}
        title="Smart Prep / Serve [E]"
      >
        {smartLabel}
      </button>

      {hud.nextStaffName ? (
        <button
          type="button"
          data-testid="quick-hire-staff-btn"
          onClick={onHireStaff}
          className={`gba-btn px-2 py-1 text-[9px] cursor-pointer ${
            hud.coins >= (hud.nextStaffCost ?? 999)
              ? 'gba-btn-active'
              : 'text-[#cbd5e1]'
          }`}
          title="Hire Hired Help [K]"
        >
          👩‍🍳 HIRE {hud.nextStaffName.toUpperCase()} ({hud.nextStaffCost}c)
        </button>
      ) : (
        <button
          type="button"
          data-testid="quick-hire-staff-btn"
          onClick={onHireStaff}
          className="gba-btn px-2 py-1 text-[9px] text-[#4ade80] cursor-pointer"
          title="Staff Crew Active"
        >
          👩‍🍳 STAFF ({hud.hiredStaffCount}/2)
        </button>
      )}

      <button
        type="button"
        data-testid="quick-water-btn"
        onClick={onWaterAllDaisies}
        className={`gba-btn px-2 py-1 text-[9px] cursor-pointer ${
          hud.thirstyDaisyCount > 0
            ? 'gba-btn-active animate-pulse'
            : 'text-[#7dd3fc]'
        }`}
        title="Water Thirsty Daisies [W]"
      >
        💧 WATER {hud.thirstyDaisyCount > 0 ? `(${hud.thirstyDaisyCount})` : ''}
      </button>

      <button
        type="button"
        data-testid="quick-pet-cats-btn"
        onClick={onPetCats}
        className="gba-btn px-2 py-1 text-[9px] text-[#f9a8d4] cursor-pointer"
        title="Pet Lilo & Champy [C]"
      >
        🐾 CATS
      </button>
    </div>
  );
};

interface BottomDockProps {
  hud: HudSnapshot;
  collapsed: boolean;
  onTriggerStation: (stationId: StationId) => void;
  onServeCustomer: () => void;
  onWaterAllDaisies: () => void;
  onToggleMiataHeadlights: () => void;
  onPetCats: () => void;
}

export const BottomActionDock: React.FC<BottomDockProps> = ({
  hud,
  collapsed,
  onTriggerStation,
  onServeCustomer,
  onWaterAllDaisies,
  onToggleMiataHeadlights,
  onPetCats,
}) => {
  if (collapsed) {
    return null;
  }

  const targetDrink: DrinkId =
    hud.activeDrink ?? hud.waitingCustomerOrder ?? 'miata_mocha';
  const activeRecipe = RECIPES[targetDrink];
  const isReadyToServe = hud.currentStepIndex === 3;
  const requiredStation =
    hud.currentStepIndex < 3 ? activeRecipe.steps[hud.currentStepIndex] : null;

  const discount = hud.finance.upgrades.direct_trade_beans ? 1.5 : 0;
  const unitCogs = Math.max(
    0.5,
    Number(((hud.finance.ingredientStock > 0 ? 2.0 : 4.0) - discount).toFixed(2))
  );
  const sleeveBonus = hud.finance.upgrades.custom_sleeves ? 4 : 0;
  const cozyBonus = hud.cozyRating >= 80 ? 5 : hud.cozyRating >= 60 ? 3 : 0;
  const netProfit = activeRecipe.price + sleeveBonus + cozyBonus - unitCogs;

  const brewStations: Array<{ id: StationId; num: string; icon: string }> = [
    { id: 'grinder', num: '1', icon: '🫘' },
    { id: 'espresso', num: '2', icon: '☕' },
    { id: 'milk_frother', num: '3', icon: '🥛' },
    { id: 'kettle', num: '4', icon: '🫖' },
    { id: 'tea_leaves', num: '5', icon: '🌿' },
  ];

  return (
    <footer className="w-full shrink-0 bg-[#12161f] border-t-[3px] border-[#f8fafc] px-2.5 py-1.5 z-20">
      <div className="max-w-[1440px] mx-auto flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-2">
        <div className="flex flex-wrap items-center gap-2 bg-[#090b0e] border-2 border-[#334155] px-2.5 py-1">
          <div className="flex items-center gap-1.5">
            <span className="text-[9px] text-[#94a3b8]">ORDER:</span>
            <span className="text-[10px] font-bold text-[#facc15]">
              {activeRecipe.shortName}
            </span>
            <span className="text-[9px] text-[#4ade80]">
              (Net +${netProfit.toFixed(1)})
            </span>
          </div>

          <div className="flex items-center gap-1">
            {activeRecipe.stepLabels.map((lbl: string, idx: number) => {
              const done = hud.currentStepIndex > idx;
              const current = hud.currentStepIndex === idx;
              return (
                <span
                  key={lbl}
                  className={`px-1.5 py-0.5 text-[8px] border ${
                    done
                      ? 'bg-[#14532d] border-[#4ade80] text-[#dcfce7]'
                      : current
                      ? 'bg-[#422006] border-[#facc15] text-[#fef08a]'
                      : 'bg-[#161b24] border-[#334155] text-[#64748b]'
                  }`}
                >
                  {done ? '✓' : idx + 1}.{lbl}
                </span>
              );
            })}
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-1.5">
          {brewStations.map((bs) => {
            const st = STATIONS.find((s) => s.id === bs.id)!;
            const isNext = requiredStation === bs.id;
            const lvl = hud.stationLevels[bs.id as UpgradableStationId] ?? 1;
            return (
              <button
                key={bs.id}
                type="button"
                data-station={bs.id}
                onClick={() => onTriggerStation(bs.id)}
                className={`gba-btn px-2 py-1 text-[9px] cursor-pointer flex items-center gap-1 ${
                  isNext ? 'gba-btn-active' : 'text-[#e2e8f0]'
                }`}
              >
                <span className="text-[#94a3b8]">[{bs.num}]</span>
                <span>{bs.icon}</span>
                <span>{st.shortLabel}</span>
                <span className="text-[8px] text-[#facc15]">L{lvl}</span>
              </button>
            );
          })}

          <button
            type="button"
            data-testid="serve-btn"
            onClick={onServeCustomer}
            className={`gba-btn px-2.5 py-1 text-[9px] font-bold cursor-pointer ${
              isReadyToServe ? 'gba-btn-active animate-pulse' : 'text-[#86efac]'
            }`}
          >
            🛎 SERVE [SPACE]
          </button>

          <button
            type="button"
            data-testid="water-daisies-btn"
            onClick={onWaterAllDaisies}
            className={`gba-btn px-2 py-1 text-[9px] cursor-pointer ${
              hud.thirstyDaisyCount > 0 ? 'gba-btn-active' : 'text-[#7dd3fc]'
            }`}
          >
            💧 DAISIES [W]
          </button>

          <button
            type="button"
            data-testid="miata-headlights-btn"
            onClick={onToggleMiataHeadlights}
            className={`gba-btn px-2 py-1 text-[9px] cursor-pointer ${
              hud.miataHeadlightsOn ? 'gba-btn-active' : 'text-[#fca5a5]'
            }`}
          >
            🚗 MIATA ({hud.miataColor.toUpperCase()}) [H]
          </button>

          <button
            type="button"
            data-testid="pet-cats-btn"
            onClick={onPetCats}
            className="gba-btn px-2 py-1 text-[9px] text-[#f9a8d4] cursor-pointer"
          >
            🐾 CATS [C]
          </button>
        </div>
      </div>
    </footer>
  );
};
