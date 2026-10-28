import React from 'react';
import {
  BuildableSlot,
  FAIRY_DEFINITIONS,
  FURNITURE_CATALOG,
  FurnitureCatalogItem,
  HouseState,
  PET_DEFINITIONS,
  ROOM_ARCHETYPES,
  RoomType,
} from '../game/rules';
import { FurnitureSvg, RoomBackdropSvg } from './RoomAndFurnitureSprites';
import { FairySvg, PetSvg, TitleEmblemSvg, UiRoundIconSvg } from './CharacterAndUiSprites';
import { PWAInstallButton } from './PWAInstallUI';

export type DrawerCategory = 'all' | 'bedroom' | 'kitchen' | 'garden' | 'fairies' | 'pets';

export const BuildSlotModal: React.FC<{
  slot: BuildableSlot;
  onSelectArchetype: (type: RoomType) => void;
  onClose: () => void;
}> = ({ slot, onSelectArchetype, onClose }) => {
  const archetypes = Object.values(ROOM_ARCHETYPES);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-auto"
      style={{ backgroundColor: 'rgba(43, 33, 24, 0.45)' }}
      role="dialog"
      aria-modal="true"
      aria-label={`Build Room at Floor ${slot.floor + 1}, Column ${slot.col}`}
    >
      <div className="w-full max-w-2xl rounded-3xl bg-[#FFF7ED] border-[3.5px] border-[#231F20] p-6 shadow-[0_10px_0_#231F20]">
        <div className="flex items-center justify-between gap-4 mb-4">
          <div>
            <p className="text-xs font-extrabold uppercase tracking-wider text-[#8C5E47]">
              FLOOR {slot.floor + 1} · SLOT {slot.col === 0 ? 'CENTER SPINE' : slot.col > 0 ? `RIGHT +${slot.col}` : `LEFT ${slot.col}`}
            </p>
            <h2 className="text-2xl font-display font-bold text-[#231F20]">
              Choose a Room Module to Build
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-[#FCE1D8] border-[2.5px] border-[#231F20] font-bold text-sm text-[#231F20] hover:bg-[#F9CBB8] transition-transform active:scale-95 whitespace-nowrap shrink-0"
          >
            Cancel
          </button>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3.5">
          {archetypes.map((arch) => {
            const isRecommended =
              (slot.suggestedConnector && arch.isConnector) ||
              (!slot.suggestedConnector && !arch.isConnector);
            return (
              <button
                key={arch.type}
                type="button"
                onClick={() => onSelectArchetype(arch.type)}
                className={`group flex flex-col items-center text-left p-3 rounded-2xl border-[3px] border-[#231F20] transition-transform hover:-translate-y-0.5 active:translate-y-0 ${
                  isRecommended ? 'bg-[#FFFDF9] shadow-[0_4px_0_#231F20]' : 'bg-[#F8EFE4] opacity-90'
                }`}
              >
                <div className="w-full h-24 flex items-center justify-center overflow-hidden rounded-xl bg-[#F4E6D6] border-2 border-[#231F20]/20 mb-2.5 p-1">
                  <RoomBackdropSvg
                    type={arch.type}
                    width={arch.isConnector ? 54 : 132}
                    height={88}
                    floor={slot.floor}
                  />
                </div>
                <div className="w-full">
                  <div className="flex items-center justify-between gap-1">
                    <span className="font-display font-bold text-sm text-[#231F20] truncate">
                      {arch.name}
                    </span>
                    <span className="text-xs font-extrabold tabular-nums text-[#6E493A] shrink-0">
                      +{arch.cozyBonus}
                    </span>
                  </div>
                  <p className="text-xs text-[#6B574B] line-clamp-1 mt-0.5">
                    {arch.subtitle}
                  </p>
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export const CustomizationDrawer: React.FC<{
  isOpen: boolean;
  onToggleOpen: () => void;
  category: DrawerCategory;
  onSelectCategory: (cat: DrawerCategory) => void;
  house: HouseState;
  isDraggingPlacedItem: boolean;
  isOverTrash: boolean;
  onStartCatalogDrag: (item: FurnitureCatalogItem, e: React.PointerEvent) => void;
  onQuickPlaceFurniture: (item: FurnitureCatalogItem) => void;
  onFocusOrSummonEntity: (kind: 'fairy' | 'pet', defId: string, e: React.PointerEvent) => void;
}> = ({
  isOpen,
  onToggleOpen,
  category,
  onSelectCategory,
  house,
  isDraggingPlacedItem,
  isOverTrash,
  onStartCatalogDrag,
  onQuickPlaceFurniture,
  onFocusOrSummonEntity,
}) => {
  const filteredFurniture = FURNITURE_CATALOG.filter((item) =>
    category === 'all' ? true : item.category === category
  );

  const categories: { id: DrawerCategory; label: string }[] = [
    { id: 'all', label: `All Decor (${FURNITURE_CATALOG.length})` },
    { id: 'bedroom', label: 'Bedroom' },
    { id: 'kitchen', label: 'Kitchen' },
    { id: 'garden', label: 'Garden & Plants' },
    { id: 'fairies', label: 'Fairies (6)' },
    { id: 'pets', label: 'Pets (6)' },
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 z-30 flex flex-col items-center pointer-events-none px-3 pb-2">
      {/* Store / Trash Drop Zone Banner when dragging an item */}
      {isDraggingPlacedItem && (
        <div
          data-trash-zone="true"
          className={`mb-2 pointer-events-auto flex items-center gap-3 px-6 py-2.5 rounded-2xl border-[3px] border-[#231F20] shadow-[0_4px_0_#231F20] transition-transform ${
            isOverTrash ? 'bg-[#F898A8] scale-105' : 'bg-[#FAD2D8]'
          }`}
        >
          <UiRoundIconSvg kind="trash" size={32} />
          <span className="font-display font-bold text-sm text-[#231F20] whitespace-nowrap">
            {isOverTrash ? 'Release to Store Back in Drawer!' : 'Drag Here to Store Furniture'}
          </span>
        </div>
      )}

      {/* Drawer Handle + Category Bar */}
      <div className="w-full max-w-5xl pointer-events-auto bg-[#FFF7ED] border-[3.5px] border-[#231F20] rounded-3xl shadow-[0_6px_0_#231F20] overflow-hidden">
        <div className="flex flex-wrap items-center justify-between gap-2 px-4 py-2.5 bg-[#FCE1D8] border-b-[3px] border-[#231F20]">
          <div className="flex items-center gap-1.5 overflow-x-auto">
            {categories.map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => {
                  onSelectCategory(tab.id);
                  if (!isOpen) onToggleOpen();
                }}
                className={`px-3 py-1.5 rounded-xl font-bold text-xs border-[2.5px] transition-transform whitespace-nowrap shrink-0 ${
                  category === tab.id && isOpen
                    ? 'bg-[#FFFDF9] border-[#231F20] text-[#231F20] shadow-[0_2px_0_#231F20]'
                    : 'bg-transparent border-transparent text-[#573E32] hover:bg-[#FFFDF9]/60'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          <button
            type="button"
            onClick={onToggleOpen}
            aria-expanded={isOpen}
            aria-label={isOpen ? 'Collapse Customization Drawer' : 'Open Customization Drawer'}
            className="px-3.5 py-1.5 rounded-xl bg-[#FFFDF9] border-[2.5px] border-[#231F20] font-display font-bold text-xs text-[#231F20] shadow-[0_2px_0_#231F20] hover:bg-[#FFF3E6] whitespace-nowrap shrink-0"
          >
            {isOpen ? 'Hide Drawer [D]' : 'Open Drawer [D]'}
          </button>
        </div>

        {/* Drawer Item Strip */}
        {isOpen && (
          <div className="px-4 py-3 overflow-x-auto">
            {category === 'fairies' ? (
              <div className="flex items-center gap-3 min-w-max">
                {FAIRY_DEFINITIONS.map((fairy) => {
                  const instance = house.entities.find(
                    (e) => e.kind === 'fairy' && e.defId === fairy.fairyId
                  );
                  const poseLabel =
                    instance?.pose === 'sleeping'
                      ? 'Sleeping Zzz'
                      : instance?.pose === 'sitting'
                        ? 'Sitting Cozy'
                        : 'Exploring';
                  return (
                    <button
                      key={fairy.fairyId}
                      type="button"
                      onPointerDown={(e) => onFocusOrSummonEntity('fairy', fairy.fairyId, e)}
                      className="group flex items-center gap-3 px-3.5 py-2 rounded-2xl bg-[#FFFDF9] border-[2.5px] border-[#231F20] shadow-[0_3px_0_#231F20] hover:-translate-y-0.5 transition-transform text-left shrink-0 cursor-grab active:cursor-grabbing"
                    >
                      <div className="w-12 h-14 shrink-0">
                        <FairySvg fairyId={fairy.fairyId} pose="idle" />
                      </div>
                      <div>
                        <div className="font-display font-bold text-sm text-[#231F20] whitespace-nowrap">
                          {fairy.name}
                        </div>
                        <div className="text-xs text-[#6B574B] whitespace-nowrap">
                          {fairy.title}
                        </div>
                        <div className="text-[11px] font-bold text-[#7A526C] mt-0.5 whitespace-nowrap">
                          {poseLabel} · Drag or Click
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>
            ) : category === 'pets' ? (
              <div className="flex items-center gap-3 min-w-max">
                {PET_DEFINITIONS.map((pet) => (
                  <button
                    key={pet.petId}
                    type="button"
                    onPointerDown={(e) => onFocusOrSummonEntity('pet', pet.petId, e)}
                    className="group flex items-center gap-3 px-3.5 py-2 rounded-2xl bg-[#FFFDF9] border-[2.5px] border-[#231F20] shadow-[0_3px_0_#231F20] hover:-translate-y-0.5 transition-transform text-left shrink-0 cursor-grab active:cursor-grabbing"
                  >
                    <div className="w-12 h-12 shrink-0">
                      <PetSvg petId={pet.petId} />
                    </div>
                    <div>
                      <div className="font-display font-bold text-sm text-[#231F20] whitespace-nowrap">
                        {pet.name}
                      </div>
                      <div className="text-xs text-[#6B574B] whitespace-nowrap">
                        {pet.title}
                      </div>
                      <div className="text-[11px] font-bold text-[#5A7B44] mt-0.5 whitespace-nowrap">
                        Companion · Drag or Click
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            ) : (
              <div className="flex items-center gap-2.5 min-w-max">
                {filteredFurniture.map((item) => {
                  const placedCount = house.furniture.filter((f) => f.itemId === item.itemId).length;
                  return (
                    <button
                      key={item.itemId}
                      type="button"
                      aria-label={`Place ${item.name}`}
                      onPointerDown={(e) => onStartCatalogDrag(item, e)}
                      onClick={() => onQuickPlaceFurniture(item)}
                      className="group flex flex-col items-center justify-between w-28 h-24 p-2 rounded-2xl bg-[#FFFDF9] border-[2.5px] border-[#231F20] shadow-[0_3px_0_#231F20] hover:-translate-y-0.5 active:translate-y-0 transition-transform shrink-0 cursor-grab active:cursor-grabbing"
                    >
                      <div className="w-14 h-12 flex items-center justify-center">
                        <FurnitureSvg itemId={item.itemId} toggled={true} />
                      </div>
                      <div className="w-full text-center">
                        <div className="font-display font-bold text-[11px] text-[#231F20] truncate">
                          {item.name}
                        </div>
                        <div className="text-[10px] font-bold text-[#7A6254] tabular-nums whitespace-nowrap">
                          {item.placement.toUpperCase()} · +{item.cozyValue} {placedCount > 0 ? `(${placedCount})` : ''}
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export const TitleScreenOverlay: React.FC<{
  onStartGame: () => void;
}> = ({ onStartGame }) => {
  return (
    <div
      className="fixed inset-0 z-40 flex flex-col justify-between p-6 sm:p-10 pointer-events-none"
      style={{
        background:
          'linear-gradient(90deg, rgba(253, 243, 235, 0.92) 0%, rgba(253, 243, 235, 0.72) 44%, rgba(253, 243, 235, 0.12) 100%)',
      }}
    >
      {/* Left-third negative space composition so live dollhouse remains visible on the right */}
      <div className="max-w-md my-auto pointer-events-auto flex flex-col items-start gap-5">
        <TitleEmblemSvg />

        <p className="text-base font-bold text-[#4A372B] leading-relaxed">
          Build modular pastel rooms, arrange cozy furniture, and care for 6 magical fairies and their companion pets in an interactive cross-section dollhouse.
        </p>

        <div className="flex flex-wrap items-center gap-3 pt-1">
          <button
            type="button"
            data-start="true"
            onClick={(e) => {
              e.currentTarget.blur();
              onStartGame();
            }}
            className="px-7 py-3.5 rounded-2xl bg-[#F48FB1] hover:bg-[#F078A0] border-[3.5px] border-[#231F20] font-display font-bold text-lg text-[#231F20] shadow-[0_5px_0_#231F20] active:translate-y-0.5 transition-transform whitespace-nowrap shrink-0 cursor-pointer"
          >
            Play Fairy Haven
          </button>
          <PWAInstallButton variant="title" />
        </div>
      </div>

      {/* Single flat borderless control hint line in the bottom safe margin */}
      <div className="w-full text-center pointer-events-none">
        <p className="text-xs font-extrabold tracking-wide text-[#4A372B]">
          Drag Viewport to Pan · [B] Build Rooms · [D] Furniture Drawer · Drag Fairies to Beds &amp; Chairs · [Esc] Pause
        </p>
      </div>
    </div>
  );
};

export const PauseOrCelebrationModal: React.FC<{
  mode: 'paused' | 'gameover';
  house: HouseState;
  cozyScore: number;
  showReferenceSheets: boolean;
  onToggleReferenceSheets: () => void;
  onResume: () => void;
  onResetHouse: () => void;
  onReturnTitle: () => void;
}> = ({
  mode,
  house,
  cozyScore,
  showReferenceSheets,
  onToggleReferenceSheets,
  onResume,
  onResetHouse,
  onReturnTitle,
}) => {
  const restingFairies = house.entities.filter(
    (e) => e.kind === 'fairy' && (e.pose === 'sleeping' || e.pose === 'sitting')
  ).length;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-auto"
      style={{ backgroundColor: 'rgba(43, 33, 24, 0.5)' }}
      role="dialog"
      aria-modal="true"
      aria-label={mode === 'gameover' ? 'Fairy Haven Mastery' : 'Game Paused'}
    >
      <div className="w-full max-w-xl rounded-3xl bg-[#FFF7ED] border-[4px] border-[#231F20] p-6 shadow-[0_10px_0_#231F20] max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between gap-4 mb-4">
          <h2 className="text-2xl font-display font-bold text-[#231F20]">
            {mode === 'gameover' ? 'Fairy Haven Showcase!' : 'Dollhouse Paused'}
          </h2>
          <span className="text-xs font-extrabold uppercase tracking-wider text-[#7A526C]">
            {mode === 'gameover' ? 'COZY MILESTONE' : 'SANDBOX MENU'}
          </span>
        </div>

        {/* 3 Tabular-Nums Stat Tiles */}
        <div className="grid grid-cols-3 gap-3 mb-5">
          <div className="p-3 rounded-2xl bg-[#FCE1EB] border-[2.5px] border-[#231F20] text-center">
            <div className="text-[11px] font-extrabold uppercase text-[#6E4558]">COZY SCORE</div>
            <div className="text-2xl font-display font-bold text-[#231F20] tabular-nums">
              {Math.round(cozyScore)}
            </div>
          </div>
          <div className="p-3 rounded-2xl bg-[#E2F4EE] border-[2.5px] border-[#231F20] text-center">
            <div className="text-[11px] font-extrabold uppercase text-[#3E6B5C]">ROOMS BUILT</div>
            <div className="text-2xl font-display font-bold text-[#231F20] tabular-nums">
              {house.rooms.length}
            </div>
          </div>
          <div className="p-3 rounded-2xl bg-[#FBF0C9] border-[2.5px] border-[#231F20] text-center">
            <div className="text-[11px] font-extrabold uppercase text-[#735C26]">COZY FAIRIES</div>
            <div className="text-2xl font-display font-bold text-[#231F20] tabular-nums">
              {restingFairies}/6
            </div>
          </div>
        </div>

        {showReferenceSheets && (
          <div className="mb-5 p-3 rounded-2xl bg-[#FFFDF9] border-[2.5px] border-[#231F20]">
            <p className="text-xs font-bold text-[#5C4538] mb-2">
              Original Attached Design Sheets (Rooms, Furniture, Fairies &amp; Magical Pets):
            </p>
            <div className="grid grid-cols-2 gap-2">
              <img
                src="/assets/aistudio/Gemini_Generated_Image_skmwo7skmwo7skmw_fc51e03e.jpg"
                alt="Room Modules Reference Sheet"
                referrerPolicy="no-referrer"
                className="w-full h-28 object-contain rounded-xl border border-[#231F20]/20 bg-white"
              />
              <img
                src="/assets/aistudio/Gemini_Generated_Image_8yxawl8yxawl8yxa_7ae919ed.jpg"
                alt="Furniture and Props Reference Sheet"
                referrerPolicy="no-referrer"
                className="w-full h-28 object-contain rounded-xl border border-[#231F20]/20 bg-white"
              />
              <img
                src="/assets/aistudio/Gemini_Generated_Image_4tvtis4tvtis4tvt_6326a52b.jpg"
                alt="Fairy Characters Reference Sheet"
                referrerPolicy="no-referrer"
                className="w-full h-28 object-contain rounded-xl border border-[#231F20]/20 bg-white"
              />
              <img
                src="/assets/aistudio/Gemini_Generated_Image_4tvtis4tvt_c40f17b5.jpg"
                alt="Magical Pets Reference Sheet"
                referrerPolicy="no-referrer"
                className="w-full h-28 object-contain rounded-xl border border-[#231F20]/20 bg-white"
              />
            </div>
          </div>
        )}

        <div className="flex flex-wrap items-center justify-between gap-2.5">
          <button
            type="button"
            data-start="true"
            onClick={onResume}
            className="px-5 py-2.5 rounded-2xl bg-[#A6E3D5] hover:bg-[#8CD8C7] border-[3px] border-[#231F20] font-display font-bold text-sm text-[#231F20] shadow-[0_4px_0_#231F20] whitespace-nowrap shrink-0"
          >
            {mode === 'gameover' ? 'Keep Playing' : 'Resume Game [Esc]'}
          </button>

          <PWAInstallButton variant="modal" />

          <button
            type="button"
            onClick={onToggleReferenceSheets}
            className="px-4 py-2.5 rounded-2xl bg-[#FFFDF9] hover:bg-[#F5E9DC] border-[2.5px] border-[#231F20] font-bold text-xs text-[#231F20] whitespace-nowrap shrink-0"
          >
            {showReferenceSheets ? 'Hide Design Sheets' : 'View Design Sheets'}
          </button>

          <button
            type="button"
            onClick={onResetHouse}
            className="px-4 py-2.5 rounded-2xl bg-[#FCE1D8] hover:bg-[#F8CBB8] border-[2.5px] border-[#231F20] font-bold text-xs text-[#231F20] whitespace-nowrap shrink-0"
          >
            Reset House
          </button>

          <button
            type="button"
            onClick={onReturnTitle}
            className="px-4 py-2.5 rounded-2xl bg-[#E8DEF8] hover:bg-[#D8C6F4] border-[2.5px] border-[#231F20] font-bold text-xs text-[#231F20] whitespace-nowrap shrink-0"
          >
            Title Screen
          </button>
        </div>
      </div>
    </div>
  );
};
