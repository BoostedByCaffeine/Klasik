export type DrinkId =
  | 'midnight_cold_brew'
  | 'daisy_vanilla_latte'
  | 'miata_mocha'
  | 'catnip_herbal_tea';

export type ViewMode = 'all' | 'indoor' | 'outdoor';

export interface DrinkRecipe {
  id: DrinkId;
  name: string;
  shortName: string;
  price: number;
  steps: [StationId, StationId, StationId];
  stepLabels: [string, string, string];
  color: string;
  accentColor: string;
  description: string;
}

export type StationId =
  | 'grinder'
  | 'espresso'
  | 'milk_frother'
  | 'kettle'
  | 'tea_leaves'
  | 'cup_counter'
  | 'watering_can'
  | 'trash';

export interface StationConfig {
  id: StationId;
  name: string;
  shortLabel: string;
  x: number;
  y: number;
  width: number;
  height: number;
  processDuration: number;
  hotkey: string;
}

export interface PrepSlotState {
  activeDrink: DrinkId | null;
  currentStepIndex: number; // 0 = empty, 1 = step 1 done, 2 = step 2 done, 3 = ready to serve
  processingStation: StationId | null;
  processTimer: number;
  processDuration: number;
  holdingWateringCan: boolean;
  waterCharges: number;
}

export interface DaisyPatch {
  id: string;
  name: string;
  x: number;
  y: number;
  hydration: number; // 0..100
  needsWater: boolean; // true when hydration <= 55
  lastWateredAt: number;
  bloomStage: 1 | 2 | 3;
}

export type CatBehaviorState =
  | 'walking'
  | 'sitting_grooming'
  | 'pouncing'
  | 'napping'
  | 'purring';

export interface CatCompanion {
  id: 'lilo' | 'champy';
  name: 'Lilo' | 'Champy';
  coatColor: 'white' | 'black';
  eyeColor: string;
  collarColor: string;
  x: number;
  y: number;
  targetX: number;
  targetY: number;
  nextStateAfterWalk: CatBehaviorState;
  state: CatBehaviorState;
  stateTimer: number;
  tailPhase: number;
  heartTimer: number;
  hopPhase: number;
  facing: 'left' | 'right';
}

export interface CustomerEntity {
  id: string;
  name: string;
  spriteVariant: number; // 0..3
  order: DrinkId;
  state: 'walking_in' | 'waiting' | 'sipping' | 'walking_out';
  x: number;
  y: number;
  targetX: number;
  targetY: number;
  seatIndex: number | null;
  sipTimer: number;
  heartsGiven: number;
  dialogueText: string;
  arrivalTime: number;
  walkDist: number;
}

export interface FloatingTextPopup {
  id: string;
  text: string;
  x: number;
  y: number;
  vy: number;
  life: number;
  maxLife: number;
  color: string;
}

export interface CafeState {
  mode: 'title' | 'playing' | 'paused' | 'gameover';
  viewMode: ViewMode;
  dayNumber: number;
  servedCount: number;
  dailyTarget: number;
  coins: number;
  hearts: number;
  cozyRating: number; // 0..100
  bestCozyRating: number;
  elapsedSeconds: number;
  miataHeadlightsOn: boolean;
  catPetBonus: number;
  prep: PrepSlotState;
  daisies: DaisyPatch[];
  cats: CatCompanion[];
  customers: CustomerEntity[];
  popups: FloatingTextPopup[];
  barista: {
    x: number;
    y: number;
    targetX: number;
    targetY: number;
    facing: 'up' | 'down' | 'left' | 'right';
    walkDist: number;
    scaleX: number;
    scaleY: number;
    speedBoostTimer: number;
  };
  lastMessage: string;
}

export const RECIPES: Record<DrinkId, DrinkRecipe> = {
  midnight_cold_brew: {
    id: 'midnight_cold_brew',
    name: 'Midnight Cold Brew',
    shortName: 'Cold Brew',
    price: 14,
    steps: ['grinder', 'milk_frother', 'cup_counter'],
    stepLabels: ['1. Grind & Cold Tap [1]', '2. Sweet Cream Foam [3]', '3. Pour Tall Cup [Space]'],
    color: '#18181b',
    accentColor: '#f8fafc',
    description: 'Jet-black cold-steeped coffee topped with a monochrome sweet cream cap.',
  },
  daisy_vanilla_latte: {
    id: 'daisy_vanilla_latte',
    name: 'Daisy Vanilla Latte',
    shortName: 'Daisy Latte',
    price: 16,
    steps: ['grinder', 'milk_frother', 'cup_counter'],
    stepLabels: ['1. Grind Beans [1]', '2. Espresso + Oat Foam [3]', '3. Daisy Garnish Cup [Space]'],
    color: '#d6a87c',
    accentColor: '#fef08a',
    description: 'Velvety vanilla espresso crowned with steamed milk and a fresh white daisy.',
  },
  miata_mocha: {
    id: 'miata_mocha',
    name: "'90s Miata Mocha",
    shortName: 'Miata Mocha',
    price: 18,
    steps: ['grinder', 'espresso', 'cup_counter'],
    stepLabels: ['1. Grind Dark Roast [1]', '2. Pull Double Shot [2]', '3. Dark Mocha Cup [Space]'],
    color: '#3f2318',
    accentColor: '#f43f5e',
    description: 'High-revving double espresso blended with dark garage cocoa.',
  },
  catnip_herbal_tea: {
    id: 'catnip_herbal_tea',
    name: 'Catnip Herbal Tea',
    shortName: 'Catnip Tea',
    price: 15,
    steps: ['kettle', 'tea_leaves', 'cup_counter'],
    stepLabels: ['1. Boil Kettle [4]', '2. Steep Green Tea [5]', '3. Pour Herbal Cup [Space]'],
    color: '#10b981',
    accentColor: '#d1fae5',
    description: 'Soothing organic green tea & garden mint loved by Lilo and Champy.',
  },
};

export const STATIONS: StationConfig[] = [
  {
    id: 'grinder',
    name: 'Monochrome Grinder & Cold Tap',
    shortLabel: 'Grinder',
    x: 204,
    y: 148,
    width: 62,
    height: 46,
    processDuration: 0.6,
    hotkey: '1',
  },
  {
    id: 'espresso',
    name: 'Chrome Dual-Group Espresso',
    shortLabel: 'Espresso',
    x: 280,
    y: 148,
    width: 66,
    height: 46,
    processDuration: 0.6,
    hotkey: '2',
  },
  {
    id: 'milk_frother',
    name: 'Sweet Cream & Oat Frother',
    shortLabel: 'Frother',
    x: 356,
    y: 148,
    width: 62,
    height: 46,
    processDuration: 0.6,
    hotkey: '3',
  },
  {
    id: 'kettle',
    name: 'Matte-Black Gooseneck Kettle',
    shortLabel: 'Kettle',
    x: 432,
    y: 148,
    width: 62,
    height: 46,
    processDuration: 0.6,
    hotkey: '4',
  },
  {
    id: 'tea_leaves',
    name: 'Catnip & Daisy Tea Caddy',
    shortLabel: 'Tea Leaves',
    x: 508,
    y: 148,
    width: 62,
    height: 46,
    processDuration: 0.6,
    hotkey: '5',
  },
  {
    id: 'trash',
    name: 'Garage Knock-Box & Bin',
    shortLabel: 'Clear',
    x: 580,
    y: 148,
    width: 52,
    height: 46,
    processDuration: 0,
    hotkey: 'X',
  },
  {
    id: 'watering_can',
    name: 'Slate Garden Watering Can',
    shortLabel: 'Water Can',
    x: 224,
    y: 238,
    width: 64,
    height: 44,
    processDuration: 0,
    hotkey: 'W',
  },
  {
    id: 'cup_counter',
    name: 'Monochrome Pickup Bar',
    shortLabel: 'Serve Cup',
    x: 392,
    y: 238,
    width: 112,
    height: 44,
    processDuration: 0.25,
    hotkey: 'Space',
  },
];

export const INITIAL_DAISIES: DaisyPatch[] = [
  { id: 'daisy-nw', name: 'West Patio Planter', x: 78, y: 162, hydration: 38, needsWater: true, lastWateredAt: 0, bloomStage: 2 },
  { id: 'daisy-sw', name: 'Veranda Corner Planter', x: 78, y: 318, hydration: 82, needsWater: false, lastWateredAt: 0, bloomStage: 3 },
  { id: 'daisy-s1', name: 'Garden Walk Left Bed', x: 226, y: 426, hydration: 42, needsWater: true, lastWateredAt: 0, bloomStage: 2 },
  { id: 'daisy-s2', name: 'Garden Walk Right Bed', x: 548, y: 426, hydration: 88, needsWater: false, lastWateredAt: 0, bloomStage: 3 },
  { id: 'daisy-ne', name: 'Garage Driveway Planter', x: 812, y: 426, hydration: 34, needsWater: true, lastWateredAt: 0, bloomStage: 2 },
];

export const INITIAL_CATS: CatCompanion[] = [
  {
    id: 'lilo',
    name: 'Lilo',
    coatColor: 'white',
    eyeColor: '#38bdf8', // Bright Blue Eyes
    collarColor: '#2563eb', // Blue Collar
    x: 734,
    y: 268, // Napping squarely on the 1990 Miata MX-5 front hood
    targetX: 734,
    targetY: 268,
    nextStateAfterWalk: 'napping',
    state: 'napping',
    stateTimer: 5.5,
    tailPhase: 0,
    heartTimer: 0,
    hopPhase: 0,
    facing: 'left',
  },
  {
    id: 'champy',
    name: 'Champy',
    coatColor: 'black',
    eyeColor: '#22c55e', // Bright Green Eyes
    collarColor: '#14b8a6', // Bluish-Green Collar
    x: 256,
    y: 356,
    targetX: 306,
    targetY: 368,
    nextStateAfterWalk: 'sitting_grooming',
    state: 'walking',
    stateTimer: 4.0,
    tailPhase: 1.5,
    heartTimer: 0,
    hopPhase: 0,
    facing: 'right',
  },
];

export const GARDEN_TABLES = [
  { x: 226, y: 356 },
  { x: 548, y: 364 },
];

// 1990 Mazda Miata MX-5 (NA) parked in the right-hand Indoor Checkered Garage Bay
export const MIATA_GARAGE_BOUNDS = {
  x: 742,
  y: 242,
  width: 116,
  height: 178,
};

export const NPC_NAMES = ['Flora', 'Milo', 'Takumi', 'Clara', 'Keisuke', 'Hazel', 'Suki', 'Oliver'];

export function spawnPopup(
  state: CafeState,
  text: string,
  x: number,
  y: number,
  color = '#facc15'
) {
  state.popups.push({
    id: `pop-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
    text,
    x,
    y,
    vy: -26,
    life: 1.35,
    maxLife: 1.35,
    color,
  });
  if (state.popups.length > 16) {
    state.popups.shift();
  }
}

export function createInitialCafeState(autostart = false): CafeState {
  const daisies = INITIAL_DAISIES.map((d) => ({ ...d }));
  const cats = INITIAL_CATS.map((c) => ({ ...c }));
  const initialCustomer: CustomerEntity = {
    id: 'cust-1',
    name: 'Flora',
    spriteVariant: 0,
    order: 'miata_mocha',
    state: 'waiting',
    x: 392,
    y: 322,
    targetX: 392,
    targetY: 322,
    seatIndex: null,
    sipTimer: 0,
    heartsGiven: 0,
    dialogueText: "One '90s Miata Mocha!",
    arrivalTime: 0,
    walkDist: 0,
  };

  return {
    mode: autostart ? 'playing' : 'title',
    viewMode: 'all',
    dayNumber: 1,
    servedCount: 0,
    dailyTarget: 6,
    coins: 25,
    hearts: 3,
    cozyRating: calculateCozyRating(daisies, 3, 0),
    bestCozyRating: 85,
    elapsedSeconds: 0,
    miataHeadlightsOn: true,
    catPetBonus: 0,
    prep: {
      activeDrink: null,
      currentStepIndex: 0,
      processingStation: null,
      processTimer: 0,
      processDuration: 0,
      holdingWateringCan: false,
      waterCharges: 0,
    },
    daisies,
    cats,
    customers: [initialCustomer],
    popups: [],
    barista: {
      x: 336,
      y: 196,
      targetX: 336,
      targetY: 196,
      facing: 'down',
      walkDist: 0,
      scaleX: 1,
      scaleY: 1,
      speedBoostTimer: 0,
    },
    lastMessage: "Flora ordered a '90s Miata Mocha! Tap ⚡ Smart Step or [1] Grinder → [2] Espresso → [Space] Cup.",
  };
}

export function calculateCozyRating(
  daisies: DaisyPatch[],
  hearts: number,
  catPetBonus = 0
): number {
  if (daisies.length === 0) return 60;
  const avgHydration = daisies.reduce((sum, d) => sum + d.hydration, 0) / daisies.length;
  const hydratedCount = daisies.filter((d) => !d.needsWater).length;
  const gardenScore = avgHydration * 0.5 + (hydratedCount / daisies.length) * 30;
  const heartBonus = Math.min(15, hearts * 1.5);
  return Math.max(15, Math.min(100, Math.round(gardenScore + heartBonus + catPetBonus)));
}

/**
 * Returns the exact next StationId required for the active drink or waiting customer's order.
 */
export function getRecommendedStation(state: CafeState): StationId | null {
  const prep = state.prep;
  if (prep.currentStepIndex >= 3) return null;

  const waitingCustomer = state.customers.find((c) => c.state === 'waiting');
  const targetDrinkId: DrinkId | null =
    prep.activeDrink ?? (waitingCustomer ? waitingCustomer.order : 'miata_mocha');

  if (!targetDrinkId) return null;
  const recipe = RECIPES[targetDrinkId];
  return recipe.steps[prep.currentStepIndex] ?? null;
}

export function cycleViewMode(state: CafeState): ViewMode {
  const order: ViewMode[] = ['all', 'indoor', 'outdoor'];
  const nextIdx = (order.indexOf(state.viewMode) + 1) % order.length;
  state.viewMode = order[nextIdx];
  const labels: Record<ViewMode, string> = {
    all: 'VIEW: ALL (Split Indoor Cafe & Outdoor Daisy Garden)',
    indoor: 'VIEW: INDOOR (Monochrome Cafe & 1990 Miata Garage Bay)',
    outdoor: 'VIEW: OUTDOOR (Blooming Daisy Garden Patio)',
  };
  state.lastMessage = labels[state.viewMode];
  return state.viewMode;
}

export interface StationInteractionResult {
  handled: boolean;
  actionType:
    | 'start_step'
    | 'already_busy'
    | 'wrong_station'
    | 'equip_can'
    | 'clear_tray'
    | 'drink_ready';
  message: string;
}

export function interactWithStation(
  state: CafeState,
  stationId: StationId
): StationInteractionResult {
  const prep = state.prep;

  // If a station is currently processing, auto-complete it if the player clicks the next station
  // OR if they click the same station when it's >35% done so fast tapping never feels stuck!
  if (prep.processingStation !== null && prep.processTimer > 0) {
    if (stationId === prep.processingStation) {
      if (prep.processTimer <= prep.processDuration * 0.65) {
        prep.processingStation = null;
        prep.processTimer = 0;
        prep.currentStepIndex = Math.min(3, prep.currentStepIndex + 1);
        state.lastMessage = `Step ${prep.currentStepIndex}/3 finished!`;
        return {
          handled: true,
          actionType: prep.currentStepIndex === 3 ? 'drink_ready' : 'start_step',
          message: state.lastMessage,
        };
      }
      return {
        handled: false,
        actionType: 'already_busy',
        message: 'Brewing in progress — watch the progress bar above the station!',
      };
    }
    prep.processingStation = null;
    prep.processTimer = 0;
    prep.currentStepIndex = Math.min(3, prep.currentStepIndex + 1);
  }

  if (stationId === 'trash') {
    prep.activeDrink = null;
    prep.currentStepIndex = 0;
    prep.processingStation = null;
    prep.processTimer = 0;
    prep.holdingWateringCan = false;
    state.lastMessage = 'Cleared counter tray and reset tools.';
    return { handled: true, actionType: 'clear_tray', message: state.lastMessage };
  }

  if (stationId === 'watering_can') {
    prep.holdingWateringCan = !prep.holdingWateringCan;
    if (prep.holdingWateringCan) {
      prep.waterCharges = 3;
      state.lastMessage = 'Equipped Slate Watering Can! Click any daisy planter or press [W].';
    } else {
      state.lastMessage = 'Returned Watering Can to the indoor stand.';
    }
    return { handled: true, actionType: 'equip_can', message: state.lastMessage };
  }

  prep.holdingWateringCan = false;

  const station = STATIONS.find((s) => s.id === stationId);
  const speedMultiplier = state.barista.speedBoostTimer > 0 ? 0.72 : 1.0;
  const duration = (station ? station.processDuration : 0.6) * speedMultiplier;
  const waitingCustomer = state.customers.find((c) => c.state === 'waiting');

  // STEP 0 -> STEP 1
  if (prep.currentStepIndex === 0) {
    if (stationId === 'grinder') {
      const custOrder = waitingCustomer?.order;
      const initialCoffee: DrinkId =
        custOrder && custOrder !== 'catnip_herbal_tea' ? custOrder : 'miata_mocha';
      prep.activeDrink = initialCoffee;
      prep.processingStation = 'grinder';
      prep.processDuration = duration;
      prep.processTimer = duration;
      state.lastMessage =
        initialCoffee === 'midnight_cold_brew'
          ? 'Step 1/3: Extracting Midnight Cold Brew concentrate...'
          : `Step 1/3: Grinding fresh beans for ${RECIPES[initialCoffee].shortName}...`;
      return { handled: true, actionType: 'start_step', message: state.lastMessage };
    }
    if (stationId === 'kettle') {
      prep.activeDrink = 'catnip_herbal_tea';
      prep.processingStation = 'kettle';
      prep.processDuration = duration;
      prep.processTimer = duration;
      state.lastMessage = 'Step 1/3: Boiling spring water in the matte-black kettle...';
      return { handled: true, actionType: 'start_step', message: state.lastMessage };
    }
    const recStation = getRecommendedStation(state);
    const recConfig = STATIONS.find((s) => s.id === recStation);
    state.lastMessage = `Next up: Click ${recConfig?.shortLabel ?? 'Grinder'} [${recConfig?.hotkey ?? '1'}] (follow the ▼ NEXT arrow)!`;
    return { handled: false, actionType: 'wrong_station', message: state.lastMessage };
  }

  // STEP 1 -> STEP 2
  if (prep.currentStepIndex === 1) {
    if (prep.activeDrink !== 'catnip_herbal_tea') {
      if (stationId === 'espresso') {
        const custOrder = waitingCustomer?.order;
        prep.activeDrink =
          custOrder === 'daisy_vanilla_latte' || custOrder === 'midnight_cold_brew'
            ? custOrder
            : 'miata_mocha';
        prep.processingStation = 'espresso';
        prep.processDuration = duration;
        prep.processTimer = duration;
        state.lastMessage = "Step 2/3: Pulling rich double shot for '90s Miata Mocha...";
        return { handled: true, actionType: 'start_step', message: state.lastMessage };
      }
      if (stationId === 'milk_frother') {
        const custOrder = waitingCustomer?.order;
        prep.activeDrink =
          custOrder === 'midnight_cold_brew'
            ? 'midnight_cold_brew'
            : custOrder === 'miata_mocha'
              ? 'miata_mocha'
              : 'daisy_vanilla_latte';
        prep.processingStation = 'milk_frother';
        prep.processDuration = duration;
        prep.processTimer = duration;
        state.lastMessage =
          prep.activeDrink === 'midnight_cold_brew'
            ? 'Step 2/3: Whipping silky Sweet Cream Cold Foam...'
            : 'Step 2/3: Steaming velvety vanilla oat foam...';
        return { handled: true, actionType: 'start_step', message: state.lastMessage };
      }
      state.lastMessage = 'Step 2/3: Click Espresso [2] or Frother [3] (highlighted with ▼ NEXT)!';
      return { handled: false, actionType: 'wrong_station', message: state.lastMessage };
    } else {
      if (stationId === 'tea_leaves') {
        prep.processingStation = 'tea_leaves';
        prep.processDuration = duration;
        prep.processTimer = duration;
        state.lastMessage = 'Step 2/3: Steeping organic Catnip & Green Tea leaves...';
        return { handled: true, actionType: 'start_step', message: state.lastMessage };
      }
      state.lastMessage = 'Step 2/3: Click Tea Leaves [5] (highlighted with ▼ NEXT)!';
      return { handled: false, actionType: 'wrong_station', message: state.lastMessage };
    }
  }

  // STEP 2 -> STEP 3 (Finish Cup on Counter)
  if (prep.currentStepIndex === 2) {
    if (stationId === 'cup_counter') {
      prep.processingStation = 'cup_counter';
      prep.processDuration = duration;
      prep.processTimer = duration;
      const recipe = prep.activeDrink ? RECIPES[prep.activeDrink] : null;
      state.lastMessage = `Step 3/3: Pouring ${recipe?.name ?? 'drink'} at the Pickup Bar...`;
      return { handled: true, actionType: 'start_step', message: state.lastMessage };
    }
    state.lastMessage = 'Step 3/3: Click Pour Cup [Space] on the Pickup Bar to finish!';
    return { handled: false, actionType: 'wrong_station', message: state.lastMessage };
  }

  if (prep.currentStepIndex === 3 && prep.activeDrink) {
    return {
      handled: true,
      actionType: 'drink_ready',
      message: `${RECIPES[prep.activeDrink].name} is ready! Press [Enter] or click customer to serve.`,
    };
  }

  return {
    handled: false,
    actionType: 'wrong_station',
    message: 'Follow the ▼ NEXT arrow over the counter appliances!',
  };
}

/**
 * Executes the next intelligent action for the player (`⚡ Smart Step` button, `[E]`, or clicking the order bubble):
 * - If a station is currently mid-brew, finishes that step immediately so rapid tapping feels snappy.
 * - If `currentStepIndex === 3`, serves the waiting customer.
 * - Otherwise triggers the exact `getRecommendedStation(state)` for the customer's order!
 */
export function executeSmartStep(state: CafeState): {
  type: 'station' | 'serve' | 'none';
  stationId?: StationId;
  servedResult?: ServeResult;
} {
  const prep = state.prep;

  // Complete any in-flight timer first so the user never gets stuck waiting
  if (prep.processingStation !== null && prep.processTimer > 0) {
    prep.processingStation = null;
    prep.processTimer = 0;
    prep.currentStepIndex = Math.min(3, prep.currentStepIndex + 1);
  }

  const waitingCustomer = state.customers.find((c) => c.state === 'waiting');
  if (
    waitingCustomer &&
    prep.activeDrink &&
    prep.activeDrink !== waitingCustomer.order &&
    prep.currentStepIndex < 3
  ) {
    // Align active drink to the waiting customer's order automatically
    prep.activeDrink = waitingCustomer.order;
  }

  if (prep.currentStepIndex === 3 && prep.activeDrink) {
    const servedResult = serveWaitingCustomer(state);
    return { type: 'serve', servedResult };
  }

  const nextStation = getRecommendedStation(state);
  if (nextStation) {
    interactWithStation(state, nextStation);
    return { type: 'station', stationId: nextStation };
  }

  return { type: 'none' };
}

export function advancePrepTimer(state: CafeState, dt: number): boolean {
  const prep = state.prep;
  if (!prep.processingStation || prep.processTimer <= 0) return false;

  prep.processTimer = Math.max(0, prep.processTimer - dt);
  if (prep.processTimer === 0) {
    const finishedStation = prep.processingStation;
    prep.processingStation = null;
    prep.currentStepIndex = Math.min(3, prep.currentStepIndex + 1);
    const recipe = prep.activeDrink ? RECIPES[prep.activeDrink] : null;
    const stObj = STATIONS.find((s) => s.id === finishedStation);
    if (stObj) {
      spawnPopup(state, `✓ ${stObj.shortLabel.toUpperCase()}`, stObj.x, stObj.y - 26, '#4ade80');
    }

    if (prep.currentStepIndex === 1) {
      if (prep.activeDrink === 'catnip_herbal_tea') {
        state.lastMessage = 'Water boiled! Next: Click Tea Leaves [5] (▼ NEXT).';
      } else if (prep.activeDrink === 'miata_mocha') {
        state.lastMessage = 'Roast ground! Next: Click Espresso [2] (▼ NEXT).';
      } else {
        state.lastMessage = 'Grounds ready! Next: Click Frother [3] (▼ NEXT).';
      }
    } else if (prep.currentStepIndex === 2) {
      state.lastMessage = `${recipe?.shortName ?? 'Drink'} brewed! Next: Click Pour Cup [Space] (▼ NEXT).`;
    } else if (prep.currentStepIndex === 3) {
      state.lastMessage = `${recipe?.name ?? 'Drink'} READY! Click Customer, ⚡ Smart Step, or [Enter] to serve!`;
    }
    return true;
  }
  return false;
}

export interface ServeResult {
  served: boolean;
  customer?: CustomerEntity;
  coinsEarned: number;
  heartsEarned: number;
  message: string;
}

export function serveWaitingCustomer(state: CafeState): ServeResult {
  const prep = state.prep;
  if (prep.currentStepIndex < 3 || !prep.activeDrink) {
    return {
      served: false,
      coinsEarned: 0,
      heartsEarned: 0,
      message: 'Finish all 3 prep steps first (or tap ⚡ Smart Step)!',
    };
  }

  const waitingCustomer = state.customers.find((c) => c.state === 'waiting');
  if (!waitingCustomer) {
    return {
      served: false,
      coinsEarned: 0,
      heartsEarned: 0,
      message: 'Wait a moment for the next guest to walk up to the cafe door.',
    };
  }

  const craftedDrink = prep.activeDrink;
  const recipe = RECIPES[craftedDrink];
  const matchesOrder = waitingCustomer.order === craftedDrink;

  if (!matchesOrder) {
    const expected = RECIPES[waitingCustomer.order];
    state.lastMessage = `${waitingCustomer.name} ordered ${expected.shortName}! Clear [X] and brew their order.`;
    return {
      served: false,
      coinsEarned: 0,
      heartsEarned: 0,
      message: state.lastMessage,
    };
  }

  const cozyBonus = state.cozyRating >= 80 ? 5 : state.cozyRating >= 60 ? 3 : 0;
  const coinsEarned = recipe.price + cozyBonus;
  const heartsEarned = state.cozyRating >= 75 ? 2 : 1;

  state.coins += coinsEarned;
  state.hearts += heartsEarned;
  state.servedCount += 1;
  state.cozyRating = calculateCozyRating(state.daisies, state.hearts, state.catPetBonus);
  state.bestCozyRating = Math.max(state.bestCozyRating, state.cozyRating);

  prep.activeDrink = null;
  prep.currentStepIndex = 0;
  prep.processingStation = null;
  prep.processTimer = 0;

  spawnPopup(
    state,
    `+${coinsEarned}c ♥+${heartsEarned}`,
    waitingCustomer.x,
    waitingCustomer.y - 32,
    '#facc15'
  );

  const occupiedSeats = new Set(
    state.customers.filter((c) => c.state === 'sipping' && c.seatIndex !== null).map((c) => c.seatIndex!)
  );
  const freeSeatIdx = GARDEN_TABLES.findIndex((_, idx) => !occupiedSeats.has(idx));

  waitingCustomer.heartsGiven = heartsEarned;
  waitingCustomer.dialogueText = '♥ Pure GBA vibes!';

  if (freeSeatIdx !== -1) {
    waitingCustomer.state = 'sipping';
    waitingCustomer.seatIndex = freeSeatIdx;
    waitingCustomer.targetX = GARDEN_TABLES[freeSeatIdx].x;
    waitingCustomer.targetY = GARDEN_TABLES[freeSeatIdx].y;
    waitingCustomer.sipTimer = 8.5;
  } else {
    waitingCustomer.state = 'walking_out';
    waitingCustomer.targetX = 392;
    waitingCustomer.targetY = 530;
  }

  state.lastMessage = `Served ${recipe.name} to ${waitingCustomer.name}! +${coinsEarned} Coins & +${heartsEarned} ♥`;

  return {
    served: true,
    customer: waitingCustomer,
    coinsEarned,
    heartsEarned,
    message: state.lastMessage,
  };
}

export function waterDaisyPatch(state: CafeState, daisyId: string): boolean {
  const patch = state.daisies.find((d) => d.id === daisyId);
  if (!patch) return false;

  if (!state.prep.holdingWateringCan) {
    state.prep.holdingWateringCan = true;
    state.prep.waterCharges = 3;
  }

  const wasThirsty = patch.needsWater || patch.hydration < 85;
  patch.hydration = 100;
  patch.needsWater = false;
  patch.bloomStage = 3;
  patch.lastWateredAt = state.elapsedSeconds;

  state.prep.waterCharges = Math.max(0, state.prep.waterCharges - 1);
  if (state.prep.waterCharges === 0) {
    state.prep.holdingWateringCan = false;
  }

  if (wasThirsty) {
    state.coins += 2;
  }

  state.cozyRating = calculateCozyRating(state.daisies, state.hearts, state.catPetBonus);
  state.bestCozyRating = Math.max(state.bestCozyRating, state.cozyRating);

  spawnPopup(
    state,
    wasThirsty ? '+💧 COZY! +2c' : '+💧 FRESH!',
    patch.x,
    patch.y - 24,
    '#38bdf8'
  );

  state.lastMessage = `Watered ${patch.name}! +2 Coins & Cozy Rating ${state.cozyRating}%.`;
  return true;
}

export function toggleMiataHeadlights(state: CafeState): boolean {
  state.miataHeadlightsOn = !state.miataHeadlightsOn;
  spawnPopup(
    state,
    state.miataHeadlightsOn ? 'POP-UPS: ON ★' : 'POP-UPS: OFF',
    MIATA_GARAGE_BOUNDS.x,
    MIATA_GARAGE_BOUNDS.y - 40,
    '#facc15'
  );
  state.lastMessage = state.miataHeadlightsOn
    ? '1990 Mazda Miata MX-5 pop-up headlights flipped UP! ★ Wink!'
    : '1990 Mazda Miata MX-5 pop-up headlights retracted DOWN.';
  return state.miataHeadlightsOn;
}

export function petCatCompanion(state: CafeState, catId?: 'lilo' | 'champy'): CatCompanion {
  const targetCat =
    (catId ? state.cats.find((c) => c.id === catId) : null) ??
    state.cats[state.hearts % state.cats.length];

  targetCat.state = 'purring';
  targetCat.stateTimer = 3.6;
  targetCat.heartTimer = 2.4;

  state.hearts += 1;
  state.catPetBonus = Math.min(15, state.catPetBonus + 5);
  state.barista.speedBoostTimer = 6.5;
  state.cozyRating = calculateCozyRating(state.daisies, state.hearts, state.catPetBonus);
  state.bestCozyRating = Math.max(state.bestCozyRating, state.cozyRating);

  spawnPopup(state, `♥ ${targetCat.name.toUpperCase()} ♪`, targetCat.x, targetCat.y - 24, '#fb7185');

  state.lastMessage = `Petted ${targetCat.name}! Purrrr~ ♥♪ +Speed Boost & Cozy Rating ${state.cozyRating}%!`;
  return targetCat;
}
