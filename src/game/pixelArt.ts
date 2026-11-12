import {
  CafeState,
  STATIONS,
  RECIPES,
  INDOOR_TABLES,
  GARDEN_TABLES,
  MIATA_GARAGE_BOUNDS,
  INSIDE_DOOR_MAT,
  GARDEN_DOOR_MAT,
  GARDEN_ORDER_WINDOW,
  DaisyPatch,
  CustomerEntity,
  CatCompanion,
  StationConfig,
  getRecommendedStation,
} from './rules';

export const WORLD_WIDTH = 900;
export const WORLD_HEIGHT = 480;

export type ParticleKind =
  | 'heart'
  | 'water'
  | 'steam'
  | 'sparkle'
  | 'pollen'
  | 'note'
  | 'petal'
  | 'rain'
  | 'ripple'
  | 'firefly';

export interface PooledParticle {
  active: boolean;
  kind: ParticleKind;
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
  maxLife: number;
  size: number;
  color: string;
}

const POOL_CAPACITY = 180;

export class ParticlePool {
  public items: PooledParticle[] = [];
  private cursor = 0;

  constructor() {
    for (let i = 0; i < POOL_CAPACITY; i++) {
      this.items.push({
        active: false,
        kind: 'pollen',
        x: 0,
        y: 0,
        vx: 0,
        vy: 0,
        life: 0,
        maxLife: 1,
        size: 3,
        color: '#ffffff',
      });
    }
  }

  public spawn(
    kind: ParticleKind,
    x: number,
    y: number,
    vx: number,
    vy: number,
    maxLife: number,
    size: number,
    color: string
  ) {
    const p = this.items[this.cursor];
    this.cursor = (this.cursor + 1) % POOL_CAPACITY;
    p.active = true;
    p.kind = kind;
    p.x = x;
    p.y = y;
    p.vx = vx;
    p.vy = vy;
    p.life = maxLife;
    p.maxLife = maxLife;
    p.size = size;
    p.color = color;
  }

  public emitBurst(kind: ParticleKind, x: number, y: number, count: number) {
    for (let i = 0; i < count; i++) {
      const angle = (Math.PI * 2 * i) / count + (Math.random() - 0.5) * 0.4;
      const speed = 18 + Math.random() * 34;
      if (kind === 'heart') {
        this.spawn(
          i % 3 === 0 ? 'note' : 'heart',
          x + (Math.random() - 0.5) * 18,
          y - 10,
          Math.cos(angle) * 16,
          -28 - Math.random() * 24,
          1.3,
          8,
          i % 3 === 0 ? '#facc15' : i % 2 === 0 ? '#f43f5e' : '#fb7185'
        );
      } else if (kind === 'water') {
        this.spawn(
          'water',
          x + (Math.random() - 0.5) * 18,
          y - 6,
          Math.cos(angle) * speed,
          Math.sin(angle) * speed - 22,
          0.7,
          4,
          i % 2 === 0 ? '#38bdf8' : '#bae6fd'
        );
      } else if (kind === 'sparkle') {
        this.spawn(
          'sparkle',
          x + (Math.random() - 0.5) * 20,
          y + (Math.random() - 0.5) * 16,
          Math.cos(angle) * 22,
          Math.sin(angle) * 22 - 12,
          0.7,
          4,
          '#facc15'
        );
      }
    }
  }

  public update(dt: number) {
    for (let i = 0; i < POOL_CAPACITY; i++) {
      const p = this.items[i];
      if (!p.active) continue;
      p.life -= dt;
      if (p.life <= 0) {
        if (p.kind === 'rain' && Math.random() < 0.45) {
          // Turn raindrop impact into a ground splash ripple!
          p.active = true;
          p.kind = 'ripple';
          p.vx = 0;
          p.vy = 0;
          p.life = 0.32;
          p.maxLife = 0.32;
          p.size = 6;
          p.color = '#bae6fd';
          continue;
        }
        p.active = false;
        continue;
      }
      p.x += p.vx * dt;
      p.y += p.vy * dt;
      if (p.kind === 'water') {
        p.vy += 65 * dt;
      }
    }
  }
}

/**
 * ============================================================================
 * REUSABLE GBA 16-BIT PIXEL MATRIX SPRITE ENGINE
 * ============================================================================
 */
export function drawSpriteMatrix(
  ctx: CanvasRenderingContext2D,
  matrix: string[],
  palette: Record<string, string>,
  centerX: number,
  centerY: number,
  pixelSize = 2,
  flipX = false
) {
  const rows = matrix.length;
  const cols = matrix[0]?.length ?? 0;
  const startX = Math.round(centerX - (cols * pixelSize) / 2);
  const startY = Math.round(centerY - (rows * pixelSize) / 2);

  for (let r = 0; r < rows; r++) {
    const rowStr = matrix[r];
    for (let c = 0; c < cols; c++) {
      const ch = rowStr[flipX ? cols - 1 - c : c];
      if (ch === '.' || ch === ' ') continue;
      const color = palette[ch];
      if (!color) continue;
      ctx.fillStyle = color;
      ctx.fillRect(
        startX + c * pixelSize,
        startY + r * pixelSize,
        pixelSize,
        pixelSize
      );
    }
  }
}

function px(n: number): number {
  return Math.round(n / 2) * 2;
}

function drawPixelBox(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  w: number,
  h: number,
  fill: string,
  outline?: string,
  topHighlight?: string
) {
  const rx = px(x);
  const ry = px(y);
  const rw = px(w);
  const rh = px(h);

  if (outline) {
    ctx.fillStyle = outline;
    ctx.fillRect(rx - 2, ry - 2, rw + 4, rh + 4);
  }
  ctx.fillStyle = fill;
  ctx.fillRect(rx, ry, rw, rh);

  if (topHighlight) {
    ctx.fillStyle = topHighlight;
    ctx.fillRect(rx, ry, rw, 4);
  }
}

function drawWarmLightPool(
  ctx: CanvasRenderingContext2D,
  cx: number,
  cy: number,
  radius: number,
  alpha: number,
  colorRgb = '254, 240, 138'
) {
  ctx.save();
  ctx.fillStyle = `rgba(${colorRgb}, ${alpha * 0.45})`;
  ctx.fillRect(px(cx - radius), px(cy - radius * 0.7), px(radius * 2), px(radius * 1.4));
  ctx.fillStyle = `rgba(${colorRgb}, ${alpha * 0.85})`;
  ctx.fillRect(
    px(cx - radius * 0.55),
    px(cy - radius * 0.4),
    px(radius * 1.1),
    px(radius * 0.8)
  );
  ctx.restore();
}

/**
 * 16x18 CHIBI RPG CHARACTER SPRITE MATRICES (Pokémon FireRed / Emerald Style)
 */
const CHIBI_CHAR_FRAME_0 = [
  '....OOOOOOOO....',
  '..OOhhhhhhhhOO..',
  '.OnhHHHHHHHHhnO.',
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
  '...OFFO..OFFO...',
];

const CHIBI_CHAR_FRAME_1 = [
  '....OOOOOOOO....',
  '..OOhhhhhhhhOO..',
  '.OnhHHHHHHHHhnO.',
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
  '..OPPP....PPPO..',
  '..OFFO....OFFO..',
];

/**
 * MULTI-STATE ROAMING CAT COMPANION MATRICES (Lilo & Champy)
 */
const CAT_WALK_FRAME_0 = [
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
  '..OO......OO....',
];

const CAT_WALK_FRAME_1 = [
  '.OO......OO.....',
  'OBSO....OSBO....',
  'OBBBOOOOBBBO....',
  'OBBBBBBBBBBO..OO',
  'OBEBBBBBBBEBOOBO',
  'OBBBBBBBBBBBBBO.',
  '.OCCCCCCCCCCO...',
  '.OBBBBGGbbbbO...',
  '.OBBBBBBBBBBO...',
  '.OBBBBBBBBBBO...',
  '.OBBO....OBBO...',
  '.OO........OO...',
];

const CAT_GROOM_FRAME_0 = [
  '..OO......OO....',
  '.OBSO....OSBO...',
  '.OBBBOOOOBBBO...',
  '.OBBBBBBBBBBO...',
  '.OBEBBBBBBBEBO..',
  '.OBBBBBBBBBBO...',
  '..OCCCCCCCCO....',
  '.OOBBBGGbbBOO...',
  'OBSO.OBBBBBBO.OO',
  'OO...OBBBBBBOOBO',
  '.....OBBBBBBBBO.',
  '.....OOOOOOOOO..',
];

const CAT_GROOM_FRAME_1 = [
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
  '....OOOOOOOOOO..',
];

const CAT_SLEEP_MATRIX = [
  '................',
  '....OOOOOOOO....',
  '..OOBBBBBBBBOO..',
  '.OBSOOOOOOOOSBO.',
  'OBBBOCCCCCCOBBBO',
  'OBBBBBBBBBBBBBBO',
  'OBBBBBBBBBBBBBBO',
  '.OOBBBBBBBBBBOO.',
  '...OOOOOOOOOO...',
];

/**
 * 16x16 CAFE APPLIANCE MATRICES
 */
const APPLIANCE_GRINDER_MATRIX = [
  '....OOOOOOOO....',
  '...OCCCCCCCCO...',
  '...OCWWWWWWCO...',
  '...OCBBBBBBCO...',
  '....OOOOOOOO....',
  '...OSSSSSSSSO...',
  '..OSSSSSSSSSSO..',
  '..OSSOOOOOOSSO..',
  '..OSSOBBBBOSSO..',
  '..OSSOOOOOOSSO..',
  '..OSSSSSSSSSSO..',
  '...OSSSSSSSSO...',
  '..OOOOOOOOOOOO..',
];

const APPLIANCE_ESPRESSO_MATRIX = [
  '.OOOOOOOOOOOOOO.',
  'OCCCCCCCCCCCCCCO',
  'OSSSSSSSSSSSSSSO',
  'OSSWWOSSSSOWWSSO',
  'OSSSSSSSSSSSSSSO',
  'OCCCCCCCCCCCCCCO',
  'OO.OOOMMMMOOO.OO',
  'O..O..OOOO..O..O',
  'O.....WW.WW....O',
  'O....WWWWWWW...O',
  'OCCCCCCCCCCCCCCO',
  'OOOOOOOOOOOOOOOO',
];

const APPLIANCE_FROTHER_MATRIX = [
  '.....OOOOOO.....',
  '....OCCCCCCOO...',
  '...OCCCCCCCCCO..',
  '...OSSSSSSSSO.O.',
  '...OSSWWWWSSO.O.',
  '...OSSSSSSSSOO..',
  '...OSSSSSSSSO...',
  '...OSSSSSSSSO...',
  '....OOOOOOOO....',
];

const APPLIANCE_KETTLE_MATRIX = [
  '......OOOO......',
  '.....OCCCCO.....',
  '....OOOOOOOO....',
  '...OSSSSSSSSO.OO',
  '..OSSSSSSSSSSOBO',
  '.OBSSSSSSSSSSBO.',
  '.O.OSSSSSSSSO...',
  '...OSSSSSSSSO...',
  '....OOOOOOOO....',
];

const APPLIANCE_TEA_MATRIX = [
  '...OOOOOOOOOO...',
  '..OCCCCCCCCCCO..',
  '..OSSSSSSSSSSO..',
  '..OSSWWWWWWSSO..',
  '..OSSWGGGGWSSO..',
  '..OSSWGGGGWSSO..',
  '..OSSWWWWWWSSO..',
  '..OSSSSSSSSSSO..',
  '...OOOOOOOOOO...',
];

export function drawPixelHeart(
  ctx: CanvasRenderingContext2D,
  cx: number,
  cy: number,
  scale = 2,
  color = '#f43f5e'
) {
  const pattern = [
    ' 11 11 ',
    '1111111',
    '1111111',
    ' 11111 ',
    '  111  ',
    '   1   ',
  ];
  const startX = Math.round(cx - (7 * scale) / 2);
  const startY = Math.round(cy - (6 * scale) / 2);

  ctx.fillStyle = '#090b0e';
  for (let r = 0; r < pattern.length; r++) {
    for (let c = 0; c < pattern[r].length; c++) {
      if (pattern[r][c] === '1') {
        ctx.fillRect(startX + c * scale, startY + r * scale + scale, scale, scale);
      }
    }
  }

  ctx.fillStyle = color;
  for (let r = 0; r < pattern.length; r++) {
    for (let c = 0; c < pattern[r].length; c++) {
      if (pattern[r][c] === '1') {
        ctx.fillRect(startX + c * scale, startY + r * scale, scale, scale);
      }
    }
  }
  ctx.fillStyle = '#ffffff';
  ctx.fillRect(startX + scale, startY + scale, scale, scale);
}

export function drawWaterDropIcon(
  ctx: CanvasRenderingContext2D,
  cx: number,
  cy: number,
  bobOffset: number
) {
  const y = px(cy + bobOffset);
  const x = px(cx);

  drawPixelBox(ctx, x - 14, y - 16, 28, 22, '#f8fafc', '#090b0e', '#e2e8f0');
  ctx.fillStyle = '#090b0e';
  ctx.fillRect(x - 4, y + 6, 8, 4);
  ctx.fillStyle = '#f8fafc';
  ctx.fillRect(x - 2, y + 4, 4, 4);

  ctx.fillStyle = '#0284c7';
  ctx.fillRect(x - 2, y - 12, 4, 4);
  ctx.fillRect(x - 4, y - 8, 8, 4);
  ctx.fillRect(x - 6, y - 4, 12, 6);
  ctx.fillRect(x - 4, y + 1, 8, 2);

  ctx.fillStyle = '#7dd3fc';
  ctx.fillRect(x - 4, y - 4, 4, 4);
}

function drawSingleDaisy(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  swayPx: number,
  hydrated: boolean
) {
  const fx = px(x + swayPx);
  const fy = px(y);

  ctx.fillStyle = hydrated ? '#15803d' : '#4d7c0f';
  ctx.fillRect(px(x) - 2, fy + 2, 4, 8);

  const petalOuter = hydrated ? '#ffffff' : '#e2e8f0';
  const petalShade = hydrated ? '#cbd5e1' : '#94a3b8';

  ctx.fillStyle = petalShade;
  ctx.fillRect(fx - 6, fy - 2, 12, 6);
  ctx.fillRect(fx - 4, fy - 4, 8, 10);

  ctx.fillStyle = petalOuter;
  ctx.fillRect(fx - 6, fy - 4, 4, 4);
  ctx.fillRect(fx + 2, fy - 4, 4, 4);
  ctx.fillRect(fx - 6, fy + 2, 4, 4);
  ctx.fillRect(fx + 2, fy + 2, 4, 4);
  ctx.fillRect(fx - 2, fy - 6, 4, 4);
  ctx.fillRect(fx - 2, fy + 4, 4, 4);
  ctx.fillRect(fx - 8, fy - 2, 4, 4);
  ctx.fillRect(fx + 4, fy - 2, 4, 4);

  ctx.fillStyle = '#eab308';
  ctx.fillRect(fx - 2, fy - 2, 4, 4);
  ctx.fillStyle = '#fef08a';
  ctx.fillRect(fx - 2, fy - 2, 2, 2);
}

function drawDaisyBed(
  ctx: CanvasRenderingContext2D,
  patch: DaisyPatch,
  state: CafeState,
  time: number,
  hovered: boolean
) {
  const w = 104;
  const h = 62;
  const left = px(patch.x - w / 2);
  const top = px(patch.y - h / 2);

  const borderCol = hovered ? '#facc15' : patch.needsWater ? '#38bdf8' : '#090b0e';
  drawPixelBox(ctx, left, top, w, h, '#1e293b', borderCol, '#475569');

  drawPixelBox(ctx, left + 6, top + 6, w - 12, h - 12, '#0f172a');
  ctx.fillStyle = patch.needsWater ? '#3f6212' : '#16a34a';
  ctx.fillRect(left + 10, top + 10, w - 20, h - 22);
  ctx.fillStyle = patch.needsWater ? '#4d7c0f' : '#22c55e';
  ctx.fillRect(left + 14, top + 12, w - 28, h - 26);

  const windBoost = state.weather === 'breeze' ? 3.5 : 2.0;
  const sway = Math.sin(time * 2.8 + patch.x * 0.1) * windBoost;
  const offsets = [
    [-28, -10],
    [0, -12],
    [28, -10],
    [-22, 8],
    [4, 10],
    [28, 8],
  ];
  offsets.forEach(([ox, oy], idx) => {
    const localSway = idx % 2 === 0 ? sway : -sway;
    drawSingleDaisy(ctx, patch.x + ox, patch.y + oy, localSway, !patch.needsWater);
  });

  // Pixel Hydration Meter Bar
  const barW = 76;
  const barX = px(patch.x - barW / 2);
  const barY = top + h - 8;
  drawPixelBox(ctx, barX, barY, barW, 5, '#090b0e', '#334155');
  const fillW = Math.round((barW * Math.max(0, Math.min(100, patch.hydration))) / 100);
  ctx.fillStyle = state.weather === 'rain' ? '#38bdf8' : patch.needsWater ? '#facc15' : '#22c55e';
  ctx.fillRect(barX, barY, fillW, 5);

  if (patch.needsWater && state.weather !== 'rain') {
    const bob = Math.sin(time * 5.2 + patch.y) * 3;
    drawWaterDropIcon(ctx, patch.x, top - 16, bob);
  } else if (state.weather === 'rain' && patch.hydration < 99) {
    ctx.font = 'bold 6px "Press Start 2P", monospace';
    ctx.textAlign = 'center';
    ctx.fillStyle = '#7dd3fc';
    ctx.fillText('+RAIN 💧', patch.x, top - 6);
  }
}

/**
 * Draws the 3D Monochrome Cafe Counter Appliances, Bouncing `▼ NEXT` Indicator,
 * and On-Appliance Progress Bars
 */
function drawStation(
  ctx: CanvasRenderingContext2D,
  station: StationConfig,
  state: CafeState,
  time: number,
  isHovered: boolean,
  isRecommendedNext: boolean
) {
  const { x, y, width, height, id } = station;
  const left = px(x - width / 2);
  const top = px(y - height / 2);
  const isProcessing = state.prep.processingStation === id && state.prep.processTimer > 0;
  const bounceY = isProcessing ? Math.round(Math.sin(time * 24) * 2) : 0;

  if (isRecommendedNext || isHovered) {
    const pulse = Math.sin(time * 8) > 0 ? '#facc15' : '#ffffff';
    ctx.strokeStyle = pulse;
    ctx.lineWidth = 3;
    ctx.strokeRect(left - 4, top - 4, width + 8, height + 8);
  }

  drawPixelBox(
    ctx,
    left,
    top + bounceY,
    width,
    height,
    isRecommendedNext ? '#26334d' : '#1e293b',
    '#090b0e',
    isRecommendedNext ? '#60a5fa' : '#475569'
  );

  const cx = px(x);
  const cy = px(y + bounceY - 2);

  if (id === 'grinder') {
    drawSpriteMatrix(
      ctx,
      APPLIANCE_GRINDER_MATRIX,
      { O: '#090b0e', C: '#cbd5e1', W: '#e2e8f0', B: '#451a03', S: '#334155' },
      cx,
      cy,
      2
    );
  } else if (id === 'espresso') {
    drawSpriteMatrix(
      ctx,
      APPLIANCE_ESPRESSO_MATRIX,
      { O: '#090b0e', C: '#f8fafc', S: '#475569', W: '#facc15', M: '#0f172a' },
      cx,
      cy,
      2
    );
  } else if (id === 'milk_frother') {
    drawSpriteMatrix(
      ctx,
      APPLIANCE_FROTHER_MATRIX,
      { O: '#090b0e', C: '#94a3b8', S: '#e2e8f0', W: '#ffffff' },
      cx,
      cy,
      2
    );
  } else if (id === 'kettle') {
    drawSpriteMatrix(
      ctx,
      APPLIANCE_KETTLE_MATRIX,
      { O: '#090b0e', C: '#cbd5e1', S: '#18181b', B: '#71717a' },
      cx,
      cy,
      2
    );
  } else if (id === 'tea_leaves') {
    drawSpriteMatrix(
      ctx,
      APPLIANCE_TEA_MATRIX,
      { O: '#090b0e', C: '#e2e8f0', S: '#0f172a', W: '#f8fafc', G: '#22c55e' },
      cx,
      cy,
      2
    );
  } else if (id === 'cup_counter') {
    drawPixelBox(ctx, cx - 38, cy - 12, 76, 26, '#f8fafc', '#090b0e', '#cbd5e1');
    const step = state.prep.currentStepIndex;
    const drink = state.prep.activeDrink ? RECIPES[state.prep.activeDrink] : null;
    if (step > 0 && drink) {
      drawPixelBox(ctx, cx - 14, cy + 4, 28, 6, '#e2e8f0', '#090b0e');
      drawPixelBox(
        ctx,
        cx - 10,
        cy - 12,
        20,
        16,
        step === 3 ? drink.color : '#334155',
        '#090b0e',
        step === 3 ? drink.accentColor : '#94a3b8'
      );
      if (step === 3) {
        const sOffset = Math.round(Math.sin(time * 8) * 2);
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(cx - 4 + sOffset, cy - 22, 2, 6);
        ctx.fillRect(cx + 2 - sOffset, cy - 25, 2, 8);
      }
    } else {
      drawPixelBox(ctx, cx - 8, cy - 8, 16, 14, '#ffffff', '#090b0e');
    }
  } else if (id === 'trash') {
    drawPixelBox(ctx, cx - 12, cy - 10, 24, 22, '#334155', '#090b0e', '#64748b');
  }

  // Station Label Tag
  drawPixelBox(ctx, cx - width / 2 + 2, top + height + 3, width - 4, 13, '#090b0e', '#475569');
  ctx.font = 'bold 7px "Press Start 2P", monospace';
  ctx.textAlign = 'center';
  ctx.fillStyle = isRecommendedNext ? '#facc15' : '#f8fafc';
  ctx.fillText(station.shortLabel.toUpperCase(), cx, top + height + 12);

  // ★ ON-APPLIANCE PIXEL PROGRESS BAR & STEAM BUBBLES ★
  if (isProcessing && state.prep.processDuration > 0) {
    const pct = Math.max(
      0,
      Math.min(1, 1 - state.prep.processTimer / Math.max(0.05, state.prep.processDuration))
    );
    const bw = Math.max(54, width);
    const bx = px(cx - bw / 2);
    const by = top - 20;
    drawPixelBox(ctx, bx, by, bw, 11, '#090b0e', '#f8fafc');
    ctx.fillStyle = '#22c55e';
    ctx.fillRect(bx + 2, by + 2, Math.round((bw - 4) * pct), 7);
    ctx.fillStyle = '#86efac';
    ctx.fillRect(bx + 2, by + 2, Math.round((bw - 4) * pct), 3);

    const bubbleY = by - 8 - ((time * 28) % 12);
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(cx - 8, px(bubbleY), 4, 4);
    ctx.fillRect(cx + 4, px(bubbleY - 4), 4, 4);
  } else if (isRecommendedNext) {
    // ★ BOUNCING GBA PIXEL TARGET INDICATOR (`▼ NEXT`) ★
    const bob = Math.round(Math.sin(time * 9) * 2);
    const badgeW = 54;
    const badgeX = px(cx - badgeW / 2);
    const badgeY = top - 19 + bob;
    drawPixelBox(ctx, badgeX, badgeY, badgeW, 13, '#facc15', '#090b0e', '#fef08a');
    ctx.font = 'bold 7px "Press Start 2P", monospace';
    ctx.textAlign = 'center';
    ctx.fillStyle = '#090b0e';
    ctx.fillText('▼ NEXT', cx, badgeY + 10);
  }
}

/**
 * Draws the Chibi RPG Barista
 */
function drawBarista(ctx: CanvasRenderingContext2D, state: CafeState, time: number) {
  const b = state.barista;
  const isWalking = Math.hypot(b.targetX - b.x, b.targetY - b.y) > 3;
  const frameIdx = isWalking ? Math.floor(b.walkDist / 12) % 2 : Math.floor(time * 2) % 2;
  const bobY = isWalking ? Math.round(Math.sin(b.walkDist * 0.25) * 2) : 0;

  const bx = px(b.x);
  const by = px(b.y + bobY);

  ctx.save();
  ctx.translate(bx, by);
  ctx.scale(b.scaleX, b.scaleY);

  ctx.fillStyle = 'rgba(0, 0, 0, 0.4)';
  ctx.fillRect(-14, 14, 28, 6);

  if (b.speedBoostTimer > 0) {
    ctx.strokeStyle = '#facc15';
    ctx.lineWidth = 2;
    ctx.strokeRect(-18, -22, 36, 40);
  }

  drawSpriteMatrix(
    ctx,
    frameIdx === 0 ? CHIBI_CHAR_FRAME_0 : CHIBI_CHAR_FRAME_1,
    {
      O: '#090b0e',
      H: '#18181b',
      h: '#3f3f46',
      n: '#27272a',
      B: '#f8fafc',
      S: '#fde68a',
      E: '#090b0e',
      C: '#fb7185',
      T: '#f8fafc',
      A: '#1e293b',
      W: '#facc15',
      P: '#0f172a',
      F: '#090b0e',
    },
    0,
    -2,
    2,
    b.facing === 'left'
  );

  if (state.prep.holdingWateringCan) {
    drawPixelBox(ctx, 14, -4, 14, 12, '#0284c7', '#090b0e', '#38bdf8');
  } else if (state.prep.currentStepIndex === 3 && state.prep.activeDrink) {
    const drink = RECIPES[state.prep.activeDrink];
    drawPixelBox(ctx, -8, -32, 16, 12, drink.color, '#ffffff', drink.accentColor);
  }

  ctx.restore();
}

function drawCatCompanion(ctx: CanvasRenderingContext2D, cat: CatCompanion, time: number) {
  const cx = px(cat.x);
  const hopY =
    cat.state === 'pouncing' ? -Math.abs(Math.round(Math.sin(cat.hopPhase * 8) * 10)) : 0;
  const cy = px(cat.y + hopY);
  const isWhite = cat.coatColor === 'white';
  const frame = Math.floor(time * 4.5 + cat.tailPhase) % 2;

  ctx.fillStyle = 'rgba(0, 0, 0, 0.35)';
  ctx.fillRect(cx - 14, px(cat.y) + 8, 28, 6);

  const palette: Record<string, string> = {
    O: '#090b0e',
    B: isWhite ? '#ffffff' : '#18181b',
    b: isWhite ? '#e2e8f0' : '#27272a',
    S: isWhite ? '#fda4af' : '#3f3f46',
    E: cat.eyeColor,
    C: cat.collarColor,
    G: '#facc15',
  };

  let matrix = CAT_WALK_FRAME_0;
  if (cat.state === 'napping') {
    matrix = CAT_SLEEP_MATRIX;
  } else if (cat.state === 'sitting_grooming') {
    matrix = frame === 0 ? CAT_GROOM_FRAME_0 : CAT_GROOM_FRAME_1;
  } else {
    matrix = frame === 0 ? CAT_WALK_FRAME_0 : CAT_WALK_FRAME_1;
  }

  drawSpriteMatrix(ctx, matrix, palette, cx, cy, 2, cat.facing === 'left');

  drawPixelBox(ctx, cx - 24, px(cat.y) + 12, 48, 11, '#090b0e', '#cbd5e1');
  ctx.font = 'bold 6px "Press Start 2P", monospace';
  ctx.textAlign = 'center';
  ctx.fillStyle = isWhite ? '#bae6fd' : '#86efac';
  ctx.fillText(cat.name.toUpperCase(), cx, px(cat.y) + 20);

  if (cat.state === 'napping') {
    const zOffset = Math.round(Math.sin(time * 3) * 2);
    ctx.font = 'bold 8px "Press Start 2P", monospace';
    ctx.fillStyle = '#f8fafc';
    ctx.fillText('Zzz', cx + 18, cy - 14 + zOffset);
  } else if (cat.state === 'sitting_grooming') {
    const groomBob = Math.round(Math.sin(time * 6) * 2);
    ctx.font = 'bold 7px "Press Start 2P", monospace';
    ctx.fillStyle = '#fde68a';
    ctx.fillText('lick~', cx, cy - 16 + groomBob);
  } else if (cat.state === 'pouncing') {
    ctx.font = 'bold 7px "Press Start 2P", monospace';
    ctx.fillStyle = '#86efac';
    ctx.fillText('hop!', cx, cy - 16);
  }

  if (cat.heartTimer > 0 || cat.state === 'purring') {
    const hBob = Math.sin(time * 8) * 3;
    drawPixelHeart(ctx, cx - 6, cy - 22 + hBob, 2, '#f43f5e');
    ctx.font = 'bold 9px "Press Start 2P", monospace';
    ctx.fillStyle = '#facc15';
    ctx.fillText('♪', cx + 10, cy - 18 - hBob);
  }
}

function drawCustomer(
  ctx: CanvasRenderingContext2D,
  cust: CustomerEntity,
  state: CafeState,
  time: number
) {
  const cx = px(cust.x);
  const cy = px(cust.y);
  const isMoving = cust.state === 'walking_in' || cust.state === 'walking_out';
  const frameIdx = isMoving ? Math.floor(cust.walkDist / 12) % 2 : Math.floor(time * 2) % 2;

  const outfits = [
    { H: '#7c2d12', h: '#9a3412', B: '#f43f5e', T: '#f8fafc', A: '#1e293b' },
    { H: '#0f172a', h: '#334155', B: '#38bdf8', T: '#e2e8f0', A: '#0284c7' },
    { H: '#713f12', h: '#a16207', B: '#a855f7', T: '#f8fafc', A: '#4c1d95' },
    { H: '#14532d', h: '#166534', B: '#facc15', T: '#f8fafc', A: '#065f46' },
  ];
  const pal = outfits[cust.spriteVariant % outfits.length];

  ctx.fillStyle = 'rgba(0, 0, 0, 0.38)';
  ctx.fillRect(cx - 14, cy + 14, 28, 6);

  drawSpriteMatrix(
    ctx,
    frameIdx === 0 ? CHIBI_CHAR_FRAME_0 : CHIBI_CHAR_FRAME_1,
    {
      O: '#090b0e',
      H: pal.H,
      h: pal.h,
      n: pal.H,
      B: pal.B,
      S: '#ffedd5',
      E: '#090b0e',
      C: '#fb7185',
      T: pal.T,
      A: pal.A,
      W: '#f8fafc',
      P: '#1e293b',
      F: '#090b0e',
    },
    cx,
    cy - 2,
    2
  );

  drawPixelBox(ctx, cx - 26, cy + 18, 52, 12, '#090b0e', '#94a3b8');
  ctx.font = 'bold 7px "Press Start 2P", monospace';
  ctx.textAlign = 'center';
  ctx.fillStyle = '#f8fafc';
  ctx.fillText(cust.name.toUpperCase(), cx, cy + 27);

  if (cust.state === 'waiting') {
    const recipe = RECIPES[cust.order];
    const drinkReady =
      state.prep.currentStepIndex === 3 && state.prep.activeDrink === cust.order;

    const bw = 192;
    const bh = 46;
    const bx = px(cx + 26);
    const by = px(cy - 32);

    drawPixelBox(
      ctx,
      bx,
      by,
      bw,
      bh,
      '#f8fafc',
      drinkReady ? '#facc15' : '#090b0e',
      '#cbd5e1'
    );
    ctx.strokeStyle = drinkReady ? '#16a34a' : '#334155';
    ctx.lineWidth = 2;
    ctx.strokeRect(bx + 3, by + 3, bw - 6, bh - 6);

    drawPixelBox(ctx, bx + 10, by + 12, 20, 22, recipe.color, '#090b0e', recipe.accentColor);

    ctx.textAlign = 'left';
    ctx.font = 'bold 8px "Press Start 2P", monospace';
    ctx.fillStyle = '#090b0e';
    ctx.fillText(recipe.shortName.toUpperCase(), bx + 36, by + 20);

    ctx.font = 'bold 14px "VT323", monospace';
    ctx.fillStyle = drinkReady ? '#047857' : '#334155';
    ctx.fillText(
      drinkReady
        ? '★ TAP OR [ENTER] TO SERVE!'
        : recipe.stepLabels[state.prep.currentStepIndex] ?? 'Tap bubble for Next Step!',
      bx + 36,
      by + 36
    );

    const arrowBob = Math.floor(time * 5) % 2 === 0 ? 0 : 3;
    const ax = bx + bw - 16;
    const ay = by + bh - 14 + arrowBob;
    ctx.fillStyle = '#ef4444';
    ctx.fillRect(ax, ay, 8, 2);
    ctx.fillRect(ax + 2, ay + 2, 4, 2);
    ctx.fillRect(ax + 3, ay + 4, 2, 2);
  } else if (cust.state === 'sipping') {
    const heartBob = Math.sin(time * 5 + cust.x) * 3;
    drawPixelHeart(ctx, cx, cy - 32 + heartBob, 2, '#f43f5e');
  }
}

/**
 * ============================================================================
 * MAP 1: FULL-SCREEN 900x480 "INSIDE VIEW"
 * (Monochrome Coffee Shop Interior, Cashier POS, Glass Pastry Display,
 *  3 Indoor Lounge Tables, & Right-Wing Connected 1990 Miata Garage Showroom)
 * ============================================================================
 */
function renderInsideRoom(
  ctx: CanvasRenderingContext2D,
  state: CafeState,
  time: number,
  hoveredStationId: string | null,
  hoveredMiata: boolean
) {
  // 1. Outer Architectural Slate/Brick Perimeter Frame
  drawPixelBox(ctx, 16, 14, 868, 452, '#0f172a', '#f8fafc', '#334155');

  // 2. Left/Center: Monochrome Checkered & Hardwood Cafe Flooring (x: 24..582, y: 84..456)
  const tile = 28;
  for (let r = 0; r < 14; r++) {
    for (let c = 0; c < 20; c++) {
      const tx = 26 + c * tile;
      const ty = 84 + r * tile;
      if (tx >= 584 || ty >= 456) continue;
      const isAlt = (r + c) % 2 === 0;
      ctx.fillStyle = isAlt ? '#262e3d' : '#1b2230';
      ctx.fillRect(tx, ty, tile, tile);
      ctx.fillStyle = '#313b4f';
      ctx.fillRect(tx + 2, ty + 2, tile - 4, 2);
    }
  }

  // 3. Top Interior Wall (x: 24..582, y: 20..84) with Dynamic Outdoor Window & Menu Boards
  drawPixelBox(ctx, 24, 20, 558, 64, '#111622', '#090b0e', '#334155');

  // ★ DYNAMIC OUTDOOR-FACING CAFE WINDOW (x: 44..228, y: 26..76) ★
  // Shows live sky color (Day / Sunset / Night), garden hedge, and Rain/Petals!
  const skyColor =
    state.timeOfDay === 'day'
      ? '#38bdf8'
      : state.timeOfDay === 'sunset'
        ? '#f97316'
        : '#0f172a';
  drawPixelBox(ctx, 44, 26, 184, 50, skyColor, '#f8fafc');
  if (state.timeOfDay === 'sunset') {
    ctx.fillStyle = '#fb7185';
    ctx.fillRect(46, 28, 180, 20);
    ctx.fillStyle = '#fde047';
    ctx.fillRect(118, 44, 18, 14); // Setting sun
  } else if (state.timeOfDay === 'night') {
    ctx.fillStyle = '#fef08a';
    ctx.fillRect(72, 34, 4, 4);
    ctx.fillRect(142, 38, 4, 4);
    ctx.fillRect(190, 32, 8, 8); // Crescent moon hint
  } else {
    ctx.fillStyle = '#fef08a';
    ctx.fillRect(184, 32, 14, 14); // Bright sun
  }
  // Distant green daisy hedge visible through the window
  ctx.fillStyle = '#16a34a';
  ctx.fillRect(46, 60, 180, 14);
  ctx.fillStyle = '#ffffff';
  for (let wx = 58; wx < 216; wx += 28) {
    ctx.fillRect(wx, 64, 4, 4);
  }
  // Weather streaks inside the window
  if (state.weather === 'rain') {
    ctx.fillStyle = '#bae6fd';
    for (let i = 0; i < 8; i++) {
      const rx = 54 + ((i * 23 + Math.floor(time * 90)) % 164);
      const ry = 30 + ((i * 17 + Math.floor(time * 140)) % 40);
      ctx.fillRect(rx, ry, 2, 8);
    }
  } else if (state.weather === 'breeze') {
    ctx.fillStyle = '#ffffff';
    for (let i = 0; i < 5; i++) {
      const pxW = 54 + ((i * 33 + Math.floor(time * 45)) % 164);
      const pyW = 34 + ((i * 19 + Math.floor(time * 25)) % 34);
      ctx.fillRect(pxW, pyW, 4, 4);
    }
  }
  // Window Mullion Bars
  ctx.fillStyle = '#090b0e';
  ctx.fillRect(134, 26, 4, 50);
  ctx.fillRect(44, 50, 184, 3);

  // Overhead Wall Menu Boards (x: 248..568, y: 34..76)
  drawPixelBox(ctx, 248, 34, 152, 42, '#1e293b', '#f8fafc', '#475569');
  ctx.font = 'bold 6px "Press Start 2P", monospace';
  ctx.textAlign = 'left';
  ctx.fillStyle = '#facc15';
  ctx.fillText('★ ESPRESSO BAR', 256, 46);
  ctx.fillStyle = '#f8fafc';
  ctx.fillText('COLD BREW  $14', 256, 58);
  ctx.fillText('MIATA MOCHA $18', 256, 69);

  drawPixelBox(ctx, 412, 34, 156, 42, '#1e293b', '#f8fafc', '#475569');
  ctx.fillStyle = '#86efac';
  ctx.fillText('★ GARDEN SPECIALS', 420, 46);
  ctx.fillStyle = '#f8fafc';
  ctx.fillText('DAISY LATTE $16', 420, 58);
  ctx.fillText('CATNIP TEA  $15', 420, 69);

  // Hanging Warm Pendant Lamps along the top bar
  [136, 238, 406].forEach((lx) => {
    ctx.fillStyle = '#090b0e';
    ctx.fillRect(lx - 2, 16, 4, 10);
    drawPixelBox(ctx, lx - 10, 24, 20, 8, '#facc15', '#090b0e', '#fef08a');
  });

  // 4. Soft Woven Cafe Rug for Lilo (x: 444..552, y: 218..276)
  drawPixelBox(ctx, 444, 218, 108, 58, '#334155', '#090b0e', '#64748b');
  drawPixelBox(ctx, 454, 226, 88, 42, '#1e293b', '#cbd5e1');

  // 5. Rear Brewing Bar (x: 68..540, y: 114..172)
  drawPixelBox(ctx, 68, 116, 472, 46, '#0f172a', '#090b0e', '#334155');
  drawPixelBox(ctx, 68, 162, 472, 14, '#1e293b', '#090b0e');

  // 6. Front Counter with Cashier POS Register, Glass Pastry Display Case, & Pickup Bar
  drawPixelBox(ctx, 68, 218, 360, 38, '#0f172a', '#090b0e', '#475569');
  drawPixelBox(ctx, 68, 256, 360, 18, '#334155', '#090b0e');
  ctx.fillStyle = '#090b0e';
  for (let rx = 80; rx < 418; rx += 16) {
    ctx.fillRect(rx, 258, 4, 14);
  }

  // ★ CASHIER POS REGISTER (x = 84..148, y = 206..248) ★
  drawPixelBox(ctx, 84, 210, 58, 34, '#1e293b', '#090b0e', '#94a3b8');
  drawPixelBox(ctx, 90, 214, 34, 16, '#064e3b', '#090b0e');
  ctx.font = 'bold 6px "Press Start 2P", monospace';
  ctx.textAlign = 'center';
  ctx.fillStyle = '#4ade80';
  ctx.fillText('$ POS', 107, 225);
  // Receipt slip
  ctx.fillStyle = '#f8fafc';
  ctx.fillRect(130, 212, 8, 12);

  // ★ GLASS PASTRY DISPLAY CASE (x = 162..276, y = 208..250) ★
  drawPixelBox(ctx, 162, 210, 112, 36, '#38bdf8', '#090b0e', '#bae6fd');
  drawPixelBox(ctx, 166, 216, 104, 26, '#0f172a');
  // Golden Croissant, Matcha Roll & Berry Danish inside the glass case
  drawPixelBox(ctx, 174, 224, 22, 12, '#f59e0b', '#090b0e', '#fde047'); // Croissant
  drawPixelBox(ctx, 206, 224, 22, 12, '#22c55e', '#090b0e', '#bbf7d0'); // Matcha Roll
  drawPixelBox(ctx, 238, 224, 22, 12, '#f43f5e', '#090b0e', '#fecdd3'); // Berry Tart
  ctx.font = 'bold 6px "Press Start 2P", monospace';
  ctx.fillStyle = '#e2e8f0';
  ctx.fillText('PASTRIES', 218, 255);

  // Render the 7 Indoor Brewing & Pickup Stations (exclude watering_can which is in GARDEN)
  const recommendedStation =
    state.prep.processingStation === null ? getRecommendedStation(state) : null;
  STATIONS.filter((s) => s.id !== 'watering_can').forEach((station) => {
    drawStation(
      ctx,
      station,
      state,
      time,
      hoveredStationId === station.id,
      recommendedStation === station.id
    );
  });

  // 7. 3 Cozy Indoor Seating Lounge Tables with Chairs (y: 340..400)
  INDOOR_TABLES.forEach((t) => {
    ctx.fillStyle = 'rgba(0, 0, 0, 0.35)';
    ctx.fillRect(t.x - 36, t.y + 8, 72, 16);
    drawPixelBox(ctx, t.x - 40, t.y - 8, 16, 18, '#334155', '#090b0e', '#64748b');
    drawPixelBox(ctx, t.x + 24, t.y - 8, 16, 18, '#334155', '#090b0e', '#64748b');
    drawPixelBox(ctx, t.x - 24, t.y - 18, 48, 28, '#f8fafc', '#090b0e', '#ffffff');
    // Mini warm table lamp on each indoor table
    drawPixelBox(ctx, t.x - 5, t.y - 14, 10, 10, '#facc15', '#090b0e', '#fef08a');
  });

  // 8. South Doorway Mat leading to the Backyard Daisy Garden (`INSIDE_DOOR_MAT`)
  const dm = INSIDE_DOOR_MAT;
  drawPixelBox(
    ctx,
    dm.x - dm.width / 2,
    dm.y - dm.height / 2,
    dm.width,
    dm.height,
    '#14532d',
    '#facc15',
    '#22c55e'
  );
  ctx.font = 'bold 7px "Press Start 2P", monospace';
  ctx.textAlign = 'center';
  ctx.fillStyle = '#fef08a';
  ctx.fillText('▼ TO GARDEN [V]', dm.x, dm.y + 4);

  // 9. RIGHT WING: CONNECTED 1990 MIATA GARAGE SHOWROOM (x: 586..876, y: 20..456)
  const bayLeft = 588;
  const bayTop = 20;
  const bayW = 288;
  const bayH = 436;

  drawPixelBox(ctx, bayLeft, bayTop, bayW, bayH, '#18181b', '#090b0e', '#3f3f46');

  // Interior Steel & Glass Partition Wall at x = 584 (with open doorway arch at y = 188..276)
  drawPixelBox(ctx, 580, 20, 12, 168, '#0f172a', '#090b0e', '#64748b');
  drawPixelBox(ctx, 582, 42, 8, 124, '#38bdf8', '#090b0e', '#bae6fd'); // Glass showroom partition
  drawPixelBox(ctx, 580, 276, 12, 180, '#0f172a', '#090b0e', '#64748b');
  drawPixelBox(ctx, 582, 296, 8, 130, '#38bdf8', '#090b0e', '#bae6fd');

  // High-Contrast Black & White Checkered Garage Showroom Floor
  const gTile = 28;
  for (let r = 0; r < 12; r++) {
    for (let c = 0; c < 9; c++) {
      const isWhite = (r + c) % 2 === 0;
      ctx.fillStyle = isWhite ? '#e2e8f0' : '#1e232d';
      ctx.fillRect(bayLeft + 18 + c * gTile, bayTop + 68 + r * gTile, gTile, gTile);
    }
  }

  // Red Mechanic Tool Chest + Spare Performance Tire Rack + JDM Plaque
  drawPixelBox(ctx, bayLeft + 18, bayTop + 14, 92, 38, '#dc2626', '#090b0e', '#f87171');
  ctx.fillStyle = '#f8fafc';
  ctx.fillRect(bayLeft + 26, bayTop + 26, 76, 3);
  ctx.fillRect(bayLeft + 26, bayTop + 34, 76, 3);
  ctx.fillRect(bayLeft + 26, bayTop + 42, 76, 3);

  // Spare Tire Rack (4 stacked performance slicks)
  drawPixelBox(ctx, bayLeft + 120, bayTop + 14, 72, 38, '#1e293b', '#090b0e', '#64748b');
  for (let ti = 0; ti < 4; ti++) {
    drawPixelBox(ctx, bayLeft + 126 + ti * 15, bayTop + 20, 12, 26, '#090b0e', '#475569');
  }

  // Showroom Banner
  drawPixelBox(ctx, bayLeft + 200, bayTop + 14, 74, 38, '#0f172a', '#f8fafc');
  ctx.font = 'bold 6px "Press Start 2P", monospace';
  ctx.textAlign = 'center';
  ctx.fillStyle = '#facc15';
  ctx.fillText('1990 NA', bayLeft + 237, bayTop + 30);
  ctx.fillStyle = '#f8fafc';
  ctx.fillText('MX-5 ★', bayLeft + 237, bayTop + 42);

  // 1990 Mazda Miata MX-5 (NA) Top-Down 3/4 Pixel Art Sprite
  const mx = px(MIATA_GARAGE_BOUNDS.x);
  const my = px(MIATA_GARAGE_BOUNDS.y);
  const carW = 92;
  const carH = 156;
  const cLeft = mx - carW / 2;
  const cTop = my - carH / 2;

  ctx.fillStyle = 'rgba(0, 0, 0, 0.48)';
  ctx.fillRect(cLeft - 6, cTop + 8, carW + 12, carH);

  ctx.fillStyle = '#090b0e';
  ctx.fillRect(cLeft - 6, cTop + 20, 8, 28);
  ctx.fillRect(cLeft + carW - 2, cTop + 20, 8, 28);
  ctx.fillRect(cLeft - 6, cTop + carH - 46, 8, 28);
  ctx.fillRect(cLeft + carW - 2, cTop + carH - 46, 8, 28);

  const outlineCol = hoveredMiata ? '#facc15' : '#090b0e';
  drawPixelBox(ctx, cLeft + 4, cTop, carW - 8, carH, '#f8fafc', outlineCol, '#ffffff');
  drawPixelBox(ctx, cLeft, cTop + 10, carW, carH - 20, '#f8fafc', outlineCol);

  ctx.fillStyle = '#cbd5e1';
  ctx.fillRect(cLeft + 4, cTop + 14, 6, carH - 28);
  ctx.fillRect(cLeft + carW - 10, cTop + 14, 6, carH - 28);

  ctx.strokeStyle = '#94a3b8';
  ctx.lineWidth = 2;
  ctx.strokeRect(cLeft + 14, cTop + 80, carW - 28, 54);

  drawPixelBox(ctx, cLeft + 12, cTop + 32, carW - 24, 48, '#0f172a', '#090b0e');
  drawPixelBox(ctx, cLeft + 10, cTop + 68, carW - 20, 14, '#38bdf8', '#090b0e', '#bae6fd');
  drawPixelBox(ctx, cLeft + 18, cTop + 38, 20, 18, '#1e293b', '#090b0e', '#334155');
  drawPixelBox(ctx, cLeft + carW - 38, cTop + 38, 20, 18, '#1e293b', '#090b0e', '#334155');
  ctx.fillStyle = '#f8fafc';
  ctx.fillRect(cLeft + 22, cTop + 60, 12, 4);

  drawPixelBox(ctx, cLeft - 8, cTop + 72, 8, 6, '#f8fafc', '#090b0e');
  drawPixelBox(ctx, cLeft + carW, cTop + 72, 8, 6, '#f8fafc', '#090b0e');

  ctx.fillStyle = '#ef4444';
  ctx.fillRect(cLeft + 10, cTop + 2, 18, 6);
  ctx.fillRect(cLeft + carW - 28, cTop + 2, 18, 6);

  ctx.fillStyle = '#090b0e';
  ctx.fillRect(cLeft + 22, cTop + carH - 6, carW - 44, 4);

  // ★ ICONIC 1990 MIATA POP-UP HEADLIGHTS ★
  const hlY = cTop + carH - 26;
  const leftHlX = cLeft + 12;
  const rightHlX = cLeft + carW - 30;

  if (state.miataHeadlightsOn) {
    drawPixelBox(ctx, leftHlX, hlY - 4, 18, 16, '#1e293b', '#090b0e', '#475569');
    drawPixelBox(ctx, rightHlX, hlY - 4, 18, 16, '#1e293b', '#090b0e', '#475569');
    ctx.fillStyle = '#fef08a';
    ctx.fillRect(leftHlX + 2, hlY + 6, 14, 6);
    ctx.fillRect(rightHlX + 2, hlY + 6, 14, 6);

    const beamAlpha =
      state.timeOfDay === 'night'
        ? 0.45
        : state.timeOfDay === 'sunset'
          ? 0.34
          : 0.22;
    ctx.fillStyle = `rgba(254, 240, 138, ${beamAlpha})`;
    ctx.beginPath();
    ctx.moveTo(leftHlX, hlY + 12);
    ctx.lineTo(leftHlX + 18, hlY + 12);
    ctx.lineTo(leftHlX + 38, hlY + 108);
    ctx.lineTo(leftHlX - 24, hlY + 108);
    ctx.closePath();
    ctx.fill();

    ctx.beginPath();
    ctx.moveTo(rightHlX, hlY + 12);
    ctx.lineTo(rightHlX + 18, hlY + 12);
    ctx.lineTo(rightHlX + 44, hlY + 108);
    ctx.lineTo(rightHlX - 18, hlY + 108);
    ctx.closePath();
    ctx.fill();
  } else {
    ctx.strokeStyle = '#64748b';
    ctx.lineWidth = 2;
    ctx.strokeRect(leftHlX, hlY, 18, 12);
    ctx.strokeRect(rightHlX, hlY, 18, 12);
  }

  drawPixelBox(ctx, mx - 92, bayTop + bayH - 32, 184, 20, '#090b0e', '#f8fafc');
  ctx.font = 'bold 8px "Press Start 2P", monospace';
  ctx.textAlign = 'center';
  ctx.fillStyle = state.miataHeadlightsOn ? '#facc15' : '#cbd5e1';
  ctx.fillText(
    state.miataHeadlightsOn ? '90 MIATA [H] LIGHTS:ON' : '90 MIATA [H] LIGHTS:OFF',
    mx,
    bayTop + bayH - 19
  );
}

/**
 * ============================================================================
 * MAP 2: FULL-SCREEN 900x480 "GARDEN VIEW"
 * (Top Veranda with Pass-Through Order Window, Stone Pathways, Overhead Fairy
 *  String Lanterns, Center Watering Well, 4 Umbrella Lounge Tables, & 6 Daisy Beds)
 * ============================================================================
 */
function renderGardenRoom(
  ctx: CanvasRenderingContext2D,
  state: CafeState,
  time: number,
  hoveredDaisyId: string | null,
  hoveredStationId: string | null
) {
  // 1. Lush GBA Tiered Pixel Grass Field (900x480)
  const tileSize = 32;
  for (let row = 0; row < Math.ceil(WORLD_HEIGHT / tileSize); row++) {
    for (let col = 0; col < Math.ceil(WORLD_WIDTH / tileSize); col++) {
      const isAlt = (row + col) % 2 === 0;
      ctx.fillStyle = isAlt ? '#4ade80' : '#22c55e';
      ctx.fillRect(col * tileSize, row * tileSize, tileSize, tileSize);

      if ((row * 7 + col * 11) % 4 === 0) {
        const windAmp = state.weather === 'breeze' ? 3 : 1.5;
        const sway = Math.round(Math.sin(time * 2.8 + col) * windAmp);
        ctx.fillStyle = '#15803d';
        ctx.fillRect(col * tileSize + 10 + sway, row * tileSize + 12, 4, 8);
        ctx.fillRect(col * tileSize + 16 + sway, row * tileSize + 14, 4, 6);
      }
    }
  }

  // 2. Wrought-Iron & Slate Backyard Perimeter Fence
  ctx.fillStyle = '#090b0e';
  ctx.fillRect(16, 462, WORLD_WIDTH - 32, 6);
  for (let fx = 24; fx < WORLD_WIDTH - 24; fx += 32) {
    drawPixelBox(ctx, fx, 452, 10, 20, '#334155', '#090b0e', '#94a3b8');
  }

  // 3. Stone Pathways radiating from the Veranda Door to the Center Watering Well & Lounge Tables
  const paths = [
    { x: 450, y: 140, w: 96, h: 24 },
    { x: 450, y: 174, w: 96, h: 24 },
    { x: 450, y: 208, w: 104, h: 24 },
    { x: 450, y: 254, w: 148, h: 86 }, // Central stone plaza around the Watering Well
    { x: 356, y: 254, w: 64, h: 26 },
    { x: 544, y: 254, w: 64, h: 26 },
    { x: 450, y: 318, w: 96, h: 24 },
    { x: 450, y: 356, w: 96, h: 24 },
    { x: 450, y: 394, w: 96, h: 24 },
  ];
  paths.forEach((s) => {
    drawPixelBox(ctx, s.x - s.w / 2, s.y - s.h / 2, s.w, s.h, '#cbd5e1', '#090b0e', '#f8fafc');
  });

  // 4. TOP VERANDA: Back Facade of the Klasik Cafe Building (x: 40..860, y: 14..116)
  drawPixelBox(ctx, 40, 14, 820, 98, '#0f172a', '#090b0e', '#334155');
  // Monochrome Striped Awning
  const stripeCount = 18;
  const stripeW = 820 / stripeCount;
  for (let i = 0; i < stripeCount; i++) {
    drawPixelBox(
      ctx,
      40 + i * stripeW,
      14,
      stripeW,
      28,
      i % 2 === 0 ? '#111318' : '#f8fafc',
      '#090b0e'
    );
  }
  drawPixelBox(ctx, 210, 18, 480, 26, '#090b0e', '#f8fafc', '#334155');
  ctx.font = 'bold 10px "Press Start 2P", monospace';
  ctx.textAlign = 'center';
  ctx.fillStyle = '#facc15';
  ctx.fillText('KLASIK — BACKYARD DAISY GARDEN ★', 450, 36);

  // ★ VERANDA PASS-THROUGH ORDER WINDOW (`GARDEN_ORDER_WINDOW` at x = 260, y = 82) ★
  const ow = GARDEN_ORDER_WINDOW;
  const waitingCustomer = state.customers.find((c) => c.state === 'waiting');
  const orderRecipe = waitingCustomer ? RECIPES[waitingCustomer.order] : null;
  drawPixelBox(
    ctx,
    ow.x - ow.width / 2,
    ow.y - ow.height / 2,
    ow.width,
    ow.height,
    '#1e293b',
    '#facc15',
    '#475569'
  );
  drawPixelBox(
    ctx,
    ow.x - ow.width / 2 + 6,
    ow.y - ow.height / 2 + 6,
    ow.width - 12,
    ow.height - 12,
    '#f8fafc',
    '#090b0e'
  );
  ctx.font = 'bold 6px "Press Start 2P", monospace';
  ctx.textAlign = 'center';
  ctx.fillStyle = '#090b0e';
  ctx.fillText(
    waitingCustomer && orderRecipe
      ? `${waitingCustomer.name.toUpperCase()}: ${orderRecipe.shortName.toUpperCase()}`
      : 'PASS-THROUGH BAR',
    ow.x,
    ow.y - 4
  );
  ctx.font = 'bold 13px "VT323", monospace';
  ctx.fillStyle = '#047857';
  ctx.fillText(
    `STEP ${state.prep.currentStepIndex}/3 · TAP TO BREW`,
    ow.x,
    ow.y + 11
  );

  // North Doorway Mat leading back INSIDE (`GARDEN_DOOR_MAT` at x = 450, y = 102)
  const gdm = GARDEN_DOOR_MAT;
  drawPixelBox(
    ctx,
    gdm.x - gdm.width / 2,
    gdm.y - gdm.height / 2,
    gdm.width,
    gdm.height,
    '#18181b',
    '#facc15',
    '#334155'
  );
  ctx.font = 'bold 7px "Press Start 2P", monospace';
  ctx.textAlign = 'center';
  ctx.fillStyle = '#fef08a';
  ctx.fillText('▲ TO CAFE [V]', gdm.x, gdm.y + 4);

  // Decorative Veranda Window on Right Side (x = 640, y = 82)
  drawPixelBox(ctx, 576, 62, 136, 36, '#38bdf8', '#f8fafc', '#bae6fd');
  ctx.fillStyle = '#090b0e';
  ctx.fillRect(642, 62, 4, 36);

  // 5. ★ CENTER GARDEN WATERING WELL (`x = 450, y = 254`) ★
  const wellX = 450;
  const wellY = 254;
  const wellHovered = hoveredStationId === 'watering_can';
  drawPixelBox(
    ctx,
    wellX - 34,
    wellY - 22,
    68,
    46,
    '#475569',
    wellHovered ? '#facc15' : '#090b0e',
    '#94a3b8'
  );
  drawPixelBox(ctx, wellX - 24, wellY - 14, 48, 28, '#0284c7', '#090b0e', '#38bdf8');
  // Wooden Well Roof Posts & Pitch Roof
  drawPixelBox(ctx, wellX - 30, wellY - 38, 8, 20, '#78350f', '#090b0e');
  drawPixelBox(ctx, wellX + 22, wellY - 38, 8, 20, '#78350f', '#090b0e');
  drawPixelBox(ctx, wellX - 38, wellY - 46, 76, 12, '#1e293b', '#090b0e', '#475569');
  // Slate Watering Can beside the well
  drawPixelBox(ctx, wellX + 18, wellY + 2, 22, 16, '#0284c7', '#090b0e', '#38bdf8');
  drawPixelBox(ctx, wellX - 36, wellY + 26, 72, 12, '#090b0e', '#475569');
  ctx.font = 'bold 6px "Press Start 2P", monospace';
  ctx.textAlign = 'center';
  ctx.fillStyle = '#7dd3fc';
  ctx.fillText('WELL [W]', wellX, wellY + 35);

  // 6. ★ 4 OUTDOOR UMBRELLA LOUNGE TABLES (`GARDEN_TABLES`) ★
  GARDEN_TABLES.forEach((t, idx) => {
    ctx.fillStyle = 'rgba(0, 0, 0, 0.35)';
    ctx.fillRect(t.x - 40, t.y + 8, 80, 18);
    // Bistro Chairs
    drawPixelBox(ctx, t.x - 42, t.y - 8, 16, 18, '#334155', '#090b0e', '#64748b');
    drawPixelBox(ctx, t.x + 26, t.y - 8, 16, 18, '#334155', '#090b0e', '#64748b');
    // Table Top
    drawPixelBox(ctx, t.x - 26, t.y - 18, 52, 30, '#f8fafc', '#090b0e', '#ffffff');
    // Striped Cafe Umbrella Canopy Hint above table
    drawPixelBox(
      ctx,
      t.x - 28,
      t.y - 36,
      56,
      14,
      idx % 2 === 0 ? '#0f172a' : '#1e293b',
      '#f8fafc',
      '#facc15'
    );
    ctx.fillStyle = '#090b0e';
    ctx.fillRect(t.x - 2, t.y - 22, 4, 10);
    drawSingleDaisy(ctx, t.x, t.y - 8, Math.sin(time * 2 + idx) * 1, true);
  });

  // 7. ★ 6 BLOOMING DAISY PLANTER BEDS ★
  state.daisies.forEach((patch) => {
    drawDaisyBed(ctx, patch, state, time, hoveredDaisyId === patch.id);
  });

  // 8. ★ OVERHEAD FAIRY STRING LANTERNS ★
  [148, 294].forEach((ly) => {
    ctx.strokeStyle = '#1e293b';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(110, ly);
    ctx.quadraticCurveTo(450, ly + 18, 790, ly);
    ctx.stroke();

    for (let i = 1; i <= 7; i++) {
      const frac = i / 8;
      const bx = 110 + frac * 680;
      const by = ly + Math.sin(frac * Math.PI) * 9;
      const isLit = state.timeOfDay !== 'day';
      drawPixelBox(
        ctx,
        bx - 4,
        by,
        8,
        8,
        isLit ? '#fef08a' : '#e2e8f0',
        '#090b0e'
      );
    }
  });
}

/**
 * Renders Ambient Day / Sunset / Night Lighting Tint & Glowing Lamp/Headlight Halos
 */
function renderAmbientLighting(
  ctx: CanvasRenderingContext2D,
  state: CafeState,
  time: number
) {
  if (state.timeOfDay === 'day') return;

  const isNight = state.timeOfDay === 'night';
  const pulse = 0.92 + Math.sin(time * 4) * 0.08;

  // 1. Ambient Color Overlay
  ctx.fillStyle = isNight
    ? 'rgba(10, 15, 34, 0.42)'
    : 'rgba(234, 88, 12, 0.16)';
  ctx.fillRect(0, 0, WORLD_WIDTH, WORLD_HEIGHT);

  // 2. Warm Glowing Light Pools around Lamps, Windows, Lanterns & Headlights
  const glowAlpha = (isNight ? 0.34 : 0.22) * pulse;

  if (state.room === 'inside') {
    // Pendant Lamps over Brewing Bar
    [120, 296, 464].forEach((lx) => {
      drawWarmLightPool(ctx, lx, 120, 68, glowAlpha);
    });
    // Indoor Table Lamps
    INDOOR_TABLES.forEach((t) => {
      drawWarmLightPool(ctx, t.x, t.y - 6, 48, glowAlpha * 0.85);
    });
    // 1990 Miata MX-5 Pop-Up Headlight Glow
    if (state.miataHeadlightsOn) {
      drawWarmLightPool(
        ctx,
        MIATA_GARAGE_BOUNDS.x,
        MIATA_GARAGE_BOUNDS.y + 92,
        78,
        glowAlpha * 1.2
      );
    }
  } else {
    // Garden Pass-Through Order Window & Veranda Window Glow
    drawWarmLightPool(ctx, GARDEN_ORDER_WINDOW.x, GARDEN_ORDER_WINDOW.y + 18, 76, glowAlpha);
    drawWarmLightPool(ctx, 644, 96, 62, glowAlpha * 0.8);

    // Overhead Fairy String Lanterns Glow
    [148, 294].forEach((ly) => {
      for (let i = 1; i <= 7; i += 2) {
        const frac = i / 8;
        const bx = 110 + frac * 680;
        const by = ly + Math.sin(frac * Math.PI) * 9;
        drawWarmLightPool(ctx, bx, by + 6, 42, glowAlpha * 0.85);
      }
    });

    // Night Fireflies in the Backyard Daisy Garden!
    if (isNight) {
      for (let f = 0; f < 10; f++) {
        const fx = 90 + ((f * 83 + Math.sin(time * 1.4 + f) * 28) % 720);
        const fy = 150 + ((f * 57 + Math.cos(time * 1.8 + f * 2) * 22) % 290);
        const blink = 0.5 + 0.5 * Math.sin(time * 5 + f * 1.7);
        ctx.fillStyle = `rgba(190, 242, 100, ${blink * 0.4})`;
        ctx.fillRect(px(fx - 4), px(fy - 4), 10, 10);
        ctx.fillStyle = '#ecfccb';
        ctx.fillRect(px(fx), px(fy), 4, 4);
      }
    }
  }
}

/**
 * ============================================================================
 * MAIN GBA WORLD RENDERER ("KLASIK - GARDEN GARAGE CAFE ★")
 * Renders either the full-screen INSIDE map or the full-screen GARDEN map.
 * ============================================================================
 */
export function renderCafeWorld(
  ctx: CanvasRenderingContext2D,
  state: CafeState,
  particles: ParticlePool,
  time: number,
  hoveredStationId: string | null,
  hoveredDaisyId: string | null,
  hoveredMiata = false
) {
  ctx.save();
  ctx.imageSmoothingEnabled = false;

  ctx.fillStyle = '#0b0d12';
  ctx.fillRect(0, 0, WORLD_WIDTH, WORLD_HEIGHT);

  // 1. Render Active Full-Screen 900x480 Map (`inside` or `garden`)
  if (state.room === 'inside') {
    renderInsideRoom(ctx, state, time, hoveredStationId, hoveredMiata);
  } else {
    renderGardenRoom(ctx, state, time, hoveredDaisyId, hoveredStationId);
  }

  // 2. Depth-Sorted Chibi Characters & Roaming Cats in the Current Room
  const actors: Array<{ y: number; draw: () => void }> = [
    {
      y: state.barista.y,
      draw: () => drawBarista(ctx, state, time),
    },
    ...state.cats
      .filter((cat) => cat.room === state.room)
      .map((cat) => ({
        y: cat.y,
        draw: () => drawCatCompanion(ctx, cat, time),
      })),
    ...state.customers
      .filter((c) => c.room === state.room)
      .map((c) => ({
        y: c.y,
        draw: () => drawCustomer(ctx, c, state, time),
      })),
  ];
  actors.sort((a, b) => a.y - b.y);
  actors.forEach((a) => a.draw());

  // 3. Pooled Particles (Hearts, Notes, Water Droplets, Sparkles, Breeze Petals, Rain & Ripples)
  for (let i = 0; i < particles.items.length; i++) {
    const p = particles.items[i];
    if (!p.active) continue;

    // Rain, ripples, and breeze petals only render full-screen in the outdoor GARDEN room
    if (
      state.room === 'inside' &&
      (p.kind === 'rain' || p.kind === 'ripple' || p.kind === 'petal')
    ) {
      continue;
    }

    const alpha = Math.max(0, Math.min(1, p.life / p.maxLife));
    ctx.globalAlpha = alpha;
    if (p.kind === 'heart') {
      drawPixelHeart(ctx, p.x, p.y, 2, p.color);
    } else if (p.kind === 'note') {
      ctx.font = 'bold 10px "Press Start 2P", monospace';
      ctx.fillStyle = p.color;
      ctx.fillText('♪', px(p.x), px(p.y));
    } else if (p.kind === 'rain') {
      ctx.fillStyle = p.color;
      ctx.fillRect(px(p.x), px(p.y), 2, 10);
      ctx.fillRect(px(p.x) - 2, px(p.y) + 6, 2, 6);
    } else if (p.kind === 'ripple') {
      const rSize = Math.round((1 - alpha) * 14) + 4;
      ctx.strokeStyle = p.color;
      ctx.lineWidth = 2;
      ctx.strokeRect(px(p.x - rSize / 2), px(p.y - rSize / 4), rSize, Math.max(2, rSize / 2));
    } else if (p.kind === 'petal') {
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(px(p.x), px(p.y), 6, 4);
      ctx.fillStyle = '#facc15';
      ctx.fillRect(px(p.x) + 2, px(p.y) + 2, 2, 2);
    } else {
      ctx.fillStyle = p.color;
      ctx.fillRect(px(p.x), px(p.y), px(p.size), px(p.size));
    }
  }
  ctx.globalAlpha = 1;

  // 4. Day / Sunset / Night Ambient Lighting & Lamp/Headlight Glow Halos
  renderAmbientLighting(ctx, state, time);

  // 5. Floating World Text Popups in the Active Room
  for (let i = 0; i < state.popups.length; i++) {
    const pop = state.popups[i];
    if (pop.room !== state.room) continue;
    const alpha = Math.max(0, Math.min(1, pop.life / pop.maxLife));
    ctx.globalAlpha = alpha;
    ctx.font = 'bold 9px "Press Start 2P", monospace';
    ctx.textAlign = 'center';
    ctx.fillStyle = '#090b0e';
    ctx.fillText(pop.text, px(pop.x) + 2, px(pop.y) + 2);
    ctx.fillStyle = pop.color;
    ctx.fillText(pop.text, px(pop.x), px(pop.y));
  }
  ctx.globalAlpha = 1;

  ctx.restore();
}
