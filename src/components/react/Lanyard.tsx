// 3D lanyard ID card with rope physics. Drag the card to swing it around.
// Heavy (three.js + Rapier WASM), so it is only ever loaded lazily via LanyardIsland.
import { useEffect, useMemo, useRef, useState } from 'react';
import * as THREE from 'three';
import { Canvas, extend, useFrame, useThree, type ThreeElement } from '@react-three/fiber';
import { Environment, Lightformer, RoundedBox } from '@react-three/drei';
import {
  BallCollider,
  CuboidCollider,
  Physics,
  RigidBody,
  useAfterPhysicsStep,
  useRopeJoint,
  useSphericalJoint,
  type RapierRigidBody,
  type RigidBodyProps,
} from '@react-three/rapier';
import { MeshLineGeometry, MeshLineMaterial } from 'meshline';

extend({ MeshLineGeometry, MeshLineMaterial });
declare module '@react-three/fiber' {
  interface ThreeElements {
    meshLineGeometry: ThreeElement<typeof MeshLineGeometry>;
    meshLineMaterial: Omit<ThreeElement<typeof MeshLineMaterial>, 'args'> & { args?: ConstructorParameters<typeof MeshLineMaterial> };
  }
}

export interface CardInfo {
  photo: string;
  name: string;
  role: string;
  org: string;
  location: string;
  handle: string;
}

const CARD_W = 1.6;
const CARD_H = 2.25;
const TEX_W = 640;
const TEX_H = Math.round((TEX_W * CARD_H) / CARD_W);
/** Where the band meets the card (local card space) — inside the metal clip, so the joint is hidden. */
const CLIP_ANCHOR = new THREE.Vector3(0, CARD_H / 2 + 0.1, 0);

// Card palette is fixed (it's a physical object), tuned to read on both site themes.
const BG = '#070a10';
const PANEL = '#0e1520';
const LINE = '#1d2a3a';
const TEXT = '#e7eef8';
const MUTED = '#8d99ac';
const CYAN = '#22d3ee';
const VIOLET = '#a78bfa';
const SANS = '600 {s}px system-ui, "Segoe UI", sans-serif';
const MONO = '500 {s}px ui-monospace, "Cascadia Mono", Consolas, monospace';
const font = (tpl: string, size: number) => tpl.replace('{s}', String(size));

function roundRect(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, r: number) {
  ctx.beginPath();
  ctx.roundRect(x, y, w, h, r);
}

function gradient(ctx: CanvasRenderingContext2D, x0: number, y0: number, x1: number, y1: number) {
  const g = ctx.createLinearGradient(x0, y0, x1, y1);
  g.addColorStop(0, CYAN);
  g.addColorStop(1, VIOLET);
  return g;
}

function drawGrid(ctx: CanvasRenderingContext2D, W: number, H: number) {
  ctx.strokeStyle = 'rgba(34,211,238,0.06)';
  ctx.lineWidth = 1;
  for (let x = 0; x < W; x += 32) { ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, H); ctx.stroke(); }
  for (let y = 0; y < H; y += 32) { ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(W, y); ctx.stroke(); }
}

function drawFront(ctx: CanvasRenderingContext2D, info: CardInfo, photo: HTMLImageElement | null) {
  const W = TEX_W, H = TEX_H;
  ctx.clearRect(0, 0, W, H);
  roundRect(ctx, 0, 0, W, H, 36);
  ctx.fillStyle = BG;
  ctx.fill();
  ctx.save();
  ctx.clip();
  drawGrid(ctx, W, H);

  // header
  ctx.fillStyle = PANEL;
  ctx.fillRect(0, 0, W, 150);
  ctx.fillStyle = gradient(ctx, 0, 0, W, 0);
  ctx.fillRect(0, 146, W, 4);
  roundRect(ctx, 50, 44, 62, 62, 14);
  ctx.strokeStyle = gradient(ctx, 50, 44, 112, 106);
  ctx.lineWidth = 3;
  ctx.stroke();
  ctx.fillStyle = CYAN;
  ctx.font = font(SANS, 28);
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText('RD', 81, 77);
  ctx.textAlign = 'left';
  ctx.fillStyle = TEXT;
  ctx.font = font(SANS, 25);
  ctx.fillText('ACCESS PASS', 135, 62);
  ctx.fillStyle = MUTED;
  ctx.font = font(MONO, 19);
  ctx.fillText(`ID://${info.handle.replace('@', '')}-${new Date().getFullYear()}`, 135, 94);
  // status LED
  ctx.fillStyle = '#34d399';
  ctx.beginPath();
  ctx.arc(W - 60, 75, 9, 0, Math.PI * 2);
  ctx.fill();
  // lanyard slot
  roundRect(ctx, W / 2 - 50, 18, 100, 16, 8);
  ctx.fillStyle = 'rgba(231,238,248,0.18)';
  ctx.fill();

  // photo with HUD corner brackets
  const px = 60, py = 190, pw = W - 120, ph = Math.round(pw * 0.82);
  roundRect(ctx, px, py, pw, ph, 18);
  ctx.save();
  ctx.clip();
  ctx.fillStyle = PANEL;
  ctx.fillRect(px, py, pw, ph);
  if (photo) {
    const target = pw / ph;
    const src = photo.width / photo.height;
    let sw = photo.width, sh = photo.height, sx = 0, sy = 0;
    if (src > target) { sw = photo.height * target; sx = (photo.width - sw) / 2; }
    else { sh = photo.width / target; sy = (photo.height - sh) * 0.2; }
    ctx.drawImage(photo, sx, sy, sw, sh, px, py, pw, ph);
  }
  ctx.restore();
  ctx.strokeStyle = CYAN;
  ctx.lineWidth = 4;
  const b = 34, o = 10;
  ([[px - o, py - o, 1, 1], [px + pw + o, py - o, -1, 1], [px - o, py + ph + o, 1, -1], [px + pw + o, py + ph + o, -1, -1]] as const).forEach(([x, y, dx, dy]) => {
    ctx.beginPath();
    ctx.moveTo(x, y + dy * b);
    ctx.lineTo(x, y);
    ctx.lineTo(x + dx * b, y);
    ctx.stroke();
  });

  // text
  let y = py + ph + 70;
  ctx.fillStyle = TEXT;
  ctx.font = font(SANS, 46);
  ctx.fillText(info.name, 60, y);
  y += 42;
  ctx.fillStyle = gradient(ctx, 60, 0, 460, 0);
  ctx.font = font(MONO, 24);
  ctx.fillText(info.role.toUpperCase(), 60, y);
  y += 38;
  ctx.fillStyle = MUTED;
  ctx.font = font(SANS.replace('600', '400'), 21);
  ctx.fillText(info.org, 60, y);

  // footer: barcode + location
  const fy = H - 70;
  ctx.fillStyle = TEXT;
  let bx = 60;
  for (let i = 0; i < 38; i++) {
    const w = (i * 7919) % 3 === 0 ? 5 : 2;
    ctx.fillRect(bx, fy - 26, w, 44);
    bx += w + 4;
  }
  ctx.textAlign = 'right';
  ctx.fillStyle = MUTED;
  ctx.font = font(MONO, 18);
  ctx.fillText(info.location.toUpperCase(), W - 60, fy);
  ctx.restore();
}

function drawBack(ctx: CanvasRenderingContext2D, info: CardInfo) {
  const W = TEX_W, H = TEX_H;
  ctx.clearRect(0, 0, W, H);
  roundRect(ctx, 0, 0, W, H, 36);
  ctx.fillStyle = BG;
  ctx.fill();
  ctx.save();
  ctx.clip();
  drawGrid(ctx, W, H);
  // circuit traces
  ctx.strokeStyle = 'rgba(167,139,250,0.35)';
  ctx.lineWidth = 3;
  for (let i = 0; i < 6; i++) {
    const y0 = 140 + i * 110;
    ctx.beginPath();
    ctx.moveTo(0, y0);
    ctx.lineTo(120 + i * 20, y0);
    ctx.lineTo(170 + i * 20, y0 + 50);
    ctx.lineTo(W, y0 + 50);
    ctx.stroke();
    ctx.fillStyle = VIOLET;
    ctx.beginPath();
    ctx.arc(170 + i * 20, y0 + 50, 6, 0, Math.PI * 2);
    ctx.fill();
  }
  ctx.textAlign = 'center';
  ctx.fillStyle = gradient(ctx, W / 2 - 150, 0, W / 2 + 150, 0);
  ctx.font = font(SANS.replace('600', '800'), 150);
  ctx.fillText('RD', W / 2, H / 2 + 40);
  ctx.fillStyle = TEXT;
  ctx.font = font(SANS, 28);
  ctx.fillText(info.name, W / 2, H / 2 + 110);
  ctx.fillStyle = MUTED;
  ctx.font = font(MONO, 20);
  ctx.fillText('// drag me around', W / 2, H - 80);
  ctx.restore();
}

function useCardTextures(info: CardInfo) {
  const [photo, setPhoto] = useState<HTMLImageElement | null>(null);
  useEffect(() => {
    const img = new Image();
    img.decoding = 'async';
    img.onload = () => setPhoto(img);
    img.src = info.photo;
  }, [info.photo]);

  const textures = useMemo(() => {
    const make = (draw: (ctx: CanvasRenderingContext2D) => void) => {
      const c = document.createElement('canvas');
      c.width = TEX_W;
      c.height = TEX_H;
      draw(c.getContext('2d')!);
      const t = new THREE.CanvasTexture(c);
      t.colorSpace = THREE.SRGBColorSpace;
      t.anisotropy = 8;
      return t;
    };
    return {
      front: make((ctx) => drawFront(ctx, info, photo)),
      back: make((ctx) => drawBack(ctx, info)),
    };
  }, [info, photo]);

  useEffect(() => () => { textures.front.dispose(); textures.back.dispose(); }, [textures]);
  return textures;
}

function useBandTexture() {
  return useMemo(() => {
    const c = document.createElement('canvas');
    c.width = 512;
    c.height = 64;
    const ctx = c.getContext('2d')!;
    ctx.fillStyle = '#0b1220';
    ctx.fillRect(0, 0, 512, 64);
    ctx.fillStyle = gradient(ctx, 0, 0, 512, 0);
    ctx.fillRect(0, 0, 512, 4);
    ctx.fillRect(0, 60, 512, 4);
    ctx.fillStyle = CYAN;
    ctx.font = font(MONO, 26);
    ctx.textBaseline = 'middle';
    ctx.fillText('RAFIIF.DZ  //  ACCESS  //', 14, 34);
    const t = new THREE.CanvasTexture(c);
    t.colorSpace = THREE.SRGBColorSpace;
    t.wrapS = t.wrapT = THREE.RepeatWrapping;
    return t;
  }, []);
}

type Lerped = RapierRigidBody & { lerped?: THREE.Vector3 };

function Band({ info }: { info: CardInfo }) {
  const band = useRef<THREE.Mesh<MeshLineGeometry, MeshLineMaterial>>(null);
  const fixed = useRef<RapierRigidBody>(null!);
  const j1 = useRef<RapierRigidBody>(null!);
  const j2 = useRef<RapierRigidBody>(null!);
  const j3 = useRef<RapierRigidBody>(null!);
  const card = useRef<RapierRigidBody>(null!);

  const vec = useMemo(() => new THREE.Vector3(), []);
  const ang = useMemo(() => new THREE.Vector3(), []);
  const rot = useMemo(() => new THREE.Vector3(), []);
  const dir = useMemo(() => new THREE.Vector3(), []);
  const quat = useMemo(() => new THREE.Quaternion(), []);
  const curve = useMemo(() => {
    const c = new THREE.CatmullRomCurve3([new THREE.Vector3(), new THREE.Vector3(), new THREE.Vector3(), new THREE.Vector3()]);
    c.curveType = 'chordal';
    return c;
  }, []);

  const [dragged, drag] = useState<THREE.Vector3 | false>(false);
  const [hovered, hover] = useState(false);
  const textures = useCardTextures(info);
  const size = useThree((s) => s.size);
  const bandTexture = useBandTexture();

  const segmentProps: RigidBodyProps = { type: 'dynamic', canSleep: true, colliders: false, angularDamping: 4, linearDamping: 4 };

  useRopeJoint(fixed, j1, [[0, 0, 0], [0, 0, 0], 1]);
  useRopeJoint(j1, j2, [[0, 0, 0], [0, 0, 0], 1]);
  useRopeJoint(j2, j3, [[0, 0, 0], [0, 0, 0], 1]);
  useSphericalJoint(j3, card, [[0, 0, 0], [CLIP_ANCHOR.x, CLIP_ANCHOR.y, CLIP_ANCHOR.z]]);

  useEffect(() => {
    if (!hovered) return;
    document.body.style.cursor = dragged ? 'grabbing' : 'grab';
    return () => { document.body.style.cursor = ''; };
  }, [hovered, dragged]);

  // Input runs before the physics step.
  useFrame((state) => {
    if (!dragged || !card.current) return;
    vec.set(state.pointer.x, state.pointer.y, 0.5).unproject(state.camera);
    dir.copy(vec).sub(state.camera.position).normalize();
    vec.add(dir.multiplyScalar(state.camera.position.length()));
    [card, j1, j2, j3, fixed].forEach((r) => r.current?.wakeUp());
    card.current.setNextKinematicTranslation({ x: vec.x - dragged.x, y: vec.y - dragged.y, z: vec.z - dragged.z });
  });

  // The band is rebuilt *after* each physics step, from the same state the card mesh is drawn with,
  // so the band and the clip can never drift apart (that lag was the visible glitch).
  useAfterPhysicsStep(() => {
    if (!fixed.current || !j1.current || !j2.current || !j3.current || !card.current || !band.current) return;

    // Smooth the two middle joints so the band doesn't jitter. Factor capped at 1 (no overshoot).
    [j1, j2].forEach((r) => {
      const body = r.current as Lerped;
      if (!body.lerped) body.lerped = new THREE.Vector3().copy(body.translation());
      const clamped = Math.max(0.1, Math.min(1, body.lerped.distanceTo(body.translation())));
      body.lerped.lerp(body.translation(), Math.min(1, (1 / 60) * (10 + clamped * 40)));
    });

    // Band end = the clip anchor in world space, derived from the card body itself.
    const t = card.current.translation();
    const q = card.current.rotation();
    quat.set(q.x, q.y, q.z, q.w);
    curve.points[0].copy(CLIP_ANCHOR).applyQuaternion(quat).add(vec.set(t.x, t.y, t.z));
    curve.points[1].copy((j2.current as Lerped).lerped!);
    curve.points[2].copy((j1.current as Lerped).lerped!);
    curve.points[3].copy(fixed.current.translation());
    band.current.geometry.setPoints(curve.getPoints(32));

    // Gently turn the card back to face the camera.
    ang.copy(card.current.angvel());
    rot.copy(card.current.rotation());
    card.current.setAngvel({ x: ang.x, y: ang.y - rot.y * 0.25, z: ang.z }, true);
  });

  return (
    <>
      <group position={[0, 4.2, 0]}>
        <RigidBody ref={fixed} {...segmentProps} type="fixed" />
        <RigidBody position={[0.5, 0, 0]} ref={j1} {...segmentProps}>
          <BallCollider args={[0.1]} />
        </RigidBody>
        <RigidBody position={[1, 0, 0]} ref={j2} {...segmentProps}>
          <BallCollider args={[0.1]} />
        </RigidBody>
        <RigidBody position={[1.5, 0, 0]} ref={j3} {...segmentProps}>
          <BallCollider args={[0.1]} />
        </RigidBody>
        <RigidBody position={[2, 0, 0]} ref={card} {...segmentProps} type={dragged ? 'kinematicPosition' : 'dynamic'}>
          <CuboidCollider args={[CARD_W / 2, CARD_H / 2, 0.02]} />
          <group
            onPointerOver={() => hover(true)}
            onPointerOut={() => hover(false)}
            onPointerUp={(e) => {
              (e.target as Element).releasePointerCapture(e.pointerId);
              drag(false);
            }}
            onPointerDown={(e) => {
              (e.target as Element).setPointerCapture(e.pointerId);
              drag(new THREE.Vector3().copy(e.point).sub(vec.copy(card.current!.translation())));
            }}
          >
            <RoundedBox args={[CARD_W, CARD_H, 0.03]} radius={0.08} smoothness={4}>
              <meshPhysicalMaterial color={BG} roughness={0.35} metalness={0.2} clearcoat={1} clearcoatRoughness={0.15} />
            </RoundedBox>
            <mesh position={[0, 0, 0.0155]}>
              <planeGeometry args={[CARD_W, CARD_H]} />
              <meshBasicMaterial map={textures.front} transparent toneMapped={false} />
            </mesh>
            <mesh position={[0, 0, -0.0155]} rotation={[0, Math.PI, 0]}>
              <planeGeometry args={[CARD_W, CARD_H]} />
              <meshBasicMaterial map={textures.back} transparent toneMapped={false} />
            </mesh>
            {/* metal clip — the band ends inside it */}
            <mesh position={[0, CARD_H / 2 + 0.07, 0]}>
              <boxGeometry args={[0.34, 0.16, 0.07]} />
              <meshStandardMaterial color="#9aa6b8" metalness={0.95} roughness={0.2} />
            </mesh>
          </group>
        </RigidBody>
      </group>
      {/* Not culled: the band's bounding sphere is NaN until the first step sets its points. */}
      <mesh ref={band} frustumCulled={false}>
        <meshLineGeometry />
        <meshLineMaterial
          color="white"
          resolution={[size.width, size.height]}
          useMap={1}
          map={bandTexture}
          repeat={[-4, 1]}
          lineWidth={0.9}
          toneMapped={false}
        />
      </mesh>
    </>
  );
}

export default function Lanyard({ info, onReady }: { info: CardInfo; onReady?: () => void }) {
  return (
    <Canvas
      camera={{ position: [0, 0, 11], fov: 25 }}
      dpr={[1, 2]}
      gl={{ alpha: true, antialias: true }}
      onCreated={({ gl }) => {
        gl.setClearColor(0x000000, 0);
        onReady?.();
      }}
      style={{ touchAction: 'pan-y' }}
    >
      <ambientLight intensity={Math.PI} />
      {/* No interpolation: meshes are drawn from the exact stepped state the band is built from. */}
      <Physics gravity={[0, -40, 0]} timeStep={1 / 60}>
        <Band info={info} />
      </Physics>
      <Environment resolution={256}>
        <Lightformer intensity={2} color="white" position={[0, -1, 5]} rotation={[0, 0, Math.PI / 3]} scale={[100, 0.1, 1]} />
        <Lightformer intensity={3} color="#22d3ee" position={[-1, -1, 1]} rotation={[0, 0, Math.PI / 3]} scale={[100, 0.1, 1]} />
        <Lightformer intensity={3} color="#a78bfa" position={[1, 1, 1]} rotation={[0, 0, Math.PI / 3]} scale={[100, 0.1, 1]} />
        <Lightformer intensity={10} color="white" position={[-10, 0, 14]} rotation={[0, Math.PI / 2, Math.PI / 3]} scale={[100, 10, 1]} />
      </Environment>
    </Canvas>
  );
}
