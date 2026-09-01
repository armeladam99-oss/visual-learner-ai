"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Slider } from "@/components/ui/slider";

interface CircuitDiagramProps {
  variant?: "series" | "parallel" | "mixed";
}

export function CircuitDiagram({ variant = "series" }: CircuitDiagramProps) {
  const [voltage, setVoltage] = useState(12);
  const [r1, setR1] = useState(100);
  const [r2, setR2] = useState(200);

  const computeCircuit = () => {
    if (variant === "series") {
      const rTotal = r1 + r2;
      const current = voltage / rTotal;
      const ur1 = current * r1;
      const ur2 = current * r2;
      return { rTotal, current: current * 1000, ur1, ur2, power: voltage * current * 1000 };
    } else if (variant === "parallel") {
      const rTotal = (r1 * r2) / (r1 + r2);
      const i1 = voltage / r1;
      const i2 = voltage / r2;
      const current = i1 + i2;
      return { rTotal, current: current * 1000, i1: i1 * 1000, i2: i2 * 1000, power: voltage * current * 1000 };
    }
    return { rTotal: r1 + r2, current: 0, power: 0 };
  };

  const circuit = computeCircuit();

  return (
    <Card className="border-border/50 bg-card shadow-sm overflow-hidden">
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-semibold flex items-center gap-2">
          <span className="text-lg">⚡</span>
          Schéma de circuit
          <Badge variant="secondary" className="text-[10px] ml-auto">
            {variant === "series" ? "Série" : variant === "parallel" ? "Parallèle" : "Mixte"}
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="w-full h-52 flex items-center justify-center bg-muted/20 rounded-lg">
          <svg viewBox="0 0 360 180" className="w-full h-full max-w-md">
            {/* Battery */}
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }}>
              <rect x="10" y="60" width="30" height="60" rx="3" fill="none" stroke="#d97706" strokeWidth="2" />
              <line x1="15" y1="70" x2="35" y2="70" stroke="#d97706" strokeWidth="3" />
              <line x1="20" y1="80" x2="30" y2="80" stroke="#d97706" strokeWidth="1.5" />
              <text x="25" y="55" textAnchor="middle" fontSize="9" fill="#d97706" fontWeight="600">{voltage}V</text>
            </motion.g>

            {variant === "series" && (
              <>
                {/* Top wire */}
                <motion.line x1="40" y1="65" x2="130" y2="65" stroke="#4f46e5" strokeWidth="1.5"
                  initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 0.5, delay: 0.3 }} />
                {/* R1 */}
                <motion.rect x="130" y="55" width="50" height="20" rx="3" fill="#4f46e5" fillOpacity="0.1" stroke="#4f46e5" strokeWidth="1.5"
                  initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }} />
                <text x="155" y="69" textAnchor="middle" fontSize="8" fill="#4f46e5" fontWeight="600">R₁={r1}Ω</text>
                {/* Wire between */}
                <motion.line x1="180" y1="65" x2="220" y2="65" stroke="#4f46e5" strokeWidth="1.5"
                  initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 0.3, delay: 0.7 }} />
                {/* R2 */}
                <motion.rect x="220" y="55" width="50" height="20" rx="3" fill="#059669" fillOpacity="0.1" stroke="#059669" strokeWidth="1.5"
                  initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.9 }} />
                <text x="245" y="69" textAnchor="middle" fontSize="8" fill="#059669" fontWeight="600">R₂={r2}Ω</text>
                {/* Right wire */}
                <motion.line x1="270" y1="65" x2="340" y2="65" stroke="#4f46e5" strokeWidth="1.5"
                  initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 0.3, delay: 1.1 }} />
                {/* Down */}
                <motion.line x1="340" y1="65" x2="340" y2="120" stroke="#4f46e5" strokeWidth="1.5"
                  initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 0.3, delay: 1.2 }} />
                {/* Bottom wire */}
                <motion.line x1="340" y1="120" x2="40" y2="120" stroke="#4f46e5" strokeWidth="1.5"
                  initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 0.8, delay: 1.3 }} />
                {/* Up to battery */}
                <motion.line x1="40" y1="120" x2="40" y2="120" stroke="#4f46e5" strokeWidth="1.5" />
                <motion.line x1="25" y1="120" x2="25" y2="125" stroke="#4f46e5" strokeWidth="1.5"
                  initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 0.2, delay: 1.4 }} />

                {/* Current arrow */}
                <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.5 }}>
                  <line x1="145" y1="40" x2="200" y2="40" stroke="#d97706" strokeWidth="1" markerEnd="url(#arrow)" />
                  <text x="170" y="35" textAnchor="middle" fontSize="7" fill="#d97706">I = {circuit.current.toFixed(1)}mA</text>
                </motion.g>

                {/* Voltage labels */}
                <text x="155" y="95" textAnchor="middle" fontSize="7" fill="#4f46e5">U₁={circuit.ur1?.toFixed(1)}V</text>
                <text x="245" y="95" textAnchor="middle" fontSize="7" fill="#059669">U₂={circuit.ur2?.toFixed(1)}V</text>
              </>
            )}

            {variant === "parallel" && (
              <>
                {/* Top wire to junction */}
                <motion.line x1="40" y1="65" x2="120" y2="65" stroke="#4f46e5" strokeWidth="1.5"
                  initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 0.5, delay: 0.3 }} />
                {/* Junction */}
                <circle cx="120" cy="65" r="3" fill="#4f46e5" />
                {/* Branch 1 (top) */}
                <motion.line x1="120" y1="65" x2="120" y2="35" stroke="#4f46e5" strokeWidth="1.5"
                  initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 0.3, delay: 0.5 }} />
                <motion.line x1="120" y1="35" x2="240" y2="35" stroke="#4f46e5" strokeWidth="1.5"
                  initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 0.5, delay: 0.6 }} />
                <motion.rect x="170" y="25" width="50" height="20" rx="3" fill="#4f46e5" fillOpacity="0.1" stroke="#4f46e5" strokeWidth="1.5"
                  initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.8 }} />
                <text x="195" y="39" textAnchor="middle" fontSize="8" fill="#4f46e5" fontWeight="600">R₁={r1}Ω</text>
                <motion.line x1="240" y1="35" x2="280" y2="35" stroke="#4f46e5" strokeWidth="1.5"
                  initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 0.3, delay: 0.9 }} />
                <motion.line x1="280" y1="35" x2="280" y2="65" stroke="#4f46e5" strokeWidth="1.5"
                  initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 0.3, delay: 1 }} />

                {/* Branch 2 (bottom) */}
                <motion.line x1="120" y1="65" x2="120" y2="95" stroke="#4f46e5" strokeWidth="1.5"
                  initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 0.3, delay: 0.5 }} />
                <motion.line x1="120" y1="95" x2="240" y2="95" stroke="#4f46e5" strokeWidth="1.5"
                  initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 0.5, delay: 0.6 }} />
                <motion.rect x="170" y="85" width="50" height="20" rx="3" fill="#059669" fillOpacity="0.1" stroke="#059669" strokeWidth="1.5"
                  initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.8 }} />
                <text x="195" y="99" textAnchor="middle" fontSize="8" fill="#059669" fontWeight="600">R₂={r2}Ω</text>
                <motion.line x1="240" y1="95" x2="280" y2="95" stroke="#4f46e5" strokeWidth="1.5"
                  initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 0.3, delay: 0.9 }} />
                <motion.line x1="280" y1="95" x2="280" y2="65" stroke="#4f46e5" strokeWidth="1.5"
                  initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 0.3, delay: 1 }} />

                {/* Junction 2 */}
                <circle cx="280" cy="65" r="3" fill="#4f46e5" />

                {/* Return wire */}
                <motion.line x1="280" y1="65" x2="340" y2="65" stroke="#4f46e5" strokeWidth="1.5"
                  initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 0.3, delay: 1.1 }} />
                <motion.line x1="340" y1="65" x2="340" y2="120" stroke="#4f46e5" strokeWidth="1.5"
                  initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 0.3, delay: 1.2 }} />
                <motion.line x1="340" y1="120" x2="25" y2="120" stroke="#4f46e5" strokeWidth="1.5"
                  initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 0.8, delay: 1.3 }} />

                {/* Current labels */}
                <text x="155" y="30" textAnchor="middle" fontSize="7" fill="#4f46e5">I₁={(circuit as any).i1?.toFixed(1)}mA</text>
                <text x="155" y="115" textAnchor="middle" fontSize="7" fill="#059669">I₂={(circuit as any).i2?.toFixed(1)}mA</text>
                <text x="170" y="145" textAnchor="middle" fontSize="7" fill="#d97706">I = {circuit.current.toFixed(1)}mA</text>
              </>
            )}

            {/* Arrow marker */}
            <defs>
              <marker id="arrow" markerWidth="8" markerHeight="6" refX="8" refY="3" orient="auto">
                <path d="M0,0 L8,3 L0,6" fill="#d97706" />
              </marker>
            </defs>
          </svg>
        </div>

        {/* Results */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-center">
          <div className="rounded-lg bg-muted/30 p-2">
            <p className="text-[10px] text-muted-foreground">R équivalente</p>
            <p className="text-sm font-mono font-bold text-foreground">{circuit.rTotal.toFixed(0)}Ω</p>
          </div>
          <div className="rounded-lg bg-muted/30 p-2">
            <p className="text-[10px] text-muted-foreground">Courant total</p>
            <p className="text-sm font-mono font-bold text-primary">{circuit.current.toFixed(1)}mA</p>
          </div>
          <div className="rounded-lg bg-muted/30 p-2">
            <p className="text-[10px] text-muted-foreground">Puissance</p>
            <p className="text-sm font-mono font-bold text-amber-600">{circuit.power.toFixed(1)}mW</p>
          </div>
          <div className="rounded-lg bg-muted/30 p-2">
            <p className="text-[10px] text-muted-foreground">Tension</p>
            <p className="text-sm font-mono font-bold text-emerald-600">{voltage}V</p>
          </div>
        </div>

        {/* Sliders */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="space-y-1">
            <div className="flex items-center justify-between">
              <label className="text-xs font-medium text-foreground">Tension U</label>
              <span className="text-xs font-mono font-semibold text-amber-600 bg-amber-50 dark:bg-amber-950/30 px-1.5 py-0.5 rounded">{voltage}V</span>
            </div>
            <Slider min={1} max={24} step={1} value={[voltage]} onValueChange={([v]) => setVoltage(v)} />
          </div>
          <div className="space-y-1">
            <div className="flex items-center justify-between">
              <label className="text-xs font-medium text-foreground">Résistance R₁</label>
              <span className="text-xs font-mono font-semibold text-indigo-600 bg-indigo-50 dark:bg-indigo-950/30 px-1.5 py-0.5 rounded">{r1}Ω</span>
            </div>
            <Slider min={10} max={1000} step={10} value={[r1]} onValueChange={([v]) => setR1(v)} />
          </div>
          <div className="space-y-1">
            <div className="flex items-center justify-between">
              <label className="text-xs font-medium text-foreground">Résistance R₂</label>
              <span className="text-xs font-mono font-semibold text-emerald-600 bg-emerald-50 dark:bg-emerald-950/30 px-1.5 py-0.5 rounded">{r2}Ω</span>
            </div>
            <Slider min={10} max={1000} step={10} value={[r2]} onValueChange={([v]) => setR2(v)} />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
