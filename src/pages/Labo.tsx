"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Slider } from "@/components/ui/slider";
import {
  FlaskConical,
  Send,
  Sparkles,
  Atom,
  Zap,
  Camera,
  Lightbulb,
  CheckCircle,
  ChevronDown,
  ChevronUp,
  RotateCcw,
  Brain,
  BookOpen,
  MessageCircle,
  Image as ImageIcon,
  X,
} from "lucide-react";
import {
  processMessage,
  createInitialContext,
  type AIContext,
  type Message,
} from "@/lib/ai-engine";

// ═══════════════════════════════════════════════════════════════
// ⚡ RC CIRCUIT SIMULATION
// ═══════════════════════════════════════════════════════════════
function RCCircuit({ params, onParamsChange }: { params: Record<string, number>; onParamsChange: (p: Record<string, number>) => void }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const R = params.R || 100;
  const C = params.C || 100;
  const U0 = params.U0 || 5;
  const tau = (R * C) / 1000;

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const W = canvas.width;
    const H = canvas.height;

    ctx.fillStyle = "#0f172a";
    ctx.fillRect(0, 0, W, H);

    // Grid
    ctx.strokeStyle = "rgba(99,102,241,0.1)";
    ctx.lineWidth = 0.5;
    for (let x = 0; x < W; x += 30) { ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, H); ctx.stroke(); }
    for (let y = 0; y < H; y += 30) { ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(W, y); ctx.stroke(); }

    const plotX = 50, plotY = 20, plotW = W - 100, plotH = H - 60;

    // Axes
    ctx.strokeStyle = "rgba(148,163,184,0.5)";
    ctx.lineWidth = 1;
    ctx.beginPath(); ctx.moveTo(plotX, plotY + plotH); ctx.lineTo(plotX + plotW, plotY + plotH); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(plotX, plotY); ctx.lineTo(plotX, plotY + plotH); ctx.stroke();

    ctx.fillStyle = "#94a3b8"; ctx.font = "10px monospace";
    ctx.fillText("Uc (V)", plotX - 5, plotY - 5);
    ctx.fillText("t (s)", plotX + plotW - 20, plotY + plotH + 15);

    const maxT = tau * 5;

    // Charge curve
    ctx.strokeStyle = "#4f46e5"; ctx.lineWidth = 2.5;
    ctx.beginPath();
    for (let t = 0; t <= maxT; t += maxT / 200) {
      const uc = U0 * (1 - Math.exp(-t / tau));
      const x = plotX + (t / maxT) * plotW;
      const y = plotY + plotH - (uc / U0) * plotH;
      t === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
    }
    ctx.stroke();

    // Current curve
    ctx.strokeStyle = "#f59e0b"; ctx.lineWidth = 1.5; ctx.setLineDash([4, 4]);
    ctx.beginPath();
    for (let t = 0; t <= maxT; t += maxT / 200) {
      const i = (U0 / R) * Math.exp(-t / tau);
      const x = plotX + (t / maxT) * plotW;
      const y = plotY + plotH - (i / (U0 / R)) * plotH * 0.8;
      t === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
    }
    ctx.stroke(); ctx.setLineDash([]);

    // Tau marker
    const tauX = plotX + (tau / maxT) * plotW;
    const tauUc = U0 * (1 - Math.exp(-1));
    const tauY = plotY + plotH - (tauUc / U0) * plotH;
    ctx.strokeStyle = "rgba(220,38,38,0.6)"; ctx.lineWidth = 1; ctx.setLineDash([3, 3]);
    ctx.beginPath(); ctx.moveTo(tauX, plotY + plotH); ctx.lineTo(tauX, tauY); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(plotX, tauY); ctx.lineTo(tauX, tauY); ctx.stroke();
    ctx.setLineDash([]);
    ctx.fillStyle = "#dc2626"; ctx.beginPath(); ctx.arc(tauX, tauY, 4, 0, Math.PI * 2); ctx.fill();
    ctx.font = "9px monospace"; ctx.fillText(`τ=${tau.toFixed(2)}s`, tauX + 8, tauY - 5);

    // Legend
    ctx.fillStyle = "#4f46e5"; ctx.fillRect(plotX + plotW - 100, plotY + 5, 10, 3);
    ctx.fillStyle = "#94a3b8"; ctx.font = "9px sans-serif"; ctx.fillText("Uc(t)", plotX + plotW - 87, plotY + 9);
    ctx.fillStyle = "#f59e0b"; ctx.fillRect(plotX + plotW - 100, plotY + 18, 10, 3);
    ctx.fillStyle = "#94a3b8"; ctx.fillText("i(t)", plotX + plotW - 87, plotY + 22);

    // Data
    ctx.fillStyle = "#10b981"; ctx.font = "bold 10px monospace";
    ctx.fillText(`τ = RC = ${tau.toFixed(2)}s | Charge 63% à t=τ | Charge 99% à t=5τ=${(tau*5).toFixed(1)}s`, plotX + 5, plotY + plotH + 15);
  }, [R, C, U0, tau]);

  return (
    <Card className="border-cyan-500/20 bg-slate-900/50 overflow-hidden">
      <CardHeader className="pb-2 border-b border-cyan-500/10">
        <CardTitle className="text-sm font-semibold flex items-center gap-2 text-cyan-400">
          <Zap className="size-4" /> Circuit RC — Charge / Décharge
          <Badge variant="secondary" className="text-[10px] ml-auto bg-cyan-500/10 text-cyan-400">Expérience</Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="p-4 space-y-3">
        <canvas ref={canvasRef} width={500} height={200} className="w-full rounded-lg" />
        <div className="grid grid-cols-3 gap-3">
          {[
            { label: "Résistance R", symbol: "R", unit: "Ω", min: 10, max: 1000, param: "R" },
            { label: "Capacité C", symbol: "C", unit: "μF", min: 10, max: 1000, param: "C" },
            { label: "Tension U₀", symbol: "U₀", unit: "V", min: 1, max: 20, param: "U0" },
          ].map((s) => (
            <div key={s.param} className="space-y-1">
              <div className="flex items-center justify-between">
                <label className="text-[10px] text-cyan-300">{s.label}</label>
                <span className="text-[10px] font-mono font-bold text-cyan-400">{params[s.param] || s.min}{s.unit}</span>
              </div>
              <Slider min={s.min} max={s.max} step={s.param === "U0" ? 0.5 : 10} value={[params[s.param] || s.min]} onValueChange={([v]) => onParamsChange({ ...params, [s.param]: v })} className="[&_[role=slider]]:bg-cyan-500" />
            </div>
          ))}
        </div>
        <div className="rounded-lg bg-cyan-500/5 border border-cyan-500/20 p-2 text-[10px] text-cyan-300 space-y-0.5">
          <p>Uc(t) = U₀(1 − e^(−t/τ))</p>
          <p>i(t) = (U₀/R) × e^(−t/τ)</p>
        </div>
      </CardContent>
    </Card>
  );
}

// ═══════════════════════════════════════════════════════════════
// 🧪 DOSAGE SIMULATION
// ═══════════════════════════════════════════════════════════════
function DosageExperiment({ params, onParamsChange }: { params: Record<string, number>; onParamsChange: (p: Record<string, number>) => void }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const acidConc = params.acidConc || 0.1;
  const baseConc = params.baseConc || 0.1;
  const acidVol = params.acidVol || 50;
  const volume = params.volume || 0;
  const equivalenceVol = (acidConc * acidVol) / baseConc;

  const computepH = (v: number) => {
    const nAcid = acidConc * acidVol / 1000;
    const nBase = baseConc * v / 1000;
    const vTotal = (acidVol + v) / 1000;
    if (nBase < nAcid) return -Math.log10((nAcid - nBase) / vTotal);
    if (nBase === nAcid) return 7;
    return 14 + Math.log10((nBase - nAcid) / vTotal);
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const W = canvas.width, H = canvas.height;
    ctx.fillStyle = "#0f172a"; ctx.fillRect(0, 0, W, H);

    const plotX = 50, plotY = 20, plotW = W - 100, plotH = H - 60;
    const maxV = equivalenceVol * 2;

    // Axes
    ctx.strokeStyle = "rgba(148,163,184,0.5)"; ctx.lineWidth = 1;
    ctx.beginPath(); ctx.moveTo(plotX, plotY + plotH); ctx.lineTo(plotX + plotW, plotY + plotH); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(plotX, plotY); ctx.lineTo(plotX, plotY + plotH); ctx.stroke();

    ctx.fillStyle = "#94a3b8"; ctx.font = "10px monospace";
    ctx.fillText("pH", plotX - 20, plotY - 5);
    ctx.fillText("V NaOH (mL)", plotX + plotW - 60, plotY + plotH + 15);

    // pH zones
    const ph7Y = plotY + plotH - (7 / 14) * plotH;
    ctx.fillStyle = "rgba(239,68,68,0.05)"; ctx.fillRect(plotX, ph7Y, plotW, plotY + plotH - ph7Y);
    ctx.fillStyle = "rgba(59,130,246,0.05)"; ctx.fillRect(plotX, plotY, plotW, ph7Y - plotY);

    // Curve
    ctx.strokeStyle = "#a855f7"; ctx.lineWidth = 2.5;
    ctx.beginPath();
    for (let v = 0; v <= maxV; v += 0.2) {
      const pH = Math.max(0, Math.min(14, computepH(v)));
      const x = plotX + (v / maxV) * plotW;
      const y = plotY + plotH - (pH / 14) * plotH;
      v === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
    }
    ctx.stroke();

    // Equivalence
    const eqX = plotX + (equivalenceVol / maxV) * plotW;
    ctx.strokeStyle = "rgba(220,38,38,0.5)"; ctx.lineWidth = 1; ctx.setLineDash([4, 4]);
    ctx.beginPath(); ctx.moveTo(eqX, plotY); ctx.lineTo(eqX, plotY + plotH); ctx.stroke();
    ctx.setLineDash([]);
    ctx.fillStyle = "#dc2626"; ctx.font = "9px monospace";
    ctx.fillText(`Équiv. ${equivalenceVol.toFixed(1)}mL`, eqX + 5, plotY + 15);

    // Current
    const currentpH = Math.max(0, Math.min(14, computepH(volume)));
    const curX = plotX + (volume / maxV) * plotW;
    const curY = plotY + plotH - (currentpH / 14) * plotH;
    ctx.fillStyle = "#10b981"; ctx.beginPath(); ctx.arc(curX, curY, 5, 0, Math.PI * 2); ctx.fill();
    ctx.strokeStyle = "white"; ctx.lineWidth = 2; ctx.stroke();
  }, [acidConc, baseConc, acidVol, volume, equivalenceVol]);

  const currentpH = Math.max(0, Math.min(14, computepH(volume)));

  return (
    <Card className="border-purple-500/20 bg-slate-900/50 overflow-hidden">
      <CardHeader className="pb-2 border-b border-purple-500/10">
        <CardTitle className="text-sm font-semibold flex items-center gap-2 text-purple-400">
          <FlaskConical className="size-4" /> Dosage acido-basique
          <Badge variant="secondary" className="text-[10px] ml-auto bg-purple-500/10 text-purple-400">Expérience</Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="p-4 space-y-3">
        <canvas ref={canvasRef} width={500} height={200} className="w-full rounded-lg" />
        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-1">
            <div className="flex items-center justify-between">
              <label className="text-[10px] text-purple-300">[Acide] mol/L</label>
              <span className="text-[10px] font-mono font-bold text-purple-400">{acidConc}</span>
            </div>
            <Slider min={0.01} max={1} step={0.01} value={[acidConc]} onValueChange={([v]) => onParamsChange({ ...params, acidConc: v })} className="[&_[role=slider]]:bg-purple-500" />
          </div>
          <div className="space-y-1">
            <div className="flex items-center justify-between">
              <label className="text-[10px] text-purple-300">[Base] mol/L</label>
              <span className="text-[10px] font-mono font-bold text-purple-400">{baseConc}</span>
            </div>
            <Slider min={0.01} max={1} step={0.01} value={[baseConc]} onValueChange={([v]) => onParamsChange({ ...params, baseConc: v })} className="[&_[role=slider]]:bg-purple-500" />
          </div>
        </div>
        <div className="space-y-1">
          <div className="flex items-center justify-between">
            <label className="text-[10px] text-purple-300">Volume NaOH ajouté</label>
            <span className="text-[10px] font-mono font-bold text-green-400">{volume.toFixed(1)} mL</span>
          </div>
          <Slider min={0} max={equivalenceVol * 2} step={0.5} value={[volume]} onValueChange={([v]) => onParamsChange({ ...params, volume: v })} className="[&_[role=slider]]:bg-purple-500" />
        </div>
        <div className="grid grid-cols-3 gap-2 text-center">
          <div className="rounded-lg bg-purple-500/10 border border-purple-500/20 p-1.5">
            <p className="text-[9px] text-purple-300">pH</p>
            <p className="text-sm font-mono font-bold" style={{ color: currentpH < 7 ? "#ef4444" : currentpH > 7 ? "#3b82f6" : "#10b981" }}>{currentpH.toFixed(1)}</p>
          </div>
          <div className="rounded-lg bg-purple-500/10 border border-purple-500/20 p-1.5">
            <p className="text-[9px] text-purple-300">Équiv.</p>
            <p className="text-xs font-mono font-bold text-amber-400">{equivalenceVol.toFixed(1)}mL</p>
          </div>
          <div className="rounded-lg bg-purple-500/10 border border-purple-500/20 p-1.5">
            <p className="text-[9px] text-purple-300">État</p>
            <p className="text-[10px] font-bold" style={{ color: volume < equivalenceVol * 0.95 ? "#ef4444" : volume > equivalenceVol * 1.05 ? "#3b82f6" : "#10b981" }}>
              {volume < equivalenceVol * 0.95 ? "Acide" : volume > equivalenceVol * 1.05 ? "Basique" : "≈ Équiv."}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

// ═══════════════════════════════════════════════════════════════
// 📐 FUNCTION EXPLORER
// ═══════════════════════════════════════════════════════════════
function FunctionExplorer({ params, onParamsChange }: { params: Record<string, number>; onParamsChange: (p: Record<string, number>) => void }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const funcType = (params.funcType || 0) as number;
  const a = params.a ?? 1;
  const b = params.b ?? 0;
  const c = params.c ?? 0;

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const W = canvas.width, H = canvas.height;
    const cx = W / 2, cy = H / 2;
    const scaleX = W / 20, scaleY = H / 12;

    ctx.fillStyle = "#0f172a"; ctx.fillRect(0, 0, W, H);

    // Grid
    ctx.strokeStyle = "rgba(99,102,241,0.08)"; ctx.lineWidth = 0.5;
    for (let x = -10; x <= 10; x++) { const px = cx + x * scaleX; ctx.beginPath(); ctx.moveTo(px, 0); ctx.lineTo(px, H); ctx.stroke(); }
    for (let y = -6; y <= 6; y++) { const py = cy - y * scaleY; ctx.beginPath(); ctx.moveTo(0, py); ctx.lineTo(W, py); ctx.stroke(); }

    // Axes
    ctx.strokeStyle = "rgba(148,163,184,0.5)"; ctx.lineWidth = 1;
    ctx.beginPath(); ctx.moveTo(0, cy); ctx.lineTo(W, cy); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(cx, 0); ctx.lineTo(cx, H); ctx.stroke();

    ctx.fillStyle = "#64748b"; ctx.font = "10px monospace";
    ctx.fillText("x", W - 15, cy - 5); ctx.fillText("y", cx + 5, 15);

    // Curve
    ctx.strokeStyle = "#4f46e5"; ctx.lineWidth = 2.5;
    ctx.beginPath();
    let started = false;
    for (let px = 0; px < W; px++) {
      const x = (px - cx) / scaleX;
      let y = 0;
      if (funcType === 0) y = a * x * x + b * x + c;
      else if (funcType === 1) y = a * Math.exp(b * x) + c;
      else if (funcType === 2) { const arg = x + Math.abs(b) + 0.1; y = arg > 0 ? a * Math.log(arg) + c : NaN; }
      else y = a * Math.sin(b * x + c);
      if (isNaN(y) || !isFinite(y) || Math.abs(y) > 20) { started = false; continue; }
      const py = cy - y * scaleY;
      !started ? (ctx.moveTo(px, py), started = true) : ctx.lineTo(px, py);
    }
    ctx.stroke();

    // Derivative for quadratic
    if (funcType === 0) {
      ctx.strokeStyle = "rgba(220,38,38,0.5)"; ctx.lineWidth = 1.5; ctx.setLineDash([5, 5]);
      ctx.beginPath(); started = false;
      for (let px = 0; px < W; px++) {
        const x = (px - cx) / scaleX;
        const y = 2 * a * x + b;
        if (Math.abs(y) > 20) { started = false; continue; }
        const py = cy - y * scaleY;
        !started ? (ctx.moveTo(px, py), started = true) : ctx.lineTo(px, py);
      }
      ctx.stroke(); ctx.setLineDash([]);
      ctx.fillStyle = "#4f46e5"; ctx.fillRect(10, 10, 10, 3);
      ctx.fillStyle = "#94a3b8"; ctx.font = "9px sans-serif"; ctx.fillText("f(x)", 24, 13);
      ctx.fillStyle = "rgba(220,38,38,0.5)"; ctx.fillRect(10, 20, 10, 3);
      ctx.fillStyle = "#94a3b8"; ctx.fillText("f'(x)", 24, 23);
    }
  }, [funcType, a, b, c]);

  const funcLabels = ["f(x) = ax² + bx + c", "f(x) = a·e^(bx) + c", "f(x) = a·ln(x) + c", "f(x) = a·sin(bx + c)"];
  const funcNames = ["Quadratique", "Exponentielle", "Logarithme", "Sinusoïde"];

  return (
    <Card className="border-indigo-500/20 bg-slate-900/50 overflow-hidden">
      <CardHeader className="pb-2 border-b border-indigo-500/10">
        <CardTitle className="text-sm font-semibold flex items-center gap-2 text-indigo-400">
          <Atom className="size-4" /> Explorateur de fonctions
          <Badge variant="secondary" className="text-[10px] ml-auto bg-indigo-500/10 text-indigo-400">Interactive</Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="p-4 space-y-3">
        <canvas ref={canvasRef} width={500} height={250} className="w-full rounded-lg" />
        <div className="flex flex-wrap gap-1.5">
          {funcNames.map((name, i) => (
            <button key={i} onClick={() => onParamsChange({ ...params, funcType: i })}
              className={`px-2.5 py-1 rounded-lg text-[10px] font-medium transition-all ${funcType === i ? "bg-indigo-500 text-white" : "bg-slate-800 text-slate-400 hover:bg-slate-700"}`}>
              {name}
            </button>
          ))}
        </div>
        <div className="rounded-lg bg-indigo-500/5 border border-indigo-500/20 p-1.5 text-center">
          <code className="text-[10px] font-mono font-bold text-indigo-400">{funcLabels[funcType]}</code>
        </div>
        <div className="grid grid-cols-3 gap-2">
          {["a", "b", "c"].map((p) => (
            <div key={p} className="space-y-1">
              <div className="flex items-center justify-between">
                <label className="text-[10px] text-indigo-300">{p}</label>
                <span className="text-[10px] font-mono font-bold text-indigo-400">{(params[p] ?? (p === "a" ? 1 : 0)).toFixed(1)}</span>
              </div>
              <Slider min={-5} max={5} step={0.1} value={[params[p] ?? (p === "a" ? 1 : 0)]} onValueChange={([v]) => onParamsChange({ ...params, [p]: v })} className="[&_[role=slider]]:bg-indigo-500" />
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

// ═══════════════════════════════════════════════════════════════
// 💬 MESSAGE BUBBLE
// ═══════════════════════════════════════════════════════════════
function MessageBubble({ msg }: { msg: Message }) {
  const isUser = msg.role === "user";
  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className={`flex ${isUser ? "justify-end" : "justify-start"}`}>
      <div className={`max-w-[85%] rounded-2xl px-4 py-3 ${
        isUser ? "bg-cyan-600 text-white rounded-br-md" : "bg-slate-800 border border-slate-700 text-slate-200 rounded-bl-md"
      }`}>
        {!isUser && (
          <div className="flex items-center gap-1.5 mb-2">
            <Brain className="size-3 text-cyan-400" />
            <span className="text-[10px] font-semibold text-cyan-400">Prof IA</span>
          </div>
        )}
        <div className="text-sm leading-relaxed whitespace-pre-line">
          {msg.content.split("**").map((part, j) =>
            j % 2 === 1 ? <strong key={j} className="text-white">{part}</strong> : <span key={j}>{part}</span>
          )}
        </div>
        {msg.hints && msg.hints.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mt-3 pt-2 border-t border-slate-700/50">
            {msg.hints.map((hint, i) => (
              <span key={i} className="px-2 py-0.5 rounded-md bg-cyan-500/10 text-cyan-300 text-[10px]">{hint}</span>
            ))}
          </div>
        )}
      </div>
    </motion.div>
  );
}

// ═══════════════════════════════════════════════════════════════
// 🧪 LABO IA PAGE
// ═══════════════════════════════════════════════════════════════
export default function LaboPage() {
  const [ctx, setCtx] = useState<AIContext>(createInitialContext());
  const [input, setInput] = useState("");
  const [activeExperiment, setActiveExperiment] = useState<string | null>(null);
  const [simParams, setSimParams] = useState<Record<string, number>>({ R: 100, C: 100, U0: 5, acidConc: 0.1, baseConc: 0.1, acidVol: 50, volume: 0, funcType: 0, a: 1, b: 0, c: 0 });
  const [learningMode, setLearningMode] = useState<"explain" | "help">("explain");
  const [showPhotoUpload, setShowPhotoUpload] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [ctx.conversationHistory]);

  const handleSend = useCallback((text?: string) => {
    const query = text || input.trim();
    if (!query) return;

    const userMsg: Message = { role: "user", content: query, timestamp: new Date() };
    const result = processMessage(query, ctx);

    const assistantMsg: Message = {
      role: "assistant",
      content: result.response,
      timestamp: new Date(),
      experiment: result.experiment || undefined,
      hints: result.hints,
    };

    setCtx((prev) => ({
      ...prev,
      conversationHistory: [...prev.conversationHistory, userMsg, assistantMsg],
      learningMode: learningMode,
    }));

    if (result.experiment) setActiveExperiment(result.experiment);
    setInput("");
  }, [input, ctx, learningMode]);

  const handlePhotoUpload = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const photoMsg: Message = {
      role: "user",
      content: `📷 Photo importée : ${file.name}`,
      timestamp: new Date(),
    };

    const analysisMsg: Message = {
      role: "assistant",
      content: `🔎 **Analyse de l'image :**\n\nJ'ai reçu ta photo "${file.name}".\n\nEn V1, je ne peux pas encore analyser les images directement. Cependant, je suis prêt à接收 de vraies images via une API IA multimodale (GPT-4V, Claude Vision, etc.).\n\n**Pour l'instant, tu peux :**\n1. Décrire ce que tu vois dans la photo\n2. Copier le texte de l'exercice\n3. Je résoudrai l'exercice étape par étape\n\nDis-moi ce qu'il y a dans ta photo ! 👇`,
      timestamp: new Date(),
      hints: ["Décris l'exercice", "Copie le texte", "Explique le contexte"],
    };

    setCtx((prev) => ({
      ...prev,
      conversationHistory: [...prev.conversationHistory, photoMsg, analysisMsg],
    }));
  };

  const messages = ctx.conversationHistory;

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
          <div className="flex items-center gap-2">
            <button onClick={() => setLearningMode("explain")} className={`px-2.5 py-1 rounded-lg text-[10px] font-medium transition-all ${learningMode === "explain" ? "bg-cyan-500/20 text-cyan-300 border border-cyan-500/30" : "bg-slate-800 text-slate-500"}`}>
              💬 Explique-moi
            </button>
            <button onClick={() => setLearningMode("help")} className={`px-2.5 py-1 rounded-lg text-[10px] font-medium transition-all ${learningMode === "help" ? "bg-amber-500/20 text-amber-300 border border-amber-500/30" : "bg-slate-800 text-slate-500"}`}>
              💡 Aide-moi
            </button>
          </div>
        </div>
      </header>

      <div className="mx-auto max-w-5xl px-4 py-6 space-y-6">
        {/* Welcome */}
        {messages.length === 0 && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center space-y-4 py-8">
            <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-cyan-500/20 to-indigo-500/20 border border-cyan-500/30 mx-auto flex items-center justify-center">
              <Atom className="size-10 text-cyan-400" />
            </div>
            <h2 className="text-2xl font-bold text-white">Assistant Scientifique IA</h2>
            <p className="text-sm text-slate-400 max-w-md mx-auto">
              Pose ta question, importe une photo, ou choisis une expérience. L&apos;IA t&apos;explique, te montre et t&apos;accompagne.
            </p>
            <div className="grid gap-3 sm:grid-cols-3 max-w-2xl mx-auto pt-4">
              {[
                { key: "circuit", icon: "⚡", title: "Circuit RC", desc: "Charge/décharge condensateur", color: "cyan" },
                { key: "dosage", icon: "🧪", title: "Dosage", desc: "Titration acido-basique", color: "purple" },
                { key: "fonction", icon: "📐", title: "Fonctions", desc: "Explorateur de courbes", color: "indigo" },
              ].map((exp) => (
                <button key={exp.key} onClick={() => handleSend(`Montre-moi ${exp.title.toLowerCase()}`)}
                  className={`rounded-xl border border-${exp.color}-500/20 bg-${exp.color}-500/5 p-4 text-left hover:bg-${exp.color}-500/10 transition-all`}>
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
            {messages.map((msg, i) => <MessageBubble key={i} msg={msg} />)}
            <div ref={messagesEndRef} />
          </div>
        )}

        {/* Active Experiment */}
        <AnimatePresence>
          {activeExperiment && (
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}>
              {activeExperiment === "circuit" && <RCCircuit params={simParams} onParamsChange={setSimParams} />}
              {activeExperiment === "dosage" && <DosageExperiment params={simParams} onParamsChange={setSimParams} />}
              {activeExperiment === "fonction" && <FunctionExplorer params={simParams} onParamsChange={setSimParams} />}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Chat Input */}
        <div className="sticky bottom-16 bg-slate-900/90 backdrop-blur-xl border-t border-slate-800 p-4 space-y-2">
          <div className="flex gap-2">
            <button onClick={handlePhotoUpload} className="flex-shrink-0 w-10 h-10 rounded-xl bg-slate-800 border border-slate-700 flex items-center justify-center text-slate-400 hover:bg-slate-700 hover:text-cyan-400 transition-all">
              <Camera className="size-4" />
            </button>
            <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={handleFileChange} />
            <Textarea
              placeholder={learningMode === "help" ? "💡 Pose ta question (je te donnerai des indices)..." : "💬 Pose ta question au Prof IA..."}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              className="min-h-[44px] text-sm resize-none bg-slate-800 border-slate-700 text-white placeholder:text-slate-500"
              onKeyDown={(e) => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); handleSend(); } }}
            />
            <Button onClick={() => handleSend()} disabled={!input.trim()} className="flex-shrink-0 bg-cyan-600 hover:bg-cyan-500">
              <Send className="size-4" />
            </Button>
          </div>
          <div className="flex flex-wrap gap-1.5">
            {["Explique-moi les limites", "Montre-moi un circuit RC", "Montre-moi un dosage", "Résous un exercice", "Donne-moi un indice"].map((q) => (
              <button key={q} onClick={() => handleSend(q)}
                className="px-2 py-0.5 rounded-md bg-slate-800 text-[10px] text-slate-400 hover:bg-slate-700 transition-colors">
                {q}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
