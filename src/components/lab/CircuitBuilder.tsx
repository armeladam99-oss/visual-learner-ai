"use client";

import { useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Slider } from "@/components/ui/slider";
import { Input } from "@/components/ui/input";
import type { LabVizSpec } from "@/lib/lab/lab-schema";

// ═══════════════════════════════════════════════════════════════
// ⚡ CIRCUIT BUILDER — Constructeur de circuits interactif
// ═══════════════════════════════════════════════════════════════

interface CircuitBuilderProps {
  spec: LabVizSpec;
  onParamChange?: (key: string, value: number) => void;
}

export function CircuitBuilder({ spec, onParamChange }: CircuitBuilderProps) {
  const p = spec.params as { R?: number; C?: number; U0?: number };
  const R = p.R || 100;
  const C = p.C || 100;
  const U0 = p.U0 || 5;
  const tau = (R * C) / 1000;

  const updateParam = (key: string, val: number) => {
    onParamChange?.(key, val);
  };

  const svgContent = useMemo(() => {
    return (
      <svg viewBox="0 0 500 250" className="w-full rounded-lg bg-slate-950">
        {/* Battery */}
        <line x1="50" y1="80" x2="50" y2="170" stroke="#94a3b8" strokeWidth="2" />
        <line x1="35" y1="115" x2="65" y2="115" stroke="#f59e0b" strokeWidth="3" />
        <line x1="42" y1="135" x2="58" y2="135" stroke="#f59e0b" strokeWidth="2" />
        <text x="20" y="108" fill="#f59e0b" fontSize="10" fontFamily="monospace">+</text>
        <text x="20" y="148" fill="#94a3b8" fontSize="10" fontFamily="monospace">−</text>
        <text x="15" y="130" fill="#f59e0b" fontSize="11" fontFamily="monospace" fontWeight="bold">{U0}V</text>

        {/* Top wire */}
        <line x1="50" y1="80" x2="150" y2="80" stroke="#6366f1" strokeWidth="2" />

        {/* Resistor */}
        <polyline points="150,80 155,65 165,95 175,65 185,95 195,65 205,95 210,80"
          fill="none" stroke="#10b981" strokeWidth="2" />
        <text x="180" y="55" fill="#10b981" fontSize="10" fontFamily="monospace" textAnchor="middle" fontWeight="bold">R={R}Ω</text>

        {/* Wire to capacitor */}
        <line x1="210" y1="80" x2="310" y2="80" stroke="#6366f1" strokeWidth="2" />

        {/* Capacitor */}
        <line x1="310" y1="60" x2="310" y2="100" stroke="#ec4899" strokeWidth="3" />
        <line x1="325" y1="60" x2="325" y2="100" stroke="#ec4899" strokeWidth="3" />
        <text x="318" y="52" fill="#ec4899" fontSize="10" fontFamily="monospace" textAnchor="middle" fontWeight="bold">C={C}μF</text>

        {/* Right wire */}
        <line x1="325" y1="80" x2="430" y2="80" stroke="#6366f1" strokeWidth="2" />
        <line x1="430" y1="80" x2="430" y2="170" stroke="#6366f1" strokeWidth="2" />

        {/* Bottom wire */}
        <line x1="430" y1="170" x2="50" y2="170" stroke="#6366f1" strokeWidth="2" />

        {/* Current arrow */}
        <defs>
          <marker id="circuit-arrow" markerWidth="8" markerHeight="6" refX="8" refY="3" orient="auto">
            <polygon points="0,0 8,3 0,6" fill="#f59e0b" />
          </marker>
        </defs>
        <line x1="100" y1="68" x2="130" y2="68" stroke="#f59e0b" strokeWidth="1.5" markerEnd="url(#circuit-arrow)" />
        <text x="110" y="62" fill="#f59e0b" fontSize="9" fontFamily="monospace">I</text>

        {/* Junction dots */}
        <circle cx="50" cy="80" r="3" fill="#6366f1" />
        <circle cx="430" cy="80" r="3" fill="#6366f1" />
        <circle cx="50" cy="170" r="3" fill="#6366f1" />
        <circle cx="430" cy="170" r="3" fill="#6366f1" />

        {/* Voltage labels */}
        <text x="250" y="200" fill="#94a3b8" fontSize="10" fontFamily="monospace" textAnchor="middle">
          τ = RC = {tau.toFixed(3)}s
        </text>
        <text x="250" y="215" fill="#94a3b8" fontSize="9" fontFamily="monospace" textAnchor="middle">
          I = U₀/R = {(U0 / R * 1000).toFixed(1)}mA (à t=0)
        </text>
      </svg>
    );
  }, [R, C, U0, tau]);

  return (
    <Card className="border-cyan-500/20 bg-slate-900/80 overflow-hidden">
      <CardHeader className="pb-2 border-b border-cyan-500/10">
        <CardTitle className="text-sm font-semibold flex items-center gap-2 text-cyan-400">
          ⚡ {spec.title}
          <Badge variant="secondary" className="text-[10px] bg-cyan-500/10 text-cyan-400">Circuit</Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="p-4 space-y-3">
        {svgContent}

        {/* Parameter controls */}
        <div className="grid grid-cols-3 gap-3">
          {[
            { key: "U0", label: "Tension U₀", value: U0, unit: "V", min: 1, max: 20, step: 0.5 },
            { key: "R", label: "Résistance R", value: R, unit: "Ω", min: 10, max: 1000, step: 10 },
            { key: "C", label: "Capacité C", value: C, unit: "μF", min: 10, max: 1000, step: 10 },
          ].map((s) => (
            <div key={s.key} className="space-y-1">
              <div className="flex items-center justify-between">
                <label className="text-[10px] text-cyan-300">{s.label}</label>
                <span className="text-[10px] font-mono font-bold text-cyan-400">{s.value}{s.unit}</span>
              </div>
              <div className="flex gap-1">
                <Input
                  type="number"
                  value={s.value}
                  onChange={(e) => updateParam(s.key, parseFloat(e.target.value) || s.min)}
                  className="w-14 h-6 text-[10px] bg-slate-800 border-slate-700 text-white text-center"
                />
                <Slider
                  min={s.min}
                  max={s.max}
                  step={s.step}
                  value={[s.value]}
                  onValueChange={([v]) => updateParam(s.key, v)}
                  className="flex-1 [&_[role=slider]]:bg-cyan-500"
                />
              </div>
            </div>
          ))}
        </div>

        {/* Calculated values */}
        <div className="grid grid-cols-3 gap-2 text-[10px]">
          <div className="rounded-lg bg-cyan-500/5 border border-cyan-500/20 p-2">
            <p className="text-cyan-300/60">τ = RC</p>
            <p className="font-mono font-bold text-cyan-400">{tau.toFixed(3)} s</p>
          </div>
          <div className="rounded-lg bg-cyan-500/5 border border-cyan-500/20 p-2">
            <p className="text-cyan-300/60">I(0) = U₀/R</p>
            <p className="font-mono font-bold text-cyan-400">{(U0 / R * 1000).toFixed(1)} mA</p>
          </div>
          <div className="rounded-lg bg-cyan-500/5 border border-cyan-500/20 p-2">
            <p className="text-cyan-300/60">5τ = charge 99%</p>
            <p className="font-mono font-bold text-cyan-400">{(tau * 5).toFixed(2)} s</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
