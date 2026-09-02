"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Play, Pause, Square, RotateCcw, FastForward, Rewind } from "lucide-react";

// ═══════════════════════════════════════════════════════════════
// 🎬 ANIMATION TIMELINE — Contrôles de lecture
// ═══════════════════════════════════════════════════════════════

interface AnimationTimelineProps {
  duration: number; // seconds
  onTimeChange: (time: number) => void;
  onPlay: () => void;
  onPause: () => void;
  onReset: () => void;
  isPlaying: boolean;
  currentTime: number;
  speed: number;
  onSpeedChange: (speed: number) => void;
  label?: string;
}

export function AnimationTimeline({
  duration,
  onTimeChange,
  onPlay,
  onPause,
  onReset,
  isPlaying,
  currentTime,
  speed,
  onSpeedChange,
  label,
}: AnimationTimelineProps) {
  return (
    <div className="flex items-center gap-2 py-2">
      {/* Reset */}
      <Button variant="ghost" size="sm" className="size-7 p-0 text-slate-400 hover:text-white"
        onClick={onReset} title="Réinitialiser">
        <RotateCcw className="size-3.5" />
      </Button>

      {/* Rewind */}
      <Button variant="ghost" size="sm" className="size-7 p-0 text-slate-400 hover:text-white"
        onClick={() => onTimeChange(Math.max(0, currentTime - 0.5))} title="Reculer">
        <Rewind className="size-3.5" />
      </Button>

      {/* Play/Pause */}
      <Button variant="ghost" size="sm" className="size-8 p-0 text-cyan-400 hover:text-cyan-300"
        onClick={isPlaying ? onPause : onPlay}>
        {isPlaying ? <Pause className="size-4" /> : <Play className="size-4" />}
      </Button>

      {/* Stop */}
      <Button variant="ghost" size="sm" className="size-7 p-0 text-slate-400 hover:text-white"
        onClick={() => { onReset(); onPause(); }} title="Stop">
        <Square className="size-3" />
      </Button>

      {/* Forward */}
      <Button variant="ghost" size="sm" className="size-7 p-0 text-slate-400 hover:text-white"
        onClick={() => onTimeChange(Math.min(duration, currentTime + 0.5))} title="Avancer">
        <FastForward className="size-3.5" />
      </Button>

      {/* Time slider */}
      <div className="flex-1 flex items-center gap-2">
        <Slider
          min={0}
          max={duration}
          step={0.01}
          value={[currentTime]}
          onValueChange={([v]) => onTimeChange(v)}
          className="[&_[role=slider]]:bg-cyan-500"
        />
        <span className="text-[10px] font-mono text-cyan-400 w-20 text-right">
          {currentTime.toFixed(2)}s / {duration.toFixed(1)}s
        </span>
      </div>

      {/* Speed control */}
      <div className="flex items-center gap-1 text-[10px] text-slate-400">
        <span>×</span>
        <select
          value={speed}
          onChange={(e) => onSpeedChange(parseFloat(e.target.value))}
          className="bg-slate-800 border border-slate-700 rounded px-1 py-0.5 text-[10px] text-white"
        >
          <option value={0.25}>0.25</option>
          <option value={0.5}>0.5</option>
          <option value={1}>1</option>
          <option value={2}>2</option>
          <option value={4}>4</option>
        </select>
      </div>

      {label && (
        <span className="text-[10px] text-slate-500 ml-1">{label}</span>
      )}
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════
// 🪝 HOOK : useAnimation — gestion du temps d'animation
// ═══════════════════════════════════════════════════════════════

export function useAnimation(duration: number, speed = 1) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const animRef = useRef<number>(0);
  const lastFrameRef = useRef(0);

  const tick = useCallback((now: number) => {
    if (lastFrameRef.current === 0) lastFrameRef.current = now;
    const delta = (now - lastFrameRef.current) * speed / 1000;
    lastFrameRef.current = now;

    setCurrentTime((prev) => {
      const next = prev + delta;
      if (next >= duration) {
        setIsPlaying(false);
        return duration;
      }
      return next;
    });
  }, [duration, speed]);

  useEffect(() => {
    if (!isPlaying) {
      lastFrameRef.current = 0;
      return;
    }
    animRef.current = requestAnimationFrame(function loop(now: number) {
      tick(now);
      animRef.current = requestAnimationFrame(loop);
    });
    return () => cancelAnimationFrame(animRef.current);
  }, [isPlaying, tick]);

  const play = useCallback(() => {
    if (currentTime >= duration) setCurrentTime(0);
    setIsPlaying(true);
  }, [currentTime, duration]);

  const pause = useCallback(() => setIsPlaying(false), []);

  const reset = useCallback(() => {
    setCurrentTime(0);
    lastFrameRef.current = 0;
  }, []);

  const seek = useCallback((t: number) => setCurrentTime(Math.max(0, Math.min(duration, t))), [duration]);

  return { isPlaying, currentTime, play, pause, reset, seek, speed };
}
