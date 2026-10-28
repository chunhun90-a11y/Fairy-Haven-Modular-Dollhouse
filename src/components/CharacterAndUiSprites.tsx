import React from 'react';
import { FairyPose } from '../game/rules';
import { getSlicedSpriteUrl, useSpritesReady } from '../game/spriteSlicer';

const STROKE = '#231F20';

/**
 * Renders the 6 Fairy Characters directly from the Canvas-sliced Sheet 2 artwork!
 */
export const FairySvg: React.FC<{
  fairyId: string;
  pose: FairyPose;
}> = React.memo(({ fairyId, pose }) => {
  useSpritesReady();
  const spriteUrl = getSlicedSpriteUrl(fairyId);

  if (spriteUrl) {
    return (
      <div className="relative w-full h-full select-none pointer-events-none flex items-center justify-center">
        <img
          src={spriteUrl}
          alt={fairyId}
          draggable={false}
          className={`w-full h-full object-contain select-none pointer-events-none transition-transform ${
            pose === 'sitting' ? 'scale-y-95 translate-y-1' : ''
          }`}
        />
      </div>
    );
  }

  return <div className="w-full h-full rounded-full bg-[#FCE1EB]/50" />;
});

/**
 * Renders the 6 Magical Companion Pets directly from the Canvas-sliced Sheet 1 artwork!
 */
export const PetSvg: React.FC<{
  petId: string;
}> = React.memo(({ petId }) => {
  useSpritesReady();
  const spriteUrl = getSlicedSpriteUrl(petId);

  if (spriteUrl) {
    return (
      <div className="relative w-full h-full select-none pointer-events-none flex items-center justify-center">
        <img
          src={spriteUrl}
          alt={petId}
          draggable={false}
          className="w-full h-full object-contain select-none pointer-events-none"
        />
      </div>
    );
  }

  return <div className="w-full h-full rounded-full bg-[#E2F4EE]/50" />;
});

/**
 * Renders the thick-outlined pastel round UI icons using the Canvas-sliced icons from Sheet 3
 * (ui_plus, ui_gear, ui_hammer, ui_hand) plus matching cartoon sound/home/trash icons.
 */
export const UiRoundIconSvg: React.FC<{
  kind: 'plus' | 'hammer' | 'gear' | 'hand' | 'sound_on' | 'sound_off' | 'home' | 'trash';
  size?: number;
}> = React.memo(({ kind, size = 40 }) => {
  useSpritesReady();

  const sheetKey =
    kind === 'plus'
      ? 'ui_plus'
      : kind === 'hammer'
        ? 'ui_hammer'
        : kind === 'gear'
          ? 'ui_gear'
          : kind === 'hand'
            ? 'ui_hand'
            : null;

  const slicedUrl = sheetKey ? getSlicedSpriteUrl(sheetKey) : undefined;

  if (slicedUrl) {
    return (
      <img
        src={slicedUrl}
        alt={kind}
        width={size}
        height={size}
        draggable={false}
        style={{ width: `${size}px`, height: `${size}px` }}
        className="block object-contain select-none pointer-events-none"
      />
    );
  }

  return (
    <svg viewBox="0 0 48 48" width={size} height={size} className="block select-none">
      <circle
        cx="24"
        cy="24"
        r="21"
        fill={kind === 'trash' ? '#FAD2D8' : '#FCE1D8'}
        stroke={STROKE}
        strokeWidth="3.2"
      />
      {kind === 'plus' && (
        <>
          <path d="M 24 13 L 24 35 M 13 24 L 35 24" stroke="#9BA8B4" strokeWidth="7" strokeLinecap="round" />
          <path d="M 24 13 L 24 35 M 13 24 L 35 24" stroke={STROKE} strokeWidth="3" strokeLinecap="round" />
        </>
      )}
      {kind === 'hammer' && (
        <g>
          <line x1="15" y1="33" x2="27" y2="21" stroke="#C58B5B" strokeWidth="6" strokeLinecap="round" />
          <line x1="15" y1="33" x2="27" y2="21" stroke={STROKE} strokeWidth="2.6" strokeLinecap="round" />
          <path d="M 21 15 L 31 15 Q 35 15 36 19 L 25 25 Z" fill="#9BA8B4" stroke={STROKE} strokeWidth="2.6" strokeLinejoin="round" />
        </g>
      )}
      {kind === 'gear' && (
        <g>
          <circle cx="24" cy="24" r="10" fill="#9BA8B4" stroke={STROKE} strokeWidth="2.8" />
          <circle cx="24" cy="24" r="4.5" fill="#FCE1D8" stroke={STROKE} strokeWidth="2.4" />
        </g>
      )}
      {kind === 'hand' && (
        <path
          d="M 21 34 L 21 16 Q 21 13 24 13 Q 27 13 27 16 L 27 22 L 32 22 Q 35 22 35 26 L 34 34 Z"
          fill="#FFFFFF"
          stroke={STROKE}
          strokeWidth="2.6"
          strokeLinejoin="round"
        />
      )}
      {kind === 'sound_on' && (
        <g>
          <polygon points="15,20 21,20 27,14 27,34 21,28 15,28" fill="#8CCBB8" stroke={STROKE} strokeWidth="2.6" strokeLinejoin="round" />
          <path d="M 31 19 Q 35 24 31 29" fill="none" stroke={STROKE} strokeWidth="2.6" strokeLinecap="round" />
        </g>
      )}
      {kind === 'sound_off' && (
        <g>
          <polygon points="15,20 21,20 27,14 27,34 21,28 15,28" fill="#E8999E" stroke={STROKE} strokeWidth="2.6" strokeLinejoin="round" />
          <line x1="30" y1="19" x2="36" y2="29" stroke={STROKE} strokeWidth="2.8" strokeLinecap="round" />
          <line x1="36" y1="19" x2="30" y2="29" stroke={STROKE} strokeWidth="2.8" strokeLinecap="round" />
        </g>
      )}
      {kind === 'home' && (
        <g>
          <polygon points="14,24 24,14 34,24" fill="#F294B6" stroke={STROKE} strokeWidth="2.6" strokeLinejoin="round" />
          <rect x="17" y="24" width="14" height="11" fill="#FFF6EA" stroke={STROKE} strokeWidth="2.6" />
        </g>
      )}
      {kind === 'trash' && (
        <g>
          <rect x="17" y="18" width="14" height="16" rx="2" fill="#EE7A8B" stroke={STROKE} strokeWidth="2.6" />
          <line x1="14" y1="18" x2="34" y2="18" stroke={STROKE} strokeWidth="2.8" strokeLinecap="round" />
        </g>
      )}
    </svg>
  );
});

/**
 * Custom Inline SVG Title Lockup for the Game Shell Title Screen.
 */
export const TitleEmblemSvg: React.FC = React.memo(() => (
  <svg viewBox="0 0 460 132" className="w-full max-w-[440px] h-auto select-none">
    <path d="M 48 64 Q 6 24 14 48 Q 18 76 58 76 Z" fill="#BCE879" stroke={STROKE} strokeWidth="3.5" />
    <path d="M 412 64 Q 454 24 446 48 Q 442 76 402 76 Z" fill="#F8A9C4" stroke={STROKE} strokeWidth="3.5" />
    <rect x="42" y="18" width="376" height="96" rx="28" fill="#FFF5E8" stroke={STROKE} strokeWidth="4" />
    <rect x="50" y="26" width="360" height="80" rx="22" fill="#FCE1EB" stroke="#E6A9C3" strokeWidth="2.5" />
    <circle cx="76" cy="48" r="5" fill="#F8DC78" stroke={STROKE} strokeWidth="2" />
    <circle cx="384" cy="48" r="5" fill="#9ED9C8" stroke={STROKE} strokeWidth="2" />
    <text
      x="230"
      y="67"
      textAnchor="middle"
      fontFamily="Fredoka, Nunito, sans-serif"
      fontWeight="700"
      fontSize="38"
      fill="#3B2838"
    >
      FAIRY HAVEN
    </text>
    <text
      x="230"
      y="93"
      textAnchor="middle"
      fontFamily="Nunito, sans-serif"
      fontWeight="800"
      fontSize="14"
      letterSpacing="2.5"
      fill="#7A526C"
    >
      DOLLHOUSE BUILDER &amp; SANDBOX
    </text>
  </svg>
));
