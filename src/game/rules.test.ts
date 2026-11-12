import test from 'node:test';
import assert from 'node:assert/strict';
import {
  createInitialCafeState,
  interactWithStation,
  advancePrepTimer,
  serveWaitingCustomer,
  waterDaisyPatch,
  toggleMiataHeadlights,
  petCatCompanion,
  calculateCozyRating,
  executeSmartStep,
  toggleRoom,
  cycleTimeOfDay,
  cycleWeather,
  advanceEnvironmentAndHydration,
  getRecommendedStation,
} from './rules';

test('initial state starts in INSIDE room with 6 daisy beds, day lighting, clear weather, and Lilo & Champy', () => {
  const state = createInitialCafeState(true);
  assert.equal(state.mode, 'playing');
  assert.equal(state.room, 'inside');
  assert.equal(state.timeOfDay, 'day');
  assert.equal(state.weather, 'clear');
  assert.equal(state.daisies.length, 6);
  assert.equal(state.cats.length, 2);
  assert.equal(state.cats[0].room, 'inside');
  assert.equal(state.cats[1].room, 'garden');
  assert.equal(getRecommendedStation(state), 'grinder');
});

test('Smart Auto-Switch QoL switches to GARDEN on waterDaisyPatch and back to INSIDE on interactWithStation', () => {
  const state = createInitialCafeState(true);
  assert.equal(state.room, 'inside');

  // Watering a daisy automatically switches to the GARDEN map
  const thirsty = state.daisies.find((d) => d.needsWater)!;
  waterDaisyPatch(state, thirsty.id);
  assert.equal(state.room, 'garden');

  // Triggering a brewing station automatically switches back to the INSIDE map
  assert.equal(interactWithStation(state, 'grinder').handled, true);
  assert.equal(state.room, 'inside');

  // Manual room doorway toggle works cleanly
  assert.equal(toggleRoom(state), 'garden');
  assert.equal(toggleRoom(state), 'inside');
});

test('executeSmartStep automatically progresses through all 3 recipe steps and serves customer', () => {
  const state = createInitialCafeState(true);
  state.customers[0].order = 'catnip_herbal_tea';

  const s1 = executeSmartStep(state);
  assert.equal(s1.type, 'station');
  assert.equal(s1.stationId, 'kettle');

  const s2 = executeSmartStep(state);
  assert.equal(s2.type, 'station');
  assert.equal(s2.stationId, 'tea_leaves');

  const s3 = executeSmartStep(state);
  assert.equal(s3.type, 'station');
  assert.equal(s3.stationId, 'cup_counter');

  const s4 = executeSmartStep(state);
  assert.equal(s4.type, 'serve');
  assert.equal(s4.servedResult?.served, true);
  assert.equal(state.servedCount, 1);
});

test('Day/Sunset/Night cycle and Weather cycle with Rain +4%/s daisy hydration regeneration and Cozy bonus', () => {
  const state = createInitialCafeState(true);
  assert.equal(cycleTimeOfDay(state), 'sunset');
  assert.equal(cycleTimeOfDay(state), 'night');
  assert.equal(cycleTimeOfDay(state), 'day');

  const cozyClear = state.cozyRating;
  assert.equal(cycleWeather(state), 'breeze');
  assert.equal(cycleWeather(state), 'rain');
  assert.ok(state.cozyRating > cozyClear);

  const beforeHydration = state.daisies[0].hydration;
  advanceEnvironmentAndHydration(state, 2.0); // 2 seconds of rain => +8% hydration
  assert.equal(Math.round(state.daisies[0].hydration), Math.round(beforeHydration + 8));
});

test('3-step Miata Mocha crafting, headlight toggling, and cat petting work accurately', () => {
  const state = createInitialCafeState(true);
  state.customers[0].order = 'miata_mocha';

  interactWithStation(state, 'grinder');
  advancePrepTimer(state, 1.0);
  interactWithStation(state, 'espresso');
  advancePrepTimer(state, 1.0);
  interactWithStation(state, 'cup_counter');
  advancePrepTimer(state, 0.5);

  const res = serveWaitingCustomer(state);
  assert.equal(res.served, true);

  toggleMiataHeadlights(state);
  assert.equal(state.miataHeadlightsOn, false);

  const initialCozy = calculateCozyRating(state.daisies, state.hearts, state.catPetBonus, state.weather);
  const cat = petCatCompanion(state, 'lilo');
  assert.equal(cat.state, 'purring');
  assert.ok(state.cozyRating > initialCozy);
});
