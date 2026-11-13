/**
 * Complete, self-contained single-file HTML5, CSS, and JavaScript Gameboy Advance (Gen 3 Pokémon)
 * Multi-Map Edition of "Klasik — Garden Garage Cafe" with Daily Goal Progress Bar, Shift Success
 * Notification, Real-Time Clock, Classic Red 1990 Mazda Miata MX-5, Dating Couples, Photo Squad,
 * Staff Hiring (Miko & Ken), and 6-State Cat Animations (Lilo & Champy).
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
    * { box-sizing: border-box; margin: 0; padding: 0; user-select: none; -webkit-user-select: none; }
    html, body {
      width: 100vw; height: 100dvh; overflow: hidden;
      background: #0b0d12; color: #f8fafc;
      font-family: 'VT323', monospace;
      image-rendering: pixelated;
    }
    main {
      width: 100vw; height: 100dvh;
      display: flex; flex-direction: column; justify-content: space-between;
      background: #0b0d12;
    }
    .gba-frame {
      background: #141821;
      border: 3px solid #f8fafc;
      box-shadow: inset 0 0 0 2px #090b10, 3px 3px 0 0 #05070a;
    }
    .gba-dialogue {
      background: #f8fafc; color: #0f172a;
      border: 3px solid #0f172a;
      box-shadow: inset 0 0 0 2px #cbd5e1, 3px 3px 0 0 #090b10;
    }
    .gba-btn {
      background: #1e2433; color: #f8fafc;
      border: 2px solid #cbd5e1;
      box-shadow: inset -2px -2px 0 0 #090b10, 2px 2px 0 0 #05070a;
      font-family: 'Press Start 2P', monospace;
      cursor: pointer;
    }
    .gba-btn:hover { background: #2a3246; border-color: #ffffff; }
    .gba-btn:active { transform: translate(1px, 1px); }
    .gba-btn-active {
      background: #facc15 !important; color: #090b10 !important;
      border-color: #ffffff !important;
      box-shadow: inset -2px -2px 0 0 #ca8a04, 2px 2px 0 0 #05070a !important;
    }
    .keycap {
      display: inline-block; padding: 1px 4px;
      font-family: 'Press Start 2P', monospace; font-size: 8px;
      background: #090b10; color: #facc15; border: 1px solid #64748b;
    }
    header {
      width: 100%; background: #0b0d12; border-bottom: 3px solid #f8fafc;
      padding: 4px 8px; display: flex; align-items: center; justify-content: space-between;
      gap: 6px; flex-shrink: 0; flex-wrap: wrap;
    }
    #stage {
      flex: 1; min-height: 0; width: 100%; position: relative;
      display: flex; align-items: center; justify-content: center; padding: 4px;
    }
    canvas {
      width: 100%; height: 100%; object-fit: contain;
      image-rendering: pixelated; cursor: pointer;
      border: 3px solid #334155;
    }
    #quick-bar {
      position: absolute; bottom: 10px; right: 12px; z-index: 10;
      display: flex; flex-wrap: wrap; gap: 6px; justify-content: flex-end;
    }
    #shift-banner {
      position: absolute; top: 10px; left: 50%; transform: translateX(-50%);
      z-index: 15; display: none; align-items: center; gap: 10px;
      padding: 8px 12px; background: #141821; border: 3px solid #facc15;
      box-shadow: 4px 4px 0 0 #05070a;
    }
    footer {
      width: 100%; background: #0b0d12; border-top: 3px solid #f8fafc;
      padding: 4px 6px; display: none; flex-wrap: wrap; align-items: center;
      justify-content: center; gap: 4px; flex-shrink: 0;
    }
    footer.open { display: flex; }
    .goal-wrap {
      display: flex; align-items: center; gap: 6px;
    }
    .goal-track {
      width: 72px; height: 10px; background: #090b10; border: 2px solid #475569;
      padding: 1px; position: relative; overflow: hidden;
    }
    .goal-fill {
      height: 100%; background: #38bdf8; width: 0%;
      transition: width 0.2s ease;
    }
    .overlay {
      position: fixed; inset: 0; background: rgba(9, 11, 16, 0.88);
      display: flex; align-items: center; justify-content: center; z-index: 30; padding: 16px;
    }
    .modal { max-width: 560px; width: 100%; padding: 20px; }
    h1 { font-family: 'Press Start 2P', monospace; font-size: 22px; color: #f8fafc; margin-bottom: 8px; }
    .sub { font-family: 'Press Start 2P', monospace; font-size: 9px; color: #facc15; margin-bottom: 14px; }
  </style>
</head>
<body data-state="title">
  <main>
    <header>
      <div class="gba-frame" style="padding: 4px 8px; display: flex; align-items: center; gap: 8px; flex-wrap: wrap;">
        <span id="clock-txt" style="font-family:'Press Start 2P'; font-size:9px; color:#7dd3fc;">🕒 12:00 PM</span>
        <span style="font-family:'Press Start 2P'; font-size:9px;">COZY <strong id="cozy-val">82%</strong></span>
        <span style="font-family:'Press Start 2P'; font-size:9px; color:#fb7185;">♥ <strong id="hearts-val">3</strong></span>
        <span style="font-family:'Press Start 2P'; font-size:9px; color:#facc15;">$ <strong id="coins-val">25</strong></span>
        <div class="goal-wrap">
          <span style="font-family:'Press Start 2P'; font-size:8px; color:#94a3b8;">GOAL</span>
          <div class="goal-track"><div id="goal-fill" class="goal-fill"></div></div>
          <span id="served-val" style="font-family:'Press Start 2P'; font-size:9px; color:#f8fafc;">0/6</span>
          <button class="gba-btn gba-btn-active" id="finish-btn" style="padding: 3px 6px; font-size:8px; display:none;">SHIFT SUCCESS ★</button>
        </div>
      </div>
      <div class="gba-dialogue" style="padding: 4px 10px; flex: 1; max-width: 410px; min-width: 180px;">
        <div style="display:flex; justify-content:space-between; font-family:'Press Start 2P'; font-size:8px;">
          <span id="order-title">KLASIK GARAGE LOG</span>
          <span id="step-badge" style="background:#0f172a; color:#facc15; padding:1px 5px;">STEP 0/3</span>
        </div>
        <div id="log-msg" style="font-size:17px; margin-top:2px; white-space:nowrap; overflow:hidden; text-overflow:ellipsis;">
          Welcome to Klasik! Tap customer bubble or [⚡ BREW / SERVE] to start.
        </div>
      </div>
      <div class="gba-frame" style="padding: 4px 6px; display: flex; gap: 4px; flex-wrap: wrap;">
        <button class="gba-btn" id="room-btn" style="padding: 4px 6px; font-size:8px; color:#7dd3fc;">🚪 INSIDE</button>
        <button class="gba-btn" id="time-btn" style="padding: 4px 6px; font-size:8px; color:#fde047;">☀️ DAY</button>
        <button class="gba-btn" id="weather-btn" style="padding: 4px 6px; font-size:8px; color:#86efac;">⛅ CLEAR</button>
        <button class="gba-btn" id="hire-btn" style="padding: 4px 6px; font-size:8px; color:#fb7185;">👩‍🍳 STAFF (0/2) · $35</button>
        <button class="gba-btn" id="dock-btn" style="padding: 4px 6px; font-size:8px; color:#facc15;">🛠️ STATIONS</button>
        <button class="gba-btn" id="bgm-btn" style="padding: 4px 6px; font-size:8px;">♪ BGM:OFF</button>
        <button class="gba-btn" id="sfx-btn" style="padding: 4px 6px; font-size:8px;">🔊 SFX:ON</button>
      </div>
    </header>

    <div id="stage">
      <canvas id="game" width="900" height="480"></canvas>
      <div id="shift-banner">
        <div>
          <div style="font-family:'Press Start 2P'; font-size:10px; color:#facc15;">★ SHIFT SUCCESS! DAILY GOAL REACHED ★</div>
          <div style="font-size:16px; color:#e2e8f0;">Daily customer service objective complete! Keep serving or finish shift.</div>
        </div>
        <button class="gba-btn gba-btn-active" id="banner-finish-btn" style="padding:5px 8px; font-size:8px;">FINISH ★</button>
        <button class="gba-btn" id="banner-close-btn" style="padding:5px 8px; font-size:8px;">✕</button>
      </div>
      <div id="quick-bar">
        <button class="gba-btn gba-btn-active" id="q-smart" style="padding: 6px 10px; font-size:9px;">⚡ BREW / SERVE</button>
        <button class="gba-btn" id="q-water" style="padding: 6px 8px; font-size:9px; color:#7dd3fc;">💧 WATER</button>
        <button class="gba-btn" id="q-hire" style="padding: 6px 8px; font-size:9px; color:#86efac;">👩‍🍳 HIRE (0/2)</button>
        <button class="gba-btn" id="q-cat" style="padding: 6px 8px; font-size:9px; color:#fb7185;">🐾 PET CAT</button>
        <button class="gba-btn" id="q-room" style="padding: 6px 8px; font-size:9px; color:#facc15;">🚪 TO GARDEN</button>
      </div>
    </div>

    <footer id="bottom-dock">
      <button class="gba-btn" data-st="grinder" style="padding:3px 6px; font-size:8px;"><span class="keycap">1</span> Grinder</button>
      <button class="gba-btn" data-st="espresso" style="padding:3px 6px; font-size:8px;"><span class="keycap">2</span> Espresso</button>
      <button class="gba-btn" data-st="milk_frother" style="padding:3px 6px; font-size:8px;"><span class="keycap">3</span> Frother</button>
      <button class="gba-btn" data-st="kettle" style="padding:3px 6px; font-size:8px;"><span class="keycap">4</span> Kettle</button>
      <button class="gba-btn" data-st="tea_leaves" style="padding:3px 6px; font-size:8px;"><span class="keycap">5</span> Tea</button>
      <button class="gba-btn" data-st="cup_counter" style="padding:3px 6px; font-size:8px;"><span class="keycap">Space</span> Pour</button>
      <button class="gba-btn" id="serve-btn" style="padding:3px 6px; font-size:8px;"><span class="keycap">Enter</span> Serve</button>
      <button class="gba-btn" id="water-btn" style="padding:3px 6px; font-size:8px;"><span class="keycap">W</span> Water</button>
      <button class="gba-btn" id="miata-btn" style="padding:3px 6px; font-size:8px;"><span class="keycap">H</span> Miata</button>
      <button class="gba-btn" id="cat-btn" style="padding:3px 6px; font-size:8px;"><span class="keycap">C</span> Pet Cats</button>
    </footer>
  </main>

  <div class="overlay" id="title-overlay">
    <div class="gba-frame modal">
      <div class="sub">GBA MULTI-MAP EDITION · 1990 MAZDA MIATA MX-5</div>
      <h1>KLASIK</h1>
      <p style="font-size:20px; color:#cbd5e1; margin-bottom:14px;">
        Explore two full-screen GBA maps: brew monochrome signature drinks inside the cafe &amp; Classic Red 1990 Miata MX-5 showroom (with dating couples, photo squad, and hireable staff), or step outside to the Backyard Daisy Garden with Lilo &amp; Champy!
      </p>
      <button class="gba-btn gba-btn-active" id="start-btn" style="padding:12px 20px; font-size:11px;">
        PRESS START / ENTER ▶
      </button>
    </div>
  </div>

  <script>
    const canvas = document.getElementById('game');
    const ctx = canvas.getContext('2d');

    const RECIPES = {
      midnight_cold_brew: { name: 'Midnight Cold Brew', short: 'Cold Brew', steps: ['grinder','kettle','cup_counter'], price: 14 },
      daisy_vanilla_latte: { name: 'Daisy Vanilla Latte', short: 'Daisy Latte', steps: ['grinder','milk_frother','cup_counter'], price: 16 },
      miata_mocha: { name: '1990 Miata Mocha', short: 'Miata Mocha', steps: ['grinder','espresso','cup_counter'], price: 18 },
      catnip_herbal_tea: { name: 'Catnip Daisy Tea', short: 'Daisy Tea', steps: ['kettle','tea_leaves','cup_counter'], price: 15 }
    };

    const STATIONS = [
      { id: 'grinder', label: 'GRINDER', key: '1', x: 108, y: 128 },
      { id: 'espresso', label: 'ESPRESSO', key: '2', x: 200, y: 128 },
      { id: 'milk_frother', label: 'FROTHER', key: '3', x: 292, y: 128 },
      { id: 'kettle', label: 'KETTLE', key: '4', x: 384, y: 128 },
      { id: 'tea_leaves', label: 'TEA', key: '5', x: 476, y: 128 },
      { id: 'cup_counter', label: 'PICKUP', key: 'Space', x: 356, y: 244 }
    ];

    function getAutoTime() {
      const h = new Date().getHours();
      if (h >= 6 && h < 17) return 'day';
      if (h >= 17 && h < 19) return 'sunset';
      return 'night';
    }

    function formatClock() {
      const d = new Date();
      let h = d.getHours();
      const m = String(d.getMinutes()).padStart(2, '0');
      const ap = h >= 12 ? 'PM' : 'AM';
      h = h % 12 || 12;
      return (h < 10 ? '0' + h : h) + ':' + m + ' ' + ap;
    }

    const state = {
      mode: 'title', room: 'inside',
      timeOfDay: getAutoTime(), weather: 'clear',
      cozy: 82, hearts: 3, coins: 25, served: 0, target: 6,
      shiftSuccessShown: false,
      step: 0, activeDrink: null,
      miataLights: false, miataColor: 'red',
      tipJar: 3,
      barista: { x: 340, y: 192, tx: 340, ty: 192 },
      staff: [
        { id: 'miko', name: 'Miko', cost: 35, hired: false, x: 200, y: 175, timer: 1.5 },
        { id: 'ken', name: 'Ken', cost: 50, hired: false, x: 420, y: 192, timer: 1.5 }
      ],
      cats: [
        { id: 'lilo', room: 'inside', x: 496, y: 246, state: 'yarn_play', heart: 0 },
        { id: 'champy', room: 'garden', x: 310, y: 332, state: 'stretching', heart: 0 }
      ],
      daisies: [
        { x: 140, y: 255, h: 92 }, { x: 140, y: 385, h: 64 },
        { x: 325, y: 395, h: 86 }, { x: 575, y: 395, h: 58 },
        { x: 760, y: 255, h: 88 }, { x: 760, y: 385, h: 74 }
      ],
      customer: { name: 'Maya', order: 'daisy_vanilla_latte', x: 356, y: 312 }
    };

    function syncHud() {
      document.getElementById('clock-txt').textContent = '🕒 ' + formatClock();
      document.getElementById('cozy-val').textContent = Math.round(state.cozy) + '%';
      document.getElementById('hearts-val').textContent = state.hearts;
      document.getElementById('coins-val').textContent = state.coins;
      document.getElementById('served-val').textContent = state.served + '/' + state.target;
      const pct = Math.min(100, Math.round((state.served / state.target) * 100));
      const fill = document.getElementById('goal-fill');
      fill.style.width = pct + '%';
      fill.style.background = state.served >= state.target ? '#4ade80' : '#38bdf8';
      document.getElementById('finish-btn').style.display = state.served >= state.target ? 'inline-block' : 'none';
      document.getElementById('step-badge').textContent = 'STEP ' + state.step + '/3';
      const r = RECIPES[state.customer.order];
      document.getElementById('order-title').textContent = state.customer.name + ': ' + r.name;
      document.getElementById('room-btn').textContent = state.room === 'inside' ? '🚪 INSIDE' : '🚪 GARDEN';
      document.getElementById('q-room').textContent = state.room === 'inside' ? '🚪 TO GARDEN' : '🚪 TO INSIDE';
      document.getElementById('time-btn').textContent = state.timeOfDay === 'day' ? '☀️ DAY' : state.timeOfDay === 'sunset' ? '🌅 SUNSET' : '🌙 NIGHT';
      document.getElementById('weather-btn').textContent = state.weather === 'clear' ? '⛅ CLEAR' : state.weather === 'breeze' ? '🍃 BREEZE' : '🌧️ RAIN';
      const hiredCount = state.staff.filter(s => s.hired).length;
      const nextS = state.staff.find(s => !s.hired);
      document.getElementById('hire-btn').textContent = '👩‍🍳 STAFF (' + hiredCount + '/2)' + (nextS ? ' · $' + nextS.cost : ' ★');
      document.getElementById('q-hire').textContent = '👩‍🍳 HIRE (' + hiredCount + '/2)';
    }

    function smartStep() {
      const r = RECIPES[state.customer.order];
      if (state.step < 3) {
        const stId = r.steps[state.step];
        const stObj = STATIONS.find(s => s.id === stId);
        if (stObj) { state.barista.tx = stObj.x; state.barista.ty = 192; }
        state.step++;
        document.getElementById('log-msg').textContent = state.step === 3
          ? r.name + ' is ready! Click Guest or [⚡ BREW / SERVE]!'
          : 'Completed step ' + state.step + '/3 for ' + r.name + '!';
      } else {
        state.served++;
        state.hearts++;
        state.coins += r.price;
        state.cozy = Math.min(100, state.cozy + 4);
        state.step = 0;
        if (state.served === state.target && !state.shiftSuccessShown) {
          state.shiftSuccessShown = true;
          document.getElementById('shift-banner').style.display = 'flex';
        }
        const keys = Object.keys(RECIPES);
        const names = ['Maya','Sora','Kenji','Hana','Leo','Chloe'];
        state.customer.order = keys[state.served % keys.length];
        state.customer.name = names[state.served % names.length];
        document.getElementById('log-msg').textContent = 'Served ' + r.name + '! +' + r.price + ' coins & +1 ♥';
      }
      syncHud();
    }

    function waterAllDaisies() {
      state.daisies.forEach(d => { d.h = 100; });
      state.coins += 2;
      state.cozy = Math.min(100, state.cozy + 3);
      document.getElementById('log-msg').textContent = 'Hydrated all 6 Daisy beds! +2 coins';
      syncHud();
    }

    function hireStaff() {
      const nextS = state.staff.find(s => !s.hired);
      if (!nextS) {
        document.getElementById('log-msg').textContent = 'Both Miko & Ken are already hired!';
        return;
      }
      if (state.coins < nextS.cost) {
        document.getElementById('log-msg').textContent = 'Need $' + nextS.cost + ' to hire ' + nextS.name + '!';
        return;
      }
      state.coins -= nextS.cost;
      nextS.hired = true;
      document.getElementById('log-msg').textContent = 'Hired ' + nextS.name + '! Auto-assistance active!';
      syncHud();
    }

    // 100% Pixel-accurate coordinate mapping for object-fit: contain
    function screenToWorld(clientX, clientY) {
      const rect = canvas.getBoundingClientRect();
      const scale = Math.min(rect.width / 900, rect.height / 480);
      const offX = (rect.width - 900 * scale) / 2;
      const offY = (rect.height - 480 * scale) / 2;
      return {
        x: Math.max(0, Math.min(900, (clientX - rect.left - offX) / scale)),
        y: Math.max(0, Math.min(480, (clientY - rect.top - offY) / scale))
      };
    }

    document.getElementById('start-btn').onclick = () => {
      state.mode = 'playing';
      document.body.dataset.state = 'playing';
      document.getElementById('title-overlay').style.display = 'none';
      syncHud();
    };
    document.getElementById('q-smart').onclick = smartStep;
    document.getElementById('serve-btn').onclick = smartStep;
    document.getElementById('q-water').onclick = waterAllDaisies;
    document.getElementById('water-btn').onclick = waterAllDaisies;
    document.getElementById('q-hire').onclick = hireStaff;
    document.getElementById('hire-btn').onclick = hireStaff;
    document.getElementById('dock-btn').onclick = () => {
      document.getElementById('bottom-dock').classList.toggle('open');
    };
    document.getElementById('banner-close-btn').onclick = () => {
      document.getElementById('shift-banner').style.display = 'none';
    };
    document.getElementById('banner-finish-btn').onclick = () => {
      document.getElementById('shift-banner').style.display = 'none';
      document.getElementById('log-msg').textContent = 'Shift Success celebrated! Bonus +15 coins!';
      state.coins += 15;
      syncHud();
    };
    document.getElementById('finish-btn').onclick = () => {
      document.getElementById('shift-banner').style.display = 'flex';
    };
    document.getElementById('q-cat').onclick = () => {
      state.cats.forEach(c => c.heart = 2);
      state.hearts++;
      document.getElementById('log-msg').textContent = 'Lilo & Champy purred happily! +1 ♥';
      syncHud();
    };
    document.getElementById('room-btn').onclick = () => {
      state.room = state.room === 'inside' ? 'garden' : 'inside';
      syncHud();
    };
    document.getElementById('q-room').onclick = () => {
      state.room = state.room === 'inside' ? 'garden' : 'inside';
      syncHud();
    };
    document.getElementById('time-btn').onclick = () => {
      state.timeOfDay = state.timeOfDay === 'day' ? 'sunset' : state.timeOfDay === 'sunset' ? 'night' : 'day';
      syncHud();
    };
    document.getElementById('weather-btn').onclick = () => {
      state.weather = state.weather === 'clear' ? 'breeze' : state.weather === 'breeze' ? 'rain' : 'clear';
      syncHud();
    };
    document.getElementById('miata-btn').onclick = () => {
      state.miataLights = !state.miataLights;
      syncHud();
    };

    canvas.addEventListener('pointerdown', (e) => {
      const pt = screenToWorld(e.clientX, e.clientY);
      if (state.room === 'inside' && pt.x > 660 && pt.y > 190 && pt.y < 330) {
        state.miataLights = !state.miataLights;
        syncHud();
        return;
      }
      smartStep();
    });

    function drawWarmGlow(x, y, r, alpha) {
      const g = ctx.createRadialGradient(x, y, r * 0.1, x, y, r);
      g.addColorStop(0, 'rgba(254, 240, 138, ' + alpha + ')');
      g.addColorStop(0.55, 'rgba(250, 204, 21, ' + (alpha * 0.45) + ')');
      g.addColorStop(1, 'rgba(250, 204, 21, 0)');
      ctx.fillStyle = g;
      ctx.beginPath();
      ctx.arc(x, y, r, 0, Math.PI * 2);
      ctx.fill();
    }

    function loop() {
      ctx.clearRect(0, 0, 900, 480);

      // Staff automation tick
      if (state.mode === 'playing') {
        state.staff.forEach(w => {
          if (!w.hired) return;
          w.timer -= 0.016;
          if (w.timer <= 0) {
            w.timer = 1.6;
            if (w.id === 'miko' && state.step < 3) smartStep();
            if (w.id === 'ken' && state.step === 3) smartStep();
          }
        });
      }

      if (state.room === 'inside') {
        ctx.fillStyle = '#0f172a'; ctx.fillRect(0, 0, 900, 480);
        for (let y = 114; y < 444; y += 24) {
          for (let x = 24; x < 588; x += 24) {
            ctx.fillStyle = ((x/24 + y/24) % 2 === 0) ? '#e2e8f0' : '#cbd5e1';
            ctx.fillRect(x, y, 24, 24);
          }
          for (let x = 594; x < 876; x += 24) {
            ctx.fillStyle = ((x/24 + y/24) % 2 === 0) ? '#334155' : '#1e293b';
            ctx.fillRect(x, y, 24, 24);
          }
        }
        ctx.fillStyle = '#334155'; ctx.fillRect(60, 218, 490, 46);
        STATIONS.forEach(s => {
          ctx.fillStyle = '#1e293b'; ctx.fillRect(s.x - 32, s.y - 20, 64, 40);
          ctx.strokeStyle = '#f8fafc'; ctx.strokeRect(s.x - 32, s.y - 20, 64, 40);
          ctx.fillStyle = '#facc15'; ctx.font = '8px "Press Start 2P"';
          ctx.fillText('[' + s.key + '] ' + s.label, s.x - 28, s.y + 28);
        });
        // Classic Red 1990 Mazda Miata MX-5
        ctx.fillStyle = '#dc2626'; ctx.fillRect(708, 198, 84, 114);
        ctx.strokeStyle = '#090b10'; ctx.lineWidth = 3; ctx.strokeRect(708, 198, 84, 114);
        ctx.fillStyle = '#f8fafc'; ctx.font = '8px "Press Start 2P"';
        ctx.fillText('1990 MIATA MX-5 [H]', 680, 186);
        // 2 Garage Lounge Tables
        [356, 404].forEach(ty => {
          ctx.fillStyle = '#1e293b';
          ctx.beginPath(); ctx.arc(656, ty, 18, 0, Math.PI * 2); ctx.fill();
        });
      } else {
        ctx.fillStyle = '#4aad52'; ctx.fillRect(0, 0, 900, 480);
        state.daisies.forEach(d => {
          ctx.fillStyle = '#6b4423'; ctx.fillRect(d.x - 45, d.y - 22, 90, 44);
          ctx.fillStyle = '#ffffff'; ctx.fillRect(d.x - 6, d.y - 6, 12, 12);
          ctx.fillStyle = '#facc15'; ctx.fillRect(d.x - 3, d.y - 3, 6, 6);
        });
      }

      if (state.timeOfDay !== 'day') {
        ctx.fillStyle = state.timeOfDay === 'sunset' ? 'rgba(124,45,18,0.22)' : 'rgba(9,13,28,0.48)';
        ctx.fillRect(0, 0, 900, 480);
        drawWarmGlow(220, 180, 120, 0.25);
        drawWarmGlow(480, 180, 120, 0.25);
        drawWarmGlow(748, 250, 130, 0.22);
      }

      requestAnimationFrame(loop);
    }
    syncHud();
    requestAnimationFrame(loop);
  </script>
</body>
</html>`;
