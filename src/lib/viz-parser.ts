// ═══════════════════════════════════════════════════════════════
// 🔍 INTERPRETEUR DE LANGAGE NATUREL → VISUALISATION
// ═══════════════════════════════════════════════════════════════

import type { VizRequest, VizType } from "./viz-types";
import { safeEval, normalizeExpr } from "./viz-types";

// ═══════════════════════════════════════════════════════════════
// 📊 PATTERNS DE DÉTECTION
// ═══════════════════════════════════════════════════════════════

interface PatternRule {
  patterns: RegExp[];
  type: VizType;
  priority: number;
  extract: (match: string, full: string) => Partial<VizRequest>;
}

const PATTERN_RULES: PatternRule[] = [
  // ─── GRAPHIQUES 2D ───
  {
    patterns: [
      /trace?\s+(?:la\s+)?(?:courbe\s+de\s+)?f\s*\(\s*x\s*\)\s*=\s*(.+)/i,
      /dessine?\s+(?:la\s+)?f\s*\(\s*x\s*\)\s*=\s*(.+)/i,
      /graph(?:ique)?\s+(?:de\s+)?f\s*\(\s*x\s*\)\s*=\s*(.+)/i,
      /trace?\s+(.+)\s*(?:entre|de)\s+(-?\d+(?:\.\d+)?)\s+(?:et|à)\s+(-?\d+(?:\.\d+)?)/i,
      /trace?\s+(?:la\s+)?(.+)/i,
    ],
    type: "function-2d",
    priority: 10,
    extract: (_match, full) => {
      // Try to extract function expression
      const exprMatch = full.match(/(?:f\s*\(\s*x\s*\)\s*=\s*|y\s*=\s*)(.+?)(?:\s+entre|\s+de|\s+sur|$)/i);
      let expr = exprMatch ? exprMatch[1].trim() : "x^2";
      
      // Extract range
      const rangeMatch = full.match(/(?:entre|de)\s+(-?\d+(?:\.\d+)?)\s+(?:et|à)\s+(-?\d+(?:\.\d+)?)/i);
      const xMin = rangeMatch ? parseFloat(rangeMatch[1]) : -10;
      const xMax = rangeMatch ? parseFloat(rangeMatch[2]) : 10;
      
      expr = normalizeExpr(expr);
      
      return {
        title: `Courbe de f(x) = ${expr}`,
        equations: [`f(x) = ${expr}`],
        params: { expr, xMin, xMax, type: "single" },
      };
    },
  },
  {
    patterns: [
      /trace?\s+(?:les?\s+)?(?:courbes?\s+)?(.+)\s+et\s+(.+?)(?:\s+entre|\s+de|\s+sur|\s+sur le même)/i,
      /dessine?\s+(.+)\s+et\s+(.+?)(?:\s+entre|\s+de)/i,
      /superpose?\s+(.+)\s+et\s+(.+)/i,
      /(.+)\s+et\s+(.+?)\s+sur\s+(?:le\s+)?même\s+(?:graphique|courbe|axe)/i,
    ],
    type: "multi-function-2d",
    priority: 15,
    extract: (_match, full) => {
      const multiMatch = full.match(/(?:trace|dessine|superpose|graph)\s+(.+?)\s+et\s+(.+?)(?:\s+entre|\s+de|\s+sur|\s*$)/i);
      if (!multiMatch) return {};
      
      const expr1 = normalizeExpr(multiMatch[1].replace(/y\s*=\s*/gi, "").replace(/f\s*\(\s*x\s*\)\s*=\s*/gi, ""));
      const expr2 = normalizeExpr(multiMatch[2].replace(/y\s*=\s*/gi, "").replace(/f\s*\(\s*x\s*\)\s*=\s*/gi, ""));
      
      const rangeMatch = full.match(/(?:entre|de)\s+(-?\d+(?:\.\d+)?)\s+(?:et|à)\s+(-?\d+(?:\.\d+)?)/i);
      const xMin = rangeMatch ? parseFloat(rangeMatch[1]) : -10;
      const xMax = rangeMatch ? parseFloat(rangeMatch[2]) : 10;
      
      return {
        title: `Courbes de f(x) = ${expr1} et g(x) = ${expr2}`,
        equations: [`f(x) = ${expr1}`, `g(x) = ${expr2}`],
        params: { functions: [expr1, expr2], xMin, xMax, labels: ["f(x)", "g(x)"], colors: ["#6366f1", "#ef4444"] },
      };
    },
  },
  // ─── 3D ───
  {
    patterns: [
      /(?:en\s+)?3[dD]\s*(.+)/i,
      /fait?\s+(?:une?\s+)?(?:parabole|sphère|cône|cube|solide|vecteur|plan|droite)\s+(?:en\s+)?3[dD]/i,
      /montre?\s+(?:une?\s+)?(.+?)\s+en\s+3[dD]/i,
    ],
    type: "surface-3d",
    priority: 12,
    extract: (_match, full) => {
      const lower = full.toLowerCase();
      if (lower.includes("molécule") || lower.includes("molecule") || lower.includes("atome")) {
        const molMatch = full.match(/(?:molécule|molecule|atome)\s+(?:de\s+)?(\w+)/i);
        return {
          type: "molecule-3d",
          title: `Molécule ${molMatch?.[1] || "H₂O"}`,
          params: { molecule: molMatch?.[1] || "H2O" },
          equations: [],
        };
      }
      if (lower.includes("vecteur") || lower.includes("vector")) {
        return {
          type: "vector-3d",
          title: "Vecteur dans l'espace",
          params: {},
          equations: [],
        };
      }
      if (lower.includes("pendule")) {
        return {
          type: "pendulum-3d",
          title: "Pendule 3D",
          params: { length: 1, angle: 30 },
          equations: [],
        };
      }
      if (lower.includes("ressort")) {
        return {
          type: "spring-3d",
          title: "Ressort-masse",
          params: { k: 10, mass: 1, amplitude: 2 },
          equations: [],
        };
      }
      if (lower.includes("solide") || lower.includes("cube") || lower.includes("sphère") || lower.includes("cone") || lower.includes("cône")) {
        const solidMatch = full.match(/(cube|sphère|sphere|cône|cone|cylindre|prisme|pyramide)/i);
        return {
          type: "solid-3d",
          title: `Solide : ${solidMatch?.[1] || "Cube"}`,
          params: { solid: solidMatch?.[1]?.toLowerCase() || "cube", size: 1 },
          equations: [],
        };
      }
      // Default 3D surface
      const exprMatch = full.match(/(?:z\s*=\s*|f\s*\(.*?\)\s*=\s*)(.+)/i);
      const expr = exprMatch ? normalizeExpr(exprMatch[1]) : "sin(sqrt(x^2 + y^2))";
      return {
        title: `Surface 3D : z = ${expr}`,
        params: { expr, xMin: -5, xMax: 5, yMin: -5, yMax: 5 },
        equations: [`z = ${expr}`],
      };
    },
  },
  // ─── SIMULATIONS PHYSIQUES ───
  {
    patterns: [
      /simul(?:e|ation)\s+(?:une?\s+)?(?:balle|projectile|mouvement)\s+(?:lancée?\s+)?(?:à\s+)?(\d+(?:\.\d+)?)\s*m?\/s?\s*(?:avec\s+)?(?:un?\s+)?(?:angle\s+(?:de\s+)?)(\d+)/i,
      /simul(?:e|ation)\s+(?:une?\s+)?projectile/i,
      /(?:balle|mouvement)\s+parabolique/i,
      /projectile/i,
    ],
    type: "projectile-sim",
    priority: 11,
    extract: (_match, full) => {
      const v0Match = full.match(/(\d+(?:\.\d+)?)\s*m?\s*\/?\s*s/);
      const angleMatch = full.match(/angle\s+(?:de\s+)?(\d+)/i);
      return {
        title: "Simulation de projectile",
        params: {
          v0: v0Match ? parseFloat(v0Match[1]) : 20,
          angle: angleMatch ? parseFloat(angleMatch[1]) : 45,
          g: 9.81,
        },
        equations: ["x(t) = v₀·cos(θ)·t", "y(t) = v₀·sin(θ)·t − ½gt²"],
      };
    },
  },
  {
    patterns: [
      /simul(?:e|ation)\s+(?:la\s+)?chute\s+libre/i,
      /chute\s+libre/i,
      /objet\s+(?:qui\s+)?tombe/i,
      /corps\s+libre/i,
    ],
    type: "chute-libre-sim",
    priority: 11,
    extract: (_match, full) => {
      const hMatch = full.match(/(?:de\s+|hauteur\s+(?:de\s+)?)?(\d+(?:\.\d+)?)\s*m/);
      return {
        title: "Chute libre",
        params: {
          h0: hMatch ? parseFloat(hMatch[1]) : 10,
          g: 9.81,
        },
        equations: ["y(t) = h₀ − ½gt²", "v(t) = −gt", "t_chute = √(2h₀/g)"],
      };
    },
  },
  {
    patterns: [
      /simul(?:e|ation)\s+(?:d'?\s*)?un?\s*pendule/i,
      /pendule/i,
      /oscillation\s+(?:d'?\s*)?un?\s*pendule/i,
    ],
    type: "pendulum-sim",
    priority: 11,
    extract: (_match, full) => {
      const lMatch = full.match(/(?:longueur\s+(?:de\s+)?)?(\d+(?:\.\d+)?)\s*m/);
      const aMatch = full.match(/(?:angle\s+(?:de\s+)?)(\d+)/i);
      return {
        title: "Pendule simple",
        params: {
          length: lMatch ? parseFloat(lMatch[1]) : 1,
          angle0: aMatch ? parseFloat(aMatch[1]) : 30,
          g: 9.81,
        },
        equations: ["T = 2π√(L/g)", "θ(t) = θ₀·cos(ωt)", "ω = √(g/L)"],
      };
    },
  },
  {
    patterns: [
      /simul(?:e|ation)\s+(?:d'?\s*)?une?\s*onde/i,
      /onde\s+(?:progressive|stationnaire)/i,
      /propagation\s+d'onde/i,
    ],
    type: "onde-sim",
    priority: 11,
    extract: (_match, full) => {
      const aMatch = full.match(/amplitude\s+(?:de\s+)?(\d+(?:\.\d+)?)/i);
      const fMatch = full.match(/fr[ée]quence\s+(?:de\s+)?(\d+(?:\.\d+)?)/i);
      return {
        title: "Simulation d'onde",
        params: {
          amplitude: aMatch ? parseFloat(aMatch[1]) : 1,
          frequency: fMatch ? parseFloat(fMatch[1]) : 2,
          speed: 5,
        },
        equations: ["y(x,t) = A·sin(kx − ωt)", "v = λ·f", "ω = 2πf", "k = 2π/λ"],
      };
    },
  },
  // ─── CIRCUITS ───
  {
    patterns: [
      /montre(?:-moi)?\s+(?:un?\s+)?circuit\s*(?:rc|rl|rlc)/i,
      /circuit\s*(?:rc|rl|rlc)/i,
      /condensateur/i,
      /charge\s+(?:d'?\s*)?un?\s*condensateur/i,
    ],
    type: "circuit-rc-sim",
    priority: 12,
    extract: (_match, full) => {
      const rMatch = full.match(/(?:r[ée]sistance\s+(?:de\s+)?)?(\d+)\s*(?:Ω|ohm)/i);
      const cMatch = full.match(/(?:condensateur\s+(?:de\s+)?)?(\d+)\s*(?:μ?F)/i);
      return {
        title: "Circuit RC",
        params: {
          R: rMatch ? parseFloat(rMatch[1]) : 100,
          C: cMatch ? parseFloat(cMatch[1]) : 100,
          U0: 5,
        },
        equations: ["τ = R·C", "Uc(t) = U₀(1 − e^(−t/τ))", "i(t) = (U₀/R)·e^(−t/τ)"],
      };
    },
  },
  // ─── DOSAGE ───
  {
    patterns: [
      /dosage/i,
      /titrage/i,
      /montre(?:-moi)?\s+(?:un?\s+)?dosage/i,
      /acido-?basique/i,
    ],
    type: "dosage-sim",
    priority: 12,
    extract: () => ({
      title: "Dosage acido-basique",
      params: { acidConc: 0.1, baseConc: 0.1, acidVol: 50, volume: 0 },
      equations: ["pH = −log[H₃O⁺]", "C₁V₁ = C₂V₂"],
    }),
  },
  // ─── DIAGRAMMES SCIENTIFIQUES ───
  {
    patterns: [
      /sch[ée]ma\s+(?:d'?\s*)?(?:un?\s+)?circuit/i,
      /circuit\s+[ée]lectrique/i,
      /montre(?:-moi)?\s+(?:un?\s+)?circuit\s+[ée]lectrique/i,
    ],
    type: "diagram-circuit",
    priority: 8,
    extract: () => ({
      title: "Schéma de circuit électrique",
      params: { components: ["R1", "R2", "U"] },
      equations: [],
    }),
  },
  {
    patterns: [
      /diagramme?\s+(?:des?\s+)?forces?\s*(?:isolées?)?/i,
      /corps?\s+(?:isolé|libre)/i,
      /sch[ée]ma?\s+(?:des?\s+)?forces?/i,
      /forces?\s+sur\s+(?:un?\s+)?(?:plan|corps|objet)/i,
    ],
    type: "diagram-forces",
    priority: 8,
    extract: () => ({
      title: "Diagramme des forces isolées",
      params: { forces: ["Poids", "Normale", "Frottements"] },
      equations: ["F = m·a", "P = m·g"],
    }),
  },
  {
    patterns: [
      /sch[ée]ma?\s+(?:d'?\s*)?optique/i,
      /optique\s+(?:géométrique|rayon)/i,
      /montre(?:-moi)?\s+(?:un?\s+)?sch[ée]ma\s+d'optique/i,
      /lentille|miroir|prisme/i,
    ],
    type: "diagram-optique",
    priority: 8,
    extract: () => ({
      title: "Schéma d'optique",
      params: { type: "lentille", focal: 10 },
      equations: ["1/f = 1/p + 1/p'"],
    }),
  },
  {
    patterns: [
      /cellule\s+v[ée]g[ée]tale/i,
      /cellule\s+animale/i,
      /organe(?:ll)?e/i,
      /montre(?:-moi)?\s+une?\s+cellule/i,
      /biologie/i,
    ],
    type: "diagram-cellule",
    priority: 8,
    extract: () => ({
      title: "Cellule végétale",
      params: {},
      equations: [],
    }),
  },
  // ─── STATISTIQUES ───
  {
    patterns: [
      /(?:histogramme|camembert|diagramme)\s+(?:de\s+)?(.+)/i,
      /statistiques?\s+(?:de\s+)?(.+)/i,
      /nuage\s+de\s+points/i,
    ],
    type: "statistics",
    priority: 6,
    extract: (_match, full) => ({
      title: `Statistiques : ${full}`,
      params: { data: [12, 25, 18, 32, 15, 28, 22, 35, 10, 20] },
      equations: [],
    }),
  },
];

// ═══════════════════════════════════════════════════════════════
// 🔍 INTERPRETEUR PRINCIPAL
// ═══════════════════════════════════════════════════════════════

export function parseVizRequest(userMessage: string): VizRequest | null {
  const msg = userMessage.trim();
  
  // Try each pattern rule, sorted by priority
  const sortedRules = [...PATTERN_RULES].sort((a, b) => b.priority - a.priority);
  
  for (const rule of sortedRules) {
    for (const pattern of rule.patterns) {
      const match = msg.match(pattern);
      if (match) {
        const extracted = rule.extract(match[0], msg);
        return {
          type: extracted.type || rule.type,
          title: extracted.title || "Visualisation",
          explanation: extracted.explanation || "",
          equations: extracted.equations || [],
          params: extracted.params || {},
          functions: extracted.functions,
        };
      }
    }
  }
  
  return null;
}

/**
 * Check if the user wants to modify the current visualization
 */
export function isModificationRequest(userMessage: string): boolean {
  const lower = userMessage.toLowerCase();
  const modPatterns = [
    /ajoute?\s+(?:la\s+)?(?:courbe|fonction|graph)/i,
    /supprime?\s+(?:la\s+)?(?:courbe|courbes)/i,
    /change?\s+(?:l'?\s*)?(?:intervalle|plage|range|couleur|épaisseur)/i,
    /modif(?:ie)?\s+(?:les?\s+)?(?:paramètre|param)/i,
    /mets?\s+(?:en\s+)?3[dD]/i,
    /agrandi/i,
    /rédui/i,
    /zoom/i,
    /dézoom/i,
    /ajoute?\s+(?:un?\s+)?(?:axe|grille|légende)/i,
    /change?\s+(?:l'?\s*)?(?:échelle|scale)/i,
    /rend?\s+(?:le\s+)?graph(?:ique)?\s+(?:plus|moins)/i,
    /met\s+(?:les?\s+)?(?:axes?|grille|légende)/i,
    /enl[èe]ve?\s+(?:les?\s+)?(?:axes?|grille|légende)/i,
  ];
  return modPatterns.some((p) => p.test(lower));
}

/**
 * Parse modification request for the current visualization
 */
export function parseModification(
  userMessage: string,
  current: VizRequest
): Partial<VizRequest> {
  const lower = userMessage.toLowerCase();
  const mods: Partial<VizRequest> = {};
  
  // Add function
  const addMatch = lower.match(/ajoute?\s+(?:la\s+)?(?:courbe|fonction)\s+(?:de\s+)?(?:f\s*\(\s*x\s*\)\s*=\s*|y\s*=\s*)?(.+?)(?:\s+sur|$)/i);
  if (addMatch && (current.type === "function-2d" || current.type === "multi-function-2d")) {
    const newExpr = normalizeExpr(addMatch[1]);
    const prevFuncs = current.params.functions as string[] || [(current.params as Record<string, string>).expr];
    mods.params = {
      ...current.params,
      functions: [...prevFuncs, newExpr],
      labels: [...((current.params.labels as string[]) || ["f(x)"]), `h(x)`],
      colors: [...((current.params.colors as string[]) || ["#6366f1"]), "#10b981"],
    };
    mods.type = "multi-function-2d";
    mods.title = `${prevFuncs.length + 1} courbes`;
  }
  
  // Change range
  const rangeMatch = lower.match(/(?:intervalle|plage|range)\s+(?:de\s+)?(-?\d+)\s+(?:à|a|et)\s+(-?\d+)/i);
  if (rangeMatch) {
    mods.params = { ...current.params, xMin: parseInt(rangeMatch[1]), xMax: parseInt(rangeMatch[2]) };
  }
  
  // Switch to 3D
  if (/mets?\s+(?:en\s+)?3[dD]/i.test(lower) || /3[dD]/i.test(lower)) {
    if (current.type === "function-2d" || current.type === "multi-function-2d") {
      mods.type = "surface-3d";
      mods.title = `Surface 3D`;
      const expr = (current.params.functions as string[])?.[0] || (current.params as Record<string, string>).expr || "sin(sqrt(x^2 + y^2))";
      mods.params = { expr, xMin: -5, xMax: 5, yMin: -5, yMax: 5 };
    }
  }
  
  // Change parameters
  const paramMatch = lower.match(/(?:paramètre|param)\s+(\w+)\s*=\s*([\d.]+)/i);
  if (paramMatch) {
    mods.params = { ...current.params, [paramMatch[1]]: parseFloat(paramMatch[2]) };
  }
  
  return mods;
}

/**
 * Generate explanation text for a visualization
 */
export function generateExplanation(viz: VizRequest): string {
  const lines: string[] = [];
  
  switch (viz.type) {
    case "function-2d":
    case "multi-function-2d": {
      const funcs = viz.params.functions as string[] || [(viz.params as Record<string, string>).expr];
      lines.push(`**Visualisation de ${funcs.length > 1 ? funcs.length + " fonctions" : "la fonction"} :**`);
      funcs.forEach((f, i) => {
        lines.push(`• f${funcs.length > 1 ? String.fromCharCode(8321 + i) : ""}(x) = ${f}`);
      });
      const xMin = viz.params.xMin as number ?? -10;
      const xMax = viz.params.xMax as number ?? 10;
      lines.push(`\n**Intervalle :** [${xMin}, ${xMax}]`);
      
      // Find zeros
      if (funcs.length === 1) {
        const zeros: number[] = [];
        for (let x = xMin; x <= xMax; x += 0.1) {
          const y1 = safeEval(funcs[0], x);
          const y2 = safeEval(funcs[0], x + 0.1);
          if (y1 * y2 <= 0 && isFinite(y1) && isFinite(y2)) {
            zeros.push(Math.round(x * 10) / 10);
          }
        }
        if (zeros.length > 0) {
          lines.push(`**Zéros :** x ≈ ${zeros.map((z) => z.toString()).join(", ")}`);
        }
        
        // Check for minimum
        let minY = Infinity;
        let minX = 0;
        for (let x = xMin; x <= xMax; x += 0.1) {
          const y = safeEval(funcs[0], x);
          if (y < minY && isFinite(y)) { minY = y; minX = x; }
        }
        if (isFinite(minY)) {
          lines.push(`**Minimum :** f(${Math.round(minX * 100) / 100}) = ${Math.round(minY * 100) / 100}`);
        }
      }
      break;
    }
    
    case "projectile-sim": {
      const { v0, angle, g } = viz.params as { v0: number; angle: number; g: number };
      const rad = (angle * Math.PI) / 180;
      const R = (v0 * v0 * Math.sin(2 * rad)) / g;
      const H = (v0 * v0 * Math.sin(rad) * Math.sin(rad)) / (2 * g);
      const tTotal = (2 * v0 * Math.sin(rad)) / g;
      lines.push(`**Mouvement parabolique :**`);
      lines.push(`• Vitesse initiale : v₀ = ${v0} m/s`);
      lines.push(`• Angle : θ = ${angle}°`);
      lines.push(`• Portée : R = ${R.toFixed(1)} m`);
      lines.push(`• Hauteur max : H = ${H.toFixed(1)} m`);
      lines.push(`• Durée du vol : t = ${tTotal.toFixed(2)} s`);
      break;
    }
    
    case "pendulum-sim": {
      const { length, g } = viz.params as { length: number; g: number };
      const T = 2 * Math.PI * Math.sqrt(length / g);
      lines.push(`**Pendule simple :**`);
      lines.push(`• Longueur : L = ${length} m`);
      lines.push(`• Période : T = 2π√(L/g) = ${T.toFixed(3)} s`);
      lines.push(`• Pulsation : ω = √(g/L) = ${Math.sqrt(g / length).toFixed(3)} rad/s`);
      break;
    }
    
    case "circuit-rc-sim": {
      const { R, C, U0 } = viz.params as { R: number; C: number; U0: number };
      const tau = (R * C) / 1000;
      lines.push(`**Circuit RC :**`);
      lines.push(`• Résistance : R = ${R} Ω`);
      lines.push(`• Capacité : C = ${C} μF`);
      lines.push(`• Tension : U₀ = ${U0} V`);
      lines.push(`• Constante de temps : τ = RC = ${tau.toFixed(3)} s`);
      lines.push(`• Charge à 63% : t = τ = ${tau.toFixed(3)} s`);
      lines.push(`• Charge à 99% : t = 5τ = ${(tau * 5).toFixed(2)} s`);
      break;
    }
    
    case "molecule-3d": {
      const mol = viz.params.molecule as string;
      lines.push(`**Modèle 3D de la molécule :** ${mol}`);
      lines.push(`L'atome est rendu en sphères et les liaisons en cylindres.`);
      lines.push(`Tourne et zoome avec la souris !`);
      break;
    }
    
    case "surface-3d": {
      lines.push(`**Surface 3D :**`);
      if (viz.params.expr) {
        lines.push(`z = ${viz.params.expr}`);
      }
      lines.push(`La surface est rendue en 3D avec éclairage dynamique.`);
      lines.push(`Tourne avec la souris, zoome avec la molette !`);
      break;
    }
    
    default:
      lines.push(`**${viz.title}**`);
      if (viz.equations.length > 0) {
        lines.push(`Formules : ${viz.equations.join(" ; ")}`);
      }
  }
  
  return lines.join("\n");
}
