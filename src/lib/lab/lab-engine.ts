// ═══════════════════════════════════════════════════════════════
// 🧪 LAB ENGINE — Moteur central du laboratoire
// Pipeline : Compréhension → Planification → Validation → Rendu
// ═══════════════════════════════════════════════════════════════

import type {
  LabVizSpec,
  LabEngineResult,
  LabWorkspace,
  LabSliderParam,
  LabDomain,
} from "./lab-schema";
import { createVizSpec, createSlider, generateVizId, generateId } from "./lab-schema";
import { normalizeExpr } from "./lab-schema";
import { extractParams } from "./lab-schema";

// Re-import safeEval from schema (safe math)
import { safeEval } from "./lab-schema";

// ═══════════════════════════════════════════════════════════════
// 🧠 PATTERNS DE DÉTECTION PAR DOMAINE
// ═══════════════════════════════════════════════════════════════

interface DomainPattern {
  domain: LabDomain;
  patterns: RegExp[];
  priority: number;
  handle: (msg: string, match: RegExpMatchArray) => LabEngineResult;
}

// Helper: extract range from message
function extractRange(msg: string): { xMin: number; xMax: number } {
  const m = msg.match(/(?:entre|de|sur|interval)\s*\[?\s*(-?\d+(?:\.\d+)?)\s*(?:,|\s*(?:et|à|a|->|→))\s*(-?\d+(?:\.\d+)?)\s*\]?/i);
  return { xMin: m ? parseFloat(m[1]) : -10, xMax: m ? parseFloat(m[2]) : 10 };
}

// Helper: extract expression after various prefixes
function extractExpr(msg: string, patterns: RegExp[]): string | null {
  for (const p of patterns) {
    const m = msg.match(p);
    if (m?.[1]) return normalizeExpr(m[1].trim());
  }
  return null;
}

// Helper: extract param=value
function extractParamVal(msg: string, paramName: string): number | null {
  const m = msg.match(new RegExp(`${paramName}\\s*(?:=|à|est|vaut)\\s*([\\d.]+)`, "i"));
  return m ? parseFloat(m[1]) : null;
}

const DOMAIN_PATTERNS: DomainPattern[] = [
  // ═══════════════════════════════════════════════════════
  // MODIFICATION REQUESTS (detected but returned as special result)
  // ═══════════════════════════════════════════════════════
  {
    domain: "math",
    patterns: [
      /ajoute?\s+(?:la\s+)?(?:courbe|fonction)\s+(.+?)(?:\s+au|\s+sur|\s*$)/i,
      /change?\s+(?:l'?\s*)?intervalle\s+(?:à\s*\[?)?(-?\d+)\s*(?:,|\s*(?:et|à))\s*(-?\d+)/i,
    ],
    priority: 20,
    handle: () => ({
      success: false,
      specs: [],
      sliders: [],
      explanation: "MODIFICATION",
      error: "MODIFICATION_REQUEST",
    }),
  },
  // ═══════════════════════════════════════════════════════
  // MATH — Derivative (REQUIRES explicit derivative word)
  // ═══════════════════════════════════════════════════════
  {
    domain: "math",
    patterns: [
      /d[ée]riv[ée]e?\s+(?:de\s+)?(?:f\s*\(\s*x\s*\)\s*=\s*|y\s*=?\s*)(.+)/i,
      /montre?\s+(?:la\s+)?d[ée]riv[ée]e?\s+(?:de\s+)?(.+)/i,
      /trace?\s+(?:la\s+)?f'\s*\(\s*x?\s*\)/i,
      /d[ée]riv[ée]e?\s+(?:de\s+)?(.+?)(?:\s+entre|\s+de|\s+sur|$)/i,
    ],
    priority: 17,
    handle: (msg) => {
      const expr = extractExpr(msg, [
        /(?:de\s+)?(?:f\s*\(\s*x\s*\)\s*=\s*|y\s*=?\s*)(.+?)(?:\s+entre|\s+de|\s+sur|$)/i,
        /(?:de\s+)?(.+?)(?:\s+entre|\s+de|\s+sur|$)/i,
      ]) || "x^2";
      const { xMin, xMax } = extractRange(msg);
      const params = extractParams(expr);
      const sliders = params.map((p) => createSlider(p, `Coefficient ${p}`, p, "", -5, 5, 0.1, 1));

      return {
        success: true,
        specs: [createVizSpec("math", "derivative-plot", `Dérivée de f(x) = ${expr}`, {
          expr, xMin, xMax, showOriginal: true, showDerivative: true,
        }, [`f(x) = ${expr}`])],
        sliders,
        explanation: `**Dérivée de f(x) = ${expr}**\n\n**Observation :** Le graphique montre f(x) et sa dérivée f'(x).\n**Interprétation :** Quand f'(x) > 0 → f croissante. Quand f'(x) < 0 → f décroissante.`,
      };
    },
  },

  // ═══════════════════════════════════════════════════════
  // MATH: General function plot (HIGHEST PRIORITY for math)
  // Matches: "Trace f(x)=...", "Dessine y=...", "Graph de...", "Trace e^...", "Trace 1/..."
  // ═══════════════════════════════════════════════════════
  {
    domain: "math",
    patterns: [
      /trace?r?\s+(?:la\s+)?(?:courbe\s+de\s+)?(?:f\s*\(\s*x\s*\)\s*=\s*|y\s*=\s*)(.+)/i,
      /dessine?\s+(?:la\s+)?(?:f\s*\(\s*x\s*\)\s*=\s*|y\s*=\s*)(.+)/i,
      /graph(?:ique)?\s+(?:de\s+)?(?:f\s*\(\s*x\s*\)\s*=\s*|y\s*=\s*)(.+)/i,
      // Catch "Trace e^...", "Trace 1/(x-2)", "Trace sin(x)+cos(x)" — expressions after "Trace"
      /trace?r?\s+([a-z0-9^()+\-*/.\s]+(?:\^[\d()]+|\(.*?\))[^,\n]*?)(?:\s+entre|\s+de|\s+sur|\s+avec|\s+et\s+(?:la\s+)?(?:courbe|sin|cos|tan)|\s+et\s+\w|\s*$)/i,
      /repr[ée]sente?\s+graphiquement\s+(?:une?\s+)?(.+?)(?:\s+entre|\s+de|\s+sur|$)/i,
    ],
    priority: 14,
    handle: (msg) => {
      const expr = extractExpr(msg, [
        /(?:f\s*\(\s*x\s*\)\s*=\s*|y\s*=\s*)(.+?)(?:\s+entre|\s+de|\s+sur|\s+avec|\s+et\s+(?:la\s+)?(?:courbe|fonction|sin|cos)|$)/i,
        /trace?r?\s+(?:la\s+)?(?:courbe\s+de\s+)?(.+?)(?:\s+entre|\s+de|\s+sur|\s+avec|\s+et\s+(?:la\s+)?(?:courbe|fonction|sin|cos)|$)/i,
      ]) || "x^2";
      const { xMin, xMax } = extractRange(msg);
      const params = extractParams(expr);
      const sliders = params.map((p) => createSlider(p, `Coefficient ${p}`, p, "", -10, 10, 0.1, 1));

      return {
        success: true,
        specs: [createVizSpec("math", "function-plot", `f(x) = ${expr}`, {
          expr, xMin, xMax,
        }, [`f(x) = ${expr}`])],
        sliders,
        explanation: `**Courbe de f(x) = ${expr}**\n\n**Intervalle :** [${xMin}, ${xMax}]`,
      };
    },
  },

  // ═══════════════════════════════════════════════════════
  // MATH: Multiple functions ("sin(x) et cos(x) sur le même graphique")
  // ═══════════════════════════════════════════════════════
  {
    domain: "math",
    patterns: [
      /trace?r?\s+(.+?)\s+et\s+(.+?)(?:\s+sur\s+(?:le\s+)?même|\s+entre|\s+de|\s*$)/i,
      /superpose?\s+(.+?)\s+et\s+(.+)/i,
      /compare?\s+(.+?)\s+et\s+(.+?)(?:\s+sur\s+(?:le\s+)?même)?$/i,
      /(.+?)\s+et\s+(.+?)\s+sur\s+(?:le\s+)?même\s+graphique/i,
      /(.+?)\s+et\s+(.+?)\s+sur\s+(?:le\s+)?même\s+(?:graphique|courbe)/i,
    ],
    priority: 15,
    handle: (msg) => {
      const multiMatch = msg.match(/(?:trace|dessine|superpose|graph|compare)\s+(.+?)\s+et\s+(.+?)(?:\s+sur|\s+entre|\s+de|\s*$)/i)
        || msg.match(/(.+?)\s+et\s+(.+?)\s+sur\s+(?:le\s+)?même/i)
        || msg.match(/(?:trace|dessine)\s+(.+?)\s+et\s+(.+?)$/i);
      if (!multiMatch) return { success: false, specs: [], sliders: [], explanation: "Could not parse" };

      const e1 = normalizeExpr(multiMatch[1].replace(/y\s*=\s*/gi, "").replace(/f\s*\(\s*x\s*\)\s*=\s*/gi, "").trim());
      const e2 = normalizeExpr(multiMatch[2].replace(/y\s*=\s*/gi, "").replace(/f\s*\(\s*x\s*\)\s*=\s*/gi, "").replace(/\s+sur\s+(?:le\s+)?même.*$/i, "").trim());
      const { xMin, xMax } = extractRange(msg);

      return {
        success: true,
        specs: [createVizSpec("math", "multi-function-plot", `${e1} et ${e2}`, {
          functions: [e1, e2], xMin, xMax,
          labels: ["f(x)", "g(x)"], colors: ["#6366f1", "#ef4444"],
        }, [`f(x) = ${e1}`, `g(x) = ${e2}`])],
        sliders: [],
        explanation: `**Superposition :**\nf(x) = ${e1}\ng(x) = ${e2}`,
      };
    },
  },

  // ═══════════════════════════════════════════════════════
  // MATH: Parametric plot
  // ═══════════════════════════════════════════════════════
  {
    domain: "math",
    patterns: [
      /param[ée]trique/i,
      /x\s*=\s*cos\s*\(\s*t\s*\).*y\s*=\s*sin/i,
      /x\s*=\s*\w+\s*\(\s*t\s*\).*y\s*=\s*\w+\s*\(\s*t\s*\)/i,
    ],
    priority: 16,
    handle: (msg) => {
      const xMatch = msg.match(/x\s*=\s*(.+?)(?:\s*,|\s+et|\s+y)/i);
      const yMatch = msg.match(/y\s*=\s*(.+?)(?:\s*$|\s*,|\s+et|\s+sur)/i);
      const xExpr = normalizeExpr(xMatch?.[1] || "cos(t)");
      const yExpr = normalizeExpr(yMatch?.[1] || "sin(2*t)");
      return {
        success: true,
        specs: [createVizSpec("math", "function-plot", `Paramétrique : x=${xExpr}, y=${yExpr}`, {
          expr: `sin(x)`, // placeholder for parametric - we need a parametric renderer
          xMin: -10, xMax: 10, parametric: true, xExpr, yExpr,
        }, [`x(t) = ${xExpr}`, `y(t) = ${yExpr}`])],
        sliders: [],
        explanation: `**Courbe paramétrique :**\nx(t) = ${xExpr}\ny(t) = ${yExpr}`,
      };
    },
  },

  // ═══════════════════════════════════════════════════════
  // MATH: Zeros/analysis
  // ═══════════════════════════════════════════════════════
  {
    domain: "math",
    patterns: [
      /[zée]ro/i,
      /minimum|maximum|extremum/i,
      /tableau\s+de\s+(?:variation|signes)/i,
    ],
    priority: 13,
    handle: (msg) => {
      const expr = extractExpr(msg, [
        /de\s+(?:f\s*\(\s*x\s*\)\s*=\s*)?(.+?)(?:\s*$)/i,
        /(.+?)(?:\s+entre|\s+de|\s+sur|$)/i,
      ]) || "x^2";
      const { xMin, xMax } = extractRange(msg);

      const zeros: number[] = [];
      let minY = Infinity; let minX = 0;
      for (let x = xMin; x <= xMax; x += 0.05) {
        const y = safeEval(expr, x);
        const yNext = safeEval(expr, x + 0.05);
        if (isFinite(y) && isFinite(yNext) && y * yNext <= 0 && Math.abs(y) < 1000) {
          zeros.push(Math.round(x * 100) / 100);
        }
        if (isFinite(y) && y < minY) { minY = y; minX = x; }
      }

      let analysis = `**Analyse de f(x) = ${expr}**\n`;
      if (zeros.length > 0) {
        analysis += `\n**Zéros :** x ∈ {${zeros.slice(0, 6).join(", ")}}`;
      }
      if (isFinite(minY)) {
        analysis += `\n**Minimum :** f(${Math.round(minX * 100) / 100}) = ${Math.round(minY * 100) / 100}`;
      }

      return {
        success: true,
        specs: [createVizSpec("math", "function-plot", `Analyse de f(x) = ${expr}`, {
          expr, xMin, xMax,
        }, [`f(x) = ${expr}`])],
        sliders: [],
        explanation: analysis,
      };
    },
  },

  // ═══════════════════════════════════════════════════════
  // MATH: Variable parameter ("Fais varier a dans f(x)=a*x²")
  // ═══════════════════════════════════════════════════════
  {
    domain: "math",
    patterns: [
      /fais?\s+varier\s+(\w+)\s+(?:dans\s+)?(?:f\s*\(\s*x\s*\)\s*=\s*|y\s*=\s*)(.+)/i,
      /varier\s+(\w+)\s+(?:dans\s+)?(?:f\s*\(\s*x\s*\)\s*=\s*|y\s*=\s*)(.+)/i,
    ],
    priority: 16,
    handle: (msg) => {
      const paramMatch = msg.match(/varier\s+(\w+)\s+(?:dans\s+)?(?:f\s*\(\s*x\s*\)\s*=\s*|y\s*=\s*)(.+)/i);
      const param = paramMatch?.[1] || "a";
      const expr = normalizeExpr(paramMatch?.[2] || "a*x^2");
      const { xMin, xMax } = extractRange(msg);
      const params = extractParams(expr);
      const sliders = params.map((p) => createSlider(p, `Coefficient ${p}`, p, "", -5, 5, 0.1, p === param ? 1 : 1));

      return {
        success: true,
        specs: [createVizSpec("math", "function-plot", `f(x) = ${expr}`, {
          expr, xMin, xMax,
        }, [`f(x) = ${expr}`])],
        sliders,
        explanation: `**Paramètre ${param} modifiable via les sliders**\n\nf(x) = ${expr}`,
      };
    },
  },

  // ═══════════════════════════════════════════════════════
  // 3D: Surface, solid, vector, curve
  // ═══════════════════════════════════════════════════════
  {
    domain: "math",
    patterns: [
      /(?:en\s+)?3[dD]\s+(?:la\s+)?(?:surface\s+)?(?:z\s*=\s*)?(.+)/i,
      /surface\s+(?:3[dD]\s+)?(?:z\s*=\s*)?(.+)/i,
      /dessine?\s+(?:en\s+)?3[dD]\s+(?:la\s+)?(.+)/i,
      /montre?\s+(?:en\s+)?3[dD]\s+(?:la\s+)?(.+)/i,
      /plan\s+(?:xyz|3[dD])\s*(.+)/i,
      /cr[ée]e?\s+(?:une?\s+)?(?:surface|solide|sph[èe]re|cube|c[ôo]ne|cylindre|carr[ée]|pyramide|sc[èe]ne)\s+(.+)/i,
      /cr[ée]e?\s+(?:une?\s+)?(?:sph[èe]re|cube|c[ôo]ne|cylindre|objets?)/i,
    ],
    priority: 13,
    handle: (msg) => {
      const lower = msg.toLowerCase();

      // Molecule in 3D — redirect to chemistry
      if (lower.includes("molécule") || lower.includes("molecule")) {
        const molMatch = msg.match(/(?:molécule|molecule)\s+(?:de\s+)?(\w+)/i);
        return {
          success: true,
          specs: [createVizSpec("chemistry", "molecule-3d", `Molécule ${molMatch?.[1] || "H2O"}`, {
            molecule: molMatch?.[1] || "H2O",
          }, [])],
          sliders: [],
          explanation: `**Modèle 3D :** ${molMatch?.[1] || "H2O"}`,
        };
      }

      // Multi-object 3D scene: "Crée une sphère et un cube"
      const multiMatch = msg.match(/cr[ée]e?\s+(.+?)(?:\s+et\s+(.+?))?(?:\s+dans|\s+dans|\s*$)/i);
      if (multiMatch && lower.includes("et") && (lower.includes("sphere") || lower.includes("cube") || lower.includes("cylindre") || lower.includes("cone"))) {
        const solids = lower.match(/(sph[èe]re|sphere|cube|c[ôo]ne|cone|cylindre|pyramide|prisme|tore)/gi) || [];
        if (solids.length > 1) {
          return {
            success: true,
            specs: [createVizSpec("math", "surface-3d", `Scène 3D : ${solids.join(", ")}`, {
              solids: solids.map((s, i) => ({ type: s.toLowerCase().replace(/[èé]/g, "e"), position: [(i - (solids.length - 1) / 2) * 3, 0, 0] })),
            }, [])],
            sliders: [],
            explanation: `**Scène 3D multi-objets :**\n${solids.map((s, i) => `• ${s}`).join("\n")}\n\nTourne et zoome avec la souris !`,
          };
        }
      }

      // Planet with moon
      if (lower.includes("planète") || lower.includes("planete")) {
        return {
          success: true,
          specs: [createVizSpec("astronomy", "solar-system", "Planète avec lune", {
            planets: [
              { name: "Planète", dist: 0, size: 1.5, color: "#3b82f6", speed: 0 },
              { name: "Lune", dist: 0.39, size: 0.3, color: "#94a3b8", speed: 47.4, orbiting: true },
            ],
          }, [])],
          sliders: [],
          explanation: "**Planète avec lune en orbite**\nTourne et zoome !",
        };
      }

      // Solid in 3D
      if (lower.includes("solide") || lower.includes("cube") || lower.includes("sphère") || lower.includes("sphere") || lower.includes("cone") || lower.includes("cône") || lower.includes("cylindre") || lower.includes("pyramide") || lower.includes("prisme") || lower.includes("tore")) {
        const solidMatch = msg.match(/(cube|sph[èe]re|sphere|c[ôo]ne|cone|cylindre|prisme|pyramide|tore)/i);
        return {
          success: true,
          specs: [createVizSpec("math", "surface-3d", `Solide : ${solidMatch?.[1] || "Cube"}`, {
            solid: solidMatch?.[1]?.toLowerCase()?.replace(/[èé]/g, "e") || "cube", size: 1,
          }, [])],
          sliders: [],
          explanation: `**Solide 3D :** ${solidMatch?.[1] || "Cube"}\nTourne et zoome avec la souris !`,
        };
      }

      // Vector
      if (lower.includes("vecteur") || lower.includes("vector") || lower.includes("plan xyz") || lower.includes("plan x")) {
        return {
          success: true,
          specs: [createVizSpec("math", "surface-3d", "Vecteur dans l'espace XYZ", {
            solid: "vector", vector: [3, 2, 4],
          }, [])],
          sliders: [],
          explanation: "**Vecteur dans l'espace 3D**\nTourne avec la souris !",
        };
      }

      // Default: surface z=f(x,y)
      const exprMatch = msg.match(/(?:z\s*=\s*)(.+)/i);
      const expr = exprMatch ? normalizeExpr(exprMatch[1]) : "sin(sqrt(x^2 + y^2))";
      return {
        success: true,
        specs: [createVizSpec("math", "surface-3d", `Surface : z = ${expr}`, {
          expr, xMin: -5, xMax: 5, yMin: -5, yMax: 5,
        }, [`z = ${expr}`])],
        sliders: [],
        explanation: `**Surface 3D :** z = ${expr}\nTourne avec la souris, zoome avec la molette !`,
      };
    },
  },

  // ═══════════════════════════════════════════════════════
  // PHYSICS: Projectile
  // ═══════════════════════════════════════════════════════
  {
    domain: "physics",
    patterns: [
      /simul(?:e|ation)\s+(?:une?\s+)?(?:balle|projectile|mouvement)\s+(?:lancée?\s+)?(?:à\s+)?(\d+(?:\.\d+)?)\s*m?\s*\/?\s*s?\s*(?:avec\s+)?(?:un?\s+)?(?:angle\s+(?:de\s+)?)(\d+)/i,
      /simul(?:e|ation)\s+(?:une?\s+)?(?:balle|projectile|mouvement)/i,
      /mouvement\s+parabolique/i,
      /projectile/i,
    ],
    priority: 13,
    handle: (msg) => {
      const v0Match = msg.match(/(\d+(?:\.\d+)?)\s*m?\s*\/?\s*s/);
      const angleMatch = msg.match(/angle\s+(?:de\s+)?(\d+)/i);
      const v0 = v0Match ? parseFloat(v0Match[1]) : 20;
      const angle = angleMatch ? parseFloat(angleMatch[1]) : 45;
      return {
        success: true,
        specs: [createVizSpec("physics", "projectile-sim", "Projectile", {
          v0, angle, g: 9.81,
        }, ["x(t) = v₀·cos(θ)·t", "y(t) = v₀·sin(θ)·t − ½gt²"])],
        sliders: [
          createSlider("v0", "Vitesse initiale", "v₀", "m/s", 5, 50, 0.5, v0),
          createSlider("angle", "Angle", "θ", "°", 5, 85, 1, angle),
        ],
        explanation: `**Projectile :** v₀ = ${v0} m/s, θ = ${angle}°`,
      };
    },
  },

  // ═══════════════════════════════════════════════════════
  // PHYSICS: Free fall
  // ═══════════════════════════════════════════════════════
  {
    domain: "physics",
    patterns: [
      /chute\s+libre/i,
      /simul(?:e|ation)\s+(?:la\s+)?chute/i,
      /objet\s+(?:qui\s+)?tombe/i,
      /corps\s+libre/i,
    ],
    priority: 13,
    handle: (msg) => {
      const hMatch = msg.match(/(?:de\s+|hauteur\s+(?:de\s+)?|depuis\s+)?(\d+(?:\.\d+)?)\s*m/);
      const h0 = hMatch ? parseFloat(hMatch[1]) : 10;
      return {
        success: true,
        specs: [createVizSpec("physics", "free-fall-sim", "Chute libre", {
          h0, g: 9.81,
        }, ["y(t) = h₀ − ½gt²", "v(t) = −gt"])],
        sliders: [createSlider("h0", "Hauteur initiale", "h₀", "m", 1, 50, 0.5, h0)],
        explanation: `**Chute libre :** h₀ = ${h0} m`,
      };
    },
  },

  // ═══════════════════════════════════════════════════════
  // PHYSICS: Pendulum
  // ═══════════════════════════════════════════════════════
  {
    domain: "physics",
    patterns: [
      /pendule/i,
      /oscillation.*pendule/i,
    ],
    priority: 13,
    handle: (msg) => {
      const lMatch = msg.match(/(?:longueur\s+(?:de\s+)?)?(\d+(?:\.\d+)?)\s*m/);
      const L = lMatch ? parseFloat(lMatch[1]) : 1;
      return {
        success: true,
        specs: [createVizSpec("physics", "pendulum-sim", "Pendule simple", {
          length: L, angle0: 30, g: 9.81,
        }, ["T = 2π√(L/g)", "θ(t) = θ₀·cos(ωt)"])],
        sliders: [
          createSlider("length", "Longueur", "L", "m", 0.2, 3, 0.1, L),
          createSlider("angle0", "Angle", "θ₀", "°", 5, 60, 1, 30),
        ],
        explanation: `**Pendule :** L = ${L} m`,
      };
    },
  },

  // ═══════════════════════════════════════════════════════
  // PHYSICS: Spring
  // ═══════════════════════════════════════════════════════
  {
    domain: "physics",
    patterns: [
      /ressort/i,
      /oscillation.*ressort/i,
      /masse.*ressort/i,
    ],
    priority: 13,
    handle: (msg) => {
      return {
        success: true,
        specs: [createVizSpec("physics", "wave-sim", "Oscillation ressort-masse", {
          amplitude: 2, frequency: 1.5, speed: 5,
        }, ["x(t) = A·cos(ωt + φ)", "F = −k·x", "ω = √(k/m)"])],
        sliders: [
          createSlider("amplitude", "Amplitude", "A", "m", 0.5, 5, 0.1, 2),
          createSlider("frequency", "Fréquence", "f", "Hz", 0.5, 5, 0.1, 1.5),
        ],
        explanation: "**Oscillation ressort-masse**\nAmplitude modifiable via slider.",
      };
    },
  },

  // ═══════════════════════════════════════════════════════
  // PHYSICS: Wave
  // ═══════════════════════════════════════════════════════
  {
    domain: "physics",
    patterns: [
      /onde/i,
      /sinusoïdale/i,
      /sinusoidale/i,
      /propagation/i,
    ],
    priority: 12,
    handle: (msg) => {
      return {
        success: true,
        specs: [createVizSpec("physics", "wave-sim", "Onde sinusoïdale", {
          amplitude: 1, frequency: 2, speed: 5,
        }, ["y(x,t) = A·sin(kx − ωt)", "v = λ·f"])],
        sliders: [
          createSlider("amplitude", "Amplitude", "A", "m", 0.1, 3, 0.1, 1),
          createSlider("frequency", "Fréquence", "f", "Hz", 0.5, 10, 0.1, 2),
        ],
        explanation: "**Onde sinusoïdale**",
      };
    },
  },

  // ═══════════════════════════════════════════════════════
  // ELECTRICITY: Circuit RC
  // ═══════════════════════════════════════════════════════
  {
    domain: "electricity",
    patterns: [
      /circuit\s*(?:rc|rl|rlc)/i,
      /condensateur/i,
      /charge.*condensateur/i,
      /circuit.*(?:pile|r[ée]sistance)/i,
      /construis.*circuit/i,
      /tension.*temps/i,
    ],
    priority: 13,
    handle: (msg) => {
      const rMatch = msg.match(/(\d+)\s*(?:Ω|ohm)/i);
      const cMatch = msg.match(/(\d+)\s*(?:μ?F)/i);
      const R = rMatch ? parseFloat(rMatch[1]) : 100;
      const C = cMatch ? parseFloat(cMatch[1]) : 100;
      return {
        success: true,
        specs: [createVizSpec("electricity", "circuit-rc", "Circuit RC", {
          R, C, U0: 5,
        }, ["τ = R·C", "Uc(t) = U₀(1 − e^(−t/τ))"])],
        sliders: [
          createSlider("R", "Résistance", "R", "Ω", 10, 1000, 10, R),
          createSlider("C", "Capacité", "C", "μF", 10, 1000, 10, C),
        ],
        explanation: `**Circuit RC :** R = ${R} Ω, C = ${C} μF`,
      };
    },
  },

  // ═══════════════════════════════════════════════════════
  // CHEMISTRY: Compare molecules
  // ═══════════════════════════════════════════════════════
  {
    domain: "chemistry",
    patterns: [
      /compare\s+(\w+)\s+et\s+(\w+)/i,
      /comparer\s+(\w+)\s+et\s+(\w+)/i,
      /(\w+)\s+et\s+(\w+)\s+(?:c[ôo]te|ensemble|compar)/i,
    ],
    priority: 14,
    handle: (msg) => {
      const m = msg.match(/compare?\s+(\w+)\s+et\s+(\w+)/i)
        || msg.match(/(\w+)\s+et\s+(\w+)\s+(?:c[ôo]te|ensemble|compar)/i);
      const mol1 = m?.[1] || "H2O";
      const mol2 = m?.[2] || "CO2";
      return {
        success: true,
        specs: [
          createVizSpec("chemistry", "molecule-3d", `${mol1} vs ${mol2}`, {
            molecules: [mol1.toUpperCase(), mol2.toUpperCase()],
          }, []),
        ],
        sliders: [],
        explanation: `**Comparaison :** ${mol1.toUpperCase()} vs ${mol2.toUpperCase()}\nTourne les modèles pour les examiner !`,
      };
    },
  },

  // ═══════════════════════════════════════════════════════
  // CHEMISTRY: Molecule 3D
  // ═══════════════════════════════════════════════════════
  {
    domain: "chemistry",
    patterns: [
      /montre?r?\s+(?:moi\s+)?(?:une?\s+)?mol[ée]cule\s+(?:de\s+)?(\w+)/i,
      /ajoute\s+(?:une?\s+)?mol[ée]cule\s+(?:de\s+)?(\w+)/i,
      /ajoute\s+(?:la\s+)?(\w+)(?:\s+(?:mol[ée]cule|molecule))?/i,
      /(\w+)\s+en\s+3[dD]/i,
      /mol[ée]cule\s+(?:de\s+)?(\w+)/i,
      /montre?r?\s+(?:moi\s+)?(?:la\s+)?structure\s+(?:de\s+)?(\w+)/i,
      /explique.*structure.*?(\w+)/i,
      /montre?r?\s+(?:moi\s+)?(\w+)/i,
    ],
    priority: 12,
    handle: (msg) => {
      const molMatch = msg.match(/mol[ée]cule\s+(?:de\s+)?(\w+)/i)
        || msg.match(/structure\s+(?:de\s+)?(\w+)/i)
        || msg.match(/montre?r?\s+(?:moi\s+)?(\w+)\s+en\s+3[dD]/i)
        || msg.match(/montre?r?\s+(?:moi\s+)?(?:la\s+)?(\w+)/i);
      let mol = molMatch?.[1]?.toUpperCase() || "H2O";
      // Normalize common molecule names
      const molMap: Record<string, string> = {
        "ADN": "H2O", "DNA": "H2O", "EAU": "H2O",
        "METHANE": "CH4", "MÉTHANE": "CH4", "CH4": "CH4", "CH₄": "CH4",
        "AMMONIAK": "NH3", "AMMONIAQUE": "NH3",
        "ACIDE CHLORHYDRIQUE": "HCl", "ACIDE SULFURIQUE": "H2SO4", "ACIDE NITRIQUE": "HNO3",
        "HYDROXYDE DE SODIUM": "NaOH", "SEL": "NaCl",
        "ETHANOL": "C2H5OH", "ALCOOL": "C2H5OH", "ÉTHANOL": "C2H5OH",
        "GLUCOSE": "C6H12O6", "BENZENE": "C6H6", "BENZÈNE": "C6H6",
        "DIOXYDE DE CARBONE": "CO2", "OXYGENE": "O2", "OXYGÈNE": "O2",
        "AZOTE": "N2", "HYDROGENE": "H2", "HYDROGÈNE": "H2",
        "EAU OXYGENEE": "H2O2", "EAU OXYGÉNÉE": "H2O2",
        "ACIDE ACETIQUE": "CH3COOH", "ACIDE ACÉTIQUE": "CH3COOH",
        "METHANOL": "CH3OH", "MÉTHANOL": "CH3OH",
        "PERCARBONATE": "Na2CO3", "CRAIE": "CaCO3",
      };
      if (molMap[mol]) mol = molMap[mol];
      return {
        success: true,
        specs: [createVizSpec("chemistry", "molecule-3d", `Molécule ${mol}`, {
          molecule: mol,
        }, [])],
        sliders: [],
        explanation: `**Modèle 3D :** ${mol}\nTourne et zoome avec la souris !`,
      };
    },
  },

  // ═══════════════════════════════════════════════════════
  // CHEMISTRY: Dosage
  // ═══════════════════════════════════════════════════════
  {
    domain: "chemistry",
    patterns: [
      /dosage/i,
      /titrage/i,
      /acido-?basique/i,
      /[ée]quilibre/i,
      /[ée]quation.*chimique/i,
      /photosynth[èe]se/i,
    ],
    priority: 12,
    handle: () => ({
      success: true,
      specs: [createVizSpec("chemistry", "ph-calculator", "Dosage acido-basique", {
        acidConc: 0.1, baseConc: 0.1, acidVol: 50,
      }, ["pH = −log[H₃O⁺]", "C₁V₁ = C₂V₂"])],
      sliders: [],
      explanation: "**Dosage acido-basique**",
    }),
  },

  // ═══════════════════════════════════════════════════════
  // GEOMETRY: Triangle
  // ═══════════════════════════════════════════════════════
  {
    domain: "geometry",
    patterns: [
      /triangle/i,
    ],
    priority: 12,
    handle: (msg) => {
      const hasMed = /m[ée]diatrice/i.test(msg);
      const hasHauteur = /hauteur/i.test(msg);
      const hasBiss = /bissectrice/i.test(msg);
      return {
        success: true,
        specs: [createVizSpec("geometry", "triangle-construction", "Triangle ABC", {
          vertices: [[1, 1], [5, 1], [3, 4]],
          showMediatrice: hasMed,
          showHauteur: hasHauteur,
          showBissectrice: hasBiss,
          labels: ["A", "B", "C"],
        }, [])],
        sliders: [],
        explanation: `**Triangle ABC**${hasMed ? "\n• Médiatrice AB" : ""}${hasHauteur ? "\n• Hauteur depuis C" : ""}${hasBiss ? "\n• Bissectrice en A" : ""}`,
      };
    },
  },

  // ═══════════════════════════════════════════════════════
  // GEOMETRY: Circle
  // ═══════════════════════════════════════════════════════
  {
    domain: "geometry",
    patterns: [
      /cercle/i,
      /carr[ée]/i,
    ],
    priority: 11,
    handle: (msg) => {
      const rMatch = msg.match(/rayon\s+(?:de\s+)?(\d+(?:\.\d+)?)/i);
      const r = rMatch ? parseFloat(rMatch[1]) : 2;
      return {
        success: true,
        specs: [createVizSpec("geometry", "circle-construction", `Cercle (r = ${r})`, {
          center: [3, 3],
          radius: r,
          showRadius: true,
          labels: ["O"],
        }, [`C = 2πr = ${(2 * Math.PI * r).toFixed(2)}`, `S = πr² = ${(Math.PI * r * r).toFixed(2)}`])],
        sliders: [createSlider("radius", "Rayon", "r", "", 0.5, 5, 0.1, r)],
        explanation: `**Cercle :** r = ${r}\nC = ${(2 * Math.PI * r).toFixed(2)} | S = ${(Math.PI * r * r).toFixed(2)}`,
      };
    },
  },

  // ═══════════════════════════════════════════════════════
  // GEOMETRY: Transformations
  // ═══════════════════════════════════════════════════════
  {
    domain: "geometry",
    patterns: [
      /rotation/i,
      /sym[ée]trie/i,
      /translation/i,
      /homoth[ée]tie/i,
      /transformation/i,
      /vecteur/i,
      /somme.*vecteur/i,
    ],
    priority: 11,
    handle: (msg) => {
      const angleMatch = msg.match(/(\d+)\s*(?:degr[ée]s?|°)/i);
      const angle = angleMatch ? parseInt(angleMatch[1]) : 90;
      return {
        success: true,
        specs: [createVizSpec("geometry", "transformation-2d", `Rotation de ${angle}°`, {
          angle,
          points: [[2, 1], [4, 1], [3, 3]],
          labels: ["A", "B", "C"],
        }, [])],
        sliders: [createSlider("angle", "Angle", "θ", "°", 0, 360, 5, angle)],
        explanation: `**Rotation de ${angle}°**\nPoints transformés affichés.`,
      };
    },
  },

  // ═══════════════════════════════════════════════════════
  // ASTRONOMY: Solar system
  // ═══════════════════════════════════════════════════════
  {
    domain: "astronomy",
    patterns: [
      /syst[èe]me\s+solaire/i,
      /plan[èe]te/i,
      /orbite/i,
      /soleil/i,
      /terre.*soleil/i,
      /lune.*terre/i,
    ],
    priority: 12,
    handle: () => ({
      success: true,
      specs: [createVizSpec("astronomy", "solar-system", "Système solaire", {
        planets: [
          { name: "Mercure", dist: 0.39, size: 0.38, color: "#94a3b8", speed: 47.4 },
          { name: "Vénus", dist: 0.72, size: 0.95, color: "#fbbf24", speed: 35.0 },
          { name: "Terre", dist: 1.0, size: 1.0, color: "#3b82f6", speed: 29.8 },
          { name: "Mars", dist: 1.52, size: 0.53, color: "#ef4444", speed: 24.1 },
          { name: "Jupiter", dist: 5.2, size: 11.2, color: "#d97706", speed: 13.1 },
          { name: "Saturne", dist: 9.54, size: 9.4, color: "#ca8a04", speed: 9.7 },
        ],
      }, [])],
      sliders: [],
      explanation: "**Système solaire interactif**\nTourne, zoome, ajuste la vitesse.",
    }),
  },

  // ═══════════════════════════════════════════════════════
  // BIOLOGY: Cell
  // ═══════════════════════════════════════════════════════
  {
    domain: "biology",
    patterns: [
      /cellule/i,
      /organe(?:ll)?e/i,
    ],
    priority: 12,
    handle: (msg) => {
      const isPlant = /v[ée]g[ée]tale/i.test(msg);
      return {
        success: true,
        specs: [createVizSpec("biology", isPlant ? "cell-plant" : "cell-animal", isPlant ? "Cellule végétale" : "Cellule animale", {}, [])],
        sliders: [],
        explanation: isPlant ? "**Cellule végétale** — paroi, chloroplastes, vacuole" : "**Cellule animale** — membrane, centrioles",
      };
    },
  },

  // ═══════════════════════════════════════════════════════
  // DATA: Statistics
  // ═══════════════════════════════════════════════════════
  {
    domain: "data",
    patterns: [
      /donn[ée]es?\s*[:：]\s*(.+)/i,
      /statistiques?\s+(?:de\s+)?(.+)/i,
      /analyse\s+(?:ces\s+)?donn[ée]es?\s*[:：]?\s*(.+)/i,
      /moyenne|m[ée]diane|[ée]cart-type|variance/i,
      /histogramme/i,
      /graphique\s+(?:de\s+)?donn[ée]es?/i,
    ],
    priority: 12,
    handle: (msg) => {
      // Extract numbers from the message
      const numsMatch = msg.match(/[\d.,\s]+/g);
      const allNums = msg.match(/\d+(?:\.\d+)?/g)?.map(Number) || [];
      const data = allNums.length > 1 ? allNums : [12, 25, 18, 32, 40, 15, 28];
      const mean = data.reduce((a, b) => a + b, 0) / data.length;
      const sorted = [...data].sort((a, b) => a - b);
      const variance = data.reduce((a, b) => a + Math.pow(b - mean, 2), 0) / data.length;
      const median = sorted.length % 2 === 0
        ? (sorted[sorted.length / 2 - 1] + sorted[sorted.length / 2]) / 2
        : sorted[Math.floor(sorted.length / 2)];

      return {
        success: true,
        specs: [createVizSpec("data", "bar-chart", "Analyse de données", {
          data,
          labels: data.map((_, i) => `D${i + 1}`),
        }, [])],
        sliders: [],
        explanation: `**Données :** ${data.join(", ")}\n**Moyenne :** ${mean.toFixed(2)}\n**Médiane :** ${median.toFixed(2)}\n**Écart-type :** ${Math.sqrt(variance).toFixed(2)}\n**Min :** ${sorted[0]} | **Max :** ${sorted[sorted.length - 1]}`,
      };
    },
  },
];

// ═══════════════════════════════════════════════════════════════
// 🧪 MOTEUR PRINCIPAL
// ═══════════════════════════════════════════════════════════════

export function labEngine(userMessage: string): LabEngineResult {
  const msg = userMessage.trim();
  if (!msg) {
    return { success: false, specs: [], sliders: [], explanation: "Message vide", error: "Empty message" };
  }

  const sorted = [...DOMAIN_PATTERNS].sort((a, b) => b.priority - a.priority);

  for (const rule of sorted) {
    for (const pattern of rule.patterns) {
      const match = msg.match(pattern);
      if (match) {
        try {
          return rule.handle(msg, match);
        } catch (e) {
          return {
            success: false,
            specs: [],
            sliders: [],
            explanation: "",
            error: `Error in ${rule.domain} handler: ${e}`,
          };
        }
      }
    }
  }

  return {
    success: false,
    specs: [],
    sliders: [],
    explanation: "",
    error: "No matching visualization found",
  };
}

// ═══════════════════════════════════════════════════════════════
// 🔧 GESTION DU WORKSPACE
// ═══════════════════════════════════════════════════════════════

export function createWorkspace(title = "Nouveau laboratoire"): LabWorkspace {
  return {
    id: generateVizId(),
    title,
    visualizations: [],
    sliders: [],
    parameters: [],
    history: [],
    activeVizId: null,
    commands: [],
  };
}

export function addToWorkspace(ws: LabWorkspace, result: LabEngineResult): LabWorkspace {
  if (!result.success || result.specs.length === 0) return ws;
  const newViz = result.specs[0];
  const existingKeys = new Set(ws.sliders.map((s) => s.id));
  const newSliders = result.sliders.filter((s) => !existingKeys.has(s.id));
  return {
    ...ws,
    visualizations: [...ws.visualizations, newViz],
    sliders: [...ws.sliders, ...newSliders],
    history: [...ws.history, `Added: ${newViz.title}`],
    activeVizId: newViz.id,
  };
}

export function modifyVizSpec(ws: LabWorkspace, vizId: string, mods: Partial<LabVizSpec>): LabWorkspace {
  return {
    ...ws,
    visualizations: ws.visualizations.map((v) =>
      v.id === vizId ? { ...v, ...mods, params: { ...v.params, ...mods.params } } : v
    ),
  };
}
