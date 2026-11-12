export type DrinkId =
  | 'midnight_cold_brew'
  | 'daisy_vanilla_latte'
  | 'miata_mocha'
  | 'catnip_herbal_tea';

export type RoomId = 'inside' | 'garden';
export type TimeOfDay = 'day' | 'sunset' | 'night';
export type WeatherType = 'clear' | 'breeze' | 'rain';

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
  room: RoomId;
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
  room: RoomId;
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
  room: RoomId;
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
  room: RoomId;
  timeOfDay: TimeOfDay;
  timeCycleTimer: number;
  weather: WeatherType;
  weatherCycleTimer: number;
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
    x: 112,
    y: 138,
    width: 64,
    height: 46,
    processDuration: 0.6,
    hotkey: '1',
  },
  {
    id: 'espresso',
    name: 'Chrome Dual-Group Espresso',
    shortLabel: 'Espresso',
    x: 190,
    y: 138,
    width: 68,
    height: 46,
    processDuration: 0.6,
    hotkey: '2',
  },
  {
    id: 'milk_frother',
    name: 'Sweet Cream & Oat Frother',
    shortLabel: 'Frother',
    x: 268,
    y: 138,
    width: 64,
    height: 46,
    processDuration: 0.6,
    hotkey: '3',
  },
  {
    id: 'kettle',
    name: 'Matte-Black Gooseneck Kettle',
    shortLabel: 'Kettle',
    x: 346,
    y: 138,
    width: 64,
    height: 46,
    processDuration: 0.6,
    hotkey: '4',
  },
  {
    id: 'tea_leaves',
    name: 'Catnip & Daisy Tea Caddy',
    shortLabel: 'Tea Leaves',
    x: 424,
    y: 138,
    width: 64,
    height: 46,
    processDuration: 0.6,
    hotkey: '5',
  },
  {
    id: 'trash',
    name: 'Garage Knock-Box & Bin',
    shortLabel: 'Clear',
    x: 498,
    y: 138,
    width: 54,
    height: 46,
    processDuration: 0,
    hotkey: 'X',
  },
  {
    id: 'watering_can',
    name: 'Garden Watering Well & Can',
    shortLabel: 'Water Can',
    x: 450,
    y: 254,
    width: 72,
    height: 54,
    processDuration: 0,
    hotkey: 'W',
  },
  {
    id: 'cup_counter',
    name: 'Monochrome Pickup Bar',
    shortLabel: 'Serve Cup',
    x: 356,
    y: 238,
    width: 112,
    height: 44,
    processDuration: 0.25,
    hotkey: 'Space',
  },
];

// 6 Blooming Daisy Planter Beds arranged around the 900x480 GARDEN map
export const INITIAL_DAISIES: DaisyPatch[] = [
  { id: 'daisy-nw', name: 'Northwest Veranda Bed', x: 110, y: 176, hydration: 42, needsWater: true, lastWateredAt: 0, bloomStage: 2 },
  { id: 'daisy-ne', name: 'Northeast Trellis Bed', x: 790, y: 176, hydration: 86, needsWater: false, lastWateredAt: 0, bloomStage: 3 },
  { id: 'daisy-mw', name: 'West Lawn Planter', x: 110, y: 304, hydration: 38, needsWater: true, lastWateredAt: 0, bloomStage: 2 },
  { id: 'daisy-me', name: 'East Lawn Planter', x: 790, y: 304, hydration: 82, needsWater: false, lastWateredAt: 0, bloomStage: 3 },
  { id: 'daisy-sw', name: 'Southwest Gate Planter', x: 204, y: 424, hydration: 44, needsWater: true, lastWateredAt: 0, bloomStage: 2 },
  { id: 'daisy-se', name: 'Southeast Gate Planter', x: 696, y: 424, hydration: 90, needsWater: false, lastWateredAt: 0, bloomStage: 3 },
];

export const INITIAL_CATS: CatCompanion[] = [
  {
    id: 'lilo',
    name: 'Lilo',
    room: 'inside',
    coatColor: 'white',
    eyeColor: '#38bdf8', // Bright Blue Eyes
    collarColor: '#2563eb', // Blue Collar
    x: 748,
    y: 274, // Napping on the 1990 Miata MX-5 hood inside the Garage Showroom!
    targetX: 748,
    targetY: 274,
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
    room: 'garden',
    coatColor: 'black',
    eyeColor: '#22c55e', // Bright Green Eyes
    collarColor: '#14b8a6', // Bluish-Green Collar
    x: 310,
    y: 332,
    targetX: 356,
    targetY: 344,
    nextStateAfterWalk: 'sitting_grooming',
    state: 'walking',
    stateTimer: 4.0,
    tailPhase: 1.5,
    heartTimer: 0,
    hopPhase: 0,
    facing: 'right',
  },
];

// 3 Indoor Seating Lounge Tables (INSIDE map)
export const INDOOR_TABLES = [
  { x: 132, y: 358 },
  { x: 264, y: 382 },
  { x: 492, y: 358 },
];

// 4 Outdoor Umbrella Lounge Tables (GARDEN map)
export const GARDEN_TABLES = [
  { x: 268, y: 214 },
  { x: 632, y: 214 },
  { x: 268, y: 352 },
  { x: 632, y: 352 },
];

// 1990 Mazda Miata MX-5 (NA) in the Right-Wing Garage Showroom (INSIDE map)
export const MIATA_GARAGE_BOUNDS = {
  x: 748,
  y: 248,
  width: 118,
  height: 180,
};

// Doorway mats for switching between INSIDE and GARDEN maps
export const INSIDE_DOOR_MAT = { x: 356, y: 446, width: 120, height: 34 };
export const GARDEN_DOOR_MAT = { x: 450, y: 102, width: 120, height: 34 };
export const GARDEN_ORDER_WINDOW = { x: 260, y: 82, width: 156, height: 48 };

export const NPC_NAMES = ['Flora', 'Milo', 'Takumi', 'Clara', 'Keisuke', 'Hazel', 'Suki', 'Oliver'];

export function spawnPopup(
  state: CafeState,
  text: string,
  x: number,
  y: number,
  color = '#facc15',
  room: RoomId = state.room
) {
  state.popups.push({
    id: `pop-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
    room,
    text,
    x,
    y,
    vy: -26,
    life: 1.35,
    maxLife: 1.35,
    color,
  });
  if (state.popups.length > 18) {
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
    room: 'inside',
    state: 'waiting',
    x: 356,
    y: 312,
    targetX: 356,
    targetY: 312,
    seatIndex: null,
    sipTimer: 0,
    heartsGiven: 0,
    dialogueText: "One '90s Miata Mocha!",
    arrivalTime: 0,
    walkDist: 0,
  };

  return {
    mode: autostart ? 'playing' : 'title',
    room: 'inside',
    timeOfDay: 'day',
    timeCycleTimer: 45,
    weather: 'clear',
    weatherCycleTimer: 40,
    dayNumber: 1,
    servedCount: 0,
    dailyTarget: 6,
    coins: 25,
    hearts: 3,
    cozyRating: calculateCozyRating(daisies, 3, 0, 'clear'),
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
      x: 296,
      y: 192,
      targetX: 296,
      targetY: 192,
      facing: 'down',
      walkDist: 0,
      scaleX: 1,
      scaleY: 1,
      speedBoostTimer: 0,
    },
    lastMessage:
      "Flora ordered a '90s Miata Mocha! Tap ⚡ Smart Step or [1] Grinder → [2] Espresso → [Space] Cup.",
  };
}

export function calculateCozyRating(
  daisies: DaisyPatch[],
  hearts: number,
  catPetBonus = 0,
  weather: WeatherType = 'clear'
): number {
  if (daisies.length === 0) return 60;
  const avgHydration = daisies.reduce((sum, d) => sum + d.hydration, 0) / daisies.length;
  const hydratedCount = daisies.filter((d) => !d.needsWater).length;
  const gardenScore = avgHydration * 0.5 + (hydratedCount / daisies.length) * 30;
  const heartBonus = Math.min(15, hearts * 1.5);
  const rainBonus = weather === 'rain' ? 8 : weather === 'breeze' ? 3 : 0;
  return Math.max(15, Math.min(100, Math.round(gardenScore + heartBonus + catPetBonus + rainBonus)));
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

/**
 * Switches between the two distinct 900x480 maps (`inside` and `garden`).
 */
export function toggleRoom(state: CafeState, targetRoom?: RoomId): RoomId {
  const nextRoom: RoomId = targetRoom ?? (state.room === 'inside' ? 'garden' : 'inside');
  const changed = state.room !== nextRoom;
  state.room = nextRoom;

  if (changed) {
    if (nextRoom === 'garden') {
      state.barista.x = 450;
      state.barista.y = 148;
      state.barista.targetX = 450;
      state.barista.targetY = 176;
      state.barista.facing = 'down';
      state.lastMessage =
        'Stepped out to the Backyard Daisy Garden! Click any planter or the Watering Well [W].';
    } else {
      state.barista.x = 356;
      state.barista.y = 390;
      state.barista.targetX = 296;
      state.barista.targetY = 192;
      state.barista.facing = 'up';
      state.lastMessage =
        'Entered the Monochrome Coffee Shop & 1990 Miata Garage Showroom!';
    }
  }
  return state.room;
}

/**
 * Cycles Time of Day (`day` -> `sunset` -> `night`) via `[T]` or UI button.
 */
export function cycleTimeOfDay(state: CafeState): TimeOfDay {
  const order: TimeOfDay[] = ['day', 'sunset', 'night'];
  const next = order[(order.indexOf(state.timeOfDay) + 1) % order.length];
  state.timeOfDay = next;
  state.timeCycleTimer = 45;
  const labels: Record<TimeOfDay, string> = {
    day: '☀️ DAYTIME: Bright morning sun illuminates the Cafe & Daisy Garden.',
    sunset: '🌅 SUNSET: Golden-hour glow warms the pendant lamps & Miata showroom!',
    night: '🌙 NIGHT: Cozy midnight vibes — string lanterns, headlights & fireflies glow!',
  };
  state.lastMessage = labels[next];
  return next;
}

/**
 * Cycles Weather (`clear` -> `breeze` -> `rain`) via `[G]` or UI button.
 */
export function cycleWeather(state: CafeState): WeatherType {
  const order: WeatherType[] = ['clear', 'breeze', 'rain'];
  const next = order[(order.indexOf(state.weather) + 1) % order.length];
  state.weather = next;
  state.weatherCycleTimer = 40;
  state.cozyRating = calculateCozyRating(state.daisies, state.hearts, state.catPetBonus, state.weather);
  state.bestCozyRating = Math.max(state.bestCozyRating, state.cozyRating);

  const labels: Record<WeatherType, string> = {
    clear: '⛅ CLEAR SKY: Crisp sunny weather across the Garden Garage Cafe.',
    breeze: '🍃 DAISY BREEZE: Gentle wind carries white daisy petals across the lawn!',
    rain: '🌧️ COZY RAIN: Raindrops hydrate all 6 Daisy beds (+4%/s) & boost Cozy Rating!',
  };
  state.lastMessage = labels[next];
  return next;
}

/**
 * Updates Daisy bed hydration & auto-cycles time/weather over time.
 * When `weather === 'rain'`, all 6 daisy beds regenerate `+4% per second`!
 */
export function advanceEnvironmentAndHydration(state: CafeState, dt: number): boolean {
  let hudChanged = false;

  // Auto-progress Time of Day every 45s
  state.timeCycleTimer -= dt;
  if (state.timeCycleTimer <= 0) {
    cycleTimeOfDay(state);
    hudChanged = true;
  }

  // Auto-progress Weather every 40s
  state.weatherCycleTimer -= dt;
  if (state.weatherCycleTimer <= 0) {
    cycleWeather(state);
    hudChanged = true;
  }

  const prevCozy = state.cozyRating;
  state.daisies.forEach((patch, idx) => {
    if (state.weather === 'rain') {
      // Rain automatically hydrates all 6 Daisy beds at +4% per second!
      patch.hydration = Math.min(100, patch.hydration + 4.0 * dt);
    } else {
      const decayRate = 1.15 + (idx % 3) * 0.1;
      patch.hydration = Math.max(15, patch.hydration - decayRate * dt);
    }
    const nowThirsty = patch.hydration <= 55;
    if (nowThirsty !== patch.needsWater) {
      patch.needsWater = nowThirsty;
      patch.bloomStage = nowThirsty ? 2 : 3;
      hudChanged = true;
    }
  });

  state.cozyRating = calculateCozyRating(
    state.daisies,
    state.hearts,
    state.catPetBonus,
    state.weather
  );
  state.bestCozyRating = Math.max(state.bestCozyRating, state.cozyRating);
  if (state.cozyRating !== prevCozy) {
    hudChanged = true;
  }

  return hudChanged;
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

  if (stationId === 'watering_can') {
    state.room = 'garden';
    prep.holdingWateringCan = !prep.holdingWateringCan;
    if (prep.holdingWateringCan) {
      prep.waterCharges = 3;
      state.lastMessage =
        'Filled Watering Can at the Garden Well! Click any daisy bed or press [W].';
    } else {
      state.lastMessage = 'Returned Watering Can to the Garden Well.';
    }
    return { handled: true, actionType: 'equip_can', message: state.lastMessage };
  }

  // Smart Auto-Switch QoL: Pressing any brewing station automatically switches to INSIDE map!
  if (state.room !== 'inside') {
    state.room = 'inside';
    state.barista.x = 296;
    state.barista.y = 205;
  }

  // Auto-complete any active step if the player clicks the next station or taps rapidly
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
        message: 'Brewing in progress — watch the progress bar above the appliance!',
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

  // STEP 2 -> STEP 3 (Finish Cup on Pickup Bar)
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

export function executeSmartStep(state: CafeState): {
  type: 'station' | 'serve' | 'none';
  stationId?: StationId;
  servedResult?: ServeResult;
} {
  state.room = 'inside';
  const prep = state.prep;

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
      spawnPopup(state, `✓ ${stObj.shortLabel.toUpperCase()}`, stObj.x, stObj.y - 26, '#4ade80', 'inside');
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
      message: 'Wait a moment for the next guest to walk up to the counter.',
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
  state.cozyRating = calculateCozyRating(
    state.daisies,
    state.hearts,
    state.catPetBonus,
    state.weather
  );
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
    '#facc15',
    state.room
  );

  // Seat customer either at an Indoor Lounge Table (seats 0..2) or Outdoor Garden Table (seats 3..6)
  const occupiedSeats = new Set(
    state.customers.filter((c) => c.state === 'sipping' && c.seatIndex !== null).map((c) => c.seatIndex!)
  );
  const allSeats = [
    ...INDOOR_TABLES.map((t, i) => ({ idx: i, room: 'inside' as RoomId, x: t.x, y: t.y })),
    ...GARDEN_TABLES.map((t, i) => ({ idx: i + 3, room: 'garden' as RoomId, x: t.x, y: t.y })),
  ];
  const freeSeat = allSeats.find((s) => !occupiedSeats.has(s.idx));

  waitingCustomer.heartsGiven = heartsEarned;
  waitingCustomer.dialogueText = '♥ Pure GBA vibes!';

  if (freeSeat) {
    waitingCustomer.state = 'sipping';
    waitingCustomer.seatIndex = freeSeat.idx;
    waitingCustomer.room = freeSeat.room;
    if (freeSeat.room === 'garden') {
      waitingCustomer.x = 450;
      waitingCustomer.y = 128;
    }
    waitingCustomer.targetX = freeSeat.x;
    waitingCustomer.targetY = freeSeat.y;
    waitingCustomer.sipTimer = 10.0;
  } else {
    waitingCustomer.state = 'walking_out';
    waitingCustomer.targetX = 356;
    waitingCustomer.targetY = 475;
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

/**
 * Smart Auto-Switch QoL: Watering daisies automatically switches to the `garden` map!
 */
export function waterDaisyPatch(state: CafeState, daisyId: string): boolean {
  const patch = state.daisies.find((d) => d.id === daisyId);
  if (!patch) return false;

  if (state.room !== 'garden') {
    state.room = 'garden';
    state.barista.x = 450;
    state.barista.y = 190;
  }

  state.barista.targetX = Math.max(170, Math.min(730, patch.x));
  state.barista.targetY = Math.max(160, Math.min(400, patch.y));

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

  state.cozyRating = calculateCozyRating(
    state.daisies,
    state.hearts,
    state.catPetBonus,
    state.weather
  );
  state.bestCozyRating = Math.max(state.bestCozyRating, state.cozyRating);

  spawnPopup(
    state,
    wasThirsty ? '+💧 COZY! +2c' : '+💧 FRESH!',
    patch.x,
    patch.y - 24,
    '#38bdf8',
    'garden'
  );

  state.lastMessage = `Watered ${patch.name} in the Backyard Garden! +2 Coins & Cozy Rating ${state.cozyRating}%.`;
  return true;
}

export function toggleMiataHeadlights(state: CafeState): boolean {
  if (state.room !== 'inside') {
    state.room = 'inside';
  }
  state.miataHeadlightsOn = !state.miataHeadlightsOn;
  spawnPopup(
    state,
    state.miataHeadlightsOn ? 'POP-UPS: ON ★' : 'POP-UPS: OFF',
    MIATA_GARAGE_BOUNDS.x,
    MIATA_GARAGE_BOUNDS.y - 40,
    '#facc15',
    'inside'
  );
  state.lastMessage = state.miataHeadlightsOn
    ? '1990 Mazda Miata MX-5 pop-up headlights flipped UP! ★ Wink!'
    : '1990 Mazda Miata MX-5 pop-up headlights retracted DOWN.';
  return state.miataHeadlightsOn;
}

export function petCatCompanion(state: CafeState, catId?: 'lilo' | 'champy'): CatCompanion {
  const sameRoomCat = state.cats.find((c) => c.room === state.room);
  const targetCat =
    (catId ? state.cats.find((c) => c.id === catId) : null) ??
    sameRoomCat ??
    state.cats[state.hearts % state.cats.length];

  targetCat.state = 'purring';
  targetCat.stateTimer = 3.6;
  targetCat.heartTimer = 2.4;

  state.hearts += 1;
  state.catPetBonus = Math.min(15, state.catPetBonus + 5);
  state.barista.speedBoostTimer = 6.5;
  state.cozyRating = calculateCozyRating(
    state.daisies,
    state.hearts,
    state.catPetBonus,
    state.weather
  );
  state.bestCozyRating = Math.max(state.bestCozyRating, state.cozyRating);

  spawnPopup(
    state,
    `♥ ${targetCat.name.toUpperCase()} ♪`,
    targetCat.x,
    targetCat.y - 24,
    '#fb7185',
    targetCat.room
  );

  state.lastMessage = `Petted ${targetCat.name}! Purrrr~ ♥♪ +Speed Boost & Cozy Rating ${state.cozyRating}%!`;
  return targetCat;
}
