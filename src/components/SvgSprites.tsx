import React from 'react';
import { FairyPose, RoomType } from '../game/rules';

const STROKE = '#231F20';

/**
 * Renders the 2D cutaway dollhouse room interior matching Sheet 3 ("Волшебная спальня", "Уютная кухня",
 * "Комната-сад", "Шахта лифта", "Пустая комната для строительства", "Лестничный пролет").
 */
export const RoomBackdropSvg: React.FC<{
  type: RoomType;
  width: number;
  height: number;
  floor: number;
}> = React.memo(({ type, width, height }) => {
  if (type === 'elevator') {
    return (
      <svg
        viewBox="0 0 136 236"
        width={width}
        height={height}
        className="block select-none pointer-events-none"
      >
        {/* Outer shaft wall */}
        <rect
          x="4"
          y="3"
          width="128"
          height="230"
          rx="10"
          fill="#8E9296"
          stroke={STROKE}
          strokeWidth="3.5"
        />
        {/* Inner perspective walls */}
        <polygon
          points="8,6 32,22 32,204 8,228"
          fill="#7B7F83"
          stroke={STROKE}
          strokeWidth="2.5"
        />
        <polygon
          points="128,6 104,22 104,204 128,228"
          fill="#7B7F83"
          stroke={STROKE}
          strokeWidth="2.5"
        />
        {/* Back wall */}
        <rect
          x="32"
          y="22"
          width="72"
          height="182"
          fill="#9DA2A6"
          stroke={STROKE}
          strokeWidth="2.5"
        />
        {/* Side window cutouts (2 on left, 2 on right as in Sheet 3) */}
        <polygon
          points="13,38 27,45 27,96 13,92"
          fill="#F5F9FC"
          stroke={STROKE}
          strokeWidth="2.5"
        />
        <polygon
          points="13,128 27,132 27,182 13,188"
          fill="#F5F9FC"
          stroke={STROKE}
          strokeWidth="2.5"
        />
        <polygon
          points="123,38 109,45 109,96 123,92"
          fill="#F5F9FC"
          stroke={STROKE}
          strokeWidth="2.5"
        />
        <polygon
          points="123,128 109,132 109,182 123,188"
          fill="#F5F9FC"
          stroke={STROKE}
          strokeWidth="2.5"
        />
        {/* Guide rails */}
        <line x1="54" y1="6" x2="54" y2="204" stroke="#5A5E62" strokeWidth="2" />
        <line x1="82" y1="6" x2="82" y2="204" stroke="#5A5E62" strokeWidth="2" />
        {/* Floor platform */}
        <polygon
          points="8,228 32,204 104,204 128,228"
          fill="#B6BCC0"
          stroke={STROKE}
          strokeWidth="2.5"
        />
        <polygon
          points="22,222 36,208 100,208 114,222"
          fill="#90969B"
          stroke={STROKE}
          strokeWidth="2"
        />
        {/* Center cable */}
        <line x1="68" y1="4" x2="68" y2="215" stroke={STROKE} strokeWidth="3.5" />
        <ellipse cx="68" cy="215" rx="6" ry="2.5" fill="#5A5E62" stroke={STROKE} strokeWidth="2" />
      </svg>
    );
  }

  if (type === 'stairs') {
    return (
      <svg
        viewBox="0 0 136 236"
        width={width}
        height={height}
        className="block select-none pointer-events-none"
      >
        {/* Outer wooden casing */}
        <rect
          x="6"
          y="4"
          width="124"
          height="228"
          rx="12"
          fill="#D3A57C"
          stroke={STROKE}
          strokeWidth="3.5"
        />
        {/* Left & Right perspective walls */}
        <polygon
          points="12,10 38,24 38,208 12,226"
          fill="#C59268"
          stroke={STROKE}
          strokeWidth="2.5"
        />
        <polygon
          points="124,10 98,24 98,208 124,226"
          fill="#B9855B"
          stroke={STROKE}
          strokeWidth="2.5"
        />
        {/* Upper bright doorway opening */}
        <rect
          x="38"
          y="12"
          width="60"
          height="120"
          fill="#FFFDF9"
          stroke={STROKE}
          strokeWidth="2.5"
        />
        {/* 6 Wooden Steps */}
        {[0, 1, 2, 3, 4, 5].map((step) => {
          const sy = 128 + step * 15;
          const sw = 60 + step * 6;
          const sx = 68 - sw / 2;
          return (
            <g key={step}>
              <rect
                x={sx}
                y={sy}
                width={sw}
                height="9"
                fill="#E0B68F"
                stroke={STROKE}
                strokeWidth="2.2"
              />
              <rect
                x={sx}
                y={sy + 9}
                width={sw}
                height="6"
                fill="#B8845A"
                stroke={STROKE}
                strokeWidth="2.2"
              />
            </g>
          );
        })}
      </svg>
    );
  }

  // Full-width rooms (352 x 236) matching Sheet 3
  return (
    <svg
      viewBox="0 0 352 236"
      width={width}
      height={height}
      className="block select-none pointer-events-none"
    >
      <defs>
        {/* Star pattern for Cozy Star Bedroom */}
        <pattern id="starWallPattern" width="44" height="40" patternUnits="userSpaceOnUse">
          <path
            d="M12,6 L14,11 L19,11 L15,14 L16.5,19 L12,16 L7.5,19 L9,14 L5,11 L10,11 Z"
            fill="#F8E28C"
            opacity="0.85"
          />
          <path
            d="M34,24 L35.5,28 L39.5,28 L36.2,30.5 L37.5,34.5 L34,32 L30.5,34.5 L31.8,30.5 L28.5,28 L32.5,28 Z"
            fill="#F8E28C"
            opacity="0.75"
          />
          <circle cx="26" cy="10" r="1.5" fill="#FFF3B8" />
          <circle cx="8" cy="30" r="1.5" fill="#FFF3B8" />
        </pattern>

        {/* Tile pattern for Mint Kitchen backsplash */}
        <pattern id="kitchenTilePattern" width="16" height="16" patternUnits="userSpaceOnUse">
          <rect width="16" height="16" fill="#F2F7F5" />
          <path d="M 16 0 L 0 0 0 16" fill="none" stroke="#8CA89E" strokeWidth="1.2" />
        </pattern>

        {/* Floral wallpaper pattern for Garden Room */}
        <pattern id="gardenFloralPattern" width="42" height="42" patternUnits="userSpaceOnUse">
          <rect width="42" height="42" fill="#FDF3E3" />
          {/* Little leaf sprigs */}
          <ellipse cx="10" cy="18" rx="4" ry="2" transform="rotate(-25 10 18)" fill="#A9C99B" />
          <ellipse cx="18" cy="10" rx="4" ry="2" transform="rotate(30 18 10)" fill="#A9C99B" />
          <ellipse cx="31" cy="36" rx="4" ry="2" transform="rotate(-20 31 36)" fill="#A9C99B" />
          {/* Pink blossom 1 */}
          <g transform="translate(14,14)">
            <circle cx="0" cy="-4.5" r="3.2" fill="#F7B2BE" />
            <circle cx="4.3" cy="-1.4" r="3.2" fill="#F7B2BE" />
            <circle cx="2.6" cy="3.6" r="3.2" fill="#F7B2BE" />
            <circle cx="-2.6" cy="3.6" r="3.2" fill="#F7B2BE" />
            <circle cx="-4.3" cy="-1.4" r="3.2" fill="#F7B2BE" />
            <circle cx="0" cy="0" r="2.2" fill="#F6D57A" />
          </g>
          {/* Pink blossom 2 */}
          <g transform="translate(33,29) scale(0.85)">
            <circle cx="0" cy="-4.5" r="3.2" fill="#F59FB0" />
            <circle cx="4.3" cy="-1.4" r="3.2" fill="#F59FB0" />
            <circle cx="2.6" cy="3.6" r="3.2" fill="#F59FB0" />
            <circle cx="-2.6" cy="3.6" r="3.2" fill="#F59FB0" />
            <circle cx="-4.3" cy="-1.4" r="3.2" fill="#F59FB0" />
            <circle cx="0" cy="0" r="2.2" fill="#F6D57A" />
          </g>
        </pattern>
      </defs>

      {/* Outer Rounded Wooden Dollhouse Frame */}
      <rect
        x="3"
        y="3"
        width="346"
        height="230"
        rx="18"
        fill="#D8B088"
        stroke={STROKE}
        strokeWidth="3.5"
      />
      {/* Inner Room Cutout Frame */}
      <rect
        x="12"
        y="12"
        width="328"
        height="212"
        rx="11"
        fill="#FFFDF9"
        stroke={STROKE}
        strokeWidth="2.8"
      />

      {/* Ceiling perspective trapezoid */}
      <polygon
        points="14,13 338,13 298,34 54,34"
        fill={
          type === 'bedroom'
            ? '#F6E1EB'
            : type === 'kitchen'
              ? '#E5F4EE'
              : type === 'garden'
                ? '#EEF6EA'
                : '#FAF0E1'
        }
        stroke={STROKE}
        strokeWidth="2.2"
      />

      {/* Left Wall perspective trapezoid */}
      <polygon
        points="13,14 54,34 54,184 13,221"
        fill={
          type === 'bedroom'
            ? '#F7C2D4'
            : type === 'kitchen'
              ? '#8CCBB8'
              : type === 'garden'
                ? 'url(#gardenFloralPattern)'
                : '#EAD2B5'
        }
        stroke={STROKE}
        strokeWidth="2.2"
      />

      {/* Right Wall perspective trapezoid */}
      <polygon
        points="339,14 298,34 298,184 339,221"
        fill={
          type === 'bedroom'
            ? '#C8ADE8'
            : type === 'kitchen'
              ? '#8CCBB8'
              : type === 'garden'
                ? 'url(#gardenFloralPattern)'
                : '#E2C6A6'
        }
        stroke={STROKE}
        strokeWidth="2.2"
      />

      {/* Back Wall */}
      <rect
        x="54"
        y="34"
        width="244"
        height="150"
        fill={
          type === 'bedroom'
            ? '#D2B8F0'
            : type === 'kitchen'
              ? '#9FDAC8'
              : type === 'garden'
                ? 'url(#gardenFloralPattern)'
                : '#F5DEC4'
        }
        stroke={STROKE}
        strokeWidth="2.2"
      />

      {/* Bedroom Star Overlay + Round Window + Right Arched Doorway */}
      {type === 'bedroom' && (
        <g>
          <rect x="55" y="35" width="242" height="148" fill="url(#starWallPattern)" />
          {/* Baseboard */}
          <rect
            x="54"
            y="177"
            width="244"
            height="7"
            fill="#DCAB80"
            stroke={STROKE}
            strokeWidth="2"
          />
          {/* Round Wooden Window */}
          <circle
            cx="176"
            cy="88"
            r="30"
            fill="#D8A778"
            stroke={STROKE}
            strokeWidth="2.5"
          />
          <circle
            cx="176"
            cy="88"
            r="23"
            fill="#BCE4FA"
            stroke={STROKE}
            strokeWidth="2.2"
          />
          {/* Window Cross Bars */}
          <rect x="173.5" y="65" width="5" height="46" fill="#D8A778" stroke={STROKE} strokeWidth="1.8" />
          <rect x="153" y="85.5" width="46" height="5" fill="#D8A778" stroke={STROKE} strokeWidth="1.8" />
          {/* Right Wall Arched Doorway */}
          <path
            d="M 314 198 L 314 82 Q 323 64 332 82 L 332 214 Z"
            fill="#F9D7E5"
            stroke={STROKE}
            strokeWidth="2.2"
          />
        </g>
      )}

      {/* Kitchen Backsplash Tiles + Round Window */}
      {type === 'kitchen' && (
        <g>
          {/* Tiled lower back wall */}
          <rect
            x="54"
            y="118"
            width="244"
            height="66"
            fill="url(#kitchenTilePattern)"
            stroke={STROKE}
            strokeWidth="2"
          />
          {/* Baseboard */}
          <rect
            x="54"
            y="178"
            width="244"
            height="6"
            fill="#D39D70"
            stroke={STROKE}
            strokeWidth="2"
          />
          {/* Round Window */}
          <circle
            cx="176"
            cy="74"
            r="24"
            fill="#D8A778"
            stroke={STROKE}
            strokeWidth="2.4"
          />
          <circle
            cx="176"
            cy="74"
            r="18"
            fill="#C7EAFB"
            stroke={STROKE}
            strokeWidth="2"
          />
          <rect x="174" y="56" width="4" height="36" fill="#D8A778" stroke={STROKE} strokeWidth="1.6" />
          <rect x="158" y="72" width="36" height="4" fill="#D8A778" stroke={STROKE} strokeWidth="1.6" />
        </g>
      )}

      {/* Garden Room Ivy Garlands + Right Arched Doorway */}
      {type === 'garden' && (
        <g>
          {/* Hanging ivy swags along top ceiling */}
          <path
            d="M 16 42 Q 52 78 92 35 Q 134 68 176 35 Q 218 68 260 35 Q 298 76 336 42"
            fill="none"
            stroke="#3A6B33"
            strokeWidth="3.5"
            strokeLinecap="round"
          />
          {[28, 46, 68, 84, 108, 130, 152, 174, 198, 220, 242, 266, 288, 310, 326].map(
            (lx, idx) => {
              const ly = idx % 2 === 0 ? 48 : 56;
              return (
                <ellipse
                  key={lx}
                  cx={lx}
                  cy={ly}
                  rx="6"
                  ry="8"
                  fill={idx % 3 === 0 ? '#77B255' : '#589442'}
                  stroke={STROKE}
                  strokeWidth="1.8"
                />
              );
            }
          )}
          {/* Right Wall Arched Garden Doorway */}
          <path
            d="M 314 198 L 314 78 Q 323 62 332 78 L 332 214 Z"
            fill="#B7E3FA"
            stroke={STROKE}
            strokeWidth="2.2"
          />
        </g>
      )}

      {/* Floor Surface */}
      {type === 'garden' ? (
        <g>
          {/* Lush green grass floor matching Sheet 3 */}
          <polygon
            points="14,222 54,184 298,184 338,222"
            fill="#75AD5B"
            stroke={STROKE}
            strokeWidth="2.4"
          />
          {/* Grass blades along back edge */}
          <path
            d="M 54 184 L 60 179 L 64 184 L 72 178 L 77 184 L 90 179 L 95 184 L 112 178 L 118 184 L 140 179 L 145 184 L 170 178 L 176 184 L 204 178 L 210 184 L 236 179 L 242 184 L 268 178 L 274 184 L 292 179 L 298 184"
            fill="none"
            stroke="#4E823B"
            strokeWidth="2.2"
          />
          {/* Grass tufts */}
          {[
            [78, 202],
            [126, 212],
            [168, 198],
            [215, 210],
            [264, 200],
            [302, 214],
          ].map(([gx, gy], idx) => (
            <path
              key={idx}
              d={`M ${gx - 4} ${gy} Q ${gx - 2} ${gy - 5} ${gx} ${gy} Q ${gx + 2} ${gy - 5} ${gx + 4} ${gy}`}
              fill="none"
              stroke="#437431"
              strokeWidth="1.8"
              strokeLinecap="round"
            />
          ))}
        </g>
      ) : (
        <g>
          {/* Warm Wood Plank or Parquet Floor */}
          <polygon
            points="14,222 54,184 298,184 338,222"
            fill={type === 'kitchen' ? '#D6A679' : '#ECCCA8'}
            stroke={STROKE}
            strokeWidth="2.4"
          />
          {/* Horizontal plank lines */}
          <line x1="42" y1="195" x2="310" y2="195" stroke="#B68960" strokeWidth="1.5" />
          <line x1="30" y1="206" x2="322" y2="206" stroke="#B68960" strokeWidth="1.5" />
          <line x1="20" y1="215" x2="332" y2="215" stroke="#B68960" strokeWidth="1.5" />
          {type === 'kitchen' && (
            <g stroke="#B28054" strokeWidth="1.4" opacity="0.75">
              <line x1="90" y1="184" x2="72" y2="222" />
              <line x1="145" y1="184" x2="134" y2="222" />
              <line x1="205" y1="184" x2="216" y2="222" />
              <line x1="260" y1="184" x2="278" y2="222" />
            </g>
          )}
        </g>
      )}
    </svg>
  );
});

/**
 * Renders any of the 16 furniture & decor items from Sheet 4 in crisp thick-outlined cartoon SVG.
 */
export const FurnitureSvg: React.FC<{
  itemId: string;
  toggled?: boolean;
  className?: string;
}> = React.memo(({ itemId, toggled = false, className = '' }) => {
  switch (itemId) {
    case 'pink_bed':
      return (
        <svg viewBox="0 0 140 86" className={`w-full h-full overflow-visible ${className}`}>
          {/* Soft floor shadow */}
          <ellipse cx="70" cy="81" rx="64" ry="6" fill="rgba(35,31,32,0.14)" />
          {/* Headboard back */}
          <path
            d="M 10 80 L 10 24 Q 10 18 16 18 L 20 18 Q 30 6 44 10 L 44 64 L 10 80 Z"
            fill="#F494BC"
            stroke={STROKE}
            strokeWidth="3.2"
            strokeLinejoin="round"
          />
          {/* Mattress base */}
          <polygon
            points="18,54 46,38 130,44 106,66"
            fill="#F8D5E6"
            stroke={STROKE}
            strokeWidth="3"
            strokeLinejoin="round"
          />
          {/* Lavender Pillow */}
          <path
            d="M 24 44 Q 36 28 58 32 Q 66 36 52 48 Q 36 52 24 44 Z"
            fill="#B79CED"
            stroke={STROKE}
            strokeWidth="3"
          />
          {/* Purple Duvet Blanket */}
          <path
            d="M 46 54 Q 54 34 74 36 L 122 40 Q 130 44 124 62 L 60 66 Z"
            fill="#9B7EDE"
            stroke={STROKE}
            strokeWidth="3.2"
            strokeLinejoin="round"
          />
          {/* Lighter Lilac Fold Strip */}
          <path
            d="M 42 55 Q 50 34 66 35 L 76 36 Q 62 42 56 64 L 42 62 Z"
            fill="#C7B2F5"
            stroke={STROKE}
            strokeWidth="2.8"
          />
          {/* Front Frame & Footboard */}
          <path
            d="M 10 56 L 104 60 L 104 82 L 96 82 L 96 70 L 18 68 L 18 80 L 10 80 Z"
            fill="#F494BC"
            stroke={STROKE}
            strokeWidth="3.2"
            strokeLinejoin="round"
          />
          <path
            d="M 104 82 L 104 52 Q 118 40 128 42 L 128 32 L 134 32 L 134 68 L 128 68 L 128 60 L 110 74 L 110 82 Z"
            fill="#EE82B0"
            stroke={STROKE}
            strokeWidth="3.2"
            strokeLinejoin="round"
          />
        </svg>
      );

    case 'mushroom_nightstand':
      return (
        <svg viewBox="0 0 64 88" className={`w-full h-full overflow-visible ${className}`}>
          <ellipse cx="32" cy="83" rx="26" ry="5" fill="rgba(35,31,32,0.15)" />
          {/* Warm glow when toggled */}
          {toggled && (
            <circle cx="32" cy="24" r="24" fill="rgba(255, 230, 128, 0.42)" />
          )}
          {/* Wooden Nightstand */}
          <rect x="10" y="54" width="6" height="28" fill="#B57C50" stroke={STROKE} strokeWidth="2.8" />
          <rect x="48" y="54" width="6" height="28" fill="#B57C50" stroke={STROKE} strokeWidth="2.8" />
          <rect x="16" y="52" width="5" height="23" fill="#9A653E" stroke={STROKE} strokeWidth="2.5" />
          <rect x="43" y="52" width="5" height="23" fill="#9A653E" stroke={STROKE} strokeWidth="2.5" />
          <rect
            x="8"
            y="40"
            width="48"
            height="20"
            rx="3"
            fill="#C88D5D"
            stroke={STROKE}
            strokeWidth="3"
          />
          <polygon
            points="6,40 14,33 50,33 58,40"
            fill="#DDA474"
            stroke={STROKE}
            strokeWidth="3"
            strokeLinejoin="round"
          />
          {/* Drawer */}
          <rect
            x="14"
            y="44"
            width="36"
            height="11"
            rx="2"
            fill="#B77D4E"
            stroke={STROKE}
            strokeWidth="2.4"
          />
          <circle cx="32" cy="49.5" r="2.5" fill="#E6B88A" stroke={STROKE} strokeWidth="2" />
          {/* Mushroom Lamp Stem */}
          <path
            d="M 25 36 Q 23 26 27 20 L 37 20 Q 41 26 39 36 Z"
            fill="#FDF0D5"
            stroke={STROKE}
            strokeWidth="2.8"
          />
          {/* Spotted Red Mushroom Cap */}
          <path
            d="M 14 22 Q 15 4 32 4 Q 49 4 50 22 Q 32 26 14 22 Z"
            fill="#EE6B5E"
            stroke={STROKE}
            strokeWidth="3"
          />
          <circle cx="24" cy="14" r="3.5" fill="#FFFDF9" />
          <circle cx="34" cy="10" r="3" fill="#FFFDF9" />
          <circle cx="41" cy="16" r="3.2" fill="#FFFDF9" />
        </svg>
      );

    case 'dollhouse_table':
      return (
        <svg viewBox="0 0 72 88" className={`w-full h-full overflow-visible ${className}`}>
          <ellipse cx="36" cy="83" rx="28" ry="5" fill="rgba(35,31,32,0.15)" />
          {/* Table legs & top */}
          <rect x="12" y="50" width="6" height="32" fill="#C48A5A" stroke={STROKE} strokeWidth="2.8" />
          <rect x="52" y="50" width="6" height="32" fill="#C48A5A" stroke={STROKE} strokeWidth="2.8" />
          <rect x="18" y="50" width="5" height="25" fill="#9E6A40" stroke={STROKE} strokeWidth="2.4" />
          <rect x="47" y="50" width="5" height="25" fill="#9E6A40" stroke={STROKE} strokeWidth="2.4" />
          <polygon
            points="8,46 16,38 56,38 64,46"
            fill="#DBA273"
            stroke={STROKE}
            strokeWidth="3"
            strokeLinejoin="round"
          />
          <rect x="8" y="46" width="56" height="6" fill="#C48A5A" stroke={STROKE} strokeWidth="2.8" />
          {/* Mini Dollhouse */}
          <rect x="16" y="22" width="30" height="20" fill="#F6DC9F" stroke={STROKE} strokeWidth="2.8" />
          <polygon
            points="13,22 31,8 49,22"
            fill="#EA6D60"
            stroke={STROKE}
            strokeWidth="2.8"
            strokeLinejoin="round"
          />
          <rect x="28" y="30" width="6" height="12" fill="#B57C50" stroke={STROKE} strokeWidth="2" />
          <rect x="19" y="26" width="6" height="6" fill="#BCE4FA" stroke={STROKE} strokeWidth="2" />
          <rect x="37" y="26" width="6" height="6" fill="#BCE4FA" stroke={STROKE} strokeWidth="2" />
          {/* Cute Teddy Bear beside dollhouse */}
          <circle cx="51" cy="30" r="3" fill="#D58B70" stroke={STROKE} strokeWidth="2" />
          <circle cx="59" cy="30" r="3" fill="#D58B70" stroke={STROKE} strokeWidth="2" />
          <circle cx="55" cy="34" r="5.5" fill="#DF9A80" stroke={STROKE} strokeWidth="2.4" />
          <ellipse cx="55" cy="41" rx="5" ry="4.5" fill="#DF9A80" stroke={STROKE} strokeWidth="2.4" />
        </svg>
      );

    case 'pink_chair':
      return (
        <svg viewBox="0 0 58 82" className={`w-full h-full overflow-visible ${className}`}>
          <ellipse cx="29" cy="77" rx="22" ry="5" fill="rgba(35,31,32,0.15)" />
          {/* Wooden Legs */}
          <line x1="16" y1="50" x2="12" y2="76" stroke="#C58B5B" strokeWidth="5" strokeLinecap="round" />
          <line x1="16" y1="50" x2="12" y2="76" stroke={STROKE} strokeWidth="2.5" strokeLinecap="round" />
          <line x1="42" y1="50" x2="46" y2="76" stroke="#C58B5B" strokeWidth="5" strokeLinecap="round" />
          <line x1="42" y1="50" x2="46" y2="76" stroke={STROKE} strokeWidth="2.5" strokeLinecap="round" />
          <line x1="21" y1="50" x2="19" y2="71" stroke="#9E693F" strokeWidth="4" strokeLinecap="round" />
          <line x1="37" y1="50" x2="39" y2="71" stroke="#9E693F" strokeWidth="4" strokeLinecap="round" />
          {/* Oval Pink Backrest */}
          <ellipse cx="29" cy="26" rx="19" ry="21" fill="#F69AC0" stroke={STROKE} strokeWidth="3" />
          <ellipse cx="29" cy="26" rx="14" ry="16" fill="#EE81AD" stroke={STROKE} strokeWidth="2.2" />
          {/* Padded Pink Seat */}
          <ellipse cx="29" cy="48" rx="20" ry="8" fill="#F69AC0" stroke={STROKE} strokeWidth="3" />
        </svg>
      );

    case 'hanging_lamp':
      return (
        <svg viewBox="0 0 48 60" className={`w-full h-full overflow-visible ${className}`}>
          {toggled && <circle cx="24" cy="40" r="26" fill="rgba(255, 232, 130, 0.45)" />}
          <line x1="24" y1="0" x2="24" y2="24" stroke={STROKE} strokeWidth="3" />
          <path
            d="M 10 38 Q 12 20 24 20 Q 36 20 38 38 Z"
            fill="#F9D77E"
            stroke={STROKE}
            strokeWidth="2.8"
          />
          <circle cx="24" cy="41" r="6" fill="#FFF8D6" stroke={STROKE} strokeWidth="2.2" />
        </svg>
      );

    case 'mint_oven':
      return (
        <svg viewBox="0 0 82 90" className={`w-full h-full overflow-visible ${className}`}>
          <ellipse cx="41" cy="85" rx="36" ry="5" fill="rgba(35,31,32,0.15)" />
          {/* Backguard & Stovetop */}
          <rect
            x="14"
            y="8"
            width="54"
            height="10"
            rx="3"
            fill="#A6E3D5"
            stroke={STROKE}
            strokeWidth="2.8"
          />
          <polygon
            points="8,28 14,16 68,16 74,28"
            fill="#7D858C"
            stroke={STROKE}
            strokeWidth="2.8"
            strokeLinejoin="round"
          />
          {/* 4 Burners */}
          <ellipse cx="26" cy="20" rx="6" ry="2" fill="#464B50" stroke={STROKE} strokeWidth="1.8" />
          <ellipse cx="56" cy="20" rx="6" ry="2" fill="#464B50" stroke={STROKE} strokeWidth="1.8" />
          <ellipse cx="24" cy="25" rx="7" ry="2.2" fill="#464B50" stroke={STROKE} strokeWidth="1.8" />
          <ellipse cx="58" cy="25" rx="7" ry="2.2" fill="#464B50" stroke={STROKE} strokeWidth="1.8" />
          {/* Main Oven Body */}
          <rect
            x="8"
            y="28"
            width="66"
            height="54"
            rx="4"
            fill="#A6E3D5"
            stroke={STROKE}
            strokeWidth="3"
          />
          {/* 5 Control Knobs */}
          {[19, 30, 41, 52, 63].map((kx) => (
            <circle
              key={kx}
              cx={kx}
              cy="35"
              r="3"
              fill="#D4ECE6"
              stroke={STROKE}
              strokeWidth="2"
            />
          ))}
          {/* Oven Door */}
          <rect
            x="14"
            y="42"
            width="54"
            height="32"
            rx="4"
            fill="#BCEBE0"
            stroke={STROKE}
            strokeWidth="2.6"
          />
          {/* Handle */}
          <line x1="20" y1="46" x2="62" y2="46" stroke="#FFFFFF" strokeWidth="3.5" strokeLinecap="round" />
          <line x1="20" y1="46" x2="62" y2="46" stroke={STROKE} strokeWidth="2" strokeLinecap="round" />
          {/* Oven Window */}
          <rect
            x="19"
            y="50"
            width="44"
            height="20"
            rx="2"
            fill={toggled ? '#F7C97E' : '#7E868C'}
            stroke={STROKE}
            strokeWidth="2.4"
          />
          <line x1="20" y1="62" x2="62" y2="62" stroke="#D0D5D9" strokeWidth="2" />
        </svg>
      );

    case 'kitchen_shelf':
      return (
        <svg viewBox="0 0 116 48" className={`w-full h-full overflow-visible ${className}`}>
          {/* Wooden brackets & shelf plank */}
          <polygon points="18,36 24,36 21,44 16,44" fill="#B57C50" stroke={STROKE} strokeWidth="2.4" />
          <polygon points="92,36 98,36 95,44 90,44" fill="#B57C50" stroke={STROKE} strokeWidth="2.4" />
          <rect
            x="6"
            y="30"
            width="104"
            height="6"
            rx="3"
            fill="#D69F72"
            stroke={STROKE}
            strokeWidth="2.8"
          />
          {/* Tall Jar */}
          <rect x="16" y="10" width="16" height="20" rx="3" fill="#EBF6FA" stroke={STROKE} strokeWidth="2.4" />
          <rect x="17.5" y="17" width="13" height="11.5" rx="1.5" fill="#F2D7B4" />
          <rect x="18" y="6" width="12" height="4" rx="1.5" fill="#B8D4E3" stroke={STROKE} strokeWidth="2.2" />
          {/* Small Cocoa Jar */}
          <rect x="36" y="14" width="15" height="16" rx="3" fill="#EBF6FA" stroke={STROKE} strokeWidth="2.4" />
          <rect x="37.5" y="20" width="12" height="8.5" rx="1.5" fill="#A06B49" />
          <rect x="37.5" y="10" width="12" height="4" rx="1.5" fill="#D69F72" stroke={STROKE} strokeWidth="2.2" />
          {/* Stacked Plates */}
          <ellipse cx="68" cy="27" rx="14" ry="3.2" fill="#E4D4F4" stroke={STROKE} strokeWidth="2.2" />
          <ellipse cx="68" cy="24" rx="14" ry="3.2" fill="#FCEBF2" stroke={STROKE} strokeWidth="2.2" />
          {/* Two Stacked Mugs (Mint bottom, Purple top) */}
          <path d="M 86 19 L 99 19 L 98 30 L 87 30 Z" fill="#A0DEC9" stroke={STROKE} strokeWidth="2.4" />
          <path d="M 99 21 Q 104 24 98 28" fill="none" stroke={STROKE} strokeWidth="2.4" />
          <path d="M 87 9 L 98 9 L 97 19 L 88 19 Z" fill="#C9A9EB" stroke={STROKE} strokeWidth="2.4" />
        </svg>
      );

    case 'dining_table':
      return (
        <svg viewBox="0 0 96 66" className={`w-full h-full overflow-visible ${className}`}>
          <ellipse cx="48" cy="60" rx="34" ry="5.5" fill="rgba(35,31,32,0.15)" />
          {/* Central Pedestal Base */}
          <ellipse cx="48" cy="58" rx="14" ry="4.5" fill="#DFAA82" stroke={STROKE} strokeWidth="2.8" />
          <rect x="44" y="26" width="8" height="32" fill="#D69B70" stroke={STROKE} strokeWidth="2.8" />
          {/* Round Tabletop */}
          <ellipse cx="48" cy="23" rx="43" ry="12" fill="#DFAA82" stroke={STROKE} strokeWidth="2.8" />
          <ellipse cx="48" cy="20" rx="43" ry="12" fill="#F3C8A6" stroke={STROKE} strokeWidth="3" />
        </svg>
      );

    case 'dining_chair':
      return (
        <svg viewBox="0 0 54 72" className={`w-full h-full overflow-visible ${className}`}>
          <ellipse cx="27" cy="67" rx="20" ry="4.5" fill="rgba(35,31,32,0.15)" />
          {/* Chair Legs */}
          <line x1="14" y1="42" x2="11" y2="66" stroke="#C88D63" strokeWidth="4.5" strokeLinecap="round" />
          <line x1="14" y1="42" x2="11" y2="66" stroke={STROKE} strokeWidth="2.4" strokeLinecap="round" />
          <line x1="40" y1="42" x2="43" y2="66" stroke="#C88D63" strokeWidth="4.5" strokeLinecap="round" />
          <line x1="40" y1="42" x2="43" y2="66" stroke={STROKE} strokeWidth="2.4" strokeLinecap="round" />
          <line x1="18" y1="24" x2="18" y2="42" stroke={STROKE} strokeWidth="3" />
          <line x1="36" y1="24" x2="36" y2="42" stroke={STROKE} strokeWidth="3" />
          {/* Seat */}
          <ellipse cx="27" cy="41" rx="18" ry="6.5" fill="#F1C29E" stroke={STROKE} strokeWidth="2.8" />
          {/* Backrest */}
          <rect
            x="11"
            y="8"
            width="32"
            height="17"
            rx="5"
            fill="#F1C29E"
            stroke={STROKE}
            strokeWidth="2.8"
          />
        </svg>
      );

    case 'yellow_fridge':
      return (
        <svg viewBox="0 0 76 116" className={`w-full h-full overflow-visible ${className}`}>
          <ellipse cx="38" cy="111" rx="32" ry="5.5" fill="rgba(35,31,32,0.16)" />
          {/* Feet */}
          <rect x="14" y="104" width="7" height="6" rx="2" fill="#8C9398" stroke={STROKE} strokeWidth="2.4" />
          <rect x="53" y="104" width="7" height="6" rx="2" fill="#8C9398" stroke={STROKE} strokeWidth="2.4" />
          {/* Main Rounded Retro Body */}
          <rect
            x="8"
            y="6"
            width="60"
            height="100"
            rx="12"
            fill="#FDF096"
            stroke={STROKE}
            strokeWidth="3.2"
          />
          {/* Side depth shading */}
          <path
            d="M 56 8 L 62 12 L 62 102 L 56 105 Z"
            fill="#F3DC6D"
          />
          {/* Freezer / Fridge divider line */}
          <line x1="8" y1="45" x2="60" y2="45" stroke={STROKE} strokeWidth="2.8" />
          {/* Silver Handles */}
          <rect x="13" y="34" width="14" height="4.5" rx="2" fill="#D9E2E8" stroke={STROKE} strokeWidth="2.2" />
          <rect x="13" y="52" width="14" height="4.5" rx="2" fill="#D9E2E8" stroke={STROKE} strokeWidth="2.2" />
        </svg>
      );

    case 'bubble_chair':
      return (
        <svg viewBox="0 0 86 118" className={`w-full h-full overflow-visible ${className}`}>
          {/* Floor shadow below hanging chair */}
          <ellipse cx="43" cy="113" rx="28" ry="5" fill="rgba(35,31,32,0.12)" />
          {/* Hanging Rope & Ring */}
          <line x1="43" y1="0" x2="43" y2="20" stroke="#C58B5B" strokeWidth="4" />
          <line x1="43" y1="0" x2="43" y2="20" stroke={STROKE} strokeWidth="2.2" />
          <rect x="37" y="18" width="12" height="6" rx="2" fill="#D8A06F" stroke={STROKE} strokeWidth="2.4" />
          {/* Wicker Lattice Back */}
          <ellipse cx="43" cy="64" rx="35" ry="40" fill="#FFFDF9" stroke={STROKE} strokeWidth="3.2" />
          {/* Lattice Grid Lines */}
          <g stroke="#C88E5B" strokeWidth="3">
            <line x1="22" y1="32" x2="22" y2="94" />
            <line x1="34" y1="26" x2="34" y2="98" />
            <line x1="46" y1="26" x2="46" y2="98" />
            <line x1="58" y1="30" x2="58" y2="94" />
            <line x1="12" y1="46" x2="72" y2="46" />
            <line x1="10" y1="60" x2="74" y2="60" />
            <line x1="12" y1="74" x2="72" y2="74" />
          </g>
          {/* Plush Cream Seat Cushion */}
          <ellipse cx="45" cy="84" rx="25" ry="10" fill="#F5E5C9" stroke={STROKE} strokeWidth="2.8" />
          {/* Outer Rattan Rim */}
          <ellipse
            cx="43"
            cy="64"
            rx="35"
            ry="40"
            fill="none"
            stroke="#DFAA78"
            strokeWidth="5"
          />
          <ellipse
            cx="43"
            cy="64"
            rx="37"
            ry="41.5"
            fill="none"
            stroke={STROKE}
            strokeWidth="2.8"
          />
        </svg>
      );

    case 'flower_vine_pot':
      return (
        <svg viewBox="0 0 80 92" className={`w-full h-full overflow-visible ${className}`}>
          <ellipse cx="40" cy="87" rx="20" ry="4.5" fill="rgba(35,31,32,0.15)" />
          {/* Vine Stems */}
          <path
            d="M 38 62 Q 18 40 28 18 Q 38 4 50 22"
            fill="none"
            stroke="#4B8B3B"
            strokeWidth="3.2"
            strokeLinecap="round"
          />
          <path
            d="M 42 62 Q 62 42 54 24 Q 44 12 22 36"
            fill="none"
            stroke="#4B8B3B"
            strokeWidth="3.2"
            strokeLinecap="round"
          />
          <path
            d="M 45 64 Q 62 66 64 84"
            fill="none"
            stroke="#4B8B3B"
            strokeWidth="3.2"
            strokeLinecap="round"
          />
          {/* Leaves */}
          {[
            [24, 48],
            [18, 30],
            [36, 12],
            [56, 30],
            [52, 48],
            [60, 72],
          ].map(([lx, ly], i) => (
            <ellipse
              key={i}
              cx={lx}
              cy={ly}
              rx="6"
              ry="3.5"
              fill="#6AB04C"
              stroke={STROKE}
              strokeWidth="2"
            />
          ))}
          {/* Sky-Blue Flower Pot */}
          <polygon
            points="26,60 54,60 50,86 30,86"
            fill="#8AC8E8"
            stroke={STROKE}
            strokeWidth="2.8"
            strokeLinejoin="round"
          />
          <ellipse cx="40" cy="60" rx="14" ry="3.5" fill="#7B563D" stroke={STROKE} strokeWidth="2.4" />
          {/* 5 Violet-Pink Blossoms */}
          {[
            [14, 38],
            [26, 22],
            [44, 18],
            [60, 36],
            [56, 78],
          ].map(([fx, fy], i) => (
            <g key={i} transform={`translate(${fx},${fy})`}>
              <circle cx="0" cy="-4.5" r="3.5" fill="#DF9BE8" stroke={STROKE} strokeWidth="1.8" />
              <circle cx="4.3" cy="-1.4" r="3.5" fill="#DF9BE8" stroke={STROKE} strokeWidth="1.8" />
              <circle cx="2.6" cy="3.6" r="3.5" fill="#DF9BE8" stroke={STROKE} strokeWidth="1.8" />
              <circle cx="-2.6" cy="3.6" r="3.5" fill="#DF9BE8" stroke={STROKE} strokeWidth="1.8" />
              <circle cx="-4.3" cy="-1.4" r="3.5" fill="#DF9BE8" stroke={STROKE} strokeWidth="1.8" />
              <circle cx="0" cy="0" r="2.2" fill="#F9E076" stroke={STROKE} strokeWidth="1.5" />
            </g>
          ))}
        </svg>
      );

    case 'fern_plant':
      return (
        <svg viewBox="0 0 62 72" className={`w-full h-full overflow-visible ${className}`}>
          <ellipse cx="31" cy="67" rx="18" ry="4" fill="rgba(35,31,32,0.15)" />
          {/* Lush Fern Fronds */}
          <path
            d="M 31 46 Q 14 32 8 20 M 31 46 Q 22 24 18 10 M 31 46 L 31 6 M 31 46 Q 40 24 44 10 M 31 46 Q 48 32 54 20"
            fill="none"
            stroke="#3E7C33"
            strokeWidth="3"
            strokeLinecap="round"
          />
          {[
            [14, 26],
            [20, 16],
            [31, 12],
            [42, 16],
            [48, 26],
            [22, 32],
            [40, 32],
          ].map(([lx, ly], i) => (
            <ellipse
              key={i}
              cx={lx}
              cy={ly}
              rx="7"
              ry="4"
              fill="#62A848"
              stroke={STROKE}
              strokeWidth="2.2"
            />
          ))}
          {/* Golden Yellow Pot */}
          <path
            d="M 16 44 L 46 44 L 43 64 Q 31 69 19 64 Z"
            fill="#EEB65B"
            stroke={STROKE}
            strokeWidth="2.8"
          />
          <ellipse cx="31" cy="44" rx="15" ry="3.5" fill="#6E4B35" stroke={STROKE} strokeWidth="2.4" />
        </svg>
      );

    case 'tall_cactus':
      return (
        <svg viewBox="0 0 48 76" className={`w-full h-full overflow-visible ${className}`}>
          <ellipse cx="24" cy="71" rx="15" ry="4" fill="rgba(35,31,32,0.15)" />
          {/* Cactus Arms & Trunk */}
          <path
            d="M 18 28 Q 9 28 9 18 Q 9 13 13 13 Q 17 13 17 22"
            fill="#56A353"
            stroke={STROKE}
            strokeWidth="2.6"
          />
          <path
            d="M 30 32 Q 39 32 39 22 Q 39 17 35 17 Q 31 17 31 26"
            fill="#56A353"
            stroke={STROKE}
            strokeWidth="2.6"
          />
          <rect
            x="17"
            y="6"
            width="14"
            height="42"
            rx="7"
            fill="#62B55E"
            stroke={STROKE}
            strokeWidth="2.8"
          />
          {/* Terracotta Pot */}
          <polygon
            points="11,48 37,48 33,69 15,69"
            fill="#C97349"
            stroke={STROKE}
            strokeWidth="2.8"
          />
          <rect
            x="9"
            y="44"
            width="30"
            height="6"
            rx="2"
            fill="#D88257"
            stroke={STROKE}
            strokeWidth="2.6"
          />
        </svg>
      );

    case 'round_cactus':
      return (
        <svg viewBox="0 0 44 62" className={`w-full h-full overflow-visible ${className}`}>
          <ellipse cx="22" cy="57" rx="14" ry="4" fill="rgba(35,31,32,0.15)" />
          {/* Round Barrel Cactus */}
          <ellipse
            cx="22"
            cy="22"
            rx="13"
            ry="15"
            fill="#62B55E"
            stroke={STROKE}
            strokeWidth="2.8"
          />
          <path d="M 17 9 Q 14 22 17 35 M 22 7 L 22 37 M 27 9 Q 30 22 27 35" fill="none" stroke={STROKE} strokeWidth="1.6" />
          {/* Terracotta Pot */}
          <polygon
            points="9,36 35,36 31,56 13,56"
            fill="#C97349"
            stroke={STROKE}
            strokeWidth="2.8"
          />
          <rect
            x="7"
            y="32"
            width="30"
            height="6"
            rx="2"
            fill="#D88257"
            stroke={STROKE}
            strokeWidth="2.6"
          />
        </svg>
      );

    case 'small_leaf_pot':
      return (
        <svg viewBox="0 0 48 48" className={`w-full h-full overflow-visible ${className}`}>
          <ellipse cx="24" cy="44" rx="15" ry="3.5" fill="rgba(35,31,32,0.15)" />
          {/* Coral Pink Pot */}
          <path
            d="M 11 26 L 37 26 L 34 40 Q 24 45 14 40 Z"
            fill="#EA6D79"
            stroke={STROKE}
            strokeWidth="2.6"
          />
          {/* Leaf Rosette */}
          <ellipse cx="14" cy="22" rx="8" ry="4.5" transform="rotate(-20 14 22)" fill="#5DA84E" stroke={STROKE} strokeWidth="2.4" />
          <ellipse cx="34" cy="22" rx="8" ry="4.5" transform="rotate(20 34 22)" fill="#5DA84E" stroke={STROKE} strokeWidth="2.4" />
          <ellipse cx="19" cy="15" rx="7" ry="4.5" transform="rotate(-10 19 15)" fill="#72BE60" stroke={STROKE} strokeWidth="2.4" />
          <ellipse cx="29" cy="15" rx="7" ry="4.5" transform="rotate(10 29 15)" fill="#72BE60" stroke={STROKE} strokeWidth="2.4" />
          <ellipse cx="24" cy="20" rx="6" ry="5" fill="#82CC6E" stroke={STROKE} strokeWidth="2.4" />
        </svg>
      );

    case 'watering_can':
      return (
        <svg viewBox="0 0 60 48" className={`w-full h-full overflow-visible ${className}`}>
          <ellipse cx="34" cy="43" rx="18" ry="4" fill="rgba(35,31,32,0.15)" />
          {/* Spout */}
          <polygon
            points="24,34 8,18 11,14 26,26"
            fill="#D8CEAC"
            stroke={STROKE}
            strokeWidth="2.6"
          />
          <ellipse
            cx="8"
            cy="15"
            rx="3.5"
            ry="5.5"
            transform="rotate(35 8 15)"
            fill="#E8DFBF"
            stroke={STROKE}
            strokeWidth="2.4"
          />
          {/* Handle */}
          <path
            d="M 44 18 Q 56 16 54 28 Q 52 36 44 34"
            fill="none"
            stroke="#D8CEAC"
            strokeWidth="5.5"
          />
          <path
            d="M 44 18 Q 56 16 54 28 Q 52 36 44 34"
            fill="none"
            stroke={STROKE}
            strokeWidth="2.4"
          />
          {/* Can Body */}
          <polygon
            points="24,16 44,16 46,41 22,41"
            fill="#D8CEAC"
            stroke={STROKE}
            strokeWidth="2.8"
            strokeLinejoin="round"
          />
          <ellipse cx="34" cy="16" rx="10" ry="3" fill="#B5AB8B" stroke={STROKE} strokeWidth="2.4" />
        </svg>
      );

    case 'wall_ivy':
      return (
        <svg viewBox="0 0 120 44" className={`w-full h-full overflow-visible ${className}`}>
          <path
            d="M 6 10 Q 34 36 60 12 Q 86 36 114 10"
            fill="none"
            stroke="#467C39"
            strokeWidth="3.2"
            strokeLinecap="round"
          />
          {[14, 28, 44, 60, 76, 92, 106].map((lx, i) => (
            <ellipse
              key={i}
              cx={lx}
              cy={i % 2 === 0 ? 22 : 28}
              rx="6"
              ry="8"
              fill={i % 2 === 0 ? '#6FB454' : '#589640'}
              stroke={STROKE}
              strokeWidth="2"
            />
          ))}
          <circle cx="36" cy="24" r="4.5" fill="#F7A8C4" stroke={STROKE} strokeWidth="1.8" />
          <circle cx="84" cy="24" r="4.5" fill="#F7A8C4" stroke={STROKE} strokeWidth="1.8" />
        </svg>
      );

    default:
      return null;
  }
});

/**
 * Renders the 6 Fairy Characters from Sheet 2 in 4 context-aware poses:
 * - 'idle' (standing with gentle wing flutter)
 * - 'dangling' (lifted ragdoll carry pose)
 * - 'sitting' (crossed/folded legs on chair or bubble chair, matching top-left of Sheet 4)
 * - 'sleeping' (resting with closed eyes and floating Zzz bubbles on bed)
 */
export const FairySvg: React.FC<{
  fairyId: string;
  pose: FairyPose;
}> = React.memo(({ fairyId, pose }) => {
  // Palette per fairy matching Sheet 2
  const cfg = {
    leaf_fairy: {
      skin: '#C48A64',
      cheeks: '#DF7A6C',
      hair: '#3F6B48',
      wingOuter: '#BCE879',
      wingInner: '#D8F5A2',
      outfitPrimary: '#769E48',
      outfitSecondary: '#587D33',
      shoes: '#587D33',
    },
    ice_fairy: {
      skin: '#F3C39E',
      cheeks: '#F29489',
      hair: '#A9DEF4',
      wingOuter: '#BCE6FA',
      wingInner: '#E4F6FE',
      outfitPrimary: '#86C5EC',
      outfitSecondary: '#BCE6FA',
      shoes: '#86C5EC',
    },
    autumn_fairy: {
      skin: '#F6C6A4',
      cheeks: '#F29282',
      hair: '#D65A20',
      wingOuter: '#F8B944',
      wingInner: '#FCE08B',
      outfitPrimary: '#DF7A26',
      outfitSecondary: '#F6B13E',
      shoes: '#784421',
    },
    rose_fairy: {
      skin: '#8C583C',
      cheeks: '#C66458',
      hair: '#3B2316',
      wingOuter: '#F8A9C4',
      wingInner: '#FCD5E3',
      outfitPrimary: '#F280A6',
      outfitSecondary: '#F8B0C9',
      shoes: '#F280A6',
    },
    star_fairy: {
      skin: '#F4C5A2',
      cheeks: '#F2948A',
      hair: '#3E2B6E',
      wingOuter: '#AE7EE8',
      wingInner: '#D4B6F8',
      outfitPrimary: '#2E386B',
      outfitSecondary: '#907AD6',
      shoes: '#2E386B',
    },
    rainbow_fairy: {
      skin: '#F3C29F',
      cheeks: '#F29489',
      hair: '#F7A8D0',
      hairRight: '#CBA5EE',
      wingOuter: '#F7A8C8',
      wingInner: '#A8E6CF',
      outfitPrimary: '#F8B4D0',
      outfitSecondary: '#A8E2F8',
      shoes: '#B6DCF6',
    },
  }[fairyId] || {
    skin: '#F3C39E',
    cheeks: '#F29489',
    hair: '#6E473B',
    wingOuter: '#BCE6FA',
    wingInner: '#E4F6FE',
    outfitPrimary: '#F69AC0',
    outfitSecondary: '#FBC7DC',
    shoes: '#F69AC0',
  };

  const isSleeping = pose === 'sleeping';
  const isSitting = pose === 'sitting';

  return (
    <svg viewBox="0 0 96 112" className="w-full h-full overflow-visible select-none">
      {/* Ground drop shadow */}
      {pose !== 'dangling' && (
        <ellipse
          cx="48"
          cy={isSitting ? 98 : 105}
          rx={isSleeping ? 30 : 22}
          ry="5"
          fill="rgba(35,31,32,0.16)"
        />
      )}

      {/* Fairy Wings (Behind body) */}
      <g className={pose === 'dangling' ? 'origin-center scale-105' : ''}>
        {/* Upper Left Wing */}
        <path
          d="M 42 58 Q 10 34 8 44 Q 6 60 36 68 Z"
          fill={cfg.wingOuter}
          stroke={STROKE}
          strokeWidth="3"
          strokeLinejoin="round"
        />
        <path
          d="M 38 58 Q 16 42 15 48 Q 14 58 35 64 Z"
          fill={cfg.wingInner}
        />
        {/* Upper Right Wing */}
        <path
          d="M 54 58 Q 86 34 88 44 Q 90 60 60 68 Z"
          fill={cfg.wingOuter}
          stroke={STROKE}
          strokeWidth="3"
          strokeLinejoin="round"
        />
        <path
          d="M 58 58 Q 80 42 81 48 Q 82 58 61 64 Z"
          fill={cfg.wingInner}
        />
        {/* Lower Wings */}
        <path
          d="M 40 66 Q 16 68 18 78 Q 22 86 42 74 Z"
          fill={cfg.wingOuter}
          stroke={STROKE}
          strokeWidth="2.8"
        />
        <path
          d="M 56 66 Q 80 68 78 78 Q 74 86 54 74 Z"
          fill={cfg.wingOuter}
          stroke={STROKE}
          strokeWidth="2.8"
        />
      </g>

      {/* Back Hair Volume */}
      {fairyId === 'autumn_fairy' && (
        <circle cx="48" cy="34" r="27" fill={cfg.hair} stroke={STROKE} strokeWidth="3.2" />
      )}
      {fairyId === 'rose_fairy' && (
        <g>
          <circle cx="28" cy="24" r="16" fill={cfg.hair} stroke={STROKE} strokeWidth="3.2" />
          <circle cx="68" cy="24" r="16" fill={cfg.hair} stroke={STROKE} strokeWidth="3.2" />
          <circle cx="48" cy="32" r="24" fill={cfg.hair} stroke={STROKE} strokeWidth="3.2" />
        </g>
      )}
      {fairyId === 'leaf_fairy' && (
        <g>
          {/* Double leaf buns */}
          <circle cx="25" cy="18" r="11" fill={cfg.hair} stroke={STROKE} strokeWidth="3" />
          <circle cx="71" cy="18" r="11" fill={cfg.hair} stroke={STROKE} strokeWidth="3" />
          <path d="M 32 14 Q 36 4 39 14 Z" fill="#88C454" stroke={STROKE} strokeWidth="2.2" />
          <path d="M 64 14 Q 60 4 57 14 Z" fill="#88C454" stroke={STROKE} strokeWidth="2.2" />
        </g>
      )}
      {(fairyId === 'ice_fairy' || fairyId === 'star_fairy' || fairyId === 'rainbow_fairy') && (
        <path
          d="M 23 32 Q 20 56 28 62 L 68 62 Q 76 56 73 32 Z"
          fill={cfg.hair}
          stroke={STROKE}
          strokeWidth="3"
        />
      )}

      {/* Legs & Shoes (Sitting vs Standing) */}
      {isSitting ? (
        <g>
          {/* Crossed/folded sitting legs matching top-left of Sheet 4 */}
          <ellipse cx="36" cy="89" rx="11" ry="5.5" transform="rotate(18 36 89)" fill={cfg.skin} stroke={STROKE} strokeWidth="2.8" />
          <ellipse cx="60" cy="89" rx="11" ry="5.5" transform="rotate(-18 60 89)" fill={cfg.skin} stroke={STROKE} strokeWidth="2.8" />
          <ellipse cx="42" cy="94" rx="5.5" ry="3.5" fill={cfg.shoes} stroke={STROKE} strokeWidth="2.5" />
          <ellipse cx="54" cy="94" rx="5.5" ry="3.5" fill={cfg.shoes} stroke={STROKE} strokeWidth="2.5" />
        </g>
      ) : (
        <g>
          {/* Standing legs */}
          <rect
            x="38"
            y="80"
            width="7"
            height="22"
            rx="3.5"
            fill={ fairyId === 'star_fairy' ? cfg.outfitPrimary : cfg.skin }
            stroke={STROKE}
            strokeWidth="2.8"
          />
          <rect
            x="51"
            y="80"
            width="7"
            height="22"
            rx="3.5"
            fill={ fairyId === 'star_fairy' ? cfg.outfitPrimary : cfg.skin }
            stroke={STROKE}
            strokeWidth="2.8"
          />
          <ellipse cx="40" cy="102" rx="6" ry="3.8" fill={cfg.shoes} stroke={STROKE} strokeWidth="2.6" />
          <ellipse cx="56" cy="102" rx="6" ry="3.8" fill={cfg.shoes} stroke={STROKE} strokeWidth="2.6" />
        </g>
      )}

      {/* Arms */}
      <path
        d={isSitting ? 'M 36 58 Q 26 68 32 78' : 'M 36 58 Q 25 68 27 76'}
        fill="none"
        stroke={fairyId === 'star_fairy' ? cfg.outfitPrimary : cfg.skin}
        strokeWidth="6.5"
        strokeLinecap="round"
      />
      <path
        d={isSitting ? 'M 36 58 Q 26 68 32 78' : 'M 36 58 Q 25 68 27 76'}
        fill="none"
        stroke={STROKE}
        strokeWidth="2.6"
        strokeLinecap="round"
      />
      <path
        d={isSitting ? 'M 60 58 Q 70 68 64 78' : 'M 60 58 Q 71 68 69 76'}
        fill="none"
        stroke={fairyId === 'star_fairy' ? cfg.outfitPrimary : cfg.skin}
        strokeWidth="6.5"
        strokeLinecap="round"
      />
      <path
        d={isSitting ? 'M 60 58 Q 70 68 64 78' : 'M 60 58 Q 71 68 69 76'}
        fill="none"
        stroke={STROKE}
        strokeWidth="2.6"
        strokeLinecap="round"
      />

      {/* Outfit / Dress */}
      {fairyId === 'autumn_fairy' ? (
        <g>
          {/* Overalls with acorn emblem */}
          <rect
            x="35"
            y="56"
            width="26"
            height="28"
            rx="6"
            fill={cfg.outfitPrimary}
            stroke={STROKE}
            strokeWidth="3"
          />
          <circle cx="48" cy="67" r="4" fill="#9E501B" stroke={STROKE} strokeWidth="1.8" />
        </g>
      ) : fairyId === 'star_fairy' ? (
        <g>
          {/* Starry Pajama Onesie */}
          <rect
            x="36"
            y="56"
            width="24"
            height="27"
            rx="6"
            fill={cfg.outfitPrimary}
            stroke={STROKE}
            strokeWidth="3"
          />
          <circle cx="44" cy="64" r="2" fill="#B79CED" />
          <circle cx="52" cy="70" r="2" fill="#B79CED" />
          <circle cx="45" cy="76" r="1.8" fill="#F8E28C" />
        </g>
      ) : fairyId === 'leaf_fairy' ? (
        <g>
          {/* Layered Leaf Dress */}
          <path
            d="M 38 55 L 58 55 L 66 82 L 30 82 Z"
            fill={cfg.outfitPrimary}
            stroke={STROKE}
            strokeWidth="3"
            strokeLinejoin="round"
          />
          <path
            d="M 32 82 L 40 70 L 48 84 L 56 70 L 64 82"
            fill={cfg.outfitSecondary}
            stroke={STROKE}
            strokeWidth="2.4"
            strokeLinejoin="round"
          />
        </g>
      ) : fairyId === 'rainbow_fairy' ? (
        <g>
          {/* Pastel Rainbow Skirt */}
          <path
            d="M 37 55 L 59 55 L 68 84 L 28 84 Z"
            fill="#FCE38A"
            stroke={STROKE}
            strokeWidth="3"
            strokeLinejoin="round"
          />
          <path d="M 37 55 L 44 55 L 40 84 L 29 84 Z" fill="#F8A8C8" />
          <path d="M 52 55 L 59 55 L 67 84 L 56 84 Z" fill="#A8DCF8" />
          <path
            d="M 37 55 L 59 55 L 68 84 L 28 84 Z"
            fill="none"
            stroke={STROKE}
            strokeWidth="3"
            strokeLinejoin="round"
          />
        </g>
      ) : (
        <g>
          {/* Rose Petal / Starry Cloud Dress */}
          <path
            d="M 37 55 L 59 55 L 68 84 Q 48 89 28 84 Z"
            fill={cfg.outfitPrimary}
            stroke={STROKE}
            strokeWidth="3"
            strokeLinejoin="round"
          />
          {fairyId === 'ice_fairy' && (
            <>
              <circle cx="42" cy="72" r="2" fill="#FFFFFF" />
              <circle cx="52" cy="68" r="2" fill="#FFFFFF" />
              <circle cx="48" cy="78" r="2" fill="#FFFFFF" />
            </>
          )}
        </g>
      )}

      {/* Ears & Head */}
      <circle cx="25" cy="38" r="5" fill={cfg.skin} stroke={STROKE} strokeWidth="2.8" />
      <circle cx="71" cy="38" r="5" fill={cfg.skin} stroke={STROKE} strokeWidth="2.8" />
      <ellipse
        cx="48"
        cy="37"
        rx="22"
        ry="19"
        fill={cfg.skin}
        stroke={STROKE}
        strokeWidth="3.2"
      />

      {/* Front Hair Bangs & Accessories */}
      {fairyId === 'rainbow_fairy' ? (
        <g>
          <path
            d="M 26 36 Q 26 15 48 16 L 48 25 Q 34 28 26 36 Z"
            fill="#F7A8D0"
            stroke={STROKE}
            strokeWidth="2.8"
          />
          <path
            d="M 70 36 Q 70 15 48 16 L 48 25 Q 62 28 70 36 Z"
            fill="#CBA5EE"
            stroke={STROKE}
            strokeWidth="2.8"
          />
          {/* Braids */}
          <ellipse cx="30" cy="54" rx="4" ry="11" fill="#F7A8D0" stroke={STROKE} strokeWidth="2.4" />
          <ellipse cx="66" cy="54" rx="4" ry="11" fill="#CBA5EE" stroke={STROKE} strokeWidth="2.4" />
        </g>
      ) : (
        <path
          d="M 25 36 Q 26 15 48 15 Q 70 15 71 36 Q 58 28 48 24 Q 38 28 25 36 Z"
          fill={cfg.hair}
          stroke={STROKE}
          strokeWidth="3"
          strokeLinejoin="round"
        />
      )}

      {/* Cloud Tiara on Celeste (ice_fairy) */}
      {fairyId === 'ice_fairy' && (
        <path
          d="M 36 17 Q 38 10 43 12 Q 48 7 53 12 Q 58 10 60 17 Z"
          fill="#EAF7FE"
          stroke={STROKE}
          strokeWidth="2.6"
        />
      )}

      {/* Pink Roses on Rosalind (rose_fairy) */}
      {fairyId === 'rose_fairy' && (
        <g>
          <circle cx="34" cy="18" r="5" fill="#F27FA2" stroke={STROKE} strokeWidth="2.2" />
          <circle cx="62" cy="18" r="5" fill="#F27FA2" stroke={STROKE} strokeWidth="2.2" />
        </g>
      )}

      {/* Crescent Moon Clips on Luna (star_fairy) */}
      {fairyId === 'star_fairy' && (
        <g>
          <circle cx="35" cy="22" r="3.5" fill="#F8E28C" stroke={STROKE} strokeWidth="1.8" />
          <circle cx="61" cy="22" r="3.5" fill="#F8E28C" stroke={STROKE} strokeWidth="1.8" />
        </g>
      )}

      {/* Face: Rosy Cheeks, Eyes (Open vs Sleeping), Nose & Smile */}
      <ellipse cx="34" cy="43" rx="4" ry="2.4" fill={cfg.cheeks} opacity="0.75" />
      <ellipse cx="62" cy="43" rx="4" ry="2.4" fill={cfg.cheeks} opacity="0.75" />

      {isSleeping ? (
        <g>
          {/* Closed peaceful sleeping eyelids */}
          <path d="M 35 38 Q 38 42 41 38" fill="none" stroke={STROKE} strokeWidth="2.6" strokeLinecap="round" />
          <path d="M 55 38 Q 58 42 61 38" fill="none" stroke={STROKE} strokeWidth="2.6" strokeLinecap="round" />
        </g>
      ) : (
        <g>
          <circle cx="38" cy="38" r="3.2" fill={STROKE} />
          <circle cx="37" cy="37" r="1" fill="#FFFFFF" />
          <circle cx="58" cy="38" r="3.2" fill={STROKE} />
          <circle cx="57" cy="37" r="1" fill="#FFFFFF" />
        </g>
      )}

      {/* Cute button nose & smile */}
      <ellipse cx="48" cy="40" rx="1.6" ry="1.1" fill={STROKE} />
      <path
        d="M 44.5 44.5 Q 48 47.5 51.5 44.5"
        fill="none"
        stroke={STROKE}
        strokeWidth="2.4"
        strokeLinecap="round"
      />
    </svg>
  );
});

/**
 * Renders the 6 Magical Companion Pets from Sheet 1:
 * - moss_pet (Sprout)
 * - kitten_pet (Nimbus)
 * - squirrel_pet (Pip)
 * - bee_pet (Barnaby)
 * - owl_pet (Hootie)
 * - bunny_pet (Clover)
 */
export const PetSvg: React.FC<{
  petId: string;
}> = React.memo(({ petId }) => {
  switch (petId) {
    case 'moss_pet':
      return (
        <svg viewBox="0 0 68 68" className="w-full h-full overflow-visible select-none">
          <ellipse cx="34" cy="63" rx="18" ry="4" fill="rgba(35,31,32,0.16)" />
          {/* Little legs */}
          <rect x="24" y="50" width="7" height="11" rx="3.5" fill="#4E7338" stroke={STROKE} strokeWidth="2.8" />
          <rect x="37" y="50" width="7" height="11" rx="3.5" fill="#4E7338" stroke={STROKE} strokeWidth="2.8" />
          {/* Fluffy green bush body */}
          <circle cx="34" cy="36" r="21" fill="#68924B" stroke={STROKE} strokeWidth="3.2" />
          {/* Top Sprout Leaf */}
          <path
            d="M 33 15 Q 32 4 44 4 Q 45 16 33 15 Z"
            fill="#82B955"
            stroke={STROKE}
            strokeWidth="2.8"
            strokeLinejoin="round"
          />
          <line x1="34" y1="14" x2="41" y2="7" stroke={STROKE} strokeWidth="2" />
          {/* Face */}
          <ellipse cx="23" cy="39" rx="3.5" ry="2" fill="#E28B7A" />
          <ellipse cx="45" cy="39" rx="3.5" ry="2" fill="#E28B7A" />
          <circle cx="26" cy="34" r="3" fill={STROKE} />
          <circle cx="42" cy="34" r="3" fill={STROKE} />
          <path d="M 31 36 Q 34 39 37 36" fill="none" stroke={STROKE} strokeWidth="2.4" strokeLinecap="round" />
        </svg>
      );

    case 'kitten_pet':
      return (
        <svg viewBox="0 0 74 68" className="w-full h-full overflow-visible select-none">
          <ellipse cx="37" cy="63" rx="16" ry="4" fill="rgba(35,31,32,0.16)" />
          {/* Fluffy Tail */}
          <path
            d="M 45 50 Q 62 46 62 53 Q 60 58 44 55 Z"
            fill="#AEE0F9"
            stroke={STROKE}
            strokeWidth="2.8"
          />
          {/* White Feathered Wings */}
          <path d="M 24 38 Q 8 30 12 40 Q 15 47 26 44 Z" fill="#EAF7FE" stroke={STROKE} strokeWidth="2.6" />
          <path d="M 50 38 Q 66 30 62 40 Q 59 47 48 44 Z" fill="#EAF7FE" stroke={STROKE} strokeWidth="2.6" />
          {/* Body */}
          <ellipse cx="37" cy="46" rx="12" ry="14" fill="#AEE0F9" stroke={STROKE} strokeWidth="3" />
          <ellipse cx="37" cy="47" rx="7" ry="9" fill="#E2F4FD" />
          {/* Head & Ears */}
          <polygon points="22,26 24,10 34,18" fill="#AEE0F9" stroke={STROKE} strokeWidth="2.8" strokeLinejoin="round" />
          <polygon points="52,26 50,10 40,18" fill="#AEE0F9" stroke={STROKE} strokeWidth="2.8" strokeLinejoin="round" />
          <ellipse cx="37" cy="27" rx="16" ry="13" fill="#AEE0F9" stroke={STROKE} strokeWidth="3" />
          {/* Face */}
          <circle cx="30" cy="28" r="2.8" fill={STROKE} />
          <circle cx="44" cy="28" r="2.8" fill={STROKE} />
          <path d="M 34 31 Q 37 33 40 31" fill="none" stroke={STROKE} strokeWidth="2.2" strokeLinecap="round" />
        </svg>
      );

    case 'squirrel_pet':
      return (
        <svg viewBox="0 0 74 68" className="w-full h-full overflow-visible select-none">
          <ellipse cx="32" cy="63" rx="17" ry="4" fill="rgba(35,31,32,0.16)" />
          {/* Giant Curled Bushy Tail */}
          <path
            d="M 42 54 Q 68 48 66 22 Q 64 6 48 14 Q 42 22 44 42 Z"
            fill="#E06D1F"
            stroke={STROKE}
            strokeWidth="3"
          />
          <path d="M 46 48 Q 58 42 58 26 Q 56 18 48 24" fill="#F59B38" />
          {/* Ears */}
          <polygon points="18,24 20,10 27,20" fill="#E06D1F" stroke={STROKE} strokeWidth="2.8" />
          <polygon points="44,24 42,10 35,20" fill="#E06D1F" stroke={STROKE} strokeWidth="2.8" />
          {/* Chubby Body */}
          <ellipse cx="31" cy="40" rx="18" ry="20" fill="#EA7E26" stroke={STROKE} strokeWidth="3.2" />
          <ellipse cx="31" cy="48" rx="10" ry="10" fill="#F8B652" />
          {/* Face & Cute Tooth */}
          <circle cx="24" cy="34" r="3" fill={STROKE} />
          <circle cx="38" cy="34" r="3" fill={STROKE} />
          <path d="M 28 38 Q 31 41 34 38" fill="none" stroke={STROKE} strokeWidth="2.2" strokeLinecap="round" />
          <rect x="29.8" y="39.5" width="2.5" height="2.5" fill="#FFFFFF" />
        </svg>
      );

    case 'bee_pet':
      return (
        <svg viewBox="0 0 70 68" className="w-full h-full overflow-visible select-none">
          <ellipse cx="35" cy="62" rx="16" ry="4" fill="rgba(35,31,32,0.15)" />
          {/* Bee Wings */}
          <ellipse cx="32" cy="18" rx="8" ry="11" fill="#CBEBFA" stroke={STROKE} strokeWidth="2.6" />
          <ellipse cx="43" cy="20" rx="8" ry="10" fill="#CBEBFA" stroke={STROKE} strokeWidth="2.6" />
          {/* Round Bee Body with Stripes */}
          <ellipse cx="35" cy="40" rx="21" ry="17" fill="#FAD972" stroke={STROKE} strokeWidth="3.2" />
          <path
            d="M 38 24 Q 44 40 38 56 L 45 55 Q 50 40 45 25 Z"
            fill="#4B382A"
          />
          <ellipse
            cx="35"
            cy="40"
            rx="21"
            ry="17"
            fill="none"
            stroke={STROKE}
            strokeWidth="3.2"
          />
          {/* Rainbow Unicorn Horn */}
          <polygon
            points="21,28 17,11 28,24"
            fill="#E3B6F2"
            stroke={STROKE}
            strokeWidth="2.6"
            strokeLinejoin="round"
          />
          {/* Face */}
          <ellipse cx="19" cy="43" rx="3.2" ry="2" fill="#F29489" />
          <ellipse cx="35" cy="44" rx="3.2" ry="2" fill="#F29489" />
          <circle cx="21" cy="38" r="2.8" fill={STROKE} />
          <circle cx="33" cy="39" r="2.8" fill={STROKE} />
          <path d="M 25 41 Q 27 43 29 41" fill="none" stroke={STROKE} strokeWidth="2.2" strokeLinecap="round" />
        </svg>
      );

    case 'owl_pet':
      return (
        <svg viewBox="0 0 74 68" className="w-full h-full overflow-visible select-none">
          <ellipse cx="37" cy="63" rx="16" ry="4" fill="rgba(35,31,32,0.16)" />
          {/* Glowing Cyan Fairy Wings */}
          <path d="M 20 38 Q 4 30 9 41 Q 12 48 22 45 Z" fill="#C4F4FE" stroke="#85B8E8" strokeWidth="2.4" />
          <path d="M 54 38 Q 70 30 65 41 Q 62 48 52 45 Z" fill="#C4F4FE" stroke="#85B8E8" strokeWidth="2.4" />
          {/* Plump Purple Owl Body */}
          <ellipse cx="37" cy="38" rx="19" ry="21" fill="#8B63CE" stroke={STROKE} strokeWidth="3.2" />
          {/* Ear Tufts */}
          <polygon points="21,23 19,14 28,19" fill="#8B63CE" stroke={STROKE} strokeWidth="2.8" />
          <polygon points="53,23 55,14 46,19" fill="#8B63CE" stroke={STROKE} strokeWidth="2.8" />
          {/* Lavender Belly */}
          <ellipse cx="37" cy="47" rx="12" ry="10" fill="#BCA2EE" />
          {/* Big Golden-Rimmed Eyes */}
          <circle cx="29" cy="29" r="6.5" fill="#F8E389" stroke={STROKE} strokeWidth="2.6" />
          <circle cx="29" cy="29" r="4" fill={STROKE} />
          <circle cx="45" cy="29" r="6.5" fill="#F8E389" stroke={STROKE} strokeWidth="2.6" />
          <circle cx="45" cy="29" r="4" fill={STROKE} />
          {/* Orange Beak & Feet */}
          <polygon points="34,33 40,33 37,39" fill="#F49B42" stroke={STROKE} strokeWidth="2.2" />
          <ellipse cx="31" cy="60" rx="4" ry="2.5" fill="#F49B42" stroke={STROKE} strokeWidth="2.2" />
          <ellipse cx="43" cy="60" rx="4" ry="2.5" fill="#F49B42" stroke={STROKE} strokeWidth="2.2" />
        </svg>
      );

    case 'bunny_pet':
    default:
      return (
        <svg viewBox="0 0 70 68" className="w-full h-full overflow-visible select-none">
          <ellipse cx="35" cy="63" rx="18" ry="4" fill="rgba(35,31,32,0.16)" />
          {/* Lavender Fairy Wings */}
          <path d="M 22 40 Q 7 32 11 43 Q 14 50 23 47 Z" fill="#DAB6F7" stroke={STROKE} strokeWidth="2.6" />
          <path d="M 48 40 Q 63 32 59 43 Q 56 50 47 47 Z" fill="#DAB6F7" stroke={STROKE} strokeWidth="2.6" />
          {/* Tall Bunny Ears */}
          <ellipse cx="27" cy="14" rx="5" ry="11" transform="rotate(-10 27 14)" fill="#F9B5D6" stroke={STROKE} strokeWidth="2.8" />
          <ellipse cx="43" cy="14" rx="5" ry="11" transform="rotate(10 43 14)" fill="#F9B5D6" stroke={STROKE} strokeWidth="2.8" />
          {/* Bunny Head & Ruffled Dress Body */}
          <path
            d="M 20 34 Q 18 20 35 20 Q 52 20 50 34 L 54 58 Q 35 63 16 58 Z"
            fill="#F9B5D6"
            stroke={STROKE}
            strokeWidth="3"
            strokeLinejoin="round"
          />
          {/* Flower Crown */}
          <circle cx="26" cy="23" r="4" fill="#D5B4F8" stroke={STROKE} strokeWidth="2" />
          <circle cx="35" cy="22" r="4.5" fill="#F794BE" stroke={STROKE} strokeWidth="2" />
          <circle cx="44" cy="23" r="4" fill="#D5B4F8" stroke={STROKE} strokeWidth="2" />
          {/* Face */}
          <circle cx="28" cy="34" r="2.8" fill={STROKE} />
          <circle cx="42" cy="34" r="2.8" fill={STROKE} />
          <path d="M 32 37 Q 35 39.5 38 37" fill="none" stroke={STROKE} strokeWidth="2.2" strokeLinecap="round" />
        </svg>
      );
  }
});

/**
 * Renders the thick-outlined pastel round UI icons matching the bottom-right of Sheet 4.
 */
export const UiRoundIconSvg: React.FC<{
  kind: 'plus' | 'hammer' | 'gear' | 'hand' | 'sound_on' | 'sound_off' | 'home' | 'trash';
  size?: number;
}> = React.memo(({ kind, size = 40 }) => {
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
        <path
          d="M 24 13 L 24 35 M 13 24 L 35 24"
          stroke="#9BA8B4"
          strokeWidth="7"
          strokeLinecap="round"
        />
      )}
      {kind === 'plus' && (
        <path
          d="M 24 13 L 24 35 M 13 24 L 35 24"
          stroke={STROKE}
          strokeWidth="3"
          strokeLinecap="round"
        />
      )}
      {kind === 'hammer' && (
        <g>
          <line x1="15" y1="33" x2="27" y2="21" stroke="#C58B5B" strokeWidth="6" strokeLinecap="round" />
          <line x1="15" y1="33" x2="27" y2="21" stroke={STROKE} strokeWidth="2.6" strokeLinecap="round" />
          <path
            d="M 21 15 L 31 15 Q 35 15 36 19 L 25 25 Z"
            fill="#9BA8B4"
            stroke={STROKE}
            strokeWidth="2.6"
            strokeLinejoin="round"
          />
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
          <line x1="21" y1="22" x2="21" y2="30" stroke="#FFF" strokeWidth="2" strokeLinecap="round" />
          <line x1="27" y1="22" x2="27" y2="30" stroke="#FFF" strokeWidth="2" strokeLinecap="round" />
        </g>
      )}
    </svg>
  );
});

/**
 * Custom Inline SVG Title Lockup for the Game Shell Title Screen.
 */
export const TitleEmblemSvg: React.FC = React.memo(() => (
  <svg viewBox="0 0 460 132" className="w-full max-w-[440px] h-auto select-none drop-shadow-md">
    {/* Decorative Wooden Plaque & Fairy Wings */}
    <path
      d="M 48 64 Q 6 24 14 48 Q 18 76 58 76 Z"
      fill="#BCE879"
      stroke={STROKE}
      strokeWidth="3.5"
    />
    <path
      d="M 412 64 Q 454 24 446 48 Q 442 76 402 76 Z"
      fill="#F8A9C4"
      stroke={STROKE}
      strokeWidth="3.5"
    />
    <rect
      x="42"
      y="18"
      width="376"
      height="96"
      rx="28"
      fill="#FFF5E8"
      stroke={STROKE}
      strokeWidth="4"
    />
    <rect
      x="50"
      y="26"
      width="360"
      height="80"
      rx="22"
      fill="#FCE1EB"
      stroke="#E6A9C3"
      strokeWidth="2.5"
    />
    {/* Little Stars */}
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
