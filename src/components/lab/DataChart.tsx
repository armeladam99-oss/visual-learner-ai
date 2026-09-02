"use client";

import { useMemo } from "react";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Cell,
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import type { LabVizSpec } from "@/lib/lab/lab-schema";

// ═══════════════════════════════════════════════════════════════
// 📊 DATA CHART — Analyse de données
// ═══════════════════════════════════════════════════════════════

interface DataChartProps {
  spec: LabVizSpec;
}

const COLORS = ["#6366f1", "#ef4444", "#10b981", "#f59e0b", "#ec4899", "#06b6d4", "#8b5cf6", "#f97316", "#14b8a6", "#e11d48"];

export function DataChart({ spec }: DataChartProps) {
  const p = spec.params as { data: number[]; labels?: string[] };
  const data = p.data || [];
  const labels = p.labels || data.map((_, i) => `${i + 1}`);

  const stats = useMemo(() => {
    if (data.length === 0) return null;
    const sorted = [...data].sort((a, b) => a - b);
    const mean = data.reduce((a, b) => a + b, 0) / data.length;
    const variance = data.reduce((a, b) => a + Math.pow(b - mean, 2), 0) / data.length;
    const median = sorted.length % 2 === 0
      ? (sorted[sorted.length / 2 - 1] + sorted[sorted.length / 2]) / 2
      : sorted[Math.floor(sorted.length / 2)];
    return {
      mean: mean.toFixed(2),
      median: median.toFixed(2),
      stdDev: Math.sqrt(variance).toFixed(2),
      min: sorted[0],
      max: sorted[sorted.length - 1],
      count: data.length,
    };
  }, [data]);

  const chartData = data.map((val, i) => ({
    name: labels[i] || `${i + 1}`,
    value: val,
  }));

  return (
    <Card className="border-cyan-500/20 bg-slate-900/80 overflow-hidden">
      <CardHeader className="pb-2 border-b border-cyan-500/10">
        <CardTitle className="text-sm font-semibold flex items-center gap-2 text-cyan-400">
          📊 {spec.title}
          <Badge variant="secondary" className="text-[10px] bg-cyan-500/10 text-cyan-400">Données</Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="p-4 space-y-3">
        <div className="w-full h-[250px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData} margin={{ top: 10, right: 10, left: 10, bottom: 10 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(148,163,184,0.1)" />
              <XAxis
                dataKey="name"
                stroke="#475569"
                tick={{ fontSize: 10, fill: "#64748b" }}
              />
              <YAxis
                stroke="#475569"
                tick={{ fontSize: 10, fill: "#64748b" }}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: "#1e293b",
                  border: "1px solid #334155",
                  borderRadius: "8px",
                  fontSize: "11px",
                  color: "#e2e8f0",
                }}
              />
              <Bar dataKey="value" radius={[4, 4, 0, 0]} isAnimationActive={false}>
                {chartData.map((_entry, index) => (
                  <Cell key={index} fill={COLORS[index % COLORS.length]} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        {stats && (
          <div className="grid grid-cols-3 gap-2 text-[10px]">
            <div className="rounded-lg bg-slate-800/50 border border-slate-700 p-2">
              <p className="text-slate-400">Moyenne</p>
              <p className="font-mono font-bold text-white">{stats.mean}</p>
            </div>
            <div className="rounded-lg bg-slate-800/50 border border-slate-700 p-2">
              <p className="text-slate-400">Médiane</p>
              <p className="font-mono font-bold text-white">{stats.median}</p>
            </div>
            <div className="rounded-lg bg-slate-800/50 border border-slate-700 p-2">
              <p className="text-slate-400">Écart-type</p>
              <p className="font-mono font-bold text-white">{stats.stdDev}</p>
            </div>
            <div className="rounded-lg bg-slate-800/50 border border-slate-700 p-2">
              <p className="text-slate-400">Min</p>
              <p className="font-mono font-bold text-white">{stats.min}</p>
            </div>
            <div className="rounded-lg bg-slate-800/50 border border-slate-700 p-2">
              <p className="text-slate-400">Max</p>
              <p className="font-mono font-bold text-white">{stats.max}</p>
            </div>
            <div className="rounded-lg bg-slate-800/50 border border-slate-700 p-2">
              <p className="text-slate-400">N</p>
              <p className="font-mono font-bold text-white">{stats.count}</p>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
