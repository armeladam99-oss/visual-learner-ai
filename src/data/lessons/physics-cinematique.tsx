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

export function getPhysicsCinematiqueSections(): LessonSection[] {
  return [
    {
      id: "why-study",
      type: "why-study",
      title: "Pourquoi étudier cette leçon ?",
      icon: "🌍",
      content: (
        <div className="space-y-4 text-sm leading-relaxed text-muted-foreground">
          <p>
            La <strong className="text-foreground">cinématique</strong> est la branche de
            la physique qui décrit le mouvement des corps sans s&apos;intéresser aux forces
            qui le provoquent. C&apos;est la base de la mécanique.
          </p>
          <ConceptCard icon="🚗" title="Dans la vie réelle" variant="info">
            <p>
              Quand tu conduis une voiture, tu calcules instinctivement ta vitesse,
              ta distance, le temps de trajet. En kinésiologie, on analyse les
              mouvements du corps humain. En aéronautique, on prédit les trajectoires.
            </p>
          </ConceptCard>
          <ConceptCard icon="🚀" title="Pourquoi c&apos;est essentiel" variant="tip">
            <p>
              La cinématique est le prérequis indispensable à la dynamique (étude des
              forces). Elle prépare aussi l&apos;étude des oscillations, des ondes, et
              de l&apos;électromagnétisme. C&apos;est une compétence clé du bac
              Physique-Chimie.
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
            "Définir position, vitesse et accélération dans un mouvement rectiligne",
            "Lire et interpréter des graphiques x(t), v(t), a(t)",
            "Distinguer mouvement uniforme et mouvement uniformément varié",
            "Calculer des grandeurs à partir des graphiques",
            "Lier les trois représentations graphiques entre elles",
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

    {
      id: "prerequisites",
      type: "prerequisites",
      title: "Prérequis",
      icon: "🧠",
      content: (
        <div className="space-y-3">
          {[
            { label: "Notions de distance et de durée", level: "maîtrisé" },
            { label: "Lecture d&apos;un graphique", level: "maîtrisé" },
            { label: "Notion de fonction", level: "maîtrisé" },
          ].map((prereq, i) => (
            <div
              key={i}
              className="flex items-center gap-3 rounded-lg border border-border/50 bg-card px-4 py-3"
            >
              <span className="text-lg">✅</span>
              <span className="text-sm text-foreground/80">{prereq.label}</span>
              <Badge variant="default" className="ml-auto text-[10px]">
                {prereq.level}
              </Badge>
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
            Avant de parler de forces et de masses, commençons par décrire le
            mouvement. Comment ? En mesurant <strong className="text-foreground">où</strong> se trouve
            un objet à chaque instant.
          </p>
          <p>
            Pense à une voiture qui démarre au feu rouge. Au début, elle est
            immobile. Puis elle accélère doucement, atteint sa vitesse de croisière,
            et enfin freine. Chacune de ces phases peut être décrite par trois
            grandeurs fondamentales :
          </p>
          <div className="grid gap-3 sm:grid-cols-3 py-2">
            {[
              { symbol: "x(t)", name: "Position", desc: "Où est l'objet à l'instant t", color: "blue" },
              { symbol: "v(t)", name: "Vitesse", desc: "À quelle rapidité se déplace-t-il", color: "emerald" },
              { symbol: "a(t)", name: "Accélération", desc: "Comment la vitesse évolue", color: "amber" },
            ].map((g, i) => (
              <Card key={i} className={`border-${g.color}-200 bg-${g.color}-50/50 py-3`}>
                <CardContent className="text-center space-y-1 px-3">
                  <code className="text-lg font-mono font-bold">{g.symbol}</code>
                  <p className="text-xs font-medium text-foreground">{g.name}</p>
                  <p className="text-[11px] text-muted-foreground">{g.desc}</p>
                </CardContent>
              </Card>
            ))}
          </div>
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
            <h3 className="text-sm font-bold text-foreground">
              Mouvement rectiligne uniforme (MRU)
            </h3>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Un MRU est un mouvement à <strong className="text-foreground">vitesse
              constante</strong> : l&apos;objet parcourt des distances égales en des
              intervalles de temps égaux.
            </p>
            <p className="text-sm text-muted-foreground leading-relaxed">
              L&apos;accélération est nulle : a(t) = 0.
            </p>
          </div>

          <div className="space-y-3">
            <h3 className="text-sm font-bold text-foreground">
              Mouvement uniformément varié (MUV)
            </h3>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Un MUV est un mouvement à <strong className="text-foreground">accélération
              constante</strong>. La vitesse change de manière régulière.
            </p>
            <p className="text-sm text-muted-foreground leading-relaxed">
              C&apos;est le mouvement d&apos;un corps en chute libre (sans frottement),
              ou d&apos;une voiture qui freine uniformément.
            </p>
          </div>

          <ConceptCard icon="🔗" title="Lien entre les trois grandeurs" variant="info">
            <p>
              La vitesse est la <strong>dérivée</strong> de la position : v(t) = dx/dt.
              L&apos;accélération est la <strong>dérivée</strong> de la vitesse : a(t) = dv/dt.
              Inversement, la position est l&apos;<strong>intégrale</strong> de la vitesse,
              et la vitesse est l&apos;intégrale de l&apos;accélération.
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
            title="Mouvement uniformément varié : x(t)"
            description="Modifie l'accélération et la vitesse initiale pour observer l'effet sur la trajectoire."
            params={[
              { name: "Accélération", symbol: "a", min: -5, max: 5, step: 0.5, defaultValue: 2 },
              { name: "Vitesse initiale", symbol: "v0", min: -10, max: 10, step: 0.5, defaultValue: 0 },
            ]}
            computePoints={(p) => {
              const points = [];
              for (let t = 0; t <= 10; t += 0.1) {
                const x = 0.5 * p.a * t * t + p.v0 * t;
                points.push({ x: Math.round(t * 100) / 100, y: Math.round(x * 100) / 100 });
              }
              return points;
            }}
            xLabel="t (s)"
            yLabel="x (m)"
            xDomain={[0, 10]}
            color="#059669"
            variant="area"
          />

          <InteractiveGraph
            title="Vitesse en fonction du temps : v(t)"
            description="La vitesse évolue linéairement dans un MUV."
            params={[
              { name: "Accélération", symbol: "a", min: -5, max: 5, step: 0.5, defaultValue: 2 },
              { name: "Vitesse initiale", symbol: "v0", min: -10, max: 10, step: 0.5, defaultValue: 0 },
            ]}
            computePoints={(p) => {
              const points = [];
              for (let t = 0; t <= 10; t += 0.1) {
                const v = p.a * t + p.v0;
                points.push({ x: Math.round(t * 100) / 100, y: Math.round(v * 100) / 100 });
              }
              return points;
            }}
            xLabel="t (s)"
            yLabel="v (m/s)"
            xDomain={[0, 10]}
            color="#2563eb"
          />

          <InteractiveGraph
            title="Accélération : a(t)"
            description="Dans un MUV, l'accélération est constante."
            params={[
              { name: "Accélération", symbol: "a", min: -5, max: 5, step: 0.5, defaultValue: 2 },
            ]}
            computePoints={(p) => {
              const points = [];
              for (let t = 0; t <= 10; t += 0.5) {
                points.push({ x: Math.round(t * 100) / 100, y: p.a });
              }
              return points;
            }}
            xLabel="t (s)"
            yLabel="a (m/s²)"
            xDomain={[0, 10]}
            color="#d97706"
          />

          <GraphExplainer
            items={[
              "L'axe horizontal représente le temps t en secondes (s).",
              "L'axe vertical représente la grandeur physique mesurée (position, vitesse ou accélération).",
              "Sur x(t) : une courbe parabolique indique un MUV. Plus la parabole est étroite, plus l'accélération est grande.",
              "Sur v(t) : une droite croissante signifie une accélération positive (accélération). Décroissante = décélération.",
              "Sur a(t) : une ligne horizontale signifie une accélération constante (MUV).",
              "La pente de x(t) à un instant t donne la vitesse à cet instant.",
              "La pente de v(t) donne l'accélération. Si elle est constante, c'est un MUV.",
            ]}
          />
        </div>
      ),
    },

    {
      id: "graph-explanation",
      type: "graph-explanation",
      title: "Lier formule + graphique + phénomène",
      icon: "🔗",
      content: (
        <div className="space-y-4">
          <Card className="border-border/50 bg-muted/30">
            <CardContent className="p-5 space-y-4">
              <div className="grid gap-4 sm:grid-cols-4 items-center text-center">
                <div className="space-y-1">
                  <p className="text-[10px] uppercase font-bold text-muted-foreground tracking-wider">Formule</p>
                  <code className="text-sm font-mono font-semibold text-primary">x(t) = ½at² + v₀t</code>
                </div>
                <div className="text-2xl text-muted-foreground">↓</div>
                <div className="space-y-1">
                  <p className="text-[10px] uppercase font-bold text-muted-foreground tracking-wider">Graphique</p>
                  <p className="text-sm text-foreground">Parabole x(t)</p>
                </div>
                <div className="text-2xl text-muted-foreground">↓</div>
              </div>
              <div className="grid gap-4 sm:grid-cols-2 text-center">
                <div className="space-y-1">
                  <p className="text-[10px] uppercase font-bold text-muted-foreground tracking-wider">Phénomène</p>
                  <p className="text-sm text-foreground/80">Une voiture accélère uniformément au départ</p>
                </div>
                <div className="space-y-1">
                  <p className="text-[10px] uppercase font-bold text-muted-foreground tracking-wider">Interprétation</p>
                  <p className="text-sm text-foreground/80">La distance parcourue augmente de plus en plus vite</p>
                </div>
              </div>
            </CardContent>
          </Card>
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
          title="Mouvement rectiligne"
          variant="highlighted"
          formulas={[
            { name: "MRU", expression: "x(t) = x₀ + v·t", description: "Vitesse constante" },
            { name: "MUV — Position", expression: "x(t) = ½·a·t² + v₀·t + x₀" },
            { name: "MUV — Vitesse", expression: "v(t) = a·t + v₀" },
            { name: "Lien v-x", expression: "v² = v₀² + 2a(x − x₀)" },
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
            title="Identifier le type de mouvement"
            steps={[
              "Examiner le graphique x(t) : droite → MRU, parabole → MUV",
              "Examiner v(t) : constante → MRU, linéaire → MUV",
              "Examiner a(t) : nulle → MRU, constante non nulle → MUV",
            ]}
          />
          <MethodCard
            number={2}
            title="Extraire des données d'un graphique"
            steps={[
              "Lire l'ordonnée à l'origine → x₀ ou v₀",
              "Calculer la pente de la courbe → v ou a",
              "Identifier les points particuliers (max, min, intersections)",
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
                Un char d&apos;assaut part du repos et accélère uniformément à 2 m/s². Quelle est sa vitesse après 5 secondes ? Quelle distance a-t-il parcourue ?
              </p>
            </CardContent>
          </Card>
          <div className="space-y-1">
            <ExampleStep step={1} title="Identifier les données" content={<p className="text-muted-foreground">x₀ = 0, v₀ = 0 (part du repos), a = 2 m/s², t = 5 s</p>} />
            <ExampleStep step={2} title="Calculer v(5)" content={<p className="text-muted-foreground">v(t) = a·t + v₀ = 2 × 5 + 0 = <strong className="text-foreground">10 m/s</strong></p>} />
            <ExampleStep step={3} title="Calculer x(5)" isLast content={<p className="text-muted-foreground">x(t) = ½·a·t² + v₀·t = ½ × 2 × 25 + 0 = <strong className="text-foreground">25 m</strong></p>} />
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
                Une voiture roule à 90 km/h. Le conducteur freine et la voiture s&apos;arrête en 6 secondes.
                <br />1) Calculer l&apos;accélération du freinage.
                <br />2) Calculer la distance de freinage.
              </p>
            </CardContent>
          </Card>
          <div className="space-y-1">
            <ExampleStep step={1} title="Conversion d'unités" content={<p className="text-muted-foreground">90 km/h = 90/3.6 = 25 m/s</p>} />
            <ExampleStep step={2} title="Accélération" content={<p className="text-muted-foreground">v = v₀ + a·t → 0 = 25 + a·6 → a = −25/6 ≈ <strong className="text-foreground">−4.17 m/s²</strong></p>} />
            <ExampleStep step={3} title="Distance de freinage" isLast content={<p className="text-muted-foreground">x = v₀·t + ½·a·t² = 25×6 + ½×(−25/6)×36 = 150 − 75 = <strong className="text-foreground">75 m</strong></p>} />
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
            { mistake: "Confondre MRU et MUV", fix: "MRU = vitesse constante (a = 0). MUV = accélération constante (a ≠ 0)." },
            { mistake: "Oublier les unités", fix: "Toujours vérifier : vitesse en m/s, accélération en m/s², distance en m. Conversion km/h → m/s : diviser par 3.6." },
            { mistake: "Prendre la pente à l'endroit mal", fix: "La pente de x(t) à un instant t donne v(t) à cet instant, pas la vitesse moyenne." },
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
                "Un objet se déplace de 100 m en 20 s à vitesse constante. Quelle est sa vitesse ?",
                "Quelle est la pente de la droite v(t) passant par (0, 2) et (4, 10) ?",
              ],
            },
            {
              level: "Intermédiaire",
              questions: [
                "Un corps part du repos avec a = 3 m/s². Calculer x et v après 4 s.",
                "Lire sur un graphique x(t) la position à t = 3 s et la vitesse à cet instant.",
              ],
            },
          ].map((group, gi) => (
            <Card key={gi} className="border-border/50 bg-card py-4">
              <CardContent className="px-5 space-y-3">
                <Badge variant="secondary">{group.level}</Badge>
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

    {
      id: "ask-ai",
      type: "ask-ai",
      title: "Demander au Prof IA",
      icon: "🤖",
      content: <ProfessionalAITutor subject="Physique-Chimie" subjectKey="physics" />,
    },

    {
      id: "draw-me",
      type: "draw-me",
      title: "Dessine-moi",
      icon: "✏️",
      content: (
        <DrawMePanel
          subject="physics"
          options={[
            { label: "Comparaison MRU / MUV (x)", icon: "📈", description: "Superpose x(t) des deux mouvements", variant: "mruvs-muv" },
            { label: "Comparaison MRU / MUV (v)", icon: "🚀", description: "Montre v(t) côte à côte", variant: "mruvs-muv-v" },
            { label: "Circuit série", icon: "⚡", description: "Schéma interactif avec curseurs", variant: "circuit-series" },
            { label: "Circuit parallèle", icon: "🔌", description: "Deux branches en parallèle", variant: "circuit-parallel" },
            { label: "Diagramme de forces (plan incliné)", icon: "🎯", description: "Corps isolé sur plan incliné", variant: "forces-incline" },
            { label: "Chute libre", icon: "🍎", description: "Poids et résistance de l'air", variant: "forces-fall" },
            { label: "Addition de vecteurs", icon: "📐", description: "Règle du parallélogramme", variant: "vectors" },
            { label: "Décomposition vectorielle", icon: "📏", description: "Composantes Fx et Fy", variant: "decomposition" },
            { label: "Onde progressive", icon: "🌊", description: "Amplitude, fréquence, λ", variant: "wave-progressive" },
            { label: "Onde stationnaire", icon: "〰️", description: "Nœuds et ventres", variant: "wave-stationary" },
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
              question: "Dans un MRU, quelle est l'accélération ?",
              options: ["a = 0", "a = constante", "a = v/t", "a = g"],
              correctIndex: 0,
              explanation: "MRU = mouvement à vitesse constante. Si la vitesse ne change pas, l'accélération est nulle.",
            },
            {
              question: "La pente de x(t) donne :",
              options: ["L'accélération", "La vitesse instantanée", "La distance parcourue", "Le temps"],
              correctIndex: 1,
              explanation: "La dérivée de la position par rapport au temps donne la vitesse : v(t) = dx/dt.",
            },
            {
              question: "Une voiture roule à 72 km/h. En m/s, c'est :",
              options: ["72 m/s", "20 m/s", "200 m/s", "3.6 m/s"],
              correctIndex: 1,
              explanation: "72 km/h = 72/3.6 = 20 m/s. On divise par 3.6 pour passer de km/h à m/s.",
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
          <CardContent className="p-5 space-y-3">
            <h4 className="text-xs font-bold text-foreground uppercase tracking-wide">
              Les essentiels
            </h4>
            <ul className="text-sm text-muted-foreground space-y-1">
              <li>• <strong>x(t)</strong> = position, <strong>v(t)</strong> = vitesse, <strong>a(t)</strong> = accélération</li>
              <li>• MRU : v = constante, a = 0 → x(t) est linéaire</li>
              <li>• MUV : a = constante ≠ 0 → x(t) est parabolique, v(t) est linéaire</li>
              <li>• v(t) = dx/dt et a(t) = dv/dt</li>
              <li>• Toujours vérifier les unités (m, s, m/s, m/s²)</li>
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
            { topic: "Dynamique — Newton", description: "Comprendre les causes du mouvement : forces et lois de Newton.", icon: "⚡" },
            { topic: "Chute libre", description: "Un cas particulier de MUV avec a = g = 9,81 m/s².", icon: "🍎" },
            { topic: "Énergie cinétique", description: "Lien entre vitesse et énergie : ½mv².", icon: "🔋" },
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
