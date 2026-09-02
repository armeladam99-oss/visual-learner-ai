"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { type VizRequest } from "@/lib/viz-types";
import {
  Play,
  Pause,
  RotateCcw,
  FastForward,
  Rewind,
  Gauge,
} from "lucide-react";

// ═══════════════════════════════════════════════════════════════
// 🎯 SIMULATION PHYSIQUE — Canvas + Graphique + Contrôles
// ═══════════════════════════════════════════════════════════════

interface SimProps {
  viz: VizRequest;
}

// ─── PROJECTILE SIMULATION ───
function ProjectileSim({ viz }: SimProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animRef = useRef<number>(0);
  const [playing, setPlaying] = useState(false);
  const [time, setTime] = useState(0);
  const [speed, setSpeed] = useState(1);
  const timeRef = useRef(0);

  const v0 = (viz.params.v0 as number) || 20;
  const angle = ((viz.params.angle as number) || 45) * (Math.PI / 180);
  const g = (viz.params.g as number) || 9.81;
  const tTotal = (2 * v0 * Math.sin(angle)) / g;
  const R = (v0 * v0 * Math.sin(2 * angle)) / g;
  const H = (v0 * v0 * Math.sin(angle) * Math.sin(angle)) / (2 * g);

  const draw = useCallback(
    (t: number) => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const ctx = canvas.getContext("2d");
      if (!ctx) return;

      const W = canvas.width;
      const Hc = canvas.height;
      const plotX = 50;
      const plotY = 20;
      const plotW = W - 100;
      const plotH = Hc - 60;

      ctx.fillStyle = "#0f172a";
      ctx.fillRect(0, 0, W, Hc);

      // Grid
      ctx.strokeStyle = "rgba(99,102,241,0.08)";
      ctx.lineWidth = 0.5;
      for (let x = 0; x < W; x += 30) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, Hc);
        ctx.stroke();
      }
      for (let y = 0; y < Hc; y += 30) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(W, y);
        ctx.stroke();
      }

      // Axes
      ctx.strokeStyle = "rgba(148,163,184,0.5)";
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(plotX, plotY + plotH);
      ctx.lineTo(plotX + plotW, plotY + plotH);
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(plotX, plotY + plotH);
      ctx.lineTo(plotX, plotY);
      ctx.stroke();

      ctx.fillStyle = "#94a3b8";
      ctx.font = "10px monospace";
      ctx.fillText("y (m)", plotX - 5, plotY - 5);
      ctx.fillText("x (m)", plotX + plotW - 20, plotY + plotH + 15);

      // Trajectory (full)
      ctx.strokeStyle = "rgba(99,102,241,0.3)";
      ctx.lineWidth = 1.5;
      ctx.setLineDash([4, 4]);
      ctx.beginPath();
      for (let ti = 0; ti <= tTotal; ti += tTotal / 100) {
        const x = v0 * Math.cos(angle) * ti;
        const y = v0 * Math.sin(angle) * ti - 0.5 * g * ti * ti;
        const px = plotX + (x / R) * plotW;
        const py = plotY + plotH - (Math.max(0, y) / H) * plotH;
        ti === 0 ? ctx.moveTo(px, py) : ctx.lineTo(px, py);
      }
      ctx.stroke();
      ctx.setLineDash([]);

      // Current trajectory (solid)
      ctx.strokeStyle = "#6366f1";
      ctx.lineWidth = 2.5;
      ctx.beginPath();
      const numPts = Math.min(100, Math.floor((t / tTotal) * 100));
      for (let i = 0; i <= numPts; i++) {
        const ti = (i / 100) * tTotal;
        const x = v0 * Math.cos(angle) * ti;
        const y = v0 * Math.sin(angle) * ti - 0.5 * g * ti * ti;
        const px = plotX + (x / R) * plotW;
        const py = plotY + plotH - (Math.max(0, y) / H) * plotH;
        i === 0 ? ctx.moveTo(px, py) : ctx.lineTo(px, py);
      }
      ctx.stroke();

      // Ball position
      const cx = v0 * Math.cos(angle) * Math.min(t, tTotal);
      const cy = v0 * Math.sin(angle) * Math.min(t, tTotal) - 0.5 * g * Math.min(t, tTotal) * Math.min(t, tTotal);
      const bpx = plotX + (cx / R) * plotW;
      const bpy = plotY + plotH - (Math.max(0, cy) / H) * plotH;

      // Velocity vector
      const vx = v0 * Math.cos(angle);
      const vy = v0 * Math.sin(angle) - g * Math.min(t, tTotal);
      const vScale = 2;
      ctx.strokeStyle = "#10b981";
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(bpx, bpy);
      ctx.lineTo(bpx + vx * vScale, bpy - vy * vScale);
      ctx.stroke();
      // Arrowhead
      const arrowLen = 6;
      const arrowAngle = Math.atan2(-(vy * vScale), vx * vScale);
      ctx.beginPath();
      ctx.moveTo(bpx + vx * vScale, bpy - vy * vScale);
      ctx.lineTo(
        bpx + vx * vScale - arrowLen * Math.cos(arrowAngle - 0.4),
        bpy - vy * vScale + arrowLen * Math.sin(arrowAngle - 0.4)
      );
      ctx.moveTo(bpx + vx * vScale, bpy - vy * vScale);
      ctx.lineTo(
        bpx + vx * vScale - arrowLen * Math.cos(arrowAngle + 0.4),
        bpy - vy * vScale + arrowLen * Math.sin(arrowAngle + 0.4)
      );
      ctx.stroke();

      // Ball
      ctx.fillStyle = "#6366f1";
      ctx.beginPath();
      ctx.arc(bpx, bpy, 6, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = "white";
      ctx.lineWidth = 2;
      ctx.stroke();

      // Data panel
      const tClamped = Math.min(t, tTotal);
      ctx.fillStyle = "rgba(15,23,42,0.9)";
      ctx.fillRect(plotX + plotW - 160, plotY + 5, 155, 55);
      ctx.strokeStyle = "rgba(99,102,241,0.3)";
      ctx.lineWidth = 1;
      ctx.strokeRect(plotX + plotW - 160, plotY + 5, 155, 55);
      ctx.fillStyle = "#94a3b8";
      ctx.font = "9px monospace";
      ctx.fillText(`t = ${tClamped.toFixed(2)} s`, plotX + plotW - 155, plotY + 18);
      ctx.fillText(`x = ${cx.toFixed(1)} m | y = ${Math.max(0, cy).toFixed(1)} m`, plotX + plotW - 155, plotY + 30);
      ctx.fillText(`v = ${Math.sqrt(vx * vx + vy * vy).toFixed(1)} m/s`, plotX + plotW - 155, plotY + 42);
      ctx.fillText(`θ = ${(Math.atan2(vy, vx) * 180 / Math.PI).toFixed(1)}°`, plotX + plotW - 155, plotY + 54);

      // Legend
      ctx.fillStyle = "#6366f1";
      ctx.fillRect(plotX + 5, plotY + 5, 10, 3);
      ctx.fillStyle = "#94a3b8";
      ctx.font = "9px sans-serif";
      ctx.fillText("Trajectoire", plotX + 18, plotY + 9);
      ctx.fillStyle = "#10b981";
      ctx.fillRect(plotX + 5, plotY + 16, 10, 3);
      ctx.fillStyle = "#94a3b8";
      ctx.fillText("Vecteur v⃗", plotX + 18, plotY + 20);
    },
    [v0, angle, g, tTotal, R, H]
  );

  useEffect(() => {
    if (playing) {
      const start = performance.now() - (timeRef.current * 1000) / speed;
      const animate = (now: number) => {
        const elapsed = ((now - start) * speed) / 1000;
        if (elapsed >= tTotal) {
          setTime(tTotal);
          timeRef.current = tTotal;
          setPlaying(false);
          draw(tTotal);
          return;
        }
        setTime(elapsed);
        timeRef.current = elapsed;
        draw(elapsed);
        animRef.current = requestAnimationFrame(animate);
      };
      animRef.current = requestAnimationFrame(animate);
      return () => cancelAnimationFrame(animRef.current);
    } else {
      draw(time);
    }
  }, [playing, speed, draw, time, tTotal]);

  useEffect(() => {
    draw(time);
  }, [draw, time]);

  return (
    <Card className="border-cyan-500/20 bg-slate-900/80 overflow-hidden">
      <CardHeader className="pb-2 border-b border-cyan-500/10">
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm font-semibold flex items-center gap-2 text-cyan-400">
            🎯 {viz.title}
            <Badge variant="secondary" className="text-[10px] bg-cyan-500/10 text-cyan-400">Simulation</Badge>
          </CardTitle>
        </div>
      </CardHeader>
      <CardContent className="p-4 space-y-3">
        <canvas ref={canvasRef} width={600} height={280} className="w-full rounded-lg" />

        {/* Playback controls */}
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            className="size-8 p-0 text-slate-400 hover:text-white"
            onClick={() => { setTime(0); timeRef.current = 0; setPlaying(false); }}
          >
            <RotateCcw className="size-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className="size-8 p-0 text-slate-400 hover:text-white"
            onClick={() => { setTime(Math.max(0, time - 0.5)); timeRef.current = Math.max(0, time - 0.5); }}
          >
            <Rewind className="size-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className="size-8 p-0 text-cyan-400 hover:text-cyan-300"
            onClick={() => setPlaying(!playing)}
          >
            {playing ? <Pause className="size-4" /> : <Play className="size-4" />}
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className="size-8 p-0 text-slate-400 hover:text-white"
            onClick={() => { setTime(Math.min(tTotal, time + 0.5)); timeRef.current = Math.min(tTotal, time + 0.5); }}
          >
            <FastForward className="size-4" />
          </Button>

          {/* Time slider */}
          <div className="flex-1 flex items-center gap-2">
            <Slider
              min={0}
              max={tTotal}
              step={0.01}
              value={[time]}
              onValueChange={([v]) => { setTime(v); timeRef.current = v; }}
              className="[&_[role=slider]]:bg-cyan-500 flex-1"
            />
            <span className="text-[10px] font-mono text-cyan-400 w-16">{time.toFixed(2)}s</span>
          </div>

          {/* Speed */}
          <div className="flex items-center gap-1 text-[10px] text-slate-400">
            <Gauge className="size-3" />
            <select
              value={speed}
              onChange={(e) => setSpeed(parseFloat(e.target.value))}
              className="bg-slate-800 border border-slate-700 rounded px-1 text-[10px] text-white"
            >
              <option value={0.25}>0.25×</option>
              <option value={0.5}>0.5×</option>
              <option value={1}>1×</option>
              <option value={2}>2×</option>
              <option value={4}>4×</option>
            </select>
          </div>
        </div>

        {/* Equations */}
        {viz.equations.length > 0 && (
          <div className="rounded-lg bg-cyan-500/5 border border-cyan-500/20 p-2 text-[10px] text-cyan-300 space-y-0.5">
            {viz.equations.map((eq, i) => (
              <p key={i}>{eq}</p>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}

// ─── PENDULUM SIMULATION ───
function PendulumSim({ viz }: SimProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animRef = useRef<number>(0);
  const [playing, setPlaying] = useState(false);
  const [time, setTime] = useState(0);
  const [speed, setSpeed] = useState(1);
  const timeRef = useRef(0);
  const angleRef = useRef(((viz.params.angle0 as number) || 30) * Math.PI / 180);
  const omegaRef = useRef(0);

  const L = (viz.params.length as number) || 1;
  const g = (viz.params.g as number) || 9.81;
  const T = 2 * Math.PI * Math.sqrt(L / g);
  const omega0 = Math.sqrt(g / L);

  const draw = useCallback(
    (t: number) => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const ctx = canvas.getContext("2d");
      if (!ctx) return;

      const W = canvas.width;
      const Hc = canvas.height;
      const cx = W / 2;
      const pivotY = 40;
      const pendLen = Hc - 100;

      // Theta at time t (damped)
      const theta = angleRef.current * Math.cos(omega0 * t) * Math.exp(-0.02 * t);

      ctx.fillStyle = "#0f172a";
      ctx.fillRect(0, 0, W, Hc);

      // Pivot
      ctx.fillStyle = "#94a3b8";
      ctx.beginPath();
      ctx.arc(cx, pivotY, 4, 0, Math.PI * 2);
      ctx.fill();

      // String
      const bobX = cx + pendLen * Math.sin(theta);
      const bobY = pivotY + pendLen * Math.cos(theta);
      ctx.strokeStyle = "#94a3b8";
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.moveTo(cx, pivotY);
      ctx.lineTo(bobX, bobY);
      ctx.stroke();

      // Bob
      ctx.fillStyle = "#ef4444";
      ctx.beginPath();
      ctx.arc(bobX, bobY, 12, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = "white";
      ctx.lineWidth = 2;
      ctx.stroke();

      // Trace
      ctx.fillStyle = "rgba(99,102,241,0.15)";
      ctx.beginPath();
      ctx.arc(bobX, bobY, 12, 0, Math.PI * 2);
      ctx.fill();

      // Angle arc
      ctx.strokeStyle = "rgba(245,158,11,0.5)";
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.arc(cx, pivotY, 30, Math.PI / 2, Math.PI / 2 - theta, theta > 0);
      ctx.stroke();
      ctx.fillStyle = "#f59e0b";
      ctx.font = "10px monospace";
      ctx.fillText(`θ = ${(theta * 180 / Math.PI).toFixed(1)}°`, cx + 35, pivotY + 15);

      // Theta(t) graph on the right side
      const graphX = W - 180;
      const graphY = 20;
      const graphW = 160;
      const graphH = 80;
      ctx.strokeStyle = "rgba(148,163,184,0.3)";
      ctx.lineWidth = 0.5;
      ctx.strokeRect(graphX, graphY, graphW, graphH);
      ctx.fillStyle = "#94a3b8";
      ctx.font = "8px monospace";
      ctx.fillText("θ(t)", graphX + 2, graphY - 3);

      // Draw theta graph
      ctx.strokeStyle = "#f59e0b";
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      for (let ti = 0; ti <= t; ti += 0.02) {
        const th = angleRef.current * Math.cos(omega0 * ti) * Math.exp(-0.02 * ti);
        const gx = graphX + (ti / (T * 3)) * graphW;
        const gy = graphY + graphH / 2 - (th / (angleRef.current * 1.1)) * (graphH / 2);
        ti === 0 ? ctx.moveTo(gx, gy) : ctx.lineTo(gx, gy);
      }
      ctx.stroke();

      // Data
      ctx.fillStyle = "#94a3b8";
      ctx.font = "10px monospace";
      ctx.fillText(`t = ${t.toFixed(2)}s  |  T = ${T.toFixed(3)}s  |  ω₀ = ${omega0.toFixed(2)} rad/s`, 10, Hc - 10);
    },
    [L, g, T, omega0]
  );

  useEffect(() => {
    if (playing) {
      const start = performance.now() - (timeRef.current * 1000) / speed;
      const maxT = T * 8;
      const animate = (now: number) => {
        const elapsed = ((now - start) * speed) / 1000;
        if (elapsed >= maxT) {
          setTime(maxT);
          timeRef.current = maxT;
          setPlaying(false);
          draw(maxT);
          return;
        }
        setTime(elapsed);
        timeRef.current = elapsed;
        draw(elapsed);
        animRef.current = requestAnimationFrame(animate);
      };
      animRef.current = requestAnimationFrame(animate);
      return () => cancelAnimationFrame(animRef.current);
    } else {
      draw(time);
    }
  }, [playing, speed, draw, time, T]);

  return (
    <Card className="border-amber-500/20 bg-slate-900/80 overflow-hidden">
      <CardHeader className="pb-2 border-b border-amber-500/10">
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm font-semibold flex items-center gap-2 text-amber-400">
            🎡 {viz.title}
            <Badge variant="secondary" className="text-[10px] bg-amber-500/10 text-amber-400">Simulation</Badge>
          </CardTitle>
        </div>
      </CardHeader>
      <CardContent className="p-4 space-y-3">
        <canvas ref={canvasRef} width={600} height={300} className="w-full rounded-lg" />
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="sm" className="size-8 p-0 text-slate-400 hover:text-white"
            onClick={() => { setTime(0); timeRef.current = 0; angleRef.current = ((viz.params.angle0 as number) || 30) * Math.PI / 180; omegaRef.current = 0; setPlaying(false); }}>
            <RotateCcw className="size-4" />
          </Button>
          <Button variant="ghost" size="sm" className="size-8 p-0 text-amber-400 hover:text-amber-300"
            onClick={() => setPlaying(!playing)}>
            {playing ? <Pause className="size-4" /> : <Play className="size-4" />}
          </Button>
          <div className="flex-1" />
          <div className="flex items-center gap-1 text-[10px] text-slate-400">
            <Gauge className="size-3" />
            <select value={speed} onChange={(e) => setSpeed(parseFloat(e.target.value))}
              className="bg-slate-800 border border-slate-700 rounded px-1 text-[10px] text-white">
              <option value={0.25}>0.25×</option>
              <option value={0.5}>0.5×</option>
              <option value={1}>1×</option>
              <option value={2}>2×</option>
            </select>
          </div>
        </div>
        {viz.equations.length > 0 && (
          <div className="rounded-lg bg-amber-500/5 border border-amber-500/20 p-2 text-[10px] text-amber-300 space-y-0.5">
            {viz.equations.map((eq, i) => <p key={i}>{eq}</p>)}
          </div>
        )}
      </CardContent>
    </Card>
  );
}

// ─── ONDE SIMULATION ───
function OndeSim({ viz }: SimProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animRef = useRef<number>(0);
  const [playing, setPlaying] = useState(false);
  const [time, setTime] = useState(0);
  const [speed, setSpeed] = useState(1);
  const timeRef = useRef(0);

  const A = (viz.params.amplitude as number) || 1;
  const f = (viz.params.frequency as number) || 2;
  const v = (viz.params.speed as number) || 5;

  const draw = useCallback(
    (t: number) => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const ctx = canvas.getContext("2d");
      if (!ctx) return;

      const W = canvas.width;
      const Hc = canvas.height;
      const plotY = Hc / 2;

      ctx.fillStyle = "#0f172a";
      ctx.fillRect(0, 0, W, Hc);

      // Axis
      ctx.strokeStyle = "rgba(148,163,184,0.3)";
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(0, plotY);
      ctx.lineTo(W, plotY);
      ctx.stroke();

      // Wave
      ctx.strokeStyle = "#6366f1";
      ctx.lineWidth = 2.5;
      ctx.beginPath();
      for (let x = 0; x < W; x++) {
        const xPos = (x / W) * 20; // 20 meters
        const y = A * Math.sin(2 * Math.PI * f * (xPos / v - t));
        const py = plotY - y * (Hc / 4);
        x === 0 ? ctx.moveTo(x, py) : ctx.lineTo(x, py);
      }
      ctx.stroke();

      // Amplitude lines
      ctx.strokeStyle = "rgba(239,68,68,0.3)";
      ctx.setLineDash([3, 3]);
      ctx.beginPath();
      ctx.moveTo(0, plotY - A * (Hc / 4));
      ctx.lineTo(W, plotY - A * (Hc / 4));
      ctx.moveTo(0, plotY + A * (Hc / 4));
      ctx.lineTo(W, plotY + A * (Hc / 4));
      ctx.stroke();
      ctx.setLineDash([]);

      // Labels
      ctx.fillStyle = "#94a3b8";
      ctx.font = "10px monospace";
      ctx.fillText(`A = ${A} m`, 10, plotY - A * (Hc / 4) - 5);
      ctx.fillText(`t = ${t.toFixed(2)}s | λ = ${(v / f).toFixed(2)}m | f = ${f}Hz`, 10, Hc - 10);
    },
    [A, f, v]
  );

  useEffect(() => {
    if (playing) {
      const start = performance.now() - (timeRef.current * 1000) / speed;
      const animate = (now: number) => {
        const elapsed = ((now - start) * speed) / 1000;
        setTime(elapsed);
        timeRef.current = elapsed;
        draw(elapsed);
        animRef.current = requestAnimationFrame(animate);
      };
      animRef.current = requestAnimationFrame(animate);
      return () => cancelAnimationFrame(animRef.current);
    } else {
      draw(time);
    }
  }, [playing, speed, draw, time]);

  return (
    <Card className="border-blue-500/20 bg-slate-900/80 overflow-hidden">
      <CardHeader className="pb-2 border-b border-blue-500/10">
        <CardTitle className="text-sm font-semibold flex items-center gap-2 text-blue-400">
          🌊 {viz.title}
          <Badge variant="secondary" className="text-[10px] bg-blue-500/10 text-blue-400">Simulation</Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="p-4 space-y-3">
        <canvas ref={canvasRef} width={600} height={200} className="w-full rounded-lg" />
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="sm" className="size-8 p-0 text-slate-400 hover:text-white"
            onClick={() => { setTime(0); timeRef.current = 0; setPlaying(false); }}>
            <RotateCcw className="size-4" />
          </Button>
          <Button variant="ghost" size="sm" className="size-8 p-0 text-blue-400 hover:text-blue-300"
            onClick={() => setPlaying(!playing)}>
            {playing ? <Pause className="size-4" /> : <Play className="size-4" />}
          </Button>
          <div className="flex-1" />
          <div className="flex items-center gap-1 text-[10px] text-slate-400">
            <Gauge className="size-3" />
            <select value={speed} onChange={(e) => setSpeed(parseFloat(e.target.value))}
              className="bg-slate-800 border border-slate-700 rounded px-1 text-[10px] text-white">
              <option value={0.25}>0.25×</option>
              <option value={0.5}>0.5×</option>
              <option value={1}>1×</option>
              <option value={2}>2×</option>
            </select>
          </div>
        </div>
        {viz.equations.length > 0 && (
          <div className="rounded-lg bg-blue-500/5 border border-blue-500/20 p-2 text-[10px] text-blue-300 space-y-0.5">
            {viz.equations.map((eq, i) => <p key={i}>{eq}</p>)}
          </div>
        )}
      </CardContent>
    </Card>
  );
}

// ─── CHUTE LIBRE SIMULATION ───
function ChuteLibreSim({ viz }: SimProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animRef = useRef<number>(0);
  const [playing, setPlaying] = useState(false);
  const [time, setTime] = useState(0);
  const [speed, setSpeed] = useState(1);
  const timeRef = useRef(0);

  const h0 = (viz.params.h0 as number) || 10;
  const g = (viz.params.g as number) || 9.81;
  const tMax = Math.sqrt((2 * h0) / g);

  const draw = useCallback(
    (t: number) => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const ctx = canvas.getContext("2d");
      if (!ctx) return;

      const W = canvas.width;
      const Hc = canvas.height;
      const groundY = Hc - 30;
      const tClamped = Math.min(t, tMax);
      const y = h0 - 0.5 * g * tClamped * tClamped;
      const v = g * tClamped;

      ctx.fillStyle = "#0f172a";
      ctx.fillRect(0, 0, W, Hc);

      // Ground
      ctx.fillStyle = "#1e293b";
      ctx.fillRect(0, groundY, W, 30);

      // Scale
      const scale = (groundY - 30) / h0;
      const ballY = groundY - Math.max(0, y) * scale;

      // Height markers
      ctx.strokeStyle = "rgba(148,163,184,0.2)";
      ctx.setLineDash([3, 3]);
      for (let h = 0; h <= h0; h += 2) {
        const my = groundY - h * scale;
        ctx.beginPath();
        ctx.moveTo(50, my);
        ctx.lineTo(W - 50, my);
        ctx.stroke();
        ctx.fillStyle = "#64748b";
        ctx.font = "9px monospace";
        ctx.fillText(`${h}m`, 20, my + 3);
      }
      ctx.setLineDash([]);

      // Ball
      const ballX = W / 2;
      ctx.fillStyle = "#6366f1";
      ctx.beginPath();
      ctx.arc(ballX, ballY, 14, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = "white";
      ctx.lineWidth = 2;
      ctx.stroke();

      // Velocity arrow
      if (v > 0.1) {
        const arrowLen = Math.min(v * 5, 60);
        ctx.strokeStyle = "#ef4444";
        ctx.lineWidth = 2.5;
        ctx.beginPath();
        ctx.moveTo(ballX + 20, ballY);
        ctx.lineTo(ballX + 20, ballY + arrowLen);
        ctx.stroke();
        // Arrowhead
        ctx.beginPath();
        ctx.moveTo(ballX + 20, ballY + arrowLen);
        ctx.lineTo(ballX + 15, ballY + arrowLen - 8);
        ctx.moveTo(ballX + 20, ballY + arrowLen);
        ctx.lineTo(ballX + 25, ballY + arrowLen - 8);
        ctx.stroke();
        ctx.fillStyle = "#ef4444";
        ctx.font = "10px monospace";
        ctx.fillText(`v = ${v.toFixed(1)} m/s`, ballX + 30, ballY + arrowLen / 2);
      }

      // Data
      ctx.fillStyle = "#94a3b8";
      ctx.font = "11px monospace";
      ctx.fillText(`t = ${tClamped.toFixed(2)}s | y = ${Math.max(0, y).toFixed(2)}m | v = ${v.toFixed(2)}m/s | t_chute = ${tMax.toFixed(2)}s`, 10, 20);
    },
    [h0, g, tMax]
  );

  useEffect(() => {
    if (playing) {
      const start = performance.now() - (timeRef.current * 1000) / speed;
      const animate = (now: number) => {
        const elapsed = ((now - start) * speed) / 1000;
        if (elapsed >= tMax) {
          setTime(tMax);
          timeRef.current = tMax;
          setPlaying(false);
          draw(tMax);
          return;
        }
        setTime(elapsed);
        timeRef.current = elapsed;
        draw(elapsed);
        animRef.current = requestAnimationFrame(animate);
      };
      animRef.current = requestAnimationFrame(animate);
      return () => cancelAnimationFrame(animRef.current);
    } else {
      draw(time);
    }
  }, [playing, speed, draw, time, tMax]);

  return (
    <Card className="border-indigo-500/20 bg-slate-900/80 overflow-hidden">
      <CardHeader className="pb-2 border-b border-indigo-500/10">
        <CardTitle className="text-sm font-semibold flex items-center gap-2 text-indigo-400">
          ⬇️ {viz.title}
          <Badge variant="secondary" className="text-[10px] bg-indigo-500/10 text-indigo-400">Simulation</Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="p-4 space-y-3">
        <canvas ref={canvasRef} width={400} height={300} className="w-full rounded-lg" />
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="sm" className="size-8 p-0 text-slate-400 hover:text-white"
            onClick={() => { setTime(0); timeRef.current = 0; setPlaying(false); }}>
            <RotateCcw className="size-4" />
          </Button>
          <Button variant="ghost" size="sm" className="size-8 p-0 text-indigo-400 hover:text-indigo-300"
            onClick={() => setPlaying(!playing)}>
            {playing ? <Pause className="size-4" /> : <Play className="size-4" />}
          </Button>
          <div className="flex-1" />
          <div className="flex items-center gap-1 text-[10px] text-slate-400">
            <Gauge className="size-3" />
            <select value={speed} onChange={(e) => setSpeed(parseFloat(e.target.value))}
              className="bg-slate-800 border border-slate-700 rounded px-1 text-[10px] text-white">
              <option value={0.25}>0.25×</option>
              <option value={0.5}>0.5×</option>
              <option value={1}>1×</option>
              <option value={2}>2×</option>
            </select>
          </div>
        </div>
        {viz.equations.length > 0 && (
          <div className="rounded-lg bg-indigo-500/5 border border-indigo-500/20 p-2 text-[10px] text-indigo-300 space-y-0.5">
            {viz.equations.map((eq, i) => <p key={i}>{eq}</p>)}
          </div>
        )}
      </CardContent>
    </Card>
  );
}

// ─── DOSAGE SIMULATION ───
function DosageSim({ viz }: SimProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const acidConc = (viz.params.acidConc as number) || 0.1;
  const baseConc = (viz.params.baseConc as number) || 0.1;
  const acidVol = (viz.params.acidVol as number) || 50;
  const eqVol = (acidConc * acidVol) / baseConc;

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const W = canvas.width;
    const Hc = canvas.height;
    ctx.fillStyle = "#0f172a";
    ctx.fillRect(0, 0, W, Hc);

    const plotX = 50;
    const plotY = 20;
    const plotW = W - 100;
    const plotH = Hc - 60;
    const maxV = eqVol * 2;

    // Axes
    ctx.strokeStyle = "rgba(148,163,184,0.5)";
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(plotX, plotY + plotH);
    ctx.lineTo(plotX + plotW, plotY + plotH);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(plotX, plotY);
    ctx.lineTo(plotX, plotY + plotH);
    ctx.stroke();

    ctx.fillStyle = "#94a3b8";
    ctx.font = "10px monospace";
    ctx.fillText("pH", plotX - 20, plotY - 5);
    ctx.fillText("V (mL)", plotX + plotW - 30, plotY + plotH + 15);

    // pH zones
    const ph7Y = plotY + plotH - (7 / 14) * plotH;
    ctx.fillStyle = "rgba(239,68,68,0.05)";
    ctx.fillRect(plotX, ph7Y, plotW, plotY + plotH - ph7Y);
    ctx.fillStyle = "rgba(59,130,246,0.05)";
    ctx.fillRect(plotX, plotY, plotW, ph7Y - plotY);

    // Curve
    ctx.strokeStyle = "#a855f7";
    ctx.lineWidth = 2.5;
    ctx.beginPath();
    for (let v = 0; v <= maxV; v += 0.2) {
      const nAcid = (acidConc * acidVol) / 1000;
      const nBase = (baseConc * v) / 1000;
      const vTotal = (acidVol + v) / 1000;
      let pH = 7;
      if (nBase < nAcid) pH = -Math.log10((nAcid - nBase) / vTotal);
      else if (nBase > nAcid) pH = 14 + Math.log10((nBase - nAcid) / vTotal);
      pH = Math.max(0, Math.min(14, pH));

      const x = plotX + (v / maxV) * plotW;
      const y = plotY + plotH - (pH / 14) * plotH;
      v === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
    }
    ctx.stroke();

    // Equivalence
    const eqX = plotX + (eqVol / maxV) * plotW;
    ctx.strokeStyle = "rgba(220,38,38,0.5)";
    ctx.lineWidth = 1;
    ctx.setLineDash([4, 4]);
    ctx.beginPath();
    ctx.moveTo(eqX, plotY);
    ctx.lineTo(eqX, plotY + plotH);
    ctx.stroke();
    ctx.setLineDash([]);
    ctx.fillStyle = "#dc2626";
    ctx.font = "9px monospace";
    ctx.fillText(`Équiv. ${eqVol.toFixed(1)}mL`, eqX + 5, plotY + 15);

    // pH 7 line
    ctx.strokeStyle = "rgba(16,185,129,0.3)";
    ctx.setLineDash([3, 3]);
    ctx.beginPath();
    ctx.moveTo(plotX, ph7Y);
    ctx.lineTo(plotX + plotW, ph7Y);
    ctx.stroke();
    ctx.setLineDash([]);
    ctx.fillStyle = "#10b981";
    ctx.font = "9px monospace";
    ctx.fillText("pH = 7", plotX + plotW + 5, ph7Y + 3);
  }, [acidConc, baseConc, acidVol, eqVol]);

  return (
    <Card className="border-purple-500/20 bg-slate-900/80 overflow-hidden">
      <CardHeader className="pb-2 border-b border-purple-500/10">
        <CardTitle className="text-sm font-semibold flex items-center gap-2 text-purple-400">
          🧪 {viz.title}
          <Badge variant="secondary" className="text-[10px] bg-purple-500/10 text-purple-400">Graphique</Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="p-4 space-y-3">
        <canvas ref={canvasRef} width={500} height={250} className="w-full rounded-lg" />
        {viz.equations.length > 0 && (
          <div className="rounded-lg bg-purple-500/5 border border-purple-500/20 p-2 text-[10px] text-purple-300 space-y-0.5">
            {viz.equations.map((eq, i) => <p key={i}>{eq}</p>)}
          </div>
        )}
      </CardContent>
    </Card>
  );
}

// ─── CIRCUIT RC SIMULATION ───
function CircuitRCSim({ viz }: SimProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const R = (viz.params.R as number) || 100;
  const C = (viz.params.C as number) || 100;
  const U0 = (viz.params.U0 as number) || 5;
  const tau = (R * C) / 1000;

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const W = canvas.width;
    const Hc = canvas.height;
    ctx.fillStyle = "#0f172a";
    ctx.fillRect(0, 0, W, Hc);

    const plotX = 50;
    const plotY = 20;
    const plotW = W - 100;
    const plotH = Hc - 60;
    const maxT = tau * 5;

    // Axes
    ctx.strokeStyle = "rgba(148,163,184,0.5)";
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(plotX, plotY + plotH);
    ctx.lineTo(plotX + plotW, plotY + plotH);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(plotX, plotY);
    ctx.lineTo(plotX, plotY + plotH);
    ctx.stroke();

    ctx.fillStyle = "#94a3b8";
    ctx.font = "10px monospace";
    ctx.fillText("Uc (V)", plotX - 5, plotY - 5);
    ctx.fillText("t (s)", plotX + plotW - 20, plotY + plotH + 15);

    // Charge curve
    ctx.strokeStyle = "#4f46e5";
    ctx.lineWidth = 2.5;
    ctx.beginPath();
    for (let t = 0; t <= maxT; t += maxT / 200) {
      const uc = U0 * (1 - Math.exp(-t / tau));
      const x = plotX + (t / maxT) * plotW;
      const y = plotY + plotH - (uc / U0) * plotH;
      t === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
    }
    ctx.stroke();

    // Current curve
    ctx.strokeStyle = "#f59e0b";
    ctx.lineWidth = 1.5;
    ctx.setLineDash([4, 4]);
    ctx.beginPath();
    for (let t = 0; t <= maxT; t += maxT / 200) {
      const i = (U0 / R) * Math.exp(-t / tau);
      const x = plotX + (t / maxT) * plotW;
      const y = plotY + plotH - (i / (U0 / R)) * plotH * 0.8;
      t === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
    }
    ctx.stroke();
    ctx.setLineDash([]);

    // Tau marker
    const tauX = plotX + (tau / maxT) * plotW;
    const tauUc = U0 * (1 - Math.exp(-1));
    const tauY = plotY + plotH - (tauUc / U0) * plotH;
    ctx.strokeStyle = "rgba(220,38,38,0.6)";
    ctx.lineWidth = 1;
    ctx.setLineDash([3, 3]);
    ctx.beginPath();
    ctx.moveTo(tauX, plotY + plotH);
    ctx.lineTo(tauX, tauY);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(plotX, tauY);
    ctx.lineTo(tauX, tauY);
    ctx.stroke();
    ctx.setLineDash([]);
    ctx.fillStyle = "#dc2626";
    ctx.beginPath();
    ctx.arc(tauX, tauY, 4, 0, Math.PI * 2);
    ctx.fill();
    ctx.font = "9px monospace";
    ctx.fillText(`τ=${tau.toFixed(2)}s`, tauX + 8, tauY - 5);

    // Legend
    ctx.fillStyle = "#4f46e5";
    ctx.fillRect(plotX + plotW - 100, plotY + 5, 10, 3);
    ctx.fillStyle = "#94a3b8";
    ctx.font = "9px sans-serif";
    ctx.fillText("Uc(t)", plotX + plotW - 87, plotY + 9);
    ctx.fillStyle = "#f59e0b";
    ctx.fillRect(plotX + plotW - 100, plotY + 18, 10, 3);
    ctx.fillStyle = "#94a3b8";
    ctx.fillText("i(t)", plotX + plotW - 87, plotY + 22);

    // Data
    ctx.fillStyle = "#10b981";
    ctx.font = "bold 10px monospace";
    ctx.fillText(`τ = RC = ${tau.toFixed(2)}s | Charge 63% à t=τ | Charge 99% à t=5τ=${(tau * 5).toFixed(1)}s`, plotX + 5, plotY + plotH + 15);
  }, [R, C, U0, tau]);

  return (
    <Card className="border-cyan-500/20 bg-slate-900/80 overflow-hidden">
      <CardHeader className="pb-2 border-b border-cyan-500/10">
        <CardTitle className="text-sm font-semibold flex items-center gap-2 text-cyan-400">
          ⚡ {viz.title}
          <Badge variant="secondary" className="text-[10px] bg-cyan-500/10 text-cyan-400">Graphique</Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="p-4 space-y-3">
        <canvas ref={canvasRef} width={500} height={250} className="w-full rounded-lg" />
        {viz.equations.length > 0 && (
          <div className="rounded-lg bg-cyan-500/5 border border-cyan-500/20 p-2 text-[10px] text-cyan-300 space-y-0.5">
            {viz.equations.map((eq, i) => <p key={i}>{eq}</p>)}
          </div>
        )}
      </CardContent>
    </Card>
  );
}

// ═══════════════════════════════════════════════════════════════
// 🎯 ROUTEUR DE SIMULATION
// ═══════════════════════════════════════════════════════════════

export function PhysicsSimulation({ viz }: SimProps) {
  switch (viz.type) {
    case "projectile-sim":
      return <ProjectileSim viz={viz} />;
    case "chute-libre-sim":
      return <ChuteLibreSim viz={viz} />;
    case "pendulum-sim":
      return <PendulumSim viz={viz} />;
    case "onde-sim":
      return <OndeSim viz={viz} />;
    case "circuit-rc-sim":
      return <CircuitRCSim viz={viz} />;
    case "dosage-sim":
      return <DosageSim viz={viz} />;
    default:
      return null;
  }
}
