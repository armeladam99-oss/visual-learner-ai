"use client";
import type { LessonSection } from "@/types/lessons";
import { InteractiveGraph, GraphExplainer } from "@/components/visual/InteractiveGraph";
import { FormulaCard, ConceptCard, MethodCard, ExampleStep } from "@/components/visual/FormulaCard";
import { MiniTest } from "@/components/visual/MiniTest";
import { DrawMePanel } from "@/components/visual/DrawMePanel";
import { AITutorPanel } from "@/components/visual/AITutorPanel";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";

function polyData(p: Record<string, number>) {
  const a = p.a ?? 1, b = p.b ?? 0, c = p.c ?? 0;
  const pts = [];
  for (let x = -5; x <= 5; x += 0.1) { const y = a*x*x + b*x + c; if (Math.abs(y) < 30) pts.push({ x: Math.round(x*100)/100, y: Math.round(y*100)/100 }); }
  return pts;
}
function derivData(p: Record<string, number>) {
  const a = p.a ?? 1, b = p.b ?? 0;
  const pts = [];
  for (let x = -5; x <= 5; x += 0.1) { const y = 2*a*x + b; pts.push({ x: Math.round(x*100)/100, y: Math.round(y*100)/100 }); }
  return pts;
}

export function getMathDerivationSections(): LessonSection[] {
  return [
    { id: "why-study", type: "why-study", title: "Pourquoi étudier cette leçon ?", icon: "🌍", content: (
      <div className="space-y-4 text-sm leading-relaxed text-muted-foreground">
        <p>La <strong className="text-foreground">dérivation</strong> est l&apos;outil central de l&apos;analyse. Elle permet d&apos;étudier les variations, les extrema, la pente d&apos;une courbe, et résout des problèmes d&apos;optimisation partout en science.</p>
        <ConceptCard icon="🔬" title="Applications" variant="info">
          <p>En physique : la dérivée de la position donne la vitesse. En économie : le coût marginal est la dérivée du coût total. En biologie : la vitesse de croissance d&apos;une population.</p>
        </ConceptCard>
      </div>
    )},
    { id: "objectives", type: "objectives", title: "Objectifs", icon: "🎯", content: (
      <div className="space-y-3">
        {["Calculer une dérivée", "Interpréter graphiquement la dérivée (pente de la tangente)", "Étudier les variations d'une fonction", "Déterminer les extrema", "Étudier la concavité"].map((o, i) => (
          <div key={i} className="flex items-start gap-3 rounded-lg bg-primary/[0.03] border border-primary/10 px-4 py-3">
            <span className="flex-shrink-0 w-6 h-6 rounded-full bg-primary text-primary-foreground text-xs font-bold flex items-center justify-center mt-0.5">{i+1}</span>
            <p className="text-sm text-foreground/80">{o}</p>
          </div>
        ))}
      </div>
    )},
    { id: "prerequisites", type: "prerequisites", title: "Prérequis", icon: "🧠", content: (
      <div className="space-y-3">
        {[{ label: "Limites et continuité", level: "maîtrisé" }, { label: "Notion de fonction", level: "maîtrisé" }].map((p, i) => (
          <div key={i} className="flex items-center gap-3 rounded-lg border border-border/50 bg-card px-4 py-3">
            <span className="text-lg">✅</span><span className="text-sm text-foreground/80">{p.label}</span>
            <Badge variant="default" className="ml-auto text-[10px]">{p.level}</Badge>
          </div>
        ))}
      </div>
    )},
    { id: "intro", type: "intro", title: "Introduction intuitive", icon: "📖", content: (
      <div className="space-y-4 text-sm leading-relaxed text-muted-foreground">
        <p>La <strong className="text-foreground">dérivée</strong> d&apos;une fonction en un point, c&apos;est la <strong className="text-foreground">pente de la tangente</strong> à la courbe en ce point.</p>
        <p>Plus formellement : f&apos;(a) = lim h→0 (f(a+h) − f(a)) / h</p>
        <p>C&apos;est le <strong className="text-foreground">taux d&apos;accroissement instantané</strong> de f en a.</p>
      </div>
    )},
    { id: "course", type: "course", title: "Cours complet", icon: "📚", content: (
      <div className="space-y-6">
        <div className="space-y-3">
          <h3 className="text-sm font-bold text-foreground">Dérivées usuelles</h3>
          <p className="text-sm text-muted-foreground">Dérivée de f(x) = ax² + bx + c : f&apos;(x) = 2ax + b</p>
        </div>
        <ConceptCard icon="📐" title="Interprétation graphique" variant="info">
          <p>f&apos;(x₀) &gt; 0 → f est croissante en x₀<br/>f&apos;(x₀) &lt; 0 → f est décroissante en x₀<br/>f&apos;(x₀) = 0 → extremum potentiel (max ou min)</p>
        </ConceptCard>
        <ConceptCard icon="📈" title="Tableau de variations" variant="tip">
          <p>On détermine les points où f&apos;(x) = 0 ou n&apos;existe pas. On teste le signe de f&apos; entre ces points. On en déduit les variations de f.</p>
        </ConceptCard>
      </div>
    )},
    { id: "visualization", type: "visualization", title: "Visualisation interactive", icon: "📊", content: (
      <div className="space-y-6">
        <InteractiveGraph title="f(x) = ax² + bx + c et sa dérivée f'(x) = 2ax + b" description="Modifie a, b et c pour observer la courbe et sa pente." params={[{ name: "a", symbol: "a", min: -3, max: 3, step: 0.1, defaultValue: 1 }, { name: "b", symbol: "b", min: -5, max: 5, step: 0.5, defaultValue: -2 }, { name: "c", symbol: "c", min: -5, max: 5, step: 0.5, defaultValue: 1 }]} computePoints={polyData} xLabel="x" yLabel="f(x)" color="#4f46e5" />
        <InteractiveGraph title="Dérivée f'(x) = 2ax + b" params={[{ name: "a", symbol: "a", min: -3, max: 3, step: 0.1, defaultValue: 1 }, { name: "b", symbol: "b", min: -5, max: 5, step: 0.5, defaultValue: -2 }]} computePoints={derivData} xLabel="x" yLabel="f'(x)" color="#059669" />
        <GraphExplainer items={["Quand f'(x) > 0, f monte (croissante).", "Quand f'(x) < 0, f descend (décroissante).", "Quand f'(x) = 0, c'est le sommet (extremum).", "La dérivée est une droite car la dérivée de ax²+bx+c est linéaire."]} />
      </div>
    )},
    { id: "graph-explanation", type: "graph-explanation", title: "Interprétation", icon: "🔎", content: (
      <div className="space-y-3 text-sm text-muted-foreground">
        <ConceptCard icon="🔍" title="Signe de f'" variant="info">
          <p>f'(x₀) &gt; 0 : tangente monte → f croissante en x₀<br/>f'(x₀) &lt; 0 : tangente descend → f décroissante<br/>f'(x₀) = 0 : tangente horizontale → extremum</p>
        </ConceptCard>
      </div>
    )},
    { id: "formulas", type: "formulas", title: "Formules importantes", icon: "📐", content: (
      <FormulaCard title="Dérivées usuelles" variant="highlighted" formulas={[
        { name: "Polynôme", expression: "(axⁿ)' = n·axⁿ⁻¹" },
        { name: "Exponentielle", expression: "(eˣ)' = eˣ" },
        { name: "Logarithme", expression: "(ln x)' = 1/x" },
        { name: "Somme", expression: "(f + g)' = f' + g'" },
        { name: "Produit", expression: "(f·g)' = f'·g + f·g'" },
      ]} />
    )},
    { id: "methods", type: "methods", title: "Méthodes", icon: "🧠", content: (
      <div className="space-y-4">
        <MethodCard number={1} title="Étude de fonction complète" steps={["Calculer f'(x)", "Résoudre f'(x) = 0 pour trouver les points critiques", "Construire le tableau de signe de f'", "En déduire les variations et les extrema", "Tracer la courbe"]} />
      </div>
    )},
    { id: "guided-example", type: "guided-example", title: "Exemple guidé", icon: "✏️", content: (
      <div className="space-y-4">
        <Card className="border-border/50 bg-muted/30"><CardContent className="p-4"><p className="text-sm font-medium text-foreground">📝 Étudier f(x) = x³ − 3x + 1</p></CardContent></Card>
        <div className="space-y-1">
          <ExampleStep step={1} title="Dérivée" content={<p className="text-muted-foreground">f'(x) = 3x² − 3 = 3(x² − 1) = 3(x−1)(x+1)</p>} />
          <ExampleStep step={2} title="Points critiques" content={<p className="text-muted-foreground">f'(x) = 0 ⟹ x = 1 ou x = −1</p>} />
          <ExampleStep step={3} title="Signe de f'" content={<p className="text-muted-foreground">x &lt; −1 : f' &gt; 0 (↑). −1 &lt; x &lt; 1 : f' &lt; 0 (↓). x &gt; 1 : f' &gt; 0 (↑)</p>} />
          <ExampleStep step={4} title="Extrema" isLast content={<p className="text-muted-foreground">Maximum local en x = −1 : f(−1) = 3. Minimum local en x = 1 : f(1) = −1</p>} />
        </div>
      </div>
    )},
    { id: "hard-example", type: "hard-example", title: "Exemple difficile", icon: "🔥", content: (
      <Card className="border-accent/30 bg-accent/[0.03]"><CardContent className="p-4">
        <p className="text-sm font-medium text-foreground">🔥 Déterminer les asymptotes de f(x) = (2x²+1)/(x²−4)</p>
        <p className="text-sm text-muted-foreground mt-2">Asymptotes verticales : x = ±2 (null du dénominateur). Asymptote horizontale : lim x→±∞ f(x) = 2 (rapport des coefficients dominant).</p>
      </CardContent></Card>
    )},
    { id: "common-mistakes", type: "common-mistakes", title: "Erreurs fréquentes", icon: "⚠️", content: (
      <div className="space-y-3">
        {[{ mistake: "Confondre f'(x₀) = 0 et extremum", fix: "f'(x₀) = 0 est nécessaire mais pas suffisant. Vérifier le changement de signe." }, { mistake: "Oublier les points critiques", fix: "Les points critiques sont où f' = 0 OU f' n'existe pas." }].map((item, i) => (
          <Card key={i} className="border-red-100 bg-red-50/30 py-3"><CardContent className="px-4 space-y-1">
            <p className="text-sm font-medium text-red-700 flex items-center gap-2"><span className="text-red-500">✗</span> {item.mistake}</p>
            <p className="text-xs text-red-600/80 flex items-start gap-2"><span className="text-emerald-500 mt-0.5">✓</span> {item.fix}</p>
          </CardContent></Card>
        ))}
      </div>
    )},
    { id: "exercises", type: "exercises", title: "Exercices progressifs", icon: "📝", content: (
      <div className="space-y-4">
        {[{ level: "Fondamental", questions: ["Calculer la dérivée de f(x) = 3x² − 2x + 5", "Etudier les variations de f(x) = x² − 4x + 3"] }, { level: "Intermédiaire", questions: ["Etudier complètement f(x) = x³ − 12x", "Déterminer les extrema de f(x) = eˣ − x"] }].map((g, gi) => (
          <Card key={gi} className="border-border/50 bg-card py-4"><CardContent className="px-5 space-y-3">
            <Badge variant="secondary">{g.level}</Badge>
            <ol className="space-y-2 text-sm text-muted-foreground">{g.questions.map((q, qi) => <li key={qi} className="flex gap-2"><span className="font-mono text-xs text-muted-foreground/60">{gi+1}.{qi+1}</span>{q}</li>)}</ol>
          </CardContent></Card>
        ))}
      </div>
    )},
    { id: "ask-ai", type: "ask-ai", title: "Demander au Prof IA", icon: "🤖", content: <AITutorPanel subject="Maths — Dérivation" /> },
    { id: "draw-me", type: "draw-me", title: "Dessine-moi", icon: "✏️", content: <DrawMePanel subject="math" options={[{ label: "Courbe et sa dérivée", icon: "📈", description: "Superpose f(x) et f'(x)", variant: "parabole" }, { label: "Évolution de la pente", icon: "📐", description: "Montre comment f'(x) varie", variant: "pente" }]} /> },
    { id: "mini-test", type: "mini-test", title: "Mini-test", icon: "🧪", content: (
      <MiniTest questions={[
        { question: "La dérivée de f(x) = 5x³ est :", options: ["15x²", "5x²", "15x³", "3x²"], correctIndex: 0, explanation: "(5x³)' = 3×5x² = 15x²." },
        { question: "Si f'(x₀) > 0, alors en x₀, f est :", options: ["Décroissante", "Croissante", "Constante", "Non définie"], correctIndex: 1, explanation: "f'(x₀) > 0 signifie que la pente est positive → f est croissante." },
      ]} />
    )},
    { id: "summary", type: "summary", title: "Résumé", icon: "📋", content: <Card className="border-border/50 bg-muted/30"><CardContent className="p-5"><ul className="text-sm text-muted-foreground space-y-1"><li>• f'(x) = pente de la tangente = taux d'accroissement</li><li>• f' &gt; 0 → croissante, f' &lt; 0 → décroissante, f' = 0 → extremum</li><li>• Tableau de signe de f' → tableau de variations de f</li><li>• Les dérivées usuelles sont essentielles à connaître</li></ul></CardContent></Card> },
    { id: "next-steps", type: "next-steps", title: "Que faut-il réviser ensuite ?", icon: "🔄", content: (
      <div className="space-y-3">
        {[{ topic: "Suites numériques", description: "Limites de suites et récurrence.", icon: "🔢" }, { topic: "Fonctions exponentielles", description: "L'exponentielle est sa propre dérivée.", icon: "𝑒" }, { topic: "Primitives et calcul intégral", description: "L'intégrale est l'opération inverse de la dérivée.", icon: "∫" }].map((item, i) => (
          <Card key={i} className="border-border/50 bg-card py-3 hover:border-primary/20 transition-colors"><CardContent className="flex items-start gap-3 px-4"><span className="text-xl">{item.icon}</span><div><p className="text-sm font-semibold text-foreground">{item.topic}</p><p className="text-xs text-muted-foreground mt-0.5">{item.description}</p></div></CardContent></Card>
        ))}
      </div>
    )},
  ];
}
