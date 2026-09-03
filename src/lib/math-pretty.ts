// ═══════════════════════════════════════════════════════════════
// 🧮 MATH-PRETTY — convertit la notation LaTeX (celle renvoyée par
// l’IA dans les fiches de cours) en texte mathématique lisible,
// dans le style Unicode déjà utilisé partout dans Studio ADAM.
// ═══════════════════════════════════════════════════════════════

const SUPERSCRIPTS: Record<string, string> = {
  "0": "⁰", "1": "¹", "2": "²", "3": "³", "4": "⁴", "5": "⁵",
  "6": "⁶", "7": "⁷", "8": "⁸", "9": "⁹", "+": "⁺", "-": "⁻",
  "−": "⁻", "(": "⁽", ")": "⁾", "=": "⁼", "n": "ⁿ", "x": "ˣ",
  "i": "ⁱ", "t": "ᵗ", "m": "ᵐ",
};

const SUBSCRIPTS: Record<string, string> = {
  "0": "₀", "1": "₁", "2": "₂", "3": "₃", "4": "₄", "5": "₅",
  "6": "₆", "7": "₇", "8": "₈", "9": "₉", "+": "₊", "-": "₋",
  "−": "₋", "(": "₍", ")": "₎", "n": "ₙ", "i": "ᵢ", "x": "ₓ",
  "k": "ₖ", "t": "ₜ", "m": "ₘ",
};

function toSuperscript(s: string): string {
  const chars = [...s];
  if (chars.every((c) => SUPERSCRIPTS[c])) return chars.map((c) => SUPERSCRIPTS[c]).join("");
  return `^${s}`;
}

function toSubscript(s: string): string {
  const chars = [...s];
  if (chars.every((c) => SUBSCRIPTS[c])) return chars.map((c) => SUBSCRIPTS[c]).join("");
  return `_${s}`;
}

// Table de remplacement des commandes LaTeX (les plus longues d’abord).
const SYMBOLS: [string, string][] = [
  ["\\mathbb{R}", "ℝ"], ["\\mathbb{N}", "ℕ"], ["\\mathbb{Z}", "ℤ"],
  ["\\mathbb{Q}", "ℚ"], ["\\mathbb{C}", "ℂ"],
  ["\\Rightarrow", "⟹"], ["\\Leftrightarrow", "⟺"],
  ["\\longrightarrow", "→"], ["\\Longrightarrow", "⟹"],
  ["\\overrightarrow", ""], ["\\overline", ""], ["\\underline", ""],
  ["\\times", "×"], ["\\cdot", "·"], ["\\div", "÷"], ["\\pm", "±"],
  ["\\mp", "∓"], ["\\setminus", "∖"], ["\\cup", "∪"], ["\\cap", "∩"],
  ["\\subset", "⊂"], ["\\subseteq", "⊆"], ["\\in", "∈"], ["\\notin", "∉"],
  ["\\forall", "∀"], ["\\exists", "∃"], ["\\nexists", "∄"],
  ["\\emptyset", "∅"], ["\\infty", "∞"], ["\\implies", "⟹"],
  ["\\iff", "⟺"], ["\\to", "→"], ["\\rightarrow", "→"],
  ["\\leftarrow", "←"], ["\\leq", "≤"], ["\\leqslant", "≤"],
  ["\\geq", "≥"], ["\\geqslant", "≥"], ["\\neq", "≠"], ["\\ne", "≠"],
  ["\\approx", "≈"], ["\\equiv", "≡"], ["\\propto", "∝"],
  ["\\star", "∗"], ["\\circ", "∘"], ["\\prime", "′"], ["\\angle", "∠"],
  ["\\parallel", "∥"], ["\\perp", "⊥"],
  ["\\alpha", "α"], ["\\beta", "β"], ["\\gamma", "γ"], ["\\delta", "δ"],
  ["\\Delta", "Δ"], ["\\epsilon", "ε"], ["\\varepsilon", "ε"],
  ["\\theta", "θ"], ["\\lambda", "λ"], ["\\mu", "μ"], ["\\nu", "ν"],
  ["\\pi", "π"], ["\\rho", "ρ"], ["\\sigma", "σ"], ["\\Sigma", "Σ"],
  ["\\tau", "τ"], ["\\phi", "φ"], ["\\varphi", "φ"], ["\\omega", "ω"],
  ["\\Omega", "Ω"], ["\\infty", "∞"],
  ["\\sin", "sin"], ["\\cos", "cos"], ["\\tan", "tan"], ["\\cot", "cot"],
  ["\\sec", "sec"], ["\\csc", "csc"], ["\\arcsin", "arcsin"],
  ["\\arccos", "arccos"], ["\\arctan", "arctan"],
  ["\\ln", "ln"], ["\\log", "log"], ["\\exp", "exp"], ["\\lim", "lim"],
  ["\\det", "det"], ["\\max", "max"], ["\\min", "min"], ["\\sup", "sup"],
  ["\\inf", "inf"], ["\\mod", "mod"],
];

function convertLatex(s: string): string {
  let out = s;

  // \vec{AB} et \overrightarrow{AB} → AB⃗
  out = out.replace(/\\overrightarrow\{([^{}]*)\}/g, "$1⃗");
  out = out.replace(/\\vec\{([^{}]*)\}/g, "$1⃗");

  // Fractions et racines simples
  out = out.replace(/\\dfrac\{([^{}]*)\}\{([^{}]*)\}/g, "($1)/($2)");
  out = out.replace(/\\frac\{([^{}]*)\}\{([^{}]*)\}/g, "($1)/($2)");
  out = out.replace(/\\sqrt(\[[^{}]*\])?\{([^{}]*)\}/g, "√($2)");

  // Mise en forme de texte
  out = out.replace(/\\text\{([^{}]*)\}/g, "$1");
  out = out.replace(/\\mathrm\{([^{}]*)\}/g, "$1");
  out = out.replace(/\\mathbf\{([^{}]*)\}/g, "$1");
  out = out.replace(/\\operatorname\{([^{}]*)\}/g, "$1");

  // Délimiteurs silencieux
  out = out.replace(/\\left\b|\\right\b|\\bigl\b|\\bigr\b|\\Bigl\b|\\Bigr\b/g, "");

  // Exposants et indices (groupes puis caractère seul)
  out = out.replace(/\^\{([^{}]*)\}/g, (_m, a: string) => toSuperscript(a));
  out = out.replace(/\^([0-9A-Za-z+\-−])/g, (_m, a: string) => toSuperscript(a));
  out = out.replace(/_\{([^{}]*)\}/g, (_m, a: string) => toSubscript(a));
  out = out.replace(/_([0-9A-Za-z+\-−])/g, (_m, a: string) => toSubscript(a));

  // Symboles courants
  for (const [from, to] of SYMBOLS) {
    if (out.includes(from)) out = out.split(from).join(to);
  }

  // Espacements LaTeX et retours de ligne
  out = out.replace(/\\\\/g, " ");
  out = out.replace(/\\,/g, " ");
  out = out.replace(/\\;/g, "  ");
  out = out.replace(/\\quad/g, "  ");
  out = out.replace(/\\qquad/g, "    ");
  out = out.replace(/\\!/g, "");
  out = out.replace(/\\,/g, " ");

  // Nettoyage final : accolades résiduelles, accolades LaTeX \ { } , backslashes orphelins
  out = out.replace(/\\\{/g, "{").replace(/\\\}/g, "}");
  out = out.replace(/[{}\\]/g, "");
  out = out.replace(/[^\S\n]{2,}/g, " ").trim();
  return out;
}

/**
 * Convertit un texte contenant du LaTeX (avec ou sans délimiteurs $...$)
 * en texte mathématique Unicode lisible, prêt à l’affichage.
 */
export function latexToUnicode(input: string): string {
  if (!input) return input;
  let out = input;

  // Formules hors-ligne $$...$$ puis en-ligne $...$ et \(...\)
  out = out.replace(/\$\$([\s\S]*?)\$\$/g, (_m, inner: string) => convertLatex(inner));
  out = out.replace(/\$([^$\n]+)\$/g, (_m, inner: string) => convertLatex(inner));
  out = out.replace(/\\\(([\s\S]*?)\\\)/g, (_m, inner: string) => convertLatex(inner));

  // Reste du LaTeX sans délimiteur (dans les titres, listes, etc.)
  out = convertLatex(out);
  return out;
}
