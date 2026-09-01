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
import { motion } from "framer-motion";

function ondeData(params: Record<string, number>) {
  const A = params.A ?? 2;
  const f = params.f ?? 1;
  const lambda = params.lambda ?? 4;
  const points = [];
  for (let x = 0; x <= 20; x += 0.1) {
    const y = A * Math.sin(2 * Math.PI * (x / lambda - f * 0));
    points.push({ x: Math.round(x * 100) / 100, y: Math.round(y * 100) / 100 });
  }
  return points;
}

function ondeTemporelle(params: Record<string, number>) {
  const A = params.A ?? 2;
  const T = params.T ?? 2;
  const points = [];
  for (let t = 0; t <= 10; t += 0.05) {
    const y = A * Math.sin(2 * Math.PI * t / T);
    points.push({ x: Math.round(t * 100) / 100, y: Math.round(y * 100) / 100 });
  }
  return points;
}

export function getPhysicsOndesSections(): LessonSection[] {
  return [
    {
      id: "why-study",
      type: "why-study",
      title: "Pourquoi étudier cette leçon ?",
      icon: "🌍",
      content: (
        <div className="space-y-4 text-sm leading-relaxed text-muted-foreground">
          <p>
            Les <strong className="text-foreground">ondes mécaniques progressives</strong> (OMP)
            sont partout autour de nous : le son, les vagues, les séismes, les vibrations
            d&apos;une corde. Comprendre leur propagation est essentiel en physique.
          </p>
          <ConceptCard icon="🌊" title="Applications concrètes" variant="info">
            <p>
              Le son est une OMP qui se propage dans l&apos;air. Les ultrasons sont utilisés
              en médecine (échographie). Les ondes sismiques permettent de localiser les
              tremblements de terre. Les vibrations des cordes sont à la base de la musique.
            </p>
          </ConceptCard>
          <ConceptCard icon="🔗" title="Lien avec les autres chapitres" variant="tip">
            <p>
              Les OMP préparent l&apos;étude des <strong>ondes mécaniques périodiques</strong> (sinusoïdales),
              des <strong>ondes lumineuses</strong>, et des <strong>systèmes mécaniques oscillants</strong>.
              C&apos;est un chapitre central du programme de physique de 2ème BAC.
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
            "Définir une onde mécanique progressive et ses caractéristiques",
            "Distinguer OMP et OMP périodique",
            "Déterminer la vitesse de propagation d'une OMP",
            "Interpréter un graphique temporel et spatial d'une onde",
            "Connaître les conditions de réflexion et de transmission",
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
            { label: "Notion de fonction", level: "maîtrisé" },
            { label: "Sinus et cosinus", level: "maîtrisé" },
            { label: "Notions de vitesse et d'accélération", level: "maîtrisé" },
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
            Imagine que tu jettes une pierre dans une mare calme. L&apos;eau se met à bouger
            et cette perturbation se propage en cercles concentriques. C&apos;est exactement
            le principe d&apos;une <strong className="text-foreground">onde mécanique progressive</strong>.
          </p>
          <p>
            L&apos;eau ne se déplace pas vers l&apos;avant : chaque point de l&apos;eau oscille
            autour de sa position d&apos;équilibre. C&apos;est <strong className="text-foreground">l&apos;énergie</strong> qui se propage,
            pas la matière.
          </p>
          <div className="flex justify-center py-3">
            <Card className="border-border/50 bg-muted/30 p-4 text-center">
              <p className="text-sm text-muted-foreground italic">
                &quot;Une onde est une perturbation qui se propage dans un milieu en transportant de l&apos;énergie
                sans transport de matière.&quot;
              </p>
            </Card>
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
            <h3 className="text-sm font-bold text-foreground">Définition</h3>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Une <strong className="text-foreground">onde mécanique progressive</strong> est
              la propagation d&apos;une perturbation dans un milieu matériel,伴随着 le transport
              d&apos;énergie sans transport de matière.
            </p>
          </div>

          <div className="space-y-3">
            <h3 className="text-sm font-bold text-foreground">Caractéristiques d&apos;une OMP</h3>
            <div className="grid gap-3 sm:grid-cols-2">
              {[
                { symbol: "V", name: "Vitesse de phase", desc: "Vitesse de propagation de l'onde (m/s)", color: "blue" },
                { symbol: "λ", name: "Longueur d'onde", desc: "Distance entre deux crests successifs (m)", color: "emerald" },
                { symbol: "T", name: "Période", desc: "Temps pour une oscillation complète (s)", color: "amber" },
                { symbol: "f", name: "Fréquence", desc: "Nombre d'oscillations par seconde (Hz)", color: "rose" },
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

          <ConceptCard icon="📐" title="Relation fondamentale" variant="tip">
            <p className="text-center text-base font-mono font-bold text-primary py-2">
              V = λ × f &nbsp;&nbsp;ou&nbsp;&nbsp; V = λ / T
            </p>
            <p className="text-xs text-muted-foreground text-center">
              Cette relation relie les quatre grandeurs caractéristiques de l&apos;onde.
            </p>
          </ConceptCard>

          <div className="space-y-3">
            <h3 className="text-sm font-bold text-foreground">Types d&apos;OMP</h3>
            <div className="grid gap-3 sm:grid-cols-2">
              <ConceptCard icon="〰️" title="OMP transversale" variant="info">
                <p>Les oscillations sont perpendiculaires à la direction de propagation (ex: corde vibrant).</p>
              </ConceptCard>
              <ConceptCard icon="↔️" title="OMP longitudinale" variant="info">
                <p>Les oscillations sont parallèles à la direction de propagation (ex: son dans l&apos;air).</p>
              </ConceptCard>
            </div>
          </div>
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
            title="Représentation spatiale d'une OMP"
            description="Modifie l'amplitude et la longueur d'onde pour observer l'effet sur la courbe."
            params={[
              { name: "Amplitude", symbol: "A", min: 0.5, max: 5, step: 0.5, defaultValue: 2 },
              { name: "Longueur d'onde λ", symbol: "lambda", min: 1, max: 8, step: 0.5, defaultValue: 4 },
              { name: "Fréquence f", symbol: "f", min: 0.1, max: 3, step: 0.1, defaultValue: 1 },
            ]}
            computePoints={ondeData}
            xLabel="x (m)"
            yLabel="y (m)"
            xDomain={[0, 20]}
            color="#0891b2"
            variant="area"
          />

          <InteractiveGraph
            title="Représentation temporelle d'une OMP"
            description="Oscillation d'un point du milieu au cours du temps."
            params={[
              { name: "Amplitude", symbol: "A", min: 0.5, max: 5, step: 0.5, defaultValue: 2 },
              { name: "Période T", symbol: "T", min: 0.5, max: 4, step: 0.5, defaultValue: 2 },
            ]}
            computePoints={ondeTemporelle}
            xLabel="t (s)"
            yLabel="y (m)"
            xDomain={[0, 10]}
            color="#d97706"
          />

          <GraphExplainer
            items={[
              "L'axe horizontal représente la position x (ou le temps t).",
              "L'axe vertical représente le déplacement y du point du milieu.",
              "L'amplitude A est la distance maximale par rapport à l'équilibre.",
              "La longueur d'onde λ est la distance entre deux crêtes successives.",
              "La période T est le temps mis pour une oscillation complète.",
              "La relation V = λ × f relie toutes les grandeurs.",
            ]}
          />
        </div>
      ),
    },
    {
      id: "graph-explanation",
      type: "graph-explanation",
      title: "Lire un graphique d'onde",
      icon: "🔎",
      content: (
        <div className="space-y-4 text-sm text-muted-foreground leading-relaxed">
          <ConceptCard icon="🔍" title="Graphique spatial y(x) à instant fixe" variant="info">
            <p>
              On observe la forme de l&apos;onde à un instant donné. La distance entre
              deux crêtes successives est la <strong>longueur d&apos;onde λ</strong>.
              L&apos;amplitude est la hauteur maximale par rapport à l&apos;équilibre.
            </p>
          </ConceptCard>
          <ConceptCard icon="🔍" title="Graphique temporel y(t) pour un point fixe" variant="info">
            <p>
              On observe l&apos;oscillation d&apos;un seul point au cours du temps.
              Le temps entre deux crêtes successives est la <strong>période T</strong>.
              La fréquence f = 1/T.
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
          title="Formules des Ondes Mécaniques Progressives"
          variant="highlighted"
          formulas={[
            { name: "Relation fondamentale", expression: "V = λ × f = λ / T" },
            { name: "Fréquence", expression: "f = 1 / T" },
            { name: "Énergie transportée", expression: "P ∝ A² × f²", description: "Puissance proportionnelle au carré de l'amplitude" },
            { name: "OMP sur corde tendue", expression: "V = √(T_m / μ)", description: "T_m = tension, μ = masse linéique" },
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
            title="Déterminer les caractéristiques d'une OMP"
            steps={[
              "Lire λ sur le graphique spatial (distance entre deux crêtes)",
              "Lire T sur le graphique temporel (temps entre deux crêtes)",
              "Calculer f = 1/T",
              "Calculer V = λ × f",
            ]}
          />
          <MethodCard
            number={2}
            title="Identifier le type d'onde"
            steps={[
              "Regarder la direction des oscillations par rapport à la propagation",
              "Perpendiculaire → transversale (corde, surface d'eau)",
              "Parallèle → longitudinale (son, ressort)",
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
                Une OMP se propage sur une corde avec λ = 2 m et f = 50 Hz.
                <br />1) Calculer la vitesse de phase.
                <br />2) Quelle est la période ?
              </p>
            </CardContent>
          </Card>
          <div className="space-y-1">
            <ExampleStep step={1} title="Vitesse de phase" content={<p className="text-muted-foreground">V = λ × f = 2 × 50 = <strong className="text-foreground">100 m/s</strong></p>} />
            <ExampleStep step={2} title="Période" isLast content={<p className="text-muted-foreground">T = 1/f = 1/50 = <strong className="text-foreground">0,02 s = 20 ms</strong></p>} />
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
                Une corde a une masse linéique μ = 0,5 g/m et est soumise à une tension T_m = 20 N.
                On y envoie une perturbation de fréquence 100 Hz.
                <br />1) Calculer la vitesse de propagation.
                <br />2) Calculer la longueur d&apos;onde.
                <br />3) Combien de longueurs d&apos;onde sur 3 m de corde ?
              </p>
            </CardContent>
          </Card>
          <div className="space-y-1">
            <ExampleStep step={1} title="Vitesse" content={<p className="text-muted-foreground">V = √(T_m/μ) = √(20/0,0005) = √40000 = <strong className="text-foreground">200 m/s</strong></p>} />
            <ExampleStep step={2} title="Longueur d'onde" content={<p className="text-muted-foreground">λ = V/f = 200/100 = <strong className="text-foreground">2 m</strong></p>} />
            <ExampleStep step={3} title="Nombre de λ" isLast content={<p className="text-muted-foreground">N = L/λ = 3/2 = <strong className="text-foreground">1,5 longueurs d'onde</strong></p>} />
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
            { mistake: "Confondre spatial et temporel", fix: "y(x) : lecture de λ. y(t) : lecture de T. Ne pas mélanger les axes." },
            { mistake: "Oublier l'unité de la fréquence", fix: "f est en Hertz (Hz) = nombre par seconde. Vérifier les unités dans V = λf." },
            { mistake: "Croire que la matière se déplace", fix: "Dans une OMP, c'est l'énergie qui se propage, pas la matière. Les points oscillent autour de leur position." },
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
                "Une OMP a λ = 4 m et T = 0,2 s. Calculer V et f.",
                "Sur un graphique y(x), on lit λ = 1,5 m. Si f = 200 Hz, calculer V.",
              ],
            },
            {
              level: "Intermédiaire",
              questions: [
                "Une corde de masse linéique 2 g/m est tendue avec T_m = 8 N. Calculer V.",
                "Onobserve 3 crêtes sur 6 m de corde. Calculer λ.",
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
      content: <ProfessionalAITutor subject="Physique — Ondes" subjectKey="physics" />,
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
            { label: "Forme de l'onde spatiale", icon: "🌊", description: "Représentation y(x) à instant fixe", variant: "mruvs-muv" },
            { label: "Oscillation temporelle", icon: "⏱️", description: "y(t) pour un point fixe", variant: "mruvs-muv-v" },
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
              question: "Dans une OMP, qu'est-ce qui se propage ?",
              options: ["La matière", "L'énergie", "Le milieu", "Rien"],
              correctIndex: 1,
              explanation: "Dans une OMP, c'est l'énergie qui se propage. Les points du milieu oscillent mais ne se déplacent pas avec l'onde.",
            },
            {
              question: "V = λ × f. Si λ = 3 m et f = 100 Hz, V = ?",
              options: ["33 m/s", "300 m/s", "30 Hz", "100 m/s"],
              correctIndex: 1,
              explanation: "V = 3 × 100 = 300 m/s. Vérifie les unités : m × Hz = m × (1/s) = m/s.",
            },
            {
              question: "La longueur d'onde λ se lit sur :",
              options: ["y(t) temporel", "y(x) spatial", "Les deux", "Aucun"],
              correctIndex: 1,
              explanation: "λ est une distance spatiale. Elle se lit sur le graphique y(x) à instant fixe, pas sur y(t).",
            },
          ]}
        />
      ),
    },

    {
      id: "advanced-exercises",
      type: "exercises" as const,
      title: "Exercices avancés",
      icon: "🎯",
      content: (
        <Card className="border-border/50 bg-muted/20 border-dashed">
          <CardContent className="p-8 text-center space-y-3">
            <div className="text-3xl">📝</div>
            <h4 className="text-sm font-semibold text-foreground">Exercices avancés — Bientôt disponibles</h4>
            <p className="text-xs text-muted-foreground max-w-md mx-auto">Des exercices complexes et des problèmes de concours seront ajoutés prochainement.</p>
            <Badge variant="secondary" className="text-[10px]">En développement</Badge>
          </CardContent>
        </Card>
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
              <li>• <strong>OMP</strong> = perturbation qui se propage sans transport de matière</li>
              <li>• <strong>V = λ × f</strong> relation fondamentale</li>
              <li>• <strong>λ</strong> : longueur d&apos;onde (distance entre deux crêtes)</li>
              <li>• <strong>T</strong> : période (temps pour une oscillation), <strong>f = 1/T</strong></li>
              <li>• <strong>Transversale</strong> : oscillations ⊥ propagation</li>
              <li>• <strong>Longitudinale</strong> : oscillations // propagation</li>
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
            { topic: "Ondes mécaniques périodiques", description: "Onde sinusoïdale, superposition, interférences.", icon: "〰️" },
            { topic: "Ondes lumineuses", description: "Nature ondulatoire de la lumière, réflexion, réfraction.", icon: "💡" },
            { topic: "Systèmes oscillants", description: "Pendule, ressort, oscillations libres et amorties.", icon: "🔔" },
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
