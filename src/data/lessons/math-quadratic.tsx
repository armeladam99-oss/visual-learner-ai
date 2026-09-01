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

function quadraticData(params: Record<string, number>) {
  const a = params.a ?? 1;
  const b = params.b ?? 0;
  const c = params.c ?? 0;
  const points = [];
  for (let x = -10; x <= 10; x += 0.2) {
    const y = a * x * x + b * x + c;
    if (Math.abs(y) < 100) {
      points.push({ x: Math.round(x * 100) / 100, y: Math.round(y * 100) / 100 });
    }
  }
  return points;
}

function derivativeData(params: Record<string, number>) {
  const a = params.a ?? 1;
  const b = params.b ?? 0;
  const points = [];
  for (let x = -10; x <= 10; x += 0.2) {
    const y = 2 * a * x + b;
    points.push({ x: Math.round(x * 100) / 100, y: Math.round(y * 100) / 100 });
  }
  return points;
}

function tangentAtPoint(a: number, b: number, c: number, x0: number) {
  // Tangent line at point x0
  const y0 = a * x0 * x0 + b * x0 + c;
  const slope = 2 * a * x0 + b;
  const points = [];
  for (let dx = -3; dx <= 3; dx += 0.5) {
    const x = x0 + dx;
    const y = y0 + slope * dx;
    points.push({ x: Math.round(x * 100) / 100, y: Math.round(y * 100) / 100 });
  }
  return { points, slope, y0 };
}

export function getMathQuadraticSections(): LessonSection[] {
  return [
    // 1. Pourquoi étudier cette leçon ?
    {
      id: "why-study",
      type: "why-study",
      title: "Pourquoi étudier cette leçon ?",
      icon: "🌍",
      content: (
        <div className="space-y-4 text-sm leading-relaxed text-muted-foreground">
          <p>
            Les <strong className="text-foreground">polynômes du second degré</strong> et les{" "}
            <strong className="text-foreground">fonctions du second degré</strong> sont une
            des notions les plus fondamentales des mathématiques du lycée. Elles
            apparaissent dès la classe de seconde et se retrouvent dans quasiment
            toutes les spécialités scientifiques du bac.
          </p>
          <div className="grid gap-3 sm:grid-cols-2">
            <ConceptCard icon="🔬" title="En sciences" variant="info">
              <p>
                En physique, la trajectoire d&apos;un projectile (balle lancée, fusée)
                est une parabole. En chimie, certaines courbes de suivi temporel
                suivent un comportement quadratique. En biologie, des modèles de
                croissance peuvent être approximés par des polynômes.
              </p>
            </ConceptCard>
            <ConceptCard icon="💻" title="En technologies" variant="tip">
              <p>
                Les algorithmes d&apos;optimisation utilisent les dérivées des fonctions
                quadratiques. Les simulations physiques (jeux vidéo, robotique)
                calculent des trajectoires paraboliques en temps réel. La programmation
                graphique repose sur des équations de courbes.
              </p>
            </ConceptCard>
          </div>
          <ConceptCard icon="🔗" title="Liens avec d'autres chapitres" variant="info">
            <p>
              Cette leçon est liée aux <strong>équations du 2nd degré</strong> (seconde),
              aux <strong>déterminants</strong>, à la <strong>trigonométrie</strong> (identité
              trigonométrique liée au discriminant), et prépare l&apos;étude des{" "}
              <strong>fonctions dérivées</strong> en terminale.
            </p>
          </ConceptCard>
          <ConceptCard icon="🎓" title="Pour les études supérieures" variant="tip">
            <p>
              Les fonctions quadratiques sont omniprésentes en maths supérieures (classes
              prépa), en physique (mouvement uniformément varié), en économie (modèles
              d&apos;optimisation), en informatique (complexité algorithmique), et en
              ingénierie (résistance des matériaux).
            </p>
          </ConceptCard>
        </div>
      ),
    },

    // 2. Objectifs
    {
      id: "objectives",
      type: "objectives",
      title: "Objectifs",
      icon: "🎯",
      content: (
        <div className="space-y-3">
          {[
            "Écrire et reconnaître la forme générale d&apos;une fonction du second degré",
            "Calculer le discriminant et en déduire le nombre de racines",
            "Tracer la parabole représentative d&apos;une fonction",
            "Étudier le signe d&apos;un polynôme du second degré",
            "Interpréter graphiquement les paramètres a, b et c",
            "Résoudre des problèmes concrets utilisant les fonctions quadratiques",
          ].map((obj, i) => (
            <div
              key={i}
              className="flex items-start gap-3 rounded-lg bg-primary/[0.03] border border-primary/10 px-4 py-3"
            >
              <span className="flex-shrink-0 w-6 h-6 rounded-full bg-primary text-primary-foreground text-xs font-bold flex items-center justify-center mt-0.5">
                {i + 1}
              </span>
              <p className="text-sm text-foreground/80">{obj}</p>
            </div>
          ))}
        </div>
      ),
    },

    // 3. Prérequis
    {
      id: "prerequisites",
      type: "prerequisites",
      title: "Prérequis",
      icon: "🧠",
      content: (
        <div className="space-y-3">
          {[
            { label: "Opérations sur les nombres réels", level: "maîtrisé" },
            { label: "Notion de fonction et de courbe", level: "maîtrisé" },
            { label: "Résolution d&apos;équations du 1er degré", level: "maîtrisé" },
            { label: "Écriture dans une base", level: "utile" },
          ].map((prereq, i) => (
            <div
              key={i}
              className="flex items-center gap-3 rounded-lg border border-border/50 bg-card px-4 py-3"
            >
              <span className="text-lg">
                {prereq.level === "maîtrisé" ? "✅" : "💡"}
              </span>
              <span className="text-sm text-foreground/80">{prereq.label}</span>
              <Badge
                variant={prereq.level === "maîtrisé" ? "default" : "secondary"}
                className="ml-auto text-[10px]"
              >
                {prereq.level}
              </Badge>
            </div>
          ))}
        </div>
      ),
    },

    // 4. Introduction intuitive
    {
      id: "intro",
      type: "intro",
      title: "Introduction intuitive",
      icon: "📖",
      content: (
        <div className="space-y-4 text-sm leading-relaxed">
          <p className="text-muted-foreground">
            Imagine que tu lances une balle en l&apos;air. Elle monte, atteint un point
            maximum, puis redescend. La trajectoire qu&apos;elle décrit est une{" "}
            <strong className="text-foreground">parabole</strong> — la courbe
            caractéristique d&apos;une fonction du second degré.
          </p>
          <p className="text-muted-foreground">
            Plus formellement, une fonction du second degré est de la forme :
          </p>
          <div className="flex justify-center py-4">
            <code className="text-lg font-mono font-bold text-primary bg-primary/5 px-6 py-3 rounded-xl border border-primary/10">
              f(x) = ax² + bx + c
            </code>
          </div>
          <p className="text-muted-foreground">
            où <strong className="text-foreground">a</strong>,{" "}
            <strong className="text-foreground">b</strong> et{" "}
            <strong className="text-foreground">c</strong> sont des nombres réels,
            avec <code className="text-xs bg-muted px-1 rounded">a ≠ 0</code>.
          </p>
          <p className="text-muted-foreground">
            Les trois paramètres contrôlent la forme de la courbe :{" "}
            <strong className="text-foreground">a</strong> détermine l&apos;ouverture et
            l&apos;orientation, <strong className="text-foreground">b</strong> influence la
            position du sommet, et <strong className="text-foreground">c</strong> est
            l&apos;ordonnée à l&apos;origine.
          </p>
        </div>
      ),
    },

    // 5. Cours complet
    {
      id: "course",
      type: "course",
      title: "Cours complet",
      icon: "📚",
      content: (
        <div className="space-y-6">
          <div className="space-y-3">
            <h3 className="text-sm font-bold text-foreground">
              La forme générale
            </h3>
            <p className="text-sm text-muted-foreground leading-relaxed">
              La fonction <code>f(x) = ax² + bx + c</code> est appelée{" "}
              <strong className="text-foreground">
                polynôme du second degré
              </strong>{" "}
              ou <strong className="text-foreground">
                fonction quadratique
              </strong>.
              Son graphique est une <strong className="text-foreground">parabole</strong>.
            </p>
          </div>

          <div className="grid gap-4 sm:grid-cols-3">
            <Card className="border-blue-200 bg-blue-50/50 py-4">
              <CardContent className="text-center space-y-2 px-4">
                <div className="text-2xl font-mono font-bold text-blue-600">a</div>
                <p className="text-xs text-blue-700/80">
                  <strong>Ouverture</strong> : a &gt; 0 → parabole tournée vers le haut ; a &lt; 0 → vers le bas.
                  <br />Plus |a| est grand, plus la parabole est étroite.
                </p>
              </CardContent>
            </Card>
            <Card className="border-emerald-200 bg-emerald-50/50 py-4">
              <CardContent className="text-center space-y-2 px-4">
                <div className="text-2xl font-mono font-bold text-emerald-600">b</div>
                <p className="text-xs text-emerald-700/80">
                  <strong>Position</strong> : b influe sur la position horizontale du sommet.
                  <br />Le sommet est en x = −b/(2a).
                </p>
              </CardContent>
            </Card>
            <Card className="border-amber-200 bg-amber-50/50 py-4">
              <CardContent className="text-center space-y-2 px-4">
                <div className="text-2xl font-mono font-bold text-amber-600">c</div>
                <p className="text-xs text-amber-700/80">
                  <strong>Ordonnée à l&apos;origine</strong> : c est la valeur de f(0).
                  <br />C&apos;est le point où la courbe coupe l&apos;axe des y.
                </p>
              </CardContent>
            </Card>
          </div>

          <div className="space-y-3">
            <h3 className="text-sm font-bold text-foreground">
              Le discriminant Δ
            </h3>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Le <strong className="text-foreground">discriminant</strong> permet de
              déterminer le nombre de racines réelles de l&apos;équation ax² + bx + c = 0 :
            </p>
            <div className="flex justify-center py-2">
              <code className="text-base font-mono font-bold text-primary bg-primary/5 px-5 py-2 rounded-lg border border-primary/10">
                Δ = b² − 4ac
              </code>
            </div>
            <div className="grid gap-3 sm:grid-cols-3 mt-4">
              {[
                {
                  delta: "Δ &gt; 0",
                  racines: "Deux racines réelles distinctes",
                  icon: "∩",
                  color: "emerald",
                },
                {
                  delta: "Δ = 0",
                  racines: "Une racine réelle double",
                  icon: "⊤",
                  color: "amber",
                },
                {
                  delta: "Δ &lt; 0",
                  racines: "Aucune racine réelle",
                  icon: "∅",
                  color: "red",
                },
              ].map((item, i) => (
                <Card
                  key={i}
                  className={`border-${item.color}-200 bg-${item.color}-50/50 py-3`}
                >
                  <CardContent className="text-center space-y-1 px-3">
                    <div className="text-2xl">{item.icon}</div>
                    <div className="text-sm font-mono font-bold">{item.delta}</div>
                    <p className="text-xs text-muted-foreground">
                      {item.racines}
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          <div className="space-y-3">
            <h3 className="text-sm font-bold text-foreground">
              Le sommet de la parabole
            </h3>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Le sommet est le point extréminimum (maximum ou minimum) de la parabole.
              Ses coordonnées sont :
            </p>
            <div className="flex justify-center py-2">
              <code className="text-sm font-mono font-semibold text-primary bg-primary/5 px-4 py-2 rounded-lg border border-primary/10">
                S = (−b/(2a) ; −Δ/(4a))
              </code>
            </div>
          </div>
        </div>
      ),
    },

    // 6. Visualisation
    {
      id: "visualization",
      type: "visualization",
      title: "Visualisation interactive",
      icon: "📊",
      content: (
        <div className="space-y-6">
          <InteractiveGraph
            title="Explore la parabole f(x) = ax² + bx + c"
            description="Modifie les paramètres a, b et c avec les curseurs pour observer l'effet sur la courbe."
            params={[
              { name: "Coefficient a", symbol: "a", min: -3, max: 3, step: 0.1, defaultValue: 1 },
              { name: "Coefficient b", symbol: "b", min: -6, max: 6, step: 0.5, defaultValue: -2 },
              { name: "Constante c", symbol: "c", min: -5, max: 5, step: 0.5, defaultValue: 1 },
            ]}
            computePoints={(p) => quadraticData(p)}
            xLabel="x"
            yLabel="f(x)"
            color="#4f46e5"
          />

          <GraphExplainer
            items={[
              "L'axe horizontal représente les valeurs de x (les abscisses).",
              "L'axe vertical représente les valeurs de f(x) (les ordonnées).",
              "Les unités sont les mêmes sur les deux axes (échelle en nombres réels).",
              "Le sommet de la parabole est le point le plus haut (si a < 0) ou le plus bas (si a > 0).",
              "La courbe est toujours symétrique par rapport à la verticale passant par le sommet.",
              "Si a > 0, la parabole est tournée vers le haut (minimum). Si a < 0, vers le bas (maximum).",
              "L'intersection avec l'axe des x (si elle existe) correspond aux racines de l'équation f(x) = 0.",
            ]}
          />
        </div>
      ),
    },

    // 7. Explication du graphique
    {
      id: "graph-explanation",
      type: "graph-explanation",
      title: "Interprétation des paramètres",
      icon: "🔎",
      content: (
        <div className="space-y-4 text-sm text-muted-foreground leading-relaxed">
          <p>
            Chaque paramètre de <code>f(x) = ax² + bx + c</code> modifie la courbe
            d&apos;une manière spécifique :
          </p>
          <ConceptCard icon="🔍" title="Effet de a sur la courbe" variant="info">
            <p>
              Quand <strong>a</strong> augmente (en valeur absolue), la parabole
              devient plus étroite. Quand <strong>a</strong> diminue, elle s&apos;élargit.
              Le signe de <strong>a</strong> détermine l&apos;orientation : positif = ouverture
              vers le haut (minimum), négatif = ouverture vers le bas (maximum).
            </p>
          </ConceptCard>
          <ConceptCard icon="🔍" title="Effet de b sur le sommet" variant="info">
            <p>
              Le paramètre <strong>b</strong> déplace le sommet horizontalement. La position
              du sommet est x = −b/(2a). Si b = 0, le sommet est sur l&apos;axe des y.
            </p>
          </ConceptCard>
          <ConceptCard icon="🔍" title="Effet de c sur l'intersection" variant="info">
            <p>
              Le paramètre <strong>c</strong> est l&apos;ordonnée à l&apos;origine. Il
              déplace toute la courbe vers le haut ou le bas sans changer sa forme.
            </p>
          </ConceptCard>
        </div>
      ),
    },

    // 8. Formules importantes
    {
      id: "formulas",
      type: "formulas",
      title: "Formules importantes",
      icon: "📐",
      content: (
        <div className="space-y-4">
          <FormulaCard
            title="Formules essentielles"
            variant="highlighted"
            formulas={[
              {
                name: "Forme générale",
                expression: "f(x) = ax² + bx + c",
                description: "avec a ≠ 0",
              },
              {
                name: "Discriminant",
                expression: "Δ = b² − 4ac",
                description: "Détermine le nombre de racines",
              },
              {
                name: "Racines (si Δ ≥ 0)",
                expression: "x₁ = (−b − √Δ) / 2a    et    x₂ = (−b + √Δ) / 2a",
              },
              {
                name: "Coordonnées du sommet",
                expression: "S(−b/2a ; −Δ/4a)",
                description: "Point extréminimum de la parabole",
              },
              {
                name: "Forme factorisée (si Δ ≥ 0)",
                expression: "f(x) = a(x − x₁)(x − x₂)",
              },
              {
                name: "Forme canonique",
                expression: "f(x) = a(x − x₀)² + y₀",
                description: "où (x₀, y₀) est le sommet",
              },
            ]}
          />

          <FormulaCard
            title="Formules dérivées (rappel du bac)"
            formulas={[
              {
                name: "Somme des racines",
                expression: "x₁ + x₂ = −b/a",
              },
              {
                name: "Produit des racines",
                expression: "x₁ · x₂ = c/a",
              },
            ]}
          />
        </div>
      ),
    },

    // 9. Méthodes
    {
      id: "methods",
      type: "methods",
      title: "Méthodes",
      icon: "🧠",
      content: (
        <div className="space-y-4">
          <MethodCard
            number={1}
            title="Étudier une fonction du 2nd degré"
            steps={[
              "Identifier a, b et c dans f(x) = ax² + bx + c",
              "Calculer le discriminant Δ = b² − 4ac",
              "En déduire le nombre de racines réelles",
              "Calculer les racines (si Δ ≥ 0)",
              "Déterminer les coordonnées du sommet",
              "Tracer la parabole avec les points clés",
            ]}
          />
          <MethodCard
            number={2}
            title="Étudier le signe de f(x)"
            steps={[
              "Calculer Δ pour connaître le nombre de racines",
              "Si Δ > 0 : tracer la parabole, repérer les racines x₁ et x₂",
              "Si a > 0 : f(x) négatif entre x₁ et x₂, positif ailleurs",
              "Si a < 0 : f(x) positif entre x₁ et x₂, négatif ailleurs",
              "Si Δ = 0 : f(x) est toujours du signe de a (sauf en x₀ où f(x₀) = 0)",
              "Si Δ < 0 : f(x) est toujours du signe de a",
            ]}
          />
        </div>
      ),
    },

    // 10. Exemple guidé
    {
      id: "guided-example",
      type: "guided-example",
      title: "Exemple guidé",
      icon: "✏️",
      content: (
        <div className="space-y-4">
          <Card className="border-border/50 bg-muted/30">
            <CardContent className="p-4 space-y-2">
              <p className="text-sm font-medium text-foreground">
                📝 Énoncé
              </p>
              <p className="text-sm text-muted-foreground">
                Étudier la fonction <code>f(x) = 2x² − 4x + 2</code> et tracer sa courbe.
              </p>
            </CardContent>
          </Card>
          <div className="space-y-1">
            <ExampleStep step={1} title="Identifier a, b, c" content={<p className="text-muted-foreground">a = 2, b = −4, c = 2</p>} />
            <ExampleStep step={2} title="Calculer Δ" content={<p className="text-muted-foreground">Δ = (−4)² − 4(2)(2) = 16 − 16 = <strong className="text-foreground">0</strong></p>} />
            <ExampleStep step={3} title="Interpréter Δ = 0" content={<p className="text-muted-foreground">Une seule racine réelle double : x₀ = −b/(2a) = 4/4 = <strong className="text-foreground">1</strong></p>} />
            <ExampleStep step={4} title="Coordonnées du sommet" content={<p className="text-muted-foreground">S = (1 ; f(1)) = (1 ; 2(1)² − 4(1) + 2) = <strong className="text-foreground">(1 ; 0)</strong>. Le sommet est sur l'axe des x.</p>} />
            <ExampleStep step={5} title="Ordonnée à l'origine" content={<p className="text-muted-foreground">f(0) = 2(0)² − 4(0) + 2 = <strong className="text-foreground">2</strong>. La courbe coupe l'axe des y en (0 ; 2).</p>} />
            <ExampleStep step={6} title="Tracer la courbe" isLast content={<p className="text-muted-foreground">La parabole est tournée vers le haut (a = 2 &gt; 0), passe par (0 ; 2) et touche l'axe des x en (1 ; 0).</p>} />
          </div>
        </div>
      ),
    },

    // 11. Exemple difficile
    {
      id: "hard-example",
      type: "hard-example",
      title: "Exemple difficile",
      icon: "🔥",
      content: (
        <div className="space-y-4">
          <Card className="border-accent/30 bg-accent/[0.03]">
            <CardContent className="p-4 space-y-2">
              <p className="text-sm font-medium text-foreground">
                🔥 Exercice avancé
              </p>
              <p className="text-sm text-muted-foreground">
                On considère la fonction <code>f(x) = −x² + 4x − 3</code>.
                <br />1) Calculer Δ et les racines de f.
                <br />2) Déterminer les coordonnées du sommet S.
                <br />3) Étudier le signe de f(x).
                <br />4) Résoudre f(x) &gt; 0.
              </p>
            </CardContent>
          </Card>
          <div className="space-y-1">
            <ExampleStep step={1} title="Calcul de Δ" content={<p className="text-muted-foreground">a = −1, b = 4, c = −3. Δ = 16 − 12 = <strong className="text-foreground">4</strong>. Deux racines réelles.</p>} />
            <ExampleStep step={2} title="Racines" content={<p className="text-muted-foreground">x₁ = (−4 − 2)/(−2) = 3 ; x₂ = (−4 + 2)/(−2) = 1. Donc x₁ = 1 et x₂ = 3.</p>} />
            <ExampleStep step={3} title="Sommet" content={<p className="text-muted-foreground">S = (−4/(−2) ; −4/(−4)) = <strong className="text-foreground">(2 ; 1)</strong>. Maximum car a &lt; 0.</p>} />
            <ExampleStep step={4} title="Signe de f(x)" isLast content={<p className="text-muted-foreground">a = −1 &lt; 0 et Δ &gt; 0 → f(x) est positif entre les racines. Donc <strong className="text-foreground">f(x) &gt; 0 pour x ∈ ]1 ; 3[</strong>.</p>} />
          </div>
        </div>
      ),
    },

    // 12. Erreurs fréquentes
    {
      id: "common-mistakes",
      type: "common-mistakes",
      title: "Erreurs fréquentes",
      icon: "⚠️",
      content: (
        <div className="space-y-3">
          {[
            {
              mistake: "Oublier que a ≠ 0",
              fix: "Si a = 0, ce n'est plus une fonction du 2nd degré, mais du 1er degré !",
            },
            {
              mistake: "Confondre les signes dans la formule de Δ",
              fix: "Δ = b² − 4ac (attention au signe de −4ac). Ne pas écrire b² + 4ac.",
            },
            {
              mistake: "Erreur de calcul de √Δ",
              fix: "√4 = 2 (pas 4). √0 = 0. Vérifie toujours en élevant au carré.",
            },
            {
              mistake: "Confondre sommet et racines",
              fix: "Le sommet est le point extrémaximum. Les racines sont les abscisses où f(x) = 0.",
            },
            {
              mistake: "Mauvais signe pour le sommet",
              fix: "x_S = −b/(2a) avec le signe moins. Ne pas oublier le −.",
            },
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

    // 13. Exercices progressifs
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
              color: "emerald",
              questions: [
                "Calcule Δ pour f(x) = x² − 5x + 6",
                "Détermine les racines de f(x) = x² − 4",
                "Quel est le signe de a si la parabole est tournée vers le bas ?",
              ],
            },
            {
              level: "Intermédiaire",
              color: "amber",
              questions: [
                "Pour quelle(s) valeur(s) de k l'équation x² + 2x + k = 0 admet-elle une unique racine ?",
                "Étudie le signe de f(x) = −2x² + 8x − 6",
                "Trace la courbe de f(x) = x² − 2x + 1 en indiquant le sommet",
              ],
            },
            {
              level: "Avancé",
              color: "red",
              questions: [
                "Soit f(x) = ax² + bx + c. Montrer que si f(x₁) = 0 et f(x₂) = 0, alors x₁ + x₂ = −b/a et x₁ · x₂ = c/a",
                "Un rectangle de périmètre 20 cm a une aire de 24 cm². Ses dimensions sont-elles solutions d'une équation du 2nd degré ? Résoudre.",
              ],
            },
          ].map((group, gi) => (
            <Card key={gi} className={`border-${group.color}-200 bg-${group.color}-50/30 py-4`}>
              <CardContent className="px-5 space-y-3">
                <Badge variant="secondary" className={`bg-${group.color}-100 text-${group.color}-700`}>
                  {group.level}
                </Badge>
                <ol className="space-y-2">
                  {group.questions.map((q, qi) => (
                    <li key={qi} className="text-sm text-muted-foreground flex gap-2">
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

    // 14. Demander au Prof IA
    {
      id: "ask-ai",
      type: "ask-ai",
      title: "Demander au Prof IA",
      icon: "🤖",
      content: <ProfessionalAITutor subject="Mathématiques" subjectKey="math" />,
    },

    // 15. Dessine-moi
    {
      id: "draw-me",
      type: "draw-me",
      title: "Dessine-moi",
      icon: "✏️",
      content: (
        <DrawMePanel
          subject="math"
          options={[
            {
              label: "Courbe de f(x) = ax² + bx + c",
              icon: "📈",
              description: "Trace la parabole correspondante",
              variant: "parabole",
            },
            {
              label: "Évolution de la pente",
              icon: "📐",
              description: "Montre comment la dérivée varie",
              variant: "pente",
            },
            {
              label: "Géométrie du discriminant",
              icon: "🔢",
              description: "Visualise le lien entre Δ et les racines",
              variant: "discriminant",
            },
            {
              label: "Comparaison de paraboles",
              icon: "📊",
              description: "Superpose plusieurs courbes",
              variant: "comparaison",
            },
            {
              label: "🧮 Résolveur de polynôme",
              icon: "🧮",
              description: "Entre a, b, c et obtiens le graphique + tableau de variations",
              variant: "polynomial-solver",
            },
            {
              label: "🔮 Parabole 3D",
              icon: "🔮",
              description: "Vue 3D de la parabole de révolution",
              variant: "3d-parabola",
            },
            {
              label: "🔮 Sphère",
              icon: "🔮",
              description: "Modèle 3D interactif",
              variant: "3d-sphere",
            },
            {
              label: "🔮 Cône",
              icon: "🔮",
              description: "Modèle 3D interactif",
              variant: "3d-cone",
            },
          ]}
        />
      ),
    },

    // 16. Mini-test
    {
      id: "mini-test",
      type: "mini-test",
      title: "Mini-test",
      icon: "🧪",
      content: (
        <MiniTest
          questions={[
            {
              question: "Quel est le discriminant de f(x) = x² − 4x + 4 ?",
              options: ["Δ = 0", "Δ = 4", "Δ = −4", "Δ = 8"],
              correctIndex: 0,
              explanation:
                "Δ = (−4)² − 4(1)(4) = 16 − 16 = 0. Cette équation admet une unique racine double.",
            },
            {
              question: "Si a < 0, la parabole est tournée vers :",
              options: [
                "Le haut (minimum)",
                "Le bas (maximum)",
                "La gauche",
                "La droite",
              ],
              correctIndex: 1,
              explanation:
                "Quand a < 0, la parabole est tournée vers le bas, donc le sommet est un maximum.",
            },
            {
              question: "Les racines de x² − 5x + 6 = 0 sont :",
              options: [
                "x = 2 et x = 3",
                "x = 1 et x = 6",
                "x = −2 et x = −3",
                "x = 0 et x = 5",
              ],
              correctIndex: 0,
              explanation:
                "Δ = 25 − 24 = 1. x₁ = (5−1)/2 = 2, x₂ = (5+1)/2 = 3. On peut aussi remarquer que x²−5x+6 = (x−2)(x−3).",
            },
            {
              question: "Quelle est l'ordonnée à l'origine de f(x) = 3x² − x + 5 ?",
              options: ["3", "−1", "5", "0"],
              correctIndex: 2,
              explanation:
                "L'ordonnée à l'origine est f(0) = 3(0)² − 0 + 5 = 5. C'est la constante c.",
            },
          ]}
        />
      ),
    },

    // 17. Exercices avancés (à venir)
    {
      id: "advanced-exercises",
      type: "exercises",
      title: "Exercices avancés",
      icon: "🎯",
      content: (
        <Card className="border-border/50 bg-muted/20 border-dashed">
          <CardContent className="p-8 text-center space-y-3">
            <div className="text-3xl">📝</div>
            <h4 className="text-sm font-semibold text-foreground">Exercices avancés — Bientôt disponibles</h4>
            <p className="text-xs text-muted-foreground max-w-md mx-auto">
              Des exercices complexes et des problèmes de concours seront ajoutés prochainement.
              Cette section inclura des sujets du bac blanc, des exercices de synthèse et des défis.
            </p>
            <Badge variant="secondary" className="text-[10px]">En développement</Badge>
          </CardContent>
        </Card>
      ),
    },

    // 18. Résumé
    {
      id: "summary",
      type: "summary",
      title: "Résumé",
      icon: "📋",
      content: (
        <div className="space-y-4">
          <Card className="border-border/50 bg-muted/30">
            <CardContent className="p-5 space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <h4 className="text-xs font-bold text-foreground uppercase tracking-wide">
                    Forme générale
                  </h4>
                  <code className="text-sm font-mono text-primary">f(x) = ax² + bx + c</code>
                </div>
                <div className="space-y-2">
                  <h4 className="text-xs font-bold text-foreground uppercase tracking-wide">
                    Discriminant
                  </h4>
                  <code className="text-sm font-mono text-primary">Δ = b² − 4ac</code>
                </div>
                <div className="space-y-2">
                  <h4 className="text-xs font-bold text-foreground uppercase tracking-wide">
                    Sommet
                  </h4>
                  <code className="text-sm font-mono text-primary">S(−b/2a ; −Δ/4a)</code>
                </div>
                <div className="space-y-2">
                  <h4 className="text-xs font-bold text-foreground uppercase tracking-wide">
                    Racines (Δ ≥ 0)
                  </h4>
                  <code className="text-sm font-mono text-primary">x = (−b ± √Δ) / 2a</code>
                </div>
              </div>
              <div className="border-t border-border/30 pt-3">
                <h4 className="text-xs font-bold text-foreground uppercase tracking-wide mb-2">
                  Points clés à retenir
                </h4>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>• Le signe de a détermine l&apos;orientation de la parabole</li>
                  <li>• Δ détermine le nombre de racines réelles</li>
                  <li>• Le sommet est le point extrémaximum de la courbe</li>
                  <li>• La parabole est toujours symétrique par rapport à x = −b/(2a)</li>
                </ul>
              </div>
            </CardContent>
          </Card>
        </div>
      ),
    },

    // 18. Que faut-il réviser ensuite ?
    {
      id: "next-steps",
      type: "next-steps",
      title: "Que faut-il réviser ensuite ?",
      icon: "🔄",
      content: (
        <div className="space-y-3">
          {[
            {
              topic: "Fonctions dérivées",
              description: "La dérivée de f(x) = ax² + bx + c est f'(x) = 2ax + b. C'est la suite logique !",
              icon: "📈",
            },
            {
              topic: "Équations et inéquations du 2nd degré",
              description: "Approfondis la résolution et l'étude de signe avec des cas plus complexes.",
              icon: "🔢",
            },
            {
              topic: "Vecteurs et droites",
              description: "Les notions de pente et de tangente seront utiles en géométrie vectorielle.",
              icon: "📐",
            },
            {
              topic: "Suites numériques",
              description: "Les termes d'une suite géométrique ou arithmétique sont liés à des fonctions.",
              icon: "📊",
            },
          ].map((item, i) => (
            <Card key={i} className="border-border/50 bg-card py-3 hover:border-primary/20 transition-colors">
              <CardContent className="flex items-start gap-3 px-4">
                <span className="text-xl mt-0.5">{item.icon}</span>
                <div>
                  <p className="text-sm font-semibold text-foreground">
                    {item.topic}
                  </p>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    {item.description}
                  </p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ),
    },
  ];
}
