"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  FlaskConical,
  Send,
  Brain,
  Loader2,
  Atom,
  Camera,
  ArrowDown,
  Sparkles,
} from "lucide-react";
import { useAction } from "convex/react";
import { api } from "@/convex/_generated/api";
import {
  processMessage,
  createInitialContext,
  buildGeminiMessages,
  getSystemPrompt,
  type AIMode,
  type AIContext,
  type Message,
} from "@/lib/ai-engine";
import { parseVizRequest, isModificationRequest, parseModification, generateExplanation } from "@/lib/viz-parser";
import type { VizRequest } from "@/lib/viz-types";
import { FunctionPlot2D } from "@/components/visual/FunctionPlot2D";
import { Scene3DViewer } from "@/components/visual/Scene3DViewer";
import { PhysicsSimulation } from "@/components/visual/PhysicsSimulation";
import { ScientificDiagram } from "@/components/visual/ScientificDiagram";

// ═══════════════════════════════════════════════════════════════
// 💬 INDICATEUR DE MODE
// ═══════════════════════════════════════════════════════════════

function ModeIndicator({ mode }: { mode: AIMode }) {
  const config = {
    general: { icon: "💬", label: "Discussion", color: "text-slate-400" },
    education: { icon: "🎓", label: "Éducation", color: "text-blue-400" },
    lab: { icon: "🧪", label: "Laboratoire", color: "text-cyan-400" },
    image: { icon: "📷", label: "Image", color: "text-purple-400" },
    exercise: { icon: "🧮", label: "Exercice", color: "text-amber-400" },
  }[mode];

  return (
    <span className={`text-[10px] px-2 py-0.5 rounded-full border border-slate-700 ${config.color}`}>
      {config.icon} {config.label}
    </span>
  );
}

// ═══════════════════════════════════════════════════════════════
// 📊 ZONE DE VISUALISATION
// ═══════════════════════════════════════════════════════════════

function VisualizationZone({
  viz,
  explanation,
  onModify,
}: {
  viz: VizRequest | null;
  explanation: string;
  onModify: (msg: string) => void;
}) {
  if (!viz) return null;

  const renderVisualization = () => {
    switch (viz.type) {
      case "function-2d":
      case "multi-function-2d":
      case "parametric-2d":
      case "polar-2d":
        return <FunctionPlot2D viz={viz} />;
      case "surface-3d":
      case "molecule-3d":
      case "vector-3d":
      case "solid-3d":
      case "pendulum-3d":
      case "spring-3d":
        return <Scene3DViewer viz={viz} />;
      case "projectile-sim":
      case "chute-libre-sim":
      case "pendulum-sim":
      case "onde-sim":
      case "circuit-rc-sim":
      case "dosage-sim":
        return <PhysicsSimulation viz={viz} />;
      case "diagram-circuit":
      case "diagram-forces":
      case "diagram-optique":
      case "diagram-cellule":
        return <ScientificDiagram viz={viz} />;
      default:
        return null;
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      className="space-y-4"
    >
      {renderVisualization()}
      {explanation && (
        <Card className="border-slate-700/50 bg-slate-900/50">
          <CardContent className="p-4">
            <div className="text-sm leading-relaxed text-slate-300 whitespace-pre-line">
              {explanation.split("**").map((part, j) =>
                j % 2 === 1 ? (
                  <strong key={j} className="text-white">
                    {part}
                  </strong>
                ) : (
                  <span key={j}>{part}</span>
                )
              )}
            </div>
          </CardContent>
        </Card>
      )}
    </motion.div>
  );
}

// ═══════════════════════════════════════════════════════════════
// 💬 BULLE DE MESSAGE
// ═══════════════════════════════════════════════════════════════

function MessageBubble({ msg }: { msg: Message }) {
  const isUser = msg.role === "user";
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className={`flex ${isUser ? "justify-end" : "justify-start"}`}
    >
      <div
        className={`max-w-[85%] rounded-2xl px-4 py-3 ${
          isUser
            ? "bg-cyan-600 text-white rounded-br-md"
            : "bg-slate-800 border border-slate-700 text-slate-200 rounded-bl-md"
        }`}
      >
        {!isUser && (
          <div className="flex items-center gap-1.5 mb-2">
            <Brain className="size-3 text-cyan-400" />
            <span className="text-[10px] font-semibold text-cyan-400">Prof IA</span>
          </div>
        )}
        <div className="text-sm leading-relaxed whitespace-pre-line">
          {msg.content.split("**").map((part, j) =>
            j % 2 === 1 ? (
              <strong key={j} className="text-white">
                {part}
              </strong>
            ) : (
              <span key={j}>{part}</span>
            )
          )}
        </div>
      </div>
    </motion.div>
  );
}

// ═══════════════════════════════════════════════════════════════
// 🧪 PAGE PRINCIPALE — LABO IA
// ═══════════════════════════════════════════════════════════════

export default function LaboPage() {
  const [ctx, setCtx] = useState<AIContext>(createInitialContext());
  const [input, setInput] = useState("");
  const [currentViz, setCurrentViz] = useState<VizRequest | null>(null);
  const [vizExplanation, setVizExplanation] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [learningMode, setLearningMode] = useState<"explain" | "help">("explain");
  const [showWelcome, setShowWelcome] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const vizEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [ctx.conversationHistory]);

  useEffect(() => {
    if (currentViz) {
      vizEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [currentViz]);

  const chatAction = useAction(api.aiChat.chat);

  // ═══════════════════════════════════════════════════════════
  // ENVOI DE MESSAGE
  // ═══════════════════════════════════════════════════════════

  const handleSend = useCallback(
    async (text?: string) => {
      const query = text || input.trim();
      if (!query || isLoading) return;

      setShowWelcome(false);

      const userMsg: Message = {
        role: "user",
        content: query,
        timestamp: new Date(),
      };

      setCtx((prev) => ({
        ...prev,
        conversationHistory: [...prev.conversationHistory, userMsg],
      }));
      setInput("");
      setIsLoading(true);

      // ─── STEP 1: Check for local experiment/hint triggers ───
      const localResult = processMessage(query, ctx);
      const lower = query.toLowerCase();

      const isExperimentTrigger = !!localResult.experiment;
      const isHintMode =
        ctx.currentExercise &&
        ctx.learningMode === "help" &&
        (lower.includes("indice") ||
          lower.includes("hint") ||
          lower.includes("aide") ||
          lower.includes("comprends") ||
          lower.includes("suivant"));

      if (isHintMode) {
        const assistantMsg: Message = {
          role: "assistant",
          content: localResult.response,
          timestamp: new Date(),
          hints: localResult.hints,
        };
        setCtx((prev) => ({
          ...prev,
          conversationHistory: [...prev.conversationHistory, assistantMsg],
          learningMode: learningMode,
          currentMode: "exercise",
        }));
        setIsLoading(false);
        return;
      }

      if (isExperimentTrigger) {
        const assistantMsg: Message = {
          role: "assistant",
          content: localResult.response,
          timestamp: new Date(),
          experiment: localResult.experiment || undefined,
        };
        setCtx((prev) => ({
          ...prev,
          conversationHistory: [...prev.conversationHistory, assistantMsg],
          learningMode: learningMode,
          currentMode: "lab",
        }));
        if (localResult.experiment) {
          // Map experiment names to viz types
          const experimentToViz: Record<string, VizRequest> = {
            circuit: {
              type: "circuit-rc-sim",
              title: "Circuit RC — Charge / Décharge",
              explanation: "",
              equations: ["τ = R·C", "Uc(t) = U₀(1 − e^(−t/τ))"],
              params: { R: 100, C: 100, U0: 5 },
            },
            dosage: {
              type: "dosage-sim",
              title: "Dosage acido-basique",
              explanation: "",
              equations: ["pH = −log[H₃O⁺]", "C₁V₁ = C₂V₂"],
              params: { acidConc: 0.1, baseConc: 0.1, acidVol: 50, volume: 0 },
            },
            fonction: {
              type: "function-2d",
              title: "Explorateur de fonctions",
              explanation: "",
              equations: [],
              params: { expr: "x^2", xMin: -10, xMax: 10 },
            },
          };
          const viz = experimentToViz[localResult.experiment];
          if (viz) {
            setCurrentViz(viz);
            setVizExplanation(generateExplanation(viz));
          }
        }
        setIsLoading(false);
        return;
      }

      // ─── STEP 2: Try visualization parser first ───
      if (currentViz && isModificationRequest(query)) {
        // Modification of current viz
        const mods = parseModification(query, currentViz);
        const newViz = { ...currentViz, ...mods, params: { ...currentViz.params, ...mods.params } };
        setCurrentViz(newViz);
        setVizExplanation(generateExplanation(newViz));

        const assistantMsg: Message = {
          role: "assistant",
          content: `✅ Visualisation mise à jour !\n\n${generateExplanation(newViz)}`,
          timestamp: new Date(),
        };
        setCtx((prev) => ({
          ...prev,
          conversationHistory: [...prev.conversationHistory, assistantMsg],
          currentMode: "lab",
        }));
        setIsLoading(false);
        return;
      }

      const vizRequest = parseVizRequest(query);
      if (vizRequest) {
        setCurrentViz(vizRequest);
        const explanation = generateExplanation(vizRequest);
        setVizExplanation(explanation);

        const assistantMsg: Message = {
          role: "assistant",
          content: `📊 **${vizRequest.title}** générée !\n\n${explanation}\n\nTu peux modifier la visualisation en tapant tes demandes.`,
          timestamp: new Date(),
        };
        setCtx((prev) => ({
          ...prev,
          conversationHistory: [...prev.conversationHistory, assistantMsg],
          currentMode: "lab",
        }));
        setIsLoading(false);
        return;
      }

      // ─── STEP 3: Everything else → Gemini ───
      try {
        const systemPrompt = getSystemPrompt(ctx);
        const geminiMessages = buildGeminiMessages(ctx.conversationHistory, query);

        const result = await chatAction({
          messages: geminiMessages,
          systemPrompt,
        });

        const assistantMsg: Message = {
          role: "assistant",
          content: result.response,
          timestamp: new Date(),
        };

        setCtx((prev) => ({
          ...prev,
          conversationHistory: [...prev.conversationHistory, assistantMsg],
          learningMode: learningMode,
          currentMode: detectModeFromMessage(query),
        }));
      } catch {
        // Fallback to local engine
        const fallbackMsg: Message = {
          role: "assistant",
          content: localResult.response,
          timestamp: new Date(),
          hints: localResult.hints,
        };
        setCtx((prev) => ({
          ...prev,
          conversationHistory: [...prev.conversationHistory, fallbackMsg],
          learningMode: learningMode,
          currentMode: localResult.mode,
        }));
      } finally {
        setIsLoading(false);
      }
    },
    [input, ctx, learningMode, chatAction, isLoading, currentViz]
  );

  function detectModeFromMessage(msg: string): AIMode {
    const lower = msg.toLowerCase();
    if (lower.includes("photo") || lower.includes("image")) return "image";
    if (lower.includes("exercice") || lower.includes("résous")) return "exercise";
    if (lower.includes("circuit") || lower.includes("dosage") || lower.includes("simulation")) return "lab";
    if (lower.includes("explique") || lower.includes("cours") || lower.includes("dérivée")) return "education";
    return "general";
  }

  const handlePhotoUpload = () => fileInputRef.current?.click();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const photoMsg: Message = {
      role: "user",
      content: `📷 Photo importée : ${file.name}`,
      timestamp: new Date(),
    };

    const analysisMsg: Message = {
      role: "assistant",
      content: `🔎 **Analyse de l'image :**\n\nJ'ai reçu ta photo "${file.name}".\n\nEn V1, je ne peux pas encore analyser les images directement. Cependant, je suis prêt à接收 de vraies images via une API IA multimodale (GPT-4V, Claude Vision, etc.).\n\n**Pour l'instant, tu peux :**\n1. Décrire ce que tu vois dans la photo\n2. Copier le texte de l'exercice\n3. Je résoudrai l'exercice étape par étape\n\nDis-moi ce qu'il y a dans ta photo ! 👇`,
      timestamp: new Date(),
    };

    setCtx((prev) => ({
      ...prev,
      conversationHistory: [...prev.conversationHistory, photoMsg, analysisMsg],
    }));
  };

  const messages = ctx.conversationHistory;

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 flex flex-col">
      {/* ─── HEADER ─── */}
      <header className="sticky top-0 z-50 border-b border-cyan-500/20 bg-slate-900/80 backdrop-blur-xl">
        <div className="mx-auto flex h-14 max-w-5xl items-center justify-between px-4">
          <div className="flex items-center gap-2">
            <FlaskConical className="size-5 text-cyan-400" />
            <span className="text-base font-bold text-white">🧪 Labo IA</span>
            <Badge variant="secondary" className="text-[10px] bg-cyan-500/10 text-cyan-400">
              2e BAC
            </Badge>
            {messages.length > 0 && <ModeIndicator mode={ctx.currentMode} />}
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setLearningMode("explain")}
              className={`px-2.5 py-1 rounded-lg text-[10px] font-medium transition-all ${
                learningMode === "explain"
                  ? "bg-cyan-500/20 text-cyan-300 border border-cyan-500/30"
                  : "bg-slate-800 text-slate-500"
              }`}
            >
              💬 Explique-moi
            </button>
            <button
              onClick={() => setLearningMode("help")}
              className={`px-2.5 py-1 rounded-lg text-[10px] font-medium transition-all ${
                learningMode === "help"
                  ? "bg-amber-500/20 text-amber-300 border border-amber-500/30"
                  : "bg-slate-800 text-slate-500"
              }`}
            >
              💡 Aide-moi
            </button>
          </div>
        </div>
      </header>

      {/* ─── MAIN CONTENT ─── */}
      <div className="flex-1 mx-auto w-full max-w-5xl px-4 py-6 space-y-6">

        {/* Welcome screen */}
        {showWelcome && messages.length === 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center space-y-6 py-12"
          >
            <div className="w-24 h-24 rounded-2xl bg-gradient-to-br from-cyan-500/20 to-violet-500/20 border border-cyan-500/30 mx-auto flex items-center justify-center">
              <Atom className="size-12 text-cyan-400" />
            </div>
            <div className="space-y-2">
              <h2 className="text-3xl font-bold text-white">Laboratoire Scientifique IA</h2>
              <p className="text-sm text-slate-400 max-w-lg mx-auto">
                Décris ce que tu veux voir — graphique, simulation, schéma, modèle 3D — et l&apos;IA génère la visualisation.
              </p>
            </div>

            <div className="grid gap-3 sm:grid-cols-2 max-w-xl mx-auto text-left">
              {[
                { ex: "Trace f(x) = x² − 3x + 2", icon: "📈", desc: "Graphique de fonction" },
                { ex: "Simule un projectile à 20 m/s", icon: "🎯", desc: "Simulation physique" },
                { ex: "Montre-moi une molécule en 3D", icon: "🧊", desc: "Modèle 3D" },
                { ex: "Schéma de forces isolées", icon: "📐", desc: "Diagramme scientifique" },
              ].map((item, i) => (
                <button
                  key={i}
                  onClick={() => handleSend(item.ex)}
                  className="flex items-start gap-3 rounded-xl border border-slate-700/50 bg-slate-800/50 p-3 text-left hover:bg-slate-800 hover:border-slate-600 transition-all"
                >
                  <span className="text-xl mt-0.5">{item.icon}</span>
                  <div>
                    <p className="text-xs font-medium text-white">{item.desc}</p>
                    <p className="text-[10px] text-slate-400 mt-0.5 font-mono">{item.ex}</p>
                  </div>
                </button>
              ))}
            </div>

            <ArrowDown className="size-5 text-slate-600 mx-auto mt-4 animate-bounce" />
          </motion.div>
        )}

        {/* Visualization zone (above chat) */}
        <AnimatePresence mode="wait">
          {currentViz && (
            <VisualizationZone
              viz={currentViz}
              explanation={vizExplanation}
              onModify={handleSend}
            />
          )}
        </AnimatePresence>
        <div ref={vizEndRef} />

        {/* Messages */}
        {messages.length > 0 && (
          <div className="space-y-3">
            {messages.map((msg, i) => (
              <MessageBubble key={i} msg={msg} />
            ))}
            {isLoading && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex gap-3 max-w-3xl"
              >
                <div className="w-7 h-7 rounded-full bg-gradient-to-br from-cyan-500 to-indigo-600 flex items-center justify-center flex-shrink-0">
                  <Atom className="size-3.5 text-white" />
                </div>
                <div className="bg-slate-800 border border-slate-700 rounded-2xl rounded-tl-sm px-4 py-3">
                  <div className="flex items-center gap-2">
                    <Loader2 className="size-3.5 text-cyan-400 animate-spin" />
                    <span className="text-xs text-slate-400">Réflexion...</span>
                  </div>
                </div>
              </motion.div>
            )}
            <div ref={messagesEndRef} />
          </div>
        )}
      </div>

      {/* ─── INPUT BAR ─── */}
      <div className="sticky bottom-0 bg-slate-900/90 backdrop-blur-xl border-t border-slate-800 p-4">
        <div className="max-w-5xl mx-auto flex gap-2">
          <button
            onClick={handlePhotoUpload}
            className="flex-shrink-0 w-10 h-10 rounded-xl bg-slate-800 border border-slate-700 flex items-center justify-center text-slate-400 hover:bg-slate-700 hover:text-cyan-400 transition-all"
          >
            <Camera className="size-4" />
          </button>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleFileChange}
          />
          <Textarea
            placeholder="Décris ce que tu veux voir — graphique, simulation, schéma, modèle 3D..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            className="min-h-[44px] text-sm resize-none bg-slate-800 border-slate-700 text-white placeholder:text-slate-500"
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                handleSend();
              }
            }}
          />
          <Button
            onClick={() => handleSend()}
            disabled={!input.trim() || isLoading}
            className="flex-shrink-0 bg-cyan-600 hover:bg-cyan-500"
          >
            {isLoading ? (
              <Loader2 className="size-4 animate-spin" />
            ) : (
              <Send className="size-4" />
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}
