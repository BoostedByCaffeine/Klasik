import React from 'react';
import {
  DrinkId,
  RECIPES,
  StationId,
  RoomId,
  TimeOfDay,
  WeatherType,
  MiataPaintColor,
} from '../game/rules';
import { DailyGoalProgressBar } from './DailyGoalProgressBar';

export interface HudSnapshot {
  cozyRating: number;
  hearts: number;
  coins: number;
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
}

interface TopHudBarProps {
  hud: HudSnapshot;
  dockCollapsed: boolean;
  onToggleDock: () => void;
  onToggleBgm: () => void;
  onToggleMute: () => void;
  onToggleRoom: () => void;
  onCycleTimeOfDay: () => void;
  onCycleWeather: () => void;
  onHireStaff: () => void;
  onPause: () => void;
  onRestart: () => void;
  onOpenCodeModal: () => void;
  onFinishShift: () => void;
}

export const TopHudBar: React.FC<TopHudBarProps> = ({
  hud,
  dockCollapsed,
  onToggleDock,
  onToggleBgm,
  onToggleMute,
  onToggleRoom,
  onCycleTimeOfDay,
  onCycleWeather,
  onHireStaff,
  onPause,
  onRestart,
  onOpenCodeModal,
  onFinishShift,
}) => {
  const orderRecipe = hud.waitingCustomerOrder ? RECIPES[hud.waitingCustomerOrder] : null;

  const roomLabels: Record<RoomId, string> = {
    inside: '🚪 INSIDE',
    garden: '🚪 GARDEN',
  };

  const timeLabels: Record<TimeOfDay, string> = {
    day: '☀️ DAY',
    sunset: '🌅 SUNSET',
    night: '🌙 NIGHT',
  };

  const weatherLabels: Record<WeatherType, string> = {
    clear: '⛅ CLEAR',
    breeze: '🍃 BREEZE',
    rain: '🌧️ RAIN',
  };

  const canAffordStaff = hud.nextStaffCost !== null && hud.coins >= hud.nextStaffCost;

  return (
    <header className="w-full bg-[#0b0d12] border-b-[3px] border-[#f8fafc] px-2 py-1 shrink-0 flex flex-wrap items-center justify-between gap-1.5 overflow-x-hidden">
      {/* Compact GBA Stat Strip + Daily Goal Progress Bar */}
      <div className="gba-frame px-2 py-1 flex flex-wrap items-center gap-2 shrink-0">
        {/* Live Real-Time Clock */}
        <div className="flex items-center gap-1" title="Real-Time Local Clock">
          <span
            data-testid="hud-real-clock"
            className="text-[9px] font-['Press_Start_2P'] text-[#7dd3fc] tabular-nums"
          >
            🕒 {hud.realClock}
          </span>
        </div>

        <div className="w-[2px] h-4 bg-[#334155]" />

        {/* Cozy Rating */}
        <div className="flex items-center gap-1">
          <span className="text-[8px] font-['Press_Start_2P'] text-[#94a3b8]">COZY</span>
          <span
            data-testid="hud-cozy-rating"
            className="text-xs font-['Press_Start_2P'] text-[#f8fafc] tabular-nums"
          >
            {Math.round(hud.cozyRating)}%
          </span>
        </div>

        <div className="w-[2px] h-4 bg-[#334155]" />

        {/* Hearts */}
        <div className="flex items-center gap-1">
          <span className="text-[8px] font-['Press_Start_2P'] text-[#fb7185]">♥</span>
          <span
            data-testid="hud-hearts"
            className="text-xs font-['Press_Start_2P'] text-[#fb7185] tabular-nums"
          >
            {Math.round(hud.hearts)}
          </span>
        </div>

        <div className="w-[2px] h-4 bg-[#334155]" />

        {/* Coins */}
        <div className="flex items-center gap-1">
          <span className="text-[8px] font-['Press_Start_2P'] text-[#facc15]">$</span>
          <span
            data-testid="hud-coins"
            className="text-xs font-['Press_Start_2P'] text-[#facc15] tabular-nums"
          >
            {Math.round(hud.coins)}
          </span>
        </div>

        <div className="w-[2px] h-4 bg-[#334155]" />

        {/* Daily Goal Progress Bar Component */}
        <DailyGoalProgressBar
          servedCount={hud.servedCount}
          dailyTarget={hud.dailyTarget}
          onFinishShift={onFinishShift}
        />
      </div>

      {/* Center Classic Pokémon GBA White/Charcoal Dialogue & Recipe Guide Box */}
      <div className="gba-dialogue-box px-2.5 py-1 flex-1 min-w-[190px] max-w-md hidden xl:flex items-center justify-between gap-2">
        <div className="min-w-0">
          <div className="flex items-center gap-2">
            <span className="text-[8px] font-['Press_Start_2P'] text-[#0f172a] uppercase truncate">
              {orderRecipe
                ? `${hud.waitingCustomerName}: ${orderRecipe.name}`
                : 'KLASIK GARAGE LOG'}
            </span>
            <span className="text-[8px] font-['Press_Start_2P'] px-1.5 py-0.5 bg-[#0f172a] text-[#facc15] tabular-nums">
              STEP {Math.round(hud.currentStepIndex)}/3
            </span>
            {hud.speedBoostActive && (
              <span className="text-[8px] font-['Press_Start_2P'] px-1.5 py-0.5 bg-[#16a34a] text-[#ffffff]">
                CAT BOOST!
              </span>
            )}
          </div>
          <div className="text-base font-['VT323'] leading-none text-[#1e293b] truncate mt-0.5">
            {hud.lastMessage}
          </div>
        </div>
        <span
          className="text-[10px] font-['Press_Start_2P'] text-[#ef4444] animate-bounce shrink-0"
          aria-hidden="true"
        >
          ▼
        </span>
      </div>

      {/* Right Room, Time, Weather, Staff Hire, Stations Drawer, Audio & Utility Controls */}
      <div className="gba-frame px-1.5 py-1 flex flex-wrap items-center gap-1 shrink-0">
        {/* Room Map Switcher [V] */}
        <button
          type="button"
          tabIndex={-1}
          data-testid="hud-room-btn"
          aria-label="Switch Room Map (INSIDE / GARDEN) [V]"
          title="Switch Room Map (INSIDE / GARDEN) [V]"
          onClick={(e) => {
            e.currentTarget.blur();
            onToggleRoom();
          }}
          className="gba-btn px-2 h-6 flex items-center justify-center text-[#7dd3fc] cursor-pointer whitespace-nowrap"
        >
          <span className="text-[8px]">{roomLabels[hud.room]}</span>
        </button>

        {/* Time of Day Cycle [T] */}
        <button
          type="button"
          tabIndex={-1}
          data-testid="hud-time-btn"
          aria-label="Cycle Time of Day (DAY / SUNSET / NIGHT) [T]"
          title="Cycle Time of Day (DAY / SUNSET / NIGHT) [T]"
          onClick={(e) => {
            e.currentTarget.blur();
            onCycleTimeOfDay();
          }}
          className="gba-btn px-2 h-6 flex items-center justify-center text-[#fde047] cursor-pointer whitespace-nowrap"
        >
          <span className="text-[8px]">{timeLabels[hud.timeOfDay]}</span>
        </button>

        {/* Weather Cycle [G] */}
        <button
          type="button"
          tabIndex={-1}
          data-testid="hud-weather-btn"
          aria-label="Cycle Weather (CLEAR / BREEZE / RAIN) [G]"
          title="Cycle Weather (CLEAR / BREEZE / RAIN) [G]"
          onClick={(e) => {
            e.currentTarget.blur();
            onCycleWeather();
          }}
          className={`gba-btn px-2 h-6 flex items-center justify-center cursor-pointer whitespace-nowrap ${
            hud.weather === 'rain' ? 'gba-btn-active' : 'text-[#86efac]'
          }`}
        >
          <span className="text-[8px]">{weatherLabels[hud.weather]}</span>
        </button>

        {/* Hire Cafe Staff [K] */}
        <button
          type="button"
          tabIndex={-1}
          data-testid="hud-hire-staff-btn"
          aria-label="Hire Cafe Staff [K]"
          title={
            hud.nextStaffName
              ? `Hire ${hud.nextStaffName} ($${hud.nextStaffCost}) [K]`
              : 'All 2 Cafe Staff Hired!'
          }
          onClick={(e) => {
            e.currentTarget.blur();
            onHireStaff();
          }}
          className={`gba-btn px-1.5 h-6 flex items-center justify-center cursor-pointer whitespace-nowrap ${
            canAffordStaff ? 'gba-btn-active' : 'text-[#fb7185]'
          }`}
        >
          <span className="text-[8px]">
            👩‍🍳 STAFF ({hud.hiredStaffCount}/2)
            {hud.nextStaffCost !== null ? ` · $${hud.nextStaffCost}` : ' ★'}
          </span>
        </button>

        {/* Collapsible Bottom Action Dock Toggle [🛠️ STATIONS] */}
        <button
          type="button"
          tabIndex={-1}
          data-testid="hud-stations-toggle-btn"
          aria-expanded={!dockCollapsed}
          aria-label={dockCollapsed ? 'Open Stations Drawer' : 'Close Stations Drawer'}
          onClick={(e) => {
            e.currentTarget.blur();
            onToggleDock();
          }}
          className={`gba-btn px-1.5 h-6 flex items-center justify-center cursor-pointer whitespace-nowrap ${
            !dockCollapsed ? 'gba-btn-active' : 'text-[#facc15]'
          }`}
        >
          <span className="text-[8px]">🛠️ STATIONS</span>
        </button>

        {/* 8-Bit Mono Chiptune BGM Toggle */}
        <button
          type="button"
          tabIndex={-1}
          aria-label={hud.bgmEnabled ? 'Mute 8-Bit BGM [B]' : 'Play 8-Bit BGM [B]'}
          title="Toggle 8-Bit Mono Chiptune BGM [B]"
          onClick={(e) => {
            e.currentTarget.blur();
            onToggleBgm();
          }}
          className={`gba-btn px-1.5 h-6 flex items-center justify-center cursor-pointer whitespace-nowrap ${
            hud.bgmEnabled ? 'gba-btn-active' : ''
          }`}
        >
          <span className="text-[8px]">♪ BGM:{hud.bgmEnabled ? 'ON' : 'OFF'}</span>
        </button>

        {/* SFX Toggle */}
        <button
          type="button"
          tabIndex={-1}
          aria-label={hud.muted ? 'Unmute SFX [M]' : 'Mute SFX [M]'}
          title="Toggle SFX [M]"
          onClick={(e) => {
            e.currentTarget.blur();
            onToggleMute();
          }}
          className="gba-btn px-1.5 h-6 flex items-center justify-center cursor-pointer whitespace-nowrap"
        >
          <span className="text-[8px]">🔊 SFX:{hud.muted ? 'OFF' : 'ON'}</span>
        </button>

        {/* Single-File HTML Export Modal */}
        <button
          type="button"
          tabIndex={-1}
          aria-label="View Single-File HTML Code"
          title="View Single-File HTML Code"
          onClick={(e) => {
            e.currentTarget.blur();
            onOpenCodeModal();
          }}
          className="gba-btn px-1.5 h-6 flex items-center justify-center text-[#86efac] cursor-pointer"
        >
          <span className="text-[8px]">HTML</span>
        </button>

        {/* Pause Button */}
        <button
          type="button"
          tabIndex={-1}
          aria-label="Pause Game [P]"
          title="Pause Game [P]"
          onClick={(e) => {
            e.currentTarget.blur();
            onPause();
          }}
          className="gba-btn w-6 h-6 flex items-center justify-center cursor-pointer"
        >
          <span className="text-[8px]">II</span>
        </button>

        {/* Restart Button */}
        <button
          type="button"
          tabIndex={-1}
          aria-label="Restart Shift [R]"
          title="Restart Shift [R]"
          onClick={(e) => {
            e.currentTarget.blur();
            onRestart();
          }}
          className="gba-btn px-1.5 h-6 hidden sm:flex items-center justify-center cursor-pointer"
        >
          <span className="text-[8px]">RST</span>
        </button>
      </div>
    </header>
  );
};

interface FloatingCanvasQuickBarProps {
  hud: HudSnapshot;
  onSmartStep: () => void;
  onWaterAllDaisies: () => void;
  onHireStaff: () => void;
  onPetCats: () => void;
  onToggleRoom: () => void;
}

/**
 * Touch-friendly floating quick-action buttons positioned in the bottom-right corner
 * of the canvas stage so mobile & landscape players can play effortlessly with the bottom dock hidden by default!
 */
export const FloatingCanvasQuickBar: React.FC<FloatingCanvasQuickBarProps> = ({
  hud,
  onSmartStep,
  onWaterAllDaisies,
  onHireStaff,
  onPetCats,
  onToggleRoom,
}) => {
  const orderRecipe = hud.waitingCustomerOrder ? RECIPES[hud.waitingCustomerOrder] : null;

  let smartLabel = '⚡ BREW / SERVE';
  if (hud.currentStepIndex === 3) {
    smartLabel = '⚡ SERVE GUEST!';
  } else if (orderRecipe) {
    const nextSt = orderRecipe.steps[hud.currentStepIndex];
    const shortMap: Record<StationId, string> = {
      grinder: '⚡ STEP 1: GRIND',
      espresso: '⚡ STEP 2: SHOT',
      milk_frother: '⚡ STEP 2: FOAM',
      kettle: '⚡ STEP 1: BOIL',
      tea_leaves: '⚡ STEP 2: STEEP',
      cup_counter: '⚡ STEP 3: POUR',
      watering_can: '⚡ WATER',
      trash: '⚡ CLEAR',
    };
    smartLabel = shortMap[nextSt] ?? '⚡ BREW / SERVE';
  }

  return (
    <div className="pointer-events-auto flex flex-wrap items-center justify-end gap-1.5">
      <button
        type="button"
        data-testid="quick-smart-step-btn"
        onClick={(e) => {
          e.currentTarget.blur();
          onSmartStep();
        }}
        className="gba-btn gba-btn-active px-2.5 py-1.5 text-[9px] cursor-pointer shadow-lg"
      >
        {smartLabel}
      </button>

      <button
        type="button"
        data-testid="quick-water-btn"
        onClick={(e) => {
          e.currentTarget.blur();
          onWaterAllDaisies();
        }}
        className="gba-btn px-2 py-1.5 text-[9px] text-[#7dd3fc] cursor-pointer shadow-lg"
      >
        💧 WATER {hud.thirstyDaisyCount > 0 ? `(${hud.thirstyDaisyCount})` : ''}
      </button>

      <button
        type="button"
        data-testid="quick-hire-btn"
        onClick={(e) => {
          e.currentTarget.blur();
          onHireStaff();
        }}
        className="gba-btn px-2 py-1.5 text-[9px] text-[#86efac] cursor-pointer shadow-lg"
      >
        👩‍🍳 HIRE ({hud.hiredStaffCount}/2)
      </button>

      <button
        type="button"
        data-testid="quick-pet-cat-btn"
        onClick={(e) => {
          e.currentTarget.blur();
          onPetCats();
        }}
        className="gba-btn px-2 py-1.5 text-[9px] text-[#fb7185] cursor-pointer shadow-lg"
      >
        🐾 PET CAT
      </button>

      <button
        type="button"
        data-testid="quick-room-btn"
        onClick={(e) => {
          e.currentTarget.blur();
          onToggleRoom();
        }}
        className="gba-btn px-2 py-1.5 text-[9px] text-[#facc15] cursor-pointer shadow-lg"
      >
        🚪 {hud.room === 'inside' ? 'TO GARDEN' : 'TO INSIDE'}
      </button>
    </div>
  );
};

interface BottomActionDockProps {
  hud: HudSnapshot;
  collapsed: boolean;
  onTriggerStation: (stationId: StationId) => void;
  onServeCustomer: () => void;
  onWaterAllDaisies: () => void;
  onToggleMiataHeadlights: () => void;
  onPetCats: () => void;
}

export const BottomActionDock: React.FC<BottomActionDockProps> = ({
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

  const orderRecipe = hud.waitingCustomerOrder ? RECIPES[hud.waitingCustomerOrder] : null;
  const activeRecipe = hud.activeDrink ? RECIPES[hud.activeDrink] : null;

  let nextStationId: StationId | null = null;
  if (orderRecipe && hud.currentStepIndex < 3) {
    nextStationId = orderRecipe.steps[hud.currentStepIndex];
  }

  return (
    <footer
      data-testid="bottom-stations-dock"
      className="w-full bg-[#0b0d12] border-t-[3px] border-[#f8fafc] px-1.5 py-1 shrink-0 flex flex-wrap items-center justify-center gap-1 overflow-x-hidden"
    >
      <StationDockButton
        label="Grinder"
        roleClue="Step 1 · Coffee"
        hotkey="1"
        isRecommended={nextStationId === 'grinder'}
        onClick={() => onTriggerStation('grinder')}
      />

      <StationDockButton
        label="Espresso"
        roleClue="Step 2 · Mocha"
        hotkey="2"
        isRecommended={nextStationId === 'espresso'}
        onClick={() => onTriggerStation('espresso')}
      />

      <StationDockButton
        label="Frother"
        roleClue="Step 2 · Foam"
        hotkey="3"
        isRecommended={nextStationId === 'milk_frother'}
        onClick={() => onTriggerStation('milk_frother')}
      />

      <StationDockButton
        label="Kettle"
        roleClue="Step 1 · Water"
        hotkey="4"
        isRecommended={nextStationId === 'kettle'}
        onClick={() => onTriggerStation('kettle')}
      />

      <StationDockButton
        label="Tea Leaves"
        roleClue="Step 2 · Tea"
        hotkey="5"
        isRecommended={nextStationId === 'tea_leaves'}
        onClick={() => onTriggerStation('tea_leaves')}
      />

      <StationDockButton
        label="Pour Cup"
        roleClue="Step 3 · Cup"
        hotkey="Space"
        isRecommended={nextStationId === 'cup_counter'}
        onClick={() => onTriggerStation('cup_counter')}
      />

      {/* Serve Drink Action */}
      <button
        type="button"
        onClick={(e) => {
          e.currentTarget.blur();
          onServeCustomer();
        }}
        className={`gba-btn px-1.5 py-0.5 text-left cursor-pointer whitespace-nowrap shrink-0 ${
          hud.currentStepIndex === 3 ? 'gba-btn-active' : ''
        }`}
      >
        <div className="flex items-center gap-1">
          <span className="gba-keycap">Enter</span>
          <span className="text-[8px]">
            {hud.currentStepIndex === 3 && activeRecipe
              ? `Serve ${activeRecipe.shortName}`
              : 'Serve Drink'}
          </span>
        </div>
        <div className="text-sm font-['VT323'] leading-none mt-0.5 opacity-90">
          {hud.currentStepIndex === 3 ? '★ Hand to Guest!' : 'Needs Step 3 Cup'}
        </div>
      </button>

      {/* Water Daisies Action */}
      <button
        type="button"
        onClick={(e) => {
          e.currentTarget.blur();
          onWaterAllDaisies();
        }}
        className="gba-btn px-1.5 py-0.5 text-left cursor-pointer whitespace-nowrap shrink-0"
      >
        <div className="flex items-center gap-1">
          <span className="gba-keycap">W</span>
          <span className="text-[8px]">Water Daisies</span>
        </div>
        <div className="text-sm font-['VT323'] leading-none mt-0.5 text-[#7dd3fc] tabular-nums">
          {hud.weather === 'rain'
            ? '🌧️ Rain Hydrating!'
            : hud.thirstyDaisyCount > 0
              ? `${Math.round(hud.thirstyDaisyCount)} thirsty · +2c`
              : '6 Beds Hydrated'}
        </div>
      </button>

      {/* 1990 Miata MX-5 Pop-Up Headlights Toggle */}
      <button
        type="button"
        onClick={(e) => {
          e.currentTarget.blur();
          onToggleMiataHeadlights();
        }}
        className="gba-btn px-1.5 py-0.5 text-left cursor-pointer whitespace-nowrap shrink-0"
      >
        <div className="flex items-center gap-1">
          <span className="gba-keycap">H</span>
          <span className="text-[8px]">Miata Lights</span>
        </div>
        <div className="text-sm font-['VT323'] leading-none mt-0.5 text-[#facc15]">
          {hud.miataHeadlightsOn ? 'Pop-Ups: ON ★' : 'Pop-Ups: OFF'}
        </div>
      </button>

      {/* Pet Cats Lilo & Champy */}
      <button
        type="button"
        onClick={(e) => {
          e.currentTarget.blur();
          onPetCats();
        }}
        className="gba-btn px-1.5 py-0.5 text-left cursor-pointer whitespace-nowrap shrink-0"
      >
        <div className="flex items-center gap-1">
          <span className="gba-keycap">C</span>
          <span className="text-[8px]">Pet Cats</span>
        </div>
        <div className="text-sm font-['VT323'] leading-none mt-0.5 text-[#fb7185]">
          Lilo &amp; Champy ♥
        </div>
      </button>
    </footer>
  );
};

interface StationDockButtonProps {
  label: string;
  roleClue: string;
  hotkey: string;
  isRecommended: boolean;
  onClick: () => void;
}

const StationDockButton: React.FC<StationDockButtonProps> = ({
  label,
  roleClue,
  hotkey,
  isRecommended,
  onClick,
}) => {
  return (
    <button
      type="button"
      onClick={(e) => {
        e.currentTarget.blur();
        onClick();
      }}
      className={`gba-btn px-1.5 py-0.5 text-left cursor-pointer whitespace-nowrap shrink-0 ${
        isRecommended ? 'gba-btn-active' : ''
      }`}
    >
      <div className="flex items-center gap-1">
        <span className="gba-keycap">{hotkey}</span>
        <span className="text-[8px]">{label}</span>
      </div>
      <div className="text-sm font-['VT323'] leading-none mt-0.5 opacity-90">{roleClue}</div>
    </button>
  );
};
