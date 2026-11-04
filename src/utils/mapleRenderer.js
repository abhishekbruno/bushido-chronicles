import { assetUrl } from './assetUrl.js';
import { rigWeights, rigPivots } from './maplePhysics.js';

export const MAPLE_URL = assetUrl('/images/maple/autumn-maple.png');
export const SOURCE_WIDTH = 1086;
export const SOURCE_HEIGHT = 1448;
// Detached leaves already present in the reference. Their pixels form the atlas,
// not permanent floating leaves baked into the stationary tree.
const detached = [[799,476,69,65],[1000,705,80,66],[927,771,67,44],
  [829,816,104,105],[474,854,63,50],[592,922,90,70],[476,992,67,48]];
const leafRect = detached[3];
let artworkPromise;

export function loadMapleArtwork() {
  if (!artworkPromise) {
    artworkPromise = (async () => {
      const image = new Image();
      image.src = MAPLE_URL;
      await image.decode();
      const tree = document.createElement('canvas');
      tree.width = image.naturalWidth;
      tree.height = image.naturalHeight;
      const ctx = tree.getContext('2d');
      ctx.drawImage(image, 0, 0);
      detached.forEach(rect => ctx.clearRect(...rect));
      const pixels=ctx.getImageData(0,0,tree.width,tree.height).data;
      const foliage=[];
      for (let y=10;y<800;y+=12) for (let x=8;x<tree.width;x+=12) {
        const i=(y*tree.width+x)*4;
        if (pixels[i+3]>160 && pixels[i]>pixels[i+1]*1.5 && pixels[i]>pixels[i+2]*1.5) foliage.push([x,y]);
      }
      return { image, tree, foliage };
    })().catch(error => { artworkPromise = null; throw error; });
  }
  return artworkPromise;
}

export function treePlacement(side, width, height) {
  const scale = Math.min(height * 1.03 / SOURCE_HEIGHT, .98);
  return { x: side ? width + 50 * scale : -50 * scale,
    y: height - SOURCE_HEIGHT * scale + 32 * scale, scale, mirror: side ? -1 : 1 };
}

const vertexShader = `
attribute vec2 a_position;
attribute vec2 a_uv;
attribute vec3 a_weights;
attribute vec2 a_primary;
attribute vec2 a_secondary;
attribute vec2 a_twig;
uniform vec2 u_resolution;
uniform vec2 u_origin;
uniform vec2 u_scale;
uniform vec3 u_angles;
uniform float u_rotation;
varying vec2 v_uv;
vec2 rotate(vec2 p, float a) {
  float c=cos(a), s=sin(a);
  return vec2(c*p.x-s*p.y,s*p.x+c*p.y);
}
void main() {
  vec2 p=a_position;
  // All three transparent geometry layers share these same vertices and UVs.
  // Root weights are exactly zero; there are no overlapping alpha skirts.
  p += (rotate(a_position-a_primary,u_angles.x)-(a_position-a_primary))*a_weights.x;
  p += (rotate(a_position-a_secondary,u_angles.y)-(a_position-a_secondary))*a_weights.y;
  p += (rotate(a_position-a_twig,u_angles.z)-(a_position-a_twig))*a_weights.z;
  p=u_origin+rotate(p,u_rotation)*u_scale;
  gl_Position=vec4(p.x/u_resolution.x*2.0-1.0,1.0-p.y/u_resolution.y*2.0,0.0,1.0);
  v_uv=a_uv;
}`;
const fragmentShader = `
precision mediump float;
uniform sampler2D u_image;
uniform float u_opacity;
varying vec2 v_uv;
void main() { gl_FragColor=texture2D(u_image,v_uv)*u_opacity; }
`;

function meshData() {
  const vertices = [], layers = [[],[],[]];
  const columns = 64, rows = 88;
  for (let row=0; row<=rows; row++) for (let col=0; col<=columns; col++) {
    const x=col/columns*SOURCE_WIDTH, y=row/rows*SOURCE_HEIGHT;
    vertices.push(x,y,col/columns,row/rows,...rigWeights(x,y),...rigPivots(x,y).flat());
  }
  for (let row=0; row<rows; row++) for (let col=0; col<columns; col++) {
    const a=row*(columns+1)+col, b=a+1, c=a+columns+1, d=c+1;
    for (const triangle of [[a,b,c],[b,d,c]]) {
      const weight = Math.max(...triangle.map(i => vertices[i*13+4]));
      const fine = Math.max(...triangle.map(i => vertices[i*13+5]));
      layers[weight === 0 ? 0 : fine > .15 ? 2 : 1].push(...triangle);
    }
  }
  return { vertices: new Float32Array(vertices), layers: layers.map(v=>new Uint16Array(v)) };
}
const mesh = meshData();

export function createMapleRenderer(canvas, artwork) {
  const gl=canvas.getContext('webgl', { alpha:true, antialias:true, premultipliedAlpha:true, depth:false, stencil:false });
  if (!gl) return null;
  const allocated = [];
  function shader(type, source) {
    const s=gl.createShader(type); gl.shaderSource(s,source); gl.compileShader(s);
    if (!gl.getShaderParameter(s,gl.COMPILE_STATUS)) throw new Error(gl.getShaderInfoLog(s));
    return s;
  }
  const vs=shader(gl.VERTEX_SHADER,vertexShader), fs=shader(gl.FRAGMENT_SHADER,fragmentShader);
  const program=gl.createProgram(); gl.attachShader(program,vs); gl.attachShader(program,fs); gl.linkProgram(program);
  gl.deleteShader(vs); gl.deleteShader(fs);
  if (!gl.getProgramParameter(program,gl.LINK_STATUS)) throw new Error(gl.getProgramInfoLog(program));
  gl.useProgram(program);
  const uniforms=Object.fromEntries(['resolution','origin','scale','angles','rotation','opacity'].map(n=>[n,gl.getUniformLocation(program,`u_${n}`)]));
  const attributes=[['position',2,0],['uv',2,2],['weights',3,4],['primary',2,7],['secondary',2,9],['twig',2,11]]
    .map(([name,size,offset])=>({location:gl.getAttribLocation(program,`a_${name}`),size,offset}));
  function buffer(target, data) {
    const b=gl.createBuffer(); gl.bindBuffer(target,b); gl.bufferData(target,data,gl.STATIC_DRAW); allocated.push(b); return b;
  }
  function bindVertices(b) {
    gl.bindBuffer(gl.ARRAY_BUFFER,b);
    attributes.forEach(a=>{ gl.enableVertexAttribArray(a.location); gl.vertexAttribPointer(a.location,a.size,gl.FLOAT,false,52,a.offset*4); });
  }
  const treeBuffer=buffer(gl.ARRAY_BUFFER,mesh.vertices);
  // Separate, non-overlapping transparent trunk / branch / foliage draw layers.
  const layers=mesh.layers.map(indices=>({buffer:buffer(gl.ELEMENT_ARRAY_BUFFER,indices),count:indices.length}));
  const [lx,ly,lw,lh]=leafRect;
  const leafVertices=[];
  for (const [x,y] of [[0,0],[1,0],[0,1],[1,1]]) {
    leafVertices.push((x-.5)*lw,(y-.5)*lh,(lx+x*lw)/SOURCE_WIDTH,(ly+y*lh)/SOURCE_HEIGHT,0,0,0,0,0,0,0,0,0);
  }
  const leafBuffer=buffer(gl.ARRAY_BUFFER,new Float32Array(leafVertices));
  function texture(source) {
    const t=gl.createTexture(); gl.bindTexture(gl.TEXTURE_2D,t);
    gl.pixelStorei(gl.UNPACK_PREMULTIPLY_ALPHA_WEBGL,true);
    gl.texImage2D(gl.TEXTURE_2D,0,gl.RGBA,gl.RGBA,gl.UNSIGNED_BYTE,source);
    gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_MIN_FILTER,gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_MAG_FILTER,gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_WRAP_S,gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_WRAP_T,gl.CLAMP_TO_EDGE);
    return t;
  }
  const treeTexture=texture(artwork.tree), leafTexture=texture(artwork.image);
  gl.enable(gl.BLEND); gl.blendFunc(gl.ONE,gl.ONE_MINUS_SRC_ALPHA);
  gl.clearColor(0,0,0,0);
  let width=0,height=0,dpr=1;
  return {
    resize(w,h) {
      width=w; height=h; dpr=Math.min(window.devicePixelRatio || 1,1.5);
      canvas.width=Math.round(w*dpr); canvas.height=Math.round(h*dpr);
      gl.viewport(0,0,canvas.width,canvas.height);
    },
    render(angles, leaves, gutter, reduced) {
      gl.disable(gl.SCISSOR_TEST); gl.clear(gl.COLOR_BUFFER_BIT);
      gl.uniform2f(uniforms.resolution,width,height);
      gl.enable(gl.SCISSOR_TEST);
      for (let side=0;side<2;side++) {
        gl.scissor(side ? Math.floor((width-gutter)*dpr) : 0,0,Math.ceil(gutter*dpr),canvas.height);
        const p=treePlacement(side,width,height);
        bindVertices(treeBuffer); gl.bindTexture(gl.TEXTURE_2D,treeTexture);
        gl.uniform2f(uniforms.origin,p.x,p.y);
        gl.uniform2f(uniforms.scale,p.scale*p.mirror,p.scale);
        gl.uniform3fv(uniforms.angles,angles[side].map(a=>a*Math.PI/180));
        gl.uniform1f(uniforms.rotation,0); gl.uniform1f(uniforms.opacity,1);
        layers.forEach(layer=>{ gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER,layer.buffer); gl.drawElements(gl.TRIANGLES,layer.count,gl.UNSIGNED_SHORT,0); });
        if (reduced) continue;
        bindVertices(leafBuffer); gl.bindTexture(gl.TEXTURE_2D,leafTexture);
        gl.uniform3f(uniforms.angles,0,0,0);
        leaves.filter(l=>l.side===side).forEach(l=>{
          gl.uniform2f(uniforms.origin,side ? width-l.x : l.x,l.y);
          const roll=.65+.35*Math.sin(l.angle*.7);
          gl.uniform2f(uniforms.scale,l.size/lw*roll,l.size/lh);
          gl.uniform1f(uniforms.rotation,l.angle);
          gl.uniform1f(uniforms.opacity,Math.min(1,l.age*1.5,Math.max(0,(height+20-l.y)/60)));
          gl.drawArrays(gl.TRIANGLE_STRIP,0,4);
        });
      }
      gl.disable(gl.SCISSOR_TEST);
    },
    dispose() {
      allocated.forEach(b=>gl.deleteBuffer(b));
      gl.deleteTexture(treeTexture); gl.deleteTexture(leafTexture); gl.deleteProgram(program);
    },
  };
}
