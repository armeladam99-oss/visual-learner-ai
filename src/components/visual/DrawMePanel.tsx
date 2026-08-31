"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Pencil, X } from "lucide-react";
import { VisualRenderer } from "./VisualRenderer";

interface DrawOption {
  label: string;
  icon: string;
  description: string;
  variant: string;
}

interface DrawMePanelProps {
  options: DrawOption[];
  subject: "math" | "physics" | "chemistry";
}

export function DrawMePanel({ options, subject }: DrawMePanelProps) {
  const [selected, setSelected] = useState<number | null>(null);

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <Card className="border-accent/20 bg-accent/[0.03] overflow-hidden">
        <CardHeader className="pb-3">
          <CardTitle className="text-base font-semibold flex items-center gap-2">
            <Pencil className="size-4 text-accent" />
            <span>✏️ Dessine-moi</span>
          </CardTitle>
          <p className="text-xs text-muted-foreground">
            Choisis une visualisation et l&apos;IA la crée pour toi.
          </p>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {options.map((opt, i) => (
              <Button
                key={i}
                variant={selected === i ? "default" : "outline"}
                className={`justify-start gap-2 h-auto py-3 text-left ${
                  selected === i ? "" : "border-border/50"
                }`}
                onClick={() => setSelected(selected === i ? null : i)}
              >
                <span className="text-lg">{opt.icon}</span>
                <div>
                  <p className="text-xs font-medium">{opt.label}</p>
                  <p className="text-[10px] text-muted-foreground mt-0.5">
                    {opt.description}
                  </p>
                </div>
              </Button>
            ))}
          </div>

          <AnimatePresence mode="wait">
            {selected !== null && (
              <motion.div
                key={selected}
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.3 }}
                className="overflow-hidden"
              >
                <div className="relative rounded-xl border border-border/30 bg-background p-4 mt-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="absolute top-2 right-2 h-7 w-7 p-0"
                    onClick={() => setSelected(null)}
                  >
                    <X className="size-3.5" />
                  </Button>
                  <VisualRenderer
                    variant={options[selected].variant}
                    subject={subject}
                  />
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </CardContent>
      </Card>
    </motion.div>
  );
}
