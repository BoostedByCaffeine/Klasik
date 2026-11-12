import {
  CafeState,
  STATIONS,
  RECIPES,
  GARDEN_TABLES,
  MIATA_GARAGE_BOUNDS,
  DaisyPatch,
  CustomerEntity,
  CatCompanion,
  StationConfig,
  ViewMode,
  getRecommendedStation,
} from './rules';

export const WORLD_WIDTH = 900;
export const WORLD_HEIGHT = 480;

export interface CameraTransform {
  zoom: number;
  focusX: number;
  focusY: number;
}

export function getTargetCamera(viewMode: ViewMode): CameraTransform {
  if (viewMode === 'indoor') {
    return { zoom: 1.24, focusX: 508, focusY: 196 };
  }
  if (viewMode === 'outdoor') {
    return { zoom: 1.22, focusX: 450, focusY: 332 };
  }
  return { zoom: 1.0, focusX: WORLD_WIDTH / 2, focusY: WORLD_HEIGHT / 2 };
}

export function screenToWorldWithCamera(
  clientX: number,
  clientY: number,
  rect: DOMRect,
  cam: CameraTransform
): { x: number; y: number } {
  if (rect.width === 0 || rect.height === 0) return { x: 0, y: 0 };
  const canvasX = ((clientX - rect.left) / rect.width) * WORLD_WIDTH;
  const canvasY = ((clientY - rect.top) / rect.height) * WORLD_HEIGHT;
  const worldX = (canvasX - WORLD_WIDTH / 2) / cam.zoom + cam.focusX;
  const worldY = (canvasY - WORLD_HEIGHT / 2) / cam.zoom + cam.focusY;
  return { x: worldX, y: worldY };
}

export type ParticleKind = 'heart' | 'water' | 'steam' | 'sparkle' | 'pollen' | 'note';

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

const POOL_CAPACITY = 130;

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
 * ============================================================================
 * MULTI-STATE ROAMING CAT COMPANION MATRICES (Lilo & Champy)
 * Walking (Swishing Tail), Sitting & Grooming (Paw Lick), Pouncing, & Napping
 * ============================================================================
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

/**
 * Draws a bright White Daisy flower with a Golden-Yellow center
 */
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

/**
 * Draws a sleek Monochrome Slate/Charcoal Daisy Planter Box
 */
function drawDaisyBed(
  ctx: CanvasRenderingContext2D,
  patch: DaisyPatch,
  time: number,
  hovered: boolean
) {
  const w = 92;
  const h = 58;
  const left = px(patch.x - w / 2);
  const top = px(patch.y - h / 2);

  const borderCol = hovered ? '#facc15' : patch.needsWater ? '#38bdf8' : '#090b0e';
  drawPixelBox(ctx, left, top, w, h, '#1e293b', borderCol, '#475569');

  drawPixelBox(ctx, left + 6, top + 6, w - 12, h - 12, '#0f172a');
  ctx.fillStyle = patch.needsWater ? '#3f6212' : '#16a34a';
  ctx.fillRect(left + 10, top + 10, w - 20, h - 22);
  ctx.fillStyle = patch.needsWater ? '#4d7c0f' : '#22c55e';
  ctx.fillRect(left + 14, top + 12, w - 28, h - 26);

  const sway = Math.sin(time * 2.6 + patch.x * 0.1) * 2;
  const offsets = [
    [-24, -10],
    [0, -12],
    [24, -10],
    [-20, 8],
    [4, 10],
    [26, 8],
  ];
  offsets.forEach(([ox, oy], idx) => {
    const localSway = idx % 2 === 0 ? sway : -sway;
    drawSingleDaisy(ctx, patch.x + ox, patch.y + oy, localSway, !patch.needsWater);
  });

  // Pixel Hydration Meter Bar
  const barW = 68;
  const barX = px(patch.x - barW / 2);
  const barY = top + h - 8;
  drawPixelBox(ctx, barX, barY, barW, 5, '#090b0e', '#334155');
  const fillW = Math.round((barW * Math.max(0, Math.min(100, patch.hydration))) / 100);
  ctx.fillStyle = patch.needsWater ? '#facc15' : '#38bdf8';
  ctx.fillRect(barX, barY, fillW, 5);

  if (patch.needsWater) {
    const bob = Math.sin(time * 5.2 + patch.y) * 3;
    drawWaterDropIcon(ctx, patch.x, top - 16, bob);
  }
}

/**
 * ============================================================================
 * ARCHITECTURAL ZONE 1: INDOOR MONOCHROME COFFEE SHOP (CENTER-TOP BUILDING)
 * Enclosed by dark slate walls, warm monochrome checkerboard/hardwood flooring,
 * top wall menu boards, front garden windows, cozy cat rug, and "KLASIK" welcome mat.
 * ============================================================================
 */
function drawIndoorCoffeeShopBuilding(ctx: CanvasRenderingContext2D) {
  const bLeft = 152;
  const bTop = 76;
  const bWidth = 484;
  const bHeight = 220;

  // Exterior building drop shadow on the grass
  ctx.fillStyle = 'rgba(0, 0, 0, 0.38)';
  ctx.fillRect(bLeft - 6, bTop + 10, bWidth + 12, bHeight + 8);

  // Outer Dark Slate Architectural Walls
  drawPixelBox(ctx, bLeft, bTop, bWidth, bHeight, '#0f172a', '#090b0e', '#334155');

  // Warm Monochrome Checkerboard / Hardwood Interior Flooring
  const floorLeft = bLeft + 8;
  const floorTop = bTop + 26;
  const floorW = bWidth - 16;
  const floorH = bHeight - 36;
  ctx.fillStyle = '#1e2430';
  ctx.fillRect(floorLeft, floorTop, floorW, floorH);

  const tileW = 24;
  const tileH = 22;
  for (let r = 0; r < Math.floor(floorH / tileH); r++) {
    for (let c = 0; c < Math.floor(floorW / tileW); c++) {
      const isAlt = (r + c) % 2 === 0;
      ctx.fillStyle = isAlt ? '#262d3d' : '#1b202c';
      ctx.fillRect(floorLeft + c * tileW, floorTop + r * tileH, tileW, tileH);
      // Subtle wood-plank / tile sheen line
      ctx.fillStyle = '#333d52';
      ctx.fillRect(floorLeft + c * tileW + 2, floorTop + r * tileH + 2, tileW - 4, 2);
    }
  }

  // Rear Interior Wall Backrest + Overhead Cafe Menu Boards
  drawPixelBox(ctx, bLeft + 8, bTop + 6, bWidth - 16, 22, '#090b0e', '#475569');
  // Menu Board 1: Coffee & Espresso
  drawPixelBox(ctx, bLeft + 22, bTop + 8, 190, 16, '#1e293b', '#f8fafc');
  ctx.font = 'bold 6px "Press Start 2P", monospace';
  ctx.textAlign = 'left';
  ctx.fillStyle = '#facc15';
  ctx.fillText('★ COLD BREW $14 · MOCHA $18', bLeft + 30, bTop + 19);

  // Menu Board 2: Latte & Tea
  drawPixelBox(ctx, bLeft + 260, bTop + 8, 198, 16, '#1e293b', '#f8fafc');
  ctx.fillStyle = '#86efac';
  ctx.fillText('★ DAISY LATTE $16 · TEA $15', bLeft + 268, bTop + 19);

  // Cozy Monochrome Woven Cafe Rug on the indoor floor (where cats love to groom/nap!)
  drawPixelBox(ctx, 514, 196, 88, 52, '#334155', '#090b0e', '#64748b');
  drawPixelBox(ctx, 522, 204, 72, 36, '#1e293b', '#cbd5e1');

  // South-Facing Cafe Wall with Garden-View Windows & Open Front Doorway
  const wallY = bTop + bHeight - 14;
  // Left wall segment + window
  drawPixelBox(ctx, bLeft, wallY, 184, 14, '#0f172a', '#090b0e', '#475569');
  drawPixelBox(ctx, bLeft + 28, wallY + 2, 126, 8, '#38bdf8', '#090b0e', '#bae6fd');

  // Right wall segment + window
  drawPixelBox(ctx, bLeft + 300, wallY, 184, 14, '#0f172a', '#090b0e', '#475569');
  drawPixelBox(ctx, bLeft + 326, wallY + 2, 126, 8, '#38bdf8', '#090b0e', '#bae6fd');

  // Front Doorway Threshold & "KLASIK" Welcome Mat (x: 336..448)
  drawPixelBox(ctx, 344, wallY - 4, 96, 22, '#18181b', '#f8fafc', '#334155');
  drawPixelBox(ctx, 352, wallY, 80, 14, '#090b0e', '#facc15');
  ctx.font = 'bold 7px "Press Start 2P", monospace';
  ctx.textAlign = 'center';
  ctx.fillStyle = '#f8fafc';
  ctx.fillText('KLASIK', 392, wallY + 10);
}

/**
 * ============================================================================
 * ARCHITECTURAL ZONE 2: INDOOR GARAGE BAY (RIGHT WING) & 1990 MAZDA MIATA MX-5
 * Separated by an interior steel/glass partition wall from the coffee shop!
 * ============================================================================
 */
function drawMiataGarageBay(
  ctx: CanvasRenderingContext2D,
  state: CafeState,
  time: number,
  hoveredMiata: boolean
) {
  const bayLeft = 636;
  const bayTop = 76;
  const bayW = 228;
  const bayH = 292;

  // Exterior shadow
  ctx.fillStyle = 'rgba(0, 0, 0, 0.38)';
  ctx.fillRect(bayLeft, bayTop + 10, bayW + 8, bayH + 8);

  // 1. Sleek Monochrome Indoor Garage Enclosure
  drawPixelBox(ctx, bayLeft, bayTop, bayW, bayH, '#18181b', '#090b0e', '#3f3f46');

  // Interior Steel & Glass Partition Wall along x = 636 (with open arch at y = 200..254 for Lilo!)
  drawPixelBox(ctx, bayLeft - 4, bayTop, 10, 122, '#0f172a', '#090b0e', '#64748b');
  drawPixelBox(ctx, bayLeft - 2, bayTop + 26, 6, 80, '#38bdf8', '#090b0e'); // Glass window pane between cafe & garage!
  drawPixelBox(ctx, bayLeft - 4, bayTop + 180, 10, 40, '#0f172a', '#090b0e', '#64748b');

  // 2. High-Contrast Black & White Checkered Showroom Floor Tiles
  const tile = 24;
  for (let r = 0; r < 10; r++) {
    for (let c = 0; c < 8; c++) {
      const isWhite = (r + c) % 2 === 0;
      ctx.fillStyle = isWhite ? '#e2e8f0' : '#1e232d';
      ctx.fillRect(bayLeft + 18 + c * tile, bayTop + 36 + r * tile, tile, tile);
    }
  }

  // Garage Tool Cabinet, Red/Slate Mechanics Chest & JDM Banner along top wall
  drawPixelBox(ctx, bayLeft + 18, bayTop + 8, 84, 24, '#dc2626', '#090b0e', '#f87171');
  ctx.fillStyle = '#f8fafc';
  ctx.fillRect(bayLeft + 24, bayTop + 16, 72, 2);
  ctx.fillRect(bayLeft + 24, bayTop + 22, 72, 2);

  drawPixelBox(ctx, bayLeft + 114, bayTop + 8, 96, 22, '#0f172a', '#f8fafc');
  ctx.font = 'bold 6px "Press Start 2P", monospace';
  ctx.textAlign = 'center';
  ctx.fillStyle = '#facc15';
  ctx.fillText('1990 MX-5 NA', bayLeft + 162, bayTop + 22);

  // 3. 1990 Mazda Miata MX-5 (NA) Top-Down 3/4 Pixel Art Sprite
  const mx = px(MIATA_GARAGE_BOUNDS.x);
  const my = px(MIATA_GARAGE_BOUNDS.y);
  const carW = 88;
  const carH = 152;
  const cLeft = mx - carW / 2;
  const cTop = my - carH / 2;

  // Drop shadow under car
  ctx.fillStyle = 'rgba(0, 0, 0, 0.48)';
  ctx.fillRect(cLeft - 6, cTop + 8, carW + 12, carH);

  // 4 Wide Performance Tires
  ctx.fillStyle = '#090b0e';
  ctx.fillRect(cLeft - 6, cTop + 20, 8, 28);
  ctx.fillRect(cLeft + carW - 2, cTop + 20, 8, 28);
  ctx.fillRect(cLeft - 6, cTop + carH - 46, 8, 28);
  ctx.fillRect(cLeft + carW - 2, cTop + carH - 46, 8, 28);

  // Main Rounded Curvy NA Miata Chassis (Crystal White / Silver-Slate Two-Tone)
  const outlineCol = hoveredMiata ? '#facc15' : '#090b0e';
  drawPixelBox(ctx, cLeft + 4, cTop, carW - 8, carH, '#f8fafc', outlineCol, '#ffffff');
  drawPixelBox(ctx, cLeft, cTop + 10, carW, carH - 20, '#f8fafc', outlineCol);

  // Inner Body Shading & Side Character Lines
  ctx.fillStyle = '#cbd5e1';
  ctx.fillRect(cLeft + 4, cTop + 14, 6, carH - 28);
  ctx.fillRect(cLeft + carW - 10, cTop + 14, 6, carH - 28);

  // Hood Panel Seam Lines (Front faces DOWN toward garage driveway!)
  ctx.strokeStyle = '#94a3b8';
  ctx.lineWidth = 2;
  ctx.strokeRect(cLeft + 14, cTop + 78, carW - 28, 54);

  // Convertible Open Cockpit / Black Leather Bucket Seats & Dash
  drawPixelBox(ctx, cLeft + 12, cTop + 32, carW - 24, 48, '#0f172a', '#090b0e');
  // Curved Windshield Frame
  drawPixelBox(ctx, cLeft + 10, cTop + 68, carW - 20, 14, '#38bdf8', '#090b0e', '#bae6fd');
  // Driver & Passenger Headrests + Nardi Steering Wheel
  drawPixelBox(ctx, cLeft + 18, cTop + 38, 20, 18, '#1e293b', '#090b0e', '#334155');
  drawPixelBox(ctx, cLeft + carW - 38, cTop + 38, 20, 18, '#1e293b', '#090b0e', '#334155');
  ctx.fillStyle = '#f8fafc';
  ctx.fillRect(cLeft + 22, cTop + 60, 12, 4);

  // Side Mirrors
  drawPixelBox(ctx, cLeft - 8, cTop + 72, 8, 6, '#f8fafc', '#090b0e');
  drawPixelBox(ctx, cLeft + carW, cTop + 72, 8, 6, '#f8fafc', '#090b0e');

  // Iconic NA Rear Taillights
  ctx.fillStyle = '#ef4444';
  ctx.fillRect(cLeft + 10, cTop + 2, 18, 6);
  ctx.fillRect(cLeft + carW - 28, cTop + 2, 18, 6);

  // Front Bumper Smile Grille
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

    const pulseAlpha = 0.24 + Math.sin(time * 6) * 0.04;
    ctx.fillStyle = `rgba(254, 240, 138, ${pulseAlpha})`;
    ctx.beginPath();
    ctx.moveTo(leftHlX, hlY + 12);
    ctx.lineTo(leftHlX + 18, hlY + 12);
    ctx.lineTo(leftHlX + 34, hlY + 95);
    ctx.lineTo(leftHlX - 22, hlY + 95);
    ctx.closePath();
    ctx.fill();

    ctx.beginPath();
    ctx.moveTo(rightHlX, hlY + 12);
    ctx.lineTo(rightHlX + 18, hlY + 12);
    ctx.lineTo(rightHlX + 40, hlY + 95);
    ctx.lineTo(rightHlX - 16, hlY + 95);
    ctx.closePath();
    ctx.fill();
  } else {
    ctx.strokeStyle = '#64748b';
    ctx.lineWidth = 2;
    ctx.strokeRect(leftHlX, hlY, 18, 12);
    ctx.strokeRect(rightHlX, hlY, 18, 12);
  }

  // Interactive Badge under Garage Bay
  drawPixelBox(ctx, mx - 88, bayTop + bayH - 22, 176, 18, '#090b0e', '#f8fafc');
  ctx.font = 'bold 8px "Press Start 2P", monospace';
  ctx.textAlign = 'center';
  ctx.fillStyle = state.miataHeadlightsOn ? '#facc15' : '#cbd5e1';
  ctx.fillText(
    state.miataHeadlightsOn ? '90 MIATA [H] LIGHTS:ON' : '90 MIATA [H] LIGHTS:OFF',
    mx,
    bayTop + bayH - 10
  );
}

/**
 * Draws the 3D Monochrome Cafe Counter, 16x16 Pixel-Art Appliances,
 * Bouncing `▼ NEXT` Target Indicator, and Crisp On-Appliance Progress Bars
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

  // Monochrome Stainless / Slate Counter Station Pad
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
  } else if (id === 'watering_can') {
    const held = state.prep.holdingWateringCan;
    drawPixelBox(
      ctx,
      cx - 14,
      cy - 8,
      28,
      20,
      held ? '#334155' : '#0284c7',
      '#090b0e',
      held ? '#64748b' : '#38bdf8'
    );
    if (!held) {
      ctx.fillStyle = '#38bdf8';
      ctx.fillRect(cx + 14, cy - 6, 8, 4);
      ctx.fillStyle = '#facc15';
      ctx.fillRect(cx + 20, cy - 10, 4, 8);
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

    // Animated rising pixel steam bubbles
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
 * Draws the Chibi RPG Barista using `drawSpriteMatrix`
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

/**
 * Draws Multi-State Roaming Cat Companions:
 * - Lilo (White Coat, Bright Blue Eyes, Blue Collar)
 * - Champy (Black Coat, Bright Green Eyes, Bluish-Green Collar)
 * Supports: walking (swishing tail), sitting_grooming (paw lick), pouncing (hop arc),
 * napping ("Zzz"), and purring ("♥" + "♪").
 */
function drawCatCompanion(ctx: CanvasRenderingContext2D, cat: CatCompanion, time: number) {
  const cx = px(cat.x);
  const hopY =
    cat.state === 'pouncing' ? -Math.abs(Math.round(Math.sin(cat.hopPhase * 8) * 10)) : 0;
  const cy = px(cat.y + hopY);
  const isWhite = cat.coatColor === 'white';
  const frame = Math.floor(time * 4.5 + cat.tailPhase) % 2;

  // Shadow stays on ground level
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

  // Name tag & behavior badge
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

/**
 * Draws Chibi RPG Customer + Pokémon GBA Stepped Dialogue Bubble with Bouncing Arrow
 */
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

  // Customer Name Tag
  drawPixelBox(ctx, cx - 26, cy + 18, 52, 12, '#090b0e', '#94a3b8');
  ctx.font = 'bold 7px "Press Start 2P", monospace';
  ctx.textAlign = 'center';
  ctx.fillStyle = '#f8fafc';
  ctx.fillText(cust.name.toUpperCase(), cx, cy + 27);

  // Classic Pokémon GBA Stepped Dialogue Box positioned cleanly to the right
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

    // Drink Mini Icon
    drawPixelBox(ctx, bx + 10, by + 12, 20, 22, recipe.color, '#090b0e', recipe.accentColor);

    // Order Text
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

    // Classic Pokémon Bouncing Red/Gold Pixel Arrow on bottom-right of dialogue box
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
 * Draws Outdoor Garden Patio Umbrella Cafe Tables
 */
function drawOutdoorGardenTables(ctx: CanvasRenderingContext2D, time: number) {
  GARDEN_TABLES.forEach((t) => {
    ctx.fillStyle = 'rgba(0, 0, 0, 0.35)';
    ctx.fillRect(t.x - 36, t.y + 8, 72, 16);
    // Cafe Stools
    drawPixelBox(ctx, t.x - 40, t.y - 8, 16, 16, '#334155', '#090b0e', '#64748b');
    drawPixelBox(ctx, t.x + 24, t.y - 8, 16, 16, '#334155', '#090b0e', '#64748b');
    // Monochrome Bistro Table Top
    drawPixelBox(ctx, t.x - 24, t.y - 18, 48, 28, '#f8fafc', '#090b0e', '#ffffff');
    // Striped Patio Umbrella Pole & Canopy Hint + Daisy Vase
    drawSingleDaisy(ctx, t.x, t.y - 10, Math.sin(time * 2) * 1, true);
  });
}

/**
 * ============================================================================
 * MAIN GBA WORLD RENDERER ("KLASIK - GARDEN GARAGE CAFE ★")
 * ============================================================================
 */
export function renderCafeWorld(
  ctx: CanvasRenderingContext2D,
  state: CafeState,
  particles: ParticlePool,
  time: number,
  hoveredStationId: string | null,
  hoveredDaisyId: string | null,
  hoveredMiata = false,
  camera: CameraTransform = { zoom: 1, focusX: WORLD_WIDTH / 2, focusY: WORLD_HEIGHT / 2 }
) {
  ctx.save();
  ctx.imageSmoothingEnabled = false;

  // Clear outer backdrop
  ctx.fillStyle = '#0b0d12';
  ctx.fillRect(0, 0, WORLD_WIDTH, WORLD_HEIGHT);

  // Apply smooth camera transform (ALL / INDOOR / OUTDOOR)
  ctx.translate(WORLD_WIDTH / 2, WORLD_HEIGHT / 2);
  ctx.scale(camera.zoom, camera.zoom);
  ctx.translate(-camera.focusX, -camera.focusY);

  // 1. ARCHITECTURAL ZONE 3: OUTDOOR DAISY GARDEN PATIO (Left & Bottom Yard)
  const tileSize = 32;
  for (let row = 0; row < Math.ceil(WORLD_HEIGHT / tileSize); row++) {
    for (let col = 0; col < Math.ceil(WORLD_WIDTH / tileSize); col++) {
      const isAlt = (row + col) % 2 === 0;
      ctx.fillStyle = isAlt ? '#4ade80' : '#22c55e';
      ctx.fillRect(col * tileSize, row * tileSize, tileSize, tileSize);

      if ((row * 7 + col * 11) % 4 === 0) {
        const sway = Math.round(Math.sin(time * 2.5 + col) * 2);
        ctx.fillStyle = '#15803d';
        ctx.fillRect(col * tileSize + 10 + sway, row * tileSize + 12, 4, 8);
        ctx.fillRect(col * tileSize + 16 + sway, row * tileSize + 14, 4, 6);
      }
    }
  }

  // Wrought-Iron & Slate Perimeter Garden Fencing
  ctx.fillStyle = '#090b0e';
  ctx.fillRect(20, 20, WORLD_WIDTH - 40, 8);
  for (let fx = 28; fx < WORLD_WIDTH - 28; fx += 28) {
    drawPixelBox(ctx, fx, 10, 10, 22, '#334155', '#090b0e', '#94a3b8');
  }

  // Stone Stepping Walkway from Garden Gate up to the Indoor Cafe Welcome Mat
  const stones = [
    { x: 392, y: 456, w: 96, h: 22 },
    { x: 392, y: 422, w: 100, h: 22 },
    { x: 392, y: 388, w: 106, h: 22 },
    { x: 392, y: 352, w: 114, h: 24 },
    { x: 392, y: 318, w: 122, h: 24 },
  ];
  stones.forEach((s) => {
    drawPixelBox(ctx, s.x - s.w / 2, s.y - s.h / 2, s.w, s.h, '#cbd5e1', '#090b0e', '#f8fafc');
  });

  // 2. ARCHITECTURAL ZONE 1: INDOOR MONOCHROME COFFEE SHOP (Center-Top Building)
  drawIndoorCoffeeShopBuilding(ctx);

  // 3. ARCHITECTURAL ZONE 2: INDOOR GARAGE BAY (Right Wing) & 1990 MAZDA MIATA MX-5
  drawMiataGarageBay(ctx, state, time, hoveredMiata);

  // 4. Prominent Unobstructed Monochrome Striped Roof Awning & Signboard
  //    "KLASIK - GARDEN GARAGE CAFE ★"
  const awningLeft = 152;
  const awningTop = 36;
  const awningWidth = 712;
  const stripeCount = 16;
  const stripeW = awningWidth / stripeCount;
  for (let i = 0; i < stripeCount; i++) {
    drawPixelBox(
      ctx,
      awningLeft + i * stripeW,
      awningTop,
      stripeW,
      36,
      i % 2 === 0 ? '#111318' : '#f8fafc',
      '#090b0e'
    );
  }

  // Grand Signboard Plaque Centered Across Top Awning
  drawPixelBox(ctx, 228, 30, 556, 34, '#090b0e', '#f8fafc', '#334155');
  ctx.font = 'bold 13px "Press Start 2P", monospace';
  ctx.textAlign = 'center';
  ctx.fillStyle = '#facc15';
  ctx.fillText('KLASIK - GARDEN GARAGE CAFE ★', 506, 53);

  // 5. Outdoor Garden Cafe Tables & Blooming White/Gold Daisy Planter Beds
  drawOutdoorGardenTables(ctx, time);

  state.daisies.forEach((patch) => {
    drawDaisyBed(ctx, patch, time, hoveredDaisyId === patch.id);
  });

  // 6. 3D Front-Facing Monochrome Counter & Rear Appliance Bar inside the Cafe
  const recommendedStation =
    state.prep.processingStation === null ? getRecommendedStation(state) : null;

  // Rear Appliance Counter with 3D Front Panel
  drawPixelBox(ctx, 168, 114, 444, 48, '#0f172a', '#090b0e', '#334155');
  drawPixelBox(ctx, 168, 162, 444, 16, '#1e293b', '#090b0e');

  // Front Serving Bar with 3D Monochrome Ribbed Front Panel
  drawPixelBox(ctx, 180, 224, 300, 32, '#0f172a', '#090b0e', '#475569');
  drawPixelBox(ctx, 180, 256, 300, 18, '#334155', '#090b0e');
  ctx.fillStyle = '#090b0e';
  for (let rx = 192; rx < 472; rx += 16) {
    ctx.fillRect(rx, 258, 4, 14);
  }

  STATIONS.forEach((station) => {
    const isHovered = hoveredStationId === station.id;
    const isRecommendedNext = recommendedStation === station.id;
    drawStation(ctx, station, state, time, isHovered, isRecommendedNext);
  });

  // 7. Depth-Sorted Chibi Characters & Roaming Cats (Lilo & Champy)
  const actors: Array<{ y: number; draw: () => void }> = [
    {
      y: state.barista.y,
      draw: () => drawBarista(ctx, state, time),
    },
    ...state.cats.map((cat) => ({
      y: cat.y,
      draw: () => drawCatCompanion(ctx, cat, time),
    })),
    ...state.customers.map((c) => ({
      y: c.y,
      draw: () => drawCustomer(ctx, c, state, time),
    })),
  ];
  actors.sort((a, b) => a.y - b.y);
  actors.forEach((a) => a.draw());

  // 8. Pooled Particles (Hearts, Musical Notes, Water Droplets, Sparkles, Pollen)
  for (let i = 0; i < particles.items.length; i++) {
    const p = particles.items[i];
    if (!p.active) continue;
    const alpha = Math.max(0, Math.min(1, p.life / p.maxLife));
    ctx.globalAlpha = alpha;
    if (p.kind === 'heart') {
      drawPixelHeart(ctx, p.x, p.y, 2, p.color);
    } else if (p.kind === 'note') {
      ctx.font = 'bold 10px "Press Start 2P", monospace';
      ctx.fillStyle = p.color;
      ctx.fillText('♪', px(p.x), px(p.y));
    } else {
      ctx.fillStyle = p.color;
      ctx.fillRect(px(p.x), px(p.y), px(p.size), px(p.size));
    }
  }
  ctx.globalAlpha = 1;

  // 9. Floating World Text Popups (`+💧 COZY! +2c`, `♥ LILO ♪`, etc.)
  for (let i = 0; i < state.popups.length; i++) {
    const pop = state.popups[i];
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
