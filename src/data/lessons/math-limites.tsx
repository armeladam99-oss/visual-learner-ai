"use client";

import type { LessonSection } from "@/types/lessons";
import { InteractiveGraph, GraphExplainer } from "@/components/visual/InteractiveGraph";
import {
  FormulaCard,
  ConceptCard,
  MethodCard,
  ExampleStep,
} from "@/components/visual/FormulaCard";
import { MiniTest } from "@/components/visual/MiniTest";
import { DrawMePanel } from "@/components/visual/DrawMePanel";
import { ProfessionalAITutor } from "@/components/visual/ProfessionalAITutor";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";

function rempvData(params: Record<string, number>) {
  const a = params.a ?? 1;
  const b = params.b ?? 0;
  const points = [];
  for (let x = -10; x <= 10; x += 0.1) {
    if (Math.abs(x) < 0.05) continue;
    const y = (a * x * x + b) / x;
    if (Math.abs(y) < 50) {
      points.push({ x: Math.round(x * 100) / 100, y: Math.round(y * 100) / 100 });
    }
  }
  return points;
}

export function getMathLimitesSections(): LessonSection[] {
  return [
    {
      id: "why-study",
      type: "why-study",
      title: "Pourquoi étudier cette leçon ?",
      icon: "🌍",
      content: (
        <div className="space-y-4 text-sm leading-relaxed text-muted-foreground">
          <p>
            Les <strong className="text-foreground">limites</strong> sont le fondement de
            l&apos;analyse mathématique. C&apos;est grâce à elles qu&apos;on peut définir la
            continuité, la dérivée, l&apos;intégrale et les équations différentielles.
          </p>
          <ConceptCard icon="🔗" title="Pourquoi c'est essentiel en 2ème BAC" variant="info">
            <p>
              La notion de limite est le <strong>point de départ</strong> de presque tout le
              programme de maths de 2ème BAC. Sans elle, on ne peut pas comprendre la
              dérivée (limite du taux d&apos;accroissement), ni la continuité, ni les suites numériques.
            </p>
          </ConceptCard>
          <ConceptCard icon="🔬" title="Applications concrètes" variant="tip">
            <p>
              En physique, les limites permettent de calculer des vitesses instantanées
              (limite du rapport d&apos;accroissement). En informatique, elles servent à
              analyser la complexité des algorithmes (notation Grand O). En économie,
              elles modélisent les rendements marginaux.
            </p>
          </ConceptCard>
        </div>
      ),
    },
    {
      id: "objectives",
      type: "objectives",
      title: "Objectifs",
      icon: "🎯",
      content: (
        <div className="space-y-3">
          {[
            "Calculer des limites finies et infinies",
            "Utiliser les opérations sur les limites",
            "Déterminer la continuité d'une fonction en un point",
            "Appliquer le théorème des valeurs intermédiaires",
            "Étudier la continuité d'une fonction composée",
          ].map((obj, i) => (
            <div key={i} className="flex items-start gap-3 rounded-lg bg-primary/[0.03] border border-primary/10 px-4 py-3">
              <span className="flex-shrink-0 w-6 h-6 rounded-full bg-primary text-primary-foreground text-xs font-bold flex items-center justify-center mt-0.5">{i + 1}</span>
              <p className="text-sm text-foreground/80">{obj}</p>
            </div>
          ))}
        </div>
      ),
    },
    {
      id: "prerequisites",
      type: "prerequisites",
      title: "Prérequis",
      icon: "🧠",
      content: (
        <div className="space-y-3">
          {[
            { label: "Notion de fonction et d'image", level: "maîtrisé" },
            { label: "Opérations sur les réels", level: "maîtrisé" },
            { label: "Déterminer un signe", level: "maîtrisé" },
          ].map((prereq, i) => (
            <div key={i} className="flex items-center gap-3 rounded-lg border border-border/50 bg-card px-4 py-3">
              <span className="text-lg">✅</span>
              <span className="text-sm text-foreground/80">{prereq.label}</span>
              <Badge variant="default" className="ml-auto text-[10px]">{prereq.level}</Badge>
            </div>
          ))}
        </div>
      ),
    },
    {
      id: "intro",
      type: "intro",
      title: "Introduction intuitive",
      icon: "📖",
      content: (
        <div className="space-y-4 text-sm leading-relaxed text-muted-foreground">
          <p>
            Que se passe-t-il quand x tend vers un nombre a, sans jamais être égal à a ?
            C&apos;est la question centrale des <strong className="text-foreground">limites</strong>.
          </p>
          <p>
            Prenons la fonction <code className="text-xs bg-muted px-1 rounded">f(x) = (x² − 1)/(x − 1)</code>.
            On ne peut pas calculer f(1) directement (division par zéro). Mais que se passe-t-il
            quand x se rapproche de 1 ?
          </p>
          <div className="grid gap-3 sm:grid-cols-2 py-2">
            <Card className="border-border/50 bg-muted/30 py-3">
              <CardContent className="text-center space-y-1 px-3">
                <p className="text-xs text-muted-foreground">x = 0.9 → f(x) = 1.9</p>
                <p className="text-xs text-muted-foreground">x = 0.99 → f(x) = 1.99</p>
                <p className="text-xs text-muted-foreground">x = 0.999 → f(x) = 1.999</p>
              </CardContent>
            </Card>
            <Card className="border-border/50 bg-muted/30 py-3">
              <CardContent className="text-center space-y-1 px-3">
                <p className="text-xs text-muted-foreground">x = 1.1 → f(x) = 2.1</p>
                <p className="text-xs text-muted-foreground">x = 1.01 → f(x) = 2.01</p>
                <p className="text-xs text-muted-foreground">x = 1.001 → f(x) = 2.001</p>
              </CardContent>
            </Card>
          </div>
          <p className="text-center text-sm font-semibold text-primary">
            lim x→1 f(x) = 2
          </p>
        </div>
      ),
    },
    {
      id: "course",
      type: "course",
      title: "Cours complet",
      icon: "📚",
      content: (
        <div className="space-y-6">
          <div className="space-y-3">
            <h3 className="text-sm font-bold text-foreground">Définition de la limite</h3>
            <p className="text-sm text-muted-foreground leading-relaxed">
              On dit que <strong className="text-foreground">lim x→a f(x) = L</strong> si,
              quand x se rapproche de a (sans lui être égal), f(x) se rapproche de L.
            </p>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Définition ε-δ : ∀ε &gt; 0, ∃δ &gt; 0 tel que : 0 &lt; |x − a| &lt; δ ⟹ |f(x) − L| &lt; ε
            </p>
          </div>

          <div className="space-y-3">
            <h3 className="text-sm font-bold text-foreground">Limites infinies</h3>
            <p className="text-sm text-muted-foreground leading-relaxed">
              On dit que lim x→+∞ f(x) = +∞ si f(x) croît sans borne quand x croît.
            </p>
          </div>

          <div className="space-y-3">
            <h3 className="text-sm font-bold text-foreground">Opérations sur les limites</h3>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Si lim x→a f(x) = L et lim x→a g(x) = L&apos;, alors :
            </p>
          </div>

          <ConceptCard icon="✅" title="Continuité" variant="tip">
            <p>
              Une fonction f est <strong>continue en a</strong> si : lim x→a f(x) = f(a).
              C&apos;est-à-dire : la limite existe, elle est finie, et elle est égale à l&apos;image de a.
            </p>
            <p>
              Les fonctions usuelles (polynômes, fractions rationnelles, fonctions usuelles)
              sont continues sur leur ensemble de définition.
            </p>
          </ConceptCard>

          <ConceptCard icon="📐" title="Théorème des valeurs intermédiaires (TVI)" variant="info">
            <p>
              Si f est continue sur [a, b] et si f(a) &lt; k &lt; f(b) (ou f(b) &lt; k &lt; f(a)),
              alors il existe au moins un réel c ∈]a, b[ tel que f(c) = k.
            </p>
            <p>
              <strong>Conséquence :</strong> Si f est continue sur [a, b] et si f(a) et f(b)
              sont de signes contraires, alors il existe au moins un réel c ∈]a, b[ tel que f(c) = 0.
            </p>
          </ConceptCard>
        </div>
      ),
    },
    {
      id: "visualization",
      type: "visualization",
      title: "Visualisation interactive",
      icon: "📊",
      content: (
        <div className="space-y-6">
          <InteractiveGraph
            title="Explorer la fonction f(x) = (ax² + b)/x"
            description="Modifie a et b pour observer le comportement de la fonction autour de x = 0."
            params={[
              { name: "Coefficient a", symbol: "a", min: -3, max: 3, step: 0.1, defaultValue: 1 },
              { name: "Constante b", symbol: "b", min: -5, max: 5, step: 0.5, defaultValue: -1 },
            ]}
            computePoints={rempvData}
            xLabel="x"
            yLabel="f(x)"
            color="#4f46e5"
          />

          <GraphExplainer
            items={[
              "L'axe horizontal représente x, l'axe vertical f(x).",
              "En x = 0, la fonction n'est pas définie (division par zéro).",
              "Malgré l'indétermination, la limite en 0 existe : c'est la valeur vers laquelle f(x) tend.",
              "Si a > 0 et b < 0, la courbe a une branche qui monte à gauche et descend à droite.",
              "La pente de la courbe loin de 0 tend vers a (comportement asymptotique).",
            ]}
          />
        </div>
      ),
    },
    {
      id: "graph-explanation",
      type: "graph-explanation",
      title: "Interprétation de la limite",
      icon: "🔎",
      content: (
        <div className="space-y-4 text-sm text-muted-foreground leading-relaxed">
          <ConceptCard icon="🔍" title="Limite à droite et à gauche" variant="info">
            <p>
              La <strong>limite à droite</strong> lim x→a⁺ f(x) étudie f(x) quand x &gt; a
              et x tend vers a.<br />
              La <strong>limite à gauche</strong> lim x→a⁻ f(x) étudie f(x) quand x &lt; a
              et x tend vers a.<br />
              La limite existe si et seulement si les deux limites partielles existent et sont égales.
            </p>
          </ConceptCard>
          <ConceptCard icon="🔍" title="Limite infinie" variant="info">
            <p>
              Quand x tend vers +∞, on regarde le comportement de f(x) pour des valeurs
              de x très grandes. Par exemple, lim x→+∞ (3x² + 1)/(x² − 2) = 3 car les termes
              de plus haut degré dominent.
            </p>
          </ConceptCard>
        </div>
      ),
    },
    {
      id: "formulas",
      type: "formulas",
      title: "Formules importantes",
      icon: "📐",
      content: (
        <FormulaCard
          title="Formules de limites"
          variant="highlighted"
          formulas={[
            { name: "Limite d'un polynôme", expression: "lim x→a P(x) = P(a)" },
            { name: "Limite d'une fraction", expression: "lim x→a P(x)/Q(x) = P(a)/Q(a) si Q(a) ≠ 0" },
            { name: "Limite en +∞ d'une fraction rationnelle", expression: "lim x→+∞ P(x)/Q(x) = rapport des coefficients dominant" },
            { name: "Continuité", expression: "f continue en a ⟺ lim x→a f(x) = f(a)" },
          ]}
        />
      ),
    },
    {
      id: "methods",
      type: "methods",
      title: "Méthodes",
      icon: "🧠",
      content: (
        <div className="space-y-4">
          <MethodCard
            number={1}
            title="Calculer une limite en un point"
            steps={[
              "Chercher si on peut simplifier l'expression (factoriser, developper)",
              "Si la substitution directe donne 0/0 : factoriser ou développer puis simplifier",
              "Si la substitution fonctionne directement : c'est la réponse",
              "Vérifier que la fonction est définie autour du point",
            ]}
          />
          <MethodCard
            number={2}
            title="Calculer une limite en +∞ ou −∞"
            steps={[
              "Diviser numérateur et dénominateur par la plus grande puissance de x",
              "Les termes en 1/x^n tendent vers 0 quand x → +∞",
              "Simplifier et calculer",
            ]}
          />
        </div>
      ),
    },
    {
      id: "guided-example",
      type: "guided-example",
      title: "Exemple guidé",
      icon: "✏️",
      content: (
        <div className="space-y-4">
          <Card className="border-border/50 bg-muted/30">
            <CardContent className="p-4">
              <p className="text-sm font-medium text-foreground">📝 Énoncé</p>
              <p className="text-sm text-muted-foreground">
                Calculer lim x→2 (x² − 4)/(x − 2)
              </p>
            </CardContent>
          </Card>
          <div className="space-y-1">
            <ExampleStep step={1} title="Tentative de substitution" content={<p className="text-muted-foreground">f(2) = (4 − 4)/(2 − 2) = 0/0 → <strong className="text-foreground">indétermination</strong></p>} />
            <ExampleStep step={2} title="Factoriser" content={<p className="text-muted-foreground">(x² − 4) = (x − 2)(x + 2). Donc (x² − 4)/(x − 2) = <strong className="text-foreground">x + 2</strong> pour x ≠ 2</p>} />
            <ExampleStep step={3} title="Calculer la limite" isLast content={<p className="text-muted-foreground">lim x→2 (x + 2) = <strong className="text-foreground">4</strong></p>} />
          </div>
        </div>
      ),
    },
    {
      id: "hard-example",
      type: "hard-example",
      title: "Exemple difficile",
      icon: "🔥",
      content: (
        <div className="space-y-4">
          <Card className="border-accent/30 bg-accent/[0.03]">
            <CardContent className="p-4">
              <p className="text-sm font-medium text-foreground">🔥 Exercice avancé</p>
              <p className="text-sm text-muted-foreground">
                Calculer lim x→+∞ (√(x² + 3x) − x)
              </p>
            </CardContent>
          </Card>
          <div className="space-y-1">
            <ExampleStep step={1} title="Multiplier par le conjugué" content={<p className="text-muted-foreground">(√(x² + 3x) − x) × (√(x² + 3x) + x) / (√(x² + 3x) + x) = (x² + 3x − x²) / (√(x² + 3x) + x)</p>} />
            <ExampleStep step={2} title="Simplifier" content={<p className="text-muted-foreground">= 3x / (√(x² + 3x) + x)</p>} />
            <ExampleStep step={3} title="Diviser par x" isLast content={<p className="text-muted-foreground">= 3 / (√(1 + 3/x) + 1) → 3/(1 + 1) = <strong className="text-foreground">3/2</strong> quand x → +∞</p>} />
          </div>
        </div>
      ),
    },
    {
      id: "common-mistakes",
      type: "common-mistakes",
      title: "Erreurs fréquentes",
      icon: "⚠️",
      content: (
        <div className="space-y-3">
          {[
            { mistake: "Confondre f(a) et la limite", fix: "La limite ex研究 x → a sans que x soit égal à a. f(a) peut exister sans que la limite n'existe." },
            { mistake: "Dire que 0/0 = 1 ou 0", fix: "0/0 est une indétermination, pas une valeur. Il faut simplifier l'expression." },
            { mistake: "Oublier les limites à droite et à gauche", fix: "La limite existe seulement si les deux limites partielles sont égales." },
          ].map((item, i) => (
            <Card key={i} className="border-red-100 bg-red-50/30 py-3">
              <CardContent className="px-4 space-y-1">
                <p className="text-sm font-medium text-red-700 flex items-center gap-2">
                  <span className="text-red-500">✗</span> {item.mistake}
                </p>
                <p className="text-xs text-red-600/80 flex items-start gap-2">
                  <span className="text-emerald-500 mt-0.5">✓</span> {item.fix}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      ),
    },
    {
      id: "exercises",
      type: "exercises",
      title: "Exercices progressifs",
      icon: "📝",
      content: (
        <div className="space-y-4">
          {[
            {
              level: "Fondamental",
              questions: [
                "Calculer lim x→3 (x² − 9)/(x − 3)",
                "Calculer lim x→+∞ (2x + 1)/(3x − 5)",
              ],
            },
            {
              level: "Intermédiaire",
              questions: [
                "Calculer lim x→0 sin(x)/x",
                "Calculer lim x→1 (x³ − 1)/(x − 1)",
                "Montrer que la fonction f(x) = 1/x n'est pas continue en 0",
              ],
            },
          ].map((group, gi) => (
            <Card key={gi} className="border-border/50 bg-card py-4">
              <CardContent className="px-5 space-y-3">
                <Badge variant="secondary">{group.level}</Badge>
                <ol className="space-y-2 text-sm text-muted-foreground">
                  {group.questions.map((q, qi) => (
                    <li key={qi} className="flex gap-2">
                      <span className="font-mono text-xs text-muted-foreground/60">{gi + 1}.{qi + 1}</span>
                      {q}
                    </li>
                  ))}
                </ol>
              </CardContent>
            </Card>
          ))}
        </div>
      ),
    },
    {
      id: "ask-ai",
      type: "ask-ai",
      title: "Demander au Prof IA",
      icon: "🤖",
      content: <ProfessionalAITutor subject="Mathématiques — Limites" subjectKey="math" />,
    },
    {
      id: "draw-me",
      type: "draw-me",
      title: "Dessine-moi",
      icon: "✏️",
      content: (
        <DrawMePanel
          subject="math"
          options={[
            { label: "Courbe de f(x) = (ax²+b)/x", icon: "📈", description: "Observe le comportement autour de 0", variant: "parabole" },
            { label: "Tableau de signe", icon: "📊", description: "Signe de f(x) autour de la singularité", variant: "discriminant" },
          ]}
        />
      ),
    },
    {
      id: "mini-test",
      type: "mini-test",
      title: "Mini-test",
      icon: "🧪",
      content: (
        <MiniTest
          questions={[
            {
              question: "lim x→2 (x² − 4)/(x − 2) = ?",
              options: ["0", "2", "4", "∞"],
              correctIndex: 2,
              explanation: "On factorise : (x−2)(x+2)/(x−2) = x+2. Donc lim = 2+2 = 4.",
            },
            {
              question: "Si lim x→a f(x) = L, alors f est continue en a si :",
              options: ["f(a) = 0", "f(a) = L", "f(a) existe seulement", "La dérivée existe"],
              correctIndex: 1,
              explanation: "La continuité exige que la limite existe, soit finie, et égale à f(a).",
            },
            {
              question: "lim x→+∞ (3x² + 1)/(x² − 2) = ?",
              options: ["0", "1", "3", "+∞"],
              correctIndex: 2,
              explanation: "On divise par x² : (3 + 1/x²)/(1 − 2/x²) → 3/1 = 3.",
            },
          ]}
        />
      ),
    },
    {
      id: "summary",
      type: "summary",
      title: "Résumé",
      icon: "📋",
      content: (
        <Card className="border-border/50 bg-muted/30">
          <CardContent className="p-5">
            <ul className="text-sm text-muted-foreground space-y-1">
              <li>• La <strong>limite</strong> décrit le comportement de f(x) quand x tend vers un point</li>
              <li>• <strong>0/0</strong> est une indétermination → factoriser ou développer</li>
              <li>• <strong>Continuité en a</strong> ⟺ lim x→a f(x) = f(a)</li>
              <li>• Le <strong>TVI</strong> garantit l&apos;existence de racines sur un intervalle</li>
              <li>• Les fonctions usuelles sont continues sur leur domaine</li>
            </ul>
          </CardContent>
        </Card>
      ),
    },
    {
      id: "next-steps",
      type: "next-steps",
      title: "Que faut-il réviser ensuite ?",
      icon: "🔄",
      content: (
        <div className="space-y-3">
          {[
            { topic: "Dérivation et étude de fonctions", description: "La dérivée est définie comme une limite du taux d'accroissement.", icon: "📈" },
            { topic: "Suites numériques", description: "Les limites de suites utilisent les mêmes techniques.", icon: "🔢" },
            { topic: "Fonctions exponentielles", description: "L'exponentielle est la dérivée d'elle-même, grâce à la limite (1+x/n)^n.", icon: "𝑒" },
          ].map((item, i) => (
            <Card key={i} className="border-border/50 bg-card py-3 hover:border-primary/20 transition-colors">
              <CardContent className="flex items-start gap-3 px-4">
                <span className="text-xl">{item.icon}</span>
                <div>
                  <p className="text-sm font-semibold text-foreground">{item.topic}</p>
                  <p className="text-xs text-muted-foreground mt-0.5">{item.description}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ),
    },
  ];
}
