"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Pencil } from "lucide-react";

interface DrawOption {
  label: string;
  icon: string;
  description: string;
}

interface DrawMePanelProps {
  options: DrawOption[];
  onDraw: (index: number) => void;
}

export function DrawMePanel({ options, onDraw }: DrawMePanelProps) {
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
            Demandez une représentation visuelle et l&apos;IA la créera
            pour vous.
          </p>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {options.map((opt, i) => (
              <Button
                key={i}
                variant={selected === i ? "default" : "outline"}
                className={`justify-start gap-2 h-auto py-3 text-left ${
                  selected === i ? "" : "border-border/50"
                }`}
                onClick={() => {
                  setSelected(i);
                  onDraw(i);
                }}
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
        </CardContent>
      </Card>
    </motion.div>
  );
}
