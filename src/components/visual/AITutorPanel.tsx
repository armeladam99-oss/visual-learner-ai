"use client";

import { useState, useCallback } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Bot, Send, Sparkles, Loader2 } from "lucide-react";
import { useAction } from "convex/react";
import { api } from "@/convex/_generated/api";

const suggestedQuestions = [
  "Explique-moi la dérivée de cette fonction",
  "Montre-moi graphiquement cette courbe",
  "Quelle est l'utilité dans la vie réelle ?",
  "Aide-moi à résoudre l'exercice 3",
];

interface AITutorPanelProps {
  subject: string;
}

export function AITutorPanel({ subject }: AITutorPanelProps) {
  const [message, setMessage] = useState("");
  const [response, setResponse] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [history, setHistory] = useState<{ role: string; content: string }[]>([]);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const groqChatAction = useAction((api as any).aiGroq?.groqChat) as ((args: { messages: { role: string; content: string }[] }) => Promise<{ response: string; error?: string; connected: boolean }>) | null;

  const handleSend = useCallback(async () => {
    if (!message.trim()) return;
    setLoading(true);
    const userMessage = message.trim();
    setMessage("");

    if (groqChatAction) {
      try {
        const newHistory = [
          { role: "user" as const, content: `[SYSTEM] Tu es un professeur IA pour ${subject}. Sois pédagogique, précis, et explique étape par étape en français.` },
          { role: "assistant" as const, content: "Compris, je suis prêt !" },
          ...history,
          { role: "user" as const, content: userMessage },
        ];
        const result = await groqChatAction({ messages: newHistory });
        if (!result.error && result.response) {
          setResponse(result.response);
          setHistory((prev) => [...prev.slice(-10), { role: "user", content: userMessage }, { role: "assistant", content: result.response }]);
          setLoading(false);
          return;
        }
      } catch {
        // Fall through to local response
      }
    }

    // Local fallback
    setResponse(
      `En tant que professeur IA, je peux t'expliquer "${userMessage}" en détail. Pour des réponses plus précises, configure GROQ_API_KEY dans les paramètres. Pour le moment, explore les cours et visualisations interactives ci-dessus ! 🎓`
    );
    setLoading(false);
  }, [message, history, subject, groqChatAction]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <Card className="border-border/50 bg-card overflow-hidden">
        <CardHeader className="bg-gradient-to-r from-primary/[0.05] to-transparent border-b border-border/30">
          <CardTitle className="text-base font-semibold flex items-center gap-2">
            <Bot className="size-5 text-primary" />
            <span>🤖 Demander au Studio ADAM IA</span>
            <Badge variant="secondary" className="ml-auto text-xs">
              {subject}
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent className="p-5 space-y-4">
          <div className="flex flex-wrap gap-2">
            {suggestedQuestions.map((q, i) => (
              <Button
                key={i}
                variant="outline"
                size="sm"
                className="text-xs h-auto py-1.5 border-border/50 hover:border-primary/30"
                onClick={() => setMessage(q)}
              >
                <Sparkles className="size-3 mr-1" />
                {q}
              </Button>
            ))}
          </div>

          <div className="flex gap-2">
            <Textarea
              placeholder="Pose ta question ici..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className="min-h-[80px] text-sm resize-none border-border/50"
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  handleSend();
                }
              }}
            />
          </div>

          <Button
            onClick={handleSend}
            disabled={!message.trim() || loading}
            className="w-full text-sm"
            size="sm"
          >
            {loading ? (
              <span className="flex items-center gap-2">
                <Loader2 className="size-3.5 animate-spin" />
                Réflexion...
              </span>
            ) : (
              <span className="flex items-center gap-2">
                <Send className="size-3.5" />
                Envoyer
              </span>
            )}
          </Button>

          {response && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="rounded-lg bg-muted/50 p-4 text-sm text-muted-foreground leading-relaxed border border-border/30"
            >
              <div className="flex items-start gap-2">
                <Bot className="size-4 text-primary mt-0.5 flex-shrink-0" />
                <p>{response}</p>
              </div>
            </motion.div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
}
