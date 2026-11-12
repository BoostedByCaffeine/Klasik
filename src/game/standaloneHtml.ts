/**
 * Complete, self-contained single-file HTML5 + CSS + JavaScript source code for
 * "Klasik - Garden Garage Cafe" (Mobile-Responsive, Architectural & QoL Overhaul Edition).
 */
export const STANDALONE_KLASIK_HTML = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />
  <title>Klasik — Garden Garage Cafe (GBA Edition)</title>
  <link rel="preconnect" href="https://fonts.googleapis.com" />
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
  <link href="https://fonts.googleapis.com/css2?family=Press+Start+2P&family=VT323&display=swap" rel="stylesheet" />
  <style>
    /* ==========================================================================
       KLASIK: GARDEN GARAGE CAFE — 100DVH MOBILE-RESPONSIVE GBA ARCADE FRAME
       ========================================================================== */
    * { box-sizing: border-box; margin: 0; padding: 0; user-select: none; -webkit-tap-highlight-color: transparent; }
    html, body {
      background: #0b0d12;
      color: #f8fafc;
      font-family: 'VT323', monospace;
      width: 100vw;
      height: 100dvh;
      overflow: hidden;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      image-rendering: pixelated;
    }
    .gba-top-bar {
      background: #0b0d12;
      border-bottom: 3px solid #f8fafc;
      padding: 6px 10px;
      display: flex;
      flex-wrap: nowrap;
      align-items: center;
      justify-content: space-between;
      gap: 8px;
      flex-shrink: 0;
      overflow-x: auto;
    }
    .gba-top-bar::-webkit-scrollbar { display: none; }
    .gba-frame {
      background: #161920;
      border: 2px solid #f8fafc;
      box-shadow: inset 0 0 0 2px #333947, 0 3px 0 #050608;
      padding: 4px 10px;
      display: flex;
      align-items: center;
      gap: 10px;
      flex-shrink: 0;
    }
    .stat-pill {
      display: flex;
      align-items: center;
      gap: 5px;
      font-family: 'Press Start 2P', monospace;
      font-size: 10px;
      white-space: nowrap;
    }
    .stat-kicker { font-size: 8px; color: #94a3b8; }
    .sep { width: 2px; height: 16px; background: #334155; }

    .gba-dialogue {
      background: #f8fafc;
      color: #090b0e;
      border: 2px solid #090b0e;
      box-shadow: inset 0 0 0 2px #cbd5e1, 0 3px 0 #050608;
      padding: 4px 10px;
      flex: 1;
      min-width: 200px;
      max-width: 520px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 8px;
      overflow: hidden;
    }
    @media (max-width: 860px) {
      .gba-dialogue { display: none; }
    }
    .dialogue-title {
      font-family: 'Press Start 2P', monospace;
      font-size: 8px;
      color: #0f172a;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }
    .dialogue-text {
      font-family: 'VT323', monospace;
      font-size: 17px;
      line-height: 1.05;
      color: #1e293b;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }
    .arrow-bounce {
      font-family: 'Press Start 2P', monospace;
      font-size: 10px;
      color: #ef4444;
      animation: bob 0.5s steps(2) infinite;
    }
    @keyframes bob { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(3px); } }

    .viewport-stage {
      position: relative;
      flex: 1;
      min-height: 0;
      width: 100%;
      display: flex;
      align-items: center;
      justify-content: center;
      background: #0b0d12;
      padding: 4px;
    }
    canvas {
      width: 100%;
      height: 100%;
      object-fit: contain;
      image-rendering: pixelated;
      cursor: pointer;
      border: 3px solid #334155;
    }
    .floating-quick-bar {
      position: absolute;
      bottom: 10px;
      right: 12px;
      display: flex;
      flex-wrap: wrap;
      justify-content: flex-end;
      gap: 6px;
      z-index: 10;
      pointer-events: auto;
    }
    .gba-bottom-dock {
      background: #0b0d12;
      border-top: 3px solid #f8fafc;
      padding: 6px 8px;
      display: flex;
      flex-wrap: wrap;
      align-items: center;
      justify-content: center;
      gap: 6px;
      flex-shrink: 0;
    }
    .gba-bottom-dock.collapsed { display: none; }
    .gba-btn {
      font-family: 'Press Start 2P', monospace;
      background: #1e232d;
      color: #f8fafc;
      border: 2px solid #e2e8f0;
      box-shadow: inset 0 -3px 0 #0f1218, 0 3px 0 #050608;
      padding: 5px 8px;
      font-size: 8px;
      cursor: pointer;
      display: flex;
      flex-direction: column;
      gap: 2px;
      text-align: left;
      white-space: nowrap;
    }
    .gba-btn:hover { background: #2d3544; }
    .gba-btn:active { transform: translateY(2px); }
    .gba-btn.active {
      background: #facc15;
      color: #090b0e;
      border-color: #ffffff;
      box-shadow: inset 0 -3px 0 #ca8a04, 0 3px 0 #050608;
    }
    .keycap {
      display: inline-block;
      background: #090b0e;
      color: #facc15;
      border: 1px solid #94a3b8;
      padding: 1px 4px;
      font-size: 7px;
      margin-right: 4px;
    }
    .btn-sub {
      font-family: 'VT323', monospace;
      font-size: 14px;
      opacity: 0.92;
    }
  </style>
</head>
<body>
  <!-- Compact Single-Row Top HUD Bar (Never wraps into multi-row blocks on mobile) -->
  <header class="gba-top-bar">
    <div class="gba-frame">
      <div class="stat-pill"><span class="stat-kicker">COZY</span><span id="hud-cozy">82%</span></div>
      <div class="sep"></div>
      <div class="stat-pill" style="color:#fb7185"><span>♥</span><span id="hud-hearts">3</span></div>
      <div class="sep"></div>
      <div class="stat-pill"><span class="stat-kicker">SRV</span><span id="hud-served">0/6</span></div>
      <div class="sep"></div>
      <div class="stat-pill" style="color:#facc15"><span>$</span><span id="hud-coins">25</span></div>
    </div>

    <div class="gba-dialogue">
      <div style="min-width:0">
        <div class="dialogue-title" id="hud-order-title">FLORA: '90S MIATA MOCHA (STEP 0/3)</div>
        <div class="dialogue-text" id="hud-msg">Tap ⚡ Smart Step or [1] Grinder → [2] Espresso → [Space] Pour Cup!</div>
      </div>
      <span class="arrow-bounce">▼</span>
    </div>

    <div class="gba-frame" style="gap:6px;padding:3px 6px;">
      <button class="gba-btn" id="btn-bgm" onclick="toggleBgm()">♪ BGM:OFF</button>
      <button class="gba-btn" id="btn-sfx" onclick="toggleSfx()">🔊 SFX:ON</button>
      <button class="gba-btn" id="btn-view-top" style="color:#7dd3fc" onclick="cycleViewMode()">🏠 ALL</button>
      <button class="gba-btn" id="btn-dock-toggle" style="color:#facc15" onclick="toggleDock()">▼ HIDE DOCK</button>
    </div>
  </header>

  <!-- Non-Overlapping Game Viewport + Floating Touch Quick-Actions -->
  <main class="viewport-stage">
    <canvas id="cafe-canvas" width="900" height="480"></canvas>
    <div class="floating-quick-bar">
      <button class="gba-btn active" id="btn-smart-step" onclick="executeSmartStep()">⚡ Smart Step</button>
      <button class="gba-btn" style="color:#7dd3fc" id="btn-quick-water" onclick="waterNextDaisy()">💧 Water</button>
      <button class="gba-btn" style="color:#fb7185" onclick="petCats()">🐾 Pet Cat</button>
      <button class="gba-btn" style="color:#facc15" id="btn-quick-view" onclick="cycleViewMode()">🏠 View Mode</button>
    </div>
  </main>

  <!-- Collapsible Bottom 10-Button Action Dock -->
  <footer class="gba-bottom-dock" id="bottom-dock">
    <button class="gba-btn" id="btn-grinder" onclick="interactStation('grinder')">
      <div><span class="keycap">1</span>Grinder</div>
      <div class="btn-sub">Step 1 · Coffee</div>
    </button>
    <button class="gba-btn" id="btn-espresso" onclick="interactStation('espresso')">
      <div><span class="keycap">2</span>Espresso</div>
      <div class="btn-sub">Step 2 · Mocha</div>
    </button>
    <button class="gba-btn" id="btn-milk_frother" onclick="interactStation('milk_frother')">
      <div><span class="keycap">3</span>Frother</div>
      <div class="btn-sub">Step 2 · Foam</div>
    </button>
    <button class="gba-btn" id="btn-kettle" onclick="interactStation('kettle')">
      <div><span class="keycap">4</span>Kettle</div>
      <div class="btn-sub">Step 1 · Water</div>
    </button>
    <button class="gba-btn" id="btn-tea_leaves" onclick="interactStation('tea_leaves')">
      <div><span class="keycap">5</span>Tea Leaves</div>
      <div class="btn-sub">Step 2 · Tea</div>
    </button>
    <button class="gba-btn" id="btn-cup_counter" onclick="interactStation('cup_counter')">
      <div><span class="keycap">Space</span>Pour Cup</div>
      <div class="btn-sub">Step 3 · Cup</div>
    </button>
    <button class="gba-btn" id="btn-serve" onclick="serveCustomer()">
      <div><span class="keycap">Enter</span>★ Serve</div>
      <div class="btn-sub">Hand to Guest</div>
    </button>
    <button class="gba-btn" onclick="waterNextDaisy()">
      <div><span class="keycap">W</span>Water Daisies</div>
      <div class="btn-sub" style="color:#7dd3fc">+2 Coins · Cozy</div>
    </button>
    <button class="gba-btn" onclick="toggleMiata()">
      <div><span class="keycap">H</span>Miata Lights</div>
      <div class="btn-sub" id="btn-miata-sub" style="color:#facc15">Pop-Ups: ON ★</div>
    </button>
    <button class="gba-btn" onclick="petCats()">
      <div><span class="keycap">C</span>Pet Cats</div>
      <div class="btn-sub" style="color:#fb7185">Lilo &amp; Champy ♥</div>
    </button>
  </footer>

  <script>
    /**
     * ========================================================================
     * 1. WEB AUDIO API 8-BIT MONO CHIPTUNE BGM SEQUENCER (76 BPM) & SFX
     * ========================================================================
     */
    const LEAD_MELODY = [
      523.25, 659.25, 783.99, 659.25, 880.0, 783.99, 659.25, 523.25,
      440.0, 523.25, 659.25, 880.0, 783.99, 659.25, 587.33, 0,
      349.23, 440.0, 523.25, 659.25, 587.33, 523.25, 440.0, 523.25,
      392.0, 493.88, 587.33, 659.25, 587.33, 493.88, 392.0, 0,
      523.25, 783.99, 1046.5, 783.99, 880.0, 783.99, 659.25, 523.25,
      440.0, 659.25, 880.0, 1046.5, 987.77, 880.0, 783.99, 0,
      698.46, 659.25, 587.33, 523.25, 659.25, 587.33, 523.25, 440.0,
      392.0, 523.25, 659.25, 587.33, 523.25, 0, 392.0, 0
    ];
    const BASS_LINE = [
      130.81, 0, 196.0, 0, 130.81, 0, 196.0, 0,
      110.0, 0, 164.81, 0, 110.0, 0, 164.81, 0,
      174.61, 0, 220.0, 0, 174.61, 0, 220.0, 0,
      196.0, 0, 246.94, 0, 196.0, 0, 146.83, 0,
      130.81, 0, 196.0, 0, 130.81, 0, 196.0, 0,
      110.0, 0, 164.81, 0, 110.0, 0, 164.81, 0,
      174.61, 0, 220.0, 0, 146.83, 0, 196.0, 0,
      130.81, 0, 196.0, 0, 130.81, 0, 130.81, 0
    ];

    let audioCtx = null;
    let monoMerger = null;
    let noiseBuf = null;
    let bgmOn = false;
    let sfxOn = true;
    let bgmTimer = null;
    let bgmStep = 0;

    function initAudio() {
      if (!audioCtx) {
        const AC = window.AudioContext || window.webkitAudioContext;
        if (!AC) return null;
        audioCtx = new AC();
        monoMerger = audioCtx.createChannelMerger(1);
        monoMerger.channelCount = 1;
        monoMerger.channelCountMode = 'explicit';
        monoMerger.connect(audioCtx.destination);

        const sr = audioCtx.sampleRate;
        noiseBuf = audioCtx.createBuffer(1, Math.floor(sr * 0.045), sr);
        const d = noiseBuf.getChannelData(0);
        for (let i = 0; i < d.length; i++) d[i] = Math.random() * 2 - 1;
      }
      if (audioCtx.state === 'suspended') audioCtx.resume().catch(() => {});
      return audioCtx;
    }

    function playBgmStep() {
      if (!bgmOn) return;
      const ac = initAudio();
      if (!ac) return;
      const now = ac.currentTime;
      const idx = bgmStep % LEAD_MELODY.length;
      bgmStep++;
      const lead = LEAD_MELODY[idx];
      const bass = BASS_LINE[idx];

      if (lead > 0) {
        const o = ac.createOscillator(), g = ac.createGain();
        o.type = 'square'; o.frequency.setValueAtTime(lead, now);
        g.gain.setValueAtTime(0.022, now); g.gain.exponentialRampToValueAtTime(0.001, now + 0.34);
        o.connect(g); g.connect(monoMerger); o.start(now); o.stop(now + 0.36);
      }
      if (bass > 0) {
        const o = ac.createOscillator(), g = ac.createGain();
        o.type = 'triangle'; o.frequency.setValueAtTime(bass, now);
        g.gain.setValueAtTime(0.035, now); g.gain.exponentialRampToValueAtTime(0.001, now + 0.36);
        o.connect(g); g.connect(monoMerger); o.start(now); o.stop(now + 0.38);
      }
      if (noiseBuf && idx % 2 === 1) {
        const n = ac.createBufferSource(), f = ac.createBiquadFilter(), g = ac.createGain();
        n.buffer = noiseBuf; f.type = 'highpass'; f.frequency.setValueAtTime(5200, now);
        g.gain.setValueAtTime(0.009, now); g.gain.exponentialRampToValueAtTime(0.0005, now + 0.04);
        n.connect(f); f.connect(g); g.connect(monoMerger); n.start(now); n.stop(now + 0.045);
      }
    }

    window.toggleBgm = function() {
      bgmOn = !bgmOn;
      if (bgmTimer) { clearInterval(bgmTimer); bgmTimer = null; }
      if (bgmOn) {
        playBgmStep();
        bgmTimer = setInterval(playBgmStep, Math.round((60 / 76 / 2) * 1000));
      }
      const btn = document.getElementById('btn-bgm');
      btn.textContent = '♪ BGM:' + (bgmOn ? 'ON' : 'OFF');
      btn.classList.toggle('active', bgmOn);
    };

    window.toggleSfx = function() {
      sfxOn = !sfxOn;
      document.getElementById('btn-sfx').textContent = '🔊 SFX:' + (sfxOn ? 'ON' : 'OFF');
    };

    function playTone(freq, type = 'square', dur = 0.12) {
      if (!sfxOn) return;
      const ac = initAudio();
      if (!ac) return;
      const now = ac.currentTime;
      const o = ac.createOscillator(), g = ac.createGain();
      o.type = type; o.frequency.setValueAtTime(freq, now);
      g.gain.setValueAtTime(0.05, now); g.gain.exponentialRampToValueAtTime(0.001, now + dur);
      o.connect(g); g.connect(monoMerger); o.start(now); o.stop(now + dur + 0.01);
    }

    /**
     * ========================================================================
     * 2. GBA PIXEL MATRIX ENGINE & ARCHITECTURAL ZONES
     * ========================================================================
     */
    const canvas = document.getElementById('cafe-canvas');
    const ctx = canvas.getContext('2d');
    function px(n) { return Math.round(n / 2) * 2; }

    function drawSpriteMatrix(ctx, matrix, palette, centerX, centerY, pixelSize = 2, flipX = false) {
      const rows = matrix.length, cols = matrix[0].length;
      const startX = Math.round(centerX - (cols * pixelSize) / 2);
      const startY = Math.round(centerY - (rows * pixelSize) / 2);
      for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
          const ch = matrix[r][flipX ? cols - 1 - c : c];
          if (ch === '.' || ch === ' ') continue;
          const col = palette[ch];
          if (!col) continue;
          ctx.fillStyle = col;
          ctx.fillRect(startX + c * pixelSize, startY + r * pixelSize, pixelSize, pixelSize);
        }
      }
    }

    function drawPixelBox(x, y, w, h, fill, outline, topHighlight) {
      const rx = px(x), ry = px(y), rw = px(w), rh = px(h);
      if (outline) { ctx.fillStyle = outline; ctx.fillRect(rx - 2, ry - 2, rw + 4, rh + 4); }
      ctx.fillStyle = fill; ctx.fillRect(rx, ry, rw, rh);
      if (topHighlight) { ctx.fillStyle = topHighlight; ctx.fillRect(rx, ry, rw, 4); }
    }

    const CHIBI_MATRIX = [
      '....OOOOOOOO....',
      '..OOhhhhhhhhOO..',
      '.OOHHHHHHHHHHOO.',
      '.OHBBBBBBBBBBHO.',
      '.OHHHHHHHHHHHHO.',
      '.OHSSSSSSSSSSHO.',
      '.OSSSSSSSSSSSSO.',
      '.OSSESSSSSSESSO.',
      '.OSSCSSSSSSCSSO.',
      '..OOSSSSSSSSOO..',
      '..OOTTTTTTTTOO..',
      '.OTTTAAAAAATTTO.',
      '.OTTAAWWWWAAATO.',
      '.OSTA.AAAA.ATSO.',
      '..OOAAAAAAAAOO..',
      '...OOPPPPPPOO...',
      '...OPPP..PPPO...',
      '...OFFO..OFFO...'
    ];

    const CAT_WALK_0 = [
      '.OO......OO.....',
      'OBSO....OSBO....',
      'OBBBOOOOBBBO..OO',
      'OBBBBBBBBBBO.OBO',
      'OBEBBBBBBBEBOBO.',
      'OBBBBBBBBBBBBO..',
      '.OCCCCCCCCCCO...',
      '.OBBBBGGbbbbO...',
      '.OBBBBBBBBBBO...',
      '.OBBBBBBBBBBO...',
      '..OBBO..OBBO....',
      '..OO......OO....'
    ];
    const CAT_GROOM = [
      '..OO......OO....',
      '.OBSO....OSBO...',
      '.OBBBOOOOBBBO...',
      '.OBBBBBBBBBBO...',
      '.OOOBBBBBBBEBO..',
      'OBSOOBBBBBBBO...',
      'OO.OCCCCCCCCO...',
      '...OBBBBGGbbO...',
      '...OBBBBBBBBBOOO',
      '...OBBBBBBBBBOBO',
      '....OBBBBBBBBBO.',
      '....OOOOOOOOOO..'
    ];
    const CAT_SLEEP = [
      '................',
      '....OOOOOOOO....',
      '..OOBBBBBBBBOO..',
      '.OBSOOOOOOOOSBO.',
      'OBBBOCCCCCCOBBBO',
      'OBBBBBBBBBBBBBBO',
      'OBBBBBBBBBBBBBBO',
      '.OOBBBBBBBBBBOO.',
      '...OOOOOOOOOO...'
    ];

    const RECIPES = {
      midnight_cold_brew: { name: 'Midnight Cold Brew', steps: ['grinder', 'milk_frother', 'cup_counter'], price: 14, color: '#18181b', accent: '#f8fafc' },
      daisy_vanilla_latte: { name: 'Daisy Vanilla Latte', steps: ['grinder', 'milk_frother', 'cup_counter'], price: 16, color: '#d6a87c', accent: '#fef08a' },
      miata_mocha: { name: "'90s Miata Mocha", steps: ['grinder', 'espresso', 'cup_counter'], price: 18, color: '#3f2318', accent: '#f43f5e' },
      catnip_herbal_tea: { name: 'Catnip Herbal Tea', steps: ['kettle', 'tea_leaves', 'cup_counter'], price: 15, color: '#10b981', accent: '#d1fae5' }
    };

    const STATIONS = [
      { id: 'grinder',      label: 'GRINDER',    x: 204, y: 138, w: 62, h: 48 },
      { id: 'espresso',     label: 'ESPRESSO',   x: 280, y: 138, w: 66, h: 48 },
      { id: 'milk_frother', label: 'FROTHER',    x: 356, y: 138, w: 62, h: 48 },
      { id: 'kettle',       label: 'KETTLE',     x: 432, y: 138, w: 62, h: 48 },
      { id: 'tea_leaves',   label: 'TEA LEAVES', x: 508, y: 138, w: 62, h: 48 },
      { id: 'trash',        label: 'CLEAR',      x: 580, y: 138, w: 52, h: 48 },
      { id: 'watering_can', label: 'WATER CAN',  x: 224, y: 238, w: 64, h: 44 },
      { id: 'cup_counter',  label: 'SERVE CUP',  x: 392, y: 238, w: 112, h: 44 }
    ];

    const DAISIES = [
      { id: 0, name: 'West Patio Planter',     x: 78,  y: 162, hydration: 38, needsWater: true },
      { id: 1, name: 'Veranda Corner Planter', x: 78,  y: 318, hydration: 82, needsWater: false },
      { id: 2, name: 'Garden Walk Left Bed',   x: 226, y: 426, hydration: 42, needsWater: true },
      { id: 3, name: 'Garden Walk Right Bed',  x: 548, y: 426, hydration: 88, needsWater: false },
      { id: 4, name: 'Garage Driveway Bed',    x: 812, y: 426, hydration: 34, needsWater: true }
    ];

    const CATS = [
      { id: 'lilo',   name: 'Lilo',   coat: '#ffffff', eye: '#38bdf8', collar: '#2563eb', x: 742, y: 268, tx: 742, ty: 268, state: 'napping', timer: 5.0, heartTimer: 0 },
      { id: 'champy', name: 'Champy', coat: '#18181b', eye: '#22c55e', collar: '#14b8a6', x: 256, y: 356, tx: 306, ty: 368, state: 'walking', timer: 4.0, heartTimer: 0 }
    ];

    let state = {
      viewMode: 'all', // 'all' | 'indoor' | 'outdoor'
      cam: { zoom: 1, fx: 450, fy: 240 },
      served: 0,
      hearts: 3,
      coins: 25,
      cozy: 82,
      activeDrink: null,
      step: 0,
      timer: 0,
      maxTimer: 0.6,
      busyStation: null,
      miataLights: true,
      popups: [],
      barista: { x: 336, y: 196, targetX: 336, targetY: 196, boost: 0 },
      customer: { name: 'Flora', order: 'miata_mocha', x: 392, y: 322 }
    };

    function spawnPopup(text, x, y, color = '#facc15') {
      state.popups.push({ text, x, y, life: 1.3, maxLife: 1.3, color });
    }

    function getRecommendedStation() {
      if (state.step >= 3) return null;
      const drinkId = state.activeDrink || state.customer.order;
      return RECIPES[drinkId].steps[state.step];
    }

    function syncHud(msg) {
      const avgH = DAISIES.reduce((s, d) => s + d.hydration, 0) / DAISIES.length;
      const watered = DAISIES.filter(d => !d.needsWater).length;
      state.cozy = Math.min(100, Math.round(avgH * 0.5 + (watered / DAISIES.length) * 30 + Math.min(20, state.hearts * 2)));
      document.getElementById('hud-cozy').textContent = state.cozy + '%';
      document.getElementById('hud-hearts').textContent = String(state.hearts);
      document.getElementById('hud-served').textContent = state.served + '/6';
      document.getElementById('hud-coins').textContent = String(state.coins);

      const rec = RECIPES[state.customer.order];
      document.getElementById('hud-order-title').textContent =
        state.customer.name.toUpperCase() + ': ' + rec.name.toUpperCase() + ' (STEP ' + state.step + '/3)';
      if (msg) document.getElementById('hud-msg').textContent = msg;
      document.getElementById('btn-miata-sub').textContent = state.miataLights ? 'Pop-Ups: ON ★' : 'Pop-Ups: OFF';

      const nextSt = state.step < 3 && !state.busyStation ? getRecommendedStation() : null;
      STATIONS.forEach(s => {
        const b = document.getElementById('btn-' + s.id);
        if (b) b.classList.toggle('active', s.id === nextSt);
      });
      document.getElementById('btn-serve').classList.toggle('active', state.step === 3);

      const smartBtn = document.getElementById('btn-smart-step');
      if (state.step === 3) smartBtn.textContent = '⚡ Serve Guest!';
      else if (nextSt) smartBtn.textContent = '⚡ Step ' + (state.step + 1) + ': ' + nextSt.replace('_', ' ').toUpperCase();
      else smartBtn.textContent = '⚡ Smart Step';
    }

    window.toggleDock = function() {
      const dock = document.getElementById('bottom-dock');
      const collapsed = dock.classList.toggle('collapsed');
      document.getElementById('btn-dock-toggle').textContent =
        collapsed ? '▲ RECIPES & CONTROLS' : '▼ HIDE DOCK';
    };

    window.cycleViewMode = function() {
      const modes = ['all', 'indoor', 'outdoor'];
      state.viewMode = modes[(modes.indexOf(state.viewMode) + 1) % modes.length];
      const label = state.viewMode.toUpperCase();
      document.getElementById('btn-view-top').textContent = '🏠 ' + label;
      document.getElementById('btn-quick-view').textContent = '🏠 View: ' + label;
      playTone(440, 'triangle', 0.08);
      syncHud('Camera View Mode switched to ' + label + '.');
    };

    window.interactStation = function(id) {
      if (state.busyStation && state.timer > 0) {
        state.step = Math.min(3, state.step + 1);
        state.busyStation = null;
        state.timer = 0;
      }
      const st = STATIONS.find(s => s.id === id);
      if (st) state.barista.targetX = Math.max(200, Math.min(585, st.x));
      if (id === 'trash') { state.step = 0; state.activeDrink = null; syncHud('Cleared counter tray.'); return; }
      if (id === 'watering_can') { window.waterNextDaisy(); return; }
      if (id === 'cup_counter' && state.step === 3) { window.serveCustomer(); return; }

      const expected = getRecommendedStation();
      if (id === expected) {
        state.activeDrink = state.customer.order;
        state.busyStation = id;
        state.maxTimer = id === 'cup_counter' ? 0.25 : 0.6;
        state.timer = state.maxTimer;
        playTone(523.25, 'square', 0.1);
        syncHud('Brewing Step ' + (state.step + 1) + '/3 at ' + st.label + '...');
      } else {
        syncHud('Follow the ▼ NEXT arrow over the highlighted appliance!');
      }
    };

    window.executeSmartStep = function() {
      if (state.busyStation && state.timer > 0) {
        state.step = Math.min(3, state.step + 1);
        state.busyStation = null;
        state.timer = 0;
      }
      if (state.step === 3) {
        window.serveCustomer();
        return;
      }
      const nextSt = getRecommendedStation();
      if (nextSt) window.interactStation(nextSt);
    };

    window.serveCustomer = function() {
      if (state.step < 3 || !state.activeDrink) { syncHud('Finish all 3 steps or tap ⚡ Smart Step!'); return; }
      const rec = RECIPES[state.customer.order];
      state.served++; state.hearts += 2; state.coins += rec.price + 3;
      spawnPopup('+' + (rec.price + 3) + 'c ♥+2', state.customer.x, state.customer.y - 30, '#facc15');
      playTone(783.99, 'square', 0.18);
      state.step = 0; state.activeDrink = null;
      const keys = Object.keys(RECIPES);
      const names = ['Flora', 'Milo', 'Takumi', 'Clara', 'Keisuke'];
      state.customer = {
        name: names[state.served % names.length],
        order: keys[state.served % keys.length],
        x: 392, y: 322
      };
      syncHud('Served ' + rec.name + '! +' + (rec.price + 3) + ' Coins!');
    };

    window.waterNextDaisy = function() {
      const target = [...DAISIES].sort((a, b) => a.hydration - b.hydration)[0];
      if (target) {
        target.hydration = 100; target.needsWater = false;
        state.coins += 2;
        spawnPopup('+💧 COZY! +2c', target.x, target.y - 24, '#38bdf8');
        playTone(587.33, 'sine', 0.14);
        syncHud('Watered ' + target.name + '! +2 Coins & Cozy Rating boosted.');
      }
    };

    window.toggleMiata = function() {
      state.miataLights = !state.miataLights;
      spawnPopup(state.miataLights ? 'POP-UPS: ON ★' : 'POP-UPS: OFF', 742, 200, '#facc15');
      playTone(state.miataLights ? 440 : 220, 'square', 0.1);
      syncHud(state.miataLights ? '1990 Miata MX-5 Pop-Up Headlights UP! ★' : '1990 Miata MX-5 Pop-Up Headlights DOWN.');
    };

    window.petCats = function() {
      const c = CATS[state.hearts % CATS.length];
      c.heartTimer = 2.4;
      c.state = 'grooming';
      c.timer = 3.5;
      state.hearts++;
      state.barista.boost = 6.0;
      spawnPopup('♥ ' + c.name.toUpperCase() + ' ♪', c.x, c.y - 22, '#fb7185');
      playTone(659.25, 'sine', 0.16);
      syncHud('Petted ' + c.name + '! Purrrr~ ♥♪ +Speed Boost!');
    };

    window.addEventListener('keydown', (e) => {
      const k = e.key.toLowerCase();
      if (k === '1') window.interactStation('grinder');
      else if (k === '2') window.interactStation('espresso');
      else if (k === '3') window.interactStation('milk_frother');
      else if (k === '4') window.interactStation('kettle');
      else if (k === '5') window.interactStation('tea_leaves');
      else if (k === 'e') window.executeSmartStep();
      else if (k === 'v') window.cycleViewMode();
      else if (k === 'b') window.toggleBgm();
      else if (k === 'm') window.toggleSfx();
      else if (k === ' ') { e.preventDefault(); state.step === 3 ? window.serveCustomer() : window.interactStation('cup_counter'); }
      else if (k === 'enter') window.serveCustomer();
      else if (k === 'w') window.waterNextDaisy();
      else if (k === 'h') window.toggleMiata();
      else if (k === 'c') window.petCats();
    });

    canvas.addEventListener('pointerdown', (e) => {
      const rect = canvas.getBoundingClientRect();
      const cx = ((e.clientX - rect.left) / rect.width) * 900;
      const cy = ((e.clientY - rect.top) / rect.height) * 480;
      const wx = (cx - 450) / state.cam.zoom + state.cam.fx;
      const wy = (cy - 240) / state.cam.zoom + state.cam.fy;

      for (const c of CATS) {
        if (Math.abs(wx - c.x) <= 28 && Math.abs(wy - c.y) <= 24) { window.petCats(); return; }
      }
      if (Math.abs(wx - 742) <= 58 && Math.abs(wy - 242) <= 88) { window.toggleMiata(); return; }
      for (const d of DAISIES) {
        if (Math.abs(wx - d.x) <= 46 && Math.abs(wy - d.y) <= 32) {
          d.hydration = 100; d.needsWater = false; state.coins += 2;
          spawnPopup('+💧 COZY! +2c', d.x, d.y - 24, '#38bdf8');
          syncHud('Watered ' + d.name + '! +2 Coins');
          return;
        }
      }
      if (wx >= state.customer.x - 30 && wx <= state.customer.x + 220 && Math.abs(wy - state.customer.y) <= 44) {
        window.executeSmartStep(); return;
      }
      for (const s of STATIONS) {
        if (Math.abs(wx - s.x) <= s.w / 2 + 6 && Math.abs(wy - s.y) <= s.h / 2 + 6) {
          window.interactStation(s.id); return;
        }
      }
      state.barista.targetX = Math.max(170, Math.min(600, wx));
      state.barista.targetY = Math.max(182, Math.min(400, wy));
    });

    let last = performance.now();
    function loop(now) {
      const dt = Math.min(0.05, (now - last) / 1000);
      const t = now / 1000;
      last = now;

      // Smooth Camera View Interpolation
      const tZoom = state.viewMode === 'indoor' ? 1.24 : state.viewMode === 'outdoor' ? 1.22 : 1.0;
      const tFx = state.viewMode === 'indoor' ? 508 : 450;
      const tFy = state.viewMode === 'indoor' ? 196 : state.viewMode === 'outdoor' ? 332 : 240;
      state.cam.zoom += (tZoom - state.cam.zoom) * Math.min(1, dt * 8);
      state.cam.fx += (tFx - state.cam.fx) * Math.min(1, dt * 8);
      state.cam.fy += (tFy - state.cam.fy) * Math.min(1, dt * 8);

      if (state.timer > 0) {
        state.timer = Math.max(0, state.timer - dt);
        if (state.timer === 0) {
          state.step = Math.min(3, state.step + 1);
          state.busyStation = null;
          syncHud(state.step === 3 ? 'Drink READY! Tap ⚡ Smart Step or [Enter] to serve.' : 'Step ' + state.step + '/3 complete!');
        }
      }

      // Dynamic Daisy Hydration Decay (~1.2% per sec)
      DAISIES.forEach(d => {
        d.hydration = Math.max(15, d.hydration - 1.2 * dt);
        d.needsWater = d.hydration <= 55;
      });

      // Smooth Multi-State Cats (Zero Teleportation)
      CATS.forEach(c => {
        if (c.heartTimer > 0) c.heartTimer = Math.max(0, c.heartTimer - dt);
        if (c.state === 'walking') {
          const dx = c.tx - c.x, dy = c.ty - c.y, dist = Math.hypot(dx, dy);
          if (dist > 2) {
            c.x += (dx / dist) * 45 * dt; c.y += (dy / dist) * 45 * dt;
          } else {
            c.state = c.id === 'lilo' && c.tx > 680 ? 'napping' : 'grooming';
            c.timer = 4.5;
          }
        } else {
          c.timer -= dt;
          if (c.timer <= 0) {
            c.state = 'walking';
            if (c.id === 'lilo') {
              const onCar = c.x > 660;
              c.tx = onCar ? 556 : 742;
              c.ty = onCar ? 222 : 268;
            } else {
              const pts = [[256, 356], [184, 404], [508, 364]];
              const p = pts[Math.floor(Math.random() * pts.length)];
              c.tx = p[0]; c.ty = p[1];
            }
          }
        }
      });

      state.barista.x += (state.barista.targetX - state.barista.x) * Math.min(1, dt * 8);
      state.barista.y += (state.barista.targetY - state.barista.y) * Math.min(1, dt * 8);

      ctx.save();
      ctx.fillStyle = '#0b0d12';
      ctx.fillRect(0, 0, 900, 480);
      ctx.translate(450, 240);
      ctx.scale(state.cam.zoom, state.cam.zoom);
      ctx.translate(-state.cam.fx, -state.cam.fy);

      // 1. Outdoor Daisy Garden Grass & Stone Walkway
      for (let r = 0; r < 15; r++) {
        for (let c = 0; c < 29; c++) {
          ctx.fillStyle = (r + c) % 2 === 0 ? '#4ade80' : '#22c55e';
          ctx.fillRect(c * 32, r * 32, 32, 32);
        }
      }
      [456, 422, 388, 352, 318].forEach(sy => drawPixelBox(336, sy - 11, 112, 22, '#cbd5e1', '#090b0e', '#f8fafc'));

      // 2. Indoor Monochrome Coffee Shop Building (Enclosed Walls + Checkerboard Floor + KLASIK Mat)
      drawPixelBox(152, 76, 484, 220, '#0f172a', '#090b0e', '#334155');
      for (let r = 0; r < 8; r++) {
        for (let c = 0; c < 19; c++) {
          ctx.fillStyle = (r + c) % 2 === 0 ? '#262d3d' : '#1b202c';
          ctx.fillRect(160 + c * 24, 102 + r * 22, 24, 22);
        }
      }
      drawPixelBox(344, 278, 96, 20, '#18181b', '#f8fafc');

      // 3. Partitioned Indoor Garage Bay & 1990 Mazda Miata MX-5
      drawPixelBox(636, 76, 228, 292, '#18181b', '#090b0e', '#3f3f46');
      for (let r = 0; r < 10; r++) {
        for (let c = 0; c < 8; c++) {
          ctx.fillStyle = (r + c) % 2 === 0 ? '#e2e8f0' : '#1e232d';
          ctx.fillRect(654 + c * 24, 112 + r * 24, 24, 24);
        }
      }
      drawPixelBox(698, 166, 88, 152, '#f8fafc', '#090b0e', '#ffffff');
      drawPixelBox(710, 198, 64, 48, '#0f172a', '#090b0e');
      if (state.miataLights) {
        drawPixelBox(710, 290, 18, 14, '#1e293b', '#090b0e');
        drawPixelBox(756, 290, 18, 14, '#1e293b', '#090b0e');
        ctx.fillStyle = 'rgba(254, 240, 138, 0.28)';
        ctx.fillRect(702, 304, 80, 60);
      }

      // 4. Cafe Signboard
      drawPixelBox(228, 30, 556, 34, '#090b0e', '#f8fafc', '#334155');
      ctx.font = 'bold 13px "Press Start 2P", monospace';
      ctx.textAlign = 'center';
      ctx.fillStyle = '#facc15';
      ctx.fillText('KLASIK - GARDEN GARAGE CAFE ★', 506, 53);

      // 5. Daisy Planters
      DAISIES.forEach(d => {
        drawPixelBox(d.x - 44, d.y - 28, 88, 56, '#1e293b', d.needsWater ? '#38bdf8' : '#090b0e', '#475569');
        ctx.fillStyle = d.needsWater ? '#3f6212' : '#16a34a';
        ctx.fillRect(d.x - 36, d.y - 20, 72, 36);
        ctx.fillStyle = '#ffffff'; ctx.fillRect(d.x - 20, d.y - 8, 12, 12); ctx.fillRect(d.x + 8, d.y - 8, 12, 12);
        ctx.fillStyle = '#eab308'; ctx.fillRect(d.x - 16, d.y - 4, 4, 4); ctx.fillRect(d.x + 12, d.y - 4, 4, 4);
      });

      // 6. Stations + Bouncing ▼ NEXT Indicator + Progress Bars
      const recSt = state.busyStation ? null : getRecommendedStation();
      STATIONS.forEach(s => {
        const isNext = s.id === recSt;
        drawPixelBox(s.x - s.w/2, s.y - s.h/2, s.w, s.h, isNext ? '#26334d' : '#1e293b', isNext ? '#facc15' : '#090b0e', '#475569');
        if (state.busyStation === s.id && state.timer > 0) {
          const pct = 1 - state.timer / state.maxTimer;
          drawPixelBox(s.x - 28, s.y - s.h/2 - 18, 56, 10, '#090b0e', '#ffffff');
          ctx.fillStyle = '#22c55e';
          ctx.fillRect(s.x - 26, s.y - s.h/2 - 16, Math.round(52 * pct), 6);
        } else if (isNext) {
          const bob = Math.round(Math.sin(t * 9) * 3);
          drawPixelBox(s.x - 26, s.y - s.h/2 - 22 + bob, 52, 13, '#facc15', '#090b0e');
          ctx.font = 'bold 7px "Press Start 2P", monospace';
          ctx.fillStyle = '#090b0e';
          ctx.fillText('▼ NEXT', s.x, s.y - s.h/2 - 13 + bob);
        }
      });

      // 7. Characters & Multi-State Cats
      drawSpriteMatrix(ctx, CHIBI_MATRIX, { O:'#090b0e', H:'#18181b', h:'#3f3f46', B:'#f8fafc', S:'#fde68a', E:'#090b0e', C:'#fb7185', T:'#f8fafc', A:'#1e293b', W:'#facc15', P:'#0f172a', F:'#090b0e' }, state.barista.x, state.barista.y, 2);
      drawSpriteMatrix(ctx, CHIBI_MATRIX, { O:'#090b0e', H:'#7c2d12', h:'#9a3412', B:'#f43f5e', S:'#ffedd5', E:'#090b0e', C:'#fb7185', T:'#f8fafc', A:'#1e293b', W:'#f8fafc', P:'#1e293b', F:'#090b0e' }, state.customer.x, state.customer.y, 2);
      CATS.forEach(c => {
        const mat = c.state === 'napping' ? CAT_SLEEP : c.state === 'grooming' ? CAT_GROOM : CAT_WALK_0;
        drawSpriteMatrix(ctx, mat, { O:'#090b0e', B:c.coat, b:c.coat, S:'#fda4af', E:c.eye, C:c.collar, G:'#facc15' }, c.x, c.y, 2);
        if (c.state === 'napping') {
          ctx.font = 'bold 8px "Press Start 2P", monospace';
          ctx.fillStyle = '#f8fafc';
          ctx.fillText('Zzz', c.x + 16, c.y - 14);
        }
      });

      // 8. Floating Popups
      for (let i = state.popups.length - 1; i >= 0; i--) {
        const p = state.popups[i];
        p.life -= dt; p.y -= 24 * dt;
        if (p.life <= 0) { state.popups.splice(i, 1); continue; }
        ctx.font = 'bold 9px "Press Start 2P", monospace';
        ctx.fillStyle = p.color;
        ctx.fillText(p.text, p.x, p.y);
      }

      ctx.restore();
      requestAnimationFrame(loop);
    }
    syncHud();
    requestAnimationFrame(loop);
  </script>
</body>
</html>`;
