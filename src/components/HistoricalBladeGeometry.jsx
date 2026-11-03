import React, { useId } from 'react';

const CM_TO_SVG = 8.1;

function profile(t, baseHalf, sori, kissakiStart, curveBias, curveNorm, taper) {
  const kissakiTaper = t > kissakiStart
    ? Math.pow(Math.max(0.001, (1 - t) / (1 - kissakiStart)), 0.73)
    : 1;
  const curve = (4 * t * (1 - t) * (1 + curveBias * (0.5 - t))) / curveNorm;
  return {
    y: 220 - sori * curve,
    half: baseHalf * (1 - taper * t) * kissakiTaper,
  };
}

function pathFrom(points) {
  return points.map(([x, y], i) => `${i === 0 ? 'M' : 'L'}${x.toFixed(2)},${y.toFixed(2)}`).join(' ');
}

/**
 * Interpretive, physically parameterized 2.5D geometry.
 * X coordinates: 8.1 SVG units per cm, so blade lengths are genuinely comparable.
 * The profile interpolates recorded sori as the maximum displacement from the chord.
 * Mounting shape and hamon pattern are reconstructed from swordmaking conventions;
 * they are NOT digitized replicas or museum-verified fitting measurements.
 */
export default function HistoricalBladeGeometry({ blade, sheathed = false, showGuides = true }) {
  const rawId = useId().replace(/:/g, '');
  const uid = `museum${rawId}`;
  const bladePx = blade.lengthCm * CM_TO_SVG;
  const hiltPx = blade.hiltEstimateCm * CM_TO_SVG;
  const totalPx = bladePx + hiltPx;
  const left = (1200 - totalPx) / 2;
  const guardX = left + hiltPx;
  const tipX = guardX + bladePx;
  const soriPx = (blade.curvatureCm ?? 0.2) * CM_TO_SVG;
  const halfBase = (blade.baseWidthEstimateCm * CM_TO_SVG) / 2;
  const pointCount = 72;
  const curveBias = blade.id === 'mikazuki' ? 0.64 : blade.id === 'dojigiri' ? 0.32 : 0;
  const curveNorm = Math.max(...Array.from({ length: 201 }, (_, i) => {
    const t = i / 200;
    return 4 * t * (1 - t) * (1 + curveBias * (0.5 - t));
  }));
  const kissakiStart = 1 - Math.min(blade.kissakiLengthCm ?? 3.8, blade.lengthCm * 0.19) / blade.lengthCm;
  const taper = blade.id === 'heshikiri' ? 0.2 : 0.24;
  const sample = (t) => profile(t, halfBase, soriPx, kissakiStart, curveBias, curveNorm, taper);
  const top = [];
  const bottom = [];
  const spine = [];
  const hamon = [];

  for (let i = 0; i <= pointCount; i++) {
    const t = i / pointCount;
    const x = guardX + t * bladePx;
    const { y, half } = sample(t);
    top.push([x, y - half]);
    bottom.push([x, y + half]);
    spine.push([x, y - half * 0.35]);
    const wave = blade.id === 'mikazuki'
      ? Math.pow(Math.sin(t * Math.PI * 11.5), 4) * 2.8
      : Math.sin(t * Math.PI * 22) * 1.7 + Math.sin(t * Math.PI * 8.8) * 1.3;
    hamon.push([x, y + half * 0.35 + wave * Math.min(1, half / 5)]);
  }
  const kissakiX = guardX + kissakiStart * bladePx;
  const kissaki = sample(kissakiStart);
  const bladeOutline = `${pathFrom(top)} ${pathFrom([...bottom].reverse()).replace(/^M/, 'L')} Z`;
  const sayaWidth = halfBase + 8;
  const sheathTop = top.map(([x, y], i) => [x, y - (sayaWidth - sample(i / pointCount).half)]);
  const sheathBottom = bottom.map(([x, y], i) => [x, y + (sayaWidth - sample(i / pointCount).half)]);
  const sayaReturn = [...sheathBottom].reverse().slice(1)
    .map(([x, y]) => `L${x.toFixed(2)},${y.toFixed(2)}`).join(' ');
  const sheathTipY = sample(1).y;
  const sayaOutline = `${pathFrom(sheathTop)} Q${(tipX + 18).toFixed(2)},${sheathTipY.toFixed(2)} ${tipX.toFixed(2)},${(sheathTipY + sayaWidth).toFixed(2)} ${sayaReturn} Z`;

  const accents = {
    moon: { primary: '#d4ad67', secondary: '#534535', ink: '#201f1e', glow: '#f2d8a3' },
    night: { primary: '#b8ad9e', secondary: '#77726b', ink: '#191d22', glow: '#dedbd5' },
    ember: { primary: '#c48e60', secondary: '#8a312d', ink: '#1d1c1b', glow: '#efc8a4' },
    sea: { primary: '#b6a280', secondary: '#3d6271', ink: '#182b33', glow: '#b7d4db' },
    plum: { primary: '#c6a17a', secondary: '#67424e', ink: '#231a20', glow: '#f3c9d3' },
  };
  const col = accents[blade.palette] || accents.moon;
  const diamonds = Math.max(5, Math.round(hiltPx / 17));
  const bandWidth = hiltPx / diamonds;

  return (
    <svg
      className="museum-blade-svg"
      viewBox="0 0 1200 440"
      preserveAspectRatio="xMidYMid meet"
      role="img"
      aria-label={`${blade.name}. ${blade.measureLabel}: ${blade.lengthCm} centimetres. ${blade.curvatureCm === null ? 'Curvature not documented.' : `Curvature ${blade.curvatureCm} centimetres.`}`}
    >
      <defs>
        <linearGradient id={`${uid}-steel`} x1="0" y1="0" x2="0" y2="1" gradientUnits="objectBoundingBox">
          <stop offset="0%" stopColor="#5a6770" />
          <stop offset="15%" stopColor="#f1f1e9" />
          <stop offset="30%" stopColor="#a6b3b9" />
          <stop offset="48%" stopColor="#e9e8e2" />
          <stop offset="60%" stopColor="#7e8b92" />
          <stop offset="78%" stopColor="#d1d3ce" />
          <stop offset="100%" stopColor="#666e73" />
        </linearGradient>
        <linearGradient id={`${uid}-handle`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={col.primary} />
          <stop offset="45%" stopColor={col.ink} />
          <stop offset="100%" stopColor={col.secondary} />
        </linearGradient>
        <linearGradient id={`${uid}-saya`} x1="0" y1="0" x2="0.5" y2="1">
          <stop offset="0%" stopColor={col.secondary} />
          <stop offset="50%" stopColor={col.ink} />
          <stop offset="100%" stopColor="#090b0d" />
        </linearGradient>
        <filter id={`${uid}-glow`} x="-10%" y="-65%" width="120%" height="230%">
          <feGaussianBlur stdDeviation="6" />
        </filter>
      </defs>

      {/* A deliberately quiet museum plinth and paper measurement grid */}
      <path d="M80 331H1120" stroke="#bba98d" strokeWidth="1" opacity="0.34" />
      <path d="M80 96H1120" stroke="#bba98d" strokeWidth="1" opacity="0.13" />
      {[100, 200, 300, 400, 500, 600, 700, 800, 900, 1000, 1100].map((x) => (
        <path key={x} d={`M${x} 321V337`} stroke="#a29b8a" strokeWidth="1" opacity="0.24" />
      ))}
      <ellipse cx="595" cy="292" rx={Math.min(505, totalPx * .56)} ry="12" fill="#05090b" opacity=".28" filter={`url(#${uid}-glow)`} />

      <g className="museum-blade-artifact">
        {sheathed ? (
          <>
            <path d={sayaOutline} fill={`url(#${uid}-saya)`} stroke="#07090b" strokeWidth="2.2" />
            <path d={pathFrom(spine)} fill="none" stroke={col.glow} strokeWidth="1.2" opacity=".23" />
            <path d={`M${guardX + 36},${217} L${guardX + 58},${215}`} stroke={col.primary} strokeWidth="2.2" strokeLinecap="round" />
            <path d={`M${tipX - 24},${218} L${tipX - 5},${218}`} stroke={col.primary} strokeWidth="4.1" strokeLinecap="round" />
          </>
        ) : (
          <>
            <path d={bladeOutline} fill={`url(#${uid}-steel)`} stroke="#cad0ce" strokeWidth="1.25" />
            <path d={pathFrom(spine)} fill="none" stroke="#394953" strokeWidth="1.8" opacity=".85" />
            <path d={pathFrom(hamon)} fill="none" stroke="#f8f4e7" strokeWidth="2.2" opacity=".78" strokeLinecap="round" />
            <path d={pathFrom(top)} fill="none" stroke="#d4e0e1" strokeWidth="1.25" opacity=".84" />
            <path d={`M${kissakiX.toFixed(2)},${(kissaki.y - kissaki.half).toFixed(2)} L${kissakiX.toFixed(2)},${(kissaki.y + kissaki.half).toFixed(2)}`} fill="none" stroke="#657780" strokeWidth="1.25" opacity=".65" />
            <path d={pathFrom(bottom)} fill="none" stroke="#f3f0e7" strokeWidth="1.1" opacity=".72" />
            <path className="museum-blade-specular" d={pathFrom(spine)} stroke={col.glow} strokeWidth="4.2" opacity=".46" fill="none" />
          </>
        )}

        {/* Habaki, a stylized collar; not an exact scan of the artifact. */}
        <path d={`M${guardX - 1} ${220 - halfBase - 3} L${guardX + 17} ${220 - halfBase + 1} L${guardX + 17} ${220 + halfBase - 1} L${guardX - 1} ${220 + halfBase + 3}Z`} fill={col.primary} stroke="#2c241c" strokeWidth="1.4" />
        <path d={`M${guardX + 5} ${220 - halfBase + 2}V${220 + halfBase - 2}`} stroke="#f3e1b6" strokeWidth="1.1" opacity=".65" />

        {/* Tsuba is an oval plate about 7.1 cm in illustrated height. */}
        <ellipse cx={guardX - 5} cy="220" rx="11" ry="29" fill="#080b0c" stroke={col.primary} strokeWidth="3.1" />
        <ellipse cx={guardX - 5} cy="220" rx="6.5" ry="20" fill="none" stroke={col.secondary} strokeWidth="1.6" />
        <rect x={guardX - 21} y="193" width="6" height="54" rx="1" fill={col.primary} />

        {/* Woven tsuka grip: crossing diagonal bands and metallic ornaments. */}
        <rect x={left} y="204" width={hiltPx - 18} height="32" rx="5" fill={`url(#${uid}-handle)`} stroke="#0a0a0a" strokeWidth="2" />
        <rect x={left + 9} y="209" width={Math.max(1, hiltPx - 38)} height="22" rx="3" fill="#d3c3ad" opacity=".4" />
        {Array.from({ length: diamonds }, (_, i) => {
          const x = left + 12 + i * bandWidth;
          return (
            <g key={i} opacity=".94" fill="none" stroke={col.ink} strokeWidth="5.2">
              <path d={`M${x - 7},205 L${x + 8},235`} />
              <path d={`M${x - 7},235 L${x + 8},205`} />
            </g>
          );
        })}
        <rect x={left + 3} y="203" width="9" height="35" rx="3" fill={col.primary} stroke="#20150f" strokeWidth="1" />
        <rect x={guardX - 30} y="202" width="12" height="36" rx="2" fill={col.primary} stroke="#211a13" strokeWidth="1" />
        <g fill={col.primary} opacity=".8">
          <circle cx={left + hiltPx * .45} cy="220" r="3.4" />
          <circle cx={left + hiltPx * .72} cy="220" r="2.7" />
        </g>
      </g>

      {showGuides && (
        <g className="museum-blade-measurement" fill="none" stroke="#d0bda2" strokeWidth="1.3" opacity=".92">
          <path d={`M${guardX},286V307 M${tipX},286V307 M${guardX},299H${tipX}`} />
          <path d={`M${guardX},299L${guardX + 9},294 M${guardX},299L${guardX + 9},304 M${tipX},299L${tipX - 9},294 M${tipX},299L${tipX - 9},304`} />
          <text x={(guardX + tipX) / 2} y="326" fontSize="16" fill="#efdfc6" stroke="none" textAnchor="middle" letterSpacing="2">
            {blade.lengthCm.toFixed(1)} CM
          </text>
          {blade.curvatureCm !== null && (
            <>
              <path d={`M${guardX + bladePx / 2},155V${220 - soriPx - halfBase - 5}`} strokeDasharray="4 4" opacity=".5" />
              <text x={guardX + bladePx / 2} y="145" fontSize="12" fill="#cabb9d" stroke="none" textAnchor="middle" letterSpacing="1.1">
                SORI {blade.curvatureCm.toFixed(1)} CM
              </text>
            </>
          )}
        </g>
      )}
      <text x="50" y="401" fontSize="13" fill="#9e8e75" letterSpacing="2">BLADE LENGTH-SCALED · 8.1 SVG UNITS / CM</text>
      <text x="1150" y="401" textAnchor="end" fontSize="13" fill="#9e8e75" letterSpacing="1.7">ORNAMENTAL FITTINGS RECONSTRUCTED</text>
    </svg>
  );
}
