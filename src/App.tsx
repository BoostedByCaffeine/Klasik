import { useEffect, useRef, useState, useCallback } from 'react';
import {
  CafeState,
  createInitialCafeState,
  STATIONS,
  RECIPES,
  MIATA_GARAGE_BOUNDS,
  DrinkId,
  StationId,
  NPC_NAMES,
  interactWithStation,
  advancePrepTimer,
  serveWaitingCustomer,
  waterDaisyPatch,
  toggleMiataHeadlights,
  petCatCompanion,
  calculateCozyRating,
  executeSmartStep,
  cycleViewMode,
} from './game/rules';
import {
  ParticlePool,
  renderCafeWorld,
  WORLD_WIDTH,
  WORLD_HEIGHT,
  CameraTransform,
  getTargetCamera,
  screenToWorldWithCamera,
} from './game/pixelArt';
import { soundEngine } from './game/sound';
import { TitleScreen } from './components/TitleScreen';
import {
  TopHudBar,
  BottomActionDock,
  FloatingCanvasQuickBar,
  HudSnapshot,
} from './components/HudOverlay';
import { StatusModal, RunSummarySnapshot } from './components/StatusModal';
import { CodeExportModal } from './components/CodeExportModal';

function makeHudSnapshot(state: CafeState): HudSnapshot {
  const waitingCustomer = state.customers.find((c) => c.state === 'waiting') ?? null;
  const thirstyDaisyCount = state.daisies.filter((d) => d.needsWater).length;

  return {
    cozyRating: state.cozyRating,
    hearts: state.hearts,
    coins: state.coins,
    servedCount: state.servedCount,
    dailyTarget: state.dailyTarget,
    activeDrink: state.prep.activeDrink,
    currentStepIndex: state.prep.currentStepIndex,
    isProcessing: state.prep.processingStation !== null && state.prep.processTimer > 0,
    holdingWateringCan: state.prep.holdingWateringCan,
    thirstyDaisyCount,
    miataHeadlightsOn: state.miataHeadlightsOn,
    speedBoostActive: state.barista.speedBoostTimer > 0,
    waitingCustomerName: waitingCustomer ? waitingCustomer.name : null,
    waitingCustomerOrder: waitingCustomer ? waitingCustomer.order : null,
    lastMessage: state.lastMessage,
    muted: soundEngine.muted,
    bgmEnabled: soundEngine.bgmEnabled,
    viewMode: state.viewMode,
  };
}

export default function App() {
  const autostart =
    typeof window !== 'undefined' &&
    new URLSearchParams(window.location.search).get('autostart') === '1';

  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const gameStateRef = useRef<CafeState>(createInitialCafeState(autostart));
  const particlesRef = useRef<ParticlePool>(new ParticlePool());
  const cameraRef = useRef<CameraTransform>({
    zoom: 1,
    focusX: WORLD_WIDTH / 2,
    focusY: WORLD_HEIGHT / 2,
  });
  const hoveredStationRef = useRef<string | null>(null);
  const hoveredDaisyRef = useRef<string | null>(null);
  const hoveredMiataRef = useRef<boolean>(false);
  const keysPressedRef = useRef<Set<string>>(new Set());
  const hitstopTimerRef = useRef<number>(0);

  const [uiMode, setUiMode] = useState<'title' | 'playing' | 'paused' | 'gameover'>(
    autostart ? 'playing' : 'title'
  );
  const [dockCollapsed, setDockCollapsed] = useState<boolean>(false);
  const [hud, setHud] = useState<HudSnapshot>(() => makeHudSnapshot(gameStateRef.current));
  const [summaryStats, setSummaryStats] = useState<RunSummarySnapshot>({
    dayNumber: 1,
    servedCount: 0,
    dailyTarget: 6,
    cozyRating: 82,
    bestCozyRating: 85,
    hearts: 3,
    coins: 25,
  });
  const [showCodeModal, setShowCodeModal] = useState(false);

  const updateHudIfChanged = useCallback((st: CafeState) => {
    const next = makeHudSnapshot(st);
    setHud((prev) => {
      if (
        prev.cozyRating === next.cozyRating &&
        prev.hearts === next.hearts &&
        prev.coins === next.coins &&
        prev.servedCount === next.servedCount &&
        prev.activeDrink === next.activeDrink &&
        prev.currentStepIndex === next.currentStepIndex &&
        prev.isProcessing === next.isProcessing &&
        prev.holdingWateringCan === next.holdingWateringCan &&
        prev.thirstyDaisyCount === next.thirstyDaisyCount &&
        prev.miataHeadlightsOn === next.miataHeadlightsOn &&
        prev.speedBoostActive === next.speedBoostActive &&
        prev.waitingCustomerName === next.waitingCustomerName &&
        prev.waitingCustomerOrder === next.waitingCustomerOrder &&
        prev.lastMessage === next.lastMessage &&
        prev.muted === next.muted &&
        prev.bgmEnabled === next.bgmEnabled &&
        prev.viewMode === next.viewMode
      ) {
        return prev;
      }
      return next;
    });
  }, []);

  const syncHudNow = useCallback(() => {
    updateHudIfChanged(gameStateRef.current);
  }, [updateHudIfChanged]);

  const syncBodyMode = useCallback((mode: 'title' | 'playing' | 'paused' | 'gameover') => {
    gameStateRef.current.mode = mode;
    document.body.dataset.state = mode;
    setUiMode(mode);
  }, []);

  useEffect(() => {
    document.body.dataset.state = autostart ? 'playing' : 'title';
  }, [autostart]);

  const handleStartGame = useCallback(() => {
    if (document.activeElement instanceof HTMLElement) {
      document.activeElement.blur();
    }
    keysPressedRef.current.clear();
    syncBodyMode('playing');
    soundEngine.playCustomerBell();
    syncHudNow();
  }, [syncBodyMode, syncHudNow]);

  const handleRestartShift = useCallback(() => {
    if (document.activeElement instanceof HTMLElement) {
      document.activeElement.blur();
    }
    keysPressedRef.current.clear();
    const fresh = createInitialCafeState(true);
    fresh.dayNumber =
      gameStateRef.current.dayNumber + (gameStateRef.current.mode === 'gameover' ? 1 : 0);
    gameStateRef.current = fresh;
    syncBodyMode('playing');
    soundEngine.playCustomerBell();
    syncHudNow();
  }, [syncBodyMode, syncHudNow]);

  const handleReturnTitle = useCallback(() => {
    keysPressedRef.current.clear();
    const fresh = createInitialCafeState(false);
    gameStateRef.current = fresh;
    syncBodyMode('title');
    syncHudNow();
  }, [syncBodyMode, syncHudNow]);

  const handleFinishShift = useCallback(() => {
    const st = gameStateRef.current;
    setSummaryStats({
      dayNumber: st.dayNumber,
      servedCount: st.servedCount,
      dailyTarget: st.dailyTarget,
      cozyRating: st.cozyRating,
      bestCozyRating: st.bestCozyRating,
      hearts: st.hearts,
      coins: st.coins,
    });
    soundEngine.playServeSuccess();
    syncBodyMode('gameover');
  }, [syncBodyMode]);

  const handleTriggerStation = useCallback(
    (stationId: StationId) => {
      const st = gameStateRef.current;
      if (st.mode !== 'playing') return;

      const station = STATIONS.find((s) => s.id === stationId);
      if (station) {
        st.barista.targetX = Math.max(195, Math.min(590, station.x));
        st.barista.targetY = 196;
        st.barista.scaleX = 1.15;
        st.barista.scaleY = 0.86;
      }

      if (stationId === 'cup_counter' && st.prep.currentStepIndex === 3) {
        const serveRes = serveWaitingCustomer(st);
        if (serveRes.served && serveRes.customer) {
          soundEngine.playServeSuccess();
          hitstopTimerRef.current = 0.045;
          particlesRef.current.emitBurst('heart', serveRes.customer.x, serveRes.customer.y - 24, 14);
          particlesRef.current.emitBurst('sparkle', 392, 234, 10);
        }
        syncHudNow();
        return;
      }

      const res = interactWithStation(st, stationId);
      if (res.handled) {
        soundEngine.playStationStart(stationId);
        if (station) {
          particlesRef.current.emitBurst('sparkle', station.x, station.y - 10, 6);
        }
      } else {
        soundEngine.playStep();
      }
      syncHudNow();
    },
    [syncHudNow]
  );

  const handleServeCustomer = useCallback(() => {
    const st = gameStateRef.current;
    if (st.mode !== 'playing') return;

    const serveRes = serveWaitingCustomer(st);
    if (serveRes.served && serveRes.customer) {
      st.barista.targetX = 392;
      st.barista.targetY = 196;
      st.barista.scaleX = 0.86;
      st.barista.scaleY = 1.16;
      soundEngine.playServeSuccess();
      hitstopTimerRef.current = 0.05;
      particlesRef.current.emitBurst('heart', serveRes.customer.x, serveRes.customer.y - 24, 16);
      particlesRef.current.emitBurst('sparkle', serveRes.customer.x, serveRes.customer.y - 10, 10);
    } else {
      soundEngine.playStep();
    }
    syncHudNow();
  }, [syncHudNow]);

  const handleSmartStep = useCallback(() => {
    const st = gameStateRef.current;
    if (st.mode !== 'playing') return;
    const res = executeSmartStep(st);
    if (res.type === 'station' && res.stationId) {
      const station = STATIONS.find((s) => s.id === res.stationId);
      if (station) {
        st.barista.targetX = Math.max(195, Math.min(590, station.x));
        st.barista.targetY = 196;
        st.barista.scaleX = 1.15;
        st.barista.scaleY = 0.86;
        particlesRef.current.emitBurst('sparkle', station.x, station.y - 10, 6);
      }
      soundEngine.playStationStart(res.stationId);
    } else if (res.type === 'serve' && res.servedResult?.served && res.servedResult.customer) {
      st.barista.targetX = 392;
      st.barista.targetY = 196;
      st.barista.scaleX = 0.86;
      st.barista.scaleY = 1.16;
      soundEngine.playServeSuccess();
      hitstopTimerRef.current = 0.05;
      particlesRef.current.emitBurst(
        'heart',
        res.servedResult.customer.x,
        res.servedResult.customer.y - 24,
        16
      );
      particlesRef.current.emitBurst(
        'sparkle',
        res.servedResult.customer.x,
        res.servedResult.customer.y - 10,
        10
      );
    } else {
      soundEngine.playStep();
    }
    syncHudNow();
  }, [syncHudNow]);

  const handleWaterDaisyById = useCallback(
    (daisyId: string) => {
      const st = gameStateRef.current;
      if (st.mode !== 'playing') return;
      const patch = st.daisies.find((d) => d.id === daisyId);
      if (!patch) return;

      const watered = waterDaisyPatch(st, daisyId);
      if (watered) {
        st.barista.targetX = patch.x < 400 ? 224 : 490;
        st.barista.targetY = 196;
        st.barista.scaleX = 1.16;
        st.barista.scaleY = 0.85;
        soundEngine.playWaterDaisies();
        particlesRef.current.emitBurst('water', patch.x, patch.y - 8, 16);
        particlesRef.current.emitBurst('sparkle', patch.x, patch.y - 14, 8);
      }
      syncHudNow();
    },
    [syncHudNow]
  );

  const handleWaterNextDaisy = useCallback(() => {
    const st = gameStateRef.current;
    if (st.mode !== 'playing') return;
    const sorted = [...st.daisies].sort((a, b) => a.hydration - b.hydration);
    if (sorted[0]) {
      handleWaterDaisyById(sorted[0].id);
    }
  }, [handleWaterDaisyById]);

  const handleToggleMiataHeadlights = useCallback(() => {
    const st = gameStateRef.current;
    if (st.mode !== 'playing') return;
    const isOn = toggleMiataHeadlights(st);
    soundEngine.playHeadlightFlip(isOn);
    particlesRef.current.emitBurst(
      'sparkle',
      MIATA_GARAGE_BOUNDS.x,
      MIATA_GARAGE_BOUNDS.y + 44,
      10
    );
    syncHudNow();
  }, [syncHudNow]);

  const handlePetCat = useCallback(
    (catId?: 'lilo' | 'champy') => {
      const st = gameStateRef.current;
      if (st.mode !== 'playing') return;
      const petted = petCatCompanion(st, catId);
      soundEngine.playCatPurr();
      particlesRef.current.emitBurst('heart', petted.x, petted.y - 16, 12);
      particlesRef.current.emitBurst('sparkle', petted.x, petted.y - 8, 8);
      syncHudNow();
    },
    [syncHudNow]
  );

  const handleCycleViewMode = useCallback(() => {
    const st = gameStateRef.current;
    cycleViewMode(st);
    soundEngine.playStep();
    syncHudNow();
  }, [syncHudNow]);

  const screenToWorld = useCallback((clientX: number, clientY: number) => {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };
    const rect = canvas.getBoundingClientRect();
    return screenToWorldWithCamera(clientX, clientY, rect, cameraRef.current);
  }, []);

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (showCodeModal) {
        if (e.key === 'Escape') {
          setShowCodeModal(false);
        }
        return;
      }

      const mode = gameStateRef.current.mode;

      if (mode === 'title') {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          handleStartGame();
        }
        return;
      }

      if (e.key === 'Escape' || e.key.toLowerCase() === 'p') {
        e.preventDefault();
        if (mode === 'playing') {
          const st = gameStateRef.current;
          setSummaryStats({
            dayNumber: st.dayNumber,
            servedCount: st.servedCount,
            dailyTarget: st.dailyTarget,
            cozyRating: st.cozyRating,
            bestCozyRating: st.bestCozyRating,
            hearts: st.hearts,
            coins: st.coins,
          });
          keysPressedRef.current.clear();
          syncBodyMode('paused');
        } else if (mode === 'paused') {
          syncBodyMode('playing');
        }
        return;
      }

      if (mode === 'gameover' && (e.key === 'Enter' || e.key === ' ')) {
        e.preventDefault();
        handleRestartShift();
        return;
      }

      if (mode !== 'playing') return;

      const key = e.key.toLowerCase();
      keysPressedRef.current.add(key);

      if (!e.repeat) {
        if (key === '1') handleTriggerStation('grinder');
        else if (key === '2') handleTriggerStation('espresso');
        else if (key === '3') handleTriggerStation('milk_frother');
        else if (key === '4') handleTriggerStation('kettle');
        else if (key === '5') handleTriggerStation('tea_leaves');
        else if (key === 'e') handleSmartStep();
        else if (key === ' ') {
          e.preventDefault();
          if (gameStateRef.current.prep.currentStepIndex === 3) {
            handleServeCustomer();
          } else {
            handleTriggerStation('cup_counter');
          }
        } else if (key === 'enter') {
          e.preventDefault();
          handleServeCustomer();
        } else if (key === 'w') {
          handleWaterNextDaisy();
        } else if (key === 'h') {
          handleToggleMiataHeadlights();
        } else if (key === 'c') {
          handlePetCat();
        } else if (key === 'v') {
          handleCycleViewMode();
        } else if (key === 'b') {
          soundEngine.toggleBgm();
          syncHudNow();
        } else if (key === 'x') {
          handleTriggerStation('trash');
        } else if (key === 'm') {
          soundEngine.toggleMute();
          syncHudNow();
        } else if (key === 'r') {
          handleRestartShift();
        }
      }
    };

    const onKeyUp = (e: KeyboardEvent) => {
      keysPressedRef.current.delete(e.key.toLowerCase());
    };

    const onBlur = () => {
      keysPressedRef.current.clear();
    };

    window.addEventListener('keydown', onKeyDown);
    window.addEventListener('keyup', onKeyUp);
    window.addEventListener('blur', onBlur);
    return () => {
      window.removeEventListener('keydown', onKeyDown);
      window.removeEventListener('keyup', onKeyUp);
      window.removeEventListener('blur', onBlur);
    };
  }, [
    showCodeModal,
    handleStartGame,
    handleRestartShift,
    handleTriggerStation,
    handleServeCustomer,
    handleSmartStep,
    handleWaterNextDaisy,
    handleToggleMiataHeadlights,
    handlePetCat,
    handleCycleViewMode,
    syncBodyMode,
    syncHudNow,
  ]);

  // Isolated 60fps Canvas2D Simulation & Render Loop with afterDraw yield
  useEffect(() => {
    let rafId = 0;
    let timerId = 0;
    let cancelled = false;
    let lastTime = performance.now();
    let customerIdCounter = 2;

    const tick = (now: number) => {
      if (cancelled) return;
      const rawDt = (now - lastTime) / 1000;
      lastTime = now;
      const dt = Math.min(rawDt, 0.05);
      const timeSec = now / 1000;

      const st = gameStateRef.current;
      const particles = particlesRef.current;

      soundEngine.updateBgm(dt);

      // Smoothly interpolate camera toward target ViewMode
      const targetCam = getTargetCamera(st.viewMode);
      const camLerp = Math.min(1, dt * 8);
      cameraRef.current.zoom += (targetCam.zoom - cameraRef.current.zoom) * camLerp;
      cameraRef.current.focusX += (targetCam.focusX - cameraRef.current.focusX) * camLerp;
      cameraRef.current.focusY += (targetCam.focusY - cameraRef.current.focusY) * camLerp;

      if (Math.random() < 0.14) {
        particles.spawn(
          'pollen',
          Math.random() * WORLD_WIDTH,
          Math.random() * WORLD_HEIGHT,
          8 + Math.random() * 12,
          -4 - Math.random() * 8,
          2.6,
          3,
          '#fef08a'
        );
      }

      if (hitstopTimerRef.current > 0) {
        hitstopTimerRef.current = Math.max(0, hitstopTimerRef.current - dt);
      }

      const simDt = st.mode === 'playing' && hitstopTimerRef.current <= 0 ? dt : 0;

      if (simDt > 0) {
        st.elapsedSeconds += simDt;

        // 1. Update Barista Speed Boost & Movement
        if (st.barista.speedBoostTimer > 0) {
          st.barista.speedBoostTimer = Math.max(0, st.barista.speedBoostTimer - simDt);
        }

        const keys = keysPressedRef.current;
        let moveX = 0;
        let moveY = 0;
        if (keys.has('a') || keys.has('arrowleft')) moveX -= 1;
        if (keys.has('d') || keys.has('arrowright')) moveX += 1;
        if (keys.has('arrowup')) moveY -= 1;
        if (keys.has('s') || keys.has('arrowdown')) moveY += 1;

        const baseSpeed = st.barista.speedBoostTimer > 0 ? 225 : 165;
        if (moveX !== 0 || moveY !== 0) {
          const len = Math.hypot(moveX, moveY);
          const dx = (moveX / len) * baseSpeed * simDt;
          const dy = (moveY / len) * baseSpeed * simDt;
          st.barista.x = Math.max(168, Math.min(610, st.barista.x + dx));
          st.barista.y = Math.max(182, Math.min(410, st.barista.y + dy));
          st.barista.targetX = st.barista.x;
          st.barista.targetY = st.barista.y;
          st.barista.walkDist += Math.hypot(dx, dy);
          if (Math.abs(moveX) > Math.abs(moveY)) {
            st.barista.facing = moveX < 0 ? 'left' : 'right';
          } else {
            st.barista.facing = moveY < 0 ? 'up' : 'down';
          }
        } else {
          const tx = st.barista.targetX - st.barista.x;
          const ty = st.barista.targetY - st.barista.y;
          const dist = Math.hypot(tx, ty);
          if (dist > 2) {
            const step = Math.min(dist, baseSpeed * simDt);
            st.barista.x += (tx / dist) * step;
            st.barista.y += (ty / dist) * step;
            st.barista.walkDist += step;
            if (Math.abs(tx) > Math.abs(ty)) {
              st.barista.facing = tx < 0 ? 'left' : 'right';
            } else {
              st.barista.facing = ty < 0 ? 'up' : 'down';
            }
          }
        }

        st.barista.scaleX += (1 - st.barista.scaleX) * Math.min(1, simDt * 12);
        st.barista.scaleY += (1 - st.barista.scaleY) * Math.min(1, simDt * 12);

        // 2. Advance active station timer
        const stepFinished = advancePrepTimer(st, simDt);
        if (stepFinished) {
          soundEngine.playStepReady();
          particlesRef.current.emitBurst('sparkle', 392, 236, 8);
          updateHudIfChanged(st);
        }

        // 3. Multi-State Smooth Waypoint Cats (Lilo & Champy — Zero Teleportation!)
        st.cats.forEach((cat) => {
          cat.tailPhase += simDt * 2.6;
          if (cat.state === 'pouncing') {
            cat.hopPhase += simDt;
          } else {
            cat.hopPhase = 0;
          }
          if (cat.heartTimer > 0) {
            cat.heartTimer = Math.max(0, cat.heartTimer - simDt);
          }

          if (cat.state === 'walking' || cat.state === 'pouncing') {
            const cdx = cat.targetX - cat.x;
            const cdy = cat.targetY - cat.y;
            const cdist = Math.hypot(cdx, cdy);
            const moveSpeed = cat.state === 'pouncing' ? 72 : 48;
            if (cdist > 2) {
              const cstep = Math.min(cdist, moveSpeed * simDt);
              cat.x += (cdx / cdist) * cstep;
              cat.y += (cdy / cdist) * cstep;
              cat.facing = cdx < 0 ? 'left' : 'right';
            } else {
              // Reached destination smoothly -> transition to intended resting behavior!
              cat.state = cat.nextStateAfterWalk;
              cat.stateTimer = 4.2 + Math.random() * 2.5;
            }
          } else {
            cat.stateTimer -= simDt;
            if (cat.stateTimer <= 0) {
              if (cat.id === 'lilo') {
                // Lilo smoothly walks between the 1990 Miata MX-5 hood (742, 268),
                // the Indoor Cafe Rug (556, 222), and the Pickup Bar (472, 224)
                const liloWaypoints = [
                  { x: 742, y: 268, rest: 'napping' as const },
                  { x: 556, y: 222, rest: 'sitting_grooming' as const },
                  { x: 472, y: 224, rest: 'sitting_grooming' as const },
                ];
                const nextSpot =
                  liloWaypoints.find((w) => Math.hypot(w.x - cat.x, w.y - cat.y) > 40) ??
                  liloWaypoints[0];
                cat.targetX = nextSpot.x;
                cat.targetY = nextSpot.y;
                cat.nextStateAfterWalk = nextSpot.rest;
                cat.state = 'walking';
              } else {
                // Champy smoothly walks & pounces around the Daisy Planters and Outdoor Tables
                const champyWaypoints = [
                  { x: 268, y: 356, rest: 'sitting_grooming' as const, hop: false },
                  { x: 184, y: 406, rest: 'napping' as const, hop: true },
                  { x: 504, y: 364, rest: 'sitting_grooming' as const, hop: false },
                  { x: 590, y: 408, rest: 'napping' as const, hop: true },
                ];
                const candidates = champyWaypoints.filter(
                  (w) => Math.hypot(w.x - cat.x, w.y - cat.y) > 45
                );
                const pick =
                  candidates[Math.floor(Math.random() * candidates.length)] ?? champyWaypoints[0];
                cat.targetX = pick.x;
                cat.targetY = pick.y;
                cat.nextStateAfterWalk = pick.rest;
                cat.state = pick.hop ? 'pouncing' : 'walking';
              }
            }
          }
        });

        // 4. Dynamic Daisy Hydration Decay (~1.2% per second)
        let needsHudRefresh = false;
        st.daisies.forEach((patch, idx) => {
          const decayRate = 1.15 + (idx % 3) * 0.1;
          patch.hydration = Math.max(15, patch.hydration - decayRate * simDt);
          const nowThirsty = patch.hydration <= 55;
          if (nowThirsty !== patch.needsWater) {
            patch.needsWater = nowThirsty;
            patch.bloomStage = nowThirsty ? 2 : 3;
            st.cozyRating = calculateCozyRating(st.daisies, st.hearts, st.catPetBonus);
            needsHudRefresh = true;
          }
        });

        // 5. Update Floating World Popups
        for (let i = st.popups.length - 1; i >= 0; i--) {
          const pop = st.popups[i];
          pop.life -= simDt;
          pop.y += pop.vy * simDt;
          if (pop.life <= 0) {
            st.popups.splice(i, 1);
          }
        }

        // 6. Update NPC Customers
        for (let i = st.customers.length - 1; i >= 0; i--) {
          const c = st.customers[i];
          const dx = c.targetX - c.x;
          const dy = c.targetY - c.y;
          const dist = Math.hypot(dx, dy);

          if (dist > 2) {
            const cSpeed = 105;
            const move = Math.min(dist, cSpeed * simDt);
            c.x += (dx / dist) * move;
            c.y += (dy / dist) * move;
            c.walkDist += move;
          } else {
            if (c.state === 'walking_in') {
              c.state = 'waiting';
              soundEngine.playCustomerBell();
              needsHudRefresh = true;
            } else if (c.state === 'sipping') {
              c.sipTimer -= simDt;
              if (c.sipTimer <= 0) {
                c.state = 'walking_out';
                c.seatIndex = null;
                c.targetX = 392;
                c.targetY = 520;
              }
            } else if (c.state === 'walking_out') {
              st.customers.splice(i, 1);
            }
          }
        }

        const hasCounterCustomer = st.customers.some(
          (c) => c.state === 'walking_in' || c.state === 'waiting'
        );
        if (!hasCounterCustomer) {
          const drinkKeys: DrinkId[] = [
            'midnight_cold_brew',
            'daisy_vanilla_latte',
            'miata_mocha',
            'catnip_herbal_tea',
          ];
          const nextOrder = drinkKeys[(customerIdCounter - 1) % drinkKeys.length];
          const nextName = NPC_NAMES[(customerIdCounter - 1) % NPC_NAMES.length];
          const recipe = RECIPES[nextOrder];
          st.customers.push({
            id: `cust-${customerIdCounter}`,
            name: nextName,
            spriteVariant: customerIdCounter % 4,
            order: nextOrder,
            state: 'walking_in',
            x: 392,
            y: 475,
            targetX: 392,
            targetY: 322,
            seatIndex: null,
            sipTimer: 0,
            heartsGiven: 0,
            dialogueText: `One ${recipe.shortName}, please!`,
            arrivalTime: st.elapsedSeconds,
            walkDist: 0,
          });
          customerIdCounter++;
          needsHudRefresh = true;
        }

        if (needsHudRefresh) {
          updateHudIfChanged(st);
        }
      }

      particles.update(dt);

      const canvas = canvasRef.current;
      if (canvas) {
        const ctx = canvas.getContext('2d');
        if (ctx) {
          renderCafeWorld(
            ctx,
            st,
            particles,
            timeSec,
            hoveredStationRef.current,
            hoveredDaisyRef.current,
            hoveredMiataRef.current,
            cameraRef.current
          );
        }
      }

      timerId = window.setTimeout(() => {
        if (!cancelled) {
          rafId = requestAnimationFrame(tick);
        }
      }, 16);
    };

    rafId = requestAnimationFrame(tick);
    return () => {
      cancelled = true;
      window.clearTimeout(timerId);
      cancelAnimationFrame(rafId);
    };
  }, [updateHudIfChanged]);

  // Canvas pointer hover & click handling
  const handleCanvasPointerMove = (e: React.PointerEvent<HTMLCanvasElement>) => {
    const { x, y } = screenToWorld(e.clientX, e.clientY);
    const st = gameStateRef.current;

    let foundStation: string | null = null;
    for (const s of STATIONS) {
      if (Math.abs(x - s.x) <= s.width / 2 + 6 && Math.abs(y - s.y) <= s.height / 2 + 6) {
        foundStation = s.id;
        break;
      }
    }
    hoveredStationRef.current = foundStation;

    let foundDaisy: string | null = null;
    for (const d of st.daisies) {
      if (Math.abs(x - d.x) <= 48 && Math.abs(y - d.y) <= 32) {
        foundDaisy = d.id;
        break;
      }
    }
    hoveredDaisyRef.current = foundDaisy;

    hoveredMiataRef.current =
      Math.abs(x - MIATA_GARAGE_BOUNDS.x) <= MIATA_GARAGE_BOUNDS.width / 2 &&
      Math.abs(y - MIATA_GARAGE_BOUNDS.y) <= MIATA_GARAGE_BOUNDS.height / 2;
  };

  const handleCanvasPointerDown = (e: React.PointerEvent<HTMLCanvasElement>) => {
    const st = gameStateRef.current;
    if (st.mode !== 'playing') return;

    const { x, y } = screenToWorld(e.clientX, e.clientY);

    // 1. Check if clicked Lilo or Champy Cat Companion
    for (const cat of st.cats) {
      if (Math.abs(x - cat.x) <= 28 && Math.abs(y - cat.y) <= 24) {
        handlePetCat(cat.id);
        return;
      }
    }

    // 2. Check if clicked the 1990 Mazda Miata MX-5 in the Garage Bay
    if (
      Math.abs(x - MIATA_GARAGE_BOUNDS.x) <= MIATA_GARAGE_BOUNDS.width / 2 &&
      Math.abs(y - MIATA_GARAGE_BOUNDS.y) <= MIATA_GARAGE_BOUNDS.height / 2
    ) {
      handleToggleMiataHeadlights();
      return;
    }

    // 3. Check if clicked a Daisy Planter Box
    for (const d of st.daisies) {
      if (Math.abs(x - d.x) <= 48 && Math.abs(y - d.y) <= 34) {
        handleWaterDaisyById(d.id);
        return;
      }
    }

    // 4. Check if clicked a waiting Customer or their Pokémon GBA dialogue box
    //    Clicking the customer/bubble automatically executes Smart Step (brews next step or serves!)
    const waitingCustomer = st.customers.find((c) => c.state === 'waiting');
    if (
      waitingCustomer &&
      x >= waitingCustomer.x - 32 &&
      x <= waitingCustomer.x + 220 &&
      y >= waitingCustomer.y - 44 &&
      y <= waitingCustomer.y + 36
    ) {
      handleSmartStep();
      return;
    }

    // 5. Check if clicked a Cafe Station
    for (const s of STATIONS) {
      if (Math.abs(x - s.x) <= s.width / 2 + 6 && Math.abs(y - s.y) <= s.height / 2 + 6) {
        handleTriggerStation(s.id);
        return;
      }
    }

    // 6. Otherwise walk Barista to the clicked spot
    st.barista.targetX = Math.max(168, Math.min(610, x));
    st.barista.targetY = Math.max(182, Math.min(410, y));
    soundEngine.playStep();
  };

  return (
    <main className="relative w-screen h-dvh overflow-hidden bg-[#0b0d12] flex flex-col justify-between">
      {/* External Top GBA Status HUD Bar (Single compact horizontal bar) */}
      {uiMode !== 'title' && (
        <TopHudBar
          hud={hud}
          dockCollapsed={dockCollapsed}
          onToggleDock={() => setDockCollapsed((prev) => !prev)}
          onToggleBgm={() => {
            soundEngine.toggleBgm();
            syncHudNow();
          }}
          onToggleMute={() => {
            soundEngine.toggleMute();
            syncHudNow();
          }}
          onCycleViewMode={handleCycleViewMode}
          onPause={() => {
            const st = gameStateRef.current;
            setSummaryStats({
              dayNumber: st.dayNumber,
              servedCount: st.servedCount,
              dailyTarget: st.dailyTarget,
              cozyRating: st.cozyRating,
              bestCozyRating: st.bestCozyRating,
              hearts: st.hearts,
              coins: st.coins,
            });
            syncBodyMode('paused');
          }}
          onRestart={handleRestartShift}
          onOpenCodeModal={() => setShowCodeModal(true)}
          onFinishShift={handleFinishShift}
        />
      )}

      {/* Dedicated Non-Overlapping GBA Pixel-Art Viewport Stage + Floating Corner Quick-Actions */}
      <div className="relative flex-1 min-h-0 w-full flex items-center justify-center p-1 bg-[#0b0d12]">
        <canvas
          ref={canvasRef}
          data-testid="klasik-canvas"
          width={WORLD_WIDTH}
          height={WORLD_HEIGHT}
          onPointerMove={handleCanvasPointerMove}
          onPointerDown={handleCanvasPointerDown}
          className="w-full h-full object-contain cursor-pointer border-[3px] border-[#334155]"
          style={{ imageRendering: 'pixelated' }}
        />

        {/* Floating Touch-Friendly Quick-Action Buttons on the bottom-right corner of the viewport */}
        {uiMode === 'playing' && (
          <div className="pointer-events-none absolute bottom-2.5 right-3 z-10">
            <FloatingCanvasQuickBar
              hud={hud}
              onSmartStep={handleSmartStep}
              onWaterNextDaisy={handleWaterNextDaisy}
              onPetCats={() => handlePetCat()}
              onCycleViewMode={handleCycleViewMode}
            />
          </div>
        )}
      </div>

      {/* Collapsible External Bottom GBA Action Dock */}
      {uiMode !== 'title' && (
        <BottomActionDock
          hud={hud}
          collapsed={dockCollapsed}
          onTriggerStation={handleTriggerStation}
          onServeCustomer={handleServeCustomer}
          onWaterNextDaisy={handleWaterNextDaisy}
          onToggleMiataHeadlights={handleToggleMiataHeadlights}
          onPetCats={() => handlePetCat()}
        />
      )}

      {/* Title Screen Overlay */}
      {uiMode === 'title' && (
        <TitleScreen
          onStart={handleStartGame}
          onOpenCodeModal={() => setShowCodeModal(true)}
        />
      )}

      {/* Pause or Shift Complete Modal */}
      {(uiMode === 'paused' || uiMode === 'gameover') && (
        <StatusModal
          mode={uiMode}
          stats={summaryStats}
          onResume={() => syncBodyMode('playing')}
          onRestart={handleRestartShift}
          onReturnTitle={handleReturnTitle}
          onOpenCodeModal={() => setShowCodeModal(true)}
        />
      )}

      {/* Single-File HTML Code Export Modal */}
      {showCodeModal && <CodeExportModal onClose={() => setShowCodeModal(false)} />}
    </main>
  );
}
