/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  areCompanionsPaired,
  BuildableSlot,
  calculateCozyScore,
  CharacterEntity,
  computeRoomBounds,
  createRoom,
  FAIRY_DEFINITIONS,
  FLOOR_HEIGHT,
  FURNITURE_CATALOG,
  FurnitureCatalogItem,
  getBuildableSlots,
  HouseState,
  initHouse,
  PET_DEFINITIONS,
  PlacedFurniture,
  resolveCharacterPoseOnDrop,
  ROOM_ARCHETYPES,
  RoomType,
  snapFurnitureToRoom,
} from './game/rules';
import { getAudioMuted, playFx, setAudioMuted } from './game/audio';
import {
  DollhouseRoofAndFrameSvg,
  FurnitureSvg,
  RoomBackdropSvg,
  ScenicHillsBackdropSvg,
  UnbuiltDollhouseBaySvg,
} from './components/RoomAndFurnitureSprites';
import { FairySvg, PetSvg, UiRoundIconSvg } from './components/CharacterAndUiSprites';
import {
  BuildSlotModal,
  CustomizationDrawer,
  DrawerCategory,
  PauseOrCelebrationModal,
  TitleScreenOverlay,
} from './components/DrawerAndModals';
import { OfflineIndicator } from './components/PWAInstallUI';

type GameShellState = 'title' | 'playing' | 'paused' | 'gameover';

interface ActiveDragState {
  kind: 'catalog_furniture' | 'placed_furniture' | 'entity';
  item?: FurnitureCatalogItem;
  placedId?: string;
  entityId?: string;
  clientX: number;
  clientY: number;
  worldX: number;
  worldY: number;
  hasMoved: boolean;
}

interface SparkleBurst {
  id: number;
  x: number;
  y: number;
  color: string;
}

const DEFAULT_CAMERA = { x: 0, y: 82 };

export default function App() {
  const initialAutostart = useMemo(() => {
    if (typeof window === 'undefined') return false;
    const params = new URLSearchParams(window.location.search);
    return params.get('autostart') === '1';
  }, []);

  const [shellState, setShellState] = useState<GameShellState>(
    initialAutostart ? 'playing' : 'title'
  );
  const [house, setHouse] = useState<HouseState>(() => initHouse());
  const [buildMode, setBuildMode] = useState<boolean>(false);
  const [selectedBuildSlot, setSelectedBuildSlot] = useState<BuildableSlot | null>(null);
  const [drawerOpen, setDrawerOpen] = useState<boolean>(true);
  const [drawerCategory, setDrawerCategory] = useState<DrawerCategory>('all');
  const [activeRoomId, setActiveRoomId] = useState<string>('room_2_-1');
  const [muted, setMuted] = useState<boolean>(() => getAudioMuted());
  const [showReferenceSheets, setShowReferenceSheets] = useState<boolean>(false);

  // Camera Pan State (in CSS pixels relative to viewport center)
  const [camera, setCamera] = useState<{ x: number; y: number }>(DEFAULT_CAMERA);
  const isPanningRef = useRef<boolean>(false);
  const panStartRef = useRef<{ clientX: number; clientY: number; camX: number; camY: number }>({
    clientX: 0,
    clientY: 0,
    camX: DEFAULT_CAMERA.x,
    camY: DEFAULT_CAMERA.y,
  });

  const viewportRef = useRef<HTMLDivElement | null>(null);
  const [dragState, setDragState] = useState<ActiveDragState | null>(null);
  const [sparkles, setSparkles] = useState<SparkleBurst[]>([]);

  // Mirror state to document.body.dataset.state
  useEffect(() => {
    document.body.dataset.state = shellState;
  }, [shellState]);

  // Convert screen (clientX, clientY) to Dollhouse World (worldX, worldY)
  const screenToWorld = useCallback(
    (clientX: number, clientY: number) => {
      const rect = viewportRef.current?.getBoundingClientRect();
      const vw = rect ? rect.width : window.innerWidth;
      const vh = rect ? rect.height : window.innerHeight;
      const left = rect ? rect.left : 0;
      const top = rect ? rect.top : 0;
      const originX = vw / 2 + camera.x;
      const originY = vh / 2 + camera.y;
      return {
        worldX: clientX - left - originX,
        worldY: clientY - top - originY,
      };
    },
    [camera.x, camera.y]
  );

  const triggerSparkles = useCallback((worldX: number, worldY: number, color = '#F8DC78') => {
    const id = Date.now() + Math.floor(Math.random() * 1000);
    setSparkles((prev) => [...prev.slice(-10), { id, x: worldX, y: worldY, color }]);
  }, []);

  const handleStartGame = useCallback(() => {
    document.body.dataset.state = 'playing';
    setShellState('playing');
    if (document.activeElement instanceof HTMLElement) {
      document.activeElement.blur();
    }
    playFx('fanfare');
  }, []);

  const handleToggleMute = useCallback(() => {
    const next = !muted;
    setMuted(next);
    setAudioMuted(next);
    if (!next) playFx('menu');
  }, [muted]);

  const handleCenterCamera = useCallback(() => {
    setCamera(DEFAULT_CAMERA);
    playFx('menu');
  }, []);

  const handleResetHouse = useCallback(() => {
    setHouse(initHouse());
    setCamera(DEFAULT_CAMERA);
    setSelectedBuildSlot(null);
    setShellState('playing');
    playFx('build');
  }, []);

  // Build Room Handler
  const handleConstructRoom = useCallback(
    (type: RoomType, floor: number, col: number) => {
      setHouse((prev) => {
        const res = createRoom(prev, type, floor, col);
        if (res.created) {
          const bounds = computeRoomBounds(res.created);
          triggerSparkles(bounds.x + bounds.width / 2, bounds.y + bounds.height / 2, '#BCE879');
          setActiveRoomId(res.created.id);
        }
        return res.state;
      });
      setSelectedBuildSlot(null);
      playFx('build');
    },
    [triggerSparkles]
  );

  // Accessible Click-to-Place Furniture from Drawer
  const handleQuickPlaceFurniture = useCallback(
    (item: FurnitureCatalogItem) => {
      setHouse((prev) => {
        const targetRoom =
          prev.rooms.find((r) => r.id === activeRoomId && !ROOM_ARCHETYPES[r.type].isConnector) ||
          prev.rooms.find((r) => r.type === item.category) ||
          prev.rooms[0];
        if (!targetRoom) return prev;
        const bounds = computeRoomBounds(targetRoom);
        const countInRoom = prev.furniture.filter((f) => f.roomId === targetRoom.id).length;
        const spreadOffset = ((countInRoom % 5) - 2) * 42;
        const dropX = bounds.x + bounds.width / 2 + spreadOffset;
        const dropY =
          item.placement === 'wall'
            ? bounds.y + 82
            : item.placement === 'ceiling'
              ? bounds.ceilingY
              : bounds.floorY;

        const snapped = snapFurnitureToRoom(prev.rooms, item, dropX, dropY);
        if (!snapped) return prev;

        const newPlaced: PlacedFurniture = {
          id: `furn_${item.itemId}_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`,
          itemId: item.itemId,
          roomId: snapped.roomId,
          x: snapped.x,
          y: snapped.y,
          toggled: true,
        };
        triggerSparkles(snapped.x, snapped.y - 24, '#F7A8D0');
        playFx('boop');
        return {
          ...prev,
          furniture: [...prev.furniture, newPlaced],
        };
      });
    },
    [activeRoomId, triggerSparkles]
  );

  // Start dragging a new catalog furniture item from the drawer
  const handleStartCatalogDrag = useCallback(
    (item: FurnitureCatalogItem, e: React.PointerEvent) => {
      if (e.button !== 0 && e.pointerType === 'mouse') return;
      const { worldX, worldY } = screenToWorld(e.clientX, e.clientY);
      setDragState({
        kind: 'catalog_furniture',
        item,
        clientX: e.clientX,
        clientY: e.clientY,
        worldX,
        worldY,
        hasMoved: false,
      });
      playFx('pop');
    },
    [screenToWorld]
  );

  // Start dragging an existing placed furniture item inside a room
  const handleStartPlacedFurnitureDrag = useCallback(
    (placed: PlacedFurniture, e: React.PointerEvent) => {
      e.stopPropagation();
      const cat = FURNITURE_CATALOG.find((c) => c.itemId === placed.itemId);
      if (!cat) return;
      const { worldX, worldY } = screenToWorld(e.clientX, e.clientY);
      setActiveRoomId(placed.roomId);
      setDragState({
        kind: 'placed_furniture',
        item: cat,
        placedId: placed.id,
        clientX: e.clientX,
        clientY: e.clientY,
        worldX,
        worldY,
        hasMoved: false,
      });
      playFx('pop');
    },
    [screenToWorld]
  );

  // Start dragging a Fairy or Magical Pet
  const handleStartEntityDrag = useCallback(
    (entity: CharacterEntity, e: React.PointerEvent) => {
      e.stopPropagation();
      const { worldX, worldY } = screenToWorld(e.clientX, e.clientY);
      if (entity.roomId) setActiveRoomId(entity.roomId);
      setHouse((prev) => ({
        ...prev,
        entities: prev.entities.map((ent) =>
          ent.id === entity.id
            ? { ...ent, pose: 'dangling', anchoredFurnitureId: null }
            : ent
        ),
      }));
      setDragState({
        kind: 'entity',
        entityId: entity.id,
        clientX: e.clientX,
        clientY: e.clientY,
        worldX,
        worldY,
        hasMoved: false,
      });
      playFx('pop');
    },
    [screenToWorld]
  );

  // Summon or drag a Fairy/Pet from the bottom drawer
  const handleFocusOrSummonEntity = useCallback(
    (kind: 'fairy' | 'pet', defId: string, e: React.PointerEvent) => {
      const entity = house.entities.find((ent) => ent.kind === kind && ent.defId === defId);
      if (!entity) return;
      const { worldX, worldY } = screenToWorld(e.clientX, e.clientY);
      setHouse((prev) => ({
        ...prev,
        entities: prev.entities.map((ent) =>
          ent.id === entity.id
            ? { ...ent, pose: 'dangling', x: worldX, y: worldY, anchoredFurnitureId: null }
            : ent
        ),
      }));
      setDragState({
        kind: 'entity',
        entityId: entity.id,
        clientX: e.clientX,
        clientY: e.clientY,
        worldX,
        worldY,
        hasMoved: true,
      });
      playFx('pop');
    },
    [house.entities, screenToWorld]
  );

  // Check if pointer is over the bottom trash/store zone
  const isPointerOverTrash = useMemo(() => {
    if (!dragState || dragState.kind !== 'placed_furniture') return false;
    const vh = typeof window !== 'undefined' ? window.innerHeight : 900;
    return dragState.clientY > vh - (drawerOpen ? 195 : 90);
  }, [dragState, drawerOpen]);

  // Unified Pointer Move / Pointer Up listeners for smooth dragging & camera panning
  useEffect(() => {
    const handlePointerMove = (e: PointerEvent) => {
      if (dragState) {
        const { worldX, worldY } = screenToWorld(e.clientX, e.clientY);
        const dist = Math.hypot(e.clientX - dragState.clientX, e.clientY - dragState.clientY);
        setDragState((prev) =>
          prev
            ? {
                ...prev,
                clientX: e.clientX,
                clientY: e.clientY,
                worldX,
                worldY,
                hasMoved: prev.hasMoved || dist > 5,
              }
            : null
        );
        return;
      }

      if (isPanningRef.current) {
        const dx = e.clientX - panStartRef.current.clientX;
        const dy = e.clientY - panStartRef.current.clientY;
        setCamera({
          x: Math.max(-720, Math.min(720, panStartRef.current.camX + dx)),
          y: Math.max(-220, Math.min(680, panStartRef.current.camY + dy)),
        });
      }
    };

    const handlePointerUp = (e: PointerEvent) => {
      if (isPanningRef.current) {
        isPanningRef.current = false;
      }

      if (!dragState) return;
      const { worldX, worldY } = screenToWorld(e.clientX, e.clientY);

      if (dragState.kind === 'catalog_furniture' && dragState.item) {
        if (dragState.hasMoved) {
          const item = dragState.item;
          setHouse((prev) => {
            const snapped = snapFurnitureToRoom(prev.rooms, item, worldX, worldY);
            if (!snapped) return prev;
            setActiveRoomId(snapped.roomId);
            triggerSparkles(snapped.x, snapped.y - 24, '#F7A8D0');
            playFx('boop');
            return {
              ...prev,
              furniture: [
                ...prev.furniture,
                {
                  id: `furn_${item.itemId}_${Date.now()}`,
                  itemId: item.itemId,
                  roomId: snapped.roomId,
                  x: snapped.x,
                  y: snapped.y,
                  toggled: true,
                },
              ],
            };
          });
        }
      } else if (dragState.kind === 'placed_furniture' && dragState.placedId && dragState.item) {
        const vh = window.innerHeight;
        const overTrash = e.clientY > vh - (drawerOpen ? 195 : 90);
        const placedId = dragState.placedId;
        const item = dragState.item;

        if (!dragState.hasMoved) {
          if (item.interactionTag === 'toggle') {
            setHouse((prev) => ({
              ...prev,
              furniture: prev.furniture.map((f) =>
                f.id === placedId ? { ...f, toggled: !f.toggled } : f
              ),
            }));
            playFx('chime');
          }
        } else if (overTrash) {
          setHouse((prev) => ({
            ...prev,
            furniture: prev.furniture.filter((f) => f.id !== placedId),
            entities: prev.entities.map((ent) =>
              ent.anchoredFurnitureId === placedId
                ? { ...ent, pose: 'idle', anchoredFurnitureId: null }
                : ent
            ),
          }));
          playFx('trash');
        } else {
          setHouse((prev) => {
            const snapped = snapFurnitureToRoom(prev.rooms, item, worldX, worldY);
            if (!snapped) return prev;
            setActiveRoomId(snapped.roomId);
            triggerSparkles(snapped.x, snapped.y - 20, '#9ED9C8');
            playFx('boop');
            return {
              ...prev,
              furniture: prev.furniture.map((f) =>
                f.id === placedId
                  ? { ...f, roomId: snapped.roomId, x: snapped.x, y: snapped.y }
                  : f
              ),
            };
          });
        }
      } else if (dragState.kind === 'entity' && dragState.entityId) {
        const entityId = dragState.entityId;
        setHouse((prev) => {
          const targetEntity = prev.entities.find((ent) => ent.id === entityId);
          if (!targetEntity) return prev;

          const resolved = resolveCharacterPoseOnDrop(
            prev,
            targetEntity.kind,
            worldX,
            worldY
          );

          if (resolved.roomId) setActiveRoomId(resolved.roomId);

          if (resolved.pose === 'sleeping') {
            playFx('sleep');
            triggerSparkles(resolved.x, resolved.y - 30, '#C7B2F5');
          } else if (resolved.pose === 'sitting') {
            playFx('sit');
            triggerSparkles(resolved.x, resolved.y - 25, '#F8B4D0');
          } else if (targetEntity.kind === 'pet') {
            playFx('pet');
            triggerSparkles(resolved.x, resolved.y - 20, '#BCE879');
          } else {
            playFx('boop');
          }

          return {
            ...prev,
            entities: prev.entities.map((ent) =>
              ent.id === entityId
                ? {
                    ...ent,
                    x: resolved.x,
                    y: resolved.y,
                    pose: resolved.pose,
                    roomId: resolved.roomId,
                    anchoredFurnitureId: resolved.anchoredFurnitureId,
                  }
                : ent
            ),
          };
        });
      }

      setDragState(null);
    };

    window.addEventListener('pointermove', handlePointerMove);
    window.addEventListener('pointerup', handlePointerUp);
    return () => {
      window.removeEventListener('pointermove', handlePointerMove);
      window.removeEventListener('pointerup', handlePointerUp);
    };
  }, [dragState, drawerOpen, screenToWorld, triggerSparkles]);

  // Keyboard shortcuts & focus-loss hygiene
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (shellState === 'title') {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          handleStartGame();
        }
        return;
      }

      if (e.key === 'Escape' || e.key === 'p' || e.key === 'P') {
        e.preventDefault();
        setSelectedBuildSlot(null);
        setShellState((prev) => (prev === 'playing' ? 'paused' : 'playing'));
        playFx('menu');
      } else if (shellState === 'playing') {
        if (e.key === 'b' || e.key === 'B') {
          setBuildMode((prev) => !prev);
          playFx('menu');
        } else if (e.key === 'd' || e.key === 'D') {
          setDrawerOpen((prev) => !prev);
          playFx('menu');
        } else if (e.key === 'm' || e.key === 'M') {
          handleToggleMute();
        } else if (e.key === 'h' || e.key === 'H') {
          handleCenterCamera();
        } else if (e.key === 'r' || e.key === 'R') {
          handleResetHouse();
        } else if (e.key === 'ArrowLeft' || e.key === 'a' || e.key === 'A') {
          setCamera((c) => ({ ...c, x: Math.min(720, c.x + 48) }));
        } else if (e.key === 'ArrowRight') {
          setCamera((c) => ({ ...c, x: Math.max(-720, c.x - 48) }));
        } else if (e.key === 'ArrowUp' || e.key === 'w' || e.key === 'W') {
          setCamera((c) => ({ ...c, y: Math.min(680, c.y + 48) }));
        } else if (e.key === 'ArrowDown' || e.key === 's' || e.key === 'S') {
          setCamera((c) => ({ ...c, y: Math.max(-220, c.y - 48) }));
        }
      }
    };

    const handleBlur = () => {
      isPanningRef.current = false;
      setDragState(null);
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('blur', handleBlur);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('blur', handleBlur);
    };
  }, [
    shellState,
    handleStartGame,
    handleToggleMute,
    handleCenterCamera,
    handleResetHouse,
  ]);

  // Expose required modular functions on window for inspection & scripting
  useEffect(() => {
    const win = window as unknown as Record<string, unknown>;
    win.initHouse = initHouse;
    win.createRoom = (type: RoomType, floor: number, col: number) =>
      handleConstructRoom(type, floor, col);
    win.spawnEntity = (kind: 'fairy' | 'pet', defId: string, worldX: number, worldY: number) => {
      setHouse((prev) => {
        const resolved = resolveCharacterPoseOnDrop(prev, kind, worldX, worldY);
        return {
          ...prev,
          entities: prev.entities.map((e) =>
            e.kind === kind && e.defId === defId
              ? { ...e, x: resolved.x, y: resolved.y, pose: resolved.pose, roomId: resolved.roomId }
              : e
          ),
        };
      });
    };
    win.initDragAndDrop = () => true;
    win.playFx = playFx;
  }, [handleConstructRoom]);

  const buildableSlots = useMemo(() => getBuildableSlots(house.rooms), [house.rooms]);
  const cozyScore = useMemo(() => calculateCozyScore(house), [house]);

  // Compute connected Dollhouse structural bounding box so the Gable Roof and outer timber posts wrap the house
  const dollhouseFrameBounds = useMemo(() => {
    let minCol = -1;
    let maxCol = 1;
    let maxFloor = 0;
    for (const r of house.rooms) {
      if (r.col < minCol) minCol = r.col;
      if (r.col > maxCol) maxCol = r.col;
      if (r.floor > maxFloor) maxFloor = r.floor;
    }
    const leftEdgeBounds = computeRoomBounds({ col: minCol, floor: 0, type: 'bedroom' });
    const rightEdgeBounds = computeRoomBounds({ col: maxCol, floor: 0, type: 'bedroom' });
    const topEdgeBounds = computeRoomBounds({ col: 0, floor: maxFloor, type: 'elevator' });
    const bottomEdgeBounds = computeRoomBounds({ col: 0, floor: 0, type: 'elevator' });

    return {
      minCol,
      maxCol,
      maxFloor,
      houseLeft: leftEdgeBounds.x,
      houseRight: rightEdgeBounds.x + rightEdgeBounds.width,
      houseTop: topEdgeBounds.y,
      houseBottom: bottomEdgeBounds.y + bottomEdgeBounds.height,
    };
  }, [house.rooms]);

  // Always show unbuilt bays that sit inside the current dollhouse footprint (like the bottom floor bays in the reference image),
  // and show outer/upper expansion slots when Build Mode [B] is toggled.
  const visibleBuildableSlots = useMemo(() => {
    return buildableSlots.filter((slot) => {
      const isInsideDollhouseFootprint =
        slot.floor <= dollhouseFrameBounds.maxFloor &&
        slot.col >= dollhouseFrameBounds.minCol &&
        slot.col <= dollhouseFrameBounds.maxCol;
      return isInsideDollhouseFootprint || buildMode;
    });
  }, [buildableSlots, dollhouseFrameBounds, buildMode]);

  // Snap preview when dragging furniture
  const dragSnapPreview = useMemo(() => {
    if (
      !dragState ||
      (dragState.kind !== 'catalog_furniture' && dragState.kind !== 'placed_furniture') ||
      !dragState.item
    ) {
      return null;
    }
    return snapFurnitureToRoom(
      house.rooms,
      dragState.item,
      dragState.worldX,
      dragState.worldY
    );
  }, [dragState, house.rooms]);

  // Separate wall/ceiling decor (Layer 2) from floor furniture (Layer 3)
  const { wallAndCeilingItems, floorItems } = useMemo(() => {
    const wallAndCeiling: { placed: PlacedFurniture; cat: FurnitureCatalogItem }[] = [];
    const floor: { placed: PlacedFurniture; cat: FurnitureCatalogItem }[] = [];
    for (const placed of house.furniture) {
      if (dragState?.kind === 'placed_furniture' && dragState.placedId === placed.id && dragState.hasMoved) {
        continue;
      }
      const cat = FURNITURE_CATALOG.find((c) => c.itemId === placed.itemId);
      if (!cat) continue;
      if (cat.placement === 'wall' || cat.placement === 'ceiling') {
        wallAndCeiling.push({ placed, cat });
      } else {
        floor.push({ placed, cat });
      }
    }
    return { wallAndCeilingItems: wallAndCeiling, floorItems: floor };
  }, [house.furniture, dragState]);

  return (
    <main className="relative w-screen h-screen overflow-hidden select-none bg-[#D9F1F6]">
      {/* LAYER 0: Scenic Pastel Rolling Hills, Trees & Clouds Backdrop matching image_53107f52.png */}
      <ScenicHillsBackdropSvg cameraX={camera.x} cameraY={camera.y} />

      {/* Interactive Pannable Dollhouse Viewport */}
      <div
        ref={viewportRef}
        data-testid="dollhouse-viewport"
        onPointerDown={(e) => {
          if (e.button !== 0 && e.pointerType === 'mouse') return;
          isPanningRef.current = true;
          panStartRef.current = {
            clientX: e.clientX,
            clientY: e.clientY,
            camX: camera.x,
            camY: camera.y,
          };
        }}
        onWheel={(e) => {
          setCamera((prev) => ({
            x: Math.max(-720, Math.min(720, prev.x - e.deltaX * 0.7)),
            y: Math.max(-220, Math.min(680, prev.y - e.deltaY * 0.7)),
          }));
        }}
        className="relative w-full h-full cursor-grab active:cursor-grabbing"
      >
        {/* World Origin Container */}
        <div
          className="absolute left-1/2 top-1/2 pointer-events-none transition-transform duration-300 ease-out"
          style={{
            transform: `translate3d(${Math.round(
              shellState === 'title' ? camera.x + 210 : camera.x
            )}px, ${Math.round(
              shellState === 'title' ? camera.y + 24 : camera.y
            )}px, 0)`,
          }}
        >
          {/* LAYER 1: Connected Dollhouse Rooms, Unbuilt Bays & Pitched Wooden Gable Roof */}
          <div className="relative z-10">
            {/* Unbuilt Dollhouse Bays (with round '+' build buttons inside, matching reference photo) */}
            {visibleBuildableSlots.map((slot) => {
              const isInsideFootprint =
                slot.floor <= dollhouseFrameBounds.maxFloor &&
                slot.col >= dollhouseFrameBounds.minCol &&
                slot.col <= dollhouseFrameBounds.maxCol;
              const bayStyle =
                slot.col === 0
                  ? 'shaft'
                  : slot.col < 0
                    ? 'stone_brick'
                    : 'concrete_wood';
              return (
                <div
                  key={slot.key}
                  style={{
                    left: `${slot.x}px`,
                    top: `${slot.y}px`,
                    width: `${slot.width}px`,
                    height: `${slot.height}px`,
                  }}
                  className="absolute pointer-events-auto"
                >
                  {isInsideFootprint ? (
                    <div className="relative w-full h-full">
                      <UnbuiltDollhouseBaySvg
                        width={slot.width}
                        height={slot.height}
                        bayStyle={bayStyle}
                      />
                      {/* Interactive Round "+" Button(s) centered in each unfinished dollhouse sub-bay */}
                      <div className="absolute inset-0 flex items-center justify-around px-4">
                        <button
                          type="button"
                          aria-label={`Build room at Floor ${slot.floor + 1}, Column ${slot.col}`}
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedBuildSlot(slot);
                            playFx('menu');
                          }}
                          className="group rounded-full transition-transform hover:scale-110 active:scale-95 cursor-pointer drop-shadow-[0_3px_0_rgba(35,31,32,0.45)]"
                          title={`Build Room Module at Floor ${slot.floor + 1}`}
                        >
                          <UiRoundIconSvg kind="plus" size={44} />
                        </button>
                        {slot.width > 240 && (
                          <button
                            type="button"
                            tabIndex={-1}
                            aria-hidden="true"
                            onClick={(e) => {
                              e.stopPropagation();
                              setSelectedBuildSlot(slot);
                              playFx('menu');
                            }}
                            className="group rounded-full transition-transform hover:scale-110 active:scale-95 cursor-pointer drop-shadow-[0_3px_0_rgba(35,31,32,0.45)]"
                            title={`Build Room Module at Floor ${slot.floor + 1}`}
                          >
                            <UiRoundIconSvg kind="plus" size={44} />
                          </button>
                        )}
                      </div>
                    </div>
                  ) : (
                    <div className="w-full h-full p-2 flex items-center justify-center">
                      <button
                        type="button"
                        aria-label={`Build room at Floor ${slot.floor + 1}, Column ${slot.col}`}
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedBuildSlot(slot);
                          playFx('menu');
                        }}
                        className="group w-full h-full rounded-2xl border-[3.5px] border-dashed border-[#231F20] bg-[#FFF7ED]/85 hover:bg-[#FCE1EB]/95 flex flex-col items-center justify-center gap-2 transition-transform hover:scale-[1.02] active:scale-95 cursor-pointer"
                      >
                        <UiRoundIconSvg kind="plus" size={46} />
                        <span className="font-display font-bold text-xs text-[#231F20] px-2.5 py-1 rounded-lg bg-[#FFFDF9] border-2 border-[#231F20] whitespace-nowrap">
                          {slot.suggestedConnector ? 'Build Shaft / Room' : `Expand Floor ${slot.floor + 1}`}
                        </span>
                      </button>
                    </div>
                  )}
                </div>
              );
            })}

            {/* Built Dollhouse Room Modules */}
            {house.rooms.map((room) => {
              const bounds = computeRoomBounds(room);
              const isSelected = activeRoomId === room.id;
              return (
                <div
                  key={room.id}
                  onPointerDown={(e) => {
                    setActiveRoomId(room.id);
                    isPanningRef.current = true;
                    panStartRef.current = {
                      clientX: e.clientX,
                      clientY: e.clientY,
                      camX: camera.x,
                      camY: camera.y,
                    };
                  }}
                  className={`absolute pointer-events-auto animate-room-pop ${
                    isSelected ? 'ring-2 ring-[#F48FB1]/50' : ''
                  }`}
                  style={{
                    left: `${bounds.x}px`,
                    top: `${bounds.y}px`,
                    width: `${bounds.width}px`,
                    height: `${bounds.height}px`,
                  }}
                >
                  <RoomBackdropSvg
                    type={room.type}
                    width={bounds.width}
                    height={bounds.height}
                    floor={room.floor}
                  />
                </div>
              );
            })}

            {/* Pitched Wooden Gable Roof & Outer Dollhouse Timber Posts */}
            <DollhouseRoofAndFrameSvg
              houseLeft={dollhouseFrameBounds.houseLeft}
              houseRight={dollhouseFrameBounds.houseRight}
              houseTop={dollhouseFrameBounds.houseTop}
              houseBottom={dollhouseFrameBounds.houseBottom}
            />
          </div>

          {/* LAYER 2: Wall & Ceiling Decor */}
          <div className="relative z-20">
            {wallAndCeilingItems.map(({ placed, cat }) => {
              const topPos =
                cat.placement === 'ceiling'
                  ? placed.y
                  : placed.y - cat.height / 2;
              return (
                <div
                  key={placed.id}
                  onPointerDown={(e) => handleStartPlacedFurnitureDrag(placed, e)}
                  style={{
                    left: `${placed.x - cat.width / 2}px`,
                    top: `${topPos}px`,
                    width: `${cat.width}px`,
                    height: `${cat.height}px`,
                  }}
                  className="absolute pointer-events-auto cursor-grab active:cursor-grabbing hover:scale-[1.03] transition-transform"
                  title={`${cat.name} (Drag to move)`}
                >
                  <FurnitureSvg itemId={placed.itemId} toggled={placed.toggled} />
                </div>
              );
            })}
          </div>

          {/* LAYER 3: Floor Furniture & Snap Ghost Preview */}
          <div className="relative z-30">
            {dragSnapPreview && dragState?.item && (
              <div
                style={{
                  left: `${dragSnapPreview.x - dragState.item.width / 2}px`,
                  top: `${
                    dragState.item.placement === 'ceiling'
                      ? dragSnapPreview.y
                      : dragState.item.placement === 'wall'
                        ? dragSnapPreview.y - dragState.item.height / 2
                        : dragSnapPreview.y - dragState.item.height
                  }px`,
                  width: `${dragState.item.width}px`,
                  height: `${dragState.item.height}px`,
                }}
                className="absolute opacity-45 pointer-events-none scale-105"
              >
                <FurnitureSvg itemId={dragState.item.itemId} toggled={true} />
              </div>
            )}

            {floorItems.map(({ placed, cat }) => (
              <div
                key={placed.id}
                onPointerDown={(e) => handleStartPlacedFurnitureDrag(placed, e)}
                style={{
                  left: `${placed.x - cat.width / 2}px`,
                  top: `${placed.y - cat.height}px`,
                  width: `${cat.width}px`,
                  height: `${cat.height}px`,
                }}
                className="absolute pointer-events-auto cursor-grab active:cursor-grabbing hover:scale-[1.03] transition-transform"
                title={`${cat.name} (Drag to move, click to interact)`}
              >
                <FurnitureSvg itemId={placed.itemId} toggled={placed.toggled} />
              </div>
            ))}
          </div>

          {/* LAYER 4: Characters (6 Fairies) & Magical Companion Pets (6 Pets) */}
          <div className="relative z-40">
            {house.entities.map((entity) => {
              const isBeingDragged =
                dragState?.kind === 'entity' && dragState.entityId === entity.id;
              if (isBeingDragged) return null;

              const w = entity.kind === 'fairy' ? 76 : 54;
              const h = entity.kind === 'fairy' ? 88 : 54;
              const isPaired =
                entity.kind === 'fairy' &&
                areCompanionsPaired(house.entities, entity.defId);

              return (
                <div
                  key={entity.id}
                  data-testid={`entity-${entity.defId}`}
                  data-pose={entity.pose}
                  onPointerDown={(e) => handleStartEntityDrag(entity, e)}
                  style={{
                    left: `${entity.x - w / 2}px`,
                    top: `${entity.y - h}px`,
                    width: `${w}px`,
                    height: `${h}px`,
                  }}
                  className={`absolute pointer-events-auto cursor-grab active:cursor-grabbing ${
                    entity.pose === 'idle' ? 'animate-fairy-idle' : ''
                  }`}
                  title={`${entity.name} (${entity.pose}) — Drag to move!`}
                >
                  {/* Animated Zzz Bubbles when Fairy is Sleeping on a Bed */}
                  {entity.pose === 'sleeping' && (
                    <div
                      className="absolute -top-7 right-0 pointer-events-none font-display font-bold text-[#4A2E80]"
                      style={{ textShadow: '0 2px 0 #FFFFFF, 0 -1px 0 #FFFFFF, 2px 0 0 #FFFFFF, -2px 0 0 #FFFFFF' }}
                    >
                      <span className="absolute right-5 top-2 text-xs animate-zzz-1">z</span>
                      <span className="absolute right-1 -top-1 text-sm animate-zzz-2">Z</span>
                      <span className="absolute -right-3 -top-4 text-base animate-zzz-3">Z</span>
                    </div>
                  )}

                  {/* Companion Bond Heart Badge when paired with magical pet */}
                  {isPaired && entity.pose !== 'sleeping' && (
                    <div
                      className="absolute -top-3 left-1/2 -translate-x-1/2 pointer-events-none text-xs font-bold text-[#E95B8B]"
                      aria-hidden="true"
                    >
                      ♥
                    </div>
                  )}

                  <div
                    className={
                      entity.pose === 'sleeping'
                        ? 'w-full h-full -rotate-[68deg] translate-y-2'
                        : 'w-full h-full'
                    }
                  >
                    {entity.kind === 'fairy' ? (
                      <FairySvg fairyId={entity.defId} pose={entity.pose} />
                    ) : (
                      <PetSvg petId={entity.defId} />
                    )}
                  </div>
                </div>
              );
            })}

            {/* Sparkle Particle Bursts */}
            {sparkles.map((sp) => (
              <div
                key={sp.id}
                style={{ left: `${sp.x}px`, top: `${sp.y}px` }}
                className="absolute pointer-events-none"
              >
                {[
                  ['-18px', '-22px'],
                  ['18px', '-20px'],
                  ['0px', '-30px'],
                  ['-14px', '10px'],
                  ['14px', '12px'],
                ].map(([tx, ty], idx) => (
                  <span
                    key={idx}
                    style={
                      {
                        '--tx': tx,
                        '--ty': ty,
                        backgroundColor: sp.color,
                        animation: 'sparkleBurst 0.55s ease-out forwards',
                      } as React.CSSProperties
                    }
                    className="absolute w-2.5 h-2.5 rounded-full border border-[#231F20]"
                  />
                ))}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* LAYER 5: Active Dragged Item or Ragdoll Dangling Character */}
      {dragState && (
        <div
          style={{
            left: `${dragState.clientX}px`,
            top: `${dragState.clientY}px`,
            transform: 'translate(-50%, -55%) scale(1.12)',
          }}
          className="fixed z-50 pointer-events-none drop-shadow-[0_14px_10px_rgba(35,31,32,0.28)]"
        >
          {dragState.kind === 'entity' && dragState.entityId ? (
            (() => {
              const ent = house.entities.find((e) => e.id === dragState.entityId);
              if (!ent) return null;
              return (
                <div
                  className={`animate-dangle ${
                    ent.kind === 'fairy' ? 'w-20 h-24' : 'w-14 h-14'
                  }`}
                >
                  {ent.kind === 'fairy' ? (
                    <FairySvg fairyId={ent.defId} pose="dangling" />
                  ) : (
                    <PetSvg petId={ent.defId} />
                  )}
                </div>
              );
            })()
          ) : dragState.item ? (
            <div
              style={{
                width: `${dragState.item.width}px`,
                height: `${dragState.item.height}px`,
              }}
              className="animate-dangle"
            >
              <FurnitureSvg itemId={dragState.item.itemId} toggled={true} />
            </div>
          ) : null}
        </div>
      )}

      {/* LAYER 6: World-Matched Low-Occlusion Perimeter HUD */}
      {shellState === 'playing' && (
        <div className="fixed inset-0 z-30 pointer-events-none">
          {/* Top Perimeter Bar: Left Stat Cluster + Right Round Action Buttons */}
          <div className="flex items-start justify-between gap-4 p-4">
            {/* Top-Left World-Matched Dollhouse Stat Plaque */}
            <div className="pointer-events-auto flex items-center gap-4 px-4 py-2 rounded-2xl bg-[#FFF7ED] border-[3px] border-[#231F20] shadow-[0_4px_0_#231F20]">
              <div>
                <div className="text-[10px] font-extrabold uppercase tracking-wider text-[#7A526C]">
                  COZY SCORE
                </div>
                <div
                  data-testid="hud-cozy-score"
                  className="text-xl font-display font-bold text-[#231F20] tabular-nums leading-tight"
                >
                  {Math.round(cozyScore)}
                </div>
              </div>
              <div className="h-7 w-[2px] bg-[#231F20]/15" />
              <div>
                <div className="text-[10px] font-extrabold uppercase tracking-wider text-[#5A7B44]">
                  ROOMS
                </div>
                <div
                  data-testid="hud-rooms-count"
                  className="text-xl font-display font-bold text-[#231F20] tabular-nums leading-tight"
                >
                  {house.rooms.length}
                </div>
              </div>
              <div className="h-7 w-[2px] bg-[#231F20]/15" />
              <div>
                <div className="text-[10px] font-extrabold uppercase tracking-wider text-[#8C5E47]">
                  DECOR
                </div>
                <div
                  data-testid="hud-decor-count"
                  className="text-xl font-display font-bold text-[#231F20] tabular-nums leading-tight"
                >
                  {house.furniture.length}
                </div>
              </div>
              <div className="hidden sm:block h-7 w-[2px] bg-[#231F20]/15" />
              <div className="hidden sm:block">
                <div className="text-[10px] font-extrabold uppercase tracking-wider text-[#487594]">
                  FAIRIES &amp; PETS
                </div>
                <div className="text-xl font-display font-bold text-[#231F20] tabular-nums leading-tight">
                  {house.entities.length}
                </div>
              </div>
            </div>

            {/* Top-Right Round Cartoon Buttons (matching Sheet 4 UI icons) */}
            <div className="pointer-events-auto flex items-center gap-2">
              <button
                type="button"
                aria-label={buildMode ? 'Exit Build Mode' : 'Enter Build Mode'}
                aria-pressed={buildMode}
                onClick={(e) => {
                  e.currentTarget.blur();
                  setBuildMode((b) => !b);
                  playFx('menu');
                }}
                className={`flex items-center gap-2 pr-3.5 pl-1.5 py-1 rounded-full border-[3px] border-[#231F20] shadow-[0_4px_0_#231F20] transition-transform active:translate-y-0.5 cursor-pointer whitespace-nowrap shrink-0 ${
                  buildMode ? 'bg-[#BCE879]' : 'bg-[#FFF7ED] hover:bg-[#FCE1D8]'
                }`}
              >
                <UiRoundIconSvg kind={buildMode ? 'hammer' : 'plus'} size={34} />
                <span className="font-display font-bold text-xs text-[#231F20]">
                  {buildMode ? 'Done Building [B]' : 'Expand House [B]'}
                </span>
              </button>

              <button
                type="button"
                tabIndex={-1}
                aria-label="Center Camera"
                title="Center Dollhouse [H]"
                onClick={(e) => {
                  e.currentTarget.blur();
                  handleCenterCamera();
                }}
                className="rounded-full transition-transform hover:scale-105 active:scale-95 cursor-pointer shrink-0"
              >
                <UiRoundIconSvg kind="home" size={42} />
              </button>

              <button
                type="button"
                tabIndex={-1}
                aria-label={muted ? 'Unmute Sound Effects' : 'Mute Sound Effects'}
                title="Toggle Sound [M]"
                onClick={(e) => {
                  e.currentTarget.blur();
                  handleToggleMute();
                }}
                className="rounded-full transition-transform hover:scale-105 active:scale-95 cursor-pointer shrink-0"
              >
                <UiRoundIconSvg kind={muted ? 'sound_off' : 'sound_on'} size={42} />
              </button>

              <button
                type="button"
                tabIndex={-1}
                aria-label="Pause and Settings"
                title="Pause / Options [P]"
                onClick={(e) => {
                  e.currentTarget.blur();
                  setShellState('paused');
                  playFx('menu');
                }}
                className="rounded-full transition-transform hover:scale-105 active:scale-95 cursor-pointer shrink-0"
              >
                <UiRoundIconSvg kind="gear" size={42} />
              </button>
            </div>
          </div>

          {/* Bottom Collapsible Furniture & Character Sandbox Drawer */}
          <CustomizationDrawer
            isOpen={drawerOpen}
            onToggleOpen={() => {
              setDrawerOpen((o) => !o);
              playFx('menu');
            }}
            category={drawerCategory}
            onSelectCategory={(cat) => {
              setDrawerCategory(cat);
              playFx('menu');
            }}
            house={house}
            isDraggingPlacedItem={
              dragState?.kind === 'placed_furniture' && dragState.hasMoved
            }
            isOverTrash={isPointerOverTrash}
            onStartCatalogDrag={handleStartCatalogDrag}
            onQuickPlaceFurniture={handleQuickPlaceFurniture}
            onFocusOrSummonEntity={handleFocusOrSummonEntity}
          />
        </div>
      )}

      {/* Room Archetype Construction Modal when a "+" Slot is clicked */}
      {selectedBuildSlot && (
        <BuildSlotModal
          slot={selectedBuildSlot}
          onSelectArchetype={(type) =>
            handleConstructRoom(type, selectedBuildSlot.floor, selectedBuildSlot.col)
          }
          onClose={() => setSelectedBuildSlot(null)}
        />
      )}

      {/* Title Screen Overlay */}
      {shellState === 'title' && <TitleScreenOverlay onStartGame={handleStartGame} />}

      {/* Pause / Showcase Modal */}
      {(shellState === 'paused' || shellState === 'gameover') && (
        <PauseOrCelebrationModal
          mode={shellState}
          house={house}
          cozyScore={cozyScore}
          showReferenceSheets={showReferenceSheets}
          onToggleReferenceSheets={() => setShowReferenceSheets((s) => !s)}
          onResume={() => {
            setShellState('playing');
            playFx('menu');
          }}
          onResetHouse={handleResetHouse}
          onReturnTitle={() => {
            setShellState('title');
            playFx('menu');
          }}
        />
      )}
      {/* Offline Mode Connectivity Banner */}
      <OfflineIndicator />
    </main>
  );
}
