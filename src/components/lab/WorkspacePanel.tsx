"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import {
  X, Edit3, Check, RotateCcw, Eye, EyeOff, Copy,
} from "lucide-react";
import type { LabVizSpec, LabParameter } from "@/lib/lab/lab-schema";

// ═══════════════════════════════════════════════════════════════
// 📋 WORKSPACE PANEL — Components & Parameters
// ═══════════════════════════════════════════════════════════════

interface WorkspaceItem {
  id: string;
  label: string;
  icon: string;
  type: string;
  params: Record<string, unknown>;
  visible: boolean;
}

interface WorkspacePanelProps {
  spec: LabVizSpec | null;
  sliders: LabParameter[];
  onParamChange: (key: string, value: number) => void;
  onAddComponent?: (component: { id: string; label: string; icon: string; type: string; defaultValue: Record<string, unknown> }) => void;
  onRemoveComponent?: (id: string) => void;
}

export function WorkspacePanel({
  spec,
  sliders,
  onParamChange,
}: WorkspacePanelProps) {
  const [editingParam, setEditingParam] = useState<string | null>(null);
  const [editValue, setEditValue] = useState("");

  if (!spec) return null;

  // Build workspace items from spec
  const items: WorkspaceItem[] = [];

  // Extract objects from scene
  if (spec.scene?.objects) {
    for (const obj of spec.scene.objects) {
      items.push({
        id: obj.id,
        label: obj.label || obj.type,
        icon: getObjectIcon(obj.type),
        type: obj.type,
        params: obj.props,
        visible: obj.visible !== false,
      });
    }
  }

  // Extract molecules
  if (spec.type === "molecule-3d") {
    const mol = spec.params.molecule as string;
    const mols = (spec.params.molecules as string[]) || (mol ? [mol] : []);
    for (const m of mols) {
      items.push({
        id: `mol-${m}`,
        label: m,
        icon: "🧪",
        type: "molecule",
        params: { molecule: m },
        visible: true,
      });
    }
  }

  // Extract functions
  if (spec.params.functions && Array.isArray(spec.params.functions)) {
    const funcs = spec.params.functions as string[];
    const labels = (spec.params.labels as string[]) || funcs.map((_, i) => `f${i + 1}(x)`);
    const colors = (spec.params.colors as string[]) || funcs.map(() => "#6366f1");
    funcs.forEach((f, i) => {
      items.push({
        id: `func-${i}`,
        label: `${labels[i]} = ${f}`,
        icon: "📈",
        type: "function",
        params: { expr: f, color: colors[i] },
        visible: true,
      });
    });
  }

  const handleStartEdit = (key: string, value: unknown) => {
    setEditingParam(key);
    setEditValue(String(value));
  };

  const handleSaveEdit = (key: string) => {
    const numVal = parseFloat(editValue);
    if (!isNaN(numVal)) {
      onParamChange(key, numVal);
    }
    setEditingParam(null);
  };

  return (
    <div className="space-y-3">
      {/* Components list */}
      {items.length > 0 && (
        <div>
          <p className="text-[10px] font-semibold text-slate-500 uppercase tracking-wide mb-2">Composants</p>
          <div className="space-y-1">
            {items.map((item) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                className="flex items-center gap-2 px-2 py-1.5 rounded-lg bg-slate-800/50 border border-slate-700/30"
              >
                <span className="text-sm">{item.icon}</span>
                <span className="text-[11px] text-slate-300 flex-1 truncate">{item.label}</span>
                <span className="text-[9px] text-slate-600">{item.type}</span>
              </motion.div>
            ))}
          </div>
        </div>
      )}

      {/* Parameters / Sliders */}
      {sliders.length > 0 && (
        <div>
          <p className="text-[10px] font-semibold text-slate-500 uppercase tracking-wide mb-2">Paramètres</p>
          <div className="space-y-2">
            {sliders.map((s) => (
              <div key={s.id} className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="text-[10px] text-slate-400 w-14 font-mono">{s.symbol}</span>
                  {editingParam === s.id ? (
                    <div className="flex items-center gap-1 flex-1">
                      <Input
                        type="number"
                        value={editValue}
                        onChange={(e) => setEditValue(e.target.value)}
                        onKeyDown={(e) => { if (e.key === "Enter") handleSaveEdit(s.id); }}
                        className="h-6 text-[11px] bg-slate-800 border-cyan-500/50 text-white text-center"
                        autoFocus
                      />
                      <Button
                        variant="ghost"
                        size="sm"
                        className="size-5 p-0 text-cyan-400"
                        onClick={() => handleSaveEdit(s.id)}
                      >
                        <Check className="size-3" />
                      </Button>
                    </div>
                  ) : (
                    <button
                      onClick={() => handleStartEdit(s.id, s.value)}
                      className="text-[11px] text-white font-mono hover:text-cyan-400 transition-colors"
                    >
                      {s.value}
                    </button>
                  )}
                  <span className="text-[9px] text-slate-500">{s.unit}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-[9px] text-slate-600 w-14">{s.min}</span>
                  <Slider
                    min={s.min}
                    max={s.max}
                    step={s.step}
                    value={[s.value]}
                    onValueChange={([v]) => onParamChange(s.id, v)}
                    className="flex-1 [&_[role=slider]]:bg-cyan-500"
                  />
                  <span className="text-[9px] text-slate-600">{s.max}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Equations */}
      {spec.equations.length > 0 && (
        <div>
          <p className="text-[10px] font-semibold text-slate-500 uppercase tracking-wide mb-2">Équations</p>
          <div className="space-y-1">
            {spec.equations.map((eq, i) => (
              <div key={i} className="text-[11px] text-slate-300 font-mono bg-slate-800/50 rounded px-2 py-1 border border-slate-700/30">
                {eq}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Helper: icon per object type ───
function getObjectIcon(type: string): string {
  const icons: Record<string, string> = {
    sphere: "🔵", cube: "🟦", cylinder: "🛢️", cone: "🔺", torus: "🍩",
    plane: "⬜", point: "⚫", "vector-3d": "➡️", "curve-3d": "🌀",
    surface: "🌊", molecule: "🧪", orbit: "🪐",
    "function-plot": "📈", "multi-function-plot": "📊", "bar-chart": "📊",
    projectile: "🚀", pendulum: "🔔", wave: "🌊", spring: "🌀",
    circuit: "⚡", cell: "🔬",
  };
  return icons[type] || "📦";
}
