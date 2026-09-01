"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Slider } from "@/components/ui/slider";
import { Button } from "@/components/ui/button";

interface PhysicsSimulationProps {
  variant?: "projectile" | "pendulum" | "wave" | "oscillation";
}

export function PhysicsSimulation({ variant = "projectile" }: PhysicsSimulationProps) {
  if (variant === "projectile") return <ProjectileSim />;
  if (variant === "pendulum") return <PendulumSim />;
  if (variant === "wave") return <WaveSim />;
  return <OscillationSim />;
}

function ProjectileSim() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animRef = useRef<number | null>(null);
  const [v0, setV0] = useState(20);
  const [angle, setAngle] = useState(45);
  const [g, setG] = useState(9.81);
  const [isRunning, setIsRunning] = useState(false);
  const [trail, setTrail] = useState<{ x: number; y: number }[]>([]);
  const startTimeRef = useRef(0);

  const launch = useCallback(() => {
    setIsRunning(true);
    setTrail([]);
    startTimeRef.current = performance.now();

    const animate = (ts: number) => {
      const t = (ts - startTimeRef.current) / 1000;
      const rad = (angle * Math.PI) / 180;
      const vx = v0 * Math.cos(rad);
      const vy = v0 * Math.sin(rad);
      const x = vx * t;
      const y = vy * t - 0.5 * g * t * t;

      if (y < 0 && t > 0.1) {
        setIsRunning(false);
        return;
      }

      setTrail((prev) => [...prev.slice(-200), { x, y }]);
      animRef.current = requestAnimationFrame(animate);
    };

    animRef.current = requestAnimationFrame(animate);
  }, [v0, angle, g]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const W = canvas.width;
    const H = canvas.height;
    const maxRange = (v0 * v0 * Math.sin((2 * angle * Math.PI) / 180)) / g || 50;
    const maxHeight = (v0 * v0 * Math.sin((angle * Math.PI) / 180) ** 2) / (2 * g) || 20;
    const scale = Math.min(W / (maxRange * 1.2), H / (maxHeight * 1.8));
    const groundY = H - 40;

    // Clear
    ctx.fillStyle = "oklch(0.97 0.005 250)";
    ctx.fillRect(0, 0, W, H);

    // Grid
    ctx.strokeStyle = "oklch(0.9 0.01 250)";
    ctx.lineWidth = 0.5;
    for (let i = 0; i < W; i += 40) {
      ctx.beginPath(); ctx.moveTo(i, 0); ctx.lineTo(i, H); ctx.stroke();
    }
    for (let i = 0; i < H; i += 40) {
      ctx.beginPath(); ctx.moveTo(0, i); ctx.lineTo(W, i); ctx.stroke();
    }

    // Ground
    ctx.strokeStyle = "oklch(0.5 0.02 260)";
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(20, groundY);
    ctx.lineTo(W - 20, groundY);
    ctx.stroke();

    // Axes labels
    ctx.fillStyle = "oklch(0.4 0.02 260)";
    ctx.font = "11px sans-serif";
    ctx.fillText("x (m)", W - 40, groundY + 15);
    ctx.fillText("y (m)", 5, 15);

    // Trajectory
    if (trail.length > 1) {
      ctx.strokeStyle = "#4f46e5";
      ctx.lineWidth = 2.5;
      ctx.beginPath();
      trail.forEach((p, i) => {
        const sx = 30 + p.x * scale;
        const sy = groundY - p.y * scale;
        if (i === 0) ctx.moveTo(sx, sy);
        else ctx.lineTo(sx, sy);
      });
      ctx.stroke();

      // Current position
      const last = trail[trail.length - 1];
      const lx = 30 + last.x * scale;
      const ly = groundY - last.y * scale;
      ctx.beginPath();
      ctx.arc(lx, ly, 5, 0, Math.PI * 2);
      ctx.fillStyle = "#dc2626";
      ctx.fill();
      ctx.strokeStyle = "white";
      ctx.lineWidth = 2;
      ctx.stroke();
    }

    // Predicted path (dashed)
    if (!isRunning) {
      const rad = (angle * Math.PI) / 180;
      const vx = v0 * Math.cos(rad);
      const vy = v0 * Math.sin(rad);
      const totalTime = (2 * vy) / g;
      ctx.strokeStyle = "oklch(0.7 0.02 260)";
      ctx.lineWidth = 1;
      ctx.setLineDash([4, 4]);
      ctx.beginPath();
      for (let t = 0; t <= totalTime; t += 0.05) {
        const px = 30 + vx * t * scale;
        const py = groundY - (vy * t - 0.5 * g * t * t) * scale;
        if (t === 0) ctx.moveTo(px, py);
        else ctx.lineTo(px, py);
      }
      ctx.stroke();
      ctx.setLineDash([]);

      // Angle arc
      ctx.strokeStyle = "#d97706";
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.arc(30, groundY, 30, -rad, 0);
      ctx.stroke();
      ctx.fillStyle = "#d97706";
      ctx.font = "10px sans-serif";
      ctx.fillText(`${angle}°`, 40, groundY - 8);
    }

    // Info
    ctx.fillStyle = "oklch(0.4 0.02 260)";
    ctx.font = "10px monospace";
    const range = (v0 * v0 * Math.sin((2 * angle * Math.PI) / 180)) / g;
    const hmax = (v0 * v0 * Math.sin((angle * Math.PI) / 180) ** 2) / (2 * g);
    const tmax = (2 * v0 * Math.sin((angle * Math.PI) / 180)) / g;
    ctx.fillText(`Portée: ${range.toFixed(1)}m`, W - 140, 20);
    ctx.fillText(`H_max: ${hmax.toFixed(1)}m`, W - 140, 35);
    ctx.fillText(`T_total: ${tmax.toFixed(1)}s`, W - 140, 50);
  }, [trail, isRunning, v0, angle, g]);

  return (
    <Card className="border-border/50 bg-card shadow-sm overflow-hidden">
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-semibold flex items-center gap-2">
          <span className="text-lg">🎯</span>
          Simulation — Mouvement parabolique
          <Badge variant="secondary" className="text-[10px] ml-auto">3D</Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <canvas ref={canvasRef} width={500} height={250} className="w-full rounded-xl bg-muted/20 border border-border/30" />

        <div className="grid grid-cols-3 gap-4">
          <div className="space-y-1">
            <div className="flex items-center justify-between">
              <label className="text-xs font-medium">Vitesse v₀</label>
              <span className="text-xs font-mono font-semibold text-primary">{v0} m/s</span>
            </div>
            <Slider min={5} max={50} step={1} value={[v0]} onValueChange={([v]) => setV0(v)} />
          </div>
          <div className="space-y-1">
            <div className="flex items-center justify-between">
              <label className="text-xs font-medium">Angle α</label>
              <span className="text-xs font-mono font-semibold text-amber-600">{angle}°</span>
            </div>
            <Slider min={5} max={85} step={1} value={[angle]} onValueChange={([v]) => setAngle(v)} />
          </div>
          <div className="space-y-1">
            <div className="flex items-center justify-between">
              <label className="text-xs font-medium">Gravité g</label>
              <span className="text-xs font-mono font-semibold text-emerald-600">{g} m/s²</span>
            </div>
            <Slider min={1} max={20} step={0.1} value={[g]} onValueChange={([v]) => setG(v)} />
          </div>
        </div>

        <div className="flex gap-2">
          <Button onClick={launch} size="sm" className="text-xs">
            🚀 Lancer
          </Button>
          <Button onClick={() => { setIsRunning(false); setTrail([]); }} variant="outline" size="sm" className="text-xs">
            🔄 Réinitialiser
          </Button>
        </div>

        <div className="rounded-lg bg-muted/30 p-3 text-xs text-muted-foreground space-y-1">
          <p><strong>Formules :</strong></p>
          <p>x(t) = v₀·cos(α)·t</p>
          <p>y(t) = v₀·sin(α)·t − ½gt²</p>
          <p>Portée R = v₀²·sin(2α)/g</p>
        </div>
      </CardContent>
    </Card>
  );
}

function PendulumSim() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animRef = useRef<number | null>(null);
  const [length, setLength] = useState(150);
  const [angle0, setAngle0] = useState(30);
  const [damping, setDamping] = useState(0.999);
  const thetaRef = useRef((angle0 * Math.PI) / 180);
  const omegaRef = useRef(0);
  const [isRunning, setIsRunning] = useState(false);

  const start = useCallback(() => {
    thetaRef.current = (angle0 * Math.PI) / 180;
    omegaRef.current = 0;
    setIsRunning(true);

    const animate = () => {
      const g = 9.81;
      const dt = 0.02;
      const alpha = -(g / (length / 100)) * Math.sin(thetaRef.current);
      omegaRef.current += alpha * dt;
      omegaRef.current *= damping;
      thetaRef.current += omegaRef.current * dt;

      const canvas = canvasRef.current;
      if (!canvas) return;
      const ctx = canvas.getContext("2d");
      if (!ctx) return;

      const W = canvas.width;
      const H = canvas.height;
      const cx = W / 2;
      const cy = 30;

      ctx.fillStyle = "oklch(0.97 0.005 250)";
      ctx.fillRect(0, 0, W, H);

      // Pivot
      ctx.fillStyle = "oklch(0.4 0.02 260)";
      ctx.beginPath();
      ctx.arc(cx, cy, 5, 0, Math.PI * 2);
      ctx.fill();

      // String
      const bobX = cx + length * Math.sin(thetaRef.current);
      const bobY = cy + length * Math.cos(thetaRef.current);
      ctx.strokeStyle = "oklch(0.5 0.02 260)";
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(cx, cy);
      ctx.lineTo(bobX, bobY);
      ctx.stroke();

      // Bob
      ctx.beginPath();
      ctx.arc(bobX, bobY, 15, 0, Math.PI * 2);
      ctx.fillStyle = "#4f46e5";
      ctx.fill();
      ctx.strokeStyle = "white";
      ctx.lineWidth = 2;
      ctx.stroke();

      // Angle arc
      ctx.strokeStyle = "#d97706";
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.arc(cx, cy, 40, Math.PI / 2 - thetaRef.current, Math.PI / 2);
      ctx.stroke();

      // Angle label
      ctx.fillStyle = "#d97706";
      ctx.font = "10px sans-serif";
      const deg = ((thetaRef.current * 180) / Math.PI).toFixed(1);
      ctx.fillText(`θ = ${deg}°`, cx + 45, cy + 30);

      // Info
      ctx.fillStyle = "oklch(0.4 0.02 260)";
      ctx.font = "10px monospace";
      const T = 2 * Math.PI * Math.sqrt(length / 100 / 9.81);
      ctx.fillText(`Période T ≈ ${T.toFixed(2)}s`, 10, H - 10);

      animRef.current = requestAnimationFrame(animate);
    };

    animRef.current = requestAnimationFrame(animate);
  }, [length, angle0, damping]);

  useEffect(() => {
    return () => {
      if (animRef.current) cancelAnimationFrame(animRef.current);
    };
  }, []);

  return (
    <Card className="border-border/50 bg-card shadow-sm overflow-hidden">
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-semibold flex items-center gap-2">
          <span className="text-lg">🎡</span>
          Simulation — Pendule
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <canvas ref={canvasRef} width={500} height={250} className="w-full rounded-xl bg-muted/20 border border-border/30" />

        <div className="grid grid-cols-3 gap-4">
          <div className="space-y-1">
            <div className="flex items-center justify-between">
              <label className="text-xs font-medium">Longueur L</label>
              <span className="text-xs font-mono font-semibold text-primary">{length} cm</span>
            </div>
            <Slider min={50} max={250} step={5} value={[length]} onValueChange={([v]) => setLength(v)} />
          </div>
          <div className="space-y-1">
            <div className="flex items-center justify-between">
              <label className="text-xs font-medium">Angle initial</label>
              <span className="text-xs font-mono font-semibold text-amber-600">{angle0}°</span>
            </div>
            <Slider min={5} max={60} step={1} value={[angle0]} onValueChange={([v]) => setAngle0(v)} />
          </div>
          <div className="space-y-1">
            <div className="flex items-center justify-between">
              <label className="text-xs font-medium">Amortissement</label>
              <span className="text-xs font-mono font-semibold text-emerald-600">{damping}</span>
            </div>
            <Slider min={0.98} max={1} step={0.001} value={[damping]} onValueChange={([v]) => setDamping(v)} />
          </div>
        </div>

        <div className="flex gap-2">
          <Button onClick={start} size="sm" className="text-xs">▶️ Démarrer</Button>
          <Button onClick={() => { setIsRunning(false); if (animRef.current) cancelAnimationFrame(animRef.current); }} variant="outline" size="sm" className="text-xs">⏹️ Stop</Button>
        </div>

        <div className="rounded-lg bg-muted/30 p-3 text-xs text-muted-foreground space-y-1">
          <p><strong>Période :</strong> T = 2π√(L/g)</p>
          <p>La période ne dépend PAS de l&apos;angle (petites oscillations).</p>
        </div>
      </CardContent>
    </Card>
  );
}

function WaveSim() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animRef = useRef<number | null>(null);
  const timeRef = useRef(0);
  const [amplitude, setAmplitude] = useState(40);
  const [frequency, setFrequency] = useState(2);
  const [wavelength, setWavelength] = useState(100);
  const [speed, setSpeed] = useState(1);

  useEffect(() => {
    const animate = () => {
      timeRef.current += 0.03;
      const canvas = canvasRef.current;
      if (!canvas) return;
      const ctx = canvas.getContext("2d");
      if (!ctx) return;

      const W = canvas.width;
      const H = canvas.height;
      const cy = H / 2;

      ctx.fillStyle = "oklch(0.97 0.005 250)";
      ctx.fillRect(0, 0, W, H);

      // Grid
      ctx.strokeStyle = "oklch(0.9 0.01 250)";
      ctx.lineWidth = 0.5;
      for (let y = 0; y < H; y += 30) {
        ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(W, y); ctx.stroke();
      }

      // Equilibrium
      ctx.strokeStyle = "oklch(0.7 0.02 260)";
      ctx.lineWidth = 1;
      ctx.setLineDash([4, 4]);
      ctx.beginPath();
      ctx.moveTo(0, cy);
      ctx.lineTo(W, cy);
      ctx.stroke();
      ctx.setLineDash([]);

      // Wave
      ctx.strokeStyle = "#4f46e5";
      ctx.lineWidth = 2.5;
      ctx.beginPath();
      for (let x = 0; x < W; x++) {
        const y = cy - amplitude * Math.sin(2 * Math.PI * (x / wavelength - frequency * timeRef.current));
        if (x === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.stroke();

      // Wavelength marker
      ctx.strokeStyle = "#059669";
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(20, cy + amplitude + 20);
      ctx.lineTo(20 + wavelength, cy + amplitude + 20);
      ctx.stroke();
      ctx.fillStyle = "#059669";
      ctx.font = "10px sans-serif";
      ctx.fillText("λ", 20 + wavelength / 2 - 3, cy + amplitude + 35);

      // Amplitude marker
      ctx.strokeStyle = "#dc2626";
      ctx.lineWidth = 1;
      ctx.setLineDash([2, 2]);
      ctx.beginPath();
      ctx.moveTo(W - 30, cy);
      ctx.lineTo(W - 30, cy - amplitude);
      ctx.stroke();
      ctx.setLineDash([]);
      ctx.fillStyle = "#dc2626";
      ctx.fillText("A", W - 25, cy - amplitude / 2);

      // Info
      ctx.fillStyle = "oklch(0.4 0.02 260)";
      ctx.font = "10px monospace";
      ctx.fillText(`T = ${(1 / frequency).toFixed(2)}s`, 10, 20);
      ctx.fillText(`v = λ·f = ${(wavelength * frequency / 100).toFixed(1)} m/s`, 10, 35);

      animRef.current = requestAnimationFrame(animate);
    };

    animRef.current = requestAnimationFrame(animate);
    return () => { if (animRef.current) cancelAnimationFrame(animRef.current); };
  }, [amplitude, frequency, wavelength]);

  return (
    <Card className="border-border/50 bg-card shadow-sm overflow-hidden">
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-semibold flex items-center gap-2">
          <span className="text-lg">🌊</span>
          Simulation — Onde progressive
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <canvas ref={canvasRef} width={500} height={200} className="w-full rounded-xl bg-muted/20 border border-border/30" />

        <div className="grid grid-cols-3 gap-4">
          <div className="space-y-1">
            <div className="flex items-center justify-between">
              <label className="text-xs font-medium">Amplitude A</label>
              <span className="text-xs font-mono font-semibold text-primary">{amplitude}px</span>
            </div>
            <Slider min={10} max={70} step={5} value={[amplitude]} onValueChange={([v]) => setAmplitude(v)} />
          </div>
          <div className="space-y-1">
            <div className="flex items-center justify-between">
              <label className="text-xs font-medium">Fréquence f</label>
              <span className="text-xs font-mono font-semibold text-amber-600">{frequency} Hz</span>
            </div>
            <Slider min={0.5} max={5} step={0.5} value={[frequency]} onValueChange={([v]) => setFrequency(v)} />
          </div>
          <div className="space-y-1">
            <div className="flex items-center justify-between">
              <label className="text-xs font-medium">Longueur λ</label>
              <span className="text-xs font-mono font-semibold text-emerald-600">{wavelength}px</span>
            </div>
            <Slider min={40} max={250} step={10} value={[wavelength]} onValueChange={([v]) => setWavelength(v)} />
          </div>
        </div>

        <div className="rounded-lg bg-muted/30 p-3 text-xs text-muted-foreground space-y-1">
          <p><strong>Relation fondamentale :</strong> v = λ × f</p>
          <p>L&apos;onde se propage sans transporter de matière — elle transporte de l&apos;énergie.</p>
        </div>
      </CardContent>
    </Card>
  );
}

function OscillationSim() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animRef = useRef<number | null>(null);
  const timeRef = useRef(0);
  const [omega, setOmega] = useState(3);
  const [amp, setAmp] = useState(40);

  useEffect(() => {
    const animate = () => {
      timeRef.current += 0.02;
      const canvas = canvasRef.current;
      if (!canvas) return;
      const ctx = canvas.getContext("2d");
      if (!ctx) return;

      const W = canvas.width;
      const H = canvas.height;
      const cx = W / 2;
      const cy = H / 2;

      ctx.fillStyle = "oklch(0.97 0.005 250)";
      ctx.fillRect(0, 0, W, H);

      // Spring
      ctx.strokeStyle = "oklch(0.5 0.02 260)";
      ctx.lineWidth = 2;
      ctx.beginPath();
      const springTop = 20;
      const displacement = amp * Math.sin(omega * timeRef.current);
      const springBottom = cy + displacement;
      const coils = 10;
      for (let i = 0; i <= coils; i++) {
        const y = springTop + (i / coils) * (springBottom - springTop);
        const x = cx + (i % 2 === 0 ? -15 : 15);
        if (i === 0) ctx.moveTo(cx, y);
        else ctx.lineTo(x, y);
      }
      ctx.lineTo(cx, springBottom);
      ctx.stroke();

      // Mass
      ctx.fillStyle = "#4f46e5";
      ctx.fillRect(cx - 25, springBottom, 50, 30);
      ctx.fillStyle = "white";
      ctx.font = "10px sans-serif";
      ctx.textAlign = "center";
      ctx.fillText("m", cx, springBottom + 18);

      // Equilibrium line
      ctx.strokeStyle = "oklch(0.7 0.02 260)";
      ctx.setLineDash([4, 4]);
      ctx.beginPath();
      ctx.moveTo(20, cy);
      ctx.lineTo(W - 20, cy);
      ctx.stroke();
      ctx.setLineDash([]);
      ctx.fillStyle = "oklch(0.4 0.02 260)";
      ctx.textAlign = "left";
      ctx.fillText("Équilibre", 25, cy - 5);

      // Displacement arrow
      if (Math.abs(displacement) > 2) {
        ctx.strokeStyle = "#dc2626";
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.moveTo(cx + 35, cy);
        ctx.lineTo(cx + 35, springBottom);
        ctx.stroke();
        ctx.fillStyle = "#dc2626";
        ctx.fillText(`x = ${displacement.toFixed(1)}`, cx + 40, (cy + springBottom) / 2);
      }

      ctx.textAlign = "left";
      animRef.current = requestAnimationFrame(animate);
    };

    animRef.current = requestAnimationFrame(animate);
    return () => { if (animRef.current) cancelAnimationFrame(animRef.current); };
  }, [omega, amp]);

  return (
    <Card className="border-border/50 bg-card shadow-sm overflow-hidden">
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-semibold flex items-center gap-2">
          <span className="text-lg">⚙️</span>
          Simulation — Oscillations
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <canvas ref={canvasRef} width={500} height={250} className="w-full rounded-xl bg-muted/20 border border-border/30" />

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1">
            <div className="flex items-center justify-between">
              <label className="text-xs font-medium">Pulsation ω</label>
              <span className="text-xs font-mono font-semibold text-primary">{omega} rad/s</span>
            </div>
            <Slider min={1} max={10} step={0.5} value={[omega]} onValueChange={([v]) => setOmega(v)} />
          </div>
          <div className="space-y-1">
            <div className="flex items-center justify-between">
              <label className="text-xs font-medium">Amplitude A</label>
              <span className="text-xs font-mono font-semibold text-amber-600">{amp}px</span>
            </div>
            <Slider min={10} max={60} step={5} value={[amp]} onValueChange={([v]) => setAmp(v)} />
          </div>
        </div>

        <div className="rounded-lg bg-muted/30 p-3 text-xs text-muted-foreground space-y-1">
          <p><strong>x(t) = A·sin(ωt)</strong></p>
          <p>Période T = 2π/ω = {(2 * Math.PI / omega).toFixed(2)}s</p>
          <p>Fréquence f = ω/2π = {(omega / (2 * Math.PI)).toFixed(2)}Hz</p>
        </div>
      </CardContent>
    </Card>
  );
}
