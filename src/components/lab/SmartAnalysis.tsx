"use client";

import React, { useMemo } from "react";
import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { safeEval } from "@/lib/viz-types";

// ═══════════════════════════════════════════════════════════════
// 🧠 SMART ANALYSIS — Analyse mathématique automatique
// ═══════════════════════════════════════════════════════════════

interface AnalysisResult {
  zeros: number[];
  yIntercept: number | null;
  minimum: { x: number; y: number } | null;
  maximum: { x: number; y: number } | null;
  yRange: { min: number; max: number };
  monotonous: { increasing: [number, number][]; decreasing: [number, number][] };
  concavity: { up: [number, number][]; down: [number, number][] };
  inflectionPoints: number[];
  asymptotes: { type: "horizontal" | "vertical"; value: number }[];
}

function analyzeFunction(expr: string, xMin: number, xMax: number): AnalysisResult {
  const step = (xMax - xMin) / 500;
  const points: { x: number; y: number }[] = [];

  for (let x = xMin; x <= xMax; x += step) {
    const y = safeEval(expr, x);
    if (isFinite(y) && Math.abs(y) < 1e6) {
      points.push({ x: Math.round(x * 1000) / 1000, y });
    }
  }

  if (points.length === 0) {
    return {
      zeros: [], yIntercept: null, minimum: null, maximum: null,
      yRange: { min: 0, max: 0 }, monotonous: { increasing: [], decreasing: [] },
      concavity: { up: [], down: [] }, inflectionPoints: [], asymptotes: [],
    };
  }

  // Zeros (sign changes)
  const zeros: number[] = [];
  for (let i = 1; i < points.length; i++) {
    if (points[i - 1].y * points[i].y < 0 && Math.abs(points[i].y) < 5) {
      // Linear interpolation
      const t = points[i - 1].y / (points[i - 1].y - points[i].y);
      const zeroX = points[i - 1].x + t * (points[i].x - points[i - 1].x);
      zeros.push(Math.round(zeroX * 100) / 100);
    }
  }

  // Y-intercept
  const yIntercept = safeEval(expr, 0);

  // Min/Max
  let minVal = Infinity, maxVal = -Infinity;
  let minX = 0, maxX = 0;
  for (const p of points) {
    if (p.y < minVal) { minVal = p.y; minX = p.x; }
    if (p.y > maxVal) { maxVal = p.y; maxX = p.x; }
  }

  // Derivative for monotonicity
  const derivative = (x: number) => {
    const h = 0.0001;
    const y1 = safeEval(expr, x - h);
    const y2 = safeEval(expr, x + h);
    if (isFinite(y1) && isFinite(y2)) return (y2 - y1) / (2 * h);
    return 0;
  };

  const increasing: [number, number][] = [];
  const decreasing: [number, number][] = [];
  let prevDeriv = derivative(points[0].x);
  let segStart = points[0].x;

  for (let i = 1; i < points.length; i++) {
    const d = derivative(points[i].x);
    const wasIncreasing = prevDeriv > 0.01;
    const nowIncreasing = d > 0.01;
    const wasDecreasing = prevDeriv < -0.01;
    const nowDecreasing = d < -0.01;

    if ((wasIncreasing && !nowIncreasing) || (wasDecreasing && !nowDecreasing)) {
      const interval: [number, number] = [Math.round(segStart * 100) / 100, Math.round(points[i].x * 100) / 100];
      if (wasIncreasing) increasing.push(interval);
      else decreasing.push(interval);
      segStart = points[i].x;
    }
    prevDeriv = d;
  }
  // Close last segment
  const lastInterval: [number, number] = [Math.round(segStart * 100) / 100, Math.round(points[points.length - 1].x * 100) / 100];
  if (prevDeriv > 0.01) increasing.push(lastInterval);
  else if (prevDeriv < -0.01) decreasing.push(lastInterval);

  // Second derivative for concavity
  const secondDeriv = (x: number) => {
    const h = 0.001;
    const y0 = safeEval(expr, x - h);
    const y1 = safeEval(expr, x);
    const y2 = safeEval(expr, x + h);
    if (isFinite(y0) && isFinite(y1) && isFinite(y2)) return (y2 - 2 * y1 + y0) / (h * h);
    return 0;
  };

  const inflectionPoints: number[] = [];
  let prevSD = secondDeriv(points[0].x);
  for (let i = 1; i < points.length; i++) {
    const sd = secondDeriv(points[i].x);
    if (prevSD * sd < 0 && Math.abs(sd) < 100) {
      inflectionPoints.push(Math.round(points[i].x * 100) / 100);
    }
    prevSD = sd;
  }

  // Asymptotes (vertical — where function diverges)
  const asymptotes: { type: "vertical" | "horizontal"; value: number }[] = [];
  for (let i = 1; i < points.length - 1; i++) {
    if (Math.abs(points[i].y) > 1000 && Math.abs(points[i - 1].y) < 100 && Math.abs(points[i + 1].y) < 100) {
      asymptotes.push({ type: "vertical", value: points[i].x });
    }
  }
  // Horizontal asymptote
  if (points.length > 20) {
    const lastY = points[points.length - 1].y;
    const firstY = points[0].y;
    if (Math.abs(lastY) < 10 && Math.abs(points[points.length - 5].y - lastY) < 0.1) {
      asymptotes.push({ type: "horizontal", value: Math.round(lastY * 100) / 100 });
    }
  }

  return {
    zeros,
    yIntercept: isFinite(yIntercept) ? Math.round(yIntercept * 100) / 100 : null,
    minimum: { x: minX, y: Math.round(minVal * 100) / 100 },
    maximum: { x: maxX, y: Math.round(maxVal * 100) / 100 },
    yRange: { min: Math.round(minVal * 100) / 100, max: Math.round(maxVal * 100) / 100 },
    monotonous: { increasing, decreasing },
    concavity: { up: [], down: [] },
    inflectionPoints,
    asymptotes,
  };
}

// ═══════════════════════════════════════════════════════════════
// 📊 COMPONENT
// ═══════════════════════════════════════════════════════════════

export function SmartAnalysis({ expr, xMin = -10, xMax = 10 }: { expr: string; xMin?: number; xMax?: number }) {
  const analysis = useMemo(() => analyzeFunction(expr, xMin, xMax), [expr, xMin, xMax]);

  return (
    <Card className="border-slate-700/50 bg-slate-900/60 overflow-hidden">
      <CardContent className="p-0">
        {/* Header */}
        <div className="px-4 py-2.5 bg-gradient-to-r from-indigo-500/10 to-violet-500/10 border-b border-slate-700/50">
          <div className="flex items-center gap-2">
            <span className="text-sm">🧠</span>
            <span className="text-xs font-bold text-white">Analyse de f(x) = {expr}</span>
          </div>
        </div>

        <div className="p-3 space-y-2.5 text-[11px]">
          {/* Zeros */}
          {analysis.zeros.length > 0 && (
            <AnalysisRow icon="📍" label="Zéros" color="text-cyan-400">
              {analysis.zeros.map((z, i) => (
                <span key={i} className="inline-flex items-center gap-1 mr-2">
                  <span className="font-mono text-white">{z}</span>
                  <span className="text-slate-500">(f=0)</span>
                </span>
              ))}
            </AnalysisRow>
          )}

          {/* Y-intercept */}
          {analysis.yIntercept !== null && (
            <AnalysisRow icon="📌" label="Ordonnée à l'origine" color="text-indigo-400">
              <span className="font-mono text-white">f(0) = {analysis.yIntercept}</span>
            </AnalysisRow>
          )}

          {/* Minimum */}
          {analysis.minimum && (
            <AnalysisRow icon="📉" label="Minimum" color="text-emerald-400">
              <span className="font-mono text-white">f({analysis.minimum.x}) = {analysis.minimum.y}</span>
            </AnalysisRow>
          )}

          {/* Maximum */}
          {analysis.maximum && (
            <AnalysisRow icon="📈" label="Maximum" color="text-amber-400">
              <span className="font-mono text-white">f({analysis.maximum.x}) = {analysis.maximum.y}</span>
            </AnalysisRow>
          )}

          {/* Monotonicity */}
          {analysis.monotonous.increasing.length > 0 && (
            <AnalysisRow icon="⬆️" label="Croissante" color="text-emerald-400">
              {analysis.monotonous.increasing.map((intv, i) => (
                <span key={i} className="font-mono text-white mr-2">[{intv[0]}, {intv[1]}]</span>
              ))}
            </AnalysisRow>
          )}

          {analysis.monotonous.decreasing.length > 0 && (
            <AnalysisRow icon="⬇️" label="Décroissante" color="text-red-400">
              {analysis.monotonous.decreasing.map((intv, i) => (
                <span key={i} className="font-mono text-white mr-2">[{intv[0]}, {intv[1]}]</span>
              ))}
            </AnalysisRow>
          )}

          {/* Inflection points */}
          {analysis.inflectionPoints.length > 0 && (
            <AnalysisRow icon="🔄" label="Points d'inflexion" color="text-violet-400">
              {analysis.inflectionPoints.slice(0, 5).map((ip, i) => (
                <span key={i} className="font-mono text-white mr-2">x={ip}</span>
              ))}
            </AnalysisRow>
          )}

          {/* Asymptotes */}
          {analysis.asymptotes.length > 0 && (
            <AnalysisRow icon="📏" label="Asymptotes" color="text-pink-400">
              {analysis.asymptotes.map((a, i) => (
                <span key={i} className="font-mono text-white mr-2">
                  {a.type === "vertical" ? `x=${a.value}` : `y=${a.value}`}
                </span>
              ))}
            </AnalysisRow>
          )}

          {/* Range */}
          <AnalysisRow icon="📊" label="Étendue" color="text-slate-400">
            <span className="font-mono text-white">[{analysis.yRange.min}, {analysis.yRange.max}]</span>
          </AnalysisRow>
        </div>
      </CardContent>
    </Card>
  );
}

function AnalysisRow({ icon, label, color, children }: { icon: string; label: string; color: string; children: React.ReactNode }) {
  return (
    <motion.div
      initial={{ opacity: 0, x: -5 }}
      animate={{ opacity: 1, x: 0 }}
      className="flex items-start gap-2 py-1"
    >
      <span className="text-xs mt-0.5">{icon}</span>
      <span className={`text-[10px] font-semibold ${color} w-28 flex-shrink-0`}>{label}</span>
      <span className="flex-1 flex flex-wrap">{children}</span>
    </motion.div>
  );
}
