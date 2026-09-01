"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Slider } from "@/components/ui/slider";

interface VectorDiagramProps {
  variant?: "addition" | "decomposition" | "projectile";
}

export function VectorDiagram({ variant = "addition" }: VectorDiagramProps) {
  const [v1Mag, setV1Mag] = useState(80);
  const [v1Angle, setV1Angle] = useState(30);
  const [v2Mag, setV2Mag] = useState(60);
  const [v2Angle, setV2Angle] = useState(120);

  const toRad = (deg: number) => (deg * Math.PI) / 180;

  const v1x = v1Mag * Math.cos(toRad(v1Angle));
  const v1y = v1Mag * Math.sin(toRad(v1Angle));
  const v2x = v2Mag * Math.cos(toRad(v2Angle));
  const v2y = v2Mag * Math.sin(toRad(v2Angle));
  const rx = v1x + v2x;
  const ry = v1y + v2y;
  const rMag = Math.sqrt(rx * rx + ry * ry);
  const rAngle = (Math.atan2(ry, rx) * 180) / Math.PI;

  return (
    <Card className="border-border/50 bg-card shadow-sm overflow-hidden">
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-semibold flex items-center gap-2">
          <span className="text-lg">📐</span>
          Représentation vectorielle
          <Badge variant="secondary" className="text-[10px] ml-auto">
            {variant === "addition" ? "Addition" : variant === "decomposition" ? "Décomposition" : "Projectile"}
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="w-full h-64 flex items-center justify-center bg-muted/20 rounded-lg">
          <svg viewBox="0 0 300 260" className="w-full h-full max-w-md">
            {/* Grid */}
            {[-100, -50, 0, 50, 100].map((v) => (
              <g key={v}>
                <line x1={150 + v} y1="20" x2={150 + v} y2="240" stroke="oklch(0.9 0.01 250)" strokeWidth="0.5" />
                <line x1="20" y1={130 + v} x2="280" y2={130 + v} stroke="oklch(0.9 0.01 250)" strokeWidth="0.5" />
              </g>
            ))}

            {/* Axes */}
            <line x1="20" y1="130" x2="280" y2="130" stroke="oklch(0.7 0.02 260)" strokeWidth="1" />
            <line x1="150" y1="20" x2="150" y2="240" stroke="oklch(0.7 0.02 260)" strokeWidth="1" />
            <text x="275" y="125" fontSize="9" fill="oklch(0.5 0.02 260)" fontWeight="600">x</text>
            <text x="155" y="25" fontSize="9" fill="oklch(0.5 0.02 260)" fontWeight="600">y</text>

            <defs>
              <marker id="vec1" markerWidth="8" markerHeight="6" refX="8" refY="3" orient="auto">
                <path d="M0,0 L8,3 L0,6" fill="#4f46e5" />
              </marker>
              <marker id="vec2" markerWidth="8" markerHeight="6" refX="8" refY="3" orient="auto">
                <path d="M0,0 L8,3 L0,6" fill="#059669" />
              </marker>
              <marker id="vecR" markerWidth="10" markerHeight="7" refX="10" refY="3.5" orient="auto">
                <path d="M0,0 L10,3.5 L0,7" fill="#dc2626" />
              </marker>
            </defs>

            {variant === "addition" && (
              <>
                {/* Vector V1 */}
                <motion.line
                  x1="150" y1="130"
                  x2={150 + v1x} y2={130 - v1y}
                  stroke="#4f46e5" strokeWidth="2.5" markerEnd="url(#vec1)"
                  initial={{ pathLength: 0 }} animate={{ pathLength: 1 }}
                  transition={{ duration: 0.5 }}
                />
                <text
                  x={150 + v1x / 2 - 15}
                  y={130 - v1y / 2 - 8}
                  fontSize="9" fill="#4f46e5" fontWeight="700"
                >
                  V⃗₁
                </text>

                {/* Vector V2 from V1 tip */}
                <motion.line
                  x1={150 + v1x} y1={130 - v1y}
                  x2={150 + v1x + v2x} y2={130 - v1y - v2y}
                  stroke="#059669" strokeWidth="2.5" markerEnd="url(#vec2)"
                  initial={{ pathLength: 0 }} animate={{ pathLength: 1 }}
                  transition={{ duration: 0.5, delay: 0.3 }}
                />
                <text
                  x={150 + v1x + v2x / 2 + 5}
                  y={130 - v1y - v2y / 2 - 5}
                  fontSize="9" fill="#059669" fontWeight="700"
                >
                  V⃗₂
                </text>

                {/* Resultant R */}
                <motion.line
                  x1="150" y1="130"
                  x2={150 + rx} y2={130 - ry}
                  stroke="#dc2626" strokeWidth="3" markerEnd="url(#vecR)" strokeDasharray="6,3"
                  initial={{ pathLength: 0 }} animate={{ pathLength: 1 }}
                  transition={{ duration: 0.5, delay: 0.6 }}
                />
                <text
                  x={150 + rx / 2 + 10}
                  y={130 - ry / 2 + 15}
                  fontSize="10" fill="#dc2626" fontWeight="700"
                >
                  R⃗ = V⃗₁ + V⃗₂
                </text>

                {/* Origin dot */}
                <circle cx="150" cy="130" r="3" fill="#dc2626" />
              </>
            )}

            {variant === "decomposition" && (
              <>
                {/* Main vector */}
                <motion.line
                  x1="150" y1="130"
                  x2={150 + v1Mag * Math.cos(toRad(v1Angle))}
                  y2={130 - v1Mag * Math.sin(toRad(v1Angle))}
                  stroke="#4f46e5" strokeWidth="2.5" markerEnd="url(#vec1)"
                  initial={{ pathLength: 0 }} animate={{ pathLength: 1 }}
                  transition={{ duration: 0.5 }}
                />
                <text
                  x={150 + v1Mag * Math.cos(toRad(v1Angle)) / 2 - 20}
                  y={130 - v1Mag * Math.sin(toRad(v1Angle)) / 2 - 10}
                  fontSize="10" fill="#4f46e5" fontWeight="700"
                >
                  F⃗
                </text>

                {/* X component */}
                <motion.line
                  x1="150" y1="130"
                  x2={150 + v1x} y2="130"
                  stroke="#dc2626" strokeWidth="2" markerEnd="url(#vecR)"
                  initial={{ pathLength: 0 }} animate={{ pathLength: 1 }}
                  transition={{ duration: 0.5, delay: 0.3 }}
                />
                <text x={150 + v1x / 2} y="145" textAnchor="middle" fontSize="8" fill="#dc2626" fontWeight="600">
                  Fx = {v1x.toFixed(0)}
                </text>

                {/* Y component */}
                <motion.line
                  x1={150 + v1x} y1="130"
                  x2={150 + v1x} y2={130 - v1y}
                  stroke="#059669" strokeWidth="2" markerEnd="url(#vec2)"
                  initial={{ pathLength: 0 }} animate={{ pathLength: 1 }}
                  transition={{ duration: 0.5, delay: 0.5 }}
                />
                <text
                  x={150 + v1x + 10}
                  y={130 - v1y / 2}
                  fontSize="8" fill="#059669" fontWeight="600"
                >
                  Fy = {v1y.toFixed(0)}
                </text>

                {/* Dashed projections */}
                <line
                  x1="150" y1={130 - v1y}
                  x2={150 + v1x} y2={130 - v1y}
                  stroke="oklch(0.7 0.02 260)" strokeWidth="0.5" strokeDasharray="3,3"
                />
                <line
                  x1={150 + v1x} y1="130"
                  x2={150 + v1x} y2={130 - v1y}
                  stroke="oklch(0.7 0.02 260)" strokeWidth="0.5" strokeDasharray="3,3"
                />

                {/* Angle arc */}
                <path
                  d={`M 175,130 A 25,25 0 0,0 ${150 + 25 * Math.cos(toRad(v1Angle))},${130 - 25 * Math.sin(toRad(v1Angle))}`}
                  fill="none" stroke="#d97706" strokeWidth="1.5"
                />
                <text x="180" y="125" fontSize="8" fill="#d97706" fontWeight="600">α={v1Angle}°</text>

                <circle cx="150" cy="130" r="3" fill="#4f46e5" />
              </>
            )}

            {variant === "projectile" && (
              <>
                {/* Projectile trajectory */}
                <motion.path
                  d={`M 50,200 Q 150,${200 - 120} 250,200`}
                  fill="none" stroke="#4f46e5" strokeWidth="2" strokeDasharray="4,3"
                  initial={{ pathLength: 0 }} animate={{ pathLength: 1 }}
                  transition={{ duration: 1 }}
                />
                {/* Ground */}
                <line x1="30" y1="200" x2="270" y2="200" stroke="oklch(0.7 0.02 260)" strokeWidth="1.5" />
                {/* Launch angle */}
                <path d="M 70,200 A 20,20 0 0,0 65,185" fill="none" stroke="#d97706" strokeWidth="1.5" />
                <text x="80" y="190" fontSize="8" fill="#d97706" fontWeight="600">θ = 45°</text>
                {/* V0 arrow */}
                <line x1="50" y1="200" x2="85" y2="175" stroke="#059669" strokeWidth="2" markerEnd="url(#vec2)" />
                <text x="60" y="170" fontSize="8" fill="#059669" fontWeight="600">v₀</text>
                {/* Height */}
                <line x1="150" y1="200" x2="150" y2="80" stroke="#dc2626" strokeWidth="1" strokeDasharray="3,3" />
                <text x="155" y="140" fontSize="8" fill="#dc2626" fontWeight="600">H_max</text>
                {/* Labels */}
                <text x="50" y="215" fontSize="7" fill="oklch(0.5 0.02 260)">Départ</text>
                <text x="240" y="215" fontSize="7" fill="oklch(0.5 0.02 260)">Arrivée</text>
                <text x="150" y="50" textAnchor="middle" fontSize="8" fill="oklch(0.5 0.02 260)" fontWeight="600">
                  x(t) = v₀cos(θ)·t
                </text>
                <text x="150" y="62" textAnchor="middle" fontSize="8" fill="oklch(0.5 0.02 260)" fontWeight="600">
                  y(t) = v₀sin(θ)·t − ½gt²
                </text>
              </>
            )}
          </svg>
        </div>

        {/* Vector info (addition mode) */}
        {variant === "addition" && (
          <>
            <div className="grid grid-cols-3 gap-2 text-center text-xs">
              <div className="rounded-lg bg-indigo-50 dark:bg-indigo-950/20 p-2 border border-indigo-100 dark:border-indigo-900/30">
                <p className="text-[10px] text-indigo-600">V⃗₁</p>
                <p className="font-mono font-bold text-indigo-700 dark:text-indigo-300">{v1Mag.toFixed(0)} @ {v1Angle}°</p>
              </div>
              <div className="rounded-lg bg-emerald-50 dark:bg-emerald-950/20 p-2 border border-emerald-100 dark:border-emerald-900/30">
                <p className="text-[10px] text-emerald-600">V⃗₂</p>
                <p className="font-mono font-bold text-emerald-700 dark:text-emerald-300">{v2Mag.toFixed(0)} @ {v2Angle}°</p>
              </div>
              <div className="rounded-lg bg-red-50 dark:bg-red-950/20 p-2 border border-red-100 dark:border-red-900/30">
                <p className="text-[10px] text-red-600">R⃗ = V⃗₁+V⃗₂</p>
                <p className="font-mono font-bold text-red-700 dark:text-red-300">{rMag.toFixed(0)} @ {rAngle.toFixed(0)}°</p>
              </div>
            </div>

            {/* Sliders */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-medium text-foreground">|V⃗₁|</label>
                  <span className="text-xs font-mono font-semibold text-indigo-600 bg-indigo-50 dark:bg-indigo-950/30 px-1.5 py-0.5 rounded">{v1Mag}</span>
                </div>
                <Slider min={10} max={120} step={5} value={[v1Mag]} onValueChange={([v]) => setV1Mag(v)} />
                <div className="flex items-center justify-between">
                  <label className="text-xs font-medium text-foreground">θ₁</label>
                  <span className="text-xs font-mono font-semibold text-indigo-600">{v1Angle}°</span>
                </div>
                <Slider min={0} max={360} step={5} value={[v1Angle]} onValueChange={([v]) => setV1Angle(v)} />
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-medium text-foreground">|V⃗₂|</label>
                  <span className="text-xs font-mono font-semibold text-emerald-600 bg-emerald-50 dark:bg-emerald-950/30 px-1.5 py-0.5 rounded">{v2Mag}</span>
                </div>
                <Slider min={10} max={120} step={5} value={[v2Mag]} onValueChange={([v]) => setV2Mag(v)} />
                <div className="flex items-center justify-between">
                  <label className="text-xs font-medium text-foreground">θ₂</label>
                  <span className="text-xs font-mono font-semibold text-emerald-600">{v2Angle}°</span>
                </div>
                <Slider min={0} max={360} step={5} value={[v2Angle]} onValueChange={([v]) => setV2Angle(v)} />
              </div>
            </div>
          </>
        )}

        {variant === "decomposition" && (
          <>
            <div className="grid grid-cols-3 gap-2 text-center text-xs">
              <div className="rounded-lg bg-indigo-50 dark:bg-indigo-950/20 p-2 border border-indigo-100 dark:border-indigo-900/30">
                <p className="text-[10px] text-indigo-600">|F⃗|</p>
                <p className="font-mono font-bold text-indigo-700 dark:text-indigo-300">{v1Mag.toFixed(0)} N</p>
              </div>
              <div className="rounded-lg bg-red-50 dark:bg-red-950/20 p-2 border border-red-100 dark:border-red-900/30">
                <p className="text-[10px] text-red-600">Fx = F·cos(α)</p>
                <p className="font-mono font-bold text-red-700 dark:text-red-300">{v1x.toFixed(1)}</p>
              </div>
              <div className="rounded-lg bg-emerald-50 dark:bg-emerald-950/20 p-2 border border-emerald-100 dark:border-emerald-900/30">
                <p className="text-[10px] text-emerald-600">Fy = F·sin(α)</p>
                <p className="font-mono font-bold text-emerald-700 dark:text-emerald-300">{v1y.toFixed(1)}</p>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-medium text-foreground">|F⃗|</label>
                  <span className="text-xs font-mono font-semibold text-primary">{v1Mag}</span>
                </div>
                <Slider min={10} max={120} step={5} value={[v1Mag]} onValueChange={([v]) => setV1Mag(v)} />
              </div>
              <div className="space-y-1">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-medium text-foreground">α</label>
                  <span className="text-xs font-mono font-semibold text-amber-600">{v1Angle}°</span>
                </div>
                <Slider min={0} max={90} step={1} value={[v1Angle]} onValueChange={([v]) => setV1Angle(v)} />
              </div>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
}
