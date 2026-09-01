"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const moleculeData = {
  water: { name: "Eau", formula: "H₂O", type: "Covalente polaire", properties: ["Solvent universel", "Liaison hydrogène", "pH = 7"], angle: 104.5, category: "Inorganique" },
  hcl: { name: "Acide chlorhydrique", formula: "HCl", type: "Covalente polaire", properties: ["Acide fort", "pH = 1 (1 mol/L)", "Gaz incolore"], angle: 180, category: "Acide" },
  nacl: { name: "Chlorure de sodium", formula: "NaCl", type: "Ionique", properties: ["Sel de cuisine", "Conducteur fondu", "Cristal cubique"], angle: 90, category: "Ionique" },
  co2: { name: "Dioxyde de carbone", formula: "CO₂", type: "Covalente", properties: ["Gaz à effet de serre", "Non polaire", "Photosynthèse"], angle: 180, category: "Inorganique" },
  ch4: { name: "Méthane", formula: "CH₄", type: "Covalente", properties: ["Gaz naturel", "Tétrédrique", "Gaz à effet de serre"], angle: 109.5, category: "Organique" },
  naoh: { name: "Hydroxyde de sodium", formula: "NaOH", type: "Ionique", properties: ["Base forte", "Caustique", "Savon"], angle: 180, category: "Base" },
  h2so4: { name: "Acide sulfurique", formula: "H₂SO₄", type: "Covalente polaire", properties: ["Acide fort", "Déshydratant", "Batterie"], angle: 109.5, category: "Acide" },
  hno3: { name: "Acide nitrique", formula: "HNO₃", type: "Covalente polaire", properties: ["Acide fort", "Oxydant", "Explosifs"], angle: 120, category: "Acide" },
  nh3: { name: "Ammoniac", formula: "NH₃", type: "Covalente polaire", properties: ["Base faible", "Gaz irritant", "Engrais"], angle: 107.8, category: "Base" },
  ch3cooh: { name: "Acide acétique", formula: "CH₃COOH", type: "Covalente", properties: ["Acide faible", "Vinaigre", "Ka = 1,8×10⁻⁵"], angle: 120, category: "Organique" },
  c2h5oh: { name: "Éthanol", formula: "C₂H₅OH", type: "Covalente", properties: ["Alcool", "Désinfectant", "Boisson"], angle: 109.5, category: "Organique" },
  h2co3: { name: "Acide carbonique", formula: "H₂CO₃", type: "Covalente", properties: ["Acide faible", "Eau gazeuse", "CO₂ dissous"], angle: 120, category: "Acide" },
  caoh2: { name: "Hydroxyde de calcium", formula: "Ca(OH)₂", type: "Ionique", properties: ["Base forte", "Chaux", "Enduits"], angle: 180, category: "Base" },
  na2co3: { name: "Carbonate de sodium", formula: "Na₂CO₃", type: "Ionique", properties: ["Base", "Cristaux", "Lessive de soude"], angle: 120, category: "Ionique" },
  h2o2: { name: "Peroxyde d&apos;hydrogène", formula: "H₂O₂", type: "Covalente", properties: ["Eau oxygénée", "Désinfectant", "Blanchissant"], angle: 111.5, category: "Inorganique" },
  n2: { name: "Diaote", formula: "N₂", type: "Covalente", properties: ["Triple liaison", "78% atmosphère", "Inerte"], angle: 180, category: "Inorganique" },
};

type MoleculeKey = keyof typeof moleculeData;

function Atom({ x, y, radius, color, label, delay = 0 }: { x: number; y: number; radius: number; color: string; label: string; delay?: number }) {
  return (
    <motion.g initial={{ scale: 0, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ duration: 0.5, delay, type: "spring" }}>
      <circle cx={x} cy={y} r={radius} fill={color} fillOpacity="0.15" stroke={color} strokeWidth="2" />
      <circle cx={x} cy={y} r={radius * 0.55} fill={color} fillOpacity="0.35" />
      <text x={x} y={y + 4} textAnchor="middle" fontSize={radius * 0.45} fill={color} fontWeight="700">{label}</text>
    </motion.g>
  );
}

function Bond({ x1, y1, x2, y2, type = "single", delay = 0 }: { x1: number; y1: number; x2: number; y2: number; type?: "single" | "double" | "triple"; delay?: number }) {
  const dx = x2 - x1; const dy = y2 - y1; const len = Math.sqrt(dx * dx + dy * dy) || 1;
  const nx = -dy / len * 4; const ny = dx / len * 4;
  return (
    <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.3, delay }}>
      <line x1={x1} y1={y1} x2={x2} y2={y2} stroke="oklch(0.55 0.02 260)" strokeWidth="2" />
      {type === "double" && <line x1={x1 + nx} y1={y1 + ny} x2={x2 + nx} y2={y2 + ny} stroke="oklch(0.55 0.02 260)" strokeWidth="2" />}
      {type === "triple" && (<>
        <line x1={x1 + nx} y1={y1 + ny} x2={x2 + nx} y2={y2 + ny} stroke="oklch(0.55 0.02 260)" strokeWidth="2" />
        <line x1={x1 - nx} y1={y1 - ny} x2={x2 - nx} y2={y2 - ny} stroke="oklch(0.55 0.02 260)" strokeWidth="2" />
      </>)}
    </motion.g>
  );
}

// Simple molecule renderers
function MolWater() {
  return (<svg viewBox="0 0 200 150" className="w-full h-full">
    <Bond x1={100} y1={50} x2={55} y2={100} delay={0.2} /><Bond x1={100} y1={50} x2={145} y2={100} delay={0.2} />
    <Atom x={100} y={50} radius={20} color="#dc2626" label="O" delay={0.3} />
    <Atom x={55} y={100} radius={14} color="#4f46e5" label="H" delay={0.5} />
    <Atom x={145} y={100} radius={14} color="#4f46e5" label="H" delay={0.5} />
    <text x={100} y={22} textAnchor="middle" fontSize="9" fill="oklch(0.5 0.02 260)" fontWeight="600">104,5°</text>
  </svg>);
}

function MolHCl() {
  return (<svg viewBox="0 0 200 150" className="w-full h-full">
    <Bond x1={65} y1={75} x2={135} y2={75} delay={0.2} />
    <Atom x={65} y={75} radius={14} color="#4f46e5" label="H" delay={0.3} />
    <Atom x={135} y={75} radius={20} color="#059669" label="Cl" delay={0.4} />
    <text x={80} y={110} fontSize="7" fill="#dc2626" fontWeight="600">δ⁺</text>
    <text x={125} y={110} fontSize="7" fill="#059669" fontWeight="600">δ⁻</text>
  </svg>);
}

function MolNaCl() {
  return (<svg viewBox="0 0 200 150" className="w-full h-full">
    <Bond x1={65} y1={75} x2={135} y2={75} delay={0.2} />
    <Atom x={65} y={75} radius={18} color="#d97706" label="Na⁺" delay={0.3} />
    <Atom x={135} y={75} radius={20} color="#059669" label="Cl⁻" delay={0.4} />
    <text x={100} y={120} textAnchor="middle" fontSize="7" fill="#d97706" fontWeight="600">Na → Na⁺ + e⁻</text>
  </svg>);
}

function MolCO2() {
  return (<svg viewBox="0 0 200 150" className="w-full h-full">
    <Bond x1={60} y1={75} x2={100} y2={75} type="double" delay={0.2} />
    <Bond x1={100} y1={75} x2={140} y2={75} type="double" delay={0.2} />
    <Atom x={100} y={75} radius={20} color="#dc2626" label="C" delay={0.3} />
    <Atom x={60} y={75} radius={18} color="#4f46e5" label="O" delay={0.4} />
    <Atom x={140} y={75} radius={18} color="#4f46e5" label="O" delay={0.4} />
  </svg>);
}

function MolCH4() {
  return (<svg viewBox="0 0 200 160" className="w-full h-full">
    <Bond x1={100} y1={80} x2={100} y2={35} delay={0.2} />
    <Bond x1={100} y1={80} x2={55} y2={115} delay={0.2} />
    <Bond x1={100} y1={80} x2={145} y2={115} delay={0.2} />
    <Bond x1={100} y1={80} x2={100} y2={130} delay={0.2} />
    <Atom x={100} y={80} radius={20} color="#4f46e5" label="C" delay={0.3} />
    <Atom x={100} y={35} radius={12} color="#059669" label="H" delay={0.4} />
    <Atom x={55} y={115} radius={12} color="#059669" label="H" delay={0.5} />
    <Atom x={145} y={115} radius={12} color="#059669" label="H" delay={0.5} />
    <Atom x={100} y={130} radius={12} color="#059669" label="H" delay={0.6} />
  </svg>);
}

function MolNaOH() {
  return (<svg viewBox="0 0 200 150" className="w-full h-full">
    <Bond x1={50} y1={75} x2={85} y2={75} delay={0.2} />
    <Bond x1={105} y1={75} x2={140} y2={75} delay={0.2} />
    <Atom x={50} y={75} radius={18} color="#d97706" label="Na⁺" delay={0.3} />
    <Atom x={95} y={75} radius={18} color="#dc2626" label="O" delay={0.4} />
    <Atom x={140} y={75} radius={14} color="#4f46e5" label="H" delay={0.5} />
  </svg>);
}

function MolH2SO4() {
  return (<svg viewBox="0 0 240 150" className="w-full h-full">
    <Bond x1={120} y1={75} x2={70} y2={45} delay={0.1} />
    <Bond x1={120} y1={75} x2={70} y2={105} delay={0.1} />
    <Bond x1={120} y1={75} x2={170} y2={55} delay={0.1} />
    <Bond x1={120} y1={75} x2={170} y2={95} delay={0.1} />
    <Atom x={120} y={75} radius={22} color="#d97706" label="S" delay={0.2} />
    <Atom x={70} y={45} radius={16} color="#4f46e5" label="O" delay={0.3} />
    <Atom x={70} y={105} radius={16} color="#4f46e5" label="O" delay={0.3} />
    <Atom x={170} y={55} radius={16} color="#4f46e5" label="O" delay={0.4} />
    <Atom x={170} y={95} radius={16} color="#4f46e5" label="O" delay={0.4} />
    <Bond x1={55} y1={45} x2={30} y2={30} delay={0.5} />
    <Bond x1={55} y1={105} x2={30} y2={120} delay={0.5} />
    <Atom x={30} y={30} radius={10} color="#059669" label="H" delay={0.6} />
    <Atom x={30} y={120} radius={10} color="#059669" label="H" delay={0.6} />
    <text x={120} y={145} textAnchor="middle" fontSize="7" fill="oklch(0.5 0.02 260)">Acide fort — dissociation totale</text>
  </svg>);
}

function MolHNO3() {
  return (<svg viewBox="0 0 220 150" className="w-full h-full">
    <Bond x1={110} y1={75} x2={60} y2={55} delay={0.1} />
    <Bond x1={110} y1={75} x2={160} y2={55} delay={0.1} />
    <Bond x1={110} y1={75} x2={110} y2={120} delay={0.1} />
    <Atom x={110} y={75} radius={20} color="#4f46e5" label="N" delay={0.2} />
    <Atom x={60} y={55} radius={16} color="#dc2626" label="O" delay={0.3} />
    <Atom x={160} y={55} radius={16} color="#dc2626" label="O" delay={0.3} />
    <Atom x={110} y={120} radius={16} color="#dc2626" label="O" delay={0.4} />
    <Bond x1={110} y1={130} x2={110} y2={145} delay={0.5} />
    <Atom x={110} y={148} radius={10} color="#059669" label="H" delay={0.6} />
  </svg>);
}

function MolNH3() {
  return (<svg viewBox="0 0 200 150" className="w-full h-full">
    <Bond x1={100} y1={55} x2={55} y2={105} delay={0.1} />
    <Bond x1={100} y1={55} x2={145} y2={105} delay={0.1} />
    <Bond x1={100} y1={55} x2={100} y2={110} delay={0.1} />
    <Atom x={100} y={55} radius={20} color="#4f46e5" label="N" delay={0.2} />
    <Atom x={55} y={105} radius={12} color="#059669" label="H" delay={0.3} />
    <Atom x={145} y={105} radius={12} color="#059669" label="H" delay={0.3} />
    <Atom x={100} y={110} radius={12} color="#059669" label="H" delay={0.4} />
    <text x={100} y={22} textAnchor="middle" fontSize="8" fill="oklch(0.5 0.02 260)">Pyramide — 107,8°</text>
  </svg>);
}

function MolCH3COOH() {
  return (<svg viewBox="0 0 260 150" className="w-full h-full">
    <Bond x1={40} y1={75} x2={80} y2={75} delay={0.1} />
    <Bond x1={80} y1={75} x2={130} y2={75} delay={0.1} />
    <Bond x1={130} y1={75} x2={130} y2={35} type="double" delay={0.1} />
    <Bond x1={130} y1={75} x2={180} y2={75} delay={0.1} />
    <Bond x1={180} y1={75} x2={220} y2={75} delay={0.1} />
    <Atom x={40} y={75} radius={14} color="#059669" label="H" delay={0.2} />
    <Atom x={80} y={75} radius={18} color="#4f46e5" label="C" delay={0.3} />
    <Atom x={130} y={75} radius={18} color="#4f46e5" label="C" delay={0.3} />
    <Atom x={130} y={35} radius={14} color="#dc2626" label="O" delay={0.4} />
    <Atom x={180} y={75} radius={14} color="#dc2626" label="O" delay={0.4} />
    <Atom x={220} y={75} radius={10} color="#059669" label="H" delay={0.5} />
    <text x={130} y={140} textAnchor="middle" fontSize="7" fill="oklch(0.5 0.02 260)">Acide faible — Ka = 1,8×10⁻⁵</text>
  </svg>);
}

function MolC2H5OH() {
  return (<svg viewBox="0 0 260 140" className="w-full h-full">
    <Bond x1={40} y1={70} x2={80} y2={70} delay={0.1} />
    <Bond x1={80} y1={70} x2={130} y2={70} delay={0.1} />
    <Bond x1={130} y1={70} x2={180} y2={70} delay={0.1} />
    <Bond x1={180} y1={70} x2={220} y2={70} delay={0.1} />
    <Atom x={40} y={70} radius={14} color="#059669" label="H" delay={0.2} />
    <Atom x={80} y={70} radius={18} color="#4f46e5" label="C" delay={0.3} />
    <Atom x={130} y={70} radius={18} color="#4f46e5" label="C" delay={0.3} />
    <Atom x={180} y={70} radius={14} color="#dc2626" label="O" delay={0.4} />
    <Atom x={220} y={70} radius={10} color="#059669" label="H" delay={0.5} />
    <text x={130} y={120} textAnchor="middle" fontSize="7" fill="oklch(0.5 0.02 260)">Alcool — désinfectant, boissons</text>
  </svg>);
}

function MolH2CO3() {
  return (<svg viewBox="0 0 220 150" className="w-full h-full">
    <Bond x1={110} y1={70} x2={60} y2={50} delay={0.1} />
    <Bond x1={110} y1={70} x2={160} y2={50} delay={0.1} />
    <Bond x1={110} y1={70} x2={110} y2={115} delay={0.1} />
    <Atom x={110} y={70} radius={18} color="#dc2626" label="C" delay={0.2} />
    <Atom x={60} y={50} radius={14} color="#4f46e5" label="O" delay={0.3} />
    <Atom x={160} y={50} radius={14} color="#4f46e5" label="O" delay={0.3} />
    <Atom x={110} y={115} radius={14} color="#4f46e5" label="O" delay={0.4} />
    <Bond x1={110} y1={130} x2={110} y2={145} delay={0.5} />
    <Bond x1={45} y1={50} x2={25} y2={40} delay={0.5} />
    <Bond x1={175} y1={50} x2={195} y2={40} delay={0.5} />
    <Atom x={25} y={40} radius={10} color="#059669" label="H" delay={0.6} />
    <Atom x={195} y={40} radius={10} color="#059669" label="H" delay={0.6} />
    <Atom x={110} y={148} radius={10} color="#059669" label="H" delay={0.7} />
  </svg>);
}

function MolCaOH2() {
  return (<svg viewBox="0 0 240 150" className="w-full h-full">
    <Bond x1={120} y1={75} x2={60} y2={75} delay={0.1} />
    <Bond x1={120} y1={75} x2={180} y2={75} delay={0.1} />
    <Bond x1={60} y1={75} x2={30} y2={60} delay={0.2} />
    <Bond x1={180} y1={75} x2={210} y2={60} delay={0.2} />
    <Atom x={120} y={75} radius={20} color="#d97706" label="Ca²⁺" delay={0.2} />
    <Atom x={60} y={75} radius={16} color="#dc2626" label="O" delay={0.3} />
    <Atom x={180} y={75} radius={16} color="#dc2626" label="O" delay={0.3} />
    <Atom x={30} y={60} radius={10} color="#059669" label="H" delay={0.4} />
    <Atom x={210} y={60} radius={10} color="#059669" label="H" delay={0.4} />
    <text x={120} y={120} textAnchor="middle" fontSize="7" fill="oklch(0.5 0.02 260)">Base forte — chaux</text>
  </svg>);
}

function MolNa2CO3() {
  return (<svg viewBox="0 0 260 150" className="w-full h-full">
    <Bond x1={80} y1={75} x2={130} y2={75} delay={0.1} />
    <Bond x1={130} y1={75} x2={130} y2={35} type="double" delay={0.1} />
    <Bond x1={130} y1={75} x2={180} y2={75} delay={0.1} />
    <Bond x1={30} y1={75} x2={80} y2={75} delay={0.1} />
    <Bond x1={180} y1={75} x2={230} y2={75} delay={0.1} />
    <Atom x={30} y={75} radius={16} color="#d97706" label="Na⁺" delay={0.2} />
    <Atom x={80} y={75} radius={16} color="#dc2626" label="O" delay={0.3} />
    <Atom x={130} y={75} radius={18} color="#4f46e5" label="C" delay={0.3} />
    <Atom x={130} y={35} radius={14} color="#dc2626" label="O" delay={0.4} />
    <Atom x={180} y={75} radius={16} color="#dc2626" label="O" delay={0.4} />
    <Atom x={230} y={75} radius={16} color="#d97706" label="Na⁺" delay={0.5} />
  </svg>);
}

function MolH2O2() {
  return (<svg viewBox="0 0 200 150" className="w-full h-full">
    <Bond x1={70} y1={75} x2={100} y2={75} delay={0.1} />
    <Bond x1={100} y1={75} x2={130} y2={75} delay={0.1} />
    <Bond x1={70} y1={75} x2={50} y2={50} delay={0.2} />
    <Bond x1={130} y1={75} x2={150} y2={50} delay={0.2} />
    <Atom x={70} y={75} radius={16} color="#dc2626" label="O" delay={0.2} />
    <Atom x={130} y={75} radius={16} color="#dc2626" label="O" delay={0.3} />
    <Atom x={50} y={50} radius={10} color="#059669" label="H" delay={0.4} />
    <Atom x={150} y={50} radius={10} color="#059669" label="H" delay={0.4} />
    <text x={100} y={115} textAnchor="middle" fontSize="7" fill="oklch(0.5 0.02 260)">Liaison O—O faible</text>
  </svg>);
}

function MolN2() {
  return (<svg viewBox="0 0 200 150" className="w-full h-full">
    <Bond x1={70} y1={75} x2={130} y2={75} type="triple" delay={0.2} />
    <Atom x={70} y={75} radius={20} color="#4f46e5" label="N" delay={0.3} />
    <Atom x={130} y={75} radius={20} color="#4f46e5" label="N" delay={0.4} />
    <text x={100} y={45} textAnchor="middle" fontSize="8" fill="oklch(0.5 0.02 260)">Triple liaison — très stable</text>
  </svg>);
}

const moleculeComponents: Record<string, React.FC> = {
  water: MolWater, hcl: MolHCl, nacl: MolNaCl, co2: MolCO2, ch4: MolCH4, naoh: MolNaOH,
  h2so4: MolH2SO4, hno3: MolHNO3, nh3: MolNH3, ch3cooh: MolCH3COOH,
  c2h5oh: MolC2H5OH, h2co3: MolH2CO3, caoh2: MolCaOH2, na2co3: MolNa2CO3,
  h2o2: MolH2O2, n2: MolN2,
};

const categories = ["Tous", "Acide", "Base", "Ionique", "Organique", "Inorganique"];

export function MolecularStructure({ molecule = "water" }: { molecule?: string }) {
  const [selected, setSelected] = useState<MoleculeKey>(molecule as MoleculeKey);
  const [category, setCategory] = useState("Tous");
  const data = moleculeData[selected];
  const MoleculeComponent = moleculeComponents[selected] || MolWater;

  const filteredMolecules = category === "Tous"
    ? Object.keys(moleculeData) as MoleculeKey[]
    : (Object.keys(moleculeData) as MoleculeKey[]).filter((k) => moleculeData[k].category === category);

  return (
    <Card className="border-border/50 bg-card shadow-sm overflow-hidden">
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-semibold flex items-center gap-2">
          <span className="text-lg">⚛️</span>
          Structure moléculaire
          <Badge variant="secondary" className="text-[10px] ml-auto">{filteredMolecules.length} molécules</Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Category filter */}
        <div className="flex flex-wrap gap-1.5">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setCategory(cat)}
              className={`px-2.5 py-1 rounded-lg text-[10px] font-medium transition-all ${
                category === cat ? "bg-primary text-primary-foreground shadow-sm" : "bg-muted/50 text-muted-foreground hover:bg-muted"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Molecule selector */}
        <div className="flex flex-wrap gap-1.5 max-h-24 overflow-y-auto">
          {filteredMolecules.map((key) => (
            <button
              key={key}
              onClick={() => setSelected(key)}
              className={`px-2 py-1 rounded-lg text-[10px] font-medium transition-all ${
                selected === key ? "bg-primary text-primary-foreground shadow-sm" : "bg-muted/50 text-muted-foreground hover:bg-muted"
              }`}
            >
              {moleculeData[key].formula}
            </button>
          ))}
        </div>

        {/* Visualization */}
        <motion.div key={selected} initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="w-full h-36 bg-muted/20 rounded-lg p-2">
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
              <span key={i} className="px-2 py-0.5 rounded-md bg-primary/5 text-primary text-[10px] font-medium border border-primary/10">{prop}</span>
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
