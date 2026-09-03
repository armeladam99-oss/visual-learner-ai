// ═══════════════════════════════════════════════════════════════
// 🧠 MOTEUR IA PÉDAGOGIQUE — Studio ADAM
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
    keywords: ["limite", "limites", "continuité", "tend vers"],
    response: "**Les limites** décrivent le comportement d'une fonction quand x tend vers une valeur.\n\n**Définition intuitive :**\nLa limite de f(x) quand x → a est ℓ si f(x) se rapproche de ℓ quand x se rapproche de a.\n\n**Notation :** lim(x→a) f(x) = ℓ\n\n**Limites usuelles :**\n• lim(x→0) sin(x)/x = 1\n• lim(x→+∞) e^x = +∞\n• lim(x→+∞) 1/x = 0\n• lim(x→0) ln(x) = −∞\n\n**Règles :**\n• lim(f + g) = lim f + lim g\n• lim(f × g) = lim f × lim g\n• lim(f/g) = lim f / lim g\n\n**Indéterminations :** 0/0, ∞/∞, 0×∞, ∞−∞",
    experiment: "fonction",
    suggestions: ["Montre-moi une fonction logarithme", "Explique-moi la continuité", "Résous un exercice"],
  },
  derivation: {
    keywords: ["dérivée", "derivée", "dérivation", "pente", "tangente", "variation", "extremum"],
    response: "**La dérivée** d'une fonction en un point est la pente de la tangente.\n\n**Définition :**\nf'(x₀) = lim(h→0) [f(x₀+h) − f(x₀)] / h\n\n**Interprétation :**\n• f'(x) > 0 → croissante\n• f'(x) < 0 → décroissante\n• f'(x) = 0 → extremum\n\n**Formules essentielles :**\n• (xⁿ)' = n·xⁿ⁻¹\n• (eˣ)' = eˣ\n• (ln x)' = 1/x\n• (sin x)' = cos x\n• (u×v)' = u'×v + u×v'",
    experiment: "fonction",
    suggestions: ["Montre-moi une parabole avec sa dérivée", "Résous un exercice"],
  },
  suite: {
    keywords: ["suite", "suites", "suites numériques", "convergence"],
    response: "**Une suite numérique** est une application de ℕ dans ℝ.\n\n**Modes de génération :**\n• Explicite : uₙ = f(n)\n• Récurrence : uₙ₊₁ = f(uₙ)\n\n**Suites usuelles :**\n• Arithmétique : uₙ = u₀ + n×r\n• Géométrique : uₙ = u₀×qⁿ\n\n**Convergence :**\n• Arithmétique : ⟺ r = 0\n• Géométrique : ⟺ |q| < 1\n\n**Théorème des gendarmes :**\nSi aₙ ≤ uₙ ≤ bₙ et lim aₙ = lim bₙ = ℓ, alors lim uₙ = ℓ.",
    suggestions: ["Montre-moi une suite arithmétique", "Montre-moi une suite géométrique"],
  },
  circuit_rc: {
    keywords: ["circuit rc", "condensateur", "charge", "décharge", "constante de temps"],
    response: "**Circuit RC** = Résistance + Condensateur en série.\n\n**Constante de temps :** τ = R × C\n\n**Charge :** Uc(t) = U₀(1 − e^(−t/τ))\n**Décharge :** Uc(t) = U₀ × e^(−t/τ)\n\n**Points clés :**\n• t = τ : 63% chargé\n• t = 3τ : 95%\n• t = 5τ : 99%",
    experiment: "circuit",
    suggestions: ["Lance la simulation circuit RC", "Que se passe-t-il si on double R ?"],
  },
  projectile: {
    keywords: ["projectile", "mouvement", "parabolique", "chute libre", "trajectoire"],
    response: "**Mouvement parabolique :**\n• Horizontal : x(t) = v₀·cos(θ)·t\n• Vertical : y(t) = v₀·sin(θ)·t − ½gt²\n\n**Portée :** R = v₀²·sin(2θ)/g\n**Hauteur max :** H = v₀²·sin²(θ)/(2g)\n**Angle optimal :** θ = 45°",
    experiment: "projectile",
    suggestions: ["Lance la simulation projectile", "Pourquoi 45° est optimal ?"],
  },
  ondes: {
    keywords: ["onde", "ondes", "fréquence", "longueur d'onde", "propagation"],
    response: "**Onde :** transporte de l'énergie sans matière.\n\n**v = λ × f**\n\n**Types :**\n• Mécaniques : son, vagues\n• EM : lumière, radio\n\n**Phénomènes :** réflexion, réfraction, diffraction, interférence.",
    experiment: "onde",
    suggestions: ["Lance la simulation onde", "Différence son/lumière ?"],
  },
  dosage: {
    keywords: ["dosage", "ph", "acide", "base", "acido-basique", "titrage", "équivalence"],
    response: "**Dosage acido-basique :**\n• pH = −log[H₃O⁺]\n• Point d'équivalence : n_acide = n_base\n• Formule : C₁V₁ = C₂V₂\n\n**Acide fort + Base forte → pH = 7**\n**Acide faible + Base forte → pH > 7**",
    experiment: "dosage",
    suggestions: ["Lance la simulation dosage", "Acide fort vs faible ?"],
  },
  moleculaire: {
    keywords: ["molécule", "molécules", "liaison", "structure", "atome", "composé"],
    response: "**Liaisons chimiques :**\n• Ionique : transfert e⁻ (NaCl)\n• Covalente : partage e⁻ (H₂O)\n• Métallique : bain d'e⁻ (Fe)\n\n**Géométrie :**\n• Linéaire : CO₂ (180°)\n• Coudée : H₂O (104,5°)\n• Tétrédrique : CH₄ (109,5°)",
    suggestions: ["Montre-moi des molécules en 3D", "Ionique vs covalente ?"],
  },
};

// ═══════════════════════════════════════════════════════════════
// 💬 BASE DE DISCUSSIONS GÉNÉRALES
// ═══════════════════════════════════════════════════════════════

const generalTopics = [
  { keywords: ["salut", "bonjour", "bonsoir", "coucou", "hey", "hello", "ça va", "ca va", "comment ça va", "comment vas-tu", "ça roule", "wesh", "yo"], response: "Salut ! 😊 Comment ça va ?\n\nJe suis ton assistant, et je suis aussi là pour discuter de tout ce que tu veux. Tu veux qu'on parle de quelque chose en particulier ?" },
  { keywords: ["minecraft", "jeux", "jeu", "gaming", "playstation", "xbox", "nintendo", "fortnite", "valorant", "lol", "league of legends", "fifa", "rocket league"], response: "Minecraft ! 🎮 Un classique !\n\nLe jeu de construction et de survie par Mojang. Tu peux construire des maisons, explorer des cavernes, affronter des monstres...\n\nEt savais-tu que Minecraft utilise des algorithmes de **génération procédurale** pour créer les mondes ? C'est un peu comme des maths appliquées au divertissement ! 🧮\n\nTu veux qu'on parle d'autre chose, ou tu as une question ?" },
  { keywords: ["musique", "chanson", "concert", "spotify", "rap", "pop", "rock", "drill", "afro", "melanie", "booba", "damso", "navy", "gazo"], response: "La musique, c'est super ! 🎵\n\nTu écoutes quoi en ce moment ? Moi je trouve ça fascinant comment les ondes sonores créent de la musique — c'est de la physique pure ! Les fréquences, les harmoniques, le rythme...\n\nSi tu veux, je peux t'expliquer la physique du son, ou on peut juste discuter de musique. Comme tu veux ! 😊" },
  { keywords: ["film", "films", "série", "séries", "netflix", "disney", "anime", "naruto", "one piece", "jujutsu", "demon slayer"], response: "Ah les séries et films ! 🎬\n\nTu regardes quoi en ce moment ? Les animes c'est pas mal aussi — il y a beaucoup de science dedans si tu y prêtes attention !\n\nTu veux continuer à discuter ou tu as un cours à réviser ?" },
  { keywords: ["sport", "football", "basketball", "basket", "f1", "formula 1", "mma", "boxe", "tennis", "atletico", "real madrid", "barcelona", "psg", "inter", "juventus"], response: "Le sport ! ⚽🏀\n\nC'est un domaine où la physique est très présente — les trajectoires, la vitesse, l'énergie cinétique...\n\nTu suis quel sport ? Et si tu veux, je peux t'expliquer la physique derrière un tir au but, un dunk, ou un virage en F1 ! 😊" },
  { keywords: ["techno", "technologie", "tech", "iphone", "samsung", "ai", "intelligence artificielle", "robot", "spacex", "tesla", "google"], response: "La technologie, c'est passionnant ! 🚀\n\nTu t'intéresses à quoi ? L'IA, la space, les phones, les voitures électriques ?\n\nC'est marrant parce que derrière toute la tech, il y a des maths et de la physique — des circuits, des algorithmes, des ondes électromagnétiques...\n\nTu veux qu'on parle tech ou tu as une question ?" },
  { keywords: ["voyage", "voyager", "pays", "maroc", "france", "dubai", "japon", "travel"], response: "Les voyages, c'est génial ! ✈️🌍\n\nTu veux aller où ? Le Maroc a des trucs incroyables — l'Atlas, le Sahara, les riads de Fès...\n\nEt savais-tu que la navigation utilise des calculs mathématiques complexes ? Les coordonnées GPS, les fuseaux horaires...\n\nOn continue à discuter ou tu veux réviser ?" },
  { keywords: ["humour", "blague", "drôle", "rire", "meme", "mème"], response: "Tu veux une blague ? 😄\n\nPourquoi les maths sont tristes ?\nParce qu'elles ont trop de problèmes ! 😂\n\nBon, sur ce, tu veux qu'on passe à un sujet plus sérieux ou on continue à rigoler ?" },
  { keywords: ["merci", "thanks", "super", "génial", "bravo", "parfait", "excellent"], response: "Merci à toi ! 😊\n\nN'hésite pas si tu as d'autres questions, que ce soit de cours ou autre chose. Je suis là ! 💪" },
  { keywords: ["ok", "d'accord", "d'acc", "ok merci", "c'est bon", "compris", "c'est clair", "noté", "oui", "ouais"], response: "Parfait ! 😊\n\nN'hésite pas si tu as besoin de quoi que ce soit — cours, exercice, ou juste discuter. Je suis là ! 💪" },
  { keywords: ["non", "nan", "non merci", "c'est tout", "rien", "pas maintenant"], response: "Pas de souci ! 😊\n\nJe reste là si tu changes d'avis. On peut discuter de tout, pas juste de cours ! 💬" },
  { keywords: ["qui es-tu", "qui es tu", "t'es qui", "tu es qui", "présentation", "présente-toi", "c'est quoi ton nom", "comment tu t'appelles", "ton nom"], response: "Je suis ton **assistant IA** ! 🧪\n\nMon rôle est de t'aider dans tes révisions, t'expliquer les cours, te montrer des expériences, et répondre à tes questions — que ce soit scolaires ou non !\n\nJe connais les cours de 2e BAC marocain en maths, physique et chimie. Mais je peux aussi discuter de musique, de jeux, de films... de tout ce que tu veux ! 😊" },
  { keywords: ["âge", "age", "t'es vieux", "t'es jeune", "tu es un humain", "t'es un robot", "es-tu un robot", "t'es une ia", "t'es une intelligence", "tu es une ia", "es tu humain", "tu es humain"], response: "Je suis une intelligence artificielle ! 🤖\n\nJe ne suis pas humain, mais je suis là pour t'aider du mieux possible. Je peux te parler de n'importe quoi — cours, sport, musique, technologie...\n\nEt si tu as besoin d'aide pour réviser, je suis ton meilleur allié ! 💪" },
  { keywords: ["dormir", "fatigué", "fatigue", "coupé", "las", "je suis crevé", "fatigant", "ennuyeux", "ennui", "chiant", "saoule", "marre", "lourd"], response: "Je comprends, ça arrive d'être fatigué ou ennuyé ! 😅\n\nTu veux qu'on fasse quelque chose de plus interactif ? Je peux te monter une simulation dans le labo, ou on peut discuter de quelque chose qui t'intéresse vraiment.\n\nSinon, prends une pause — réviser c'est important mais le repos aussi ! 💤" },
  { keywords: ["j'ai faim", "manger", "nourriture", "repas", "faim", "pizza", "couscous", "tajine", "kefta"], response: "La faim, c'est un sérieux sujet ! 🍕😋\n\nTu veux manger quoi ? Le Maroc a des plats incroyables — le couscous, le tajine, les brochettes...\n\nBon, je ne peux pas te cuisiner, mais je peux te distraire pendant que tu attends ! Tu veux qu'on discute ou tu veux réviser pendant que ça cuit ? 😄" },
  { keywords: ["ami", "amis", "copain", "copine", "pote", "meilleur ami", "relation", "amour", "amoureuse", "crush"], response: "Les relations, c'est un sujet important ! 😊\n\nC'est bien d'avoir des amis et des gens autour de soi. Les amitiés du lycée sont souvent celles qu'on retient le plus !\n\nTu veux en parler, ou tu préfères qu'on fasse autre chose ? 💬" },
  { keywords: ["bref", "bon", "quoi d'autre", "sinon", "et toi", "parle moi", "discute", "raconte"], response: "Allez, on discute ! 😊\n\nDis-moi, qu'est-ce qui te passe par la tête ? On peut parler de n'importe quoi — ton jour, la vie, des projets, des trucs rigolos... 🎯" },
  { keywords: ["pourquoi", "comment", "quest-ce que", "c'est quoi", "ça veut dire", "définition"], response: "Bonne question ! 🤔\n\nDis-moi exactement de quoi tu parles, et je t'explique clairement. Tu peux me poser des questions sur n'importe quoi — cours ou pas cours !" },
  { keywords: ["non merci", "pas envie", "j'en ai marre", "laisse tomber", "oublie", "stop", "arrête"], response: "Pas de souci, j'arrête ! 😊\n\nTu me diras quand tu voudras reprendre. Je suis toujours là. 💬" },
];

// ═══════════════════════════════════════════════════════════════
// 💬 RÉPONSES CONVERSATIONNELLES COURTES
// ═══════════════════════════════════════════════════════════════

const shortResponses: { patterns: RegExp[]; responses: string[] }[] = [
  {
    patterns: [/^(ah|ah ok|ah ouais|ah oui|oh|oho|waw|wow|waouh|pff|ptdr|mdr|haha|lol|gg|bg|cool|magnifique|incroyable|dingue|ouf|folie)$/i],
    responses: ["Haha 😄 On continue sur la lancée ou tu veux autre chose ?", "Ah ouais ? 😊 Dis-moi plus, je suis curieux !", "😅 En tout cas je suis là si tu as besoin de quoi que ce soit.", "😄 Toujours là pour toi ! Tu veux qu'on fasse quoi ?"],
  },
  {
    patterns: [/^(attends|att|patiente|wait|sec)$/i],
    responses: ["Je suis là, prends ton temps ! 👍", "Pas de rush, je t'attends. 😊", "Prends le temps qu'il te faut ! 💪"],
  },
  {
    patterns: [/^(oui|ouais|yep|yes|si|exact|exactement|c'est ça|bien sûr|je veux|je vais)$/i],
    responses: ["Top ! 👍 Dis-moi ce que tu veux faire.", "Parfait, dis-moi la suite ! 😊", "OK ! Qu'est-ce que tu veux qu'on fasse maintenant ? 💪"],
  },
  {
    patterns: [/^(non|nan|nah|nope|pas du tout|jamais)$/i],
    responses: ["Pas de souci ! 😊 On fait quoi d'autre alors ?", "D'accord, tu me diras ! 💬", "OK, je reste là si tu changes d'avis ! 😊"],
  },
  {
    patterns: [/^(test|cc|slm|salam|alaikoum|aslema|ahlan|bzef|jihan|mzyan|zwina)$/i],
    responses: ["Wa 3alikoum salam ! 😊 Comment je peux t'aider ?", "Salam ! 👋 Tout va bien ? Dis-moi comment je peux t'aider.", "Hey ! 😊 Je suis là, dis-moi ce que tu veux."],
  },
  {
    patterns: [/^(lol|mdr|ptdr|ahaha|hahaha|jaja|💀|😂|🤣)$/i],
    responses: ["Haha 😄 Tu es de bonne humeur ! Continue, dis-moi ce que tu veux faire.", "MDR 😂 Tu es trop marrant ! On fait quoi maintenant ?", "😂👍 Je suis là si tu as besoin de quoi que ce soit."],
  },
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
  if (q.includes("circuit") || q.includes("condensateur") || q.includes("décharge")) return "circuit";
  if (q.includes("dosage") || q.includes("ph") || q.includes("titrage")) return "dosage";
  if (q.includes("fonction") || q.includes("graphique") || q.includes("courbe") || q.includes("parabole") || q.includes("quadratique") || q.includes("sinus") || q.includes("exponentielle") || q.includes("logarithme")) return "fonction";
  if (q.includes("onde") || q.includes("propagation") || q.includes("fréquence")) return "onde";
  if (q.includes("pendule") || q.includes("oscillation") || q.includes("ressort")) return "oscillation";
  if (q.includes("molécule") || q.includes("molecule") || q.includes("structure")) return "molecule";
  return undefined;
}

// ═══════════════════════════════════════════════════════════════
// 🎭 DÉTECTION DE CONVERSATION GÉNÉRALE
// ═══════════════════════════════════════════════════════════════

function isGeneralConversation(query: string): boolean {
  const lower = query.toLowerCase().trim();
  const words = lower.split(/\s+/);
  if (words.length <= 3) return true;
  const withoutEmoji = lower.replace(/[\p{Emoji}\p{Emoji_Component}]/gu, "").trim();
  if (withoutEmoji.length < 5) return true;
  return false;
}

// ═══════════════════════════════════════════════════════════════
// 🔧 MOTEUR PRINCIPAL (local, fallback)
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

  // ─── RÉPONSES SPÉCIALES ───
  if (lower.includes("pas compris") || lower.includes("reformule") || lower.includes("autrement")) {
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
      response: "**Exercice d'entraînement** 📝\n\nSoit f(x) = 2x² − 8x + 6\n\n1. Calculer Δ\n2. Trouver les racines\n3. Déterminer le sommet de la parabole\n4. Étudier le signe de f(x)\n\n**Données :** a = 2, b = −8, c = 6\n\nTu veux que je t'aide ou que je te donne la solution ?",
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

  // ─── DISCUSSION GÉNÉRALE : sujets prédéfinis ───
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

  // ─── MESSAGES COURTS ───
  if (isGeneralConversation(query) && bestScore === 0 && !experiment) {
    for (const group of shortResponses) {
      if (group.patterns.some((p) => p.test(lower))) {
        const response = group.responses[Math.floor(Math.random() * group.responses.length)];
        return {
          response,
          experiment: undefined,
          hints: [],
          suggestions: ["Explique-moi les limites", "Montre-moi un circuit RC", "Dis-moi une blague"],
          mode: "general",
        };
      }
    }

    const fallbackShort = [
      `Hmm, "${query}" 😄\n\nDis-moi plus et je te réponds ! On peut parler de tout — cours, sport, musique, ou n'importe quoi d'autre.`,
      `"${query}" — interesting ! 🤔\n\nTu veux qu'on en parle, ou tu avais autre chose en tête ?`,
      `OK ! 😊 Tu veux qu'on discute de ça, ou tu veux passer à autre chose ?`,
      `Hmm, je vois ! 🤔\n\nExplique-moi un peu plus et je te réponds du mieux que je peux.`,
    ];
    return {
      response: fallbackShort[Math.floor(Math.random() * fallbackShort.length)],
      experiment: undefined,
      hints: [],
      suggestions: ["Explique-moi les limites", "Montre-moi un circuit RC", "Dis-moi une blague"],
      mode: "general",
    };
  }

  // ─── LANGUE ARABE ───
  if (lang === "ar") {
    return {
      response: `أنا هنا لمساعدتك! 🎓\n\nيمكنني مساعدتك في:\n• 📐 الرياضيات: حدود، اشتقاق، تكامل\n• ⚛️ الفيزياء: دوائر، ميكانيك، أمواج\n• 🧪 الكيمياء: تراكيز، تفاعلات، جزيئات\n\nحاول تطرح سؤال أكثر تحديداً!`,
      experiment: undefined,
      hints: [],
      suggestions: [],
      mode: "education",
    };
  }

  // ─── FALLBACK FINAL ───
  const finalFallback = [
    `Hmm, "${query}" 🤔\n\nJe ne suis pas sûr de comprendre, mais je suis là pour toi ! On peut discuter de tout — cours, musique, sport, jeux...\n\nOu si tu veux de l'aide scolaire, essaie : "explique-moi les limites" ou "montre-moi un circuit RC". 😊`,
    `Intéressant ! 🤔\n\nJe ne suis pas sûr de saisir le sujet exact, mais je peux :\n• 💬 Discuter de n'importe quoi\n• 📐 T'aider en maths, physique ou chimie\n• 🧪 Te montrer des simulations\n\nEssaie de reformuler ou demande-moi n'importe quoi ! 💪`,
    `Ah, "${query}" ! 😊\n\nDis-moi un peu plus et je te réponds. Je suis là pour discuter ou pour t'aider à réviser — comme tu veux !`,
  ];
  return {
    response: finalFallback[Math.floor(Math.random() * finalFallback.length)],
    experiment: undefined,
    hints: [],
    suggestions: ["Explique-moi les limites", "Montre-moi un circuit RC", "Dis-moi une blague"],
    mode: "general",
  };
}

// ═══════════════════════════════════════════════════════════════
// 📷 ANALYSE D'IMAGE
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

// ═══════════════════════════════════════════════════════════════
// 🤖 VRAI MODÈLE IA — Gemini via Convex Action
// ═══════════════════════════════════════════════════════════════

const SYSTEM_PROMPT = `Tu es « Visual Learner AI » (Studio ADAM), un tuteur scientifique intelligent, interactif et adaptatif pour les élèves de 2e année Bac au Maroc.

IDENTITÉ :
- Tu es un assistant amical, patient et pédagogique qui guide vers un apprentissage profond.
- Tu parles en français (tu peux aussi comprendre l'arabe et le darija marocain).
- Tu t'adresses à un adolescent de 16-18 ans.

COMPORTEMENT GÉNÉRAL :
- Tu peux discuter de N'IMPORTE QUOI : musique, jeux vidéo, films, sport, technologie, voyages, humour, vie quotidienne.
- Tu passes naturellement d'une conversation générale à une explication scolaire.
- Tu es naturel, amical, et tu utilises des emojis avec modération.

GUIDAGE ACADÉMIQUE :
- Tu réponds à TOUTE question scientifique, qu'elle soit ou non dans le programme de 2e année Bac.
- Si la question dépasse réellement le programme de 2e année Bac : explique clairement et simplement, puis ajoute ce bloc exact en fin de réponse :
« 📌 Note académique : ce sujet dépasse le programme de 2e année Bac, mais l'explorer te permettra d'élargir ta compréhension scientifique. »
- N'invente JAMAIS de faux exemples de « métiers du futur » : les liens avec les études supérieures et la vie réelle doivent être réalistes, concrets et simples.
- Tu montres les liens entre chapitres (dérivée → variations → optimisation, quantité de matière → concentration → dosage, etc.).

RIGUEUR SCIENTIFIQUE :
- Ne devine JAMAIS une date historique, une constante physique (g, c, e, NA, h...), une valeur numérique ou une démonstration mathématique.
- Si tu n'es pas certain d'un fait ou d'une formule : dis-le honnêtement et propose de vérifier dans le cours, plutôt que d'inventer.
- Pour un problème scientifique, structure : Données -> Loi/équation utilisée -> Formule -> Calcul -> Résultat -> Interprétation.
- Résous les exercices étape par étape, jamais seulement la réponse finale, en signalant les pièges fréquents.

QUAND L'ÉLÈVE PARLE DE COURS :
- Tu expliques clairement, étape par étape, avec des exemples concrets.
- Tu t'adresses au programme de 2e BAC marocain : mathématiques, physique, chimie.
- Quand c'est pertinent, propose des expériences, simulations ou visualisations.
- Quand tu décris un graphique, explique comment le lire : axes, unités, points importants, forme de la courbe, conclusion à en tirer.
- Quand tu révises un chapitre ou que l'élève s'entraîne pour un examen : ajoute une section « 🏆 Zone Défi — Exercices avancés » (1 à 2 exercices combinant plusieurs notions, corrigé étape par étape, pièges fréquents, niveau des examens nationaux), lorsque c'est pertinent — sans la forcer pour une question ponctuelle.

FORMAT :
- Réponds de manière concise mais complète, en markdown quand utile (gras, listes, formules).
- Si tu ne comprends pas, demande de reformuler.
- Tu gardes le contexte de la conversation et tu reformules si l'élève n'a pas compris.`;

interface GeminiMessage {
  role: "user" | "model";
  parts: { text: string }[];
}

export function buildGeminiMessages(
  conversationHistory: Message[],
  userMessage: string
): GeminiMessage[] {
  const messages: GeminiMessage[] = [];
  const recentHistory = conversationHistory.slice(-20);

  for (const msg of recentHistory) {
    messages.push({
      role: msg.role === "user" ? "user" : "model",
      parts: [{ text: msg.content }],
    });
  }

  messages.push({
    role: "user",
    parts: [{ text: userMessage }],
  });

  return messages;
}

export function getSystemPrompt(ctx: AIContext): string {
  let prompt = SYSTEM_PROMPT;
  if (ctx.currentExperiment) {
    prompt += `\n\nEXPÉRIENCE ACTIVE : ${ctx.currentExperiment}`;
    if (ctx.simulationParams) {
      prompt += `\nParamètres : ${JSON.stringify(ctx.simulationParams)}`;
    }
  }
  if (ctx.learningMode === "help") {
    prompt += `\n\nMODE AIDE-MOI : L'élève veut des indices progressifs. Ne donne pas la réponse directement. Commence par un indice, puis laisse-le chercher.`;
  }
  return prompt;
}
