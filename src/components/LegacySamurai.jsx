import React, { useRef, useEffect } from 'react';
import { windSystem } from '../utils/windSystem';

/**
 * LegacySamurai (孤高の侍 - The Lone Ronin Silhouette)
 * -----------------------------------------------------------------------------
 * 100% solid jet-black SVG silhouette of the standing Samurai warrior
 * meticulously reconstructed from the reference poster artwork (media_1793619060255_cb56b458.jpg).
 *
 * Anatomy & Silhouette:
 *  - Traditional conical straw hat (Sugegasa - 菅笠) angled in stoic profile
 *  - Upright, dignified posture facing right
 *  - Twin katanas (Daishō) sheaths extending cleanly to the RIGHT into the crimson sun
 *  - 3 long, streaming sageo cords billowing gracefully to the LEFT in the wind
 *  - Flowing hakama battle trousers grounding into the pampas grass hill
 *  - Real-time 60 FPS wind articulation and natural breathing physics
 */
export default function LegacySamurai({ className = '', style = {} }) {
  const torsoRef = useRef(null);
  const robeHemRef = useRef(null);
  const sageo1Ref = useRef(null);
  const sageo2Ref = useRef(null);
  const sageo3Ref = useRef(null);

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) return;

    let animId;

    const updatePhysics = () => {
      const wind = windSystem.getState();
      const t = wind.time;
      const windForce = wind.windX * (1 + wind.gust * 2.2);

      // Subtle warrior breathing (chest expansion)
      if (torsoRef.current) {
        const breath = Math.sin(t * 1.2) * 1.2;
        torsoRef.current.style.transform = `translateY(${breath.toFixed(2)}px)`;
      }

      // Flowing robe hem billowing
      if (robeHemRef.current) {
        const robeWave = Math.sin(t * 2.0 + 0.5) * 2.0 + windForce * 2.2;
        robeHemRef.current.style.transform = `rotate(${robeWave.toFixed(2)}deg)`;
      }

      // Fluid undulating Sageo cord ribbons trailing behind to the left
      if (sageo1Ref.current) {
        const angle1 = Math.sin(t * 3.2 + 0.2) * 3.8 + windForce * 4.2;
        sageo1Ref.current.style.transform = `rotate(${angle1.toFixed(2)}deg)`;
      }
      if (sageo2Ref.current) {
        const angle2 = Math.sin(t * 2.8 + 1.1) * 4.5 + windForce * 5.0;
        sageo2Ref.current.style.transform = `rotate(${angle2.toFixed(2)}deg)`;
      }
      if (sageo3Ref.current) {
        const angle3 = Math.sin(t * 2.5 + 2.0) * 5.2 + windForce * 5.8;
        sageo3Ref.current.style.transform = `rotate(${angle3.toFixed(2)}deg)`;
      }

      animId = requestAnimationFrame(updatePhysics);
    };

    animId = requestAnimationFrame(updatePhysics);
    return () => cancelAnimationFrame(animId);
  }, []);

  return (
    <div
      className={`legacy-samurai-root ${className}`}
      style={style}
      role="img"
      aria-label="Standing Ronin Samurai silhouette before crimson sun"
    >
      <svg
        viewBox="0 0 640 860"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="legacy-samurai-svg"
        preserveAspectRatio="xMidYMid meet"
      >
        {/* ============================================================== */}
        {/* 1. STREAMING SAGEO SASH CORDS (Trailing gracefully to the left) */}
        {/* ============================================================== */}
        <g className="samurai-sageo-cords" fill="#080808">
          {/* Top Sageo Ribbon */}
          <g transform="translate(325, 485)">
            <g ref={sageo1Ref} style={{ transformOrigin: '0px 0px' }}>
              <path
                d="M 0 0
                   C -65 -10, -140 -25, -210 -45
                   C -248 -56, -282 -70, -315 -88
                   C -275 -64, -225 -38, -165 -16
                   C -105 5, -45 10, 0 8 Z"
              />
            </g>
          </g>

          {/* Middle Sageo Ribbon */}
          <g transform="translate(322, 508)">
            <g ref={sageo2Ref} style={{ transformOrigin: '0px 0px' }}>
              <path
                d="M 0 0
                   C -75 5, -160 -2, -235 -24
                   C -270 -34, -298 -46, -330 -58
                   C -285 -30, -235 -4, -170 12
                   C -110 24, -50 16, 0 8 Z"
              />
            </g>
          </g>

          {/* Bottom Sageo Ribbon */}
          <g transform="translate(318, 528)">
            <g ref={sageo3Ref} style={{ transformOrigin: '0px 0px' }}>
              <path
                d="M 0 0
                   C -60 15, -125 25, -188 28
                   C -228 30, -265 24, -305 12
                   C -262 34, -208 44, -145 38
                   C -92 32, -42 18, 0 8 Z"
              />
            </g>
          </g>
        </g>

        {/* ============================================================== */}
        {/* 2. DUAL SHEATHED KATANAS (DAISHŌ) EXTENDING DOWN-RIGHT         */}
        {/* ============================================================== */}
        <g className="samurai-daisho-swords" fill="#080808">
          {/* Katana 1 (Upper Scabbard & Grip) */}
          {/* Main Scabbard extending down-right */}
          <path
            d="M 330 478
               L 485 528
               C 492 530, 498 534, 498 538
               C 498 542, 492 542, 484 538
               L 330 488 Z"
          />
          {/* Sword Guard (Tsuba) */}
          <ellipse cx="375" cy="493" rx="4" ry="11" transform="rotate(18, 375, 493)" />
          {/* Sword Hilt Grip (Tsuka) */}
          <path
            d="M 330 478
               L 295 466
               L 292 474
               L 328 488 Z"
          />

          {/* Katana 2 (Lower Wakizashi Scabbard & Grip) */}
          <path
            d="M 325 504
               L 495 562
               C 502 565, 508 569, 508 573
               C 508 577, 502 576, 494 572
               L 325 514 Z"
          />
          {/* Sword Guard (Tsuba) */}
          <ellipse cx="370" cy="519" rx="4" ry="11" transform="rotate(19, 370, 519)" />
          {/* Sword Hilt Grip (Tsuka) */}
          <path
            d="M 325 504
               L 290 492
               L 288 500
               L 324 514 Z"
          />
        </g>

        {/* ============================================================== */}
        {/* 3. WARRIOR HEAD, CONICAL HAT & UPPER BODY                     */}
        {/* ============================================================== */}
        <g ref={torsoRef} className="samurai-torso-group" style={{ transformOrigin: '360px 420px' }} fill="#080808">
          {/* Conical Straw Hat (Sugegasa - 菅笠) angled in sharp stoic profile */}
          <path
            d="M 315 220
               C 335 194, 355 174, 370 160
               C 388 178, 418 205, 448 234
               L 435 244
               C 405 230, 375 224, 345 228 Z"
          />
          {/* Broad Hat Rim Peak & Underside Depth */}
          <path
            d="M 308 226
               C 340 216, 378 212, 412 224
               L 438 238
               C 395 234, 352 240, 302 250 Z"
          />
          {/* Hat Tie Ribbons hanging under chin */}
          <path d="M 360 238 Q 366 280, 370 310" stroke="#080808" strokeWidth="2.5" fill="none" />

          {/* Warrior's Head & Stoic Down-Tilted Face Profile */}
          <path
            d="M 358 236
               C 368 236, 380 242, 388 254
               C 394 266, 396 282, 390 295
               C 382 306, 374 310, 364 310
               C 356 308, 350 294, 348 280
               C 346 262, 350 244, 358 236 Z"
          />

          {/* Stoic Upright Shoulders & Haori Robe Collars */}
          <path
            d="M 352 305
               C 332 335, 314 376, 308 430
               C 304 464, 308 500, 320 530
               L 382 534
               C 395 504, 404 462, 406 422
               C 408 380, 402 338, 394 310 Z"
          />

          {/* Right Arm Silhouette composed forward/holding scabbard */}
          <path
            d="M 394 314
               C 414 340, 426 374, 430 416
               C 432 454, 422 490, 404 520
               C 396 528, 385 525, 378 512
               C 390 482, 398 445, 395 410
               C 392 372, 382 342, 372 320 Z"
          />

          {/* Wide Obi Sash */}
          <path d="M 318 498 L 388 504 L 392 542 L 315 536 Z" />
        </g>

        {/* ============================================================== */}
        {/* 4. BILLOWING HAKAMA ROBES & GROUND PROFILE                    */}
        {/* ============================================================== */}
        <g ref={robeHemRef} className="samurai-hakama-group" style={{ transformOrigin: '350px 520px' }} fill="#080808">
          {/* Flowing Hakama Body Silhouette */}
          <path
            d="M 318 530
               C 300 588, 278 665, 258 752
               C 250 792, 242 832, 232 860
               L 322 860
               C 340 824, 352 768, 362 712
               L 384 860
               L 424 855
               C 426 790, 424 702, 412 615
               C 404 560, 395 525, 388 495 Z"
          />

          {/* Tattered, battle-worn hem tatters */}
          <path
            d="M 232 860
               Q 242 848, 254 862
               Q 267 846, 280 864
               Q 294 848, 308 862
               Q 325 846, 342 864
               Q 360 848, 378 862
               Q 394 850, 424 855
               L 424 860 L 228 860 Z"
          />
        </g>
      </svg>
    </div>
  );
}
