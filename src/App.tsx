import { useEffect, useRef, useState, useCallback } from 'react';
import {
  CafeState,
  createInitialCafeState,
  STATIONS,
  RECIPES,
  MIATA_GARAGE_BOUNDS,
  TIP_JAR_BOUNDS,
  TOOL_CHEST_BOUNDS,
  COUNTER_QUEUE_SLOTS,
  INSIDE_DOOR_MAT,
  GARDEN_DOOR_MAT,
  GARDEN_ORDER_WINDOW,
  DrinkId,
  StationId,
  RoomId,
  CatBehaviorState,
  NPC_NAMES,
  interactWithStation,
  advancePrepTimer,
  serveWaitingCustomer,
  waterDaisyPatch,
  waterAllThirstyDaisies,
  toggleMiataHeadlights,
  cycleMiataPaintColor,
  collectTipJar,
  triggerPhotoSquadFlash,
  hireNextStaff,
  petCatCompanion,
  executeSmartStep,
  toggleRoom,
  cycleTimeOfDay,
  cycleWeather,
  advanceEnvironmentAndHydration,
  screenToWorldContain,
  formatRealClock,
} from './game/rules';
import {
  ParticlePool,
  renderCafeWorld,
  WORLD_WIDTH,
  WORLD_HEIGHT,
} from './game/pixelArt';
import { soundEngine } from './game/sound';
import { TitleScreen } from './components/TitleScreen';
import {
  TopHudBar,
  BottomActionDock,
  FloatingCanvasQuickBar,
  HudSnapshot,
} from './components/HudOverlay';
import { ShiftSuccessNotification } from './components/DailyGoalProgressBar';
import { StatusModal, RunSummarySnapshot } from './components/StatusModal';
import { CodeExportModal } from './components/CodeExportModal';

function makeHudSnapshot(state: CafeState): HudSnapshot {
  const waitingCustomer = state.customers.find((c) => c.state === 'waiting') ?? null;
  const queueCount = state.customers.filter(
    (c) => c.state === 'waiting' || c.state === 'walking_in'
  ).length;
  const thirstyDaisyCount = state.daisies.filter((d) => d.needsWater).length;
  const hiredStaffCount = state.staff.filter((s) => s.hired).length;
  const nextStaff = state.staff.find((s) => !s.hired) ?? null;

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
    miataColor: state.miataColor,
    speedBoostActive: state.barista.speedBoostTimer > 0,
    waitingCustomerName: waitingCustomer ? waitingCustomer.name : null,
    waitingCustomerOrder: waitingCustomer ? waitingCustomer.order : null,
    queueCount,
    lastMessage: state.lastMessage,
    muted: soundEngine.muted,
    bgmEnabled: soundEngine.bgmEnabled,
    room: state.room,
    timeOfDay: state.timeOfDay,
    weather: state.weather,
    realClock: formatRealClock(new Date()),
    hiredStaffCount,
    nextStaffName: nextStaff ? nextStaff.name : null,
    nextStaffCost: nextStaff ? nextStaff.cost : null,
    tipJarCoins: state.tipJarCoins,
    shiftSuccessBannerVisible: state.shiftSuccessBannerVisible,
  };
}

export default function App() {
  const autostart =
    typeof window !== 'undefined' &&
    new URLSearchParams(window.location.search).get('autostart') === '1';

  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const gameStateRef = useRef<CafeState>(createInitialCafeState(autostart));
  const particlesRef = useRef<ParticlePool>(new ParticlePool());
  const hoveredStationRef = useRef<string | null>(null);
  const hoveredDaisyRef = useRef<string | null>(null);
  const hoveredMiataRef = useRef<boolean>(false);
  const keysPressedRef = useRef<Set<string>>(new Set());
  const hitstopTimerRef = useRef<number>(0);

  const [uiMode, setUiMode] = useState<'title' | 'playing' | 'paused' | 'gameover'>(
    autostart ? 'playing' : 'title'
  );
  // Bottom station dock is HIDDEN/COLLAPSED by default to maximize mobile & landscape canvas space!
  const [dockCollapsed, setDockCollapsed] = useState<boolean>(true);
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
        prev.miataColor === next.miataColor &&
        prev.speedBoostActive === next.speedBoostActive &&
        prev.waitingCustomerName === next.waitingCustomerName &&
        prev.waitingCustomerOrder === next.waitingCustomerOrder &&
        prev.queueCount === next.queueCount &&
        prev.lastMessage === next.lastMessage &&
        prev.muted === next.muted &&
        prev.bgmEnabled === next.bgmEnabled &&
        prev.room === next.room &&
        prev.timeOfDay === next.timeOfDay &&
        prev.weather === next.weather &&
        prev.realClock === next.realClock &&
        prev.hiredStaffCount === next.hiredStaffCount &&
        prev.tipJarCoins === next.tipJarCoins &&
        prev.shiftSuccessBannerVisible === next.shiftSuccessBannerVisible
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

  const handleDismissShiftSuccessBanner = useCallback(() => {
    gameStateRef.current.shiftSuccessBannerVisible = false;
    syncHudNow();
  }, [syncHudNow]);

  const handleTriggerStation = useCallback(
    (stationId: StationId) => {
      const st = gameStateRef.current;
      if (st.mode !== 'playing') return;

      const station = STATIONS.find((s) => s.id === stationId);
      if (station && stationId !== 'watering_can') {
        st.room = 'inside';
        st.barista.targetX = Math.max(90, Math.min(540, station.x));
        st.barista.targetY = 192;
        st.barista.scaleX = 1.15;
        st.barista.scaleY = 0.86;
      }

      if (stationId === 'cup_counter' && st.prep.currentStepIndex === 3) {
        const serveRes = serveWaitingCustomer(st);
        if (serveRes.served && serveRes.customer) {
          soundEngine.playServeSuccess();
          hitstopTimerRef.current = 0.045;
          particlesRef.current.emitBurst('heart', serveRes.customer.x, serveRes.customer.y - 24, 14);
          particlesRef.current.emitBurst('sparkle', 356, 234, 10);
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
    st.room = 'inside';

    const serveRes = serveWaitingCustomer(st);
    if (serveRes.served && serveRes.customer) {
      st.barista.targetX = 356;
      st.barista.targetY = 192;
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
        st.barista.targetX = Math.max(90, Math.min(540, station.x));
        st.barista.targetY = 192;
        st.barista.scaleX = 1.15;
        st.barista.scaleY = 0.86;
        particlesRef.current.emitBurst('sparkle', station.x, station.y - 10, 6);
      }
      soundEngine.playStationStart(res.stationId);
    } else if (res.type === 'serve' && res.servedResult?.served && res.servedResult.customer) {
      st.barista.targetX = 356;
      st.barista.targetY = 192;
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

  const handleWaterAllDaisies = useCallback(() => {
    const st = gameStateRef.current;
    if (st.mode !== 'playing') return;
    waterAllThirstyDaisies(st);
    st.barista.scaleX = 1.16;
    st.barista.scaleY = 0.85;
    soundEngine.playWaterDaisies();
    st.daisies.forEach((patch) => {
      particlesRef.current.emitBurst('water', patch.x, patch.y - 8, 10);
      particlesRef.current.emitBurst('sparkle', patch.x, patch.y - 14, 5);
    });
    syncHudNow();
  }, [syncHudNow]);

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

  const handleCycleMiataPaint = useCallback(() => {
    const st = gameStateRef.current;
    if (st.mode !== 'playing') return;
    cycleMiataPaintColor(st);
    soundEngine.playStepReady();
    particlesRef.current.emitBurst(
      'sparkle',
      MIATA_GARAGE_BOUNDS.x,
      MIATA_GARAGE_BOUNDS.y,
      14
    );
    syncHudNow();
  }, [syncHudNow]);

  const handleCollectTipJar = useCallback(() => {
    const st = gameStateRef.current;
    if (st.mode !== 'playing') return;
    const gained = collectTipJar(st);
    if (gained > 0) {
      soundEngine.playServeSuccess();
      particlesRef.current.emitBurst('sparkle', TIP_JAR_BOUNDS.x, TIP_JAR_BOUNDS.y - 8, 12);
    } else {
      soundEngine.playStep();
    }
    syncHudNow();
  }, [syncHudNow]);

  const handlePhotoSquadSnap = useCallback(() => {
    const st = gameStateRef.current;
    if (st.mode !== 'playing') return;
    triggerPhotoSquadFlash(st);
    soundEngine.playStepReady();
    particlesRef.current.emitBurst('sparkle', 748, 320, 12);
    syncHudNow();
  }, [syncHudNow]);

  const handleHireStaff = useCallback(() => {
    const st = gameStateRef.current;
    if (st.mode !== 'playing') return;
    const res = hireNextStaff(st);
    if (res.hired && res.worker) {
      soundEngine.playServeSuccess();
      particlesRef.current.emitBurst('sparkle', res.worker.x, res.worker.y - 16, 16);
      particlesRef.current.emitBurst('heart', res.worker.x, res.worker.y - 24, 10);
    } else {
      soundEngine.playStep();
    }
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

  const handleToggleRoom = useCallback(
    (targetRoom?: RoomId) => {
      const st = gameStateRef.current;
      toggleRoom(st, targetRoom);
      soundEngine.playStep();
      syncHudNow();
    },
    [syncHudNow]
  );

  const handleCycleTimeOfDay = useCallback(() => {
    const st = gameStateRef.current;
    cycleTimeOfDay(st);
    soundEngine.playStep();
    syncHudNow();
  }, [syncHudNow]);

  const handleCycleWeather = useCallback(() => {
    const st = gameStateRef.current;
    cycleWeather(st);
    soundEngine.playStep();
    syncHudNow();
  }, [syncHudNow]);

  // 100% Pixel-Accurate Coordinate Mapping for `object-fit: contain` letterboxing/pillarboxing
  const screenToWorld = useCallback((clientX: number, clientY: number) => {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };
    const rect = canvas.getBoundingClientRect();
    return screenToWorldContain(clientX, clientY, rect, WORLD_WIDTH, WORLD_HEIGHT);
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
          handleWaterAllDaisies();
        } else if (key === 'h') {
          handleToggleMiataHeadlights();
        } else if (key === 'k') {
          handleHireStaff();
        } else if (key === 'c') {
          handlePetCat();
        } else if (key === 'v') {
          handleToggleRoom();
        } else if (key === 't') {
          handleCycleTimeOfDay();
        } else if (key === 'g') {
          handleCycleWeather();
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
    handleWaterAllDaisies,
    handleToggleMiataHeadlights,
    handleHireStaff,
    handlePetCat,
    handleToggleRoom,
    handleCycleTimeOfDay,
    handleCycleWeather,
    syncBodyMode,
    syncHudNow,
  ]);

  // Isolated 60fps Canvas2D Simulation & Render Loop with afterDraw yield
  useEffect(() => {
    let rafId = 0;
    let timerId = 0;
    let cancelled = false;
    let lastTime = performance.now();
    let customerIdCounter = 3;

    const tick = (now: number) => {
      if (cancelled) return;
      const rawDt = (now - lastTime) / 1000;
      lastTime = now;
      const dt = Math.min(rawDt, 0.05);
      const timeSec = now / 1000;

      const st = gameStateRef.current;
      const particles = particlesRef.current;

      soundEngine.updateBgm(dt);

      // Ambient weather particles (Rain, Breeze Daisy Petals, or Pollen)
      if (st.weather === 'rain') {
        for (let r = 0; r < 2; r++) {
          particles.spawn(
            'rain',
            40 + Math.random() * (WORLD_WIDTH - 40),
            60 + Math.random() * 140,
            -55,
            290 + Math.random() * 50,
            0.75 + Math.random() * 0.35,
            3,
            '#7dd3fc'
          );
        }
      } else if (st.weather === 'breeze') {
        if (Math.random() < 0.38) {
          particles.spawn(
            'petal',
            Math.random() * (WORLD_WIDTH - 80),
            80 + Math.random() * (WORLD_HEIGHT - 120),
            42 + Math.random() * 24,
            12 + Math.sin(timeSec * 3) * 10,
            2.4,
            5,
            '#ffffff'
          );
        }
      } else if (Math.random() < 0.12) {
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
        const minX = 64;
        const maxX = 840;
        const minY = st.room === 'inside' ? 145 : 128;
        const maxY = 435;

        if (moveX !== 0 || moveY !== 0) {
          const len = Math.hypot(moveX, moveY);
          const dx = (moveX / len) * baseSpeed * simDt;
          const dy = (moveY / len) * baseSpeed * simDt;
          st.barista.x = Math.max(minX, Math.min(maxX, st.barista.x + dx));
          st.barista.y = Math.max(minY, Math.min(maxY, st.barista.y + dy));
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
          particlesRef.current.emitBurst('sparkle', 356, 236, 8);
          updateHudIfChanged(st);
        }

        // 3. Expanded 6-State Cats (Lilo inside Cafe/Garage & Champy in Garden)
        st.cats.forEach((cat) => {
          cat.tailPhase += simDt * 2.6;
          if (cat.state === 'yarn_play') {
            cat.hopPhase += simDt;
          } else {
            cat.hopPhase = 0;
          }
          if (cat.heartTimer > 0) {
            cat.heartTimer = Math.max(0, cat.heartTimer - simDt);
          }

          if (cat.state === 'walking') {
            const cdx = cat.targetX - cat.x;
            const cdy = cat.targetY - cat.y;
            const cdist = Math.hypot(cdx, cdy);
            const moveSpeed = 52;
            if (cdist > 2) {
              const cstep = Math.min(cdist, moveSpeed * simDt);
              cat.x += (cdx / cdist) * cstep;
              cat.y += (cdy / cdist) * cstep;
              cat.facing = cdx < 0 ? 'left' : 'right';
            } else {
              cat.state = cat.nextStateAfterWalk;
              cat.stateTimer = 4.2 + Math.random() * 2.5;
            }
          } else {
            cat.stateTimer -= simDt;
            if (cat.stateTimer <= 0) {
              const restCycle: CatBehaviorState[] = [
                'napping',
                'sitting_grooming',
                'stretching',
                'yarn_play',
                'purring',
              ];
              const nextBehavior = restCycle[Math.floor(Math.random() * restCycle.length)];
              if (cat.id === 'lilo') {
                const liloWaypoints = [
                  { x: 748, y: 274 },
                  { x: 496, y: 246 },
                  { x: 264, y: 348 },
                ];
                const nextSpot =
                  liloWaypoints.find((w) => Math.hypot(w.x - cat.x, w.y - cat.y) > 40) ??
                  liloWaypoints[0];
                cat.targetX = nextSpot.x;
                cat.targetY = nextSpot.y;
                cat.nextStateAfterWalk = nextBehavior;
                cat.state = 'walking';
              } else {
                const champyWaypoints = [
                  { x: 310, y: 332 },
                  { x: 204, y: 390 },
                  { x: 590, y: 332 },
                  { x: 696, y: 390 },
                ];
                const candidates = champyWaypoints.filter(
                  (w) => Math.hypot(w.x - cat.x, w.y - cat.y) > 45
                );
                const pick =
                  candidates[Math.floor(Math.random() * candidates.length)] ?? champyWaypoints[0];
                cat.targetX = pick.x;
                cat.targetY = pick.y;
                cat.nextStateAfterWalk = nextBehavior;
                cat.state = 'walking';
              }
            }
          }
        });

        // 4. Environment, Couples, Photo Squad & Hired Staff Workers Progression
        let needsHudRefresh = advanceEnvironmentAndHydration(st, simDt);

        // 5. Update Floating World Popups
        for (let i = st.popups.length - 1; i >= 0; i--) {
          const pop = st.popups[i];
          pop.life -= simDt;
          pop.y += pop.vy * simDt;
          if (pop.life <= 0) {
            st.popups.splice(i, 1);
          }
        }

        // 6. Update NPC Customers (both Inside and in the Backyard Garden + 2-slot Counter Queue!)
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
                c.targetX = c.room === 'inside' ? 356 : 450;
                c.targetY = 500;
              }
            } else if (c.state === 'walking_out') {
              st.customers.splice(i, 1);
            }
          }
        }

        // Keep up to 2 customers in the active counter queue
        const queueCustomers = st.customers.filter(
          (c) => c.state === 'walking_in' || c.state === 'waiting'
        );
        // Ensure first waiting customer moves up to slot 0
        if (queueCustomers[0]) {
          queueCustomers[0].targetX = COUNTER_QUEUE_SLOTS[0].x;
          queueCustomers[0].targetY = COUNTER_QUEUE_SLOTS[0].y;
        }
        if (queueCustomers[1]) {
          queueCustomers[1].targetX = COUNTER_QUEUE_SLOTS[1].x;
          queueCustomers[1].targetY = COUNTER_QUEUE_SLOTS[1].y;
        }

        if (queueCustomers.length < 2) {
          const slotIndex = queueCustomers.length;
          const slot = COUNTER_QUEUE_SLOTS[slotIndex] ?? COUNTER_QUEUE_SLOTS[0];
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
            room: 'inside',
            state: 'walking_in',
            queueSlot: slotIndex,
            x: slot.x,
            y: 455 + slotIndex * 24,
            targetX: slot.x,
            targetY: slot.y,
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
            hoveredMiataRef.current
          );
        }
      }

      timerId = window.setTimeout(() => {
        if (!cancelled) {
          rafId = requestAnimationFrame(tick);
        }
      }, 40);
    };

    rafId = requestAnimationFrame(tick);
    return () => {
      cancelled = true;
      window.clearTimeout(timerId);
      cancelAnimationFrame(rafId);
    };
  }, [updateHudIfChanged]);

  // Canvas pointer hover & click handling per active Room Map (`inside` vs `garden`)
  const handleCanvasPointerMove = (e: React.PointerEvent<HTMLCanvasElement>) => {
    const { x, y } = screenToWorld(e.clientX, e.clientY);
    const st = gameStateRef.current;

    if (st.room === 'inside') {
      let foundStation: string | null = null;
      for (const s of STATIONS) {
        if (s.id === 'watering_can') continue;
        if (Math.abs(x - s.x) <= s.width / 2 + 6 && Math.abs(y - s.y) <= s.height / 2 + 6) {
          foundStation = s.id;
          break;
        }
      }
      hoveredStationRef.current = foundStation;
      hoveredDaisyRef.current = null;
      hoveredMiataRef.current =
        Math.abs(x - MIATA_GARAGE_BOUNDS.x) <= MIATA_GARAGE_BOUNDS.width / 2 &&
        Math.abs(y - MIATA_GARAGE_BOUNDS.y) <= MIATA_GARAGE_BOUNDS.height / 2;
    } else {
      hoveredMiataRef.current = false;
      const well = STATIONS.find((s) => s.id === 'watering_can');
      hoveredStationRef.current =
        well && Math.abs(x - well.x) <= well.width / 2 + 8 && Math.abs(y - well.y) <= well.height / 2 + 8
          ? 'watering_can'
          : null;

      let foundDaisy: string | null = null;
      for (const d of st.daisies) {
        if (Math.abs(x - d.x) <= 54 && Math.abs(y - d.y) <= 34) {
          foundDaisy = d.id;
          break;
        }
      }
      hoveredDaisyRef.current = foundDaisy;
    }
  };

  const handleCanvasPointerDown = (e: React.PointerEvent<HTMLCanvasElement>) => {
    const st = gameStateRef.current;
    if (st.mode !== 'playing') return;

    const { x, y } = screenToWorld(e.clientX, e.clientY);

    // 1. Check if clicked Lilo or Champy in the current room
    for (const cat of st.cats) {
      if (cat.room === st.room && Math.abs(x - cat.x) <= 28 && Math.abs(y - cat.y) <= 24) {
        handlePetCat(cat.id);
        return;
      }
    }

    if (st.room === 'inside') {
      // Check South Doorway Mat -> Switch to GARDEN map
      if (
        Math.abs(x - INSIDE_DOOR_MAT.x) <= INSIDE_DOOR_MAT.width / 2 + 6 &&
        Math.abs(y - INSIDE_DOOR_MAT.y) <= INSIDE_DOOR_MAT.height / 2 + 6
      ) {
        handleToggleRoom('garden');
        return;
      }

      // Check Counter Tip Jar
      if (
        Math.abs(x - TIP_JAR_BOUNDS.x) <= TIP_JAR_BOUNDS.width / 2 + 8 &&
        Math.abs(y - TIP_JAR_BOUNDS.y) <= TIP_JAR_BOUNDS.height / 2 + 8
      ) {
        handleCollectTipJar();
        return;
      }

      // Check Garage Mechanic Tool Chest -> Cycle Miata Custom Paint
      if (
        Math.abs(x - TOOL_CHEST_BOUNDS.x) <= TOOL_CHEST_BOUNDS.width / 2 + 8 &&
        Math.abs(y - TOOL_CHEST_BOUNDS.y) <= TOOL_CHEST_BOUNDS.height / 2 + 8
      ) {
        handleCycleMiataPaint();
        return;
      }

      // Check Miata Photo Squad (Trio of Friends)
      if (Math.abs(x - 748) <= 68 && Math.abs(y - 328) <= 32) {
        handlePhotoSquadSnap();
        return;
      }

      // Check Classic Red 1990 Mazda Miata MX-5 in the Garage Showroom
      if (
        Math.abs(x - MIATA_GARAGE_BOUNDS.x) <= MIATA_GARAGE_BOUNDS.width / 2 &&
        Math.abs(y - MIATA_GARAGE_BOUNDS.y) <= MIATA_GARAGE_BOUNDS.height / 2
      ) {
        handleToggleMiataHeadlights();
        return;
      }

      // Check waiting Customers or their Pokémon GBA dialogue box
      const waitingCustomer = st.customers.find((c) => c.state === 'waiting');
      if (
        waitingCustomer &&
        x >= waitingCustomer.x - 90 &&
        x <= waitingCustomer.x + 220 &&
        y >= waitingCustomer.y - 44 &&
        y <= waitingCustomer.y + 36
      ) {
        handleSmartStep();
        return;
      }

      // Check Indoor Brewing & Pickup Stations
      for (const s of STATIONS) {
        if (s.id === 'watering_can') continue;
        if (Math.abs(x - s.x) <= s.width / 2 + 6 && Math.abs(y - s.y) <= s.height / 2 + 6) {
          handleTriggerStation(s.id);
          return;
        }
      }
    } else {
      // GARDEN ROOM INTERACTIONS
      // Check North Veranda Doorway Mat -> Switch to INSIDE map
      if (
        Math.abs(x - GARDEN_DOOR_MAT.x) <= GARDEN_DOOR_MAT.width / 2 + 6 &&
        Math.abs(y - GARDEN_DOOR_MAT.y) <= GARDEN_DOOR_MAT.height / 2 + 6
      ) {
        handleToggleRoom('inside');
        return;
      }

      // Check Veranda Pass-Through Order Window -> Smart Step!
      if (
        Math.abs(x - GARDEN_ORDER_WINDOW.x) <= GARDEN_ORDER_WINDOW.width / 2 + 6 &&
        Math.abs(y - GARDEN_ORDER_WINDOW.y) <= GARDEN_ORDER_WINDOW.height / 2 + 6
      ) {
        handleSmartStep();
        return;
      }

      // Check Center Garden Watering Well -> Hydrate all thirsty daisies!
      const well = STATIONS.find((s) => s.id === 'watering_can');
      if (
        well &&
        Math.abs(x - well.x) <= well.width / 2 + 8 &&
        Math.abs(y - well.y) <= well.height / 2 + 8
      ) {
        handleWaterAllDaisies();
        return;
      }

      // Check 6 Blooming Daisy Planter Beds
      for (const d of st.daisies) {
        if (Math.abs(x - d.x) <= 54 && Math.abs(y - d.y) <= 34) {
          handleWaterDaisyById(d.id);
          return;
        }
      }
    }

    // Otherwise walk Barista to the clicked spot
    st.barista.targetX = Math.max(64, Math.min(840, x));
    st.barista.targetY = Math.max(135, Math.min(435, y));
    soundEngine.playStep();
  };

  return (
    <main className="relative w-screen h-dvh overflow-hidden bg-[#0b0d12] flex flex-col justify-between">
      {/* External Top GBA Status HUD Bar (Zero Horizontal Scroll) */}
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
          onToggleRoom={() => handleToggleRoom()}
          onCycleTimeOfDay={handleCycleTimeOfDay}
          onCycleWeather={handleCycleWeather}
          onHireStaff={handleHireStaff}
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

      {/* Dedicated Non-Overlapping GBA Pixel-Art Viewport Stage + Shift Success Banner + Floating Corner Quick-Actions */}
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

        {/* Shift Success Notification Banner when Daily Goal is Reached */}
        {uiMode === 'playing' && (
          <ShiftSuccessNotification
            visible={hud.shiftSuccessBannerVisible}
            servedCount={hud.servedCount}
            dailyTarget={hud.dailyTarget}
            coins={hud.coins}
            cozyRating={hud.cozyRating}
            onFinishShift={handleFinishShift}
            onDismiss={handleDismissShiftSuccessBanner}
          />
        )}

        {/* Floating Touch-Friendly Quick-Action Buttons on the bottom-right corner of the viewport */}
        {uiMode === 'playing' && (
          <div className="pointer-events-none absolute bottom-2.5 right-3 z-10">
            <FloatingCanvasQuickBar
              hud={hud}
              onSmartStep={handleSmartStep}
              onWaterAllDaisies={handleWaterAllDaisies}
              onHireStaff={handleHireStaff}
              onPetCats={() => handlePetCat()}
              onToggleRoom={() => handleToggleRoom()}
            />
          </div>
        )}
      </div>

      {/* Collapsible External Bottom GBA Action Dock (Hidden by Default) */}
      {uiMode !== 'title' && (
        <BottomActionDock
          hud={hud}
          collapsed={dockCollapsed}
          onTriggerStation={handleTriggerStation}
          onServeCustomer={handleServeCustomer}
          onWaterAllDaisies={handleWaterAllDaisies}
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
