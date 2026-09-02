"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { type VizRequest } from "@/lib/viz-types";

// ═══════════════════════════════════════════════════════════════
// 🔬 DIAGRAMMES SCIENTIFIQUES SVG
// ═══════════════════════════════════════════════════════════════

interface DiagramProps {
  viz: VizRequest;
}

// ─── CIRCUIT ÉLECTRIQUE ───
function CircuitDiagram({ viz }: DiagramProps) {
  return (
    <Card className="border-amber-500/20 bg-slate-900/80 overflow-hidden">
      <CardHeader className="pb-2 border-b border-amber-500/10">
        <CardTitle className="text-sm font-semibold flex items-center gap-2 text-amber-400">
          ⚡ {viz.title}
          <Badge variant="secondary" className="text-[10px] bg-amber-500/10 text-amber-400">Schéma</Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="p-4">
        <svg viewBox="0 0 500 300" className="w-full rounded-lg bg-slate-950">
          {/* Battery */}
          <line x1="50" y1="100" x2="50" y2="200" stroke="#94a3b8" strokeWidth="2" />
          <line x1="35" y1="140" x2="65" y2="140" stroke="#f59e0b" strokeWidth="3" />
          <line x1="42" y1="160" x2="58" y2="160" stroke="#f59e0b" strokeWidth="2" />
          <text x="30" y="135" fill="#f59e0b" fontSize="10" fontFamily="monospace">+</text>
          <text x="35" y="175" fill="#94a3b8" fontSize="10" fontFamily="monospace">−</text>
          <text x="15" y="155" fill="#94a3b8" fontSize="11" fontFamily="monospace">U</text>

          {/* Wire top */}
          <line x1="50" y1="100" x2="150" y2="100" stroke="#6366f1" strokeWidth="2" />
          {/* Resistor R1 */}
          <polyline points="150,100 155,85 165,115 175,85 185,115 195,85 205,115 210,100"
            fill="none" stroke="#10b981" strokeWidth="2" />
          <text x="170" y="78" fill="#10b981" fontSize="11" fontFamily="monospace" textAnchor="middle">R₁</text>

          {/* Wire to R2 */}
          <line x1="210" y1="100" x2="310" y2="100" stroke="#6366f1" strokeWidth="2" />
          {/* Resistor R2 */}
          <polyline points="310,100 315,85 325,115 335,85 345,115 355,85 365,115 370,100"
            fill="none" stroke="#ec4899" strokeWidth="2" />
          <text x="340" y="78" fill="#ec4899" fontSize="11" fontFamily="monospace" textAnchor="middle">R₂</text>

          {/* Wire right side */}
          <line x1="370" y1="100" x2="430" y2="100" stroke="#6366f1" strokeWidth="2" />
          <line x1="430" y1="100" x2="430" y2="200" stroke="#6366f1" strokeWidth="2" />

          {/* Wire bottom */}
          <line x1="430" y1="200" x2="50" y2="200" stroke="#6366f1" strokeWidth="2" />

          {/* Current arrow */}
          <defs>
            <marker id="arrow" markerWidth="8" markerHeight="6" refX="8" refY="3" orient="auto">
              <polygon points="0,0 8,3 0,6" fill="#f59e0b" />
            </marker>
          </defs>
          <line x1="120" y1="88" x2="140" y2="88" stroke="#f59e0b" strokeWidth="1.5" markerEnd="url(#arrow)" />
          <text x="125" y="82" fill="#f59e0b" fontSize="9" fontFamily="monospace">I</text>

          {/* Junction points */}
          <circle cx="50" cy="100" r="3" fill="#6366f1" />
          <circle cx="430" cy="100" r="3" fill="#6366f1" />
          <circle cx="50" cy="200" r="3" fill="#6366f1" />
          <circle cx="430" cy="200" r="3" fill="#6366f1" />

          {/* Title */}
          <text x="250" y="250" fill="#94a3b8" fontSize="12" fontFamily="monospace" textAnchor="middle">
            Circuit série : U = R₁·I + R₂·I
          </text>
        </svg>
        {viz.equations.length > 0 && (
          <div className="rounded-lg bg-amber-500/5 border border-amber-500/20 p-2 text-[10px] text-amber-300 space-y-0.5 mt-3">
            {viz.equations.map((eq, i) => <p key={i}>{eq}</p>)}
          </div>
        )}
      </CardContent>
    </Card>
  );
}

// ─── DIAGRAMME DES FORCES ───
function ForcesDiagram({ viz }: DiagramProps) {
  return (
    <Card className="border-green-500/20 bg-slate-900/80 overflow-hidden">
      <CardHeader className="pb-2 border-b border-green-500/10">
        <CardTitle className="text-sm font-semibold flex items-center gap-2 text-green-400">
          🎯 {viz.title}
          <Badge variant="secondary" className="text-[10px] bg-green-500/10 text-green-400">Schéma</Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="p-4">
        <svg viewBox="0 0 500 300" className="w-full rounded-lg bg-slate-950">
          {/* Surface */}
          <line x1="100" y1="200" x2="400" y2="200" stroke="#94a3b8" strokeWidth="2" />
          {/* Hatching */}
          {Array.from({ length: 15 }, (_, i) => (
            <line key={i} x1={110 + i * 20} y1="200" x2={120 + i * 20} y2="215"
              stroke="#64748b" strokeWidth="1" />
          ))}

          {/* Object */}
          <rect x="210" y="160" width="80" height="40" rx="4" fill="#6366f1" opacity="0.8" />
          <text x="250" y="185" fill="white" fontSize="11" fontFamily="monospace" textAnchor="middle">m</text>

          {/* Poids (down) */}
          <defs>
            <marker id="arrow-down" markerWidth="8" markerHeight="6" refX="4" refY="6" orient="auto">
              <polygon points="0,0 8,0 4,6" fill="#ef4444" />
            </marker>
            <marker id="arrow-up" markerWidth="8" markerHeight="6" refX="4" refY="0" orient="auto">
              <polygon points="0,6 8,6 4,0" fill="#22c55e" />
            </marker>
            <marker id="arrow-right" markerWidth="8" markerHeight="6" refX="8" refY="3" orient="auto">
              <polygon points="0,0 8,3 0,6" fill="#3b82f6" />
            </marker>
            <marker id="arrow-left" markerWidth="8" markerHeight="6" refX="0" refY="3" orient="auto">
              <polygon points="8,0 0,3 8,6" fill="#f59e0b" />
            </marker>
          </defs>

          {/* Poids */}
          <line x1="250" y1="200" x2="250" y2="270" stroke="#ef4444" strokeWidth="2.5" markerEnd="url(#arrow-down)" />
          <text x="260" y="260" fill="#ef4444" fontSize="11" fontFamily="monospace" fontWeight="bold">P⃗ = m·g⃗</text>

          {/* Normale */}
          <line x1="250" y1="160" x2="250" y2="90" stroke="#22c55e" strokeWidth="2.5" markerEnd="url(#arrow-up)" />
          <text x="260" y="100" fill="#22c55e" fontSize="11" fontFamily="monospace" fontWeight="bold">N⃗</text>

          {/* Force appliquée */}
          <line x1="290" y1="180" x2="370" y2="180" stroke="#3b82f6" strokeWidth="2.5" markerEnd="url(#arrow-right)" />
          <text x="340" y="172" fill="#3b82f6" fontSize="11" fontFamily="monospace" fontWeight="bold">F⃗</text>

          {/* Frottement */}
          <line x1="210" y1="180" x2="150" y2="180" stroke="#f59e0b" strokeWidth="2" markerEnd="url(#arrow-left)" />
          <text x="150" y="172" fill="#f59e0b" fontSize="11" fontFamily="monospace" fontWeight="bold">f⃗</text>

          {/* Title */}
          <text x="250" y="290" fill="#94a3b8" fontSize="11" fontFamily="monospace" textAnchor="middle">
            Corps isolé — Plan horizontal
          </text>
        </svg>
        {viz.equations.length > 0 && (
          <div className="rounded-lg bg-green-500/5 border border-green-500/20 p-2 text-[10px] text-green-300 space-y-0.5 mt-3">
            {viz.equations.map((eq, i) => <p key={i}>{eq}</p>)}
          </div>
        )}
      </CardContent>
    </Card>
  );
}

// ─── OPTIQUE ───
function OptiqueDiagram({ viz }: DiagramProps) {
  return (
    <Card className="border-violet-500/20 bg-slate-900/80 overflow-hidden">
      <CardHeader className="pb-2 border-b border-violet-500/10">
        <CardTitle className="text-sm font-semibold flex items-center gap-2 text-violet-400">
          🔍 {viz.title}
          <Badge variant="secondary" className="text-[10px] bg-violet-500/10 text-violet-400">Schéma</Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="p-4">
        <svg viewBox="0 0 500 300" className="w-full rounded-lg bg-slate-950">
          {/* Optical axis */}
          <line x1="30" y1="150" x2="470" y2="150" stroke="#475569" strokeWidth="1" strokeDasharray="4,4" />

          {/* Lens */}
          <ellipse cx="250" cy="150" rx="8" ry="70" fill="none" stroke="#a855f7" strokeWidth="2" />
          <text x="250" y="90" fill="#a855f7" fontSize="11" fontFamily="monospace" textAnchor="middle">L</text>

          {/* Focal points */}
          <circle cx="170" cy="150" r="4" fill="#f59e0b" />
          <text x="170" y="170" fill="#f59e0b" fontSize="10" fontFamily="monospace" textAnchor="middle">F</text>
          <circle cx="330" cy="150" r="4" fill="#f59e0b" />
          <text x="330" y="170" fill="#f59e0b" fontSize="10" fontFamily="monospace" textAnchor="middle">F'</text>

          {/* Object */}
          <line x1="100" y1="150" x2="100" y2="100" stroke="#6366f1" strokeWidth="3" />
          <polygon points="100,100 95,110 105,110" fill="#6366f1" />
          <text x="100" y="92" fill="#6366f1" fontSize="10" fontFamily="monospace" textAnchor="middle">Obj</text>

          {/* Ray 1: parallel to axis */}
          <defs>
            <marker id="arrow-violet" markerWidth="6" markerHeight="4" refX="6" refY="2" orient="auto">
              <polygon points="0,0 6,2 0,4" fill="#a855f7" />
            </marker>
          </defs>
          <line x1="100" y1="100" x2="250" y2="100" stroke="#a855f7" strokeWidth="1.5" />
          <line x1="250" y1="100" x2="400" y2="200" stroke="#a855f7" strokeWidth="1.5" markerEnd="url(#arrow-violet)" />

          {/* Ray 2: through center */}
          <line x1="100" y1="100" x2="400" y2="200" stroke="#10b981" strokeWidth="1" strokeDasharray="3,3" />

          {/* Image */}
          <line x1="330" y1="150" x2="330" y2="200" stroke="#ef4444" strokeWidth="3" />
          <text x="330" y="215" fill="#ef4444" fontSize="10" fontFamily="monospace" textAnchor="middle">Image</text>

          {/* Distance labels */}
          <text x="170" y="240" fill="#94a3b8" fontSize="10" fontFamily="monospace" textAnchor="middle">p</text>
          <text x="310" y="240" fill="#94a3b8" fontSize="10" fontFamily="monospace" textAnchor="middle">p'</text>
          <text x="210" y="240" fill="#94a3b8" fontSize="10" fontFamily="monospace">f</text>
        </svg>
        {viz.equations.length > 0 && (
          <div className="rounded-lg bg-violet-500/5 border border-violet-500/20 p-2 text-[10px] text-violet-300 space-y-0.5 mt-3">
            {viz.equations.map((eq, i) => <p key={i}>{eq}</p>)}
          </div>
        )}
      </CardContent>
    </Card>
  );
}

// ─── CELLULE VÉGÉTALE ───
function CelluleDiagram() {
  return (
    <Card className="border-green-500/20 bg-slate-900/80 overflow-hidden">
      <CardHeader className="pb-2 border-b border-green-500/10">
        <CardTitle className="text-sm font-semibold flex items-center gap-2 text-green-400">
          🌿 Cellule végétale
          <Badge variant="secondary" className="text-[10px] bg-green-500/10 text-green-400">Schéma</Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="p-4">
        <svg viewBox="0 0 500 350" className="w-full rounded-lg bg-slate-950">
          {/* Cell wall */}
          <rect x="50" y="30" width="400" height="290" rx="30" fill="none" stroke="#22c55e" strokeWidth="3" />
          <text x="250" y="20" fill="#22c55e" fontSize="10" fontFamily="monospace" textAnchor="middle">Paroi cellulaire</text>

          {/* Cell membrane */}
          <rect x="65" y="45" width="370" height="260" rx="25" fill="none" stroke="#10b981" strokeWidth="1.5" strokeDasharray="5,3" />
          <text x="250" y="38" fill="#10b981" fontSize="9" fontFamily="monospace" textAnchor="middle">Membrane plasmique</text>

          {/* Cytoplasm */}
          <rect x="80" y="60" width="340" height="230" rx="20" fill="rgba(34,197,94,0.05)" />

          {/* Nucleus */}
          <ellipse cx="250" cy="180" rx="60" ry="50" fill="rgba(99,102,241,0.1)" stroke="#6366f1" strokeWidth="2" />
          <ellipse cx="250" cy="180" rx="20" ry="16" fill="rgba(99,102,241,0.2)" stroke="#6366f1" strokeWidth="1" />
          <text x="250" y="183" fill="#6366f1" fontSize="9" fontFamily="monospace" textAnchor="middle">Noyau</text>

          {/* Chloroplasts */}
          {[[120, 100], [380, 100], [150, 250], [350, 250]].map(([cx, cy], i) => (
            <g key={i}>
              <ellipse cx={cx} cy={cy} rx="30" ry="15" fill="rgba(34,197,94,0.2)" stroke="#22c55e" strokeWidth="1.5" />
              <text x={cx} y={cy + 3} fill="#22c55e" fontSize="7" fontFamily="monospace" textAnchor="middle">Chloro.</text>
            </g>
          ))}

          {/* Vacuole */}
          <ellipse cx="170" cy="170" rx="50" ry="40" fill="rgba(59,130,246,0.1)" stroke="#3b82f6" strokeWidth="1.5" />
          <text x="170" y="173" fill="#3b82f6" fontSize="8" fontFamily="monospace" textAnchor="middle">Vacuole</text>

          {/* Mitochondria */}
          {[[330, 160], [300, 120]].map(([cx, cy], i) => (
            <g key={i}>
              <ellipse cx={cx} cy={cy} rx="18" ry="10" fill="rgba(239,68,68,0.15)" stroke="#ef4444" strokeWidth="1.5" />
              <text x={cx} y={cy + 3} fill="#ef4444" fontSize="6" fontFamily="monospace" textAnchor="middle">Mito.</text>
            </g>
          ))}

          {/* ER */}
          <path d="M280,140 Q300,130 310,140 Q320,150 330,140" fill="none" stroke="#f59e0b" strokeWidth="1" />
          <text x="310" y="155" fill="#f59e0b" fontSize="7" fontFamily="monospace" textAnchor="middle">RE</text>

          {/* Ribosomes */}
          {[[130, 140], [140, 200], [370, 170], [360, 220]].map(([cx, cy], i) => (
            <circle key={i} cx={cx} cy={cy} r="3" fill="#a855f7" />
          ))}
          <text x="130" y="128" fill="#a855f7" fontSize="7" fontFamily="monospace">Ribosomes</text>
        </svg>
      </CardContent>
    </Card>
  );
}

// ═══════════════════════════════════════════════════════════════
// 🔬 ROUTEUR DE DIAGRAMMES
// ═══════════════════════════════════════════════════════════════

export function ScientificDiagram({ viz }: DiagramProps) {
  switch (viz.type) {
    case "diagram-circuit":
      return <CircuitDiagram viz={viz} />;
    case "diagram-forces":
      return <ForcesDiagram viz={viz} />;
    case "diagram-optique":
      return <OptiqueDiagram viz={viz} />;
    case "diagram-cellule":
      return <CelluleDiagram />;
    default:
      return null;
  }
}
