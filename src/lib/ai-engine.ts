// ═══════════════════════════════════════════════════════════════
// 🧠 MOTEUR IA PÉDAGOGIQUE — ProfVisuel
// Architecture modulaire, extensible pour vrai LLM plus tard
// ═══════════════════════════════════════════════════════════════

export type AIMode = "education" | "general" | "lab" | "image" | "exercise";

export interface AIContext {
  conversationHistory: Message[];
  currentSubject: string | null;
  currentExperiment: string | null;
  simulationParams: Record<string, number> | null;
  currentExercise: ExerciseData | null;
  hintStep: number;
  learningMode: "explain" | "help";
  studentLevel: "2bac";
  photos: PhotoAttachment[];
  currentMode: AIMode;
}

export interface Message {
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
  experiment?: string;
  hints?: string[];
  solution?: string;
}

export interface PhotoAttachment {
  id: string;
  name: string;
  description: string;
  analysis?: string;
}

export interface ExerciseData {
  subject: string;
  topic: string;
  question: string;
  steps: SolutionStep[];
  finalAnswer: string;
}

export interface SolutionStep {
  number: number;
  label: string;
  content: string;
  formula?: string;
}

export interface ExperimentSuggestion {
  name: string;
  description: string;
  query: string;
}

// ═══════════════════════════════════════════════════════════════
// 📚 BASE DE CONNAISSANCES
// ═══════════════════════════════════════════════════════════════

const knowledgeBase: Record<string, {
  keywords: string[];
  response: string;
  experiment?: string;
  suggestions?: string[];
}> = {
  // ─── MATHÉMATIQUES ───
  limites: {
    keywords: ["limite", "limites", "continuité", "continuité", "tend vers"],
    response: `**Les limites** décrivent le comportement d'une fonction quand x tend vers une valeur.

**Définition intuitive :**
La limite de f(x) quand x → a est ℓ si f(x) se rapproche de ℓ quand x se rapproche de a.

**Notation :** lim(x→a) f(x) = ℓ

**Exemple :**
lim(x→0) sin(x)/x = 1
→ Même si f(0) n'est pas définie, la fonction tend vers 1.

**Limites usuelles à connaître :**
• lim(x→0) sin(x)/x = 1
• lim(x→+∞) e^x = +∞
• lim(x→+∞) 1/x = 0
• lim(x→0) ln(x) = −∞

**Règles :**
• lim(f + g) = lim f + lim g
• lim(f × g) = lim f × lim g
• lim(f/g) = lim f / lim g (si le dénominateur ≠ 0)

**Indéterminations courantes :**
0/0, ∞/∞, 0×∞, ∞−∞, 1^∞, 0^0, ∞^0`,
    experiment: "fonction",
    suggestions: ["Montre-moi une fonction logarithme", "Explique-moi la continuité", "Résous un exercice de limites"],
  },
  derivation: {
    keywords: ["dérivée", "derivée", "dérivation", "pente", "tangente", "variation", "extremum"],
    response: `**La dérivée** d'une fonction en un point est la pente de la tangente à la courbe en ce point.

**Définition :**
f'(x₀) = lim(h→0) [f(x₀+h) − f(x₀)] / h

**Interprétation géométrique :**
• f'(x) > 0 → f est croissante en x
• f'(x) < 0 → f est décroissante en x
• f'(x) = 0 → extremum potentiel

**Formules de dérivation essentielles :**
• (xⁿ)' = n·xⁿ⁻¹
• (eˣ)' = eˣ
• (ln x)' = 1/x
• (sin x)' = cos x
• (cos x)' = −sin x
• (u×v)' = u'×v + u×v'
• (u∘v)' = v' × u'∘v

**Étude de variations :**
1. Calculer f'(x)
2. Résoudre f'(x) = 0
3. Construire le tableau de variations
4. Identifier extremums et points d'inflexion`,
    experiment: "fonction",
    suggestions: ["Montre-moi une parabole avec sa dérivée", "Explique-moi les extrema", "Résous un exercice de dérivation"],
  },
  suite: {
    keywords: ["suite", "suites", "suites numériques", "convergence", "fibonacci"],
    response: `**Une suite numérique** est une application de ℕ dans ℝ.

**Deux modes de génération :**
• Explicite : uₙ = f(n)
• Récurrence : uₙ₊₁ = f(uₙ)

**Suites usuelles :**
• Arithmétique : uₙ = u₀ + n×r
• Géométrique : uₙ = u₀×qⁿ
• Harmonique : uₙ = 1/(n+1)

**Convergence :**
• Suite arithmétique : convergente ⟺ r = 0
• Suite géométrique : convergente ⟺ |q| < 1

**Théorème des gendarmes :**
Si aₙ ≤ uₙ ≤ bₙ et lim aₙ = lim bₙ = ℓ, alors lim uₙ = ℓ.

**Borne supérieure :**
Une suite croissante et majorée est convergente.`,
    experiment: undefined,
    suggestions: ["Montre-moi une suite arithmétique", "Montre-moi une suite géométrique", "Explique-moi Fibonacci"],
  },
  // ─── PHYSIQUE ───
  circuit_rc: {
    keywords: ["circuit rc", "condensateur", "charge", "décharge", "constante de temps", "résistance", "capacité"],
    response: `**Circuit RC** = Résistance + Condensateur en série.

**Constante de temps :** τ = R × C

**Charge du condensateur :**
• Uc(t) = U₀ × (1 − e^(−t/τ))
• i(t) = (U₀/R) × e^(−t/τ)

**Décharge :**
• Uc(t) = U₀ × e^(−t/τ)
• i(t) = −(U₀/R) × e^(−t/τ)

**Points clés :**
• À t = τ : le condensateur est chargé à 63%
• À t = 3τ : chargé à 95%
• À t = 5τ : chargé à 99%

**Énergie stockée :**
W = ½ × C × U²`,
    experiment: "circuit",
    suggestions: ["Lance la simulation circuit RC", "Pourquoi la charge est exponentielle ?", "Que se passe-t-il si on double R ?"],
  },
  projectile: {
    keywords: ["projectile", "mouvement", "parabolique", "chute libre", "trajectoire"],
    response: `**Mouvement parabolique** = projection dans un champ gravitationnel.

**Décomposition :**
• Horizontal : x(t) = v₀·cos(θ)·t (mouvement uniforme)
• Vertical : y(t) = v₀·sin(θ)·t − ½gt² (MUV)

**Portée :** R = v₀²·sin(2θ)/g
**Hauteur max :** H = v₀²·sin²(θ)/(2g)
**Temps de vol :** T = 2·v₀·sin(θ)/g

**Angle optimal :** θ = 45° pour maximiser la portée.

**Énergie :**
• Au départ : Eₖ = ½mv₀²
• En l'air : E = Eₖ + Eₚ = constante`,
    experiment: "projectile",
    suggestions: ["Lance la simulation projectile", "Pourquoi 45° est l'angle optimal ?", "Montre-moi le diagramme de forces"],
  },
  ondes: {
    keywords: ["onde", "ondes", "fréquence", "longueur d'onde", "propagation"],
    response: `**Une onde** transporte de l'énergie sans transport de matière.

**Grandeurs :**
• λ (lambda) : longueur d'onde (m)
• f : fréquence (Hz)
• T : période (s) = 1/f
• v : vitesse de propagation (m/s)

**Relation fondamentale :** v = λ × f

**Onde progressive :**
y(x,t) = A × sin(2π(x/λ − t/T))

**Types d'ondes :**
• Mécaniques : son, vagues, sismiques
• Électromagnétiques : lumière, radio, micro-ondes

**Phénomènes :**
• Réflexion : rebond sur un obstacle
• Réfraction : changement de milieu
• Diffraction : déviation autour d'un obstacle
• Interférence : superposition de deux ondes`,
    experiment: "onde",
    suggestions: ["Lance la simulation onde", "Explique-moi la diffraction", "Quelle est la différence entre son et lumière ?"],
  },
  // ─── CHIMIE ───
  dosage: {
    keywords: ["dosage", "ph", "acide", "base", "acido-basique", "titrage", "équivalence"],
    response: `**Dosage acido-basique** : déterminer la concentration d'une solution inconnue.

**Principe :** On verse une solution titrante (concentration connue) dans la solution à doser.

**pH :** pH = −log[H₃O⁺]
• pH < 7 : acide
• pH = 7 : neutre
• pH > 7 : basique

**Point d'équivalence :** n_acide = n_base
• Acide fort + Base forte : pH = 7
• Acide faible + Base forte : pH > 7
• Acide fort + Base faible : pH < 7

**Formule :** C₁V₁ = C₂V₂

**Courbe de titrage :**
→ Zone plate (avant) → Montée brusque (équivalence) → Zone plate (après)`,
    experiment: "dosage",
    suggestions: ["Lance la simulation dosage", "Explique-moi le point d'équivalence", "Acide fort vs acide faible ?"],
  },
  moleculaire: {
    keywords: ["molécule", "molécules", "liaison", "structure", "atome", "composé"],
    response: `**Liaisons chimiques** = forces qui maintiennent les atomes ensemble.

**3 types principaux :**
• Ionique : transfert d'électrons (NaCl)
• Covalente : partage d'électrons (H₂O, CO₂)
• Métallique : bain d'électrons (Fe, Cu)

**Géométrie des molécules :**
• Linéaire : CO₂ (180°)
• Coudée : H₂O (104,5°)
• Tétrédrique : CH₄ (109,5°)
• Trigone plane : BF₃ (120°)
• Pyramidale : NH₃ (107,8°)

**Règle de l'octet :**
Chaque atome tend à avoir 8 électrons sur sa couche externe (2 pour H).`,
    experiment: undefined,
    suggestions: ["Montre-moi la molécule d'eau en 3D", "Quelle est la différence entre ionique et covalente ?", "Explique-moi la règle de l'octet"],
  },
};

// ═══════════════════════════════════════════════════════════════
// 🔍 DÉTECTION DE LANGUE
// ═══════════════════════════════════════════════════════════════

function detectLanguage(text: string): "fr" | "ar" | "darija" | "en" {
  const lower = text.toLowerCase();
  if (/[\u0600-\u06FF]/.test(text)) return "ar";
  const darijaWords = ["kif", "shno", "chno", "bghit", "bgha", "3lach", "kayn", "mashi", "daba", "safi", "wakil", "l3robi"];
  if (darijaWords.some((w) => lower.includes(w))) return "darija";
  if (/^(what|how|why|when|where|show|explain|help)/.test(lower)) return "en";
  return "fr";
}

// ═══════════════════════════════════════════════════════════════
// 🧪 SUGGESTIONS D'EXPÉRIENCES PAR THÈME
// ═══════════════════════════════════════════════════════════════

function getExperimentSuggestions(subject: string): ExperimentSuggestion[] {
  const suggestions: Record<string, ExperimentSuggestion[]> = {
    math: [
      { name: "Explorateur de fonctions", description: "Visualise et modifie des courbes", query: "Montre-moi l'explorateur de fonctions" },
      { name: "Parabole interactive", description: "Modifie a, b, c et observe", query: "Montre-moi une parabole" },
      { name: "Suite numérique", description: "Visualise la convergence", query: "Montre-moi une suite" },
    ],
    physics: [
      { name: "Circuit RC", description: "Charge et décharge", query: "Montre-moi un circuit RC" },
      { name: "Projectile", description: "Simulation de trajectoire", query: "Lance un projectile" },
      { name: "Onde progressive", description: "Visualise la propagation", query: "Montre-moi une onde" },
      { name: "Oscillations", description: "Ressort-masse", query: "Montre-moi des oscillations" },
    ],
    chemistry: [
      { name: "Dosage acido-basique", description: "Titration interactive", query: "Montre-moi un dosage" },
      { name: "Structure moléculaire", description: "Vues 3D des molécules", query: "Montre-moi des molécules" },
    ],
  };
  return suggestions[subject] || suggestions.math;
}

// ═══════════════════════════════════════════════════════════════
// 🧩 DÉTECTION D'EXPÉRIENCE
// ═══════════════════════════════════════════════════════════════

function detectExperiment(query: string): string | undefined {
  const q = query.toLowerCase();
  if (q.includes("circuit") || q.includes("rc") || q.includes("condensateur") || q.includes("charge")) return "circuit";
  if (q.includes("dosage") || q.includes("ph") || q.includes("acide") || q.includes("base") || q.includes("titrage")) return "dosage";
  if (q.includes("fonction") || q.includes("graphique") || q.includes("courbe") || q.includes("parabole") || q.includes("quadratique") || q.includes("sinus") || q.includes("exponentielle") || q.includes("logarithme")) return "fonction";
  if (q.includes("onde") || q.includes("propagation") || q.includes("fréquence")) return "onde";
  if (q.includes("pendule") || q.includes("oscillation") || q.includes("ressort")) return "oscillation";
  if (q.includes("molécule") || q.includes("molecule") || q.includes("structure")) return "molecule";
  return undefined;
}

// ═══════════════════════════════════════════════════════════════
// 🔧 MOTEUR PRINCIPAL
// ═══════════════════════════════════════════════════════════════

export function processMessage(
  userMessage: string,
  ctx: AIContext
): { response: string; experiment: string | undefined; hints: string[]; suggestions: string[] } {
  const query = userMessage.trim();
  const lower = query.toLowerCase();
  const lang = detectLanguage(query);

  // ─── MODE AIDE-MOI : indices progressifs ───
  if (ctx.currentExercise && ctx.learningMode === "help") {
    const step = ctx.hintStep;
    const exercise = ctx.currentExercise;

    if (lower.includes("indice") || lower.includes("hint") || lower.includes("aide")) {
      const hints = [
        `💡 Indice 1 : Regarde les données de l'exercice. Qu'est-ce qui te est donné ?`,
        `💡 Indice 2 : Quelle formule pourrait s'appliquer ici ?`,
        `💡 Indice 3 : Essaie de remplacer les valeurs dans la formule.`,
        `✅ Voici la solution complète :\n\n${exercise.steps.map((s) => `**Étape ${s.number} — ${s.label} :** ${s.content}`).join("\n\n")}\n\n**Résultat :** ${exercise.finalAnswer}`,
      ];

      if (step < hints.length) {
        ctx.hintStep++;
        return {
          response: hints[step],
          experiment: undefined,
          hints: hints.slice(step + 1).map((_, i) => i === 0 ? "➡️ Étape suivante" : "✅ Voir la solution"),
          suggestions: ["Je comprends maintenant", "Donne-moi un autre indice", "Voir la solution complète"],
        };
      }
    }

    if (lower.includes("comprends") || lower.includes("suivant")) {
      ctx.hintStep++;
      if (ctx.hintStep < 4) {
        const hints = [
          `💡 Indice 1 : Regarde les données de l'exercice.`,
          `💡 Indice 2 : Quelle formule pourrait s'appliquer ?`,
          `💡 Indice 3 : Essaie de remplacer les valeurs.`,
          `✅ Solution complète`,
        ];
        return {
          response: hints[Math.min(ctx.hintStep, 3)],
          experiment: undefined,
          hints: [],
          suggestions: ["Donne-moi un autre indice", "Je veux la solution"],
        };
      }
    }
  }

  // ─── DÉTECTION D'EXPÉRIENCE ───
  const experiment = detectExperiment(query);

  // ─── RECHERCHE DANS LA BASE DE CONNAISSANCES ───
  let bestMatch: string | null = null;
  let bestScore = 0;

  for (const [key, entry] of Object.entries(knowledgeBase)) {
    let score = 0;
    for (const keyword of entry.keywords) {
      if (lower.includes(keyword)) {
        score += keyword.length;
      }
    }
    if (score > bestScore) {
      bestScore = score;
      bestMatch = key;
    }
  }

  // ─── MODE GÉNÉRAL : DISCUSSION LIBRE ───
  const generalTopics = [
    { keywords: ["salut", "bonjour", "bonsoir", "coucou", "hey", "hello", "ça va", "ca va", "comment ça va", "comment vas-tu", "ça roule"], response: `Salut ! 😊 Comment ça va ?\n\nJe suis ton assistant scientifique, mais je suis aussi là pour discuter de tout ce que tu veux. Tu veux qu'on parle de quelque chose en particulier ?` },
    { keywords: ["minecraft", "jeux", "jeu", "gaming", "playstation", "xbox", "nintendo", "fortnite", "valorant", "lol", "league of legends", "fifa", "rocket league"], response: `Minecraft ! 🎮 Un classique !\n\nLe jeu de construction et de survie par Mojang (racheté par Microsoft en 2014). Tu peux construire des maisons, explorer des cavernes, affronter des monstres...\n\nEt savais-tu que Minecraft utilise des algorithmes de **génération procédurale** pour créer les mondes ? C'est un peu comme des maths appliquées au divertissement ! 🧮\n\nTu veux qu'on parle d'autre chose, ou tu as une question de cours ?` },
    { keywords: ["musique", "chanson", "concert", "spotify", "rap", "pop", "rock", "drill", "afro", "melanie", "booba", "damso", "navy", "gazo"], response: `La musique, c'est super ! 🎵\n\nTu écoutes quoi en ce moment ? Moi je trouve ça fascinant comment les ondes sonores créent de la musique — c'est de la physique pure ! Les fréquences, les harmoniques, le rythme...\n\nSi tu veux, je peux t'expliquer la physique du son, ou on peut juste discuter de musique. Comme tu veux ! 😊` },
    { keywords: ["film", "films", "série", "séries", "netflix", "disney", "anime", "naruto", "one piece", "jujutsu", "demon slayer"], response: `Ah les séries et films ! 🎬\n\nC'est un bon sujet. Tu regardes quoi en ce moment ? Les animes c'est pas mal aussi — il y a beaucoup de science dedans si tu y prêtes attention !\n\nTu veux continuer à discuter ou tu as un cours à réviser ?` },
    { keywords: ["sport", "football", "basketball", "basket", "f1", "formula 1", "mma", "boxe", "tennis", "atletico", "real madrid", "barcelona", "psg", "inter", "juventus"], response: `Le sport ! ⚽🏀\n\nC'est un domaine où la physique est très présente — les trajectoires, la vitesse, l'énergie cinétique...\n\nTu suis quel sport ? Et si tu veux, je peux t'expliquer la physique derrière un tir au but, un dunk, ou un virage en F1 ! 😊` },
    { keywords: ["techno", "technologie", "tech", "iphone", "samsung", "ai", "intelligence artificielle", "robot", "spacex", "tesla", "google"], response: `La technologie, c'est passionnant ! 🚀\n\nTu t'intéresses à quoi ? L'IA, la space, les phones, les voitures électriques ?\n\nC'est marrant parce que derrière toute la tech, il y a des maths et de la physique — des circuits, des algorithmes, des ondes électromagnétiques...\n\nTu veux qu'on parle tech ou tu as un cours ?` },
    { keywords: ["voyage", "voyager", "pays", "maroc", "france", "dubai", "japon", "travel"], response: `Les voyages, c'est génial ! ✈️🌍\n\nTu veux aller où ? Le Maroc a des trucs incroyables — l'Atlas, le Sahara, les riads de Fès...\n\nEt savais-tu que la navigation utilise des calculs mathématiques complexes ? Les coordonnées GPS, les fuseaux horaires, la cartographie...\n\nOn continue à discuter ou tu veux réviser ?` },
    { keywords: ["humour", "blague", "drôle", "rire", "meme", "mème"], response: `Tu veux une blague ? 😄\n\nPourquoi les maths sont tristes ?\nParce qu'elles ont trop de problèmes ! 😂\n\nBon, sur ce, tu veux qu'on passe à un sujet plus sérieux ou on continue à rigoler ?` },
    { keywords: ["merci", "thanks", "super", "génial", "bravo", "parfait", "excellent"], response: `Merci à toi ! 😊\n\nN'hésite pas si tu as d'autres questions, que ce soit de cours ou autre chose. Je suis là ! 💪` },
    { keywords: ["qui es-tu", "qui es tu", "t'es qui", "tu es qui", "présentation", "présente-toi", "c'est quoi ton nom", "comment tu t'appelles", "ton nom"], response: `Je suis ton **assistant scientifique IA** ! 🧪\n\nMon rôle est de t'aider dans tes révisions, t'expliquer les cours, te montrer des expériences, et répondre à tes questions — que ce soit scolaires ou non !\n\nJe connais les cours de 2e BAC marocain en maths, physique et chimie. Mais je peux aussi discuter de musique, de jeux, de films... de tout ce que tu veux ! 😊\n\nComment je peux t'aider ?` },
    { keywords: ["âge", "age", "t'es vieux", "t'es jeune", "tu es un humain", "t'es un robot", "es-tu un robot", "t'es une ia", "t'es une intelligence", "tu es une ia", "es tu humain", "tu es humain"], response: `Je suis une intelligence artificielle ! 🤖\n\nJe ne suis pas humain, mais je suis là pour t'aider du mieux possible. Je peux te parler de n'importe quoi — cours, sport, musique, technologie...\n\nEt si tu as besoin d'aide pour réviser, je suis ton meilleur allié ! 💪` },
    { keywords: ["dormir", "fatigué", "fatigue", "coupé", "las", "lassée", "je suis crevé", "fatigant", " ennuyeux", "ennui", "chiant", "chiant", "saoule", "saoul", "marre", "lourd"], response: `Je comprends, ça arrive d'être fatigué ou ennuyé ! 😅\n\nTu veux qu'on fasse quelque chose de plus interactif ? Je peux te monter une simulation dans le labo, ou on peut discuter de quelque chose qui t'intéresse vraiment.\n\nSinon, prends une pause — réviser c'est important mais le repos aussi ! 💤` },
  ];

  // Vérifier si c'est un sujet général
  for (const topic of generalTopics) {
    if (topic.keywords.some((kw) => lower.includes(kw))) {
      return { response: topic.response, experiment: undefined, hints: [], suggestions: [] };
    }
  }

  // ─── RÉPONSES SPÉCIALES ───
  if (lower.includes("pas compris") || lower.includes("pas compris") || lower.includes("j'ai pas compris") || lower.includes("reformule") || lower.includes("autrement")) {
    const reformulations = [
      "Je vais t'expliquer autrement :\n\n",
      "Pas de souci, voici une autre approche :\n\n",
      "Compris, je reformule plus simplement :\n\n",
    ];
    const lastTopic = ctx.currentSubject || "math";
    const reformulation = reformulations[Math.floor(Math.random() * reformulations.length)];
    return {
      response: `${reformulation}En termes simples, cette notion signifie que当我们observons le comportement d'une grandeur, on cherche à comprendre comment elle évolut.\n\nEssaie de me poser une question plus précise, et je t'expliquerai étape par étape. 💪`,
      experiment: undefined,
      hints: [],
      suggestions: ["Explique-moi avec un exemple", "Montre-moi un graphique", "Donne-moi un exercice"],
    };
  }

  if (lower.includes("exemple") || lower.includes("exercice")) {
    return {
      response: `**Exercice d'entraînement** 📝\n\nSoit f(x) = 2x² − 8x + 6\n\n1. Calculer Δ\n2. Trouver les racines\n3. Déterminer le sommet de la parabole\n4. Étudier le signe de f(x)\n\n**Données :** a = 2, b = −8, c = 6\n\nTu veux que je t'aide ou que je te donne la solution ?`,
      experiment: experiment,
      hints: ["Commence par calculer le discriminant", "Δ = b² − 4ac", "Ensuite, applique la formule des racines"],
      suggestions: ["Aide-moi (mode indices)", "Donne-moi la solution complète", "Montre-moi le graphique"],
    };
  }

  // ─── RÉPONSE BASE SUR CONNAISSANCES ───
  if (bestMatch && bestScore > 0) {
    const entry = knowledgeBase[bestMatch];
    return {
      response: entry.response,
      experiment: experiment || entry.experiment || undefined,
      hints: entry.suggestions || [],
      suggestions: entry.suggestions || [],
    };
  }

  // ─── RÉPONSE GÉNÉRIQUE ADAPTÉE ───
  if (lang === "ar") {
    return {
      response: `أنا هنا لمساعدتك! 🎓\n\nيمكنني مساعدتك في:\n• 📐 الرياضيات: حدود، اشتقاق، تكامل، جبر\n• ⚛️ الفيزياء: دوائر، ميكانيك، أمواج، اهتزازات\n• 🧪 الكيمياء: تراكيز، تفاعلات، جزيئات\n\nحاول تطرح سؤال أكثر تحديداً أو اختر تجربة من القائمة!`,
      experiment: undefined,
      hints: [],
      suggestions: ["شرح الم derived", "اختبار في الفيزياء", "تجربة في الكيمياء"],
    };
  }

  return {
    response: `Je suis ton assistant scientifique ! 🧪\n\nJe peux t'aider avec :\n• 📐 **Mathématiques** : limites, dérivation, suites, intégrales\n• ⚛️ **Physique** : circuits, mécanique, ondes, oscillations\n• 🧪 **Chimie** : dosages, réactions, molécules\n\nEssaie de me poser une question précise, ou choisis une expérience dans le labo !\n\n**Exemples de demandes :**\n• "Explique-moi les limites"\n• "Montre-moi un circuit RC"\n• "Montre-moi un dosage"\n• "Résous cet exercice"`,
    experiment: undefined,
    hints: [],
    suggestions: ["Explique-moi les limites", "Montre-moi un circuit RC", "Montre-moi un dosage", "Explique-moi la dérivée"],
  };
}

// ═══════════════════════════════════════════════════════════════
// 📷 ANALYSE D'IMAGE (architecture prête pour vrai LLM)
// ═══════════════════════════════════════════════════════════════

export function analyzeImage(imageDescription: string): string {
  return `🔎 **Analyse de l'image :**\n\nJ'ai identifié les éléments suivants dans ta photo :\n\n${imageDescription}\n\n**Interprétation :**\nIl semble s'agir d'un exercice/mathématique/physique.\n\nTu veux que je :\n1. Résolve l'exercice étape par étape ?\n2. T'explique les concepts utilisés ?\n3. Te montre un graphique correspondant ?\n\nDis-moi ce que tu préfères ! 👇`;
}

// ═══════════════════════════════════════════════════════════════
// 🎯 INITIALISATION DU CONTEXTE
// ═══════════════════════════════════════════════════════════════

export function createInitialContext(): AIContext {
  return {
    conversationHistory: [],
    currentSubject: null,
    currentExperiment: null,
    simulationParams: null,
    currentExercise: null,
    hintStep: 0,
    learningMode: "explain",
    studentLevel: "2bac",
    photos: [],
    currentMode: "general",
  };
}
