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

const INK = '#1d1b17';
const PAPER = '#f6f2ea';
const SAGE = '#a6c78f';
const SAGE_DARK = '#4a7535';

function roundRect(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, r: number) {
  ctx.beginPath();
  ctx.roundRect(x, y, w, h, r);
}

function drawFront(ctx: CanvasRenderingContext2D, info: CardInfo, photo: HTMLImageElement | null) {
  const W = TEX_W, H = TEX_H;
  ctx.clearRect(0, 0, W, H);
  roundRect(ctx, 0, 0, W, H, 36);
  ctx.fillStyle = PAPER;
  ctx.fill();
  ctx.save();
  ctx.clip();

  // header band
  ctx.fillStyle = INK;
  ctx.fillRect(0, 0, W, 150);
  ctx.fillStyle = SAGE;
  ctx.beginPath();
  ctx.arc(80, 75, 34, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = INK;
  ctx.font = '600 30px Georgia, serif';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText('RD', 80, 77);
  ctx.textAlign = 'left';
  ctx.fillStyle = PAPER;
  ctx.font = '600 26px system-ui, sans-serif';
  ctx.fillText('PORTFOLIO PASS', 135, 62);
  ctx.fillStyle = 'rgba(246,242,234,0.6)';
  ctx.font = '400 20px ui-monospace, monospace';
  ctx.fillText(`${info.handle} · ${new Date().getFullYear()}`, 135, 94);

  // lanyard slot
  roundRect(ctx, W / 2 - 50, 22, 100, 18, 9);
  ctx.fillStyle = 'rgba(246,242,234,0.25)';
  ctx.fill();

  // photo (center-crop to 4:5)
  const px = 60, py = 190, pw = W - 120, ph = Math.round(pw * 0.82);
  roundRect(ctx, px, py, pw, ph, 24);
  ctx.save();
  ctx.clip();
  ctx.fillStyle = '#d9d2c4';
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

  // text
  let y = py + ph + 70;
  ctx.fillStyle = INK;
  ctx.font = '500 48px Georgia, serif';
  ctx.fillText(info.name, 60, y);
  y += 44;
  ctx.fillStyle = SAGE_DARK;
  ctx.font = 'italic 500 28px Georgia, serif';
  ctx.fillText(info.role, 60, y);
  y += 40;
  ctx.fillStyle = '#6a6357';
  ctx.font = '400 22px system-ui, sans-serif';
  ctx.fillText(info.org, 60, y);

  // footer: barcode + location
  const fy = H - 70;
  ctx.fillStyle = INK;
  let bx = 60;
  for (let i = 0; i < 38; i++) {
    const w = (i * 7919) % 3 === 0 ? 5 : 2;
    ctx.fillRect(bx, fy - 26, w, 44);
    bx += w + 4;
  }
  ctx.textAlign = 'right';
  ctx.fillStyle = '#6a6357';
  ctx.font = '400 20px ui-monospace, monospace';
  ctx.fillText(info.location.toUpperCase(), W - 60, fy);
  ctx.restore();
}

function drawBack(ctx: CanvasRenderingContext2D, info: CardInfo) {
  const W = TEX_W, H = TEX_H;
  ctx.clearRect(0, 0, W, H);
  roundRect(ctx, 0, 0, W, H, 36);
  ctx.fillStyle = INK;
  ctx.fill();
  ctx.save();
  ctx.clip();
  // subtle grid
  ctx.strokeStyle = 'rgba(166,199,143,0.08)';
  for (let x = 0; x < W; x += 40) { ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, H); ctx.stroke(); }
  for (let y = 0; y < H; y += 40) { ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(W, y); ctx.stroke(); }
  ctx.textAlign = 'center';
  ctx.fillStyle = SAGE;
  ctx.font = '500 120px Georgia, serif';
  ctx.fillText('RD', W / 2, H / 2 - 20);
  ctx.fillStyle = PAPER;
  ctx.font = '400 26px system-ui, sans-serif';
  ctx.fillText(info.name, W / 2, H / 2 + 50);
  ctx.fillStyle = 'rgba(246,242,234,0.5)';
  ctx.font = '400 20px ui-monospace, monospace';
  ctx.fillText('drag me around ↻', W / 2, H - 80);
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

  return useMemo(() => {
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
}

function useBandTexture() {
  return useMemo(() => {
    const c = document.createElement('canvas');
    c.width = 512;
    c.height = 64;
    const ctx = c.getContext('2d')!;
    ctx.fillStyle = SAGE;
    ctx.fillRect(0, 0, 512, 64);
    ctx.fillStyle = INK;
    ctx.font = '600 30px system-ui, sans-serif';
    ctx.textBaseline = 'middle';
    ctx.fillText('RAFIIF DZAKWAN  ✦  PORTFOLIO  ✦', 14, 34);
    const t = new THREE.CanvasTexture(c);
    t.colorSpace = THREE.SRGBColorSpace;
    t.wrapS = t.wrapT = THREE.RepeatWrapping;
    return t;
  }, []);
}

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
  const curve = useMemo(
    () => new THREE.CatmullRomCurve3([new THREE.Vector3(), new THREE.Vector3(), new THREE.Vector3(), new THREE.Vector3()]),
    [],
  );
  curve.curveType = 'chordal';

  const [dragged, drag] = useState<THREE.Vector3 | false>(false);
  const [hovered, hover] = useState(false);
  const textures = useCardTextures(info);
  const size = useThree((s) => s.size);
  const bandTexture = useBandTexture();

  const segmentProps: RigidBodyProps = { type: 'dynamic', canSleep: true, colliders: false, angularDamping: 4, linearDamping: 4 };

  useRopeJoint(fixed, j1, [[0, 0, 0], [0, 0, 0], 1]);
  useRopeJoint(j1, j2, [[0, 0, 0], [0, 0, 0], 1]);
  useRopeJoint(j2, j3, [[0, 0, 0], [0, 0, 0], 1]);
  useSphericalJoint(j3, card, [[0, 0, 0], [0, CARD_H / 2 + 0.1, 0]]);

  useEffect(() => {
    if (!hovered) return;
    document.body.style.cursor = dragged ? 'grabbing' : 'grab';
    return () => { document.body.style.cursor = ''; };
  }, [hovered, dragged]);

  useFrame((state, delta) => {
    if (dragged && card.current) {
      vec.set(state.pointer.x, state.pointer.y, 0.5).unproject(state.camera);
      dir.copy(vec).sub(state.camera.position).normalize();
      vec.add(dir.multiplyScalar(state.camera.position.length()));
      [card, j1, j2, j3, fixed].forEach((r) => r.current?.wakeUp());
      card.current.setNextKinematicTranslation({ x: vec.x - dragged.x, y: vec.y - dragged.y, z: vec.z - dragged.z });
    }
    if (!fixed.current || !j1.current || !j2.current || !j3.current || !card.current || !band.current) return;

    // Smooth the two middle joints so the band doesn't jitter.
    [j1, j2].forEach((r) => {
      const body = r.current! as RapierRigidBody & { lerped?: THREE.Vector3 };
      if (!body.lerped) body.lerped = new THREE.Vector3().copy(body.translation());
      const clamped = Math.max(0.1, Math.min(1, body.lerped.distanceTo(body.translation())));
      // Clamp the factor: above 1 the lerp overshoots and diverges on low frame rates.
      body.lerped.lerp(body.translation(), Math.min(1, delta * (10 + clamped * 40)));
    });
    curve.points[0].copy(j3.current.translation());
    curve.points[1].copy((j2.current as RapierRigidBody & { lerped: THREE.Vector3 }).lerped);
    curve.points[2].copy((j1.current as RapierRigidBody & { lerped: THREE.Vector3 }).lerped);
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
              <meshPhysicalMaterial color={PAPER} roughness={0.5} clearcoat={1} clearcoatRoughness={0.2} />
            </RoundedBox>
            <mesh position={[0, 0, 0.0155]}>
              <planeGeometry args={[CARD_W, CARD_H]} />
              <meshBasicMaterial map={textures.front} transparent toneMapped={false} />
            </mesh>
            <mesh position={[0, 0, -0.0155]} rotation={[0, Math.PI, 0]}>
              <planeGeometry args={[CARD_W, CARD_H]} />
              <meshBasicMaterial map={textures.back} transparent toneMapped={false} />
            </mesh>
            {/* metal clip */}
            <mesh position={[0, CARD_H / 2 + 0.06, 0]}>
              <boxGeometry args={[0.32, 0.14, 0.06]} />
              <meshStandardMaterial color="#b9b4aa" metalness={0.9} roughness={0.25} />
            </mesh>
          </group>
        </RigidBody>
      </group>
      {/* Not culled: the band's bounding sphere is NaN until the first frame sets its points. */}
      <mesh ref={band} frustumCulled={false}>
        <meshLineGeometry />
        <meshLineMaterial
          color="white"
          depthTest={false}
          resolution={[size.width, size.height]}
          useMap={1}
          map={bandTexture}
          repeat={[-4, 1]}
          lineWidth={0.9}
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
      <Physics gravity={[0, -40, 0]} timeStep={1 / 60} interpolate>
        <Band info={info} />
      </Physics>
      <Environment resolution={256}>
        <Lightformer intensity={2} color="white" position={[0, -1, 5]} rotation={[0, 0, Math.PI / 3]} scale={[100, 0.1, 1]} />
        <Lightformer intensity={3} color="white" position={[-1, -1, 1]} rotation={[0, 0, Math.PI / 3]} scale={[100, 0.1, 1]} />
        <Lightformer intensity={3} color="white" position={[1, 1, 1]} rotation={[0, 0, Math.PI / 3]} scale={[100, 0.1, 1]} />
        <Lightformer intensity={10} color="white" position={[-10, 0, 14]} rotation={[0, Math.PI / 2, Math.PI / 3]} scale={[100, 10, 1]} />
      </Environment>
    </Canvas>
  );
}
