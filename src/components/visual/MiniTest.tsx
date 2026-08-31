"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface MiniTestQuestion {
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

interface MiniTestProps {
  questions: MiniTestQuestion[];
}

export function MiniTest({ questions }: MiniTestProps) {
  const [answers, setAnswers] = useState<Record<number, number | null>>({});
  const [showResults, setShowResults] = useState(false);

  const handleAnswer = (qIndex: number, oIndex: number) => {
    if (showResults) return;
    setAnswers((prev) => ({ ...prev, [qIndex]: oIndex }));
  };

  const allAnswered = questions.every((_, i) => answers[i] !== undefined);
  const score = showResults
    ? questions.filter((q, i) => answers[i] === q.correctIndex).length
    : 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Card className="border-border/50 bg-card overflow-hidden">
        <CardHeader className="bg-primary/[0.03] border-b border-border/30">
          <CardTitle className="text-base font-semibold flex items-center gap-2">
            <span className="text-lg">🧪</span> Mini-test
            <Badge variant="secondary" className="ml-auto text-xs">
              {questions.length} questions
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent className="p-5 space-y-6">
          {questions.map((q, qIndex) => (
            <div key={qIndex} className="space-y-3">
              <p className="text-sm font-medium text-foreground">
                <span className="text-muted-foreground mr-1">
                  Q{qIndex + 1}.
                </span>
                {q.question}
              </p>
              <div className="grid gap-2">
                {q.options.map((option, oIndex) => {
                  const isSelected = answers[qIndex] === oIndex;
                  const isCorrect = oIndex === q.correctIndex;
                  const showCorrect = showResults && isCorrect;
                  const showWrong =
                    showResults && isSelected && !isCorrect;

                  return (
                    <button
                      key={oIndex}
                      onClick={() => handleAnswer(qIndex, oIndex)}
                      disabled={showResults}
                      className={`text-left text-sm rounded-lg border px-4 py-2.5 transition-all ${
                        showCorrect
                          ? "border-emerald-300 bg-emerald-50 text-emerald-700 dark:border-emerald-700 dark:bg-emerald-950/30 dark:text-emerald-300"
                          : showWrong
                            ? "border-red-300 bg-red-50 text-red-700 dark:border-red-700 dark:bg-red-950/30 dark:text-red-300"
                            : isSelected
                              ? "border-primary bg-primary/5 text-foreground"
                              : "border-border/50 bg-background hover:border-primary/30 hover:bg-primary/[0.02] text-foreground/80"
                      }`}
                    >
                      <span className="font-mono text-xs mr-2 text-muted-foreground">
                        {String.fromCharCode(65 + oIndex)}.
                      </span>
                      {option}
                    </button>
                  );
                })}
              </div>
              <AnimatePresence>
                {showResults && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    className="rounded-lg bg-muted/50 p-3 text-xs text-muted-foreground leading-relaxed"
                  >
                    💡 {q.explanation}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}

          <div className="flex items-center justify-between pt-2 border-t border-border/30">
            {showResults && (
              <Badge
                variant={score === questions.length ? "default" : "secondary"}
              >
                Score: {score}/{questions.length}
              </Badge>
            )}
            <Button
              onClick={() => {
                if (!showResults && allAnswered) {
                  setShowResults(true);
                } else if (showResults) {
                  setAnswers({});
                  setShowResults(false);
                }
              }}
              disabled={!showResults && !allAnswered}
              variant={showResults ? "outline" : "default"}
              className="ml-auto text-sm"
            >
              {showResults ? "Recommencer" : "Vérifier mes réponses"}
            </Button>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
