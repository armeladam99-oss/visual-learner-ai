"use client";

import { Canvas } from "@react-three/fiber";
import { OrbitControls, Environment, Grid, Text, Html } from "@react-three/drei";
import { Suspense, useMemo, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Slider } from "@/components/ui/slider";

interface MathGeometry3DProps {
  variant?: "parabola" | "sphere" | "cone" | "revolution";
}

function Parabola3D({ a, b, c }: { a: number; b: number; c: number }) {
  const points = useMemo(() => {
    const pts: [number, number, number][] = [];
    for (let x = -3; x <= 3; x += 0.05) {
      const y = a * x * x + b * x + c;
      pts.push([x, y, 0]);
    }
    return pts;
  }, [a, b, c]);

  const surfacePoints = useMemo(() => {
    const pts: [number, number, number][] = [];
    for (let x = -3; x <= 3; x += 0.1) {
      for (let z = -3; z <= 3; z += 0.1) {
        const y = a * (x * x + z * z) + b * x + c;
        if (y > -5 && y < 5) pts.push([x, y, z]);
      }
    }
    return pts;
  }, [a, b, c]);

  return (
    <group>
      {/* Surface of revolution */}
      {surfacePoints.map((p, i) => (
        <mesh key={i} position={p}>
          <sphereGeometry args={[0.02, 8, 8]} />
          <meshStandardMaterial color="#4f46e5" transparent opacity={0.3} />
        </mesh>
      ))}

      {/* Main curve */}
      {points.map((p, i) => (
        <mesh key={`curve-${i}`} position={p}>
          <sphereGeometry args={[0.03, 8, 8]} />
          <meshStandardMaterial color="#4f46e5" />
        </mesh>
      ))}

      {/* Axes */}
      <mesh position={[0, 0, 0]}>
        <cylinderGeometry args={[0.01, 0.01, 8, 8]} />
        <meshStandardMaterial color="#94a3b8" />
      </mesh>
      <mesh position={[0, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.01, 0.01, 8, 8]} />
        <meshStandardMaterial color="#94a3b8" />
      </mesh>
    </group>
  );
}

function Sphere3D({ radius }: { radius: number }) {
  return (
    <group>
      <mesh>
        <sphereGeometry args={[radius, 64, 64]} />
        <meshStandardMaterial color="#4f46e5" wireframe={false} transparent opacity={0.6} />
      </mesh>
      <mesh>
        <sphereGeometry args={[radius, 16, 16]} />
        <meshStandardMaterial color="#4f46e5" wireframe />
      </mesh>
      {/* Equator */}
      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[radius, 0.01, 8, 64]} />
        <meshStandardMaterial color="#d97706" />
      </mesh>
    </group>
  );
}

function Cone3D({ height, radius }: { height: number; radius: number }) {
  return (
    <group>
      <mesh position={[0, height / 2, 0]}>
        <coneGeometry args={[radius, height, 64]} />
        <meshStandardMaterial color="#4f46e5" transparent opacity={0.6} />
      </mesh>
      <mesh position={[0, height / 2, 0]}>
        <coneGeometry args={[radius, height, 16]} />
        <meshStandardMaterial color="#4f46e5" wireframe />
      </mesh>
      {/* Base circle */}
      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[radius, 0.01, 8, 64]} />
        <meshStandardMaterial color="#d97706" />
      </mesh>
    </group>
  );
}

function RevolutionSolid({ profileA, profileB }: { profileA: number; profileB: number }) {
  const points = useMemo(() => {
    const pts: [number, number, number][] = [];
    // Surface of revolution of y = profileA * x^2 + profileB
    for (let t = 0; t <= Math.PI * 2; t += 0.05) {
      for (let x = 0; x <= 2; x += 0.05) {
        const y = profileA * x * x + profileB;
        if (y > -3 && y < 3) {
          pts.push([x * Math.cos(t), y, x * Math.sin(t)]);
        }
      }
    }
    return pts;
  }, [profileA, profileB]);

  return (
    <group>
      {points.map((p, i) => (
        <mesh key={i} position={p}>
          <sphereGeometry args={[0.015, 6, 6]} />
          <meshStandardMaterial color="#4f46e5" transparent opacity={0.4} />
        </mesh>
      ))}
    </group>
  );
}

export function MathGeometry3D({ variant = "parabola" }: MathGeometry3DProps) {
  const [a, setA] = useState(1);
  const [b, setB] = useState(0);
  const [c, setC] = useState(0);
  const [radius, setRadius] = useState(1.5);
  const [height, setHeight] = useState(2);

  const currentVariant = variant;

  return (
    <Card className="border-border/50 bg-card shadow-sm overflow-hidden">
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-semibold flex items-center gap-2">
          <span className="text-lg">🔮</span>
          Géométrie 3D — {currentVariant === "parabola" ? "Parabole de révolution" : currentVariant === "sphere" ? "Sphère" : currentVariant === "cone" ? "Cône" : "Solide de révolution"}
          <Badge variant="secondary" className="text-[10px] ml-auto">3D</Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="w-full h-72 rounded-xl bg-gradient-to-b from-slate-900 to-slate-800 overflow-hidden">
          <Canvas camera={{ position: [3, 2, 3], fov: 50 }}>
            <Suspense fallback={<Html center><span className="text-white text-xs">Chargement...</span></Html>}>
              <ambientLight intensity={0.6} />
              <directionalLight position={[5, 5, 5]} intensity={1} />
              <pointLight position={[-5, -5, -5]} intensity={0.3} />
              <Grid infiniteGrid fadeDistance={10} fadeStrength={1} cellSize={0.5} cellThickness={0.5} sectionSize={1} sectionThickness={1} />
              {currentVariant === "parabola" && <Parabola3D a={a} b={b} c={c} />}
              {currentVariant === "sphere" && <Sphere3D radius={radius} />}
              {currentVariant === "cone" && <Cone3D height={height} radius={radius} />}
              {currentVariant === "revolution" && <RevolutionSolid profileA={a} profileB={c} />}
              <OrbitControls enableZoom={true} enablePan={false} autoRotate autoRotateSpeed={1.5} />
              <Environment preset="studio" />
            </Suspense>
          </Canvas>
        </div>

        {/* Controls */}
        {currentVariant === "parabola" && (
          <div className="grid grid-cols-3 gap-3">
            <div className="space-y-1">
              <div className="flex items-center justify-between">
                <label className="text-xs font-medium">a</label>
                <span className="text-xs font-mono font-semibold text-primary">{a}</span>
              </div>
              <Slider min={-3} max={3} step={0.1} value={[a]} onValueChange={([v]) => setA(v)} />
            </div>
            <div className="space-y-1">
              <div className="flex items-center justify-between">
                <label className="text-xs font-medium">b</label>
                <span className="text-xs font-mono font-semibold text-emerald-600">{b}</span>
              </div>
              <Slider min={-5} max={5} step={0.1} value={[b]} onValueChange={([v]) => setB(v)} />
            </div>
            <div className="space-y-1">
              <div className="flex items-center justify-between">
                <label className="text-xs font-medium">c</label>
                <span className="text-xs font-mono font-semibold text-amber-600">{c}</span>
              </div>
              <Slider min={-3} max={3} step={0.1} value={[c]} onValueChange={([v]) => setC(v)} />
            </div>
          </div>
        )}

        {currentVariant === "sphere" && (
          <div className="space-y-1">
            <div className="flex items-center justify-between">
              <label className="text-xs font-medium">Rayon R</label>
              <span className="text-xs font-mono font-semibold text-primary">{radius}</span>
            </div>
            <Slider min={0.5} max={2.5} step={0.1} value={[radius]} onValueChange={([v]) => setRadius(v)} />
            <p className="text-[10px] text-muted-foreground">V = (4/3)πR³ = {((4 / 3) * Math.PI * radius ** 3).toFixed(2)}</p>
            <p className="text-[10px] text-muted-foreground">A = 4πR² = {(4 * Math.PI * radius ** 2).toFixed(2)}</p>
          </div>
        )}

        {currentVariant === "cone" && (
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <div className="flex items-center justify-between">
                <label className="text-xs font-medium">Hauteur h</label>
                <span className="text-xs font-mono font-semibold text-primary">{height}</span>
              </div>
              <Slider min={1} max={4} step={0.1} value={[height]} onValueChange={([v]) => setHeight(v)} />
            </div>
            <div className="space-y-1">
              <div className="flex items-center justify-between">
                <label className="text-xs font-medium">Rayon R</label>
                <span className="text-xs font-mono font-semibold text-amber-600">{radius}</span>
              </div>
              <Slider min={0.5} max={2.5} step={0.1} value={[radius]} onValueChange={([v]) => setRadius(v)} />
            </div>
            <p className="text-[10px] text-muted-foreground col-span-2">V = (1/3)πR²h = {((1 / 3) * Math.PI * radius ** 2 * height).toFixed(2)}</p>
          </div>
        )}

        {currentVariant === "revolution" && (
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <div className="flex items-center justify-between">
                <label className="text-xs font-medium">a (courbure)</label>
                <span className="text-xs font-mono font-semibold text-primary">{a}</span>
              </div>
              <Slider min={-2} max={2} step={0.1} value={[a]} onValueChange={([v]) => setA(v)} />
            </div>
            <div className="space-y-1">
              <div className="flex items-center justify-between">
                <label className="text-xs font-medium">c (offset)</label>
                <span className="text-xs font-mono font-semibold text-amber-600">{c}</span>
              </div>
              <Slider min={-2} max={2} step={0.1} value={[c]} onValueChange={([v]) => setC(v)} />
            </div>
          </div>
        )}

        <p className="text-[10px] text-muted-foreground text-center">🖱️ Glisse pour tourner • Molette pour zoomer</p>
      </CardContent>
    </Card>
  );
}
