"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Bot, Send, Sparkles, Brain, Atom, FlaskConical, Calculator, Lightbulb, ChevronDown, Loader2, Wifi, WifiOff } from "lucide-react";
import { useAction } from "convex/react";
import { api } from "@/convex/_generated/api";

interface ExpertProfile {
  name: string;
  title: string;
  icon: React.ReactNode;
  color: string;
  gradient: string;
  expertise: string[];
}

const experts: Record<string, ExpertProfile> = {
  math: {
    name: "Prof. Euler",
    title: "Spécialiste Mathématiques",
    icon: <Calculator className="size-5" />,
    color: "#4f46e5",
    gradient: "from-indigo-500/10 to-violet-500/5",
    expertise: ["Analyse", "Algèbre", "Géométrie", "Probabilités"],
  },
  physics: {
    name: "Prof. Newton",
    title: "Spécialiste Physique",
    icon: <Atom className="size-5" />,
    color: "#059669",
    gradient: "from-emerald-500/10 to-teal-500/5",
    expertise: ["Mécanique", "Électricité", "Optique", "Thermodynamique"],
  },
  chemistry: {
    name: "Prof. Curie",
    title: "Spécialiste Chimie",
    icon: <FlaskConical className="size-5" />,
    color: "#d97706",
    gradient: "from-amber-500/10 to-orange-500/5",
    expertise: ["Acido-basique", "Cinétique", "Nucléaire", "Organique"],
  },
};

interface KnowledgeEntry {
  keywords: string[];
  response: string;
  followUp?: string[];
}

const knowledgeBase: Record<string, KnowledgeEntry[]> = {
  math: [
    {
      keywords: ["dérivée", "derivée", "pente", "tangente"],
      response: `La **dérivée** d'une fonction f en un point x₀ est la **pente de la tangente** à la courbe en ce point.

**Définition :**
f'(x₀) = lim[h→0] (f(x₀+h) − f(x₀)) / h

**Interprétation graphique :**
• Si f'(x₀) > 0 → f est croissante en x₀
• Si f'(x₀) < 0 → f est décroissante en x₀
• Si f'(x₀) = 0 → extremum local (maximum ou minimum)

**Règles pratiques :**
• (xⁿ)' = n·xⁿ⁻¹
• (sin x)' = cos x
• (eˣ)' = eˣ
• (u·v)' = u'·v + u·v'`,
      followUp: ["Montre-moi un exemple concret", "Qu'est-ce qu'une dérivée seconde ?"],
    },
    {
      keywords: ["polynôme", "parabole", "seconde", "deuxième degré", "quadratique"],
      response: `Un **polynôme du second degré** s'écrit :
**f(x) = ax² + bx + c** avec a ≠ 0

**Discriminant :** Δ = b² − 4ac

• **Δ > 0** : deux racines distinctes x₁ = (−b − √Δ)/(2a) et x₂ = (−b + √Δ)/(2a)
• **Δ = 0** : une racine double x₀ = −b/(2a)
• **Δ < 0** : aucune racine réelle

**Géométrie :**
• Le sommet est S(−b/(2a) ; −Δ/(4a))
• Axe de symétrie : x = −b/(2a)
• Si a > 0 → parabole orientée vers le haut (minimum)
• Si a < 0 → parabole orientée vers le bas (maximum)`,
      followUp: ["Comment calculer le discriminant ?", "Montre-moi une parabole interactive"],
    },
    {
      keywords: ["intégrale", "primitive", "aire", "surface"],
      response: `L'**intégrale** est l'opération inverse de la dérivée.

**Définition :**
∫[a,b] f(x)dx = aire sous la courbe entre a et b

**Primitive :**
F est primitive de f si F'(x) = f(x)
On note ∫f(x)dx = F(x) + C

**Règles pratiques :**
• ∫xⁿdx = xⁿ⁺¹/(n+1) + C (n ≠ −1)
• ∫eˣdx = eˣ + C
• ∫sin x dx = −cos x + C
• ∫(1/x)dx = ln|x| + C`,
      followUp: ["Lien entre intégrale et aire", "Comment intégrer par parties ?"],
    },
    {
      keywords: ["probabilité", "hasard", "événement", "chipage"],
      response: `Les **probabilités** mesurent la chance qu'un événement se produise.

**Définition :**
P(A) = nombre de cas favorables / nombre de cas total

**Formules essentielles :**
• P(Ā) = 1 − P(A)
• P(A∪B) = P(A) + P(B) − P(A∩B)
• Événements incompatibles : P(A∩B) = 0
• Événements indépendants : P(A∩B) = P(A) × P(B)

**Loi binomale :**
P(X = k) = C(n,k) × pᵏ × (1−p)ⁿ⁻ᵏ`,
      followUp: ["Explique la loi des grands nombres", "Quelle différence entre combinaison et permutation ?"],
    },
    {
      keywords: ["suite", "terme", "récurrence", "limite", "convergence"],
      response: `Une **suite** est une fonction de ℕ dans ℝ, notée (uₙ).

**Définition par récurrence :**
• u₀ = valeur initiale
• uₙ₊₁ = f(uₙ)

**Propriétés :**
• Croissante si uₙ₊₁ ≥ uₙ pour tout n
• Majorée s'il existe M tel que uₙ ≤ M pour tout n
• Si (uₙ) est croissante et majorée → elle converge

**Exemples classiques :**
• uₙ = 2ⁿ → diverge
• uₙ = 1/n → converge vers 0
• uₙ = (n+1)/n → converge vers 1`,
      followUp: ["Montre-moi la convergence graphiquement", "Qu'est-ce qu'une suite géométrique ?"],
    },
  ],
  physics: [
    {
      keywords: ["mouvement", "vitesse", "accélération", "cinématique", "position"],
      response: `La **cinématique** décrit le mouvement sans s'occuper des causes.

**Mouvement rectiligne uniforme (MRU) :**
• v = constante, a = 0
• x(t) = x₀ + v·t → courbe linéaire sur x(t)

**Mouvement uniformément varié (MUV) :**
• a = constante ≠ 0
• x(t) = ½at² + v₀t + x₀ → parabole
• v(t) = at + v₀ → droite

**Liens :**
• v(t) = dx/dt (dérivée de la position)
• a(t) = dv/dt (dérivée de la vitesse)
• La surface sous v(t) = distance parcourue

**Unités :**
x en mètres (m), v en m/s, a en m/s²`,
      followUp: ["Montre les graphiques x(t) et v(t)", "Comment convertir km/h en m/s ?"],
    },
    {
      keywords: ["force", "newton", "dynamique", "poids", "réaction"],
      response: `La **dynamique** étudie les causes du mouvement (les forces).

**2e loi de Newton :**
**F⃗ = m·a⃗**
La force est proportionnelle à l'accélération.

**Forces courantes :**
• Poids : P⃗ = m·g⃗ (g = 9,81 m/s² vers le bas)
• Régime permanent : F⃗_rés = 0 → v = constante

**Bilan des forces :**
1. Identifier le système
2. Dessiner le corps isolé
3. Repérer toutes les forces
4. Appliquer F⃗ = ma⃗`,
      followUp: ["Dessine un diagramme de forces", "Explique la 3e loi de Newton"],
    },
    {
      keywords: ["circuit", "courant", "tension", "résistance", "ohm"],
      response: `Un **circuit électrique** est un chemin fermé pour le courant.

**Loi d'Ohm :**
**U = R·I** (tension = résistance × courant)

**Résistances en série :**
R_éq = R₁ + R₂ + R₃ + ...

**Résistances en parallèle :**
1/R_éq = 1/R₁ + 1/R₂ + ...

**Puissance :**
P = U·I = R·I² = U²/R (en Watts)

**Loi des mailles :** ΣU = 0
**Loi des nœuds :** ΣI = 0`,
      followUp: ["Montre un schéma de circuit", "Quelle différence série/parallèle ?"],
    },
    {
      keywords: ["énergie", "travail", "cinétique", "potentielle", "conservation"],
      response: `**Énergie cinétique :** Eₖ = ½mv²
L'énergie liée au mouvement.

**Énergie potentielle de pesanteur :** Eₚ = mgh
L'énergie liée à la hauteur.

**Théorème de l'énergie cinétique :**
W(F) = ΔEₖ = Eₖ(final) − Eₖ(initial)

**Conservation de l'énergie mécanique :**
Si pas de frottements : Eₘ = Eₖ + Eₚ = constante
→ ½mv² + mgh = constante`,
      followUp: ["Applique à un pendule", "Et avec les frottements ?"],
    },
    {
      keywords: ["onde", "fréquence", "longueur", "amplitude", "son"],
      response: `Une **onde** transporte de l'énergie sans transport de matière.

**Grandeurs :**
• λ (lambda) : longueur d'onde en m
• f : fréquence en Hz
• T : période en s (T = 1/f)
• v : vitesse en m/s

**Relation fondamentale :**
**v = λ × f**

**Onde progressive :**
y(x,t) = A·sin(2π(x/λ − t/T))

**Onde stationnaire :**
Superposition de deux ondes de même amplitude et fréquence en sens inverse.`,
      followUp: ["Montre une onde animée", "Différence onde mécanique/électromagnétique ?"],
    },
  ],
  chemistry: [
    {
      keywords: ["pH", "acide", "base", "dosage", "acido-basique"],
      response: `Le **pH** mesure l'acidité d'une solution.

**Formule :**
**pH = −log[H₃O⁺]**

**Échelle :**
• pH < 7 : acide (HCl, citron)
• pH = 7 : neutre (eau pure)
• pH > 7 : basique (lessive, savon)

**Relation :** pH + pOH = 14 (à 25°C)

**Dosage acido-basique :**
• C_acide × V_acide = C_base × V_base
• Point d'équivalence : n_acide = n_base
• Courbe de titrage : zone de brusque variation au point d'équivalence`,
      followUp: ["Montre une courbe de dosage", "Acide fort vs acide faible ?"],
    },
    {
      keywords: ["cinétique", "vitesse", "réaction", "température", "catalyseur"],
      response: `La **cinétique chimique** étudie la vitesse des réactions.

**Vitesse de réaction :**
v = |ΔC/Δt| = variation de concentration / durée

**Facteurs qui accélèrent :**
• Augmenter la température (+10°C ≈ vitesse × 2)
• Augmenter la concentration
• Ajouter un catalyseur
• Augmenter la surface de contact

**Suivi temporel :**
Concentration en fonction du temps → courbe décroissante
• Réaction d'ordre 0 : C(t) = C₀ − kt (linéaire)
• Réaction d'ordre 1 : C(t) = C₀·e⁻ᵏᵗ (exponentielle)

**Demi-vie :** temps pour que la concentration soit divisée par 2`,
      followUp: ["Montre une courbe de cinétique", "Qu'est-ce qu'un catalyseur ?"],
    },
    {
      keywords: ["nucléaire", "radioactivité", "désintégration", "atome", "isotope"],
      response: `La **radioactivité** est la désintégration spontanée de certains noyaux atomiques.

**3 types de radioactivité :**
• **α (alpha)** : émission d'un noyau d'hélium (²⁴He) → pénétration faible
• **β⁻ (bêta moins)** : émission d'un électron → pénétration moyenne
• **γ (gamma)** : émission de photons → forte pénétration

**Désintégration :**
N(t) = N₀ · 2^(−t/T½)
où T½ = demi-vie

**Énergie :**
E = mc² (Einstein)
La masse perdue est convertie en énergie

**Applications :**
• Datation au carbone 14 (T½ = 5730 ans)
• Médical : radiothérapie, imagerie
• Énergie : centrales nucléaires`,
      followUp: ["Montre la désintégration radioactive", "Quelle différence fission/fusion ?"],
    },
    {
      keywords: ["solution", "concentration", "dilution", "mol", "solvant"],
      response: `Une **solution** est un mélange homogène d'un soluté dans un solvant.

**Concentration molaire :**
**C = n/V** (en mol/L)
où n = nombre de moles, V = volume en L

**Dilution :**
**C₁V₁ = C₂V₂**
Quand on ajoute du solvant, la concentration diminue.

**Degré de dilution :**
h = C/conc. molaire maximale
• h > 1 : solution concentrée
• h = 1 : solution saturée
• h < 1 : solution diluée

**Masse molaire :**
n = m/M (moles = masse / masse molaire)`,
      followUp: ["Montre une courbe de dilution", "Comment préparer une solution ?"],
    },
    {
      keywords: ["liaison", "molécule", "atome", "électron", "octet"],
      response: `Les **liaisons chimiques** maintiennent les atomes ensemble dans les molécules.

**3 types principaux :**
• **Ionique** : transfert d'électrons (NaCl) → solides cristallins
• **Covalente** : partage d'électrons (H₂O, CO₂) → molécules
• **Métallique** : bain d'électrons délocalisés (Fe, Cu) → métaux

**Règle de l'octet :**
Chaque atome tend à avoir 8 électrons sur sa couche externe (2 pour H).

**Structure de Lewis :**
Représentation des atomes avec leurs électrons de valence pour visualiser les liaisons.`,
      followUp: ["Dessine la structure de H₂O", "Liaison simple vs double vs triple ?"],
    },
  ],
};

interface Message {
  role: "user" | "assistant";
  content: string;
  followUp?: string[];
  timestamp: Date;
}

interface ProfessionalAITutorProps {
  subject: string;
  subjectKey: "math" | "physics" | "chemistry";
}

export function ProfessionalAITutor({ subject, subjectKey }: ProfessionalAITutorProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const expert = experts[subjectKey];
  const [aiConnected, setAiConnected] = useState<boolean | null>(null);

  // AI backend actions
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const groqChatAction = useAction((api as any).aiGroq?.groqChat) as ((args: { messages: { role: string; content: string }[] }) => Promise<{ response: string; spec: unknown; error?: string; connected: boolean }>) | null;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const groqStatusAction = useAction((api as any).aiGroq?.apiStatus) as (() => Promise<{ groq: boolean; gemini: boolean; connected: boolean }>) | null;

  // Check API status on mount
  useEffect(() => {
    const checkApi = async () => {
      try {
        if (groqStatusAction) {
          const result = await groqStatusAction();
          setAiConnected(result.connected);
        } else {
          setAiConnected(false);
        }
      } catch {
        setAiConnected(false);
      }
    };
    checkApi();
  }, [groqStatusAction]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const findBestResponse = (query: string): KnowledgeEntry | null => {
    const normalizedQuery = query.toLowerCase();
    const entries = knowledgeBase[subjectKey];
    let bestMatch: KnowledgeEntry | null = null;
    let bestScore = 0;

    for (const entry of entries) {
      let score = 0;
      for (const keyword of entry.keywords) {
        if (normalizedQuery.includes(keyword.toLowerCase())) {
          score += keyword.length;
        }
      }
      if (score > bestScore) {
        bestScore = score;
        bestMatch = entry;
      }
    }

    return bestScore > 0 ? bestMatch : null;
  };

  const handleSend = useCallback(async (text?: string) => {
    const query = text || input.trim();
    if (!query) return;

    const userMessage: Message = {
      role: "user",
      content: query,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsTyping(true);
    setShowSuggestions(false);

    // Try real AI first (Groq/Llama)
    if (groqChatAction) {
      try {
        const recentMessages = messages.slice(-10).map((m) => ({
          role: m.role,
          content: m.content,
        }));
        const systemContext = `Tu es ${expert.name}, ${expert.title}. Tu es un professeur IA pour les élèves de 2e année Bac au Maroc. Tu maîtrises ${expert.expertise.join(", ")}. Sois pédagogique, patient, et explique étape par étape. Utilise des emojis avec modération. Réponds toujours en français.`;

        const groqMessages = [
          { role: "user" as const, content: `[SYSTEM] ${systemContext}` },
          { role: "assistant" as const, content: "Compris, je suis prêt à aider !" },
          ...recentMessages,
          { role: "user" as const, content: query },
        ];

        const result = await groqChatAction({ messages: groqMessages });

        if (!result.error && result.response) {
          const assistantMessage: Message = {
            role: "assistant",
            content: result.response,
            timestamp: new Date(),
          };
          setMessages((prev) => [...prev, assistantMessage]);
          setIsTyping(false);
          setAiConnected(true);
          return;
        }
      } catch {
        // Fall through to local knowledge base
      }
    }

    // Fallback: local knowledge base (fast, no API needed)
    const match = findBestResponse(query);

    let response: string;
    let followUp: string[] | undefined;

    if (match) {
      response = match.response;
      followUp = match.followUp;
    } else {
      response = `Excellente question ! En tant que **${expert.name}**, voici mon analyse :

La question "${query}" touche un point important du programme. Je te conseille de :

1. **Revoir les formules** de base de cette section
2. **Examiner les graphiques interactifs** ci-dessus
3. **Tester ta compréhension** avec le mini-test

Pour des questions très spécifiques, n'hésite pas à reformuler ta demande avec des mots-clés du cours (comme "formule", "graphique", "démonstration", etc.).`;
      followUp = ["Reformule ma question", "Résume les formules clés"];
    }

    const assistantMessage: Message = {
      role: "assistant",
      content: response,
      followUp,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, assistantMessage]);
    setIsTyping(false);
  }, [input, messages, expert, groqChatAction]);

  const initialSuggestions = [
    "Explique-moi les formules essentielles",
    "Montre-moi un graphique interactif",
    "Quels sont les points clés du cours ?",
    "Aide-moi à résoudre un exercice",
    "Quelle est l'utilité dans la vie réelle ?",
    "Résume les erreurs fréquentes",
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <Card className="border-border/50 bg-card overflow-hidden shadow-sm">
        <CardHeader className={`bg-gradient-to-r ${expert.gradient} border-b border-border/30`}>
          <CardTitle className="text-base font-semibold flex items-center gap-3">
            <div
              className="w-10 h-10 rounded-xl flex items-center justify-center"
              style={{ backgroundColor: `${expert.color}15`, color: expert.color }}
            >
              {expert.icon}
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <span>🤖 Prof IA — {expert.name}</span>
                <Badge variant="secondary" className="text-[10px]">
                  {subject}
                </Badge>
              </div>
              <p className="text-xs font-normal text-muted-foreground mt-0.5">
                {expert.title} • {expert.expertise.join(" · ")}
                {aiConnected === true && <span className="ml-2 text-emerald-500">🟢 IA connectée</span>}
                {aiConnected === false && <span className="ml-2 text-amber-500">🔴 IA hors ligne</span>}
              </p>
            </div>
          </CardTitle>
        </CardHeader>

        <CardContent className="p-0">
          {/* Messages area */}
          <div className="max-h-[400px] overflow-y-auto p-4 space-y-4">
            {messages.length === 0 && (
              <div className="space-y-4">
                <div className="text-center py-4">
                  <div
                    className="w-16 h-16 rounded-2xl mx-auto flex items-center justify-center mb-3"
                    style={{ backgroundColor: `${expert.color}10`, color: expert.color }}
                  >
                    <Brain className="size-8" />
                  </div>
                  <h3 className="text-sm font-semibold text-foreground">
                    {expert.name} est prêt à t&apos;aider !
                  </h3>
                  <p className="text-xs text-muted-foreground mt-1 max-w-xs mx-auto">
                    Pose ta question ou clique sur une suggestion ci-dessous
                  </p>
                </div>

                {showSuggestions && (
                  <div className="flex flex-wrap gap-2 justify-center">
                    {initialSuggestions.map((q, i) => (
                      <Button
                        key={i}
                        variant="outline"
                        size="sm"
                        className="text-xs h-auto py-1.5 border-border/50 hover:border-primary/30"
                        onClick={() => handleSend(q)}
                      >
                        <Lightbulb className="size-3 mr-1" />
                        {q}
                      </Button>
                    ))}
                  </div>
                )}
              </div>
            )}

            <AnimatePresence>
              {messages.map((msg, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                  className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
                >
                  <div
                    className={`max-w-[85%] rounded-xl px-4 py-3 ${
                      msg.role === "user"
                        ? "bg-primary text-primary-foreground"
                        : "bg-muted/50 border border-border/30"
                    }`}
                  >
                    {msg.role === "assistant" && (
                      <div className="flex items-center gap-2 mb-2">
                        <div
                          className="w-5 h-5 rounded-md flex items-center justify-center"
                          style={{ backgroundColor: `${expert.color}20`, color: expert.color }}
                        >
                          {expert.icon}
                        </div>
                        <span className="text-[11px] font-semibold" style={{ color: expert.color }}>
                          {expert.name}
                        </span>
                      </div>
                    )}
                    <div className="text-sm leading-relaxed whitespace-pre-line">
                      {msg.content.split("**").map((part, j) =>
                        j % 2 === 1 ? (
                          <strong key={j} className={msg.role === "user" ? "text-primary-foreground" : "text-foreground"}>
                            {part}
                          </strong>
                        ) : (
                          <span key={j} className={msg.role === "user" ? "text-primary-foreground/90" : "text-muted-foreground"}>
                            {part}
                          </span>
                        )
                      )}
                    </div>

                    {msg.followUp && msg.role === "assistant" && (
                      <div className="flex flex-wrap gap-1.5 mt-3 pt-2 border-t border-border/20">
                        {msg.followUp.map((q, fi) => (
                          <Button
                            key={fi}
                            variant="ghost"
                            size="sm"
                            className="text-[11px] h-auto py-1 px-2"
                            onClick={() => handleSend(q)}
                          >
                            <Sparkles className="size-2.5 mr-1" />
                            {q}
                          </Button>
                        ))}
                      </div>
                    )}
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>

            {isTyping && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex gap-1 items-center text-muted-foreground text-sm pl-2"
              >
                <span className="font-medium text-xs" style={{ color: expert.color }}>
                  {expert.name}
                </span>
                <span>réfléchit</span>
                <span className="flex gap-0.5">
                  {[0, 1, 2].map((d) => (
                    <motion.span
                      key={d}
                      className="w-1 h-1 rounded-full"
                      style={{ backgroundColor: expert.color }}
                      animate={{ opacity: [0.3, 1, 0.3] }}
                      transition={{ duration: 1, repeat: Infinity, delay: d * 0.2 }}
                    />
                  ))}
                </span>
              </motion.div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Input area */}
          <div className="border-t border-border/30 p-4 space-y-3">
            <div className="flex gap-2">
              <Textarea
                placeholder={`Pose ta question à ${expert.name}...`}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                className="min-h-[60px] text-sm resize-none border-border/50"
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    handleSend();
                  }
                }}
              />
            </div>
            <div className="flex items-center justify-between">
              <p className="text-[10px] text-muted-foreground flex items-center gap-1">
                <Brain className="size-3" />
                {aiConnected === true ? "IA connectée — réponses en temps réel" : aiConnected === false ? "Mode hors ligne — réponses locales" : "Vérification de l'IA..."}
              </p>
              <Button
                onClick={() => handleSend()}
                disabled={!input.trim() || isTyping}
                className="text-sm"
                size="sm"
                style={{ backgroundColor: expert.color }}
              >
                {isTyping ? (
                  <span className="flex items-center gap-2">
                    <Loader2 className="size-3.5 animate-spin" />
                    Réflexion...
                  </span>
                ) : (
                  <span className="flex items-center gap-2">
                    <Send className="size-3.5" />
                    Envoyer
                  </span>
                )}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
