"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";

interface LabEquipmentProps {
  variant?: "titration" | "beaker" | "ph-meter";
}

export function LabEquipment({ variant = "titration" }: LabEquipmentProps) {
  const [volume, setVolume] = useState(0);
  const [isDripping, setIsDripping] = useState(false);

  const computepH = (v: number) => {
    if (v < 24) return 2 + (v / 24) * 2;
    if (v <= 26) return 4 + ((v - 24) / 2) * 6;
    return 10 + Math.min(((v - 26) / 24) * 3, 3);
  };

  const pH = computepH(volume);
  const beakerLevel = Math.min(50 + volume * 0.8, 110);

  const getBeakerColor = (pHVal: number) => {
    if (pHVal < 3) return "#ef4444";
    if (pHVal < 5) return "#f97316";
    if (pHVal < 6.5) return "#eab308";
    if (pHVal < 7.5) return "#22c55e";
    if (pHVal < 9) return "#3b82f6";
    return "#8b5cf6";
  };

  return (
    <Card className="border-border/50 bg-card shadow-sm overflow-hidden">
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-semibold flex items-center gap-2">
          <span className="text-lg">🔬</span>
          Manipulation de laboratoire
          <Badge variant="secondary" className="text-[10px] ml-auto">
            {variant === "titration" ? "Dosage" : variant === "beaker" ? "Fiole" : "pH-mètre"}
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {variant === "titration" && (
          <>
            <div className="w-full h-64 flex items-center justify-center bg-muted/20 rounded-lg">
              <svg viewBox="0 0 300 220" className="w-full h-full max-w-sm">
                {/* Burette stand */}
                <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }}>
                  {/* Stand base */}
                  <rect x="85" y="200" width="60" height="8" rx="2" fill="oklch(0.6 0.02 260)" />
                  {/* Stand vertical */}
                  <rect x="112" y="20" width="6" height="180" fill="oklch(0.6 0.02 260)" />
                  {/* Clamp */}
                  <rect x="105" y="20" width="20" height="4" rx="1" fill="oklch(0.5 0.02 260)" />
                </motion.g>

                {/* Burette */}
                <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}>
                  {/* Burette tube */}
                  <rect x="108" y="25" width="12" height="100" rx="1" fill="none" stroke="oklch(0.6 0.02 260)" strokeWidth="1.5" />
                  {/* Liquid in burette */}
                  <rect
                    x="109"
                    y={25 + (100 - volume * 1.8)}
                    width="10"
                    height={volume * 1.8}
                    fill="#3b82f6"
                    fillOpacity="0.4"
                    rx="1"
                  />
                  {/* Burette tip */}
                  <rect x="110" y="125" width="8" height="15" rx="1" fill="none" stroke="oklch(0.6 0.02 260)" strokeWidth="1" />
                  {/* Stopcock */}
                  <rect x="106" y="128" width="16" height="4" rx="2" fill="#d97706" />

                  {/* Graduation marks */}
                  {[0, 10, 20, 30, 40, 50].map((v, i) => (
                    <g key={i}>
                      <line x1="120" y1={25 + v * 1.8} x2="124" y2={25 + v * 1.8} stroke="oklch(0.5 0.02 260)" strokeWidth="0.5" />
                      <text x="127" y={29 + v * 1.8} fontSize="5" fill="oklch(0.5 0.02 260)">{v}mL</text>
                    </g>
                  ))}
                </motion.g>

                {/* Beaker */}
                <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}>
                  {/* Beaker body */}
                  <path
                    d="M 85,160 L 85,200 Q 85,210 95,210 L 175,210 Q 185,210 185,200 L 185,160"
                    fill="none"
                    stroke="oklch(0.6 0.02 260)"
                    strokeWidth="1.5"
                  />
                  {/* Liquid in beaker */}
                  <motion.path
                    d={`M 87,${beakerLevel + 40} L 87,200 Q 87,208 95,208 L 175,208 Q 183,208 183,200 L 183,${beakerLevel + 40} Z`}
                    fill={getBeakerColor(pH)}
                    fillOpacity="0.4"
                    animate={{ fill: getBeakerColor(pH) }}
                    transition={{ duration: 0.3 }}
                  />
                  {/* Spout */}
                  <path d="M 85,160 L 80,155 L 80,160" fill="none" stroke="oklch(0.6 0.02 260)" strokeWidth="1.5" />

                  {/*滴 falling animation */}
                  {isDripping && volume < 50 && (
                    <motion.circle
                      cx="114"
                      cy="140"
                      r="2"
                      fill="#3b82f6"
                      animate={{ cy: [140, 160], opacity: [1, 0] }}
                      transition={{ duration: 0.5, repeat: Infinity }}
                    />
                  )}
                </motion.g>

                {/* pH display */}
                <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.7 }}>
                  <rect x="200" y="60" width="80" height="50" rx="6" fill="oklch(0.15 0.01 260)" stroke="oklch(0.3 0.02 260)" strokeWidth="1" />
                  <text x="240" y="78" textAnchor="middle" fontSize="7" fill="oklch(0.5 0.02 260)">pH</text>
                  <text x="240" y="100" textAnchor="middle" fontSize="18" fill={getBeakerColor(pH)} fontWeight="700" fontFamily="monospace">
                    {pH.toFixed(1)}
                  </text>
                </motion.g>

                {/* Labels */}
                <text x="114" y="15" textAnchor="middle" fontSize="8" fill="oklch(0.5 0.02 260)" fontWeight="600">Burette (NaOH)</text>
                <text x="135" y="218" textAnchor="middle" fontSize="8" fill="oklch(0.5 0.02 260)" fontWeight="600">Fiole (HCl)</text>
              </svg>
            </div>

            {/* Controls */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <label className="text-xs font-medium text-foreground">Volume NaOH ajouté</label>
                <span className="text-xs font-mono font-semibold text-primary bg-primary/5 px-2 py-0.5 rounded">{volume.toFixed(1)} mL</span>
              </div>
              <Slider min={0} max={50} step={0.5} value={[volume]} onValueChange={([v]) => setVolume(v)} />
              <div className="flex justify-between text-[10px] text-muted-foreground">
                <span>0 mL</span>
                <span className="text-amber-600 font-semibold">Point d&apos;équivalence ~25mL</span>
                <span>50 mL</span>
              </div>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  className="text-xs"
                  onClick={() => { setIsDripping(true); setTimeout(() => { setVolume((v) => Math.min(v + 1, 50)); setIsDripping(false); }, 1000); }}
                  disabled={volume >= 50}
                >
                  💧 Ajouter 1 mL
                </Button>
                <Button variant="outline" size="sm" className="text-xs" onClick={() => setVolume(0)}>
                  🔄 Réinitialiser
                </Button>
              </div>
            </div>

            {/* Info panel */}
            <div className="grid grid-cols-3 gap-2 text-center">
              <div className="rounded-lg bg-muted/30 p-2">
                <p className="text-[10px] text-muted-foreground">pH actuel</p>
                <p className="text-lg font-mono font-bold" style={{ color: getBeakerColor(pH) }}>{pH.toFixed(1)}</p>
              </div>
              <div className="rounded-lg bg-muted/30 p-2">
                <p className="text-[10px] text-muted-foreground">Volume restant</p>
                <p className="text-sm font-mono font-bold text-foreground">{(50 - volume).toFixed(1)} mL</p>
              </div>
              <div className="rounded-lg bg-muted/30 p-2">
                <p className="text-[10px] text-muted-foreground">État</p>
                <p className="text-xs font-semibold" style={{ color: volume < 24 ? "#dc2626" : volume <= 26 ? "#d97706" : "#059669" }}>
                  {volume < 24 ? "Acide" : volume <= 26 ? "Équivalence" : "Basique"}
                </p>
              </div>
            </div>
          </>
        )}

        {variant === "beaker" && (
          <div className="w-full h-48 flex items-center justify-center bg-muted/20 rounded-lg">
            <svg viewBox="0 0 200 180" className="w-full h-full max-w-xs">
              {/* Beaker */}
              <path d="M 50,40 L 50,140 Q 50,160 70,160 L 130,160 Q 150,160 150,140 L 150,40" fill="none" stroke="#4f46e5" strokeWidth="2" />
              <path d="M 50,40 L 40,30" fill="none" stroke="#4f46e5" strokeWidth="2" />
              {/* Liquid */}
              <motion.path
                d="M 52,80 L 52,140 Q 52,158 70,158 L 130,158 Q 148,158 148,140 L 148,80 Z"
                fill="#3b82f6"
                fillOpacity="0.3"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
              />
              {/* Graduation */}
              {[60, 80, 100, 120, 140].map((y, i) => (
                <g key={i}>
                  <line x1="50" y1={y} x2="60" y2={y} stroke="#4f46e5" strokeWidth="0.8" />
                  <text x="65" y={y + 3} fontSize="6" fill="#4f46e5">{(5 - i) * 100}mL</text>
                </g>
              ))}
              <text x="100" y="25" textAnchor="middle" fontSize="10" fill="oklch(0.5 0.02 260)" fontWeight="600">Fiole graduée</text>
            </svg>
          </div>
        )}

        {variant === "ph-meter" && (
          <div className="w-full h-48 flex items-center justify-center bg-muted/20 rounded-lg">
            <svg viewBox="0 0 200 180" className="w-full h-full max-w-xs">
              {/* pH meter body */}
              <rect x="70" y="20" width="60" height="100" rx="8" fill="oklch(0.2 0.01 260)" stroke="oklch(0.3 0.02 260)" strokeWidth="1" />
              {/* Screen */}
              <rect x="80" y="30" width="40" height="30" rx="3" fill="#064e3b" />
              <text x="100" y="50" textAnchor="middle" fontSize="14" fill="#10b981" fontWeight="700" fontFamily="monospace">7.00</text>
              <text x="100" y="60" textAnchor="middle" fontSize="5" fill="#10b981">pH</text>
              {/* Buttons */}
              <circle cx="90" cy="75" r="5" fill="oklch(0.35 0.02 260)" />
              <circle cx="110" cy="75" r="5" fill="oklch(0.35 0.02 260)" />
              {/* Probe */}
              <rect x="95" y="120" width="10" height="50" rx="2" fill="oklch(0.4 0.02 260)" />
              <rect x="97" y="170" width="6" height="8" rx="1" fill="#10b981" />
              {/* Cable */}
              <path d="M 100,120 Q 100,100 100,90" fill="none" stroke="oklch(0.4 0.02 260)" strokeWidth="2" />
              <text x="100" y="15" textAnchor="middle" fontSize="10" fill="oklch(0.5 0.02 260)" fontWeight="600">pH-mètre</text>
            </svg>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
