"use client";
import type { LessonSection } from "@/types/lessons";
import { InteractiveGraph, GraphExplainer } from "@/components/visual/InteractiveGraph";
import { FormulaCard, ConceptCard, MethodCard, ExampleStep } from "@/components/visual/FormulaCard";
import { MiniTest } from "@/components/visual/MiniTest";
import { DrawMePanel } from "@/components/visual/DrawMePanel";
import { ProfessionalAITutor } from "@/components/visual/ProfessionalAITutor";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";

function decayData(halfLife: number, maxT: number) {
  const pts = [];
  const N0 = 1000;
  for (let t = 0; t <= maxT; t += 1) {
    const N = N0 * Math.exp(-Math.LN2 * t / halfLife);
    pts.push({ x: t, y: Math.round(N * 10) / 10 });
  }
  return pts;
}

export function getChimieNucleaireSections(): LessonSection[] {
  return [
    { id: "why-study", type: "why-study", title: "Pourquoi étudier cette leçon ?", icon: "🌍", content: (
      <div className="space-y-4 text-sm leading-relaxed text-muted-foreground">
        <p>Les <strong className="text-foreground">transformations nucléaires</strong> concernent les modifications du noyau d&apos;un atome. Elles sont à la base de l&apos;énergie nucléaire, de la datation au carbone 14, de la médecine nucléaire et de la compréhension de l&apos;univers.</p>
        <ConceptCard icon="🔬" title="Applications concrètes" variant="info"><p>Énergie nucléaire (fission), fusion solaire, datation C-14, imagerie médicale (TDM, PET), traitement du cancer (radiothérapie).</p></ConceptCard>
      </div>
    )},
    { id: "objectives", type: "objectives", title: "Objectifs", icon: "🎯", content: <div className="space-y-3">{["Distinguer radioactivité α, β et γ", "Écrire des équations de désintégration", "Calculer l'activité et la demi-vie", "Comprendre la fission et la fusion nucléaire"].map((o, i) => <div key={i} className="flex items-start gap-3 rounded-lg bg-primary/[0.03] border border-primary/10 px-4 py-3"><span className="flex-shrink-0 w-6 h-6 rounded-full bg-primary text-primary-foreground text-xs font-bold flex items-center justify-center mt-0.5">{i+1}</span><p className="text-sm text-foreground/80">{o}</p></div>)}</div> },
    { id: "prerequisites", type: "prerequisites", title: "Prérequis", icon: "🧠", content: <div className="space-y-3">{[{ label: "Structure de l'atome", level: "maîtrisé" }, { label: "Notion de mole", level: "connu" }].map((p, i) => <div key={i} className="flex items-center gap-3 rounded-lg border border-border/50 bg-card px-4 py-3"><span className="text-lg">✅</span><span className="text-sm text-foreground/80">{p.label}</span><Badge variant="default" className="ml-auto text-[10px]">{p.level}</Badge></div>)}</div> },
    { id: "intro", type: "intro", title: "Introduction intuitive", icon: "📖", content: (
      <div className="space-y-4 text-sm leading-relaxed text-muted-foreground">
        <p>Le noyau d&apos;un atome est composé de protons et de neutrons (nucléons). Certains noyaux sont stables, d&apos;autres sont instables et se transforment en émettant des particules : c&apos;est la <strong className="text-foreground">radioactivité</strong>.</p>
        <div className="flex justify-center py-3"><code className="text-base font-mono font-bold text-primary bg-primary/5 px-6 py-3 rounded-xl border border-primary/10">N = N₀ × e^(−λt)</code></div>
        <p>La <strong className="text-foreground">désintégration</strong> est un processus aléatoire au niveau de chaque noyau, mais statistiquement prévisible pour un grand nombre de noyaux.</p>
      </div>
    )},
    { id: "course", type: "course", title: "Cours complet", icon: "📚", content: (
      <div className="space-y-6">
        <FormulaCard title="Formules fondamentales" variant="highlighted" formulas={[
          { name: "Loi de désintégration", expression: "N = N₀ × e^(−λt)" },
          { name: "Activité", expression: "A = λ × N (en Becquerel)" },
          { name: "Demi-vie", expression: "t½ = ln(2)/λ ≈ 0,693/λ" },
          { name: "Énergie", expression: "E = mc² (équivalence masse-énergie)" },
        ]} />
        <ConceptCard icon="☢️" title="Types de radioactivité" variant="info"><p><strong>α</strong> : émission d&apos;un noyau d&apos;hélium (₂⁴He).<br/><strong>β⁻</strong> : un neutron se transforme en proton + électron.<br/><strong>β⁺</strong> : un proton se transforme en neutron + positron.<br/><strong>γ</strong> : émission de photons de haute énergie (pas de changement de Z ni A).</p></ConceptCard>
        <ConceptCard icon="⚖️" title="Fission vs Fusion" variant="tip"><p><strong>Fission</strong> : un noyau lourd se divise en noyaux plus légers (+ énergie). Réaction en chaîne dans les réacteurs.<br/><strong>Fusion</strong> : deux noyaux légers fusionnent en un noyau plus lourd (+ énergie). C&apos;est ce qui se passe dans le Soleil.</p></ConceptCard>
      </div>
    )},
    { id: "visualization", type: "visualization", title: "Visualisation interactive", icon: "📊", content: (
      <div className="space-y-6">
        <InteractiveGraph title="Décroissance radioactive" description="Nombre de noyaux restants en fonction du temps." params={[{ symbol: "hl", name: "Demi-vie (années)", min: 1, max: 50, step: 1, defaultValue: 10 }]} computePoints={(params) => { const hl = params.hl || 10; return decayData(hl, 60); }} xLabel="t (années)" yLabel="N (noyaux)" xDomain={[0, 60]} yDomain={[0, 1050]} color="#dc2626" variant="area" />
        <GraphExplainer items={["L'axe horizontal : temps en années.", "L'axe vertical : nombre de noyaux non désintégrés.", "La courbe décroît exponentiellement.", "Après une demi-vie, la moitié des noyaux ont disparu.", "Après 2 demi-vies, il reste 25%, etc.", "On peut déterminer la demi-vie en trouvant t quand N = N₀/2."]} />
      </div>
    )},
    { id: "graph-explanation", type: "graph-explanation", title: "Interprétation", icon: "🔎", content: <div className="space-y-3 text-sm text-muted-foreground"><ConceptCard icon="🔍" title="Lire le graphique de décroissance" variant="info"><p>Le graphique ln(N) vs t est une droite de pente −λ. La demi-vie est inversement proportionnelle à la constante de désintégration λ.</p></ConceptCard></div> },
    { id: "formulas", type: "formulas", title: "Formules importantes", icon: "📐", content: <FormulaCard title="Transformations nucléaires" formulas={[
      { name: "Désintégration α", expression: "ᴬ_Z X → ᴬ⁻⁴_Z₋₂ Y + ₂⁴He" },
      { name: "Désintégration β⁻", expression: "ᴬ_Z X → ᴬ_Z₊₁ Y + ₋₁⁰e" },
      { name: "Énergie", expression: "E = Δm × c² (defaut de masse)" },
    ]} /> },
    { id: "methods", type: "methods", title: "Méthodes", icon: "🧠", content: <MethodCard number={1} title="Équilibrer une équation de désintégration" steps={["Identifier le type de désintégration (α, β, γ)", "Conserver le nombre de nucléons (A) des deux côtés", "Conserver le nombre de charge (Z) des deux côtés", "Vérifier l'équilibre des électrons/positrons", "Vérifier que l'énergie est cohérente"]} /> },
    { id: "guided-example", type: "guided-example", title: "Exemple guidé", icon: "✏️", content: <div className="space-y-4"><Card className="border-border/50 bg-muted/30"><CardContent className="p-4"><p className="text-sm font-medium text-foreground">📝 Écrire la désintégration α de l&apos;uranium 238 (₉₂²³⁸U).</p></CardContent></Card><div className="space-y-1"><ExampleStep step={1} title="Identification" content={<p className="text-muted-foreground">Désintégration α : émission de ₂⁴He.</p>} /><ExampleStep step={2} title="Conservation de A" content={<p className="text-muted-foreground">A = 238 − 4 = 234</p>} /><ExampleStep step={3} title="Conservation de Z" content={<p className="text-muted-foreground">Z = 92 − 2 = 90 (thorium)</p>} /><ExampleStep step={4} title="Résultat" isLast content={<p className="text-muted-foreground">₉₂²³⁸U → ₉₀²³⁴Th + ₂⁴He</p>} /></div></div> },
    { id: "hard-example", type: "hard-example", title: "Exemple difficile", icon: "🔥", content: <Card className="border-accent/30 bg-accent/[0.03]"><CardContent className="p-4"><p className="text-sm font-medium text-foreground">🔥 Un échantillon contient 10²⁰ noyaux de ₆¹¹⁴Cd. La demi-vie est de 5 200 ans. Calculer l&apos;activité en Bq.</p><p className="text-sm text-muted-foreground mt-2">λ = ln(2)/t½ = 0,693/(5200 × 3,156 × 10⁷ s) = 4,22 × 10⁻¹² s⁻¹. A = λN = 4,22 × 10⁻¹² × 10²⁰ = 4,22 × 10⁸ Bq ≈ 422 MBq.</p></CardContent></Card> },
    { id: "common-mistakes", type: "common-mistakes", title: "Erreurs fréquentes", icon: "⚠️", content: <div className="space-y-3">{[{ mistake: "Confondre β⁻ et β⁺", fix: "β⁻ : neutron → proton + électron (Z augmente de 1). β⁺ : proton → neutron + positron (Z diminue de 1)." }, { mistake: "Oublier les rayons γ", fix: "Les rayons γ accompagnent souvent les désintégrations α et β. Ils ne modifient ni A ni Z." }].map((item, i) => <Card key={i} className="border-red-100 bg-red-50/30 py-3"><CardContent className="px-4 space-y-1"><p className="text-sm font-medium text-red-700 flex items-center gap-2"><span className="text-red-500">✗</span> {item.mistake}</p><p className="text-xs text-red-600/80 flex items-start gap-2"><span className="text-emerald-500 mt-0.5">✓</span> {item.fix}</p></CardContent></Card>)}</div> },
    { id: "exercises", type: "exercises", title: "Exercices progressifs", icon: "📝", content: <div className="space-y-4">{[{ level: "Fondamental", questions: ["Écrire la désintégration β⁻ du carbone 14 (₆¹⁴C)", "Si t½ = 5730 ans, quelle fraction de ¹⁴C reste après 11 460 ans ?"] }, { level: "Intermédiaire", questions: ["Calculer l'activité d'un échantillon de 10¹⁵ atomes de ⁶⁰Co (t½ = 5,27 ans)", "Chaîne de désintégration complète de l'uranium 238 jusqu'au plomb 206"] }].map((g, gi) => <Card key={gi} className="border-border/50 bg-card py-4"><CardContent className="px-5 space-y-3"><Badge variant="secondary">{g.level}</Badge><ol className="space-y-2 text-sm text-muted-foreground">{g.questions.map((q, qi) => <li key={qi} className="flex gap-2"><span className="font-mono text-xs text-muted-foreground/60">{gi+1}.{qi+1}</span>{q}</li>)}</ol></CardContent></Card>)}</div> },
    { id: "ask-ai", type: "ask-ai", title: "Demander au Prof IA", icon: "🤖", content: <ProfessionalAITutor subject="Chimie — Transformations nucléaires" subjectKey="chemistry" /> },
    { id: "draw-me", type: "draw-me", title: "Dessine-moi", icon: "✏️", content: <DrawMePanel subject="chemistry" options={[{ label: "Décroissance radioactive", icon: "☢️", description: "Courbe de désintégration", variant: "decay" }, { label: "Chaîne de désintégration", icon: "⛓️", description: "Du noyau instable au noyau stable", variant: "chaine" }, { label: "Structure NaOH", icon: "⚛️", description: "Hydroxyde de sodium", variant: "molecule-nacl" }, { label: "Fiole graduée", icon: "🧪", description: "Matériel de laboratoire", variant: "lab-beaker" }]} /> },
    { id: "mini-test", type: "mini-test", title: "Mini-test", icon: "🧪", content: <MiniTest questions={[
      { question: "L'émission α correspond à l'éjection de :", options: ["Un électron", "Un neutron", "Un noyau d'hélium", "Un photon"], correctIndex: 2, explanation: "La désintégration α émet un noyau d'hélium (₂⁴He), soit 2 protons et 2 neutrons." },
      { question: "Après 3 demi-vies, quel pourcentage de noyaux subsiste ?", options: ["75%", "50%", "25%", "12,5%"], correctIndex: 3, explanation: "Après n demi-vies : (1/2)ⁿ. Pour n=3 : (1/2)³ = 1/8 = 12,5%." },
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

    { id: "summary", type: "summary", title: "Résumé", icon: "📋", content: <Card className="border-border/50 bg-muted/30"><CardContent className="p-5"><ul className="text-sm text-muted-foreground space-y-1"><li>• N = N₀ × e^(−λt) ; t½ = ln(2)/λ</li><li>• α : éjection de ₂⁴He, β : transformation neutron/proton, γ : énergie</li><li>• Fission : noyau lourd → légers. Fusion : légers → lourd.</li><li>• E = mc² relie masse et énergie nucléaire</li></ul></CardContent></Card> },
    { id: "next-steps", type: "next-steps", title: "Que faut-il réviser ensuite ?", icon: "🔄", content: <div className="space-y-3">{[{ topic: "Réactions acido-basiques", description: "Dosage et courbes de titrage.", icon: "⚗️" }, { topic: "Suivi temporel", description: "Cinétique chimique.", icon: "⏱️" }].map((item, i) => <Card key={i} className="border-border/50 bg-card py-3 hover:border-primary/20 transition-colors"><CardContent className="flex items-start gap-3 px-4"><span className="text-xl">{item.icon}</span><div><p className="text-sm font-semibold text-foreground">{item.topic}</p><p className="text-xs text-muted-foreground mt-0.5">{item.description}</p></div></CardContent></Card>)}</div> },
  ];
}
