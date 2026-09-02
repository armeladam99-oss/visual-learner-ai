"use client";

import { useMemo, useState } from "react";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ReferenceLine,
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { safeEval, generateCurve, type VizRequest } from "@/lib/viz-types";
import {
  ZoomIn,
  ZoomOut,
  Grid3x3,
  RotateCcw,
  Download,
} from "lucide-react";

// ═══════════════════════════════════════════════════════════════
// 📈 PLOT 2D — Graphique de fonctions avec Recharts
// ═══════════════════════════════════════════════════════════════

interface FunctionPlot2DProps {
  viz: VizRequest;
  onModify?: (mods: Partial<VizRequest>) => void;
}

const COLORS = ["#6366f1", "#ef4444", "#10b981", "#f59e0b", "#ec4899", "#06b6d4"];

export function FunctionPlot2D({ viz, onModify }: FunctionPlot2DProps) {
  const exprs: string[] = (viz.params.functions as string[]) || [
    (viz.params as Record<string, string>).expr || "x^2",
  ];
  const labels: string[] = (viz.params.labels as string[]) || exprs.map((_, i) => `f${i > 0 ? String.fromCharCode(8321 + i) : ""}(x)`);
  const colors: string[] = (viz.params.colors as string[]) || COLORS.slice(0, exprs.length);
  const xMin = (viz.params.xMin as number) ?? -10;
  const xMax = (viz.params.xMax as number) ?? 10;

  const [showGrid, setShowGrid] = useState(true);
  const [localXMin, setLocalXMin] = useState(xMin);
  const [localXMax, setLocalXMax] = useState(xMax);

  const data = useMemo(() => {
    const numPoints = 300;
    const step = (localXMax - localXMin) / numPoints;
    const result = [];

    for (let i = 0; i <= numPoints; i++) {
      const x = localXMin + i * step;
      const point: Record<string, number> = { x: Math.round(x * 1000) / 1000 };
      for (let j = 0; j < exprs.length; j++) {
        const y = safeEval(exprs[j], x);
        point[`y${j}`] = isFinite(y) && Math.abs(y) < 1000 ? Math.round(y * 1000) / 1000 : null as unknown as number;
      }
      result.push(point);
    }
    return result;
  }, [exprs, localXMin, localXMax]);

  // Find zeros and extrema
  const analysis = useMemo(() => {
    if (exprs.length !== 1) return null;
    const zeros: number[] = [];
    let minY = Infinity;
    let minX = 0;

    for (let x = localXMin; x <= localXMax; x += 0.05) {
      const y = safeEval(exprs[0], x);
      const yNext = safeEval(exprs[0], x + 0.05);
      if (isFinite(y) && isFinite(yNext) && y * yNext <= 0) {
        zeros.push(Math.round(x * 100) / 100);
      }
      if (isFinite(y) && y < minY) {
        minY = y;
        minX = x;
      }
    }

    return {
      zeros: zeros.slice(0, 6),
      minimum: isFinite(minY) ? { x: Math.round(minX * 100) / 100, y: Math.round(minY * 100) / 100 } : null,
    };
  }, [exprs, localXMin, localXMax]);

  const zoom = (factor: number) => {
    const center = (localXMin + localXMax) / 2;
    const halfRange = ((localXMax - localXMin) / 2) * factor;
    setLocalXMin(center - halfRange);
    setLocalXMax(center + halfRange);
  };

  return (
    <Card className="border-indigo-500/20 bg-slate-900/80 overflow-hidden">
      <CardHeader className="pb-2 border-b border-indigo-500/10">
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm font-semibold flex items-center gap-2 text-indigo-400">
            📈 {viz.title}
            <Badge variant="secondary" className="text-[10px] bg-indigo-500/10 text-indigo-400">
              2D
            </Badge>
          </CardTitle>
          <div className="flex items-center gap-1">
            <Button
              variant="ghost"
              size="sm"
              className="size-7 p-0 text-slate-400 hover:text-white"
              onClick={() => zoom(0.5)}
              title="Zoom +"
            >
              <ZoomIn className="size-3.5" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="size-7 p-0 text-slate-400 hover:text-white"
              onClick={() => zoom(2)}
              title="Zoom −"
            >
              <ZoomOut className="size-3.5" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className={`size-7 p-0 ${showGrid ? "text-indigo-400" : "text-slate-400"} hover:text-white`}
              onClick={() => setShowGrid(!showGrid)}
              title="Grille"
            >
              <Grid3x3 className="size-3.5" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="size-7 p-0 text-slate-400 hover:text-white"
              onClick={() => { setLocalXMin(xMin); setLocalXMax(xMax); }}
              title="Réinitialiser"
            >
              <RotateCcw className="size-3.5" />
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-4 space-y-3">
        {/* Equation display */}
        <div className="flex flex-wrap gap-2">
          {exprs.map((expr, i) => (
            <div
              key={i}
              className="px-3 py-1.5 rounded-lg text-xs font-mono font-bold border"
              style={{
                color: colors[i],
                borderColor: `${colors[i]}33`,
                backgroundColor: `${colors[i]}11`,
              }}
            >
              {labels[i]}(x) = {expr}
            </div>
          ))}
        </div>

        {/* Range input */}
        <div className="flex items-center gap-2 text-[10px] text-slate-400">
          <span>x ∈ [</span>
          <Input
            type="number"
            value={localXMin}
            onChange={(e) => setLocalXMin(parseFloat(e.target.value) || -10)}
            className="w-16 h-6 text-[10px] bg-slate-800 border-slate-700 text-white text-center"
          />
          <span>;</span>
          <Input
            type="number"
            value={localXMax}
            onChange={(e) => setLocalXMax(parseFloat(e.target.value) || 10)}
            className="w-16 h-6 text-[10px] bg-slate-800 border-slate-700 text-white text-center"
          />
          <span>]</span>
        </div>

        {/* Chart */}
        <div className="w-full h-[280px]">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data} margin={{ top: 10, right: 10, left: 10, bottom: 10 }}>
              {showGrid && (
                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke="rgba(148,163,184,0.1)"
                  horizontal
                  vertical
                />
              )}
              <XAxis
                dataKey="x"
                stroke="#475569"
                tick={{ fontSize: 10, fill: "#64748b" }}
                tickLine={{ stroke: "#475569" }}
              />
              <YAxis
                stroke="#475569"
                tick={{ fontSize: 10, fill: "#64748b" }}
                tickLine={{ stroke: "#475569" }}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: "#1e293b",
                  border: "1px solid #334155",
                  borderRadius: "8px",
                  fontSize: "11px",
                  color: "#e2e8f0",
                }}
                labelFormatter={(v) => `x = ${v}`}
                formatter={(value: number, name: string) => [
                  `y = ${value?.toFixed(3)}`,
                  name.startsWith("y0") ? labels[0] : name.startsWith("y1") ? labels[1] : name,
                ]}
              />
              {exprs.length > 1 && (
                <Legend
                  wrapperStyle={{ fontSize: "11px", color: "#94a3b8" }}
                  formatter={(value) => {
                    const idx = parseInt(value.replace("y", ""));
                    return labels[idx] || value;
                  }}
                />
              )}
              {/* x-axis reference line */}
              <ReferenceLine y={0} stroke="rgba(148,163,184,0.3)" strokeWidth={1} />
              {/* y-axis reference line */}
              <ReferenceLine x={0} stroke="rgba(148,163,184,0.3)" strokeWidth={1} />

              {exprs.map((_, i) => (
                <Line
                  key={i}
                  type="monotone"
                  dataKey={`y${i}`}
                  stroke={colors[i]}
                  strokeWidth={2.5}
                  dot={false}
                  connectNulls={false}
                  isAnimationActive={false}
                />
              ))}
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Analysis */}
        {analysis && (
          <div className="grid grid-cols-2 gap-2 text-[10px]">
            {analysis.zeros.length > 0 && (
              <div className="rounded-lg bg-slate-800/50 border border-slate-700 p-2">
                <p className="text-slate-400 mb-1">Zéros :</p>
                <p className="font-mono text-white">
                  x ∈ {"{"} {analysis.zeros.join(", ")} {"}"}
                </p>
              </div>
            )}
            {analysis.minimum && (
              <div className="rounded-lg bg-slate-800/50 border border-slate-700 p-2">
                <p className="text-slate-400 mb-1">Minimum :</p>
                <p className="font-mono text-white">
                  ({analysis.minimum.x}, {analysis.minimum.y})
                </p>
              </div>
            )}
          </div>
        )}

        {/* Equation display */}
        {viz.equations.length > 0 && (
          <div className="rounded-lg bg-indigo-500/5 border border-indigo-500/20 p-2 text-[10px] text-indigo-300 space-y-0.5">
            {viz.equations.map((eq, i) => (
              <p key={i}>{eq}</p>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
