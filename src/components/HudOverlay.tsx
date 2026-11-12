import React from 'react';
import {
  DrinkId,
  RECIPES,
  StationId,
  RoomId,
  TimeOfDay,
  WeatherType,
} from '../game/rules';

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
  speedBoostActive: boolean;
  waitingCustomerName: string | null;
  waitingCustomerOrder: DrinkId | null;
  lastMessage: string;
  muted: boolean;
  bgmEnabled: boolean;
  room: RoomId;
  timeOfDay: TimeOfDay;
  weather: WeatherType;
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

  return (
    <header className="w-full bg-[#0b0d12] border-b-[3px] border-[#f8fafc] px-2 py-1 shrink-0 flex flex-wrap items-center justify-between gap-1.5 overflow-x-hidden">
      {/* Compact GBA Stat Strip */}
      <div className="gba-frame px-2 py-1 flex flex-wrap items-center gap-2 shrink-0">
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

        {/* Served */}
        <div className="flex items-center gap-1">
          <span className="text-[8px] font-['Press_Start_2P'] text-[#94a3b8]">SRV</span>
          <span
            data-testid="hud-served"
            className="text-xs font-['Press_Start_2P'] text-[#f8fafc] tabular-nums"
          >
            {Math.round(hud.servedCount)}/{Math.round(hud.dailyTarget)}
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

        {hud.servedCount >= hud.dailyTarget && (
          <button
            type="button"
            onClick={(e) => {
              e.currentTarget.blur();
              onFinishShift();
            }}
            className="gba-btn gba-btn-active px-2 py-0.5 text-[8px] cursor-pointer whitespace-nowrap shrink-0"
          >
            FINISH ★
          </button>
        )}
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

      {/* Right Room, Time, Weather, Audio & Utility Controls (Wraps cleanly without horizontal scroll) */}
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

        {/* Collapsible Bottom Action Dock Toggle */}
        <button
          type="button"
          tabIndex={-1}
          aria-expanded={!dockCollapsed}
          aria-label={dockCollapsed ? 'Show Recipes & Controls' : 'Hide Bottom Action Dock'}
          onClick={(e) => {
            e.currentTarget.blur();
            onToggleDock();
          }}
          className="gba-btn px-1.5 h-6 flex items-center justify-center text-[#facc15] cursor-pointer whitespace-nowrap"
        >
          <span className="text-[8px]">{dockCollapsed ? '▲ DOCK' : '▼ DOCK'}</span>
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
  onWaterNextDaisy: () => void;
  onPetCats: () => void;
  onToggleRoom: () => void;
}

/**
 * Touch-friendly floating quick-action buttons positioned in the bottom-right corner
 * of the canvas stage so mobile & landscape players can play effortlessly even with the dock hidden!
 */
export const FloatingCanvasQuickBar: React.FC<FloatingCanvasQuickBarProps> = ({
  hud,
  onSmartStep,
  onWaterNextDaisy,
  onPetCats,
  onToggleRoom,
}) => {
  const orderRecipe = hud.waitingCustomerOrder ? RECIPES[hud.waitingCustomerOrder] : null;

  let smartLabel = '⚡ Smart Step';
  if (hud.currentStepIndex === 3) {
    smartLabel = '⚡ Serve Guest!';
  } else if (orderRecipe) {
    const nextSt = orderRecipe.steps[hud.currentStepIndex];
    const shortMap: Record<StationId, string> = {
      grinder: '⚡ Step 1: Grind',
      espresso: '⚡ Step 2: Shot',
      milk_frother: '⚡ Step 2: Foam',
      kettle: '⚡ Step 1: Boil',
      tea_leaves: '⚡ Step 2: Steep',
      cup_counter: '⚡ Step 3: Pour',
      watering_can: '⚡ Water',
      trash: '⚡ Clear',
    };
    smartLabel = shortMap[nextSt] ?? '⚡ Smart Step';
  }

  return (
    <div className="pointer-events-auto flex flex-wrap items-center justify-end gap-1.5">
      <button
        type="button"
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
        onClick={(e) => {
          e.currentTarget.blur();
          onWaterNextDaisy();
        }}
        className="gba-btn px-2 py-1.5 text-[9px] text-[#7dd3fc] cursor-pointer shadow-lg"
      >
        💧 Water {hud.thirstyDaisyCount > 0 ? `(${hud.thirstyDaisyCount})` : ''}
      </button>

      <button
        type="button"
        onClick={(e) => {
          e.currentTarget.blur();
          onPetCats();
        }}
        className="gba-btn px-2 py-1.5 text-[9px] text-[#fb7185] cursor-pointer shadow-lg"
      >
        🐾 Pet Cat
      </button>

      <button
        type="button"
        onClick={(e) => {
          e.currentTarget.blur();
          onToggleRoom();
        }}
        className="gba-btn px-2 py-1.5 text-[9px] text-[#facc15] cursor-pointer shadow-lg"
      >
        🚪 Room: {hud.room === 'inside' ? 'INSIDE' : 'GARDEN'}
      </button>
    </div>
  );
};

interface BottomActionDockProps {
  hud: HudSnapshot;
  collapsed: boolean;
  onTriggerStation: (stationId: StationId) => void;
  onServeCustomer: () => void;
  onWaterNextDaisy: () => void;
  onToggleMiataHeadlights: () => void;
  onPetCats: () => void;
}

export const BottomActionDock: React.FC<BottomActionDockProps> = ({
  hud,
  collapsed,
  onTriggerStation,
  onServeCustomer,
  onWaterNextDaisy,
  onToggleMiataHeadlights,
  onPetCats,
}) => {
  if (collapsed) {
    return null;
  }

  const orderRecipe = hud.waitingCustomerOrder ? RECIPES[hud.waitingCustomerOrder] : null;
  const activeRecipe = hud.activeDrink ? RECIPES[hud.activeDrink] : null;

  let nextStationId: StationId | null = null;
  if (orderRecipe && hud.currentStepIndex < 3 && !hud.isProcessing) {
    nextStationId = orderRecipe.steps[hud.currentStepIndex];
  }

  return (
    <footer className="w-full bg-[#0b0d12] border-t-[3px] border-[#f8fafc] px-1.5 py-1 shrink-0 flex flex-wrap items-center justify-center gap-1 overflow-x-hidden">
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
          onWaterNextDaisy();
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
