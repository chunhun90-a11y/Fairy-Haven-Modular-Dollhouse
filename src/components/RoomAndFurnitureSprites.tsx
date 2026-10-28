import React from 'react';
import { RoomType } from '../game/rules';
import { getSlicedSpriteUrl, useSpritesReady } from '../game/spriteSlicer';

const STROKE = '#382519';

/**
 * Scenic Pastel Rolling Hills, Clouds & Trees Backdrop matching /public/assets/aistudio/image_53107f52.png
 */
export const ScenicHillsBackdropSvg: React.FC<{
  cameraX: number;
  cameraY: number;
}> = React.memo(({ cameraX, cameraY }) => {
  return (
    <svg
      viewBox="0 0 1600 960"
      preserveAspectRatio="xMidYMid slice"
      className="absolute inset-0 w-full h-full pointer-events-none select-none"
    >
      <defs>
        <linearGradient id="skyGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#CBEAE6" />
          <stop offset="55%" stopColor="#E6F4E8" />
          <stop offset="100%" stopColor="#F3F7DF" />
        </linearGradient>
      </defs>
      <rect width="1600" height="960" fill="url(#skyGrad)" />

      {/* Parallax Clouds */}
      <g transform={`translate(${cameraX * 0.12}, ${cameraY * 0.08})`} opacity="0.92">
        <path
          d="M 80 150 Q 95 110 135 120 Q 165 90 205 115 Q 240 105 260 135 Q 290 140 285 168 L 75 168 Z"
          fill="#FFFDF9"
          stroke="#E4D7C8"
          strokeWidth="2.5"
        />
        <path
          d="M 1320 130 Q 1340 95 1380 108 Q 1415 80 1455 108 Q 1490 105 1505 138 L 1310 138 Z"
          fill="#FFFDF9"
          stroke="#E4D7C8"
          strokeWidth="2.5"
        />
        <path
          d="M 420 95 Q 440 70 470 82 Q 500 65 525 88 L 415 88 Z"
          fill="#FFFDF9"
          opacity="0.75"
        />
      </g>

      {/* Parallax Distant Hills & Trees matching image_53107f52.png */}
      <g transform={`translate(${cameraX * 0.25}, ${cameraY * 0.2})`}>
        {/* Distant Left Hill */}
        <path
          d="M -100 620 Q 140 330 460 560 L 460 960 L -100 960 Z"
          fill="#F0F5D8"
          stroke="#9BB380"
          strokeWidth="2.5"
        />
        {/* Distant Right Hill */}
        <path
          d="M 1080 580 Q 1380 290 1700 540 L 1700 960 L 1080 960 Z"
          fill="#EEF4D4"
          stroke="#9BB380"
          strokeWidth="2.5"
        />
        {/* Little Pine Trees on Left Distant Hill */}
        <g transform="translate(85, 345)">
          <rect x="16" y="42" width="6" height="14" fill="#9E7356" stroke={STROKE} strokeWidth="2" />
          <polygon points="19,6 4,30 34,30" fill="#A9D19E" stroke="#5E7E56" strokeWidth="2" strokeLinejoin="round" />
          <polygon points="19,18 2,44 36,44" fill="#A9D19E" stroke="#5E7E56" strokeWidth="2" strokeLinejoin="round" />
        </g>
        <g transform="translate(128, 362) scale(0.8)">
          <rect x="16" y="42" width="6" height="14" fill="#9E7356" stroke={STROKE} strokeWidth="2" />
          <polygon points="19,8 4,32 34,32" fill="#A9D19E" stroke="#5E7E56" strokeWidth="2" strokeLinejoin="round" />
          <polygon points="19,20 2,44 36,44" fill="#A9D19E" stroke="#5E7E56" strokeWidth="2" strokeLinejoin="round" />
        </g>

        {/* Distant Tree on Right Hill */}
        <g transform="translate(1435, 310)">
          <path d="M 24 44 L 24 74" stroke="#9C7154" strokeWidth="7" strokeLinecap="round" />
          <circle cx="24" cy="32" r="20" fill="#ABD29E" stroke="#5E7E56" strokeWidth="2" />
          <circle cx="14" cy="40" r="14" fill="#ABD29E" stroke="#5E7E56" strokeWidth="2" />
          <circle cx="34" cy="40" r="14" fill="#ABD29E" stroke="#5E7E56" strokeWidth="2" />
        </g>

        {/* Midground Hills */}
        <path
          d="M -120 710 Q 180 520 520 690 L 520 960 L -120 960 Z"
          fill="#DCEAA9"
          stroke="#8AA868"
          strokeWidth="2.5"
        />
        <path
          d="M 1040 690 Q 1380 510 1720 680 L 1720 960 L 1040 960 Z"
          fill="#DCEAA9"
          stroke="#8AA868"
          strokeWidth="2.5"
        />

        {/* Round Green Tree on Left Midground Hill */}
        <g transform="translate(55, 505)">
          <rect x="26" y="64" width="10" height="36" rx="3" fill="#A67554" stroke={STROKE} strokeWidth="2.5" />
          <path d="M 31 76 L 22 64 M 31 72 L 40 62" stroke={STROKE} strokeWidth="2.5" strokeLinecap="round" />
          <ellipse cx="31" cy="42" rx="28" ry="34" fill="#9ECA7E" stroke="#587A44" strokeWidth="2.5" />
        </g>

        {/* Pink Blossom Tree on Right Midground Hill (matching image_53107f52.png) */}
        <g transform="translate(1375, 485)">
          <path d="M 45 70 L 45 112 M 45 86 L 30 70 M 45 82 L 60 68" stroke="#A67152" strokeWidth="9" strokeLinecap="round" />
          <path d="M 45 70 L 45 112 M 45 86 L 30 70 M 45 82 L 60 68" stroke="#6B442E" strokeWidth="2.5" strokeLinecap="round" />
          <circle cx="45" cy="36" r="26" fill="#F4B2A0" stroke="#9B6659" strokeWidth="2.2" />
          <circle cx="24" cy="52" r="22" fill="#F4B2A0" stroke="#9B6659" strokeWidth="2.2" />
          <circle cx="66" cy="52" r="22" fill="#F4B2A0" stroke="#9B6659" strokeWidth="2.2" />
          <circle cx="45" cy="54" r="24" fill="#F6BDAE" />
        </g>

        {/* Bushes flanking the Dollhouse */}
        <path
          d="M -60 760 Q 10 705 70 740 Q 130 695 195 745 L 195 840 L -60 840 Z"
          fill="#A8D08D"
          stroke="#5D8249"
          strokeWidth="2.5"
        />
        <path
          d="M 1340 740 Q 1405 685 1475 730 Q 1535 690 1620 745 L 1620 840 L 1340 840 Z"
          fill="#A8D08D"
          stroke="#5D8249"
          strokeWidth="2.5"
        />
      </g>
    </svg>
  );
});

/**
 * Renders the Pitched Wooden Gable Roof + Attic Eaves + Outer Timber Frame wrapping the entire Dollhouse,
 * matching /public/assets/aistudio/image_53107f52.png.
 */
export const DollhouseRoofAndFrameSvg: React.FC<{
  houseLeft: number;
  houseRight: number;
  houseTop: number;
  houseBottom: number;
}> = React.memo(({ houseLeft, houseRight, houseTop, houseBottom }) => {
  const houseWidth = houseRight - houseLeft;
  const centerX = (houseLeft + houseRight) / 2;
  const roofPeakH = 112;
  const overhang = 36;
  const svgLeft = houseLeft - overhang - 16;
  const svgTop = houseTop - roofPeakH - 24;
  const svgW = houseWidth + (overhang + 16) * 2;
  const svgH = houseBottom - svgTop + 28;

  const localLeft = houseLeft - svgLeft;
  const localRight = houseRight - svgLeft;
  const localCenter = centerX - svgLeft;
  const localTop = houseTop - svgTop;
  const localBottom = houseBottom - svgTop;

  return (
    <svg
      viewBox={`0 0 ${svgW} ${svgH}`}
      width={svgW}
      height={svgH}
      style={{
        left: `${svgLeft}px`,
        top: `${svgTop}px`,
      }}
      className="absolute pointer-events-none select-none z-20 overflow-visible"
    >
      {/* Triangular Attic Backing under the Gable Roof so rooms meet the sloped roof cleanly */}
      <polygon
        points={`${localLeft - 8},${localTop + 6} ${localCenter},${localTop - roofPeakH + 22} ${localRight + 8},${localTop + 6}`}
        fill="#E5C9A8"
        stroke={STROKE}
        strokeWidth="3.5"
        strokeLinejoin="round"
      />
      {/* Left & Right Attic Room Wallpaper extensions under the roof slope */}
      <polygon
        points={`${localLeft + 6},${localTop + 4} ${localCenter - 88},${localTop - roofPeakH + 38} ${localCenter - 88},${localTop + 4}`}
        fill="#D5B9EE"
        stroke={STROKE}
        strokeWidth="2.5"
      />
      <polygon
        points={`${localCenter + 88},${localTop - roofPeakH + 38} ${localRight - 6},${localTop + 4} ${localCenter + 88},${localTop + 4}`}
        fill="#F4E3CD"
        stroke={STROKE}
        strokeWidth="2.5"
      />
      {/* Central Elevator Shaft extension into the roof peak */}
      <polygon
        points={`${localCenter - 88},${localTop + 4} ${localCenter - 88},${localTop - roofPeakH + 38} ${localCenter},${localTop - roofPeakH + 20} ${localCenter + 88},${localTop - roofPeakH + 38} ${localCenter + 88},${localTop + 4}`}
        fill="#A4A9AD"
        stroke={STROKE}
        strokeWidth="3"
      />
      <rect
        x={localCenter - 88}
        y={localTop - roofPeakH + 34}
        width="14"
        height={roofPeakH - 30}
        fill="#B87E52"
        stroke={STROKE}
        strokeWidth="2.8"
      />
      <rect
        x={localCenter + 74}
        y={localTop - roofPeakH + 34}
        width="14"
        height={roofPeakH - 30}
        fill="#B87E52"
        stroke={STROKE}
        strokeWidth="2.8"
      />

      {/* Left Outer Vertical Wooden Wall Column */}
      <rect
        x={localLeft - 14}
        y={localTop - 4}
        width="16"
        height={localBottom - localTop + 16}
        fill="#B47B4E"
        stroke={STROKE}
        strokeWidth="3.2"
      />
      {/* Right Outer Vertical Wooden Wall Column */}
      <rect
        x={localRight - 2}
        y={localTop - 4}
        width="16"
        height={localBottom - localTop + 16}
        fill="#B47B4E"
        stroke={STROKE}
        strokeWidth="3.2"
      />

      {/* Foundation Wooden Sill Beam at bottom of Dollhouse */}
      <rect
        x={localLeft - 16}
        y={localBottom - 4}
        width={houseWidth + 32}
        height="16"
        rx="3"
        fill="#AD7448"
        stroke={STROKE}
        strokeWidth="3.2"
      />

      {/* Pitched Wooden Gable Roof — Lower Fascia / Rafter Layer */}
      <polygon
        points={`${localLeft - overhang + 4},${localTop + 16} ${localCenter},${localTop - roofPeakH + 16} ${localRight + overhang - 4},${localTop + 16} ${localRight + overhang - 4},${localTop + 30} ${localCenter},${localTop - roofPeakH + 30} ${localLeft - overhang + 4},${localTop + 30}`}
        fill="#AD754B"
        stroke={STROKE}
        strokeWidth="3.2"
        strokeLinejoin="round"
      />
      {/* Pitched Wooden Gable Roof — Upper Shingle / Timber Cap Layer */}
      <polygon
        points={`${localLeft - overhang},${localTop + 2} ${localCenter},${localTop - roofPeakH} ${localRight + overhang},${localTop + 2} ${localRight + overhang - 4},${localTop + 17} ${localCenter},${localTop - roofPeakH + 17} ${localLeft - overhang + 4},${localTop + 17}`}
        fill="#94603B"
        stroke={STROKE}
        strokeWidth="3.5"
        strokeLinejoin="round"
      />
      {/* Center Ridge Line */}
      <line
        x1={localCenter}
        y1={localTop - roofPeakH}
        x2={localCenter}
        y2={localTop - roofPeakH + 30}
        stroke={STROKE}
        strokeWidth="3.2"
      />
    </svg>
  );
});

/**
 * Renders an Unbuilt Dollhouse Bay with stone, red brick, concrete, or wood plank walls and a round "+" button,
 * directly matching the bottom floor of /public/assets/aistudio/image_53107f52.png.
 */
export const UnbuiltDollhouseBaySvg: React.FC<{
  width: number;
  height: number;
  bayStyle: 'stone_brick' | 'concrete_wood' | 'shaft';
}> = React.memo(({ width, height, bayStyle }) => {
  const plusUrl = getSlicedSpriteUrl('ui_plus');

  if (bayStyle === 'shaft') {
    return (
      <svg viewBox="0 0 176 216" width={width} height={height} className="block select-none pointer-events-none">
        <rect x="0" y="0" width="176" height="216" fill="#9A9E9F" stroke={STROKE} strokeWidth="3" />
        <rect x="0" y="0" width="12" height="216" fill="#B57C50" stroke={STROKE} strokeWidth="2.8" />
        <rect x="164" y="0" width="12" height="216" fill="#B57C50" stroke={STROKE} strokeWidth="2.8" />
        <rect x="0" y="202" width="176" height="14" fill="#B57C50" stroke={STROKE} strokeWidth="2.8" />
      </svg>
    );
  }

  return (
    <svg viewBox="0 0 348 216" width={width} height={height} className="block select-none pointer-events-none">
      <defs>
        <pattern id="redBrickPat" width="32" height="18" patternUnits="userSpaceOnUse">
          <rect width="32" height="18" fill="#BD6D50" />
          <rect x="1" y="1" width="14" height="7" fill="#C9785B" />
          <rect x="17" y="1" width="14" height="7" fill="#B56448" />
          <rect x="9" y="10" width="14" height="7" fill="#C9785B" />
          <path d="M 0 9 L 32 9 M 16 0 L 16 9 M 8 9 L 8 18 M 24 9 L 24 18" stroke="#8F4B34" strokeWidth="1.4" />
        </pattern>
        <pattern id="woodPlankWallPat" width="40" height="16" patternUnits="userSpaceOnUse">
          <rect width="40" height="16" fill="#AC7D55" />
          <line x1="0" y1="15" x2="40" y2="15" stroke="#7A5233" strokeWidth="1.8" />
        </pattern>
      </defs>

      {bayStyle === 'stone_brick' ? (
        <g>
          {/* Left sub-bay: grey stone wall + floor */}
          <rect x="4" y="6" width="166" height="196" fill="#A9ACAE" stroke={STROKE} strokeWidth="2.5" />
          <polygon points="4,6 32,22 32,174 4,202" fill="#929598" stroke={STROKE} strokeWidth="2.2" />
          <polygon points="4,202 32,174 170,174 170,202" fill="#BDBFC1" stroke={STROKE} strokeWidth="2.2" />
          {/* Right sub-bay: red brick wall + doorway */}
          <rect x="182" y="6" width="162" height="196" fill="url(#redBrickPat)" stroke={STROKE} strokeWidth="2.5" />
          <polygon points="182,202 204,174 344,174 344,202" fill="#9C8473" stroke={STROKE} strokeWidth="2.2" />
          {/* Center Wooden Divider Post with Doorway */}
          <rect x="168" y="6" width="14" height="196" fill="#B47B4E" stroke={STROKE} strokeWidth="2.8" />
          <polygon points="182,198 182,84 198,74 198,180" fill="#B87A56" stroke={STROKE} strokeWidth="2.2" />
        </g>
      ) : (
        <g>
          {/* Left sub-bay: grey concrete wall */}
          <rect x="4" y="6" width="166" height="196" fill="#AEB2B5" stroke={STROKE} strokeWidth="2.5" />
          <polygon points="4,202 24,174 170,174 170,202" fill="#C4C7C9" stroke={STROKE} strokeWidth="2.2" />
          <polygon points="170,6 146,22 146,174 170,202" fill="#999D9F" stroke={STROKE} strokeWidth="2.2" />
          {/* Right sub-bay: horizontal wood plank room */}
          <rect x="182" y="6" width="162" height="196" fill="url(#woodPlankWallPat)" stroke={STROKE} strokeWidth="2.5" />
          <polygon points="182,202 182,174 316,174 344,202" fill="#C69C72" stroke={STROKE} strokeWidth="2.2" />
          {/* Center Wooden Divider Post */}
          <rect x="168" y="6" width="14" height="196" fill="#B47B4E" stroke={STROKE} strokeWidth="2.8" />
        </g>
      )}

      {/* Top & Bottom Continuous Wooden Floor Beams */}
      <rect x="0" y="0" width="348" height="10" fill="#B47B4E" stroke={STROKE} strokeWidth="2.8" />
      <rect x="0" y="202" width="348" height="14" fill="#B47B4E" stroke={STROKE} strokeWidth="2.8" />
    </svg>
  );
});

/**
 * Renders the 2D cutaway dollhouse room interior using the exact sliced artwork from Sheet 4
 * framed inside the connected wooden dollhouse beams matching image_53107f52.png.
 */
export const RoomBackdropSvg: React.FC<{
  type: RoomType;
  width: number;
  height: number;
  floor: number;
}> = React.memo(({ type, width, height, floor }) => {
  useSpritesReady();

  if (type === 'elevator') {
    // Central Core matching image_53107f52.png: Elevator Shaft in center flanked by twin wooden staircases/landings
    return (
      <svg
        viewBox="0 0 176 216"
        width={width}
        height={height}
        className="block select-none pointer-events-none"
      >
        {/* Left & Right Hallway/Stairwell Wings flanking the central elevator */}
        <rect x="0" y="6" width="176" height="196" fill="#E5C5A3" stroke={STROKE} strokeWidth="2.8" />

        {floor === 1 ? (
          /* Middle Floor: Twin Wooden Staircases flanking the Elevator Doors (matching middle center of image_53107f52.png) */
          <g>
            {[0, 1, 2, 3, 4, 5, 6, 7].map((step) => {
              const sy = 44 + step * 18;
              return (
                <g key={step}>
                  {/* Left staircase */}
                  <rect x="8" y={sy} width="40" height="10" fill="#C79265" stroke={STROKE} strokeWidth="2" />
                  <rect x="8" y={sy + 10} width="40" height="8" fill="#A67249" stroke={STROKE} strokeWidth="2" />
                  {/* Right staircase */}
                  <rect x="128" y={sy} width="40" height="10" fill="#C79265" stroke={STROKE} strokeWidth="2" />
                  <rect x="128" y={sy + 10} width="40" height="8" fill="#A67249" stroke={STROKE} strokeWidth="2" />
                </g>
              );
            })}
            {/* Central Closed/Brushed-Metal Elevator Doors */}
            <rect x="48" y="8" width="80" height="186" fill="#909CA6" stroke={STROKE} strokeWidth="2.8" />
            <rect x="58" y="10" width="60" height="182" fill="#C5CDD3" stroke={STROKE} strokeWidth="2.4" />
            <line x1="88" y1="10" x2="88" y2="192" stroke={STROKE} strokeWidth="2.4" />
            {/* Elevator call button */}
            <rect x="120" y="102" width="6" height="12" rx="1.5" fill="#E6ECEF" stroke={STROKE} strokeWidth="1.6" />
          </g>
        ) : (
          /* Upper Floor Landing: Pink left alcove + Central Open Elevator Shaft + Warm right alcove */
          <g>
            <rect x="6" y="8" width="44" height="168" fill="#F2B8C6" stroke={STROKE} strokeWidth="2.2" />
            <rect x="126" y="8" width="44" height="168" fill="#DEC09C" stroke={STROKE} strokeWidth="2.2" />
            <rect x="20" y="74" width="26" height="92" fill="#C2A3D9" stroke={STROKE} strokeWidth="2.2" />
            <rect x="130" y="74" width="26" height="92" fill="#7FB8AD" stroke={STROKE} strokeWidth="2.2" />
            {/* Central Elevator Shaft */}
            <rect x="52" y="6" width="72" height="182" fill="#A8ADB2" stroke={STROKE} strokeWidth="2.8" />
            <polygon points="52,188 64,172 112,172 124,188" fill="#8D9399" stroke={STROKE} strokeWidth="2.2" />
            <line x1="88" y1="6" x2="88" y2="180" stroke={STROKE} strokeWidth="2.6" />
          </g>
        )}

        {/* Landing Floor */}
        <polygon points="4,202 22,184 154,184 172,202" fill="#E8C8A3" stroke={STROKE} strokeWidth="2.4" />
        {/* Wooden Timber Posts & Beams */}
        <rect x="0" y="0" width="12" height="216" fill="#B47B4E" stroke={STROKE} strokeWidth="2.8" />
        <rect x="164" y="0" width="12" height="216" fill="#B47B4E" stroke={STROKE} strokeWidth="2.8" />
        <rect x="44" y="6" width="10" height="182" fill="#B47B4E" stroke={STROKE} strokeWidth="2.5" />
        <rect x="122" y="6" width="10" height="182" fill="#B47B4E" stroke={STROKE} strokeWidth="2.5" />
        <rect x="0" y="0" width="176" height="10" fill="#B47B4E" stroke={STROKE} strokeWidth="2.8" />
        <rect x="0" y="202" width="176" height="14" fill="#B47B4E" stroke={STROKE} strokeWidth="2.8" />
      </svg>
    );
  }

  if (type === 'stairs') {
    return (
      <svg
        viewBox="0 0 176 216"
        width={width}
        height={height}
        className="block select-none pointer-events-none"
      >
        <rect x="0" y="6" width="176" height="196" fill="#AEB2B5" stroke={STROKE} strokeWidth="2.8" />
        <polygon points="12,10 68,10 68,72 34,72" fill="#AC7A50" stroke={STROKE} strokeWidth="2.2" />
        {/* Wooden Steps on right half matching bottom center of image_53107f52.png */}
        {[0, 1, 2, 3, 4, 5, 6].map((step) => {
          const sy = 64 + step * 18;
          return (
            <g key={step}>
              <rect x="86" y={sy} width="66" height="10" fill="#C79265" stroke={STROKE} strokeWidth="2.2" />
              <rect x="86" y={sy + 10} width="66" height="8" fill="#A67249" stroke={STROKE} strokeWidth="2.2" />
            </g>
          );
        })}
        <polygon points="12,202 32,186 154,186 164,202" fill="#DFBC96" stroke={STROKE} strokeWidth="2.4" />
        <rect x="0" y="0" width="12" height="216" fill="#B47B4E" stroke={STROKE} strokeWidth="2.8" />
        <rect x="164" y="0" width="12" height="216" fill="#B47B4E" stroke={STROKE} strokeWidth="2.8" />
        <rect x="0" y="0" width="176" height="10" fill="#B47B4E" stroke={STROKE} strokeWidth="2.8" />
        <rect x="0" y="202" width="176" height="14" fill="#B47B4E" stroke={STROKE} strokeWidth="2.8" />
      </svg>
    );
  }

  const slicedRoomUrl = getSlicedSpriteUrl(`room_${type}`);

  return (
    <svg
      viewBox="0 0 348 216"
      width={width}
      height={height}
      className="block select-none pointer-events-none"
    >
      {/* Room Interior from Sheet 4 */}
      {slicedRoomUrl ? (
        <image
          href={slicedRoomUrl}
          x="6"
          y="8"
          width="336"
          height="196"
          preserveAspectRatio="none"
        />
      ) : (
        <rect x="6" y="8" width="336" height="196" fill="#FAF0E1" />
      )}

      {/* For Sunlit Wood Studio ('empty'), add warm wood wainscoting matching Floor 1 Right of image_53107f52.png */}
      {type === 'empty' && (
        <g opacity="0.9">
          <rect x="48" y="114" width="252" height="58" fill="#D5A67E" stroke={STROKE} strokeWidth="2.2" />
          {[70, 94, 118, 142, 166, 190, 214, 238, 262, 286].map((wx) => (
            <line key={wx} x1={wx} y1="114" x2={wx} y2="172" stroke="#9E6E48" strokeWidth="1.6" />
          ))}
        </g>
      )}

      {/* Side Wooden Doorframe Trim */}
      <polygon
        points="10,196 10,82 28,72 28,178"
        fill="none"
        stroke="#9B6640"
        strokeWidth="3.5"
        strokeLinejoin="round"
      />

      {/* Connected Dollhouse Timber Frame (Top Ceiling Beam, Bottom Floor Slab, Left/Right Timber Posts) */}
      <rect x="0" y="0" width="348" height="10" fill="#B47B4E" stroke={STROKE} strokeWidth="2.8" />
      <rect x="0" y="202" width="348" height="14" fill="#B47B4E" stroke={STROKE} strokeWidth="2.8" />
      <line x1="8" y1="209" x2="340" y2="209" stroke="#8C5A34" strokeWidth="1.5" />
      <rect x="0" y="0" width="8" height="216" fill="#B47B4E" stroke={STROKE} strokeWidth="2.4" />
      <rect x="340" y="0" width="8" height="216" fill="#B47B4E" stroke={STROKE} strokeWidth="2.4" />
    </svg>
  );
});

/**
 * Renders any of the furniture & decor items directly from the Canvas-sliced Sheet 3 sprites!
 */
export const FurnitureSvg: React.FC<{
  itemId: string;
  toggled?: boolean;
  className?: string;
}> = React.memo(({ itemId, toggled = false, className = '' }) => {
  useSpritesReady();
  const spriteUrl = getSlicedSpriteUrl(itemId);

  if (spriteUrl) {
    return (
      <div className={`relative w-full h-full select-none pointer-events-none ${className}`}>
        {toggled && itemId === 'mushroom_nightstand' && (
          <div
            className="absolute left-1/2 top-2 -translate-x-1/2 w-12 h-12 rounded-full pointer-events-none"
            style={{ background: 'radial-gradient(circle, rgba(255,232,120,0.55) 0%, rgba(255,232,120,0) 70%)' }}
          />
        )}
        <img
          src={spriteUrl}
          alt={itemId}
          draggable={false}
          className="w-full h-full object-contain select-none pointer-events-none"
        />
      </div>
    );
  }

  return <div className={`w-full h-full rounded-lg bg-[#FCE1D8]/40 ${className}`} />;
});
