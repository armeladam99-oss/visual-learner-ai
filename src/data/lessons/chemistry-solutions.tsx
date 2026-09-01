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

export function getChemistrySolutionsSections(): LessonSection[] {
  return [
    {
      id: "why-study",
      type: "why-study",
      title: "Pourquoi étudier cette leçon ?",
      icon: "🌍",
      content: (
        <div className="space-y-4 text-sm leading-relaxed text-muted-foreground">
          <p>
            Les <strong className="text-foreground">solutions</strong> et les{" "}
            <strong className="text-foreground">concentrations</strong> sont au cœur de
            la chimie. Toute réaction en solution nécessite de connaître la quantité
            de soluté dissoute.
          </p>
          <ConceptCard icon="🏥" title="Applications concrètes" variant="info">
            <p>
              Les perfusions médicales sont des solutions dosées précisément. Les
              recharges de batterie utilisent des solutions d&apos;acide sulfurique.
              L&apos;eau que tu bois contient des minéraux dissous. Le dosage de
              chlore dans une piscine est un dosage acido-basique.
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
            "Calculer la concentration molaire d'une solution",
            "Réaliser une dilution et calculer les volumes",
            "Interpréter une courbe de suivi temporel",
            "Comprendre le principe du dosage acido-basique",
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
            { label: "Notion de mole et de masse molaire", level: "maîtrisé" },
            { label: "Arithmétique et proportions", level: "maîtrisé" },
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
            Quand tu dissous du sel dans de l&apos;eau, tu obtiens une{" "}
            <strong className="text-foreground">solution</strong>. Le sel est le{" "}
            <strong className="text-foreground">soluté</strong>, l&apos;eau est le{" "}
            <strong className="text-foreground">solvant</strong>.
          </p>
          <p>
            La <strong className="text-foreground">concentration</strong> mesure la
            quantité de soluté par unité de volume de solution. Plus la concentration
            est élevée, plus la solution est « forte ».
          </p>
          <div className="flex justify-center py-3">
            <code className="text-base font-mono font-bold text-primary bg-primary/5 px-6 py-3 rounded-xl border border-primary/10">
              C = n / V
            </code>
          </div>
          <p className="text-center text-xs text-muted-foreground">
            C en mol/L, n en moles, V en litres
          </p>
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
            <h3 className="text-sm font-bold text-foreground">Concentration molaire</h3>
            <p className="text-sm text-muted-foreground leading-relaxed">
              La concentration molaire C (en mol/L) est le nombre de moles de soluté
              n presentes dans un volume V de solution :
            </p>
          </div>
          <ConceptCard icon="💧" title="La dilution" variant="tip">
            <p>
              Diluer une solution, c&apos;est ajouter du solvant pour diminuer sa
              concentration. La quantité de soluté reste la même :{" "}
              <code className="text-xs bg-muted px-1 rounded">C₁V₁ = C₂V₂</code>
            </p>
          </ConceptCard>
          <ConceptCard icon="📈" title="Suivi temporel" variant="info">
            <p>
              Un suivi temporel consiste à mesurer l&apos;évolution d&apos;une
              concentration au cours du temps. La courbe obtenue permet de visualiser
              la cinétique de réaction.
            </p>
          </ConceptCard>
          <ConceptCard icon="⚗️" title="Dosage acido-basique" variant="info">
            <p>
              Un dosage consiste à ajouter progressivement un réactif titré (la
              solution d&apos;une concentration connue) dans une solution à doser.
              Le point d&apos;équivalence correspond à la stœchiométrie de la
              réaction.
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
            title="Dilution : évolution de la concentration"
            description="Modifie le volume initial et le volume ajouté pour observer la variation de concentration."
            params={[
              { name: "Concentration initiale", symbol: "C1", min: 0.1, max: 2, step: 0.1, defaultValue: 1 },
              { name: "Volume initial (mL)", symbol: "V1", min: 10, max: 200, step: 10, defaultValue: 50 },
            ]}
            computePoints={(p) => {
              const points = [];
              const n = p.C1 * (p.V1 / 1000);
              for (let vAdded = 0; vAdded <= 500; vAdded += 5) {
                const vTotal = (p.V1 + vAdded) / 1000;
                const c = n / vTotal;
                points.push({ x: vAdded, y: Math.round(c * 1000) / 1000 });
              }
              return points;
            }}
            xLabel="Volume ajouté (mL)"
            yLabel="C (mol/L)"
            xDomain={[0, 500]}
            color="#d97706"
            variant="area"
          />

          <InteractiveGraph
            title="Suivi temporel d'une réaction"
            description="Visualise comment les concentrations de réactifs et produits évoluent au cours du temps."
            params={[
              { name: "Concentration initiale", symbol: "C0", min: 0.1, max: 2, step: 0.1, defaultValue: 1 },
              { name: "Constante de vitesse", symbol: "k", min: 0.05, max: 1, step: 0.05, defaultValue: 0.3 },
            ]}
            computePoints={(p) => {
              const points = [];
              for (let t = 0; t <= 20; t += 0.2) {
                const reactif = p.C0 * Math.exp(-p.k * t);
                points.push({ x: Math.round(t * 100) / 100, y: Math.round(reactif * 1000) / 1000 });
              }
              return points;
            }}
            xLabel="Temps (s)"
            yLabel="C réactif (mol/L)"
            xDomain={[0, 20]}
            color="#dc2626"
          />

          <GraphExplainer
            items={[
              "L'axe horizontal représente le temps (en secondes) ou le volume ajouté (en mL).",
              "L'axe vertical représente la concentration en mol/L.",
              "Pour la dilution : la courbe est une hyperbole décroissante (C diminue quand V augmente).",
              "Pour le suivi temporel : la concentration du réactif décroît exponentiellement vers 0.",
              "La pente de la courbe de suivi temporel est toujours négative (la réaction avance).",
              "Le point où la concentration est la moitié de C₀ donne le temps demi-vie : t₁/₂ = ln(2)/k.",
            ]}
          />
        </div>
      ),
    },

    {
      id: "graph-explanation",
      type: "graph-explanation",
      title: "Interprétation des courbes",
      icon: "🔎",
      content: (
        <div className="space-y-4 text-sm text-muted-foreground leading-relaxed">
          <ConceptCard icon="🔍" title="Courbe de dilution" variant="info">
            <p>
              La courbe C(V) suit une hyperbole : C = n/V. Plus on ajoute de
              solvant, plus la concentration diminue. Elle ne s&apos;annule jamais
              complètement.
            </p>
          </ConceptCard>
          <ConceptCard icon="🔍" title="Courbe de suivi temporel" variant="info">
            <p>
              La concentration du réactif suit une décroissance exponentielle.
              Au début, la réaction est rapide (pente forte). Elle ralentit
              progressivement quand le réactif est consommé.
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
          title="Formules de chimie des solutions"
          variant="highlighted"
          formulas={[
            { name: "Concentration", expression: "C = n / V", description: "C en mol/L, n en mol, V en L" },
            { name: "Quantité de matière", expression: "n = m / M", description: "m en grammes, M en g/mol" },
            { name: "Dilution", expression: "C₁ · V₁ = C₂ · V₂", description: "Conservation du soluté" },
            { name: "Réaction équilibrée", expression: "aA + bB → cC + dD", description: "Stœchiométrie" },
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
        <MethodCard
          number={1}
          title="Calculer une concentration"
          steps={[
            "Identifier la formule chimique du soluté",
            "Calculer sa masse molaire M",
            "Mesurer ou donner la masse m soluté → calculer n = m/M",
            "Mesurer ou donner le volume V de solution",
            "Appliquer C = n/V",
          ]}
        />
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
                On dissout 5,85 g de NaCl (M = 58,5 g/mol) dans de l&apos;eau pour obtenir 500 mL de solution. Calculer C.
              </p>
            </CardContent>
          </Card>
          <div className="space-y-1">
            <ExampleStep step={1} title="Calculer n" content={<p className="text-muted-foreground">n = m/M = 5,85 / 58,5 = <strong className="text-foreground">0,1 mol</strong></p>} />
            <ExampleStep step={2} title="Convertir le volume" content={<p className="text-muted-foreground">V = 500 mL = <strong className="text-foreground">0,5 L</strong></p>} />
            <ExampleStep step={3} title="Calculer C" isLast content={<p className="text-muted-foreground">C = n/V = 0,1 / 0,5 = <strong className="text-foreground">0,2 mol/L</strong></p>} />
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
        <Card className="border-accent/30 bg-accent/[0.03]">
          <CardContent className="p-4">
            <p className="text-sm font-medium text-foreground">🔥 Exercice avancé</p>
            <p className="text-sm text-muted-foreground">
              On veut préparer 200 mL d&apos;une solution à 0,1 mol/L de NaOH à partir
              d&apos;une solution mère à 1 mol/L. Quel volume de solution mère faut-il prélever ?
              <br /><br />
              <strong>Résolution :</strong> C₁V₁ = C₂V₂ → 1 × V₁ = 0,1 × 0,2 → V₁ = 0,02 L = <strong className="text-foreground">20 mL</strong>
            </p>
          </CardContent>
        </Card>
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
            { mistake: "Confondre volume de soluté et volume de solution", fix: "La concentration est calculée sur le volume TOTAL de la solution, pas du solvant seul." },
            { mistake: "Oublier de convertir mL en L", fix: "C = n/V avec V en LITRES. 500 mL = 0,5 L. Ne jamais utiliser des mL directement." },
            { mistake: "Erreur dans C₁V₁ = C₂V₂", fix: "Vérifier que les volumes sont dans la même unité. Les deux C sont dans la même unité (mol/L)." },
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
        <Card className="border-border/50 bg-card py-4">
          <CardContent className="px-5 space-y-3">
            <Badge variant="secondary">Fondamental</Badge>
            <ol className="space-y-2 text-sm text-muted-foreground">
              <li className="flex gap-2"><span className="font-mono text-xs">1.1</span> Calculer C si n = 0,5 mol et V = 1 L</li>
              <li className="flex gap-2"><span className="font-mono text-xs">1.2</span> Quel volume de solution à 0,5 mol/L contient 0,1 mol de soluté ?</li>
              <li className="flex gap-2"><span className="font-mono text-xs">1.3</span> On dilue 100 mL d&apos;une solution à 1 mol/L pour obtenir 500 mL. Quelle est C₂ ?</li>
            </ol>
          </CardContent>
        </Card>
      ),
    },

    {
      id: "ask-ai",
      type: "ask-ai",
      title: "Demander au Prof IA",
      icon: "🤖",
      content: <ProfessionalAITutor subject="Chimie" subjectKey="chemistry" />,
    },

    {
      id: "draw-me",
      type: "draw-me",
      title: "Dessine-moi",
      icon: "✏️",
      content: (
        <DrawMePanel
          subject="chemistry"
          options={[
            { label: "Courbe de dosage", icon: "⚗️", description: "pH en fonction du volume", variant: "dosage" },
            { label: "Courbe de dilution", icon: "💧", description: "Concentration vs volume", variant: "dilution" },
            { label: "Manipulation dosage", icon: "🔬", description: "Burette interactive avec gouttes", variant: "lab-titration" },
            { label: "Structure H₂O", icon: "⚛️", description: "Molécule d'eau interactive", variant: "molecule-water" },
            { label: "Structure HCl", icon: "⚛️", description: "Acide chlorhydrique", variant: "molecule-hcl" },
            { label: "Structure NaCl", icon: "⚛️", description: "Chlorure de sodium", variant: "molecule-nacl" },
            { label: "Structure CO₂", icon: "⚛️", description: "Dioxyde de carbone", variant: "molecule-co2" },
            { label: "Fiole graduée", icon: "🧪", description: "Matériel de laboratoire", variant: "lab-beaker" },
            { label: "pH-mètre", icon: "🧪", description: "Instrument de mesure du pH", variant: "lab-ph" },
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
              question: "Quelle est la formule de la concentration molaire ?",
              options: ["C = V/n", "C = n × V", "C = n/V", "C = m/M"],
              correctIndex: 2,
              explanation: "C = n/V où n est la quantité de matière en moles et V le volume en litres.",
            },
            {
              question: "On dilue 50 mL d'une solution à 0,5 mol/L pour obtenir 250 mL. C₂ = ?",
              options: ["2,5 mol/L", "0,1 mol/L", "1,25 mol/L", "0,01 mol/L"],
              correctIndex: 1,
              explanation: "C₁V₁ = C₂V₂ → 0,5 × 50 = C₂ × 250 → C₂ = 25/250 = 0,1 mol/L.",
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
              <li>• <strong>C = n/V</strong> : concentration molaire (mol/L)</li>
              <li>• <strong>n = m/M</strong> : quantité de matière (mol)</li>
              <li>• <strong>C₁V₁ = C₂V₂</strong> : formule de dilution</li>
              <li>• Toujours convertir le volume en litres</li>
              <li>• La courbe de dilution est une hyperbole décroissante</li>
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
            { topic: "Réactions acido-basiques", description: "Neutralisation, pH, dosage complet.", icon: "⚗️" },
            { topic: "Cinétique chimique", description: "Vitesse de réaction, ordre, demi-vie.", icon: "📈" },
            { topic: "Équilibre chimique", description: "Quand la réaction ne va plus de l'avant.", icon: "⚖️" },
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
