"use client";

import { motion } from "framer-motion";
import { useNavigate } from "react-router";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  GraduationCap,
  LineChart,
  Pencil,
  Brain,
  ArrowRight,
  Check,
  Sparkles,
  BookOpen,
  Target,
} from "lucide-react";

const features = [
  {
    icon: <LineChart className="size-5" />,
    title: "Graphiques interactifs",
    description:
      "Modifie les paramètres et observe instantanément l'effet sur les courbes. Apprends en expérimentant.",
  },
  {
    icon: <Brain className="size-5" />,
    title: "Cours structurés",
    description:
      "18 sections pédagogiques par leçon : du « pourquoi étudier » aux exercices progressifs.",
  },
  {
    icon: <Pencil className="size-5" />,
    title: "Dessine-moi",
    description:
      "Demande une visualisation et l'IA Studio ADAM la crée pour toi : courbes, schémas, diagrammes.",
  },
  {
    icon: <Sparkles className="size-5" />,
    title: "Studio ADAM IA",
    description:
      "Pose tes questions et obtiens des explications personnalisées avec des visuels adaptés.",
  },
  {
    icon: <Target className="size-5" />,
    title: "Mini-tests",
    description:
      "Vérifie ta compréhension à chaque étape avec des quiz interactifs et corrections détaillées.",
  },
  {
    icon: <BookOpen className="size-5" />,
    title: "Maths, Physique, Chimie",
    description:
      "Des cours complets pour les spécialités scientifiques du bac, avec des applications réelles.",
  },
];

const steps = [
  {
    number: "01",
    title: "Choisis ta matière",
    description: "Sélectionne Mathématiques, Physique-Chimie ou Chimie.",
  },
  {
    number: "02",
    title: "Explore le cours",
    description: "Suivi les 18 sections : introduction, cours, visualisations, exercices.",
  },
  {
    number: "03",
    title: "Expérimente",
    description: "Modifie les paramètres des graphiques, teste ta compréhension.",
  },
];

export default function Landing() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <header className="sticky top-0 z-50 border-b border-border/30 bg-background/80 backdrop-blur-xl">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6">
          <div className="flex items-center gap-2.5">
            <GraduationCap className="size-6 text-primary" />
            <span className="text-lg font-bold text-foreground tracking-tight">
              Studio ADAM
            </span>
          </div>
          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              size="sm"
              className="text-muted-foreground"
              onClick={() => navigate("/auth")}
            >
              Connexion
            </Button>
            <Button
              size="sm"
              className="gap-1.5"
              onClick={() => navigate("/auth")}
            >
              Commencer
              <ArrowRight className="size-3.5" />
            </Button>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="relative overflow-hidden">
        {/* Subtle grid pattern */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(99,102,241,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(99,102,241,0.03)_1px,transparent_1px)] bg-[size:40px_40px]" />

        <div className="relative mx-auto max-w-6xl px-4 sm:px-6 pt-16 sm:pt-24 pb-16 sm:pb-20">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            className="text-center max-w-3xl mx-auto space-y-6"
          >
            <Badge
              variant="secondary"
              className="text-xs gap-1.5 px-3 py-1"
            >
              <Sparkles className="size-3" />
              Cours visuels et interactifs pour le bac
            </Badge>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-foreground tracking-tight leading-[1.1]">
              Comprends les maths,{" "}
              <br className="hidden sm:block" />
              <span className="text-primary">vois les concepts</span>
            </h1>

            <p className="text-base sm:text-lg text-muted-foreground max-w-xl mx-auto leading-relaxed">
              Des cours de maths, physique et chimie enrichis de graphiques
              interactifs, de visualisations dynamiques et d&apos;un professeur
              IA qui dessine pour toi.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
              <Button
                size="lg"
                className="gap-2 px-6"
                onClick={() => navigate("/auth")}
              >
                Commencer à réviser
                <ArrowRight className="size-4" />
              </Button>
              <Button
                variant="outline"
                size="lg"
                className="gap-2 px-6"
                onClick={() => {
                  document.getElementById("features")?.scrollIntoView({ behavior: "smooth" });
                }}
              >
                Découvrir les fonctionnalités
              </Button>
            </div>
          </motion.div>

          {/* Floating graph preview */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.3 }}
            className="mt-12 sm:mt-16 mx-auto max-w-3xl"
          >
            <div className="relative rounded-2xl border border-border/50 bg-card shadow-2xl shadow-primary/5 overflow-hidden">
              {/* Mock browser chrome */}
              <div className="flex items-center gap-2 px-4 py-3 border-b border-border/30 bg-muted/30">
                <div className="flex gap-1.5">
                  <div className="w-3 h-3 rounded-full bg-red-300" />
                  <div className="w-3 h-3 rounded-full bg-amber-300" />
                  <div className="w-3 h-3 rounded-full bg-emerald-300" />
                </div>
                <div className="flex-1 text-center text-xs text-muted-foreground font-mono">
                  profvisuel.app/lesson/polynomes-2nd-degre
                </div>
              </div>

              {/* Mock content */}
              <div className="p-6 sm:p-8 space-y-6">
                <div className="flex items-center gap-3">
                  <span className="text-3xl">📐</span>
                  <div>
                    <h3 className="text-lg font-bold text-foreground">
                      Polynômes du 2nd degré
                    </h3>
                    <p className="text-xs text-muted-foreground">
                      Mathématiques · 45 min · Intermédiaire
                    </p>
                  </div>
                </div>

                {/* Mock interactive graph */}
                <div className="rounded-xl bg-muted/30 border border-border/30 p-4">
                  <div className="flex items-center justify-between mb-3">
                    <p className="text-xs font-semibold text-foreground">
                      📊 Explore la parabole f(x) = ax² + bx + c
                    </p>
                  </div>
                  <div className="h-48 relative">
                    {/* SVG parabola */}
                    <svg
                      viewBox="0 0 400 180"
                      className="w-full h-full"
                      preserveAspectRatio="xMidYMid meet"
                    >
                      {/* Grid */}
                      <line x1="200" y1="0" x2="200" y2="180" stroke="oklch(0.85 0.01 250)" strokeWidth="1" />
                      <line x1="0" y1="90" x2="400" y2="90" stroke="oklch(0.85 0.01 250)" strokeWidth="1" />
                      {[50, 100, 150, 200, 250, 300, 350].map((x) => (
                        <line key={`gx-${x}`} x1={x} y1="0" x2={x} y2="180" stroke="oklch(0.9 0.01 250)" strokeWidth="0.5" strokeDasharray="2,4" />
                      ))}
                      {[30, 60, 120, 150].map((y) => (
                        <line key={`gy-${y}`} x1="0" y1={y} x2="400" y2={y} stroke="oklch(0.9 0.01 250)" strokeWidth="0.5" strokeDasharray="2,4" />
                      ))}
                      {/* Parabola path */}
                      <motion.path
                        d="M 40,170 Q 80,150 120,110 Q 160,50 200,20 Q 240,50 280,110 Q 320,150 360,170"
                        fill="none"
                        stroke="#4f46e5"
                        strokeWidth="2.5"
                        strokeLinecap="round"
                        initial={{ pathLength: 0 }}
                        animate={{ pathLength: 1 }}
                        transition={{ duration: 1.5, delay: 0.5 }}
                      />
                      {/* Vertex point */}
                      <motion.circle
                        cx="200"
                        cy="20"
                        r="5"
                        fill="#4f46e5"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 1.5 }}
                      />
                      <motion.text
                        x="210"
                        y="15"
                        fill="oklch(0.42 0.16 265)"
                        fontSize="10"
                        fontWeight="600"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 1.5 }}
                      >
                        S (sommet)
                      </motion.text>
                    </svg>
                  </div>
                  {/* Mock sliders */}
                  <div className="flex gap-6 mt-4">
                    {[
                      { label: "a", value: "1.0" },
                      { label: "b", value: "-2.0" },
                      { label: "c", value: "1.0" },
                    ].map((p) => (
                      <div key={p.label} className="flex items-center gap-2 flex-1">
                        <span className="text-xs font-medium text-muted-foreground">
                          {p.label}
                        </span>
                        <div className="flex-1 h-1.5 bg-muted rounded-full overflow-hidden">
                          <div
                            className="h-full bg-primary rounded-full"
                            style={{ width: "50%" }}
                          />
                        </div>
                        <span className="text-[10px] font-mono text-primary bg-primary/5 px-1.5 py-0.5 rounded">
                          {p.value}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Mock explainer */}
                <div className="rounded-lg border border-primary/15 bg-primary/[0.03] p-4 space-y-2">
                  <p className="text-xs font-semibold text-foreground flex items-center gap-1.5">
                    <span>🔎</span> Comment lire ce graphique ?
                  </p>
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    L&apos;axe horizontal représente x, l&apos;axe vertical f(x).
                    Le sommet S est le point le plus bas de la parabole (a &gt; 0).
                    La courbe est symétrique par rapport à la verticale passant par S.
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="py-16 sm:py-24">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-center space-y-3 mb-12"
          >
            <Badge variant="secondary" className="text-xs">
              Fonctionnalités
            </Badge>
            <h2 className="text-2xl sm:text-3xl font-bold text-foreground tracking-tight">
              Tout ce qu&apos;il faut pour réviser efficacement
            </h2>
            <p className="text-sm text-muted-foreground max-w-lg mx-auto">
              Pas juste du texte : des expériences d&apos;apprentissage visuelles
              et interactives.
            </p>
          </motion.div>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {features.map((feature, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.05 }}
              >
                <Card className="border-border/50 bg-card hover:border-primary/20 hover:shadow-md transition-all h-full">
                  <CardContent className="p-5 space-y-3">
                    <div className="w-10 h-10 rounded-lg bg-primary/10 text-primary flex items-center justify-center">
                      {feature.icon}
                    </div>
                    <h3 className="text-sm font-semibold text-foreground">
                      {feature.title}
                    </h3>
                    <p className="text-xs text-muted-foreground leading-relaxed">
                      {feature.description}
                    </p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="py-16 sm:py-24 bg-muted/30">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-center space-y-3 mb-12"
          >
            <Badge variant="secondary" className="text-xs">
              Comment ça marche
            </Badge>
            <h2 className="text-2xl sm:text-3xl font-bold text-foreground tracking-tight">
              En 3 étapes, commence à réviser
            </h2>
          </motion.div>

          <div className="grid gap-6 sm:grid-cols-3">
            {steps.map((step, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.1 }}
                className="relative"
              >
                <div className="text-center space-y-3">
                  <div className="w-12 h-12 rounded-xl bg-primary text-primary-foreground text-lg font-bold flex items-center justify-center mx-auto">
                    {step.number}
                  </div>
                  <h3 className="text-base font-semibold text-foreground">
                    {step.title}
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    {step.description}
                  </p>
                </div>
                {i < steps.length - 1 && (
                  <div className="hidden sm:block absolute top-6 left-[calc(50%+40px)] w-[calc(100%-80px)] border-t border-dashed border-border" />
                )}
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Subjects */}
      <section className="py-16 sm:py-24">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-center space-y-3 mb-12"
          >
            <Badge variant="secondary" className="text-xs">
              Matières
            </Badge>
            <h2 className="text-2xl sm:text-3xl font-bold text-foreground tracking-tight">
              Des cours pour chaque spécialité scientifique
            </h2>
          </motion.div>

          <div className="grid gap-4 sm:grid-cols-3">
            {[
              {
                icon: "📐",
                title: "Mathématiques",
                desc: "Polynômes, fonctions, dérivées, suites, vecteurs...",
                color: "from-blue-500 to-indigo-600",
                chapters: ["Polynômes du 2nd degré"],
              },
              {
                icon: "🚀",
                title: "Physique-Chimie",
                desc: "Cinématique, dynamique, ondes, électricité...",
                color: "from-emerald-500 to-teal-600",
                chapters: ["Cinématique"],
              },
              {
                icon: "⚗️",
                title: "Chimie",
                desc: "Solutions, dosages, cinétique, équilibre...",
                color: "from-amber-500 to-orange-600",
                chapters: ["Solutions et concentrations"],
              },
            ].map((subject, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.1 }}
              >
                <Card className="border-border/50 bg-card hover:shadow-lg transition-all h-full">
                  <CardContent className="p-6 space-y-4">
                    <div
                      className={`w-12 h-12 rounded-xl bg-gradient-to-br ${subject.color} flex items-center justify-center text-2xl`}
                    >
                      {subject.icon}
                    </div>
                    <div>
                      <h3 className="text-base font-semibold text-foreground">
                        {subject.title}
                      </h3>
                      <p className="text-xs text-muted-foreground mt-1">
                        {subject.desc}
                      </p>
                    </div>
                    <div className="space-y-1.5">
                      {subject.chapters.map((ch, ci) => (
                        <div
                          key={ci}
                          className="flex items-center gap-2 text-xs text-muted-foreground"
                        >
                          <Check className="size-3 text-primary" />
                          {ch}
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 sm:py-24 bg-muted/30">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="mx-auto max-w-2xl px-4 sm:px-6 text-center space-y-6"
        >
          <h2 className="text-2xl sm:text-3xl font-bold text-foreground tracking-tight">
            Prêt à réviser autrement ?
          </h2>
          <p className="text-sm text-muted-foreground max-w-md mx-auto">
            Rejoins Studio ADAM et transforme ta façon d&apos;apprendre les
            sciences avec des cours visuels et interactifs.
          </p>
          <Button
            size="lg"
            className="gap-2 px-8"
            onClick={() => navigate("/auth")}
          >
            Créer mon compte gratuit
            <ArrowRight className="size-4" />
          </Button>
        </motion.div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border/30 py-8">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <GraduationCap className="size-4 text-primary" />
            <span className="text-sm font-semibold text-foreground">
              Studio ADAM
            </span>
          </div>
          <p className="text-xs text-muted-foreground">
            Plateforme d&apos;apprentissage visuel pour les spécialités
            scientifiques du bac.
          </p>
        </div>
      </footer>
    </div>
  );
}
