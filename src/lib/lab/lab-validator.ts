// ═══════════════════════════════════════════════════════════════
// 🛡️ LAB VALIDATOR — Validation & sanitization des specs IA
// ═══════════════════════════════════════════════════════════════

import type { LabVizSpec, LabScene, LabObject, LabParameter } from "./lab-schema";
import { generateId, buildParam } from "./lab-schema";

// ─── Allowed object types ───
const VALID_OBJECT_TYPES = new Set([
  "sphere", "cube", "cylinder", "cone", "torus", "plane", "point",
  "surface", "curve-3d", "vector-3d", "line-3d",
  "function-plot", "multi-function-plot", "graph-2d", "bar-chart",
  "projectile", "pendulum", "wave", "spring",
  "molecule", "atom",
  "point-2d", "line-2d", "segment-2d", "circle-2d", "polygon-2d", "angle-2d", "vector-2d",
  "circuit", "cell", "orbit", "custom",
]);

const VALID_DOMAINS = new Set([
  "math", "physics", "chemistry", "biology", "geometry", "astronomy", "electricity", "data", "animation",
]);

// ─── Forbidden patterns in expressions ───
const FORBIDDEN_PATTERNS = [
  /\beval\b/i,
  /\bnew\s+Function\b/i,
  /<script/i,
  /\bfetch\b/i,
  /\bXMLHttpRequest\b/i,
  /\bimport\b.*\bfrom\b/,
  /\brequire\b/,
  /\bprocess\b/,
  /\bwindow\b/,
  /\bdocument\b/,
];

// ═══════════════════════════════════════════════════════════════
// 🧹 SANITIZATION
// ═══════════════════════════════════════════════════════════════

function sanitizeString(s: unknown): string {
  if (typeof s !== "string") return "";
  // Remove any HTML/script tags
  return s.replace(/<[^>]*>/g, "").slice(0, 500);
}

function sanitizeNumber(n: unknown, fallback = 0): number {
  if (typeof n === "number" && isFinite(n)) return n;
  if (typeof n === "string") {
    const parsed = parseFloat(n);
    if (isFinite(parsed)) return parsed;
  }
  return fallback;
}

function sanitizeArray(arr: unknown, maxLen = 50): unknown[] {
  if (!Array.isArray(arr)) return [];
  return arr.slice(0, maxLen);
}

function sanitizeTuple3(val: unknown, fallback: [number, number, number] = [0, 0, 0]): [number, number, number] {
  if (Array.isArray(val) && val.length >= 3) {
    return [sanitizeNumber(val[0]), sanitizeNumber(val[1]), sanitizeNumber(val[2])];
  }
  return fallback;
}

// ═══════════════════════════════════════════════════════════════
// ✅ VALIDATION
// ═══════════════════════════════════════════════════════════════

export interface ValidationResult {
  valid: boolean;
  spec: LabVizSpec | null;
  errors: string[];
}

function validateObject(obj: unknown): { valid: boolean; obj: LabObject | null; errors: string[] } {
  const errors: string[] = [];
  if (!obj || typeof obj !== "object") {
    return { valid: false, obj: null, errors: ["Object is not an object"] };
  }

  const o = obj as Record<string, unknown>;
  const type = sanitizeString(o.type);
  if (!VALID_OBJECT_TYPES.has(type)) {
    errors.push(`Invalid object type: ${type}`);
    return { valid: false, obj: null, errors };
  }

  // Validate props
  const props = (o.props && typeof o.props === "object") ? o.props as Record<string, unknown> : {};

  // Check for forbidden patterns in string props
  for (const [key, val] of Object.entries(props)) {
    if (typeof val === "string" && FORBIDDEN_PATTERNS.some((p) => p.test(val))) {
      errors.push(`Forbidden pattern in prop "${key}"`);
    }
  }

  return {
    valid: true,
    obj: {
      id: sanitizeString(o.id) || generateId(),
      type: type as LabObject["type"],
      position: sanitizeTuple3(o.position),
      rotation: sanitizeTuple3(o.rotation),
      scale: typeof o.scale === "number" ? o.scale : 1,
      color: typeof o.color === "string" ? o.color : "#6366f1",
      opacity: typeof o.opacity === "number" ? Math.max(0, Math.min(1, o.opacity)) : 1,
      visible: o.visible !== false,
      label: typeof o.label === "string" ? o.label : undefined,
      props,
    },
    errors,
  };
}

function validateScene(scene: unknown): { valid: boolean; scene: LabScene | null; errors: string[] } {
  if (!scene || typeof scene !== "object") {
    return { valid: false, scene: null, errors: ["No scene provided"] };
  }

  const s = scene as Record<string, unknown>;
  const objects = sanitizeArray(s.objects, 50);
  const validatedObjects: LabObject[] = [];
  const errors: string[] = [];

  for (const obj of objects) {
    const result = validateObject(obj);
    if (result.valid && result.obj) {
      validatedObjects.push(result.obj);
    } else {
      errors.push(...result.errors);
    }
  }

  if (validatedObjects.length === 0) {
    errors.push("Scene has no valid objects");
    return { valid: false, scene: null, errors };
  }

  const camera = s.camera && typeof s.camera === "object" ? {
    position: sanitizeTuple3((s.camera as Record<string, unknown>).position, [4, 3, 4]),
    target: sanitizeTuple3((s.camera as Record<string, unknown>).target, [0, 0, 0]),
    fov: sanitizeNumber((s.camera as Record<string, unknown>).fov, 50),
    autoRotate: !!(s.camera as Record<string, unknown>).autoRotate,
  } : { position: [4, 3, 4] as [number, number, number], target: [0, 0, 0] as [number, number, number], fov: 50 };

  return {
    valid: true,
    scene: {
      objects: validatedObjects,
      camera,
      background: typeof s.background === "string" ? s.background : undefined,
      grid: s.grid !== false,
      axes: s.axes !== false,
    },
    errors,
  };
}

export function validateSpec(input: unknown): ValidationResult {
  const errors: string[] = [];

  if (!input || typeof input !== "object") {
    return { valid: false, spec: null, errors: ["Input is not an object"] };
  }

  const i = input as Record<string, unknown>;

  // Validate domain
  const domain = sanitizeString(i.domain) || "math";
  if (!VALID_DOMAINS.has(domain)) {
    errors.push(`Invalid domain: ${domain}`);
  }

  // Validate type
  const type = sanitizeString(i.type) || "function-plot";

  // Validate scene if present
  let scene: LabScene | undefined;
  if (i.scene) {
    const sceneResult = validateScene(i.scene);
    if (sceneResult.valid && sceneResult.scene) {
      scene = sceneResult.scene;
    } else {
      errors.push(...sceneResult.errors);
    }
  }

  // Validate params
  const params: Record<string, unknown> = {};
  if (i.params && typeof i.params === "object") {
    const rawParams = i.params as Record<string, unknown>;
    for (const [key, val] of Object.entries(rawParams)) {
      if (typeof val === "string" && FORBIDDEN_PATTERNS.some((p) => p.test(val))) {
        errors.push(`Forbidden pattern in param "${key}"`);
      } else {
        params[key] = val;
      }
    }
  }

  // Validate equations
  const equations: string[] = [];
  if (Array.isArray(i.equations)) {
    for (const eq of i.equations.slice(0, 10)) {
      if (typeof eq === "string" && !FORBIDDEN_PATTERNS.some((p) => p.test(eq))) {
        equations.push(eq.slice(0, 200));
      }
    }
  }

  if (errors.length > 0) {
    return { valid: false, spec: null, errors };
  }

  return {
    valid: true,
    spec: {
      id: generateId(),
      domain: domain as LabVizSpec["domain"],
      type,
      title: sanitizeString(i.title) || "Visualisation",
      description: sanitizeString(i.description) || "",
      params,
      equations,
      scene,
    },
    errors: [],
  };
}

// ═══════════════════════════════════════════════════════════════
// 🔧 EXTRACTION DE PARAMÈTRES
// ═══════════════════════════════════════════════════════════════

export function extractParametersFromSpec(spec: LabVizSpec): LabParameter[] {
  const params: LabParameter[] = [];

  // Extract from params dict
  for (const [key, val] of Object.entries(spec.params)) {
    if (typeof val === "number" && isFinite(val)) {
      const absVal = Math.abs(val);
      const max = Math.max(absVal * 3, 10);
      params.push(buildParam(key, key, key, -max, max, 0.1, "", val));
    }
  }

  // Extract from scene objects
  if (spec.scene) {
    for (const obj of spec.scene.objects) {
      for (const [key, val] of Object.entries(obj.props)) {
        if (typeof val === "number" && isFinite(val) && !["id", "width", "height", "depth"].includes(key)) {
          const absVal = Math.abs(val);
          const max = Math.max(absVal * 3, 10);
          if (!params.find((p) => p.id === key)) {
            params.push(buildParam(key, key, key, -max, max, 0.1, "", val));
          }
        }
      }
    }
  }

  return params;
}

// ═══════════════════════════════════════════════════════════════
// 📝 PARSING — Parse natural language into structured spec
// ═══════════════════════════════════════════════════════════════

export function parseUserMessage(msg: string): { intent: string; params: Record<string, unknown> } {
  const lower = msg.toLowerCase().trim();

  // Detect intent
  let intent = "unknown";
  if (/trace|dessine|graph|repr[ée]sente/i.test(lower)) intent = "graph";
  else if (/simule|simulation|anime|mouvement/i.test(lower)) intent = "simulation";
  else if (/cr[ée]e|ajoute|construis|montre/i.test(lower)) intent = "create";
  else if (/modifie|change|mets|ajuste/i.test(lower)) intent = "modify";
  else if (/supprime|enl[èe]ve|retire/i.test(lower)) intent = "remove";

  // Extract common params
  const params: Record<string, unknown> = {};

  // Number extraction
  const numbers = lower.match(/\d+(?:\.\d+)?/g);
  if (numbers) {
    params._numbers = numbers.map(Number);
  }

  // Expression extraction
  const exprMatch = msg.match(/(?:f\s*\(\s*x\s*\)\s*=\s*|y\s*=\s*)(.+)/i);
  if (exprMatch) {
    params.expression = exprMatch[1].trim();
  }

  // Angle extraction
  const angleMatch = msg.match(/(\d+)\s*(?:degr[ée]s?|°)/i);
  if (angleMatch) {
    params.angle = parseInt(angleMatch[1]);
  }

  return { intent, params };
}
