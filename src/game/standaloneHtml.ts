/**
 * Complete, self-contained single-file HTML, CSS, and JavaScript implementation of
 * "Klasik — Garden Garage Cafe" (GBA Pixel-Art Multi-Map, Day/Night & Weather Edition).
 */
export const STANDALONE_KLASIK_HTML = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />
  <title>Klasik — Garden Garage Cafe ★ (GBA Pixel Edition)</title>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Press+Start+2P&family=VT323&display=swap" rel="stylesheet">
  <style>
    * {
      box-sizing: border-box;
      margin: 0;
      padding: 0;
      user-select: none;
      -webkit-user-select: none;
      image-rendering: pixelated;
    }

    html, body {
      width: 100vw;
      height: 100dvh;
      overflow: hidden;
      background-color: #0b0d12;
      color: #f8fafc;
      font-family: 'VT323', monospace;
    }

    #arcade-shell {
      width: 100vw;
      height: 100dvh;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      background: #0b0d12;
      overflow: hidden;
    }

    .gba-frame {
      background-color: #181c26;
      border: 3px solid #f8fafc;
      box-shadow:
        inset 0 0 0 2px #090b0e,
        0 3px 0 0 #090b0e;
    }

    .gba-dialogue-box {
      background-color: #f8fafc;
      color: #0f172a;
      border: 3px solid #090b0e;
      box-shadow:
        inset 0 0 0 2px #475569,
        0 3px 0 0 #090b0e;
    }

    .gba-btn {
      font-family: 'Press Start 2P', monospace;
      background-color: #1e2433;
      color: #f8fafc;
      border: 2px solid #f8fafc;
      box-shadow:
        inset -2px -2px 0px #090b0e,
        inset 2px 2px 0px #475569,
        0 2px 0 0 #090b0e;
      cursor: pointer;
      transition: transform 60ms steps(2);
    }

    .gba-btn:hover {
      background-color: #2e364d;
      border-color: #facc15;
    }

    .gba-btn:active {
      transform: translateY(2px);
    }

    .gba-btn-active {
      background-color: #14532d !important;
      border-color: #86efac !important;
      color: #fef08a !important;
    }

    .gba-keycap {
      font-family: 'Press Start 2P', monospace;
      font-size: 7px;
      padding: 2px 4px;
      background-color: #090b0e;
      color: #facc15;
      border: 1px solid #64748b;
      display: inline-block;
    }

    /* External Top GBA HUD Bar (Wraps cleanly, Zero Horizontal Scrollbars!) */
    #top-hud {
      width: 100%;
      background: #0b0d12;
      border-bottom: 3px solid #f8fafc;
      padding: 4px 8px;
      display: flex;
      flex-wrap: wrap;
      align-items: center;
      justify-content: space-between;
      gap: 6px;
      flex-shrink: 0;
      overflow-x: hidden;
    }

    .stat-strip {
      display: flex;
      flex-wrap: wrap;
      align-items: center;
      gap: 10px;
      padding: 4px 8px;
      flex-shrink: 0;
    }

    .stat-item {
      display: flex;
      align-items: center;
      gap: 5px;
    }

    .stat-label {
      font-family: 'Press Start 2P', monospace;
      font-size: 8px;
      color: #94a3b8;
    }

    .stat-val {
      font-family: 'Press Start 2P', monospace;
      font-size: 12px;
      color: #f8fafc;
      font-variant-numeric: tabular-nums;
    }

    .divider {
      width: 2px;
      height: 16px;
      background: #334155;
    }

    #order-banner {
      flex: 1;
      min-width: 190px;
      max-width: 440px;
      padding: 3px 10px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 8px;
    }

    @media (max-width: 1100px) {
      #order-banner {
        display: none;
      }
    }

    /* Center GBA Viewport Stage */
    #canvas-stage {
      position: relative;
      flex: 1;
      min-height: 0;
      width: 100%;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 4px;
      background: #0b0d12;
    }

    canvas {
      width: 100%;
      height: 100%;
      object-fit: contain;
      border: 3px solid #334155;
      cursor: pointer;
      image-rendering: pixelated;
    }

    /* Floating Touch-Friendly Quick-Action Bar on Canvas Corner */
    #floating-quickbar {
      position: absolute;
      bottom: 10px;
      right: 12px;
      z-index: 10;
      display: flex;
      flex-wrap: wrap;
      justify-content: flex-end;
      gap: 6px;
      pointer-events: auto;
    }

    .quick-btn {
      padding: 6px 9px;
      font-size: 9px;
      white-space: nowrap;
    }

    /* Collapsible Bottom GBA Action Dock */
    #bottom-dock {
      width: 100%;
      background: #0b0d12;
      border-top: 3px solid #f8fafc;
      padding: 4px 6px;
      display: flex;
      flex-wrap: wrap;
      align-items: center;
      justify-content: center;
      gap: 4px;
      flex-shrink: 0;
      overflow-x: hidden;
    }

    #bottom-dock.collapsed {
      display: none !important;
    }

    .dock-btn {
      padding: 4px 7px;
      text-align: left;
      flex-shrink: 0;
      white-space: nowrap;
    }

    .dock-btn .top-row {
      display: flex;
      align-items: center;
      gap: 4px;
      font-size: 8px;
    }

    .dock-btn .sub-row {
      font-family: 'VT323', monospace;
      font-size: 14px;
      line-height: 1;
      margin-top: 2px;
      opacity: 0.9;
    }

    /* Overlay Screens */
    .modal-backdrop {
      position: fixed;
      inset: 0;
      background: rgba(9, 11, 16, 0.88);
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 16px;
      z-index: 50;
    }

    .modal-card {
      max-width: 600px;
      width: 100%;
      padding: 22px;
    }

    .hidden {
      display: none !important;
    }
  </style>
</head>
<body data-state="title">
  <div id="arcade-shell">
    <!-- External Top GBA Status HUD Bar -->
    <header id="top-hud" class="hidden">
      <div class="gba-frame stat-strip">
        <div class="stat-item">
          <span class="stat-label">COZY</span>
          <span id="hud-cozy" class="stat-val">82%</span>
        </div>
        <div class="divider"></div>
        <div class="stat-item">
          <span class="stat-label" style="color:#fb7185">♥</span>
          <span id="hud-hearts" class="stat-val" style="color:#fb7185">3</span>
        </div>
        <div class="divider"></div>
        <div class="stat-item">
          <span class="stat-label">SRV</span>
          <span id="hud-served" class="stat-val">0/6</span>
        </div>
        <div class="divider"></div>
        <div class="stat-item">
          <span class="stat-label" style="color:#facc15">$</span>
          <span id="hud-coins" class="stat-val" style="color:#facc15">25</span>
        </div>
      </div>

      <div id="order-banner" class="gba-dialogue-box">
        <div style="min-width:0">
          <div style="display:flex;align-items:center;gap:8px">
            <span id="hud-order-title" style="font-family:'Press Start 2P',monospace;font-size:8px">FLORA: '90S MIATA MOCHA</span>
            <span id="hud-step-badge" style="font-family:'Press Start 2P',monospace;font-size:8px;background:#0f172a;color:#facc15;padding:2px 5px">STEP 0/3</span>
          </div>
          <div id="hud-message" style="font-size:16px;color:#1e293b;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;margin-top:2px">
            Tap ⚡ Smart Step or [1] Grinder → [2] Espresso → [Space] Cup!
          </div>
        </div>
        <span style="font-family:'Press Start 2P',monospace;font-size:10px;color:#ef4444">▼</span>
      </div>

      <div class="gba-frame" style="padding:4px 6px;display:flex;flex-wrap:wrap;gap:5px;align-items:center;flex-shrink:0">
        <button id="btn-room" class="gba-btn" style="padding:4px 7px;font-size:8px;color:#7dd3fc">🚪 INSIDE</button>
        <button id="btn-time" class="gba-btn" style="padding:4px 7px;font-size:8px;color:#fde047">☀️ DAY</button>
        <button id="btn-weather" class="gba-btn" style="padding:4px 7px;font-size:8px;color:#86efac">⛅ CLEAR</button>
        <button id="btn-bgm" class="gba-btn" style="padding:4px 7px;font-size:8px">♪ BGM:OFF</button>
        <button id="btn-mute" class="gba-btn" style="padding:4px 7px;font-size:8px">🔊 SFX:ON</button>
        <button id="btn-dock" class="gba-btn" style="padding:4px 7px;font-size:8px;color:#facc15">▼ DOCK</button>
        <button id="btn-pause" class="gba-btn" style="padding:4px 7px;font-size:8px">II</button>
      </div>
    </header>

    <!-- Main GBA Pixel-Art Viewport Stage -->
    <div id="canvas-stage">
      <canvas id="game-canvas" width="900" height="480"></canvas>

      <!-- Floating Corner Quick-Actions -->
      <div id="floating-quickbar" class="hidden">
        <button id="q-smart" class="gba-btn gba-btn-active quick-btn">⚡ Step 1: Grind</button>
        <button id="q-water" class="gba-btn quick-btn" style="color:#7dd3fc">💧 Water (3)</button>
        <button id="q-cat" class="gba-btn quick-btn" style="color:#fb7185">🐾 Pet Cat</button>
        <button id="q-room" class="gba-btn quick-btn" style="color:#facc15">🚪 Room: INSIDE</button>
      </div>
    </div>

    <!-- Collapsible Bottom GBA Action Dock -->
    <footer id="bottom-dock" class="hidden">
      <button class="gba-btn dock-btn" data-station="grinder">
        <div class="top-row"><span class="gba-keycap">1</span><span>Grinder</span></div>
        <div class="sub-row">Step 1 · Coffee</div>
      </button>
      <button class="gba-btn dock-btn" data-station="espresso">
        <div class="top-row"><span class="gba-keycap">2</span><span>Espresso</span></div>
        <div class="sub-row">Step 2 · Mocha</div>
      </button>
      <button class="gba-btn dock-btn" data-station="milk_frother">
        <div class="top-row"><span class="gba-keycap">3</span><span>Frother</span></div>
        <div class="sub-row">Step 2 · Foam</div>
      </button>
      <button class="gba-btn dock-btn" data-station="kettle">
        <div class="top-row"><span class="gba-keycap">4</span><span>Kettle</span></div>
        <div class="sub-row">Step 1 · Water</div>
      </button>
      <button class="gba-btn dock-btn" data-station="tea_leaves">
        <div class="top-row"><span class="gba-keycap">5</span><span>Tea Leaves</span></div>
        <div class="sub-row">Step 2 · Tea</div>
      </button>
      <button class="gba-btn dock-btn" data-station="cup_counter">
        <div class="top-row"><span class="gba-keycap">Space</span><span>Pour Cup</span></div>
        <div class="sub-row">Step 3 · Cup</div>
      </button>
      <button id="dock-serve" class="gba-btn dock-btn">
        <div class="top-row"><span class="gba-keycap">Enter</span><span id="serve-title">Serve Drink</span></div>
        <div class="sub-row" id="serve-sub">Needs Step 3 Cup</div>
      </button>
      <button id="dock-water" class="gba-btn dock-btn">
        <div class="top-row"><span class="gba-keycap">W</span><span>Water Daisies</span></div>
        <div class="sub-row" id="water-sub" style="color:#7dd3fc">3 thirsty · +2c</div>
      </button>
      <button id="dock-miata" class="gba-btn dock-btn">
        <div class="top-row"><span class="gba-keycap">H</span><span>Miata Lights</span></div>
        <div class="sub-row" id="miata-sub" style="color:#facc15">Pop-Ups: ON ★</div>
      </button>
      <button id="dock-cats" class="gba-btn dock-btn">
        <div class="top-row"><span class="gba-keycap">C</span><span>Pet Cats</span></div>
        <div class="sub-row" style="color:#fb7185">Lilo &amp; Champy ♥</div>
      </button>
    </footer>
  </div>

  <!-- Title Screen Modal -->
  <div id="title-modal" class="modal-backdrop">
    <div class="gba-frame modal-card">
      <div style="font-family:'Press Start 2P',monospace;font-size:9px;color:#facc15;margin-bottom:8px">
        GBA PIXEL EDITION · 2 MAPS + DAY/NIGHT + WEATHER
      </div>
      <h1 style="font-family:'Press Start 2P',monospace;font-size:24px;margin-bottom:12px">
        KLASIK — GARDEN GARAGE CAFE ★
      </h1>
      <div class="gba-dialogue-box" style="padding:12px;margin-bottom:16px;font-size:19px;line-height:1.3">
        Explore two full-screen 900x480 GBA maps: brew inside the <strong>Monochrome Coffee Shop &amp; 1990 Mazda Miata MX-5 Showroom</strong> with <strong>Lilo</strong>, or step outside to the <strong>Backyard Daisy Garden</strong> with <strong>Champy</strong>, 6 Daisy beds, Day/Sunset/Night lighting <strong>[T]</strong>, and Rain weather <strong>[G]</strong>!
      </div>
      <button id="btn-start" class="gba-btn gba-btn-active" style="padding:12px 20px;font-size:12px">
        ► OPEN GARAGE DOORS [ENTER]
      </button>
    </div>
  </div>

  <!-- Pause / Shift Summary Modal -->
  <div id="pause-modal" class="modal-backdrop hidden">
    <div class="gba-frame modal-card">
      <h2 id="modal-heading" style="font-family:'Press Start 2P',monospace;font-size:18px;margin-bottom:14px">
        CAFE PAUSED
      </h2>
      <div class="gba-dialogue-box" style="padding:12px;margin-bottom:16px;font-size:20px">
        <p id="modal-stats">Cozy Rating: 85% · Hearts: 5 · Coins: $45</p>
      </div>
      <div style="display:flex;gap:10px">
        <button id="btn-resume" class="gba-btn gba-btn-active" style="padding:10px 16px;font-size:10px">► RESUME</button>
        <button id="btn-restart" class="gba-btn" style="padding:10px 16px;font-size:10px">↻ NEW SHIFT</button>
      </div>
    </div>
  </div>

  <script>
    const RECIPES = {
      midnight_cold_brew: { name: 'Midnight Cold Brew', shortName: 'Cold Brew', price: 14, color: '#0f172a', accent: '#38bdf8', steps: ['grinder', 'kettle', 'cup_counter'] },
      daisy_vanilla_latte: { name: 'Daisy Vanilla Latte', shortName: 'Daisy Latte', price: 16, color: '#fef08a', accent: '#f59e0b', steps: ['grinder', 'milk_frother', 'cup_counter'] },
      miata_mocha: { name: "'90s Miata Mocha", shortName: 'Miata Mocha', price: 18, color: '#dc2626', accent: '#f8fafc', steps: ['grinder', 'espresso', 'cup_counter'] },
      catnip_herbal_tea: { name: 'Lilo & Champy Tea', shortName: 'Catnip Tea', price: 15, color: '#16a34a', accent: '#86efac', steps: ['kettle', 'tea_leaves', 'cup_counter'] }
    };

    const STATIONS = [
      { id: 'grinder', shortLabel: 'Grinder', x: 112, y: 138, width: 64, height: 46, dur: 0.6, key: '1' },
      { id: 'espresso', shortLabel: 'Espresso', x: 190, y: 138, width: 68, height: 46, dur: 0.6, key: '2' },
      { id: 'milk_frother', shortLabel: 'Frother', x: 268, y: 138, width: 64, height: 46, dur: 0.6, key: '3' },
      { id: 'kettle', shortLabel: 'Kettle', x: 346, y: 138, width: 64, height: 46, dur: 0.6, key: '4' },
      { id: 'tea_leaves', shortLabel: 'Tea Leaves', x: 424, y: 138, width: 64, height: 46, dur: 0.6, key: '5' },
      { id: 'trash', shortLabel: 'Clear', x: 498, y: 138, width: 54, height: 46, dur: 0, key: 'X' },
      { id: 'watering_can', shortLabel: 'Well', x: 450, y: 254, width: 72, height: 54, dur: 0, key: 'W' },
      { id: 'cup_counter', shortLabel: 'Serve Cup', x: 356, y: 238, width: 112, height: 44, dur: 0.35, key: 'Space' }
    ];

    const INDOOR_TABLES = [{ x: 132, y: 358 }, { x: 264, y: 382 }, { x: 492, y: 358 }];
    const GARDEN_TABLES = [{ x: 268, y: 214 }, { x: 632, y: 214 }, { x: 268, y: 352 }, { x: 632, y: 352 }];
    const MIATA_BOUNDS = { x: 748, y: 248, width: 118, height: 180 };
    const INSIDE_DOOR = { x: 356, y: 446, width: 120, height: 34 };
    const GARDEN_DOOR = { x: 450, y: 102, width: 120, height: 34 };
    const ORDER_WIN = { x: 260, y: 82, width: 156, height: 48 };

    let audioCtx = null;
    let sfxMuted = false;
    let bgmEnabled = false;
    let bgmStep = 0;
    let bgmTimer = 0;
    const BGM_NOTES = [261.63, 329.63, 392.0, 493.88, 392.0, 329.63, 293.66, 392.0, 220.0, 261.63, 329.63, 392.0, 329.63, 261.63, 246.94, 329.63];

    function getAudio() {
      if (!audioCtx) {
        const Ctx = window.AudioContext || window.webkitAudioContext;
        if (Ctx) audioCtx = new Ctx();
      }
      if (audioCtx && audioCtx.state === 'suspended') audioCtx.resume();
      return audioCtx;
    }

    function playTone(freq, dur, type = 'square', gainVal = 0.05) {
      if (sfxMuted) return;
      const ctx = getAudio();
      if (!ctx) return;
      const osc = ctx.createOscillator();
      const g = ctx.createGain();
      osc.type = type;
      osc.frequency.setValueAtTime(freq, ctx.currentTime);
      g.gain.setValueAtTime(gainVal, ctx.currentTime);
      g.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + dur);
      osc.connect(g);
      g.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + dur);
    }

    const state = {
      mode: 'title',
      room: 'inside',
      timeOfDay: 'day',
      weather: 'clear',
      dockCollapsed: false,
      cozyRating: 84,
      hearts: 3,
      coins: 25,
      servedCount: 0,
      dailyTarget: 6,
      miataHeadlightsOn: true,
      catPetBonus: 0,
      prep: { activeDrink: null, step: 0, procStation: null, timer: 0, dur: 0 },
      barista: { x: 296, y: 192, tx: 296, ty: 192, boost: 0 },
      daisies: [
        { id: 'd1', name: 'Northwest Veranda Bed', x: 110, y: 176, hydration: 42, needsWater: true },
        { id: 'd2', name: 'Northeast Trellis Bed', x: 790, y: 176, hydration: 86, needsWater: false },
        { id: 'd3', name: 'West Lawn Planter', x: 110, y: 304, hydration: 38, needsWater: true },
        { id: 'd4', name: 'East Lawn Planter', x: 790, y: 304, hydration: 82, needsWater: false },
        { id: 'd5', name: 'Southwest Gate Bed', x: 204, y: 424, hydration: 44, needsWater: true },
        { id: 'd6', name: 'Southeast Gate Bed', x: 696, y: 424, hydration: 90, needsWater: false }
      ],
      cats: [
        { id: 'lilo', name: 'Lilo', room: 'inside', coat: 'white', eye: '#38bdf8', collar: '#2563eb', x: 748, y: 274, tx: 748, ty: 274, state: 'napping', timer: 5 },
        { id: 'champy', name: 'Champy', room: 'garden', coat: 'black', eye: '#22c55e', collar: '#14b8a6', x: 310, y: 332, tx: 590, ty: 332, state: 'walking', timer: 4 }
      ],
      customer: { name: 'Flora', order: 'miata_mocha', x: 356, y: 312 },
      popups: [],
      particles: [],
      lastMessage: "Flora ordered a '90s Miata Mocha! Tap ⚡ Smart Step or [1] -> [2] -> [Space]."
    };

    function spawnPopup(text, x, y, color = '#facc15', room = state.room) {
      state.popups.push({ text, x, y, life: 1.3, maxLife: 1.3, color, room });
    }

    function recalcCozy() {
      const avg = state.daisies.reduce((s, d) => s + d.hydration, 0) / state.daisies.length;
      const hydrated = state.daisies.filter(d => !d.needsWater).length;
      const rainBonus = state.weather === 'rain' ? 8 : state.weather === 'breeze' ? 3 : 0;
      state.cozyRating = Math.min(100, Math.round(avg * 0.5 + (hydrated / state.daisies.length) * 30 + Math.min(15, state.hearts * 1.5) + state.catPetBonus + rainBonus));
    }

    function getRecommendedStation() {
      if (state.prep.step >= 3) return null;
      const drinkKey = state.prep.activeDrink || state.customer.order;
      return RECIPES[drinkKey].steps[state.prep.step];
    }

    function syncHud() {
      document.getElementById('hud-cozy').textContent = state.cozyRating + '%';
      document.getElementById('hud-hearts').textContent = state.hearts;
      document.getElementById('hud-served').textContent = state.servedCount + '/' + state.dailyTarget;
      document.getElementById('hud-coins').textContent = state.coins;
      const rec = RECIPES[state.customer.order];
      document.getElementById('hud-order-title').textContent = state.customer.name.toUpperCase() + ': ' + rec.name.toUpperCase();
      document.getElementById('hud-step-badge').textContent = 'STEP ' + state.prep.step + '/3';
      document.getElementById('hud-message').textContent = state.lastMessage;
      document.getElementById('miata-sub').textContent = state.miataHeadlightsOn ? 'Pop-Ups: ON ★' : 'Pop-Ups: OFF';

      const thirsty = state.daisies.filter(d => d.needsWater).length;
      document.getElementById('water-sub').textContent = state.weather === 'rain' ? '🌧️ Rain Hydrating!' : (thirsty > 0 ? thirsty + ' thirsty · +2c' : '6 Beds Hydrated');
      document.getElementById('q-water').textContent = '💧 Water' + (thirsty > 0 ? ' (' + thirsty + ')' : '');

      const roomLbl = state.room === 'inside' ? 'INSIDE' : 'GARDEN';
      document.getElementById('btn-room').textContent = '🚪 ' + roomLbl;
      document.getElementById('q-room').textContent = '🚪 Room: ' + roomLbl;

      const timeMap = { day: '☀️ DAY', sunset: '🌅 SUNSET', night: '🌙 NIGHT' };
      document.getElementById('btn-time').textContent = timeMap[state.timeOfDay];

      const weatherMap = { clear: '⛅ CLEAR', breeze: '🍃 BREEZE', rain: '🌧️ RAIN' };
      document.getElementById('btn-weather').textContent = weatherMap[state.weather];

      const nextSt = getRecommendedStation();
      document.querySelectorAll('[data-station]').forEach(btn => {
        btn.classList.toggle('gba-btn-active', btn.dataset.station === nextSt);
      });

      const qSmart = document.getElementById('q-smart');
      if (state.prep.step === 3) {
        qSmart.textContent = '⚡ Serve Guest!';
        document.getElementById('dock-serve').classList.add('gba-btn-active');
      } else {
        const nextStObj = STATIONS.find(s => s.id === nextSt);
        qSmart.textContent = nextStObj ? '⚡ Step ' + (state.prep.step + 1) + ': ' + nextStObj.shortLabel : '⚡ Smart Step';
        document.getElementById('dock-serve').classList.remove('gba-btn-active');
      }
    }

    function triggerStation(id) {
      if (state.mode !== 'playing') return;
      state.room = 'inside';
      const stObj = STATIONS.find(s => s.id === id);
      if (stObj) { state.barista.tx = stObj.x; state.barista.ty = 192; }

      if (state.prep.procStation && state.prep.timer > 0) {
        state.prep.procStation = null;
        state.prep.timer = 0;
        state.prep.step = Math.min(3, state.prep.step + 1);
      }

      if (id === 'trash') {
        state.prep.activeDrink = null; state.prep.step = 0;
        state.lastMessage = 'Cleared prep bar.';
        syncHud(); return;
      }

      const targetOrder = state.customer.order;
      const rec = RECIPES[targetOrder];
      const expected = rec.steps[state.prep.step];

      if (id === expected) {
        state.prep.activeDrink = targetOrder;
        state.prep.procStation = id;
        state.prep.dur = stObj.dur;
        state.prep.timer = stObj.dur;
        playTone(440, 0.09);
        state.lastMessage = 'Working on ' + rec.name + ' at ' + stObj.shortLabel + '...';
      } else {
        const expObj = STATIONS.find(s => s.id === expected);
        state.lastMessage = 'For ' + rec.name + ', click ' + (expObj ? expObj.shortLabel : 'next station') + '!';
      }
      syncHud();
    }

    function serveCustomer() {
      state.room = 'inside';
      if (state.prep.step < 3) {
        state.lastMessage = 'Finish Step 3 at Pour Cup [Space] first!';
        syncHud(); return;
      }
      const rec = RECIPES[state.customer.order];
      state.coins += rec.price + 4;
      state.hearts += 2;
      state.servedCount += 1;
      state.prep.activeDrink = null;
      state.prep.step = 0;
      recalcCozy();
      playTone(587.33, 0.12);
      setTimeout(() => playTone(880, 0.18), 90);
      spawnPopup('+' + (rec.price + 4) + 'c ♥+2', state.customer.x, state.customer.y - 28, '#facc15', 'inside');

      const keys = Object.keys(RECIPES);
      const names = ['Flora', 'Takumi', 'Milo', 'Keisuke', 'Clara', 'Suki'];
      state.customer.name = names[state.servedCount % names.length];
      state.customer.order = keys[state.servedCount % keys.length];
      state.lastMessage = 'Served! Next: ' + state.customer.name + ' ordered ' + RECIPES[state.customer.order].name + '!';
      syncHud();
    }

    function executeSmartStep() {
      state.room = 'inside';
      if (state.prep.procStation && state.prep.timer > 0) {
        state.prep.procStation = null;
        state.prep.timer = 0;
        state.prep.step = Math.min(3, state.prep.step + 1);
      }
      if (state.prep.step === 3) {
        serveCustomer();
      } else {
        const nextSt = getRecommendedStation();
        if (nextSt) triggerStation(nextSt);
      }
    }

    function waterDaisy(d) {
      state.room = 'garden';
      state.barista.tx = d.x; state.barista.ty = d.y;
      d.hydration = 100; d.needsWater = false;
      state.coins += 2;
      recalcCozy();
      playTone(523.25, 0.08, 'sine');
      spawnPopup('+💧 COZY! +2c', d.x, d.y - 22, '#38bdf8', 'garden');
      state.lastMessage = 'Watered ' + d.name + ' in the Backyard Garden! +2 Coins & Cozy Rating ' + state.cozyRating + '%.';
      syncHud();
    }

    function petCats() {
      const cat = state.cats.find(c => c.room === state.room) || state.cats[0];
      cat.state = 'purring'; cat.timer = 3.5;
      state.hearts += 1;
      state.catPetBonus = Math.min(15, state.catPetBonus + 5);
      recalcCozy();
      playTone(340, 0.14, 'triangle');
      spawnPopup('♥ ' + cat.name.toUpperCase() + ' ♪', cat.x, cat.y - 20, '#fb7185', cat.room);
      state.lastMessage = 'Petted ' + cat.name + '! Purrrr~ ♥♪ Cozy Rating ' + state.cozyRating + '%!';
      syncHud();
    }

    function toggleRoom() {
      state.room = state.room === 'inside' ? 'garden' : 'inside';
      state.lastMessage = state.room === 'inside'
        ? 'Entered the Monochrome Coffee Shop & 1990 Miata Garage Showroom!'
        : 'Stepped out to the Backyard Daisy Garden!';
      playTone(360, 0.05);
      syncHud();
    }

    function cycleTime() {
      const order = ['day', 'sunset', 'night'];
      state.timeOfDay = order[(order.indexOf(state.timeOfDay) + 1) % order.length];
      playTone(420, 0.05);
      syncHud();
    }

    function cycleWeather() {
      const order = ['clear', 'breeze', 'rain'];
      state.weather = order[(order.indexOf(state.weather) + 1) % order.length];
      recalcCozy();
      playTone(480, 0.05);
      syncHud();
    }

    document.getElementById('btn-start').onclick = () => {
      state.mode = 'playing';
      document.body.dataset.state = 'playing';
      document.getElementById('title-modal').classList.add('hidden');
      document.getElementById('top-hud').classList.remove('hidden');
      document.getElementById('floating-quickbar').classList.remove('hidden');
      document.getElementById('bottom-dock').classList.remove('hidden');
      playTone(587.33, 0.1);
      syncHud();
    };

    document.getElementById('btn-room').onclick = toggleRoom;
    document.getElementById('q-room').onclick = toggleRoom;
    document.getElementById('btn-time').onclick = cycleTime;
    document.getElementById('btn-weather').onclick = cycleWeather;

    document.getElementById('btn-bgm').onclick = () => {
      bgmEnabled = !bgmEnabled;
      document.getElementById('btn-bgm').textContent = bgmEnabled ? '♪ BGM:ON' : '♪ BGM:OFF';
    };

    document.getElementById('btn-mute').onclick = () => {
      sfxMuted = !sfxMuted;
      document.getElementById('btn-mute').textContent = sfxMuted ? '🔊 SFX:OFF' : '🔊 SFX:ON';
    };

    document.getElementById('btn-dock').onclick = () => {
      state.dockCollapsed = !state.dockCollapsed;
      document.getElementById('bottom-dock').classList.toggle('collapsed', state.dockCollapsed);
      document.getElementById('btn-dock').textContent = state.dockCollapsed ? '▲ DOCK' : '▼ DOCK';
    };

    document.getElementById('btn-pause').onclick = () => {
      state.mode = 'paused';
      document.getElementById('modal-stats').textContent =
        'Cozy Rating: ' + state.cozyRating + '% · Hearts: ' + state.hearts + ' · Coins: $' + state.coins;
      document.getElementById('pause-modal').classList.remove('hidden');
    };

    document.getElementById('btn-resume').onclick = () => {
      state.mode = 'playing';
      document.getElementById('pause-modal').classList.add('hidden');
    };

    document.getElementById('btn-restart').onclick = () => location.reload();

    document.querySelectorAll('[data-station]').forEach(btn => {
      btn.onclick = () => triggerStation(btn.dataset.station);
    });
    document.getElementById('dock-serve').onclick = serveCustomer;
    document.getElementById('dock-water').onclick = () => {
      const sorted = [...state.daisies].sort((a, b) => a.hydration - b.hydration);
      waterDaisy(sorted[0]);
    };
    document.getElementById('dock-miata').onclick = () => {
      state.room = 'inside';
      state.miataHeadlightsOn = !state.miataHeadlightsOn;
      playTone(state.miataHeadlightsOn ? 520 : 320, 0.08);
      spawnPopup(state.miataHeadlightsOn ? 'HEADLIGHTS UP! ★' : 'HEADLIGHTS DOWN', MIATA_BOUNDS.x, MIATA_BOUNDS.y - 36, '#facc15', 'inside');
      syncHud();
    };
    document.getElementById('dock-cats').onclick = petCats;
    document.getElementById('q-smart').onclick = executeSmartStep;
    document.getElementById('q-water').onclick = () => document.getElementById('dock-water').click();
    document.getElementById('q-cat').onclick = petCats;

    window.addEventListener('keydown', e => {
      if (state.mode === 'title' && (e.key === 'Enter' || e.key === ' ')) {
        document.getElementById('btn-start').click(); return;
      }
      if (state.mode !== 'playing') return;
      const k = e.key.toLowerCase();
      if (k === '1') triggerStation('grinder');
      else if (k === '2') triggerStation('espresso');
      else if (k === '3') triggerStation('milk_frother');
      else if (k === '4') triggerStation('kettle');
      else if (k === '5') triggerStation('tea_leaves');
      else if (k === 'e') executeSmartStep();
      else if (k === ' ') { e.preventDefault(); state.prep.step === 3 ? serveCustomer() : triggerStation('cup_counter'); }
      else if (k === 'enter') { e.preventDefault(); serveCustomer(); }
      else if (k === 'w') document.getElementById('dock-water').click();
      else if (k === 'h') document.getElementById('dock-miata').click();
      else if (k === 'c') petCats();
      else if (k === 'v') toggleRoom();
      else if (k === 't') cycleTime();
      else if (k === 'g') cycleWeather();
      else if (k === 'b') document.getElementById('btn-bgm').click();
    });

    const canvas = document.getElementById('game-canvas');
    const ctx = canvas.getContext('2d');

    canvas.addEventListener('pointerdown', e => {
      if (state.mode !== 'playing') return;
      const rect = canvas.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width) * 900;
      const y = ((e.clientY - rect.top) / rect.height) * 480;

      for (const cat of state.cats) {
        if (cat.room === state.room && Math.abs(x - cat.x) <= 28 && Math.abs(y - cat.y) <= 24) {
          petCats(); return;
        }
      }

      if (state.room === 'inside') {
        if (Math.abs(x - INSIDE_DOOR.x) <= 64 && Math.abs(y - INSIDE_DOOR.y) <= 20) { toggleRoom(); return; }
        if (Math.abs(x - MIATA_BOUNDS.x) <= 60 && Math.abs(y - MIATA_BOUNDS.y) <= 90) { document.getElementById('dock-miata').click(); return; }
        if (x >= state.customer.x - 32 && x <= state.customer.x + 220 && y >= state.customer.y - 44 && y <= state.customer.y + 36) { executeSmartStep(); return; }
        for (const s of STATIONS) {
          if (s.id !== 'watering_can' && Math.abs(x - s.x) <= s.width / 2 + 6 && Math.abs(y - s.y) <= s.height / 2 + 6) {
            triggerStation(s.id); return;
          }
        }
      } else {
        if (Math.abs(x - GARDEN_DOOR.x) <= 64 && Math.abs(y - GARDEN_DOOR.y) <= 20) { toggleRoom(); return; }
        if (Math.abs(x - ORDER_WIN.x) <= 80 && Math.abs(y - ORDER_WIN.y) <= 26) { executeSmartStep(); return; }
        for (const d of state.daisies) {
          if (Math.abs(x - d.x) <= 54 && Math.abs(y - d.y) <= 34) { waterDaisy(d); return; }
        }
      }
      state.barista.tx = Math.max(70, Math.min(830, x));
      state.barista.ty = Math.max(140, Math.min(430, y));
    });

    function drawBox(x, y, w, h, fill, border = '#090b0e') {
      ctx.fillStyle = fill;
      ctx.fillRect(Math.round(x), Math.round(y), Math.round(w), Math.round(h));
      ctx.strokeStyle = border;
      ctx.lineWidth = 2;
      ctx.strokeRect(Math.round(x) + 1, Math.round(y) + 1, Math.round(w) - 2, Math.round(h) - 2);
    }

    let last = performance.now();
    function loop(now) {
      const dt = Math.min(0.05, (now - last) / 1000);
      last = now;
      const t = now / 1000;

      if (bgmEnabled && !sfxMuted) {
        bgmTimer += dt;
        if (bgmTimer >= 0.2) {
          bgmTimer -= 0.2;
          playTone(BGM_NOTES[bgmStep % BGM_NOTES.length], 0.16, 'square', 0.02);
          bgmStep++;
        }
      }

      if (state.mode === 'playing') {
        state.barista.x += (state.barista.tx - state.barista.x) * Math.min(1, dt * 8);
        state.barista.y += (state.barista.ty - state.barista.y) * Math.min(1, dt * 8);

        if (state.prep.procStation) {
          state.prep.timer -= dt;
          if (state.prep.timer <= 0) {
            state.prep.procStation = null;
            state.prep.step = Math.min(3, state.prep.step + 1);
            playTone(659.25, 0.1);
            syncHud();
          }
        }

        state.daisies.forEach(d => {
          if (state.weather === 'rain') {
            d.hydration = Math.min(100, d.hydration + 4.0 * dt);
          } else {
            d.hydration = Math.max(15, d.hydration - 1.15 * dt);
          }
          d.needsWater = d.hydration <= 55;
        });

        for (let i = state.popups.length - 1; i >= 0; i--) {
          state.popups[i].life -= dt;
          state.popups[i].y -= 22 * dt;
          if (state.popups[i].life <= 0) state.popups.splice(i, 1);
        }
      }

      ctx.fillStyle = '#0b0d12';
      ctx.fillRect(0, 0, 900, 480);

      if (state.room === 'inside') {
        drawBox(16, 14, 868, 452, '#0f172a', '#f8fafc');
        for (let r = 0; r < 14; r++) {
          for (let c = 0; c < 20; c++) {
            const tx = 26 + c * 28, ty = 84 + r * 28;
            if (tx < 584 && ty < 456) {
              ctx.fillStyle = (r + c) % 2 === 0 ? '#262e3d' : '#1b2230';
              ctx.fillRect(tx, ty, 28, 28);
            }
          }
        }
        drawBox(24, 20, 558, 64, '#111622');
        const sky = state.timeOfDay === 'day' ? '#38bdf8' : state.timeOfDay === 'sunset' ? '#f97316' : '#0f172a';
        drawBox(44, 26, 184, 50, sky, '#f8fafc');
        drawBox(244, 28, 154, 44, '#1e293b', '#f8fafc');
        drawBox(410, 28, 158, 44, '#1e293b', '#f8fafc');
        drawBox(68, 116, 472, 46, '#0f172a');
        drawBox(68, 218, 360, 38, '#0f172a');
        drawBox(84, 210, 58, 34, '#1e293b', '#94a3b8'); // POS Register
        drawBox(162, 210, 112, 36, '#38bdf8', '#bae6fd'); // Glass Pastry Case

        const nextSt = state.prep.procStation === null ? getRecommendedStation() : null;
        STATIONS.filter(s => s.id !== 'watering_can').forEach(s => {
          const isNext = s.id === nextSt;
          drawBox(s.x - s.width / 2, s.y - s.height / 2, s.width, s.height, '#1e293b', isNext ? '#facc15' : '#090b0e');
          ctx.fillStyle = '#090b0e';
          ctx.fillRect(s.x - 28, s.y + 16, 56, 11);
          ctx.fillStyle = isNext ? '#facc15' : '#f8fafc';
          ctx.font = 'bold 6px "Press Start 2P"';
          ctx.textAlign = 'center';
          ctx.fillText('[' + s.key + '] ' + s.shortLabel.toUpperCase(), s.x, s.y + 24);
        });

        INDOOR_TABLES.forEach(tb => drawBox(tb.x - 24, tb.y - 18, 48, 28, '#f8fafc'));
        drawBox(INSIDE_DOOR.x - 60, INSIDE_DOOR.y - 17, 120, 34, '#14532d', '#facc15');
        ctx.fillStyle = '#fef08a';
        ctx.fillText('▼ TO GARDEN [V]', INSIDE_DOOR.x, INSIDE_DOOR.y + 4);

        // Right-Wing 1990 Miata Garage Showroom
        drawBox(588, 20, 288, 436, '#18181b');
        for (let r = 0; r < 12; r++) {
          for (let c = 0; c < 9; c++) {
            ctx.fillStyle = (r + c) % 2 === 0 ? '#e2e8f0' : '#1e232d';
            ctx.fillRect(606 + c * 28, 88 + r * 28, 28, 28);
          }
        }
        drawBox(MIATA_BOUNDS.x - 46, MIATA_BOUNDS.y - 78, 92, 156, '#f8fafc');
        drawBox(MIATA_BOUNDS.x - 34, MIATA_BOUNDS.y - 46, 68, 48, '#0f172a');
        if (state.miataHeadlightsOn) {
          ctx.fillStyle = '#fef08a';
          ctx.fillRect(MIATA_BOUNDS.x - 32, MIATA_BOUNDS.y + 58, 16, 8);
          ctx.fillRect(MIATA_BOUNDS.x + 16, MIATA_BOUNDS.y + 58, 16, 8);
        }

        // Waiting Customer
        drawBox(state.customer.x - 14, state.customer.y - 18, 28, 34, '#fb7185');
        drawBox(state.customer.x + 24, state.customer.y - 28, 185, 44, '#f8fafc');
        ctx.fillStyle = '#090b0e';
        ctx.font = 'bold 8px "Press Start 2P"';
        ctx.textAlign = 'left';
        ctx.fillText(RECIPES[state.customer.order].shortName.toUpperCase(), state.customer.x + 34, state.customer.y - 10);
      } else {
        // GARDEN ROOM
        for (let r = 0; r < 15; r++) {
          for (let c = 0; c < 29; c++) {
            ctx.fillStyle = (r + c) % 2 === 0 ? '#22c55e' : '#16a34a';
            ctx.fillRect(c * 32, r * 32, 32, 32);
          }
        }
        drawBox(40, 14, 820, 98, '#0f172a');
        drawBox(ORDER_WIN.x - 78, ORDER_WIN.y - 24, 156, 48, '#f8fafc', '#facc15');
        ctx.fillStyle = '#090b0e';
        ctx.font = 'bold 6px "Press Start 2P"';
        ctx.textAlign = 'center';
        ctx.fillText(state.customer.name.toUpperCase() + ': ' + RECIPES[state.customer.order].shortName.toUpperCase(), ORDER_WIN.x, ORDER_WIN.y);
        drawBox(GARDEN_DOOR.x - 60, GARDEN_DOOR.y - 17, 120, 34, '#18181b', '#facc15');
        ctx.fillStyle = '#fef08a';
        ctx.fillText('▲ TO CAFE [V]', GARDEN_DOOR.x, GARDEN_DOOR.y + 4);
        drawBox(416, 232, 68, 46, '#0284c7'); // Center Watering Well
        GARDEN_TABLES.forEach(tb => drawBox(tb.x - 26, tb.y - 18, 52, 30, '#f8fafc'));
        state.daisies.forEach(d => {
          drawBox(d.x - 52, d.y - 31, 104, 62, '#1e293b');
          ctx.fillStyle = d.needsWater ? '#4d7c0f' : '#22c55e';
          ctx.fillRect(d.x - 38, d.y - 19, 76, 36);
        });
      }

      // Barista & Room Cat
      drawBox(state.barista.x - 14, state.barista.y - 18, 28, 34, '#38bdf8');
      state.cats.filter(c => c.room === state.room).forEach(cat => {
        drawBox(cat.x - 12, cat.y - 10, 24, 18, cat.coat === 'white' ? '#ffffff' : '#18181b');
      });

      // Ambient Time Overlay
      if (state.timeOfDay !== 'day') {
        ctx.fillStyle = state.timeOfDay === 'night' ? 'rgba(10, 15, 34, 0.42)' : 'rgba(234, 88, 12, 0.16)';
        ctx.fillRect(0, 0, 900, 480);
      }

      requestAnimationFrame(loop);
    }
    requestAnimationFrame(loop);
  </script>
</body>
</html>`;
