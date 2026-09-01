"use client";
import type { LessonSection } from "@/types/lessons";
import { InteractiveGraph, GraphExplainer } from "@/components/visual/InteractiveGraph";
import { FormulaCard, ConceptCard, MethodCard, ExampleStep } from "@/components/visual/FormulaCard";
import { MiniTest } from "@/components/visual/MiniTest";
import { DrawMePanel } from "@/components/visual/DrawMePanel";
import { ProfessionalAITutor } from "@/components/visual/ProfessionalAITutor";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";

function suiteGeo(p: Record<string, number>) {
  const u0 = p.u0 ?? 1, q = p.q ?? 0.8;
  return Array.from({ length: 30 }, (_, n) => ({ x: n, y: Math.round(u0 * Math.pow(q, n) * 1000) / 1000 }));
}
function suiteArith(p: Record<string, number>) {
  const u0 = p.u0 ?? 0, r = p.r ?? 1;
  return Array.from({ length: 30 }, (_, n) => ({ x: n, y: Math.round((u0 + n * r) * 100) / 100 }));
}

export function getMathSuitesSections(): LessonSection[] {
  return [
    { id: "why-study", type: "why-study", title: "Pourquoi étudier cette leçon ?", icon: "🌍", content: (
      <div className="space-y-4 text-sm leading-relaxed text-muted-foreground">
        <p>Les <strong className="text-foreground">suites numériques</strong> modélisent des phénomènes discrets : intérêts composés, population bactérienne, approximations successives.</p>
        <ConceptCard icon="🔗" title="Pourquoi c'est essentiel" variant="info"><p>Les suites préparent l&apos;étude des limites, de la continuité, et des équations différentielles. En informatique, elles servent à analyser la complexité des algorithmes.</p></ConceptCard>
      </div>
    )},
    { id: "objectives", type: "objectives", title: "Objectifs", icon: "🎯", content: <div className="space-y-3">{["Définir une suite par récurrence ou par une formule explicite", "Étudier la convergence d'une suite", "Calculer des limites de suites", "Caractériser les suites géométriques et arithmétiques"].map((o, i) => <div key={i} className="flex items-start gap-3 rounded-lg bg-primary/[0.03] border border-primary/10 px-4 py-3"><span className="flex-shrink-0 w-6 h-6 rounded-full bg-primary text-primary-foreground text-xs font-bold flex items-center justify-center mt-0.5">{i+1}</span><p className="text-sm text-foreground/80">{o}</p></div>)}</div> },
    { id: "prerequisites", type: "prerequisites", title: "Prérequis", icon: "🧠", content: <div className="space-y-3">{[{ label: "Notion de fonction", level: "maîtrisé" }, { label: "Limites (notion de base)", level: "utile" }].map((p, i) => <div key={i} className="flex items-center gap-3 rounded-lg border border-border/50 bg-card px-4 py-3"><span className="text-lg">✅</span><span className="text-sm text-foreground/80">{p.label}</span><Badge variant={p.level === "maîtrisé" ? "default" : "secondary"} className="ml-auto text-[10px]">{p.level}</Badge></div>)}</div> },
    { id: "intro", type: "intro", title: "Introduction intuitive", icon: "📖", content: (
      <div className="space-y-4 text-sm leading-relaxed text-muted-foreground">
        <p>Une <strong className="text-foreground">suite numérique</strong> est une suite de nombres réels (u₀, u₁, u₂, ...). Chaque terme est numéroté par un entier naturel n.</p>
        <p>Exemple : la suite définie par u₀ = 1 et uₙ₊₁ = 2uₙ donne : 1, 2, 4, 8, 16, 32, ...</p>
        <p>On dit qu&apos;une suite <strong className="text-foreground">converge</strong> si ses termes se rapprochent d&apos;une valeur fixe.</p>
      </div>
    )},
    { id: "course", type: "course", title: "Cours complet", icon: "📚", content: (
      <div className="space-y-6">
        <ConceptCard icon="📐" title="Définition par récurrence" variant="info"><p>u₀ = a (terme initial) et uₙ₊₁ = f(uₙ) (relation de récurrence). On calcule les termes successivement.</p></ConceptCard>
        <ConceptCard icon="📐" title="Formule explicite" variant="tip"><p>uₙ = expression directe en fonction de n, sans calculer les termes précédents.</p></ConceptCard>
        <div className="grid gap-3 sm:grid-cols-2">
          <ConceptCard icon="📊" title="Suite arithmétique" variant="info"><p>uₙ₊₁ = uₙ + r. Formule : uₙ = u₀ + n×r. C&apos;est une progression linéaire.</p></ConceptCard>
          <ConceptCard icon="📈" title="Suite géométrique" variant="info"><p>uₙ₊₁ = q×uₙ. Formule : uₙ = u₀ × qⁿ. Si |q| &lt; 1, la suite converge vers 0.</p></ConceptCard>
        </div>
      </div>
    )},
    { id: "visualization", type: "visualization", title: "Visualisation interactive", icon: "📊", content: (
      <div className="space-y-6">
        <InteractiveGraph title="Suite géométrique : uₙ = u₀ × qⁿ" description="Modifie u₀ et q pour observer la convergence ou la divergence." params={[{ name: "u₀", symbol: "u0", min: 0.1, max: 5, step: 0.1, defaultValue: 1 }, { name: "q (raison)", symbol: "q", min: -1.5, max: 1.5, step: 0.1, defaultValue: 0.8 }]} computePoints={suiteGeo} xLabel="n" yLabel="uₙ" xDomain={[0, 30]} color="#4f46e5" />
        <InteractiveGraph title="Suite arithmétique : uₙ = u₀ + n×r" params={[{ name: "u₀", symbol: "u0", min: -5, max: 5, step: 0.5, defaultValue: 0 }, { name: "r (raison)", symbol: "r", min: -3, max: 3, step: 0.5, defaultValue: 1 }]} computePoints={suiteArith} xLabel="n" yLabel="uₙ" xDomain={[0, 30]} color="#059669" />
        <GraphExplainer items={["Chaque point représente un terme uₙ de la suite.", "Si q ∈]-1, 1[, la suite géométrique converge vers 0.", "Si q > 1, la suite diverge vers +∞.", "La suite arithmétique est toujours divergente si r ≠ 0."]} />
      </div>
    )},
    { id: "graph-explanation", type: "graph-explanation", title: "Interprétation", icon: "🔎", content: <div className="space-y-3 text-sm text-muted-foreground"><ConceptCard icon="🔍" title="Convergence" variant="info"><p>Une suite converge si lim n→+∞ uₙ existe et est finie. Pour une suite géométrique, |q| &lt; 1 ⟹ convergence vers 0.</p></ConceptCard></div> },
    { id: "formulas", type: "formulas", title: "Formules importantes", icon: "📐", content: <FormulaCard title="Formules des suites" variant="highlighted" formulas={[
      { name: "Générale", expression: "uₙ = u₀ × qⁿ (géométrique)   ou   uₙ = u₀ + n×r (arithmétique)" },
      { name: "Limite géométrique", expression: "|q| < 1 ⟹ lim uₙ = 0" },
      { name: "Limite arithmétique", expression: "r ≠ 0 ⟹ la suite diverge" },
      { name: "Récurrence", expression: "uₙ₊₁ = f(uₙ) avec u₀ donné" },
    ]} /> },
    { id: "methods", type: "methods", title: "Méthodes", icon: "🧠", content: <MethodCard number={1} title="Étudier la convergence" steps={["Identifier le type de suite (arithmétique, géométrique, autre)", "Si géométrique : vérifier |q| par rapport à 1", "Si autre : chercher la limite ou majorer/encadrer les termes", "Conclure : convergence ou divergence"]} /> },
    { id: "guided-example", type: "guided-example", title: "Exemple guidé", icon: "✏️", content: <div className="space-y-4"><Card className="border-border/50 bg-muted/30"><CardContent className="p-4"><p className="text-sm font-medium text-foreground">📝 Suite définie par u₀ = 3 et uₙ₊₁ = 0,5 × uₙ. Étudier la convergence.</p></CardContent></Card><div className="space-y-1"><ExampleStep step={1} title="Identifier" content={<p className="text-muted-foreground">Suite géométrique de raison q = 0,5</p>} /><ExampleStep step={2} title="Vérifier q" content={<p className="text-muted-foreground">|q| = 0,5 &lt; 1</p>} /><ExampleStep step={3} title="Conclure" isLast content={<p className="text-muted-foreground">|q| &lt; 1 → la suite <strong className="text-foreground">converge vers 0</strong></p>} /></div></div> },
    { id: "hard-example", type: "hard-example", title: "Exemple difficile", icon: "🔥", content: <Card className="border-accent/30 bg-accent/[0.03]"><CardContent className="p-4"><p className="text-sm font-medium text-foreground">🔥 Suite u₀ = 1, uₙ₊₁ = 2uₙ + 1. Exprimer uₙ en fonction de n.</p><p className="text-sm text-muted-foreground mt-2">On cherche vₙ = uₙ + 1. Alors vₙ₊₁ = uₙ₊₁ + 1 = 2uₙ + 2 = 2(uₙ+1) = 2vₙ. Donc vₙ = 2ⁿ, et uₙ = 2ⁿ − 1.</p></CardContent></Card> },
    { id: "common-mistakes", type: "common-mistakes", title: "Erreurs fréquentes", icon: "⚠️", content: <div className="space-y-3">{[{ mistake: "Confondre uₙ et uₙ₊₁ dans la récurrence", fix: "Vérifier l'indice : uₙ₊₁ = f(uₙ), pas uₙ = f(uₙ₊₁)." }, { mistake: "Croire que q < 0 signifie divergence", fix: "C'est |q| qui compte, pas q. Si q = −0,5, |q| = 0,5 < 1 → convergence." }].map((item, i) => <Card key={i} className="border-red-100 bg-red-50/30 py-3"><CardContent className="px-4 space-y-1"><p className="text-sm font-medium text-red-700 flex items-center gap-2"><span className="text-red-500">✗</span> {item.mistake}</p><p className="text-xs text-red-600/80 flex items-start gap-2"><span className="text-emerald-500 mt-0.5">✓</span> {item.fix}</p></CardContent></Card>)}</div> },
    { id: "exercises", type: "exercises", title: "Exercices progressifs", icon: "📝", content: <div className="space-y-4">{[{ level: "Fondamental", questions: ["u₀ = 5, q = 0,3. Calculer u₃.", "u₀ = 2, r = 3. Exprimer uₙ en fonction de n."] }, { level: "Intermédiaire", questions: ["Étudier la convergence de uₙ = (3n+1)/(n+5)", "Suite u₀ = 1, uₙ₊₁ = (uₙ + 3)/2. Calculer u₁, u₂, u₃."] }].map((g, gi) => <Card key={gi} className="border-border/50 bg-card py-4"><CardContent className="px-5 space-y-3"><Badge variant="secondary">{g.level}</Badge><ol className="space-y-2 text-sm text-muted-foreground">{g.questions.map((q, qi) => <li key={qi} className="flex gap-2"><span className="font-mono text-xs text-muted-foreground/60">{gi+1}.{qi+1}</span>{q}</li>)}</ol></CardContent></Card>)}</div> },
    { id: "ask-ai", type: "ask-ai", title: "Demander au Prof IA", icon: "🤖", content: <ProfessionalAITutor subject="Maths — Suites" subjectKey="math" /> },
    { id: "draw-me", type: "draw-me", title: "Dessine-moi", icon: "✏️", content: <DrawMePanel subject="math" options={[{ label: "Suite géométrique", icon: "📈", description: "Visualise la convergence", variant: "parabole" }, { label: "Suite arithmétique", icon: "📐", description: "Progression linéaire", variant: "pente" }]} /> },
    { id: "mini-test", type: "mini-test", title: "Mini-test", icon: "🧪", content: <MiniTest questions={[
      { question: "Suite géométrique de raison q = 0,5. Converge-t-elle ?", options: ["Oui, vers 0", "Non, elle diverge", "Oui, vers 1", "Ça dépend de u₀"], correctIndex: 0, explanation: "|q| = 0,5 < 1, donc la suite converge vers 0." },
      { question: "uₙ = 2n + 3. Quel est u₅ ?", options: ["7", "10", "13", "15"], correctIndex: 2, explanation: "u₅ = 2×5 + 3 = 13." },
    ]} /> },
    { id: "summary", type: "summary", title: "Résumé", icon: "📋", content: <Card className="border-border/50 bg-muted/30"><CardContent className="p-5"><ul className="text-sm text-muted-foreground space-y-1"><li>• Suite arithmétique : uₙ = u₀ + n×r (progression linéaire)</li><li>• Suite géométrique : uₙ = u₀ × qⁿ (convergence si |q| &lt; 1)</li><li>• Convergence ⟺ la limite existe et est finie</li><li>• Récurrence : calculer les termes successivement</li></ul></CardContent></Card> },
    { id: "next-steps", type: "next-steps", title: "Que faut-il réviser ensuite ?", icon: "🔄", content: <div className="space-y-3">{[{ topic: "Fonctions exponentielles", description: "L'exponentielle est liée aux suites par la limite (1+1/n)ⁿ.", icon: "𝑒" }, { topic: "Limites et continuité", description: "Approfondir les techniques de calcul de limites.", icon: "∞" }].map((item, i) => <Card key={i} className="border-border/50 bg-card py-3 hover:border-primary/20 transition-colors"><CardContent className="flex items-start gap-3 px-4"><span className="text-xl">{item.icon}</span><div><p className="text-sm font-semibold text-foreground">{item.topic}</p><p className="text-xs text-muted-foreground mt-0.5">{item.description}</p></div></CardContent></Card>)}</div> },
  ];
}
