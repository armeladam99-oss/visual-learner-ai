// ═══════════════════════════════════════════════════════════════
// 📐 LAB SCHEMA V3 — Universal Scientific Visualization
// Architecture : Scene → Objects → Primitives → Renderers
// ═══════════════════════════════════════════════════════════════

export type LabDomain =
  | "math" | "physics" | "chemistry" | "biology"
  | "geometry" | "astronomy" | "electricity" | "data" | "animation";

// ─── Core specification ───
export interface LabVizSpec {
  id: string;
  domain: LabDomain;
  type: string;
  title: string;
  description: string;
  params: Record<string, unknown>;
  equations: string[];
  explanation?: LabExplanation;
  scene?: LabScene;
}

export interface LabExplanation {
  observation: string;
  explanation: string;
  calculation: string;
  interpretation: string;
}

// ─── Scene (multi-object container) ───
export interface LabScene {
  objects: LabObject[];
  camera?: LabCamera;
  background?: string;
  grid?: boolean;
  axes?: boolean;
}

export interface LabCamera {
  position: [number, number, number];
  target: [number, number, number];
  fov: number;
  autoRotate?: boolean;
}

// ─── Generic object ───
export interface LabObject {
  id: string;
  type: LabObjectType;
  position?: [number, number, number];
  rotation?: [number, number, number];
  scale?: [number, number, number] | number;
  color?: string;
  opacity?: number;
  visible?: boolean;
  label?: string;
  props: Record<string, unknown>;
}

export type LabObjectType =
  // 3D Primitives
  | "sphere" | "cube" | "cylinder" | "cone" | "torus" | "plane" | "point"
  // 3D Math
  | "surface" | "curve-3d" | "vector-3d" | "line-3d"
  // 2D
  | "function-plot" | "multi-function-plot" | "graph-2d" | "bar-chart"
  // Physics
  | "projectile" | "pendulum" | "wave" | "spring"
  // Chemistry
  | "molecule" | "atom"
  // Geometry
  | "point-2d" | "line-2d" | "segment-2d" | "circle-2d" | "polygon-2d" | "angle-2d" | "vector-2d"
  // Diagrams
  | "circuit" | "cell" | "orbit"
  // Custom
  | "custom";

// ─── Parameters ───
export interface LabParameter {
  id: string;
  name: string;
  symbol: string;
  value: number;
  min: number;
  max: number;
  step: number;
  unit: string;
}

// ─── Modification commands ───
export interface LabCommand {
  type: "add" | "remove" | "update" | "transform" | "animate" | "reset";
  target?: string; // object id or "scene"
  data: Record<string, unknown>;
}

// ─── Workspace ───
export interface LabWorkspace {
  id: string;
  title: string;
  visualizations: LabVizSpec[];
  parameters: LabParameter[];
  sliders: LabParameter[];
  history: string[];
  activeVizId: string | null;
  commands: LabCommand[];
}

// ─── AI response format ───
export interface LabAIResponse {
  response: string;
  spec?: LabVizSpec;
  commands?: LabCommand[];
}

// ═══════════════════════════════════════════════════════════════
// 🔢 SAFE MATH EVALUATION
// ═══════════════════════════════════════════════════════════════

const MATH_OPS: Record<string, (x: number) => number> = {
  sin: Math.sin, cos: Math.cos, tan: Math.tan,
  abs: Math.abs, sqrt: Math.sqrt, log: Math.log, ln: Math.log,
  exp: Math.exp, asin: Math.asin, acos: Math.acos, atan: Math.atan,
  sinh: Math.sinh, cosh: Math.cosh,
  floor: Math.floor, ceil: Math.ceil, round: Math.round,
};

export function safeEval(expr: string, x: number): number {
  let processed = expr
    .replace(/\b(pi|PI)\b/g, `(${Math.PI})`)
    .replace(/\be\b/g, `(${Math.E})`)
    .replace(/\^/g, "**");
  processed = processed.replace(/\bx\b/g, `(${x})`);
  for (const [name] of Object.entries(MATH_OPS)) {
    const regex = new RegExp(`\\\\b${name}\\\\s*\\\\(`, "g");
    processed = processed.replace(regex, `__fn_${name}(`);
  }
  try {
    const fnEntries = Object.keys(MATH_OPS).map((k) => `const __fn_${k} = __fns.${k};`).join("\n");
    const code = `${fnEntries}\nreturn ${processed};`;
    // eslint-disable-next-line no-new-func
    const fn = new Function("__fns", code) as (fns: Record<string, (x: number) => number>) => number;
    return fn(MATH_OPS);
  } catch { return NaN; }
}

export function normalizeExpr(input: string): string {
  let expr = input.trim().toLowerCase();
  expr = expr.replace(/x²/g, "x^2").replace(/x³/g, "x^3");
  expr = expr.replace(/²/g, "^2").replace(/³/g, "^3");
  expr = expr.replace(/√\(/g, "sqrt(").replace(/racine\s*\(\s*/g, "sqrt(");
  expr = expr.replace(/\bπ\b/g, "pi").replace(/\be\^/g, "exp(");
  expr = expr.replace(/(\d)([a-z(])/g, "$1*$2").replace(/\)(\w)/g, ")*$1");
  return expr.replace(/\*\*/g, "*").replace(/\*\*\*/g, "^").trim();
}

export function extractParams(expr: string): string[] {
  const params = new Set<string>();
  const fnNames = ["sin", "cos", "tan", "ln", "log", "exp", "sqrt", "abs", "asin", "acos", "atan"];
  const matches = expr.match(/\b([a-wyz])\b/gi) || [];
  for (const m of matches) {
    const lower = m.toLowerCase();
    if (!["x", "y", "z", "t", "i", "n"].includes(lower) && !fnNames.includes(lower)) {
      params.add(lower);
    }
  }
  return [...params];
}

export function generateCurve(expr: string, xMin: number, xMax: number, numPoints = 300): { x: number; y: number }[] {
  const points: { x: number; y: number }[] = [];
  const step = (xMax - xMin) / numPoints;
  for (let i = 0; i <= numPoints; i++) {
    const x = xMin + i * step;
    const y = safeEval(expr, x);
    if (isFinite(y) && Math.abs(y) < 10000) {
      points.push({ x: Math.round(x * 1000) / 1000, y: Math.round(y * 1000) / 1000 });
    }
  }
  return points;
}

// ═══════════════════════════════════════════════════════════════
// 🏗️ BUILDERS — Create specs from user intent
// ═══════════════════════════════════════════════════════════════

let _idCounter = 0;
export function generateId(): string {
  return `v${Date.now()}-${++_idCounter}`;
}

export function buildObject(type: LabObjectType, props: Record<string, unknown>, opts?: Partial<LabObject>): LabObject {
  return {
    id: generateId(),
    type,
    position: [0, 0, 0],
    rotation: [0, 0, 0],
    scale: 1,
    color: "#6366f1",
    opacity: 1,
    visible: true,
    ...opts,
    props,
  };
}

export function buildScene(objects: LabObject[], opts?: Partial<LabScene>): LabScene {
  return {
    objects,
    camera: { position: [4, 3, 4], target: [0, 0, 0], fov: 50 },
    grid: true,
    axes: true,
    ...opts,
  };
}

export function buildParam(id: string, name: string, symbol: string, min: number, max: number, step: number, unit: string, value?: number): LabParameter {
  return { id, name, symbol, value: value ?? (min + max) / 2, min, max, step, unit };
}

export function buildWorkspace(title = "Nouveau laboratoire"): LabWorkspace {
  return { id: generateId(), title, visualizations: [], parameters: [], sliders: [], history: [], activeVizId: null, commands: [] };
}

export function addToWorkspaceBuilder(ws: LabWorkspace, spec: LabVizSpec, params: LabParameter[] = []): LabWorkspace {
  const existingParamIds = new Set(ws.parameters.map((p) => p.id));
  const newParams = params.filter((p) => !existingParamIds.has(p.id));
  return {
    ...ws,
    visualizations: [...ws.visualizations, spec],
    parameters: [...ws.parameters, ...newParams],
    history: [...ws.history, `Added: ${spec.title}`],
    activeVizId: spec.id,
  };
}

// ═══════════════════════════════════════════════════════════════
// 🔄 BACKWARD-COMPATIBLE ALIASES
// ═══════════════════════════════════════════════════════════════

export interface LabEngineResult {
  success: boolean;
  specs: LabVizSpec[];
  sliders: LabParameter[];
  explanation: string;
  error?: string;
}

export type LabSliderParam = LabParameter;

export const generateVizId = generateId;

export function createVizSpec(
  domain: LabDomain | string,
  type: string,
  title: string,
  paramsOrDesc: Record<string, unknown> | string = {},
  equationsOrParams?: string[] | Record<string, unknown>,
  scene?: LabScene,
  explanation?: LabExplanation,
): LabVizSpec {
  // Support both old-style: createVizSpec(domain, type, title, paramsObj, equations)
  // and new-style: createVizSpec(domain, type, title, description, params, equations, scene, explanation)
  let params: Record<string, unknown>;
  let eqs: string[] = [];
  let desc = title;
  if (typeof paramsOrDesc === "string") {
    desc = paramsOrDesc;
    params = (typeof equationsOrParams === "object" && !Array.isArray(equationsOrParams)) ? equationsOrParams : {};
    if (Array.isArray(equationsOrParams)) eqs = equationsOrParams;
  } else {
    params = paramsOrDesc;
    if (Array.isArray(equationsOrParams)) eqs = equationsOrParams;
  }
  return { id: generateId(), domain: domain as LabDomain, type, title: desc, description: desc, params, equations: eqs, scene, explanation };
}

export function createSlider(
  id: string,
  name: string,
  symbol: string,
  unitOrValue?: string | number,
  min?: number,
  max?: number,
  step?: number,
  value?: number,
): LabParameter {
  // Support both: createSlider(id, name, symbol, min, max, step, unit)
  // and: createSlider(id, name, symbol, description, min, max, step, value)
  if (typeof unitOrValue === "number" || unitOrValue === undefined) {
    // Old style: (id, name, symbol, min, max, step, unit)
    return buildParam(id, name, symbol, unitOrValue ?? 0, min ?? 10, max ?? 0.1, step?.toString() ?? "");
  }
  // New style: (id, name, symbol, description, min, max, step, value)
  return buildParam(id, name, symbol, min ?? 0, max ?? 10, step ?? 0.1, unitOrValue, value);
}
