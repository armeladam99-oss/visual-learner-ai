"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { InteractiveGraph, GraphExplainer } from "./InteractiveGraph";
import { SignGraph } from "./SignGraph";
import { CircuitDiagram } from "./CircuitDiagram";
import { FreeBodyDiagram } from "./FreeBodyDiagram";
import { MolecularStructure } from "./MolecularStructure";
import { LabEquipment } from "./LabEquipment";
import { VectorDiagram } from "./VectorDiagram";
import { WaveDiagram } from "./WaveDiagram";
import { Card, CardContent } from "@/components/ui/card";

interface VisualRendererProps {
  variant: string;
  subject: "math" | "physics" | "chemistry";
}

function mathData(params: Record<string, number>) {
  const a = params.a ?? 1;
  const b = params.b ?? 0;
  const c = params.c ?? 0;
  const points = [];
  for (let x = -10; x <= 10; x += 0.2) {
    const y = a * x * x + b * x + c;
    if (Math.abs(y) < 100) {
      points.push({ x: Math.round(x * 100) / 100, y: Math.round(y * 100) / 100 });
    }
  }
  return points;
}

function derivativeData(params: Record<string, number>) {
  const a = params.a ?? 1;
  const b = params.b ?? 0;
  const points = [];
  for (let x = -10; x <= 10; x += 0.2) {
    const y = 2 * a * x + b;
    points.push({ x: Math.round(x * 100) / 100, y: Math.round(y * 100) / 100 });
  }
  return points;
}

function mruData() {
  const points = [];
  for (let t = 0; t <= 10; t += 0.2) {
    points.push({ x: t, y: 3 * t });
  }
  return points;
}

function muvData() {
  const points = [];
  for (let t = 0; t <= 10; t += 0.2) {
    points.push({ x: t, y: Math.round(0.5 * 1.5 * t * t * 100) / 100 });
  }
  return points;
}

function mruVelocity() {
  const points = [];
  for (let t = 0; t <= 10; t += 0.2) {
    points.push({ x: t, y: 3 });
  }
  return points;
}

function muvVelocity() {
  const points = [];
  for (let t = 0; t <= 10; t += 0.2) {
    points.push({ x: t, y: Math.round(1.5 * t * 100) / 100 });
  }
  return points;
}

function dosageData() {
  const points = [];
  for (let v = 0; v <= 50; v += 0.5) {
    let pH: number;
    if (v < 24) {
      pH = 2 + (v / 24) * 2;
    } else if (v <= 26) {
      pH = 4 + ((v - 24) / 2) * 6;
    } else {
      pH = 10 + Math.min((v - 26) / 24 * 3, 3);
    }
    points.push({ x: Math.round(v * 100) / 100, y: Math.round(pH * 100) / 100 });
  }
  return points;
}

function dilutionData() {
  const n = 0.05;
  const points = [];
  for (let vAdded = 0; vAdded <= 500; vAdded += 5) {
    const vTotal = (50 + vAdded) / 1000;
    const c = n / vTotal;
    points.push({ x: vAdded, y: Math.round(c * 1000) / 1000 });
  }
  return points;
}

export function VisualRenderer({ variant, subject }: VisualRendererProps) {
  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={variant}
        initial={{ opacity: 0, scale: 0.98 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.98 }}
        transition={{ duration: 0.3 }}
        className="space-y-4"
      >
        {subject === "math" && variant === "parabole" && (
          <>
            <InteractiveGraph
              title="Courbe de f(x) = ax² + bx + c"
              description="Fais glisser les curseurs pour modifier la courbe en temps réel."
              params={[
                { name: "Coefficient a", symbol: "a", min: -3, max: 3, step: 0.1, defaultValue: 1 },
                { name: "Coefficient b", symbol: "b", min: -6, max: 6, step: 0.5, defaultValue: 0 },
                { name: "Constante c", symbol: "c", min: -5, max: 5, step: 0.5, defaultValue: 0 },
              ]}
              computePoints={mathData}
              xLabel="x"
              yLabel="f(x)"
              color="#4f46e5"
            />
            <GraphExplainer
              items={[
                "L'axe horizontal est x, l'axe vertical est f(x).",
                "Le sommet est le point extrémaximum ou extréminimum.",
                "La courbe est symétrique par rapport à x = −b/(2a).",
                "Si a > 0 : parabole ouverte vers le haut (minimum).",
                "Si a < 0 : parabole ouverte vers le bas (maximum).",
              ]}
            />
          </>
        )}

        {subject === "math" && variant === "pente" && (
          <>
            <InteractiveGraph
              title="Évolution de la pente (dérivée)"
              description="La dérivée f'(x) = 2ax + b montre comment la pente de la tangente varie."
              params={[
                { name: "Coefficient a", symbol: "a", min: -3, max: 3, step: 0.1, defaultValue: 1 },
                { name: "Coefficient b", symbol: "b", min: -6, max: 6, step: 0.5, defaultValue: 0 },
              ]}
              computePoints={derivativeData}
              xLabel="x"
              yLabel="f'(x)"
              color="#059669"
            />
            <GraphExplainer
              items={[
                "L'axe horizontal est x, l'axe vertical est f'(x), la pente de la tangente.",
                "Quand f'(x) = 0, la tangente est horizontale : c'est le sommet de la parabole.",
                "Quand f'(x) > 0, f est croissante (la courbe monte).",
                "Quand f'(x) < 0, f est décroissante (la courbe descend).",
              ]}
            />
          </>
        )}

        {subject === "math" && variant === "discriminant" && (
          <>
            <SignGraph
              title="Tableau de signe pour Δ = 4"
              expression="f(x) = x² − 5x + 6 = (x−2)(x−3)"
              entries={[
                { value: "−∞", sign: "+", label: "+∞" },
                { value: "2", sign: "0", label: "0" },
                { value: "]2;3[", sign: "−", label: "< 0" },
                { value: "3", sign: "0", label: "0" },
                { value: "+∞", sign: "+", label: "+∞" },
              ]}
              highlights={[
                { index: 1, color: "amber" },
                { index: 3, color: "amber" },
              ]}
            />
            <Card className="border-border/50 bg-muted/30">
              <CardContent className="p-4 text-xs text-muted-foreground leading-relaxed">
                <p>
                  <strong className="text-foreground">Lecture :</strong> f(x) est positif pour x ∈ ]−∞ ; 2[ ∪ ]3 ; +∞[,
                  nul en x = 2 et x = 3, et négatif pour x ∈ ]2 ; 3[.
                  C&apos;est cohérent avec a = 1 &gt; 0 et Δ &gt; 0 : la parabole coupe l&apos;axe des x en deux points.
                </p>
              </CardContent>
            </Card>
          </>
        )}

        {subject === "math" && variant === "geometrie" && (
          <Card className="border-border/50 bg-card">
            <CardContent className="p-5">
              <div className="w-full h-64 flex items-center justify-center">
                <svg viewBox="0 0 300 240" className="w-full h-full max-w-sm">
                  {/* Axes */}
                  <line x1="30" y1="200" x2="280" y2="200" stroke="oklch(0.7 0.02 260)" strokeWidth="1" />
                  <line x1="150" y1="20" x2="150" y2="220" stroke="oklch(0.7 0.02 260)" strokeWidth="1" />
                  <text x="275" y="215" fontSize="10" fill="oklch(0.55 0.02 260)">x</text>
                  <text x="140" y="25" fontSize="10" fill="oklch(0.55 0.02 260)">y</text>
                  
                  {/* Parabola */}
                  <motion.path
                    d="M 50,190 Q 80,170 100,130 Q 120,80 150,60 Q 180,80 200,130 Q 220,170 250,190"
                    fill="none"
                    stroke="#4f46e5"
                    strokeWidth="2"
                    initial={{ pathLength: 0 }}
                    animate={{ pathLength: 1 }}
                    transition={{ duration: 1.2 }}
                  />
                  
                  {/* Roots */}
                  <motion.circle cx="100" cy="130" r="4" fill="#4f46e5" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.2 }} />
                  <motion.circle cx="200" cy="130" r="4" fill="#4f46e5" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.2 }} />
                  <motion.text x="90" y="125" fontSize="9" fill="#4f46e5" fontWeight="600" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.3 }}>x₁</motion.text>
                  <motion.text x="205" y="125" fontSize="9" fill="#4f46e5" fontWeight="600" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.3 }}>x₂</motion.text>
                  
                  {/* Vertex */}
                  <motion.circle cx="150" cy="60" r="5" fill="#d97706" stroke="white" strokeWidth="2" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.5 }} />
                  <motion.text x="155" y="50" fontSize="9" fill="#d97706" fontWeight="700" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.5 }}>S</motion.text>
                  
                  {/* Axis of symmetry dashed */}
                  <motion.line x1="150" y1="60" x2="150" y2="200" stroke="#d97706" strokeWidth="0.8" strokeDasharray="4,3" initial={{ opacity: 0 }} animate={{ opacity: 0.5 }} transition={{ delay: 1.5 }} />
                  
                  {/* Labels */}
                  <motion.text x="10" y="185" fontSize="8" fill="oklch(0.55 0.02 260)" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.6 }}>x₁ = −b/(2a) − √Δ/(2a)</motion.text>
                  <motion.text x="205" y="185" fontSize="8" fill="oklch(0.55 0.02 260)" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.6 }}>x₂ = −b/(2a) + √Δ/(2a)</motion.text>
                </svg>
              </div>
              <p className="text-xs text-muted-foreground text-center mt-2">
                Géométrie de la parabole : sommet S, racines x₁ et x₂, axe de symétrie
              </p>
            </CardContent>
          </Card>
        )}

        {subject === "math" && variant === "comparaison" && (
          <>
            <Card className="border-border/50 bg-muted/30">
              <CardContent className="p-5 space-y-4">
                <h4 className="text-sm font-semibold text-foreground flex items-center gap-2">
                  <span>📊</span> Comparaison de paraboles
                </h4>
                <p className="text-xs text-muted-foreground">
                  Modification de a pour voir l&apos;effet sur la largeur de la parabole.
                </p>
                <div className="w-full h-64 flex items-center justify-center">
                  <svg viewBox="0 0 300 200" className="w-full h-full max-w-md">
                    <line x1="150" y1="10" x2="150" y2="190" stroke="oklch(0.8 0.02 260)" strokeWidth="1" />
                    <line x1="10" y1="100" x2="290" y2="100" stroke="oklch(0.8 0.02 260)" strokeWidth="1" />
                    
                    {/* a = 0.5 */}
                    <motion.path
                      d="M 30,180 Q 70,150 100,120 Q 120,90 150,75 Q 180,90 200,120 Q 230,150 270,180"
                      fill="none" stroke="#2563eb" strokeWidth="2" opacity={0.6}
                      initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 1 }}
                    />
                    
                    {/* a = 1 */}
                    <motion.path
                      d="M 60,180 Q 85,140 105,100 Q 125,50 150,30 Q 175,50 195,100 Q 215,140 240,180"
                      fill="none" stroke="#4f46e5" strokeWidth="2.5"
                      initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 1, delay: 0.2 }}
                    />
                    
                    {/* a = 2 */}
                    <motion.path
                      d="M 100,180 Q 120,110 135,60 Q 145,30 150,25 Q 155,30 165,60 Q 180,110 200,180"
                      fill="none" stroke="#d97706" strokeWidth="2" opacity={0.7}
                      initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 1, delay: 0.4 }}
                    />
                    
                    {/* Legend */}
                    <circle cx="30" cy="15" r="3" fill="#2563eb" opacity={0.6} />
                    <text x="38" y="18" fontSize="8" fill="oklch(0.5 0.02 260)">a = 0.5</text>
                    <circle cx="110" cy="15" r="3" fill="#4f46e5" />
                    <text x="118" y="18" fontSize="8" fill="oklch(0.5 0.02 260)">a = 1</text>
                    <circle cx="190" cy="15" r="3" fill="#d97706" opacity={0.7} />
                    <text x="198" y="18" fontSize="8" fill="oklch(0.5 0.02 260)">a = 2</text>
                  </svg>
                </div>
              </CardContent>
            </Card>
            <GraphExplainer
              items={[
                "Trois paraboles superposées avec des valeurs différentes de a.",
                "Plus |a| est grand, plus la parabole est étroite (a = 2, courbe orange).",
                "Plus |a| est petit, plus la parabole est large (a = 0.5, courbe bleu clair).",
                "Toutes passent par le sommet commun sur l'axe des y (b = 0, c = 0).",
              ]}
            />
          </>
        )}

        {subject === "physics" && variant === "mruvs-muv" && (
          <>
            <Card className="border-border/50 bg-card p-4">
              <h4 className="text-sm font-semibold text-foreground mb-3 flex items-center gap-2">
                <span>📊</span> Comparaison MRU vs MUV : x(t)
              </h4>
              <div className="w-full h-64">
                <svg viewBox="0 0 400 200" className="w-full h-full">
                  {/* Grid */}
                  <line x1="50" y1="10" x2="50" y2="180" stroke="oklch(0.85 0.01 250)" strokeWidth="0.5" />
                  <line x1="50" y1="180" x2="390" y2="180" stroke="oklch(0.7 0.02 260)" strokeWidth="1" />
                  {[110, 170, 230, 290, 350].map((x) => (
                    <line key={x} x1={x} y1="10" x2={x} y2="180" stroke="oklch(0.92 0.01 250)" strokeWidth="0.5" strokeDasharray="2,4" />
                  ))}
                  {[40, 70, 100, 130, 160].map((y) => (
                    <line key={y} x1="50" y1={y} x2="390" y2={y} stroke="oklch(0.92 0.01 250)" strokeWidth="0.5" strokeDasharray="2,4" />
                  ))}
                  
                  {/* Axes labels */}
                  <text x="385" y="195" fontSize="10" fill="oklch(0.5 0.02 260)" fontWeight="600">t (s)</text>
                  <text x="10" y="10" fontSize="10" fill="oklch(0.5 0.02 260)" fontWeight="600">x (m)</text>
                  
                  {/* MRU: x = 3t (straight line) */}
                  <motion.line
                    x1="50" y1="180" x2="383" y2="80"
                    stroke="#2563eb" strokeWidth="2.5"
                    initial={{ pathLength: 0 }} animate={{ pathLength: 1 }}
                    transition={{ duration: 1 }}
                  />
                  
                  {/* MUV: x = 0.75t² (parabola) */}
                  <motion.path
                    d="M 50,180 Q 100,178 140,168 Q 180,150 220,120 Q 260,80 300,40 Q 330,20 350,10"
                    fill="none" stroke="#059669" strokeWidth="2.5"
                    initial={{ pathLength: 0 }} animate={{ pathLength: 1 }}
                    transition={{ duration: 1.2, delay: 0.3 }}
                  />
                  
                  {/* Legend */}
                  <line x1="60" y1="25" x2="80" y2="25" stroke="#2563eb" strokeWidth="2" />
                  <text x="85" y="28" fontSize="9" fill="oklch(0.5 0.02 260)">MRU (v = 3 m/s)</text>
                  <line x1="60" y1="40" x2="80" y2="40" stroke="#059669" strokeWidth="2" />
                  <text x="85" y="43" fontSize="9" fill="oklch(0.5 0.02 260)">MUV (a = 1.5 m/s²)</text>
                </svg>
              </div>
            </Card>
            <GraphExplainer
              items={[
                "L'axe horizontal représente le temps t en secondes (s).",
                "L'axe vertical représente la position x en mètres (m).",
                "Le MRU (bleu) est une droite : la position augmente proportionnellement au temps.",
                "Le MUV (vert) est une parabole : la position augmente de plus en plus vite.",
                "Au début, le MRU est plus rapide. Puis le MUV dépasse car son accélération fait augmenter la distance de manière quadratique.",
              ]}
            />
          </>
        )}

        {subject === "physics" && variant === "mruvs-muv-v" && (
          <>
            <Card className="border-border/50 bg-card p-4">
              <h4 className="text-sm font-semibold text-foreground mb-3 flex items-center gap-2">
                <span>📊</span> Comparaison MRU vs MUV : v(t)
              </h4>
              <div className="w-full h-64">
                <svg viewBox="0 0 400 200" className="w-full h-full">
                  <line x1="50" y1="10" x2="50" y2="180" stroke="oklch(0.85 0.01 250)" strokeWidth="0.5" />
                  <line x1="50" y1="180" x2="390" y2="180" stroke="oklch(0.7 0.02 260)" strokeWidth="1" />
                  
                  <text x="385" y="195" fontSize="10" fill="oklch(0.5 0.02 260)" fontWeight="600">t (s)</text>
                  <text x="10" y="10" fontSize="10" fill="oklch(0.5 0.02 260)" fontWeight="600">v (m/s)</text>
                  
                  {/* MRU: v = 3 constant */}
                  <motion.line
                    x1="50" y1="120" x2="383" y2="120"
                    stroke="#2563eb" strokeWidth="2.5"
                    initial={{ pathLength: 0 }} animate={{ pathLength: 1 }}
                    transition={{ duration: 1 }}
                  />
                  
                  {/* MUV: v = 1.5t */}
                  <motion.line
                    x1="50" y1="180" x2="383" y2="30"
                    stroke="#059669" strokeWidth="2.5"
                    initial={{ pathLength: 0 }} animate={{ pathLength: 1 }}
                    transition={{ duration: 1, delay: 0.3 }}
                  />
                  
                  <line x1="60" y1="25" x2="80" y2="25" stroke="#2563eb" strokeWidth="2" />
                  <text x="85" y="28" fontSize="9" fill="oklch(0.5 0.02 260)">MRU : v = constante</text>
                  <line x1="60" y1="40" x2="80" y2="40" stroke="#059669" strokeWidth="2" />
                  <text x="85" y="43" fontSize="9" fill="oklch(0.5 0.02 260)">MUV : v = at + v₀</text>
                </svg>
              </div>
            </Card>
            <GraphExplainer
              items={[
                "L'axe horizontal est le temps, l'axe vertical est la vitesse en m/s.",
                "Le MRU (bleu) : vitesse constante → droite horizontale.",
                "Le MUV (vert) : vitesse qui croît linéairement → droite inclinée.",
                "La pente de v(t) dans un MUV donne l'accélération a.",
                "L'intersection des deux droites est le moment où les deux mouvements ont la même vitesse.",
              ]}
            />
          </>
        )}

        {subject === "chemistry" && variant === "dosage" && (
          <>
            <InteractiveGraph
              title="Courbe de dosage acido-basique"
              description="pH en fonction du volume de solution titrante ajoutée."
              params={[]}
              computePoints={() => dosageData()}
              xLabel="V (mL)"
              yLabel="pH"
              xDomain={[0, 50]}
              yDomain={[0, 14]}
              color="#d97706"
              variant="area"
            />
            <GraphExplainer
              items={[
                "L'axe horizontal représente le volume de solution titrante ajoutée (en mL).",
                "L'axe vertical représente le pH de la solution.",
                "Avant le point d'équivalence : le pH reste bas (solution acide).",
                "Au point d'équivalence (environ 25 mL) : le pH monte brutalement → le pH change de 4 à 10 en quelques mL.",
                "Après le point d'équivalence : le pH se stabilise autour de 11 (excès de base).",
                "La zone de brusque variation est le signal du dosage : elle indique la stœchiométrie exacte.",
              ]}
            />
          </>
        )}

        {subject === "chemistry" && variant === "dilution" && (
          <>
            <InteractiveGraph
              title="Courbe de dilution"
              description="Concentration en fonction du volume de solvant ajouté."
              params={[]}
              computePoints={() => dilutionData()}
              xLabel="V ajouté (mL)"
              yLabel="C (mol/L)"
              xDomain={[0, 500]}
              color="#dc2626"
              variant="area"
            />
            <GraphExplainer
              items={[
                "L'axe horizontal est le volume de solvant ajouté en mL.",
                "L'axe vertical est la concentration en mol/L.",
                "La courbe est une hyperbole décroissante : plus on dilue, plus la concentration diminue.",
                "La concentration ne s'annule jamais complètement (toujours > 0).",
                "La relation est C = n / V avec V = V_initial + V_ajouté.",
              ]}
            />
          </>
        )}

        {subject === "physics" && variant === "circuit-series" && (
          <CircuitDiagram variant="series" />
        )}

        {subject === "physics" && variant === "circuit-parallel" && (
          <CircuitDiagram variant="parallel" />
        )}

        {subject === "physics" && variant === "forces-incline" && (
          <FreeBodyDiagram variant="incline" />
        )}

        {subject === "physics" && variant === "forces-fall" && (
          <FreeBodyDiagram variant="fall" />
        )}

        {subject === "physics" && variant === "forces-horizontal" && (
          <FreeBodyDiagram variant="horizontal" />
        )}

        {subject === "physics" && variant === "vectors" && (
          <VectorDiagram variant="addition" />
        )}

        {subject === "physics" && variant === "decomposition" && (
          <VectorDiagram variant="decomposition" />
        )}

        {subject === "physics" && variant === "wave-progressive" && (
          <WaveDiagram variant="progressive" />
        )}

        {subject === "physics" && variant === "wave-stationary" && (
          <WaveDiagram variant="stationary" />
        )}

        {subject === "chemistry" && variant === "molecule-water" && (
          <MolecularStructure molecule="water" />
        )}

        {subject === "chemistry" && variant === "molecule-hcl" && (
          <MolecularStructure molecule="hcl" />
        )}

        {subject === "chemistry" && variant === "molecule-nacl" && (
          <MolecularStructure molecule="nacl" />
        )}

        {subject === "chemistry" && variant === "molecule-co2" && (
          <MolecularStructure molecule="co2" />
        )}

        {subject === "chemistry" && variant === "lab-titration" && (
          <LabEquipment variant="titration" />
        )}

        {subject === "chemistry" && variant === "lab-beaker" && (
          <LabEquipment variant="beaker" />
        )}

        {subject === "chemistry" && variant === "lab-ph" && (
          <LabEquipment variant="ph-meter" />
        )}
      </motion.div>
    </AnimatePresence>
  );
}
