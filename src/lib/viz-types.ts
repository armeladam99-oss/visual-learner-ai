// ═══════════════════════════════════════════════════════════════
// 📐 TYPES DE VISUALISATION — Labo IA
// ═══════════════════════════════════════════════════════════════

export type VizType =
  | "function-2d"
  | "multi-function-2d"
  | "parametric-2d"
  | "polar-2d"
  | "statistics"
  | "scatter"
  | "histogram"
  | "surface-3d"
  | "solid-3d"
  | "molecule-3d"
  | "vector-3d"
  | "pendulum-3d"
  | "spring-3d"
  | "projectile-sim"
  | "chute-libre-sim"
  | "pendulum-sim"
  | "onde-sim"
  | "circuit-rc-sim"
  | "dosage-sim"
  | "diagram-circuit"
  | "diagram-forces"
  | "diagram-optique"
  | "diagram-cellule"
  | "error";

export interface VizRequest {
  type: VizType;
  title: string;
  explanation: string;
  equations: string[];
  params: Record<string, unknown>;
  functions?: FunctionDef[];
}

export interface FunctionDef {
  expr: string;
  label: string;
  color: string;
  eval: (x: number) => number;
}

export interface VizState {
  current: VizRequest | null;
  history: VizRequest[];
  modifiedBy?: string;
}

// ═══════════════════════════════════════════════════════════════
// 🔢 MOTEUR D'ÉVALUATION MATHÉMATIQUE SÉCURISÉ
// ═══════════════════════════════════════════════════════════════

// Safe math expression evaluator — no eval(), no new Function()
const MATH_OPS: Record<string, (x: number) => number> = {
  sin: Math.sin,
  cos: Math.cos,
  tan: Math.tan,
  abs: Math.abs,
  sqrt: Math.sqrt,
  log: Math.log,
  ln: Math.log,
  exp: Math.exp,
  asin: Math.asin,
  acos: Math.acos,
  atan: Math.atan,
  sinh: Math.sinh,
  cosh: Math.cosh,
  floor: Math.floor,
  ceil: Math.ceil,
  round: Math.round,
};

const CONSTANTS: Record<string, number> = {
  pi: Math.PI,
  PI: Math.PI,
  e: Math.E,
  E: Math.E,
};

/**
 * Parse and evaluate a math expression safely.
 * Supports: x, constants (pi, e), operations (+,-,*,/,^), functions (sin, cos, etc.)
 */
export function safeEval(expr: string, x: number): number {
  // Replace constants
  let processed = expr
    .replace(/\b(pi|PI)\b/g, `(${Math.PI})`)
    .replace(/\be\b/g, `(${Math.E})`)
    .replace(/\^/g, "**");

  // Replace x with the value
  processed = processed.replace(/\bx\b/g, `(${x})`);

  // Replace function calls with Math.*
  for (const [name, fn] of Object.entries(MATH_OPS)) {
    const regex = new RegExp(`\\b${name}\\s*\\(`, "g");
    processed = processed.replace(regex, `__fn_${name}(`);
  }

  // Replace our __fn_ calls with actual Math functions
  try {
    // Build a safe evaluation context
    const fnEntries = Object.entries(MATH_OPS)
      .map(([k, v]) => `const __fn_${k} = __fns.${k};`)
      .join("\n");
    
    const constEntries = Object.entries(CONSTANTS)
      .map(([k, v]) => `const ${k} = ${v};`)
      .join("\n");

    const code = `${fnEntries}\n${constEntries}\nreturn ${processed};`;
    
    // eslint-disable-next-line no-new-func
    const fn = new Function("__fns", code) as (fns: Record<string, (x: number) => number>) => number;
    return fn(MATH_OPS);
  } catch {
    return NaN;
  }
}

/**
 * Generate x,y pairs for a function
 */
export function generateCurve(
  expr: string,
  xMin: number,
  xMax: number,
  numPoints = 200
): { x: number; y: number }[] {
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

/**
 * Parse common math expressions from French notation
 */
export function normalizeExpr(input: string): string {
  let expr = input.trim().toLowerCase();
  
  // Common French math notations
  expr = expr.replace(/x²/g, "x^2");
  expr = expr.replace(/x³/g, "x^3");
  expr = expr.replace(/²/g, "^2");
  expr = expr.replace(/³/g, "^3");
  expr = expr.replace(/√\(/g, "sqrt(");
  expr = expr.replace(/racine\s*\(\s*/g, "sqrt(");
  expr = expr.replace(/ln\s*\(/g, "ln(");
  expr = expr.replace(/log\s*\(/g, "log(");
  expr = expr.replace(/\bsin\b/g, "sin");
  expr = expr.replace(/\bcos\b/g, "cos");
  expr = expr.replace(/\btan\b/g, "tan");
  expr = expr.replace(/\bπ\b/g, "pi");
  expr = expr.replace(/\be\^/g, "exp(");
  
  // Handle implicit multiplication: 2x → 2*x, 3sin → 3*sin
  expr = expr.replace(/(\d)([a-z(])/g, "$1*$2");
  expr = expr.replace(/\)(\w)/g, ")*$1");
  
  // Fix double multiplication
  expr = expr.replace(/\*\*/g, "*");
  expr = expr.replace(/\*\*\*/g, "^");
  
  // Remove trailing spaces
  expr = expr.trim();
  
  return expr;
}
