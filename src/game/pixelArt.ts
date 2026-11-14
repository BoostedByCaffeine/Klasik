import {
  CafeState,
  STATIONS,
  RECIPES,
  INDOOR_TABLES,
  GARAGE_TABLES,
  GARDEN_TABLES,
  MIATA_GARAGE_BOUNDS,
  TIP_JAR_BOUNDS,
  TOOL_CHEST_BOUNDS,
  INSIDE_DOOR_MAT,
  GARDEN_DOOR_MAT,
  GARDEN_ORDER_WINDOW,
  HAIR_COLORS,
  SKIN_TONES,
  BARISTA_OUTFITS,
  BaristaAppearance,
  DaisyPatch,
  CustomerEntity,
  CatCompanion,
  DatingCouple,
  StaffWorker,
  StationConfig,
  getFrontWaitingCustomer,
  getRecommendedStation,
  getCustomerSeatSlot,
  getPartySeatedPositions,
  getCustomerPatiencePct,
  clampCamera2D,
  Camera2D,
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
  const grad = ctx.createRadialGradient(cx, cy, radius * 0.08, cx, cy, radius);
  grad.addColorStop(0, `rgba(${colorRgb}, ${Math.min(1, alpha * 0.95)})`);
  grad.addColorStop(0.45, `rgba(${colorRgb}, ${Math.min(1, alpha * 0.45)})`);
  grad.addColorStop(1, `rgba(${colorRgb}, 0)`);
  ctx.fillStyle = grad;
  ctx.beginPath();
  ctx.arc(cx, cy, radius, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();
}

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

const CAT_STRETCH_MATRIX = [
  '.......OOOOOO...',
  '.OO...OBBBBBBOOO',
  'OBSO.OBBBBBBBBBO',
  'OBBBOOBBBBBBBBO.',
  'OBEBBO..OBBBBBO.',
  '.OCCCCO..OBBBBO.',
  'OBBBBBBO..OBBBO.',
  'OBB..BBO..OBBO..',
  'OOO..OOO..OOO...',
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

/**
 * High-legibility pixel text helper (`drawCrispText`) that renders a 2px `#090b0e` dark outline
 * (`strokeText`) before `fillText` using `'Silkscreen'` so text never blurs into background tiles.
 */
export function drawCrispText(
  ctx: CanvasRenderingContext2D,
  text: string,
  x: number,
  y: number,
  size = 9,
  color = '#f8fafc',
  align: CanvasTextAlign = 'center',
  fontFamily = '"Silkscreen", "Press Start 2P", monospace'
) {
  const rx = Math.round(x);
  const ry = Math.round(y);
  ctx.save();
  ctx.font = `700 ${size}px ${fontFamily}`;
  ctx.textAlign = align;
  ctx.lineJoin = 'round';
  ctx.miterLimit = 2;
  ctx.lineWidth = 2.5;
  ctx.strokeStyle = '#090b0e';
  ctx.strokeText(text, rx, ry);
  ctx.fillStyle = color;
  ctx.fillText(text, rx, ry);
  ctx.restore();
}

/**
 * Hand-level prop helper: ALWAYS renders carried coffee cups or watering cans at
 * hand/apron level (`x + 11, y + 2`), NEVER floating above characters' heads!
 */
function drawHandLevelProp(
  ctx: CanvasRenderingContext2D,
  anchorX: number,
  anchorY: number,
  propType: 'cup' | 'water',
  cupColor = '#dc2626',
  accentColor = '#fef08a'
) {
  const hx = px(anchorX + 11);
  const hy = px(anchorY + 2);

  if (propType === 'water') {
    // Pixel Watering Can at hand level (x + 11, y + 2)
    drawPixelBox(ctx, hx - 5, hy - 5, 11, 9, '#0284c7', '#090b0e', '#38bdf8');
    ctx.fillStyle = '#38bdf8';
    ctx.fillRect(hx + 6, hy - 4, 4, 3); // spout
  } else {
    // Pixel Coffee Cup with Sleeve & Lid at hand level (x + 11, y + 2)
    drawPixelBox(ctx, hx - 4, hy - 6, 9, 11, cupColor, '#090b0e', accentColor);
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(hx - 5, hy - 7, 11, 2); // cup lid
  }
}

/**
 * Draws a live pixel sprite preview of the Barista for the [👤 CUSTOMIZE] modal
 */
export function drawBaristaPreview(
  ctx: CanvasRenderingContext2D,
  appearance: BaristaAppearance,
  time = 0
) {
  ctx.save();
  ctx.imageSmoothingEnabled = false;
  const w = ctx.canvas.width;
  const h = ctx.canvas.height;
  ctx.fillStyle = '#0f172a';
  ctx.fillRect(0, 0, w, h);

  // Subtle checkered preview floor
  for (let r = 0; r < 4; r++) {
    for (let c = 0; c < 4; c++) {
      ctx.fillStyle = (r + c) % 2 === 0 ? '#1e293b' : '#161e2e';
      ctx.fillRect(c * 24, r * 24, 24, 24);
    }
  }

  const hair = HAIR_COLORS[appearance.hairColorIndex] ?? HAIR_COLORS[0];
  const skin = SKIN_TONES[appearance.skinToneIndex] ?? SKIN_TONES[1];
  const outfit =
    BARISTA_OUTFITS.find((o) => o.id === appearance.outfitStyleId) ?? BARISTA_OUTFITS[1];

  const frame = Math.floor(time * 3) % 2;
  drawSpriteMatrix(
    ctx,
    frame === 0 ? CHIBI_CHAR_FRAME_0 : CHIBI_CHAR_FRAME_1,
    {
      O: '#090b0e',
      H: hair.main,
      h: hair.highlight,
      n: hair.shade,
      B: outfit.bandana,
      S: skin.hex,
      E: '#090b0e',
      C: '#fda4af',
      T: outfit.shirt,
      A: outfit.apron,
      W: outfit.trim,
      P: '#090b0e',
      F: '#f8fafc',
    },
    w / 2,
    h / 2 - 4,
    3,
    false
  );

  if (outfit.isVintage) {
    ctx.fillStyle = outfit.trim;
    ctx.fillRect(w / 2 - 7, h / 2 + 12, 14, 3);
    ctx.fillStyle = outfit.bandana;
    ctx.fillRect(w / 2 - 3, h / 2 + 5, 6, 4);
  }

  // Hand-level coffee cup prop preview
  drawHandLevelProp(ctx, w / 2 + 4, h / 2 - 2, 'cup', '#dc2626', '#fef08a');
  ctx.restore();
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
  ctx.fillRect(x - 4, y + 2, 8, 2);

  ctx.fillStyle = '#bae6fd';
  ctx.fillRect(x - 4, y - 4, 4, 4);
}

function drawSingleDaisy(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  swayOffset: number,
  inFullBloom: boolean
) {
  const fx = px(x + swayOffset);
  const fy = px(y);

  ctx.fillStyle = '#15803d';
  ctx.fillRect(fx - 2, fy + 2, 4, 8);
  ctx.fillStyle = '#22c55e';
  ctx.fillRect(fx - 6, fy + 4, 4, 4);
  ctx.fillRect(fx + 2, fy + 4, 4, 4);

  if (!inFullBloom) {
    ctx.fillStyle = '#090b0e';
    ctx.fillRect(fx - 6, fy - 6, 12, 12);
    ctx.fillStyle = '#f8fafc';
    ctx.fillRect(fx - 4, fy - 4, 8, 8);
    ctx.fillStyle = '#eab308';
    ctx.fillRect(fx - 2, fy - 2, 4, 4);
    return;
  }

  ctx.fillStyle = '#090b0e';
  ctx.fillRect(fx - 8, fy - 8, 16, 16);

  ctx.fillStyle = '#ffffff';
  ctx.fillRect(fx - 4, fy - 8, 8, 4);
  ctx.fillRect(fx - 4, fy + 4, 8, 4);
  ctx.fillRect(fx - 8, fy - 4, 4, 8);
  ctx.fillRect(fx + 4, fy - 4, 4, 8);
  ctx.fillRect(fx - 6, fy - 6, 12, 12);

  ctx.fillStyle = '#facc15';
  ctx.fillRect(fx - 2, fy - 2, 4, 4);
  ctx.fillStyle = '#ca8a04';
  ctx.fillRect(fx, fy, 2, 2);
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

  ctx.fillStyle = 'rgba(0, 0, 0, 0.35)';
  ctx.fillRect(left + 4, top + 6, w, h);

  drawPixelBox(
    ctx,
    left,
    top,
    w,
    h,
    '#78350f',
    hovered ? '#facc15' : '#090b0e',
    '#b45309'
  );
  // Wood-grain planter trim highlights
  ctx.fillStyle = '#92400e';
  ctx.fillRect(left + 6, top + 2, w - 12, 2);
  drawPixelBox(ctx, left + 8, top + 8, w - 16, h - 16, '#27170c', '#090b0e');

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
    drawSingleDaisy(ctx, patch.x + ox, patch.y + oy, localSway, patch.bloomStage === 3);
  });

  const barW = 76;
  const barX = px(patch.x - barW / 2);
  const barY = top + h - 8;
  drawPixelBox(ctx, barX, barY, barW, 5, '#090b0e', '#334155');
  const fillW = Math.round(
    (Math.max(0, Math.min(100, patch.hydration)) / 100) * barW
  );
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
 * Draws a lush 16-bit Potted Corner Plant (Terracotta Pot + Layered Monstera/Fern Leaves)
 */
function drawPottedCornerPlant(ctx: CanvasRenderingContext2D, x: number, y: number, time: number) {
  const pxX = px(x);
  const pxY = px(y);
  const sway = Math.round(Math.sin(time * 2.2 + x * 0.05) * 1.5);

  // Drop shadow
  ctx.fillStyle = 'rgba(0,0,0,0.35)';
  ctx.fillRect(pxX - 14, pxY + 8, 28, 6);

  // Terracotta pot with rim highlight
  drawPixelBox(ctx, pxX - 10, pxY - 2, 20, 14, '#c2410c', '#090b0e', '#ea580c');
  drawPixelBox(ctx, pxX - 12, pxY - 6, 24, 5, '#ea580c', '#090b0e', '#fb923c');

  // Layered lush pixel foliage
  drawPixelBox(ctx, pxX - 14 + sway, pxY - 20, 12, 12, '#15803d', '#090b0e', '#22c55e');
  drawPixelBox(ctx, pxX + 2 + sway, pxY - 22, 12, 12, '#166534', '#090b0e', '#4ade80');
  drawPixelBox(ctx, pxX - 6 - sway, pxY - 28, 14, 14, '#22c55e', '#090b0e', '#86efac');
}

function drawStation(
  ctx: CanvasRenderingContext2D,
  station: StationConfig,
  state: CafeState,
  time: number,
  hovered: boolean,
  isRecommendedNext: boolean
) {
  const { id, x, y, width, height, shortLabel, hotkey } = station;
  const left = px(x - width / 2);
  const top = px(y - height / 2);
  const isBusy = state.prep.processingStation === id && state.prep.processTimer > 0;

  const isUpgradable =
    id === 'grinder' ||
    id === 'espresso' ||
    id === 'milk_frother' ||
    id === 'kettle' ||
    id === 'tea_leaves';
  const tier = isUpgradable ? state.stationLevels[id] ?? 1 : 1;

  if (isRecommendedNext && !isBusy) {
    const pulse = Math.floor(time * 5) % 2 === 0;
    ctx.strokeStyle = pulse ? '#facc15' : '#fef08a';
    ctx.lineWidth = 3;
    ctx.strokeRect(left - 4, top - 4, width + 8, height + 8);
  }

  // Housing palette evolves by Station Tier (Lvl 1 Matte Grey -> Lvl 2 Stainless/Copper -> Lvl 3 Obsidian/Gold)
  const housingFill = isBusy
    ? '#14532d'
    : tier === 3
      ? '#090b0e'
      : tier === 2
        ? '#334155'
        : '#1e2430';
  const housingOutline =
    hovered || isRecommendedNext
      ? '#facc15'
      : tier === 3
        ? '#eab308'
        : tier === 2
          ? '#d97706'
          : '#090b0e';
  const housingHighlight = isBusy
    ? '#4ade80'
    : tier === 3
      ? '#facc15'
      : tier === 2
        ? '#cbd5e1'
        : '#475569';

  drawPixelBox(ctx, left, top, width, height, housingFill, housingOutline, housingHighlight);

  const cx = px(x);
  const cy = px(y - 2);

  // Sprite palette evolves by Station Tier
  const appliancePal =
    tier === 3
      ? {
          O: '#090b0e',
          C: '#facc15', // Gold trim
          S: '#18181b', // Sleek obsidian body
          W: '#fef08a', // Bright gold accent
          B: '#b45309',
          M: '#22c55e',
          G: '#4ade80',
        }
      : tier === 2
        ? {
            O: '#090b0e',
            C: '#d97706', // Copper accent
            S: '#e2e8f0', // Brushed stainless steel
            W: '#38bdf8',
            B: '#78350f',
            M: '#f59e0b',
            G: '#22c55e',
          }
        : {
            O: '#090b0e',
            C: '#94a3b8', // Worn matte iron
            S: '#64748b', // Dull slate
            W: '#cbd5e1',
            B: '#451a03',
            M: '#ef4444',
            G: '#15803d',
          };

  if (id === 'grinder') {
    drawSpriteMatrix(ctx, APPLIANCE_GRINDER_MATRIX, appliancePal, cx, cy, 2);
  } else if (id === 'espresso') {
    drawSpriteMatrix(ctx, APPLIANCE_ESPRESSO_MATRIX, appliancePal, cx, cy, 2);
    // Analog Espresso Pressure Gauges
    drawPixelBox(ctx, cx - 12, cy - 8, 8, 8, '#f8fafc', '#090b0e');
    drawPixelBox(ctx, cx + 4, cy - 8, 8, 8, '#f8fafc', '#090b0e');
    ctx.fillStyle = tier >= 2 || state.finance.upgrades.dual_boiler ? '#22c55e' : '#ef4444';
    ctx.fillRect(cx - 9, cy - 6, 3, 4);
    ctx.fillRect(cx + 7, cy - 6, 3, 4);
  } else if (id === 'milk_frother') {
    drawSpriteMatrix(ctx, APPLIANCE_FROTHER_MATRIX, appliancePal, cx, cy, 2);
  } else if (id === 'kettle') {
    drawSpriteMatrix(ctx, APPLIANCE_KETTLE_MATRIX, appliancePal, cx, cy, 2);
  } else if (id === 'tea_leaves') {
    drawSpriteMatrix(ctx, APPLIANCE_TEA_MATRIX, appliancePal, cx, cy, 2);
  } else if (id === 'cup_counter') {
    drawPixelBox(ctx, cx - 34, cy - 10, 68, 22, '#f8fafc', '#090b0e', '#ffffff');
    if (state.prep.activeDrink && state.prep.currentStepIndex >= 1) {
      const recipe = RECIPES[state.prep.activeDrink];
      const ready = state.prep.currentStepIndex === 3;
      drawPixelBox(
        ctx,
        cx - 10,
        cy - 14,
        20,
        22,
        recipe.color,
        ready ? '#facc15' : '#090b0e',
        recipe.accentColor
      );
      if (ready) {
        const bob = Math.sin(time * 7) * 3;
        drawPixelBox(ctx, cx - 52, top - 24 + bob, 104, 15, '#14532d', '#f8fafc');
        ctx.font = 'bold 7px "Press Start 2P", monospace';
        ctx.textAlign = 'center';
        ctx.fillStyle = '#fef08a';
        ctx.fillText('★ SERVE [ENTER]', cx, top - 13 + bob);
      }
    } else {
      drawPixelBox(ctx, cx - 8, cy - 8, 16, 14, '#ffffff', '#090b0e');
    }
  } else if (id === 'trash') {
    drawPixelBox(ctx, cx - 12, cy - 10, 24, 22, '#334155', '#090b0e', '#64748b');
  }

  // Tier 2 Status LED & Copper Trim / Tier 3 Dual Gold Gauges & Steam Vents
  if (isUpgradable && tier >= 2) {
    // Active status LED on top-right of station housing
    ctx.fillStyle = tier === 3 ? '#facc15' : '#4ade80';
    ctx.fillRect(left + width - 8, top + 4, 4, 4);
  }
  if (isUpgradable && tier === 3) {
    // Dual glowing gold gauges + steam vents
    ctx.fillStyle = '#fef08a';
    ctx.fillRect(left + 4, top + 4, 5, 5);
    ctx.fillRect(left + 11, top + 4, 5, 5);
    const ventAlpha = 0.5 + 0.5 * Math.sin(time * 6 + x);
    ctx.fillStyle = `rgba(254, 240, 138, ${ventAlpha.toFixed(2)})`;
    ctx.fillRect(cx - 10, top - 4, 4, 3);
    ctx.fillRect(cx + 6, top - 4, 4, 3);
  }

  if (isBusy && state.prep.processDuration > 0) {
    const pct = Math.max(0, Math.min(1, 1 - state.prep.processTimer / state.prep.processDuration));
    const bw = width - 4;
    const bx = left + 2;
    const by = top - 14;
    drawPixelBox(ctx, bx, by, bw, 7, '#090b0e', '#f8fafc');
    ctx.fillStyle = '#86efac';
    ctx.fillRect(bx + 2, by + 2, Math.round((bw - 4) * pct), 3);

    const bubbleY = by - 8 - ((time * 28) % 12);
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(cx - 8, px(bubbleY), 4, 4);
    ctx.fillRect(cx + 6, px(bubbleY + 4), 4, 4);
  } else if (isRecommendedNext && !(id === 'cup_counter' && state.prep.currentStepIndex === 3)) {
    const bob = Math.sin(time * 7) * 3;
    drawPixelBox(ctx, cx - 26, top - 20 + bob, 52, 13, '#facc15', '#090b0e');
    ctx.font = 'bold 6px "Press Start 2P", monospace';
    ctx.textAlign = 'center';
    ctx.fillStyle = '#090b0e';
    ctx.fillText('▼ NEXT', cx, top - 11 + bob);
  }

  const compactBadgeMap: Record<string, string> = {
    grinder: '1:GRIND',
    espresso: '2:SHOT',
    milk_frother: '3:FOAM',
    kettle: '4:BOIL',
    tea_leaves: '5:TEA',
    trash: 'X:CLEAR',
    cup_counter: 'SPC:POUR',
    watering_can: 'W:WATER',
  };
  const baseTag = compactBadgeMap[id] ?? `${hotkey}:${shortLabel.toUpperCase()}`;
  const labelSuffix = isUpgradable ? ` L${tier}` : '';
  const badgeW = id === 'trash' ? 54 : 66;
  drawPixelBox(
    ctx,
    cx - badgeW / 2,
    top + height - 4,
    badgeW,
    13,
    '#090b0e',
    isRecommendedNext ? '#facc15' : tier === 3 ? '#eab308' : tier === 2 ? '#d97706' : '#475569'
  );
  drawCrispText(
    ctx,
    `${baseTag}${labelSuffix}`,
    cx,
    top + height + 6,
    8,
    isRecommendedNext ? '#facc15' : tier === 3 ? '#fef08a' : '#f8fafc',
    'center'
  );
}

/**
 * Draws the Customizable Chibi RPG Barista with Hand-Level Prop Rendering (`x + 10, y + 3`)
 * and Custom Pixel Nametag
 */
function drawBarista(ctx: CanvasRenderingContext2D, state: CafeState, time: number) {
  const b = state.barista;
  const cx = px(b.x);
  const cy = px(b.y);
  const isMoving = Math.hypot(b.targetX - b.x, b.targetY - b.y) > 2;
  const frameIdx = isMoving ? Math.floor(b.walkDist / 12) % 2 : Math.floor(time * 2) % 2;

  const hair = HAIR_COLORS[state.appearance.hairColorIndex] ?? HAIR_COLORS[0];
  const skin = SKIN_TONES[state.appearance.skinToneIndex] ?? SKIN_TONES[1];
  const outfit =
    BARISTA_OUTFITS.find((o) => o.id === state.appearance.outfitStyleId) ?? BARISTA_OUTFITS[1];

  ctx.save();
  ctx.translate(cx, cy);
  ctx.scale(b.scaleX, b.scaleY);

  ctx.fillStyle = 'rgba(0, 0, 0, 0.42)';
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
      H: hair.main,
      h: hair.highlight,
      n: hair.shade,
      B: outfit.bandana,
      S: skin.hex,
      E: '#090b0e',
      C: '#fda4af',
      T: outfit.shirt,
      A: outfit.apron,
      W: outfit.trim,
      P: '#090b0e',
      F: '#f8fafc',
    },
    0,
    -2,
    2,
    b.facing === 'left'
  );

  if (outfit.isVintage) {
    ctx.fillStyle = outfit.trim;
    ctx.fillRect(-5, 8, 10, 2);
    ctx.fillStyle = outfit.bandana;
    ctx.fillRect(-2, 3, 4, 3);
  }

  // ★ HAND-LEVEL PROP RENDERING (`x + 10, y + 3` in local space: 10, 3) — NEVER ABOVE HEAD! ★
  if (state.prep.holdingWateringCan) {
    drawHandLevelProp(ctx, 0, 0, 'water');
  } else if (state.prep.currentStepIndex >= 1 && state.prep.activeDrink) {
    const drink = RECIPES[state.prep.activeDrink];
    drawHandLevelProp(ctx, 0, 0, 'cup', drink.color, drink.accentColor);
  }

  ctx.restore();

  // Custom Player Nametag below sprite
  const tagText = (state.appearance.name || 'KLASIK').toUpperCase();
  const tagW = Math.max(52, tagText.length * 6 + 12);
  drawPixelBox(ctx, cx - tagW / 2, cy + 18, tagW, 12, '#090b0e', '#facc15');
  drawCrispText(ctx, tagText, cx, cy + 27, 8, '#fde047', 'center');
}

/**
 * Draws Hired Cafe Workers (Momo Sous-Barista & Ken Floor/Garden Server) with Hand-Level Props
 */
function drawStaffWorker(
  ctx: CanvasRenderingContext2D,
  worker: StaffWorker,
  time: number
) {
  if (!worker.hired) return;
  const cx = px(worker.x);
  const cy = px(worker.y);
  const isMoving = Math.hypot(worker.targetX - worker.x, worker.targetY - worker.y) > 2;
  const frameIdx = isMoving ? Math.floor(worker.walkDist / 12) % 2 : Math.floor(time * 2.5) % 2;

  ctx.fillStyle = 'rgba(0, 0, 0, 0.38)';
  ctx.fillRect(cx - 14, cy + 14, 28, 6);

  const isMomo = worker.id === 'momo';
  drawSpriteMatrix(
    ctx,
    frameIdx === 0 ? CHIBI_CHAR_FRAME_0 : CHIBI_CHAR_FRAME_1,
    {
      O: '#090b0e',
      H: isMomo ? '#7c2d12' : '#0f172a',
      h: isMomo ? '#b45309' : '#334155',
      n: '#18181b',
      B: isMomo ? '#4ade80' : '#38bdf8',
      S: '#fde68a',
      E: '#090b0e',
      C: '#fb7185',
      T: '#1e293b',
      A: isMomo ? '#bbf7d0' : '#bae6fd',
      W: '#0f172a',
      P: '#090b0e',
      F: '#f8fafc',
    },
    cx,
    cy - 2,
    2
  );

  // ★ HAND-LEVEL PROP RENDERING (`cx + 10, cy + 3`) ★
  if (worker.carryingProp === 'water') {
    drawHandLevelProp(ctx, cx, cy, 'water');
  } else if (worker.carryingProp === 'cup') {
    drawHandLevelProp(ctx, cx, cy, 'cup', '#dc2626', '#fef08a');
  }

  drawPixelBox(ctx, cx - 26, cy + 18, 52, 11, '#090b0e', isMomo ? '#4ade80' : '#38bdf8');
  ctx.font = 'bold 6px "Press Start 2P", monospace';
  ctx.textAlign = 'center';
  ctx.fillStyle = isMomo ? '#86efac' : '#7dd3fc';
  ctx.fillText(`${worker.name.toUpperCase()} ★`, cx, cy + 26);
}

function drawCatCompanion(ctx: CanvasRenderingContext2D, cat: CatCompanion, time: number) {
  const cx = px(cat.x);
  const hopY =
    cat.state === 'yarn_play'
      ? -Math.abs(Math.round(Math.sin(time * 8 + cat.tailPhase) * 8))
      : 0;
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
  } else if (cat.state === 'stretching') {
    matrix = CAT_STRETCH_MATRIX;
  } else {
    matrix = frame === 0 ? CAT_WALK_FRAME_0 : CAT_WALK_FRAME_1;
  }

  drawSpriteMatrix(ctx, matrix, palette, cx, cy, 2, cat.facing === 'left');

  if (cat.state === 'yarn_play') {
    const yarnBounce = Math.round(Math.abs(Math.sin(time * 9)) * 6);
    const yarnX = cx + (cat.facing === 'left' ? -20 : 20);
    const yarnY = px(cat.y) + 2 - yarnBounce;
    drawPixelBox(ctx, yarnX - 6, yarnY - 6, 12, 12, '#f43f5e', '#090b0e', '#fda4af');
    ctx.fillStyle = '#facc15';
    ctx.fillRect(yarnX - 2, yarnY - 2, 4, 4);
  }

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
  } else if (cat.state === 'stretching') {
    ctx.font = 'bold 7px "Press Start 2P", monospace';
    ctx.fillStyle = '#fde047';
    ctx.fillText('stretch~', cx, cy - 16);
  } else if (cat.state === 'yarn_play') {
    ctx.font = 'bold 7px "Press Start 2P", monospace';
    ctx.fillStyle = '#fda4af';
    ctx.fillText('yarn! ♪', cx, cy - 16);
  }

  if (cat.heartTimer > 0 || cat.state === 'purring') {
    const hBob = Math.sin(time * 8) * 3;
    drawPixelHeart(ctx, cx - 6, cy - 22 + hBob, 2, '#f43f5e');
    ctx.font = 'bold 9px "Press Start 2P", monospace';
    ctx.fillStyle = '#facc15';
    ctx.fillText('♪', cx + 10, cy - 18 - hBob);
  }
}

function drawDatingCouple(
  ctx: CanvasRenderingContext2D,
  couple: DatingCouple
) {
  const tx = px(couple.tableX);
  const ty = px(couple.tableY);
  const outfits = [
    { H: '#7c2d12', h: '#9a3412', B: '#f43f5e', T: '#f8fafc', A: '#1e293b' },
    { H: '#0f172a', h: '#334155', B: '#38bdf8', T: '#e2e8f0', A: '#0284c7' },
    { H: '#713f12', h: '#a16207', B: '#a855f7', T: '#f8fafc', A: '#4c1d95' },
    { H: '#14532d', h: '#166534', B: '#facc15', T: '#f8fafc', A: '#065f46' },
  ];
  const palA = outfits[couple.variantA % outfits.length];
  const palB = outfits[couple.variantB % outfits.length];

  drawSpriteMatrix(
    ctx,
    CHIBI_CHAR_FRAME_0,
    {
      O: '#090b0e',
      H: palA.H,
      h: palA.h,
      n: palA.H,
      B: palA.B,
      S: '#ffedd5',
      E: '#090b0e',
      C: '#fb7185',
      T: palA.T,
      A: palA.A,
      W: '#f8fafc',
      P: '#1e293b',
      F: '#090b0e',
    },
    tx - 34,
    ty - 8,
    2,
    false
  );

  drawSpriteMatrix(
    ctx,
    CHIBI_CHAR_FRAME_0,
    {
      O: '#090b0e',
      H: palB.H,
      h: palB.h,
      n: palB.H,
      B: palB.B,
      S: '#ffedd5',
      E: '#090b0e',
      C: '#fb7185',
      T: palB.T,
      A: palB.A,
      W: '#f8fafc',
      P: '#1e293b',
      F: '#090b0e',
    },
    tx + 34,
    ty - 8,
    2,
    true
  );

  drawPixelBox(ctx, tx - 14, ty - 14, 8, 9, '#dc2626', '#090b0e', '#fef08a');
  drawPixelBox(ctx, tx + 6, ty - 14, 8, 9, '#10b981', '#090b0e', '#d1fae5');

  const heartBob = Math.sin(couple.heartPhase) * 4;
  drawPixelHeart(ctx, tx, ty - 34 + heartBob, 2, '#fb7185');

  drawPixelBox(ctx, tx - 56, ty + 14, 112, 14, '#f8fafc', '#090b0e');
  ctx.font = 'bold 6px "Press Start 2P", monospace';
  ctx.textAlign = 'center';
  ctx.fillStyle = '#be123c';
  ctx.fillText(couple.quote.toUpperCase(), tx, ty + 23);
}

function drawPhotoSquad(
  ctx: CanvasRenderingContext2D,
  state: CafeState
) {
  const squad = state.photoSquad;

  // If Miata Merch Stand upgrade is unlocked, draw the sleek Garage Merch Display Stand
  if (state.finance.upgrades.miata_merch_stand) {
    drawPixelBox(ctx, 686, 396, 42, 26, '#dc2626', '#facc15', '#f87171');
    ctx.font = 'bold 5px "Press Start 2P", monospace';
    ctx.textAlign = 'center';
    ctx.fillStyle = '#fef08a';
    ctx.fillText('MX-5 MERCH', 707, 412);
  }

  if (squad.flashAlpha > 0.02) {
    drawWarmLightPool(
      ctx,
      MIATA_GARAGE_BOUNDS.x,
      MIATA_GARAGE_BOUNDS.y + 42,
      125,
      squad.flashAlpha,
      '255, 255, 255'
    );
  }
}

/**
 * Draws an accompanying customer pet (`dog`, `cat`, or `rabbit`) with animated bounce & heart bubble
 */
function drawCustomerPet(
  ctx: CanvasRenderingContext2D,
  cust: CustomerEntity,
  time: number
) {
  const pet = cust.pet;
  if (!pet) return;
  const pxX = px(pet.x);
  const hop = Math.round(Math.abs(Math.sin(time * 6 + cust.x * 0.05)) * (pet.kind === 'rabbit' ? 4 : 2));
  const pxY = px(pet.y - hop);

  ctx.fillStyle = 'rgba(0, 0, 0, 0.32)';
  ctx.fillRect(pxX - 9, px(pet.y) + 6, 18, 4);

  if (pet.kind === 'dog') {
    // Shiba / Golden Puppy Sprite
    drawPixelBox(ctx, pxX - 8, pxY - 6, 16, 11, '#d97706', '#090b0e', '#fbbf24');
    drawPixelBox(ctx, pxX - 6, pxY - 11, 11, 8, '#f59e0b', '#090b0e', '#fde68a');
    ctx.fillStyle = '#090b0e';
    ctx.fillRect(pxX - 4, pxY - 8, 2, 2);
    ctx.fillRect(pxX + 1, pxY - 8, 2, 2);
    // Floppy ears + wagging tail
    ctx.fillStyle = '#92400e';
    ctx.fillRect(pxX - 8, pxY - 10, 3, 5);
    ctx.fillRect(pxX + 4, pxY - 10, 3, 5);
    ctx.fillStyle = '#fef3c7';
    ctx.fillRect(pxX + 7, pxY - 8, 4, 4);
  } else if (pet.kind === 'cat') {
    // Ginger / Calico Kitten Sprite
    drawPixelBox(ctx, pxX - 7, pxY - 5, 14, 10, '#fb923c', '#090b0e', '#fed7aa');
    drawPixelBox(ctx, pxX - 6, pxY - 10, 10, 7, '#f97316', '#090b0e', '#ffedd5');
    ctx.fillStyle = '#090b0e';
    ctx.fillRect(pxX - 4, pxY - 7, 2, 2);
    ctx.fillRect(pxX + 1, pxY - 7, 2, 2);
  } else {
    // Snowy White Bunny Sprite with tall ears
    drawPixelBox(ctx, pxX - 7, pxY - 5, 14, 10, '#f8fafc', '#090b0e', '#ffffff');
    drawPixelBox(ctx, pxX - 5, pxY - 14, 4, 9, '#f8fafc', '#090b0e');
    drawPixelBox(ctx, pxX + 1, pxY - 14, 4, 9, '#f8fafc', '#090b0e');
    ctx.fillStyle = '#fda4af';
    ctx.fillRect(pxX - 4, pxY - 12, 2, 5);
    ctx.fillRect(pxX + 2, pxY - 12, 2, 5);
    ctx.fillStyle = '#ef4444';
    ctx.fillRect(pxX - 3, pxY - 3, 2, 2);
  }

  // Pet name tag
  ctx.font = 'bold 5px "Press Start 2P", monospace';
  ctx.textAlign = 'center';
  ctx.fillStyle = '#fde047';
  ctx.fillText(pet.name.toUpperCase(), pxX, px(pet.y) + 14);

  if (pet.heartTimer > 0) {
    const hBob = Math.sin(time * 8) * 2;
    drawPixelHeart(ctx, pxX, pxY - 18 + hBob, 2, '#f43f5e');
  }
}

/**
 * Draws a served coffee cup with saucer directly on top of a table surface,
 * plus subtle rising pixel steam wisps for Cozy Aura feedback.
 */
function drawTabletopCupWithSaucer(
  ctx: CanvasRenderingContext2D,
  cupX: number,
  cupY: number,
  cupColor: string,
  accentColor: string,
  time: number,
  seed = 0
) {
  const x = px(cupX);
  const y = px(cupY);

  // Porcelain saucer on tabletop
  ctx.fillStyle = '#090b0e';
  ctx.fillRect(x - 6, y + 2, 12, 3);
  ctx.fillStyle = '#e2e8f0';
  ctx.fillRect(x - 5, y + 2, 10, 2);

  // Coffee cup with crema/accent rim
  drawPixelBox(ctx, x - 4, y - 6, 8, 9, cupColor, '#090b0e', accentColor);
  ctx.fillStyle = '#ffffff';
  ctx.fillRect(x - 3, y - 5, 6, 2);

  // Rising pixel steam wisps above cup
  const steamPhase = (time * 2.2 + seed) % 2.4;
  if (steamPhase < 1.8) {
    const lift = Math.round(steamPhase * 6);
    const sway = Math.round(Math.sin(time * 4 + seed) * 1.5);
    ctx.fillStyle = 'rgba(248, 250, 252, 0.78)';
    ctx.fillRect(x - 1 + sway, y - 9 - lift, 2, 3);
    ctx.fillRect(x + 1 - sway, y - 13 - lift, 2, 2);
  }
}

/**
 * Draws a single companion sprite (used by Y-sorted actor list)
 */
function drawCustomerCompanionActor(
  ctx: CanvasRenderingContext2D,
  cust: CustomerEntity,
  compIndex: number,
  compX: number,
  compY: number,
  compFacing: 'left' | 'right' | 'down' | 'up',
  isSeatedAtTable: boolean,
  time: number
) {
  const comp = cust.companions[compIndex];
  if (!comp) return;

  const outfits = [
    { H: '#7c2d12', h: '#9a3412', B: '#f43f5e', T: '#f8fafc', A: '#1e293b' },
    { H: '#0f172a', h: '#334155', B: '#38bdf8', T: '#e2e8f0', A: '#0284c7' },
    { H: '#713f12', h: '#a16207', B: '#a855f7', T: '#f8fafc', A: '#4c1d95' },
    { H: '#14532d', h: '#166534', B: '#facc15', T: '#f8fafc', A: '#065f46' },
  ];
  const compPal = outfits[comp.spriteVariant % outfits.length];
  const recipe = RECIPES[cust.order];
  const isMoving =
    !isSeatedAtTable &&
    (cust.state === 'walking_in' ||
      cust.state === 'walking_to_garden' ||
      cust.state === 'walking_out' ||
      Math.hypot(cust.targetX - cust.x, cust.targetY - cust.y) > 2);
  const frameIdx = isMoving ? Math.floor(cust.walkDist / 12) % 2 : 0;

  // Seated pose: slightly tucked into chair (y - 2)
  const renderX = px(compX);
  const renderY = px(isSeatedAtTable ? compY - 2 : compY);

  ctx.fillStyle = 'rgba(0, 0, 0, 0.34)';
  ctx.fillRect(renderX - 11, renderY + 12, 22, 5);

  if (comp.isChild) {
    // Compact Chibi Child Sprite ('Jr') for Family Parties on topChair
    drawPixelBox(ctx, renderX - 7, renderY - 4, 14, 14, compPal.A, '#090b0e', compPal.T);
    drawPixelBox(ctx, renderX - 8, renderY - 15, 16, 12, '#ffedd5', '#090b0e', compPal.H);
    ctx.fillStyle = compPal.H;
    ctx.fillRect(renderX - 8, renderY - 16, 16, 5);
    ctx.fillStyle = '#090b0e';
    ctx.fillRect(renderX - 4, renderY - 10, 2, 2);
    ctx.fillRect(renderX + 2, renderY - 10, 2, 2);
  } else {
    drawSpriteMatrix(
      ctx,
      frameIdx === 0 ? CHIBI_CHAR_FRAME_0 : CHIBI_CHAR_FRAME_1,
      {
        O: '#090b0e',
        H: compPal.H,
        h: compPal.h,
        n: compPal.H,
        B: compPal.B,
        S: '#ffedd5',
        E: '#090b0e',
        C: '#fb7185',
        T: compPal.T,
        A: compPal.A,
        W: '#f8fafc',
        P: '#1e293b',
        F: '#090b0e',
      },
      renderX,
      renderY - 2,
      2,
      compFacing === 'left'
    );
  }

  // Only carry cup in hand while walking; when seated at table, cups rest on the tabletop!
  if (!isSeatedAtTable && (cust.carryingCup || cust.state === 'walking_to_garden')) {
    drawHandLevelProp(ctx, renderX, renderY, 'cup', recipe.color, recipe.accentColor);
  }
}

/**
 * Draws the seated tabletop cups and Cozy Aura steam/hearts for an occupied table
 */
function drawOccupiedTableSurfaceAndAura(
  ctx: CanvasRenderingContext2D,
  cust: CustomerEntity,
  time: number
) {
  const seatedPos = getPartySeatedPositions(cust);
  if (!seatedPos) return;
  const recipe = RECIPES[cust.order];

  // Render served coffee cups/saucers directly on top of the table surface (table.x - 10, table.x + 10, table.y - 6)
  seatedPos.cupPositions.forEach((cup, idx) => {
    drawTabletopCupWithSaucer(
      ctx,
      cup.x,
      cup.y,
      recipe.color,
      recipe.accentColor,
      time,
      idx * 1.3 + (cust.seatIndex ?? 0)
    );
  });

  // Cozy Aura Feedback: rising pixel hearts & cozy rating shimmer above occupied table every few seconds
  const tx = px(seatedPos.tableX);
  const ty = px(seatedPos.tableY);
  const heartBob = Math.sin(time * 4.5 + tx * 0.1) * 3;
  drawPixelHeart(ctx, tx, ty - 34 + heartBob, 2, '#f43f5e');

  const auraCycle = (time + (cust.seatIndex ?? 0) * 1.7) % 4.0;
  if (auraCycle < 2.2) {
    const floatY = Math.round(auraCycle * 5);
    drawPixelHeart(ctx, tx - 14, ty - 28 - floatY, 1, '#fb7185');
    drawPixelHeart(ctx, tx + 14, ty - 30 - floatY, 1, '#fde047');
  }

  // Periodic cozy chat bubble centered above the occupied table
  if (Math.floor(time + (cust.seatIndex ?? 0) * 2) % 4 !== 0) {
    drawPixelBox(ctx, tx - 58, ty - 25, 116, 13, '#f8fafc', '#090b0e');
    ctx.font = 'bold 5px "Press Start 2P", monospace';
    ctx.textAlign = 'center';
    ctx.fillStyle = '#0f172a';
    ctx.fillText(cust.dialogueText.slice(0, 20).toUpperCase(), tx, ty - 16);
  }
}

function drawCustomerLeader(
  ctx: CanvasRenderingContext2D,
  cust: CustomerEntity,
  state: CafeState,
  isSeatedAtTable: boolean,
  time: number
) {
  const seatSlot = getCustomerSeatSlot(cust.seatIndex);
  const rawX = isSeatedAtTable && seatSlot ? seatSlot.leftChair.x : cust.x;
  const rawY = isSeatedAtTable && seatSlot ? seatSlot.leftChair.y - 2 : cust.y;
  const cx = px(rawX);
  const cy = px(rawY);
  const isMoving =
    !isSeatedAtTable &&
    (cust.state === 'walking_in' ||
      cust.state === 'walking_to_garden' ||
      cust.state === 'walking_out' ||
      Math.hypot(cust.targetX - cust.x, cust.targetY - cust.y) > 2);
  const frameIdx = isMoving ? Math.floor(cust.walkDist / 12) % 2 : 0;

  const outfits = [
    { H: '#7c2d12', h: '#9a3412', B: '#f43f5e', T: '#f8fafc', A: '#1e293b' },
    { H: '#0f172a', h: '#334155', B: '#38bdf8', T: '#e2e8f0', A: '#0284c7' },
    { H: '#713f12', h: '#a16207', B: '#a855f7', T: '#f8fafc', A: '#4c1d95' },
    { H: '#14532d', h: '#166534', B: '#facc15', T: '#f8fafc', A: '#065f46' },
  ];
  const pal = outfits[cust.spriteVariant % outfits.length];
  const recipe = RECIPES[cust.order];
  const facingLeft = isSeatedAtTable ? false : cust.facing === 'left';

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
    2,
    facingLeft
  );

  // Hand-level cup ONLY when walking; when seated at a table, drinks sit on top of the table surface!
  if (!isSeatedAtTable && (cust.carryingCup || cust.state === 'walking_to_garden')) {
    drawHandLevelProp(ctx, cx, cy, 'cup', recipe.color, recipe.accentColor);
  }

  const partyBadge =
    cust.partyKind === 'couple'
      ? ' ♥'
      : cust.partyKind === 'family'
        ? ' ★'
        : cust.partyKind === 'friends'
          ? ' ♪'
          : '';
  const fullTag = `${cust.name.toUpperCase()}${partyBadge}`;
  drawPixelBox(ctx, cx - 28, cy + 18, 56, 12, '#090b0e', '#94a3b8');
  drawCrispText(ctx, fullTag, cx, cy + 27, 8, '#f8fafc', 'center');

  if (cust.state === 'waiting') {
    const frontWaiting = getFrontWaitingCustomer(state);
    const isFrontCustomer = frontWaiting?.id === cust.id;
    const waitElapsed = Math.max(0, state.elapsedSeconds - cust.arrivalTime);
    const patiencePct = getCustomerPatiencePct(cust, state.elapsedSeconds);
    void waitElapsed;

    if (isFrontCustomer) {
      const drinkReady = state.prep.currentStepIndex === 3 && state.prep.activeDrink !== null;
      const bw = 186;
      const bh = 48;
      const bx = px(cx - bw - 22);
      const by = px(cy - 38);

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

      drawPixelBox(ctx, bx + 8, by + 11, 18, 22, recipe.color, '#090b0e', recipe.accentColor);

      ctx.textAlign = 'left';
      ctx.font = 'bold 7px "Press Start 2P", monospace';
      ctx.fillStyle = '#090b0e';
      ctx.fillText(recipe.shortName.toUpperCase(), bx + 32, by + 18);

      ctx.font = 'bold 14px "VT323", monospace';
      ctx.fillStyle = drinkReady ? '#047857' : '#334155';
      ctx.fillText(
        drinkReady
          ? '★ TAP OR [ENTER] TO SERVE!'
          : recipe.stepLabels[state.prep.currentStepIndex] ?? 'Tap to Brew!',
        bx + 32,
        by + 33
      );

      // Customer Queue Patience bar
      const pBarW = bw - 44;
      drawPixelBox(ctx, bx + 32, by + 38, pBarW, 4, '#090b0e', '#475569');
      ctx.fillStyle = patiencePct > 0.6 ? '#22c55e' : patiencePct > 0.35 ? '#facc15' : '#fb7185';
      ctx.fillRect(bx + 33, by + 39, Math.round((pBarW - 2) * patiencePct), 2);

      const arrowBob = Math.floor(time * 5) % 2 === 0 ? 0 : 3;
      const ax = bx + bw - 14;
      const ay = by + bh - 13 + arrowBob;
      ctx.fillStyle = '#ef4444';
      ctx.fillRect(ax, ay, 8, 2);
      ctx.fillRect(ax + 2, ay + 2, 4, 2);
      ctx.fillRect(ax + 3, ay + 4, 2, 2);
    } else {
      drawPixelBox(ctx, cx + 20, cy - 22, 114, 24, '#f8fafc', '#090b0e');
      ctx.font = 'bold 6px "Press Start 2P", monospace';
      ctx.textAlign = 'left';
      ctx.fillStyle = '#0f172a';
      ctx.fillText(`#2: ${recipe.shortName.toUpperCase()}`, cx + 26, cy - 9);
      ctx.fillStyle = '#22c55e';
      ctx.fillRect(cx + 26, cy - 4, Math.round(96 * patiencePct), 2);
    }
  } else if (cust.state === 'walking_to_garden') {
    drawPixelBox(ctx, cx - 56, cy - 34, 112, 14, '#14532d', '#facc15');
    ctx.font = 'bold 6px "Press Start 2P", monospace';
    ctx.textAlign = 'center';
    ctx.fillStyle = '#fef08a';
    ctx.fillText('TO GARDEN PATIO ▼', cx, cy - 24);
  } else if (cust.state === 'walking_out' && cust.isTakeout) {
    drawPixelBox(ctx, cx - 54, cy - 34, 108, 14, '#0284c7', '#facc15');
    ctx.font = 'bold 6px "Press Start 2P", monospace';
    ctx.textAlign = 'center';
    ctx.fillStyle = '#fef08a';
    ctx.fillText('TAKEOUT! ☔', cx, cy - 24);
  }

  // Render randomized dialogue bubble emote ('!', '?', '!!!', '♥', '♪', '★') above customer head
  if (cust.emoteText && (cust.emoteTimer ?? 0) > 0) {
    drawCustomerEmoteBubble(ctx, cx, cy - 38, cust.emoteText, time);
  }
}

export function drawCustomerEmoteBubble(
  ctx: CanvasRenderingContext2D,
  cx: number,
  cy: number,
  emoteText: string,
  time: number
) {
  const bob = Math.round(Math.sin(time * 9 + cx * 0.1) * 2);
  const x = px(cx);
  const y = px(cy + bob);
  const isUrgent = emoteText === '!!!' || emoteText === '!!';
  const isHappy = emoteText === '♥' || emoteText === '♪' || emoteText === '★';
  const bw = Math.max(24, emoteText.length * 8 + 14);
  const bh = 16;

  const borderColor = isUrgent ? '#ef4444' : isHappy ? '#22c55e' : '#facc15';
  const textColor = isUrgent ? '#dc2626' : isHappy ? '#15803d' : '#090b0e';

  drawPixelBox(ctx, x - bw / 2, y - bh / 2, bw, bh, '#ffffff', borderColor, '#f8fafc');
  // Speech pointer tail
  ctx.fillStyle = borderColor;
  ctx.fillRect(x - 3, y + bh / 2, 6, 4);
  ctx.fillStyle = '#ffffff';
  ctx.fillRect(x - 2, y + bh / 2 - 1, 4, 3);

  drawCrispText(ctx, emoteText, x, y + 4, 9, textColor, 'center');
}

/**
 * ============================================================================
 * MAP 1: FULL-SCREEN 900x480 "INSIDE VIEW"
 * Upgraded 16-Bit Tileset: Tile Grout Bevels, Wood-Grain Highlights, Brick Wall
 * Wainscoting, Espresso Pressure Gauges, Potted Corner Plants, & Garage Oil Drip Mats
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

  // 2. Left/Center: Cafe Flooring (Supports Purchasable Checkered Marble Floor Upgrade)
  const hasMarbleFloor = Boolean(state.decorEquipped?.checkered_marble_floor);
  const tile = 28;
  for (let r = 0; r < 14; r++) {
    for (let c = 0; c < 20; c++) {
      const tx = 26 + c * tile;
      const ty = 84 + r * tile;
      if (tx >= 584 || ty >= 456) continue;
      const isAlt = (r + c) % 2 === 0;
      if (hasMarbleFloor) {
        ctx.fillStyle = isAlt ? '#e2e8f0' : '#1e293b';
        ctx.fillRect(tx, ty, tile, tile);
        ctx.fillStyle = isAlt ? '#ffffff' : '#334155';
        ctx.fillRect(tx, ty, tile - 1, 2);
        ctx.fillRect(tx, ty, 2, tile - 1);
        if (isAlt && (r + c) % 4 === 0) {
          ctx.fillStyle = '#cbd5e1';
          ctx.fillRect(tx + 6, ty + 8, 12, 2);
          ctx.fillRect(tx + 10, ty + 10, 8, 2);
        }
      } else {
        ctx.fillStyle = isAlt ? '#262e3d' : '#1b2230';
        ctx.fillRect(tx, ty, tile, tile);
        ctx.fillStyle = isAlt ? '#333d52' : '#252f42';
        ctx.fillRect(tx, ty, tile - 1, 2);
        ctx.fillRect(tx, ty, 2, tile - 1);
        ctx.fillStyle = '#11151f';
        ctx.fillRect(tx, ty + tile - 2, tile, 2);
        ctx.fillRect(tx + tile - 2, ty, 2, tile);

        if (r >= 4 && (r + c) % 3 === 0) {
          ctx.fillStyle = '#3b475e';
          ctx.fillRect(tx + 4, ty + 12, tile - 8, 2);
        }
      }
    }
  }

  // 3. Top Interior Wall (x: 24..582, y: 20..84) + Brick Wall Wainscoting
  drawPixelBox(ctx, 24, 20, 558, 64, '#111622', '#090b0e', '#334155');
  for (let bx = 26; bx < 576; bx += 16) {
    ctx.fillStyle = '#334155';
    ctx.fillRect(bx, 74, 14, 4);
    ctx.fillStyle = '#1e293b';
    ctx.fillRect(bx + 8, 79, 14, 4);
  }

  // ★ DYNAMIC OUTDOOR-FACING CAFE WINDOW (x: 44..228, y: 26..72) ★
  const skyColor =
    state.timeOfDay === 'day'
      ? '#38bdf8'
      : state.timeOfDay === 'sunset'
        ? '#f97316'
        : '#0f172a';
  drawPixelBox(ctx, 44, 26, 184, 48, skyColor, '#f8fafc');
  if (state.timeOfDay === 'sunset') {
    ctx.fillStyle = '#fb7185';
    ctx.fillRect(46, 28, 180, 18);
    ctx.fillStyle = '#fde047';
    ctx.fillRect(118, 42, 18, 14);
  } else if (state.timeOfDay === 'night') {
    ctx.fillStyle = '#fef08a';
    ctx.fillRect(72, 34, 4, 4);
    ctx.fillRect(142, 38, 4, 4);
    ctx.fillRect(190, 32, 8, 8);
  } else {
    ctx.fillStyle = '#fef08a';
    ctx.fillRect(184, 32, 14, 14);
  }
  ctx.fillStyle = '#16a34a';
  ctx.fillRect(46, 58, 180, 14);
  ctx.fillStyle = '#ffffff';
  for (let wx = 58; wx < 216; wx += 28) {
    ctx.fillRect(wx, 62, 4, 4);
  }
  ctx.fillStyle = '#090b0e';
  ctx.fillRect(134, 26, 4, 48);
  ctx.fillRect(44, 49, 184, 3);

  // Overhead Wall Menu Boards (x: 248..568, y: 30..72)
  const sleeveBonus = state.finance.upgrades.custom_sleeves ? 4 : 0;
  drawPixelBox(ctx, 248, 30, 152, 42, '#1e293b', '#f8fafc', '#475569');
  ctx.font = 'bold 6px "Press Start 2P", monospace';
  ctx.textAlign = 'left';
  ctx.fillStyle = '#facc15';
  ctx.fillText('★ ESPRESSO BAR', 256, 42);
  ctx.fillStyle = '#f8fafc';
  ctx.fillText(`COLD BREW  $${14 + sleeveBonus}`, 256, 54);
  ctx.fillText(`MIATA MOCHA $${18 + sleeveBonus}`, 256, 65);

  drawPixelBox(ctx, 412, 30, 156, 42, '#1e293b', '#f8fafc', '#475569');
  ctx.fillStyle = '#86efac';
  ctx.fillText('★ GARDEN SPECIALS', 420, 42);
  ctx.fillStyle = '#f8fafc';
  ctx.fillText(`DAISY LATTE $${16 + sleeveBonus}`, 420, 54);
  ctx.fillText(`CATNIP TEA  $${15 + sleeveBonus}`, 420, 65);

  [136, 238, 406].forEach((lx) => {
    ctx.fillStyle = '#090b0e';
    ctx.fillRect(lx - 2, 16, 4, 10);
    drawPixelBox(ctx, lx - 10, 24, 20, 8, '#facc15', '#090b0e', '#fef08a');
  });

  // ★ PURCHASABLE DECOR: VINYL TURNTABLE & NEON SIGN (`vinyl_turntable_neon`) ★
  if (state.decorEquipped?.vinyl_turntable_neon) {
    // Glowing Neon Cafe Sign above window
    drawPixelBox(ctx, 64, 22, 144, 14, '#090b0e', '#f43f5e', '#fb7185');
    ctx.font = 'bold 6px "Press Start 2P", monospace';
    ctx.textAlign = 'center';
    ctx.fillStyle = Math.floor(time * 4) % 2 === 0 ? '#fda4af' : '#f43f5e';
    ctx.fillText('♪ LO-FI VINYL BAR ♪', 136, 32);

    // Spinning Retro Turntable on side stand at (44, 184)
    drawPixelBox(ctx, 30, 174, 34, 28, '#78350f', '#090b0e', '#b45309');
    drawPixelBox(ctx, 34, 178, 26, 18, '#1e293b', '#facc15');
    ctx.fillStyle = '#090b0e';
    ctx.fillRect(39, 181, 14, 12);
    ctx.fillStyle = Math.floor(time * 8) % 2 === 0 ? '#f43f5e' : '#38bdf8';
    ctx.fillRect(44, 185, 4, 4);
    if (Math.floor(time * 3) % 2 === 0) {
      ctx.font = 'bold 7px "Press Start 2P", monospace';
      ctx.fillStyle = '#fde047';
      ctx.fillText('♪', 46, 170);
    }
  }

  // ★ POTTED CORNER PLANTS ★
  drawPottedCornerPlant(ctx, 44, 106, time);
  drawPottedCornerPlant(ctx, 560, 106, time);
  drawPottedCornerPlant(ctx, 44, 434, time);

  // 4. Soft Woven Cafe Rug for Lilo (x: 444..552, y: 218..276)
  drawPixelBox(ctx, 444, 218, 108, 58, '#334155', '#090b0e', '#64748b');
  drawPixelBox(ctx, 454, 226, 88, 42, '#1e293b', '#cbd5e1');

  // 5. Rear Brewing Bar with Wood-Grain Highlights (x: 68..540, y: 114..172)
  drawPixelBox(ctx, 68, 116, 472, 46, '#0f172a', '#090b0e', '#334155');
  drawPixelBox(ctx, 68, 162, 472, 14, '#1e293b', '#090b0e');
  ctx.fillStyle = '#475569';
  for (let gx = 82; gx < 520; gx += 44) {
    ctx.fillRect(gx, 122, 26, 2);
  }

  // 6. Front Counter with Wood-Grain Slats, Cashier POS Register, Glass Pastry Display Case, Tip Jar, & Pickup Bar
  drawPixelBox(ctx, 68, 218, 360, 38, '#0f172a', '#090b0e', '#475569');
  drawPixelBox(ctx, 68, 256, 360, 18, '#334155', '#090b0e');
  for (let rx = 80; rx < 418; rx += 16) {
    ctx.fillStyle = '#090b0e';
    ctx.fillRect(rx, 258, 4, 14);
    ctx.fillStyle = '#64748b';
    ctx.fillRect(rx + 6, 260, 2, 10);
  }

  // ★ CASHIER POS REGISTER (x = 76..134, y = 210..244) ★
  drawPixelBox(ctx, 76, 210, 56, 34, '#1e293b', '#090b0e', '#94a3b8');
  drawPixelBox(ctx, 82, 214, 32, 16, '#064e3b', '#090b0e');
  ctx.font = 'bold 6px "Press Start 2P", monospace';
  ctx.textAlign = 'center';
  ctx.fillStyle = '#4ade80';
  ctx.fillText('$ POS', 98, 225);
  ctx.fillStyle = '#f8fafc';
  ctx.fillRect(120, 212, 8, 12);

  // ★ GLASS PASTRY DISPLAY CASE (x = 144..258, y = 210..246) ★
  drawPixelBox(ctx, 144, 210, 112, 36, '#38bdf8', '#090b0e', '#bae6fd');
  drawPixelBox(ctx, 148, 216, 104, 26, '#0f172a');
  drawPixelBox(ctx, 156, 224, 22, 12, '#f59e0b', '#090b0e', '#fde047');
  drawPixelBox(ctx, 188, 224, 22, 12, '#22c55e', '#090b0e', '#bbf7d0');
  drawPixelBox(ctx, 220, 224, 22, 12, '#f43f5e', '#090b0e', '#fecdd3');
  ctx.font = 'bold 6px "Press Start 2P", monospace';
  ctx.fillStyle = '#e2e8f0';
  ctx.fillText('PASTRIES', 200, 255);

  // ★ CLICKABLE COUNTER TIP JAR (`TIP_JAR_BOUNDS` at x = 288, y = 228) with Soft Pulse when tipJarCoins >= 10 ★
  const tj = TIP_JAR_BOUNDS;
  const tipPulse = state.tipJarCoins >= 10;
  if (tipPulse) {
    drawWarmLightPool(
      ctx,
      tj.x,
      tj.y,
      36,
      0.24 + 0.14 * Math.sin(time * 6),
      '250, 204, 21'
    );
  }
  const jarOutline = tipPulse
    ? Math.floor(time * 5) % 2 === 0
      ? '#fef08a'
      : '#facc15'
    : state.tipJarCoins > 0
      ? '#facc15'
      : '#090b0e';
  drawPixelBox(
    ctx,
    tj.x - 14,
    tj.y - 14,
    28,
    28,
    '#bae6fd',
    jarOutline,
    '#ffffff'
  );
  if (state.tipJarCoins > 0) {
    ctx.fillStyle = '#facc15';
    ctx.fillRect(tj.x - 10, tj.y + 2, 20, Math.min(18, 6 + Math.floor(state.tipJarCoins / 2)));
    const bob = tipPulse ? Math.round(Math.sin(time * 6) * 2) : 0;
    ctx.font = 'bold 6px "Press Start 2P", monospace';
    ctx.textAlign = 'center';
    ctx.fillStyle = tipPulse ? '#fef08a' : '#fde047';
    ctx.fillText(
      tipPulse ? `★ +${state.tipJarCoins}c` : `+${state.tipJarCoins}c`,
      tj.x,
      tj.y - 18 + bob
    );
  }
  ctx.font = 'bold 5px "Press Start 2P", monospace';
  ctx.textAlign = 'center';
  ctx.fillStyle = tipPulse ? '#fef08a' : '#facc15';
  ctx.fillText('TIPS', tj.x, tj.y + 23);

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

  // 7. 3 Cozy Indoor Seating Lounge Tables with Left, Right, Top Chairs & Pet Mat
  INDOOR_TABLES.forEach((t) => {
    ctx.fillStyle = 'rgba(0, 0, 0, 0.35)';
    ctx.fillRect(t.x - 36, t.y + 8, 72, 16);
    // Pet Mat beside the chairs (`petMatSpot`: table.x - 46, table.y + 12)
    drawPixelBox(ctx, t.petMatSpot.x - 10, t.petMatSpot.y - 5, 20, 12, '#334155', '#090b0e', '#64748b');
    // Top Chair (`topChair`: table.x, table.y - 26)
    drawPixelBox(ctx, t.topChair.x - 8, t.topChair.y - 6, 16, 14, '#334155', '#090b0e', '#64748b');
    // Left Chair (`leftChair`: table.x - 32, table.y - 4) & Right Chair (`rightChair`: table.x + 32, table.y - 4)
    drawPixelBox(ctx, t.leftChair.x - 8, t.leftChair.y - 6, 16, 18, '#334155', '#090b0e', '#64748b');
    drawPixelBox(ctx, t.rightChair.x - 8, t.rightChair.y - 6, 16, 18, '#334155', '#090b0e', '#64748b');
    // Table Surface
    drawPixelBox(ctx, t.x - 22, t.y - 18, 44, 28, '#f8fafc', '#090b0e', '#ffffff');
    ctx.fillStyle = '#cbd5e1';
    ctx.fillRect(t.x - 16, t.y - 6, 32, 2);
    drawPixelBox(ctx, t.x - 4, t.y - 14, 8, 8, '#facc15', '#090b0e', '#fef08a');
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

  // Interior Steel & Glass Partition Wall + Brick Wainscoting at x = 584
  drawPixelBox(ctx, 580, 20, 12, 168, '#0f172a', '#090b0e', '#64748b');
  drawPixelBox(ctx, 582, 42, 8, 124, '#38bdf8', '#090b0e', '#bae6fd');
  drawPixelBox(ctx, 580, 276, 12, 180, '#0f172a', '#090b0e', '#64748b');
  drawPixelBox(ctx, 582, 296, 8, 130, '#38bdf8', '#090b0e', '#bae6fd');

  // High-Contrast Black & White Checkered Garage Showroom Floor with Tile Grout Bevels
  const gTile = 28;
  for (let r = 0; r < 12; r++) {
    for (let c = 0; c < 9; c++) {
      const gx = bayLeft + 18 + c * gTile;
      const gy = bayTop + 68 + r * gTile;
      const isWhite = (r + c) % 2 === 0;
      ctx.fillStyle = isWhite ? '#e2e8f0' : '#1e232d';
      ctx.fillRect(gx, gy, gTile, gTile);
      ctx.fillStyle = isWhite ? '#ffffff' : '#2d3545';
      ctx.fillRect(gx, gy, gTile - 1, 2);
      ctx.fillStyle = '#090b0e';
      ctx.fillRect(gx, gy + gTile - 2, gTile, 2);
      ctx.fillRect(gx + gTile - 2, gy, 2, gTile);
    }
  }

  // ★ CLICKABLE RED MECHANIC TOOL CHEST (`TOOL_CHEST_BOUNDS`) ★
  drawPixelBox(ctx, bayLeft + 18, bayTop + 14, 92, 38, '#dc2626', '#facc15', '#f87171');
  ctx.fillStyle = '#f8fafc';
  ctx.fillRect(bayLeft + 26, bayTop + 24, 76, 2);
  ctx.fillRect(bayLeft + 26, bayTop + 31, 76, 2);
  ctx.font = 'bold 6px "Press Start 2P", monospace';
  ctx.textAlign = 'center';
  ctx.fillStyle = '#fef08a';
  ctx.fillText('PAINT [TAP]', bayLeft + 64, bayTop + 46);

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

  // ★ GARAGE LOUNGE TABLES RIGHT NEXT TO THE MIATA (`GARAGE_TABLES`) with Left, Right, Top Stools & Pet Mat ★
  GARAGE_TABLES.forEach((gt) => {
    ctx.fillStyle = 'rgba(0, 0, 0, 0.38)';
    ctx.fillRect(gt.x - 34, gt.y + 8, 68, 14);
    drawPixelBox(ctx, gt.petMatSpot.x - 10, gt.petMatSpot.y - 5, 20, 12, '#334155', '#090b0e', '#64748b');
    drawPixelBox(ctx, gt.topChair.x - 7, gt.topChair.y - 6, 14, 13, '#334155', '#090b0e', '#64748b');
    drawPixelBox(ctx, gt.leftChair.x - 7, gt.leftChair.y - 6, 14, 16, '#334155', '#090b0e', '#64748b');
    drawPixelBox(ctx, gt.rightChair.x - 7, gt.rightChair.y - 6, 14, 16, '#334155', '#090b0e', '#64748b');
    drawPixelBox(ctx, gt.x - 20, gt.y - 16, 40, 24, '#0f172a', '#f8fafc', '#475569');
    drawPixelBox(ctx, gt.x - 4, gt.y - 12, 8, 8, '#ef4444', '#090b0e', '#fca5a5');
  });

  // ★ GARAGE OIL DRIP MAT UNDER THE 1990 MAZDA MIATA MX-5 ★
  const mx = px(MIATA_GARAGE_BOUNDS.x);
  const my = px(MIATA_GARAGE_BOUNDS.y);
  drawPixelBox(ctx, mx - 54, my - 82, 108, 168, '#090b0e', '#334155', '#1e293b');
  ctx.fillStyle = '#1e293b';
  for (let ry = my - 72; ry < my + 76; ry += 12) {
    ctx.fillRect(mx - 46, ry, 92, 3);
  }

  // ★ PURCHASABLE DECOR: HYDRAULIC GARAGE LIFT & NEON UNDERGLOW (`garage_lift_underglow`) ★
  if (state.decorEquipped?.garage_lift_underglow) {
    drawWarmLightPool(ctx, mx, my, 86, 0.38 + Math.sin(time * 4) * 0.08, '56, 189, 248');
    // Left & Right Hydraulic Lift Columns
    drawPixelBox(ctx, mx - 64, my - 56, 12, 112, '#eab308', '#090b0e', '#fef08a');
    drawPixelBox(ctx, mx + 52, my - 56, 12, 112, '#eab308', '#090b0e', '#fef08a');
  }

  // ★ CLASSIC RED 1990 MAZDA MIATA MX-5 (NA) TOP-DOWN 3/4 PIXEL ART SPRITE ★
  const carW = 88;
  const carH = 148;
  const cLeft = mx - carW / 2;
  const cTop = my - carH / 2;

  const paintPalette = {
    red: { body: '#dc2626', hi: '#f87171', shade: '#991b1b', seam: '#7f1d1d' },
    white: { body: '#f8fafc', hi: '#ffffff', shade: '#cbd5e1', seam: '#94a3b8' },
    black: { body: '#18181b', hi: '#52525b', shade: '#090b0e', seam: '#3f3f46' },
  }[state.miataColor];

  ctx.fillStyle = 'rgba(0, 0, 0, 0.48)';
  ctx.fillRect(cLeft - 6, cTop + 8, carW + 12, carH);

  ctx.fillStyle = '#090b0e';
  ctx.fillRect(cLeft - 6, cTop + 18, 8, 26);
  ctx.fillRect(cLeft + carW - 2, cTop + 18, 8, 26);
  ctx.fillRect(cLeft - 6, cTop + carH - 44, 8, 26);
  ctx.fillRect(cLeft + carW - 2, cTop + carH - 44, 8, 26);

  const outlineCol = hoveredMiata ? '#facc15' : '#090b0e';
  drawPixelBox(ctx, cLeft + 4, cTop, carW - 8, carH, paintPalette.body, outlineCol, paintPalette.hi);
  drawPixelBox(ctx, cLeft, cTop + 10, carW, carH - 20, paintPalette.body, outlineCol);

  ctx.fillStyle = paintPalette.shade;
  ctx.fillRect(cLeft + 4, cTop + 14, 6, carH - 28);
  ctx.fillRect(cLeft + carW - 10, cTop + 14, 6, carH - 28);
  ctx.fillStyle = paintPalette.hi;
  ctx.fillRect(cLeft + 12, cTop + 82, 6, 42);

  ctx.strokeStyle = paintPalette.seam;
  ctx.lineWidth = 2;
  ctx.strokeRect(cLeft + 14, cTop + 76, carW - 28, 50);

  drawPixelBox(ctx, cLeft + 12, cTop + 30, carW - 24, 46, '#0f172a', '#090b0e');
  drawPixelBox(ctx, cLeft + 10, cTop + 64, carW - 20, 14, '#38bdf8', '#090b0e', '#bae6fd');
  drawPixelBox(ctx, cLeft + 16, cTop + 36, 18, 16, '#1e293b', '#090b0e', '#334155');
  drawPixelBox(ctx, cLeft + carW - 34, cTop + 36, 18, 16, '#1e293b', '#090b0e', '#334155');
  ctx.fillStyle = '#f8fafc';
  ctx.fillRect(cLeft + 20, cTop + 56, 12, 4);

  drawPixelBox(ctx, cLeft - 8, cTop + 68, 8, 6, paintPalette.body, '#090b0e');
  drawPixelBox(ctx, cLeft + carW, cTop + 68, 8, 6, paintPalette.body, '#090b0e');

  ctx.fillStyle = '#fde047';
  ctx.fillRect(cLeft + 10, cTop + 2, 16, 5);
  ctx.fillRect(cLeft + carW - 26, cTop + 2, 16, 5);

  ctx.fillStyle = '#090b0e';
  ctx.fillRect(cLeft + 20, cTop + carH - 6, carW - 40, 4);

  const hlY = cTop + carH - 24;
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
    drawWarmLightPool(ctx, leftHlX + 9, hlY + 46, 48, beamAlpha);
    drawWarmLightPool(ctx, rightHlX + 9, hlY + 46, 48, beamAlpha);
  } else {
    ctx.strokeStyle = paintPalette.seam;
    ctx.lineWidth = 2;
    ctx.strokeRect(leftHlX, hlY, 18, 12);
    ctx.strokeRect(rightHlX, hlY, 18, 12);
  }

  drawPixelBox(ctx, mx - 88, bayTop + bayH - 26, 176, 18, '#090b0e', '#f8fafc');
  ctx.font = 'bold 7px "Press Start 2P", monospace';
  ctx.textAlign = 'center';
  ctx.fillStyle = state.miataHeadlightsOn ? '#facc15' : '#cbd5e1';
  ctx.fillText(
    state.miataHeadlightsOn ? 'RED 90 MIATA [H] ON' : 'RED 90 MIATA [H] OFF',
    mx,
    bayTop + bayH - 14
  );
}

/**
 * ============================================================================
 * MAP 2: FULL-SCREEN 900x480 "GARDEN VIEW"
 * Upgraded 16-Bit Tileset: Textured Cobblestone Paths, Wood-Grain Planters,
 * Veranda Order Window, & 4 Umbrella Lounge Tables
 * ============================================================================
 */
function renderGardenRoom(
  ctx: CanvasRenderingContext2D,
  state: CafeState,
  time: number,
  hoveredDaisyId: string | null,
  hoveredStationId: string | null
) {
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

  ctx.fillStyle = '#090b0e';
  ctx.fillRect(16, 462, WORLD_WIDTH - 32, 6);
  for (let fx = 24; fx < WORLD_WIDTH - 24; fx += 32) {
    drawPixelBox(ctx, fx, 452, 10, 20, '#334155', '#090b0e', '#94a3b8');
  }

  // ★ TEXTURED COBBLESTONE GARDEN PATHS ★
  const paths = [
    { x: 450, y: 140, w: 96, h: 24 },
    { x: 450, y: 174, w: 96, h: 24 },
    { x: 450, y: 208, w: 104, h: 24 },
    { x: 450, y: 254, w: 148, h: 86 },
    { x: 356, y: 254, w: 64, h: 26 },
    { x: 544, y: 254, w: 64, h: 26 },
    { x: 450, y: 318, w: 96, h: 24 },
    { x: 450, y: 356, w: 96, h: 24 },
    { x: 450, y: 394, w: 96, h: 24 },
  ];
  paths.forEach((s) => {
    const left = px(s.x - s.w / 2);
    const top = px(s.y - s.h / 2);
    drawPixelBox(ctx, left, top, s.w, s.h, '#94a3b8', '#090b0e', '#e2e8f0');
    for (let cy = top + 4; cy < top + s.h - 6; cy += 10) {
      for (let cx = left + 6; cx < left + s.w - 12; cx += 16) {
        ctx.fillStyle = '#cbd5e1';
        ctx.fillRect(cx, cy, 12, 6);
        ctx.fillStyle = '#64748b';
        ctx.fillRect(cx, cy + 6, 12, 2);
      }
    }
  });

  drawPixelBox(ctx, 40, 14, 820, 98, '#0f172a', '#090b0e', '#334155');
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

  const ow = GARDEN_ORDER_WINDOW;
  const waitingCustomer = getFrontWaitingCustomer(state);
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

  drawPixelBox(ctx, 576, 62, 136, 36, '#38bdf8', '#f8fafc', '#bae6fd');
  ctx.fillStyle = '#090b0e';
  ctx.fillRect(642, 62, 4, 36);

  const wellX = 450;
  const wellY = 254;
  const wellHovered = hoveredStationId === 'watering_can';

  // ★ PURCHASABLE DECOR: STONE KOI FOUNTAIN (`stone_koi_fountain`) vs. Classic Well ★
  if (state.decorEquipped?.stone_koi_fountain) {
    drawPixelBox(
      ctx,
      wellX - 42,
      wellY - 26,
      84,
      54,
      '#64748b',
      wellHovered ? '#facc15' : '#090b0e',
      '#cbd5e1'
    );
    drawPixelBox(ctx, wellX - 34, wellY - 18, 68, 38, '#0284c7', '#090b0e', '#38bdf8');
    // Swimming Koi Fish
    const koiX = wellX + Math.round(Math.cos(time * 2.2) * 16);
    const koiY = wellY + Math.round(Math.sin(time * 2.2) * 8);
    ctx.fillStyle = '#f97316';
    ctx.fillRect(koiX - 4, koiY - 2, 8, 4);
    ctx.fillStyle = '#f8fafc';
    ctx.fillRect(koiX + 2, koiY - 2, 3, 4);
    // Tiered Stone Center Spout + Water Jet
    drawPixelBox(ctx, wellX - 10, wellY - 16, 20, 18, '#475569', '#090b0e', '#94a3b8');
    const jetH = 6 + Math.round(Math.abs(Math.sin(time * 7)) * 6);
    ctx.fillStyle = '#bae6fd';
    ctx.fillRect(wellX - 3, wellY - 16 - jetH, 6, jetH);
    drawPixelBox(ctx, wellX - 40, wellY + 28, 80, 12, '#090b0e', '#facc15');
    ctx.font = 'bold 6px "Press Start 2P", monospace';
    ctx.textAlign = 'center';
    ctx.fillStyle = '#fde047';
    ctx.fillText('KOI FOUNTAIN [W]', wellX, wellY + 37);
  } else {
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
    drawPixelBox(ctx, wellX - 30, wellY - 38, 8, 20, '#78350f', '#090b0e');
    drawPixelBox(ctx, wellX + 22, wellY - 38, 8, 20, '#78350f', '#090b0e');
    drawPixelBox(ctx, wellX - 38, wellY - 46, 76, 12, '#1e293b', '#090b0e', '#475569');
    drawPixelBox(ctx, wellX + 18, wellY + 2, 22, 16, '#0284c7', '#090b0e', '#38bdf8');
    drawPixelBox(ctx, wellX - 36, wellY + 26, 72, 12, '#090b0e', '#475569');
    ctx.font = 'bold 6px "Press Start 2P", monospace';
    ctx.textAlign = 'center';
    ctx.fillStyle = '#7dd3fc';
    ctx.fillText('WELL [W]', wellX, wellY + 35);
  }

  // ★ PURCHASABLE DECOR: BLOOMING DAISY TRELLIS ARCHWAYS (`daisy_trellis_archways`) ★
  if (state.decorEquipped?.daisy_trellis_archways) {
    [144, 384].forEach((ay) => {
      drawPixelBox(ctx, 404, ay - 26, 8, 34, '#78350f', '#090b0e', '#b45309');
      drawPixelBox(ctx, 488, ay - 26, 8, 34, '#78350f', '#090b0e', '#b45309');
      drawPixelBox(ctx, 398, ay - 34, 104, 12, '#15803d', '#090b0e', '#4ade80');
      drawSingleDaisy(ctx, 416, ay - 28, 0, true);
      drawSingleDaisy(ctx, 450, ay - 30, 0, true);
      drawSingleDaisy(ctx, 484, ay - 28, 0, true);
    });
  }

  GARDEN_TABLES.forEach((t, idx) => {
    ctx.fillStyle = 'rgba(0, 0, 0, 0.35)';
    ctx.fillRect(t.x - 40, t.y + 8, 80, 18);
    // Pet Mat beside the chairs (`petMatSpot`: table.x - 46, table.y + 12)
    drawPixelBox(ctx, t.petMatSpot.x - 10, t.petMatSpot.y - 5, 20, 12, '#334155', '#090b0e', '#64748b');
    // Top Chair (`topChair`: table.x, table.y - 26)
    drawPixelBox(ctx, t.topChair.x - 8, t.topChair.y - 6, 16, 14, '#334155', '#090b0e', '#64748b');
    // Left Chair (`leftChair`: table.x - 32, table.y - 4) & Right Chair (`rightChair`: table.x + 32, table.y - 4)
    drawPixelBox(ctx, t.leftChair.x - 8, t.leftChair.y - 6, 16, 18, '#334155', '#090b0e', '#64748b');
    drawPixelBox(ctx, t.rightChair.x - 8, t.rightChair.y - 6, 16, 18, '#334155', '#090b0e', '#64748b');
    // Table Surface
    drawPixelBox(ctx, t.x - 22, t.y - 18, 44, 30, '#f8fafc', '#090b0e', '#ffffff');
    drawPixelBox(
      ctx,
      t.x - 28,
      t.y - 38,
      56,
      14,
      idx % 2 === 0 ? '#0f172a' : '#1e293b',
      '#f8fafc',
      '#facc15'
    );
    ctx.fillStyle = '#090b0e';
    ctx.fillRect(t.x - 2, t.y - 24, 4, 10);
    drawSingleDaisy(ctx, t.x, t.y - 8, Math.sin(time * 2 + idx) * 1, true);
  });

  state.daisies.forEach((patch) => {
    drawDaisyBed(ctx, patch, state, time, hoveredDaisyId === patch.id);
  });

  const lanternRows = state.decorEquipped?.fairy_string_lanterns ? [142, 224, 304] : [148, 294];
  lanternRows.forEach((ly) => {
    ctx.strokeStyle = '#1e293b';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(110, ly);
    ctx.quadraticCurveTo(450, ly + 18, 790, ly);
    ctx.stroke();

    const bulbCount = state.decorEquipped?.fairy_string_lanterns ? 11 : 7;
    for (let i = 1; i <= bulbCount; i++) {
      const frac = i / (bulbCount + 1);
      const bx = 110 + frac * 680;
      const by = ly + Math.sin(frac * Math.PI) * 9;
      const isLit = state.timeOfDay !== 'day' || Boolean(state.decorEquipped?.fairy_string_lanterns);
      if (state.decorEquipped?.fairy_string_lanterns) {
        drawWarmLightPool(ctx, bx, by + 4, 24, 0.22);
      }
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

function renderAmbientLighting(
  ctx: CanvasRenderingContext2D,
  state: CafeState,
  time: number
) {
  if (state.timeOfDay === 'day') return;

  const isNight = state.timeOfDay === 'night';
  const pulse = 0.92 + Math.sin(time * 4) * 0.08;

  ctx.fillStyle = isNight
    ? 'rgba(10, 15, 34, 0.42)'
    : 'rgba(234, 88, 12, 0.16)';
  ctx.fillRect(0, 0, WORLD_WIDTH, WORLD_HEIGHT);

  const glowAlpha = (isNight ? 0.36 : 0.24) * pulse;

  if (state.room === 'inside') {
    [136, 238, 406].forEach((lx) => {
      drawWarmLightPool(ctx, lx, 118, 76, glowAlpha);
    });
    INDOOR_TABLES.forEach((t) => {
      drawWarmLightPool(ctx, t.x, t.y - 6, 54, glowAlpha * 0.85);
    });
    GARAGE_TABLES.forEach((gt) => {
      drawWarmLightPool(ctx, gt.x, gt.y - 6, 52, glowAlpha * 0.85);
    });
    if (state.miataHeadlightsOn) {
      drawWarmLightPool(
        ctx,
        MIATA_GARAGE_BOUNDS.x,
        MIATA_GARAGE_BOUNDS.y + 88,
        92,
        glowAlpha * 1.25
      );
    }
  } else {
    drawWarmLightPool(ctx, GARDEN_ORDER_WINDOW.x, GARDEN_ORDER_WINDOW.y + 18, 84, glowAlpha);
    drawWarmLightPool(ctx, 644, 96, 68, glowAlpha * 0.8);

    [148, 294].forEach((ly) => {
      for (let i = 1; i <= 7; i += 2) {
        const frac = i / 8;
        const bx = 110 + frac * 680;
        const by = ly + Math.sin(frac * Math.PI) * 9;
        drawWarmLightPool(ctx, bx, by + 6, 48, glowAlpha * 0.9);
      }
    });

    if (isNight) {
      for (let f = 0; f < 10; f++) {
        const fx = 90 + ((f * 83 + Math.sin(time * 1.4 + f) * 28) % 720);
        const fy = 150 + ((f * 57 + Math.cos(time * 1.8 + f * 2) * 22) % 290);
        const blink = 0.5 + 0.5 * Math.sin(time * 5 + f * 1.7);
        drawWarmLightPool(ctx, fx, fy, 14, blink * 0.45, '190, 242, 100');
        ctx.fillStyle = '#ecfccb';
        ctx.fillRect(px(fx), px(fy), 4, 4);
      }
    }
  }
}

export function renderCafeWorld(
  ctx: CanvasRenderingContext2D,
  state: CafeState,
  particles: ParticlePool,
  time: number,
  hoveredStationId: string | null,
  hoveredDaisyId: string | null,
  hoveredMiata = false,
  camera?: Camera2D
) {
  ctx.save();
  ctx.imageSmoothingEnabled = false;

  ctx.fillStyle = '#090b10';
  ctx.fillRect(0, 0, WORLD_WIDTH, WORLD_HEIGHT);

  if (camera && camera.zoom > 1.001) {
    const cam = clampCamera2D(camera, WORLD_WIDTH, WORLD_HEIGHT);
    ctx.translate(WORLD_WIDTH / 2, WORLD_HEIGHT / 2);
    ctx.scale(cam.zoom, cam.zoom);
    ctx.translate(-cam.panX, -cam.panY);
  }

  if (state.room === 'inside') {
    renderInsideRoom(ctx, state, time, hoveredStationId, hoveredMiata);
  } else {
    renderGardenRoom(ctx, state, time, hoveredDaisyId, hoveredStationId);
  }

  state.couples
    .filter((c) => c.room === state.room)
    .forEach((couple) => {
      drawDatingCouple(ctx, couple);
    });

  if (state.room === 'inside') {
    drawPhotoSquad(ctx, state);
  }

  // QoL: Y-Sorted Entity Depth Rendering — sort barista, hired staff, cats, customer leaders,
  // seated/walking companions, pets, and tabletop cups by their exact world Y coordinate each frame!
  const actors: Array<{ y: number; draw: () => void }> = [
    {
      y: state.barista.y,
      draw: () => drawBarista(ctx, state, time),
    },
    ...state.staff
      .filter((w) => w.hired && w.room === state.room)
      .map((w) => ({
        y: w.y,
        draw: () => drawStaffWorker(ctx, w, time),
      })),
    ...state.cats
      .filter((cat) => cat.room === state.room)
      .map((cat) => ({
        y: cat.y,
        draw: () => drawCatCompanion(ctx, cat, time),
      })),
  ];

  state.customers
    .filter((c) => c.room === state.room)
    .forEach((c) => {
      const seatSlot = getCustomerSeatSlot(c.seatIndex);
      const isSeatedAtTable =
        c.state === 'sipping' &&
        seatSlot !== null &&
        c.room === seatSlot.room &&
        Math.hypot(seatSlot.leftChair.x - c.x, seatSlot.leftChair.y - c.y) <= 12;

      const seatedPos = isSeatedAtTable ? getPartySeatedPositions(c) : null;

      // 1. Accompanying Pet (at petMatSpot when seated, or trailing behind leader)
      if (c.pet) {
        const petY = c.pet.y;
        actors.push({
          y: petY,
          draw: () => drawCustomerPet(ctx, c, time),
        });
      }

      // 2. Party Companions (rightChair for Companion 0, topChair for Companion 1 / Child Jr)
      c.companions.forEach((comp, cIdx) => {
        const compChair = seatedPos?.companions[cIdx];
        const compX = compChair ? compChair.x : c.x + comp.offsetX;
        const compY = compChair ? compChair.y : c.y + comp.offsetY;
        const compFacing = compChair ? compChair.facing : c.facing ?? 'right';
        actors.push({
          y: compY,
          draw: () =>
            drawCustomerCompanionActor(
              ctx,
              c,
              cIdx,
              compX,
              compY,
              compFacing,
              isSeatedAtTable,
              time
            ),
        });
      });

      // 3. Party Leader (leftChair when seated)
      const leaderY = seatedPos ? seatedPos.leader.y : c.y;
      actors.push({
        y: leaderY,
        draw: () => drawCustomerLeader(ctx, c, state, isSeatedAtTable, time),
      });

      // 4. Occupied Table Surface Drinks & Cozy Aura Steam/Hearts (rendered above tabletop & topChair)
      if (isSeatedAtTable && seatedPos) {
        actors.push({
          y: seatedPos.tableY + 1,
          draw: () => drawOccupiedTableSurfaceAndAura(ctx, c, time),
        });
      }
    });

  actors.sort((a, b) => a.y - b.y);
  actors.forEach((a) => a.draw());

  for (let i = 0; i < particles.items.length; i++) {
    const p = particles.items[i];
    if (!p.active) continue;

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

  renderAmbientLighting(ctx, state, time);

  for (let i = 0; i < state.popups.length; i++) {
    const pop = state.popups[i];
    if (pop.room !== state.room) continue;
    const alpha = Math.max(0, Math.min(1, pop.life / pop.maxLife));
    ctx.globalAlpha = alpha;
    drawCrispText(ctx, pop.text, px(pop.x), px(pop.y), 10, pop.color, 'center');
  }
  ctx.globalAlpha = 1;

  ctx.restore();
}
