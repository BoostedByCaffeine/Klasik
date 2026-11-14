export type DrinkId =
  | 'midnight_cold_brew'
  | 'daisy_vanilla_latte'
  | 'miata_mocha'
  | 'catnip_herbal_tea';

export type RoomId = 'inside' | 'garden';
export type TimeOfDay = 'day' | 'sunset' | 'night';
export type WeatherType = 'clear' | 'breeze' | 'rain';
export type MiataPaintColor = 'red' | 'white' | 'black';

export type BaristaStyleId =
  | 'monochrome_slate'
  | 'classic_white'
  | 'miata_red'
  | 'daisy_gold'
  | 'matcha_green'
  | 'vintage_sepia'
  | 'vintage_olive'
  | 'vintage_burgundy';

export interface BaristaAppearance {
  name: string;
  hairColorIndex: number; // 0..4
  skinToneIndex: number; // 0..3
  outfitStyleId: BaristaStyleId;
}

export interface HairColorOption {
  id: string;
  label: string;
  main: string;
  highlight: string;
  shade: string;
}

export interface SkinToneOption {
  id: string;
  label: string;
  hex: string;
}

export interface BaristaOutfitOption {
  id: BaristaStyleId;
  label: string;
  bandana: string;
  shirt: string;
  apron: string;
  trim: string;
  isVintage?: boolean;
  unlockStreak?: number;
}

export const HAIR_COLORS: HairColorOption[] = [
  { id: 'espresso_black', label: 'Espresso Black', main: '#18181b', highlight: '#3f3f46', shade: '#090b0e' },
  { id: 'chestnut_roast', label: 'Chestnut Roast', main: '#7c2d12', highlight: '#b45309', shade: '#451a03' },
  { id: 'honey_blonde', label: 'Honey Blonde', main: '#ca8a04', highlight: '#facc15', shade: '#854d0e' },
  { id: 'cherry_red', label: 'Miata Red', main: '#991b1b', highlight: '#ef4444', shade: '#450a0a' },
  { id: 'silver_ash', label: 'Silver Ash', main: '#64748b', highlight: '#cbd5e1', shade: '#334155' },
];

export const SKIN_TONES: SkinToneOption[] = [
  { id: 'warm_ivory', label: 'Warm Ivory', hex: '#ffedd5' },
  { id: 'golden_sand', label: 'Golden Sand', hex: '#fde68a' },
  { id: 'caramel_tan', label: 'Caramel Tan', hex: '#d97706' },
  { id: 'deep_espresso', label: 'Deep Espresso', hex: '#78350f' },
];

export const BARISTA_OUTFITS: BaristaOutfitOption[] = [
  {
    id: 'monochrome_slate',
    label: 'Monochrome Slate',
    bandana: '#facc15',
    shirt: '#334155',
    apron: '#94a3b8',
    trim: '#0f172a',
  },
  {
    id: 'classic_white',
    label: 'Classic White',
    bandana: '#38bdf8',
    shirt: '#1e293b',
    apron: '#f8fafc',
    trim: '#0f172a',
  },
  {
    id: 'miata_red',
    label: 'Miata Red',
    bandana: '#dc2626',
    shirt: '#18181b',
    apron: '#ef4444',
    trim: '#fef08a',
  },
  {
    id: 'daisy_gold',
    label: 'Daisy Gold',
    bandana: '#fef08a',
    shirt: '#422006',
    apron: '#facc15',
    trim: '#ffffff',
  },
  {
    id: 'matcha_green',
    label: 'Matcha Green',
    bandana: '#4ade80',
    shirt: '#064e3b',
    apron: '#10b981',
    trim: '#d1fae5',
  },
  {
    id: 'vintage_sepia',
    label: "Vintage Sepia '78",
    bandana: '#d97706',
    shirt: '#451a03',
    apron: '#e7d3b0',
    trim: '#78350f',
    isVintage: true,
    unlockStreak: 1,
  },
  {
    id: 'vintage_olive',
    label: 'Vintage Garage Olive',
    bandana: '#f59e0b',
    shirt: '#27272a',
    apron: '#6b7f5e',
    trim: '#fef3c7',
    isVintage: true,
    unlockStreak: 2,
  },
  {
    id: 'vintage_burgundy',
    label: "Vintage '90s Burgundy",
    bandana: '#fde68a',
    shirt: '#1c1917',
    apron: '#881337',
    trim: '#fbbf24',
    isVintage: true,
    unlockStreak: 3,
  },
];

export type UpgradeId =
  | 'direct_trade_beans'
  | 'dual_boiler'
  | 'custom_sleeves'
  | 'miata_merch_stand';

export interface CapitalUpgradeConfig {
  id: UpgradeId;
  name: string;
  cost: number;
  shortBenefit: string;
  description: string;
}

export const CAPITAL_UPGRADES: CapitalUpgradeConfig[] = [
  {
    id: 'direct_trade_beans',
    name: 'Direct-Trade Bean Contract',
    cost: 45,
    shortBenefit: '-$1.50 COGS / cup',
    description: 'Reduces Cost of Goods Sold (COGS) by $1.50 per drink served.',
  },
  {
    id: 'dual_boiler',
    name: 'Dual-Boiler Commercial Espresso',
    cost: 60,
    shortBenefit: '+40% Brew Speed',
    description: 'Increases all station brewing & preparation speeds by +40%.',
  },
  {
    id: 'custom_sleeves',
    name: 'Custom Klasik Cup Sleeves',
    cost: 55,
    shortBenefit: '+$4 Drink Price',
    description: 'Increases the selling price of all signature drinks by +$4.',
  },
  {
    id: 'miata_merch_stand',
    name: '1990 Miata MX-5 Merch & Photo Stand',
    cost: 70,
    shortBenefit: '+$5 Photo Tips',
    description: 'Garage photographers leave +$5 extra in the Tip Jar on every flash.',
  },
];

export type UpgradableStationId =
  | 'grinder'
  | 'espresso'
  | 'milk_frother'
  | 'kettle'
  | 'tea_leaves';

export type StationTier = 1 | 2 | 3;

export interface StationTierMeta {
  level: StationTier;
  name: string;
  subtitle: string;
  prepDuration: number;
  upgradeCost: number;
}

export const STATION_TIER_META: Record<StationTier, StationTierMeta> = {
  1: {
    level: 1,
    name: 'Level 1 (Starter)',
    subtitle: 'Worn Matte Grey · 2.8s Prep',
    prepDuration: 2.8,
    upgradeCost: 0,
  },
  2: {
    level: 2,
    name: 'Level 2 (Pro)',
    subtitle: 'Brushed Stainless & Copper · 1.5s Prep',
    prepDuration: 1.5,
    upgradeCost: 35,
  },
  3: {
    level: 3,
    name: 'Level 3 (Master)',
    subtitle: 'Obsidian & Gold Commercial · 0.65s Prep',
    prepDuration: 0.65,
    upgradeCost: 65,
  },
};

export const UPGRADABLE_STATIONS: Array<{
  id: UpgradableStationId;
  name: string;
  shortLabel: string;
  role: string;
  lvl2Cost: number;
  lvl3Cost: number;
}> = [
  {
    id: 'grinder',
    name: 'Burr Coffee Grinder',
    shortLabel: 'Grinder',
    role: 'Step 1 · Espresso & Cold Brew',
    lvl2Cost: 35,
    lvl3Cost: 65,
  },
  {
    id: 'espresso',
    name: 'Espresso Machine',
    shortLabel: 'Espresso',
    role: 'Step 2 · Pull Double Shot',
    lvl2Cost: 40,
    lvl3Cost: 70,
  },
  {
    id: 'milk_frother',
    name: 'Steam Milk Frother',
    shortLabel: 'Frother',
    role: 'Step 2 · Sweet Cream & Oat Foam',
    lvl2Cost: 35,
    lvl3Cost: 65,
  },
  {
    id: 'kettle',
    name: 'Gooseneck Kettle',
    shortLabel: 'Kettle',
    role: 'Step 1 · Herbal Tea Boil',
    lvl2Cost: 30,
    lvl3Cost: 60,
  },
  {
    id: 'tea_leaves',
    name: 'Tea Infuser Station',
    shortLabel: 'Tea Station',
    role: 'Step 2 · Steep Green Tea & Mint',
    lvl2Cost: 30,
    lvl3Cost: 60,
  },
];

export type DecorItemId =
  | 'checkered_marble_floor'
  | 'vinyl_turntable_neon'
  | 'garage_lift_underglow'
  | 'fairy_string_lanterns'
  | 'stone_koi_fountain'
  | 'daisy_trellis_archways';

export interface DecorShopItem {
  id: DecorItemId;
  name: string;
  room: RoomId;
  cost: number;
  cozyBonus: number;
  shortBenefit: string;
  description: string;
}

export const DECOR_SHOP_ITEMS: DecorShopItem[] = [
  {
    id: 'checkered_marble_floor',
    name: 'Checkered Marble Tile Upgrade',
    room: 'inside',
    cost: 40,
    cozyBonus: 4,
    shortBenefit: 'Polished Marble Floor (+4 Cozy)',
    description: 'Upgrades indoor cafe floor tiles to high-contrast polished Italian marble.',
  },
  {
    id: 'vinyl_turntable_neon',
    name: 'Vintage Vinyl Turntable & Neon Sign',
    room: 'inside',
    cost: 50,
    cozyBonus: 7,
    shortBenefit: 'Turntable + KLASIK Neon (+7 Cozy)',
    description: 'Adds a spinning Hi-Fi record player and glowing "KLASIK" neon wall sign.',
  },
  {
    id: 'garage_lift_underglow',
    name: 'Garage Hydraulic Lift & Neon Underglow',
    room: 'inside',
    cost: 65,
    cozyBonus: 6,
    shortBenefit: 'Pro Lift + Underglow (+6 Cozy)',
    description: 'Upgrades the 1990 Mazda Miata MX-5 bay with hydraulic lift posts and neon underglow.',
  },
  {
    id: 'fairy_string_lanterns',
    name: 'Warm Fairy String Lanterns',
    room: 'garden',
    cost: 40,
    cozyBonus: 5,
    shortBenefit: 'Patio String Bulbs (+5 Cozy)',
    description: 'Strings glowing warm golden pixel bulbs across the entire backyard patio.',
  },
  {
    id: 'stone_koi_fountain',
    name: 'Stone Koi Fountain Upgrade',
    room: 'garden',
    cost: 55,
    cozyBonus: 8,
    shortBenefit: 'Tiered Koi Fountain (+8 Cozy)',
    description: 'Replaces the basic watering well with an animated tiered stone koi fountain.',
  },
  {
    id: 'daisy_trellis_archways',
    name: 'Deluxe Daisy Trellis Archways',
    room: 'garden',
    cost: 50,
    cozyBonus: 6,
    shortBenefit: 'Blooming Archways (+6 Cozy)',
    description: 'Adds blooming white-and-gold daisy archways framing the garden walkways.',
  },
];

export interface BusinessFinanceState {
  grossRevenue: number;
  totalCogs: number;
  payrollExpense: number;
  netProfit: number;
  profitMarginPct: number;
  ingredientStock: number;
  wholesaleRestockCost: number; // $20 for +10 units ($2.00/cup vs $4.00 emergency)
  wholesalePackSize: number; // 10
  upgrades: Record<UpgradeId, boolean>;
}

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
  waypoints?: Array<{ x: number; y: number }>;
  nextStateAfterWalk: CatBehaviorState;
  state: CatBehaviorState;
  stateTimer: number;
  tailPhase: number;
  heartTimer: number;
  hopPhase: number;
  facing: 'left' | 'right';
}

export type CustomerState =
  | 'walking_in'
  | 'waiting'
  | 'walking_to_garden'
  | 'sipping'
  | 'walking_out';

export type CustomerPartyKind = 'solo' | 'couple' | 'friends' | 'family';
export type CustomerPetKind = 'dog' | 'cat' | 'rabbit';

export interface CustomerPartyCompanion {
  name: string;
  spriteVariant: number;
  isChild: boolean;
  offsetX: number;
  offsetY: number;
}

export interface CustomerPartyPet {
  kind: CustomerPetKind;
  name: string;
  x: number;
  y: number;
  facing: 'left' | 'right';
  heartTimer: number;
}

export interface CustomerEntity {
  id: string;
  name: string;
  spriteVariant: number; // 0..3
  order: DrinkId;
  room: RoomId;
  state: CustomerState;
  queueSlot: number; // 0 = front counter, 1 = second, 2 = third
  x: number;
  y: number;
  targetX: number;
  targetY: number;
  waypoints?: Array<{ x: number; y: number }>;
  finalTargetX?: number;
  finalTargetY?: number;
  seatIndex: number | null;
  sipTimer: number;
  sipBubbleTimer: number;
  carryingCup: boolean;
  heartsGiven: number;
  dialogueText: string;
  arrivalTime: number;
  walkDist: number;
  partyKind: CustomerPartyKind;
  partySize: number;
  companions: CustomerPartyCompanion[];
  pet: CustomerPartyPet | null;
  isTakeout?: boolean;
  isGarageVisitor?: boolean;
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
  id: 'momo' | 'ken';
  name: 'Momo' | 'Ken';
  role: 'auto_barista' | 'auto_server';
  cost: number;
  dailySalary: number;
  hired: boolean;
  room: RoomId;
  x: number;
  y: number;
  targetX: number;
  targetY: number;
  waypoints?: Array<{ x: number; y: number }>;
  patrolIndex?: number;
  actionTimer: number;
  statusText: string;
  walkDist: number;
  carryingProp: 'cup' | 'water' | null;
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

export interface AabbCollider {
  id: string;
  room: RoomId;
  x: number; // center X
  y: number; // center Y
  w: number;
  h: number;
}

export const MAX_SIMULTANEOUS_CUSTOMERS = 7;

export interface CafeState {
  mode: 'boot' | 'title' | 'playing' | 'paused' | 'gameover';
  room: RoomId;
  timeOfDay: TimeOfDay;
  timeManualOverride: boolean;
  timeCycleTimer: number;
  weather: WeatherType;
  weatherCycleTimer: number;
  dayNumber: number;
  dailyStreak: number;
  shiftStreakIncremented: boolean;
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
  appearance: BaristaAppearance;
  finance: BusinessFinanceState;
  stationLevels: Record<UpgradableStationId, StationTier>;
  decorOwned: Record<DecorItemId, boolean>;
  decorEquipped: Record<DecorItemId, boolean>;
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
    waypoints?: Array<{ x: number; y: number }>;
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
    name: 'Burr Coffee Grinder',
    shortLabel: 'Grinder',
    x: 112,
    y: 138,
    width: 64,
    height: 46,
    processDuration: 2.8,
    hotkey: '1',
  },
  {
    id: 'espresso',
    name: 'Dual-Group Espresso Machine',
    shortLabel: 'Espresso',
    x: 190,
    y: 138,
    width: 68,
    height: 46,
    processDuration: 2.8,
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
    processDuration: 2.8,
    hotkey: '3',
  },
  {
    id: 'kettle',
    name: 'Gooseneck Kettle',
    shortLabel: 'Kettle',
    x: 346,
    y: 138,
    width: 64,
    height: 46,
    processDuration: 2.8,
    hotkey: '4',
  },
  {
    id: 'tea_leaves',
    name: 'Catnip & Daisy Tea Station',
    shortLabel: 'Tea Leaves',
    x: 424,
    y: 138,
    width: 64,
    height: 46,
    processDuration: 2.8,
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
    processDuration: 0.45,
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
    eyeColor: '#38bdf8',
    collarColor: '#2563eb',
    x: 496,
    y: 246,
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
    eyeColor: '#22c55e',
    collarColor: '#14b8a6',
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

// All 8 Customer Dining Seats: First 4 are Indoor/Garage (idx 0..3), Next 4 are Garden Umbrella Tables (idx 4..7)
// Coordinates sit on the walkable chair/bench perimeter just south of each table collider so seated guests never clip table tops
export const ALL_CUSTOMER_SEATS: Array<{ idx: number; room: RoomId; x: number; y: number }> = [
  { idx: 0, room: 'inside', x: INDOOR_TABLES[0].x, y: INDOOR_TABLES[0].y + 26 },
  { idx: 1, room: 'inside', x: INDOOR_TABLES[1].x, y: INDOOR_TABLES[1].y + 24 },
  { idx: 2, room: 'inside', x: INDOOR_TABLES[2].x, y: INDOOR_TABLES[2].y + 26 },
  { idx: 3, room: 'inside', x: GARAGE_TABLES[1].x, y: GARAGE_TABLES[1].y + 26 },
  { idx: 4, room: 'garden', x: GARDEN_TABLES[0].x, y: GARDEN_TABLES[0].y + 28 },
  { idx: 5, room: 'garden', x: GARDEN_TABLES[1].x, y: GARDEN_TABLES[1].y + 28 },
  { idx: 6, room: 'garden', x: GARDEN_TABLES[2].x, y: GARDEN_TABLES[2].y + 28 },
  { idx: 7, room: 'garden', x: GARDEN_TABLES[3].x, y: GARDEN_TABLES[3].y + 28 },
];

// Active Front Counter Queue Slots (INSIDE map)
export const COUNTER_QUEUE_SLOTS = [
  { x: 324, y: 308 },
  { x: 416, y: 320 },
  { x: 492, y: 308 },
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

/**
 * Universal 2D AABB Colliders for both rooms (`inside` and `garden`).
 * Enforces zero wall/furniture/car/planter clipping for the player barista,
 * hired staff (Momo & Ken), customer parties, and pets.
 */
export const ROOM_COLLIDERS: AabbCollider[] = [
  // INSIDE ROOM COLLIDERS
  { id: 'inside-north-wall', room: 'inside', x: 450, y: 50, w: 860, h: 64 },
  { id: 'inside-west-wall', room: 'inside', x: 18, y: 240, w: 28, h: 460 },
  { id: 'inside-east-wall', room: 'inside', x: 882, y: 240, w: 28, h: 460 },
  { id: 'inside-south-wall-left', room: 'inside', x: 148, y: 468, w: 260, h: 24 },
  { id: 'inside-south-wall-right', room: 'inside', x: 660, y: 468, w: 440, h: 24 },
  // Rear Brewing Bar (x: 68..540, y: 116..164)
  { id: 'rear-brewing-bar', room: 'inside', x: 304, y: 140, w: 468, h: 44 },
  // Front Cashier / Pastry / Pickup Counter (x: 68..428, y: 218..268) — open walkway on right at x >= 445
  { id: 'front-cashier-counter', room: 'inside', x: 248, y: 244, w: 356, h: 44 },
  // Glass Garage Partition Wall (Upper segment y: 20..186, Archway gap y: 188..276, Lower segment y: 278..456)
  { id: 'garage-partition-top', room: 'inside', x: 586, y: 103, w: 16, h: 164 },
  { id: 'garage-partition-bottom', room: 'inside', x: 586, y: 366, w: 16, h: 176 },
  // 1990 Mazda Miata MX-5 in Garage Showroom
  { id: 'miata-mx5-collider', room: 'inside', x: 786, y: 228, w: 88, h: 148 },
  // Garage Tool Chest & Tire Rack along top wall
  { id: 'garage-top-racks', room: 'inside', x: 730, y: 56, w: 256, h: 40 },
  // 3 Indoor Dining Table Tops
  { id: 'indoor-table-0', room: 'inside', x: INDOOR_TABLES[0].x, y: INDOOR_TABLES[0].y - 4, w: 54, h: 24 },
  { id: 'indoor-table-1', room: 'inside', x: INDOOR_TABLES[1].x, y: INDOOR_TABLES[1].y - 4, w: 54, h: 24 },
  { id: 'indoor-table-2', room: 'inside', x: INDOOR_TABLES[2].x, y: INDOOR_TABLES[2].y - 4, w: 54, h: 24 },
  // 2 Garage Lounge Table Tops
  { id: 'garage-table-0', room: 'inside', x: GARAGE_TABLES[0].x, y: GARAGE_TABLES[0].y - 4, w: 48, h: 22 },
  { id: 'garage-table-1', room: 'inside', x: GARAGE_TABLES[1].x, y: GARAGE_TABLES[1].y - 4, w: 48, h: 22 },

  // GARDEN ROOM COLLIDERS
  { id: 'garden-veranda-left', room: 'garden', x: 195, y: 58, w: 350, h: 72 },
  { id: 'garden-veranda-right', room: 'garden', x: 705, y: 58, w: 350, h: 72 },
  { id: 'garden-west-fence', room: 'garden', x: 18, y: 240, w: 28, h: 460 },
  { id: 'garden-east-fence', room: 'garden', x: 882, y: 240, w: 28, h: 460 },
  { id: 'garden-south-fence', room: 'garden', x: 450, y: 468, w: 860, h: 22 },
  // Center Watering Well / Stone Koi Fountain
  { id: 'garden-center-well', room: 'garden', x: 450, y: 254, w: 66, h: 44 },
  // 4 Garden Umbrella Table Tops
  { id: 'garden-table-0', room: 'garden', x: GARDEN_TABLES[0].x, y: GARDEN_TABLES[0].y - 4, w: 54, h: 24 },
  { id: 'garden-table-1', room: 'garden', x: GARDEN_TABLES[1].x, y: GARDEN_TABLES[1].y - 4, w: 54, h: 24 },
  { id: 'garden-table-2', room: 'garden', x: GARDEN_TABLES[2].x, y: GARDEN_TABLES[2].y - 4, w: 54, h: 24 },
  { id: 'garden-table-3', room: 'garden', x: GARDEN_TABLES[3].x, y: GARDEN_TABLES[3].y - 4, w: 54, h: 24 },
  // 6 Blooming Daisy Planter Beds
  { id: 'daisy-bed-nw', room: 'garden', x: 110, y: 176, w: 94, h: 50 },
  { id: 'daisy-bed-ne', room: 'garden', x: 790, y: 176, w: 94, h: 50 },
  { id: 'daisy-bed-mw', room: 'garden', x: 110, y: 304, w: 94, h: 50 },
  { id: 'daisy-bed-me', room: 'garden', x: 790, y: 304, w: 94, h: 50 },
  { id: 'daisy-bed-sw', room: 'garden', x: 204, y: 424, w: 94, h: 50 },
  { id: 'daisy-bed-se', room: 'garden', x: 696, y: 424, w: 94, h: 50 },
];

export function hitsCollider(
  x: number,
  y: number,
  room: RoomId,
  radius = 10
): AabbCollider | null {
  for (let i = 0; i < ROOM_COLLIDERS.length; i++) {
    const col = ROOM_COLLIDERS[i];
    if (col.room !== room) continue;
    const halfW = col.w / 2 + radius;
    const halfH = col.h / 2 + radius;
    if (Math.abs(x - col.x) < halfW && Math.abs(y - col.y) < halfH) {
      return col;
    }
  }
  return null;
}

/**
 * Moves an entity (`x, y`) toward `(targetX, targetY)` with sliding AABB collision resolution
 * so characters never clip into counters, walls, partitions, tables, daisy beds, or the Miata.
 */
export function moveEntityWithCollisions(
  entity: { x: number; y: number },
  dx: number,
  dy: number,
  room: RoomId,
  radius = 9
): { movedX: number; movedY: number; blocked: boolean } {
  let movedX = 0;
  let movedY = 0;
  let blocked = false;

  const nextX = Math.max(38, Math.min(862, entity.x + dx));
  if (!hitsCollider(nextX, entity.y, room, radius)) {
    movedX = nextX - entity.x;
    entity.x = nextX;
  } else {
    blocked = true;
  }

  const nextY = Math.max(88, Math.min(454, entity.y + dy));
  if (!hitsCollider(entity.x, nextY, room, radius)) {
    movedY = nextY - entity.y;
    entity.y = nextY;
  } else {
    blocked = true;
  }

  // If entity ever started overlapping a collider, gently nudge out along shortest axis
  const overlap = hitsCollider(entity.x, entity.y, room, radius * 0.65);
  if (overlap) {
    const pushX = entity.x >= overlap.x ? 1 : -1;
    const pushY = entity.y >= overlap.y ? 1 : -1;
    const penX = overlap.w / 2 + radius - Math.abs(entity.x - overlap.x);
    const penY = overlap.h / 2 + radius - Math.abs(entity.y - overlap.y);
    if (penX < penY) {
      entity.x += pushX * Math.min(4, Math.max(1, penX));
    } else {
      entity.y += pushY * Math.min(4, Math.max(1, penY));
    }
  }

  return { movedX, movedY, blocked };
}

/**
 * Multi-waypoint pathfinder (`buildWaypoints`) that routes characters cleanly around:
 * 1) The open right-hand walkway end of the espresso/cashier counter (`x: 472, y: 192` <-> `x: 472, y: 294`)
 * 2) The glass garage partition archway (`x: 556, y: 232` <-> `x: 618, y: 232`)
 * 3) Around the central watering well / koi fountain in the Backyard Garden (`x: 450, y: 254`)
 */
export function buildWaypoints(
  startX: number,
  startY: number,
  endX: number,
  endY: number,
  room: RoomId
): Array<{ x: number; y: number }> {
  const waypoints: Array<{ x: number; y: number }> = [];

  if (room === 'inside') {
    const startInBar = startX < 560 && startY < 216;
    const endInBar = endX < 560 && endY < 216;
    const startInGarage = startX > 586;
    const endInGarage = endX > 586;

    // Crossing between behind the brewing bar and the customer floor/garage
    if (startInBar && !endInBar) {
      waypoints.push({ x: 472, y: 192 });
      waypoints.push({ x: 472, y: 294 });
    }

    // Crossing the glass garage partition at x = 586 through the archway (y = 232)
    if (!startInGarage && endInGarage) {
      waypoints.push({ x: 552, y: 232 });
      waypoints.push({ x: 618, y: 232 });
    } else if (startInGarage && !endInGarage) {
      waypoints.push({ x: 618, y: 232 });
      waypoints.push({ x: 552, y: 232 });
    }

    if (!startInBar && endInBar) {
      waypoints.push({ x: 472, y: 294 });
      waypoints.push({ x: 472, y: 192 });
    }
  } else {
    // Garden room: avoid the central watering well / fountain collider at (450, 254)
    const minX = Math.min(startX, endX);
    const maxX = Math.max(startX, endX);
    const minY = Math.min(startY, endY);
    const maxY = Math.max(startY, endY);
    const crossesWellX = minX < 492 && maxX > 408;
    const crossesWellY = minY < 284 && maxY > 224;
    if (crossesWellX && crossesWellY) {
      const sideX = startX <= 450 && endX <= 450 ? 384 : 516;
      waypoints.push({ x: sideX, y: startY < 254 ? 204 : 304 });
      waypoints.push({ x: sideX, y: endY < 254 ? 204 : 304 });
    }
  }

  waypoints.push({ x: endX, y: endY });
  return waypoints;
}

export function stepAlongWaypoints(
  entity: { x: number; y: number; targetX: number; targetY: number; waypoints?: Array<{ x: number; y: number }> },
  speed: number,
  dt: number,
  room: RoomId,
  radius = 9
): { distMoved: number; reachedFinal: boolean; dx: number; dy: number } {
  if (!entity.waypoints || entity.waypoints.length === 0) {
    entity.waypoints = buildWaypoints(entity.x, entity.y, entity.targetX, entity.targetY, room);
  } else {
    const lastWp = entity.waypoints[entity.waypoints.length - 1];
    if (Math.hypot(lastWp.x - entity.targetX, lastWp.y - entity.targetY) > 4) {
      entity.waypoints = buildWaypoints(entity.x, entity.y, entity.targetX, entity.targetY, room);
    }
  }

  const currentWp = entity.waypoints[0];
  if (!currentWp) {
    return { distMoved: 0, reachedFinal: true, dx: 0, dy: 0 };
  }

  const dx = currentWp.x - entity.x;
  const dy = currentWp.y - entity.y;
  const dist = Math.hypot(dx, dy);

  if (dist <= 4) {
    entity.waypoints.shift();
    if (entity.waypoints.length === 0) {
      return { distMoved: 0, reachedFinal: true, dx: 0, dy: 0 };
    }
    const nextWp = entity.waypoints[0];
    const ndx = nextWp.x - entity.x;
    const ndy = nextWp.y - entity.y;
    const ndist = Math.hypot(ndx, ndy);
    if (ndist <= 1) {
      return { distMoved: 0, reachedFinal: false, dx: 0, dy: 0 };
    }
    const step = Math.min(ndist, speed * dt);
    const res = moveEntityWithCollisions(entity, (ndx / ndist) * step, (ndy / ndist) * step, room, radius);
    return { distMoved: Math.hypot(res.movedX, res.movedY), reachedFinal: false, dx: ndx, dy: ndy };
  }

  const step = Math.min(dist, speed * dt);
  const res = moveEntityWithCollisions(entity, (dx / dist) * step, (dy / dist) * step, room, radius);
  if (res.blocked && Math.hypot(res.movedX, res.movedY) < 0.2) {
    // Orthogonal slide detour if brushing a corner
    if (Math.abs(dx) > Math.abs(dy)) {
      moveEntityWithCollisions(entity, 0, (dy >= 0 ? 1 : -1) * step, room, radius);
    } else {
      moveEntityWithCollisions(entity, (dx >= 0 ? 1 : -1) * step, 0, room, radius);
    }
  }
  return { distMoved: Math.hypot(res.movedX, res.movedY), reachedFinal: false, dx, dy };
}

export const NPC_NAMES = [
  'Flora',
  'Takumi',
  'Milo',
  'Clara',
  'Keisuke',
  'Hazel',
  'Suki',
  'Oliver',
  'Natsuki',
  'Ryosuke',
  'Maya',
  'Leo',
];

export const PET_NAMES: Record<CustomerPetKind, string[]> = {
  dog: ['Mochi', 'Biscuit', 'Pochi', 'Peanut'],
  cat: ['Yuzu', 'Nori', 'Miso', 'Sesame'],
  rabbit: ['Clover', 'Bunbun', 'Daisy', 'Snowball'],
};

export const COZY_SIP_QUOTES = [
  '♥ So smooth & rich!',
  '♪ Love this garage vibe!',
  '★ Best crema in town!',
  '♥ Lilo & Champy are cute!',
  '☕ Cozy garden breeze~',
  '★ Sweet 1990 Miata NA!',
];

// All static display characters removed! Every customer in the world is a live autonomous agent.
export const INITIAL_COUPLES: DatingCouple[] = [];

export const INITIAL_STAFF: StaffWorker[] = [
  {
    id: 'momo',
    name: 'Momo',
    role: 'auto_barista',
    cost: 35,
    dailySalary: 12,
    hired: false,
    room: 'inside',
    x: 190,
    y: 188,
    targetX: 268,
    targetY: 188,
    patrolIndex: 0,
    actionTimer: 0.9,
    statusText: 'Sous-Barista · Brewing',
    walkDist: 0,
    carryingProp: null,
  },
  {
    id: 'ken',
    name: 'Ken',
    role: 'auto_server',
    cost: 45,
    dailySalary: 12,
    hired: false,
    room: 'inside',
    x: 472,
    y: 294,
    targetX: 356,
    targetY: 294,
    patrolIndex: 0,
    actionTimer: 1.0,
    statusText: 'Floor & Garden Server',
    walkDist: 0,
    carryingProp: null,
  },
];

export function createCustomerParty(
  seq: number,
  queueSlot: number,
  arrivalTime: number,
  startAtSlot = false
): CustomerEntity {
  const drinkKeys: DrinkId[] = [
    'midnight_cold_brew',
    'daisy_vanilla_latte',
    'miata_mocha',
    'catnip_herbal_tea',
  ];
  const order = drinkKeys[seq % drinkKeys.length];
  const recipe = RECIPES[order];
  const leaderName = NPC_NAMES[seq % NPC_NAMES.length];

  const partyTypes: CustomerPartyKind[] = ['solo', 'couple', 'friends', 'family'];
  const partyKind = partyTypes[seq % partyTypes.length];

  const companions: CustomerPartyCompanion[] = [];
  if (partyKind === 'couple') {
    companions.push({
      name: NPC_NAMES[(seq + 3) % NPC_NAMES.length],
      spriteVariant: (seq + 1) % 4,
      isChild: false,
      offsetX: 24,
      offsetY: 4,
    });
  } else if (partyKind === 'friends') {
    companions.push({
      name: NPC_NAMES[(seq + 2) % NPC_NAMES.length],
      spriteVariant: (seq + 1) % 4,
      isChild: false,
      offsetX: -22,
      offsetY: 5,
    });
    if (seq % 2 === 1) {
      companions.push({
        name: NPC_NAMES[(seq + 5) % NPC_NAMES.length],
        spriteVariant: (seq + 2) % 4,
        isChild: false,
        offsetX: 22,
        offsetY: 5,
      });
    }
  } else if (partyKind === 'family') {
    companions.push({
      name: NPC_NAMES[(seq + 4) % NPC_NAMES.length],
      spriteVariant: (seq + 2) % 4,
      isChild: false,
      offsetX: 24,
      offsetY: 2,
    });
    companions.push({
      name: 'Pip',
      spriteVariant: (seq + 3) % 4,
      isChild: true,
      offsetX: -20,
      offsetY: 8,
    });
  }

  // 50% chance on any party type to bring an animated Pet Companion (Dog, Cat, or Rabbit)
  const hasPet = seq % 2 === 0;
  const petKinds: CustomerPetKind[] = ['dog', 'cat', 'rabbit'];
  const petKind = petKinds[seq % petKinds.length];
  const petNameList = PET_NAMES[petKind];
  const slot = COUNTER_QUEUE_SLOTS[Math.min(queueSlot, COUNTER_QUEUE_SLOTS.length - 1)];
  const startX = startAtSlot ? slot.x : INSIDE_DOOR_MAT.x;
  const startY = startAtSlot ? slot.y : 442;

  const pet: CustomerPartyPet | null = hasPet
    ? {
        kind: petKind,
        name: petNameList[seq % petNameList.length],
        x: startX - 18,
        y: startY + 10,
        facing: 'right',
        heartTimer: 0,
      }
    : null;

  return {
    id: `cust-${seq}-${Math.round(arrivalTime * 100)}`,
    name: leaderName,
    spriteVariant: seq % 4,
    order,
    room: 'inside',
    state: startAtSlot ? 'waiting' : 'walking_in',
    queueSlot,
    x: startX,
    y: startY,
    targetX: slot.x,
    targetY: slot.y,
    waypoints: buildWaypoints(startX, startY, slot.x, slot.y, 'inside'),
    seatIndex: null,
    sipTimer: 0,
    sipBubbleTimer: 3.5,
    carryingCup: false,
    heartsGiven: 0,
    dialogueText: `One ${recipe.shortName}, please!`,
    arrivalTime,
    walkDist: 0,
    partyKind,
    partySize: 1 + companions.length,
    companions,
    pet,
  };
}

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
  if (state.popups.length > 24) {
    state.popups.shift();
  }
}

export function getUnitCogs(state: CafeState, isEmergencyOut = false): number {
  const baseCogs = isEmergencyOut ? 4.0 : 2.0;
  const discount = state.finance.upgrades.direct_trade_beans ? 1.5 : 0;
  return Math.max(0.5, Number((baseCogs - discount).toFixed(2)));
}

export function getDrinkSellingPrice(state: CafeState, drinkId: DrinkId): number {
  const basePrice = RECIPES[drinkId].price;
  const sleeveBonus = state.finance.upgrades.custom_sleeves ? 4 : 0;
  return basePrice + sleeveBonus;
}

export function recalculateProfitMetrics(finance: BusinessFinanceState): void {
  const payroll = finance.payrollExpense || 0;
  finance.netProfit = Number((finance.grossRevenue - finance.totalCogs - payroll).toFixed(2));
  finance.profitMarginPct =
    finance.grossRevenue > 0
      ? Math.round((finance.netProfit / finance.grossRevenue) * 100)
      : 0;
}

export function getStationProcessDuration(state: CafeState, stationId: StationId): number {
  if (stationId === 'cup_counter') {
    const catMult = state.barista.speedBoostTimer > 0 ? 0.68 : 1.0;
    const boilerMult = state.finance.upgrades.dual_boiler ? 1 / 1.4 : 1.0;
    return Number((0.45 * catMult * boilerMult).toFixed(2));
  }
  if (stationId === 'trash' || stationId === 'watering_can') {
    return 0;
  }
  const tier = state.stationLevels[stationId as UpgradableStationId] ?? 1;
  const baseDuration = STATION_TIER_META[tier]?.prepDuration ?? 2.8;
  const catSpeedMult = state.barista.speedBoostTimer > 0 ? 0.68 : 1.0;
  const boilerSpeedMult = state.finance.upgrades.dual_boiler ? 1 / 1.4 : 1.0;
  return Number((baseDuration * catSpeedMult * boilerSpeedMult).toFixed(2));
}

export function upgradeStationEquipment(
  state: CafeState,
  stationId: UpgradableStationId
): { upgraded: boolean; newLevel: StationTier; cost: number; message: string } {
  const currentLevel = state.stationLevels[stationId] ?? 1;
  const meta = UPGRADABLE_STATIONS.find((s) => s.id === stationId);
  if (!meta) {
    return { upgraded: false, newLevel: currentLevel, cost: 0, message: 'Unknown station.' };
  }
  if (currentLevel >= 3) {
    state.lastMessage = `${meta.name} is already at Level 3 (Master Commercial — Obsidian & Gold)!`;
    return { upgraded: false, newLevel: 3, cost: 0, message: state.lastMessage };
  }
  const nextLevel = (currentLevel + 1) as StationTier;
  const cost = nextLevel === 2 ? meta.lvl2Cost : meta.lvl3Cost;
  if (state.coins < cost) {
    state.lastMessage = `Need $${cost} to upgrade ${meta.name} to Level ${nextLevel}! You have $${Math.round(state.coins)}.`;
    return { upgraded: false, newLevel: currentLevel, cost, message: state.lastMessage };
  }

  state.coins = Number((state.coins - cost).toFixed(2));
  state.stationLevels[stationId] = nextLevel;
  const tierInfo = STATION_TIER_META[nextLevel];
  const stCoords = STATIONS.find((s) => s.id === stationId);
  spawnPopup(
    state,
    `★ ${meta.shortLabel.toUpperCase()} LVL ${nextLevel} (${tierInfo.prepDuration}s)`,
    stCoords ? stCoords.x : state.barista.x,
    stCoords ? stCoords.y - 28 : state.barista.y - 28,
    '#facc15',
    'inside'
  );
  state.lastMessage = `Upgraded ${meta.name} to ${tierInfo.name} (${tierInfo.subtitle})!`;
  saveCafeProgressV2(state);
  return { upgraded: true, newLevel: nextLevel, cost, message: state.lastMessage };
}

export function purchaseOrToggleDecor(
  state: CafeState,
  decorId: DecorItemId
): { purchased: boolean; equipped: boolean; message: string } {
  const item = DECOR_SHOP_ITEMS.find((d) => d.id === decorId);
  if (!item) {
    return { purchased: false, equipped: false, message: 'Unknown decor item.' };
  }

  if (state.decorOwned[decorId]) {
    state.decorEquipped[decorId] = !state.decorEquipped[decorId];
    const isEq = state.decorEquipped[decorId];
    state.cozyRating = calculateCozyRating(
      state.daisies,
      state.hearts,
      state.catPetBonus,
      state.weather,
      state.decorEquipped
    );
    state.bestCozyRating = Math.max(state.bestCozyRating, state.cozyRating);
    state.lastMessage = isEq
      ? `Equipped ${item.name}! Cozy Rating is now ${state.cozyRating}%.`
      : `Stored ${item.name} in warehouse.`;
    saveCafeProgressV2(state);
    return { purchased: false, equipped: isEq, message: state.lastMessage };
  }

  if (state.coins < item.cost) {
    state.lastMessage = `Need $${item.cost} to purchase ${item.name}! You have $${Math.round(state.coins)}.`;
    return { purchased: false, equipped: false, message: state.lastMessage };
  }

  state.coins = Number((state.coins - item.cost).toFixed(2));
  state.decorOwned[decorId] = true;
  state.decorEquipped[decorId] = true;
  state.cozyRating = calculateCozyRating(
    state.daisies,
    state.hearts,
    state.catPetBonus,
    state.weather,
    state.decorEquipped
  );
  state.bestCozyRating = Math.max(state.bestCozyRating, state.cozyRating);

  spawnPopup(
    state,
    `★ DECOR: +${item.cozyBonus} COZY!`,
    state.barista.x,
    state.barista.y - 28,
    '#4ade80',
    state.room
  );
  state.lastMessage = `Purchased & equipped ${item.name}! (+${item.cozyBonus} Cozy Rating)`;
  saveCafeProgressV2(state);
  return { purchased: true, equipped: true, message: state.lastMessage };
}

export function deductDailyStaffPayroll(state: CafeState): {
  totalSalary: number;
  hiredNames: string[];
} {
  const hiredWorkers = state.staff.filter((s) => s.hired);
  if (hiredWorkers.length === 0) {
    return { totalSalary: 0, hiredNames: [] };
  }
  const totalSalary = hiredWorkers.reduce((sum, w) => sum + (w.dailySalary || 12), 0);
  state.coins = Number(Math.max(0, state.coins - totalSalary).toFixed(2));
  state.finance.payrollExpense = Number(
    ((state.finance.payrollExpense || 0) + totalSalary).toFixed(2)
  );
  recalculateProfitMetrics(state.finance);
  const hiredNames = hiredWorkers.map((w) => w.name);
  spawnPopup(
    state,
    `💸 PAYROLL -$${totalSalary} (${hiredNames.join(' & ')})`,
    state.barista.x,
    state.barista.y - 32,
    '#fb7185',
    state.room
  );
  return { totalSalary, hiredNames };
}

export function restockWholesaleIngredients(state: CafeState): {
  restocked: boolean;
  message: string;
} {
  const cost = state.finance.wholesaleRestockCost;
  const pack = state.finance.wholesalePackSize;
  if (state.coins < cost) {
    state.lastMessage = `Need $${cost} to restock +${pack} Wholesale Ingredient Units! You have $${Math.round(state.coins)}.`;
    return { restocked: false, message: state.lastMessage };
  }
  state.coins = Number((state.coins - cost).toFixed(2));
  state.finance.ingredientStock += pack;
  spawnPopup(
    state,
    `+${pack} STOCK 📦 (-$${cost})`,
    state.barista.x,
    state.barista.y - 26,
    '#38bdf8',
    state.room
  );
  state.lastMessage = `Purchased +${pack} Wholesale Ingredient Stock for $${cost} ($${getUnitCogs(state, false).toFixed(2)} COGS/cup)!`;
  saveCafeProgressV2(state);
  return { restocked: true, message: state.lastMessage };
}

export function purchaseCapitalUpgrade(
  state: CafeState,
  upgradeId: UpgradeId
): { purchased: boolean; message: string } {
  const cfg = CAPITAL_UPGRADES.find((u) => u.id === upgradeId);
  if (!cfg) {
    return { purchased: false, message: 'Unknown upgrade.' };
  }
  if (state.finance.upgrades[upgradeId]) {
    state.lastMessage = `${cfg.name} is already unlocked and active!`;
    return { purchased: false, message: state.lastMessage };
  }
  if (state.coins < cfg.cost) {
    state.lastMessage = `Need $${cfg.cost} to unlock ${cfg.name}! You have $${Math.round(state.coins)}.`;
    return { purchased: false, message: state.lastMessage };
  }

  state.coins = Number((state.coins - cfg.cost).toFixed(2));
  state.finance.upgrades[upgradeId] = true;

  spawnPopup(
    state,
    `★ UPGRADE: ${cfg.shortBenefit}`,
    state.barista.x,
    state.barista.y - 28,
    '#4ade80',
    state.room
  );
  state.lastMessage = `Unlocked ${cfg.name}! (${cfg.shortBenefit})`;
  saveCafeProgressV2(state);
  return { purchased: true, message: state.lastMessage };
}

const DAILY_STREAK_STORAGE_KEY = 'klasik_daily_streak';
export const CAFE_SAVE_KEY_V2 = 'klasik_cafe_save_v2';

export function triggerHaptic(durationMs = 15): void {
  try {
    if (typeof navigator !== 'undefined' && typeof navigator.vibrate === 'function') {
      navigator.vibrate(durationMs);
    }
  } catch {
    // Ignore unsupported vibration environments
  }
}

export interface KlasikSaveV2Payload {
  coins: number;
  hearts: number;
  dailyStreak: number;
  dayNumber: number;
  miataColor: MiataPaintColor;
  miataHeadlightsOn: boolean;
  appearance: BaristaAppearance;
  finance: BusinessFinanceState;
  stationLevels: Record<UpgradableStationId, StationTier>;
  decorOwned: Record<DecorItemId, boolean>;
  decorEquipped: Record<DecorItemId, boolean>;
  hiredStaffIds: Array<'momo' | 'ken'>;
}

export function saveCafeProgressV2(state: CafeState): void {
  try {
    if (typeof window !== 'undefined' && window.localStorage) {
      const payload: KlasikSaveV2Payload = {
        coins: state.coins,
        hearts: state.hearts,
        dailyStreak: state.dailyStreak,
        dayNumber: state.dayNumber,
        miataColor: state.miataColor,
        miataHeadlightsOn: state.miataHeadlightsOn,
        appearance: { ...state.appearance },
        finance: {
          ...state.finance,
          upgrades: { ...state.finance.upgrades },
        },
        stationLevels: { ...state.stationLevels },
        decorOwned: { ...state.decorOwned },
        decorEquipped: { ...state.decorEquipped },
        hiredStaffIds: state.staff.filter((s) => s.hired).map((s) => s.id),
      };
      window.localStorage.setItem(CAFE_SAVE_KEY_V2, JSON.stringify(payload));
      window.localStorage.setItem(
        DAILY_STREAK_STORAGE_KEY,
        String(Math.max(0, Math.floor(state.dailyStreak)))
      );
    }
  } catch {
    // Ignore storage access errors
  }
}

export function loadCafeProgressV2(state: CafeState): boolean {
  try {
    if (typeof window !== 'undefined' && window.localStorage) {
      const raw = window.localStorage.getItem(CAFE_SAVE_KEY_V2);
      if (!raw) return false;
      const parsed = JSON.parse(raw) as Partial<KlasikSaveV2Payload>;
      if (typeof parsed.coins === 'number' && Number.isFinite(parsed.coins)) {
        state.coins = parsed.coins;
      }
      if (typeof parsed.hearts === 'number' && Number.isFinite(parsed.hearts)) {
        state.hearts = parsed.hearts;
      }
      if (typeof parsed.dailyStreak === 'number' && Number.isFinite(parsed.dailyStreak)) {
        state.dailyStreak = Math.max(0, Math.floor(parsed.dailyStreak));
      }
      if (typeof parsed.dayNumber === 'number' && Number.isFinite(parsed.dayNumber)) {
        state.dayNumber = Math.max(1, Math.floor(parsed.dayNumber));
      }
      if (
        parsed.miataColor === 'red' ||
        parsed.miataColor === 'white' ||
        parsed.miataColor === 'black'
      ) {
        state.miataColor = parsed.miataColor;
      }
      if (typeof parsed.miataHeadlightsOn === 'boolean') {
        state.miataHeadlightsOn = parsed.miataHeadlightsOn;
      }
      if (parsed.appearance) {
        state.appearance = {
          ...state.appearance,
          ...parsed.appearance,
        };
      }
      if (parsed.finance) {
        state.finance = {
          ...state.finance,
          ...parsed.finance,
          upgrades: {
            ...state.finance.upgrades,
            ...(parsed.finance.upgrades ?? {}),
          },
        };
        recalculateProfitMetrics(state.finance);
      }
      if (parsed.stationLevels) {
        state.stationLevels = {
          ...state.stationLevels,
          ...parsed.stationLevels,
        };
      }
      if (parsed.decorOwned) {
        state.decorOwned = {
          ...state.decorOwned,
          ...parsed.decorOwned,
        };
      }
      if (parsed.decorEquipped) {
        state.decorEquipped = {
          ...state.decorEquipped,
          ...parsed.decorEquipped,
        };
      }
      if (Array.isArray(parsed.hiredStaffIds)) {
        state.staff.forEach((w) => {
          w.hired = parsed.hiredStaffIds!.includes(w.id);
        });
      }
      state.cozyRating = calculateCozyRating(
        state.daisies,
        state.hearts,
        state.catPetBonus,
        state.weather,
        state.decorEquipped
      );
      state.bestCozyRating = Math.max(state.bestCozyRating, state.cozyRating);
      return true;
    }
  } catch {
    // Ignore invalid JSON or storage access errors
  }
  return false;
}

export function resetCafeProgressV2(autostart = true): CafeState {
  try {
    if (typeof window !== 'undefined' && window.localStorage) {
      window.localStorage.removeItem(CAFE_SAVE_KEY_V2);
      window.localStorage.removeItem(DAILY_STREAK_STORAGE_KEY);
    }
  } catch {
    // Ignore storage access errors
  }
  const fresh = createInitialCafeState(autostart, 0, true);
  fresh.lastMessage = '🗑️ Reset local save (klasik_cafe_save_v2)! Fresh shift started.';
  return fresh;
}

export function loadSavedDailyStreak(): number {
  try {
    if (typeof window !== 'undefined' && window.localStorage) {
      const raw = window.localStorage.getItem(DAILY_STREAK_STORAGE_KEY);
      if (raw !== null) {
        const parsed = Number(raw);
        if (Number.isFinite(parsed) && parsed >= 0) {
          return Math.floor(parsed);
        }
      }
    }
  } catch {
    // Ignore storage access errors
  }
  return 0;
}

export function saveDailyStreak(streak: number): void {
  try {
    if (typeof window !== 'undefined' && window.localStorage) {
      window.localStorage.setItem(DAILY_STREAK_STORAGE_KEY, String(Math.max(0, Math.floor(streak))));
    }
  } catch {
    // Ignore storage access errors
  }
}

export function isOutfitUnlocked(outfit: BaristaOutfitOption, dailyStreak: number): boolean {
  if (!outfit.unlockStreak || outfit.unlockStreak <= 0) return true;
  return dailyStreak >= outfit.unlockStreak;
}

export function getUnlockedOutfits(dailyStreak: number): BaristaOutfitOption[] {
  return BARISTA_OUTFITS.filter((o) => isOutfitUnlocked(o, dailyStreak));
}

export function getNewlyUnlockedOutfits(
  prevStreak: number,
  nextStreak: number
): BaristaOutfitOption[] {
  return BARISTA_OUTFITS.filter(
    (o) =>
      typeof o.unlockStreak === 'number' &&
      o.unlockStreak > prevStreak &&
      o.unlockStreak <= nextStreak
  );
}

export interface ShiftCompletionResult {
  streakIncremented: boolean;
  dailyStreak: number;
  payrollDeducted: number;
  newlyUnlockedOutfits: BaristaOutfitOption[];
  message: string;
}

export function completeShift(state: CafeState): ShiftCompletionResult {
  if (state.servedCount < state.dailyTarget) {
    return {
      streakIncremented: false,
      dailyStreak: state.dailyStreak,
      payrollDeducted: 0,
      newlyUnlockedOutfits: [],
      message: `Serve ${state.dailyTarget - state.servedCount} more drink(s) to complete today's shift and build your Daily Streak!`,
    };
  }

  if (state.shiftStreakIncremented) {
    return {
      streakIncremented: false,
      dailyStreak: state.dailyStreak,
      payrollDeducted: 0,
      newlyUnlockedOutfits: [],
      message: `Shift complete! Daily Streak: 🔥 ${state.dailyStreak}.`,
    };
  }

  const prevStreak = state.dailyStreak;
  state.dailyStreak += 1;
  state.shiftStreakIncremented = true;
  saveDailyStreak(state.dailyStreak);

  // Automatically deduct recurring Daily Staff Salary ($12/day per hired staff) and log to P&L Ledger
  const payroll = deductDailyStaffPayroll(state);

  const newlyUnlockedOutfits = getNewlyUnlockedOutfits(prevStreak, state.dailyStreak);
  const payrollNote =
    payroll.totalSalary > 0 ? ` · Daily Payroll -$${payroll.totalSalary} (${payroll.hiredNames.join(' & ')})` : '';
  if (newlyUnlockedOutfits.length > 0) {
    const names = newlyUnlockedOutfits.map((o) => o.label).join(', ');
    state.lastMessage = `🔥 DAILY STREAK ${state.dailyStreak}! Unlocked Vintage Apron: ${names}!${payrollNote}`;
  } else {
    state.lastMessage = `🔥 DAILY STREAK ${state.dailyStreak}! Shift complete!${payrollNote}`;
  }
  saveCafeProgressV2(state);

  return {
    streakIncremented: true,
    dailyStreak: state.dailyStreak,
    payrollDeducted: payroll.totalSalary,
    newlyUnlockedOutfits,
    message: state.lastMessage,
  };
}

export function updateBaristaAppearance(
  state: CafeState,
  partial: Partial<BaristaAppearance>
): BaristaAppearance {
  if (typeof partial.name === 'string') {
    const trimmed = partial.name.trim().slice(0, 12);
    state.appearance.name = trimmed.length > 0 ? trimmed : 'Klasik';
  }
  if (typeof partial.hairColorIndex === 'number') {
    state.appearance.hairColorIndex =
      ((partial.hairColorIndex % HAIR_COLORS.length) + HAIR_COLORS.length) % HAIR_COLORS.length;
  }
  if (typeof partial.skinToneIndex === 'number') {
    state.appearance.skinToneIndex =
      ((partial.skinToneIndex % SKIN_TONES.length) + SKIN_TONES.length) % SKIN_TONES.length;
  }
  if (partial.outfitStyleId) {
    const targetOutfit = BARISTA_OUTFITS.find((o) => o.id === partial.outfitStyleId);
    if (targetOutfit && isOutfitUnlocked(targetOutfit, state.dailyStreak)) {
      state.appearance.outfitStyleId = partial.outfitStyleId;
    }
  }
  saveCafeProgressV2(state);
  return state.appearance;
}

export function createInitialCafeState(
  autostart = false,
  initialStreak?: number,
  skipStorageLoad = false
): CafeState {
  const daisies = INITIAL_DAISIES.map((d) => ({ ...d }));
  const cats = INITIAL_CATS.map((c) => ({ ...c }));
  const staff = INITIAL_STAFF.map((s) => ({ ...s }));

  // Spawn 2 living, dynamic customer parties at the front counter queue (with companions & pets!)
  const customer1 = createCustomerParty(0, 0, 0, true);
  customer1.id = 'cust-1';
  customer1.name = 'Flora';
  customer1.order = 'miata_mocha';
  customer1.dialogueText = "One '90s Miata Mocha!";

  const customer2 = createCustomerParty(1, 1, 0.5, true);
  customer2.id = 'cust-2';
  customer2.name = 'Takumi';
  customer2.order = 'daisy_vanilla_latte';
  customer2.dialogueText = 'Daisy Latte next, please!';

  const initialTime = getTimeOfDayFromHour(new Date().getHours());

  const defaultDecor: Record<DecorItemId, boolean> = {
    checkered_marble_floor: false,
    vinyl_turntable_neon: false,
    garage_lift_underglow: false,
    fairy_string_lanterns: false,
    stone_koi_fountain: false,
    daisy_trellis_archways: false,
  };

  const initialState: CafeState = {
    mode: autostart ? 'playing' : 'boot',
    room: 'inside',
    timeOfDay: initialTime,
    timeManualOverride: false,
    timeCycleTimer: 45,
    weather: 'clear',
    weatherCycleTimer: 40,
    dayNumber: 1,
    dailyStreak:
      typeof initialStreak === 'number'
        ? Math.max(0, Math.floor(initialStreak))
        : loadSavedDailyStreak(),
    shiftStreakIncremented: false,
    servedCount: 0,
    dailyTarget: 6,
    shiftGoalReachedShown: false,
    shiftSuccessBannerVisible: false,
    coins: 45,
    tipJarCoins: 6,
    hearts: 3,
    cozyRating: calculateCozyRating(daisies, 3, 0, 'clear', defaultDecor),
    bestCozyRating: 85,
    elapsedSeconds: 0,
    miataHeadlightsOn: true,
    miataColor: 'red',
    catPetBonus: 0,
    appearance: {
      name: 'Klasik',
      hairColorIndex: 0,
      skinToneIndex: 1,
      outfitStyleId: 'classic_white',
    },
    finance: {
      grossRevenue: 0,
      totalCogs: 0,
      payrollExpense: 0,
      netProfit: 0,
      profitMarginPct: 0,
      ingredientStock: 12,
      wholesaleRestockCost: 20,
      wholesalePackSize: 10,
      upgrades: {
        direct_trade_beans: false,
        dual_boiler: false,
        custom_sleeves: false,
        miata_merch_stand: false,
      },
    },
    stationLevels: {
      grinder: 1,
      espresso: 1,
      milk_frother: 1,
      kettle: 1,
      tea_leaves: 1,
    },
    decorOwned: { ...defaultDecor },
    decorEquipped: { ...defaultDecor },
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
    couples: [],
    photoSquad: {
      members: [],
      flashTimer: 5.5,
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
      "Flora & Takumi's parties are in line! Tap ⚡ BREW / SERVE or any appliance to craft Flora's '90s Miata Mocha.",
  };

  if (!skipStorageLoad && typeof initialStreak !== 'number') {
    loadCafeProgressV2(initialState);
  }
  return initialState;
}

export function calculateCozyRating(
  daisies: DaisyPatch[],
  hearts: number,
  catPetBonus = 0,
  weather: WeatherType = 'clear',
  decorEquipped?: Record<DecorItemId, boolean>
): number {
  if (daisies.length === 0) return 60;
  const avgHydration = daisies.reduce((sum, d) => sum + d.hydration, 0) / daisies.length;
  const hydratedCount = daisies.filter((d) => !d.needsWater).length;
  const gardenScore = avgHydration * 0.5 + (hydratedCount / daisies.length) * 30;
  const heartBonus = Math.min(15, hearts * 1.5);
  const rainBonus = weather === 'rain' ? 8 : weather === 'breeze' ? 3 : 0;
  let decorBonus = 0;
  if (decorEquipped) {
    DECOR_SHOP_ITEMS.forEach((item) => {
      if (decorEquipped[item.id]) {
        decorBonus += item.cozyBonus;
      }
    });
  }
  return Math.max(
    15,
    Math.min(100, Math.round(gardenScore + heartBonus + catPetBonus + rainBonus + decorBonus))
  );
}

export function getFrontWaitingCustomer(state: CafeState): CustomerEntity | null {
  const waiting = state.customers
    .filter((c) => c.state === 'waiting' || c.state === 'walking_in')
    .sort((a, b) => a.queueSlot - b.queueSlot);
  if (waiting[0] && waiting[0].state === 'walking_in') {
    waiting[0].state = 'waiting';
  }
  return waiting[0] ?? null;
}

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
      state.barista.waypoints = buildWaypoints(450, 148, 450, 176, 'garden');
      state.barista.facing = 'down';
      state.lastMessage =
        'Stepped out to the Backyard Daisy Garden! Click any planter or [💧 WATER] to hydrate.';
    } else {
      state.barista.x = 356;
      state.barista.y = 390;
      state.barista.targetX = 296;
      state.barista.targetY = 192;
      state.barista.waypoints = buildWaypoints(356, 390, 296, 192, 'inside');
      state.barista.facing = 'up';
      state.lastMessage =
        'Entered the Monochrome Coffee Shop & Classic Red 1990 Miata Showroom!';
    }
  }
  return state.room;
}

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

export function cycleWeather(state: CafeState): WeatherType {
  const order: WeatherType[] = ['clear', 'breeze', 'rain'];
  const next = order[(order.indexOf(state.weather) + 1) % order.length];
  state.weather = next;
  state.weatherCycleTimer = 40;
  state.cozyRating = calculateCozyRating(
    state.daisies,
    state.hearts,
    state.catPetBonus,
    state.weather,
    state.decorEquipped
  );
  state.bestCozyRating = Math.max(state.bestCozyRating, state.cozyRating);

  const labels: Record<WeatherType, string> = {
    clear: '⛅ CLEAR SKY: Crisp sunny weather across the Garden Garage Cafe.',
    breeze: '🍃 DAISY BREEZE: Gentle wind carries white daisy petals across the lawn!',
    rain: '🌧️ COZY RAIN: Raindrops hydrate all 6 Daisy beds (+4%/s) & overflow orders become Takeout! ☔',
  };
  state.lastMessage = labels[next];
  return next;
}

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
  saveCafeProgressV2(state);
  return next;
}

export function collectTipJar(state: CafeState): number {
  if (state.tipJarCoins <= 0) {
    state.lastMessage = 'Tip Jar is empty right now — serve drinks to fill it up!';
    return 0;
  }
  const amount = state.tipJarCoins;
  state.coins = Number((state.coins + amount).toFixed(2));
  state.tipJarCoins = 0;
  spawnPopup(state, `+${amount}c 💰 TIPS!`, TIP_JAR_BOUNDS.x, TIP_JAR_BOUNDS.y - 22, '#facc15', 'inside');
  state.lastMessage = `Collected +${amount} Coins from the Counter Tip Jar!`;
  saveCafeProgressV2(state);
  return amount;
}

export function triggerPhotoSquadFlash(state: CafeState): number {
  state.photoSquad.flashAlpha = 1.0;
  state.photoSquad.flashTimer = 6.5;
  const quotes = ['📸 FLASH! So clean!', '📸 Pop-ups! ♥', '📸 JDM Legend! ★', '📸 Red NA Miata!'];
  state.photoSquad.quote = quotes[Math.floor(state.elapsedSeconds) % quotes.length];
  const merchStandBonus = state.finance.upgrades.miata_merch_stand ? 5 : 0;
  const bonus = 4 + merchStandBonus;
  state.coins = Number((state.coins + 4).toFixed(2));
  if (merchStandBonus > 0) {
    state.tipJarCoins += merchStandBonus;
  }
  spawnPopup(
    state,
    merchStandBonus > 0 ? `📸 FLASH! +4c (+5c TIP JAR)` : `📸 FLASH! +${bonus}c`,
    MIATA_GARAGE_BOUNDS.x,
    MIATA_GARAGE_BOUNDS.y + 82,
    '#fef08a',
    'inside'
  );
  return bonus;
}

export function hireStaffById(
  state: CafeState,
  workerId: 'momo' | 'ken'
): { hired: boolean; worker?: StaffWorker; message: string } {
  const targetWorker = state.staff.find((s) => s.id === workerId);
  if (!targetWorker) {
    return { hired: false, message: 'Unknown staff member.' };
  }
  if (targetWorker.hired) {
    state.lastMessage = `${targetWorker.name} is already hired and actively working!`;
    return { hired: false, worker: targetWorker, message: state.lastMessage };
  }
  if (state.coins < targetWorker.cost) {
    state.lastMessage = `Need $${targetWorker.cost} to hire ${targetWorker.name} ($${targetWorker.dailySalary}/day salary)! You have $${Math.round(state.coins)}.`;
    return { hired: false, worker: targetWorker, message: state.lastMessage };
  }

  state.coins = Number((state.coins - targetWorker.cost).toFixed(2));
  targetWorker.hired = true;
  targetWorker.actionTimer = 0.5;

  spawnPopup(
    state,
    `👩‍🍳 HIRED ${targetWorker.name.toUpperCase()} (-$${targetWorker.cost})`,
    targetWorker.x,
    targetWorker.y - 28,
    '#4ade80',
    'inside'
  );

  state.lastMessage =
    targetWorker.id === 'momo'
      ? `Hired Momo (Sous-Barista · $${targetWorker.cost} upfront, $${targetWorker.dailySalary}/day salary)! She patrols the espresso bar and brews Steps 1–3!`
      : `Hired Ken (Floor & Garden Server · $${targetWorker.cost} upfront, $${targetWorker.dailySalary}/day salary)! He serves guests, collects tips & waters daisies!`;

  saveCafeProgressV2(state);
  return { hired: true, worker: targetWorker, message: state.lastMessage };
}

export function hireNextStaff(state: CafeState): {
  hired: boolean;
  worker?: StaffWorker;
  message: string;
} {
  const nextWorker = state.staff.find((s) => !s.hired);
  if (!nextWorker) {
    state.lastMessage = 'Both Cafe Staff (Momo & Ken) are already hired and working their zones!';
    return { hired: false, message: state.lastMessage };
  }
  return hireStaffById(state, nextWorker.id);
}

/**
 * Advances customer movement with AABB collision resolution & multi-waypoint pathfinding,
 * doorway overflow transitions (`walking_to_garden` -> `garden`),
 * 20-30s table dining, pet companion trailing & cat heart bubbles, and table tips.
 */
export function advanceCustomersSimulation(state: CafeState, dt: number): boolean {
  let hudChanged = false;

  for (let i = state.customers.length - 1; i >= 0; i--) {
    const c = state.customers[i];
    const moveRes = stepAlongWaypoints(c, 110, dt, c.room, 8);

    if (moveRes.distMoved > 0) {
      c.walkDist += moveRes.distMoved;
    }

    // Update trailing Pet Companion (follows 18px behind party leader, sits beside table, hearts near Lilo/Champy)
    if (c.pet) {
      const petTargetX = c.state === 'sipping' ? c.x - 22 : c.x - 18;
      const petTargetY = c.state === 'sipping' ? c.y + 8 : c.y + 8;
      const pdx = petTargetX - c.pet.x;
      const pdy = petTargetY - c.pet.y;
      const pdist = Math.hypot(pdx, pdy);
      if (pdist > 2) {
        const pstep = Math.min(pdist, 115 * dt);
        moveEntityWithCollisions(c.pet, (pdx / pdist) * pstep, (pdy / pdist) * pstep, c.room, 6);
        c.pet.facing = pdx < 0 ? 'left' : 'right';
      }
      if (c.pet.heartTimer > 0) {
        c.pet.heartTimer = Math.max(0, c.pet.heartTimer - dt);
      } else {
        for (const cat of state.cats) {
          if (cat.room === c.room && Math.hypot(cat.x - c.pet.x, cat.y - c.pet.y) < 95) {
            c.pet.heartTimer = 3.2;
            cat.heartTimer = Math.max(cat.heartTimer, 2.2);
            break;
          }
        }
      }
    }

    const distToFinal = Math.hypot(c.targetX - c.x, c.targetY - c.y);
    if (moveRes.reachedFinal || distToFinal <= 4) {
      if (c.state === 'walking_in') {
        c.state = 'waiting';
        hudChanged = true;
      } else if (c.state === 'walking_to_garden') {
        // Reached the South Doorway (`▼ TO GARDEN`) inside! Transition into the Backyard Garden via the North Veranda Doorway!
        c.room = 'garden';
        c.state = 'sipping';
        c.x = GARDEN_DOOR_MAT.x;
        c.y = GARDEN_DOOR_MAT.y + 24;
        c.targetX = c.finalTargetX ?? ALL_CUSTOMER_SEATS[4].x;
        c.targetY = c.finalTargetY ?? ALL_CUSTOMER_SEATS[4].y;
        c.waypoints = buildWaypoints(c.x, c.y, c.targetX, c.targetY, 'garden');
        if (c.pet) {
          c.pet.x = c.x - 18;
          c.pet.y = c.y + 6;
        }
        c.dialogueText = '♥ Garden patio seat!';
        spawnPopup(state, '🚪 -> GARDEN TABLE', INSIDE_DOOR_MAT.x, INSIDE_DOOR_MAT.y - 16, '#86efac', 'inside');
        hudChanged = true;
      } else if (c.state === 'sipping') {
        c.sipTimer -= dt;
        c.sipBubbleTimer -= dt;
        if (c.sipBubbleTimer <= 0) {
          c.sipBubbleTimer = 4.2 + (i % 3) * 1.1;
          const qIdx = Math.floor(state.elapsedSeconds + i) % COZY_SIP_QUOTES.length;
          c.dialogueText = COZY_SIP_QUOTES[qIdx];
          // If seated at Garage table (seatIndex 3), periodically snap a Miata photo flash!
          if (c.seatIndex === 3 && state.room === 'inside') {
            triggerPhotoSquadFlash(state);
          }
        }
        if (c.sipTimer <= 0) {
          // Leave coins in the Tip Jar and walk out the exit doorway to despawn!
          const tableTip = 2 + Math.min(3, c.partySize);
          state.coins = Number((state.coins + tableTip).toFixed(2));
          state.tipJarCoins += 2;
          spawnPopup(state, `+${tableTip}c ☕ TABLE TIP!`, c.x, c.y - 22, '#facc15', c.room);
          c.state = 'walking_out';
          c.carryingCup = false;
          c.seatIndex = null;
          c.dialogueText = 'Thanks Klasik! ♥';
          c.targetX = c.room === 'inside' ? INSIDE_DOOR_MAT.x : GARDEN_DOOR_MAT.x;
          c.targetY = c.room === 'inside' ? 446 : 122;
          c.waypoints = buildWaypoints(c.x, c.y, c.targetX, c.targetY, c.room);
          hudChanged = true;
        }
      } else if (c.state === 'walking_out') {
        state.customers.splice(i, 1);
        hudChanged = true;
      }
    }
  }

  return hudChanged;
}

export function advanceEnvironmentAndHydration(state: CafeState, dt: number): boolean {
  let hudChanged = false;

  if (!state.timeManualOverride) {
    const syncedTime = getTimeOfDayFromHour(new Date().getHours());
    if (syncedTime !== state.timeOfDay) {
      state.timeOfDay = syncedTime;
      hudChanged = true;
    }
  }

  state.weatherCycleTimer -= dt;
  if (state.weatherCycleTimer <= 0) {
    cycleWeather(state);
    hudChanged = true;
  }

  if (state.photoSquad.flashAlpha > 0) {
    state.photoSquad.flashAlpha = Math.max(0, state.photoSquad.flashAlpha - dt * 2.4);
  }
  state.photoSquad.flashTimer -= dt;
  if (state.photoSquad.flashTimer <= 0) {
    state.photoSquad.flashTimer = 8.0;
    // Trigger automatic Miata flash if any live customer is dining or visiting near the garage
    const hasGarageGuest = state.customers.some(
      (c) => c.room === 'inside' && (c.seatIndex === 3 || c.x > 580)
    );
    if (hasGarageGuest) {
      triggerPhotoSquadFlash(state);
      hudChanged = true;
    }
  }

  // Active Hired Staff Simulation (Momo Sous-Barista & Ken Floor/Garden Server)
  // Both continuously walk patrol routes with collision & waypoint routing so they never stand frozen!
  const momoPatrol = [
    { x: 112, y: 186 },
    { x: 268, y: 186 },
    { x: 424, y: 186 },
    { x: 356, y: 196 },
  ];
  const kenInsidePatrol = [
    { x: 356, y: 294 },
    { x: 244, y: 344 },
    { x: 504, y: 318 },
    { x: 648, y: 274 },
  ];

  state.staff.forEach((worker) => {
    if (!worker.hired) return;

    const moveRes = stepAlongWaypoints(worker, 138, dt, worker.room, 8);
    if (moveRes.distMoved > 0) {
      worker.walkDist += moveRes.distMoved;
    }

    worker.actionTimer -= dt;
    if (worker.actionTimer <= 0) {
      if (worker.id === 'momo') {
        worker.actionTimer = 0.95;
        const frontCust = getFrontWaitingCustomer(state);
        if (frontCust && state.prep.currentStepIndex < 3 && state.prep.processingStation === null) {
          const nextSt = getRecommendedStation(state);
          if (nextSt) {
            const stObj = STATIONS.find((s) => s.id === nextSt);
            if (stObj) {
              worker.targetX = stObj.x;
              worker.targetY = 186;
              worker.waypoints = buildWaypoints(worker.x, worker.y, worker.targetX, worker.targetY, worker.room);
            }
            worker.carryingProp = 'cup';
            worker.statusText = `Brewing ${nextSt.toUpperCase()}`;
            interactWithStation(state, nextSt, true);
            hudChanged = true;
          }
        } else {
          if (state.prep.currentStepIndex === 0) {
            worker.carryingProp = null;
          }
          // Patrol along the espresso bar so Momo never stands frozen
          if (moveRes.reachedFinal) {
            const nextIdx = ((worker.patrolIndex ?? 0) + 1) % momoPatrol.length;
            worker.patrolIndex = nextIdx;
            worker.targetX = momoPatrol[nextIdx].x;
            worker.targetY = momoPatrol[nextIdx].y;
            worker.waypoints = buildWaypoints(worker.x, worker.y, worker.targetX, worker.targetY, worker.room);
            worker.statusText = 'Prepping Bar';
          }
        }
      } else if (worker.id === 'ken') {
        worker.actionTimer = 1.15;
        if (state.prep.currentStepIndex === 3 && state.prep.activeDrink) {
          worker.room = 'inside';
          worker.targetX = 356;
          worker.targetY = 294;
          worker.waypoints = buildWaypoints(worker.x, worker.y, worker.targetX, worker.targetY, 'inside');
          worker.carryingProp = 'cup';
          worker.statusText = 'Serving Order!';
          const res = serveWaitingCustomer(state, true);
          if (res.served) {
            hudChanged = true;
          }
        } else if (state.tipJarCoins >= 9) {
          worker.targetX = TIP_JAR_BOUNDS.x;
          worker.targetY = 294;
          worker.waypoints = buildWaypoints(worker.x, worker.y, worker.targetX, worker.targetY, 'inside');
          collectTipJar(state);
          hudChanged = true;
        } else {
          const thirsty = state.daisies.find((d) => d.needsWater);
          if (thirsty) {
            worker.carryingProp = 'water';
            worker.statusText = `Watering ${thirsty.name}`;
            waterDaisyPatch(state, thirsty.id, true);
            hudChanged = true;
          } else {
            worker.carryingProp = null;
            if (moveRes.reachedFinal) {
              const nextIdx = ((worker.patrolIndex ?? 0) + 1) % kenInsidePatrol.length;
              worker.patrolIndex = nextIdx;
              worker.targetX = kenInsidePatrol[nextIdx].x;
              worker.targetY = kenInsidePatrol[nextIdx].y;
              worker.waypoints = buildWaypoints(worker.x, worker.y, worker.targetX, worker.targetY, worker.room);
              worker.statusText = 'Checking Tables';
            }
          }
        }
      }
    }
  });

  const prevCozy = state.cozyRating;
  state.daisies.forEach((patch, idx) => {
    if (state.weather === 'rain') {
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
    state.weather,
    state.decorEquipped
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

export function interactWithStation(
  state: CafeState,
  stationId: StationId,
  fromAutoStaff = false
): StationInteractionResult {
  const prep = state.prep;

  if (stationId === 'watering_can') {
    prep.holdingWateringCan = true;
    waterAllThirstyDaisies(state);
    return { handled: true, actionType: 'equip_can', message: state.lastMessage };
  }

  if (!fromAutoStaff && state.room !== 'inside') {
    state.room = 'inside';
    state.barista.x = 296;
    state.barista.y = 196;
  }

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

  if (prep.currentStepIndex === 3 && prep.activeDrink) {
    return {
      handled: true,
      actionType: 'drink_ready',
      message: `${RECIPES[prep.activeDrink].name} is ready! Press [Enter] or click customer to serve.`,
      stationId: 'cup_counter',
    };
  }

  if (waitingCustomer && (!prep.activeDrink || prep.currentStepIndex === 0)) {
    prep.activeDrink = waitingCustomer.order;
  } else if (!prep.activeDrink) {
    prep.activeDrink = stationId === 'kettle' ? 'catnip_herbal_tea' : 'miata_mocha';
  }

  const recipe = RECIPES[prep.activeDrink];
  const expectedStationId = recipe.steps[prep.currentStepIndex];

  const effectiveStationId: StationId = expectedStationId ?? stationId;
  const duration = getStationProcessDuration(state, effectiveStationId);

  prep.processingStation = effectiveStationId;
  prep.processDuration = duration;
  prep.processTimer = duration;

  const stepNum = prep.currentStepIndex + 1;
  const stTier =
    effectiveStationId !== 'cup_counter' &&
    effectiveStationId !== 'trash' &&
    effectiveStationId !== 'watering_can'
      ? state.stationLevels[effectiveStationId as UpgradableStationId]
      : null;
  const tierTag = stTier ? ` [Lvl ${stTier} · ${duration.toFixed(1)}s]` : '';
  state.lastMessage = `Step ${stepNum}/3: ${recipe.stepLabels[prep.currentStepIndex]} (${recipe.name})${tierTag}...`;

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
  cogsIncurred: number;
  netProfitEarned: number;
  heartsEarned: number;
  routedToGarden?: boolean;
  rainTakeout?: boolean;
  goalJustReached?: boolean;
  message: string;
}

export function serveWaitingCustomer(state: CafeState, fromAutoStaff = false): ServeResult {
  const prep = state.prep;
  if (prep.currentStepIndex < 3 || !prep.activeDrink) {
    return {
      served: false,
      coinsEarned: 0,
      cogsIncurred: 0,
      netProfitEarned: 0,
      heartsEarned: 0,
      message: 'Finish all 3 prep steps first (or tap ⚡ BREW / SERVE)!',
    };
  }

  const waitingCustomer = getFrontWaitingCustomer(state);
  if (!waitingCustomer) {
    return {
      served: false,
      coinsEarned: 0,
      cogsIncurred: 0,
      netProfitEarned: 0,
      heartsEarned: 0,
      message: 'Wait a moment for the next guest party to walk up to the counter.',
    };
  }

  const craftedDrink = waitingCustomer.order;
  const recipe = RECIPES[craftedDrink];

  // Real Business Economics: Revenue, COGS & Ingredient Stock Accounting
  const cozyBonus = state.cozyRating >= 80 ? 5 : state.cozyRating >= 60 ? 3 : 0;
  const baseDrinkPrice = getDrinkSellingPrice(state, craftedDrink);
  const grossSale = baseDrinkPrice + cozyBonus;

  let cogsIncurred = 0;
  let emergencyRestockUsed = false;
  if (state.finance.ingredientStock > 0) {
    state.finance.ingredientStock -= 1;
    cogsIncurred = getUnitCogs(state, false);
  } else {
    emergencyRestockUsed = true;
    cogsIncurred = getUnitCogs(state, true);
  }

  // Check available Indoor/Garage vs. Backyard Garden seating BEFORE finalizing takeout bonus
  const occupiedSeats = new Set(
    state.customers
      .filter((c) => (c.state === 'sipping' || c.state === 'walking_to_garden') && c.seatIndex !== null)
      .map((c) => c.seatIndex!)
  );

  const indoorFreeSeat = ALL_CUSTOMER_SEATS.slice(0, 4).find((s) => !occupiedSeats.has(s.idx));
  const gardenFreeSeat = ALL_CUSTOMER_SEATS.slice(4, 8).find((s) => !occupiedSeats.has(s.idx));

  const isRainTakeout = !indoorFreeSeat && state.weather === 'rain';
  const takeoutBonus = isRainTakeout ? 4 : 0;
  const totalGrossSale = grossSale + takeoutBonus;

  const cashDelta = emergencyRestockUsed
    ? Number((totalGrossSale - cogsIncurred).toFixed(2))
    : totalGrossSale;
  state.coins = Number((state.coins + cashDelta).toFixed(2));
  state.finance.grossRevenue = Number((state.finance.grossRevenue + totalGrossSale).toFixed(2));
  state.finance.totalCogs = Number((state.finance.totalCogs + cogsIncurred).toFixed(2));
  recalculateProfitMetrics(state.finance);

  const netProfitEarned = Number((totalGrossSale - cogsIncurred).toFixed(2));
  const heartsEarned = state.cozyRating >= 75 ? 2 : 1;

  state.tipJarCoins += isRainTakeout ? 5 : 3;
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
    state.weather,
    state.decorEquipped
  );
  state.bestCozyRating = Math.max(state.bestCozyRating, state.cozyRating);

  prep.activeDrink = null;
  prep.currentStepIndex = 0;
  prep.processingStation = null;
  prep.processTimer = 0;

  spawnPopup(
    state,
    isRainTakeout
      ? `TAKEOUT! ☔ +$${totalGrossSale}`
      : `+$${totalGrossSale} (NET +$${netProfitEarned.toFixed(1)})`,
    waitingCustomer.x,
    waitingCustomer.y - 32,
    isRainTakeout ? '#7dd3fc' : '#facc15',
    'inside'
  );

  waitingCustomer.heartsGiven = heartsEarned;
  waitingCustomer.carryingCup = true;
  // 20 to 30 seconds realistic table dining duration
  waitingCustomer.sipTimer = 22 + (state.servedCount % 9);
  waitingCustomer.sipBubbleTimer = 3.2;

  let routedToGarden = false;
  if (indoorFreeSeat) {
    waitingCustomer.state = 'sipping';
    waitingCustomer.seatIndex = indoorFreeSeat.idx;
    waitingCustomer.room = 'inside';
    waitingCustomer.targetX = indoorFreeSeat.x;
    waitingCustomer.targetY = indoorFreeSeat.y;
    waitingCustomer.waypoints = buildWaypoints(
      waitingCustomer.x,
      waitingCustomer.y,
      indoorFreeSeat.x,
      indoorFreeSeat.y,
      'inside'
    );
    waitingCustomer.dialogueText =
      indoorFreeSeat.idx === 3 ? '📸 Sweet 1990 Miata!' : '♥ Cozy indoor table!';
  } else if (isRainTakeout) {
    // Rainy Weather (`🌧️ RAIN`): Do NOT sit outside in the rain! Show "TAKEOUT! ☔" bubble and walk out exit door!
    waitingCustomer.isTakeout = true;
    waitingCustomer.state = 'walking_out';
    waitingCustomer.seatIndex = null;
    waitingCustomer.room = 'inside';
    waitingCustomer.targetX = INSIDE_DOOR_MAT.x;
    waitingCustomer.targetY = 448;
    waitingCustomer.waypoints = buildWaypoints(
      waitingCustomer.x,
      waitingCustomer.y,
      INSIDE_DOOR_MAT.x,
      448,
      'inside'
    );
    waitingCustomer.dialogueText = 'TAKEOUT! ☔';
  } else if (gardenFreeSeat) {
    // Clear / Breeze Weather + All 4 Indoor/Garage tables occupied -> Smart Indoor-to-Outdoor Overflow!
    routedToGarden = true;
    waitingCustomer.state = 'walking_to_garden';
    waitingCustomer.seatIndex = gardenFreeSeat.idx;
    waitingCustomer.room = 'inside';
    waitingCustomer.targetX = INSIDE_DOOR_MAT.x;
    waitingCustomer.targetY = INSIDE_DOOR_MAT.y;
    waitingCustomer.waypoints = buildWaypoints(
      waitingCustomer.x,
      waitingCustomer.y,
      INSIDE_DOOR_MAT.x,
      INSIDE_DOOR_MAT.y,
      'inside'
    );
    waitingCustomer.finalTargetX = gardenFreeSeat.x;
    waitingCustomer.finalTargetY = gardenFreeSeat.y;
    waitingCustomer.dialogueText = 'Heading to Garden Patio! 🌼';
  } else {
    waitingCustomer.state = 'walking_out';
    waitingCustomer.targetX = INSIDE_DOOR_MAT.x;
    waitingCustomer.targetY = 448;
    waitingCustomer.waypoints = buildWaypoints(
      waitingCustomer.x,
      waitingCustomer.y,
      INSIDE_DOOR_MAT.x,
      448,
      'inside'
    );
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
    c.waypoints = buildWaypoints(c.x, c.y, slot.x, slot.y, 'inside');
  });

  // Spawn replacement customer party at the back of the queue up to MAX_SIMULTANEOUS_CUSTOMERS (7)
  while (
    state.customers.length < MAX_SIMULTANEOUS_CUSTOMERS &&
    state.customers.filter((c) => c.state === 'waiting' || c.state === 'walking_in').length < 2
  ) {
    const activeQ = state.customers.filter(
      (c) => c.state === 'waiting' || c.state === 'walking_in'
    );
    const slotIdx = activeQ.length;
    const seq = state.servedCount + slotIdx + 2;
    const newParty = createCustomerParty(seq, slotIdx, state.elapsedSeconds, slotIdx === 0);
    state.customers.push(newParty);
  }

  state.lastMessage = goalJustReached
    ? `★ SHIFT SUCCESS! Daily goal (${state.servedCount}/${state.dailyTarget}) reached! Net Profit: $${state.finance.netProfit.toFixed(2)}.`
    : isRainTakeout
      ? `🌧️ Rainy Takeout! ${waitingCustomer.name}'s party took ${recipe.name} to-go (TAKEOUT! ☔ +$4 tip bonus)!`
      : `${fromAutoStaff ? 'Ken served' : 'Served'} ${recipe.name} to ${waitingCustomer.name}'s ${waitingCustomer.partyKind} party! Rev +$${totalGrossSale}, COGS -$${cogsIncurred.toFixed(2)}, Net +$${netProfitEarned.toFixed(2)}${routedToGarden ? ' (Routed to Garden!)' : ''}.`;

  if (!fromAutoStaff) {
    triggerHaptic(15);
  }
  saveCafeProgressV2(state);

  return {
    served: true,
    customer: waitingCustomer,
    coinsEarned: totalGrossSale,
    cogsIncurred,
    netProfitEarned,
    heartsEarned,
    routedToGarden,
    rainTakeout: isRainTakeout,
    goalJustReached,
    message: state.lastMessage,
  };
}

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
    state.prep.holdingWateringCan = true;
  }

  const wasThirsty = patch.needsWater || patch.hydration < 85;
  patch.hydration = 100;
  patch.needsWater = false;
  patch.bloomStage = 3;
  patch.lastWateredAt = state.elapsedSeconds;

  if (wasThirsty) {
    state.coins = Number((state.coins + 2).toFixed(2));
  }

  state.cozyRating = calculateCozyRating(
    state.daisies,
    state.hearts,
    state.catPetBonus,
    state.weather,
    state.decorEquipped
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

export function waterAllThirstyDaisies(state: CafeState): DaisyPatch[] {
  state.prep.holdingWateringCan = true;
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

  state.coins = Number((state.coins + bonusCoins).toFixed(2));
  state.cozyRating = calculateCozyRating(
    state.daisies,
    state.hearts,
    state.catPetBonus,
    state.weather,
    state.decorEquipped
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
  triggerHaptic(15);
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
  saveCafeProgressV2(state);
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
    state.weather,
    state.decorEquipped
  );
  state.bestCozyRating = Math.max(state.bestCozyRating, state.cozyRating);
  triggerHaptic(15);

  spawnPopup(
    state,
    `♥ ${targetCat.name.toUpperCase()} ♪`,
    targetCat.x,
    targetCat.y - 24,
    '#fb7185',
    targetCat.room
  );

  state.lastMessage = `Petted ${targetCat.name}! Purrrr~ ♥♪ +Speed Boost & Cozy Rating ${state.cozyRating}%!`;
  saveCafeProgressV2(state);
  return targetCat;
}
