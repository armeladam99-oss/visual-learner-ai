"use client";
import type { LessonSection } from "@/types/lessons";
import { InteractiveGraph, GraphExplainer } from "@/components/visual/InteractiveGraph";
import { FormulaCard, ConceptCard, MethodCard, ExampleStep } from "@/components/visual/FormulaCard";
import { MiniTest } from "@/components/visual/MiniTest";
import { DrawMePanel } from "@/components/visual/DrawMePanel";
import { AITutorPanel } from "@/components/visual/AITutorPanel";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";

function refractionData(p: Record<string, number>) {
  const n1 = p.n1 ?? 1, n2 = p.n2 ?? 1.5;
  const pts = [];
  for (let i = 0; i <= 80; i++) { const theta = i * 0.01; const sinT2 = (n1/n2)*Math.sin(theta); if (Math.abs(sinT2) <= 1) pts.push({ x: Math.round(theta*100)/100, y: Math.round(Math.asin(sinT2)*100)/100 }); }
  return pts;
}

export function getPhysicsOndesLumineusesSections(): LessonSection[] {
  return [
    { id: "why-study", type: "why-study", title: "Pourquoi étudier cette leçon ?", icon: "🌍", content: (
      <div className="space-y-4 text-sm leading-relaxed text-muted-foreground">
        <p>La <strong className="text-foreground">propagation des ondes lumineuses</strong> est au cœur de l&apos;optique. Elle explique les arcs-en-ciel, le fonctionnement des lentilles, des lasers, et des fibres optiques.</p>
        <ConceptCard icon="💡" title="Applications concrètes" variant="info"><p>Lentilles et caméras, fibres optiques (Internet), lasers, holographie, écrans, panneaux solaires, spectroscopie (analyse chimique par la lumière).</p></ConceptCard>
      </div>
    )},
    { id: "objectives", type: "objectives", title: "Objectifs", icon: "🎯", content: <div className="space-y-3">{["Connaître la nature ondulatoire de la lumière", "Appliquer la loi de Snell-Descartes", "Comprendre la réflexion totale interne", "Interpréter les franges d'interférence"].map((o, i) => <div key={i} className="flex items-start gap-3 rounded-lg bg-primary/[0.03] border border-primary/10 px-4 py-3"><span className="flex-shrink-0 w-6 h-6 rounded-full bg-primary text-primary-foreground text-xs font-bold flex items-center justify-center mt-0.5">{i+1}</span><p className="text-sm text-foreground/80">{o}</p></div>)}</div> },
    { id: "prerequisites", type: "prerequisites", title: "Prérequis", icon: "🧠", content: <div className="space-y-3">{[{ label: "Ondes mécaniques périodiques", level: "maîtrisé" }, { label: "Trigonométrie (sin, cos)", level: "maîtrisé" }].map((p, i) => <div key={i} className="flex items-center gap-3 rounded-lg border border-border/50 bg-card px-4 py-3"><span className="text-lg">✅</span><span className="text-sm text-foreground/80">{p.label}</span><Badge variant="default" className="ml-auto text-[10px]">{p.level}</Badge></div>)}</div> },
    { id: "intro", type: "intro", title: "Introduction intuitive", icon: "📖", content: (
      <div className="space-y-4 text-sm leading-relaxed text-muted-foreground">
        <p>La lumière se comporte à la fois comme une <strong className="text-foreground">onde</strong> (interférences, diffraction) et comme un <strong className="text-foreground">flux de particules</strong> (photons, effet photoélectrique).</p>
        <p>En optique géométrique, on modélise la lumière par des <strong className="text-foreground">rayons</strong> rectilignes. En optique ondulatoire, on étudie les interférences et la diffraction.</p>
      </div>
    )},
    { id: "course", type: "course", title: "Cours complet", icon: "📚", content: (
      <div className="space-y-6">
        <FormulaCard title="Loi de Snell-Descartes" variant="highlighted" formulas={[
          { name: "Réflexion", expression: "θᵢ = θᵣ", description: "Angle d'incidence = angle de réflexion" },
          { name: "Réfraction", expression: "n₁ sin θ₁ = n₂ sin θ₂", description: "n = indice de réfraction" },
          { name: "Indice", expression: "n = c / v", description: "c = vitesse dans le vide, v = vitesse dans le milieu" },
        ]} />
        <ConceptCard icon="🔮" title="Réflexion totale interne" variant="info"><p>Quand un rayon passe d&apos;un milieu plus réfringent (n₁) vers un moins réfringent (n₂), au-delà de l&apos;angle limite θ_L = arcsin(n₂/n₁), il y a réflexion totale. C&apos;est le principe des fibres optiques.</p></ConceptCard>
        <ConceptCard icon="🌈" title="Interférences lumineuses" variant="tip"><p>Expérience de Young : une fente unique éclairée par une source monochromatique produit un réseau de franges alternativement claires (constructive) et sombres (destructives).</p></ConceptCard>
      </div>
    )},
    { id: "visualization", type: "visualization", title: "Visualisation interactive", icon: "📊", content: (
      <div className="space-y-6">
        <InteractiveGraph title="Angle de réfraction en fonction de l'angle d'incidence" description="Modifie les indices de réfraction pour observer l'effet sur la réfraction." params={[{ name: "n₁ (milieu 1)", symbol: "n1", min: 1, max: 2.5, step: 0.1, defaultValue: 1 }, { name: "n₂ (milieu 2)", symbol: "n2", min: 1, max: 2.5, step: 0.1, defaultValue: 1.5 }]} computePoints={refractionData} xLabel="θ₁ (rad)" yLabel="θ₂ (rad)" color="#d97706" />
        <GraphExplainer items={["L'axe horizontal est l'angle d'incidence θ₁ (en radians).", "L'axe vertical est l'angle de réfraction θ₂.", "Si n₁ < n₂ : la lumière se rapproche de la normale (θ₂ < θ₁).", "Si n₁ > n₂ : la lumière s'éloigne de la normale (θ₂ > θ₁).", "Au-delà de l'angle limite, plus de réfraction → réflexion totale."]} />
      </div>
    )},
    { id: "graph-explanation", type: "graph-explanation", title: "Interprétation", icon: "🔎", content: <div className="space-y-3 text-sm text-muted-foreground"><ConceptCard icon="🔍" title="Angle limite" variant="info"><p>θ_L = arcsin(n₂/n₁) si n₁ &gt; n₂. Au-delà de θ_L, pas de réfraction. Utilisé dans les fibres optiques pour guider la lumière.</p></ConceptCard></div> },
    { id: "formulas", type: "formulas", title: "Formules importantes", icon: "📐", content: <FormulaCard title="Optique ondulatoire" formulas={[
      { name: "Frange claire", expression: "Δx = nλ (écart de chemin)" },
      { name: "Frange sombre", expression: "Δx = (n+½)λ" },
      { name: "Angle limite", expression: "θ_L = arcsin(n₂/n₁) si n₁ > n₂" },
    ]} /> },
    { id: "methods", type: "methods", title: "Méthodes", icon: "🧠", content: <MethodCard number={1} title="Appliquer Snell-Descartes" steps={["Identifier n₁ et n₂ (indices des deux milieux)", "Mesurer ou donner θ₁ (angle d'incidence)", "Appliquer n₁ sin θ₁ = n₂ sin θ₂", "Vérifier si θ₁ < θ_L (sinon : réflexion totale)"]} /> },
    { id: "guided-example", type: "guided-example", title: "Exemple guidé", icon: "✏️", content: <div className="space-y-4"><Card className="border-border/50 bg-muted/30"><CardContent className="p-4"><p className="text-sm font-medium text-foreground">📝 Un rayon lumineux passe de l'air (n₁ = 1) dans le verre (n₂ = 1,5) avec θ₁ = 30°. Calculer θ₂.</p></CardContent></Card><div className="space-y-1"><ExampleStep step={1} title="Snell-Descartes" content={<p className="text-muted-foreground">1 × sin(30°) = 1,5 × sin(θ₂)</p>} /><ExampleStep step={2} title="Calculer" content={<p className="text-muted-foreground">sin(θ₂) = sin(30°)/1,5 = 0,5/1,5 = 0,333</p>} /><ExampleStep step={3} title="Résultat" isLast content={<p className="text-muted-foreground">θ₂ = arcsin(0,333) ≈ <strong className="text-foreground">19,47°</strong></p>} /></div></div> },
    { id: "hard-example", type: "hard-example", title: "Exemple difficile", icon: "🔥", content: <Card className="border-accent/30 bg-accent-[0.03]"><CardContent className="p-4"><p className="text-sm font-medium text-foreground">🔥 Calculer l'angle limite de la lumière dans une fibre optique en verre (n = 1,5) entourée d'air (n = 1).</p><p className="text-sm text-muted-foreground mt-2">θ_L = arcsin(n_air/n_verre) = arcsin(1/1,5) = arcsin(0,667) ≈ 41,8°. Au-delà de cet angle, la lumière reste piégée dans la fibre.</p></CardContent></Card> },
    { id: "common-mistakes", type: "common-mistakes", title: "Erreurs fréquentes", icon: "⚠️", content: <div className="space-y-3">{[{ mistake: "Confondre réflexion et réfraction", fix: "Réflexion : le rayon reste dans le même milieu. Réfraction : il passe dans l'autre milieu." }, { mistake: "Oublier les unités d'angle", fix: "Snell-Descartes utilise des degrés OU des radians, mais pas les deux dans la même équation." }].map((item, i) => <Card key={i} className="border-red-100 bg-red-50/30 py-3"><CardContent className="px-4 space-y-1"><p className="text-sm font-medium text-red-700 flex items-center gap-2"><span className="text-red-500">✗</span> {item.mistake}</p><p className="text-xs text-red-600/80 flex items-start gap-2"><span className="text-emerald-500 mt-0.5">✓</span> {item.fix}</p></CardContent></Card>)}</div> },
    { id: "exercises", type: "exercises", title: "Exercices progressifs", icon: "📝", content: <div className="space-y-4">{[{ level: "Fondamental", questions: ["Snell-Descartes avec n₁ = 1, n₂ = 1,33, θ₁ = 45°", "Calculer l'angle limite eau/air (n = 1,33)"] }, { level: "Intermédiaire", questions: ["Calculer l'écart entre deux franges dans l'expérience de Young", "Un rayon passe de l'eau (n=1,33) vers l'air. À quel angle a-t-il une réflexion totale ?"] }].map((g, gi) => <Card key={gi} className="border-border/50 bg-card py-4"><CardContent className="px-5 space-y-3"><Badge variant="secondary">{g.level}</Badge><ol className="space-y-2 text-sm text-muted-foreground">{g.questions.map((q, qi) => <li key={qi} className="flex gap-2"><span className="font-mono text-xs text-muted-foreground/60">{gi+1}.{qi+1}</span>{q}</li>)}</ol></CardContent></Card>)}</div> },
    { id: "ask-ai", type: "ask-ai", title: "Demander au Prof IA", icon: "🤖", content: <AITutorPanel subject="Physique — Ondes Lumineuses" /> },
    { id: "draw-me", type: "draw-me", title: "Dessine-moi", icon: "✏️", content: <DrawMePanel subject="physics" options={[{ label: "Réfraction (Snell-Descartes)", icon: "💡", description: "Visualise le passage d'un milieu à l'autre", variant: "mruvs-muv" }, { label: "Réflexion totale", icon: "🔮", description: "Angle limite et fibre optique", variant: "mruvs-muv-v" }]} /> },
    { id: "mini-test", type: "mini-test", title: "Mini-test", icon: "🧪", content: <MiniTest questions={[
      { question: "La loi de Snell-Descartes pour la réfraction est :", options: ["n₁ cos θ₁ = n₂ cos θ₂", "n₁ sin θ₁ = n₂ sin θ₂", "n₁ × n₂ = sin θ₁ × sin θ₂", "θ₁ = θ₂"], correctIndex: 1, explanation: "Snell-Descartes : n₁ sin θ₁ = n₂ sin θ₂." },
      { question: "La réflexion totale se produit quand :", options: ["n₁ < n₂ et θ₁ > θ_L", "n₁ > n₂ et θ₁ > θ_L", "n₁ = n₂", "θ₁ = 0"], correctIndex: 1, explanation: "Il faut passer d'un milieu plus réfringent vers un moins réfringent (n₁ > n₂) ET dépasser l'angle limite." },
    ]} /> },
    { id: "summary", type: "summary", title: "Résumé", icon: "📋", content: <Card className="border-border/50 bg-muted/30"><CardContent className="p-5"><ul className="text-sm text-muted-foreground space-y-1"><li>• Snell-Descartes : n₁ sin θ₁ = n₂ sin θ₂</li><li>• Réflexion : θᵢ = θᵣ</li><li>• Réflexion totale si n₁ &gt; n₂ et θ₁ &gt; θ_L</li><li>• Interférences : Δx = nλ → clair, Δx = (n+½)λ → sombre</li></ul></CardContent></Card> },
    { id: "next-steps", type: "next-steps", title: "Que faut-il réviser ensuite ?", icon: "🔄", content: <div className="space-y-3">{[{ topic: "Transformations nucléaires", description: "Radioactivité et énergie nucléaire.", icon: "☢️" }, { topic: "Acido-basique", description: "Dosage et pH.", icon: "⚗️" }].map((item, i) => <Card key={i} className="border-border/50 bg-card py-3 hover:border-primary/20 transition-colors"><CardContent className="flex items-start gap-3 px-4"><span className="text-xl">{item.icon}</span><div><p className="text-sm font-semibold text-foreground">{item.topic}</p><p className="text-xs text-muted-foreground mt-0.5">{item.description}</p></div></CardContent></Card>)}</div> },
  ];
}
