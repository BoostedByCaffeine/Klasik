import { useEffect, useRef, useState, useCallback } from 'react';
import {
  CafeState,
  createInitialCafeState,
  STATIONS,
  MIATA_GARAGE_BOUNDS,
  TIP_JAR_BOUNDS,
  TOOL_CHEST_BOUNDS,
  COUNTER_QUEUE_SLOTS,
  INSIDE_DOOR_MAT,
  GARDEN_DOOR_MAT,
  GARDEN_ORDER_WINDOW,
  MAX_SIMULTANEOUS_CUSTOMERS,
  DrinkId,
  StationId,
  RoomId,
  CatBehaviorState,
  BaristaAppearance,
  UpgradeId,
  UpgradableStationId,
  DecorItemId,
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
  hireStaffById,
  petCatCompanion,
  executeSmartStep,
  toggleRoom,
  cycleTimeOfDay,
  cycleWeather,
  advanceEnvironmentAndHydration,
  advanceCustomersSimulation,
  updateBaristaAppearance,
  restockWholesaleIngredients,
  toggleWholesaleAutoRestock,
  purchaseCapitalUpgrade,
  upgradeStationEquipment,
  purchaseOrToggleDecor,
  createCustomerParty,
  moveEntityWithCollisions,
  stepAlongWaypoints,
  completeShift,
  screenToWorldContain,
  Camera2D,
  clampCamera2D,
  getDefaultCameraForViewport,
  formatRealClock,
  resetCafeProgressV2,
} from './game/rules';
import {
  ParticlePool,
  renderCafeWorld,
  WORLD_WIDTH,
  WORLD_HEIGHT,
} from './game/pixelArt';
import { soundEngine } from './game/sound';
import { BootLoadingScreen, TitleScreen } from './components/TitleScreen';
import {
  TopHudBar,
  BottomActionDock,
  FloatingCanvasQuickBar,
  HudSnapshot,
} from './components/HudOverlay';
import { ShiftSuccessNotification } from './components/DailyGoalProgressBar';
import { StatusModal, RunSummarySnapshot } from './components/StatusModal';
import { CodeExportModal } from './components/CodeExportModal';
import { CustomizeModal } from './components/CustomizeModal';
import { BizUpgradesModal } from './components/BizUpgradesModal';
import { RecipeMenuModal } from './components/RecipeMenuModal';
import { PwaApkModal } from './components/PwaApkModal';
import {
  initKlasikPwa,
  BeforeInstallPromptEvent,
  isStandaloneApp,
} from './pwa/pwaManager';

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
    dailyStreak: state.dailyStreak,
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
    appearance: { ...state.appearance },
    finance: {
      ...state.finance,
      upgrades: { ...state.finance.upgrades },
    },
    staff: state.staff.map((w) => ({ ...w })),
    stationLevels: { ...state.stationLevels },
    decorOwned: { ...state.decorOwned },
    decorEquipped: { ...state.decorEquipped },
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

  const [uiMode, setUiMode] = useState<'boot' | 'title' | 'playing' | 'paused' | 'gameover'>(
    autostart ? 'playing' : 'boot'
  );
  const [dockCollapsed, setDockCollapsed] = useState<boolean>(true);
  const [hud, setHud] = useState<HudSnapshot>(() => makeHudSnapshot(gameStateRef.current));
  const [summaryStats, setSummaryStats] = useState<RunSummarySnapshot>({
    dayNumber: 1,
    dailyStreak: gameStateRef.current.dailyStreak,
    newlyUnlockedOutfits: [],
    servedCount: 0,
    dailyTarget: 6,
    cozyRating: 82,
    bestCozyRating: 85,
    hearts: 3,
    coins: 45,
  });
  const [showCodeModal, setShowCodeModal] = useState(false);
  const [showCustomizeModal, setShowCustomizeModal] = useState(false);
  const [showBizModal, setShowBizModal] = useState(false);
  const [showMenuModal, setShowMenuModal] = useState(false);
  const [showPwaModal, setShowPwaModal] = useState(false);
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [isStandalone, setIsStandalone] = useState<boolean>(() => isStandaloneApp());
  const [isPwaInstalled, setIsPwaInstalled] = useState<boolean>(() => isStandaloneApp());
  const [swRegistered, setSwRegistered] = useState<boolean>(false);
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);

  const cameraRef = useRef<Camera2D>(
    typeof window !== 'undefined'
      ? getDefaultCameraForViewport(window.innerWidth, window.innerHeight, 'inside')
      : { zoom: 1, panX: WORLD_WIDTH / 2, panY: WORLD_HEIGHT / 2 }
  );
  const [cameraZoom, setCameraZoom] = useState<number>(() => cameraRef.current.zoom);
  const activePointersRef = useRef<Map<number, { x: number; y: number }>>(new Map());
  const pinchStartDistRef = useRef<number | null>(null);
  const pinchStartZoomRef = useRef<number>(1);
  const dragStateRef = useRef<{
    pointerId: number;
    startX: number;
    startY: number;
    startPanX: number;
    startPanY: number;
    maxDist: number;
  } | null>(null);
  const lastTapTimeRef = useRef<number>(0);

  const applyCamera = useCallback((next: Camera2D) => {
    const clamped = clampCamera2D(next, WORLD_WIDTH, WORLD_HEIGHT);
    cameraRef.current = clamped;
    setCameraZoom(clamped.zoom);
  }, []);

  const handleZoomIn = useCallback(() => {
    applyCamera({
      ...cameraRef.current,
      zoom: Number((cameraRef.current.zoom + 0.25).toFixed(2)),
    });
  }, [applyCamera]);

  const handleZoomOut = useCallback(() => {
    applyCamera({
      ...cameraRef.current,
      zoom: Number((cameraRef.current.zoom - 0.25).toFixed(2)),
    });
  }, [applyCamera]);

  const handleResetZoom = useCallback(() => {
    if (cameraRef.current.zoom > 1.03) {
      applyCamera({ zoom: 1, panX: WORLD_WIDTH / 2, panY: WORLD_HEIGHT / 2 });
    } else {
      const room = gameStateRef.current.room;
      applyCamera({
        zoom: 1.55,
        panX: room === 'inside' ? 296 : 450,
        panY: room === 'inside' ? 220 : 254,
      });
    }
  }, [applyCamera]);

  const updateHudIfChanged = useCallback((st: CafeState) => {
    const next = makeHudSnapshot(st);
    setHud(next);
  }, []);

  const syncHudNow = useCallback(() => {
    updateHudIfChanged(gameStateRef.current);
  }, [updateHudIfChanged]);

  const syncBodyMode = useCallback(
    (mode: 'boot' | 'title' | 'playing' | 'paused' | 'gameover') => {
      gameStateRef.current.mode = mode;
      document.body.dataset.state = mode === 'boot' ? 'title' : mode;
      setUiMode(mode);
    },
    []
  );

  useEffect(() => {
    document.body.dataset.state = autostart ? 'playing' : 'title';
  }, [autostart]);

  useEffect(() => {
    let lastPortrait = window.innerHeight > window.innerWidth;
    const onResize = () => {
      const isPortraitNow = window.innerHeight > window.innerWidth;
      if (isPortraitNow !== lastPortrait) {
        lastPortrait = isPortraitNow;
        applyCamera(
          getDefaultCameraForViewport(
            window.innerWidth,
            window.innerHeight,
            gameStateRef.current.room
          )
        );
      }
    };
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, [applyCamera]);

  useEffect(() => {
    void initKlasikPwa().then((res) => {
      setSwRegistered(res.swRegistered);
    });

    const syncStandaloneStatus = () => {
      const standaloneNow = isStandaloneApp();
      setIsStandalone(standaloneNow);
      if (standaloneNow) {
        setIsPwaInstalled(true);
        setShowPwaModal(false);
      }
    };
    syncStandaloneStatus();

    const onBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
    };
    const onAppInstalled = () => {
      setIsPwaInstalled(true);
      setIsStandalone(isStandaloneApp());
      setDeferredPrompt(null);
      setShowPwaModal(false);
    };
    const onFullscreenChange = () => {
      setIsFullscreen(Boolean(document.fullscreenElement));
    };

    window.addEventListener('beforeinstallprompt', onBeforeInstallPrompt);
    window.addEventListener('appinstalled', onAppInstalled);
    document.addEventListener('fullscreenchange', onFullscreenChange);
    return () => {
      window.removeEventListener('beforeinstallprompt', onBeforeInstallPrompt);
      window.removeEventListener('appinstalled', onAppInstalled);
      document.removeEventListener('fullscreenchange', onFullscreenChange);
    };
  }, []);

  const handleToggleFullscreen = useCallback(() => {
    try {
      if (!document.fullscreenElement) {
        void document.documentElement.requestFullscreen?.();
      } else {
        void document.exitFullscreen?.();
      }
    } catch {
      // Ignore fullscreen permission errors in restricted contexts
    }
  }, []);

  const handleTriggerInstallPrompt = useCallback(async (): Promise<boolean> => {
    if (deferredPrompt) {
      let accepted = false;
      try {
        await deferredPrompt.prompt();
        const choice = await deferredPrompt.userChoice;
        if (choice.outcome === 'accepted') {
          setIsPwaInstalled(true);
          accepted = true;
        }
      } catch {
        // Ignore prompt rejection
      }
      setDeferredPrompt(null);
      return accepted;
    }
    return false;
  }, [deferredPrompt]);

  const handleOpenInstallOrApkModal = useCallback(() => {
    if (deferredPrompt) {
      void handleTriggerInstallPrompt();
    }
    setShowPwaModal(true);
  }, [deferredPrompt, handleTriggerInstallPrompt]);

  const handleResetSave = useCallback(() => {
    const fresh = resetCafeProgressV2(true);
    gameStateRef.current = fresh;
    soundEngine.playCustomerBell();
    syncHudNow();
  }, [syncHudNow]);

  const handleBootComplete = useCallback(() => {
    if (gameStateRef.current.mode === 'boot') {
      syncBodyMode('title');
      syncHudNow();
    }
  }, [syncBodyMode, syncHudNow]);

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
    const prev = gameStateRef.current;
    const isNextDay = prev.mode === 'gameover';
    const fresh = createInitialCafeState(true, prev.dailyStreak);
    fresh.appearance = { ...prev.appearance };
    fresh.dayNumber = prev.dayNumber + (isNextDay ? 1 : 0);
    if (isNextDay) {
      fresh.coins = prev.coins;
      fresh.hearts = prev.hearts;
      fresh.bestCozyRating = prev.bestCozyRating;
      fresh.stationLevels = { ...prev.stationLevels };
      fresh.decorOwned = { ...prev.decorOwned };
      fresh.decorEquipped = { ...prev.decorEquipped };
      fresh.finance = {
        ...prev.finance,
        upgrades: { ...prev.finance.upgrades },
      };
      fresh.staff = prev.staff.map((w) => ({
        ...w,
        carryingProp: null,
      }));
    }
    gameStateRef.current = fresh;
    syncBodyMode('playing');
    soundEngine.playCustomerBell();
    syncHudNow();
  }, [syncBodyMode, syncHudNow]);

  const handleReturnTitle = useCallback(() => {
    keysPressedRef.current.clear();
    const prevAppearance = { ...gameStateRef.current.appearance };
    const prevStreak = gameStateRef.current.dailyStreak;
    const fresh = createInitialCafeState(false, prevStreak);
    fresh.mode = 'title';
    fresh.appearance = prevAppearance;
    gameStateRef.current = fresh;
    syncBodyMode('title');
    syncHudNow();
  }, [syncBodyMode, syncHudNow]);

  const handleFinishShift = useCallback(() => {
    const st = gameStateRef.current;
    const completion = completeShift(st);
    setSummaryStats({
      dayNumber: st.dayNumber,
      dailyStreak: st.dailyStreak,
      newlyUnlockedOutfits: completion.newlyUnlockedOutfits,
      servedCount: st.servedCount,
      dailyTarget: st.dailyTarget,
      cozyRating: st.cozyRating,
      bestCozyRating: st.bestCozyRating,
      hearts: st.hearts,
      coins: st.coins,
    });
    soundEngine.playServeSuccess();
    syncBodyMode('gameover');
    syncHudNow();
  }, [syncBodyMode, syncHudNow]);

  const handleDismissShiftSuccessBanner = useCallback(() => {
    gameStateRef.current.shiftSuccessBannerVisible = false;
    syncHudNow();
  }, [syncHudNow]);

  const handleSaveAppearance = useCallback(
    (updated: BaristaAppearance) => {
      updateBaristaAppearance(gameStateRef.current, updated);
      soundEngine.playStepReady();
      syncHudNow();
    },
    [syncHudNow]
  );

  const handleRestockWholesale = useCallback(() => {
    const res = restockWholesaleIngredients(gameStateRef.current);
    if (res.restocked) {
      soundEngine.playServeSuccess();
    } else {
      soundEngine.playStep();
    }
    syncHudNow();
  }, [syncHudNow]);

  const handleToggleAutoRestock = useCallback(() => {
    const enabled = toggleWholesaleAutoRestock(gameStateRef.current);
    if (enabled) {
      soundEngine.playStepReady();
    } else {
      soundEngine.playStep();
    }
    syncHudNow();
  }, [syncHudNow]);

  const handlePurchaseUpgrade = useCallback(
    (upgradeId: UpgradeId) => {
      const res = purchaseCapitalUpgrade(gameStateRef.current, upgradeId);
      if (res.purchased) {
        soundEngine.playServeSuccess();
      } else {
        soundEngine.playStep();
      }
      syncHudNow();
    },
    [syncHudNow]
  );

  const handleHireStaffById = useCallback(
    (staffId: 'momo' | 'ken') => {
      const st = gameStateRef.current;
      const res = hireStaffById(st, staffId);
      if (res.hired && res.worker) {
        soundEngine.playServeSuccess();
        particlesRef.current.emitBurst('sparkle', res.worker.x, res.worker.y - 16, 16);
        particlesRef.current.emitBurst('heart', res.worker.x, res.worker.y - 24, 10);
      } else {
        soundEngine.playStep();
      }
      syncHudNow();
    },
    [syncHudNow]
  );

  const handleUpgradeStation = useCallback(
    (stationId: UpgradableStationId) => {
      const st = gameStateRef.current;
      const res = upgradeStationEquipment(st, stationId);
      if (res.upgraded) {
        soundEngine.playServeSuccess();
        const station = STATIONS.find((s) => s.id === stationId);
        if (station) {
          particlesRef.current.emitBurst('sparkle', station.x, station.y - 12, 16);
        }
      } else {
        soundEngine.playStep();
      }
      syncHudNow();
    },
    [syncHudNow]
  );

  const handlePurchaseOrToggleDecor = useCallback(
    (decorId: DecorItemId) => {
      const st = gameStateRef.current;
      const res = purchaseOrToggleDecor(st, decorId);
      if (res.purchased || res.equipped) {
        soundEngine.playServeSuccess();
      } else {
        soundEngine.playStep();
      }
      syncHudNow();
    },
    [syncHudNow]
  );

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
      const nextRoom = toggleRoom(st, targetRoom);
      if (cameraRef.current.zoom > 1.05) {
        applyCamera({
          zoom: cameraRef.current.zoom,
          panX: nextRoom === 'inside' ? 296 : 450,
          panY: nextRoom === 'inside' ? 220 : 254,
        });
      }
      soundEngine.playStep();
      syncHudNow();
    },
    [applyCamera, syncHudNow]
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

  const screenToWorld = useCallback((clientX: number, clientY: number) => {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };
    const rect = canvas.getBoundingClientRect();
    return screenToWorldContain(
      clientX,
      clientY,
      rect,
      WORLD_WIDTH,
      WORLD_HEIGHT,
      cameraRef.current
    );
  }, []);

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (showCodeModal || showCustomizeModal || showBizModal || showMenuModal || showPwaModal) {
        if (e.key === 'Escape') {
          setShowCodeModal(false);
          setShowCustomizeModal(false);
          setShowBizModal(false);
          setShowMenuModal(false);
          setShowPwaModal(false);
        }
        return;
      }

      const mode = gameStateRef.current.mode;

      if (mode === 'boot') {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          handleBootComplete();
        }
        return;
      }

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
            dailyStreak: st.dailyStreak,
            newlyUnlockedOutfits: [],
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
        } else if (key === 'u') {
          setShowBizModal(true);
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
    showCustomizeModal,
    showBizModal,
    showMenuModal,
    showPwaModal,
    handleBootComplete,
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
          const moved = moveEntityWithCollisions(st.barista, dx, dy, st.room, 11);
          const actualDist = Math.hypot(moved.movedX, moved.movedY);
          st.barista.targetX = st.barista.x;
          st.barista.targetY = st.barista.y;
          st.barista.waypoints = undefined;
          st.barista.walkDist += actualDist;
          if (Math.abs(moveX) > Math.abs(moveY)) {
            st.barista.facing = moveX < 0 ? 'left' : 'right';
          } else {
            st.barista.facing = moveY < 0 ? 'up' : 'down';
          }
        } else {
          const dist = Math.hypot(
            st.barista.targetX - st.barista.x,
            st.barista.targetY - st.barista.y
          );
          if (dist > 2) {
            const stepped = stepAlongWaypoints(st.barista, baseSpeed, simDt, st.room, 11);
            st.barista.walkDist += stepped.distMoved;
            if (Math.abs(stepped.dx) > Math.abs(stepped.dy)) {
              st.barista.facing = stepped.dx < 0 ? 'left' : 'right';
            } else if (Math.abs(stepped.dy) > 0) {
              st.barista.facing = stepped.dy < 0 ? 'up' : 'down';
            }
          }
        }

        st.barista.scaleX += (1 - st.barista.scaleX) * Math.min(1, simDt * 12);
        st.barista.scaleY += (1 - st.barista.scaleY) * Math.min(1, simDt * 12);

        const stepFinished = advancePrepTimer(st, simDt);
        if (stepFinished) {
          soundEngine.playStepReady();
          particlesRef.current.emitBurst('sparkle', 356, 236, 8);
          updateHudIfChanged(st);
        }

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
            const cdist = Math.hypot(cat.targetX - cat.x, cat.targetY - cat.y);
            const moveSpeed = 52;
            if (cdist > 2) {
              const steppedCat = stepAlongWaypoints(cat, moveSpeed, simDt, cat.room, 8);
              if (steppedCat.dx !== 0) {
                cat.facing = steppedCat.dx < 0 ? 'left' : 'right';
              }
              if (steppedCat.reachedFinal || steppedCat.distMoved < 0.05) {
                cat.state = cat.nextStateAfterWalk;
                cat.stateTimer = 4.2 + Math.random() * 2.5;
              }
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
                  { x: 648, y: 294 },
                  { x: 496, y: 246 },
                  { x: 264, y: 294 },
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
                  { x: 310, y: 312 },
                  { x: 368, y: 382 },
                  { x: 540, y: 312 },
                  { x: 532, y: 382 },
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

        let needsHudRefresh = advanceEnvironmentAndHydration(st, simDt);

        for (let i = st.popups.length - 1; i >= 0; i--) {
          const pop = st.popups[i];
          pop.life -= simDt;
          pop.y += pop.vy * simDt;
          if (pop.life <= 0) {
            st.popups.splice(i, 1);
          }
        }

        if (advanceCustomersSimulation(st, simDt)) {
          needsHudRefresh = true;
        }

        const queueCustomers = st.customers.filter(
          (c) => c.state === 'walking_in' || c.state === 'waiting'
        );
        if (queueCustomers[0]) {
          queueCustomers[0].targetX = COUNTER_QUEUE_SLOTS[0].x;
          queueCustomers[0].targetY = COUNTER_QUEUE_SLOTS[0].y;
        }
        if (queueCustomers[1]) {
          queueCustomers[1].targetX = COUNTER_QUEUE_SLOTS[1].x;
          queueCustomers[1].targetY = COUNTER_QUEUE_SLOTS[1].y;
        }

        if (
          st.customers.length < MAX_SIMULTANEOUS_CUSTOMERS &&
          queueCustomers.length < 2
        ) {
          const slotIndex = queueCustomers.length;
          st.customers.push(
            createCustomerParty(customerIdCounter, slotIndex, st.elapsedSeconds)
          );
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
        const dpr = Math.min(window.devicePixelRatio || 1, 2);
        const targetW = Math.round(WORLD_WIDTH * dpr);
        const targetH = Math.round(WORLD_HEIGHT * dpr);
        if (canvas.width !== targetW || canvas.height !== targetH) {
          canvas.width = targetW;
          canvas.height = targetH;
        }
        const ctx = canvas.getContext('2d');
        if (ctx) {
          ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
          ctx.imageSmoothingEnabled = false;
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
      }, 40);
    };

    rafId = requestAnimationFrame(tick);
    return () => {
      cancelled = true;
      window.clearTimeout(timerId);
      cancelAnimationFrame(rafId);
    };
  }, [updateHudIfChanged]);

  const handleWorldTap = useCallback(
    (clientX: number, clientY: number) => {
      const st = gameStateRef.current;
      if (st.mode !== 'playing') return;

      const { x, y } = screenToWorld(clientX, clientY);

      for (const cat of st.cats) {
        if (cat.room === st.room && Math.abs(x - cat.x) <= 28 && Math.abs(y - cat.y) <= 24) {
          handlePetCat(cat.id);
          return;
        }
      }

      if (st.room === 'inside') {
        if (
          Math.abs(x - INSIDE_DOOR_MAT.x) <= INSIDE_DOOR_MAT.width / 2 + 6 &&
          Math.abs(y - INSIDE_DOOR_MAT.y) <= INSIDE_DOOR_MAT.height / 2 + 6
        ) {
          handleToggleRoom('garden');
          return;
        }

        if (
          Math.abs(x - TIP_JAR_BOUNDS.x) <= TIP_JAR_BOUNDS.width / 2 + 8 &&
          Math.abs(y - TIP_JAR_BOUNDS.y) <= TIP_JAR_BOUNDS.height / 2 + 8
        ) {
          handleCollectTipJar();
          return;
        }

        if (
          Math.abs(x - TOOL_CHEST_BOUNDS.x) <= TOOL_CHEST_BOUNDS.width / 2 + 8 &&
          Math.abs(y - TOOL_CHEST_BOUNDS.y) <= TOOL_CHEST_BOUNDS.height / 2 + 8
        ) {
          handleCycleMiataPaint();
          return;
        }

        if (Math.abs(x - 748) <= 68 && Math.abs(y - 328) <= 32) {
          handlePhotoSquadSnap();
          return;
        }

        if (
          Math.abs(x - MIATA_GARAGE_BOUNDS.x) <= MIATA_GARAGE_BOUNDS.width / 2 &&
          Math.abs(y - MIATA_GARAGE_BOUNDS.y) <= MIATA_GARAGE_BOUNDS.height / 2
        ) {
          handleToggleMiataHeadlights();
          return;
        }

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

        for (const s of STATIONS) {
          if (s.id === 'watering_can') continue;
          if (Math.abs(x - s.x) <= s.width / 2 + 6 && Math.abs(y - s.y) <= s.height / 2 + 6) {
            handleTriggerStation(s.id);
            return;
          }
        }
      } else {
        if (
          Math.abs(x - GARDEN_DOOR_MAT.x) <= GARDEN_DOOR_MAT.width / 2 + 6 &&
          Math.abs(y - GARDEN_DOOR_MAT.y) <= GARDEN_DOOR_MAT.height / 2 + 6
        ) {
          handleToggleRoom('inside');
          return;
        }

        if (
          Math.abs(x - GARDEN_ORDER_WINDOW.x) <= GARDEN_ORDER_WINDOW.width / 2 + 6 &&
          Math.abs(y - GARDEN_ORDER_WINDOW.y) <= GARDEN_ORDER_WINDOW.height / 2 + 6
        ) {
          handleSmartStep();
          return;
        }

        const well = STATIONS.find((s) => s.id === 'watering_can');
        if (
          well &&
          Math.abs(x - well.x) <= well.width / 2 + 8 &&
          Math.abs(y - well.y) <= well.height / 2 + 8
        ) {
          handleWaterAllDaisies();
          return;
        }

        for (const d of st.daisies) {
          if (Math.abs(x - d.x) <= 54 && Math.abs(y - d.y) <= 34) {
            handleWaterDaisyById(d.id);
            return;
          }
        }
      }

      st.barista.targetX = Math.max(46, Math.min(854, x));
      st.barista.targetY = Math.max(132, Math.min(442, y));
      soundEngine.playStep();
    },
    [
      screenToWorld,
      handlePetCat,
      handleToggleRoom,
      handleCollectTipJar,
      handleCycleMiataPaint,
      handlePhotoSquadSnap,
      handleToggleMiataHeadlights,
      handleSmartStep,
      handleTriggerStation,
      handleWaterAllDaisies,
      handleWaterDaisyById,
    ]
  );

  const handleCanvasWheel = (e: React.WheelEvent<HTMLCanvasElement>) => {
    const zoomDelta = -e.deltaY * 0.0014;
    if (Math.abs(zoomDelta) < 0.005) return;
    const targetWorld = screenToWorld(e.clientX, e.clientY);
    const nextZoom = Math.max(1.0, Math.min(2.6, cameraRef.current.zoom + zoomDelta));
    applyCamera({
      zoom: Number(nextZoom.toFixed(2)),
      panX:
        cameraRef.current.panX +
        (targetWorld.x - cameraRef.current.panX) * (zoomDelta > 0 ? 0.18 : 0),
      panY:
        cameraRef.current.panY +
        (targetWorld.y - cameraRef.current.panY) * (zoomDelta > 0 ? 0.18 : 0),
    });
  };

  const handleCanvasPointerMove = (e: React.PointerEvent<HTMLCanvasElement>) => {
    if (activePointersRef.current.has(e.pointerId)) {
      activePointersRef.current.set(e.pointerId, { x: e.clientX, y: e.clientY });
    }

    if (activePointersRef.current.size >= 2 && pinchStartDistRef.current) {
      const pts = Array.from(activePointersRef.current.values());
      const dist = Math.hypot(pts[1].x - pts[0].x, pts[1].y - pts[0].y);
      if (dist > 8) {
        const nextZoom = pinchStartZoomRef.current * (dist / pinchStartDistRef.current);
        applyCamera({
          ...cameraRef.current,
          zoom: Number(nextZoom.toFixed(2)),
        });
      }
      return;
    }

    const drag = dragStateRef.current;
    if (drag && drag.pointerId === e.pointerId) {
      const dx = e.clientX - drag.startX;
      const dy = e.clientY - drag.startY;
      const dist = Math.hypot(dx, dy);
      drag.maxDist = Math.max(drag.maxDist, dist);

      if (cameraRef.current.zoom > 1.05 && drag.maxDist >= 4) {
        const canvas = canvasRef.current;
        if (canvas) {
          const rect = canvas.getBoundingClientRect();
          const scaleX = rect.width / WORLD_WIDTH;
          const scaleY = rect.height / WORLD_HEIGHT;
          const baseScale = Math.max(0.05, Math.min(scaleX, scaleY));
          const worldDx = dx / (baseScale * cameraRef.current.zoom);
          const worldDy = dy / (baseScale * cameraRef.current.zoom);
          applyCamera({
            zoom: cameraRef.current.zoom,
            panX: drag.startPanX - worldDx,
            panY: drag.startPanY - worldDy,
          });
        }
        return;
      }
    }

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

    activePointersRef.current.set(e.pointerId, { x: e.clientX, y: e.clientY });

    if (activePointersRef.current.size >= 2) {
      const pts = Array.from(activePointersRef.current.values());
      pinchStartDistRef.current = Math.max(
        10,
        Math.hypot(pts[1].x - pts[0].x, pts[1].y - pts[0].y)
      );
      pinchStartZoomRef.current = cameraRef.current.zoom;
      dragStateRef.current = null;
      return;
    }

    dragStateRef.current = {
      pointerId: e.pointerId,
      startX: e.clientX,
      startY: e.clientY,
      startPanX: cameraRef.current.panX,
      startPanY: cameraRef.current.panY,
      maxDist: 0,
    };

    // When unzoomed (<= 1.05x), trigger station/entity tap immediately on pointerdown
    if (cameraRef.current.zoom <= 1.05) {
      handleWorldTap(e.clientX, e.clientY);
    }
  };

  const handleCanvasPointerUp = (e: React.PointerEvent<HTMLCanvasElement>) => {
    activePointersRef.current.delete(e.pointerId);
    if (activePointersRef.current.size < 2) {
      pinchStartDistRef.current = null;
    }

    const drag = dragStateRef.current;
    if (drag && drag.pointerId === e.pointerId) {
      dragStateRef.current = null;
      if (drag.maxDist < 8) {
        const now = performance.now();
        if (now - lastTapTimeRef.current < 260 && e.pointerType === 'touch') {
          const worldPt = screenToWorld(e.clientX, e.clientY);
          if (cameraRef.current.zoom > 1.08) {
            applyCamera({ zoom: 1, panX: WORLD_WIDTH / 2, panY: WORLD_HEIGHT / 2 });
          } else {
            applyCamera({ zoom: 1.75, panX: worldPt.x, panY: worldPt.y });
          }
          lastTapTimeRef.current = 0;
          return;
        }
        lastTapTimeRef.current = now;
        if (cameraRef.current.zoom > 1.05) {
          handleWorldTap(e.clientX, e.clientY);
        }
      }
    }
  };

  const handleCanvasPointerCancel = (e: React.PointerEvent<HTMLCanvasElement>) => {
    activePointersRef.current.delete(e.pointerId);
    if (activePointersRef.current.size < 2) {
      pinchStartDistRef.current = null;
    }
    if (dragStateRef.current?.pointerId === e.pointerId) {
      dragStateRef.current = null;
    }
  };

  return (
    <main className="relative w-screen h-dvh overflow-hidden bg-[#090b10] flex flex-col justify-between">
      {/* External Top GBA Status HUD Bar */}
      {uiMode !== 'boot' && uiMode !== 'title' && (
        <TopHudBar
          hud={hud}
          dockCollapsed={dockCollapsed}
          isStandalone={isStandalone}
          isFullscreen={isFullscreen}
          cameraZoom={cameraZoom}
          onResetZoom={handleResetZoom}
          onToggleFullscreen={handleToggleFullscreen}
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
          onOpenCustomize={() => setShowCustomizeModal(true)}
          onOpenMenuModal={() => setShowMenuModal(true)}
          onOpenBizModal={() => setShowBizModal(true)}
          onOpenPwaModal={handleOpenInstallOrApkModal}
          onPause={() => {
            const st = gameStateRef.current;
            setSummaryStats({
              dayNumber: st.dayNumber,
              dailyStreak: st.dailyStreak,
              newlyUnlockedOutfits: [],
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

      {/* Dedicated Non-Overlapping GBA Pixel-Art Viewport Stage */}
      <div className="relative flex-1 min-h-0 w-full flex items-center justify-center p-1 bg-[#090b10]">
        <canvas
          ref={canvasRef}
          data-testid="klasik-canvas"
          width={WORLD_WIDTH}
          height={WORLD_HEIGHT}
          onWheel={handleCanvasWheel}
          onPointerMove={handleCanvasPointerMove}
          onPointerDown={handleCanvasPointerDown}
          onPointerUp={handleCanvasPointerUp}
          onPointerCancel={handleCanvasPointerCancel}
          onPointerLeave={handleCanvasPointerCancel}
          className="w-full h-full object-contain cursor-pointer border-[3px] border-[#334155]"
          style={{ imageRendering: 'pixelated', touchAction: 'none' }}
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

        {/* Slim Corner Quick-Action Buttons */}
        {uiMode === 'playing' && (
          <div className="pointer-events-none absolute bottom-2 right-2.5 z-10">
            <FloatingCanvasQuickBar
              hud={hud}
              cameraZoom={cameraZoom}
              onZoomIn={handleZoomIn}
              onZoomOut={handleZoomOut}
              onResetZoom={handleResetZoom}
              onSmartStep={handleSmartStep}
              onWaterAllDaisies={handleWaterAllDaisies}
              onHireStaff={handleHireStaff}
              onOpenBizModal={() => setShowBizModal(true)}
              onPetCats={() => handlePetCat()}
              onToggleRoom={() => handleToggleRoom()}
            />
          </div>
        )}
      </div>

      {/* Collapsible External Bottom GBA Action Dock (Hidden by Default) */}
      {uiMode !== 'boot' && uiMode !== 'title' && (
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

      {/* Pre-Title GBA Boot / Loading Screen (1.5s) */}
      {uiMode === 'boot' && <BootLoadingScreen onComplete={handleBootComplete} />}

      {/* Minimalist Landscape-Optimized Title Screen */}
      {uiMode === 'title' && (
        <TitleScreen
          onStart={handleStartGame}
          onOpenCustomize={() => setShowCustomizeModal(true)}
          onInstallApp={handleOpenInstallOrApkModal}
          isStandalone={isStandalone}
        />
      )}

      {/* Character Customization & Rename Modal */}
      {showCustomizeModal && (
        <CustomizeModal
          appearance={hud.appearance}
          dailyStreak={hud.dailyStreak}
          onSave={handleSaveAppearance}
          onClose={() => setShowCustomizeModal(false)}
        />
      )}

      {/* 1-Tap Recipe & Profit Margin Guide ([📖 MENU]) */}
      {showMenuModal && (
        <RecipeMenuModal
          cozyRating={hud.cozyRating}
          finance={hud.finance}
          onClose={() => setShowMenuModal(false)}
        />
      )}

      {/* Real Business Economics, Staff Payroll, Multi-Tier Machines & Decor Shop Modal */}
      {showBizModal && (
        <BizUpgradesModal
          coins={hud.coins}
          finance={hud.finance}
          staff={hud.staff}
          stationLevels={hud.stationLevels}
          decorOwned={hud.decorOwned}
          decorEquipped={hud.decorEquipped}
          onRestockWholesale={handleRestockWholesale}
          onToggleAutoRestock={handleToggleAutoRestock}
          onHireStaffById={handleHireStaffById}
          onUpgradeStation={handleUpgradeStation}
          onPurchaseOrToggleDecor={handlePurchaseOrToggleDecor}
          onPurchaseUpgrade={handlePurchaseUpgrade}
          onResetSave={handleResetSave}
          onClose={() => setShowBizModal(false)}
        />
      )}

      {/* Offline PWA & Android .APK Export Modal ([📲 APP / APK]) — Hidden in Standalone App Mode */}
      {!isStandalone && showPwaModal && (
        <PwaApkModal
          isInstallable={Boolean(deferredPrompt)}
          isInstalled={isPwaInstalled}
          swRegistered={swRegistered}
          onTriggerInstallPrompt={handleTriggerInstallPrompt}
          onClose={() => setShowPwaModal(false)}
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
          onOpenCustomize={() => setShowCustomizeModal(true)}
        />
      )}

      {/* Single-File HTML Code Export Modal */}
      {showCodeModal && <CodeExportModal onClose={() => setShowCodeModal(false)} />}
    </main>
  );
}
