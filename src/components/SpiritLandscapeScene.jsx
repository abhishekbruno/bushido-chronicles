import React from 'react';

/**
 * A tree-free, independently layered editorial landscape. The four story artworks
 * share one consistent visual language and respond to the existing story tabs.
 * All layers are SVG/CSS (no imagery or per-frame React updates).
 */
const sceneData = {
  sakura: { title: 'THE BRIEF BEAUTY', jp: '花の余韻', location: 'SPRING · KYOTO', mark: '01', emblem: '花' },
  fuji: { title: 'THE UNMOVING PEAK', jp: '不動の心', location: 'FUJI · HONSHŪ', mark: '02', emblem: '富士' },
  bamboo: { title: 'STRENGTH IN STILLNESS', jp: '柔よく剛を制す', location: 'ARASHIYAMA · KYOTO', mark: '03', emblem: '禅' },
  torii: { title: 'THE SACRED THRESHOLD', jp: '神域の門', location: 'MIYAJIMA · HIROSHIMA', mark: '04', emblem: '厳島' },
};

function SceneArtwork({ storyKey }) {
  switch (storyKey) {
    case 'fuji':
      return (
        <g className="archive-illustration">
          <path d="M78 558 Q183 504 246 492 L380 204 L503 470 Q593 490 676 550 L676 680 L78 680Z" fill="#292925" />
          <path d="M276 415L380 204L480 418L439 387L411 400L382 360L345 401L316 386Z" fill="#F3E9D7" />
          <path d="M78 585 Q175 538 257 567 Q350 537 440 567 Q555 533 676 581V684H78Z" fill="#6D706B" opacity=".63" />
          <path d="M40 618Q190 567 358 601T720 597M64 647Q230 628 382 642T694 631" fill="none" stroke="#F3E9D7" strokeWidth="9" opacity=".55" strokeLinecap="round" />
        </g>
      );
    case 'bamboo':
      return (
        <g className="archive-illustration">
          <g fill="none" stroke="#262925" strokeLinecap="round">
            <path d="M192 148 Q225 380 180 682" strokeWidth="25" />
            <path d="M292 102 Q271 382 312 684" strokeWidth="21" />
            <path d="M431 148 Q465 423 421 684" strokeWidth="27" />
            <path d="M551 194 Q527 460 569 685" strokeWidth="15" />
          </g>
          <g stroke="#DCC7A1" strokeWidth="7" opacity=".82">
            <path d="M203 287l-7 2M190 466l-9 2M278 249l22-2M285 474l17-2M442 300l-20 2M442 500l-20 1M541 370l21-3" />
          </g>
          <path d="M99 584C220 545 318 592 437 552S620 565 688 542" stroke="#D1C3A9" strokeWidth="35" opacity=".25" fill="none" />
          <path d="M70 631Q227 595 372 637T708 619" stroke="#C4AA81" strokeWidth="4" opacity=".58" fill="none" />
        </g>
      );
    case 'torii':
      return (
        <g className="archive-illustration">
          <path d="M85 548C205 515 302 569 418 543S597 525 675 540V680H85Z" fill="#393B36" opacity=".58" />
          <g fill="#191D1B">
            <path d="M183 302Q371 338 568 294L592 320Q388 371 167 326Z" />
            <path d="M229 347H532L526 368H235Z" />
            <path d="M271 360H294V619H271ZM465 360H489V619H465Z" />
            <path d="M287 403H472V420H287Z" />
          </g>
          <path d="M78 622Q201 610 324 629T680 624M70 659Q214 641 379 660T704 650" stroke="#E4D6BD" strokeWidth="5" opacity=".74" fill="none" />
          <path d="M162 585q32-8 53 0m315-7q42-9 66 0" stroke="#D6CBB6" strokeWidth="3" fill="none" opacity=".54" />
        </g>
      );
    default:
      return (
        <g className="archive-illustration">
          <path d="M61 556C161 493 235 516 341 474S524 496 705 425V689H61Z" fill="#313430" opacity=".85" />
          <path d="M66 617C207 569 265 611 383 571S574 577 697 539V690H66Z" fill="#656860" opacity=".48" />
          <path d="M78 661Q213 628 381 657T693 640" stroke="#E1D2BA" strokeWidth="5" fill="none" opacity=".5" />
          <g className="archive-petal-drift" fill="#F3D0CF" stroke="#B94A53" strokeWidth="1.5">
            <path d="M221 244q-17-35 8-41q17 12-8 41Z" />
            <path d="M347 283q-9-22 14-27q12 14-14 27Z" />
            <path d="M522 241q-22-13-8-31q19-4 8 31Z" />
            <path d="M446 383q-19-26 5-36q17 9-5 36Z" />
            <path d="M581 421q-11-19 7-27q14 9-7 27Z" />
            <path d="M298 405q-11-19 7-27q14 9-7 27Z" />
          </g>
          <g fill="none" stroke="#E8DCCA" strokeWidth="3" opacity=".68">
            <path d="M78 383Q207 372 275 392" />
            <path d="M455 463Q565 441 684 450" />
          </g>
        </g>
      );
  }
}

export default function SpiritLandscapeScene({ storyKey = 'sakura', storyIndex = 1 }) {
  const scene = sceneData[storyKey] || sceneData.sakura;
  return (
    <figure className="spirit-landscape-archive" aria-label={`${scene.title}, an illustrated Japanese landscape without trees`}>
      <div className="spirit-archive-topline" aria-hidden="true">
        <span>日本の風景</span>
        <span>ARCHIVE NO. {String(storyIndex).padStart(2, '0')}</span>
      </div>
      <div className="spirit-landscape-stage" key={storyKey}>
        <svg className="spirit-landscape-svg" viewBox="0 0 760 760" role="img" aria-label={`${scene.title} — ink and crimson landscape`} preserveAspectRatio="xMidYMid meet">
          <defs>
            <linearGradient id="archiveSky" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#F1E8D7" />
              <stop offset="100%" stopColor="#DED3BF" />
            </linearGradient>
            <linearGradient id="archiveSun" x1="0" y1="0" x2=".8" y2="1">
              <stop offset="0%" stopColor="#DE4243" />
              <stop offset="65%" stopColor="#B9202A" />
              <stop offset="100%" stopColor="#921824" />
            </linearGradient>
            <clipPath id="archiveSceneClip"><rect x="14" y="12" width="732" height="736" rx="3" /></clipPath>
          </defs>
          <g clipPath="url(#archiveSceneClip)">
            <rect x="0" y="0" width="760" height="760" fill="url(#archiveSky)" />
            <g className="archive-sun-halo">
              <circle cx="432" cy="304" r="202" fill="#BA2731" opacity=".08" />
              <circle cx="432" cy="304" r="173" fill="url(#archiveSun)" />
              <circle cx="432" cy="304" r="179" fill="none" stroke="#9D232D" strokeWidth="3" strokeDasharray="66 9 25 8" opacity=".72" />
            </g>
            <g opacity=".27" stroke="#6D665B" strokeWidth="2" fill="none" strokeLinecap="round">
              <path d="M82 192Q171 180 240 191M525 148Q609 143 679 167M80 247Q153 243 192 250M548 363Q606 360 691 369" />
              <path d="M107 435Q192 423 234 432M574 486Q628 479 690 484" />
            </g>
            <SceneArtwork storyKey={storyKey} />
            <g className="archive-foreground-drift" fill="#EFE6D5" opacity=".55">
              <path d="M0 693Q216 651 419 689T760 668V760H0Z" />
            </g>
            <path d="M82 695H668" stroke="#8D7B66" strokeWidth="1.5" opacity=".5" />
            <text x="105" y="106" fontSize="63" fill="#272622" opacity=".13" fontFamily="serif">{scene.emblem}</text>
            <text x="653" y="693" fill="#3E3A33" opacity=".72" fontSize="18" textAnchor="end" letterSpacing="4">{scene.mark} / 04</text>
          </g>
        </svg>
        <div className="spirit-archive-vertical-word" aria-hidden="true">静寂 · 歴史 · 余韻</div>
      </div>
      <figcaption className="spirit-archive-bottomline">
        <span className="spirit-archive-caption-kicker">{scene.location}</span>
        <strong>{scene.title}</strong>
        <span lang="ja">{scene.jp}</span>
      </figcaption>
    </figure>
  );
}
