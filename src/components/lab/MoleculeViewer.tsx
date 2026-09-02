"use client";

import React, { useRef, useMemo, useState } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, Text } from "@react-three/drei";
import * as THREE from "three";
import type { MoleculeData, Atom3D, Bond3D } from "@/lib/lab/molecule-library";
import { Button } from "@/components/ui/button";
import { RotateCcw, Eye, EyeOff, Atom, Layers } from "lucide-react";

// ═══════════════════════════════════════════════════════════════
// 🔵 ATOM SPHERE
// ═══════════════════════════════════════════════════════════════

function AtomSphere({
  atom,
  showLabels,
  mode,
}: {
  atom: Atom3D;
  showLabels: boolean;
  mode: "ball" | "stick" | "ball-stick";
}) {
  const radius = mode === "stick" ? 0.08 : mode === "ball" ? atom.radius * 0.4 : atom.radius * 0.25;
  const position: [number, number, number] = [
    atom.position[0],
    atom.position[2] || 0,
    atom.position[1],
  ];

  return (
    <group position={position}>
      <mesh>
        <sphereGeometry args={[radius, 32, 32]} />
        <meshStandardMaterial
          color={atom.color}
          roughness={0.3}
          metalness={0.1}
          transparent={atom.color === "#FFFFFF"}
          opacity={atom.color === "#FFFFFF" ? 0.85 : 1}
        />
      </mesh>
      {showLabels && (
        <Text
          position={[0, radius + 0.15, 0]}
          fontSize={0.18}
          color="white"
          anchorX="center"
          anchorY="bottom"
          font="/fonts/inter.woff"
        >
          {atom.symbol}
        </Text>
      )}
    </group>
  );
}

// ═══════════════════════════════════════════════════════════════
// 📏 BOND CYLINDER
// ═══════════════════════════════════════════════════════════════

function BondCylinder({
  from,
  to,
  order,
  mode,
}: {
  from: [number, number, number];
  to: [number, number, number];
  order: number;
  mode: "ball" | "stick" | "ball-stick";
}) {
  if (mode === "ball") return null;

  const start: [number, number, number] = [from[0], from[2] || 0, from[1]];
  const end: [number, number, number] = [to[0], to[2] || 0, to[1]];

  const mid: [number, number, number] = [
    (start[0] + end[0]) / 2,
    (start[1] + end[1]) / 2,
    (start[2] + end[2]) / 2,
  ];

  const dx = end[0] - start[0];
  const dy = end[1] - start[1];
  const dz = end[2] - start[2];
  const length = Math.sqrt(dx * dx + dy * dy + dz * dz);

  const bondRadius = mode === "stick" ? 0.06 : 0.04;
  const offset = order > 1 ? 0.06 : 0;

  const lines: React.ReactNode[] = [];

  for (let i = 0; i < order; i++) {
    const shift = order > 1 ? (i - (order - 1) / 2) * offset : 0;

    // Compute orientation quaternion
    const dir = [dx / length, dy / length, dz / length];
    const up: [number, number, number] = [0, 1, 0];
    const axis: [number, number, number] = [
      up[1] * dir[2] - up[2] * dir[1],
      up[2] * dir[0] - up[0] * dir[2],
      up[0] * dir[1] - up[1] * dir[0],
    ];
    const axisLen = Math.sqrt(axis[0] * axis[0] + axis[1] * axis[1] + axis[2] * axis[2]);
    const angle = Math.acos(Math.min(1, Math.max(-1, dir[1])));

    lines.push(
      <mesh
        key={i}
        position={[mid[0] + shift, mid[1], mid[2]]}
        rotation={[0, 0, axisLen > 0.001 ? angle * (axis[2] > 0 ? 1 : -1) : 0]}
      >
        <cylinderGeometry args={[bondRadius, bondRadius, length, 8]} />
        <meshStandardMaterial color="#888888" roughness={0.5} />
      </mesh>
    );
  }

  return <>{lines}</>;
}

// ═══════════════════════════════════════════════════════════════
// 🌐 MOLECULE SCENE
// ═══════════════════════════════════════════════════════════════

function MoleculeScene({
  molecule,
  showLabels,
  mode,
  autoRotate,
}: {
  molecule: MoleculeData;
  showLabels: boolean;
  mode: "ball" | "stick" | "ball-stick";
  autoRotate: boolean;
}) {
  const groupRef = useRef<THREE.Group>(null);

  useFrame((_, delta) => {
    if (autoRotate && groupRef.current) {
      groupRef.current.rotation.y += delta * 0.3;
    }
  });

  const center = useMemo(() => {
    if (molecule.atoms.length === 0) return [0, 0, 0] as [number, number, number];
    const sum = molecule.atoms.reduce(
      (acc, a) => [acc[0] + a.position[0], acc[1] + a.position[1], acc[2] + a.position[2]],
      [0, 0, 0]
    );
    const n = molecule.atoms.length;
    return [sum[0] / n, sum[1] / n, sum[2] / n] as [number, number, number];
  }, [molecule]);

  const scale = useMemo(() => {
    if (molecule.atoms.length <= 1) return 1;
    let maxDist = 0;
    for (const a of molecule.atoms) {
      const d = Math.sqrt(
        (a.position[0] - center[0]) ** 2 +
        (a.position[1] - center[1]) ** 2 +
        (a.position[2] - center[2]) ** 2
      );
      if (d > maxDist) maxDist = d;
    }
    return maxDist > 3 ? 3 / maxDist : 1;
  }, [molecule, center]);

  return (
    <group ref={groupRef} scale={scale} position={[-center[0] * scale, -center[2] * scale, -center[1] * scale]}>
      {molecule.bonds.map((bond, i) => (
        <BondCylinder
          key={i}
          from={molecule.atoms[bond.from]?.position || [0, 0, 0]}
          to={molecule.atoms[bond.to]?.position || [0, 0, 0]}
          order={bond.order}
          mode={mode}
        />
      ))}
      {molecule.atoms.map((atom, i) => (
        <AtomSphere key={i} atom={atom} showLabels={showLabels} mode={mode} />
      ))}
    </group>
  );
}

// ═══════════════════════════════════════════════════════════════
// 🧪 MOLECULE VIEWER — Main component
// ═══════════════════════════════════════════════════════════════

export function MoleculeViewer({
  molecule,
  title,
}: {
  molecule: MoleculeData;
  title?: string;
}) {
  const [showLabels, setShowLabels] = useState(true);
  const [mode, setMode] = useState<"ball" | "stick" | "ball-stick">("ball-stick");
  const [autoRotate, setAutoRotate] = useState(true);

  return (
    <div className="space-y-3">
      {/* Title & formula */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-sm font-bold text-white">{title || molecule.name}</h3>
          <p className="text-xs text-slate-400">{molecule.formula} — {molecule.category}</p>
        </div>
        <div className="flex items-center gap-1">
          {/* Mode buttons */}
          {(["ball", "stick", "ball-stick"] as const).map((m) => (
            <Button key={m} variant="ghost" size="sm"
              className={`text-[10px] px-2 py-1 h-6 ${mode === m ? "bg-cyan-500/20 text-cyan-400" : "text-slate-500"}`}
              onClick={() => setMode(m)}>
              {m === "ball" ? "🔴" : m === "stick" ? "📏" : "⚛️"}
            </Button>
          ))}
          <Button variant="ghost" size="sm"
            className={`text-[10px] px-2 py-1 h-6 ${showLabels ? "bg-slate-700 text-white" : "text-slate-500"}`}
            onClick={() => setShowLabels(!showLabels)}>
            {showLabels ? <Eye className="size-3" /> : <EyeOff className="size-3" />}
          </Button>
          <Button variant="ghost" size="sm"
            className={`text-[10px] px-2 py-1 h-6 ${autoRotate ? "bg-slate-700 text-white" : "text-slate-500"}`}
            onClick={() => setAutoRotate(!autoRotate)}>
            <RotateCcw className="size-3" />
          </Button>
        </div>
      </div>

      {/* 3D Canvas */}
      <div className="rounded-xl border border-slate-700/50 bg-slate-900/80 overflow-hidden"
        style={{ height: 350 }}>
        <Canvas camera={{ position: [3, 2, 3], fov: 50 }}>
          <ambientLight intensity={0.6} />
          <directionalLight position={[5, 5, 5]} intensity={0.8} />
          <directionalLight position={[-3, -3, 3]} intensity={0.3} />
          <MoleculeScene
            molecule={molecule}
            showLabels={showLabels}
            mode={mode}
            autoRotate={autoRotate}
          />
          <OrbitControls
            enableDamping
            dampingFactor={0.1}
            minDistance={1}
            maxDistance={20}
          />
          <gridHelper args={[10, 10, "#1e293b", "#1e293b"]} position={[0, -2, 0]} />
        </Canvas>
      </div>

      {/* Info */}
      {molecule.description && (
        <div className="text-xs text-slate-400 bg-slate-800/50 rounded-lg px-3 py-2 border border-slate-700/50">
          {molecule.description}
        </div>
      )}

      {/* Stats */}
      <div className="flex gap-3 text-[10px] text-slate-500">
        <span><Atom className="inline size-3 mr-1" />{molecule.atoms.length} atomes</span>
        <span><Layers className="inline size-3 mr-1" />{molecule.bonds.length} liaisons</span>
      </div>
    </div>
  );
}
