"use client";
import type { LessonSection } from "@/types/lessons";
import { InteractiveGraph, GraphExplainer } from "@/components/visual/InteractiveGraph";
import { FormulaCard, ConceptCard, MethodCard, ExampleStep } from "@/components/visual/FormulaCard";
import { MiniTest } from "@/components/visual/MiniTest";
import { DrawMePanel } from "@/components/visual/DrawMePanel";
import { ProfessionalAITutor } from "@/components/visual/ProfessionalAITutor";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";

function kineticsData() {
  const pts = [];
  for (let t = 0; t <= 60; t += 1) {
    const C = 1.0 * Math.exp(-0.05 * t);
    pts.push({ x: t, y: Math.round(C * 1000) / 1000 });
  }
  return pts;
}

export function getChimieSuiviSections(): LessonSection[] {
  return [
    { id: "why-study", type: "why-study", title: "Pourquoi étudier cette leçon ?", icon: "🌍", content: (
      <div className="space-y-4 text-sm leading-relaxed text-muted-foreground">
        <p>Le <strong className="text-foreground">suivi temporel</strong> permet de comprendre comment évolue une réaction chimique au cours du temps. C&apos;est la base de la <strong className="text-foreground">cinétique chimique</strong>.</p>
        <ConceptCard icon="🔬" title="Applications concrètes" variant="info"><p>Dégradation des médicaments, conservation des aliments, vieillissement des matériaux, réactions industrielles,pollution atmosphérique.</p></ConceptCard>
      </div>
    )},
    { id: "objectives", type: "objectives", title: "Objectifs", icon: "🎯", content: <div className="space-y-3">{["Définir la vitesse de réaction", "Mesurer l'évolution d'une concentration dans le temps", "Déterminer l'ordre d'une réaction", "Calculer la demi-vie d'une réaction"].map((o, i) => <div key={i} className="flex items-start gap-3 rounded-lg bg-primary/[0.03] border border-primary/10 px-4 py-3"><span className="flex-shrink-0 w-6 h-6 rounded-full bg-primary text-primary-foreground text-xs font-bold flex items-center justify-center mt-0.5">{i+1}</span><p className="text-sm text-foreground/80">{o}</p></div>)}</div> },
    { id: "prerequisites", type: "prerequisites", title: "Prérequis", icon: "🧠", content: <div className="space-y-3">{[{ label: "Notion de concentration", level: "maîtrisé" }, { label: "Équations chimiques", level: "maîtrisé" }].map((p, i) => <div key={i} className="flex items-center gap-3 rounded-lg border border-border/50 bg-card px-4 py-3"><span className="text-lg">✅</span><span className="text-sm text-foreground/80">{p.label}</span><Badge variant="default" className="ml-auto text-[10px]">{p.level}</Badge></div>)}</div> },
    { id: "intro", type: "intro", title: "Introduction intuitive", icon: "📖", content: (
      <div className="space-y-4 text-sm leading-relaxed text-muted-foreground">
        <p>Imagine une réaction chimique dans un flacon. On mesure la concentration d&apos;un réactif à intervalles réguliers. Au fil du temps, le réactif est consommé et sa concentration diminue.</p>
        <div className="flex justify-center py-3"><code className="text-base font-mono font-bold text-primary bg-primary/5 px-6 py-3 rounded-xl border border-primary/10">v = −d[A]/dt</code></div>
        <p>La <strong className="text-foreground">vitesse de réaction</strong> mesure la variation de concentration par unité de temps. Elle dépend de la concentration, de la température et de la présence de catalyseurs.</p>
      </div>
    )},
    { id: "course", type: "course", title: "Cours complet", icon: "📚", content: (
      <div className="space-y-6">
        <FormulaCard title="Formules fondamentales" variant="highlighted" formulas={[
          { name: "Vitesse", expression: "v = −Δ[A]/Δt = +Δ[P]/Δt" },
          { name: "Ordre 0", expression: "[A] = [A]₀ − k·t" },
          { name: "Ordre 1", expression: "[A] = [A]₀·e^(−k·t)" },
          { name: "Demi-vie (ordre 1)", expression: "t½ = ln(2)/k ≈ 0,693/k" },
          { name: "Loi de vitesse", expression: "v = k·[A]ⁿ (n = ordre)" },
        ]} />
        <ConceptCard icon="⏱️" title="Suivi par conductimétrie" variant="info"><p>Pour les réactions ioniques, on peut suivre l&apos;évolution de la conductivité électrique. Plus il y a d&apos;ions en solution, plus la conductivité est élevée.</p></ConceptCard>
        <ConceptCard icon="📊" title="Ordre de réaction" variant="tip"><p>L&apos;ordre d&apos;une réaction est la somme des exposants dans la loi de vitesse. Il se détermine expérimentalement et non par la stœchiométrie.</p></ConceptCard>
      </div>
    )},
    { id: "visualization", type: "visualization", title: "Visualisation interactive", icon: "📊", content: (
      <div className="space-y-6">
        <InteractiveGraph title="Suivi temporel — Décroissance exponentielle" description="Concentration du réactif en fonction du temps (ordre 1)." params={[{ symbol: "k", name: "Constante de vitesse k", min: 0.01, max: 0.15, step: 0.01, defaultValue: 0.05 }]} computePoints={(params) => { const k = params.k || 0.05; const pts = []; for (let t = 0; t <= 60; t += 1) { pts.push({ x: t, y: Math.round(1.0 * Math.exp(-k * t) * 1000) / 1000 }); } return pts; }} xLabel="t (min)" yLabel="[A] (mol/L)" xDomain={[0, 60]} yDomain={[0, 1.1]} color="#0891b2" variant="area" />
        <GraphExplainer items={["L'axe horizontal : temps en minutes.", "L'axe vertical : concentration du réactif [A] en mol/L.", "La courbe décroît exponentiellement (ordre 1).", "Plus k est grand, plus la réaction est rapide.", "Le point à t = 0 correspond à la concentration initiale [A]₀.", "On peut lire directement la demi-vie sur le graphique (t quand [A] = [A]₀/2)."]} />
      </div>
    )},
    { id: "graph-explanation", type: "graph-explanation", title: "Interprétation", icon: "🔎", content: <div className="space-y-3 text-sm text-muted-foreground"><ConceptCard icon="🔍" title="Lire le graphique cinétique" variant="info"><p>Pour une réaction d&apos;ordre 1, le graphe ln[A] = f(t) est une droite de pente −k. C&apos;est une méthode courante pour déterminer l&apos;ordre et la constante de vitesse.</p></ConceptCard></div> },
    { id: "formulas", type: "formulas", title: "Formules importantes", icon: "📐", content: <FormulaCard title="Cinétique chimique" formulas={[
      { name: "Ordre 0", expression: "[A] = [A]₀ − k·t", description: "Graphe [A] vs t est une droite" },
      { name: "Ordre 1", expression: "[A] = [A]₀·e^(−k·t)", description: "Graphe ln[A] vs t est une droite" },
      { name: "Demi-vie", expression: "t½ = [A]₀ / (2k) (ordre 0) ou t½ = ln(2)/k (ordre 1)" },
    ]} /> },
    { id: "methods", type: "methods", title: "Méthodes", icon: "🧠", content: <MethodCard number={1} title="Déterminer l'ordre d'une réaction" steps={["Mesurer [A] à différents instants t", "Tracer [A] = f(t), ln[A] = f(t) et 1/[A] = f(t)", "Le graphique qui donne une droite indique l'ordre", "Calculer k à partir de la pente", "Vérifier avec la demi-vie"]} /> },
    { id: "guided-example", type: "guided-example", title: "Exemple guidé", icon: "✏️", content: <div className="space-y-4"><Card className="border-border/50 bg-muted/30"><CardContent className="p-4"><p className="text-sm font-medium text-foreground">📝 Une réaction suit une cinétique d'ordre 1 avec k = 0,02 min⁻¹. [A]₀ = 0,5 mol/L. Calculer [A] après 30 min.</p></CardContent></Card><div className="space-y-1"><ExampleStep step={1} title="Formule" content={<p className="text-muted-foreground">[A] = [A]₀·e^(−k·t)</p>} /><ExampleStep step={2} title="Remplacement" content={<p className="text-muted-foreground">[A] = 0,5 × e^(−0,02 × 30) = 0,5 × e^(−0,6)</p>} /><ExampleStep step={3} title="Résultat" isLast content={<p className="text-muted-foreground">[A] = 0,5 × 0,549 = <strong className="text-foreground">0,274 mol/L</strong></p>} /></div></div> },
    { id: "hard-example", type: "hard-example", title: "Exemple difficile", icon: "🔥", content: <Card className="border-accent/30 bg-accent/[0.03]"><CardContent className="p-4"><p className="text-sm font-medium text-foreground">🔥 La décomposition de H₂O₂ est d'ordre 1. Après 10 min, la concentration est passée de 0,8 à 0,2 mol/L. Calculer k et la demi-vie.</p><p className="text-sm text-muted-foreground mt-2">ln(0,2/0,8) = −k × 10 → ln(0,25) = −k × 10 → k = 0,139 min⁻¹. t½ = ln(2)/0,139 ≈ 5 min.</p></CardContent></Card> },
    { id: "common-mistakes", type: "common-mistakes", title: "Erreurs fréquentes", icon: "⚠️", content: <div className="space-y-3">{[{ mistake: "Confondre ordre stœchiométrique et ordre cinétique", fix: "L'ordre cinétique est expérimental, il ne correspond pas forcément aux coefficients stœchiométriques." }, { mistake: "Utiliser la mauvaise formule pour la demi-vie", fix: "Ordre 0 : t½ = [A]₀/(2k). Ordre 1 : t½ = ln(2)/k. Ne pas confondre !" }].map((item, i) => <Card key={i} className="border-red-100 bg-red-50/30 py-3"><CardContent className="px-4 space-y-1"><p className="text-sm font-medium text-red-700 flex items-center gap-2"><span className="text-red-500">✗</span> {item.mistake}</p><p className="text-xs text-red-600/80 flex items-start gap-2"><span className="text-emerald-500 mt-0.5">✓</span> {item.fix}</p></CardContent></Card>)}</div> },
    { id: "exercises", type: "exercises", title: "Exercices progressifs", icon: "📝", content: <div className="space-y-4">{[{ level: "Fondamental", questions: ["Une réaction d'ordre 0 a k = 0,05 mol/L/min. [A]₀ = 1 mol/L. Quand [A] = 0 ?", "Une réaction d'ordre 1 a t½ = 20 min. Quelle est la concentration après 40 min ?"] }, { level: "Intermédiaire", questions: ["Déterminer l'ordre de réaction à partir des données expérimentales", "Calculer k et la demi-vie à partir d'un graphique ln[A] vs t"] }].map((g, gi) => <Card key={gi} className="border-border/50 bg-card py-4"><CardContent className="px-5 space-y-3"><Badge variant="secondary">{g.level}</Badge><ol className="space-y-2 text-sm text-muted-foreground">{g.questions.map((q, qi) => <li key={qi} className="flex gap-2"><span className="font-mono text-xs text-muted-foreground/60">{gi+1}.{qi+1}</span>{q}</li>)}</ol></CardContent></Card>)}</div> },
    { id: "ask-ai", type: "ask-ai", title: "Demander au Prof IA", icon: "🤖", content: <ProfessionalAITutor subject="Chimie — Suivi temporel" subjectKey="chemistry" /> },
    { id: "draw-me", type: "draw-me", title: "Dessine-moi", icon: "✏️", content: <DrawMePanel subject="chemistry" options={[{ label: "Décroissance exponentielle", icon: "📉", description: "[A] vs t pour ordre 1", variant: "kinetics" }, { label: "Suivi temporel interactif", icon: "⏱️", description: "Modifie k et observe l'effet", variant: "temporel" }, { label: "Structure CO₂", icon: "⚛️", description: "Dioxyde de carbone", variant: "molecule-co2" }, { label: "Structure CH₄", icon: "⚛️", description: "Méthane - tétrédrique", variant: "molecule-co2" }, { label: "Fiole graduée", icon: "🧪", description: "Matériel de laboratoire", variant: "lab-beaker" }, { label: "Dosage cinétique", icon: "🔬", description: "Suivi du dosage en temps réel", variant: "lab-titration" }]} /> },
    { id: "mini-test", type: "mini-test", title: "Mini-test", icon: "🧪", content: <MiniTest questions={[
      { question: "Pour une réaction d'ordre 1, le graphique de ln[A] vs t est :", options: ["Une parabole", "Une droite", "Une exponentielle", "Un cercle"], correctIndex: 1, explanation: "Pour une réaction d'ordre 1, ln[A] = ln[A]₀ − k·t, ce qui est une droite de pente −k." },
      { question: "La demi-vie d'une réaction d'ordre 1 dépend de :", options: ["La concentration initiale", "La constante de vitesse k uniquement", "La température uniquement", "Le volume du réacteur"], correctIndex: 1, explanation: "Pour une réaction d'ordre 1, t½ = ln(2)/k, indépendante de la concentration." },
    ]} /> },
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

    { id: "summary", type: "summary", title: "Résumé", icon: "📋", content: <Card className="border-border/50 bg-muted/30"><CardContent className="p-5"><ul className="text-sm text-muted-foreground space-y-1"><li>• v = −d[A]/dt = taux de disparition du réactif</li><li>• Ordre 0 : [A] décroît linéairement</li><li>• Ordre 1 : [A] décroît exponentiellement, ln[A] linéaire</li><li>• t½ = ln(2)/k pour l'ordre 1 (indépendant de [A]₀)</li></ul></CardContent></Card> },
    { id: "next-steps", type: "next-steps", title: "Que faut-il réviser ensuite ?", icon: "🔄", content: <div className="space-y-3">{[{ topic: "Réactions acido-basiques", description: "Dosage et courbes de titrage.", icon: "⚗️" }, { topic: "Transformations nucléaires", description: "Radioactivité et décroissance.", icon: "☢️" }].map((item, i) => <Card key={i} className="border-border/50 bg-card py-3 hover:border-primary/20 transition-colors"><CardContent className="flex items-start gap-3 px-4"><span className="text-xl">{item.icon}</span><div><p className="text-sm font-semibold text-foreground">{item.topic}</p><p className="text-xs text-muted-foreground mt-0.5">{item.description}</p></div></CardContent></Card>)}</div> },
  ];
}
