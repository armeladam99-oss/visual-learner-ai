// ═══════════════════════════════════════════════════════════════
// 🧪 MOLECULE LIBRARY — Comprehensive chemical structures
// ═══════════════════════════════════════════════════════════════

export interface Atom3D {
  element: string;
  symbol: string;
  position: [number, number, number];
  radius: number;
  color: string;
  label?: string;
}

export interface Bond3D {
  from: number; // atom index
  to: number;   // atom index
  order: number; // 1, 2, 3
  type: "single" | "double" | "triple" | "aromatic";
}

export interface MoleculeData {
  name: string;
  formula: string;
  commonName?: string;
  category: string;
  atoms: Atom3D[];
  bonds: Bond3D[];
  description?: string;
}

// ═══════════════════════════════════════════════════════════════
// 🎨 ELEMENT COLORS (CPK convention)
// ═══════════════════════════════════════════════════════════════

export const ELEMENT_COLORS: Record<string, string> = {
  H: "#FFFFFF", He: "#D9FFFF", Li: "#CC80FF", Be: "#C2FF00", B: "#FFB5B5",
  C: "#909090", N: "#3050F8", O: "#FF0D0D", F: "#90E050", Ne: "#B3E3F5",
  Na: "#AB5CF2", Mg: "#8AFF00", Al: "#BFA6A6", Si: "#F0C8A0", P: "#FF8000",
  S: "#FFFF30", Cl: "#1FF01F", Ar: "#80D1E3", K: "#8F40D4", Ca: "#3DFF00",
  Ti: "#BFC2C7", Cr: "#8A99C7", Mn: "#9C7AC7", Fe: "#E06633", Co: "#F090A0",
  Ni: "#50D050", Cu: "#C88033", Zn: "#7D80B0", Br: "#A62929", I: "#940094",
};

export const ELEMENT_RADII: Record<string, number> = {
  H: 0.31, He: 0.28, C: 0.77, N: 0.75, O: 0.73, F: 0.72, S: 1.02,
  P: 1.06, Cl: 0.99, Br: 1.14, I: 1.33, Na: 1.54, K: 2.03, Ca: 1.76,
  Fe: 1.56, Mg: 1.30, Zn: 1.22, Cu: 1.32, B: 0.82, Si: 1.11,
};

// ═══════════════════════════════════════════════════════════════
// 📚 MOLECULE DATABASE
// ═══════════════════════════════════════════════════════════════

function el(symbol: string, pos: [number, number, number]): Atom3D {
  return {
    element: symbol,
    symbol,
    position: pos,
    radius: ELEMENT_RADII[symbol] || 0.7,
    color: ELEMENT_COLORS[symbol] || "#FF00FF",
  };
}

function bond(from: number, to: number, order: number = 1): Bond3D {
  return { from, to, order, type: order === 1 ? "single" : order === 2 ? "double" : "triple" };
}

export const MOLECULE_DATABASE: Record<string, MoleculeData> = {
  // ─── Simple inorganic ───
  H2: {
    name: "Dihydrogène", formula: "H₂", commonName: "Hydrogène gazeux",
    category: "Gaz simple",
    atoms: [el("H", [-0.37, 0, 0]), el("H", [0.37, 0, 0])],
    bonds: [bond(0, 1)],
  },
  O2: {
    name: "Dioxygène", formula: "O₂", commonName: "Oxygène",
    category: "Gaz simple",
    atoms: [el("O", [-0.6, 0, 0]), el("O", [0.6, 0, 0])],
    bonds: [bond(0, 1, 2)],
  },
  N2: {
    name: "Diazote", formula: "N₂", commonName: "Azote",
    category: "Gaz simple",
    atoms: [el("N", [-0.55, 0, 0]), el("N", [0.55, 0, 0])],
    bonds: [bond(0, 1, 3)],
  },
  Cl2: {
    name: "Dichlore", formula: "Cl₂", commonName: "Chlore",
    category: "Gaz simple",
    atoms: [el("Cl", [-1.0, 0, 0]), el("Cl", [1.0, 0, 0])],
    bonds: [bond(0, 1)],
  },
  HCl: {
    name: "Acide chlorhydrique", formula: "HCl", commonName: "Acide chlorhydrique",
    category: "Acide",
    atoms: [el("H", [-0.64, 0, 0]), el("Cl", [0.64, 0, 0])],
    bonds: [bond(0, 1)],
    description: "Gaz incolore, très soluble dans l'eau. Acide fort.",
  },

  // ─── Water & simple hydrides ───
  H2O: {
    name: "Eau", formula: "H₂O", commonName: "Eau",
    category: "Solvant",
    atoms: [
      el("O", [0, 0.12, 0]),
      el("H", [-0.76, -0.47, 0]),
      el("H", [0.76, -0.47, 0]),
    ],
    bonds: [bond(0, 1), bond(0, 2)],
    description: "Molécule polaire en forme de V. Angle HOH ≈ 104.5°. Solvant universel.",
  },
  H2O2: {
    name: "Peroxyde d'hydrogène", formula: "H₂O₂", commonName: "Eau oxygénée",
    category: "Oxydant",
    atoms: [
      el("O", [-0.7, 0, 0]), el("O", [0.7, 0, 0]),
      el("H", [-1.1, 0.7, 0.3]), el("H", [1.1, 0.7, -0.3]),
    ],
    bonds: [bond(0, 1), bond(0, 2), bond(1, 3)],
  },
  NH3: {
    name: "Ammoniac", formula: "NH₃", commonName: "Ammoniac",
    category: "Base",
    atoms: [
      el("N", [0, 0.12, 0]),
      el("H", [-0.47, -0.36, -0.82]),
      el("H", [-0.47, -0.36, 0.82]),
      el("H", [0.94, -0.36, 0]),
    ],
    bonds: [bond(0, 1), bond(0, 2), bond(0, 3)],
    description: "Gaz incolore à odeur forte. Base de Lewis. Géométrie trigonale pyramidal.",
  },
  PH3: {
    name: "Phosphine", formula: "PH₃", commonName: "Phosphine",
    category: "Hydrures",
    atoms: [
      el("P", [0, 0.12, 0]),
      el("H", [-0.5, -0.36, -0.87]),
      el("H", [-0.5, -0.36, 0.87]),
      el("H", [1.0, -0.36, 0]),
    ],
    bonds: [bond(0, 1), bond(0, 2), bond(0, 3)],
  },
  HF: {
    name: "Acide fluorhydrique", formula: "HF", commonName: "Acide fluorhydrique",
    category: "Acide",
    atoms: [el("H", [-0.46, 0, 0]), el("F", [0.46, 0, 0])],
    bonds: [bond(0, 1)],
  },
  HBr: {
    name: "Acide bromhydrique", formula: "HBr", commonName: "Acide bromhydrique",
    category: "Acide",
    atoms: [el("H", [-0.71, 0, 0]), el("Br", [0.71, 0, 0])],
    bonds: [bond(0, 1)],
  },
  HI: {
    name: "Acide iodhydrique", formula: "HI", commonName: "Acide iodhydrique",
    category: "Acide",
    atoms: [el("H", [-0.81, 0, 0]), el("I", [0.81, 0, 0])],
    bonds: [bond(0, 1)],
  },

  // ─── Carbon oxides ───
  CO2: {
    name: "Dioxyde de carbone", formula: "CO₂", commonName: "Gaz carbonique",
    category: "Oxyde",
    atoms: [
      el("C", [0, 0, 0]),
      el("O", [-1.16, 0, 0]),
      el("O", [1.16, 0, 0]),
    ],
    bonds: [bond(0, 1, 2), bond(0, 2, 2)],
    description: "Molécule linéaire. Gaz à effet de serre. Produit de la combustion.",
  },
  CO: {
    name: "Monoxyde de carbone", formula: "CO", commonName: "Monoxyde de carbone",
    category: "Oxyde",
    atoms: [el("C", [-0.56, 0, 0]), el("O", [0.56, 0, 0])],
    bonds: [bond(0, 1, 3)],
    description: "Gaz toxique inodore. Triple liaison. Produit de combustion incomplète.",
  },

  // ─── Simple hydrocarbures ───
  CH4: {
    name: "Méthane", formula: "CH₄", commonName: "Méthane",
    category: "Alcane",
    atoms: [
      el("C", [0, 0, 0]),
      el("H", [0.63, 0.63, 0.63]),
      el("H", [-0.63, -0.63, 0.63]),
      el("H", [-0.63, 0.63, -0.63]),
      el("H", [0.63, -0.63, -0.63]),
    ],
    bonds: [bond(0, 1), bond(0, 2), bond(0, 3), bond(0, 4)],
    description: "Alcane le plus simple. Géométrie tétraédrique. Gaz à effet de serre.",
  },
  C2H6: {
    name: "Éthane", formula: "C₂H₆", commonName: "Éthane",
    category: "Alcane",
    atoms: [
      el("C", [-0.77, 0, 0]), el("C", [0.77, 0, 0]),
      el("H", [-1.16, 0.88, 0.51]), el("H", [-1.16, -0.88, 0.51]),
      el("H", [-1.16, 0, -1.02]),
      el("H", [1.16, 0.88, -0.51]), el("H", [1.16, -0.88, -0.51]),
      el("H", [1.16, 0, 1.02]),
    ],
    bonds: [bond(0, 1), bond(0, 2), bond(0, 3), bond(0, 4), bond(1, 5), bond(1, 6), bond(1, 7)],
  },
  C2H4: {
    name: "Éthylène", formula: "C₂H₄", commonName: "Éthylène",
    category: "Alcène",
    atoms: [
      el("C", [-0.67, 0, 0]), el("C", [0.67, 0, 0]),
      el("H", [-1.24, 0.93, 0]), el("H", [-1.24, -0.93, 0]),
      el("H", [1.24, 0.93, 0]), el("H", [1.24, -0.93, 0]),
    ],
    bonds: [bond(0, 1, 2), bond(0, 2), bond(0, 3), bond(1, 4), bond(1, 5)],
    description: "Alcène le plus simple. Double liaison C=C. Géométrie plane.",
  },
  C2H2: {
    name: "Acétylène", formula: "C₂H₂", commonName: "Acétylène",
    category: "Alcyne",
    atoms: [
      el("C", [-0.60, 0, 0]), el("C", [0.60, 0, 0]),
      el("H", [-1.06, 0, 0]), el("H", [1.06, 0, 0]),
    ],
    bonds: [bond(0, 1, 3), bond(0, 2), bond(1, 3)],
    description: "Alcyne linéaire. Triple liaison. Utilisé pour le soudage.",
  },
  C3H8: {
    name: "Propane", formula: "C₃H₈", commonName: "Propane",
    category: "Alcane",
    atoms: [
      el("C", [-1.25, 0, 0]), el("C", [0, 0, 0]), el("C", [1.25, 0, 0]),
      el("H", [-1.68, 0.88, 0.51]), el("H", [-1.68, -0.88, 0.51]), el("H", [-1.68, 0, -1.02]),
      el("H", [0, 0.88, 0.88]), el("H", [0, -0.88, 0.88]),
      el("H", [1.68, 0.88, -0.51]), el("H", [1.68, -0.88, -0.51]), el("H", [1.68, 0, 1.02]),
    ],
    bonds: [bond(0, 1), bond(1, 2), bond(0, 3), bond(0, 4), bond(0, 5), bond(1, 6), bond(1, 7), bond(2, 8), bond(2, 9), bond(2, 10)],
  },

  // ─── Alcools & acides ───
  CH3OH: {
    name: "Méthanol", formula: "CH₃OH", commonName: "Alcool méthylique",
    category: "Alcool",
    atoms: [
      el("C", [0, 0, 0]),
      el("O", [1.43, 0, 0]),
      el("H", [1.85, 0.75, 0]),
      el("H", [-0.51, 0.93, 0.30]),
      el("H", [-0.51, -0.93, 0.30]),
      el("H", [-0.51, 0, -0.92]),
    ],
    bonds: [bond(0, 1), bond(1, 2), bond(0, 3), bond(0, 4), bond(0, 5)],
    description: "Alcool toxique. Utilisé comme solvant et carburant.",
  },
  C2H5OH: {
    name: "Éthanol", formula: "C₂H₅OH", commonName: "Alcool éthylique",
    category: "Alcool",
    atoms: [
      el("C", [-0.77, 0, 0]), el("C", [0.77, 0, 0]),
      el("O", [1.50, 1.06, 0]),
      el("H", [2.20, 1.06, 0]),
      el("H", [-1.16, 0.88, 0.51]), el("H", [-1.16, -0.88, 0.51]),
      el("H", [-1.16, 0, -1.02]),
      el("H", [1.16, -0.88, 0.51]), el("H", [1.16, -0.30, -0.88]),
    ],
    bonds: [bond(0, 1), bond(1, 2), bond(2, 3), bond(0, 4), bond(0, 5), bond(0, 6), bond(1, 7), bond(1, 8)],
    description: "Alcool présent dans les boissons alcoolisées. Solvant courant.",
  },
  CH3COOH: {
    name: "Acide acétique", formula: "CH₃COOH", commonName: "Vinaigre",
    category: "Acide carboxylique",
    atoms: [
      el("C", [-1.27, 0, 0]),
      el("C", [0, 0, 0]),
      el("O", [0.64, 1.09, 0]),
      el("O", [0.64, -1.09, 0]),
      el("H", [1.35, -1.09, 0]),
      el("H", [-1.72, 0.88, 0.51]), el("H", [-1.72, -0.88, 0.51]),
      el("H", [-1.72, 0, -1.02]),
    ],
    bonds: [bond(0, 1), bond(1, 2, 2), bond(1, 3), bond(3, 4), bond(0, 5), bond(0, 6), bond(0, 7)],
    description: "Acide faible. Composant principal du vinaigre.",
  },
  HCOOH: {
    name: "Acide formique", formula: "HCOOH", commonName: "Acide formique",
    category: "Acide carboxylique",
    atoms: [
      el("C", [0, 0, 0]),
      el("O", [0.64, 1.09, 0]),
      el("O", [0.64, -1.09, 0]),
      el("H", [-1.09, 0, 0]),
      el("H", [1.35, -1.09, 0]),
    ],
    bonds: [bond(0, 1, 2), bond(0, 2), bond(0, 3), bond(2, 4)],
  },

  // ─── Aromatics ───
  C6H6: {
    name: "Benzène", formula: "C₆H₆", commonName: "Benzène",
    category: "Aromatique",
    atoms: (() => {
      const atoms: Atom3D[] = [];
      for (let i = 0; i < 6; i++) {
        const angle = (i * Math.PI * 2) / 6;
        atoms.push(el("C", [Math.cos(angle) * 1.4, Math.sin(angle) * 1.4, 0]));
      }
      for (let i = 0; i < 6; i++) {
        const angle = (i * Math.PI * 2) / 6;
        atoms.push(el("H", [Math.cos(angle) * 2.5, Math.sin(angle) * 2.5, 0]));
      }
      return atoms;
    })(),
    bonds: [0, 1, 2, 3, 4, 5].map((i) => bond(i, (i + 1) % 6, 2).type === "double" ? { from: i, to: (i + 1) % 6, order: 2, type: "aromatic" as const } : bond(i, (i + 1) % 6, 2))
      .concat([0, 1, 2, 3, 4, 5].map((i) => bond(i, i + 6))),
    description: "Cycle aromatique. Molécule plane. Liaison delocalisée.",
  },

  // ─── Common acids ───
  H2SO4: {
    name: "Acide sulfurique", formula: "H₂SO₄", commonName: "Acide sulfurique",
    category: "Acide fort",
    atoms: [
      el("S", [0, 0, 0]),
      el("O", [1.2, 0.8, 0]), el("O", [-1.2, 0.8, 0]),
      el("O", [0.8, -0.8, 0.8]), el("O", [-0.8, -0.8, 0.8]),
      el("H", [1.4, -1.2, 0.8]), el("H", [-1.4, -1.2, 0.8]),
    ],
    bonds: [bond(0, 1, 2), bond(0, 2, 2), bond(0, 3), bond(0, 4), bond(3, 5), bond(4, 6)],
    description: "Acide fort très concentré. Utilisé dans l'industrie.",
  },
  HNO3: {
    name: "Acide nitrique", formula: "HNO₃", commonName: "Acide nitrique",
    category: "Acide fort",
    atoms: [
      el("N", [0, 0, 0]),
      el("O", [0, 1.2, 0]), el("O", [-1.1, -0.6, 0]), el("O", [1.1, -0.6, 0]),
      el("H", [1.7, -1.1, 0]),
    ],
    bonds: [bond(0, 1, 2), bond(0, 2), bond(0, 3), bond(3, 4)],
    description: "Acide fort. Utilisé dans les explosifs et engrais.",
  },
  H3PO4: {
    name: "Acide phosphorique", formula: "H₃PO₄", commonName: "Acide phosphorique",
    category: "Acide",
    atoms: [
      el("P", [0, 0, 0]),
      el("O", [0, 1.3, 0]),
      el("O", [1.2, -0.65, 0]), el("O", [-1.2, -0.65, 0]),
      el("O", [0, -0.65, 1.2]),
      el("H", [1.7, -1.0, 0]), el("H", [-1.7, -1.0, 0]), el("H", [0, -1.0, 1.7]),
    ],
    bonds: [bond(0, 1, 2), bond(0, 2), bond(0, 3), bond(0, 4), bond(2, 5), bond(3, 6), bond(4, 7)],
  },
  H2CO3: {
    name: "Acide carbonique", formula: "H₂CO₃", commonName: "Acide carbonique",
    category: "Acide faible",
    atoms: [
      el("C", [0, 0, 0]),
      el("O", [0, 1.2, 0]), el("O", [-1.1, -0.6, 0]), el("O", [1.1, -0.6, 0]),
      el("H", [-1.6, -1.0, 0]), el("H", [1.6, -1.0, 0]),
    ],
    bonds: [bond(0, 1, 2), bond(0, 2), bond(0, 3), bond(2, 4), bond(3, 5)],
  },

  // ─── Sulfur compounds ───
  SO2: {
    name: "Dioxyde de soufre", formula: "SO₂", commonName: "Anhydride sulfureux",
    category: "Oxyde",
    atoms: [
      el("S", [0, 0, 0]),
      el("O", [-1.3, 0.8, 0]),
      el("O", [1.3, 0.8, 0]),
    ],
    bonds: [bond(0, 1, 2), bond(0, 2, 2)],
    description: "Gaz à odeur âcre. Polluant atmosphérique.",
  },
  SO3: {
    name: "Trixyde de soufre", formula: "SO₃", commonName: "Anhydride sulfurique",
    category: "Oxyde",
    atoms: [
      el("S", [0, 0, 0]),
      el("O", [0, 1.43, 0]),
      el("O", [-1.24, -0.71, 0]),
      el("O", [1.24, -0.71, 0]),
    ],
    bonds: [bond(0, 1, 2), bond(0, 2, 2), bond(0, 3, 2)],
    description: "Molécule plane trigonale. Precurseur de l'acide sulfurique.",
  },
  H2S: {
    name: "Sulfure d'hydrogène", formula: "H₂S", commonName: "Hydrogène sulfuré",
    category: "Hydrures",
    atoms: [
      el("S", [0, 0.12, 0]),
      el("H", [-0.76, -0.47, 0]),
      el("H", [0.76, -0.47, 0]),
    ],
    bonds: [bond(0, 1), bond(0, 2)],
    description: "Gaz toxique à odeur d'œufs pourris.",
  },

  // ─── Nitrogen compounds ───
  NO: {
    name: "Monoxyde d'azote", formula: "NO", commonName: "Monoxyde d'azote",
    category: "Oxyde",
    atoms: [el("N", [-0.62, 0, 0]), el("O", [0.62, 0, 0])],
    bonds: [bond(0, 1, 2)],
    description: "Gaz incolore. Radical libre. Messager biologique.",
  },
  NO2: {
    name: "Dioxyde d'azote", formula: "NO₂", commonName: "Dioxyde d'azote",
    category: "Oxyde",
    atoms: [
      el("N", [0, 0.2, 0]),
      el("O", [-1.1, -0.5, 0]),
      el("O", [1.1, -0.5, 0]),
    ],
    bonds: [bond(0, 1, 2), bond(0, 2, 2)],
    description: "Gaz brun-rouge. Polluant. Composant du smog.",
  },
  N2O: {
    name: "Protoxyde d'azote", formula: "N₂O", commonName: "Gaz hilarant",
    category: "Oxyde",
    atoms: [el("N", [-0.56, 0, 0]), el("N", [0.56, 0, 0]), el("O", [1.56, 0, 0])],
    bonds: [bond(0, 1, 3), bond(1, 2)],
    description: "Gaz anesthésique. Gaz à effet de serre.",
  },
  NO3: {
    name: "Nitrate", formula: "NO₃⁻", commonName: "Ion nitrate",
    category: "Ion",
    atoms: [
      el("N", [0, 0, 0]),
      el("O", [0, 1.2, 0]),
      el("O", [-1.04, -0.6, 0]),
      el("O", [1.04, -0.6, 0]),
    ],
    bonds: [bond(0, 1), bond(0, 2), bond(0, 3)],
    description: "Ion polyatomique. Composant des engrais.",
  },
  NH4: {
    name: "Ammonium", formula: "NH₄⁺", commonName: "Ion ammonium",
    category: "Ion",
    atoms: [
      el("N", [0, 0, 0]),
      el("H", [0.63, 0.63, 0.63]),
      el("H", [-0.63, -0.63, 0.63]),
      el("H", [-0.63, 0.63, -0.63]),
      el("H", [0.63, -0.63, -0.63]),
    ],
    bonds: [bond(0, 1), bond(0, 2), bond(0, 3), bond(0, 4)],
    description: "Ion tétraédrique. Formé par protonation de NH₃.",
  },

  // ─── Ions ───
  OH: {
    name: "Hydroxyde", formula: "OH⁻", commonName: "Ion hydroxyde",
    category: "Ion",
    atoms: [el("O", [-0.47, 0, 0]), el("H", [0.47, 0, 0])],
    bonds: [bond(0, 1)],
    description: "Ion basique. Présent dans les solutions basiques.",
  },

  // ─── Salt ───
  NaCl: {
    name: "Chlorure de sodium", formula: "NaCl", commonName: "Sel de cuisine",
    category: "Sel",
    atoms: [el("Na", [-1.18, 0, 0]), el("Cl", [1.18, 0, 0])],
    bonds: [],
    description: "Sel ionique. Cristal cubique. Brique de la vie.",
  },
  CaCO3: {
    name: "Carbonate de calcium", formula: "CaCO₃", commonName: "Calcaire / Craie",
    category: "Sel",
    atoms: [
      el("Ca", [-2.0, 0, 0]),
      el("C", [0, 0, 0]),
      el("O", [0, 1.2, 0]),
      el("O", [-1.04, -0.6, 0]),
      el("O", [1.04, -0.6, 0]),
    ],
    bonds: [bond(1, 2, 2), bond(1, 3), bond(1, 4)],
    description: "Sel ionique. Composant du calcaire et du marbre.",
  },
  NaOH: {
    name: "Hydroxyde de sodium", formula: "NaOH", commonName: "Soude caustique",
    category: "Base forte",
    atoms: [el("Na", [-2.0, 0, 0]), el("O", [0, 0, 0]), el("H", [0.87, 0, 0])],
    bonds: [bond(1, 2)],
    description: "Base forte. Corrosive. Utilisée dans l'industrie.",
  },
  KOH: {
    name: "Hydroxyde de potassium", formula: "KOH", commonName: "Potasse caustique",
    category: "Base forte",
    atoms: [el("K", [-2.2, 0, 0]), el("O", [0, 0, 0]), el("H", [0.87, 0, 0])],
    bonds: [bond(1, 2)],
  },
  CaO: {
    name: "Oxyde de calcium", formula: "CaO", commonName: "Chaux vive",
    category: "Oxyde basique",
    atoms: [el("Ca", [-1.0, 0, 0]), el("O", [1.0, 0, 0])],
    bonds: [],
    description: "Oxyde basique. Chaux vive. Réagit violemment avec l'eau.",
  },
  MgO: {
    name: "Oxyde de magnésium", formula: "MgO", commonName: "Magnésie",
    category: "Oxyde",
    atoms: [el("Mg", [-1.0, 0, 0]), el("O", [1.0, 0, 0])],
    bonds: [],
    description: "Réfractaire. Utilisé dans la construction.",
  },
  NaHCO3: {
    name: "Bicarbonate de sodium", formula: "NaHCO₃", commonName: "Bicarbonate",
    category: "Sel",
    atoms: [
      el("Na", [-2.5, 0, 0]),
      el("C", [0, 0, 0]),
      el("O", [0, 1.2, 0]),
      el("O", [-1.04, -0.6, 0]),
      el("O", [1.04, -0.6, 0]),
      el("H", [1.5, -1.0, 0]),
    ],
    bonds: [bond(1, 2, 2), bond(1, 3), bond(1, 4), bond(4, 5)],
    description: "Poudre blanche. Utilisée en cuisine et en médecine.",
  },
  Na2CO3: {
    name: "Carbonate de sodium", formula: "Na₂CO₃", commonName: "Soude",
    category: "Sel",
    atoms: [
      el("Na", [-3.0, 0, 0]), el("Na", [3.0, 0, 0]),
      el("C", [0, 0, 0]),
      el("O", [0, 1.2, 0]),
      el("O", [-1.04, -0.6, 0]),
      el("O", [1.04, -0.6, 0]),
    ],
    bonds: [bond(2, 3, 2), bond(2, 4), bond(2, 5)],
  },

  // ─── Glucose ───
  C6H12O6: {
    name: "Glucose", formula: "C₆H₁₂O₆", commonName: "Sucre / Dextrose",
    category: "Glucide",
    atoms: (() => {
      const atoms: Atom3D[] = [];
      // Simplified ring representation
      const ring = [
        [0, 1.4, 0], [1.21, 0.7, 0], [1.21, -0.7, 0],
        [0, -1.4, 0], [-1.21, -0.7, 0], [-1.21, 0.7, 0],
      ];
      for (let i = 0; i < 6; i++) atoms.push(el("C", ring[i] as [number, number, number]));
      atoms.push(el("O", [0, 0, 1.0])); // ring oxygen
      // Add H and OH groups simplified
      atoms.push(el("H", [0, 2.2, 0]));
      atoms.push(el("H", [1.9, 1.1, 0]));
      atoms.push(el("H", [1.9, -1.1, 0]));
      atoms.push(el("H", [0, -2.2, 0]));
      atoms.push(el("H", [-1.9, -1.1, 0]));
      atoms.push(el("H", [-1.9, 1.1, 0]));
      return atoms;
    })(),
    bonds: [0, 1, 2, 3, 4, 5].map((i) => bond(i, (i + 1) % 6)).concat([
      bond(5, 6), bond(0, 7), bond(1, 8), bond(2, 9), bond(3, 10), bond(4, 11), bond(5, 12),
    ]),
    description: "Sucre simple. Source d'énergie principale des cellules.",
  },

  // ─── Methanol ───
  CH3CHO: {
    name: "Acétaldéhyde", formula: "CH₃CHO", commonName: "Acétaldéhyde",
    category: "Aldehyde",
    atoms: [
      el("C", [-0.77, 0, 0]), el("C", [0.77, 0, 0]),
      el("O", [1.50, 0.89, 0]),
      el("H", [1.30, -0.60, 0]),
      el("H", [-1.20, 0.88, 0.51]), el("H", [-1.20, -0.88, 0.51]),
      el("H", [-1.20, 0, -1.02]),
    ],
    bonds: [bond(0, 1), bond(1, 2, 2), bond(1, 3), bond(0, 4), bond(0, 5), bond(0, 6)],
  },

  // ─── Additional common ───
  O3: {
    name: "Ozone", formula: "O₃", commonName: "Ozone",
    category: "Allotrope",
    atoms: [
      el("O", [0, 0, 0]),
      el("O", [-1.2, 0.5, 0]),
      el("O", [1.2, 0.5, 0]),
    ],
    bonds: [bond(0, 1, 2), bond(0, 2)],
    description: "Allotrope de l'oxygène. Protection contre les UV.",
  },
  C2H3Cl: {
    name: "Chloroéthylène", formula: "C₂H₃Cl", commonName: "Vinylchlorure",
    category: "Alcène halogéné",
    atoms: [
      el("C", [-0.67, 0, 0]), el("C", [0.67, 0, 0]),
      el("Cl", [1.45, 0.8, 0]),
      el("H", [-1.24, 0.93, 0]), el("H", [-1.24, -0.93, 0]),
      el("H", [0.67, -0.93, 0]),
    ],
    bonds: [bond(0, 1, 2), bond(1, 2), bond(0, 3), bond(0, 4), bond(1, 5)],
  },
};

// ═══════════════════════════════════════════════════════════════
// 🔍 SEARCH FUNCTIONS
// ═══════════════════════════════════════════════════════════════

export function searchMolecules(query: string): MoleculeData[] {
  const q = query.toLowerCase().trim();
  return Object.values(MOLECULE_DATABASE).filter((mol) =>
    mol.name.toLowerCase().includes(q) ||
    mol.formula.toLowerCase().includes(q) ||
    mol.commonName?.toLowerCase().includes(q) ||
    mol.category.toLowerCase().includes(q)
  );
}

export function getMolecule(key: string): MoleculeData | undefined {
  // Try exact key first
  if (MOLECULE_DATABASE[key]) return MOLECULE_DATABASE[key];
  // Try case-insensitive
  const lower = key.toLowerCase();
  for (const [k, v] of Object.entries(MOLECULE_DATABASE)) {
    if (k.toLowerCase() === lower || v.name.toLowerCase() === lower ||
        v.formula.toLowerCase() === lower || v.commonName?.toLowerCase() === lower) {
      return v;
    }
  }
  return undefined;
}

export function getMoleculeCategories(): string[] {
  const cats = new Set(Object.values(MOLECULE_DATABASE).map((m) => m.category));
  return [...cats].sort();
}

export function getMoleculesByCategory(category: string): MoleculeData[] {
  return Object.values(MOLECULE_DATABASE).filter((m) => m.category === category);
}
