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

type ProcessResult = { response: string; experiment: string | undefined; hints: string[]; suggestions: string[]; mode: AIMode };

// ═══════════════════════════════════════════════════════════════
// 📚 BASE DE CONNAISSANCES — ÉDUCATION
// ═══════════════════════════════════════════════════════════════

const knowledgeBase: Record<string, {
  keywords: string[];
  response: string;
  experiment?: string;
  suggestions?: string[];
}> = {
  limites: {
    keywords: ["limite", "limites", "continuité", "continuité", "tend vers"],
    response: `**Les limites** décrivent le comportement d'une fonction quand x tend vers une valeur.\n\n**Définition intuitive :**\nLa limite de f(x) quand x → a est ℓ si f(x) se rapproche de ℓ quand x se rapproche de a.\n\n**Notation :** lim(x→a) f(x) = ℓ\n\n**Limites usuelles :**\n• lim(x→0) sin(x)/x = 1\n• lim(x→+∞) e^x = +∞\n• lim(x→+∞) 1/x = 0\n• lim(x→0) ln(x) = −∞\n\n**Règles :**\n• lim(f + g) = lim f + lim g\n• lim(f × g) = lim f × lim g\n• lim(f/g) = lim f / lim g\n\n**Indéterminations :** 0/0, ∞/∞, 0×∞, ∞−∞`,
    experiment: "fonction",
    suggestions: ["Montre-moi une fonction logarithme", "Explique-moi la continuité", "Résous un exercice"],
  },
  derivation: {
    keywords: ["dérivée", "derivée", "dérivation", "pente", "tangente", "variation", "extremum"],
    response: `**La dérivée** d'une fonction en un point est la pente de la tangente.\n\n**Définition :**\nf'(x₀) = lim(h→0) [f(x₀+h) − f(x₀)] / h\n\n**Interprétion :**\n• f'(x) > 0 → croissante\n• f'(x) < 0 → décroissante\n• f'(x) = 0 → extremum\n\n**Formules essentielles :**\n• (xⁿ)' = n·xⁿ⁻¹\n• (eˣ)' = eˣ\n• (ln x)' = 1/x\n• (sin x)' = cos x\n• (u×v)' = u'×v + u×v'`,
    experiment: "fonction",
    suggestions: ["Montre-moi une parabole avec sa dérivée", "Résous un exercice"],
  },
  suite: {
    keywords: ["suite", "suites", "suites numériques", "convergence", "fibonacci"],
    response: `**Une suite numérique** est une application de ℕ dans ℝ.\n\n**Modes de génération :**\n• Explicite : uₙ = f(n)\n• Récurrence : uₙ₊₁ = f(uₙ)\n\n**Suites usuelles :**\n• Arithmétique : uₙ = u₀ + n×r\n• Géométrique : uₙ = u₀×qⁿ\n\n**Convergence :**\n• Arithmétique : ⟺ r = 0\n• Géométrique : ⟺ |q| < 1\n\n**Théorème des gendarmes :**\nSi aₙ ≤ uₙ ≤ bₙ et lim aₙ = lim bₙ = ℓ, alors lim uₙ = ℓ.`,
    suggestions: ["Montre-moi une suite arithmétique", "Montre-moi une suite géométrique"],
  },
  circuit_rc: {
    keywords: ["circuit rc", "condensateur", "charge", "décharge", "constante de temps", "résistance", "capacité"],
    response: `**Circuit RC** = Résistance + Condensateur en série.\n\n**Constante de temps :** τ = R × C\n\n**Charge :** Uc(t) = U₀(1 − e^(−t/τ))\n**Décharge :** Uc(t) = U₀ × e^(−t/τ)\n\n**Points clés :**\n• t = τ : 63% chargé\n• t = 3τ : 95%\n• t = 5τ : 99%`,
    experiment: "circuit",
    suggestions: ["Lance la simulation circuit RC", "Que se passe-t-il si on double R ?"],
  },
  projectile: {
    keywords: ["projectile", "mouvement", "parabolique", "chute libre", "trajectoire"],
    response: `**Mouvement parabolique :**\n• Horizontal : x(t) = v₀·cos(θ)·t\n• Vertical : y(t) = v₀·sin(θ)·t − ½gt²\n\n**Portée :** R = v₀²·sin(2θ)/g\n**Hauteur max :** H = v₀²·sin²(θ)/(2g)\n**Angle optimal :** θ = 45°`,
    experiment: "projectile",
    suggestions: ["Lance la simulation projectile", "Pourquoi 45° est optimal ?"],
  },
  ondes: {
    keywords: ["onde", "ondes", "fréquence", "longueur d'onde", "propagation"],
    response: `**Onde :** transporte de l'énergie sans matière.\n\n**v = λ × f**\n\n**Types :**\n• Mécaniques : son, vagues\n• EM : lumière, radio\n\n**Phénomènes :** réflexion, réfraction, diffraction, interférence.`,
    experiment: "onde",
    suggestions: ["Lance la simulation onde", "Différence son/lumière ?"],
  },
  dosage: {
    keywords: ["dosage", "ph", "acide", "base", "acido-basique", "titrage", "équivalence"],
    response: `**Dosage acido-basique :**\n• pH = −log[H₃O⁺]\n• Point d'équivalence : n_acide = n_base\n• Formule : C₁V₁ = C₂V₂\n\n**Acide fort + Base forte → pH = 7**\n**Acide faible + Base forte → pH > 7**`,
    experiment: "dosage",
    suggestions: ["Lance la simulation dosage", "Acide fort vs faible ?"],
  },
  moleculaire: {
    keywords: ["molécule", "molécules", "liaison", "structure", "atome", "composé"],
    response: `**Liaisons chimiques :**\n• Ionique : transfert e⁻ (NaCl)\n• Covalente : partage e⁻ (H₂O)\n• Métallique : bain d'e⁻ (Fe)\n\n**Géométrie :**\n• Linéaire : CO₂ (180°)\n• Coudée : H₂O (104,5°)\n• Tétrédrique : CH₄ (109,5°)`,
    suggestions: ["Montre-moi des molécules en 3D", "Ionique vs covalente ?"],
  },
};

// ═══════════════════════════════════════════════════════════════
// 💬 BASE DE DISCUSSIONS GÉNÉRALES
// ═══════════════════════════════════════════════════════════════

const generalTopics = [
  { keywords: ["salut", "bonjour", "bonsoir", "coucou", "hey", "hello", "ça va", "ca va", "comment ça va", "comment vas-tu", "ça roule"], response: `Salut ! 😊 Comment ça va ?\n\nJe suis ton assistant scientifique, mais je suis aussi là pour discuter de tout ce que tu veux. Tu veux qu'on parle de quelque chose en particulier ?` },
  { keywords: ["minecraft", "jeux", "jeu", "gaming", "playstation", "xbox", "nintendo", "fortnite", "valorant", "lol", "league of legends", "fifa", "rocket league"], response: `Minecraft ! 🎮 Un classique !\n\nLe jeu de construction et de survie par Mojang. Tu peux construire des maisons, explorer des cavernes, affronter des monstres...\n\nEt savais-tu que Minecraft utilise des algorithmes de **génération procédurale** pour créer les mondes ? C'est un peu comme des maths appliquées au divertissement ! 🧮\n\nTu veux qu'on parle d'autre chose, ou tu as une question de cours ?` },
  { keywords: ["musique", "chanson", "concert", "spotify", "rap", "pop", "rock", "drill", "afro", "melanie", "booba", "damso", "navy", "gazo"], response: `La musique, c'est super ! 🎵\n\nTu écoutes quoi en ce moment ? Moi je trouve ça fascinant comment les ondes sonores créent de la musique — c'est de la physique pure ! Les fréquences, les harmoniques, le rythme...\n\nSi tu veux, je peux t'expliquer la physique du son, ou on peut juste discuter de musique. Comme tu veux ! 😊` },
  { keywords: ["film", "films", "série", "séries", "netflix", "disney", "anime", "naruto", "one piece", "jujutsu", "demon slayer"], response: `Ah les séries et films ! 🎬\n\nTu regardes quoi en ce moment ? Les animes c'est pas mal aussi — il y a beaucoup de science dedans si tu y prêtes attention !\n\nTu veux continuer à discuter ou tu as un cours à réviser ?` },
  { keywords: ["sport", "football", "basketball", "basket", "f1", "formula 1", "mma", "boxe", "tennis", "atletico", "real madrid", "barcelona", "psg", "inter", "juventus"], response: `Le sport ! ⚽🏀\n\nC'est un domaine où la physique est très présente — les trajectoires, la vitesse, l'énergie cinétique...\n\nTu suis quel sport ? Et si tu veux, je peux t'expliquer la physique derrière un tir au but, un dunk, ou un virage en F1 ! 😊` },
  { keywords: ["techno", "technologie", "tech", "iphone", "samsung", "ai", "intelligence artificielle", "robot", "spacex", "tesla", "google"], response: `La technologie, c'est passionnant ! 🚀\n\nTu t'intéresses à quoi ? L'IA, la space, les phones, les voitures électriques ?\n\nC'est marrant parce que derrière toute la tech, il y a des maths et de la physique — des circuits, des algorithmes, des ondes électromagnétiques...\n\nTu veux qu'on parle tech ou tu as un cours ?` },
  { keywords: ["voyage", "voyager", "pays", "maroc", "france", "dubai", "japon", "travel"], response: `Les voyages, c'est génial ! ✈️🌍\n\nTu veux aller où ? Le Maroc a des trucs incroyables — l'Atlas, le Sahara, les riads de Fès...\n\nEt savais-tu que la navigation utilise des calculs mathématiques complexes ? Les coordonnées GPS, les fuseaux horaires...\n\nOn continue à discuter ou tu veux réviser ?` },
  { keywords: ["humour", "blague", "drôle", "rire", "meme", "mème"], response: `Tu veux une blague ? 😄\n\nPourquoi les maths sont tristes ?\nParce qu'elles ont trop de problèmes ! 😂\n\nBon, sur ce, tu veux qu'on passe à un sujet plus sérieux ou on continue à rigoler ?` },
  { keywords: ["merci", "thanks", "super", "génial", "bravo", "parfait", "excellent"], response: `Merci à toi ! 😊\n\nN'hésite pas si tu as d'autres questions, que ce soit de cours ou autre chose. Je suis là ! 💪` },
  { keywords: ["qui es-tu", "qui es tu", "t'es qui", "tu es qui", "présentation", "présente-toi", "c'est quoi ton nom", "comment tu t'appelles", "ton nom"], response: `Je suis ton **assistant scientifique IA** ! 🧪\n\nMon rôle est de t'aider dans tes révisions, t'expliquer les cours, te montrer des expériences, et répondre à tes questions — que ce soit scolaires ou non !\n\nJe connais les cours de 2e BAC marocain en maths, physique et chimie. Mais je peux aussi discuter de musique, de jeux, de films... de tout ce que tu veux ! 😊` },
  { keywords: ["âge", "age", "t'es vieux", "t'es jeune", "tu es un humain", "t'es un robot", "es-tu un robot", "t'es une ia", "t'es une intelligence", "tu es une ia", "es tu humain", "tu es humain"], response: `Je suis une intelligence artificielle ! 🤖\n\nJe ne suis pas humain, mais je suis là pour t'aider du mieux possible. Je peux te parler de n'importe quoi — cours, sport, musique, technologie...\n\nEt si tu as besoin d'aide pour réviser, je suis ton meilleur allié ! 💪` },
  { keywords: ["dormir", "fatigué", "fatigue", "coupé", "las", "lassée", "je suis crevé", "fatigant", "ennuyeux", "ennui", "chiant", "saoule", "saoul", "marre", "lourd"], response: `Je comprends, ça arrive d'être fatigué ou ennuyé ! 😅\n\nTu veux qu'on fasse quelque chose de plus interactif ? Je peux te monter une simulation dans le labo, ou on peut discuter de quelque chose qui t'intéresse vraiment.\n\nSinon, prends une pause — réviser c'est important mais le repos aussi ! 💤` },
];

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
): ProcessResult {
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
          mode: "exercise",
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
          mode: "exercise",
        };
      }
    }
  }

  // ─── DÉTECTION D'EXPÉRIENCE ───
  const experiment = detectExperiment(query);

  // ─── RECHERCHE DANS LA BASE ÉDUCATIVE ───
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

  // ─── DISCUSSION GÉNÉRALE (hors éducation) ───
  // Si pas de match éducatif ET pas d'expérience détectée → vérifier les sujets généraux
  if (bestScore === 0 && !experiment) {
    for (const topic of generalTopics) {
      if (topic.keywords.some((kw) => lower.includes(kw))) {
        return {
          response: topic.response,
          experiment: undefined,
          hints: [],
          suggestions: [],
          mode: "general",
        };
      }
    }
  }

  // ─── RÉPONSES SPÉCIALES ───
  if (lower.includes("pas compris") || lower.includes("pas compris") || lower.includes("j'ai pas compris") || lower.includes("reformule") || lower.includes("autrement")) {
    const reformulations = [
      "Je vais t'expliquer autrement :\n\n",
      "Pas de souci, voici une autre approche :\n\n",
      "Compris, je reformule plus simplement :\n\n",
    ];
    const reformulation = reformulations[Math.floor(Math.random() * reformulations.length)];
    return {
      response: `${reformulation}En termes simples, cette notion décrit le comportement d'une grandeur quand une variable évolue.\n\nEssaie de me poser une question plus précise, et je t'expliquerai étape par étape. 💪`,
      experiment: undefined,
      hints: [],
      suggestions: ["Explique-moi avec un exemple", "Montre-moi un graphique", "Donne-moi un exercice"],
      mode: "education",
    };
  }

  if (lower.includes("exemple") || lower.includes("exercice")) {
    return {
      response: `**Exercice d'entraînement** 📝\n\nSoit f(x) = 2x² − 8x + 6\n\n1. Calculer Δ\n2. Trouver les racines\n3. Déterminer le sommet de la parabole\n4. Étudier le signe de f(x)\n\n**Données :** a = 2, b = −8, c = 6\n\nTu veux que je t'aide ou que je te donne la solution ?`,
      experiment: experiment,
      hints: ["Commence par calculer le discriminant", "Δ = b² − 4ac", "Ensuite, applique la formule des racines"],
      suggestions: ["Aide-moi (mode indices)", "Donne-moi la solution complète", "Montre-moi le graphique"],
      mode: "exercise",
    };
  }

  // ─── RÉPONSE BASE ÉDUCATIVE ───
  if (bestMatch && bestScore > 0) {
    const entry = knowledgeBase[bestMatch];
    return {
      response: entry.response,
      experiment: experiment || entry.experiment || undefined,
      hints: entry.suggestions || [],
      suggestions: entry.suggestions || [],
      mode: experiment ? "lab" : "education",
    };
  }

  // ─── RÉPONSE GÉNÉRIQUE ───
  if (lang === "ar") {
    return {
      response: `أنا هنا لمساعدتك! 🎓\n\nيمكنني مساعدتك في:\n• 📐 الرياضيات: حدود، اشتقاق، تكامل\n• ⚛️ الفيزياء: دوائر، ميكانيك، أمواج\n• 🧪 الكيمياء: تراكيز، تفاعلات، جزيئات\n\nحاول تطرح سؤال أكثر تحديداً!`,
      experiment: undefined,
      hints: [],
      suggestions: [],
      mode: "education",
    };
  }

  // ─── FALLBACK : on ne sait pas → discussion libre ───
  return {
    response: `Je suis ton assistant scientifique ! 🧪\n\nJe peux t'aider avec :\n• 📐 **Mathématiques** : limites, dérivation, suites, intégrales\n• ⚛️ **Physique** : circuits, mécanique, ondes, oscillations\n• 🧪 **Chimie** : dosages, réactions, molécules\n\nOu on peut discuter de n'importe quoi — musique, jeux, sport, technologie... 😊\n\nEssaie de me poser une question ou choisis une expérience !`,
    experiment: undefined,
    hints: [],
    suggestions: ["Explique-moi les limites", "Montre-moi un circuit RC", "Montre-moi un dosage"],
    mode: "general",
  };
}

// ═══════════════════════════════════════════════════════════════
// 📷 ANALYSE D'IMAGE (architecture prête pour vrai LLM)
// ═══════════════════════════════════════════════════════════════

export function analyzeImage(imageDescription: string): string {
  return `🔎 **Analyse de l'image :**\n\n${imageDescription}\n\n**Interprétation :**\nIl semble s'agir d'un exercice.\n\nTu veux que je :\n1. Résolve l'exercice étape par étape ?\n2. T'explique les concepts utilisés ?\n3. Te montre un graphique correspondant ?\n\nDis-moi ce que tu préfères ! 👇`;
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
