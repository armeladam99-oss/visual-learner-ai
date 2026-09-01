"use client";

import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Slider } from "@/components/ui/slider";

interface PolynomialResult {
  delta: number;
  deltaRounded: number;
  x1: number | null;
  x2: number | null;
  xVertex: number;
  yVertex: number;
  axisOfSymmetry: number;
  opensUp: boolean;
  hasRoots: boolean;
  hasDoubleRoot: boolean;
  signPattern: "++" | "+-+" | "+0+" | "-+-" | "-0-" | "--";
}

function computePolynomial(a: number, b: number, c: number): PolynomialResult {
  if (a === 0) {
    return {
      delta: 0,
      deltaRounded: 0,
      x1: null,
      x2: null,
      xVertex: 0,
      yVertex: c,
      axisOfSymmetry: 0,
      opensUp: c >= 0,
      hasRoots: false,
      hasDoubleRoot: false,
      signPattern: "++",
    };
  }

  const delta = b * b - 4 * a * c;
  const deltaRounded = Math.round(delta * 100) / 100;
  const xVertex = -b / (2 * a);
  const yVertex = (4 * a * c - b * b) / (4 * a);
  const opensUp = a > 0;

  let x1: number | null = null;
  let x2: number | null = null;
  let hasRoots = false;
  let hasDoubleRoot = false;

  if (delta > 0) {
    x1 = (-b - Math.sqrt(delta)) / (2 * a);
    x2 = (-b + Math.sqrt(delta)) / (2 * a);
    hasRoots = true;
  } else if (delta === 0) {
    x1 = -b / (2 * a);
    hasDoubleRoot = true;
  }

  let signPattern: PolynomialResult["signPattern"] = "++";
  if (opensUp) {
    if (delta > 0) signPattern = "+-+";
    else if (delta === 0) signPattern = "+0+";
    else signPattern = "++";
  } else {
    if (delta > 0) signPattern = "-+-";
    else if (delta === 0) signPattern = "-0-";
    else signPattern = "--";
  }

  return {
    delta,
    deltaRounded,
    x1,
    x2,
    xVertex: Math.round(xVertex * 1000) / 1000,
    yVertex: Math.round(yVertex * 1000) / 1000,
    axisOfSymmetry: Math.round(xVertex * 1000) / 1000,
    opensUp,
    hasRoots,
    hasDoubleRoot,
    signPattern,
  };
}

function generateGraphData(a: number, b: number, c: number, x1: number | null, x2: number | null) {
  let xMin = -10;
  let xMax = 10;

  if (x1 !== null && x2 !== null) {
    const gap = Math.abs(x2 - x1);
    xMin = Math.min(x1, x2) - gap * 1.5;
    xMax = Math.max(x1, x2) + gap * 1.5;
  } else if (x1 !== null) {
    xMin = x1 - 8;
    xMax = x1 + 8;
  }

  const range = xMax - xMin;
  const step = range / 100;
  const points = [];

  for (let x = xMin; x <= xMax; x += step) {
    const y = a * x * x + b * x + c;
    if (Math.abs(y) < 200) {
      points.push({
        x: Math.round(x * 100) / 100,
        y: Math.round(y * 100) / 100,
      });
    }
  }
  return points;
}

function VariationTable({ result, a, b, c }: { result: PolynomialResult; a: number; b: number; c: number }) {
  const { x1, x2, xVertex, yVertex, opensUp, hasRoots, hasDoubleRoot, delta } = result;

  if (a === 0) {
    return (
      <div className="rounded-lg border border-border/50 bg-muted/20 p-4">
        <p className="text-xs text-muted-foreground text-center">
          a = 0 → fonction linéaire f(x) = {b}x + {c}
        </p>
      </div>
    );
  }

  const fmt = (n: number) => {
    if (Number.isInteger(n)) return n.toString();
    return n.toFixed(2);
  };

  const fmtC = (n: number) => {
    if (n === 0) return "0";
    if (Number.isInteger(n)) return n.toString();
    return n.toFixed(2);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="rounded-xl border border-border/50 bg-card overflow-hidden"
    >
      <div className="px-4 py-3 border-b border-border/30 bg-muted/30">
        <h4 className="text-sm font-semibold text-foreground flex items-center gap-2">
          📋 Tableau de variations
        </h4>
      </div>
      <div className="p-4">
        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead>
              <tr className="border-b border-border/30">
                <th className="text-left py-2 pr-4 font-semibold text-foreground">x</th>
                {hasRoots ? (
                  <>
                    <th className="text-center py-2 px-3 font-semibold text-foreground">−∞</th>
                    <th className="text-center py-2 px-3 font-semibold text-amber-600">{fmt(x1!)}</th>
                    <th className="text-center py-2 px-3 font-semibold text-foreground">+∞</th>
                  </>
                ) : hasDoubleRoot ? (
                  <>
                    <th className="text-center py-2 px-3 font-semibold text-foreground">−∞</th>
                    <th className="text-center py-2 px-3 font-semibold text-amber-600">{fmt(x1!)}</th>
                    <th className="text-center py-2 px-3 font-semibold text-foreground">+∞</th>
                  </>
                ) : (
                  <>
                    <th className="text-center py-2 px-3 font-semibold text-foreground">−∞</th>
                    <th className="text-center py-2 px-3 font-semibold text-foreground">+∞</th>
                  </>
                )}
              </tr>
            </thead>
            <tbody>
              <tr className="border-b border-border/30">
                <td className="py-2 pr-4 font-semibold text-foreground">f&apos;(x)</td>
                {hasRoots ? (
                  <>
                    <td className="text-center py-2 px-3 font-mono" style={{ color: opensUp ? "#dc2626" : "#059669" }}>
                      {opensUp ? "−" : "+"}
                    </td>
                    <td className="text-center py-2 px-3 font-mono text-amber-600">0</td>
                    <td className="text-center py-2 px-3 font-mono" style={{ color: opensUp ? "#059669" : "#dc2626" }}>
                      {opensUp ? "+" : "−"}
                    </td>
                  </>
                ) : hasDoubleRoot ? (
                  <>
                    <td className="text-center py-2 px-3 font-mono" style={{ color: opensUp ? "#dc2626" : "#059669" }}>
                      {opensUp ? "−" : "+"}
                    </td>
                    <td className="text-center py-2 px-3 font-mono text-amber-600">0</td>
                    <td className="text-center py-2 px-3 font-mono" style={{ color: opensUp ? "#dc2626" : "#059669" }}>
                      {opensUp ? "−" : "+"}
                    </td>
                  </>
                ) : (
                  <>
                    <td className="text-center py-2 px-3 font-mono" style={{ color: opensUp ? "#dc2626" : "#059669" }}>
                      {opensUp ? "−" : "+"}
                    </td>
                    <td className="text-center py-2 px-3 font-mono" style={{ color: opensUp ? "#dc2626" : "#059669" }}>
                      {opensUp ? "−" : "+"}
                    </td>
                  </>
                )}
              </tr>
              <tr>
                <td className="py-2 pr-4 font-semibold text-foreground">f(x)</td>
                {hasRoots ? (
                  <>
                    <td className="text-center py-2 px-3 font-mono" style={{ color: opensUp ? "#059669" : "#dc2626" }}>
                      {opensUp ? "+" : "−"}
                    </td>
                    <td className="text-center py-2 px-3 font-mono text-amber-600">0</td>
                    <td className="text-center py-2 px-3 font-mono" style={{ color: opensUp ? "#059669" : "#dc2626" }}>
                      {opensUp ? "+" : "−"}
                    </td>
                  </>
                ) : hasDoubleRoot ? (
                  <>
                    <td className="text-center py-2 px-3 font-mono" style={{ color: opensUp ? "#059669" : "#dc2626" }}>
                      {opensUp ? "+" : "−"}
                    </td>
                    <td className="text-center py-2 px-3 font-mono text-amber-600">0</td>
                    <td className="text-center py-2 px-3 font-mono" style={{ color: opensUp ? "#059669" : "#dc2626" }}>
                      {opensUp ? "+" : "−"}
                    </td>
                  </>
                ) : (
                  <>
                    <td className="text-center py-2 px-3 font-mono" style={{ color: opensUp ? "#059669" : "#dc2626" }}>
                      {opensUp ? "+" : "−"}
                    </td>
                    <td className="text-center py-2 px-3 font-mono" style={{ color: opensUp ? "#059669" : "#dc2626" }}>
                      {opensUp ? "+" : "−"}
                    </td>
                  </>
                )}
              </tr>
            </tbody>
          </table>
        </div>

        {/* Variation arrows */}
        <div className="mt-3 flex items-center justify-center gap-1">
          {hasRoots ? (
            <>
              <span className="text-xs text-muted-foreground">Décroissante</span>
              <span className="text-lg">↘</span>
              <span className="text-amber-600 text-xs font-semibold">min = {fmt(yVertex)}</span>
              <span className="text-lg">↗</span>
              <span className="text-xs text-muted-foreground">Croissante</span>
            </>
          ) : hasDoubleRoot ? (
            <>
              <span className="text-xs text-muted-foreground">Décroissante</span>
              <span className="text-lg">↘</span>
              <span className="text-amber-600 text-xs font-semibold">min = {fmt(yVertex)} (touchant)</span>
              <span className="text-lg">↗</span>
              <span className="text-xs text-muted-foreground">Croissante</span>
            </>
          ) : opensUp ? (
            <>
              <span className="text-xs text-muted-foreground">Décroissante</span>
              <span className="text-lg">↘</span>
              <span className="text-amber-600 text-xs font-semibold">min = {fmt(yVertex)}</span>
              <span className="text-lg">↗</span>
              <span className="text-xs text-muted-foreground">Croissante</span>
            </>
          ) : (
            <>
              <span className="text-xs text-muted-foreground">Croissante</span>
              <span className="text-lg">↗</span>
              <span className="text-amber-600 text-xs font-semibold">max = {fmt(yVertex)}</span>
              <span className="text-lg">↘</span>
              <span className="text-xs text-muted-foreground">Décroissante</span>
            </>
          )}
        </div>
      </div>
    </motion.div>
  );
}

export function PolynomialSolver() {
  const [a, setA] = useState(1);
  const [b, setB] = useState(-2);
  const [c, setC] = useState(1);

  const result = useMemo(() => computePolynomial(a, b, c), [a, b, c]);
  const graphData = useMemo(() => generateGraphData(a, b, c, result.x1, result.x2), [a, b, c, result.x1, result.x2]);

  const CustomTooltip = ({ active, payload }: any) => {
    if (!active || !payload?.length) return null;
    const { x, y } = payload[0].payload;
    return (
      <div className="rounded-lg border border-border/50 bg-card/95 px-3 py-2 shadow-lg backdrop-blur-sm">
        <p className="text-xs font-medium text-muted-foreground">x = {typeof x === "number" ? x.toFixed(2) : x}</p>
        <p className="text-sm font-semibold text-foreground">f(x) = {typeof y === "number" ? y.toFixed(2) : y}</p>
      </div>
    );
  };

  const fmt = (n: number) => {
    if (Number.isInteger(n)) return n.toString();
    return n.toFixed(2);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Card className="border-border/50 bg-card shadow-sm overflow-hidden">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-semibold flex items-center gap-2">
            <span className="text-lg">🧮</span>
            Résolveur de polynôme du 2nd degré
          </CardTitle>
          <p className="text-xs text-muted-foreground">
            Entrez les coefficients a, b, c et observez le graphique, les racines et le tableau de variations.
          </p>
        </CardHeader>
        <CardContent className="space-y-5">
          {/* Formula display */}
          <div className="flex items-center justify-center">
            <div className="rounded-xl bg-primary/5 border border-primary/15 px-6 py-3">
              <code className="text-sm font-mono font-bold text-primary">
                f(x) = {a === 1 ? "" : a === -1 ? "−" : a}x² {b >= 0 ? `+ ${b}` : `− ${Math.abs(b)}`}x {c >= 0 ? `+ ${c}` : `− ${Math.abs(c)}`}
              </code>
            </div>
          </div>

          {/* Sliders */}
          <div className="grid grid-cols-3 gap-4">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-xs font-medium text-foreground">Coefficient a</label>
                <span className="text-xs font-mono font-semibold text-primary bg-primary/5 px-2 py-0.5 rounded">
                  a = {a}
                </span>
              </div>
              <Slider min={-5} max={5} step={0.5} value={[a]} onValueChange={([v]) => setA(v)} />
              <p className="text-[10px] text-muted-foreground text-center">
                {a > 0 ? "↑ Parabole vers le haut" : a < 0 ? "↓ Parabole vers le bas" : "→ Linéaire (a=0)"}
              </p>
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-xs font-medium text-foreground">Coefficient b</label>
                <span className="text-xs font-mono font-semibold text-emerald-600 bg-emerald-50 dark:bg-emerald-950/30 px-2 py-0.5 rounded">
                  b = {b}
                </span>
              </div>
              <Slider min={-10} max={10} step={0.5} value={[b]} onValueChange={([v]) => setB(v)} />
              <p className="text-[10px] text-muted-foreground text-center">
                Décalage horizontal du sommet
              </p>
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-xs font-medium text-foreground">Constante c</label>
                <span className="text-xs font-mono font-semibold text-amber-600 bg-amber-50 dark:bg-amber-950/30 px-2 py-0.5 rounded">
                  c = {c}
                </span>
              </div>
              <Slider min={-10} max={10} step={0.5} value={[c]} onValueChange={([v]) => setC(v)} />
              <p className="text-[10px] text-muted-foreground text-center">
                Ordonnée à l&apos;origine
              </p>
            </div>
          </div>

          {/* Graph */}
          <div className="w-full h-[300px] rounded-lg bg-muted/30 p-2">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={graphData} margin={{ top: 10, right: 20, bottom: 20, left: 10 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="oklch(0.85 0.01 250)" strokeWidth={0.5} />
                <XAxis
                  dataKey="x"
                  type="number"
                  tick={{ fontSize: 11, fill: "oklch(0.55 0.02 260)" }}
                  tickLine={false}
                  axisLine={{ stroke: "oklch(0.8 0.02 260)" }}
                  label={{
                    value: "x",
                    position: "insideBottomRight",
                    offset: -5,
                    style: { fontSize: 12, fontWeight: 600, fill: "oklch(0.4 0.03 260)" },
                  }}
                  allowDataOverflow
                />
                <YAxis
                  type="number"
                  tick={{ fontSize: 11, fill: "oklch(0.55 0.02 260)" }}
                  tickLine={false}
                  axisLine={{ stroke: "oklch(0.8 0.02 260)" }}
                  label={{
                    value: "f(x)",
                    angle: -90,
                    position: "insideLeft",
                    offset: 10,
                    style: { fontSize: 12, fontWeight: 600, fill: "oklch(0.4 0.03 260)" },
                  }}
                  allowDataOverflow
                />
                <Tooltip content={<CustomTooltip />} />
                <ReferenceLine y={0} stroke="oklch(0.7 0.02 260)" strokeWidth={1} />
                <ReferenceLine x={0} stroke="oklch(0.7 0.02 260)" strokeWidth={1} />
                {result.x1 !== null && (
                  <ReferenceLine x={result.x1} stroke="#d97706" strokeDasharray="4 4" strokeWidth={1} />
                )}
                {result.x2 !== null && (
                  <ReferenceLine x={result.x2} stroke="#d97706" strokeDasharray="4 4" strokeWidth={1} />
                )}
                <Line
                  type="monotone"
                  dataKey="y"
                  stroke="#4f46e5"
                  strokeWidth={2.5}
                  dot={false}
                  activeDot={{ r: 5, strokeWidth: 2, fill: "white", stroke: "#4f46e5" }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* Results grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            <div className="rounded-lg bg-muted/30 p-3 text-center border border-border/30">
              <p className="text-[10px] text-muted-foreground mb-1">Discriminant Δ</p>
              <p className="text-lg font-mono font-bold text-primary">{fmt(result.deltaRounded)}</p>
              <p className="text-[10px] mt-1">
                {result.delta > 0 ? (
                  <Badge variant="default" className="text-[9px] bg-emerald-500">Δ &gt; 0</Badge>
                ) : result.delta === 0 ? (
                  <Badge variant="secondary" className="text-[9px]">Δ = 0</Badge>
                ) : (
                  <Badge variant="destructive" className="text-[9px]">Δ &lt; 0</Badge>
                )}
              </p>
            </div>
            <div className="rounded-lg bg-muted/30 p-3 text-center border border-border/30">
              <p className="text-[10px] text-muted-foreground mb-1">Racine x₁</p>
              <p className="text-lg font-mono font-bold text-amber-600">
                {result.x1 !== null ? fmt(result.x1) : "—"}
              </p>
              <p className="text-[10px] text-muted-foreground mt-1">
                {result.hasRoots ? "Racine réelle" : result.hasDoubleRoot ? "Racine double" : "Aucune racine"}
              </p>
            </div>
            <div className="rounded-lg bg-muted/30 p-3 text-center border border-border/30">
              <p className="text-[10px] text-muted-foreground mb-1">Racine x₂</p>
              <p className="text-lg font-mono font-bold text-amber-600">
                {result.x2 !== null ? fmt(result.x2) : "—"}
              </p>
              <p className="text-[10px] text-muted-foreground mt-1">
                {result.hasRoots ? "Racine réelle" : result.hasDoubleRoot ? "Identique à x₁" : "Complexe"}
              </p>
            </div>
            <div className="rounded-lg bg-muted/30 p-3 text-center border border-border/30">
              <p className="text-[10px] text-muted-foreground mb-1">Sommet S</p>
              <p className="text-lg font-mono font-bold text-emerald-600">
                ({fmt(result.xVertex)}, {fmt(result.yVertex)})
              </p>
              <p className="text-[10px] text-muted-foreground mt-1">
                {result.opensUp ? "Minimum" : "Maximum"}
              </p>
            </div>
          </div>

          {/* Demonstrations */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="rounded-xl border border-primary/15 bg-primary/[0.03] p-4 space-y-2"
          >
            <h4 className="text-xs font-semibold text-foreground flex items-center gap-2">
              📝 Démonstration complète
            </h4>
            <div className="space-y-1 text-xs text-muted-foreground leading-relaxed">
              <p>
                <strong className="text-foreground">1. Formule :</strong> f(x) = {a}x² + {b}x + {c}
              </p>
              <p>
                <strong className="text-foreground">2. Discriminant :</strong> Δ = b² − 4ac = ({b})² − 4×({a})×({c}) = {b*b} − {4*a*c} = <strong className="text-primary">{fmt(result.deltaRounded)}</strong>
              </p>
              {result.hasRoots && (
                <p>
                  <strong className="text-foreground">3. Racines :</strong> x₁ = (−{b} − √{fmt(result.deltaRounded)}) / (2×{a}) = <strong className="text-amber-600">{fmt(result.x1!)}</strong>
                  <br />
                  x₂ = (−{b} + √{fmt(result.deltaRounded)}) / (2×{a}) = <strong className="text-amber-600">{fmt(result.x2!)}</strong>
                </p>
              )}
              {result.hasDoubleRoot && (
                <p>
                  <strong className="text-foreground">3. Racine double :</strong> x₀ = −{b} / (2×{a}) = <strong className="text-amber-600">{fmt(result.x1!)}</strong>
                </p>
              )}
              <p>
                <strong className="text-foreground">4. Sommet :</strong> S({fmt(result.xVertex)}, {fmt(result.yVertex)}) — parabole ouverte {result.opensUp ? "vers le haut (a &gt; 0)" : "vers le bas (a &lt; 0)"}
              </p>
              <p>
                <strong className="text-foreground">5. Axe de symétrie :</strong> x = −b/(2a) = {fmt(result.axisOfSymmetry)}
              </p>
            </div>
          </motion.div>

          {/* Variation Table */}
          <VariationTable result={result} a={a} b={b} c={c} />
        </CardContent>
      </Card>
    </motion.div>
  );
}
