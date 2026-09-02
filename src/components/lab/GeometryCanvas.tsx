"use client";

import { useMemo, useRef, useCallback } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import type { LabVizSpec } from "@/lib/lab/lab-schema";

// ═══════════════════════════════════════════════════════════════
// 📐 CANVAS DE GÉOMÉTRIE 2D
// ═══════════════════════════════════════════════════════════════

interface GeometryCanvasProps {
  spec: LabVizSpec;
}

// Helper: midpoint of two points
function midpoint(a: [number, number], b: [number, number]): [number, number] {
  return [(a[0] + b[0]) / 2, (a[1] + b[1]) / 2];
}

// Helper: distance
function dist(a: [number, number], b: [number, number]): number {
  return Math.sqrt((b[0] - a[0]) ** 2 + (b[1] - a[1]) ** 2);
}

// Helper: perpendicular bisector points
function mediatricePoints(a: [number, number], b: [number, number], len = 3): [[number, number], [number, number]] {
  const mid = midpoint(a, b);
  const dx = b[0] - a[0];
  const dy = b[1] - a[1];
  const norm = Math.sqrt(dx * dx + dy * dy) || 1;
  const nx = -dy / norm;
  const ny = dx / norm;
  return [
    [mid[0] - nx * len, mid[1] - ny * len],
    [mid[0] + nx * len, mid[1] + ny * len],
  ];
}

// Helper: altitude (hauteur) from point to opposite side
function hauteurPoints(p: [number, number], a: [number, number], b: [number, number]): [number, number] {
  const dx = b[0] - a[0];
  const dy = b[1] - a[1];
  const t = ((p[0] - a[0]) * dx + (p[1] - a[1]) * dy) / (dx * dx + dy * dy);
  return [a[0] + t * dx, a[1] + t * dy];
}

export function GeometryCanvas({ spec }: GeometryCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const p = spec.params as {
    vertices?: [number, number][];
    showMediatrice?: boolean;
    showHauteur?: boolean;
    showBissectrice?: boolean;
    labels?: string[];
  };

  const vertices = p.vertices || [[1, 1], [5, 1], [3, 4]];
  const labels = p.labels || ["A", "B", "C"];
  const showMed = p.showMediatrice ?? false;
  const showHaut = p.showHauteur ?? false;
  const showBiss = p.showBissectrice ?? false;

  const [A, B, C] = vertices;

  const draw = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const W = canvas.width;
    const H = canvas.height;
    ctx.fillStyle = "#0f172a";
    ctx.fillRect(0, 0, W, H);

    // Compute scale to fit
    const xs = vertices.map((v) => v[0]);
    const ys = vertices.map((v) => v[1]);
    const minX = Math.min(...xs) - 1;
    const maxX = Math.max(...xs) + 1;
    const minY = Math.min(...ys) - 1;
    const maxY = Math.max(...ys) + 1;
    const rangeX = maxX - minX;
    const rangeY = maxY - minY;
    const scale = Math.min((W - 80) / rangeX, (H - 80) / rangeY);
    const offX = (W - rangeX * scale) / 2;
    const offY = (H - rangeY * scale) / 2;

    const tx = (x: number) => offX + (x - minX) * scale;
    const ty = (y: number) => H - offY - (y - minY) * scale;

    // Grid
    ctx.strokeStyle = "rgba(148,163,184,0.06)";
    ctx.lineWidth = 0.5;
    for (let x = Math.floor(minX); x <= Math.ceil(maxX); x++) {
      ctx.beginPath();
      ctx.moveTo(tx(x), 0);
      ctx.lineTo(tx(x), H);
      ctx.stroke();
    }
    for (let y = Math.floor(minY); y <= Math.ceil(maxY); y++) {
      ctx.beginPath();
      ctx.moveTo(0, ty(y));
      ctx.lineTo(W, ty(y));
      ctx.stroke();
    }

    // Axes
    ctx.strokeStyle = "rgba(148,163,184,0.2)";
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(0, ty(0));
    ctx.lineTo(W, ty(0));
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(tx(0), 0);
    ctx.lineTo(tx(0), H);
    ctx.stroke();

    // Triangle sides
    ctx.strokeStyle = "#6366f1";
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(tx(A[0]), ty(A[1]));
    ctx.lineTo(tx(B[0]), ty(B[1]));
    ctx.lineTo(tx(C[0]), ty(C[1]));
    ctx.closePath();
    ctx.stroke();

    // Fill triangle lightly
    ctx.fillStyle = "rgba(99,102,241,0.05)";
    ctx.fill();

    // Mediatrice
    if (showMed) {
      const [m1, m2] = mediatricePoints(A, B, 3);
      ctx.strokeStyle = "#f59e0b";
      ctx.lineWidth = 1.5;
      ctx.setLineDash([6, 4]);
      ctx.beginPath();
      ctx.moveTo(tx(m1[0]), ty(m1[1]));
      ctx.lineTo(tx(m2[0]), ty(m2[1]));
      ctx.stroke();
      ctx.setLineDash([]);

      // Mark midpoint
      const mid = midpoint(A, B);
      ctx.fillStyle = "#f59e0b";
      ctx.beginPath();
      ctx.arc(tx(mid[0]), ty(mid[1]), 4, 0, Math.PI * 2);
      ctx.fill();
    }

    // Hauteur
    if (showHaut) {
      const foot = hauteurPoints(C, A, B);
      ctx.strokeStyle = "#ef4444";
      ctx.lineWidth = 1.5;
      ctx.setLineDash([4, 4]);
      ctx.beginPath();
      ctx.moveTo(tx(C[0]), ty(C[1]));
      ctx.lineTo(tx(foot[0]), ty(foot[1]));
      ctx.stroke();
      ctx.setLineDash([]);

      // Right angle mark
      ctx.strokeStyle = "#ef4444";
      ctx.lineWidth = 1;
      const markSize = 0.2;
      const dx = (B[0] - A[0]) / (dist(A, B) || 1);
      const dy = (B[1] - A[1]) / (dist(A, B) || 1);
      ctx.beginPath();
      ctx.moveTo(tx(foot[0] + dx * markSize), ty(foot[1] + dy * markSize));
      ctx.lineTo(tx(foot[0] + dx * markSize - dy * markSize), ty(foot[1] + dy * markSize + dx * markSize));
      ctx.lineTo(tx(foot[0] - dy * markSize), ty(foot[1] + dx * markSize));
      ctx.stroke();

      // Foot point
      ctx.fillStyle = "#ef4444";
      ctx.beginPath();
      ctx.arc(tx(foot[0]), ty(foot[1]), 3, 0, Math.PI * 2);
      ctx.fill();
    }

    // Bissectrice
    if (showBiss) {
      // Bisector of angle A
      const bAB: [number, number] = [(B[0] - A[0]) / (dist(A, B) || 1), (B[1] - A[1]) / (dist(A, B) || 1)];
      const bAC: [number, number] = [(C[0] - A[0]) / (dist(A, C) || 1), (C[1] - A[1]) / (dist(A, C) || 1)];
      const bisDir: [number, number] = [bAB[0] + bAC[0], bAB[1] + bAC[1]];
      const bLen = Math.sqrt(bisDir[0] ** 2 + bisDir[1] ** 2) || 1;
      const bisEnd: [number, number] = [A[0] + (bisDir[0] / bLen) * 4, A[1] + (bisDir[1] / bLen) * 4];

      ctx.strokeStyle = "#10b981";
      ctx.lineWidth = 1.5;
      ctx.setLineDash([4, 3]);
      ctx.beginPath();
      ctx.moveTo(tx(A[0]), ty(A[1]));
      ctx.lineTo(tx(bisEnd[0]), ty(bisEnd[1]));
      ctx.stroke();
      ctx.setLineDash([]);
    }

    // Vertices + labels
    for (let i = 0; i < vertices.length; i++) {
      const [x, y] = vertices[i];
      ctx.fillStyle = "#6366f1";
      ctx.beginPath();
      ctx.arc(tx(x), ty(y), 5, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = "white";
      ctx.lineWidth = 1.5;
      ctx.stroke();

      ctx.fillStyle = "white";
      ctx.font = "bold 14px monospace";
      ctx.textAlign = "center";
      ctx.fillText(labels[i], tx(x), ty(y) - 10);
    }

    // Side lengths
    ctx.font = "11px monospace";
    ctx.fillStyle = "#94a3b8";
    const sides = [
      { a: A, b: B, label: `a = ${dist(A, B).toFixed(2)}` },
      { a: B, b: C, label: `b = ${dist(B, C).toFixed(2)}` },
      { a: A, b: C, label: `c = ${dist(A, C).toFixed(2)}` },
    ];
    for (const s of sides) {
      const mid = midpoint(s.a, s.b);
      ctx.fillText(s.label, tx(mid[0]) + 10, ty(mid[1]));
    }

    // Legend
    ctx.font = "10px sans-serif";
    let ly = 20;
    const legends = [
      { color: "#6366f1", label: "Triangle" },
      ...(showMed ? [{ color: "#f59e0b", label: "Médiatrice" }] : []),
      ...(showHaut ? [{ color: "#ef4444", label: "Hauteur" }] : []),
      ...(showBiss ? [{ color: "#10b981", label: "Bissectrice" }] : []),
    ];
    for (const l of legends) {
      ctx.fillStyle = l.color;
      ctx.fillRect(10, ly - 8, 12, 3);
      ctx.fillStyle = "#94a3b8";
      ctx.fillText(l.label, 28, ly - 4);
      ly += 16;
    }
  }, [vertices, labels, showMed, showHaut, showBiss, A, B, C]);

  // Redraw on first render
  useMemo(() => { draw(); }, [draw]);

  return (
    <Card className="border-emerald-500/20 bg-slate-900/80 overflow-hidden">
      <CardHeader className="pb-2 border-b border-emerald-500/10">
        <CardTitle className="text-sm font-semibold flex items-center gap-2 text-emerald-400">
          📐 {spec.title}
          <Badge variant="secondary" className="text-[10px] bg-emerald-500/10 text-emerald-400">Géométrie</Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="p-4 space-y-3">
        <canvas ref={canvasRef} width={500} height={350} className="w-full rounded-lg" />
        {spec.equations.length > 0 && (
          <div className="rounded-lg bg-emerald-500/5 border border-emerald-500/20 p-2 text-[10px] text-emerald-300 space-y-0.5">
            {spec.equations.map((eq, i) => <p key={i}>{eq}</p>)}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
