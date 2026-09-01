"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface MolecularStructureProps {
  molecule?: "water" | "hcl" | "nacl" | "co2" | "ch4" | "naoh";
}

const moleculeData = {
  water: {
    name: "Eau — H₂O",
    formula: "H₂O",
    type: "Covalente",
    properties: ["Polaire", "Liaison hydrogène", "Solvent universel"],
    angle: 104.5,
  },
  hcl: {
    name: "Acide chlorhydrique — HCl",
    formula: "HCl",
    type: "Covalente",
    properties: ["Acide fort", "Dissociation totale", "Gaz toxique"],
    angle: 180,
  },
  nacl: {
    name: "Chlorure de sodium — NaCl",
    formula: "NaCl",
    type: "Ionique",
    properties: ["Sel de cuisine", "Cristal cubique", "Conducteur fondu"],
    angle: 90,
  },
  co2: {
    name: "Dioxyde de carbone — CO₂",
    formula: "CO₂",
    type: "Covalente",
    properties: ["Linéaire", "Non polaire", "Gaz à effet de serre"],
    angle: 180,
  },
  ch4: {
    name: "Méthane — CH₄",
    formula: "CH₄",
    type: "Covalente",
    properties: ["Tétrédrique", "Gaz naturel", "Gaz à effet de serre"],
    angle: 109.5,
  },
  naoh: {
    name: "Hydroxyde de sodium — NaOH",
    formula: "NaOH",
    type: "Ionique",
    properties: ["Base forte", "Caustique", "Savon"],
    angle: 180,
  },
};

function Atom({ x, y, radius, color, label, delay = 0 }: { x: number; y: number; radius: number; color: string; label: string; delay?: number }) {
  return (
    <motion.g
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ duration: 0.5, delay, type: "spring" }}
    >
      <circle cx={x} cy={y} r={radius} fill={color} fillOpacity="0.2" stroke={color} strokeWidth="2" />
      <circle cx={x} cy={y} r={radius * 0.6} fill={color} fillOpacity="0.4" />
      <text x={x} y={y + 4} textAnchor="middle" fontSize={radius * 0.5} fill={color} fontWeight="700">
        {label}
      </text>
    </motion.g>
  );
}

function Bond({ x1, y1, x2, y2, type = "single", delay = 0 }: { x1: number; y1: number; x2: number; y2: number; type?: "single" | "double" | "triple"; delay?: number }) {
  const dx = x2 - x1;
  const dy = y2 - y1;
  const len = Math.sqrt(dx * dx + dy * dy);
  const nx = -dy / len * 4;
  const ny = dx / len * 4;

  return (
    <motion.g
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3, delay }}
    >
      <line x1={x1} y1={y1} x2={x2} y2={y2} stroke="oklch(0.55 0.02 260)" strokeWidth="2" />
      {type === "double" && (
        <>
          <line x1={x1 + nx} y1={y1 + ny} x2={x2 + nx} y2={y2 + ny} stroke="oklch(0.55 0.02 260)" strokeWidth="2" />
        </>
      )}
      {type === "triple" && (
        <>
          <line x1={x1 + nx} y1={y1 + ny} x2={x2 + nx} y2={y2 + ny} stroke="oklch(0.55 0.02 260)" strokeWidth="2" />
          <line x1={x1 - nx} y1={y1 - ny} x2={x2 - nx} y2={y2 - ny} stroke="oklch(0.55 0.02 260)" strokeWidth="2" />
        </>
      )}
    </motion.g>
  );
}

function WaterMolecule() {
  return (
    <svg viewBox="0 0 200 160" className="w-full h-full">
      <Bond x1={100} y1={60} x2={50} y2={110} delay={0.2} />
      <Bond x1={100} y1={60} x2={150} y2={110} delay={0.2} />
      <Atom x={100} y={60} radius={22} color="#dc2626" label="O" delay={0.3} />
      <Atom x={50} y={110} radius={16} color="#4f46e5" label="H" delay={0.5} />
      <Atom x={150} y={110} radius={16} color="#4f46e5" label="H" delay={0.5} />
      <text x={100} y={25} textAnchor="middle" fontSize="9" fill="oklch(0.5 0.02 260)" fontWeight="600">104,5°</text>
      <path d="M 75,75 A 30,30 0 0,0 125,75" fill="none" stroke="oklch(0.5 0.02 260)" strokeWidth="1" strokeDasharray="2,2" />
    </svg>
  );
}

function HClMolecule() {
  return (
    <svg viewBox="0 0 200 160" className="w-full h-full">
      <Bond x1={70} y1={80} x2={130} y2={80} delay={0.2} />
      <Atom x={70} y={80} radius={16} color="#4f46e5" label="H" delay={0.3} />
      <Atom x={130} y={80} radius={22} color="#059669" label="Cl" delay={0.4} />
      <text x={100} y={40} textAnchor="middle" fontSize="8" fill="oklch(0.5 0.02 260)">Liaison covalente polaire</text>
      <text x={85} y={120} textAnchor="middle" fontSize="7" fill="#dc2626" fontWeight="600">δ⁺</text>
      <text x={120} y={120} textAnchor="middle" fontSize="7" fill="#059669" fontWeight="600">δ⁻</text>
    </svg>
  );
}

function NaClMolecule() {
  return (
    <svg viewBox="0 0 200 160" className="w-full h-full">
      <Bond x1={70} y1={80} x2={130} y2={80} delay={0.2} />
      <Atom x={70} y={80} radius={20} color="#d97706" label="Na⁺" delay={0.3} />
      <Atom x={130} y={80} radius={22} color="#059669" label="Cl⁻" delay={0.4} />
      <text x={100} y={40} textAnchor="middle" fontSize="8" fill="oklch(0.5 0.02 260)">Liaison ionique</text>
      <text x={100} y={130} textAnchor="middle" fontSize="7" fill="#d97706" fontWeight="600">Na → Na⁺ + e⁻</text>
    </svg>
  );
}

function CO2Molecule() {
  return (
    <svg viewBox="0 0 200 160" className="w-full h-full">
      <Bond x1={70} y1={80} x2={100} y2={80} type="double" delay={0.2} />
      <Bond x1={100} y1={80} x2={130} y2={80} type="double" delay={0.2} />
      <Atom x={100} y={80} radius={22} color="#dc2626" label="C" delay={0.3} />
      <Atom x={70} y={80} radius={20} color="#4f46e5" label="O" delay={0.4} />
      <Atom x={130} y={80} radius={20} color="#4f46e5" label="O" delay={0.4} />
      <text x={100} y={40} textAnchor="middle" fontSize="8" fill="oklch(0.5 0.02 260)">Linéaire — molécule non polaire</text>
    </svg>
  );
}

function CH4Molecule() {
  return (
    <svg viewBox="0 0 200 160" className="w-full h-full">
      <Bond x1={100} y1={80} x2={100} y2={40} delay={0.2} />
      <Bond x1={100} y1={80} x2={60} y2={110} delay={0.2} />
      <Bond x1={100} y1={80} x2={140} y2={110} delay={0.2} />
      <Bond x1={100} y1={80} x2={100} y2={120} delay={0.2} />
      <Atom x={100} y={80} radius={22} color="#4f46e5" label="C" delay={0.3} />
      <Atom x={100} y={40} radius={14} color="#059669" label="H" delay={0.4} />
      <Atom x={60} y={110} radius={14} color="#059669" label="H" delay={0.5} />
      <Atom x={140} y={110} radius={14} color="#059669" label="H" delay={0.5} />
      <Atom x={100} y={120} radius={14} color="#059669" label="H" delay={0.6} />
      <text x={100} y={155} textAnchor="middle" fontSize="8" fill="oklch(0.5 0.02 260)">Tétrédrique — 109,5°</text>
    </svg>
  );
}

function NaOHMolecule() {
  return (
    <svg viewBox="0 0 200 160" className="w-full h-full">
      <Bond x1={55} y1={80} x2={90} y2={80} delay={0.2} />
      <Bond x1={110} y1={80} x2={145} y2={80} delay={0.2} />
      <Atom x={55} y={80} radius={20} color="#d97706" label="Na⁺" delay={0.3} />
      <Atom x={100} y={80} radius={20} color="#dc2626" label="O" delay={0.4} />
      <Atom x={145} y={80} radius={16} color="#4f46e5" label="H" delay={0.5} />
      <text x={100} y={40} textAnchor="middle" fontSize="8" fill="oklch(0.5 0.02 260)">Base forte — dissociation totale</text>
      <text x={100} y={125} textAnchor="middle" fontSize="7" fill="#d97706" fontWeight="600">NaOH → Na⁺ + OH⁻</text>
    </svg>
  );
}

const moleculeComponents: Record<string, React.FC> = {
  water: WaterMolecule,
  hcl: HClMolecule,
  nacl: NaClMolecule,
  co2: CO2Molecule,
  ch4: CH4Molecule,
  naoh: NaOHMolecule,
};

export function MolecularStructure({ molecule = "water" }: MolecularStructureProps) {
  const [selected, setSelected] = useState<keyof typeof moleculeData>(molecule);
  const data = moleculeData[selected];
  const MoleculeComponent = moleculeComponents[selected];

  return (
    <Card className="border-border/50 bg-card shadow-sm overflow-hidden">
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-semibold flex items-center gap-2">
          <span className="text-lg">⚛️</span>
          Structure moléculaire
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Molecule selector */}
        <div className="flex flex-wrap gap-1.5">
          {(Object.keys(moleculeData) as Array<keyof typeof moleculeData>).map((key) => (
            <button
              key={key}
              onClick={() => setSelected(key)}
              className={`px-2.5 py-1 rounded-lg text-[11px] font-medium transition-all ${
                selected === key
                  ? "bg-primary text-primary-foreground shadow-sm"
                  : "bg-muted/50 text-muted-foreground hover:bg-muted"
              }`}
            >
              {moleculeData[key].formula}
            </button>
          ))}
        </div>

        {/* Molecule visualization */}
        <motion.div
          key={selected}
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="w-full h-40 bg-muted/20 rounded-lg p-2"
        >
          <MoleculeComponent />
        </motion.div>

        {/* Info */}
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <h4 className="text-sm font-semibold text-foreground">{data.name}</h4>
            <Badge variant="outline" className="text-[10px]">{data.type}</Badge>
          </div>
          <div className="flex flex-wrap gap-1.5">
            {data.properties.map((prop, i) => (
              <span
                key={i}
                className="px-2 py-0.5 rounded-md bg-primary/5 text-primary text-[10px] font-medium border border-primary/10"
              >
                {prop}
              </span>
            ))}
          </div>
          <p className="text-xs text-muted-foreground">
            Angle de liaison : <strong className="text-foreground">{data.angle}°</strong>
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
