"use client";
import type { LessonSection } from "@/types/lessons";
import { InteractiveGraph, GraphExplainer } from "@/components/visual/InteractiveGraph";
import { FormulaCard, ConceptCard, MethodCard, ExampleStep } from "@/components/visual/FormulaCard";
import { MiniTest } from "@/components/visual/MiniTest";
import { DrawMePanel } from "@/components/visual/DrawMePanel";
import { AITutorPanel } from "@/components/visual/AITutorPanel";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";

function expoData(p: Record<string, number>) {
  const k = p.k ?? 1;
  return Array.from({ length: 80 }, (_, i) => { const x = (i - 40) * 0.25; return { x: Math.round(x*100)/100, y: Math.round(Math.exp(k * x) * 100) / 100 }; }).filter(d => Math.abs(d.y) < 100);
}

export function getMathExpoSections(): LessonSection[] {
  return [
    { id: "why-study", type: "why-study", title: "Pourquoi étudier cette leçon ?", icon: "🌍", content: (
      <div className="space-y-4 text-sm leading-relaxed text-muted-foreground">
        <p>La <strong className="text-foreground">fonction exponentielle</strong> exp(x) = eˣ est la fonction la plus importante en analyse. Elle est sa propre dérivée et intervient partout en science.</p>
        <ConceptCard icon="🔬" title="Applications concrètes" variant="info"><p>Croissance bactérienne, désintégration radioactive, intérêts composés, décroissance exponentielle, équations différentielles, lois de probabilités (loi normale).</p></ConceptCard>
      </div>
    )},
    { id: "objectives", type: "objectives", title: "Objectifs", icon: "🎯", content: <div className="space-y-3">{["Connaître les propriétés de l'exponentielle", "Résoudre des équations de type eˣ = a", "Étudier les variations de eᵏˣ", "Comparer eˣ avec les polynômes en +∞"].map((o, i) => <div key={i} className="flex items-start gap-3 rounded-lg bg-primary/[0.03] border border-primary/10 px-4 py-3"><span className="flex-shrink-0 w-6 h-6 rounded-full bg-primary text-primary-foreground text-xs font-bold flex items-center justify-center mt-0.5">{i+1}</span><p className="text-sm text-foreground/80">{o}</p></div>)}</div> },
    { id: "prerequisites", type: "prerequisites", title: "Prérequis", icon: "🧠", content: <div className="space-y-3">{[{ label: "Puissances et racines", level: "maîtrisé" }, { label: "Limites (notion de base)", level: "utile" }].map((p, i) => <div key={i} className="flex items-center gap-3 rounded-lg border border-border/50 bg-card px-4 py-3"><span className="text-lg">✅</span><span className="text-sm text-foreground/80">{p.label}</span><Badge variant={p.level === "maîtrisé" ? "default" : "secondary"} className="ml-auto text-[10px]">{p.level}</Badge></div>)}</div> },
    { id: "intro", type: "intro", title: "Introduction intuitive", icon: "📖", content: (
      <div className="space-y-4 text-sm leading-relaxed text-muted-foreground">
        <p>La fonction <strong className="text-foreground">exponentielle</strong> est définie par eˣ, où e ≈ 2,718 est le nombre d&apos;Euler.</p>
        <p>Sa particularité remarquable : <strong className="text-foreground">elle est sa propre dérivée</strong>. (eˣ)&apos; = eˣ.</p>
        <p>C&apos;est la seule fonction (à une constante près) dont la dérivée est elle-même.</p>
      </div>
    )},
    { id: "course", type: "course", title: "Cours complet", icon: "📚", content: (
      <div className="space-y-6">
        <FormulaCard title="Propriétés fondamentales" variant="highlighted" formulas={[
          { name: "Définition", expression: "exp(x) = eˣ avec e ≈ 2,71828" },
          { name: "Produit", expression: "eˣ × eʸ = eˣ⁺ʸ" },
          { name: "Quotient", expression: "eˣ / eʸ = eˣ⁻ʸ" },
          { name: "Puissance", expression: "(eˣ)ⁿ = eⁿˣ" },
          { name: "Dérivée", expression: "(eˣ)' = eˣ", description: "Elle est sa propre dérivée !" },
        ]} />
        <ConceptCard icon="📈" title="Variations" variant="info"><p>Si k &gt; 0 : eᵏˣ est croissante. Si k &lt; 0 : eᵏˣ est décroissante. Toujours positive : eˣ &gt; 0 pour tout x.</p></ConceptCard>
        <ConceptCard icon="📐" title="Équation fondamentale" variant="tip"><p>eˣ = a ⟹ x = ln(a) (si a &gt; 0). Si a ≤ 0, pas de solution.</p></ConceptCard>
      </div>
    )},
    { id: "visualization", type: "visualization", title: "Visualisation interactive", icon: "📊", content: (
      <div className="space-y-6">
        <InteractiveGraph title="eᵏˣ : variation avec k" description="Modifie k pour observer l'effet sur la courbe exponentielle." params={[{ name: "Coefficient k", symbol: "k", min: -2, max: 2, step: 0.1, defaultValue: 1 }]} computePoints={expoData} xLabel="x" yLabel="eᵏˣ" xDomain={[-10, 10]} color="#059669" variant="area" />
        <GraphExplainer items={["eˣ est toujours positive (jamais nulle).", "Passe toujours par (0 ; 1).", "Si k > 0 : croissance exponentielle rapide.", "Si k < 0 : décroissance exponentielle vers 0.", "eˣ croît toujours plus vite que tout polynôme en +∞."]} />
      </div>
    )},
    { id: "graph-explanation", type: "graph-explanation", title: "Interprétation", icon: "🔎", content: <div className="space-y-3 text-sm text-muted-foreground"><ConceptCard icon="🔍" title="Comportement en +∞ et −∞" variant="info"><p>k &gt; 0 : eᵏˣ → +∞ quand x → +∞, et eᵏˣ → 0 quand x → −∞.<br/>k &lt; 0 : eᵏˣ → 0 quand x → +∞, et eᵏˣ → +∞ quand x → −∞.</p></ConceptCard></div> },
    { id: "formulas", type: "formulas", title: "Formules importantes", icon: "📐", content: <FormulaCard title="Équations et limites" formulas={[
      { name: "Équation", expression: "eˣ = a ⟹ x = ln(a)" },
      { name: "Limite fondamentale", expression: "lim x→+∞ eˣ/xⁿ = +∞ pour tout n" },
      { name: "Limite en −∞", expression: "lim x→−∞ xⁿeˣ = 0 pour tout n" },
    ]} /> },
    { id: "methods", type: "methods", title: "Méthodes", icon: "🧠", content: <MethodCard number={1} title="Résoudre une équation avec exponentielle" steps={["Isoler eᵏˣ d'un côté", "Passer au logarithme : kx = ln(a)", "Diviser par k pour trouver x", "Vérifier les conditions de validité (a > 0)"]} /> },
    { id: "guided-example", type: "guided-example", title: "Exemple guidé", icon: "✏️", content: <div className="space-y-4"><Card className="border-border/50 bg-muted/30"><CardContent className="p-4"><p className="text-sm font-medium text-foreground">📝 Résoudre e²ˣ = 5</p></CardContent></Card><div className="space-y-1"><ExampleStep step={1} title="Isoler" content={<p className="text-muted-foreground">e²ˣ = 5 &gt; 0 → solution possible</p>} /><ExampleStep step={2} title="Logarithme" content={<p className="text-muted-foreground">2x = ln(5)</p>} /><ExampleStep step={3} title="Résoudre" isLast content={<p className="text-muted-foreground">x = ln(5)/2 ≈ <strong className="text-foreground">0,805</strong></p>} /></div></div> },
    { id: "hard-example", type: "hard-example", title: "Exemple difficile", icon: "🔥", content: <Card className="border-accent/30 bg-accent/[0.03]"><CardContent className="p-4"><p className="text-sm font-medium text-foreground">🔥 Résoudre e²ˣ − 3eˣ + 2 = 0</p><p className="text-sm text-muted-foreground mt-2">Substitution : posons t = eˣ (t &gt; 0). On obtient t² − 3t + 2 = 0 = (t−1)(t−2). Donc t = 1 ou t = 2. x = ln(1) = 0 ou x = ln(2).</p></CardContent></Card> },
    { id: "common-mistakes", type: "common-mistakes", title: "Erreurs fréquentes", icon: "⚠️", content: <div className="space-y-3">{[{ mistake: "Croire que eˣ peut être négatif", fix: "eˣ > 0 pour tout x réel. Jamais nul, jamais négatif." }, { mistake: "Oublier que ln(a) n'existe que si a > 0", fix: "On ne peut pas prendre ln de 0 ou d'un négatif." }].map((item, i) => <Card key={i} className="border-red-100 bg-red-50/30 py-3"><CardContent className="px-4 space-y-1"><p className="text-sm font-medium text-red-700 flex items-center gap-2"><span className="text-red-500">✗</span> {item.mistake}</p><p className="text-xs text-red-600/80 flex items-start gap-2"><span className="text-emerald-500 mt-0.5">✓</span> {item.fix}</p></CardContent></Card>)}</div> },
    { id: "exercises", type: "exercises", title: "Exercices progressifs", icon: "📝", content: <div className="space-y-4">{[{ level: "Fondamental", questions: ["Calculer e⁰, e¹, e⁻¹", "Résoudre eˣ = 10"] }, { level: "Intermédiaire", questions: ["Résoudre e²ˣ − 5eˣ + 6 = 0", "Étudier les variations de f(x) = eˣ − x²"] }].map((g, gi) => <Card key={gi} className="border-border/50 bg-card py-4"><CardContent className="px-5 space-y-3"><Badge variant="secondary">{g.level}</Badge><ol className="space-y-2 text-sm text-muted-foreground">{g.questions.map((q, qi) => <li key={qi} className="flex gap-2"><span className="font-mono text-xs text-muted-foreground/60">{gi+1}.{qi+1}</span>{q}</li>)}</ol></CardContent></Card>)}</div> },
    { id: "ask-ai", type: "ask-ai", title: "Demander au Prof IA", icon: "🤖", content: <AITutorPanel subject="Maths — Exponentielle" /> },
    { id: "draw-me", type: "draw-me", title: "Dessine-moi", icon: "✏️", content: <DrawMePanel subject="math" options={[{ label: "Courbe eᵏˣ", icon: "📈", description: "Observe l'effet de k", variant: "parabole" }, { label: "Comparaison avec x²", icon: "📊", description: "eˣ croît plus vite que x²", variant: "comparaison" }]} /> },
    { id: "mini-test", type: "mini-test", title: "Mini-test", icon: "🧪", content: <MiniTest questions={[
      { question: "eˣ est toujours :", options: ["Positive", "Négative", "Nulle en x=0", "Nulle en x=1"], correctIndex: 0, explanation: "eˣ > 0 pour tout x réel. C'est toujours positif." },
      { question: "Résoudre eˣ = 1 :", options: ["x = 0", "x = 1", "x = e", "Pas de solution"], correctIndex: 0, explanation: "e⁰ = 1. Donc x = 0." },
    ]} /> },
    { id: "summary", type: "summary", title: "Résumé", icon: "📋", content: <Card className="border-border/50 bg-muted/30"><CardContent className="p-5"><ul className="text-sm text-muted-foreground space-y-1"><li>• eˣ &gt; 0 toujours, passe par (0 ; 1)</li><li>• (eˣ)&apos; = eˣ — sa propre dérivée</li><li>• eˣ × eʸ = eˣ⁺ʸ</li><li>• eˣ = a ⟹ x = ln(a) (si a &gt; 0)</li><li>• eˣ croît plus vite que tout polynôme en +∞</li></ul></CardContent></Card> },
    { id: "next-steps", type: "next-steps", title: "Que faut-il réviser ensuite ?", icon: "🔄", content: <div className="space-y-3">{[{ topic: "Nombres complexes", description: "Exponentielle des complexes : eⁱᶿ = cos θ + i sin θ.", icon: "🔢" }, { topic: "Équations différentielles", description: "L'exponentielle résout y' = ky.", icon: "📐" }].map((item, i) => <Card key={i} className="border-border/50 bg-card py-3 hover:border-primary/20 transition-colors"><CardContent className="flex items-start gap-3 px-4"><span className="text-xl">{item.icon}</span><div><p className="text-sm font-semibold text-foreground">{item.topic}</p><p className="text-xs text-muted-foreground mt-0.5">{item.description}</p></div></CardContent></Card>)}</div> },
  ];
}
