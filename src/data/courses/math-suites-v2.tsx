"use client";

import type { LessonSection } from "@/types/lessons";
import { InteractiveGraph, GraphExplainer } from "@/components/visual/InteractiveGraph";
import { FormulaCard, ConceptCard, MethodCard, ExampleStep } from "@/components/visual/FormulaCard";
import { MiniTest } from "@/components/visual/MiniTest";
import { DrawMePanel } from "@/components/visual/DrawMePanel";
import { ProfessionalAITutor } from "@/components/visual/ProfessionalAITutor";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export function getSuitesNumeriquesV2(): LessonSection[] {
  return [
    // ═══════════════════════════════════════════
    // 1. 🌍 POURQUOI ÉTUDIER CETTE LEÇON ?
    // ═══════════════════════════════════════════
    {
      id: "why-study",
      type: "why-study",
      title: "Pourquoi étudier cette leçon ?",
      icon: "🌍",
      content: (
        <div className="space-y-6 text-sm leading-relaxed text-muted-foreground">
          <div className="rounded-xl border border-primary/15 bg-primary/[0.03] p-5 space-y-3">
            <h3 className="text-base font-bold text-foreground">Les suites numériques : le langage du changement</h3>
            <p>
              Les <strong className="text-foreground">suites numériques</strong> sont l&apos;un des piliers fondamentaux des mathématiques modernes. Elles permettent de <strong className="text-foreground">décrire l&apos;évolution d&apos;une quantity au fil du temps</strong> ou d&apos;une suite d&apos;étapes.
            </p>
          </div>

          <ConceptCard icon="🧮" title="Pourquoi c&apos;est important ?" variant="info">
            <p>Les suites interviennent dans pratiquement tous les domaines scientifiques :</p>
            <ul className="mt-2 space-y-1 list-disc list-inside">
              <li><strong>Finance</strong> : calcul des intérêts composés, emprunts, placements</li>
              <li><strong>Biologie</strong> : croissance d&apos;une population bactérienne</li>
              <li><strong>Physique</strong> : mouvement d&apos;un objet à pas discrets</li>
              <li><strong>Informatique</strong> : complexité des algorithmes, récursivité</li>
              <li><strong>Chimie</strong> : suivi d&apos;une réaction à pas de temps</li>
              <li><strong>Mathématiques</strong> : fondement de la convergence, des séries, et de l&apos;analyse</li>
            </ul>
          </ConceptCard>

          <ConceptCard icon="🔗" title="Lien avec les autres chapitres" variant="tip">
            <p>Les suites numériques sont le <strong>point de départ</strong> de l&apos;analyse mathématique :</p>
            <ul className="mt-2 space-y-1 list-disc list-inside">
              <li>→ <strong>Limites</strong> : on étudie la convergence des suites</li>
              <li>→ <strong>Dérivation</strong> : les suites de_tm → 0 permettent de définir la dérivée</li>
              <li>→ <strong>Intégrales</strong> : les sommes de Riemann sont des suites</li>
              <li>→ <strong>Équations différentielles</strong> : résolution approchée par suites</li>
              <li>→ <strong>Probabilités</strong> : espérance et variance sont des limites de suites</li>
            </ul>
          </ConceptCard>

          <ConceptCard icon="🎓" title="Pourquoi c&apos;est utile pour la suite ?" variant="tip">
            <p>Maîtriser les suites numériques vous permet de :</p>
            <ul className="mt-2 space-y-1 list-disc list-inside">
              <li>Comprendre ce que signifie &quot;tendre vers une valeur&quot;</li>
              <li>Calculer des limites complexes</li>
              <li>Modéliser des phénomènes réels</li>
              <li>Préparer l&apos;étude des fonctions continues</li>
              <li>Aborder l&apos;analyse numerique et les méthodes de calcul</li>
            </ul>
          </ConceptCard>
        </div>
      ),
    },

    // ═══════════════════════════════════════════
    // 2. 🎯 OBJECTIFS
    // ═══════════════════════════════════════════
    {
      id: "objectives",
      type: "objectives",
      title: "Objectifs",
      icon: "🎯",
      content: (
        <div className="space-y-3">
          <p className="text-sm text-muted-foreground mb-4">À l&apos;issue de ce chapitre, vous serez capable de :</p>
          {[
            "Définir une suite numérique par mode de génération ou par relation de récurrence",
            "Calculer les termes d&apos;une suite à partir de sa formule de récurrence",
            "Déterminer si une suite est croissante, décroissante, ou bornée",
            "Étudier la convergence d&apos;une suite et calculer sa limite",
            "Utiliser les suites usuelles (arithmétique, géométrique, harmonique)",
            "Appliquer le théorème des gendarmes pour prouver une convergence",
            "Résoudre des équations et inéquations faisant intervenir des suites",
            "Lier les suites aux autres notions d&apos;analyse (limites, continuité)"
          ].map((obj, i) => (
            <div key={i} className="flex items-start gap-3 rounded-lg bg-primary/[0.03] border border-primary/10 px-4 py-3">
              <span className="flex-shrink-0 w-6 h-6 rounded-full bg-primary text-primary-foreground text-xs font-bold flex items-center justify-center mt-0.5">
                {i + 1}
              </span>
              <p className="text-sm text-foreground/80">{obj}</p>
            </div>
          ))}
        </div>
      ),
    },

    // ═══════════════════════════════════════════
    // 3. 🧠 PRÉREQUIS
    // ═══════════════════════════════════════════
    {
      id: "prerequisites",
      type: "prerequisites",
      title: "Prérequis",
      icon: "🧠",
      content: (
        <div className="space-y-3">
          <p className="text-sm text-muted-foreground mb-4">Avant de commencer, vous devez maîtriser :</p>
          {[
            { label: "Lecture et utilisation d&apos;une fonction", level: "indispensable", detail: "Savoir calculer f(x) pour une valeur donnée de x" },
            { label: "Notions de croissance et décroissance", level: "indispensable", detail: "Savoir si une fonction est croissante ou décroissante" },
            { label: "Puissances et racines", level: "indispensable", detail: "aⁿ, √a, a^(1/n)" },
            { label: "Notion de limite intuitive", level: "recommandé", detail: "Comprendre ce que signifie \"tendre vers\"" },
            { label: "Équations du 1er et 2nd degré", level: "recommandé", detail: "Résoudre ax + b = 0 et ax² + bx + c = 0" },
          ].map((prereq, i) => (
            <div key={i} className="flex items-center gap-3 rounded-lg border border-border/50 bg-card px-4 py-3">
              <span className="text-lg">{prereq.level === "indispensable" ? "✅" : "💡"}</span>
              <div className="flex-1">
                <span className="text-sm text-foreground/80">{prereq.label}</span>
                <p className="text-[10px] text-muted-foreground mt-0.5">{prereq.detail}</p>
              </div>
              <Badge variant={prereq.level === "indispensable" ? "default" : "secondary"} className="text-[10px]">
                {prereq.level}
              </Badge>
            </div>
          ))}
        </div>
      ),
    },

    // ═══════════════════════════════════════════
    // 4. 💡 INTRODUCTION INTUITIVE
    // ═══════════════════════════════════════════
    {
      id: "intro",
      type: "intro",
      title: "Introduction intuitive",
      icon: "💡",
      content: (
        <div className="space-y-6 text-sm leading-relaxed text-muted-foreground">
          <div className="rounded-xl bg-muted/30 border border-border/30 p-5">
            <h4 className="text-sm font-bold text-foreground mb-3">Une suite, c&apos;est quoi ?</h4>
            <p>
              Imagine que tu déposes <strong className="text-foreground">1000€</strong> sur un compte qui rapporte <strong className="text-foreground">5% d&apos;intérêt par an</strong>.
            </p>
            <div className="mt-3 rounded-lg bg-primary/5 border border-primary/10 p-3 font-mono text-xs space-y-1">
              <p>Année 0 : 1000,00 €</p>
              <p>Année 1 : 1000 × 1,05 = 1050,00 €</p>
              <p>Année 2 : 1050 × 1,05 = 1102,50 €</p>
              <p>Année 3 : 1102,50 × 1,05 = 1157,63 €</p>
              <p>Année n : 1000 × 1,05ⁿ €</p>
            </div>
            <p className="mt-3">
              La suite des montants au fil des années est une <strong className="text-foreground">suite numérique</strong>. Chaque terme est calculé à partir du précédent.
            </p>
          </div>

          <div className="rounded-xl bg-muted/30 border border-border/30 p-5">
            <h4 className="text-sm font-bold text-foreground mb-3">Deux façons de définir une suite</h4>
            <div className="grid gap-3 sm:grid-cols-2">
              <div className="rounded-lg bg-card border border-border/30 p-3">
                <p className="text-xs font-bold text-primary mb-1">Mode explicite</p>
                <p className="text-xs">On donne une formule directe : <code className="text-primary">uₙ = f(n)</code></p>
                <p className="text-[10px] text-muted-foreground mt-1">Ex : uₙ = 2n + 1 → 1, 3, 5, 7, 9, ...</p>
              </div>
              <div className="rounded-lg bg-card border border-border/30 p-3">
                <p className="text-xs font-bold text-emerald-600 mb-1">Mode récurrent</p>
                <p className="text-xs">On donne u₀ et la relation : <code className="text-emerald-600">uₙ₊₁ = f(uₙ)</code></p>
                <p className="text-[10px] text-muted-foreground mt-1">Ex : u₀ = 1, uₙ₊₁ = uₙ + 2 → 1, 3, 5, 7, 9, ...</p>
              </div>
            </div>
          </div>

          <div className="rounded-xl bg-muted/30 border border-border/30 p-5">
            <h4 className="text-sm font-bold text-foreground mb-3">Exemples concrets</h4>
            <div className="space-y-2">
              <div className="flex items-start gap-2">
                <span className="text-primary font-bold">→</span>
                <p><strong>Dénombrement</strong> : Le nombre de diagonales d&apos;un polygone à n côtés : <code className="text-primary text-xs">dₙ = n(n-3)/2</code></p>
              </div>
              <div className="flex items-start gap-2">
                <span className="text-emerald-600 font-bold">→</span>
                <p><strong>Population</strong> : Une bactérie se divise toutes les heures : <code className="text-emerald-600 text-xs">Nₙ₊₁ = 2Nₙ</code></p>
              </div>
              <div className="flex items-start gap-2">
                <span className="text-amber-600 font-bold">→</span>
                <p><strong>Finance</strong> : Placement avec intérêts composés : <code className="text-amber-600 text-xs">Cₙ₊₁ = Cₙ × (1 + t)</code></p>
              </div>
              <div className="flex items-start gap-2">
                <span className="text-red-600 font-bold">→</span>
                <p><strong>Physique</strong> : Position d&apos;un mobile à chaque seconde : <code className="text-red-600 text-xs">xₙ₊₁ = xₙ + v × Δt</code></p>
              </div>
            </div>
          </div>
        </div>
      ),
    },

    // ═══════════════════════════════════════════
    // 5. 📚 COURS DÉTAILLÉ
    // ═══════════════════════════════════════════
    {
      id: "course",
      type: "course",
      title: "Cours détaillé",
      icon: "📚",
      content: (
        <div className="space-y-8">
          {/* Partie 1 : Définition */}
          <div className="space-y-4">
            <h3 className="text-base font-bold text-foreground flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-primary/10 text-primary text-xs font-bold flex items-center justify-center">1</span>
              Définition d&apos;une suite numérique
            </h3>
            <div className="rounded-xl border border-primary/15 bg-primary/[0.03] p-5">
              <p className="text-sm text-muted-foreground leading-relaxed">
                Une <strong className="text-foreground">suite numérique</strong> est une application de <strong className="text-foreground">ℕ</strong> (ou d&apos;un sous-ensemble de ℕ) dans <strong className="text-foreground">ℝ</strong>.
              </p>
              <p className="text-sm text-muted-foreground mt-3">
                On la note <code className="text-primary font-bold">(uₙ)ₙ∈ℕ</code> ou simplement <code className="text-primary font-bold">(uₙ)</code>.
              </p>
              <p className="text-sm text-muted-foreground mt-3">
                Le nombre <code className="text-primary">uₙ</code> est appelé le <strong className="text-foreground">terme général</strong> de la suite à l&apos;indice n.
              </p>
            </div>

            <div className="rounded-xl bg-muted/30 border border-border/30 p-5">
              <h4 className="text-sm font-bold text-foreground mb-3">Exemples de modes de génération</h4>
              <div className="space-y-3">
                <div className="rounded-lg bg-card border border-border/30 p-3">
                  <p className="text-xs font-bold text-primary mb-1">Mode explicite :</p>
                  <code className="text-xs">uₙ = 3n² − 2n + 1</code>
                  <p className="text-[10px] text-muted-foreground mt-1">u₀ = 1, u₁ = 2, u₂ = 9, u₃ = 22, u₄ = 41, ...</p>
                </div>
                <div className="rounded-lg bg-card border border-border/30 p-3">
                  <p className="text-xs font-bold text-emerald-600 mb-1">Mode récurrent :</p>
                  <code className="text-xs">u₀ = 1 et uₙ₊₁ = 2uₙ + 1</code>
                  <p className="text-[10px] text-muted-foreground mt-1">u₀ = 1, u₁ = 3, u₂ = 7, u₃ = 15, u₄ = 31, ...</p>
                </div>
                <div className="rounded-lg bg-card border border-border/30 p-3">
                  <p className="text-xs font-bold text-amber-600 mb-1">Mode accidentel :</p>
                  <code className="text-xs">u₀ = 1, u₁ = 1, et uₙ₊₂ = uₙ₊₁ + uₙ</code>
                  <p className="text-[10px] text-muted-foreground mt-1">Suite de Fibonacci : 1, 1, 2, 3, 5, 8, 13, 21, ...</p>
                </div>
              </div>
            </div>
          </div>

          {/* Partie 2 : Suites usuelles */}
          <div className="space-y-4">
            <h3 className="text-base font-bold text-foreground flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-primary/10 text-primary text-xs font-bold flex items-center justify-center">2</span>
              Suites usuelles
            </h3>

            <div className="rounded-xl border border-border/50 bg-card p-5 space-y-4">
              <h4 className="text-sm font-bold text-foreground">Suite arithmétique</h4>
              <div className="rounded-lg bg-primary/5 border border-primary/10 p-3">
                <p className="text-xs text-muted-foreground">Une suite est <strong>arithmétique</strong> de <strong>raison r</strong> si :</p>
                <code className="text-sm font-mono font-bold text-primary block mt-1">uₙ₊₁ = uₙ + r pour tout n</code>
                <p className="text-xs text-muted-foreground mt-2">Terme général : <code className="text-primary">uₙ = u₀ + n × r</code></p>
              </div>
              <div className="rounded-lg bg-muted/30 p-3 text-xs text-muted-foreground space-y-1">
                <p><strong>Propriétés :</strong></p>
                <p>• Si r &gt; 0 : suite croissante</p>
                <p>• Si r &lt; 0 : suite décroissante</p>
                <p>• Si r = 0 : suite constante</p>
                <p>• Somme des n premiers termes : Sₙ = n × (u₀ + uₙ)/2</p>
              </div>
            </div>

            <div className="rounded-xl border border-border/50 bg-card p-5 space-y-4">
              <h4 className="text-sm font-bold text-foreground">Suite géométrique</h4>
              <div className="rounded-lg bg-primary/5 border border-primary/10 p-3">
                <p className="text-xs text-muted-foreground">Une suite est <strong>géométrique</strong> de <strong>raison q</strong> si :</p>
                <code className="text-sm font-mono font-bold text-primary block mt-1">uₙ₊₁ = q × uₙ pour tout n</code>
                <p className="text-xs text-muted-foreground mt-2">Terme général : <code className="text-primary">uₙ = u₀ × qⁿ</code></p>
              </div>
              <div className="rounded-lg bg-muted/30 p-3 text-xs text-muted-foreground space-y-1">
                <p><strong>Convergence :</strong></p>
                <p>• Si |q| &lt; 1 : suite convergente, lim uₙ = 0</p>
                <p>• Si q = 1 : suite constante uₙ = u₀</p>
                <p>• Si q &gt; 1 ou q &lt; −1 : suite divergente</p>
                <p>• Si q = −1 : suiteoscillante</p>
                <p>• Somme : Sₙ = u₀ × (1 − qⁿ)/(1 − q) si q ≠ 1</p>
              </div>
            </div>

            <div className="rounded-xl border border-border/50 bg-card p-5 space-y-4">
              <h4 className="text-sm font-bold text-foreground">Suite harmonique</h4>
              <div className="rounded-lg bg-primary/5 border border-primary/10 p-3">
                <code className="text-sm font-mono font-bold text-primary">uₙ = 1/(n+1)</code>
                <p className="text-xs text-muted-foreground mt-1">Suite : 1, 1/2, 1/3, 1/4, 1/5, ...</p>
                <p className="text-xs text-muted-foreground mt-1"><strong>Décroissante</strong> et <strong>convergente</strong> vers 0</p>
              </div>
            </div>
          </div>

          {/* Partie 3 : Étude de convergence */}
          <div className="space-y-4">
            <h3 className="text-base font-bold text-foreground flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-primary/10 text-primary text-xs font-bold flex items-center justify-center">3</span>
              Convergence et divergence
            </h3>

            <div className="rounded-xl border border-primary/15 bg-primary/[0.03] p-5 space-y-3">
              <h4 className="text-sm font-bold text-foreground">Définition de la convergence</h4>
              <p className="text-sm text-muted-foreground">
                On dit que la suite <code className="text-primary">(uₙ)</code> <strong className="text-foreground">converge</strong> vers <code className="text-primary">ℓ</code> si, pour tout <code className="text-primary">ε &gt; 0</code>, il existe <code className="text-primary">N ∈ ℕ</code> tel que pour tout <code className="text-primary">n ≥ N</code> :
              </p>
              <div className="rounded-lg bg-primary/5 border border-primary/10 p-3 text-center">
                <code className="text-sm font-mono font-bold text-primary">|uₙ − ℓ| &lt; ε</code>
              </div>
              <p className="text-xs text-muted-foreground">On écrit : lim(n→+∞) uₙ = ℓ</p>
            </div>

            <div className="rounded-xl border border-amber-200 bg-amber-50/30 p-5">
              <h4 className="text-sm font-bold text-amber-800 mb-2">⚠️ Différence entre suite croissante et suite convergente</h4>
              <p className="text-xs text-amber-700">
                <strong>Une suite croissante n&apos;est pas forcément convergente !</strong>
              </p>
              <p className="text-xs text-amber-700 mt-1">
                Exemple : uₙ = n est croissante mais divergente (elle tend vers +∞).
              </p>
              <p className="text-xs text-amber-700 mt-1">
                En revanche, une suite croissante et <strong>majorée</strong> est toujours convergente (théorème de la borne supérieure).
              </p>
            </div>
          </div>

          {/* Partie 4 : Théorème des gendarmes */}
          <div className="space-y-4">
            <h3 className="text-base font-bold text-foreground flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-primary/10 text-primary text-xs font-bold flex items-center justify-center">4</span>
              Théorème des gendarmes
            </h3>

            <div className="rounded-xl border border-emerald-200 bg-emerald-50/30 p-5 space-y-3">
              <h4 className="text-sm font-bold text-emerald-800">📋 Théorème</h4>
              <p className="text-sm text-emerald-700">
                Soit trois suites <code className="font-bold">(aₙ)</code>, <code className="font-bold">(uₙ)</code> et <code className="font-bold">(bₙ)</code> telles que :
              </p>
              <ul className="text-sm text-emerald-700 space-y-1 list-disc list-inside">
                <li><code>aₙ ≤ uₙ ≤ bₙ</code> pour tout n suffisamment grand</li>
                <li><code>lim aₙ = lim bₙ = ℓ</code></li>
              </ul>
              <p className="text-sm text-emerald-700 mt-2">
                Alors <code className="font-bold">lim uₙ = ℓ</code>.
              </p>
            </div>

            <div className="rounded-lg bg-muted/30 p-4 text-xs text-muted-foreground">
              <p><strong>Interprétation :</strong> Si une suite est &quot;coincée&quot; entre deux autres qui convergent vers la même limite, elle converge aussi vers cette limite.</p>
              <p className="mt-1"><strong>Analogie :</strong> C&apos;est comme un gendarme qui garde un prisonnier entre deux murs — si les deux murs se rapprochent, le prisonnier est forcé d&apos;aller vers le même point.</p>
            </div>
          </div>

          {/* Partie 5 : Suites convergentes et opérations */}
          <div className="space-y-4">
            <h3 className="text-base font-bold text-foreground flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-primary/10 text-primary text-xs font-bold flex items-center justify-center">5</span>
              Opérations sur les limites
            </h3>

            <div className="rounded-xl border border-border/50 bg-card p-5">
              <h4 className="text-sm font-bold text-foreground mb-3">Si lim uₙ = ℓ et lim vₙ = m, alors :</h4>
              <div className="grid gap-2 sm:grid-cols-2">
                {[
                  { op: "Somme", form: "lim(uₙ + vₙ) = ℓ + m" },
                  { op: "Produit", form: "lim(uₙ × vₙ) = ℓ × m" },
                  { op: "Quotient", form: "lim(uₙ/vₙ) = ℓ/m (si m ≠ 0)" },
                  { op: "Produit par un scalaire", form: "lim(λ × uₙ) = λ × ℓ" },
                ].map((item, i) => (
                  <div key={i} className="rounded-lg bg-primary/5 border border-primary/10 p-2">
                    <p className="text-[10px] font-bold text-primary">{item.op}</p>
                    <code className="text-xs">{item.form}</code>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      ),
    },

    // ═══════════════════════════════════════════
    // 6. 📐 DÉFINITIONS IMPORTANTES
    // ═══════════════════════════════════════════
    {
      id: "definitions",
      type: "formulas",
      title: "Définitions importantes",
      icon: "📐",
      content: (
        <FormulaCard
          title="Définitions fondamentales"
          formulas={[
            { name: "Suite numérique", expression: "u : ℕ → ℝ", description: "Application de ℕ dans ℝ" },
            { name: "Terme général", expression: "uₙ = f(n)", description: "Valeur du n-ième terme" },
            { name: "Suite arithmétique", expression: "uₙ₊₁ = uₙ + r", description: "Raison r constante" },
            { name: "Suite géométrique", expression: "uₙ₊₁ = q × uₙ", description: "Raison q constante" },
            { name: "Suite de Fibonacci", expression: "uₙ₊₂ = uₙ₊₁ + uₙ", description: "u₀ = u₁ = 1" },
            { name: "Convergence", expression: "lim uₙ = ℓ", description: "∀ε>0, ∃N, n≥N ⟹ |uₙ−ℓ|<ε" },
          ]}
        />
      ),
    },

    // ═══════════════════════════════════════════
    // 7. 🧠 PROPRIÉTÉS
    // ═══════════════════════════════════════════
    {
      id: "properties",
      type: "course",
      title: "Propriétés",
      icon: "🧠",
      content: (
        <div className="space-y-4">
          <div className="rounded-xl border border-border/50 bg-card p-5 space-y-3">
            <h4 className="text-sm font-bold text-foreground">Propriétés de la monotonie</h4>
            <div className="grid gap-2 sm:grid-cols-2">
              {[
                { name: "Croissante", def: "uₙ₊₁ ≥ uₙ pour tout n", icon: "📈" },
                { name: "Décroissante", def: "uₙ₊₁ ≤ uₙ pour tout n", icon: "📉" },
                { name: "Majorée", def: "∃M tel que uₙ ≤ M pour tout n", icon: "⬆️" },
                { name: "Minorée", def: "∃m tel que uₙ ≥ m pour tout n", icon: "⬇️" },
              ].map((p, i) => (
                <div key={i} className="rounded-lg bg-muted/30 border border-border/30 p-3">
                  <p className="text-xs font-bold text-foreground">{p.icon} {p.name}</p>
                  <code className="text-[10px]">{p.def}</code>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-xl border border-emerald-200 bg-emerald-50/30 p-5 space-y-2">
            <h4 className="text-sm font-bold text-emerald-800">📋 Théorème de la borne supérieure</h4>
            <p className="text-sm text-emerald-700">
              Une suite <strong>croissante et majorée</strong> est convergente.
            </p>
            <p className="text-xs text-emerald-700 mt-1">
              Symétriquement : une suite <strong>décroissante et minorée</strong> est convergente.
            </p>
          </div>

          <div className="rounded-xl border border-primary/15 bg-primary/[0.03] p-5 space-y-2">
            <h4 className="text-sm font-bold text-foreground">Propriété de la convergence</h4>
            <p className="text-sm text-muted-foreground">
              Si une suite converge, elle est <strong>bornée</strong> (mais l&apos;inverse n&apos;est pas vrai).
            </p>
            <p className="text-xs text-muted-foreground">
              Exemple : uₙ = (−1)ⁿ/n est bornée (entre −1 et 1) et convergente (vers 0).
              uₙ = (−1)ⁿ est bornée mais non convergente.
            </p>
          </div>
        </div>
      ),
    },

    // ═══════════════════════════════════════════
    // 8. 📋 THÉORÈMES
    // ═══════════════════════════════════════════
    {
      id: "theorems",
      type: "course",
      title: "Théorèmes et résultats importants",
      icon: "📋",
      content: (
        <div className="space-y-4">
          <div className="rounded-xl border border-emerald-200 bg-emerald-50/30 p-5 space-y-2">
            <h4 className="text-sm font-bold text-emerald-800">📋 Théorème des gendarmes</h4>
            <p className="text-sm text-emerald-700">
              Si aₙ ≤ uₙ ≤ bₙ pour tout n suffisamment grand, et si lim aₙ = lim bₙ = ℓ, alors lim uₙ = ℓ.
            </p>
          </div>

          <div className="rounded-xl border border-emerald-200 bg-emerald-50/30 p-5 space-y-2">
            <h4 className="text-sm font-bold text-emerald-800">📋 Théorème de la borne supérieure</h4>
            <p className="text-sm text-emerald-700">
              Une suite croissante et majorée est convergente. Sa limite est égale à sa borne supérieure.
            </p>
          </div>

          <div className="rounded-xl border border-emerald-200 bg-emerald-50/30 p-5 space-y-2">
            <h4 className="text-sm font-bold text-emerald-800">📋 Convergence des suites géométriques</h4>
            <p className="text-sm text-emerald-700">
              La suite géométrique de raison q converge si et seulement si |q| &lt; 1. Dans ce cas, lim qⁿ = 0.
            </p>
          </div>

          <div className="rounded-xl border border-emerald-200 bg-emerald-50/30 p-5 space-y-2">
            <h4 className="text-sm font-bold text-emerald-800">📋 Croissance comparée</h4>
            <p className="text-sm text-emerald-700">
              Pour tout a &gt; 1 : lim n→+∞ nᵃ/aⁿ = 0 (l&apos;exponentielle croît plus vite que toute puissance).
            </p>
            <p className="text-xs text-emerald-700 mt-1">
              Autrement dit : aⁿ croît plus vite que nᵃ quand n → +∞.
            </p>
          </div>
        </div>
      ),
    },

    // ═══════════════════════════════════════════
    // 9. 🔢 FORMULES
    // ═══════════════════════════════════════════
    {
      id: "formulas",
      type: "formulas",
      title: "Formules",
      icon: "🔢",
      content: (
        <FormulaCard
          title="Formules essentielles"
          formulas={[
            { name: "Suite arithmétique", expression: "uₙ = u₀ + n × r" },
            { name: "Suite géométrique", expression: "uₙ = u₀ × qⁿ" },
            { name: "Somme arithmétique", expression: "Sₙ = n × (u₀ + uₙ) / 2" },
            { name: "Somme géométrique", expression: "Sₙ = u₀ × (1 − qⁿ) / (1 − q)" },
            { name: "Fibonacci (Limite)", expression: "lim uₙ₊₁/uₙ = φ = (1+√5)/2 ≈ 1,618" },
            { name: "Limite puissance", expression: "lim qⁿ = 0 si |q| < 1" },
          ]}
        />
      ),
    },

    // ═══════════════════════════════════════════
    // 10. 📊 GRAPHIQUES
    // ═══════════════════════════════════════════
    {
      id: "visualization",
      type: "visualization",
      title: "Graphiques et représentations",
      icon: "📊",
      content: (
        <div className="space-y-6">
          <InteractiveGraph
            title="Suite arithmétique : uₙ = u₀ + n × r"
            description="Modifiez u₀ et r pour observer l'effet sur la suite."
            params={[
              { name: "Premier terme", symbol: "u0", min: -10, max: 10, step: 0.5, defaultValue: 1 },
              { name: "Raison r", symbol: "r", min: -5, max: 5, step: 0.5, defaultValue: 2 },
            ]}
            computePoints={(p) => {
              const pts = [];
              for (let n = 0; n <= 20; n++) {
                pts.push({ x: n, y: p.u0 + n * p.r });
              }
              return pts;
            }}
            xLabel="n"
            yLabel="uₙ"
            xDomain={[0, 20]}
            color="#4f46e5"
          />

          <InteractiveGraph
            title="Suite géométrique : uₙ = u₀ × qⁿ"
            description="Modifiez u₀ et q pour observer la convergence ou divergence."
            params={[
              { name: "Premier terme", symbol: "u0", min: -10, max: 10, step: 0.5, defaultValue: 10 },
              { name: "Raison q", symbol: "q", min: -2, max: 2, step: 0.05, defaultValue: 0.8 },
            ]}
            computePoints={(p) => {
              const pts = [];
              for (let n = 0; n <= 20; n++) {
                const y = p.u0 * Math.pow(p.q, n);
                if (Math.abs(y) < 1000) pts.push({ x: n, y: Math.round(y * 100) / 100 });
              }
              return pts;
            }}
            xLabel="n"
            yLabel="uₙ"
            xDomain={[0, 20]}
            color="#059669"
          />

          <GraphExplainer
            items={[
              "L'axe horizontal représente l'indice n (entier naturel).",
              "L'axe vertical représente la valeur du terme uₙ.",
              "Les points sont discrets : on ne relie PAS les points d'une suite.",
              "Suite arithmétique : les points sont sur une droite (progression linéaire).",
              "Suite géométrique avec |q| < 1 : les points convergent vers 0 (décroissance exponentielle).",
              "Suite géométrique avec |q| > 1 : les points divergent (croissance exponentielle).",
            ]}
          />

          <DrawMePanel
            subject="math"
            options={[
              { label: "Suite de Fibonacci", icon: "🐚", description: "La suite la plus célèbre", variant: "parabole" },
              { label: "Croissance comparée", icon: "📈", description: "Puissance vs exponentielle", variant: "comparaison" },
            ]}
          />
        </div>
      ),
    },

    // ═══════════════════════════════════════════
    // 11. ✏️ EXEMPLES DÉTAILLÉS
    // ═══════════════════════════════════════════
    {
      id: "examples",
      type: "guided-example",
      title: "Exemples détaillés",
      icon: "✏️",
      content: (
        <div className="space-y-6">
          <Card className="border-border/50 bg-muted/30">
            <CardContent className="p-4 space-y-3">
              <p className="text-sm font-medium text-foreground">📝 Exemple 1 : Suite arithmétique</p>
              <p className="text-sm text-muted-foreground">
                On considère la suite (uₙ) définie par u₀ = 3 et uₙ₊₁ = uₙ − 2.
              </p>
            </CardContent>
          </Card>
          <div className="space-y-1">
            <ExampleStep step={1} title="Identifier le type" content={<p className="text-muted-foreground">On a uₙ₊₁ = uₙ + r avec r = −2. C&apos;est une <strong>suite arithmétique</strong> de raison −2.</p>} />
            <ExampleStep step={2} title="Terme général" content={<p className="text-muted-foreground">uₙ = u₀ + n × r = 3 + n × (−2) = <strong className="text-foreground">3 − 2n</strong></p>} />
            <ExampleStep step={3} title="Calculer quelques termes" content={<p className="text-muted-foreground">u₀ = 3, u₁ = 1, u₂ = −1, u₃ = −3, u₄ = −5</p>} />
            <ExampleStep step={4} title="Étude de convergence" isLast content={<p className="text-muted-foreground">La suite est <strong>décroissante</strong> (r = −2 &lt; 0) et non bornée. Elle <strong>diverge</strong> vers −∞.</p>} />
          </div>

          <Card className="border-border/50 bg-muted/30">
            <CardContent className="p-4 space-y-3">
              <p className="text-sm font-medium text-foreground">📝 Exemple 2 : Suite géométrique</p>
              <p className="text-sm text-muted-foreground">
                Soit (vₙ) définie par v₀ = 100 et vₙ₊₁ = 0,8 × vₙ.
              </p>
            </CardContent>
          </Card>
          <div className="space-y-1">
            <ExampleStep step={1} title="Identifier le type" content={<p className="text-muted-foreground">C&apos;est une <strong>suite géométrique</strong> de raison q = 0,8.</p>} />
            <ExampleStep step={2} title="Terme général" content={<p className="text-muted-foreground">vₙ = 100 × 0,8ⁿ</p>} />
            <ExampleStep step={3} title="Calculer" content={<p className="text-muted-foreground">v₁ = 80, v₂ = 64, v₃ = 51,2, v₄ = 40,96</p>} />
            <ExampleStep step={4} title="Convergence" isLast content={<p className="text-muted-foreground">Comme |q| = 0,8 &lt; 1, la suite <strong>converge vers 0</strong>. C&apos;est une décroissance exponentielle (modélise un amortissement, une depreciation, etc.).</p>} />
          </div>

          <Card className="border-border/50 bg-muted/30">
            <CardContent className="p-4 space-y-3">
              <p className="text-sm font-medium text-foreground">📝 Exemple 3 : Théorème des gendarmes</p>
              <p className="text-sm text-muted-foreground">
                On veut étudier la convergence de uₙ = (n² + 3n) / (2n² + 1).
              </p>
            </CardContent>
          </Card>
          <div className="space-y-1">
            <ExampleStep step={1} title="Dominante" content={<p className="text-muted-foreground">Pour n grand, n² domine. On divise par n² : uₙ = (1 + 3/n) / (2 + 1/n²).</p>} />
            <ExampleStep step={2} title="Construire les gendarmes" content={<p className="text-muted-foreground">On pose aₙ = 1/3 et bₙ = 1 (on peut montrer que 1/3 ≤ uₙ ≤ 1 pour n suffisamment grand).</p>} />
            <ExampleStep step={3} title="Vérifier les limites" content={<p className="text-muted-foreground">lim aₙ = 1/3 ? Non, recalculons : lim uₙ = lim (1 + 3/n)/(2 + 1/n²) = 1/2.</p>} />
            <ExampleStep step={4} title="Conclusion" isLast content={<p className="text-muted-foreground">Par le théorème des gendarmes, <strong className="text-foreground">lim uₙ = 1/2</strong>.</p>} />
          </div>
        </div>
      ),
    },

    // ═══════════════════════════════════════════
    // 12. ⚠️ ERREURS FRÉQUENTES
    // ═══════════════════════════════════════════
    {
      id: "errors",
      type: "common-mistakes",
      title: "Erreurs fréquentes",
      icon: "⚠️",
      content: (
        <div className="space-y-3">
          {[
            { mistake: "Confondre suite et suite convergente", fix: "Toute suite croissante n'est pas convergente. Ex : uₙ = n diverge." },
            { mistake: "Relier les points d'une suite", fix: "Les suites sont des applications discrètes. On ne relie PAS les points sur un graphique." },
            { mistake: "Calculer la limite sans vérifier la convergence", fix: "Toujours vérifier d'abord si la suite est bornée et monotone, ou utiliser le théorème des gendarmes." },
            { mistake: "Confondre arithmétique et géométrique", fix: "Arithmétique : on AJOUTE la raison. Géométrique : on MULTIPLIE par la raison." },
            { mistake: "Oublier les conditions de convergence", fix: "Une suite géométrique ne converge que si |q| < 1. Si q = −1, elle oscille." },
            { mistake: "Confondre la borne supérieure et la limite", fix: "La borne supérieure est la plus petite majorante. La limite est la valeur vers laquelle tend la suite." },
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

    // ═══════════════════════════════════════════
    // 13. 🧠 MÉTHODES À RETENIR
    // ═══════════════════════════════════════════
    {
      id: "methods",
      type: "methods",
      title: "Méthodes à retenir",
      icon: "🧠",
      content: (
        <div className="space-y-4">
          <MethodCard
            number={1}
            title="Identifier le type de suite"
            steps={[
              "Calculer les premiers termes u₀, u₁, u₂, u₃",
              "Vérifier si uₙ₊₁ − uₙ est constant → arithmétique",
              "Vérifier si uₙ₊₁ / uₙ est constant → géométrique",
              "Sinon, chercher un mode de génération explicite",
            ]}
          />
          <MethodCard
            number={2}
            title="Étudier la convergence"
            steps={[
              "Vérifier si la suite est croissante ou décroissante",
              "Vérifier si elle est bornée",
              "Si croissante et majorée → converge (borne supérieure)",
              "Sinon, utiliser le théorème des gendarmes",
              "Pour les suites géométriques : vérifier |q| < 1",
            ]}
          />
          <MethodCard
            number={3}
            title="Appliquer le théorème des gendarmes"
            steps={[
              "Majorer uₙ par une suite (bₙ) dont on connaît la limite",
              "Minorer uₙ par une suite (aₙ) dont on connaît la limite",
              "Vérifier que lim aₙ = lim bₙ = ℓ",
              "Conclure : lim uₙ = ℓ",
            ]}
          />
        </div>
      ),
    },

    // ═══════════════════════════════════════════
    // 14. 📋 RÉSUMÉ COMPLET
    // ═══════════════════════════════════════════
    {
      id: "summary",
      type: "summary",
      title: "Résumé complet",
      icon: "📋",
      content: (
        <Card className="border-border/50 bg-muted/30">
          <CardContent className="p-5 space-y-4">
            <h4 className="text-xs font-bold text-foreground uppercase tracking-wide">Les essentiels</h4>
            <div className="grid gap-3 sm:grid-cols-2">
              <div className="rounded-lg bg-card border border-border/30 p-3 space-y-1">
                <p className="text-xs font-bold text-primary">Suite arithmétique</p>
                <code className="text-[10px]">uₙ = u₀ + n × r</code>
                <p className="text-[10px] text-muted-foreground">Convergente si r = 0</p>
              </div>
              <div className="rounded-lg bg-card border border-border/30 p-3 space-y-1">
                <p className="text-xs font-bold text-emerald-600">Suite géométrique</p>
                <code className="text-[10px]">uₙ = u₀ × qⁿ</code>
                <p className="text-[10px] text-muted-foreground">Convergente si |q| &lt; 1</p>
              </div>
              <div className="rounded-lg bg-card border border-border/30 p-3 space-y-1">
                <p className="text-xs font-bold text-amber-600">Théorème des gendarmes</p>
                <p className="text-[10px] text-muted-foreground">aₙ ≤ uₙ ≤ bₙ et lim aₙ = lim bₙ ⟹ lim uₙ</p>
              </div>
              <div className="rounded-lg bg-card border border-border/30 p-3 space-y-1">
                <p className="text-xs font-bold text-red-600">Borne supérieure</p>
                <p className="text-[10px] text-muted-foreground">Croissante + majorée ⟹ convergente</p>
              </div>
            </div>
            <ul className="text-sm text-muted-foreground space-y-1">
              <li>• Suite = application de ℕ dans ℝ</li>
              <li>• Deux modes : explicite (uₙ = f(n)) ou récurrent (uₙ₊₁ = f(uₙ))</li>
              <li>• Convergence = tend vers une limite finie</li>
              <li>• Croissante ≠ convergente (besoin d&apos;être majorée)</li>
              <li>• L&apos;exponentielle croît plus vite que toute puissance</li>
            </ul>
          </CardContent>
        </Card>
      ),
    },

    // ═══════════════════════════════════════════
    // 15. 📝 FICHE DE RÉVISION
    // ═══════════════════════════════════════════
    {
      id: "revision-sheet",
      type: "formulas",
      title: "Fiche de révision",
      icon: "📝",
      content: (
        <div className="space-y-4">
          <FormulaCard
            title="Fiche de révision — Suites numériques"
            formulas={[
              { name: "Arithmétique", expression: "uₙ = u₀ + nr", description: "Convergente ⟺ r = 0" },
              { name: "Géométrique", expression: "uₙ = u₀qⁿ", description: "Convergente ⟺ |q| < 1" },
              { name: "Somme arith.", expression: "Sₙ = n(u₀+uₙ)/2", description: "" },
              { name: "Somme géom.", expression: "Sₙ = u₀(1−qⁿ)/(1−q)", description: "q ≠ 1" },
              { name: "Gendarmes", expression: "aₙ≤uₙ≤bₙ, lim aₙ=lim bₙ=ℓ ⟹ lim uₙ=ℓ", description: "" },
              { name: "Borne sup.", expression: "Croissante + majorée ⟹ converge", description: "" },
              { name: "Fibonacci", expression: "uₙ₊₂=uₙ₊₁+uₙ, φ=(1+√5)/2", description: "" },
            ]}
          />
          <div className="rounded-xl bg-primary/[0.03] border border-primary/15 p-4 text-xs text-muted-foreground space-y-1">
            <p><strong className="text-foreground">À retenir absolument :</strong></p>
            <p>• Croissante ≠ convergente</p>
            <p>• Bornée ≠ convergente</p>
            <p>• Croissante + majorée = convergente</p>
            <p>• |q| &lt; 1 ⟹ qⁿ → 0</p>
            <p>• aⁿ croît plus vite que nᵃ</p>
          </div>
        </div>
      ),
    },

    // ═══════════════════════════════════════════
    // BONUS: Prof IA et Dessine-moi
    // ═══════════════════════════════════════════
    {
      id: "ask-ai",
      type: "ask-ai",
      title: "Demander au Prof IA",
      icon: "🤖",
      content: <ProfessionalAITutor subject="Mathématiques — Suites numériques" subjectKey="math" />,
    },
    {
      id: "draw-me",
      type: "draw-me",
      title: "Dessine-moi",
      icon: "✏️",
      content: (
        <DrawMePanel
          subject="math"
          options={[
            { label: "Suite arithmétique", icon: "📈", description: "Progression linéaire", variant: "pente" },
            { label: "Suite géométrique", icon: "📊", description: "Convergence ou divergence", variant: "parabole" },
            { label: "Suite de Fibonacci", icon: "🐚", description: "La suite dorée", variant: "comparaison" },
          ]}
        />
      ),
    },
  ];
}
