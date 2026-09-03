"use client";

import { useState, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Loader2, Sparkles, ArrowLeft, Wand2, RefreshCw, GraduationCap } from "lucide-react";
import { useAction } from "convex/react";
import { api } from "@/convex/_generated/api";
import { AILessonViewer, type AILessonData } from "@/components/visual/AILessonViewer";

const SUBJECTS = ["Mathématiques", "Physique", "Chimie"];

const LEVELS = [
  "2BAC Sciences Mathématiques B",
  "2BAC Sciences Physiques",
  "1BAC Sciences Expérimentales",
];

const EXAMPLES: { label: string; subject: string }[] = [
  { label: "Structures Algébriques (Groupes, Anneaux, Corps)", subject: "Mathématiques" },
  { label: "Arithmétique dans Z", subject: "Mathématiques" },
  { label: "Étude de fonctions : exponentielles et logarithmes", subject: "Mathématiques" },
  { label: "Suites numériques et raisonnement par récurrence", subject: "Mathématiques" },
  { label: "Oscillations mécaniques libres", subject: "Physique" },
  { label: "Mouvement dans un champ de pesanteur uniforme", subject: "Physique" },
  { label: "Circuits RL, RLC et oscillations électriques", subject: "Physique" },
  { label: "Piles et électrolyse", subject: "Chimie" },
  { label: "Suivi temporel d’une réaction chimique", subject: "Chimie" },
  { label: "Dosages acido-basiques", subject: "Chimie" },
];

const ERROR_MESSAGES: Record<string, string> = {
  NO_API_KEY:
    "Aucune clé IA configurée. Ajoute GROQ_API_KEY (gratuit, recommandé) ou GOOGLE_API_KEY dans les paramètres de ton projet pour générer des cours.",
  INVALID_KEY:
    "Clé IA invalide ou expirée. Vérifie GROQ_API_KEY / GOOGLE_API_KEY dans les paramètres.",
  RATE_LIMITED:
    "⏳ Limite de requêtes atteinte (API IA). Attends quelques secondes puis réessaie.",
  EMPTY_RESPONSE: "L’IA n’a pas renvoyé de contenu exploitable. Réessaie ou reformule le titre.",
};

export default function CoursIA() {
  const navigate = useNavigate();
  const [title, setTitle] = useState("");
  const [subject, setSubject] = useState("Mathématiques");
  const [level, setLevel] = useState(LEVELS[0]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [provider, setProvider] = useState<string | null>(null);
  const [lesson, setLesson] = useState<AILessonData | null>(null);
  const [apiConnected, setApiConnected] = useState<boolean | null>(null);

  const generateLessonAction = useAction(api.aiLesson.generateLesson);
  const statusAction = useAction(api.aiLesson.apiStatus);

  useEffect(() => {
    statusAction().then((s) => setApiConnected(s.connected)).catch(() => setApiConnected(false));
  }, [statusAction]);

  const handleGenerate = useCallback(async () => {
    const trimmed = title.trim();
    if (!trimmed || loading) return;
    setLoading(true);
    setError(null);
    setLesson(null);
    setProvider(null);

    try {
      const result = await generateLessonAction({ title: trimmed, subject, level });
      if (result.error) {
        setError(ERROR_MESSAGES[result.error] || `Erreur IA : ${result.error}`);
      } else if (result.lesson) {
        const data = result.lesson as unknown as AILessonData;
        if (data && data.summary) {
          setLesson(data);
          setProvider(result.provider);
          window.scrollTo({ top: 0, behavior: "smooth" });
        } else {
          setError("La réponse de l’IA n’était pas exploitable. Réessaie.");
        }
      } else {
        setError("Aucune réponse de l’IA. Vérifie la configuration de la clé API.");
      }
    } catch {
      setError("Erreur réseau pendant la génération. Réessaie dans un instant.");
    } finally {
      setLoading(false);
    }
  }, [title, subject, level, loading, generateLessonAction]);

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border/50 bg-background sticky top-0 z-40">
        <div className="mx-auto flex h-14 max-w-4xl items-center justify-between px-4 sm:px-6">
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="sm" className="gap-1.5 text-muted-foreground" onClick={() => navigate("/cours")}>
              <ArrowLeft className="size-4" />
              <span className="hidden sm:inline">Cours</span>
            </Button>
            <GraduationCap className="size-5 text-primary" />
            <span className="text-base font-bold text-foreground">🎓 Générer un cours</span>
          </div>
          <span className={`text-[10px] px-2.5 py-1 rounded-full border ${
            apiConnected === true
              ? "border-emerald-500/30 text-emerald-500"
              : apiConnected === false
                ? "border-amber-500/30 text-amber-500"
                : "border-border text-muted-foreground"
          }`}>
            {apiConnected === true ? "🟢 IA connectée" : apiConnected === false ? "🔴 IA non configurée" : "…"}
          </span>
        </div>
      </header>

      <div className="mx-auto max-w-4xl px-4 sm:px-6 pt-6 pb-28 space-y-6">
        {/* Formulaire */}
        <Card className="border-border/50 bg-card overflow-hidden">
          <CardContent className="p-5 sm:p-6 space-y-4">
            <div>
              <h1 className="text-lg font-bold text-foreground flex items-center gap-2">
                <Wand2 className="size-5 text-primary" />
                Générateur de cours complet (2BAC SM)
              </h1>
              <p className="text-xs text-muted-foreground mt-1">
                Choisis un chapitre du programme marocain : l’IA génère un résumé avec les
                définitions et formules en LaTeX, puis une zone « ⚡ Espace Défi / Exercices Difficiles »
                de niveau Examen National / Concours.
              </p>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                Chapitre / sujet d’étude
              </label>
              <Input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Ex : Structures Algébriques, Arithmétique dans Z, Oscillations mécaniques…"
                className="text-sm"
                onKeyDown={(e) => { if (e.key === "Enter") handleGenerate(); }}
              />
            </div>

            <div className="space-y-2">
              <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                Matière
              </label>
              <div className="flex flex-wrap gap-2">
                {SUBJECTS.map((s) => (
                  <button
                    key={s}
                    onClick={() => setSubject(s)}
                    className={`px-3.5 py-1.5 rounded-full text-xs font-medium transition-all ${
                      subject === s
                        ? "bg-primary text-primary-foreground shadow-sm"
                        : "bg-muted/60 text-muted-foreground hover:bg-muted"
                    }`}
                  >
                    {s === "Mathématiques" ? "📐" : s === "Physique" ? "⚛️" : "🧪"} {s}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                Niveau / filière
              </label>
              <div className="flex flex-wrap gap-2">
                {LEVELS.map((l) => (
                  <button
                    key={l}
                    onClick={() => setLevel(l)}
                    className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
                      level === l
                        ? "bg-primary text-primary-foreground shadow-sm"
                        : "bg-muted/60 text-muted-foreground hover:bg-muted"
                    }`}
                  >
                    {l}
                  </button>
                ))}
              </div>
            </div>

            <Button
              onClick={handleGenerate}
              disabled={!title.trim() || loading}
              className="w-full text-sm py-5"
              size="lg"
            >
              {loading ? (
                <span className="flex items-center gap-2">
                  <Loader2 className="size-4 animate-spin" />
                  Génération du cours en cours ({level})…
                </span>
              ) : (
                <span className="flex items-center gap-2">
                  <Sparkles className="size-4" />
                  Générer le cours avec l’IA
                </span>
              )}
            </Button>

            {error && (
              <motion.div
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                className="rounded-xl border border-amber-500/30 bg-amber-500/10 px-4 py-3 text-sm text-amber-200"
              >
                ⚠️ {error}
              </motion.div>
            )}

            {provider && !loading && (
              <p className="text-[10px] text-muted-foreground text-right">
                Généré via {provider === "groq" ? "Groq (Llama 3.3)" : "Google Gemini"} — vérifie les
                valeurs importantes dans ton cours avant un examen.
              </p>
            )}
          </CardContent>
        </Card>

        {/* Exemples rapides */}
        {!lesson && !loading && (
          <div className="space-y-2">
            <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">
              Idées de chapitres
            </p>
            <div className="flex flex-wrap gap-2">
              {EXAMPLES.map((ex) => (
                <button
                  key={ex.label}
                  onClick={() => { setTitle(ex.label.replace(/ \(.*\)$/, "")); setSubject(ex.subject); }}
                  className="text-[11px] px-3 py-1.5 rounded-full border border-border/60 bg-muted/40 text-muted-foreground hover:border-primary/40 hover:text-foreground transition-colors"
                >
                  {ex.label.length > 46 ? `${ex.label.slice(0, 46)}…` : ex.label}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Résultat */}
        {loading && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-3">
            {[0, 1, 2].map((i) => (
              <div key={i} className="rounded-2xl border border-border/50 bg-card p-6 animate-pulse space-y-3">
                <div className="h-4 w-2/5 rounded bg-muted" />
                <div className="h-3 w-full rounded bg-muted/60" />
                <div className="h-3 w-4/5 rounded bg-muted/60" />
                <div className="h-3 w-3/5 rounded bg-muted/60" />
              </div>
            ))}
          </motion.div>
        )}

        {lesson && !loading && (
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}>
            <div className="flex items-center justify-between mb-3">
              <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
                Votre cours est prêt ✅
              </p>
              <Button
                variant="ghost"
                size="sm"
                className="text-xs gap-1.5 text-muted-foreground"
                onClick={() => { setLesson(null); window.scrollTo({ top: 0, behavior: "smooth" }); }}
              >
                <RefreshCw className="size-3.5" /> Générer un autre cours
              </Button>
            </div>
            <AILessonViewer lesson={lesson} />
          </motion.div>
        )}
      </div>
    </div>
  );
}
