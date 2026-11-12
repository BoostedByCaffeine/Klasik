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
  cycleViewMode,
  getRecommendedStation,
} from './rules';

test('initial Garden Garage Cafe state includes 1990 Miata MX-5, Lilo & Champy cats, viewMode, and waiting customer', () => {
  const state = createInitialCafeState(true);
  assert.equal(state.mode, 'playing');
  assert.equal(state.viewMode, 'all');
  assert.equal(state.cats.length, 2);
  assert.equal(state.cats[0].name, 'Lilo');
  assert.equal(state.cats[1].name, 'Champy');
  assert.equal(state.miataHeadlightsOn, true);
  assert.equal(state.customers[0].order, 'miata_mocha');
  assert.equal(getRecommendedStation(state), 'grinder');
});

test("3-step '90s Miata Mocha crafting and serving flows work accurately", () => {
  const state = createInitialCafeState(true);
  state.customers[0].order = 'miata_mocha';

  // Step 1: Grinder
  assert.equal(interactWithStation(state, 'grinder').handled, true);
  advancePrepTimer(state, 1.0);
  assert.equal(state.prep.currentStepIndex, 1);
  assert.equal(getRecommendedStation(state), 'espresso');

  // Step 2: Espresso
  assert.equal(interactWithStation(state, 'espresso').handled, true);
  advancePrepTimer(state, 1.0);
  assert.equal(state.prep.currentStepIndex, 2);
  assert.equal(getRecommendedStation(state), 'cup_counter');

  // Step 3: Cup Counter
  assert.equal(interactWithStation(state, 'cup_counter').handled, true);
  advancePrepTimer(state, 0.5);
  assert.equal(state.prep.currentStepIndex, 3);
  assert.equal(getRecommendedStation(state), null);

  const res = serveWaitingCustomer(state);
  assert.equal(res.served, true);
  assert.equal(state.servedCount, 1);
});

test('executeSmartStep automatically progresses through all 3 recipe steps and serves customer without step-locking', () => {
  const state = createInitialCafeState(true);
  state.customers[0].order = 'catnip_herbal_tea';

  // Tap 1: starts kettle (Step 1)
  const s1 = executeSmartStep(state);
  assert.equal(s1.type, 'station');
  assert.equal(s1.stationId, 'kettle');

  // Tap 2 while kettle is still running: auto-finishes Step 1 and starts tea_leaves (Step 2)
  const s2 = executeSmartStep(state);
  assert.equal(s2.type, 'station');
  assert.equal(s2.stationId, 'tea_leaves');

  // Tap 3: auto-finishes Step 2 and starts cup_counter (Step 3)
  const s3 = executeSmartStep(state);
  assert.equal(s3.type, 'station');
  assert.equal(s3.stationId, 'cup_counter');

  // Tap 4: auto-finishes Step 3 and serves customer!
  const s4 = executeSmartStep(state);
  assert.equal(s4.type, 'serve');
  assert.equal(s4.servedResult?.served, true);
  assert.equal(state.servedCount, 1);
});

test('toggling 1990 Mazda Miata MX-5 headlights and cycling ViewMode (all -> indoor -> outdoor) updates state cleanly', () => {
  const state = createInitialCafeState(true);
  assert.equal(state.miataHeadlightsOn, true);
  toggleMiataHeadlights(state);
  assert.equal(state.miataHeadlightsOn, false);
  toggleMiataHeadlights(state);
  assert.equal(state.miataHeadlightsOn, true);

  assert.equal(cycleViewMode(state), 'indoor');
  assert.equal(cycleViewMode(state), 'outdoor');
  assert.equal(cycleViewMode(state), 'all');
});

test('petting Lilo or Champy grants heart, speed boost, and Cozy Rating bonus, and watering daisies awards coin tip and popup', () => {
  const state = createInitialCafeState(true);
  const initialCozy = state.cozyRating;
  const cat = petCatCompanion(state, 'lilo');
  assert.equal(cat.name, 'Lilo');
  assert.equal(cat.state, 'purring');
  assert.ok(state.barista.speedBoostTimer > 0);
  assert.ok(state.cozyRating > initialCozy);

  const coinsBefore = state.coins;
  const thirsty = state.daisies.find((d) => d.needsWater)!;
  const ratingBeforeWater = calculateCozyRating(state.daisies, state.hearts, state.catPetBonus);
  waterDaisyPatch(state, thirsty.id);
  const ratingAfterWater = calculateCozyRating(state.daisies, state.hearts, state.catPetBonus);
  assert.ok(ratingAfterWater > ratingBeforeWater);
  assert.equal(state.coins, coinsBefore + 2);
  assert.ok(state.popups.length >= 2);
});
