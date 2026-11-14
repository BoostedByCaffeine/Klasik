import test from 'node:test';
import assert from 'node:assert/strict';
import {
  createInitialCafeState,
  interactWithStation,
  serveWaitingCustomer,
  waterAllThirstyDaisies,
  toggleMiataHeadlights,
  cycleMiataPaintColor,
  collectTipJar,
  hireNextStaff,
  hireStaffById,
  deductDailyStaffPayroll,
  upgradeStationEquipment,
  getStationProcessDuration,
  purchaseOrToggleDecor,
  hitsCollider,
  moveEntityWithCollisions,
  buildWaypoints,
  createCustomerParty,
  petCatCompanion,
  executeSmartStep,
  toggleRoom,
  cycleTimeOfDay,
  cycleWeather,
  advanceEnvironmentAndHydration,
  advanceCustomersSimulation,
  getTimeOfDayFromHour,
  screenToWorldContain,
  getRecommendedStation,
  updateBaristaAppearance,
  restockWholesaleIngredients,
  purchaseCapitalUpgrade,
  triggerPhotoSquadFlash,
  completeShift,
  isOutfitUnlocked,
  BARISTA_OUTFITS,
  INSIDE_DOOR_MAT,
  INDOOR_TABLES,
  GARDEN_TABLES,
  ALL_CUSTOMER_SEATS,
  TIP_JAR_BOUNDS,
  getPartySeatedPositions,
  toggleWholesaleAutoRestock,
  CAFE_SAVE_KEY_V2,
  saveCafeProgressV2,
  loadCafeProgressV2,
  resetCafeProgressV2,
  CUSTOMER_EMOTE_POOLS,
  getCustomerPatiencePct,
  spawnCustomerEmote,
  clampCamera2D,
  getDefaultCameraForViewport,
} from './rules';
import { isStandaloneApp } from '../pwa/pwaManager';

test('customer dialogue bubble emotes spawn randomized emotes based on patience levels and order receipt', () => {
  const state = createInitialCafeState(true);
  const cust = state.customers[0];

  // Initial waiting customer has high patience (> 65%)
  assert.ok(getCustomerPatiencePct(cust, state.elapsedSeconds) > 0.65);

  // Trigger calm patience emote
  const calmEmote = spawnCustomerEmote(cust, 'patience_calm', () => 0.1);
  assert.equal(CUSTOMER_EMOTE_POOLS.patience_calm.includes(calmEmote), true);
  assert.equal(cust.emoteText, calmEmote);
  assert.ok((cust.emoteTimer ?? 0) > 1.0);

  // Advance elapsed time into alert zone (waitElapsed = 24s -> patiencePct = 0.60 -> stage 2)
  state.elapsedSeconds = cust.arrivalTime + 24;
  cust.lastPatienceStage = 1;
  advanceCustomersSimulation(state, 0.1);
  assert.equal(cust.lastPatienceStage, 2);
  assert.equal(CUSTOMER_EMOTE_POOLS.patience_alert.includes(cust.emoteText!), true);

  // Advance elapsed time into urgent zone (waitElapsed = 42s -> patiencePct = 0.30 -> stage 3)
  state.elapsedSeconds = cust.arrivalTime + 42;
  advanceCustomersSimulation(state, 0.1);
  assert.equal(cust.lastPatienceStage, 3);
  assert.equal(CUSTOMER_EMOTE_POOLS.patience_urgent.includes(cust.emoteText!), true);

  // Serving customer triggers order_received emote ('!', '!!', '♥', '♪', '★')
  state.prep.activeDrink = cust.order;
  state.prep.currentStepIndex = 3;
  const serveRes = serveWaitingCustomer(state);
  assert.equal(serveRes.served, true);
  assert.equal(
    CUSTOMER_EMOTE_POOLS.order_received.includes(serveRes.customer!.emoteText!),
    true
  );
  assert.ok((serveRes.customer!.emoteTimer ?? 0) >= 2.0);
});

test('2D pinch-to-zoom & pan camera clamps bounds, defaults to landscape 1.0x overview, and inverts full-stage world coordinates', () => {
  // Default viewport camera is landscape-first 1.0x overview centered at (450, 240)
  const defaultInside = getDefaultCameraForViewport(844, 390, 'inside');
  assert.equal(defaultInside.zoom, 1.0);
  assert.equal(defaultInside.panX, 450);
  assert.equal(defaultInside.panY, 240);

  // Clamping camera keeps pan within world bounds
  const clamped = clampCamera2D({ zoom: 2.0, panX: 50, panY: 20 }, 900, 480);
  assert.equal(clamped.zoom, 2.0);
  assert.equal(clamped.panX, 225); // halfViewW = 900 / 4 = 225
  assert.equal(clamped.panY, 120); // halfViewH = 480 / 4 = 120

  // screenToWorldContain inverts zoom & pan accurately across full-stage viewports
  const rect = { left: 0, top: 0, width: 1200, height: 480 };
  const cam = { zoom: 2.0, panX: 300, panY: 200 };
  // Clicking exact center of full-stage canvas (600, 240) maps to (panX, panY) = (300, 200)
  const worldCenter = screenToWorldContain(600, 240, rect, 900, 480, cam);
  assert.equal(Math.round(worldCenter.x), 300);
  assert.equal(Math.round(worldCenter.y), 200);
});

test('automatic local save (klasik_cafe_save_v2) persists and restores progress and supports reset', () => {
  const store = new Map<string, string>();
  const mockStorage = {
    getItem: (k: string) => store.get(k) ?? null,
    setItem: (k: string, v: string) => {
      store.set(k, v);
    },
    removeItem: (k: string) => {
      store.delete(k);
    },
  };
  (globalThis as unknown as { window: unknown }).window = {
    localStorage: mockStorage,
  };

  try {
    const state = createInitialCafeState(true);
    state.coins = 250;
    state.miataColor = 'white';
    state.stationLevels.espresso = 3;
    state.decorOwned.checkered_marble_floor = true;
    state.decorEquipped.checkered_marble_floor = true;
    saveCafeProgressV2(state);

    assert.equal(store.has(CAFE_SAVE_KEY_V2), true);

    const restored = createInitialCafeState(true);
    assert.equal(restored.coins, 250);
    assert.equal(restored.miataColor, 'white');
    assert.equal(restored.stationLevels.espresso, 3);
    assert.equal(restored.decorEquipped.checkered_marble_floor, true);

    const reset = resetCafeProgressV2(true);
    assert.equal(reset.coins, 45);
    assert.equal(reset.miataColor, 'red');
    assert.equal(reset.stationLevels.espresso, 1);
  } finally {
    delete (globalThis as unknown as { window?: unknown }).window;
  }
});

test('initial state starts in boot mode (or playing with autostart), with zero static mannequins and dynamic parties', () => {
  const bootState = createInitialCafeState(false);
  assert.equal(bootState.mode, 'boot');
  assert.equal(bootState.appearance.name, 'Klasik');
  assert.equal(bootState.finance.ingredientStock, 12);

  const state = createInitialCafeState(true);
  assert.equal(state.mode, 'playing');
  assert.equal(state.room, 'inside');
  assert.equal(state.miataColor, 'red');
  assert.equal(state.customers.length, 2);
  assert.equal(state.customers[0].name, 'Flora');
  assert.equal(state.customers[1].name, 'Takumi');
  // Static display NPCs are removed in favor of living dynamic customer parties
  assert.equal(state.couples.length, 0);
  assert.equal(state.photoSquad.members.length, 0);
  assert.equal(state.daisies.length, 6);
  assert.equal(getRecommendedStation(state), 'grinder');
});

test('strict 2D AABB collision physics and multi-waypoint pathfinding prevent wall/counter/Miata clipping', () => {
  // Cashier/Front Counter (x: 68..428, y: 212..276) blocks direct walk-through
  assert.equal(Boolean(hitsCollider(250, 240, 'inside', 10)), true);
  // Open barista lane (y: 192) is clear
  assert.equal(Boolean(hitsCollider(250, 192, 'inside', 10)), false);
  // 1990 Miata MX-5 chassis (x: 786, y: 204) blocks walk-through
  assert.equal(Boolean(hitsCollider(786, 204, 'inside', 10)), true);

  // Attempting to move from y=192 straight down into the counter at y=225 stops at y=192
  const entity = { x: 250, y: 192 };
  const blocked = moveEntityWithCollisions(entity, 0, 33, 'inside', 10);
  assert.equal(blocked.blocked, true);
  assert.equal(entity.y, 192);

  // Waypoint pathfinder routes around the open right-hand walkway end of the espresso counter (x: 472)
  const wps = buildWaypoints(220, 192, 220, 320, 'inside');
  assert.ok(wps.length >= 2);
  assert.equal(wps[0].x, 472);
});

test('staff hiring system recruits Momo ($35) and Ken ($45) and deducts recurring $12/day payroll in P&L ledger', () => {
  const state = createInitialCafeState(true);
  state.coins = 120;

  const hireMomo = hireStaffById(state, 'momo');
  assert.equal(hireMomo.hired, true);
  assert.equal(hireMomo.worker?.name, 'Momo');
  assert.equal(state.coins, 85);

  const hireKen = hireStaffById(state, 'ken');
  assert.equal(hireKen.hired, true);
  assert.equal(hireKen.worker?.name, 'Ken');
  assert.equal(state.coins, 40);

  // Serve a drink so revenue is positive, then complete shift to trigger automatic $24 payroll deduction ($12 x 2)
  state.prep.activeDrink = 'miata_mocha';
  state.prep.currentStepIndex = 3;
  serveWaitingCustomer(state);

  const coinsBeforeShiftEnd = state.coins;
  state.servedCount = state.dailyTarget;
  const shiftRes = completeShift(state);
  assert.equal(shiftRes.payrollDeducted, 24);
  assert.equal(state.finance.payrollExpense, 24);
  assert.equal(state.coins, coinsBeforeShiftEnd - 24);
  assert.equal(
    state.finance.netProfit,
    Number(
      (
        state.finance.grossRevenue -
        state.finance.totalCogs -
        state.finance.payrollExpense
      ).toFixed(2)
    )
  );

  // Direct deductDailyStaffPayroll helper check
  const directPayroll = deductDailyStaffPayroll(state);
  assert.equal(directPayroll.totalSalary, 24);
});

test('multi-tier station upgrades evolve Level 1 (2.8s) -> Level 2 (1.5s) -> Level 3 (0.65s)', () => {
  const state = createInitialCafeState(true);
  state.coins = 500;

  assert.equal(state.stationLevels.grinder, 1);
  assert.equal(getStationProcessDuration(state, 'grinder'), 2.8);

  const upg2 = upgradeStationEquipment(state, 'grinder');
  assert.equal(upg2.upgraded, true);
  assert.equal(upg2.newLevel, 2);
  assert.equal(getStationProcessDuration(state, 'grinder'), 1.5);

  const upg3 = upgradeStationEquipment(state, 'grinder');
  assert.equal(upg3.upgraded, true);
  assert.equal(upg3.newLevel, 3);
  assert.equal(getStationProcessDuration(state, 'grinder'), 0.65);

  // Cannot upgrade past Level 3
  const upgMax = upgradeStationEquipment(state, 'grinder');
  assert.equal(upgMax.upgraded, false);
});

test('decor shop purchases and toggles interior and outdoor garden customizations', () => {
  const state = createInitialCafeState(true);
  state.coins = 300;

  const buyMarble = purchaseOrToggleDecor(state, 'checkered_marble_floor');
  assert.equal(buyMarble.purchased, true);
  assert.equal(buyMarble.equipped, true);
  assert.equal(state.decorOwned.checkered_marble_floor, true);
  assert.equal(state.decorEquipped.checkered_marble_floor, true);

  // Toggling already owned decor unequips/equips without charging coins again
  const coinsAfterBuy = state.coins;
  const toggleOff = purchaseOrToggleDecor(state, 'checkered_marble_floor');
  assert.equal(toggleOff.purchased, false);
  assert.equal(toggleOff.equipped, false);
  assert.equal(state.coins, coinsAfterBuy);
});

test('dynamic customer party generator spawns couples/families/friends and accompanying pets', () => {
  const party0 = createCustomerParty(0, 0, 0);
  const party1 = createCustomerParty(1, 1, 2);
  const party2 = createCustomerParty(2, 0, 4);
  const party3 = createCustomerParty(3, 1, 6);

  assert.equal(party0.partyKind, 'solo');
  assert.ok(party0.pet !== null);

  assert.equal(party1.partyKind, 'couple');
  assert.ok(party1.companions.length >= 1);

  assert.equal(party2.partyKind, 'friends');
  assert.ok(party2.pet !== null);

  assert.equal(party3.partyKind, 'family');
  assert.equal(party3.companions.some((c) => c.isChild), true);
});

test('weather-aware overflow routes 5th customer to Garden in clear weather, or triggers TAKEOUT! ☔ in rain', () => {
  const state = createInitialCafeState(true);
  state.weather = 'clear';

  // Occupy all 4 Indoor/Garage tables (seats 0..3)
  for (let i = 0; i < 4; i++) {
    state.prep.activeDrink = 'miata_mocha';
    state.prep.currentStepIndex = 3;
    const res = serveWaitingCustomer(state);
    assert.equal(res.served, true);
    assert.equal(res.routedToGarden, false);
    assert.ok(res.customer!.sipTimer >= 20 && res.customer!.sipTimer <= 30);
  }

  // 5th served customer in clear weather overflows to Garden via South Doorway!
  state.prep.activeDrink = 'miata_mocha';
  state.prep.currentStepIndex = 3;
  const res5 = serveWaitingCustomer(state);
  assert.equal(res5.served, true);
  assert.equal(res5.routedToGarden, true);
  assert.equal(res5.rainTakeout, false);
  const overflowCust = res5.customer!;
  assert.equal(overflowCust.state, 'walking_to_garden');
  assert.equal(overflowCust.targetX, INSIDE_DOOR_MAT.x);
  assert.equal(overflowCust.targetY, INSIDE_DOOR_MAT.y);

  // Move customer to doorway and advance simulation -> switches room to 'garden' and state to 'sipping'
  overflowCust.x = INSIDE_DOOR_MAT.x;
  overflowCust.y = INSIDE_DOOR_MAT.y;
  overflowCust.waypoints = [{ x: INSIDE_DOOR_MAT.x, y: INSIDE_DOOR_MAT.y }];
  advanceCustomersSimulation(state, 0.1);
  assert.equal(overflowCust.room, 'garden');
  assert.equal(overflowCust.state, 'sipping');

  // Now switch weather to RAIN and add a new waiting customer while indoor tables remain full
  state.weather = 'rain';
  const rainParty = createCustomerParty(99, 0, 10, true);
  state.customers.push(rainParty);
  state.prep.activeDrink = 'miata_mocha';
  state.prep.currentStepIndex = 3;

  const rainRes = serveWaitingCustomer(state);
  assert.equal(rainRes.served, true);
  assert.equal(rainRes.routedToGarden, false);
  assert.equal(rainRes.rainTakeout, true);
  assert.equal(rainRes.customer!.isTakeout, true);
  assert.equal(rainRes.customer!.state, 'walking_out');
  assert.equal(rainRes.customer!.dialogueText, 'TAKEOUT! ☔');
});

test('character customization, wholesale restock, capital upgrades, and daily streak milestones work cleanly', () => {
  const state = createInitialCafeState(true, 0);
  state.coins = 300;

  updateBaristaAppearance(state, {
    name: 'Kenji',
    hairColorIndex: 3,
    skinToneIndex: 2,
    outfitStyleId: 'miata_red',
  });
  assert.equal(state.appearance.name, 'Kenji');
  assert.equal(state.appearance.outfitStyleId, 'miata_red');

  assert.equal(restockWholesaleIngredients(state).restocked, true);
  assert.equal(purchaseCapitalUpgrade(state, 'direct_trade_beans').purchased, true);
  assert.equal(purchaseCapitalUpgrade(state, 'dual_boiler').purchased, true);
  assert.equal(purchaseCapitalUpgrade(state, 'custom_sleeves').purchased, true);
  assert.equal(purchaseCapitalUpgrade(state, 'miata_merch_stand').purchased, true);

  const tipsBefore = state.tipJarCoins;
  triggerPhotoSquadFlash(state);
  assert.equal(state.tipJarCoins, tipsBefore + 5);

  const r1 = interactWithStation(state, 'grinder');
  assert.equal(r1.handled, true);
  const r2 = interactWithStation(state, 'espresso');
  assert.equal(r2.handled, true);
  const r3 = interactWithStation(state, 'cup_counter');
  assert.equal(r3.handled, true);
  executeSmartStep(state);

  const rect = { left: 0, top: 0, width: 900, height: 960 };
  const center = screenToWorldContain(450, 480, rect, 900, 480);
  assert.equal(Math.round(center.x), 450);
  assert.equal(Math.round(center.y), 240);

  assert.equal(hireNextStaff(state).hired, true);
  assert.ok(collectTipJar(state) > 0);
  assert.equal(cycleMiataPaintColor(state), 'white');
  assert.equal(getTimeOfDayFromHour(10), 'day');
  cycleTimeOfDay(state);
  cycleWeather(state);
  advanceEnvironmentAndHydration(state, 1.0);
  waterAllThirstyDaisies(state);
  toggleMiataHeadlights(state);
  petCatCompanion(state, 'lilo');
  assert.equal(toggleRoom(state), 'garden');

  const sepia = BARISTA_OUTFITS.find((o) => o.id === 'vintage_sepia')!;
  assert.equal(isOutfitUnlocked(sepia, state.dailyStreak), false);
  state.servedCount = state.dailyTarget;
  const shift1 = completeShift(state);
  assert.equal(shift1.streakIncremented, true);
  assert.equal(shift1.dailyStreak, 1);
  assert.equal(isOutfitUnlocked(sepia, state.dailyStreak), true);
});

test('precision chair-slot seating assigns leftChair, rightChair, topChair, petMatSpot, and tabletop cup positions', () => {
  // Verify explicit chair slot offsets on INDOOR_TABLES and GARDEN_TABLES
  for (const t of [...INDOOR_TABLES, ...GARDEN_TABLES]) {
    assert.deepEqual(t.leftChair, { x: t.x - 32, y: t.y - 4, facing: 'right' });
    assert.deepEqual(t.rightChair, { x: t.x + 32, y: t.y - 4, facing: 'left' });
    assert.deepEqual(t.topChair, { x: t.x, y: t.y - 26, facing: 'down' });
    assert.deepEqual(t.petMatSpot, { x: t.x - 46, y: t.y + 12 });
  }

  // Verify chair slots and petMatSpot never overlap table colliders
  for (const seat of ALL_CUSTOMER_SEATS) {
    assert.equal(hitsCollider(seat.leftChair.x, seat.leftChair.y, seat.room, 8), null);
    assert.equal(hitsCollider(seat.rightChair.x, seat.rightChair.y, seat.room, 8), null);
    assert.equal(hitsCollider(seat.topChair.x, seat.topChair.y, seat.room, 8), null);
    assert.equal(hitsCollider(seat.petMatSpot.x, seat.petMatSpot.y, seat.room, 6), null);
  }

  // Test 3-member Family party with pet seated at Table 0
  const familyParty = createCustomerParty(3, 0, 0, true);
  assert.equal(familyParty.partyKind, 'family');
  assert.equal(familyParty.partySize, 3);
  assert.equal(familyParty.companions[1].name, 'Jr');
  familyParty.pet = {
    kind: 'dog',
    name: 'Mochi',
    x: 100,
    y: 350,
    facing: 'right',
    heartTimer: 0,
  };
  familyParty.seatIndex = 0;
  familyParty.state = 'sipping';

  const seated = getPartySeatedPositions(familyParty)!;
  const table0 = INDOOR_TABLES[0];
  assert.deepEqual(seated.leader, { x: table0.x - 32, y: table0.y - 4, facing: 'right' });
  assert.deepEqual(seated.companions[0], { x: table0.x + 32, y: table0.y - 4, facing: 'left' });
  assert.deepEqual(seated.companions[1], { x: table0.x, y: table0.y - 26, facing: 'down' });
  assert.deepEqual(seated.petSpot, { x: table0.x - 46, y: table0.y + 12 });
  assert.deepEqual(seated.cupPositions[0], { x: table0.x - 10, y: table0.y - 6 });
  assert.deepEqual(seated.cupPositions[1], { x: table0.x + 10, y: table0.y - 6 });

  // Simulate customer arriving at leftChair and finishing 20-30s stay -> clears chair reservation
  const state = createInitialCafeState(true);
  familyParty.x = table0.leftChair.x;
  familyParty.y = table0.leftChair.y;
  familyParty.targetX = table0.leftChair.x;
  familyParty.targetY = table0.leftChair.y;
  familyParty.waypoints = [{ x: table0.leftChair.x, y: table0.leftChair.y }];
  familyParty.sipTimer = 0.05;
  state.customers = [familyParty];

  advanceCustomersSimulation(state, 0.1);
  assert.equal(familyParty.state, 'walking_out');
  assert.equal(familyParty.seatIndex, null);
  assert.equal(familyParty.tableX, undefined);
  assert.equal(familyParty.tableY, undefined);
});

test('wholesale auto-restock and tip jar proximity auto-collect work automatically', () => {
  const state = createInitialCafeState(true);
  state.coins = 50;
  state.finance.ingredientStock = 1;

  // Enable Wholesale Auto-Restock
  assert.equal(toggleWholesaleAutoRestock(state), true);
  assert.equal(state.finance.autoRestock, true);

  // Serve 1 drink so stock drops from 1 -> 0; Auto-Restock immediately buys +10 stock for $20!
  state.prep.activeDrink = 'miata_mocha';
  state.prep.currentStepIndex = 3;
  const serveRes = serveWaitingCustomer(state);
  assert.equal(serveRes.served, true);
  assert.equal(serveRes.cogsIncurred, 2.0); // Wholesale COGS, never $4.00 emergency COGS
  assert.equal(state.finance.ingredientStock, 10);

  // Tip Jar Proximity Auto-Collect: walking barista within 38px of TIP_JAR_BOUNDS collects tips automatically
  state.tipJarCoins = 12;
  const coinsBeforeTip = state.coins;
  state.barista.x = TIP_JAR_BOUNDS.x + 10;
  state.barista.y = TIP_JAR_BOUNDS.y + 10;
  advanceEnvironmentAndHydration(state, 0.1);
  assert.equal(state.tipJarCoins, 0);
  assert.equal(state.coins, coinsBeforeTip + 12);
});

test('isStandaloneApp accurately detects web browser vs. installed PWA and Android TWA/APK', () => {
  const g = globalThis as unknown as {
    window?: unknown;
    document?: unknown;
  };
  try {
    // 1. Standard web browser -> false
    g.window = {
      matchMedia: () => ({ matches: false }),
      navigator: { standalone: false },
    };
    g.document = { referrer: 'https://boostedbycaffeine.github.io/Klasik/' };
    assert.equal(isStandaloneApp(), false);

    // 2. Installed PWA (display-mode: standalone) -> true
    g.window = {
      matchMedia: (q: string) => ({ matches: q === '(display-mode: standalone)' }),
      navigator: {},
    };
    assert.equal(isStandaloneApp(), true);

    // 3. Android APK / TWA (android-app:// referrer) -> true
    g.window = {
      matchMedia: () => ({ matches: false }),
      navigator: {},
    };
    g.document = { referrer: 'android-app://com.boostedbycaffeine.klasik/' };
    assert.equal(isStandaloneApp(), true);
  } finally {
    delete g.window;
    delete g.document;
  }
});


