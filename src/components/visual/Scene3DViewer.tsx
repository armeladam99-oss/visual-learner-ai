"use client";

import { Suspense, useMemo, useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, Text, Line, RoundedBox } from "@react-three/drei";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { type VizRequest } from "@/lib/viz-types";
import { RotateCcw, Maximize2 } from "lucide-react";
import * as THREE from "three";

// ═══════════════════════════════════════════════════════════════
// 🧊 SCÈNE 3D — Molécules, Solides, Vecteurs, Surfaces
// ═══════════════════════════════════════════════════════════════

interface Scene3DProps {
  viz: VizRequest;
}

// ─── MOLECULE DATA ───
const MOLECULES: Record<string, { atoms: { pos: [number, number, number]; color: string; scale: number }[]; bonds: [number, number][] }> = {
  H2O: {
    atoms: [
      { pos: [0, 0, 0], color: "#ef4444", scale: 0.4 },       // O
      { pos: [-0.76, 0.59, 0], color: "#f5f5f5", scale: 0.25 }, // H
      { pos: [0.76, 0.59, 0], color: "#f5f5f5", scale: 0.25 },  // H
    ],
    bonds: [[0, 1], [0, 2]],
  },
  CO2: {
    atoms: [
      { pos: [-1.16, 0, 0], color: "#ef4444", scale: 0.35 },
      { pos: [0, 0, 0], color: "#333", scale: 0.4 },
      { pos: [1.16, 0, 0], color: "#ef4444", scale: 0.35 },
    ],
    bonds: [[0, 1], [1, 2]],
  },
  CH4: {
    atoms: [
      { pos: [0, 0, 0], color: "#333", scale: 0.4 },
      { pos: [0.63, 0.63, 0.63], color: "#f5f5f5", scale: 0.25 },
      { pos: [-0.63, -0.63, 0.63], color: "#f5f5f5", scale: 0.25 },
      { pos: [-0.63, 0.63, -0.63], color: "#f5f5f5", scale: 0.25 },
      { pos: [0.63, -0.63, -0.63], color: "#f5f5f5", scale: 0.25 },
    ],
    bonds: [[0, 1], [0, 2], [0, 3], [0, 4]],
  },
  NH3: {
    atoms: [
      { pos: [0, 0.38, 0], color: "#3b82f6", scale: 0.4 },
      { pos: [0.94, -0.34, 0], color: "#f5f5f5", scale: 0.25 },
      { pos: [-0.47, -0.34, 0.81], color: "#f5f5f5", scale: 0.25 },
      { pos: [-0.47, -0.34, -0.81], color: "#f5f5f5", scale: 0.25 },
    ],
    bonds: [[0, 1], [0, 2], [0, 3]],
  },
  HCl: {
    atoms: [
      { pos: [-0.64, 0, 0], color: "#f5f5f5", scale: 0.25 },
      { pos: [0.64, 0, 0], color: "#22c55e", scale: 0.4 },
    ],
    bonds: [[0, 1]],
  },
  NaCl: {
    atoms: [
      { pos: [-0.95, 0, 0], color: "#a855f7", scale: 0.35 },
      { pos: [0.95, 0, 0], color: "#22c55e", scale: 0.4 },
    ],
    bonds: [[0, 1]],
  },
};

// ─── SOLID SHAPES ───
function SolidShape({ type, size }: { type: string; size: number }) {
  switch (type?.toLowerCase()) {
    case "cube":
      return (
        <RoundedBox args={[size, size, size]} radius={0.05} smoothness={4}>
          <meshStandardMaterial color="#6366f1" transparent opacity={0.8} />
        </RoundedBox>
      );
    case "sphère":
    case "sphere":
      return (
        <mesh>
          <sphereGeometry args={[size * 0.6, 32, 32]} />
          <meshStandardMaterial color="#10b981" transparent opacity={0.8} wireframe={false} />
        </mesh>
      );
    case "cône":
    case "cone":
      return (
        <mesh rotation={[0, 0, 0]}>
          <coneGeometry args={[size * 0.5, size * 1.2, 32]} />
          <meshStandardMaterial color="#f59e0b" transparent opacity={0.8} />
        </mesh>
      );
    case "cylindre":
    case "cylinder":
      return (
        <mesh>
          <cylinderGeometry args={[size * 0.4, size * 0.4, size, 32]} />
          <meshStandardMaterial color="#ec4899" transparent opacity={0.8} />
        </mesh>
      );
    default:
      return (
        <RoundedBox args={[size, size, size]} radius={0.05} smoothness={4}>
          <meshStandardMaterial color="#6366f1" transparent opacity={0.8} />
        </RoundedBox>
      );
  }
}

// ─── MOLECULE 3D ───
function Molecule3D({ name }: { name: string }) {
  const mol = MOLECULES[name] || MOLECULES.H2O;
  const groupRef = useRef<THREE.Group>(null);

  useFrame((_, delta) => {
    if (groupRef.current) {
      groupRef.current.rotation.y += delta * 0.3;
    }
  });

  return (
    <group ref={groupRef}>
      {mol.atoms.map((atom, i) => (
        <mesh key={i} position={atom.pos}>
          <sphereGeometry args={[atom.scale, 32, 32]} />
          <meshStandardMaterial color={atom.color} roughness={0.3} metalness={0.1} />
        </mesh>
      ))}
      {mol.bonds.map(([a, b], i) => {
        const start = new THREE.Vector3(...mol.atoms[a].pos);
        const end = new THREE.Vector3(...mol.atoms[b].pos);
        const mid = start.clone().add(end).multiplyScalar(0.5);
        const direction = end.clone().sub(start);
        const length = direction.length();

        return (
          <mesh key={i} position={[mid.x, mid.y, mid.z]}>
            <cylinderGeometry args={[0.06, 0.06, length, 8]} />
            <meshStandardMaterial color="#94a3b8" />
            <primitive
              object={(() => {
                const m = new THREE.Mesh();
                m.lookAt(direction.normalize());
                m.rotateX(Math.PI / 2);
                return m;
              })()}
              attach="none"
            />
          </mesh>
        );
      })}
    </group>
  );
}

// ─── VECTOR 3D ───
function Vector3DScene() {
  const axisLen = 2;
  return (
    <group>
      {/* Axes */}
      <Line points={[[0, 0, 0], [axisLen, 0, 0]]} color="#ef4444" lineWidth={2} />
      <Line points={[[0, 0, 0], [0, axisLen, 0]]} color="#22c55e" lineWidth={2} />
      <Line points={[[0, 0, 0], [0, 0, axisLen]]} color="#3b82f6" lineWidth={2} />

      {/* Labels */}
      <Text position={[axisLen + 0.2, 0, 0]} fontSize={0.2} color="#ef4444">x</Text>
      <Text position={[0, axisLen + 0.2, 0]} fontSize={0.2} color="#22c55e">y</Text>
      <Text position={[0, 0, axisLen + 0.2]} fontSize={0.2} color="#3b82f6">z</Text>

      {/* Vector */}
      <Line points={[[0, 0, 0], [1.2, 1.5, 0.8]]} color="#f59e0b" lineWidth={3} />
      <Text position={[0.7, 0.9, 0.5]} fontSize={0.15} color="#f59e0b">v⃗</Text>

      {/* Grid */}
      <gridHelper args={[4, 10, "#1e293b", "#1e293b"]} position={[0, -0.01, 0]} />
    </group>
  );
}

// ─── PENDULUM 3D ───
function Pendulum3D({ length = 1 }: { length?: number }) {
  const pendRef = useRef<THREE.Group>(null);
  const angleRef = useRef(0);
  const omegaRef = useRef(0);
  const g = 9.81;

  useFrame((_, delta) => {
    if (!pendRef.current) return;
    const alpha = -(g / length) * Math.sin(angleRef.current);
    omegaRef.current += alpha * delta;
    omegaRef.current *= 0.999; // slight damping
    angleRef.current += omegaRef.current * delta;
    pendRef.current.rotation.z = angleRef.current;
  });

  return (
    <group>
      {/* Pivot */}
      <mesh position={[0, 1.5, 0]}>
        <sphereGeometry args={[0.05, 16, 16]} />
        <meshStandardMaterial color="#94a3b8" />
      </mesh>

      {/* String + Bob */}
      <group ref={pendRef} position={[0, 1.5, 0]}>
        <Line points={[[0, 0, 0], [0, -length, 0]]} color="#94a3b8" lineWidth={1} />
        <mesh position={[0, -length, 0]}>
          <sphereGeometry args={[0.15, 32, 32]} />
          <meshStandardMaterial color="#ef4444" roughness={0.3} />
        </mesh>
      </group>

      {/* Grid */}
      <gridHelper args={[4, 10, "#1e293b", "#1e293b"]} position={[0, -0.5, 0]} />
    </group>
  );
}

// ─── SURFACE 3D ───
function Surface3D({ expr, xMin = -3, xMax = 3 }: { expr: string; xMin?: number; xMax?: number }) {
  const geometry = useMemo(() => {
    const size = 40;
    const geo = new THREE.BufferGeometry();
    const vertices: number[] = [];
    const colors: number[] = [];
    const step = (xMax - xMin) / size;

    for (let i = 0; i < size; i++) {
      for (let j = 0; j < size; j++) {
        const x = xMin + i * step;
        const y = xMin + j * step;

        let z = 0;
        try {
          const processed = expr
            .replace(/x/g, `(${x})`)
            .replace(/y/g, `(${y})`)
            .replace(/pi/g, `${Math.PI}`)
            .replace(/\^/g, "**");
          z = new Function(`return ${processed}`)() as number;
          if (!isFinite(z) || Math.abs(z) > 10) z = 0;
        } catch { z = 0; }

        // Triangle 1
        vertices.push(x, z, y);
        vertices.push(x + step, 0, y);
        vertices.push(x, 0, y + step);
        // Triangle 2
        vertices.push(x + step, 0, y);
        vertices.push(x + step, 0, y + step);
        vertices.push(x, 0, y + step);

        // Color based on height
        const normalizedZ = Math.max(0, Math.min(1, (z + 3) / 6));
        const r = normalizedZ;
        const g = 0.4;
        const b = 1 - normalizedZ;
        for (let k = 0; k < 6; k++) {
          colors.push(r, g, b);
        }
      }
    }

    geo.setAttribute("position", new THREE.Float32BufferAttribute(vertices, 3));
    geo.setAttribute("color", new THREE.Float32BufferAttribute(colors, 3));
    geo.computeVertexNormals();
    return geo;
  }, [expr, xMin, xMax]);

  return (
    <mesh geometry={geometry}>
      <meshStandardMaterial vertexColors side={THREE.DoubleSide} />
    </mesh>
  );
}

// ═══════════════════════════════════════════════════════════════
// 🌐 SCÈNE 3D COMPLÈTE
// ═══════════════════════════════════════════════════════════════

function SceneContent({ viz }: { viz: VizRequest }) {
  switch (viz.type) {
    case "molecule-3d":
      return <Molecule3D name={(viz.params.molecule as string) || "H2O"} />;
    case "vector-3d":
      return <Vector3DScene />;
    case "pendulum-3d":
      return <Pendulum3D length={(viz.params.length as number) || 1} />;
    case "solid-3d":
      return <SolidShape type={(viz.params.solid as string) || "cube"} size={(viz.params.size as number) || 1} />;
    case "surface-3d":
    default:
      return <Surface3D expr={(viz.params.expr as string) || "sin(sqrt(x^2 + y^2))"} />;
  }
}

// ═══════════════════════════════════════════════════════════════
// 🧊 COMPOSANT PRINCIPAL
// ═══════════════════════════════════════════════════════════════

export function Scene3DViewer({ viz }: Scene3DProps) {
  return (
    <Card className="border-violet-500/20 bg-slate-900/80 overflow-hidden">
      <CardHeader className="pb-2 border-b border-violet-500/10">
        <CardTitle className="text-sm font-semibold flex items-center gap-2 text-violet-400">
          🧊 {viz.title}
          <Badge variant="secondary" className="text-[10px] bg-violet-500/10 text-violet-400">
            3D
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="p-4 space-y-3">
        {/* 3D Canvas */}
        <div className="w-full h-[350px] rounded-xl overflow-hidden bg-slate-950 border border-slate-800">
          <Canvas
            camera={{ position: [3, 2, 3], fov: 50 }}
            gl={{ antialias: true }}
          >
            <Suspense fallback={null}>
              <ambientLight intensity={0.5} />
              <pointLight position={[5, 5, 5]} intensity={1} />
              <pointLight position={[-3, 3, -3]} intensity={0.3} />
              <SceneContent viz={viz} />
              <OrbitControls
                enablePan
                enableZoom
                enableRotate
                autoRotate={viz.type === "molecule-3d"}
                autoRotateSpeed={1}
              />
              <gridHelper args={[6, 12, "#1e293b", "#0f172a"]} position={[0, -0.01, 0]} />
            </Suspense>
          </Canvas>
        </div>

        {/* Instructions */}
        <div className="flex items-center justify-center gap-4 text-[10px] text-slate-500">
          <span>🖱️ Tourner</span>
          <span>🔍 Molette = Zoom</span>
          <span>⇧ Shift + souris = Déplacer</span>
        </div>

        {/* Equations */}
        {viz.equations.length > 0 && (
          <div className="rounded-lg bg-violet-500/5 border border-violet-500/20 p-2 text-[10px] text-violet-300 space-y-0.5">
            {viz.equations.map((eq, i) => (
              <p key={i}>{eq}</p>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
