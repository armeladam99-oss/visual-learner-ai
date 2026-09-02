"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, Plus, ChevronDown, ChevronUp } from "lucide-react";

// ═══════════════════════════════════════════════════════════════
// 🔧 COMPONENT PALETTE — Free construction
// ═══════════════════════════════════════════════════════════════

interface PaletteComponent {
  id: string;
  label: string;
  icon: string;
  category: string;
  defaultValue: Record<string, unknown>;
  unit?: string;
}

interface PaletteCategory {
  id: string;
  label: string;
  components: PaletteComponent[];
}

const COMPONENT_DB: Record<string, PaletteCategory[]> = {
  electricity: [
    {
      id: "power",
      label: "Sources",
      components: [
        { id: "battery", label: "Batterie", icon: "🔋", category: "power", defaultValue: { voltage: 12 }, unit: "V" },
        { id: "generator", label: "Générateur", icon: "⚡", category: "power", defaultValue: { voltage: 230, frequency: 50 }, unit: "V" },
      ],
    },
    {
      id: "passive",
      label: "Composants passifs",
      components: [
        { id: "resistor", label: "Résistance", icon: "▫️", category: "passive", defaultValue: { resistance: 100 }, unit: "Ω" },
        { id: "capacitor", label: "Condensateur", icon: "⏱️", category: "passive", defaultValue: { capacitance: 100 }, unit: "µF" },
        { id: "inductor", label: "Bobine", icon: "🌀", category: "passive", defaultValue: { inductance: 10 }, unit: "mH" },
      ],
    },
    {
      id: "output",
      label: "Sortie",
      components: [
        { id: "bulb", label: "Lampe", icon: "💡", category: "output", defaultValue: { power: 60 }, unit: "W" },
        { id: "led", label: "LED", icon: "🔴", category: "output", defaultValue: { forwardVoltage: 2.1 }, unit: "V" },
        { id: "motor", label: "Moteur", icon: "⚙️", category: "output", defaultValue: { power: 100 }, unit: "W" },
      ],
    },
    {
      id: "control",
      label: "Contrôle",
      components: [
        { id: "switch", label: "Interrupteur", icon: "🔘", category: "control", defaultValue: { closed: true } },
        { id: "diode", label: "Diode", icon: "➡️", category: "control", defaultValue: { forwardVoltage: 0.7 }, unit: "V" },
      ],
    },
    {
      id: "measurement",
      label: "Mesure",
      components: [
        { id: "voltmeter", label: "Voltmètre", icon: "📏", category: "measurement", defaultValue: {} },
        { id: "ammeter", label: "Ampèremètre", icon: "⚡", category: "measurement", defaultValue: {} },
      ],
    },
  ],
  "3d": [
    {
      id: "primitives",
      label: "Primitives",
      components: [
        { id: "sphere", label: "Sphère", icon: "🔵", category: "primitive", defaultValue: { radius: 1, color: "#6366f1" } },
        { id: "cube", label: "Cube", icon: "🟦", category: "primitive", defaultValue: { size: 1, color: "#10b981" } },
        { id: "cylinder", label: "Cylindre", icon: "🛢️", category: "primitive", defaultValue: { radius: 0.5, height: 2, color: "#f59e0b" } },
        { id: "cone", label: "Cône", icon: "🔺", category: "primitive", defaultValue: { radius: 0.5, height: 1.5, color: "#ef4444" } },
        { id: "torus", label: "Tore", icon: "🍩", category: "primitive", defaultValue: { radius: 1, tube: 0.3, color: "#8b5cf6" } },
      ],
    },
    {
      id: "math3d",
      label: "Math 3D",
      components: [
        { id: "surface", label: "Surface z=f(x,y)", icon: "🌊", category: "math3d", defaultValue: { expr: "sin(sqrt(x^2+y^2))" } },
        { id: "curve3d", label: "Courbe 3D", icon: "🌀", category: "math3d", defaultValue: { xExpr: "cos(t)", yExpr: "sin(t)", zExpr: "t/5" } },
        { id: "vector3d", label: "Vecteur", icon: "➡️", category: "math3d", defaultValue: { from: [0, 0, 0], to: [3, 2, 4] } },
      ],
    },
  ],
  chemistry: [
    {
      id: "simple",
      label: "Simples",
      components: [
        { id: "H2O", label: "H₂O", icon: "💧", category: "simple", defaultValue: { molecule: "H2O" } },
        { id: "CO2", label: "CO₂", icon: "💨", category: "simple", defaultValue: { molecule: "CO2" } },
        { id: "O2", label: "O₂", icon: "🔵", category: "simple", defaultValue: { molecule: "O2" } },
        { id: "H2", label: "H₂", icon: "⚪", category: "simple", defaultValue: { molecule: "H2" } },
        { id: "N2", label: "N₂", icon: "🔵", category: "simple", defaultValue: { molecule: "N2" } },
      ],
    },
    {
      id: "organic",
      label: "Organiques",
      components: [
        { id: "CH4", label: "CH₄ Méthane", icon: "🔵", category: "organic", defaultValue: { molecule: "CH4" } },
        { id: "C2H5OH", label: "C₂H₅OH Éthanol", icon: "🧪", category: "organic", defaultValue: { molecule: "C2H5OH" } },
        { id: "CH3COOH", label: "CH₃COOH Acide acétique", icon: "🧪", category: "organic", defaultValue: { molecule: "CH3COOH" } },
        { id: "C6H6", label: "C₆H₆ Benzène", icon: "⬡", category: "organic", defaultValue: { molecule: "C6H6" } },
        { id: "C6H12O6", label: "C₆H₁₂O₆ Glucose", icon: "🍬", category: "organic", defaultValue: { molecule: "C6H12O6" } },
      ],
    },
    {
      id: "acids",
      label: "Acides & Bases",
      components: [
        { id: "HCl", label: "HCl", icon: "⚗️", category: "acid", defaultValue: { molecule: "HCl" } },
        { id: "H2SO4", label: "H₂SO₄", icon: "⚗️", category: "acid", defaultValue: { molecule: "H2SO4" } },
        { id: "HNO3", label: "HNO₃", icon: "⚗️", category: "acid", defaultValue: { molecule: "HNO3" } },
        { id: "NaOH", label: "NaOH", icon: "🧪", category: "acid", defaultValue: { molecule: "NaOH" } },
        { id: "NH3", label: "NH₃", icon: "🧪", category: "acid", defaultValue: { molecule: "NH3" } },
      ],
    },
  ],
  biology: [
    {
      id: "cells",
      label: "Cellules",
      components: [
        { id: "plant-cell", label: "Cellule végétale", icon: "🌱", category: "cell", defaultValue: {} },
        { id: "animal-cell", label: "Cellule animale", icon: "🔬", category: "cell", defaultValue: {} },
      ],
    },
    {
      id: "molecules",
      label: "Biomolécules",
      components: [
        { id: "dna", label: "ADN", icon: "🧬", category: "bio", defaultValue: {} },
      ],
    },
  ],
};

interface ComponentPaletteProps {
  domain: string;
  onAddComponent: (component: PaletteComponent) => void;
}

export function ComponentPalette({ domain, onAddComponent }: ComponentPaletteProps) {
  const [search, setSearch] = useState("");
  const [expandedCategories, setExpandedCategories] = useState<Set<string>>(new Set());

  const categories = COMPONENT_DB[domain] || [];
  const allComponents = categories.flatMap((c) => c.components);

  const filtered = search
    ? allComponents.filter((c) => c.label.toLowerCase().includes(search.toLowerCase()) || c.id.toLowerCase().includes(search.toLowerCase()))
    : categories;

  const toggleCategory = (id: string) => {
    setExpandedCategories((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  // Auto-expand on search
  React.useEffect(() => {
    if (search) {
      setExpandedCategories(new Set(categories.map((c) => c.id)));
    }
  }, [search, categories]);

  if (categories.length === 0) return null;

  return (
    <div className="space-y-2">
      <div className="relative">
        <Search className="absolute left-2 top-1/2 -translate-y-1/2 size-3 text-slate-500" />
        <Input
          placeholder="Rechercher..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="pl-7 h-7 text-[11px] bg-slate-800 border-slate-700 text-white placeholder:text-slate-500"
        />
      </div>

      <div className="space-y-1">
        {search ? (
          // Flat filtered list
          (filtered as PaletteComponent[]).map((comp) => (
            <button
              key={comp.id}
              onClick={() => onAddComponent(comp)}
              className="w-full flex items-center gap-2 px-2 py-1.5 rounded-lg text-left hover:bg-slate-800/80 transition-colors group"
            >
              <span className="text-sm">{comp.icon}</span>
              <span className="text-[11px] text-slate-300 group-hover:text-white flex-1 truncate">{comp.label}</span>
              <Plus className="size-3 text-slate-600 group-hover:text-cyan-400" />
            </button>
          ))
        ) : (
          // Category groups
          filtered.map((cat) => {
            const category = cat as PaletteCategory;
            const isExpanded = expandedCategories.has(category.id);
            return (
              <div key={category.id}>
                <button
                  onClick={() => toggleCategory(category.id)}
                  className="w-full flex items-center justify-between px-2 py-1.5 rounded-lg hover:bg-slate-800/50 transition-colors"
                >
                  <span className="text-[10px] font-semibold text-slate-500 uppercase tracking-wide">{category.label}</span>
                  {isExpanded ? <ChevronUp className="size-3 text-slate-600" /> : <ChevronDown className="size-3 text-slate-600" />}
                </button>
                <AnimatePresence>
                  {isExpanded && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="overflow-hidden"
                    >
                      {category.components.map((comp) => (
                        <button
                          key={comp.id}
                          onClick={() => onAddComponent(comp)}
                          className="w-full flex items-center gap-2 pl-4 pr-2 py-1.5 rounded-lg text-left hover:bg-slate-800/80 transition-colors group"
                        >
                          <span className="text-sm">{comp.icon}</span>
                          <span className="text-[11px] text-slate-300 group-hover:text-white flex-1 truncate">{comp.label}</span>
                          <Plus className="size-3 text-slate-600 group-hover:text-cyan-400" />
                        </button>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
