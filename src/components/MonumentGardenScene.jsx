import React from 'react';

// Hand-constructed interpretive artwork, distinct from the historical sculpture.
// Local blossom branches and petal animation never escape their SVG stage.
const blossomAnchors = [
  [91,215],[120,170],[159,133],[196,116],[224,142],[261,113],[293,154],[312,195],
  [83,261],[123,244],[163,202],[206,217],[253,201],[296,237],[340,226],
  [119,298],[176,279],[230,285],[280,275],[342,283],[376,247],
  [166,337],[228,342],[290,318],[343,330],[403,280],
];
function CherryBlossoms() {
  const flowers = blossomAnchors.flatMap(([x,y],index) => Array.from({length: 5},(_,j)=>{
    const dx = Math.sin(index * 3.3 + j * 2.4) * (7 + j * 2);
    const dy = Math.cos(index * 1.5 + j * 3.1) * (7 + j * 2);
    return {x:x+dx,y:y+dy,s: index % 3 === 0 ? 1.1 : .73 + j*.045,angle:(index*47+j*63)%360};
  }));
  return <g className="bc-garden-blossoms">{flowers.map((b,i) => <g key={i} transform={`translate(${b.x} ${b.y}) rotate(${b.angle}) scale(${b.s})`}>
    {[0,72,144,216,288].map((a)=><path key={a} d="M0 0 C-5-4-6-10-1-12 C-1-10 1-10 1-12 C7-10 6-4 0 0Z" transform={`rotate(${a})`} fill={i%7===0?'#e58ba0':i%4===0?'#f2b9c7':'#edccd0'} stroke="#bd8792" strokeWidth=".45" opacity={.78+i%3*.08}/>) }
    <circle r="1.4" fill="#a9626d"/>
  </g>)}</g>;
}
const petals = Array.from({ length: 10 }, (_, i) => ({
  x: [300,196,342,401,268,155,349,374,239,310][i],
  y: [206,265,224,309,261,337,358,278,297,241][i],
  delay: `${-i*1.03}s`, duration: `${7+i*.47}s`
}));
export default function MonumentGardenScene(){
  return <svg className="bc-monument-svg" viewBox="0 0 1180 650" role="img" aria-label="Interpretive bronze-toned illustration of a mounted Samurai memorial with a blossoming cherry tree in a Japanese garden">
    <defs>
      <linearGradient id="bc-memorial-bronze" x1="0" y1="0" x2=".9" y2="1"><stop stopColor="#746c53"/><stop offset=".37" stopColor="#414b3c"/><stop offset=".8" stopColor="#2d3832"/><stop offset="1" stopColor="#151e1b"/></linearGradient>
      <linearGradient id="bc-memorial-pedestal" x1="0" y1="0" x2="0" y2="1"><stop stopColor="#a9a092"/><stop offset="1" stopColor="#665d54"/></linearGradient>
      <radialGradient id="bc-memorial-sky" cx=".65" cy=".45"><stop stopColor="#d0aaa0" stopOpacity=".68"/><stop offset=".82" stopColor="#d0aaa0" stopOpacity=".08"/><stop offset="1" stopColor="#d0aaa0" stopOpacity="0"/></radialGradient>
    </defs>
    <circle cx="850" cy="230" r="208" fill="url(#bc-memorial-sky)"/>
    <circle cx="843" cy="207" r="136" fill="#af4040" opacity=".87"/>
    <path d="M0 486Q143 462 281 459T541 474Q685 441 814 457T1180 458V650H0Z" fill="#d6d0bd" opacity=".82"/>
    <path d="M0 544 Q274 488 489 524T1180 515V650H0Z" fill="#a6a292" opacity=".34"/>
    <g className="bc-garden-tree">
      <path d="M100 538Q131 497 128 444Q111 405 153 363Q174 330 181 287Q196 260 217 247Q240 225 245 186" stroke="#41312d" strokeWidth="35" strokeLinecap="round" fill="none"/>
      <path d="M105 542Q84 544 66 560M108 538Q140 529 163 554M124 470Q114 501 97 530" stroke="#352724" strokeWidth="12" strokeLinecap="round" fill="none"/>
      <path d="M179 303Q133 273 88 259Q70 242 67 213M180 306Q199 269 260 258Q308 245 345 215M214 250Q215 206 203 159Q184 138 161 125M228 224Q269 187 310 171Q330 155 359 155M161 360Q188 325 226 328Q265 333 298 306M197 275Q164 235 127 209Q110 178 117 153M240 191Q263 171 266 121" fill="none" stroke="#41312d" strokeWidth="13" strokeLinecap="round"/>
      <path d="M88 258Q106 233 102 196M155 130Q143 108 129 104M203 159Q224 133 235 111M310 171Q297 145 284 130M347 216Q371 222 387 238M270 258Q273 286 297 299M115 213Q81 200 69 182M227 328Q223 350 250 361" fill="none" stroke="#51413b" strokeWidth="4.2" strokeLinecap="round"/>
      <path d="M107 534Q151 439 143 416Q151 364 183 309" fill="none" stroke="#91736c" strokeWidth="2.5" opacity=".6"/>
      <g className="bc-garden-flower-sway"><CherryBlossoms/></g>
      {petals.map((p,i)=><g className="bc-monument-petal" style={{'--petal-delay': p.delay,'--petal-duration':p.duration}} key={i} transform={`translate(${p.x} ${p.y})`}><path d="M0 0Q-8-13 1-18Q11-13 0 0Z" fill="#eaa5ba" stroke="#c9879d" strokeWidth=".65" opacity=".82"/></g>)}
    </g>
    {/* Pedestal: clearly identified as a stylized visual interpretation, not survey geometry. */}
    <g className="bc-memorial-sculpture">
      <path d="M520 542L904 542L932 565L495 565Z" fill="#b0a89b" stroke="#5a544c" strokeWidth="3"/>
      <path d="M522 565L904 565L892 625L534 625Z" fill="url(#bc-memorial-pedestal)" stroke="#5b554d" strokeWidth="3"/>
      <path d="M541 581H887M549 610H879" fill="none" stroke="#c9c4ba" strokeWidth="3" opacity=".45"/>
      <path d="M503 625L919 625L932 647H488Z" fill="#70675d"/>
      <path d="M605 581H807V606H605Z" fill="#625d50" stroke="#bdb6a5" strokeWidth="1"/>
      <text x="706" y="598" fill="#d4c5ab" fontSize="16" fontFamily="serif" textAnchor="middle">楠木正成</text>
      {/* horse: clear anatomical silhouette including bridled head, mane, all four legs */}
      <path d="M593 372Q564 370 531 357Q510 348 503 357Q522 375 552 394Z" fill="#2b352e"/>
      <path d="M566 357Q600 324 664 325Q717 323 765 343Q788 348 807 335L838 293Q854 270 875 280L890 304Q910 308 921 329L917 349Q898 358 878 346Q868 335 861 324L826 394Q785 421 750 411L699 423Q627 440 580 411Z" fill="url(#bc-memorial-bronze)" stroke="#202b25" strokeWidth="4"/>
      <path d="M853 300Q833 320 830 351M858 311Q840 329 837 347" fill="none" stroke="#a1a180" strokeWidth="4" opacity=".5"/>
      <path d="M892 305Q901 304 906 310L905 319L891 317Z" fill="#2d3027"/>
      <path d="M890 328L908 338L902 343L886 336Z" fill="#85836d"/>
      <path d="M893 319L889 322" stroke="#d2c0a0" strokeWidth="2"/>
      <path d="M580 395Q568 446 562 470L544 536L559 542L584 487L611 422Z" fill="#2b332a" stroke="#1c2723" strokeWidth="3"/>
      <path d="M628 411Q624 475 617 528L628 536L644 477L654 421Z" fill="#394238" stroke="#202b26" strokeWidth="3"/>
      <path d="M740 405Q768 463 757 523L775 531Q795 473 776 404Z" fill="#29352c" stroke="#1f2924" strokeWidth="3"/>
      <path d="M798 388Q806 436 834 479L844 532L861 532Q857 490 846 470L829 378Z" fill="#334138" stroke="#1c2923" strokeWidth="3"/>
      <path d="M538 531L567 529L574 543L530 543ZM604 528L640 528L650 541L603 541ZM753 521L783 522L790 540L747 539ZM829 530L863 528L867 542L824 543Z" fill="#273027"/>
      <path d="M610 348Q657 361 710 346Q750 343 776 363" fill="none" stroke="#9f9c7d" strokeWidth="4" opacity=".45"/>
      {/* rider mounted on saddle; lamellar armor and helmet */}
      <path d="M671 315Q681 356 654 405L675 410Q710 372 716 323Z" fill="#2b392f"/>
      <path d="M713 313Q728 360 750 382L765 378Q746 325 735 301Z" fill="#1c2925"/>
      <path d="M660 225Q676 205 703 212Q731 214 741 238L735 322Q695 333 658 307Z" fill="#3a493b" stroke="#202e28" strokeWidth="4"/>
      <path d="M664 239H735M659 258H735M665 278H730M673 297H728" stroke="#b1aa80" strokeWidth="3.5" opacity=".62"/>
      <path d="M666 219Q639 239 627 284L651 295L680 249Z" fill="#53604d" stroke="#26342b" strokeWidth="3"/>
      <path d="M726 222Q758 234 768 276L746 291L721 250Z" fill="#4c5b4b" stroke="#26342b" strokeWidth="3"/>
      <path d="M665 206Q680 185 699 192Q718 185 727 205L719 222L672 223Z" fill="#4c5948"/>
      <ellipse cx="698" cy="184" rx="19" ry="26" fill="#435044"/>
      <path d="M671 171Q681 150 699 152Q719 153 726 170L731 181Q695 189 664 180Z" fill="#252e28" stroke="#ab9b77" strokeWidth="2"/>
      <path d="M696 152L701 131L707 151" fill="#a5a180"/>
      <path d="M670 181L657 199M720 182L736 201" stroke="#77826d" strokeWidth="5"/>
      <path d="M657 263Q615 281 585 315" fill="none" stroke="#495346" strokeWidth="13" strokeLinecap="round"/>
      <path d="M583 314Q579 324 588 332L608 322Z" fill="#404a3d"/>
      <path d="M744 265Q789 279 832 311" fill="none" stroke="#455242" strokeWidth="11" strokeLinecap="round"/>
      <path d="M830 310L854 322" stroke="#a29d7c" strokeWidth="3" fill="none"/>
    </g>
    <path d="M0 620Q160 602 330 624T698 627T1180 605V650H0Z" fill="#8f8a7d" opacity=".25"/>
  </svg>;
}
