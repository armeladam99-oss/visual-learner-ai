"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Slider } from "@/components/ui/slider";

interface FreeBodyDiagramProps {
  variant?: "incline" | "fall" | "horizontal";
}

export function FreeBodyDiagram({ variant = "incline" }: FreeBodyDiagramProps) {
  const [mass, setMass] = useState(5);
  const [angle, setAngle] = useState(30);
  const [friction, setFriction] = useState(0.2);

  const g = 9.81;
  const weight = mass * g;
  const normalForce = weight * Math.cos((angle * Math.PI) / 180);
  const parallelForce = weight * Math.sin((angle * Math.PI) / 180);
  const frictionForce = friction * normalForce;
  const netForce = parallelForce - frictionForce;
  const acceleration = netForce / mass;

  return (
    <Card className="border-border/50 bg-card shadow-sm overflow-hidden">
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-semibold flex items-center gap-2">
          <span className="text-lg">🎯</span>
          Diagramme du corps isolé (DCI)
          <Badge variant="secondary" className="text-[10px] ml-auto">
            {variant === "incline" ? "Plan incliné" : variant === "fall" ? "Chute libre" : "Horizontal"}
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="w-full h-52 flex items-center justify-center bg-muted/20 rounded-lg">
          <svg viewBox="0 0 320 200" className="w-full h-full max-w-md">
            {variant === "incline" && (
              <>
                {/* Incline plane */}
                <motion.polygon
                  points={`40,180 280,180 40,${180 - 140 * Math.tan((angle * Math.PI) / 180)}`}
                  fill="oklch(0.93 0.01 250)"
                  stroke="oklch(0.7 0.02 260)"
                  strokeWidth="1.5"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.5 }}
                />

                {/* Object on incline */}
                <motion.g
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, delay: 0.3 }}
                >
                  <rect
                    x={100}
                    y={180 - (60 * Math.tan((angle * Math.PI) / 180) + 10)}
                    width="25"
                    height="25"
                    rx="3"
                    fill="#4f46e5"
                    fillOpacity="0.8"
                    stroke="#4f46e5"
                    strokeWidth="1.5"
                  />
                  <text
                    x={112}
                    y={180 - (60 * Math.tan((angle * Math.PI) / 180) + 10) + 16}
                    textAnchor="middle"
                    fontSize="8"
                    fill="white"
                    fontWeight="600"
                  >
                    m
                  </text>
                </motion.g>

                {/* Weight vector (down) */}
                <motion.g
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.6 }}
                >
                  <defs>
                    <marker id="arrowDown" markerWidth="8" markerHeight="6" refX="4" refY="3" orient="auto">
                      <path d="M0,0 L8,3 L0,6" fill="#dc2626" />
                    </marker>
                    <marker id="arrowUp" markerWidth="8" markerHeight="6" refX="4" refY="3" orient="auto-start-reverse">
                      <path d="M0,0 L8,3 L0,6" fill="#059669" />
                    </marker>
                    <marker id="arrowRight" markerWidth="8" markerHeight="6" refX="4" refY="3" orient="auto">
                      <path d="M0,0 L8,3 L0,6" fill="#d97706" />
                    </marker>
                  </defs>

                  {/* Weight (red, down) */}
                  <line
                    x1="112"
                    y1={180 - (60 * Math.tan((angle * Math.PI) / 180))}
                    x2="112"
                    y2={180 - (60 * Math.tan((angle * Math.PI) / 180)) + 40}
                    stroke="#dc2626"
                    strokeWidth="2"
                    markerEnd="url(#arrowDown)"
                  />
                  <text
                    x="125"
                    y={180 - (60 * Math.tan((angle * Math.PI) / 180)) + 50}
                    fontSize="8"
                    fill="#dc2626"
                    fontWeight="600"
                  >
                    P⃗ = {weight.toFixed(1)}N
                  </text>

                  {/* Normal force (green, perpendicular to incline) */}
                  <line
                    x1="112"
                    y1={180 - (60 * Math.tan((angle * Math.PI) / 180))}
                    x2={112 - 30 * Math.sin((angle * Math.PI) / 180)}
                    y2={180 - (60 * Math.tan((angle * Math.PI) / 180)) - 30 * Math.cos((angle * Math.PI) / 180)}
                    stroke="#059669"
                    strokeWidth="2"
                    markerEnd="url(#arrowUp)"
                  />
                  <text
                    x={112 - 45 * Math.sin((angle * Math.PI) / 180)}
                    y={180 - (60 * Math.tan((angle * Math.PI) / 180)) - 35 * Math.cos((angle * Math.PI) / 180)}
                    fontSize="8"
                    fill="#059669"
                    fontWeight="600"
                  >
                    N⃗ = {normalForce.toFixed(1)}N
                  </text>

                  {/* Friction (amber, along incline) */}
                  <line
                    x1="112"
                    y1={180 - (60 * Math.tan((angle * Math.PI) / 180))}
                    x2={112 + 25 * Math.cos((angle * Math.PI) / 180)}
                    y2={180 - (60 * Math.tan((angle * Math.PI) / 180)) - 25 * Math.sin((angle * Math.PI) / 180)}
                    stroke="#d97706"
                    strokeWidth="2"
                    markerEnd="url(#arrowRight)"
                  />
                  <text
                    x={112 + 30 * Math.cos((angle * Math.PI) / 180)}
                    y={180 - (60 * Math.tan((angle * Math.PI) / 180)) - 28 * Math.sin((angle * Math.PI) / 180)}
                    fontSize="7"
                    fill="#d97706"
                    fontWeight="600"
                  >
                    f⃗ = {frictionForce.toFixed(1)}N
                  </text>

                  {/* Angle arc */}
                  <path
                    d={`M 60,180 A 20,20 0 0,0 ${60 + 20 * Math.cos((angle * Math.PI) / 180)},${180 - 20 * Math.sin((angle * Math.PI) / 180)}`}
                    fill="none"
                    stroke="#6366f1"
                    strokeWidth="1"
                  />
                  <text x="65" y="170" fontSize="8" fill="#6366f1" fontWeight="600">
                    α={angle}°
                  </text>
                </motion.g>
              </>
            )}

            {variant === "fall" && (
              <>
                {/* Falling object */}
                <motion.g
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.3 }}
                >
                  <rect x="140" y="30" width="40" height="40" rx="5" fill="#4f46e5" fillOpacity="0.8" stroke="#4f46e5" strokeWidth="1.5" />
                  <text x="160" y="55" textAnchor="middle" fontSize="10" fill="white" fontWeight="600">m</text>
                </motion.g>

                <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6 }}>
                  {/* Weight (down) */}
                  <line x1="160" y1="70" x2="160" y2="130" stroke="#dc2626" strokeWidth="2.5" markerEnd="url(#arrowDown)" />
                  <text x="175" y="115" fontSize="9" fill="#dc2626" fontWeight="600">P⃗ = mg = {weight.toFixed(1)}N</text>

                  {/* Air resistance (up, small) */}
                  <line x1="160" y1="70" x2="160" y2="85" stroke="#059669" strokeWidth="1.5" markerEnd="url(#arrowUp)" />
                  <text x="175" y="78" fontSize="7" fill="#059669" fontWeight="600">R⃗_air</text>

                  {/* Acceleration arrow */}
                  <line x1="200" y1="50" x2="200" y2="110" stroke="#d97706" strokeWidth="2" strokeDasharray="4,3" markerEnd="url(#arrowDown)" />
                  <text x="210" y="85" fontSize="8" fill="#d97706" fontWeight="600">a⃗ = g</text>

                  {/* Height reference */}
                  <line x1="80" y1="30" x2="80" y2="170" stroke="oklch(0.7 0.02 260)" strokeWidth="0.5" strokeDasharray="3,3" />
                  <text x="70" y="100" fontSize="7" fill="oklch(0.5 0.02 260)" transform="rotate(-90, 70, 100)">h</text>
                </motion.g>
              </>
            )}

            {variant === "horizontal" && (
              <>
                {/* Ground */}
                <motion.line
                  x1="20" y1="120" x2="300" y2="120"
                  stroke="oklch(0.7 0.02 260)" strokeWidth="1.5"
                  initial={{ pathLength: 0 }} animate={{ pathLength: 1 }}
                  transition={{ duration: 0.5 }}
                />
                {/* Hatch marks */}
                {[40, 70, 100, 130, 160, 190, 220, 250, 280].map((x) => (
                  <line key={x} x1={x} y1="120" x2={x - 10} y2="130" stroke="oklch(0.8 0.02 260)" strokeWidth="0.8" />
                ))}

                {/* Object */}
                <motion.g initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5, delay: 0.2 }}>
                  <rect x="130" y="85" width="50" height="35" rx="4" fill="#4f46e5" fillOpacity="0.8" stroke="#4f46e5" strokeWidth="1.5" />
                  <text x="155" y="107" textAnchor="middle" fontSize="10" fill="white" fontWeight="600">m</text>
                </motion.g>

                <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}>
                  {/* Weight (down) */}
                  <line x1="155" y1="120" x2="155" y2="170" stroke="#dc2626" strokeWidth="2" markerEnd="url(#arrowDown)" />
                  <text x="165" y="165" fontSize="8" fill="#dc2626" fontWeight="600">P⃗ = {weight.toFixed(1)}N</text>

                  {/* Normal (up) */}
                  <line x1="155" y1="120" x2="155" y2="70" stroke="#059669" strokeWidth="2" markerEnd="url(#arrowUp)" />
                  <text x="165" y="75" fontSize="8" fill="#059669" fontWeight="600">N⃗ = {normalForce.toFixed(1)}N</text>

                  {/* Applied force (right) */}
                  <line x1="180" y1="102" x2="250" y2="102" stroke="#d97706" strokeWidth="2" markerEnd="url(#arrowRight)" />
                  <text x="215" y="95" fontSize="8" fill="#d97706" fontWeight="600">F⃗_app</text>

                  {/* Friction (left) */}
                  <line x1="130" y1="102" x2="80" y2="102" stroke="#dc2626" strokeWidth="1.5" />
                  <text x="70" y="95" fontSize="7" fill="#dc2626" fontWeight="600">f⃗ = μN</text>
                </motion.g>
              </>
            )}
          </svg>
        </div>

        {/* Calculations */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-center">
          <div className="rounded-lg bg-red-50 dark:bg-red-950/20 p-2 border border-red-100 dark:border-red-900/30">
            <p className="text-[10px] text-red-600 dark:text-red-400">Poids P⃗</p>
            <p className="text-sm font-mono font-bold text-red-700 dark:text-red-300">{weight.toFixed(1)}N</p>
          </div>
          <div className="rounded-lg bg-emerald-50 dark:bg-emerald-950/20 p-2 border border-emerald-100 dark:border-emerald-900/30">
            <p className="text-[10px] text-emerald-600 dark:text-emerald-400">Réaction N⃗</p>
            <p className="text-sm font-mono font-bold text-emerald-700 dark:text-emerald-300">{normalForce.toFixed(1)}N</p>
          </div>
          <div className="rounded-lg bg-amber-50 dark:bg-amber-950/20 p-2 border border-amber-100 dark:border-amber-900/30">
            <p className="text-[10px] text-amber-600 dark:text-amber-400">Frottement f⃗</p>
            <p className="text-sm font-mono font-bold text-amber-700 dark:text-amber-300">{frictionForce.toFixed(1)}N</p>
          </div>
          <div className="rounded-lg bg-indigo-50 dark:bg-indigo-950/20 p-2 border border-indigo-100 dark:border-indigo-900/30">
            <p className="text-[10px] text-indigo-600 dark:text-indigo-400">Accélération a</p>
            <p className="text-sm font-mono font-bold text-indigo-700 dark:text-indigo-300">{acceleration.toFixed(2)}m/s²</p>
          </div>
        </div>

        {/* Sliders */}
        {variant === "incline" && (
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="space-y-1">
              <div className="flex items-center justify-between">
                <label className="text-xs font-medium text-foreground">Masse m</label>
                <span className="text-xs font-mono font-semibold text-primary bg-primary/5 px-1.5 py-0.5 rounded">{mass}kg</span>
              </div>
              <Slider min={1} max={20} step={0.5} value={[mass]} onValueChange={([v]) => setMass(v)} />
            </div>
            <div className="space-y-1">
              <div className="flex items-center justify-between">
                <label className="text-xs font-medium text-foreground">Angle α</label>
                <span className="text-xs font-mono font-semibold text-indigo-600 bg-indigo-50 dark:bg-indigo-950/30 px-1.5 py-0.5 rounded">{angle}°</span>
              </div>
              <Slider min={5} max={80} step={1} value={[angle]} onValueChange={([v]) => setAngle(v)} />
            </div>
            <div className="space-y-1">
              <div className="flex items-center justify-between">
                <label className="text-xs font-medium text-foreground">Coefficient μ</label>
                <span className="text-xs font-mono font-semibold text-amber-600 bg-amber-50 dark:bg-amber-950/30 px-1.5 py-0.5 rounded">{friction}</span>
              </div>
              <Slider min={0} max={1} step={0.05} value={[friction]} onValueChange={([v]) => setFriction(v)} />
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
