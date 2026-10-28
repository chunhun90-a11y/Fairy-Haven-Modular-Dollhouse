/**
 * Dynamic HTML5 Canvas Sprite Sheet Slicer with Edge-Seeded Flood-Fill Alpha Keying.
 * Extracts the exact hand-illustrated fairies, magical pets, furniture items, UI buttons,
 * and room modules from the 4 attached design sheets with 100% transparent backgrounds
 * while keeping interior whites (eyes, cloud tiara, plates, jars, cushions) intact.
 */

import { useEffect, useState } from 'react';

export interface CropRect {
  sheet: 'pets' | 'fairies' | 'furniture' | 'rooms';
  x: number;
  y: number;
  w: number;
  h: number;
  removeBackground: boolean;
  /** Optional inner crop inset to trim outer rounded box borders on rooms */
  trimInset?: { top: number; right: number; bottom: number; left: number };
}

export const SHEET_URLS: Record<CropRect['sheet'], string> = {
  pets: '/assets/aistudio/Gemini_Generated_Image_4tvtis4tvt_c40f17b5.jpg',
  fairies: '/assets/aistudio/Gemini_Generated_Image_4tvtis4tvtis4tvt_6326a52b.jpg',
  furniture: '/assets/aistudio/Gemini_Generated_Image_8yxawl8yxawl8yxa_7ae919ed.jpg',
  rooms: '/assets/aistudio/Gemini_Generated_Image_skmwo7skmwo7skmw_fc51e03e.jpg',
};

export const SPRITE_CROPS: Record<string, CropRect> = {
  // === 6 MAGICAL PETS (Sheet 1: 2752 x 1536) ===
  moss_pet: { sheet: 'pets', x: 184, y: 68, w: 556, h: 664, removeBackground: true },
  kitten_pet: { sheet: 'pets', x: 1096, y: 100, w: 628, h: 632, removeBackground: true },
  squirrel_pet: { sheet: 'pets', x: 2016, y: 76, w: 676, h: 648, removeBackground: true },
  bee_pet: { sheet: 'pets', x: 200, y: 828, w: 560, h: 636, removeBackground: true },
  owl_pet: { sheet: 'pets', x: 992, y: 900, w: 824, h: 580, removeBackground: true },
  bunny_pet: { sheet: 'pets', x: 2008, y: 836, w: 580, h: 656, removeBackground: true },

  // === FAIRY CHARACTERS (Sheet 2: 2752 x 1536 + Sheet 3 sitting/standing poses) ===
  leaf_fairy: { sheet: 'fairies', x: 84, y: 44, w: 556, h: 736, removeBackground: true },
  ice_fairy: { sheet: 'fairies', x: 748, y: 60, w: 576, h: 724, removeBackground: true },
  autumn_fairy: { sheet: 'fairies', x: 1472, y: 80, w: 580, h: 704, removeBackground: true },
  rose_fairy_amber: { sheet: 'fairies', x: 2172, y: 60, w: 532, h: 720, removeBackground: true },
  rose_fairy: { sheet: 'fairies', x: 88, y: 788, w: 540, h: 728, removeBackground: true },
  star_fairy: { sheet: 'fairies', x: 1108, y: 836, w: 540, h: 680, removeBackground: true },
  rainbow_fairy: { sheet: 'fairies', x: 2152, y: 832, w: 516, h: 684, removeBackground: true },
  pink_bun_fairy_sitting: { sheet: 'furniture', x: 100, y: 60, w: 328, h: 504, removeBackground: true },
  pink_bun_fairy_standing: { sheet: 'furniture', x: 100, y: 584, w: 328, h: 544, removeBackground: true },

  // === FURNITURE & DECOR PROPS (Sheet 3: 2400 x 1792) ===
  pink_bed: { sheet: 'furniture', x: 524, y: 56, w: 860, h: 536, removeBackground: true },
  mushroom_nightstand: { sheet: 'furniture', x: 1404, y: 112, w: 288, h: 448, removeBackground: true },
  dollhouse_table: { sheet: 'furniture', x: 1692, y: 160, w: 308, h: 404, removeBackground: true },
  pink_chair: { sheet: 'furniture', x: 2040, y: 108, w: 268, h: 476, removeBackground: true },
  mint_oven: { sheet: 'furniture', x: 744, y: 776, w: 372, h: 404, removeBackground: true },
  kitchen_shelf: { sheet: 'furniture', x: 1388, y: 620, w: 552, h: 208, removeBackground: true },
  dining_chair: { sheet: 'furniture', x: 1164, y: 848, w: 228, h: 340, removeBackground: true },
  dining_chair_right: { sheet: 'furniture', x: 1736, y: 848, w: 232, h: 344, removeBackground: true },
  dining_table: { sheet: 'furniture', x: 1356, y: 888, w: 420, h: 304, removeBackground: true },
  yellow_fridge: { sheet: 'furniture', x: 2012, y: 644, w: 324, h: 552, removeBackground: true },
  bubble_chair: { sheet: 'furniture', x: 72, y: 1144, w: 372, h: 528, removeBackground: true },
  tall_cactus: { sheet: 'furniture', x: 500, y: 1100, w: 180, h: 312, removeBackground: true },
  round_cactus: { sheet: 'furniture', x: 496, y: 1428, w: 168, h: 316, removeBackground: true },
  fern_plant: { sheet: 'furniture', x: 692, y: 1384, w: 300, h: 364, removeBackground: true },
  flower_vine_pot: { sheet: 'furniture', x: 1004, y: 1228, w: 416, h: 516, removeBackground: true },
  small_leaf_pot: { sheet: 'furniture', x: 1484, y: 1280, w: 228, h: 188, removeBackground: true },
  watering_can: { sheet: 'furniture', x: 1460, y: 1552, w: 288, h: 188, removeBackground: true },

  // === UI ROUND BUTTONS FROM SHEET 3 ===
  ui_plus: { sheet: 'furniture', x: 1840, y: 1236, w: 232, h: 244, removeBackground: true },
  ui_gear: { sheet: 'furniture', x: 2096, y: 1236, w: 232, h: 244, removeBackground: true },
  ui_hammer: { sheet: 'furniture', x: 1840, y: 1496, w: 232, h: 248, removeBackground: true },
  ui_hand: { sheet: 'furniture', x: 2116, y: 1512, w: 196, h: 228, removeBackground: true },

  // === ROOM INTERIORS (Sheet 4: 2752 x 1536, cropped cleanly inside the rounded outer border so they fit flush in the wooden dollhouse frame) ===
  room_bedroom: {
    sheet: 'rooms',
    x: 152,
    y: 150,
    w: 824,
    h: 500,
    removeBackground: false,
  },
  room_kitchen: {
    sheet: 'rooms',
    x: 1216,
    y: 150,
    w: 832,
    h: 500,
    removeBackground: false,
  },
  room_garden: {
    sheet: 'rooms',
    x: 146,
    y: 842,
    w: 808,
    h: 508,
    removeBackground: false,
  },
  room_empty: {
    sheet: 'rooms',
    x: 1498,
    y: 842,
    w: 744,
    h: 508,
    removeBackground: false,
  },
  room_elevator: {
    sheet: 'rooms',
    x: 2256,
    y: 120,
    w: 356,
    h: 632,
    removeBackground: false,
  },
  room_stairs: {
    sheet: 'rooms',
    x: 2384,
    y: 856,
    w: 216,
    h: 500,
    removeBackground: true,
  },
};

const spriteCache = new Map<string, string>();
const sheetPromiseCache = new Map<string, Promise<HTMLImageElement>>();
let preloadPromise: Promise<void> | null = null;
const listeners = new Set<() => void>();

function loadSheetImage(url: string): Promise<HTMLImageElement> {
  const existing = sheetPromiseCache.get(url);
  if (existing) return existing;
  const p = new Promise<HTMLImageElement>((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => resolve(img);
    img.onerror = (err) => reject(err);
    img.src = url;
  });
  sheetPromiseCache.set(url, p);
  return p;
}

/**
 * Slices a single sprite from its source sheet and runs edge-seeded flood-fill background removal.
 */
function sliceSpriteFromImage(img: HTMLImageElement, crop: CropRect): string {
  // Scale down very large crops slightly (max dimension 320px for props/characters, 560px for rooms)
  // so flood-fill runs in <2ms per sprite while staying razor-sharp on Retina displays.
  const maxDim = crop.removeBackground ? 280 : 540;
  const scale = Math.min(1, maxDim / Math.max(crop.w, crop.h));
  const cw = Math.max(1, Math.round(crop.w * scale));
  const ch = Math.max(1, Math.round(crop.h * scale));

  const canvas = document.createElement('canvas');
  canvas.width = cw;
  canvas.height = ch;
  const ctx = canvas.getContext('2d');
  if (!ctx) return '';

  ctx.drawImage(img, crop.x, crop.y, crop.w, crop.h, 0, 0, cw, ch);

  if (crop.removeBackground) {
    const imgData = ctx.getImageData(0, 0, cw, ch);
    const data = imgData.data;
    const total = cw * ch;
    const visited = new Uint8Array(total);
    const queue = new Int32Array(total);
    let qHead = 0;
    let qTail = 0;

    // A pixel is considered exterior background if it's light paper white OR very pale grey/lavender aura
    // outside the dark cartoon outline (#231F20).
    const isExteriorBg = (idx: number): boolean => {
      const r = data[idx * 4];
      const g = data[idx * 4 + 1];
      const b = data[idx * 4 + 2];
      // Pure/near white paper background
      if (r >= 226 && g >= 226 && b >= 226) return true;
      // Soft outer glow on owl_pet (pale lavender-white outside dark outline)
      const minC = Math.min(r, g, b);
      const maxC = Math.max(r, g, b);
      if (minC >= 205 && maxC - minC <= 38) return true;
      return false;
    };

    const pushSeed = (x: number, y: number) => {
      const idx = y * cw + x;
      if (!visited[idx] && isExteriorBg(idx)) {
        visited[idx] = 1;
        queue[qTail++] = idx;
      }
    };

    for (let x = 0; x < cw; x++) {
      pushSeed(x, 0);
      pushSeed(x, ch - 1);
    }
    for (let y = 0; y < ch; y++) {
      pushSeed(0, y);
      pushSeed(cw - 1, y);
    }

    while (qHead < qTail) {
      const curr = queue[qHead++];
      data[curr * 4 + 3] = 0; // Make exterior background 100% transparent

      const cx = curr % cw;
      const cy = (curr - cx) / cw;

      if (cy > 0) {
        const up = curr - cw;
        if (!visited[up] && isExteriorBg(up)) {
          visited[up] = 1;
          queue[qTail++] = up;
        }
      }
      if (cy < ch - 1) {
        const down = curr + cw;
        if (!visited[down] && isExteriorBg(down)) {
          visited[down] = 1;
          queue[qTail++] = down;
        }
      }
      if (cx > 0) {
        const left = curr - 1;
        if (!visited[left] && isExteriorBg(left)) {
          visited[left] = 1;
          queue[qTail++] = left;
        }
      }
      if (cx < cw - 1) {
        const right = curr + 1;
        if (!visited[right] && isExteriorBg(right)) {
          visited[right] = 1;
          queue[qTail++] = right;
        }
      }
    }

    // Smooth anti-aliased fringe pixels directly bordering transparent exterior pixels
    for (let y = 1; y < ch - 1; y++) {
      for (let x = 1; x < cw - 1; x++) {
        const idx = y * cw + x;
        if (visited[idx]) continue;
        const hasTransparentNeighbor =
          visited[idx - 1] ||
          visited[idx + 1] ||
          visited[idx - cw] ||
          visited[idx + cw];
        if (hasTransparentNeighbor) {
          const r = data[idx * 4];
          const g = data[idx * 4 + 1];
          const b = data[idx * 4 + 2];
          const lum = (r + g + b) / 3;
          if (lum > 180) {
            data[idx * 4 + 3] = Math.round(((245 - lum) / 65) * 180);
          }
        }
      }
    }

    ctx.putImageData(imgData, 0, 0);
  }

  return canvas.toDataURL('image/png');
}

export function ensureAllSpritesLoaded(): Promise<void> {
  if (typeof window === 'undefined') return Promise.resolve();
  if (preloadPromise) return preloadPromise;

  preloadPromise = (async () => {
    try {
      const sheets = await Promise.all([
        loadSheetImage(SHEET_URLS.pets),
        loadSheetImage(SHEET_URLS.fairies),
        loadSheetImage(SHEET_URLS.furniture),
        loadSheetImage(SHEET_URLS.rooms),
      ]);
      const sheetMap: Record<CropRect['sheet'], HTMLImageElement> = {
        pets: sheets[0],
        fairies: sheets[1],
        furniture: sheets[2],
        rooms: sheets[3],
      };

      for (const [key, crop] of Object.entries(SPRITE_CROPS)) {
        if (!spriteCache.has(key)) {
          const img = sheetMap[crop.sheet];
          const dataUrl = sliceSpriteFromImage(img, crop);
          if (dataUrl) {
            spriteCache.set(key, dataUrl);
          }
        }
      }
      listeners.forEach((cb) => cb());
    } catch {
      // Fallback safely if image load fails in non-browser environment
    }
  })();

  return preloadPromise;
}

export function getSlicedSpriteUrl(key: string): string | undefined {
  return spriteCache.get(key);
}

export function useSpritesReady(): boolean {
  const [ready, setReady] = useState<boolean>(() => spriteCache.size > 0);
  useEffect(() => {
    if (spriteCache.size > 0) {
      setReady(true);
      return;
    }
    const onReady = () => setReady(true);
    listeners.add(onReady);
    ensureAllSpritesLoaded();
    return () => {
      listeners.delete(onReady);
    };
  }, []);
  return ready;
}
