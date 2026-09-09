import React, { useRef, useEffect, useState } from 'react';

const vertexShader = `
precision highp float;

attribute vec3 position;
attribute vec2 uv;
attribute vec3 normal;

uniform mat4 modelViewMatrix;
uniform mat4 projectionMatrix;
uniform mat3 normalMatrix;

uniform float uPosition;
uniform float uTime;
uniform float uSpeed;
uniform vec3 distortionAxis;
uniform vec3 rotationAxis;
uniform float uDistortion;

varying vec2 vUv;
varying vec3 vNormal;

float PI = 3.141592653589793238;
mat4 rotationMatrix(vec3 axis, float angle) {
    axis = normalize(axis);
    float s = sin(angle);
    float c = cos(angle);
    float oc = 1.0 - c;
    
    return mat4(
      oc * axis.x * axis.x + c,         oc * axis.x * axis.y - axis.z * s,  oc * axis.z * axis.x + axis.y * s,  0.0,
      oc * axis.x * axis.y + axis.z * s,oc * axis.y * axis.y + c,           oc * axis.y * axis.z - axis.x * s,  0.0,
      oc * axis.z * axis.x - axis.y * s,oc * axis.y * axis.z + axis.x * s,  oc * axis.z * axis.z + c,           0.0,
      0.0,                              0.0,                                0.0,                                1.0
    );
}

vec3 rotate(vec3 v, vec3 axis, float angle) {
  mat4 m = rotationMatrix(axis, angle);
  return (m * vec4(v, 1.0)).xyz;
}

float qinticInOut(float t) {
  return t < 0.5
    ? 16.0 * pow(t, 5.0)
    : -0.5 * abs(pow(2.0 * t - 2.0, 5.0)) + 1.0;
}

void main() {
  vUv = uv;
  
  float norm = 0.5;
  vec3 newpos = position;
  float offset = (dot(distortionAxis, position) + norm / 2.) / norm;
  float localprogress = clamp(
    (fract(uPosition * 5.0 * 0.01) - 0.01 * uDistortion * offset) / (1. - 0.01 * uDistortion),
    0.,
    2.
  );
  localprogress = qinticInOut(localprogress) * PI;
  newpos = rotate(newpos, rotationAxis, localprogress);

  gl_Position = projectionMatrix * modelViewMatrix * vec4(newpos, 1.0);
}
`;

const fragmentShader = `
precision highp float;

uniform vec2 uImageSize;
uniform vec2 uPlaneSize;
uniform sampler2D tMap;

varying vec2 vUv;

void main() {
  vec2 imageSize = uImageSize;
  vec2 planeSize = uPlaneSize;

  float imgX = max(imageSize.x, 1.0);
  float imgY = max(imageSize.y, 1.0);
  float plnX = max(planeSize.x, 1.0);
  float plnY = max(planeSize.y, 1.0);

  float imageAspect = imgX / imgY;
  float planeAspect = plnX / plnY;
  vec2 scale = vec2(1.0, 1.0);

  if (planeAspect > imageAspect) {
      scale.x = imageAspect / planeAspect;
  } else {
      scale.y = planeAspect / imageAspect;
  }

  vec2 uv = vUv * scale + (1.0 - scale) * 0.5;

  gl_FragColor = texture2D(tMap, uv);
}
`;

function lerp(p1: number, p2: number, t: number) {
  return p1 + (p2 - p1) * t;
}

function map(num: number, min1: number, max1: number, min2: number, max2: number, round = false) {
  const num1 = (num - min1) / (max1 - min1);
  const num2 = num1 * (max2 - min2) + min2;
  return round ? Math.round(num2) : num2;
}

function renderPosterCanvas(text: string, index: number, img?: HTMLImageElement): HTMLCanvasElement {
  if (typeof document === 'undefined') return {} as HTMLCanvasElement;
  const canvas = document.createElement('canvas');
  const size = 1024;
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext('2d');

  if (!ctx) return canvas;

  if (img && img.naturalWidth > 0) {
    const imgAspect = img.naturalWidth / img.naturalHeight;
    let drawW = size;
    let drawH = size;
    let offsetX = 0;
    let offsetY = 0;

    if (imgAspect > 1) {
      drawW = size * imgAspect;
      offsetX = -(drawW - size) / 2;
    } else {
      drawH = size / imgAspect;
      offsetY = -(drawH - size) / 2;
    }

    try {
      ctx.drawImage(img, offsetX, offsetY, drawW, drawH);
    } catch (e) {
      const gradBg = ctx.createLinearGradient(0, 0, size, size);
      gradBg.addColorStop(0, '#1a1b20');
      gradBg.addColorStop(1, '#0d0e12');
      ctx.fillStyle = gradBg;
      ctx.fillRect(0, 0, size, size);
    }
  } else {
    const gradBg = ctx.createLinearGradient(0, 0, size, size);
    gradBg.addColorStop(0, '#1c1d24');
    gradBg.addColorStop(0.5, '#252732');
    gradBg.addColorStop(1, '#121318');
    ctx.fillStyle = gradBg;
    ctx.fillRect(0, 0, size, size);

    ctx.strokeStyle = 'rgba(255, 107, 0, 0.15)';
    ctx.lineWidth = 3;
    for (let i = 128; i < size; i += 128) {
      ctx.beginPath(); ctx.moveTo(i, 0); ctx.lineTo(i, size); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(0, i); ctx.lineTo(size, i); ctx.stroke();
    }
  }

  // Dark gradient overlay at bottom
  const grad = ctx.createLinearGradient(0, size * 0.35, 0, size);
  grad.addColorStop(0, 'rgba(0, 0, 0, 0)');
  grad.addColorStop(0.5, 'rgba(0, 0, 0, 0.45)');
  grad.addColorStop(1, 'rgba(0, 0, 0, 0.9)');
  ctx.fillStyle = grad;
  ctx.fillRect(0, size * 0.35, size, size * 0.65);

  // Glass pill badge
  const boxW = size * 0.86;
  const boxH = 116;
  const boxX = (size - boxW) / 2;
  const boxY = size - 170;

  ctx.save();
  ctx.fillStyle = 'rgba(12, 12, 18, 0.78)';
  ctx.strokeStyle = 'rgba(255, 107, 0, 0.6)';
  ctx.lineWidth = 4;
  
  const r = 24;
  ctx.beginPath();
  ctx.moveTo(boxX + r, boxY);
  ctx.lineTo(boxX + boxW - r, boxY);
  ctx.quadraticCurveTo(boxX + boxW, boxY, boxX + boxW, boxY + r);
  ctx.lineTo(boxX + boxW, boxY + boxH - r);
  ctx.quadraticCurveTo(boxX + boxW, boxY + boxH, boxX + boxW - r, boxY + boxH);
  ctx.lineTo(boxX + r, boxY + boxH);
  ctx.quadraticCurveTo(boxX, boxY + boxH, boxX, boxY + boxH - r);
  ctx.lineTo(boxX, boxY + r);
  ctx.quadraticCurveTo(boxX, boxY, boxX + r, boxY);
  ctx.closePath();
  ctx.fill();
  ctx.stroke();
  ctx.restore();

  // Orange accent dot
  ctx.fillStyle = '#FF6B00';
  ctx.beginPath();
  ctx.arc(boxX + 38, boxY + boxH / 2, 8, 0, Math.PI * 2);
  ctx.fill();

  // Tag number
  const numStr = `0${(index % 5) + 1}`;
  ctx.fillStyle = '#FF6B00';
  ctx.font = "bold 24px 'Plus Jakarta Sans', sans-serif";
  ctx.textAlign = 'left';
  ctx.fillText(numStr, boxX + 58, boxY + boxH / 2 + 8);

  // Main Text
  ctx.fillStyle = '#FFFFFF';
  ctx.font = "900 36px 'Plus Jakarta Sans', sans-serif";
  ctx.textAlign = 'left';
  ctx.fillText(text.toUpperCase(), boxX + 110, boxY + boxH / 2 + 11);

  return canvas;
}

export type FlyingPostersItem = string | { image?: string; url?: string; text?: string; title?: string; [key: string]: any };

export interface FlyingPostersProps {
  items?: FlyingPostersItem[];
  planeWidth?: number;
  planeHeight?: number;
  distortion?: number;
  scrollEase?: number;
  cameraFov?: number;
  cameraZ?: number;
  className?: string;
  [key: string]: any;
}

export default function FlyingPosters({
  items = [
    { image: 'https://picsum.photos/500/500?grayscale', text: 'PROTOTYPING' },
    { image: 'https://picsum.photos/600/600?grayscale', text: 'MANUFACTURING' },
    { image: 'https://picsum.photos/400/400?grayscale', text: 'PRECISION' },
    { image: 'https://picsum.photos/500/500?grayscale', text: 'PROTOTYPING' },
    { image: 'https://picsum.photos/600/600?grayscale', text: 'MANUFACTURING' }
  ],
  planeWidth = 320,
  planeHeight = 320,
  distortion = 3,
  scrollEase = 0.1,
  cameraFov = 45,
  cameraZ = 20,
  className = '',
  ...props
}: FlyingPostersProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted || !containerRef.current || !canvasRef.current || typeof window === 'undefined') return;

    let destroyed = false;
    let rafId = 0;
    let cleanupListeners = () => {};

    import('ogl').then((OGL) => {
      if (destroyed || !containerRef.current || !canvasRef.current) return;

      const container = containerRef.current;
      const canvas = canvasRef.current;

      const renderer = new OGL.Renderer({
        canvas,
        alpha: true,
        antialias: true,
        dpr: Math.min(window.devicePixelRatio, 2)
      });
      const gl = renderer.gl;

      const camera = new OGL.Camera(gl);
      camera.fov = cameraFov;
      camera.position.z = cameraZ;

      const scene = new OGL.Transform();

      const planeGeometry = new OGL.Plane(gl, {
        heightSegments: 1,
        widthSegments: 100
      });

      const rect = container.getBoundingClientRect();
      let screen = { width: rect.width, height: rect.height };
      renderer.setSize(screen.width, screen.height);

      camera.perspective({ aspect: gl.canvas.width / gl.canvas.height });
      const fovRad = (camera.fov * Math.PI) / 180;
      const vpHeight = 2 * Math.tan(fovRad / 2) * camera.position.z;
      const vpWidth = vpHeight * camera.aspect;
      let viewport = { height: vpHeight, width: vpWidth };

      const scroll = {
        ease: scrollEase,
        current: 0,
        target: 0,
        last: 0,
        position: 0
      };

      const defaultTexts = ["PROTOTYPING", "MANUFACTURING", "PRECISION", "PROTOTYPING", "MANUFACTURING"];

      // Create Media items
      const medias = items.map((item: any, index: number) => {
        const imgSrc = typeof item === 'string' ? item : item?.image || item?.url || item;
        const posterText = (typeof item === 'object' && item?.text)
          ? item.text
          : defaultTexts[index % defaultTexts.length];

        const initialCanvas = renderPosterCanvas(posterText, index);
        const texture = new OGL.Texture(gl, {
          generateMipmaps: false,
          image: initialCanvas
        });

        const program = new OGL.Program(gl, {
          depthTest: false,
          depthWrite: false,
          fragment: fragmentShader,
          vertex: vertexShader,
          uniforms: {
            tMap: { value: texture },
            uPosition: { value: 0 },
            uPlaneSize: { value: [100, 100] },
            uImageSize: { value: [1024, 1024] },
            uSpeed: { value: 0 },
            rotationAxis: { value: [0, 1, 0] },
            distortionAxis: { value: [1, 1, 0] },
            uDistortion: { value: distortion },
            uViewportSize: { value: [viewport.width, viewport.height] },
            uTime: { value: 0 }
          },
          cullFace: false
        });

        const mesh = new OGL.Mesh(gl, { geometry: planeGeometry, program });
        mesh.setParent(scene);

        const img = new Image();
        img.crossOrigin = 'anonymous';
        img.src = imgSrc;
        img.onload = () => {
          if (destroyed) return;
          try {
            const updatedCanvas = renderPosterCanvas(posterText, index, img);
            texture.image = updatedCanvas;
            texture.needsUpdate = true;
          } catch (e) {
            console.warn("Image crossOrigin fallback:", e);
          }
        };

        const mediaObj = {
          mesh,
          program,
          padding: 4,
          height: 0,
          heightTotal: 0,
          y: 0,
          onResize(s: any, vp: any) {
            mesh.scale.x = (vp.width * planeWidth) / s.width;
            mesh.scale.y = (vp.height * planeHeight) / s.height;
            mesh.position.x = 0;
            program.uniforms.uPlaneSize.value = [mesh.scale.x, mesh.scale.y];
            program.uniforms.uViewportSize.value = [vp.width, vp.height];

            this.height = mesh.scale.y + this.padding;
            this.heightTotal = this.height * items.length;
            this.y = -this.heightTotal / 2 + (index + 0.5) * this.height;
          },
          update(sc: any) {
            mesh.position.y = this.y - sc.current;
            const pos = map(mesh.position.y, -vpHeight, vpHeight, 5, 15);
            program.uniforms.uPosition.value = pos;
            program.uniforms.uTime.value += 0.04;
            program.uniforms.uSpeed.value = sc.current;
          }
        };

        mediaObj.onResize(screen, viewport);
        return mediaObj;
      });

      const updateScrollFromPage = () => {
        if (!container || destroyed || !medias || medias.length === 0) return;
        const parent = container.parentElement;
        const targetEl = parent || container;
        const rect = targetEl.getBoundingClientRect();
        const winH = window.innerHeight;

        let progress = 0;
        if (parent && rect.height > winH) {
          const scrollableDist = rect.height - winH;
          const currentScroll = -rect.top;
          progress = Math.max(0, Math.min(1, currentScroll / scrollableDist));
        } else {
          const total = winH + rect.height;
          const current = winH - rect.top;
          progress = Math.max(0, Math.min(1, current / total));
        }

        const h = medias[0]?.height || 5;
        const half = (items.length - 1) / 2;
        const minScroll = -half * h;
        const maxScroll = half * h;

        scroll.target = minScroll + progress * (maxScroll - minScroll);
      };

      const onResize = () => {
        if (!container || destroyed) return;
        const r = container.getBoundingClientRect();
        screen = { width: r.width, height: r.height };
        renderer.setSize(screen.width, screen.height);

        camera.perspective({ aspect: gl.canvas.width / gl.canvas.height });
        const f = (camera.fov * Math.PI) / 180;
        const h = 2 * Math.tan(f / 2) * camera.position.z;
        const w = h * camera.aspect;
        viewport = { height: h, width: w };

        medias.forEach(m => m.onResize(screen, viewport));
        updateScrollFromPage();
      };

      window.addEventListener('resize', onResize);
      window.addEventListener('scroll', updateScrollFromPage, { passive: true });

      // Initial sync
      updateScrollFromPage();

      cleanupListeners = () => {
        window.removeEventListener('resize', onResize);
        window.removeEventListener('scroll', updateScrollFromPage);
      };

      const updateLoop = () => {
        if (destroyed) return;
        scroll.current = lerp(scroll.current, scroll.target, scroll.ease);
        medias.forEach(m => m.update(scroll));
        renderer.render({ scene, camera });
        scroll.last = scroll.current;
        rafId = requestAnimationFrame(updateLoop);
      };

      updateLoop();
    }).catch(err => {
      console.warn("OGL initialization failed:", err);
    });

    return () => {
      destroyed = true;
      if (rafId) cancelAnimationFrame(rafId);
      cleanupListeners();
    };
  }, [mounted, items, planeWidth, planeHeight, distortion, scrollEase, cameraFov, cameraZ]);

  return (
    <div ref={containerRef} className={`w-full h-full overflow-hidden relative z-2 ${className}`} {...props}>
      <canvas ref={canvasRef} className="block w-full h-full" />
    </div>
  );
}
