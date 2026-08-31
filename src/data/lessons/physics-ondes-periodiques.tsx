"use client";
import type { LessonSection } from "@/types/lessons";
import { InteractiveGraph, GraphExplainer } from "@/components/visual/InteractiveGraph";
import { FormulaCard, ConceptCard, MethodCard, ExampleStep } from "@/components/visual/FormulaCard";
import { MiniTest } from "@/components/visual/MiniTest";
import { DrawMePanel } from "@/components/visual/DrawMePanel";
import { AITutorPanel } from "@/components/visual/AITutorPanel";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";

function ondeSIN(p: Record<string, number>) {
  const A = p.A ?? 2, lambda = p.lambda ?? 4, phi = p.phi ?? 0;
  return Array.from({ length: 100 }, (_, i) => { const x = i * 0.2; return { x: Math.round(x*100)/100, y: Math.round(A * Math.sin(2*Math.PI*x/lambda + phi) * 100) / 100 }; });
}
function superposition(p: Record<string, number>) {
  const A = p.A ?? 2, lambda = p.lambda ?? 4;
  return Array.from({ length: 100 }, (_, i) => { const x = i * 0.2;
    const y1 = A * Math.sin(2*Math.PI*x/lambda);
    const y2 = A * Math.sin(2*Math.PI*x/lambda + Math.PI);
    return { x: Math.round(x*100)/100, y: Math.round((y1 + y2) * 100) / 100 };
  });
}

export function getPhysicsOndesPeriodiquesSections(): LessonSection[] {
  return [
    { id: "why-study", type: "why-study", title: "Pourquoi étudier cette leçon ?", icon: "🌍", content: (
      <div className="space-y-4 text-sm leading-relaxed text-muted-foreground">
        <p>Les <strong className="text-foreground">ondes mécaniques périodiques</strong> (OMPériodiques) sont le cas le plus étudié en physique. Le son, la musique, les vibrations — tout est sinusoïdal.</p>
        <ConceptCard icon="🌊" title="Applications" variant="info"><p>La musique repose sur des ondes sinusoïdales. Les ultra-sons sont utilisés en médecine. Les tremblements de terre sont des ondes sismiques. L&apos;acoustique d&apos;une salle dépend des interférences.</p></ConceptCard>
      </div>
    )},
    { id: "objectives", type: "objectives", title: "Objectifs", icon: "🎯", content: <div className="space-y-3">{["Écrire l'équation d'une OMP sinusoïdale", "Déterminer amplitude, longueur d'onde, période", "Appliquer le principe de superposition", "Comprendre les interférences constructives et destructives"].map((o, i) => <div key={i} className="flex items-start gap-3 rounded-lg bg-primary/[0.03] border border-primary/10 px-4 py-3"><span className="flex-shrink-0 w-6 h-6 rounded-full bg-primary text-primary-foreground text-xs font-bold flex items-center justify-center mt-0.5">{i+1}</span><p className="text-sm text-foreground/80">{o}</p></div>)}</div> },
    { id: "prerequisites", type: "prerequisites", title: "Prérequis", icon: "🧠", content: <div className="space-y-3">{[{ label: "OMP (leçon précédente)", level: "maîtrisé" }, { label: "Sinus et cosinus", level: "maîtrisé" }].map((p, i) => <div key={i} className="flex items-center gap-3 rounded-lg border border-border/50 bg-card px-4 py-3"><span className="text-lg">✅</span><span className="text-sm text-foreground/80">{p.label}</span><Badge variant="default" className="ml-auto text-[10px]">{p.level}</Badge></div>)}</div> },
    { id: "intro", type: "intro", title: "Introduction intuitive", icon: "📖", content: (
      <div className="space-y-4 text-sm leading-relaxed text-muted-foreground">
        <p>Une <strong className="text-foreground">onde sinusoïdale</strong> est une OMP dont la perturbation varie selon une fonction sinusoïdale. C&apos;est la forme la plus simple et la plus importante des ondes.</p>
        <div className="flex justify-center py-3"><code className="text-base font-mono font-bold text-primary bg-primary/5 px-6 py-3 rounded-xl border border-primary/10">y(x, t) = A × sin(2π(x/λ − t/T) + φ₀)</code></div>
      </div>
    )},
    { id: "course", type: "course", title: "Cours complet", icon: "📚", content: (
      <div className="space-y-6">
        <FormulaCard title="Équation d'une onde sinusoïdale" variant="highlighted" formulas={[
          { name: "Forme spatiale (t fixe)", expression: "y(x) = A × sin(2πx/λ + φ₀)" },
          { name: "Forme temporelle (x fixe)", expression: "y(t) = A × sin(2πt/T + φ₀)" },
          { name: "Phase", expression: "φ(x,t) = 2π(x/λ − t/T) + φ₀" },
        ]} />
        <ConceptCard icon="📐" title="Principe de superposition" variant="info"><p>Quand deux ondes se rencontrent, le déplacement résultant est la somme algébrique des déplacements individuels.</p></ConceptCard>
        <div className="grid gap-3 sm:grid-cols-2">
          <ConceptCard icon="➕" title="Interférence constructive" variant="tip"><p>Deux ondes en phase (décalage = nλ) → amplitude doublée. Le son est amplifié.</p></ConceptCard>
          <ConceptCard icon="➖" title="Interférence destructrice" variant="info"><p>Deux ondes en opposition (décalage = (n+½)λ) → amplitude nulle. Le son s&apos;annule.</p></ConceptCard>
        </div>
      </div>
    )},
    { id: "visualization", type: "visualization", title: "Visualisation interactive", icon: "📊", content: (
      <div className="space-y-6">
        <InteractiveGraph title="Onde sinusoïdale y(x) = A sin(2πx/λ + φ₀)" description="Modifie l'amplitude, la longueur d'onde et le déphasage." params={[{ name: "Amplitude A", symbol: "A", min: 0.5, max: 5, step: 0.5, defaultValue: 2 }, { name: "Longueur d'onde λ", symbol: "lambda", min: 1, max: 8, step: 0.5, defaultValue: 4 }, { name: "Déphasage φ₀", symbol: "phi", min: -3.14, max: 3.14, step: 0.1, defaultValue: 0 }]} computePoints={ondeSIN} xLabel="x (m)" yLabel="y (m)" xDomain={[0, 20]} color="#0891b2" />
        <InteractiveGraph title="Superposition de deux ondes en opposition de phase" params={[{ name: "Amplitude", symbol: "A", min: 0.5, max: 5, step: 0.5, defaultValue: 2 }, { name: "λ", symbol: "lambda", min: 1, max: 8, step: 0.5, defaultValue: 4 }]} computePoints={superposition} xLabel="x (m)" yLabel="y (m)" xDomain={[0, 20]} color="#d97706" />
        <GraphExplainer items={["L'amplitude A est la hauteur maximale de l'onde.", "La longueur d'onde λ est la distance entre deux crêtes.", "Le déphasage φ₀ décale la courbe horizontalement.", "Deux ondes en opposition s'annulent (superposition destructive)."]} />
      </div>
    )},
    { id: "graph-explanation", type: "graph-explanation", title: "Interprétation", icon: "🔎", content: <div className="space-y-3 text-sm text-muted-foreground"><ConceptCard icon="🔍" title="Lire une onde sinusoïdale" variant="info"><p>Crête = maximum positif. Creux = minimum négatif. Nœud = point fixe (y = 0 toujours). Ventre = point d'amplitude maximale.</p></ConceptCard></div> },
    { id: "formulas", type: "formulas", title: "Formules importantes", icon: "📐", content: <FormulaCard title="Formules des ondes périodiques" variant="highlighted" formulas={[
      { name: "OMPériodique", expression: "y = A sin(2π(x/λ − t/T) + φ₀)" },
      { name: "Vitesse", expression: "V = λf = λ/T" },
      { name: "Interférence", expression: "Δx = nλ → constructive ; Δx = (n+½)λ → destructive" },
    ]} /> },
    { id: "methods", type: "methods", title: "Méthodes", icon: "🧠", content: <MethodCard number={1} title="Identifier les paramètres d'une onde" steps={["Lire A sur le graphique (amplitude maximale)", "Lire λ sur y(x) : distance entre deux crêtes", "Lire T sur y(t) : temps entre deux crêtes", "Calculer f = 1/T et V = λf", "Déterminer le déphasage φ₀"]} /> },
    { id: "guided-example", type: "guided-example", title: "Exemple guidé", icon: "✏️", content: <div className="space-y-4"><Card className="border-border/50 bg-muted/30"><CardContent className="p-4"><p className="text-sm font-medium text-foreground">📝 Deux ondes de même amplitude se superposent. L'une est décalée de λ/2 par rapport à l'autre. Que se passe-t-il ?</p></CardContent></Card><div className="space-y-1"><ExampleStep step={1} title="Déphasage" content={<p className="text-muted-foreground">Décalage Δx = λ/2 = (½)λ</p>} /><ExampleStep step={2} title="Type d'interférence" content={<p className="text-muted-foreground">Δx = (n + ½)λ avec n = 0 → <strong className="text-foreground">interférence destructrice</strong></p>} /><ExampleStep step={3} title="Résultat" isLast content={<p className="text-muted-foreground">Les deux ondes s&apos;annulent. L&apos;amplitude résultante est nulle.</p>} /></div></div> },
    { id: "hard-example", type: "hard-example", title: "Exemple difficile", icon: "🔥", content: <Card className="border-accent/30 bg-accent/[0.03]"><CardContent className="p-4"><p className="text-sm font-medium text-foreground">🔥 Deux sources S₁ et S₂ émettent des ondes de même fréquence. S₁S₂ = 6 m. On observe un maximum en un point M tel que S₁M = 4 m et S₂M = 2 m. λ = 2 m. Vérifier qu'il s'agit d'une interférence constructive.</p><p className="text-sm text-muted-foreground mt-2">Écart de chemin : Δx = |S₂M − S₁M| = |2 − 4| = 2 m = 1×λ. Donc Δx = nλ (n=1) → interférence constructive. ✓</p></CardContent></Card> },
    { id: "common-mistakes", type: "common-mistakes", title: "Erreurs fréquentes", icon: "⚠️", content: <div className="space-y-3">{[{ mistake: "Confondre phase et déphasage", fix: "La phase φ = 2π(x/λ − t/T) + φ₀. Le déphasage φ₀ est la phase initiale (en t=0, x=0)." }, { mistake: "Oublier que deux ondes identiques s'additionnent", fix: "Deux ondes en phase → amplitude doublée, PAS identique. Énergie quadruple (proportionnelle à A²)." }].map((item, i) => <Card key={i} className="border-red-100 bg-red-50/30 py-3"><CardContent className="px-4 space-y-1"><p className="text-sm font-medium text-red-700 flex items-center gap-2"><span className="text-red-500">✗</span> {item.mistake}</p><p className="text-xs text-red-600/80 flex items-start gap-2"><span className="text-emerald-500 mt-0.5">✓</span> {item.fix}</p></CardContent></Card>)}</div> },
    { id: "exercises", type: "exercises", title: "Exercices progressifs", icon: "📝", content: <div className="space-y-4">{[{ level: "Fondamental", questions: ["Écrire l'équation d'une onde sinusoïdale avec A = 3 m, λ = 2 m, T = 0,5 s", "Calculer V si λ = 4 m et f = 100 Hz"] }, { level: "Intermédiaire", questions: ["Deux ondes de λ = 1 m. Écart de chemin = 3,5 m. Quel type d'interférence ?", "Déterminer les nœuds et ventres d'une onde stationnaire"] }].map((g, gi) => <Card key={gi} className="border-border/50 bg-card py-4"><CardContent className="px-5 space-y-3"><Badge variant="secondary">{g.level}</Badge><ol className="space-y-2 text-sm text-muted-foreground">{g.questions.map((q, qi) => <li key={qi} className="flex gap-2"><span className="font-mono text-xs text-muted-foreground/60">{gi+1}.{qi+1}</span>{q}</li>)}</ol></CardContent></Card>)}</div> },
    { id: "ask-ai", type: "ask-ai", title: "Demander au Prof IA", icon: "🤖", content: <AITutorPanel subject="Physique — Ondes Périodiques" /> },
    { id: "draw-me", type: "draw-me", title: "Dessine-moi", icon: "✏️", content: <DrawMePanel subject="physics" options={[{ label: "Onde sinusoïdale", icon: "🌊", description: "y(x) avec paramètres", variant: "mruvs-muv" }, { label: "Superposition de deux ondes", icon: "📊", description: "Interférence constructive/destructive", variant: "mruvs-muv-v" }]} /> },
    { id: "mini-test", type: "mini-test", title: "Mini-test", icon: "🧪", content: <MiniTest questions={[
      { question: "Si Δx = 2λ, on a une interférence :", options: ["Constructive", "Destructive", "Les deux", "Aucune"], correctIndex: 0, explanation: "Δx = nλ (n=2) → interférence constructive. Les ondes sont en phase." },
      { question: "Dans y = A sin(2πx/λ), l'amplitude est :", options: ["2π", "λ", "A", "2π/λ"], correctIndex: 2, explanation: "L'amplitude est le coefficient A devant le sinus." },
    ]} /> },
    { id: "summary", type: "summary", title: "Résumé", icon: "📋", content: <Card className="border-border/50 bg-muted/30"><CardContent className="p-5"><ul className="text-sm text-muted-foreground space-y-1"><li>• Onde sinusoïdale : y = A sin(2π(x/λ − t/T) + φ₀)</li><li>• Superposition : les déplacements s&apos;additionnent</li><li>• Δx = nλ → constructive (amplitude doublée)</li><li>• Δx = (n+½)λ → destructive (amplitude nulle)</li></ul></CardContent></Card> },
    { id: "next-steps", type: "next-steps", title: "Que faut-il réviser ensuite ?", icon: "🔄", content: <div className="space-y-3">{[{ topic: "Ondes lumineuses", description: "Appliquer les mêmes notions à la lumière.", icon: "💡" }, { topic: "Systèmes oscillants", description: "Pendule et ressort avec les mêmes sinusoïdes.", icon: "🔔" }].map((item, i) => <Card key={i} className="border-border/50 bg-card py-3 hover:border-primary/20 transition-colors"><CardContent className="flex items-start gap-3 px-4"><span className="text-xl">{item.icon}</span><div><p className="text-sm font-semibold text-foreground">{item.topic}</p><p className="text-xs text-muted-foreground mt-0.5">{item.description}</p></div></CardContent></Card>)}</div> },
  ];
}
