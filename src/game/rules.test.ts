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
  petCatCompanion,
  executeSmartStep,
  toggleRoom,
  cycleTimeOfDay,
  cycleWeather,
  advanceEnvironmentAndHydration,
  getTimeOfDayFromHour,
  screenToWorldContain,
  getRecommendedStation,
} from './rules';

test('initial state starts in INSIDE room with Classic Red 1990 Miata, 2 waiting customers in queue, 4 dating couples, photo squad, and 6 daisy beds', () => {
  const state = createInitialCafeState(true);
  assert.equal(state.mode, 'playing');
  assert.equal(state.room, 'inside');
  assert.equal(state.miataColor, 'red');
  assert.equal(state.customers.length, 2);
  assert.equal(state.customers[0].name, 'Flora');
  assert.equal(state.customers[1].name, 'Takumi');
  assert.equal(state.couples.length, 4);
  assert.equal(state.photoSquad.members.length, 3);
  assert.equal(state.daisies.length, 6);
  assert.equal(state.cats[0].state, 'yarn_play');
  assert.equal(state.cats[1].state, 'stretching');
  assert.equal(getRecommendedStation(state), 'grinder');
});

test('clicking a station while a step is in progress smoothly completes current step and immediately starts the next step without dropping input', () => {
  const state = createInitialCafeState(true);

  // Click 1: Starts Step 1 (grinder)
  const r1 = interactWithStation(state, 'grinder');
  assert.equal(r1.handled, true);
  assert.equal(state.prep.processingStation, 'grinder');
  assert.equal(state.prep.currentStepIndex, 0);

  // Click 2 (while grinder is still running!): Smoothly completes Step 1 AND starts Step 2 (espresso)
  const r2 = interactWithStation(state, 'espresso');
  assert.equal(r2.handled, true);
  assert.equal(state.prep.currentStepIndex, 1);
  assert.equal(state.prep.processingStation, 'espresso');

  // Click 3 (while espresso is still running!): Smoothly completes Step 2 AND starts Step 3 (cup_counter)
  const r3 = interactWithStation(state, 'cup_counter');
  assert.equal(r3.handled, true);
  assert.equal(state.prep.currentStepIndex, 2);
  assert.equal(state.prep.processingStation, 'cup_counter');

  // Click 4: Completes Step 3 -> drink ready!
  executeSmartStep(state);
  assert.equal(state.prep.currentStepIndex, 0); // Served Flora immediately!
  assert.equal(state.servedCount, 1);
});

test('screenToWorldContain accurately maps coordinates when letterboxed or pillarboxed', () => {
  // 900x480 inside a 900x960 portrait container (240px top/bottom letterbox bars)
  const rect = { left: 0, top: 0, width: 900, height: 960 };
  const center = screenToWorldContain(450, 480, rect, 900, 480);
  assert.equal(Math.round(center.x), 450);
  assert.equal(Math.round(center.y), 240);

  // Top edge of rendered canvas is at clientY = 240
  const topEdge = screenToWorldContain(112, 240, rect, 900, 480);
  assert.equal(Math.round(topEdge.x), 112);
  assert.equal(Math.round(topEdge.y), 0);
});

test('hiring Miko ($35) and Ken ($50), collecting Tip Jar, cycling Miata paint, and Shift Success trigger work accurately', () => {
  const state = createInitialCafeState(true);
  state.coins = 100;

  // Hire Worker 1: Miko ($35)
  const h1 = hireNextStaff(state);
  assert.equal(h1.hired, true);
  assert.equal(h1.worker?.id, 'miko');
  assert.equal(state.coins, 65);

  // Hire Worker 2: Ken ($50)
  const h2 = hireNextStaff(state);
  assert.equal(h2.hired, true);
  assert.equal(h2.worker?.id, 'ken');
  assert.equal(state.coins, 15);

  // Collect Tip Jar (+6c)
  const tips = collectTipJar(state);
  assert.equal(tips, 6);
  assert.equal(state.coins, 21);

  // Cycle Miata Paint at Tool Chest (red -> white -> black -> red)
  assert.equal(cycleMiataPaintColor(state), 'white');
  assert.equal(cycleMiataPaintColor(state), 'black');
  assert.equal(cycleMiataPaintColor(state), 'red');

  // Reaching dailyTarget triggers shiftSuccessBannerVisible
  state.servedCount = 5;
  state.prep.activeDrink = 'miata_mocha';
  state.prep.currentStepIndex = 3;
  const serveRes = serveWaitingCustomer(state);
  assert.equal(serveRes.served, true);
  assert.equal(serveRes.goalJustReached, true);
  assert.equal(state.shiftSuccessBannerVisible, true);
});

test('time-of-day hour mapping, manual override, weather rain hydration, and waterAllThirstyDaisies work cleanly', () => {
  assert.equal(getTimeOfDayFromHour(10), 'day');
  assert.equal(getTimeOfDayFromHour(18), 'sunset');
  assert.equal(getTimeOfDayFromHour(22), 'night');

  const state = createInitialCafeState(true);
  cycleTimeOfDay(state);
  assert.equal(state.timeManualOverride, true);

  cycleWeather(state); // breeze
  cycleWeather(state); // rain
  const before = state.daisies[0].hydration;
  advanceEnvironmentAndHydration(state, 2.0);
  assert.equal(Math.round(state.daisies[0].hydration), Math.round(before + 8));

  waterAllThirstyDaisies(state);
  assert.ok(state.daisies.every((d) => !d.needsWater));

  toggleMiataHeadlights(state);
  assert.equal(state.miataHeadlightsOn, false);
  petCatCompanion(state, 'lilo');
  assert.equal(toggleRoom(state), 'garden');
});
