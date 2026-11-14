/**
 * Complete, unbroken, self-contained single-file HTML5, CSS, and JavaScript Gameboy Advance
 * Edition of "Klasik — Garage Garden Cafe" featuring all 4 Pillars:
 * - PILLAR 1: Crisp HiDPI Retina Canvas Scaling (`dpr`), `'Silkscreen'` + `'VT323'` + `'Press Start 2P'` Typography, `drawCrispText` 2px `#090b0e` Outline, Non-Overlapping Station Badges (`1:GRIND`..`5:TEA`, `X:CLEAR` with `L1`–`L3`), and Red Coffee Cup Favicon (`#dc2626`).
 * - PILLAR 2: Dynamic Web App Manifest (`Blob` URL), Offline-First Service Worker (`klasik-cafe-pwa-v2`), `[📲 INSTALL APP]` & `[📱 OFFLINE & APK]` Modal with 1-click `manifest.json`/`sw.js` export & PWABuilder Android `.apk` guide.
 * - PILLAR 3: Automatic Save/Restore (`localStorage` key `'klasik_cafe_save_v2'`) + `[RESET SAVE]`, 1-Tap Recipe & Profit Margin Guide (`[📖 MENU]`), `100dvh` Mobile Landscape Polish, and Haptic Feedback (`navigator.vibrate(15)`).
 * - PILLAR 4: 1.5s Boot Loader & Minimalist Title Screen, Barista Customization (`[👤 HERO]`), Strict 2D AABB Collision Physics & Smart Waypoints, Multi-Tier Equipment (`L1: 2.8s` -> `L2: 1.5s` -> `L3: 0.65s`), Staff Payroll (`$12/day`), Decor Shop, Living Customer Parties & Pets, Hand-Level Props (`x + 11, y + 2`), 20–30s Dining, and Weather-Aware Overflow (`"TAKEOUT! ☔"` in rain).
 */
export const STANDALONE_KLASIK_HTML = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />
  <title>Klasik — Garage Garden Cafe</title>
  <meta name="theme-color" content="#dc2626" />
  <meta name="apple-mobile-web-app-capable" content="yes" />
  <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
  <link rel="icon" type="image/svg+xml" href="data:image/svg+xml;utf8,%3Csvg%20 xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20viewBox%3D%220%200%20512%20512%22%20width%3D%22512%22%20height%3D%22512%22%3E%3Crect%20width%3D%22512%22%20height%3D%22512%22%20rx%3D%2296%22%20fill%3D%22%2307090e%22%2F%3E%3Crect%20x%3D%2224%22%20y%3D%2224%22%20width%3D%22464%22%20height%3D%22464%22%20rx%3D%2280%22%20fill%3D%22%23111622%22%20stroke%3D%22%23dc2626%22%20stroke-width%3D%2216%22%2F%3E%3Cg%20fill%3D%22%23f8fafc%22%20opacity%3D%220.92%22%3E%3Crect%20x%3D%22184%22%20y%3D%2256%22%20width%3D%2220%22%20height%3D%2236%22%20rx%3D%228%22%2F%3E%3Crect%20x%3D%22246%22%20y%3D%2244%22%20width%3D%2220%22%20height%3D%2248%22%20rx%3D%228%22%2F%3E%3Crect%20x%3D%22308%22%20y%3D%2256%22%20width%3D%2220%22%20height%3D%2236%22%20rx%3D%228%22%2F%3E%3C%2Fg%3E%3Crect%20x%3D%22128%22%20y%3D%22116%22%20width%3D%22256%22%20height%3D%2236%22%20rx%3D%228%22%20fill%3D%22%23f8fafc%22%20stroke%3D%22%23090b0e%22%20stroke-width%3D%2212%22%2F%3E%3Crect%20x%3D%22148%22%20y%3D%2296%22%20width%3D%22216%22%20height%3D%2224%22%20rx%3D%226%22%20fill%3D%22%23e2e8f0%22%20stroke%3D%22%23090b0e%22%20stroke-width%3D%2210%22%2F%3E%3Cpath%20d%3D%22M368%20196%20H424%20A32%2032%200%200%201%20456%20228%20V296%20A32%2032%200%200%201%20424%20328%20H360%22%20fill%3D%22none%22%20stroke%3D%22%23dc2626%22%20stroke-width%3D%2228%22%20stroke-linecap%3D%22round%22%2F%3E%3Cpath%20d%3D%22M140%20152%20H372%20L348%20428%20A24%2024%200%200%201%20324%20448%20H188%20A24%2024%200%200%201%20164%20428%20Z%22%20fill%3D%22%23dc2626%22%20stroke%3D%22%23090b0e%22%20stroke-width%3D%2214%22%2F%3E%3Cpath%20d%3D%22M148%20236%20H364%20L354%20348%20H158%20Z%22%20fill%3D%22%23f8fafc%22%20stroke%3D%22%23090b0e%22%20stroke-width%3D%2212%22%2F%3E%3Ccircle%20cx%3D%22256%22%20cy%3D%22292%22%20r%3D%2228%22%20fill%3D%22%23dc2626%22%20stroke%3D%22%23090b0e%22%20stroke-width%3D%228%22%2F%3E%3Ccircle%20cx%3D%22256%22%20cy%3D%22292%22%20r%3D%2210%22%20fill%3D%22%23facc15%22%2F%3E%3C%2Fsvg%3E" />
  <link rel="apple-touch-icon" href="data:image/svg+xml;utf8,%3Csvg%20 xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20viewBox%3D%220%200%20512%20512%22%20width%3D%22512%22%20height%3D%22512%22%3E%3Crect%20width%3D%22512%22%20height%3D%22512%22%20rx%3D%2296%22%20fill%3D%22%2307090e%22%2F%3E%3Crect%20x%3D%2224%22%20y%3D%2224%22%20width%3D%22464%22%20height%3D%22464%22%20rx%3D%2280%22%20fill%3D%22%23111622%22%20stroke%3D%22%23dc2626%22%20stroke-width%3D%2216%22%2F%3E%3Cpath%20d%3D%22M140%20152%20H372%20L348%20428%20A24%2024%200%200%201%20324%20448%20H188%20A24%2024%200%200%201%20164%20428%20Z%22%20fill%3D%22%23dc2626%22%20stroke%3D%22%23090b0e%22%20stroke-width%3D%2214%22%2F%3E%3Cpath%20d%3D%22M148%20236%20H364%20L354%20348%20H158%20Z%22%20fill%3D%22%23f8fafc%22%20stroke%3D%22%23090b0e%22%20stroke-width%3D%2212%22%2F%3E%3Ccircle%20cx%3D%22256%22%20cy%3D%22292%22%20r%3D%2228%22%20fill%3D%22%23dc2626%22%20stroke%3D%22%23090b0e%22%20stroke-width%3D%228%22%2F%3E%3C%2Fsvg%3E" />
  <link rel="preconnect" href="https://fonts.googleapis.com" />
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
  <link href="https://fonts.googleapis.com/css2?family=Press+Start+2P&family=Silkscreen:wght@400;700&family=VT323&display=swap" rel="stylesheet" />
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
      font-family: 'Silkscreen', 'Press Start 2P', monospace;
      cursor: pointer;
    }
    .gba-btn:hover { background: #2a3246; border-color: #ffffff; }
    .gba-btn:active { transform: translate(1px, 1px); }
    .gba-btn-active {
      background: #facc15 !important; color: #090b10 !important;
      border-color: #ffffff !important;
      box-shadow: inset -2px -2px 0 0 #ca8a04, 2px 2px 0 0 #05070a !important;
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
    canvas#game {
      width: 100%; height: 100%; object-fit: contain;
      image-rendering: pixelated; cursor: pointer;
      border: 3px solid #334155;
    }
    #quick-bar {
      position: absolute; bottom: 8px; right: 10px; z-index: 10;
      display: flex; flex-wrap: wrap; gap: 5px; justify-content: flex-end;
    }
    .overlay {
      position: fixed; inset: 0; background: rgba(9, 11, 16, 0.88);
      display: flex; align-items: center; justify-content: center; z-index: 30; padding: 12px;
    }
    .modal { max-width: 680px; width: 100%; padding: 16px; max-height: 94dvh; overflow-y: auto; }
    .goal-track {
      width: 64px; height: 9px; background: #090b10; border: 2px solid #475569;
      padding: 1px; overflow: hidden;
    }
    .goal-fill { height: 100%; background: #22c55e; width: 0%; transition: width 0.2s ease; }

    @media (max-height: 540px) {
      header { padding: 2px 6px !important; border-bottom-width: 2px !important; gap: 4px !important; flex-wrap: nowrap !important; }
      header .gba-frame { padding: 2px 6px !important; border-width: 2px !important; box-shadow: none !important; }
      header .gba-btn { height: 20px !important; padding: 0 5px !important; font-size: 8px !important; border-width: 1px !important; box-shadow: none !important; }
      #quick-bar button { padding: 3px 6px !important; font-size: 8px !important; border-width: 1.5px !important; }
      .modal { padding: 10px !important; }
    }
    @keyframes klasik-flame-pulse {
      0% { transform: scale(1); filter: drop-shadow(0 0 0 rgba(251,146,60,0)); }
      25% { transform: scale(1.42) translateY(-1px); filter: drop-shadow(0 0 6px rgba(251,146,60,0.95)); }
      50% { transform: scale(1.12); filter: drop-shadow(0 0 3px rgba(249,115,22,0.7)); }
      75% { transform: scale(1.36) translateY(-1px); filter: drop-shadow(0 0 6px rgba(250,204,21,0.9)); }
      100% { transform: scale(1); filter: drop-shadow(0 0 0 rgba(251,146,60,0)); }
    }
    .klasik-flame-pulse {
      display: inline-block;
      transform-origin: center;
      animation: klasik-flame-pulse 0.75s cubic-bezier(0.22, 1, 0.36, 1) 3;
    }
  </style>
</head>
<body data-state="title">
  <main>
    <header id="top-hud" style="display:none;">
      <div class="gba-frame" style="padding: 3px 7px; display: flex; align-items: center; gap: 7px; flex-wrap: wrap;">
        <span id="clock-txt" style="font-family:'Silkscreen',monospace; font-size:9px; color:#7dd3fc;">🕒 12:00 PM</span>
        <span id="barista-tag" style="font-family:'Silkscreen',monospace; font-size:9px; color:#fde047;">👤 KLASIK</span>
        <span style="font-family:'Silkscreen',monospace; font-size:9px;">COZY <strong id="cozy-val">82%</strong></span>
        <span style="font-family:'Silkscreen',monospace; font-size:9px; color:#facc15;">$ <strong id="coins-val">45</strong></span>
        <span style="font-family:'Silkscreen',monospace; font-size:9px; color:#4ade80;">STK <strong id="stock-val">12</strong></span>
        <span id="streak-badge" style="font-family:'Silkscreen',monospace; font-size:9px; color:#fdba74;"><span id="streak-flame" style="display:inline-block;">🔥</span> <strong id="streak-val">0</strong></span>
        <div style="display:flex; align-items:center; gap:5px;">
          <div class="goal-track"><div id="goal-fill" class="goal-fill"></div></div>
          <span id="served-val" style="font-family:'Silkscreen',monospace; font-size:9px;">0/6</span>
          <button class="gba-btn gba-btn-active" id="finish-shift-btn" style="display:none; padding:2px 5px; font-size:8px;">FINISH ★</button>
        </div>
      </div>

      <div class="gba-dialogue" style="padding: 3px 8px; flex: 1; max-width: 340px; min-width: 150px;">
        <div style="display:flex; justify-content:space-between; font-family:'Silkscreen',monospace; font-size:8px;">
          <span id="order-title">KLASIK'S BAR</span>
          <span id="step-badge" style="background:#0f172a; color:#facc15; padding:1px 4px;">STEP 0/3</span>
        </div>
        <div id="log-msg" style="font-size:17px; white-space:nowrap; overflow:hidden; text-overflow:ellipsis;">
          Tap ⚡ BREW / SERVE or any station to craft drinks!
        </div>
      </div>

      <div class="gba-frame" style="padding: 3px 6px; display: flex; gap: 4px; flex-wrap: wrap;">
        <button class="gba-btn" id="hud-cust-btn" style="padding: 3px 6px; font-size:9px; color:#fde047;">👤 HERO</button>
        <button class="gba-btn" id="hud-menu-btn" style="padding: 3px 6px; font-size:9px; color:#fef08a;">📖 MENU</button>
        <button class="gba-btn" id="hud-biz-btn" style="padding: 3px 6px; font-size:9px; color:#4ade80;">📊 BIZ &amp; SHOP</button>
        <button class="gba-btn" id="hud-pwa-btn" style="padding: 3px 6px; font-size:9px; color:#fca5a5;">📲 APP / APK</button>
        <button class="gba-btn" id="room-btn" style="padding: 3px 6px; font-size:9px; color:#7dd3fc;">🚪 INSIDE</button>
        <button class="gba-btn" id="weather-btn" style="padding: 3px 6px; font-size:9px; color:#86efac;">⛅ CLEAR</button>
        <button class="gba-btn" id="hire-btn" style="padding: 3px 6px; font-size:9px; color:#fb7185;">👩‍🍳 HIRE STAFF (0/2) · $35</button>
      </div>
    </header>

    <div id="stage">
      <canvas id="game" width="900" height="480"></canvas>
      <div id="quick-bar" style="display:none;">
        <button class="gba-btn gba-btn-active" id="q-smart" style="padding: 5px 8px; font-size:9px;">⚡ BREW / SERVE</button>
        <button class="gba-btn" id="q-hire" style="padding: 5px 7px; font-size:9px; color:#fb7185;">👩‍🍳 HIRE STAFF (0/2) $35</button>
        <button class="gba-btn" id="q-water" style="padding: 5px 7px; font-size:9px; color:#7dd3fc;">💧 WATER</button>
        <button class="gba-btn" id="q-biz" style="padding: 5px 7px; font-size:9px; color:#4ade80;">📊 BIZ &amp; SHOP</button>
        <button class="gba-btn" id="q-cat" style="padding: 5px 7px; font-size:9px; color:#fb7185;">🐾 CATS</button>
        <button class="gba-btn" id="q-room" style="padding: 5px 7px; font-size:9px; color:#facc15;">🚪 GARDEN</button>
      </div>
    </div>
  </main>

  <!-- 1. PRE-TITLE GBA BOOT / LOADING SCREEN (1.5 SECONDS) -->
  <div class="overlay" id="boot-overlay" style="background:#090b0e; z-index:50;">
    <div class="gba-frame" style="max-width:300px; width:100%; padding:20px; text-align:center; display:flex; flex-direction:column; align-items:center; gap:12px;">
      <div style="font-family:'Silkscreen',monospace; font-size:9px; color:#94a3b8;">GBA CARTRIDGE BOOT</div>
      <svg viewBox="0 0 80 68" style="width:72px; height:60px;">
        <rect x="14" y="56" width="52" height="6" fill="#f8fafc" stroke="#090b0e" stroke-width="2" />
        <rect x="20" y="24" width="36" height="32" fill="#dc2626" stroke="#f8fafc" stroke-width="3" />
        <rect x="56" y="30" width="10" height="18" fill="none" stroke="#f8fafc" stroke-width="3" />
        <rect id="boot-cup-fill" x="23" y="53" width="30" height="0" fill="#451a03" />
        <rect id="boot-cup-crema" x="23" y="53" width="30" height="0" fill="#facc15" />
      </svg>
      <div style="width:100%;">
        <div style="display:flex; justify-content:space-between; font-family:'Silkscreen',monospace; font-size:9px; color:#facc15; margin-bottom:4px;">
          <span>BREWING ROM...</span>
          <span id="boot-pct">0%</span>
        </div>
        <div style="width:100%; height:14px; background:#090b0e; border:2px solid #f8fafc; padding:2px;">
          <div id="boot-bar" style="width:0%; height:100%; background:#facc15;"></div>
        </div>
      </div>
      <div style="padding-top:4px; display:flex; justify-content:center; width:100%;">
        <svg viewBox="0 0 644 188" fill="none" xmlns="http://www.w3.org/2000/svg" style="height:36px; width:auto;">
          <rect width="644" height="188" rx="25" fill="#242B2E"/>
          <text x="322" y="110" text-anchor="middle" fill="#ffffff" font-family="Press Start 2P, monospace" font-size="38">BOOSTED BY CAFE</text>
        </svg>
      </div>
    </div>
  </div>

  <!-- 2. MINIMALIST LANDSCAPE-SAFE TITLE SCREEN -->
  <div class="overlay" id="title-overlay" style="display:none;">
    <div class="gba-frame modal" style="max-width:440px; text-align:center; display:flex; flex-direction:column; align-items:center; gap:14px;">
      <h1 style="font-family:'Press Start 2P',monospace; font-size:28px; color:#f8fafc; letter-spacing:2px;">KLASIK</h1>
      <p style="font-family:'Silkscreen',monospace; font-size:12px; color:#facc15;">Garage Garden Cafe</p>
      <div style="display:flex; gap:8px; flex-wrap:wrap; justify-content:center;">
        <button class="gba-btn gba-btn-active" id="start-btn" style="padding:10px 14px; font-size:10px;">► START SHIFT</button>
        <button class="gba-btn" id="title-cust-btn" style="padding:10px 12px; font-size:10px; color:#7dd3fc;">👤 CUSTOMIZE</button>
        <button class="gba-btn" id="title-pwa-btn" style="padding:10px 12px; font-size:10px; color:#fca5a5;">📲 INSTALL APP</button>
      </div>
      <!-- STUDIO LOGO SLOT: Swap your exact inline SVG inside this #studio-logo-slot container -->
      <div id="studio-logo-slot" style="padding-top:10px; border-top:2px solid #262f40; width:100%; display:flex; justify-content:center;">
        <svg viewBox="0 0 644 188" fill="none" xmlns="http://www.w3.org/2000/svg" style="height:42px; width:auto;">
          <rect width="644" height="188" rx="25" fill="#242B2E"/>
          <text x="322" y="110" text-anchor="middle" fill="#ffffff" font-family="Press Start 2P, monospace" font-size="38">BOOSTED BY CAFE</text>
        </svg>
      </div>
    </div>
  </div>

  <!-- 3. [👤 HERO] CUSTOMIZE BARISTA MODAL -->
  <div class="overlay" id="cust-modal" style="display:none; z-index:40;">
    <div class="gba-frame modal" style="max-width:460px;">
      <div style="display:flex; justify-content:space-between; align-items:center; border-bottom:2px solid #334155; padding-bottom:8px; margin-bottom:10px;">
        <span style="font-family:'Silkscreen',monospace; font-size:11px; color:#facc15;">👤 CUSTOMIZE BARISTA</span>
        <span id="cust-streak-pill" style="font-family:'Silkscreen',monospace; font-size:9px; color:#fdba74;">🔥 STREAK 0</span>
        <button class="gba-btn" id="close-cust-btn" style="padding:4px 8px; font-size:9px;">✕ ESC</button>
      </div>
      <div style="display:flex; gap:14px; align-items:center; flex-wrap:wrap;">
        <canvas id="preview-canvas" width="96" height="96" style="width:96px; height:96px; border:2px solid #facc15; background:#0f172a;"></canvas>
        <div style="flex:1; min-width:200px; display:flex; flex-direction:column; gap:8px;">
          <div>
            <label style="font-family:'Silkscreen',monospace; font-size:8px; color:#94a3b8; display:block; margin-bottom:4px;">BARISTA NAMETAG</label>
            <input id="cust-name-input" type="text" maxlength="12" value="Klasik" style="width:100%; background:#090b0e; border:2px solid #cbd5e1; color:#f8fafc; padding:6px; font-family:'Silkscreen',monospace; font-size:10px;" />
          </div>
          <button class="gba-btn" id="cycle-hair-btn" style="padding:6px; font-size:9px; text-align:left;">HAIR: Espresso Black ►</button>
          <button class="gba-btn" id="cycle-skin-btn" style="padding:6px; font-size:9px; text-align:left;">SKIN: Golden Sand ►</button>
          <button class="gba-btn" id="cycle-outfit-btn" style="padding:6px; font-size:9px; text-align:left;">APRON: Classic White ►</button>
        </div>
      </div>
      <div style="margin-top:12px; display:flex; justify-content:flex-end;">
        <button class="gba-btn gba-btn-active" id="save-cust-btn" style="padding:8px 14px; font-size:9px;">✓ SAVE BARISTA</button>
      </div>
    </div>
  </div>

  <!-- 4. [📖 MENU] 1-TAP RECIPE & PROFIT MARGIN GUIDE MODAL -->
  <div class="overlay" id="menu-modal" style="display:none; z-index:40;">
    <div class="gba-frame modal" style="max-width:560px;">
      <div style="display:flex; justify-content:space-between; align-items:center; border-bottom:2px solid #334155; padding-bottom:8px; margin-bottom:10px;">
        <span style="font-family:'Silkscreen',monospace; font-size:11px; color:#facc15;">📖 CAFE RECIPE &amp; PROFIT MARGIN GUIDE</span>
        <button class="gba-btn" id="close-menu-btn" style="padding:4px 8px; font-size:9px;">✕ ESC</button>
      </div>
      <div id="menu-recipes-list" style="display:grid; grid-template-columns:1fr 1fr; gap:8px;"></div>
    </div>
  </div>

  <!-- 5. [📱 OFFLINE & APK] PWA & ANDROID APK EXPORT MODAL -->
  <div class="overlay" id="pwa-modal" style="display:none; z-index:40;">
    <div class="gba-frame modal" style="max-width:560px;">
      <div style="display:flex; justify-content:space-between; align-items:center; border-bottom:2px solid #334155; padding-bottom:8px; margin-bottom:10px;">
        <span style="font-family:'Silkscreen',monospace; font-size:11px; color:#fca5a5;">📱 OFFLINE PWA &amp; ANDROID .APK</span>
        <button class="gba-btn" id="close-pwa-btn" style="padding:4px 8px; font-size:9px;">✕ ESC</button>
      </div>
      <div style="background:#090b0e; border:2px solid #334155; padding:10px; margin-bottom:10px; display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:8px;">
        <div>
          <div style="font-family:'Silkscreen',monospace; font-size:9px; color:#4ade80;" id="pwa-status-txt">✓ OFFLINE CACHE READY (klasik-cafe-pwa-v2)</div>
          <div style="font-size:17px; color:#cbd5e1;">Standalone Fullscreen Landscape Mode + Red Coffee Cup Icon</div>
        </div>
        <button class="gba-btn gba-btn-active" id="pwa-install-now-btn" style="padding:7px 12px; font-size:9px;">📲 INSTALL APP</button>
      </div>
      <div style="display:flex; gap:8px; margin-bottom:10px; flex-wrap:wrap;">
        <button class="gba-btn" id="dl-manifest-btn" style="padding:7px 10px; font-size:9px; color:#7dd3fc;">⬇ DOWNLOAD manifest.json</button>
        <button class="gba-btn" id="dl-sw-btn" style="padding:7px 10px; font-size:9px; color:#86efac;">⬇ DOWNLOAD sw.js</button>
      </div>
      <div style="background:#0f172a; border:2px solid #475569; padding:10px; font-size:17px; color:#e2e8f0; line-height:1.35;">
        <div style="font-family:'Silkscreen',monospace; font-size:9px; color:#facc15; margin-bottom:4px;">HOW TO BUILD A SIGNED ANDROID .APK IN 60 SECONDS:</div>
        1. Host this single-file HTML alongside <code>manifest.json</code> and <code>sw.js</code> on GitHub Pages, Netlify, or Vercel.<br/>
        2. Open <strong>pwabuilder.com</strong>, paste your live URL, and click <strong>Package for Store → Android (TWA)</strong> to download your signed <code>.apk</code>!
      </div>
    </div>
  </div>

  <!-- 6. [📊 BIZ & SHOP] MODAL (P&L + PAYROLL + STAFF + L1->L3 MACHINES + DECOR SHOP + RESET SAVE) -->
  <div class="overlay" id="biz-modal" style="display:none; z-index:40;">
    <div class="gba-frame modal">
      <div style="display:flex; justify-content:space-between; align-items:center; border-bottom:2px solid #334155; padding-bottom:8px; margin-bottom:10px; flex-wrap:wrap; gap:6px;">
        <span style="font-family:'Silkscreen',monospace; font-size:10px; color:#facc15;">📊 BIZ LEDGER, STAFF PAYROLL &amp; SHOP</span>
        <div style="display:flex; gap:6px;">
          <button class="gba-btn" id="reset-save-btn" style="padding:4px 8px; font-size:8px; color:#fca5a5; border-color:#ef4444;">RESET SAVE</button>
          <button class="gba-btn" id="close-biz-btn" style="padding:4px 8px; font-size:9px;">✕ ESC</button>
        </div>
      </div>
      <div style="display:grid; grid-template-columns:repeat(5,1fr); gap:5px; text-align:center; margin-bottom:10px;">
        <div style="background:#090b0e; border:2px solid #334155; padding:5px;">
          <div style="font-family:'Silkscreen',monospace; font-size:8px; color:#94a3b8;">REVENUE</div>
          <div id="pnl-rev" style="font-family:'Silkscreen',monospace; font-size:10px; color:#4ade80; margin-top:4px;">$0.00</div>
        </div>
        <div style="background:#090b0e; border:2px solid #334155; padding:5px;">
          <div style="font-family:'Silkscreen',monospace; font-size:8px; color:#94a3b8;">COGS</div>
          <div id="pnl-cogs" style="font-family:'Silkscreen',monospace; font-size:10px; color:#fb7185; margin-top:4px;">$0.00</div>
        </div>
        <div style="background:#090b0e; border:2px solid #334155; padding:5px;">
          <div style="font-family:'Silkscreen',monospace; font-size:8px; color:#94a3b8;">PAYROLL</div>
          <div id="pnl-payroll" style="font-family:'Silkscreen',monospace; font-size:10px; color:#f97316; margin-top:4px;">$0.00</div>
        </div>
        <div style="background:#090b0e; border:2px solid #334155; padding:5px;">
          <div style="font-family:'Silkscreen',monospace; font-size:8px; color:#94a3b8;">NET PROFIT</div>
          <div id="pnl-net" style="font-family:'Silkscreen',monospace; font-size:10px; color:#facc15; margin-top:4px;">$0.00</div>
        </div>
        <div style="background:#090b0e; border:2px solid #334155; padding:5px;">
          <div style="font-family:'Silkscreen',monospace; font-size:8px; color:#94a3b8;">MARGIN</div>
          <div id="pnl-margin" style="font-family:'Silkscreen',monospace; font-size:10px; color:#7dd3fc; margin-top:4px;">0%</div>
        </div>
      </div>
      <div style="background:#0f172a; border:2px solid #38bdf8; padding:8px; display:flex; justify-content:space-between; align-items:center; margin-bottom:10px; flex-wrap:wrap; gap:6px;">
        <div>
          <div style="font-family:'Silkscreen',monospace; font-size:9px; color:#7dd3fc;">INGREDIENT STOCK: <span id="biz-stock-cnt" style="color:#4ade80;">12</span> UNITS</div>
          <div style="font-size:16px; color:#cbd5e1;">Wholesale: $2.00 COGS/cup vs $4.00 Emergency COGS/cup</div>
        </div>
        <button class="gba-btn gba-btn-active" id="restock-btn" style="padding:7px 10px; font-size:9px;">+10 WHOLESALE STOCK ($20)</button>
      </div>

      <div style="font-family:'Silkscreen',monospace; font-size:9px; color:#fde047; margin-bottom:6px;">👩‍🍳 HIRE STAFF ($12/SHIFT PAYROLL)</div>
      <div id="staff-list" style="display:grid; grid-template-columns:1fr 1fr; gap:6px; margin-bottom:10px;"></div>

      <div style="font-family:'Silkscreen',monospace; font-size:9px; color:#7dd3fc; margin-bottom:6px;">⚙️ BAR STATIONS (L1: 2.8s → L2: 1.5s → L3: 0.65s)</div>
      <div id="machines-list" style="display:grid; grid-template-columns:repeat(3,1fr); gap:6px; margin-bottom:10px;"></div>

      <div style="font-family:'Silkscreen',monospace; font-size:9px; color:#86efac; margin-bottom:6px;">🎨 INTERIOR &amp; GARDEN DECOR SHOP (6)</div>
      <div id="decor-list" style="display:grid; grid-template-columns:1fr 1fr; gap:6px; margin-bottom:10px;"></div>

      <div style="font-family:'Silkscreen',monospace; font-size:9px; color:#94a3b8; margin-bottom:6px;">📈 CAPITAL CONTRACTS (4)</div>
      <div id="upgrades-list" style="display:grid; grid-template-columns:1fr 1fr; gap:6px;"></div>
    </div>
  </div>

  <script>
    const canvas = document.getElementById('game');
    const ctx = canvas.getContext('2d');
    const prevCanvas = document.getElementById('preview-canvas');
    const prevCtx = prevCanvas.getContext('2d');

    // PILLAR 1: Crisp Outlined Pixel Text Helper (2px #090b0e outline before fillText)
    function drawCrispText(c, text, x, y, size = 9, color = '#f8fafc', align = 'center') {
      c.save();
      c.font = '700 ' + size + 'px "Silkscreen", "Press Start 2P", monospace';
      c.textAlign = align;
      c.lineJoin = 'round';
      c.lineWidth = 3;
      c.strokeStyle = '#090b0e';
      c.strokeText(text, Math.round(x), Math.round(y));
      c.fillStyle = color;
      c.fillText(text, Math.round(x), Math.round(y));
      c.restore();
    }

    // PILLAR 3: Subtle Haptic Feedback
    function triggerHaptic(ms = 15) {
      try { if (navigator && typeof navigator.vibrate === 'function') navigator.vibrate(ms); } catch {}
    }

    // PILLAR 2: Inline Web App Manifest Blob & Service Worker
    const RED_CUP_SVG = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" width="512" height="512"><rect width="512" height="512" rx="96" fill="#07090e"/><rect x="24" y="24" width="464" height="464" rx="80" fill="#111622" stroke="#dc2626" stroke-width="16"/><path d="M140 152 H372 L348 428 A24 24 0 0 1 324 448 H188 A24 24 0 0 1 164 428 Z" fill="#dc2626" stroke="#090b0e" stroke-width="14"/><path d="M148 236 H364 L354 348 H158 Z" fill="#f8fafc" stroke="#090b0e" stroke-width="12"/><circle cx="256" cy="292" r="28" fill="#dc2626" stroke="#090b0e" stroke-width="8"/></svg>';
    const MANIFEST_OBJ = {
      name: 'Klasik — Garage Garden Cafe',
      short_name: 'Klasik Cafe',
      display: 'standalone',
      orientation: 'landscape',
      background_color: '#07090e',
      theme_color: '#dc2626',
      start_url: './',
      icons: [{ src: 'data:image/svg+xml;utf8,' + encodeURIComponent(RED_CUP_SVG), sizes: '512x512', type: 'image/svg+xml', purpose: 'any maskable' }]
    };
    const SW_SOURCE = "const CACHE='klasik-cafe-pwa-v2';self.addEventListener('install',e=>{self.skipWaiting();e.waitUntil(caches.open(CACHE).then(c=>c.addAll(['./'])))});self.addEventListener('activate',e=>e.waitUntil(self.clients.claim()));self.addEventListener('fetch',e=>e.respondWith(caches.match(e.request).then(r=>r||fetch(e.request))));";
    try {
      const mBlob = new Blob([JSON.stringify(MANIFEST_OBJ, null, 2)], { type: 'application/manifest+json' });
      const mLink = document.createElement('link');
      mLink.rel = 'manifest';
      mLink.href = URL.createObjectURL(mBlob);
      document.head.appendChild(mLink);
    } catch {}

    let deferredInstallPrompt = null;
    window.addEventListener('beforeinstallprompt', (e) => {
      e.preventDefault();
      deferredInstallPrompt = e;
    });

    function downloadFile(filename, content, mime) {
      const blob = new Blob([content], { type: mime });
      const a = document.createElement('a');
      a.href = URL.createObjectURL(blob);
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    }

    const HAIR_COLORS = [
      { label: 'Espresso Black', main: '#18181b' },
      { label: 'Chestnut Roast', main: '#7c2d12' },
      { label: 'Honey Blonde', main: '#ca8a04' },
      { label: 'Miata Red', main: '#991b1b' },
      { label: 'Silver Ash', main: '#64748b' }
    ];
    const SKIN_TONES = [
      { label: 'Warm Ivory', hex: '#ffedd5' },
      { label: 'Golden Sand', hex: '#fde68a' },
      { label: 'Caramel Tan', hex: '#d97706' },
      { label: 'Deep Espresso', hex: '#78350f' }
    ];
    const OUTFITS = [
      { id: 'monochrome_slate', label: 'Monochrome Slate', apron: '#94a3b8', shirt: '#334155', unlockStreak: 0 },
      { id: 'classic_white', label: 'Classic White', apron: '#f8fafc', shirt: '#1e293b', unlockStreak: 0 },
      { id: 'miata_red', label: 'Miata Red', apron: '#ef4444', shirt: '#18181b', unlockStreak: 0 },
      { id: 'daisy_gold', label: 'Daisy Gold', apron: '#facc15', shirt: '#422006', unlockStreak: 0 },
      { id: 'matcha_green', label: 'Matcha Green', apron: '#10b981', shirt: '#064e3b', unlockStreak: 0 },
      { id: 'vintage_sepia', label: "Vintage Sepia '78", apron: '#e7d3b0', shirt: '#451a03', unlockStreak: 1, isVintage: true },
      { id: 'vintage_olive', label: 'Vintage Garage Olive', apron: '#6b7f5e', shirt: '#27272a', unlockStreak: 2, isVintage: true },
      { id: 'vintage_burgundy', label: "Vintage '90s Burgundy", apron: '#881337', shirt: '#1c1917', unlockStreak: 3, isVintage: true }
    ];

    const STATIONS_META = [
      { id: 'grinder', badge: '1:GRIND', name: 'Bean Grinder', x: 108, y: 144, lvl2Cost: 35, lvl3Cost: 75 },
      { id: 'espresso', badge: '2:SHOT', name: 'Espresso Machine', x: 212, y: 144, lvl2Cost: 45, lvl3Cost: 90 },
      { id: 'milk_frother', badge: '3:FOAM', name: 'Steam Frother', x: 316, y: 144, lvl2Cost: 40, lvl3Cost: 80 },
      { id: 'kettle', badge: '4:BOIL', name: 'Copper Kettle', x: 416, y: 144, lvl2Cost: 35, lvl3Cost: 70 },
      { id: 'tea_leaves', badge: '5:TEA', name: 'Tea Station', x: 512, y: 144, lvl2Cost: 35, lvl3Cost: 70 }
    ];
    const TIER_TIMES = { 1: 2.8, 2: 1.5, 3: 0.65 };

    const DECOR_ITEMS = [
      { id: 'checkered_marble_floor', name: 'Checkered Marble Floor', zone: 'inside', cost: 40 },
      { id: 'vinyl_turntable_neon', name: 'Vinyl Turntable & Neon Sign', zone: 'inside', cost: 50 },
      { id: 'garage_lift_underglow', name: 'Hydraulic Lift & Underglow', zone: 'inside', cost: 65 },
      { id: 'fairy_string_lanterns', name: 'Fairy String Lanterns', zone: 'garden', cost: 40 },
      { id: 'stone_koi_fountain', name: 'Stone Koi Fountain', zone: 'garden', cost: 55 },
      { id: 'daisy_trellis_archways', name: 'Blooming Daisy Trellis', zone: 'garden', cost: 50 }
    ];

    const UPGRADES = [
      { id: 'direct_trade_beans', name: 'Direct-Trade Bean Contract', cost: 45, desc: '-$1.50 COGS per drink' },
      { id: 'dual_boiler', name: 'Dual-Boiler Espresso', cost: 60, desc: '+40% Brewing Speed' },
      { id: 'custom_sleeves', name: 'Custom Klasik Cup Sleeves', cost: 55, desc: '+$4 Drink Selling Price' },
      { id: 'miata_merch_stand', name: '1990 Miata Merch Stand', cost: 70, desc: '+$5 Extra Photo Tip Jar' }
    ];

    const RECIPES = {
      midnight_cold_brew: { name: 'Midnight Cold Brew', short: 'Cold Brew', price: 14, color: '#18181b', steps: ['grinder', 'espresso', 'cup_counter'], stepLabels: ['1:GRIND', '2:SHOT', 'SPACE:CUP'] },
      daisy_vanilla_latte: { name: 'Daisy Vanilla Latte', short: 'Daisy Latte', price: 16, color: '#d6a87c', steps: ['grinder', 'milk_frother', 'cup_counter'], stepLabels: ['1:GRIND', '3:FOAM', 'SPACE:CUP'] },
      miata_mocha: { name: '1990 Miata Mocha', short: 'Miata Mocha', price: 18, color: '#dc2626', steps: ['grinder', 'espresso', 'cup_counter'], stepLabels: ['1:GRIND', '2:SHOT', 'SPACE:CUP'] },
      catnip_herbal_tea: { name: 'Catnip Herbal Tea', short: 'Catnip Tea', price: 15, color: '#10b981', steps: ['kettle', 'tea_leaves', 'cup_counter'], stepLabels: ['4:BOIL', '5:TEA', 'SPACE:CUP'] }
    };

    const INDOOR_SEATS = [
      { idx: 0, room: 'inside', x: 132, y: 368 },
      { idx: 1, room: 'inside', x: 244, y: 392 },
      { idx: 2, room: 'inside', x: 504, y: 368 },
      { idx: 3, room: 'inside', x: 648, y: 332 }
    ];
    const GARDEN_SEATS = [
      { idx: 4, room: 'garden', x: 268, y: 214 },
      { idx: 5, room: 'garden', x: 632, y: 214 },
      { idx: 6, room: 'garden', x: 268, y: 352 },
      { idx: 7, room: 'garden', x: 632, y: 352 }
    ];

    const COLLIDERS = {
      inside: [
        { x: 0, y: 0, w: 900, h: 124 },
        { x: 64, y: 112, w: 482, h: 66 },
        { x: 68, y: 212, w: 360, h: 64 },
        { x: 580, y: 20, w: 14, h: 168 },
        { x: 580, y: 276, w: 14, h: 184 },
        { x: 740, y: 126, w: 92, h: 156 },
        { x: 118, y: 348, w: 80, h: 36 },
        { x: 230, y: 372, w: 80, h: 36 },
        { x: 490, y: 348, w: 80, h: 36 },
        { x: 634, y: 312, w: 74, h: 34 }
      ],
      garden: [
        { x: 0, y: 0, w: 900, h: 108 },
        { x: 414, y: 228, w: 72, h: 52 },
        { x: 60, y: 150, w: 100, h: 52 },
        { x: 740, y: 150, w: 100, h: 52 },
        { x: 60, y: 278, w: 100, h: 52 },
        { x: 740, y: 278, w: 100, h: 52 }
      ]
    };

    function hitsCollider(x, y, room, r = 10) {
      if (x - r < 28 || x + r > 872 || y - r < 114 || y + r > 454) return true;
      const list = COLLIDERS[room] || [];
      for (let i = 0; i < list.length; i++) {
        const b = list[i];
        if (x + r > b.x && x - r < b.x + b.w && y + r > b.y && y - r < b.y + b.h) return true;
      }
      return false;
    }

    function moveEntityWithCollisions(x, y, dx, dy, room, r = 10) {
      let nx = x, ny = y;
      if (dx !== 0 && !hitsCollider(nx + dx, ny, room, r)) nx += dx;
      if (dy !== 0 && !hitsCollider(nx, ny + dy, room, r)) ny += dy;
      return { x: nx, y: ny };
    }

    function buildWaypoints(x, y, tx, ty, room) {
      const wps = [];
      if (room === 'inside') {
        const inBar = y < 214 && x < 556;
        const targetInBar = ty < 214 && tx < 556;
        if (inBar && !targetInBar) {
          wps.push({ x: 472, y: 192 }, { x: 472, y: 294 });
        } else if (!inBar && targetInBar) {
          wps.push({ x: 472, y: 294 }, { x: 472, y: 192 });
        }
        const inGarage = x > 594;
        const targetGarage = tx > 594;
        if (inGarage !== targetGarage) {
          wps.push({ x: inGarage ? 618 : 552, y: 232 }, { x: targetGarage ? 618 : 552, y: 232 });
        }
      }
      wps.push({ x: tx, y: ty });
      return wps;
    }

    function stepAlongWaypoints(x, y, tx, ty, maxStep, room, r = 10) {
      const wps = buildWaypoints(x, y, tx, ty, room);
      const wp = wps[0] || { x: tx, y: ty };
      const dx = wp.x - x, dy = wp.y - y;
      const dist = Math.hypot(dx, dy);
      if (dist <= 1.5) return { x, y };
      const step = Math.min(dist, maxStep);
      return moveEntityWithCollisions(x, y, (dx / dist) * step, (dy / dist) * step, room, r);
    }

    const SAVE_KEY = 'klasik_cafe_save_v2';
    const state = {
      mode: 'boot', room: 'inside',
      timeOfDay: 'day', weather: 'clear',
      cozy: 85, hearts: 3, coins: 45, served: 0, target: 6, dailyStreak: 0,
      miataColor: '#dc2626', miataHeadlights: true,
      step: 0, processTimer: 0, activeStation: null,
      appearance: { name: 'Klasik', hairIdx: 0, skinIdx: 1, outfitIdx: 1 },
      stationLevels: { grinder: 1, espresso: 1, milk_frother: 1, kettle: 1, tea_leaves: 1 },
      decorOwned: {
        checkered_marble_floor: false, vinyl_turntable_neon: false, garage_lift_underglow: false,
        fairy_string_lanterns: false, stone_koi_fountain: false, daisy_trellis_archways: false
      },
      decorEquipped: {
        checkered_marble_floor: false, vinyl_turntable_neon: false, garage_lift_underglow: false,
        fairy_string_lanterns: false, stone_koi_fountain: false, daisy_trellis_archways: false
      },
      staff: [
        { id: 'momo', name: 'Momo', role: 'Sous-Barista', hireCost: 35, salary: 12, hired: false, room: 'inside', x: 212, y: 192, tx: 212, ty: 192 },
        { id: 'ken', name: 'Ken', role: 'Floor/Garden Server', hireCost: 45, salary: 12, hired: false, room: 'inside', x: 468, y: 292, tx: 468, ty: 292 }
      ],
      finance: {
        grossRevenue: 0, totalCogs: 0, payrollExpense: 0, netProfit: 0, marginPct: 0, stock: 12,
        upgrades: { direct_trade_beans: false, dual_boiler: false, custom_sleeves: false, miata_merch_stand: false }
      },
      barista: { x: 296, y: 192, tx: 296, ty: 192, carrying: null },
      customers: [],
      daisies: [
        { x: 110, y: 176, h: 75 }, { x: 790, y: 176, h: 90 },
        { x: 110, y: 304, h: 65 }, { x: 790, y: 304, h: 85 },
        { x: 204, y: 424, h: 70 }, { x: 696, y: 424, h: 95 }
      ]
    };

    function saveProgressV2() {
      try {
        localStorage.setItem(SAVE_KEY, JSON.stringify({
          coins: state.coins,
          hearts: state.hearts,
          dailyStreak: state.dailyStreak,
          miataColor: state.miataColor,
          appearance: state.appearance,
          stationLevels: state.stationLevels,
          decorOwned: state.decorOwned,
          decorEquipped: state.decorEquipped,
          finance: state.finance,
          hiredIds: state.staff.filter(s => s.hired).map(s => s.id)
        }));
      } catch {}
    }

    function loadProgressV2() {
      try {
        const raw = localStorage.getItem(SAVE_KEY);
        if (!raw) return;
        const p = JSON.parse(raw);
        if (typeof p.coins === 'number') state.coins = p.coins;
        if (typeof p.hearts === 'number') state.hearts = p.hearts;
        if (typeof p.dailyStreak === 'number') state.dailyStreak = p.dailyStreak;
        if (typeof p.miataColor === 'string') state.miataColor = p.miataColor;
        if (p.appearance) Object.assign(state.appearance, p.appearance);
        if (p.stationLevels) Object.assign(state.stationLevels, p.stationLevels);
        if (p.decorOwned) Object.assign(state.decorOwned, p.decorOwned);
        if (p.decorEquipped) Object.assign(state.decorEquipped, p.decorEquipped);
        if (p.finance) Object.assign(state.finance, p.finance);
        if (Array.isArray(p.hiredIds)) {
          state.staff.forEach(s => { s.hired = p.hiredIds.includes(s.id); });
        }
      } catch {}
    }
    loadProgressV2();

    let partySeq = 1;
    function spawnCustomerParty(slotIdx) {
      const keys = Object.keys(RECIPES);
      const names = ['Flora','Takumi','Milo','Clara','Keisuke','Hazel','Suki','Oliver'];
      const order = keys[(partySeq - 1) % keys.length];
      const partyTypes = ['couple', 'solo', 'friends', 'family'];
      const pType = partyTypes[(partySeq - 1) % partyTypes.length];
      const hasPet = partySeq % 2 === 1;
      const petKinds = ['dog', 'cat', 'rabbit'];
      const sx = slotIdx === 0 ? 324 : 416;
      const sy = slotIdx === 0 ? 308 : 320;
      const c = {
        id: partySeq,
        name: names[(partySeq - 1) % names.length],
        order,
        partyType: pType,
        hasChild: pType === 'family',
        hasCompanion: pType !== 'solo',
        pet: hasPet ? { kind: petKinds[partySeq % 3], x: sx + 18, y: 468 } : null,
        room: 'inside',
        state: 'waiting',
        x: sx, y: sy, tx: sx, ty: sy,
        seatIdx: null, sipTimer: 0, isTakeout: false,
        quote: 'One ' + RECIPES[order].short + '!'
      };
      partySeq++;
      return c;
    }
    state.customers.push(spawnCustomerParty(0), spawnCustomerParty(1));

    // 1.5s GBA Boot Loading Progress
    const bootStart = performance.now();
    function tickBoot(now) {
      if (state.mode !== 'boot') return;
      const pct = Math.min(100, Math.round(((now - bootStart) / 1500) * 100));
      const stepped = pct >= 98 ? 100 : Math.floor(pct / 10) * 10;
      document.getElementById('boot-pct').textContent = stepped + '%';
      document.getElementById('boot-bar').style.width = stepped + '%';
      const fh = Math.round((stepped / 100) * 26);
      const fillEl = document.getElementById('boot-cup-fill');
      const cremaEl = document.getElementById('boot-cup-crema');
      fillEl.setAttribute('y', String(53 - fh));
      fillEl.setAttribute('height', String(fh));
      cremaEl.setAttribute('y', String(53 - fh));
      cremaEl.setAttribute('height', String(Math.min(4, fh)));
      if (now - bootStart >= 1500) {
        state.mode = 'title';
        document.getElementById('boot-overlay').style.display = 'none';
        document.getElementById('title-overlay').style.display = 'flex';
      } else {
        requestAnimationFrame(tickBoot);
      }
    }
    requestAnimationFrame(tickBoot);

    function renderMenuModal() {
      const list = document.getElementById('menu-recipes-list');
      list.innerHTML = '';
      const sleeveBonus = state.finance.upgrades.custom_sleeves ? 4 : 0;
      const baseCogs = state.finance.stock > 0 ? 2.0 : 4.0;
      const cogs = Math.max(0.5, baseCogs - (state.finance.upgrades.direct_trade_beans ? 1.5 : 0));
      Object.values(RECIPES).forEach(r => {
        const sell = r.price + sleeveBonus;
        const net = sell - cogs;
        const card = document.createElement('div');
        card.style.cssText = 'background:#090b0e; border:2px solid #475569; padding:8px; display:flex; flex-direction:column; gap:5px;';
        card.innerHTML = '<div style="font-family:\\'Silkscreen\\',monospace; font-size:9px; color:#facc15;">' + r.name + '</div>' +
          '<div style="font-family:\\'Silkscreen\\',monospace; font-size:8px; color:#7dd3fc;">STEPS: ' + r.stepLabels.join(' → ') + '</div>' +
          '<div style="font-size:16px; color:#e2e8f0;">Price: <strong style="color:#4ade80;">$' + sell.toFixed(2) + '</strong> · COGS: <strong style="color:#fb7185;">$' + cogs.toFixed(2) + '</strong> · Profit: <strong style="color:#facc15;">+$' + net.toFixed(2) + '</strong></div>';
        list.appendChild(card);
      });
    }

    function hireNextAvailableStaff() {
      const next = state.staff.find(s => !s.hired);
      if (!next || state.coins < next.hireCost) return;
      state.coins -= next.hireCost;
      next.hired = true;
      document.getElementById('log-msg').textContent = '👩‍🍳 Hired ' + next.name + ' (' + next.role + ')! Payroll: $12/day';
      saveProgressV2();
      syncHud();
      renderBizModal();
    }

    function renderBizModal() {
      const staffContainer = document.getElementById('staff-list');
      staffContainer.innerHTML = '';
      state.staff.forEach(w => {
        const card = document.createElement('div');
        card.style.cssText = 'background:#0b0d12; border:2px solid ' + (w.hired ? '#4ade80' : '#475569') + '; padding:7px; display:flex; justify-content:space-between; align-items:center; gap:6px;';
        card.innerHTML = '<div><div style="font-family:\\'Silkscreen\\',monospace; font-size:8px; color:#f8fafc;">' + w.name.toUpperCase() + ' · ' + w.role + '</div><div style="font-size:15px; color:#cbd5e1;">Salary: $' + w.salary + '/shift</div></div>';
        const btn = document.createElement('button');
        btn.className = 'gba-btn' + (!w.hired && state.coins >= w.hireCost ? ' gba-btn-active' : '');
        btn.style.cssText = 'padding:5px 7px; font-size:8px;';
        btn.textContent = w.hired ? '✓ HIRED' : 'HIRE $' + w.hireCost;
        btn.onclick = () => {
          if (!w.hired && state.coins >= w.hireCost) {
            state.coins -= w.hireCost;
            w.hired = true;
            saveProgressV2();
            syncHud();
            renderBizModal();
          }
        };
        card.appendChild(btn);
        staffContainer.appendChild(card);
      });

      const machContainer = document.getElementById('machines-list');
      machContainer.innerHTML = '';
      STATIONS_META.forEach(st => {
        const lvl = state.stationLevels[st.id];
        const isMax = lvl >= 3;
        const cost = lvl === 1 ? st.lvl2Cost : st.lvl3Cost;
        const card = document.createElement('div');
        card.style.cssText = 'background:#0b0d12; border:2px solid ' + (isMax ? '#facc15' : '#475569') + '; padding:6px; display:flex; flex-direction:column; justify-content:space-between; gap:5px;';
        card.innerHTML = '<div style="font-family:\\'Silkscreen\\',monospace; font-size:8px; color:#f8fafc;">' + st.name + ' (L' + lvl + ' · ' + TIER_TIMES[lvl] + 's)</div>';
        const btn = document.createElement('button');
        btn.className = 'gba-btn' + (!isMax && state.coins >= cost ? ' gba-btn-active' : '');
        btn.style.cssText = 'padding:4px; font-size:8px; width:100%;';
        btn.textContent = isMax ? '★ LVL 3 MAX (0.65s)' : 'UPGRADE L' + (lvl + 1) + ' · $' + cost;
        btn.onclick = () => {
          if (!isMax && state.coins >= cost) {
            state.coins -= cost;
            state.stationLevels[st.id] = lvl + 1;
            saveProgressV2();
            syncHud();
            renderBizModal();
          }
        };
        card.appendChild(btn);
        machContainer.appendChild(card);
      });

      const decorContainer = document.getElementById('decor-list');
      decorContainer.innerHTML = '';
      DECOR_ITEMS.forEach(d => {
        const owned = state.decorOwned[d.id];
        const eq = state.decorEquipped[d.id];
        const card = document.createElement('div');
        card.style.cssText = 'background:#0b0d12; border:2px solid ' + (owned && eq ? '#4ade80' : '#475569') + '; padding:6px; display:flex; justify-content:space-between; align-items:center; gap:6px;';
        card.innerHTML = '<div style="font-family:\\'Silkscreen\\',monospace; font-size:8px; color:#f8fafc;">' + d.name + '</div>';
        const btn = document.createElement('button');
        btn.className = 'gba-btn' + (!owned && state.coins >= d.cost ? ' gba-btn-active' : '');
        btn.style.cssText = 'padding:5px 7px; font-size:8px;';
        btn.textContent = owned ? (eq ? '✓ EQUIPPED' : 'EQUIP') : 'BUY $' + d.cost;
        btn.onclick = () => {
          if (owned) {
            state.decorEquipped[d.id] = !state.decorEquipped[d.id];
          } else if (state.coins >= d.cost) {
            state.coins -= d.cost;
            state.decorOwned[d.id] = true;
            state.decorEquipped[d.id] = true;
          }
          saveProgressV2();
          syncHud();
          renderBizModal();
        };
        card.appendChild(btn);
        decorContainer.appendChild(card);
      });

      const container = document.getElementById('upgrades-list');
      container.innerHTML = '';
      UPGRADES.forEach(u => {
        const owned = state.finance.upgrades[u.id];
        const card = document.createElement('div');
        card.style.cssText = 'background:#0b0d12; border:2px solid ' + (owned ? '#4ade80' : '#475569') + '; padding:7px; display:flex; flex-direction:column; justify-content:space-between; gap:5px;';
        card.innerHTML = '<div><div style="font-family:\\'Silkscreen\\',monospace; font-size:8px; color:#f8fafc;">' + u.name + '</div><div style="font-size:15px; color:#cbd5e1; margin-top:2px;">' + u.desc + '</div></div>';
        const btn = document.createElement('button');
        btn.className = 'gba-btn' + (!owned && state.coins >= u.cost ? ' gba-btn-active' : '');
        btn.style.cssText = 'padding:5px; font-size:8px; width:100%;';
        btn.textContent = owned ? '✓ OWNED' : 'BUY · $' + u.cost;
        btn.onclick = () => {
          if (!owned && state.coins >= u.cost) {
            state.coins -= u.cost;
            state.finance.upgrades[u.id] = true;
            saveProgressV2();
            syncHud();
            renderBizModal();
          }
        };
        card.appendChild(btn);
        container.appendChild(card);
      });
    }

    function recalcNetProfit() {
      state.finance.netProfit = state.finance.grossRevenue - state.finance.totalCogs - state.finance.payrollExpense;
      state.finance.marginPct = state.finance.grossRevenue > 0 ? Math.round((state.finance.netProfit / state.finance.grossRevenue) * 100) : 0;
    }

    function syncHud() {
      const hiredCount = state.staff.filter(s => s.hired).length;
      const nextStaff = state.staff.find(s => !s.hired);
      const staffLabel = '👩‍🍳 HIRE STAFF (' + hiredCount + '/2)' + (nextStaff ? ' · $' + nextStaff.hireCost : ' ★');
      document.getElementById('hire-btn').textContent = staffLabel;
      document.getElementById('q-hire').textContent = staffLabel;

      document.getElementById('barista-tag').textContent = '👤 ' + state.appearance.name.toUpperCase();
      document.getElementById('cozy-val').textContent = Math.round(state.cozy) + '%';
      document.getElementById('coins-val').textContent = Math.round(state.coins);
      document.getElementById('stock-val').textContent = state.finance.stock;
      document.getElementById('streak-val').textContent = state.dailyStreak;
      document.getElementById('cust-streak-pill').textContent = '🔥 STREAK ' + state.dailyStreak;
      document.getElementById('served-val').textContent = state.served + '/' + state.target;
      document.getElementById('finish-shift-btn').style.display = state.served >= state.target ? 'inline-block' : 'none';
      document.getElementById('goal-fill').style.width = Math.min(100, Math.round((state.served / state.target) * 100)) + '%';
      document.getElementById('step-badge').textContent = 'STEP ' + state.step + '/3';
      document.getElementById('pnl-rev').textContent = '$' + state.finance.grossRevenue.toFixed(2);
      document.getElementById('pnl-cogs').textContent = '$' + state.finance.totalCogs.toFixed(2);
      document.getElementById('pnl-payroll').textContent = '$' + state.finance.payrollExpense.toFixed(2);
      document.getElementById('pnl-net').textContent = '$' + state.finance.netProfit.toFixed(2);
      document.getElementById('pnl-margin').textContent = state.finance.marginPct + '%';
      document.getElementById('biz-stock-cnt').textContent = state.finance.stock;
      document.getElementById('room-btn').textContent = state.room === 'inside' ? '🚪 INSIDE' : '🚪 GARDEN';
      document.getElementById('q-room').textContent = state.room === 'inside' ? '🚪 GARDEN' : '🚪 INSIDE';
      document.getElementById('weather-btn').textContent = state.weather === 'clear' ? '⛅ CLEAR' : state.weather === 'breeze' ? '🍃 BREEZE' : '🌧️ RAIN';
    }

    function smartStep() {
      const waiting = state.customers.find(c => c.state === 'waiting');
      if (!waiting) return;
      const r = RECIPES[waiting.order];
      if (state.step < 3) {
        const stId = r.steps[state.step];
        const stMeta = STATIONS_META.find(s => s.id === stId);
        if (stMeta) {
          state.barista.tx = stMeta.x;
          state.barista.ty = 192;
        }
        state.step++;
        state.barista.carrying = 'cup';
        const lvl = state.stationLevels[stId] || 1;
        document.getElementById('log-msg').textContent = state.step === 3
          ? r.name + ' READY! Tap to serve!'
          : 'Brewing Step ' + state.step + '/3 (' + (TIER_TIMES[lvl] || 0.7) + 's Lvl ' + lvl + ')';
      } else {
        triggerHaptic(15);
        const sleeveBonus = state.finance.upgrades.custom_sleeves ? 4 : 0;
        let sale = r.price + sleeveBonus;
        const baseCogs = state.finance.stock > 0 ? 2.0 : 4.0;
        const cogs = Math.max(0.5, baseCogs - (state.finance.upgrades.direct_trade_beans ? 1.5 : 0));

        const used = new Set(state.customers.filter(c => c.seatIdx !== null).map(c => c.seatIdx));
        const inSeat = INDOOR_SEATS.find(s => !used.has(s.idx));
        const outSeat = GARDEN_SEATS.find(s => !used.has(s.idx));

        if (!inSeat && state.weather === 'rain') {
          sale += 4;
          waiting.isTakeout = true;
          waiting.state = 'walking_out';
          waiting.tx = 356;
          waiting.ty = 472;
          waiting.quote = 'TAKEOUT! ☔';
        } else if (inSeat) {
          waiting.sipTimer = 24;
          waiting.state = 'sipping';
          waiting.seatIdx = inSeat.idx;
          waiting.tx = inSeat.x;
          waiting.ty = inSeat.y;
          waiting.quote = '♥ So cozy!';
        } else if (outSeat) {
          waiting.sipTimer = 24;
          waiting.state = 'walking_to_garden';
          waiting.seatIdx = outSeat.idx;
          waiting.tx = 356;
          waiting.ty = 446;
          waiting.finalX = outSeat.x;
          waiting.finalY = outSeat.y;
          waiting.quote = 'To Garden Patio ▼';
        }

        if (state.finance.stock > 0) {
          state.finance.stock--;
          state.coins += sale;
        } else {
          state.coins += (sale - cogs);
        }
        state.finance.grossRevenue += sale;
        state.finance.totalCogs += cogs;
        recalcNetProfit();
        state.served++;
        state.step = 0;
        state.barista.carrying = null;
        saveProgressV2();

        if (state.customers.length < 7) {
          state.customers.push(spawnCustomerParty(state.served % 2));
        }
        document.getElementById('log-msg').textContent = waiting.isTakeout
          ? '🌧️ TAKEOUT! ☔ Served ' + waiting.name + ' (+$4 Rain Bonus)!'
          : 'Served ' + waiting.name + '! Rev +$' + sale + ', COGS -$' + cogs.toFixed(2);
      }
      syncHud();
    }

    document.getElementById('start-btn').onclick = () => {
      state.mode = 'playing';
      document.getElementById('title-overlay').style.display = 'none';
      document.getElementById('top-hud').style.display = 'flex';
      document.getElementById('quick-bar').style.display = 'flex';
      syncHud();
    };
    document.getElementById('title-cust-btn').onclick = () => {
      document.getElementById('cust-modal').style.display = 'flex';
    };
    document.getElementById('hud-cust-btn').onclick = () => {
      document.getElementById('cust-modal').style.display = 'flex';
    };
    document.getElementById('close-cust-btn').onclick = () => {
      document.getElementById('cust-modal').style.display = 'none';
    };
    document.getElementById('hud-menu-btn').onclick = () => {
      renderMenuModal();
      document.getElementById('menu-modal').style.display = 'flex';
    };
    document.getElementById('close-menu-btn').onclick = () => {
      document.getElementById('menu-modal').style.display = 'none';
    };
    document.getElementById('title-pwa-btn').onclick = () => {
      if (deferredInstallPrompt) deferredInstallPrompt.prompt();
      document.getElementById('pwa-modal').style.display = 'flex';
    };
    document.getElementById('hud-pwa-btn').onclick = () => {
      document.getElementById('pwa-modal').style.display = 'flex';
    };
    document.getElementById('close-pwa-btn').onclick = () => {
      document.getElementById('pwa-modal').style.display = 'none';
    };
    document.getElementById('pwa-install-now-btn').onclick = () => {
      if (deferredInstallPrompt) deferredInstallPrompt.prompt();
    };
    document.getElementById('dl-manifest-btn').onclick = () => {
      downloadFile('manifest.json', JSON.stringify(MANIFEST_OBJ, null, 2), 'application/manifest+json');
    };
    document.getElementById('dl-sw-btn').onclick = () => {
      downloadFile('sw.js', SW_SOURCE, 'application/javascript');
    };
    document.getElementById('reset-save-btn').onclick = () => {
      try { localStorage.removeItem(SAVE_KEY); } catch {}
      location.reload();
    };
    document.getElementById('hire-btn').onclick = hireNextAvailableStaff;
    document.getElementById('q-hire').onclick = hireNextAvailableStaff;
    document.getElementById('q-cat').onclick = () => {
      triggerHaptic(15);
      document.getElementById('log-msg').textContent = '🐾 Lilo & Champy purred happily! (+Cozy)';
    };
    document.getElementById('weather-btn').onclick = () => {
      const order = ['clear', 'breeze', 'rain'];
      state.weather = order[(order.indexOf(state.weather) + 1) % order.length];
      syncHud();
    };

    let streakPulseTimer = null;
    document.getElementById('finish-shift-btn').onclick = () => {
      if (state.served < state.target) return;
      state.dailyStreak += 1;
      const payroll = state.staff.filter(s => s.hired).reduce((sum, s) => sum + s.salary, 0);
      if (payroll > 0) {
        state.coins = Math.max(0, state.coins - payroll);
        state.finance.payrollExpense += payroll;
        recalcNetProfit();
      }
      saveProgressV2();
      const flameEl = document.getElementById('streak-flame');
      if (flameEl) {
        flameEl.classList.remove('klasik-flame-pulse');
        void flameEl.offsetWidth;
        flameEl.classList.add('klasik-flame-pulse');
        if (streakPulseTimer) clearTimeout(streakPulseTimer);
        streakPulseTimer = setTimeout(() => {
          flameEl.classList.remove('klasik-flame-pulse');
        }, 2300);
      }
      state.served = 0;
      document.getElementById('log-msg').textContent = '🔥 STREAK ' + state.dailyStreak + '! Payroll deducted: -$' + payroll;
      syncHud();
    };
    document.getElementById('save-cust-btn').onclick = () => {
      const selOutfit = OUTFITS[state.appearance.outfitIdx];
      if (selOutfit.unlockStreak && state.dailyStreak < selOutfit.unlockStreak) return;
      state.appearance.name = document.getElementById('cust-name-input').value.trim() || 'Klasik';
      saveProgressV2();
      document.getElementById('cust-modal').style.display = 'none';
      syncHud();
    };
    document.getElementById('cycle-hair-btn').onclick = (e) => {
      state.appearance.hairIdx = (state.appearance.hairIdx + 1) % HAIR_COLORS.length;
      e.target.textContent = 'HAIR: ' + HAIR_COLORS[state.appearance.hairIdx].label + ' ►';
    };
    document.getElementById('cycle-skin-btn').onclick = (e) => {
      state.appearance.skinIdx = (state.appearance.skinIdx + 1) % SKIN_TONES.length;
      e.target.textContent = 'SKIN: ' + SKIN_TONES[state.appearance.skinIdx].label + ' ►';
    };
    document.getElementById('cycle-outfit-btn').onclick = (e) => {
      state.appearance.outfitIdx = (state.appearance.outfitIdx + 1) % OUTFITS.length;
      const o = OUTFITS[state.appearance.outfitIdx];
      const locked = o.unlockStreak && state.dailyStreak < o.unlockStreak;
      e.target.textContent = 'APRON: ' + o.label + (locked ? ' [🔒🔥' + o.unlockStreak + ']' : '') + ' ►';
      const saveBtn = document.getElementById('save-cust-btn');
      saveBtn.disabled = !!locked;
      saveBtn.textContent = locked ? '🔒 NEEDS STREAK ' + o.unlockStreak : '✓ SAVE BARISTA';
    };
    document.getElementById('hud-biz-btn').onclick = () => {
      renderBizModal();
      document.getElementById('biz-modal').style.display = 'flex';
    };
    document.getElementById('q-biz').onclick = () => {
      renderBizModal();
      document.getElementById('biz-modal').style.display = 'flex';
    };
    document.getElementById('close-biz-btn').onclick = () => {
      document.getElementById('biz-modal').style.display = 'none';
    };
    document.getElementById('restock-btn').onclick = () => {
      if (state.coins >= 20) {
        state.coins -= 20;
        state.finance.stock += 10;
        saveProgressV2();
        syncHud();
      }
    };
    document.getElementById('q-smart').onclick = smartStep;
    document.getElementById('room-btn').onclick = () => {
      state.room = state.room === 'inside' ? 'garden' : 'inside';
      syncHud();
    };
    document.getElementById('q-room').onclick = () => {
      state.room = state.room === 'inside' ? 'garden' : 'inside';
      syncHud();
    };
    canvas.addEventListener('pointerdown', (e) => {
      const rect = canvas.getBoundingClientRect();
      const wx = ((e.clientX - rect.left) / rect.width) * 900;
      const wy = ((e.clientY - rect.top) / rect.height) * 480;
      if (state.room === 'inside' && wx >= 732 && wx <= 840 && wy >= 146 && wy <= 314) {
        triggerHaptic(15);
        state.miataHeadlights = !state.miataHeadlights;
        return;
      }
      state.barista.tx = Math.max(46, Math.min(854, wx));
      state.barista.ty = Math.max(132, Math.min(442, wy));
      smartStep();
    });

    // Hand-level prop anchor (x + 11, y + 2) + crisp outlined nametag
    function drawCharacterWithHandProp(c, x, y, name, hairHex, skinHex, apronHex, hasCup, quote) {
      c.fillStyle = 'rgba(0,0,0,0.35)';
      c.fillRect(x - 12, y + 12, 24, 5);
      c.fillStyle = hairHex;
      c.fillRect(x - 10, y - 18, 20, 10);
      c.fillStyle = skinHex;
      c.fillRect(x - 8, y - 8, 16, 10);
      c.fillStyle = apronHex;
      c.fillRect(x - 9, y + 2, 18, 12);
      if (hasCup) {
        c.fillStyle = '#dc2626';
        c.fillRect(x + 11, y + 2, 8, 10);
        c.fillStyle = '#ffffff';
        c.fillRect(x + 10, y, 10, 2);
      }
      c.fillStyle = '#090b0e';
      c.fillRect(x - 26, y + 16, 52, 12);
      drawCrispText(c, name.toUpperCase(), x, y + 25, 8, '#fde047', 'center');
      if (quote) {
        c.fillStyle = '#f8fafc';
        c.fillRect(x - 52, y - 34, 104, 14);
        c.strokeStyle = '#090b0e';
        c.strokeRect(x - 52, y - 34, 104, 14);
        drawCrispText(c, quote.slice(0, 16).toUpperCase(), x, y - 24, 8, '#fef08a', 'center');
      }
    }

    function loop() {
      // PILLAR 1: HiDPI Retina Canvas Backing Store Scaling
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      if (canvas.width !== Math.round(900 * dpr) || canvas.height !== Math.round(480 * dpr)) {
        canvas.width = Math.round(900 * dpr);
        canvas.height = Math.round(480 * dpr);
      }
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.imageSmoothingEnabled = false;
      ctx.clearRect(0, 0, 900, 480);

      const hair = HAIR_COLORS[state.appearance.hairIdx].main;
      const skin = SKIN_TONES[state.appearance.skinIdx].hex;
      const apron = OUTFITS[state.appearance.outfitIdx].apron;

      prevCtx.fillStyle = '#0f172a';
      prevCtx.fillRect(0, 0, 96, 96);
      drawCharacterWithHandProp(prevCtx, 48, 48, state.appearance.name, hair, skin, apron, true, '');

      const bStep = stepAlongWaypoints(state.barista.x, state.barista.y, state.barista.tx, state.barista.ty, 3.2, state.room, 10);
      state.barista.x = bStep.x;
      state.barista.y = bStep.y;

      for (let idx = state.customers.length - 1; idx >= 0; idx--) {
        const cust = state.customers[idx];
        const dist = Math.hypot(cust.tx - cust.x, cust.ty - cust.y);
        if (dist > 2) {
          const cStep = stepAlongWaypoints(cust.x, cust.y, cust.tx, cust.ty, 2.3, cust.room, 9);
          cust.x = cStep.x;
          cust.y = cStep.y;
          if (cust.pet) {
            cust.pet.x += (cust.x + 18 - cust.pet.x) * 0.15;
            cust.pet.y += (cust.y + 8 - cust.pet.y) * 0.15;
          }
        } else if (cust.state === 'walking_to_garden') {
          cust.room = 'garden';
          cust.state = 'sipping';
          cust.x = 450;
          cust.y = 118;
          cust.tx = cust.finalX;
          cust.ty = cust.finalY;
          cust.quote = '♥ Garden patio!';
        } else if (cust.state === 'walking_out') {
          state.customers.splice(idx, 1);
          syncHud();
        } else if (cust.state === 'sipping') {
          cust.sipTimer -= 0.016;
          if (cust.sipTimer <= 0) {
            state.coins += 3;
            cust.state = 'walking_out';
            cust.tx = 356;
            cust.ty = 472;
            syncHud();
          }
        }
      }

      if (state.room === 'inside') {
        ctx.fillStyle = '#111622';
        ctx.fillRect(0, 0, 900, 480);
        const marble = state.decorEquipped.checkered_marble_floor;
        for (let y = 84; y < 456; y += 28) {
          for (let x = 26; x < 580; x += 28) {
            const alt = ((x + y) / 28) % 2 === 0;
            ctx.fillStyle = marble ? (alt ? '#e2e8f0' : '#1e293b') : (alt ? '#262e3d' : '#1b2230');
            ctx.fillRect(x, y, 28, 28);
          }
        }
        // Rear Brewing Bar + Compact Non-Overlapping Station Badges (1:GRIND..5:TEA L1-L3)
        ctx.fillStyle = '#0f172a';
        ctx.fillRect(68, 116, 472, 56);
        STATIONS_META.forEach(s => {
          const lvl = state.stationLevels[s.id];
          ctx.fillStyle = lvl === 3 ? '#090b0e' : lvl === 2 ? '#e2e8f0' : '#475569';
          ctx.fillRect(s.x - 32, s.y - 20, 64, 40);
          ctx.strokeStyle = lvl === 3 ? '#facc15' : lvl === 2 ? '#d97706' : '#090b0e';
          ctx.strokeRect(s.x - 32, s.y - 20, 64, 40);
          drawCrispText(ctx, s.badge + ' L' + lvl, s.x, s.y + 31, 8, lvl === 3 ? '#fde047' : '#f8fafc', 'center');
        });
        ctx.fillStyle = '#1e293b';
        ctx.fillRect(68, 218, 360, 52);
        // Garage + 1990 Miata MX-5
        ctx.fillStyle = '#090b0e';
        ctx.fillRect(732, 146, 108, 168);
        ctx.fillStyle = state.miataColor;
        ctx.fillRect(742, 154, 88, 148);
        // Unobstructed South Doorway Mat
        ctx.fillStyle = '#14532d';
        ctx.fillRect(296, 429, 120, 34);
        drawCrispText(ctx, '▼ TO GARDEN [V]', 356, 450, 9, '#fef08a', 'center');
      } else {
        ctx.fillStyle = '#22c55e';
        ctx.fillRect(0, 0, 900, 480);
        ctx.fillStyle = '#94a3b8';
        ctx.fillRect(402, 110, 96, 320);
      }

      drawCharacterWithHandProp(ctx, state.barista.x, state.barista.y, state.appearance.name, hair, skin, apron, state.barista.carrying === 'cup', '');
      state.staff.filter(w => w.hired && w.room === state.room).forEach(w => {
        drawCharacterWithHandProp(ctx, w.x, w.y, w.name + ' ★', '#7c2d12', '#fde68a', '#4ade80', true, '');
      });
      state.customers.filter(c => c.room === state.room).forEach(c => {
        if (c.hasCompanion) {
          drawCharacterWithHandProp(ctx, c.x + (c.state === 'sipping' ? 44 : -22), c.y, c.hasChild ? 'Jr' : 'Pal', '#0f172a', '#ffedd5', '#f43f5e', c.state !== 'waiting', '');
        }
        if (c.pet) {
          ctx.fillStyle = '#f59e0b';
          ctx.fillRect(c.pet.x - 6, c.pet.y - 6, 12, 10);
        }
        drawCharacterWithHandProp(ctx, c.x, c.y, c.name, '#7c2d12', '#ffedd5', '#38bdf8', c.state !== 'waiting', c.quote);
      });

      requestAnimationFrame(loop);
    }
    requestAnimationFrame(loop);
  </script>
</body>
</html>`;
