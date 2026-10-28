/**
 * Pure decoupled game rules, connected wooden dollhouse geometry, room construction,
 * furniture snapping, and character/pet sandbox state logic for Fairy Haven.
 */

export type RoomType =
  | 'bedroom'
  | 'kitchen'
  | 'garden'
  | 'empty'
  | 'elevator'
  | 'stairs';

export type PlacementSurface = 'floor' | 'wall' | 'ceiling';

export type FairyPose = 'idle' | 'dangling' | 'sitting' | 'sleeping';

export interface RoomArchetype {
  type: RoomType;
  name: string;
  subtitle: string;
  isConnector: boolean;
  widthUnits: number;
  cozyBonus: number;
  accentColor: string;
}

export interface BuiltRoom {
  id: string;
  type: RoomType;
  floor: number; // 0 = lower/ground floor, 1 = middle floor, 2 = top attic/gable floor, 3+ = upper expansion
  col: number;   // 0 = central elevator/stair core, -1 = left wing, +1 = right wing
  builtAt: number;
}

export interface BuildableSlot {
  key: string;
  floor: number;
  col: number;
  x: number;
  y: number;
  width: number;
  height: number;
  suggestedConnector: boolean;
  bayStyle: 'stone_brick' | 'concrete_wood' | 'shaft';
}

export interface RoomBounds {
  id: string;
  type: RoomType;
  floor: number;
  col: number;
  x: number;
  y: number;
  width: number;
  height: number;
  floorY: number;
  ceilingY: number;
  wallMinY: number;
  wallMaxY: number;
  innerLeft: number;
  innerRight: number;
}

export interface FurnitureCatalogItem {
  itemId: string;
  name: string;
  category: 'bedroom' | 'kitchen' | 'garden';
  placement: PlacementSurface;
  width: number;
  height: number;
  interactionTag?: 'bed' | 'seat' | 'toggle';
  cozyValue: number;
}

export interface PlacedFurniture {
  id: string;
  itemId: string;
  roomId: string;
  x: number; // world X (center-bottom for floor, center for wall/ceiling)
  y: number; // world Y (bottom for floor, center for wall, top-anchor for ceiling)
  toggled?: boolean;
}

export interface FairyDefinition {
  fairyId: string;
  name: string;
  title: string;
  companionPetId: string;
  favoriteRoom: RoomType;
  themeColor: string;
}

export interface PetDefinition {
  petId: string;
  name: string;
  title: string;
  companionFairyId: string;
  themeColor: string;
}

export interface CharacterEntity {
  id: string;
  kind: 'fairy' | 'pet';
  defId: string;
  name: string;
  x: number;
  y: number;
  vx: number;
  vy: number;
  pose: FairyPose;
  roomId: string | null;
  anchoredFurnitureId: string | null;
  facing: 1 | -1;
  happyTimer: number;
}

export interface HouseState {
  rooms: BuiltRoom[];
  furniture: PlacedFurniture[];
  entities: CharacterEntity[];
}

// Connected Wooden Dollhouse Dimensions (Zero floating gaps — rooms join flush with shared timber posts & floor slabs)
export const FLOOR_HEIGHT = 216;
export const FULL_ROOM_WIDTH = 348;
export const CONNECTOR_ROOM_WIDTH = 176;
export const TIMBER_WALL_THICKNESS = 12;
export const ROOM_GAP_X = 0;
export const ROOM_GAP_Y = 0;

export const ROOM_ARCHETYPES: Record<RoomType, RoomArchetype> = {
  bedroom: {
    type: 'bedroom',
    name: 'Cozy Star Bedroom',
    subtitle: 'Lavender starlight walls & round window',
    isConnector: false,
    widthUnits: 2,
    cozyBonus: 25,
    accentColor: '#D4B8F0',
  },
  kitchen: {
    type: 'kitchen',
    name: 'Mint Kitchen',
    subtitle: 'Tiled backsplash & herringbone parquet floor',
    isConnector: false,
    widthUnits: 2,
    cozyBonus: 25,
    accentColor: '#9ED9C8',
  },
  garden: {
    type: 'garden',
    name: 'Floral Garden Room',
    subtitle: 'Blossom wallpaper, hanging ivy & soft grass',
    isConnector: false,
    widthUnits: 2,
    cozyBonus: 30,
    accentColor: '#A8D88B',
  },
  empty: {
    type: 'empty',
    name: 'Sunlit Wood Studio',
    subtitle: 'Warm cream walls & wood wainscoting',
    isConnector: false,
    widthUnits: 2,
    cozyBonus: 20,
    accentColor: '#F3D8B6',
  },
  elevator: {
    type: 'elevator',
    name: 'Elevator & Stair Core',
    subtitle: 'Central lift shaft & stairs connecting floors',
    isConnector: true,
    widthUnits: 1,
    cozyBonus: 15,
    accentColor: '#B5BDC4',
  },
  stairs: {
    type: 'stairs',
    name: 'Stairwell Passage',
    subtitle: 'Wooden staircase between dollhouse levels',
    isConnector: true,
    widthUnits: 1,
    cozyBonus: 15,
    accentColor: '#D8A97C',
  },
};

export const FURNITURE_CATALOG: FurnitureCatalogItem[] = [
  // Bedroom items from Sheet 4
  {
    itemId: 'pink_bed',
    name: 'Starlight Pink Bed',
    category: 'bedroom',
    placement: 'floor',
    width: 148,
    height: 92,
    interactionTag: 'bed',
    cozyValue: 20,
  },
  {
    itemId: 'mushroom_nightstand',
    name: 'Mushroom Lamp Stand',
    category: 'bedroom',
    placement: 'floor',
    width: 58,
    height: 88,
    interactionTag: 'toggle',
    cozyValue: 12,
  },
  {
    itemId: 'dollhouse_table',
    name: 'Mini Dollhouse & Bear',
    category: 'bedroom',
    placement: 'floor',
    width: 66,
    height: 84,
    interactionTag: 'toggle',
    cozyValue: 15,
  },
  {
    itemId: 'pink_chair',
    name: 'Rose Velvet Chair',
    category: 'bedroom',
    placement: 'floor',
    width: 54,
    height: 88,
    interactionTag: 'seat',
    cozyValue: 10,
  },

  // Kitchen items from Sheet 4
  {
    itemId: 'mint_oven',
    name: 'Mint Retro Range Oven',
    category: 'kitchen',
    placement: 'floor',
    width: 78,
    height: 86,
    interactionTag: 'toggle',
    cozyValue: 18,
  },
  {
    itemId: 'kitchen_shelf',
    name: 'Pantry Jars & Mugs Shelf',
    category: 'kitchen',
    placement: 'wall',
    width: 112,
    height: 44,
    cozyValue: 14,
  },
  {
    itemId: 'dining_table',
    name: 'Round Café Table',
    category: 'kitchen',
    placement: 'floor',
    width: 92,
    height: 66,
    cozyValue: 14,
  },
  {
    itemId: 'dining_chair',
    name: 'Left Dining Chair',
    category: 'kitchen',
    placement: 'floor',
    width: 50,
    height: 74,
    interactionTag: 'seat',
    cozyValue: 10,
  },
  {
    itemId: 'dining_chair_right',
    name: 'Right Dining Chair',
    category: 'kitchen',
    placement: 'floor',
    width: 50,
    height: 74,
    interactionTag: 'seat',
    cozyValue: 10,
  },
  {
    itemId: 'yellow_fridge',
    name: 'Buttercup Retro Fridge',
    category: 'kitchen',
    placement: 'floor',
    width: 70,
    height: 116,
    interactionTag: 'toggle',
    cozyValue: 18,
  },

  // Garden & Decor items from Sheet 4
  {
    itemId: 'bubble_chair',
    name: 'Hanging Wicker Egg Chair',
    category: 'garden',
    placement: 'ceiling',
    width: 84,
    height: 118,
    interactionTag: 'seat',
    cozyValue: 22,
  },
  {
    itemId: 'flower_vine_pot',
    name: 'Blooming Violet Vine',
    category: 'garden',
    placement: 'floor',
    width: 82,
    height: 102,
    cozyValue: 15,
  },
  {
    itemId: 'fern_plant',
    name: 'Golden Pot Lush Fern',
    category: 'garden',
    placement: 'floor',
    width: 62,
    height: 74,
    cozyValue: 12,
  },
  {
    itemId: 'tall_cactus',
    name: 'Saguaro Desert Cactus',
    category: 'garden',
    placement: 'floor',
    width: 44,
    height: 74,
    cozyValue: 10,
  },
  {
    itemId: 'round_cactus',
    name: 'Barrel Cactus Pot',
    category: 'garden',
    placement: 'floor',
    width: 40,
    height: 66,
    cozyValue: 10,
  },
  {
    itemId: 'small_leaf_pot',
    name: 'Rosette Leaf Planter',
    category: 'garden',
    placement: 'floor',
    width: 48,
    height: 44,
    cozyValue: 8,
  },
  {
    itemId: 'watering_can',
    name: 'Garden Watering Can',
    category: 'garden',
    placement: 'floor',
    width: 58,
    height: 42,
    interactionTag: 'toggle',
    cozyValue: 8,
  },
];

export const FAIRY_DEFINITIONS: FairyDefinition[] = [
  {
    fairyId: 'leaf_fairy',
    name: 'Willow',
    title: 'Forest Leaf Fairy',
    companionPetId: 'moss_pet',
    favoriteRoom: 'garden',
    themeColor: '#88C454',
  },
  {
    fairyId: 'ice_fairy',
    name: 'Celeste',
    title: 'Cloud & Starlight Fairy',
    companionPetId: 'kitten_pet',
    favoriteRoom: 'bedroom',
    themeColor: '#8ED0F6',
  },
  {
    fairyId: 'autumn_fairy',
    name: 'Hazel',
    title: 'Autumn Acorn Fairy',
    companionPetId: 'squirrel_pet',
    favoriteRoom: 'kitchen',
    themeColor: '#EE8A34',
  },
  {
    fairyId: 'rose_fairy',
    name: 'Rosalind',
    title: 'Rose Garden Fairy',
    companionPetId: 'bee_pet',
    favoriteRoom: 'garden',
    themeColor: '#F388AC',
  },
  {
    fairyId: 'star_fairy',
    name: 'Luna',
    title: 'Night Star Pajama Fairy',
    companionPetId: 'owl_pet',
    favoriteRoom: 'bedroom',
    themeColor: '#7E64C8',
  },
  {
    fairyId: 'rainbow_fairy',
    name: 'Iris',
    title: 'Rainbow Pastel Fairy',
    companionPetId: 'bunny_pet',
    favoriteRoom: 'kitchen',
    themeColor: '#E59BE9',
  },
];

export const PET_DEFINITIONS: PetDefinition[] = [
  {
    petId: 'moss_pet',
    name: 'Sprout',
    title: 'Moss Seedling Pet',
    companionFairyId: 'leaf_fairy',
    themeColor: '#69934C',
  },
  {
    petId: 'kitten_pet',
    name: 'Nimbus',
    title: 'Flying Kitten Pet',
    companionFairyId: 'ice_fairy',
    themeColor: '#9CD8F7',
  },
  {
    petId: 'squirrel_pet',
    name: 'Pip',
    title: 'Flying Squirrel Pet',
    companionFairyId: 'autumn_fairy',
    themeColor: '#E77B25',
  },
  {
    petId: 'bee_pet',
    name: 'Barnaby',
    title: 'Unicorn Honeybee Pet',
    companionFairyId: 'rose_fairy',
    themeColor: '#F7D25A',
  },
  {
    petId: 'owl_pet',
    name: 'Hootie',
    title: 'Winged Owl Pet',
    companionFairyId: 'star_fairy',
    themeColor: '#8B65CC',
  },
  {
    petId: 'bunny_pet',
    name: 'Clover',
    title: 'Flower Bunny Pet',
    companionFairyId: 'rainbow_fairy',
    themeColor: '#F7A8D0',
  },
];

export function getColumnSlotMetrics(col: number, type?: RoomType): { x: number; width: number; isSpine: boolean } {
  const spineHalf = CONNECTOR_ROOM_WIDTH / 2;
  if (col === 0) {
    const w = type && !ROOM_ARCHETYPES[type].isConnector ? FULL_ROOM_WIDTH : CONNECTOR_ROOM_WIDTH;
    return { x: -w / 2, width: w, isSpine: true };
  }
  const dir = col > 0 ? 1 : -1;
  const absCol = Math.abs(col);
  const startEdge = spineHalf + (absCol - 1) * FULL_ROOM_WIDTH;
  const w = FULL_ROOM_WIDTH;
  const x = dir > 0 ? startEdge : -startEdge - w;
  return { x, width: w, isSpine: false };
}

export function getFloorY(floor: number): number {
  // Floor 0 is the ground/lower level; Floor 1 is middle; Floor 2 is upper under the roof.
  // Center the 3-story house vertically around Y = 0:
  return (1 - floor) * FLOOR_HEIGHT - FLOOR_HEIGHT / 2;
}

export function computeRoomBounds(room: BuiltRoom): RoomBounds {
  const metrics = getColumnSlotMetrics(room.col, room.type);
  const y = getFloorY(room.floor);
  const height = FLOOR_HEIGHT;
  const floorY = y + height - 18;
  const ceilingY = y + 12;
  const wallMinY = y + 38;
  const wallMaxY = y + height - 62;
  const padX = ROOM_ARCHETYPES[room.type].isConnector ? 18 : 26;
  return {
    id: room.id,
    type: room.type,
    floor: room.floor,
    col: room.col,
    x: metrics.x,
    y,
    width: metrics.width,
    height,
    floorY,
    ceilingY,
    wallMinY,
    wallMaxY,
    innerLeft: metrics.x + padX,
    innerRight: metrics.x + metrics.width - padX,
  };
}

export function getBuildableSlots(rooms: BuiltRoom[]): BuildableSlot[] {
  const occupied = new Set(rooms.map((r) => `${r.floor},${r.col}`));
  const candidateMap = new Map<string, BuildableSlot>();

  const addCandidate = (floor: number, col: number) => {
    if (floor < 0 || floor > 4 || col < -2 || col > 2) return;
    const key = `${floor},${col}`;
    if (occupied.has(key) || candidateMap.has(key)) return;
    const metrics = getColumnSlotMetrics(col);
    const y = getFloorY(floor);
    candidateMap.set(key, {
      key,
      floor,
      col,
      x: metrics.x,
      y,
      width: metrics.width,
      height: FLOOR_HEIGHT,
      suggestedConnector: col === 0,
      bayStyle: col === 0 ? 'shaft' : col < 0 ? 'stone_brick' : 'concrete_wood',
    });
  };

  if (rooms.length === 0) {
    addCandidate(0, 0);
    return Array.from(candidateMap.values());
  }

  for (const room of rooms) {
    addCandidate(room.floor, room.col - 1);
    addCandidate(room.floor, room.col + 1);
    addCandidate(room.floor + 1, room.col);
    if (room.floor > 0) {
      addCandidate(room.floor - 1, room.col);
    }
  }

  return Array.from(candidateMap.values());
}

export function createRoom(
  state: HouseState,
  type: RoomType,
  floor: number,
  col: number,
  now = Date.now()
): { state: HouseState; created: BuiltRoom | null } {
  const exists = state.rooms.some((r) => r.floor === floor && r.col === col);
  if (exists) {
    return { state, created: null };
  }
  const newRoom: BuiltRoom = {
    id: `room_${floor}_${col}_${now}`,
    type,
    floor,
    col,
    builtAt: now,
  };
  return {
    state: {
      ...state,
      rooms: [...state.rooms, newRoom],
    },
    created: newRoom,
  };
}

export function findRoomAtPoint(rooms: BuiltRoom[], worldX: number, worldY: number): RoomBounds | null {
  for (const room of rooms) {
    const b = computeRoomBounds(room);
    if (
      worldX >= b.x &&
      worldX <= b.x + b.width &&
      worldY >= b.y &&
      worldY <= b.y + b.height
    ) {
      return b;
    }
  }
  return null;
}

export function snapFurnitureToRoom(
  rooms: BuiltRoom[],
  item: FurnitureCatalogItem,
  worldX: number,
  worldY: number
): { roomId: string; x: number; y: number } | null {
  const room = findRoomAtPoint(rooms, worldX, worldY);
  if (!room) return null;

  const halfW = item.width / 2;
  const minX = Math.min(room.innerLeft + halfW, (room.innerLeft + room.innerRight) / 2);
  const maxX = Math.max(room.innerRight - halfW, (room.innerLeft + room.innerRight) / 2);
  const clampedX = Math.max(minX, Math.min(maxX, Math.round(worldX)));

  if (item.placement === 'floor') {
    return {
      roomId: room.id,
      x: clampedX,
      y: room.floorY,
    };
  }
  if (item.placement === 'ceiling') {
    return {
      roomId: room.id,
      x: clampedX,
      y: room.ceilingY,
    };
  }
  const clampedY = Math.max(
    room.wallMinY,
    Math.min(room.wallMaxY, Math.round(worldY))
  );
  return {
    roomId: room.id,
    x: clampedX,
    y: clampedY,
  };
}

export function resolveCharacterPoseOnDrop(
  state: HouseState,
  entityKind: 'fairy' | 'pet',
  worldX: number,
  worldY: number
): {
  x: number;
  y: number;
  pose: FairyPose;
  roomId: string | null;
  anchoredFurnitureId: string | null;
} {
  let targetRoom = findRoomAtPoint(state.rooms, worldX, worldY);
  if (!targetRoom && state.rooms.length > 0) {
    let bestDist = Infinity;
    for (const r of state.rooms) {
      const b = computeRoomBounds(r);
      const cx = b.x + b.width / 2;
      const cy = b.y + b.height / 2;
      const d = Math.hypot(worldX - cx, worldY - cy);
      if (d < bestDist) {
        bestDist = d;
        targetRoom = b;
      }
    }
  }

  if (!targetRoom) {
    return {
      x: Math.round(worldX),
      y: Math.round(worldY),
      pose: 'idle',
      roomId: null,
      anchoredFurnitureId: null,
    };
  }

  const roomFurniture = state.furniture.filter((f) => f.roomId === targetRoom!.id);

  if (entityKind === 'fairy') {
    for (const placed of roomFurniture) {
      const cat = FURNITURE_CATALOG.find((c) => c.itemId === placed.itemId);
      if (!cat || !cat.interactionTag) continue;

      const fxMin = placed.x - cat.width * 0.55;
      const fxMax = placed.x + cat.width * 0.55;
      const fyMin =
        cat.placement === 'ceiling'
          ? placed.y
          : placed.y - cat.height - 25;
      const fyMax =
        cat.placement === 'ceiling'
          ? placed.y + cat.height + 20
          : placed.y + 20;

      if (worldX >= fxMin && worldX <= fxMax && worldY >= fyMin && worldY <= fyMax) {
        if (cat.interactionTag === 'bed') {
          return {
            x: placed.x - 6,
            y: placed.y - 26,
            pose: 'sleeping',
            roomId: targetRoom.id,
            anchoredFurnitureId: placed.id,
          };
        }
        if (cat.interactionTag === 'seat') {
          const seatY =
            cat.placement === 'ceiling'
              ? placed.y + cat.height - 22
              : placed.y - 20;
          return {
            x: placed.x,
            y: seatY,
            pose: 'sitting',
            roomId: targetRoom.id,
            anchoredFurnitureId: placed.id,
          };
        }
      }
    }
  }

  const clampedX = Math.max(
    targetRoom.innerLeft + 16,
    Math.min(targetRoom.innerRight - 16, Math.round(worldX))
  );
  return {
    x: clampedX,
    y: targetRoom.floorY,
    pose: 'idle',
    roomId: targetRoom.id,
    anchoredFurnitureId: null,
  };
}

export function areCompanionsPaired(entities: CharacterEntity[], fairyDefId: string): boolean {
  const def = FAIRY_DEFINITIONS.find((f) => f.fairyId === fairyDefId);
  if (!def) return false;
  const fairy = entities.find((e) => e.kind === 'fairy' && e.defId === fairyDefId);
  const pet = entities.find((e) => e.kind === 'pet' && e.defId === def.companionPetId);
  if (!fairy || !pet) return false;
  if (fairy.roomId && fairy.roomId === pet.roomId) return true;
  return Math.hypot(fairy.x - pet.x, fairy.y - pet.y) <= 130;
}

export function calculateCozyScore(state: HouseState): number {
  let score = 0;
  for (const r of state.rooms) {
    score += ROOM_ARCHETYPES[r.type]?.cozyBonus ?? 15;
  }
  for (const f of state.furniture) {
    const cat = FURNITURE_CATALOG.find((c) => c.itemId === f.itemId);
    score += cat ? cat.cozyValue : 10;
  }
  for (const e of state.entities) {
    if (e.kind === 'fairy') {
      score += 10;
      if (e.pose === 'sleeping' || e.pose === 'sitting') {
        score += 15;
      }
      if (areCompanionsPaired(state.entities, e.defId)) {
        score += 20;
      }
    } else {
      score += 8;
    }
  }
  return score;
}

/**
 * Initializes the 3-story connected Dollhouse matching the user's attached reference photo:
 * - Top Floor (Floor 2): Cozy Star Bedroom (left) + Elevator Core (center) + Mint Kitchen (right)
 * - Middle Floor (Floor 1): Floral Garden Room (left) + Elevator & Twin Stair Core (center) + Sunlit Wood Studio (right)
 * - Lower Floor (Floor 0): Central Stair Core (center), with Left & Right bays ready with "+" buttons just like the reference image!
 */
export function initHouse(): HouseState {
  const rooms: BuiltRoom[] = [
    // Middle Floor (floor 1): Garden Room (-1), Elevator & Stairs (0), Sunlit Studio (+1)
    { id: 'room_1_-1', type: 'garden', floor: 1, col: -1, builtAt: 1 },
    { id: 'room_1_0', type: 'elevator', floor: 1, col: 0, builtAt: 2 },
    { id: 'room_1_1', type: 'empty', floor: 1, col: 1, builtAt: 3 },
    // Top Floor under Gable Roof (floor 2): Star Bedroom (-1), Elevator Shaft (0), Mint Kitchen (+1)
    { id: 'room_2_-1', type: 'bedroom', floor: 2, col: -1, builtAt: 4 },
    { id: 'room_2_0', type: 'elevator', floor: 2, col: 0, builtAt: 5 },
    { id: 'room_2_1', type: 'kitchen', floor: 2, col: 1, builtAt: 6 },
    // Lower Floor (floor 0): Central Staircase Core (0) — flanking bays (0,-1) and (0,1) show as unfinished dollhouse bays with "+" buttons!
    { id: 'room_0_0', type: 'stairs', floor: 0, col: 0, builtAt: 7 },
  ];

  const bGarden = computeRoomBounds(rooms[0]);
  const bStudio = computeRoomBounds(rooms[2]);
  const bBedroom = computeRoomBounds(rooms[3]);
  const bKitchen = computeRoomBounds(rooms[5]);

  const furniture: PlacedFurniture[] = [
    // Top-Left Bedroom starter furniture (Sheet 4)
    {
      id: 'furn_bed_1',
      itemId: 'pink_bed',
      roomId: bBedroom.id,
      x: bBedroom.x + 114,
      y: bBedroom.floorY,
    },
    {
      id: 'furn_nightstand_1',
      itemId: 'mushroom_nightstand',
      roomId: bBedroom.id,
      x: bBedroom.x + 228,
      y: bBedroom.floorY,
      toggled: true,
    },
    {
      id: 'furn_dollhouse_1',
      itemId: 'dollhouse_table',
      roomId: bBedroom.id,
      x: bBedroom.x + 298,
      y: bBedroom.floorY,
    },
    // Top-Right Mint Kitchen starter furniture (Sheet 4)
    {
      id: 'furn_oven_1',
      itemId: 'mint_oven',
      roomId: bKitchen.id,
      x: bKitchen.x + 74,
      y: bKitchen.floorY,
      toggled: true,
    },
    {
      id: 'furn_shelf_1',
      itemId: 'kitchen_shelf',
      roomId: bKitchen.id,
      x: bKitchen.x + 178,
      y: bKitchen.y + 68,
    },
    {
      id: 'furn_chair_1',
      itemId: 'dining_chair',
      roomId: bKitchen.id,
      x: bKitchen.x + 132,
      y: bKitchen.floorY,
    },
    {
      id: 'furn_table_1',
      itemId: 'dining_table',
      roomId: bKitchen.id,
      x: bKitchen.x + 186,
      y: bKitchen.floorY,
    },
    {
      id: 'furn_chair_2',
      itemId: 'dining_chair_right',
      roomId: bKitchen.id,
      x: bKitchen.x + 238,
      y: bKitchen.floorY,
    },
    {
      id: 'furn_fridge_1',
      itemId: 'yellow_fridge',
      roomId: bKitchen.id,
      x: bKitchen.x + 298,
      y: bKitchen.floorY,
    },
    // Middle-Left Garden Room starter furniture (Sheet 4)
    {
      id: 'furn_bubble_1',
      itemId: 'bubble_chair',
      roomId: bGarden.id,
      x: bGarden.x + 84,
      y: bGarden.ceilingY,
    },
    {
      id: 'furn_vine_1',
      itemId: 'flower_vine_pot',
      roomId: bGarden.id,
      x: bGarden.x + 188,
      y: bGarden.floorY,
    },
    {
      id: 'furn_fern_1',
      itemId: 'fern_plant',
      roomId: bGarden.id,
      x: bGarden.x + 266,
      y: bGarden.floorY,
    },
    {
      id: 'furn_can_1',
      itemId: 'watering_can',
      roomId: bGarden.id,
      x: bGarden.x + 314,
      y: bGarden.floorY,
    },
    // Middle-Right Sunlit Wood Studio starter furniture (Sheet 4)
    {
      id: 'furn_pink_chair_1',
      itemId: 'pink_chair',
      roomId: bStudio.id,
      x: bStudio.x + 92,
      y: bStudio.floorY,
    },
    {
      id: 'furn_tall_cactus_1',
      itemId: 'tall_cactus',
      roomId: bStudio.id,
      x: bStudio.x + 184,
      y: bStudio.floorY,
    },
    {
      id: 'furn_round_cactus_1',
      itemId: 'round_cactus',
      roomId: bStudio.id,
      x: bStudio.x + 236,
      y: bStudio.floorY,
    },
    {
      id: 'furn_small_leaf_1',
      itemId: 'small_leaf_pot',
      roomId: bStudio.id,
      x: bStudio.x + 292,
      y: bStudio.floorY,
    },
  ];

  const entities: CharacterEntity[] = [
    // Luna sleeping on the Starlight Pink Bed in the Bedroom
    {
      id: 'entity_star_fairy',
      kind: 'fairy',
      defId: 'star_fairy',
      name: 'Luna',
      x: bBedroom.x + 108,
      y: bBedroom.floorY - 26,
      vx: 0,
      vy: 0,
      pose: 'sleeping',
      roomId: bBedroom.id,
      anchoredFurnitureId: 'furn_bed_1',
      facing: 1,
      happyTimer: 0,
    },
    {
      id: 'entity_owl_pet',
      kind: 'pet',
      defId: 'owl_pet',
      name: 'Hootie',
      x: bBedroom.x + 190,
      y: bBedroom.floorY,
      vx: 0,
      vy: 0,
      pose: 'idle',
      roomId: bBedroom.id,
      anchoredFurnitureId: null,
      facing: -1,
      happyTimer: 0,
    },
    // Celeste & Nimbus in the Bedroom
    {
      id: 'entity_ice_fairy',
      kind: 'fairy',
      defId: 'ice_fairy',
      name: 'Celeste',
      x: bBedroom.x + 266,
      y: bBedroom.floorY,
      vx: 0,
      vy: 0,
      pose: 'idle',
      roomId: bBedroom.id,
      anchoredFurnitureId: null,
      facing: -1,
      happyTimer: 0,
    },
    {
      id: 'entity_kitten_pet',
      kind: 'pet',
      defId: 'kitten_pet',
      name: 'Nimbus',
      x: bBedroom.x + 318,
      y: bBedroom.floorY,
      vx: 0,
      vy: 0,
      pose: 'idle',
      roomId: bBedroom.id,
      anchoredFurnitureId: null,
      facing: -1,
      happyTimer: 0,
    },
    // Willow sitting in the Hanging Wicker Egg Chair in the Garden Room
    {
      id: 'entity_leaf_fairy',
      kind: 'fairy',
      defId: 'leaf_fairy',
      name: 'Willow',
      x: bGarden.x + 84,
      y: bGarden.ceilingY + 118 - 22,
      vx: 0,
      vy: 0,
      pose: 'sitting',
      roomId: bGarden.id,
      anchoredFurnitureId: 'furn_bubble_1',
      facing: 1,
      happyTimer: 0,
    },
    {
      id: 'entity_moss_pet',
      kind: 'pet',
      defId: 'moss_pet',
      name: 'Sprout',
      x: bGarden.x + 138,
      y: bGarden.floorY,
      vx: 0,
      vy: 0,
      pose: 'idle',
      roomId: bGarden.id,
      anchoredFurnitureId: null,
      facing: 1,
      happyTimer: 0,
    },
    // Rosalind & Barnaby in the Garden Room
    {
      id: 'entity_rose_fairy',
      kind: 'fairy',
      defId: 'rose_fairy',
      name: 'Rosalind',
      x: bGarden.x + 230,
      y: bGarden.floorY,
      vx: 0,
      vy: 0,
      pose: 'idle',
      roomId: bGarden.id,
      anchoredFurnitureId: null,
      facing: -1,
      happyTimer: 0,
    },
    {
      id: 'entity_bee_pet',
      kind: 'pet',
      defId: 'bee_pet',
      name: 'Barnaby',
      x: bGarden.x + 294,
      y: bGarden.floorY - 14,
      vx: 0,
      vy: 0,
      pose: 'idle',
      roomId: bGarden.id,
      anchoredFurnitureId: null,
      facing: -1,
      happyTimer: 0,
    },
    // Hazel sitting on the Dining Chair in the Mint Kitchen
    {
      id: 'entity_autumn_fairy',
      kind: 'fairy',
      defId: 'autumn_fairy',
      name: 'Hazel',
      x: bKitchen.x + 132,
      y: bKitchen.floorY - 20,
      vx: 0,
      vy: 0,
      pose: 'sitting',
      roomId: bKitchen.id,
      anchoredFurnitureId: 'furn_chair_1',
      facing: 1,
      happyTimer: 0,
    },
    {
      id: 'entity_squirrel_pet',
      kind: 'pet',
      defId: 'squirrel_pet',
      name: 'Pip',
      x: bKitchen.x + 186,
      y: bKitchen.floorY,
      vx: 0,
      vy: 0,
      pose: 'idle',
      roomId: bKitchen.id,
      anchoredFurnitureId: null,
      facing: -1,
      happyTimer: 0,
    },
    // Iris & Clover in the Sunlit Studio Room (Floor 1 Right)
    {
      id: 'entity_rainbow_fairy',
      kind: 'fairy',
      defId: 'rainbow_fairy',
      name: 'Iris',
      x: bStudio.x + 142,
      y: bStudio.floorY,
      vx: 0,
      vy: 0,
      pose: 'idle',
      roomId: bStudio.id,
      anchoredFurnitureId: null,
      facing: 1,
      happyTimer: 0,
    },
    {
      id: 'entity_bunny_pet',
      kind: 'pet',
      defId: 'bunny_pet',
      name: 'Clover',
      x: bStudio.x + 52,
      y: bStudio.floorY,
      vx: 0,
      vy: 0,
      pose: 'idle',
      roomId: bStudio.id,
      anchoredFurnitureId: null,
      facing: 1,
      happyTimer: 0,
    },
  ];

  return { rooms, furniture, entities };
}
