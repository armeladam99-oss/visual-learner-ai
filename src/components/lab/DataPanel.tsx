"use client";

import React, { useMemo, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { safeEval } from "@/lib/viz-types";
import { Copy, Check } from "lucide-react";

// ═══════════════════════════════════════════════════════════════
// 📊 DATA PANEL — Tableau de données intelligent
// ═══════════════════════════════════════════════════════════════

interface DataPoint {
  x: number;
  values: { label: string; y: number; color: string }[];
}

export function DataPanel({
  expressions,
  labels,
  colors,
  xMin = -5,
  xMax = 5,
  numPoints = 11,
}: {
  expressions: string[];
  labels: string[];
  colors: string[];
  xMin?: number;
  xMax?: number;
  numPoints?: number;
}) {
  const [copied, setCopied] = useState(false);

  const tableData = useMemo(() => {
    const step = (xMax - xMin) / (numPoints - 1);
    const data: DataPoint[] = [];
    for (let i = 0; i < numPoints; i++) {
      const x = Math.round((xMin + i * step) * 100) / 100;
      const values = expressions.map((expr, j) => ({
        label: labels[j] || `f${j + 1}`,
        y: Math.round(safeEval(expr, x) * 1000) / 1000,
        color: colors[j] || "#6366f1",
      }));
      data.push({ x, values });
    }
    return data;
  }, [expressions, labels, colors, xMin, xMax, numPoints]);

  const copyToClipboard = () => {
    const header = ["x", ...labels].join("\t");
    const rows = tableData.map((row) => [row.x, ...row.values.map((v) => v.y)].join("\t"));
    navigator.clipboard.writeText([header, ...rows].join("\n"));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <Card className="border-slate-700/50 bg-slate-900/60 overflow-hidden">
      <CardContent className="p-0">
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-2.5 bg-gradient-to-r from-cyan-500/10 to-teal-500/10 border-b border-slate-700/50">
          <div className="flex items-center gap-2">
            <span className="text-sm">📊</span>
            <span className="text-xs font-bold text-white">Tableau de valeurs</span>
          </div>
          <Button variant="ghost" size="sm" className="h-6 px-2 text-[10px]" onClick={copyToClipboard}>
            {copied ? <Check className="size-3 text-emerald-400" /> : <Copy className="size-3" />}
            {copied ? "Copié" : "Copier"}
          </Button>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-[11px]">
            <thead>
              <tr className="border-b border-slate-700/50">
                <th className="px-3 py-2 text-left font-semibold text-slate-400">x</th>
                {labels.map((label, i) => (
                  <th key={i} className="px-3 py-2 text-left font-semibold" style={{ color: colors[i] }}>
                    {label}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {tableData.map((row, i) => {
                // Highlight special points (near zero, near min/max)
                const isSpecial = row.values.some((v) => Math.abs(v.y) < 0.01);
                return (
                  <tr
                    key={i}
                    className={`border-b border-slate-800/50 transition-colors ${
                      isSpecial ? "bg-cyan-500/5" : "hover:bg-slate-800/30"
                    }`}
                  >
                    <td className="px-3 py-1.5 font-mono text-slate-300">{row.x}</td>
                    {row.values.map((v, j) => (
                      <td key={j} className="px-3 py-1.5 font-mono text-white">
                        {isFinite(v.y) ? v.y : "—"}
                        {Math.abs(v.y) < 0.01 && isFinite(v.y) && v.y !== 0 && (
                          <span className="ml-1 text-[9px] text-cyan-400">≈ 0</span>
                        )}
                      </td>
                    ))}
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );
}
