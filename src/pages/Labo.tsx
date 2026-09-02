"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import {
  FlaskConical,
  Send,
  Brain,
  Loader2,
  Atom,
  Camera,
  ArrowDown,
  Sparkles,
  RotateCcw,
  Plus,
  X,
  ChevronRight,
  ChevronLeft,
  BarChart3,
  Globe,
  Zap,
  Dna,
  Cpu,
  Sigma,
  Orbit,
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
import type { LabVizSpec, LabSliderParam, LabWorkspace } from "@/lib/lab/lab-schema";
import { labEngine, addToWorkspace, modifyVizSpec, createWorkspace } from "@/lib/lab/lab-engine";
import { normalizeExpr } from "@/lib/viz-types";
import { FunctionPlot2D } from "@/components/visual/FunctionPlot2D";
import { Scene3DViewer } from "@/components/visual/Scene3DViewer";
import { PhysicsSimulation } from "@/components/visual/PhysicsSimulation";
import { ScientificDiagram } from "@/components/visual/ScientificDiagram";
import { GeometryCanvas } from "@/components/lab/GeometryCanvas";
import { DataChart } from "@/components/lab/DataChart";
import { AstronomyScene } from "@/components/lab/AstronomyScene";
import { CircuitBuilder } from "@/components/lab/CircuitBuilder";
import { MoleculeViewer } from "@/components/lab/MoleculeViewer";
import { LabChooser } from "@/components/lab/LabChooser";
import { getMolecule } from "@/lib/lab/molecule-library";

// ═══════════════════════════════════════════════════════════════
// 🧪 OUTILS DU LABORATOIRE — Sidebar
// ═══════════════════════════════════════════════════════════════

const LAB_TOOLS = [
  { icon: Sigma, label: "Graphique", domain: "math", color: "text-indigo-400" },
  { icon: Cpu, label: "Géométrie", domain: "geometry", color: "text-emerald-400" },
  { icon: Globe, label: "3D", domain: "math", color: "text-violet-400" },
  { icon: Zap, label: "Physique", domain: "physics", color: "text-amber-400" },
  { icon: FlaskConical, label: "Chimie", domain: "chemistry", color: "text-purple-400" },
  { icon: Dna, label: "Biologie", domain: "biology", color: "text-green-400" },
  { icon: Zap, label: "Électricité", domain: "electricity", color: "text-cyan-400" },
  { icon: Orbit, label: "Astronomie", domain: "astronomy", color: "text-violet-400" },
  { icon: BarChart3, label: "Données", domain: "data", color: "text-cyan-400" },
];

function Sidebar({
  tools,
  collapsed,
  onToggle,
  onToolClick,
}: {
  tools: typeof LAB_TOOLS;
  collapsed: boolean;
  onToggle: () => void;
  onToolClick: (domain: string) => void;
}) {
  return (
    <div className={`flex-shrink-0 border-r border-slate-800 bg-slate-900/50 transition-all duration-200 ${collapsed ? "w-12" : "w-40"}`}>
      <div className="flex items-center justify-between p-2 border-b border-slate-800">
        {!collapsed && <span className="text-[10px] font-semibold text-slate-500 uppercase tracking-wide">Outils</span>}
        <Button variant="ghost" size="sm" className="size-6 p-0 text-slate-500 hover:text-white" onClick={onToggle}>
          {collapsed ? <ChevronRight className="size-3" /> : <ChevronLeft className="size-3" />}
        </Button>
      </div>
      <div className="py-1 space-y-0.5">
        {tools.map((tool) => {
          const Icon = tool.icon;
          return (
            <button
              key={tool.label}
              onClick={() => onToolClick(tool.domain)}
              className={`w-full flex items-center gap-2 px-2 py-1.5 text-left hover:bg-slate-800/50 transition-colors group ${collapsed ? "justify-center" : ""}`}
              title={tool.label}
            >
              <Icon className={`size-4 flex-shrink-0 ${tool.color}`} />
              {!collapsed && (
                <span className="text-[11px] text-slate-400 group-hover:text-white transition-colors truncate">
                  {tool.label}
                </span>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════
// 📊 RENDU DE VISUALISATION — Selecteur automatique
// ═══════════════════════════════════════════════════════════════

function VizRenderer({
  spec,
  onParamChange,
}: {
  spec: LabVizSpec;
  onParamChange?: (key: string, value: number) => void;
}) {
  const vizRequest = {
    type: spec.type as never,
    title: spec.title,
    explanation: spec.description,
    equations: spec.equations,
    params: spec.params as Record<string, never>,
  };

  switch (spec.domain) {
    case "math":
      if (spec.type === "function-plot" || spec.type === "multi-function-plot" || spec.type === "derivative-plot") {
        return <FunctionPlot2D viz={vizRequest} />;
      }
      if (spec.type === "surface-3d" || spec.type === "curve-3d" || spec.type === "vector-field-3d") {
        return <Scene3DViewer viz={vizRequest} />;
      }
      return <FunctionPlot2D viz={vizRequest} />;

    case "physics":
      return <PhysicsSimulation viz={vizRequest} />;

    case "chemistry":
      if (spec.type === "molecule-3d") {
        const molKey = (spec.params.molecule as string) || "H2O";
        const molecules = spec.params.molecules as string[] | undefined;
        if (molecules && molecules.length > 0) {
          return (
            <div className="grid grid-cols-2 gap-4">
              {molecules.map((mol: string) => {
                const data = getMolecule(mol);
                return data ? <MoleculeViewer key={mol} molecule={data} title={data.name} /> : <div key={mol} className="text-slate-500 text-sm">Molécule {mol} non trouvée</div>;
              })}
            </div>
          );
        }
        const data = getMolecule(molKey);
        if (data) return <MoleculeViewer molecule={data} title={data.name} />;
        return <Scene3DViewer viz={vizRequest} />;
      }
      return <ScientificDiagram viz={vizRequest} />;

    case "biology":
      return <ScientificDiagram viz={vizRequest} />;

    case "geometry":
      return <GeometryCanvas spec={spec} />;

    case "astronomy":
      return <AstronomyScene spec={spec} />;

    case "electricity":
      if (spec.type === "circuit-rc") {
        return <CircuitBuilder spec={spec} onParamChange={onParamChange} />;
      }
      return <ScientificDiagram viz={vizRequest} />;

    case "data":
      return <DataChart spec={spec} />;

    default:
      if (spec.type.includes("3d")) return <Scene3DViewer viz={vizRequest} />;
      if (spec.type.includes("sim")) return <PhysicsSimulation viz={vizRequest} />;
      return <FunctionPlot2D viz={vizRequest} />;
  }
}

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
// 💬 BULLE DE MESSAGE
// ═══════════════════════════════════════════════════════════════

function MessageBubble({ msg }: { msg: Message }) {
  const isUser = msg.role === "user";
  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
      className={`flex ${isUser ? "justify-end" : "justify-start"}`}>
      <div className={`max-w-[85%] rounded-2xl px-4 py-3 ${
        isUser ? "bg-cyan-600 text-white rounded-br-md" : "bg-slate-800 border border-slate-700 text-slate-200 rounded-bl-md"
      }`}>
        {!isUser && (
          <div className="flex items-center gap-1.5 mb-2">
            <Brain className="size-3 text-cyan-400" />
            <span className="text-[10px] font-semibold text-cyan-400">Prof IA</span>
          </div>
        )}
        <div className="text-sm leading-relaxed whitespace-pre-line">
          {msg.content.split("**").map((part, j) =>
            j % 2 === 1 ? <strong key={j} className="text-white">{part}</strong> : <span key={j}>{part}</span>
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
  const [workspace, setWorkspace] = useState<LabWorkspace>(createWorkspace());
  const [isLoading, setIsLoading] = useState(false);
  const [showWelcome, setShowWelcome] = useState(true);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [currentExplanation, setCurrentExplanation] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [ctx.conversationHistory]);

  const chatAction = useAction(api.aiChat.chat);

  // ═══════════════════════════════════════════════════════════
  // ENVOI DE MESSAGE
  // ═══════════════════════════════════════════════════════════

  const handleSend = useCallback(async (text?: string) => {
    const query = text || input.trim();
    if (!query || isLoading) return;

    setShowWelcome(false);

    const userMsg: Message = { role: "user", content: query, timestamp: new Date() };
    setCtx((prev) => ({ ...prev, conversationHistory: [...prev.conversationHistory, userMsg] }));
    setInput("");
    setIsLoading(true);

    // ─── STEP 1: Try the lab engine ───
    const labResult = labEngine(query);

    // Handle modification requests
    if (labResult.error === "MODIFICATION_REQUEST" && workspace.visualizations.length > 0) {
      const lower = query.toLowerCase();
      const activeViz = workspace.visualizations.find((v) => v.id === workspace.activeVizId)
        || workspace.visualizations[workspace.visualizations.length - 1];

      if (activeViz) {
        // Add function
        const addMatch = lower.match(/ajoute?\s+(?:la\s+)?(?:courbe|fonction)\s+(.+?)(?:\s+au|\s+sur|\s*$)/i);
        if (addMatch && (activeViz.type === "function-plot" || activeViz.type === "multi-function-plot" || activeViz.type === "derivative-plot")) {
          const newExpr = normalizeExpr(addMatch[1]);
          const prevFuncs = (activeViz.params.functions as string[]) || [(activeViz.params as Record<string, string>).expr];
          const newParams = {
            ...activeViz.params,
            functions: [...prevFuncs, newExpr],
            labels: [...((activeViz.params.labels as string[]) || ["f(x)"]), `h(x)`],
            colors: [...((activeViz.params.colors as string[]) || ["#6366f1"]), "#10b981"],
          };
          setWorkspace((prev) => ({
            ...prev,
            visualizations: prev.visualizations.map((v) =>
              v.id === activeViz.id ? { ...v, type: "multi-function-plot" as const, params: newParams, title: `${prevFuncs.length + 1} courbes` } : v
            ),
          }));
          setCurrentExplanation(`**Ajout de :** ${newExpr}`);
          const assistantMsg: Message = { role: "assistant", content: `📊 Courbe **${newExpr}** ajoutée !`, timestamp: new Date() };
          setCtx((prev) => ({ ...prev, conversationHistory: [...prev.conversationHistory, assistantMsg], currentMode: "lab" }));
          setIsLoading(false);
          return;
        }

        // Change range
        const rangeMatch = lower.match(/(?:intervalle|plage)\s+(?:à\s*\[?)?(-?\d+)\s*(?:,|\s*(?:et|à))\s*(-?\d+)/i);
        if (rangeMatch) {
          const newMin = parseInt(rangeMatch[1]);
          const newMax = parseInt(rangeMatch[2]);
          setWorkspace((prev) => ({
            ...prev,
            visualizations: prev.visualizations.map((v) =>
              v.id === activeViz.id ? { ...v, params: { ...v.params, xMin: newMin, xMax: newMax } } : v
            ),
          }));
          setCurrentExplanation(`**Intervalle modifié :** [${newMin}, ${newMax}]`);
          const assistantMsg: Message = { role: "assistant", content: `📊 Intervalle modifié à [${newMin}, ${newMax}]`, timestamp: new Date() };
          setCtx((prev) => ({ ...prev, conversationHistory: [...prev.conversationHistory, assistantMsg], currentMode: "lab" }));
          setIsLoading(false);
          return;
        }

        // Change resistance
        const resMatch = lower.match(/(?:r[ée]sistance|\bR\b)\s+(?:à\s*)?(\d+)\s*(kΩ|Ω|ohm)/i);
        if (resMatch && activeViz.type === "circuit-rc") {
          const newR = resMatch[2].toLowerCase().startsWith("k") ? parseFloat(resMatch[1]) * 1000 : parseFloat(resMatch[1]);
          setWorkspace((prev) => ({
            ...prev,
            visualizations: prev.visualizations.map((v) =>
              v.id === activeViz.id ? { ...v, params: { ...v.params, R: newR } } : v
            ),
          }));
          setCurrentExplanation(`**Résistance modifiée :** R = ${newR} Ω`);
          const assistantMsg: Message = { role: "assistant", content: `⚡ Résistance modifiée à ${newR} Ω`, timestamp: new Date() };
          setCtx((prev) => ({ ...prev, conversationHistory: [...prev.conversationHistory, assistantMsg], currentMode: "lab" }));
          setIsLoading(false);
          return;
        }

        // Generic modification fallback
        const assistantMsg: Message = { role: "assistant", content: `📊 Modifiée ! Décris ce que tu veux changer.`, timestamp: new Date() };
        setCtx((prev) => ({ ...prev, conversationHistory: [...prev.conversationHistory, assistantMsg], currentMode: "lab" }));
        setIsLoading(false);
        return;
      }
    }

    if (labResult.success && labResult.specs.length > 0) {
      // Visualisation generated
      setWorkspace((prev) => addToWorkspace(prev, labResult));
      setCurrentExplanation(labResult.explanation);

      const assistantMsg: Message = {
        role: "assistant",
        content: `📊 **${labResult.specs[0].title}** générée !\n\n${labResult.explanation}`,
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

    // ─── STEP 2: Check for local experiment triggers ───
    const localResult = processMessage(query, ctx);
    const lower = query.toLowerCase();

    const isHintMode = ctx.currentExercise && ctx.learningMode === "help" &&
      (lower.includes("indice") || lower.includes("hint") || lower.includes("aide") || lower.includes("suivant"));

    if (isHintMode) {
      const assistantMsg: Message = { role: "assistant", content: localResult.response, timestamp: new Date(), hints: localResult.hints };
      setCtx((prev) => ({ ...prev, conversationHistory: [...prev.conversationHistory, assistantMsg], currentMode: "exercise" }));
      setIsLoading(false);
      return;
    }

    if (localResult.experiment) {
      const assistantMsg: Message = { role: "assistant", content: localResult.response, timestamp: new Date(), experiment: localResult.experiment };
      setCtx((prev) => ({ ...prev, conversationHistory: [...prev.conversationHistory, assistantMsg], currentMode: "lab" }));
      setIsLoading(false);
      return;
    }

    // ─── STEP 3: Everything else → Gemini ───
    try {
      const systemPrompt = getSystemPrompt(ctx);
      const geminiMessages = buildGeminiMessages(ctx.conversationHistory, query);
      const result = await chatAction({ messages: geminiMessages, systemPrompt });

      const assistantMsg: Message = { role: "assistant", content: result.response, timestamp: new Date() };
      setCtx((prev) => ({ ...prev, conversationHistory: [...prev.conversationHistory, assistantMsg], currentMode: detectModeFromMessage(query) }));
    } catch {
      const fallbackMsg: Message = { role: "assistant", content: localResult.response, timestamp: new Date(), hints: localResult.hints };
      setCtx((prev) => ({ ...prev, conversationHistory: [...prev.conversationHistory, fallbackMsg], currentMode: localResult.mode }));
    } finally {
      setIsLoading(false);
    }
  }, [input, ctx, isLoading, chatAction]);

  function detectModeFromMessage(msg: string): AIMode {
    const lower = msg.toLowerCase();
    if (lower.includes("photo") || lower.includes("image")) return "image";
    if (lower.includes("exercice") || lower.includes("résous")) return "exercise";
    if (lower.includes("explique") || lower.includes("cours")) return "education";
    return "general";
  }

  const handlePhotoUpload = () => fileInputRef.current?.click();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const photoMsg: Message = { role: "user", content: `📷 Photo importée : ${file.name}`, timestamp: new Date() };
    const analysisMsg: Message = {
      role: "assistant",
      content: `🔎 **Analyse de l'image :**\n\nJ'ai reçu ta photo "${file.name}".\n\n**Pour l'instant, tu peux :**\n1. Décrire ce que tu vois\n2. Copier le texte de l'exercice\n3. Je résoudrai étape par étape\n\nDis-moi ce qu'il y a dans ta photo ! 👇`,
      timestamp: new Date(),
    };
    setCtx((prev) => ({ ...prev, conversationHistory: [...prev.conversationHistory, photoMsg, analysisMsg] }));
  };

  const handleToolClick = (domain: string) => {
    // Show a prompt for the user to describe what they want
    setInput("");
    // Auto-focus could go here
  };

  const handleSliderChange = (vizId: string, key: string, value: number) => {
    setWorkspace((prev) => {
      const viz = prev.visualizations.find((v) => v.id === vizId);
      if (!viz) return prev;
      return {
        ...prev,
        visualizations: prev.visualizations.map((v) =>
          v.id === vizId ? { ...v, params: { ...v.params, [key]: value } } : v
        ),
        sliders: prev.sliders.map((s) => s.id === key ? { ...s, value } : s),
      };
    });
  };

  const handleClearWorkspace = () => {
    setWorkspace(createWorkspace());
    setCurrentExplanation("");
  };

  const messages = ctx.conversationHistory;
  const activeViz = workspace.visualizations.find((v) => v.id === workspace.activeVizId) || workspace.visualizations[workspace.visualizations.length - 1];

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 flex flex-col">
      {/* ─── HEADER ─── */}
      <header className="sticky top-0 z-50 border-b border-cyan-500/20 bg-slate-900/80 backdrop-blur-xl">
        <div className="flex h-14 items-center justify-between px-4">
          <div className="flex items-center gap-2">
            <FlaskConical className="size-5 text-cyan-400" />
            <span className="text-base font-bold text-white">🧪 Labo IA</span>
            <Badge variant="secondary" className="text-[10px] bg-cyan-500/10 text-cyan-400">2e BAC</Badge>
            {messages.length > 0 && <ModeIndicator mode={ctx.currentMode} />}
          </div>
          <div className="flex items-center gap-2">
            {workspace.visualizations.length > 0 && (
              <Button variant="ghost" size="sm" className="text-[10px] text-slate-400 hover:text-white"
                onClick={handleClearWorkspace}>
                <RotateCcw className="size-3 mr-1" /> Nouveau
              </Button>
            )}
            {workspace.visualizations.length > 0 && (
              <Badge variant="secondary" className="text-[10px] bg-slate-700 text-slate-300">
                {workspace.visualizations.length} viz
              </Badge>
            )}
          </div>
        </div>
      </header>

      {/* ─── MAIN LAYOUT: Sidebar + Workspace + Chat ─── */}
      <div className="flex-1 flex overflow-hidden">
        {/* Sidebar */}
        <Sidebar
          tools={LAB_TOOLS}
          collapsed={sidebarCollapsed}
          onToggle={() => setSidebarCollapsed(!sidebarCollapsed)}
          onToolClick={handleToolClick}
        />

        {/* Center: Workspace + Chat */}
        <div className="flex-1 flex flex-col overflow-hidden">
          {/* Workspace area */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">

            {/* Welcome screen */}
            {showWelcome && messages.length === 0 && workspace.visualizations.length === 0 && (
              <LabChooser
                onSelect={(prompt) => { setShowWelcome(false); handleSend(prompt); }}
                onAIOpen={() => { setShowWelcome(false); }}
              />
            )}

            {/* Active visualization */}
            <AnimatePresence mode="wait">
              {activeViz && (
                <motion.div key={activeViz.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
                  className="space-y-3">
                  <VizRenderer spec={activeViz} onParamChange={(key, val) => handleSliderChange(activeViz.id, key, val)} />

                  {/* Sliders for this visualization */}
                  {workspace.sliders.length > 0 && (
                    <Card className="border-slate-700/50 bg-slate-900/50">
                      <CardContent className="p-3 space-y-2">
                        <p className="text-[10px] font-semibold text-slate-500 uppercase tracking-wide">Paramètres</p>
                        {workspace.sliders.map((s) => (
                          <div key={s.id} className="flex items-center gap-2">
                            <span className="text-[10px] text-slate-400 w-12">{s.symbol}</span>
                            <Slider
                              min={s.min} max={s.max} step={s.step}
                              value={[s.value]}
                              onValueChange={([v]) => handleSliderChange(activeViz.id, s.id, v)}
                              className="flex-1 [&_[role=slider]]:bg-cyan-500"
                            />
                            <Input
                              type="number"
                              value={s.value}
                              onChange={(e) => handleSliderChange(activeViz.id, s.id, parseFloat(e.target.value) ?? s.value)}
                              className="w-16 h-6 text-[10px] bg-slate-800 border-slate-700 text-white text-center"
                            />
                            <span className="text-[10px] text-slate-500 w-8">{s.unit}</span>
                          </div>
                        ))}
                      </CardContent>
                    </Card>
                  )}

                  {/* Explanation */}
                  {currentExplanation && (
                    <Card className="border-slate-700/50 bg-slate-900/50">
                      <CardContent className="p-4">
                        <div className="text-sm leading-relaxed text-slate-300 whitespace-pre-line">
                          {currentExplanation.split("**").map((part, j) =>
                            j % 2 === 1 ? <strong key={j} className="text-white">{part}</strong> : <span key={j}>{part}</span>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  )}

                  {/* History thumbnails */}
                  {workspace.visualizations.length > 1 && (
                    <div className="flex gap-2 overflow-x-auto py-1">
                      {workspace.visualizations.map((viz) => (
                        <button key={viz.id}
                          onClick={() => setWorkspace((prev) => ({ ...prev, activeVizId: viz.id }))}
                          className={`flex-shrink-0 px-3 py-1.5 rounded-lg text-[10px] border transition-all ${
                            viz.id === workspace.activeVizId
                              ? "border-cyan-500/50 bg-cyan-500/10 text-cyan-400"
                              : "border-slate-700 bg-slate-800/50 text-slate-400 hover:bg-slate-800"
                          }`}>
                          {viz.title.slice(0, 20)}{viz.title.length > 20 ? "…" : ""}
                        </button>
                      ))}
                    </div>
                  )}
                </motion.div>
              )}
            </AnimatePresence>

            {/* Messages */}
            {messages.length > 0 && (
              <div className="space-y-3">
                {messages.map((msg, i) => <MessageBubble key={i} msg={msg} />)}
                {isLoading && (
                  <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="flex gap-3 max-w-3xl">
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
          <div className="border-t border-slate-800 bg-slate-900/90 backdrop-blur-xl p-4">
            <div className="flex gap-2">
              <button onClick={handlePhotoUpload}
                className="flex-shrink-0 w-10 h-10 rounded-xl bg-slate-800 border border-slate-700 flex items-center justify-center text-slate-400 hover:bg-slate-700 hover:text-cyan-400 transition-all">
                <Camera className="size-4" />
              </button>
              <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={handleFileChange} />
              <Textarea
                placeholder="Décris ce que tu veux voir — graphique, simulation, schéma, modèle 3D..."
                value={input}
                onChange={(e) => setInput(e.target.value)}
                className="min-h-[44px] text-sm resize-none bg-slate-800 border-slate-700 text-white placeholder:text-slate-500"
                onKeyDown={(e) => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); handleSend(); } }}
              />
              <Button onClick={() => handleSend()} disabled={!input.trim() || isLoading}
                className="flex-shrink-0 bg-cyan-600 hover:bg-cyan-500">
                {isLoading ? <Loader2 className="size-4 animate-spin" /> : <Send className="size-4" />}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
