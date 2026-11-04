import { useEffect, useRef } from 'react';
import { windSystem } from '../utils/windSystem.js';
import { advanceMapleRig, createMapleRig, gutterWidth, stepLeaf } from '../utils/maplePhysics.js';
import { createMapleRenderer, loadMapleArtwork, treePlacement } from '../utils/mapleRenderer.js';
import './global-maples.css';

// Mounted once outside App/main: chapter scrolling never mounts/resets a tree.
export default function GlobalMapleBackground() {
  const rootRef=useRef(null), canvasRef=useRef(null);
  useEffect(() => {
    const root=rootRef.current, canvas=canvasRef.current;
    const desktop=matchMedia('(min-width: 1280px)');
    const motion=matchMedia('(prefers-reduced-motion: reduce)');
    const rigs=[createMapleRig(0),createMapleRig(1.35)];
    let angles=[[0,0,0],[0,0,0]], leaves=[], emitters=[];
    let artwork, renderer, loading=false, disposed=false, lost=false;
    let unsubscribe, previous=null, width=0, height=0, gutter=0;
    let fallback=[];

    function removeFallback() { fallback.forEach(image=>image.remove()); fallback=[]; }
    function staticFallback() {
      removeFallback();
      const url=artwork.tree.toDataURL();
      for(let side=0;side<2;side++) {
        const image=new Image(); image.src=url; image.alt='';
        image.className='global-maple-fallback';
        const p=treePlacement(side,width,height);
        Object.assign(image.style,{width:`${artwork.tree.width*p.scale}px`,height:`${artwork.tree.height*p.scale}px`,
          left:`${p.x}px`,top:`${p.y}px`,transform:`scaleX(${p.mirror})`});
        root.appendChild(image); fallback.push(image);
      }
      canvas.hidden=true;
      root.dataset.renderer='static';
    }
    function seedLeaf(leaf, spread=false) {
      const point=emitters[Math.floor(Math.random()*emitters.length)] || [gutter*.5,height*.2];
      Object.assign(leaf,{x:point[0],y:point[1],vx:0,vy:10+Math.random()*7,
        angle:Math.random()*Math.PI*2,spin:(Math.random()-.5)*1.2,age:0,size:7+Math.random()*8});
      if(spread) { leaf.y+=Math.random()*(height-leaf.y); leaf.age=1; }
    }
    function paint() {
      if(renderer && !lost && desktop.matches) renderer.render(angles,leaves,gutter,motion.matches);
    }
    function resize() {
      const oldWidth=gutter, oldHeight=height;
      width=document.documentElement.clientWidth; height=window.innerHeight;
      gutter=gutterWidth(width);
      root.style.setProperty('--maple-gutter',`${gutter}px`);
      if(!artwork || !gutter) return;
      const p=treePlacement(0,width,height);
      emitters=artwork.foliage.map(([x,y])=>[p.x+x*p.scale,p.y+y*p.scale])
        .filter(([x,y])=>x>=6 && x<gutter-8 && y>8 && y<height*.65);
      // Keep existing particles/phase through resizing, only add/remove budget slots.
      leaves.forEach(leaf=>{
        if(oldWidth>0) leaf.x*=gutter/oldWidth;
        if(oldHeight>0) leaf.y*=height/oldHeight;
      });
      const count=width>=1600?14:8;
      while(leaves.length<count) { const leaf={side:leaves.length%2};seedLeaf(leaf,true);leaves.push(leaf); }
      leaves.length=count;
      root.dataset.leaves=String(motion.matches?0:count);
      if(renderer && !lost) { renderer.resize(width,height);paint(); }
      else staticFallback();
    }
    function stop() { unsubscribe?.();unsubscribe=undefined;previous=null; }
    function tick(wind) {
      const dt=previous===null?0:wind.time-previous;
      previous=wind.time;
      angles=rigs.map((rig,side)=>advanceMapleRig(rig,wind,dt).map(a=>side?-a:a));
      leaves.forEach(leaf=>{
        stepLeaf(leaf,{windX:leaf.side?-wind.windX:wind.windX},dt,gutter);
        if(leaf.y>height+24) seedLeaf(leaf);
      });
      paint();
    }
    async function sync() {
      stop();
      root.dataset.motion=document.hidden?'hidden':!desktop.matches?'mobile':motion.matches?'reduced':'running';
      if(!desktop.matches) return;
      if(!artwork && !loading) {
        loading=true;
        try {
          const loaded=await loadMapleArtwork();
          if(disposed) return;
          artwork=loaded;
          try { renderer=createMapleRenderer(canvas,artwork); }
          catch(error) { console.warn('Maple GPU renderer unavailable; using still artwork.',error); }
          root.dataset.renderer=renderer?'webgl':'static';
          resize();
        } catch(error) {
          if(!disposed) console.warn('Maple artwork could not load.',error);
        } finally { loading=false; }
      }
      if(disposed || !artwork) return;
      // Re-evaluate media/visibility after asynchronous decoding (StrictMode safe).
      root.dataset.leaves=String(motion.matches||!renderer?0:leaves.length);
      paint();
      if(!document.hidden && desktop.matches && !motion.matches && renderer && !lost) {
        unsubscribe=windSystem.subscribe(tick);
      }
    }
    function onResize() { resize();sync(); }
    function onLost(event) { event.preventDefault();lost=true;stop();if(artwork)staticFallback(); }
    function onRestored() {
      if(disposed || !artwork) return;
      lost=false;
      renderer?.dispose();
      renderer=createMapleRenderer(canvas,artwork);
      removeFallback();canvas.hidden=false;root.dataset.renderer=renderer?'webgl':'static';
      resize();sync();
    }
    canvas.addEventListener('webglcontextlost',onLost);
    canvas.addEventListener('webglcontextrestored',onRestored);
    desktop.addEventListener('change',onResize);
    motion.addEventListener('change',sync);
    document.addEventListener('visibilitychange',sync);
    window.addEventListener('resize',onResize,{passive:true});
    resize();sync();
    return () => {
      disposed=true;stop();renderer?.dispose();removeFallback();
      canvas.removeEventListener('webglcontextlost',onLost);
      canvas.removeEventListener('webglcontextrestored',onRestored);
      desktop.removeEventListener('change',onResize);
      motion.removeEventListener('change',sync);
      document.removeEventListener('visibilitychange',sync);
      window.removeEventListener('resize',onResize);
    };
  },[]);
  return <div ref={rootRef} className="global-maple-background" aria-hidden="true">
    <canvas ref={canvasRef} className="global-maple-canvas" />
  </div>;
}
