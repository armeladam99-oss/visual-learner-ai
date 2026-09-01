"use client";

import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Slider } from "@/components/ui/slider";

interface WaveDiagramProps {
  variant?: "progressive" | "stationary" | "interference";
}

export function WaveDiagram({ variant = "progressive" }: WaveDiagramProps) {
  const [amplitude, setAmplitude] = useState(40);
  const [frequency, setFrequency] = useState(2);
  const [speed, setSpeed] = useState(1);
  const [phase, setPhase] = useState(0);
  const animRef = useRef<number | null>(null);
  const svgRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    let start: number | null = null;
    const animate = (ts: number) => {
      if (!start) start = ts;
      const elapsed = (ts - start) / 1000;
      setPhase(elapsed * speed * frequency * 2 * Math.PI);
      animRef.current = requestAnimationFrame(animate);
    };
    animRef.current = requestAnimationFrame(animate);
    return () => {
      if (animRef.current) cancelAnimationFrame(animRef.current);
    };
  }, [speed, frequency]);

  const wavelength = 300 / frequency;
  const period = 1 / frequency;
  const k = (2 * Math.PI) / wavelength;
  const omega = 2 * Math.PI * frequency;

  const generateWavePath = (
    offset: number,
    width: number,
    centerY: number,
    amp: number,
    waveK: number,
    wavePhase: number,
    damping = 0
  ) => {
    const points: string[] = [];
    for (let x = 0; x <= width; x += 2) {
      const y = centerY - amp * Math.sin(waveK * x - wavePhase + offset) * (1 - damping * x / width);
      points.push(`${x === 0 ? "M" : "L"} ${x},${y}`);
    }
    return points.join(" ");
  };

  return (
    <Card className="border-border/50 bg-card shadow-sm overflow-hidden">
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-semibold flex items-center gap-2">
          <span className="text-lg">🌊</span>
          Représentation ondulatoire
          <Badge variant="secondary" className="text-[10px] ml-auto">
            {variant === "progressive" ? "Onde progressive" : variant === "stationary" ? "Onde stationnaire" : "Interférences"}
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="w-full h-48 flex items-center justify-center bg-muted/20 rounded-lg">
          <svg ref={svgRef} viewBox="0 0 300 200" className="w-full h-full">
            {/* Grid */}
            <line x1="0" y1="100" x2="300" y2="100" stroke="oklch(0.85 0.01 250)" strokeWidth="0.5" strokeDasharray="4,4" />

            {variant === "progressive" && (
              <>
                {/* Wave */}
                <motion.path
                  d={generateWavePath(0, 300, 100, amplitude, k, phase)}
                  fill="none" stroke="#4f46e5" strokeWidth="2"
                />
                {/* Amplitude markers */}
                <line x1="280" y1="100" x2="280" y2={100 - amplitude} stroke="#dc2626" strokeWidth="1" strokeDasharray="2,2" />
                <text x="285" y={100 - amplitude / 2} fontSize="7" fill="#dc2626" fontWeight="600">A</text>
                {/* Wavelength marker */}
                <line x1="0" y1="170" x2={wavelength} y2="170" stroke="#059669" strokeWidth="1" />
                <line x1="0" y1="165" x2="0" y2="175" stroke="#059669" strokeWidth="1" />
                <line x1={wavelength} y1="165" x2={wavelength} y2="175" stroke="#059669" strokeWidth="1" />
                <text x={wavelength / 2} y="183" textAnchor="middle" fontSize="8" fill="#059669" fontWeight="600">λ</text>
                {/* Propagation arrow */}
                <line x1="50" y1="25" x2="250" y2="25" stroke="#d97706" strokeWidth="1.5" />
                <polygon points="250,25 245,22 245,28" fill="#d97706" />
                <text x="150" y="20" textAnchor="middle" fontSize="8" fill="#d97706" fontWeight="600">Propagation →</text>
              </>
            )}

            {variant === "stationary" && (
              <>
                {/* Stationary wave: superposition of two progressive waves */}
                <motion.path
                  d={generateWavePath(0, 300, 100, amplitude, k, phase)}
                  fill="none" stroke="#4f46e5" strokeWidth="1.5" opacity="0.5"
                />
                <motion.path
                  d={generateWavePath(Math.PI, 300, 100, amplitude, k, phase)}
                  fill="none" stroke="#059669" strokeWidth="1.5" opacity="0.5"
                />
                {/* Resultant */}
                <motion.path
                  d={(() => {
                    const points: string[] = [];
                    for (let x = 0; x <= 300; x += 2) {
                      const y1 = amplitude * Math.sin(k * x - phase);
                      const y2 = amplitude * Math.sin(k * x + phase + Math.PI);
                      const y = 100 - (y1 + y2);
                      points.push(`${x === 0 ? "M" : "L"} ${x},${y}`);
                    }
                    return points.join(" ");
                  })()}
                  fill="none" stroke="#dc2626" strokeWidth="2.5"
                />
                {/* Node markers */}
                {[0, 1, 2, 3].map((i) => (
                  <circle key={i} cx={i * wavelength / 2} cy="100" r="4" fill="none" stroke="#d97706" strokeWidth="1.5" />
                ))}
                <text x="150" y="20" textAnchor="middle" fontSize="8" fill="oklch(0.5 0.02 260)" fontWeight="600">
                  Noeuds (nœuds fixes)
                </text>
              </>
            )}

            {variant === "interference" && (
              <>
                {/* Wave 1 */}
                <motion.path
                  d={generateWavePath(0, 300, 70, amplitude * 0.7, k, phase)}
                  fill="none" stroke="#4f46e5" strokeWidth="1.5" opacity="0.6"
                />
                {/* Wave 2 */}
                <motion.path
                  d={generateWavePath(Math.PI / 3, 300, 130, amplitude * 0.7, k, phase)}
                  fill="none" stroke="#059669" strokeWidth="1.5" opacity="0.6"
                />
                {/* Resultant */}
                <motion.path
                  d={(() => {
                    const points: string[] = [];
                    for (let x = 0; x <= 300; x += 2) {
                      const y1 = amplitude * 0.7 * Math.sin(k * x - phase);
                      const y2 = amplitude * 0.7 * Math.sin(k * x - phase + Math.PI / 3);
                      const y = 100 - (y1 + y2);
                      points.push(`${x === 0 ? "M" : "L"} ${x},${y}`);
                    }
                    return points.join(" ");
                  })()}
                  fill="none" stroke="#dc2626" strokeWidth="2"
                />
                {/* Labels */}
                <line x1="20" y1="35" x2="50" y2="35" stroke="#4f46e5" strokeWidth="2" />
                <text x="55" y="38" fontSize="7" fill="#4f46e5">Onde 1</text>
                <line x1="20" y1="180" x2="50" y2="180" stroke="#059669" strokeWidth="2" />
                <text x="55" y="183" fontSize="7" fill="#059669">Onde 2</text>
                <line x1="20" y1="190" x2="50" y2="190" stroke="#dc2626" strokeWidth="2" />
                <text x="55" y="193" fontSize="7" fill="#dc2626">Résultante</text>
              </>
            )}
          </svg>
        </div>

        {/* Info cards */}
        <div className="grid grid-cols-4 gap-2 text-center text-xs">
          <div className="rounded-lg bg-indigo-50 dark:bg-indigo-950/20 p-2 border border-indigo-100 dark:border-indigo-900/30">
            <p className="text-[10px] text-indigo-600">Amplitude A</p>
            <p className="font-mono font-bold text-indigo-700 dark:text-indigo-300">{amplitude / 10} u</p>
          </div>
          <div className="rounded-lg bg-emerald-50 dark:bg-emerald-950/20 p-2 border border-emerald-100 dark:border-emerald-900/30">
            <p className="text-[10px] text-emerald-600">Fréquence f</p>
            <p className="font-mono font-bold text-emerald-700 dark:text-emerald-300">{frequency} Hz</p>
          </div>
          <div className="rounded-lg bg-amber-50 dark:bg-amber-950/20 p-2 border border-amber-100 dark:border-amber-900/30">
            <p className="text-[10px] text-amber-600">λ (longueur)</p>
            <p className="font-mono font-bold text-amber-700 dark:text-amber-300">{wavelength.toFixed(0)} px</p>
          </div>
          <div className="rounded-lg bg-red-50 dark:bg-red-950/20 p-2 border border-red-100 dark:border-red-900/30">
            <p className="text-[10px] text-red-600">Période T</p>
            <p className="font-mono font-bold text-red-700 dark:text-red-300">{period.toFixed(2)} s</p>
          </div>
        </div>

        {/* Sliders */}
        <div className="grid grid-cols-3 gap-4">
          <div className="space-y-1">
            <div className="flex items-center justify-between">
              <label className="text-xs font-medium text-foreground">Amplitude</label>
              <span className="text-xs font-mono font-semibold text-indigo-600">{amplitude / 10}</span>
            </div>
            <Slider min={5} max={60} step={5} value={[amplitude]} onValueChange={([v]) => setAmplitude(v)} />
          </div>
          <div className="space-y-1">
            <div className="flex items-center justify-between">
              <label className="text-xs font-medium text-foreground">Fréquence</label>
              <span className="text-xs font-mono font-semibold text-emerald-600">{frequency}Hz</span>
            </div>
            <Slider min={1} max={8} step={0.5} value={[frequency]} onValueChange={([v]) => setFrequency(v)} />
          </div>
          <div className="space-y-1">
            <div className="flex items-center justify-between">
              <label className="text-xs font-medium text-foreground">Vitesse</label>
              <span className="text-xs font-mono font-semibold text-amber-600">{speed}</span>
            </div>
            <Slider min={0.1} max={3} step={0.1} value={[speed]} onValueChange={([v]) => setSpeed(v)} />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
