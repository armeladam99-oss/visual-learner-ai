// ═══════════════════════════════════════════════════════════════
// 📐 LAB SCHEMA — Spécifications universelles de visualisation
// Architecture : Domaine → Type → Paramètres → Rendu
// ═══════════════════════════════════════════════════════════════

export type LabDomain =
  | "math"
  | "physics"
  | "chemistry"
  | "biology"
  | "geometry"
  | "astronomy"
  | "electricity"
  | "data"
  | "animation";

// ─── Spécification d'une visualisation ───
export interface LabVizSpec {
  id: string;
  domain: LabDomain;
  type: string;
  title: string;
  description: string;
  params: Record<string, unknown>;
  equations: string[];
  explanation?: LabExplanation;
}

// ─── Explication pédagogique ───
export interface LabExplanation {
  observation: string;
  explanation: string;
  calculation: string;
  interpretation: string;
}

// ─── Variants pour chaque type ───
export type LabVizVariant =
  // Math 2D
  | "function-plot"
  | "multi-function-plot"
  | "derivative-plot"
  | "integral-plot"
  | "parametric-plot"
  | "polar-plot"
  | "sequence-plot"
  | "statistics-plot"
  | "regression-plot"
  // Math 3D
  | "surface-3d"
  | "curve-3d"
  | "vector-field-3d"
  // Geometry
  | "triangle-construction"
  | "circle-construction"
  | "transformation-2d"
  // Physics
  | "projectile-sim"
  | "free-fall-sim"
  | "pendulum-sim"
  | "spring-sim"
  | "wave-sim"
  | "collision-sim"
  // Electricity
  | "ohm-law"
  | "circuit-series"
  | "circuit-parallel"
  | "circuit-rc"
  | "circuit-rl"
  // Optics
  | "mirror-reflect"
  | "lens-refract"
  // Chemistry
  | "molecule-3d"
  | "periodic-table"
  | "reaction-balancer"
  | "ph-calculator"
  | "solution-dilution"
  // Biology
  | "cell-animal"
  | "cell-plant"
  | "dna-helix"
  | "mitosis"
  // Astronomy
  | "solar-system"
  | "orbit-sim"
  | "moon-phases"
  // Data
  | "bar-chart"
  | "histogram"
  | "scatter-plot"
  | "pie-chart"
  | "box-plot";

// ─── Paramètres auto-détectés pour sliders ───
export interface LabSliderParam {
  key: string;
  label: string;
  symbol: string;
  unit: string;
  min: number;
  max: number;
  step: number;
  default: number;
  current: number;
}

// ─── Spécification complète d'un workspace ───
export interface LabWorkspace {
  id: string;
  title: string;
  visualizations: LabVizSpec[];
  sliders: LabSliderParam[];
  history: string[];
  activeVizId: string | null;
}

// ─── Réponse du moteur ───
export interface LabEngineResult {
  success: boolean;
  specs: LabVizSpec[];
  sliders: LabSliderParam[];
  explanation: string;
  error?: string;
  suggestions?: string[];
}

// ═══════════════════════════════════════════════════════════════
// 🔧 HELPERS
// ═══════════════════════════════════════════════════════════════

let _vizIdCounter = 0;
export function generateVizId(): string {
  return `viz-${Date.now()}-${++_vizIdCounter}`;
}

export function createSlider(
  key: string,
  label: string,
  symbol: string,
  unit: string,
  min: number,
  max: number,
  step: number,
  defaultVal: number
): LabSliderParam {
  return { key, label, symbol, unit, min, max, step, default: defaultVal, current: defaultVal };
}

export function createVizSpec(
  domain: LabDomain,
  type: string,
  title: string,
  params: Record<string, unknown>,
  equations: string[] = [],
  description = ""
): LabVizSpec {
  return {
    id: generateVizId(),
    domain,
    type,
    title,
    description,
    params,
    equations,
  };
}

// ─── Extraction automatique des paramètres d'une expression ───
export function extractParams(expr: string): string[] {
  const params = new Set<string>();
  // Match standalone letters that aren't function names or x
  const fnNames = ["sin", "cos", "tan", "ln", "log", "exp", "sqrt", "abs", "asin", "acos", "atan"];
  const matches = expr.match(/\b([a-wyz])\b/gi) || [];
  for (const m of matches) {
    const lower = m.toLowerCase();
    if (lower !== "x" && lower !== "y" && lower !== "z" && lower !== "t" && lower !== "i" && lower !== "n" && !fnNames.includes(lower)) {
      params.add(lower);
    }
  }
  return [...params];
}

// ─── Analyse mathématique d'une fonction ───
export function analyzeFunction(
  expr: string,
  xMin: number,
  xMax: number,
  evalFn: (expr: string, x: number) => number
): {
  zeros: number[];
  minimum: { x: number; y: number } | null;
  maximum: { x: number; y: number } | null;
  domain: string;
  derivative: string;
} {
  const zeros: number[] = [];
  let minY = Infinity;
  let minX = 0;
  let maxY = -Infinity;
  let maxX = 0;

  for (let x = xMin; x <= xMax; x += 0.05) {
    const y = evalFn(expr, x);
    const yNext = evalFn(expr, x + 0.05);

    if (isFinite(y) && isFinite(yNext) && y * yNext <= 0 && Math.abs(y) < 1000) {
      zeros.push(Math.round(x * 100) / 100);
    }
    if (isFinite(y)) {
      if (y < minY) { minY = y; minX = x; }
      if (y > maxY) { maxY = y; maxX = x; }
    }
  }

  return {
    zeros: zeros.slice(0, 8),
    minimum: isFinite(minY) ? { x: Math.round(minX * 100) / 100, y: Math.round(minY * 100) / 100 } : null,
    maximum: isFinite(maxY) ? { x: Math.round(maxX * 100) / 100, y: Math.round(maxY * 100) / 100 } : null,
    domain: `ℝ \\ {x | discontinuités}`,
    derivative: `f'(x) ≈ [f(x+h)−f(x)]/h`,
  };
}
