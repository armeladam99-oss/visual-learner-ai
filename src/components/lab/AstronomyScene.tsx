"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Play, Pause, RotateCcw } from "lucide-react";
import type { LabVizSpec } from "@/lib/lab/lab-schema";

// ═══════════════════════════════════════════════════════════════
// 🌌 SCÈNE ASTRONOMIQUE — Système solaire interactif
// ═══════════════════════════════════════════════════════════════

interface AstronomySceneProps {
  spec: LabVizSpec;
}

interface Planet {
  name: string;
  dist: number;
  size: number;
  color: string;
  speed: number;
  angle?: number;
}

export function AstronomyScene({ spec }: AstronomySceneProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animRef = useRef<number>(0);
  const [playing, setPlaying] = useState(true);
  const [speed, setSpeed] = useState(1);
  const [zoom, setZoom] = useState(1);
  const timeRef = useRef(0);

  const planets = (spec.params.planets as Planet[]) || [
    { name: "Mercure", dist: 0.39, size: 0.38, color: "#94a3b8", speed: 47.4 },
    { name: "Vénus", dist: 0.72, size: 0.95, color: "#fbbf24", speed: 35.0 },
    { name: "Terre", dist: 1.0, size: 1.0, color: "#3b82f6", speed: 29.8 },
    { name: "Mars", dist: 1.52, size: 0.53, color: "#ef4444", speed: 24.1 },
    { name: "Jupiter", dist: 5.2, size: 11.2, color: "#d97706", speed: 13.1 },
    { name: "Saturne", dist: 9.54, size: 9.4, color: "#ca8a04", speed: 9.7 },
  ];

  const draw = useCallback((time: number) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const W = canvas.width;
    const H = canvas.height;
    const cx = W / 2;
    const cy = H / 2;

    // Background
    ctx.fillStyle = "#030712";
    ctx.fillRect(0, 0, W, H);

    // Stars
    const starSeed = 42;
    for (let i = 0; i < 200; i++) {
      const sx = ((starSeed * (i + 1) * 7919) % W);
      const sy = ((starSeed * (i + 1) * 6271) % H);
      const brightness = ((i * 31) % 100) / 100;
      ctx.fillStyle = `rgba(255,255,255,${0.1 + brightness * 0.6})`;
      ctx.beginPath();
      ctx.arc(sx, sy, 0.5 + brightness, 0, Math.PI * 2);
      ctx.fill();
    }

    // Scale: map planet distances to canvas pixels
    const maxDist = Math.max(...planets.map((p) => p.dist));
    const scale = ((Math.min(W, H) / 2) - 40) / (maxDist * 1.1) * zoom;

    // Sun
    const sunRadius = 12;
    const sunGrad = ctx.createRadialGradient(cx, cy, 0, cx, cy, sunRadius * 2);
    sunGrad.addColorStop(0, "#fbbf24");
    sunGrad.addColorStop(0.5, "#f59e0b");
    sunGrad.addColorStop(1, "rgba(245,158,11,0)");
    ctx.fillStyle = sunGrad;
    ctx.beginPath();
    ctx.arc(cx, cy, sunRadius * 2, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = "#fbbf24";
    ctx.beginPath();
    ctx.arc(cx, cy, sunRadius, 0, Math.PI * 2);
    ctx.fill();

    // Planets
    for (const planet of planets) {
      const orbitR = planet.dist * scale;
      const angle = ((planet.angle ?? 0) + time * planet.speed * 0.0001) % (2 * Math.PI);

      // Orbit path
      ctx.strokeStyle = "rgba(148,163,184,0.1)";
      ctx.lineWidth = 0.5;
      ctx.beginPath();
      ctx.arc(cx, cy, orbitR, 0, Math.PI * 2);
      ctx.stroke();

      // Planet position
      const px = cx + orbitR * Math.cos(angle);
      const py = cy + orbitR * Math.sin(angle);
      const pRadius = Math.max(2, Math.min(8, planet.size * 2));

      // Planet glow
      const glow = ctx.createRadialGradient(px, py, 0, px, py, pRadius * 2);
      glow.addColorStop(0, planet.color);
      glow.addColorStop(1, "rgba(0,0,0,0)");
      ctx.fillStyle = glow;
      ctx.beginPath();
      ctx.arc(px, py, pRadius * 2, 0, Math.PI * 2);
      ctx.fill();

      // Planet body
      ctx.fillStyle = planet.color;
      ctx.beginPath();
      ctx.arc(px, py, pRadius, 0, Math.PI * 2);
      ctx.fill();

      // Saturn ring
      if (planet.name === "Saturne") {
        ctx.strokeStyle = "rgba(202,138,4,0.5)";
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.ellipse(px, py, pRadius * 2.2, pRadius * 0.6, 0.3, 0, Math.PI * 2);
        ctx.stroke();
      }

      // Label
      ctx.fillStyle = "#94a3b8";
      ctx.font = "9px sans-serif";
      ctx.textAlign = "center";
      ctx.fillText(planet.name, px, py - pRadius - 4);
    }

    // Info panel
    ctx.fillStyle = "rgba(15,23,42,0.85)";
    ctx.fillRect(10, 10, 180, 25);
    ctx.fillStyle = "#94a3b8";
    ctx.font = "10px monospace";
    ctx.fillText(`t = ${(time / 1000).toFixed(1)}s  |  ×${speed}  |  zoom ×${zoom.toFixed(1)}`, 16, 27);
  }, [planets, speed, zoom]);

  useEffect(() => {
    if (!playing) {
      draw(timeRef.current);
      return;
    }
    const start = performance.now();
    const animate = (now: number) => {
      const elapsed = (now - start) * speed + timeRef.current;
      draw(elapsed);
      animRef.current = requestAnimationFrame(animate);
    };
    animRef.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animRef.current);
  }, [playing, speed, draw]);

  return (
    <Card className="border-violet-500/20 bg-slate-900/80 overflow-hidden">
      <CardHeader className="pb-2 border-b border-violet-500/10">
        <CardTitle className="text-sm font-semibold flex items-center gap-2 text-violet-400">
          🌌 {spec.title}
          <Badge variant="secondary" className="text-[10px] bg-violet-500/10 text-violet-400">Astronomie</Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="p-4 space-y-3">
        <canvas ref={canvasRef} width={500} height={350} className="w-full rounded-lg" />

        <div className="flex items-center gap-2">
          <Button variant="ghost" size="sm" className="size-8 p-0 text-slate-400 hover:text-white"
            onClick={() => { timeRef.current = 0; }}>
            <RotateCcw className="size-4" />
          </Button>
          <Button variant="ghost" size="sm" className="size-8 p-0 text-violet-400 hover:text-violet-300"
            onClick={() => setPlaying(!playing)}>
            {playing ? <Pause className="size-4" /> : <Play className="size-4" />}
          </Button>
          <div className="flex-1" />
          <div className="flex items-center gap-2 text-[10px] text-slate-400">
            <span>Vitesse</span>
            <Slider min={0.1} max={5} step={0.1} value={[speed]} onValueChange={([v]) => setSpeed(v)}
              className="w-20 [&_[role=slider]]:bg-violet-500" />
            <span className="font-mono w-8">{speed.toFixed(1)}×</span>
          </div>
          <div className="flex items-center gap-2 text-[10px] text-slate-400">
            <span>Zoom</span>
            <Slider min={0.3} max={3} step={0.1} value={[zoom]} onValueChange={([v]) => setZoom(v)}
              className="w-20 [&_[role=slider]]:bg-violet-500" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
