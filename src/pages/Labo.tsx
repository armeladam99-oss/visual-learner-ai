"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import {
  FlaskConical,
  Send,
  Sparkles,
  Atom,
  Calculator,
  Zap,
  ArrowLeft,
  Play,
  RotateCcw,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import { Slider } from "@/components/ui/slider";

// ═══════════════════════════════════════════
// RC CIRCUIT SIMULATION
// ═══════════════════════════════════════════
function RCCircuitExperiment() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [R, setR] = useState(100);
  const [C, setC] = useState(100);
  const [U0, setU0] = useState(5);
  const [isCharging, setIsCharging] = useState(true);
  const [time, setTime] = useState(0);
  const animRef = useRef<number | null>(null);
  const startTimeRef = useRef(0);

  const tau = (R * C) / 1000; // Constante de temps en secondes

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const draw = () => {
      const W = canvas.width;
      const H = canvas.height;

      // Background
      ctx.fillStyle = "#0f172a";
      ctx.fillRect(0, 0, W, H);

      // Grid
      ctx.strokeStyle = "rgba(99,102,241,0.1)";
      ctx.lineWidth = 0.5;
      for (let x = 0; x < W; x += 30) {
        ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, H); ctx.stroke();
      }
      for (let y = 0; y < H; y += 30) {
        ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(W, y); ctx.stroke();
      }

      const plotX = 50;
      const plotY = 30;
      const plotW = W - 100;
      const plotH = H - 80;

      // Axes
      ctx.strokeStyle = "rgba(148,163,184,0.5)";
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(plotX, plotY + plotH);
      ctx.lineTo(plotX + plotW, plotY + plotH);
      ctx.moveTo(plotX, plotY);
      ctx.lineTo(plotX, plotY + plotH);
      ctx.stroke();

      // Labels
      ctx.fillStyle = "#94a3b8";
      ctx.font = "11px monospace";
      ctx.fillText("Uc (V)", plotX - 5, plotY - 5);
      ctx.fillText("t (s)", plotX + plotW - 20, plotY + plotH + 20);

      // Y axis labels
      for (let i = 0; i <= 5; i++) {
        const y = plotY + plotH - (i / 5) * plotH;
        ctx.fillText(`${(U0 * i / 5).toFixed(1)}`, plotX - 30, y + 4);
        ctx.strokeStyle = "rgba(99,102,241,0.05)";
        ctx.beginPath(); ctx.moveTo(plotX, y); ctx.lineTo(plotX + plotW, y); ctx.stroke();
      }

      const maxT = tau * 5;

      // Charge curve (blue)
      ctx.strokeStyle = "#4f46e5";
      ctx.lineWidth = 2.5;
      ctx.beginPath();
      for (let t = 0; t <= maxT; t += maxT / 200) {
        const uc = isCharging
          ? U0 * (1 - Math.exp(-t / tau))
          : U0 * Math.exp(-t / tau);
        const x = plotX + (t / maxT) * plotW;
        const y = plotY + plotH - (uc / U0) * plotH;
        if (t === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.stroke();

      // Current curve (orange, scaled down)
      ctx.strokeStyle = "#f59e0b";
      ctx.lineWidth = 1.5;
      ctx.setLineDash([4, 4]);
      ctx.beginPath();
      for (let t = 0; t <= maxT; t += maxT / 200) {
        const i = isCharging
          ? (U0 / R) * Math.exp(-t / tau)
          : -(U0 / R) * Math.exp(-t / tau);
        const x = plotX + (t / maxT) * plotW;
        const y = plotY + plotH - (Math.abs(i) / (U0 / R)) * plotH * 0.8;
        if (t === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.stroke();
      ctx.setLineDash([]);

      // Tau marker
      const tauX = plotX + (tau / maxT) * plotW;
      const tauUc = isCharging ? U0 * (1 - Math.exp(-1)) : U0 * Math.exp(-1);
      const tauY = plotY + plotH - (tauUc / U0) * plotH;
      ctx.strokeStyle = "rgba(220,38,38,0.6)";
      ctx.lineWidth = 1;
      ctx.setLineDash([3, 3]);
      ctx.beginPath(); ctx.moveTo(tauX, plotY + plotH); ctx.lineTo(tauX, tauY); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(plotX, tauY); ctx.lineTo(tauX, tauY); ctx.stroke();
      ctx.setLineDash([]);

      ctx.fillStyle = "#dc2626";
      ctx.beginPath(); ctx.arc(tauX, tauY, 4, 0, Math.PI * 2); ctx.fill();
      ctx.font = "10px monospace";
      ctx.fillText(`τ = ${tau.toFixed(2)}s`, tauX + 8, tauY - 5);

      // Legend
      ctx.fillStyle = "#4f46e5";
      ctx.fillRect(plotX + plotW - 120, plotY + 10, 12, 3);
      ctx.fillStyle = "#94a3b8";
      ctx.font = "10px sans-serif";
      ctx.fillText("Uc(t)", plotX + plotW - 105, plotY + 15);

      ctx.fillStyle = "#f59e0b";
      ctx.fillRect(plotX + plotW - 120, plotY + 25, 12, 3);
      ctx.fillStyle = "#94a3b8";
      ctx.fillText("i(t)", plotX + plotW - 105, plotY + 30);

      // Current value
      const currentT = time;
      const currentUc = isCharging
        ? U0 * (1 - Math.exp(-currentT / tau))
        : U0 * Math.exp(-currentT / tau);
      ctx.fillStyle = "#10b981";
      ctx.font = "bold 11px monospace";
      ctx.fillText(`Uc(${currentT.toFixed(1)}s) = ${currentUc.toFixed(2)}V`, plotX + 10, plotY + plotH + 20);
    };

    draw();
  }, [R, C, U0, isCharging, time, tau]);

  // Animation
  useEffect(() => {
    startTimeRef.current = performance.now();
    const animate = (ts: number) => {
      const elapsed = (ts - startTimeRef.current) / 1000;
      setTime(Math.min(elapsed, tau * 5));
      if (elapsed < tau * 5) {
        animRef.current = requestAnimationFrame(animate);
      }
    };
    animRef.current = requestAnimationFrame(animate);
    return () => { if (animRef.current) cancelAnimationFrame(animRef.current); };
  }, [R, C, isCharging]);

  const currentUc = isCharging
    ? U0 * (1 - Math.exp(-time / tau))
    : U0 * Math.exp(-time / tau);

  return (
    <Card className="border-cyan-500/20 bg-slate-900/50 overflow-hidden">
      <CardHeader className="pb-2 border-b border-cyan-500/10">
        <CardTitle className="text-sm font-semibold flex items-center gap-2 text-cyan-400">
          <Zap className="size-4" />
          Circuit RC — Charge / Décharge
          <Badge variant="secondary" className="text-[10px] ml-auto bg-cyan-500/10 text-cyan-400">Expérience</Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="p-4 space-y-4">
        <canvas ref={canvasRef} width={500} height={250} className="w-full rounded-lg" />

        <div className="grid grid-cols-3 gap-3">
          <div className="space-y-1">
            <div className="flex items-center justify-between">
              <label className="text-xs text-cyan-300">Résistance R</label>
              <span className="text-xs font-mono font-bold text-cyan-400">{R}Ω</span>
            </div>
            <Slider min={10} max={1000} step={10} value={[R]} onValueChange={([v]) => setR(v)} className="[&_[role=slider]]:bg-cyan-500" />
          </div>
          <div className="space-y-1">
            <div className="flex items-center justify-between">
              <label className="text-xs text-cyan-300">Capacité C</label>
              <span className="text-xs font-mono font-bold text-cyan-400">{C}μF</span>
            </div>
            <Slider min={10} max={1000} step={10} value={[C]} onValueChange={([v]) => setC(v)} className="[&_[role=slider]]:bg-cyan-500" />
          </div>
          <div className="space-y-1">
            <div className="flex items-center justify-between">
              <label className="text-xs text-cyan-300">Tension U₀</label>
              <span className="text-xs font-mono font-bold text-cyan-400">{U0}V</span>
            </div>
            <Slider min={1} max={20} step={0.5} value={[U0]} onValueChange={([v]) => setU0(v)} className="[&_[role=slider]]:bg-cyan-500" />
          </div>
        </div>

        <div className="flex gap-2">
          <Button onClick={() => setIsCharging(true)} size="sm" variant={isCharging ? "default" : "outline"} className="text-xs">
            ⚡ Charge
          </Button>
          <Button onClick={() => setIsCharging(false)} size="sm" variant={!isCharging ? "default" : "outline"} className="text-xs">
            🔋 Décharge
          </Button>
          <Button onClick={() => setTime(0)} variant="outline" size="sm" className="text-xs">
            <RotateCcw className="size-3 mr-1" /> Reset
          </Button>
        </div>

        <div className="rounded-lg bg-cyan-500/5 border border-cyan-500/20 p-3 space-y-1">
          <p className="text-xs text-cyan-300 font-semibold">📊 Données en temps réel</p>
          <div className="grid grid-cols-2 gap-2 text-[10px] text-slate-300">
            <p>Constante de temps τ = RC = <span className="text-cyan-400 font-mono">{tau.toFixed(2)}s</span></p>
            <p>Uc actuelle = <span className="text-green-400 font-mono">{currentUc.toFixed(2)}V</span></p>
            <p>Charge à 63% à t = τ = <span className="text-red-400 font-mono">{tau.toFixed(2)}s</span></p>
            <p>Charge à 99% à t = 5τ = <span className="text-amber-400 font-mono">{(tau * 5).toFixed(2)}s</span></p>
          </div>
        </div>

        <div className="rounded-lg bg-slate-800/50 border border-slate-700 p-3 text-[10px] text-slate-400 space-y-1">
          <p><strong className="text-slate-300">Charge :</strong> Uc(t) = U₀(1 − e^(−t/τ))</p>
          <p><strong className="text-slate-300">Décharge :</strong> Uc(t) = U₀ × e^(−t/τ)</p>
          <p><strong className="text-slate-300">Courant :</strong> i(t) = (U₀/R) × e^(−t/τ)</p>
        </div>
      </CardContent>
    </Card>
  );
}

// ═══════════════════════════════════════════
// CHEMISTRY — DOSAGE SIMULATION
// ═══════════════════════════════════════════
function ChemistryDosageExperiment() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [volume, setVolume] = useState(0);
  const [acidConc, setAcidConc] = useState(0.1);
  const [baseConc, setBaseConc] = useState(0.1);
  const [acidVol, setAcidVol] = useState(50);

  const equivalenceVol = (acidConc * acidVol) / baseConc;

  const computepH = (v: number) => {
    const nAcid = acidConc * acidVol / 1000;
    const nBase = baseConc * v / 1000;
    const vTotal = (acidVol + v) / 1000;

    if (nBase < nAcid) {
      const excess = nAcid - nBase;
      return -Math.log10(excess / vTotal);
    } else if (nBase === nAcid) {
      return 7;
    } else {
      const excess = nBase - nAcid;
      return 14 + Math.log10(excess / vTotal);
    }
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const W = canvas.width;
    const H = canvas.height;

    ctx.fillStyle = "#0f172a";
    ctx.fillRect(0, 0, W, H);

    const plotX = 50;
    const plotY = 30;
    const plotW = W - 100;
    const plotH = H - 80;

    // Grid
    ctx.strokeStyle = "rgba(99,102,241,0.08)";
    ctx.lineWidth = 0.5;
    for (let x = 0; x <= 14; x++) {
      const y = plotY + plotH - (x / 14) * plotH;
      ctx.beginPath(); ctx.moveTo(plotX, y); ctx.lineTo(plotX + plotW, y); ctx.stroke();
    }

    // Axes
    ctx.strokeStyle = "rgba(148,163,184,0.5)";
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(plotX, plotY + plotH);
    ctx.lineTo(plotX + plotW, plotY + plotH);
    ctx.moveTo(plotX, plotY);
    ctx.lineTo(plotX, plotY + plotH);
    ctx.stroke();

    ctx.fillStyle = "#94a3b8";
    ctx.font = "11px monospace";
    ctx.fillText("pH", plotX - 25, plotY - 5);
    ctx.fillText("V NaOH (mL)", plotX + plotW - 60, plotY + plotH + 20);

    // pH scale
    for (let pH = 0; pH <= 14; pH += 2) {
      const y = plotY + plotH - (pH / 14) * plotH;
      ctx.fillStyle = "#64748b";
      ctx.font = "9px monospace";
      ctx.fillText(`${pH}`, plotX - 20, y + 3);
    }

    const maxV = equivalenceVol * 2;

    // Titration curve
    ctx.strokeStyle = "#a855f7";
    ctx.lineWidth = 2.5;
    ctx.beginPath();
    for (let v = 0; v <= maxV; v += 0.2) {
      const pH = Math.max(0, Math.min(14, computepH(v)));
      const x = plotX + (v / maxV) * plotW;
      const y = plotY + plotH - (pH / 14) * plotH;
      if (v === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    }
    ctx.stroke();

    // Equivalence point marker
    const eqX = plotX + (equivalenceVol / maxV) * plotW;
    const eqpH = computepH(equivalenceVol);
    const eqY = plotY + plotH - (eqpH / 14) * plotH;
    ctx.strokeStyle = "rgba(220,38,38,0.6)";
    ctx.lineWidth = 1;
    ctx.setLineDash([4, 4]);
    ctx.beginPath(); ctx.moveTo(eqX, plotY + plotH); ctx.lineTo(eqX, eqY); ctx.stroke();
    ctx.setLineDash([]);
    ctx.fillStyle = "#dc2626";
    ctx.beginPath(); ctx.arc(eqX, eqY, 5, 0, Math.PI * 2); ctx.fill();
    ctx.font = "10px monospace";
    ctx.fillText(`Équiv. V=${equivalenceVol.toFixed(1)}mL`, eqX + 8, eqY - 8);

    // Current position
    const currentpH = Math.max(0, Math.min(14, computepH(volume)));
    const curX = plotX + (volume / maxV) * plotW;
    const curY = plotY + plotH - (currentpH / 14) * plotH;
    ctx.fillStyle = "#10b981";
    ctx.beginPath(); ctx.arc(curX, curY, 6, 0, Math.PI * 2); ctx.fill();
    ctx.strokeStyle = "white";
    ctx.lineWidth = 2;
    ctx.stroke();

    // pH zones
    ctx.fillStyle = "rgba(239,68,68,0.08)";
    ctx.fillRect(plotX, plotY + plotH * (1 - 7 / 14), plotW, plotH * (7 / 14));
    ctx.fillStyle = "rgba(59,130,246,0.08)";
    ctx.fillRect(plotX, plotY, plotW, plotH * (1 - 7 / 14));

    ctx.fillStyle = "rgba(239,68,68,0.4)";
    ctx.font = "9px sans-serif";
    ctx.fillText("Zone acide (pH < 7)", plotX + 5, plotY + plotH - 15);
    ctx.fillStyle = "rgba(59,130,246,0.4)";
    ctx.fillText("Zone basique (pH > 7)", plotX + 5, plotY + 15);

  }, [volume, acidConc, baseConc, acidVol, equivalenceVol]);

  const currentpH = Math.max(0, Math.min(14, computepH(volume)));

  return (
    <Card className="border-purple-500/20 bg-slate-900/50 overflow-hidden">
      <CardHeader className="pb-2 border-b border-purple-500/10">
        <CardTitle className="text-sm font-semibold flex items-center gap-2 text-purple-400">
          <FlaskConical className="size-4" />
          Dosage acido-basique — Simulation
          <Badge variant="secondary" className="text-[10px] ml-auto bg-purple-500/10 text-purple-400">Expérience</Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="p-4 space-y-4">
        <canvas ref={canvasRef} width={500} height={250} className="w-full rounded-lg" />

        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-1">
            <div className="flex items-center justify-between">
              <label className="text-xs text-purple-300">[Acide] (mol/L)</label>
              <span className="text-xs font-mono font-bold text-purple-400">{acidConc}</span>
            </div>
            <Slider min={0.01} max={1} step={0.01} value={[acidConc]} onValueChange={([v]) => setAcidConc(v)} className="[&_[role=slider]]:bg-purple-500" />
          </div>
          <div className="space-y-1">
            <div className="flex items-center justify-between">
              <label className="text-xs text-purple-300">[Base] (mol/L)</label>
              <span className="text-xs font-mono font-bold text-purple-400">{baseConc}</span>
            </div>
            <Slider min={0.01} max={1} step={0.01} value={[baseConc]} onValueChange={([v]) => setBaseConc(v)} className="[&_[role=slider]]:bg-purple-500" />
          </div>
        </div>

        <div className="space-y-1">
          <div className="flex items-center justify-between">
            <label className="text-xs text-purple-300">Volume NaOH ajouté</label>
            <span className="text-xs font-mono font-bold text-green-400">{volume.toFixed(1)} mL</span>
          </div>
          <Slider min={0} max={equivalenceVol * 2} step={0.5} value={[volume]} onValueChange={([v]) => setVolume(v)} className="[&_[role=slider]]:bg-purple-500" />
        </div>

        <div className="flex gap-2">
          <Button onClick={() => setVolume(0)} variant="outline" size="sm" className="text-xs border-purple-500/30 text-purple-300">
            <RotateCcw className="size-3 mr-1" /> Reset
          </Button>
        </div>

        <div className="grid grid-cols-3 gap-2 text-center">
          <div className="rounded-lg bg-purple-500/10 border border-purple-500/20 p-2">
            <p className="text-[10px] text-purple-300">pH actuel</p>
            <p className="text-lg font-mono font-bold" style={{ color: currentpH < 7 ? "#ef4444" : currentpH > 7 ? "#3b82f6" : "#10b981" }}>
              {currentpH.toFixed(1)}
            </p>
          </div>
          <div className="rounded-lg bg-purple-500/10 border border-purple-500/20 p-2">
            <p className="text-[10px] text-purple-300">Point équivalence</p>
            <p className="text-sm font-mono font-bold text-amber-400">{equivalenceVol.toFixed(1)} mL</p>
          </div>
          <div className="rounded-lg bg-purple-500/10 border border-purple-500/20 p-2">
            <p className="text-[10px] text-purple-300">État</p>
            <p className="text-xs font-bold" style={{ color: volume < equivalenceVol ? "#ef4444" : volume > equivalenceVol ? "#3b82f6" : "#10b981" }}>
              {volume < equivalenceVol * 0.95 ? "Acide" : volume > equivalenceVol * 1.05 ? "Basique" : "≈ Équivalence"}
            </p>
          </div>
        </div>

        <div className="rounded-lg bg-slate-800/50 border border-slate-700 p-3 text-[10px] text-slate-400 space-y-1">
          <p><strong className="text-slate-300">pH = −log[H₃O⁺]</strong></p>
          <p><strong className="text-slate-300">Au point d&apos;équivalence :</strong> n_acide = n_base</p>
          <p><strong className="text-slate-300">Avant :</strong> excès d&apos;acide → pH bas</p>
          <p><strong className="text-slate-300">Après :</strong> excès de base → pH haut</p>
        </div>
      </CardContent>
    </Card>
  );
}

// ═══════════════════════════════════════════
// MATH — FUNCTION EXPLORER
// ═══════════════════════════════════════════
function MathFunctionExplorer() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [funcType, setFuncType] = useState<"quad" | "exp" | "log" | "sin">("quad");
  const [paramA, setParamA] = useState(1);
  const [paramB, setParamB] = useState(0);
  const [paramC, setParamC] = useState(0);

  const funcLabel = funcType === "quad" ? `f(x) = ${paramA}x² + ${paramB}x + ${paramC}`
    : funcType === "exp" ? `f(x) = ${paramA} × e^(${paramB}x) + ${paramC}`
    : funcType === "log" ? `f(x) = ${paramA} × ln(x + ${Math.abs(paramB) + 0.1}) + ${paramC}`
    : `f(x) = ${paramA} × sin(${paramB}x + ${paramC})`;

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const W = canvas.width;
    const H = canvas.height;
    const cx = W / 2;
    const cy = H / 2;
    const scaleX = W / 20;
    const scaleY = H / 12;

    ctx.fillStyle = "#0f172a";
    ctx.fillRect(0, 0, W, H);

    // Grid
    ctx.strokeStyle = "rgba(99,102,241,0.08)";
    ctx.lineWidth = 0.5;
    for (let x = -10; x <= 10; x++) {
      const px = cx + x * scaleX;
      ctx.beginPath(); ctx.moveTo(px, 0); ctx.lineTo(px, H); ctx.stroke();
    }
    for (let y = -6; y <= 6; y++) {
      const py = cy - y * scaleY;
      ctx.beginPath(); ctx.moveTo(0, py); ctx.lineTo(W, py); ctx.stroke();
    }

    // Axes
    ctx.strokeStyle = "rgba(148,163,184,0.5)";
    ctx.lineWidth = 1;
    ctx.beginPath(); ctx.moveTo(0, cy); ctx.lineTo(W, cy); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(cx, 0); ctx.lineTo(cx, H); ctx.stroke();

    ctx.fillStyle = "#64748b";
    ctx.font = "10px monospace";
    ctx.fillText("x", W - 15, cy - 5);
    ctx.fillText("y", cx + 5, 15);

    // Function curve
    ctx.strokeStyle = "#4f46e5";
    ctx.lineWidth = 2.5;
    ctx.beginPath();
    let started = false;

    for (let px = 0; px < W; px += 1) {
      const x = (px - cx) / scaleX;
      let y = 0;
      if (funcType === "quad") {
        y = paramA * x * x + paramB * x + paramC;
      } else if (funcType === "exp") {
        y = paramA * Math.exp(paramB * x) + paramC;
      } else if (funcType === "log") {
        const arg = x + Math.abs(paramB) + 0.1;
        y = arg > 0 ? paramA * Math.log(arg) + paramC : NaN;
      } else {
        y = paramA * Math.sin(paramB * x + paramC);
      }

      if (isNaN(y) || !isFinite(y) || Math.abs(y) > 20) {
        started = false;
        continue;
      }

      const py = cy - y * scaleY;
      if (!started) {
        ctx.moveTo(px, py);
        started = true;
      } else {
        ctx.lineTo(px, py);
      }
    }
    ctx.stroke();

    // Derivative (for quadratic)
    if (funcType === "quad") {
      ctx.strokeStyle = "rgba(220,38,38,0.5)";
      ctx.lineWidth = 1.5;
      ctx.setLineDash([5, 5]);
      ctx.beginPath();
      started = false;
      for (let px = 0; px < W; px += 1) {
        const x = (px - cx) / scaleX;
        const y = 2 * paramA * x + paramB;
        if (Math.abs(y) > 20) { started = false; continue; }
        const py = cy - y * scaleY;
        if (!started) { ctx.moveTo(px, py); started = true; }
        else ctx.lineTo(px, py);
      }
      ctx.stroke();
      ctx.setLineDash([]);

      // Legend
      ctx.fillStyle = "#4f46e5";
      ctx.fillRect(10, 10, 12, 3);
      ctx.fillStyle = "#94a3b8";
      ctx.font = "10px sans-serif";
      ctx.fillText("f(x)", 26, 14);
      ctx.fillStyle = "rgba(220,38,38,0.5)";
      ctx.fillRect(10, 22, 12, 3);
      ctx.fillStyle = "#94a3b8";
      ctx.fillText("f'(x)", 26, 26);
    }
  }, [funcType, paramA, paramB, paramC]);

  return (
    <Card className="border-indigo-500/20 bg-slate-900/50 overflow-hidden">
      <CardHeader className="pb-2 border-b border-indigo-500/10">
        <CardTitle className="text-sm font-semibold flex items-center gap-2 text-indigo-400">
          <Calculator className="size-4" />
          Explorateur de fonctions
          <Badge variant="secondary" className="text-[10px] ml-auto bg-indigo-500/10 text-indigo-400">Interactive</Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="p-4 space-y-4">
        <canvas ref={canvasRef} width={500} height={280} className="w-full rounded-lg" />

        <div className="flex flex-wrap gap-1.5">
          {[
            { key: "quad" as const, label: "Quadratique", icon: "📈" },
            { key: "exp" as const, label: "Exponentielle", icon: "📉" },
            { key: "log" as const, label: "Logarithme", icon: "🔢" },
            { key: "sin" as const, label: "Sinusoïde", icon: "🌊" },
          ].map((f) => (
            <button
              key={f.key}
              onClick={() => setFuncType(f.key)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                funcType === f.key
                  ? "bg-indigo-500 text-white shadow-sm"
                  : "bg-slate-800 text-slate-400 hover:bg-slate-700"
              }`}
            >
              {f.icon} {f.label}
            </button>
          ))}
        </div>

        <div className="rounded-lg bg-indigo-500/5 border border-indigo-500/20 p-2 text-center">
          <code className="text-xs font-mono font-bold text-indigo-400">{funcLabel}</code>
        </div>

        <div className="grid grid-cols-3 gap-3">
          <div className="space-y-1">
            <div className="flex items-center justify-between">
              <label className="text-xs text-indigo-300">Paramètre a</label>
              <span className="text-xs font-mono font-bold text-indigo-400">{paramA}</span>
            </div>
            <Slider min={-5} max={5} step={0.1} value={[paramA]} onValueChange={([v]) => setParamA(v)} className="[&_[role=slider]]:bg-indigo-500" />
          </div>
          <div className="space-y-1">
            <div className="flex items-center justify-between">
              <label className="text-xs text-indigo-300">Paramètre b</label>
              <span className="text-xs font-mono font-bold text-indigo-400">{paramB}</span>
            </div>
            <Slider min={-5} max={5} step={0.1} value={[paramB]} onValueChange={([v]) => setParamB(v)} className="[&_[role=slider]]:bg-indigo-500" />
          </div>
          <div className="space-y-1">
            <div className="flex items-center justify-between">
              <label className="text-xs text-indigo-300">Paramètre c</label>
              <span className="text-xs font-mono font-bold text-indigo-400">{paramC}</span>
            </div>
            <Slider min={-5} max={5} step={0.1} value={[paramC]} onValueChange={([v]) => setParamC(v)} className="[&_[role=slider]]:bg-indigo-500" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

// ═══════════════════════════════════════════
// AI CHAT INTERFACE
// ═══════════════════════════════════════════
interface Message {
  role: "user" | "assistant";
  content: string;
  experiment?: string;
}

const experiments = {
  circuit: { name: "Circuit RC", icon: "⚡", component: RCCircuitExperiment },
  dosage: { name: "Dosage acido-basique", icon: "🧪", component: ChemistryDosageExperiment },
  fonction: { name: "Explorateur de fonctions", icon: "📐", component: MathFunctionExplorer },
};

function detectExperiment(query: string): string | null {
  const q = query.toLowerCase();
  if (q.includes("circuit") || q.includes("rc") || q.includes("condensateur") || q.includes("charge") || q.includes("résistance") || q.includes("capacité")) return "circuit";
  if (q.includes("dosage") || q.includes("ph") || q.includes("acide") || q.includes("base") || q.includes("titrage") || q.includes("solution")) return "dosage";
  if (q.includes("fonction") || q.includes("graphique") || q.includes("courbe") || q.includes("sinus") || q.includes("exponentielle") || q.includes("logarithme") || q.includes("parabole") || q.includes("quadratique")) return "fonction";
  return null;
}

function getAIResponse(query: string, experiment: string | null): string {
  if (experiment === "circuit") {
    return `Voici la simulation du **circuit RC** ! ⚡

Un circuit RC est composé d'une **résistance (R)** et d'un **condensateur (C)** en série.

**Constante de temps :** τ = R × C

• À t = τ : le condensateur est chargé à **63%**
• À t = 5τ : le condensateur est chargé à **99%**

Modifie les paramètres R, C et U₀ pour observer l'effet sur la courbe de charge.

**Formules :**
• Charge : Uc(t) = U₀(1 − e^(−t/τ))
• Décharge : Uc(t) = U₀ × e^(−t/τ))
• Courant : i(t) = (U₀/R) × e^(−t/τ))`;
  }
  if (experiment === "dosage") {
    return `Voici la simulation de **dosage acido-basique** ! 🧪

Le dosage permet de déterminer la concentration d'une solution inconnue.

**Principe :** On verse une solution titrante (de concentration connue) dans la solution à doser.

**Point d'équivalence :** moment où n_acide = n_base

Observe la courbe pH en fonction du volume de base ajoutée :
• Avant le point d&apos;équivalence : pH bas (excès d&apos;acide)
• Au point d&apos;équivalence : variation brusque du pH
• Après : pH haut (excès de base)

Modifie les concentrations et observe l'effet !`;
  }
  if (experiment === "fonction") {
    return `Voici l'**explorateur de fonctions** ! 📐

Tu peux visualiser 4 types de fonctions :
• **Quadratique** : f(x) = ax² + bx + c (parabole)
• **Exponentielle** : f(x) = a × e^(bx) + c
• **Logarithme** : f(x) = a × ln(x) + c
• **Sinusoïde** : f(x) = a × sin(bx + c)

Modifie les paramètres a, b, c pour observer l'effet sur la courbe.

Pour la quadratique, la courbe rouge en pointillés montre la **dérivée** f'(x).`;
  }
  return `Je suis le Professeur IA du Laboratoire. 🧪

Je peux t'aider avec :
• **Physique** : circuits, mécanique, ondes, oscillations
• **Chimie** : dosages, réactions, molécules
• **Maths** : fonctions, graphiques, calculs

Essaie de me demander :
"Montre-moi un circuit RC"
"Montre-moi un dosage"
"Montre-moi une fonction quadratique"`;
}

export default function LaboPage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [activeExperiment, setActiveExperiment] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = (text?: string) => {
    const query = text || input.trim();
    if (!query) return;

    const exp = detectExperiment(query);
    const response = getAIResponse(query, exp);

    setMessages((prev) => [
      ...prev,
      { role: "user", content: query },
      { role: "assistant", content: response, experiment: exp || undefined },
    ]);

    if (exp) setActiveExperiment(exp);
    setInput("");
  };

  const ActiveComponent = activeExperiment ? experiments[activeExperiment as keyof typeof experiments]?.component : null;

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-cyan-500/20 bg-slate-900/80 backdrop-blur-xl">
        <div className="mx-auto flex h-14 max-w-5xl items-center justify-between px-4">
          <div className="flex items-center gap-2">
            <FlaskConical className="size-5 text-cyan-400" />
            <span className="text-base font-bold text-white">🧪 Labo IA</span>
            <Badge variant="secondary" className="text-[10px] bg-cyan-500/10 text-cyan-400">2e BAC</Badge>
          </div>
        </div>
      </header>

      <div className="mx-auto max-w-5xl px-4 py-6 space-y-6">
        {/* Welcome */}
        {messages.length === 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center space-y-4 py-8"
          >
            <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-cyan-500/20 to-indigo-500/20 border border-cyan-500/30 mx-auto flex items-center justify-center">
              <Atom className="size-10 text-cyan-400" />
            </div>
            <h2 className="text-2xl font-bold text-white">Laboratoire Scientifique IA</h2>
            <p className="text-sm text-slate-400 max-w-md mx-auto">
              Pose ta question ou choisis une expérience. L&apos;IA te montre, t&apos;explique et te simule le phénomène.
            </p>

            <div className="grid gap-3 sm:grid-cols-3 max-w-2xl mx-auto pt-4">
              {[
                { key: "circuit", icon: "⚡", title: "Circuit RC", desc: "Charge et décharge d'un condensateur", color: "cyan" },
                { key: "dosage", icon: "🧪", title: "Dosage", desc: "Titration acido-basique interactive", color: "purple" },
                { key: "fonction", icon: "📐", title: "Fonctions", desc: "Explorateur de courbes mathématiques", color: "indigo" },
              ].map((exp) => (
                <button
                  key={exp.key}
                  onClick={() => handleSend(`Montre-moi ${exp.title.toLowerCase()}`)}
                  className={`rounded-xl border border-${exp.color}-500/20 bg-${exp.color}-500/5 p-4 text-left hover:bg-${exp.color}-500/10 transition-all group`}
                >
                  <span className="text-2xl">{exp.icon}</span>
                  <p className="text-sm font-semibold text-white mt-2">{exp.title}</p>
                  <p className="text-[10px] text-slate-400 mt-1">{exp.desc}</p>
                </button>
              ))}
            </div>
          </motion.div>
        )}

        {/* Messages */}
        {messages.length > 0 && (
          <div className="space-y-4">
            {messages.map((msg, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
              >
                <div className={`max-w-[85%] rounded-xl px-4 py-3 ${
                  msg.role === "user"
                    ? "bg-cyan-600 text-white"
                    : "bg-slate-800 border border-slate-700 text-slate-200"
                }`}>
                  {msg.role === "assistant" && (
                    <div className="flex items-center gap-2 mb-2">
                      <Sparkles className="size-3.5 text-cyan-400" />
                      <span className="text-[10px] font-semibold text-cyan-400">Prof IA</span>
                    </div>
                  )}
                  <div className="text-sm leading-relaxed whitespace-pre-line">
                    {msg.content.split("**").map((part, j) =>
                      j % 2 === 1 ? (
                        <strong key={j} className={msg.role === "user" ? "text-white" : "text-white"}>
                          {part}
                        </strong>
                      ) : (
                        <span key={j}>{part}</span>
                      )
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
            <div ref={messagesEndRef} />
          </div>
        )}

        {/* Active Experiment */}
        <AnimatePresence>
          {ActiveComponent && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              <ActiveComponent />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Chat Input */}
        <div className="sticky bottom-16 bg-slate-900/90 backdrop-blur-xl border-t border-slate-800 p-4">
          <div className="flex gap-2">
            <Textarea
              placeholder="Que veux-tu expérimenter ? (ex: Montre-moi un circuit RC)"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              className="min-h-[50px] text-sm resize-none bg-slate-800 border-slate-700 text-white placeholder:text-slate-500"
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  handleSend();
                }
              }}
            />
            <Button onClick={() => handleSend()} disabled={!input.trim()} className="bg-cyan-600 hover:bg-cyan-500">
              <Send className="size-4" />
            </Button>
          </div>
          <div className="flex flex-wrap gap-1.5 mt-2">
            {["Montre-moi un circuit RC", "Montre-moi un dosage", "Montre-moi une fonction"].map((q) => (
              <button
                key={q}
                onClick={() => handleSend(q)}
                className="px-2 py-0.5 rounded-md bg-slate-800 text-[10px] text-slate-400 hover:bg-slate-700 transition-colors"
              >
                {q}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
