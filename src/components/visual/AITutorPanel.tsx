"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Bot, Send, Sparkles } from "lucide-react";

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

  const handleSend = () => {
    if (!message.trim()) return;
    setLoading(true);
    // Simulate AI response for V1
    setTimeout(() => {
      setResponse(
        `En tant que professeur IA, je peux t'expliquer "${message}" en détail. Cette fonctionnalité sera bientôt disponible avec une IA réelle. Pour le moment, explore les cours et visualisations interactives ci-dessus ! 🎓`
      );
      setLoading(false);
    }, 1000);
  };

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
            <span>🤖 Demander au Prof IA</span>
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
                <span className="animate-pulse">Réflexion...</span>
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
