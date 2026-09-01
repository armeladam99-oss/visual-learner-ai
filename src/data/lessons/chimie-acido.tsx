"use client";
import type { LessonSection } from "@/types/lessons";
import { InteractiveGraph, GraphExplainer } from "@/components/visual/InteractiveGraph";
import { FormulaCard, ConceptCard, MethodCard, ExampleStep } from "@/components/visual/FormulaCard";
import { MiniTest } from "@/components/visual/MiniTest";
import { DrawMePanel } from "@/components/visual/DrawMePanel";
import { ProfessionalAITutor } from "@/components/visual/ProfessionalAITutor";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";

function dosageData() {
  const pts = [];
  for (let v = 0; v <= 50; v += 0.5) {
    let pH: number;
    if (v < 24) pH = 2 + (v/24)*2;
    else if (v <= 26) pH = 4 + ((v-24)/2)*6;
    else pH = 10 + Math.min((v-26)/24*3, 3);
    pts.push({ x: Math.round(v*100)/100, y: Math.round(pH*100)/100 });
  }
  return pts;
}

export function getChimieAcidoSections(): LessonSection[] {
  return [
    { id: "why-study", type: "why-study", title: "Pourquoi étudier cette leçon ?", icon: "🌍", content: (
      <div className="space-y-4 text-sm leading-relaxed text-muted-foreground">
        <p>Les <strong className="text-foreground">réactions acido-basiques</strong> sont omniprésentes : digestion, produits ménagers, traitement de l&apos;eau, pH du sang, industrie alimentaire.</p>
        <ConceptCard icon="🔬" title="Applications" variant="info"><p>Dosage du chlore dans une piscine, contrôle du pH sanguin (7,35-7,45), fabrication du savon, traitement des eaux usées, vinification.</p></ConceptCard>
      </div>
    )},
    { id: "objectives", type: "objectives", title: "Objectifs", icon: "🎯", content: <div className="space-y-3">{["Définir acide, base, pH", "Connaître les réactions acido-basiques courantes", "Réaliser un dosage acido-basique", "Interpréter une courbe de titrage"].map((o, i) => <div key={i} className="flex items-start gap-3 rounded-lg bg-primary/[0.03] border border-primary/10 px-4 py-3"><span className="flex-shrink-0 w-6 h-6 rounded-full bg-primary text-primary-foreground text-xs font-bold flex items-center justify-center mt-0.5">{i+1}</span><p className="text-sm text-foreground/80">{o}</p></div>)}</div> },
    { id: "prerequisites", type: "prerequisites", title: "Prérequis", icon: "🧠", content: <div className="space-y-3">{[{ label: "Notion de mole", level: "maîtrisé" }, { label: "Concentration molaire", level: "maîtrisé" }].map((p, i) => <div key={i} className="flex items-center gap-3 rounded-lg border border-border/50 bg-card px-4 py-3"><span className="text-lg">✅</span><span className="text-sm text-foreground/80">{p.label}</span><Badge variant="default" className="ml-auto text-[10px]">{p.level}</Badge></div>)}</div> },
    { id: "intro", type: "intro", title: "Introduction intuitive", icon: "📖", content: (
      <div className="space-y-4 text-sm leading-relaxed text-muted-foreground">
        <p>Le <strong className="text-foreground">pH</strong> mesure l&apos;acidité ou l&apos;alcalinité d&apos;une solution. pH &lt; 7 → acide. pH = 7 → neutre. pH &gt; 7 → basique.</p>
        <div className="flex justify-center py-3"><code className="text-base font-mono font-bold text-primary bg-primary/5 px-6 py-3 rounded-xl border border-primary/10">pH = −log[H₃O⁺]</code></div>
        <p>Un <strong className="text-foreground">dosage acido-basique</strong> consiste à ajouter progressivement une solution titrée (de concentration connue) dans une solution à doser.</p>
      </div>
    )},
    { id: "course", type: "course", title: "Cours complet", icon: "📚", content: (
      <div className="space-y-6">
        <FormulaCard title="Formules fondamentales" variant="highlighted" formulas={[
          { name: "pH", expression: "pH = −log[H₃O⁺]" },
          { name: "pOH", expression: "pOH = −log[OH⁻]" },
          { name: "Relation", expression: "pH + pOH = 14 (à 25°C)" },
          { name: "Acide fort", expression: "HA → H⁺ + A⁻ (dissociation totale)" },
          { name: "Base forte", expression: "BOH → B⁺ + OH⁻ (dissociation totale)" },
        ]} />
        <ConceptCard icon="⚗️" title="Réaction acido-basique" variant="info"><p>Acide + Base → Sel + Eau<br/>HCl + NaOH → NaCl + H₂O<br/>Le point d&apos;équivalence correspond à la stœchiométrie exacte de la réaction.</p></ConceptCard>
        <ConceptCard icon="📊" title="Courbe de titrage" variant="tip"><p>Le pH reste bas (acide) puis monte brutalement au point d&apos;équivalence, puis se stabilise. La zone de brusque variation indique le point d&apos;équivalence.</p></ConceptCard>
      </div>
    )},
    { id: "visualization", type: "visualization", title: "Visualisation interactive", icon: "📊", content: (
      <div className="space-y-6">
        <InteractiveGraph title="Courbe de titrage acido-basique" description="pH en fonction du volume de solution titrante ajoutée." params={[]} computePoints={() => dosageData()} xLabel="V (mL)" yLabel="pH" xDomain={[0, 50]} yDomain={[0, 14]} color="#d97706" variant="area" />
        <GraphExplainer items={["L'axe horizontal : volume de solution titrante (mL).", "L'axe vertical : pH de la solution.", "Avant le point d'équivalence : pH reste bas (excès d'acide).", "Au point d'équivalence (~25 mL) : pH monte brutalement.", "Après : pH se stabilise vers 11 (excès de base).", "La zone de variation rapide indique le point d'équivalence."]} />
      </div>
    )},
    { id: "graph-explanation", type: "graph-explanation", title: "Interprétation", icon: "🔎", content: <div className="space-y-3 text-sm text-muted-foreground"><ConceptCard icon="🔍" title="Lire la courbe de dosage" variant="info"><p>La tangente à la courbe au point d&apos;équivalence est verticale. On détermine ce point en construisant les tangentes aux points d&apos;inflexion de la courbe.</p></ConceptCard></div> },
    { id: "formulas", type: "formulas", title: "Formules importantes", icon: "📐", content: <FormulaCard title="Acido-basique" formulas={[
      { name: "pH", expression: "pH = −log[H₃O⁺]" },
      { name: "Dosage", expression: "C_acide × V_acide = C_base × V_base" },
      { name: "Point équivalence", expression: "n_acide = n_base (stœchiométrie 1:1 pour monofonctionnel)" },
    ]} /> },
    { id: "methods", type: "methods", title: "Méthodes", icon: "🧠", content: <MethodCard number={1} title="Réaliser un dosage" steps={["Mesurer le volume V₀ de la solution à doser", "Verser la solution titrante goutte à goutte", "Mesurer le pH à chaque ajout", "Tracer la courbe pH = f(V)", "Déterminer le point d'équivalence par tangentes"]} /> },
    { id: "guided-example", type: "guided-example", title: "Exemple guidé", icon: "✏️", content: <div className="space-y-4"><Card className="border-border/50 bg-muted/30"><CardContent className="p-4"><p className="text-sm font-medium text-foreground">📝 50 mL de HCl 0,1 mol/L sont dosés par NaOH 0,1 mol/L. Quel volume de NaOH faut-il ?</p></CardContent></Card><div className="space-y-1"><ExampleStep step={1} title="Stœchiométrie" content={<p className="text-muted-foreground">HCl + NaOH → NaCl + H₂O. Rapport 1:1.</p>} /><ExampleStep step={2} title="Application" content={<p className="text-muted-foreground">C₁V₁ = C₂V₂ → 0,1 × 50 = 0,1 × V₂</p>} /><ExampleStep step={3} title="Résultat" isLast content={<p className="text-muted-foreground">V₂ = <strong className="text-foreground">50 mL</strong></p>} /></div></div> },
    { id: "hard-example", type: "hard-example", title: "Exemple difficile", icon: "🔥", content: <Card className="border-accent/30 bg-accent-[0.03]"><CardContent className="p-4"><p className="text-sm font-medium text-foreground">🔥 20 mL de CH₃COOH 0,1 mol/L (acide faible, Ka = 1,8×10⁻⁵) sont dosés par NaOH 0,1 mol/L. Déterminer le pH au point d'équivalence.</p><p className="text-sm text-muted-foreground mt-2">Au point d'équivalence, on a 20 mL de CH₃COONa 0,05 mol/L. C&apos;est un sel d&apos;acide faible et base forte → solution basique. pH = 7 + ½(pKa − pC) ≈ 8,72.</p></CardContent></Card> },
    { id: "common-mistakes", type: "common-mistakes", title: "Erreurs fréquentes", icon: "⚠️", content: <div className="space-y-3">{[{ mistake: "Confondre pH = 7 et point d'équivalence", fix: "Le point d'équivalence est à pH = 7 seulement pour acide fort + base fort. Sinon, il peut être > 7 ou < 7." }, { mistake: "Oublier les unités de concentration", fix: "Toujours travailler en mol/L. Convertir les mg/L en mol/L si nécessaire." }].map((item, i) => <Card key={i} className="border-red-100 bg-red-50/30 py-3"><CardContent className="px-4 space-y-1"><p className="text-sm font-medium text-red-700 flex items-center gap-2"><span className="text-red-500">✗</span> {item.mistake}</p><p className="text-xs text-red-600/80 flex items-start gap-2"><span className="text-emerald-500 mt-0.5">✓</span> {item.fix}</p></CardContent></Card>)}</div> },
    { id: "exercises", type: "exercises", title: "Exercices progressifs", icon: "📝", content: <div className="space-y-4">{[{ level: "Fondamental", questions: ["Calculer le pH d'une solution de HCl 0,01 mol/L", "Quel volume de NaOH 0,5 mol/L pour neutraliser 100 mL de HCl 0,1 mol/L ?"] }, { level: "Intermédiaire", questions: ["Tracer la courbe de dosage de 50 mL de CH₃COOH 0,1 M par NaOH 0,1 M", "Calculer le pH avant, au point d'équivalence et après le dosage"] }].map((g, gi) => <Card key={gi} className="border-border/50 bg-card py-4"><CardContent className="px-5 space-y-3"><Badge variant="secondary">{g.level}</Badge><ol className="space-y-2 text-sm text-muted-foreground">{g.questions.map((q, qi) => <li key={qi} className="flex gap-2"><span className="font-mono text-xs text-muted-foreground/60">{gi+1}.{qi+1}</span>{q}</li>)}</ol></CardContent></Card>)}</div> },
    { id: "ask-ai", type: "ask-ai", title: "Demander au Prof IA", icon: "🤖", content: <ProfessionalAITutor subject="Chimie — Acido-basique" subjectKey="chemistry" /> },
    { id: "draw-me", type: "draw-me", title: "Dessine-moi", icon: "✏️", content: <DrawMePanel subject="chemistry" options={[{ label: "Courbe de dosage", icon: "⚗️", description: "pH vs volume", variant: "dosage" }, { label: "Courbe de dilution", icon: "💧", description: "Concentration vs volume", variant: "dilution" }, { label: "Manipulation dosage", icon: "🔬", description: "Burette interactive avec gouttes", variant: "lab-titration" }, { label: "Structure H₂O", icon: "⚛️", description: "Molécule d'eau interactive", variant: "molecule-water" }, { label: "Structure HCl", icon: "⚛️", description: "Acide chlorhydrique", variant: "molecule-hcl" }, { label: "Structure NaCl", icon: "⚛️", description: "Chlorure de sodium", variant: "molecule-nacl" }, { label: "pH-mètre", icon: "🧪", description: "Instrument de mesure du pH", variant: "lab-ph" }]} /> },
    { id: "mini-test", type: "mini-test", title: "Mini-test", icon: "🧪", content: <MiniTest questions={[
      { question: "pH = −log[H₃O⁺]. Si [H₃O⁺] = 0,001 mol/L, pH = ?", options: ["1", "2", "3", "4"], correctIndex: 2, explanation: "pH = −log(10⁻³) = 3." },
      { question: "Au point d'équivalence d'un dosage HCl/NaOH :", options: ["pH < 7", "pH = 7", "pH > 7", "pH = 14"], correctIndex: 1, explanation: "HCl (acide fort) + NaOH (base forte) → pH = 7 au point d'équivalence." },
    ]} /> },
    { id: "summary", type: "summary", title: "Résumé", icon: "📋", content: <Card className="border-border/50 bg-muted/30"><CardContent className="p-5"><ul className="text-sm text-muted-foreground space-y-1"><li>• pH = −log[H₃O⁺] ; pH &lt; 7 acide, = 7 neutre, &gt; 7 basique</li><li>• Dosage : C₁V₁ = C₂V₂ (stœchiométrie)</li><li>• Point d&apos;équivalence : n_acide = n_base</li><li>• Courbe de titrage : zone de brusque variation au point équivalence</li></ul></CardContent></Card> },
    { id: "next-steps", type: "next-steps", title: "Que faut-il réviser ensuite ?", icon: "🔄", content: <div className="space-y-3">{[{ topic: "Suivi temporel", description: "Cinétique chimique et vitesse de réaction.", icon: "⏱️" }, { topic: "Transformations nucléaires", description: "Radioactivité et énergie nucléaire.", icon: "☢️" }].map((item, i) => <Card key={i} className="border-border/50 bg-card py-3 hover:border-primary/20 transition-colors"><CardContent className="flex items-start gap-3 px-4"><span className="text-xl">{item.icon}</span><div><p className="text-sm font-semibold text-foreground">{item.topic}</p><p className="text-xs text-muted-foreground mt-0.5">{item.description}</p></div></CardContent></Card>)}</div> },
  ];
}
