export type DrinkId =
  | 'midnight_cold_brew'
  | 'daisy_vanilla_latte'
  | 'miata_mocha'
  | 'catnip_herbal_tea';

export type RoomId = 'inside' | 'garden';
export type TimeOfDay = 'day' | 'sunset' | 'night';
export type WeatherType = 'clear' | 'breeze' | 'rain';
export type MiataPaintColor = 'red' | 'white' | 'black';

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
  | 'napping'
  | 'sitting_grooming'
  | 'stretching'
  | 'yarn_play'
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
  queueSlot: number; // 0 = front counter, 1 = second in queue
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

export interface DatingCouple {
  id: string;
  room: RoomId;
  tableX: number;
  tableY: number;
  partnerAName: string;
  partnerBName: string;
  variantA: number;
  variantB: number;
  quote: string;
  heartPhase: number;
}

export interface PhotoSquadMember {
  name: string;
  x: number;
  y: number;
  variant: number;
  posePhase: number;
}

export interface PhotoSquadState {
  members: PhotoSquadMember[];
  flashTimer: number;
  flashAlpha: number;
  quote: string;
}

export interface StaffWorker {
  id: 'miko' | 'ken';
  name: 'Miko' | 'Ken';
  role: 'auto_barista' | 'auto_server';
  cost: number;
  hired: boolean;
  room: RoomId;
  x: number;
  y: number;
  targetX: number;
  targetY: number;
  actionTimer: number;
  statusText: string;
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
  timeManualOverride: boolean;
  timeCycleTimer: number;
  weather: WeatherType;
  weatherCycleTimer: number;
  dayNumber: number;
  servedCount: number;
  dailyTarget: number;
  shiftGoalReachedShown: boolean;
  shiftSuccessBannerVisible: boolean;
  coins: number;
  tipJarCoins: number;
  hearts: number;
  cozyRating: number; // 0..100
  bestCozyRating: number;
  elapsedSeconds: number;
  miataHeadlightsOn: boolean;
  miataColor: MiataPaintColor;
  catPetBonus: number;
  prep: PrepSlotState;
  daisies: DaisyPatch[];
  cats: CatCompanion[];
  customers: CustomerEntity[];
  couples: DatingCouple[];
  photoSquad: PhotoSquadState;
  staff: StaffWorker[];
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
    color: '#dc2626',
    accentColor: '#fef08a',
    description: 'High-revving double espresso blended with Classic Red garage cocoa.',
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
    processDuration: 0.45,
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
    processDuration: 0.45,
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
    processDuration: 0.45,
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
    processDuration: 0.45,
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
    processDuration: 0.45,
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
    x: 496,
    y: 246, // Playing with yarn / lounging on the Indoor Cafe Rug!
    targetX: 496,
    targetY: 246,
    nextStateAfterWalk: 'yarn_play',
    state: 'yarn_play',
    stateTimer: 4.5,
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
    x: 342,
    y: 326,
    targetX: 342,
    targetY: 326,
    nextStateAfterWalk: 'stretching',
    state: 'stretching',
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
  { x: 244, y: 392 },
  { x: 504, y: 368 },
];

// 2 Garage Showroom Lounge Tables right next to the 1990 Miata MX-5 (INSIDE map)
export const GARAGE_TABLES = [
  { x: 648, y: 166 },
  { x: 648, y: 332 },
];

// 4 Outdoor Umbrella Lounge Tables (GARDEN map)
export const GARDEN_TABLES = [
  { x: 268, y: 214 },
  { x: 632, y: 214 },
  { x: 268, y: 352 },
  { x: 632, y: 352 },
];

// 2-Customer Active Front Counter Queue Slots (INSIDE map)
export const COUNTER_QUEUE_SLOTS = [
  { x: 324, y: 308 },
  { x: 422, y: 322 },
];

// Clickable Counter Tip Jar on the Front Counter (INSIDE map)
export const TIP_JAR_BOUNDS = {
  x: 288,
  y: 228,
  width: 34,
  height: 32,
};

// Clickable Red Mechanic Tool Chest in the Garage Showroom (cycles Miata paint color!)
export const TOOL_CHEST_BOUNDS = {
  x: 652,
  y: 53,
  width: 92,
  height: 38,
};

// Classic Red 1990 Mazda Miata MX-5 (NA) in the Right-Wing Garage Showroom (INSIDE map)
export const MIATA_GARAGE_BOUNDS = {
  x: 786,
  y: 228,
  width: 112,
  height: 172,
};

// Doorway mats for switching between INSIDE and GARDEN maps
export const INSIDE_DOOR_MAT = { x: 356, y: 446, width: 120, height: 34 };
export const GARDEN_DOOR_MAT = { x: 450, y: 102, width: 120, height: 34 };
export const GARDEN_ORDER_WINDOW = { x: 260, y: 82, width: 156, height: 48 };

export const NPC_NAMES = ['Flora', 'Takumi', 'Milo', 'Clara', 'Keisuke', 'Hazel', 'Suki', 'Oliver'];

export const INITIAL_COUPLES: DatingCouple[] = [
  {
    id: 'couple-cafe',
    room: 'inside',
    tableX: 132,
    tableY: 358,
    partnerAName: 'Milo',
    partnerBName: 'Clara',
    variantA: 1,
    variantB: 3,
    quote: 'Best mocha date ♥',
    heartPhase: 0.4,
  },
  {
    id: 'couple-garage',
    room: 'inside',
    tableX: 648,
    tableY: 166,
    partnerAName: 'Keisuke',
    partnerBName: 'Suki',
    variantA: 2,
    variantB: 0,
    quote: 'Classic Red NA ♥',
    heartPhase: 1.8,
  },
  {
    id: 'couple-garden-1',
    room: 'garden',
    tableX: 268,
    tableY: 214,
    partnerAName: 'Oliver',
    partnerBName: 'Hazel',
    variantA: 1,
    variantB: 2,
    quote: 'Daisies & latte~ ♥',
    heartPhase: 0.9,
  },
  {
    id: 'couple-garden-2',
    room: 'garden',
    tableX: 632,
    tableY: 352,
    partnerAName: 'Leo',
    partnerBName: 'Maya',
    variantA: 3,
    variantB: 0,
    quote: 'Garden romance ♥',
    heartPhase: 2.5,
  },
];

export const INITIAL_STAFF: StaffWorker[] = [
  {
    id: 'miko',
    name: 'Miko',
    role: 'auto_barista',
    cost: 35,
    hired: false,
    room: 'inside',
    x: 190,
    y: 182,
    targetX: 190,
    targetY: 182,
    actionTimer: 1.1,
    statusText: 'Auto-Brewing',
    walkDist: 0,
  },
  {
    id: 'ken',
    name: 'Ken',
    role: 'auto_server',
    cost: 50,
    hired: false,
    room: 'inside',
    x: 410,
    y: 196,
    targetX: 410,
    targetY: 196,
    actionTimer: 1.3,
    statusText: 'Auto-Serve & Water',
    walkDist: 0,
  },
];

/**
 * Maps local real-world hour (0..23) to TimeOfDay:
 * - Day: 6am–5pm (`hour >= 6 && hour < 17`)
 * - Sunset: 5pm–7pm (`hour >= 17 && hour < 19`)
 * - Night: 7pm–6am (`hour >= 19 || hour < 6`)
 */
export function getTimeOfDayFromHour(hour: number): TimeOfDay {
  if (hour >= 6 && hour < 17) return 'day';
  if (hour >= 17 && hour < 19) return 'sunset';
  return 'night';
}

export function formatRealClock(date: Date = new Date()): string {
  let hours = date.getHours();
  const minutes = date.getMinutes();
  const ampm = hours >= 12 ? 'PM' : 'AM';
  hours = hours % 12;
  if (hours === 0) hours = 12;
  const minStr = minutes < 10 ? `0${minutes}` : `${minutes}`;
  return `${hours}:${minStr} ${ampm}`;
}

/**
 * Converts pointer clientX/clientY into 100% pixel-accurate 900x480 world coordinates,
 * accounting for `object-fit: contain` letterbox/pillarbox margins on mobile & desktop!
 */
export function screenToWorldContain(
  clientX: number,
  clientY: number,
  rect: { left: number; top: number; width: number; height: number },
  worldW = 900,
  worldH = 480
): { x: number; y: number } {
  if (rect.width <= 0 || rect.height <= 0) return { x: 0, y: 0 };
  const scale = Math.min(rect.width / worldW, rect.height / worldH);
  const renderedW = worldW * scale;
  const renderedH = worldH * scale;
  const offsetX = (rect.width - renderedW) / 2;
  const offsetY = (rect.height - renderedH) / 2;

  const localX = clientX - rect.left - offsetX;
  const localY = clientY - rect.top - offsetY;

  const worldX = Math.max(0, Math.min(worldW, (localX / renderedW) * worldW));
  const worldY = Math.max(0, Math.min(worldH, (localY / renderedH) * worldH));
  return { x: worldX, y: worldY };
}

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
  if (state.popups.length > 22) {
    state.popups.shift();
  }
}

export function createInitialCafeState(autostart = false): CafeState {
  const daisies = INITIAL_DAISIES.map((d) => ({ ...d }));
  const cats = INITIAL_CATS.map((c) => ({ ...c }));
  const couples = INITIAL_COUPLES.map((c) => ({ ...c }));
  const staff = INITIAL_STAFF.map((s) => ({ ...s }));

  // 2 Simultaneous Waiting Customers in the Active Counter Queue!
  const customer1: CustomerEntity = {
    id: 'cust-1',
    name: 'Flora',
    spriteVariant: 0,
    order: 'miata_mocha',
    room: 'inside',
    state: 'waiting',
    queueSlot: 0,
    x: COUNTER_QUEUE_SLOTS[0].x,
    y: COUNTER_QUEUE_SLOTS[0].y,
    targetX: COUNTER_QUEUE_SLOTS[0].x,
    targetY: COUNTER_QUEUE_SLOTS[0].y,
    seatIndex: null,
    sipTimer: 0,
    heartsGiven: 0,
    dialogueText: "One '90s Miata Mocha!",
    arrivalTime: 0,
    walkDist: 0,
  };

  const customer2: CustomerEntity = {
    id: 'cust-2',
    name: 'Takumi',
    spriteVariant: 2,
    order: 'daisy_vanilla_latte',
    room: 'inside',
    state: 'waiting',
    queueSlot: 1,
    x: COUNTER_QUEUE_SLOTS[1].x,
    y: COUNTER_QUEUE_SLOTS[1].y,
    targetX: COUNTER_QUEUE_SLOTS[1].x,
    targetY: COUNTER_QUEUE_SLOTS[1].y,
    seatIndex: null,
    sipTimer: 0,
    heartsGiven: 0,
    dialogueText: 'Daisy Latte next, please!',
    arrivalTime: 0.5,
    walkDist: 0,
  };

  const initialTime = getTimeOfDayFromHour(new Date().getHours());

  return {
    mode: autostart ? 'playing' : 'title',
    room: 'inside',
    timeOfDay: initialTime,
    timeManualOverride: false,
    timeCycleTimer: 45,
    weather: 'clear',
    weatherCycleTimer: 40,
    dayNumber: 1,
    servedCount: 0,
    dailyTarget: 6,
    shiftGoalReachedShown: false,
    shiftSuccessBannerVisible: false,
    coins: 35,
    tipJarCoins: 6,
    hearts: 3,
    cozyRating: calculateCozyRating(daisies, 3, 0, 'clear'),
    bestCozyRating: 85,
    elapsedSeconds: 0,
    miataHeadlightsOn: true,
    miataColor: 'red',
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
    customers: [customer1, customer2],
    couples,
    photoSquad: {
      members: [
        { name: 'Ren', x: 726, y: 368, variant: 1, posePhase: 0 },
        { name: 'Yuki', x: 786, y: 392, variant: 3, posePhase: 1.2 },
        { name: 'Sora', x: 842, y: 368, variant: 2, posePhase: 2.4 },
      ],
      flashTimer: 4.5,
      flashAlpha: 0,
      quote: '📸 Red NA Miata!',
    },
    staff,
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
      "Flora & Takumi are in line! Tap ⚡ BREW / SERVE or any appliance to craft Flora's '90s Miata Mocha.",
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
 * Returns the front-most waiting customer in the counter queue (queueSlot 0 first).
 */
export function getFrontWaitingCustomer(state: CafeState): CustomerEntity | null {
  const waiting = state.customers
    .filter((c) => c.state === 'waiting' || c.state === 'walking_in')
    .sort((a, b) => a.queueSlot - b.queueSlot);
  if (waiting[0] && waiting[0].state === 'walking_in') {
    waiting[0].state = 'waiting';
  }
  return waiting[0] ?? null;
}

/**
 * Returns the exact next StationId required for the active drink or front waiting customer's order.
 */
export function getRecommendedStation(state: CafeState): StationId | null {
  const prep = state.prep;
  if (prep.currentStepIndex >= 3) return null;

  const waitingCustomer = getFrontWaitingCustomer(state);
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
        'Stepped out to the Backyard Daisy Garden! Click any planter or [💧 WATER] to hydrate.';
    } else {
      state.barista.x = 356;
      state.barista.y = 390;
      state.barista.targetX = 296;
      state.barista.targetY = 192;
      state.barista.facing = 'up';
      state.lastMessage =
        'Entered the Monochrome Coffee Shop & Classic Red 1990 Miata Showroom!';
    }
  }
  return state.room;
}

/**
 * Manually cycles Time of Day (`day` -> `sunset` -> `night`) via `[T]` or UI button.
 */
export function cycleTimeOfDay(state: CafeState): TimeOfDay {
  const order: TimeOfDay[] = ['day', 'sunset', 'night'];
  const next = order[(order.indexOf(state.timeOfDay) + 1) % order.length];
  state.timeOfDay = next;
  state.timeManualOverride = true;
  state.timeCycleTimer = 60;
  const labels: Record<TimeOfDay, string> = {
    day: '☀️ DAYTIME (Manual): Bright morning sun illuminates the Cafe & Daisy Garden.',
    sunset: '🌅 SUNSET (Manual): Smooth radial golden-hour glow warms the Miata showroom!',
    night: '🌙 NIGHT (Manual): Cozy midnight vibes — radial lantern glows, headlights & fireflies!',
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
 * Cycles the 1990 Mazda Miata MX-5 custom paint job when clicking the Garage Tool Chest.
 */
export function cycleMiataPaintColor(state: CafeState): MiataPaintColor {
  state.room = 'inside';
  const order: MiataPaintColor[] = ['red', 'white', 'black'];
  const next = order[(order.indexOf(state.miataColor) + 1) % order.length];
  state.miataColor = next;
  const labelMap: Record<MiataPaintColor, string> = {
    red: 'PAINT: CLASSIC RED ★',
    white: 'PAINT: CRYSTAL WHITE',
    black: 'PAINT: MONO BLACK',
  };
  spawnPopup(
    state,
    labelMap[next],
    MIATA_GARAGE_BOUNDS.x,
    MIATA_GARAGE_BOUNDS.y - 48,
    '#facc15',
    'inside'
  );
  state.lastMessage = `Custom respray at the Tool Chest! 1990 Miata MX-5 is now ${labelMap[next].replace('PAINT: ', '')}.`;
  return next;
}

/**
 * Collects accumulated coins from the clickable Counter Tip Jar.
 */
export function collectTipJar(state: CafeState): number {
  if (state.tipJarCoins <= 0) {
    state.lastMessage = 'Tip Jar is empty right now — serve drinks to fill it up!';
    return 0;
  }
  const amount = state.tipJarCoins;
  state.coins += amount;
  state.tipJarCoins = 0;
  spawnPopup(state, `+${amount}c 💰 TIPS!`, TIP_JAR_BOUNDS.x, TIP_JAR_BOUNDS.y - 22, '#facc15', 'inside');
  state.lastMessage = `Collected +${amount} Coins from the Counter Tip Jar!`;
  return amount;
}

/**
 * Triggers a camera flash from the Miata Photo Squad in the Garage Showroom.
 */
export function triggerPhotoSquadFlash(state: CafeState): number {
  state.photoSquad.flashAlpha = 1.0;
  state.photoSquad.flashTimer = 6.5;
  const quotes = ['📸 FLASH! So clean!', '📸 Pop-ups! ♥', '📸 JDM Legend! ★', '📸 Red NA Miata!'];
  state.photoSquad.quote = quotes[Math.floor(state.elapsedSeconds) % quotes.length];
  const bonus = 4;
  state.coins += bonus;
  spawnPopup(
    state,
    `📸 FLASH! +${bonus}c`,
    MIATA_GARAGE_BOUNDS.x,
    MIATA_GARAGE_BOUNDS.y + 82,
    '#fef08a',
    'inside'
  );
  return bonus;
}

/**
 * Hires the next available Cafe Worker (`miko` for $35, then `ken` for $50).
 */
export function hireNextStaff(state: CafeState): {
  hired: boolean;
  worker?: StaffWorker;
  message: string;
} {
  const nextWorker = state.staff.find((s) => !s.hired);
  if (!nextWorker) {
    state.lastMessage = 'Both Cafe Workers (Miko & Ken) are already hired and working hard!';
    return { hired: false, message: state.lastMessage };
  }

  if (state.coins < nextWorker.cost) {
    state.lastMessage = `Need $${nextWorker.cost} to hire ${nextWorker.name} (${
      nextWorker.id === 'miko' ? 'Auto-Barista' : 'Auto-Server & Gardener'
    })! You have $${state.coins}.`;
    return { hired: false, message: state.lastMessage };
  }

  state.coins -= nextWorker.cost;
  nextWorker.hired = true;
  nextWorker.actionTimer = 0.6;

  spawnPopup(
    state,
    `👩‍🍳 HIRED ${nextWorker.name.toUpperCase()}!`,
    nextWorker.x,
    nextWorker.y - 28,
    '#4ade80',
    'inside'
  );

  state.lastMessage =
    nextWorker.id === 'miko'
      ? 'Hired Miko (Auto-Barista)! She automatically brews Steps 1, 2 & 3 behind the bar!'
      : 'Hired Ken (Auto-Server & Gardener)! He automatically serves drinks & waters daisies!';

  return { hired: true, worker: nextWorker, message: state.lastMessage };
}

/**
 * Updates Daisy bed hydration, real-time clock sync, Miata photo squad flashes, and hired staff AI.
 */
export function advanceEnvironmentAndHydration(state: CafeState, dt: number): boolean {
  let hudChanged = false;

  // Sync Time of Day with real local clock unless manually overridden
  if (!state.timeManualOverride) {
    const syncedTime = getTimeOfDayFromHour(new Date().getHours());
    if (syncedTime !== state.timeOfDay) {
      state.timeOfDay = syncedTime;
      hudChanged = true;
    }
  }

  // Auto-progress Weather every 40s
  state.weatherCycleTimer -= dt;
  if (state.weatherCycleTimer <= 0) {
    cycleWeather(state);
    hudChanged = true;
  }

  // Update Dating Couples floating heart phase
  state.couples.forEach((couple) => {
    couple.heartPhase += dt * 2.2;
  });

  // Update Miata Photo Squad camera flashes
  if (state.photoSquad.flashAlpha > 0) {
    state.photoSquad.flashAlpha = Math.max(0, state.photoSquad.flashAlpha - dt * 2.4);
  }
  state.photoSquad.members.forEach((m) => {
    m.posePhase += dt * 3.0;
  });
  state.photoSquad.flashTimer -= dt;
  if (state.photoSquad.flashTimer <= 0) {
    triggerPhotoSquadFlash(state);
    hudChanged = true;
  }

  // Update Hired Staff AI (Miko Auto-Barista & Ken Auto-Server/Gardener)
  state.staff.forEach((worker) => {
    if (!worker.hired) return;

    const dx = worker.targetX - worker.x;
    const dy = worker.targetY - worker.y;
    const dist = Math.hypot(dx, dy);
    if (dist > 2) {
      const step = Math.min(dist, 145 * dt);
      worker.x += (dx / dist) * step;
      worker.y += (dy / dist) * step;
      worker.walkDist += step;
    }

    worker.actionTimer -= dt;
    if (worker.actionTimer <= 0) {
      if (worker.id === 'miko') {
        // Miko automatically brews Steps 1, 2, and 3 for waiting customers
        worker.actionTimer = 1.05;
        const frontCust = getFrontWaitingCustomer(state);
        if (frontCust && state.prep.currentStepIndex < 3 && state.prep.processingStation === null) {
          const nextSt = getRecommendedStation(state);
          if (nextSt) {
            const stObj = STATIONS.find((s) => s.id === nextSt);
            if (stObj) {
              worker.targetX = stObj.x;
              worker.targetY = 176;
            }
            interactWithStation(state, nextSt, true);
            hudChanged = true;
          }
        }
      } else if (worker.id === 'ken') {
        // Ken automatically serves finished drinks at Step 3 AND waters thirsty daisies!
        worker.actionTimer = 1.25;
        if (state.prep.currentStepIndex === 3 && state.prep.activeDrink) {
          worker.targetX = 356;
          worker.targetY = 202;
          const res = serveWaitingCustomer(state, true);
          if (res.served) {
            hudChanged = true;
          }
        } else {
          const thirsty = state.daisies.find((d) => d.needsWater);
          if (thirsty) {
            waterDaisyPatch(state, thirsty.id, true);
            hudChanged = true;
          }
        }
      }
    }
  });

  const prevCozy = state.cozyRating;
  state.daisies.forEach((patch, idx) => {
    if (state.weather === 'rain') {
      // Rain automatically hydrates all 6 Daisy beds at +4% per second!
      patch.hydration = Math.min(100, patch.hydration + 4.0 * dt);
    } else {
      const decayRate = 1.05 + (idx % 3) * 0.1;
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
  stationId?: StationId;
}

/**
 * Smooth, non-dropping station interaction:
 * - If a step is currently in progress, clicking ANY station immediately completes the in-progress step
 *   AND starts the next step in the same click without dropping inputs!
 * - If the player taps any brewing appliance while a customer is waiting, automatically aligns with
 *   the customer's next recipe step so mobile touch input never feels clunky or rejected.
 */
export function interactWithStation(
  state: CafeState,
  stationId: StationId,
  fromAutoStaff = false
): StationInteractionResult {
  const prep = state.prep;

  if (stationId === 'watering_can') {
    waterAllThirstyDaisies(state);
    return { handled: true, actionType: 'equip_can', message: state.lastMessage };
  }

  // Smart Auto-Switch QoL: Pressing any brewing station automatically switches to INSIDE map (unless triggered by background AI)
  if (!fromAutoStaff && state.room !== 'inside') {
    state.room = 'inside';
    state.barista.x = 296;
    state.barista.y = 205;
  }

  // If a step is currently processing, smoothly complete it right now AND continue to start the next step!
  if (prep.processingStation !== null && prep.processTimer > 0) {
    const finishedSt = STATIONS.find((s) => s.id === prep.processingStation);
    if (finishedSt) {
      spawnPopup(
        state,
        `✓ ${finishedSt.shortLabel.toUpperCase()}`,
        finishedSt.x,
        finishedSt.y - 26,
        '#4ade80',
        'inside'
      );
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

  const waitingCustomer = getFrontWaitingCustomer(state);

  // If drink is already at Step 3, report drink_ready
  if (prep.currentStepIndex === 3 && prep.activeDrink) {
    return {
      handled: true,
      actionType: 'drink_ready',
      message: `${RECIPES[prep.activeDrink].name} is ready! Press [Enter] or click customer to serve.`,
      stationId: 'cup_counter',
    };
  }

  // Ensure activeDrink matches the front waiting customer's order if one is waiting
  if (waitingCustomer && (!prep.activeDrink || prep.currentStepIndex === 0)) {
    prep.activeDrink = waitingCustomer.order;
  } else if (!prep.activeDrink) {
    prep.activeDrink = stationId === 'kettle' ? 'catnip_herbal_tea' : 'miata_mocha';
  }

  const recipe = RECIPES[prep.activeDrink];
  const expectedStationId = recipe.steps[prep.currentStepIndex];

  // Smooth Mobile QoL: If the player clicks any brewing station (or if auto-completing the previous step advanced us to the next step),
  // automatically use the expected station for the current step so no click is ever wasted!
  const effectiveStationId: StationId = expectedStationId ?? stationId;
  const station = STATIONS.find((s) => s.id === effectiveStationId);
  const speedMultiplier = state.barista.speedBoostTimer > 0 ? 0.68 : 1.0;
  const duration = (station ? station.processDuration : 0.45) * speedMultiplier;

  prep.processingStation = effectiveStationId;
  prep.processDuration = duration;
  prep.processTimer = duration;

  const stepNum = prep.currentStepIndex + 1;
  state.lastMessage = `Step ${stepNum}/3: ${recipe.stepLabels[prep.currentStepIndex]} (${recipe.name})...`;

  return {
    handled: true,
    actionType: 'start_step',
    message: state.lastMessage,
    stationId: effectiveStationId,
  };
}

export function executeSmartStep(state: CafeState): {
  type: 'station' | 'serve' | 'none';
  stationId?: StationId;
  servedResult?: ServeResult;
} {
  state.room = 'inside';
  const prep = state.prep;

  // If a station is currently processing, complete it immediately AND proceed!
  if (prep.processingStation !== null && prep.processTimer > 0) {
    const finishedSt = STATIONS.find((s) => s.id === prep.processingStation);
    if (finishedSt) {
      spawnPopup(
        state,
        `✓ ${finishedSt.shortLabel.toUpperCase()}`,
        finishedSt.x,
        finishedSt.y - 26,
        '#4ade80',
        'inside'
      );
    }
    prep.processingStation = null;
    prep.processTimer = 0;
    prep.currentStepIndex = Math.min(3, prep.currentStepIndex + 1);
  }

  const waitingCustomer = getFrontWaitingCustomer(state);
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
    const res = interactWithStation(state, nextStation);
    return { type: 'station', stationId: res.stationId ?? nextStation };
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

    if (prep.currentStepIndex < 3 && recipe) {
      state.lastMessage = `Step ${prep.currentStepIndex}/3 done! Next: ${recipe.stepLabels[prep.currentStepIndex]}`;
    } else if (prep.currentStepIndex === 3) {
      state.lastMessage = `${recipe?.name ?? 'Drink'} READY! Tap ⚡ BREW / SERVE, Customer, or [Enter] to serve!`;
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
  goalJustReached?: boolean;
  message: string;
}

export function serveWaitingCustomer(state: CafeState, fromAutoStaff = false): ServeResult {
  const prep = state.prep;
  if (prep.currentStepIndex < 3 || !prep.activeDrink) {
    return {
      served: false,
      coinsEarned: 0,
      heartsEarned: 0,
      message: 'Finish all 3 prep steps first (or tap ⚡ BREW / SERVE)!',
    };
  }

  const waitingCustomer = getFrontWaitingCustomer(state);
  if (!waitingCustomer) {
    return {
      served: false,
      coinsEarned: 0,
      heartsEarned: 0,
      message: 'Wait a moment for the next guest to walk up to the counter.',
    };
  }

  // Align drink with waitingCustomer so players never get stuck with a mismatched drink
  const craftedDrink = waitingCustomer.order;
  const recipe = RECIPES[craftedDrink];

  const cozyBonus = state.cozyRating >= 80 ? 5 : state.cozyRating >= 60 ? 3 : 0;
  const coinsEarned = recipe.price + cozyBonus;
  const heartsEarned = state.cozyRating >= 75 ? 2 : 1;

  state.coins += coinsEarned;
  state.tipJarCoins += 3;
  state.hearts += heartsEarned;
  state.servedCount += 1;

  let goalJustReached = false;
  if (state.servedCount >= state.dailyTarget && !state.shiftGoalReachedShown) {
    state.shiftGoalReachedShown = true;
    state.shiftSuccessBannerVisible = true;
    goalJustReached = true;
  }

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
    'inside'
  );

  // Seat customer at an Indoor Lounge Table, Garage Showroom Table, or Outdoor Garden Table
  const occupiedSeats = new Set(
    state.customers.filter((c) => c.state === 'sipping' && c.seatIndex !== null).map((c) => c.seatIndex!)
  );
  const allSeats = [
    { idx: 0, room: 'inside' as RoomId, x: INDOOR_TABLES[1].x, y: INDOOR_TABLES[1].y },
    { idx: 1, room: 'inside' as RoomId, x: INDOOR_TABLES[2].x, y: INDOOR_TABLES[2].y },
    { idx: 2, room: 'inside' as RoomId, x: GARAGE_TABLES[1].x, y: GARAGE_TABLES[1].y },
    { idx: 3, room: 'garden' as RoomId, x: GARDEN_TABLES[1].x, y: GARDEN_TABLES[1].y },
    { idx: 4, room: 'garden' as RoomId, x: GARDEN_TABLES[2].x, y: GARDEN_TABLES[2].y },
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
    waitingCustomer.sipTimer = 9.0;
  } else {
    waitingCustomer.state = 'walking_out';
    waitingCustomer.targetX = 356;
    waitingCustomer.targetY = 475;
  }

  // Advance remaining queue customers forward to Slot 0!
  const remainingQueue = state.customers
    .filter((c) => c.id !== waitingCustomer.id && (c.state === 'waiting' || c.state === 'walking_in'))
    .sort((a, b) => a.queueSlot - b.queueSlot);

  remainingQueue.forEach((c, idx) => {
    c.queueSlot = idx;
    if (idx === 0) {
      c.state = 'waiting';
    }
    const slot = COUNTER_QUEUE_SLOTS[Math.min(idx, COUNTER_QUEUE_SLOTS.length - 1)];
    c.targetX = slot.x;
    c.targetY = slot.y;
  });

  // Immediately spawn a replacement customer at the back of the 2-slot queue if needed
  const drinkKeys: DrinkId[] = [
    'midnight_cold_brew',
    'daisy_vanilla_latte',
    'miata_mocha',
    'catnip_herbal_tea',
  ];
  while (
    state.customers.filter((c) => c.state === 'waiting' || c.state === 'walking_in').length < 2
  ) {
    const activeQ = state.customers.filter(
      (c) => c.state === 'waiting' || c.state === 'walking_in'
    );
    const slotIdx = activeQ.length;
    const slot = COUNTER_QUEUE_SLOTS[Math.min(slotIdx, COUNTER_QUEUE_SLOTS.length - 1)];
    const seq = state.servedCount + slotIdx + 2;
    const nextOrder = drinkKeys[seq % drinkKeys.length];
    const nextName = NPC_NAMES[seq % NPC_NAMES.length];
    const nextRecipe = RECIPES[nextOrder];
    state.customers.push({
      id: `cust-auto-${state.servedCount}-${slotIdx}-${Math.round(state.elapsedSeconds * 100)}`,
      name: nextName,
      spriteVariant: seq % 4,
      order: nextOrder,
      room: 'inside',
      state: slotIdx === 0 ? 'waiting' : 'walking_in',
      queueSlot: slotIdx,
      x: slot.x,
      y: slotIdx === 0 ? slot.y : 455,
      targetX: slot.x,
      targetY: slot.y,
      seatIndex: null,
      sipTimer: 0,
      heartsGiven: 0,
      dialogueText: `One ${nextRecipe.shortName}, please!`,
      arrivalTime: state.elapsedSeconds,
      walkDist: 0,
    });
  }

  state.lastMessage = goalJustReached
    ? `★ SHIFT SUCCESS! Daily goal (${state.servedCount}/${state.dailyTarget}) reached! Keep serving or finish shift.`
    : `${fromAutoStaff ? 'Ken served' : 'Served'} ${recipe.name} to ${waitingCustomer.name}! +${coinsEarned}c & +3c in Tip Jar!`;

  return {
    served: true,
    customer: waitingCustomer,
    coinsEarned,
    heartsEarned,
    goalJustReached,
    message: state.lastMessage,
  };
}

/**
 * Immediately hydrates a target Daisy bed without clunky movement locks.
 */
export function waterDaisyPatch(
  state: CafeState,
  daisyId: string,
  fromAutoStaff = false
): boolean {
  const patch = state.daisies.find((d) => d.id === daisyId);
  if (!patch) return false;

  if (!fromAutoStaff) {
    state.barista.scaleX = 1.14;
    state.barista.scaleY = 0.86;
  }

  const wasThirsty = patch.needsWater || patch.hydration < 85;
  patch.hydration = 100;
  patch.needsWater = false;
  patch.bloomStage = 3;
  patch.lastWateredAt = state.elapsedSeconds;

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

  state.lastMessage = `${fromAutoStaff ? 'Ken watered' : 'Watered'} ${patch.name}! +2 Coins & Cozy Rating ${state.cozyRating}%.`;
  return true;
}

/**
 * Immediately hydrates all thirsty daisy beds at once when pressing `[💧 WATER]` or `[W]`,
 * without forcing clunky room or movement locks!
 */
export function waterAllThirstyDaisies(state: CafeState): DaisyPatch[] {
  const thirsty = state.daisies.filter((d) => d.needsWater || d.hydration < 90);
  const targets = thirsty.length > 0 ? thirsty : [state.daisies[0]];

  let bonusCoins = 0;
  targets.forEach((patch) => {
    const wasThirsty = patch.needsWater || patch.hydration < 85;
    patch.hydration = 100;
    patch.needsWater = false;
    patch.bloomStage = 3;
    patch.lastWateredAt = state.elapsedSeconds;
    if (wasThirsty) bonusCoins += 2;
    spawnPopup(state, '+💧 HYDRATED!', patch.x, patch.y - 24, '#38bdf8', 'garden');
  });

  state.coins += bonusCoins;
  state.cozyRating = calculateCozyRating(
    state.daisies,
    state.hearts,
    state.catPetBonus,
    state.weather
  );
  state.bestCozyRating = Math.max(state.bestCozyRating, state.cozyRating);

  state.lastMessage =
    bonusCoins > 0
      ? `Hydrated ${targets.length} Daisy Bed${targets.length > 1 ? 's' : ''}! +${bonusCoins} Coins & Cozy Rating ${state.cozyRating}%!`
      : `All 6 Daisy Beds are 100% hydrated & blooming! Cozy Rating ${state.cozyRating}%.`;

  return targets;
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
    ? 'Classic Red 1990 Mazda Miata MX-5 pop-up headlights flipped UP! ★ Wink!'
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
