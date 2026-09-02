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
import { createVizSpec, createSlider, generateVizId } from "./lab-schema";
import { safeEval, normalizeExpr } from "../viz-types";
import { extractParams } from "./lab-schema";

// ═══════════════════════════════════════════════════════════════
// 🧠 PATTERNS DE DÉTECTION PAR DOMAINE
// ═══════════════════════════════════════════════════════════════

interface DomainPattern {
  domain: LabDomain;
  patterns: RegExp[];
  priority: number;
  handle: (msg: string, match: RegExpMatchArray) => LabEngineResult;
}

const DOMAIN_PATTERNS: DomainPattern[] = [
  // ─── MATH: Derivative ───
  {
    domain: "math",
    patterns: [
      /d[ée]riv[ée]e?\s+(?:de\s+)?(?:f\s*\(\s*x\s*\)\s*=\s*|y\s*=?\s*)(.+)/i,
      /montre?\s+(?:la\s+)?d[ée]riv[ée]e?\s+(?:de\s+)?(.+)/i,
      /trace?\s+(?:la\s+)?f'\s*\(?\s*x?\s*\)?\s*(?:de\s+)?(.+)/i,
    ],
    priority: 16,
    handle: (msg, _match) => {
      const exprMatch = msg.match(/(?:de\s+)?(?:f\s*\(\s*x\s*\)\s*=\s*|y\s*=?\s*)(.+?)(?:\s+entre|\s+de|\s+sur|$)/i);
      const expr = normalizeExpr(exprMatch?.[1] || "x^2");
      const rangeMatch = msg.match(/(?:entre|de)\s+(-?\d+(?:\.\d+)?)\s+(?:et|à)\s+(-?\d+(?:\.\d+)?)/i);
      const xMin = rangeMatch ? parseFloat(rangeMatch[1]) : -10;
      const xMax = rangeMatch ? parseFloat(rangeMatch[2]) : 10;

      const sliders: LabSliderParam[] = [];
      const params = extractParams(expr);
      for (const p of params) {
        sliders.push(createSlider(p, `Coefficient ${p}`, p, "", -5, 5, 0.1, 1));
      }

      return {
        success: true,
        specs: [createVizSpec("math", "derivative-plot", `Dérivée de f(x) = ${expr}`, {
          expr, xMin, xMax, showOriginal: true, showDerivative: true,
        }, [`f(x) = ${expr}`, `f'(x) ≈ dérivée numérique`])],
        sliders,
        explanation: `**Analyse de f(x) = ${expr}**\n\n**Observation :** Le graphique montre f(x) et sa dérivée f'(x).\n**Interprétation :** Quand f'(x) > 0 → f croissante. Quand f'(x) < 0 → f décroissante.\nQuand f'(x) = 0 → extremum (min ou max).`,
      };
    },
  },

  // ─── MATH: Function plot ───
  {
    domain: "math",
    patterns: [
      /trace?r?\s+(?:la\s+)?(?:courbe\s+de\s+)?(?:f\s*\(\s*x\s*\)\s*=\s*|y\s*=\s*)(.+)/i,
      /dessine?\s+(?:la\s+)?(?:f\s*\(\s*x\s*\)\s*=\s*|y\s*=\s*)(.+)/i,
      /graph(?:ique)?\s+(?:de\s+)?(?:f\s*\(\s*x\s*\)\s*=\s*|y\s*=\s*)(.+)/i,
    ],
    priority: 14,
    handle: (msg, _match) => {
      const exprMatch = msg.match(/(?:f\s*\(\s*x\s*\)\s*=\s*|y\s*=\s*)(.+?)(?:\s+entre|\s+de|\s+sur|\s+avec|\s+sur le même|\s+et\s+(?:la\s+)?(?:courbe|fonction|sin|cos)|$)/i);
      const expr = normalizeExpr(exprMatch?.[1]?.trim() || "x^2");
      const rangeMatch = msg.match(/(?:entre|de)\s+(-?\d+(?:\.\d+)?)\s+(?:et|à)\s+(-?\d+(?:\.\d+)?)/i);
      const xMin = rangeMatch ? parseFloat(rangeMatch[1]) : -10;
      const xMax = rangeMatch ? parseFloat(rangeMatch[2]) : 10;

      const sliders: LabSliderParam[] = [];
      const params = extractParams(expr);
      for (const p of params) {
        sliders.push(createSlider(p, `Coefficient ${p}`, p, "", -10, 10, 0.1, 1));
      }

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

  // ─── MATH: Multiple functions ───
  {
    domain: "math",
    patterns: [
      /trace?r?\s+(.+?)\s+et\s+(.+?)(?:\s+entre|\s+de|\s+sur|\s+sur le même|\s*$)/i,
      /superpose?\s+(.+?)\s+et\s+(.+)/i,
      /(.+?)\s+et\s+(.+?)\s+sur\s+(?:le\s+)?même\s+(?:graphique|courbe)/i,
    ],
    priority: 15,
    handle: (msg, _match) => {
      const multiMatch = msg.match(/(?:trace|dessine|superpose|graph)\s+(.+?)\s+et\s+(.+?)(?:\s+entre|\s+de|\s+sur|\s*$)/i)
        || msg.match(/(.+?)\s+et\s+(.+?)(?:\s+sur\s+(?:le\s+)?même|\s*$)/i);
      if (!multiMatch) return { success: false, specs: [], sliders: [], explanation: "Could not parse" };

      const e1 = normalizeExpr(multiMatch[1].replace(/y\s*=\s*/gi, "").replace(/f\s*\(\s*x\s*\)\s*=\s*/gi, "").trim());
      const e2 = normalizeExpr(multiMatch[2].replace(/y\s*=\s*/gi, "").replace(/f\s*\(\s*x\s*\)\s*=\s*/gi, "").trim());

      const rangeMatch = msg.match(/(?:entre|de)\s+(-?\d+(?:\.\d+)?)\s+(?:et|à)\s+(-?\d+(?:\.\d+)?)/i);
      const xMin = rangeMatch ? parseFloat(rangeMatch[1]) : -10;
      const xMax = rangeMatch ? parseFloat(rangeMatch[2]) : 10;

      return {
        success: true,
        specs: [createVizSpec("math", "multi-function-plot", `${e1} et ${e2}`, {
          functions: [e1, e2], xMin, xMax,
          labels: ["f(x)", "g(x)"], colors: ["#6366f1", "#ef4444"],
        }, [`f(x) = ${e1}`, `g(x) = ${e2}`])],
        sliders: [],
        explanation: `**Superposition de deux courbes :**\nf(x) = ${e1}\ng(x) = ${e2}`,
      };
    },
  },

  // ─── PHYSICS: Projectile ───
  {
    domain: "physics",
    patterns: [
      /simul(?:e|ation)\s+(?:une?\s+)?(?:balle|projectile|mouvement)\s+(?:lancée?\s+)?(?:à\s+)?(\d+(?:\.\d+)?)\s*m?\s*\/?\s*s?\s*(?:avec\s+)?(?:un?\s+)?(?:angle\s+(?:de\s+)?)(\d+)/i,
      /simul(?:e|ation)\s+(?:une?\s+)?projectile/i,
      /mouvement\s+parabolique/i,
      /projectile/i,
    ],
    priority: 13,
    handle: (msg, _match) => {
      const v0Match = msg.match(/(\d+(?:\.\d+)?)\s*m?\s*\/?\s*s/);
      const angleMatch = msg.match(/angle\s+(?:de\s+)?(\d+)/i);
      const v0 = v0Match ? parseFloat(v0Match[1]) : 20;
      const angle = angleMatch ? parseFloat(angleMatch[1]) : 45;

      return {
        success: true,
        specs: [
          createVizSpec("physics", "projectile-sim", "Simulation de projectile", {
            v0, angle, g: 9.81,
          }, ["x(t) = v₀·cos(θ)·t", "y(t) = v₀·sin(θ)·t − ½gt²"]),
        ],
        sliders: [
          createSlider("v0", "Vitesse initiale", "v₀", "m/s", 5, 50, 0.5, v0),
          createSlider("angle", "Angle", "θ", "°", 5, 85, 1, angle),
        ],
        explanation: `**Projectile :** v₀ = ${v0} m/s, θ = ${angle}°\n**Portée :** R = ${((v0 * v0 * Math.sin(2 * angle * Math.PI / 180)) / 9.81).toFixed(1)} m\n**Hauteur max :** H = ${((v0 * v0 * Math.pow(Math.sin(angle * Math.PI / 180), 2)) / (2 * 9.81)).toFixed(1)} m`,
      };
    },
  },

  // ─── PHYSICS: Free fall ───
  {
    domain: "physics",
    patterns: [
      /simul(?:e|ation)\s+(?:la\s+)?chute\s+libre/i,
      /chute\s+libre/i,
      /objet\s+(?:qui\s+)?tombe/i,
    ],
    priority: 13,
    handle: (msg, _match) => {
      const hMatch = msg.match(/(?:de\s+|hauteur\s+(?:de\s+)?)?(\d+(?:\.\d+)?)\s*m/);
      const h0 = hMatch ? parseFloat(hMatch[1]) : 10;
      return {
        success: true,
        specs: [createVizSpec("physics", "free-fall-sim", "Chute libre", {
          h0, g: 9.81,
        }, ["y(t) = h₀ − ½gt²", "v(t) = −gt", "t = √(2h₀/g)"])],
        sliders: [createSlider("h0", "Hauteur initiale", "h₀", "m", 1, 50, 0.5, h0)],
        explanation: `**Chute libre :** h₀ = ${h0} m\nTemps de chute : ${Math.sqrt(2 * h0 / 9.81).toFixed(2)} s\nVitesse finale : ${(Math.sqrt(2 * 9.81 * h0)).toFixed(1)} m/s`,
      };
    },
  },

  // ─── PHYSICS: Pendulum ───
  {
    domain: "physics",
    patterns: [
      /simul(?:e|ation)\s+(?:d'?\\s*)?un?\s*pendule/i,
      /pendule/i,
      /oscillation.*pendule/i,
    ],
    priority: 13,
    handle: (msg, _match) => {
      const lMatch = msg.match(/(?:longueur\s+(?:de\s+)?)?(\d+(?:\.\d+)?)\s*m/);
      const aMatch = msg.match(/(?:angle\s+(?:de\s+)?)(\d+)/i);
      const L = lMatch ? parseFloat(lMatch[1]) : 1;
      const theta0 = aMatch ? parseFloat(aMatch[1]) : 30;
      return {
        success: true,
        specs: [createVizSpec("physics", "pendulum-sim", "Pendule simple", {
          length: L, angle0: theta0, g: 9.81,
        }, ["T = 2π√(L/g)", "θ(t) = θ₀·cos(ωt)", "ω = √(g/L)"])],
        sliders: [
          createSlider("length", "Longueur", "L", "m", 0.2, 3, 0.1, L),
          createSlider("angle0", "Angle initial", "θ₀", "°", 5, 60, 1, theta0),
        ],
        explanation: `**Pendule :** L = ${L} m, θ₀ = ${theta0}°\n**Période :** T = ${(2 * Math.PI * Math.sqrt(L / 9.81)).toFixed(3)} s\n**Pulsation :** ω = ${Math.sqrt(9.81 / L).toFixed(3)} rad/s`,
      };
    },
  },

  // ─── PHYSICS: Wave ───
  {
    domain: "physics",
    patterns: [
      /simul(?:e|ation)\s+(?:d'?\\s*)?une?\s*onde/i,
      /onde\s+(?:progressive|stationnaire)/i,
      /propagation\s+d'onde/i,
    ],
    priority: 13,
    handle: (msg, _match) => {
      return {
        success: true,
        specs: [createVizSpec("physics", "wave-sim", "Onde sinusoïdale", {
          amplitude: 1, frequency: 2, speed: 5,
        }, ["y(x,t) = A·sin(kx − ωt)", "v = λ·f", "ω = 2πf"])],
        sliders: [
          createSlider("amplitude", "Amplitude", "A", "m", 0.1, 3, 0.1, 1),
          createSlider("frequency", "Fréquence", "f", "Hz", 0.5, 10, 0.1, 2),
        ],
        explanation: `**Onde sinusoïdale :**\nAmplitude A = 1 m, fréquence f = 2 Hz\nLongueur d'onde λ = ${(5 / 2).toFixed(1)} m`,
      };
    },
  },

  // ─── ELECTRICITY: Circuit RC ───
  {
    domain: "electricity",
    patterns: [
      /montre(?:-moi)?\s+(?:un?\s+)?circuit\s*(?:rc|rl|rlc)/i,
      /circuit\s*(?:rc|rl|rlc)/i,
      /condensateur/i,
      /charge\s+(?:d'?\\s*)?un?\s*condensateur/i,
    ],
    priority: 13,
    handle: (msg, _match) => {
      const rMatch = msg.match(/(\d+)\s*(?:Ω|ohm)/i);
      const cMatch = msg.match(/(\d+)\s*(?:μ?F)/i);
      const R = rMatch ? parseFloat(rMatch[1]) : 100;
      const C = cMatch ? parseFloat(cMatch[1]) : 100;
      const tau = (R * C) / 1000;
      return {
        success: true,
        specs: [createVizSpec("electricity", "circuit-rc", "Circuit RC — Charge", {
          R, C, U0: 5,
        }, ["τ = R·C", "Uc(t) = U₀(1 − e^(−t/τ))"])],
        sliders: [
          createSlider("R", "Résistance", "R", "Ω", 10, 1000, 10, R),
          createSlider("C", "Capacité", "C", "μF", 10, 1000, 10, C),
        ],
        explanation: `**Circuit RC :**\nR = ${R} Ω, C = ${C} μF\nτ = ${tau.toFixed(3)} s\nCharge 63% à t = τ, 99% à t = 5τ`,
      };
    },
  },

  // ─── CHEMISTRY: Molecule ───
  {
    domain: "chemistry",
    patterns: [
      /montre(?:-moi)?\s+(?:une?\s+)?mol[ée]cule\s+(?:de\s+)?(\w+)/i,
      /mol[ée]cule\s+(?:de\s+)?(\w+)\s+en\s+3[dD]/i,
      /(\w+)\s+en\s+3[dD]/i,
    ],
    priority: 12,
    handle: (msg, _match) => {
      const molMatch = msg.match(/mol[ée]cule\s+(?:de\s+)?(\w+)/i)
        || msg.match(/montre(?:-moi)?\s+(\w+)/i);
      const mol = molMatch?.[1] || "H2O";
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

  // ─── CHEMISTRY: pH ───
  {
    domain: "chemistry",
    patterns: [
      /dosage/i,
      /titrage/i,
      /acido-?basique/i,
      /montre(?:-moi)?\s+(?:un?\s+)?dosage/i,
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

  // ─── GEOMETRY: Triangle ───
  {
    domain: "geometry",
    patterns: [
      /triangle/i,
      /m[ée]diatrice/i,
      /bissectrice/i,
      /hauteur.*triangle/i,
    ],
    priority: 11,
    handle: (msg, _match) => {
      const hasMed = /m[ée]diatrice/i.test(msg);
      const hasHauteur = /hauteur/i.test(msg);
      const hasBissectrice = /bissectrice/i.test(msg);
      return {
        success: true,
        specs: [createVizSpec("geometry", "triangle-construction", "Construction de triangle", {
          vertices: [[1, 1], [5, 1], [3, 4]],
          showMediatrice: hasMed,
          showHauteur: hasHauteur,
          showBissectrice: hasBissectrice,
          labels: ["A", "B", "C"],
        }, [])],
        sliders: [],
        explanation: `**Triangle ABC**\n${hasMed ? "• Médiatrice AB affichée\n" : ""}${hasHauteur ? "• Hauteur depuis C affichée\n" : ""}${hasBissectrice ? "• Bissectrice en A affichée\n" : ""}`,
      };
    },
  },

  // ─── ASTRONOMY: Solar system ───
  {
    domain: "astronomy",
    patterns: [
      /syst[èe]me\s+solaire/i,
      /orbite/i,
      /plan[èe]te/i,
      /lune/i,
    ],
    priority: 11,
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
      explanation: "**Système solaire interactif\nPlanètes avec orbites et vitesses relatives.",
    }),
  },

  // ─── BIOLOGY: Cell ───
  {
    domain: "biology",
    patterns: [
      /cellule\s+v[ée]g[ée]tale/i,
      /cellule\s+animale/i,
      /organe(?:ll)?e/i,
      /montre(?:-moi)?\s+une?\s+cellule/i,
    ],
    priority: 11,
    handle: (msg) => {
      const isPlant = /v[ée]g[ée]tale/i.test(msg);
      return {
        success: true,
        specs: [createVizSpec("biology", isPlant ? "cell-plant" : "cell-animal", isPlant ? "Cellule végétale" : "Cellule animale", {}, [])],
        sliders: [],
        explanation: isPlant ? "**Cellule végétale** — paroi, chloroplastes, grande vacuole" : "**Cellule animale** — membrane, centrioles, petite vacuole",
      };
    },
  },

  // ─── DATA: Statistics ───
  {
    domain: "data",
    patterns: [
      /statistiques?\s+(?:de\s+)?(.+)/i,
      /histogramme\s+(?:de\s+)?(.+)/i,
      /nuage\s+de\s+points/i,
      /r[ée]gression/i,
    ],
    priority: 10,
    handle: (msg, _match) => {
      // Try to extract numbers
      const nums = msg.match(/\d+(?:\.\d+)?/g)?.map(Number) || [12, 25, 18, 32, 15, 28, 22, 35, 10, 20];
      const mean = nums.reduce((a, b) => a + b, 0) / nums.length;
      const variance = nums.reduce((a, b) => a + Math.pow(b - mean, 2), 0) / nums.length;
      return {
        success: true,
        specs: [createVizSpec("data", "bar-chart", "Analyse de données", {
          data: nums,
          labels: nums.map((_, i) => `Point ${i + 1}`),
        }, [])],
        sliders: [],
        explanation: `**Données :** ${nums.join(", ")}\n**Moyenne :** ${mean.toFixed(2)}\n**Écart-type :** ${Math.sqrt(variance).toFixed(2)}\n**Min :** ${Math.min(...nums)} | **Max :** ${Math.max(...nums)}`,
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
    history: [],
    activeVizId: null,
  };
}

export function addToWorkspace(
  ws: LabWorkspace,
  result: LabEngineResult
): LabWorkspace {
  if (!result.success || result.specs.length === 0) return ws;

  const newViz = result.specs[0];
  const newVizs = [...ws.visualizations, newViz];

  // Merge sliders (don't duplicate)
  const existingKeys = new Set(ws.sliders.map((s) => s.key));
  const newSliders = result.sliders.filter((s) => !existingKeys.has(s.key));

  return {
    ...ws,
    visualizations: newVizs,
    sliders: [...ws.sliders, ...newSliders],
    history: [...ws.history, `Added: ${newViz.title}`],
    activeVizId: newViz.id,
  };
}

export function modifyVizSpec(
  ws: LabWorkspace,
  vizId: string,
  mods: Partial<LabVizSpec>
): LabWorkspace {
  return {
    ...ws,
    visualizations: ws.visualizations.map((v) =>
      v.id === vizId ? { ...v, ...mods, params: { ...v.params, ...mods.params } } : v
    ),
  };
}
