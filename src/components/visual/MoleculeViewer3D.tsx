"use client";

import { Canvas } from "@react-three/fiber";
import { OrbitControls, Environment, Float, Text, Html } from "@react-three/drei";
import { Suspense, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface Atom3D {
  position: [number, number, number];
  color: string;
  radius: number;
  label: string;
}

interface Bond3D {
  from: [number, number, number];
  to: [number, number, number];
}

interface Molecule3DData {
  name: string;
  formula: string;
  atoms: Atom3D[];
  bonds: Bond3D[];
  description: string;
  properties: string[];
}

const molecules3D: Record<string, Molecule3DData> = {
  water: {
    name: "Eau",
    formula: "H₂O",
    atoms: [
      { position: [0, 0.4, 0], color: "#dc2626", radius: 0.35, label: "O" },
      { position: [-0.6, -0.3, 0], color: "#3b82f6", radius: 0.25, label: "H" },
      { position: [0.6, -0.3, 0], color: "#3b82f6", radius: 0.25, label: "H" },
    ],
    bonds: [
      { from: [0, 0.4, 0], to: [-0.6, -0.3, 0] },
      { from: [0, 0.4, 0], to: [0.6, -0.3, 0] },
    ],
    description: "Molécule polaire avec un angle de 104,5°. Liaison hydrogène.",
    properties: ["Polaire", "Angle 104,5°", "Liaison hydrogène", "Solvent universel"],
  },
  co2: {
    name: "Dioxyde de carbone",
    formula: "CO₂",
    atoms: [
      { position: [0, 0, 0], color: "#6b7280", radius: 0.35, label: "C" },
      { position: [-1, 0, 0], color: "#dc2626", radius: 0.3, label: "O" },
      { position: [1, 0, 0], color: "#dc2626", radius: 0.3, label: "O" },
    ],
    bonds: [
      { from: [0, 0, 0], to: [-1, 0, 0] },
      { from: [0, 0, 0], to: [1, 0, 0] },
    ],
    description: "Molécule linéaire et non polaire. Double liaison C=O.",
    properties: ["Linéaire", "Non polaire", "Gaz à effet de serre", "Photosynthèse"],
  },
  ch4: {
    name: "Méthane",
    formula: "CH₄",
    atoms: [
      { position: [0, 0, 0], color: "#6b7280", radius: 0.35, label: "C" },
      { position: [0.6, 0.6, 0.6], color: "#3b82f6", radius: 0.22, label: "H" },
      { position: [-0.6, -0.6, 0.6], color: "#3b82f6", radius: 0.22, label: "H" },
      { position: [0.6, -0.6, -0.6], color: "#3b82f6", radius: 0.22, label: "H" },
      { position: [-0.6, 0.6, -0.6], color: "#3b82f6", radius: 0.22, label: "H" },
    ],
    bonds: [
      { from: [0, 0, 0], to: [0.6, 0.6, 0.6] },
      { from: [0, 0, 0], to: [-0.6, -0.6, 0.6] },
      { from: [0, 0, 0], to: [0.6, -0.6, -0.6] },
      { from: [0, 0, 0], to: [-0.6, 0.6, -0.6] },
    ],
    description: "Géométrie tétrédrique. Angle 109,5°.",
    properties: ["Tétrédrique", "Angle 109,5°", "Gaz naturel", "Gaz à effet de serre"],
  },
  nh3: {
    name: "Ammoniac",
    formula: "NH₃",
    atoms: [
      { position: [0, 0.3, 0], color: "#3b82f6", radius: 0.32, label: "N" },
      { position: [-0.6, -0.3, 0.3], color: "#3b82f6", radius: 0.22, label: "H" },
      { position: [0.6, -0.3, 0.3], color: "#3b82f6", radius: 0.22, label: "H" },
      { position: [0, -0.3, -0.5], color: "#3b82f6", radius: 0.22, label: "H" },
    ],
    bonds: [
      { from: [0, 0.3, 0], to: [-0.6, -0.3, 0.3] },
      { from: [0, 0.3, 0], to: [0.6, -0.3, 0.3] },
      { from: [0, 0.3, 0], to: [0, -0.3, -0.5] },
    ],
    description: "Géométrie pyramidale. Base faible. Gaz irritant.",
    properties: ["Pyramidale", "Angle 107,8°", "Base faible", "Engrais"],
  },
  hcl: {
    name: "Acide chlorhydrique",
    formula: "HCl",
    atoms: [
      { position: [-0.5, 0, 0], color: "#3b82f6", radius: 0.25, label: "H" },
      { position: [0.5, 0, 0], color: "#22c55e", radius: 0.35, label: "Cl" },
    ],
    bonds: [{ from: [-0.5, 0, 0], to: [0.5, 0, 0] }],
    description: "Acide fort. Dissociation totale en solution.",
    properties: ["Acide fort", "Linéaire", "Dissociation totale", "pH = 1"],
  },
  nacl: {
    name: "Chlorure de sodium",
    formula: "NaCl",
    atoms: [
      { position: [-0.6, 0, 0], color: "#f59e0b", radius: 0.32, label: "Na⁺" },
      { position: [0.6, 0, 0], color: "#22c55e", radius: 0.35, label: "Cl⁻" },
    ],
    bonds: [{ from: [-0.6, 0, 0], to: [0.6, 0, 0] }],
    description: "Liaison ionique. Sel de cuisine. Cristal cubique.",
    properties: ["Ionique", "Conducteur fondu", "Cristal cubique", "Sel de cuisine"],
  },
};

function Atom({ position, color, radius, label }: Atom3D) {
  return (
    <group position={position}>
      <mesh>
        <sphereGeometry args={[radius, 32, 32]} />
        <meshStandardMaterial color={color} roughness={0.3} metalness={0.1} transparent opacity={0.9} />
      </mesh>
      <Html center distanceFactor={3}>
        <span className="text-[10px] font-bold text-white drop-shadow-lg pointer-events-none select-none">
          {label}
        </span>
      </Html>
    </group>
  );
}

function Bond({ from, to }: Bond3D) {
  const midX = (from[0] + to[0]) / 2;
  const midY = (from[1] + to[1]) / 2;
  const midZ = (from[2] + to[2]) / 2;

  const dx = to[0] - from[0];
  const dy = to[1] - from[1];
  const dz = to[2] - from[2];
  const length = Math.sqrt(dx * dx + dy * dy + dz * dz);

  const direction = [dx / length, dy / length, dz / length];
  const angle = Math.acos(direction[1]);

  return (
    <mesh position={[midX, midY, midZ]} rotation={[0, 0, -Math.atan2(dx, dy)]}>
      <cylinderGeometry args={[0.04, 0.04, length, 8]} />
      <meshStandardMaterial color="#94a3b8" roughness={0.5} metalness={0.2} />
    </mesh>
  );
}

function MoleculeScene({ data }: { data: Molecule3DData }) {
  return (
    <Float speed={1.5} rotationIntensity={0.3} floatIntensity={0.5}>
      <group>
        {data.atoms.map((atom, i) => (
          <Atom key={`atom-${i}`} {...atom} />
        ))}
        {data.bonds.map((bond, i) => (
          <Bond key={`bond-${i}`} {...bond} />
        ))}
      </group>
    </Float>
  );
}

function LoadingFallback() {
  return (
    <Html center>
      <div className="flex items-center gap-2 text-muted-foreground text-sm">
        <div className="w-4 h-4 border-2 border-primary border-t-transparent rounded-full animate-spin" />
        Chargement du modèle 3D...
      </div>
    </Html>
  );
}

export function MoleculeViewer3D({ molecule = "water" }: { molecule?: string }) {
  const [selected, setSelected] = useState(molecule);
  const data = molecules3D[selected] || molecules3D.water;

  return (
    <Card className="border-border/50 bg-card shadow-sm overflow-hidden">
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-semibold flex items-center gap-2">
          <span className="text-lg">🔮</span>
          Visualiseur 3D — Molécules
          <Badge variant="secondary" className="text-[10px] ml-auto">3D</Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Molecule selector */}
        <div className="flex flex-wrap gap-1.5">
          {Object.entries(molecules3D).map(([key, mol]) => (
            <button
              key={key}
              onClick={() => setSelected(key)}
              className={`px-2.5 py-1 rounded-lg text-[11px] font-medium transition-all ${
                selected === key
                  ? "bg-primary text-primary-foreground shadow-sm"
                  : "bg-muted/50 text-muted-foreground hover:bg-muted"
              }`}
            >
              {mol.formula}
            </button>
          ))}
        </div>

        {/* 3D Canvas */}
        <div className="w-full h-64 rounded-xl bg-gradient-to-b from-slate-900 to-slate-800 overflow-hidden">
          <Canvas camera={{ position: [2, 1.5, 2], fov: 50 }}>
            <Suspense fallback={<LoadingFallback />}>
              <ambientLight intensity={0.6} />
              <directionalLight position={[5, 5, 5]} intensity={1} />
              <pointLight position={[-5, -5, -5]} intensity={0.3} />
              <MoleculeScene data={data} />
              <OrbitControls enableZoom={true} enablePan={false} autoRotate autoRotateSpeed={2} />
              <Environment preset="studio" />
            </Suspense>
          </Canvas>
        </div>

        {/* Info */}
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <h4 className="text-sm font-semibold text-foreground">{data.name}</h4>
            <code className="text-xs font-mono text-primary bg-primary/5 px-1.5 py-0.5 rounded">{data.formula}</code>
          </div>
          <p className="text-xs text-muted-foreground leading-relaxed">{data.description}</p>
          <div className="flex flex-wrap gap-1.5">
            {data.properties.map((prop, i) => (
              <span key={i} className="px-2 py-0.5 rounded-md bg-primary/5 text-primary text-[10px] font-medium border border-primary/10">
                {prop}
              </span>
            ))}
          </div>
          <p className="text-[10px] text-muted-foreground">🖱️ Glisse pour tourner • Molette pour zoomer</p>
        </div>
      </CardContent>
    </Card>
  );
}
