import test from 'node:test';
import assert from 'node:assert/strict';
import {
  initHouse,
  createRoom,
  getBuildableSlots,
  computeRoomBounds,
  snapFurnitureToRoom,
  resolveCharacterPoseOnDrop,
  areCompanionsPaired,
  calculateCozyScore,
  FURNITURE_CATALOG,
} from './rules';

test('initHouse spawns 7 starter rooms, 17 furniture pieces, and all 6 fairies + 6 pets', () => {
  const house = initHouse();
  assert.equal(house.rooms.length, 7);
  assert.equal(house.furniture.length, 17);
  const fairies = house.entities.filter((e) => e.kind === 'fairy');
  const pets = house.entities.filter((e) => e.kind === 'pet');
  assert.equal(fairies.length, 6);
  assert.equal(pets.length, 6);
});

test('getBuildableSlots returns adjacent horizontal and vertical slots without duplicates', () => {
  const house = initHouse();
  const slots = getBuildableSlots(house.rooms);
  // Floor 0 col -1 is empty and adjacent to (0,0) and below (1,-1), so it must be buildable
  const f0cNeg1 = slots.find((s) => s.floor === 0 && s.col === -1);
  assert.ok(f0cNeg1, 'Expected floor 0, col -1 to be a buildable slot');

  // Occupied slots must never appear in buildable slots
  for (const r of house.rooms) {
    const occupiedSlot = slots.find((s) => s.floor === r.floor && s.col === r.col);
    assert.equal(occupiedSlot, undefined);
  }
});

test('createRoom adds a room at an unoccupied slot and rejects duplicate slots', () => {
  const house = initHouse();
  const res1 = createRoom(house, 'garden', 0, -1, 1000);
  assert.ok(res1.created);
  assert.equal(res1.state.rooms.length, 8);

  // Attempting to build on the same slot again fails gracefully
  const res2 = createRoom(res1.state, 'kitchen', 0, -1, 2000);
  assert.equal(res2.created, null);
  assert.equal(res2.state.rooms.length, 8);
});

test('snapFurnitureToRoom snaps floor, wall, and ceiling items to accurate room surfaces', () => {
  const house = initHouse();
  const bedroom = house.rooms.find((r) => r.type === 'bedroom')!;
  const bounds = computeRoomBounds(bedroom);

  const bedItem = FURNITURE_CATALOG.find((i) => i.itemId === 'pink_bed')!;
  const shelfItem = FURNITURE_CATALOG.find((i) => i.itemId === 'kitchen_shelf')!;
  const bubbleChairItem = FURNITURE_CATALOG.find((i) => i.itemId === 'bubble_chair')!;

  const snappedBed = snapFurnitureToRoom(
    house.rooms,
    bedItem,
    bounds.x + bounds.width / 2,
    bounds.y + 80
  );
  assert.ok(snappedBed);
  assert.equal(snappedBed.roomId, bedroom.id);
  assert.equal(snappedBed.y, bounds.floorY);

  const snappedShelf = snapFurnitureToRoom(
    house.rooms,
    shelfItem,
    bounds.x + bounds.width / 2,
    bounds.y + 90
  );
  assert.ok(snappedShelf);
  assert.equal(snappedShelf.y, bounds.y + 90);

  const snappedBubble = snapFurnitureToRoom(
    house.rooms,
    bubbleChairItem,
    bounds.x + bounds.width / 2,
    bounds.y + 120
  );
  assert.ok(snappedBubble);
  assert.equal(snappedBubble.y, bounds.ceilingY);
});

test('resolveCharacterPoseOnDrop sets sleeping on beds, sitting on chairs, and idle on floors', () => {
  const house = initHouse();
  const bed = house.furniture.find((f) => f.itemId === 'pink_bed')!;
  const chair = house.furniture.find((f) => f.itemId === 'dining_chair')!;
  const gardenRoom = computeRoomBounds(house.rooms.find((r) => r.type === 'garden')!);

  // Drop fairy onto bed
  const onBed = resolveCharacterPoseOnDrop(house, 'fairy', bed.x, bed.y - 30);
  assert.equal(onBed.pose, 'sleeping');
  assert.equal(onBed.anchoredFurnitureId, bed.id);

  // Drop fairy onto dining chair
  const onChair = resolveCharacterPoseOnDrop(house, 'fairy', chair.x, chair.y - 25);
  assert.equal(onChair.pose, 'sitting');
  assert.equal(onChair.anchoredFurnitureId, chair.id);

  // Drop fairy on open garden floor
  const onFloor = resolveCharacterPoseOnDrop(
    house,
    'fairy',
    gardenRoom.x + 150,
    gardenRoom.floorY - 10
  );
  assert.equal(onFloor.pose, 'idle');
  assert.equal(onFloor.y, gardenRoom.floorY);
  assert.equal(onFloor.anchoredFurnitureId, null);
});

test('areCompanionsPaired and calculateCozyScore evaluate house state accurately', () => {
  const house = initHouse();
  assert.equal(areCompanionsPaired(house.entities, 'leaf_fairy'), true);
  const initialScore = calculateCozyScore(house);
  assert.ok(initialScore > 300);

  const afterRoom = createRoom(house, 'bedroom', 0, 1, 1234).state;
  const newScore = calculateCozyScore(afterRoom);
  assert.equal(newScore, initialScore + 25);
});
